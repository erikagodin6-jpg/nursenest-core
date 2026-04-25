"use client";

import { CheckCircle2 } from "lucide-react";
import { FlashcardRichContent } from "@/components/flashcards/flashcard-rich-content";
import {
  flashcardExamMcqOptionClass,
  optionLetterCircleClass,
} from "@/components/flashcards/flashcard-exam-mcq-styles";
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

export function FlashcardExamMcqAnswerList({
  exam,
  revealed,
  pickedLetter,
  tutorMcq,
  answerChoicesHeading,
  revealHint,
  onPickLetter,
}: FlashcardExamMcqAnswerListProps) {
  if (!exam?.answerOptions || exam.answerOptions.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 space-y-3">
      {/* Heading */}
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[var(--semantic-text-muted)]">
        {answerChoicesHeading}
      </p>

      <ul className="space-y-2" aria-label={answerChoicesHeading}>
        {exam.answerOptions.map((option) => {
          const interactive = tutorMcq && !revealed && Boolean(onPickLetter);
          const isCorrect = option.letter === exam.correctLetter;
          const isPicked = pickedLetter === option.letter;

          const visualArgs = {
            letter: option.letter,
            exam,
            revealed,
            pickedLetter,
            interactive,
          };

          const baseRow = (
            <div className="flex items-start gap-3">
              {/* Letter */}
              <span
                className={`${optionLetterCircleClass(
                  visualArgs
                )} transition`}
                aria-hidden
              >
                {option.letter}
              </span>

              {/* Text */}
              <FlashcardRichContent
                text={stripRedundantMcqLetterPrefix(option.text)}
                className="flex-1 text-[var(--semantic-text-primary)] leading-relaxed [&_p]:mb-1 [&_p:last-child]:mb-0"
              />

              {/* Correct icon */}
              {revealed && isCorrect ? (
                <CheckCircle2
                  className="h-5 w-5 shrink-0 text-[var(--semantic-success)] animate-fade-in"
                  aria-hidden
                />
              ) : (
                <span className="h-5 w-5 shrink-0" aria-hidden />
              )}
            </div>
          );

          return (
            <li key={option.letter} className="list-none">
              {interactive ? (
                <button
                  type="button"
                  onClick={() => onPickLetter?.(option.letter)}
                  className={`${flashcardExamMcqOptionClass(
                    visualArgs
                  )} w-full text-left transition-all duration-150 hover:scale-[1.01] active:scale-[0.99]`}
                >
                  {baseRow}
                </button>
              ) : (
                <div
                  className={`${flashcardExamMcqOptionClass(
                    visualArgs
                  )} transition-all duration-150`}
                >
                  {baseRow}
                </div>
              )}

              {/* Inline feedback (subtle UX boost) */}
              {revealed && isPicked && !isCorrect && (
                <p className="mt-1 text-xs text-[var(--semantic-danger)]">
                  Incorrect — review rationale →
                </p>
              )}
            </li>
          );
        })}
      </ul>

      {/* Hint */}
      {tutorMcq && !revealed && revealHint ? (
        <p className="text-xs text-[var(--semantic-text-muted)] mt-2">
          {revealHint}
        </p>
      ) : null}
    </div>
  );
}