import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useEffect, useState, useMemo } from "react";
import { ActivityIndicator, Pressable, Text, View, TextInput, ScrollView, StyleSheet, RefreshControl } from "react-native";
import { CategoryFilter } from "../../components/CategoryFilter";
import { DishCard } from "../../components/DishCard";
import { FilterModal } from "../../components/FilterModal";
import { FloatingCartBar } from "../../components/FloatingCartBar";
import { Screen } from "../../components/Screen";
import { useOrder } from "../../context/OrderContext";
import { groupedMenu as fallbackGroupedMenu, type MenuItem } from "../../data/menu";
import { fetchRemoteMenu } from "../../lib/api";
import { getMenuItemsFromDb, replaceMenuItems } from "../../lib/database";
import { theme } from "../../lib/theme";

export default function MenuScreen() {
  const { addToCart, cartCount } = useOrder();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSpice, setSelectedSpice] = useState<number | null>(null);
  const [isVeg, setIsVeg] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const loadMenu = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      // 1. Load from local cache first for speed
      const cachedItems = await getMenuItemsFromDb();
      if (cachedItems.length) {
        setItems(cachedItems);
      }
      
      // 2. Fetch fresh data from remote API
      const nextItems = await fetchRemoteMenu();
      
      // 3. Update cache if we got new data
      if (nextItems.length) {
        await replaceMenuItems(nextItems);
        setItems(nextItems);
      }
    } catch (error) {
      console.error("Menu load error:", error);
      const cachedItems = await getMenuItemsFromDb();
      setItems(cachedItems.length ? cachedItems : fallbackGroupedMenu.flatMap((group) => group.items));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    void loadMenu(false);
  };

  useEffect(() => {
    void loadMenu();
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(items.map((i) => i.category));
    return Array.from(cats);
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                           item.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !selectedCategory || item.category === selectedCategory;
      const matchesSpice = selectedSpice === null || item.spicyLevel === selectedSpice;
      const matchesVeg = !isVeg || item.isVegetarian === true;
      const matchesPrice = !maxPrice || item.price <= maxPrice;
      return matchesSearch && matchesCategory && matchesSpice && matchesVeg && matchesPrice;
    });
  }, [items, search, selectedCategory, selectedSpice, isVeg, maxPrice]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategory) count++;
    if (selectedSpice !== null) count++;
    if (isVeg) count++;
    if (maxPrice !== null) count++;
    return count;
  }, [selectedCategory, selectedSpice, isVeg, maxPrice]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.page }}>
      <View style={styles.header}>
        <Text style={theme.screenTitle}>Our Menu</Text>
        <View style={styles.searchRow}>
          <View style={styles.searchContainer}>
            <MaterialCommunityIcons name="magnify" size={20} color={theme.colors.muted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search dishes..."
              value={search}
              onChangeText={setSearch}
              placeholderTextColor={theme.colors.muted}
            />
            {search.length > 0 && (
              <Pressable onPress={() => setSearch("")}>
                <MaterialCommunityIcons name="close-circle" size={18} color={theme.colors.muted} />
              </Pressable>
            )}
          </View>
          <Pressable 
            style={[styles.filterBtn, activeFilterCount > 0 && styles.filterBtnActive]} 
            onPress={() => setIsFilterVisible(true)}
          >
            <MaterialCommunityIcons 
              name={activeFilterCount > 0 ? "filter" : "filter-outline"} 
              size={20} 
              color={activeFilterCount > 0 ? "#FFF" : theme.colors.text} 
            />
            <Text style={[styles.filterBtnText, activeFilterCount > 0 && styles.filterBtnTextActive]}>Filter</Text>
            {activeFilterCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{activeFilterCount}</Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>

      <FilterModal
        visible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        selectedSpice={selectedSpice}
        onSelectSpice={setSelectedSpice}
        isVeg={isVeg}
        onToggleVeg={setIsVeg}
        maxPrice={maxPrice}
        onSelectPrice={setMaxPrice}
        activeCount={filteredItems.length}
        onClearAll={() => {
          setSelectedCategory(null);
          setSelectedSpice(null);
          setIsVeg(false);
          setMaxPrice(null);
        }}
      />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[theme.bodyText, { marginTop: 12 }]}>Preparing the kitchen...</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
          }
        >
          {filteredItems.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="magnify-close" size={64} color={theme.colors.surfaceAlt} />
              <Text style={theme.sectionTitle}>No dishes found</Text>
              <Text style={[theme.bodyText, { textAlign: "center" }]}>
                Try searching for something else or browse another category.
              </Text>
              <Pressable 
                style={[theme.secondaryButton, { marginTop: 20 }]}
                onPress={() => { setSearch(""); setSelectedCategory(null); }}
              >
                <Text style={theme.secondaryButtonText}>Clear all filters</Text>
              </Pressable>
            </View>
          ) : (
            <View style={{ gap: 16 }}>
              {filteredItems.map((item) => (
                <DishCard key={item.id} item={item} onAdd={addToCart} />
              ))}
            </View>
          )}
        </ScrollView>
      )}

      <FloatingCartBar />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.page,
    gap: 16,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 16,
    borderRadius: 20,
    height: 52,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
    fontWeight: "500",
  },
  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingHorizontal: 16,
    borderRadius: 20,
    height: 52,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    gap: 8,
  },
  filterBtnActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.colors.text,
  },
  filterBtnTextActive: {
    color: "#FFF",
  },
  badge: {
    backgroundColor: "#FFF",
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    position: "absolute",
    top: -6,
    right: -4,
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
    ...theme.shadows.sm,
  },
  badgeText: {
    color: theme.colors.primary,
    fontSize: 10,
    fontWeight: "800",
  },
  stickyContainer: {
    backgroundColor: theme.colors.page,
    paddingBottom: 4,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 120,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyState: {
    paddingVertical: 80,
    alignItems: "center",
    gap: 8,
  },
});



