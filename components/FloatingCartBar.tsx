import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { Pressable, Text, View, StyleSheet, Animated } from "react-native";
import { useOrder } from "../context/OrderContext";
import { theme } from "../lib/theme";
import { useEffect, useRef } from "react";

export function FloatingCartBar() {
  const router = useRouter();
  const { cartCount, cartTotal } = useOrder();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (cartCount > 0) {
      Animated.spring(fadeAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [cartCount]);

  if (cartCount === 0) return null;

  return (
    <Animated.View 
      style={[
        styles.wrapper, 
        { 
          opacity: fadeAnim,
          transform: [{ translateY: fadeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [100, 0]
          }) }]
        }
      ]}
    >
      <Pressable 
        style={styles.container}
        onPress={() => router.push("/checkout")}
      >
        <View style={styles.left}>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{cartCount}</Text>
          </View>
          <View>
            <Text style={styles.title}>View Cart</Text>
            <Text style={styles.subtitle}>${cartTotal.toFixed(2)} total</Text>
          </View>
        </View>
        
        <View style={styles.right}>
          <Text style={styles.btnText}>Checkout</Text>
          <MaterialCommunityIcons name="arrow-right" size={20} color="#FFFFFF" />
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 24,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  container: {
    backgroundColor: theme.colors.primary,
    borderRadius: 28,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    ...theme.shadows.lg,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  countBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  countText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
  },
  subtitle: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 13,
    fontWeight: "600",
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  btnText: {
    color: theme.colors.primary,
    fontSize: 15,
    fontWeight: "800",
  },
});


