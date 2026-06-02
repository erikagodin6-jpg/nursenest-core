import { cache } from "react";
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

async function loadPathwayLessonWithLegacySlugRedirectImpl(
  pathway: ExamPathwayDefinition,
  lessonSlug: string,
  contentLocale: string | undefined,
): Promise<PathwayLessonRecord | undefined> {
  const trimmed = typeof lessonSlug === "string" ? lessonSlug.trim() : "";
  if (!trimmed) return undefined;

  let direct = await getPathwayLesson(pathway.id, trimmed, contentLocale);
  if (direct) return direct;

  const lowered = trimmed.toLowerCase();
  if (lowered !== trimmed) {
    direct = await getPathwayLesson(pathway.id, lowered, contentLocale);
    if (direct) return direct;
  }

  const canon = resolvePathwayLessonSlugRedirectChain(pathway.id, trimmed);
  if (!canon || canon === trimmed) return undefined;

  const resolved = await getPathwayLesson(pathway.id, canon, contentLocale);
  if (!resolved) return undefined;
  permanentRedirect(buildExamPathwayPath(pathway, `lessons/${canon}`));
}

/**
 * Load a pathway lesson by URL slug; if the slug was renamed, **permanentRedirect** to the canonical lesson URL.
 * Wrapped with React `cache()` for request-level dedupe with metadata + body in the same render.
 */
export const loadPathwayLessonWithLegacySlugRedirect = cache(loadPathwayLessonWithLegacySlugRedirectImpl);

async function loadPathwayLessonSeoMetaWithLegacySlugRedirectImpl(
  pathway: ExamPathwayDefinition,
  lessonSlug: string,
): Promise<PathwayLessonSeoMeta | undefined> {
  const trimmed = typeof lessonSlug === "string" ? lessonSlug.trim() : "";
  if (!trimmed) return undefined;

  let direct = await getPathwayLessonSeoMeta(pathway.id, trimmed);
  if (direct) return direct;

  const lowered = trimmed.toLowerCase();
  if (lowered !== trimmed) {
    direct = await getPathwayLessonSeoMeta(pathway.id, lowered);
    if (direct) return direct;
  }

  const canon = resolvePathwayLessonSlugRedirectChain(pathway.id, trimmed);
  if (!canon || canon === trimmed) return undefined;

  const resolved = await getPathwayLessonSeoMeta(pathway.id, canon);
  if (!resolved) return undefined;
  permanentRedirect(buildExamPathwayPath(pathway, `lessons/${canon}`));
}

/** Metadata-only variant to avoid hydrating the full lesson document during SEO generation. */
export const loadPathwayLessonSeoMetaWithLegacySlugRedirect = cache(loadPathwayLessonSeoMetaWithLegacySlugRedirectImpl);
