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

// =========================
// Categories
// =========================
exports.getCategories = async (req, res) => {
  try {
    const categories = await prisma.Categories.findMany({
      orderBy: { id: "asc" },
      include: {
        _count: {
          select: { subCategories: true },
        },
      },
    });

    const result = categories.map((cat) => ({
      ...cat,
      subCategories_count: cat._count.subCategories,
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
      orderBy: { id: "asc" },
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
      orderBy: { id: "asc" },
      include: {
        _count: {
          select: { governorates: true },
        },
      },
    });

    const result = countries.map((country) => ({
      ...country,
      governorates_count: country._count.governorates,
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
      orderBy: { id: "asc" },
      include: {
        _count: {
          select: { cities: true },
        },
      },
    });

    const result = governorates.map((gov) => ({
      ...gov,
      cities_count: gov._count.cities,
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
        governorateId !== undefined
          ? { governorate_id: governorateId }
          : {},
      orderBy: { id: "asc" },
      include: {
        _count: {
          select: {
            areas: true,
            compounds: true,
          },
        },
      },
    });

    const result = cities.map((city) => ({
      ...city,
      areas_count: city._count.areas,
      compounds_count: city._count.compounds,
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
      orderBy: { id: "asc" },
      include: {
        _count: {
          select: { compounds: true },
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
      compounds_count: area._count.compounds,
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
      orderBy: { id: "asc" },
      include: {
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