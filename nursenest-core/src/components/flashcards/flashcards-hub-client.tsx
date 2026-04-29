"use client";

import React from "react";
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

export function FlashcardsHubClient({
  scopedPathwayId,
  pathwayDisplayName,
  pathwayBootstrapSource = "primary",
  catHref,
  initialHub,
}: {
  scopedPathwayId: string;
  pathwayDisplayName: string;
  pathwayBootstrapSource?: "primary" | "secondary";
  catHref?: string;
  initialHub?: FlashcardsHubServerPayload | null;
}) {
  const { t } = useMarketingI18n();

  const [builderCategories, setBuilderCategories] = useState<
    Array<{ id: string; title: string; description?: string; count: number }>
  >(() => initialHub?.categoryOptions ?? []);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [matchingCards, setMatchingCards] = useState<number | null>(() => initialHub?.matchingTotal ?? null);
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
    } catch {
      setLoadError("Could not load flashcard topics.");
      setBuilderCategories([]);
      setMatchingCards(null);
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
  ].join(" · ");

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
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-6" data-nn-e2e-flashcards-hub>
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

      {!loadError && matchingCards === 0 && !starredOnly && builderCategories.length === 0 ? (
        <div
          className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--theme-card-bg)] px-4 py-3 text-sm text-[var(--semantic-text-secondary)]"
          data-nn-e2e-flashcards-setup-report
        >
          <p className="font-medium text-[var(--semantic-text-primary)]">No flashcard deck loaded for this filter yet</p>
          <p className="mt-2">
            When the question bank has no published cards for this pathway, we still try to build study cards from
            your lesson checkpoints. Open the{" "}
            <Link href={`/app/lessons?pathwayId=${encodeURIComponent(scopedPathwayId)}`} className="font-semibold text-[var(--semantic-brand)] underline">
              lessons hub
            </Link>{" "}
            for this track, complete a lesson section, then return — or clear filters above and choose <strong>All cards</strong>.
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
        </div>

        <input
          type="search"
          placeholder="Search body systems…"
          value={categorySearch}
          onChange={(e) => setCategorySearch(e.target.value)}
          className="w-full rounded-lg border px-3 py-2 text-sm"
        />

        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCategories.map((c) => {
            const selected = selectedBodyIds.length === 0 || selectedBodyIds.includes(c.id);

            return (
              <button
                key={c.id}
                type="button"
                onClick={() => toggleBodySystem(c.id)}
                data-selected={selected}
                data-nn-e2e-body-system-card={c.id}
                className="rounded-lg border border-[var(--semantic-border-soft)] p-3 text-left transition-all hover:scale-[1.02] data-[selected=true]:ring-2 data-[selected=true]:ring-[color-mix(in_srgb,var(--semantic-info)_55%,transparent)]"
              >
                <div className="font-medium">{formatTitleCase(c.title)}</div>
                {c.count ? <div className="text-xs text-gray-400">{c.count} cards</div> : null}
              </button>
            );
          })}
        </div>
      </section>

      <section className="space-y-5 border-t pt-4">
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

        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted-foreground">Deck size:</span>
          {CARD_COUNTS.map((n) => (
            <button
              key={n}
              type="button"
              className={`rounded-full border px-3 py-1 ${cardLimit === n ? "border-primary bg-primary/10" : ""}`}
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
            <p className="mt-1 text-xs text-gray-500">{sessionSummaryLine}</p>
          </div>

          <Link href={weakAreaFlashcardsHref(scopedPathwayId)} className="text-xs text-primary underline">
            Weak areas
          </Link>
        </div>
      </div>
    </div>
  );
}
