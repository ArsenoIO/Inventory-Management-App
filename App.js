import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import AddShoeScreen from './screens/AddShoeScreen';
import ViewShoesScreen from './screens/ViewShoesScreen';
import BottomNav from './components/BottomNav';
//Өөрчлөлт оруулав
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
      <Stack.Screen name="AddShoe" component={AddShoeScreen} options={{ title: 'Add Shoe' }} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator tabBar={props => <BottomNav {...props} />}>
        <Tab.Screen name="HomeStack" component={HomeStack} options={{ headerShown: false }} />
        <Tab.Screen name="ViewShoes" component={ViewShoesScreen} options={{ title: 'View Shoes' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
