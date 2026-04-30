import "server-only";

import { revalidatePath, revalidateTag } from "next/cache";
import { pathwayLessonMutationRevalidationTargets } from "@/lib/admin/pathway-lesson-mutation-revalidation-targets";
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
  const slugTrim = args.slug.trim();
  const prevTrim = args.previousSlug?.trim() ?? "";

  const targets = pathwayLessonMutationRevalidationTargets(args);
  const tagsRevalidated = [...targets.cacheTags];
  for (const tag of targets.cacheTags) {
    revalidateTag(tag);
  }

  const pathsRevalidated: string[] = [];
  for (const pathname of targets.pathnamesWithLayout) {
    revalidatePath(pathname);
    revalidatePath(pathname, "layout");
    pathsRevalidated.push(pathname);
  }
  if (targets.sitemapPath) {
    revalidatePath(targets.sitemapPath);
    pathsRevalidated.push(targets.sitemapPath);
  }

  safeServerLog("admin_pathway_lesson_publish", "revalidation_triggered", {
    pathwayLessonId: args.pathwayLessonId,
    pathwayId: args.pathwayId.trim(),
    slug: slugTrim,
    tags: tagsRevalidated.join("|"),
    paths: pathsRevalidated.join("|"),
    catalogResolved: targets.catalogResolved ? 1 : 0,
  });

  console.info("[ADMIN_PUBLISH_REVALIDATE]", {
    pathwayLessonId: args.pathwayLessonId,
    pathwayId: args.pathwayId.trim(),
    slug: slugTrim,
    previousSlug: prevTrim || null,
    tags: tagsRevalidated,
    paths: pathsRevalidated,
    marketingDetailPath: targets.marketingDetailPath,
    marketingIndexPath: targets.marketingIndexPath,
    catalogResolved: targets.catalogResolved,
  });
}
