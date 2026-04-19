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

router.post("/", authenticate, authorize("ADMIN"), createBlog);
router.patch("/:id", authenticate, authorize("ADMIN"), updateBlog);
router.delete("/:id", authenticate, authorize("ADMIN"), deleteBlog);
router.get("/", getBlogs);
router.get("/:id", getOneBlog);

module.exports = router;
