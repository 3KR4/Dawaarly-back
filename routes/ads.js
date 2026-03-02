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
  addView,
} = require("../controllers/adController");
const { authorizeOwnerOrSuperAdmin } = require("../middlewares/authorizeOwnerOrSuperAdmin.js");
const { authorize } = require("../middlewares/authorize.JS");

// Ads CRUD
router.post(
  "/create",
  authenticate,
  authorize("admin", "subscriber"),
  createAd,
);
router.put("/update/:adId", authenticate, authorizeOwnerOrSuperAdmin, updateAd);
router.delete("/delete/:adId", authenticate, authorizeOwnerOrSuperAdmin, deleteAd);
router.patch("/update/:adId/status", authenticate, changeAdStatus);

router.get("/all", getAllAds);
router.get("/:adId", getAd);

// Interactions
router.post("/:adId/favorite", authenticate, addFavorite);
router.delete("/:adId/favorite", authenticate, removeFavorite);

module.exports = router;
