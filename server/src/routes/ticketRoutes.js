const express = require("express");
const ticketController = require("../modules/tickets/ticketController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, ticketController.createTicket);

module.exports = router;