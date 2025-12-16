import { useState, useMemo } from 'react';

export const useFilters = (events) => {
  const [filters, setFilters] = useState({
    departments: [],
    eventTypes: [],
    priorities: [],
    dateRange: null,
  });

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      if (
        filters.departments.length &&
        !event.department_tags.some((d) =>
          filters.departments.includes(d)
        )
      ) {
        return false;
      }

      if (
        filters.eventTypes.length &&
        !filters.eventTypes.includes(event.event_type)
      ) {
        return false;
      }

      if (
        filters.priorities.length &&
        !filters.priorities.includes(event.priority)
      ) {
        return false;
      }

      return true;
    });
  }, [events, filters]);

  return { filters, setFilters, filteredEvents };
};
