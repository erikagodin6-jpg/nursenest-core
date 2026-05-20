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
  HEMODYNAMICS_FUNDAMENTALS_ENTITLEMENT,
  ADVANCED_HEMODYNAMICS_ENTITLEMENT,
  isHemodynamicsModuleEnabled,
  isAdvancedHemodynamicsModuleEnabled,
  isHemodynamicsFundamentalsTierEligible,
  isAdvancedHemodynamicsTierEligible,
  isAdvancedHemodynamicsPlanCode,
} from "@/lib/advanced-hemodynamics/advanced-hemodynamics-module-config";
import { getHemodynamicsModuleStatus, getAdvancedHemodynamicsModuleStatus, type HemodynamicsModuleStatus } from "@/lib/advanced-hemodynamics/advanced-hemodynamics-module-status";

type EntitlementRow = {
  status: SubscriptionStatus;
  planCode: string | null;
  currentPeriodEnd: Date | null;
  trialEnd: Date | null;
  updatedAt: Date;
};

// ─── Hemodynamics Fundamentals (included with RN/NP) ───────────────────────────

export type HemodynamicsAccessBlockedReason =
  | "sign_in_required"
  | "module_unavailable"
  | "base_subscription_required"
  | "tier_not_eligible";

export type HemodynamicsAccessDecision =
  | {
      ok: true;
      mode: "learner" | "admin-preview";
      userId: string;
      tier: TierCode | null;
      moduleStatus: HemodynamicsModuleStatus;
      entitlementKey: typeof HEMODYNAMICS_FUNDAMENTALS_ENTITLEMENT;
    }
  | {
      ok: false;
      reason: HemodynamicsAccessBlockedReason;
      tier: TierCode | null;
      moduleStatus: HemodynamicsModuleStatus;
      hasBaseAccess: boolean;
      entitlementKey: typeof HEMODYNAMICS_FUNDAMENTALS_ENTITLEMENT;
    };

export function resolveHemodynamicsAccessDecision(input: {
  moduleEnabled: boolean;
  moduleStatus: HemodynamicsModuleStatus;
  adminPreview: boolean;
  userId: string;
  tier: TierCode | null;
  hasBaseAccess: boolean;
}): HemodynamicsAccessDecision {
  if (input.adminPreview) {
    return { ok: true, mode: "admin-preview", userId: input.userId, tier: input.tier, moduleStatus: input.moduleStatus, entitlementKey: HEMODYNAMICS_FUNDAMENTALS_ENTITLEMENT };
  }
  if (!input.userId) {
    return { ok: false, reason: "sign_in_required", tier: input.tier, moduleStatus: input.moduleStatus, hasBaseAccess: false, entitlementKey: HEMODYNAMICS_FUNDAMENTALS_ENTITLEMENT };
  }
  if (!input.moduleEnabled || input.moduleStatus !== "published") {
    return { ok: false, reason: "module_unavailable", tier: input.tier, moduleStatus: input.moduleStatus, hasBaseAccess: input.hasBaseAccess, entitlementKey: HEMODYNAMICS_FUNDAMENTALS_ENTITLEMENT };
  }
  if (!input.hasBaseAccess) {
    return { ok: false, reason: "base_subscription_required", tier: input.tier, moduleStatus: input.moduleStatus, hasBaseAccess: false, entitlementKey: HEMODYNAMICS_FUNDAMENTALS_ENTITLEMENT };
  }
  if (!isHemodynamicsFundamentalsTierEligible(input.tier)) {
    return { ok: false, reason: "tier_not_eligible", tier: input.tier, moduleStatus: input.moduleStatus, hasBaseAccess: input.hasBaseAccess, entitlementKey: HEMODYNAMICS_FUNDAMENTALS_ENTITLEMENT };
  }
  return { ok: true, mode: "learner", userId: input.userId, tier: input.tier, moduleStatus: input.moduleStatus, entitlementKey: HEMODYNAMICS_FUNDAMENTALS_ENTITLEMENT };
}

