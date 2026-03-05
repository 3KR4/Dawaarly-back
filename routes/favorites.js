const express = require("express");
const router = express.Router();
const {
  toggleFavorite,
  getFavorites,
} = require("../controllers/adController.js");
const { authenticate } = require("../middlewares/authMiddleware.js");

// إضافة أو إزالة من المفضلة
router.post("/:adId", authenticate, toggleFavorite);

// جلب قائمة المفضلة
router.get("/", authenticate, getFavorites);

module.exports = router;
