"use client";

/**
 * TopicProgressGrid
 *
 * Paginated grid of topic-level accuracy bars.
 *
 * Visual design:
 *   - Card background: --surface-soft-b (calm neutral)
 *   - Each topic row uses a semantic accuracy fill class
 *   - Rows alternate subtly in depth via a thin border
 *   - Status chips use --semantic-success / --semantic-info / --semantic-warning / --semantic-danger
 *
 * Pagination: Server Action loads the next page of topics.
 * Initial rows passed as props from RSC. "Load more" appends via transition.
 */

import { useState, useTransition } from "react";
import type { TopicProgressRow } from "@/lib/study/motivation-data";

// ── Status chip ───────────────────────────────────────────────────────────────

const STATUS_META: Record<
  TopicProgressRow["status"],
  { label: string; bg: string; text: string }
> = {
  mastered: {
    label: "Mastered",
    bg: "color-mix(in srgb, var(--semantic-success) 14%, var(--semantic-surface))",
    text: "var(--semantic-success)",
  },
  strong: {
    label: "Established",
    bg: "color-mix(in srgb, var(--semantic-success) 9%, var(--semantic-surface))",
    text: "var(--semantic-success)",
  },
  improving: {
    label: "Improving",
    bg: "color-mix(in srgb, var(--semantic-info) 12%, var(--semantic-surface))",
    text: "var(--semantic-info)",
  },
  weak: {
    label: "Weak",
    bg: "color-mix(in srgb, var(--semantic-warning) 12%, var(--semantic-surface))",
    text: "var(--semantic-warning)",
  },
  critical: {
    label: "Needs review",
    bg: "color-mix(in srgb, var(--semantic-danger) 12%, var(--semantic-surface))",
    text: "var(--semantic-danger)",
  },
};

function accuracyFillColor(status: TopicProgressRow["status"]): string {
  const map: Record<TopicProgressRow["status"], string> = {
    mastered: "var(--semantic-success)",
    strong: "var(--semantic-success)",
    improving: "var(--semantic-info)",
    weak: "var(--semantic-warning)",
    critical: "var(--semantic-danger)",
  };
  return map[status];
}

// ── Single topic row ──────────────────────────────────────────────────────────

function TopicRow({ row }: { row: TopicProgressRow }) {
  const meta = STATUS_META[row.status];
  const fillColor = accuracyFillColor(row.status);

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 transition-colors"
      style={{
        borderBottom:
          "1px solid color-mix(in srgb, var(--semantic-border-soft) 60%, transparent)",
      }}
    >
      {/* Topic name */}
      <div className="min-w-0 flex-1">
        <p
          className="truncate text-sm font-semibold"
          style={{ color: "var(--semantic-text-primary)" }}
        >
          {row.topic}
        </p>
        <p
          className="mt-0.5 text-[11px]"
          style={{ color: "var(--semantic-text-muted)" }}
        >
          {row.totalAttempts} question{row.totalAttempts !== 1 ? "s" : ""}
          {row.wrongStreak >= 2 && (
            <span
              className="ml-1.5"
              style={{ color: "var(--semantic-warning)" }}
            >
              · {row.wrongStreak} wrong in a row
            </span>
          )}
        </p>
      </div>

      {/* Accuracy bar */}
      <div className="flex w-24 flex-col gap-1 sm:w-32">
        <div className="flex items-center justify-between">
          <span
            className="text-xs font-bold tabular-nums"
            style={{ color: fillColor }}
          >
            {row.accuracyPct}%
          </span>
        </div>
        <div
          className="h-1.5 w-full overflow-hidden rounded-full"
          style={{
            background:
              "color-mix(in srgb, var(--semantic-border-soft) 60%, transparent)",
          }}
          role="progressbar"
          aria-valuenow={row.accuracyPct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${row.topic} accuracy ${row.accuracyPct}%`}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${row.accuracyPct}%`, background: fillColor }}
          />
        </div>
      </div>

      {/* Status chip */}
      <div
        className="hidden shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider sm:block"
        style={{
          background: meta.bg,
          color: meta.text,
        }}
      >
        {meta.label}
      </div>
    </div>
  );
}

// ── TopicProgressGrid ─────────────────────────────────────────────────────────

export type TopicProgressGridProps = {
  initialRows: TopicProgressRow[];
  topicTotal: number;
  hasMoreTopics: boolean;
  onLoadMore: (page: number) => Promise<{ rows: TopicProgressRow[]; hasMore: boolean }>;
};

export function TopicProgressGrid({
  initialRows,
  topicTotal,
  hasMoreTopics: initialHasMore,
  onLoadMore,
}: TopicProgressGridProps) {
  const [rows, setRows] = useState<TopicProgressRow[]>(initialRows);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isPending, startTransition] = useTransition();

  const isEmpty = rows.length === 0;

  function handleLoadMore() {
    const nextPage = page + 1;
    startTransition(async () => {
      const result = await onLoadMore(nextPage);
      setRows((prev) => {
        const existingIds = new Set(prev.map((r) => r.id));
        const fresh = result.rows.filter((r) => !existingIds.has(r.id));
        return [...prev, ...fresh];
      });
      setHasMore(result.hasMore);
      setPage(nextPage);
    });
  }

  return (
    <div
      className="overflow-hidden rounded-2xl"
      style={{
        background:
          "var(--surface-soft-b, color-mix(in srgb, var(--theme-secondary, var(--theme-primary)) 5%, var(--bg-page)))",
        border: "1px solid var(--semantic-border-soft)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{
          borderBottom: "1px solid var(--semantic-border-soft)",
        }}
      >
        <div>
          <p
            className="text-[10px] font-bold uppercase tracking-widest"
            style={{ color: "var(--semantic-text-muted)" }}
          >
            Topic progress
          </p>
          <p
            className="mt-0.5 text-sm font-semibold"
            style={{ color: "var(--semantic-text-primary)" }}
          >
            {topicTotal > 0
              ? `${topicTotal} topic${topicTotal !== 1 ? "s" : ""} tracked`
              : "No topics yet"}
          </p>
        </div>

        {topicTotal > 0 && (
          <div
            className="rounded-xl px-3 py-1.5 text-xs font-semibold"
            style={{
              background:
                "color-mix(in srgb, var(--semantic-info) 10%, var(--semantic-surface))",
              color: "var(--semantic-info)",
            }}
          >
            Ordered by recency
          </div>
        )}
      </div>

      {/* Rows */}
      {isEmpty ? (
        <div className="px-5 py-8 text-center">
          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--semantic-text-muted)" }}
          >
            Complete practice questions to see topic-level accuracy here.
          </p>
        </div>
      ) : (
        <div>
          {rows.map((row) => (
            <TopicRow key={row.id} row={row} />
          ))}
        </div>
      )}

      {/* Load more */}
      {hasMore && (
        <div
          className="px-5 py-3"
          style={{
            borderTop: "1px solid var(--semantic-border-soft)",
          }}
        >
          <button
            onClick={handleLoadMore}
            disabled={isPending}
            className="w-full rounded-xl py-2 text-xs font-semibold transition-opacity disabled:opacity-50"
            style={{
              background:
                "color-mix(in srgb, var(--semantic-info) 8%, var(--semantic-surface))",
              color: "var(--semantic-info)",
              border: "1px solid color-mix(in srgb, var(--semantic-info) 18%, transparent)",
            }}
          >
            {isPending ? "Loading…" : "Load more topics"}
          </button>
        </div>
      )}
    </div>
  );
}
