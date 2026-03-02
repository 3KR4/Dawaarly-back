const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const cloudinary = require("../utils/cloudinary"); // فرضنا ملف الكونفيج

// رفع صور إعلان
exports.uploadAdImages = async (req, res) => {
  try {
    const adId = Number(req.params.id);
    if (!req.files || req.files.length === 0)
      return res.status(400).json({ message: "No files uploaded" });

    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];

      await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: `ads/${adId}`,
            transformation: [
              { fetch_format: "auto" },
              { quality: "auto:good" },
            ],
          },
          async (error, result) => {
            if (error) return reject(error);

            await prisma.AdImage.create({
              data: {
                ad_id: adId,
                public_id: result.public_id,
                secure_url: result.secure_url,
                is_cover: i === 0, // أول صورة كـ cover
                order: i,
              },
            });

            resolve(true);
          },
        );

        uploadStream.end(file.buffer);
      });
    }

    res.status(201).json({ message: "Images uploaded" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
// حذف صورة إعلان
exports.deleteAdImage = async (req, res) => {
  try {
    const imageId = Number(req.params.imageId);

    const image = await prisma.AdImage.findUnique({ where: { id: imageId } });
    if (!image) return res.status(404).json({ message: "Image not found" });

    // حذف من Cloudinary
    await cloudinary.uploader.destroy(image.public_id);

    // حذف من قاعدة البيانات
    await prisma.AdImage.delete({ where: { id: imageId } });

    res.status(200).json({ message: "Image deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
// تعديل صورة (cover أو order)
exports.updateAdImage = async (req, res) => {
  try {
    const imageId = Number(req.params.imageId);
    const { is_cover, order } = req.body;

    const image = await prisma.AdImage.findUnique({ where: { id: imageId } });
    if (!image) return res.status(404).json({ message: "Image not found" });

    // تحديث الـ cover
    if (is_cover) {
      // إزالة cover من باقي الصور لنفس الإعلان
      await prisma.AdImage.updateMany({
        where: { ad_id: image.ad_id },
        data: { is_cover: false },
      });
    }

    // تحديث الصورة نفسها
    await prisma.AdImage.update({
      where: { id: imageId },
      data: {
        is_cover: is_cover ?? image.is_cover,
        order: order ?? image.order,
      },
    });

    res.status(200).json({ message: "Image updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
