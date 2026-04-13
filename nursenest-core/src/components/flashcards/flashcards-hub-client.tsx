"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { asArray } from "@/lib/runtime/collections";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { FlashcardDeckGrid } from "@/components/study/flashcard-deck-grid";
import { FlashcardFilters, type FlashcardFiltersValue } from "@/components/study/flashcard-filters";
import type { DeckCardRow } from "@/components/study/flashcard-deck-card";
import { countSavedStudyItems } from "@/lib/flashcards/study-session-persistence";

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
type BuilderCategory = { id: string; title: string; description?: string; count: number };
type BuilderMode = "term_to_definition" | "definition_to_term" | "mixed";
type BuilderSummary = {
  pathwayId: string | null;
  selectedCategories: string[];
  matchingCards: number;
  returnedCards: number;
  mode: BuilderMode;
  shuffle: boolean;
  weakOnly: boolean;
  incorrectOnly: boolean;
  starredOnly: boolean;
  savedOnly?: boolean;
  notesOnly?: boolean;
  revisitOnly?: boolean;
  cardLimit: string;
};

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
  const [builderCategories, setBuilderCategories] = useState<BuilderCategory[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [cardLimit, setCardLimit] = useState("20");
  const [studyMode, setStudyMode] = useState<BuilderMode>("mixed");
  const [shuffleOn, setShuffleOn] = useState(true);
  const [weakOnly, setWeakOnly] = useState(false);
  const [incorrectOnly, setIncorrectOnly] = useState(false);
  const [starredOnly, setStarredOnly] = useState(false);
  const [savedOnly, setSavedOnly] = useState(false);
  const [notesOnly, setNotesOnly] = useState(false);
  const [revisitOnly, setRevisitOnly] = useState(false);
  const [savedStats, setSavedStats] = useState({ starred: 0, saved: 0, noted: 0, confusing: 0 });
  const [builderSummary, setBuilderSummary] = useState<BuilderSummary | null>(null);
  const [previewCards, setPreviewCards] = useState<Array<{ id: string; front: string; topic?: string | null }>>([]);
  const [builderLoading, setBuilderLoading] = useState(false);
  const [builderError, setBuilderError] = useState<string | null>(null);

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
  const modeLabel: Record<BuilderMode, string> = {
    term_to_definition: "Active Recall",
    definition_to_term: "Reverse Recall",
    mixed: "Mixed Recall",
  };

  useEffect(() => {
    setSavedStats(countSavedStudyItems());
  }, [starredOnly, savedOnly, notesOnly, revisitOnly]);

  const runBuilderSummary = useCallback(async () => {
    setBuilderLoading(true);
    setBuilderError(null);
    try {
      const params = new URLSearchParams();
      if (filters.pathwayId) params.set("pathwayId", filters.pathwayId);
      if (selectedCategoryIds.length > 0) params.set("categories", selectedCategoryIds.join(","));
      params.set("cardLimit", cardLimit);
      params.set("mode", studyMode);
      if (shuffleOn) params.set("shuffle", "1");
      if (weakOnly) params.set("weakOnly", "1");
      if (incorrectOnly) params.set("incorrectOnly", "1");
      const res = await fetch(`/api/flashcards/custom-session?${params.toString()}`, { credentials: "include" });
      const json = (await res.json()) as {
        summary?: BuilderSummary;
        categoryOptions?: BuilderCategory[];
        unsupportedFilters?: string[];
        error?: string;
      };
      if (!res.ok) throw new Error(json.error ?? "Unable to build custom session.");
      if (json.summary) setBuilderSummary(json.summary);
      setBuilderCategories(json.categoryOptions ?? []);
    } catch (e) {
      setBuilderError(e instanceof Error ? e.message : "Unable to build custom session.");
      setBuilderSummary(null);
      setBuilderCategories([]);
    } finally {
      setBuilderLoading(false);
    }
  }, [filters.pathwayId, selectedCategoryIds, cardLimit, studyMode, shuffleOn, weakOnly, incorrectOnly]);

  useEffect(() => {
    void runBuilderSummary();
  }, [runBuilderSummary]);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(categoryId) ? prev.filter((c) => c !== categoryId) : [...prev, categoryId],
    );
  };

  const builderParams = new URLSearchParams();
  if (filters.pathwayId) builderParams.set("pathwayId", filters.pathwayId);
  if (selectedCategoryIds.length > 0) builderParams.set("categories", selectedCategoryIds.join(","));
  builderParams.set("cardLimit", cardLimit);
  builderParams.set("mode", studyMode);
  if (shuffleOn) builderParams.set("shuffle", "1");
  if (weakOnly) builderParams.set("weakOnly", "1");
  if (incorrectOnly) builderParams.set("incorrectOnly", "1");
  if (starredOnly) builderParams.set("starredOnly", "1");
  if (savedOnly) builderParams.set("savedOnly", "1");
  if (notesOnly) builderParams.set("notesOnly", "1");
  if (revisitOnly) builderParams.set("revisitOnly", "1");
  const startHref = `/app/flashcards/custom?${builderParams.toString()}`;
  const previewCustomCards = async () => {
    setBuilderError(null);
    try {
      const params = new URLSearchParams(builderParams.toString());
      params.set("includeCards", "1");
      const res = await fetch(`/api/flashcards/custom-session?${params.toString()}`, { credentials: "include" });
      const json = (await res.json()) as { cards?: Array<{ id: string; front: string; topic?: string | null }>; error?: string };
      if (!res.ok) throw new Error(json.error ?? "Unable to preview cards.");
      setPreviewCards((json.cards ?? []).slice(0, 5));
    } catch (e) {
      setPreviewCards([]);
      setBuilderError(e instanceof Error ? e.message : "Unable to preview cards.");
    }
  };

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

      {/* Quizlet-style custom builder (primary experience) */}
      <section className="mb-8 rounded-2xl border border-border bg-[var(--theme-card-bg)] p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">Step 1: Build Your Session</p>
        <h2 className="mt-1 text-xl font-bold text-[var(--theme-heading-text)]">Custom Flashcards Study Builder</h2>
        <p className="mt-1 text-sm text-[var(--theme-muted-text)]">
          Choose body systems, customize your study options, then start one mixed session.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="block text-xs font-semibold text-[var(--theme-muted-text)]">
            Pathway
            <select
              className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
              value={filters.pathwayId}
              onChange={(e) => applyFilters({ pathwayId: e.target.value })}
            >
              <option value="">Use my scoped plan</option>
              {pathwayOptions.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-xs font-semibold text-[var(--theme-muted-text)]">
            Number of cards
            <select className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm" value={cardLimit} onChange={(e) => setCardLimit(e.target.value)}>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
              <option value="50">50</option>
              <option value="all">All available</option>
            </select>
          </label>
          <label className="block text-xs font-semibold text-[var(--theme-muted-text)]">
            Study mode
            <select className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm" value={studyMode} onChange={(e) => setStudyMode(e.target.value as BuilderMode)}>
              <option value="term_to_definition">Active Recall</option>
              <option value="definition_to_term">Reverse Recall</option>
              <option value="mixed">Mixed Recall</option>
            </select>
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-xs text-[var(--theme-muted-text)]">
            <input type="checkbox" checked={shuffleOn} onChange={(e) => setShuffleOn(e.target.checked)} />
            Shuffle cards
          </label>
        </div>

        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">Body Systems</p>
          <div className="flex flex-wrap gap-2">
            {builderCategories.map((category) => {
              const selected = selectedCategoryIds.includes(category.id);
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => toggleCategory(category.id)}
                  className="rounded-full border px-3 py-1.5 text-xs font-semibold transition"
                  style={
                    selected
                      ? {
                          borderColor: "var(--semantic-brand)",
                          background: "color-mix(in srgb, var(--semantic-brand) 14%, transparent)",
                          color: "var(--theme-heading-text)",
                        }
                      : {
                          borderColor: "var(--border-subtle)",
                          background: "color-mix(in srgb, var(--semantic-panel-cool) 12%, transparent)",
                          color: "var(--theme-muted-text)",
                        }
                  }
                >
                  {category.title} ({category.count})
                </button>
              );
            })}
          </div>
        </div>

        <details className="mt-4 rounded-xl border border-border bg-muted/10 p-3">
          <summary className="cursor-pointer text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">
            Review Filters
          </summary>
          <p className="mt-2 text-xs text-[var(--theme-muted-text)]">
            Server-backed filters: Weak Areas, Previously Incorrect. Local review filters from this browser: Starred, Saved, Notes, Marked for Revisit.
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <label className="flex items-center gap-2 text-xs text-[var(--theme-muted-text)]">
              <input type="checkbox" checked={weakOnly} onChange={(e) => setWeakOnly(e.target.checked)} />
              Include only weak areas
            </label>
            <label className="flex items-center gap-2 text-xs text-[var(--theme-muted-text)]">
              <input type="checkbox" checked={incorrectOnly} onChange={(e) => setIncorrectOnly(e.target.checked)} />
              Include previously incorrect cards
            </label>
            <label className="flex items-center gap-2 text-xs text-[var(--theme-muted-text)]">
              <input type="checkbox" checked={starredOnly} onChange={(e) => setStarredOnly(e.target.checked)} />
              Starred Only ({savedStats.starred})
            </label>
            <label className="flex items-center gap-2 text-xs text-[var(--theme-muted-text)]">
              <input type="checkbox" checked={savedOnly} onChange={(e) => setSavedOnly(e.target.checked)} />
              Saved Only ({savedStats.saved})
            </label>
            <label className="flex items-center gap-2 text-xs text-[var(--theme-muted-text)]">
              <input type="checkbox" checked={notesOnly} onChange={(e) => setNotesOnly(e.target.checked)} />
              Notes Only ({savedStats.noted})
            </label>
            <label className="flex items-center gap-2 text-xs text-[var(--theme-muted-text)]">
              <input type="checkbox" checked={revisitOnly} onChange={(e) => setRevisitOnly(e.target.checked)} />
              Marked for Revisit ({savedStats.confusing})
            </label>
          </div>
        </details>

        <div className="mt-4 rounded-xl border border-border bg-muted/20 p-3 text-sm text-[var(--theme-muted-text)]">
          <p>
            Pathway: {filters.pathwayId ? pathwayOptions.find((p) => p.id === filters.pathwayId)?.label ?? filters.pathwayId : "Scoped to your entitlement"}
          </p>
          <p>
            Categories: {selectedCategoryIds.length > 0 ? builderCategories.filter((c) => selectedCategoryIds.includes(c.id)).map((c) => c.title).join(", ") : "All available"}
          </p>
          <p>
            Cards: {builderSummary?.returnedCards ?? 0} of {builderSummary?.matchingCards ?? 0} · Mode: {modeLabel[studyMode]} · Shuffle:{" "}
            {shuffleOn ? "On" : "Off"}
          </p>
          {(starredOnly || savedOnly || notesOnly || revisitOnly) ? (
            <p>
              Review Filters: {[
                starredOnly ? "Starred" : null,
                savedOnly ? "Saved" : null,
                notesOnly ? "With Notes" : null,
                revisitOnly ? "Marked for Revisit" : null,
              ]
                .filter(Boolean)
                .join(", ")}{" "}
              (from this browser)
            </p>
          ) : null}
          {(starredOnly || savedOnly || notesOnly || revisitOnly) ? (
            <p>Counts are estimated before local review filters are applied.</p>
          ) : null}
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <Link href={startHref} className="inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
            Start Flashcards
          </Link>
          <button
            type="button"
            onClick={() => void previewCustomCards()}
            className="inline-flex rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-[var(--theme-heading-text)]"
          >
            Preview Cards
          </button>
        </div>
        {builderLoading ? <p className="mt-2 text-xs text-[var(--theme-muted-text)]">Refreshing session options…</p> : null}
        {builderError ? <p className="mt-2 text-xs text-[var(--semantic-danger)]">{builderError}</p> : null}
        {previewCards.length > 0 ? (
          <div className="mt-4 rounded-xl border border-border bg-[var(--theme-card-bg)] p-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">Preview</p>
            <ul className="space-y-2 text-sm">
              {previewCards.map((card) => (
                <li key={card.id} className="rounded-lg border border-border/70 p-2">
                  <p className="font-medium text-[var(--theme-heading-text)]">{card.front}</p>
                  {card.topic ? <p className="text-xs text-[var(--theme-muted-text)]">{card.topic}</p> : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

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

      {/* Ready-made decks (secondary) */}
      <h2 className="mb-2 text-lg font-semibold text-[var(--theme-heading-text)]">Browse Ready-Made Decks</h2>
      <p className="mb-4 text-sm text-[var(--theme-muted-text)]">
        Prebuilt decks are still available, but the custom builder above is the primary study flow.
      </p>

      {/* Deck filters */}
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
