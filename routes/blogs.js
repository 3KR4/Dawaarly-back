const express = require("express");
const router = express.Router();

const {
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogs,
  getOneBlog,
} = require("../controllers/blogsController");

const { authenticate } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/authorize");
const { optionalAuth } = require("../middlewares/optionalAuthMiddleware");


// Admin
router.post("/", authenticate, authorize("ADMIN"), createBlog);
router.patch("/:id", authenticate, authorize("ADMIN"), updateBlog);
router.delete("/:id", authenticate, authorize("ADMIN"), deleteBlog);

// Public
router.get("/", optionalAuth, getBlogs);

// 🔥 بدل id → slug
router.get("/:slug",optionalAuth, getOneBlog);

module.exports = router;
