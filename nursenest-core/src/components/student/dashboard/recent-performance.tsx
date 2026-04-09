import { TrendingUp } from "lucide-react";
import type { LearnerMarketingT } from "@/lib/learner/learner-marketing-server";

export function RecentPerformance({
  trendSummary,
  practiceAccuracyPct,
  practiceGradedLine,
  t,
}: {
  trendSummary: string | null | undefined;
  practiceAccuracyPct: number | null;
  practiceGradedLine: string;
  t: LearnerMarketingT;
}) {
  const hasTrend = Boolean(trendSummary?.trim());

  return (
    <section className="nn-card nn-student-card-lift border-[color-mix(in_srgb,var(--semantic-info)_22%,var(--semantic-border-soft))] bg-gradient-to-br from-[color-mix(in_srgb,var(--semantic-info)_08%,var(--semantic-surface))] to-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)] sm:p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--semantic-info)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_10%,var(--semantic-surface))]">
          <TrendingUp className="h-5 w-5 text-[var(--semantic-info)]" aria-hidden strokeWidth={2} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-[var(--semantic-text-primary)]">{t("learner.dashboard.recentPerformance.title")}</h3>
          <p className="mt-1 text-xs text-[var(--semantic-text-secondary)]">{t("learner.dashboard.recentPerformance.subtitle")}</p>
          {practiceAccuracyPct != null ? (
            <p className="mt-3 text-sm text-[var(--semantic-text-primary)]">
              <span className="font-semibold text-[var(--semantic-info)]">{practiceAccuracyPct}%</span>{" "}
              <span className="text-[var(--semantic-text-secondary)]">{practiceGradedLine}</span>
            </p>
          ) : (
            <p className="mt-3 text-sm text-[var(--semantic-text-secondary)]">{t("learner.dashboard.recentPerformance.noAccuracy")}</p>
          )}
          {hasTrend ? (
            <p className="mt-4 rounded-xl border border-[color-mix(in_srgb,var(--semantic-info)_20%,var(--semantic-border-soft))] bg-[var(--semantic-info-soft)] px-4 py-3 text-sm leading-relaxed text-[var(--semantic-info-contrast)]">
              <span className="font-semibold">{t("learner.dashboard.insight.trendLabel")} </span>
              {trendSummary!.trim()}
            </p>
          ) : (
            <p className="mt-4 text-sm text-[var(--semantic-text-muted)]">{t("learner.dashboard.recentPerformance.noTrend")}</p>
          )}
        </div>
      </div>
    </section>
  );
}
