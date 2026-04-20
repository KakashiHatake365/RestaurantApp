import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useEffect, useState, useMemo } from "react";
import { Alert, Pressable, ScrollView, Text, View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { FloatingCartBar } from "../../components/FloatingCartBar";
import { Screen } from "../../components/Screen";
import { SectionCard } from "../../components/SectionCard";
import { useAuth } from "../../context/AuthContext";
import { rewardPerks, type RewardCatalogItem } from "../../data/rewards";
import { getRewardCatalog, getRewardRedemptions, type RewardRedemptionRecord } from "../../lib/database";
import { theme } from "../../lib/theme";

export default function RewardsScreen() {
  const router = useRouter();
  const { user, redeemReward } = useAuth();
  const [catalog, setCatalog] = useState<RewardCatalogItem[]>([]);
  const [redemptions, setRedemptions] = useState<RewardRedemptionRecord[]>([]);

  useEffect(() => {
    let active = true;
    const loadRewards = async () => {
      const rewards = await getRewardCatalog();
      if (active) setCatalog(rewards);
      if (user) {
        const history = await getRewardRedemptions(user.id);
        if (active) setRedemptions(history);
      }
    };
    void loadRewards();
    return () => { active = false; };
  }, [user]);

  const progress = useMemo(() => {
    if (!user) return 0;
    const nextMilestone = catalog.find(r => r.pointsCost > user.points)?.pointsCost || 500;
    return Math.min(100, (user.points / nextMilestone) * 100);
  }, [user, catalog]);

  const handleRedeem = async (reward: RewardCatalogItem) => {
    try {
      if (!user) return;
      await redeemReward(reward);
      const history = await getRewardRedemptions(user.id);
      setRedemptions(history);
      Alert.alert("Claimed!", `${reward.title} has been added to your account.`);
    } catch (error) {
      Alert.alert("Error", error instanceof Error ? error.message : "Unable to redeem.");
    }
  };

  if (!user) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.page }}>
        <View style={styles.header}>
          <Text style={theme.typography.display}>Rewards</Text>
        </View>
        <View style={styles.guestState}>
          <View style={styles.guestIconCircle}>
            <MaterialCommunityIcons name="gift" size={48} color={theme.colors.primary} />
          </View>
          <Text style={theme.typography.h1}>Join the Program</Text>
          <Text style={styles.guestText}>
            Earn points with every bite and unlock free drinks, appetizers, and more.
          </Text>
          <Pressable 
            style={[theme.primaryButton, styles.guestCTA]}
            onPress={() => router.push("/profile" as any)}
          >
            <Text style={theme.primaryButtonText}>Sign In / Join Now</Text>
          </Pressable>
        </View>
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
          <Text style={theme.screenTitle}>My Rewards</Text>
        </View>

        <View style={styles.pointsHero}>
          <View style={styles.pointsRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.pointsLabel}>Balance</Text>
              <View style={{ flexDirection: "row", alignItems: "baseline", gap: 4 }}>
                <Text style={styles.pointsValue}>{user.points}</Text>
                <Text style={styles.pointsUnit}>PTS</Text>
              </View>
            </View>
            <View style={styles.pointsIcon}>
              <MaterialCommunityIcons name="ticket-percent" size={32} color="#FFD700" />
            </View>
          </View>
          
          <View style={styles.progressSection}>
            <View style={styles.milestoneRow}>
              <Text style={styles.milestoneText}>Next Reward</Text>
              <Text style={styles.milestoneTarget}>{Math.ceil(progress)}%</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
          </View>
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          <Text style={[theme.sectionTitle, { marginBottom: 16 }]}>Redeem Items</Text>
          <View style={styles.catalogGrid}>
            {catalog.map((reward) => {
              const canRedeem = user.points >= reward.pointsCost;
              return (
                <Pressable 
                  key={reward.id} 
                  style={[styles.rewardCard, !canRedeem && { opacity: 0.7 }]}
                  onPress={() => canRedeem && handleRedeem(reward)}
                >
                  <View style={[styles.rewardIcon, { backgroundColor: canRedeem ? theme.colors.primary : theme.colors.surfaceAlt }]}>
                    <MaterialCommunityIcons name={reward.icon as any} size={28} color={canRedeem ? "#FFF" : theme.colors.muted} />
                  </View>
                  <Text style={styles.rewardTitle} numberOfLines={1}>{reward.title}</Text>
                  <View style={styles.rewardFooter}>
                    <Text style={styles.rewardCost}>{reward.pointsCost} pts</Text>
                    {canRedeem ? (
                      <View style={styles.redeemCircle}>
                        <MaterialCommunityIcons name="arrow-right" size={14} color="#FFF" />
                      </View>
                    ) : (
                      <MaterialCommunityIcons name="lock" size={14} color={theme.colors.muted} />
                    )}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        <SectionCard title="History" subtitle="Your recently claimed rewards">
          {redemptions.length > 0 ? (
             redemptions.map((entry) => (
              <View key={entry.id} style={styles.historyRow}>
                <View>
                  <Text style={theme.rowTitle}>{entry.rewardTitle}</Text>
                  <Text style={styles.historyDate}>{new Date(entry.redeemedAt).toLocaleDateString()}</Text>
                </View>
                <View style={[theme.badge, { backgroundColor: entry.status === "available" ? "#E8F5E9" : "#F5F5F5" }]}>
                  <Text style={[theme.badgeText, { color: entry.status === "available" ? "#2E7D32" : "#9E9E9E" }]}>
                    {entry.status.toUpperCase()}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={[theme.bodyText, { textAlign: "center", paddingVertical: 20 }]}>No rewards claimed yet.</Text>
          )}
        </SectionCard>
      </ScrollView>

      <FloatingCartBar />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 64,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  guestState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    gap: 16,
  },
  guestIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  guestText: {
    textAlign: "center",
    fontSize: 16,
    lineHeight: 24,
    color: theme.colors.muted,
  },
  guestCTA: {
    marginTop: 16,
    width: "100%",
  },
  pointsHero: {
    marginHorizontal: 20,
    backgroundColor: theme.colors.surfaceDark,
    borderRadius: 32,
    padding: 24,
    marginBottom: 32,
    ...theme.shadows.md,
  },
  pointsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  pointsLabel: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  pointsValue: {
    color: "#FFFFFF",
    fontSize: 48,
    fontWeight: "800",
  },
  pointsUnit: {
    color: "#FFD700",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 8,
  },
  pointsIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255, 215, 0, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  progressSection: {
    width: "100%",
  },
  milestoneRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  milestoneText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    fontWeight: "600",
  },
  milestoneTarget: {
    color: "#FFD700",
    fontSize: 14,
    fontWeight: "800",
  },
  progressTrack: {
    height: 10,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#FFD700",
    borderRadius: 5,
  },
  catalogGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 32,
  },
  rewardCard: {
    width: "47%",
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  rewardIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  rewardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.colors.text,
  },
  rewardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rewardCost: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.primary,
  },
  redeemCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  historyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  historyDate: {
    fontSize: 12,
    marginTop: 2,
    color: theme.colors.muted,
  },
});



