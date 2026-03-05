const express = require("express");
const router = express.Router();
const {
  register,
  login,
  refreshToken,
  logout,
  verifyEmail,
  resendOTP,
  updateUser,
  deleteUser,
  changePassword,
  getUserAds,
  getUserBookings,
  getAllUsers
} = require("../controllers/authController");
const { authenticate } = require("../middlewares/authMiddleware");

// Auth
router.post("/register", register);
router.post("/login", login);
router.post("/verify-email", verifyEmail);
router.post("/resend-otp", resendOTP);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);

// User management
router.put("/user/:userId", authenticate, updateUser);
router.put("/change-password", authenticate, changePassword);
router.delete("/delete-user", authenticate, deleteUser);

router.get("/all-users", authenticate, getAllUsers);

module.exports = router;