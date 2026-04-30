import "server-only";

import { revalidatePath, revalidateTag } from "next/cache";
import {
  CACHE_TAG_PATHWAY_LESSON_INDEX,
  cacheTagPathwayLessonsHub,
} from "@/lib/cache/cache-tags";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import { marketingPathwayLessonDetailPath, marketingPathwayLessonsIndexPath } from "@/lib/lessons/lesson-routes";
import { safeServerLog } from "@/lib/observability/safe-server-log";

/**
 * After a `PathwayLesson` admin publish (or slug/title change), bust marketing + learner caches.
 *
 * Important: `getPathwayLesson` / SEO loaders wrap Prisma in `unstable_cache` tagged with
 * `pathway-lessons:{pathwayId}` and `pathway-lesson:{pathwayId}:{slug}`. Those tags must be
 * invalidated on **every** successful save — not only when `getExamPathwayById` resolves, or
 * marketing pages keep serving stale titles until the long `revalidate` window expires.
 */
export function revalidateSurfacesAfterPathwayLessonMutation(args: {
  pathwayLessonId: string;
  pathwayId: string;
  slug: string;
  /** When the slug was renamed, also bust the old marketing lesson URL. */
  previousSlug?: string | null;
  /** When true, also refresh sitemap + pathway lesson index cache tags. */
  indexingImpact?: boolean;
}): void {
  const pathwayId = args.pathwayId.trim();
  const slugTrim = args.slug.trim();
  const prevTrim = args.previousSlug?.trim() ?? "";

  const hubTag = cacheTagPathwayLessonsHub(pathwayId);
  const lessonTag = `pathway-lesson:${pathwayId}:${slugTrim}`;
  const tagsRevalidated: string[] = [hubTag, lessonTag];
  revalidateTag(hubTag);
  revalidateTag(lessonTag);
  if (prevTrim && prevTrim !== slugTrim) {
    const oldTag = `pathway-lesson:${pathwayId}:${prevTrim}`;
    tagsRevalidated.push(oldTag);
    revalidateTag(oldTag);
  }

  const pathsRevalidated: string[] = [];

  const pushPath = (pathname: string) => {
    revalidatePath(pathname);
    revalidatePath(pathname, "layout");
    pathsRevalidated.push(pathname);
  };

  pushPath("/app/lessons");
  pushPath(`/app/lessons/${args.pathwayLessonId}`);

  const pathway = getExamPathwayById(pathwayId);
  const detailPath = pathway ? marketingPathwayLessonDetailPath(pathway, slugTrim) : null;
  const indexPath = pathway ? marketingPathwayLessonsIndexPath(pathway) : null;
  if (detailPath) pushPath(detailPath);
  if (indexPath) pushPath(indexPath);
  if (pathway && prevTrim && prevTrim !== slugTrim) {
    const oldDetail = marketingPathwayLessonDetailPath(pathway, prevTrim);
    if (oldDetail) pushPath(oldDetail);
  }

  if (args.indexingImpact) {
    revalidatePath("/sitemap.xml");
    revalidateTag(CACHE_TAG_PATHWAY_LESSON_INDEX);
    pathsRevalidated.push("/sitemap.xml");
    tagsRevalidated.push(CACHE_TAG_PATHWAY_LESSON_INDEX);
  }

  safeServerLog("admin_pathway_lesson_publish", "revalidation_triggered", {
    pathwayLessonId: args.pathwayLessonId,
    pathwayId,
    slug: slugTrim,
    tags: tagsRevalidated.join("|"),
    paths: pathsRevalidated.join("|"),
    catalogResolved: pathway ? 1 : 0,
  });
}
