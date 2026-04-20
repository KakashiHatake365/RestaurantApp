import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppProviders } from "../components/AppProviders";
import { theme } from "../lib/theme";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppProviders>
        <StatusBar style="dark" backgroundColor={theme.colors.page} />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.colors.page } }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="profile" options={{ presentation: "modal", headerShown: false }} />
          <Stack.Screen name="checkout" options={{ presentation: "modal", headerShown: false }} />
          <Stack.Screen name="order-status/[orderId]" options={{ headerShown: false }} />
        </Stack>
      </AppProviders>
    </SafeAreaProvider>
  );
}


