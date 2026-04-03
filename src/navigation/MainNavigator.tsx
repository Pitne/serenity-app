import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import type { MainStackParamList, MainTabParamList } from "./types";
import { DashboardScreen } from "../screens/main/DashboardScreen";
import { MeditateScreen } from "../screens/main/MeditateScreen";
import { SleepScreen } from "../screens/main/SleepScreen";
import { JournalScreen } from "../screens/main/JournalScreen";
import { SettingsScreen } from "../screens/main/SettingsScreen";
import { NotificationScreen } from "../screens/main/NotificationScreen";

// ─── Bottom Tabs ─────────────────────────────────────────────────────────────

const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs(): React.JSX.Element {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ tabBarLabel: "Home" }}
      />
      <Tab.Screen name="Meditate" component={MeditateScreen} />
      <Tab.Screen name="Sleep" component={SleepScreen} />
      <Tab.Screen name="Journal" component={JournalScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

// ─── Main Stack (tabs + overlay screens) ─────────────────────────────────────

const Stack = createNativeStackNavigator<MainStackParamList>();

export function MainNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen
        name="Notification"
        component={NotificationScreen}
        options={{ headerShown: true, title: "Notifications" }}
      />
    </Stack.Navigator>
  );
}
