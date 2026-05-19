"use client";

/**
 * nclex-exam-layout.tsx
 *
 * Fixed-viewport exam layout components. Architecture contract:
 *   - .nn-nclex-exam-page: position:fixed; inset:0; display:flex; flex-direction:column; overflow:hidden
 *   - Top bar + Bottom bar: flex-shrink:0 (never collapse)
 *   - .nn-nclex-exam-body: flex:1; min-height:0; overflow:hidden
 *   - Question area: flex:1; min-height:0; display:flex; flex-direction:column; overflow:hidden
 *   - Answer list: flex:1; min-height:0; overflow:hidden (cards share space via flex:1)
 *   - Answer cards: flex:1; flex-basis:0; min-height:2.25rem; max-height:5.5rem
 *   - NO inline styles that fight the CSS — rely entirely on class names
 */

import { useState } from "react";
import type { ReactNode } from "react";
import { NclexCatTopBar, NclexPracticeTopBar, NclexEndTestModal } from "@/components/exam/nclex-cat-top-bar";
import { NclexBottomBar, NclexPracticeBottomBar } from "@/components/exam/nclex-bottom-bar";
import {
  NclexQuestionTypePanel,
  inferNclexQuestionType,
} from "@/components/exam/nclex-question-type-panel";
import { NclexRationalePanel } from "@/components/exam/nclex-rationale-panel";
import type { NclexRationalePanelStatus } from "@/components/exam/nclex-rationale-panel";
import { NclexCalculatorModal } from "@/components/exam/nclex-calculator-modal";
import { NclexNotesDrawer } from "@/components/exam/nclex-notes-drawer";

// ─────────────────────────────────────────────────────────────────────────────
// CAT EXAM LAYOUT
// ─────────────────────────────────────────────────────────────────────────────

export type NclexCatExamLayoutProps = {
  questionNumber: number;          // 1-based
  totalQuestions: number | null;   // null = unknown length (true CAT)
  remainingSec: number | null | undefined;
  examLabel?: string;
  flagged: boolean;
  onFlag: () => void;
  onEndTest: () => void;
  onPrev: () => void;
  onNext: () => void;
  canGoPrev?: boolean;
  canGoNext?: boolean;
  hasAnswer: boolean;
  nextIsSubmit?: boolean;
  disabled?: boolean;
  children: ReactNode;
  questionFormat?: string | null;
  isSata?: boolean;
  showTypePanel?: boolean;
  noteText?: string;
  onNoteSave?: (text: string) => void;
  transitioning?: boolean;
};

