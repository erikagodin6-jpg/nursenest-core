"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export type InterpretationScaffoldValues = {
  rate: string;
  regularity: string;
  pWaves: string;
  prInterval: string;
  qrsWidth: string;
  stChanges: string;
};

type Props = {
  /** Correct answers revealed after submission — shown as comparison */
  revealedAnswers?: {
    rate: string;
    regularity: string;
    pWaves: string;
    prInterval: string;
    qrsWidth: string;
    stChanges: string;
  };
  onComplete?: (values: InterpretationScaffoldValues) => void;
  /** If true, the scaffold is in review mode (after answer submission) */
  reviewMode?: boolean;
};

const RATE_OPTIONS = [
  "< 60 bpm (bradycardia)",
  "60–100 bpm (normal)",
  "> 100 bpm (tachycardia)",
  "Indeterminate / no organized rate",
] as const;

const REGULARITY_OPTIONS = [
  "Regular",
  "Regularly irregular (group beating)",
  "Irregularly irregular",
  "Indeterminate",
] as const;

const P_WAVE_OPTIONS = [
  "Upright in II, one before each QRS",
  "Absent / not identifiable",
  "Inverted / retrograde",
  "Flutter waves (saw-tooth, 250–350/min)",
  "Multiple morphologies",
  "Dissociated from QRS",
] as const;

const PR_OPTIONS = [
  "Normal (0.12–0.20 s)",
  "Prolonged (> 0.20 s)",
  "Short (< 0.12 s)",
  "Progressive lengthening",
  "Variable / not measurable",
] as const;

const QRS_OPTIONS = [
  "Narrow (< 0.12 s)",
  "Wide (≥ 0.12 s) — bundle branch pattern",
  "Wide (≥ 0.12 s) — bizarre / non-bundle branch",
  "No discrete QRS",
] as const;

const ST_OPTIONS = [
  "No ST changes",
  "ST elevation",
  "ST depression",
  "Peaked / tall T waves",
  "T wave inversion",
  "Cannot assess",
] as const;

const STEPS: {
  key: keyof InterpretationScaffoldValues;
  label: string;
  hint: string;
  options: readonly string[];
  icon: string;
}[] = [
  {
    key: "rate",
    label: "1. Rate",
    hint: "Count the QRS complexes in a 10-second strip and multiply by 6, or use the 300-rule for regular rhythms.",
    options: RATE_OPTIONS,
    icon: "⏱",
  },
  {
    key: "regularity",
    label: "2. Rhythm Regularity",
    hint: "Walk your calipers across R-R intervals. Are the QRS complexes evenly spaced?",
    options: REGULARITY_OPTIONS,
    icon: "〰",
  },
  {
    key: "pWaves",
    label: "3. P Waves",
    hint: "Look in Lead II for a rounded, upright deflection before each QRS. Are there P waves? What do they look like?",
    options: P_WAVE_OPTIONS,
    icon: "𝑃",
  },
  {
    key: "prInterval",
    label: "4. PR Interval",
    hint: "Measure from the start of the P wave to the start of the QRS. Normal = 3–5 small boxes (0.12–0.20 s).",
    options: PR_OPTIONS,
    icon: "↔",
  },
  {
    key: "qrsWidth",
    label: "5. QRS Width",
    hint: "Measure the QRS complex width. Normal = ≤ 3 small boxes (< 0.12 s). Wide = > 3 boxes.",
    options: QRS_OPTIONS,
    icon: "▲",
  },
  {
    key: "stChanges",
    label: "6. ST / T Changes",
    hint: "Look at the segment after the QRS. Is it at the baseline? Elevated? Depressed? What do the T waves look like?",
    options: ST_OPTIONS,
    icon: "～",
  },
];

function stepIsMatch(selected: string, revealed?: string): boolean | null {
  if (!revealed) return null;
  return selected.startsWith(revealed.split(" ")[0] ?? "");
}

