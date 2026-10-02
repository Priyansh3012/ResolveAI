const mongoose = require("mongoose");
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
    organizationId: user.organizationId,
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
    totalPages: Math.ceil(total / limit),
  };
};

// Get a single ticket by ID
const getTicketById = async (id, user) => {

  // Validate MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("Invalid ticket ID");
    error.statusCode = 400;
    throw error;
  }

  // Find ticket within the user's organization
  const ticket = await Ticket.findOne({
    _id: id,
    organizationId: user.organizationId,
  })
    .populate("createdBy", "name email")
    .populate("assignedTo", "name email");

  if (!ticket) {
    const error = new Error("Ticket not found");
    error.statusCode = 404;
    throw error;
  }

  // Agents can only access tickets assigned to them
  if (
    user.role === "agent" &&
    ticket.assignedTo &&
    ticket.assignedTo._id.toString() !== user._id.toString()
  ) {
    const error = new Error("Access denied");
    error.statusCode = 403;
    throw error;
  }

  return ticket;
};


// Update a ticket
const updateTicket = async (id, user, data) => {
    // Find ticket within user's organization
    const ticket = await Ticket.findOne({
        _id: id,
        organizationId: user.organizationId
    });

    if (!ticket) {
        const error = new Error("Ticket not found");
        error.statusCode = 404;
        throw error;
    }

    // Agents can update only tickets assigned to them
    if (
        user.role === "agent" &&
        (!ticket.assignedTo ||
            ticket.assignedTo.toString() !== user._id.toString())
    ) {
        const error = new Error("Access denied");
        error.statusCode = 403;
        throw error;
    }

    // Update only allowed fields
    const allowedFields = [
        "title",
        "description",
        "category",
        "priority",
        "status",
        "assignedTo"
    ];

    allowedFields.forEach((field) => {
        if (data[field] !== undefined) {
            ticket[field] = data[field];
        }
    });

    await ticket.save();

    return ticket;
};

module.exports = {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket
};
