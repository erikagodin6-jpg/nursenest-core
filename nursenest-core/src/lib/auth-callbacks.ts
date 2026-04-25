import type { NextAuthConfig } from "next-auth";
import {
  JWT_SESSION_BRIEF_MAX_AGE_SEC,
  JWT_SESSION_REMEMBER_MAX_AGE_SEC,
} from "@/lib/auth/auth-session-constants";
import type { SessionUserRole } from "@/types/next-auth";

type AuthUserLike = {
  id?: string;
  email?: string | null;
  name?: string | null;
  role?: unknown;
  country?: unknown;
  tier?: unknown;
  alliedProfessionKey?: unknown;
  subscriptionStatus?: unknown;
  credentialVersion?: unknown;
  rememberMe?: boolean;
};

function asStringOrEmpty(value: unknown): string {
  return typeof value === "string" && value.length > 0 ? value : "";
}

function normalizeCountry(value: unknown): "CA" | "US" {
  return value === "CA" || value === "US" ? value : "US";
}

function normalizeTier(value: unknown) {
  return value === "RPN" ||
    value === "LVN_LPN" ||
    value === "RN" ||
    value === "NP" ||
    value === "ALLIED" ||
    value === "PRE_NURSING" ||
    value === "NEW_GRAD"
    ? value
    : "RN";
}

function normalizeSubscriptionStatus(value: unknown) {
  return value === "active" ||
    value === "grace" ||
    value === "past_due_grace" ||
    value === "past_due"
    ? value
    : "none";
}

export const authCallbacks: NonNullable<NextAuthConfig["callbacks"]> = {
  async jwt({ token, user }) {
    if (!user) return token;

    const u = user as AuthUserLike;

    if (typeof u.id === "string" && u.id.length > 0) {
      token.sub = u.id;
    }

    if (u.email !== undefined) token.email = u.email;
    if (u.name !== undefined) token.name = u.name;

    token.role = u.role as typeof token.role;
    token.country = normalizeCountry(u.country) as typeof token.country;
    token.tier = normalizeTier(u.tier) as typeof token.tier;
    token.alliedProfessionKey =
      typeof u.alliedProfessionKey === "string" && u.alliedProfessionKey.length > 0
        ? u.alliedProfessionKey
        : null;
    token.subscriptionStatus = normalizeSubscriptionStatus(
      u.subscriptionStatus,
    ) as typeof token.subscriptionStatus;
    token.credentialVersion =
      typeof u.credentialVersion === "number" && Number.isFinite(u.credentialVersion)
        ? u.credentialVersion
        : 0;

    const rememberMe = u.rememberMe !== false;
    const ttlSec = rememberMe ? JWT_SESSION_REMEMBER_MAX_AGE_SEC : JWT_SESSION_BRIEF_MAX_AGE_SEC;
    const nowSec = Math.floor(Date.now() / 1000);

    token.exp = nowSec + ttlSec;
    token.rememberLong = rememberMe;
    token.loginAtSec = nowSec;
    token.activityRollAtSec = nowSec;

    return token;
  },

  async session({ session, token }) {
    if (!session.user) return session;

    const su = session.user as unknown as Record<string, unknown>;
    const legacy = token as unknown as { sub?: unknown; id?: unknown };

    const id = asStringOrEmpty(legacy.sub) || asStringOrEmpty(legacy.id);
    const email = asStringOrEmpty(token.email);
    const name = asStringOrEmpty(token.name) || email || "Learner";

    su.id = id;
    su.email = email;
    su.name = name;
    su.role = (token.role ?? "LEARNER") as SessionUserRole;
    su.country = normalizeCountry(token.country);
    su.tier = normalizeTier(token.tier);
    su.alliedProfessionKey =
      typeof token.alliedProfessionKey === "string" && token.alliedProfessionKey.length > 0
        ? token.alliedProfessionKey
        : null;
    su.subscriptionStatus = normalizeSubscriptionStatus(token.subscriptionStatus);
    su.credentialVersion =
      typeof token.credentialVersion === "number" && Number.isFinite(token.credentialVersion)
        ? token.credentialVersion
        : 0;

    return session;
  },
};