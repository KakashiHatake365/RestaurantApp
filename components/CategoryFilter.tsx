import { ScrollView, Pressable, Text, StyleSheet } from "react-native";
import { theme } from "../lib/theme";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onSelect: (category: string | null) => void;
}

export function CategoryFilter({ categories, selectedCategory, onSelect }: CategoryFilterProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <Pressable
        onPress={() => onSelect(null)}
        style={[
          styles.chip,
          !selectedCategory && styles.chipSelected
        ]}
      >
        <Text style={[
          styles.chipText,
          !selectedCategory && styles.chipTextSelected
        ]}>All</Text>
      </Pressable>
      
      {categories.map((category) => (
        <Pressable
          key={category}
          onPress={() => onSelect(category)}
          style={[
            styles.chip,
            selectedCategory === category && styles.chipSelected
          ]}
        >
          <Text style={[
            styles.chipText,
            selectedCategory === category && styles.chipTextSelected
          ]}>{category}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 10,
  },
  chip: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    minHeight: 44, // Meets 44/48 criteria
    borderRadius: 999,
    backgroundColor: theme.colors.surfaceAlt,
    borderWidth: 1,
    borderColor: "transparent",
    justifyContent: "center",
  },
  chipSelected: {
    backgroundColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  chipText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.muted,
  },
  chipTextSelected: {
    color: "#FFFFFF",
  },
});


