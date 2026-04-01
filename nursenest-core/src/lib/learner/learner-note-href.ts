import { LearnerNoteScope } from "@prisma/client";

/** Best-effort deep links for recent-notes list (metadata only in UI). */
export function hrefForLearnerNote(scope: LearnerNoteScope, contextId: string): string {
  switch (scope) {
    case LearnerNoteScope.PATHWAY_LESSON:
    case LearnerNoteScope.CONTENT_LESSON:
      return `/app/lessons/${encodeURIComponent(contextId)}`;
    case LearnerNoteScope.QUESTION_BANK:
      return "/app/questions";
    case LearnerNoteScope.PRACTICE_TEST:
      return `/app/practice-tests/${encodeURIComponent(contextId)}`;
    case LearnerNoteScope.FLASHCARD_DECK:
      return `/app/flashcards/${encodeURIComponent(contextId)}`;
    default:
      return "/app";
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
    default:
      return "Study";
  }
}
