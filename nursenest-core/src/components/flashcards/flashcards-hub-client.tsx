"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { formatTitleCase } from "@/lib/format/text-case";
import { countSavedStudyItems, getStudyItemIdsMatchingFilters } from "@/lib/flashcards/study-session-persistence";

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
  notStudiedOnly?: boolean;
  recentStudiedOnly?: boolean;
  recentDays?: number;
  sourceKind?: string;
  cardLimit: string;
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

const CARD_COUNTS = [10, 20, 30, 50] as const;

const shellStyle: CSSProperties = {
  borderColor: "color-mix(in srgb, var(--semantic-border-soft) 92%, var(--semantic-text-muted))",
  background: "color-mix(in srgb, var(--semantic-surface) 94%, var(--theme-card-bg))",
  boxShadow: "var(--semantic-shadow-soft)",
};

const sectionStyle: CSSProperties = {
  borderColor: "var(--semantic-border-soft)",
  background: "var(--theme-card-bg)",
};

function buildCustomSessionParams(opts: {
  pathwayId: string;
  cardLimit: string;
  /** Explicit subset only; omit or empty when all systems apply */
  bodySystemIds: string[];
  allBodySystemIds: string[];
  shuffleOn: boolean;
  weakOnly: boolean;
  incorrectOnly: boolean;
  notStudiedOnly: boolean;
  starredOnly: boolean;
  revisitOnly: boolean;
}): URLSearchParams {
  const params = new URLSearchParams();
  params.set("pathwayId", opts.pathwayId);
  params.set("cardLimit", opts.cardLimit);
  params.set("mode", "mixed");

  const allIds = opts.allBodySystemIds;
  const partial =
    opts.bodySystemIds.length > 0 &&
    (allIds.length === 0 || opts.bodySystemIds.length < allIds.length || !allIds.every((id) => opts.bodySystemIds.includes(id)));
  if (partial && opts.bodySystemIds.length > 0) {
    params.set("categories", opts.bodySystemIds.join(","));
  }

  if (opts.shuffleOn) params.set("shuffle", "1");
  if (opts.weakOnly) params.set("weakOnly", "1");
  if (opts.incorrectOnly) params.set("incorrectOnly", "1");
  if (opts.notStudiedOnly) params.set("notStudiedOnly", "1");
  if (opts.starredOnly) params.set("starredOnly", "1");
  if (opts.revisitOnly) params.set("revisitOnly", "1");

  if (opts.starredOnly || opts.revisitOnly) {
    const stateIds = getStudyItemIdsMatchingFilters(
      {
        starredOnly: opts.starredOnly || undefined,
        confusingOnly: opts.revisitOnly || undefined,
      },
      500,
    );
    if (stateIds.length > 0) params.set("stateIds", stateIds.join(","));
  }

  return params;
}

