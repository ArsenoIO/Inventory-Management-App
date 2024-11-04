import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { FontAwesome } from "@expo/vector-icons"; // Back товч

import MainScreen from "../screens/AdminScreen/MainScreen";

import BranchScreen from "../screens/BranchScreen";
import BranchDetailScreen from "../screens/BranchDetailScreen";

import SalesReportScreen from "../screens/AdminScreen/SalesReport/SalesReportScreen";
import SalesDetailScreen from "../screens/AdminScreen/SalesReport/SalesDetailScreen";

import ShoeDatabase from "../screens/AdminScreen/ShoeDatabase";
import ShoeDetailScreen from "../screens/AdminScreen/ShoeDetailScreen";

import TripScreen from "../screens/AdminScreen/Trip/TripScreen";
import TripDetailScreen from "../screens/AdminScreen/Trip/TripDetailScreen";

import SuppliersInfoScreen from "../screens/AdminScreen/Suppliers/SuppliersInfoScreen";
import SupplierDetailScreen from "../screens/AdminScreen/Suppliers/SupplierDetailScreen";
import AddSupplierScreen from "../screens/AdminScreen/Suppliers/AddSupplierScreen";

import UserControl from "../screens/AdminScreen/UserControl";

import LeasingControl from "../screens/AdminScreen/LeasingControl";

import SellerSalesDetailScreen from "../screens/SellerScreen/SalesReport/SalesDetailScreen";
import AddTripScreen from "../screens/AdminScreen/Trip/AddTripScreen";
import AddShoeExpenseScreen from "../screens/AdminScreen/Trip/AddShoeExpenseScreen";
import AddOtherExpenseScreen from "../screens/AdminScreen/Trip/AddOtherExpenseScreen";

import SupplierHistoryScreen from "../screens/AdminScreen/Suppliers/SupplierHistoryScreen";

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
        name="AdminBranchScreen"
        component={BranchScreen}
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
        name="SupplierDetailScreen"
        component={SupplierDetailScreen}
        options={{
          title: "Нийлүүлэгчийн мэдээлэл",
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
        name="AddTripScreen"
        component={AddTripScreen}
        options={{
          title: "Шинэ аялал үүсгэх",
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
        name="AddShoeExpenseScreen"
        component={AddShoeExpenseScreen}
        options={{
          title: "Гутал худалдан авалт",
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
        name="SalesDetailScreen"
        component={SalesDetailScreen}
        options={{
          title: "Тайлангийн дэлгэрэнгүй",
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
        name="AddOtherExpenseScreen"
        component={AddOtherExpenseScreen}
        options={{
          title: "Бусад зардал нэмэх",
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
        name="AddSupplierScreen"
        component={AddSupplierScreen}
        options={{
          title: "Нийлүүлэгч бүртгэх",
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
        name="SupplierHistoryScreen"
        component={SupplierHistoryScreen}
        options={{
          title: "Дэлгэрэнгүй",
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
      <Stack.Screen
        name="BranchDetailScreen"
        component={BranchDetailScreen}
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
