import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { Image, Pressable, ScrollView, Text, View, StyleSheet } from "react-native";
import { FloatingCartBar } from "../../components/FloatingCartBar";
import { Screen } from "../../components/Screen";
import { SectionCard } from "../../components/SectionCard";
import { useAuth } from "../../context/AuthContext";
import { useOrder } from "../../context/OrderContext";
import { MenuItem, menuItems } from "../../data/menu";
import { storeProfile } from "../../data/store";
import { theme } from "../../lib/theme";
import { fetchRemoteMenu } from "../../lib/api";
import { useEffect, useState } from "react";

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { recentOrders, addToCart } = useOrder();
  const [recommendations, setRecommendations] = useState<MenuItem[]>(menuItems.slice(0, 4));

  useEffect(() => {
    async function loadDynamicRecs() {
      const liveMenu = await fetchRemoteMenu();
      if (liveMenu.length > 0) {
        setRecommendations(liveMenu.slice(0, 4));
      }
    }
    loadDynamicRecs();
  }, []);

  const lastOrder = recentOrders[0];

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.page }}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>
              {user ? "Good for you," : "Welcome to"}
            </Text>
            <Text style={theme.screenTitle}>
              {user?.displayName ?? "RestaurantApp"}
            </Text>
          </View>
          <Pressable 
            style={styles.profileBtn}
            onPress={() => router.push("/profile/" as any)}
            hitSlop={8}
          >
            <View style={styles.avatarMini}>
              <Text style={styles.avatarMiniText}>
                {user?.displayName ? user.displayName.charAt(0) : "?"}
              </Text>
            </View>
          </Pressable>
        </View>

        {!user && (
          <Pressable 
            style={styles.onboardingBanner}
            onPress={() => router.push("/profile?mode=register" as any)}
          >
            <View style={{ flex: 1 }}>
              <Text style={styles.onboardingTitle}>Unlock Rewards</Text>
              <Text style={styles.onboardingText}>Join now to earn points on every order.</Text>
            </View>
            <View style={styles.onboardingAction}>
              <Text style={styles.onboardingActionText}>Join</Text>
            </View>
          </Pressable>
        )}

        <View style={[theme.hero, styles.heroMargin]}>
          <View style={{ flex: 1 }}>
            <View style={styles.heroBadge}>
              <MaterialCommunityIcons name="lightning-bolt" size={14} color="#FFD700" />
              <Text style={styles.heroBadgeText}>FASTEST PICKUP</Text>
            </View>
            <Text style={theme.heroTitle}>Authentic flavors, ready for you.</Text>
            <Text style={styles.heroSubtitle}>Freshly prepared and packed with spice.</Text>
            <Pressable 
              style={[theme.primaryButton, styles.heroCTA]}
              onPress={() => router.push("/menu")}
            >
              <Text style={theme.primaryButtonText}>Start Order</Text>
            </Pressable>
          </View>
          <Image 
            source={{ uri: "https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?q=80&w=400" }} 
            style={styles.heroImage}
          />
        </View>

        {lastOrder && (
          <SectionCard title="Order Again" subtitle="One-tap reorder of your favorites">
            <View style={styles.reorderCard}>
              <View style={{ flex: 1 }}>
                <Text style={theme.cardTitle}>{lastOrder.items[0].name}</Text>
                <Text style={theme.bodyText}>{lastOrder.items.length} items • {lastOrder.total}</Text>
              </View>
              <Pressable 
                style={theme.iconButton}
                onPress={() => {
                  lastOrder.items.forEach(item => {
                    if (item.sourceItem) addToCart(item.sourceItem);
                  });
                  router.push("/menu");
                }}
              >
                <MaterialCommunityIcons name="repeat" size={24} color="#FFF" />
              </Pressable>
            </View>
          </SectionCard>
        )}

        <View style={styles.sectionHeader}>
          <Text style={theme.sectionTitle}>Popular Dishes</Text>
          <Pressable onPress={() => router.push("/menu")} hitSlop={10}>
            <Text style={styles.seeAllText}>Browse All</Text>
          </Pressable>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScroll}
        >
          {recommendations.map((item) => (
            <Pressable 
              key={item.id} 
              style={styles.recommendationCard}
              onPress={() => router.push("/menu")}
            >
              <Image source={{ uri: item.image }} style={styles.recImage} />
              <View style={styles.recContent}>
                <Text style={styles.recTitle} numberOfLines={1}>{item.name}</Text>
                <View style={styles.recFooter}>
                  <Text style={theme.priceText}>${item.price.toFixed(2)}</Text>
                  <View style={styles.ratingBadge}>
                    <MaterialCommunityIcons name="star" size={14} color="#FFB800" />
                    <Text style={styles.ratingText}>4.8</Text>
                  </View>
                </View>
              </View>
            </Pressable>
          ))}
        </ScrollView>

        <SectionCard title="Store Snapshot" subtitle="Fastest pickup in Mississauga">
          <View style={styles.storeCard}>
            <View style={styles.storeIcon}>
              <MaterialCommunityIcons name="map-marker" size={24} color={theme.colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={theme.cardTitle}>{storeProfile.name}</Text>
              <Text style={theme.bodyText}>{storeProfile.address}</Text>
            </View>
          </View>
          <View style={styles.badgeContainer}>
            <View style={theme.badge}>
              <MaterialCommunityIcons name="clock-outline" size={14} color={theme.colors.primary} />
              <Text style={theme.badgeText}>Open until 10 PM</Text>
            </View>
            <View style={theme.badge}>
              <MaterialCommunityIcons name="moped-outline" size={14} color={theme.colors.primary} />
              <Text style={theme.badgeText}>Direct Pickup</Text>
            </View>
          </View>
        </SectionCard>
      </ScrollView>

      <FloatingCartBar />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 64,
    paddingBottom: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.muted,
    marginBottom: 2,
  },
  profileBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  avatarMini: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarMiniText: {
    color: "#FFF",
    fontWeight: "800",
    fontSize: 14,
  },
  onboardingBanner: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: theme.colors.primary,
    padding: 20,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
  },
  onboardingTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 4,
  },
  onboardingText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    fontWeight: "500",
  },
  onboardingAction: {
    backgroundColor: "#FFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  onboardingActionText: {
    color: theme.colors.primary,
    fontWeight: "800",
    fontSize: 14,
  },
  heroMargin: {
    marginHorizontal: 20,
    marginBottom: 32,
    flexDirection: "row",
    alignItems: "center",
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,215,0,0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: "flex-start",
    marginBottom: 12,
    gap: 4,
  },
  heroBadgeText: {
    color: "#FFD700",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
  },
  heroSubtitle: {
    color: "rgba(232, 228, 217, 0.7)",
    fontSize: 14,
    marginTop: 8,
    lineHeight: 20,
  },
  heroCTA: {
    marginTop: 20,
    alignSelf: "flex-start",
    paddingHorizontal: 32,
  },
  heroImage: {
    width: 130,
    height: 130,
    borderRadius: 24,
    marginLeft: 12,
    transform: [{ rotate: "8deg" }],
  },
  reorderCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surfaceAlt,
    padding: 20,
    borderRadius: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    marginBottom: 20,
    marginTop: 8,
  },
  seeAllText: {
    color: theme.colors.primary,
    fontWeight: "700",
    fontSize: 15,
  },
  horizontalScroll: {
    paddingLeft: 20,
    paddingRight: 10,
    paddingBottom: 32,
    gap: 16,
  },
  recommendationCard: {
    width: 200,
    backgroundColor: "#FFF",
    borderRadius: 28,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: "hidden",
  },
  recImage: {
    width: "100%",
    height: 130,
  },
  recContent: {
    padding: 16,
    gap: 6,
  },
  recTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text,
  },
  recFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.text,
  },
  topRatedContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  compactCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 16,
  },
  compactImage: {
    width: 64,
    height: 64,
    borderRadius: 16,
  },
  compactTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text,
  },
  compactSubtitle: {
    fontSize: 13,
    color: theme.colors.muted,
  },
  storeCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 20,
  },
  storeIcon: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: theme.colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
});


