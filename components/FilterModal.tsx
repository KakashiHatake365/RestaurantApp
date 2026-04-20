import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View, Switch, Platform } from "react-native";
import { theme } from "../lib/theme";

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  selectedCategory: string | null;
  onSelectCategory: (cat: string | null) => void;
  categories: string[];
  selectedSpice: number | null;
  onSelectSpice: (level: number | null) => void;
  isVeg: boolean;
  onToggleVeg: (val: boolean) => void;
  maxPrice: number | null;
  onSelectPrice: (price: number | null) => void;
  activeCount: number;
  onClearAll: () => void;
}

export function FilterModal({
  visible,
  onClose,
  selectedCategory,
  onSelectCategory,
  categories,
  selectedSpice,
  onSelectSpice,
  isVeg,
  onToggleVeg,
  maxPrice,
  onSelectPrice,
  activeCount,
  onClearAll
}: FilterModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>Filters</Text>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <MaterialCommunityIcons name="close" size={24} color={theme.colors.text} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Spice Level Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Spice Level</Text>
              <View style={styles.spiceContainer}>
                {[
                  { label: "Mild", level: 1, icon: "chili-mild" },
                  { label: "Medium", level: 2, icon: "chili-medium" },
                  { label: "Spicy", level: 3, icon: "chili-hot" }
                ].map((s) => (
                  <Pressable 
                    key={s.level}
                    style={[styles.spiceItem, selectedSpice === s.level && styles.spiceItemActive]}
                    onPress={() => onSelectSpice(selectedSpice === s.level ? null : s.level)}
                  >
                    <MaterialCommunityIcons 
                      name={s.icon as any} 
                      size={20} 
                      color={selectedSpice === s.level ? "#FFF" : "#FF5722"} 
                    />
                    <Text style={[styles.spiceLabel, selectedSpice === s.level && styles.spiceLabelActive]}>{s.label}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Diet Section */}
            <View style={styles.section}>
              <View style={styles.row}>
                <View>
                  <Text style={styles.sectionTitle}>Vegetarian Only</Text>
                  <Text style={styles.sectionSubtitle}>Show only green-leaf dishes</Text>
                </View>
                <Switch 
                  value={isVeg} 
                  onValueChange={onToggleVeg}
                  trackColor={{ false: theme.colors.border, true: theme.colors.success }}
                  thumbColor="#FFF"
                />
              </View>
            </View>

            {/* Price Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Budget</Text>
              <View style={styles.chipGrid}>
                {[15, 25, 40].map((price) => (
                   <Pressable 
                    key={price}
                    style={[styles.chip, maxPrice === price && styles.chipActive]}
                    onPress={() => onSelectPrice(maxPrice === price ? null : price)}
                  >
                    <Text style={[styles.chipText, maxPrice === price && styles.chipTextActive]}>Under ${price}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Categories Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Categories</Text>
              <View style={styles.chipGrid}>
                {categories.map((cat) => (
                  <Pressable 
                    key={cat}
                    style={[styles.chip, selectedCategory === cat && styles.chipActive]}
                    onPress={() => onSelectCategory(selectedCategory === cat ? null : cat)}
                  >
                    <Text style={[styles.chipText, selectedCategory === cat && styles.chipTextActive]}>{cat}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Pressable style={styles.clearBtn} onPress={onClearAll}>
              <Text style={styles.clearBtnText}>Clear All</Text>
            </Pressable>
            <Pressable style={styles.applyBtn} onPress={onClose}>
              <Text style={styles.applyBtnText}>
                Show {activeCount > 0 ? `${activeCount} ` : ""}Results
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  content: {
    backgroundColor: theme.colors.page,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    minHeight: "75%",
    maxHeight: "90%",
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: theme.colors.text,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    padding: 24,
    gap: 32,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: theme.colors.text,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: theme.colors.muted,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  spiceContainer: {
    flexDirection: "row",
    gap: 12,
  },
  spiceItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
    borderRadius: 16,
    backgroundColor: "#FFF",
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    gap: 8,
  },
  spiceItemActive: {
    backgroundColor: "#FF5722",
    borderColor: "#FF5722",
  },
  spiceLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.text,
  },
  spiceLabelActive: {
    color: "#FFF",
  },
  chipGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chip: {
    paddingHorizontal: 16,
    minHeight: 44,
    borderRadius: 22,
    backgroundColor: "#FFF",
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  chipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  chipText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
  },
  chipTextActive: {
    color: "#FFF",
  },
  footer: {
    padding: 24,
    flexDirection: "row",
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  clearBtn: {
    flex: 1,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  clearBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.muted,
  },
  applyBtn: {
    flex: 2,
    height: 56,
    backgroundColor: theme.colors.primary,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    ...theme.shadows.md,
  },
  applyBtnText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFF",
  }
});


