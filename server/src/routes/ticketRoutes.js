const express = require("express");
const ticketController = require("../modules/tickets/ticketController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, ticketController.createTicket);
router.get("/", protect, ticketController.getTickets);
router.get("/:id", protect, ticketController.getTicketById);
router.patch("/:id", protect, ticketController.updateTicket);

module.exports = router;