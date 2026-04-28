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
  createItem,
  updateItem,
  deleteItem
} = require("../controllers/dataController");

const { authenticate } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/authorize");

// CREATE
router.post(
  "/:model",
  authenticate,
  authorize("ADMIN"),
  createItem
);

// UPDATE
router.put(
  "/:model/:id",
  authenticate,
  authorize("ADMIN"),
  updateItem
);

// DELETE
router.delete(
  "/:model/:id",
  authenticate,
  authorize("ADMIN"),
  deleteItem
);


router.get("/categories", getCategories);
router.get("/subcategories", getSubCategories);

router.get("/countries", getCountries);
router.get("/governorates", getGovernorates);
router.get("/cities", getCities);
router.get("/areas", getAreas);
router.get("/compounds", getCompounds);

module.exports = router;