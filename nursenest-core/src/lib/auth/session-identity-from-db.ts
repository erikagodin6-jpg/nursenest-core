import "server-only";

import type { TierCode, UserRole } from "@prisma/client";
import {
  getUserAccess,
  subscriptionStatusForSession,
  type SessionSubscriptionStatus,
  type UserAccess,
} from "@/lib/entitlements/get-user-access";
import type { SessionUserRole } from "@/types/next-auth";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export type SessionIdentityPayload = {
  tier: TierCode | null;
  country: "CA" | "US" | null;
  subscriptionStatus: SessionSubscriptionStatus;
  role: SessionUserRole;
  credentialVersion: number;
  subscription: {
    planCode: string | null;
    planDuration: string | null;
    planStatus: string;
    expiresAt: string | null;
    billingRegionSlug: string | null;
    examPathwayId: string | null;
  };
};

function roleToSessionRole(role: UserRole): SessionUserRole {
  const r = String(role).toUpperCase();
  if (
    r === "LEARNER" ||
    r === "ADMIN" ||
    r === "SUPER_ADMIN" ||
    r === "CONTENT_ADMIN" ||
    r === "SUPPORT_ADMIN"
  ) {
    return r as SessionUserRole;
  }
  return "LEARNER";
}

/** Load outcome so callers can return 503 vs 404 and avoid throwing out of JWT `update`. */
export type SessionIdentityLoadResult =
  | { status: "ok"; payload: SessionIdentityPayload }
  | { status: "not_found" }
  | { status: "db_unavailable" };

function buildSessionIdentityPayload(userAccess: UserAccess & { sessionJwt: NonNullable<UserAccess["sessionJwt"]> }): SessionIdentityPayload {
  const subscriptionStatus = subscriptionStatusForSession(userAccess);
  const sj = userAccess.sessionJwt;
  return {
    tier: userAccess.allowedProfession.tier,
    country: userAccess.allowedRegion.country,
    subscriptionStatus,
    role: roleToSessionRole(sj.role),
    credentialVersion: sj.credentialVersion,
    subscription: {
      planCode: userAccess.plan.planCode,
      planDuration: userAccess.plan.duration,
      planStatus: userAccess.plan.status,
      expiresAt: userAccess.plan.expiresAt?.toISOString() ?? null,
      billingRegionSlug: userAccess.allowedRegion.billingRegionSlug,
      examPathwayId: userAccess.allowedExam.pathwayId,
    },
  };
}

/**
 * Authoritative session identity for JWT + `/api/auth/sync-session` (DB — never trust client `session.update` alone).
 * Distinguishes missing user vs Prisma/read failure so paid flows do not silently map DB errors to "not found".
 */
export async function loadSessionIdentityResult(userId: string): Promise<SessionIdentityLoadResult> {
  let userAccess: Awaited<ReturnType<typeof getUserAccess>>;
  try {
    userAccess = await getUserAccess(userId);
  } catch (e) {
    safeServerLog("entitlement", "session_identity_get_user_access_failed", {
      userIdPrefix: userId.slice(0, 8),
      errorName: e instanceof Error ? e.name : typeof e,
      severity: "warning",
    });
    return { status: "db_unavailable" };
  }
  if (!userAccess.sessionJwt) return { status: "not_found" };
  return { status: "ok", payload: buildSessionIdentityPayload({ ...userAccess, sessionJwt: userAccess.sessionJwt }) };
}
