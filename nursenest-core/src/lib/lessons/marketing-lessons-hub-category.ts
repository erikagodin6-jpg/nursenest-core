import { ContentStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import {
  LESSON_CATEGORIES,
  lessonCategoryToSlug,
  normalizeLessonCategory,
  type LessonCategory,
} from "@/lib/lessons/lesson-taxonomy";
import { classifyLessonForHub } from "@/lib/lessons/pathway-lesson-body-system-groups";
import { hubLessonPresentationRank, canonicalHubLessonDisplayTitle } from "@/lib/lessons/pathway-lesson-hub-organize";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";
import { getEffectiveCatalogLessonsForPathwaySync } from "@/lib/lessons/pathway-lesson-catalog-sync";
import { REVIEW_REQUIRED } from "@/lib/taxonomy/taxonomy";

/** URL segment for each {@link LESSON_CATEGORIES} value (kebab, stable). */
export const MARKETING_LESSONS_HUB_CATEGORY_SLUGS: readonly string[] = LESSON_CATEGORIES.map((c) =>
  lessonCategoryToSlug(c),
);

const SLUG_TO_CATEGORY: ReadonlyMap<string, LessonCategory> = new Map(
  LESSON_CATEGORIES.map((c) => [lessonCategoryToSlug(c), c]),
);

export const MARKETING_HUB_CATEGORY_PAGE_SIZE = 24;

export const MARKETING_HUB_REVIEW_REQUIRED_PREVIEW_MAX = 8;

/** Resolve `…/lessons/{segment}` when {@link lessonCategoryFromMarketingHubPathSegment} matches. */
export function lessonCategoryFromMarketingHubPathSegment(segment: string | null | undefined): LessonCategory | null {
  const raw = typeof segment === "string" ? segment.trim().toLowerCase() : "";
  if (!raw) return null;
  return SLUG_TO_CATEGORY.get(raw) ?? null;
}

export function marketingHubCategorySlugForCategory(category: LessonCategory): string {
  return lessonCategoryToSlug(category);
}

export function displayCategoryForMarketingHubLesson(lesson: PathwayLessonRecord): LessonCategory {
  return normalizeLessonCategory(lesson.topic, lesson.title);
}

export function sortLessonsForMarketingCategoryPage(lessons: PathwayLessonRecord[]): PathwayLessonRecord[] {
  return [...lessons].sort((a, b) => {
    const diff = hubLessonPresentationRank(b) - hubLessonPresentationRank(a);
    if (diff !== 0) return diff;
    return canonicalHubLessonDisplayTitle(a).localeCompare(canonicalHubLessonDisplayTitle(b), undefined, {
      sensitivity: "base",
    });
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

export function filterMarketingHubLessonsByDisplayCategory(
  lessons: readonly PathwayLessonRecord[],
  category: LessonCategory,
): PathwayLessonRecord[] {
  return lessons.filter((l) => displayCategoryForMarketingHubLesson(l) === category);
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
  const sorted = sortLessonsForMarketingCategoryPage(rr);
  return sorted.slice(0, Math.max(0, max));
}

export function getMarketingLessonsHubCatalogLessons(pathwayId: string): PathwayLessonRecord[] {
  return getEffectiveCatalogLessonsForPathwaySync(pathwayId);
}

/**
 * When `…/lessons/{segment}` matches a display-category slug, route to the category hub **unless**
 * a published lesson uses the same slug (lesson wins).
 */
export async function resolveMarketingLessonsHubDynamicSegment(
  pathwayId: string,
  segment: string,
): Promise<"lesson" | { category: LessonCategory }> {
  const slug = segment.trim();
  const slugLower = slug.toLowerCase();
  const cat = lessonCategoryFromMarketingHubPathSegment(slug);
  if (!cat) return "lesson";

  const catalog = getMarketingLessonsHubCatalogLessons(pathwayId);
  if (catalog.some((l) => (l.slug ?? "").trim().toLowerCase() === slugLower)) {
    return "lesson";
  }

  if (isDatabaseUrlConfigured()) {
    try {
      const row = await prisma.pathwayLesson.findFirst({
        where: { pathwayId, slug, status: ContentStatus.PUBLISHED },
        select: { id: true },
      });
      if (row) return "lesson";
    } catch {
      /* treat as no row */
    }
  }

  return { category: cat };
}
