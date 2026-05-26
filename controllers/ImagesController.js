const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const cloudinary = require("../utils/cloudinary");

const OVERLAY_PUBLIC_ID = "Dawaarly-Overlay_yath5x";
const OVERLAY_GRAVITIES = [
  "north_west",
  "north_east",
  "south_west",
  "south_east",
  "north",
  "south",
  "east",
  "west",
];

const getRandomOverlayTransformation = () => {
  const gravity =
    OVERLAY_GRAVITIES[Math.floor(Math.random() * OVERLAY_GRAVITIES.length)];

  return {
    overlay: OVERLAY_PUBLIC_ID,
    gravity,
    width: 0.22,
    flags: "relative",
    opacity: 70,
    x: 18,
    y: 18,
  };
};

const normalizeOrderValues = (orders) => {
  if (orders === undefined || orders === null) return [];

  const rawOrders = Array.isArray(orders) ? orders : String(orders).split(",");

  return rawOrders.map((order) => {
    const normalizedOrder = Number(order);
    return Number.isFinite(normalizedOrder) ? normalizedOrder : null;
  });
};

// =========================
// HELPER: Upload Single Image
// =========================
const uploadSingleImage = (
  file,
  entityType,
  entityId,
  tableId,
  order,
  isCover,
) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `${entityType.toLowerCase()}/${entityId}`,
        transformation: [
          ...(entityType === "AD" ? [getRandomOverlayTransformation()] : []),
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

              // only for ADS (optional for others)
              table_id: tableId || 0,

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
      },
    );

    uploadStream.end(file.buffer);
  });
};

// =========================
// UPLOAD IMAGES
// =========================
exports.uploadImages = async (req, res) => {
  try {
    const entityType = req.params.entity_type; // AD | BLOG | SLIDER
    const entityId = Number(req.params.entity_id);
    const tableId = req.params.table_id ? Number(req.params.table_id) : null;

    const coverIndex =
      req.body.cover_index !== undefined ? Number(req.body.cover_index) : 0;
    const requestedOrders = normalizeOrderValues(req.body.orders);

    if (!entityType || !entityId) {
      return res.status(400).json({
        message: "entity_type and entity_id are required",
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: "No files uploaded",
      });
    }

    const lastImage = await prisma.Images.findFirst({
      where: {
        entity_type: entityType,
        entity_id: entityId,
        ...(tableId !== null ? { table_id: tableId } : {}),
      },
      orderBy: [{ order: "desc" }, { id: "desc" }],
    });
    const nextOrderStart = lastImage ? lastImage.order + 1 : 0;

    const uploadedImages = await Promise.all(
      req.files.map((file, index) =>
        uploadSingleImage(
          file,
          entityType,
          entityId,
          tableId,
          requestedOrders[index] ?? nextOrderStart + index,
          index === coverIndex,
        ),
      ),
    );

    const response = uploadedImages.map((img) => ({
      id: img.id,
      url: img.secure_url,
      is_cover: img.is_cover,
      order: img.order,
    }));

    return res.status(201).json(response);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Server Error",
      error: err.message,
    });
  }
};

// =========================
// DELETE IMAGE
// =========================
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

    if (image.entity_type !== entityType || image.entity_id !== entityId) {
      return res.status(400).json({
        message: "Image does not belong to the entity",
      });
    }

    await cloudinary.uploader.destroy(image.public_id);

    await prisma.$transaction(async (tx) => {
      await tx.Images.delete({
        where: { id: imageId },
      });

      if (!image.is_cover) return;

      const baseWhere = {
        entity_type: entityType,
        entity_id: entityId,
        ...(image.table_id !== null && image.table_id !== undefined
          ? { table_id: image.table_id }
          : {}),
      };

      const nextCover = await tx.Images.findFirst({
        where: {
          ...baseWhere,
          OR: [
            { order: { gt: image.order } },
            { order: image.order, id: { gt: image.id } },
          ],
        },
        orderBy: [{ order: "asc" }, { id: "asc" }],
      });

      const fallbackCover = nextCover
        ? null
        : await tx.Images.findFirst({
            where: baseWhere,
            orderBy: [{ order: "asc" }, { id: "asc" }],
          });

      const newCover = nextCover || fallbackCover;
      if (!newCover) return;

      await tx.Images.update({
        where: { id: newCover.id },
        data: { is_cover: true },
      });
    });

    return res.status(200).json({ message: "Image deleted successfully" });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Server Error",
      error: err.message,
    });
  }
};

// =========================
// UPDATE IMAGE
// =========================
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
      return res.status(404).json({
        message: "Image not found",
      });
    }

    if (image.entity_type !== entityType || image.entity_id !== entityId) {
      return res.status(400).json({
        message: "Image does not belong to the entity",
      });
    }

    // =========================
    // COVER LOGIC
    // =========================
    if (is_cover === true || is_cover === "true") {
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
          is_cover !== undefined
            ? is_cover === true || is_cover === "true"
            : image.is_cover,

        order: order !== undefined ? Number(order) : image.order,
      },
    });

    return res.status(200).json({ message: "Image updated successfully" });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "Server Error",
      error: err.message,
    });
  }
};
