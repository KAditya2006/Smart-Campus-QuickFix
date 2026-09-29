import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthorityDashboardScreen from '../screens/authority/AuthorityDashboardScreen';
import AllIssuesScreen from '../screens/authority/AllIssuesScreen';
import AuthorityIssueDetailsScreen from '../screens/authority/AuthorityIssueDetailsScreen';
import AuthorityProfileScreen from '../screens/authority/AuthorityProfileScreen';
import NotificationsScreen from '../screens/user/NotificationsScreen';
import AuthorityAnalyticsScreen from '../screens/authority/AuthorityAnalyticsScreen';
import { theme } from '../theme/theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function DashboardStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DashboardMain" component={AuthorityDashboardScreen} />
      <Stack.Screen name="AuthorityIssueDetails" component={AuthorityIssueDetailsScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
    </Stack.Navigator>
  );
}

function IssuesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AllIssuesMain" component={AllIssuesScreen} />
      <Stack.Screen name="AuthorityIssueDetails" component={AuthorityIssueDetailsScreen} />
    </Stack.Navigator>
  );
}

export default function AuthorityNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.secondaryText,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontFamily: theme.typography.fontFamily,
          fontSize: 12,
        }
      }}
    >
      <Tab.Screen 
        name="AuthorityDashboard" 
        component={DashboardStack} 
        options={{ 
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />
        }} 
      />
      <Tab.Screen 
        name="AllIssues" 
        component={IssuesStack} 
        options={{ 
          tabBarLabel: 'Issues',
          tabBarIcon: ({ color, size }) => <Ionicons name="list" size={size} color={color} />
        }} 
      />
      <Tab.Screen 
        name="Analytics" 
        component={AuthorityAnalyticsScreen} 
        options={{ 
          tabBarLabel: 'Stats',
          tabBarIcon: ({ color, size }) => <Ionicons name="stats-chart" size={size} color={color} />
        }} 
      />
      <Tab.Screen 
        name="AuthorityProfile" 
        component={AuthorityProfileScreen} 
        options={{ 
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />
        }} 
      />
    </Tab.Navigator>
  );
}
