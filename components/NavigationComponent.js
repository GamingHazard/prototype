import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthContext } from "../context/AuthContext";
import { MaterialCommunityIcons } from "../components/Imports";
import {
  WelcomeScreen,
  LoginScreen,
  RegisterScreen,
  ForgotPasswordScreen,
  ResetPasswordScreen,
  HomeScreen,
  ProfileScreen,
  SettingsScreen,
  PrivacyScreen,
  ServiceScreen,
  SecurityScreen,
  ReportScreen,
  SupportScreen,
  CommunityScreen,
  Aquila,
  Armstrong,
  Asante,
  Best,
  Bins,
  DeWaste,
  Nabugabo,
  Swift,
  YoWaste,
  SaleScreen,
  TrashReminder,
  Tips,
} from "../components/Imports"; // Importing screens from centralized file

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

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Settings") {
            iconName = focused ? "account-wrench" : "account-wrench-outline";
          } else if (route.name === "Services") {
            iconName = focused ? "dump-truck" : "dump-truck";
          } else if (route.name === "Community") {
            iconName = focused ? "account-group" : "account-group-outline";
          }

          return (
            <MaterialCommunityIcons name={iconName} size={size} color={color} />
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
