import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import AddShoeScreen from './screens/AddShoeScreen';
import ViewShoesScreen from './screens/ViewShoesScreen';
import AccountScreen from './screens/AccountScreen'; // Import the new AccountScreen
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Ensure this import
import ShoesInventoryScreen from './screens/ShoesInventoryScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator>
       <Tab.Screen
        name="Хянах самбар"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Icon name="chart-areaspline" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Гутал бүртгэл"
        component={AddShoeScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Icon name="plus-box" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Орлогын тайлан"
        component={ShoesInventoryScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Icon name="file-plus" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Хэрэглэгч"
        component={AccountScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Icon name="account" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
        <Stack.Screen name="Add Shoe" component={AddShoeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}