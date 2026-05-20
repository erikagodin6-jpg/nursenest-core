import type { PathwayEmbeddedSoundLibraryId, PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";

export type { PathwayEmbeddedSoundLibraryId } from "@/lib/lessons/pathway-lesson-types";

const ALLOWED = new Set<PathwayEmbeddedSoundLibraryId>(["cardiac_sounds", "respiratory_sounds"]);

export function sanitizeEmbeddedSoundLibraries(raw: unknown): PathwayEmbeddedSoundLibraryId[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const out: PathwayEmbeddedSoundLibraryId[] = [];
  for (const x of raw) {
    if (x === "cardiac_sounds" || x === "respiratory_sounds") out.push(x);
  }
  if (!out.length) return undefined;
  return [...new Set(out)];
}

function lessonHaystack(lesson: Pick<PathwayLessonRecord, "slug" | "title" | "topic" | "bodySystem" | "system">): string {
  return `${lesson.slug}\n${lesson.title}\n${lesson.topic}\n${lesson.bodySystem}\n${lesson.system ?? ""}`.toLowerCase();
}

function isCardiovascularLesson(lesson: Pick<PathwayLessonRecord, "bodySystem" | "system" | "topicSlug">): boolean {
  const bs = lesson.bodySystem.toLowerCase();
  const sys = (lesson.system ?? "").toLowerCase();
  return (
    lesson.topicSlug === "cardiovascular" ||
    /cardiovascular|cardiac|heart\b/.test(bs) ||
    /cardiovascular|cardiac/.test(sys)
  );
}

function isRespiratoryLesson(lesson: Pick<PathwayLessonRecord, "bodySystem" | "system" | "topicSlug">): boolean {
  const bs = lesson.bodySystem.toLowerCase();
  const sys = (lesson.system ?? "").toLowerCase();
  return lesson.topicSlug === "respiratory" || /respiratory|pulmonary|lung\b/.test(bs) || /respiratory|pulmonary/.test(sys);
}

/**
 * Heuristic embedding when `embeddedSoundLibraries` is not authored.
 * Kept intentionally tight to avoid unrelated “cardio” lessons (e.g. fetal heart rate) picking up libraries.
 */
export function inferPathwayLessonSoundLibraries(lesson: PathwayLessonRecord): PathwayEmbeddedSoundLibraryId[] {
  const hay = lessonHaystack(lesson);
  const out: PathwayEmbeddedSoundLibraryId[] = [];

  if (
    isRespiratoryLesson(lesson) &&
    /auscult|breath sound|lung sound|respiratory assessment|oxygenation|crackle|wheeze|rhonchi|stridor|pleural/i.test(hay)
  ) {
    out.push("respiratory_sounds");
  }

  if (
    isCardiovascularLesson(lesson) &&
    /auscult|heart sound|murmur|s1\b|s2\b|s3\b|s4\b|gallop|valvul|stenosis|regurgit|insuffic|friction rub|pericardial|physical exam|cardiovascular exam|cardiac exam/i.test(
      hay,
    )
  ) {
    out.push("cardiac_sounds");
  }

  return [...new Set(out)];
}

/** Explicit catalog/DB metadata wins; otherwise conservative inference. */
export function resolvePathwayLessonSoundLibraries(lesson: PathwayLessonRecord): PathwayEmbeddedSoundLibraryId[] {
  const explicit = lesson.embeddedSoundLibraries?.filter((x) => ALLOWED.has(x));
  if (explicit?.length) return [...new Set(explicit)];
  return inferPathwayLessonSoundLibraries(lesson);
}
