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

    if (!data || typeof data !== "object" || Array.isArray(data)) {
        throw new Error("The server returned an invalid response.");
    }

    return data;
};

// Send a request and provide a clear network error when needed.
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

// Get comments for a ticket.
export const getComments = async (ticketId) => {
    if (!ticketId) {
        throw new Error("Ticket ID is required to fetch comments.");
    }

    const data = await request(
        `${API_URL}/comments/${encodeURIComponent(ticketId)}`,
        {
            credentials: "include"
        },
        "Failed to fetch comments."
    );

    return {
        ...data,
        comments: Array.isArray(data.comments) ? data.comments : []
    };
};

// Add a comment to a ticket.
export const addComment = async (ticketId, message) => {
    if (!ticketId) {
        throw new Error("Ticket ID is required to add a comment.");
    }

    if (typeof message !== "string" || !message.trim()) {
        throw new Error("Comment cannot be empty.");
    }

    if (message.trim().length > 2000) {
        throw new Error("Comment cannot exceed 2000 characters.");
    }

    return request(
        `${API_URL}/comments/${encodeURIComponent(ticketId)}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                message: message.trim()
            })
        },
        "Failed to add comment."
    );
};
