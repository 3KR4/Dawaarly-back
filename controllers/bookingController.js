const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/*
========================================
1️⃣ Create Booking
POST /api/bookings
========================================
*/
const createBooking = async (req, res) => {
  try {
    const { ad_id, from_date, to_date } = req.body;
    const user_id = req.user.id;

    if (!ad_id || !from_date || !to_date)
      return res.status(400).json({ message: "Missing required fields" });

    const from = new Date(from_date);
    const to = new Date(to_date);

    if (from >= to)
      return res.status(400).json({ message: "Invalid date range" });

    const ad = await prisma.d_Vacation.findUnique({
      where: { id: Number(ad_id) },
    });

    if (!ad) return res.status(404).json({ message: "Ad not found" });

    if (ad.available_from && from < ad.available_from)
      return res.status(400).json({ message: "Before available_from" });

    if (ad.available_to && to > ad.available_to)
      return res.status(400).json({ message: "After available_to" });

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

      // منع التعارض
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

/*
========================================
2️⃣ Approve Booking (Admin Only)
PUT /api/bookings/approve/:bookingId
========================================
*/
const approveBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    if (req.user.user_type !== "admin")
      return res.status(403).json({ message: "Not authorized" });

    const booking = await prisma.booking.findUnique({
      where: { id: Number(bookingId) },
    });

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.status !== "PENDING")
      return res.status(400).json({ message: "Invalid booking status" });

    await prisma.$transaction(async (tx) => {
      await tx.booking.update({
        where: { id: booking.id },
        data: { status: "BOOKED" },
      });

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
    });

    res.json({ message: "Booking approved successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/*
========================================
3️⃣ Update Booking (Before Approval)
PUT /api/bookings/:bookingId
========================================
*/
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
      data: {
        from_date: from,
        to_date: to,
      },
    });

    res.json({ message: "Booking updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/*
========================================
4️⃣ Update Booking Status (After Approval)
PUT /api/bookings/status/:bookingId
========================================
*/
const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;
    console.log("user who chang the status is:", req.user);

    if (req.user.user_type !== "admin")
      return res.status(403).json({ message: "Not authorized" });

    const validStatuses = ["CLIENT_ARRIVED", "CLIENT_LEFT", "CANCELLED"];

    if (!validStatuses.includes(status))
      return res.status(400).json({ message: "Invalid status" });

    const updated = await prisma.booking.update({
      where: { id: Number(bookingId) },
      data: { status },
    });

    res.json({ message: "Status updated", booking: updated });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ================================
// 5️⃣ Get My Bookings (with pagination)
// GET /api/bookings/my-bookings?page=1&limit=10
// ================================
const getUserBookings = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // فلترة حسب الحالة لو موجودة في الريكوست
    const { status } = req.query;
    const where = { user_id: req.user.id };
    if (status) {
      where.status = status; // فقط الحجز بالحالة المطلوبة
    }

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

    res.json({
      bookings,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
// ================================
// 6️⃣ Get All Bookings (Admin, with pagination)
// GET /api/bookings?page=1&limit=10&status=PENDING
// ================================
const getAllBookings = async (req, res) => {
  try {
    if (req.user.user_type !== "admin")
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

    res.json({
      bookings,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createBooking,
  approveBooking,
  updateBooking,
  updateBookingStatus,
  getUserBookings,
  getAllBookings,
};
