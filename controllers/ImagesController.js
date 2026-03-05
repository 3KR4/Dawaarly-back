const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const cloudinary = require("../utils/cloudinary"); // فرضنا ملف الكونفيج

exports.uploadImages = async (req, res) => {
  try {
    const entityType = req.params.entity_type; // AD, USER, CATEGORY, etc
    const entityId = Number(req.params.entity_id);

    if (!entityType || !entityId)
      return res
        .status(400)
        .json({ message: "entity_type and entity_id are required" });

    if (!req.files || req.files.length === 0)
      return res.status(400).json({ message: "No files uploaded" });

    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];

      await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: `${entityType.toLowerCase()}/${entityId}`,
            transformation: [
              { fetch_format: "auto" },
              { quality: "auto:good" },
            ],
          },
          async (error, result) => {
            if (error) return reject(error);

            await prisma.Images.create({
              data: {
                entity_type: entityType,
                entity_id: entityId,
                public_id: result.public_id,
                secure_url: result.secure_url,
                is_cover: i === 0,
                order: i,
              },
            });

            resolve(true);
          },
        );

        uploadStream.end(file.buffer);
      });
    }

    res.status(201).json({ message: "Images uploaded successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
exports.deleteImage = async (req, res) => {
  try {
    const entityType = req.params.entity_type;
    const entityId = Number(req.params.entity_id);
    const imageId = Number(req.params.imageId);

    const image = await prisma.Images.findUnique({ where: { id: imageId } });
    if (!image) return res.status(404).json({ message: "Image not found" });

    // optional: تحقق إن الصورة تتبع نفس الكيان
    if (image.entity_type !== entityType || image.entity_id !== entityId)
      return res
        .status(400)
        .json({ message: "Image does not belong to the entity" });

    await cloudinary.uploader.destroy(image.public_id);
    await prisma.Images.delete({ where: { id: imageId } });

    res.status(200).json({ message: "Image deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
exports.updateImage = async (req, res) => {
  try {
    const entityType = req.params.entity_type;
    const entityId = Number(req.params.entity_id);
    const imageId = Number(req.params.imageId);
    const { is_cover, order } = req.body;

    const image = await prisma.Images.findUnique({ where: { id: imageId } });
    if (!image) return res.status(404).json({ message: "Image not found" });

    if (image.entity_type !== entityType || image.entity_id !== entityId)
      return res
        .status(400)
        .json({ message: "Image does not belong to the entity" });

    // لو خليتها cover لازم نشيل أي cover تاني لنفس الكيان
    if (is_cover) {
      await prisma.Images.updateMany({
        where: { entity_type: entityType, entity_id: entityId },
        data: { is_cover: false },
      });
    }

    await prisma.Images.update({
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