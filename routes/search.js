const express = require("express");
const router = express.Router();
const { headerSearch } = require("../controllers/searchController");
const { optionalAuth } = require("../middlewares/optionalAuthMiddleware");

router.get("/header", optionalAuth, headerSearch);

module.exports = router;
