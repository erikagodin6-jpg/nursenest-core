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
import type { KeyboardEvent, MouseEvent, ReactNode } from "react";
import { Ban } from "lucide-react";
import { NclexCatTopBar, NclexPracticeTopBar, NclexEndTestModal } from "@/components/exam/nclex-cat-top-bar";
import { NclexBottomBar, NclexPracticeBottomBar } from "@/components/exam/nclex-bottom-bar";
import {
  NclexQuestionTypePanel,
  inferNclexQuestionType,
} from "@/components/exam/nclex-question-type-panel";
import type { CatExamUiPhase } from "@/lib/practice-tests/cat-exam-ui-state";
import { NclexCalculatorModal } from "@/components/exam/nclex-calculator-modal";
import { NclexNotesDrawer } from "@/components/exam/nclex-notes-drawer";
import { NclexLabReference } from "@/components/exam/nclex-lab-reference";
import type { UnifiedExamWorkspaceMode } from "@/lib/exam-workspace/unified-exam-workspace";

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
  /** CAT exam FSM — when set, footer uses submit → advance (E2E + contract). */
  catExamUiPhase?: CatExamUiPhase;
  onSubmitAnswer?: () => void;
  onAdvance?: () => void;
  examPrimaryBusy?: boolean;
  /** SI / conventional units toggle (rendered in top bar). */
  unitsControl?: ReactNode;
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
  catExamUiPhase,
  onSubmitAnswer,
  onAdvance,
  examPrimaryBusy = false,
  unitsControl,
}: NclexCatExamLayoutProps) {
  const [showEndModal, setShowEndModal] = useState(false);
  const [showCalc, setShowCalc] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showLabValues, setShowLabValues] = useState(false);

  const questionType = inferNclexQuestionType(questionFormat, isSata);

  const catExamTwoStep =
    catExamUiPhase != null && onSubmitAnswer != null && onAdvance != null;

  return (
    // data-nclex-shell triggers the html/body overflow:hidden CSS rule
    <div
      className="nn-nclex-exam-page nn-unified-exam-workspace nn-cat-exam-chrome nn-cat-exam-chrome--premium nn-cat-adaptive-exam-session nn-cat-premium-convergence"
      data-nclex-shell="cat"
      data-nn-unified-exam-workspace=""
      data-nn-exam-workspace-mode={"cat" satisfies UnifiedExamWorkspaceMode}
      data-cat-exam-root=""
      data-nn-cat-premium-convergence=""
    >

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
        onLabValues={() => setShowLabValues(true)}
        onEndTest={() => setShowEndModal(true)}
        disabled={disabled}
        unitsControl={unitsControl}
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
      {catExamTwoStep ? (
        <div
          className="nn-nclex-bottom-bar"
          role="navigation"
          aria-label="Exam navigation"
          data-nn-qa-cat-adaptive-exam-footer=""
        >
          <button
            type="button"
            className="nn-nclex-bottom-bar__btn"
            onClick={onPrev}
            disabled={disabled || examPrimaryBusy || !canGoPrev}
            aria-label="Previous question"
          >
            Previous
          </button>
          <button
            type="button"
            className={`nn-nclex-bottom-bar__btn nn-nclex-bottom-bar__btn--mark${flagged ? " nn-nclex-bottom-bar__btn--mark-active" : ""}`}
            onClick={onFlag}
            disabled={disabled || examPrimaryBusy}
            aria-pressed={flagged}
          >
            Mark for Review
          </button>
          <div className="nn-nclex-bottom-bar__spacer" />
          {catExamUiPhase === "answering" ? (
            <button
              type="button"
              data-nn-qa-cat-exam-submit-answer=""
              className="nn-nclex-bottom-bar__btn nn-nclex-bottom-bar__btn--next"
              onClick={onSubmitAnswer}
              disabled={disabled || examPrimaryBusy || !hasAnswer}
            >
              Submit answer
            </button>
          ) : (
            <button
              type="button"
              data-nn-qa-cat-exam-advance=""
              data-nn-qa-cat-exam-advance-intent="server_driven"
              className="nn-nclex-bottom-bar__btn nn-nclex-bottom-bar__btn--next"
              onClick={onAdvance}
              disabled={disabled || examPrimaryBusy || catExamUiPhase === "advancing"}
            >
              Next
            </button>
          )}
        </div>
      ) : (
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
      )}

      {/* ── Overlays ──────────────────────────────────────────────────── */}
      {showEndModal && (
        <NclexEndTestModal
          isCat
          onConfirm={() => { setShowEndModal(false); onEndTest(); }}
          onCancel={() => setShowEndModal(false)}
        />
      )}
      {showCalc && <NclexCalculatorModal onClose={() => setShowCalc(false)} />}
      {showLabValues && <NclexLabReference onClose={() => setShowLabValues(false)} />}
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

export type NclexPracticeShellPresentation = "standard" | "loft";

export type NclexPracticeExamLayoutProps = {
  /** `loft` = CNPLE-style linear licensing chrome (same grid, LOFT tokens). */
  shellPresentation?: NclexPracticeShellPresentation;
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
  /** Post-submit rationale (PracticeRationaleFullPanel + lesson links). */
  rationaleSlot?: ReactNode;
  /** When true, type panel hides to preserve viewport for rationale band (direction E). */
  rationaleActive?: boolean;
  noteText?: string;
  onNoteSave?: (text: string) => void;
  transitioning?: boolean;
  unansweredCount?: number;
  unitsControl?: ReactNode;
};

export function NclexPracticeExamLayout({
  shellPresentation = "standard",
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
  rationaleSlot,
  rationaleActive = false,
  noteText = "",
  onNoteSave,
  transitioning = false,
  unansweredCount,
  unitsControl,
}: NclexPracticeExamLayoutProps) {
  const [showEndModal, setShowEndModal] = useState(false);
  const [showCalc, setShowCalc] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showLabValues, setShowLabValues] = useState(false);

  const questionType = inferNclexQuestionType(questionFormat, isSata);
  const loftPresentation = shellPresentation === "loft";

  return (
    <div
      className={[
        "nn-nclex-exam-page",
        "nn-unified-exam-workspace",
        "nn-cat-exam-chrome",
        "nn-cat-exam-chrome--premium",
        loftPresentation ? "nn-cat-adaptive-exam-session" : "nn-cat-premium-convergence",
        rationaleActive ? "nn-nclex-exam-page--rationale-active" : "",
      ].filter(Boolean).join(" ")}
      data-nclex-shell="practice"
      data-nn-unified-exam-workspace=""
      data-nn-exam-workspace-mode={"practice" satisfies UnifiedExamWorkspaceMode}
      data-cat-exam-root=""
      data-nn-cat-premium-convergence={loftPresentation ? undefined : ""}
      data-nclex-practice-rationale={rationaleActive ? "active" : "idle"}
      {...(loftPresentation ? { "data-nn-loft-simulation-shell": "" } : {})}
    >

      {/* ── Fixed top bar ─────────────────────────────────────────────── */}
      <NclexPracticeTopBar
        questionNumber={questionNumber}
        totalQuestions={totalQuestions}
        remainingSec={remainingSec}
        isPaused={isPaused}
        onPause={onPause}
        onFinish={() => setShowEndModal(true)}
        disabled={disabled}
        unitsControl={unitsControl}
      />

      {/* ── Body (same single-column shell as CAT) ─────────────────────── */}
      <div className="nn-nclex-exam-body">
        {showTypePanel && !rationaleActive && <NclexQuestionTypePanel type={questionType} />}

        <div
          className={[
            "nn-nclex-question-area",
            "nn-nclex-loading-overlay-parent",
            !transitioning ? "nn-nclex-question-transition" : "",
          ].filter(Boolean).join(" ")}
        >
          {transitioning && (
            <div className="nn-nclex-loading-overlay" aria-live="polite">
              <div className="nn-nclex-spinner" />
            </div>
          )}
          <div
            className={[
              "nn-nclex-question-inner",
              "nn-nclex-question-inner--practice",
              !transitioning ? "nn-nclex-question-transition" : "",
            ].filter(Boolean).join(" ")}
          >
            {children}
            {rationaleSlot ? (
              <div
                className={[
                  "nn-nclex-practice-rationale-band",
                  "nn-question-session-rationale",
                  rationaleActive ? "nn-nclex-practice-rationale-band--active" : "",
                ].filter(Boolean).join(" ")}
              >
                {rationaleSlot}
              </div>
            ) : null}
          </div>
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
        onLabValues={() => setShowLabValues(true)}
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
      {showLabValues && <NclexLabReference onClose={() => setShowLabValues(false)} />}
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
  crossedOut = false,
  disabled = false,
  onClick,
  onChange,
  onToggleCrossOut,
}: {
  index: number;
  text: string;
  state?: NclexAnswerCardState;
  isCheckbox?: boolean;
  checked?: boolean;
  crossedOut?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  onChange?: (checked: boolean) => void;
  onToggleCrossOut?: () => void;
}) {
  const letter = OPTION_LETTERS[index] ?? String(index + 1);
  const isLocked = disabled || state === "correct" || state === "incorrect" || state === "dim";

  const cardClass = [
    "nn-nclex-answer-card",
    state === "selected"  ? "nn-nclex-answer-card--selected"  : "",
    state === "correct"   ? "nn-nclex-answer-card--correct"   : "",
    state === "incorrect" ? "nn-nclex-answer-card--incorrect" : "",
    state === "dim"       ? "nn-nclex-answer-card--dim"       : "",
    crossedOut            ? "nn-nclex-answer-card--crossed-out" : "",
    isLocked              ? "nn-nclex-answer-card--locked"    : "",
  ].filter(Boolean).join(" ");

  const handleCrossOut = (event: MouseEvent | KeyboardEvent) => {
    if (isLocked || !onToggleCrossOut) return;
    event.preventDefault();
    event.stopPropagation();
    onToggleCrossOut();
  };

  const crossOutChip = onToggleCrossOut && !isLocked ? (
    <span
      className="nn-nclex-answer-card__crossout-chip"
      aria-hidden="true"
      title="Alt-click or right-click to cross out this answer"
    >
      <Ban size={13} />
      {crossedOut ? "Restore" : "Cross Out"}
    </span>
  ) : null;

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
      <svg
        className="nn-nclex-answer-card__status-icon nn-nclex-answer-card__status-icon--correct"
        width="18"
        height="18"
        viewBox="0 0 20 20"
        fill="none"
        aria-label="Correct"
      >
        <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
        <polyline points="6,10 9,13 14,7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ) : state === "incorrect" ? (
      <svg
        className="nn-nclex-answer-card__status-icon nn-nclex-answer-card__status-icon--incorrect"
        width="18"
        height="18"
        viewBox="0 0 20 20"
        fill="none"
        aria-label="Incorrect"
      >
        <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
        <line x1="7" y1="7" x2="13" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="13" y1="7" x2="7" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ) : null;

  if (isCheckbox) {
    return (
      <label
        className={cardClass}
        onClick={(event) => {
          if (event.altKey && onToggleCrossOut) handleCrossOut(event);
        }}
        onContextMenu={(event) => handleCrossOut(event)}
      >
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
        {crossOutChip}
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
      onClick={(event) => {
        if (event.altKey && onToggleCrossOut) {
          handleCrossOut(event);
          return;
        }
        onClick?.();
      }}
      onContextMenu={(event) => handleCrossOut(event)}
      onKeyDown={(event) => {
        if ((event.key === "x" || event.key === "X") && onToggleCrossOut) handleCrossOut(event);
      }}
      aria-pressed={state === "selected"}
      aria-describedby={onToggleCrossOut ? `nn-nclex-crossout-help-${letter}` : undefined}
    >
      {controlEl}
      <span className="nn-nclex-answer-card__letter">{letter}</span>
      <span className="nn-nclex-answer-card__text">{text}</span>
      {crossOutChip}
      {statusIcon}
      {onToggleCrossOut ? (
        <span id={`nn-nclex-crossout-help-${letter}`} className="sr-only">
          Press X, right-click, or Alt-click to cross out this answer choice.
        </span>
      ) : null}
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
