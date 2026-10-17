
require("dotenv").config();

const connectDB = require("./config/db");
const { connectRedis } = require("./config/redis");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // Connect databases before loading the application
        await connectDB();
        await connectRedis();

        // Load routes and rate-limit stores after Redis connects
        const app = require("./app");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Server startup failed:", error.message);
        process.exit(1);
    }
};

startServer();
