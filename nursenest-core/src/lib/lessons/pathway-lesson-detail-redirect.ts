import { permanentRedirect } from "next/navigation";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import {
  getPathwayLesson,
  getPathwayLessonSeoMeta,
  type PathwayLessonSeoMeta,
} from "@/lib/lessons/pathway-lesson-loader";
import { resolvePathwayLessonSlugRedirectChain } from "@/lib/lessons/pathway-lesson-slug-redirects";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";

/**
 * Load a pathway lesson by URL slug; if the slug was renamed, **permanentRedirect** to the canonical lesson URL.
 * Use from marketing lesson detail + metadata so legacy bookmarks and external links stay valid.
 */
export async function loadPathwayLessonWithLegacySlugRedirect(
  pathway: ExamPathwayDefinition,
  lessonSlug: string,
  contentLocale: string | undefined,
): Promise<PathwayLessonRecord | undefined> {
  const direct = await getPathwayLesson(pathway.id, lessonSlug, contentLocale);
  if (direct) return direct;

  const canon = resolvePathwayLessonSlugRedirectChain(pathway.id, lessonSlug);
  if (!canon || canon === lessonSlug) return undefined;

  const resolved = await getPathwayLesson(pathway.id, canon, contentLocale);
  if (!resolved) return undefined;
  permanentRedirect(buildExamPathwayPath(pathway, `lessons/${canon}`));
}

/** Metadata-only variant to avoid hydrating the full lesson document during SEO generation. */
export async function loadPathwayLessonSeoMetaWithLegacySlugRedirect(
  pathway: ExamPathwayDefinition,
  lessonSlug: string,
): Promise<PathwayLessonSeoMeta | undefined> {
  const direct = await getPathwayLessonSeoMeta(pathway.id, lessonSlug);
  if (direct) return direct;

  const canon = resolvePathwayLessonSlugRedirectChain(pathway.id, lessonSlug);
  if (!canon || canon === lessonSlug) return undefined;

  const resolved = await getPathwayLessonSeoMeta(pathway.id, canon);
  if (!resolved) return undefined;
  permanentRedirect(buildExamPathwayPath(pathway, `lessons/${canon}`));
}
