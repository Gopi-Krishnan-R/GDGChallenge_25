import React from 'react';
import { AlertCircle } from 'lucide-react';

const EventDetailPage = ({ navigate, event }) => {
  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Event not found</p>
          <button
            onClick={() => navigate('events')}
            className="text-blue-600 hover:text-blue-800"
          >
            ← Back to Events
          </button>
        </div>
      </div>
    );
  }

  const formatDateTime = isoString => {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => navigate('events')}
            className="text-sm text-gray-600 hover:text-gray-900 mb-2"
          >
            ← Back to Events
          </button>

          <h1 className="text-2xl font-bold text-gray-900">
            {event.title_raw}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white border border-gray-200 p-6">
          {event.priority !== 'normal' && (
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200">
              <AlertCircle size={20} className="text-orange-600" />
              <span className="font-medium text-orange-600 uppercase text-sm">
                {event.priority} Priority
              </span>
            </div>
          )}

          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Description</h2>
            <p className="text-gray-700 leading-relaxed">
              {event.description_raw}
            </p>
          </section>

          <section className="mb-6 bg-gray-50 p-4 rounded">
            <h2 className="text-lg font-semibold mb-3">Event Details</h2>
            <div className="space-y-2 text-sm">
              <div className="flex">
                <span className="font-medium w-32">Event Type:</span>
                <span>{event.event_type}</span>
              </div>

              <div className="flex">
                <span className="font-medium w-32">Start:</span>
                <span>{formatDateTime(event.start_time)}</span>
              </div>

              <div className="flex">
                <span className="font-medium w-32">End:</span>
                <span>{formatDateTime(event.end_time)}</span>
              </div>

              <div className="flex">
                <span className="font-medium w-32">Venue:</span>
                <span>{event.venue}</span>
              </div>

              <div className="flex">
                <span className="font-medium w-32">Departments:</span>
                <span>{event.department_tags.join(', ')}</span>
              </div>
            </div>
          </section>

          <section className="bg-blue-50 p-4 rounded border border-blue-200">
            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <AlertCircle size={18} />
              Who should care?
            </h2>

            <p className="text-sm text-gray-700">
              {event.department_tags.includes('All Departments')
                ? 'This event is relevant to all students across all departments.'
                : `Relevant to students in: ${event.department_tags.join(', ')}.`}

              {event.priority === 'critical' &&
                ' This requires immediate attention.'}

              {event.priority === 'important' &&
                ' This should not be missed.'}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
