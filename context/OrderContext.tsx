import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";
import { MenuItem } from "../data/menu";
import { type OrderHistoryRecord } from "../data/orders";
import { createOrder, getOrderById as getOrderByIdFromDb, getOrdersForAccount } from "../lib/database";
import { submitOrderRemote, fetchUserOrdersRemote, getApiSessionToken } from "../lib/api";

export interface CartLine extends MenuItem {
  quantity: number;
}

interface OrderContextValue {
  cart: CartLine[];
  recentOrders: OrderHistoryRecord[];
  addToCart: (item: MenuItem) => void;
  changeQuantity: (itemId: string, nextQuantity: number) => void;
  cartCount: number;
  cartTotal: number;
  placeOrder: (details: { customerName: string; phone: string; pickupTime: string }) => Promise<OrderHistoryRecord | null>;
  reorderOrder: (order: OrderHistoryRecord) => void;
  clearCart: () => void;
  getOrderById: (orderId: string) => Promise<OrderHistoryRecord | null>;
}

const OrderContext = createContext<OrderContextValue | undefined>(undefined);

export function OrderProvider({ children }: PropsWithChildren) {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartLine[]>([]);
  const [recentOrders, setRecentOrders] = useState<OrderHistoryRecord[]>([]);

  useEffect(() => {
    let active = true;

    const loadOrders = async () => {
      if (!user) {
        if (active) {
          setRecentOrders([]);
        }
        return;
      }

      try {
        // 1. Load local cache first
        const orders = await getOrdersForAccount(user.id);
        if (active) {
          setRecentOrders(orders);
        }

        // 2. Try to fetch fresh history from cloud (Wait for token if necessary)
        const token = getApiSessionToken();
        if (!token) {
          console.log("Waiting for session token to stabilize...");
          return;
        }

        const cloudOrders = await fetchUserOrdersRemote();
        if (active && Array.isArray(cloudOrders)) {
          // Normalize cloud orders to match OrderHistoryRecord format
          const normalizedCloudOrders = cloudOrders.map((o: any) => ({
            id: o.id,
            label: "Remote Order",
            date: new Date(o.placedAt).toLocaleDateString(),
            placedAt: o.placedAt,
            total: `$${Number(o.total).toFixed(2)}`,
            status: "received" as const, // Default status for Remote Orders
            items: o.items.map((i: any) => ({
              id: i.menuItemId,
              name: i.name,
              price: `$${Number(i.price).toFixed(2)}`,
              quantity: i.quantity,
            })),
          }));
          
          setRecentOrders(normalizedCloudOrders);
        }
      } catch (error) {
        console.error("Failed to sync cloud orders:", error);
      }
    };

    void loadOrders();

    return () => {
      active = false;
    };
  }, [user]);

  const value = useMemo<OrderContextValue>(() => {
    const addToCart = (item: MenuItem) => {
      setCart((current) => {
        const existing = current.find((entry) => entry.id === item.id);
        if (existing) {
          return current.map((entry) => (entry.id === item.id ? { ...entry, quantity: entry.quantity + 1 } : entry));
        }

        return [...current, { ...item, quantity: 1 }];
      });
    };

    const changeQuantity = (itemId: string, nextQuantity: number) => {
      setCart((current) =>
        current
          .map((entry) => (entry.id === itemId ? { ...entry, quantity: nextQuantity } : entry))
          .filter((entry) => entry.quantity > 0),
      );
    };

    const clearCart = () => setCart([]);

    const placeOrder = async (details: { customerName: string; phone: string; pickupTime: string }) => {
      if (!cart.length || !user) {
        return null;
      }

      const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const tax = subtotal * 0.13;
      const total = subtotal + tax;

      // 1. Submit to remote API first
      let cloudOrder;
      try {
        cloudOrder = await submitOrderRemote({
          customerName: details.customerName,
          phone: details.phone,
          pickupTime: details.pickupTime,
          subtotal,
          total,
          specialInstructions: `Mobile order - ${new Date().toLocaleDateString()}`,
          items: cart.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
        });
      } catch (error) {
        console.error("Cloud order submission failed:", error);
      }

      // 2. Save locally for immediate display
      const order = await createOrder({
        accountId: user.id,
        customerName: details.customerName,
        phone: details.phone,
        pickupTime: details.pickupTime,
        subtotal,
        tax,
        total,
        items: cart.map((item) => ({
          id: item.id,
          name: item.name,
          note: `Quantity ${item.quantity} from mobile order`,
          price: `$${(item.price * item.quantity).toFixed(2)}`,
          image: item.image,
          quantity: item.quantity,
          sourceItem: item,
        })),
      });

      if (order) {
        setRecentOrders((current) => [order, ...current]);
        setCart([]);
      }

      return order;
    };

    const reorderOrder = (order: OrderHistoryRecord) => {
      setCart((current) => {
        let nextCart = [...current];

        order.items.forEach((item) => {
          const sourceItem = item.sourceItem;
          if (!sourceItem) {
            return;
          }

          const existing = nextCart.find((entry) => entry.id === sourceItem.id);
          if (existing) {
            nextCart = nextCart.map((entry) =>
              entry.id === sourceItem.id ? { ...entry, quantity: entry.quantity + (item.quantity ?? 1) } : entry,
            );
            return;
          }

          nextCart = [...nextCart, { ...sourceItem, quantity: item.quantity ?? 1 }];
        });

        return nextCart;
      });
    };

    return {
      cart,
      recentOrders,
      addToCart,
      changeQuantity,
      cartCount: cart.reduce((sum, item) => sum + item.quantity, 0),
      cartTotal: cart.reduce((sum, item) => sum + item.quantity * item.price, 0),
      placeOrder,
      reorderOrder,
      clearCart,
      getOrderById: (orderId) => getOrderByIdFromDb(orderId),
    };
  }, [cart, recentOrders, user]);

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrder must be used inside OrderProvider");
  }

  return context;
}


