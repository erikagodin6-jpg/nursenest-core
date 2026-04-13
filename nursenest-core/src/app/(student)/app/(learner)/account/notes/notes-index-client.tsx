"use client";

/**
 * NotesIndexClient
 *
 * Interactive tab/filter controller and paginated note list for the Notes Index page.
 *
 * Receives initial data from the RSC page and uses Server Actions for "Load more".
 *
 * Design surfaces:
 *   - Hero:             --surface-emphasis
 *   - Summary cards:    mixed soft surfaces
 *   - Notes list:       --surface-soft-a
 *   - Bookmarks list:   --surface-soft-c (via HighlightsList)
 *   - Saved rationales: --surface-soft-b (via HighlightsList)
 */

import { useState, useTransition } from "react";
import Link from "next/link";
import type { NoteRow, NotesPagePayload } from "@/lib/learner/notes-index-types";
import { HighlightsList } from "@/components/study/highlights-list";
import { PremiumEmptyState } from "@/components/ui/premium-empty-state";
import { loadMoreNotes, loadFilteredNotes } from "./actions";
import { BROWSE_LESSONS_CTA, BROWSE_QUESTIONS_CTA } from "@/lib/copy/cta-copy";
import { emptyStateCopy } from "@/lib/ui/empty-state-copy";

// ── Search helpers ────────────────────────────────────────────────────────────

function matchesSearch(note: NoteRow, q: string): boolean {
  if (!q) return true;
  const lower = q.toLowerCase();
  return (
    (note.title?.toLowerCase().includes(lower) ?? false) ||
    note.bodySnippet.toLowerCase().includes(lower) ||
    (note.topic?.toLowerCase().includes(lower) ?? false) ||
    note.scopeLabel.toLowerCase().includes(lower)
  );
}

// ── Filter tabs ───────────────────────────────────────────────────────────────

type FilterTab = "all" | "bookmarks" | "rationales";

const TAB_LABELS: Record<FilterTab, string> = {
  all: "All notes",
  bookmarks: "Bookmarks",
  rationales: "Saved rationales",
};

// ── NoteListCard ──────────────────────────────────────────────────────────────

