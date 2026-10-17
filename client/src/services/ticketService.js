
import API_URL from "./api";

// Parse API responses and handle HTTP errors consistently.
const parseResponse = async (response, fallbackMessage) => {
    let data = {};

    try {
        const text = await response.text();

        if (text) {
            try {
                data = JSON.parse(text);
            } catch {
                // Avoid exposing raw HTML or malformed server responses.
                data = {};
            }
        }
    } catch {
        // The response body could not be read.
        data = {};
    }

    if (!response.ok) {
        throw new Error(
            data.message ||
                data.error?.message ||
                fallbackMessage
        );
    }

    return data;
};

// Send a request and provide a clear error for network failures.
const request = async (url, options, fallbackMessage) => {
    let response;

    try {
        response = await fetch(url, options);
    } catch {
        throw new Error(
            "Unable to connect to the server. Please check your connection and try again."
        );
    }

    return parseResponse(response, fallbackMessage);
};

// Get tickets using server-side search, filters, and pagination.
export const getTickets = async ({
    search = "",
    status = "",
    category = "",
    priority = "",
    page = 1,
    limit = 5
} = {}) => {
    const params = new URLSearchParams();

    if (search.trim()) {
        params.append("search", search.trim());
    }

    if (status) {
        params.append("status", status);
    }

    if (category) {
        params.append("category", category);
    }

    if (priority) {
        params.append("priority", priority);
    }

    params.append("page", page);
    params.append("limit", limit);

    return request(
        `${API_URL}/tickets?${params.toString()}`,
        {
            credentials: "include"
        },
        "Failed to fetch tickets."
    );
};

// Create ticket.
export const createTicket = async (ticket) => {
    return request(
        `${API_URL}/tickets`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(ticket)
        },
        "Failed to create ticket."
    );
};

// Get a single ticket.
export const getTicketById = async (id) => {
    return request(
        `${API_URL}/tickets/${encodeURIComponent(id)}`,
        {
            credentials: "include"
        },
        "Failed to fetch ticket."
    );
};

// Get ticket activities.
export const getTicketActivities = async (id) => {
    return request(
        `${API_URL}/tickets/${encodeURIComponent(id)}/activity`,
        {
            credentials: "include"
        },
        "Failed to fetch ticket activity."
    );
};

// Update ticket.
export const updateTicket = async (id, updates) => {
    return request(
        `${API_URL}/tickets/${encodeURIComponent(id)}`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(updates)
        },
        "Failed to update ticket."
    );
};
