const express = require("express");
const router = express.Router();

const {
  createSubscriptionRequest,
  getSubscriptionRequests,
  approveSubscriptionRequest,
  rejectSubscriptionRequest,
} = require("../controllers/subscriptionController");

const { authenticate } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/authorize"); // كمان شيل .JS

// Create request
router.post("/", authenticate, createSubscriptionRequest);

// Get all requests (Admin only)
router.get("/", authenticate, authorize("ADMIN"), getSubscriptionRequests);

// Approve request
router.patch(
  "/:id/approve",
  authenticate,
  authorize("ADMIN"),
  approveSubscriptionRequest
);

// Reject request
router.patch(
  "/:id/reject",
  authenticate,
  authorize("ADMIN"),
  rejectSubscriptionRequest
);

module.exports = router;