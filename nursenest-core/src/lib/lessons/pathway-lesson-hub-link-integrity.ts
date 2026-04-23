/**
 * Marketing lessons hub — guarantees every linked lesson matches the **same server contract** as
 * the lesson detail route (`getPathwayLesson` + marketing surface gates), not only list-row metadata.
 *
 * Runs **after** {@link prepareLessonsForHubCurriculum}. A slug is kept only when the hydrated lesson:
 * - loads without error and is {@link pathwayLessonEligibleForPublicMarketingSurface}
 * - passes {@link pathwayLessonMatchesMarketingPathwayContext} (exam/country alignment with the hub pathway)
 * - is not dropped by {@link shouldSuppressProfessionalPracticeHubLesson} (professional bucket + clinical corpus guard)
 * - is not `REVIEW_REQUIRED` under {@link classifyPathwayLessonRecordForHub} (taxonomy write can still persist review rows)
 *
 * List rows can diverge from detail hydration (DB drift, overlays, locale, incomplete rows, or pathway
 * metadata skew). This pass closes that gap so taxonomy + routing + hub rendering stay one integrity surface.
 */

import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { pathwayLessonMatchesMarketingPathwayContext } from "@/lib/lessons/pathway-lesson-catalog-sync";
import { getPathwayLesson } from "@/lib/lessons/pathway-lesson-loader";
import { pathwayLessonEligibleForPublicMarketingSurface } from "@/lib/lessons/pathway-lesson-route-access";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";
import { pathwayLessonHasRenderableHubSlug } from "@/lib/lessons/pathway-lesson-types";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { classifyPathwayLessonRecordForHub } from "@/lib/taxonomy/classifier";
import { shouldSuppressProfessionalPracticeHubLesson } from "@/lib/taxonomy/nursing-taxonomy-validation";
import { REVIEW_REQUIRED } from "@/lib/taxonomy/taxonomy";

const DEFAULT_DETAIL_VERIFY_CONCURRENCY = 8;

async function mapWithConcurrency<T, R>(
  items: readonly T[],
  limit: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const out: R[] = [];
  for (let i = 0; i < items.length; i += limit) {
    const chunk = items.slice(i, i + limit);
    out.push(...(await Promise.all(chunk.map((x) => fn(x)))));
  }
  return out;
}

export type HubLessonDetailExcluded = {
  slug: string;
  reason:
    | "missing_slug"
    | "detail_loader_miss"
    | "detail_not_public_complete"
    | "pathway_context_mismatch"
    | "professional_hub_corpus_guard"
    | "taxonomy_review_required";
};

/**
 * Drops hub rows that fail any gate in the module docblock (detail load, public-complete surface,
 * pathway exam/country match, professional hub guard, hub taxonomy leaf).
 */
export async function verifyMarketingHubLessonRowsResolve(
  pathway: Pick<ExamPathwayDefinition, "id">,
  lessons: readonly PathwayLessonRecord[],
  lessonContentLocale: string,
  options?: { concurrency?: number },
): Promise<{
  kept: PathwayLessonRecord[];
  excluded: HubLessonDetailExcluded[];
}> {
  const concurrency = Math.max(1, Math.min(24, options?.concurrency ?? DEFAULT_DETAIL_VERIFY_CONCURRENCY));

  const safe = lessons.filter((l) => pathwayLessonHasRenderableHubSlug(l));
  const uniqueSlugs = [...new Set(safe.map((l) => l.slug.trim()))];

  const pairs = await mapWithConcurrency(uniqueSlugs, concurrency, async (slug) => {
    let loaded: PathwayLessonRecord | undefined;
    let threw = false;
    try {
      loaded = await getPathwayLesson(pathway.id, slug, lessonContentLocale);
    } catch {
      threw = true;
    }
    return { slug, lesson: loaded, threw };
  });

  const bySlug = new Map<string, PathwayLessonRecord | undefined>();
  const verifyExcluded: HubLessonDetailExcluded[] = [];

  for (const p of pairs) {
    bySlug.set(p.slug, p.lesson);
    if (p.threw) {
      verifyExcluded.push({ slug: p.slug, reason: "detail_loader_miss" });
      safeServerLog("pathway_lessons", "hub_lesson_detail_verify_loader_error", {
        pathway_id: pathway.id,
        slug: p.slug.slice(0, 200),
      });
      continue;
    }
    if (!p.lesson) {
      verifyExcluded.push({ slug: p.slug, reason: "detail_loader_miss" });
      continue;
    }
    if (!pathwayLessonEligibleForPublicMarketingSurface(p.lesson)) {
      verifyExcluded.push({ slug: p.slug, reason: "detail_not_public_complete" });
      safeServerLog("pathway_lessons", "hub_lesson_detail_verify_not_public_complete", {
        pathway_id: pathway.id,
        slug: p.slug.slice(0, 200),
      });
      continue;
    }
    if (!pathwayLessonMatchesMarketingPathwayContext(pathway.id, p.lesson)) {
      verifyExcluded.push({ slug: p.slug, reason: "pathway_context_mismatch" });
      safeServerLog("pathway_lessons", "hub_lesson_detail_verify_pathway_context_mismatch", {
        pathway_id: pathway.id,
        slug: p.slug.slice(0, 200),
      });
      continue;
    }
    if (shouldSuppressProfessionalPracticeHubLesson(p.lesson)) {
      verifyExcluded.push({ slug: p.slug, reason: "professional_hub_corpus_guard" });
      continue;
    }
    if (classifyPathwayLessonRecordForHub(p.lesson).categoryId === REVIEW_REQUIRED) {
      verifyExcluded.push({ slug: p.slug, reason: "taxonomy_review_required" });
      safeServerLog("pathway_lessons", "hub_lesson_detail_verify_taxonomy_review_required", {
        pathway_id: pathway.id,
        slug: p.slug.slice(0, 200),
      });
      continue;
    }
  }

  const eligibleSlugs = new Set(
    uniqueSlugs.filter((s) => {
      const loaded = bySlug.get(s);
      if (!loaded || !pathwayLessonEligibleForPublicMarketingSurface(loaded)) return false;
      if (!pathwayLessonMatchesMarketingPathwayContext(pathway.id, loaded)) return false;
      if (shouldSuppressProfessionalPracticeHubLesson(loaded)) return false;
      if (classifyPathwayLessonRecordForHub(loaded).categoryId === REVIEW_REQUIRED) return false;
      return true;
    }),
  );

  const kept: PathwayLessonRecord[] = [];
  const excluded: HubLessonDetailExcluded[] = [...verifyExcluded];

  for (const lesson of lessons) {
    if (!pathwayLessonHasRenderableHubSlug(lesson)) {
      excluded.push({ slug: String(lesson.slug ?? ""), reason: "missing_slug" });
      continue;
    }
    const slug = lesson.slug.trim();
    if (eligibleSlugs.has(slug)) {
      kept.push(lesson);
    }
  }

  if (lessons.length > 0) {
    safeServerLog("pathway_lessons", "hub_lesson_detail_verify_counts", {
      pathway_id: pathway.id,
      incoming: String(lessons.length),
      kept: String(kept.length),
      excluded_unique: String(verifyExcluded.length),
    });
  }
  if (verifyExcluded.length > 0) {
    safeServerLog("pathway_lessons", "hub_lesson_detail_verify_exclusions_sample", {
      pathway_id: pathway.id,
      sample: verifyExcluded
        .slice(0, 12)
        .map((e) => `${e.slug}:${e.reason}`)
        .join("|"),
    });
  }

  return { kept, excluded };
}
