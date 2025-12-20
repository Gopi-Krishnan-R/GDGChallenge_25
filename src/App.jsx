import { db } from "./firebase/firebase";
console.log("Firestore connected:", db);

import React, { useState, Suspense, lazy } from "react";
import { EVENTS_DATA } from "./data/events";
import { useRouter } from "./hooks/useRouter";

// Lazy load pages for code splitting
const SignupPage = lazy(() => import("./pages/SignupPage"));
const LandingPage = lazy(() => import("./pages/LandingPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const EventsTimelinePage = lazy(() => import("./pages/EventsTimelinePage"));
const EventDetailPage = lazy(() => import("./pages/EventDetailPage"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const OnboardingPage = lazy(() => import("./pages/OnboardingPage"));

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
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading...</p>
          </div>
        </div>
      }>
        {/* Landing Page */}
        {currentPage === "landing" && <LandingPage navigate={navigate} />}

        {/* Login Page */}
        {currentPage === "login" && <LoginPage navigate={navigate} />}

        {currentPage === "signup" && <SignupPage navigate={navigate} />}

        {currentPage === "onboarding" && (
          <OnboardingPage navigate={navigate} />
        )}

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
      </Suspense>
    </div>
  );
};

export default App;
