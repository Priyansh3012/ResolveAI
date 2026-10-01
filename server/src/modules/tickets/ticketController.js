const ticketService = require("./ticketService");

// Create ticket controller
const createTicket = async (req, res, next) => {
    try {
        // Get ticket data from request body
        const { title, description, category, priority } = req.body;

        // Validate required fields
        if (!title || !description || !category) {
            const error = new Error(
                "Title, description and category are required"
            );
            error.statusCode = 400;
            throw error;
        }

        // Automatically assign ticket to the creator if they are an agent
        const assignedTo = req.user.role === "agent"
            ? req.user._id
            : null;

        // Create ticket
        const ticket = await ticketService.createTicket({
            title,
            description,
            category,
            priority,
            createdBy: req.user._id,
            assignedTo,
            organizationId: req.user.organizationId
        });

        // Send created ticket
        res.status(201).json({
            success: true,
            message: "Ticket created successfully",
            ticket
        });
    } catch (error) {
        // Pass error to error middleware
        next(error);
    }
};

// Get tickets controller
const getTickets = async (req, res, next) => {
    try {
        // Get filters from query parameters
        const {
            status,
            category,
            priority,
            page,
            limit
        } = req.query;

        // Fetch tickets based on user role and filters
        const result = await ticketService.getTickets(
            req.user,
            {
                status,
                category,
                priority,
                page,
                limit
            }
        );

        res.status(200).json({
            success: true,
            ...result
        });
    } catch (error) {
        // Pass error to error middleware
        next(error);
    }
};

module.exports = {
    createTicket,
    getTickets
};