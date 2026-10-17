import { useState } from "react";
import { loginUser } from "../services/authService";

function Login({ onLogin, onMessage }) {
    const [login, setLogin] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setLogin((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;

        const email = login.email.trim();
        const password = login.password;

        // Validate required fields.
        if (!email || !password) {
            onMessage("Email and password are required.", "error");
            return;
        }

        // Basic email format validation.
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            onMessage("Please enter a valid email address.", "error");
            return;
        }

        setLoading(true);
        onMessage("", "info");

        try {
            const data = await loginUser(email, password);

            if (!data?.user) {
                throw new Error(
                    "Login failed: the server did not return user details."
                );
            }

            onLogin(data.user);

            onMessage(
                `Welcome ${data.user.name || "back"}!`,
                "success"
            );
        } catch (error) {
            onMessage(
                error.message ||
                    "Login failed. Please check your credentials.",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            {/* Header */}
            <div className="mb-8 text-center">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-xl font-bold text-white shadow-md shadow-blue-100">
                    R
                </div>

                <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                    Welcome to{" "}
                    <span className="text-blue-600">ResolveAI</span>
                </h1>

                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
                    Sign in to manage your IT service requests and support
                    tickets.
                </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                    <label
                        htmlFor="login-email"
                        className="mb-2 block text-sm font-medium text-gray-700"
                    >
                        Email address
                    </label>

                    <input
                        id="login-email"
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        value={login.email}
                        onChange={handleChange}
                        autoComplete="email"
                        maxLength={254}
                        required
                        disabled={loading}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition duration-200 placeholder:text-gray-400 hover:border-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-70"
                    />
                </div>

                {/* Password */}
                <div>
                    <label
                        htmlFor="login-password"
                        className="mb-2 block text-sm font-medium text-gray-700"
                    >
                        Password
                    </label>

                    <input
                        id="login-password"
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        value={login.password}
                        onChange={handleChange}
                        autoComplete="current-password"
                        required
                        disabled={loading}
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition duration-200 placeholder:text-gray-400 hover:border-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-70"
                    />
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-blue-100 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-blue-600 disabled:hover:shadow-sm"
                >
                    {loading && (
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    )}

                    {loading ? "Signing in..." : "Sign in"}
                </button>
            </form>

            {/* Footer */}
            <div className="mt-8 border-t border-gray-100 pt-5 text-center">
                <p className="text-xs text-gray-400">
                    ResolveAI · IT Service Management
                </p>
            </div>
        </div>
    );
}

export default Login;
