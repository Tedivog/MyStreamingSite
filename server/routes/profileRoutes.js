const express = require("express");
const router = express.Router();
const { getProfile } = require("../controllers/profileController");
const auth = require("../middleware/authMiddleware");
const path = require("path");

router.get("/", auth, getProfile);

module.exports = router;