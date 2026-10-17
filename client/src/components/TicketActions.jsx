
import { useEffect, useState } from "react";
import { updateTicket } from "../services/ticketService";

const validStatuses = [
    "Open",
    "In Progress",
    "Pending",
    "Resolved",
    "Closed"
];

const validPriorities = [
    "Low",
    "Medium",
    "High",
    "Critical"
];

function TicketActions({ ticket, onTicketUpdated, onMessage }) {
    const [status, setStatus] = useState(ticket.status);
    const [priority, setPriority] = useState(ticket.priority);
    const [loading, setLoading] = useState(false);

    // Keep local state synchronized with the selected ticket.
    useEffect(() => {
        setStatus(ticket.status);
        setPriority(ticket.priority);
    }, [ticket]);

    const hasChanges =
        status !== ticket.status ||
        priority !== ticket.priority;

    const handleUpdate = async () => {
        if (loading || !hasChanges) {
            return;
        }

        if (!ticket?._id) {
            onMessage("Cannot update the ticket because its ID is missing.", "error");
            return;
        }

        if (!validStatuses.includes(status)) {
            onMessage("Please select a valid ticket status.", "error");
            return;
        }

        if (!validPriorities.includes(priority)) {
            onMessage("Please select a valid ticket priority.", "error");
            return;
        }

        setLoading(true);
        onMessage("", "info");

        try {
            const data = await updateTicket(ticket._id, {
                status,
                priority
            });

            if (!data?.ticket) {
                throw new Error(
                    "The server did not return the updated ticket."
                );
            }

            onTicketUpdated(data.ticket);
            onMessage("Ticket updated successfully.", "success");
        } catch (error) {
            onMessage(
                error.message || "Failed to update the ticket. Please try again.",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        if (loading) {
            return;
        }

        setStatus(ticket.status);
        setPriority(ticket.priority);
    };

    return (
        <div className="w-full">
            {/* Controls */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* Status */}
                <div>
                    <label
                        htmlFor="ticket-status"
                        className="mb-2 block text-sm font-medium text-gray-700"
                    >
                        Status
                    </label>

                    <select
                        id="ticket-status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        disabled={loading}
                        className={`w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50 disabled:cursor-not-allowed disabled:bg-gray-50 ${
                            status !== ticket.status
                                ? "border-blue-300"
                                : "border-gray-300"
                        }`}
                    >
                        {validStatuses.map((item) => (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Priority */}
                <div>
                    <label
                        htmlFor="ticket-priority"
                        className="mb-2 block text-sm font-medium text-gray-700"
                    >
                        Priority
                    </label>

                    <select
                        id="ticket-priority"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        disabled={loading}
                        className={`w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-50 disabled:cursor-not-allowed disabled:bg-gray-50 ${
                            priority !== ticket.priority
                                ? "border-blue-300"
                                : "border-gray-300"
                        }`}
                    >
                        {validPriorities.map((item) => (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Actions */}
            <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
                {hasChanges && (
                    <button
                        type="button"
                        onClick={handleReset}
                        disabled={loading}
                        className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-100 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Reset
                    </button>
                )}

                <button
                    type="button"
                    onClick={handleUpdate}
                    disabled={!hasChanges || loading}
                    className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading && (
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    )}

                    {loading ? "Updating..." : "Update Ticket"}
                </button>
            </div>

            {/* Unsaved Changes */}
            {hasChanges && !loading && (
                <div className="mt-3 flex justify-end">
                    <p className="text-xs font-medium text-blue-600">
                        You have unsaved changes
                    </p>
                </div>
            )}
        </div>
    );
}

export default TicketActions;