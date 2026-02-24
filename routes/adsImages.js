const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/authMiddleware");
const {
  uploadAdImages,
  deleteAdImage,
  updateAdImage
} = require("../controllers/adImagesController");
const multer = require("multer");
const upload = multer(); // استخدام memoryStorage لرفع الصور مباشرة

// رفع صور إعلان
router.post("/:id/images", authenticate, upload.array("files"), uploadAdImages);

// حذف صورة إعلان
router.delete("/images/:imageId", authenticate, deleteAdImage);

// تعديل صورة (ترتيب أو cover)
router.patch("/images/:imageId", authenticate, updateAdImage);

module.exports = router;