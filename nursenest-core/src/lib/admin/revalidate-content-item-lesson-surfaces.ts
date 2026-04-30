import "server-only";

import { revalidatePath, revalidateTag } from "next/cache";
import { cacheTagPathwayLessonsHub } from "@/lib/cache/cache-tags";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import { prisma } from "@/lib/db";
import { marketingPathwayLessonDetailPath, marketingPathwayLessonsIndexPath } from "@/lib/lessons/lesson-routes";

/**
 * After admin mutates a `ContentItem` lesson, drop Next.js full-route cache for learner + admin surfaces,
 * and for any marketing `PathwayLesson` rows that share the slug (optional cross-link by slug).
 *
 * TODO: Temporary compatibility bridge. PathwayLesson direct admin editing is now the source of truth
 * for pathway lessons. Remove this slug-based `PathwayLesson` cache bust (and related ContentItem →
 * PathwayLesson sync) after legacy ContentItem lesson migration is complete. Canonical pathway lesson
 * publishes must use {@link revalidateSurfacesAfterPathwayLessonMutation} only — public content must not
 * depend on ContentItem sync.
 */
export async function revalidateSurfacesForContentItemLesson(args: {
  lessonId: string;
  slug: string;
  /** When the slug was renamed, also bust the old marketing lesson URL. */
  previousSlug?: string | null;
  /**
   * When a ContentItem row is bridged to a canonical {@link PathwayLesson} (`pathway-lesson-id:` tag),
   * mutating the ContentItem must not drive marketing `PathwayLesson` cache invalidation — authoring is on
   * `/admin/pathway-lessons` + {@link revalidateSurfacesAfterPathwayLessonMutation}.
   */
  skipMarketingPathwayLessonSurfaces?: boolean;
}): Promise<void> {
  revalidatePath("/app/lessons");
  revalidatePath(`/app/lessons/${args.lessonId}`);
  revalidatePath(`/admin/lessons/${args.lessonId}`);

  if (args.skipMarketingPathwayLessonSurfaces) return;

  const slugs = new Set<string>([args.slug.trim()].filter(Boolean));
  if (args.previousSlug?.trim() && args.previousSlug.trim() !== args.slug.trim()) {
    slugs.add(args.previousSlug.trim());
  }
  if (slugs.size === 0) return;

  const rows = await prisma.pathwayLesson.findMany({
    where: { slug: { in: [...slugs] } },
    select: { pathwayId: true, slug: true },
    take: 50,
  });
  for (const r of rows) {
    revalidateTag(cacheTagPathwayLessonsHub(r.pathwayId), "default");
    revalidateTag(`pathway-lesson:${r.pathwayId}:${r.slug.trim()}`, "default");
    const pathway = getExamPathwayById(r.pathwayId);
    if (!pathway) continue;
    const detail = marketingPathwayLessonDetailPath(pathway, r.slug);
    const index = marketingPathwayLessonsIndexPath(pathway);
    if (detail) {
      revalidatePath(detail);
      revalidatePath(detail, "layout");
    }
    if (index) {
      revalidatePath(index);
      revalidatePath(index, "layout");
    }
  }
}
