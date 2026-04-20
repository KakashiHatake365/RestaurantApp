import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useState, useMemo } from "react";
import { Alert, Pressable, ScrollView, Text, View, StyleSheet, TextInput } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FloatingCartBar } from "../../components/FloatingCartBar";
import { Screen } from "../../components/Screen";
import { useAuth } from "../../context/AuthContext";
import { theme } from "../../lib/theme";

export default function ProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ mode?: string }>();
  const { 
    user, login, logout, register, deleteAccount, updateProfile,
    isBiometricsEnabled, toggleBiometrics, authenticateWithBiometrics 
  } = useAuth();
  const [mode, setMode] = useState<"login" | "register">(params.mode === "register" ? "register" : "login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) return;
    setLoading(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(username, email, password);
      }
      router.back();
    } catch (e) {
      Alert.alert("Error", e instanceof Error ? e.message : "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    const success = await authenticateWithBiometrics();
    if (success) {
      try {
        setLoading(true);
        // Login with default demo for now if no session found, 
        // in prod this would use a secure token
        await login("guest@restaurantapp.local", "welcome123");
        router.back();
      } catch (e) {
        Alert.alert("Error", "Biometric login failed.");
      } finally {
        setLoading(false);
      }
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      "Delete Account",
      "This will remove all your points and order history. This action is permanent.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => void deleteAccount() },
      ]
    );
  };

  if (!user) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.page }}>
         <View style={styles.header}>
          <Text style={theme.screenTitle}>{mode === "login" ? "Welcome back" : "Create Account"}</Text>
          <Text style={theme.screenSubtitle}>{mode === "login" ? "Sign in to manage your orders" : "Join our rewards program today"}</Text>
        </View>
        <ScrollView style={styles.loginForm} showsVerticalScrollIndicator={false}>
          {mode === "register" && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons name="account-outline" size={20} color={theme.colors.muted} />
                <TextInput
                  style={styles.input}
                  placeholder="John Doe"
                  value={username}
                  onChangeText={setUsername}
                  placeholderTextColor={theme.colors.muted}
                />
              </View>
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="email-outline" size={20} color={theme.colors.muted} />
              <TextInput
                style={styles.input}
                placeholder="user@example.com"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                placeholderTextColor={theme.colors.muted}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons name="lock-outline" size={20} color={theme.colors.muted} />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor={theme.colors.muted}
              />
            </View>
          </View>

          <Pressable style={theme.primaryButton} onPress={handleSubmit}>
            <Text style={theme.primaryButtonText}>{loading ? "Processing..." : mode === "login" ? "Sign In" : "Create Account"}</Text>
          </Pressable>

          <Pressable onPress={() => setMode(mode === "login" ? "register" : "login")}>
            <Text style={[theme.bodyText, { textAlign: "center", marginTop: 16 }]}>
              {mode === "login" ? "Don't have an account? " : "Already have an account? "}
              <Text style={{ color: theme.colors.primary, fontWeight: "700" }}>{mode === "login" ? "Sign up" : "Sign in"}</Text>
            </Text>
          </Pressable>

          {mode === "login" && isBiometricsEnabled && (
            <Pressable 
              style={[theme.secondaryButton, { marginTop: 24, flexDirection: "row", gap: 8 }]} 
              onPress={handleBiometricLogin}
            >
              <MaterialCommunityIcons name="face-recognition" size={20} color={theme.colors.primary} />
              <Text style={theme.secondaryButtonText}>Sign in with Face ID</Text>
            </Pressable>
          )}

          {mode === "login" && (
            <Pressable 
              style={[theme.secondaryButton, { marginTop: isBiometricsEnabled ? 16 : 40 }]} 
              onPress={() => { setEmail("guest@restaurantapp.local"); setPassword("welcome123"); }}
            >
              <Text style={theme.secondaryButtonText}>Use Demo Credentials</Text>
            </Pressable>
          )}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.page }}>
      <ScrollView 
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.profileRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user.displayName.charAt(0)}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={theme.typography.h1}>{user.displayName}</Text>
              <Text style={theme.typography.bodySecondary}>{user.email}</Text>
            </View>
            <Pressable 
              style={styles.settingsBtn} 
              onPress={() => router.push("/profile/edit" as any)}
            >
              <MaterialCommunityIcons name="pencil-outline" size={20} color={theme.colors.text} />
            </Pressable>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{user.points}</Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>Gold</Text>
            <Text style={styles.statLabel}>Tier</Text>
          </View>
        </View>

        <View style={styles.menuSection}>
          <Text style={[theme.sectionTitle, { marginLeft: 20, marginBottom: 12 }]}>Account Settings</Text>
          <View style={styles.menuContainer}>
            <ProfileMenuItem 
              icon="bell-outline" 
              label="Notifications" 
              onPress={() => router.push("/profile/notifications")} 
            />
            <ProfileMenuItem 
              icon="shield-check-outline" 
              label="Privacy & Security" 
              onPress={() => { /* Placeholder for privacy */ }} 
            />
            <ProfileMenuItem 
              icon="map-marker-outline" 
              label="Saved Addresses" 
              onPress={() => router.push("/profile/addresses" as any)} 
            />
            <View style={styles.menuItem}>
              <View style={styles.menuIcon}>
                <MaterialCommunityIcons name="face-recognition" size={22} color={theme.colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.menuLabel}>Face ID</Text>
                <Text style={styles.menuSubLabel}>{isBiometricsEnabled ? "Enabled" : "Disabled"}</Text>
              </View>
              <Pressable 
                onPress={() => toggleBiometrics(!isBiometricsEnabled)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <MaterialCommunityIcons 
                  name={isBiometricsEnabled ? "toggle-switch" : "toggle-switch-off"} 
                  size={44} 
                  color={isBiometricsEnabled ? theme.colors.primary : theme.colors.muted} 
                />
              </Pressable>
            </View>
            <ProfileMenuItem icon="help-circle-outline" label="Support" />
            <Pressable style={styles.logoutBtn} onPress={() => void logout()}>
              <MaterialCommunityIcons name="logout" size={24} color="#D32F2F" />
              <Text style={styles.logoutText}>Log Out</Text>
            </Pressable>
          </View>
        </View>

        <Pressable style={styles.deleteSection} onPress={confirmDelete}>
          <Text style={styles.deleteText}>Delete data & account</Text>
        </Pressable>
      </ScrollView>

      <FloatingCartBar />
    </View>
  );
}

