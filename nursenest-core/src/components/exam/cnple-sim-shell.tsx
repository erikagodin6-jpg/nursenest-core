"use client";

import type { ReactNode } from "react";
import { useState } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// CNPLE Simulation Shell
// Premium linear LOFT environment for the Canadian Nurse Practitioner
// Licensure Examination (CNPLE). NOT adaptive — fixed-length, back-navigation
// allowed, review screen before submit. Compatible with all NurseNest themes.
//
// IMPORTANT DISCLAIMER: This is a CNPLE-aligned simulation experience
// inspired by the CNPLE blueprint and Canadian NP competencies. It is NOT
// an official CNPLE replica, is NOT affiliated with CCRNR, and does NOT
// replicate the official exam environment.
// ─────────────────────────────────────────────────────────────────────────────

// ── Surface & layout ─────────────────────────────────────────────────────────

/** Full-viewport CNPLE linear exam surface. Suppresses learner nav context. */
export function CnpleSimSurface({ children }: { children: ReactNode }) {
  return (
    <div
      className="cnple-sim-surface flex min-h-[100dvh] flex-col"
      data-cnple-sim="surface"
      style={{ background: "var(--semantic-surface, #fafaf9)" }}
    >
      {children}
    </div>
  );
}

/** Two-column layout: question content + collapsible patient summary panel */
export function CnpleSimBody({
  children,
  sidePanel,
}: {
  children: ReactNode;
  sidePanel?: ReactNode;
}) {
  const [panelOpen, setPanelOpen] = useState(false);

  if (!sidePanel) {
    return <div className="flex-1 overflow-y-auto">{children}</div>;
  }
  return (
    <div className="flex flex-1 flex-col overflow-hidden xl:flex-row">
      {/* Mobile patient panel toggle — visible below xl */}
      <div
        className="flex shrink-0 items-center justify-between border-b px-4 py-2 xl:hidden"
        style={{
          background: "color-mix(in srgb, var(--semantic-surface) 96%, var(--semantic-brand) 4%)",
          borderColor: "var(--semantic-border-soft)",
        }}
      >
        <span
          className="text-[12px] font-semibold"
          style={{ color: "var(--semantic-text-secondary)" }}
        >
          Patient Summary
        </span>
        <button
          type="button"
          onClick={() => setPanelOpen((o) => !o)}
          className="flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold transition-colors"
          style={{
            background: panelOpen
              ? "color-mix(in srgb, var(--semantic-brand) 12%, transparent)"
              : "var(--semantic-surface)",
            borderColor: panelOpen
              ? "color-mix(in srgb, var(--semantic-brand) 30%, transparent)"
              : "var(--semantic-border-soft)",
            color: panelOpen ? "var(--semantic-brand)" : "var(--semantic-text-secondary)",
          }}
          aria-expanded={panelOpen}
          aria-controls="cnple-sim-patient-panel"
        >
          {panelOpen ? "Hide" : "Show"} Patient Info
          <span aria-hidden style={{ transform: panelOpen ? "rotate(180deg)" : "rotate(0deg)", display: "inline-block", transition: "transform 0.2s" }}>▾</span>
        </button>
      </div>

      {/* Collapsible mobile panel */}
      {panelOpen ? (
        <aside
          id="cnple-sim-patient-panel"
          className="shrink-0 overflow-y-auto border-b xl:hidden"
          style={{
            maxHeight: "40vh",
            borderColor: "var(--semantic-border-soft)",
            background: "color-mix(in srgb, var(--semantic-surface) 96%, var(--semantic-brand) 4%)",
          }}
          aria-label="Patient summary"
        >
          {sidePanel}
        </aside>
      ) : null}

      {/* Main question surface */}
      <div className="flex-1 overflow-y-auto">{children}</div>

      {/* Persistent desktop side panel (xl+) */}
      <aside
        id="cnple-sim-patient-panel"
        className="hidden w-[22rem] shrink-0 overflow-y-auto border-l xl:block"
        style={{
          borderColor: "var(--semantic-border-soft)",
          background: "color-mix(in srgb, var(--semantic-surface) 96%, var(--semantic-brand) 4%)",
        }}
        aria-label="Patient summary"
      >
        {sidePanel}
      </aside>
    </div>
  );
}

