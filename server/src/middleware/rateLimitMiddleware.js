
const { rateLimit } = require("express-rate-limit");
const { RedisStore } = require("rate-limit-redis");
const { redisClient } = require("../config/redis");

const createRateLimiter = ({ windowMs, limit, prefix }) => {
    return rateLimit({
        windowMs,
        limit,

        standardHeaders: "draft-8",
        legacyHeaders: false,

        store: new RedisStore({
            sendCommand: (...args) => redisClient.sendCommand(args),
            prefix,
        }),

        handler: (req, res) => {
            res.status(429).json({
                success: false,
                message: "Too many requests. Please try again later.",
            });
        },
    });
};

const generalRateLimiter = createRateLimiter({
    windowMs: 60 * 1000,
    limit: 100,
    prefix: "resolveai:rate-limit:general:",
});

const authRateLimiter = createRateLimiter({
    windowMs: 60 * 1000,
    limit: 5,
    prefix: "resolveai:rate-limit:auth:",
});

module.exports = {
    generalRateLimiter,
    authRateLimiter,
};
