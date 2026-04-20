import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Linking, Pressable, Text, View } from "react-native";
import { Screen } from "../../components/Screen";
import { SectionCard } from "../../components/SectionCard";
import { storeHours, storeProfile } from "../../data/store";
import { theme } from "../../lib/theme";

export default function LocationScreen() {
  const openMaps = () => {
    void Linking.openURL(storeProfile.mapUrl);
  };

  const callStore = () => {
    void Linking.openURL(`tel:${storeProfile.phoneDial}`);
  };

  return (
    <Screen>
      <View style={{ gap: 6 }}>
        <Text style={theme.screenTitle}>Location</Text>
        <Text style={theme.screenSubtitle}>Everything a pickup customer needs without leaving the app.</Text>
      </View>

      <SectionCard title={storeProfile.name} subtitle="Mississauga flagship">
        <View style={{ gap: 14 }}>
          <View style={theme.mapCard}>
            <MaterialCommunityIcons name="map-marker-radius-outline" size={34} color={theme.colors.primary} />
            <Text style={theme.cardTitle}>Pickup Counter Ready</Text>
            <Text style={[theme.bodyText, { textAlign: "center" }]}>{storeProfile.address}</Text>
          </View>

          <View style={{ gap: 10 }}>
            <View style={theme.rowCard}>
              <MaterialCommunityIcons name="phone-outline" size={20} color={theme.colors.primary} />
              <Text style={theme.bodyText}>{storeProfile.phone}</Text>
            </View>
            <View style={theme.rowCard}>
              <MaterialCommunityIcons name="clock-outline" size={20} color={theme.colors.primary} />
              <Text style={theme.bodyText}>Pickup timing usually 20 to 30 minutes</Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", gap: 12 }}>
            <Pressable style={[theme.primaryButton, { flex: 1 }]} onPress={openMaps}>
              <Text style={theme.primaryButtonText}>Open Maps</Text>
            </Pressable>
            <Pressable style={[theme.secondaryButton, { flex: 1 }]} onPress={callStore}>
              <Text style={theme.secondaryButtonText}>Call Store</Text>
            </Pressable>
          </View>
        </View>
      </SectionCard>

      <SectionCard title="Hours" subtitle="Displayed the way a customer would scan them on mobile.">
        <View style={{ gap: 10 }}>
          {storeHours.map((entry) => (
            <View key={entry.day} style={{ flexDirection: "row", justifyContent: "space-between", paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: theme.colors.border }}>
              <Text style={theme.rowTitle}>{entry.day}</Text>
              <Text style={theme.bodyText}>{entry.hours}</Text>
            </View>
          ))}
        </View>
      </SectionCard>
    </Screen>
  );
}


