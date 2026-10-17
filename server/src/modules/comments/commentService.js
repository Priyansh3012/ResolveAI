
const mongoose = require("mongoose");

const Comment = require("./commentModel");
const Ticket = require("../tickets/ticketModel");

const createError = (message, statusCode) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

// Validate ticket access.
const getAccessibleTicket = async (ticketId, user) => {
    if (!mongoose.Types.ObjectId.isValid(ticketId)) {
        throw createError("Invalid ticket ID", 400);
    }

    const ticket = await Ticket.findOne({
        _id: ticketId,
        organizationId: user.organizationId,
    });

    if (!ticket) {
        throw createError("Ticket not found", 404);
    }

    // Agents can access only tickets assigned to them.
    if (
        user.role === "agent" &&
        (!ticket.assignedTo ||
            ticket.assignedTo.toString() !== user._id.toString())
    ) {
        throw createError("Access denied", 403);
    }

    return ticket;
};

// Create a comment.
const createComment = async (ticketId, user, message) => {
    await getAccessibleTicket(ticketId, user);

    if (typeof message !== "string" || !message.trim()) {
        throw createError("Comment message is required", 400);
    }

    const trimmedMessage = message.trim();

    if (trimmedMessage.length > 2000) {
        throw createError("Comment cannot exceed 2000 characters", 400);
    }

    const comment = await Comment.create({
        ticketId,
        userId: user._id,
        organizationId: user.organizationId,
        message: trimmedMessage,
    });

    return comment;
};

// Get comments for a ticket.
const getComments = async (ticketId, user) => {
    await getAccessibleTicket(ticketId, user);

    const comments = await Comment.find({
        ticketId,
        organizationId: user.organizationId,
    })
        .populate("userId", "name email")
        .sort({ createdAt: 1 });

    return comments;
};

module.exports = {
    createComment,
    getComments,
};
