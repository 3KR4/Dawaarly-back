const express = require("express");
const router = express.Router();
const {
  toggleFavorite,
  getFavorites,
} = require("../controllers/adController.js");
const { authorize } = require("../middlewares/authorize.JS");

router.post("/sliders", authorize("admin"), createSlider);
router.get("/sliders", getSliders);
router.patch("/sliders/:id", authorize("admin"), updateSlider);
router.delete("/sliders/:id", authorize("admin"), deleteSlider);

module.exports = router;
