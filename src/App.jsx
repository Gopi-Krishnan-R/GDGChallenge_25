import { db } from "./firebase/firebase";
console.log("Firestore connected:", db);

import React, { Suspense, lazy } from "react";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "./hooks/useRouter";
import { useEvents } from "./hooks/useEvents";
import { useSession } from "./hooks/useSession";

// Lazy load pages
const SignupPage = lazy(() => import("./pages/SignupPage"));
const LandingPage = lazy(() => import("./pages/LandingPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const EventsTimelinePage = lazy(() => import("./pages/EventsTimelinePage"));
const EventDetailPage = lazy(() => import("./pages/EventDetailPage"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const OnboardingPage = lazy(() => import("./pages/OnboardingPage"));

const App = () => {
  const { currentPage, params, navigate } = useRouter();
  const { user, role, loading: sessionLoading } = useSession();
  const { events, loading: eventsLoading } = useEvents();

  const handlePublishEvent = async (event) => {
    try {
      const eventRef = doc(collection(db, "events"), event.event_id);

      await setDoc(eventRef, {
        title: event.title_ai,
        summary: event.summary_ai,
        description: event.description_ai,
        tags: event.department_tags ?? [],
        event_type: event.event_type ?? "general",
        start_time: event.start_time,
        end_time: event.end_time,
        venue: event.venue ?? "TBD",
        priority: event.priority ?? "normal",
        targetingRules: [],
        explicitRecipients: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("Failed to publish event:", err);
      alert("Failed to publish event.");
    }
  };

  const selectedEvent = params.eventId
    ? events.find((e) => e.event_id === params.eventId)
    : null;

  if (!sessionLoading && currentPage === "admin" && !user) {
    navigate("login");
    return null;
  }

  if (!sessionLoading && user && role === "admin" && currentPage === "events") {
    navigate("admin");
    return null;
  }

  const page = (
    <>
      {currentPage === "landing" && <LandingPage navigate={navigate} />}
      {currentPage === "login" && <LoginPage navigate={navigate} />}
      {currentPage === "signup" && <SignupPage navigate={navigate} />}
      {currentPage === "onboarding" && <OnboardingPage navigate={navigate} />}

      {currentPage === "events" && (
        <EventsTimelinePage
          navigate={navigate}
          events={events}
          loading={eventsLoading}
        />
      )}

      {currentPage === "event-detail" && (
        <EventDetailPage navigate={navigate} event={selectedEvent} />
      )}
    </>
  );

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading...</p>
          </div>
        </div>
      }
    >
      {/* 🔥 Admin owns its own layout */}
      {currentPage === "admin" ? (
        <AdminDashboard
          navigate={navigate}
          onPublishEvent={handlePublishEvent}
        />
      ) : (
        /* 🌍 All other pages keep the global shell */
        <div className="font-sans min-h-screen bg-gray-50">
          {page}
        </div>
      )}
    </Suspense>
  );
};

export default App;

