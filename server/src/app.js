const express = require("express");
const cors = require("cors");
const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "ResolveAI API is running"
    });
});

app.use(errorMiddleware);

module.exports = app;