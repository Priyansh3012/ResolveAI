const express = require("express");
const commentController = require("../modules/comments/commentController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/:ticketId", protect, commentController.createComment);
router.get("/:ticketId", protect, commentController.getComments);

module.exports = router;