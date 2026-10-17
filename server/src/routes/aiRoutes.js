const express = require("express");

const protect = require("../middleware/authMiddleware");
const aiController = require("../modules/ai/aiController");

const router = express.Router();

router.post(
    "/classify",
    protect,
    aiController.classifyTicket
);

module.exports = router;