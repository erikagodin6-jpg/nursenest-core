import "server-only";

import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { getUserAccess } from "@/lib/entitlements/get-user-access";
import { getAdminModulePreviewAccess, type AdminModulePreviewAccess } from "@/lib/modules/admin-module-preview-access";
import {
  assertNoEcgForRpn,
  canAccessEcgModuleForTier,
  isEcgModuleEnabled,
  type EcgLevel,
} from "@/lib/ecg-module/ecg-module-config";
import { getEcgModuleStatus } from "@/lib/ecg-module/ecg-module-status";

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

  const access = await getUserAccess(userId);
  const tier = access.allowedProfession.tier;
  if (!canAccessEcgModuleForTier(tier)) return { ok: false, reason: "tier_denied" };
  if (!access.hasPremium) return { ok: false, reason: "premium_required" };
  try {
    assertNoEcgForRpn(tier, access.allowedExam.pathwayId);
  } catch {
    return { ok: false, reason: "tier_denied" };
  }

  return {
    ok: true,
    mode: "public",
    userId,
    tier: tier as "RN" | "NP",
    pathwayId: access.allowedExam.pathwayId,
    hasPremium: access.hasPremium,
  };
}

export async function requireEcgModuleAccess(): Promise<Extract<EcgModuleAccess, { ok: true }>> {
  const gate = await getCurrentEcgModuleAccess();
  if (gate.ok) return gate;
  notFound();
}

export function ecgApiDeniedResponse(reason: Exclude<EcgModuleAccess, { ok: true }>["reason"]): Response {
  const status = reason === "disabled" ? 404 : 404;
  return Response.json({ ok: false, code: "not_found", detail: reason }, { status });
}

export function ecgWorksheetPathwayForLevel(_level: EcgLevel): string {
  return "all";
}
