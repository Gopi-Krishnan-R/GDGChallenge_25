import React, { useState } from 'react';
import { Plus } from 'lucide-react';

const AdminDashboard = ({ navigate, onPublishEvent }) => {
  const [rawText, setRawText] = useState('');
  const [processedEvent, setProcessedEvent] = useState(null);

  const processWithAI = () => {
    if (!rawText.trim()) return;

    const sentences = rawText.split('.').filter(s => s.trim());
    const summary = sentences[0] + '.';

    const mockEvent = {
      event_id: `evt_${Date.now()}`,
      title_raw: sentences[0].slice(0, 60) + '...',
      description_raw: rawText,
      summary_ai: summary,
      department_tags: ['Computer Science'],
      event_type: 'Workshop',
      start_time: new Date(Date.now() + 86400000).toISOString(),
      end_time: new Date(Date.now() + 90000000).toISOString(),
      venue: 'TBD',
      priority: 'normal',
      created_at: new Date().toISOString()
    };

    setProcessedEvent(mockEvent);
  };

  const publish = () => {
    onPublishEvent(processedEvent);
    setRawText('');
    setProcessedEvent(null);
    alert('Event published');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex justify-between">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <button
            onClick={() => navigate('landing')}
            className="text-sm text-gray-600"
          >
            ← Back to Home
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white border p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Create New Event</h2>

          <textarea
            value={rawText}
            onChange={e => setRawText(e.target.value)}
            placeholder="Paste raw event text here..."
            className="w-full h-48 p-3 border rounded font-mono text-sm"
          />

          <button
            onClick={processWithAI}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded flex items-center gap-2"
          >
            <Plus size={18} />
            Process with AI
          </button>
        </div>

        {processedEvent && (
          <div className="bg-white border p-6">
            <h2 className="text-lg font-semibold mb-4">Review & Publish</h2>

            <input
              value={processedEvent.title_raw}
              onChange={e =>
                setProcessedEvent({ ...processedEvent, title_raw: e.target.value })
              }
              className="w-full p-2 border rounded mb-3"
            />

            <textarea
              value={processedEvent.summary_ai}
              onChange={e =>
                setProcessedEvent({ ...processedEvent, summary_ai: e.target.value })
              }
              className="w-full h-20 p-2 border rounded mb-3"
            />

            <button
              onClick={publish}
              className="w-full bg-green-600 text-white py-3 rounded"
            >
              Publish Event
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
