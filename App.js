import React, { useContext, useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Alert } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { AuthContext, AuthProvider } from "./src/services/AuthProvider";
import SignInScreen from "./src/screens/SignInScreen";
import DrawerNavigator from "./src/navigation/DrawerNavigator";
import * as Updates from "expo-updates"; // OTA update-ийг ашиглах
import { AppState } from "react-native"; // App state хянахад ашиглана

const App = () => {
  const [isCheckingForUpdate, setIsCheckingForUpdate] = useState(true); // Шинэчлэл шалгаж байгаа төлөв

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
                onPress: () => setIsCheckingForUpdate(false), // Хэрэглэгч шинэчлэхгүй гэж сонговол
              },
              {
                text: "Тийм",
                onPress: () => Updates.reloadAsync(),
              },
            ]
          );
        } else {
          setIsCheckingForUpdate(false); // Шинэчлэл байхгүй үед апп руу орно
        }
      } catch (error) {
        console.error("Шинэчлэл шалгахад алдаа гарлаа:", error);
        setIsCheckingForUpdate(false);
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

  // Шинэчлэлт шалгаж байхад үзүүлэх дэлгэц
  if (isCheckingForUpdate) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Шинэчлэл шалгаж байна...</Text>
      </View>
    );
  }

  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
};

const RootNavigator = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return user ? <DrawerNavigator /> : <SignInScreen />;
};

export default App;
