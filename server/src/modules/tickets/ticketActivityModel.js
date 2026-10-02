const mongoose = require("mongoose");

const ticketActivitySchema = new mongoose.Schema(
    {
        ticketId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Ticket",
            required: true
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        organizationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organization",
            required: true
        },

        action: {
            type: String,
            enum: [
                "created",
                "updated",
                "assigned",
                "status_changed",
                "priority_changed",
                "comment_added"
            ],
            required: true
        },

        oldValue: {
            type: String,
            default: null
        },

        newValue: {
            type: String,
            default: null
        },

        description: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model(
    "TicketActivity",
    ticketActivitySchema
);