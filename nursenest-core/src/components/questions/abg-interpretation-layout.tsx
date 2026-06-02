"use client";

import { useState } from "react";
import { Activity, CheckCircle2, User } from "lucide-react";

/* ── Types ──────────────────────────────────────────────────────────────────── */

export type AbgValue = {
  param: "pH" | "PaCO2" | "PaO2" | "HCO3" | "SpO2" | string;
  value: number;
  unit: string;
  normalRange: string;
  /** "acidosis" | "alkalosis" | "normal" — drives colour */
  status: "acidosis" | "alkalosis" | "normal";
};

export type AbgStep = {
  id: string;
  title: string;
  options: Array<{ id: string; label: string }>;
  correctId: string;
  rationale?: string;
};

export type AbgQuestionProps = {
  questionStem: string;
  patientVignette?: string | null;
  values: AbgValue[];
  steps: AbgStep[];
  clinicalContext?: string | null;
  revealed?: boolean;
  onSubmit?: (answers: Record<string, string>) => void;
  answers?: Record<string, string>;
};

/* ── ABG value card ─────────────────────────────────────────────────────────── */

function AbgValueCard({ v }: { v: AbgValue }) {
  return (
    <div className={`nn-abg-value-card nn-abg-value-card--${v.status}`}>
      <span className="nn-abg-value-card__param">{v.param}</span>
      <span className="nn-abg-value-card__value">
        {v.value}
        <span className="text-sm font-normal ml-0.5 text-[var(--semantic-text-muted)]">{v.unit}</span>
      </span>
      <span className="nn-abg-value-card__range">Normal: {v.normalRange}</span>
    </div>
  );
}

/* ── Step card ──────────────────────────────────────────────────────────────── */

