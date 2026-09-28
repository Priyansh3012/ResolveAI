const express = require("express");
const authController = require("../modules/auth/authController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/me", protect, authController.getMe);
router.post("/logout", authController.logout);

module.exports = router;