export async function loadHemodynamicsAccess(): Promise<HemodynamicsAccessDecision> {
  const [session, moduleStatus] = await Promise.all([
    getProtectedRouteSession("modules.hemodynamics"),
    getHemodynamicsModuleStatus(),
  ]);

  const userId = ((session as { user?: { id?: string | null } } | null)?.user?.id ?? "").trim();
  const moduleEnabled = isHemodynamicsModuleEnabled();
  const adminPreview = await getAdminModulePreviewAccess({
    publicEnabled: moduleEnabled && moduleStatus === "published",
    surface: "modules.hemodynamics.admin-preview",
  });

  if (adminPreview.ok) {
    return resolveHemodynamicsAccessDecision({ moduleEnabled, moduleStatus, adminPreview: true, userId: adminPreview.userId, tier: null, hasBaseAccess: true });
  }
  if (!userId) {
    return resolveHemodynamicsAccessDecision({ moduleEnabled, moduleStatus, adminPreview: false, userId, tier: null, hasBaseAccess: false });
  }

  const canonicalAccess = await loadCanonicalLearnerAccessForUserId(userId);
  return resolveHemodynamicsAccessDecision({ moduleEnabled, moduleStatus, adminPreview: false, userId, tier: canonicalAccess.tier, hasBaseAccess: canonicalAccess.hasAccess });
}

// ─── Advanced Hemodynamics (paid add-on) ───────────────────────────────────────

export type AdvancedHemodynamicsAccessBlockedReason =
  | "sign_in_required"
  | "module_unavailable"
  | "base_subscription_required"
  | "tier_not_eligible"
  | "advanced_hemodynamics_upgrade_required";

export type AdvancedHemodynamicsAccessDecision =
  | {
      ok: true;
      mode: "learner" | "admin-preview";
      userId: string;
      tier: TierCode | null;
      moduleStatus: HemodynamicsModuleStatus;
      entitlementKey: typeof ADVANCED_HEMODYNAMICS_ENTITLEMENT;
    }
  | {
      ok: false;
      reason: AdvancedHemodynamicsAccessBlockedReason;
      tier: TierCode | null;
      moduleStatus: HemodynamicsModuleStatus;
      hasBaseAccess: boolean;
      hasAdvancedHemodynamicsEntitlement: boolean;
      entitlementKey: typeof ADVANCED_HEMODYNAMICS_ENTITLEMENT;
    };

export function hasActiveAdvancedHemodynamicsEntitlementFromRows(
  rows: readonly EntitlementRow[],
  nowMs = Date.now(),
): boolean {
  return rows.some((row) => {
    if (!isAdvancedHemodynamicsPlanCode(row.planCode)) return false;
    if (row.status === SubscriptionStatus.PAST_DUE) return true;
    if (activeLikePaidWindowOpen(row, nowMs)) return true;
    // One-time purchases: currentPeriodEnd is null (lifetime) — ACTIVE status is sufficient
    if (row.status === SubscriptionStatus.ACTIVE && row.currentPeriodEnd === null) return true;
    return cancelledPaidThroughActive(row, nowMs);
  });
}

