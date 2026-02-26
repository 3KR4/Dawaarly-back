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
  rejectAd,
} = require("../controllers/adController");
const { authorizeOwnerOrAdmin } = require("../middlewares/authorizeOwnerOrAdmin.js");
const { authorize } = require("../middlewares/authorize.JS");

// Ads CRUD
router.post(
  "/create",
  authenticate,
  authorize("admin", "subscriber"),
  createAd,
);
router.put("/update/:adId", authenticate, authorizeOwnerOrAdmin, updateAd);
router.delete("/delete/:adId", authenticate, authorizeOwnerOrAdmin, deleteAd);
router.patch("/update/:adId/status", authenticate, changeAdStatus);

router.get("/all", authenticate, getAllAds);
router.get("/:adId", getAd);

// Interactions
router.post("/:adId/favorite", authenticate, addFavorite);
router.delete("/:adId/favorite", authenticate, removeFavorite);
router.post("/:adId/view", addView);

module.exports = router;
