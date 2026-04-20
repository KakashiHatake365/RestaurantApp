import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { Pressable } from "react-native";
import { theme } from "../lib/theme";

export function ProfileButton() {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push("/profile/" as any)}
      style={{ marginRight: 12, width: 38, height: 38, borderRadius: 19, backgroundColor: theme.colors.surfaceAlt, alignItems: "center", justifyContent: "center" }}
    >
      <MaterialCommunityIcons name="account-circle-outline" size={22} color={theme.colors.primary} />
    </Pressable>
  );
}


