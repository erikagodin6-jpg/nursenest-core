import type { NextAuthConfig } from "next-auth";

/**
 * Shared JWT + session callbacks for the Node auth handler and the Edge middleware
 * auth instance. Both must stay identical so session tokens validate everywhere.
 */
export const authCallbacks: NonNullable<NextAuthConfig["callbacks"]> = {
  async jwt({ token, user }) {
    if (user) {
      const u = user as {
        id?: string;
        role?: unknown;
        country?: unknown;
        tier?: unknown;
        subscriptionStatus?: unknown;
      };
      if (u.id) token.sub = u.id;
      token.role = u.role as typeof token.role;
      token.country = u.country as typeof token.country;
      token.tier = u.tier as typeof token.tier;
      token.subscriptionStatus = u.subscriptionStatus as typeof token.subscriptionStatus;
    }
    return token;
  },
  async session({ session, token }) {
    if (session.user) {
      (session.user as any).id = token.sub;
      (session.user as any).role = token.role;
      (session.user as any).country = token.country;
      (session.user as any).tier = token.tier;
      (session.user as any).subscriptionStatus = token.subscriptionStatus;
    }
    return session;
  },
};