// ── Top bar ───────────────────────────────────────────────────────────────────

export type CnpleSimTopBarProps = {
  examTitle?: string;
  questionNumber: number;
  totalQuestions: number;
  remainingSec: number | null;
  flagged?: boolean;
  saving?: boolean;
  showReviewScreen?: boolean;
  onReviewToggle?: () => void;
  onExit?: () => void;
};

/** Sticky top bar: exam title, timer, question counter, flag indicator, review toggle */
export function CnpleSimTopBar({
  examTitle = "CNPLE Simulation",
  questionNumber,
  totalQuestions,
  remainingSec,
  flagged,
  saving,
  showReviewScreen,
  onReviewToggle,
  onExit,
}: CnpleSimTopBarProps) {
  const m = remainingSec != null ? Math.floor(remainingSec / 60) : null;
  const s = remainingSec != null ? remainingSec % 60 : null;
  const warn = remainingSec != null && remainingSec < 600;
  const critical = remainingSec != null && remainingSec < 120;

  return (
    <header
      className="cnple-sim-topbar sticky top-0 z-40 flex items-center justify-between border-b px-4 py-2.5 sm:px-6"
      style={{
        background: "color-mix(in srgb, var(--semantic-brand) 3%, var(--semantic-surface))",
        borderColor: "var(--semantic-border-soft)",
      }}
    >
      {/* Left: branding + exam label */}
      <div className="flex min-w-0 shrink-0 items-center gap-3">
        <span
          className="select-none text-[13px] font-bold tracking-tight"
          style={{ color: "var(--semantic-text-primary)" }}
        >
          NurseNest
        </span>
        <span
          className="hidden rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest sm:inline-block"
          style={{
            background: "color-mix(in srgb, var(--semantic-brand) 10%, transparent)",
            color: "var(--semantic-brand)",
          }}
        >
          {examTitle}
        </span>
        {flagged ? (
          <span
            className="hidden rounded-full px-2 py-0.5 text-[10px] font-semibold sm:inline-block"
            style={{
              background: "color-mix(in srgb, var(--semantic-warning) 15%, transparent)",
              color: "var(--semantic-warning-contrast)",
            }}
            aria-label="Question flagged for review"
          >
            Flagged
          </span>
        ) : null}
      </div>

      {/* Center: question counter + review toggle */}
      <div className="flex flex-1 items-center justify-center gap-3">
        <span
          className="text-[13px] font-semibold tabular-nums"
          style={{ color: "var(--semantic-text-primary)" }}
        >
          {questionNumber} / {totalQuestions}
        </span>
        {saving ? (
          <span className="text-[11px]" style={{ color: "var(--semantic-text-muted)" }}>
            · Saving
          </span>
        ) : null}
        {onReviewToggle ? (
          <button
            type="button"
            onClick={onReviewToggle}
            className="hidden rounded border px-2.5 py-1 text-[11px] font-semibold transition-colors sm:inline-flex"
            style={{
              background: showReviewScreen
                ? "color-mix(in srgb, var(--semantic-brand) 12%, transparent)"
                : "var(--semantic-surface)",
              borderColor: showReviewScreen
                ? "color-mix(in srgb, var(--semantic-brand) 30%, transparent)"
                : "var(--semantic-border-soft)",
              color: showReviewScreen ? "var(--semantic-brand)" : "var(--semantic-text-secondary)",
            }}
          >
            {showReviewScreen ? "← Resume" : "Review All"}
          </button>
        ) : null}
      </div>

      {/* Right: timer + exit */}
      <div className="flex shrink-0 items-center gap-4">
        {remainingSec != null && m != null && s != null ? (
          <div className="flex flex-col items-end">
            <span
              className="text-[10px] font-semibold uppercase tracking-wider"
              style={{ color: "var(--semantic-text-muted)" }}
            >
              Remaining
            </span>
            <span
              className="font-mono text-[15px] font-bold tabular-nums"
              style={{
                color: critical
                  ? "var(--semantic-danger)"
                  : warn
                    ? "var(--semantic-warning-contrast)"
                    : "var(--semantic-text-primary)",
              }}
              aria-live="polite"
              aria-label={`Time remaining: ${m} minutes ${s} seconds`}
            >
              {m}:{String(s).padStart(2, "0")}
            </span>
          </div>
        ) : null}

        {onExit ? (
          <button
            type="button"
            onClick={onExit}
            className="rounded border px-3 py-1.5 text-[12px] font-semibold transition-colors"
            style={{
              background: "var(--semantic-surface)",
              borderColor: "var(--semantic-border-soft)",
              color: "var(--semantic-text-secondary)",
            }}
          >
            Exit
          </button>
        ) : null}
      </div>
    </header>
  );
}

