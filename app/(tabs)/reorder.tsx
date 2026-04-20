import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Alert, Image, Pressable, ScrollView, Text, View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { FloatingCartBar } from "../../components/FloatingCartBar";
import { Screen } from "../../components/Screen";
import { useAuth } from "../../context/AuthContext";
import { useOrder } from "../../context/OrderContext";
import { theme } from "../../lib/theme";

export default function ReorderScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { recentOrders, addToCart } = useOrder();

  const handleReorder = (order: (typeof recentOrders)[number]) => {
    if (!user) {
      Alert.alert("Login required", "Sign in from the profile button before using reorder.", [
        { text: "Cancel", style: "cancel" },
        { text: "Go to profile", onPress: () => router.push("/profile" as any) },
      ]);
      return;
    }

    order.items.forEach(item => {
      if (item.sourceItem) addToCart(item.sourceItem);
    });
    
    Alert.alert("Added to cart", "Your previous order has been added to your current bag.");
    router.push("/menu");
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.page }}>
      <ScrollView 
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={theme.screenTitle}>Reorder</Text>
          <Text style={theme.screenSubtitle}>Based on your recent pickup history</Text>
        </View>

        {recentOrders.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="history" size={80} color={theme.colors.surfaceAlt} />
            <Text style={theme.sectionTitle}>No orders yet</Text>
            <Text style={[theme.bodyText, { textAlign: "center" }]}>
              Your past orders will appear here for quick reordering.
            </Text>
            <View style={{ width: "100%", alignItems: "center", marginTop: 32 }}>
              <Pressable 
                style={[theme.primaryButton, { paddingHorizontal: 40 }]}
                onPress={() => router.push("/menu")}
              >
                <Text style={theme.primaryButtonText}>Browse Menu</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <View style={{ paddingHorizontal: 20, gap: 24 }}>
            {recentOrders.map((order, index) => (
              <View key={order.id} style={[theme.sectionCard, { marginBottom: 0 }]}>
                <View style={styles.orderHeader}>
                  <View>
                    <Text style={theme.rowTitle}>{order.date}</Text>
                    <Text style={theme.bodyText}>{order.items.length} items • {order.total}</Text>
                  </View>
                  {index === 0 && (
                    <View style={[theme.badge, { backgroundColor: "#FFF8E1" }]}>
                      <MaterialCommunityIcons name="star" size={12} color="#FFA000" />
                      <Text style={[theme.badgeText, { color: "#FFA000" }]}>MOST RECENT</Text>
                    </View>
                  )}
                </View>

                <View style={styles.itemPreview}>
                  {order.items.slice(0, 3).map((item, idx) => (
                    <View key={`${order.id}-${idx}`} style={styles.itemBubble}>
                      <Image source={{ uri: item.image }} style={styles.itemImage} />
                      <Text style={styles.itemCount} numberOfLines={1}>{item.name}</Text>
                    </View>
                  ))}
                  {order.items.length > 3 && (
                    <View style={styles.moreBubble}>
                      <Text style={styles.moreText}>+{order.items.length - 3}</Text>
                    </View>
                  )}
                </View>

                <Pressable 
                  style={[theme.primaryButton, styles.reorderBtn]}
                  onPress={() => handleReorder(order)}
                >
                  <MaterialCommunityIcons name="repeat" size={20} color="#FFF" />
                  <Text style={theme.primaryButtonText}>Reorder in 1 Tap</Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <FloatingCartBar />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 4,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100,
    paddingHorizontal: 40,
    gap: 8,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  itemPreview: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
    flexWrap: "wrap",
  },
  itemBubble: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: 12,
    paddingRight: 10,
    gap: 8,
  },
  itemImage: {
    width: 32,
    height: 32,
    borderRadius: 8,
  },
  itemCount: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.text,
    maxWidth: 80,
  },
  moreBubble: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  moreText: {
    fontSize: 11,
    fontWeight: "700",
    color: theme.colors.muted,
  },
  reorderBtn: {
    flexDirection: "row",
    gap: 8,
  },
});



