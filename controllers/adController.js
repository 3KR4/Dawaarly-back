const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const cloudinary = require("../utils/cloudinary");
const buildAdsWhere = require("../utils/buildAdsWhere");
const { pagination } = require("../utils/pagination");
const { getCache, setCache, deleteCachePattern } = require("../utils/redis");
const { validateAdDates } = require("../utils/validation");
const adIncludeRelations = {
  admin: {
    select: {
      id: true,
      full_name: true,
      email: true,
      phone: true,
    },
  },
  subuser: {
    select: {
      id: true,
      full_name: true,
      email: true,
      phone: true,
      tiktok_link: true,
      facebook_link: true,
    },
  },
  Categories: true,
  SubCategories: true,
  country: true,
  governorate: true,
  city: true,
  area: true,
  compound: true,
  Booking: true,
};

const adIncludeListRelations = {
  city: true,
  governorate: true,
  area: true,
  compound: true,
  Categories: true,
  SubCategories: true,
};

function formatListAd(ad) {
  const firstImage =
    ad.images?.find((i) => i.is_cover) || ad.images?.[0] || null;

  return {
    id: ad.id,
    title: ad.title,
    rent_amount: ad.rent_amount,
    deposit_amount: ad.deposit_amount,
    rent_currency: ad.rent_currency,
    rent_frequency: ad.rent_frequency,
    status: ad.status,
    created_at: ad.created_at,
    city: ad.city,
    governorate: ad.governorate,
    area: ad.area,
    compound: ad.compound,
    Categories: ad.Categories,
    SubCategories: ad.SubCategories,
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
  if (!Array.isArray(ads)) ads = [ads];

  const adIds = ads.map((a) => a.id);

  const [images, favorites] = await Promise.all([
    prisma.Images.findMany({
      where: { entity_type: "AD", entity_id: { in: adIds } },
    }),
    userId
      ? prisma.AdFavorite.findMany({
          where: { user_id: userId, ad_id: { in: adIds } },
        })
      : [],
  ]);

  // 🔥 نحول الصور لـ map مرة واحدة
  const imageMap = images.reduce((acc, img) => {
    if (!acc[img.entity_id]) acc[img.entity_id] = [];
    acc[img.entity_id].push(img);
    return acc;
  }, {});

  // 🔥 نحول favorites لـ Set (سريع جداً)
  const favoriteSet = new Set(favorites.map((f) => Number(f.ad_id)));

  return ads.map((ad) => {
    const adImages = imageMap[ad.id] || [];

    const isFav = favoriteSet.has(Number(ad.id));

    const formatted =
      mode === "detail"
        ? formatDetailAd(ad)
        : formatListAd({ ...ad, images: adImages });

    return {
      ...formatted,
      images: adImages,
      isFavorite: isFav,
    };
  });
}

exports.createAd = async (req, res) => {
  try {
    const data = req.body;

    const requiredFields = [
      "title",
      "categoryId",
      "subCategoryId",
      "country_id",
      "governorate_id",
      "city_id",
      "rent_frequency",
      "rent_currency",
      "deposit_amount",
      "rent_amount",
      "bedrooms",
      "bathrooms",
      "level",
    ];

    const missing = requiredFields.filter((f) => !data[f]);

    if (missing.length) {
      return res.status(400).json({ message: "Missing fields", missing });
    }

    if (data.available_from && data.available_to) {
      if (!validateAdDates(data.available_from, data.available_to)) {
        return res.status(400).json({ message: "Invalid dates" });
      }
    }

    const user = req.user;

    const userData =
      user.user_type === "ADMIN"
        ? { admin_id: user.id }
        : user.user_type === "SUBUSER"
          ? { subuser_id: user.id }
          : {};

    const isAdmin =
      user?.is_super_admin || user?.permissions?.includes("create-ads");

    const status = isAdmin ? "ACTIVE" : "PENDING";

    const ad = await prisma.D_Vacation.create({
      data: {
        ...data,
        ...userData,
        status,
        status_changed_at: isAdmin ? new Date() : null,
      },
    });
    await deleteCachePattern("ads:list:*");
    await deleteCachePattern("sections:*");
    res.status(201).json({ message: "Ad created", adId: ad.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const buildUpdateData = (body) => {
  const fields = [
    "title",
    "description",
    "categoryId",
    "subCategoryId",
    "display_phone",
    "display_whatsapp",
    "rent_amount",
    "rent_currency",
    "rent_frequency",
    "deposit_amount",
    "min_rent_period",
    "min_rent_period_unit",
    "country_id",
    "governorate_id",
    "city_id",
    "area_id",
    "compound_id",
    "bedrooms",
    "bathrooms",
    "level",
    "adult_no_max",
    "child_no_max",
    "am_seeview",
    "am_pool",
    "am_balcony",
    "am_private_garden",
    "am_kitchen",
    "am_ac",
    "am_heating",
    "am_elevator",
    "am_gym",
    "tags",
  ];

  const data = {};

  fields.forEach((f) => {
    if (body[f] !== undefined) {
      data[f] = body[f];
    }
  });

  if (body.available_from) data.available_from = new Date(body.available_from);

  if (body.available_to) data.available_to = new Date(body.available_to);

  return data;
};

exports.updateAd = async (req, res) => {
  try {
    const adId = Number(req.params.adId);

    const ad = await prisma.D_Vacation.findUnique({
      where: { id: adId },
    });

    if (!ad) {
      return res.status(404).json({ message: "Ad not found" });
    }

    const user = req.user;

    const isAdmin =
      user?.permissions?.includes("EDIT_AD") || user?.is_super_admin;

    const isOwner = ad.admin_id === user.id || ad.subuser_id === user.id;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: "Access denied" });
    }

    const dataToUpdate = buildUpdateData(req.body);

    if (!isAdmin && ad.status === "ACTIVE") {
      dataToUpdate.status = "PENDING";
      dataToUpdate.was_previously_approved = true;
    }

    const updatedAd = await prisma.D_Vacation.update({
      where: { id: adId },
      data: dataToUpdate,
    });
    await deleteCachePattern("ads:list:*");
    await deleteCachePattern("userAds:*");
    await deleteCachePattern("sections:*");
    res.json({
      message: "Ad updated successfully",
      ad: updatedAd,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server Error",
      error: err.message,
    });
  }
};
exports.deleteAd = async (req, res) => {
  try {
    const adId = Number(req.params.adId);

    const ad = await prisma.D_Vacation.findUnique({
      where: { id: adId },
    });

    if (!ad) return res.status(404).json({ message: "Ad not found" });

    const isOwner =
      ad.admin_id === req.user.id || ad.subuser_id === req.user.id;

    const canDelete =
      req.user.is_super_admin || req.user.permissions?.includes("DELETE_AD");

    if (!isOwner && !canDelete)
      return res.status(403).json({ message: "Access denied" });

    const images = await prisma.Images.findMany({
      where: {
        entity_type: "AD",
        entity_id: adId,
      },
    });

    await Promise.allSettled(
      images.map((img) => cloudinary.uploader.destroy(img.public_id)),
    );

    await prisma.D_Vacation.delete({
      where: { id: adId },
    });
    await deleteCachePattern("ads:list:*");
    await deleteCachePattern("userAds:*");
    await deleteCachePattern("sections:*");
    res.json({ message: "Ad deleted successfully" });
  } catch (err) {
    console.log(err);

    res.status(500).json({ message: "Server Error" });
  }
};
exports.changeAdStatus = async (req, res) => {
  try {
    const { adId } = req.params;
    const { status, reason } = req.body;

    // 🔹 نجيب الإعلان من قاعدة البيانات
    const ad = await prisma.D_Vacation.findUnique({
      where: { id: Number(adId) },
    });

    if (!ad) return res.status(404).json({ message: "Ad not found" });

    // 🔹 صلاحيات المستخدم
    const isAdmin =
      req.user?.is_super_admin ||
      req.user?.permissions?.includes("CHANGE_ADS_STATUS");

    const isOwner =
      ad.admin_id === req.user.id || ad.subuser_id === req.user.id;

    // 🔹 الحالات المسموحة
    const allowedStatuses = ["ACTIVE", "REJECTED", "DISABLED"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // 🔹 التحقق من الصلاحيات
    if (!isAdmin) {
      if (!isOwner) return res.status(403).json({ message: "Access denied" });

      if (status !== "DISABLED") {
        return res.status(403).json({
          message: "You can only disable your own ad",
        });
      }
    }

    // 🔹 إذا الحالة REJECTED نحتاج السبب
    let reject_reason;
    if (status === "REJECTED") {
      if (!isAdmin)
        return res.status(403).json({
          message: "Only admin can reject ads",
        });

      if (!reason)
        return res.status(400).json({
          message: "Reason required for rejection",
        });

      reject_reason = reason;
    }

    // 🔹 تحديث الإعلان
    const updatedAd = await prisma.D_Vacation.update({
      where: { id: Number(adId) },
      data: {
        status,
        ...(reject_reason && { reject_reason }), // فقط لو REJECTED
      },
    });

    res.json({
      message: `Ad status updated to ${status}`,
      ad: updatedAd,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
exports.assignAdmin = async (req, res) => {
  try {
    // 🔐 التحقق من الصلاحية أول حاجة
    const user = req.user;

    if (
      !user?.is_super_admin &&
      !user?.permissions?.includes("ASSIGN_RESPONSIBILITY")
    ) {
      return res.status(403).json({
        message: "Access denied: You need ASSIGN_RESPONSIBILITY permission",
      });
    }

    const adId = Number(req.params.adId);
    const { admin_id } = req.body;

    // ✅ 1. نسمح بـ null عادي
    if (admin_id === undefined) {
      return res.status(400).json({ message: "admin_id field is required" });
    }

    // ✅ 2. لو مش null، نتأكد إنه رقم صحيح والأدمن موجود
    if (admin_id !== null) {
      if (isNaN(admin_id)) {
        return res
          .status(400)
          .json({ message: "admin_id must be a number or null" });
      }

      const adminUser = await prisma.users.findUnique({
        where: { id: admin_id },
      });

      if (!adminUser || adminUser.user_type !== "ADMIN") {
        return res.status(400).json({ message: "Invalid admin ID" });
      }
    }

    // 3. التحقق من وجود الإعلان
    const ad = await prisma.D_Vacation.findUnique({
      where: { id: adId },
    });

    if (!ad) return res.status(404).json({ message: "Ad not found" });

    await prisma.D_Vacation.update({
      where: { id: adId },
      data: {
        admin_id,
      },
    });

    res.json({
      message:
        admin_id === null
          ? "Admin removed successfully"
          : "Admin assigned successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
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
      prisma.D_Vacation.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: "desc" },
        include: adIncludeListRelations,
      }),
      prisma.D_Vacation.count({ where }),
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

    const ad = await prisma.D_Vacation.findUnique({
      where: { id: adId },
      include: adIncludeRelations,
    });

    if (!ad) return res.status(404).json({ message: "Not found" });

    const userId = req.user?.id || null;
    const [adminActiveAdsCount, subuserActiveAdsCount] = await Promise.all([
      ad.admin?.id
        ? prisma.D_Vacation.count({
            where: {
              admin_id: ad.admin.id,
              status: "ACTIVE",
            },
          })
        : null,
      ad.subuser?.id
        ? prisma.D_Vacation.count({
            where: {
              subuser_id: ad.subuser.id,
              status: "ACTIVE",
            },
          })
        : null,
    ]);

    const enriched = await enrichAds(ad, userId, "detail");

    if (enriched[0]?.admin) {
      enriched[0].admin = {
        ...enriched[0].admin,
        active_ads_count: adminActiveAdsCount || 0,
      };
    }

    if (enriched[0]?.subuser) {
      enriched[0].subuser = {
        ...enriched[0].subuser,
        active_ads_count: subuserActiveAdsCount || 0,
      };
    }

    return res.json(enriched[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserAds = async (req, res) => {
  try {
    const { userId } = req.params;
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
      OR: [{ admin_id: Number(userId) }, { subuser_id: Number(userId) }],
    };

    const [ads, total] = await Promise.all([
      prisma.D_Vacation.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: "desc" },
        include: adIncludeListRelations,
      }),
      prisma.D_Vacation.count({ where }),
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
      prisma.D_Vacation.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: "desc" },
        include: adIncludeListRelations,
      }),
      prisma.D_Vacation.count({ where }),
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

exports.getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page, limit, skip } = pagination(req.query);

    const [fav, total] = await Promise.all([
      prisma.AdFavorite.findMany({
        where: { user_id: userId },
        skip,
        take: limit,
        include: { ad: { include: adIncludeListRelations } },
      }),
      prisma.AdFavorite.count({ where: { user_id: userId } }),
    ]);

    const ads = fav.map((f) => f.ad);

    const data = await enrichAds(ads, userId, "list");

    res.json({
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.toggleFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const adId = Number(req.params.adId);

    // 🔹 تأكد إن الإعلان موجود
    const ad = await prisma.D_Vacation.findUnique({
      where: { id: adId },
    });

    if (!ad) {
      return res.status(404).json({ message: "Ad not found" });
    }

    // 🔹 هل المستخدم عامل favorite قبل كده؟
    const existing = await prisma.AdFavorite.findUnique({
      where: {
        ad_id_user_id: { ad_id: adId, user_id: userId },
      },
    });

    // 🔹 toggle logic + transaction
    if (existing) {
      await prisma.$transaction([
        prisma.AdFavorite.delete({
          where: {
            ad_id_user_id: { ad_id: adId, user_id: userId },
          },
        }),
        prisma.D_Vacation.update({
          where: { id: adId },
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
            ad_id: adId,
            user_id: userId,
          },
        }),
        prisma.D_Vacation.update({
          where: { id: adId },
          data: {
            favorites_count: {
              increment: 1,
            },
          },
        }),
      ]);
    }

    // 🔹 cache invalidation
    await deleteCachePattern("ads:list:*");
    await deleteCachePattern("sections:*");
    await deleteCachePattern(`userAds:${userId}:*`);
    await deleteCachePattern(`favorites:${userId}:*`);

    // 🔹 response
    return res.json({
      message: existing ? "Removed from favorites" : "Added to favorites",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
