"use client";

import type { ReactNode } from "react";
import { BookOpen, Calculator, Flag, FileText, FlaskConical, Pause, Play, X } from "lucide-react";

export type NclexCatTopBarProps = {
  /** e.g. "NCLEX-RN" or "CNPLE" */
  examLabel?: string;
  /** 1-based current question number */
  questionNumber: number;
  /** Total question count. Pass null for CAT (unknown length). */
  totalQuestions: number | null;
  /** Remaining seconds. Null = untimed. */
  remainingSec: number | null | undefined;
  /** True if current question is flagged */
  flagged: boolean;
  onFlag: () => void;
  onCalculator: () => void;
  onNotes: () => void;
  onLabValues?: () => void;
  onEndTest: () => void;
  disabled?: boolean;
  /** SI / conventional units control (CAT, practice shells). */
  unitsControl?: ReactNode;
};

function fmt(sec: number): { text: string; tier: "normal" | "warn" | "critical" } {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  const text = h > 0
    ? `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
    : `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  const tier = sec < 60 ? "critical" : sec < 300 ? "warn" : "normal";
  return { text, tier };
}

export function NclexCatTopBar({
  examLabel = "NCLEX® NEXT GEN",
  questionNumber,
  totalQuestions,
  remainingSec,
  flagged,
  onFlag,
  onCalculator,
  onNotes,
  onLabValues,
  onEndTest,
  disabled = false,
  unitsControl = null,
}: NclexCatTopBarProps) {
  const timer = remainingSec != null ? fmt(remainingSec) : null;

  return (
    <div className="nn-nclex-top-bar" role="toolbar" aria-label="Exam controls">
      {/* Logo */}
      <div className="nn-nclex-top-bar__section">
        <div className="nn-nclex-top-bar__logo">
          <div className="nn-nclex-top-bar__logo-mark" aria-hidden="true">N</div>
          <div className="nn-nclex-top-bar__logo-text">
            <span className="nn-nclex-top-bar__logo-name">NurseNest</span>
            <span className="nn-nclex-top-bar__logo-sub">{examLabel}</span>
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="nn-nclex-top-bar__section">
        <div style={{ display: "flex", flexDirection: "column", gap: "0.1rem" }}>
          <span className="nn-nclex-top-bar__stat-label">Questions</span>
          <span className="nn-nclex-top-bar__stat-value" aria-live="polite">
            {questionNumber}
            {totalQuestions != null ? ` of ${totalQuestions}` : ""}
          </span>
        </div>
      </div>

      {/* Timer */}
      <div className="nn-nclex-top-bar__section">
        <div style={{ display: "flex", flexDirection: "column", gap: "0.1rem" }}>
          <span className="nn-nclex-top-bar__stat-label">Time Remaining</span>
          {timer ? (
            <span
              className={`nn-nclex-top-bar__stat-value nn-nclex-top-bar__stat-value--timer${
                timer.tier === "critical"
                  ? " nn-nclex-top-bar__stat-value--critical"
                  : timer.tier === "warn"
                    ? " nn-nclex-top-bar__stat-value--warn"
                    : ""
              }`}
              aria-live="polite"
              aria-atomic="true"
            >
              {timer.text}
            </span>
          ) : (
            <span className="nn-nclex-top-bar__stat-value" style={{ color: "#94a3b8" }}>
              Untimed
            </span>
          )}
        </div>
      </div>

      {unitsControl ? (
        <div className="nn-nclex-top-bar__section" aria-label="Measurement units">
          {unitsControl}
        </div>
      ) : null}

      {/* Calculator */}
      <div className="nn-nclex-top-bar__section">
        <button
          type="button"
          className="nn-nclex-top-bar__btn"
          onClick={onCalculator}
          disabled={disabled}
          aria-label="Open calculator"
        >
          <Calculator aria-hidden size={14} />
          Calculator
        </button>
      </div>

      <div className="nn-nclex-top-bar__spacer" />

      {onLabValues ? (
        <div className="nn-nclex-top-bar__section">
          <button
            type="button"
            className="nn-nclex-top-bar__btn"
            onClick={onLabValues}
            disabled={disabled}
            aria-label="Open lab values reference"
          >
            <FlaskConical aria-hidden size={14} />
            Lab Values
          </button>
        </div>
      ) : null}

      {/* Notes */}
      <div className="nn-nclex-top-bar__section">
        <button
          type="button"
          className="nn-nclex-top-bar__btn"
          onClick={onNotes}
          disabled={disabled}
          aria-label="Open notes"
        >
          <FileText aria-hidden size={14} />
          Notes
        </button>
      </div>

      {/* Flag */}
      <div className="nn-nclex-top-bar__section">
        <button
          type="button"
          className={`nn-nclex-top-bar__btn${flagged ? " nn-nclex-top-bar__btn--flag-active" : ""}`}
          onClick={onFlag}
          disabled={disabled}
          aria-label={flagged ? "Remove flag from this question" : "Flag this question for review"}
          aria-pressed={flagged}
        >
          <Flag aria-hidden size={14} />
          Flag
        </button>
      </div>

      {/* End Test */}
      <div className="nn-nclex-top-bar__section">
        <button
          type="button"
          className="nn-nclex-top-bar__end-btn"
          onClick={onEndTest}
          disabled={disabled}
          aria-label="End test"
        >
          END TEST
        </button>
      </div>
    </div>
  );
}

