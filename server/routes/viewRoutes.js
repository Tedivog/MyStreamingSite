const express = require("express");
const router = express.Router();
const viewController = require("../controllers/viewController");
const auth = require("../middleware/authMiddleware");

// Registra visualizzazione
router.post("/add", auth, viewController.addView);

// Conta visualizzazioni totali
router.get("/count/:videoId", viewController.getViewCount);

// Visualizzazioni di oggi
router.get("/today/:videoId", viewController.getTodayViews);

// Lista completa visualizzazioni di un video
router.get("/video/:videoId", viewController.getViewsByVideo);

module.exports = router;