function ProfileMenuItem({ icon, label, onPress }: { icon: any; label: string; onPress?: () => void }) {
  return (
    <Pressable 
      style={({ pressed }) => [styles.menuItem, pressed && { backgroundColor: theme.colors.surfaceAlt }]} 
      onPress={onPress}
    >
      <View style={styles.menuIcon}>
        <MaterialCommunityIcons name={icon} size={22} color={theme.colors.primary} />
      </View>
      <Text style={styles.menuLabel}>{label}</Text>
      <MaterialCommunityIcons name="chevron-right" size={20} color={theme.colors.muted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFF",
  },
  settingsBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "800",
    color: theme.colors.text,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.muted,
  },
  menuSection: {
    marginBottom: 24,
  },
  menuContainer: {
    backgroundColor: "#FFF",
    marginHorizontal: 20,
    borderRadius: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    gap: 12,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: theme.colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text,
  },
  menuSubLabel: {
    fontSize: 13,
    color: theme.colors.muted,
    fontWeight: "500",
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#D32F2F",
  },
  deleteSection: {
    padding: 20,
    alignItems: "center",
  },
  deleteText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.muted,
    textDecorationLine: "underline",
  },
  loginForm: {
    paddingHorizontal: 20,
  },
  inputGroup: {
    gap: 8,
    marginBottom: 20,
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
    fontWeight: "500",
  },
});


