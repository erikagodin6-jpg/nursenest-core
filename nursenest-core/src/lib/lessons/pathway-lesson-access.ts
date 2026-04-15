import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { subscriptionCoversPathwayBase } from "@/lib/exam-pathways/pathway-entitlements";

/** Why the learner sees a preview-only pathway lesson (marketing page). */
export type PathwayLessonPreviewKind =
  | "anonymous"
  | "inactive_subscription"
  | "wrong_plan_country"
  | "np_specialty_mismatch"
  | "default_preview";

/**
 * Drives unlock / upgrade messaging. Call only when `fullAccess` is false.
 * Signed-out users are always `anonymous` regardless of `scope` (no PII in scope).
 */
export function getPathwayLessonPreviewKind(
  scope: AccessScope,
  pathway: ExamPathwayDefinition,
  learnerPath: string | null | undefined,
  userId: string,
): PathwayLessonPreviewKind {
  if (!userId.trim()) return "anonymous";
  if (!scope.hasAccess) return "inactive_subscription";
  if (!subscriptionCoversPathwayBase(scope, pathway)) return "wrong_plan_country";
  if (pathway.roleTrack === "np") {
    const lp = learnerPath?.trim();
    if (lp && lp !== pathway.id) return "np_specialty_mismatch";
  }
  return "default_preview";
}

/**
 * Full lesson body requires tier+country match + NP specialty match when learnerPath is set.
 * Prevents NP-FNP language from "unlocking" while studying under PMHNP pathway (and vice versa).
 */
export function canViewFullPathwayLesson(
  scope: AccessScope,
  pathway: ExamPathwayDefinition,
  learnerPath: string | null | undefined,
): boolean {
  if (!subscriptionCoversPathwayBase(scope, pathway)) return false;
  if (pathway.roleTrack !== "np") return true;
  const lp = learnerPath?.trim();
  if (!lp) return true;
  return lp === pathway.id;
}

export { sanitizePaywallPreviewSection, visibleSectionsForLesson } from "@/lib/lessons/pathway-lesson-visible-sections";
