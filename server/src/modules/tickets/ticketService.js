const mongoose = require("mongoose");

const Ticket = require("./ticketModel");
const User = require("../auth/authModel");
const ticketActivityService = require("./ticketActivityService");
const aiService = require("../ai/aiService");

const {
  getTicketListCache,
  setTicketListCache,
  invalidateTicketListCache,
} = require("./ticketCache");

const ALLOWED_CATEGORIES = [
  "Technical Issue",
  "Access Request",
  "Software Request",
  "Hardware Issue",
  "Network Issue",
  "Other",
];

const ALLOWED_PRIORITIES = ["Low", "Medium", "High", "Critical"];

const ALLOWED_STATUSES = [
  "Open",
  "In Progress",
  "Pending",
  "Resolved",
  "Closed",
];

const ALLOWED_UPDATE_FIELDS = [
  "title",
  "description",
  "category",
  "priority",
  "status",
  "assignedTo",
];

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

// Create a new ticket
const createTicket = async (data) => {
  const ticket = await Ticket.create(data);

  try {
    const result = await aiService.classifyTicket(
      ticket.title,
      ticket.description,
    );

    ticket.aiAnalysis = {
      predictedCategory: result.category,
      recommendedPriority: result.priority,
      reason: result.reason,
    };

    await ticket.save();
  } catch (error) {
    console.error(
      `AI analysis failed for ticket ${ticket._id}:`,
      error.message,
    );
  }

  await invalidateTicketListCache(ticket.organizationId);

  return ticket;
};

// Get tickets based on user role and filters

const getTickets = async (user, filters = {}) => {
  const { status, category, priority } = filters;

  // Normalize search input.
  const search =
    typeof filters.search === "string"
      ? filters.search.trim().slice(0, 100)
      : "";

  // Validate pagination inputs.
  const page = Number(filters.page ?? 1);
  const limit = Number(filters.limit ?? 10);

  if (!Number.isInteger(page) || page < 1) {
    throw createError("Page must be a positive integer", 400);
  }

  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    throw createError("Limit must be between 1 and 100", 400);
  }

  // Escape regex characters so search input is treated literally.
  const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // Include every result-affecting filter in the cache key.
  const normalizedFilters = {
    search,
    status: status || "",
    category: category || "",
    priority: priority || "",
    page,
    limit,
  };

  const { cacheKey, data } = await getTicketListCache(
    user,
    normalizedFilters
  );

  if (data !== null) {
    console.log("Ticket list cache: HIT");
    return data;
  }

  console.log("Ticket list cache: MISS");

  // Preserve organization isolation.
  const query = {
    organizationId: user.organizationId,
  };

  // Agents can see only tickets assigned to them.
  if (user.role === "agent") {
    query.assignedTo = user._id;
  }

  if (status) {
    query.status = status;
  }

  if (category) {
    query.category = category;
  }

  if (priority) {
    query.priority = priority;
  }

  // Search title and description by partial, case-insensitive match.
  // A complete MongoDB ObjectId can also match the ticket ID.
  if (search) {
    const searchConditions = [
      { title: { $regex: escapedSearch, $options: "i" } },
      { description: { $regex: escapedSearch, $options: "i" } },
    ];

    if (mongoose.Types.ObjectId.isValid(search)) {
      searchConditions.push({
        _id: new mongoose.Types.ObjectId(search),
      });
    }

    query.$or = searchConditions;
  }

  const skip = (page - 1) * limit;

  const [tickets, total] = await Promise.all([
    Ticket.find(query)
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Ticket.countDocuments(query),
  ]);

  const result = {
    tickets,
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };

  await setTicketListCache(cacheKey, result);

  return result;
};


// Get a single ticket by ID
const getTicketById = async (id, user) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError("Invalid ticket ID", 400);
  }

  const ticket = await Ticket.findOne({
    _id: id,
    organizationId: user.organizationId,
  })
    .populate("createdBy", "name email")
    .populate("assignedTo", "name email");

  if (!ticket) {
    throw createError("Ticket not found", 404);
  }

  // Agents can access only tickets assigned to them.
  if (
    user.role === "agent" &&
    (!ticket.assignedTo ||
      ticket.assignedTo._id.toString() !== user._id.toString())
  ) {
    throw createError("Access denied", 403);
  }

  return ticket;
};

