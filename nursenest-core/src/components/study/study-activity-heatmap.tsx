import type { CSSProperties } from "react";
import type { DailyActivityCell } from "@/lib/study/analytics-data";
import type { AnalyticsLoadResult } from "@/lib/study/analytics-load-result";
import { analyticsResolvedData } from "@/lib/study/analytics-load-result";

/** Semantic chart hues — avoids a single-brand monochrome heat tile wall. */
const HEAT_HUES = [
  "var(--semantic-chart-1)",
  "var(--semantic-chart-2)",
  "var(--semantic-chart-3)",
  "var(--semantic-chart-4)",
  "var(--semantic-chart-5)",
] as const;

/**
 * Presentation-only cell fill: intensity selects saturation; index rotates hue band.
 */
function studyHeatmapCellStyle(intensity: number, count: number, index: number): CSSProperties {
  const borderSoft = "color-mix(in srgb, var(--semantic-border-soft) 82%, transparent)";
  if (count <= 0) {
    return {
      borderColor: borderSoft,
      background: "color-mix(in srgb, var(--semantic-panel-muted) 38%, var(--semantic-surface))",
    };
  }
  const hue = HEAT_HUES[index % HEAT_HUES.length]!;
  const mixPct = 14 + Math.round(intensity * 76);
  return {
    borderColor: `color-mix(in srgb, ${hue} 22%, var(--semantic-border-soft))`,
    background: `color-mix(in srgb, ${hue} ${mixPct}%, var(--semantic-surface))`,
  };
}

/**
 * GitHub-style 7×4 heatmap of recent daily question volume (UTC buckets).
 */
export function StudyActivityHeatmap({
  dailyActivity,
}: {
  dailyActivity: AnalyticsLoadResult<DailyActivityCell[]>;
}) {
  if (dailyActivity.kind === "error") {
    return (
      <section
        className="flex h-full flex-col rounded-2xl border p-5 sm:p-6"
        style={{
          background: "var(--semantic-surface)",
          borderColor: "var(--semantic-border-soft)",
          boxShadow: "var(--semantic-shadow-soft)",
        }}
        data-testid="study-activity-heatmap-error"
      >
        <div className="mb-4">
          <h2 className="text-base font-bold text-[var(--semantic-text-primary)]">Study activity</h2>
          <p className="mt-2 text-sm text-[var(--semantic-danger)]">
            Could not load daily activity ({dailyActivity.reason}). This is a load failure — not the same as zero
            practice.
          </p>
        </div>
      </section>
    );
  }

  const cells = analyticsResolvedData(dailyActivity) ?? [];
  const degradedNote = dailyActivity.kind === "degraded" ? dailyActivity.reason : null;

  const max = Math.max(1, ...cells.map((c) => c.questionsAnswered));
  const total = cells.reduce((s, c) => s + c.questionsAnswered, 0);
  const avgDaily = cells.length > 0 ? Math.round(total / cells.length) : 0;
  const last7 = cells.slice(-7);
  const activeLast7 = last7.filter((c) => c.questionsAnswered > 0).length;
  const weeklyConsistencyPct = Math.round((activeLast7 / 7) * 100);

  return (
    <section
      className="nn-premium-study-activity-heatmap flex h-full flex-col rounded-2xl border p-5 sm:p-6"
      style={{
        background: "var(--semantic-surface)",
        borderColor: "var(--semantic-border-soft)",
        boxShadow: "var(--semantic-shadow-soft)",
      }}
    >
      <div className="mb-4">
        <h2 className="text-base font-bold text-[var(--semantic-text-primary)]">Study activity</h2>
        <p className="mt-0.5 text-xs text-[var(--semantic-text-muted)]">Last {cells.length} days (UTC) · question attempts</p>
        {degradedNote ? (
          <p className="mt-2 text-xs font-semibold text-[var(--semantic-warning)]" data-testid="study-activity-degraded">
            <span className="uppercase tracking-wide">Degraded</span> — {degradedNote}
          </p>
        ) : null}
      </div>

      <div
        className="grid flex-1 grid-cols-7 gap-1.5"
        role="img"
        aria-label={`Daily activity heatmap, about ${avgDaily} questions per day on average`}
      >
        {cells.map((c, cellIndex) => {
          const intensity = c.questionsAnswered / max;
          return (
            <div
              key={c.dateKey}
              className="aspect-square rounded-md border"
              style={{
                ...studyHeatmapCellStyle(intensity, c.questionsAnswered, cellIndex),
              }}
              title={`${c.dateKey}: ${c.questionsAnswered} question${c.questionsAnswered !== 1 ? "s" : ""}`}
            />
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap justify-between gap-3 border-t border-[var(--semantic-border-soft)] pt-4 text-xs text-[var(--semantic-text-secondary)]">
        <p>
          <span className="font-bold tabular-nums text-[var(--semantic-text-primary)]">{avgDaily}</span>{" "}
          Avg daily questions
        </p>
        <p>
          <span className="font-bold tabular-nums text-[var(--semantic-info-contrast,var(--semantic-info))]">
            {weeklyConsistencyPct}%
          </span>{" "}
          Weekly consistency
        </p>
      </div>
    </section>
  );
}
