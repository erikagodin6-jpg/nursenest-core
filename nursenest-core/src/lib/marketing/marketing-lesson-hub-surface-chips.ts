import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { marketingExamHubBasePath } from "@/lib/lessons/lesson-routes";
import {
  pathwayHubAppFlashcardsHref,
  pathwayHubAppPracticeTestsHref,
} from "@/lib/marketing/pathway-hub-app-questions-href";

export type MarketingLessonHubSurfaceChip = {
  label: string;
  href: string;
};

/**
 * Study-surface quick links shared by marketing lesson hubs and lesson detail pages.
 */
export function buildMarketingLessonHubSurfaceChips(
  pathway: ExamPathwayDefinition,
  opts: {
    canStartCat: boolean;
    questionSnapshotLoadRejected?: boolean;
  },
): MarketingLessonHubSurfaceChip[] {
  const overviewHref = marketingExamHubBasePath(pathway);
  const questionsHref = buildExamPathwayPath(pathway, "questions");
  const catHref = buildExamPathwayPath(pathway, "cat");
  const catUnavailable = opts.questionSnapshotLoadRejected ?? false;

  return [
    { label: "Practice Questions", href: questionsHref },
    {
      label: catUnavailable
        ? "Adaptive CAT — Status Unavailable"
        : opts.canStartCat
          ? "Adaptive CAT"
          : "Adaptive CAT Unavailable",
      href: catHref,
    },
    { label: "Flashcards", href: pathwayHubAppFlashcardsHref(pathway.id) },
    { label: "Practice Exams", href: pathwayHubAppPracticeTestsHref(pathway.id) },
    { label: "Exam Overview", href: overviewHref },
  ];
}
