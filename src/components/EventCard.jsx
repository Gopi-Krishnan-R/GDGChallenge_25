import { ChevronRight, Calendar, MapPin } from 'lucide-react';

const priorityStyles = {
  critical: 'bg-red-50 border-red-300 text-red-800',
  important: 'bg-orange-50 border-orange-300 text-orange-800',
  normal: 'bg-blue-50 border-blue-300 text-blue-800',
};

const eventTypeStyles = {
  Exam: 'bg-purple-100 text-purple-800',
  Workshop: 'bg-green-100 text-green-800',
  Cultural: 'bg-pink-100 text-pink-800',
  Deadline: 'bg-red-100 text-red-800',
};

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const EventCard = ({ event, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="border border-gray-200 bg-white p-4 mb-3 cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between mb-2">
        <div>
          <div className="flex gap-2 mb-2">
            <span
              className={`text-xs px-2 py-1 rounded ${eventTypeStyles[event.event_type]}`}
            >
              {event.event_type}
            </span>
            {event.priority !== 'normal' && (
              <span
                className={`text-xs px-2 py-1 rounded border ${priorityStyles[event.priority]}`}
              >
                {event.priority.toUpperCase()}
              </span>
            )}
          </div>
          <h3 className="font-semibold text-gray-900">
            {event.title_raw}
          </h3>
        </div>
        <ChevronRight size={20} className="text-gray-400" />
      </div>

      <p className="text-sm text-gray-700 mb-3">
        {event.summary_ai}
      </p>

      <div className="flex gap-4 text-xs text-gray-600">
        <span className="flex items-center gap-1">
          <Calendar size={14} />
          {formatDate(event.start_time)}
        </span>
        <span className="flex items-center gap-1">
          <MapPin size={14} />
          {event.venue}
        </span>
      </div>

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
    </div>
  );
};

export default EventCard;
