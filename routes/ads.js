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
  getUserAds,
  getSectionsAds,
  assignAdmin,
  requestAdRenewal,
  renewAdActiveTime,
} = require("../controllers/adController");
const {
  authorizeOwnerOrSuperAdmin,
  
} = require("../middlewares/authorizeOwnerOrSuperAdmin.js");
const { authorize } = require("../middlewares/authorize.js");
const { optionalAuth } = require("../middlewares/optionalAuthMiddleware");

// Ads CRUD
router.post(
  "/create/:table_id",
  optionalAuth,
  createAd,
);
router.patch(
  "/update/:table_id/:adId",
  authenticate,
  authorizeOwnerOrSuperAdmin,
  updateAd,
);
router.delete("/delete/:table_id/:adId", authenticate, deleteAd);
router.patch("/update/:table_id/:adId/status", authenticate, changeAdStatus);
router.get("/renewal-request/:table_id/:adId", requestAdRenewal);
router.post("/renewal-request/:table_id/:adId", optionalAuth, requestAdRenewal);
router.patch("/renew/:table_id/:adId", authenticate, renewAdActiveTime);
router.patch("/assign-admin/:table_id/:adId", authenticate, assignAdmin);

router.get("/all", optionalAuth, getAllAds);
router.get("/sections", optionalAuth, getSectionsAds);
router.get("/profile/:userId", optionalAuth, getUserAds);
router.get("/:table_id/:adId", optionalAuth, getAd);

module.exports = router;
