import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { FontAwesome } from "@expo/vector-icons"; // Back товч

import MainScreen from "../screens/SellerScreen/MainScreen";
import HomeScreen from "../screens/SellerScreen/HomeScreen";
import AddShoeScreen from "../screens/SellerScreen/AddShoeScreen";
import ShoeDatabase from "../screens/SellerScreen/ShoeDatabase";
import ShoeDetailScreen from "../screens/SellerScreen/ShoeDetailScreen";
import SalesReportScreen from "../screens/SellerScreen/SalesReport/SalesReportScreen";
import SalesDetailScreen from "../screens/SellerScreen/SalesReport/SalesDetailScreen";
import IncomeAddScreen from "../screens/SellerScreen/SalesReport/IncomeAddScreen";
import ChangeBranchScreen from "../screens/SellerScreen/ChangeBranchScreen";
import LeasingScreen from "../screens/SellerScreen/Leasing";

import CentralBranchScreen from "../screens/BranchDetailScreen/CentralBranchScreen";
import BumbugurBranchScreen from "../screens/BranchDetailScreen/BumbugurBranchScreen";
import UvurkhangaiBranchScreen from "../screens/BranchDetailScreen/UvurkhangaiBranchScreen";

const Stack = createStackNavigator();

const SellerStackNavigator = ({ navigation }) => {
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
          title: "Салбарын мэдээлэл",
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
          title: "Гутал бүртгэх",
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
        name="SalesReportScreen"
        component={SalesReportScreen}
        options={{
          title: "Тайлан",
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
          title: "Бүртгэлтэй гутлын жагсаалт",
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
        options={{
          title: "Гутлын мэдээлэл",
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
        name="ChangeBranchScreen"
        component={ChangeBranchScreen}
        options={{
          title: "Салбар шилжүүлэх",
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
        name="Leasing"
        component={LeasingScreen}
        options={{
          title: "Хувь лизинг",
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
        name="IncomeAddScreen"
        component={IncomeAddScreen}
        options={{
          title: "Тайланд орлого нэмэх",
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
      {/* Other seller screens... */}
    </Stack.Navigator>
  );
};

export default SellerStackNavigator;
