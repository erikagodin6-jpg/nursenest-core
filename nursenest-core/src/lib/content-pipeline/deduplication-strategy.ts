/**
 * Deduplication strategy for bulk imports (documentation + helpers).
 *
 * - Exam questions: use stemHash (see stem-hash.ts) scoped by exam/tier/country.
 * - Pathway lessons: upsert on (pathwayId, slug, locale); do not duplicate rows.
 */

import { stemHash } from "@/lib/content/stem-hash";
import { examQuestionNaturalKey, stablePathwayLessonKey } from "@/lib/content-pipeline/stable-ids";

export { stemHash, examQuestionNaturalKey, stablePathwayLessonKey };

/**
 * Build a Set key for O(1) duplicate detection inside a single import file.
 * Same stem in different exams is allowed → exam must be part of the key.
 */
export function examQuestionImportDedupeKey(parts: {
  exam: string;
  tier: string;
  countryCode: string | null | undefined;
  stem: string;
}): string {
  const h = stemHash(parts.stem);
  return examQuestionNaturalKey({
    exam: parts.exam,
    tier: parts.tier,
    countryCode: parts.countryCode,
    stemHash: h,
  });
}
