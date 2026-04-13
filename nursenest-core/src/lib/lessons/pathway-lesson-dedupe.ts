import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";

type DedupeCandidate = PathwayLessonRecord & { id?: string | null; pathwayId?: string | null };

function normalizeLessonTitleForDedupe(title: string): string {
  return title
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^\p{L}\p{N}\s]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function dedupeKeyForLesson(lesson: DedupeCandidate, pathwayIdHint?: string): string | null {
  const pathwayId = lesson.pathwayId?.trim() || pathwayIdHint?.trim() || "_unknown_pathway";
  const id = lesson.id?.trim();
  if (id) return `id:${pathwayId}:${id}`;
  const slug = lesson.slug?.trim();
  if (slug) return `slug:${pathwayId}:${slug.toLowerCase()}`;
  const normalizedTitle = normalizeLessonTitleForDedupe(lesson.title ?? "");
  if (!normalizedTitle) return null;
  return `title:${pathwayId}:${normalizedTitle}`;
}

export function dedupePathwayLessonsForLibrary<T extends DedupeCandidate>(
  lessons: T[],
  options?: {
    pathwayIdHint?: string;
    source?: string;
    devLog?: boolean;
  },
): { items: T[]; duplicateCount: number } {
  const seen = new Map<string, T>();
  const kept: T[] = [];
  let duplicateCount = 0;

  for (const lesson of lessons) {
    const key = dedupeKeyForLesson(lesson, options?.pathwayIdHint);
    if (!key) {
      kept.push(lesson);
      continue;
    }
    if (seen.has(key)) {
      duplicateCount += 1;
      continue;
    }
    seen.set(key, lesson);
    kept.push(lesson);
  }

  if (options?.devLog && process.env.NODE_ENV !== "production" && duplicateCount > 0) {
    const source = options.source ?? "pathway_lesson_library";
    console.warn(
      `[pathway-lessons] deduped ${duplicateCount} duplicate lesson(s) in ${source}`,
    );
  }

  return { items: kept, duplicateCount };
}

export { normalizeLessonTitleForDedupe };
