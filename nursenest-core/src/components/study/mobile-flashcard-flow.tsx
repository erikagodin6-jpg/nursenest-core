"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  BarChart3,
  BookOpen,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  CheckCircle2,
  ChevronsRight,
  Gem,
  Heart,
  Lightbulb,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { FlashcardRichContent } from "@/components/flashcards/flashcard-rich-content";
import { FlashcardExamMcqAnswerList } from "@/components/flashcards/flashcard-exam-mcq-answer-list";
import { FlashcardSataAnswerList } from "@/components/flashcards/flashcard-sata-answer-list";
import { FlashcardStudyRevealPanels } from "@/components/flashcards/flashcard-study-reveal-panels";
import { resolveEcosystemLinks } from "@/lib/flashcards/flashcard-ecosystem-resolver";
import type { ExamMicroQuestionPayload, SataQuestionPayload } from "@/lib/flashcards/flashcard-exam-style";
import { isSataPayload } from "@/lib/flashcards/flashcard-exam-style";
import {
  buildSimpleCorrectRationale,
  buildSimpleDistractorRationale,
  isGenericRationaleText,
} from "@/lib/questions/rationale-quality";
import {
  buildFlashcardClinicalPearl,
  buildFlashcardHint,
  buildFlashcardNclexTakeaway,
  buildFlashcardWhyThisMatters,
} from "@/lib/flashcards/flashcard-support-block-quality";

/** Minimal card shape needed by the mobile flow — matches ActiveStudyCard. */
type MobileCard = {
  id: string;
  prompt: string;
  answer: string;
  explanation?: string;
  examMicroQuestion?: ExamMicroQuestionPayload | null;
  topic?: string | null;
  subtopic?: string | null;
  lessonHref?: string | null;
  lessonTitle?: string | null;
  practiceTopicHref?: string | null;
  practiceTestsTopicHref?: string | null;
};

type RatingKey = "again" | "hard" | "good" | "easy";

const RATING_META: Array<{ key: RatingKey; label: string; icon: React.ReactNode; colorClass: string }> = [
  { key: "again", label: "Again",  icon: <RefreshCw  className="h-5 w-5" aria-hidden />, colorClass: "nn-mobile-rating--again" },
  { key: "hard",  label: "Hard",   icon: <BarChart3   className="h-5 w-5" aria-hidden />, colorClass: "nn-mobile-rating--hard"  },
  { key: "good",  label: "Good",   icon: <CheckCircle2 className="h-5 w-5" aria-hidden />, colorClass: "nn-mobile-rating--good"  },
  { key: "easy",  label: "Easy",   icon: <ChevronsRight className="h-5 w-5" aria-hidden />, colorClass: "nn-mobile-rating--easy"  },
];

/* ── Helpers ───────────────────────────────────────────────────────────────── */

function buildPearl(card: MobileCard): string {
  return buildFlashcardClinicalPearl({
    stem: card.examMicroQuestion?.questionStem ?? card.prompt,
    topic: card.topic,
    subtopic: card.subtopic,
    answerText: card.answer,
    correctLetter: card.examMicroQuestion && !isSataPayload(card.examMicroQuestion)
      ? card.examMicroQuestion.correctLetter
      : null,
    rationale: card.examMicroQuestion?.rationaleCorrect ?? card.explanation,
  });
}

function buildHint(card: MobileCard): string {
  return buildFlashcardHint({
    stem: card.examMicroQuestion?.questionStem ?? card.prompt,
    topic: card.topic,
    subtopic: card.subtopic,
    answerText: card.answer,
    correctLetter: card.examMicroQuestion && !isSataPayload(card.examMicroQuestion)
      ? card.examMicroQuestion.correctLetter
      : null,
    rationale: card.examMicroQuestion?.rationaleCorrect ?? card.explanation,
  });
}

function buildWhyThisMatters(card: MobileCard): string {
  return buildFlashcardWhyThisMatters({
    stem: card.examMicroQuestion?.questionStem ?? card.prompt,
    topic: card.topic,
    subtopic: card.subtopic,
    answerText: card.answer,
    correctLetter: card.examMicroQuestion && !isSataPayload(card.examMicroQuestion)
      ? card.examMicroQuestion.correctLetter
      : null,
    rationale: card.examMicroQuestion?.rationaleCorrect ?? card.explanation,
  });
}

