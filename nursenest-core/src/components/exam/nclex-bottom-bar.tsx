"use client";

import { ChevronLeft, ChevronRight, Bookmark, BookmarkCheck } from "lucide-react";

export type NclexBottomBarProps = {
  canGoPrev: boolean;
  canGoNext: boolean;
  hasAnswer: boolean;
  marked: boolean;
  onPrev: () => void;
  onNext: () => void;
  onMark: () => void;
  onSubmit?: () => void;
  submitLabel?: string;
  /** When true: "Next" submits the answer (CAT mode). When false: show separate Submit. */
  nextSubmits?: boolean;
  disabled?: boolean;
  /** Show "Next" or "Submit" in the primary button */
  primaryAction?: "next" | "submit" | "finish";
  finishLabel?: string;
};

export function NclexBottomBar({
  canGoPrev,
  canGoNext,
  hasAnswer,
  marked,
  onPrev,
  onNext,
  onMark,
  onSubmit,
  submitLabel = "Submit Answer",
  nextSubmits = false,
  disabled = false,
  primaryAction = "next",
  finishLabel = "Finish",
}: NclexBottomBarProps) {
  return (
    <div className="nn-nclex-bottom-bar" role="navigation" aria-label="Exam navigation">
      {/* Previous */}
      <button
        type="button"
        className="nn-nclex-bottom-bar__btn"
        onClick={onPrev}
        disabled={disabled || !canGoPrev}
        aria-label="Previous question"
      >
        <ChevronLeft aria-hidden size={15} />
        Previous
      </button>

      {/* Mark for review */}
      <button
        type="button"
        className={`nn-nclex-bottom-bar__btn nn-nclex-bottom-bar__btn--mark${marked ? " nn-nclex-bottom-bar__btn--mark-active" : ""}`}
        onClick={onMark}
        disabled={disabled}
        aria-label={marked ? "Remove mark for review" : "Mark for review"}
        aria-pressed={marked}
      >
        {marked
          ? <BookmarkCheck aria-hidden size={14} />
          : <Bookmark aria-hidden size={14} />}
        Mark for Review
      </button>

      <div className="nn-nclex-bottom-bar__spacer" />

      {/* Submit / Next / Finish */}
      {primaryAction === "submit" && onSubmit ? (
        <button
          type="button"
          className="nn-nclex-bottom-bar__btn nn-nclex-bottom-bar__btn--next"
          onClick={onSubmit}
          disabled={disabled || !hasAnswer}
          aria-label={submitLabel}
        >
          {submitLabel}
          <ChevronRight aria-hidden size={15} />
        </button>
      ) : primaryAction === "finish" ? (
        <button
          type="button"
          className="nn-nclex-bottom-bar__btn nn-nclex-bottom-bar__btn--next"
          onClick={onNext}
          disabled={disabled}
        >
          {finishLabel}
          <ChevronRight aria-hidden size={15} />
        </button>
      ) : (
        <button
          type="button"
          className="nn-nclex-bottom-bar__btn nn-nclex-bottom-bar__btn--next"
          onClick={onNext}
          disabled={disabled || (nextSubmits && !hasAnswer)}
          aria-label="Next question"
        >
          Next
          <ChevronRight aria-hidden size={15} />
        </button>
      )}
    </div>
  );
}

/** Practice mode bottom bar — adds Calculator, Notes, Lab Values */
export function NclexPracticeBottomBar({
  canGoPrev,
  canGoNext,
  hasAnswer,
  marked,
  isSubmitted,
  onPrev,
  onNext,
  onMark,
  onSubmit,
  onCalculator,
  onNotes,
  onLabValues,
  disabled = false,
  isLastQuestion = false,
}: {
  canGoPrev: boolean;
  canGoNext: boolean;
  hasAnswer: boolean;
  marked: boolean;
  isSubmitted: boolean;
  onPrev: () => void;
  onNext: () => void;
  onMark: () => void;
  onSubmit: () => void;
  onCalculator?: () => void;
  onNotes?: () => void;
  onLabValues?: () => void;
  disabled?: boolean;
  isLastQuestion?: boolean;
}) {
  return (
    <div className="nn-nclex-bottom-bar">
      <button
        type="button"
        className="nn-nclex-bottom-bar__btn"
        onClick={onPrev}
        disabled={disabled || !canGoPrev}
        aria-label="Previous question"
      >
        <ChevronLeft aria-hidden size={15} />
        Previous
      </button>

      {onCalculator && (
        <button
          type="button"
          className="nn-nclex-bottom-bar__btn"
          onClick={onCalculator}
          disabled={disabled}
          aria-label="Calculator"
        >
          Calc
        </button>
      )}

      {onNotes && (
        <button
          type="button"
          className="nn-nclex-bottom-bar__btn"
          onClick={onNotes}
          disabled={disabled}
        >
          Notes
        </button>
      )}

      {onLabValues && (
        <button
          type="button"
          className="nn-nclex-bottom-bar__btn"
          onClick={onLabValues}
          disabled={disabled}
        >
          Lab Values
        </button>
      )}

      <button
        type="button"
        className={`nn-nclex-bottom-bar__btn nn-nclex-bottom-bar__btn--mark${marked ? " nn-nclex-bottom-bar__btn--mark-active" : ""}`}
        onClick={onMark}
        disabled={disabled}
        aria-pressed={marked}
      >
        {marked ? <BookmarkCheck aria-hidden size={14} /> : <Bookmark aria-hidden size={14} />}
        Mark
      </button>

      <div className="nn-nclex-bottom-bar__spacer" />

      {!isSubmitted ? (
        <button
          type="button"
          className="nn-nclex-bottom-bar__btn nn-nclex-bottom-bar__btn--next"
          onClick={onSubmit}
          disabled={disabled || !hasAnswer}
        >
          Submit Answer
          <ChevronRight aria-hidden size={15} />
        </button>
      ) : (
        <button
          type="button"
          className="nn-nclex-bottom-bar__btn nn-nclex-bottom-bar__btn--next"
          onClick={onNext}
          disabled={disabled}
        >
          {isLastQuestion ? "Finish Exam" : "Next Question"}
          <ChevronRight aria-hidden size={15} />
        </button>
      )}
    </div>
  );
}
