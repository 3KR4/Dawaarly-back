const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const cloudinary = require("../utils/cloudinary");
const { parseAdData } = require("../utils/convertTypes");
const jwt = require("jsonwebtoken");
// Validation utility
const { validateAdDates, validateRentPeriod } = require("../utils/validation");

// Create Ad
exports.createAd = async (req, res) => {
  try {
    const data = req.body;

    const isAdmin =
      req.user?.is_super_admin || req.user?.permissions?.includes("create-ads");

    const userData = {};
    if (req.user.user_type === "admin") {
      userData.admin_id = req.user.id;
    } else {
      userData.subuser_id = req.user.id;
    }

    const adData = {
      ...data,
      ...userData,
      status: isAdmin ? "ACTIVE" : "PENDING",
      approved_at: isAdmin ? new Date() : null,
    };

    const ad = await prisma.D_Vacation.create({ data: adData });

    res.status(201).json({
      message: "Ad created successfully",
      adId: ad.id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
// Update Ad
exports.updateAd = async (req, res) => {
  try {
    const adId = Number(req.params.adId);

    const existingAd = await prisma.D_Vacation.findUnique({
      where: { id: adId },
    });

    if (!existingAd) return res.status(404).json({ message: "Ad not found" });

    const isAdmin =
      req.user?.permissions?.includes("edit-ads") || req.user?.is_super_admin;
    const isOwner =
      req.ad.admin_id === req.user.id || req.ad.subuser_id === req.user.id;
    if (!isOwner && !isAdmin)
      return res.status(403).json({ message: "Access denied" });

    const filteredData = { ...req.body };

    if (filteredData.available_from)
      filteredData.available_from = new Date(filteredData.available_from);

    if (filteredData.available_to)
      filteredData.available_to = new Date(filteredData.available_to);

    // 👇 أهم جزء
    if (!isAdmin && existingAd.status === "ACTIVE") {
      filteredData.status = "PENDING";
      filteredData.was_previously_approved = true;
      filteredData.approved_at = null;
    }

    const updatedAd = await prisma.D_Vacation.update({
      where: { id: adId },
      data: filteredData,
    });

    res.json({
      message: "Ad updated successfully",
      ad: updatedAd,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
// Delete Ad
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
      req.user.is_super_admin || req.user.permissions?.includes("delete-ads");

    if (!isOwner && !canDelete)
      return res.status(403).json({ message: "Access denied" });

    const images = await prisma.AdImage.findMany({
      where: { ad_id: adId },
    });

    for (const img of images) {
      await cloudinary.uploader.destroy(img.public_id);
    }

    await prisma.D_Vacation.delete({
      where: { id: adId },
    });

    res.json({ message: "Ad deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};
exports.deleteOneImage = async (req, res) => {
  const { imageId } = req.params;

  const image = await prisma.AdImage.findUnique({
    where: { id: Number(imageId) },
  });

  if (!image) return res.status(404).json({ message: "Image not found" });

  await cloudinary.uploader.destroy(image.public_id);

  await prisma.AdImage.delete({
    where: { id: Number(imageId) },
  });

  res.json({ message: "Image deleted" });
};
// Change Ad Status (Admin)
exports.changeAdStatus = async (req, res) => {
  try {
    const { adId } = req.params;
    const { status, reason } = req.body;

    const ad = await prisma.D_Vacation.findUnique({
      where: { id: Number(adId) },
    });

    if (!ad) return res.status(404).json({ message: "Ad not found" });

    const isAdmin =
      req.user?.is_super_admin ||
      req.user?.permissions?.includes("change-ads-status");

    const isOwner =
      ad.admin_id === req.user.id || ad.subuser_id === req.user.id;

    // الحالات المسموحة
    const allowedStatuses = [
      "ACTIVE",
      "REJECTED",
      "DISABLED",
      "SOLD",
      "BOOKED",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    /*
      🧠 المنطق:
      - Admin → يغير لأي حاجة
      - Subscriber (Owner) → يقدر يعمل DISABLED بس
    */
    if (!isAdmin) {
      if (!isOwner) return res.status(403).json({ message: "Access denied" });

      if (status !== "DISABLED") {
        return res.status(403).json({
          message: "You can only disable your own ad",
        });
      }
    }

    // لو Reject لازم سبب (Admin فقط)
    let rejectReason = null;
    if (status === "REJECTED") {
      if (!isAdmin)
        return res.status(403).json({
          message: "Only admin can reject ads",
        });

      if (!reason)
        return res.status(400).json({
          message: "Reason required for rejection",
        });

      rejectReason = reason; // نخزن السبب في الحقل
    }

    const updatedAd = await prisma.D_Vacation.update({
      where: { id: Number(adId) },
      data: { status, reject_reason: rejectReason },
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
// Get single Ad
const adIncludeRelations = {
  images: true,
  admin: { select: { id: true, full_name: true, phone: true, email: true } },
  subuser: {
    select: {
      id: true,
      full_name: true,
      phone: true,
      created_at: true,
      active_ads_count: true,
      email: true,
    },
  },
  Categories: { select: { id: true, name_en: true, name_ar: true } },
  SubCategories: { select: { id: true, name_en: true, name_ar: true } },
  country: { select: { id: true, name_en: true, name_ar: true } },
  governorate: { select: { id: true, name_en: true, name_ar: true } },
  city: { select: { id: true, name_en: true, name_ar: true } },
  area: { select: { id: true, name_en: true, name_ar: true } },
  compound: { select: { id: true, name_en: true, name_ar: true } },
};
function removeForeignKeys(ad) {
  const {
    admin_id,
    subuser_id,
    usersId,
    categoryId,
    subCategoryId,
    country_id,
    governorate_id,
    city_id,
    area_id,
    compound_id,
    ...cleaned
  } = ad;
  return cleaned;
}

// Helper: تحديد حالة الفيفوريت
async function attachIsFavorite(tx, ad, userId) {
  if (!userId) return false;
  const fav = await tx.adFavorite.findUnique({
    where: {
      ad_id_user_id: { ad_id: ad.id, user_id: userId },
    },
  });
  return !!fav;
}
function formatAdResponse(ad) {
  const amenities = {};
  const unitDetails = {};

  Object.keys(ad).forEach((key) => {
    // جمع am_
    if (key.startsWith("am_")) {
      amenities[key.replace("am_", "")] = ad[key];
    }

    // جمع unit details
    if (["bedrooms", "bathrooms", "level"].includes(key)) {
      unitDetails[key] = ad[key];
    }
  });

  // نحذف القيم القديمة
  const cleaned = { ...ad };

  Object.keys(cleaned).forEach((key) => {
    if (key.startsWith("am_")) delete cleaned[key];
  });

  delete cleaned.bedrooms;
  delete cleaned.bathrooms;
  delete cleaned.level;

  return {
    ...cleaned,
    amenities,
    details: unitDetails,
  };
}

exports.getAllAds = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      search,
      category,
      subCategory,
      country_id,
      governorate_id,
      city_id,
      area_id,
      compound_id,
      min_rent_amount,
      max_rent_amount,
      rent_currency,
      rent_frequency,
      min_deposit_amount,
      max_deposit_amount,
      min_rent_period,
      max_rent_period,
      min_bedrooms,
      max_bedrooms,
      min_bathrooms,
      max_bathrooms,
      min_level,
      max_level,
      min_adult_no_max,
      max_adult_no_max,
      min_child_no_max,
      max_child_no_max,
      am_pool,
      am_balcony,
      am_private_garden,
      am_kitchen,
      am_ac,
      am_heating,
      am_elevator,
      am_gym,
      min_available_from,
      max_available_to,
    } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    /*
      🧠 تحديد الصلاحيات:
      - لو Admin يقدر يحدد status
      - لو User عادي يشوف ACTIVE بس
      - لو مش مسجل دخول يشوف ACTIVE بس
    */

    let userId = null;
    let isAdmin = false;

    const authHeader = req.headers["authorization"] || req.headers["x-api-key"];
    if (authHeader) {
      const token = authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : authHeader;

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id;

        isAdmin = decoded.is_super_admin;
      } catch (err) {
        console.log("Invalid token", err);
      }
      console.log("authHeader:", authHeader);
    }
    let statusFilter = { status: "ACTIVE" }; // default

    if (isAdmin && status) {
      statusFilter = { status: status.trim() }; // trim لأي مسافات
    }

    const filters = [
      statusFilter,

      search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
              { tags: { has: search } },
            ],
          }
        : {},

      category ? { categoryId: Number(category) } : {},
      subCategory ? { subCategoryId: Number(subCategory) } : {},
      country_id ? { country_id: Number(country_id) } : {},
      governorate_id ? { governorate_id: Number(governorate_id) } : {},
      city_id ? { city_id: Number(city_id) } : {},
      area_id ? { area_id: Number(area_id) } : {},
      compound_id ? { compound_id: Number(compound_id) } : {},

      min_rent_amount ? { rent_amount: { gte: Number(min_rent_amount) } } : {},
      max_rent_amount ? { rent_amount: { lte: Number(max_rent_amount) } } : {},

      rent_currency ? { rent_currency: { in: rent_currency.split(",") } } : {},

      rent_frequency
        ? { rent_frequency: { in: rent_frequency.split(",") } }
        : {},

      min_deposit_amount
        ? { deposit_amount: { gte: Number(min_deposit_amount) } }
        : {},
      max_deposit_amount
        ? { deposit_amount: { lte: Number(max_deposit_amount) } }
        : {},

      min_rent_period
        ? { min_rent_period: { gte: Number(min_rent_period) } }
        : {},
      max_rent_period
        ? { min_rent_period: { lte: Number(max_rent_period) } }
        : {},

      min_bedrooms ? { bedrooms: { gte: Number(min_bedrooms) } } : {},
      max_bedrooms ? { bedrooms: { lte: Number(max_bedrooms) } } : {},

      min_bathrooms ? { bathrooms: { gte: Number(min_bathrooms) } } : {},
      max_bathrooms ? { bathrooms: { lte: Number(max_bathrooms) } } : {},

      min_level ? { level: { gte: Number(min_level) } } : {},
      max_level ? { level: { lte: Number(max_level) } } : {},

      min_adult_no_max
        ? { adult_no_max: { gte: Number(min_adult_no_max) } }
        : {},
      max_adult_no_max
        ? { adult_no_max: { lte: Number(max_adult_no_max) } }
        : {},

      min_child_no_max
        ? { child_no_max: { gte: Number(min_child_no_max) } }
        : {},
      max_child_no_max
        ? { child_no_max: { lte: Number(max_child_no_max) } }
        : {},

      am_pool !== undefined ? { am_pool: am_pool === "true" } : {},
      am_balcony !== undefined ? { am_balcony: am_balcony === "true" } : {},
      am_private_garden !== undefined
        ? { am_private_garden: am_private_garden === "true" }
        : {},
      am_kitchen !== undefined ? { am_kitchen: am_kitchen === "true" } : {},
      am_ac !== undefined ? { am_ac: am_ac === "true" } : {},
      am_heating !== undefined ? { am_heating: am_heating === "true" } : {},
      am_elevator !== undefined ? { am_elevator: am_elevator === "true" } : {},
      am_gym !== undefined ? { am_gym: am_gym === "true" } : {},

      min_available_from
        ? { available_from: { gte: new Date(min_available_from) } }
        : {},
      max_available_to
        ? { available_to: { lte: new Date(max_available_to) } }
        : {},
    ];

    const whereCondition = {
      AND: filters,
    };

    const [ads, totalCount] = await Promise.all([
      prisma.D_Vacation.findMany({
        where: whereCondition,
        skip,
        take: limitNumber,
        orderBy: { created_at: "desc" },
        include: adIncludeRelations,
      }),

      prisma.D_Vacation.count({
        where: whereCondition,
      }),
    ]);

    const cleanedAds = await Promise.all(
      ads.map(async (ad) => {
        const isFavorite = await attachIsFavorite(prisma, ad, userId);

        const formattedAd = formatAdResponse(removeForeignKeys(ad));

        return {
          ...formattedAd,
          isFavorite,
        };
      }),
    );
    res.json({
      data: cleanedAds,
      pagination: {
        total: totalCount,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(totalCount / limitNumber),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server Error",
      error: err.message,
    });
  }
};
exports.getAd = async (req, res) => {
  try {
    const adId = Number(req.params.adId);

    const ad = await prisma.d_Vacation.findUnique({
      where: { id: adId },
      include: adIncludeRelations,
    });

    if (!ad) {
      return res.status(404).json({ message: "Ad not found" });
    }

    const userId = req.user?.id || null;
    const ipAddress = req.ip;

    // 🔥 نحسب active ads لو Subuser
    let activeAdsCountPromise = null;

    if (ad.subuser) {
      activeAdsCountPromise = prisma.d_Vacation.count({
        where: {
          subuser_id: ad.subuser.id,
          status: "ACTIVE",
        },
      });
    }

    await prisma.$transaction(async (tx) => {
      // 1️⃣ increment views
      await tx.d_Vacation.update({
        where: { id: adId },
        data: { views_count: { increment: 1 } },
      });

      // 2️⃣ reach logic
      let reachExists;

      if (userId) {
        reachExists = await tx.adReach.findUnique({
          where: {
            ad_id_user_id: {
              ad_id: adId,
              user_id: userId,
            },
          },
        });

        if (!reachExists) {
          await tx.adReach.create({
            data: { ad_id: adId, user_id: userId },
          });

          await tx.d_Vacation.update({
            where: { id: adId },
            data: { reach_count: { increment: 1 } },
          });
        }
      } else {
        reachExists = await tx.adReach.findUnique({
          where: {
            ad_id_ip_address: {
              ad_id: adId,
              ip_address: ipAddress,
            },
          },
        });

        if (!reachExists) {
          await tx.adReach.create({
            data: { ad_id: adId, ip_address: ipAddress },
          });

          await tx.d_Vacation.update({
            where: { id: adId },
            data: { reach_count: { increment: 1 } },
          });
        }
      }
    });

    // 🔥 نحسب activeAdsCount بعدين
    const activeAdsCount = activeAdsCountPromise
      ? await activeAdsCountPromise
      : 0;

    // 🔥 نجهز listed_by
    let listedBy = null;

    if (ad.admin) {
      listedBy = {
        type: "admin",
        id: ad.admin.id,
        name: process.env.SYSTEM_BRAND_NAME || "Dawaarly",
        phone: ad.admin.phone,
      };
    } else if (ad.subuser) {
      listedBy = {
        type: "subscriber",
        id: ad.subuser.id,
        name: ad.subuser.full_name,
        phone: ad.subuser.phone,
        member_since: ad.subuser.created_at,
        active_ads_count: activeAdsCount,
      };
    }

    // 🔥 تنظيف الإعلان
    let cleanedAd = removeForeignKeys(ad);
    cleanedAd = formatAdResponse(cleanedAd);

    // ❌ نشيل admin & subuser نهائيًا
    delete cleanedAd.admin;
    delete cleanedAd.subuser;

    const isFavorite = await attachIsFavorite(prisma, ad, userId);

    return res.json({
      ...cleanedAd,
      isFavorite,
      listed_by: listedBy,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
exports.getSectionsAds = async (req, res) => {
  try {
    const { type, value, page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const where = {
      status: "ACTIVE",
    };

    if (type === "category") {
      where.categoryId = Number(value);
    }

    if (type === "subCategory") {
      where.subCategoryId = Number(value);
    }

    if (type === "governorate") {
      where.governorate_id = Number(value);
    }

    const ads = await prisma.D_Vacation.findMany({
      where,
      skip: Number(skip),
      take: Number(limit),
      orderBy: { featured_priority: "desc" },
      include: {
        images: true,
      },
    });

    res.json(ads);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};
exports.getMyAds = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const whereCondition = {
      OR: [{ admin_id: req.user.id }, { subuser_id: req.user.id }],
      ...(status ? { status } : {}),
    };

    const [ads, totalCount] = await Promise.all([
      prisma.D_Vacation.findMany({
        where: whereCondition,
        skip,
        take: limitNumber,
        orderBy: { created_at: "desc" },
      }),

      prisma.D_Vacation.count({
        where: whereCondition,
      }),
    ]);

    res.json({
      data: ads,
      pagination: {
        total: totalCount,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(totalCount / limitNumber),
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
// Favorites
exports.addFavorite = async (req, res) => {
  try {
    const { adId } = req.params;
    const fav = await prisma.adFavorite.create({
      data: { ad_id: Number(adId), user_id: req.user.id },
    });
    res.json(fav);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
exports.removeFavorite = async (req, res) => {
  try {
    const { adId } = req.params;
    const fav = await prisma.adFavorite.delete({
      where: { ad_id_user_id: { ad_id: Number(adId), user_id: req.user.id } },
    });
    res.json(fav);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
