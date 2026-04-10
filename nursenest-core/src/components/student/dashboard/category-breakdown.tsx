import Link from "next/link";
import { BarChart3 } from "lucide-react";
import type { TopicAccuracyRow } from "@/lib/insights/types";
import type { LearnerMarketingT } from "@/lib/learner/learner-marketing-server";
import type { TopicTrendRow } from "@/lib/learner/topic-performance";
import { semanticFillClassForAccuracyPct } from "@/lib/ui/semantic-progress-fill";

function bandPillClass(acc: number | null): string {
  if (acc == null)
    return "border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] text-[var(--semantic-text-secondary)]";
  if (acc >= 80) return "nn-badge-semantic-success";
  if (acc >= 65) return "nn-badge-semantic-info";
  if (acc >= 50) return "nn-badge-semantic-warning";
  return "border-[color-mix(in_srgb,var(--semantic-danger)_32%,var(--semantic-border-soft))] bg-[var(--semantic-danger-soft)] text-[var(--semantic-danger-contrast)]";
}

function bandLabel(t: LearnerMarketingT, acc: number | null): string {
  if (acc == null) return t("learner.dashboard.categoryBand.na");
  if (acc >= 80) return t("learner.dashboard.categoryBand.strong");
  if (acc >= 65) return t("learner.dashboard.categoryBand.progress");
  if (acc >= 50) return t("learner.dashboard.categoryBand.developing");
  return t("learner.dashboard.categoryBand.focus");
}

function numericAccuracy(row: TopicAccuracyRow): number | null {
  if (row.accuracyPct != null) return row.accuracyPct;
  if (row.weightedAccuracy != null) return Math.round(row.weightedAccuracy * 100);
  if (row.attempted > 0) return Math.round((row.correct / row.attempted) * 100);
  return null;
}

function momentumShortLabel(t: LearnerMarketingT, tr: TopicTrendRow): string {
  if (tr.momentum === "improving") return t("learner.dashboard.categoryBreakdown.momentumImproving");
  if (tr.momentum === "declining") return t("learner.dashboard.categoryBreakdown.momentumDeclining");
  return t("learner.dashboard.categoryBreakdown.momentumStable");
}

export function CategoryBreakdown({
  rows,
  t,
  maxRows = 8,
  topicTrends = [],
}: {
  rows: TopicAccuracyRow[];
  t: LearnerMarketingT;
  maxRows?: number;
  /** Optional topic momentum from the insight engine (matched by topic name). */
  topicTrends?: TopicTrendRow[];
}) {
  const slice = rows.slice(0, maxRows);
  const trendByTopic = new Map(topicTrends.map((x) => [x.topic, x]));

  return (
    <section className="nn-card nn-product-surface-accent nn-student-card-lift relative overflow-hidden border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] pt-7 shadow-[var(--semantic-shadow-soft)]">
      <div className="px-5 pb-5 sm:px-6 sm:pb-6">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--semantic-success)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_10%,var(--semantic-surface))]">
            <BarChart3 className="h-4 w-4 text-[var(--semantic-success)]" aria-hidden strokeWidth={2} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-[var(--semantic-text-primary)]">{t("learner.dashboard.insight.categoryTitle")}</h3>
            <p className="text-xs text-[var(--semantic-text-secondary)]">{t("learner.dashboard.categoryBreakdown.hint")}</p>
          </div>
        </div>

        {slice.length > 0 ? (
          <ul className="nn-panel-chart-fade mt-5 space-y-4 rounded-xl border border-[color-mix(in_srgb,var(--semantic-border-soft)_92%,transparent)] bg-[color-mix(in_srgb,var(--semantic-success)_04%,var(--semantic-panel-muted))] p-4 sm:p-5">
            {slice.map((row) => {
              const acc = numericAccuracy(row);
              const pct = acc != null ? Math.min(100, Math.max(0, acc)) : 0;
              const tr = trendByTopic.get(row.topic);
              const display =
                row.accuracyPct != null
                  ? `${row.accuracyPct}%`
                  : row.weightedAccuracy != null
                    ? `${Math.round(row.weightedAccuracy * 100)}%`
                    : row.attempted > 0
                      ? `${Math.round((row.correct / row.attempted) * 100)}%`
                      : "—";
              return (
                <li key={row.topic}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="min-w-0 font-medium text-[var(--semantic-text-primary)]">
                      {row.topic}
                      {tr ? (
                        <span
                          className="ml-2 inline-block rounded-md border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-info)_08%,var(--semantic-panel-muted))] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--semantic-text-secondary)]"
                          title={tr.summary}
                        >
                          {momentumShortLabel(t, tr)}
                        </span>
                      ) : null}
                    </span>
                    <div className="flex shrink-0 flex-wrap items-center gap-2">
                      <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${bandPillClass(acc)}`}>
                        {bandLabel(t, acc)}
                      </span>
                      <span className="text-sm tabular-nums text-[var(--semantic-text-secondary)]">
                        <span className="font-semibold text-[var(--semantic-text-primary)]">{display}</span>
                        <span className="ml-1.5 text-xs">· {t("learner.dashboard.insight.topicAttempts", { n: row.attempted })}</span>
                      </span>
                    </div>
                  </div>
                  <div
                    className="nn-progress-track-semantic nn-progress-track-semantic--md mt-2 shadow-[inset_0_1px_2px_color-mix(in_srgb,var(--semantic-text-primary)_06%,transparent)]"
                    aria-hidden
                  >
                    <div
                      className={`h-full rounded-full ${semanticFillClassForAccuracyPct(acc)} nn-progress-fill-reveal transition-[width] duration-500`}
                      style={{ width: `${acc != null ? pct : 0}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="mt-5 rounded-xl border border-dashed border-[color-mix(in_srgb,var(--semantic-success)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_04%,var(--semantic-panel-muted))] px-5 py-8 text-center">
            <BarChart3 className="mx-auto mb-3 h-8 w-8 text-[var(--semantic-success)] opacity-60" aria-hidden />
            <p className="text-sm font-medium text-[var(--semantic-text-primary)]">Your topic breakdown will appear here</p>
            <p className="mt-1 text-xs text-[var(--semantic-text-secondary)]">Answer a few questions across different topics to see how you stack up in each area.</p>
            <Link
              href="/app/questions"
              className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-[color-mix(in_srgb,var(--semantic-success)_32%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_10%,var(--semantic-surface))] px-4 py-2 text-xs font-semibold text-[var(--semantic-success)] shadow-sm transition-colors hover:bg-[color-mix(in_srgb,var(--semantic-success)_16%,var(--semantic-surface))]"
            >
              {t("learner.dashboard.empty.startPracticeCta")}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
