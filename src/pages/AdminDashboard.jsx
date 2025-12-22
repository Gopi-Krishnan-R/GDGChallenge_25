import React, { useState } from 'react';
import {
  Plus,
  X,
  LayoutDashboard,
  Send,
  Sparkles,
  AlertCircle,
  Loader2,
  ChevronLeft,
  Tag as TagIcon,
} from 'lucide-react';

const AdminDashboard = ({ navigate, onPublishEvent }) => {
  const [eventTitle, setEventTitle] = useState('');
  const [rawText, setRawText] = useState('');
  const [processedEvent, setProcessedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [newTag, setNewTag] = useState('');
  const [error, setError] = useState('');

  const handleReset = () => {
    setEventTitle('');
    setRawText('');
    setProcessedEvent(null);
    setError('');
  };

  const processWithAI = () => {
    if (!eventTitle.trim() || !rawText.trim()) {
      setError('Please enter both event title and event details.');
      return;
    }

    setError('');
    setIsProcessing(true);

    setTimeout(() => {
      const mockEvent = {
        event_id: `evt_${Date.now()}`,
        title_ai: eventTitle,
        description_ai: rawText,
        summary_ai: rawText.split('.').slice(0, 2).join('.') + '.',
        department_tags: ['College Event', 'Notice'],
        event_type: 'general',
        start_time: new Date().toISOString(),
        end_time: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        venue: 'TBD',
        priority: 'normal',
        created_at: new Date().toISOString(),
      };

      setProcessedEvent(mockEvent);
      setIsProcessing(false);
      setShowModal(true);
      setShowFeedback(false);
    }, 800);
  };

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    setProcessedEvent({
      ...processedEvent,
      department_tags: [...processedEvent.department_tags, newTag.trim()],
    });
    setNewTag('');
  };

  const handleRemoveTag = (indexToRemove) => {
    setProcessedEvent({
      ...processedEvent,
      department_tags: processedEvent.department_tags.filter(
        (_, i) => i !== indexToRemove
      ),
    });
  };

  const handleFeedbackSubmit = () => {
    if (!feedbackText.trim()) return;

    setIsProcessing(true);
    setTimeout(() => {
      setProcessedEvent((prev) => ({
        ...prev,
        summary_ai: feedbackText.trim(),
      }));
      setFeedbackText('');
      setShowFeedback(false);
      setIsProcessing(false);
    }, 1000);
  };

  const publishEvent = () => {
    onPublishEvent(processedEvent);
    setShowModal(false);
    handleReset();
    alert('Event published successfully!');
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-100 flex items-center gap-2 font-bold text-xl text-indigo-600">
          <LayoutDashboard size={24} />
          <span>Campus Notifier</span>
        </div>
        <nav className="flex-1 p-4">
          <button
            onClick={handleReset}
            className="w-full flex items-center gap-3 px-3 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-medium hover:bg-indigo-100 transition-colors"
          >
            <Plus size={18} /> Create Event
          </button>
        </nav>
      </aside>

      <main className="flex-1">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('landing')}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
            >
              <ChevronLeft size={24} />
            </button>
            <h2 className="text-lg font-semibold text-slate-800">New Event</h2>
          </div>
          <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">
            ADMIN PANEL
          </span>
        </header>

        <div className="max-w-4xl mx-auto p-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Event Title
              </label>
              <input
                type="text"
                value={eventTitle}
                onChange={(e) => {
                  setEventTitle(e.target.value);
                  setError('');
                }}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Event Details
              </label>
              <textarea
                value={rawText}
                onChange={(e) => {
                  setRawText(e.target.value);
                  setError('');
                }}
                className="w-full h-48 p-4 bg-slate-50 border border-slate-200 rounded-lg resize-none"
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm flex items-center gap-2 bg-red-50 p-3 rounded-lg">
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
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <Sparkles size={20} />
                )}
                Process with AI
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
