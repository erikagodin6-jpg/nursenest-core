"use client";

import type { ReactNode } from "react";

export type PreNursingVisualLearningStep = {
  id: string;
  label: string;
  description: string;
};

export type PreNursingVisualLearningBlockProps = {
  eyebrow?: string;
  title: string;
  description: string;
  steps: readonly PreNursingVisualLearningStep[];
  children?: ReactNode;
  clinicalConnection?: string;
};

export function PreNursingVisualLearningBlock({
  eyebrow = "Visual learning",
  title,
  description,
  steps,
  children,
  clinicalConnection,
}: PreNursingVisualLearningBlockProps) {
  return (
    <section
      className="my-8 rounded-[1.55rem] border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_12%,var(--semantic-surface))] p-5 shadow-[var(--semantic-shadow-soft)] sm:p-6"
      data-prenursing-visual-learning-block=""
    >
      <div className="mb-5 max-w-3xl">
        <p className="mb-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[var(--semantic-brand)]">
          {eyebrow}
        </p>
        <h3 className="m-0 text-xl font-bold tracking-[-0.025em] text-[var(--theme-heading-text)] sm:text-2xl">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-[1.7] text-[var(--semantic-text-secondary)]">
          {description}
        </p>
      </div>

      {children ? (
        <div className="mb-5 rounded-[1.25rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
          {children}
        </div>
      ) : null}

      <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {steps.map((step, index) => (
          <li
            key={step.id}
            className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4"
          >
            <div className="mb-2 flex items-center gap-2">
              <span
                className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-extrabold"
                style={{
                  background:
                    "color-mix(in srgb, var(--semantic-brand) 12%, var(--semantic-surface))",
                  color: "var(--semantic-brand)",
                }}
              >
                {index + 1}
              </span>
              <p className="m-0 text-sm font-bold text-[var(--theme-heading-text)]">
                {step.label}
              </p>
            </div>
            <p className="m-0 text-xs leading-[1.65] text-[var(--semantic-text-secondary)]">
              {step.description}
            </p>
          </li>
        ))}
      </ol>

      {clinicalConnection ? (
        <div className="mt-5 rounded-xl border border-[color-mix(in_srgb,var(--semantic-info)_26%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_6%,var(--semantic-surface))] px-4 py-3">
          <p className="mb-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--semantic-info)]">
            Clinical connection
          </p>
          <p className="m-0 text-sm leading-[1.65] text-[var(--semantic-text-secondary)]">
            {clinicalConnection}
          </p>
        </div>
      ) : null}
    </section>
  );
}
