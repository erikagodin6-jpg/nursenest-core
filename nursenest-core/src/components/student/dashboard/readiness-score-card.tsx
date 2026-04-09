import { Target } from "lucide-react";
import type { ReadinessResult } from "@/lib/learner/readiness-score";
import { readinessBandLabel } from "@/lib/learner/readiness-score";
import type { LearnerMarketingT } from "@/lib/learner/learner-marketing-server";
import { ProgressBarSemantic } from "@/components/student/product/progress-bar-semantic";

function InsightFactorBar({
  label,
  points,
  maxPoints,
  detail,
}: {
  label: string;
  points: number;
  maxPoints: number;
  detail: string;
}) {
  if (maxPoints <= 0) {
    return (
      <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-3 py-2">
        <p className="text-xs font-medium text-[var(--semantic-text-primary)]">{label}</p>
        <p className="mt-1 text-xs text-[var(--semantic-text-secondary)]">{detail}</p>
      </div>
    );
  }
  return (
    <ProgressBarSemantic
      value={points}
      max={maxPoints}
      variant="info"
      size="sm"
      label={label}
      hint={`${points}/${maxPoints}`}
      footer={<p className="text-[11px] leading-snug text-[var(--semantic-text-secondary)]">{detail}</p>}
    />
  );
}

/**
 * Primary KPI — overall exam readiness (brand-forward meter, calm premium shell).
 */
export function ReadinessScoreCard({
  readiness,
  t,
  maxFactors = 4,
}: {
  readiness: ReadinessResult;
  t: LearnerMarketingT;
  maxFactors?: number;
}) {
  const scorePct = readiness.score != null ? Math.min(100, Math.max(0, readiness.score)) : null;
  const factors = readiness.factors.slice(0, maxFactors);

  return (
    <article className="nn-student-card-lift relative overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--semantic-brand)_26%,var(--semantic-border-soft))] bg-gradient-to-br from-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--semantic-surface))] via-[var(--semantic-surface)] to-[color-mix(in_srgb,var(--semantic-info)_7%,var(--semantic-surface))] p-5 shadow-[var(--semantic-shadow-soft)] sm:p-6">
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--semantic-brand)_16%,transparent),transparent_62%)] blur-2xl" aria-hidden />
      <div className="relative flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 flex-1 items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[color-mix(in_srgb,var(--semantic-brand)_32%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_12%,var(--semantic-surface))] shadow-sm">
            <Target className="h-6 w-6 text-[var(--semantic-brand)]" aria-hidden strokeWidth={2} />
          </div>
          <div className="min-w-0 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-brand)]">{t("learner.dashboard.readinessCard.kicker")}</p>
            <h2 className="text-xl font-semibold tracking-tight text-[var(--semantic-text-primary)]">{t("learner.dashboard.insight.readinessTitle")}</h2>
            <p className="text-sm text-[var(--semantic-text-secondary)]">{t("learner.dashboard.insight.readinessSubtitle")}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="inline-flex rounded-full border border-[color-mix(in_srgb,var(--semantic-brand)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_12%,var(--semantic-surface))] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--semantic-brand)]">
                {readinessBandLabel(readiness.band)}
              </span>
              {readiness.calibratedPreview ? (
                <span className="nn-badge-semantic-warning px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide">{t("learner.dashboard.insight.calibrated")}</span>
              ) : null}
            </div>
          </div>
        </div>
        <div className="shrink-0 text-left lg:text-right">
          {scorePct != null ? (
            <p className="nn-score-reveal bg-gradient-to-br from-[var(--semantic-info)] via-[var(--semantic-brand)] to-[var(--semantic-success)] bg-clip-text text-5xl font-bold tabular-nums leading-none tracking-tight text-transparent sm:text-6xl">
              {scorePct}
            </p>
          ) : (
            <p className="max-w-[16rem] text-sm text-[var(--semantic-text-secondary)] lg:ml-auto lg:text-right">{t("learner.dashboard.insight.scorePending")}</p>
          )}
          {scorePct != null ? <p className="mt-1 text-xs font-medium text-[var(--semantic-text-secondary)]">{t("learner.dashboard.insight.scoreSuffix")}</p> : null}
        </div>
      </div>

      <div className="relative mt-6 space-y-2">
        <div className="flex items-baseline justify-between gap-2 text-xs text-[var(--semantic-text-secondary)]">
          <span className="font-medium">{t("learner.dashboard.insight.scoreMeterLabel")}</span>
          {scorePct != null ? <span className="tabular-nums text-[var(--semantic-text-primary)]">{scorePct}%</span> : null}
        </div>
          <div
            className="nn-progress-track-semantic nn-progress-track-semantic--lg"
            role="progressbar"
            aria-valuenow={scorePct ?? 0}
            aria-valuemin={0}
            aria-valuemax={100}
          >
          <div
            className="h-full rounded-full nn-progress-fill-semantic-readiness nn-progress-fill-reveal transition-[width] duration-700 ease-out"
            style={{ width: `${scorePct ?? 0}%` }}
          />
        </div>
      </div>

      {readiness.holdingBack.length > 0 ? (
        <p className="relative mt-4 rounded-xl border border-[color-mix(in_srgb,var(--semantic-warning)_28%,var(--semantic-border-soft))] bg-[var(--semantic-warning-soft)] px-4 py-3 text-sm text-[var(--semantic-warning-contrast)]">
          <span className="font-semibold">{t("learner.dashboard.insight.limiting")}: </span>
          {readiness.holdingBack.join(" · ")}
        </p>
      ) : null}

      <p className="relative mt-4 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{readiness.summary}</p>

      {factors.length > 0 ? (
        <div className="relative mt-6 border-t border-[color-mix(in_srgb,var(--semantic-border-soft)_85%,transparent)] pt-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-info)]">{t("learner.dashboard.insight.factorsTitle")}</p>
          <div className="mt-4 space-y-4">
            {factors.map((f) => (
              <InsightFactorBar key={f.id} label={f.label} points={f.points} maxPoints={f.maxPoints} detail={f.detail} />
            ))}
          </div>
        </div>
      ) : null}
    </article>
  );
}
