import { countTotalWordsInLessonSections } from "@/lib/lessons/pathway-lesson-premium";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";
import { corpusContainsBannedDevelopmentPhrases } from "@/lib/lessons/pathway-lesson-subscriber-completeness";

function lessonTextCorpusForForceGate(lesson: Pick<PathwayLessonRecord, "sections" | "seoDescription" | "title" | "seoTitle">): string {
  const parts = [
    lesson.title ?? "",
    lesson.seoTitle ?? "",
    lesson.seoDescription ?? "",
    ...(lesson.sections ?? []).map((s) => `${s.heading ?? ""}\n${typeof s.body === "string" ? s.body : ""}`),
  ];
  return parts.join("\n\n");
}

/** Build-time / ops flag: broaden catalog inclusion for generated indexes and matching hub filters. */
export function isNNForcePublishValidRawLessons(): boolean {
  return /^(1|true|yes)$/i.test(String(process.env.NN_FORCE_PUBLISH_VALID_RAW_LESSONS ?? "").trim());
}

/**
 * Minimum safety for optional force-publish: non-empty identity fields, banned-phrase hygiene, and
 * enough prose that we are not emitting empty stubs.
 */
export function pathwayLessonPassesMinimumForcedPublishGate(lesson: PathwayLessonRecord): boolean {
  if (!lesson.slug?.trim() || !lesson.title?.trim() || !lesson.topic?.trim() || !lesson.topicSlug?.trim()) {
    return false;
  }
  if (corpusContainsBannedDevelopmentPhrases(lessonTextCorpusForForceGate(lesson))) return false;
  const words = countTotalWordsInLessonSections(lesson.sections);
  if (words < 80) return false;
  return true;
}

/**
 * When {@link isNNForcePublishValidRawLessons} is enabled, resolve slug collisions by keeping the
 * highest-readiness row as the canonical slug and appending deterministic `__nn-dup-N` suffixes.
 */
export function dedupePathwayLessonsForForcePublishCollisions(lessons: PathwayLessonRecord[]): PathwayLessonRecord[] {
  const byKey = new Map<string, PathwayLessonRecord[]>();
  for (const l of lessons) {
    const k = l.slug.trim().toLowerCase();
    const arr = byKey.get(k) ?? [];
    arr.push(l);
    byKey.set(k, arr);
  }
  const out: PathwayLessonRecord[] = [];
  for (const arr of byKey.values()) {
    if (arr.length === 1) {
      out.push(arr[0]);
      continue;
    }
    const scored = arr.map((l, index) => ({
      l,
      index,
      complete: l.structuralQuality?.publicComplete ? 1 : 0,
      words: countTotalWordsInLessonSections(l.sections),
    }));
    scored.sort((a, b) => b.complete - a.complete || b.words - a.words || a.index - b.index);
    out.push(scored[0].l);
    for (let j = 1; j < scored.length; j += 1) {
      const base = scored[0].l.slug.trim();
      out.push({ ...scored[j].l, slug: `${base}__nn-dup-${j}` });
    }
  }
  return out;
}
