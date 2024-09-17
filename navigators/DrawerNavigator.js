import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { FontAwesome } from "@expo/vector-icons"; // Back товч
import { useNavigation } from "@react-navigation/native";

import MainScreen from "../screens/MainScreen";

import LogoutScreen from "../screens/LogoutScreen";

import HomeScreen from "../screens/HomeScreen";
import AddShoeScreen from "../screens/AddShoeScreen";
import RevenueReportScreen from "../screens/RevenueReportScreen";
import TripScreen from "../screens/AdminScreen/TripScreen";
import SuppliersInfoScreen from "../screens/SuppliersInfoScreen";
import ShoeDatabase from "../screens/ShoeDatabase";
import ChangeBranchScreen from "../screens/ChangeBranchScreen";
import AccountScreen from "../screens/AccountScreen";
import ShoeDetailScreen from "../screens/ShoeDetailScreen";
import CentralBranchScreen from "../screens/BranchDetailScreen/CentralBranchScreen";
import UvurkhangaiBranch from "../screens/BranchDetailScreen/UvurkhangaiBranchScreen";
import BumbugurBranch from "../screens/BranchDetailScreen/BumbugurBranchScreen";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const MainStackNavigator = () => {
  const navigation = useNavigation();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Main"
        component={MainScreen}
        options={{
          headerLeft: () => (
            <FontAwesome
              name="bars"
              size={25}
              color="black"
              style={{ marginLeft: 25 }}
              onPress={() => navigation.openDrawer()} // Drawer-ийг нээдэг товч
            />
          ),
        }}
      />
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          title: "Салбаруудын мэдээлэл",
          headerLeft: ({ canGoBack }) =>
            canGoBack ? (
              <FontAwesome
                name="arrow-left"
                size={25}
                color="black"
                style={{ marginLeft: 25 }}
                onPress={() => navigation.goBack()} // Буцах товч
              />
            ) : null,
        }}
      />
      <Stack.Screen
        name="AddShoeScreen"
        component={AddShoeScreen}
        options={{
          title: "Гутал Бүртгэл",
          headerLeft: ({ canGoBack }) =>
            canGoBack ? (
              <FontAwesome
                name="arrow-left"
                size={25}
                color="black"
                style={{ marginLeft: 25 }}
                onPress={() => navigation.goBack()} // Буцах товч
              />
            ) : null,
        }}
      />
      <Stack.Screen
        name="SuppliersInfoScreen"
        component={SuppliersInfoScreen}
        options={{
          title: "Нйилүүлэгчдийн мэдээлэл",
          headerLeft: ({ canGoBack }) =>
            canGoBack ? (
              <FontAwesome
                name="arrow-left"
                size={25}
                color="black"
                style={{ marginLeft: 25 }}
                onPress={() => navigation.goBack()} // Буцах товч
              />
            ) : null,
        }}
      />
      <Stack.Screen
        name="RevenueReportScreen"
        component={RevenueReportScreen}
        options={{
          title: "Орлогын тайлан илгээх",
          headerLeft: ({ canGoBack }) =>
            canGoBack ? (
              <FontAwesome
                name="arrow-left"
                size={25}
                color="black"
                style={{ marginLeft: 25 }}
                onPress={() => navigation.goBack()} // Буцах товч
              />
            ) : null,
        }}
      />
      <Stack.Screen
        name="ShoeDatabase"
        component={ShoeDatabase}
        options={{
          title: "Гутлын сан",
          headerLeft: ({ canGoBack }) =>
            canGoBack ? (
              <FontAwesome
                name="arrow-left"
                size={25}
                color="black"
                style={{ marginLeft: 25 }}
                onPress={() => navigation.goBack()} // Буцах товч
              />
            ) : null,
        }}
      />
      <Stack.Screen
        name="ShoeDetailScreen"
        component={ShoeDetailScreen}
        options={{ title: "Гутлын дэлгэрэнгүй" }}
      />
      <Stack.Screen
        name="ChangeBranchScreen"
        component={ChangeBranchScreen}
        options={{
          title: "Салбар солих",
          headerLeft: ({ canGoBack }) =>
            canGoBack ? (
              <FontAwesome
                name="arrow-left"
                size={25}
                color="black"
                style={{ marginLeft: 25 }}
                onPress={() => navigation.goBack()} // Буцах товч
              />
            ) : null,
        }}
      />
      <Stack.Screen
        name="TripScreen"
        component={TripScreen}
        options={{
          title: "Аялалын мэдээлэл",
          headerLeft: ({ canGoBack }) =>
            canGoBack ? (
              <FontAwesome
                name="arrow-left"
                size={25}
                color="black"
                style={{ marginLeft: 25 }}
                onPress={() => navigation.goBack()} // Буцах товч
              />
            ) : null,
        }}
      />
      <Stack.Screen
        name="CentralBranch"
        component={CentralBranchScreen}
        options={{
          title: "Аялалын мэдээлэл",
          headerLeft: ({ canGoBack }) =>
            canGoBack ? (
              <FontAwesome
                name="arrow-left"
                size={25}
                color="black"
                style={{ marginLeft: 25 }}
                onPress={() => navigation.goBack()} // Буцах товч
              />
            ) : null,
        }}
      />
      <Stack.Screen
        name="BumbugurBranch"
        component={BumbugurBranch}
        options={{
          title: "Аялалын мэдээлэл",
          headerLeft: ({ canGoBack }) =>
            canGoBack ? (
              <FontAwesome
                name="arrow-left"
                size={25}
                color="black"
                style={{ marginLeft: 25 }}
                onPress={() => navigation.goBack()} // Буцах товч
              />
            ) : null,
        }}
      />
      <Stack.Screen
        name="UvurkhangaiBranch"
        component={UvurkhangaiBranch}
        options={{
          title: "Аялалын мэдээлэл",
          headerLeft: ({ canGoBack }) =>
            canGoBack ? (
              <FontAwesome
                name="arrow-left"
                size={25}
                color="black"
                style={{ marginLeft: 25 }}
                onPress={() => navigation.goBack()} // Буцах товч
              />
            ) : null,
        }}
      />
    </Stack.Navigator>
  );
};

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator initialRouteName="Main">
      <Drawer.Screen
        name="MainStack"
        component={MainStackNavigator} // Stack navigator-аар холбож байна
        options={{ headerShown: false }} // Drawer icon-ийг арилгана
      />
      <Drawer.Screen name="Account" component={AccountScreen} />
      <Drawer.Screen name="Logout" component={LogoutScreen} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
