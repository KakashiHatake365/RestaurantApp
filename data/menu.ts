export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  spicyLevel?: number;
  isVegetarian?: boolean;
}

export const menuItems: MenuItem[] = [
  {
    id: "1",
    name: "Masala Dosa",
    description: "Crispy rice and lentil crepe stuffed with a spiced potato filling.",
    price: 12.99,
    category: "Dosas",
    spicyLevel: 1,
    isVegetarian: true,
    image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?q=80&w=800",
  },
  {
    id: "2",
    name: "Signature Beef Fry",
    description: "Tender beef cubes slow-roasted with aromatic spices and crisp coconut.",
    price: 16.99,
    category: "Specialties",
    spicyLevel: 3,
    isVegetarian: false,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800",
  },
  {
    id: "3",
    name: "Chicken Chettinad",
    description: "Classic South Indian dish made with freshly ground fiery spices.",
    price: 15.99,
    category: "Curries",
    spicyLevel: 4,
    image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?q=80&w=800",
  },
  {
    id: "4",
    name: "Idli Sambar",
    description: "Steamed rice and lentil cakes served with lentil soup and chutneys.",
    price: 9.99,
    category: "Appetizers",
    spicyLevel: 1,
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=800",
  },
  {
    id: "5",
    name: "Coastal Fish Curry",
    description: "Fish cooked in a tangy and spicy coconut gravy with tamarind.",
    price: 18.99,
    category: "Curries",
    spicyLevel: 2,
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=800",
  },
  {
    id: "1774835594606",
    name: "Beef Cutlet",
    description: "Beef and potato in a breaded coat cover.",
    price: 2.49,
    category: "Appetizers",
    spicyLevel: 1,
    isVegetarian: false,
    image: "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?q=80&w=800",
  },
  {
    id: "1774838372994",
    name: "Spicy Prawns",
    description: "Tiger prawns cooked in a bold house masala.",
    price: 22,
    category: "Specialties",
    spicyLevel: 5,
    isVegetarian: false,
    image: "https://images.unsplash.com/photo-1559131397-f94da358f7ca?q=80&w=800",
  },
];

export const groupedMenu = ["Curries", "Dosas", "Appetizers", "Specialties"].map((category) => ({
  category,
  items: menuItems.filter((item) => item.category === category),
}));

export const dishOfTheWeek = menuItems[1];

export const featuredHighlights = [
  {
    title: "Fast pickup flow",
    copy: "Designed around quick handoff and repeat ordering instead of a generic restaurant homepage.",
    icon: "timer-outline" as const,
  },
  {
    title: "Real menu categories",
    copy: "Mobile navigation follows the same category split already used in the web menu.",
    icon: "view-grid-outline" as const,
  },
  {
    title: "Built for reorders",
    copy: "Favorites and order history are first-class screens, not buried settings.",
    icon: "backup-restore" as const,
  },
];


