const ticketService = require("./ticketService");
const ticketActivityService = require("./ticketActivityService");

// Create ticket controller
const createTicket = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      priority,
    } = req.body;

    // Validate required fields
    if (!title || !description || !category) {
      const error = new Error(
        "Title, description and category are required",
      );

      error.statusCode = 400;
      throw error;
    }

    // Automatically assign ticket to the creator
    // if the creator is an agent
    const assignedTo =
      req.user.role === "agent"
        ? req.user._id
        : null;

    const ticket = await ticketService.createTicket({
      title,
      description,
      category,
      priority,
      createdBy: req.user._id,
      assignedTo,
      organizationId: req.user.organizationId,
    });

    // Record ticket creation activity
    await ticketActivityService.createActivity({
      ticketId: ticket._id,
      userId: req.user._id,
      organizationId: req.user.organizationId,
      action: "created",
      description: "Ticket created",
    });

    res.status(201).json({
      success: true,
      message: "Ticket created successfully",
      ticket,
    });
  } catch (error) {
    next(error);
  }
};

// Get tickets controller
const getTickets = async (req, res, next) => {
  try {
    const {
      search,
      status,
      category,
      priority,
      page,
      limit,
    } = req.query;

    const result = await ticketService.getTickets(
      req.user,
      {
        search,
        status,
        category,
        priority,
        page,
        limit,
      },
    );

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};


// Get ticket by ID controller
const getTicketById = async (req, res, next) => {
  try {
    const ticket = await ticketService.getTicketById(
      req.params.id,
      req.user,
    );

    res.status(200).json({
      success: true,
      ticket,
    });
  } catch (error) {
    next(error);
  }
};

// Update ticket controller
const updateTicket = async (req, res, next) => {
  try {
    const ticket = await ticketService.updateTicket(
      req.params.id,
      req.user,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Ticket updated successfully",
      ticket,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
};