
function ActivityHistory({ activities }) {
    const items = Array.isArray(activities) ? activities : [];

    const formatDate = (value) => {
        if (!value) return "Date unavailable";

        const date = new Date(value);

        return Number.isNaN(date.getTime())
            ? "Date unavailable"
            : date.toLocaleString();
    };

    return (
        <div className="w-full">
            {items.length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-5 py-8 text-center">
                    <p className="text-sm font-medium text-gray-600">
                        No activity found.
                    </p>
                </div>
            ) : (
                <div className="relative space-y-4">
                    {items.map((activity, index) => (
                        <div
                            key={activity?._id || `${activity?.createdAt || "activity"}-${index}`}
                            className="rounded-lg border border-gray-200 bg-gray-50 p-4 transition hover:border-gray-300"
                        >
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    <p className="text-sm font-semibold capitalize text-gray-900">
                                        {activity?.action || "Activity"}
                                    </p>

                                    <p className="mt-1 text-sm leading-6 text-gray-600">
                                        {activity?.description || "No description available."}
                                    </p>
                                </div>

                                <p className="shrink-0 text-xs text-gray-400">
                                    {formatDate(activity?.createdAt)}
                                </p>
                            </div>

                            <div className="mt-3 border-t border-gray-200 pt-3">
                                <p className="text-xs text-gray-500">
                                    By{" "}
                                    <span className="font-medium text-gray-700">
                                        {activity?.userId?.name || "Unknown"}
                                    </span>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ActivityHistory;
