"use client";

import React from "react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import {
  LearnerCategorySelector,
  LearnerFilterBar,
  LearnerStudyPageShell,
} from "@/components/learner-study-ui";
import {
  builderCategoryIdsForCanonicalSelection,
  getFlashcardCountsByBodySystem,
  type CanonicalBodySystemId,
} from "@/lib/learner-study-hub/body-system-data";
import { CANONICAL_STUDY_CATEGORIES } from "@/lib/study/normalize-study-category";
import {
  parseFlashcardCustomSessionResponse,
  parseFlashcardInventoryResponse,
} from "@/lib/flashcards/flashcard-custom-session-response";
import { reportFlashcardInventoryMalformedSuccessPayload } from "@/lib/flashcards/flashcard-inventory-parse-telemetry.server";
import { logDedupedClientDiagnostic } from "@/lib/runtime/client-diagnostic-log";
import {
  countSavedStudyItems,
  getStudyItemIdsMatchingFilters,
} from "@/lib/flashcards/study-session-persistence";
import { LearnerCtaLink } from "@/components/learner-ui/learner-cta-link";
import { weakAreaFlashcardsHref } from "@/lib/learner/weak-area-flashcards-href";
import { LearnerStudyLiveSyncBanner } from "@/components/student/learner-study-live-sync-banner";
import type { FlashcardLessonVirtualDiagnostics } from "@/lib/flashcards/flashcard-custom-session-response";
import type { FlashcardsHubServerPayload, FlashcardsPoolInventoryDiagnostics } from "@/lib/flashcards/flashcards-hub-types";
import { isAlliedMarketingCorePathwayId } from "@/lib/lessons/canonical-lessons-hubs";
import { buildAppPracticeTestsTopicHref } from "@/lib/learner/app-study-internal-links";
import { semanticFillClassForAccuracyPct } from "@/lib/ui/semantic-progress-fill";

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
  /** Catalog topic slug — forwarded as `topic` (alias for `topicCode` on custom-session). */
  hubTopicSlug?: string | null;
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
  const ts = args.hubTopicSlug?.trim().toLowerCase();
  if (ts) q.set("topic", ts);
  return q.toString();
}

