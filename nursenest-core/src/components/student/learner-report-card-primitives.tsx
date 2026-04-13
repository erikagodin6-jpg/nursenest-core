import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { LearnerStatCard } from "@/components/learner-ui/learner-stat-card";
import { LearnerSurface } from "@/components/learner-ui/learner-surface";
import type { LearnerSurfaceTone } from "@/components/learner-ui/learner-surface-tone";
import { LearnerStudySurfaceSection } from "@/components/learner-ui/learner-study-surface-section";

/**
 * Shared layout + chrome for learner “report card” surfaces (account overview,
 * practice test / CAT results). Keeps percentile / cohort overlays as a single
 * composable hook without wiring data yet.
 */

export function LearnerReportCardSection({
  id,
  eyebrow,
  title,
  intro,
  tone,
  className = "",
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  intro?: string | null;
  tone: LearnerSurfaceTone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <LearnerStudySurfaceSection id={id} eyebrow={eyebrow} title={title} intro={intro ?? undefined} tone={tone} className={className}>
      {children}
    </LearnerStudySurfaceSection>
  );
}

/** Reserved horizontal band for future percentile / cohort overlays (benchmark service, etc.). */
export function LearnerReportPercentileSlot({
  eyebrow,
  title,
  body,
  className = "",
}: {
  eyebrow: string;
  title: string;
  body: string;
  className?: string;
}) {
  return (
    <div
      className={`nn-dash-section ${className}`.trim()}
      data-nn-report-percentile-slot=""
      aria-label={title}
    >
      <LearnerSurface tone="secondary" padding="md" radius="lg" shadow={false} className="border-dashed">
        <p className="nn-ls-kicker">{eyebrow}</p>
        <p className="mt-1 text-sm font-semibold text-[var(--semantic-text-primary)]">{title}</p>
        <p className="mt-1.5 max-w-2xl text-xs leading-relaxed text-[var(--semantic-text-muted)]">{body}</p>
      </LearnerSurface>
    </div>
  );
}

export type LearnerReportOutcomeTile = {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
  hint?: string;
  accent?: "c1" | "c2" | "c3" | "c4" | "c5";
};

export function LearnerReportOutcomeStatStrip({ tiles }: { tiles: LearnerReportOutcomeTile[] }) {
  if (tiles.length === 0) return null;
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {tiles.map((tile, i) => (
        <LearnerStatCard
          key={`${tile.label}-${i}`}
          icon={tile.icon}
          label={tile.label}
          value={tile.value}
          hint={tile.hint}
          accent={tile.accent ?? (["c1", "c2", "c3", "c4"][i % 4] as const)}
        />
      ))}
    </div>
  );
}

export function LearnerReportInset({ tone = "secondary", children }: { tone?: LearnerSurfaceTone; children: ReactNode }) {
  return (
    <LearnerSurface tone={tone} padding="md" radius="lg" shadow={false} className="h-full">
      {children}
    </LearnerSurface>
  );
}

export type PracticeSessionHeroBadge = { label: string; tone?: "brand" | "info" | "muted" };

/**
 * Premium session header for practice test + CAT results pages.
 */
export function PracticeSessionReportHero({
  eyebrow,
  title,
  subtitle,
  badges,
  scoreLabel,
  scorePrimary,
  scoreSecondary,
  footnote,
  statTiles,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  badges?: PracticeSessionHeroBadge[];
  scoreLabel: string;
  scorePrimary: ReactNode;
  scoreSecondary: ReactNode;
  footnote?: ReactNode;
  statTiles: LearnerReportOutcomeTile[];
}) {
  return (
    <LearnerSurface tone="primary" padding="lg" accentTop className="overflow-hidden">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 max-w-2xl space-y-2">
          <p className="nn-ls-kicker">{eyebrow}</p>
          <h2 className="nn-ls-title text-balance">{title}</h2>
          <p className="nn-ls-intro text-pretty">{subtitle}</p>
          {badges?.length ? (
            <div className="flex flex-wrap gap-2 pt-1">
              {badges.map((b) => {
                const cls =
                  b.tone === "info"
                    ? "border-[color-mix(in_srgb,var(--semantic-info)_30%,var(--semantic-border-soft))] bg-[var(--semantic-panel-cool)] text-[var(--semantic-info)]"
                    : b.tone === "brand"
                      ? "border-[color-mix(in_srgb,var(--semantic-brand)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--semantic-surface))] text-[var(--semantic-brand)]"
                      : "border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] text-[var(--semantic-text-muted)]";
                return (
                  <span key={b.label} className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${cls}`}>
                    {b.label}
                  </span>
                );
              })}
            </div>
          ) : null}
        </div>
        <div className="shrink-0 rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)] sm:min-w-[14rem]">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--semantic-text-secondary)]">{scoreLabel}</p>
          <p className="mt-1 text-3xl font-bold tabular-nums tracking-tight text-[var(--semantic-text-primary)]">{scorePrimary}</p>
          <p className="mt-1 text-sm font-semibold text-[var(--semantic-chart-2)]">{scoreSecondary}</p>
        </div>
      </div>
      {footnote ? <div className="mt-4 text-xs leading-relaxed text-[var(--semantic-text-muted)]">{footnote}</div> : null}
      <div className="mt-8 border-t border-[color-mix(in_srgb,var(--semantic-border-soft)_85%,transparent)] pt-6">
        <LearnerReportOutcomeStatStrip tiles={statTiles} />
      </div>
    </LearnerSurface>
  );
}
