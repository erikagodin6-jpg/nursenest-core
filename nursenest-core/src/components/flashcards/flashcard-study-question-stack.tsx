"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { BookOpen, Bookmark, CheckCircle2, ChevronDown, ChevronRight, ChevronUp, Lightbulb, X } from "lucide-react";
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
  onAnswerSubmitted,
  onSataReveal,
  onRationaleOpened,
  questionLabel,
  marked = false,
  onToggleMark,
  onAdvance,
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
  /** Fired when the learner commits an MCQ answer (before reveal). */
  onAnswerSubmitted?: (selectedLetter: string, isCorrect: boolean) => void;
  /** Fired when the learner commits a SATA answer by pressing Reveal. */
  onSataReveal?: (selectedLetters: string[], correctLetters: string[]) => void;
  /** Fired once when the rationale panel first mounts for this card. */
  onRationaleOpened?: () => void;
  questionLabel?: string;
  marked?: boolean;
  onToggleMark?: () => void;
  onAdvance?: () => void;
}) {
  const isSata = isSataPayload(examMicroQuestion);
  const exam = isSata ? null : (examMicroQuestion as ExamMicroQuestionPayload | null);
  const sata = isSata ? (examMicroQuestion as SataQuestionPayload) : null;
  const tutorMcq = Boolean(exam && (mcqInteractionMode ?? "tutor_select") === "tutor_select");

  const [pickedLetter, setPickedLetter] = useState<string | null>(null);
  const [rationaleOpen, setRationaleOpen] = useState(true);
  const [submittedLetter, setSubmittedLetter] = useState<string | null>(null);
  // Study Pulse rail: hidden by default at tablet (< lg) so it doesn't crowd the card
  const [tabletRailOpen, setTabletRailOpen] = useState(false);
  // Tracks current SATA selections so the reveal button can report them before reveal fires.
  const sataSelectionsRef = useRef<string[]>([]);

  useEffect(() => {
    setPickedLetter(null);
    setSubmittedLetter(null);
    setRationaleOpen(true);
    sataSelectionsRef.current = [];
  }, [exam?.questionStem, sata?.questionStem, prompt]);

  useEffect(() => {
    if (revealed) setRationaleOpen(true);
  }, [revealed]);

  function commitPick(letter: string) {
    if (revealed || !exam || !tutorMcq) return;
    setPickedLetter(letter);
  }

  function submitMcqAnswer() {
    if (!pickedLetter || revealed || !exam || !tutorMcq) return;
    setSubmittedLetter(pickedLetter);
    onAnswerSubmitted?.(pickedLetter, pickedLetter === exam.correctLetter);
    onReveal?.();
  }

  const promptSplit = splitPromptLeadingImage(prompt);
  const promptBody = promptSplit.remainingPrompt || String(prompt ?? "");

  const showPlainRevealCta = !exam && !sata && !revealed && typeof onReveal === "function";
  return (
    <div className="nn-premium-flashcard-stack-outer nn-flashcard-study-stack-premium mx-auto flex w-full max-w-6xl flex-col gap-4">
      <div
        className="nn-flashcard-session-layout nn-premium-flashcard-stack mx-auto w-full"
        data-nn-revealed={revealed ? "1" : "0"}
        data-nn-premium-flashcard-study
      >
        <div className="nn-flashcard-session-main min-w-0">
          <div className="nn-flashcard-learning-grid">
            <article className="nn-flashcard-hero-surface nn-premium-flashcard-prompt-panel relative z-[1] overflow-hidden p-5 sm:p-7 lg:p-8">
              <div className="relative z-[1] flex flex-wrap items-center justify-between gap-2 border-b border-[var(--semantic-border-soft)] pb-4">
                <div className="flex flex-wrap items-center gap-2">
                  {questionLabel ? (
                    <span className="nn-flashcard-question-label">{questionLabel}</span>
                  ) : null}
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
                {onToggleMark ? (
                  <button
                    type="button"
                    className="nn-flashcard-mark-button"
                    aria-pressed={marked}
                    onClick={onToggleMark}
                  >
                    <Bookmark className="h-4 w-4" aria-hidden />
                    {marked ? "Marked" : "Mark"}
                  </button>
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

              <div className="relative z-[1] nn-flashcard-hero-stem mt-6 text-pretty text-lg font-semibold leading-snug tracking-tight text-[var(--semantic-text-primary)] sm:text-xl">
                <FlashcardRichContent text={promptBody} />
              </div>

              {exam ? (
                <div className="relative z-[1] mt-6">
                  <FlashcardExamMcqAnswerList
                    exam={exam}
                    revealed={revealed}
                    pickedLetter={pickedLetter}
                    tutorMcq={tutorMcq}
                    answerChoicesHeading={labels?.answerChoicesHeading ?? "Answer choices"}
                    revealHint={labels?.revealHint ?? "Select an answer, then submit to see the rationale."}
                    onPickLetter={commitPick}
                    onSubmitAnswer={submitMcqAnswer}
                  />
                </div>
              ) : null}

              {sata ? (
                <div className="relative z-[1] mt-6">
                  <FlashcardSataAnswerList
                    options={sata.answerOptions}
                    correctLetters={sata.correctLetters}
                    rationaleByLetter={revealed ? sata.rationaleByLetter : []}
                    revealed={revealed}
                    answerChoicesHeading={labels?.answerChoicesHeading ?? "Select all that apply"}
                    revealHint={labels?.revealHint ?? "Choose all correct options, then reveal."}
                    onSelectionsChange={(letters) => { sataSelectionsRef.current = letters; }}
                  />
                  {!revealed && typeof onReveal === "function" ? (
                    <div className="mt-4 flex justify-center">
                      <button
                        type="button"
                        onClick={() => {
                          onSataReveal?.(sataSelectionsRef.current, sata.correctLetters);
                          onReveal();
                        }}
                        data-testid="sata-reveal-btn"
                        className="nn-flashcard-reveal-cta nn-flashcard-reveal-cta--premium inline-flex min-h-12 min-w-[min(100%,280px)] items-center justify-center rounded-2xl px-8 text-sm font-semibold nn-text-on-solid-fill transition hover:opacity-[0.96] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color-mix(in_srgb,var(--semantic-brand)_50%,transparent)]"
                      >
                        Submit Answer
                      </button>
                    </div>
                  ) : null}
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

              {revealed ? (
                <div className="nn-flashcard-answer-status">
                  <div className="min-w-0">
                    <div className={`inline-flex items-center gap-2 font-semibold ${
                      exam && submittedLetter && submittedLetter !== exam.correctLetter
                        ? "text-[var(--semantic-danger)]"
                        : "text-[var(--semantic-success)]"
                    }`}>
                      <CheckCircle2 className="h-5 w-5" aria-hidden />
                      <span>
                        {exam && submittedLetter
                          ? submittedLetter === exam.correctLetter
                            ? "Correct"
                            : "Incorrect"
                          : "Answer shown"}
                      </span>
                    </div>
                    <p>Use the rationale panel to review the clinical reasoning.</p>
                  </div>
                  {onAdvance ? (
                    <button type="button" className="nn-flashcard-next-inline" onClick={onAdvance}>
                      Next
                      <ChevronRight className="h-4 w-4" aria-hidden />
                    </button>
                  ) : null}
                </div>
              ) : null}
            </article>

            <aside
              className="nn-flashcard-rationale-panel"
              aria-label={labels?.answerHeading ?? "Answer and rationale"}
              data-nn-premium-flashcard-reveal={revealed ? "" : undefined}
            >
              <div className="nn-flashcard-rationale-panel__header">
                <div>
                  <Lightbulb className="h-4 w-4" aria-hidden />
                  <span>Rationale</span>
                </div>
                {revealed ? (
                  <button
                    type="button"
                    className="nn-flashcard-rationale-panel__close"
                    aria-label={rationaleOpen ? "Hide rationale" : "Show rationale"}
                    aria-pressed={!rationaleOpen}
                    onClick={() => setRationaleOpen((open) => !open)}
                  >
                    <X className="h-4 w-4" aria-hidden />
                  </button>
                ) : null}
              </div>

              {revealed && rationaleOpen ? (
                <div className="nn-flashcard-rationale-panel__body">
                  {typeof clinicalImageUrl === "string" && clinicalImageUrl.startsWith("https://") ? (
                    <div className="nn-flashcard-rationale-image" data-nn-flashcard-media="image">
                      <div>Clinical figure</div>
                      <img src={clinicalImageUrl} alt="" loading="lazy" />
                    </div>
                  ) : null}
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
                    onRationaleOpened={onRationaleOpened}
                  />
                  {revealLinksSection ? (
                    <div className="mt-3" data-testid="flashcard-reveal-links">
                      {revealLinksSection}
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="nn-flashcard-rationale-panel__empty">
                  <BookOpen className="h-5 w-5" aria-hidden />
                  <p>{revealed ? "Rationale hidden. Use the close control again to reopen it." : "Answer first, then the explanation and key takeaways appear here."}</p>
                </div>
              )}
            </aside>
          </div>

          {mainFooter ? <div className="nn-flashcard-session-main-footer space-y-4">{mainFooter}</div> : null}
        </div>

        {rail ? (
          <>
            {/* Tablet toggle — only visible below lg breakpoint */}
            <button
              type="button"
              onClick={() => setTabletRailOpen((o) => !o)}
              aria-expanded={tabletRailOpen}
              aria-controls="nn-study-pulse-rail"
              className="lg:hidden flex w-full items-center justify-between rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 py-2.5 text-sm font-semibold text-[var(--semantic-text-primary)] shadow-[var(--semantic-shadow-soft)] transition hover:bg-[color-mix(in_srgb,var(--semantic-panel-muted)_60%,var(--semantic-surface))]"
              data-testid="study-pulse-toggle"
            >
              <span>Study Pulse</span>
              {tabletRailOpen ? (
                <ChevronUp className="h-4 w-4 text-[var(--semantic-text-muted)]" aria-hidden />
              ) : (
                <ChevronDown className="h-4 w-4 text-[var(--semantic-text-muted)]" aria-hidden />
              )}
            </button>
            <aside
              id="nn-study-pulse-rail"
              className={`nn-flashcard-session-rail nn-flashcard-rail-utility nn-flashcard-rail-surface relative shrink-0 ${!tabletRailOpen ? "max-lg:hidden" : ""}`}
            >
              {rail}
            </aside>
          </>
        ) : null}
      </div>
    </div>
  );
}
