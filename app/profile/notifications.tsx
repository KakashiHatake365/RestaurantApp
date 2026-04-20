import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useState } from "react";
import { ScrollView, Switch, Text, View, StyleSheet } from "react-native";
import { theme } from "../../lib/theme";

export default function NotificationsScreen() {
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [promotions, setPromotions] = useState(false);
  const [pointsAlerts, setPointsAlerts] = useState(true);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.page }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={theme.bodyText}>Manage how you receive updates about your orders and rewards.</Text>
        
        <View style={styles.section}>
          <NotificationToggle 
            title="Order Updates" 
            subtitle="Get real-time tracking for your orders"
            value={orderUpdates}
            onToggle={setOrderUpdates}
          />
          <NotificationToggle 
            title="Promotions" 
            subtitle="Special offers and regional discounts"
            value={promotions}
            onToggle={setPromotions}
          />
          <NotificationToggle 
            title="Points Alerts" 
            subtitle="Notifications about your reward balance"
            value={pointsAlerts}
            onToggle={setPointsAlerts}
          />
        </View>

        <View style={styles.infoBox}>
          <MaterialCommunityIcons name="information-outline" size={20} color={theme.colors.muted} />
          <Text style={styles.infoText}>You can also manage notifications in your system settings.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

function NotificationToggle({ title, subtitle, value, onToggle }: any) {
  return (
    <View style={styles.toggleRow}>
      <View style={{ flex: 1 }}>
        <Text style={theme.cardTitle}>{title}</Text>
        <Text style={theme.bodyText}>{subtitle}</Text>
      </View>
      <Switch 
        value={value} 
        onValueChange={onToggle}
        trackColor={{ false: "#E8E4D9", true: theme.colors.primary }}
        thumbColor="#FFF"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: "#FFF",
    borderRadius: 24,
    marginTop: 24,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 8,
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: theme.colors.surfaceAlt,
    padding: 16,
    borderRadius: 16,
    marginTop: 32,
    gap: 12,
    alignItems: "center",
  },
  infoText: {
    fontSize: 13,
    color: theme.colors.muted,
    flex: 1,
  }
});


