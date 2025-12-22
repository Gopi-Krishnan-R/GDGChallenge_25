import React, { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useSession } from "../hooks/useSession";
import { useFilters } from "../hooks/useFilters";
import FiltersPanel from "../components/FiltersPanel";
import EventCard from "../components/EventCard";

const EventsTimelinePage = ({ navigate, events }) => {
  const { user, userName, profileExists, loading } = useSession();
  const { filters, setFilters, filteredEvents } = useFilters(events);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && user && !profileExists) {
      navigate("onboarding");
    }
  }, [user, profileExists, loading, navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("landing");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const sortedEvents = [...filteredEvents].sort(
    (a, b) => new Date(a.start_time) - new Date(b.start_time)
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading session...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Events Timeline
          </h1>

          {/* USER MENU */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all"
            >
              {userName
                ? userName[0].toUpperCase()
                : user?.email
                ? user.email[0].toUpperCase()
                : "U"}
            </button>

            {isMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsMenuOpen(false)}
                />

                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-50">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      {userName ? "Student Profile" : "Signed in as"}
                    </p>
                    <p className="text-sm font-bold text-slate-900 truncate">
                      {userName || user?.email}
                    </p>
                    {userName && (
                      <p className="text-xs text-slate-500 truncate">
                        {user?.email}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm text-red-600 font-semibold hover:bg-red-50 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-4xl mx-auto p-6">
        <FiltersPanel
          filters={filters}
          setFilters={setFilters}
          events={events}
        />

        <div className="text-sm text-gray-600 mb-4">
          Showing <span className="text-gray-900">{sortedEvents.length}</span>{" "}
          of {events.length} events
        </div>

        {sortedEvents.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed text-gray-400">
            No events match your filters
          </div>
        ) : (
          <div className="space-y-4">
            {sortedEvents.map((event) => (
              <EventCard
                key={event.event_id}
                event={event}
                onClick={() =>
                  navigate("event-detail", { eventId: event.event_id })
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsTimelinePage;