/** Practice mode top bar — lighter, shows "Practice Exam · Learning mode" badge */
export function NclexPracticeTopBar({
  questionNumber,
  totalQuestions,
  remainingSec,
  isPaused,
  onPause,
  onFinish,
  disabled = false,
  unitsControl = null,
}: {
  questionNumber: number;
  totalQuestions: number;
  remainingSec: number | null | undefined;
  isPaused?: boolean;
  onPause?: () => void;
  onFinish: () => void;
  disabled?: boolean;
  unitsControl?: ReactNode;
}) {
  const timer = remainingSec != null ? fmt(remainingSec) : null;

  return (
    <div className="nn-nclex-practice-top-bar">
      <div className="nn-nclex-top-bar__logo" style={{ marginRight: "0.5rem" }}>
        <div className="nn-nclex-top-bar__logo-mark" aria-hidden="true">N</div>
        <span className="nn-nclex-top-bar__logo-name" style={{ fontSize: "0.875rem" }}>NurseNest</span>
      </div>

      <span className="nn-nclex-practice-mode-badge">
        <BookOpen aria-hidden size={15} />
        Practice Exam · Learning mode
      </span>

      {unitsControl ? (
        <div style={{ marginLeft: "0.5rem" }} aria-label="Measurement units">
          {unitsControl}
        </div>
      ) : null}

      <div style={{ flex: 1 }} />

      <span
        className={`nn-nclex-practice-progress nn-nclex-practice-progress--timer${
          timer?.tier === "critical" ? " nn-nclex-top-bar__stat-value--critical" : ""
        }`}
        aria-live="polite"
      >
        <span>Time elapsed</span>
        <strong>{timer ? timer.text : "00:00"}</strong>
      </span>

      <span className="nn-nclex-practice-progress" aria-live="polite">
        <span>Questions</span>
        <strong>{questionNumber} of {totalQuestions}</strong>
      </span>

      {onPause && (
        <button
          type="button"
          className="nn-nclex-top-bar__btn"
          onClick={onPause}
          disabled={disabled}
        >
          {isPaused ? <Play aria-hidden size={15} /> : <Pause aria-hidden size={15} />}
          {isPaused ? "Resume" : "Pause"}
        </button>
      )}

      <button
        type="button"
        className="nn-nclex-top-bar__end-btn"
        onClick={onFinish}
        disabled={disabled}
      >
        Finish
      </button>
    </div>
  );
}

/** End Test confirmation modal */
export function NclexEndTestModal({
  isCat,
  onConfirm,
  onCancel,
  unansweredCount,
}: {
  isCat: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  unansweredCount?: number;
}) {
  return (
    <div className="nn-nclex-confirm-overlay" role="dialog" aria-modal="true" aria-labelledby="nclex-end-title">
      <div className="nn-nclex-confirm-modal">
        <h2 id="nclex-end-title" className="nn-nclex-confirm-modal__title">
          {isCat ? "End Exam?" : "Finish Exam?"}
        </h2>
        <p className="nn-nclex-confirm-modal__body">
          {isCat
            ? "Once you end the exam, your responses will be submitted and you will not be able to continue. Your results and ability estimate will be calculated."
            : unansweredCount != null && unansweredCount > 0
              ? `You have ${unansweredCount} unanswered question${unansweredCount === 1 ? "" : "s"}. Once you finish, results will be calculated and rationale will be shown.`
              : "Once you finish, results will be calculated and rationale will be shown."}
        </p>
        <div className="nn-nclex-confirm-modal__actions">
          <button type="button" className="nn-nclex-confirm-modal__cancel-btn" onClick={onCancel}>
            Return to exam
          </button>
          <button type="button" className="nn-nclex-confirm-modal__confirm-btn" onClick={onConfirm}>
            {isCat ? "End Exam" : "Submit & Finish"}
          </button>
        </div>
      </div>
    </div>
  );
}
