const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const auth = require("../middleware/authMiddleware");

// Aggiungi commento
router.post("/add", auth, commentController.addComment);

// Ottieni commenti di un video
router.get("/video/:videoId", commentController.getCommentsByVideo);

// Elimina commento (solo autore)
router.delete("/delete/:commentId", auth, commentController.deleteComment);

module.exports = router;
