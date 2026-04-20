import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";
import * as LocalAuthentication from "expo-local-authentication";
import { Alert } from "react-native";
import {
  createAccount,
  findAccountByIdentifier,
  getAccountById,
  getCurrentSessionUserId,
  getCurrentSessionToken,
  initializeDatabase,
  redeemReward as redeemRewardInDb,
  setCurrentSessionUserId,
  setCurrentSessionToken,
  updateAccountPoints,
  verifyAccountPassword,
  getBiometricsEnabled,
  setBiometricsEnabled as setBiometricsEnabledInDb,
} from "../lib/database";
import { loginRemote, registerRemote, syncPointsRemote, setApiSessionToken } from "../lib/api";
import type { RewardCatalogItem } from "../data/rewards";

export interface SessionUser {
  id: string;
  email: string;
  displayName: string;
  role?: string;
  points: number;
}

interface AuthContextValue {
  user: SessionUser | null;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  awardPoints: (amountSpent: number) => Promise<number>;
  redeemReward: (reward: RewardCatalogItem) => Promise<void>;
  updateProfile: (username: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
  isBiometricsEnabled: boolean;
  toggleBiometrics: (enabled: boolean) => Promise<void>;
  authenticateWithBiometrics: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function normalizeUser(account: { id: string; email: string; displayName: string; role?: string; points: number }): SessionUser {
  return {
    id: account.id,
    email: account.email,
    displayName: account.displayName,
    role: account.role,
    points: account.points,
  };
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBiometricsEnabled, setIsBiometricsEnabled] = useState(false);

  useEffect(() => {
    let active = true;

    const bootstrap = async () => {
      await initializeDatabase();
      const [savedId, savedToken] = await Promise.all([
        getCurrentSessionUserId(),
        getCurrentSessionToken(),
      ]);

      if (savedToken) {
        setApiSessionToken(savedToken);
      }

      if (savedId) {
        const account = await getAccountById(savedId);
        if (active) {
          setUser(account ? normalizeUser(account) : null);
        }
      }
      
      const biometricsPref = await getBiometricsEnabled();
      if (active) {
        setIsBiometricsEnabled(biometricsPref);
        setLoading(false);
      }
    };

    void bootstrap();

    return () => {
      active = false;
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      async login(identifier, password) {
        try {
          const response = await loginRemote(identifier, password);
          if (response.success && response.user) {
            if (response.token) {
              setApiSessionToken(response.token);
              await setCurrentSessionToken(response.token);
            }
            await setCurrentSessionUserId(response.user.id);
            setUser({
              ...response.user,
              displayName: response.user.username,
            });
            return;
          }
        } catch {
          // Public starter projects run without a backend by default.
        }

        const account = await findAccountByIdentifier(identifier.toLowerCase());
        if (!account || !(await verifyAccountPassword(account, password))) {
          throw new Error("Login failed.");
        }

        await setCurrentSessionToken(null);
        await setCurrentSessionUserId(account.id);
        setUser(normalizeUser(account));
      },
      async register(username, email, password) {
        try {
          const response = await registerRemote(username, email, password);
          if (response.success && response.user) {
            if (response.token) {
              setApiSessionToken(response.token);
              await setCurrentSessionToken(response.token);
            }
            await setCurrentSessionUserId(response.user.id);
            setUser({
              ...response.user,
              displayName: response.user.username,
            });
            return;
          }
        } catch {
          // Fall back to the bundled local demo account store.
        }

        const account = await createAccount({
          username,
          email,
          password,
          displayName: username,
        });
        if (!account) {
          throw new Error("Unable to create account.");
        }

        await setCurrentSessionToken(null);
        await setCurrentSessionUserId(account.id);
        setUser(normalizeUser(account));
      },
      async logout() {
        setApiSessionToken(null);
        await setCurrentSessionToken(null);
        await setCurrentSessionUserId(null);
        setUser(null);
      },
      async awardPoints(amountSpent) {
        if (!user) {
          return 0;
        }

        const earnedPoints = Math.max(1, Math.round(amountSpent));
        
        // 1. Update Cloud
        try {
          await syncPointsRemote(earnedPoints);
        } catch (error) {
          console.error("Cloud points sync failed:", error);
        }

        // 2. Update Local
        const updatedAccount = await updateAccountPoints(user.id, user.points + earnedPoints);
        if (updatedAccount) {
          setUser({
            ...user,
            points: updatedAccount.points,
          });
        }
        return earnedPoints;
      },
      async redeemReward(reward) {
        if (!user) {
          throw new Error("You must be logged in to redeem a reward.");
        }

        const result = await redeemRewardInDb(user.id, reward);
        if (!result.account) {
          throw new Error("Unable to update reward points.");
        }

        setUser(normalizeUser(result.account));
      },
      async updateProfile(username: string) {
        if (!user) return;
        const response = await (await import("../lib/api")).updateRemoteProfile(username);
        if (response.success) {
          // Update local DB if needed, but for now just update context state
          setUser({ ...user, displayName: username });
        } else {
          throw new Error(response.error || "Update failed.");
        }
      },
      async deleteAccount() {
        if (!user) return;
        const { deleteAccount: removeAccountFromDb } = await import("../lib/database");
        await removeAccountFromDb(user.id);
        await setCurrentSessionUserId(null);
        setUser(null);
      },
      isBiometricsEnabled,
      async toggleBiometrics(enabled: boolean) {
        if (enabled) {
          const compatible = await LocalAuthentication.hasHardwareAsync();
          if (!compatible) {
            Alert.alert("Not Supported", "Your device does not support biometric authentication.");
            return;
          }
          const enrolled = await LocalAuthentication.isEnrolledAsync();
          if (!enrolled) {
            Alert.alert("Not Set Up", "Please set up FaceID or Fingerprint in your device settings.");
            return;
          }
          
          // Verify identity once before enabling
          const result = await LocalAuthentication.authenticateAsync({
            promptMessage: "Confirm identity to enable Biometric Login",
          });
          if (!result.success) return;
        }
        
        await setBiometricsEnabledInDb(enabled);
        setIsBiometricsEnabled(enabled);
      },
      async authenticateWithBiometrics() {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: "Login to RestaurantApp",
          fallbackLabel: "Use Password",
        });
        return result.success;
      }
    }),
    [loading, user, isBiometricsEnabled],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}



