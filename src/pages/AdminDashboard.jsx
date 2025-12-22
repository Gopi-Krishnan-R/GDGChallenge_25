import React, { useState } from "react";
import {
  Plus,
  X,
  LayoutDashboard,
  Send,
  Sparkles,
  AlertCircle,
  Loader2,
  ChevronLeft
} from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useSession } from "../hooks/useSession";

const AdminDashboard = ({ navigate, onPublishEvent }) => {
  // -------------------- SESSION --------------------
  const { user, userName, loading } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // -------------------- STATE --------------------
  const [eventTitle, setEventTitle] = useState("");
  const [rawText, setRawText] = useState("");
  const [processedEvent, setProcessedEvent] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [feedbackText, setFeedbackText] = useState("");
  const [newTag, setNewTag] = useState("");
  const [error, setError] = useState("");

  // -------------------- LOADING --------------------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading session...
      </div>
    );
  }

  // -------------------- HELPERS --------------------
  const resetForm = () => {
    setEventTitle("");
    setRawText("");
    setProcessedEvent(null);
    setError("");
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("landing");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // -------------------- AI MOCK --------------------
  const processWithAI = () => {
    if (!eventTitle.trim() || !rawText.trim()) {
      setError("Please enter both event title and event details.");
      return;
    }

    setError("");
    setIsProcessing(true);

    setTimeout(() => {
      setProcessedEvent({
        event_id: `evt_${Date.now()}`,
        title_ai: eventTitle,
        description_ai: rawText,
        summary_ai: rawText.split(".").slice(0, 2).join(".") + ".",
        department_tags: ["College Event", "Notice"],
        event_type: "general",
        venue: "TBD",
        start_time: new Date().toISOString(),
        end_time: new Date(Date.now() + 3600000).toISOString()
      });

      setIsProcessing(false);
      setShowModal(true);
      setShowFeedback(false);
    }, 800);
  };

  const publishEvent = () => {
    onPublishEvent(processedEvent);
    setShowModal(false);
    resetForm();
    alert("Event published successfully!");
  };

  // -------------------- TAG HANDLERS --------------------
  const addTag = () => {
    if (!newTag.trim()) return;
    setProcessedEvent(prev => ({
      ...prev,
      department_tags: [...prev.department_tags, newTag.trim()]
    }));
    setNewTag("");
  };

  const removeTag = index => {
    setProcessedEvent(prev => ({
      ...prev,
      department_tags: prev.department_tags.filter((_, i) => i !== index)
    }));
  };

  const submitFeedback = () => {
    if (!feedbackText.trim()) return;

    setIsProcessing(true);
    setTimeout(() => {
      setProcessedEvent(prev => ({
        ...prev,
        summary_ai: feedbackText.trim()
      }));
      setFeedbackText("");
      setShowFeedback(false);
      setIsProcessing(false);
    }, 1000);
  };

  // -------------------- UI --------------------
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r hidden md:flex flex-col">
        <div className="p-6 border-b flex items-center gap-2 text-xl font-bold text-indigo-600">
          <LayoutDashboard size={24} />
          Campus Notifier
        </div>
        <nav className="p-4">
          <button
            onClick={resetForm}
            className="w-full flex items-center gap-3 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-semibold hover:bg-indigo-100"
          >
            <Plus size={18} /> Create Event
          </button>
        </nav>
      </aside>

      {/* MAIN */}
      <main className="flex-1">
        {/* HEADER */}
        <header className="h-16 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("landing")}
              className="p-2 rounded-full hover:bg-slate-100"
            >
              <ChevronLeft size={22} />
            </button>
            <h1 className="text-lg font-semibold">Admin Dashboard</h1>
          </div>

          {/* PROFILE MENU */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(p => !p)}
              className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold"
            >
              {userName
                ? userName[0].toUpperCase()
                : user?.email
                ? user.email[0].toUpperCase()
                : "A"}
            </button>

            {isMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border z-20 overflow-hidden">
                  <div className="px-4 py-3 border-b">
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                      ADMIN PROFILE
                    </p>
                    <p className="font-bold truncate">
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
                    className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 font-semibold"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </header>

        {/* FORM */}
        <div className="max-w-4xl mx-auto p-8">
          <div className="bg-white border rounded-xl p-6 space-y-6">
            <div>
              <label className="text-sm font-semibold">Event Title</label>
              <input
                value={eventTitle}
                onChange={e => {
                  setEventTitle(e.target.value);
                  setError("");
                }}
                className="w-full mt-1 px-4 py-2 border rounded-lg"
                placeholder="Enter event title"
              />
            </div>

            <div>
              <label className="text-sm font-semibold">Event Details</label>
              <textarea
                value={rawText}
                onChange={e => {
                  setRawText(e.target.value);
                  setError("");
                }}
                className="w-full mt-1 h-40 px-4 py-3 border rounded-lg resize-none"
                placeholder="Paste full event description"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 text-red-600 p-3 rounded">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={processWithAI}
                disabled={isProcessing}
                className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2"
              >
                {isProcessing ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Sparkles size={18} />
                )}
                Process with AI
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL */}
      {showModal && processedEvent && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="font-bold text-lg">
                {showFeedback ? "Refine Output" : "Preview Event"}
              </h3>
              <button onClick={() => setShowModal(false)}>
                <X />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {showFeedback ? (
                <textarea
                  value={feedbackText}
                  onChange={e => setFeedbackText(e.target.value)}
                  className="w-full h-40 border rounded-lg p-3"
                  placeholder="Describe what should be improved"
                />
              ) : (
                <>
                  <h2 className="text-xl font-bold">
                    {processedEvent.title_ai}
                  </h2>

                  <p className="italic bg-indigo-50 p-3 rounded">
                    {processedEvent.summary_ai}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {processedEvent.department_tags.map((tag, i) => (
                      <span
                        key={i}
                        className="bg-indigo-100 px-3 py-1 rounded-full flex items-center gap-2 text-sm"
                      >
                        {tag}
                        <button onClick={() => removeTag(i)}>
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2 mt-3">
                    <input
                      value={newTag}
                      onChange={e => setNewTag(e.target.value)}
                      className="flex-1 border px-3 py-2 rounded-lg"
                      placeholder="Add tag"
                    />
                    <button
                      onClick={addTag}
                      className="bg-slate-200 px-4 rounded-lg"
                    >
                      Add
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="p-6 bg-slate-50 border-t flex justify-between">
              {showFeedback ? (
                <>
                  <button onClick={() => setShowFeedback(false)}>
                    Back
                  </button>
                  <button
                    onClick={submitFeedback}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg"
                  >
                    Update Preview
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setShowFeedback(true)}
                    className="border px-6 py-2 rounded-lg"
                  >
                    No
                  </button>
                  <button
                    onClick={publishEvent}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg flex items-center gap-2"
                  >
                    <Send size={16} /> Publish
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
