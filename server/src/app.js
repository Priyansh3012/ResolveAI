const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");
const cookieParser = require("cookie-parser");
const ticketRoutes = require("./routes/ticketRoutes");

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());   // cookie parser middleware to parse cookies from incoming requests - can be used to access cookies in req.cookies

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "ResolveAI API is running"
    });
});

app.use("/api/auth", authRoutes);
// Our API endpoint is POST http://localhost:5000/api/tickets
app.use("/api/tickets", ticketRoutes);

app.use(errorMiddleware);

module.exports = app;