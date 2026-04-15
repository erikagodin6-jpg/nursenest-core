"use client";

import { CheckCircle2, BookOpen, Lightbulb } from "lucide-react";
import { FlashcardRichContent } from "@/components/flashcards/flashcard-rich-content";

export type FlashcardStudyQuestionStackProps = {
  sessionModeLabel: string;
  topicLine: string | null;
  prompt: string;
  answer: string;
  explanation: string | null | undefined;
  pearl: string;
  revealed: boolean;
  onReveal: () => void;
  labels: {
    revealCta: string;
    revealHint: string;
    answerHeading: string;
    rationaleHeading: string;
    takeawayHeading: string;
    /** Suppress empty-state pearl text in the takeaway block */
    emptyPearlMessage: string;
  };
};

/**
 * Question-bank-style stack: stem (with optional embedded images) → reveal → answer → rationale beneath.
 * Calm, scannable, long-session typography — matches `.nn-question-stem-card` / rationale panels.
 */
export function FlashcardStudyQuestionStack({
  sessionModeLabel,
  topicLine,
  prompt,
  answer,
  explanation,
  pearl,
  revealed,
  onReveal,
  labels,
}: FlashcardStudyQuestionStackProps) {
  const exp = explanation?.trim() ?? "";
  const pearlTrim = pearl.trim();
  const missing = labels.emptyPearlMessage.trim();
  /** When a full rationale exists, it carries the teaching — avoid repeating a “pearl” excerpt. */
  const showTakeaway =
    !exp && pearlTrim.length > 0 && (!missing || pearlTrim !== missing);

  return (
    <div className="w-full max-w-2xl space-y-5">
      <div className="nn-question-stem-card text-left shadow-[var(--shadow-card)]">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <span className="nn-marketing-caption font-semibold uppercase tracking-[0.14em] text-[var(--semantic-text-muted)]">
            {sessionModeLabel}
          </span>
        </div>
        {topicLine ? (
          <p className="mb-3 text-xs font-medium text-[var(--semantic-text-secondary)]">{topicLine}</p>
        ) : null}
        <div className="nn-question-stem-wrap">
          <FlashcardRichContent text={prompt} />
        </div>

        {!revealed ? (
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-[var(--semantic-text-muted)]">{labels.revealHint}</p>
            <button
              type="button"
              onClick={onReveal}
              className="inline-flex min-h-[44px] min-w-[min(100%,12rem)] shrink-0 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--semantic-brand)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--semantic-surface))] px-5 py-3 text-sm font-semibold text-[var(--semantic-text-primary)] shadow-sm transition hover:bg-[color-mix(in_srgb,var(--semantic-brand)_14%,var(--semantic-surface))]"
            >
              {labels.revealCta}
              <span className="ml-2 text-xs font-normal text-[var(--semantic-text-muted)]" aria-hidden>
                (Space)
              </span>
            </button>
          </div>
        ) : null}
      </div>

      {revealed ? (
        <div className="space-y-4">
          <section
            className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-success)_32%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_9%,var(--semantic-surface))] p-4 sm:p-5"
            aria-labelledby="fc-answer-heading"
          >
            <div className="mb-2 flex items-center gap-2" id="fc-answer-heading">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden />
              <h3 className="text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-[var(--semantic-text-muted)]">
                {labels.answerHeading}
              </h3>
            </div>
            <FlashcardRichContent text={answer} className="!text-[var(--semantic-text-primary)]" />
          </section>

          {exp ? (
            <section
              className="nn-rationale-key-point"
              aria-labelledby="fc-rationale-heading"
            >
              <p className="nn-rationale-key-point__label" id="fc-rationale-heading">
                <BookOpen className="nn-rationale-key-point__icon text-[var(--semantic-info)]" aria-hidden />
                {labels.rationaleHeading}
              </p>
              <FlashcardRichContent
                text={exp}
                className="!text-[var(--semantic-text-primary)] text-sm leading-relaxed [&_p]:mb-2 [&_p:last-child]:mb-0"
              />
            </section>
          ) : null}

          {showTakeaway ? (
            <section
              className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-chart-3)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-warm)_40%,var(--semantic-surface))] p-4 sm:p-5"
              aria-labelledby="fc-pearl-heading"
            >
              <div className="mb-2 flex items-center gap-2" id="fc-pearl-heading">
                <Lightbulb className="h-4 w-4 shrink-0 text-[var(--semantic-warning)]" aria-hidden />
                <h3 className="text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-[var(--semantic-text-muted)]">
                  {labels.takeawayHeading}
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-[var(--semantic-text-primary)] whitespace-pre-wrap">{pearlTrim}</p>
            </section>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
