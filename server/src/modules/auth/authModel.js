const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        role: {
            type: String,
            enum: ["admin", "agent"],
            required: true
        },

        organizationId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Organization"     // Foreign key reference to the Organization model
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);