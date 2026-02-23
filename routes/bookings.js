// routes/bookingRoutes.js
const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/authMiddleware");
const {
  createBooking,
  approveBooking,
  updateBooking,
  updateBookingStatus,
  getUserBookings,
  getAllBookings,
} = require("../controllers/bookingController");

// إنشاء حجز
router.post("/", authenticate, createBooking);

// تعديل الحجز قبل الموافقة
router.put("/:bookingId", authenticate, updateBooking);

// تأكيد الحجز من قبل الادمن
router.put("/approve/:bookingId", authenticate, approveBooking);

// تغيير حالة الحجز بعد الموافقة (admin)
router.put("/status/:bookingId", authenticate, updateBookingStatus);

// جلب كل الحجوزات لمستخدم
router.get("/user/:userId", authenticate, getUserBookings);

// جلب كل الحجوزات
router.get("/", authenticate, getAllBookings);

module.exports = router;
