const express = require("express");
const router = express.Router();

const {
  getCategories,
  getSubCategories,
  getCountries,
  getGovernorates,
  getCities,
  getAreas,
  getCompounds,
} = require("../controllers/selectedDataController");

router.get("/categories", getCategories);
router.get("/subcategories", getSubCategories);

router.get("/countries", getCountries);
router.get("/governorates", getGovernorates);
router.get("/cities", getCities);
router.get("/areas", getAreas);
router.get("/compounds", getCompounds);

module.exports = router;