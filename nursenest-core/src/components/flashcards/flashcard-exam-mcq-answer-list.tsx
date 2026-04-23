"use client";

import { CheckCircle2 } from "lucide-react";
import { FlashcardRichContent } from "@/components/flashcards/flashcard-rich-content";
import { flashcardExamMcqOptionClass, optionLetterCircleClass } from "@/components/flashcards/flashcard-exam-mcq-styles";
import type { ExamMicroQuestionPayload } from "@/lib/flashcards/flashcard-exam-style";
import { stripRedundantMcqLetterPrefix } from "@/lib/questions/strip-mcq-option-letter-prefix";

export type FlashcardExamMcqAnswerListProps = {
  exam: ExamMicroQuestionPayload;
  revealed: boolean;
  pickedLetter: string | null;
  tutorMcq: boolean;
  answerChoicesHeading: string;
  revealHint?: string | null;
  onPickLetter?: (letter: string) => void;
};

/**
 * **Single** MCQ option list for exam-style flashcards (stack + split layouts).
 * Do not duplicate row markup or class builders elsewhere.
 */
export function FlashcardExamMcqAnswerList({
  exam,
  revealed,
  pickedLetter,
  tutorMcq,
  answerChoicesHeading,
  revealHint,
  onPickLetter,
}: FlashcardExamMcqAnswerListProps) {
  return (
    <div className="mt-3 space-y-2">
      <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-[var(--semantic-text-muted)]">
        {answerChoicesHeading}
      </p>
      <ul className="space-y-2" aria-label={answerChoicesHeading}>
        {exam.answerOptions.map((o) => {
          const interactive = tutorMcq && !revealed && Boolean(onPickLetter);
          const showCorrectMark = revealed && o.letter === exam.correctLetter;
          const visualArgs = {
            letter: o.letter,
            exam,
            revealed,
            pickedLetter,
            interactive,
          };
          const row = (
            <>
              <span className={optionLetterCircleClass(visualArgs)} aria-hidden>
                {o.letter}
              </span>
              <FlashcardRichContent
                text={stripRedundantMcqLetterPrefix(o.text)}
                className="min-w-0 flex-1 text-[var(--semantic-text-primary)] [&_p]:mb-1 [&_p:last-child]:mb-0"
              />
              {showCorrectMark ? (
                <CheckCircle2 className="h-5 w-5 shrink-0 text-[var(--semantic-success)]" aria-hidden />
              ) : (
                <span className="h-5 w-5 shrink-0" aria-hidden />
              )}
            </>
          );
          return (
            <li key={o.letter} className="list-none">
              {interactive ? (
                <button
                  type="button"
                  onClick={() => onPickLetter?.(o.letter)}
                  className={`${flashcardExamMcqOptionClass(visualArgs)} w-full cursor-pointer text-left`}
                >
                  {row}
                </button>
              ) : (
                <div className={flashcardExamMcqOptionClass(visualArgs)}>{row}</div>
              )}
            </li>
          );
        })}
      </ul>
      {tutorMcq && !revealed && revealHint ? (
        <p className="text-xs text-[var(--semantic-text-muted)]">{revealHint}</p>
      ) : null}
    </div>
  );
}
