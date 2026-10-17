
const userService = require("./userService");

// Get agents in the authenticated user's organization
const getAgents = async (req, res, next) => {
    try {
        if (req.user.role !== "admin") {
            const error = new Error("Access denied");
            error.statusCode = 403;
            throw error;
        }

        const agents = await userService.getAgents(
            req.user.organizationId
        );

        res.status(200).json({
            success: true,
            agents
        });
    } catch (error) {
        next(error);
    }
};

// Create an agent in the admin's organization
const createAgent = async (req, res, next) => {
    try {
        if (req.user.role !== "admin") {
            const error = new Error("Access denied");
            error.statusCode = 403;
            throw error;
        }

        const agent = await userService.createAgent(
            req.body,
            req.user.organizationId
        );

        res.status(201).json({
            success: true,
            message: "Agent created successfully",
            agent
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAgents,
    createAgent
};
