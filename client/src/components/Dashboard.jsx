import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import TicketForm from "./TicketForm";
import TicketList from "./TicketList";
import TicketDetails from "./TicketDetails";
import TicketFilters from "./TicketFilters";
import DashboardStats from "./DashboardStats";

import { getDashboardStats } from "../services/dashboardService";
import {
  getTickets,
  getTicketById,
  getTicketActivities,
} from "../services/ticketService";
import { getComments } from "../services/commentService";

function Dashboard({ user, onMessage }) {
  const isAdmin = user?.role === "admin";
  const limit = 5;

  const [searchParams, setSearchParams] = useSearchParams();

  const readPage = (params) => {
    const value = Number.parseInt(params.get("page") || "1", 10);
    return Number.isFinite(value) && value > 0 ? value : 1;
  };

  // Search and filters are reflected in the browser URL.
  const searchQuery = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const priority = searchParams.get("priority") || "";
  const page = readPage(searchParams);

  const [searchInput, setSearchInput] = useState(searchQuery);

  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [activities, setActivities] = useState([]);
  const [comments, setComments] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);

  const [totalPages, setTotalPages] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);

  const [loadingTickets, setLoadingTickets] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const ticketRequestId = useRef(0);
  const statsRequestId = useRef(0);
  const detailsRequestId = useRef(0);

  // Keep a search draft synchronized with browser Back/Forward navigation.
  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  // Update URL parameters without discarding unrelated parameters.
  const updateParams = useCallback(
    (updates, options = {}) => {
      const nextParams = new URLSearchParams(searchParams);

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === undefined || value === "") {
          nextParams.delete(key);
        } else {
          nextParams.set(key, String(value));
        }
      });

      setSearchParams(nextParams, {
        replace: options.replace ?? false,
      });
    },
    [searchParams, setSearchParams],
  );

  const setPage = useCallback(
    (nextPage) => {
      const resolvedPage =
        typeof nextPage === "function" ? nextPage(page) : nextPage;

      const normalizedPage = Math.max(1, Number(resolvedPage) || 1);

      updateParams(
        {
          page: normalizedPage === 1 ? null : normalizedPage,
        },
        { replace: true },
      );
    },
    [page, updateParams],
  );

  // Debounce search so typing does not trigger a request on every keystroke.
  useEffect(() => {
    const nextSearch = searchInput.trim();

    if (nextSearch === searchQuery) {
      return undefined;
    }

    const timeoutId = setTimeout(() => {
      updateParams(
        {
          search: nextSearch || null,
          page: null,
        },
        { replace: true },
      );
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [searchInput, searchQuery, updateParams]);

  const handleSearch = (event) => {
    event.preventDefault();

    const nextSearch = searchInput.trim();

    updateParams(
      {
        search: nextSearch || null,
        page: null,
      },
      { replace: true },
    );
  };

  const handleClearSearch = () => {
    setSearchInput("");

    updateParams(
      {
        search: null,
        page: null,
      },
      { replace: true },
    );
  };

  const handleStatusChange = (value) => {
    updateParams(
      {
        status: value || null,
        page: null,
      },
      { replace: true },
    );
  };

  const handlePriorityChange = (value) => {
    updateParams(
      {
        priority: value || null,
        page: null,
      },
      { replace: true },
    );
  };

  const handleClearFilters = () => {
    updateParams(
      {
        status: null,
        priority: null,
        page: null,
      },
      { replace: true },
    );
  };

  // Load tickets when a query parameter changes.
  useEffect(() => {
    let active = true;
    const requestId = ++ticketRequestId.current;

    const loadTickets = async () => {
      setLoadingTickets(true);

      try {
        const data = await getTickets({
          search: isAdmin ? searchQuery : "",
          status,
          priority,
          page,
          limit,
        });

        if (!active || requestId !== ticketRequestId.current) {
          return;
        }

        setTickets(Array.isArray(data?.tickets) ? data.tickets : []);

        const nextTotalPages = Math.max(1, Number(data?.totalPages) || 1);

        setTotalPages(nextTotalPages);

        if (page > nextTotalPages) {
          updateParams(
            {
              page: nextTotalPages === 1 ? null : nextTotalPages,
            },
            { replace: true },
          );
        }
      } catch (error) {
        if (!active || requestId !== ticketRequestId.current) {
          return;
        }

        setTickets([]);
        setTotalPages(1);

        onMessage(error.message || "Failed to load tickets", "error");
      } finally {
        if (active && requestId === ticketRequestId.current) {
          setLoadingTickets(false);
        }
      }
    };

    loadTickets();

    return () => {
      active = false;
    };
  }, [
    isAdmin,
    searchQuery,
    status,
    priority,
    page,
    limit,
    refreshKey,
    onMessage,
    updateParams,
  ]);

  // Load dashboard statistics for Admin users only.
  useEffect(() => {
    let active = true;
    const requestId = ++statsRequestId.current;

    if (!isAdmin) {
      setDashboardStats(null);
      setLoadingStats(false);

      return () => {
        active = false;
      };
    }

    const loadStats = async () => {
      setLoadingStats(true);

      try {
        const data = await getDashboardStats();

        if (!active || requestId !== statsRequestId.current) {
          return;
        }

        setDashboardStats(data?.stats ?? null);
      } catch (error) {
        if (!active || requestId !== statsRequestId.current) {
          return;
        }

        setDashboardStats(null);

        onMessage(
          error.message || "Failed to load dashboard statistics",
          "error",
        );
      } finally {
        if (active && requestId === statsRequestId.current) {
          setLoadingStats(false);
        }
      }
    };

    loadStats();

    return () => {
      active = false;
    };
  }, [isAdmin, refreshKey, onMessage]);

  // Close ticket details when the ticket query changes.
  useEffect(() => {
    detailsRequestId.current += 1;
    setSelectedTicket(null);
    setActivities([]);
    setComments([]);
    setLoadingDetails(false);
  }, [searchQuery, status, priority, page]);

  const handleCloseDetails = useCallback(() => {
    detailsRequestId.current += 1;
    setSelectedTicket(null);
    setActivities([]);
    setComments([]);
    setLoadingDetails(false);
  }, []);

  // The selected ticket remains in React state; its ID is not added to the URL.
  const loadTicketDetails = async (id) => {
    const requestId = ++detailsRequestId.current;

    setSelectedTicket(null);
    setActivities([]);
    setComments([]);
    setLoadingDetails(true);

    try {
      const [ticketData, activityData, commentData] = await Promise.all([
        getTicketById(id),
        getTicketActivities(id),
        getComments(id),
      ]);

      if (requestId !== detailsRequestId.current) {
        return;
      }

      const ticket = ticketData?.ticket;

      if (!ticket) {
        throw new Error("Ticket details were not returned");
      }

      setSelectedTicket(ticket);

      setActivities(
        Array.isArray(activityData?.activities) ? activityData.activities : [],
      );

      setComments(
        Array.isArray(commentData?.comments) ? commentData.comments : [],
      );

      onMessage("", "info");
    } catch (error) {
      if (requestId !== detailsRequestId.current) {
        return;
      }

      onMessage(error.message || "Failed to load ticket details", "error");
    } finally {
      if (requestId === detailsRequestId.current) {
        setLoadingDetails(false);
      }
    }
  };

  const handleTicketCreated = () => {
    setPage(1);
    setRefreshKey((current) => current + 1);
  };

  const handleTicketUpdated = (updatedTicket) => {
    if (!updatedTicket?._id) {
      return;
    }

    setSelectedTicket(updatedTicket);

    setTickets((currentTickets) =>
      currentTickets.map((ticket) =>
        ticket._id === updatedTicket._id ? updatedTicket : ticket,
      ),
    );

    setRefreshKey((current) => current + 1);
  };

  const handleCommentsChange = useCallback((nextComments) => {
    setComments((currentComments) => {
      const resolved =
        typeof nextComments === "function"
          ? nextComments(currentComments)
          : nextComments;

      return Array.isArray(resolved) ? resolved : currentComments;
    });
  }, []);

  // Allow closing the details panel with Escape.
  useEffect(() => {
    if (!selectedTicket && !loadingDetails) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        handleCloseDetails();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedTicket, loadingDetails, handleCloseDetails]);

  const hasActiveFilters = Boolean(status || priority);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Page heading */}
        <div className="mb-8">
          <p className="text-sm font-medium text-blue-600">
            IT Service Management
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            {isAdmin ? "Dashboard" : "My Tickets"}
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            {isAdmin
              ? "Monitor tickets, manage support requests, and track service activity."
              : "Manage your assigned tickets and support requests."}
          </p>
        </div>

        {/* Admin statistics */}
        {isAdmin && (
          <section>
            {loadingStats && !dashboardStats ? (
              <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-blue-600" />

                  <p className="text-sm text-gray-500">
                    Loading dashboard statistics...
                  </p>
                </div>
              </div>
            ) : dashboardStats ? (
              <DashboardStats stats={dashboardStats} />
            ) : (
              <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-500 shadow-sm">
                Dashboard statistics are currently unavailable.
              </div>
            )}
          </section>
        )}

        {/* Create ticket */}
        <section className="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 bg-gray-50 px-6 py-5">
            <h2 className="text-lg font-semibold text-gray-900">
              Create New Ticket
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Submit a new support request and provide the required details.
            </p>
          </div>

          <div className="p-6">
            <TicketForm
              onTicketCreated={handleTicketCreated}
              onMessage={onMessage}
            />
          </div>
        </section>

        {/* Unified ticket management card */}
        <section className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          {/* Card heading */}
          <div className="border-b border-gray-100 bg-gray-50 px-5 py-5 sm:px-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Ticket Management
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {isAdmin
                ? "Search tickets and filter by status or priority."
                : "Filter your tickets by status or priority."}
            </p>
          </div>

          <div className="p-5 sm:p-6">
            {/* Search */}
            {isAdmin && (
              <form
                onSubmit={handleSearch}
                className="mb-6 flex flex-col gap-3 sm:flex-row"
              >
                <div className="min-w-0 flex-1">
                  <label htmlFor="ticket-search" className="sr-only">
                    Search tickets
                  </label>

                  <input
                    id="ticket-search"
                    type="search"
                    value={searchInput}
                    onChange={(event) => setSearchInput(event.target.value)}
                    placeholder="Search by title, description, or ticket ID..."
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
                  >
                    Search
                  </button>

                  {(searchInput || searchQuery) && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </form>
            )}

            {/* Filters remain inside the same card */}

            <TicketFilters
              status={status}
              priority={priority}
              onStatusChange={handleStatusChange}
              onPriorityChange={handlePriorityChange}
              onClearFilters={handleClearFilters}
            />

            <div className="my-6 border-t border-gray-200" />

            {/* Ticket list heading */}
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Your Tickets
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Review ticket status, priority, and assignment.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {hasActiveFilters && (
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                    Filters applied
                  </span>
                )}

                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                  {tickets.length}{" "}
                  {tickets.length === 1 ? "ticket on page" : "tickets on page"}
                </span>
              </div>
            </div>

            {/* Tickets */}
            {loadingTickets ? (
              <div className="rounded-xl border border-gray-200 bg-gray-50 px-6 py-12 text-center">
                <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-gray-200 border-t-blue-600" />

                <p className="mt-3 text-sm font-medium text-gray-500">
                  Loading tickets...
                </p>
              </div>
            ) : (
              <TicketList tickets={tickets} onSelect={loadTicketDetails} />
            )}

            {/* Pagination inside the same card */}
            {!loadingTickets && (
              <div className="mt-6 flex flex-col gap-4 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  ← Previous
                </button>

                <p className="text-center text-sm text-gray-500">
                  Page{" "}
                  <span className="font-semibold text-gray-900">{page}</span> of{" "}
                  <span className="font-semibold text-gray-900">
                    {totalPages}
                  </span>
                </p>

                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() =>
                    setPage((current) => Math.min(totalPages, current + 1))
                  }
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        </section>

        <div className="h-8" />
      </div>

      {/* Ticket details side panel; ticket ID stays out of the URL */}
      {(loadingDetails || selectedTicket) && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <button
            type="button"
            aria-label="Close ticket details"
            onClick={handleCloseDetails}
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-[2px]"
          />

          <section
            role="dialog"
            aria-modal="true"
            aria-label="Ticket details"
            className="relative z-10 h-full w-full overflow-y-auto border-l border-gray-200 bg-white shadow-2xl sm:max-w-xl lg:max-w-2xl"
          >
            {loadingDetails ? (
              <div className="flex min-h-48 items-center justify-center gap-3 p-6 text-sm text-gray-500">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
                Loading ticket details...
              </div>
            ) : selectedTicket ? (
              <div className="p-4 sm:p-6">
                <TicketDetails
                  ticket={selectedTicket}
                  user={user}
                  activities={activities}
                  comments={comments}
                  onCommentsChange={handleCommentsChange}
                  onMessage={onMessage}
                  onClose={handleCloseDetails}
                  onTicketUpdated={handleTicketUpdated}
                />
              </div>
            ) : null}
          </section>
        </div>
      )}
    </main>
  );
}

export default Dashboard;
