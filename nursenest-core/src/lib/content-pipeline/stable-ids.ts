/**
 * Stable identifiers for content pipelines (imports, dedup reports, upserts).
 * Keep deterministic and documented—avoid inferring identity from display text alone.
 */
import { assertCanonicalExamQuestionExam } from "@/lib/exam-questions/exam-question-exam-key";

/** BCP 47-style tag; pathway lessons default to `en` in DB. */
export type PathwayLessonLocale = string;

/**
 * Canonical composite key for pathway marketing lessons.
 * Matches DB uniqueness: @@unique([pathwayId, slug, locale])
 */
export function stablePathwayLessonKey(pathwayId: string, slug: string, locale: PathwayLessonLocale): string {
  return `${pathwayId.trim()}:${slug.trim()}:${locale.trim().toLowerCase()}`;
}

/**
 * Natural key for duplicate *reporting* within an exam slice (not a DB unique constraint).
 * Use with stemHash for human-readable logs.
 */
export function examQuestionNaturalKey(parts: {
  exam: string;
  tier: string;
  countryCode: string | null | undefined;
  stemHash: string;
}): string {
  const cc = (parts.countryCode ?? "").trim().toUpperCase() || "XX";
  return `${assertCanonicalExamQuestionExam(parts.exam)}:${parts.tier.trim()}:${cc}:${parts.stemHash}`;
}
