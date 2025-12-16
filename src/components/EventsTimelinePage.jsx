import React from 'react';
import { useFilters } from '../hooks/useFilters';
import FiltersPanel from '../components/FiltersPanel';
import EventCard from '../components/EventCard';

const EventsTimelinePage = ({ navigate, events }) => {
  const { filters, setFilters, filteredEvents } = useFilters(events);

  const sortedEvents = [...filteredEvents].sort(
    (a, b) => new Date(a.start_time) - new Date(b.start_time)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            Events Timeline
          </h1>

          <button
            onClick={() => navigate('landing')}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ← Back to Home
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6">
        <FiltersPanel
          filters={filters}
          setFilters={setFilters}
          events={events}
        />

        <div className="text-sm text-gray-600 mb-4">
          Showing {sortedEvents.length} of {events.length} events
        </div>

        {sortedEvents.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No events match your filters
          </div>
        ) : (
          sortedEvents.map(event => (
            <EventCard
              key={event.event_id}
              event={event}
              onClick={() =>
                navigate('event-detail', { eventId: event.event_id })
              }
            />
          ))
        )}
      </div>
    </div>
  );
};

export default EventsTimelinePage;
