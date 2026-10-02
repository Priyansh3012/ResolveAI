const ticketActivityService = require("./ticketActivityService");

// Get ticket activity history
const getActivities = async (req, res, next) => {
    try {
        const activities = await ticketActivityService.getActivities(
            req.params.ticketId,
            req.user
        );

        res.status(200).json({
            success: true,
            activities
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getActivities
};