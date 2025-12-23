import React, { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { normalizeEvent } from "../utils/normalizeEvent";

/* ---------- TAG COLOR PALETTE (PASTEL, CYCLING, DARK-MODE SAFE) ---------- */

const TAG_STYLES = [
  "border-indigo-300 text-indigo-700 dark:border-indigo-400 dark:text-indigo-300",
  "border-emerald-300 text-emerald-700 dark:border-emerald-400 dark:text-emerald-300",
  "border-amber-300 text-amber-700 dark:border-amber-400 dark:text-amber-300",
  "border-rose-300 text-rose-700 dark:border-rose-400 dark:text-rose-300",
  "border-sky-300 text-sky-700 dark:border-sky-400 dark:text-sky-300",
  "border-violet-300 text-violet-700 dark:border-violet-400 dark:text-violet-300",
  "border-teal-300 text-teal-700 dark:border-teal-400 dark:text-teal-300",
  "border-lime-300 text-lime-700 dark:border-lime-400 dark:text-lime-300",
];

/* ----------------------------------------------------------------------- */

const EventDetailPage = ({ navigate, params }) => {
  const eventId = params?.eventId;

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) {
      setLoading(false);
      return;
    }

    const fetchEvent = async () => {
      try {
        const ref = doc(db, "events", eventId);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setEvent(normalizeEvent(snap));
        } else {
          setEvent(null);
        }
      } catch {
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading event…</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Event not found</p>
          <button
            onClick={() => navigate("events")}
            className="text-blue-600 hover:text-blue-800"
          >
            ← Back to Events
          </button>
        </div>
      </div>
    );
  }

  const tags = event.tags ?? [];

  const formatDateTime = (isoString) => {
    if (!isoString) return "—";
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => navigate("events")}
            className="text-sm text-gray-600 hover:text-gray-900 mb-2"
          >
            ← Back to Events
          </button>

          <h1 className="text-2xl font-bold text-gray-900">
            {event.title}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white border border-gray-200 p-6">
          {event.priority !== "normal" && (
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200">
              <AlertCircle size={20} className="text-orange-600" />
              <span className="font-medium text-orange-600 uppercase text-sm">
                {event.priority} Priority
              </span>
            </div>
          )}

          {/* Description */}
          <section className="mb-6">
            <h2 className="text-lg font-semibold mb-3">
              Description
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {event.description}
            </p>
          </section>

          {/* Multicolour Tags */}
          {tags.length > 0 && (
            <section className="mb-6">
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => {
                  const style =
                    TAG_STYLES[index % TAG_STYLES.length];

                  return (
                    <span
                      key={`${tag}-${index}`}
                      className={`px-3 py-1.5 text-xs font-medium rounded-full border ${style}`}
                    >
                      {tag}
                    </span>
                  );
                })}
              </div>
            </section>
          )}

          {/* Event Details */}
          <section className="mb-6 bg-gray-50 p-4 rounded">
            <h2 className="text-lg font-semibold mb-3">
              Event Details
            </h2>
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
            </div>
          </section>

          {/* Who Should Care */}
          <section className="bg-blue-50 p-4 rounded border border-blue-200">
            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <AlertCircle size={18} />
              Who should care?
            </h2>

            <p className="text-sm text-gray-700">
              {tags.includes("All Departments")
                ? "This event is relevant to all students across all departments."
                : tags.length
                ? `Relevant to students in: ${tags.join(", ")}.`
                : "Relevant to selected audiences."}

              {event.priority === "critical" &&
                " This requires immediate attention."}

              {event.priority === "important" &&
                " This should not be missed."}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;

