// Contains the Signup authentication flow logic

// Check if user exists or not in db through entered email
// If not exits create new user , oragnization for user , password hash and store in db
// Generate jwt token for created user


const bcrypt = require("bcryptjs");
const User = require("./authModel");
const Organization = require("../users/organizationModel");
const { generateToken } = require("../../utils/generateToken");

const signup = async (name, email, password, organizationName) => {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        const error = new Error("User already exists");
        error.statusCode = 409;
        throw error;
    }

    const organization = await Organization.create({
        name: organizationName
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: "admin",
        organizationId: organization._id
    });

    const token = generateToken(user);

    return {
        user,
        token
    };
};

module.exports = {
    signup
};