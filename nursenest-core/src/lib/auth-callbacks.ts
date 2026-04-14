import type { NextAuthConfig } from "next-auth";
import type { SessionUserRole } from "@/types/next-auth";

/** Validate client-supplied role on `update()` so JWT cannot be escalated with arbitrary strings. */
function sessionRoleFromUpdate(value: unknown): SessionUserRole | undefined {
  if (typeof value !== "string") return undefined;
  const r = value.trim().toUpperCase();
  if (
    r === "LEARNER" ||
    r === "ADMIN" ||
    r === "SUPER_ADMIN" ||
    r === "CONTENT_ADMIN" ||
    r === "SUPPORT_ADMIN"
  ) {
    return r;
  }
  return undefined;
}

/**
 * Shared JWT + session callbacks for the Node auth handler and the Edge middleware
 * auth instance. Both must stay identical so session tokens validate everywhere.
 */
export const authCallbacks: NonNullable<NextAuthConfig["callbacks"]> = {
  async jwt({ token, user, trigger, session }) {
    if (user) {
      const u = user as {
        id?: string;
        email?: string | null;
        name?: string | null;
        role?: unknown;
        country?: unknown;
        tier?: unknown;
        alliedProfessionKey?: unknown;
        subscriptionStatus?: unknown;
        credentialVersion?: unknown;
      };
      if (u.id) token.sub = u.id;
      if (u.email !== undefined) token.email = u.email;
      if (u.name !== undefined) token.name = u.name;
      token.role = u.role as typeof token.role;
      token.country = u.country as typeof token.country;
      token.tier = u.tier as typeof token.tier;
      token.alliedProfessionKey =
        typeof u.alliedProfessionKey === "string" ? u.alliedProfessionKey : null;
      token.subscriptionStatus = u.subscriptionStatus as typeof token.subscriptionStatus;
      token.credentialVersion =
        typeof u.credentialVersion === "number" ? u.credentialVersion : 0;
    }
    if (trigger === "update" && session && typeof session === "object") {
      const s = session as Partial<{
        tier: typeof token.tier;
        country: typeof token.country;
        subscriptionStatus: typeof token.subscriptionStatus;
        role: unknown;
      }>;
      if (s.tier !== undefined) token.tier = s.tier;
      if (s.country !== undefined) token.country = s.country;
      if (s.subscriptionStatus !== undefined) token.subscriptionStatus = s.subscriptionStatus;
      const nextRole = sessionRoleFromUpdate(s.role);
      if (nextRole !== undefined) token.role = nextRole;
    }
    return token;
  },
  async session({ session, token }) {
    if (!session.user) {
      return session;
    }
    const su = session.user as unknown as Record<string, unknown>;
    /** Stable strings for client hooks / headers — never leave `id` undefined after login. */
    const id = typeof token.sub === "string" && token.sub.length > 0 ? token.sub : "";
    su.id = id;
    su.email = typeof token.email === "string" ? token.email : "";
    su.name = typeof token.name === "string" && token.name.length > 0 ? token.name : su.email || "Learner";
    su.role = (token.role ?? "LEARNER") as SessionUserRole;
    su.country = (token.country === "CA" || token.country === "US" ? token.country : "US") as "CA" | "US";
    su.tier = (token.tier === "RPN" ||
    token.tier === "LVN_LPN" ||
    token.tier === "RN" ||
    token.tier === "NP" ||
    token.tier === "ALLIED"
      ? token.tier
      : "RN") as typeof token.tier;
    su.alliedProfessionKey =
      typeof token.alliedProfessionKey === "string" ? token.alliedProfessionKey : null;
    su.subscriptionStatus =
      token.subscriptionStatus === "active" ||
      token.subscriptionStatus === "grace" ||
      token.subscriptionStatus === "past_due"
        ? token.subscriptionStatus
        : "none";
    su.credentialVersion = typeof token.credentialVersion === "number" ? token.credentialVersion : 0;
    return session;
  },
};
