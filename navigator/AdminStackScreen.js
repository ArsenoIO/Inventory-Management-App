import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AdminDashboard from '../screens/AdminDashboard';
import ShoeRegistration from '../screens/ShoeRegistration';
import DailyRevenue from '../screens/DailyRevenue';
import Profile from '../screens/Profile';
import AdminProfileManagement from '../screens/AdminProfileManagement';
import PersonalFinance from '../screens/PersonalFinance';

// Stack for Admin
const AdminStack = createStackNavigator();

function AdminStackScreen() {
  return (
    <AdminStack.Navigator>
      <AdminStack.Screen name="AdminDashboard" component={AdminDashboard} />
      <AdminStack.Screen name="ProfileManagement" component={AdminProfileManagement} />
      <AdminStack.Screen name="PersonalFinance" component={PersonalFinance} />
      {/* Add more screens as needed */}
    </AdminStack.Navigator>
  );
}

// Stack for Salesperson
const SalesStack = createStackNavigator();

function SalesStackScreen() {
  return (
    <SalesStack.Navigator>
      <SalesStack.Screen name="ShoeRegistration" component={ShoeRegistration} />
      <SalesStack.Screen name="DailyRevenue" component={DailyRevenue} />
      <SalesStack.Screen name="Profile" component={Profile} />
      {/* Add more screens as needed */}
    </SalesStack.Navigator>
  );
}
