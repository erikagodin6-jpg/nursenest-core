"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronRight, CheckCircle2, XCircle } from "lucide-react";
import { FlashcardRichContent } from "@/components/flashcards/flashcard-rich-content";
import { FlashcardExamMcqAnswerList } from "@/components/flashcards/flashcard-exam-mcq-answer-list";
import { FlashcardSataAnswerList } from "@/components/flashcards/flashcard-sata-answer-list";
import { FlashcardStudyRevealPanels } from "@/components/flashcards/flashcard-study-reveal-panels";
import { CommunityPerformancePanel } from "@/components/flashcards/community-performance-panel";
import { AdaptiveRemediationPanel } from "@/components/flashcards/adaptive-remediation-panel";
import { resolveEcosystemLinks } from "@/lib/flashcards/flashcard-ecosystem-resolver";
import type { ExamMicroQuestionPayload, SataQuestionPayload } from "@/lib/flashcards/flashcard-exam-style";
import { isSataPayload } from "@/lib/flashcards/flashcard-exam-style";

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

/* ── Phase machine ─────────────────────────────────────────────── */
type MobilePhase = "question" | "rationale" | "confidence" | "rating";

const RATING_META = [
  { key: "again", label: "Again", sub: "Need more practice", colorClass: "nn-mobile-rating--again" },
  { key: "hard",  label: "Hard",  sub: "Getting there",      colorClass: "nn-mobile-rating--hard"  },
  { key: "good",  label: "Good",  sub: "Understood",         colorClass: "nn-mobile-rating--good"  },
  { key: "easy",  label: "Easy",  sub: "Mastered",           colorClass: "nn-mobile-rating--easy"  },
] as const;

type RatingKey = (typeof RATING_META)[number]["key"];

/* ── Helpers ───────────────────────────────────────────────────── */
function buildPearl(card: MobileCard): string {
  const src: string =
    (card.examMicroQuestion as ExamMicroQuestionPayload | null)?.rationaleCorrect ||
    card.explanation ||
    card.answer ||
    "";
  const first = src.split(".").map((s: string) => s.trim()).find(Boolean);
  return first ? (first.endsWith(".") ? first : `${first}.`) : "Review the rationale carefully.";
}


