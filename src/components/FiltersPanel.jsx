import { Filter } from "lucide-react";

const FiltersPanel = ({ filters, setFilters, events }) => {
  const departments = [
    ...new Set(
      events.flatMap((e) => e.tags ?? e.department_tags ?? [])
    ),
  ];

  const eventTypes = [
    ...new Set(events.map((e) => e.event_type)),
  ];

  const priorities = ["normal", "important", "critical"];

  const toggle = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));
  };

  const clearAll = () =>
    setFilters({
      departments: [],
      eventTypes: [],
      priorities: [],
      dateRange: null,
    });

  const active =
    filters.departments.length ||
    filters.eventTypes.length ||
    filters.priorities.length;

  return (
    <div className="bg-gray-50 border border-gray-200 p-4 mb-4">
      <div className="flex justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter size={16} />
          <h3 className="font-semibold">Filters</h3>
        </div>
        {active && (
          <button
            onClick={clearAll}
            className="text-xs text-blue-600"
          >
            Clear all
          </button>
        )}
      </div>

      <FilterGroup
        title="Department"
        items={departments}
        active={filters.departments}
        onToggle={(v) => toggle("departments", v)}
      />

      <FilterGroup
        title="Event Type"
        items={eventTypes}
        active={filters.eventTypes}
        onToggle={(v) => toggle("eventTypes", v)}
      />

      <FilterGroup
        title="Priority"
        items={priorities}
        active={filters.priorities}
        onToggle={(v) => toggle("priorities", v)}
        capitalize
      />
    </div>
  );
};

const FilterGroup = ({
  title,
  items,
  active,
  onToggle,
  capitalize = false,
}) => (
  <div className="mb-4">
    <h4 className="text-sm font-medium mb-2">{title}</h4>
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <button
          key={item}
          onClick={() => onToggle(item)}
          className={`text-xs px-3 py-1.5 rounded border ${
            active.includes(item)
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white border-gray-300"
          }`}
        >
          {capitalize ? item : item}
        </button>
      ))}
    </div>
  </div>
);

export default FiltersPanel;

