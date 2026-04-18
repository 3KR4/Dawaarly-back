const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const calculateTotalPrice = (ad, from_date, to_date) => {
  const diffDays = Math.ceil(
    (new Date(to_date) - new Date(from_date)) / (1000 * 60 * 60 * 24),
  );

  if (!ad.rent_amount) return null;

  switch (ad.rent_frequency) {
    case "DAY":
      return ad.rent_amount * diffDays;
    case "WEEK":
      return ad.rent_amount * Math.ceil(diffDays / 7);
    case "MONTH":
      return ad.rent_amount * Math.ceil(diffDays / 30);
    case "YEAR":
      return ad.rent_amount * Math.ceil(diffDays / 365);
    default:
      return null;
  }
};

const createBooking = async (req, res) => {
  try {
    const { ad_id, from_date, to_date } = req.body;
    const user_id = req.user.id;

    if (!ad) return res.status(404).json({ message: "Ad not found" });
    // ❌ منع صاحب الإعلان من الحجز
    if (ad.admin_id === user_id || ad.subuser_id === user_id) {
      return res.status(403).json({ message: "You cannot book your own ad" });
    }

    if (ad.status !== "ACTIVE") {
      return res.status(400).json({ message: "Ad not available for booking" });
    }

    if (!Number(ad_id) || !from_date || !to_date)
      return res.status(400).json({ message: "Missing required fields" });

    const from = new Date(from_date);
    const to = new Date(to_date);

    if (from >= to)
      return res.status(400).json({ message: "Invalid date range" });

    const ad = await prisma.D_Vacation.findUnique({
      where: { id: Number(ad_id) },
    });


    if (ad.available_from && from < ad.available_from)
      return res.status(400).json({ message: "Before available from" });

    if (ad.available_to && to > ad.available_to)
      return res.status(400).json({ message: "After available to" });

    const diffDays = (to - from) / (1000 * 60 * 60 * 24);

    if (ad.min_rent_period) {
      if (ad.min_rent_period_unit === "DAY" && diffDays < ad.min_rent_period)
        return res.status(400).json({ message: "Less than minimum days" });

      if (
        ad.min_rent_period_unit === "MONTH" &&
        diffDays < ad.min_rent_period * 30
      )
        return res.status(400).json({ message: "Less than minimum months" });
    }

    await prisma.$transaction(async (tx) => {
      // منع حجز مكرر لنفس المستخدم
      const existingUserBooking = await tx.booking.findFirst({
        where: {
          ad_id: Number(ad_id),
          user_id,
          status: { in: ["PENDING", "BOOKED"] },
        },
      });

      if (existingUserBooking)
        throw new Error("You already have a booking for this ad");

      // منع التعارض مع حجوزات تانية
      const conflicting = await tx.booking.findFirst({
        where: {
          ad_id: Number(ad_id),
          status: { in: ["PENDING", "BOOKED"] },
          AND: [{ from_date: { lt: to } }, { to_date: { gt: from } }],
        },
      });

      if (conflicting) throw new Error("Dates conflict with another booking");

      await tx.booking.create({
        data: {
          ad_id: Number(ad_id),
          user_id,
          from_date: from,
          to_date: to,
          status: "PENDING",
        },
      });
    });

    res.status(201).json({ message: "Booking created and pending approval" });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body; // BOOKED, CLIENT_ARRIVED, CLIENT_LEFT, CANCELLED

    const booking = await prisma.booking.findUnique({
      where: { id: Number(bookingId) },
      include: { ad: true },
    });

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // ✅ التحقق من الصلاحية: سوبر أدمن أو admin_id تبع الإعلان
    const isSuperAdmin = req.user.is_super_admin;
    const isAssignedAdmin = booking.ad.admin_id === req.user.id;

    if (!isSuperAdmin && !isAssignedAdmin) {
      return res
        .status(403)
        .json({ message: "Not authorized to manage this booking" });
    }

    const validStatuses = [
      "BOOKED",
      "CLIENT_ARRIVED",
      "CLIENT_LEFT",
      "CANCELLED",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    await prisma.$transaction(async (tx) => {
      await tx.booking.update({
        where: { id: booking.id },
        data: { status },
      });

      // إذا تمت الموافقة (BOOKED)، نلغي باقي الحجوزات المتعارضة
      if (status === "BOOKED") {
        await tx.booking.updateMany({
          where: {
            ad_id: booking.ad_id,
            id: { not: booking.id },
            status: "PENDING",
            AND: [
              { from_date: { lt: booking.to_date } },
              { to_date: { gt: booking.from_date } },
            ],
          },
          data: { status: "CANCELLED" },
        });
      }
    });

    res.json({ message: `Booking ${status.toLowerCase()} successfully` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const updateBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { from_date, to_date } = req.body;

    const booking = await prisma.booking.findUnique({
      where: { id: Number(bookingId) },
    });

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.user_id !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    if (booking.status !== "PENDING")
      return res
        .status(400)
        .json({ message: "Cannot update approved booking" });

    const from = new Date(from_date);
    const to = new Date(to_date);

    await prisma.booking.update({
      where: { id: booking.id },
      data: { from_date: from, to_date: to },
    });

    res.json({ message: "Booking updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { status } = req.query;
    const where = { user_id: req.user.id };
    if (status) where.status = status;

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        orderBy: { created_at: "desc" },
        skip,
        take: limit,
        include: {
          ad: {
            include: {
              country: true,
              governorate: true,
              city: true,
            },
          },
        },
      }),
      prisma.booking.count({ where }),
    ]);

    const bookingsWithPrice = bookings.map((b) => ({
      ...b,
      total_price: calculateTotalPrice(b.ad, b.from_date, b.to_date),
    }));

    res.json({
      bookings: bookingsWithPrice,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllBookings = async (req, res) => {
  try {
    if (req.user.user_type !== "ADMIN")
      return res.status(403).json({ message: "Not authorized" });

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { status } = req.query;
    const where = status ? { status } : {};

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        orderBy: { created_at: "desc" },
        skip,
        take: limit,
        include: {
          ad: {
            include: {
              country: true,
              governorate: true,
              city: true,
            },
          },
          user: true,
        },
      }),
      prisma.booking.count({ where }),
    ]);

    const bookingsWithPrice = bookings.map((b) => ({
      ...b,
      total_price: calculateTotalPrice(b.ad, b.from_date, b.to_date),
    }));

    res.json({
      bookings: bookingsWithPrice,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getBookingsByAd = async (req, res) => {
  try {
    const adId = Number(req.params.adId);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { status } = req.query;
    const where = { ad_id: adId };
    if (status) where.status = status;

    // التحقق من وجود الإعلان
    const ad = await prisma.D_Vacation.findUnique({
      where: { id: adId },
    });

    if (!ad) return res.status(404).json({ message: "Ad not found" });

    // صلاحية: صاحب الإعلان أو أدمن
    const isOwner =
      ad.admin_id === req.user.id || ad.subuser_id === req.user.id;
    const isAdmin = req.user.user_type === "ADMIN";

    if (!isOwner && !isAdmin) {
      return res
        .status(403)
        .json({ message: "Not authorized to view these bookings" });
    }

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        orderBy: { created_at: "desc" },
        skip,
        take: limit,
        include: { user: true },
      }),
      prisma.booking.count({ where }),
    ]);

    const bookingsWithPrice = bookings.map((b) => ({
      ...b,
      total_price: calculateTotalPrice(ad, b.from_date, b.to_date),
    }));

    res.json({
      bookings: bookingsWithPrice,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createBooking,
  updateBookingStatus,
  updateBooking,
  getUserBookings,
  getAllBookings,
  getBookingsByAd,
};
