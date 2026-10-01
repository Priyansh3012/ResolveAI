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

        // Create ticket with authenticated user's information
        const ticket = await ticketService.createTicket({
            title,
            description,
            category,
            priority,
            createdBy: req.user._id,
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

module.exports = {
    createTicket   // Export the createTicket controller function
}; 