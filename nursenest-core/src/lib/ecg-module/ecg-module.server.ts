import "server-only";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getUserAccess } from "@/lib/entitlements/get-user-access";
import {
  canAccessEcgModuleForTier,
  isEcgModuleEnabled,
  type EcgLevel,
} from "@/lib/ecg-module/ecg-module-config";

export type EcgModuleAccess =
  | { ok: true; userId: string; tier: "RN" | "NP"; pathwayId: string | null; hasPremium: boolean }
  | { ok: false; reason: "disabled" | "unauthorized" | "tier_denied" | "premium_required" };

export async function getCurrentEcgModuleAccess(): Promise<EcgModuleAccess> {
  if (!isEcgModuleEnabled()) return { ok: false, reason: "disabled" };

  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return { ok: false, reason: "unauthorized" };

  const access = await getUserAccess(userId);
  const tier = access.allowedProfession.tier;
  if (!canAccessEcgModuleForTier(tier)) return { ok: false, reason: "tier_denied" };
  if (!access.hasPremium) return { ok: false, reason: "premium_required" };

  return {
    ok: true,
    userId,
    tier: tier as "RN" | "NP",
    pathwayId: access.allowedExam.pathwayId,
    hasPremium: access.hasPremium,
  };
}

export async function requireEcgModuleAccess(): Promise<Extract<EcgModuleAccess, { ok: true }>> {
  const gate = await getCurrentEcgModuleAccess();
  if (gate.ok) return gate;
  if (gate.reason === "unauthorized") {
    redirect("/login?callbackUrl=/modules/ecg");
  }
  redirect("/app");
}

export function ecgApiDeniedResponse(reason: Exclude<EcgModuleAccess, { ok: true }>["reason"]): Response {
  const status = reason === "unauthorized" ? 401 : reason === "disabled" ? 404 : 403;
  return Response.json({ ok: false, code: reason }, { status });
}

export function ecgWorksheetPathwayForLevel(_level: EcgLevel): string {
  return "all";
}

