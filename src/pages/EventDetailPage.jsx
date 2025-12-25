import React from "react";
import { AlertCircle } from "lucide-react";

const EventDetailPage = ({ navigate, params, events }) => {
  const event = events?.find(e => e.event_id === params?.eventId);
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

  const formatDateTime = (value) => {
    if (!value || value === "TBD") return "TBD";
    const date = new Date(value);
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
      <div className="bg-white border-b px-6 py-4">
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

      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white border p-6">
          {event.priority !== "normal" && (
            <div className="flex items-center gap-2 mb-4 pb-4 border-b">
              <AlertCircle size={20} className="text-orange-600" />
              <span className="font-medium text-orange-600 uppercase text-sm">
                {event.priority.toUpperCase()}
              </span>
            </div>
          )}

          {event.description && (
            <section className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Description</h2>
              <p className="text-gray-700 leading-relaxed">
                {event.description}
              </p>
            </section>
          )}

          <section className="mb-6 bg-gray-50 p-4 rounded">
            <h2 className="text-lg font-semibold mb-3">Event Details</h2>
            <div className="space-y-2 text-sm">
              <div className="flex">
                <span className="font-medium w-32">Type:</span>
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
                <span>{event.venue || "TBD"}</span>
              </div>

              <div className="flex">
                <span className="font-medium w-32">Departments:</span>
                <span>
                  {event.tags.length > 0
                    ? event.tags.join(", ")
                    : "All"}
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
