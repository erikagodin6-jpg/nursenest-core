/**
 * Global lesson architecture helpers: exam identity, scope, and tier used for rendering.
 *
 * **Current production model** (intentional):
 * - Exam-specific URLs and SEO are carried by **`PathwayLesson` rows** keyed by `pathwayId` + `slug`
 *   (see marketing `/[country]/[role]/[exam]/lessons/...`).
 * - **`ContentItem`** lessons remain the monolith / app catalog with `tier` + `regionScope`.
 *
 * Longer-term “one canonical ContentItem reused by every exam” would require a migration and
 * join layer; this module encodes the **contract** (`CanonicalLessonScope`) and **runtime**
 * helpers without forcing an immediate schema change.
 */
import type { CountryCode, ExamFamily, TierCode } from "@prisma/client";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";

/** Authoring / future-DB shape for reusable lesson records (not yet required on `ContentItem`). */
export type CanonicalLessonScope = {
  /** e.g. NCLEX_RN, REX_PN */
  examFamiliesSupported: ExamFamily[];
  /** Prisma tier codes this lesson is written for */
  tiersSupported: TierCode[];
  countriesSupported: CountryCode[];
  /** Shared topic key for hubs + rationale linking */
  topicSlug?: string;
};

export type LessonExamRenderContext = {
  pathwayId: string;
  countryCode: CountryCode;
  examFamily: ExamFamily;
  stripeTier: TierCode;
  displayName: string;
  shortName: string;
};

export function pathwayToLessonExamContext(pathway: ExamPathwayDefinition): LessonExamRenderContext {
  return {
    pathwayId: pathway.id,
    countryCode: pathway.countryCode,
    examFamily: pathway.examFamily,
    stripeTier: pathway.stripeTier,
    displayName: pathway.displayName,
    shortName: pathway.shortName,
  };
}

/**
 * Effective tier for **tier-block filtering** on a lesson page:
 * signed-in learner tier when present; otherwise the pathway’s nominal stripe tier (exam page context).
 */
export function contentTierForPathwayLessonRender(pathway: ExamPathwayDefinition, learnerTier: TierCode | null | undefined): TierCode {
  return learnerTier ?? pathway.stripeTier;
}

/**
 * Whether a canonical scope (when populated) allows showing the lesson on this pathway.
 * With `undefined` scope, returns true (no extra gate — pathway row already scopes the lesson).
 */
export function canonicalScopeAllowsPathway(
  scope: CanonicalLessonScope | null | undefined,
  pathway: ExamPathwayDefinition,
): boolean {
  if (!scope) return true;
  if (scope.countriesSupported.length > 0 && !scope.countriesSupported.includes(pathway.countryCode)) {
    return false;
  }
  if (scope.examFamiliesSupported.length > 0 && !scope.examFamiliesSupported.includes(pathway.examFamily)) {
    return false;
  }
  if (scope.tiersSupported.length > 0 && !scope.tiersSupported.includes(pathway.stripeTier)) {
    return false;
  }
  return true;
}
