const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createSlider = async (req, res) => {
  try {
    const {
      name_en,
      name_ar,
      description_en,
      description_ar,
      link,
      is_active = true,
    } = req.body;

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
exports.updateSlider = async (req, res) => {
  try {
    const { id } = req.params;

    const {
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

    const updated = await prisma.Sliders.update({
      where: { id: sliderId },
      data: {
        name_en,
        name_ar,
        description_en,
        description_ar,
        link,
        is_active,
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
exports.deleteSlider = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.Sliders.delete({
      where: { id: Number(id) },
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
exports.getOneSlider = async (req, res) => {
  try {
    const { id } = req.params;

    const slider = await prisma.Sliders.findUnique({
      where: { id: Number(id) },
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
exports.getSliders = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

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

    const formatted = sliders.map((slider) => {
      const imagesMap = {};
      images.forEach((img) => {
        if (!imagesMap[img.entity_id]) {
          imagesMap[img.entity_id] = img;
        }
      });

      return {
        ...slider,
        image: imagesMap[slider.id] || null
      };
    });

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
