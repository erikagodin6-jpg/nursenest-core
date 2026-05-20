import "server-only";

import { SubscriptionStatus, type TierCode } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getProtectedRouteSession } from "@/lib/auth/protected-route-session";
import { getAdminModulePreviewAccess } from "@/lib/modules/admin-module-preview-access";
import { loadCanonicalLearnerAccessForUserId } from "@/lib/entitlements/canonical-learner-access.server";
import {
  activeLikePaidWindowOpen,
  cancelledPaidThroughActive,
} from "@/lib/entitlements/subscription-paid-access";
import {
  ADVANCED_LABS_ENTITLEMENT,
  isAdvancedLabsModuleEnabled,
  isAdvancedLabsTierEligible,
  isAdvancedLabsPlanCode,
} from "@/lib/advanced-labs/advanced-labs-module-config";
import {
  getAdvancedLabsModuleStatus,
  type AdvancedLabsModuleStatus,
} from "@/lib/advanced-labs/advanced-labs-module-status";

type EntitlementRow = {
  status: SubscriptionStatus;
  planCode: string | null;
  currentPeriodEnd: Date | null;
  trialEnd: Date | null;
  updatedAt: Date;
};

// ─── Access decision types ────────────────────────────────────────────────────

export type AdvancedLabsAccessBlockedReason =
  | "sign_in_required"
  | "module_unavailable"
  | "base_subscription_required"
  | "tier_not_eligible"
  | "advanced_labs_upgrade_required";

export type AdvancedLabsAccessDecision =
  | {
      ok: true;
      mode: "learner" | "admin-preview";
      userId: string;
      tier: TierCode | null;
      moduleStatus: AdvancedLabsModuleStatus;
      entitlementKey: typeof ADVANCED_LABS_ENTITLEMENT;
    }
  | {
      ok: false;
      reason: AdvancedLabsAccessBlockedReason;
      tier: TierCode | null;
      moduleStatus: AdvancedLabsModuleStatus;
      hasBaseAccess: boolean;
      hasAdvancedLabsEntitlement: boolean;
      entitlementKey: typeof ADVANCED_LABS_ENTITLEMENT;
    };

// ─── Entitlement row check ────────────────────────────────────────────────────

export function hasActiveAdvancedLabsEntitlementFromRows(
  rows: readonly EntitlementRow[],
  nowMs = Date.now(),
): boolean {
  return rows.some((row) => {
    if (!isAdvancedLabsPlanCode(row.planCode)) return false;
    if (row.status === SubscriptionStatus.PAST_DUE) return true;
    if (activeLikePaidWindowOpen(row, nowMs)) return true;
    // One-time purchases: currentPeriodEnd is null (lifetime) — ACTIVE status is sufficient
    if (row.status === SubscriptionStatus.ACTIVE && row.currentPeriodEnd === null) return true;
    return cancelledPaidThroughActive(row, nowMs);
  });
}

// ─── Access decision resolver ─────────────────────────────────────────────────

