/**
 * Non-copy auth transition governance — pathway inference, watermark bands, tone mapping.
 */

import { resolveAuthContinuationHint, type AuthContinuationHint } from "@/lib/auth/auth-study-continuation-context";
import { isNpPremiumConvergencePathway } from "@/lib/marketing/np-premium-convergence-pathways";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import type { AuthPathwaySegment, AuthTransitionKind } from "@/lib/auth/auth-transition-types";

export type { AuthPathwaySegment, AuthTransitionKind };

export const AUTH_LEAF_WATERMARK_GOVERNANCE = {
  hero: { opacityMin: 0.06, opacityMax: 0.1, defaultOpacity: 0.09 },
  ambient: { opacityMin: 0.03, opacityMax: 0.06, defaultOpacity: 0.055 },
  cardCorner: { opacityMin: 0.05, opacityMax: 0.07, defaultOpacity: 0.055 },
  mobileScale: 0.92,
  blurPx: 0,
  zIndex: 0,
  contentZIndex: 1,
} as const;

export function authLeafOpacityForPlacement(
  placement: "card-corner" | "panel-hero" | "page-ambient",
  opts?: { mobile?: boolean },
): number {
  const g = AUTH_LEAF_WATERMARK_GOVERNANCE;
  let base =
    placement === "panel-hero"
      ? g.hero.defaultOpacity
      : placement === "page-ambient"
        ? g.ambient.defaultOpacity
        : g.cardCorner.defaultOpacity;
  if (opts?.mobile) base *= g.mobileScale;
  return base;
}

export function inferAuthPathwaySegment(pathwayId: string | null): AuthPathwaySegment {
  if (!pathwayId) return "general";
  const id = pathwayId.toLowerCase();
  if (id.includes("np") || id.startsWith("ca-np") || id.includes("-np-")) return "np";
  if (id.includes("lpn") || id.includes("nclex-pn") || id.includes("rex-pn") || id.includes("-pn")) return "rpn";
  if (id.includes("nclex-rn") || id.includes("-rn")) return "rn";
  return "general";
}

/** Preferred banner tone — recovery-first, not enterprise alert. */
export function authTransitionMessageTone(
  kind: AuthTransitionKind,
): "default" | "info" | "success" | "warning" | "danger" {
  if (kind === "authentication-error") return "info";
  if (kind === "session-expired") return "info";
  if (kind === "email-verified" || kind === "password-reset-success" || kind === "sign-up-completion") {
    return "success";
  }
  return "info";
}

function pathwayIdFromCallback(callbackUrl: string | null): string | null {
  if (!callbackUrl?.trim()) return null;
  try {
    const id = new URL(callbackUrl.trim(), "http://localhost").searchParams.get("pathwayId")?.trim();
    return id || null;
  } catch {
    return null;
  }
}

export function resolveAuthTransitionContext(callbackUrl: string | null): {
  pathwayId: string | null;
  segment: AuthPathwaySegment;
  studyHint: AuthContinuationHint | null;
} {
  const pathwayId = pathwayIdFromCallback(callbackUrl);
  const segment = inferAuthPathwaySegment(pathwayId);
  const studyHint = resolveAuthContinuationHint(callbackUrl);
  return { pathwayId, segment, studyHint };
}

export function isNpPathwayForAuthCopy(pathwayId: string | null, pathwayDef?: ExamPathwayDefinition | null): boolean {
  if (pathwayDef && isNpPremiumConvergencePathway(pathwayDef)) return true;
  return inferAuthPathwaySegment(pathwayId) === "np";
}
