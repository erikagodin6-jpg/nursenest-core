import "server-only";

import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { loadCanonicalLearnerAccessForUserId } from "@/lib/entitlements/canonical-learner-access.server";
import { getAdminModulePreviewAccess } from "@/lib/modules/admin-module-preview-access";
import {
  canAccessRtVentilatorModuleForTierAndProfession,
  isRtVentilatorLearnerModuleEnabled,
} from "@/lib/rt-ventilator/rt-ventilator-module-config";

export type RtVentilatorModuleAccess =
  | {
      ok: true;
      mode: "public";
      userId: string;
      hasPremium: boolean;
      alliedProfessionKey: "respiratory";
    }
  | { ok: true; mode: "admin-preview"; userId: string; hasPremium: true }
  | {
      ok: false;
      reason:
        | "disabled"
        | "unauthorized"
        | "premium_required"
        | "tier_denied"
        | "profession_denied"
        | "not-admin";
    };

export async function getCurrentRtVentilatorModuleAccess(): Promise<RtVentilatorModuleAccess> {
  const enabled = isRtVentilatorLearnerModuleEnabled();
  if (!enabled) {
    const preview = await getAdminModulePreviewAccess({
      publicEnabled: false,
      surface: "auth.rt_ventilator_module_preview",
    });
    if (!preview.ok) {
      const reason =
        preview.reason === "not-signed-in"
          ? ("unauthorized" as const)
          : preview.reason === "not-admin"
            ? ("not-admin" as const)
            : ("disabled" as const);
      return { ok: false, reason };
    }
    return { ok: true, mode: "admin-preview", userId: preview.userId, hasPremium: true };
  }

  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return { ok: false, reason: "unauthorized" };

  const canonical = await loadCanonicalLearnerAccessForUserId(userId);
  if (!canonical.hasAccess) return { ok: false, reason: "premium_required" };

  const tier = canonical.tier ?? null;

  if (
    !canAccessRtVentilatorModuleForTierAndProfession({
      tier,
      alliedCareer: canonical.alliedCareer,
    })
  ) {
    if (tier !== "ALLIED") return { ok: false, reason: "tier_denied" };
    return { ok: false, reason: "profession_denied" };
  }

  return {
    ok: true,
    mode: "public",
    userId,
    hasPremium: canonical.hasAccess,
    alliedProfessionKey: "respiratory",
  };
}

export async function requireRtVentilatorModuleAccess(): Promise<Extract<RtVentilatorModuleAccess, { ok: true }>> {
  const gate = await getCurrentRtVentilatorModuleAccess();
  if (gate.ok) return gate;
  notFound();
}

export function rtVentilatorApiDeniedResponse(reason: Exclude<RtVentilatorModuleAccess, { ok: true }>["reason"]): Response {
  const status =
    reason === "unauthorized"
      ? 401
      : reason === "premium_required" || reason === "tier_denied" || reason === "profession_denied" || reason === "not-admin"
        ? 403
        : 404;
  return Response.json({ ok: false, code: "rt_ventilator_access_denied", detail: reason }, { status });
}
