const express = require("express");
const router = express.Router();

const {
  toggleFavorite,
  getFavorites,
} = require("../controllers/adController");

const { authenticate } = require("../middlewares/authMiddleware");

// toggle favorite
router.post(
  "/:table_id/:entity_id",
  authenticate,
  toggleFavorite,
);

// get user favorites
router.get("/", authenticate, getFavorites);

module.exports = router;