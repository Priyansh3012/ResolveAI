const express = require("express");
const ticketController = require("../modules/tickets/ticketController");
const protect = require("../middleware/authMiddleware");
const ticketActivityController = require("../modules/tickets/ticketActivityController");

const router = express.Router();

router.post("/", protect, ticketController.createTicket);
router.get("/", protect, ticketController.getTickets);
router.get(
    "/:ticketId/activity",
    protect,
    ticketActivityController.getActivities
);
router.get("/:id", protect, ticketController.getTicketById);
router.patch("/:id", protect, ticketController.updateTicket);

module.exports = router;