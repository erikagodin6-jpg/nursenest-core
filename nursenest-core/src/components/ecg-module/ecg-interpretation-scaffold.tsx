"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  trackEcgScaffoldStarted,
  trackEcgScaffoldCompleted,
  trackEcgScaffoldSkipped,
  trackEcgScaffoldStepCompleted,
} from "@/lib/ecg-module/ecg-telemetry";

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
  revealedAnswers?: InterpretationScaffoldValues;
  onComplete?: (values: InterpretationScaffoldValues) => void;
  /** Called when learner explicitly skips the scaffold. */
  onSkip?: () => void;
  /** If true, the scaffold is in review mode (after answer submission) */
  reviewMode?: boolean;
  // Telemetry context — required in active mode, optional in reviewMode
  questionId?: string;
  rhythmTag?: string;
  level?: string;
  mode?: string;
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
  /**
   * Cognitive depth: "recognition" = learner selects from a list (lower cognition);
   * "measurement" = learner must actually count/measure before selecting (higher cognition).
   * Future: measurement steps should include interactive tools (caliper, counter).
   * Documented here for curriculum authoring decisions.
   */
  cognitiveDepth: "recognition" | "measurement";
  options: readonly string[];
  icon: string;
}[] = [
  {
    key: "rate",
    label: "1. Rate",
    hint: "Count QRS complexes in a 10-second strip × 6, or use the 300-rule (300 ÷ R-R large boxes) for regular rhythms.",
    cognitiveDepth: "measurement",
    options: RATE_OPTIONS,
    icon: "⏱",
  },
  {
    key: "regularity",
    label: "2. Rhythm Regularity",
    hint: "Walk calipers across R-R intervals. Equal spacing = regular. Increasing variation = irregular.",
    cognitiveDepth: "measurement",
    options: REGULARITY_OPTIONS,
    icon: "〰",
  },
  {
    key: "pWaves",
    label: "3. P Waves",
    hint: "Look in Lead II before each QRS. Are P waves present? Upright? One before every QRS?",
    cognitiveDepth: "recognition",
    options: P_WAVE_OPTIONS,
    icon: "𝑃",
  },
  {
    key: "prInterval",
    label: "4. PR Interval",
    hint: "Measure from the start of P to the start of QRS. Normal = 3–5 small boxes (0.12–0.20 s).",
    cognitiveDepth: "measurement",
    options: PR_OPTIONS,
    icon: "↔",
  },
  {
    key: "qrsWidth",
    label: "5. QRS Width",
    hint: "Measure QRS start to end. Normal ≤ 3 small boxes (< 0.12 s). Wide = > 3 boxes.",
    cognitiveDepth: "measurement",
    options: QRS_OPTIONS,
    icon: "▲",
  },
  {
    key: "stChanges",
    label: "6. ST / T Changes",
    hint: "Examine the segment after QRS. At baseline? Elevated? Depressed? T wave peaked or inverted?",
    cognitiveDepth: "recognition",
    options: ST_OPTIONS,
    icon: "～",
  },
];

function stepIsMatch(selected: string, revealed?: string): boolean | null {
  if (!revealed) return null;
  return selected.startsWith(revealed.split(" ")[0] ?? "");
}

