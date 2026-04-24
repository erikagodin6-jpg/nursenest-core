/**
 * Single server-side decision point for marketing pathway lesson **detail** routes.
 *
 * - **Libraries / hubs** still filter incomplete rows for **list SQL** via
 *   {@link pathwayLessonEligibleForPublicMarketingSurface} in
 *   {@link sortAndFilterLessonsForPathwayContext} (`pathway-lesson-catalog-sync.ts`).
 * - **Marketing lesson detail** may still render when `publicComplete` is false (preview / quality notices);
 *   metadata + robots follow {@link pathwayLessonEligibleForPublicMarketingSurface} for indexing.
 * - **Paywall body serialization** is enforced in the RSC page using
 *   {@link visibleSectionsForLesson} + {@link sanitizePaywallPreviewSection}.
 */
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { hasFullMarketingPathwayLessonAccess } from "@/lib/lessons/pathway-lesson-access";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";

export type MarketingPathwayLessonRouteResolution =
  | { kind: "not_found"; reason: string }
  | {
      kind: "ready";
      lesson: PathwayLessonRecord;
      pathway: ExamPathwayDefinition;
      /** Subscriber + pathway match — full bodies, quizzes, supplements. */
      fullAccess: boolean;
      /** Resolved scope for preview messaging (never `"error"` — see `entitlementError`). */
      scope: AccessScope;
      /** True when entitlement service failed; preview-only, same as anonymous for body purposes. */
      entitlementError: boolean;
      learnerPathResolved: string | null;
      userId: string;
    };

/** Structural + subscriber gate: eligible for public marketing hubs, sitemap batch, related-lesson cards. */
export function pathwayLessonEligibleForPublicMarketingSurface(lesson: PathwayLessonRecord): boolean {
  return Boolean(lesson.structuralQuality?.publicComplete);
}

function syntheticScopeForEntitlementError(): AccessScope {
  return {
    hasAccess: false,
    reason: "no_access",
    tier: null,
    country: null,
    alliedCareer: null,
  };
}

/**
 * Authoritative marketing lesson detail resolution — use from `/lessons/[lessonSlug]` only.
 * Returns `not_found` only when the pathway is invalid, the lesson failed to load, or the slug resolved to no row.
 */
export function resolveMarketingPathwayLessonRouteResolution(input: {
  pathway: ExamPathwayDefinition | null | undefined;
  lesson: PathwayLessonRecord | null | undefined;
  /** `true` when `loadPathwayLessonWithLegacySlugRedirect` rejected (transient errors). */
  lessonLoadFailed: boolean;
  userId: string;
  entitlement: AccessScope | "error";
  learnerPathResolved: string | null;
  /** DB-backed staff/admin: full marketing lesson body without subscription; also covers entitlement read failures. */
  staffFullLessonAccess?: boolean;
}): MarketingPathwayLessonRouteResolution {
  if (!input.pathway) return { kind: "not_found", reason: "invalid_pathway" };
  if (input.lessonLoadFailed) return { kind: "not_found", reason: "lesson_load_failed" };
  if (!input.lesson) return { kind: "not_found", reason: "lesson_not_found" };

  const entitlementError = input.entitlement === "error";
  const scope: AccessScope =
    input.entitlement === "error" ? syntheticScopeForEntitlementError() : input.entitlement;

  const fullAccess = hasFullMarketingPathwayLessonAccess(
    scope,
    input.pathway,
    input.learnerPathResolved,
    Boolean(input.staffFullLessonAccess),
  );

  return {
    kind: "ready",
    lesson: input.lesson,
    pathway: input.pathway,
    fullAccess,
    scope,
    entitlementError,
    learnerPathResolved: input.learnerPathResolved,
    userId: input.userId,
  };
}

/** Alias for product/docs naming. */
export const getLessonRouteAccessDecision = resolveMarketingPathwayLessonRouteResolution;
