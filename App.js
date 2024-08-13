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
        component={AddShoeScreen}
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
