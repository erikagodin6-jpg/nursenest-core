"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, BookOpen, Lightbulb } from "lucide-react";
import { FlashcardRichContent } from "@/components/flashcards/flashcard-rich-content";
import type { ExamMicroQuestionPayload } from "@/lib/flashcards/flashcard-exam-style";

/** One-line teaching blurb for “why wrong” rows (competitor-style scan). */
export function firstTeachingLine(raw: string): string {
  const t = raw.replace(/\s+/g, " ").trim();
  if (!t) return "";
  const firstLine = t.split(/\s*\n\s*/)[0] ?? t;
  const m = firstLine.match(/^.{1,200}?[.!?](?=\s|$)/);
  const sentence = (m?.[0] ?? firstLine).trim();
  return sentence.length > 160 ? `${sentence.slice(0, 157)}…` : sentence;
}

export type FlashcardStudyQuestionStackProps = {
  sessionModeLabel: string;
  topicLine: string | null;
  /** When set, stem shows as an NCLEX-style micro-question with A–D choices before reveal. */
  examMicroQuestion?: ExamMicroQuestionPayload | null;
  /** Short badge (e.g. “Item focus: Clinical judgment”). */
  itemKindCaption?: string | null;
  prompt: string;
  answer: string;
  explanation: string | null | undefined;
  pearl: string;
  revealed: boolean;
  onReveal: () => void;
  /**
   * `tutor_select` (default when `examMicroQuestion` is set): tap an option to lock, highlight correct/incorrect, then show rationale.
   * `reveal_cta`: legacy flip-to-reveal for non-MCQ or explicit review mode.
   */
  mcqInteractionMode?: "tutor_select" | "reveal_cta";
  labels: {
    revealCta: string;
    revealHint: string;
    answerHeading: string;
    rationaleHeading: string;
    takeawayHeading: string;
    answerChoicesHeading: string;
    distractorAnalysisHeading: string;
    /** Suppress empty-state pearl text in the takeaway block */
    emptyPearlMessage: string;
  };
};

export function flashcardExamMcqOptionClass(args: {
  letter: string;
  exam: ExamMicroQuestionPayload;
  revealed: boolean;
  pickedLetter: string | null;
  tutorMode: boolean;
  interactive: boolean;
}): string {
  const { letter, exam, revealed, pickedLetter, tutorMode, interactive } = args;
  const base =
    "w-full rounded-xl border px-3 py-2 text-left text-sm leading-snug text-[var(--semantic-text-primary)] transition";
  if (!revealed) {
    if (interactive) {
      return `${base} border-[color-mix(in_srgb,var(--semantic-chart-2)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_42%,var(--semantic-surface))] hover:bg-[color-mix(in_srgb,var(--semantic-info)_12%,var(--semantic-surface))] min-h-[44px]`;
    }
    return `${base} border-[color-mix(in_srgb,var(--semantic-chart-2)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_42%,var(--semantic-surface))]`;
  }
  if (!tutorMode) {
    return `${base} border-[color-mix(in_srgb,var(--semantic-chart-2)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_42%,var(--semantic-surface))] opacity-90`;
  }
  const isCorrect = letter === exam.correctLetter;
  const wasPicked = pickedLetter === letter;
  if (isCorrect) {
    return `${base} border-[color-mix(in_srgb,var(--semantic-success)_45%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_14%,var(--semantic-surface))] ring-1 ring-[color-mix(in_srgb,var(--semantic-success)_35%,transparent)]`;
  }
  if (wasPicked) {
    return `${base} border-[color-mix(in_srgb,var(--semantic-danger)_45%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-danger)_12%,var(--semantic-surface))] ring-1 ring-[color-mix(in_srgb,var(--semantic-danger)_30%,transparent)]`;
  }
  return `${base} border-[color-mix(in_srgb,var(--semantic-border-soft)_80%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-muted)_55%,var(--semantic-surface))] opacity-[0.72]`;
}

/**
 * Question-bank-style stack: stem (with optional embedded images) → reveal → answer → rationale beneath.
 * Calm, scannable, long-session typography — matches `.nn-question-stem-card` / rationale panels.
 */
