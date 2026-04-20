import { menuItems, type MenuItem } from "./menu";

export interface OrderHistoryItem {
  id?: string;
  name: string;
  note: string;
  price: string;
  image?: string;
  quantity?: number;
  sourceItem?: MenuItem;
}

export interface OrderHistoryRecord {
  id: string;
  label: string;
  date: string;
  placedAt?: string;
  total: string;
  subtotal?: string;
  tax?: string;
  customerName?: string;
  phone?: string;
  pickupTime?: string;
  status?: "received" | "cooking" | "ready";
  items: OrderHistoryItem[];
}

const findMenuItem = (name: string) => menuItems.find((item) => item.name === name);

export const initialRecentOrders: OrderHistoryRecord[] = [
  {
    id: "order-101",
    label: "Friday family pickup",
    date: "Mar 28, 2026",
    placedAt: "2026-03-28T18:10:00.000Z",
    total: "$46.97",
    subtotal: "$41.57",
    tax: "$5.40",
    customerName: "Restaurant Gold Member",
    phone: "+1 (416) 555-0198",
    pickupTime: "ASAP",
    status: "ready",
    items: [
      {
        id: "2",
        name: "Signature Beef Fry",
        note: "Most reordered specialty. Ready to add again in one tap.",
        price: "$16.99",
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800",
        quantity: 1,
        sourceItem: findMenuItem("Signature Beef Fry"),
      },
      {
        id: "1",
        name: "Masala Dosa",
        note: "Light spice. Packed separately for the drive home.",
        price: "$12.99",
        image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?q=80&w=800",
        quantity: 1,
        sourceItem: findMenuItem("Masala Dosa"),
      },
    ],
  },
  {
    id: "order-102",
    label: "Weeknight quick order",
    date: "Mar 24, 2026",
    placedAt: "2026-03-24T17:55:00.000Z",
    total: "$31.98",
    subtotal: "$28.30",
    tax: "$3.68",
    customerName: "Restaurant Gold Member",
    phone: "+1 (416) 555-0198",
    pickupTime: "6:30 PM",
    status: "ready",
    items: [
      {
        id: "3",
        name: "Chicken Chettinad",
        note: "Heat level four. Popular curry reorder.",
        price: "$15.99",
        image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?q=80&w=800",
        quantity: 1,
        sourceItem: findMenuItem("Chicken Chettinad"),
      },
      {
        id: "4",
        name: "Idli Sambar",
        note: "Added as a starter with extra chutney.",
        price: "$9.99",
        image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=800",
        quantity: 1,
        sourceItem: findMenuItem("Idli Sambar"),
      },
    ],
  },
];


