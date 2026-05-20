"use client";

/**
 * ReviewQueueFilters
 *
 * Compact inline filter strip for the review queue page.
 * Controls topic filter and mode filter. Filters are applied
 * client-side across all DueReviewSection instances via lifted state.
 *
 * Design: subtle pill-style filter bar, consistent with SmartReviewLayout's
 * ReviewFilters but adapted for the persistent queue surface.
 */

import type { ReviewModeLabel } from "@/lib/study/srs-scheduler";

const MODE_OPTIONS: ReviewModeLabel[] = [
  "Overconfidence",
  "Needs Review",
  "Uncertain",
  "Stable",
];

export interface ReviewQueueFiltersProps {
  topics: string[];
  topicFilter: string | null;
  modeFilter: ReviewModeLabel | null;
  onTopicChange: (topic: string | null) => void;
  onModeChange: (mode: ReviewModeLabel | null) => void;
}

export function ReviewQueueFilters({
  topics,
  topicFilter,
  modeFilter,
  onTopicChange,
  onModeChange,
}: ReviewQueueFiltersProps) {
  const hasFilter = topicFilter !== null || modeFilter !== null;

  return (
    <div
      className="flex flex-wrap items-center gap-2 rounded-xl px-4 py-3"
      style={{
        background: "var(--bg-card, var(--theme-card-bg))",
        border: "1px solid var(--border-subtle, var(--theme-border))",
      }}
      role="group"
      aria-label="Review queue filters"
    >
      <span
        className="shrink-0 text-[11px] font-bold uppercase tracking-[0.08em]"
        style={{ color: "var(--theme-muted-text, var(--muted-foreground))" }}
      >
        Filter:
      </span>

      {/* Topic filter */}
      {topics.length > 0 ? (
        <select
          value={topicFilter ?? ""}
          onChange={(e) => onTopicChange(e.target.value || null)}
          className="rounded-lg px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2"
          style={{
            background:
              topicFilter
                ? "var(--surface-soft-a, color-mix(in srgb, var(--theme-primary) 3.5%, var(--bg-page)))"
                : "var(--bg-page, var(--theme-page-bg))",
            border: `1px solid ${
              topicFilter
                ? "var(--theme-primary)"
                : "var(--border-subtle, var(--theme-border))"
            }`,
            color: "var(--theme-text, var(--foreground))",
          }}
          aria-label="Filter by topic"
        >
          <option value="">All topics</option>
          {topics.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      ) : null}

      {/* Mode filter pills */}
      {MODE_OPTIONS.map((mode) => {
        const active = modeFilter === mode;
        return (
          <button
            key={mode}
            type="button"
            onClick={() => onModeChange(active ? null : mode)}
            aria-pressed={active}
            className="rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2"
            style={{
              background: active
                ? "var(--theme-primary)"
                : "var(--bg-page, var(--theme-page-bg))",
              border: `1px solid ${
                active
                  ? "var(--theme-primary)"
                  : "var(--border-subtle, var(--theme-border))"
              }`,
              color: active
                ? "var(--theme-primary-foreground, #fff)"
                : "var(--theme-muted-text, var(--muted-foreground))",
            }}
          >
            {mode}
          </button>
        );
      })}

      {/* Clear all */}
      {hasFilter ? (
        <button
          type="button"
          onClick={() => {
            onTopicChange(null);
            onModeChange(null);
          }}
          className="ml-auto text-[11px] underline underline-offset-2 transition-opacity hover:opacity-70 focus-visible:outline-none"
          style={{ color: "var(--theme-muted-text, var(--muted-foreground))" }}
        >
          Clear
        </button>
      ) : null}
    </div>
  );
}

// ── ReviewQueueFilterController ───────────────────────────────────────────────

/**
 * Lifts filter state and wires it to both the filter bar and section components.
 * Renders filters + children with filter state injected via render-props pattern.
 */
export interface ReviewQueueFilterControllerProps {
  topics: string[];
  children: (props: {
    topicFilter: string | null;
    modeFilter: ReviewModeLabel | null;
  }) => React.ReactNode;
}

export function ReviewQueueFilterController({
  topics,
  children,
}: ReviewQueueFilterControllerProps) {
  const [topicFilter, setTopicFilter] = useState<string | null>(null);
  const [modeFilter, setModeFilter] = useState<ReviewModeLabel | null>(null);

  return (
    <>
      {topics.length > 0 || true /* always show mode filter */ ? (
        <ReviewQueueFilters
          topics={topics}
          topicFilter={topicFilter}
          modeFilter={modeFilter}
          onTopicChange={setTopicFilter}
          onModeChange={setModeFilter}
        />
      ) : null}
      {children({ topicFilter, modeFilter })}
    </>
  );
}

// useState import needed at module level for the controller
import { useState } from "react";
