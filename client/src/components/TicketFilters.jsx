
function TicketFilters({
    status,
    priority,
    onStatusChange,
    onPriorityChange,
    onClearFilters,
}) {
    const hasFilters = Boolean(status || priority);

    const handleClearFilters = () => {
        onClearFilters();
    };

    return (
        <div className="w-full">
            {/* Header */}
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold text-gray-900">
                            Filter Tickets
                        </h3>

                        {hasFilters && (
                            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                                Active
                            </span>
                        )}
                    </div>

                    <p className="mt-1 text-sm text-gray-500">
                        Narrow down tickets by status or priority.
                    </p>
                </div>

                {hasFilters && (
                    <button
                        type="button"
                        onClick={handleClearFilters}
                        className="self-start rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-600 transition hover:border-gray-400 hover:bg-gray-50 hover:text-gray-900 sm:self-auto"
                    >
                        Clear Filters
                    </button>
                )}
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Status Filter */}
                <div>
                    <label
                        htmlFor="status-filter"
                        className="mb-2 block text-sm font-medium text-gray-700"
                    >
                        Status
                    </label>

                    <select
                        id="status-filter"
                        value={status}
                        onChange={(event) =>
                            onStatusChange(event.target.value)
                        }
                        className={`w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${
                            status
                                ? "border-blue-300"
                                : "border-gray-300"
                        }`}
                    >
                        <option value="">All Statuses</option>
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Pending">Pending</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                    </select>
                </div>

                {/* Priority Filter */}
                <div>
                    <label
                        htmlFor="priority-filter"
                        className="mb-2 block text-sm font-medium text-gray-700"
                    >
                        Priority
                    </label>

                    <select
                        id="priority-filter"
                        value={priority}
                        onChange={(event) =>
                            onPriorityChange(event.target.value)
                        }
                        className={`w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${
                            priority
                                ? "border-blue-300"
                                : "border-gray-300"
                        }`}
                    >
                        <option value="">All Priorities</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                    </select>
                </div>
            </div>
        </div>
    );
}

export default TicketFilters;