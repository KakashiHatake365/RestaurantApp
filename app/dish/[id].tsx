import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, Pressable, ScrollView, StyleSheet, Text, View, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useOrder } from "../../context/OrderContext";
import { theme } from "../../lib/theme";
import { fetchRemoteMenu } from "../../lib/api";
import { MenuItem, menuItems } from "../../data/menu";
import { useRef, useEffect, useState } from "react";

export default function DishDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { addToCart } = useOrder();

  const [dish, setDish] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    async function resolveDish() {
      // 1. Check local static first (for speed)
      const localDish = (await import("../../data/menu")).menuItems.find(m => m.id === id);
      if (localDish) {
        setDish(localDish);
        setLoading(false);
        return;
      }

      // 2. Fallback to API
      try {
        const liveMenu = await fetchRemoteMenu();
        const liveDish = liveMenu.find(m => m.id === id);
        if (liveDish) {
          setDish(liveDish);
        }
      } catch (error) {
        console.error("Failed to resolve dynamic dish:", error);
      } finally {
        setLoading(false);
      }
    }
    resolveDish();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={theme.bodyText}>Loading dish details...</Text>
      </View>
    );
  }

  if (!dish) {
    return (
      <View style={styles.center}>
        <Text style={theme.sectionTitle}>Dish not found</Text>
        <Pressable onPress={() => router.back()} style={theme.primaryButton}>
          <Text style={theme.primaryButtonText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [400, 250],
    extrapolate: "clamp",
  });

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [1, 0.4],
    extrapolate: "clamp",
  });

  const pairings = menuItems.filter(item => item.category === "Appetizers" && item.id !== dish.id).slice(0, 2);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.page }}>
      <Animated.View style={[styles.headerContainer, { height: headerHeight }]}>
        <Animated.Image
          source={{ uri: dish.image }}
          style={[styles.heroImage, { opacity: imageOpacity }]}
        />
        <View style={styles.navHeader}>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
          </Pressable>
        </View>
      </Animated.View>

      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        contentContainerStyle={styles.contentScroll}
      >
        <View style={styles.detailsCard}>
          <View style={styles.titleRow}>
            <View style={{ flex: 1, marginRight: 12 }}>
              <Text style={[theme.screenTitle, { fontSize: 18 }]} numberOfLines={1} ellipsizeMode="tail">{dish.name}</Text>
              <View style={styles.metaRow}>
                <View style={theme.badge}>
                  <MaterialCommunityIcons name="star" size={14} color="#FFB800" />
                  <Text style={theme.badgeText}>4.8 (120+ reviews)</Text>
                </View>
                {dish.isVegetarian && (
                  <View style={[theme.badge, { backgroundColor: "#E8F5E9" }]}>
                    <MaterialCommunityIcons name="leaf" size={14} color="#2E7D32" />
                    <Text style={[theme.badgeText, { color: "#2E7D32" }]}>Veg</Text>
                  </View>
                )}
              </View>
            </View>
            <Text style={styles.priceLarge}>${dish.price.toFixed(2)}</Text>
          </View>

          <Text style={styles.descriptionText}>{dish.description}</Text>

          <View style={styles.spiceSection}>
            <Text style={theme.sectionTitle}>Spice Level</Text>
            <View style={styles.spiceRow}>
              {[1, 2, 3, 4, 5].map((level) => (
                <View
                  key={level}
                  style={[
                    styles.spiceBar,
                    level <= (dish.spicyLevel || 1) ? styles.spiceActive : null
                  ]}
                />
              ))}
              <Text style={styles.spiceText}>
                {dish.spicyLevel === 5 ? "Extra Fiery" : dish.spicyLevel === 1 ? "Mild" : "Warm"}
              </Text>
            </View>
          </View>

          <View style={styles.pairingSection}>
            <Text style={theme.sectionTitle}>Perfect Pairings</Text>
            <View style={{ gap: 12, marginTop: 12 }}>
              {pairings.map(item => (
                <Pressable
                  key={item.id}
                  style={styles.pairingCard}
                  onPress={() => addToCart(item)}
                >
                  <Image source={{ uri: item.image }} style={styles.pairingImg} />
                  <View style={{ flex: 1 }}>
                    <Text style={theme.rowTitle}>{item.name}</Text>
                    <Text style={theme.priceText}>+${item.price.toFixed(2)}</Text>
                  </View>
                  <MaterialCommunityIcons name="plus-circle-outline" size={24} color={theme.colors.primary} />
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </Animated.ScrollView>

      <View style={styles.bottomBar}>
        <Pressable
          style={styles.checkoutBtn}
          onPress={() => {
            addToCart(dish);
            router.push("/menu");
          }}
        >
          <Text style={styles.checkoutBtnText}>Add to Order • ${dish.price.toFixed(2)}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.page,
  },
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    overflow: "hidden",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  navHeader: {
    position: "absolute",
    top: 60,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  contentScroll: {
    paddingTop: 380,
    paddingBottom: 120,
  },
  detailsCard: {
    backgroundColor: theme.colors.page,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 24,
    minHeight: 600,
    ...theme.shadows.lg,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  metaRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  priceLarge: {
    fontSize: 28,
    fontWeight: "800",
    color: theme.colors.primary,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 25,
    color: theme.colors.text,
    opacity: 0.8,
    marginBottom: 32,
  },
  spiceSection: {
    marginBottom: 32,
  },
  spiceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 12,
  },
  spiceBar: {
    height: 8,
    width: 40,
    borderRadius: 4,
    backgroundColor: theme.colors.surfaceAlt,
  },
  spiceActive: {
    backgroundColor: "#FF5252",
  },
  spiceText: {
    marginLeft: 12,
    fontSize: 14,
    fontWeight: "700",
    color: "#FF5252",
  },
  pairingSection: {
    marginBottom: 24,
  },
  pairingCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    padding: 12,
    borderRadius: 20,
    gap: 16,
    ...theme.shadows.sm,
  },
  pairingImg: {
    width: 60,
    height: 60,
    borderRadius: 14,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.page,
    padding: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  checkoutBtn: {
    backgroundColor: theme.colors.text,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    ...theme.shadows.lg,
  },
  checkoutBtnText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "800",
  },
});

