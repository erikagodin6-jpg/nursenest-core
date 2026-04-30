"use client";

import React from "react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import {
  LearnerCategorySelector,
  LearnerFilterBar,
  LearnerSessionStartPanel,
  LearnerStudyHero,
  LearnerStudyPageShell,
} from "@/components/learner-study-ui";
import {
  builderCategoryIdsForCanonicalSelection,
  getFlashcardCountsByBodySystem,
  type CanonicalBodySystemId,
} from "@/lib/learner-study-hub/body-system-data";
import { CANONICAL_STUDY_CATEGORIES } from "@/lib/study/normalize-study-category";
import { parseFlashcardCustomSessionResponse } from "@/lib/flashcards/flashcard-custom-session-response";
import {
  countSavedStudyItems,
  getStudyItemIdsMatchingFilters,
} from "@/lib/flashcards/study-session-persistence";
import { LearnerCtaLink } from "@/components/learner-ui/learner-cta-link";
import { weakAreaFlashcardsHref } from "@/lib/learner/weak-area-flashcards-href";
import { LearnerStudyLiveSyncBanner } from "@/components/student/learner-study-live-sync-banner";
import type { FlashcardLessonVirtualDiagnostics } from "@/lib/flashcards/flashcard-custom-session-response";
import type { FlashcardsHubServerPayload } from "@/lib/flashcards/flashcards-hub-types";
import { isAlliedMarketingCorePathwayId } from "@/lib/lessons/canonical-lessons-hubs";

const CARD_COUNTS = [10, 20, 30, 50] as const;

function buildCustomSessionQuery(args: {
  pathwayId: string;
  cardLimit: number;
  shuffleOn: boolean;
  /** Resolved flashcard builder category ids (server `categories` query). */
  selectedBuilderCategoryIds: string[];
  allBuilderCategoryIds: string[];
  weakOnly: boolean;
  incorrectOnly: boolean;
  starredOnly: boolean;
  notStudiedOnly: boolean;
  includeCards: boolean;
  alliedProfession?: string | null;
}): string {
  const q = new URLSearchParams();
  q.set("pathwayId", args.pathwayId);
  q.set("includeCards", args.includeCards ? "1" : "0");
  q.set("shuffle", args.shuffleOn ? "1" : "0");
  q.set("cardLimit", String(args.cardLimit));
  if (
    args.selectedBuilderCategoryIds.length > 0 &&
    args.selectedBuilderCategoryIds.length < args.allBuilderCategoryIds.length
  ) {
    q.set("categories", args.selectedBuilderCategoryIds.join(","));
  }
  if (args.weakOnly) q.set("weakOnly", "1");
  if (args.incorrectOnly) q.set("incorrectOnly", "1");
  if (args.starredOnly) {
    q.set("starredOnly", "1");
    const starredIds = getStudyItemIdsMatchingFilters({ starredOnly: true }, 500);
    if (starredIds.length > 0) q.set("stateIds", starredIds.join(","));
  }
  if (args.notStudiedOnly) q.set("notStudiedOnly", "1");
  const ap = args.alliedProfession?.trim().toLowerCase();
  if (ap) q.set("alliedProfession", ap);
  return q.toString();
}

