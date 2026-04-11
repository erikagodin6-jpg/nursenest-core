/**
 * BenchmarkStatusNotice
 *
 * Compact, neutral pre-threshold message. Shown when benchmarking is not yet
 * active — the cohort does not yet have enough qualifying users.
 *
 * Design: calm, one-line, muted. Does not prompt or over-explain.
 */

import { BarChart3 } from "lucide-react";

type Props = {
  message?: string;
  /** Visual weight: "inline" (single line) or "card" (padded surface). Default: "inline". */
  variant?: "inline" | "card";
};

export function BenchmarkStatusNotice({
  message = "Percentile benchmarking will appear once enough learner data is available.",
  variant = "inline",
}: Props) {
  if (variant === "card") {
    return (
      <div
        className="flex items-start gap-3 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-4 py-3"
        role="note"
        aria-label="Benchmarking status"
      >
        <BarChart3
          className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-text-muted)]"
          aria-hidden
          strokeWidth={1.75}
        />
        <p className="text-[0.8125rem] leading-relaxed text-[var(--semantic-text-muted)]">
          {message}
        </p>
      </div>
    );
  }

  return (
    <p
      className="flex items-center gap-1.5 text-xs text-[var(--semantic-text-muted)]"
      role="note"
    >
      <BarChart3 className="h-3.5 w-3.5 shrink-0" aria-hidden strokeWidth={1.75} />
      {message}
    </p>
  );
}
