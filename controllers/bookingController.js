// controllers/bookingController.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { validateBookingDates } = require("../utils/validation");

// ================================
// 1️⃣ إنشاء حجز جديد
// ================================
const createBooking = async (req, res) => {
  try {
    const { ad_id, from_date, to_date } = req.body;
    const user_id = req.user.id;

    // تحقق من الحقول الأساسية
    if (!ad_id || !from_date || !to_date)
      return res.status(400).json({ message: "Missing required fields" });

    // تحقق من التواريخ
    if (!validateBookingDates(from_date, to_date))
      return res.status(400).json({ message: "Invalid dates" });

    // تحقق من وجود إعلان
    const ad = await prisma.d_Vacation.findUnique({ where: { id: ad_id } });
    if (!ad) return res.status(404).json({ message: "Ad not found" });

    // تحقق من عدم تعارض التواريخ مع حجوزات أخرى على نفس الإعلان
    const conflicting = await prisma.booking.findFirst({
      where: {
        ad_id,
        status: { in: ["PENDING", "BOOKED"] },
        OR: [
          {
            from_date: { lte: new Date(to_date) },
            to_date: { gte: new Date(from_date) },
          },
        ],
      },
    });
    if (conflicting)
      return res
        .status(400)
        .json({ message: "Dates conflict with another booking" });

    const booking = await prisma.booking.create({
      data: {
        ad_id,
        user_id,
        from_date: new Date(from_date),
        to_date: new Date(to_date),
      },
    });

    res.status(201).json({ message: "Booking created", booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================================
// 2️⃣ تأكيد الحجز من قبل الادمن
// ================================
const approveBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(bookingId) },
    });
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.status !== "PENDING")
      return res.status(400).json({ message: "Booking cannot be approved" });

    const updated = await prisma.booking.update({
      where: { id: booking.id },
      data: { status: "BOOKED" },
    });

    res.json({ message: "Booking approved", booking: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================================
// 3️⃣ تعديل الحجز (قبل الموافقة)
// ================================
const updateBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { from_date, to_date } = req.body;

    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(bookingId) },
    });
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.user_id !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    if (booking.status !== "PENDING")
      return res
        .status(400)
        .json({ message: "Cannot update approved booking" });

    if (!validateBookingDates(from_date, to_date))
      return res.status(400).json({ message: "Invalid dates" });

    const updated = await prisma.booking.update({
      where: { id: booking.id },
      data: {
        from_date: new Date(from_date),
        to_date: new Date(to_date),
      },
    });

    res.json({ message: "Booking updated", booking: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================================
// 4️⃣ تغيير حالة الحجز بعد الموافقة
// ================================
const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(bookingId) },
    });
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // فقط الادمن يقدر يغير بعد الموافقة
    if (req.user.user_type !== "admin")
      return res.status(403).json({ message: "Not authorized" });

    const validStatuses = ["CLIENT_ARRIVED", "CLIENT_LEFT", "CANCELLED"];
    if (!validStatuses.includes(status))
      return res.status(400).json({ message: "Invalid status" });

    const updated = await prisma.booking.update({
      where: { id: booking.id },
      data: { status },
    });

    res.json({ message: "Booking status updated", booking: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================================
// 5️⃣ عرض كل الحجوزات لمستخدم
// ================================
const getUserBookings = async (req, res) => {
  try {
    const user_id = parseInt(req.params.userId);
    const bookings = await prisma.booking.findMany({
      where: { user_id },
      orderBy: { created_at: "desc" },
      include: { ad: true },
    });
    res.json({ bookings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================================
// 6️⃣ عرض كل الحجوزات
// ================================
const getAllBookings = async (req, res) => {
  try {
    const { status } = req.query;
    const where = status ? { status } : {};

    const bookings = await prisma.booking.findMany({
      where,
      orderBy: { created_at: "desc" },
      include: {
        ad: true,
        ad: { include: { country: true, governorate: true, city: true } },
      },
    });
    res.json({ bookings });
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
