import React, { useContext, useState, useEffect } from "react";
import { View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons"; // Importing Expo icons
import WelcomeScreen from "../Screens/WelcomeScreen";
import LoginScreen from "../Screens/LoginScreen";
import RegisterScreen from "../Screens/RegisterScreen";
import ForgotPasswordScreen from "../Screens/ForgotPasswordScreen";
import ResetPasswordScreen from "../Screens/ChangePasswordScreen";
import { AuthContext } from "../context/AuthContext";
import HomeScreen from "../Screens/HomeScreen";
import ProfileScreen from "../Screens/ProfileScreen";
import SettingsScreen from "../Screens/Settings";
import PrivacyScreen from "../Screens/PrivacyScreen";
import ServiceScreen from "../Screens/ServiceScreen";
import SecurityScreen from "../Screens/SecurityScreen";
import ReportScreen from "../Screens/ReportScreen";
import SupportScreen from "../Screens/SupportScreen";
import CommunityScreen from "../Screens/CommunityScreen";
import Aquila from "../Screens/SevicesProviders/Aquila";
import Armstrong from "../Screens/SevicesProviders/Armstrong";
import Asante from "../Screens/SevicesProviders/Asante";
import Best from "../Screens/SevicesProviders/Best";
import Bins from "../Screens/SevicesProviders/Bins";
import DeWaste from "../Screens/SevicesProviders/DeWaste";
import Nabugabo from "../Screens/SevicesProviders/Nabugabo";
import Swift from "../Screens/SevicesProviders/Swift";
import YoWaste from "../Screens/SevicesProviders/YoWaste";
import SaleScreen from "../Screens/SaleScreen";
import TrashReminder from "../Screens/GarbageScheduleScreen";
import Tips from "../Screens/TipsScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack Navigator for Authentication
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
}

// Tab Navigator for Main Screens with Badge Logic
function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let badgeCount;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Settings") {
            iconName = focused ? "settings" : "settings-outline";
          } else if (route.name === "Services") {
            iconName = focused ? "trash" : "trash-outline";
          } else if (route.name === "Notifications") {
            iconName = focused ? "mail" : "mail-outline";
          } else if (route.name === "Community") {
            iconName = focused ? "people" : "people-outline";
          }

          return (
            <View>
              <Ionicons name={iconName} size={size} color={color} />
            </View>
          );
        },
        tabBarActiveTintColor: "#3b6d3b",
        tabBarInactiveTintColor: "gray",
        headerShown: false, // Removes headers from all tab screens
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Community" component={CommunityScreen} />
      <Tab.Screen name="Services" component={ServiceScreen} />
      {/* <Tab.Screen name="Notifications" component={NotificationsScreen} /> */}
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

// Root Navigator (combining AuthStack and MainTabNavigator)
function RootNavigator() {
  const { UserToken } = useContext(AuthContext);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {UserToken !== null ? (
        <>
          <Stack.Screen name="Main" component={MainTabNavigator} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
          <Stack.Screen name="Security" component={SecurityScreen} />
          <Stack.Screen name="Report" component={ReportScreen} />
          <Stack.Screen name="Privacy" component={PrivacyScreen} />
          <Stack.Screen name="Support" component={SupportScreen} />
          <Stack.Screen name="Aquila" component={Aquila} />
          <Stack.Screen name="Armstrong" component={Armstrong} />
          <Stack.Screen name="Asante" component={Asante} />
          <Stack.Screen name="Best" component={Best} />
          <Stack.Screen name="Bins" component={Bins} />
          <Stack.Screen name="DeWaste" component={DeWaste} />
          <Stack.Screen name="Nabugabo" component={Nabugabo} />
          <Stack.Screen name="Swift" component={Swift} />
          <Stack.Screen name="YoWaste" component={YoWaste} />
          <Stack.Screen name="Sale" component={SaleScreen} />
          <Stack.Screen name="Reminder" component={TrashReminder} />
          <Stack.Screen name="Tips" component={Tips} />
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
}

// Main App Component
export default function Nav() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}
