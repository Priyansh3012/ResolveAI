


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

module.exports = {
    signup
};