"use client";

import type { DosagePracticeResult } from "@/lib/pre-nursing/dosage-practice-engine";

export type PreNursingDosagePracticeWorkflowProps = {
  title: string;
  description: string;
  result: DosagePracticeResult;
  conceptId?: string;
};

export function PreNursingDosagePracticeWorkflow({
  title,
  description,
  result,
  conceptId,
}: PreNursingDosagePracticeWorkflowProps) {
  return (
    <section
      className="my-8 rounded-[1.55rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)] sm:p-6"
      data-prenursing-dosage-practice-workflow=""
      data-concept-id={conceptId}
    >
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <p className="mb-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[var(--semantic-brand)]">
            Guided dosage practice
          </p>
          <h3 className="m-0 text-xl font-bold tracking-[-0.025em] text-[var(--theme-heading-text)] sm:text-2xl">
            {title}
          </h3>
          <p className="mt-2 text-sm leading-[1.7] text-[var(--semantic-text-secondary)]">
            {description}
          </p>
        </div>

        <div className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-success)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_7%,var(--semantic-surface))] px-4 py-3 text-right">
          <p className="m-0 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--semantic-success)]">
            Practice answer
          </p>
          <p className="m-0 text-2xl font-extrabold text-[var(--theme-heading-text)]">
            {result.displayAnswer}
          </p>
          <p className="m-0 text-xs text-[var(--semantic-text-muted)]">
            {result.unit}
          </p>
        </div>
      </div>

      <ol className="space-y-3">
        {result.steps.map((step, index) => (
          <li
            key={step.id}
            className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-muted)_12%,var(--semantic-surface))] p-4"
          >
            <div className="flex gap-3">
              <span
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-extrabold"
                style={{
                  background:
                    "color-mix(in srgb, var(--semantic-brand) 12%, var(--semantic-surface))",
                  color: "var(--semantic-brand)",
                }}
              >
                {index + 1}
              </span>
              <div className="min-w-0">
                <p className="m-0 text-sm font-bold text-[var(--theme-heading-text)]">
                  {step.label}
                </p>
                <p className="mt-1 rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-2 font-mono text-sm text-[var(--semantic-text-primary)]">
                  {step.value}
                </p>
                <p className="m-0 mt-2 text-sm leading-[1.65] text-[var(--semantic-text-secondary)]">
                  {step.explanation}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-5 rounded-xl border border-[color-mix(in_srgb,var(--semantic-info)_26%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_6%,var(--semantic-surface))] px-4 py-3">
        <p className="mb-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--semantic-info)]">
          Learning note
        </p>
        <p className="m-0 text-sm leading-[1.65] text-[var(--semantic-text-secondary)]">
          {result.learningNote}
        </p>
      </div>
    </section>
  );
}
