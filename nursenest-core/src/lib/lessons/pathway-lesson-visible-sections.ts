import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";

const PREVIEW_WORD_LIMIT = 180;

function clampPreviewWords(body: string, maxWords: number): string {
  const normalized = body.replace(/\s+/g, " ").trim();
  if (!normalized) return "";
  const words = normalized.split(" ");
  if (words.length <= maxWords) return normalized;
  return `${words.slice(0, maxWords).join(" ")}...`;
}

/**
 * Preview-only slice for SSR. Does not encode entitlement; callers must pass `fullAccess`
 * from {@link canViewFullPathwayLesson}.
 */
export function visibleSectionsForLesson(
  lesson: PathwayLessonRecord,
  fullAccess: boolean,
): PathwayLessonRecord["sections"] {
  if (fullAccess) return lesson.sections;
  const [first] = lesson.sections;
  if (!first) return [];
  return [
    {
      id: first.id,
      heading: first.heading,
      kind: first.kind,
      body: clampPreviewWords(first.body, PREVIEW_WORD_LIMIT),
    },
  ];
}
