"use client";

import { useEffect, useState } from "react";
import { BookOpen, CheckCircle2, Lightbulb, X } from "lucide-react";
import { FlashcardRichContent, flashcardTextMayContainMarkup } from "@/components/flashcards/flashcard-rich-content";
import { FlashcardExamMcqAnswerList } from "@/components/flashcards/flashcard-exam-mcq-answer-list";
import type { ExamMicroQuestionPayload } from "@/lib/flashcards/flashcard-exam-style";
import { stripRedundantMcqLetterPrefix } from "@/lib/questions/strip-mcq-option-letter-prefix";

export { FlashcardExamMcqAnswerList } from "@/components/flashcards/flashcard-exam-mcq-answer-list";
export type { FlashcardExamMcqAnswerListProps } from "@/components/flashcards/flashcard-exam-mcq-answer-list";

/** One-line teaching blurb for “why wrong” rows (competitor-style scan). */
export function firstTeachingLine(raw: string): string {
  const t = raw.replace(/\s+/g, " ").trim();
  if (!t) return "";
  const firstLine = t.split(/\s*\n\s*/)[0] ?? t;
  const m = firstLine.match(/^.{1,200}?[.!?](?=\s|$)/);
  const sentence = (m?.[0] ?? firstLine).trim();
  return sentence.length > 160 ? `${sentence.slice(0, 157)}…` : sentence;
}

/** When the stem is HTML, pull the first illustration to the clinical reference column and trim it from the stem. */
export function splitPromptLeadingImage(prompt: string): { stem: string; imageSrc: string | null } {
  if (!flashcardTextMayContainMarkup(prompt)) return { stem: prompt, imageSrc: null };
  const imgRe = /<img\b[^>]*\bsrc\s*=\s*["']([^"']+)["'][^>]*\/?>/i;
  const m = prompt.match(imgRe);
  if (!m || m.index === undefined) return { stem: prompt, imageSrc: null };
  const imageSrc = m[1]?.trim() || null;
  if (!imageSrc) return { stem: prompt, imageSrc: null };
  const before = prompt.slice(0, m.index);
  const after = prompt.slice(m.index + m[0].length);
  const without = `${before}${after}`.replace(/<p>\s*<\/p>/gi, "").trim();
  const textOnly = without.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  if (textOnly.length < 8) return { stem: prompt, imageSrc };
  return { stem: without, imageSrc };
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
    clinicalReferenceHeading: string;
    rationaleReviewHeading: string;
    whyCorrectHeading: string;
    whyIncorrectHeading: string;
    clinicalReferenceEmpty: string;
  };
};

