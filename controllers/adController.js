const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Validation utility
const { validateAdDates, validateRentPeriod } = require("../utils/validation");

// Create Ad
exports.createAd = async (req, res) => {
  try {
    const data = req.body;

    // 1️⃣ Validate dates
    if (!validateAdDates(data.available_from, data.available_to)) {
      return res.status(400).json({ message: "Invalid available dates" });
    }

    // 2️⃣ Validate min rent period
    if (!validateRentPeriod(data.min_rent_period, data.min_rent_period_unit)) {
      return res.status(400).json({ message: "Invalid rent period" });
    }

    const ad = await prisma.d_Vacation.create({
      data: {
        ...data,
        subuser_id: req.user.id,
        status: "PENDING",
      },
    });

    res.status(201).json(ad);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update Ad
exports.updateAd = async (req, res) => {
  try {
    const { adId } = req.params;
    const ad = await prisma.d_Vacation.findUnique({
      where: { id: Number(adId) },
    });

    if (!ad) return res.status(404).json({ message: "Ad not found" });
    if (ad.subuser_id !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    if (ad.status !== "PENDING" && ad.status !== "REJECTED")
      return res.status(400).json({ message: "Cannot edit approved ad" });

    const data = req.body;
    const updatedAd = await prisma.d_Vacation.update({
      where: { id: Number(adId) },
      data,
    });

    res.json(updatedAd);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete Ad
exports.deleteAd = async (req, res) => {
  try {
    const { adId } = req.params;
    const ad = await prisma.d_Vacation.findUnique({
      where: { id: Number(adId) },
    });

    if (!ad) return res.status(404).json({ message: "Ad not found" });
    if (ad.subuser_id !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    await prisma.d_Vacation.delete({ where: { id: Number(adId) } });
    res.json({ message: "Ad deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Change Ad Status (Admin)
exports.changeAdStatus = async (req, res) => {
  try {
    const { adId } = req.params;
    const { status, reason } = req.body;

    if (!["ACTIVE", "REJECTED", "DISABLED", "SOLD", "BOOKED"].includes(status))
      return res.status(400).json({ message: "Invalid status" });

    const ad = await prisma.d_Vacation.findUnique({
      where: { id: Number(adId) },
    });
    if (!ad) return res.status(404).json({ message: "Ad not found" });

    // If rejected → add reason
    if (status === "REJECTED" && !reason)
      return res.status(400).json({ message: "Reason required for rejection" });

    const updatedAd = await prisma.d_Vacation.update({
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
exports.getAd = async (req, res) => {
  try {
    const { adId } = req.params;
    const ad = await prisma.d_Vacation.findUnique({
      where: { id: Number(adId) },
      include: { images: true },
    });

    if (!ad) return res.status(404).json({ message: "Ad not found" });

    res.json(ad);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get all Ads with search and filters
exports.getAds = async (req, res) => {
  try {
    const { title, description, category, min_rent, max_rent } = req.query;

    const ads = await prisma.d_Vacation.findMany({
      where: {
        AND: [
          title ? { title: { contains: title, mode: "insensitive" } } : {},
          description
            ? { description: { contains: description, mode: "insensitive" } }
            : {},
          category ? { category } : {},
          min_rent ? { rent_amount: { gte: Number(min_rent) } } : {},
          max_rent ? { rent_amount: { lte: Number(max_rent) } } : {},
        ],
      },
      orderBy: { created_at: "desc" },
      include: { images: true },
    });

    res.json(ads);
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

    const ad = await prisma.d_Vacation.update({
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
