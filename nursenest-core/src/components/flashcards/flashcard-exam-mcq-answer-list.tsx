"use client";

import { CheckCircle2 } from "lucide-react";
import { useEffect } from "react";
import { FlashcardRichContent } from "@/components/flashcards/flashcard-rich-content";
import {
  flashcardExamMcqOptionClass,
  optionLetterCircleClass,
} from "@/components/flashcards/flashcard-exam-mcq-styles";
import type { ExamMicroQuestionPayload } from "@/lib/flashcards/flashcard-exam-style";
import { stripRedundantMcqLetterPrefix } from "@/lib/questions/strip-mcq-option-letter-prefix";

function compactFeedbackText(text: string): string {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= 150) return normalized;
  const firstSentence = normalized.match(/^(.+?[.!?])\s/)?.[1];
  if (firstSentence && firstSentence.length <= 150) return firstSentence;
  return `${normalized.slice(0, 147).trim()}...`;
}

export type FlashcardExamMcqAnswerListProps = {
  exam: ExamMicroQuestionPayload;
  revealed: boolean;
  pickedLetter: string | null;
  tutorMcq: boolean;
  answerChoicesHeading: string;
  revealHint?: string | null;
  submitting?: boolean;
  onPickLetter?: (letter: string) => void;
  onSubmitAnswer?: () => void;
};

export function FlashcardExamMcqAnswerList({
  exam,
  revealed,
  pickedLetter,
  tutorMcq,
  answerChoicesHeading,
  revealHint,
  submitting = false,
  onPickLetter,
  onSubmitAnswer,
}: FlashcardExamMcqAnswerListProps) {
  const hasOptions = Array.isArray(exam?.answerOptions) && exam.answerOptions.length >= 2;

  useEffect(() => {
    if (hasOptions) return;
    console.error("[flashcard-mcq] exam payload missing answer options", {
      itemKind: exam?.itemKind ?? null,
      hasStem: Boolean(exam?.questionStem?.trim()),
      optionCount: Array.isArray(exam?.answerOptions) ? exam.answerOptions.length : null,
    });
  }, [exam?.answerOptions, exam?.itemKind, exam?.questionStem, hasOptions]);

  if (!hasOptions) {
    return (
      <div className="nn-flashcard-mcq-config-error" role="alert">
        <p>Question options could not load</p>
        <span>This item is configured as a multiple-choice question, but its answer choices are missing.</span>
      </div>
    );
  }

  return (
    <div className="nn-flashcard-exam-mcq-premium mt-4 space-y-3" data-nn-premium-flashcard-mcq>
      {/* Heading */}
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[var(--semantic-text-muted)]">
        {answerChoicesHeading}
      </p>

      <ul className="space-y-2" aria-label={answerChoicesHeading}>
        {exam.answerOptions.map((option) => {
          const interactive = tutorMcq && !revealed && Boolean(onPickLetter);
          const isCorrect = option.letter === exam.correctLetter;
          const isPicked = pickedLetter === option.letter;
          const incorrectRationale =
            exam.rationaleIncorrect.find((row) => row.letter === option.letter)?.rationale.trim() ?? "";
          const feedbackText = isCorrect ? "" : compactFeedbackText(incorrectRationale);

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
                  )} w-full text-left transition-all duration-150`}
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

              {revealed && !isCorrect && feedbackText ? (
                isPicked ? (
                  <div
                    className="nn-flashcard-answer-feedback nn-flashcard-answer-feedback--picked-wrong"
                  >
                    <span>Your answer</span>
                    <FlashcardRichContent text={feedbackText} className="[&_p]:mb-0" />
                  </div>
                ) : null
              ) : null}
            </li>
          );
        })}
      </ul>

      {!revealed ? (
        <button
          type="button"
          className="nn-flashcard-submit-answer"
          onClick={onSubmitAnswer}
          disabled={!pickedLetter || submitting}
        >
          {submitting ? "Checking..." : "Submit Answer"}
        </button>
      ) : null}

      {/* Hint */}
      {tutorMcq && !revealed && revealHint ? (
        <p className="text-xs text-[var(--semantic-text-muted)] mt-2">
          {revealHint}
        </p>
      ) : null}
    </div>
  );
}
