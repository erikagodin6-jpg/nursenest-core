import {
  LESSON_CATEGORIES,
  lessonCategoryToSlug,
  normalizeLessonCategory,
  type LessonCategory,
} from "@/lib/lessons/lesson-taxonomy";
import { classifyLessonForHub } from "@/lib/lessons/pathway-lesson-body-system-groups";
import { hubLessonPresentationRank, canonicalHubLessonDisplayTitle } from "@/lib/lessons/pathway-lesson-hub-organize";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";
import {
  getEffectiveCatalogLessonsForPathwaySync,
  getLessonSummariesIndex,
} from "@/lib/lessons/pathway-lesson-catalog-sync";
import { learningConfigForPathwayId } from "@/lib/pathways/pathway-learning-structure";
import { REVIEW_REQUIRED } from "@/lib/taxonomy/taxonomy";

/** URL segment for each {@link LESSON_CATEGORIES} value (kebab, stable). */
export const MARKETING_LESSONS_HUB_CATEGORY_SLUGS: readonly string[] = LESSON_CATEGORIES.map((c) =>
  lessonCategoryToSlug(c),
);

const SLUG_TO_CATEGORY: ReadonlyMap<string, LessonCategory> = new Map(
  LESSON_CATEGORIES.map((c) => [lessonCategoryToSlug(c), c]),
);

/**
 * Legacy hub segment for Fundamentals before {@link lessonCategoryToSlug} reserved `nursing-fundamentals`.
 * Still resolves when no published lesson claims slug `fundamentals` for the pathway (lesson wins).
 */
const MARKETING_HUB_CATEGORY_PATH_SLUG_ALIASES: ReadonlyMap<string, LessonCategory> = new Map([
  ["fundamentals", "Fundamentals"],
]);

export const MARKETING_HUB_CATEGORY_PAGE_SIZE = 24;

export const MARKETING_HUB_REVIEW_REQUIRED_PREVIEW_MAX = 8;

export type MarketingHubCategoryDescriptor = {
  id: string;
  label: string;
  slug: string;
  legacyCategory?: LessonCategory;
};

/** Resolve `…/lessons/{segment}` when {@link lessonCategoryFromMarketingHubPathSegment} matches. */
export function lessonCategoryFromMarketingHubPathSegment(segment: string | null | undefined): LessonCategory | null {
  const raw = typeof segment === "string" ? segment.trim().toLowerCase() : "";
  if (!raw) return null;
  return SLUG_TO_CATEGORY.get(raw) ?? MARKETING_HUB_CATEGORY_PATH_SLUG_ALIASES.get(raw) ?? null;
}

export function marketingHubCategorySlugForCategory(category: LessonCategory): string {
  return lessonCategoryToSlug(category);
}

function genericSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function isNewGradLessonPathwayId(pathwayId: string): boolean {
  return pathwayId === "us-rn-new-grad-transition" || pathwayId.includes("new-grad");
}

function pathwayUsesCustomMarketingHubCategories(pathwayId: string): boolean {
  const config = learningConfigForPathwayId(pathwayId);
  return config.categories.some((category) => Boolean(category.slug));
}

export function pathwayMarketingHubCategories(pathwayId: string): MarketingHubCategoryDescriptor[] {
  if (pathwayUsesCustomMarketingHubCategories(pathwayId)) {
    return learningConfigForPathwayId(pathwayId).categories.map((category) => ({
      id: category.id,
      label: category.displayName ?? category.title,
      slug: category.slug ?? genericSlug(category.displayName ?? category.title),
    }));
  }
  return LESSON_CATEGORIES.map((category) => ({
    id: category,
    label: category,
    slug: marketingHubCategorySlugForCategory(category),
    legacyCategory: category,
  }));
}

export function pathwayMarketingHubCategoryFromSegment(
  pathwayId: string,
  segment: string | null | undefined,
): MarketingHubCategoryDescriptor | null {
  const raw = typeof segment === "string" ? segment.trim().toLowerCase() : "";
  if (!raw) return null;
  if (!pathwayUsesCustomMarketingHubCategories(pathwayId)) {
    const legacy = lessonCategoryFromMarketingHubPathSegment(raw);
    return legacy
      ? { id: legacy, label: legacy, slug: marketingHubCategorySlugForCategory(legacy), legacyCategory: legacy }
      : null;
  }
  return (
    pathwayMarketingHubCategories(pathwayId).find(
      (category) => category.slug === raw || genericSlug(category.id) === raw,
    ) ?? null
  );
}