export function FlashcardsHubClient({
  scopedPathwayId,
  pathwayDisplayName,
  pathwayBootstrapSource = "primary",
  catHref,
  initialHub,
  lessonsHubHref,
  alliedProfessionKey = null,
}: {
  scopedPathwayId: string;
  pathwayDisplayName: string;
  pathwayBootstrapSource?: "primary" | "secondary";
  catHref?: string;
  initialHub?: FlashcardsHubServerPayload | null;
  /** Same-pathway lessons hub — mirrors learner lessons IA for every tier/pathway. */
  lessonsHubHref?: string;
  /** Preserved on allied marketing → app handoffs (`?alliedProfession=`). */
  alliedProfessionKey?: string | null;
}) {
  const { t } = useMarketingI18n();
  const apForQuery =
    alliedProfessionKey?.trim() && isAlliedMarketingCorePathwayId(scopedPathwayId)
      ? alliedProfessionKey.trim().toLowerCase()
      : "";
  const resolvedLessonsHubHref = (() => {
    const base =
      lessonsHubHref?.trim() || `/app/lessons?pathwayId=${encodeURIComponent(scopedPathwayId)}`;
    if (!apForQuery) return base;
    const join = base.includes("?") ? "&" : "?";
    return `${base}${join}alliedProfession=${encodeURIComponent(apForQuery)}`;
  })();

  const [builderCategories, setBuilderCategories] = useState<
    Array<{ id: string; title: string; description?: string; count: number }>
  >(() => initialHub?.categoryOptions ?? []);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [matchingCards, setMatchingCards] = useState<number | null>(() => initialHub?.matchingTotal ?? null);
  const [lessonVirtualDiagnostics, setLessonVirtualDiagnostics] = useState<FlashcardLessonVirtualDiagnostics | null>(
    () => initialHub?.lessonVirtualDiagnostics ?? null,
  );
  const [selectedCanonicalIds, setSelectedCanonicalIds] = useState<string[]>([]);
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
  /**
   * Skip the first client `custom-session` fetch when RSC already shipped usable inventory: any non-zero
   * per-system count, a positive matching pool, or lesson-derived virtual diagnostics. Pure skeleton rows
   * (all counts zero, no matches, no virtual diagnostics) still perform one client fetch to hydrate.
   */
  const skipDuplicateInitialInventoryFetchRef = useRef(
    Boolean(
      initialHub &&
        ((initialHub.matchingTotal ?? 0) > 0 ||
          (initialHub.lessonVirtualDiagnostics?.totalGeneratedVirtualCards ?? 0) > 0 ||
          (initialHub.categoryOptions?.some((c) => c.count > 0) ?? false)),
    ),
  );

  const allBuilderCategoryIds = useMemo(() => builderCategories.map((c) => c.id), [builderCategories]);

  const countsByCanonical = useMemo(
    () => getFlashcardCountsByBodySystem(scopedPathwayId, builderCategories),
    [scopedPathwayId, builderCategories],
  );

  const selectedBuilderCategoryIds = useMemo(() => {
    const allCanon = CANONICAL_STUDY_CATEGORIES.length;
    if (
      selectedCanonicalIds.length === 0 ||
      selectedCanonicalIds.length >= allCanon ||
      builderCategories.length === 0
    ) {
      return [];
    }
    return builderCategoryIdsForCanonicalSelection(
      scopedPathwayId,
      builderCategories,
      new Set(selectedCanonicalIds as CanonicalBodySystemId[]),
    );
  }, [scopedPathwayId, builderCategories, selectedCanonicalIds]);

  const refreshCategories = useCallback(async () => {
    setLoadError(null);
    try {
      const allIds = builderCategoriesRef.current.map((c) => c.id);
      const allCanon = CANONICAL_STUDY_CATEGORIES.length;
      const canonSel = selectedCanonicalIds;
      const resolved =
        canonSel.length === 0 || canonSel.length >= allCanon
          ? []
          : builderCategoryIdsForCanonicalSelection(
              scopedPathwayId,
              builderCategoriesRef.current,
              new Set(canonSel as CanonicalBodySystemId[]),
            );
      const qs = buildCustomSessionQuery({
        pathwayId: scopedPathwayId,
        cardLimit,
        shuffleOn,
        selectedBuilderCategoryIds: resolved,
        allBuilderCategoryIds: allIds,
        weakOnly,
        incorrectOnly,
        starredOnly,
        notStudiedOnly,
        includeCards: false,
        alliedProfession: apForQuery || null,
      });
      const res = await fetch(`/api/flashcards/custom-session?${qs}`, { credentials: "include" });
      let json: unknown;
      try {
        json = await res.json();
      } catch {
        setLoadError("Could not load flashcard topics.");
        setBuilderCategories([]);
        setMatchingCards(null);
        setLessonVirtualDiagnostics(null);
        return;
      }
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
      if (process.env.NODE_ENV === "development") {
        const totalCards = parsed.categoryOptions.reduce((n, c) => n + c.count, 0);
        console.debug("[flashcards-hub] inventory", {
          pathwayId: scopedPathwayId,
          topicRows: parsed.categoryOptions.length,
          perSystemCounts: parsed.categoryOptions.filter((c) => c.count > 0).length,
          sumCounts: totalCards,
          matchingCards: parsed.summary?.matchingCards ?? 0,
        });
      }
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
    selectedCanonicalIds,
    weakOnly,
    incorrectOnly,
    starredOnly,
    notStudiedOnly,
    apForQuery,
  ]);

  useEffect(() => {
    if (skipDuplicateInitialInventoryFetchRef.current) {
      skipDuplicateInitialInventoryFetchRef.current = false;
      return;
    }
    void refreshCategories();
  }, [refreshCategories]);

  const toggleCanonical = (id: CanonicalBodySystemId) => {
    const all = CANONICAL_STUDY_CATEGORIES.map((c) => c.id);
    if (selectedCanonicalIds.length === 0) {
      setSelectedCanonicalIds(all.filter((x) => x !== id));
      return;
    }
    if (selectedCanonicalIds.includes(id)) {
      const next = selectedCanonicalIds.filter((x) => x !== id);
      setSelectedCanonicalIds(next.length === 0 ? [] : next);
    } else {
      const next = [...selectedCanonicalIds, id];
      if (next.length >= all.length) setSelectedCanonicalIds([]);
      else setSelectedCanonicalIds(next);
    }
  };

  const sessionSummaryLine = [
    `${cardLimit} cards`,
    selectedCanonicalIds.length === 0 ? "all categories" : `${selectedCanonicalIds.length} categories`,
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
        selectedBuilderCategoryIds,
        allBuilderCategoryIds,
        weakOnly,
        incorrectOnly,
        starredOnly,
        notStudiedOnly,
        includeCards: true,
        alliedProfession: apForQuery || null,
      }),
    [
      scopedPathwayId,
      cardLimit,
      shuffleOn,
      selectedBuilderCategoryIds,
      allBuilderCategoryIds,
      weakOnly,
      incorrectOnly,
      starredOnly,
      notStudiedOnly,
      apForQuery,
    ],
  );

  const startHref = `/app/flashcards/custom?${startQuery}`;

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
    <LearnerStudyPageShell className="py-6" data-nn-e2e-flashcards-hub>
      {pathwayBootstrapSource === "secondary" ? <LearnerStudyLiveSyncBanner /> : null}

      {catHref ? (
        <div className="text-sm">
          <Link href={catHref} className="font-semibold text-primary underline underline-offset-2">
            Continue adaptive (CAT)
          </Link>
        </div>
      ) : null}

      <LearnerStudyHero
        eyebrow={pathwayDisplayName}
        title={t("learner.flashcards.hub.title")}
        subtitle={t("learner.flashcards.hub.subtitle")}
        stats={
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{sessionSummaryLine}</span>
            {" · "}
            <span>
              Cards group by the same canonical exam categories as practice questions — not raw lesson topic cards on this
              screen.
            </span>
          </p>
        }
      />

      <h1 className="sr-only">{t("learner.flashcards.hub.title")}</h1>
      {lessonVirtualDiagnostics ? (
        <div
          className="rounded-2xl border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground"
          data-nn-e2e-flashcards-lesson-diagnostics
        >
          <p className="font-semibold text-foreground">Lesson-linked inventory</p>
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
      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
        <Link href={resolvedLessonsHubHref} className="font-semibold text-primary underline underline-offset-2">
          Open lessons hub (same pathway)
        </Link>
        <span aria-hidden>·</span>
        <span>Pick one or more categories below — same grid language as practice questions.</span>
      </div>

      <LearnerFilterBar title="Deck filters">
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
          <span className="self-center text-xs text-muted-foreground">Custom mix</span>
        ) : null}
        </div>
      </LearnerFilterBar>

      {loadError ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {loadError}
        </div>
      ) : null}

      {!loadError &&
      matchingCards === 0 &&
      !starredOnly &&
      builderCategories.length > 0 &&
      (weakOnly || incorrectOnly || notStudiedOnly || starredOnly || selectedCanonicalIds.length > 0) ? (
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

      <section className="space-y-4" data-nn-e2e-flashcards-canonical-grid>
        <LearnerCategorySelector
          countsBySystem={countsByCanonical}
          selectedCanonicalIds={selectedCanonicalIds}
          onToggleCanonical={toggleCanonical}
          search={categorySearch}
          onSearchChange={setCategorySearch}
          heading={t("learner.flashcards.hub.bodySystemsHeading")}
          intro="Cards are grouped by canonical exam categories (same grid as practice questions). Builder rows are mapped automatically — you are not picking raw lesson topic cards here."
        />
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

      <LearnerSessionStartPanel
        primary={
          <div>
            <LearnerCtaLink href={startHref} data-nn-e2e-start-review>
              {t("flashcards.startSession")}
            </LearnerCtaLink>
            <p className="mt-1 text-xs text-muted-foreground">{sessionSummaryLine}</p>
          </div>
        }
        secondary={
          <Link href={weakAreaFlashcardsHref(scopedPathwayId)} className="text-xs font-medium text-primary underline">
            Weak areas
          </Link>
        }
      />
    </LearnerStudyPageShell>
  );
}
