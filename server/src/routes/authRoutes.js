const express = require("express");
const authController = require("../modules/auth/authController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

router.get("/me", protect, (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user
    });
});

router.post("/logout", authController.logout);

module.exports = router;