const express = require("express")
const router = express.Router()
const {
  register,
  login,
  verifyEmail,
  resendOTP,
  updateUser,
  deleteUser,
  changePassword,
  getUserAds,
  getUserBookings,
  getAllUsers
} = require("../controllers/authController")
const { authenticate } = require("../middlewares/authMiddleware")

// Auth
router.post("/register", register)
router.post("/login", login)
router.post("/verify-email", verifyEmail)
router.post("/resend-otp", resendOTP)

// User management
router.put("/user/:userId", authenticate, updateUser)       // تعديل بيانات المستخدم
router.put("/change-password", authenticate, changePassword) // تغيير الباسورد
router.delete("/delete-user", authenticate, deleteUser)    // حذف حساب المستخدم

// User-specific data
router.get("/user-bookings/:userId", authenticate, getUserBookings) // جلب الـ bookings
router.get("/user-ads/:userId", authenticate, getUserAds)           // جلب الـ ads
router.get("/all-users", authenticate, getAllUsers);

module.exports = router