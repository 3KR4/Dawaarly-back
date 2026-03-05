const express = require("express");
const router = express.Router();
const {
  createSubscriptionRequest,
  getSubscriptionRequests,
  approveSubscriptionRequest,
  rejectSubscriptionRequest,
} = require("../controllers/subscriptionController");

const { authenticate } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/authorize.JS");

router.post("/", authenticate, createSubscriptionRequest);

router.get("/", authenticate, authorize("admin"), getSubscriptionRequests);

router.patch(
  "/:id/approve",
  authenticate,
  authorize("admin"),
  approveSubscriptionRequest,
);

router.patch(
  "/:id/reject",
  authenticate,
  authorize("admin"),
  rejectSubscriptionRequest,
);