/** Thin progress bar beneath the top bar */
export function CnpleSimProgressBar({ current, total }: { current: number; total: number }) {
  const pct = total > 0 ? Math.min(100, Math.max(0, (current / total) * 100)) : 0;
  return (
    <div
      className="h-[3px] w-full"
      style={{ background: "var(--semantic-border-soft)" }}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Simulation progress: ${current} of ${total} questions`}
    >
      <div
        className="h-full transition-[width] duration-500 ease-out"
        style={{ width: `${pct}%`, background: "var(--semantic-brand)", opacity: 0.65 }}
      />
    </div>
  );
}

// ── Toolbar ───────────────────────────────────────────────────────────────────

export type CnpleSimTool = "strikeout" | "highlight" | "calculator" | "lab_ref" | null;

export function CnpleSimToolbar({
  activeTool,
  flagged,
  onToolToggle,
  onFlag,
}: {
  activeTool: CnpleSimTool;
  flagged: boolean;
  onToolToggle: (tool: Exclude<CnpleSimTool, null>) => void;
  onFlag: () => void;
}) {
  return (
    <div
      className="flex flex-wrap items-center gap-1 border-b px-4 py-2 sm:gap-2 sm:px-6"
      style={{
        background: "color-mix(in srgb, var(--semantic-surface) 97%, var(--semantic-info) 3%)",
        borderColor: "var(--semantic-border-soft)",
      }}
    >
      <span
        className="mr-2 text-[10px] font-semibold uppercase tracking-widest"
        style={{ color: "var(--semantic-text-muted)" }}
      >
        Tools
      </span>
      <CnpleToolButton
        label="Strikeout"
        icon={<StrikeoutIcon />}
        active={activeTool === "strikeout"}
        onClick={() => onToolToggle("strikeout")}
        title="Toggle strikeout — click answer choices to cross them out"
      />
      <CnpleToolButton
        label="Highlight"
        icon={<HighlightIcon />}
        active={activeTool === "highlight"}
        onClick={() => onToolToggle("highlight")}
        title="Toggle highlight — select text in the question stem"
      />
      <CnpleToolButton
        label="Calculator"
        icon={<CalculatorIcon />}
        active={activeTool === "calculator"}
        onClick={() => onToolToggle("calculator")}
        title="Open calculator"
      />
      <CnpleToolButton
        label="Lab Values"
        icon={<LabIcon />}
        active={activeTool === "lab_ref"}
        onClick={() => onToolToggle("lab_ref")}
        title="Open Canadian lab reference ranges"
      />
      <div className="ml-auto">
        <button
          type="button"
          onClick={onFlag}
          className="flex items-center gap-1.5 rounded px-3 py-1.5 text-[12px] font-semibold transition-colors"
          style={{
            background: flagged
              ? "color-mix(in srgb, var(--semantic-warning) 15%, transparent)"
              : "transparent",
            color: flagged ? "var(--semantic-warning-contrast)" : "var(--semantic-text-muted)",
            border: flagged
              ? "1px solid color-mix(in srgb, var(--semantic-warning) 30%, transparent)"
              : "1px solid transparent",
          }}
          aria-pressed={flagged}
          title={flagged ? "Remove flag from this question" : "Flag question for review"}
        >
          <FlagIcon filled={flagged} />
          {flagged ? "Flagged" : "Flag for Review"}
        </button>
      </div>
    </div>
  );
}

function CnpleToolButton({
  label,
  icon,
  active,
  onClick,
  title,
}: {
  label: string;
  icon: ReactNode;
  active: boolean;
  onClick: () => void;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-pressed={active}
      className="flex items-center gap-1.5 rounded px-2.5 py-1.5 text-[12px] font-semibold transition-colors"
      style={{
        background: active
          ? "color-mix(in srgb, var(--semantic-brand) 14%, transparent)"
          : "transparent",
        color: active ? "var(--semantic-brand)" : "var(--semantic-text-secondary)",
        border: active
          ? "1px solid color-mix(in srgb, var(--semantic-brand) 25%, transparent)"
          : "1px solid transparent",
      }}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

// ── Content surface ───────────────────────────────────────────────────────────

/** Main scrollable question content area — generous reading width for long NP clinical stems */
export function CnpleSimContent({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-[820px] px-4 py-8 sm:px-10">
      {children}
    </div>
  );
}

/** Question stem container — supports red-flag highlighting and expandable labs */
export function CnpleSimStem({ children }: { children: ReactNode }) {
  return (
    <div
      className="cnple-sim-stem rounded-xl border px-6 py-5 text-[15px] leading-relaxed sm:text-[16px]"
      style={{
        borderColor: "var(--semantic-border-soft)",
        background: "color-mix(in srgb, var(--semantic-surface) 98%, var(--semantic-brand) 2%)",
        color: "var(--semantic-text-primary)",
      }}
    >
      {children}
    </div>
  );
}

/** Inline red-flag callout for critical findings in clinical stems */
export function CnpleRedFlag({ children }: { children: ReactNode }) {
  return (
    <mark
      className="rounded px-1 py-0.5 font-semibold"
      style={{
        background: "color-mix(in srgb, var(--semantic-danger) 14%, transparent)",
        color: "var(--semantic-danger)",
      }}
    >
      {children}
    </mark>
  );
}

// ── Answer options ────────────────────────────────────────────────────────────

export type CnpleAnswerState = "default" | "selected" | "struck" | "correct" | "incorrect";

export function CnpleSimAnswerOption({
  letter,
  children,
  state = "default",
  onClick,
  disabled,
}: {
  letter: string;
  children: ReactNode;
  state?: CnpleAnswerState;
  onClick?: () => void;
  disabled?: boolean;
}) {
  const isSelected = state === "selected";
  const isStruck = state === "struck";
  const isCorrect = state === "correct";
  const isIncorrect = state === "incorrect";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group flex w-full items-start gap-3.5 rounded-xl border px-5 py-4 text-left text-[14.5px] leading-relaxed transition-all sm:text-[15px]"
      style={{
        borderColor: isSelected
          ? "var(--semantic-brand)"
          : isCorrect
            ? "var(--semantic-success)"
            : isIncorrect
              ? "var(--semantic-danger)"
              : "var(--semantic-border-soft)",
        background: isSelected
          ? "color-mix(in srgb, var(--semantic-brand) 8%, var(--semantic-surface))"
          : isCorrect
            ? "color-mix(in srgb, var(--semantic-success) 8%, var(--semantic-surface))"
            : isIncorrect
              ? "color-mix(in srgb, var(--semantic-danger) 8%, var(--semantic-surface))"
              : "var(--semantic-surface)",
        color: isStruck ? "var(--semantic-text-muted)" : "var(--semantic-text-primary)",
        textDecoration: isStruck ? "line-through" : "none",
        opacity: disabled && !isSelected ? 0.6 : 1,
      }}
      aria-pressed={isSelected}
    >
      <span
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[12px] font-bold"
        style={{
          background: isSelected
            ? "var(--semantic-brand)"
            : "color-mix(in srgb, var(--semantic-border-soft) 60%, transparent)",
          color: isSelected ? "#fff" : "var(--semantic-text-secondary)",
        }}
      >
        {letter}
      </span>
      <span>{children}</span>
    </button>
  );
}

// ── Bottom nav bar ────────────────────────────────────────────────────────────

export function CnpleSimNavBar({
  onPrev,
  onNext,
  onSubmit,
  canPrev,
  canNext,
  isFinal,
  saving,
  flagged,
  onFlag,
}: {
  onPrev?: () => void;
  onNext?: () => void;
  onSubmit?: () => void;
  canPrev: boolean;
  canNext: boolean;
  isFinal?: boolean;
  saving?: boolean;
  flagged?: boolean;
  onFlag?: () => void;
}) {
  return (
    <div
      className="sticky bottom-0 z-30 flex items-center justify-between border-t px-4 py-3 sm:px-8"
      style={{
        background: "var(--semantic-surface)",
        borderColor: "var(--semantic-border-soft)",
      }}
    >
      <button
        type="button"
        onClick={onPrev}
        disabled={!canPrev}
        className="flex items-center gap-2 rounded-full border px-5 py-2.5 text-[13px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40"
        style={{
          borderColor: "var(--semantic-border-soft)",
          color: "var(--semantic-text-secondary)",
          background: "var(--semantic-surface)",
        }}
      >
        <ChevronLeft /> Previous
      </button>

      <div className="flex items-center gap-3">
        {onFlag ? (
          <button
            type="button"
            onClick={onFlag}
            className="hidden items-center gap-1.5 rounded-full border px-4 py-2.5 text-[12px] font-semibold transition-colors sm:flex"
            style={{
              background: flagged
                ? "color-mix(in srgb, var(--semantic-warning) 12%, transparent)"
                : "var(--semantic-surface)",
              borderColor: flagged
                ? "color-mix(in srgb, var(--semantic-warning) 30%, transparent)"
                : "var(--semantic-border-soft)",
              color: flagged ? "var(--semantic-warning-contrast)" : "var(--semantic-text-muted)",
            }}
          >
            <FlagIcon filled={Boolean(flagged)} />
            {flagged ? "Flagged" : "Flag"}
          </button>
        ) : null}

        {isFinal && onSubmit ? (
          <button
            type="button"
            onClick={onSubmit}
            disabled={saving}
            className="rounded-full px-7 py-2.5 text-[13px] font-bold shadow-sm transition-colors disabled:opacity-60"
            style={{ background: "var(--semantic-brand)", color: "#fff" }}
          >
            {saving ? "Submitting…" : "Review & Submit"}
          </button>
        ) : (
          <button
            type="button"
            onClick={onNext}
            disabled={!canNext}
            className="flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40"
            style={{ background: "var(--semantic-brand)", color: "#fff" }}
          >
            Next <ChevronRight />
          </button>
        )}
      </div>
    </div>
  );
}

// ── Review screen ─────────────────────────────────────────────────────────────

export type CnpleQuestionReviewState = {
  index: number;
  answered: boolean;
  flagged: boolean;
};

export function CnpleSimReviewScreen({
  questions,
  currentIndex,
  onNavigate,
  onSubmit,
  saving,
}: {
  questions: CnpleQuestionReviewState[];
  currentIndex: number;
  onNavigate: (index: number) => void;
  onSubmit?: () => void;
  saving?: boolean;
}) {
  const answered = questions.filter((q) => q.answered).length;
  const flagged = questions.filter((q) => q.flagged).length;
  const unanswered = questions.length - answered;

  return (
    <div
      className="mx-auto max-w-2xl px-4 py-8 sm:px-8"
      data-cnple-review="screen"
    >
      <div className="mb-6">
        <h2
          className="text-xl font-bold"
          style={{ color: "var(--semantic-text-primary)" }}
        >
          Review your answers
        </h2>
        <p className="mt-1 text-[14px]" style={{ color: "var(--semantic-text-muted)" }}>
          Select any question to return to it. When ready, submit your simulation.
        </p>
      </div>

      {/* Summary row */}
      <div className="mb-6 flex gap-4 rounded-xl border p-4" style={{ borderColor: "var(--semantic-border-soft)" }}>
        <ReviewStat label="Answered" value={answered} color="var(--semantic-success)" />
        <ReviewStat label="Unanswered" value={unanswered} color={unanswered > 0 ? "var(--semantic-warning-contrast)" : "var(--semantic-text-muted)"} />
        <ReviewStat label="Flagged" value={flagged} color={flagged > 0 ? "var(--semantic-brand)" : "var(--semantic-text-muted)"} />
      </div>

      {/* Question grid */}
      <div className="grid grid-cols-8 gap-2 sm:grid-cols-10">
        {questions.map((q) => (
          <button
            key={q.index}
            type="button"
            onClick={() => onNavigate(q.index)}
            title={`Question ${q.index + 1}${q.answered ? " (answered)" : " (unanswered)"}${q.flagged ? " — flagged" : ""}`}
            className="relative flex aspect-square items-center justify-center rounded-lg text-[13px] font-semibold transition-colors"
            style={{
              background:
                q.index === currentIndex
                  ? "var(--semantic-brand)"
                  : q.answered
                    ? "color-mix(in srgb, var(--semantic-success) 14%, var(--semantic-surface))"
                    : "color-mix(in srgb, var(--semantic-border-soft) 60%, transparent)",
              color:
                q.index === currentIndex
                  ? "#fff"
                  : q.answered
                    ? "var(--semantic-success)"
                    : "var(--semantic-text-muted)",
              border: `1px solid ${q.index === currentIndex ? "var(--semantic-brand)" : q.answered ? "color-mix(in srgb, var(--semantic-success) 30%, transparent)" : "var(--semantic-border-soft)"}`,
            }}
          >
            {q.index + 1}
            {q.flagged ? (
              <span
                className="absolute right-0.5 top-0.5 h-2 w-2 rounded-full"
                style={{ background: "var(--semantic-warning-contrast)" }}
                aria-hidden
              />
            ) : null}
          </button>
        ))}
      </div>

      {/* Submit action */}
      {onSubmit ? (
        <div className="mt-10 flex justify-end">
          <button
            type="button"
            onClick={onSubmit}
            disabled={saving}
            className="rounded-full px-8 py-3 text-[14px] font-bold shadow-sm transition-colors disabled:opacity-60"
            style={{ background: "var(--semantic-brand)", color: "#fff" }}
          >
            {saving ? "Submitting…" : "Submit Simulation"}
          </button>
        </div>
      ) : null}

      {/* Mandatory disclaimer */}
      <p
        className="mt-8 text-[11px] leading-relaxed"
        style={{ color: "var(--semantic-text-muted)" }}
      >
        CNPLE-aligned simulation for Canadian NP exam preparation. This experience is inspired by
        the CNPLE blueprint and Canadian NP competencies and is not affiliated with CCRNR or any
        official regulatory body. Results are for self-assessment only and do not predict exam
        outcomes.
      </p>
    </div>
  );
}

function ReviewStat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex-1 text-center">
      <div className="text-xl font-bold" style={{ color }}>
        {value}
      </div>
      <div className="text-[11px] font-medium" style={{ color: "var(--semantic-text-muted)" }}>
        {label}
      </div>
    </div>
  );
}

// ── Post-exam completion screen ───────────────────────────────────────────────

export function CnpleSimCompleteScreen({
  score,
  totalQuestions,
  correctCount,
  timeTakenSec,
  onViewReport,
  onRestart,
}: {
  score: number;
  totalQuestions: number;
  correctCount: number;
  timeTakenSec?: number;
  onViewReport?: () => void;
  onRestart?: () => void;
}) {
  const pct = Math.round((correctCount / totalQuestions) * 100);
  const mm = timeTakenSec != null ? Math.floor(timeTakenSec / 60) : null;
  const ss = timeTakenSec != null ? timeTakenSec % 60 : null;

  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-8 text-center">
      <div
        className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full"
        style={{ background: "color-mix(in srgb, var(--semantic-brand) 14%, transparent)" }}
      >
        <CheckCircleIcon />
      </div>
      <h2 className="text-2xl font-bold" style={{ color: "var(--semantic-text-primary)" }}>
        Simulation Complete
      </h2>
      <p className="mt-2 text-[14px]" style={{ color: "var(--semantic-text-muted)" }}>
        You completed {totalQuestions} questions in{" "}
        {mm != null && ss != null ? `${mm}m ${String(ss).padStart(2, "0")}s` : "the allotted time"}.
      </p>

      <div className="mt-8 grid grid-cols-3 gap-4">
        <ScoreStat label="Score" value={`${score}%`} />
        <ScoreStat label="Correct" value={`${correctCount} / ${totalQuestions}`} />
        <ScoreStat label="Accuracy" value={`${pct}%`} />
      </div>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
        {onViewReport ? (
          <button
            type="button"
            onClick={onViewReport}
            className="rounded-full px-7 py-3 text-[14px] font-bold transition-colors"
            style={{ background: "var(--semantic-brand)", color: "#fff" }}
          >
            View Full Report
          </button>
        ) : null}
        {onRestart ? (
          <button
            type="button"
            onClick={onRestart}
            className="rounded-full border px-7 py-3 text-[14px] font-semibold transition-colors"
            style={{
              borderColor: "var(--semantic-border-soft)",
              color: "var(--semantic-text-secondary)",
              background: "var(--semantic-surface)",
            }}
          >
            Restart Simulation
          </button>
        ) : null}
      </div>

      <p className="mt-10 text-[11px]" style={{ color: "var(--semantic-text-muted)" }}>
        This result is for self-assessment only. Not affiliated with CCRNR or the official CNPLE.
      </p>
    </div>
  );
}

function ScoreStat({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="rounded-xl border p-4"
      style={{ borderColor: "var(--semantic-border-soft)", background: "var(--semantic-surface)" }}
    >
      <div className="text-xl font-bold" style={{ color: "var(--semantic-text-primary)" }}>
        {value}
      </div>
      <div className="mt-1 text-[11px] font-medium" style={{ color: "var(--semantic-text-muted)" }}>
        {label}
      </div>
    </div>
  );
}

// ── SVG icons (inline, theme-safe) ───────────────────────────────────────────

function StrikeoutIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <path d="M16 6H8a2 2 0 0 0-2 2v0a2 2 0 0 0 2 2h8a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2H8" />
    </svg>
  );
}

function HighlightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l-3 3 4 4 3-3" />
      <path d="M13 7l4 4" />
      <line x1="3" y1="21" x2="6" y2="21" />
      <path d="M15 3l6 6-9.5 9.5-3-3Z" />
    </svg>
  );
}

function CalculatorIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <line x1="8" y1="6" x2="16" y2="6" />
      <line x1="8" y1="10" x2="8" y2="10" strokeWidth="2.5" />
      <line x1="12" y1="10" x2="12" y2="10" strokeWidth="2.5" />
      <line x1="16" y1="10" x2="16" y2="10" strokeWidth="2.5" />
      <line x1="8" y1="14" x2="8" y2="14" strokeWidth="2.5" />
      <line x1="12" y1="14" x2="12" y2="14" strokeWidth="2.5" />
      <line x1="16" y1="14" x2="16" y2="14" strokeWidth="2.5" />
      <line x1="8" y1="18" x2="12" y2="18" />
      <line x1="16" y1="18" x2="16" y2="18" strokeWidth="2.5" />
    </svg>
  );
}

function LabIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 3h6" />
      <path d="M9 3v8.5L5 20a1 1 0 0 0 .93 1.37h12.14A1 1 0 0 0 19 20l-4-8.5V3" />
      <line x1="6" y1="14" x2="18" y2="14" />
    </svg>
  );
}

function FlagIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
  );
}

function ChevronLeft() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--semantic-brand)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}
