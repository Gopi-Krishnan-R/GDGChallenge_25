import { useState, useEffect } from "react";
import { auth, db } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export function useSession() {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");
  const [profileExists, setProfileExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (!currentUser) {
        setUserName("");
        setProfileExists(false);
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserName(data.name || "");
          setProfileExists(true);
          setRole(data.role === "admin" ? "admin" : "student");
        } else {
          setUserName("");
          setProfileExists(false);
          setRole("student");
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        setUserName("");
        setProfileExists(false);
        setRole("student");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return {
    user,
    userName,
    profileExists,
    loading,
    role,
  };
}