export function resolveAdvancedHemodynamicsAccessDecision(input: {
  moduleEnabled: boolean;
  moduleStatus: HemodynamicsModuleStatus;
  adminPreview: boolean;
  userId: string;
  tier: TierCode | null;
  hasBaseAccess: boolean;
  hasAdvancedHemodynamicsEntitlement: boolean;
}): AdvancedHemodynamicsAccessDecision {
  if (input.adminPreview) {
    return { ok: true, mode: "admin-preview", userId: input.userId, tier: input.tier, moduleStatus: input.moduleStatus, entitlementKey: ADVANCED_HEMODYNAMICS_ENTITLEMENT };
  }
  if (!input.userId) {
    return { ok: false, reason: "sign_in_required", tier: input.tier, moduleStatus: input.moduleStatus, hasBaseAccess: false, hasAdvancedHemodynamicsEntitlement: false, entitlementKey: ADVANCED_HEMODYNAMICS_ENTITLEMENT };
  }
  if (!input.moduleEnabled || input.moduleStatus !== "published") {
    return { ok: false, reason: "module_unavailable", tier: input.tier, moduleStatus: input.moduleStatus, hasBaseAccess: input.hasBaseAccess, hasAdvancedHemodynamicsEntitlement: input.hasAdvancedHemodynamicsEntitlement, entitlementKey: ADVANCED_HEMODYNAMICS_ENTITLEMENT };
  }
  if (!input.hasBaseAccess) {
    return { ok: false, reason: "base_subscription_required", tier: input.tier, moduleStatus: input.moduleStatus, hasBaseAccess: false, hasAdvancedHemodynamicsEntitlement: input.hasAdvancedHemodynamicsEntitlement, entitlementKey: ADVANCED_HEMODYNAMICS_ENTITLEMENT };
  }
  if (!isAdvancedHemodynamicsTierEligible(input.tier)) {
    return { ok: false, reason: "tier_not_eligible", tier: input.tier, moduleStatus: input.moduleStatus, hasBaseAccess: input.hasBaseAccess, hasAdvancedHemodynamicsEntitlement: input.hasAdvancedHemodynamicsEntitlement, entitlementKey: ADVANCED_HEMODYNAMICS_ENTITLEMENT };
  }
  if (!input.hasAdvancedHemodynamicsEntitlement) {
    return { ok: false, reason: "advanced_hemodynamics_upgrade_required", tier: input.tier, moduleStatus: input.moduleStatus, hasBaseAccess: input.hasBaseAccess, hasAdvancedHemodynamicsEntitlement: false, entitlementKey: ADVANCED_HEMODYNAMICS_ENTITLEMENT };
  }
  return { ok: true, mode: "learner", userId: input.userId, tier: input.tier, moduleStatus: input.moduleStatus, entitlementKey: ADVANCED_HEMODYNAMICS_ENTITLEMENT };
}

export async function loadAdvancedHemodynamicsAccess(): Promise<AdvancedHemodynamicsAccessDecision> {
  const [session, moduleStatus] = await Promise.all([
    getProtectedRouteSession("modules.hemodynamics-advanced"),
    getAdvancedHemodynamicsModuleStatus(),
  ]);

  const userId = ((session as { user?: { id?: string | null } } | null)?.user?.id ?? "").trim();
  const moduleEnabled = isAdvancedHemodynamicsModuleEnabled();
  const adminPreview = await getAdminModulePreviewAccess({
    publicEnabled: moduleEnabled && moduleStatus === "published",
    surface: "modules.hemodynamics-advanced.admin-preview",
  });

  if (adminPreview.ok) {
    return resolveAdvancedHemodynamicsAccessDecision({ moduleEnabled, moduleStatus, adminPreview: true, userId: adminPreview.userId, tier: null, hasBaseAccess: true, hasAdvancedHemodynamicsEntitlement: true });
  }
  if (!userId) {
    return resolveAdvancedHemodynamicsAccessDecision({ moduleEnabled, moduleStatus, adminPreview: false, userId, tier: null, hasBaseAccess: false, hasAdvancedHemodynamicsEntitlement: false });
  }

  const [canonicalAccess, entitlementRows] = await Promise.all([
    loadCanonicalLearnerAccessForUserId(userId),
    prisma.subscription.findMany({
      where: { userId, status: { in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.GRACE, SubscriptionStatus.PAST_DUE, SubscriptionStatus.CANCELLED] } },
      orderBy: { createdAt: "desc" },
      take: 16,
      select: { status: true, planCode: true, currentPeriodEnd: true, trialEnd: true, updatedAt: true },
    }),
  ]);

  return resolveAdvancedHemodynamicsAccessDecision({
    moduleEnabled,
    moduleStatus,
    adminPreview: false,
    userId,
    tier: canonicalAccess.tier,
    hasBaseAccess: canonicalAccess.hasAccess,
    hasAdvancedHemodynamicsEntitlement: hasActiveAdvancedHemodynamicsEntitlementFromRows(entitlementRows),
  });
}
