const mongoose = require("mongoose");

const TicketActivity = require("./ticketActivityModel");
const Ticket = require("./ticketModel");

// Create ticket activity
const createActivity = async (data) => {
  const activity = await TicketActivity.create(data);

  return activity;
};

// Get ticket activity history
const getActivities = async (ticketId, user) => {
  // Validate ticket ID
  if (!mongoose.Types.ObjectId.isValid(ticketId)) {
    const error = new Error("Invalid ticket ID");
    error.statusCode = 400;
    throw error;
  }

  // Make sure ticket belongs to user's organization
  const ticket = await Ticket.findOne({
    _id: ticketId,
    organizationId: user.organizationId,
  });

  if (!ticket) {
    const error = new Error("Ticket not found");
    error.statusCode = 404;
    throw error;
  }

  // Agents can only view activities
  // for tickets assigned to them
  if (
    user.role === "agent" &&
    (!ticket.assignedTo ||
      ticket.assignedTo.toString() !== user._id.toString())
  ) {
    const error = new Error("Access denied");
    error.statusCode = 403;
    throw error;
  }

  // Get activity history
  const activities = await TicketActivity.find({
    ticketId,
    organizationId: user.organizationId,
  })
    .populate("userId", "name email")
    .sort({ createdAt: 1 });

  return activities;
};

module.exports = {
  createActivity,
  getActivities,
};