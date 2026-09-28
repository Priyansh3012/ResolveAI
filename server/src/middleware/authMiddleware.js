const { verifyToken } = require("../utils/generateToken");
const User = require("../modules/auth/authModel");

// Protect routes using JWT stored in HttpOnly cookie
const protect = async (req, res, next) => {
    try {
        // Get token from cookie
        const token = req.cookies.token;

        if (!token) {
            const error = new Error("Not authorized");
            error.statusCode = 401;
            throw error;
        }

        // Verify JWT
        const decoded = verifyToken(token);

        // Find user from token
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 401;
            throw error;
        }

        // Attach authenticated user to request
        req.user = user;

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = protect;