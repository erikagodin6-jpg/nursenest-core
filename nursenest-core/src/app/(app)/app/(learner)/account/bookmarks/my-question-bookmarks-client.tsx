"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { Bookmark, ExternalLink, Search, Trash2 } from "lucide-react";
import type { QuestionBookmarksPagePayload } from "./actions";
import type { QuestionBookmarkRow } from "@/lib/bookmarks/question-bookmarks";

type SortMode = "date" | "topic" | "difficulty";

export function MyQuestionBookmarksClient({ payload }: { payload: QuestionBookmarksPagePayload }) {
  const [items, setItems] = useState(payload.bookmarks);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [query, setQuery] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("date");
  const [isPending, startTransition] = useTransition();

  const selectedIds = useMemo(() => Object.entries(selected).filter(([, value]) => value).map(([id]) => id), [selected]);
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const rows = needle
      ? items.filter((item) =>
          [
            item.title,
            item.topic,
            item.difficulty,
            item.categoryLabel,
            item.sourceLabel,
          ].some((value) => String(value ?? "").toLowerCase().includes(needle)),
        )
      : [...items];
    return rows.sort((a, b) => {
      if (sortMode === "topic") return (a.topic ?? "").localeCompare(b.topic ?? "") || b.updatedAt.localeCompare(a.updatedAt);
      if (sortMode === "difficulty") return (a.difficulty ?? "").localeCompare(b.difficulty ?? "") || b.updatedAt.localeCompare(a.updatedAt);
      return b.updatedAt.localeCompare(a.updatedAt);
    });
  }, [items, query, sortMode]);

  const mostBookmarkedTopic = payload.mostBookmarkedTopics[0];
  const bulkStudyHref = buildBulkStudyHref(selectedIds.length ? items.filter((item) => selectedIds.includes(item.id)) : filtered);

  function toggleSelected(id: string) {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function removeSelected() {
    if (!selectedIds.length || isPending) return;
    startTransition(async () => {
      const res = await fetch("/api/learner/question-bookmarks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });
      if (!res.ok) return;
      setItems((prev) => prev.filter((item) => !selectedIds.includes(item.id)));
      setSelected({});
    });
  }

  return (
    <section className="space-y-5" aria-label="Saved question bookmarks">
      <div className="grid gap-3 md:grid-cols-3">
        <InsightCard label="Number of bookmarked questions" value={items.length.toLocaleString()} />
        <InsightCard label="Most bookmarked topic" value={mostBookmarkedTopic ? `${mostBookmarkedTopic.topic} (${mostBookmarkedTopic.count})` : "None yet"} />
        <InsightCard label="Weak-area bookmarks" value={items.filter((item) => item.category === "difficult" || item.category === "need_more_practice").length.toLocaleString()} />
      </div>

      <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 shadow-[var(--semantic-shadow-soft)]">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <label className="relative flex min-h-11 flex-1 items-center">
            <Search className="pointer-events-none absolute left-3 h-4 w-4 text-[var(--semantic-text-muted)]" aria-hidden />
            <span className="sr-only">Search bookmarks</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="min-h-11 w-full rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] pl-10 pr-4 text-sm text-[var(--semantic-text-primary)] outline-none transition focus:border-[color-mix(in_srgb,var(--semantic-brand)_38%,var(--semantic-border-soft))] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--semantic-brand)_18%,transparent)]"
              placeholder="Search by topic, source, category, or difficulty"
            />
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={sortMode}
              onChange={(event) => setSortMode(event.target.value as SortMode)}
              className="min-h-11 rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 text-sm font-semibold text-[var(--semantic-text-secondary)]"
              aria-label="Sort bookmarks"
            >
              <option value="date">Sort by date saved</option>
              <option value="topic">Sort by topic</option>
              <option value="difficulty">Sort by difficulty</option>
            </select>
            <Link
              href={bulkStudyHref}
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--semantic-brand)] px-4 text-sm font-semibold text-[var(--semantic-on-brand,var(--semantic-surface))] transition-opacity hover:opacity-90"
            >
              Bulk Study
            </Link>
            <button
              type="button"
              disabled={!selectedIds.length || isPending}
              onClick={removeSelected}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--semantic-danger)_24%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-danger)_6%,var(--semantic-surface))] px-4 text-sm font-semibold text-[var(--semantic-danger)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" aria-hidden />
              Bulk Remove
            </button>
          </div>
        </div>
      </div>

      {filtered.length ? (
        <div className="grid gap-3">
          {filtered.map((bookmark) => (
            <BookmarkCard
              key={bookmark.id}
              bookmark={bookmark}
              selected={Boolean(selected[bookmark.id])}
              onSelected={() => toggleSelected(bookmark.id)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-8 text-center">
          <Bookmark className="mx-auto h-8 w-8 text-[var(--semantic-brand)]" aria-hidden />
          <h2 className="mt-3 text-lg font-bold text-[var(--semantic-text-primary)]">No question bookmarks found</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
            Bookmark questions from flashcards, practice sessions, CAT exams, ECG, pharmacology, or clinical skills to build a focused review list.
          </p>
        </div>
      )}
    </section>
  );
}

function InsightCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 shadow-[var(--semantic-shadow-soft)]">
      <p className="text-[11px] font-semibold text-[var(--semantic-text-muted)]">{label}</p>
      <p className="mt-1 text-lg font-extrabold text-[var(--semantic-text-primary)]">{value}</p>
    </div>
  );
}

function BookmarkCard({
  bookmark,
  selected,
  onSelected,
}: {
  bookmark: QuestionBookmarkRow;
  selected: boolean;
  onSelected: () => void;
}) {
  return (
    <article className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 shadow-[var(--semantic-shadow-soft)]">
      <div className="flex gap-3">
        <input
          type="checkbox"
          checked={selected}
          onChange={onSelected}
          className="mt-1 h-5 w-5 rounded border-[var(--semantic-border-soft)] accent-[var(--semantic-brand)]"
          aria-label={`Select ${bookmark.title}`}
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--semantic-surface))] px-2.5 py-1 text-[11px] font-bold text-[var(--semantic-brand)]">
              {bookmark.categoryLabel}
            </span>
            <span className="rounded-full border border-[var(--semantic-border-soft)] px-2.5 py-1 text-[11px] font-semibold text-[var(--semantic-text-secondary)]">
              {bookmark.sourceLabel}
            </span>
            {bookmark.difficulty ? (
              <span className="text-[11px] font-semibold text-[var(--semantic-text-muted)]">{bookmark.difficulty}</span>
            ) : null}
            <time className="ml-auto text-[11px] text-[var(--semantic-text-muted)]" dateTime={bookmark.updatedAt}>
              {new Date(bookmark.updatedAt).toLocaleDateString()}
            </time>
          </div>
          <h2 className="mt-3 text-base font-bold leading-snug text-[var(--semantic-text-primary)]">{bookmark.title}</h2>
          {bookmark.topic ? (
            <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">Topic: {bookmark.topic}</p>
          ) : null}
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href={bookmark.sourceHref ?? buildSourceHref(bookmark)}
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[var(--semantic-border-soft)] px-3 text-sm font-semibold text-[var(--semantic-brand)]"
            >
              Open Source
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

function buildBulkStudyHref(rows: QuestionBookmarkRow[]): string {
  const first = rows[0];
  if (!first) return "/app/questions/start?studyFilter=bookmarked";
  if (first.sourceType === "flashcard") return "/app/flashcards?studyFilter=bookmarked";
  if (first.sourceType === "cat_exam") return "/app/practice-tests?studyFilter=bookmarked";
  if (first.sourceType === "ecg_question") return "/app/modules/ecg-interpretation/practice";
  return "/app/questions/start?studyFilter=bookmarked";
}

function buildSourceHref(bookmark: QuestionBookmarkRow): string {
  if (bookmark.sourceType === "flashcard") return "/app/flashcards?studyFilter=bookmarked";
  if (bookmark.sourceType === "cat_exam") return "/app/practice-tests";
  if (bookmark.sourceType === "ecg_question") return "/app/modules/ecg-interpretation/practice";
  return "/app/questions";
}
