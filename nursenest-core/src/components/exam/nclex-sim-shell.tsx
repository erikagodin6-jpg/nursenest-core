"use client";

import type { ReactNode } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// NCLEX Simulator Shell
// Premium, focused exam environment — distinct visual language from practice mode.
// No brand colors during the exam, clean neutral surfaces, serious typography.
// ─────────────────────────────────────────────────────────────────────────────

/** Full-viewport exam surface — suppresses learner nav context */
export function NclexSimSurface({ children }: { children: ReactNode }) {
  return (
    <div
      className="nclex-sim-surface flex min-h-[calc(100dvh-4rem)] flex-col"
      style={{
        background: "var(--semantic-surface, #fafaf8)",
      }}
    >
      {children}
    </div>
  );
}

/** Top bar: sim branding, question counter, timer, exit */
export function NclexSimTopBar({
  questionNumber,
  totalQuestions,
  remainingSec,
  flagged,
  saving,
  onExit,
}: {
  questionNumber: number;
  totalQuestions: number;
  remainingSec: number | null;
  flagged?: boolean;
  saving?: boolean;
  onExit?: () => void;
}) {
  const m = remainingSec != null ? Math.floor(remainingSec / 60) : null;
  const s = remainingSec != null ? remainingSec % 60 : null;
  const warn = remainingSec != null && remainingSec < 300;
  const critical = remainingSec != null && remainingSec < 60;

  return (
    <header
      className="nclex-sim-topbar sticky top-0 z-40 flex items-center justify-between border-b px-4 py-2 sm:px-6"
      style={{
        background: "color-mix(in srgb, var(--semantic-brand) 4%, var(--semantic-surface))",
        borderColor: "var(--semantic-border-soft)",
      }}
    >
      {/* Left: Branding + mode label */}
      <div className="flex min-w-0 shrink-0 items-center gap-3">
        <span
          className="select-none text-[13px] font-bold tracking-tight"
          style={{ color: "var(--semantic-text-primary)" }}
        >
          NurseNest
        </span>
        <span
          className="hidden rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest sm:inline-block"
          style={{
            background: "color-mix(in srgb, var(--semantic-brand) 12%, transparent)",
            color: "var(--semantic-brand)",
          }}
        >
          NCLEX Simulation
        </span>
      </div>

      {/* Center: Question counter */}
      <div className="flex-1 text-center">
        <span
          className="text-[13px] font-semibold tabular-nums"
          style={{ color: "var(--semantic-text-primary)" }}
        >
          {questionNumber} / {totalQuestions}
        </span>
        {saving ? (
          <span
            className="ml-2 text-[11px]"
            style={{ color: "var(--semantic-text-muted)" }}
          >
            · Saving
          </span>
        ) : null}
      </div>

      {/* Right: Timer + exit */}
      <div className="flex shrink-0 items-center gap-4">
        {remainingSec != null && m != null && s != null ? (
          <div className="flex flex-col items-end">
            <span
              className="text-[10px] font-semibold uppercase tracking-wider"
              style={{ color: "var(--semantic-text-muted)" }}
            >
              Time
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
            >
              {m}:{String(s).padStart(2, "0")}
            </span>
          </div>
        ) : null}

        {onExit ? (
          <button
            type="button"
            onClick={onExit}
            className="rounded border px-3 py-1 text-[12px] font-semibold transition-colors"
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
export function NclexSimProgressBar({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  const pct = total > 0 ? Math.min(100, Math.max(0, (current / total) * 100)) : 0;
  return (
    <div
      className="h-1 w-full"
      style={{ background: "var(--semantic-border-soft)" }}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Exam progress ${current} of ${total}`}
    >
      <div
        className="h-full transition-[width] duration-500 ease-out"
        style={{
          width: `${pct}%`,
          background: "var(--semantic-brand)",
          opacity: 0.7,
        }}
      />
    </div>
  );
}

/** Tool types the toolbar can activate */
export type SimTool = "strikeout" | "highlight" | "calculator" | "lab_ref" | null;

/** Top toolbar with exam tools */
export function NclexSimToolbar({
  activeTool,
  flagged,
  onToolToggle,
  onFlag,
}: {
  activeTool: SimTool;
  flagged: boolean;
  onToolToggle: (tool: Exclude<SimTool, null>) => void;
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

      <ToolButton
        label="Strikeout"
        icon={<StrikeoutIcon />}
        active={activeTool === "strikeout"}
        onClick={() => onToolToggle("strikeout")}
        title="Toggle strikeout mode — click answer options to cross them out"
      />

      <ToolButton
        label="Highlight"
        icon={<HighlightIcon />}
        active={activeTool === "highlight"}
        onClick={() => onToolToggle("highlight")}
        title="Toggle highlight mode — select text in the question stem to highlight it"
      />

      <ToolButton
        label="Calculator"
        icon={<CalculatorIcon />}
        active={activeTool === "calculator"}
        onClick={() => onToolToggle("calculator")}
        title="Open basic calculator"
      />

      <ToolButton
        label="Lab Values"
        icon={<LabIcon />}
        active={activeTool === "lab_ref"}
        onClick={() => onToolToggle("lab_ref")}
        title="Open lab values reference"
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
          title={flagged ? "Unflag this question" : "Flag for review"}
        >
          <FlagIcon filled={flagged} />
          {flagged ? "Flagged" : "Flag"}
        </button>
      </div>
    </div>
  );
}

function ToolButton({
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

/** Main scrollable content area */
export function NclexSimContent({ children }: { children: ReactNode }) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-[800px] px-4 py-8 sm:px-8">{children}</div>
    </div>
  );
}

/** Bottom navigation bar: prev / next / confirm */
export function NclexSimNavBar({
  onPrev,
  onNext,
  onConfirm,
  canPrev,
  canNext,
  hasAnswer,
  committed,
  isFinal,
  onSubmit,
  saving,
}: {
  onPrev?: () => void;
  onNext?: () => void;
  onConfirm?: () => void;
  canPrev: boolean;
  canNext: boolean;
  hasAnswer: boolean;
  committed?: boolean;
  isFinal?: boolean;
  onSubmit?: () => void;
  saving?: boolean;
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
        {isFinal && onSubmit ? (
          <button
            type="button"
            onClick={onSubmit}
            disabled={saving}
            className="rounded-full px-6 py-2.5 text-[13px] font-bold shadow-sm transition-colors disabled:opacity-60"
            style={{
              background: "var(--semantic-brand)",
              color: "#fff",
            }}
          >
            {saving ? "Submitting…" : "Submit Exam"}
          </button>
        ) : onConfirm && !committed ? (
          <button
            type="button"
            onClick={onConfirm}
            disabled={!hasAnswer}
            className="rounded-full px-5 py-2.5 text-[13px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40"
            style={{
              background: hasAnswer
                ? "color-mix(in srgb, var(--semantic-brand) 12%, var(--semantic-surface))"
                : "transparent",
              color: hasAnswer ? "var(--semantic-brand)" : "var(--semantic-text-muted)",
              border: `1px solid ${hasAnswer ? "color-mix(in srgb, var(--semantic-brand) 25%, transparent)" : "var(--semantic-border-soft)"}`,
            }}
          >
            Confirm Answer
          </button>
        ) : null}

        <button
          type="button"
          onClick={onNext}
          disabled={!canNext}
          className="flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40"
          style={{
            background: "var(--semantic-brand)",
            color: "#fff",
          }}
        >
          Next <ChevronRight />
        </button>
      </div>
    </div>
  );
}

// ─── SVG icons (inline, theme-safe) ──────────────────────────────────────────

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
