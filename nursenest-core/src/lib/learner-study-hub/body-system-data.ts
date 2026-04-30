import { classifyQuestionTopicIntoLessonCategory } from "@/lib/questions/pathway-question-category-structure";
import { classifyLearningTopic, learningConfigForPathwayId } from "@/lib/pathways/pathway-learning-structure";
import { REVIEW_REQUIRED, type TaxonomyLeafCategory } from "@/lib/taxonomy/taxonomy";
import { isTaxonomyLeafOrReview } from "@/lib/taxonomy/taxonomy";
import {
  CANONICAL_STUDY_CATEGORIES,
  isCanonicalStudyCategoryId,
  normalizeStudyCategory,
  type CanonicalStudyCategoryId,
} from "@/lib/study/normalize-study-category";

/** @deprecated Prefer {@link CANONICAL_STUDY_CATEGORIES} — kept for incremental hub refactors. */
export const CANONICAL_BODY_SYSTEMS = CANONICAL_STUDY_CATEGORIES;

export type CanonicalBodySystemId = CanonicalStudyCategoryId;

const CANONICAL_IDS = new Set<string>(CANONICAL_STUDY_CATEGORIES.map((s) => s.id));

/**
 * Map nursing taxonomy leaf ids (and review sentinel) to canonical study categories.
 * Prefer {@link normalizeStudyCategory} for mixed exam-bank inputs.
 */
export function taxonomyLeafToCanonicalBodySystemId(leaf: string): CanonicalBodySystemId {
  const { id } = normalizeStudyCategory({ taxonomyLeaf: leaf.trim() });
  return id;
}

const EMERGENCY_SLUGS =
  /^(emergency|trauma|icu|eicu|nicu|picu|cardiac-icu|neuro-icu|pacu|or|stepdown|hem-onc|dialysis)(-|$)/i;
const COMMUNITY_SLUGS = /^(community|public-health|home-care|clinic)(-|$)/i;

/**
 * Map pathway hub category rows (flashcard builder ids, new-grad slugs, etc.) to a canonical study category.
 */
export function pathwayHubCategoryToCanonical(
  pathwayId: string | null | undefined,
  categoryId: string,
  title: string,
): CanonicalBodySystemId {
  const slug = categoryId.trim().toLowerCase();
  if (EMERGENCY_SLUGS.test(slug)) return "emergency_critical_care";
  if (COMMUNITY_SLUGS.test(slug)) return "community_public_health";

  if (isTaxonomyLeafOrReview(categoryId as TaxonomyLeafCategory | typeof REVIEW_REQUIRED)) {
    return taxonomyLeafToCanonicalBodySystemId(categoryId);
  }

  const classified = classifyLearningTopic(`${title} ${categoryId}`, pathwayId ?? undefined);
  return normalizeStudyCategory({
    pathwayId,
    category: categoryId,
    topic: title,
    taxonomyLeaf: classified.categoryId,
  }).id;
}

/** Normalize free text to a canonical id when it matches a known label or id. */
export function normalizeBodySystem(raw: string): { id: CanonicalBodySystemId; label: string } | null {
  const hit = normalizeStudyCategory({ bodySystem: raw, topic: raw }).id;
  if (hit === "uncategorized") return null;
  const label = CANONICAL_STUDY_CATEGORIES.find((c) => c.id === hit)?.label ?? hit;
  return { id: hit, label };
}

export type PathwayBodySystemGroup = {
  id: CanonicalBodySystemId;
  label: string;
  /** Builder or taxonomy source ids that contributed to this bucket (for refine-by-topic). */
  sourceCategoryIds: string[];
};

/**
 * Returns canonical groups with attached source category ids from the pathway's learning config.
 */
export function getPathwayBodySystemGroups(pathwayId: string | null | undefined): PathwayBodySystemGroup[] {
  const byCanon = new Map<CanonicalBodySystemId, Set<string>>();
  for (const s of CANONICAL_STUDY_CATEGORIES) {
    byCanon.set(s.id, new Set());
  }

  const cfg = learningConfigForPathwayId(pathwayId);
  for (const c of cfg.categories) {
    const canon = pathwayHubCategoryToCanonical(pathwayId, c.id, c.title);
    byCanon.get(canon)?.add(c.id);
  }

  return CANONICAL_STUDY_CATEGORIES.map((s) => ({
    id: s.id,
    label: s.label,
    sourceCategoryIds: Array.from(byCanon.get(s.id) ?? []),
  }));
}

export type TopicBucket = { topic: string; count: number };
export type BuilderCategoryRow = { id: string; title: string; count: number };

/** Aggregate discovery topic buckets into canonical study category counts (exam bank is source of truth). */
export function getQuestionCountsByBodySystem(pathwayId: string, buckets: TopicBucket[]): Record<CanonicalBodySystemId, number> {
  const out = Object.fromEntries(CANONICAL_STUDY_CATEGORIES.map((s) => [s.id, 0])) as Record<CanonicalBodySystemId, number>;
  for (const b of buckets) {
    const { categoryId } = classifyQuestionTopicIntoLessonCategory(b.topic, pathwayId);
    const canon = normalizeStudyCategory({
      pathwayId,
      topic: b.topic,
      taxonomyLeaf: categoryId,
    }).id;
    out[canon] += b.count;
  }
  return out;
}

/** Aggregate flashcard builder categories into canonical study category counts. */
export function getFlashcardCountsByBodySystem(
  pathwayId: string,
  categories: BuilderCategoryRow[],
): Record<CanonicalBodySystemId, number> {
  const out = Object.fromEntries(CANONICAL_STUDY_CATEGORIES.map((s) => [s.id, 0])) as Record<CanonicalBodySystemId, number>;
  for (const c of categories) {
    const canon = pathwayHubCategoryToCanonical(pathwayId, c.id, c.title);
    const bucket: CanonicalBodySystemId = isCanonicalStudyCategoryId(canon) ? canon : "uncategorized";
    out[bucket] += c.count;
  }
  return out;
}

/** Topics from discovery whose canonical bucket is in `selectedCanonical` (for refine drawer / targeted names). */
export function discoveryTopicsForCanonicalFilters(
  pathwayId: string,
  buckets: TopicBucket[],
  selectedCanonical: Set<CanonicalBodySystemId>,
): string[] {
  if (selectedCanonical.size === 0) return [];
  const topics: string[] = [];
  for (const b of buckets) {
    const { categoryId } = classifyQuestionTopicIntoLessonCategory(b.topic, pathwayId);
    const canon = normalizeStudyCategory({
      pathwayId,
      topic: b.topic,
      taxonomyLeaf: categoryId,
    }).id;
    if (selectedCanonical.has(canon)) topics.push(b.topic);
  }
  return topics;
}

/** Builder category ids to send to flashcard custom-session when user picks canonical systems. */
export function builderCategoryIdsForCanonicalSelection(
  pathwayId: string,
  builderCategories: BuilderCategoryRow[],
  selectedCanonical: Set<CanonicalBodySystemId>,
): string[] {
  if (selectedCanonical.size === 0) return [];
  if (selectedCanonical.size >= CANONICAL_STUDY_CATEGORIES.length) return [];

  const ids: string[] = [];
  for (const c of builderCategories) {
    const canon = pathwayHubCategoryToCanonical(pathwayId, c.id, c.title);
    if (selectedCanonical.has(canon)) ids.push(c.id);
  }
  return ids;
}

export function isCanonicalBodySystemId(id: string): id is CanonicalBodySystemId {
  return CANONICAL_IDS.has(id);
}
