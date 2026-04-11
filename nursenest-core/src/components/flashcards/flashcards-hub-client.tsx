"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { asArray } from "@/lib/runtime/collections";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { FlashcardDeckGrid } from "@/components/study/flashcard-deck-grid";
import { FlashcardFilters, type FlashcardFiltersValue } from "@/components/study/flashcard-filters";
import type { DeckCardRow } from "@/components/study/flashcard-deck-card";

type TagRow = { slug: string; name: string };

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

type ApiDeckRow = DeckCardRow & { tags?: TagRow[] };

export function FlashcardsHubClient({
  pathwayOptions = [],
}: {
  pathwayOptions?: { id: string; label: string }[];
}) {
  const { t } = useMarketingI18n();
  const router = useRouter();
  const urlParams = useSearchParams();

  // Derive filters from URL
  const pathwayId = urlParams.get("pathwayId") ?? "";
  const examFamily = urlParams.get("examFamily") ?? "";
  const tagSlug = urlParams.get("tagSlug") ?? "";
  const q = urlParams.get("q") ?? "";
  const pageFromUrl = urlParams.get("page") ?? "1";

  const [filters, setFiltersState] = useState<FlashcardFiltersValue>({
    source: "",
    pathwayId,
    examFamily,
    tagSlug,
    q,
  });

  // Keep filter state in sync with URL changes (browser back/forward)
  useEffect(() => {
    setFiltersState({
      source: "",
      pathwayId,
      examFamily,
      tagSlug,
      q,
    });
  }, [pathwayId, examFamily, tagSlug, q]);

  const [decks, setDecks] = useState<ApiDeckRow[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [dueSummary, setDueSummary] = useState<DueSummary | null>(null);
  const [tagList, setTagList] = useState<TagRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Debounce timer for search input
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    async (p: number, f: FlashcardFiltersValue) => {
      setLoading(true);
      setError(null);
      try {
        const qs = new URLSearchParams({ page: String(p), pageSize: "18" });
        if (f.pathwayId) qs.set("pathwayId", f.pathwayId);
        if (f.examFamily) qs.set("examFamily", f.examFamily);
        if (f.tagSlug) qs.set("tagSlug", f.tagSlug);
        const qTrim = f.q.trim();
        if (qTrim.length >= 2) qs.set("q", qTrim);
        const [dRes, sRes, dueRes] = await Promise.all([
          fetch(`/api/flashcards/decks?${qs.toString()}`, { credentials: "include" }),
          fetch("/api/flashcards/stats", { credentials: "include" }).catch(() => null),
          fetch("/api/flashcards/due-summary", { credentials: "include" }).catch(() => null),
        ]);
        const dJson = (await dRes.json()) as {
          decks?: ApiDeckRow[];
          error?: string;
          page?: number;
          pageCount?: number;
        };
        if (!dRes.ok) throw new Error(dJson.error ?? t("learner.flashcards.hub.loadDecksFailed"));
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
        setError(e instanceof Error ? e.message : t("learner.error.app.title"));
        setDecks([]);
      } finally {
        setLoading(false);
      }
    },
    [t],
  );

  useEffect(() => {
    const p = Number(pageFromUrl);
    void load(Number.isFinite(p) && p >= 1 ? p : 1, filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load, pageFromUrl, pathwayId, examFamily, tagSlug, q]);

  const applyFilters = useCallback(
    (next: Partial<FlashcardFiltersValue>) => {
      const updated = { ...filters, ...next };
      setFiltersState(updated);

      // Debounce search changes; push others immediately
      if ("q" in next) {
        if (searchTimer.current) clearTimeout(searchTimer.current);
        searchTimer.current = setTimeout(() => {
          pushFiltersToUrl(updated);
        }, 400);
      } else {
        pushFiltersToUrl(updated);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filters, router, urlParams],
  );

  const pushFiltersToUrl = (f: FlashcardFiltersValue) => {
    const qs = new URLSearchParams();
    if (f.pathwayId) qs.set("pathwayId", f.pathwayId);
    if (f.examFamily) qs.set("examFamily", f.examFamily);
    if (f.tagSlug) qs.set("tagSlug", f.tagSlug);
    const qTrim = f.q.trim();
    if (qTrim.length >= 2) qs.set("q", qTrim);
    router.replace(`/app/flashcards?${qs.toString()}`);
  };

  // Client-side source filtering (DeckDisplaySource derived from tags/slug)
  // We filter client-side here because the API doesn't have a source= param.
  const visibleDecks =
    filters.source === ""
      ? decks
      : decks.filter((d) => {
          // Use the same derivation as FlashcardDeckCard
          const tags = d.tags ?? [];
          const tagSlugs = tags.map((t) => t.slug);
          const slug = d.slug;
          if (filters.source === "Rationale-Derived")
            return tagSlugs.some((s) => s.includes("rationale")) || slug.includes("rationale");
          if (filters.source === "Weak Areas")
            return tagSlugs.some((s) => s.includes("weak") || s.includes("missed")) || slug.includes("weak") || slug.includes("missed");
          if (filters.source === "Lesson Concepts")
            return tagSlugs.some((s) => s.includes("lesson") || s.includes("concept")) || slug.includes("lesson") || slug.includes("concept");
          if (filters.source === "Definitions")
            return tagSlugs.some((s) => s.includes("definition") || s.includes("term")) || slug.includes("definition");
          return true;
        });

  const totalDue = (dueSummary?.dueToday ?? 0) + (dueSummary?.overdue ?? 0);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Page header */}
      <div className="mb-8">
        <h1
          className="text-3xl font-bold tracking-tight"
          style={{ color: "var(--theme-heading-text)" }}
        >
          {t("learner.flashcards.hub.title")}
        </h1>
        <p className="mt-2 text-sm" style={{ color: "var(--theme-muted-text)" }}>
          {t("learner.flashcards.hub.subtitle")}
        </p>

        {/* Quick-action CTAs */}
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/app/flashcards/weak-areas"
            className="inline-flex rounded-full px-4 py-2 text-sm font-semibold transition"
            style={{
              background: "var(--role-cta, var(--theme-primary))",
              color: "var(--role-cta-foreground, #fff)",
            }}
          >
            {t("learner.flashcards.hub.weakAreasCta")}
          </Link>
          <Link
            href="/flashcards"
            className="inline-flex rounded-full border px-4 py-2 text-sm font-semibold transition hover:opacity-80"
            style={{
              borderColor: "var(--border-subtle, var(--theme-card-border))",
              color: "var(--theme-heading-text)",
            }}
          >
            {t("learner.flashcards.hub.publicSeoCta")}
          </Link>
        </div>
      </div>

      {/* Stats hero — due summary + study streak */}
      {(dueSummary || stats) ? (
        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          {dueSummary ? (
            <div
              className="rounded-2xl p-5"
              style={{
                background:
                  "color-mix(in srgb, var(--surface-emphasis, var(--theme-primary)) 8%, var(--bg-card, var(--theme-card-bg)))",
                border:
                  "1px solid color-mix(in srgb, var(--surface-emphasis, var(--theme-primary)) 18%, transparent)",
              }}
            >
              <p
                className="mb-3 text-xs font-semibold uppercase tracking-wide"
                style={{ color: "var(--theme-muted-text)" }}
              >
                Due for review
              </p>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p
                    className="text-2xl font-bold tabular-nums"
                    style={{ color: "var(--semantic-info, #0284c7)" }}
                  >
                    {dueSummary.dueToday}
                  </p>
                  <p className="mt-0.5 text-[10px] font-medium" style={{ color: "var(--theme-muted-text)" }}>
                    {t("learner.flashcards.hub.dueToday")}
                  </p>
                </div>
                <div>
                  <p
                    className="text-2xl font-bold tabular-nums"
                    style={{ color: dueSummary.overdue > 0 ? "var(--semantic-danger, #ef4444)" : "var(--theme-heading-text)" }}
                  >
                    {dueSummary.overdue}
                  </p>
                  <p className="mt-0.5 text-[10px] font-medium" style={{ color: "var(--theme-muted-text)" }}>
                    {t("learner.flashcards.hub.overdue")}
                  </p>
                </div>
                <div>
                  <p
                    className="text-2xl font-bold tabular-nums"
                    style={{ color: "var(--semantic-success, #22c55e)" }}
                  >
                    {dueSummary.learning}
                  </p>
                  <p className="mt-0.5 text-[10px] font-medium" style={{ color: "var(--theme-muted-text)" }}>
                    {t("learner.flashcards.hub.learning")}
                  </p>
                </div>
              </div>
              {totalDue > 0 ? (
                <Link
                  href="/app/flashcards/weak-areas"
                  className="mt-4 block w-full rounded-xl py-2 text-center text-xs font-semibold transition"
                  style={{
                    background:
                      "color-mix(in srgb, var(--surface-emphasis, var(--theme-primary)) 16%, transparent)",
                    color: "var(--theme-heading-text)",
                    border:
                      "1px solid color-mix(in srgb, var(--surface-emphasis, var(--theme-primary)) 25%, transparent)",
                  }}
                >
                  Review {totalDue} due now →
                </Link>
              ) : null}
            </div>
          ) : null}

          {stats && (stats.currentStreak > 0 || stats.cardsReviewedTotal > 0) ? (
            <div
              className="rounded-2xl p-5"
              style={{
                background:
                  "color-mix(in srgb, var(--surface-soft-b, var(--theme-primary)) 6%, var(--bg-card, var(--theme-card-bg)))",
                border: "1px solid var(--border-subtle, var(--theme-card-border))",
              }}
            >
              <p
                className="mb-3 text-xs font-semibold uppercase tracking-wide"
                style={{ color: "var(--theme-muted-text)" }}
              >
                Study progress
              </p>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p
                    className="text-2xl font-bold tabular-nums"
                    style={{ color: "var(--semantic-chart-3, #a78bfa)" }}
                  >
                    {stats.currentStreak}
                  </p>
                  <p className="mt-0.5 text-[10px] font-medium" style={{ color: "var(--theme-muted-text)" }}>
                    {t("learner.flashcards.hub.dayStreak")}
                  </p>
                </div>
                <div>
                  <p
                    className="text-2xl font-bold tabular-nums"
                    style={{ color: "var(--theme-heading-text)" }}
                  >
                    {stats.longestStreak}
                  </p>
                  <p className="mt-0.5 text-[10px] font-medium" style={{ color: "var(--theme-muted-text)" }}>
                    {t("learner.flashcards.hub.bestStreak")}
                  </p>
                </div>
                <div>
                  <p
                    className="text-2xl font-bold tabular-nums"
                    style={{ color: "var(--theme-heading-text)" }}
                  >
                    {stats.cardsReviewedTotal}
                  </p>
                  <p className="mt-0.5 text-[10px] font-medium" style={{ color: "var(--theme-muted-text)" }}>
                    {t("learner.flashcards.hub.reviews")}
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {/* Filters */}
      <div
        className="mb-8 rounded-2xl p-5"
        style={{
          background:
            "color-mix(in srgb, var(--surface-soft-a, var(--theme-primary)) 5%, var(--bg-card, var(--theme-card-bg)))",
          border: "1px solid var(--border-subtle, var(--theme-card-border))",
        }}
      >
        <FlashcardFilters
          value={filters}
          onChange={applyFilters}
          pathwayOptions={pathwayOptions}
          tagList={tagList}
        />
      </div>

      {/* Error */}
      {error ? (
        <p className="mb-6 text-sm" style={{ color: "var(--semantic-danger, #ef4444)" }}>
          {error}
        </p>
      ) : null}

      {/* Deck grid */}
      <FlashcardDeckGrid
        decks={visibleDecks}
        loading={loading}
        emptyMessage={
          filters.source
            ? `No ${filters.source} decks found. Try a different filter.`
            : t("learner.flashcards.hub.loadingDecks")
        }
      />

      {/* Pagination */}
      {totalPages > 1 && !loading ? (
        <nav
          className="mt-10 flex items-center justify-between text-sm"
          aria-label={t("learner.flashcards.hub.paginationAria")}
        >
          <button
            type="button"
            disabled={page <= 1 || loading}
            className="font-medium disabled:opacity-40"
            style={{ color: "var(--theme-primary)" }}
            onClick={() => {
              const qs = new URLSearchParams(urlParams.toString());
              qs.set("page", String(page - 1));
              router.push(`/app/flashcards?${qs.toString()}`);
            }}
          >
            {t("learner.flashcards.hub.previous")}
          </button>
          <span style={{ color: "var(--theme-muted-text)" }}>
            {t("learner.flashcards.hub.pageOf", { page, total: totalPages })}
          </span>
          <button
            type="button"
            disabled={page >= totalPages || loading}
            className="font-medium disabled:opacity-40"
            style={{ color: "var(--theme-primary)" }}
            onClick={() => {
              const qs = new URLSearchParams(urlParams.toString());
              qs.set("page", String(page + 1));
              router.push(`/app/flashcards?${qs.toString()}`);
            }}
          >
            {t("learner.flashcards.hub.next")}
          </button>
        </nav>
      ) : null}

      {/* Bottom cross-links */}
      <div className="mt-10 flex flex-wrap gap-2">
        <Link
          href="/app/questions"
          className="rounded-full border px-4 py-2 text-sm font-semibold transition hover:opacity-80"
          style={{
            borderColor: "var(--border-subtle, var(--theme-card-border))",
            color: "var(--theme-heading-text)",
          }}
        >
          {t("learner.flashcards.hub.bottomQuestionBank")}
        </Link>
        <Link
          href="/lessons"
          className="rounded-full border px-4 py-2 text-sm font-semibold transition hover:opacity-80"
          style={{
            borderColor: "var(--border-subtle, var(--theme-card-border))",
            color: "var(--theme-heading-text)",
          }}
        >
          {t("learner.flashcards.hub.bottomExamLessons")}
        </Link>
        <Link
          href="/app/review"
          className="rounded-full border px-4 py-2 text-sm font-semibold transition hover:opacity-80"
          style={{
            borderColor: "var(--border-subtle, var(--theme-card-border))",
            color: "var(--theme-heading-text)",
          }}
        >
          Spaced Review Queue
        </Link>
      </div>
    </div>
  );
}
