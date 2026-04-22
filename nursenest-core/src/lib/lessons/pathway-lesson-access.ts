import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { accessScopeIsStaffLearnerEntitlementBypass } from "@/lib/entitlements/staff-learner-bypass";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { subscriptionCoversPathwayBase } from "@/lib/exam-pathways/pathway-entitlements-policy";

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
  if (accessScopeIsStaffLearnerEntitlementBypass(scope)) return true;
  if (pathway.roleTrack !== "np") return true;
  const lp = learnerPath?.trim();
  if (!lp) return true;
  return lp === pathway.id;
}

/**
 * Marketing pathway lesson detail: subscription/trial access **or** DB-backed staff/admin bypass.
 * Keep in sync with {@link resolveMarketingPathwayLessonRouteResolution}.
 */
export function hasFullMarketingPathwayLessonAccess(
  scope: AccessScope,
  pathway: ExamPathwayDefinition,
  learnerPath: string | null | undefined,
  staffFullLessonAccess: boolean,
): boolean {
  return canViewFullPathwayLesson(scope, pathway, learnerPath) || staffFullLessonAccess;
}

export { sanitizePaywallPreviewSection, visibleSectionsForLesson } from "@/lib/lessons/pathway-lesson-visible-sections";
