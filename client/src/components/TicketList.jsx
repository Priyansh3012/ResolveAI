
function TicketList({ tickets, onSelect }) {
    const getStatusClass = (status) => {
        if (status === "Open") {
            return "bg-blue-100 text-blue-700";
        }

        if (status === "In Progress") {
            return "bg-yellow-100 text-yellow-700";
        }

        if (status === "Resolved") {
            return "bg-green-100 text-green-700";
        }

        if (status === "Closed") {
            return "bg-gray-100 text-gray-700";
        }

        return "bg-gray-100 text-gray-600";
    };

    const getPriorityClass = (priority) => {
        if (priority === "Critical") {
            return "bg-red-100 text-red-700";
        }

        if (priority === "High") {
            return "bg-orange-100 text-orange-700";
        }

        if (priority === "Medium") {
            return "bg-yellow-100 text-yellow-700";
        }

        return "bg-gray-100 text-gray-700";
    };

    return (
        <div className="w-full">
            {tickets.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                        <svg
                            className="h-6 w-6 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.8}
                                d="M9 12h6m-6 4h4m5-9.5V19a2 2 0 01-2 2H8a2 2 0 01-2-2V5.5A2.5 2.5 0 018.5 3h5A2.5 2.5 0 0116 5.5V7l2 2.5z"
                            />
                        </svg>
                    </div>

                    <p className="mt-4 text-sm font-medium text-gray-700">
                        No tickets found
                    </p>

                    <p className="mt-1 text-sm text-gray-400">
                        Try changing your filters or create a new ticket.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {tickets.map((ticket) => (
                        <div
                            key={ticket._id}
                            className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md"
                        >
                            {/* Ticket Header */}
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div className="min-w-0">
                                    <span className="text-xs font-medium text-gray-400">
                                        #{ticket._id.slice(-6)}
                                    </span>

                                    <h3 className="mt-1 break-words text-base font-semibold text-gray-900">
                                        {ticket.title}
                                    </h3>

                                    <p className="mt-1 text-sm text-gray-500">
                                        {ticket.category}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => onSelect(ticket._id)}
                                    className="shrink-0 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    View Details
                                </button>
                            </div>

                            {/* Ticket Information */}
                            <div className="mt-5 grid grid-cols-1 gap-4 border-t border-gray-100 pt-4 sm:grid-cols-2 lg:grid-cols-4">
                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                        Status
                                    </p>

                                    <span
                                        className={`mt-1.5 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(
                                            ticket.status
                                        )}`}
                                    >
                                        {ticket.status}
                                    </span>
                                </div>

                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                        Priority
                                    </p>

                                    <span
                                        className={`mt-1.5 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getPriorityClass(
                                            ticket.priority
                                        )}`}
                                    >
                                        {ticket.priority}
                                    </span>
                                </div>

                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                        Category
                                    </p>

                                    <p className="mt-1.5 text-sm font-medium text-gray-700">
                                        {ticket.category}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                        Assigned To
                                    </p>

                                    <p className="mt-1.5 text-sm font-medium text-gray-700">
                                        {ticket.assignedTo?.name ||
                                            "Not assigned"}
                                    </p>
                                </div>
                            </div>

                            {/* Ticket Creation Date */}
                            {ticket.createdAt && (
                                <div className="mt-4 border-t border-gray-100 pt-3">
                                    <p className="text-xs text-gray-400">
                                        Created{" "}
                                        {new Date(
                                            ticket.createdAt
                                        ).toLocaleString()}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default TicketList;
