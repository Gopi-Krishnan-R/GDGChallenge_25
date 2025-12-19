import { db } from "./firebase/firebase";
console.log("Firestore connected:", db);

import React, { useState } from "react";
import { EVENTS_DATA } from "./data/events";
import { useRouter } from "./hooks/useRouter";

import SignupPage from "./pages/SignupPage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import EventsTimelinePage from "./pages/EventsTimelinePage";
import EventDetailPage from "./pages/EventDetailPage";
import AdminDashboard from "./pages/AdminDashboard";

const App = () => {
  const { currentPage, params, navigate } = useRouter();
  const [events, setEvents] = useState(EVENTS_DATA);

  const handlePublishEvent = (newEvent) => {
    setEvents((prev) => [...prev, newEvent]);
  };

  const selectedEvent = params.eventId
    ? events.find((e) => e.event_id === params.eventId)
    : null;

  return (
    <div className="font-sans min-h-screen bg-gray-50">
      {/* Landing Page */}
      {currentPage === "landing" && <LandingPage navigate={navigate} />}

      {/* Login Page */}
      {currentPage === "login" && <LoginPage navigate={navigate} />}

      {currentPage === "signup" && <SignupPage navigate={navigate} />}

      {/* Events Timeline */}
      {currentPage === "events" && (
        <EventsTimelinePage navigate={navigate} events={events} />
      )}

      {/* Event Detail Page */}
      {currentPage === "event-detail" && (
        <EventDetailPage navigate={navigate} event={selectedEvent} />
      )}

      {/* Admin Dashboard */}
      {currentPage === "admin" && (
        <AdminDashboard
          navigate={navigate}
          onPublishEvent={handlePublishEvent}
        />
      )}
    </div>
  );
};

export default App;
