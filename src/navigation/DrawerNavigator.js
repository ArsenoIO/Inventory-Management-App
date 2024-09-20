import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Text } from "react-native";
import useUserData from "../hooks/useUserData";
import AccountScreen from "../screens/AccountScreen";
import LogoutScreen from "../screens/LogoutScreen";

import AdminStackNavigator from "./AdminStackNavigator"; // Админ stack
import SellerStackNavigator from "./SellerStackNavigator"; // Худалдагч stack

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const { userData, loading } = useUserData(); // Хэрэглэгчийн мэдээлэл авах

  // Хэрэв мэдээлэл ачаалагдаж байгаа бол ачааллын мессеж эсвэл loader харуулах
  if (loading) {
    return <Text>Loading...</Text>; // Та loader component ашиглаж болно
  }

  // Хэрэв `userData` нь null бол, та алдаа эсвэл буруу байгааг харуулж болно
  if (!userData) {
    return <Text>Error: User data not available</Text>;
  }
  console.log(userData.userRole);

  return (
    <Drawer.Navigator>
      {userData.userRole === "admin" ? (
        // Админд зориулсан дэлгэц
        <>
          <Drawer.Screen
            name="AdminStack"
            component={AdminStackNavigator} // Админд зориулсан stack
            options={{ headerShown: false }}
          />
          <Drawer.Screen name="Account" component={AccountScreen} />
          <Drawer.Screen name="Logout" component={LogoutScreen} />
        </>
      ) : (
        // Худалдагчид зориулсан дэлгэц
        <>
          <Drawer.Screen
            name="SellerStack"
            component={SellerStackNavigator} // Худалдагчид зориулсан stack
            options={{ headerShown: false }}
          />
          <Drawer.Screen name="Account" component={AccountScreen} />
          <Drawer.Screen name="Logout" component={LogoutScreen} />
        </>
      )}
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
