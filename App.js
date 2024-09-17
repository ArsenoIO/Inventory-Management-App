import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthContext, AuthProvider } from "./services/AuthProvider";
import SignInScreen from "./screens/SignInScreen";
import DrawerNavigator from "./navigators/DrawerNavigator"; // Үндсэн апп-ын навигаци

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
};

const RootNavigator = () => {
  const { user } = useContext(AuthContext); // Хэрэглэгчийн төлөвийг контекстээс авах

  return user ? <DrawerNavigator /> : <SignInScreen />; // Нэвтэрсэн эсвэл нэвтрээгүй эсэхээр дэлгэцийг харуулах
};

export default App;
