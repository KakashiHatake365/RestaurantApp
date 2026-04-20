import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { Alert, Pressable, Text } from "react-native";
import { useAuth } from "../context/AuthContext";
import { useOrder } from "../context/OrderContext";
import { theme } from "../lib/theme";

export function CheckoutButton() {
  const router = useRouter();
  const { user } = useAuth();
  const { cartCount } = useOrder();

  if (!cartCount) {
    return null;
  }

  const handlePress = () => {
    if (!user) {
      Alert.alert("Login required", "Open your profile and sign in before placing a mobile order.", [
        { text: "Cancel", style: "cancel" },
        { text: "Go to profile", onPress: () => router.push("/profile") },
      ]);
      return;
    }

    router.push("/checkout");
  };

  return (
    <Pressable
      onPress={handlePress}
      style={{
        marginRight: 10,
        minWidth: 74,
        height: 38,
        borderRadius: 19,
        backgroundColor: theme.colors.primary,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 6,
        paddingHorizontal: 12,
      }}
    >
      <MaterialCommunityIcons name="cart-outline" size={18} color={theme.colors.surface} />
      <Text style={{ color: theme.colors.surface, fontWeight: "800", fontSize: 12 }}>{cartCount}</Text>
    </Pressable>
  );
}


