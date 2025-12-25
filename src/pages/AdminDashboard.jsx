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
  Menu // Added for mobile menu
} from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useSession } from "../hooks/useSession";
import { useEvents } from "../hooks/useEvents";

const inputGlass =
  "w-full rounded-xl bg-white/70 backdrop-blur px-4 py-3 text-slate-900 placeholder-slate-400 shadow-inner shadow-black/5 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 transition";

const AdminDashboard = ({ navigate, onPublishEvent }) => {
  const { user, userName, role, loading } = useSession();
  const { events, loading: eventsLoading } = useEvents();
  const isAdmin = role === "admin";

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const [eventTitle, setEventTitle] = useState("");
  const [rawText, setRawText] = useState("");
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const [processedEvent, setProcessedEvent] = useState(null);
  const [newTag, setNewTag] = useState("");

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

  const processWithAI = () => {
    if (!eventTitle.trim() || !rawText.trim()) {
      setError("Please enter both event title and details.");
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const newEvent = {
        event_id: `evt_${Date.now()}`,
        title_ai: eventTitle,
        description_ai: rawText,
        summary_ai: rawText.split(".").slice(0, 2).join(".") + ".",
        department_tags: ["College Event"],
        venue: "",
        start_time: "",
        end_time: ""
      };

      setProcessedEvent(newEvent);
      setIsProcessing(false);
      setShowCreateModal(false);
      setShowPreviewModal(true);
    }, 600);
  };


  const saveEvent = () => {
    if (!processedEvent) return;
    onPublishEvent({
      title: processedEvent.title_ai,
      summary: processedEvent.summary_ai || processedEvent.description_ai.split(".").slice(0, 2).join(".") + ".",
      description: processedEvent.description_ai,
      tags: processedEvent.department_tags || [],
      venue: processedEvent.venue,
      start_time: processedEvent.start_time,
      end_time: processedEvent.end_time
    });
    setShowPreviewModal(false);
    setProcessedEvent(null);
    resetCreateForm();
  };

  const openExistingEvent = event => {
    setProcessedEvent({
      event_id: event.event_id,
      title_ai: event.title,
      summary_ai: event.summary,
      description_ai: event.description,
      department_tags: event.tags || [],
      venue: event.venue || "",
      start_time: event.start_time || "",
      end_time: event.end_time || ""
    });
    setShowPreviewModal(true);
  };

  const removeTag = i => {
    setProcessedEvent(p => ({
      ...p,
      department_tags: p.department_tags.filter((_, idx) => idx !== i)
    }));
  };

  const addTag = () => {
    if (!newTag.trim() || !processedEvent) return;
    setProcessedEvent(p => ({
      ...p,
      department_tags: [...(p.department_tags || []), newTag.trim()]
    }));
    setNewTag("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100 flex flex-col md:flex-row">
      
      {/* MOBILE SIDEBAR OVERLAY */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white/90 backdrop-blur-2xl border-r border-white/40 shadow-xl transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:relative md:translate-x-0 md:flex md:flex-col
      `}>
        <div className="p-6 text-xl font-bold text-indigo-600 flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <LayoutDashboard size={24} /> <span>Campus Notifier</span>
          </div>
          <button className="md:hidden text-slate-400" onClick={() => setIsSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>
        <div className="p-4">
          <button
            onClick={() => { setShowCreateModal(true); setIsSidebarOpen(false); }}
            className="w-full flex items-center justify-center md:justify-start gap-3 px-4 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition"
          >
            <Plus size={18} /> Create Event
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 w-full overflow-x-hidden">
        <header className="h-16 sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between bg-white/70 backdrop-blur-xl border-b border-white/40 shadow-sm">
          <div className="flex items-center gap-2 md:gap-4">
            <button className="md:hidden p-2 text-slate-600" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <button
              onClick={() => navigate("landing")}
              className="p-2 rounded-full hover:bg-slate-100 transition"
            >
              <ChevronLeft size={22} />
            </button>
            <h1 className="text-base md:text-lg font-semibold truncate">Admin Dashboard</h1>
          </div>

          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-indigo-600 text-white font-bold shadow-md hover:ring-2 hover:ring-indigo-400 transition text-sm md:text-base"
            >
              {(userName || user?.email || "U")[0].toUpperCase()}
            </button>
            {isMenuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)} />
                <div className="absolute right-0 mt-3 w-56 md:w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/40 z-20 overflow-hidden origin-top-right transition-all">
                  <div className="px-5 py-4 border-b border-white/30 bg-white/60">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                      {isAdmin ? "Admin Profile" : "Student Profile"}
                    </p>
                    <p className="text-sm font-semibold truncate">{userName || "Campus User"}</p>
                    <p className="text-xs text-slate-500 truncate">{user?.email}</p>
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

        {/* FEED / EVENT LIST */}
        <div className="max-w-5xl mx-auto p-4 md:p-8">
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl p-4 md:p-6 space-y-3 border border-white/40">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest px-2 mb-4">Manage Events</h2>
            {eventsLoading ? (
              <div className="flex justify-center py-10"><Loader2 className="animate-spin text-indigo-400" /></div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {events.map(event => (
                  <button
                    key={event.event_id}
                    onClick={() => openExistingEvent(event)}
                    className="w-full text-left p-4 rounded-2xl bg-white/50 hover:bg-white transition border border-transparent hover:border-indigo-100 hover:shadow-md group"
                  >
                    <p className="font-semibold text-slate-800 group-hover:text-indigo-600 transition">{event.title}</p>
                    <p className="text-xs md:text-sm text-slate-500 line-clamp-2 mt-1">{event.summary}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* MODALS - SHARED WRAPPER FOR RESPONSIVENESS */}
      {(showCreateModal || (showPreviewModal && processedEvent)) && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
          <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={() => { setShowCreateModal(false); setShowPreviewModal(false); }} />
          
          <div className="relative w-full max-w-2xl bg-white rounded-t-3xl md:rounded-3xl shadow-2xl p-6 md:p-8 space-y-6 max-h-[95vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center sticky top-0 bg-white pb-2 z-10">
              <h2 className="text-xl font-bold text-slate-800">
                {showCreateModal ? "Create New Event" : "Event Preview & Edit"}
              </h2>
              <button className="p-2 bg-slate-100 rounded-full text-slate-500" onClick={() => { setShowCreateModal(false); setShowPreviewModal(false); }}>
                <X size={20} />
              </button>
            </div>

            {/* CREATE MODAL CONTENT */}
            {showCreateModal && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 ml-1 uppercase">Title</label>
                  <input className={inputGlass} placeholder="Annual Tech Symposium..." value={eventTitle} onChange={e => setEventTitle(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 ml-1 uppercase">Event Details</label>
                  <textarea className={`${inputGlass} h-40 md:h-56 resize-none`} placeholder="Paste raw event details here..." value={rawText} onChange={e => setRawText(e.target.value)} />
                </div>
                {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl flex gap-2 text-sm border border-red-100"><AlertCircle size={18} /> {error}</div>}
                <button onClick={processWithAI} disabled={isProcessing} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-indigo-200 disabled:opacity-60 transition-all active:scale-[0.98]">
                  {isProcessing ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
                  Generate AI Preview
                </button>
              </div>
            )}

            {/* PREVIEW MODAL CONTENT */}
            {showPreviewModal && processedEvent && (
              <div className="space-y-5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 ml-1 uppercase">Title</label>
                  <input className={inputGlass} value={processedEvent.title_ai} onChange={e => setProcessedEvent(p => ({ ...p, title_ai: e.target.value }))} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 ml-1 uppercase">Description</label>
                  <textarea className={`${inputGlass} h-32`} value={processedEvent.description_ai} onChange={e => setProcessedEvent(p => ({ ...p, description_ai: e.target.value }))} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 ml-1 uppercase">Venue</label>
                  <input className={inputGlass} placeholder="Main Auditorium / Zoom Link" value={processedEvent.venue} onChange={e => setProcessedEvent(p => ({ ...p, venue: e.target.value }))} />
                </div>
                
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-400 ml-1 uppercase">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {processedEvent.department_tags.map((tag, i) => (
                      <span key={i} className="bg-indigo-50 text-indigo-600 border border-indigo-100 px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs font-bold transition-all hover:bg-indigo-100">
                        {tag} <X size={14} className="cursor-pointer" onClick={() => removeTag(i)} />
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input className={`${inputGlass} !py-2 !text-sm`} value={newTag} onChange={e => setNewTag(e.target.value)} placeholder="New tag..." onKeyDown={(e) => e.key === 'Enter' && addTag()} />
                    <button onClick={addTag} className="bg-slate-800 text-white px-5 rounded-xl text-sm font-bold">Add</button>
                  </div>
                </div>

                <button onClick={saveEvent} className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-emerald-100 transition-all active:scale-[0.98]">
                  <Send size={18} /> Confirm & Publish Event
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;