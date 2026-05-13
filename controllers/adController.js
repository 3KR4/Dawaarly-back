const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const cloudinary = require("../utils/cloudinary");
const buildAdsWhere = require("../utils/buildAdsWhere");
const { pagination } = require("../utils/pagination");
const { getCache, setCache, deleteCachePattern } = require("../utils/redis");
const { validateAdDates } = require("../utils/validation");

const adIncludeRelations = {
  user: {
    select: {
      id: true,
      full_name: true,
      email: true,
      phone: true,
      tiktok_link: true,
      facebook_link: true,
    },
  },

  admin: {
    select: {
      id: true,
      full_name: true,
      email: true,
    },
  },

  category: true,
  subCategory: true,

  country: true,
  governorate: true,
  city: true,
  area: true,
  compound: true,

  bookings: true,
};
const adIncludeListRelations = {
  city: true,
  governorate: true,
  area: true,
  compound: true,

  category: true,
  subCategory: true,
};
function formatListAd(ad) {
  const firstImage =
    ad.images?.find((i) => i.is_cover) || ad.images?.[0] || null;

  return {
    id: ad.id,
    title: ad.title,
    price: ad.price,
    deposit_amount: ad.deposit_amount,
    currency: ad.currency,
    rent_frequency: ad.rent_frequency,
    status: ad.status,
    created_at: ad.created_at,
    city: ad.city,
    governorate: ad.governorate,
    area: ad.area,
    compound: ad.compound,
    category: ad.category,
    subCategory: ad.subCategory,
    views_count: ad.views_count,
    reach_count: ad.reach_count,
    favorites_count: ad.favorites_count,
    image: firstImage,
    details: {
      bedrooms: ad.bedrooms,
      bathrooms: ad.bathrooms,
      level: ad.level,
    },
  };
}
function formatDetailAd(ad) {
  const amenities = {};
  const details = {};

  const cleaned = { ...ad };

  Object.keys(cleaned).forEach((k) => {
    if (k.startsWith("am_")) {
      amenities[k.replace("am_", "")] = cleaned[k];
      delete cleaned[k];
    }

    if (["bedrooms", "bathrooms", "level"].includes(k)) {
      details[k] = cleaned[k];
      delete cleaned[k];
    }
  });

  return {
    ...cleaned,
    amenities,
    details,
  };
}
async function enrichAds(ads, userId = null, mode = "list") {
  if (!ads) return null;

  if (!Array.isArray(ads)) {
    ads = [ads];
  }

  const groupedByTable = {};

  for (const ad of ads) {
    if (!groupedByTable[ad.table_id]) {
      groupedByTable[ad.table_id] = [];
    }

    groupedByTable[ad.table_id].push(ad.id);
  }

  let images = [];
  let favorites = [];

  for (const table_id in groupedByTable) {
    const ids = groupedByTable[table_id];

    const tableImages = await prisma.Images.findMany({
      where: {
        table_id: Number(table_id),
        entity_id: {
          in: ids,
        },
      },
    });

    images.push(...tableImages);

    if (userId) {
      const tableFavorites = await prisma.AdFavorite.findMany({
        where: {
          user_id: userId,
          table_id: Number(table_id),
          entity_id: {
            in: ids,
          },
        },
      });

      favorites.push(...tableFavorites);
    }
  }

  // =========================
  // IMAGE MAP
  // =========================
  const imageMap = images.reduce((acc, img) => {
    const key = `${img.table_id}_${img.entity_id}`;

    if (!acc[key]) {
      acc[key] = [];
    }

    acc[key].push(img);

    return acc;
  }, {});

  // =========================
  // FAVORITES SET
  // =========================
  const favoriteSet = new Set(
    favorites.map((f) => `${f.table_id}_${f.entity_id}`),
  );

  // =========================
  // BUILD RESPONSE
  // =========================
  return ads.map((ad) => {
    const key = `${ad.table_id}_${ad.id}`;

    const adImages = imageMap[key] || [];

    const isFav = favoriteSet.has(key);

    const formatted =
      mode === "detail"
        ? formatDetailAd({ ...ad, images: adImages })
        : formatListAd({ ...ad, images: adImages });

    return {
      ...formatted,
      images: adImages,
      isFavorite: isFav,
    };
  });
}
const validateCreateAd = require("../utils/ads/validators/validateCreateAd");
const getModel = require("../utils/ads/services/getModel");
const validateUpdateAd = require("../utils/ads/validators/validateUpdateAd");