export function FlashcardsHubClient({
  scopedPathwayId,
  pathwayDisplayName,
  flashcardsHeroEyebrow,
  flashcardsHeroTitle,
  flashcardsHeroSubtitle,
  pathwayBootstrapSource = "primary",
  catHref,
  initialHub,
  initialPoolDiagnostics = null,
  lessonsHubHref,
  alliedProfessionKey = null,
  hubTopicSlug = null,
  initialWeakOnly = false,
}: {
  scopedPathwayId: string;
  pathwayDisplayName: string;
  /** When set (RSC + catalog pathway), matches lessons hub: exam · country. */
  flashcardsHeroEyebrow?: string;
  /** Pathway-scoped H1 line; falls back to `learner.flashcards.hub.title`. */
  flashcardsHeroTitle?: string;
  /** Visible subtitle; falls back to `learner.flashcards.hub.subtitle`. */
  flashcardsHeroSubtitle?: string;
  pathwayBootstrapSource?: "primary" | "secondary";
  catHref?: string;
  initialHub?: FlashcardsHubServerPayload | null;
  /** Server inventory diagnostics (exam SQL vs Flashcard table). */
  initialPoolDiagnostics?: FlashcardsPoolInventoryDiagnostics | null;
  /** Same-pathway lessons hub — mirrors learner lessons IA for every tier/pathway. */
  lessonsHubHref?: string;
  /** Preserved on allied marketing → app handoffs (`?alliedProfession=`). */
  alliedProfessionKey?: string | null;
  /** Topic slug from `?topic=` — scoped flashcard/practice deep links for this pathway only. */
  hubTopicSlug?: string | null;
  /** From `?weakOnly=1` — aligns hub with clinical-scenario / weak-area deep links. */
  initialWeakOnly?: boolean;
}) {
  const { t } = useMarketingI18n();
  const heroEyebrow = flashcardsHeroEyebrow?.trim() || pathwayDisplayName;
  const heroTitle = flashcardsHeroTitle?.trim() || t("learner.flashcards.hub.title");
  const heroSubtitle = flashcardsHeroSubtitle?.trim() || t("learner.flashcards.hub.subtitle");
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
  const [poolDiagnostics, setPoolDiagnostics] = useState<FlashcardsPoolInventoryDiagnostics | null>(
    () => initialPoolDiagnostics ?? initialHub?.poolDiagnostics ?? null,
  );
  useEffect(() => {
    setPoolDiagnostics(initialPoolDiagnostics ?? initialHub?.poolDiagnostics ?? null);
  }, [initialPoolDiagnostics, initialHub?.poolDiagnostics]);
  const [selectedCanonicalIds, setSelectedCanonicalIds] = useState<string[]>([]);
  const [cardLimit, setCardLimit] = useState(20);
  const [shuffleOn, setShuffleOn] = useState(true);
  const [weakOnly, setWeakOnly] = useState(Boolean(initialWeakOnly));
  useEffect(() => {
    setWeakOnly(Boolean(initialWeakOnly));
  }, [initialWeakOnly]);
  const [incorrectOnly, setIncorrectOnly] = useState(false);
  const [starredOnly, setStarredOnly] = useState(false);
  const [notStudiedOnly, setNotStudiedOnly] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");

  const builderCategoriesRef = useRef(builderCategories);
  builderCategoriesRef.current = builderCategories;

  /**
   * Skip the first client `/api/flashcards/inventory` fetch only when RSC already shipped **per-row** counts.
   * A positive `matchingTotal` without bucket counts (exam hub / aggregation mismatch) must still refetch so
   * the hub does not stick on "0 items in pool" while advertising a non-zero pool.
   */
  const sumInitialCategoryCounts =
    initialHub?.categoryOptions?.reduce((s, c) => s + (typeof c.count === "number" && Number.isFinite(c.count) ? c.count : 0), 0) ??
    0;
  const skipDuplicateInitialInventoryFetchRef = useRef(Boolean(initialHub && sumInitialCategoryCounts > 0));

  const allBuilderCategoryIds = useMemo(() => builderCategories.map((c) => c.id), [builderCategories]);

  const countsByCanonical = useMemo(
    () => getFlashcardCountsByBodySystem(scopedPathwayId, builderCategories),
    [scopedPathwayId, builderCategories],
  );

  const sumCanonicalPool = useMemo(
    () => CANONICAL_STUDY_CATEGORIES.reduce((s, c) => s + (countsByCanonical[c.id] ?? 0), 0),
    [countsByCanonical],
  );

  /** Slim progress row — ratio of current match to full pathway pool (semantic bar, not a score). */
  const poolFillPct = useMemo(() => {
    if (matchingCards == null) return 0;
    if (matchingCards <= 0) return 0;
    if (sumCanonicalPool > 0) return Math.min(100, Math.round((matchingCards / sumCanonicalPool) * 100));
    return 100;
  }, [matchingCards, sumCanonicalPool]);

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
      const progressFiltersActive =
        weakOnly || incorrectOnly || notStudiedOnly || starredOnly;

      if (progressFiltersActive) {
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
          hubTopicSlug,
        });
        const res = await fetch(`/api/flashcards/custom-session?${qs}`, { credentials: "include" });
        let json: unknown;
        try {
          json = await res.json();
        } catch {
          if (builderCategoriesRef.current.length > 0) {
            logDedupedClientDiagnostic("flashcards_hub", "custom_session_json_kept_stale", scopedPathwayId, {
              pathwayId: scopedPathwayId,
            });
            setLoadError(null);
            return;
          }
          const base = "Flashcard inventory returned invalid JSON. Try again or contact support.";
          setLoadError(
            process.env.NODE_ENV === "development"
              ? `${base} (pathwayId=${scopedPathwayId}, url=/api/flashcards/custom-session)`
              : base,
          );
          setBuilderCategories([]);
          setMatchingCards(null);
          setLessonVirtualDiagnostics(null);
          setPoolDiagnostics(null);
          return;
        }
        const parsed = parseFlashcardCustomSessionResponse(res.ok, json);
        if (!parsed.ok) {
          if (builderCategoriesRef.current.length > 0) {
            logDedupedClientDiagnostic("flashcards_hub", "custom_session_parse_kept_stale", scopedPathwayId, {
              pathwayId: scopedPathwayId,
              httpStatus: res.status,
            });
            setLoadError(null);
            return;
          }
          const base = parsed.message.trim() ? parsed.message : "Could not load flashcard topics.";
          setLoadError(
            process.env.NODE_ENV === "development"
              ? `${base} (pathwayId=${scopedPathwayId}, httpStatus=${res.status})`
              : base,
          );
          setBuilderCategories([]);
          setMatchingCards(null);
          setPoolDiagnostics(null);
          return;
        }
        setBuilderCategories(parsed.categoryOptions);
        setMatchingCards(parsed.summary?.matchingCards ?? 0);
        setLessonVirtualDiagnostics(parsed.summary?.lessonVirtualDiagnostics ?? null);
        setPoolDiagnostics(parsed.summary?.poolInventoryDiagnostics ?? null);
        return;
      }

      const invUrl = `/api/flashcards/inventory?pathwayId=${encodeURIComponent(scopedPathwayId)}`;
      const res = await fetch(invUrl, { credentials: "include" });
      let json: unknown;
      try {
        json = await res.json();
      } catch {
        logDedupedClientDiagnostic("flashcards_hub", "inventory_json_parse_failed", scopedPathwayId, {
          pathwayId: scopedPathwayId,
          httpStatus: res.status,
        });
        if (builderCategoriesRef.current.length > 0) {
          logDedupedClientDiagnostic("flashcards_hub", "inventory_json_kept_stale", scopedPathwayId, {
            pathwayId: scopedPathwayId,
          });
          setLoadError(null);
          return;
        }
        const base = "Flashcard inventory returned invalid JSON. Try again or contact support.";
        setLoadError(
          process.env.NODE_ENV === "development"
            ? `${base} (pathwayId=${scopedPathwayId}, url=/api/flashcards/inventory)`
            : base,
        );
        setBuilderCategories([]);
        setMatchingCards(null);
        setPoolDiagnostics(null);
        return;
      }
      const parsed = parseFlashcardInventoryResponse(res.ok, json);
      if (!parsed.ok) {
        logDedupedClientDiagnostic("flashcards_hub", "inventory_parse_failed", `${scopedPathwayId}:${res.status}`, {
          pathwayId: scopedPathwayId,
          httpStatus: res.status,
          httpOk: res.ok,
        });
        if (builderCategoriesRef.current.length > 0) {
          logDedupedClientDiagnostic("flashcards_hub", "inventory_parse_kept_stale", scopedPathwayId, {
            pathwayId: scopedPathwayId,
            httpStatus: res.status,
          });
          setLoadError(null);
          return;
        }
        if (res.ok) {
          void reportFlashcardInventoryMalformedSuccessPayload({
            httpStatus: res.status,
            messageLen: parsed.message.trim().length,
            pathwayId: scopedPathwayId,
            reason: "parse_failed_after_2xx",
          });
        }
        const base = parsed.message.trim() ? parsed.message : "Could not load flashcard pool counts.";
        setLoadError(
          process.env.NODE_ENV === "development"
            ? `${base} (pathwayId=${scopedPathwayId}, httpStatus=${res.status})`
            : base,
        );
        setBuilderCategories([]);
        setMatchingCards(null);
        setPoolDiagnostics(null);
        return;
      }
      const opts = parsed.categoryOptions;
      setBuilderCategories(opts);
      const invSummary = parsed.summary;
      const invRoot = json as Record<string, unknown>;
      const totalFromBody =
        typeof invRoot.total === "number" && Number.isFinite(invRoot.total)
          ? Math.max(0, Math.floor(invRoot.total))
          : undefined;
      const totalFromSummary =
        invSummary != null &&
        typeof invSummary.matchingCards === "number" &&
        Number.isFinite(invSummary.matchingCards)
          ? invSummary.matchingCards
          : undefined;
      const total = totalFromSummary ?? totalFromBody;
      if (typeof total !== "number" || !Number.isFinite(total)) {
        if (builderCategoriesRef.current.length > 0) {
          logDedupedClientDiagnostic("flashcards_hub", "inventory_missing_total_kept_stale", scopedPathwayId, {
            pathwayId: scopedPathwayId,
          });
          setLoadError(null);
          return;
        }
        const base =
          process.env.NODE_ENV === "development"
            ? "Flashcards inventory response missing total count"
            : "Could not load flashcard pool counts.";
        setLoadError(
          process.env.NODE_ENV === "development"
            ? `${base} (pathwayId=${scopedPathwayId}, httpStatus=${res.status})`
            : base,
        );
        setBuilderCategories([]);
        setMatchingCards(null);
        setPoolDiagnostics(null);
        return;
      }
      const allCanon = CANONICAL_STUDY_CATEGORIES.length;
      const sel = selectedCanonicalIds;
      const match =
        sel.length === 0 || sel.length >= allCanon
          ? total
          : (() => {
              const ids = builderCategoryIdsForCanonicalSelection(
                scopedPathwayId,
                opts,
                new Set(sel as CanonicalBodySystemId[]),
              );
              const sum = ids.reduce((s, id) => s + (opts.find((c) => c.id === id)?.count ?? 0), 0);
              return sum > 0 ? sum : total;
            })();
      setMatchingCards(match);
      setPoolDiagnostics(invSummary?.poolInventoryDiagnostics ?? null);
      if (process.env.NODE_ENV === "development") {
        const totalCards = opts.reduce((n, c) => n + (typeof c.count === "number" ? c.count : 0), 0);
        console.debug("[flashcards-hub] inventory", {
          pathwayId: scopedPathwayId,
          topicRows: opts.length,
          perSystemCounts: opts.filter((c) => c.count > 0).length,
          sumCounts: totalCards,
          matchingCards: match,
        });
      }
    } catch {
      logDedupedClientDiagnostic("flashcards_hub", "inventory_network_error", scopedPathwayId, {
        pathwayId: scopedPathwayId,
      });
      if (builderCategoriesRef.current.length > 0) {
        logDedupedClientDiagnostic("flashcards_hub", "inventory_network_kept_stale", scopedPathwayId, {
          pathwayId: scopedPathwayId,
        });
        setLoadError(null);
        return;
      }
      const base = "Network error while loading flashcards. Check your connection and try again.";
      setLoadError(
        process.env.NODE_ENV === "development" ? `${base} (pathwayId=${scopedPathwayId})` : base,
      );
      setBuilderCategories([]);
      setMatchingCards(null);
      setLessonVirtualDiagnostics(null);
      setPoolDiagnostics(null);
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
    hubTopicSlug,
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
    selectedCanonicalIds.length === 0 ? "All systems" : `${selectedCanonicalIds.length} selected`,
    shuffleOn ? "Shuffled" : "In order",
  ].join(" · ");

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
        hubTopicSlug,
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
      hubTopicSlug,
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

  /** Single contextual hint below the fold — avoids stacked grey empty-state panels. */
  const hubContextualNotice = useMemo(() => {
    if (loadError) return null;
    if (
      matchingCards === 0 &&
      !starredOnly &&
      builderCategories.length > 0 &&
      (weakOnly || incorrectOnly || notStudiedOnly || selectedCanonicalIds.length > 0)
    ) {
      return (
        <div
          className="rounded-lg border border-[color-mix(in_srgb,var(--semantic-warning)_32%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_8%,var(--semantic-surface))] px-4 py-3 text-sm text-[var(--semantic-text-secondary)]"
          data-nn-e2e-flashcards-filter-empty
        >
          <p className="font-medium text-[var(--semantic-text-primary)]">No cards match this combination</p>
          <p className="mt-2">
            Choose <strong>All cards</strong>, clear extra system picks, or open the{" "}
            <Link href={resolvedLessonsHubHref} className="font-semibold text-[var(--semantic-brand)] underline">
              lessons hub
            </Link>
            .
          </p>
        </div>
      );
    }
    if (
      matchingCards === 0 &&
      sumCanonicalPool === 0 &&
      (lessonVirtualDiagnostics?.totalGeneratedVirtualCards ?? 0) === 0 &&
      !weakOnly &&
      !incorrectOnly &&
      !notStudiedOnly &&
      !starredOnly &&
      selectedCanonicalIds.length === 0 &&
      builderCategories.length > 0
    ) {
      return (
        <div
          className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-4 py-3 text-sm text-[var(--semantic-text-secondary)]"
          data-nn-e2e-flashcards-pathway-empty-seeded
        >
          <p className="font-medium text-[var(--semantic-text-primary)]">No flashcards are seeded for this pathway yet.</p>
          {process.env.NODE_ENV === "development" ? (
            <p className="mt-2 font-mono text-xs text-[var(--semantic-text-muted)]">pathwayId={scopedPathwayId}</p>
          ) : null}
        </div>
      );
    }
    if (
      matchingCards === 0 &&
      !starredOnly &&
      builderCategories.length === 0 &&
      (lessonVirtualDiagnostics?.catalogLessonCount ?? 0) === 0 &&
      !(lessonVirtualDiagnostics && lessonVirtualDiagnostics.totalGeneratedVirtualCards > 0)
    ) {
      return (
        <div
          className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-4 py-3 text-sm text-[var(--semantic-text-secondary)]"
          data-nn-e2e-flashcards-setup-report
        >
          <p className="font-medium text-[var(--semantic-text-primary)]">Deck not loaded yet</p>
          <p className="mt-2">
            Open the{" "}
            <Link href={resolvedLessonsHubHref} className="font-semibold text-[var(--semantic-brand)] underline">
              lessons hub
            </Link>{" "}
            for this track or choose <strong>All cards</strong>.
          </p>
        </div>
      );
    }
    if (
      matchingCards === 0 &&
      !starredOnly &&
      builderCategories.length === 0 &&
      (lessonVirtualDiagnostics?.catalogLessonCount ?? 0) > 0 &&
      (lessonVirtualDiagnostics?.totalGeneratedVirtualCards ?? 0) === 0
    ) {
      return (
        <div
          className="rounded-lg border border-[color-mix(in_srgb,var(--semantic-info)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_10%,var(--semantic-surface))] px-4 py-3 text-sm text-[var(--semantic-text-secondary)]"
          data-nn-e2e-flashcards-lessons-no-derived-cards
        >
          <p className="font-medium text-[var(--semantic-text-primary)]">Lesson-linked cards are still building</p>
          <p className="mt-2">
            Try <strong>All cards</strong>, refresh, or continue in the{" "}
            <Link href={resolvedLessonsHubHref} className="font-semibold text-[var(--semantic-brand)] underline">
              lessons hub
            </Link>
            .
          </p>
        </div>
      );
    }
    if (
      matchingCards === 0 &&
      !starredOnly &&
      builderCategories.length === 0 &&
      lessonVirtualDiagnostics &&
      lessonVirtualDiagnostics.totalGeneratedVirtualCards > 0
    ) {
      return (
        <div
          className="rounded-lg border border-[color-mix(in_srgb,var(--semantic-warning)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_8%,var(--semantic-surface))] px-4 py-3 text-sm text-[var(--semantic-text-secondary)]"
          data-nn-e2e-flashcards-inventory-mismatch
        >
          <p className="font-medium text-[var(--semantic-text-primary)]">Cards exist but categories need a refresh</p>
          <p className="mt-2">Clear filters and reload this page.</p>
        </div>
      );
    }
    if (!loadError && starredOnly && matchingCards === 0) {
      return (
        <div className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-4 py-3 text-sm text-[var(--semantic-text-secondary)]">
          No starred cards yet ({starredCount} saved in this browser).
        </div>
      );
    }
    return null;
  }, [
    loadError,
    matchingCards,
    starredOnly,
    builderCategories.length,
    weakOnly,
    incorrectOnly,
    notStudiedOnly,
    selectedCanonicalIds.length,
    sumCanonicalPool,
    lessonVirtualDiagnostics,
    scopedPathwayId,
    resolvedLessonsHubHref,
    starredCount,
  ]);

  const deckProgressFillClass = semanticFillClassForAccuracyPct(poolFillPct);

  return (
    <LearnerStudyPageShell
      className="nn-flashcards-hub-premium space-y-4 py-4 sm:space-y-5 sm:py-5"
      data-nn-e2e-flashcards-hub
    >
      {pathwayBootstrapSource === "secondary" ? <LearnerStudyLiveSyncBanner /> : null}

      <h1 className="sr-only">{heroTitle}</h1>

      <header
        className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-brand)_18%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-positive)_10%,var(--semantic-surface))] px-4 py-4 shadow-[var(--semantic-shadow-soft)] sm:px-5 sm:py-4"
        data-nn-e2e-flashcards-compact-header
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--semantic-text-secondary)]">
              {heroEyebrow}
            </p>
            <h2 className="mt-1 text-xl font-bold tracking-tight text-[var(--semantic-text-primary)] sm:text-2xl">
              {heroTitle}
            </h2>
            <p className="mt-1.5 max-w-prose text-pretty text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
              {heroSubtitle}
            </p>
          </div>
          <LearnerCtaLink
            href={startHref}
            data-nn-e2e-start-review
            className="inline-flex min-h-12 shrink-0 items-center justify-center px-6 py-3 text-base font-semibold shadow-[var(--semantic-shadow-soft)] ring-1 ring-[color-mix(in_srgb,var(--semantic-brand)_32%,transparent)] sm:min-h-11 sm:px-7"
          >
            {t("flashcards.startSession")}
          </LearnerCtaLink>
        </div>
      </header>

      {loadError ? (
        <div className="rounded-lg border border-[color-mix(in_srgb,var(--semantic-danger)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-danger)_08%,var(--semantic-surface))] px-3 py-2 text-sm text-[var(--semantic-danger)]">
          {loadError}
        </div>
      ) : null}

      <section
        className="relative overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--semantic-chart-2)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_12%,var(--semantic-surface))] p-4 shadow-[var(--semantic-shadow-soft)] sm:p-5"
        aria-labelledby="nn-flashcards-categories-heading"
        data-nn-e2e-flashcards-canonical-grid
      >
        <LearnerCategorySelector
          countsBySystem={countsByCanonical}
          selectedCanonicalIds={selectedCanonicalIds}
          onToggleCanonical={toggleCanonical}
          search={categorySearch}
          onSearchChange={setCategorySearch}
          heading={t("learner.flashcards.hub.bodySystemsHeading")}
          headingId="nn-flashcards-categories-heading"
          searchPlaceholder="Search systems…"
        />
      </section>

      {hubContextualNotice}

      <div
        className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 py-3 shadow-[var(--semantic-shadow-soft)] sm:px-5"
        data-nn-e2e-flashcards-deck-band
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex items-baseline justify-between gap-2 text-xs text-[var(--semantic-text-secondary)]">
              <span className="font-medium text-[var(--semantic-text-primary)]">Deck match</span>
              <span className="tabular-nums font-semibold text-[var(--semantic-text-primary)]">
                {matchingCards != null ? matchingCards : "—"}
                {sumCanonicalPool > 0 ? (
                  <span className="font-normal text-[var(--semantic-text-muted)]"> / {sumCanonicalPool}</span>
                ) : null}
              </span>
            </div>
            <div className="nn-progress-track-semantic nn-progress-track-semantic--md h-2 w-full overflow-hidden rounded-full bg-[var(--semantic-progress-track)]">
              <div
                className={`h-full rounded-full ${deckProgressFillClass} transition-[width] duration-300 ease-out`}
                style={{ width: `${poolFillPct}%` }}
              />
            </div>
            <p className="text-[11px] leading-snug text-[var(--semantic-text-muted)]">{sessionSummaryLine}</p>
          </div>
        </div>
      </div>

      <details
        className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-3 py-2 sm:px-4"
        data-nn-e2e-flashcards-secondary
      >
        <summary className="cursor-pointer text-sm font-semibold text-[var(--semantic-text-primary)]">
          Filters, weak areas &amp; more{" "}
          <span className="font-normal text-[var(--semantic-text-muted)]">(optional)</span>
        </summary>
        <div className="mt-4 space-y-5 border-t border-[var(--semantic-border-soft)] pt-4">
          <LearnerFilterBar
            title="Quick presets"
            className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-3 shadow-none sm:p-4"
          >
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
                    className={`min-h-11 rounded-full border px-3 py-2 text-sm font-semibold transition sm:min-h-0 sm:py-1.5 sm:text-xs ${
                      on
                        ? "border-[color-mix(in_srgb,var(--semantic-info)_45%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_14%,var(--semantic-surface))] text-[var(--semantic-text-primary)]"
                        : "border-[var(--semantic-border-soft)] text-[var(--semantic-text-secondary)] hover:bg-[color-mix(in_srgb,var(--semantic-panel-cool)_22%,var(--semantic-surface))]"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
              {activePreset === "custom" ? (
                <span className="self-center text-xs text-[var(--semantic-text-muted)]">Custom mix</span>
              ) : null}
            </div>
          </LearnerFilterBar>

          <div className="space-y-3">
            <p className="text-xs font-medium text-[var(--semantic-text-secondary)]">Fine-tune (same as API)</p>
            <label className="flex items-center gap-2 text-sm text-[var(--semantic-text-primary)]">
              <input type="checkbox" checked={weakOnly} onChange={(e) => setWeakOnly(e.target.checked)} />
              Weak areas only
            </label>
            <label className="flex items-center gap-2 text-sm text-[var(--semantic-text-primary)]">
              <input type="checkbox" checked={incorrectOnly} onChange={(e) => setIncorrectOnly(e.target.checked)} />
              Previously incorrect
            </label>
            <label className="flex items-center gap-2 text-sm text-[var(--semantic-text-primary)]">
              <input type="checkbox" checked={notStudiedOnly} onChange={(e) => setNotStudiedOnly(e.target.checked)} />
              Not studied
            </label>
            <label className="flex items-center gap-2 text-sm text-[var(--semantic-text-primary)]">
              <input type="checkbox" checked={starredOnly} onChange={(e) => setStarredOnly(e.target.checked)} />
              Starred only
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-[var(--semantic-text-secondary)]">Deck size:</span>
            {CARD_COUNTS.map((n) => (
              <button
                key={n}
                type="button"
                className={`min-h-11 rounded-full border border-[var(--semantic-border-soft)] px-3 py-2 text-sm font-medium sm:min-h-0 sm:py-1 ${
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

          <label className="flex items-center gap-2 text-sm text-[var(--semantic-text-primary)]">
            <input type="checkbox" checked={shuffleOn} onChange={(e) => setShuffleOn(e.target.checked)} />
            Shuffle order
          </label>

          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
            <Link
              href={weakAreaFlashcardsHref(scopedPathwayId)}
              className="font-semibold text-[var(--semantic-brand)] underline underline-offset-2"
            >
              Weak areas hub
            </Link>
            <Link
              href={resolvedLessonsHubHref}
              className="font-semibold text-[color-mix(in_srgb,var(--semantic-chart-2)_85%,var(--semantic-text-primary))] underline underline-offset-2"
            >
              Lessons (same pathway)
            </Link>
            {catHref ? (
              <Link href={catHref} className="font-semibold text-[var(--semantic-info)] underline underline-offset-2">
                Adaptive CAT
              </Link>
            ) : null}
            {hubTopicSlug?.trim() ? (
              <Link
                href={buildAppPracticeTestsTopicHref(scopedPathwayId, hubTopicSlug)}
                className="font-semibold text-[color-mix(in_srgb,var(--semantic-chart-3)_88%,var(--semantic-text-primary))] underline underline-offset-2"
                data-testid="flashcards-hub-link-practice-tests-topic"
                data-nn-pathway-id={scopedPathwayId}
              >
                {t("learner.studyLoop.practiceQuestionsThisTopic")}
              </Link>
            ) : null}
          </div>

          {process.env.NODE_ENV === "development" && lessonVirtualDiagnostics ? (
            <div
              className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-3 py-2 text-xs text-[var(--semantic-text-secondary)]"
              data-nn-e2e-flashcards-lesson-diagnostics
            >
              <p className="font-semibold text-[var(--semantic-text-primary)]">Lesson-linked inventory (dev)</p>
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
          {process.env.NODE_ENV === "development" && poolDiagnostics ? (
            <div
              className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-3 py-2 text-xs text-[var(--semantic-text-secondary)]"
              data-nn-e2e-flashcards-pool-diagnostics
            >
              <p className="font-semibold text-[var(--semantic-text-primary)]">Pool diagnostics (dev)</p>
              <ul className="mt-1 list-disc space-y-0.5 pl-4 font-mono leading-relaxed">
                <li>pathwayId: {poolDiagnostics.pathwayId}</li>
                <li>exam_question SQL pool: {poolDiagnostics.examQuestionSqlPoolCount}</li>
                <li>dedicated Flashcard rows (deck pathway): {poolDiagnostics.dedicatedFlashcardRowCount}</li>
                <li>tier / country scope: {poolDiagnostics.tier ?? "—"} / {poolDiagnostics.country ?? "—"}</li>
                <li>pool source: {poolDiagnostics.poolSource}</li>
                {poolDiagnostics.legacyCanonicalPrismaPoolCount != null ? (
                  <li>legacy Prisma exam IN() count: {poolDiagnostics.legacyCanonicalPrismaPoolCount}</li>
                ) : null}
                {poolDiagnostics.zeroHint ? (
                  <li className="text-[var(--semantic-warning)]">{poolDiagnostics.zeroHint}</li>
                ) : null}
              </ul>
            </div>
          ) : null}
        </div>
      </details>
    </LearnerStudyPageShell>
  );
}
