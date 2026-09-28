


const authService = require("./authService");

const signup = async (req, res, next) => {
    try {
        const { name, email, password, organizationName } = req.body;

        if (!name || !email || !password || !organizationName) {
            const error = new Error("All fields are required");
            error.statusCode = 400;
            throw error;
        }

        const result = await authService.signup(
            name,
            email,
            password,
            organizationName
        );

        res.cookie("token", result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000
        });

        res.status(201).json({
            success: true,
            message: "Signup successful",
            user: {
                id: result.user._id,
                name: result.user.name,
                email: result.user.email,
                role: result.user.role,
                organizationId: result.user.organizationId
            }
        });
    } catch (error) {
        next(error);
    }
};

// Login controller
const login = async (req, res, next) => {
    try {
        // Get login credentials
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            const error = new Error("Email and password are required");
            error.statusCode = 400;
            throw error;
        }

        // Authenticate user and generate token
        const result = await authService.login(email, password);

        // Store JWT in HttpOnly cookie
        res.cookie("token", result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000
        });

        // Send safe user details
        res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: result.user._id,
                name: result.user.name,
                email: result.user.email,
                role: result.user.role,
                organizationId: result.user.organizationId
            }
        });
    } catch (error) {
        // Pass error to error middleware
        next(error);
    }
};

// Logout controller
const logout = async (req, res, next) => {
    try {
        // Clear the authentication cookie
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax"
        });

        // Send successful response
        res.status(200).json({
            success: true,
            message: "Logout successful"
        });
    } catch (error) {
        // Pass error to error middleware
        next(error);
    }
};

// Get currently authenticated user
const getMe = async (req, res, next) => {
    try {
        // User is already attached by protect middleware
        res.status(200).json({
            success: true,
            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                role: req.user.role,
                organizationId: req.user.organizationId
            }
        });
    } catch (error) {
        // Pass error to error middleware
        next(error);
    }
};

module.exports = {
    signup,
    login,
    logout,
    getMe
};