const jwt = require("jsonwebtoken");

const generateToken = (user) => {
    return jwt.sign(
        {
            userId: user._id,
            role: user.role,
            organizationId: user.organizationId
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || "1d"
        }
    );
};

const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = {
    generateToken,
    verifyToken
};