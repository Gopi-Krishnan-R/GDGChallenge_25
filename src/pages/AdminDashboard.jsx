import React, { useState } from 'react';
import { Plus, X, LayoutDashboard, Send, Sparkles, AlertCircle, Loader2, ChevronLeft, Tag as TagIcon } from 'lucide-react';

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

  // Function to clear all content for a fresh page
  const handleReset = () => {
    setEventTitle('');
    setRawText('');
    setProcessedEvent(null);
    setError('');
  };

  const processWithAI = () => {
    if (!eventTitle.trim() || !rawText.trim()) {
      setError('Please enter both event title and details.');
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
      department_tags: [...processedEvent.department_tags, newTag.trim()]
    });
    setNewTag('');
  };

  const handleRemoveTag = (indexToRemove) => {
    setProcessedEvent({
      ...processedEvent,
      department_tags: processedEvent.department_tags.filter((_, i) => i !== indexToRemove)
    });
  };

  const handleFeedbackSubmit = () => {
    if (!feedbackText.trim()) return;
    setIsProcessing(true);
    setTimeout(() => {
      setProcessedEvent(prev => ({
        ...prev,
        summary_ai: `[Refined]: ${prev.summary_ai} (Adjusted based on feedback: ${feedbackText})`,
      }));
      setFeedbackText('');
      setShowFeedback(false);
      setIsProcessing(false);
    }, 1000);
  };

  const publishEvent = () => {
    onPublishEvent?.(processedEvent);
    setShowModal(false);
    handleReset();
    alert('Event published successfully!');
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-100 flex items-center gap-2 font-bold text-xl text-indigo-600">
          <LayoutDashboard size={24} /> <span>Campus Notifier</span>
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

      {/* MAIN CONTENT */}
      <main className="flex-1">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('landing')}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
              title="Back"
            >
              <ChevronLeft size={24} />
            </button>
            <h2 className="text-lg font-semibold text-slate-800">New Event</h2>
          </div>
          <div className="flex items-center gap-3">
             <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">ADMIN PANEL</span>
          </div>
        </header>

        <div className="max-w-4xl mx-auto p-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Event Title</label>
              <input
                type="text"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                placeholder="Enter event title..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Event Details</label>
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                className="w-full h-48 p-4 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
                placeholder="Paste the full description or raw notes here..."
              />
            </div>

            {error && <div className="text-red-600 text-sm flex items-center gap-2 bg-red-50 p-3 rounded-lg"><AlertCircle size={16}/>{error}</div>}

            <div className="flex justify-end pt-2">
              <button
                onClick={processWithAI}
                disabled={isProcessing}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-100 transition-all active:scale-95 disabled:opacity-50"
              >
                {isProcessing ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                Process with AI
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL WINDOW */}
      {showModal && processedEvent && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Sparkles className="text-indigo-600" size={20} />
                {showFeedback ? 'Refine AI Output' : 'Preview Generated Event'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={20} /></button>
            </div>

            <div className="p-6">
              {isProcessing ? (
                <div className="h-64 flex flex-col items-center justify-center text-slate-500 gap-4">
                  <Loader2 className="animate-spin text-indigo-600" size={40} />
                  <p className="font-semibold animate-pulse">Processing adjustments...</p>
                </div>
              ) : showFeedback ? (
                <div className="space-y-4 animate-in slide-in-from-bottom-2">
                  <label className="text-sm font-bold text-slate-700">Submit Adjustment</label>
                  <textarea
                    autoFocus
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Describe in detail about the event (or) What should be improved in this prompt?"
                    className="w-full h-44 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none shadow-inner bg-slate-50"
                  />
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Event Title</span>
                    <p className="text-xl font-bold text-slate-800">{processedEvent.title_ai}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AI Summary</span>
                    <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 mt-1">
                      <p className="text-slate-700 leading-relaxed italic">"{processedEvent.summary_ai}"</p>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Category Tags</span>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {processedEvent.department_tags.map((tag, i) => (
                        <span key={i} className="bg-white border border-slate-200 text-indigo-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm">
                          {tag}
                          <button onClick={() => handleRemoveTag(i)} className="text-slate-400 hover:text-red-500 transition-colors">
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <TagIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                          placeholder="Add custom tag..."
                          className="w-full text-xs border border-slate-200 pl-9 pr-3 py-2 rounded-lg outline-none focus:border-indigo-500"
                        />
                      </div>
                      <button onClick={handleAddTag} className="text-xs font-bold bg-slate-100 px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors">
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100">
              {showFeedback ? (
                <div className="flex justify-end gap-3">
                  <button onClick={() => setShowFeedback(false)} className="px-5 py-2 text-slate-600 font-semibold">Back</button>
                  <button 
                    onClick={handleFeedbackSubmit}
                    disabled={!feedbackText.trim() || isProcessing}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-all disabled:opacity-50"
                  >
                    Update Preview
                  </button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-sm font-semibold text-slate-700">Is this the desired output?</p>
                  <div className="flex gap-3 w-full sm:w-auto">
                    <button 
                      onClick={() => setShowFeedback(true)}
                      className="flex-1 sm:flex-none px-6 py-2 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      No
                    </button>
                    <button 
                      onClick={publishEvent}
                      className="flex-1 sm:flex-none px-8 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 transition-all"
                    >
                      <Send size={18} />
                      Publish
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;