export function FlashcardStudyQuestionStack({
  sessionModeLabel,
  topicLine,
  examMicroQuestion = null,
  itemKindCaption = null,
  prompt,
  answer,
  explanation,
  pearl,
  revealed,
  onReveal,
  mcqInteractionMode,
  labels,
}: FlashcardStudyQuestionStackProps) {
  const exam = examMicroQuestion;
  const tutorMcq = Boolean(exam && (mcqInteractionMode ?? "tutor_select") === "tutor_select");
  const [pickedLetter, setPickedLetter] = useState<string | null>(null);

  useEffect(() => {
    setPickedLetter(null);
  }, [exam?.questionStem, exam?.correctLetter, prompt]);

  const exp = exam ? exam.rationaleCorrect.trim() : explanation?.trim() ?? "";
  const pearlTrim = pearl.trim();
  const missing = labels.emptyPearlMessage.trim();
  /** When a full rationale exists, it carries the teaching — avoid repeating a “pearl” excerpt. */
  const showTakeaway =
    !exp && pearlTrim.length > 0 && (!missing || pearlTrim !== missing);

  function commitPick(letter: string) {
    if (revealed || !exam || !tutorMcq) return;
    setPickedLetter(letter);
    onReveal();
  }

  return (
    <div className="w-full min-w-0 max-w-2xl space-y-3">
      <div className="nn-question-stem-card text-left">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <span className="nn-marketing-caption font-semibold uppercase tracking-[0.14em] text-[var(--semantic-text-muted)]">
            {sessionModeLabel}
          </span>
        </div>
        {topicLine ? (
          <p className="mb-2 text-xs font-medium text-[var(--semantic-text-secondary)]">{topicLine}</p>
        ) : null}
        {itemKindCaption ? (
          <p className="mb-2 inline-flex max-w-full rounded-full border border-[color-mix(in_srgb,var(--semantic-info)_34%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_10%,var(--semantic-surface))] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--semantic-text-secondary)]">
            {itemKindCaption}
          </p>
        ) : null}
        <div className="nn-question-stem-wrap">
          <FlashcardRichContent text={prompt} />
        </div>

        {exam ? (
          <div className="mt-3 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--semantic-text-muted)]">
              {labels.answerChoicesHeading}
            </p>
            <ul className="space-y-1.5" aria-label={labels.answerChoicesHeading}>
              {exam.answerOptions.map((o) => {
                const interactive = tutorMcq && !revealed;
                return (
                  <li key={o.letter} className="list-none">
                    {interactive ? (
                      <button
                        type="button"
                        onClick={() => commitPick(o.letter)}
                        className={flashcardExamMcqOptionClass({
                          letter: o.letter,
                          exam,
                          revealed,
                          pickedLetter,
                          tutorMode: tutorMcq,
                          interactive: true,
                        })}
                      >
                        <div className="flex gap-2">
                          <span className="shrink-0 font-mono text-xs font-bold text-[var(--semantic-chart-2)]">
                            {o.letter}.
                          </span>
                          <FlashcardRichContent
                            text={o.text}
                            className="min-w-0 flex-1 [&_p]:mb-1 [&_p:last-child]:mb-0"
                          />
                        </div>
                      </button>
                    ) : (
                      <div
                        className={flashcardExamMcqOptionClass({
                          letter: o.letter,
                          exam,
                          revealed,
                          pickedLetter,
                          tutorMode: tutorMcq,
                          interactive: false,
                        })}
                      >
                        <div className="flex gap-2">
                          <span className="shrink-0 font-mono text-xs font-bold text-[var(--semantic-chart-2)]">
                            {o.letter}.
                          </span>
                          <FlashcardRichContent
                            text={o.text}
                            className="min-w-0 flex-1 [&_p]:mb-1 [&_p:last-child]:mb-0"
                          />
                        </div>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
            {tutorMcq && !revealed ? (
              <p className="text-xs text-[var(--semantic-text-muted)]">{labels.revealHint}</p>
            ) : null}
          </div>
        ) : null}

        {!revealed && (!exam || !tutorMcq) ? (
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-[var(--semantic-text-muted)]">{labels.revealHint}</p>
            <button
              type="button"
              onClick={onReveal}
              className="inline-flex min-h-[44px] min-w-[min(100%,12rem)] shrink-0 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--semantic-brand)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--semantic-surface))] px-5 py-2.5 text-sm font-semibold text-[var(--semantic-text-primary)] shadow-sm transition hover:bg-[color-mix(in_srgb,var(--semantic-brand)_14%,var(--semantic-surface))]"
            >
              {labels.revealCta}
            </button>
          </div>
        ) : null}
      </div>

      {revealed ? (
        <div className="space-y-3">
          <section
            className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-success)_32%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_9%,var(--semantic-surface))] p-3 sm:p-4"
            aria-labelledby="fc-answer-heading"
          >
            <div className="mb-1.5 flex items-center gap-2" id="fc-answer-heading">
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

          {exam && revealed ? (
            <section
              className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-chart-4)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-warm)_35%,var(--semantic-surface))] p-3 sm:p-4"
              aria-labelledby="fc-distractor-heading"
            >
              <h3
                className="text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-[var(--semantic-text-muted)]"
                id="fc-distractor-heading"
              >
                {labels.distractorAnalysisHeading}
              </h3>
              <ul className="mt-2 space-y-2">
                {exam.rationaleIncorrect.map((row) => (
                  <li
                    key={row.letter}
                    className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-danger)_26%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-danger)_8%,var(--semantic-surface))] px-3 py-2 text-sm leading-relaxed text-[var(--semantic-text-primary)]"
                  >
                    <div className="flex gap-2">
                      <span className="shrink-0 font-mono text-xs font-bold text-[var(--semantic-danger)]">
                        {row.letter}.
                      </span>
                      <span className="min-w-0 flex-1">{firstTeachingLine(row.rationale)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {showTakeaway ? (
            <section
              className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-chart-3)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-warm)_40%,var(--semantic-surface))] p-3 sm:p-4"
              aria-labelledby="fc-pearl-heading"
            >
              <div className="mb-1.5 flex items-center gap-2" id="fc-pearl-heading">
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
