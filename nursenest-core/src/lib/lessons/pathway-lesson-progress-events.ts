import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";

export const PATHWAY_LESSON_PROGRESS_EVENT = "nn-pathway-lesson-progress";

export type PathwayLessonProgressEventDetail = {
  pathwayId: string;
  lessonSlug: string;
  status: PathwayLessonProgressStatus;
  /** "auto" when scroll+dwell threshold met; omit for manual actions */
  source?: "auto" | "manual";
};

export function emitPathwayLessonProgress(detail: PathwayLessonProgressEventDetail): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(PATHWAY_LESSON_PROGRESS_EVENT, { detail }));
}
