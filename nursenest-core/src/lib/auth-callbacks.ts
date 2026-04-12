import type { NextAuthConfig } from "next-auth";

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
      }>;
      if (s.tier !== undefined) token.tier = s.tier;
      if (s.country !== undefined) token.country = s.country;
      if (s.subscriptionStatus !== undefined) token.subscriptionStatus = s.subscriptionStatus;
    }
    return token;
  },
  async session({ session, token }) {
    if (session.user) {
      const su = session.user as unknown as Record<string, unknown>;
      if (token.sub) su.id = token.sub;
      if (token.email !== undefined && token.email !== null) su.email = token.email as string;
      if (token.name !== undefined && token.name !== null) su.name = token.name as string;
      su.role = token.role;
      su.country = token.country;
      su.tier = token.tier;
      su.alliedProfessionKey = token.alliedProfessionKey ?? null;
      su.subscriptionStatus = token.subscriptionStatus;
      su.credentialVersion =
        typeof token.credentialVersion === "number" ? token.credentialVersion : 0;
    }
    return session;
  },
};
