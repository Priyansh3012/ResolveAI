
function DashboardStats({ stats }) {
    if (!stats || typeof stats !== "object") {
        return null;
    }

    const status = stats.status ?? {};
    const priority = stats.priority ?? {};
    const category = stats.category ?? {};

    const getCount = (value) => {
        const count = Number(value);
        return Number.isFinite(count) && count >= 0 ? count : 0;
    };

    const total = getCount(stats.total);

    const statusItems = [
        {
            label: "Open",
            value: getCount(status.Open),
            color: "bg-blue-500",
            dot: "bg-blue-500",
        },
        {
            label: "In Progress",
            value: getCount(status["In Progress"]),
            color: "bg-indigo-500",
            dot: "bg-indigo-500",
        },
        {
            label: "Pending",
            value: getCount(status.Pending),
            color: "bg-amber-500",
            dot: "bg-amber-500",
        },
        {
            label: "Resolved",
            value: getCount(status.Resolved),
            color: "bg-emerald-500",
            dot: "bg-emerald-500",
        },
        {
            label: "Closed",
            value: getCount(status.Closed),
            color: "bg-slate-500",
            dot: "bg-slate-500",
        },
    ];

    const priorityItems = [
        {
            label: "Low",
            value: getCount(priority.Low),
            color: "bg-sky-500",
            dot: "bg-sky-500",
        },
        {
            label: "Medium",
            value: getCount(priority.Medium),
            color: "bg-amber-500",
            dot: "bg-amber-500",
        },
        {
            label: "High",
            value: getCount(priority.High),
            color: "bg-orange-500",
            dot: "bg-orange-500",
        },
        {
            label: "Critical",
            value: getCount(priority.Critical),
            color: "bg-red-500",
            dot: "bg-red-500",
        },
    ];

    const categoryItems = [
        ["Technical Issue", getCount(category["Technical Issue"])],
        ["Access Request", getCount(category["Access Request"])],
        ["Software Request", getCount(category["Software Request"])],
        ["Hardware Issue", getCount(category["Hardware Issue"])],
        ["Network Issue", getCount(category["Network Issue"])],
        ["Other", getCount(category.Other)],
    ];

    const cards = [
        {
            title: "Total tickets",
            value: total,
            description: "Across your organization",
            accent: "border-l-blue-600",
            valueColor: "text-gray-900",
        },
        {
            title: "Open",
            value: getCount(status.Open),
            description: "Awaiting resolution",
            accent: "border-l-blue-500",
            valueColor: "text-blue-700",
        },
        {
            title: "In progress",
            value: getCount(status["In Progress"]),
            description: "Currently being handled",
            accent: "border-l-indigo-500",
            valueColor: "text-indigo-700",
        },
        {
            title: "Pending",
            value: getCount(status.Pending),
            description: "Waiting for next action",
            accent: "border-l-amber-500",
            valueColor: "text-amber-700",
        },
        {
            title: "Resolved",
            value: getCount(status.Resolved),
            description: "Successfully resolved",
            accent: "border-l-emerald-500",
            valueColor: "text-emerald-700",
        },
        {
            title: "Closed",
            value: getCount(status.Closed),
            description: "Completed tickets",
            accent: "border-l-slate-400",
            valueColor: "text-slate-700",
        },
        {
            title: "High / Critical",
            value: getCount(stats.highPriority),
            description: "Requires close attention",
            accent: "border-l-red-500",
            valueColor: "text-red-700",
        },
    ];

    const renderBreakdown = (title, description, items, columns) => (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5">
                <h3 className="text-base font-semibold text-gray-900">
                    {title}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                    {description}
                </p>
            </div>

            <div className={`grid grid-cols-2 gap-3 ${columns}`}>
                {items.map(([label, value]) => (
                    <div
                        key={label}
                        className="rounded-xl border border-gray-100 bg-gray-50/80 p-4 transition hover:border-gray-200 hover:bg-white"
                    >
                        <p className="text-xs font-medium leading-5 text-gray-500 sm:text-sm">
                            {label}
                        </p>

                        <p className="mt-2 text-2xl font-bold tracking-tight text-gray-900">
                            {value}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );

    const renderDistribution = (title, description, items) => (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-6">
                <h3 className="text-base font-semibold text-gray-900">
                    {title}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                    {description}
                </p>
            </div>

            <div className="space-y-5">
                {items.map((item) => {
                    const percentage =
                        total > 0
                            ? Math.min(100, (item.value / total) * 100)
                            : 0;

                    return (
                        <div key={item.label}>
                            <div className="mb-2 flex items-center justify-between gap-3">
                                <div className="flex min-w-0 items-center gap-2">
                                    <span
                                        className={`h-2.5 w-2.5 shrink-0 rounded-full ${item.dot}`}
                                    />

                                    <span className="truncate text-sm font-medium text-gray-700">
                                        {item.label}
                                    </span>
                                </div>

                                <div className="flex shrink-0 items-center gap-2">
                                    <span className="text-sm font-semibold tabular-nums text-gray-900">
                                        {item.value}
                                    </span>

                                    <span className="w-12 text-right text-xs tabular-nums text-gray-400">
                                        {percentage.toFixed(0)}%
                                    </span>
                                </div>
                            </div>

                            <div
                                className="h-2 overflow-hidden rounded-full bg-gray-100"
                                role="progressbar"
                                aria-label={`${item.label} tickets`}
                                aria-valuemin={0}
                                aria-valuemax={total}
                                aria-valuenow={Math.min(item.value, total)}
                            >
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${item.color}`}
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );

    return (
        <section className="mb-8">
            {/* KPI cards */}
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {cards.map((card) => (
                    <article
                        key={card.title}
                        className={`rounded-xl border border-gray-200 border-l-4 ${card.accent} bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md`}
                    >
                        <p className="text-sm font-medium text-gray-500">
                            {card.title}
                        </p>

                        <p
                            className={`mt-3 text-3xl font-bold tracking-tight tabular-nums ${card.valueColor}`}
                        >
                            {card.value}
                        </p>

                        <p className="mt-2 text-xs leading-5 text-gray-500">
                            {card.description}
                        </p>
                    </article>
                ))}
            </div>

            {/* Status and priority analytics */}
            <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-2">
                {renderDistribution(
                    "Ticket status",
                    "Distribution of tickets by current status.",
                    statusItems
                )}

                {renderDistribution(
                    "Priority overview",
                    "Understand the urgency of incoming work.",
                    priorityItems
                )}
            </div>

            {/* Category breakdown */}
            <div className="mt-6 grid grid-cols-1 items-start gap-6">
                {renderBreakdown(
                    "Tickets by category",
                    "See which types of support requests occur most often.",
                    categoryItems,
                    "md:grid-cols-3 xl:grid-cols-6"
                )}
            </div>
        </section>
    );
}

export default DashboardStats;
