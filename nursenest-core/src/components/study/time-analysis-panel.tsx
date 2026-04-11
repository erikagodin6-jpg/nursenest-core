/**
 * TimeAnalysisPanel — session time patterns in a restrained, readable panel.
 *
 * Surface: --surface-soft-a with --semantic-info accents.
 *
 * Shows:
 *   - Average time per question
 *   - Average session duration
 *   - Rush sessions (< 60s total) vs deep study sessions (> 45 min)
 *   - Visual bar distribution of session lengths
 *
 * All data comes from PracticeTest.elapsedMs (real DB field).
 * If no data is available, renders a calm empty state.
 */

import type { TimeMetrics } from "@/lib/study/analytics-data";

export function TimeAnalysisPanel({ metrics }: { metrics: TimeMetrics }) {
  const hasData = metrics.sessionsAnalyzed > 0;

  return (
    <section
      className="rounded-2xl border p-5 sm:p-6"
      style={{
        background: "var(--surface-soft-a, var(--semantic-panel-cool))",
        borderColor: "color-mix(in srgb, var(--semantic-info) 20%, var(--semantic-border-soft))",
      }}
    >
      <div className="mb-5 flex items-baseline gap-2">
        <h2 className="text-base font-bold text-[var(--semantic-text-primary)]">
          Time Analysis
        </h2>
        {hasData && (
          <span className="text-xs text-[var(--semantic-text-muted)]">
            {metrics.sessionsAnalyzed} session{metrics.sessionsAnalyzed !== 1 ? "s" : ""} analyzed
          </span>
        )}
      </div>

      {!hasData ? (
        <p className="text-sm text-[var(--semantic-text-muted)]">
          Complete practice sessions with timing to see time analysis here.
        </p>
      ) : (
        <div className="space-y-5">
          {/* Metric row */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <TimeMetricChip
              label="Avg per question"
              value={formatMs(metrics.avgMsPerQuestion)}
              sub={msLabel(metrics.avgMsPerQuestion)}
              accent="info"
            />
            <TimeMetricChip
              label="Avg session"
              value={formatDuration(metrics.avgSessionDurationMs)}
              sub="per study block"
              accent="neutral"
            />
            <TimeMetricChip
              label="Rush sessions"
              value={String(metrics.rushSessions)}
              sub="under 1 minute"
              accent={metrics.rushSessions > 2 ? "warning" : "neutral"}
            />
            <TimeMetricChip
              label="Deep sessions"
              value={String(metrics.deepStudySessions)}
              sub="over 45 minutes"
              accent={metrics.deepStudySessions > 0 ? "success" : "neutral"}
            />
          </div>

          {/* Session range bar */}
          {metrics.minSessionMs !== null && metrics.maxSessionMs !== null && (
            <SessionRangeBar
              minMs={metrics.minSessionMs}
              maxMs={metrics.maxSessionMs}
              avgMs={metrics.avgSessionDurationMs}
            />
          )}

          {/* Interpretation */}
          <TimeInterpretation metrics={metrics} />
        </div>
      )}
    </section>
  );
}

function TimeMetricChip({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub: string;
  accent: "info" | "warning" | "success" | "neutral";
}) {
  const accentMap = {
    info: { text: "var(--semantic-info-contrast, var(--semantic-info))" },
    warning: { text: "color-mix(in srgb, var(--semantic-warning) 80%, var(--semantic-text-primary))" },
    success: { text: "var(--semantic-success)" },
    neutral: { text: "var(--semantic-text-primary)" },
  };

  return (
    <div
      className="rounded-xl p-3"
      style={{
        background: "color-mix(in srgb, var(--semantic-surface) 60%, transparent)",
        border: "1px solid var(--semantic-border-soft)",
      }}
    >
      <p className="text-[0.65rem] font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
        {label}
      </p>
      <p
        className="mt-0.5 text-xl font-bold tabular-nums"
        style={{ color: accentMap[accent].text }}
      >
        {value}
      </p>
      <p className="text-[0.65rem] text-[var(--semantic-text-muted)]">{sub}</p>
    </div>
  );
}

function SessionRangeBar({
  minMs,
  maxMs,
  avgMs,
}: {
  minMs: number;
  maxMs: number;
  avgMs: number | null;
}) {
  if (maxMs <= minMs) return null;
  const range = maxMs - minMs;
  const avgPct = avgMs != null ? Math.round(((avgMs - minMs) / range) * 100) : null;

  return (
    <div className="space-y-1.5">
      <p className="text-xs font-medium text-[var(--semantic-text-secondary)]">Session duration range</p>
      <div className="relative h-2 rounded-full" style={{ background: "var(--semantic-border-soft)" }}>
        {/* Filled range */}
        <div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width: "100%",
            background: "color-mix(in srgb, var(--semantic-info) 30%, var(--semantic-surface))",
          }}
        />
        {/* Avg marker */}
        {avgPct !== null && (
          <div
            className="absolute top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full"
            style={{
              left: `${avgPct}%`,
              background: "var(--semantic-info-contrast, var(--semantic-info))",
            }}
            aria-label={`Average: ${formatDuration(avgMs)}`}
          />
        )}
      </div>
      <div className="flex justify-between text-[0.65rem] text-[var(--semantic-text-muted)]">
        <span>{formatDuration(minMs)}</span>
        {avgPct !== null && (
          <span style={{ color: "var(--semantic-info-contrast, var(--semantic-info))" }}>
            avg {formatDuration(avgMs)}
          </span>
        )}
        <span>{formatDuration(maxMs)}</span>
      </div>
    </div>
  );
}

