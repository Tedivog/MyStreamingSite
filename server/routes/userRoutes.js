const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");

// REGISTER
router.post("/register", userController.register);

// LOGIN
router.post("/login", userController.login);

// GET PROFILE (solo loggato)
router.get("/me", auth, userController.getProfile);

module.exports = router;
