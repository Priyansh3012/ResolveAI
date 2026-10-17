
const express = require("express");

const dashboardController = require("../modules/dashboard/dashboardController");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
  "/",
  protect,
  authorize("admin"),
  dashboardController.getDashboardStats
);

module.exports = router;