export function EcgInterpretationScaffold({
  revealedAnswers,
  onComplete,
  onSkip,
  reviewMode = false,
  questionId,
  rhythmTag = "",
  level = "",
  mode = "",
}: Props) {
  const [open, setOpen] = useState(!reviewMode);
  const [values, setValues] = useState<Partial<InterpretationScaffoldValues>>({});
  const [submitted, setSubmitted] = useState(reviewMode);
  const startedAt = useRef<number | null>(null);
  const doneButtonRef = useRef<HTMLButtonElement>(null);

  const completed = STEPS.every((s) => Boolean(values[s.key]));
  const stepsFilledCount = STEPS.filter((s) => values[s.key]).length;
  const base = { rhythm_tag: rhythmTag, level, mode, question_id: questionId };

  // Fire scaffold_started once on mount (active mode only)
  useEffect(() => {
    if (reviewMode) return;
    startedAt.current = Date.now();
    trackEcgScaffoldStarted(base);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSelect(key: keyof InterpretationScaffoldValues, value: string, stepIndex: number) {
    if (submitted) return;
    const isNew = !values[key];
    setValues((prev) => ({ ...prev, [key]: value }));
    if (isNew) {
      trackEcgScaffoldStepCompleted(base, { stepKey: key, stepIndex });
    }
  }

  function handleSubmitScaffold() {
    if (!completed || submitted) return;
    const elapsed = startedAt.current ? Date.now() - startedAt.current : 0;
    setSubmitted(true);
    trackEcgScaffoldCompleted(base, { stepsCompleted: stepsFilledCount, timeOnScaffoldMs: elapsed });
    onComplete?.(values as InterpretationScaffoldValues);
  }

  function handleSkip() {
    trackEcgScaffoldSkipped(base, { stepsCompleted: stepsFilledCount });
    onSkip?.();
    onComplete?.({ rate: "", regularity: "", pWaves: "", prInterval: "", qrsWidth: "", stChanges: "" });
  }

  // When all steps are filled, move focus to Done button for keyboard users
  useEffect(() => {
    if (completed && !submitted && !reviewMode) {
      doneButtonRef.current?.focus();
    }
  }, [completed, submitted, reviewMode]);

  return (
    <div
      className="rounded-[1.25rem] border border-[color-mix(in_srgb,var(--semantic-info)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_30%,var(--semantic-surface))]"
      data-testid="ecg-interpretation-scaffold"
      data-review-mode={reviewMode ? "true" : "false"}
    >
      {/* Header toggle */}
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="ecg-scaffold-body"
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
        <div
          id="ecg-scaffold-body"
          className="border-t border-[color-mix(in_srgb,var(--semantic-info)_14%,var(--semantic-border-soft))] px-4 py-4 space-y-5"
        >
          {!reviewMode && !submitted ? (
            <p className="text-xs leading-relaxed text-[var(--semantic-text-secondary)]">
              Work through each step before selecting your answer. This trains the systematic habit that prevents misdiagnosis on NCLEX and at the bedside.
            </p>
          ) : reviewMode ? (
            <p className="text-xs leading-relaxed text-[var(--semantic-text-secondary)]">
              Compare your analysis with the clinical reference below. Check marks show where your interpretation aligned.
            </p>
          ) : null}

          {STEPS.map((step, idx) => {
            const selected = values[step.key] ?? "";
            const revealedVal = revealedAnswers?.[step.key];
            const isMatch = (submitted || reviewMode) && revealedVal ? stepIsMatch(selected, revealedVal) : null;

            return (
              <div key={step.key} className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-[var(--semantic-text-primary)]">
                    {step.icon} {step.label}
                  </span>
                  {/* Cognitive depth badge for instructors — hidden from learners via sr-only */}
                  <span className="sr-only">({step.cognitiveDepth} step)</span>
                  {(submitted || reviewMode) && revealedVal ? (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        isMatch
                          ? "bg-[color-mix(in_srgb,var(--semantic-success)_14%,var(--semantic-surface))] text-[var(--semantic-success)]"
                          : "bg-[color-mix(in_srgb,var(--semantic-danger)_14%,var(--semantic-surface))] text-[var(--semantic-danger)]"
                      }`}
                      aria-label={isMatch ? "Correct interpretation" : "Review needed"}
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
                        disabled={submitted || reviewMode}
                        onClick={() => handleSelect(step.key, opt, idx)}
                        className={`rounded-full border px-3 py-1 text-[11px] font-semibold motion-safe:transition ${
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
                {(submitted || reviewMode) && revealedVal && !isMatch ? (
                  <p className="text-[11px] leading-relaxed text-[var(--semantic-info)]" role="note">
                    Expected: <span className="font-semibold">{revealedVal}</span>
                  </p>
                ) : null}
              </div>
            );
          })}

          {!submitted && !reviewMode ? (
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                ref={doneButtonRef}
                type="button"
                disabled={!completed}
                onClick={handleSubmitScaffold}
                className="inline-flex min-h-9 items-center justify-center rounded-full bg-[var(--semantic-info)] px-5 text-xs font-semibold text-[var(--semantic-info-contrast,white)] disabled:opacity-40"
                aria-label={completed ? "Done — show the question" : `${stepsFilledCount} of ${STEPS.length} steps completed`}
              >
                {completed
                  ? "Done — show the question"
                  : `${stepsFilledCount}/${STEPS.length} steps completed`}
              </button>
              <button
                type="button"
                onClick={handleSkip}
                className="text-[11px] font-semibold text-[var(--semantic-text-muted)] underline-offset-2 hover:underline"
                aria-label="Skip 7-step analysis and go directly to the question"
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
