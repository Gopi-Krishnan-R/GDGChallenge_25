import { ChevronRight, Calendar, MapPin } from "lucide-react";

/* ---------- STYLE MAPS ---------- */

const priorityStyles = {
  critical: "bg-red-50 border-red-300 text-red-800",
  important: "bg-orange-50 border-orange-300 text-orange-800",
  normal: "bg-blue-50 border-blue-300 text-blue-800",
};

const eventTypeStyles = {
  hackathon: "bg-indigo-100 text-indigo-800",
  workshop: "bg-green-100 text-green-800",
  seminar: "bg-purple-100 text-purple-800",
  cultural: "bg-pink-100 text-pink-800",
  sports: "bg-yellow-100 text-yellow-800",
  academic: "bg-blue-100 text-blue-800",
  general: "bg-gray-100 text-gray-800",
};

/* ---------- HELPERS ---------- */

const formatDate = (value) => {
  if (!value || value === "TBD") return "TBD";

  const date = new Date(value);
  if (isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/* ---------- COMPONENT ---------- */

const EventCard = ({ event, onClick }) => {
  const eventType = event.event_type || "general";
  const priority = event.priority || "normal";
  const tags = Array.isArray(event.department_tags)
    ? event.department_tags
    : [];

  return (
    <div
      onClick={onClick}
      className="border border-gray-200 bg-white p-4 mb-3 cursor-pointer rounded-xl hover:shadow-lg transition-shadow"
    >
      <div className="flex justify-between mb-2">
        <div>
          <div className="flex gap-2 mb-2">
            <span
              className={`text-xs px-2 py-1 rounded ${
                eventTypeStyles[eventType] || eventTypeStyles.general
              }`}
            >
              {eventType}
            </span>

            {priority !== "normal" && (
              <span
                className={`text-xs px-2 py-1 rounded border ${
                  priorityStyles[priority]
                }`}
              >
                {priority.toUpperCase()}
              </span>
            )}
          </div>

          <h3 className="font-semibold text-gray-900">
            {event.title_ai || event.title_raw || "Untitled Event"}
          </h3>
        </div>

        <ChevronRight size={20} className="text-gray-400" />
      </div>

      {event.summary_ai && (
        <p className="text-sm text-gray-700 mb-3">
          {event.summary_ai}
        </p>
      )}

      <div className="flex gap-4 text-xs text-gray-600">
        <span className="flex items-center gap-1">
          <Calendar size={14} />
          {formatDate(event.start_time)}
        </span>

        <span className="flex items-center gap-1">
          <MapPin size={14} />
          {event.venue || "TBD"}
        </span>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-gray-100 px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventCard;
