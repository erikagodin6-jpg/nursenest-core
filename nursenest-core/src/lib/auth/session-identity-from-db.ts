import "server-only";

import type { TierCode, UserRole } from "@prisma/client";
import {
  getUserAccess,
  subscriptionStatusForSession,
  type SessionSubscriptionStatus,
} from "@/lib/entitlements/get-user-access";
import { prisma } from "@/lib/db";
import type { SessionUserRole } from "@/types/next-auth";

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

/**
 * Authoritative session identity for JWT + `/api/auth/sync-session` (DB — never trust client `session.update` alone).
 */
export async function getSessionIdentityPayload(userId: string): Promise<SessionIdentityPayload | null> {
  const userRow = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true, credentialVersion: true },
  });
  if (!userRow) return null;

  const userAccess = await getUserAccess(userId);
  const subscriptionStatus = subscriptionStatusForSession(userAccess);

  return {
    tier: userAccess.allowedProfession.tier,
    country: userAccess.allowedRegion.country,
    subscriptionStatus,
    role: roleToSessionRole(userRow.role),
    credentialVersion: userRow.credentialVersion ?? 0,
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
