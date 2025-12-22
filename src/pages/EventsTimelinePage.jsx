import React, { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useSession } from "../hooks/useSession";
import { useFilters } from "../hooks/useFilters";
import { 
  Plus, 
  ShieldCheck, 
  LogOut, 
  LayoutDashboard, 
  Calendar, 
  Search 
} from "lucide-react";
import FiltersPanel from "../components/FiltersPanel";
import EventCard from "../components/EventCard";

const EventsTimelinePage = ({ navigate, events }) => {
  // -------------------- SESSION & FILTERS --------------------
  const { user, userName, profileExists, loading } = useSession();
  const { filters, setFilters, filteredEvents } = useFilters(events);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // -------------------- ADMIN LOGIC --------------------
  const isAdmin = user?.email === "1@cet.ac.in";

  useEffect(() => {
    if (!loading && user && !profileExists) {
      navigate("onboarding");
    }
  }, [user, profileExists, loading, navigate]);

  // -------------------- HANDLERS --------------------
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

  // -------------------- LOADING STATE --------------------
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white space-y-4">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium animate-pulse">Syncing Timeline...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* HEADER */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <Calendar size={20} />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight leading-none">
                Events Timeline
              </h1>
              {isAdmin && (
                <div className="flex items-center gap-1 mt-1">
                  <span className="bg-amber-100 text-amber-700 text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck size={10} /> Administrator Mode
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            {/* ADMIN QUICK ACTION */}
            {isAdmin && (
              <button
                onClick={() => navigate("admin")}
                className="hidden md:flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95"
              >
                <Plus size={18} />
                New Event
              </button>
            )}

            {/* USER PROFILE DROPDOWN */}
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-900 border-2 border-white shadow-md text-white font-bold hover:ring-2 hover:ring-indigo-500 transition-all"
              >
                {userName ? userName[0].toUpperCase() : user?.email ? user.email[0].toUpperCase() : "U"}
              </button>

              {isMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)} />
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-20 overflow-hidden animate-in fade-in zoom-in duration-150 origin-top-right">
                    <div className="px-5 py-4 border-b border-slate-50 bg-slate-50/50">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                        {isAdmin ? "Admin Profile" : "Student Profile"}
                      </p>
                      <p className="text-sm font-bold text-slate-900 truncate">
                        {userName || "Campus User"}
                      </p>
                      <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    </div>

                    <div className="p-2">
                      {isAdmin && (
                        <button
                          onClick={() => navigate("admin")}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-indigo-600 font-bold hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          <LayoutDashboard size={16} /> Admin Dashboard
                        </button>
                      )}
                      
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 font-bold hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <LogOut size={16} /> Log Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="max-w-5xl mx-auto p-4 sm:p-8">
        
        {/* STATS & SEARCH INFO */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Upcoming</h2>
            <p className="text-slate-500 font-medium">
              Discover workshops, festivals, and campus notices.
            </p>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm inline-flex items-center gap-2">
            <Search size={14} className="text-slate-400" />
            <span className="text-xs font-bold text-slate-600">
              Filtered: <span className="text-indigo-600">{sortedEvents.length}</span> / {events.length}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* FILTERS SIDEBAR (HIDDEN ON MOBILE, SHOWS AS PANEL IN DASHBOARD) */}
          <div className="lg:col-span-3">
            <div className="sticky top-24">
              <FiltersPanel
                filters={filters}
                setFilters={setFilters}
                events={events}
              />
            </div>
          </div>

          {/* EVENTS LIST */}
          <div className="lg:col-span-9">
            {sortedEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200 text-center px-6">
                <div className="bg-slate-50 p-4 rounded-full mb-4">
                   <Calendar size={40} className="text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">No events found</h3>
                <p className="text-slate-500 text-sm max-w-xs mx-auto">
                  Try adjusting your filters or search terms to find what you're looking for.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedEvents.map((event) => (
                  <EventCard
                    key={event.event_id}
                    event={event}
                    onClick={() => navigate("event-detail", { eventId: event.event_id })}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE FLOATING ACTION BUTTON (ONLY FOR ADMIN) */}
      {isAdmin && (
        <button
          onClick={() => navigate("admin")}
          className="fixed bottom-6 right-6 w-16 h-16 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all md:hidden z-40 border-4 border-white"
        >
          <Plus size={32} />
        </button>
      )}
    </div>
  );
};

export default EventsTimelinePage;