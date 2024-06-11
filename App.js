import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeScreen from './HomeScreen';
import CameraScreen from './CameraScreen';
import MoreScreen from './MoreScreen';
import AddShoeScreen from './AddShoeScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function CameraStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Camera" component={CameraScreen} />
      <Stack.Screen name="AddShoe" component={AddShoeScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = 'grid-outline';
            } else if (route.name === 'Camera') {
              iconName = 'camera-outline';
            } else if (route.name === 'More') {
              iconName = 'ellipsis-horizontal-outline';
            }
            return <Icon name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: 'tomato',
          inactiveTintColor: 'gray',
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Camera" component={CameraStack} />
        <Tab.Screen name="More" component={MoreScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
