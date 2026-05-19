"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { NclexCatTopBar, NclexPracticeTopBar, NclexEndTestModal } from "@/components/exam/nclex-cat-top-bar";
import { NclexBottomBar, NclexPracticeBottomBar } from "@/components/exam/nclex-bottom-bar";
import {
  NclexQuestionTypePanel,
  inferNclexQuestionType,
  type NclexQuestionType,
} from "@/components/exam/nclex-question-type-panel";
import { NclexRationalePanel, buildNclexDistractors } from "@/components/exam/nclex-rationale-panel";
import type { NclexRationalePanelStatus } from "@/components/exam/nclex-rationale-panel";
import { NclexCalculatorModal } from "@/components/exam/nclex-calculator-modal";
import { NclexNotesDrawer } from "@/components/exam/nclex-notes-drawer";

// ─────────────────────────────────────────────────────────────────────────────
// CAT EXAM LAYOUT
// ─────────────────────────────────────────────────────────────────────────────

export type NclexCatExamLayoutProps = {
  /** 1-based */
  questionNumber: number;
  totalQuestions: number | null;
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
  /** When true the Next button submits (CAT one-question-at-a-time flow) */
  nextIsSubmit?: boolean;
  disabled?: boolean;
  /** The question content area */
  children: ReactNode;
  questionFormat?: string | null;
  isSata?: boolean;
  /** Show question type panel on the left */
  showTypePanel?: boolean;
  /** Notes text per question */
  noteText?: string;
  onNoteSave?: (text: string) => void;
  /** Loading between questions */
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
    <div className="nn-nclex-exam-page" data-nclex-cat-shell>
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

      <div className="nn-nclex-exam-body">
        {showTypePanel && <NclexQuestionTypePanel type={questionType} />}

        <div
          className={`nn-nclex-question-area${transitioning ? " nn-nclex-loading-overlay-parent" : ""}`}
          style={{ position: "relative" }}
        >
          {transitioning && (
            <div className="nn-nclex-loading-overlay" aria-live="polite" aria-label="Loading next question">
              <div className="nn-nclex-spinner" />
            </div>
          )}
          <div className={transitioning ? "" : "nn-nclex-question-transition"}>
            {children}
          </div>
        </div>
      </div>

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
        primaryAction={canGoNext ? "next" : "finish"}
      />

      {showEndModal && (
        <NclexEndTestModal
          isCat
          onConfirm={() => {
            setShowEndModal(false);
            onEndTest();
          }}
          onCancel={() => setShowEndModal(false)}
        />
      )}

      {showCalc && <NclexCalculatorModal onClose={() => setShowCalc(false)} />}

      {showNotes && (
        <NclexNotesDrawer
          initialText={noteText}
          onSave={(text) => {
            onNoteSave?.(text);
            setShowNotes(false);
          }}
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
  /** Children = the question card content */
  children: ReactNode;
  /** Rationale data — shown in right panel after submit */
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
    <div className="nn-nclex-exam-page" data-nclex-practice-shell>
      <NclexPracticeTopBar
        questionNumber={questionNumber}
        totalQuestions={totalQuestions}
        remainingSec={remainingSec}
        isPaused={isPaused}
        onPause={onPause}
        onFinish={() => setShowEndModal(true)}
        disabled={disabled}
      />

      <div className="nn-nclex-exam-body">
        {showTypePanel && <NclexQuestionTypePanel type={questionType} />}

        {/* Two-column practice split: question | rationale */}
        <div className="nn-nclex-practice-split" style={{ flex: 1, minWidth: 0 }}>
          <div className="nn-nclex-practice-split__question">
            <div
              className={`nn-nclex-question-area nn-nclex-question-area--with-rationale${transitioning ? "" : " nn-nclex-question-transition"}`}
              style={{ flex: 1, minHeight: 0, position: "relative" }}
            >
              {transitioning && (
                <div className="nn-nclex-loading-overlay">
                  <div className="nn-nclex-spinner" />
                </div>
              )}
              {children}
            </div>
          </div>

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

      {showEndModal && (
        <NclexEndTestModal
          isCat={false}
          unansweredCount={unansweredCount}
          onConfirm={() => {
            setShowEndModal(false);
            onFinish();
          }}
          onCancel={() => setShowEndModal(false)}
        />
      )}

      {showCalc && <NclexCalculatorModal onClose={() => setShowCalc(false)} />}

      {showNotes && (
        <NclexNotesDrawer
          initialText={noteText}
          onSave={(text) => {
            onNoteSave?.(text);
            setShowNotes(false);
          }}
          onClose={() => setShowNotes(false)}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ANSWER CARDS — large white rounded cards matching screenshots
// ─────────────────────────────────────────────────────────────────────────────

const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H"];

export type NclexAnswerCardState = "default" | "selected" | "correct" | "incorrect" | "dim";

export function NclexAnswerList({ children }: { children: ReactNode }) {
  return (
    <div className="nn-nclex-answer-list" role="list">
      {children}
    </div>
  );
}

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

  const cardClass = [
    "nn-nclex-answer-card",
    state === "selected" ? "nn-nclex-answer-card--selected" : "",
    state === "correct" ? "nn-nclex-answer-card--correct" : "",
    state === "incorrect" ? "nn-nclex-answer-card--incorrect" : "",
    state === "dim" ? "nn-nclex-answer-card--dim" : "",
    disabled || state === "correct" || state === "incorrect" || state === "dim"
      ? "nn-nclex-answer-card--locked"
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  const controlEl = isCheckbox ? (
    <div className={`nn-nclex-answer-card__control nn-nclex-answer-card__control--checkbox${checked || state === "correct" ? " nn-nclex-answer-card--selected" : ""}`} aria-hidden="true">
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

  const statusIcon =
    state === "correct" ? (
      <svg
        className="nn-nclex-answer-card__status-icon"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        aria-label="Correct"
      >
        <circle cx="10" cy="10" r="9" stroke="#16a34a" strokeWidth="1.5" fill="#dcfce7" />
        <polyline points="6,10 9,13 14,7" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ) : state === "incorrect" ? (
      <svg
        className="nn-nclex-answer-card__status-icon"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        aria-label="Incorrect"
      >
        <circle cx="10" cy="10" r="9" stroke="#dc2626" strokeWidth="1.5" fill="#fee2e2" />
        <line x1="7" y1="7" x2="13" y2="13" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
        <line x1="13" y1="7" x2="7" y2="13" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ) : null;

  if (isCheckbox) {
    return (
      <label className={cardClass} role="listitem">
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled || state === "correct" || state === "incorrect" || state === "dim"}
          onChange={(e) => onChange?.(e.target.checked)}
          className="sr-only"
        />
        {controlEl}
        <span className="nn-nclex-answer-card__letter">{letter}</span>
        <span className="nn-nclex-answer-card__text">{text}</span>
        {statusIcon}
        {state === "correct" && <span className="sr-only">Correct answer</span>}
        {state === "incorrect" && <span className="sr-only">Incorrect</span>}
      </label>
    );
  }

  return (
    <button
      type="button"
      className={cardClass}
      role="listitem"
      disabled={disabled || state === "correct" || state === "incorrect" || state === "dim"}
      onClick={onClick}
      aria-pressed={state === "selected"}
    >
      {controlEl}
      <span className="nn-nclex-answer-card__letter">{letter}</span>
      <span className="nn-nclex-answer-card__text">{text}</span>
      {statusIcon}
      {state === "correct" && <span className="sr-only">Correct answer</span>}
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
  const parts = instruction
    ? stem.replace(instruction, `<em class="nn-nclex-question-instruction">${instruction}</em>`)
    : stem;

  return (
    <div className="nn-nclex-question-stem" role="heading" aria-level={2}>
      {instruction ? (
        <>
          {stem.split(instruction).map((part, i, arr) => (
            <span key={i}>
              {part}
              {i < arr.length - 1 && (
                <em className="nn-nclex-question-instruction">{instruction}</em>
              )}
            </span>
          ))}
        </>
      ) : (
        stem
      )}
    </div>
  );
}
