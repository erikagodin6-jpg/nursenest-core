"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { FlashcardRichContent } from "@/components/flashcards/flashcard-rich-content";
import { FlashcardExamMcqAnswerList } from "@/components/flashcards/flashcard-exam-mcq-answer-list";
import { FlashcardSataAnswerList } from "@/components/flashcards/flashcard-sata-answer-list";
import { FlashcardStudyRevealPanels } from "@/components/flashcards/flashcard-study-reveal-panels";
import type { ExamMicroQuestionPayload, SataQuestionPayload } from "@/lib/flashcards/flashcard-exam-style";
import { isSataPayload } from "@/lib/flashcards/flashcard-exam-style";

type PromptImageSplit = {
  imageHtml: string | null;
  remainingPrompt: string;
};

export function splitPromptLeadingImage(prompt: string | null | undefined): PromptImageSplit {
  const raw = String(prompt ?? "").trim();

  if (!raw) {
    return { imageHtml: null, remainingPrompt: "" };
  }

  const leadingImageMatch = raw.match(/^<img\b[^>]*>\s*/i);

  if (!leadingImageMatch) {
    return { imageHtml: null, remainingPrompt: raw };
  }

  const tag = leadingImageMatch[0].trim();
  const srcEmpty =
    /\ssrc\s*=\s*["']\s*["']/i.test(tag) ||
    /\ssrc\s*=\s*["']?\s*["']?\s*$/i.test(tag) ||
    !/\ssrc\s*=/i.test(tag);
  if (srcEmpty) {
    return { imageHtml: null, remainingPrompt: raw };
  }

  return {
    imageHtml: tag,
    remainingPrompt: raw.slice(leadingImageMatch[0].length).trim(),
  };
}

export function firstTeachingLine(text: string | null | undefined): string {
  const raw = String(text ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!raw) return "";

  const sentenceMatch = raw.match(/^(.+?[.!?])(\s|$)/);
  return sentenceMatch?.[1]?.trim() ?? raw;
}

type StackLabels = {
  revealHint?: string;
  answerHeading?: string;
  whyCorrectHeading?: string;
  whyIncorrectHeading?: string;
  takeawayHeading?: string;
  answerChoicesHeading?: string;
};

export function FlashcardStudyQuestionStack({
  sessionModeLabel,
  topicLine,
  examMicroQuestion = null,
  itemKindCaption = null,
  clinicalImageUrl = null,
  prompt,
  answer,
  explanation,
  pearl,
  revealed,
  onReveal,
  mcqInteractionMode,
  labels,
  rail,
  mainFooter,
  revealLinksSection,
}: {
  sessionModeLabel: string;
  topicLine?: string | null;
  examMicroQuestion?: ExamMicroQuestionPayload | SataQuestionPayload | null;
  itemKindCaption?: string | null;
  clinicalImageUrl?: string | null;
  prompt: string;
  answer: string;
  explanation?: string;
  pearl?: string | null;
  revealed: boolean;
  onReveal?: () => void;
  mcqInteractionMode?: string;
  labels?: StackLabels;
  rail?: ReactNode;
  mainFooter?: ReactNode;
  /** Links shown inline in the reveal zone (lesson, practice questions). Use lg:hidden when mirroring to rail on desktop. */
  revealLinksSection?: ReactNode;
  /** Fired when the learner commits an MCQ or SATA answer (before or simultaneously with reveal). */
  onAnswerSubmitted?: (selectedLetter: string, isCorrect: boolean) => void;
}) {
  const isSata = isSataPayload(examMicroQuestion);
  const exam = isSata ? null : (examMicroQuestion as ExamMicroQuestionPayload | null);
  const sata = isSata ? (examMicroQuestion as SataQuestionPayload) : null;
  const tutorMcq = Boolean(exam && (mcqInteractionMode ?? "tutor_select") === "tutor_select");

  const [pickedLetter, setPickedLetter] = useState<string | null>(null);

  useEffect(() => {
    setPickedLetter(null);
  }, [exam?.questionStem, prompt]);

  useEffect(() => {
    if (!pickedLetter || revealed || !tutorMcq || !exam) return;

    const id = requestAnimationFrame(() => onReveal?.());
    return () => cancelAnimationFrame(id);
  }, [pickedLetter, revealed, tutorMcq, exam, onReveal]);

  function commitPick(letter: string) {
    if (revealed || !exam || !tutorMcq) return;
    setPickedLetter(letter);
  }

  const promptSplit = splitPromptLeadingImage(prompt);
  const promptBody = promptSplit.remainingPrompt || String(prompt ?? "");

  const showPlainRevealCta = !exam && !sata && !revealed && typeof onReveal === "function";

  return (
    <div className="nn-premium-flashcard-stack-outer nn-flashcard-study-stack-premium mx-auto flex w-full max-w-6xl flex-col gap-4">
      <div className="nn-flashcard-session-ambient" aria-hidden />
      <div
        className="nn-flashcard-session-layout nn-premium-flashcard-stack mx-auto w-full"
        data-nn-revealed={revealed ? "1" : "0"}
        data-nn-premium-flashcard-study
      >
        <div className="nn-flashcard-session-main min-w-0">
          <div className="nn-flashcard-layered-stack relative w-full">
            <div className="nn-flashcard-layered-stack__underlay" aria-hidden />
            <article className="nn-flashcard-hero-surface nn-premium-flashcard-prompt-panel relative z-[1] overflow-hidden p-5 sm:p-7 lg:p-8">
          <div className="pointer-events-none absolute inset-0 opacity-[0.55]" aria-hidden>
            <div className="nn-flashcard-hero-surface__glow absolute -left-16 top-0 h-56 w-56 rounded-full bg-[color-mix(in_srgb,var(--semantic-chart-3)_22%,transparent)] blur-3xl" />
            <div className="nn-flashcard-hero-surface__glow absolute -right-12 bottom-0 h-48 w-48 rounded-full bg-[color-mix(in_srgb,var(--semantic-chart-5)_18%,transparent)] blur-3xl" />
          </div>

          <div className="relative z-[1] flex flex-wrap items-center gap-2">
            <span className="nn-flashcard-chip nn-flashcard-chip--mode">{sessionModeLabel}</span>
            {topicLine ? (
              <span className="nn-flashcard-chip nn-flashcard-chip--topic max-w-[min(100%,420px)] truncate">
                {topicLine}
              </span>
            ) : null}
            {itemKindCaption ? (
              <span className="nn-flashcard-chip nn-flashcard-chip--kind">{itemKindCaption}</span>
            ) : null}
          </div>

          {promptSplit.imageHtml ? (
            <div
              className="nn-flashcard-image-card relative z-[1] mb-5 mt-5 overflow-hidden rounded-xl border border-[color-mix(in_srgb,var(--semantic-info)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_35%,var(--semantic-surface))] p-3 shadow-inner [&_img]:max-h-72 [&_img]:w-auto [&_img]:max-w-full [&_img]:rounded-lg [&_img]:object-contain"
              data-nn-flashcard-media="image"
            >
              <FlashcardRichContent text={promptSplit.imageHtml} />
            </div>
          ) : null}

          {typeof clinicalImageUrl === "string" && clinicalImageUrl.startsWith("https://") ? (
            <div className="nn-flashcard-image-card relative z-[1] mb-5 mt-4" data-nn-flashcard-media="image">
              <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
                Clinical figure
              </div>
              <img
                src={clinicalImageUrl}
                alt=""
                className="max-h-72 w-auto max-w-full rounded-xl border border-[var(--semantic-border-soft)] object-contain shadow-[var(--semantic-shadow-soft)]"
                loading="lazy"
              />
            </div>
          ) : null}

          <div className="relative z-[1] nn-flashcard-hero-stem text-pretty text-lg font-semibold leading-snug tracking-tight text-[var(--semantic-text-primary)] sm:text-xl">
            <FlashcardRichContent text={promptBody} />
          </div>

          {exam ? (
            <div className="relative z-[1] mt-6">
              {!revealed ? (
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
                  Think before selecting →
                </p>
              ) : null}
              <FlashcardExamMcqAnswerList
                exam={exam}
                revealed={revealed}
                pickedLetter={pickedLetter}
                tutorMcq={tutorMcq}
                answerChoicesHeading={labels?.answerChoicesHeading ?? "Answer choices"}
                revealHint={labels?.revealHint ?? "Choose an answer to reveal the rationale."}
                onPickLetter={commitPick}
              />
            </div>
          ) : null}

          {sata ? (
            <div className="relative z-[1] mt-6">
              {!revealed ? (
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
                  Select all that apply →
                </p>
              ) : null}
              <FlashcardSataAnswerList
                options={sata.answerOptions}
                correctLetters={sata.correctLetters}
                rationaleByLetter={revealed ? sata.rationaleByLetter : []}
                revealed={revealed}
                answerChoicesHeading={labels?.answerChoicesHeading ?? "Select all that apply"}
                revealHint={labels?.revealHint ?? "Choose all correct options, then reveal."}
              />
            </div>
          ) : null}

          {showPlainRevealCta ? (
            <div className="relative z-[1] mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => onReveal?.()}
                className="nn-flashcard-reveal-cta nn-flashcard-reveal-cta--premium inline-flex min-h-12 min-w-[min(100%,280px)] items-center justify-center rounded-2xl px-8 text-sm font-semibold nn-text-on-solid-fill transition hover:opacity-[0.96] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color-mix(in_srgb,var(--semantic-brand)_50%,transparent)]"
              >
                {labels?.revealHint ?? "Tap to reveal"}
              </button>
            </div>
          ) : null}
            </article>
          </div>

          {revealed ? (
            <section
              className="nn-flashcard-reveal-zone nn-premium-flashcard-reveal-panel relative overflow-hidden rounded-2xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-surface)_94%,var(--semantic-panel-muted))] p-5 shadow-[var(--semantic-shadow-soft)] sm:p-6"
              aria-label={labels?.answerHeading ?? "Answer and rationale"}
              data-nn-premium-flashcard-reveal
            >
              <div className="pointer-events-none absolute inset-0 opacity-[0.35]" aria-hidden>
                <div className="absolute -left-10 top-0 h-40 w-40 rounded-full bg-[color-mix(in_srgb,var(--semantic-chart-1)_14%,transparent)] blur-3xl" />
                <div className="absolute bottom-0 right-0 h-36 w-36 rounded-full bg-[color-mix(in_srgb,var(--semantic-chart-5)_12%,transparent)] blur-3xl" />
              </div>
              <div className="relative z-[1] mb-4 flex flex-wrap items-center gap-2 border-b border-[color-mix(in_srgb,var(--semantic-border-soft)_85%,transparent)] pb-3">
                <span className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--semantic-text-muted)]">
                  Answer & rationale
                </span>
              </div>
              <div className="relative z-[1]">
                <FlashcardStudyRevealPanels
                  exam={exam}
                  answer={answer}
                  explanation={explanation}
                  pearl={pearl}
                  labels={{
                    answerHeading: labels?.answerHeading,
                    whyCorrectHeading: labels?.whyCorrectHeading,
                    whyIncorrectHeading: labels?.whyIncorrectHeading,
                    takeawayHeading: labels?.takeawayHeading,
                  }}
                />
              </div>
              {revealLinksSection ? (
                <div className="relative z-[1] mt-3" data-testid="flashcard-reveal-links">
                  {revealLinksSection}
                </div>
              ) : null}
            </section>
          ) : null}

          {mainFooter ? <div className="nn-flashcard-session-main-footer space-y-4">{mainFooter}</div> : null}
        </div>

        {rail ? (
          <aside className="nn-flashcard-session-rail nn-flashcard-rail-utility nn-flashcard-rail-surface relative shrink-0">
            {rail}
          </aside>
        ) : null}
      </div>
    </div>
  );
}
