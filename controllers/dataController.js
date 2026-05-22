const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// =========================
// Helpers
// =========================
const parseId = (value) => {
  if (value === undefined || value === null || value === "") return undefined;

  const parsed = Number(value);
  return isNaN(parsed) ? undefined : parsed;
};
const MODELS = {
  categories: prisma.Categories,
  subcategories: prisma.SubCategories,
  countries: prisma.Countries,
  governorates: prisma.Governorates,
  cities: prisma.Cities,
  areas: prisma.Areas,
  compounds: prisma.Compounds,
};

const MODEL_DELEGATES = {
  categories: "Categories",
  subcategories: "SubCategories",
  countries: "Countries",
  governorates: "Governorates",
  cities: "Cities",
  areas: "Areas",
  compounds: "Compounds",
};

const ORDER_BY = [{ order: "asc" }, { id: "asc" }];

const ORDER_SCOPE_FIELDS = {
  categories: ["table_id"],
  subcategories: ["category_id"],
  governorates: ["country_id"],
  cities: ["governorate_id"],
  areas: ["city_id"],
  compounds: ["city_id", "area_id"],
};

const AD_RELATIONS = [
  "vacation_rent_ads",
  "vacation_sale_ads",
  "apartment_rent_ads",
  "apartment_sale_ads",
  "villa_rent_ads",
  "villa_sale_ads",
  "commercial_rent_ads",
  "commercial_sale_ads",
  "buildings_lands_rent_ads",
  "buildings_lands_sale_ads",
];

const ADS_COUNT_SELECT = AD_RELATIONS.reduce((select, relation) => {
  select[relation] = true;
  return select;
}, {});

const getOrderScope = (model, item) => {
  const fields = ORDER_SCOPE_FIELDS[model.toLowerCase()] || [];

  return fields.reduce((where, field) => {
    where[field] = item[field] ?? null;
    return where;
  }, {});
};

const getAdsCount = (item) =>
  AD_RELATIONS.reduce((total, relation) => {
    return total + (item._count?.[relation] || 0);
  }, 0);

// =========================
// CRUD OPERATIONS
// =========================

