
import { Calendar, MapPin, ChevronRight } from "lucide-react";

/* ---------- STYLE MAPS ---------- */

const eventTypeStyles = {
  general: "bg-indigo-100 text-indigo-700",
  notice: "bg-amber-100 text-amber-700",
  academic: "bg-emerald-100 text-emerald-700",
  cultural: "bg-pink-100 text-pink-700",
  sports: "bg-blue-100 text-blue-700"
};

const priorityStyles = {
  high: "bg-red-100 text-red-700 border-red-200",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
  normal: "bg-gray-100 text-gray-600 border-gray-200"
};

/* ---------- HELPERS ---------- */

const formatDate = (value) => {
  if (!value) return "TBA";

  try {
    const date =
      typeof value === "string"
        ? new Date(value)
        : value.toDate?.() ?? new Date(value);

    return date.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric"
    });
  } catch {
    return "TBA";
  }
};

/* ---------- COMPONENT ---------- */

const EventCard = ({ event, onClick }) => {
  const eventType = event.event_type || "general";
  const priority = event.priority || "normal";

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
                  priorityStyles[priority] || priorityStyles.normal
                }`}
              >
                {priority.toUpperCase()}
              </span>
            )}
          </div>

          <h3 className="font-semibold text-gray-900">
            {event.title || event.title_raw || "Untitled Event"}
          </h3>
        </div>

        <ChevronRight size={20} className="text-gray-400" />
      </div>

      <p className="text-sm text-gray-700 mb-3">
        {event.summary || event.summary_ai || "No summary available."}
      </p>

      <div className="flex gap-4 text-xs text-gray-600">
        <span className="flex items-center gap-1">
          <Calendar size={14} />
          {formatDate(event.start_time)}
        </span>

        {event.venue && (
          <span className="flex items-center gap-1">
            <MapPin size={14} />
            {event.venue}
          </span>
        )}
      </div>

      {event.department_tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {event.department_tags.map((tag) => (
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

