import React from "react";
import { AlertCircle } from "lucide-react";

/* ---------- Utilities ---------- */

const formatDateTime = (value) => {
  if (!value) return "TBD";
  const date = new Date(value);
  if (isNaN(date.getTime())) return "TBD";

  return date.toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const renderSummary = (text) => {
  if (!text) return <p className="text-gray-500">No description provided.</p>;

  // Bullet-aware rendering
  if (text.includes("•")) {
    return (
      <ul className="list-disc pl-6 space-y-1 text-gray-700">
        {text
          .split("•")
          .filter(Boolean)
          .map((item, i) => (
            <li key={i}>{item.trim()}</li>
          ))}
      </ul>
    );
  }

  return <p className="text-gray-700 leading-relaxed">{text}</p>;
};

/* ---------- Component ---------- */

const EventDetailPage = ({ navigate, event }) => {
  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Event not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <button
          onClick={() => navigate("events")}
          className="text-sm text-gray-600 hover:text-gray-900 mb-2"
        >
          ← Back to Events
        </button>

        <h1 className="text-2xl font-bold text-gray-900">
          {event.title_ai || "Untitled Event"}
        </h1>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white border rounded-lg p-6 space-y-6">
          {/* Priority */}
          {event.priority === "high" && (
            <div className="flex items-center gap-2 text-orange-600 font-medium">
              <AlertCircle size={18} />
              High Priority
            </div>
          )}

          {/* Description */}
          <section>
            <h2 className="font-semibold mb-2">Description</h2>
            {renderSummary(event.description_ai)}
          </section>

          {/* Event Details */}
          <section className="bg-gray-50 p-4 rounded">
            <h2 className="font-semibold mb-3">Event Details</h2>
            <div className="text-sm space-y-1">
              <div>
                <b>Type:</b> {event.event_type || "General"}
              </div>
              <div>
                <b>Start:</b> {formatDateTime(event.start_time)}
              </div>
              <div>
                <b>End:</b> {formatDateTime(event.end_time)}
              </div>
              <div>
                <b>Venue:</b> {event.venue || "TBD"}
              </div>
              <div>
                <b>Departments:</b>{" "}
                {event.department_tags?.join(", ") || "General"}
              </div>
            </div>
          </section>

          {/* Who Should Care */}
          <section className="bg-blue-50 p-4 rounded border">
            <h2 className="font-semibold mb-1 flex items-center gap-2">
              <AlertCircle size={16} /> Who should care?
            </h2>
            <p className="text-sm text-gray-700">
              {event.department_tags?.includes("All Departments")
                ? "Relevant to all students."
                : `Relevant to students in: ${
                    event.department_tags?.join(", ") || "General"
                  }.`}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
