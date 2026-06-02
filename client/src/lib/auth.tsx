import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type User = {
  id: string;
  username: string;
  tier: string;
  subscriptionStatus: string;
  email?: string;
  region?: string;
  displayName?: string | null;
  country?: string | null;
  examTrack?: string | null;
  careerType?: string | null;
  onboardingComplete?: boolean;
  testerAccess?: boolean;
  testerExpiry?: string | null;
  preferredTheme?: string | null;
  isLifetime?: boolean;
};

type AuthContextType = {
  user: User | null;
  login: (identifier: string, password: string) => Promise<void>;
  register: (username: string, password: string, email: string, inviteCode?: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  resetPassword: (token: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  isLoading: boolean;
  hasAccess: (requiredTier: string) => boolean;
  previewTier: string | null;
  setPreviewTier: (tier: string | null) => void;
  effectiveTier: string;
  isAdmin: boolean;
  isTester: boolean;
};

type LoginResponse = {
  id: string;
  username: string;
  tier: string;
  subscriptionStatus: string;
  email?: string;
  region?: string;
  testerAccess?: boolean;
  testerExpiry?: string | null;
  preferredTheme?: string | null;
  accessToken?: string;
  expiresInSeconds?: number;
  userToken?: string;
  userTokenExpiry?: string;
};

type RegisterResponse = {
  id: string;
  username: string;
  email?: string;
  tier: string;
  subscriptionStatus: string;
  testerAccess?: boolean;
  testerExpiry?: string | null;
  userToken?: string;
};

const AuthContext = createContext<AuthContextType | null>(null);

function getUserToken(): string | null {
  try {
    return localStorage.getItem("nursenest-user-token");
  } catch {
    return null;
  }
}

function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = getUserToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const adminToken = getAdminAccessToken();
  if (adminToken) {
    headers["Authorization"] = `Bearer ${adminToken}`;
  }
  return headers;
}

export function getAdminAccessToken(): string | null {
  try {
    const token = localStorage.getItem("nn_admin_access_token");
    const expiresAt = localStorage.getItem("nn_admin_expires_at");
    if (!token) return null;
    if (expiresAt && Date.now() > Number(expiresAt)) {
      localStorage.removeItem("nn_admin_access_token");
      localStorage.removeItem("nn_admin_expires_at");
      return null;
    }
    return token;
  } catch {
    return null;
  }
}

export function clearAdminToken() {
  try {
    localStorage.removeItem("nn_admin_access_token");
    localStorage.removeItem("nn_admin_expires_at");
  } catch {}
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [previewTier, setPreviewTierState] = useState<string | null>(null);

  async function syncPreviewFromServer() {
    try {
      const res = await fetch("/api/admin/preview-mode", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        if (data.active && data.mode) {
          setPreviewTierState(data.mode);
          localStorage.setItem("nursenest-preview-tier", data.mode);
        } else {
          setPreviewTierState(null);
          localStorage.removeItem("nursenest-preview-tier");
        }
      }
    } catch {}
  }

  function setPreviewTier(tier: string | null) {
    setPreviewTierState(tier);
    if (tier) {
      localStorage.setItem("nursenest-preview-tier", tier);
    } else {
      localStorage.removeItem("nursenest-preview-tier");
    }
  }

  async function restoreSessionFromToken() {
    const token = getUserToken();
    if (!token) return null;

    try {
      const res = await fetch("/api/auth/me", {
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (!res.ok) {
        localStorage.removeItem("nursenest-user-token");
        localStorage.removeItem("nursenest-user");
        return null;
      }
      const data = await res.json();
      if (data?.tier === "admin") {
        await syncPreviewFromServer();
      }
      const userData: User = {
        id: data.id,
        username: data.username,
        tier: data.tier,
        subscriptionStatus: data.subscriptionStatus,
        email: data.email,
        region: data.region,
        displayName: data.displayName,
        country: data.country,
        examTrack: data.examTrack,
        careerType: data.careerType,
        onboardingComplete: data.onboardingComplete,
        testerAccess: data.testerAccess,
        testerExpiry: data.testerExpiry,
        preferredTheme: data.preferredTheme,
        isLifetime: data.isLifetime,
      };
      setUser(userData);
      localStorage.setItem("nursenest-user", JSON.stringify(userData));
      return userData;
    } catch {
      return null;
    }
  }

  useEffect(() => {
    (async () => {
      const restored = await restoreSessionFromToken();
      if (!restored) {
        setUser(null);
        localStorage.removeItem("nursenest-user");
      }
      setIsLoading(false);
    })();
  }, []);

  async function login(identifier: string, password: string) {
    const isEmail = identifier.includes("@");
    const body: Record<string, string> = { password };
    if (isEmail) {
      body.email = identifier;
    } else {
      body.username = identifier;
    }

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err: { error?: string } = await res.json().catch(() => ({}));
      throw new Error(err.error || "Login failed");
    }

    const data: LoginResponse = await res.json();
    if (data.accessToken) {
      localStorage.setItem("nn_admin_access_token", data.accessToken);
      const expiresAt = Date.now() + (data.expiresInSeconds || 1800) * 1000;
      localStorage.setItem("nn_admin_expires_at", String(expiresAt));
    }
    if (data.userToken) {
      localStorage.setItem("nursenest-user-token", data.userToken);
    }
    if (data.tier === "admin") {
      await syncPreviewFromServer();
    }
    localStorage.setItem("nursenest-credentials", JSON.stringify({ username: data.username || identifier, password: body.password || "" }));
    const userData: User = {
      id: data.id,
      username: data.username,
      tier: data.tier,
      subscriptionStatus: data.subscriptionStatus,
      email: data.email,
      region: data.region,
      testerAccess: data.testerAccess,
      testerExpiry: data.testerExpiry,
      preferredTheme: data.preferredTheme,
    };
    setUser(userData);
    localStorage.setItem("nursenest-user", JSON.stringify(userData));
  }

  async function register(username: string, password: string, email: string, inviteCode?: string, referralCode?: string) {
    const registerBody: Record<string, string> = { username, password, email };
    if (inviteCode) registerBody.inviteCode = inviteCode;
    if (referralCode) registerBody.referralCode = referralCode;
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registerBody),
    });

    if (!res.ok) {
      const err: { error?: string } = await res.json().catch(() => ({}));
      throw new Error(err.error || "Registration failed");
    }

    const data: RegisterResponse = await res.json();
    if (data.userToken) {
      localStorage.setItem("nursenest-user-token", data.userToken);
    }
    localStorage.setItem("nursenest-credentials", JSON.stringify({ username, password }));
    const userData: User = {
      id: data.id,
      username: data.username,
      email: data.email,
      tier: data.tier,
      subscriptionStatus: data.subscriptionStatus,
      testerAccess: data.testerAccess,
      testerExpiry: data.testerExpiry,
    };
    setUser(userData);
    localStorage.setItem("nursenest-user", JSON.stringify(userData));
  }

  function logout() {
    setUser(null);
    setPreviewTier(null);
    localStorage.removeItem("nursenest-user");
    localStorage.removeItem("nursenest-credentials");
    localStorage.removeItem("nursenest-user-token");
    localStorage.removeItem("nursenest-admin-api-key");
    clearAdminToken();
    fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
  }

  async function refreshUser() {
    await restoreSessionFromToken();
  }

  async function forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Failed to send reset email");
    }
    return data;
  }

  async function resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Failed to reset password");
    }
    return data;
  }

  const isAdmin = user?.tier === "admin";
  const effectiveTier = previewTier ?? (user?.tier || "free");

  const isTester = !!(user?.testerAccess && (!user.testerExpiry || new Date(user.testerExpiry) > new Date()));

  function hasAccess(requiredTier: string): boolean {
    if (!user) return false;
    if (isAdmin && !previewTier) return true;
    if (isTester) return true;
    if (effectiveTier === "full_access") return true;
    if (requiredTier === "new_grad_toolkit" && (effectiveTier === "new_grad_toolkit" || effectiveTier === "full_access")) return true;
    if (requiredTier === "certification_prep" && (effectiveTier === "certification_prep" || effectiveTier === "full_access")) return true;
    const hierarchy: Record<string, number> = { free: 0, rpn: 1, rn: 2, np: 3, admin: 4 };
    const userLevel = hierarchy[effectiveTier] ?? 0;
    const requiredLevel = hierarchy[requiredTier] ?? 0;
    return userLevel >= requiredLevel;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        refreshUser,
        forgotPassword,
        resetPassword,
        isLoading,
        hasAccess,
        previewTier,
        setPreviewTier,
        effectiveTier,
        isAdmin,
        isTester,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
