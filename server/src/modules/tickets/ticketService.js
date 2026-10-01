const Ticket = require("./ticketModel");

// Create a new ticket
const createTicket = async (data) => {
    const ticket = await Ticket.create(data);

    return ticket;
};

// Get tickets based on user role and filters
const getTickets = async (user, filters) => {
    const { status, category, priority, page = 1, limit = 10 } = filters;

    // Build query using organization for tenant isolation
    const query = {
        organizationId: user.organizationId
    };

    // Agents can see only tickets assigned to them
    if (user.role === "agent") {
        query.assignedTo = user._id;
    }

    // Apply optional filters
    if (status) {
        query.status = status;
    }

    if (category) {
        query.category = category;
    }

    if (priority) {
        query.priority = priority;
    }

    // Calculate documents to skip
    const skip = (page - 1) * limit;

    // Fetch tickets
    const tickets = await Ticket.find(query)
        .populate("createdBy", "name email")
        .populate("assignedTo", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

    // Get total matching tickets
    const total = await Ticket.countDocuments(query);

    return {
        tickets,
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit)
    };
};

module.exports = {
    createTicket,
    getTickets
};