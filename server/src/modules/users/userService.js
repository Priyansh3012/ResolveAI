
const bcrypt = require("bcryptjs");
const User = require("../auth/authModel");

// Get agents belonging to the same organization
const getAgents = async (organizationId) => {
    return await User.find({
        organizationId,
        role: "agent"
    })
        .select("_id name email")
        .sort({ name: 1 });
};

// Create an agent within the admin's organization
const createAgent = async (data, organizationId) => {
    const { name, email, password } = data;

    if (
        typeof name !== "string" ||
        !name.trim() ||
        typeof email !== "string" ||
        !email.trim() ||
        typeof password !== "string" ||
        password.length < 8
    ) {
        const error = new Error(
            "Name, email, and password (minimum 8 characters) are required"
        );
        error.statusCode = 400;
        throw error;
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
        email: normalizedEmail
    });

    if (existingUser) {
        const error = new Error("User already exists");
        error.statusCode = 409;
        throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const agent = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        role: "agent",
        organizationId
    });

    return {
        _id: agent._id,
        name: agent.name,
        email: agent.email,
        role: agent.role,
        organizationId: agent.organizationId
    };
};

module.exports = {
    getAgents,
    createAgent
};
