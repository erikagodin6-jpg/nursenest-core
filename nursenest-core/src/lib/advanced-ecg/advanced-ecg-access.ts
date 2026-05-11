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
  ADVANCED_ECG_MODULE_ENTITLEMENT,
  isAdvancedEcgModuleEnabled,
  isAdvancedEcgPlanCode,
  isAdvancedEcgTierEligible,
} from "@/lib/advanced-ecg/advanced-ecg-module-config";
import { resolveEcgModuleEntitlements } from "@/lib/ecg-module/ecg-access-resolution";
import { getAdvancedEcgModuleStatus, type AdvancedEcgModuleStatus } from "@/lib/advanced-ecg/advanced-ecg-module-status";

type AdvancedEcgRouteSession = {
  user?: { id?: string | null };
} | null;

type AdvancedEcgEntitlementRow = {
  status: SubscriptionStatus;
  planCode: string | null;
  currentPeriodEnd: Date | null;
  trialEnd: Date | null;
  updatedAt: Date;
};

export type AdvancedEcgAccessBlockedReason =
  | "sign_in_required"
  | "module_unavailable"
  | "base_subscription_required"
  | "tier_not_eligible"
  | "advanced_ecg_upgrade_required";

export type AdvancedEcgAccessDecision =
  | {
      ok: true;
      mode: "learner" | "admin-preview";
      userId: string;
      tier: TierCode | null;
      moduleStatus: AdvancedEcgModuleStatus;
      entitlementKey: typeof ADVANCED_ECG_MODULE_ENTITLEMENT;
    }
  | {
      ok: false;
      reason: AdvancedEcgAccessBlockedReason;
      tier: TierCode | null;
      moduleStatus: AdvancedEcgModuleStatus;
      hasBaseAccess: boolean;
      hasAdvancedEcgEntitlement: boolean;
      entitlementKey: typeof ADVANCED_ECG_MODULE_ENTITLEMENT;
    };

export function resolveAdvancedEcgAccessDecision(input: {
  moduleEnabled: boolean;
  moduleStatus: AdvancedEcgModuleStatus;
  adminPreview: boolean;
  userId: string;
  tier: TierCode | null;
  hasBaseAccess: boolean;
  hasAdvancedEcgEntitlement: boolean;
}): AdvancedEcgAccessDecision {
  if (input.adminPreview) {
    return {
      ok: true,
      mode: "admin-preview",
      userId: input.userId,
      tier: input.tier,
      moduleStatus: input.moduleStatus,
      entitlementKey: ADVANCED_ECG_MODULE_ENTITLEMENT,
    };
  }
  if (!input.userId) {
    return {
      ok: false,
      reason: "sign_in_required",
      tier: input.tier,
      moduleStatus: input.moduleStatus,
      hasBaseAccess: false,
      hasAdvancedEcgEntitlement: false,
      entitlementKey: ADVANCED_ECG_MODULE_ENTITLEMENT,
    };
  }
  if (!input.moduleEnabled || input.moduleStatus !== "published") {
    return {
      ok: false,
      reason: "module_unavailable",
      tier: input.tier,
      moduleStatus: input.moduleStatus,
      hasBaseAccess: input.hasBaseAccess,
      hasAdvancedEcgEntitlement: input.hasAdvancedEcgEntitlement,
      entitlementKey: ADVANCED_ECG_MODULE_ENTITLEMENT,
    };
  }
  const entitlements = resolveEcgModuleEntitlements({
    hasBaseLearnerAccess: input.hasBaseAccess,
    hasAdvancedEcgEntitlement: input.hasAdvancedEcgEntitlement,
  });
  if (!entitlements.hasBasicEcgAccess) {
    return {
      ok: false,
      reason: "base_subscription_required",
      tier: input.tier,
      moduleStatus: input.moduleStatus,
      hasBaseAccess: false,
      hasAdvancedEcgEntitlement: input.hasAdvancedEcgEntitlement,
      entitlementKey: ADVANCED_ECG_MODULE_ENTITLEMENT,
    };
  }
  if (!isAdvancedEcgTierEligible(input.tier)) {
    return {
      ok: false,
      reason: "tier_not_eligible",
      tier: input.tier,
      moduleStatus: input.moduleStatus,
      hasBaseAccess: input.hasBaseAccess,
      hasAdvancedEcgEntitlement: input.hasAdvancedEcgEntitlement,
      entitlementKey: ADVANCED_ECG_MODULE_ENTITLEMENT,
    };
  }
  if (!entitlements.hasAdvancedEcgAccess) {
    return {
      ok: false,
      reason: "advanced_ecg_upgrade_required",
      tier: input.tier,
      moduleStatus: input.moduleStatus,
      hasBaseAccess: input.hasBaseAccess,
      hasAdvancedEcgEntitlement: false,
      entitlementKey: ADVANCED_ECG_MODULE_ENTITLEMENT,
    };
  }
  return {
    ok: true,
    mode: "learner",
    userId: input.userId,
    tier: input.tier,
    moduleStatus: input.moduleStatus,
    entitlementKey: ADVANCED_ECG_MODULE_ENTITLEMENT,
  };
}

export function hasActiveAdvancedEcgEntitlementFromRows(
  rows: readonly AdvancedEcgEntitlementRow[],
  nowMs = Date.now(),
): boolean {
  return rows.some((row) => {
    if (!isAdvancedEcgPlanCode(row.planCode)) return false;
    if (row.status === SubscriptionStatus.PAST_DUE) return true;
    if (activeLikePaidWindowOpen(row, nowMs)) return true;
    return cancelledPaidThroughActive(row, nowMs);
  });
}

export async function loadAdvancedEcgAccess(): Promise<AdvancedEcgAccessDecision> {
  const [session, moduleStatus] = await Promise.all([
    getProtectedRouteSession("modules.ecg-advanced"),
    getAdvancedEcgModuleStatus(),
  ]);

  const userId = ((session as AdvancedEcgRouteSession)?.user?.id ?? "").trim();
  const moduleEnabled = isAdvancedEcgModuleEnabled();
  const adminPreview = await getAdminModulePreviewAccess({
    publicEnabled: moduleEnabled && moduleStatus === "published",
    surface: "modules.ecg-advanced.admin-preview",
  });

  if (adminPreview.ok) {
    return resolveAdvancedEcgAccessDecision({
      moduleEnabled,
      moduleStatus,
      adminPreview: true,
      userId: adminPreview.userId,
      tier: null,
      hasBaseAccess: true,
      hasAdvancedEcgEntitlement: true,
    });
  }

  if (!userId) {
    return resolveAdvancedEcgAccessDecision({
      moduleEnabled,
      moduleStatus,
      adminPreview: false,
      userId,
      tier: null,
      hasBaseAccess: false,
      hasAdvancedEcgEntitlement: false,
    });
  }

  const [canonicalAccess, entitlementRows] = await Promise.all([
    loadCanonicalLearnerAccessForUserId(userId),
    prisma.subscription.findMany({
      where: { userId, status: { in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.GRACE, SubscriptionStatus.PAST_DUE, SubscriptionStatus.CANCELLED] } },
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

  return resolveAdvancedEcgAccessDecision({
    moduleEnabled,
    moduleStatus,
    adminPreview: false,
    userId,
    tier: canonicalAccess.tier,
    hasBaseAccess: canonicalAccess.hasAccess,
    hasAdvancedEcgEntitlement: hasActiveAdvancedEcgEntitlementFromRows(entitlementRows),
  });
}
