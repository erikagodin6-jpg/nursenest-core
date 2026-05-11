import "server-only";

import { notFound } from "next/navigation";
import { SubscriptionStatus } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { loadCanonicalLearnerAccessForUserId } from "@/lib/entitlements/canonical-learner-access.server";
import { getAdminModulePreviewAccess, type AdminModulePreviewAccess } from "@/lib/modules/admin-module-preview-access";
import {
  assertNoEcgForRpn,
  canAccessEcgModuleForTier,
  isEcgModuleEnabled,
  type EcgLevel,
} from "@/lib/ecg-module/ecg-module-config";
import { getEcgModuleStatus } from "@/lib/ecg-module/ecg-module-status";
import { hasActiveAdvancedEcgEntitlementFromRows } from "@/lib/advanced-ecg/advanced-ecg-access";
import { resolveEcgModuleEntitlements } from "@/lib/ecg-module/ecg-access-resolution";

export type EcgModuleAccess =
  | { ok: true; mode: "public"; userId: string; tier: "RN" | "NP"; pathwayId: string | null; hasPremium: boolean }
  | { ok: true; mode: "admin-preview"; userId: string; allowedTiers: ["RN", "NP"]; pathwayId: null; hasPremium: true }
  | { ok: false; reason: "disabled" | "unauthorized" | "tier_denied" | "premium_required" | "not-admin" };

async function getAdminPreviewAccess(): Promise<AdminModulePreviewAccess> {
  return getAdminModulePreviewAccess({
    publicEnabled: false,
    surface: "auth.ecg_module_preview",
  });
}

export async function getCurrentEcgModuleAccess(): Promise<EcgModuleAccess> {
  const [enabled, status] = [isEcgModuleEnabled(), await getEcgModuleStatus()];
  if (!enabled || status !== "published") {
    const preview = await getAdminPreviewAccess();
    if (!preview.ok) {
      return {
        ok: false,
        reason: !enabled || status === "archived" ? "disabled" : preview.reason === "not-admin" ? "not-admin" : "unauthorized",
      };
    }
    return {
      ok: true,
      mode: "admin-preview",
      userId: preview.userId,
      allowedTiers: ["RN", "NP"],
      pathwayId: null,
      hasPremium: true,
    };
  }

  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return { ok: false, reason: "unauthorized" };

  const [canonical, entitlementRows] = await Promise.all([
    loadCanonicalLearnerAccessForUserId(userId),
    prisma.subscription.findMany({
      where: {
        userId,
        status: {
          in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.GRACE, SubscriptionStatus.PAST_DUE, SubscriptionStatus.CANCELLED],
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
  const tier = canonical.tier;
  if (!canAccessEcgModuleForTier(tier)) return { ok: false, reason: "tier_denied" };
  const entitlements = resolveEcgModuleEntitlements({
    hasBaseLearnerAccess: canonical.hasAccess,
    hasAdvancedEcgEntitlement: hasActiveAdvancedEcgEntitlementFromRows(entitlementRows),
  });
  if (!entitlements.hasBasicEcgAccess) return { ok: false, reason: "premium_required" };
  try {
    assertNoEcgForRpn(tier, canonical.pathwayId);
  } catch {
    return { ok: false, reason: "tier_denied" };
  }

  return {
    ok: true,
    mode: "public",
    userId,
    tier: tier as "RN" | "NP",
    pathwayId: canonical.pathwayId,
    hasPremium: entitlements.hasBasicEcgAccess,
  };
}

export async function requireEcgModuleAccess(): Promise<Extract<EcgModuleAccess, { ok: true }>> {
  const gate = await getCurrentEcgModuleAccess();
  if (gate.ok) return gate;
  notFound();
}

export function ecgApiDeniedResponse(reason: Exclude<EcgModuleAccess, { ok: true }>["reason"]): Response {
  const status =
    reason === "unauthorized"
      ? 401
      : reason === "tier_denied" || reason === "premium_required"
        ? 403
        : 404;
  return Response.json({ ok: false, code: "ecg_access_denied", detail: reason }, { status });
}

export function ecgWorksheetPathwayForLevel(_level: EcgLevel): string {
  return "all";
}
