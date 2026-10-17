import { useState } from "react";
import { createTicket } from "../services/ticketService";

const initialForm = {
    title: "",
    description: "",
    category: "",
    priority: "Medium",
};

const validCategories = [
    "Technical Issue",
    "Access Request",
    "Software Request",
    "Hardware Issue",
    "Network Issue",
    "Other",
];

const validPriorities = ["Low", "Medium", "High", "Critical"];

function TicketForm({ onTicketCreated, onMessage }) {
    const [form, setForm] = useState(initialForm);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;

        const title = form.title.trim();
        const description = form.description.trim();

        // Validate title.
        if (!title) {
            onMessage("Ticket title is required.", "error");
            return;
        }

        if (title.length > 150) {
            onMessage(
                "Ticket title cannot exceed 150 characters.",
                "error"
            );
            return;
        }

        // Validate description.
        if (!description) {
            onMessage("Ticket description is required.", "error");
            return;
        }

        if (description.length > 5000) {
            onMessage(
                "Ticket description cannot exceed 5000 characters.",
                "error"
            );
            return;
        }

        // Validate category.
        if (!validCategories.includes(form.category)) {
            onMessage("Please select a valid ticket category.", "error");
            return;
        }

        // Validate priority.
        if (!validPriorities.includes(form.priority)) {
            onMessage("Please select a valid ticket priority.", "error");
            return;
        }

        const ticketData = {
            title,
            description,
            category: form.category,
            priority: form.priority,
        };

        setLoading(true);
        onMessage("", "info");

        let created = false;

        try {
            // Create the ticket.
            try {
                await createTicket(ticketData);
                created = true;
            } catch (error) {
                onMessage(
                    error.message ||
                        "Failed to create ticket. Please try again.",
                    "error"
                );
                return;
            }

            // The API confirmed creation.
            setForm({ ...initialForm });
            onMessage("Ticket created successfully.", "success");

            // Refresh the list independently of ticket creation.
            if (onTicketCreated) {
                try {
                    await onTicketCreated();
                } catch {
                    // Don't report a failed creation after successful creation.
                    onMessage(
                        "Ticket created successfully, but the ticket list could not be refreshed. Please refresh the page.",
                        "info"
                    );
                }
            }
        } finally {
            setLoading(false);

            // Defensive fallback for unexpected errors after creation.
            if (created) {
                // Do not change the notification here.
            }
        }
    };

    return (
        <div className="w-full">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">
                    Create Ticket
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Submit a support request and provide details about the issue.
                </p>
            </div>

            {/* noValidate lets our custom validation run on submit. */}
            <form
                onSubmit={handleSubmit}
                noValidate
                className="space-y-5"
            >
                {/* Ticket Title */}
                <div>
                    <label
                        htmlFor="title"
                        className="mb-2 block text-sm font-medium text-gray-700"
                    >
                        Ticket Title
                    </label>

                    <input
                        id="title"
                        type="text"
                        name="title"
                        placeholder="Enter ticket title"
                        value={form.title}
                        onChange={handleChange}
                        maxLength={150}
                        required
                        disabled={loading}
                        aria-required="true"
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
                    />

                    <p className="mt-1 text-right text-xs text-gray-400">
                        {form.title.length}/150
                    </p>
                </div>

                {/* Description */}
                <div>
                    <label
                        htmlFor="description"
                        className="mb-2 block text-sm font-medium text-gray-700"
                    >
                        Description
                    </label>

                    <textarea
                        id="description"
                        name="description"
                        placeholder="Describe the issue in detail"
                        value={form.description}
                        onChange={handleChange}
                        rows={5}
                        maxLength={5000}
                        required
                        disabled={loading}
                        aria-required="true"
                        className="w-full resize-y rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
                    />

                    <p className="mt-1 text-right text-xs text-gray-400">
                        {form.description.length}/5000
                    </p>
                </div>

                {/* Category and Priority */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    {/* Category */}
                    <div>
                        <label
                            htmlFor="category"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Category
                        </label>

                        <select
                            id="category"
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            aria-required="true"
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
                        >
                            <option value="">Select category</option>

                            {validCategories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Priority */}
                    <div>
                        <label
                            htmlFor="priority"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Priority
                        </label>

                        <select
                            id="priority"
                            name="priority"
                            value={form.priority}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            aria-required="true"
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
                        >
                            {validPriorities.map((priority) => (
                                <option key={priority} value={priority}>
                                    {priority}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Submit */}
                <div className="flex justify-end pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading && (
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        )}

                        {loading ? "Creating..." : "Create Ticket"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default TicketForm;