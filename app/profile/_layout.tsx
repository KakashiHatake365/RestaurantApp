import { Stack } from "expo-router";
import { theme } from "../../lib/theme";

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.page,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: "800",
          fontSize: 20,
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ title: "My Profile" }} 
      />
      <Stack.Screen 
        name="notifications" 
        options={{ title: "Notifications" }} 
      />
      <Stack.Screen 
        name="addresses" 
        options={{ title: "Saved Addresses" }} 
      />
      <Stack.Screen 
        name="edit" 
        options={{ 
          title: "Edit Profile",
          presentation: "modal", // Native modal feel
        }} 
      />
    </Stack>
  );
}


