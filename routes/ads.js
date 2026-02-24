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

// Ads CRUD
router.post("/create", authenticate, createAd);
router.put("/update/:adId", authenticate, updateAd);
router.delete("/delete/:adId", authenticate, deleteAd);
router.patch("/update/:adId/status", authenticate, changeAdStatus);

router.get("/all", getAllAds);
router.get("/:adId", getAd);

// Interactions
router.post("/:adId/favorite", authenticate, addFavorite);
router.delete("/:adId/favorite", authenticate, removeFavorite);
router.post("/:adId/view", addView);
router.post("/:adId/reject", authenticate, rejectAd);

module.exports = router;
