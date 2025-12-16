import React, { useState } from 'react';
import { initializeApp } from 'firebase/App';

import { EVENTS_DATA } from './data/events';
import { useRouter } from './hooks/useRouter';

import LandingPage from './pages/LandingPage';
import EventsTimelinePage from './pages/EventsTimelinePage';
import EventDetailPage from './pages/EventDetailPage';
import AdminDashboard from './pages/AdminDashboard';

// This page is right now a simplified page for the functionality needed to reroute into a Login page.
// It needs to be edited into whatever is needed for Firebase Auth.

const App = () => {
  const { currentPage, params, navigate } = useRouter();
  const [events, setEvents] = useState(EVENTS_DATA);

  const handlePublishEvent = (newEvent) => {
    setEvents(prev => [...prev, newEvent]);
  };

  const selectedEvent = params.eventId
    ? events.find(e => e.event_id === params.eventId)
    : null;

  return (
    <div className="font-sans min-h-screen bg-gray-50">
      {currentPage === 'landing' && (
        <LandingPage navigate={navigate} />
      )}

      {currentPage === 'events' && (
        <EventsTimelinePage
          navigate={navigate}
          events={events}
        />
      )}

      {currentPage === 'event-detail' && (
        <EventDetailPage
          navigate={navigate}
          event={selectedEvent}
        />
      )}

      {currentPage === 'admin' && (
        <AdminDashboard
          navigate={navigate}
          onPublishEvent={handlePublishEvent}
        />
      )}
    </div>
  );
};

export default App;
