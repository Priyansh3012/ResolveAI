const Ticket = require("../tickets/ticketModel");

// Get dashboard statistics
const getDashboardStats = async (user) => {
  // Build query based on organization
  const query = {
    organizationId: user.organizationId,
  };

  // Agents can see only their assigned tickets
  if (user.role === "agent") {
    query.assignedTo = user._id;
  }

  // Get ticket counts by status
  const statusCounts = await Ticket.aggregate([
    {
      $match: query,
    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  // Prepare status counts
  const status = {
    Open: 0,
    "In Progress": 0,
    Pending: 0,
    Resolved: 0,
    Closed: 0,
  };

  statusCounts.forEach((item) => {
    status[item._id] = item.count;
  });

  // Get ticket counts by priority
  const priorityCounts = await Ticket.aggregate([
    {
      $match: query,
    },
    {
      $group: {
        _id: "$priority",
        count: { $sum: 1 },
      },
    },
  ]);

  // Prepare priority counts
  const priority = {
    Low: 0,
    Medium: 0,
    High: 0,
    Critical: 0,
  };

  priorityCounts.forEach((item) => {
    priority[item._id] = item.count;
  });

  // Get ticket counts by category
  const categoryCounts = await Ticket.aggregate([
    {
      $match: query,
    },
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
      },
    },
  ]);

  // Prepare category counts
  const category = {
    "Technical Issue": 0,
    "Access Request": 0,
    "Software Request": 0,
    "Hardware Issue": 0,
    "Network Issue": 0,
    Other: 0,
  };

  categoryCounts.forEach((item) => {
    category[item._id] = item.count;
  });

  // Get total tickets
  const total = await Ticket.countDocuments(query);

  // Get high and critical priority tickets
  const highPriority = await Ticket.countDocuments({
    ...query,
    priority: {
      $in: ["High", "Critical"],
    },
  });

  return {
    total,
    status,
    priority,
    category,
    highPriority,
  };
};

module.exports = {
  getDashboardStats,
};