exports.createAd = async (req, res) => {
  try {
    const data = req.body;

    // =========================
    // TABLE ID
    // =========================
    const table_id = Number(req.params.table_id);

    // inject table_id
    data.table_id = table_id;

    // =========================
    // VALIDATION
    // =========================
    const validation = validateCreateAd(data);

    if (validation.error) {
      return res.status(400).json(validation);
    }

    const prismaModel = getModel(table_id);

    if (!prismaModel) {
      return res.status(400).json({
        message: `Model ${prismaModel} not found`,
      });
    }

    // =========================
    // USER DATA
    // =========================
    const user = req.user;

    // =========================
    // STATUS LOGIC
    // =========================
    const isAdmin =
      user?.is_super_admin || user?.permissions?.includes("CREATE_AD");

    const status = isAdmin ? "ACTIVE" : "PENDING";

    // =========================
    // BUILD CREATE DATA
    // =========================
    const createData = {
      ...data,

      table_id,
      user_id: isAdmin ? null : user.id,
      admin_id: isAdmin ? user.id : null,
      status,

      status_changed_at: isAdmin ? new Date() : null,
    };

    // =========================
    // DATE CASTING
    // =========================
    if (data.available_from) {
      createData.available_from = new Date(data.available_from);
    }

    if (data.available_to) {
      createData.available_to = new Date(data.available_to);
    }

    // =========================
    // CREATE AD
    // =========================
    const ad = await prismaModel.create({
      data: createData,
    });

    // =========================
    // RESPONSE
    // =========================
    return res.status(201).json({
      success: true,
      message: "Ad created successfully",
      data: {
        id: ad.id,
        table_id,
        status: ad.status,
      },
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
exports.updateAd = async (req, res) => {
  try {
    const adId = Number(req.params.adId);
    const table_id = Number(req.params.table_id);

    const prismaModel = getModel(table_id);

    if (!prismaModel) {
      return res.status(400).json({
        message: `Model ${table.model} not found`,
      });
    }

    // =========================
    // GET AD
    // =========================

    const ad = await prismaModel.findUnique({
      where: { id: adId },
    });

    if (!ad) {
      return res.status(404).json({
        message: `Ad ${adId} not found`,
      });
    }

    // =========================
    // AUTH
    // =========================
    const user = req.user;

    const isAdmin =
      user?.permissions?.includes("EDIT_AD") || user?.is_super_admin;

    const isOwner = ad.user_id === user.id;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    // =========================
    // VALIDATION
    // =========================
    const validation = validateUpdateAd(req.body, table_id);

    if (validation.error) {
      return res.status(400).json(validation);
    }

    // =========================
    // BUILD UPDATE DATA
    // =========================
    const dataToUpdate = {
      ...req.body,
    };

    // date casting
    if (req.body.available_from) {
      dataToUpdate.available_from = new Date(req.body.available_from);
    }

    if (req.body.available_to) {
      dataToUpdate.available_to = new Date(req.body.available_to);
    }

    // pending after edit
    if (!isAdmin && ad.status === "ACTIVE") {
      dataToUpdate.status = "PENDING";
      dataToUpdate.was_previously_approved = true;
    }

    // prevent changing protected fields
    delete dataToUpdate.id;
    delete dataToUpdate.user_id;

    // =========================
    // UPDATE
    // =========================
    const updatedAd = await prismaModel.update({
      where: { id: adId },
      data: dataToUpdate,
    });

    // =========================
    // CACHE
    // =========================
    await deleteCachePattern("ads:list:*");
    await deleteCachePattern("userAds:*");
    await deleteCachePattern("sections:*");

    // =========================
    // RESPONSE
    // =========================
    return res.json({
      success: true,
      message: "Ad updated successfully",
      data: updatedAd,
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
exports.deleteAd = async (req, res) => {
  try {
    const adId = Number(req.params.adId);
    const table_id = Number(req.params.table_id);

    const prismaModel = getModel(table_id);

    if (!prismaModel) {
      return res.status(400).json({
        message: `Model ${table.model} not found`,
      });
    }

    // =========================
    // FIND AD
    // =========================
    const ad = await prismaModel.findUnique({
      where: { id: adId },
    });

    if (!ad) {
      return res.status(404).json({
        message: "Ad not found",
      });
    }

    // =========================
    // AUTH
    // =========================
    const user = req.user;

    const isOwner = ad.user_id === user.id;

    const canDelete =
      user?.is_super_admin || user?.permissions?.includes("DELETE_AD");

    if (!isOwner && !canDelete) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    // =========================
    // IMAGES
    // =========================
    const images = await prisma.Images.findMany({
      where: {
        entity_type: "AD",
        table_id,
        entity_id: adId,
      },
    });

    await Promise.allSettled(
      images.map((img) => cloudinary.uploader.destroy(img.public_id)),
    );

    // =========================
    // DELETE
    // =========================
    await prismaModel.delete({
      where: { id: adId },
    });

    // =========================
    // CACHE
    // =========================
    await deleteCachePattern("ads:list:*");
    await deleteCachePattern("userAds:*");
    await deleteCachePattern("sections:*");

    // =========================
    // RESPONSE
    // =========================
    return res.json({
      success: true,
      message: "Ad deleted successfully",
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
exports.changeAdStatus = async (req, res) => {
  try {
    const table_id = Number(req.params.table_id);
    const adId = Number(req.params.adId);

    const { status, reason } = req.body;

    const prismaModel = getModel(table_id);

    if (!prismaModel) {
      return res.status(400).json({
        message: `Model ${table.model} not found`,
      });
    }

    // =========================
    // GET AD
    // =========================
    const ad = await prismaModel.findUnique({
      where: { id: adId },
    });

    if (!ad) {
      return res.status(404).json({ message: "Ad not found" });
    }

    // =========================
    // AUTH
    // =========================
    const isAdmin =
      req.user?.is_super_admin ||
      req.user?.permissions?.includes("CHANGE_ADS_STATUS");

    const isOwner = ad.user_id === req.user.id;

    // =========================
    // VALID STATUS
    // =========================
    const allowedStatuses = ["ACTIVE", "REJECTED", "DISABLED"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // =========================
    // AUTH RULES
    // =========================
    if (!isAdmin) {
      if (!isOwner) {
        return res.status(403).json({ message: "Access denied" });
      }

      if (status !== "DISABLED") {
        return res.status(403).json({
          message: "You can only disable your own ad",
        });
      }
    }

    // =========================
    // REJECT LOGIC
    // =========================
    let reject_reason;

    if (status === "REJECTED") {
      if (!isAdmin) {
        return res.status(403).json({
          message: "Only admin can reject ads",
        });
      }

      if (!reason) {
        return res.status(400).json({
          message: "Reason required for rejection",
        });
      }

      reject_reason = reason;
    }

    // =========================
    // UPDATE
    // =========================
    const updatedAd = await prismaModel.update({
      where: { id: adId },
      data: {
        status,
        status_changed_at: new Date(),

        ...(reject_reason && {
          reject_reason,
        }),
      },
    });

    return res.json({
      success: true,
      message: `Ad status updated to ${status}`,
      data: updatedAd,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Server Error",
      error: err.message,
    });
  }
};
exports.assignAdmin = async (req, res) => {
  try {
    const table_id = Number(req.params.table_id);
    const adId = Number(req.params.adId);

    const user = req.user;

    // =========================
    // AUTH
    // =========================
    if (
      !user?.is_super_admin &&
      !user?.permissions?.includes("ASSIGN_RESPONSIBILITY")
    ) {
      return res.status(403).json({
        message: "Access denied: You need ASSIGN_RESPONSIBILITY permission",
      });
    }

    const prismaModel = getModel(table_id);

    if (!prismaModel) {
      return res.status(400).json({
        message: `Model ${table.model} not found`,
      });
    }

    const { admin_id } = req.body;

    if (admin_id === undefined) {
      return res.status(400).json({ message: "admin_id is required" });
    }

    // =========================
    // VALIDATE ADMIN
    // =========================
    if (admin_id !== null) {
      if (isNaN(admin_id)) {
        return res.status(400).json({
          message: "admin_id must be number or null",
        });
      }

      const adminUser = await prisma.Users.findUnique({
        where: { id: admin_id },
      });

      if (!adminUser || adminUser.user_type !== "ADMIN") {
        return res.status(400).json({ message: "Invalid admin ID" });
      }
    }

    // =========================
    // GET AD
    // =========================
    const ad = await prismaModel.findUnique({
      where: { id: adId },
    });

    if (!ad) {
      return res.status(404).json({ message: "Ad not found" });
    }

    // =========================
    // UPDATE
    // =========================
    await prismaModel.update({
      where: { id: adId },
      data: {
        admin_id,
      },
    });

    return res.json({
      success: true,
      message:
        admin_id === null
          ? "Admin removed successfully"
          : "Admin assigned successfully",
    });
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      message: "Server Error",
      error: err.message,
    });
  }
};
exports.getAllAds = async (req, res) => {
  try {
    const userId = req.user?.id || null;

    const { page, limit, skip } = pagination(req.query);
    const isAdmin = req.user?.is_super_admin || req.user?.user_type === "ADMIN";

    const where = buildAdsWhere(req.query, isAdmin);

    const crypto = require("crypto");

    const hash = crypto
      .createHash("md5")
      .update(JSON.stringify(where))
      .digest("hex");

    const cacheKey = `ads:list:${userId || "guest"}:${page}:${limit}:${hash}`;

    const cached = await getCache(cacheKey);
    if (cached) return res.json(cached);

    const [ads, total] = await Promise.all([
      prisma.D_Vacation_Rent.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: "desc" },
        include: adIncludeListRelations,
      }),
      prisma.D_Vacation_Rent.count({ where }),
    ]);

    const data = await enrichAds(ads, userId, "list");

    const response = {
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };

    await setCache(cacheKey, response, 60);

    res.json(response);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getAd = async (req, res) => {
  try {
    const adId = Number(req.params.adId);

    const ad = await prisma.D_Vacation_Rent.findUnique({
      where: { id: adId },
      include: adIncludeRelations,
    });

    if (!ad) return res.status(404).json({ message: "Not found" });

    const userId = req.user?.id || null;

    const enriched = await enrichAds(ad, userId, "detail");

    return res.json(enriched[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getUserAds = async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    const { page, limit, skip } = pagination(req.query);

    const cacheKey = `userAds:${userId}:${page}:${limit}:${JSON.stringify(req.query)}`;

    const cached = await getCache(cacheKey);

    if (cached) {
      const data = await enrichAds(cached.data, userId, "list");

      return res.json({
        ...cached,
        data,
      });
    }

    const where = {
      OR: [{ user_id: Number(userId) }, { admin_id: Number(userId) }],
    };
    const [ads, total] = await Promise.all([
      prisma.D_Vacation_Rent.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: "desc" },
        include: adIncludeListRelations,
      }),
      prisma.D_Vacation_Rent.count({ where }),
    ]);

    const data = await enrichAds(ads, req.user?.id, "list");

    const response = {
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };

    await setCache(cacheKey, response, 60);

    res.json(response);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getSectionsAds = async (req, res) => {
  try {
    const { type, value } = req.query;
    const { page, limit, skip } = pagination(req.query);

    const cacheKey = `sections:${type}:${value}:${page}:${limit}`;

    const cached = await getCache(cacheKey);
    if (cached) return res.json(cached);

    const where = { status: "ACTIVE" };

    if (type === "category") where.categoryId = Number(value);
    if (type === "city") where.city_id = Number(value);
    if (type === "governorate") where.governorate_id = Number(value);
    if (type === "compound") where.compound_id = Number(value);

    const [ads, total] = await Promise.all([
      prisma.D_Vacation_Rent.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: "desc" },
        include: adIncludeListRelations,
      }),
      prisma.D_Vacation_Rent.count({ where }),
    ]);

    const data = await enrichAds(ads, req.user?.id, "list");

    const response = {
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };

    await setCache(cacheKey, response, 60);

    res.json(response);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.toggleFavorite = async (req, res) => {
  try {
    const userId = req.user.id;

    const entity_id = Number(req.params.entity_id);
    const table_id = Number(req.params.table_id);

    // =========================
    // TABLE
    // =========================
    const prismaModel = getModel(table_id);

    if (!prismaModel) {
      return res.status(400).json({
        message: `Model ${table.model} not found`,
      });
    }

    // =========================
    // CHECK AD EXISTS
    // =========================
    const ad = await prismaModel.findUnique({
      where: { id: entity_id },
    });

    if (!ad) {
      return res.status(404).json({
        message: "Ad not found",
      });
    }

    // =========================
    // CHECK EXISTING FAVORITE
    // =========================
    const existing = await prisma.AdFavorite.findUnique({
      where: {
        entity_id_table_id_user_id: {
          entity_id,
          table_id,
          user_id: userId,
        },
      },
    });

    // =========================
    // TOGGLE
    // =========================
    if (existing) {
      await prisma.$transaction([
        prisma.AdFavorite.delete({
          where: {
            entity_id_table_id_user_id: {
              entity_id,
              table_id,
              user_id: userId,
            },
          },
        }),

        prismaModel.update({
          where: { id: entity_id },

          data: {
            favorites_count: {
              decrement: 1,
            },
          },
        }),
      ]);
    } else {
      await prisma.$transaction([
        prisma.AdFavorite.create({
          data: {
            entity_id,
            table_id,
            user_id: userId,
          },
        }),

        prismaModel.update({
          where: { id: entity_id },

          data: {
            favorites_count: {
              increment: 1,
            },
          },
        }),
      ]);
    }

    // =========================
    // CACHE
    // =========================
    await deleteCachePattern("ads:list:*");
    await deleteCachePattern("sections:*");
    await deleteCachePattern(`userAds:${userId}:*`);
    await deleteCachePattern(`favorites:${userId}:*`);

    // =========================
    // RESPONSE
    // =========================
    return res.json({
      success: true,

      message: existing ? "Removed from favorites" : "Added to favorites",
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;

    const favorites = await prisma.AdFavorite.findMany({
      where: {
        user_id: userId,
      },

      orderBy: {
        created_at: "desc",
      },
    });

    const grouped = {};

    // =========================
    // GROUP BY TABLE
    // =========================
    for (const fav of favorites) {
      if (!grouped[fav.table_id]) {
        grouped[fav.table_id] = [];
      }

      grouped[fav.table_id].push(fav.entity_id);
    }

    let ads = [];

    // =========================
    // FETCH ADS
    // =========================
    for (const table_id in grouped) {
      const prismaModel = getModel(table_id);

      if (!prismaModel) continue;

      const records = await prismaModel.findMany({
        where: {
          id: {
            in: grouped[table_id],
          },
        },

        include: adIncludeListRelations,
      });

      ads.push(...records);
    }

    // =========================
    // ENRICH
    // =========================
    const data = await enrichAds(ads, userId, "list");

    return res.json({
      success: true,
      total: data.length,
      data,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
