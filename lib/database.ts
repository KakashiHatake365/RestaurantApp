import * as Crypto from "expo-crypto";
import { menuItems, type MenuItem } from "../data/menu";
import { rewardCatalogSeed, type RewardCatalogItem } from "../data/rewards";
import type { OrderHistoryItem, OrderHistoryRecord } from "../data/orders";

export interface DbAccount {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  displayName: string;
  role: string;
  points: number;
}

export interface CreateAccountInput {
  username: string;
  email: string;
  password: string;
  displayName: string;
}

export interface CreateOrderInput {
  accountId: string;
  customerName: string;
  phone: string;
  pickupTime: string;
  subtotal: number;
  tax: number;
  total: number;
  items: Array<{
    id: string;
    name: string;
    note: string;
    price: string;
    image?: string;
    quantity: number;
    sourceItem: MenuItem;
  }>;
}

export interface RewardRedemptionRecord {
  id: string;
  rewardId: string;
  rewardTitle: string;
  pointsCost: number;
  redeemedAt: string;
  status: string;
}

const accounts = new Map<string, DbAccount>();
const appState = new Map<string, string>();
let storedMenuItems: MenuItem[] = [...menuItems];
let storedRewardCatalog: RewardCatalogItem[] = [...rewardCatalogSeed];
let storedOrders: OrderHistoryRecord[] = [];
let rewardRedemptions: Array<RewardRedemptionRecord & { accountId: string }> = [];
let initialized = false;

async function hashPassword(password: string) {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, password);
}

export async function initializeDatabase() {
  if (initialized) {
    return;
  }

  const passwordHash = await hashPassword("welcome123");
  accounts.set("demo-customer", {
    id: "demo-customer",
    username: "restaurantguest",
    email: "guest@restaurantapp.local",
    passwordHash,
    displayName: "Restaurant Guest",
    role: "customer",
    points: 0,
  });

  storedMenuItems = [...menuItems];
  storedRewardCatalog = [...rewardCatalogSeed];
  initialized = true;
}

export async function getCurrentSessionUserId() {
  return appState.get("current_user_id") ?? null;
}

export async function setCurrentSessionUserId(userId: string | null) {
  if (!userId) {
    appState.delete("current_user_id");
    appState.delete("current_session_token");
    return;
  }

  appState.set("current_user_id", userId);
}

export async function getCurrentSessionToken() {
  return appState.get("current_session_token") ?? null;
}

export async function setCurrentSessionToken(token: string | null) {
  if (!token) {
    appState.delete("current_session_token");
    return;
  }

  appState.set("current_session_token", token);
}

export async function getBiometricsEnabled() {
  return appState.get("biometrics_enabled") === "true";
}

export async function setBiometricsEnabled(enabled: boolean) {
  appState.set("biometrics_enabled", enabled ? "true" : "false");
}

export async function getAccountById(id: string) {
  return accounts.get(id) ?? null;
}

export async function findAccountByIdentifier(identifier: string) {
  const normalized = identifier.toLowerCase();
  return Array.from(accounts.values()).find(
    (account) => account.email.toLowerCase() === normalized || account.username.toLowerCase() === normalized,
  ) ?? null;
}

export async function createAccount(input: CreateAccountInput) {
  const existing = await findAccountByIdentifier(input.email);
  if (existing) {
    throw new Error("An account with this email already exists.");
  }

  const accountId = `mobile-account-${Date.now()}`;
  const account: DbAccount = {
    id: accountId,
    username: input.username,
    email: input.email,
    passwordHash: await hashPassword(input.password),
    displayName: input.displayName,
    role: "customer",
    points: 0,
  };

  accounts.set(accountId, account);
  return account;
}

export async function verifyAccountPassword(account: DbAccount, password: string) {
  return account.passwordHash === await hashPassword(password);
}

export async function updateAccountPoints(accountId: string, nextPoints: number) {
  const account = accounts.get(accountId);
  if (!account) {
    return null;
  }

  const updated = { ...account, points: nextPoints };
  accounts.set(accountId, updated);
  return updated;
}

export async function getMenuItemsFromDb() {
  return storedMenuItems;
}

export async function replaceMenuItems(items: MenuItem[]) {
  storedMenuItems = [...items];
}

export async function getRewardCatalog() {
  return storedRewardCatalog;
}

export async function getRewardRedemptions(accountId: string) {
  return rewardRedemptions
    .filter((redemption) => redemption.accountId === accountId)
    .map(({ accountId: _accountId, ...redemption }) => redemption)
    .sort((a, b) => b.redeemedAt.localeCompare(a.redeemedAt));
}

export async function redeemReward(accountId: string, reward: RewardCatalogItem) {
  const account = await getAccountById(accountId);
  if (!account) {
    throw new Error("Account not found.");
  }
  if (account.points < reward.pointsCost) {
    throw new Error("Not enough points for this reward.");
  }

  const updatedAccount = { ...account, points: account.points - reward.pointsCost };
  accounts.set(accountId, updatedAccount);

  const redemption = {
    id: `reward-${Date.now()}`,
    accountId,
    rewardId: reward.id,
    rewardTitle: reward.title,
    pointsCost: reward.pointsCost,
    redeemedAt: new Date().toISOString(),
    status: "available",
  };
  rewardRedemptions = [redemption, ...rewardRedemptions];

  const { accountId: _accountId, ...redemptionRecord } = redemption;
  return {
    account: updatedAccount,
    redemption: redemptionRecord,
  };
}

export async function createOrder(input: CreateOrderInput) {
  const orderId = `mobile-${Date.now()}`;
  const placedAt = new Date().toISOString();
  const order: OrderHistoryRecord = {
    id: orderId,
    label: "Fresh mobile pickup order",
    date: new Date().toLocaleDateString(),
    placedAt,
    total: `$${input.total.toFixed(2)}`,
    subtotal: `$${input.subtotal.toFixed(2)}`,
    tax: `$${input.tax.toFixed(2)}`,
    customerName: input.customerName,
    phone: input.phone,
    pickupTime: input.pickupTime,
    status: "received",
    items: input.items.map<OrderHistoryItem>((item) => ({
      id: item.id,
      name: item.name,
      note: item.note,
      price: item.price,
      image: item.image,
      quantity: item.quantity,
      sourceItem: item.sourceItem,
    })),
  };

  storedOrders = [order, ...storedOrders];
  return order;
}

export async function getOrdersForAccount(_accountId: string) {
  return storedOrders;
}

export async function getOrderById(orderId: string) {
  return storedOrders.find((order) => order.id === orderId) ?? null;
}

export async function deleteAccount(accountId: string) {
  accounts.delete(accountId);
  storedOrders = [];
  rewardRedemptions = rewardRedemptions.filter((redemption) => redemption.accountId !== accountId);
  if (appState.get("current_user_id") === accountId) {
    appState.delete("current_user_id");
    appState.delete("current_session_token");
  }
}
