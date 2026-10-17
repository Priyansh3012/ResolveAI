
const express = require("express");

const userController = require("../modules/users/userController");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

// Only Admins can create Agents.
router.post(
  "/",
  protect,
  authorize("admin"),
  userController.createAgent
);

// Only Admins can fetch Agents in their organization.
router.get(
  "/agents",
  protect,
  authorize("admin"),
  userController.getAgents
);

module.exports = router;
