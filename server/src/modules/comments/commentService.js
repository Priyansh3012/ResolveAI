const Comment = require("./commentModel");
const Ticket = require("../tickets/ticketModel");

// Create a comment
const createComment = async (ticketId, user, message) => {
    // Make sure ticket belongs to user's organization
    const ticket = await Ticket.findOne({
        _id: ticketId,
        organizationId: user.organizationId
    });

    if (!ticket) {
        const error = new Error("Ticket not found");
        error.statusCode = 404;
        throw error;
    }

    // Agents can comment only on tickets assigned to them
    if (
        user.role === "agent" &&
        (!ticket.assignedTo ||
            ticket.assignedTo.toString() !== user._id.toString())
    ) {
        const error = new Error("Access denied");
        error.statusCode = 403;
        throw error;
    }

    const comment = await Comment.create({
        ticketId,
        userId: user._id,
        organizationId: user.organizationId,
        message
    });

    return comment;
};

// Get comments for a ticket
const getComments = async (ticketId, user) => {
    // Make sure ticket belongs to user's organization
    const ticket = await Ticket.findOne({
        _id: ticketId,
        organizationId: user.organizationId
    });

    if (!ticket) {
        const error = new Error("Ticket not found");
        error.statusCode = 404;
        throw error;
    }

    // Agents can view comments only on assigned tickets
    if (
        user.role === "agent" &&
        (!ticket.assignedTo ||
            ticket.assignedTo.toString() !== user._id.toString())
    ) {
        const error = new Error("Access denied");
        error.statusCode = 403;
        throw error;
    }

    const comments = await Comment.find({
        ticketId,
        organizationId: user.organizationId
    })
        .populate("userId", "name email")
        .sort({ createdAt: 1 });

    return comments;
};

module.exports = {
    createComment,
    getComments
};