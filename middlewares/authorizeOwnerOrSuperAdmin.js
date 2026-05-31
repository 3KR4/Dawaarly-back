const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const tableRegistry = require("../utils/ads/config/tableRegistry");

exports.authorizeOwnerOrSuperAdmin = async (req, res, next) => {
  try {
    const { adId, table_id } = req.params;

    // =========================
    // TABLE
    // =========================
    const table = tableRegistry[Number(table_id)];

    if (!table) {
      return res.status(400).json({
        message: "Invalid table_id",
      });
    }

    // =========================
    // MODEL
    // =========================
    const prismaModel = prisma[table.model];

    if (!prismaModel) {
      return res.status(400).json({
        message: `Model ${table.model} not found`,
      });
    }

    // =========================
    // FIND AD
    // =========================
    const ad = await prismaModel.findUnique({
      where: {
        id: Number(adId),
      },
    });

    if (!ad) {
      return res.status(404).json({
        message: `Ad ${adId} not found`,
      });
    }

    // =========================
    // AUTH
    // =========================
    const isSuperAdmin = req.user?.is_super_admin;

    const isOwner = ad.subuser_id === req.user.id || ad.user_id === req.user.id; 

    if (!isOwner && !isSuperAdmin) {
      return res.status(403).json({
        message: "Not allowed",
      });
    }

    // =========================
    // PASS AD
    // =========================
    req.ad = ad;

    next();
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Server Error",
    });
  }
};
