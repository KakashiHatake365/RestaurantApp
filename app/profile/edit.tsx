import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View, ActivityIndicator } from "react-native";
import { useRouter, Stack } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { theme } from "../../lib/theme";

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.displayName || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Name cannot be empty.");
      return;
    }
    setLoading(true);
    try {
      await updateProfile(name.trim());
      router.back();
    } catch (error) {
      Alert.alert("Error", "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          headerRight: () => (
            <Pressable 
              onPress={handleSave} 
              disabled={loading}
              style={({ pressed }) => [
                styles.saveBtn,
                pressed && { opacity: 0.7 }
              ]}
            >
              {loading ? (
                <ActivityIndicator size="small" color={theme.colors.primary} />
              ) : (
                <Text style={styles.saveText}>Save</Text>
              )}
            </Pressable>
          )
        }}
      />

      <View style={styles.form}>
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{name.charAt(0) || user?.displayName.charAt(0)}</Text>
          </View>
          <Text style={styles.avatarLabel}>Tap to change photo (Disabled)</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Display Name</Text>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="account-outline" size={20} color={theme.colors.muted} />
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              autoFocus
              placeholderTextColor={theme.colors.muted}
            />
          </View>
          <Text style={styles.helperText}>This is how your name will appear in orders and rewards.</Text>
        </View>

        <View style={[styles.inputGroup, { opacity: 0.6 }]}>
          <Text style={styles.label}>Email Address (Read-only)</Text>
          <View style={[styles.inputContainer, { backgroundColor: theme.colors.surfaceAlt, borderColor: "transparent" }]}>
            <MaterialCommunityIcons name="email-outline" size={20} color={theme.colors.muted} />
            <Text style={styles.readOnlyText}>{user?.email}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.page,
  },
  saveBtn: {
    paddingHorizontal: 12,
  },
  saveText: {
    fontSize: 17,
    fontWeight: "700",
    color: theme.colors.primary,
  },
  form: {
    padding: 24,
    gap: 32,
  },
  avatarSection: {
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 40,
    fontWeight: "800",
    color: "#FFF",
  },
  avatarLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.muted,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.text,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingHorizontal: 16,
    borderRadius: 20,
    height: 56,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    gap: 12,
  },
  input: {
    fontSize: 16,
    color: theme.colors.text,
    flex: 1,
    fontWeight: "600",
  },
  readOnlyText: {
    fontSize: 16,
    color: theme.colors.muted,
    flex: 1,
    fontWeight: "500",
  },
  helperText: {
    fontSize: 12,
    color: theme.colors.muted,
    marginLeft: 4,
    lineHeight: 18,
  }
});


