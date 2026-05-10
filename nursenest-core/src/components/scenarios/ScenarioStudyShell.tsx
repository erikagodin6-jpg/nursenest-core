import type { ReactNode } from "react";

/**
 * Learner-facing shell for clinical scenarios / OSCE prep — Ocean structural parity, theme tokens only.
 */
export function ScenarioStudyShell({
  eyebrow,
  title,
  subtitle,
  pathwayId,
  children,
  /** Set on `/app/clinical-scenarios` for visual QA & screenshots. */
  qaHubMarker = false,
  /** Active unfolding scenario detail — evolving vitals / decision tree QA. */
  activeScenarioMarker = false,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  pathwayId: string | null;
  children: ReactNode;
  qaHubMarker?: boolean;
  activeScenarioMarker?: boolean;
}) {
  return (
    <div
      className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:gap-10 sm:py-10"
      data-nn-scenario-study-shell=""
      data-nn-premium-full-platform-convergence=""
      data-nn-premium-platform-family="clinical"
      data-nn-premium-platform-module={activeScenarioMarker ? "clinical-scenario-detail" : "clinical-scenarios"}
      {...(qaHubMarker ? { "data-nn-clinical-scenarios-hub": "" as const } : {})}
      {...(activeScenarioMarker ? { "data-nn-active-clinical-scenario": "" as const } : {})}
    >
      <header className="relative overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--semantic-chart-2)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_18%,var(--semantic-surface))] p-6 shadow-[var(--semantic-shadow-soft)] sm:p-8">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,color-mix(in_srgb,var(--semantic-chart-2)_72%,transparent),color-mix(in_srgb,var(--semantic-info)_55%,transparent),color-mix(in_srgb,var(--semantic-chart-4)_45%,transparent))]"
          aria-hidden
        />
        <div className="relative space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[color-mix(in_srgb,var(--semantic-chart-2)_88%,var(--semantic-text-primary))]">
            {eyebrow}
          </p>
          <h1 className="text-balance text-2xl font-semibold tracking-tight text-[var(--semantic-text-primary)] sm:text-3xl">
            {title}
          </h1>
          <p className="max-w-3xl text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{subtitle}</p>
          {pathwayId ? (
            <p className="text-xs text-[var(--semantic-text-muted)]">
              Pathway:{" "}
              <span className="font-mono text-[var(--semantic-text-primary)] tabular-nums">{pathwayId}</span>
            </p>
          ) : (
            <p className="text-xs text-[var(--semantic-warning)]">
              Add pathwayId to the URL to align categories with your track.
            </p>
          )}
        </div>
      </header>

      <div className="flex flex-col gap-6 sm:gap-8">{children}</div>
    </div>
  );
}