export function displayCategoryForPathwayMarketingHubLesson(
  lesson: PathwayLessonRecord,
  pathwayId: string,
): MarketingHubCategoryDescriptor {
  if (pathwayUsesCustomMarketingHubCategories(pathwayId)) {
    const id = classifyLessonForHub(lesson, pathwayId);
    return (
      pathwayMarketingHubCategories(pathwayId).find((category) => category.id === id) ?? {
        id: REVIEW_REQUIRED,
        label: "Review Required",
        slug: genericSlug("Review Required"),
      }
    );
  }
  const legacyCategory = displayCategoryForMarketingHubLesson(lesson);
  return {
    id: legacyCategory,
    label: legacyCategory,
    slug: marketingHubCategorySlugForCategory(legacyCategory),
    legacyCategory,
  };
}

export function displayCategoryForMarketingHubLesson(lesson: PathwayLessonRecord): LessonCategory {
  return normalizeLessonCategory(lesson.topic, lesson.title);
}

export function sortLessonsForMarketingCategoryPage(
  lessons: PathwayLessonRecord[],
  pathwayId?: string | null,
): PathwayLessonRecord[] {
  return [...lessons].sort((a, b) => {
    const diff = hubLessonPresentationRank(b) - hubLessonPresentationRank(a);
    if (diff !== 0) return diff;
    return canonicalHubLessonDisplayTitle(a, pathwayId).localeCompare(
      canonicalHubLessonDisplayTitle(b, pathwayId),
      undefined,
      {
        sensitivity: "base",
      },
    );
  });
}

export function countMarketingHubLessonsByDisplayCategory(
  lessons: readonly PathwayLessonRecord[],
): Map<LessonCategory, number> {
  const m = new Map<LessonCategory, number>();
  for (const c of LESSON_CATEGORIES) m.set(c, 0);
  for (const l of lessons) {
    const cat = displayCategoryForMarketingHubLesson(l);
    m.set(cat, (m.get(cat) ?? 0) + 1);
  }
  return m;
}

/** Data-driven category counts without materializing full {@link PathwayLessonRecord} rows for every lesson. */
export function countMarketingHubLessonsByDisplayCategoryForPathway(pathwayId: string): Map<LessonCategory, number> {
  const m = new Map<LessonCategory, number>();
  for (const c of LESSON_CATEGORIES) m.set(c, 0);
  for (const row of getLessonSummariesIndex(pathwayId)) {
    m.set(row.category, (m.get(row.category) ?? 0) + 1);
  }
  return m;
}

export function countPathwayMarketingHubLessonsByCategoryForPathway(pathwayId: string): Map<string, number> {
  if (!pathwayUsesCustomMarketingHubCategories(pathwayId)) {
    return new Map([...countMarketingHubLessonsByDisplayCategoryForPathway(pathwayId)].map(([category, count]) => [category, count]));
  }
  const m = new Map<string, number>();
  for (const category of pathwayMarketingHubCategories(pathwayId)) m.set(category.id, 0);
  for (const lesson of getMarketingLessonsHubCatalogLessons(pathwayId)) {
    const category = displayCategoryForPathwayMarketingHubLesson(lesson, pathwayId);
    m.set(category.id, (m.get(category.id) ?? 0) + 1);
  }
  return m;
}

export function filterMarketingHubLessonsByDisplayCategory(
  lessons: readonly PathwayLessonRecord[],
  category: LessonCategory,
): PathwayLessonRecord[] {
  return lessons.filter((l) => displayCategoryForMarketingHubLesson(l) === category);
}

export function filterPathwayMarketingHubLessonsByCategory(
  lessons: readonly PathwayLessonRecord[],
  pathwayId: string,
  categoryId: string,
): PathwayLessonRecord[] {
  if (!pathwayUsesCustomMarketingHubCategories(pathwayId)) {
    return filterMarketingHubLessonsByDisplayCategory(lessons, categoryId as LessonCategory);
  }
  return lessons.filter((lesson) => displayCategoryForPathwayMarketingHubLesson(lesson, pathwayId).id === categoryId);
}

/**
 * Pick hub “Review required” rows from catalog (taxonomy), sorted for display — not the same as
 * {@link displayCategoryForMarketingHubLesson} (editorial display category).
 */
export function pickReviewRequiredCatalogLessons(
  lessons: readonly PathwayLessonRecord[],
  pathwayId: string,
  max: number,
): PathwayLessonRecord[] {
  const rr = lessons.filter((l) => classifyLessonForHub(l, pathwayId) === REVIEW_REQUIRED);
  const sorted = sortLessonsForMarketingCategoryPage(rr, pathwayId);
  return sorted.slice(0, Math.max(0, max));
}

export function getMarketingLessonsHubCatalogLessons(pathwayId: string): PathwayLessonRecord[] {
  return getEffectiveCatalogLessonsForPathwaySync(pathwayId);
}
