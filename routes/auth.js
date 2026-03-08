const express = require("express");
const router = express.Router();
const {
  register,
  login,
  refreshToken,
  logout,
  verifyEmail,
  resendOTP,
  deleteUser,
  changePassword,
  getAllUsers,
  updateProfile,
  updatePermissions,
  changeUserRole,
  updateSubuserProfile,
} = require("../controllers/authController");
const { authenticate } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/authorize.JS");

// Auth
router.post("/register", register);
router.post("/login", login);
router.post("/verify-email", verifyEmail);
router.post("/resend-otp", resendOTP);
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
router.delete("/delete/:userId", authenticate, deleteUser);

router.get("/all-users", authenticate, getAllUsers);

module.exports = router;
