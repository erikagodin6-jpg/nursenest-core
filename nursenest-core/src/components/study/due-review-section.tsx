"use client";

/**
 * DueReviewSection
 *
 * A collapsible, paginated section displaying one priority tier of the review queue.
 * Manages its own items list in state; appends items from "Load more" server action.
 *
 * Design surfaces (per spec Section 3):
 *   "Due Now"     → --surface-soft-c (info/warning cool tint) header
 *   "Review Soon" → --surface-soft-a (gentle brand tint) header
 *   "Stable"      → --surface-soft-b (gentle success tint) header
 *
 * Performance: only PAGE_SIZE items rendered per section on initial load.
 * Further items loaded on demand via the loadMoreItems server action.
 */

import { useState, useTransition } from "react";
import { ChevronDown } from "lucide-react";
import type { ReviewPriority, ScoredReviewItem } from "@/lib/study/srs-scheduler";
import { ReviewQueueRow } from "@/components/study/review-queue-row";

// ── Surface config per priority tier ─────────────────────────────────────────

interface SectionConfig {
  title: string;
  description: string;
  surface: string;
  borderColor: string;
  accentColor: string;
  defaultExpanded: boolean;
}

function sectionConfig(priority: ReviewPriority): SectionConfig {
  switch (priority) {
    case "due_now":
      return {
        title: "Due Now",
        description:
          "These questions need immediate attention — incorrect answers, overconfidence misses, or long since reviewed.",
        surface:
          "var(--surface-soft-c, color-mix(in srgb, var(--semantic-info) 5%, var(--bg-card)))",
        borderColor:
          "color-mix(in srgb, var(--semantic-warning, #f59e0b) 20%, var(--border-subtle, var(--theme-border)))",
        accentColor: "var(--semantic-warning, #f59e0b)",
        defaultExpanded: true,
      };
    case "review_soon":
      return {
        title: "Review Soon",
        description:
          "Solid recent performance but some uncertainty or time decay — review within the next session or two.",
        surface:
          "var(--surface-soft-a, color-mix(in srgb, var(--theme-primary) 3.5%, var(--bg-page)))",
        borderColor:
          "color-mix(in srgb, var(--semantic-info, #38bdf8) 20%, var(--border-subtle, var(--theme-border)))",
        accentColor: "var(--semantic-info, #38bdf8)",
        defaultExpanded: true,
      };
    case "stable":
      return {
        title: "Stable — Lower Priority",
        description:
          "Correctly answered with good confidence. Continue to visit occasionally to maintain long-term retention.",
        surface:
          "var(--surface-soft-b, color-mix(in srgb, var(--semantic-success) 5%, var(--bg-card)))",
        borderColor:
          "color-mix(in srgb, var(--semantic-success, #22c55e) 20%, var(--border-subtle, var(--theme-border)))",
        accentColor: "var(--semantic-success, #22c55e)",
        defaultExpanded: false,
      };
  }
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState({ priority }: { priority: ReviewPriority }) {
  const messages: Record<ReviewPriority, string> = {
    due_now:
      "No urgent items right now. Keep up your current pace and this section will populate after your next session.",
    review_soon:
      "Nothing coming up soon. Your recent accuracy is keeping this section clear.",
    stable:
      "No stable knowledge items yet. Items will appear here once you've correctly answered questions with high confidence.",
  };
  return (
    <p
      className="py-6 text-center text-sm italic"
      style={{ color: "var(--theme-muted-text, var(--muted-foreground))" }}
    >
      {messages[priority]}
    </p>
  );
}

// ── DueReviewSection ──────────────────────────────────────────────────────────

export type LoadMoreAction = (
  priority: ReviewPriority,
  page: number,
) => Promise<{ items: ScoredReviewItem[]; total: number; hasMore: boolean }>;

export interface DueReviewSectionProps {
  priority: ReviewPriority;
  initialItems: ScoredReviewItem[];
  total: number;
  initialHasMore: boolean;
  /** Server action for loading additional pages. */
  loadMore: LoadMoreAction;
  /** Active topic filter from ReviewQueueFilters (applied client-side). */
  topicFilter?: string | null;
  /** Active mode filter (applied client-side). */
  modeFilter?: string | null;
}

export function DueReviewSection({
  priority,
  initialItems,
  total,
  initialHasMore,
  loadMore,
  topicFilter,
  modeFilter,
}: DueReviewSectionProps) {
  const config = sectionConfig(priority);
  const [expanded, setExpanded] = useState(config.defaultExpanded);
  const [items, setItems] = useState<ScoredReviewItem[]>(initialItems);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [page, setPage] = useState(1); // next page to fetch (0 was initial)
  const [pending, startTransition] = useTransition();

  // Client-side filtering (topic + mode)
  const visibleItems = items.filter((item) => {
    if (topicFilter && item.topic !== topicFilter) return false;
    if (modeFilter && item.modeLabel !== modeFilter) return false;
    return true;
  });

  function handleLoadMore() {
    startTransition(async () => {
      const result = await loadMore(priority, page);
      setItems((prev) => [...prev, ...result.items]);
      setHasMore(result.hasMore);
      setPage((p) => p + 1);
    });
  }

  if (total === 0) return null; // omit empty sections entirely

  return (
    <div
      className="overflow-hidden rounded-2xl"
      style={{
        background: config.surface,
        border: `1px solid ${config.borderColor}`,
      }}
      role="region"
      aria-label={config.title}
    >
      {/* Section header — collapsible */}
      <button
        type="button"
        className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left sm:px-6"
        onClick={() => setExpanded((e) => !e)}
        aria-expanded={expanded}
        aria-controls={`section-body-${priority}`}
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2.5">
            <span
              className="text-sm font-bold sm:text-base"
              style={{ color: "var(--theme-heading-text, var(--foreground))" }}
            >
              {config.title}
            </span>
            {/* Count badge */}
            <span
              className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold"
              style={{
                background: `color-mix(in srgb, ${config.accentColor} 15%, var(--bg-card, var(--theme-card-bg)))`,
                color: config.accentColor,
                border: `1px solid color-mix(in srgb, ${config.accentColor} 30%, var(--border-subtle, var(--theme-border)))`,
              }}
              aria-label={`${total} questions`}
            >
              {total}
            </span>
          </div>
          <p
            className="mt-0.5 text-xs leading-snug"
            style={{ color: "var(--theme-muted-text, var(--muted-foreground))" }}
          >
            {config.description}
          </p>
        </div>

        <ChevronDown
          className={`mt-1 h-4 w-4 shrink-0 transition-transform duration-200 ${
            expanded ? "rotate-180" : ""
          }`}
          aria-hidden
          style={{ color: "var(--theme-muted-text, var(--muted-foreground))" }}
        />
      </button>

      {/* Section body */}
      {expanded ? (
        <div
          id={`section-body-${priority}`}
          className="border-t px-4 pb-4 pt-3 sm:px-5"
          style={{
            borderColor: `color-mix(in srgb, ${config.borderColor} 70%, transparent)`,
          }}
        >
          {visibleItems.length === 0 ? (
            <EmptyState priority={priority} />
          ) : (
            <ul className="space-y-2.5">
              {visibleItems.map((item) => (
                <ReviewQueueRow key={item.questionId} item={item} />
              ))}
            </ul>
          )}

          {/* Load more */}
          {hasMore && !topicFilter && !modeFilter ? (
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={handleLoadMore}
                disabled={pending}
                className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-150 hover:opacity-85 active:scale-[0.98] disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2"
                style={{
                  background: "var(--bg-card, var(--theme-card-bg))",
                  border: "1px solid var(--border-subtle, var(--theme-border))",
                  color: "var(--theme-text, var(--foreground))",
                }}
              >
                {pending ? "Loading…" : `Load more (${total - items.length} remaining)`}
              </button>
            </div>
          ) : null}

          {/* Filtered result note */}
          {(topicFilter || modeFilter) && visibleItems.length === 0 ? (
            <p
              className="mt-3 text-center text-xs"
              style={{ color: "var(--theme-muted-text, var(--muted-foreground))" }}
            >
              No items match your current filters in this section.
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
