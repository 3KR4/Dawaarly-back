const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/authMiddleware.js");
const {
  createAd,
  updateAd,
  deleteAd,
  changeAdStatus,
  getAd,
  getAllAds,
  getUserAds,
  getSectionsAds,
  assignAdmin,
} = require("../controllers/adController");
const {
  authorizeOwnerOrSuperAdmin,
} = require("../middlewares/authorizeOwnerOrSuperAdmin.js");
const { authorize } = require("../middlewares/authorize.js");
const { optionalAuth } = require("../middlewares/optionalAuthMiddleware");

// Ads CRUD
router.post("/create", authenticate, authorize("ADMIN", "SUBUSER"), createAd);
router.put("/update/:adId", authenticate, authorizeOwnerOrSuperAdmin, updateAd);
router.delete("/delete/:adId", authenticate, deleteAd);
router.patch("/update/:adId/status", authenticate, changeAdStatus);
router.patch("/assign-admin/:adId", authenticate, assignAdmin);

router.get("/all", optionalAuth, getAllAds);
router.get("/sections", optionalAuth, getSectionsAds);
router.get("/profile/:userId", optionalAuth, getUserAds);
router.get("/:adId", optionalAuth, getAd);

module.exports = router;
