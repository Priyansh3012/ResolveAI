import { useEffect, useState } from "react";

import { getAgents } from "../services/userService";
import { updateTicket } from "../services/ticketService";

function TicketAssignment({ ticket, onTicketUpdated, onMessage }) {
    const [agents, setAgents] = useState([]);
    const [agentsLoading, setAgentsLoading] = useState(true);
    const [agentsError, setAgentsError] = useState("");

    const [selectedAgent, setSelectedAgent] = useState(
        ticket.assignedTo?._id || ""
    );

    const [loading, setLoading] = useState(false);

    const currentAgent = ticket.assignedTo?._id || "";
    const hasChanges = selectedAgent !== currentAgent;

    // Keep the selection synchronized with the selected ticket.
    useEffect(() => {
        setSelectedAgent(ticket.assignedTo?._id || "");
    }, [ticket._id, ticket.assignedTo?._id]);

    // Load agents when the component mounts.
    useEffect(() => {
        let active = true;

        const loadAgents = async () => {
            setAgentsLoading(true);
            setAgentsError("");

            try {
                const data = await getAgents();

                if (!active) return;

                if (!Array.isArray(data?.agents)) {
                    throw new Error("The server returned an invalid agent list.");
                }

                setAgents(data.agents);
            } catch (error) {
                if (!active) return;

                const errorMessage =
                    error.message || "Failed to load agents.";

                setAgents([]);
                setAgentsError(errorMessage);
                onMessage(errorMessage, "error");
            } finally {
                if (active) {
                    setAgentsLoading(false);
                }
            }
        };

        loadAgents();

        return () => {
            active = false;
        };
    }, [onMessage]);

    // Update ticket assignment.
    const handleAssign = async () => {
        if (!hasChanges || loading || agentsLoading || agentsError) {
            return;
        }

        if (!ticket?._id) {
            onMessage("Cannot assign the ticket because its ID is missing.", "error");
            return;
        }

        const agentExists =
            selectedAgent === "" ||
            agents.some((agent) => agent._id === selectedAgent);

        if (!agentExists) {
            onMessage("Please select a valid agent.", "error");
            return;
        }

        setLoading(true);
        onMessage("", "info");

        try {
            const data = await updateTicket(ticket._id, {
                assignedTo: selectedAgent || null
            });

            if (!data?.ticket) {
                throw new Error(
                    "The server did not return the updated ticket."
                );
            }

            onTicketUpdated(data.ticket);
            onMessage("Ticket assignment updated successfully.", "success");
        } catch (error) {
            onMessage(
                error.message || "Failed to update ticket assignment.",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    // Reset selection.
    const handleReset = () => {
        if (loading) return;

        setSelectedAgent(currentAgent);
    };

    return (
        <div className="w-full">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto] md:items-end">
                <div>
                    <label
                        htmlFor="ticket-agent"
                        className="mb-2 block text-sm font-medium text-gray-700"
                    >
                        Assign Agent
                    </label>

                    <select
                        id="ticket-agent"
                        value={selectedAgent}
                        onChange={(e) => setSelectedAgent(e.target.value)}
                        disabled={
                            loading ||
                            agentsLoading ||
                            Boolean(agentsError)
                        }
                        aria-describedby={
                            agentsError ? "ticket-agent-error" : undefined
                        }
                        className={`w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-50 ${
                            hasChanges ? "border-blue-300" : "border-gray-300"
                        }`}
                    >
                        <option value="">
                            {agentsLoading
                                ? "Loading agents..."
                                : agentsError
                                  ? "Agents unavailable"
                                  : "Unassigned"}
                        </option>

                        {agents.map((agent) => (
                            <option key={agent._id} value={agent._id}>
                                {agent.name} ({agent.email})
                            </option>
                        ))}
                    </select>

                    {agentsError && (
                        <p
                            id="ticket-agent-error"
                            role="alert"
                            className="mt-2 text-sm text-red-600"
                        >
                            Unable to load agents. Please try again by
                            reopening the ticket.
                        </p>
                    )}

                    {!agentsLoading &&
                        !agentsError &&
                        agents.length === 0 && (
                            <p className="mt-2 text-sm text-gray-500">
                                No agents are available in your organization.
                            </p>
                        )}
                </div>

                <div className="flex gap-3">
                    {hasChanges && (
                        <button
                            type="button"
                            onClick={handleReset}
                            disabled={loading || agentsLoading || Boolean(agentsError)}
                            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Reset
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={handleAssign}
                        disabled={
                            !hasChanges ||
                            loading ||
                            agentsLoading ||
                            Boolean(agentsError)
                        }
                        className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading && (
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        )}

                        {loading
                            ? "Updating..."
                            : agentsLoading
                              ? "Loading agents..."
                              : "Assign Ticket"}
                    </button>
                </div>
            </div>

            {hasChanges && !loading && !agentsLoading && !agentsError && (
                <p className="mt-3 text-right text-xs font-medium text-blue-600">
                    Unsaved assignment change
                </p>
            )}
        </div>
    );
}

export default TicketAssignment;