function buildExamTakeaway(card: MobileCard, pathwayLabel: string): string {
  return buildFlashcardNclexTakeaway({
    stem: card.examMicroQuestion?.questionStem ?? card.prompt,
    topic: card.topic,
    subtopic: card.subtopic,
    answerText: card.answer,
    correctLetter: card.examMicroQuestion && !isSataPayload(card.examMicroQuestion)
      ? card.examMicroQuestion.correctLetter
      : null,
    rationale: card.examMicroQuestion?.rationaleCorrect ?? card.explanation,
    pathwayLabel,
  });
}

function correctAnswerSummary(exam: ExamMicroQuestionPayload): string {
  const correct = exam.answerOptions.find((o) => o.letter === exam.correctLetter);
  return correct ? `${exam.correctLetter}. ${correct.text.trim()}` : exam.correctLetter;
}

function resolveCorrectRationale(exam: ExamMicroQuestionPayload, fallback?: string): string {
  const authored = exam.rationaleCorrect?.trim() || (fallback ?? "").trim();
  if (!authored || authored.length < 80 || isGenericRationaleText(authored)) {
    return buildSimpleCorrectRationale({
      stem: exam.questionStem,
      correctOptionText: exam.answerOptions.find((o) => o.letter === exam.correctLetter)?.text,
    });
  }
  return authored;
}

function resolveDistractorRationale(exam: ExamMicroQuestionPayload, letter: string, optionText: string): string {
  const authored = exam.rationaleIncorrect?.find((r) => r.letter === letter)?.rationale?.trim() ?? "";
  if (!authored || authored.length < 60 || isGenericRationaleText(authored)) {
    return buildSimpleDistractorRationale({
      stem: exam.questionStem,
      optionText,
      correctOptionText: exam.answerOptions.find((o) => o.letter === exam.correctLetter)?.text,
    });
  }
  return authored;
}

/* ══════════════════════════════════════════════════════════════════════════════
   MobileFlashcardFlow — rendered only on sm and below.
   Single-scroll design matching the NurseNest mobile mockup.
   ══════════════════════════════════════════════════════════════════════════════ */

