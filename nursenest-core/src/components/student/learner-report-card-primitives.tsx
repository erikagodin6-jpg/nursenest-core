import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { LearnerStatCard } from "@/components/learner-ui/learner-stat-card";
import { LearnerSurface } from "@/components/learner-ui/learner-surface";
import type { LearnerSurfaceTone } from "@/components/learner-ui/learner-surface-tone";

/**
 * Shared presentation for learner report card surfaces (account overview,
 * practice test / CAT results) — composes existing learner-ui surfaces and
 * dashboard stat tiles only.
 */

export type LearnerReportOutcomeTile = {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
  hint?: string;
  accent?: "c1" | "c2" | "c3" | "c4" | "c5";
};

const REPORT_STRIP_ACCENTS = ["c1", "c2", "c3", "c4"] as const;

export function LearnerReportOutcomeStatStrip({ tiles }: { tiles: LearnerReportOutcomeTile[] }) {
  if (tiles.length === 0) return null;
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
      {tiles.map((tile, i) => (
        <LearnerStatCard
          key={`${tile.label}-${i}`}
          icon={tile.icon}
          label={tile.label}
          value={tile.value}
          hint={tile.hint}
          accent={tile.accent ?? REPORT_STRIP_ACCENTS[i % 4]}
        />
      ))}
    </div>
  );
}

export function LearnerReportInset({ tone = "secondary", children }: { tone?: LearnerSurfaceTone; children: ReactNode }) {
  return (
    <LearnerSurface tone={tone} padding="md" radius="lg" shadow className="h-full border-[color-mix(in_srgb,var(--semantic-border-soft)_88%,transparent)]">
      {children}
    </LearnerSurface>
  );
}

export type PracticeSessionHeroBadge = { label: string; tone?: "brand" | "info" | "muted" };

/** Session header for practice test + CAT results (bookmarkable results route). */
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
    <LearnerSurface tone="primary" padding="lg" accentTop className="overflow-hidden shadow-[var(--semantic-shadow-soft)]">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
        <div className="min-w-0 max-w-2xl space-y-3">
          <p className="nn-ls-kicker">{eyebrow}</p>
          <h2 className="nn-ls-title text-balance">{title}</h2>
          <p className="nn-ls-intro text-pretty leading-relaxed">{subtitle}</p>
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
        <div className="w-full shrink-0 rounded-2xl border border-[color-mix(in_srgb,var(--semantic-brand)_14%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-surface)_92%,var(--semantic-panel-muted))] p-6 shadow-[var(--semantic-shadow-soft)] sm:min-w-[15rem] lg:max-w-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--semantic-text-secondary)]">{scoreLabel}</p>
          <p className="mt-2 text-3xl font-bold tabular-nums tracking-tight text-[var(--semantic-text-primary)]">{scorePrimary}</p>
          <p className="mt-2 text-sm font-semibold leading-snug text-[var(--semantic-chart-2)]">{scoreSecondary}</p>
        </div>
      </div>
      {footnote ? (
        <div className="mt-6 rounded-xl border border-[color-mix(in_srgb,var(--semantic-border-soft)_70%,transparent)] bg-[color-mix(in_srgb,var(--semantic-surface)_40%,transparent)] px-4 py-3 text-xs leading-relaxed text-[var(--semantic-text-muted)]">
          {footnote}
        </div>
      ) : null}
      <div className="mt-10 border-t border-[color-mix(in_srgb,var(--semantic-border-soft)_75%,transparent)] pt-8">
        <LearnerReportOutcomeStatStrip tiles={statTiles} />
      </div>
    </LearnerSurface>
  );
}
