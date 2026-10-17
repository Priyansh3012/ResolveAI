
const { GoogleGenAI, Type } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const validCategories = [
    "Technical Issue",
    "Access Request",
    "Software Request",
    "Hardware Issue",
    "Network Issue",
    "Other",
];

const validPriorities = [
    "Low",
    "Medium",
    "High",
    "Critical",
];

const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

// Extract HTTP status/code from common SDK error formats.
const getErrorStatus = (error) => {
    const values = [
        error?.status,
        error?.statusCode,
        error?.code,
        error?.error?.status,
        error?.error?.code,
        error?.response?.status,
    ];

    for (const value of values) {
        const status = Number(value);

        if (Number.isFinite(status) && status > 0) {
            return status;
        }
    }

    return null;
};

// Retry only errors that are likely to be temporary.
const isRetryableError = (error) => {
    const status = getErrorStatus(error);

    if ([408, 429, 500, 502, 503, 504].includes(status)) {
        return true;
    }

    const message = String(error?.message || "");

    return (
        /\b(429|500|502|503|504)\b/.test(message) &&
        /(rate.?limit|overload|unavailable|internal|server error|resource exhausted)/i.test(
            message
        )
    );
};

// Validate the model output before using it in the application.
const validateResult = (result) => {
    if (!result || typeof result !== "object" || Array.isArray(result)) {
        throw new Error("Gemini returned an invalid classification");
    }

    if (!validCategories.includes(result.category)) {
        throw new Error("Gemini returned an invalid category");
    }

    if (!validPriorities.includes(result.priority)) {
        throw new Error("Gemini returned an invalid priority");
    }

    if (
        typeof result.reason !== "string" ||
        !result.reason.trim()
    ) {
        throw new Error("Gemini returned an invalid classification reason");
    }

    return {
        category: result.category,
        priority: result.priority,
        reason: result.reason.trim(),
    };
};

const classifyTicket = async (title, description) => {
    const maxRetries = 3;
    const baseDelay = 1000;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            const response = await ai.models.generateContent({
                model: "gemini-3.8-flash",

                contents: `
You are an IT Service Management ticket classification assistant.

Analyze the following support ticket.

Ticket Title:
${title}

Ticket Description:
${description}

Classify the ticket into exactly one category and one priority.

Allowed categories:
- Technical Issue
- Access Request
- Software Request
- Hardware Issue
- Network Issue
- Other

Allowed priorities:
- Low
- Medium
- High
- Critical

Also provide a short reason explaining the classification.

Do not invent information that is not present in the ticket.
                `,

                config: {
                    responseMimeType: "application/json",

                    responseSchema: {
                        type: Type.OBJECT,

                        properties: {
                            category: {
                                type: Type.STRING,
                                enum: validCategories,
                            },

                            priority: {
                                type: Type.STRING,
                                enum: validPriorities,
                            },

                            reason: {
                                type: Type.STRING,
                            },
                        },

                        required: [
                            "category",
                            "priority",
                            "reason",
                        ],
                    },
                },
            });

            const text = response.text;

            if (typeof text !== "string" || !text.trim()) {
                throw new Error("Gemini returned an empty response");
            }

            let result;

            try {
                result = JSON.parse(text);
            } catch {
                throw new Error("Gemini returned invalid JSON");
            }

            return validateResult(result);
        } catch (error) {
            const retryable = isRetryableError(error);

            // Do not retry permanent errors.
            if (!retryable) {
                throw error;
            }

            // Stop after the initial request and three retries.
            if (attempt === maxRetries) {
                throw error;
            }

            // Exponential backoff: 1s, 2s, 4s.
            const delay = baseDelay * Math.pow(2, attempt);

            console.warn(
                `Gemini request failed (attempt ${attempt + 1}/${maxRetries + 1}). ` +
                `Retrying in ${delay}ms.`
            );

            await sleep(delay);
        }
    }

    throw new Error("Gemini classification failed");
};

module.exports = {
    classifyTicket,
};
