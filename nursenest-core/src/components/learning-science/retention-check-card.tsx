"use client";

import { useMemo, useState } from "react";
import type { RetentionCheck } from "@/lib/learning-science/retention-system";

const CONFIDENCE_LEVELS = ["Low", "Medium", "High"] as const;

export function RetentionCheckCard({ check, index }: { check: RetentionCheck; index: number }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [confidence, setConfidence] = useState<(typeof CONFIDENCE_LEVELS)[number] | null>(null);

  const isCorrect = submitted && selected === check.correctAnswer;
  const shuffledOptions = useMemo(() => [...check.options], [check.options]);

  return (
    <section
      className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-info)_18%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_04%,var(--semantic-surface))] p-4 shadow-[var(--semantic-shadow-soft)]"
      aria-labelledby={`${check.id}-heading`}
      data-testid="retention-check-card"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wide text-[color-mix(in_srgb,var(--semantic-info)_88%,var(--semantic-text-primary))]">
            Check your understanding {index + 1}
          </p>
          <h3 id={`${check.id}-heading`} className="mt-1 text-base font-semibold text-[var(--semantic-text-primary)]">
            {check.prompt}
          </h3>
        </div>
        <span className="rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-2.5 py-1 text-[11px] font-semibold capitalize text-[var(--semantic-text-secondary)]">
          {check.kind.replaceAll("_", " ")}
        </span>
      </div>

      <div className="mt-4 grid gap-2" role="radiogroup" aria-label={check.prompt}>
        {shuffledOptions.map((option) => {
          const isSelected = selected === option;
          const isAnswer = submitted && option === check.correctAnswer;
          const isWrongSelection = submitted && isSelected && option !== check.correctAnswer;
          return (
            <button
              key={option}
              type="button"
              onClick={() => {
                if (!submitted) setSelected(option);
              }}
              className={`rounded-xl border px-3 py-2 text-left text-sm transition ${
                isAnswer
                  ? "border-[color-mix(in_srgb,var(--semantic-success)_55%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_10%,var(--semantic-surface))] text-[var(--semantic-text-primary)]"
                  : isWrongSelection
                    ? "border-[color-mix(in_srgb,var(--semantic-danger)_45%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-danger)_08%,var(--semantic-surface))] text-[var(--semantic-text-primary)]"
                    : isSelected
                      ? "border-[var(--semantic-info)] bg-[color-mix(in_srgb,var(--semantic-info)_08%,var(--semantic-surface))] text-[var(--semantic-text-primary)]"
                      : "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] text-[var(--semantic-text-secondary)] hover:border-[var(--semantic-info)] hover:text-[var(--semantic-text-primary)]"
              }`}
              aria-pressed={isSelected}
              disabled={submitted}
            >
              {option}
            </button>
          );
        })}
      </div>

      <div className="mt-4 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-3">
        <p className="text-xs font-semibold text-[var(--semantic-text-primary)]">
          {check.confidencePrompt ?? "How confident are you in your answer?"}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {CONFIDENCE_LEVELS.map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setConfidence(level)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                confidence === level
                  ? "border-[var(--semantic-info)] bg-[color-mix(in_srgb,var(--semantic-info)_10%,var(--semantic-surface))] text-[var(--semantic-text-primary)]"
                  : "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] text-[var(--semantic-text-secondary)]"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={!selected || submitted}
          onClick={() => setSubmitted(true)}
          className="rounded-full bg-[var(--role-cta)] px-4 py-2 text-sm font-semibold text-[var(--role-cta-foreground)] disabled:cursor-not-allowed disabled:opacity-45"
        >
          Submit answer
        </button>
        {submitted ? (
          <button
            type="button"
            onClick={() => {
              setSelected(null);
              setSubmitted(false);
              setConfidence(null);
            }}
            className="text-sm font-semibold text-[var(--semantic-brand)] underline-offset-2 hover:underline"
          >
            Try again
          </button>
        ) : null}
      </div>

      {submitted ? (
        <div
          className={`mt-4 rounded-xl border p-3 ${
            isCorrect
              ? "border-[color-mix(in_srgb,var(--semantic-success)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_08%,var(--semantic-surface))]"
              : "border-[color-mix(in_srgb,var(--semantic-warning)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_08%,var(--semantic-surface))]"
          }`}
        >
          <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">
            {isCorrect ? "Correct — now connect it to the patient." : "Not quite — repair the misconception now."}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{check.rationale}</p>
          <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
            Misconception targeted
          </p>
          <p className="mt-1 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{check.misconceptionTargeted}</p>
          {check.transferPrompt ? (
            <p className="mt-3 rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-3 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
              {check.transferPrompt}
            </p>
          ) : null}
          {confidence === "High" && !isCorrect ? (
            <p className="mt-3 rounded-lg border border-[color-mix(in_srgb,var(--semantic-danger)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-danger)_06%,var(--semantic-surface))] p-3 text-sm font-medium text-[var(--semantic-text-primary)]">
              High-confidence miss: this should be scheduled for priority review because it is an overconfidence error.
            </p>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
