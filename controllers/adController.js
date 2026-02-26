const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const cloudinary = require("../utils/cloudinary");
const { parseAdData } = require("../utils/convertTypes");

// Validation utility
const { validateAdDates, validateRentPeriod } = require("../utils/validation");

// Create Ad
exports.createAd = async (req, res) => {
  try {
    const data = req.body;

    // تعيين الـ user المناسب مباشرة
    const userData = {};
    if (req.user.user_type === "admin") userData.admin_id = req.user.id;
    else userData.subuser_id = req.user.id;

    const adData = {
      ...data,
      ...userData,
      status: "PENDING", // الافتراضي
    };

    // إنشاء الإعلان
    const ad = await prisma.D_Vacation.create({ data: adData });

    res.status(201).json({ message: "Ad created", adId: ad.id });
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

    if (!existingAd)
      return res.status(404).json({ message: "Ad not found" });

    const allowedFields = [
      "title",
      "description",
      "categoryId",
      "subCategoryId",
      "display_phone",
      "display_whatsapp",
      "display_dawaarly_contact",
      "rent_amount",
      "rent_currency",
      "rent_frequency",
      "deposit_amount",
      "min_rent_period",
      "min_rent_period_unit",
      "available_from",
      "available_to",
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

    const filteredData = Object.fromEntries(
      Object.entries(req.body).filter(([key]) =>
        allowedFields.includes(key)
      )
    );

    // 🚫 منع update فاضي
    if (Object.keys(filteredData).length === 0) {
      return res.status(400).json({
        message: "No valid fields provided for update",
      });
    }

    if (filteredData.available_from)
      filteredData.available_from = new Date(filteredData.available_from);

    if (filteredData.available_to)
      filteredData.available_to = new Date(filteredData.available_to);

    const updatedAd = await prisma.D_Vacation.update({
      where: { id: adId },
      data: filteredData,
    });

    res.status(200).json({
      message: "Ad updated successfully",
      ad: updatedAd,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server Error",
      error: err.message,
    });
  }
};
// Delete Ad
exports.deleteAd = async (req, res) => {
  try {
    const { adId } = req.params;

    // حذف الصور من Cloudinary
    const images = await prisma.AdImage.findMany({
      where: { ad_id: Number(adId) },
    });

    for (const img of images) {
      await cloudinary.uploader.destroy(img.public_id);
    }

    await prisma.D_Vacation.delete({
      where: { id: Number(adId) },
    });

    res.json({ message: "Ad deleted successfully" });
  } catch (err) {
    console.error(err);
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

    if (!ad)
      return res.status(404).json({ message: "Ad not found" });

    const isAdmin =
      req.user?.is_super_admin ||
      req.user?.roles?.includes("admin");

    const isOwner =
      ad.admin_id === req.user.id ||
      ad.subuser_id === req.user.id;

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
      if (!isOwner)
        return res.status(403).json({ message: "Access denied" });

      if (status !== "DISABLED") {
        return res.status(403).json({
          message: "You can only disable your own ad",
        });
      }
    }

    // لو Reject لازم سبب (Admin فقط)
    if (status === "REJECTED") {
      if (!isAdmin)
        return res.status(403).json({
          message: "Only admin can reject ads",
        });

      if (!reason)
        return res.status(400).json({
          message: "Reason required for rejection",
        });
    }

    const updatedAd = await prisma.D_Vacation.update({
      where: { id: Number(adId) },
      data: { status },
    });

    if (status === "REJECTED") {
      await prisma.adRejection.create({
        data: {
          ad_id: Number(adId),
          admin_id: req.user.id,
          reason,
        },
      });
    }

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
  admin: { select: { id: true, full_name: true, email: true } },
  subuser: { select: { id: true, full_name: true, email: true } },
  Categories: { select: { id: true, name_en: true, name_ar: true } },
  SubCategories: { select: { id: true, name_en: true, name_ar: true } },
  country: { select: { id: true, name_en: true, name_ar: true } },
  governorate: { select: { id: true, name_en: true, name_ar: true } },
  city: { select: { id: true, name_en: true, name_ar: true } },
  area: { select: { id: true, name_en: true, name_ar: true } },
  compound: { select: { id: true, name_en: true, name_ar: true } },
};

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

    const isAdmin =
      req.user?.is_super_admin || req.user?.user_type?.includes("admin");

    let statusFilter;

    if (isAdmin) {
      // الأدمن يقدر يفلتر بأي status
      statusFilter = status ? { status } : {};
    } else {
      // أي حد غير الأدمن يشوف ACTIVE بس
      statusFilter = { status: "ACTIVE" };
    }
    console.log("statusFilter:", statusFilter);
    console.log("req.user:", req.user);

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

    res.json({
      data: ads,
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
    const { adId } = req.params;
    const ad = await prisma.D_Vacation.findUnique({
      where: { id: Number(adId) },
      include: adIncludeRelations,
    });
    if (!ad) return res.status(404).json({ message: "Ad not found" });
    res.json(ad);
  } catch (err) {
    console.error(err);
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
// Add view
exports.addView = async (req, res) => {
  try {
    const { adId } = req.params;
    const view = await prisma.adView.create({
      data: { ad_id: Number(adId), user_id: req.user?.id, ip_address: req.ip },
    });
    res.json(view);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
// Reject Ad
