import type { PathwayLessonSectionKind } from "@/lib/lessons/pathway-lesson-types";

const RETENTION_SECTION_KINDS = new Set<PathwayLessonSectionKind>([
  "clinical_pearls",
  "red_flags",
  "takeaways",
  "exam_tips",
  "exam_focus",
  "exam_relevance",
]);

export function isLessonRetentionSectionKind(
  kind: PathwayLessonSectionKind | null | undefined,
): boolean {
  return kind ? RETENTION_SECTION_KINDS.has(kind) : false;
}