export function FlashcardsHubClient({
  scopedPathwayId,
  pathwayDisplayName,
}: {
  scopedPathwayId: string;
  pathwayDisplayName: string;
}) {
  const { t } = useMarketingI18n();

  const [stats, setStats] = useState<Stats | null>(null);
  const [dueSummary, setDueSummary] = useState<DueSummary | null>(null);
  const [metaLoading, setMetaLoading] = useState(true);

  const [builderCategories, setBuilderCategories] = useState<BuilderCategory[]>([]);
  /** Empty = all body systems included (no category filter on the API). Non-empty = explicit subset. */
  const [selectedBodyIds, setSelectedBodyIds] = useState<string[]>([]);
  const [cardLimit, setCardLimit] = useState<(typeof CARD_COUNTS)[number]>(20);
  const [shuffleOn, setShuffleOn] = useState(true);
  const [weakOnly, setWeakOnly] = useState(false);
  const [incorrectOnly, setIncorrectOnly] = useState(false);
  const [starredOnly, setStarredOnly] = useState(false);
  const [revisitOnly, setRevisitOnly] = useState(false);
  const [notStudiedOnly, setNotStudiedOnly] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const [prefsHydrated, setPrefsHydrated] = useState(false);
  const [savedStats, setSavedStats] = useState({ starred: 0, saved: 0, noted: 0, confusing: 0 });
  const [builderSummary, setBuilderSummary] = useState<BuilderSummary | null>(null);
  const [previewCards, setPreviewCards] = useState<Array<{ id: string; front: string; topic?: string | null }>>([]);
  const [builderLoading, setBuilderLoading] = useState(false);
  const [builderError, setBuilderError] = useState<string | null>(null);

  const allBodyIds = useMemo(() => builderCategories.map((c) => c.id), [builderCategories]);

  useEffect(() => {
    void (async () => {
      setMetaLoading(true);
      try {
        const [sRes, dueRes] = await Promise.all([
          fetch("/api/flashcards/stats", { credentials: "include" }).catch(() => null),
          fetch("/api/flashcards/due-summary", { credentials: "include" }).catch(() => null),
        ]);
        if (sRes?.ok) setStats(await sRes.json());
        else setStats(null);
        if (dueRes?.ok) setDueSummary((await dueRes.json()) as DueSummary);
        else setDueSummary(null);
      } catch {
        setStats(null);
        setDueSummary(null);
      } finally {
        setMetaLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    setSavedStats(countSavedStudyItems());
  }, [starredOnly, revisitOnly]);

  const prefsWriteTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (prefsHydrated) return;
    try {
      const raw = typeof window !== "undefined" ? window.localStorage.getItem("nn.flashcards.builder.v2") : null;
      if (!raw) {
        setPrefsHydrated(true);
        return;
      }
      const j = JSON.parse(raw) as Record<string, unknown>;
      if (typeof j.cardLimit === "string" || typeof j.cardLimit === "number") {
        const n = Number(j.cardLimit);
        if (CARD_COUNTS.includes(n as (typeof CARD_COUNTS)[number])) setCardLimit(n as (typeof CARD_COUNTS)[number]);
      }
      if (typeof j.shuffleOn === "boolean") setShuffleOn(j.shuffleOn);
      if (typeof j.weakOnly === "boolean") setWeakOnly(j.weakOnly);
      if (typeof j.incorrectOnly === "boolean") setIncorrectOnly(j.incorrectOnly);
      if (typeof j.notStudiedOnly === "boolean") setNotStudiedOnly(j.notStudiedOnly);
      if (typeof j.starredOnly === "boolean") setStarredOnly(j.starredOnly);
      if (typeof j.revisitOnly === "boolean") setRevisitOnly(j.revisitOnly);
      if (Array.isArray(j.selectedBodyIds)) {
        setSelectedBodyIds(j.selectedBodyIds.filter((x): x is string => typeof x === "string"));
      }
    } catch {
      /* ignore */
    }
    setPrefsHydrated(true);
  }, [prefsHydrated]);

  useEffect(() => {
    if (!prefsHydrated || typeof window === "undefined") return;
    if (prefsWriteTimer.current) clearTimeout(prefsWriteTimer.current);
    prefsWriteTimer.current = setTimeout(() => {
      try {
        window.localStorage.setItem(
          "nn.flashcards.builder.v2",
          JSON.stringify({
            cardLimit,
            shuffleOn,
            weakOnly,
            incorrectOnly,
            notStudiedOnly,
            starredOnly,
            revisitOnly,
            selectedBodyIds,
          }),
        );
      } catch {
        /* ignore */
      }
    }, 200);
    return () => {
      if (prefsWriteTimer.current) clearTimeout(prefsWriteTimer.current);
    };
  }, [
    prefsHydrated,
    cardLimit,
    shuffleOn,
    weakOnly,
    incorrectOnly,
    notStudiedOnly,
    starredOnly,
    revisitOnly,
    selectedBodyIds,
  ]);

  const sessionParams = useMemo(
    () =>
      buildCustomSessionParams({
        pathwayId: scopedPathwayId,
        cardLimit: String(cardLimit),
        bodySystemIds: selectedBodyIds,
        allBodySystemIds: allBodyIds,
        shuffleOn,
        weakOnly,
        incorrectOnly,
        notStudiedOnly,
        starredOnly,
        revisitOnly,
      }),
    [
      scopedPathwayId,
      cardLimit,
      selectedBodyIds,
      allBodyIds,
      shuffleOn,
      weakOnly,
      incorrectOnly,
      notStudiedOnly,
      starredOnly,
      revisitOnly,
    ],
  );

  const runBuilderSummary = useCallback(async () => {
    setBuilderLoading(true);
    setBuilderError(null);
    try {
      const params = new URLSearchParams(sessionParams.toString());
      const res = await fetch(`/api/flashcards/custom-session?${params.toString()}`, { credentials: "include" });
      const json = (await res.json()) as {
        summary?: BuilderSummary;
        categoryOptions?: BuilderCategory[];
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
  }, [sessionParams]);

  useEffect(() => {
    void runBuilderSummary();
  }, [runBuilderSummary]);

  const weakAreasStudyHref =
    scopedPathwayId.length > 0
      ? `/app/flashcards/weak-areas?pathwayId=${encodeURIComponent(scopedPathwayId)}`
      : "/app/flashcards/weak-areas";

  const totalDue = (dueSummary?.dueToday ?? 0) + (dueSummary?.overdue ?? 0);
  const showWeakShortcut = totalDue > 0 || (dueSummary?.learning ?? 0) > 0;

  const filteredCategories = builderCategories.filter((c) =>
    categorySearch.trim() ? `${c.title} ${c.id}`.toLowerCase().includes(categorySearch.trim().toLowerCase()) : true,
  );

  const chipSelected = (id: string) => selectedBodyIds.length === 0 || selectedBodyIds.includes(id);

  const toggleBodySystem = (id: string) => {
    if (allBodyIds.length === 0) return;
    if (selectedBodyIds.length === 0) {
      setSelectedBodyIds(allBodyIds.filter((x) => x !== id));
      return;
    }
    if (selectedBodyIds.includes(id)) {
      const next = selectedBodyIds.filter((x) => x !== id);
      setSelectedBodyIds(next.length === 0 ? [] : next);
    } else {
      const next = [...selectedBodyIds, id];
      if (next.length >= allBodyIds.length) setSelectedBodyIds([]);
      else setSelectedBodyIds(next);
    }
  };

  const selectAllSystems = () => {
    setSelectedBodyIds([]);
  };

  const clearSystemsAndSearch = () => {
    setCategorySearch("");
    setSelectedBodyIds([]);
  };

  const applyWeakShortcut = () => {
    setWeakOnly(true);
  };

  const bodyAreasSummary =
    builderCategories.length === 0
      ? null
      : selectedBodyIds.length === 0
        ? `All ${builderCategories.length} areas`
        : `${selectedBodyIds.length} of ${builderCategories.length} areas`;

  useEffect(() => {
    if (builderCategories.length === 0) return;
    const valid = new Set(builderCategories.map((c) => c.id));
    setSelectedBodyIds((prev) => {
      const next = prev.filter((id) => valid.has(id));
      return next.length === prev.length ? prev : next;
    });
  }, [builderCategories]);

  const filterCount =
    (weakOnly ? 1 : 0) +
    (incorrectOnly ? 1 : 0) +
    (notStudiedOnly ? 1 : 0) +
    (starredOnly ? 1 : 0) +
    (revisitOnly ? 1 : 0);

  const startHref = `/app/flashcards/custom?${sessionParams.toString()}`;

  const previewCustomCards = async () => {
    setBuilderError(null);
    try {
      const params = new URLSearchParams(sessionParams.toString());
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

  const isNpPathway = scopedPathwayId.includes("-np-");

  return (
    <div
      className="mx-auto flex min-h-[60vh] max-w-xl flex-col gap-10 px-4 py-8 sm:max-w-2xl sm:py-10"
      style={{ color: "var(--semantic-text-primary)" }}
    >
      <header className="space-y-3">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl" style={{ color: "var(--theme-heading-text)" }}>
          {t("learner.flashcards.hub.title")}
        </h1>
        <p className="max-w-prose text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{t("learner.flashcards.hub.subtitle")}</p>
        <div className="pt-1">
          <Link
            href={weakAreasStudyHref}
            className="inline-flex min-h-[44px] items-center justify-center rounded-2xl px-5 py-2.5 text-sm font-semibold shadow-sm transition hover:opacity-95"
            style={{
              background: "var(--role-cta, var(--semantic-brand))",
              color: "var(--role-cta-foreground, var(--semantic-text-on-brand))",
            }}
          >
            {t("learner.flashcards.hub.weakAreasCta")}
          </Link>
        </div>
      </header>

      {!metaLoading && (dueSummary || stats) ? (
        <section className="space-y-3" aria-label={t("learner.flashcards.hub.masteryOverview")}>
          <p className="text-xs font-medium tracking-wide text-[var(--semantic-text-secondary)]">{t("learner.flashcards.hub.masteryOverview")}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border p-4 shadow-sm" style={sectionStyle}>
              <p className="text-xs text-[var(--semantic-text-muted)]">{t("learner.flashcards.hub.kpiDueToday")}</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums text-[var(--semantic-info)]">{dueSummary != null ? dueSummary.dueToday : "—"}</p>
            </div>
            <div className="rounded-2xl border p-4 shadow-sm" style={sectionStyle}>
              <p className="text-xs text-[var(--semantic-text-muted)]">{t("learner.flashcards.hub.kpiOverdue")}</p>
              <p
                className={`mt-1 text-2xl font-semibold tabular-nums ${
                  dueSummary != null && dueSummary.overdue > 0 ? "text-[var(--semantic-danger)]" : ""
                }`}
              >
                {dueSummary != null ? dueSummary.overdue : "—"}
              </p>
            </div>
            <div className="rounded-2xl border p-4 shadow-sm" style={sectionStyle}>
              <p className="text-xs text-[var(--semantic-text-muted)]">{t("learner.flashcards.hub.kpiStreak")}</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums text-[var(--semantic-chart-3)]">{stats != null ? stats.currentStreak : "—"}</p>
              {stats != null ? (
                <p className="mt-1 text-xs text-[var(--semantic-text-muted)]">
                  {t("learner.flashcards.hub.kpiBest")}: <span className="font-medium tabular-nums">{stats.longestStreak}</span>
                </p>
              ) : null}
            </div>
            <div className="rounded-2xl border p-4 shadow-sm" style={sectionStyle}>
              <p className="text-xs text-[var(--semantic-text-muted)]">{t("learner.flashcards.hub.kpiReviewed")}</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums">{stats != null ? stats.cardsReviewedTotal : "—"}</p>
            </div>
          </div>
          {totalDue > 0 ? (
            <Link
              href={weakAreasStudyHref}
              className="block w-full rounded-2xl border py-3 text-center text-sm font-semibold transition hover:opacity-95"
              style={{
                borderColor: "color-mix(in srgb, var(--semantic-brand) 28%, var(--semantic-border-soft))",
                background: "color-mix(in srgb, var(--semantic-brand) 8%, var(--theme-card-bg))",
              }}
            >
              Review {totalDue} due now →
            </Link>
          ) : null}
        </section>
      ) : null}

      <section
        id="study-session"
        className="space-y-8 rounded-2xl border p-6 sm:p-8"
        style={shellStyle}
        aria-labelledby="custom-study-heading"
      >
        <div className="space-y-2">
          <p className="text-xs font-medium tracking-wide text-[var(--semantic-brand)]">{pathwayDisplayName}</p>
          <h2 id="custom-study-heading" className="text-xl font-semibold tracking-tight sm:text-2xl">
            {t("learner.flashcards.hub.customStudyTitle")}
          </h2>
          <p className="text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
            Build a focused flashcard session for this pathway.
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium text-[var(--semantic-text-primary)]">Session size</p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Number of cards">
            {CARD_COUNTS.map((n) => {
              const on = cardLimit === n;
              return (
                <button
                  key={n}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setCardLimit(n)}
                  className="min-h-[44px] min-w-[3.25rem] rounded-2xl border px-4 text-sm font-semibold transition"
                  style={
                    on
                      ? {
                          borderColor: "color-mix(in srgb, var(--semantic-brand) 45%, var(--semantic-border-soft))",
                          background: "color-mix(in srgb, var(--semantic-brand) 14%, var(--theme-card-bg))",
                          color: "var(--semantic-text-primary)",
                        }
                      : {
                          borderColor: "var(--semantic-border-soft)",
                          background: "var(--theme-card-bg)",
                          color: "var(--semantic-text-secondary)",
                        }
                  }
                >
                  {n}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--semantic-text-primary)]">{t("learner.flashcards.hub.bodySystemsHeading")}</p>
              {bodyAreasSummary ? <p className="mt-1 text-xs text-[var(--semantic-text-muted)]">{bodyAreasSummary}</p> : null}
            </div>
            <div className="flex flex-wrap gap-2">
              {showWeakShortcut ? (
                <button
                  type="button"
                  onClick={applyWeakShortcut}
                  className="min-h-[40px] rounded-2xl border px-3 text-xs font-semibold text-[var(--semantic-warning)] transition hover:opacity-90"
                  style={{
                    borderColor: "color-mix(in srgb, var(--semantic-warning) 35%, var(--semantic-border-soft))",
                    background: "color-mix(in srgb, var(--semantic-warning) 10%, var(--theme-card-bg))",
                  }}
                >
                  Focus due cards
                </button>
              ) : null}
              <button
                type="button"
                onClick={selectAllSystems}
                className="min-h-[40px] rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--theme-card-bg)] px-3 text-xs font-semibold text-[var(--semantic-text-primary)]"
              >
                Select all
              </button>
              <button
                type="button"
                onClick={clearSystemsAndSearch}
                className="min-h-[40px] rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--theme-card-bg)] px-3 text-xs font-semibold text-[var(--semantic-text-secondary)]"
              >
                Clear
              </button>
            </div>
          </div>
          <label className="block text-xs font-medium text-[var(--semantic-text-secondary)]">
            Search areas
            <input
              type="search"
              value={categorySearch}
              onChange={(e) => setCategorySearch(e.target.value)}
              placeholder="Find a body system…"
              autoComplete="off"
              className="mt-1.5 w-full min-h-[44px] rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--theme-card-bg)] px-3 py-2.5 text-sm text-[var(--semantic-text-primary)] shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_40%,transparent)]"
            />
          </label>
          <div
            className="flex min-h-[5rem] flex-wrap gap-2 rounded-2xl border p-3 sm:p-4"
            style={{ ...sectionStyle, borderColor: "var(--semantic-border-soft)" }}
          >
            {builderLoading && builderCategories.length === 0 ? (
              <p className="text-sm text-[var(--semantic-text-muted)]">Loading areas…</p>
            ) : null}
            {!builderLoading && builderCategories.length === 0 ? (
              <p className="text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
                All topics in this pathway are included. You can start whenever you are ready.
              </p>
            ) : null}
            {filteredCategories.map((category) => {
              const selected = chipSelected(category.id);
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => toggleBodySystem(category.id)}
                  className="min-h-[44px] rounded-full border-2 px-4 py-2 text-left text-sm font-medium transition"
                  style={
                    selected
                      ? {
                          borderColor: "color-mix(in srgb, var(--semantic-brand) 40%, var(--semantic-border-soft))",
                          background: "color-mix(in srgb, var(--semantic-brand) 12%, var(--theme-card-bg))",
                          color: "var(--semantic-text-primary)",
                        }
                      : {
                          borderColor: "var(--semantic-border-soft)",
                          background: "var(--theme-card-bg)",
                          color: "var(--semantic-text-secondary)",
                        }
                  }
                >
                  <span className="block">{formatTitleCase(category.title)}</span>
                  {category.count > 0 ? (
                    <span className="mt-0.5 block text-xs tabular-nums text-[var(--semantic-text-muted)]">{category.count} cards</span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border p-5" style={sectionStyle}>
          <div>
            <p className="text-sm font-medium text-[var(--semantic-text-primary)]">{t("learner.flashcards.hub.reviewFiltersHeading")}</p>
            <p className="mt-1 text-xs leading-relaxed text-[var(--semantic-text-muted)]">Focus your session using progress and review markers.</p>
          </div>
          <div className="flex flex-col gap-3">
            <label className="flex min-h-[44px] cursor-pointer items-center gap-3 rounded-xl border border-transparent px-1 py-1 hover:bg-[color-mix(in_srgb,var(--semantic-panel-cool)_22%,transparent)]">
              <input type="checkbox" className="size-5 shrink-0 rounded border-[var(--semantic-border-soft)]" checked={weakOnly} onChange={(e) => setWeakOnly(e.target.checked)} />
              <span className="text-sm font-medium">Weak areas only</span>
            </label>
            <label className="flex min-h-[44px] cursor-pointer items-center gap-3 rounded-xl border border-transparent px-1 py-1 hover:bg-[color-mix(in_srgb,var(--semantic-panel-cool)_22%,transparent)]">
              <input
                type="checkbox"
                className="size-5 shrink-0 rounded border-[var(--semantic-border-soft)]"
                checked={incorrectOnly}
                onChange={(e) => setIncorrectOnly(e.target.checked)}
              />
              <span className="text-sm font-medium">Previously incorrect</span>
            </label>
            <label className="flex min-h-[44px] cursor-pointer items-center gap-3 rounded-xl border border-transparent px-1 py-1 hover:bg-[color-mix(in_srgb,var(--semantic-panel-cool)_22%,transparent)]">
              <input
                type="checkbox"
                className="size-5 shrink-0 rounded border-[var(--semantic-border-soft)]"
                checked={notStudiedOnly}
                onChange={(e) => setNotStudiedOnly(e.target.checked)}
              />
              <span className="text-sm font-medium">Not yet studied</span>
            </label>
            <label className="flex min-h-[44px] cursor-pointer items-center gap-3 rounded-xl border border-transparent px-1 py-1 hover:bg-[color-mix(in_srgb,var(--semantic-panel-cool)_22%,transparent)]">
              <input
                type="checkbox"
                className="size-5 shrink-0 rounded border-[var(--semantic-border-soft)]"
                checked={starredOnly}
                onChange={(e) => setStarredOnly(e.target.checked)}
              />
              <span className="text-sm font-medium">Starred{savedStats.starred > 0 ? ` (${savedStats.starred})` : ""}</span>
            </label>
            <label className="flex min-h-[44px] cursor-pointer items-center gap-3 rounded-xl border border-transparent px-1 py-1 hover:bg-[color-mix(in_srgb,var(--semantic-panel-cool)_22%,transparent)]">
              <input
                type="checkbox"
                className="size-5 shrink-0 rounded border-[var(--semantic-border-soft)]"
                checked={revisitOnly}
                onChange={(e) => setRevisitOnly(e.target.checked)}
              />
              <span className="text-sm font-medium">Marked for revisit{savedStats.confusing > 0 ? ` (${savedStats.confusing})` : ""}</span>
            </label>
          </div>
        </div>

        <div className="flex min-h-[52px] items-center justify-between gap-4 rounded-2xl border px-4 py-3" style={sectionStyle}>
          <div>
            <p className="text-sm font-medium">Shuffle</p>
            <p className="text-xs text-[var(--semantic-text-muted)]">Mix card order in this session</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={shuffleOn}
            onClick={() => setShuffleOn((s) => !s)}
            className="relative h-8 w-14 shrink-0 rounded-full border-2 transition"
            style={{
              borderColor: "var(--semantic-border-soft)",
              background: shuffleOn ? "color-mix(in srgb, var(--semantic-brand) 35%, var(--theme-card-bg))" : "var(--semantic-surface)",
            }}
          >
            <span
              className="absolute top-0.5 size-6 rounded-full bg-[var(--theme-card-bg)] shadow transition"
              style={{ left: shuffleOn ? "calc(100% - 1.75rem)" : "0.125rem" }}
            />
          </button>
        </div>

        <div className="rounded-2xl border p-5" style={{ ...sectionStyle, borderColor: "color-mix(in srgb, var(--semantic-info) 20%, var(--semantic-border-soft))" }}>
          <p className="text-xs font-medium tracking-wide text-[var(--semantic-text-secondary)]">Session summary</p>
          <ul className="mt-3 space-y-2 text-sm text-[var(--semantic-text-secondary)]">
            <li>
              <span className="font-medium text-[var(--semantic-text-primary)]">{cardLimit} cards</span>
            </li>
            <li>
              {selectedBodyIds.length === 0 || (allBodyIds.length > 0 && selectedBodyIds.length >= allBodyIds.length)
                ? "All body systems included"
                : `${selectedBodyIds.length} body systems selected`}
            </li>
            <li>
              {filterCount === 0 ? "No review filters" : filterCount === 1 ? "1 filter applied" : `${filterCount} filters applied`}
            </li>
            <li>Shuffle {shuffleOn ? "on" : "off"}</li>
          </ul>
        </div>

        <div className="sticky bottom-0 -mx-2 flex flex-col gap-3 border-t border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-surface)_88%,var(--theme-card-bg))] px-2 pb-2 pt-4 sm:static sm:border-0 sm:bg-transparent sm:p-0">
          <Link
            href={startHref}
            className="inline-flex min-h-[48px] w-full items-center justify-center rounded-2xl px-6 text-sm font-semibold shadow-md transition hover:opacity-95 sm:w-auto"
            style={{
              background: "var(--role-cta, var(--semantic-brand))",
              color: "var(--role-cta-foreground, var(--semantic-text-on-brand))",
            }}
          >
            {t("learner.flashcards.hub.startStudying")}
          </Link>
          <button
            type="button"
            onClick={() => void previewCustomCards()}
            className="inline-flex min-h-[48px] w-full items-center justify-center rounded-2xl border-2 border-[var(--semantic-border-soft)] bg-[var(--theme-card-bg)] px-6 text-sm font-semibold text-[var(--semantic-text-primary)] transition hover:border-[color-mix(in_srgb,var(--semantic-brand)_35%,var(--semantic-border-soft))] sm:w-auto"
          >
            {t("learner.flashcards.hub.previewCards")}
          </button>
        </div>

        {builderLoading ? <p className="text-xs text-[var(--semantic-text-muted)]">Updating session…</p> : null}
        {builderError ? <p className="text-sm text-[var(--semantic-danger)]">{builderError}</p> : null}

        {previewCards.length > 0 ? (
          <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--theme-card-bg)] p-4">
            <p className="mb-3 text-xs font-medium tracking-wide text-[var(--semantic-text-secondary)]">Preview</p>
            <ul className="space-y-2 text-sm">
              {previewCards.map((card) => (
                <li key={card.id} className="rounded-xl border border-[var(--semantic-border-soft)] p-3">
                  <p className="font-medium text-[var(--semantic-text-primary)]">{card.front}</p>
                  {card.topic ? <p className="mt-1 text-xs text-[var(--semantic-text-secondary)]">{card.topic}</p> : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      <footer className="flex flex-wrap gap-2 border-t border-[color-mix(in_srgb,var(--semantic-border-soft)_85%,transparent)] pt-8">
        <Link
          href="/lessons"
          className="min-h-[44px] rounded-2xl border border-[var(--semantic-border-soft)] px-4 py-2.5 text-sm font-semibold text-[var(--semantic-text-primary)]"
        >
          {t("learner.flashcards.hub.bottomExamLessons")}
        </Link>
        <Link
          href="/app/review"
          className="min-h-[44px] rounded-2xl border border-[var(--semantic-border-soft)] px-4 py-2.5 text-sm font-semibold text-[var(--semantic-text-primary)]"
        >
          Spaced review queue
        </Link>
      </footer>

      {isNpPathway ? (
        <p className="text-center text-xs text-[var(--semantic-text-muted)]">
          Flashcard coverage for this pathway is still growing. Lessons and practice questions are the best complement right now.
        </p>
      ) : null}
    </div>
  );
}
