import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { FontAwesome } from "@expo/vector-icons"; // Back товч

import MainScreen from "../screens/AdminScreen/MainScreen";
import HomeScreen from "../screens/AdminScreen/HomeScreen";
import SalesReportScreen from "../screens/AdminScreen/SalesReport/SalesReportScreen";
import ShoeDatabase from "../screens/AdminScreen/ShoeDatabase";
import ShoeDetailScreen from "../screens/AdminScreen/ShoeDetailScreen";
import TripScreen from "../screens/AdminScreen/Trip/TripScreen";
import TripDetailScreen from "../screens/AdminScreen/Trip/TripDetailScreen";
import SuppliersInfoScreen from "../screens/AdminScreen/SuppliersInfoScreen";
import UserControl from "../screens/AdminScreen/UserControl";
import LeasingControl from "../screens/AdminScreen/LeasingControl";

import SellerSalesDetailScreen from "../screens/SellerScreen/SalesReport/SalesDetailScreen";

import CentralBranchScreen from "../screens/BranchDetailScreen/CentralBranchScreen";
import BumbugurBranchScreen from "../screens/BranchDetailScreen/BumbugurBranchScreen";
import UvurkhangaiBranchScreen from "../screens/BranchDetailScreen/UvurkhangaiBranchScreen";

const Stack = createStackNavigator();

const AdminStackNavigator = ({ navigation }) => {
  if (!navigation) {
    return <Text>Navigation object not ready</Text>;
  }
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AdminMain"
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
        name="AdminHomeScreen"
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
        name="AdminSalesReportScreen"
        component={SalesReportScreen}
        options={{
          title: "Орлогын тайлангууд",
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
        name="AdminShoeDatabase"
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
        name="AdminShoeDetailScreen"
        component={ShoeDetailScreen}
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
        name="SuppliersInfoScreen"
        component={SuppliersInfoScreen}
        options={{
          title: "Нийлүүлэгчдийн мэдээлэл",
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
          title: "Аялал",
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
        name="TripDetailScreen"
        component={TripDetailScreen}
        options={{
          title: "Аялалын дэлгэрэнгүй",
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
        name="AdminUserControl"
        component={UserControl}
        options={{
          title: "Хэрэглэгчдийн удирдлага",
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
        name="AdminLeasingControl"
        component={LeasingControl}
        options={{
          title: "Лизингийн мэдээлэл",
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
        name="CentralBranchScreen"
        component={CentralBranchScreen}
        options={{
          title: "Төв салбар",
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
        name="BumbugurBranchScreen"
        component={BumbugurBranchScreen}
        options={{
          title: "Бөмбөгөр салбар",
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
        name="UvurkhangaiBranchScreen"
        component={UvurkhangaiBranchScreen}
        options={{
          title: "Өвөрхангай салбар",
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
        name="SellerSalesDetailScreen"
        component={SellerSalesDetailScreen}
        options={{
          title: "Орлогын дэлгэрэнгүй",
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

export default AdminStackNavigator;
