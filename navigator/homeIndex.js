import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebaseConfig';

function AppNavigator() {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(firestore, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserRole(userData.role);  // Set the role (admin or salesperson)
        }
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  if (loading) {
    return <LoadingScreen />; // Implement a loading screen if necessary
  }

  return (
    <NavigationContainer>
      {userRole === 'admin' ? <AdminStackScreen /> : <SalesStackScreen />}
    </NavigationContainer>
  );
}

export default AppNavigator;
