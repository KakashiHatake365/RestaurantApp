import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Image, Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { MenuItem } from "../data/menu";
import { theme } from "../lib/theme";

interface DishCardProps {
  item: MenuItem;
  onAdd?: (item: MenuItem) => void;
}

export function DishCard({ item, onAdd }: DishCardProps) {
  const router = useRouter();

  return (
    <Pressable 
      style={theme.menuCard}
      onPress={() => router.push({
        pathname: "/dish/[id]",
        params: { id: item.id }
      })}
    >
      {item.image ? (
        <View style={{ position: "relative" }}>
          <Image source={{ uri: item.image }} style={{ width: 100, height: 100, borderRadius: 20 }} />
          {item.isVegetarian && (
            <View
              style={{
                position: "absolute",
                top: 8,
                left: 8,
                backgroundColor: theme.colors.success,
                width: 12,
                height: 12,
                borderRadius: 6,
                borderWidth: 2,
                borderColor: "#fff",
              }}
            />
          )}
        </View>
      ) : null}
      
      <View style={{ flex: 1, paddingVertical: 4 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={theme.cardTitle} numberOfLines={1}>{item.name}</Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <MaterialCommunityIcons name="star" size={14} color="#FFB800" />
              <Text style={[theme.bodyText, { fontSize: 13, fontWeight: "600" }]}>4.8</Text>
              <Text style={[theme.bodyText, { fontSize: 13, opacity: 0.6 }]}>• 20m prep</Text>
            </View>
          </View>
          <Text style={theme.priceText}>${item.price.toFixed(2)}</Text>
        </View>

        <Text style={[theme.bodyText, { fontSize: 13, marginTop: 4 }]} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
          <View style={{ flexDirection: "row", gap: 6 }}>
            {typeof item.spicyLevel === "number" && (
              <View style={[theme.badge, { backgroundColor: "#FFF0F0" }]}>
                {Array.from({ length: item.spicyLevel }).map((_, i) => (
                  <MaterialCommunityIcons key={i} name="fire" size={12} color={theme.colors.primary} />
                ))}
              </View>
            )}
            <View style={theme.badge}>
              <Text style={[theme.badgeText, { fontSize: 11 }]}>{item.category}</Text>
            </View>
          </View>

          {onAdd && (
            <Pressable 
              style={theme.iconButton} 
              onPress={(e) => {
                e.stopPropagation();
                onAdd(item);
              }}
              hitSlop={10}
            >
              <MaterialCommunityIcons name="plus" size={24} color="#FFF" />
            </Pressable>
          )}
        </View>
      </View>
    </Pressable>
  );
}




