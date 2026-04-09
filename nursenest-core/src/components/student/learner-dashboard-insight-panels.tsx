import Link from "next/link";
import { Activity, BarChart3, Crosshair, Target } from "lucide-react";
import type { PremiumDashboardSnapshot } from "@/lib/learner/premium-dashboard-snapshot";
import { readinessBandLabel } from "@/lib/learner/readiness-score";
import type { LearnerMarketingT } from "@/lib/learner/learner-marketing-server";
import type { WeaknessTier } from "@/lib/insights/types";

const MAX_TOPIC_ROWS = 6;
const MAX_WEAK_ROWS = 5;
const MAX_FACTOR_ROWS = 4;

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
      <div className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2">
        <p className="text-xs font-medium text-foreground">{label}</p>
        <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
      </div>
    );
  }
  const pct = Math.round((points / maxPoints) * 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="font-medium text-foreground">{label}</span>
        <span className="tabular-nums text-muted-foreground">
          {points}/{maxPoints}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
        <div className="h-full rounded-full bg-role-success" style={{ width: `${pct}%` }} />
      </div>
      <p className="text-[11px] leading-snug text-muted-foreground">{detail}</p>
    </div>
  );
}

function tierClass(tier: WeaknessTier): string {
  switch (tier) {
    case "critical":
      return "border-role-danger-border bg-role-danger-soft text-role-danger-text";
    case "weak":
      return "border-role-warning-border bg-role-warning-soft text-role-warning-text";
    case "moderate":
      return "border-border bg-muted/30 text-foreground";
    case "strong":
      return "border-border/60 bg-muted/15 text-muted-foreground";
    default:
      return "border-border bg-muted/20 text-foreground";
  }
}

function weakTierLabel(tr: LearnerMarketingT, tier: WeaknessTier): string {
  switch (tier) {
    case "critical":
      return tr("learner.dashboard.insight.tier.critical");
    case "weak":
      return tr("learner.dashboard.insight.tier.weak");
    case "moderate":
      return tr("learner.dashboard.insight.tier.moderate");
    case "strong":
      return tr("learner.dashboard.insight.tier.strong");
    default:
      return tier;
  }
}

function riskLabel(tr: LearnerMarketingT, risk: "high" | "medium" | "low"): string {
  switch (risk) {
    case "high":
      return tr("learner.dashboard.insight.risk.high");
    case "medium":
      return tr("learner.dashboard.insight.risk.medium");
    case "low":
      return tr("learner.dashboard.insight.risk.low");
    default:
      return risk;
  }
}

