import React, { createContext, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { removeUser } from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Хэрэглэгчийн төлөвийг хадгалах

  useEffect(() => {
    const auth = getAuth();

    // Firebase-аас хэрэглэгчийн төлөвийг сонсох
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe(); // listener-ийг устгах
  }, []);

  const login = (user) => {
    setUser(user);
  };

  const logout = async () => {
    try {
      const auth = getAuth();
      await auth.signOut();
      await removeUser(); // Хэрэглэгчийн өгөгдлийг цэвэрлэх
      setUser(null);
    } catch (error) {
      console.error("Logout error: ", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
