import { useEffect, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { normalizeEvent } from "../utils/normalizeEvent";

export function useStudentEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "events"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const normalizedEvents = snapshot.docs
          .map((doc) => normalizeEvent(doc))
          .filter(Boolean);

        setEvents(normalizedEvents);
        setLoading(false);
      },
      () => {
        setEvents([]);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { events, loading };
}

