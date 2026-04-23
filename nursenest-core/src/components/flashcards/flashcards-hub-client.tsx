"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { formatTitleCase } from "@/lib/format/text-case";
import {
  flashcardBodySystemsUiOutcomeFromParsed,
  parseFlashcardCustomSessionResponse,
} from "@/lib/flashcards/flashcard-custom-session-response";
import { countSavedStudyItems, getStudyItemIdsMatchingFilters } from "@/lib/flashcards/study-session-persistence";
import { LearnerCtaLink } from "@/components/learner-ui/learner-cta-link";

const CUSTOM_SESSION_FETCH_TIMEOUT_MS = 25_000;

type BodySystemsOutcome = "pending" | "populated" | "empty" | "error";

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
  /** True while GET /api/flashcards/custom-session is in flight (initial or refetch). */
  const [customSessionLoading, setCustomSessionLoading] = useState(false);
  const [builderError, setBuilderError] = useState<string | null>(null);
  /** Terminal UX for the body-systems strip (never stays `pending` after a completed fetch). */
  const [bodySystemsOutcome, setBodySystemsOutcome] = useState<BodySystemsOutcome>("pending");
  const [refetchNonce, setRefetchNonce] = useState(0);

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

  const sessionQueryKey = useMemo(() => sessionParams.toString(), [sessionParams]);

  useEffect(() => {
    const pathwayTrim = scopedPathwayId?.trim() ?? "";
    if (!pathwayTrim) {
      setCustomSessionLoading(false);
      setBuilderSummary(null);
      setBuilderCategories([]);
      setBuilderError(t("learner.flashcards.hub.bodySystemsMissingPathway"));
      setBodySystemsOutcome("error");
      return;
    }

    let active = true;
    const ac = new AbortController();
    const timeoutId = window.setTimeout(() => ac.abort(), CUSTOM_SESSION_FETCH_TIMEOUT_MS);

    setCustomSessionLoading(true);
    setBuilderError(null);

    const url = `/api/flashcards/custom-session?${sessionParams.toString()}`;
    if (process.env.NODE_ENV !== "production") {
      console.debug("[nn-flashcards-hub] custom-session fetch", {
        pathwayId: pathwayTrim,
        url,
        queryKey: sessionQueryKey.slice(0, 160),
      });
    }

    void (async () => {
      try {
        const res = await fetch(url, { credentials: "include", signal: ac.signal });
        const text = await res.text();
        let json: unknown;
        try {
          json = text ? JSON.parse(text) : null;
        } catch {
          json = null;
        }
        if (!active) return;

        const parsed = parseFlashcardCustomSessionResponse(res.ok, json);
        if (process.env.NODE_ENV !== "production") {
          console.debug("[nn-flashcards-hub] custom-session response", {
            pathwayId: pathwayTrim,
            status: res.status,
            ok: parsed.ok,
            categoryCount: parsed.ok ? parsed.categoryOptions.length : null,
            outcome: parsed.ok ? (parsed.categoryOptions.length ? "populated" : "empty") : "error",
          });
        }

        if (!active) return;

        if (!parsed.ok) {
          setBuilderSummary(null);
          setBuilderCategories([]);
          setBuilderError(parsed.message);
          setBodySystemsOutcome(flashcardBodySystemsUiOutcomeFromParsed(parsed));
          return;
        }

        const cats = parsed.categoryOptions;
        setBuilderCategories(cats);
        setBuilderSummary(parsed.summary as BuilderSummary | null);
        setBuilderError(null);
        setBodySystemsOutcome(flashcardBodySystemsUiOutcomeFromParsed(parsed));
      } catch (e) {
        if (!active) return;
        const aborted = e instanceof DOMException && e.name === "AbortError";
        setBuilderSummary(null);
        setBuilderCategories([]);
        setBuilderError(
          aborted ? t("learner.flashcards.hub.bodySystemsTimeout") : e instanceof Error ? e.message : t("learner.flashcards.hub.bodySystemsError"),
        );
        setBodySystemsOutcome("error");
      } finally {
        window.clearTimeout(timeoutId);
        if (active) setCustomSessionLoading(false);
      }
    })();

    return () => {
      active = false;
      ac.abort();
      window.clearTimeout(timeoutId);
    };
  }, [sessionQueryKey, scopedPathwayId, t, refetchNonce]);

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
    bodySystemsOutcome !== "populated" || builderCategories.length === 0
      ? null
      : selectedBodyIds.length === 0
        ? `All ${builderCategories.length} areas`
        : `${selectedBodyIds.length} of ${builderCategories.length} areas`;

  const bodySystemsPickerEnabled = bodySystemsOutcome === "populated" && !customSessionLoading;

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
    <div className="lv-page-scope mx-auto flex min-h-[60vh] max-w-xl flex-col gap-10 px-4 py-8 sm:max-w-2xl sm:py-10">
      <header className="space-y-3">
        <h1 className="text-2xl font-semibold tracking-tight text-lv-text-primary sm:text-3xl">
          {t("learner.flashcards.hub.title")}
        </h1>
        <p className="max-w-prose text-sm leading-relaxed text-lv-text-secondary">{t("learner.flashcards.hub.subtitle")}</p>
        <div className="pt-1">
          <LearnerCtaLink href={weakAreasStudyHref} variant="primary" className="min-h-11 px-5">
            {t("learner.flashcards.hub.weakAreasCta")}
          </LearnerCtaLink>
        </div>
      </header>

      {!metaLoading && (dueSummary || stats) ? (
        <section className="space-y-3" aria-label={t("learner.flashcards.hub.masteryOverview")}>
          <p className="text-xs font-medium tracking-wide text-lv-text-secondary">{t("learner.flashcards.hub.masteryOverview")}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="lv-kpi-tile">
              <p className="text-xs text-lv-text-secondary">{t("learner.flashcards.hub.kpiDueToday")}</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums text-[var(--semantic-info)]">{dueSummary != null ? dueSummary.dueToday : "—"}</p>
            </div>
            <div className="lv-kpi-tile">
              <p className="text-xs text-lv-text-secondary">{t("learner.flashcards.hub.kpiOverdue")}</p>
              <p
                className={`mt-1 text-2xl font-semibold tabular-nums ${
                  dueSummary != null && dueSummary.overdue > 0 ? "text-[var(--semantic-danger)]" : ""
                }`}
              >
                {dueSummary != null ? dueSummary.overdue : "—"}
              </p>
            </div>
            <div className="lv-kpi-tile">
              <p className="text-xs text-lv-text-secondary">{t("learner.flashcards.hub.kpiStreak")}</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums text-[var(--semantic-chart-3)]">{stats != null ? stats.currentStreak : "—"}</p>
              {stats != null ? (
                <p className="mt-1 text-xs text-lv-text-secondary">
                  {t("learner.flashcards.hub.kpiBest")}: <span className="font-medium tabular-nums">{stats.longestStreak}</span>
                </p>
              ) : null}
            </div>
            <div className="lv-kpi-tile">
              <p className="text-xs text-lv-text-secondary">{t("learner.flashcards.hub.kpiReviewed")}</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums">{stats != null ? stats.cardsReviewedTotal : "—"}</p>
            </div>
          </div>
          {totalDue > 0 ? (
            <Link href={weakAreasStudyHref} className="lv-cta-banner lv-cta-banner--brand-tint">
              Review {totalDue} due now →
            </Link>
          ) : null}
        </section>
      ) : null}

      <section id="study-session" className="lv-flash-shell space-y-8" aria-labelledby="custom-study-heading">
        <div className="space-y-2">
          <p className="text-xs font-medium tracking-wide text-lv-primary-500">{pathwayDisplayName}</p>
          <h2 id="custom-study-heading" className="text-xl font-semibold tracking-tight text-lv-text-primary sm:text-2xl">
            {t("learner.flashcards.hub.customStudyTitle")}
          </h2>
          <p className="text-sm leading-relaxed text-lv-text-secondary">
            Build a focused flashcard session for this pathway.
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium text-lv-text-primary">Session size</p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Number of cards">
            {CARD_COUNTS.map((n) => {
              const on = cardLimit === n;
              return (
                <button
                  key={n}
                  type="button"
                  aria-pressed={on}
                  data-pressed={on ? "true" : "false"}
                  onClick={() => setCardLimit(n)}
                  className="lv-pill-toggle"
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
              <p className="text-sm font-medium text-lv-text-primary">{t("learner.flashcards.hub.bodySystemsHeading")}</p>
              {bodyAreasSummary ? <p className="mt-1 text-xs text-lv-text-secondary">{bodyAreasSummary}</p> : null}
            </div>
            <div className="flex flex-wrap gap-2">
              {showWeakShortcut ? (
                <button type="button" onClick={applyWeakShortcut} className="lv-chip-warn">
                  Focus due cards
                </button>
              ) : null}
              <button
                type="button"
                onClick={selectAllSystems}
                disabled={!bodySystemsPickerEnabled}
                className="lv-cta-quiet lv-cta-quiet--emphasis disabled:pointer-events-none disabled:opacity-40"
              >
                Select all
              </button>
              <button
                type="button"
                onClick={clearSystemsAndSearch}
                disabled={!bodySystemsPickerEnabled}
                className="lv-cta-quiet disabled:pointer-events-none disabled:opacity-40"
              >
                Clear
              </button>
            </div>
          </div>
          <label className="block text-xs font-medium text-lv-text-secondary">
            Search areas
            <input
              type="search"
              value={categorySearch}
              onChange={(e) => setCategorySearch(e.target.value)}
              placeholder="Find a body system…"
              autoComplete="off"
              disabled={!bodySystemsPickerEnabled}
              className="mt-1.5 w-full min-h-11 rounded-lv-lg border border-lv-border-soft bg-lv-bg-surface px-3 py-2.5 text-sm text-lv-text-primary shadow-lv-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lv-primary-300 disabled:cursor-not-allowed disabled:opacity-40"
            />
          </label>
          <div className="lv-panel lv-panel--border-muted flex min-h-20 flex-col gap-3 p-3 sm:p-4">
            {customSessionLoading && bodySystemsOutcome === "pending" ? (
              <p className="text-sm text-lv-text-secondary">{t("learner.flashcards.hub.bodySystemsLoading")}</p>
            ) : null}
            {customSessionLoading && bodySystemsOutcome === "populated" ? (
              <p className="text-xs text-lv-text-secondary">{t("learner.flashcards.hub.bodySystemsRefreshing")}</p>
            ) : null}
            {!customSessionLoading && bodySystemsOutcome === "empty" ? (
              <div className="space-y-2">
                <p className="text-sm leading-relaxed text-lv-text-secondary">{t("learner.flashcards.hub.bodySystemsEmpty")}</p>
                <div className="flex flex-wrap gap-2">
                  <Link href="/app/lessons" className="lv-btn-secondary min-h-10 px-4 py-2 text-sm">
                    {t("learner.flashcards.hub.bodySystemsEmptyCtaLessons")}
                  </Link>
                  <LearnerCtaLink href={weakAreasStudyHref} variant="secondary" className="min-h-10 px-4 py-2 text-sm">
                    {t("learner.flashcards.hub.weakAreasCta")}
                  </LearnerCtaLink>
                </div>
              </div>
            ) : null}
            {!customSessionLoading && bodySystemsOutcome === "error" ? (
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-[var(--semantic-danger)]">{builderError ?? t("learner.flashcards.hub.bodySystemsError")}</p>
                <button
                  type="button"
                  className="lv-btn-secondary min-h-10 shrink-0 px-4 py-2 text-sm font-medium"
                  onClick={() => setRefetchNonce((n) => n + 1)}
                >
                  {t("learner.flashcards.hub.bodySystemsRetry")}
                </button>
              </div>
            ) : null}
            {filteredCategories.map((category) => {
              const selected = chipSelected(category.id);
              return (
                <button
                  key={category.id}
                  type="button"
                  disabled={!bodySystemsPickerEnabled}
                  onClick={() => toggleBodySystem(category.id)}
                  data-selected={selected ? "true" : "false"}
                  className="lv-chip lv-chip--stack disabled:pointer-events-none disabled:opacity-40"
                >
                  <span className="block">{formatTitleCase(category.title)}</span>
                  {category.count > 0 ? (
                    <span className="mt-0.5 block text-xs tabular-nums text-lv-text-secondary">{category.count} cards</span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        <div className="lv-panel space-y-4 p-5">
          <div>
            <p className="text-sm font-medium text-lv-text-primary">{t("learner.flashcards.hub.reviewFiltersHeading")}</p>
            <p className="mt-1 text-xs leading-relaxed text-lv-text-secondary">Focus your session using progress and review markers.</p>
          </div>
          <div className="flex flex-col gap-3">
            <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lv-md border border-transparent px-1 py-1 hover:bg-lv-primary-50/40">
              <input type="checkbox" className="size-5 shrink-0 rounded border-lv-border-soft" checked={weakOnly} onChange={(e) => setWeakOnly(e.target.checked)} />
              <span className="text-sm font-medium text-lv-text-primary">Weak areas only</span>
            </label>
            <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lv-md border border-transparent px-1 py-1 hover:bg-lv-primary-50/40">
              <input
                type="checkbox"
                className="size-5 shrink-0 rounded border-lv-border-soft"
                checked={incorrectOnly}
                onChange={(e) => setIncorrectOnly(e.target.checked)}
              />
              <span className="text-sm font-medium text-lv-text-primary">Previously incorrect</span>
            </label>
            <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lv-md border border-transparent px-1 py-1 hover:bg-lv-primary-50/40">
              <input
                type="checkbox"
                className="size-5 shrink-0 rounded border-lv-border-soft"
                checked={notStudiedOnly}
                onChange={(e) => setNotStudiedOnly(e.target.checked)}
              />
              <span className="text-sm font-medium text-lv-text-primary">Not yet studied</span>
            </label>
            <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lv-md border border-transparent px-1 py-1 hover:bg-lv-primary-50/40">
              <input
                type="checkbox"
                className="size-5 shrink-0 rounded border-lv-border-soft"
                checked={starredOnly}
                onChange={(e) => setStarredOnly(e.target.checked)}
              />
              <span className="text-sm font-medium text-lv-text-primary">Starred{savedStats.starred > 0 ? ` (${savedStats.starred})` : ""}</span>
            </label>
            <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lv-md border border-transparent px-1 py-1 hover:bg-lv-primary-50/40">
              <input
                type="checkbox"
                className="size-5 shrink-0 rounded border-lv-border-soft"
                checked={revisitOnly}
                onChange={(e) => setRevisitOnly(e.target.checked)}
              />
              <span className="text-sm font-medium text-lv-text-primary">Marked for revisit{savedStats.confusing > 0 ? ` (${savedStats.confusing})` : ""}</span>
            </label>
          </div>
        </div>

        <div className="lv-panel flex min-h-[52px] items-center justify-between gap-4 px-4 py-3">
          <div>
            <p className="text-sm font-medium text-lv-text-primary">Shuffle</p>
            <p className="text-xs text-lv-text-secondary">Mix card order in this session</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={shuffleOn}
            data-on={shuffleOn ? "true" : "false"}
            onClick={() => setShuffleOn((s) => !s)}
            className="lv-toggle"
          >
            <span className="lv-toggle-thumb" data-on={shuffleOn ? "true" : "false"} aria-hidden />
          </button>
        </div>

        <div className="lv-panel lv-panel--tint-info p-5">
          <p className="text-xs font-medium tracking-wide text-lv-text-secondary">Session summary</p>
          <ul className="mt-3 space-y-2 text-sm text-lv-text-secondary">
            <li>
              <span className="font-medium text-lv-text-primary">{cardLimit} cards</span>
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
            {builderSummary ? (
              <li>
                <span className="font-medium text-lv-text-primary">{builderSummary.matchingCards}</span> cards
                match filters; <span className="font-medium text-lv-text-primary">{builderSummary.returnedCards}</span> available for this session cap
              </li>
            ) : null}
          </ul>
        </div>

        <div className="sticky bottom-0 -mx-2 flex flex-col gap-3 border-t border-lv-border-soft bg-lv-bg-base/95 px-2 pb-2 pt-4 backdrop-blur-sm sm:static sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-0">
          <LearnerCtaLink href={startHref} variant="primary" className="min-h-12 w-full px-6 sm:w-auto">
            {t("learner.flashcards.hub.startStudying")}
          </LearnerCtaLink>
          <button
            type="button"
            onClick={() => void previewCustomCards()}
            className="lv-btn-secondary min-h-12 w-full px-6 sm:w-auto"
          >
            {t("learner.flashcards.hub.previewCards")}
          </button>
        </div>

        {customSessionLoading ? <p className="text-xs text-lv-text-secondary">Updating session…</p> : null}
        {builderError && bodySystemsOutcome !== "error" ? (
          <p className="text-sm text-[var(--semantic-danger)]">{builderError}</p>
        ) : null}

        {previewCards.length > 0 ? (
          <div className="lv-panel p-4">
            <p className="mb-3 text-xs font-medium tracking-wide text-lv-text-secondary">Preview</p>
            <ul className="space-y-2 text-sm">
              {previewCards.map((card) => (
                <li key={card.id} className="rounded-lv-md border border-lv-border-soft bg-lv-bg-surface-alt/50 p-3">
                  <p className="font-medium text-lv-text-primary">{card.front}</p>
                  {card.topic ? <p className="mt-1 text-xs text-lv-text-secondary">{card.topic}</p> : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      <footer className="flex flex-wrap gap-2 border-t border-lv-border-soft pt-8">
        <Link href="/lessons" className="lv-btn-secondary min-h-11 px-4 py-2.5 text-sm">
          {t("learner.flashcards.hub.bottomExamLessons")}
        </Link>
        <Link href="/app/review" className="lv-btn-secondary min-h-11 px-4 py-2.5 text-sm">
          Spaced review queue
        </Link>
      </footer>

      {isNpPathway ? (
        <p className="text-center text-xs text-lv-text-secondary">
          Flashcard coverage for this pathway is still growing. Lessons and practice questions are the best complement right now.
        </p>
      ) : null}
    </div>
  );
}
