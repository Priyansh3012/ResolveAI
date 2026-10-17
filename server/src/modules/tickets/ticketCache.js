
const { redisClient } = require("../../config/redis");

const CACHE_TTL = 60;

const getTicketListCache = async (user, filters) => {
    try {
        const organizationId = user.organizationId.toString();

        const versionKey = `resolveai:tickets:version:${organizationId}`;

        const version = (await redisClient.get(versionKey)) || "0";

        const cacheKey = `resolveai:tickets:${organizationId}:${user._id}:${user.role}:${version}:${JSON.stringify(filters)}`;

        const cachedData = await redisClient.get(cacheKey);

        return {
            cacheKey,
            data: cachedData ? JSON.parse(cachedData) : null,
        };
    } catch (error) {
        console.warn("Ticket cache read failed:", error.message);

        return {
            cacheKey: null,
            data: null,
        };
    }
};

const setTicketListCache = async (cacheKey, data) => {
    if (!cacheKey) return;

    try {
        await redisClient.setEx(
            cacheKey,
            CACHE_TTL,
            JSON.stringify(data)
        );
    } catch (error) {
        console.warn("Ticket cache write failed:", error.message);
    }
};

const invalidateTicketListCache = async (organizationId) => {
    try {
        await redisClient.incr(
            `resolveai:tickets:version:${organizationId}`
        );
    } catch (error) {
        console.warn("Ticket cache invalidation failed:", error.message);
    }
};

module.exports = {
    getTicketListCache,
    setTicketListCache,
    invalidateTicketListCache,
};
