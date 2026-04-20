import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useEffect, useState, useCallback } from "react";
import { ScrollView, Text, View, StyleSheet, Pressable, TextInput, Modal, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { theme } from "../../lib/theme";
import { fetchUserAddresses, saveUserAddress, updateUserAddress, deleteUserAddress } from "../../lib/api";

interface Address {
  id: string;
  type: string;
  address: string;
  icon: string;
  isDefault: boolean;
}

interface Suggestion {
  display_name: string;
  lat: string;
  lon: string;
}

export default function AddressesScreen() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  
  // Form State
  const [formType, setFormType] = useState("Home");
  const [formAddress, setFormAddress] = useState("");
  const [formIcon, setFormIcon] = useState("home-outline");
  
  // Suggestions State
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    loadAddresses();
  }, []);

  async function loadAddresses() {
    setLoading(true);
    const data = await fetchUserAddresses();
    setAddresses(data);
    setLoading(false);
  }

  // Debounced search for Photon
  useEffect(() => {
    if (formAddress.length < 3) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(
          `https://photon.komoot.io/api/?q=${encodeURIComponent(formAddress)}&limit=5`
        );
        
        if (!response.ok) {
          throw new Error("Location service unavailable");
        }

        const data = await response.json();
        const mappedSuggestions = data.features.map((f: any) => ({
          display_name: [
            f.properties.name,
            f.properties.street,
            f.properties.city,
            f.properties.country
          ].filter(Boolean).join(", "),
          lat: f.geometry.coordinates[1].toString(),
          lon: f.geometry.coordinates[0].toString()
        }));
        setSuggestions(mappedSuggestions);
      } catch (error) {
        console.error("Autocomplete error:", error);
        setSuggestions([]); 
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [formAddress]);

  const handleSelectSuggestion = (suggestion: Suggestion) => {
    setFormAddress(suggestion.display_name);
    setSuggestions([]);
  };

  const handleEdit = (item: Address) => {
    setEditingAddress(item);
    setFormType(item.type);
    setFormAddress(item.address);
    setFormIcon(item.icon);
    setSuggestions([]);
    setModalVisible(true);
  };

  const handleAddNew = () => {
    setEditingAddress(null);
    setFormType("Home");
    setFormAddress("");
    setFormIcon("home-outline");
    setSuggestions([]);
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!formAddress.trim()) {
      Alert.alert("Error", "Please enter an address.");
      return;
    }

    try {
      if (editingAddress) {
        await updateUserAddress(editingAddress.id, {
          type: formType,
          address: formAddress,
          icon: formIcon,
        });
      } else {
        await saveUserAddress({
          type: formType,
          address: formAddress,
          icon: formIcon,
        });
      }
      setModalVisible(false);
      loadAddresses();
    } catch (error) {
      Alert.alert("Error", "Failed to save address.");
    }
  };

  const handleDelete = async (id: string) => {
    Alert.alert("Delete Address", "Are you sure you want to remove this address?", [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Delete", 
        style: "destructive", 
        onPress: async () => {
          await deleteUserAddress(id);
          loadAddresses();
        } 
      }
    ]);
  };

  const AddressTypeChip = ({ label, icon }: { label: string; icon: string }) => (
    <Pressable 
      onPress={() => { setFormType(label); setFormIcon(icon); }}
      style={[styles.typeChip, formType === label && styles.typeChipActive]}
    >
      <MaterialCommunityIcons name={icon as any} size={18} color={formType === label ? "#FFF" : theme.colors.primary} />
      <Text style={[styles.typeChipText, formType === label && styles.typeChipTextActive]}>{label}</Text>
    </Pressable>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.page }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={theme.bodyText}>Manage your delivery and pickup locations for a faster checkout.</Text>
        
        {loading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 40 }} />
        ) : (
          <View style={styles.list}>
            {addresses.length === 0 ? (
              <View style={styles.emptyState}>
                <MaterialCommunityIcons name="map-marker-off-outline" size={48} color={theme.colors.muted} />
                <Text style={styles.emptyText}>No saved addresses yet.</Text>
              </View>
            ) : (
              addresses.map((item) => (
                <View key={item.id} style={styles.addressCard}>
                  <View style={styles.iconContainer}>
                    <MaterialCommunityIcons name={item.icon as any} size={24} color={theme.colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={theme.cardTitle}>{item.type}</Text>
                    <Text style={theme.bodyText}>{item.address}</Text>
                  </View>
                  <View style={{ flexDirection: "row", gap: 8 }}>
                    <Pressable style={styles.actionBtn} onPress={() => handleEdit(item)}>
                      <MaterialCommunityIcons name="pencil-outline" size={20} color={theme.colors.muted} />
                    </Pressable>
                    <Pressable style={styles.actionBtn} onPress={() => handleDelete(item.id)}>
                      <MaterialCommunityIcons name="trash-can-outline" size={20} color="#D32F2F" />
                    </Pressable>
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        <Pressable style={[theme.secondaryButton, styles.addBtn]} onPress={handleAddNew}>
          <MaterialCommunityIcons name="plus" size={20} color={theme.colors.text} />
          <Text style={theme.secondaryButtonText}>Add New Address</Text>
        </Pressable>
      </ScrollView>

      <Modal visible={isModalVisible} animationType="fade" transparent>
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editingAddress ? "Edit Address" : "Add Address"}</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <MaterialCommunityIcons name="close" size={24} color={theme.colors.muted} />
              </Pressable>
            </View>
            
            <View style={styles.typeRow}>
              <AddressTypeChip label="Home" icon="home-outline" />
              <AddressTypeChip label="Work" icon="briefcase-outline" />
              <AddressTypeChip label="Other" icon="map-marker-outline" />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Address</Text>
              <View style={styles.searchBox}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Start typing your address..."
                  value={formAddress}
                  onChangeText={setFormAddress}
                  multiline
                  numberOfLines={2}
                />
                {isSearching && <ActivityIndicator style={styles.searchIndicator} color={theme.colors.primary} />}
              </View>

              {suggestions.length > 0 && (
                <View style={styles.suggestionsContainer}>
                  {suggestions.map((s, i) => (
                    <Pressable 
                      key={i} 
                      style={styles.suggestionItem}
                      onPress={() => handleSelectSuggestion(s)}
                    >
                      <MaterialCommunityIcons name="map-marker-outline" size={16} color={theme.colors.primary} />
                      <Text style={styles.suggestionText} numberOfLines={2}>{s.display_name}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.modalActions}>
              <Pressable style={[styles.modalBtn, styles.saveBtn]} onPress={handleSave}>
                <Text style={styles.saveBtnText}>Save Address</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    marginTop: 24,
    gap: 16,
  },
  addressCard: {
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: theme.colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  actionBtn: {
    padding: 8,
  },
  addBtn: {
    marginTop: 24,
    flexDirection: "row",
    gap: 8,
  },
  emptyState: {
    alignItems: "center",
    padding: 40,
    gap: 12,
  },
  emptyText: {
    color: theme.colors.muted,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderRadius: 32,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: theme.colors.text,
  },
  typeRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 24,
    flexWrap: "wrap",
  },
  typeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: theme.colors.surfaceAlt,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  typeChipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  typeChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.text,
  },
  typeChipTextActive: {
    color: "#FFF",
  },
  inputGroup: {
    marginBottom: 24,
    position: "relative",
    zIndex: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.muted,
    marginBottom: 8,
    marginLeft: 4,
  },
  searchBox: {
    position: "relative",
  },
  textInput: {
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: 16,
    padding: 16,
    fontSize: 15,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
    minHeight: 80,
    textAlignVertical: "top",
  },
  searchIndicator: {
    position: "absolute",
    right: 12,
    top: 12,
  },
  suggestionsContainer: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "#FFF",
    borderRadius: 16,
    marginTop: 4,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 100,
    overflow: "hidden",
  },
  suggestionItem: {
    flexDirection: "row",
    gap: 10,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    alignItems: "center",
  },
  suggestionText: {
    fontSize: 13,
    color: theme.colors.text,
    flex: 1,
  },
  modalActions: {
    marginTop: 8,
  },
  modalBtn: {
    height: 56,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  saveBtn: {
    backgroundColor: theme.colors.primary,
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFF",
  }
});


