const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/authMiddleware");
const {
  createAd,
  updateAd,
  deleteAd,
  changeAdStatus,
  getAd,
  getAds,
  addFavorite,
  removeFavorite,
  addView,
  rejectAd,
} = require("../controllers/adController");

// Ads CRUD
router.post("/ads", authenticate, createAd);
router.put("/ads/:adId", authenticate, updateAd);
router.delete("/ads/:adId", authenticate, deleteAd);
router.patch("/ads/:adId/status", authenticate, changeAdStatus);

// Get Ads
router.get("/ads/:adId", getAd);
router.get("/ads", getAds);

// Interactions
router.post("/ads/:adId/favorite", authenticate, addFavorite);
router.delete("/ads/:adId/favorite", authenticate, removeFavorite);
router.post("/ads/:adId/view", addView);
router.post("/ads/:adId/reject", authenticate, rejectAd);

module.exports = router;
