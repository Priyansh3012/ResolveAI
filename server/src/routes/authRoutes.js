
const express = require("express");

const authController = require("../modules/auth/authController");
const protect = require("../middleware/authMiddleware");

const {
    authRateLimiter,
} = require("../middleware/rateLimitMiddleware");

const router = express.Router();

router.post("/signup", authRateLimiter, authController.signup);
router.post("/login", authRateLimiter, authController.login);

router.get("/me", protect, authController.getMe);
router.post("/logout", authController.logout);

module.exports = router;