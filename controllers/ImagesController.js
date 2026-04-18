const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const cloudinary = require("../utils/cloudinary");

// helper: upload single file to cloudinary + save to DB
const uploadSingleImage = (file, entityType, entityId, order, isCover) => {
  return new Promise((resolve, reject) => {
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

        try {
          const image = await prisma.Images.create({
            data: {
              entity_type: entityType,
              entity_id: entityId,
              public_id: result.public_id,
              secure_url: result.secure_url,
              is_cover: isCover,
              order: order,
            },
          });

          resolve(image);
        } catch (dbErr) {
          reject(dbErr);
        }
      }
    );

    uploadStream.end(file.buffer);
  });
};

exports.uploadImages = async (req, res) => {
  try {
    const entityType = req.params.entity_type;
    const entityId = Number(req.params.entity_id);

    if (!entityType || !entityId) {
      return res
        .status(400)
        .json({ message: "entity_type and entity_id are required" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    // 👇 مهم: نضمن إن أول صورة فقط هي cover
    const uploadPromises = req.files.map((file, index) => {
      return uploadSingleImage(
        file,
        entityType,
        entityId,
        index,
        index === 0
      );
    });

    await Promise.all(uploadPromises);

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

    const image = await prisma.Images.findUnique({
      where: { id: imageId },
    });

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    if (
      image.entity_type !== entityType ||
      image.entity_id !== entityId
    ) {
      return res
        .status(400)
        .json({ message: "Image does not belong to the entity" });
    }

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

    const is_cover = req.body.is_cover;
    const order = req.body.order;

    const image = await prisma.Images.findUnique({
      where: { id: imageId },
    });

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    if (
      image.entity_type !== entityType ||
      image.entity_id !== entityId
    ) {
      return res
        .status(400)
        .json({ message: "Image does not belong to the entity" });
    }

    // 👇 لو دي cover: نشيل cover من كل صور نفس الـ entity
    if (is_cover === true) {
      await prisma.Images.updateMany({
        where: {
          entity_type: entityType,
          entity_id: entityId,
        },
        data: { is_cover: false },
      });
    }

    await prisma.Images.update({
      where: { id: imageId },
      data: {
        is_cover:
          is_cover !== undefined ? is_cover : image.is_cover,
        order: order !== undefined ? order : image.order,
      },
    });

    res.status(200).json({ message: "Image updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};