"use client";

/**
 * HighlightsList
 *
 * Renders a paginated list of bookmarked lesson sections and saved rationale cards
 * retrieved from the Notes Index page data.
 *
 * Two sub-views:
 *   - "Bookmarks" tab: notes with contextId starting with "bk:"
 *   - "Saved rationales" tab: notes with contextId starting with "rationale:"
 *
 * Design surface: --surface-soft-c for the card background.
 *
 * Props:
 *   items     — initial batch (passed from RSC)
 *   hasMore   — whether more items exist
 *   onLoadMore — callback to fetch the next page (can call a Server Action)
 */

import { useState } from "react";
import Link from "next/link";
import type { NoteRow } from "@/lib/learner/notes-index-types";

export type HighlightsListProps = {
  items: NoteRow[];
  hasMore: boolean;
  onLoadMore?: () => Promise<{ items: NoteRow[]; hasMore: boolean }>;
  variant: "bookmarks" | "rationales";
};

// ── HighlightCard ─────────────────────────────────────────────────────────────

function HighlightCard({ note }: { note: NoteRow }) {
  const isBookmark = note.isBookmark;

  const accentColor = isBookmark ? "var(--semantic-info)" : "var(--semantic-success)";
  const accentBg = isBookmark
    ? "color-mix(in srgb, var(--semantic-info) 10%, var(--semantic-surface))"
    : "color-mix(in srgb, var(--semantic-success) 10%, var(--semantic-surface))";

  return (
    <div
      className="overflow-hidden rounded-2xl transition-shadow hover:shadow-sm"
      style={{
        background: "var(--surface-soft-c, color-mix(in srgb, var(--semantic-info) 5%, var(--bg-card)))",
        border: `1px solid color-mix(in srgb, ${accentColor} 18%, var(--semantic-border-soft))`,
      }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 px-4 py-3">
        <div className="min-w-0 flex-1">
          {/* Type badge */}
          <div className="mb-1 flex items-center gap-1.5">
            <span
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
              style={{ background: accentBg, color: accentColor }}
            >
              {isBookmark ? (
                <>
                  <svg width="7" height="7" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                  </svg>
                  Bookmark
                </>
              ) : (
                <>
                  <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                  </svg>
                  Saved rationale
                </>
              )}
            </span>
            {note.topic && (
              <span
                className="rounded-full px-2 py-0.5 text-[9px] font-medium"
                style={{
                  background: "color-mix(in srgb, var(--semantic-brand) 8%, var(--semantic-surface))",
                  color: "var(--semantic-brand)",
                }}
              >
                {note.topic}
              </span>
            )}
          </div>
          {/* Title */}
          <p className="truncate text-sm font-semibold" style={{ color: "var(--semantic-text-primary)" }}>
            {note.title ?? note.bodySnippet.slice(0, 60)}
          </p>
        </div>
        {/* Timestamp */}
        <time
          dateTime={note.updatedAt}
          className="shrink-0 text-[10px]"
          style={{ color: "var(--semantic-text-muted)" }}
        >
          {formatRelativeDate(note.updatedAt)}
        </time>
      </div>

      {/* Body snippet (only for rationales) */}
      {!isBookmark && note.bodySnippet && (
        <div
          className="px-4 pb-3"
          style={{ borderTop: "none" }}
        >
          <p className="text-[11px] leading-relaxed" style={{ color: "var(--semantic-text-secondary)" }}>
            {note.bodySnippet.slice(0, 200)}
            {note.bodySnippet.length >= 200 ? "…" : ""}
          </p>
        </div>
      )}

      {/* Footer */}
      <div
        className="flex items-center justify-between px-4 py-2"
        style={{ borderTop: `1px solid color-mix(in srgb, ${accentColor} 10%, var(--semantic-border-soft))` }}
      >
        <Link
          href={note.href}
          className="text-[10px] font-medium transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 rounded"
          style={{ color: "var(--semantic-brand)" }}
        >
          View source →
        </Link>
        <span className="text-[10px]" style={{ color: "var(--semantic-text-muted)" }}>
          {note.scopeLabel}
        </span>
      </div>
    </div>
  );
}

// ── HighlightsList ────────────────────────────────────────────────────────────

export function HighlightsList({
  items: initialItems,
  hasMore: initialHasMore,
  onLoadMore,
  variant,
}: HighlightsListProps) {
  const [items, setItems] = useState(initialItems);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);

  async function loadMore() {
    if (!onLoadMore || loading) return;
    setLoading(true);
    try {
      const { items: next, hasMore: nextHasMore } = await onLoadMore();
      setItems((prev) => [...prev, ...next]);
      setHasMore(nextHasMore);
    } finally {
      setLoading(false);
    }
  }

  const emptyText =
    variant === "bookmarks"
      ? "No bookmarked sections yet. Use the "Mark section" button inside any lesson."
      : "No saved rationales yet. After answering a question, click "Save this rationale" to save it here.";

  if (items.length === 0) {
    return (
      <div
        className="rounded-2xl px-6 py-8 text-center"
        style={{
          background: "var(--surface-soft-c, color-mix(in srgb, var(--semantic-info) 5%, var(--bg-card)))",
          border: "1px solid color-mix(in srgb, var(--semantic-info) 12%, var(--semantic-border-soft))",
        }}
      >
        <p className="text-sm" style={{ color: "var(--semantic-text-muted)" }}>
          {emptyText}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2.5">
        {items.map((note) => (
          <HighlightCard key={note.id} note={note} />
        ))}
      </div>
      {hasMore && (
        <div className="flex justify-center pt-1">
          <button
            type="button"
            disabled={loading}
            onClick={loadMore}
            className="rounded-full px-5 py-2 text-sm font-semibold transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50"
            style={{
              background: "color-mix(in srgb, var(--semantic-brand) 10%, var(--semantic-surface))",
              border: "1px solid color-mix(in srgb, var(--semantic-brand) 25%, transparent)",
              color: "var(--semantic-brand)",
            }}
          >
            {loading ? "Loading…" : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Date helper ───────────────────────────────────────────────────────────────

function formatRelativeDate(isoString: string): string {
  const ms = Date.now() - new Date(isoString).getTime();
  const mins = Math.floor(ms / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(isoString).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
