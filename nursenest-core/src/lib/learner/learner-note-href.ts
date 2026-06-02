import { LearnerNoteScope } from "@prisma/client";
import { parsePathwaySyntheticProgressId } from "@/lib/lessons/lesson-progress-resolver";
import { decodeNotebookBody, isNotebookContextId } from "@/lib/learner/personal-study-notebook";

/** Best-effort deep links for recent-notes list (metadata only in UI). */
export function hrefForLearnerNote(scope: LearnerNoteScope, contextId: string, body?: string | null): string {
  if (isNotebookContextId(contextId)) {
    const decoded = decodeNotebookBody(body ?? "", { contextId, scope });
    if (decoded.sourceHref?.startsWith("/")) return decoded.sourceHref;
    if (decoded.sourceType === "flashcard") return "/app/flashcards";
    if (decoded.sourceType === "question") return "/app/questions";
    if (decoded.sourceType === "cat_exam") return "/app/cat";
    if (decoded.sourceType === "ecg") return "/app/ecg";
    if (decoded.sourceType === "pharmacology") return "/app/pharmacology";
    if (decoded.sourceType === "clinical_skill") return "/app/clinical-skills";
    if (decoded.sourceType === "simulation") return "/app/simulations";
    if (decoded.sourceType === "lab") return "/app/labs";
    return "/app/account/notebook";
  }

  switch (scope) {
    case LearnerNoteScope.PATHWAY_LESSON:
      if (parsePathwaySyntheticProgressId(contextId)) return "/app/lessons";
      return `/app/lessons/${encodeURIComponent(contextId)}`;
    case LearnerNoteScope.CONTENT_LESSON:
      return `/app/lessons/${encodeURIComponent(contextId)}`;
    case LearnerNoteScope.QUESTION_BANK:
      return "/app/questions";
    case LearnerNoteScope.PRACTICE_TEST:
      return `/app/practice-tests/${encodeURIComponent(contextId)}`;
    case LearnerNoteScope.FLASHCARD_DECK:
      return `/app/flashcards/${encodeURIComponent(contextId)}`;
  }
}

export function labelForLearnerNoteScope(scope: LearnerNoteScope): string {
  switch (scope) {
    case LearnerNoteScope.PATHWAY_LESSON:
      return "Pathway lesson";
    case LearnerNoteScope.CONTENT_LESSON:
      return "Lesson";
    case LearnerNoteScope.QUESTION_BANK:
      return "Question bank";
    case LearnerNoteScope.PRACTICE_TEST:
      return "Practice test";
    case LearnerNoteScope.FLASHCARD_DECK:
      return "Flashcards";
  }
}
