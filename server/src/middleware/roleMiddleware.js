// Middleware to restrict access based on user roles
const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        // User must already be authenticated
        // by the protect middleware.
        if (!req.user) {
            const error = new Error("Not authorized");
            error.statusCode = 401;
            return next(error);
        }

        // Check whether the user's role is allowed
        if (!allowedRoles.includes(req.user.role)) {
            const error = new Error("Access denied");
            error.statusCode = 403;
            return next(error);
        }

        // User has the required role
        next();
    };
};

module.exports = authorize;