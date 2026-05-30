"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { BookOpen, Bookmark, CheckCircle2, ChevronDown, ChevronRight, ChevronUp, Gem, GraduationCap, Lightbulb, XCircle, X } from "lucide-react";
import { FlashcardRichContent } from "@/components/flashcards/flashcard-rich-content";
import { FlashcardExamMcqAnswerList } from "@/components/flashcards/flashcard-exam-mcq-answer-list";
import { FlashcardSataAnswerList } from "@/components/flashcards/flashcard-sata-answer-list";
import { FlashcardStudyRevealPanels } from "@/components/flashcards/flashcard-study-reveal-panels";
import { AdaptiveCaseSimulationPanel } from "@/components/questions/adaptive-case-simulation-panel";
import {
  buildSimpleCorrectRationale,
  buildSimpleDistractorRationale,
  isGenericRationaleText,
} from "@/lib/questions/rationale-quality";
import {
  buildFlashcardClinicalPearl,
  buildFlashcardHint,
  buildFlashcardMemoryHook,
  buildFlashcardNclexTakeaway,
} from "@/lib/flashcards/flashcard-support-block-quality";
import type { ExamMicroQuestionPayload, SataQuestionPayload } from "@/lib/flashcards/flashcard-exam-style";
import { isSataPayload } from "@/lib/flashcards/flashcard-exam-style";
import type { AdaptiveCaseSimulation } from "@/lib/questions/adaptive-case-simulation";

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

function correctAnswerSummary(exam: ExamMicroQuestionPayload): string {
  const correctText = exam.answerOptions.find((option) => option.letter === exam.correctLetter)?.text.trim() ?? "";
  return correctText ? `${exam.correctLetter}. ${correctText}` : exam.correctLetter;
}

