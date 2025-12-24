/**
 * Normalize Firestore event documents into a stable UI-safe shape.
 * Backward compatible. No logging. No side effects.
 */
export function normalizeEvent(doc) {
  if (!doc) return null;

  const data = typeof doc.data === "function" ? doc.data() : doc;

  const id =
    doc.id ??
    data.event_id ??
    data.id ??
    null;

  return {
    // identity
    event_id: id,

    // content
    title:
      data.title ??
      data.summary ??
      data.title_raw ??
      data.title_ai ??
      "Untitled Event",

    summary:
      data.summary ??
      data.summary_ai ??
      "",

    description:
      data.description ??
      data.description_raw ??
      data.description_ai ??
      "",

    // tags (canonical)
    tags:
      data.tags ??
      data.department_tags ??
      [],

    // meta
    event_type: data.event_type ?? "general",
    priority: data.priority ?? "normal",

    // time
    start_time: data.start_time ?? null,
    end_time: data.end_time ?? null,

    // location
    venue: data.venue ?? "",

    // preserve original
    _raw: data
  };
}
