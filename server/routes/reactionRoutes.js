const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const reactionController = require("../controllers/reactionController");

router.post("/:videoId", authMiddleware, reactionController.toggleReaction);
router.get("/:videoId", reactionController.getReactions);

module.exports = router;