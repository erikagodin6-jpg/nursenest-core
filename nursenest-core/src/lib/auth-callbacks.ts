import type { NextAuthConfig } from "next-auth";

/**
 * Shared JWT + session callbacks for the Node auth handler and the Edge middleware
 * auth instance. Both must stay identical so session tokens validate everywhere.
 */
export const authCallbacks: NonNullable<NextAuthConfig["callbacks"]> = {
  async jwt({ token, user }) {
    if (user) {
      token.role = (user as any).role;
      token.country = (user as any).country;
      token.tier = (user as any).tier;
      token.subscriptionStatus = (user as any).subscriptionStatus;
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