export function resolveAdvancedLabsAccessDecision(input: {
  moduleEnabled: boolean;
  moduleStatus: AdvancedLabsModuleStatus;
  adminPreview: boolean;
  userId: string;
  tier: TierCode | null;
  hasBaseAccess: boolean;
  hasAdvancedLabsEntitlement: boolean;
}): AdvancedLabsAccessDecision {
  if (input.adminPreview) {
    return {
      ok: true,
      mode: "admin-preview",
      userId: input.userId,
      tier: input.tier,
      moduleStatus: input.moduleStatus,
      entitlementKey: ADVANCED_LABS_ENTITLEMENT,
    };
  }
  if (!input.userId) {
    return {
      ok: false,
      reason: "sign_in_required",
      tier: input.tier,
      moduleStatus: input.moduleStatus,
      hasBaseAccess: false,
      hasAdvancedLabsEntitlement: false,
      entitlementKey: ADVANCED_LABS_ENTITLEMENT,
    };
  }
  if (!input.moduleEnabled || input.moduleStatus !== "published") {
    return {
      ok: false,
      reason: "module_unavailable",
      tier: input.tier,
      moduleStatus: input.moduleStatus,
      hasBaseAccess: input.hasBaseAccess,
      hasAdvancedLabsEntitlement: input.hasAdvancedLabsEntitlement,
      entitlementKey: ADVANCED_LABS_ENTITLEMENT,
    };
  }
  if (!input.hasBaseAccess) {
    return {
      ok: false,
      reason: "base_subscription_required",
      tier: input.tier,
      moduleStatus: input.moduleStatus,
      hasBaseAccess: false,
      hasAdvancedLabsEntitlement: input.hasAdvancedLabsEntitlement,
      entitlementKey: ADVANCED_LABS_ENTITLEMENT,
    };
  }
  if (!isAdvancedLabsTierEligible(input.tier)) {
    return {
      ok: false,
      reason: "tier_not_eligible",
      tier: input.tier,
      moduleStatus: input.moduleStatus,
      hasBaseAccess: input.hasBaseAccess,
      hasAdvancedLabsEntitlement: input.hasAdvancedLabsEntitlement,
      entitlementKey: ADVANCED_LABS_ENTITLEMENT,
    };
  }
  if (!input.hasAdvancedLabsEntitlement) {
    return {
      ok: false,
      reason: "advanced_labs_upgrade_required",
      tier: input.tier,
      moduleStatus: input.moduleStatus,
      hasBaseAccess: input.hasBaseAccess,
      hasAdvancedLabsEntitlement: false,
      entitlementKey: ADVANCED_LABS_ENTITLEMENT,
    };
  }
  return {
    ok: true,
    mode: "learner",
    userId: input.userId,
    tier: input.tier,
    moduleStatus: input.moduleStatus,
    entitlementKey: ADVANCED_LABS_ENTITLEMENT,
  };
}

// ─── Server action ────────────────────────────────────────────────────────────

export async function loadAdvancedLabsAccess(): Promise<AdvancedLabsAccessDecision> {
  const [session, moduleStatus] = await Promise.all([
    getProtectedRouteSession("modules.labs-advanced"),
    getAdvancedLabsModuleStatus(),
  ]);

  const userId = (
    (session as { user?: { id?: string | null } } | null)?.user?.id ?? ""
  ).trim();
  const moduleEnabled = isAdvancedLabsModuleEnabled();
  const adminPreview = await getAdminModulePreviewAccess({
    publicEnabled: moduleEnabled && moduleStatus === "published",
    surface: "modules.labs-advanced.admin-preview",
  });

  if (adminPreview.ok) {
    return resolveAdvancedLabsAccessDecision({
      moduleEnabled,
      moduleStatus,
      adminPreview: true,
      userId: adminPreview.userId,
      tier: null,
      hasBaseAccess: true,
      hasAdvancedLabsEntitlement: true,
    });
  }
  if (!userId) {
    return resolveAdvancedLabsAccessDecision({
      moduleEnabled,
      moduleStatus,
      adminPreview: false,
      userId,
      tier: null,
      hasBaseAccess: false,
      hasAdvancedLabsEntitlement: false,
    });
  }

  const [canonicalAccess, entitlementRows] = await Promise.all([
    loadCanonicalLearnerAccessForUserId(userId),
    prisma.subscription.findMany({
      where: {
        userId,
        status: {
          in: [
            SubscriptionStatus.ACTIVE,
            SubscriptionStatus.GRACE,
            SubscriptionStatus.PAST_DUE,
            SubscriptionStatus.CANCELLED,
          ],
        },
      },
      orderBy: { createdAt: "desc" },
      take: 16,
      select: {
        status: true,
        planCode: true,
        currentPeriodEnd: true,
        trialEnd: true,
        updatedAt: true,
      },
    }),
  ]);

  return resolveAdvancedLabsAccessDecision({
    moduleEnabled,
    moduleStatus,
    adminPreview: false,
    userId,
    tier: canonicalAccess.tier,
    hasBaseAccess: canonicalAccess.hasAccess,
    hasAdvancedLabsEntitlement: hasActiveAdvancedLabsEntitlementFromRows(entitlementRows),
  });
}
