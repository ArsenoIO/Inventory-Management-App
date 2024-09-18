import React, { useContext, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthContext, AuthProvider } from "./services/AuthProvider";
import SignInScreen from "./screens/SignInScreen";
import DrawerNavigator from "./navigators/DrawerNavigator"; // Үндсэн апп-ын навигаци
import { View, Text, ActivityIndicator, Alert } from "react-native";
import * as Updates from "expo-updates"; // OTA update-ийг ашиглах
import { AppState } from "react-native"; // App state хянахад ашиглана

const App = () => {
  useEffect(() => {
    const checkForUpdates = async () => {
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          // If an update is available, fetch it
          await Updates.fetchUpdateAsync();
          // Alert the user and reload the app with the new update
          Alert.alert(
            "Шинэ хувилбар байна",
            "Програмыг шинэчилж дахин ачаалах уу?",
            [
              {
                text: "Үгүй",
                style: "cancel",
              },
              {
                text: "Тийм",
                onPress: () => Updates.reloadAsync(),
              },
            ]
          );
        }
      } catch (error) {
        console.error("Шинэчлэл шалгахад алдаа гарлаа:", error);
      }
    };

    checkForUpdates();

    // Optionally, you can also check for updates when the app is foregrounded
    const appStateListener = AppState.addEventListener(
      "change",
      (nextAppState) => {
        if (nextAppState === "active") {
          checkForUpdates();
        }
      }
    );

    // Clean up listener on unmount
    return () => {
      appStateListener.remove();
    };
  }, []);

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
