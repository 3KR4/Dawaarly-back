const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/authMiddleware");
const {
  createBooking,
  updateBookingStatus,
  updateBooking,
  getUserBookings,
  getAllBookings,
  getBookingsByAd,
} = require("../controllers/bookingController");

router.post("/", authenticate, createBooking);

router.put("/:bookingId/status", authenticate, updateBookingStatus);

router.put("/:bookingId", authenticate, updateBooking);

router.get("/my-bookings", authenticate, getUserBookings);

router.get("/", authenticate, getAllBookings);

router.get("/ad/:adId", authenticate, getBookingsByAd);

module.exports = router;