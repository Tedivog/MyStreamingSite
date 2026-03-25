const express = require("express");
const router = express.Router();
const videoController = require("../controllers/videoController");
const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { suggestVideos } = require("../controllers/videoController");

// UPLOAD VIDEO (solo loggato)
router.post("/upload", auth, upload.single("video"), videoController.uploadVideo);

// LISTA VIDEO
router.get("/", videoController.getAllVideos);

// RICERCA VIDEO
router.get("/suggest", suggestVideos);

// RICERCA VIDEO CATEGORY
router.get("/category/:category_id", videoController.categoryVideos);

// SINGOLO VIDEO
router.get("/:id", videoController.getVideoById);

module.exports = router;
