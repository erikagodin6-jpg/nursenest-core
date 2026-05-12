"use client";

import { useEffect } from "react";
import { FlashcardRichContent } from "@/components/flashcards/flashcard-rich-content";
import type { ExamMicroQuestionPayload } from "@/lib/flashcards/flashcard-exam-style";
import { stripRedundantMcqLetterPrefix } from "@/lib/questions/strip-mcq-option-letter-prefix";

type StackLabels = {
  answerHeading?: string;
  whyCorrectHeading?: string;
  whyIncorrectHeading?: string;
  takeawayHeading?: string;
};

export function FlashcardStudyRevealPanels({
  exam,
  answer,
  explanation,
  pearl,
  labels,
  onRationaleOpened,
}: {
  exam?: ExamMicroQuestionPayload | null;
  answer: string;
  explanation?: string;
  pearl?: string | null;
  labels?: StackLabels;
  /** Fired exactly once when this panel first mounts (card revealed). */
  onRationaleOpened?: () => void;
}) {
  // Fire exactly once when the reveal panel mounts — the component only exists
  // when revealed=true, so this fires on first reveal and never again for this card.
  useEffect(() => {
    onRationaleOpened?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const correctOptionText = exam
    ? stripRedundantMcqLetterPrefix(
        exam.answerOptions.find((o) => o.letter === exam.correctLetter)?.text ?? "",
      )
    : "";

  const whyCorrect =
    (explanation && String(explanation).trim()) ||
    (exam?.rationaleCorrect && String(exam.rationaleCorrect).trim()) ||
    "";

  return (
    <div className="nn-flashcard-reveal-stack nn-flashcard-reveal-stack--premium space-y-4 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300">
      <div className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-success)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_10%,var(--semantic-surface))] p-4 shadow-[var(--semantic-shadow-soft)]">
        <div className="mb-1 text-xs font-bold uppercase tracking-wide text-[var(--semantic-success)]">
          {labels?.answerHeading ?? "Answer"}
        </div>

        <div className="flex items-start gap-2">
          {exam?.correctLetter ? (
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--semantic-success)] text-xs font-bold nn-text-on-solid-fill">
              {exam.correctLetter}
            </span>
          ) : null}

          <span className="text-base font-medium leading-relaxed text-[var(--semantic-text-primary)]">
            {correctOptionText || answer}
          </span>
        </div>
      </div>

      {whyCorrect ? (
        <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-muted)_55%,var(--semantic-surface))] p-4 shadow-[var(--semantic-shadow-soft)]">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-secondary)]">
            {labels?.whyCorrectHeading ?? "Why this is correct"}
          </div>
          <div className="nn-marketing-body-sm leading-relaxed text-[var(--semantic-text-primary)]">
            <FlashcardRichContent text={whyCorrect} />
          </div>
        </div>
      ) : null}

      {exam?.rationaleIncorrect?.length ? (
        <details
          className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] shadow-[var(--semantic-shadow-soft)] open:pb-4"
          open
          data-testid="flashcard-wrong-answer-menu"
        >
          <summary className="cursor-pointer list-none p-4 text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-secondary)] [&::-webkit-details-marker]:hidden">
            <span className="flex items-center justify-between gap-2">
              <span>{labels?.whyIncorrectHeading ?? "Why the others are incorrect"}</span>
              <span className="text-[10px] font-normal normal-case tracking-normal text-[var(--semantic-text-muted)] sm:hidden">
                tap to collapse
              </span>
            </span>
          </summary>

          <div className="space-y-2 px-4 text-sm leading-relaxed text-[var(--semantic-text-primary)]">
            {exam.rationaleIncorrect.map((r) => (
              <div key={r.letter} data-testid={`flashcard-distractor-${r.letter}`}>
                <strong className="text-[var(--semantic-chart-2)]">{r.letter}</strong>: {r.rationale}
              </div>
            ))}
          </div>
        </details>
      ) : null}

      {pearl ? (
        <div className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-warning)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-warm)_65%,var(--semantic-surface))] p-4 shadow-[var(--semantic-shadow-soft)]">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--semantic-warning)]">
            {labels?.takeawayHeading ?? "Clinical pearl"}
          </div>
          <div className="text-sm leading-relaxed text-[var(--semantic-text-primary)]">
            <FlashcardRichContent text={String(pearl)} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
