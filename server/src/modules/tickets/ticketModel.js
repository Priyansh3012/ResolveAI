const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
    {
        title: {                // 1. Short ticket name or title (brief description of the issue)
            type: String,
            required: true,
            trim: true
        },

        description: {         // 2. Detailed description of the ticket issue (more information about the issue)
            type: String,
            required: true,
            trim: true
        },

        category: {            // 3. category of the ticeket issue (what type of issue it is)
            type: String,
            enum: [
                "Technical Issue",
                "Access Request",
                "Software Request",
                "Hardware Issue",
                "Network Issue",
                "Other"
            ],
            required: true
        },

        priority: {          // 4. priority of the ticket issue (how urgent it is -> Low, Medium, High, Critical)
            type: String,
            enum: ["Low", "Medium", "High", "Critical"],
            default: "Medium"
        },

        // 5. status of the ticket issue (what is the current state of the ticket -> Open, In Progress, Pending, Resolved, Closed)

        status: {           
            type: String,
            enum: [
                "Open",
                "In Progress",
                "Pending",
                "Resolved",
                "Closed"
            ],
            default: "Open"
        },

        createdBy: {           // 6. created by which user (user who created the ticket)
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        assignedTo: {          // 7. assigned to which user (user to whom the ticket is assigned)

            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        organizationId: {   // 8. organization to which the ticket belongs (organization to which the ticket is related)
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organization",
            required: true
        }
    },
    {
        timestamps: true     // automatically add createdAt and updatedAt fields to the schema
    }
);

module.exports = mongoose.model("Ticket", ticketSchema);