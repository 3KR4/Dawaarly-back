const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/authMiddleware");
const {
  uploadImages,
  deleteImage,
  updateImage
} = require("../controllers/ImagesController");
const multer = require("multer");
const upload = multer(); // استخدام memoryStorage لرفع الصور مباشرة

router.post(
  "/:entity_type/:entity_id",
  authenticate,
  upload.array("files"),
  uploadImages,
);
router.delete(
  "/:entity_type/:entity_id/:imageId",
  authenticate,
  deleteImage,
);
router.patch(
  "/:entity_type/:entity_id/:imageId",
  authenticate,
  updateImage,
);

module.exports = router;