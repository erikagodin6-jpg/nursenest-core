/**
 * Shared study-category helpers for practice + flashcards hubs (exam bank as source of truth).
 */
import {
  getFlashcardCountsByBodySystem,
  getPathwayBodySystemGroups,
  getQuestionCountsByBodySystem,
  type BuilderCategoryRow,
  type PathwayBodySystemGroup,
  type TopicBucket,
} from "@/lib/learner-study-hub/body-system-data";
import type { CanonicalStudyCategoryId } from "@/lib/study/normalize-study-category";
export { normalizeStudyCategory } from "@/lib/study/normalize-study-category";
export { CANONICAL_STUDY_CATEGORIES } from "@/lib/study/normalize-study-category";

export function getStudyCategoryGroupsForPathway(pathwayId: string | null | undefined): PathwayBodySystemGroup[] {
  return getPathwayBodySystemGroups(pathwayId);
}

export function getStudyCountsByCategoryFromDiscovery(
  pathwayId: string,
  buckets: TopicBucket[],
): Record<CanonicalStudyCategoryId, number> {
  return getQuestionCountsByBodySystem(pathwayId, buckets);
}

export function getStudyCountsByCategoryFromBuilder(
  pathwayId: string,
  rows: BuilderCategoryRow[],
): Record<CanonicalStudyCategoryId, number> {
  return getFlashcardCountsByBodySystem(pathwayId, rows);
}
