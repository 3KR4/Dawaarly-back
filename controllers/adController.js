const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const cloudinary = require("../utils/cloudinary");
const { parseAdData } = require("../utils/convertTypes");
const jwt = require("jsonwebtoken");
// Validation utility
const {
  validateAdDates,
  validateRentPeriod,
  validateNumberField,
} = require("../utils/validation");

// Create Ad

// Create Ad
exports.createAd = async (req, res) => {
  try {
    const data = req.body;

    // ---------------- Required Fields ----------------
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

    const errors = [];

    for (const field of requiredFields) {
      if (
        data[field] === undefined ||
        data[field] === null ||
        data[field] === ""
      ) {
        errors.push({
          field,
          message: `${field} is required`,
        });
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        message: "Validation Error",
        errors, // 🔥 array
      });
    }

    // ---------------- Validate Dates ----------------
    if (data.available_from && data.available_to) {
      if (!validateAdDates(data.available_from, data.available_to)) {
        return res
          .status(400)
          .json({ message: "Invalid available from or available to dates." });
      }
    }

    // ---------------- Validate Rent Period ----------------
    if (data.min_rent_period || data.min_rent_period_unit) {
      if (
        !validateRentPeriod(data.min_rent_period, data.min_rent_period_unit)
      ) {
        return res
          .status(400)
          .json({ message: "Invalid rent period or unit." });
      }
    }

    // ---------------- Validate Numeric Fields ----------------
    const numericFields = [
      "bedrooms",
      "bathrooms",
      "level",
      "adult_no_max",
      "child_no_max",
    ];
    for (const field of numericFields) {
      if (
        data[field] !== undefined &&
        !validateNumberField(data[field], 0, 100)
      ) {
        return res
          .status(400)
          .json({ message: `Invalid value for field "${field}".` });
      }
    }

    // 🔥 FIX: ربط المستخدم بالحقل الصحيح
    const userData = {};
    if (req.user.user_type === "ADMIN") {
      userData.admin_id = req.user.id;
    } else if (req.user.user_type === "SUBUSER") {
      userData.subuser_id = req.user.id;
    }

    // ---------------- Determine Status ----------------
    const isAdmin =
      req.user?.is_super_admin || req.user?.permissions?.includes("create-ads");

    // 🔥 FIX: تعيين approved_at تلقائياً إذا كان الحالة ACTIVE
    const status = isAdmin ? "ACTIVE" : "PENDING";
    const status_changed_at = isAdmin ? new Date() : null;

    // ---------------- Prepare Ad Data ----------------
    const adData = {
      ...data,
      ...userData,
      status,
      status_changed_at,
    };

    // ---------------- Create Ad ----------------
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
      req.user?.permissions?.includes("EDIT_AD") || req.user?.is_super_admin;
    const isOwner =
      existingAd.admin_id === req.user.id ||
      existingAd.subuser_id === req.user.id;

    if (!isOwner && !isAdmin)
      return res.status(403).json({ message: "Access denied" });

    const {
      title,
      description,
      categoryId,
      subCategoryId,
      display_phone,
      display_whatsapp,
      display_dawaarly_contact, // ⬅️ هتتعدل بس لو هو أدمن
      rent_amount,
      rent_currency,
      rent_frequency,
      deposit_amount,
      min_rent_period,
      min_rent_period_unit,
      available_from,
      available_to,
      country_id,
      governorate_id,
      city_id,
      area_id,
      compound_id,
      bedrooms,
      bathrooms,
      level,
      adult_no_max,
      child_no_max,
      am_seeview,
      am_pool,
      am_balcony,
      am_private_garden,
      am_kitchen,
      am_ac,
      am_heating,
      am_elevator,
      am_gym,
      tags,
    } = req.body;

    const dataToUpdate = {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(categoryId !== undefined && { categoryId }),
      ...(subCategoryId !== undefined && { subCategoryId }),
      ...(display_phone !== undefined && { display_phone }),
      ...(display_whatsapp !== undefined && { display_whatsapp }),
      ...(rent_amount !== undefined && { rent_amount }),
      ...(rent_currency !== undefined && { rent_currency }),
      ...(rent_frequency !== undefined && { rent_frequency }),
      ...(deposit_amount !== undefined && { deposit_amount }),
      ...(min_rent_period !== undefined && { min_rent_period }),
      ...(min_rent_period_unit !== undefined && { min_rent_period_unit }),
      ...(available_from !== undefined && {
        available_from: new Date(available_from),
      }),
      ...(available_to !== undefined && {
        available_to: new Date(available_to),
      }),
      ...(country_id !== undefined && { country_id }),
      ...(governorate_id !== undefined && { governorate_id }),
      ...(city_id !== undefined && { city_id }),
      ...(area_id !== undefined && { area_id }),
      ...(compound_id !== undefined && { compound_id }),
      ...(bedrooms !== undefined && { bedrooms }),
      ...(bathrooms !== undefined && { bathrooms }),
      ...(level !== undefined && { level }),
      ...(adult_no_max !== undefined && { adult_no_max }),
      ...(child_no_max !== undefined && { child_no_max }),
      ...(am_seeview !== undefined && { am_seeview }),
      ...(am_pool !== undefined && { am_pool }),
      ...(am_balcony !== undefined && { am_balcony }),
      ...(am_private_garden !== undefined && { am_private_garden }),
      ...(am_kitchen !== undefined && { am_kitchen }),
      ...(am_ac !== undefined && { am_ac }),
      ...(am_heating !== undefined && { am_heating }),
      ...(am_elevator !== undefined && { am_elevator }),
      ...(am_gym !== undefined && { am_gym }),
      ...(tags !== undefined && { tags }),
    };

    // ⚠️ لو اليوزر مش أدمن، منمنع تعديل حقل display_dawaarly_contact
    if (!isAdmin && display_dawaarly_contact !== undefined) {
      return res
        .status(403)
        .json({ message: "Only admins can modify dawaarly contact display" });
    }

    if (isAdmin && display_dawaarly_contact !== undefined) {
      dataToUpdate.display_dawaarly_contact = display_dawaarly_contact;
    }

    // featured_priority للأدمن فقط
    if (!isAdmin && "featured_priority" in req.body) {
      delete req.body.featured_priority;
    }

    if (isAdmin && "featured_priority" in req.body) {
      let fp = Number(req.body.featured_priority);
      if (isNaN(fp) || fp < 1 || fp > 10) fp = 0;
      dataToUpdate.featured_priority = fp;
    }

    // لو مش أدمن وعدل إعلان فعال، يرجع PENDING
    if (!isAdmin && existingAd.status === "ACTIVE") {
      dataToUpdate.status = "PENDING";
      dataToUpdate.was_previously_approved = true;
      dataToUpdate.status_changed_at = null;
    }

    const updatedAd = await prisma.D_Vacation.update({
      where: { id: adId },
      data: dataToUpdate,
    });

    res.json({ message: "Ad updated successfully", ad: updatedAd });
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
      req.user.is_super_admin || req.user.permissions?.includes("DELETE_AD");

    if (!isOwner && !canDelete)
      return res.status(403).json({ message: "Access denied" });

    const images = await prisma.Images.findMany({
      where: { id: adId },
    });

    for (const img of images) {
      await cloudinary.uploader.destroy(img.public_id);
    }

    await prisma.D_Vacation.delete({
      where: { id: adId },
    });

    res.json({ message: "Ad deleted successfully" });
  } catch (err) {
    console.log(err);

    res.status(500).json({ message: "Server Error" });
  }
};
// Change Ad Status (Admin)
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
    let rejectReason;
    if (status === "REJECTED") {
      if (!isAdmin)
        return res.status(403).json({
          message: "Only admin can reject ads",
        });

      if (!reason)
        return res.status(400).json({
          message: "Reason required for rejection",
        });

      rejectReason = reason;
    }

    // 🔹 تحديث الإعلان
    const updatedAd = await prisma.D_Vacation.update({
      where: { id: Number(adId) },
      data: {
        status,
        ...(rejectReason && { rejectReason }), // فقط لو REJECTED
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
// controllers/assignAdmin.js
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
const adIncludeRelations = {
  admin: {
    select: {
      id: true,
      full_name: true,
      phone: true,
      email: true,
      user_type: true,
    },
  },
  subuser: {
    select: {
      id: true,
      full_name: true,
      phone: true,
      email: true,
      user_type: true,
      tiktok_link: true,
      facebook_link: true,
      active_ads_count: true,
      created_at: true,
    },
  },
  Categories: { select: { id: true, name_en: true, name_ar: true } },
  SubCategories: { select: { id: true, name_en: true, name_ar: true } },
  country: { select: { id: true, name_en: true, name_ar: true } },
  governorate: { select: { id: true, name_en: true, name_ar: true } },
  city: { select: { id: true, name_en: true, name_ar: true } },
  area: { select: { id: true, name_en: true, name_ar: true } },
  compound: { select: { id: true, name_en: true, name_ar: true } },
  Booking: {
    where: {
      status: { in: ["PENDING", "BOOKED"] },
    },
    select: {
      id: true,
      from_date: true,
      to_date: true,
      status: true,
    },
  },
};
const adIncludeListRelations = {
  city: { select: { id: true, name_en: true, name_ar: true } },
  governorate: { select: { id: true, name_en: true, name_ar: true } },
  area: { select: { id: true, name_en: true, name_ar: true } },
  compound: { select: { id: true, name_en: true, name_ar: true } },
  Categories: { select: { id: true, name_en: true, name_ar: true } },
  SubCategories: { select: { id: true, name_en: true, name_ar: true } },
  admin: {
    select: {
      id: true,
      full_name: true,
      phone: true,
      email: true,
      user_type: true,
    },
  },

  subuser: {
    select: {
      id: true,
      full_name: true,
      phone: true,
      email: true,
      user_type: true,
      tiktok_link: true,
      facebook_link: true,
      active_ads_count: true,
      created_at: true,
    },
  },
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

async function attachIsFavorite(tx, ad, userId) {
  console.log("tx:", tx);
  console.log("ad:", ad);
  console.log("userId:", userId);

  if (!userId) return false;
  const fav = await tx.AdFavorite.findUnique({
    where: {
      ad_id_user_id: { ad_id: ad.id, user_id: userId },
    },
  });
  return !!fav;
}

function formatAdResponse(ad) {
  // 🎯 1. ننظف الـ foreign keys أولاً
  const adWithoutForeignKeys = removeForeignKeys(ad);

  const amenities = {};
  const unitDetails = {};

  Object.keys(adWithoutForeignKeys).forEach((key) => {
    // جمع am_
    if (key.startsWith("am_")) {
      amenities[key.replace("am_", "")] = adWithoutForeignKeys[key];
    }

    // جمع unit details
    if (["bedrooms", "bathrooms", "level"].includes(key)) {
      unitDetails[key] = adWithoutForeignKeys[key];
    }
  });

  // نحذف القيم القديمة
  const cleaned = { ...adWithoutForeignKeys };

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

function formatAdListResponse(ad) {
  const details = {};

  Object.keys(ad).forEach((key) => {
    if (["bedrooms", "bathrooms", "level"].includes(key)) {
      details[key] = ad[key];
    }
  });

  const firstImage =
    ad.images?.find((img) => img.is_cover) || ad.images?.[0] || null;

  return {
    id: ad.id,
    title: ad.title,
    rent_amount: ad.rent_amount,
    deposit_amount: ad.deposit_amount,
    rent_currency: ad.rent_currency,
    rent_frequency: ad.rent_frequency,
    status: ad.status,
    featured_priority: ad.featured_priority,
    created_at: ad.created_at,
    city: ad.city,
    governorate: ad.governorate,
    area: ad.area,
    compound: ad.compound,
    Categories: ad.Categories,
    SubCategories: ad.SubCategories,
    views_count: ad.views_count,
    reach_count: ad.reach_count,
    image: firstImage,
    details,
  };
}

async function enrichAd(ad, userId, imageLength = "cover") {
  let fetchedImages = [];

  if (imageLength === "all-image") {
    // جميع الصور
    fetchedImages = await prisma.Images.findMany({
      where: { entity_type: "AD", entity_id: ad.id },
      orderBy: { is_cover: "desc" },
    });
  } else {
    // أول صورة (cover أو أول صورة موجودة)
    const firstImage = await prisma.Images.findFirst({
      where: { entity_type: "AD", entity_id: ad.id },
      orderBy: { is_cover: "desc" },
    });
    if (firstImage) {
      fetchedImages = [firstImage];
    }
  }

  // عدد المفضلات
  const favoritesCount = await prisma.AdFavorite.count({
    where: { ad_id: ad.id },
  });

  // هل هو في المفضلة للمستخدم الحالي
  const isFavorite = await attachIsFavorite(prisma, ad, userId);

  // تنسيق الإعلان (formatAdListResponse)
  const formattedAd =
    imageLength == "cover" ? formatAdListResponse(ad) : formatAdResponse(ad);

  return {
    ...formattedAd,
    image: fetchedImages,
    favoritesCount,
    isFavorite,
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

        isAdmin = decoded.is_super_admin || decoded.user_type === "ADMIN";
      } catch (err) {
        console.log("Invalid token", err);
      }
    }
    if (!isAdmin) {
      statusFilter = {
        status: "ACTIVE",
      };
    } else {
      if (status && status.trim() !== "") {
        statusFilter = { status: status.trim() };
      } else {
        statusFilter = {
          NOT: { status: "PENDING" },
        };
      }
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
        include: adIncludeListRelations,
      }),

      prisma.D_Vacation.count({
        where: whereCondition,
      }),
    ]);

    const cleanedAds = await Promise.all(ads.map((ad) => enrichAd(ad, userId)));
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

    // ✅ جلب الإعلان مع كل العلاقات
    const ad = await prisma.d_Vacation.findUnique({
      where: { id: adId },
      include: adIncludeRelations,
    });

    if (!ad) {
      return res.status(404).json({ message: "Ad not found" });
    }

    const userId = req.user?.id || null;
    const ipAddress = req.ip;

    // 🔥 activeAdsCount لو فيه Subuser
    const activeAdsCount = ad.subuser
      ? await prisma.d_Vacation.count({
          where: { subuser_id: ad.subuser.id, status: "ACTIVE" },
        })
      : 0;

    // 🔥 reach logic
    async function handleReach(tx) {
      if (userId) {
        const reachExists = await tx.adReach.findUnique({
          where: { ad_id_user_id: { ad_id: adId, user_id: userId } },
        });
        if (!reachExists) {
          await tx.adReach.create({ data: { ad_id: adId, user_id: userId } });
          await tx.d_Vacation.update({
            where: { id: adId },
            data: { reach_count: { increment: 1 } },
          });
        }
      } else {
        const reachExists = await tx.adReach.findUnique({
          where: { ad_id_ip_address: { ad_id: adId, ip_address: ipAddress } },
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
    }

    // ✅ تحديث المشاهدات والـ reach
    await prisma.$transaction(async (tx) => {
      await tx.d_Vacation.update({
        where: { id: adId },
        data: { views_count: { increment: 1 } },
      });

      await handleReach(tx);
    });

    // ✅ استخدام enrichAd مع all-image عشان نجيب كل التفاصيل وكل الصور
    const enrichedAd = await enrichAd(ad, userId, "all-image");

    return res.json({
      ...enrichedAd,
      admin: ad.admin || null,
      subuser: ad.subuser
        ? { ...ad.subuser, active_ads_count: activeAdsCount }
        : null,
      Categories: ad.Categories,
      SubCategories: ad.SubCategories,
      country: ad.country,
      governorate: ad.governorate,
      city: ad.city,
      area: ad.area,
      compound: ad.compound,
      Booking: ad.Booking,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getSectionsAds = async (req, res) => {
  const userId = req.user?.id || null;

  try {
    const { type, value, page = 1, limit = 10 } = req.query;

    const pageNumber = Math.max(1, Number(page));
    const limitNumber = Math.max(1, Number(limit));
    const skip = (pageNumber - 1) * limitNumber;

    const allowedTypes = ["category", "subCategory", "governorate", "city"];

    if (type && !allowedTypes.includes(type)) {
      return res.status(400).json({ message: "Invalid type" });
    }

    if (type && !value) {
      return res.status(400).json({ message: "Value is required with type" });
    }

    // 👇 ده الـ where الصح
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

    if (type === "city") {
      where.city_id = Number(value);
    }

    const [ads, totalCount] = await Promise.all([
      prisma.D_Vacation.findMany({
        where, // ✅ كان الخطأ هنا
        skip,
        take: limitNumber,
        orderBy: { created_at: "desc" },
        include: adIncludeListRelations,
      }),

      prisma.D_Vacation.count({
        where, // ✅ نفس الغلطة هنا
      }),
    ]);

    const cleanedAds = await Promise.all(ads.map((ad) => enrichAd(ad, userId)));

    return res.json({
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
    return res.status(500).json({ message: "Server Error" });
  }
};

exports.getUserAds = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, search, page = 1, limit = 10 } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const currentUser = req.user;

    let isAdmin = false;
    let isOwner = false;

    if (currentUser) {
      isAdmin = currentUser.user_type === "ADMIN";
      isOwner = Number(userId) === currentUser.id;
    }

    const validStatuses = ["ACTIVE", "PENDING", "REJECTED", "DISABLED"];

    let statusFilter = {};

    if (!isAdmin && !isOwner) {
      statusFilter = {
        status: "ACTIVE",
      };
    } else {
      if (
        status &&
        typeof status === "string" &&
        status.trim() !== "" &&
        validStatuses.includes(status.trim())
      ) {
        statusFilter = { status: status.trim() };
      }
    }
    // ✅ search filter
    const searchFilter = search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
            { tags: { has: search } },
          ],
        }
      : {};

    // ✅ final where condition
    const whereCondition = {
      OR: [{ admin_id: Number(userId) }, { subuser_id: Number(userId) }],
      ...statusFilter,
      ...searchFilter,
    };

    const [ads, totalCount] = await Promise.all([
      prisma.D_Vacation.findMany({
        where: whereCondition,
        skip,
        take: limitNumber,
        orderBy: { created_at: "desc" },
        include: adIncludeListRelations,
      }),
      prisma.D_Vacation.count({ where: whereCondition }),
    ]);

    const cleanedAds = await Promise.all(ads.map((ad) => enrichAd(ad)));

    res.json({
      data: cleanedAds,
      pagination: {
        total: totalCount,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(totalCount / limitNumber),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.toggleFavorite = async (req, res) => {
  try {
    const userId = req.user.id;
    const adId = Number(req.params.adId);

    // التأكد من وجود الإعلان
    const ad = await prisma.d_Vacation.findUnique({ where: { id: adId } });
    if (!ad) return res.status(404).json({ message: "Ad not found" });

    // نتحقق هل الإعلان موجود في المفضلة
    const existing = await prisma.AdFavorite.findUnique({
      where: { ad_id_user_id: { ad_id: adId, user_id: userId } },
    });

    let message;
    if (existing) {
      // لو موجود، نحذفه
      await prisma.AdFavorite.delete({
        where: { ad_id_user_id: { ad_id: adId, user_id: userId } },
      });
      message = "Removed from favorites";
    } else {
      // لو مش موجود، نضيفه
      await prisma.AdFavorite.create({
        data: { ad_id: adId, user_id: userId },
      });
      message = "Added to favorites";
    }

    // تحديث عدد المفضلات في الإعلان
    const favoritesCount = await prisma.AdFavorite.count({
      where: { ad_id: adId },
    });

    res.json({ message, favoritesCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // ✅ جلب المفضلات مع الإعلانات (من غير images)
    const [favorites, totalCount] = await Promise.all([
      prisma.AdFavorite.findMany({
        where: { user_id: userId },
        skip,
        take: limitNumber,
        orderBy: { id: "desc" },
        include: {
          ad: {
            include: {
              // ❌ مش هنحط images هنا
              city: { select: { id: true, name_en: true, name_ar: true } },
              governorate: {
                select: { id: true, name_en: true, name_ar: true },
              },
              area: { select: { id: true, name_en: true, name_ar: true } },
              compound: { select: { id: true, name_en: true, name_ar: true } },
              Categories: {
                select: { id: true, name_en: true, name_ar: true },
              },
              SubCategories: {
                select: { id: true, name_en: true, name_ar: true },
              },
              admin: {
                select: {
                  id: true,
                  full_name: true,
                  phone: true,
                  email: true,
                  user_type: true,
                },
              },
              subuser: {
                select: {
                  id: true,
                  full_name: true,
                  phone: true,
                  email: true,
                  user_type: true,
                  tiktok_link: true,
                  facebook_link: true,
                  active_ads_count: true,
                  created_at: true,
                },
              },
            },
          },
        },
      }),
      prisma.AdFavorite.count({ where: { user_id: userId } }),
    ]);

    // ✅ تنسيق كل إعلان باستخدام enrichAd (نفس اللي في getSectionsAds)
    // ✅ enrichAd هي المسؤولة عن جلب الصور
    const cleanedFavorites = await Promise.all(
      favorites.map((fav) => enrichAd(fav.ad, userId)),
    );

    res.json({
      data: cleanedFavorites,
      pagination: {
        total: totalCount,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(totalCount / limitNumber),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