// Update a ticket
const updateTicket = async (id, user, data) => {
  // Validate request body.
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw createError("Invalid request body", 400);
  }

  const fields = Object.keys(data);

  // Agents can update only status and priority.
  if (user.role === "agent") {
    const allowedAgentFields = ["status", "priority"];

    const forbiddenFields = fields.filter(
      (field) => !allowedAgentFields.includes(field),
    );

    if (forbiddenFields.length > 0) {
      throw createError(
        "Agents can update only ticket status and priority",
        403,
      );
    }
  }

  if (fields.length === 0) {
    throw createError("No fields provided for update", 400);
  }

  // Reject protected or unsupported fields.
  const invalidFields = fields.filter(
    (field) => !ALLOWED_UPDATE_FIELDS.includes(field),
  );

  if (invalidFields.length > 0) {
    throw createError(`Unsupported fields: ${invalidFields.join(", ")}`, 400);
  }

  // Validate category.
  if (
    data.category !== undefined &&
    !ALLOWED_CATEGORIES.includes(data.category)
  ) {
    throw createError("Invalid ticket category", 400);
  }

  // Validate priority.
  if (
    data.priority !== undefined &&
    !ALLOWED_PRIORITIES.includes(data.priority)
  ) {
    throw createError("Invalid ticket priority", 400);
  }

  // Validate status.
  if (data.status !== undefined && !ALLOWED_STATUSES.includes(data.status)) {
    throw createError("Invalid ticket status", 400);
  }

  // Validate title.
  if (data.title !== undefined) {
    if (typeof data.title !== "string" || !data.title.trim()) {
      throw createError("Title must be a non-empty string", 400);
    }

    data = {
      ...data,
      title: data.title.trim(),
    };
  }

  // Validate description.
  if (data.description !== undefined) {
    if (typeof data.description !== "string" || !data.description.trim()) {
      throw createError("Description must be a non-empty string", 400);
    }

    data = {
      ...data,
      description: data.description.trim(),
    };
  }

  // Validate ticket ID.
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw createError("Invalid ticket ID", 400);
  }

  // Find ticket within the user's organization.
  const ticket = await Ticket.findOne({
    _id: id,
    organizationId: user.organizationId,
  });

  if (!ticket) {
    throw createError("Ticket not found", 404);
  }

  // Agents can update only tickets assigned to them.
  if (
    user.role === "agent" &&
    (!ticket.assignedTo || ticket.assignedTo.toString() !== user._id.toString())
  ) {
    throw createError("Access denied", 403);
  }

  // Store old values before making changes.
  const oldStatus = ticket.status;
  const oldPriority = ticket.priority;
  const oldAssignedTo = ticket.assignedTo ? ticket.assignedTo.toString() : null;

  let normalFieldUpdated = false;

  // Update allowed normal fields.
  const normalFields = [
    "title",
    "description",
    "category",
    "priority",
    "status",
  ];

  normalFields.forEach((field) => {
    if (data[field] !== undefined && ticket[field] !== data[field]) {
      ticket[field] = data[field];
      normalFieldUpdated = true;
    }
  });

  // Only admins can assign tickets.
  if (data.assignedTo !== undefined) {
    if (user.role !== "admin") {
      throw createError("Only admin can assign tickets", 403);
    }

    // Allow removing assignment.
    if (data.assignedTo === null) {
      ticket.assignedTo = null;
    } else {
      if (
        typeof data.assignedTo !== "string" ||
        !mongoose.Types.ObjectId.isValid(data.assignedTo)
      ) {
        throw createError("Invalid agent ID", 400);
      }

      // Agent must belong to the same organization.
      const agent = await User.findOne({
        _id: data.assignedTo,
        organizationId: user.organizationId,
        role: "agent",
      });

      if (!agent) {
        throw createError(
          "Invalid agent or agent does not belong to your organization",
          400,
        );
      }

      ticket.assignedTo = agent._id;
    }
  }

  const newAssignedTo = ticket.assignedTo ? ticket.assignedTo.toString() : null;

  const statusChanged = oldStatus !== ticket.status;
  const priorityChanged = oldPriority !== ticket.priority;
  const assignmentChanged = oldAssignedTo !== newAssignedTo;

  // Save ticket.
  await ticket.save();

  // Record status activity.
  if (statusChanged) {
    await ticketActivityService.createActivity({
      ticketId: ticket._id,
      userId: user._id,
      organizationId: user.organizationId,
      action: "status_changed",
      oldValue: oldStatus,
      newValue: ticket.status,
      description: `Status changed from ${oldStatus} to ${ticket.status}`,
    });
  }

  // Record priority activity.
  if (priorityChanged) {
    await ticketActivityService.createActivity({
      ticketId: ticket._id,
      userId: user._id,
      organizationId: user.organizationId,
      action: "priority_changed",
      oldValue: oldPriority,
      newValue: ticket.priority,
      description: `Priority changed from ${oldPriority} to ${ticket.priority}`,
    });
  }

  // Record assignment activity.
  if (assignmentChanged) {
    let description;

    if (!newAssignedTo) {
      description = "Ticket unassigned";
    } else if (!oldAssignedTo) {
      description = "Ticket assigned to an agent";
    } else {
      description = "Ticket reassigned to another agent";
    }

    await ticketActivityService.createActivity({
      ticketId: ticket._id,
      userId: user._id,
      organizationId: user.organizationId,
      action: "assigned",
      oldValue: oldAssignedTo,
      newValue: newAssignedTo,
      description,
    });
  }

  // Record generic update activity.
  if (normalFieldUpdated && !statusChanged && !priorityChanged) {
    await ticketActivityService.createActivity({
      ticketId: ticket._id,
      userId: user._id,
      organizationId: user.organizationId,
      action: "updated",
      description: "Ticket details updated",
    });
  }

  // Invalidate cached ticket lists.
  await invalidateTicketListCache(user.organizationId);

  // Return updated ticket with populated references.
  const updatedTicket = await Ticket.findById(ticket._id)
    .populate("createdBy", "name email")
    .populate("assignedTo", "name email");

  return updatedTicket;
};

module.exports = {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
};
