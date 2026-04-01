"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { asArray } from "@/lib/runtime/collections";

type TagRow = { slug: string; name: string };

type DeckRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  country: string;
  tier: string;
  examFamily: string;
  pathwayId: string | null;
  visibility: string;
  cardCount: number;
  locked: boolean;
  tags?: TagRow[];
};

type Stats = {
  currentStreak: number;
  longestStreak: number;
  cardsReviewedTotal: number;
  lastStudyDate: string | null;
};

type DueSummary = {
  dueToday: number;
  overdue: number;
  learning: number;
  asOf?: string;
};

const EXAM_FAMILIES = ["NCLEX_RN", "NCLEX_PN", "REX_PN", "AANP", "GENERIC"] as const;

export function FlashcardsHubClient({
  pathwayOptions = [],
}: {
  pathwayOptions?: { id: string; label: string }[];
}) {
  const router = useRouter();
  const urlParams = useSearchParams();
  const pathwayId = urlParams.get("pathwayId") ?? "";
  const examFamily = urlParams.get("examFamily") ?? "";
  const tagSlug = urlParams.get("tagSlug") ?? "";
  const q = urlParams.get("q") ?? "";
  const pageFromUrl = urlParams.get("page") ?? "1";
  const [searchDraft, setSearchDraft] = useState(q);

  useEffect(() => {
    setSearchDraft(q);
  }, [q]);

  const [decks, setDecks] = useState<DeckRow[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [dueSummary, setDueSummary] = useState<DueSummary | null>(null);
  const [tagList, setTagList] = useState<TagRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/public/flashcard-tags", { credentials: "include" });
        if (!res.ok) return;
        const j = (await res.json()) as { tags?: TagRow[] };
        setTagList(asArray(j.tags));
      } catch {
        setTagList([]);
      }
    })();
  }, []);

  const load = useCallback(
    async (p: number) => {
      setLoading(true);
      setError(null);
      try {
        const qs = new URLSearchParams({ page: String(p), pageSize: "18" });
        if (pathwayId) qs.set("pathwayId", pathwayId);
        if (examFamily) qs.set("examFamily", examFamily);
        if (tagSlug) qs.set("tagSlug", tagSlug);
        const qTrim = q.trim();
        if (qTrim.length >= 2) qs.set("q", qTrim);
        const [dRes, sRes, dueRes] = await Promise.all([
          fetch(`/api/flashcards/decks?${qs.toString()}`, { credentials: "include" }),
          fetch("/api/flashcards/stats", { credentials: "include" }).catch(() => null),
          fetch("/api/flashcards/due-summary", { credentials: "include" }).catch(() => null),
        ]);
        const dJson = (await dRes.json()) as { decks?: DeckRow[]; error?: string; page?: number; pageCount?: number };
        if (!dRes.ok) throw new Error(dJson.error ?? "Failed to load decks");
        setDecks(asArray(dJson.decks));
        setPage(dJson.page ?? 1);
        setTotalPages(dJson.pageCount ?? 1);
        if (sRes?.ok) {
          const sJson = await sRes.json();
          setStats(sJson);
        } else {
          setStats(null);
        }
        if (dueRes?.ok) {
          const j = (await dueRes.json()) as DueSummary;
          setDueSummary(j);
        } else {
          setDueSummary(null);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error");
        setDecks([]);
      } finally {
        setLoading(false);
      }
    },
    [pathwayId, examFamily, tagSlug, q],
  );

  useEffect(() => {
    const p = Number(pageFromUrl);
    void load(Number.isFinite(p) && p >= 1 ? p : 1);
  }, [load, pageFromUrl, pathwayId, examFamily, tagSlug]);

  const setFilters = (next: {
    pathwayId?: string;
    examFamily?: string;
    tagSlug?: string;
    q?: string;
  }) => {
    const qs = new URLSearchParams(urlParams.toString());
    qs.delete("page");
    if (next.pathwayId !== undefined) {
      if (next.pathwayId) qs.set("pathwayId", next.pathwayId);
      else qs.delete("pathwayId");
    }
    if (next.examFamily !== undefined) {
      if (next.examFamily) qs.set("examFamily", next.examFamily);
      else qs.delete("examFamily");
    }
    if (next.tagSlug !== undefined) {
      if (next.tagSlug) qs.set("tagSlug", next.tagSlug);
      else qs.delete("tagSlug");
    }
    if (next.q !== undefined) {
      const t = next.q.trim();
      if (t.length >= 2) qs.set("q", t);
      else qs.delete("q");
    }
    router.replace(`/app/flashcards?${qs.toString()}`);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-bold tracking-tight text-[var(--theme-heading-text)]">Flashcards</h1>
      <p className="mt-2 text-sm text-[var(--theme-muted-text)]">
        Pathway-scoped decks with spaced repetition. Filter by pathway, exam family, or topic tag. Subscribers get full decks,
        shuffle, and weak-area study from your question stats.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/app/flashcards/weak-areas"
          className="inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          Study weak areas
        </Link>
        <Link
          href="/flashcards"
          className="inline-flex rounded-full border border-border px-4 py-2 text-sm font-semibold text-[var(--theme-heading-text)]"
        >
          Public topic pages (SEO)
        </Link>
      </div>

      <div className="mt-6 grid gap-3 rounded-2xl border border-[var(--theme-card-border)] bg-[var(--theme-card-bg)] p-4 sm:grid-cols-2">
        <label className="block text-xs font-semibold text-[var(--theme-muted-text)]">
          Pathway
          <select
            className="mt-1 w-full rounded-lg border border-border bg-background px-2 py-2 text-sm"
            value={pathwayId}
            onChange={(e) => setFilters({ pathwayId: e.target.value })}
          >
            <option value="">All pathways</option>
            {pathwayOptions.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-xs font-semibold text-[var(--theme-muted-text)]">
          Exam family
          <select
            className="mt-1 w-full rounded-lg border border-border bg-background px-2 py-2 text-sm"
            value={examFamily}
            onChange={(e) => setFilters({ examFamily: e.target.value })}
          >
            <option value="">All</option>
            {EXAM_FAMILIES.map((ef) => (
              <option key={ef} value={ef}>
                {ef.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-xs font-semibold text-[var(--theme-muted-text)] sm:col-span-2">
          Topic tag
          <select
            className="mt-1 w-full rounded-lg border border-border bg-background px-2 py-2 text-sm"
            value={tagSlug}
            onChange={(e) => setFilters({ tagSlug: e.target.value })}
          >
            <option value="">All tags</option>
            {tagList.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-xs font-semibold text-[var(--theme-muted-text)] sm:col-span-2">
          Search decks
          <div className="mt-1 flex gap-2">
            <input
              type="search"
              className="min-w-0 flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm"
              placeholder="Title or description (2+ characters)"
              value={searchDraft}
              onChange={(e) => setSearchDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") setFilters({ q: searchDraft });
              }}
            />
            <button
              type="button"
              className="shrink-0 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium hover:bg-muted/50"
              onClick={() => setFilters({ q: searchDraft })}
            >
              Search
            </button>
          </div>
        </label>
      </div>

      {dueSummary && (dueSummary.dueToday > 0 || dueSummary.overdue > 0 || dueSummary.learning > 0) ? (
        <div className="mt-6 grid grid-cols-3 gap-3 rounded-2xl border border-primary/25 bg-primary/5 p-4 text-center">
          <div>
            <p className="text-2xl font-bold tabular-nums text-primary">{dueSummary.dueToday}</p>
            <p className="text-xs font-medium text-[var(--theme-muted-text)]">Due (today)</p>
          </div>
          <div>
            <p className="text-2xl font-bold tabular-nums text-[var(--theme-heading-text)]">{dueSummary.overdue}</p>
            <p className="text-xs font-medium text-[var(--theme-muted-text)]">Overdue</p>
          </div>
          <div>
            <p className="text-2xl font-bold tabular-nums text-[var(--theme-heading-text)]">{dueSummary.learning}</p>
            <p className="text-xs font-medium text-[var(--theme-muted-text)]">Learning</p>
          </div>
        </div>
      ) : null}

      {stats && (stats.currentStreak > 0 || stats.cardsReviewedTotal > 0) ? (
        <div className="mt-6 grid grid-cols-3 gap-3 rounded-2xl border border-[var(--theme-card-border)] bg-[var(--theme-card-bg)] p-4 text-center">
          <div>
            <p className="text-2xl font-bold tabular-nums text-primary">{stats.currentStreak}</p>
            <p className="text-xs font-medium text-[var(--theme-muted-text)]">Day streak</p>
          </div>
          <div>
            <p className="text-2xl font-bold tabular-nums text-[var(--theme-heading-text)]">{stats.longestStreak}</p>
            <p className="text-xs font-medium text-[var(--theme-muted-text)]">Best streak</p>
          </div>
          <div>
            <p className="text-2xl font-bold tabular-nums text-[var(--theme-heading-text)]">{stats.cardsReviewedTotal}</p>
            <p className="text-xs font-medium text-[var(--theme-muted-text)]">Reviews</p>
          </div>
        </div>
      ) : null}

      {error ? <p className="mt-6 text-sm text-red-600">{error}</p> : null}

      {loading ? <p className="mt-8 text-sm text-[var(--theme-muted-text)]">Loading decks…</p> : null}

      {!loading && decks.length === 0 && !error ? (
        <p className="mt-8 text-sm text-[var(--theme-muted-text)]">
          No decks match these filters. Try clearing filters or explore the{" "}
          <Link href="/app/questions" className="font-semibold text-primary underline">
            question bank
          </Link>
          .
        </p>
      ) : null}

      <ul className="mt-8 space-y-4">
        {decks.map((d) => (
          <li key={d.id} className="nn-card p-4 transition hover:border-primary/30">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  {d.examFamily.replace(/_/g, " ")} · {d.country}
                  {d.pathwayId ? ` · pathway` : ""}
                </p>
                <h2 className="mt-1 text-lg font-semibold text-[var(--theme-heading-text)]">{d.title}</h2>
                {d.description ? (
                  <p className="mt-2 line-clamp-2 text-sm text-[var(--theme-muted-text)]">{d.description}</p>
                ) : null}
                {d.tags && d.tags.length > 0 ? (
                  <p className="mt-2 text-xs text-[var(--theme-muted-text)]">
                    Tags:{" "}
                    {d.tags.map((t) => (
                      <span key={t.slug} className="mr-2 inline-block rounded-full bg-muted px-2 py-0.5">
                        {t.name}
                      </span>
                    ))}
                  </p>
                ) : null}
                <p className="mt-2 text-xs text-[var(--theme-muted-text)]">{d.cardCount} cards</p>
              </div>
              <div className="flex shrink-0 flex-col gap-2 sm:items-end">
                {d.locked ? (
                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                    Subscription required
                  </span>
                ) : null}
                {d.locked ? (
                  <Link
                    href="/pricing"
                    className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:brightness-110"
                  >
                    Subscribe to unlock
                  </Link>
                ) : (
                  <div className="flex flex-col gap-2 sm:items-end">
                    <Link
                      href={`/app/flashcards/${d.slug}`}
                      className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:brightness-110"
                    >
                      Study
                    </Link>
                    <Link
                      href={`/app/flashcards/${d.slug}?shuffle=1`}
                      className="text-center text-xs font-medium text-primary underline"
                    >
                      Study shuffled
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>

      {totalPages > 1 ? (
        <nav className="mt-10 flex items-center justify-between text-sm" aria-label="Deck pagination">
          <button
            type="button"
            disabled={page <= 1 || loading}
            className="font-medium text-primary disabled:opacity-40"
            onClick={() => {
              const qs = new URLSearchParams(urlParams.toString());
              qs.set("page", String(page - 1));
              router.push(`/app/flashcards?${qs.toString()}`);
            }}
          >
            Previous
          </button>
          <span className="text-[var(--theme-muted-text)]">
            Page {page} / {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages || loading}
            className="font-medium text-primary disabled:opacity-40"
            onClick={() => {
              const qs = new URLSearchParams(urlParams.toString());
              qs.set("page", String(page + 1));
              router.push(`/app/flashcards?${qs.toString()}`);
            }}
          >
            Next
          </button>
        </nav>
      ) : null}

      <div className="mt-10 flex flex-wrap gap-2">
        <Link
          href="/app/questions"
          className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold hover:bg-muted/50"
        >
          Question bank
        </Link>
        <Link
          href="/exam-lessons"
          className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold hover:bg-muted/50"
        >
          Exam lessons
        </Link>
      </div>
    </div>
  );
}
