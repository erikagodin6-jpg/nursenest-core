/**
 * Performance by question type — uses the same learner analytics card language as
 * ConfidencePatternsPanel (soft semantic surfaces, nn-progress semantic fills).
 */

import type { QuestionTypeRow } from "@/lib/study/analytics-data";
import type { AnalyticsLoadResult } from "@/lib/study/analytics-load-result";
import { analyticsResolvedData, formatAccuracyRow } from "@/lib/study/analytics-load-result";
import { semanticFillClassForAccuracyPct } from "@/lib/ui/semantic-progress-fill";
import { formatSentenceCase } from "@/lib/format/text-case";

export function QuestionTypePerformancePanel({ rows }: { rows: AnalyticsLoadResult<QuestionTypeRow[]> }) {
  if (rows.kind === "error") {
    return (
      <section
        className="flex h-full flex-col rounded-2xl border p-5 sm:p-6"
        style={{
          background: "var(--surface-soft-b, var(--semantic-panel-cool))",
          borderColor: "var(--semantic-border-soft)",
          boxShadow: "0 1px 0 color-mix(in srgb, var(--semantic-border-soft) 80%, transparent)",
        }}
        data-testid="question-type-performance-error"
      >
        <h2 className="text-base font-bold text-[var(--semantic-text-primary)]">Question type performance</h2>
        <p className="mt-2 text-sm text-[var(--semantic-danger)]">
          Could not load question-type breakdown ({rows.reason}). This is not the same as having no attempts yet.
        </p>
      </section>
    );
  }

  if (rows.kind === "empty") {
    return (
      <section
        className="flex h-full flex-col rounded-2xl border p-5 sm:p-6"
        style={{
          background: "var(--surface-soft-b, var(--semantic-panel-cool))",
          borderColor: "var(--semantic-border-soft)",
          boxShadow: "0 1px 0 color-mix(in srgb, var(--semantic-border-soft) 80%, transparent)",
        }}
        data-testid="question-type-performance-empty"
      >
        <h2 className="text-base font-bold text-[var(--semantic-text-primary)]">Question type performance</h2>
        <p className="mt-2 text-sm text-[var(--semantic-text-muted)]">
          No format breakdown is available yet — this is an explicit empty state, not a load failure.
        </p>
      </section>
    );
  }

  const rowData = analyticsResolvedData(rows) ?? [];
  const degradedReason = rows.kind === "degraded" ? rows.reason : null;

  if (rowData.length === 0) {
    return (
      <section
        className="flex h-full flex-col rounded-2xl border p-5 sm:p-6"
        style={{
          background: "var(--surface-soft-b, var(--semantic-panel-cool))",
          borderColor: "var(--semantic-border-soft)",
          boxShadow: "0 1px 0 color-mix(in srgb, var(--semantic-border-soft) 80%, transparent)",
        }}
      >
        <h2 className="text-base font-bold text-[var(--semantic-text-primary)]">Question type performance</h2>
        {degradedReason ? (
          <p className="mt-2 text-xs font-semibold text-[var(--semantic-warning)]">
            <span className="uppercase tracking-wide">Degraded</span> — {degradedReason}
          </p>
        ) : null}
        <p className="mt-2 text-sm text-[var(--semantic-text-muted)]">
          Accuracy and volume by item format — complete more graded sessions to fill this in.
        </p>
      </section>
    );
  }

  return (
    <section
      className="flex h-full flex-col rounded-2xl border p-5 sm:p-6"
      style={{
        background: "var(--surface-soft-b, var(--semantic-panel-cool))",
        borderColor: "var(--semantic-border-soft)",
        boxShadow: "0 1px 0 color-mix(in srgb, var(--semantic-border-soft) 80%, transparent)",
      }}
    >
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-base font-bold text-[var(--semantic-text-primary)]">Question type performance</h2>
        <span className="text-xs text-[var(--semantic-text-muted)]">
          {rowData.length} format{rowData.length !== 1 ? "s" : ""} with enough data
        </span>
      </div>
      {degradedReason ? (
        <p className="mb-3 text-xs font-semibold text-[var(--semantic-warning)]">
          <span className="uppercase tracking-wide">Degraded</span> — {degradedReason}
        </p>
      ) : null}
      <ul className="space-y-3">
        {rowData.map((row) => {
          const total = row.correctCount + row.wrongCount;
          const fill = semanticFillClassForAccuracyPct(row.accuracyPct);
          return (
            <li
              key={row.questionType}
              className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-3 sm:p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">
                  {formatSentenceCase(row.questionType.replace(/_/g, " "))}
                </p>
                <p className="text-xs tabular-nums text-[var(--semantic-text-muted)]">
                  {formatAccuracyRow(row.correctCount, total)}
                </p>
              </div>
              <div className="nn-progress-track-semantic nn-progress-track-semantic--md mt-2">
                <div
                  className={`h-full rounded-full ${fill} transition-[width] duration-500`}
                  style={{ width: `${Math.min(100, row.accuracyPct)}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
