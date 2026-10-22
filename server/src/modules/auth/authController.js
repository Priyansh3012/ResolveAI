
const authService = require("./authService");

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000,
    path: "/",
};

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

        res.cookie("token", result.token, COOKIE_OPTIONS);

        res.status(201).json({
            success: true,
            message: "Signup successful",
            user: {
                id: result.user._id,
                name: result.user.name,
                email: result.user.email,
                role: result.user.role,
                organizationId: result.user.organizationId,
            },
        });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            const error = new Error("Email and password are required");
            error.statusCode = 400;
            throw error;
        }

        const result = await authService.login(email, password);

        res.cookie("token", result.token, COOKIE_OPTIONS);

        res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: result.user._id,
                name: result.user.name,
                email: result.user.email,
                role: result.user.role,
                organizationId: result.user.organizationId,
            },
        });
    } catch (error) {
        next(error);
    }
};

const logout = async (req, res, next) => {
    try {
        res.clearCookie("token", {
            httpOnly: COOKIE_OPTIONS.httpOnly,
            secure: COOKIE_OPTIONS.secure,
            sameSite: COOKIE_OPTIONS.sameSite,
            path: COOKIE_OPTIONS.path,
        });

        res.status(200).json({
            success: true,
            message: "Logout successful",
        });
    } catch (error) {
        next(error);
    }
};

const getMe = async (req, res, next) => {
    try {
        res.status(200).json({
            success: true,
            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                role: req.user.role,
                organizationId: req.user.organizationId,
            },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    signup,
    login,
    logout,
    getMe,
};
