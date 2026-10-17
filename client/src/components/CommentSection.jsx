import { useState } from "react";
import { addComment } from "../services/commentService";

const MAX_COMMENT_LENGTH = 2000;

function CommentSection({
    ticketId,
    comments,
    onCommentsChange,
    onMessage
}) {
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);

    const items = Array.isArray(comments) ? comments : [];

    const formatDate = (value) => {
        if (!value) return "Date unavailable";

        const date = new Date(value);

        return Number.isNaN(date.getTime())
            ? "Date unavailable"
            : date.toLocaleString();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;

        const message = comment.trim();

        if (!ticketId) {
            onMessage("Cannot add a comment because the ticket ID is missing.", "error");
            return;
        }

        if (!message) {
            onMessage("Please enter a comment before submitting.", "error");
            return;
        }

        if (message.length > MAX_COMMENT_LENGTH) {
            onMessage(
                `Comment cannot exceed ${MAX_COMMENT_LENGTH} characters.`,
                "error"
            );
            return;
        }

        setLoading(true);
        onMessage("", "info");

        try {
            const data = await addComment(ticketId, message);

            if (!data?.comment) {
                throw new Error(
                    "The server did not return the created comment."
                );
            }

            onCommentsChange((currentComments) => {
                const current = Array.isArray(currentComments)
                    ? currentComments
                    : [];

                return [...current, data.comment];
            });

            setComment("");
            onMessage("Comment added successfully.", "success");
        } catch (error) {
            onMessage(
                error.message || "Failed to add comment. Please try again.",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            {/* Comments List */}
            {items.length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-5 py-8 text-center">
                    <p className="text-sm font-medium text-gray-600">
                        No comments yet.
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                        Be the first to add a comment.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {items.map((item, index) => (
                        <div
                            key={item?._id || `comment-${index}`}
                            className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    {/* Avatar */}
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                                        {item?.userId?.name
                                            ?.charAt(0)
                                            .toUpperCase() || "U"}
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">
                                            {item?.userId?.name || "Unknown"}
                                        </p>

                                        <p className="text-xs text-gray-400">
                                            {formatDate(item?.createdAt)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-gray-700">
                                {item?.message || ""}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Comment */}
            <form onSubmit={handleSubmit} className="mt-6">
                <label
                    htmlFor="ticket-comment"
                    className="mb-2 block text-sm font-medium text-gray-700"
                >
                    Add a comment
                </label>

                <textarea
                    id="ticket-comment"
                    placeholder="Write a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    maxLength={MAX_COMMENT_LENGTH}
                    required
                    disabled={loading}
                    aria-describedby="comment-character-count"
                    className="w-full resize-y rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
                />

                <div
                    id="comment-character-count"
                    className="mt-1 text-right text-xs text-gray-400"
                >
                    {comment.length}/{MAX_COMMENT_LENGTH}
                </div>

                <div className="mt-3 flex justify-end">
                    <button
                        type="submit"
                        disabled={loading || !comment.trim()}
                        className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        {loading && (
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        )}

                        {loading ? "Adding..." : "Add Comment"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CommentSection;
