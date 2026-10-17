import { useCallback, useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";

import { getMe } from "./services/authService";

function App() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [loading, setLoading] = useState(true);

  const loggedIn = Boolean(user);

  const handleMessage = useCallback((text, type = "error") => {
    const validTypes = ["success", "error", "info"];

    setMessage(text || "");
    setMessageType(validTypes.includes(type) ? type : "error");
  }, []);

  // Automatically dismiss notifications after 4 seconds.
  useEffect(() => {
    if (!message) return undefined;

    const timeoutId = setTimeout(() => {
      setMessage("");
    }, 4000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [message, messageType]);

  // Restore the user session after page refresh.
  useEffect(() => {
    let active = true;

    const restoreSession = async () => {
      try {
        const data = await getMe();

        if (!data?.user) {
          throw new Error(
            "Unable to restore your session. Please log in again.",
          );
        }

        if (active) {
          setUser(data.user);
          handleMessage("", "info");
        }
      } catch (error) {
        if (!active) return;

        setUser(null);

        const status = error?.status ?? error?.statusCode;
        const errorMessage = error?.message?.toLowerCase() || "";

        const isUnauthenticated =
          status === 401 ||
          errorMessage.includes("not authenticated") ||
          errorMessage.includes("not authorized") ||
          errorMessage.includes("unauthorized");

        if (isUnauthenticated) {
          handleMessage("", "info");
        } else if (error instanceof TypeError) {
          handleMessage(
            "Unable to connect to the server. Check your connection and try logging in.",
            "error",
          );
        } else {
          handleMessage(
            error?.message ||
              "Unable to restore your session. Please log in again.",
            "error",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    restoreSession();

    return () => {
      active = false;
    };
  }, [handleMessage]);

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    handleMessage("", "info");
  };

  // The Navbar handles the API logout request.
  const handleLogout = () => {
    setUser(null);
    handleMessage("", "info");
  };

  // Shared notification component.
  const renderToast = () => {
    if (!message) return null;

    const toastStyles = {
      success: {
        container: "border-green-200 bg-green-50 text-green-800",
        icon: "✓",
      },
      error: {
        container: "border-red-200 bg-red-50 text-red-800",
        icon: "!",
      },
      info: {
        container: "border-blue-200 bg-blue-50 text-blue-800",
        icon: "i",
      },
    };

    const toast = toastStyles[messageType] || toastStyles.info;
    const isError = messageType === "error";

    return (
      <div className="pointer-events-none fixed right-4 top-4 z-[100] w-[calc(100%-2rem)] max-w-md sm:right-6 sm:top-6">
        {" "}
        <div
          role={isError ? "alert" : "status"}
          aria-live={isError ? "assertive" : "polite"}
          className={`pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg ${toast.container}`}
        >
          <span
            aria-hidden="true"
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-current text-sm font-bold"
          >
            {toast.icon}
          </span>

          <p className="flex-1 break-words pt-0.5 text-sm font-medium">
            {message}
          </p>

          <button
            type="button"
            onClick={() => handleMessage("", "info")}
            aria-label="Dismiss notification"
            className="shrink-0 rounded-md px-2 text-lg leading-5 opacity-70 transition hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-current"
          >
            ×
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

          <p className="mt-4 text-sm font-medium text-gray-600">
            Loading ResolveAI...
          </p>
        </div>
      </div>
    );
  }

  const loginPage = (
    <div className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Resolve
            <span className="text-blue-600">AI</span>
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            IT Service Management Platform
          </p>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <Login onLogin={handleLogin} onMessage={handleMessage} />
        </div>
      </div>
    </div>
  );

  const dashboardPage = (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={handleLogout} onMessage={handleMessage} />

      <Dashboard user={user} onMessage={handleMessage} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* Root URL */}
        <Route
          path="/"
          element={<Navigate to={loggedIn ? "/dashboard" : "/login"} replace />}
        />

        {/* Login route */}
        <Route
          path="/login"
          element={loggedIn ? <Navigate to="/dashboard" replace /> : loginPage}
        />

        {/* Protected dashboard route */}
        <Route
          path="/dashboard"
          element={loggedIn ? dashboardPage : <Navigate to="/login" replace />}
        />

        {/* Ticket management currently lives in Dashboard. */}
        <Route
          path="/tickets"
          element={<Navigate to={loggedIn ? "/dashboard" : "/login"} replace />}
        />

        {/* Unknown frontend URLs */}
        <Route
          path="*"
          element={<Navigate to={loggedIn ? "/dashboard" : "/login"} replace />}
        />
      </Routes>

      {renderToast()}
    </div>
  );
}

export default App;
