import {
  CACHE_TAG_PATHWAY_LESSON_INDEX,
  cacheTagPathwayLessonsHub,
} from "@/lib/cache/cache-tags";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import { marketingPathwayLessonDetailPath, marketingPathwayLessonsIndexPath } from "@/lib/lessons/lesson-routes";

export type PathwayLessonMutationRevalidationTargetsInput = {
  pathwayLessonId: string;
  pathwayId: string;
  slug: string;
  previousSlug?: string | null;
  indexingImpact?: boolean;
};

/**
 * Pure list of cache tags + pathnames that {@link revalidateSurfacesAfterPathwayLessonMutation} must hit.
 * Kept separate from `next/cache` so node tests can assert the marketing lesson URL matches
 * {@link buildExamPathwayPath} without mocking `revalidatePath`.
 */
export function pathwayLessonMutationRevalidationTargets(
  input: PathwayLessonMutationRevalidationTargetsInput,
): {
  cacheTags: string[];
  /** Paths that receive `revalidatePath(p)` + `revalidatePath(p, "layout")`. */
  pathnamesWithLayout: string[];
  /** Sitemap is single `revalidatePath` only (no layout pass). */
  sitemapPath: string | null;
  marketingDetailPath: string | null;
  marketingIndexPath: string | null;
  marketingPreviousDetailPath: string | null;
  catalogResolved: boolean;
} {
  const pathwayId = input.pathwayId.trim();
  const slugTrim = input.slug.trim();
  const prevTrim = input.previousSlug?.trim() ?? "";

  const hubTag = cacheTagPathwayLessonsHub(pathwayId);
  const cacheTags = [hubTag, `pathway-lesson:${pathwayId}:${slugTrim}`];
  if (prevTrim && prevTrim !== slugTrim) {
    cacheTags.push(`pathway-lesson:${pathwayId}:${prevTrim}`);
  }
  if (input.indexingImpact) {
    cacheTags.push(CACHE_TAG_PATHWAY_LESSON_INDEX);
  }

  const pathnamesWithLayout: string[] = ["/app/lessons", `/app/lessons/${input.pathwayLessonId}`];

  const pathway = getExamPathwayById(pathwayId);
  const marketingDetailPath = pathway ? marketingPathwayLessonDetailPath(pathway, slugTrim) : null;
  const marketingIndexPath = pathway ? marketingPathwayLessonsIndexPath(pathway) : null;
  let marketingPreviousDetailPath: string | null = null;

  if (marketingDetailPath) pathnamesWithLayout.push(marketingDetailPath);
  if (marketingIndexPath) pathnamesWithLayout.push(marketingIndexPath);
  if (pathway && prevTrim && prevTrim !== slugTrim) {
    marketingPreviousDetailPath = marketingPathwayLessonDetailPath(pathway, prevTrim);
    if (marketingPreviousDetailPath) pathnamesWithLayout.push(marketingPreviousDetailPath);
  }

  const sitemapPath = input.indexingImpact ? "/sitemap.xml" : null;

  return {
    cacheTags,
    pathnamesWithLayout,
    sitemapPath,
    marketingDetailPath,
    marketingIndexPath,
    marketingPreviousDetailPath,
    catalogResolved: Boolean(pathway),
  };
}

/** Marketing lesson detail segment aligned with `buildExamPathwayPath(pathway, …)`. */
export function marketingPathwayLessonDetailSubpath(slug: string): string {
  return `lessons/${encodeURIComponent(slug.trim())}`;
}
