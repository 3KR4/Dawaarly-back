const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createSlider = async (req, res) => {
  try {
    const { title, description, image, link } = req.body;

    const slider = await prisma.Sliders.create({
      data: {
        title,
        description,
        image,
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

    const slider = await prisma.Sliders.update({
      where: { id: Number(id) },
      data: req.body,
    });

    res.json(slider);
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
      include: {
        images: {
          where: {
            entity_type: "SLIDER", // نوع الكيان
          },
          orderBy: {
            order: "asc", // لو عايز الصور بالترتيب
          },
        },
      },
    });

    // لو تحب نجيب أول صورة فقط لكل slider:
    const formatted = sliders.map((slider) => ({
      ...slider,
      image: slider.images[0] || null, // أول صورة
    }));

    res.json(formatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};