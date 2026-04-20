import { menuItems, type MenuItem } from "../data/menu";

const API_BASE = process.env.EXPO_PUBLIC_RESTAURANT_API_BASE;
let sessionToken: string | null = null;
let localAddresses: any[] = [];

export function setApiSessionToken(token: string | null) {
  sessionToken = token;
}

export function getApiSessionToken() {
  return sessionToken;
}

type RawMenuItem = Partial<MenuItem> & {
  id?: string | number;
  title?: string;
  body_html?: string;
  product_type?: string;
  images?: Array<{ src?: string }>;
  variants?: Array<{ price?: string }>;
};

function normalizeMenuItem(item: any): MenuItem {
  return {
    id: String(item.id ?? Date.now()),
    name: item.name ?? "Untitled Dish",
    description: item.description ?? "Fresh house specialty.",
    price: Number(item.price ?? 0),
    category: item.category ?? "Specialties",
    image: item.image ?? undefined,
    spicyLevel: typeof item.spicyLevel === "number" ? item.spicyLevel : undefined,
    isVegetarian: Boolean(item.isVegetarian),
  };
}

async function fetchFromEndpoint(url: string) {
  if (!API_BASE) {
    throw new Error("No remote API configured.");
  }

  const headers: Record<string, string> = { Accept: "application/json" };
  if (sessionToken) {
    headers["Authorization"] = `Bearer ${sessionToken}`;
  }

  const response = await fetch(url, {
    headers,
  });

  if (!response.ok) {
    throw new Error(`Request failed with ${response.status}`);
  }

  const data = await response.json();
  return data;
}

async function postToEndpoint(url: string, body: any) {
  if (!API_BASE) {
    throw new Error("No remote API configured.");
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (sessionToken) {
    headers["Authorization"] = `Bearer ${sessionToken}`;
  }

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || `Request failed with ${response.status}`);
  }
  return data;
}

export async function fetchRemoteMenu(): Promise<MenuItem[]> {
  const endpoint = `${API_BASE}/api/menu`;
  try {
    const data = await fetchFromEndpoint(endpoint);
    if (Array.isArray(data)) {
      return data.map(normalizeMenuItem);
    }
  } catch (error) {
    console.error("Failed to fetch menu from remote API:", error);
  }

  // Fallback to static data if API fails
  return menuItems;
}

export async function loginRemote(email: string, password: string) {
  return postToEndpoint(`${API_BASE}/api/auth/login`, { email, password });
}

export async function registerRemote(username: string, email: string, password: string) {
  return postToEndpoint(`${API_BASE}/api/auth/register`, { username, email, password });
}

export async function syncPointsRemote(points: number) {
  return postToEndpoint(`${API_BASE}/api/user/points`, { points });
}

export async function fetchUserOrdersRemote() {
  return fetchFromEndpoint(`${API_BASE}/api/orders`);
}

export async function submitOrderRemote(orderData: any) {
  return postToEndpoint(`${API_BASE}/api/orders`, orderData);
}

export async function updateRemoteProfile(username: string): Promise<{ success: boolean; error?: string }> {
  if (!API_BASE) {
    return { success: true };
  }

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (sessionToken) {
    headers["Authorization"] = `Bearer ${sessionToken}`;
  }

  try {
    const response = await fetch(`${API_BASE}/api/user/profile`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ username }),
    });
    return response.json();
  } catch (error) {
    return { success: false, error: "Network error" };
  }
}

export async function fetchUserAddresses(): Promise<any[]> {
  if (!API_BASE) {
    return localAddresses;
  }

  try {
    return await fetchFromEndpoint(`${API_BASE}/api/user/addresses`);
  } catch (error) {
    return [];
  }
}

export async function saveUserAddress(addressData: { type: string; address: string; icon: string; isDefault?: boolean }) {
  if (!API_BASE) {
    const nextAddress = {
      id: `local-address-${Date.now()}`,
      isDefault: localAddresses.length === 0,
      ...addressData,
    };
    localAddresses = [...localAddresses, nextAddress];
    return { success: true, address: nextAddress };
  }

  return postToEndpoint(`${API_BASE}/api/user/addresses`, addressData);
}

export async function updateUserAddress(id: string, addressData: Partial<{ type: string; address: string; icon: string; isDefault: boolean }>) {
  if (!API_BASE) {
    localAddresses = localAddresses.map((address) => (address.id === id ? { ...address, ...addressData } : address));
    return { success: true };
  }

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (sessionToken) {
    headers["Authorization"] = `Bearer ${sessionToken}`;
  }

  try {
    const response = await fetch(`${API_BASE}/api/user/addresses?id=${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(addressData),
    });
    return response.json();
  } catch (error) {
    return { success: false, error: "Network error" };
  }
}

export async function deleteUserAddress(id: string) {
  if (!API_BASE) {
    localAddresses = localAddresses.filter((address) => address.id !== id);
    return { success: true };
  }

  const headers: Record<string, string> = { Accept: "application/json" };
  if (sessionToken) {
    headers["Authorization"] = `Bearer ${sessionToken}`;
  }

  try {
    const response = await fetch(`${API_BASE}/api/user/addresses?id=${id}`, {
      method: "DELETE",
      headers,
    });
    return response.json();
  } catch (error) {
    return { success: false, error: "Network error" };
  }
}


