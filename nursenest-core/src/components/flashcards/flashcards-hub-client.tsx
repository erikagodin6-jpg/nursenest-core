"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { asArray } from "@/lib/runtime/collections";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { FlashcardDeckGrid } from "@/components/study/flashcard-deck-grid";
import { FlashcardFilters, type FlashcardFiltersValue } from "@/components/study/flashcard-filters";
import type { DeckCardRow } from "@/components/study/flashcard-deck-card";
import { countSavedStudyItems } from "@/lib/flashcards/study-session-persistence";
import { formatTitleCase } from "@/lib/format/text-case";
import { pathwayHubAppQuestionsHref } from "@/lib/marketing/pathway-hub-app-questions-href";

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
  topicCode?: string | null;
  lessonId?: string | null;
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

const panelShellStyle: CSSProperties = {
  borderColor: "color-mix(in srgb, var(--semantic-brand) 24%, var(--semantic-border-soft))",
  background: "color-mix(in srgb, var(--semantic-panel-cool) 38%, var(--theme-card-bg))",
  boxShadow: "var(--semantic-shadow-soft)",
};

const innerWellStyle: CSSProperties = {
  borderColor: "var(--semantic-border-soft)",
  background: "color-mix(in srgb, var(--semantic-surface) 88%, var(--theme-card-bg))",
};

const fieldLabelClass =
  "block text-[11px] font-bold uppercase tracking-wider text-[var(--semantic-text-secondary)]";
const controlClass =
  "mt-1.5 w-full rounded-xl border-2 px-3 py-2.5 text-sm font-medium text-[var(--semantic-text-primary)] bg-[var(--theme-card-bg)] border-[var(--semantic-border-soft)] shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_45%,transparent)]";

