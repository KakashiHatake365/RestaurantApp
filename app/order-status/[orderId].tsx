import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useEffect, useMemo, useState } from "react";
import { Pressable, Text, View, StyleSheet, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useOrder } from "../../context/OrderContext";
import type { OrderHistoryRecord } from "../../data/orders";
import { theme } from "../../lib/theme";

const stages = [
  { key: "received", title: "Received", icon: "check-circle" as const },
  { key: "cooking", title: "Cooking", icon: "stove" as const },
  { key: "ready", title: "Ready", icon: "package-variant" as const },
];

export default function OrderStatusScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const router = useRouter();
  const { getOrderById } = useOrder();
  const [now, setNow] = useState(Date.now());
  const [order, setOrder] = useState<OrderHistoryRecord | null | undefined>(undefined);

  const pulseAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.2, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let active = true;
    const loadOrder = async () => {
      const nextOrder = await getOrderById(orderId);
      if (active) setOrder(nextOrder);
    };
    if (orderId) void loadOrder();
    return () => { active = false; };
  }, [getOrderById, orderId]);

  const activeStage = useMemo(() => {
    if (!order?.placedAt) return 0;
    const elapsed = now - new Date(order.placedAt).getTime();
    if (elapsed >= 12000) return 2;
    if (elapsed >= 4000) return 1;
    return 0;
  }, [now, order?.placedAt]);

  const timeLeft = useMemo(() => {
    if (!order?.placedAt) return "15 min";
    const elapsedSecs = Math.floor((now - new Date(order.placedAt).getTime()) / 1000);
    const totalSecs = activeStage === 2 ? 0 : activeStage === 1 ? 300 : 900;
    const remaining = Math.max(0, totalSecs - elapsedSecs);
    const mins = Math.floor(remaining / 60);
    const secs = remaining % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, [now, order?.placedAt, activeStage]);

  if (order === undefined) return null;

  if (!order) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.page }}>
        <View style={styles.container}>
          <Text style={theme.sectionTitle}>Order not found</Text>
          <Pressable onPress={() => router.replace("/menu")} style={theme.primaryButton}>
            <Text style={theme.primaryButtonText}>Back to Menu</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.page }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => router.replace("/menu")} style={styles.backBtn}>
            <MaterialCommunityIcons name="close" size={24} color={theme.colors.text} />
          </Pressable>
          <Text style={styles.headerTitle}>Order Tracking</Text>
          <View style={{ width: 44 }} />
        </View>

        <View style={styles.mainCard}>
          <Animated.View style={[styles.statusPulse, { transform: [{ scale: pulseAnim }] }]}>
            <View style={styles.statusInner}>
              <MaterialCommunityIcons
                name={stages[activeStage].icon}
                size={48}
                color={theme.colors.primary}
              />
            </View>
          </Animated.View>

          <Text style={styles.statusTitle}>{stages[activeStage].title}</Text>
          <Text style={styles.statusSubtitle}>
            {activeStage === 2 ? "Pick up at counter" : `Estimated arrival in ${timeLeft}`}
          </Text>

          <View style={styles.trackerContainer}>
            <View style={styles.trackLine}>
              <View style={[styles.trackFill, { width: `${(activeStage / 2) * 100}%` }]} />
            </View>
            <View style={styles.dotsRow}>
              {stages.map((stage, index) => (
                <View key={stage.key} style={styles.dotWrapper}>
                  <View
                    style={[
                      styles.dot,
                      index <= activeStage ? styles.dotActive : null
                    ]}
                  />
                  <Text style={[styles.dotLabel, index <= activeStage ? styles.dotLabelActive : null]}>
                    {stage.title}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={theme.sectionCard}>
          <Text style={theme.sectionTitle}>Pickup Details</Text>
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Order ID</Text>
              <Text style={styles.detailValue}>#{order.id.slice(-6).toUpperCase()}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Items</Text>
              <Text style={styles.detailValue}>{order.items.length}</Text>
            </View>
          </View>
          <View style={styles.addressBox}>
            <MaterialCommunityIcons name="store-outline" size={20} color={theme.colors.primary} />
            <View>
              <Text style={styles.storeName}>RestaurantApp</Text>
              <Text style={styles.storeAddress}>5120 Dixie Rd, Unit 14, Mississauga, ON L5R 3V3</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Pressable style={styles.helpBtn}>
            <MaterialCommunityIcons name="chat-outline" size={20} color={theme.colors.text} />
            <Text style={styles.helpBtnText}>Support</Text>
          </Pressable>
          <Pressable
            style={theme.primaryButton}
            onPress={() => router.replace("/menu")}
          >
            <Text style={theme.primaryButtonText}>Done</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: theme.colors.text,
  },
  mainCard: {
    backgroundColor: "#2A1B13",
    borderRadius: 32,
    padding: 40,
    alignItems: "center",
    ...theme.shadows.lg,
  },
  statusPulse: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(211, 84, 0, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  statusInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
  },
  statusTitle: {
    color: "#FFF",
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 8,
  },
  statusSubtitle: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 40,
  },
  trackerContainer: {
    width: "100%",
    height: 60,
    justifyContent: "center",
  },
  trackLine: {
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 2,
    width: "100%",
    position: "absolute",
  },
  trackFill: {
    height: 4,
    backgroundColor: theme.colors.primary,
    borderRadius: 2,
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  dotWrapper: {
    alignItems: "center",
    width: 80,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 2,
    borderColor: "#2A1B13",
    marginBottom: 12,
  },
  dotActive: {
    backgroundColor: theme.colors.primary,
    borderColor: "#FFF",
  },
  dotLabel: {
    color: "rgba(255, 255, 255, 0.4)",
    fontSize: 12,
    fontWeight: "700",
  },
  dotLabelActive: {
    color: "#FFF",
  },
  detailRow: {
    flexDirection: "row",
    gap: 32,
    marginTop: 16,
    marginBottom: 24,
  },
  detailItem: {
    gap: 4,
  },
  detailLabel: {
    fontSize: 12,
    color: theme.colors.muted,
    textTransform: "uppercase",
    fontWeight: "700",
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "800",
    color: theme.colors.text,
  },
  addressBox: {
    flexDirection: "row",
    backgroundColor: theme.colors.surfaceAlt,
    padding: 16,
    borderRadius: 20,
    gap: 12,
    alignItems: "center",
  },
  storeName: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.colors.text,
  },
  storeAddress: {
    fontSize: 13,
    color: theme.colors.muted,
  },
  footer: {
    flexDirection: "row",
    gap: 12,
    marginTop: "auto",
  },
  helpBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 20,
    borderRadius: 28,
    gap: 8,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
  },
  helpBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.colors.text,
  },
});

