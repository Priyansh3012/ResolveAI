const TicketActivity = require("./ticketActivityModel");

// Create ticket activity
const createActivity = async (data) => {
    const activity = await TicketActivity.create(data);

    return activity;
};

// Get ticket activity history
const getActivities = async (ticketId, user) => {
    const activities = await TicketActivity.find({
        ticketId,
        organizationId: user.organizationId
    })
        .populate("userId", "name email")
        .sort({ createdAt: 1 });

    return activities;
};

module.exports = {
    createActivity,
    getActivities
};