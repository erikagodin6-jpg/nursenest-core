"use client";

export type ConfidenceLevel = "low" | "medium" | "high";

const PILLS: { level: ConfidenceLevel; label: string }[] = [
  { level: "low", label: "Low Confidence" },
  { level: "medium", label: "Medium Confidence" },
  { level: "high", label: "High Confidence" },
];

/**
 * Returns the CSS modifier class for a selected pill.
 *
 * Practice mode (neutral=false): maps to semantic color tints (warm/info/success).
 * CAT mode (neutral=true): maps to a single brand-tinted surface (spec §12).
 */
function selectedClass(level: ConfidenceLevel, neutral: boolean): string {
  if (neutral) return "nn-confidence-pill--selected-neutral";
  return `nn-confidence-pill--selected-${level}`;
}

// ── ConfidencePill ──────────────────────────────────────────────────────────

export function ConfidencePill({
  level,
  label,
  selected,
  neutral,
  onSelect,
}: {
  level: ConfidenceLevel;
  label: string;
  selected: boolean;
  neutral?: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      className={`nn-confidence-pill${selected ? ` ${selectedClass(level, Boolean(neutral))}` : ""}`}
      onClick={onSelect}
    >
      {label}
    </button>
  );
}

// ── ConfidenceSelector ──────────────────────────────────────────────────────

/**
 * ConfidenceSelector — 3-pill row shown directly below answer options.
 *
 * Practice mode: visually engaging (per-level semantic tints).
 * CAT mode (`neutral` prop): forced to neutral surfaces (spec §12).
 */
export function ConfidenceSelector({
  questionId,
  value,
  neutral,
  onChange,
}: {
  questionId: string;
  value: ConfidenceLevel | null;
  neutral?: boolean;
  onChange: (questionId: string, level: ConfidenceLevel) => void;
}) {
  return (
    <div
      className={`nn-confidence-selector${neutral ? " nn-confidence-selector--neutral" : ""}`}
    >
      <p className="nn-confidence-selector__label" id={`conf-label-${questionId}`}>
        How confident are you?
      </p>
      <div
        className="nn-confidence-pills"
        role="radiogroup"
        aria-labelledby={`conf-label-${questionId}`}
      >
        {PILLS.map(({ level, label }) => (
          <ConfidencePill
            key={level}
            level={level}
            label={label}
            selected={value === level}
            neutral={neutral}
            onSelect={() => onChange(questionId, level)}
          />
        ))}
      </div>
    </div>
  );
}

// ── ConfidenceChip ──────────────────────────────────────────────────────────

const LEVEL_LABELS: Record<ConfidenceLevel, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

/**
 * ConfidenceChip — compact inline label shown near an answer result in review.
 * Uses `surface-soft-b` tint with a subtle border (spec §10).
 */
export function ConfidenceChip({ level }: { level: ConfidenceLevel }) {
  return (
    <span className="nn-confidence-chip" aria-label={`Confidence: ${LEVEL_LABELS[level]}`}>
      Confidence: {LEVEL_LABELS[level]}
    </span>
  );
}
