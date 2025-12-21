import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/firebase";

export function useEvents() {
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
      (snapshot) => {
        const nextEvents = snapshot.docs.map((doc) => ({
          event_id: doc.id,
          ...doc.data(),
        }));

        setEvents(nextEvents);
        setLoading(false);
      },
      (err) => {
        console.error("Error listening to events:", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { events, loading, error };
}