function AbgStepCard({
  step,
  stepNum,
  selected,
  revealed,
  onSelect,
}: {
  step: AbgStep;
  stepNum: number;
  selected: string | null;
  revealed: boolean;
  onSelect: (stepId: string, optId: string) => void;
}) {
  return (
    <div className="nn-abg-step-card">
      <span className="nn-abg-step-card__num">{stepNum}</span>
      <span className="nn-abg-step-card__title">{step.title}</span>
      <div className="flex flex-col gap-1.5 mt-2">
        {step.options.map((opt) => {
          const isPicked  = selected === opt.id;
          const isCorrect = revealed && opt.id === step.correctId;
          const isWrong   = revealed && isPicked && !isCorrect;
          return (
            <button
              key={opt.id}
              type="button"
              aria-pressed={isPicked}
              disabled={revealed}
              onClick={() => !revealed && onSelect(step.id, opt.id)}
              className={[
                "flex items-center gap-2 w-full min-h-[2.5rem] rounded-[0.6rem] border px-3 py-2 text-sm font-[600] text-left transition-colors",
                isPicked && !revealed
                  ? "border-[var(--semantic-brand)] bg-[color-mix(in_srgb,var(--semantic-brand)_9%,var(--semantic-surface))] text-[var(--semantic-text-primary)]"
                  : isCorrect
                    ? "border-[var(--semantic-success)] bg-[color-mix(in_srgb,var(--semantic-success)_9%,var(--semantic-surface))] text-[color-mix(in_srgb,var(--semantic-success)_65%,var(--semantic-text-primary))]"
                    : isWrong
                      ? "border-[var(--semantic-danger)] bg-[color-mix(in_srgb,var(--semantic-danger)_8%,var(--semantic-surface))] text-[color-mix(in_srgb,var(--semantic-danger)_65%,var(--semantic-text-primary))]"
                      : "border-[color-mix(in_srgb,var(--semantic-border-soft)_72%,transparent)] bg-[color-mix(in_srgb,var(--semantic-panel-muted)_20%,var(--semantic-surface))] text-[var(--semantic-text-secondary)]",
              ].join(" ")}
            >
              {/* Dot */}
              <span
                aria-hidden
                className={`inline-flex h-3.5 w-3.5 flex-shrink-0 rounded-full border-2 ${
                  isPicked && !revealed
                    ? "border-[var(--semantic-brand)] bg-[var(--semantic-brand)]"
                    : isCorrect
                      ? "border-[var(--semantic-success)] bg-[var(--semantic-success)]"
                      : isWrong
                        ? "border-[var(--semantic-danger)] bg-[var(--semantic-danger)]"
                        : "border-[color-mix(in_srgb,var(--semantic-border-soft)_72%,var(--semantic-text-muted))]"
                }`}
              />
              <span>{opt.label}</span>
              {isCorrect ? <CheckCircle2 className="ml-auto h-3.5 w-3.5 flex-shrink-0 text-[var(--semantic-success)]" aria-hidden /> : null}
            </button>
          );
        })}
      </div>
      {revealed && step.rationale ? (
        <p className="mt-2 text-xs leading-relaxed text-[var(--semantic-text-secondary)] border-t border-[var(--semantic-border-soft)] pt-2">
          {step.rationale}
        </p>
      ) : null}
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────────────────── */

export function AbgInterpretationLayout({
  questionStem,
  patientVignette,
  values,
  steps,
  clinicalContext,
  revealed = false,
  onSubmit,
  answers: controlledAnswers,
}: AbgQuestionProps) {
  const [internalAnswers, setInternalAnswers] = useState<Record<string, string>>({});
  const answers = controlledAnswers ?? internalAnswers;

  const allAnswered = steps.every((s) => answers[s.id]);

  const score = revealed
    ? steps.reduce((acc, s) => acc + (answers[s.id] === s.correctId ? 1 : 0), 0)
    : null;

  return (
    <div className="nn-abg-question flex flex-col gap-4">
      {/* Badge */}
      <div className="nn-aqt-badge">
        <div className="nn-aqt-badge__icon">
          <Activity className="h-4 w-4" aria-hidden />
        </div>
        <span className="nn-aqt-badge__label">ABG Interpretation</span>
      </div>

      {/* Stem */}
      <p className="text-lg font-bold leading-snug text-[var(--semantic-text-primary)]">{questionStem}</p>

      {/* Patient vignette */}
      {patientVignette ? (
        <div className="nn-aqt-patient-card">
          <div className="nn-aqt-patient-card__icon" aria-hidden><User className="h-3.5 w-3.5" /></div>
          <div>
            <span className="nn-aqt-patient-card__label">Patient</span>
            <p className="nn-aqt-patient-card__text">{patientVignette}</p>
          </div>
        </div>
      ) : null}

      {/* ABG values panel */}
      <div className="nn-abg-workspace">
        <div>
          <p className="text-xs font-[800] uppercase tracking-[0.1em] text-[var(--semantic-text-muted)] mb-2">
            ABG Results
          </p>
          <div className="nn-abg-values-panel">
            {values.map((v) => <AbgValueCard key={v.param} v={v} />)}
          </div>
        </div>

        {/* Clinical context */}
        {clinicalContext ? (
          <div className="rounded-[0.85rem] border border-[color-mix(in_srgb,var(--semantic-info,var(--semantic-brand))_20%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info,var(--semantic-brand))_5%,var(--semantic-surface))] p-3">
            <p className="text-xs font-[800] uppercase tracking-[0.1em] text-[color-mix(in_srgb,var(--semantic-info,var(--semantic-brand))_80%,var(--semantic-text-primary))] mb-1">
              Clinical Context
            </p>
            <p className="text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{clinicalContext}</p>
          </div>
        ) : null}

        {/* Interpretation steps */}
        <div>
          <p className="text-xs font-[800] uppercase tracking-[0.1em] text-[var(--semantic-text-muted)] mb-2">
            Systematic Interpretation
          </p>
          <div className="nn-abg-steps">
            {steps.map((step, idx) => (
              <AbgStepCard
                key={step.id}
                step={step}
                stepNum={idx + 1}
                selected={answers[step.id] ?? null}
                revealed={revealed}
                onSelect={(sid, oid) => {
                  if (!revealed) setInternalAnswers((prev) => ({ ...prev, [sid]: oid }));
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Score */}
      {score !== null ? (
        <div className={`nn-aqt-feedback-banner ${score === steps.length ? "nn-aqt-feedback-banner--success" : score >= steps.length / 2 ? "nn-aqt-feedback-banner--partial" : "nn-aqt-feedback-banner--error"}`}>
          <CheckCircle2 className="h-5 w-5 flex-shrink-0" aria-hidden />
          <span>
            {score === steps.length
              ? "Correct interpretation — all steps identified accurately."
              : `${score} of ${steps.length} steps correct. Review the highlighted answers.`}
          </span>
        </div>
      ) : null}

      {/* Submit */}
      {!revealed && allAnswered && onSubmit ? (
        <button
          type="button"
          className="inline-flex w-full min-h-[3rem] items-center justify-center gap-2 rounded-[0.8rem] border border-[color-mix(in_srgb,var(--semantic-brand)_48%,var(--semantic-border-soft))] bg-[var(--semantic-brand)] text-white text-sm font-[750] shadow-[0_6px_18px_-8px_color-mix(in_srgb,var(--semantic-brand)_48%,transparent)] transition-opacity hover:opacity-95"
          onClick={() => onSubmit(answers)}
        >
          Submit Interpretation
        </button>
      ) : null}
    </div>
  );
}
