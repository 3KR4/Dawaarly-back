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
    const adId = Number(req.params.id);
    const data = req.body;

    const ad = await prisma.D_Vacation.update({
      where: { id: adId },
      data: data,
    });

    res.status(200).json({ message: "Ad updated", ad });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error", error: err.message });
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

  const image = await prisma.adImage.findUnique({
    where: { id: Number(imageId) },
  });

  if (!image) return res.status(404).json({ message: "Image not found" });

  await cloudinary.uploader.destroy(image.public_id);

  await prisma.adImage.delete({
    where: { id: Number(imageId) },
  });

  res.json({ message: "Image deleted" });
};
// Change Ad Status (Admin)
exports.changeAdStatus = async (req, res) => {
  try {
    const { adId } = req.params;
    const { status, reason } = req.body;

    if (!["ACTIVE", "REJECTED", "DISABLED", "SOLD", "BOOKED"].includes(status))
      return res.status(400).json({ message: "Invalid status" });

    const ad = await prisma.D_Vacation.findUnique({
      where: { id: Number(adId) },
    });
    if (!ad) return res.status(404).json({ message: "Ad not found" });

    // If rejected → add reason
    if (status === "REJECTED" && !reason)
      return res.status(400).json({ message: "Reason required for rejection" });

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

    res.json(updatedAd);
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

    const ads = await prisma.D_Vacation.findMany({
      where: {
        AND: [
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

          min_rent_amount
            ? { rent_amount: { gte: Number(min_rent_amount) } }
            : {},
          max_rent_amount
            ? { rent_amount: { lte: Number(max_rent_amount) } }
            : {},
          rent_currency
            ? { rent_currency: { in: rent_currency.split(",") } }
            : {},
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
          am_elevator !== undefined
            ? { am_elevator: am_elevator === "true" }
            : {},
          am_gym !== undefined ? { am_gym: am_gym === "true" } : {},

          min_available_from
            ? { available_from: { gte: new Date(min_available_from) } }
            : {},
          max_available_to
            ? { available_to: { lte: new Date(max_available_to) } }
            : {},
        ],
      },
      orderBy: { created_at: "desc" },
      include: adIncludeRelations,
    });

    res.json(ads);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error", error: err.message });
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
exports.rejectAd = async (req, res) => {
  try {
    const { adId } = req.params;
    const { reason } = req.body;
    if (!reason) return res.status(400).json({ message: "Reason required" });

    const ad = await prisma.D_Vacation.update({
      where: { id: Number(adId) },
      data: { status: "REJECTED" },
    });

    const rejection = await prisma.adRejection.create({
      data: { ad_id: Number(adId), admin_id: req.user.id, reason },
    });

    res.json({ ad, rejection });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