exports.getTables = async (req, res) => {
  try {
    const tables = await prisma.AllTables.findMany({
      orderBy: ORDER_BY,
      include: {
        _count: {
          select: { categories: true },
        },
      },
    });

    const result = tables.map((table) => ({
      id: table.id,
      name_ar: table.name_ar,
      name_en: table.name_en,
      order: table.order,
      slug: table.slug,
      created_at: table.created_at,
      childsCount: table._count.categories,
    }));

    return res.json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.createItem = async (req, res) => {
  try {
    const { model } = req.params;

    const prismaModel = MODELS[model.toLowerCase()];
    if (!prismaModel) {
      return res.status(400).json({ message: "Invalid model" });
    }

    const data = req.body;

    // 1) create item
    const item = await prismaModel.create({
      data,
    });

    // 2) detect parent
    const parentKey = Object.keys(data).find((k) => k.endsWith("_id"));

    let parent = null;

    if (parentKey && data[parentKey]) {
      // 🔥 FIX: proper mapping (solve missing "s" issue)
      const RELATION_MODEL = {
        governorate_id: "governorates",
        city_id: "cities",
        area_id: "areas",
        country_id: "countries",
        compound_id: "compounds",
        category_id: "categories",
        subcategory_id: "subcategories",
      };

      const parentModel = MODELS[RELATION_MODEL[parentKey]];

      if (parentModel) {
        const parentId = Number(data[parentKey]);

        const parentData = await parentModel.findUnique({
          where: { id: parentId },
          include: {
            _count: true,
          },
        });

        parent = {
          ...parentData,
          childsCount: Object.values(parentData._count || {}).reduce(
            (a, b) => a + b,
            0,
          ),
        };
      }
    }
    const SKIP_COUNT = ["subcategories", "compounds"];

    const itemResponse = SKIP_COUNT.includes(model.toLowerCase())
      ? item
      : {
          ...item,
          childsCount: 0,
        };
    res.json({
      item: itemResponse,
      parent,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.updateItem = async (req, res) => {
  try {
    const { model, id } = req.params;
    const modelKey = model.toLowerCase();

    const prismaModel = MODELS[modelKey];
    if (!prismaModel) {
      return res.status(400).json({ message: "Invalid model" });
    }

    const data = { ...req.body };
    const requestedOrder =
      data.order !== undefined && data.order !== null && data.order !== ""
        ? Number(data.order)
        : undefined;

    if (requestedOrder !== undefined) {
      if (!Number.isInteger(requestedOrder) || requestedOrder < 1) {
        return res.status(400).json({
          message: "order must be a positive integer",
        });
      }

      delete data.order;
    }

    const item = await prisma.$transaction(async (tx) => {
      const txModel = tx[MODEL_DELEGATES[modelKey]];
      const currentItem = await txModel.findUnique({
        where: { id: Number(id) },
      });

      if (!currentItem) {
        throw new Error("Item not found");
      }

      if (requestedOrder === undefined || requestedOrder === currentItem.order) {
        return txModel.update({
          where: { id: Number(id) },
          data:
            requestedOrder === undefined
              ? data
              : { ...data, order: requestedOrder },
        });
      }

      const scopeWhere = getOrderScope(modelKey, currentItem);

      if (requestedOrder < currentItem.order) {
        await txModel.updateMany({
          where: {
            ...scopeWhere,
            id: { not: Number(id) },
            order: {
              gte: requestedOrder,
              lt: currentItem.order,
            },
          },
          data: {
            order: { increment: 1 },
          },
        });
      } else {
        await txModel.updateMany({
          where: {
            ...scopeWhere,
            id: { not: Number(id) },
            order: {
              gt: currentItem.order,
              lte: requestedOrder,
            },
          },
          data: {
            order: { decrement: 1 },
          },
        });
      }

      return txModel.update({
        where: { id: Number(id) },
        data: { ...data, order: requestedOrder },
      });
    });

    // =========================
    // get childsCount like list APIs
    // =========================
    const CHILD_RELATIONS = {
      categories: "subCategories",
      countries: "governorates",
      governorates: "cities",
      cities: "areas",
      areas: "compounds",
    };

    const relationKey = CHILD_RELATIONS[model.toLowerCase()];

    let finalItem = item;

    if (relationKey) {
      const withCount = await prismaModel.findUnique({
        where: { id: Number(id) },
        include: {
          _count: {
            select: {
              [relationKey]: true,
            },
          },
        },
      });

      finalItem = {
        ...item,
        childsCount: withCount?._count?.[relationKey] || 0,
      };
    }

    res.json({
      item: finalItem,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.deleteItem = async (req, res) => {
  try {
    const { model, id } = req.params;

    const prismaModel = MODELS[model.toLowerCase()];
    if (!prismaModel) {
      return res.status(400).json({ message: "Invalid model" });
    }

    // 1) get item first
    const item = await prismaModel.findUnique({
      where: { id: Number(id) },
    });

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // =========================
    // FIX: proper mapping
    // =========================
    const RELATION_MODEL = {
      governorate_id: "governorates",
      city_id: "cities",
      area_id: "areas",
      country_id: "countries",
      compound_id: "compounds",
      category_id: "categories",
      subcategory_id: "subcategories",
    };

    const parentKey = Object.keys(item).find((k) => k.endsWith("_id"));

    let parent = null;

    if (parentKey && item[parentKey]) {
      const parentModel = MODELS[RELATION_MODEL[parentKey]];

      const parentId = Number(item[parentKey]);

      // delete item
      await prismaModel.delete({
        where: { id: Number(id) },
      });

      // 🔥 important safety check
      if (parentModel) {
        const parentData = await parentModel.findUnique({
          where: { id: parentId },
          include: {
            _count: true,
          },
        });

        parent = {
          ...parentData,
          childsCount: Object.values(parentData._count || {}).reduce(
            (a, b) => a + b,
            0,
          ),
        };
      }
    } else {
      // delete without parent
      await prismaModel.delete({
        where: { id: Number(id) },
      });
    }

    res.json({
      message: "Deleted successfully",
      parent,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =========================
// Categories
// =========================
exports.getCategories = async (req, res) => {
  try {
    const categories = await prisma.Categories.findMany({
      orderBy: ORDER_BY,
      include: {
        _count: {
          select: { subCategories: true },
        },
      },
    });

    const result = categories.map((cat) => ({
      ...cat,
      childsCount: cat._count.subCategories,
      _count: undefined,
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSubCategories = async (req, res) => {
  try {
    const categoryId = parseId(req.query.category_id);

    const subCategories = await prisma.SubCategories.findMany({
      where: categoryId !== undefined ? { category_id: categoryId } : {},
      orderBy: ORDER_BY,
    });

    res.json(subCategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =========================
// Countries
// =========================
exports.getCountries = async (req, res) => {
  try {
    const countries = await prisma.Countries.findMany({
      orderBy: ORDER_BY,
      include: {
        _count: {
          select: {
            governorates: true,
            ...ADS_COUNT_SELECT,
          },
        },
      },
    });

    const result = countries.map((country) => ({
      ...country,
      childsCount: country._count.governorates,
      adsCount: getAdsCount(country),
      _count: undefined,
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =========================
// Governorates
// =========================
exports.getGovernorates = async (req, res) => {
  try {
    const countryId = parseId(req.query.country_id);

    const governorates = await prisma.Governorates.findMany({
      where: countryId !== undefined ? { country_id: countryId } : {},
      orderBy: ORDER_BY,
      include: {
        _count: {
          select: {
            cities: true,
            ...ADS_COUNT_SELECT,
          },
        },
      },
    });

    const result = governorates.map((gov) => ({
      ...gov,
      childsCount: gov._count.cities,
      adsCount: getAdsCount(gov),
      _count: undefined,
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =========================
// Cities
// =========================
exports.getCities = async (req, res) => {
  try {
    const governorateId = parseId(req.query.governorate_id);

    const cities = await prisma.Cities.findMany({
      where:
        governorateId !== undefined ? { governorate_id: governorateId } : {},
      orderBy: ORDER_BY,
      include: {
        _count: {
          select: {
            areas: true,
            compounds: true,
            ...ADS_COUNT_SELECT,
          },
        },
      },
    });

    const result = cities.map((city) => ({
      ...city,
      areasCount: city._count.areas,
      compoundsCount: city._count.compounds,
      adsCount: getAdsCount(city),
      _count: undefined,
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =========================
// Areas
// =========================
exports.getAreas = async (req, res) => {
  try {
    const cityId = parseId(req.query.city_id);

    const areas = await prisma.Areas.findMany({
      where: cityId !== undefined ? { city_id: cityId } : {},
      orderBy: ORDER_BY,
      include: {
        _count: {
          select: {
            compounds: true,
            ...ADS_COUNT_SELECT,
          },
        },
        city: {
          select: {
            id: true,
            name_ar: true,
            name_en: true,
          },
        },
      },
    });

    const result = areas.map((area) => ({
      ...area,
      childsCount: area._count.compounds,
      adsCount: getAdsCount(area),
      _count: undefined,
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =========================
// Compounds
// =========================
exports.getCompounds = async (req, res) => {
  try {
    const areaId = parseId(req.query.area_id);
    const cityId = parseId(req.query.city_id);

    let whereCondition = {};

    if (areaId !== undefined) {
      whereCondition.area_id = areaId;
    } else if (cityId !== undefined) {
      whereCondition.city_id = cityId;
    }

    const compounds = await prisma.Compounds.findMany({
      where: whereCondition,
      orderBy: ORDER_BY,
      include: {
        _count: {
          select: ADS_COUNT_SELECT,
        },
        city: {
          select: {
            id: true,
            name_ar: true,
            name_en: true,
          },
        },
        area: {
          select: {
            id: true,
            name_ar: true,
            name_en: true,
          },
        },
      },
    });

    const result = compounds.map((compound) => ({
      id: compound.id,
      name_ar: compound.name_ar,
      name_en: compound.name_en,
      order: compound.order,
      adsCount: getAdsCount(compound),
      city_id: compound.city_id,
      city: compound.city,
      area_id: compound.area_id,
      area: compound.area,
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
