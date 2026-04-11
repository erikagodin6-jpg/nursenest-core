/**
 * ConfidencePatternsPanel — cognitive pattern breakdown.
 *
 * Four quadrant categories with distinct semantic surface tints:
 *   - Overconfident Errors   → warning surface (danger)
 *   - Uncertain Correct      → info surface (reinforce)
 *   - Stable Mastery         → success surface
 *   - Inconsistent / Unrated → neutral muted surface
 *
 * Also shows topic-level accuracy bars using UserTopicStat data.
 * No hardcoded colors.
 */

import type { ConfidencePatternSummary, TopicRow } from "@/lib/study/analytics-data";

export function ConfidencePatternsPanel({
  patterns,
  topics,
}: {
  patterns: ConfidencePatternSummary;
  topics: TopicRow[];
}) {
  const hasPatterns = patterns.totalRated > 0;
  const hasTopics = topics.length > 0;

  return (
    <section className="space-y-5">
      {/* Cognitive quadrants */}
      <div
        className="rounded-2xl border p-5 sm:p-6"
        style={{
          background: "var(--surface-soft-b, var(--semantic-panel-cool))",
          borderColor: "var(--semantic-border-soft)",
        }}
      >
        <div className="mb-4 flex items-baseline gap-2">
          <h2 className="text-base font-bold text-[var(--semantic-text-primary)]">
            Confidence + Correctness Patterns
          </h2>
          {hasPatterns && (
            <span className="text-xs text-[var(--semantic-text-muted)]">
              {patterns.totalRated.toLocaleString()} rated question{patterns.totalRated !== 1 ? "s" : ""} from {patterns.sessionsAnalyzed} session{patterns.sessionsAnalyzed !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {!hasPatterns ? (
          <p className="text-sm text-[var(--semantic-text-muted)]">
            Use the confidence selector during practice to unlock pattern analysis here.
          </p>
        ) : (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <CognitiveBand
                label="Overconfident Errors"
                count={patterns.overconfidentErrors}
                total={patterns.totalRated}
                description="High confidence — wrong answer. These are your highest-risk knowledge gaps."
                surface="color-mix(in srgb, var(--semantic-danger) 10%, var(--semantic-surface))"
                border="color-mix(in srgb, var(--semantic-danger) 25%, transparent)"
                valueColor="var(--semantic-danger)"
                severity="danger"
              />
              <CognitiveBand
                label="Uncertain Correct"
                count={patterns.uncertainCorrect}
                total={patterns.totalRated}
                description="Low confidence — correct answer. Reinforce these to build reliable knowledge."
                surface="color-mix(in srgb, var(--semantic-info) 10%, var(--semantic-surface))"
                border="color-mix(in srgb, var(--semantic-info) 25%, transparent)"
                valueColor="var(--semantic-info-contrast, var(--semantic-info))"
                severity="info"
              />
              <CognitiveBand
                label="Stable Mastery"
                count={patterns.stableMastery}
                total={patterns.totalRated}
                description="High confidence — correct. Reliable knowledge ready for exam conditions."
                surface="color-mix(in srgb, var(--semantic-success) 10%, var(--semantic-surface))"
                border="color-mix(in srgb, var(--semantic-success) 25%, transparent)"
                valueColor="var(--semantic-success)"
                severity="success"
              />
              <HighConfidenceAccuracy pct={patterns.highConfidenceAccuracy} total={patterns.totalRated} />
            </div>

            <ConfidenceDistributionBar patterns={patterns} />
          </div>
        )}
      </div>

      {/* Topic accuracy breakdown */}
      {hasTopics && (
        <div
          className="rounded-2xl border p-5 sm:p-6"
          style={{
            background: "var(--surface-soft-c, var(--semantic-panel-cool))",
            borderColor: "var(--semantic-border-soft)",
          }}
        >
          <h2 className="mb-4 text-base font-bold text-[var(--semantic-text-primary)]">
            Topic Accuracy Breakdown
          </h2>
          <div className="space-y-2.5">
            {topics.map((row) => (
              <TopicAccuracyRow key={row.topic} row={row} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function CognitiveBand({
  label,
  count,
  total,
  description,
  surface,
  border,
  valueColor,
  severity,
}: {
  label: string;
  count: number;
  total: number;
  description: string;
  surface: string;
  border: string;
  valueColor: string;
  severity: "danger" | "info" | "success" | "warning";
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  void severity;

  return (
    <div
      className="flex flex-col gap-1.5 rounded-xl p-4"
      style={{ background: surface, border: `1px solid ${border}` }}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
        {label}
      </p>
      <div className="flex items-baseline gap-2">
        <span
          className="text-2xl font-extrabold tabular-nums"
          style={{ color: valueColor }}
        >
          {count}
        </span>
        <span className="text-sm text-[var(--semantic-text-muted)]">
          ({pct}%)
        </span>
      </div>
      <p className="text-xs leading-relaxed text-[var(--semantic-text-secondary)]">
        {description}
      </p>
    </div>
  );
}

function HighConfidenceAccuracy({
  pct,
  total,
}: {
  pct: number | null;
  total: number;
}) {
  const display = pct !== null ? `${Math.round(pct * 100)}%` : "—";
  const interpretation =
    pct === null
      ? "No high-confidence answers rated yet."
      : pct >= 0.8
      ? "Strong — high confidence tracks well with correctness."
      : pct >= 0.6
      ? "Moderate — some overconfidence present."
      : "Low — significant overconfidence detected. Focus here.";

  const surface =
    pct === null
      ? "color-mix(in srgb, var(--semantic-text-muted) 6%, var(--semantic-surface))"
      : pct >= 0.8
      ? "color-mix(in srgb, var(--semantic-success) 10%, var(--semantic-surface))"
      : pct >= 0.6
      ? "color-mix(in srgb, var(--semantic-warning) 10%, var(--semantic-surface))"
      : "color-mix(in srgb, var(--semantic-danger) 10%, var(--semantic-surface))";

  const border =
    pct === null
      ? "var(--semantic-border-soft)"
      : pct >= 0.8
      ? "color-mix(in srgb, var(--semantic-success) 25%, transparent)"
      : pct >= 0.6
      ? "color-mix(in srgb, var(--semantic-warning) 25%, transparent)"
      : "color-mix(in srgb, var(--semantic-danger) 25%, transparent)";

  const valueColor =
    pct === null
      ? "var(--semantic-text-muted)"
      : pct >= 0.8
      ? "var(--semantic-success)"
      : pct >= 0.6
      ? "color-mix(in srgb, var(--semantic-warning) 80%, var(--semantic-text-primary))"
      : "var(--semantic-danger)";

  void total;

  return (
    <div
      className="flex flex-col gap-1.5 rounded-xl p-4"
      style={{ background: surface, border: `1px solid ${border}` }}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
        High-Confidence Accuracy
      </p>
      <span
        className="text-2xl font-extrabold tabular-nums"
        style={{ color: valueColor }}
      >
        {display}
      </span>
      <p className="text-xs leading-relaxed text-[var(--semantic-text-secondary)]">
        {interpretation}
      </p>
    </div>
  );
}

function ConfidenceDistributionBar({ patterns }: { patterns: ConfidencePatternSummary }) {
  if (patterns.totalRated === 0) return null;

  const segments = [
    {
      label: "Stable mastery",
      value: patterns.stableMastery,
      color: "var(--semantic-success)",
    },
    {
      label: "Uncertain correct",
      value: patterns.uncertainCorrect,
      color: "var(--semantic-info-contrast, var(--semantic-info))",
    },
    {
      label: "Overconfident errors",
      value: patterns.overconfidentErrors,
      color: "var(--semantic-danger)",
    },
  ];

  const total = segments.reduce((s, seg) => s + seg.value, 0);
  if (total === 0) return null;

  return (
    <div className="space-y-1.5">
      <p className="text-xs font-medium text-[var(--semantic-text-secondary)]">Distribution of rated answers</p>
      <div className="flex h-2.5 w-full overflow-hidden rounded-full" style={{ background: "var(--semantic-border-soft)" }}>
        {segments.map((seg) => {
          const pct = Math.round((seg.value / total) * 100);
          if (pct === 0) return null;
          return (
            <div
              key={seg.label}
              className="h-full"
              style={{ width: `${pct}%`, background: seg.color }}
              title={`${seg.label}: ${seg.value} (${pct}%)`}
            />
          );
        })}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {segments.map((seg) => (
          <span key={seg.label} className="flex items-center gap-1.5 text-[0.65rem] text-[var(--semantic-text-muted)]">
            <span
              className="inline-block h-1.5 w-3 rounded-full"
              style={{ background: seg.color }}
            />
            {seg.label}: {seg.value}
          </span>
        ))}
      </div>
    </div>
  );
}

function TopicAccuracyRow({ row }: { row: TopicRow }) {
  const pct = row.accuracyPct;
  const fillColor =
    pct >= 80
      ? "var(--semantic-success)"
      : pct >= 65
      ? "var(--semantic-info-contrast, var(--semantic-info))"
      : pct >= 50
      ? "color-mix(in srgb, var(--semantic-warning) 80%, var(--semantic-text-primary))"
      : "var(--semantic-danger)";

  return (
    <div className="flex items-center gap-3">
      <span
        className="w-36 shrink-0 truncate text-xs font-medium text-[var(--semantic-text-secondary)]"
        title={row.topic}
      >
        {row.topic}
      </span>
      <div
        className="relative flex-1 overflow-hidden rounded-full"
        style={{ height: "6px", background: "var(--semantic-border-soft)" }}
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all"
          style={{ width: `${pct}%`, background: fillColor }}
        />
      </div>
      <span className="w-16 shrink-0 text-right text-xs tabular-nums text-[var(--semantic-text-muted)]">
        {row.correctCount}/{row.totalCount} ({pct}%)
      </span>
    </div>
  );
}