export function NclexCatExamLayout({
  questionNumber,
  totalQuestions,
  remainingSec,
  examLabel,
  flagged,
  onFlag,
  onEndTest,
  onPrev,
  onNext,
  canGoPrev = false,
  canGoNext = true,
  hasAnswer,
  nextIsSubmit = true,
  disabled = false,
  children,
  questionFormat,
  isSata = false,
  showTypePanel = true,
  noteText = "",
  onNoteSave,
  transitioning = false,
}: NclexCatExamLayoutProps) {
  const [showEndModal, setShowEndModal] = useState(false);
  const [showCalc, setShowCalc] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  const questionType = inferNclexQuestionType(questionFormat, isSata);

  return (
    // data-nclex-shell triggers the html/body overflow:hidden CSS rule
    <div className="nn-nclex-exam-page" data-nclex-shell="cat">

      {/* ── Fixed top bar ─────────────────────────────────────────────── */}
      <NclexCatTopBar
        examLabel={examLabel}
        questionNumber={questionNumber}
        totalQuestions={totalQuestions}
        remainingSec={remainingSec}
        flagged={flagged}
        onFlag={onFlag}
        onCalculator={() => setShowCalc(true)}
        onNotes={() => setShowNotes(true)}
        onEndTest={() => setShowEndModal(true)}
        disabled={disabled}
      />

      {/* ── Body: type-panel + question area ──────────────────────────── */}
      <div className="nn-nclex-exam-body">
        {showTypePanel && <NclexQuestionTypePanel type={questionType} />}

        {/*
          Question area is a flex column:
            Row 1: children (stem + answer list) — fills all space
          Loading overlay sits inside via position:relative on this div.
        */}
        <div
          className="nn-nclex-question-area nn-nclex-loading-overlay-parent"
          style={transitioning ? { position: "relative" } : undefined}
        >
          {transitioning && (
            <div className="nn-nclex-loading-overlay" aria-live="polite" aria-label="Loading next question">
              <div className="nn-nclex-spinner" />
            </div>
          )}
          {/*
            This inner div is a flex pass-through: flex:1 + min-height:0 + flex-column
            so stem and answer-list (the children) remain direct flex descendants.
            The animation class only applies opacity/transform, not layout.
          */}
          <div
            className={[
              "nn-nclex-question-inner",
              !transitioning ? "nn-nclex-question-transition" : "",
            ].filter(Boolean).join(" ")}
          >
            {children}
          </div>
        </div>
      </div>

      {/* ── Fixed bottom bar ──────────────────────────────────────────── */}
      <NclexBottomBar
        canGoPrev={canGoPrev}
        canGoNext={canGoNext}
        hasAnswer={hasAnswer}
        marked={flagged}
        onPrev={onPrev}
        onNext={onNext}
        onMark={onFlag}
        nextSubmits={nextIsSubmit}
        disabled={disabled}
        primaryAction="next"
      />

      {/* ── Overlays ──────────────────────────────────────────────────── */}
      {showEndModal && (
        <NclexEndTestModal
          isCat
          onConfirm={() => { setShowEndModal(false); onEndTest(); }}
          onCancel={() => setShowEndModal(false)}
        />
      )}
      {showCalc && <NclexCalculatorModal onClose={() => setShowCalc(false)} />}
      {showNotes && (
        <NclexNotesDrawer
          initialText={noteText}
          onSave={(text) => { onNoteSave?.(text); setShowNotes(false); }}
          onClose={() => setShowNotes(false)}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PRACTICE EXAM LAYOUT
// ─────────────────────────────────────────────────────────────────────────────

export type NclexPracticeExamLayoutProps = {
  questionNumber: number;
  totalQuestions: number;
  remainingSec?: number | null;
  flagged: boolean;
  onFlag: () => void;
  onFinish: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
  canGoPrev?: boolean;
  canGoNext?: boolean;
  hasAnswer: boolean;
  isSubmitted: boolean;
  isLastQuestion?: boolean;
  disabled?: boolean;
  isPaused?: boolean;
  onPause?: () => void;
  questionFormat?: string | null;
  isSata?: boolean;
  showTypePanel?: boolean;
  children: ReactNode;
  rationaleStatus: NclexRationalePanelStatus;
  correctAnswerText?: string | null;
  correctAnswerLetter?: string | null;
  correctExplanation?: string | null;
  distractors?: { letter: string; text: string; reason: string }[];
  keyTakeaway?: string | null;
  referenceSource?: string | null;
  clinicalPearl?: string | null;
  noteText?: string;
  onNoteSave?: (text: string) => void;
  transitioning?: boolean;
  unansweredCount?: number;
};

export function NclexPracticeExamLayout({
  questionNumber,
  totalQuestions,
  remainingSec,
  flagged,
  onFlag,
  onFinish,
  onPrev,
  onNext,
  onSubmit,
  canGoPrev = false,
  canGoNext = true,
  hasAnswer,
  isSubmitted,
  isLastQuestion = false,
  disabled = false,
  isPaused = false,
  onPause,
  questionFormat,
  isSata = false,
  showTypePanel = true,
  children,
  rationaleStatus,
  correctAnswerText,
  correctAnswerLetter,
  correctExplanation,
  distractors = [],
  keyTakeaway,
  referenceSource,
  clinicalPearl,
  noteText = "",
  onNoteSave,
  transitioning = false,
  unansweredCount,
}: NclexPracticeExamLayoutProps) {
  const [showEndModal, setShowEndModal] = useState(false);
  const [showCalc, setShowCalc] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  const questionType = inferNclexQuestionType(questionFormat, isSata);

  return (
    <div className="nn-nclex-exam-page" data-nclex-shell="practice">

      {/* ── Fixed top bar ─────────────────────────────────────────────── */}
      <NclexPracticeTopBar
        questionNumber={questionNumber}
        totalQuestions={totalQuestions}
        remainingSec={remainingSec}
        isPaused={isPaused}
        onPause={onPause}
        onFinish={() => setShowEndModal(true)}
        disabled={disabled}
      />

      {/* ── Body ──────────────────────────────────────────────────────── */}
      <div className="nn-nclex-exam-body">
        {showTypePanel && <NclexQuestionTypePanel type={questionType} />}

        {/* Practice split: question (flex:1) | rationale (fixed width) */}
        <div className="nn-nclex-practice-split">

          {/* Left: question content */}
          <div className="nn-nclex-practice-split__question">
            <div
              className={[
                "nn-nclex-question-area",
                "nn-nclex-loading-overlay-parent",
                !transitioning ? "nn-nclex-question-transition" : "",
              ].filter(Boolean).join(" ")}
            >
              {transitioning && (
                <div className="nn-nclex-loading-overlay">
                  <div className="nn-nclex-spinner" />
                </div>
              )}
              <div
                className={[
                  "nn-nclex-question-inner",
                  !transitioning ? "nn-nclex-question-transition" : "",
                ].filter(Boolean).join(" ")}
              >
                {children}
              </div>
            </div>
          </div>

          {/* Right: rationale panel (hidden on narrow viewports via CSS) */}
          <NclexRationalePanel
            status={rationaleStatus}
            correctAnswerText={correctAnswerText}
            correctAnswerLetter={correctAnswerLetter}
            correctExplanation={correctExplanation}
            distractors={distractors}
            keyTakeaway={keyTakeaway}
            referenceSource={referenceSource}
            clinicalPearl={clinicalPearl}
          />
        </div>
      </div>

      {/* ── Fixed bottom bar ──────────────────────────────────────────── */}
      <NclexPracticeBottomBar
        canGoPrev={canGoPrev}
        canGoNext={canGoNext}
        hasAnswer={hasAnswer}
        marked={flagged}
        isSubmitted={isSubmitted}
        onPrev={onPrev}
        onNext={onNext}
        onMark={onFlag}
        onSubmit={onSubmit}
        onCalculator={() => setShowCalc(true)}
        onNotes={() => setShowNotes(true)}
        disabled={disabled}
        isLastQuestion={isLastQuestion}
      />

      {/* ── Overlays ──────────────────────────────────────────────────── */}
      {showEndModal && (
        <NclexEndTestModal
          isCat={false}
          unansweredCount={unansweredCount}
          onConfirm={() => { setShowEndModal(false); onFinish(); }}
          onCancel={() => setShowEndModal(false)}
        />
      )}
      {showCalc && <NclexCalculatorModal onClose={() => setShowCalc(false)} />}
      {showNotes && (
        <NclexNotesDrawer
          initialText={noteText}
          onSave={(text) => { onNoteSave?.(text); setShowNotes(false); }}
          onClose={() => setShowNotes(false)}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ANSWER CARDS
// These are direct children of .nn-nclex-answer-list.
// Each card is flex:1 flex-basis:0 so all cards share vertical space equally.
// ─────────────────────────────────────────────────────────────────────────────

const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H"];

export type NclexAnswerCardState = "default" | "selected" | "correct" | "incorrect" | "dim";

/** Wrapper list — flex column, fills remaining space, overflow:hidden */
export function NclexAnswerList({ children }: { children: ReactNode }) {
  return <div className="nn-nclex-answer-list">{children}</div>;
}

/** Single answer card */
export function NclexAnswerCard({
  index,
  text,
  state = "default",
  isCheckbox = false,
  checked = false,
  disabled = false,
  onClick,
  onChange,
}: {
  index: number;
  text: string;
  state?: NclexAnswerCardState;
  isCheckbox?: boolean;
  checked?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  onChange?: (checked: boolean) => void;
}) {
  const letter = OPTION_LETTERS[index] ?? String(index + 1);
  const isLocked = disabled || state === "correct" || state === "incorrect" || state === "dim";

  const cardClass = [
    "nn-nclex-answer-card",
    state === "selected"  ? "nn-nclex-answer-card--selected"  : "",
    state === "correct"   ? "nn-nclex-answer-card--correct"   : "",
    state === "incorrect" ? "nn-nclex-answer-card--incorrect" : "",
    state === "dim"       ? "nn-nclex-answer-card--dim"       : "",
    isLocked              ? "nn-nclex-answer-card--locked"    : "",
  ].filter(Boolean).join(" ");

  /* Radio/checkbox control circle/square */
  const controlEl = isCheckbox ? (
    <div
      className={`nn-nclex-answer-card__control nn-nclex-answer-card__control--checkbox${
        checked || state === "correct" ? " nn-nclex-answer-card--selected" : ""
      }`}
      aria-hidden="true"
    >
      {(checked || state === "correct") && (
        <svg className="nn-nclex-answer-card__control-check" viewBox="0 0 10 8">
          <polyline points="1,4 4,7 9,1" />
        </svg>
      )}
    </div>
  ) : (
    <div className="nn-nclex-answer-card__control" aria-hidden="true">
      {(state === "selected" || state === "correct") && (
        <div className="nn-nclex-answer-card__control-dot" />
      )}
    </div>
  );

  /* Correctness icon */
  const statusIcon =
    state === "correct" ? (
      <svg className="nn-nclex-answer-card__status-icon" width="18" height="18" viewBox="0 0 20 20" fill="none" aria-label="Correct">
        <circle cx="10" cy="10" r="9" stroke="#16a34a" strokeWidth="1.5" fill="#dcfce7" />
        <polyline points="6,10 9,13 14,7" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ) : state === "incorrect" ? (
      <svg className="nn-nclex-answer-card__status-icon" width="18" height="18" viewBox="0 0 20 20" fill="none" aria-label="Incorrect">
        <circle cx="10" cy="10" r="9" stroke="#dc2626" strokeWidth="1.5" fill="#fee2e2" />
        <line x1="7" y1="7" x2="13" y2="13" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
        <line x1="13" y1="7" x2="7" y2="13" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ) : null;

  if (isCheckbox) {
    return (
      <label className={cardClass}>
        <input
          type="checkbox"
          checked={checked}
          disabled={isLocked}
          onChange={(e) => onChange?.(e.target.checked)}
          className="sr-only"
        />
        {controlEl}
        <span className="nn-nclex-answer-card__letter">{letter}</span>
        <span className="nn-nclex-answer-card__text">{text}</span>
        {statusIcon}
        {state === "correct"   && <span className="sr-only">Correct answer</span>}
        {state === "incorrect" && <span className="sr-only">Incorrect</span>}
      </label>
    );
  }

  return (
    <button
      type="button"
      className={cardClass}
      disabled={isLocked}
      onClick={onClick}
      aria-pressed={state === "selected"}
    >
      {controlEl}
      <span className="nn-nclex-answer-card__letter">{letter}</span>
      <span className="nn-nclex-answer-card__text">{text}</span>
      {statusIcon}
      {state === "correct"   && <span className="sr-only">Correct answer</span>}
      {state === "incorrect" && <span className="sr-only">Incorrect</span>}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// QUESTION STEM
// ─────────────────────────────────────────────────────────────────────────────

export function NclexQuestionStem({
  stem,
  instruction,
}: {
  stem: string;
  instruction?: string | null;
}) {
  if (!instruction || !stem.includes(instruction)) {
    return <p className="nn-nclex-question-stem">{stem}</p>;
  }

  const parts = stem.split(instruction);
  return (
    <p className="nn-nclex-question-stem">
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 && (
            <em className="nn-nclex-question-instruction">{instruction}</em>
          )}
        </span>
      ))}
    </p>
  );
}
