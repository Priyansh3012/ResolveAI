const express = require("express");
const errorMiddleware = require("./middleware/errorMiddleware");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "ResolveAI API is running"
    });
});

app.use(errorMiddleware);

module.exports = app;