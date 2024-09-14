import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Provider as PaperProvider } from "react-native-paper";
import { createStackNavigator } from "@react-navigation/stack";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import SignInScreen from "./screens/SignInScreen";
import BottomNav from "./components/BottomNav";
import CentralBranchScreen from "./screens/BranchDetailScreen/CentralBranchScreen";
import BumbugurBranchScreen from "./screens/BranchDetailScreen/BumbugurBranchScreen";
import UvurkhangaiBranchScreen from "./screens/BranchDetailScreen/UvurkhangaiBranchScreen";
import TripScreen from "./screens/AdminScreen/TripScreen";
import TripDetailScreen from "./screens/AdminScreen/TripDetailScreen";
import ShoePurchaseScreen from "./screens/AdminScreen/ShoePurchaseScreen";
import { getUser } from "./services/authService"; // AsyncStorage-с хэрэглэгчийг унших

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Анх App ачаалагдах үед

  // Апп эхлэх үед хэрэглэгчийн статусыг шалгана
  useEffect(() => {
    const checkUserStatus = async () => {
      const storedUser = await getUser();
      setUser(storedUser);
      setLoading(false);
    };
    checkUserStatus();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#CE5A67" />
      </View>
    );
  }

  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={user ? "Main" : "SignIn"}>
          <Stack.Screen
            name="SignIn"
            component={SignInScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Main"
            component={BottomNav}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CentralBranch"
            component={CentralBranchScreen}
            options={{ title: "Төв салбар" }}
          />
          <Stack.Screen
            name="UvurkhangaiBranch"
            component={UvurkhangaiBranchScreen}
            options={{ title: "Өвөрхангай салбар" }}
          />
          <Stack.Screen
            name="BumbugurBranch"
            component={BumbugurBranchScreen}
            options={{ title: "Бөмбөгөр салбар" }}
          />
          <Stack.Screen
            name="TripScreen"
            component={TripScreen}
            options={{ title: "Аяллын түүх" }}
          />
          <Stack.Screen
            name="TripDetailScreen"
            component={TripDetailScreen}
            options={{ title: "Аяллын дэлгэрэнгүй" }}
          />
          <Stack.Screen
            name="ShoePurchaseScreen"
            component={ShoePurchaseScreen}
            options={{ title: "Гутал худалдан авах" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FCF5ED", // Таны үндсэн апп өнгө
  },
});