/* ══════════════════════════════════════════════════════════════════
   MobileFlashcardFlow — rendered only on sm and below via CSS.
   Shares all state/callbacks with ActiveStudySession.
   ══════════════════════════════════════════════════════════════════ */

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
  /** Called when the learner submits an MCQ/SATA answer or reveals a plain card. Arg: isCorrect (null for plain). */
  onAnswerSubmitted?: (isCorrect: boolean | null) => void;
  /** Called after rating is submitted — parent should advance to next card. */
  onRevealComplete?: () => void;
  onRate: (rating: RatingKey) => Promise<void>;
}) {
  const [phase, setPhase] = useState<MobilePhase>("question");
  const [pickedLetter, setPickedLetter] = useState<string | null>(null);
  const [submittedLetter, setSubmittedLetter] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [confidence, setConfidence] = useState<1 | 2 | 3 | 4 | 5 | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const sataSelectionsRef = useRef<string[]>([]);

  const isSata = isSataPayload(card.examMicroQuestion);
  const exam = isSata ? null : (card.examMicroQuestion as ExamMicroQuestionPayload | null);
  const sata = isSata ? (card.examMicroQuestion as unknown as SataQuestionPayload) : null;
  const isPlain = !exam && !sata;

  // Reset all phase state when card changes
  useEffect(() => {
    setPhase("question");
    setPickedLetter(null);
    setSubmittedLetter(null);
    setSubmitting(false);
    setConfidence(null);
    setIsCorrect(null);
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
      setPhase("rationale");
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
      setPhase("rationale");
    } finally {
      setSubmitting(false);
    }
  }, [onAnswerSubmitted, sata, submitting]);

  const handlePlainReveal = useCallback(() => {
    setIsCorrect(null);
    onAnswerSubmitted?.(null);
    setPhase("rationale");
  }, [onAnswerSubmitted]);

  const handleRatingSubmit = useCallback(
    async (rating: RatingKey) => {
      await onRate(rating);
      onRevealComplete?.();
    },
    [onRate, onRevealComplete],
  );

  const progressPct = Math.round(((cardIndex + 1) / Math.max(1, totalCards)) * 100);
  const formatElapsed = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  // Ecosystem plan for mobile rationale phase
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

  /* ── Phase renderers ─────────────────────────────────────────── */

  if (phase === "question") {
    return (
      <div className="nn-mobile-fc-screen nn-mobile-fc-screen--question" data-mobile-phase="question">
        {/* Header strip */}
        <div className="nn-mobile-fc-header">
          <div className="nn-mobile-fc-progress-col">
            <span className="nn-mobile-fc-progress-label">
              {cardIndex + 1} <span className="opacity-50">of</span> {totalCards}
            </span>
            <div className="nn-mobile-fc-progress-track" role="progressbar" aria-valuenow={cardIndex + 1} aria-valuemin={1} aria-valuemax={totalCards}>
              <div className="nn-mobile-fc-progress-fill" style={{ width: `${progressPct}%` }} />
            </div>
          </div>
          <span className="nn-mobile-fc-timer font-mono">{formatElapsed(elapsed)}</span>
        </div>

        {/* Question card */}
        <div className="nn-mobile-fc-question-surface">
          <div className="nn-mobile-fc-question-body">
            <FlashcardRichContent text={card.examMicroQuestion
              ? String((card.examMicroQuestion as ExamMicroQuestionPayload).questionStem ?? card.prompt)
              : card.prompt
            } />
          </div>

          {exam ? (
            <div className="mt-4">
              <FlashcardExamMcqAnswerList
                exam={exam}
                revealed={false}
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
                rationaleByLetter={[]}
                revealed={false}
                answerChoicesHeading="Select all that apply"
                revealHint="Choose all correct options, then reveal."
                onSelectionsChange={(letters) => { sataSelectionsRef.current = letters; }}
              />
            </div>
          ) : null}
        </div>

        {/* Submit / Reveal CTA */}
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
      </div>
    );
  }

  if (phase === "rationale") {
    const hasResult = isCorrect !== null;
    return (
      <div className="nn-mobile-fc-screen nn-mobile-fc-screen--rationale" data-mobile-phase="rationale">
        {/* Result banner */}
        {hasResult ? (
          <div className={`nn-mobile-fc-result-banner ${isCorrect ? "nn-mobile-fc-result-banner--correct" : "nn-mobile-fc-result-banner--incorrect"}`}>
            {isCorrect ? (
              <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden />
            ) : (
              <XCircle className="h-5 w-5 shrink-0" aria-hidden />
            )}
            <div>
              <strong>{isCorrect ? "Correct" : "Incorrect"}</strong>
              <span>{isCorrect ? "Great work — review the rationale." : "Let’s review this concept."}</span>
            </div>
          </div>
        ) : null}

        {/* Rationale content */}
        <div className="nn-mobile-fc-rationale-body">
          <FlashcardStudyRevealPanels
            exam={exam}
            answer={card.answer}
            explanation={card.explanation}
            pearl={buildPearl(card)}
            examPathwayLabel={examPathwayLabel}
          />

          {/* Community performance */}
          <CommunityPerformancePanel
            flashcardId={card.id}
            revealed
            submittedLetter={submittedLetter}
            correctLetter={exam?.correctLetter}
          />

          {/* Adaptive remediation */}
          <AdaptiveRemediationPanel
            plan={ecosystemPlan}
            isIncorrect={isCorrect === false}
            topic={card.topic}
          />

          {/* Review question link */}
          <button
            type="button"
            className="nn-mobile-fc-review-q-link"
            onClick={() => setPhase("question")}
          >
            Review question
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
          </button>
        </div>

        {/* Continue CTA */}
        <div className="nn-mobile-fc-cta-row">
          <button
            type="button"
            className="nn-mobile-fc-cta-btn"
            onClick={() => setPhase("confidence")}
          >
            Continue
            <ChevronRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>
    );
  }

  if (phase === "confidence") {
    return (
      <div className="nn-mobile-fc-screen nn-mobile-fc-screen--confidence" data-mobile-phase="confidence">
        <div className="nn-mobile-fc-stage-header">
          <h2>How confident were you?</h2>
          <p>Rate your confidence on this concept.</p>
        </div>

        <div className="nn-mobile-fc-confidence-grid">
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
        <div className="nn-mobile-fc-confidence-labels">
          <span>Not confident</span>
          <span>Very confident</span>
        </div>

        <div className="nn-mobile-fc-cta-row">
          <button
            type="button"
            disabled={!confidence}
            className="nn-mobile-fc-cta-btn"
            onClick={() => setPhase("rating")}
          >
            Continue
            <ChevronRight className="h-4 w-4" aria-hidden />
          </button>
          <button
            type="button"
            className="nn-mobile-fc-skip-link"
            onClick={() => setPhase("rating")}
          >
            Skip
          </button>
        </div>
      </div>
    );
  }

  /* phase === "rating" */
  return (
    <div className="nn-mobile-fc-screen nn-mobile-fc-screen--rating" data-mobile-phase="rating">
      <div className="nn-mobile-fc-stage-header">
        <h2>How did this card feel?</h2>
        <p>This drives when you see this card again.</p>
      </div>

      <div className="nn-mobile-fc-rating-grid">
        {RATING_META.map(({ key, label, sub, colorClass }) => (
          <button
            key={key}
            type="button"
            disabled={saving}
            className={`nn-mobile-fc-rating-card ${colorClass}`}
            onClick={() => void handleRatingSubmit(key)}
          >
            <strong>{label}</strong>
            <span>{sub}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
