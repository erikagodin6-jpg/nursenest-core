"use client";

import React, { type CSSProperties } from "react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { formatTitleCase } from "@/lib/format/text-case";
import { parseFlashcardCustomSessionResponse } from "@/lib/flashcards/flashcard-custom-session-response";
import {
  countSavedStudyItems,
  getStudyItemIdsMatchingFilters,
} from "@/lib/flashcards/study-session-persistence";
import { LearnerCtaLink } from "@/components/learner-ui/learner-cta-link";
import { weakAreaFlashcardsHref } from "@/lib/learner/weak-area-flashcards-href";
import { LearnerStudyLiveSyncBanner } from "@/components/student/learner-study-live-sync-banner";
import { getLessonHubSystemVisual } from "@/components/pathway-lessons/lesson-system-hub-visuals";
import type { FlashcardLessonVirtualDiagnostics } from "@/lib/flashcards/flashcard-custom-session-response";
import type { FlashcardsHubServerPayload } from "@/lib/flashcards/flashcards-hub-types";

const CARD_COUNTS = [10, 20, 30, 50] as const;

function buildCustomSessionQuery(args: {
  pathwayId: string;
  cardLimit: number;
  shuffleOn: boolean;
  selectedBodyIds: string[];
  allBodyIds: string[];
  weakOnly: boolean;
  incorrectOnly: boolean;
  starredOnly: boolean;
  notStudiedOnly: boolean;
  includeCards: boolean;
}): string {
  const q = new URLSearchParams();
  q.set("pathwayId", args.pathwayId);
  q.set("includeCards", args.includeCards ? "1" : "0");
  q.set("shuffle", args.shuffleOn ? "1" : "0");
  q.set("cardLimit", String(args.cardLimit));
  if (args.selectedBodyIds.length > 0 && args.selectedBodyIds.length < args.allBodyIds.length) {
    q.set("categories", args.selectedBodyIds.join(","));
  }
  if (args.weakOnly) q.set("weakOnly", "1");
  if (args.incorrectOnly) q.set("incorrectOnly", "1");
  if (args.starredOnly) {
    q.set("starredOnly", "1");
    const starredIds = getStudyItemIdsMatchingFilters({ starredOnly: true }, 500);
    if (starredIds.length > 0) q.set("stateIds", starredIds.join(","));
  }
  if (args.notStudiedOnly) q.set("notStudiedOnly", "1");
  return q.toString();
}

function hubVisualKeyForCategory(id: string): string {
  const s = id.trim().toLowerCase().replace(/[^a-z0-9]+/g, "_");
  return s.length > 0 ? s : "fundamentals";
}

