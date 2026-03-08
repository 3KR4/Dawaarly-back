const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// =========================
// Categories
// =========================
exports.getCategories = async (req, res) => {
  try {
    const categories = await prisma.Categories.findMany({
      orderBy: { id: "asc" },
    });

    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =========================
// SubCategories
// =========================
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

// =========================
// Countries
// =========================
exports.getCountries = async (req, res) => {
  try {
    const countries = await prisma.Countries.findMany({
      orderBy: { id: "asc" },
    });

    res.json(countries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =========================
// Governorates
// =========================
exports.getGovernorates = async (req, res) => {
  try {
    const { country_id } = req.query;

    const governorates = await prisma.Governorates.findMany({
      where: country_id ? { country_id: Number(country_id) } : {},
      orderBy: { id: "asc" },
    });

    res.json(governorates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =========================
// Cities
// =========================
exports.getCities = async (req, res) => {
  try {
    const { governorate_id } = req.query;

    const cities = await prisma.Cities.findMany({
      where: governorate_id ? { governorate_id: Number(governorate_id) } : {},
      orderBy: { id: "asc" },
    });

    res.json(cities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =========================
// Areas
// =========================
exports.getAreas = async (req, res) => {
  try {
    const { city_id } = req.query;

    const areas = await prisma.Areas.findMany({
      where: city_id ? { city_id: Number(city_id) } : {},
      orderBy: { id: "asc" },
    });

    res.json(areas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =========================
// Compounds
// =========================
exports.getCompounds = async (req, res) => {
  try {
    const { area_id } = req.query;

    const compounds = await prisma.Compounds.findMany({
      where: area_id ? { area_id: Number(area_id) } : {},
      orderBy: { id: "asc" },
    });

    res.json(compounds);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