function TimeInterpretation({ metrics }: { metrics: TimeMetrics }) {
  const lines: string[] = [];

  const avgMs = metrics.avgMsPerQuestion;
  if (avgMs !== null) {
    if (avgMs < 45_000) lines.push("You are answering quickly on average — review whether speed is affecting accuracy.");
    else if (avgMs > 120_000) lines.push("You are spending significant time per question — this may indicate careful reasoning or hesitation zones.");
    else lines.push("Your average time per question is in a healthy range for clinical reasoning.");
  }

  if (metrics.rushSessions > 2) {
    lines.push(`${metrics.rushSessions} sessions were very short — those may not have captured meaningful performance data.`);
  }

  if (metrics.deepStudySessions > 0) {
    lines.push(`${metrics.deepStudySessions} deep study session${metrics.deepStudySessions !== 1 ? "s" : ""} (over 45 min) reflects strong study commitment.`);
  }

  if (lines.length === 0) return null;

  return (
    <div
      className="rounded-xl p-3 text-sm"
      style={{
        background: "color-mix(in srgb, var(--semantic-info) 8%, var(--semantic-surface))",
        border: "1px solid color-mix(in srgb, var(--semantic-info) 20%, transparent)",
        color: "var(--semantic-text-secondary)",
      }}
    >
      {lines.map((line) => (
        <p key={line.slice(0, 40)} className="leading-relaxed">
          {line}
        </p>
      ))}
    </div>
  );
}

// ── Formatting helpers ──────────────────────────────────────────────────────

function formatMs(ms: number | null): string {
  if (ms === null) return "—";
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  return `${Math.floor(s / 60)}m ${s % 60}s`;
}

function formatDuration(ms: number | null | undefined): string {
  if (ms == null || ms <= 0) return "—";
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}h ${m % 60}m`;
  if (m > 0) return `${m}m ${s % 60}s`;
  return `${s}s`;
}

function msLabel(ms: number | null): string {
  if (ms === null) return "no data yet";
  const s = Math.round(ms / 1000);
  if (s < 30) return "very fast — check accuracy";
  if (s < 60) return "efficient pace";
  if (s < 90) return "deliberate reasoning";
  if (s < 150) return "careful — watch for hesitation";
  return "slow — possible knowledge gaps";
}
