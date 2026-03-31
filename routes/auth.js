const express = require("express");
const router = express.Router();
const {
  register,
  login,
  refreshToken,
  logout,
  verifyEmail,
  resendOTP,
  forgotPassword,
  resetPassword,
  deleteUser,
  changePassword,
  getAllUsers,
  updateProfile,
  updatePermissions,
  changeUserRole,
  updateSubuserProfile,
  getUser,
  getMe,
  updateSubscriptionLimit,
  setSuperAdmin,
} = require("../controllers/authController");
const { authenticate } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/authorize.JS");
const { optionalAuth } = require("../middlewares/optionalAuthMiddleware");

// Auth
router.post("/register", register);
router.post("/login", login);
router.post("/verify-email", verifyEmail);
router.post("/resend-otp", resendOTP);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);

// User management
router.patch("/profile", authenticate, updateProfile);

router.patch("/subuser-profile", authenticate, updateSubuserProfile);

router.patch("/change-password", authenticate, changePassword);

router.patch(
  "/:id/role",
  authenticate,
  authorize("SUPER_ADMIN"),
  changeUserRole,
);

router.patch(
  "/:id/permissions",
  authenticate,
  authorize("SUPER_ADMIN"),
  updatePermissions,
);

router.patch(
  "/:id/super-admin",
  authenticate, // لازم المستخدم يكون مسجل دخول
  authorize("SUPER_ADMIN"), // بس الـ SUPER_ADMIN يقدر يعمل ده
  setSuperAdmin,
);

router.patch(
  "/:id/subscription-limit",
  authenticate, // لازم المستخدم يكون مسجل دخول
  updateSubscriptionLimit,
);

router.delete("/delete/:userId", authenticate, deleteUser);

router.get("/users", authenticate, getAllUsers);
router.get("/users/:id", optionalAuth, getUser);
router.get("/me", authenticate, getMe);
module.exports = router;
