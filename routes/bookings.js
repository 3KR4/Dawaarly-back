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

// موافقة الادمن
router.put("/approve/:bookingId", authenticate, approveBooking);

// تغيير الحالة بعد الموافقة
router.put("/status/:bookingId", authenticate, updateBookingStatus);

// تعديل الحجز
router.put("/:bookingId", authenticate, updateBooking);

// حجوزاتي انا
router.get("/my-bookings", authenticate, getUserBookings);

// كل الحجوزات (admin فقط يفضل)
router.get("/", authenticate, getAllBookings);

module.exports = router;