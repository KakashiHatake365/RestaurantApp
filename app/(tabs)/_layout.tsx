import type { ComponentProps } from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Tabs } from "expo-router";
import { CheckoutButton } from "../../components/CheckoutButton";
import { ProfileButton } from "../../components/ProfileButton";
import { theme } from "../../lib/theme";

const tabIcon = (name: ComponentProps<typeof MaterialCommunityIcons>["name"], color: string) => (
  <MaterialCommunityIcons name={name} size={22} color={color} />
);

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.muted,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          height: 68,
          paddingTop: 8,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
          letterSpacing: 0.4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => tabIcon("home-outline", color),
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: "Menu",
          tabBarIcon: ({ color }) => tabIcon("silverware-fork-knife", color),
        }}
      />
      <Tabs.Screen
        name="rewards"
        options={{
          title: "Rewards",
          tabBarIcon: ({ color }) => tabIcon("star-circle-outline", color),
        }}
      />
      <Tabs.Screen
        name="reorder"
        options={{
          title: "Reorder",
          tabBarIcon: ({ color }) => tabIcon("history", color),
        }}
      />
      <Tabs.Screen
        name="location"
        options={{
          title: "Location",
          tabBarIcon: ({ color }) => tabIcon("map-marker-outline", color),
        }}
      />
    </Tabs>
  );
}


