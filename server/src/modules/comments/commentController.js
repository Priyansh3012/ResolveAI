const commentService = require("./commentService");

// Create comment controller
const createComment = async (req, res, next) => {
    try {
        const { message } = req.body;

        // Validate comment
        if (!message) {
            const error = new Error("Message is required");
            error.statusCode = 400;
            throw error;
        }

        const comment = await commentService.createComment(
            req.params.ticketId,
            req.user,
            message
        );

        res.status(201).json({
            success: true,
            message: "Comment added successfully",
            comment
        });
    } catch (error) {
        next(error);
    }
};

// Get comments controller
const getComments = async (req, res, next) => {
    try {
        const comments = await commentService.getComments(
            req.params.ticketId,
            req.user
        );

        res.status(200).json({
            success: true,
            comments
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createComment,
    getComments
};