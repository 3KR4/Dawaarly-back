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
  addFavorite,
  removeFavorite,
  getUserAds,
  getSectionsAds,
} = require("../controllers/adController");
const {
  authorizeOwnerOrSuperAdmin,
} = require("../middlewares/authorizeOwnerOrSuperAdmin.js");
const { authorize } = require("../middlewares/authorize.JS");

// Ads CRUD
router.post(
  "/create",
  authenticate,
  authorize("admin", "subscriber"),
  createAd,
);
router.put("/update/:adId", authenticate, authorizeOwnerOrSuperAdmin, updateAd);
router.delete(
  "/delete/:adId",
  authenticate,
  authorizeOwnerOrSuperAdmin,
  deleteAd,
);
router.patch("/update/:adId/status", authenticate, changeAdStatus);

router.get("/all", getAllAds);
router.get("/sections", getSectionsAds);
router.get("/profile/:userId", getUserAds);
router.get("/:adId", getAd); // 👈 دايماً في الآخر

module.exports = router;
