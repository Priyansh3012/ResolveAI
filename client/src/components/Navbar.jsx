
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../services/authService";

function Navbar({ user, onLogout, onMessage }) {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        if (loading) {
            return;
        }

        setLoading(true);
        onMessage("", "info");

        try {
            await logoutUser();

            onLogout();
            navigate("/login", { replace: true });

            onMessage(
                "You have been logged out successfully.",
                "success"
            );
        } catch (error) {
            onMessage(
                error.message || "Unable to log out. Please try again.",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <nav className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Brand */}
                <Link
                    to="/dashboard"
                    className="min-w-0 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="ResolveAI Dashboard"
                >
                    <h2 className="text-xl font-bold tracking-tight text-gray-900">
                        Resolve<span className="text-blue-600">AI</span>
                    </h2>

                    <p className="hidden text-xs text-gray-500 sm:block">
                        IT Service Management
                    </p>
                </Link>

                {/* User Section */}
                <div className="flex items-center gap-3 sm:gap-4">
                    {/* User Information */}
                    <div className="hidden text-right sm:block">
                        <p className="max-w-[180px] truncate text-sm font-semibold text-gray-900">
                            {user?.name || "User"}
                        </p>

                        <p className="text-xs capitalize text-gray-500">
                            {user?.role || ""}
                        </p>
                    </div>

                    {/* Avatar */}
                    <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700 ring-4 ring-blue-50"
                        title={user?.name || "User"}
                        aria-label={`Avatar for ${user?.name || "User"}`}
                    >
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                    </div>

                    {/* Logout */}
                    <button
                        type="button"
                        onClick={handleLogout}
                        disabled={loading}
                        className="flex min-w-[78px] items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition duration-200 hover:border-red-300 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-4 focus:ring-red-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:border-gray-300 disabled:hover:bg-white disabled:hover:text-gray-700"
                    >
                        {loading && (
                            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-700" />
                        )}

                        {loading ? "Logging out..." : "Logout"}
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
