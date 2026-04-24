const express = require("express");
const router = express.Router();
const {
  createSlider,
  updateSlider,
  deleteSlider,
  getSliders,
  getOneSlider,
} = require("../controllers/slidersController");
const { authenticate } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/authorize.js");
const { optionalAuth } = require("../middlewares/optionalAuthMiddleware.js");

router.post("/", authenticate, authorize("ADMIN"), createSlider);
router.patch("/:id", authenticate, authorize("ADMIN"), updateSlider);
router.delete("/:id", authenticate, authorize("ADMIN"), deleteSlider);
router.get("/", optionalAuth, getSliders);
router.get("/:id", authenticate, authorize("ADMIN"), getOneSlider);

module.exports = router;
