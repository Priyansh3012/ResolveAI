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

// Send an API request and provide a clear network error if it fails.
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

// Login user.
export const loginUser = async (email, password) => {
    return request(
        `${API_URL}/auth/login`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                email,
                password
            })
        },
        "Login failed. Please check your credentials."
    );
};

// Get currently authenticated user.
export const getMe = async () => {
    return request(
        `${API_URL}/auth/me`,
        {
            credentials: "include"
        },
        "Not authenticated"
    );
};

// Logout user.
export const logoutUser = async () => {
    return request(
        `${API_URL}/auth/logout`,
        {
            method: "POST",
            credentials: "include"
        },
        "Logout failed. Please try again."
    );
};