function isWeakRationaleText(text: string | null | undefined): boolean {
  const clean = String(text ?? "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return !clean || clean.length < 80 || isGenericRationaleText(clean);
}

function answerOptionText(exam: ExamMicroQuestionPayload, letter: string | null | undefined): string {
  if (!letter) return "";
  return exam.answerOptions.find((option) => option.letter === letter)?.text.trim() ?? "";
}

function resolveCorrectRationale(exam: ExamMicroQuestionPayload, fallback: string | null | undefined): string {
  const authored = exam.rationaleCorrect?.trim() || String(fallback ?? "").trim();
  if (!isWeakRationaleText(authored)) return authored;
  return buildSimpleCorrectRationale({
    stem: exam.questionStem,
    correctOptionText: answerOptionText(exam, exam.correctLetter),
  });
}

function resolveDistractorRationales(exam: ExamMicroQuestionPayload): Array<{ letter: string; optionText: string; rationale: string }> {
  const correctOptionText = answerOptionText(exam, exam.correctLetter);
  return exam.answerOptions
    .filter((option) => option.letter !== exam.correctLetter)
    .map((option) => {
      const authored = exam.rationaleIncorrect.find((row) => row.letter === option.letter)?.rationale.trim() ?? "";
      return {
        letter: option.letter,
        optionText: option.text,
        rationale: isWeakRationaleText(authored)
          ? buildSimpleDistractorRationale({
              stem: exam.questionStem,
              optionText: option.text,
              correctOptionText,
            })
          : authored,
      };
    });
}

function buildResultFeedback(input: {
  exam: ExamMicroQuestionPayload | null;
  submittedLetter: string | null;
  topicLine?: string | null;
  correctRationale: string;
}): string {
  const { exam, submittedLetter, topicLine, correctRationale } = input;
  if (!exam) return "Review the rationale, then choose how this card should return.";
  const correctText = answerOptionText(exam, exam.correctLetter);
  const topic = topicLine?.split("·")[0]?.trim();
  const teachingLine = firstTeachingLine(correctRationale);
  const isCorrect = submittedLetter === exam.correctLetter;
  if (isCorrect) {
    if (correctText) return `You identified ${correctText}.`;
    if (topic) return `You recognized the ${topic.toLowerCase()} concept.`;
    return teachingLine || "You selected the supported clinical action.";
  }
  if (correctText) return `Review why ${correctText} is supported before rating this card.`;
  if (topic) return `Revisit the ${topic.toLowerCase()} cue and compare it with the correct rationale.`;
  return teachingLine || "Compare the stem cue with the correct answer before moving on.";
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
  topicLine,
  examMicroQuestion = null,
  itemKindCaption = null,
  clinicalImageUrl = null,
  adaptiveCaseSimulation = null,
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
  onBeforeAnswerReveal,
  onSataReveal,
  onBeforeSataReveal,
  onRationaleOpened,
  questionLabel,
  marked = false,
  onToggleMark,
  onAdvance,
  examPathwayLabel = "NCLEX",
}: {
  sessionModeLabel?: string;
  topicLine?: string | null;
  examMicroQuestion?: ExamMicroQuestionPayload | SataQuestionPayload | null;
  itemKindCaption?: string | null;
  clinicalImageUrl?: string | null;
  adaptiveCaseSimulation?: AdaptiveCaseSimulation | null;
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
  revealLinksSection?: ReactNode;
  onAnswerSubmitted?: (selectedLetter: string, isCorrect: boolean) => void;
  onBeforeAnswerReveal?: (selectedLetter: string) => boolean | Promise<boolean>;
  onSataReveal?: (selectedLetters: string[], correctLetters: string[]) => void;
  onBeforeSataReveal?: (selectedLetters: string[]) => boolean | Promise<boolean>;
  onRationaleOpened?: () => void;
  questionLabel?: string;
  marked?: boolean;
  onToggleMark?: () => void;
  onAdvance?: () => void;
  /** "NCLEX" | "REx-PN" | "CNPLE" — drives Exam Tip badge. */
  examPathwayLabel?: string;
}) {
  const isSata = isSataPayload(examMicroQuestion);
  const exam = isSata ? null : (examMicroQuestion as ExamMicroQuestionPayload | null);
  const sata = isSata ? (examMicroQuestion as SataQuestionPayload) : null;
  const tutorMcq = Boolean(exam && (mcqInteractionMode ?? "tutor_select") === "tutor_select");

  const [pickedLetter, setPickedLetter] = useState<string | null>(null);
  const [rationaleOpen, setRationaleOpen] = useState(true);
  const [submittedLetter, setSubmittedLetter] = useState<string | null>(null);
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  // Study Pulse rail: hidden by default at tablet (< lg) so it doesn't crowd the card
  const [tabletRailOpen, setTabletRailOpen] = useState(false);
  // Tracks current SATA selections so the reveal button can report them before reveal fires.
  const sataSelectionsRef = useRef<string[]>([]);
  const openedRationaleKeyRef = useRef<string | null>(null);

  useEffect(() => {
    setPickedLetter(null);
    setSubmittedLetter(null);
    setSubmittingAnswer(false);
    setRationaleOpen(true);
    sataSelectionsRef.current = [];
    openedRationaleKeyRef.current = null;
  }, [exam?.questionStem, sata?.questionStem, prompt]);

  useEffect(() => {
    if (revealed) setRationaleOpen(true);
  }, [revealed]);

  useEffect(() => {
    if (!revealed || !exam) return;
    const key = exam.questionStem;
    if (openedRationaleKeyRef.current === key) return;
    openedRationaleKeyRef.current = key;
    onRationaleOpened?.();
  }, [exam, onRationaleOpened, revealed]);

  function commitPick(letter: string) {
    if (revealed || !exam || !tutorMcq) return;
    setPickedLetter(letter);
  }

  async function submitMcqAnswer() {
    if (!pickedLetter || revealed || !exam || !tutorMcq || submittingAnswer) return;
    setSubmittingAnswer(true);
    try {
      const canReveal = await onBeforeAnswerReveal?.(pickedLetter);
      if (canReveal === false) return;
      setSubmittedLetter(pickedLetter);
      onAnswerSubmitted?.(pickedLetter, pickedLetter === exam.correctLetter);
      onReveal?.();
    } finally {
      setSubmittingAnswer(false);
    }
  }

  const promptSplit = splitPromptLeadingImage(prompt);
  const promptBody = promptSplit.remainingPrompt || String(prompt ?? "");
  const resolvedCorrectRationale = exam ? resolveCorrectRationale(exam, explanation || answer) : "";
  const resolvedDistractorRationales = exam ? resolveDistractorRationales(exam) : [];
  const correctOptionText = exam ? answerOptionText(exam, exam.correctLetter) : "";
  const supportBlockContext = exam
    ? {
        stem: exam.questionStem,
        topic: topicLine,
        answerText: correctOptionText,
        correctLetter: exam.correctLetter,
        rationale: resolvedCorrectRationale,
        pathwayLabel: examPathwayLabel,
      }
    : {
        stem: promptBody,
        topic: topicLine,
        answerText: answer,
        rationale: explanation,
        pathwayLabel: examPathwayLabel,
      };

  const showUnsupportedCardAlert = !exam && !sata;
  return (
    <div className="nn-premium-flashcard-stack-outer nn-flashcard-study-stack-premium mx-auto flex w-full max-w-6xl flex-col gap-4">
      <div
        className="nn-flashcard-session-layout nn-premium-flashcard-stack mx-auto w-full"
        data-nn-revealed={revealed ? "1" : "0"}
        data-nn-premium-flashcard-study
      >
        <div className="nn-flashcard-session-main min-w-0">
          <div className="nn-flashcard-study-heading">
            <p className="nn-flashcard-study-heading__eyebrow">Study</p>
            <h1>Flashcards</h1>
            {topicLine ? (
              <p>{topicLine.split("·")[0]?.trim() ?? topicLine}</p>
            ) : null}
          </div>
          <div className="nn-flashcard-learning-grid min-w-0 min-h-0">
            <article
              className="nn-flashcard-hero-surface nn-premium-flashcard-prompt-panel relative z-[1] min-w-0 p-6 sm:p-8 lg:p-8"
              data-nn-flashcard-branding-revamp=""
              data-nn-flashcard-question-workspace=""
              data-nn-educational-content-container=""
            >
              <div className="nn-flashcard-card-action-row relative z-[1] flex items-start justify-between gap-2">
                {itemKindCaption ? (
                  <span className="nn-flashcard-chip nn-flashcard-chip--kind">{itemKindCaption}</span>
                ) : (
                  <span aria-hidden />
                )}
                {onToggleMark ? (
                  <button
                    type="button"
                    className="nn-flashcard-mark-button shrink-0"
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

              {adaptiveCaseSimulation ? (
                <AdaptiveCaseSimulationPanel simulation={adaptiveCaseSimulation} />
              ) : null}

              {exam ? (
                <div className="relative z-[1] mt-6">
                  <FlashcardExamMcqAnswerList
                    exam={exam}
                    revealed={revealed}
                    pickedLetter={pickedLetter}
                    tutorMcq={tutorMcq}
                    answerChoicesHeading={labels?.answerChoicesHeading ?? "Answer choices"}
                    revealHint={null}
                    onPickLetter={commitPick}
                    onSubmitAnswer={() => void submitMcqAnswer()}
                    submitting={submittingAnswer}
                  />
                </div>
              ) : null}

              {sata ? (
                <div className="relative z-[1] mt-6" {...(revealed ? { "data-nn-premium-flashcard-reveal": "" } : {})}>
                  <FlashcardSataAnswerList
                    options={sata.answerOptions}
                    correctLetters={sata.correctLetters}
                    rationaleByLetter={revealed ? sata.rationaleByLetter : []}
                    revealed={revealed}
                    answerChoicesHeading={labels?.answerChoicesHeading ?? "Select all that apply"}
                    revealHint={labels?.revealHint ?? buildFlashcardHint({
                      stem: sata.questionStem,
                      topic: topicLine,
                      answerText: "",
                      rationale: sata.rationaleCorrect,
                      pathwayLabel: examPathwayLabel,
                    })}
                    onSelectionsChange={(letters) => { sataSelectionsRef.current = letters; }}
                  />
                  {!revealed && typeof onReveal === "function" ? (
                    <div className="mt-4 flex justify-center">
                      <button
                        type="button"
                        onClick={async () => {
                          if (submittingAnswer) return;
                          setSubmittingAnswer(true);
                          try {
                            const selectedLetters = sataSelectionsRef.current;
                            const canReveal = await onBeforeSataReveal?.(selectedLetters);
                            if (canReveal === false) return;
                            onSataReveal?.(selectedLetters, sata.correctLetters);
                            onReveal();
                          } finally {
                            setSubmittingAnswer(false);
                          }
                        }}
                        disabled={submittingAnswer}
                        data-testid="sata-reveal-btn"
                        className="nn-flashcard-reveal-cta nn-flashcard-reveal-cta--premium inline-flex min-h-12 min-w-[min(100%,280px)] items-center justify-center rounded-2xl px-8 text-sm font-semibold nn-text-on-solid-fill transition hover:opacity-[0.96] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color-mix(in_srgb,var(--semantic-brand)_50%,transparent)]"
                      >
                        {submittingAnswer ? "Checking..." : "Submit Answer"}
                      </button>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {showUnsupportedCardAlert ? (
                <div className="relative z-[1] mt-6 rounded-2xl border border-[color-mix(in_srgb,var(--semantic-danger)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-danger)_7%,var(--semantic-surface))] p-4 text-sm leading-relaxed text-[var(--semantic-text-secondary)]" role="alert">
                  This study item is missing the NCLEX multiple-choice payload. Return to the hub and start a bank-backed set.
                </div>
              ) : null}

              {revealed && (exam || sata) ? (
                <div className="nn-flashcard-answer-status">
                  <div className="min-w-0">
                    <div className={`inline-flex items-center gap-2 font-semibold ${
                      exam && submittedLetter && submittedLetter !== exam.correctLetter
                        ? "text-[var(--semantic-danger)]"
                        : "text-[var(--semantic-success)]"
                    }`}>
                      {exam && submittedLetter && submittedLetter !== exam.correctLetter ? (
                        <XCircle className="h-5 w-5" aria-hidden />
                      ) : (
                        <CheckCircle2 className="h-5 w-5" aria-hidden />
                      )}
                      <span>
                        {exam && submittedLetter
                          ? submittedLetter === exam.correctLetter
                            ? "Correct"
                            : "Incorrect"
                          : "Answer submitted"}
                      </span>
                    </div>
                    <p>
                      {exam
                        ? buildResultFeedback({ exam, submittedLetter, topicLine, correctRationale: resolvedCorrectRationale })
                        : "Review the rationale, then choose how this card should return."}
                    </p>
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

            {exam ? (
              <aside
                className={`nn-flashcard-rationale-panel nn-flashcard-rationale-panel--mcq min-w-0 min-h-0${revealed ? "" : " nn-flashcard-rationale-panel--reserved"}`}
                data-nn-flashcard-branding-revamp=""
                data-nn-flashcard-rationale-workspace=""
                data-nn-rationale-state={revealed ? "revealed" : "locked"}
                aria-label={labels?.answerHeading ?? "Answer and rationale"}
                {...(revealed ? { "data-nn-premium-flashcard-reveal": "" } : {})}
              >
                <div className="nn-flashcard-rationale-panel__header">
                  <div>
                    <Lightbulb className="h-4 w-4" aria-hidden />
                    <span>Rationale</span>
                  </div>
                </div>
                {revealed ? (
                  <div className="nn-flashcard-rationale-panel__body" data-nn-educational-content-container="">
                    <section className="nn-flashcard-rationale-key-concept" aria-label="Clinical Pearl" data-nn-clinical-pearl="" data-nn-educational-content-container="">
                      <span className="nn-clinical-pearl-label">
                        <Gem className="h-3.5 w-3.5" aria-hidden />
                        Clinical Pearl
                      </span>
                      <p>{buildFlashcardClinicalPearl(supportBlockContext, pearl)}</p>
                    </section>
                    <section className="nn-flashcard-rationale-section" data-nn-educational-content-container="">
                      <h3>Correct Answer</h3>
                      <div className="nn-flashcard-inline-rationale__answer">
                        {correctAnswerSummary(exam)}
                      </div>
                    </section>
                    <section className="nn-flashcard-rationale-section" data-nn-educational-content-container="">
                      <h3>Why This Is Correct</h3>
                      <div className="nn-flashcard-inline-rationale__body">
                        <FlashcardRichContent text={resolvedCorrectRationale} />
                      </div>
                    </section>
                    {resolvedDistractorRationales.length > 0 ? (
                      <section className="nn-flashcard-rationale-panel__incorrect" data-nn-educational-content-container="">
                        <h3>Why Other Options Are Incorrect</h3>
                        <ul className="nn-flashcard-distractor-list">
                          {resolvedDistractorRationales.map((row) => (
                            <li key={row.letter} className="nn-flashcard-distractor-item" data-nn-submitted={row.letter === submittedLetter ? "wrong" : undefined}>
                              <span className="nn-flashcard-distractor-letter">{row.letter}.</span>
                              <div className="nn-flashcard-distractor-body">
                                {row.optionText ? <strong>{row.optionText}</strong> : null}
                                {row.optionText && row.rationale ? <span className="nn-flashcard-distractor-sep"> – </span> : null}
                                <FlashcardRichContent text={row.rationale} className="nn-flashcard-distractor-rationale [&_p]:mb-0 [&_p]:inline" />
                              </div>
                            </li>
                          ))}
                        </ul>
                      </section>
                    ) : null}
                    {(() => {
                      const tip = buildFlashcardNclexTakeaway(supportBlockContext);
                      return tip ? (
                        <section className="nn-flashcard-rationale-section nn-flashcard-rationale-section--exam-tip" data-nn-educational-content-container="">
                          <h3 className="nn-flashcard-takeaway-heading">
                            <GraduationCap className="h-3.5 w-3.5" aria-hidden />
                            {examPathwayLabel} Takeaway
                          </h3>
                          <p className="nn-flashcard-inline-rationale__body text-sm leading-relaxed">{tip}</p>
                        </section>
                      ) : null;
                    })()}
                    {(() => {
                      const hook = buildFlashcardMemoryHook(supportBlockContext);
                      return (
                        <details className="nn-flashcard-rationale-section nn-flashcard-rationale-section--memory-hook" data-nn-educational-content-container="">
                          <summary>Memory Hook</summary>
                          <p className="nn-flashcard-inline-rationale__body text-sm italic leading-relaxed">
                            &ldquo;{hook}&rdquo;
                          </p>
                        </details>
                      );
                    })()}
                    {revealLinksSection ? (
                      <div className="mt-3" data-testid="flashcard-reveal-links">
                        {revealLinksSection}
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className="nn-flashcard-rationale-panel__body nn-flashcard-rationale-panel__body--reserved" data-nn-educational-content-container="">
                    <div className="nn-flashcard-rationale-locked">
                      <BookOpen className="h-5 w-5" aria-hidden />
                      <p>Choose an answer to unlock clinical teaching, option-level feedback, and exam takeaways.</p>
                    </div>
                  </div>
                )}
              </aside>
            ) : null}

            {revealed && !exam && !sata ? (
              <aside
                className="nn-flashcard-rationale-panel min-w-0 min-h-0"
                data-nn-flashcard-branding-revamp=""
                data-nn-flashcard-rationale-workspace=""
                data-nn-rationale-state="revealed"
                aria-label={labels?.answerHeading ?? "Answer and rationale"}
                data-nn-premium-flashcard-reveal=""
              >
                <div className="nn-flashcard-rationale-panel__header">
                  <div>
                    <Lightbulb className="h-4 w-4" aria-hidden />
                    <span>Rationale</span>
                  </div>
                  <button
                    type="button"
                    className="nn-flashcard-rationale-panel__close"
                    aria-label={rationaleOpen ? "Hide rationale" : "Show rationale"}
                    aria-pressed={!rationaleOpen}
                    onClick={() => setRationaleOpen((open) => !open)}
                  >
                    <X className="h-4 w-4" aria-hidden />
                  </button>
                </div>

                {rationaleOpen ? (
                  <div className="nn-flashcard-rationale-panel__body" data-nn-educational-content-container="">
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
                      examPathwayLabel={examPathwayLabel}
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
                    <p>Rationale hidden. Use the close control again to reopen it.</p>
                  </div>
                )}
              </aside>
            ) : null}
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
              className={`nn-flashcard-session-rail nn-flashcard-rail-utility nn-flashcard-rail-surface relative min-w-0 min-h-0 shrink-0 ${!tabletRailOpen ? "max-lg:hidden" : ""}`}
              data-nn-flashcard-branding-revamp=""
            >
              {rail}
            </aside>
          </>
        ) : null}
      </div>
    </div>
  );
}