export function EcgInterpretationScaffold({ revealedAnswers, onComplete, reviewMode = false }: Props) {
  const [open, setOpen] = useState(!reviewMode);
  const [values, setValues] = useState<Partial<InterpretationScaffoldValues>>({});
  const [submitted, setSubmitted] = useState(reviewMode);

  const completed = STEPS.every((s) => Boolean(values[s.key]));

  function handleSelect(key: keyof InterpretationScaffoldValues, value: string) {
    if (submitted) return;
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmitScaffold() {
    if (!completed || submitted) return;
    setSubmitted(true);
    onComplete?.(values as InterpretationScaffoldValues);
  }

  function handleSkip() {
    onComplete?.({
      rate: "",
      regularity: "",
      pWaves: "",
      prInterval: "",
      qrsWidth: "",
      stChanges: "",
    });
  }

  return (
    <div
      className="rounded-[1.25rem] border border-[color-mix(in_srgb,var(--semantic-info)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_30%,var(--semantic-surface))]"
      data-testid="ecg-interpretation-scaffold"
    >
      {/* Header */}
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wide text-[color-mix(in_srgb,var(--semantic-info)_85%,var(--semantic-text-primary))]">
            {reviewMode ? "Interpretation Review" : "Analyze this strip first"}
          </span>
          {!reviewMode && !submitted && (
            <span className="rounded-full bg-[color-mix(in_srgb,var(--semantic-info)_15%,var(--semantic-surface))] px-2 py-0.5 text-[10px] font-semibold text-[var(--semantic-info)]">
              7-Step Method
            </span>
          )}
          {submitted && !reviewMode && (
            <span className="rounded-full bg-[color-mix(in_srgb,var(--semantic-success)_15%,var(--semantic-surface))] px-2 py-0.5 text-[10px] font-semibold text-[var(--semantic-success)]">
              Completed
            </span>
          )}
        </div>
        {open ? (
          <ChevronUp className="h-4 w-4 shrink-0 text-[var(--semantic-text-muted)]" aria-hidden />
        ) : (
          <ChevronDown className="h-4 w-4 shrink-0 text-[var(--semantic-text-muted)]" aria-hidden />
        )}
      </button>

      {open ? (
        <div className="border-t border-[color-mix(in_srgb,var(--semantic-info)_14%,var(--semantic-border-soft))] px-4 py-4 space-y-5">
          <p className="text-xs leading-relaxed text-[var(--semantic-text-secondary)]">
            Work through each step before selecting your answer. This builds the systematic habit that prevents misdiagnosis.
          </p>

          {STEPS.map((step) => {
            const selected = values[step.key] ?? "";
            const revealedVal = revealedAnswers?.[step.key];
            const isMatch = submitted && revealedVal ? stepIsMatch(selected, revealedVal) : null;

            return (
              <div key={step.key} className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-[var(--semantic-text-primary)]">
                    {step.icon} {step.label}
                  </span>
                  {submitted && revealedVal ? (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        isMatch
                          ? "bg-[color-mix(in_srgb,var(--semantic-success)_14%,var(--semantic-surface))] text-[var(--semantic-success)]"
                          : "bg-[color-mix(in_srgb,var(--semantic-danger)_14%,var(--semantic-surface))] text-[var(--semantic-danger)]"
                      }`}
                    >
                      {isMatch ? "✓ On track" : "Review below"}
                    </span>
                  ) : null}
                </div>
                <p className="text-[11px] leading-relaxed text-[var(--semantic-text-muted)]">{step.hint}</p>
                <div className="flex flex-wrap gap-1.5" role="group" aria-label={`Options for ${step.label}`}>
                  {step.options.map((opt) => {
                    const isSelected = selected === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        disabled={submitted}
                        onClick={() => handleSelect(step.key, opt)}
                        className={`rounded-full border px-3 py-1 text-[11px] font-semibold transition ${
                          isSelected
                            ? "border-[color-mix(in_srgb,var(--semantic-brand)_40%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_12%,var(--semantic-surface))] text-[var(--semantic-text-primary)]"
                            : "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] text-[var(--semantic-text-secondary)] hover:bg-[var(--semantic-panel-muted)] disabled:opacity-60"
                        }`}
                        aria-pressed={isSelected}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {submitted && revealedVal && !isMatch ? (
                  <p className="text-[11px] leading-relaxed text-[var(--semantic-info)]">
                    Expected: <span className="font-semibold">{revealedVal}</span>
                  </p>
                ) : null}
              </div>
            );
          })}

          {!submitted ? (
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                disabled={!completed}
                onClick={handleSubmitScaffold}
                className="inline-flex min-h-9 items-center justify-center rounded-full bg-[var(--semantic-info)] px-5 text-xs font-semibold text-[var(--semantic-info-contrast,white)] disabled:opacity-40"
              >
                {completed ? "Done — show the question" : `${STEPS.filter((s) => values[s.key]).length}/${STEPS.length} steps completed`}
              </button>
              <button
                type="button"
                onClick={handleSkip}
                className="text-[11px] font-semibold text-[var(--semantic-text-muted)] underline-offset-2 hover:underline"
              >
                Skip analysis
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