function NoteListCard({ note }: { note: NoteRow }) {
  const scopeColors: Record<string, string> = {
    PATHWAY_LESSON: "var(--semantic-info)",
    CONTENT_LESSON: "var(--semantic-info)",
    QUESTION_BANK: "var(--semantic-warning)",
    PRACTICE_TEST: "var(--semantic-brand)",
    FLASHCARD_DECK: "var(--semantic-success)",
  };
  const accentColor = scopeColors[note.scope] ?? "var(--semantic-brand)";

  return (
    <div
      className="group overflow-hidden rounded-2xl transition-shadow hover:shadow-sm"
      style={{
        background: "var(--surface-soft-a, color-mix(in srgb, var(--theme-primary) 3.5%, var(--bg-page)))",
        border: `1px solid color-mix(in srgb, ${accentColor} 15%, var(--semantic-border-soft))`,
      }}
    >
      {/* Left accent stripe */}
      <div className="flex min-h-[72px]">
        <div
          className="w-1 shrink-0 rounded-l-2xl"
          style={{ background: accentColor }}
          aria-hidden
        />
        <div className="flex min-w-0 flex-1 flex-col gap-1 px-4 py-3">
          {/* Top meta row */}
          <div className="flex items-center gap-2">
            <span
              className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
              style={{
                background: `color-mix(in srgb, ${accentColor} 10%, var(--semantic-surface))`,
                color: accentColor,
              }}
            >
              {note.isBookmark
                ? "Bookmark"
                : note.isSavedRationale
                  ? "Saved rationale"
                  : note.scopeLabel}
            </span>
            {note.topic && (
              <span
                className="truncate text-[9px] font-medium"
                style={{ color: "var(--semantic-text-muted)" }}
              >
                {note.topic}
              </span>
            )}
            <time
              dateTime={note.updatedAt}
              className="ml-auto shrink-0 text-[10px]"
              style={{ color: "var(--semantic-text-muted)" }}
            >
              {formatRelativeDate(note.updatedAt)}
            </time>
          </div>

          {/* Title or snippet */}
          <p
            className="truncate text-sm font-semibold leading-snug"
            style={{ color: "var(--semantic-text-primary)" }}
          >
            {note.title ?? note.bodySnippet.slice(0, 80)}
          </p>

          {/* Body snippet */}
          {!note.isBookmark && note.bodySnippet && (
            <p
              className="line-clamp-2 text-[11px] leading-relaxed"
              style={{ color: "var(--semantic-text-secondary)" }}
            >
              {note.bodySnippet}
            </p>
          )}

          {/* Source link */}
          <div className="mt-0.5">
            <Link
              href={note.href}
              className="text-[10px] font-medium transition-opacity hover:opacity-80 focus-visible:outline-none rounded"
              style={{ color: "var(--semantic-brand)" }}
            >
              View source →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── NotesList ─────────────────────────────────────────────────────────────────

function NotesList({
  initialItems,
  initialHasMore,
  initialCursor,
  filter,
  searchQuery,
}: {
  initialItems: NoteRow[];
  initialHasMore: boolean;
  initialCursor: string | null;
  filter: FilterTab;
  searchQuery: string;
}) {
  const [items, setItems] = useState(initialItems);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [cursor, setCursor] = useState(initialCursor);
  const [isPending, startTransition] = useTransition();

  const filtered = searchQuery
    ? items.filter((n) => matchesSearch(n, searchQuery))
    : items;

  function handleLoadMore() {
    if (!cursor || !hasMore || isPending) return;
    const currentCursor = cursor;
    startTransition(async () => {
      const result = await loadMoreNotes(currentCursor, filter);
      setItems((prev) => [...prev, ...result.notes]);
      setHasMore(result.hasMore);
      setCursor(result.cursor);
    });
  }

  if (filtered.length === 0) {
    const saved = emptyStateCopy.noSavedNotes();
    if (searchQuery.trim()) {
      return (
        <PremiumEmptyState
          data-nn-empty="notes-search"
          brandMark="leaf"
          tone="early"
          density="compact"
          headline="No matching notes"
          body="Nothing matched your search. Try fewer words or clear the search box."
          primaryCta={{ label: BROWSE_LESSONS_CTA, href: "/app/lessons", variant: "primary" }}
          secondaryCtas={[{ label: BROWSE_QUESTIONS_CTA, href: "/app/questions", variant: "secondary" }]}
          visualLayout="stack"
          ctaLayout="stack"
        />
      );
    }
    if (filter !== "all") {
      return (
        <PremiumEmptyState
          data-nn-empty="notes-filter"
          brandMark="leaf"
          tone="early"
          density="compact"
          headline="Nothing in this view yet"
          body="Switch to another tab or return to all notes to see what you have saved."
          primaryCta={{ label: "View all notes", href: "/app/account/notes", variant: "primary" }}
          secondaryCtas={[{ label: BROWSE_LESSONS_CTA, href: "/app/lessons", variant: "secondary" }]}
          visualLayout="stack"
          ctaLayout="stack"
        />
      );
    }
    return (
      <PremiumEmptyState
        data-nn-empty="notes-none"
        brandMark="leaf"
        tone="early"
        density="compact"
        headline={saved.headline}
        body={saved.body}
        hint={saved.hint}
        primaryCta={{ label: BROWSE_LESSONS_CTA, href: "/app/lessons", variant: "primary" }}
        secondaryCtas={[{ label: BROWSE_QUESTIONS_CTA, href: "/app/questions", variant: "secondary" }]}
        visualLayout="stack"
        ctaLayout="stack"
      />
    );
  }

  return (
    <div className="space-y-2.5">
      {filtered.map((note) => (
        <NoteListCard key={note.id} note={note} />
      ))}
      {hasMore && (
        <div className="flex justify-center pt-2">
          <button
            type="button"
            disabled={isPending}
            onClick={handleLoadMore}
            className="rounded-full px-5 py-2 text-sm font-semibold transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50"
            style={{
              background: "color-mix(in srgb, var(--semantic-brand) 10%, var(--semantic-surface))",
              border: "1px solid color-mix(in srgb, var(--semantic-brand) 25%, transparent)",
              color: "var(--semantic-brand)",
            }}
          >
            {isPending ? "Loading…" : "Load more notes"}
          </button>
        </div>
      )}
    </div>
  );
}

// ── NotesIndexClient ──────────────────────────────────────────────────────────

export type NotesIndexClientProps = {
  payload: NotesPagePayload;
  userId: string;
};

export function NotesIndexClient({ payload, userId: _userId }: NotesIndexClientProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Bookmark / rationale state lazy-loaded when tabs open
  const [bookmarkItems, setBookmarkItems] = useState<NoteRow[] | null>(null);
  const [bookmarkHasMore, setBookmarkHasMore] = useState(false);
  const [bookmarkCursor, setBookmarkCursor] = useState<string | null>(null);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  const [rationaleItems, setRationaleItems] = useState<NoteRow[] | null>(null);
  const [rationaleHasMore, setRationaleHasMore] = useState(false);
  const [rationaleCursor, setRationaleCursor] = useState<string | null>(null);
  const [rationaleLoading, setRationaleLoading] = useState(false);

  async function handleTabChange(tab: FilterTab) {
    setActiveTab(tab);
    if (tab === "bookmarks" && bookmarkItems === null && !bookmarkLoading) {
      setBookmarkLoading(true);
      const res = await loadFilteredNotes(_userId, "bookmarks");
      setBookmarkItems(res.notes);
      setBookmarkHasMore(res.hasMore);
      setBookmarkCursor(res.cursor);
      setBookmarkLoading(false);
    }
    if (tab === "rationales" && rationaleItems === null && !rationaleLoading) {
      setRationaleLoading(true);
      const res = await loadFilteredNotes(_userId, "rationales");
      setRationaleItems(res.notes);
      setRationaleHasMore(res.hasMore);
      setRationaleCursor(res.cursor);
      setRationaleLoading(false);
    }
  }

  async function handleLoadMoreBookmarks() {
    if (!bookmarkCursor) return { items: [], hasMore: false };
    const res = await loadMoreNotes(bookmarkCursor, "bookmarks");
    setBookmarkItems((prev) => [...(prev ?? []), ...res.notes]);
    setBookmarkHasMore(res.hasMore);
    setBookmarkCursor(res.cursor);
    return { items: res.notes, hasMore: res.hasMore };
  }

  async function handleLoadMoreRationales() {
    if (!rationaleCursor) return { items: [], hasMore: false };
    const res = await loadMoreNotes(rationaleCursor, "rationales");
    setRationaleItems((prev) => [...(prev ?? []), ...res.notes]);
    setRationaleHasMore(res.hasMore);
    setRationaleCursor(res.cursor);
    return { items: res.notes, hasMore: res.hasMore };
  }

  return (
    <div className="space-y-6">
      {/* ── Summary cards ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <SummaryCard
          label="Total notes"
          value={payload.total}
          accentColor="var(--semantic-brand)"
          surface="var(--surface-soft-a, color-mix(in srgb, var(--theme-primary) 3.5%, var(--bg-page)))"
        />
        <SummaryCard
          label="Section notes"
          value={payload.sectionNoteCount}
          accentColor="var(--semantic-chart-2, var(--semantic-brand))"
          surface="color-mix(in srgb, var(--semantic-chart-2, var(--semantic-brand)) 5%, var(--bg-card))"
        />
        <SummaryCard
          label="Bookmarks"
          value={payload.bookmarkCount}
          accentColor="var(--semantic-info)"
          surface="var(--surface-soft-c, color-mix(in srgb, var(--semantic-info) 5%, var(--bg-card)))"
        />
        <SummaryCard
          label="Saved rationales"
          value={payload.rationaleCount}
          accentColor="var(--semantic-success)"
          surface="var(--surface-soft-b, color-mix(in srgb, var(--semantic-success) 5%, var(--bg-card)))"
        />
      </div>

      {/* ── Search bar ────────────────────────────────────────────────────── */}
      <div className="relative">
        <span
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm"
          style={{ color: "var(--semantic-text-muted)" }}
          aria-hidden="true"
        >
          🔍
        </span>
        <input
          type="search"
          placeholder="Search your notes, topics, or source…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border bg-transparent py-2.5 pl-9 pr-4 text-sm transition-colors focus:outline-none focus:ring-1"
          style={{
            background: "var(--semantic-surface)",
            borderColor: "var(--semantic-border-soft)",
            color: "var(--semantic-text-primary)",
          }}
          aria-label="Search notes"
        />
        {searchQuery ? (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs"
            style={{ color: "var(--semantic-text-muted)" }}
            aria-label="Clear search"
          >
            ✕
          </button>
        ) : null}
      </div>

      {/* ── Tab bar ───────────────────────────────────────────────────────── */}
      <div
        className="flex gap-1 rounded-2xl p-1"
        style={{ background: "var(--semantic-surface)", border: "1px solid var(--semantic-border-soft)" }}
        role="tablist"
        aria-label="Notes filter"
      >
        {(Object.keys(TAB_LABELS) as FilterTab[]).map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeTab === tab}
            type="button"
            onClick={() => void handleTabChange(tab)}
            className="flex-1 rounded-xl py-2 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2"
            style={
              activeTab === tab
                ? {
                    background: "var(--semantic-brand)",
                    color: "var(--semantic-on-brand, white)",
                  }
                : {
                    background: "transparent",
                    color: "var(--semantic-text-muted)",
                  }
            }
          >
            {TAB_LABELS[tab]}
          </button>
        ))}
      </div>

      {/* ── Tab panels ───────────────────────────────────────────────────── */}

      {/* All notes */}
      {activeTab === "all" && (
        <section aria-label="All notes">
          <NotesList
            initialItems={payload.notes}
            initialHasMore={payload.hasMore}
            initialCursor={payload.cursor}
            filter="all"
            searchQuery={searchQuery}
          />
        </section>
      )}

      {/* Bookmarks */}
      {activeTab === "bookmarks" && (
        <section aria-label="Bookmarked sections">
          {bookmarkLoading ? (
            <SkeletonList />
          ) : (
            <HighlightsList
              items={bookmarkItems ?? []}
              hasMore={bookmarkHasMore}
              onLoadMore={handleLoadMoreBookmarks}
              variant="bookmarks"
            />
          )}
        </section>
      )}

      {/* Saved rationales */}
      {activeTab === "rationales" && (
        <section aria-label="Saved rationales">
          {rationaleLoading ? (
            <SkeletonList />
          ) : (
            <HighlightsList
              items={rationaleItems ?? []}
              hasMore={rationaleHasMore}
              onLoadMore={handleLoadMoreRationales}
              variant="rationales"
            />
          )}
        </section>
      )}
    </div>
  );
}

// ── SummaryCard ───────────────────────────────────────────────────────────────

function SummaryCard({
  label,
  value,
  accentColor,
  surface,
}: {
  label: string;
  value: number;
  accentColor: string;
  surface: string;
}) {
  return (
    <div
      className="rounded-2xl px-4 py-3"
      style={{
        background: surface,
        border: `1px solid color-mix(in srgb, ${accentColor} 18%, var(--semantic-border-soft))`,
      }}
    >
      <p
        className="text-2xl font-extrabold tabular-nums"
        style={{ color: accentColor }}
      >
        {value.toLocaleString()}
      </p>
      <p className="mt-0.5 text-[11px] font-medium" style={{ color: "var(--semantic-text-muted)" }}>
        {label}
      </p>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function SkeletonList() {
  return (
    <div className="space-y-2.5">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-20 animate-pulse rounded-2xl"
          style={{ background: "var(--semantic-border-soft)" }}
        />
      ))}
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
