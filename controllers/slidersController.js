const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// =========================
// Create Slider
// =========================
exports.createSlider = async (req, res) => {
  try {
    let {
      name_en,
      name_ar,
      description_en,
      description_ar,
      link,
      is_active = true,
    } = req.body;

    // ✅ Validation
    if (!name_en || !name_ar) {
      return res.status(400).json({
        message: "name_en and name_ar are required",
      });
    }

    // ✅ Fix boolean (important for MySQL)
    is_active = is_active === "false" ? false : Boolean(is_active);

    const slider = await prisma.Sliders.create({
      data: {
        name_en,
        name_ar,
        description_en,
        description_ar,
        link,
        is_active,
      },
    });

    res.status(201).json(slider);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// =========================
// Update Slider
// =========================
exports.updateSlider = async (req, res) => {
  try {
    const { id } = req.params;

    let {
      name_en,
      name_ar,
      description_en,
      description_ar,
      link,
      is_active,
    } = req.body;

    const sliderId = Number(id);

    const existing = await prisma.Sliders.findUnique({
      where: { id: sliderId },
    });

    if (!existing) {
      return res.status(404).json({
        message: "Slider not found",
      });
    }

    // ✅ Fix boolean
    if (is_active !== undefined) {
      is_active = is_active === "false" ? false : Boolean(is_active);
    }

    const updated = await prisma.Sliders.update({
      where: { id: sliderId },
      data: {
        ...(name_en !== undefined && { name_en }),
        ...(name_ar !== undefined && { name_ar }),
        ...(description_en !== undefined && { description_en }),
        ...(description_ar !== undefined && { description_ar }),
        ...(link !== undefined && { link }),
        ...(is_active !== undefined && { is_active }),
      },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// =========================
// Delete Slider
// =========================
exports.deleteSlider = async (req, res) => {
  try {
    const { id } = req.params;
    const sliderId = Number(id);

    const existing = await prisma.Sliders.findUnique({
      where: { id: sliderId },
    });

    if (!existing) {
      return res.status(404).json({
        message: "Slider not found",
      });
    }

    await prisma.Sliders.delete({
      where: { id: sliderId },
    });

    res.json({
      message: "Slider deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// =========================
// Get One Slider
// =========================
exports.getOneSlider = async (req, res) => {
  try {
    const { id } = req.params;
    const sliderId = Number(id);

    const slider = await prisma.Sliders.findUnique({
      where: { id: sliderId },
    });

    if (!slider) {
      return res.status(404).json({
        message: "Slider not found",
      });
    }

    const image = await prisma.Images.findFirst({
      where: {
        entity_type: "SLIDER",
        entity_id: slider.id,
      },
      orderBy: {
        order: "asc",
      },
    });

    res.json({
      ...slider,
      image: image || null,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// =========================
// Get Sliders (List)
// =========================
exports.getSliders = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;

    // ✅ حماية pagination
    const pageNumber = Math.max(1, Number(page) || 1);
    const limitNumber = Math.min(50, Math.max(1, Number(limit) || 10));

    const skip = (pageNumber - 1) * limitNumber;

    const where = {
      is_active: true,
    };

    const [sliders, total] = await Promise.all([
      prisma.Sliders.findMany({
        where,
        skip,
        take: limitNumber,
        orderBy: {
          created_at: "desc",
        },
      }),
      prisma.Sliders.count({ where }),
    ]);

    const sliderIds = sliders.map((s) => s.id);

    // ✅ نجيب كل الصور مرة واحدة
    const images = await prisma.Images.findMany({
      where: {
        entity_type: "SLIDER",
        entity_id: {
          in: sliderIds,
        },
      },
      orderBy: {
        order: "asc",
      },
    });

    // ✅ FIX: build map خارج اللوب
    const imagesMap = {};
    images.forEach((img) => {
      if (!imagesMap[img.entity_id]) {
        imagesMap[img.entity_id] = img;
      }
    });

    const formatted = sliders.map((slider) => ({
      ...slider,
      image: imagesMap[slider.id] || null,
    }));

    res.json({
      data: formatted,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};