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
                data = {};
            }
        }
    } catch {
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

// Get dashboard statistics.
export const getDashboardStats = async () => {
    const response = await fetch(`${API_URL}/dashboard`, {
        credentials: "include"
    });

    return parseResponse(
        response,
        "Failed to fetch dashboard statistics"
    );
};