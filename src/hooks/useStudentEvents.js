import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/firebase";

export function useStudentEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const q = query(
      collection(db, "events"),
      orderBy("start_time", "asc")
    );

    const unsubscribe = onSnapshot(
      q,
      snapshot => {
        const normalized = snapshot.docs.map(doc => {
          const data = doc.data();

          const tags =
            data.tags ||
            data.department_tags ||
            [];

          return {
            event_id: doc.id,

            // ===== Timeline / EventCard expects THESE =====
            title_raw: data.title || "",
            summary_ai: data.summary || "",
            description_ai: data.description || "",
            department_tags: tags,
            event_type: data.event_type || "general",
            priority: data.priority || "normal",

            start_time: data.start_time || "",
            end_time: data.end_time || "",
            venue: data.venue || "",

            // ===== Targeting (future use) =====
            explicitRecipients: data.explicitRecipients || [],
            createdAt: data.createdAt || null
          };
        });

        setEvents(normalized);
        setLoading(false);
      },
      err => {
        console.error("Student events error:", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { events, loading, error };
}
