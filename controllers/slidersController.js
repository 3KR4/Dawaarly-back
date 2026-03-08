const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createSlider = async (req, res) => {
  try {
    const { title, description, link } = req.body;

    const slider = await prisma.Sliders.create({
      data: {
        title,
        description,
        link,
      },
    });

    res.json(slider);
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
    const { title, description, link, is_active } = req.body;

    const sliderId = Number(id);

    // التأكد إن السلايدر موجود
    const existingSlider = await prisma.Sliders.findUnique({
      where: { id: sliderId },
    });

    if (!existingSlider) {
      return res.status(404).json({
        message: "Slider not found",
      });
    }

    // تحديث السلايدر
    const updatedSlider = await prisma.Sliders.update({
      where: { id: sliderId },
      data: {
        title,
        description,
        link,
        is_active,
      },
    });

    res.status(200).json(updatedSlider);
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
exports.getSliders = async (req, res) => {
  try {
    const sliders = await prisma.Sliders.findMany({
      where: {
        is_active: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

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
      const sliderImages = images.filter(
        (img) => img.entity_id === slider.id
      );

      return {
        ...slider,
        image: sliderImages[0] || null,
      };
    });

    res.json(formatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};