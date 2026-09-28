const express = require("express");
const authController = require("../modules/auth/authController");

const router = express.Router();

router.post("/signup", authController.signup);

module.exports = router;