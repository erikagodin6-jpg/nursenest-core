"use client";

import { CheckCircle2, CircleDashed, LockKeyhole, PlayCircle } from "lucide-react";

export type LoftSimulationSectionState = "complete" | "current" | "available" | "locked";

export type LoftSimulationSectionProgressItem = {
  id: string;
  title: string;
  description?: string | null;
  answeredCount: number;
  totalCount: number;
  state: LoftSimulationSectionState;
};

function SectionIcon({ state }: { state: LoftSimulationSectionState }) {
  if (state === "complete") return <CheckCircle2 className="h-4 w-4" aria-hidden />;
  if (state === "current") return <PlayCircle className="h-4 w-4" aria-hidden />;
  if (state === "locked") return <LockKeyhole className="h-4 w-4" aria-hidden />;
  return <CircleDashed className="h-4 w-4" aria-hidden />;
}

export function LoftSimulationSectionProgress({
  sections,
  onSelectSection,
}: {
  sections: LoftSimulationSectionProgressItem[];
  onSelectSection?: (sectionId: string) => void;
}) {
  const totalAnswered = sections.reduce((sum, section) => sum + section.answeredCount, 0);
  const totalQuestions = sections.reduce((sum, section) => sum + section.totalCount, 0);
  const overallPct = totalQuestions > 0 ? Math.round((totalAnswered / totalQuestions) * 100) : 0;

  return (
    <section
      className="nn-loft-section-progress rounded-2xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-surface)_95%,var(--semantic-panel-muted))] p-4 shadow-sm"
      data-nn-loft-section-progress=""
      aria-label="LOFT simulation section progress"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="m-0 text-xs font-bold uppercase tracking-[0.18em] text-[var(--semantic-text-muted)]">
            Section progress
          </p>
          <h2 className="mt-1 text-base font-semibold text-[var(--semantic-text-primary)]">
            Linear simulation roadmap
          </h2>
        </div>
        <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-2 text-right">
          <p className="m-0 text-xs text-[var(--semantic-text-muted)]">Complete</p>
          <p className="m-0 text-lg font-bold tabular-nums text-[var(--semantic-text-primary)]">
            {overallPct}%
          </p>
        </div>
      </div>

      <div
        className="mt-4 h-2 overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--semantic-panel-muted)_72%,var(--semantic-surface))]"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={overallPct}
        aria-label={`Overall simulation progress ${overallPct} percent`}
      >
        <div
          className="h-full rounded-full bg-[color-mix(in_srgb,var(--semantic-brand)_72%,var(--semantic-info))] transition-[width] duration-300 motion-reduce:transition-none"
          style={{ width: `${overallPct}%` }}
        />
      </div>

      <div className="mt-4 grid gap-2">
        {sections.map((section) => {
          const sectionPct = section.totalCount > 0 ? Math.round((section.answeredCount / section.totalCount) * 100) : 0;
          const disabled = section.state === "locked";
          return (
            <button
              key={section.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelectSection?.(section.id)}
              className={`group flex w-full items-start gap-3 rounded-xl border px-3 py-3 text-left transition disabled:cursor-not-allowed disabled:opacity-55 ${
                section.state === "current"
                  ? "border-[color-mix(in_srgb,var(--semantic-brand)_55%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--semantic-surface))]"
                  : section.state === "complete"
                    ? "border-[color-mix(in_srgb,var(--semantic-success)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_7%,var(--semantic-surface))]"
                    : "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] hover:border-[color-mix(in_srgb,var(--semantic-brand)_32%,var(--semantic-border-soft))]"
              }`}
            >
              <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] text-[var(--semantic-text-secondary)]">
                <SectionIcon state={section.state} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-[var(--semantic-text-primary)]">
                  {section.title}
                </span>
                {section.description ? (
                  <span className="mt-0.5 block text-xs text-[var(--semantic-text-muted)]">
                    {section.description}
                  </span>
                ) : null}
                <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--semantic-panel-muted)_70%,var(--semantic-surface))]">
                  <span
                    className="block h-full rounded-full bg-[color-mix(in_srgb,var(--semantic-brand)_65%,var(--semantic-info))]"
                    style={{ width: `${sectionPct}%` }}
                  />
                </span>
              </span>
              <span className="shrink-0 text-xs font-semibold tabular-nums text-[var(--semantic-text-muted)]">
                {section.answeredCount}/{section.totalCount}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