export function FlashcardsHubClient({
  scopedPathwayId,
  pathwayDisplayName,
  pathwayBootstrapSource = "primary",
  catHref,
  initialHub,
  lessonsHubHref,
}: {
  scopedPathwayId: string;
  pathwayDisplayName: string;
  pathwayBootstrapSource?: "primary" | "secondary";
  catHref?: string;
  initialHub?: FlashcardsHubServerPayload | null;
  /** Same-pathway lessons hub — mirrors learner lessons IA for every tier/pathway. */
  lessonsHubHref?: string;
}) {
  const { t } = useMarketingI18n();
  const resolvedLessonsHubHref =
    lessonsHubHref?.trim() ||
    `/app/lessons?pathwayId=${encodeURIComponent(scopedPathwayId)}`;

  const [builderCategories, setBuilderCategories] = useState<
    Array<{ id: string; title: string; description?: string; count: number }>
  >(() => initialHub?.categoryOptions ?? []);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [matchingCards, setMatchingCards] = useState<number | null>(() => initialHub?.matchingTotal ?? null);
  const [lessonVirtualDiagnostics, setLessonVirtualDiagnostics] = useState<FlashcardLessonVirtualDiagnostics | null>(
    () => initialHub?.lessonVirtualDiagnostics ?? null,
  );
  const [selectedBodyIds, setSelectedBodyIds] = useState<string[]>([]);
  const [cardLimit, setCardLimit] = useState(20);
  const [shuffleOn, setShuffleOn] = useState(true);
  const [weakOnly, setWeakOnly] = useState(false);
  const [incorrectOnly, setIncorrectOnly] = useState(false);
  const [starredOnly, setStarredOnly] = useState(false);
  const [notStudiedOnly, setNotStudiedOnly] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");

  const builderCategoriesRef = useRef(builderCategories);
  builderCategoriesRef.current = builderCategories;

  /**
   * When the RSC page already passed `initialHub`, skip the first client `custom-session` fetch so
   * `router.refresh()` / Strict Mode remounts do not stack duplicate inventory requests (felt like a
   * refresh loop on `/app/flashcards?pathwayId=…`).
   */
  const skipDuplicateInitialInventoryFetchRef = useRef(
    Boolean(
      initialHub &&
        ((initialHub.categoryOptions?.length ?? 0) > 0 ||
          (initialHub.matchingTotal ?? 0) > 0 ||
          (initialHub.lessonVirtualDiagnostics?.totalGeneratedVirtualCards ?? 0) > 0),
    ),
  );

  const allBodyIds = useMemo(() => builderCategories.map((c) => c.id), [builderCategories]);

  const refreshCategories = useCallback(async () => {
    setLoadError(null);
    try {
      const allIds = builderCategoriesRef.current.map((c) => c.id);
      const qs = buildCustomSessionQuery({
        pathwayId: scopedPathwayId,
        cardLimit,
        shuffleOn,
        selectedBodyIds,
        allBodyIds: allIds,
        weakOnly,
        incorrectOnly,
        starredOnly,
        notStudiedOnly,
        includeCards: false,
      });
      const res = await fetch(`/api/flashcards/custom-session?${qs}`, { credentials: "include" });
      const json: unknown = await res.json();
      const parsed = parseFlashcardCustomSessionResponse(res.ok, json);
      if (!parsed.ok) {
        setLoadError(parsed.message);
        setBuilderCategories([]);
        setMatchingCards(null);
        return;
      }
      setBuilderCategories(parsed.categoryOptions);
      setMatchingCards(parsed.summary?.matchingCards ?? 0);
      setLessonVirtualDiagnostics(parsed.summary?.lessonVirtualDiagnostics ?? null);
    } catch {
      setLoadError("Could not load flashcard topics.");
      setBuilderCategories([]);
      setMatchingCards(null);
      setLessonVirtualDiagnostics(null);
    }
  }, [
    scopedPathwayId,
    cardLimit,
    shuffleOn,
    selectedBodyIds,
    weakOnly,
    incorrectOnly,
    starredOnly,
    notStudiedOnly,
  ]);

  useEffect(() => {
    if (skipDuplicateInitialInventoryFetchRef.current) {
      skipDuplicateInitialInventoryFetchRef.current = false;
      return;
    }
    void refreshCategories();
  }, [refreshCategories]);

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

  const sessionSummaryLine = [
    `${cardLimit} cards`,
    selectedBodyIds.length === 0 ? "all systems" : `${selectedBodyIds.length} systems`,
    shuffleOn ? "shuffle on" : "shuffle off",
    lessonVirtualDiagnostics
      ? `lesson-linked ${lessonVirtualDiagnostics.totalGeneratedVirtualCards} cards · ${lessonVirtualDiagnostics.lessonsWithDerivedCards}/${lessonVirtualDiagnostics.catalogLessonCount} lessons`
      : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const startQuery = useMemo(
    () =>
      buildCustomSessionQuery({
        pathwayId: scopedPathwayId,
        cardLimit,
        shuffleOn,
        selectedBodyIds,
        allBodyIds,
        weakOnly,
        incorrectOnly,
        starredOnly,
        notStudiedOnly,
        includeCards: true,
      }),
    [
      scopedPathwayId,
      cardLimit,
      shuffleOn,
      selectedBodyIds,
      allBodyIds,
      weakOnly,
      incorrectOnly,
      starredOnly,
      notStudiedOnly,
    ],
  );

  const startHref = `/app/flashcards/custom?${startQuery}`;

  const filteredCategories = builderCategories.filter((c) =>
    categorySearch ? c.title.toLowerCase().includes(categorySearch.toLowerCase()) : true,
  );

  const starredCount = useMemo(() => countSavedStudyItems().starred, []);

  const activePreset = useMemo((): "all" | "weak" | "incorrect" | "starred" | "unseen" | "custom" => {
    if (starredOnly && !weakOnly && !incorrectOnly && !notStudiedOnly) return "starred";
    if (notStudiedOnly && !weakOnly && !incorrectOnly && !starredOnly) return "unseen";
    if (incorrectOnly && !weakOnly && !starredOnly && !notStudiedOnly) return "incorrect";
    if (weakOnly && !incorrectOnly && !starredOnly && !notStudiedOnly) return "weak";
    if (!weakOnly && !incorrectOnly && !starredOnly && !notStudiedOnly) return "all";
    return "custom";
  }, [weakOnly, incorrectOnly, starredOnly, notStudiedOnly]);

  const applyFilterPreset = (p: "all" | "weak" | "incorrect" | "starred" | "unseen") => {
    if (p === "all") {
      setWeakOnly(false);
      setIncorrectOnly(false);
      setStarredOnly(false);
      setNotStudiedOnly(false);
    } else if (p === "weak") {
      setWeakOnly(true);
      setIncorrectOnly(false);
      setStarredOnly(false);
      setNotStudiedOnly(false);
    } else if (p === "incorrect") {
      setWeakOnly(false);
      setIncorrectOnly(true);
      setStarredOnly(false);
      setNotStudiedOnly(false);
    } else if (p === "starred") {
      setWeakOnly(false);
      setIncorrectOnly(false);
      setStarredOnly(true);
      setNotStudiedOnly(false);
    } else {
      setWeakOnly(false);
      setIncorrectOnly(false);
      setStarredOnly(false);
      setNotStudiedOnly(true);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6" data-nn-e2e-flashcards-hub>
      {pathwayBootstrapSource === "secondary" ? <LearnerStudyLiveSyncBanner /> : null}

      {catHref ? (
        <div className="text-sm">
          <Link href={catHref} className="text-primary underline">
            Continue adaptive (CAT)
          </Link>
        </div>
      ) : null}

      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">{t("learner.flashcards.hub.title")}</h1>
        <p className="text-sm text-[var(--semantic-text-secondary)]">{t("learner.flashcards.hub.subtitle")}</p>
        <p className="text-xs text-[var(--semantic-brand)]">{pathwayDisplayName}</p>
        <p className="mt-1 text-xs text-[var(--semantic-text-secondary)]">{sessionSummaryLine}</p>
        {lessonVirtualDiagnostics ? (
          <div
            className="rounded-lg border border-[color-mix(in_srgb,var(--semantic-info)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_6%,var(--semantic-surface))] px-3 py-2 text-xs text-[var(--semantic-text-secondary)]"
            data-nn-e2e-flashcards-lesson-diagnostics
          >
            <p className="font-semibold text-[var(--semantic-text-primary)]">Lesson-linked inventory</p>
            <ul className="mt-1 list-disc space-y-0.5 pl-4 font-mono leading-relaxed">
              <li>pathwayId: {lessonVirtualDiagnostics.pathwayId}</li>
              <li>catalog lessons: {lessonVirtualDiagnostics.catalogLessonCount}</li>
              <li>lessons with derived cards: {lessonVirtualDiagnostics.lessonsWithDerivedCards}</li>
              <li>total generated virtual cards: {lessonVirtualDiagnostics.totalGeneratedVirtualCards}</li>
              <li>recall rows: {lessonVirtualDiagnostics.recallVirtualCount}</li>
              <li>section-derived rows: {lessonVirtualDiagnostics.sectionDerivedVirtualCount}</li>
              <li>generic-filler-tagged section rows: {lessonVirtualDiagnostics.genericFillerSectionCardHits}</li>
              <li>selected systems/categories: {lessonVirtualDiagnostics.selectedCategoryIds.join(", ") || "(all)"}</li>
              <li>filter mode: {lessonVirtualDiagnostics.filterModeLabel}</li>
            </ul>
          </div>
        ) : null}
        <div className="flex flex-wrap gap-3 pt-1 text-sm">
          <Link
            href={resolvedLessonsHubHref}
            className="font-semibold text-[var(--semantic-brand)] underline underline-offset-2"
          >
            Open lessons hub (same pathway)
          </Link>
          <span className="text-[var(--semantic-text-secondary)]">·</span>
          <span className="text-[var(--semantic-text-secondary)]">
            Pick one or more body systems below — layout matches your pathway lessons hub.
          </span>
        </div>
      </header>

      <div className="flex flex-wrap gap-2" data-nn-e2e-flashcard-filter-presets>
        {(
          [
            ["all", "All cards"],
            ["weak", "Weak areas"],
            ["starred", "Starred"],
            ["unseen", "Unseen"],
            ["incorrect", "Review incorrect"],
          ] as const
        ).map(([key, label]) => {
          const on = activePreset === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => applyFilterPreset(key)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                on
                  ? "border-[color-mix(in_srgb,var(--semantic-info)_45%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_14%,var(--semantic-surface))] text-[var(--semantic-text-primary)]"
                  : "border-[var(--semantic-border-soft)] text-[var(--semantic-text-secondary)] hover:bg-[var(--semantic-panel-muted)]"
              }`}
            >
              {label}
            </button>
          );
        })}
        {activePreset === "custom" ? (
          <span className="self-center text-xs text-[var(--semantic-text-secondary)]">Custom mix</span>
        ) : null}
      </div>

      {loadError ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {loadError}
        </div>
      ) : null}

      {!loadError &&
      matchingCards === 0 &&
      !starredOnly &&
      builderCategories.length > 0 &&
      (weakOnly || incorrectOnly || notStudiedOnly || starredOnly || selectedBodyIds.length > 0) ? (
        <div
          className="rounded-lg border border-[color-mix(in_srgb,var(--semantic-warning)_32%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_8%,var(--semantic-surface))] px-4 py-3 text-sm text-[var(--semantic-text-secondary)]"
          data-nn-e2e-flashcards-filter-empty
        >
          <p className="font-medium text-[var(--semantic-text-primary)]">No cards match this combination</p>
          <p className="mt-2">
            Systems are listed below, but filters removed every matching card. Choose <strong>All cards</strong>, clear
            extra system picks, or open the{" "}
            <Link href={resolvedLessonsHubHref} className="font-semibold text-[var(--semantic-brand)] underline">
              lessons hub
            </Link>{" "}
            to confirm lesson-linked recall is available for this track.
          </p>
        </div>
      ) : null}

      {!loadError &&
      matchingCards === 0 &&
      !starredOnly &&
      builderCategories.length === 0 &&
      !(lessonVirtualDiagnostics && lessonVirtualDiagnostics.totalGeneratedVirtualCards > 0) ? (
        <div
          className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--theme-card-bg)] px-4 py-3 text-sm text-[var(--semantic-text-secondary)]"
          data-nn-e2e-flashcards-setup-report
        >
          <p className="font-medium text-[var(--semantic-text-primary)]">No flashcard deck loaded for this filter yet</p>
          <p className="mt-2">
            When the question bank has no published cards for this pathway, we still try to build study cards from
            your lesson checkpoints. Open the{" "}
            <Link href={resolvedLessonsHubHref} className="font-semibold text-[var(--semantic-brand)] underline">
              lessons hub
            </Link>{" "}
            for this track, complete a lesson section, then return — or clear filters above and choose <strong>All cards</strong>.
          </p>
        </div>
      ) : null}

      {!loadError &&
      matchingCards === 0 &&
      !starredOnly &&
      builderCategories.length === 0 &&
      lessonVirtualDiagnostics &&
      lessonVirtualDiagnostics.totalGeneratedVirtualCards > 0 ? (
        <div
          className="rounded-lg border border-[color-mix(in_srgb,var(--semantic-warning)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_8%,var(--semantic-surface))] px-4 py-3 text-sm text-[var(--semantic-text-secondary)]"
          data-nn-e2e-flashcards-inventory-mismatch
        >
          <p className="font-medium text-[var(--semantic-text-primary)]">Lesson-linked cards exist but topics did not resolve</p>
          <p className="mt-2">
            Diagnostics show {lessonVirtualDiagnostics.totalGeneratedVirtualCards} catalog-derived cards for pathway{" "}
            <span className="font-mono">{lessonVirtualDiagnostics.pathwayId}</span>. Try refreshing the page or clearing
            filters; if this persists, contact support with this pathway id.
          </p>
        </div>
      ) : null}

      {!loadError && starredOnly && matchingCards === 0 ? (
        <div className="rounded-lg border border-border bg-[var(--theme-card-bg)] px-4 py-3 text-sm text-[var(--theme-muted-text)]">
          No starred cards yet. Star cards during study ({starredCount} saved in this browser).
        </div>
      ) : null}

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">{t("learner.flashcards.hub.bodySystemsHeading")}</h2>
          <p className="mt-1 text-xs text-[var(--semantic-text-secondary)]">
            Tap to include or exclude systems — same multi-select pattern as the lessons hub category cards.
          </p>
        </div>

        <input
          type="search"
          placeholder="Search body systems…"
          value={categorySearch}
          onChange={(e) => setCategorySearch(e.target.value)}
          className="w-full rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-2 text-sm"
        />

        <div className="nn-qa-pathway-lessons-grid grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filteredCategories.map((c) => {
            const selected = selectedBodyIds.length === 0 || selectedBodyIds.includes(c.id);
            const visual = getLessonHubSystemVisual(hubVisualKeyForCategory(c.id));
            const Icon = visual.icon;
            const systemStyle = { "--nn-system-accent": `var(${visual.accentVar})` } as CSSProperties;

            return (
              <button
                key={c.id}
                type="button"
                onClick={() => toggleBodySystem(c.id)}
                data-selected={selected}
                data-nn-e2e-body-system-card={c.id}
                style={systemStyle}
                className="nn-lesson-system-card text-left transition hover:shadow-[var(--semantic-shadow-soft)] data-[selected=false]:opacity-70 rounded-[1.35rem] border border-[color-mix(in_srgb,var(--nn-system-accent)_16%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] p-3.5 sm:p-4 data-[selected=true]:ring-2 data-[selected=true]:ring-[color-mix(in_srgb,var(--nn-system-accent)_45%,transparent)]"
              >
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--nn-system-accent)_18%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--nn-system-accent)_9%,var(--semantic-panel-muted))] text-[var(--nn-system-accent)]">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="line-clamp-2 text-base font-semibold leading-snug text-[var(--theme-heading-text)]">
                      {formatTitleCase(c.title)}
                    </div>
                    {c.description ? (
                      <p className="mt-1 line-clamp-2 text-xs text-[var(--semantic-text-secondary)]">{c.description}</p>
                    ) : null}
                    <p className="mt-2 text-xs font-semibold text-[var(--semantic-text-secondary)]">
                      {c.count} card{c.count === 1 ? "" : "s"} in pool
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section className="space-y-5 border-t border-[var(--semantic-border-soft)] pt-4">
        <details className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] p-3">
          <summary className="cursor-pointer text-sm font-semibold text-[var(--semantic-text-primary)]">
            Advanced filters (same flags as the API)
          </summary>
          <div className="mt-3 space-y-3">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={weakOnly} onChange={(e) => setWeakOnly(e.target.checked)} />
              Weak areas only
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={incorrectOnly} onChange={(e) => setIncorrectOnly(e.target.checked)} />
              Previously incorrect
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={notStudiedOnly} onChange={(e) => setNotStudiedOnly(e.target.checked)} />
              Not studied
            </label>

            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={starredOnly} onChange={(e) => setStarredOnly(e.target.checked)} />
              Starred only
            </label>
          </div>
        </details>

        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-[var(--semantic-text-secondary)]">Deck size:</span>
          {CARD_COUNTS.map((n) => (
            <button
              key={n}
              type="button"
              className={`rounded-full border border-[var(--semantic-border-soft)] px-3 py-1 ${
                cardLimit === n
                  ? "border-[color-mix(in_srgb,var(--semantic-brand)_40%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_12%,var(--semantic-surface))]"
                  : ""
              }`}
              onClick={() => setCardLimit(n)}
            >
              {n}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={shuffleOn} onChange={(e) => setShuffleOn(e.target.checked)} />
          Shuffle order
        </label>
      </section>

      <div className="sticky bottom-0 z-10 mt-6 border-t bg-[var(--theme-page-bg)] pb-2 pt-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <LearnerCtaLink href={startHref} data-nn-e2e-start-review>
              {t("flashcards.startSession")}
            </LearnerCtaLink>
            <p className="mt-1 text-xs text-[var(--semantic-text-secondary)]">{sessionSummaryLine}</p>
          </div>

          <Link href={weakAreaFlashcardsHref(scopedPathwayId)} className="text-xs text-primary underline">
            Weak areas
          </Link>
        </div>
      </div>
    </div>
  );
}