/**
 * Question-bank-style stack: stem (with optional embedded images) → reveal → answer → rationale.
 * Exam-style cards use a fixed two-column board: question + options (left), clinical reference + rationale (right).
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
  const examBoard = Boolean(exam);

  useEffect(() => {
    setPickedLetter(null);
  }, [exam?.questionStem, exam?.correctLetter, prompt]);

  /** One frame with “selected” styling before reveal so rows never jump straight to green/red. */
  useEffect(() => {
    if (!pickedLetter || revealed || !tutorMcq || !exam) return;
    const id = requestAnimationFrame(() => {
      onReveal();
    });
    return () => cancelAnimationFrame(id);
  }, [pickedLetter, revealed, tutorMcq, exam, onReveal]);

  const exp = exam ? exam.rationaleCorrect.trim() : explanation?.trim() ?? "";
  const pearlTrim = pearl.trim();
  const missing = labels.emptyPearlMessage.trim();
  /** When a full rationale exists, it carries the teaching — avoid repeating a “pearl” excerpt. */
  const showTakeaway =
    !exp && pearlTrim.length > 0 && (!missing || pearlTrim !== missing);

  const { stem: stemForQuestion, imageSrc: clinicalImageSrc } = examBoard
    ? splitPromptLeadingImage(prompt)
    : { stem: prompt, imageSrc: null as string | null };

  function commitPick(letter: string) {
    if (revealed || !exam || !tutorMcq) return;
    setPickedLetter(letter);
  }

  const correctOptionText = exam
    ? stripRedundantMcqLetterPrefix(exam.answerOptions.find((o) => o.letter === exam.correctLetter)?.text ?? "")
    : "";

  const questionCard = (
    <div
      className={`rounded-2xl border border-[color-mix(in_srgb,var(--semantic-border-soft)_90%,var(--semantic-text-primary))] bg-[var(--semantic-surface)] p-5 shadow-sm sm:p-6 ${examBoard ? "min-h-0 min-w-0" : ""}`}
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-[var(--semantic-text-muted)]">
          {sessionModeLabel}
        </span>
      </div>
      {topicLine ? (
        <p className="mb-2 text-xs font-medium text-[var(--semantic-text-secondary)]">{topicLine}</p>
      ) : null}
      {itemKindCaption ? (
        <p className="mb-3 inline-flex max-w-full rounded-full border border-[color-mix(in_srgb,var(--semantic-info)_34%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_10%,var(--semantic-surface))] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--semantic-text-secondary)]">
          {itemKindCaption}
        </p>
      ) : null}
      <div className="nn-question-stem-wrap text-base font-semibold leading-snug text-[var(--semantic-text-primary)] sm:text-[1.05rem]">
        <FlashcardRichContent text={stemForQuestion} />
      </div>

      {exam ? (
        <FlashcardExamMcqAnswerList
          exam={exam}
          revealed={revealed}
          pickedLetter={pickedLetter}
          tutorMcq={tutorMcq}
          answerChoicesHeading={labels.answerChoicesHeading}
          revealHint={labels.revealHint}
          onPickLetter={(letter) => commitPick(letter)}
        />
      ) : null}

      {!revealed && (!exam || !tutorMcq) ? (
        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
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
  );

  const rationaleColumn =
    examBoard ? (
      <aside className="flex min-h-0 min-w-0 flex-col gap-4">
        <div className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-border-soft)_90%,var(--semantic-text-primary))] bg-[var(--semantic-surface)] p-4 shadow-sm sm:p-5">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-[var(--semantic-text-muted)]">
            {labels.clinicalReferenceHeading}
          </p>
          <div className="mt-4 flex min-h-[12rem] items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--semantic-border-soft)_88%,var(--semantic-text-primary))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_28%,var(--semantic-surface))] p-4">
            {clinicalImageSrc ? (
              // eslint-disable-next-line @next/next/no-img-element -- flashcard stems may reference CDN URLs from trusted content
              <img
                src={clinicalImageSrc}
                alt=""
                className="max-h-[min(42vh,22rem)] w-auto max-w-full object-contain"
              />
            ) : (
              <p className="max-w-xs text-center text-xs leading-relaxed text-[var(--semantic-text-muted)]">
                {labels.clinicalReferenceEmpty}
              </p>
            )}
          </div>
        </div>

        {revealed ? (
          <div className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-border-soft)_90%,var(--semantic-text-primary))] bg-[var(--semantic-surface)] p-4 shadow-sm sm:p-5">
            <div className="mb-4 flex items-center gap-2 border-b border-[var(--semantic-border-soft)] pb-3">
              <BookOpen className="h-4 w-4 shrink-0 text-[var(--semantic-brand)]" aria-hidden />
              <h2 className="text-sm font-semibold text-[var(--semantic-brand)]">{labels.rationaleReviewHeading}</h2>
            </div>

            <section
              className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-success)_38%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_10%,var(--semantic-surface))] p-3 sm:p-4"
              aria-labelledby="fc-answer-heading"
            >
              <div className="mb-2 flex items-center gap-2" id="fc-answer-heading">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden />
                <h3 className="text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-[var(--semantic-text-muted)]">
                  {labels.answerHeading}
                </h3>
              </div>
              <div className="text-sm font-medium leading-relaxed text-[var(--semantic-text-primary)]">
                {exam && correctOptionText ? (
                  <span className="inline-flex flex-wrap items-start gap-2">
                    <span
                      className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-[color-mix(in_srgb,var(--semantic-success)_55%,transparent)] bg-[var(--semantic-success)] text-[11px] font-bold text-[var(--semantic-surface)]"
                      aria-hidden
                    >
                      {exam.correctLetter}
                    </span>
                    {flashcardTextMayContainMarkup(correctOptionText) ? (
                      <FlashcardRichContent text={correctOptionText} className="inline-block min-w-0 flex-1 align-top" />
                    ) : (
                      <span className="min-w-0 flex-1">{correctOptionText}</span>
                    )}
                  </span>
                ) : (
                  <FlashcardRichContent text={answer} />
                )}
              </div>
            </section>

            {exp ? (
              <section
                className="mt-3 rounded-xl border border-[color-mix(in_srgb,var(--semantic-info)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_32%,var(--semantic-surface))] p-3 sm:p-4"
                aria-labelledby="fc-why-correct-heading"
              >
                <p
                  className="mb-2 flex items-center gap-2 text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-[var(--semantic-text-muted)]"
                  id="fc-why-correct-heading"
                >
                  <Lightbulb className="h-4 w-4 shrink-0 text-[var(--semantic-warning)]" aria-hidden />
                  {labels.whyCorrectHeading}
                </p>
                <FlashcardRichContent
                  text={exp}
                  className="!text-[var(--semantic-text-primary)] text-sm leading-relaxed [&_p]:mb-2 [&_p:last-child]:mb-0"
                />
              </section>
            ) : null}

            {exam && revealed ? (
              <section
                className="mt-3 rounded-xl border border-[color-mix(in_srgb,var(--semantic-border-soft)_88%,var(--semantic-text-primary))] bg-[color-mix(in_srgb,var(--semantic-panel-muted)_30%,var(--semantic-surface))] p-3 sm:p-4"
                aria-labelledby="fc-distractor-heading"
              >
                <h3
                  className="mb-2 flex items-center gap-2 text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-[var(--semantic-text-muted)]"
                  id="fc-distractor-heading"
                >
                  <X className="h-4 w-4 shrink-0 text-[var(--semantic-danger)]" aria-hidden />
                  {labels.whyIncorrectHeading}
                </h3>
                <ul className="space-y-2.5">
                  {exam.rationaleIncorrect.map((row) => (
                    <li key={row.letter} className="flex gap-2 text-sm leading-relaxed text-[var(--semantic-text-primary)]">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--semantic-danger)_16%,var(--semantic-surface))] text-[11px] font-bold text-[var(--semantic-danger)]">
                        {row.letter}
                      </span>
                      <span className="min-w-0 flex-1">{firstTeachingLine(row.rationale)}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {showTakeaway ? (
              <section
                className="mt-3 rounded-xl border border-[color-mix(in_srgb,var(--semantic-chart-3)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-warm)_40%,var(--semantic-surface))] p-3 sm:p-4"
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
        ) : (
          <div className="rounded-2xl border border-dashed border-[color-mix(in_srgb,var(--semantic-border-soft)_95%,var(--semantic-text-primary))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_18%,var(--semantic-surface))] p-5 text-center text-sm text-[var(--semantic-text-muted)]">
            {labels.revealHint}
          </div>
        )}
      </aside>
    ) : null;

  if (examBoard) {
    return (
      <div className="nn-flashcard-exam-board grid w-full min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(280px,380px)] xl:gap-6">
        <div className="min-w-0">{questionCard}</div>
        {rationaleColumn}
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 max-w-2xl space-y-3">
      {questionCard}

      {revealed ? (
        <div className="space-y-3">
          <section
            className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-success)_32%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_9%,var(--semantic-surface))] p-3 sm:p-4"
            aria-labelledby="fc-answer-heading-legacy"
          >
            <div className="mb-1.5 flex items-center gap-2" id="fc-answer-heading-legacy">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden />
              <h3 className="text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-[var(--semantic-text-muted)]">
                {labels.answerHeading}
              </h3>
            </div>
            <FlashcardRichContent text={answer} className="!text-[var(--semantic-text-primary)]" />
          </section>

          {exp ? (
            <section className="nn-rationale-key-point" aria-labelledby="fc-rationale-heading-legacy">
              <p className="nn-rationale-key-point__label" id="fc-rationale-heading-legacy">
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
              className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-chart-3)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-warm)_40%,var(--semantic-surface))] p-3 sm:p-4"
              aria-labelledby="fc-pearl-heading-legacy"
            >
              <div className="mb-1.5 flex items-center gap-2" id="fc-pearl-heading-legacy">
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
