import type { NextAuthConfig } from "next-auth";
import {
  JWT_SESSION_BRIEF_MAX_AGE_SEC,
  JWT_SESSION_REMEMBER_MAX_AGE_SEC,
} from "@/lib/auth/auth-session-constants";
import type { SessionUserRole } from "@/types/next-auth";

/**
 * Shared JWT + session callbacks for the Node auth handler and the Edge middleware
 * auth instance. Both must stay identical for the **base** JWT branch; the Node handler
 * replaces `jwt` with {@link nodeJwtCallback} to merge DB identity on `session.update()` and
 * enforce `credentialVersion` (see `src/lib/auth/node-jwt-callback.ts`).
 *
 * Trust boundary: do **not** merge `trigger === "update"` payloads from the browser into the JWT.
 * Callers may invoke `useSession().update()` after `/api/auth/sync-session`; the Node jwt callback
 * reloads tier/country/subscription/role from the database.
 */
export const authCallbacks: NonNullable<NextAuthConfig["callbacks"]> = {
  async jwt({ token, user, trigger: _trigger, session: _session }) {
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
        rememberMe?: boolean;
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

      const rememberMe = u.rememberMe !== false;
      const ttlSec = rememberMe ? JWT_SESSION_REMEMBER_MAX_AGE_SEC : JWT_SESSION_BRIEF_MAX_AGE_SEC;
      const nowSec = Math.floor(Date.now() / 1000);
      token.exp = nowSec + ttlSec;
      token.rememberLong = rememberMe;
      token.loginAtSec = nowSec;
      token.activityRollAtSec = nowSec;
    }
    return token;
  },
  async session({ session, token }) {
    if (!session.user) {
      return session;
    }
    const su = session.user as unknown as Record<string, unknown>;
    /** Stable strings for client hooks / headers — never leave `id` undefined after login. */
    const t = token as unknown as { sub?: unknown; id?: unknown };
    const fromSub = typeof t.sub === "string" && t.sub.length > 0 ? t.sub : "";
    const fromLegacyId = typeof t.id === "string" && t.id.length > 0 ? t.id : "";
    /** Align with `sessionJwtHasUserIdentity` / JWT fallback (`sub` OR legacy `id`). */
    const id = fromSub || fromLegacyId;
    su.id = id;
    su.email = typeof token.email === "string" ? token.email : "";
    su.name = typeof token.name === "string" && token.name.length > 0 ? token.name : su.email || "Learner";
    su.role = (token.role ?? "LEARNER") as SessionUserRole;
    su.country = (token.country === "CA" || token.country === "US" ? token.country : "US") as "CA" | "US";
    su.tier = (token.tier === "RPN" ||
    token.tier === "LVN_LPN" ||
    token.tier === "RN" ||
    token.tier === "NP" ||
    token.tier === "ALLIED" ||
    token.tier === "PRE_NURSING" ||
    token.tier === "NEW_GRAD"
      ? token.tier
      : "RN") as typeof token.tier;
    su.alliedProfessionKey =
      typeof token.alliedProfessionKey === "string" ? token.alliedProfessionKey : null;
    su.subscriptionStatus =
      token.subscriptionStatus === "active" ||
      token.subscriptionStatus === "grace" ||
      token.subscriptionStatus === "past_due_grace" ||
      token.subscriptionStatus === "past_due"
        ? token.subscriptionStatus
        : "none";
    su.credentialVersion = typeof token.credentialVersion === "number" ? token.credentialVersion : 0;
    return session;
  },
};
