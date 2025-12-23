import React, { useState } from "react";
import {
  Plus,
  X,
  LayoutDashboard,
  Send,
  Sparkles,
  AlertCircle,
  Loader2,
  ChevronLeft,
  LogOut,
} from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useSession } from "../hooks/useSession";
import { useEvents } from "../hooks/useEvents";
import { processEventWithAI } from "../services/gemini";

const inputGlass =
  "w-full rounded-xl bg-white/70 backdrop-blur px-4 py-3 text-slate-900 placeholder-slate-400 shadow-inner shadow-black/5 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 transition";

const AdminDashboard = ({ navigate, onPublishEvent }) => {
  const { user, userName, role, loading } = useSession();
  const { events, loading: eventsLoading } = useEvents();
  const isAdmin = role === "admin";

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const [eventTitle, setEventTitle] = useState("");
  const [rawText, setRawText] = useState("");
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const [processedEvent, setProcessedEvent] = useState(null);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        Loading session…
      </div>
    );
  }

  const resetCreateForm = () => {
    setEventTitle("");
    setRawText("");
    setError("");
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("landing");
  };

  /* ---------- GEMINI AI PIPELINE ---------- */

  const processWithAI = async () => {
    if (!eventTitle.trim() || !rawText.trim()) {
      setError("Please enter both event title and details.");
      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      const aiResult = await processEventWithAI({
        title: eventTitle,
        rawText,
      });

      const newEvent = {
        event_id: `evt_${Date.now()}`,
        title_ai: aiResult.title_ai,
        summary_ai: aiResult.summary_ai,
        description_ai: aiResult.description_ai,
        department_tags: aiResult.department_tags ?? [],
        event_type: aiResult.event_type,
        priority: aiResult.priority,
        venue: aiResult.venue,
        start_time: aiResult.start_time,
        end_time: aiResult.end_time,
      };

      setProcessedEvent(newEvent);
      setShowCreateModal(false);
      setShowPreviewModal(true); // ✅ FIXED
    } catch (err) {
      setError(`Failed to process event: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const saveEvent = () => {
    if (!processedEvent) return;

    onPublishEvent({
      title: processedEvent.title_ai,
      summary: processedEvent.summary_ai,
      description: processedEvent.description_ai,
      tags: processedEvent.department_tags,
      venue: processedEvent.venue,
      start_time: processedEvent.start_time,
      end_time: processedEvent.end_time,
    });

    setShowPreviewModal(false);
    setProcessedEvent(null);
    resetCreateForm();
  };

  const openExistingEvent = (event) => {
    setProcessedEvent({
      event_id: event.event_id,
      title_ai: event.title,
      summary_ai: event.summary,
      description_ai: event.description,
      department_tags: event.tags || [],
      venue: event.venue || "",
      start_time: event.start_time || "",
      end_time: event.end_time || "",
    });
    setShowPreviewModal(true);
  };

  /* ---------- UI ---------- */

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100 flex">
      <aside className="w-64 hidden md:flex flex-col bg-white/70 backdrop-blur-xl border-r border-white/40 shadow-lg">
        <div className="p-6 text-xl font-bold text-indigo-600 flex gap-2">
          <LayoutDashboard size={24} /> Campus Notifier
        </div>
        <div className="p-4">
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full flex items-center gap-3 px-4 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
          >
            <Plus size={18} /> Create Event
          </button>
        </div>
      </aside>

      <main className="flex-1">
        <header className="h-16 sticky top-0 z-10 px-8 flex items-center justify-between bg-white/70 backdrop-blur-xl border-b border-white/40 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("landing")}
              className="p-2 rounded-full hover:bg-slate-100 transition"
            >
              <ChevronLeft size={22} />
            </button>
            <h1 className="text-lg font-semibold">Admin Dashboard</h1>
          </div>

          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold shadow-md hover:ring-2 hover:ring-indigo-400 transition"
            >
              {(userName || user?.email || "U")[0].toUpperCase()}
            </button>

            {isMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsMenuOpen(false)}
                />
                <div className="absolute right-0 mt-3 w-64 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/40 z-20 overflow-hidden">
                  <div className="px-5 py-4 border-b border-white/30 bg-white/60">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                      {isAdmin ? "Admin Profile" : "Student Profile"}
                    </p>
                    <p className="text-sm font-semibold truncate">
                      {userName || "Campus User"}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {user?.email}
                    </p>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 font-semibold hover:bg-red-50 rounded-lg transition"
                    >
                      <LogOut size={16} /> Log Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </header>

        <div className="max-w-5xl mx-auto p-8">
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 space-y-3">
            {eventsLoading ? (
              <p className="text-sm text-slate-400">Loading events…</p>
            ) : (
              events.map((event) => (
                <button
                  key={event.event_id}
                  onClick={() => openExistingEvent(event)}
                  className="w-full text-left p-4 rounded-xl bg-slate-50/80 hover:bg-slate-100 transition"
                >
                  <p className="font-semibold">{event.title}</p>
                  <p className="text-sm text-slate-500">{event.summary}</p>
                </button>
              ))
            )}
          </div>
        </div>
      </main>

      {/* CREATE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-white/40 backdrop-blur-md"
            onClick={() => setShowCreateModal(false)}
          />
          <div className="relative w-full max-w-xl bg-white/85 backdrop-blur-xl rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Create Event</h2>
              <button onClick={() => setShowCreateModal(false)}>
                <X />
              </button>
            </div>

            <input
              className={inputGlass}
              placeholder="Event title"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
            />

            <textarea
              className={`${inputGlass} h-40 resize-none`}
              placeholder="Event details"
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
            />

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl flex gap-2 text-sm">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={processWithAI}
                disabled={isProcessing}
                className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 disabled:opacity-60"
              >
                {isProcessing ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Sparkles />
                )}
                Generate Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PREVIEW MODAL */}
      {showPreviewModal && processedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-white/40 backdrop-blur-md"
            onClick={() => setShowPreviewModal(false)}
          />
          <div className="relative w-full max-w-2xl bg-white/85 backdrop-blur-xl rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Event Preview</h3>
              <button onClick={() => setShowPreviewModal(false)}>
                <X />
              </button>
            </div>

            <input className={inputGlass} value={processedEvent.title_ai} readOnly />

            <textarea
              className={`${inputGlass} h-32`}
              value={processedEvent.description_ai}
              readOnly
            />

            <div className="flex justify-end">
              <button
                onClick={saveEvent}
                className="bg-indigo-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-semibold"
              >
                <Send size={16} /> Save Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
