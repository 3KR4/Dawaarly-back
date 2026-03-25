const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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
      subCategories_count: cat._count.subCategories, // ✅ fix هنا
      _count: undefined,
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSubCategories = async (req, res) => {
  try {
    const { category_id } = req.query;

    const subCategories = await prisma.SubCategories.findMany({
      where: category_id ? { category_id: Number(category_id) } : {},
      orderBy: { id: "asc" },
    });

    res.json(subCategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCountries = async (req, res) => {
  try {
    const countries = await prisma.Countries.findMany({
      orderBy: { id: "asc" },
      include: {
        _count: {
          select: { governorates: true }, // ✅ نفس الاسم في schema
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

exports.getGovernorates = async (req, res) => {
  try {
    const { country_id } = req.query;

    const governorates = await prisma.Governorates.findMany({
      where: country_id ? { country_id: Number(country_id) } : {},
      orderBy: { id: "asc" },
      include: {
        _count: {
          select: { cities: true }, // ✅ صح
        },
      },
    });

    const result = governorates.map((gov) => ({
      ...gov,
      cities_count: gov._count.cities, // ✅ fix هنا
      _count: undefined,
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCities = async (req, res) => {
  try {
    const { governorate_id } = req.query;

    const cities = await prisma.Cities.findMany({
      where: governorate_id ? { governorate_id: Number(governorate_id) } : {},
      orderBy: { id: "asc" },
      include: {
        _count: {
          select: {
            areas: true,
            compounds: true, // ✅ إضافة عدد الكمبوندات المباشرة للمدينة
          },
        },
      },
    });

    const result = cities.map((city) => ({
      ...city,
      areas_count: city._count.areas,
      compounds_count: city._count.compounds, // ✅ عدد الكمبوندات المباشرة
      _count: undefined,
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAreas = async (req, res) => {
  try {
    const { city_id } = req.query;

    const areas = await prisma.Areas.findMany({
      where: city_id ? { city_id: Number(city_id) } : {},
      orderBy: { id: "asc" },
      include: {
        _count: {
          select: { compounds: true },
        },
        city: {
          // ✅ إضافة معلومات المدينة
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

exports.getCompounds = async (req, res) => {
  try {
    const { area_id, city_id } = req.query;

    // بناء شرط where ديناميكي
    let whereCondition = {};

    if (area_id) {
      whereCondition.area_id = Number(area_id);
    } else if (city_id) {
      whereCondition.city_id = Number(city_id);
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

    // تنسيق النتيجة لجعلها أكثر وضوحاً
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