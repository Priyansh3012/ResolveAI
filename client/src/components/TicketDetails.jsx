
import ActivityHistory from "./ActivityHistory";
import CommentSection from "./CommentSection";
import TicketActions from "./TicketActions";
import TicketAssignment from "./TicketAssignment";

function TicketDetails({
  ticket,
  user,
  activities,
  comments,
  onCommentsChange,
  onMessage,
  onClose,
  onTicketUpdated,
}) {
  const aiAnalysis = ticket.aiAnalysis;

  const isAdmin = user?.role === "admin";

  const isAssignedAgent =
    user?.role === "agent" &&
    ticket.assignedTo?._id?.toString() === user?._id?.toString();

  const canUpdateTicket = isAdmin || isAssignedAgent;

  return (
    <div className="w-full">
      <div className="flex flex-col gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium text-blue-600">
            Ticket Details
          </p>

          <h2 className="mt-1 break-words text-2xl font-bold text-gray-900">
            {ticket.title}
          </h2>

          <p className="mt-2 text-xs text-gray-400">
            Ticket ID: {ticket._id}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Close Details
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="h-full rounded-xl border border-gray-200 bg-gray-50 p-5">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Description
            </h3>

            <p className="whitespace-pre-wrap text-sm leading-6 text-gray-700">
              {ticket.description}
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Ticket Information
          </h3>

          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Category
              </p>
              <p className="mt-1 text-sm font-medium text-gray-800">
                {ticket.category}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Priority
              </p>
              <span className="mt-1 inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                {ticket.priority}
              </span>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Status
              </p>
              <span className="mt-1 inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                {ticket.status}
              </span>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Created By
              </p>
              <p className="mt-1 text-sm font-medium text-gray-800">
                {ticket.createdBy?.name || "Unknown"}
              </p>
              {ticket.createdBy?.email && (
                <p className="mt-1 text-xs text-gray-500">
                  {ticket.createdBy.email}
                </p>
              )}
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Assigned To
              </p>
              <p className="mt-1 text-sm font-medium text-gray-800">
                {ticket.assignedTo?.name || "Not assigned"}
              </p>
              {ticket.assignedTo?.email && (
                <p className="mt-1 text-xs text-gray-500">
                  {ticket.assignedTo.email}
                </p>
              )}
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Created
              </p>
              <p className="mt-1 text-sm font-medium text-gray-800">
                {ticket.createdAt
                  ? new Date(ticket.createdAt).toLocaleString()
                  : "Unknown"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Last Updated
              </p>
              <p className="mt-1 text-sm font-medium text-gray-800">
                {ticket.updatedAt
                  ? new Date(ticket.updatedAt).toLocaleString()
                  : "Unknown"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {aiAnalysis &&
        (aiAnalysis.predictedCategory ||
          aiAnalysis.recommendedPriority ||
          aiAnalysis.reason) && (
          <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-5">
            <h3 className="text-lg font-semibold text-gray-900">
              AI Analysis
            </h3>

            <p className="mt-1 text-sm text-gray-600">
              AI-generated recommendations based on the ticket title and description.
            </p>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-blue-100 bg-white p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Predicted Category
                </p>
                <p className="mt-2 text-sm font-semibold text-gray-800">
                  {aiAnalysis.predictedCategory || "Not available"}
                </p>
              </div>

              <div className="rounded-lg border border-blue-100 bg-white p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Recommended Priority
                </p>
                <p className="mt-2 text-sm font-semibold text-gray-800">
                  {aiAnalysis.recommendedPriority || "Not available"}
                </p>
              </div>
            </div>

            {aiAnalysis.reason && (
              <div className="mt-4 rounded-lg border border-blue-100 bg-white p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  AI Reason
                </p>
                <p className="mt-2 text-sm leading-6 text-gray-700">
                  {aiAnalysis.reason}
                </p>
              </div>
            )}
          </div>
        )}

      {canUpdateTicket && (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5">
          <h3 className="text-lg font-semibold text-gray-900">
            Ticket Actions
          </h3>

          <p className="mt-1 mb-4 text-sm text-gray-500">
            Update the ticket status and priority.
          </p>

          <TicketActions
            ticket={ticket}
            onTicketUpdated={onTicketUpdated}
            onMessage={onMessage}
          />
        </div>
      )}

      {isAdmin && (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5">
          <h3 className="text-lg font-semibold text-gray-900">
            Ticket Assignment
          </h3>

          <p className="mt-1 mb-4 text-sm text-gray-500">
            Assign this ticket to an available support agent.
          </p>

          <TicketAssignment
            ticket={ticket}
            onTicketUpdated={onTicketUpdated}
            onMessage={onMessage}
          />
        </div>
      )}

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5">
        <h3 className="text-lg font-semibold text-gray-900">
          Activity History
        </h3>

        <p className="mt-1 mb-4 text-sm text-gray-500">
          Track changes and actions performed on this ticket.
        </p>

        <ActivityHistory activities={activities || []} />
      </div>

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5">
        <h3 className="text-lg font-semibold text-gray-900">
          Comments
        </h3>

        <p className="mt-1 mb-4 text-sm text-gray-500">
          Add updates or communicate about this ticket.
        </p>

        <CommentSection
          ticketId={ticket._id}
          comments={comments || []}
          onCommentsChange={onCommentsChange}
          onMessage={onMessage}
        />
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Close Details
        </button>
      </div>
    </div>
  );
}

export default TicketDetails;