export function MobileFlashcardFlow({
  card,
  cardIndex,
  totalCards,
  elapsed,
  saving,
  examPathwayLabel,
  pathwayId,
  onAnswerSubmitted,
  onRevealComplete,
  onRate,
}: {
  card: MobileCard;
  pathwayId?: string | null;
  cardIndex: number;
  totalCards: number;
  elapsed: number;
  saving: boolean;
  examPathwayLabel: string;
  onAnswerSubmitted?: (isCorrect: boolean | null) => void;
  onRevealComplete?: () => void;
  onRate: (rating: RatingKey) => Promise<void>;
}) {
  const [revealed, setRevealed]           = useState(false);
  const [pickedLetter, setPickedLetter]   = useState<string | null>(null);
  const [submittedLetter, setSubmittedLetter] = useState<string | null>(null);
  const [submitting, setSubmitting]       = useState(false);
  const [confidence, setConfidence]       = useState<1 | 2 | 3 | 4 | 5 | null>(null);
  const [isCorrect, setIsCorrect]         = useState<boolean | null>(null);
  const [rationaleOpen, setRationaleOpen] = useState(true);
  const [hintOpen, setHintOpen]           = useState(false);
  const sataSelectionsRef                 = useRef<string[]>([]);

  const isSata = isSataPayload(card.examMicroQuestion);
  const exam   = isSata ? null : (card.examMicroQuestion as ExamMicroQuestionPayload | null);
  const sata   = isSata ? (card.examMicroQuestion as unknown as SataQuestionPayload) : null;
  const isPlain = !exam && !sata;

  /* Reset on card change */
  useEffect(() => {
    setRevealed(false);
    setPickedLetter(null);
    setSubmittedLetter(null);
    setSubmitting(false);
    setConfidence(null);
    setIsCorrect(null);
    setRationaleOpen(true);
    setHintOpen(false);
    sataSelectionsRef.current = [];
  }, [card.id]);

  const handleMcqSubmit = useCallback(async () => {
    if (!pickedLetter || !exam || submitting) return;
    setSubmitting(true);
    try {
      const correct = pickedLetter === exam.correctLetter;
      setSubmittedLetter(pickedLetter);
      setIsCorrect(correct);
      onAnswerSubmitted?.(correct);
      setRevealed(true);
    } finally {
      setSubmitting(false);
    }
  }, [exam, onAnswerSubmitted, pickedLetter, submitting]);

  const handleSataReveal = useCallback(() => {
    if (!sata || submitting) return;
    setSubmitting(true);
    try {
      const selected = sataSelectionsRef.current;
      const allCorrect =
        sata.correctLetters.length > 0 &&
        sata.correctLetters.every((l) => selected.includes(l)) &&
        selected.every((l) => sata.correctLetters.includes(l));
      setIsCorrect(allCorrect);
      onAnswerSubmitted?.(allCorrect);
      setRevealed(true);
    } finally {
      setSubmitting(false);
    }
  }, [onAnswerSubmitted, sata, submitting]);

  const handlePlainReveal = useCallback(() => {
    setIsCorrect(null);
    onAnswerSubmitted?.(null);
    setRevealed(true);
  }, [onAnswerSubmitted]);

  const handleRatingSubmit = useCallback(async (rating: RatingKey) => {
    await onRate(rating);
    onRevealComplete?.();
  }, [onRate, onRevealComplete]);

  const progressPct = Math.round(((cardIndex + 1) / Math.max(1, totalCards)) * 100);
  const formatElapsed = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const ecosystemPlan = resolveEcosystemLinks({
    cardId: card.id,
    topic: card.topic ?? null,
    subtopic: card.subtopic ?? null,
    pathwayId: pathwayId ?? null,
    lessonHref: card.lessonHref,
    lessonTitle: card.lessonTitle,
    practiceTopicHref: card.practiceTopicHref,
    practiceTestsTopicHref: card.practiceTestsTopicHref,
    isIncorrect: isCorrect === false,
  });

  const topicLabel = [card.topic, card.subtopic].filter(Boolean).join(" · ");
  const resolvedCorrectRationale = exam ? resolveCorrectRationale(exam, card.explanation) : "";

  /* ── Compact sticky header ─────────────────────────────────────────────────── */
  const header = (
    <div className="nn-mobile-fc-compact-header">
      <div className="nn-mobile-fc-stat-group">
        <span className="nn-mobile-fc-stat-label">
          <BarChart3 className="h-3 w-3" aria-hidden /> Progress
        </span>
        <strong className="nn-mobile-fc-stat-value" style={{ whiteSpace: "nowrap" }}>
          {cardIndex + 1} <span style={{ opacity: 0.5, fontWeight: 400 }}>of</span> {totalCards}
        </strong>
        <div className="nn-mobile-fc-progress-track" role="progressbar" aria-valuenow={cardIndex + 1} aria-valuemin={1} aria-valuemax={totalCards}>
          <div className="nn-mobile-fc-progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
      </div>
      <div className="nn-mobile-fc-stat-group">
        <span className="nn-mobile-fc-stat-label">Focus</span>
        <strong className="nn-mobile-fc-stat-value">{topicLabel || "All systems"}</strong>
      </div>
      <div className="nn-mobile-fc-stat-group">
        <span className="nn-mobile-fc-stat-label">Elapsed</span>
        <strong className="nn-mobile-fc-stat-value nn-mobile-fc-timer">{formatElapsed(elapsed)}</strong>
      </div>
    </div>
  );

  /* ── Result status bar (shown after answering) ─────────────────────────────── */
  const statusBar = revealed && (
    <div className={`nn-mobile-fc-status-bar ${isCorrect === true ? "nn-mobile-fc-status-bar--correct" : isCorrect === false ? "nn-mobile-fc-status-bar--incorrect" : "nn-mobile-fc-status-bar--neutral"}`}>
      <div className="nn-mobile-fc-status-bar__left">
        {isCorrect === true  && <CheckCircle2 className="h-5 w-5" aria-hidden />}
        {isCorrect === false && <XCircle      className="h-5 w-5" aria-hidden />}
        <span>{isCorrect === true ? "Correct!" : isCorrect === false ? "Incorrect" : "Answer submitted"}</span>
      </div>
      <button type="button" className="nn-mobile-fc-next-btn" onClick={onRevealComplete}>
        Next <ChevronRight className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );

  /* ── Metadata strip ─────────────────────────────────────────────────────────── */
  const metaStrip = (
    <div className="nn-mobile-fc-meta-strip">
      {/* Hint */}
      <div className="nn-mobile-fc-meta-row">
        <div className="nn-mobile-fc-meta-row__label">
          <Lightbulb className="h-4 w-4" aria-hidden />
          <span>Hint</span>
        </div>
        {hintOpen ? (
          <p className="nn-mobile-fc-meta-row__body">
            {buildHint(card)}
          </p>
        ) : (
          <button type="button" className="nn-mobile-hint-pill" onClick={() => setHintOpen(true)}>
            Reveal hint
          </button>
        )}
      </div>

      {/* Why This Matters */}
      <div className="nn-mobile-fc-meta-row nn-mobile-fc-meta-row--link">
        <div className="nn-mobile-fc-meta-row__label">
          <Heart className="h-4 w-4" aria-hidden />
          <span>Why This Matters</span>
        </div>
        <ChevronRight className="nn-mobile-fc-meta-row__chevron h-4 w-4" aria-hidden />
        <p className="nn-mobile-fc-meta-row__body">
          {buildWhyThisMatters(card)}
        </p>
      </div>

      {/* Related Lesson */}
      <div className="nn-mobile-fc-meta-row nn-mobile-fc-meta-row--link">
        <div className="nn-mobile-fc-meta-row__label">
          <BookOpen className="h-4 w-4" aria-hidden />
          <span>Related Lesson</span>
        </div>
        <ChevronRight className="nn-mobile-fc-meta-row__chevron h-4 w-4" aria-hidden />
        {card.lessonHref ? (
          <Link href={card.lessonHref} className="nn-mobile-fc-meta-row__body nn-mobile-fc-lesson-link">
            {card.lessonTitle?.trim() || topicLabel || "View lesson"}
          </Link>
        ) : (
          <p className="nn-mobile-fc-meta-row__body">{topicLabel || "Review linked content from the hub."}</p>
        )}
      </div>
    </div>
  );

  /* ── Confidence + rating (only after revealing) ─────────────────────────────── */
  const confidenceRating = revealed && (
    <>
      {/* Confidence scale */}
      <div className="nn-mobile-fc-confidence-section">
        <span className="nn-mobile-fc-confidence-label">How confident are you?</span>
        <div className="nn-mobile-fc-confidence-row">
          {([1, 2, 3, 4, 5] as const).map((score) => (
            <button
              key={score}
              type="button"
              aria-label={`Confidence ${score}`}
              aria-pressed={confidence === score}
              className={`nn-mobile-fc-confidence-btn ${confidence === score ? "nn-mobile-fc-confidence-btn--active" : ""}`}
              onClick={() => setConfidence(score)}
            >
              {score}
            </button>
          ))}
        </div>
      </div>

      {/* Rating dock */}
      <div className="nn-mobile-fc-rating-dock" aria-label="Grade this card">
        {RATING_META.map(({ key, label, icon, colorClass }) => (
          <button
            key={key}
            type="button"
            disabled={saving}
            className={`nn-mobile-fc-rating-btn ${colorClass}`}
            onClick={() => void handleRatingSubmit(key)}
          >
            {icon}
            <span>{label}</span>
          </button>
        ))}
      </div>
    </>
  );

  /* ── MCQ/SATA revealed rationale ─────────────────────────────────────────────── */
  const mcqRationale = revealed && exam && (
    <div className="nn-mobile-fc-rationale-content">
      {/* Clinical Pearl */}
      <section className="nn-flashcard-rationale-key-concept" aria-label="Clinical Pearl">
        <span className="nn-clinical-pearl-label">
          <Gem className="h-3.5 w-3.5" aria-hidden />
          Clinical Pearl
        </span>
        <p>{buildPearl(card)}</p>
      </section>

      {/* Correct answer */}
      <div className="nn-mobile-rationale-section">
        <span className="nn-mobile-rationale-section__label">Correct Answer</span>
        <span className="nn-mobile-rationale-correct-chip">{correctAnswerSummary(exam)}</span>
      </div>

      {/* Why this is correct */}
      <div className="nn-mobile-rationale-section">
        <span className="nn-mobile-rationale-section__label">Why This Is Correct</span>
        <p className="nn-mobile-rationale-section__body">
          <FlashcardRichContent text={resolvedCorrectRationale} />
        </p>
      </div>

      {/* Why other options */}
      {exam.answerOptions.filter((o) => o.letter !== exam.correctLetter).length > 0 ? (
        <div className="nn-mobile-rationale-section">
          <span className="nn-mobile-rationale-section__label">Why Other Options Are Incorrect</span>
          <div className="nn-mobile-rationale-distractors">
            {exam.answerOptions
              .filter((o) => o.letter !== exam.correctLetter)
              .map((o) => (
                <div key={o.letter} className="nn-mobile-rationale-distractor">
                  <span className="nn-mobile-rationale-distractor__badge">{o.letter}</span>
                  <div className="nn-mobile-rationale-distractor__body">
                    <strong>{o.text}</strong>
                    {" – "}
                    {resolveDistractorRationale(exam, o.letter, o.text)}
                  </div>
                </div>
              ))}
          </div>
        </div>
      ) : null}

      {/* Exam Takeaway */}
      <div className="nn-mobile-rationale-takeaway">
        <div className="nn-mobile-rationale-takeaway__header">
          <Lightbulb className="h-4 w-4" aria-hidden />
          <span>{examPathwayLabel}/REx-PN Takeaway</span>
        </div>
        <p>{buildExamTakeaway(card, examPathwayLabel)}</p>
      </div>
    </div>
  );

  /* ══════════════════════════════════════════════════════════════════════════════
     RENDER — single scrollable view
     ══════════════════════════════════════════════════════════════════════════════ */
  return (
    <div className="nn-mobile-fc-root" data-revealed={revealed ? "1" : "0"}>
      {/* Sticky compact header */}
      {header}

      {/* Scrollable content area */}
      <div className="nn-mobile-fc-scroll">
        {/* Topic label */}
        {topicLabel ? (
          <p className="nn-mobile-fc-topic-label">{topicLabel}</p>
        ) : null}

        {/* Status bar (after answering) */}
        {statusBar}

        {/* Question card */}
        <div className="nn-mobile-fc-question-card">
          <div className="nn-mobile-fc-question-stem">
            <FlashcardRichContent text={
              exam ? String(exam.questionStem ?? card.prompt)
              : sata ? String(sata.questionStem ?? card.prompt)
              : card.prompt
            } />
          </div>

          {exam ? (
            <div className="mt-4">
              <FlashcardExamMcqAnswerList
                exam={exam}
                revealed={revealed}
                pickedLetter={pickedLetter}
                tutorMcq
                answerChoicesHeading="Answer choices"
                revealHint={null}
                onPickLetter={setPickedLetter}
                onSubmitAnswer={() => void handleMcqSubmit()}
                submitting={submitting}
              />
            </div>
          ) : null}

          {sata ? (
            <div className="mt-4">
              <FlashcardSataAnswerList
                options={sata.answerOptions}
                correctLetters={sata.correctLetters}
                rationaleByLetter={revealed ? sata.rationaleByLetter : []}
                revealed={revealed}
                answerChoicesHeading="Select all that apply"
                revealHint={buildHint(card)}
                onSelectionsChange={(letters) => { sataSelectionsRef.current = letters; }}
              />
            </div>
          ) : null}

          {/* Submit CTA (pre-reveal) */}
          {!revealed ? (
            <div className="nn-mobile-fc-cta-row">
              {exam ? (
                <button
                  type="button"
                  disabled={!pickedLetter || submitting}
                  onClick={() => void handleMcqSubmit()}
                  className="nn-mobile-fc-cta-btn"
                >
                  {submitting ? "Checking…" : "Submit Answer"}
                </button>
              ) : sata ? (
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleSataReveal}
                  className="nn-mobile-fc-cta-btn"
                >
                  {submitting ? "Checking…" : "Submit Answer"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePlainReveal}
                  className="nn-mobile-fc-cta-btn"
                >
                  Reveal Answer
                </button>
              )}
            </div>
          ) : null}
        </div>

        {/* Rationale section (collapsible, shown after reveal) */}
        {revealed ? (
          <div className="nn-mobile-fc-rationale-section">
            <button
              type="button"
              className="nn-mobile-fc-rationale-toggle"
              aria-expanded={rationaleOpen}
              onClick={() => setRationaleOpen((o) => !o)}
            >
              <div className="nn-mobile-fc-rationale-toggle__label">
                <Lightbulb className="h-4 w-4" aria-hidden />
                <span>Rationale</span>
              </div>
              {rationaleOpen
                ? <ChevronUp   className="h-4 w-4" aria-hidden />
                : <ChevronDown className="h-4 w-4" aria-hidden />}
            </button>
            {rationaleOpen ? (
              exam ? mcqRationale : (
                <div className="nn-mobile-fc-rationale-content">
                  <FlashcardStudyRevealPanels
                    exam={exam}
                    answer={card.answer}
                    explanation={card.explanation}
                    pearl={buildPearl(card)}
                    examPathwayLabel={examPathwayLabel}
                  />
                </div>
              )
            ) : null}
          </div>
        ) : null}

        {/* Metadata strip */}
        {metaStrip}

        {/* Confidence + rating (after reveal) */}
        {confidenceRating}

        {/* Bottom spacer for safe area */}
        <div style={{ height: "env(safe-area-inset-bottom, 1rem)", minHeight: "1rem" }} />
      </div>
    </div>
  );
}
