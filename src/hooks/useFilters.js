import { useMemo, useState } from "react";

export function useFilters(events = []) {
  const [filters, setFilters] = useState({
    departments: [],
    eventTypes: [],
    priorities: [],
    dateRange: null,
  });

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      // ✅ Canonical tags with backward compatibility
      const tags = event.tags ?? event.department_tags ?? [];

      // Department filter
      if (
        filters.departments.length > 0 &&
        !filters.departments.some((d) => tags.includes(d))
      ) {
        return false;
      }

      // Event type filter
      if (
        filters.eventTypes.length > 0 &&
        !filters.eventTypes.includes(event.event_type)
      ) {
        return false;
      }

      // Priority filter
      if (
        filters.priorities.length > 0 &&
        !filters.priorities.includes(event.priority)
      ) {
        return false;
      }

      return true;
    });
  }, [events, filters]);

  return {
    filters,
    setFilters,
    filteredEvents,
  };
}