export function FlashcardsHubClient({
  pathwayOptions = [],
  practiceQuestionsHref,
}: {
  pathwayOptions?: { id: string; label: string }[];
  /** Server-resolved tier-scoped question bank entry; URL `pathwayId` overrides when present. */
  practiceQuestionsHref: string;
}) {
  const { t } = useMarketingI18n();
  const router = useRouter();
  const urlParams = useSearchParams();

  // Derive filters from URL
  const pathwayId = urlParams.get("pathwayId") ?? "";
  const quickQuestionBankHref =
    pathwayId.trim().length > 0 ? pathwayHubAppQuestionsHref(pathwayId.trim()) : practiceQuestionsHref;
  const weakAreasStudyHref =
    pathwayId.trim().length > 0
      ? `/app/flashcards/weak-areas?pathwayId=${encodeURIComponent(pathwayId.trim())}`
      : "/app/flashcards/weak-areas";
  const topicCodeFromUrl = urlParams.get("topicCode") ?? "";
  const examFamily = urlParams.get("examFamily") ?? "";
  const tagSlug = urlParams.get("tagSlug") ?? "";
  const q = urlParams.get("q") ?? "";
  const pageFromUrl = urlParams.get("page") ?? "1";

  const [filters, setFiltersState] = useState<FlashcardFiltersValue>({
    source: "",
    pathwayId,
    topicCode: topicCodeFromUrl,
    examFamily,
    tagSlug,
    q,
  });

  // Keep filter state in sync with URL changes (browser back/forward)
  useEffect(() => {
    setFiltersState({
      source: "",
      pathwayId,
      topicCode: topicCodeFromUrl,
      examFamily,
      tagSlug,
      q,
    });
  }, [pathwayId, topicCodeFromUrl, examFamily, tagSlug, q]);

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
        if (f.topicCode.trim()) qs.set("topicCode", f.topicCode.trim().toLowerCase());
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
  }, [load, pageFromUrl, pathwayId, topicCodeFromUrl, examFamily, tagSlug, q]);

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
    if (f.topicCode.trim()) qs.set("topicCode", f.topicCode.trim().toLowerCase());
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
          const tagSlugs = tags.map((tg) => tg.slug);
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
  const isNpPathwayFilter = filters.pathwayId.includes("-np-");
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
      if (filters.topicCode.trim()) params.set("topicCode", filters.topicCode.trim().toLowerCase());
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
  }, [filters.pathwayId, filters.topicCode, selectedCategoryIds, cardLimit, studyMode, shuffleOn, weakOnly, incorrectOnly]);

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
  if (filters.topicCode.trim()) builderParams.set("topicCode", filters.topicCode.trim().toLowerCase());
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
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight" style={{ color: "var(--theme-heading-text)" }}>
          {t("learner.flashcards.hub.title")}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{t("learner.flashcards.hub.subtitle")}</p>

        {/* Quick study row — weak areas + coherent test-bank links (no marketing/SEO) */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <Link
            href={weakAreasStudyHref}
            className="inline-flex rounded-full px-4 py-2.5 text-sm font-semibold shadow-sm transition hover:opacity-95"
            style={{
              background: "var(--role-cta, var(--semantic-brand))",
              color: "var(--role-cta-foreground, var(--semantic-text-on-brand, #fff))",
            }}
          >
            {t("learner.flashcards.hub.weakAreasCta")}
          </Link>
          <Link
            href={quickQuestionBankHref}
            className="inline-flex rounded-full border-2 px-4 py-2.5 text-sm font-semibold transition hover:opacity-90"
            style={{
              borderColor: "color-mix(in srgb, var(--semantic-info) 35%, var(--semantic-border-soft))",
              color: "var(--semantic-text-primary)",
              background: "color-mix(in srgb, var(--semantic-info) 10%, var(--theme-card-bg))",
            }}
          >
            {t("learner.flashcards.hub.quickQuestionBank")}
          </Link>
          <a
            href="#deck-library"
            className="inline-flex rounded-full border-2 border-[var(--semantic-border-soft)] bg-[var(--theme-card-bg)] px-4 py-2.5 text-sm font-semibold text-[var(--semantic-text-primary)] transition hover:border-[color-mix(in_srgb,var(--semantic-brand)_30%,var(--semantic-border-soft))]"
          >
            {t("learner.flashcards.hub.browseDecksAnchor")}
          </a>
        </div>
      </div>

      {/* Retention overview first (legacy test-bank: stats → configure → start) */}
      {(dueSummary || stats) ? (
        <section className="mb-8 space-y-4" aria-label={t("learner.flashcards.hub.masteryOverview")}>
          <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--semantic-text-secondary)]">
            {t("learner.flashcards.hub.masteryOverview")}
          </p>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border-2 border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)]">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--semantic-text-muted)]">
                {t("learner.flashcards.hub.kpiDueToday")}
              </p>
              <p className="mt-2 text-3xl font-bold tabular-nums text-[var(--semantic-info)]">
                {dueSummary != null ? dueSummary.dueToday : "—"}
              </p>
            </div>
            <div className="rounded-2xl border-2 border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)]">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--semantic-text-muted)]">
                {t("learner.flashcards.hub.kpiOverdue")}
              </p>
              <p
                className={`mt-2 text-3xl font-bold tabular-nums ${
                  dueSummary != null && dueSummary.overdue > 0 ? "text-[var(--semantic-danger)]" : "text-[var(--semantic-text-primary)]"
                }`}
              >
                {dueSummary != null ? dueSummary.overdue : "—"}
              </p>
            </div>
            <div className="rounded-2xl border-2 border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)]">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--semantic-text-muted)]">
                {t("learner.flashcards.hub.kpiStreak")}
              </p>
              <p className="mt-2 text-3xl font-bold tabular-nums text-[var(--semantic-chart-3)]">
                {stats != null ? stats.currentStreak : "—"}
              </p>
              {stats != null ? (
                <p className="mt-1 text-xs text-[var(--semantic-text-muted)]">
                  {t("learner.flashcards.hub.kpiBest")}:{" "}
                  <span className="font-semibold tabular-nums text-[var(--semantic-text-secondary)]">{stats.longestStreak}</span>
                </p>
              ) : null}
            </div>
            <div className="rounded-2xl border-2 border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-[var(--semantic-shadow-soft)]">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--semantic-text-muted)]">
                {t("learner.flashcards.hub.kpiReviewed")}
              </p>
              <p className="mt-2 text-3xl font-bold tabular-nums text-[var(--semantic-text-primary)]">
                {stats != null ? stats.cardsReviewedTotal : "—"}
              </p>
              {dueSummary != null ? (
                <p className="mt-1 text-xs text-[var(--semantic-text-muted)]">
                  {t("learner.flashcards.hub.kpiLearning")}:{" "}
                  <span className="font-semibold tabular-nums text-[var(--semantic-success)]">{dueSummary.learning}</span>
                </p>
              ) : null}
            </div>
          </div>
          {totalDue > 0 ? (
            <Link
              href={weakAreasStudyHref}
              className="block w-full rounded-2xl border-2 border-[color-mix(in_srgb,var(--semantic-brand)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--semantic-surface))] py-3.5 text-center text-sm font-semibold text-[var(--semantic-text-primary)] shadow-sm transition hover:opacity-95"
            >
              Review {totalDue} due now →
            </Link>
          ) : null}
        </section>
      ) : null}

      {/* Custom session — primary study setup (legacy IA: configure → act) */}
      <section id="study-session" className="mb-10 rounded-2xl border-2 p-6 sm:p-7" style={panelShellStyle}>
        <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--semantic-brand)]">{t("learner.flashcards.hub.studySessionEyebrow")}</p>
        <h2 className="mt-1 text-xl font-bold tracking-tight text-[var(--semantic-text-primary)] sm:text-2xl">
          {t("learner.flashcards.hub.customStudyTitle")}
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{t("learner.flashcards.hub.customStudyIntro")}</p>

        <div className="mt-6 h-px bg-[color-mix(in_srgb,var(--semantic-border-soft)_70%,transparent)]" aria-hidden />

        <div className="mt-6 grid gap-5 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-5">
            <label className={fieldLabelClass}>
              Pathway
              <select className={controlClass} value={filters.pathwayId} onChange={(e) => applyFilters({ pathwayId: e.target.value })}>
                <option value="">Use my scoped plan</option>
                {pathwayOptions.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <label className={fieldLabelClass}>
                Number of cards
                <select className={controlClass} value={cardLimit} onChange={(e) => setCardLimit(e.target.value)}>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="30">30</option>
                  <option value="50">50</option>
                  <option value="all">All available</option>
                </select>
              </label>
              <label className={fieldLabelClass}>
                Study mode
                <select className={controlClass} value={studyMode} onChange={(e) => setStudyMode(e.target.value as BuilderMode)}>
                  <option value="term_to_definition">Active Recall</option>
                  <option value="definition_to_term">Reverse Recall</option>
                  <option value="mixed">Mixed Recall</option>
                </select>
              </label>
            </div>
            <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border-2 border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-positive)_12%,var(--theme-card-bg))] px-3 py-2.5 text-sm font-medium text-[var(--semantic-text-primary)]">
              <input
                type="checkbox"
                className="size-4 rounded border-[var(--semantic-border-soft)] text-[var(--semantic-brand)]"
                checked={shuffleOn}
                onChange={(e) => setShuffleOn(e.target.checked)}
              />
              Shuffle cards
            </label>
          </div>

          <div className="lg:col-span-7">
            <p className={fieldLabelClass}>{t("learner.flashcards.hub.bodySystemsHeading")}</p>
            <div className="mt-2 flex min-h-[4.5rem] flex-wrap gap-2 rounded-xl border-2 border-[var(--semantic-border-soft)] bg-[var(--theme-card-bg)] p-3">
              {builderCategories.length === 0 && !builderLoading ? (
                <p className="text-sm text-[var(--semantic-text-muted)]">Select a pathway to load topics.</p>
              ) : null}
              {builderCategories.map((category) => {
                const selected = selectedCategoryIds.includes(category.id);
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => toggleCategory(category.id)}
                    className="rounded-full border-2 px-3 py-1.5 text-xs font-semibold transition"
                    style={
                      selected
                        ? {
                            borderColor: "var(--semantic-brand)",
                            background: "color-mix(in srgb, var(--semantic-brand) 18%, var(--theme-card-bg))",
                            color: "var(--semantic-text-primary)",
                          }
                        : {
                            borderColor: "var(--semantic-border-soft)",
                            background: "color-mix(in srgb, var(--semantic-panel-cool) 22%, var(--theme-card-bg))",
                            color: "var(--semantic-text-secondary)",
                          }
                    }
                  >
                    {formatTitleCase(category.title)} ({category.count})
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div
          className="mt-6 rounded-xl border-2 p-4 sm:p-5"
          style={{
            ...innerWellStyle,
            background: "color-mix(in srgb, var(--semantic-panel-warm) 14%, var(--semantic-surface))",
          }}
        >
          <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--semantic-text-secondary)]">
            {t("learner.flashcards.hub.reviewFiltersHeading")}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">
            Server-backed: weak areas, previously incorrect. This device: starred, saved, notes, marked for revisit.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="flex items-center gap-2.5 text-sm font-medium text-[var(--semantic-text-primary)]">
              <input type="checkbox" className="size-4 rounded border-[var(--semantic-border-soft)]" checked={weakOnly} onChange={(e) => setWeakOnly(e.target.checked)} />
              Weak areas only
            </label>
            <label className="flex items-center gap-2.5 text-sm font-medium text-[var(--semantic-text-primary)]">
              <input type="checkbox" className="size-4 rounded border-[var(--semantic-border-soft)]" checked={incorrectOnly} onChange={(e) => setIncorrectOnly(e.target.checked)} />
              Previously incorrect
            </label>
            <label className="flex items-center gap-2.5 text-sm font-medium text-[var(--semantic-text-primary)]">
              <input type="checkbox" className="size-4 rounded border-[var(--semantic-border-soft)]" checked={starredOnly} onChange={(e) => setStarredOnly(e.target.checked)} />
              Starred ({savedStats.starred})
            </label>
            <label className="flex items-center gap-2.5 text-sm font-medium text-[var(--semantic-text-primary)]">
              <input type="checkbox" className="size-4 rounded border-[var(--semantic-border-soft)]" checked={savedOnly} onChange={(e) => setSavedOnly(e.target.checked)} />
              Saved ({savedStats.saved})
            </label>
            <label className="flex items-center gap-2.5 text-sm font-medium text-[var(--semantic-text-primary)]">
              <input type="checkbox" className="size-4 rounded border-[var(--semantic-border-soft)]" checked={notesOnly} onChange={(e) => setNotesOnly(e.target.checked)} />
              With notes ({savedStats.noted})
            </label>
            <label className="flex items-center gap-2.5 text-sm font-medium text-[var(--semantic-text-primary)]">
              <input type="checkbox" className="size-4 rounded border-[var(--semantic-border-soft)]" checked={revisitOnly} onChange={(e) => setRevisitOnly(e.target.checked)} />
              Marked revisit ({savedStats.confusing})
            </label>
          </div>
        </div>

        <div
          className="mt-5 rounded-xl border-2 p-4 sm:p-5"
          style={{
            borderColor: "color-mix(in srgb, var(--semantic-info) 22%, var(--semantic-border-soft))",
            background: "color-mix(in srgb, var(--semantic-info) 8%, var(--theme-card-bg))",
          }}
        >
          <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--semantic-info)]">{t("learner.flashcards.hub.sessionSummaryHeading")}</p>
          <ul className="mt-3 space-y-2 text-sm text-[var(--semantic-text-secondary)]">
            <li>
              <span className="font-semibold text-[var(--semantic-text-primary)]">Pathway: </span>
              {filters.pathwayId ? pathwayOptions.find((p) => p.id === filters.pathwayId)?.label ?? filters.pathwayId : "Scoped to your entitlement"}
            </li>
            <li>
              <span className="font-semibold text-[var(--semantic-text-primary)]">Topics: </span>
              {selectedCategoryIds.length > 0
                ? builderCategories.filter((c) => selectedCategoryIds.includes(c.id)).map((c) => formatTitleCase(c.title)).join(", ")
                : "All available"}
            </li>
            <li>
              <span className="font-semibold text-[var(--semantic-text-primary)]">Deck: </span>
              <span className="tabular-nums font-semibold text-[var(--semantic-chart-2)]">{builderSummary?.returnedCards ?? 0}</span>
              <span className="text-[var(--semantic-text-muted)]"> / </span>
              <span className="tabular-nums text-[var(--semantic-text-primary)]">{builderSummary?.matchingCards ?? 0}</span>
              <span className="text-[var(--semantic-text-muted)]"> cards · </span>
              <span className="font-medium text-[var(--semantic-text-primary)]">{modeLabel[studyMode]}</span>
              <span className="text-[var(--semantic-text-muted)]"> · shuffle </span>
              <span className="font-medium text-[var(--semantic-text-primary)]">{shuffleOn ? "on" : "off"}</span>
            </li>
            {(starredOnly || savedOnly || notesOnly || revisitOnly) ? (
              <li className="text-[var(--semantic-text-muted)]">
                Local filters:{" "}
                {[starredOnly ? "Starred" : null, savedOnly ? "Saved" : null, notesOnly ? "Notes" : null, revisitOnly ? "Revisit" : null].filter(Boolean).join(", ")}
                . Counts are estimated before local filters apply.
              </li>
            ) : null}
          </ul>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href={startHref}
            className="inline-flex min-h-[44px] items-center justify-center rounded-full px-6 py-2.5 text-sm font-bold shadow-md transition hover:opacity-95"
            style={{
              background: "var(--role-cta, var(--semantic-brand))",
              color: "var(--role-cta-foreground, var(--semantic-text-on-brand, #fff))",
            }}
          >
            {t("learner.flashcards.hub.startStudying")}
          </Link>
          <button
            type="button"
            onClick={() => void previewCustomCards()}
            className="inline-flex min-h-[44px] items-center justify-center rounded-full border-2 border-[var(--semantic-border-soft)] bg-[var(--theme-card-bg)] px-6 py-2.5 text-sm font-bold text-[var(--semantic-text-primary)] transition hover:border-[color-mix(in_srgb,var(--semantic-brand)_35%,var(--semantic-border-soft))]"
          >
            {t("learner.flashcards.hub.previewCards")}
          </button>
        </div>
        {builderLoading ? <p className="mt-3 text-xs font-medium text-[var(--semantic-text-muted)]">Refreshing session options…</p> : null}
        {builderError ? <p className="mt-3 text-xs font-semibold text-[var(--semantic-danger)]">{builderError}</p> : null}
        {previewCards.length > 0 ? (
          <div className="mt-5 rounded-xl border-2 border-[var(--semantic-border-soft)] bg-[var(--theme-card-bg)] p-4">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-[var(--semantic-text-secondary)]">Preview</p>
            <ul className="space-y-2 text-sm">
              {previewCards.map((card) => (
                <li key={card.id} className="rounded-lg border-2 border-[color-mix(in_srgb,var(--semantic-border-soft)_80%,transparent)] p-3">
                  <p className="font-semibold text-[var(--semantic-text-primary)]">{card.front}</p>
                  {card.topic ? <p className="mt-1 text-xs text-[var(--semantic-text-secondary)]">{card.topic}</p> : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      {/* Deck library */}
      <div id="deck-library" className="scroll-mt-8">
        <h2 className="text-lg font-bold text-[var(--semantic-text-primary)] sm:text-xl">{t("learner.flashcards.hub.deckLibraryHeading")}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{t("learner.flashcards.hub.deckLibraryIntro")}</p>
      </div>

      <div className="mb-8 mt-5 rounded-2xl border-2 p-5 sm:p-6" style={panelShellStyle}>
        <FlashcardFilters value={filters} onChange={applyFilters} pathwayOptions={pathwayOptions} tagList={tagList} />
      </div>

      {error ? <p className="mb-6 text-sm font-medium text-[var(--semantic-danger)]">{error}</p> : null}

      <FlashcardDeckGrid
        decks={visibleDecks}
        loading={loading}
        emptyMessage={
          filters.source
            ? `No ${filters.source} decks found. Try a different filter.`
            : isNpPathwayFilter
              ? "Flashcard coverage for this NP pathway is in progress. Use Question Bank and Lessons while decks are being populated."
              : `${t("learner.flashcards.hub.emptyPrefix")} ${t("learner.flashcards.hub.emptyLink")}.`
        }
      />

      {totalPages > 1 && !loading ? (
        <nav className="mt-10 flex items-center justify-between text-sm" aria-label={t("learner.flashcards.hub.paginationAria")}>
          <button
            type="button"
            disabled={page <= 1 || loading}
            className="font-semibold text-[var(--semantic-brand)] disabled:opacity-40"
            onClick={() => {
              const qs = new URLSearchParams(urlParams.toString());
              qs.set("page", String(page - 1));
              router.push(`/app/flashcards?${qs.toString()}`);
            }}
          >
            {t("learner.flashcards.hub.previous")}
          </button>
          <span className="font-medium text-[var(--semantic-text-secondary)]">{t("learner.flashcards.hub.pageOf", { page, total: totalPages })}</span>
          <button
            type="button"
            disabled={page >= totalPages || loading}
            className="font-semibold text-[var(--semantic-brand)] disabled:opacity-40"
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

      <div className="mt-10 flex flex-wrap gap-2 border-t border-[color-mix(in_srgb,var(--semantic-border-soft)_85%,transparent)] pt-8">
        <Link
          href={quickQuestionBankHref}
          className="rounded-full border-2 border-[var(--semantic-border-soft)] px-4 py-2.5 text-sm font-semibold text-[var(--semantic-text-primary)] transition hover:border-[color-mix(in_srgb,var(--semantic-brand)_30%,var(--semantic-border-soft))]"
        >
          {t("learner.flashcards.hub.bottomQuestionBank")}
        </Link>
        <Link
          href="/lessons"
          className="rounded-full border-2 border-[var(--semantic-border-soft)] px-4 py-2.5 text-sm font-semibold text-[var(--semantic-text-primary)] transition hover:border-[color-mix(in_srgb,var(--semantic-brand)_30%,var(--semantic-border-soft))]"
        >
          {t("learner.flashcards.hub.bottomExamLessons")}
        </Link>
        <Link
          href="/app/review"
          className="rounded-full border-2 border-[var(--semantic-border-soft)] px-4 py-2.5 text-sm font-semibold text-[var(--semantic-text-primary)] transition hover:border-[color-mix(in_srgb,var(--semantic-brand)_30%,var(--semantic-border-soft))]"
        >
          Spaced Review Queue
        </Link>
      </div>
    </div>
  );
}
