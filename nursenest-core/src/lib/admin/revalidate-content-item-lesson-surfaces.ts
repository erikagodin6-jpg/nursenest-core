import "server-only";

import { revalidatePath } from "next/cache";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import { prisma } from "@/lib/db";

/**
 * After admin mutates a `ContentItem` lesson, drop Next.js full-route cache for learner + admin surfaces,
 * and for any marketing `PathwayLesson` rows that share the slug (optional cross-link by slug).
 */
export async function revalidateSurfacesForContentItemLesson(args: {
  lessonId: string;
  slug: string;
  /** When the slug was renamed, also bust the old marketing lesson URL. */
  previousSlug?: string | null;
}): Promise<void> {
  revalidatePath("/app/lessons");
  revalidatePath(`/app/lessons/${args.lessonId}`);
  revalidatePath(`/admin/lessons/${args.lessonId}`);

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
    const pathway = getExamPathwayById(r.pathwayId);
    if (!pathway) continue;
    revalidatePath(buildExamPathwayPath(pathway, `lessons/${r.slug}`));
    revalidatePath(buildExamPathwayPath(pathway, "lessons"));
  }
}
