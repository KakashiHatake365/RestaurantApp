import { useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { useOrder } from "../context/OrderContext";
import { theme } from "../lib/theme";

export default function CheckoutScreen() {
  const router = useRouter();
  const { user, awardPoints, loading } = useAuth();
  const { cart, cartTotal, placeOrder } = useOrder();
  const [customerName, setCustomerName] = useState(user?.displayName ?? "");
  const [phone, setPhone] = useState("");
  const [pickupTime, setPickupTime] = useState("ASAP");
  const [submitting, setSubmitting] = useState(false);

  const tax = useMemo(() => cartTotal * 0.13, [cartTotal]);
  const finalTotal = useMemo(() => cartTotal + tax, [cartTotal, tax]);

  const submit = async () => {
    if (!cart.length) {
      Alert.alert("Cart empty", "Add items on the menu screen before opening checkout.");
      router.back();
      return;
    }

    if (!customerName.trim() || !phone.trim()) {
      Alert.alert("Missing details", "Enter your name and phone number to place the order.");
      return;
    }

    setSubmitting(true);
    const order = await placeOrder({ customerName: customerName.trim(), phone: phone.trim(), pickupTime });

    if (!order) {
      setSubmitting(false);
      Alert.alert("Order error", "Unable to place the order right now.");
      return;
    }

    const earnedPoints = await awardPoints(cartTotal);
    setSubmitting(false);
    Alert.alert("Order placed", `Your order is in progress. You earned ${earnedPoints} reward points.`);

    router.replace({
      pathname: "/order-status/[orderId]",
      params: { orderId: order.id },
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.page }}>
      <ScrollView contentContainerStyle={{ padding: 20, gap: 18 }}>
        <View style={{ gap: 6 }}>
          <Text style={theme.screenTitle}>Checkout</Text>
          <Text style={theme.screenSubtitle}>Review your order details before placing the pickup order.</Text>
        </View>

        <View style={theme.sectionCard}>
          <Text style={theme.sectionTitle}>Order Details</Text>
          <View style={{ gap: 12, marginTop: 12 }}>
            {cart.map((item) => (
              <View key={item.id} style={theme.rowCard}>
                <View style={{ flex: 1 }}>
                  <Text style={theme.rowTitle}>{item.name}</Text>
                  <Text style={theme.bodyText}>Qty {item.quantity}</Text>
                </View>
                <Text style={theme.priceText}>${(item.price * item.quantity).toFixed(2)}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={theme.sectionCard}>
          <Text style={theme.sectionTitle}>Pickup Details</Text>
          <View style={{ gap: 12, marginTop: 12 }}>
            <TextInput
              value={customerName}
              onChangeText={setCustomerName}
              placeholder="Full name"
              placeholderTextColor={theme.colors.muted}
              style={theme.input}
            />
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="Phone number"
              keyboardType="phone-pad"
              placeholderTextColor={theme.colors.muted}
              style={theme.input}
            />
            <TextInput
              value={pickupTime}
              onChangeText={setPickupTime}
              placeholder="Pickup time"
              placeholderTextColor={theme.colors.muted}
              style={theme.input}
            />
          </View>
        </View>

        <View style={theme.sectionCard}>
          <Text style={theme.sectionTitle}>Payment Summary</Text>
          <View style={{ gap: 10, marginTop: 12 }}>
            <View style={theme.summaryLine}>
              <Text style={theme.bodyText}>Subtotal</Text>
              <Text style={theme.bodyText}>${cartTotal.toFixed(2)}</Text>
            </View>
            <View style={theme.summaryLine}>
              <Text style={theme.bodyText}>Estimated tax</Text>
              <Text style={theme.bodyText}>${tax.toFixed(2)}</Text>
            </View>
            <View style={theme.summaryLine}>
              <Text style={theme.rowTitle}>Total</Text>
              <Text style={theme.priceText}>${finalTotal.toFixed(2)}</Text>
            </View>
            <Pressable style={theme.primaryButton} onPress={submit} disabled={submitting}>
              <Text style={theme.primaryButtonText}>{submitting || loading ? "Placing order..." : "Place Order"}</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


