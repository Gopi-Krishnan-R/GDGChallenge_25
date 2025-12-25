import React, { useState, Suspense, lazy } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase/firebase";
console.log("Firestore connected:", db);
import { EVENTS_DATA } from "./data/events";
import { useRouter } from "./hooks/useRouter";
import { useSession } from "./hooks/useSession";
import { useEvents } from "./hooks/useEvents";


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
  const { events } = useEvents();
  const handlePublishEvent = async (event) => {
    try {
      await addDoc(collection(db, "events"), {
        title_raw: event.title,
        summary_ai: event.summary,
        description_raw: event.description,
        department_tags: event.tags ?? [],
        event_type: event.event_type ?? "general",
        priority: event.priority ?? "normal",

        target_departments: event.target_departments ?? [],

        venue: event.venue ?? "",
        start_time: event.start_time ?? "",
        end_time: event.end_time ?? "",

        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("Failed to publish event:", err);
      alert("Failed to publish event. Check console.");
    }
  };

  // 🔒 Guards (unchanged)
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
        <EventsTimelinePage navigate={navigate} />
      )}

      {currentPage === "event-detail" && (
        <EventDetailPage
          navigate={navigate}
          params={params}
          events={events}
        />
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
      {currentPage === "admin" ? (
        <AdminDashboard
          navigate={navigate}
          onPublishEvent={handlePublishEvent}
        />
      ) : (
        <div className="font-sans min-h-screen bg-gray-50">
          {page}
        </div>
      )}
    </Suspense>
  );
};

export default App;

