import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const useUserData = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const auth = getAuth();
        const firestore = getFirestore();
        const userId = auth.currentUser?.uid;

        if (userId) {
          const userDocRef = doc(firestore, "users", userId);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            setUserData(userDoc.data());
          } else {
            setError("No such user document exists.");
          }
        } else {
          setError("No user is logged in.");
        }
      } catch (error) {
        setError("Error fetching user data: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return { userData, loading, error };
};

export default useUserData;