export function LearnerDashboardInsightPanels({
  snapshot,
  t,
}: {
  snapshot: PremiumDashboardSnapshot;
  t: LearnerMarketingT;
}) {
  const { readiness, insights, recentMocks } = snapshot;
  const byTopic = insights?.performance.byTopic.slice(0, MAX_TOPIC_ROWS) ?? [];
  const weakAreas = insights?.weakAreas.slice(0, MAX_WEAK_ROWS) ?? [];
  const factors = readiness.factors.slice(0, MAX_FACTOR_ROWS);
  const trendLine = insights?.performance.trendSummary?.trim();

  const scorePct = readiness.score != null ? Math.min(100, Math.max(0, readiness.score)) : null;

  return (
    <section className="space-y-4" aria-label={t("learner.dashboard.insight.regionLabel")}>
      <div className="relative overflow-hidden rounded-2xl border border-role-premium-border bg-gradient-to-br from-role-premium-surface via-[var(--theme-card-bg)] to-primary/[0.07] p-5 shadow-sm sm:p-6">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-role-premium-glow blur-3xl" aria-hidden />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-role-premium-border bg-card/80 shadow-sm">
              <Target className="h-5 w-5 text-primary" aria-hidden />
            </div>
            <div className="min-w-0 space-y-1">
              <h2 className="text-lg font-semibold tracking-tight text-[var(--theme-heading-text)]">
                {t("learner.dashboard.insight.readinessTitle")}
              </h2>
              <p className="text-xs text-muted-foreground">{t("learner.dashboard.insight.readinessSubtitle")}</p>
              <p className="mt-2 inline-flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1 rounded-md bg-black/5 px-2 py-0.5 dark:bg-white/10">
                  {readinessBandLabel(readiness.band)}
                </span>
                {readiness.calibratedPreview ? (
                  <span className="text-xs font-medium text-role-warning">{t("learner.dashboard.insight.calibrated")}</span>
                ) : null}
              </p>
            </div>
          </div>
          <div className="shrink-0 text-right sm:pl-4">
            {scorePct != null ? (
              <p className="text-4xl font-bold tabular-nums tracking-tight text-primary sm:text-5xl">{scorePct}</p>
            ) : (
              <p className="max-w-[14rem] text-right text-sm text-muted-foreground">{t("learner.dashboard.insight.scorePending")}</p>
            )}
            {scorePct != null ? (
              <p className="text-xs font-medium text-muted-foreground">{t("learner.dashboard.insight.scoreSuffix")}</p>
            ) : null}
          </div>
        </div>

        <div className="relative mt-5 space-y-2">
          <div className="flex items-baseline justify-between gap-2 text-xs text-muted-foreground">
            <span>{t("learner.dashboard.insight.scoreMeterLabel")}</span>
            {scorePct != null ? <span className="tabular-nums">{scorePct}%</span> : null}
          </div>
          <div
            className="h-3 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10"
            role="progressbar"
            aria-valuenow={scorePct ?? 0}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary/90 to-role-success transition-[width] duration-500 ease-out"
              style={{ width: `${scorePct ?? 0}%` }}
            />
          </div>
        </div>

        {readiness.holdingBack.length > 0 ? (
          <p className="relative mt-4 text-sm text-foreground">
            <span className="font-medium">{t("learner.dashboard.insight.limiting")}: </span>
            {readiness.holdingBack.join(" · ")}
          </p>
        ) : null}

        <p className="relative mt-3 text-sm text-muted-foreground">{readiness.summary}</p>

        {factors.length > 0 ? (
          <div className="relative mt-5 border-t border-border/50 pt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t("learner.dashboard.insight.factorsTitle")}</p>
            <div className="mt-3 space-y-3">
              {factors.map((f) => (
                <InsightFactorBar key={f.id} label={f.label} points={f.points} maxPoints={f.maxPoints} detail={f.detail} />
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {trendLine ? (
        <p className="rounded-lg border border-border/60 bg-muted/15 px-4 py-3 text-sm text-foreground/90">
          <span className="font-medium text-foreground">{t("learner.dashboard.insight.trendLabel")} </span>
          {trendLine}
        </p>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="nn-card p-5">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" aria-hidden />
            <h3 className="text-base font-semibold text-[var(--theme-heading-text)]">{t("learner.dashboard.insight.categoryTitle")}</h3>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{t("learner.dashboard.insight.categoryHint")}</p>
          {byTopic.length > 0 ? (
            <ul className="mt-4 space-y-3">
              {byTopic.map((row) => {
                const acc =
                  row.accuracyPct != null
                    ? `${row.accuracyPct}%`
                    : row.weightedAccuracy != null
                      ? `${Math.round(row.weightedAccuracy * 100)}%`
                      : "—";
                return (
                  <li key={row.topic} className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border/40 pb-3 last:border-0 last:pb-0">
                    <span className="min-w-0 font-medium text-foreground">{row.topic}</span>
                    <span className="shrink-0 text-right text-sm tabular-nums text-muted-foreground">
                      <span className="text-foreground">{acc}</span>
                      <span className="ml-2 text-xs">
                        · {t("learner.dashboard.insight.topicAttempts", { n: row.attempted })}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">{t("learner.dashboard.insight.categoryEmpty")}</p>
          )}
        </div>

        <div className="nn-card p-5">
          <div className="flex items-center gap-2">
            <Crosshair className="h-4 w-4 text-role-warning-text" aria-hidden />
            <h3 className="text-base font-semibold text-[var(--theme-heading-text)]">{t("learner.dashboard.insight.weakTitle")}</h3>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{t("learner.dashboard.insight.weakHint")}</p>
          {weakAreas.length > 0 ? (
            <ul className="mt-4 space-y-3">
              {weakAreas.map((w) => (
                <li key={`${w.topic}-${w.tier}`} className="rounded-lg border border-border/50 bg-muted/10 px-3 py-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-medium text-foreground">{w.topic}</span>
                    <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${tierClass(w.tier)}`}>
                      {weakTierLabel(t, w.tier)}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{w.why}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">{riskLabel(t, w.risk)}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">{t("learner.dashboard.insight.weakEmpty")}</p>
          )}
        </div>
      </div>

      <div className="nn-card p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" aria-hidden />
            <div>
              <h3 className="text-base font-semibold text-[var(--theme-heading-text)]">{t("learner.dashboard.insight.recentTitle")}</h3>
              <p className="text-xs text-muted-foreground">{t("learner.dashboard.insight.recentHint")}</p>
            </div>
          </div>
          <Link
            href="/app/exams"
            className="shrink-0 text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            {t("learner.dashboard.insight.openMocksCta")}
          </Link>
        </div>
        {recentMocks.length > 0 ? (
          <ul className="mt-4 divide-y divide-border/60">
            {recentMocks.map((m) => (
              <li key={m.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm first:pt-0">
                <div className="min-w-0">
                  <p className="font-medium text-foreground">{m.examTitle}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(m.at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-3">
                  <span className="tabular-nums text-muted-foreground">
                    {m.pct}% ({m.score}/{m.total})
                  </span>
                  <Link
                    href={`/app/exams/attempts/${m.id}`}
                    className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
                  >
                    {t("learner.dashboard.insight.viewReport")}
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 rounded-lg border border-dashed border-border bg-muted/15 px-4 py-3 text-sm text-muted-foreground">
            {t("learner.dashboard.insight.recentEmpty")}
          </p>
        )}
      </div>
    </section>
  );
}
