/*
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./screens/HomeScreen";
import AddShoeScreen from "./screens/AddShoeScreen";
import ViewShoesScreen from "./screens/ViewShoesScreen";
import AccountScreen from "./screens/AccountScreen"; // Import the new AccountScreen
import Icon from "react-native-vector-icons/MaterialCommunityIcons"; // Ensure this import
import RevenueReportScreen from "./screens/RevenueReportScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Хянах самбар"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="chart-areaspline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Гутал бүртгэл"
        component={AddShoeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="plus-box" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Орлогын тайлан"
        component={RevenueReportScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="file-plus" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Хэрэглэгч"
        component={AccountScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="account" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Add Shoe" component={AddShoeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SignInScreen from "./screens/SignInScreen";
import SignUpScreen from "./screens/SignUpScreen";
import ManagerScreen from "./screens/ManagerScreen";
import SellerScreen from "./screens/SellerScreen";
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';

const Stack = createStackNavigator();
const ManagerStack = createStackNavigator();
const SellerStack = createStackNavigator();

function ManagerStackScreen() {
  return (
    <ManagerStack.Navigator>
      <ManagerStack.Screen name="ManagerHome" component={ManagerScreen} />
    </ManagerStack.Navigator>
  );
}

function SellerStackScreen() {
  return (
    <SellerStack.Navigator>
      <SellerStack.Screen name="SellerHome" component={SellerScreen} />
    </SellerStack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignIn">
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="ManagerStack" component={ManagerStackScreen} />
        <Stack.Screen name="SellerStack" component={SellerStackScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SignInScreen from "./screens/SignInScreen";
import HomeScreen from "./screens/HomeScreen"; // Import the HomeScreen
import firebase from "@react-native-firebase/app";
import firestore from "@react-native-firebase/firestore";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignIn">
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}*/

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SignInScreen from "./screens/SignInScreen";
import HomeScreen from "./screens/HomeScreen";
import AddShoeScreen from "./screens/AddShoeScreen";
import AccountScreen from "./screens/AccountScreen";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import RevenueReportScreen from "./screens/RevenueReportScreen";
import JustPicker from "./screens/JustPicker";
import AddImagePicker from "./screens/AddImagePicker";
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Эхлэл"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="chart-areaspline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Бүртгэл"
        component={JustPicker}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="plus-box" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Орлого"
        component={RevenueReportScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="file-plus" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Хэрэглэгч"
        component={AccountScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="account" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignIn">
        <Stack.Screen
          name="SignIn"
          component={SignInScreen}
          /*options={{ headerShown: false }}*/
        />
        <Stack.Screen
          name="Main"
          component={MainTabs}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
