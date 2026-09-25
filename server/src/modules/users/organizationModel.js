const mongoose = require("mongoose");

const organizationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        timestamps: true       // created and updated timestamps for the organization
    }
);

module.exports = mongoose.model("Organization", organizationSchema);