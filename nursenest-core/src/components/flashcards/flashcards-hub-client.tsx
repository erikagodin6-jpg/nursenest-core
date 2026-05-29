"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Shuffle } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import {
  LearnerCategorySelector,
  LearnerFilterBar,
  SharedStudySetupLayout,
  SharedStudySetupSurface,
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
import { logDedupedClientDiagnostic } from "@/lib/runtime/client-diagnostic-log";
import {
  countSavedStudyItems,
  getStudyItemIdsMatchingFilters,
} from "@/lib/flashcards/study-session-persistence";
import { LeafWatermark } from "@/components/brand/leaf-watermark";
import { LearnerCtaLink } from "@/components/learner-ui/learner-cta-link";
import { weakAreaFlashcardsHref } from "@/lib/learner/weak-area-flashcards-href";
import { LearnerStudyLiveSyncBanner } from "@/components/student/learner-study-live-sync-banner";
import type { FlashcardLessonVirtualDiagnostics } from "@/lib/flashcards/flashcard-custom-session-response";
import type {
  FlashcardsHubServerPayload,
  FlashcardsPoolInventoryDiagnostics,
} from "@/lib/flashcards/flashcards-hub-types";
import { isAlliedMarketingCorePathwayId } from "@/lib/lessons/canonical-lessons-hubs";
import { buildAppPracticeTestsTopicHref } from "@/lib/learner/app-study-internal-links";
import { semanticFillClassForAccuracyPct } from "@/lib/ui/semantic-progress-fill";
import { FlashcardsHubAnalytics } from "@/components/flashcards/flashcards-hub-analytics";
import { FlashcardsHubReadinessStrip } from "@/components/flashcards/flashcards-hub-readiness-strip";
import FlashcardErrorBoundary from "@/components/flashcards/flashcard-error-boundary";
import {
  FLASHCARD_SESSION_PRESETS,
  cardLimitQueryValue,
  effectiveSessionCardCount,
  readFlashcardsCustomSessionCheckpoint,
  readFlashcardsHubPreferences,
  resumeCustomSessionHref,
  writeFlashcardsHubPreferences,
  type FlashcardsHubCardLimit,
  type FlashcardsHubPreferencesV1,
} from "@/lib/flashcards/flashcards-hub-preferences";
import { buildFlashcardsCategorySignals } from "@/lib/flashcards/flashcards-hub-category-signals";
import { buildFlashcardsSessionPreview } from "@/lib/flashcards/flashcards-hub-session-copy";
import {
  parseHubMode,
  parseHubSystemsFromSearchParams,
} from "@/lib/flashcards/flashcards-hub-url";
import type { TopicPerformanceSnapshot } from "@/lib/learner/topic-performance";
import { useHubPrefetch } from "@/lib/learner/use-hub-prefetch";

function buildCustomSessionQuery(args: {
  pathwayId: string;
  cardLimit: FlashcardsHubCardLimit;
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
  q.set("cardLimit", cardLimitQueryValue(args.cardLimit));
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
    const starredIds = getStudyItemIdsMatchingFilters(
      { starredOnly: true },
      500,
    );
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
  const searchParams = useSearchParams();
  const prefsHydratedRef = useRef(false);
  const heroEyebrow = flashcardsHeroEyebrow?.trim() || pathwayDisplayName;

  // Prefetch likely next destinations during idle time (Phase 6 — hub prefetch).
  useHubPrefetch({
    pathwayId: scopedPathwayId,
    prefetch: ["practice", "cat", "loft", "lessons", "clinical-skills", "pharmacology", "ecg", "analytics", "readiness"],
  });
  const heroTitle =
    flashcardsHeroTitle?.trim() || t("learner.flashcards.hub.title");
  const heroSubtitle =
    flashcardsHeroSubtitle?.trim() || t("learner.flashcards.hub.subtitle");
  const apForQuery =
    alliedProfessionKey?.trim() &&
    isAlliedMarketingCorePathwayId(scopedPathwayId)
      ? alliedProfessionKey.trim().toLowerCase()
      : "";
  const resolvedLessonsHubHref = (() => {
    const base =
      lessonsHubHref?.trim() ||
      `/app/lessons?pathwayId=${encodeURIComponent(scopedPathwayId)}`;
    if (!apForQuery) return base;
    const join = base.includes("?") ? "&" : "?";
    return `${base}${join}alliedProfession=${encodeURIComponent(apForQuery)}`;
  })();

  const [builderCategories, setBuilderCategories] = useState<
    Array<{ id: string; title: string; description?: string; count: number }>
  >(() => initialHub?.categoryOptions ?? []);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [matchingCards, setMatchingCards] = useState<number | null>(
    () => initialHub?.matchingTotal ?? null,
  );
  const [lessonVirtualDiagnostics, setLessonVirtualDiagnostics] =
    useState<FlashcardLessonVirtualDiagnostics | null>(
      () => initialHub?.lessonVirtualDiagnostics ?? null,
    );
  const [poolDiagnostics, setPoolDiagnostics] =
    useState<FlashcardsPoolInventoryDiagnostics | null>(
      () => initialPoolDiagnostics ?? initialHub?.poolDiagnostics ?? null,
    );
  useEffect(() => {
    setPoolDiagnostics(
      initialPoolDiagnostics ?? initialHub?.poolDiagnostics ?? null,
    );
  }, [initialPoolDiagnostics, initialHub?.poolDiagnostics]);
  const [selectedCanonicalIds, setSelectedCanonicalIds] = useState<string[]>(
    [],
  );
  const [cardLimit, setCardLimit] = useState<FlashcardsHubCardLimit>(20);
  const [customLimitInput, setCustomLimitInput] = useState("");
  const [shuffleOn, setShuffleOn] = useState(true);
  const [weakOnly, setWeakOnly] = useState(Boolean(initialWeakOnly));
  useEffect(() => {
    setWeakOnly(Boolean(initialWeakOnly));
  }, [initialWeakOnly]);
  const [incorrectOnly, setIncorrectOnly] = useState(false);
  const [starredOnly, setStarredOnly] = useState(false);
  const [notStudiedOnly, setNotStudiedOnly] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const [weakTopics, setWeakTopics] = useState<TopicPerformanceSnapshot | null>(
    null,
  );
  const [resumeCk, setResumeCk] = useState(() =>
    typeof window !== "undefined"
      ? readFlashcardsCustomSessionCheckpoint(scopedPathwayId)
      : null,
  );

  useEffect(() => {
    setResumeCk(readFlashcardsCustomSessionCheckpoint(scopedPathwayId));
  }, [scopedPathwayId, cardLimit, selectedCanonicalIds, shuffleOn, weakOnly]);

  useEffect(() => {
    let cancelled = false;
    const delayMs = weakOnly ? 0 : 2_000;
    const timer = window.setTimeout(() => {
      void fetch("/api/learner/weak-areas", {
        credentials: "include",
        cache: "no-store",
      })
        .then((r) => (r.ok ? r.json() : null))
        .then((j) => {
          if (!cancelled && j && typeof j === "object")
            setWeakTopics(j as TopicPerformanceSnapshot);
        })
        .catch(() => {});
    }, delayMs);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [scopedPathwayId, weakOnly]);

  const effectiveCardCount = useMemo(
    () => effectiveSessionCardCount(cardLimit, matchingCards),
    [cardLimit, matchingCards],
  );

  const isCustomCardLimit = useMemo(
    () =>
      cardLimit !== "all" &&
      !(FLASHCARD_SESSION_PRESETS as readonly number[]).includes(
        cardLimit as number,
      ),
    [cardLimit],
  );

  useEffect(() => {
    if (prefsHydratedRef.current) return;
    prefsHydratedRef.current = true;
    const sp = new URLSearchParams(searchParams.toString());
    const prefs = readFlashcardsHubPreferences(scopedPathwayId);

    const urlSystems = parseHubSystemsFromSearchParams(sp);
    if (urlSystems.length > 0) {
      const valid = urlSystems.filter((id) =>
        CANONICAL_STUDY_CATEGORIES.some((c) => c.id === id),
      );
      if (valid.length > 0) setSelectedCanonicalIds(valid);
    } else if (prefs.selectedCanonicalIds.length > 0) {
      setSelectedCanonicalIds([...prefs.selectedCanonicalIds]);
    }

    const urlLimit = sp.get("cardLimit")?.trim();
    if (urlLimit === "all") {
      setCardLimit("all");
    } else if (urlLimit) {
      const n = Number(urlLimit);
      if (Number.isFinite(n) && n >= 10) {
        const clamped = Math.min(500, Math.floor(n));
        setCardLimit(clamped);
        if (
          !(FLASHCARD_SESSION_PRESETS as readonly number[]).includes(clamped)
        ) {
          setCustomLimitInput(String(clamped));
        }
      }
    } else {
      setCardLimit(prefs.cardLimit);
      if (prefs.customCardLimit != null)
        setCustomLimitInput(String(prefs.customCardLimit));
    }

    const hubMode = parseHubMode(sp);
    if (hubMode === "weak") {
      setWeakOnly(true);
      setIncorrectOnly(false);
      setStarredOnly(false);
      setNotStudiedOnly(false);
    } else if (hubMode === "incorrect") {
      setWeakOnly(false);
      setIncorrectOnly(true);
      setStarredOnly(false);
      setNotStudiedOnly(false);
    } else if (hubMode === "starred") {
      setWeakOnly(false);
      setIncorrectOnly(false);
      setStarredOnly(true);
      setNotStudiedOnly(false);
    } else if (hubMode === "unstudied") {
      setWeakOnly(false);
      setIncorrectOnly(false);
      setStarredOnly(false);
      setNotStudiedOnly(true);
    } else if (!initialWeakOnly) {
      setWeakOnly(prefs.weakOnly);
      setIncorrectOnly(prefs.incorrectOnly);
      setStarredOnly(prefs.starredOnly);
      setNotStudiedOnly(prefs.notStudiedOnly);
    }

    const urlShuffle = sp.get("shuffle");
    if (urlShuffle === "0" || urlShuffle === "1") {
      setShuffleOn(urlShuffle === "1");
    } else {
      setShuffleOn(prefs.shuffleOn);
    }
  }, [scopedPathwayId, searchParams, initialWeakOnly]);

  useEffect(() => {
    if (!prefsHydratedRef.current) return;
    const custom =
      isCustomCardLimit && customLimitInput.trim()
        ? Math.min(500, Math.max(10, Math.floor(Number(customLimitInput))))
        : null;
    const next: FlashcardsHubPreferencesV1 = {
      v: 1,
      cardLimit,
      customCardLimit: Number.isFinite(custom as number)
        ? (custom as number)
        : null,
      shuffleOn,
      selectedCanonicalIds:
        selectedCanonicalIds as FlashcardsHubPreferencesV1["selectedCanonicalIds"],
      weakOnly,
      incorrectOnly,
      starredOnly,
      notStudiedOnly,
    };
    writeFlashcardsHubPreferences(scopedPathwayId, next);
  }, [
    scopedPathwayId,
    cardLimit,
    customLimitInput,
    isCustomCardLimit,
    shuffleOn,
    selectedCanonicalIds,
    weakOnly,
    incorrectOnly,
    starredOnly,
    notStudiedOnly,
  ]);

  const builderCategoriesRef = useRef(builderCategories);
  builderCategoriesRef.current = builderCategories;

  /**
   * Skip the first client `/api/flashcards/inventory` fetch only when RSC already shipped **per-row** counts.
   * A positive `matchingTotal` without bucket counts (exam hub / aggregation mismatch) must still refetch so
   * the hub does not stick on "0 items in pool" while advertising a non-zero pool.
   */
  const sumInitialCategoryCounts =
    initialHub?.categoryOptions?.reduce(
      (s, c) =>
        s +
        (typeof c.count === "number" && Number.isFinite(c.count) ? c.count : 0),
      0,
    ) ?? 0;
  const skipDuplicateInitialInventoryFetchRef = useRef(
    Boolean(initialHub && sumInitialCategoryCounts > 0),
  );

  const allBuilderCategoryIds = useMemo(
    () => builderCategories.map((c) => c.id),
    [builderCategories],
  );

  const countsByCanonical = useMemo(
    () => getFlashcardCountsByBodySystem(scopedPathwayId, builderCategories),
    [scopedPathwayId, builderCategories],
  );

  const sumCanonicalPool = useMemo(
    () =>
      CANONICAL_STUDY_CATEGORIES.reduce(
        (s, c) => s + (countsByCanonical[c.id] ?? 0),
        0,
      ),
    [countsByCanonical],
  );

  const categorySignals = useMemo(
    () =>
      buildFlashcardsCategorySignals({
        countsBySystem: countsByCanonical,
        weakTopics,
      }),
    [countsByCanonical, weakTopics],
  );

  /** Slim progress row — ratio of current match to full pathway pool (semantic bar, not a score). */
  const poolFillPct = useMemo(() => {
    if (matchingCards == null) return 0;
    if (matchingCards <= 0) return 0;
    if (sumCanonicalPool > 0)
      return Math.min(
        100,
        Math.round((matchingCards / sumCanonicalPool) * 100),
      );
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

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 25_000);

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
        const res = await fetch(`/api/flashcards/custom-session?${qs}`, {
          credentials: "include",
          cache: "no-store",
          signal: controller.signal,
        });
        let json: unknown;
        try {
          json = await res.json();
        } catch {
          if (builderCategoriesRef.current.length > 0) {
            logDedupedClientDiagnostic(
              "flashcards_hub",
              "custom_session_json_kept_stale",
              scopedPathwayId,
              {
                pathwayId: scopedPathwayId,
              },
            );
            setLoadError(null);
            return;
          }
          const base =
            "Flashcard inventory returned invalid JSON. Try again or contact support.";
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
            logDedupedClientDiagnostic(
              "flashcards_hub",
              "custom_session_parse_kept_stale",
              scopedPathwayId,
              {
                pathwayId: scopedPathwayId,
                httpStatus: res.status,
              },
            );
            setLoadError(null);
            return;
          }
          const base = parsed.message.trim()
            ? parsed.message
            : "Could not load flashcard topics.";
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
        setLessonVirtualDiagnostics(
          parsed.summary?.lessonVirtualDiagnostics ?? null,
        );
        setPoolDiagnostics(parsed.summary?.poolInventoryDiagnostics ?? null);
        return;
      }

      const invUrl = `/api/flashcards/inventory?pathwayId=${encodeURIComponent(scopedPathwayId)}`;
      const res = await fetch(invUrl, {
        credentials: "include",
        cache: "no-store",
        signal: controller.signal,
      });
      let json: unknown;
      try {
        json = await res.json();
      } catch {
        logDedupedClientDiagnostic(
          "flashcards_hub",
          "inventory_json_parse_failed",
          scopedPathwayId,
          {
            pathwayId: scopedPathwayId,
            httpStatus: res.status,
          },
        );
        if (builderCategoriesRef.current.length > 0) {
          logDedupedClientDiagnostic(
            "flashcards_hub",
            "inventory_json_kept_stale",
            scopedPathwayId,
            {
              pathwayId: scopedPathwayId,
            },
          );
          setLoadError(null);
          return;
        }
        const base =
          "Flashcard inventory returned invalid JSON. Try again or contact support.";
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
        logDedupedClientDiagnostic(
          "flashcards_hub",
          "inventory_parse_failed",
          `${scopedPathwayId}:${res.status}`,
          {
            pathwayId: scopedPathwayId,
            httpStatus: res.status,
            httpOk: res.ok,
          },
        );
        if (builderCategoriesRef.current.length > 0) {
          logDedupedClientDiagnostic(
            "flashcards_hub",
            "inventory_parse_kept_stale",
            scopedPathwayId,
            {
              pathwayId: scopedPathwayId,
              httpStatus: res.status,
            },
          );
          setLoadError(null);
          return;
        }
        if (res.ok) {
          logDedupedClientDiagnostic(
            "flashcards_hub",
            "inventory_malformed_success_payload",
            scopedPathwayId,
            {
              pathwayId: scopedPathwayId,
              httpStatus: res.status,
              messageLen: parsed.message.trim().length,
            },
          );
        }
        const base = parsed.message.trim()
          ? parsed.message
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
          logDedupedClientDiagnostic(
            "flashcards_hub",
            "inventory_missing_total_kept_stale",
            scopedPathwayId,
            {
              pathwayId: scopedPathwayId,
            },
          );
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
              const sum = ids.reduce(
                (s, id) => s + (opts.find((c) => c.id === id)?.count ?? 0),
                0,
              );
              return sum > 0 ? sum : total;
            })();
      setMatchingCards(match);
      setPoolDiagnostics(invSummary?.poolInventoryDiagnostics ?? null);
      if (process.env.NODE_ENV === "development") {
        const totalCards = opts.reduce(
          (n, c) => n + (typeof c.count === "number" ? c.count : 0),
          0,
        );
        console.debug("[flashcards-hub] inventory", {
          pathwayId: scopedPathwayId,
          topicRows: opts.length,
          perSystemCounts: opts.filter((c) => c.count > 0).length,
          sumCounts: totalCards,
          matchingCards: match,
        });
      }
    } catch (e) {
      const aborted = e instanceof DOMException && e.name === "AbortError";
      logDedupedClientDiagnostic(
        "flashcards_hub",
        "inventory_network_error",
        scopedPathwayId,
        {
          pathwayId: scopedPathwayId,
          errorName: aborted
            ? "TimeoutError"
            : e instanceof Error
              ? e.name
              : typeof e,
        },
      );
      if (builderCategoriesRef.current.length > 0) {
        logDedupedClientDiagnostic(
          "flashcards_hub",
          "inventory_network_kept_stale",
          scopedPathwayId,
          {
            pathwayId: scopedPathwayId,
          },
        );
        setLoadError(null);
        return;
      }
      const base = aborted
        ? "Flashcards took too long to load. Check your connection and try again."
        : "Network error while loading flashcards. Check your connection and try again.";
      setLoadError(
        process.env.NODE_ENV === "development"
          ? `${base} (pathwayId=${scopedPathwayId})`
          : base,
      );
      setBuilderCategories([]);
      setMatchingCards(null);
      setLessonVirtualDiagnostics(null);
      setPoolDiagnostics(null);
    } finally {
      window.clearTimeout(timeout);
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

  const { preview: sessionPreviewCopy, ctaSubline } = useMemo(
    () =>
      buildFlashcardsSessionPreview({
        effectiveCount: effectiveCardCount,
        cardLimit,
        selectedCanonicalIds,
        shuffleOn,
        weakOnly,
        notStudiedOnly,
        incorrectOnly,
      }),
    [
      effectiveCardCount,
      cardLimit,
      selectedCanonicalIds,
      shuffleOn,
      weakOnly,
      notStudiedOnly,
      incorrectOnly,
    ],
  );

  const resumeHref = resumeCk ? resumeCustomSessionHref(resumeCk) : null;
  const resumeProgressPct =
    resumeCk && resumeCk.totalCards > 0
      ? Math.min(100, Math.round((resumeCk.index / resumeCk.totalCards) * 100))
      : 0;
  const resumeCardsRemaining =
    resumeCk && resumeCk.totalCards > 0
      ? Math.max(1, resumeCk.totalCards - resumeCk.index)
      : 0;

  const quickReviewQuery = useMemo(
    () =>
      buildCustomSessionQuery({
        pathwayId: scopedPathwayId,
        cardLimit: 10,
        shuffleOn: true,
        selectedBuilderCategoryIds: [],
        allBuilderCategoryIds,
        weakOnly: false,
        incorrectOnly: false,
        starredOnly: false,
        notStudiedOnly: false,
        includeCards: true,
        alliedProfession: apForQuery || null,
        hubTopicSlug,
      }),
    [scopedPathwayId, allBuilderCategoryIds, apForQuery, hubTopicSlug],
  );

  const quickReviewHref = `/app/flashcards/custom?${quickReviewQuery}`;

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

  const activePreset = useMemo(():
    | "all"
    | "weak"
    | "incorrect"
    | "starred"
    | "unseen"
    | "custom" => {
    if (starredOnly && !weakOnly && !incorrectOnly && !notStudiedOnly)
      return "starred";
    if (notStudiedOnly && !weakOnly && !incorrectOnly && !starredOnly)
      return "unseen";
    if (incorrectOnly && !weakOnly && !starredOnly && !notStudiedOnly)
      return "incorrect";
    if (weakOnly && !incorrectOnly && !starredOnly && !notStudiedOnly)
      return "weak";
    if (!weakOnly && !incorrectOnly && !starredOnly && !notStudiedOnly)
      return "all";
    return "custom";
  }, [weakOnly, incorrectOnly, starredOnly, notStudiedOnly]);

  const applyFilterPreset = (
    p: "all" | "weak" | "incorrect" | "starred" | "unseen",
  ) => {
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
      (weakOnly ||
        incorrectOnly ||
        notStudiedOnly ||
        selectedCanonicalIds.length > 0)
    ) {
      return (
        <div
          className="rounded-lg border border-[color-mix(in_srgb,var(--semantic-warning)_32%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_8%,var(--semantic-surface))] px-4 py-3 text-sm text-[var(--semantic-text-secondary)]"
          data-nn-e2e-flashcards-filter-empty
        >
          <p className="font-medium text-[var(--semantic-text-primary)]">
            No cards match this combination
          </p>
          <p className="mt-2">
            Choose <strong>All cards</strong>, clear extra system picks, or open
            the{" "}
            <Link
              href={resolvedLessonsHubHref}
              className="font-semibold text-[var(--semantic-brand)] underline"
            >
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
          <p className="font-medium text-[var(--semantic-text-primary)]">
            No flashcards are seeded for this pathway yet.
          </p>
          {process.env.NODE_ENV === "development" ? (
            <p className="mt-2 font-mono text-xs text-[var(--semantic-text-muted)]">
              pathwayId={scopedPathwayId}
            </p>
          ) : null}
        </div>
      );
    }
    if (
      matchingCards === 0 &&
      !starredOnly &&
      builderCategories.length === 0 &&
      (lessonVirtualDiagnostics?.catalogLessonCount ?? 0) === 0 &&
      !(
        lessonVirtualDiagnostics &&
        lessonVirtualDiagnostics.totalGeneratedVirtualCards > 0
      )
    ) {
      return (
        <div
          className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-4 py-3 text-sm text-[var(--semantic-text-secondary)]"
          data-nn-e2e-flashcards-setup-report
        >
          <p className="font-medium text-[var(--semantic-text-primary)]">
            Deck not loaded yet
          </p>
          <p className="mt-2">
            Open the{" "}
            <Link
              href={resolvedLessonsHubHref}
              className="font-semibold text-[var(--semantic-brand)] underline"
            >
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
          <p className="font-medium text-[var(--semantic-text-primary)]">
            Lesson-linked cards are still building
          </p>
          <p className="mt-2">
            Try <strong>All cards</strong>, refresh, or continue in the{" "}
            <Link
              href={resolvedLessonsHubHref}
              className="font-semibold text-[var(--semantic-brand)] underline"
            >
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
          <p className="font-medium text-[var(--semantic-text-primary)]">
            Cards exist but categories need a refresh
          </p>
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
    <SharedStudySetupLayout
      mode="flashcards"
      className="nn-flashcards-hub-premium space-y-5 py-2 pb-24 sm:space-y-6 sm:py-3 md:pb-6"
      data-nn-premium-flashcard-convergence
      data-nn-flashcard-branding-revamp=""
      data-nn-premium-full-platform-convergence=""
      data-nn-premium-platform-family="exam-study"
      data-nn-premium-platform-module="flashcards"
      data-nn-e2e-flashcards-hub
    >
      {pathwayBootstrapSource === "secondary" ? (
        <LearnerStudyLiveSyncBanner />
      ) : null}

      <h1 className="sr-only">{heroTitle}</h1>

      <header
        className="nn-flashcards-hub-workspace nn-flashcards-hub-hero relative overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--semantic-brand)_18%,var(--semantic-border-soft))] bg-[linear-gradient(160deg,color-mix(in_srgb,var(--semantic-panel-positive)_14%,var(--semantic-surface))_0%,var(--semantic-surface)_48%,color-mix(in_srgb,var(--semantic-panel-cool)_10%,var(--semantic-surface))_100%)] px-5 py-6 sm:px-8 sm:py-8"
        data-nn-e2e-flashcards-compact-header
      >
        <div
          className="pointer-events-none absolute -right-24 -top-28 h-64 w-64 rounded-full bg-[color-mix(in_srgb,var(--semantic-chart-1)_12%,transparent)] blur-3xl"
          aria-hidden
        />
        <LeafWatermark
          className="-right-8 -top-6 opacity-[0.11] sm:-right-12 sm:-top-10"
          imageClassName="opacity-90"
          size={200}
        />
        <div className="relative space-y-6 sm:space-y-7">
          <div className="space-y-4">
            <div className="max-w-3xl">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[color-mix(in_srgb,var(--semantic-chart-3)_85%,var(--semantic-text-secondary))]">
                {heroEyebrow}
              </p>
              <h2 className="mt-1.5 text-2xl font-extrabold tracking-tight text-[var(--semantic-text-primary)] sm:text-[1.85rem]">
                {heroTitle}
              </h2>
              <p className="mt-2 max-w-prose text-pretty text-sm leading-relaxed text-[var(--semantic-text-secondary)] sm:text-[0.9375rem]">
                {heroSubtitle}
              </p>
            </div>
            <FlashcardsHubReadinessStrip pathwayId={scopedPathwayId} />
          </div>

          {resumeHref && resumeCk ? (
            <div
              className="nn-flashcards-resume-spotlight flex flex-col gap-4 border-t border-[color-mix(in_srgb,var(--semantic-info)_22%,var(--semantic-border-soft))] pt-5 sm:flex-row sm:items-center sm:justify-between"
              data-nn-e2e-flashcards-resume
            >
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--semantic-info)]">
                  {t("learner.flashcards.hub.resumeEyebrow")}
                </p>
                <p className="mt-1 text-lg font-bold tracking-tight text-[var(--semantic-text-primary)] sm:text-xl">
                  {t("learner.flashcards.hub.resumeHeadline")}
                </p>
                <p className="mt-1.5 text-sm text-[var(--semantic-text-secondary)]">
                  {resumeCk.systemsLabel} · {resumeProgressPct}% through this
                  run · ~{resumeCardsRemaining} card
                  {resumeCardsRemaining === 1 ? "" : "s"} remaining
                </p>
              </div>
              <div className="flex w-full flex-col gap-2 sm:w-auto sm:min-w-[12rem]">
                <LearnerCtaLink
                  href={resumeHref}
                  data-nn-e2e-flashcards-resume-primary
                  className="inline-flex min-h-12 w-full items-center justify-center px-8 text-base font-bold shadow-[0_12px_28px_color-mix(in_srgb,var(--semantic-info)_24%,transparent)] sm:w-auto"
                >
                  {t("learner.flashcards.hub.ctaResume")}
                </LearnerCtaLink>
                <LearnerCtaLink
                  href={startHref}
                  variant="secondary"
                  data-nn-e2e-start-review
                  className="inline-flex min-h-10 w-full items-center justify-center px-5 text-sm font-semibold sm:w-auto"
                >
                  {t("learner.flashcards.hub.ctaStart")}
                </LearnerCtaLink>
              </div>
            </div>
          ) : null}

          <div
            className="nn-flashcards-hero-action-row border-t border-[color-mix(in_srgb,var(--semantic-border-soft)_65%,transparent)] pt-5"
            data-nn-e2e-flashcards-deck-band
          >
            <p
              className="max-w-prose text-pretty text-sm leading-relaxed text-[var(--semantic-text-secondary)]"
              data-nn-e2e-flashcards-session-preview
            >
              {sessionPreviewCopy}
            </p>
            <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="min-w-0 flex-1">
                {resumeHref ? (
                  <p
                    className="text-xs text-[var(--semantic-text-muted)]"
                    data-nn-e2e-flashcards-cta-subline
                  >
                    {ctaSubline}
                  </p>
                ) : (
                  <>
                    <LearnerCtaLink
                      href={startHref}
                      data-nn-e2e-start-review
                      className="inline-flex min-h-12 w-full items-center justify-center px-8 py-3.5 text-base font-bold shadow-[0_12px_28px_color-mix(in_srgb,var(--semantic-brand)_22%,transparent)] sm:w-auto"
                    >
                      {t("learner.flashcards.hub.ctaStart")}
                    </LearnerCtaLink>
                    <p
                      className="mt-2 text-center text-xs text-[var(--semantic-text-muted)] sm:text-left"
                      data-nn-e2e-flashcards-cta-subline
                    >
                      {ctaSubline}
                    </p>
                  </>
                )}
              </div>
              <div className="nn-flashcards-deck-match-inline flex items-center gap-3 text-xs text-[var(--semantic-text-secondary)] lg:shrink-0">
                <span>
                  <span className="font-semibold text-[var(--semantic-text-primary)]">
                    Deck match{" "}
                  </span>
                  <span className="tabular-nums text-base font-bold text-[var(--semantic-text-primary)]">
                    {matchingCards != null ? matchingCards : "—"}
                  </span>
                </span>
                <span
                  className="hidden h-4 w-px bg-[var(--semantic-border-soft)] sm:inline"
                  aria-hidden
                />
                <span className="hidden tabular-nums sm:inline">
                  {poolFillPct}% of pathway pool
                </span>
              </div>
            </div>
            <div className="nn-progress-track-semantic nn-progress-track-semantic--md mt-3 h-1.5 max-w-xl overflow-hidden rounded-full bg-[var(--semantic-progress-track)]">
              <div
                className={`h-full rounded-full ${deckProgressFillClass} transition-[width] duration-300 ease-out`}
                style={{ width: `${poolFillPct}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {loadError ? (
        builderCategories.length === 0 ? (
          <FlashcardErrorBoundary
            error={new Error(loadError)}
            onRetry={refreshCategories}
          />
        ) : (
          <div
            className="rounded-lg border px-3 py-2 text-sm"
            style={{
              background:
                "var(--surface-secondary, var(--semantic-panel-muted))",
              borderColor: "var(--border-subtle, var(--semantic-border-soft))",
              color: "var(--foreground, var(--semantic-text-primary))",
            }}
          >
            {loadError}
          </div>
        )
      ) : null}

      <SharedStudySetupSurface
        className="nn-flashcards-deck-library-surface"
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
          intro="Systems adapt to your performance — weak areas, suggested focus, and deck depth appear on each tile."
          metaBySystem={categorySignals.metaBySystem}
          weakSystemIds={categorySignals.weakSystemIds}
          strengthPctBySystem={categorySignals.strengthPctBySystem}
        />

        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-[color-mix(in_srgb,var(--semantic-border-soft)_70%,transparent)] pt-4">
          <button
            type="button"
            onClick={() => setSelectedCanonicalIds([])}
            data-nn-e2e-all-systems-btn
            data-active={selectedCanonicalIds.length === 0}
            aria-pressed={selectedCanonicalIds.length === 0}
            className="nn-flashcards-all-systems-btn inline-flex min-h-11 items-center gap-1.5 rounded-full border border-[var(--semantic-border-soft)] px-4 py-2 text-sm font-semibold text-[var(--semantic-text-secondary)] hover:bg-[color-mix(in_srgb,var(--semantic-panel-muted)_50%,var(--semantic-surface))] sm:min-h-9 sm:text-xs"
          >
            All systems
            {selectedCanonicalIds.length === 0 ? (
              <span
                className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--semantic-brand)_18%,var(--semantic-surface))] text-[10px]"
                aria-hidden
              >
                ✓
              </span>
            ) : null}
          </button>
          {selectedCanonicalIds.length > 0 ? (
            <span className="rounded-full border border-[color-mix(in_srgb,var(--semantic-brand)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-positive)_40%,var(--semantic-surface))] px-3 py-1.5 text-xs font-semibold text-[var(--semantic-text-primary)]">
              {selectedCanonicalIds.length} system
              {selectedCanonicalIds.length === 1 ? "" : "s"} selected
            </span>
          ) : (
            <span className="text-xs text-[var(--semantic-text-muted)]">
              Tap systems below to focus your deck
            </span>
          )}
        </div>
      </SharedStudySetupSurface>

      {hubContextualNotice}

      <details
        className="nn-flashcards-setup-panel nn-flashcards-hub-setup-panel nn-flashcards-collapsed-panel rounded-2xl border shadow-[var(--semantic-shadow-soft)]"
        data-nn-e2e-flashcards-setup-panel
      >
        <summary className="cursor-pointer list-none rounded-xl px-4 py-3.5 text-sm font-semibold text-[var(--semantic-text-primary)] hover:bg-[color-mix(in_srgb,var(--semantic-panel-muted)_35%,transparent)] sm:px-5">
          Fine-tune session length &amp; filters
          <span className="mt-0.5 block text-xs font-normal text-[var(--semantic-text-muted)]">
            Optional — most learners continue or start adaptive with defaults
          </span>
        </summary>
        <div className="space-y-6 border-t border-[var(--semantic-border-soft)] px-4 pb-5 pt-4 sm:px-5 sm:pb-6">
          <div>
            <h3 id="nn-flashcards-setup-heading" className="sr-only">
              Session setup
            </h3>
          </div>

          <div className="space-y-4" data-nn-e2e-flashcards-session-size>
            <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">
              Session size
            </p>
            <div
              className="nn-flashcards-session-segmented flex flex-col gap-2 sm:flex-row sm:flex-wrap"
              role="group"
              aria-label="Session size"
            >
              {FLASHCARD_SESSION_PRESETS.map((n) => {
                const on = cardLimit === n && !isCustomCardLimit;
                return (
                  <button
                    key={n}
                    type="button"
                    data-nn-e2e-session-size-preset={n}
                    data-active={on}
                    aria-pressed={on}
                    className="nn-flashcards-session-segment min-h-12 flex-1 rounded-xl border border-[var(--semantic-border-soft)] px-4 py-3 text-sm font-bold text-[var(--semantic-text-secondary)] sm:min-w-[4.5rem] sm:flex-none"
                    onClick={() => {
                      setCardLimit(n);
                      setCustomLimitInput("");
                    }}
                  >
                    {n}
                  </button>
                );
              })}
              <button
                type="button"
                data-nn-e2e-session-size-preset="all"
                data-active={cardLimit === "all"}
                aria-pressed={cardLimit === "all"}
                className="nn-flashcards-session-segment nn-flashcards-session-segment--full min-h-12 flex-[1.2] rounded-xl border border-[color-mix(in_srgb,var(--semantic-chart-4)_30%,var(--semantic-border-soft))] px-4 py-3 text-left sm:min-w-[9rem]"
                onClick={() => {
                  setCardLimit("all");
                  setCustomLimitInput("");
                }}
              >
                <span className="block text-sm font-bold text-[var(--semantic-text-primary)]">
                  Full review
                </span>
                <span className="mt-0.5 block text-[11px] font-medium text-[var(--semantic-text-muted)]">
                  Deep study · all matched cards
                </span>
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-3 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 py-3">
              <label
                className="text-sm font-medium text-[var(--semantic-text-secondary)]"
                htmlFor="nn-flashcards-custom-limit"
              >
                Custom
              </label>
              <input
                id="nn-flashcards-custom-limit"
                type="number"
                min={10}
                max={500}
                inputMode="numeric"
                placeholder="25"
                value={customLimitInput}
                data-nn-e2e-custom-card-limit
                className="nn-flashcards-custom-limit-input"
                onChange={(e) => {
                  const raw = e.target.value;
                  setCustomLimitInput(raw);
                  const n = Number(raw);
                  if (Number.isFinite(n) && n >= 10)
                    setCardLimit(Math.min(500, Math.floor(n)));
                }}
              />
              <span className="text-xs text-[var(--semantic-text-muted)]">
                10–500 cards
              </span>
            </div>
          </div>

          <LearnerFilterBar
            title="Study mode"
            className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 sm:p-5 shadow-none"
          >
            <div
              className="flex flex-wrap gap-2"
              data-nn-e2e-flashcard-filter-presets
            >
              <LearnerCtaLink
                href={quickReviewHref}
                className="nn-flashcards-quick-review-cta inline-flex min-h-11 items-center rounded-full px-4 py-2 text-sm font-semibold sm:min-h-9"
                data-nn-e2e-flashcards-quick-review
              >
                {t("learner.flashcards.hub.quickReviewCta")}
              </LearnerCtaLink>
              <button
                type="button"
                data-active={activePreset === "weak"}
                aria-pressed={activePreset === "weak"}
                className="nn-flashcards-study-chip inline-flex min-h-11 items-center rounded-full border border-[var(--semantic-border-soft)] px-4 py-2 text-sm font-semibold text-[var(--semantic-text-secondary)] sm:min-h-9"
                onClick={() => applyFilterPreset("weak")}
              >
                Weak areas
              </button>
              <button
                type="button"
                data-active={activePreset === "unseen"}
                aria-pressed={activePreset === "unseen"}
                className="nn-flashcards-study-chip inline-flex min-h-11 items-center rounded-full border border-[var(--semantic-border-soft)] px-4 py-2 text-sm font-semibold text-[var(--semantic-text-secondary)] sm:min-h-9"
                onClick={() => applyFilterPreset("unseen")}
              >
                Only unseen
              </button>
              {(
                [
                  ["all", "All cards"],
                  ["starred", "Starred"],
                  [
                    "incorrect",
                    t("learner.flashcards.hub.filterReviewIncorrect"),
                  ],
                ] as const
              ).map(([key, label]) => {
                const on = activePreset === key;
                return (
                  <button
                    key={key}
                    type="button"
                    data-active={on}
                    aria-pressed={on}
                    className="nn-flashcards-study-chip inline-flex min-h-11 items-center rounded-full border border-[var(--semantic-border-soft)] px-4 py-2 text-sm font-semibold text-[var(--semantic-text-secondary)] sm:min-h-9"
                    onClick={() => applyFilterPreset(key)}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              data-active={shuffleOn}
              aria-pressed={shuffleOn}
              className="nn-flashcards-study-chip mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-[var(--semantic-border-soft)] px-4 text-sm font-semibold text-[var(--semantic-text-secondary)] sm:w-auto"
              onClick={() => setShuffleOn((v) => !v)}
              data-nn-e2e-flashcards-shuffle
            >
              <Shuffle
                className="h-4 w-4 text-[var(--semantic-chart-3)]"
                aria-hidden
              />
              {shuffleOn ? "Shuffle on" : "Shuffle off"}
            </button>
          </LearnerFilterBar>
        </div>
      </details>

      <div
        className="nn-flashcards-sticky-start hidden fixed inset-x-0 bottom-0 z-20 border-t border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-surface)_92%,transparent)] px-4 py-3 shadow-[0_-8px_24px_color-mix(in_srgb,var(--semantic-text-primary)_6%,transparent)] backdrop-blur-md supports-[backdrop-filter]:bg-[color-mix(in_srgb,var(--semantic-surface)_85%,transparent)] sm:px-6 md:hidden"
        data-nn-e2e-flashcards-sticky-cta
        style={{
          paddingBottom: "max(0.75rem, env(safe-area-inset-bottom, 0px))",
        }}
      >
        <p className="mb-2 line-clamp-2 text-center text-[11px] text-[var(--semantic-text-muted)]">
          {ctaSubline}
        </p>
        {resumeHref ? (
          <LearnerCtaLink
            href={resumeHref}
            data-nn-e2e-flashcards-resume-bottom
            className="inline-flex min-h-12 w-full items-center justify-center text-base font-bold"
          >
            {t("learner.flashcards.hub.ctaResume")}
          </LearnerCtaLink>
        ) : (
          <LearnerCtaLink
            href={startHref}
            data-nn-e2e-start-review-bottom
            className="inline-flex min-h-12 w-full items-center justify-center text-base font-bold"
          >
            {t("learner.flashcards.hub.ctaStart")}
          </LearnerCtaLink>
        )}
      </div>

      <details
        className="nn-flashcards-recovery-filters nn-flashcards-collapsed-panel rounded-xl border border-[color-mix(in_srgb,var(--semantic-border-soft)_90%,transparent)] bg-transparent px-1 py-1"
        data-nn-e2e-flashcards-secondary
      >
        <summary className="cursor-pointer list-none rounded-lg px-3 py-2 text-sm font-medium text-[var(--semantic-text-muted)] hover:bg-[color-mix(in_srgb,var(--semantic-panel-muted)_40%,transparent)]">
          Advanced filters &amp; links
        </summary>
        <div className="mt-4 space-y-4 border-t border-[var(--semantic-border-soft)] pt-4">
          {activePreset === "custom" ? (
            <p className="text-xs text-[var(--semantic-text-muted)]">
              Multiple progress filters are active.
            </p>
          ) : null}
          <div className="grid gap-2 sm:grid-cols-2">
            <label className="flex min-h-11 items-center gap-2 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 text-sm text-[var(--semantic-text-primary)]">
              <input
                type="checkbox"
                checked={weakOnly}
                onChange={(e) => setWeakOnly(e.target.checked)}
              />
              Weak areas only
            </label>
            <label className="flex min-h-11 items-center gap-2 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 text-sm text-[var(--semantic-text-primary)]">
              <input
                type="checkbox"
                checked={incorrectOnly}
                onChange={(e) => setIncorrectOnly(e.target.checked)}
              />
              Previously incorrect
            </label>
            <label className="flex min-h-11 items-center gap-2 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 text-sm text-[var(--semantic-text-primary)]">
              <input
                type="checkbox"
                checked={notStudiedOnly}
                onChange={(e) => setNotStudiedOnly(e.target.checked)}
              />
              Not studied
            </label>
            <label className="flex min-h-11 items-center gap-2 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 text-sm text-[var(--semantic-text-primary)]">
              <input
                type="checkbox"
                checked={starredOnly}
                onChange={(e) => setStarredOnly(e.target.checked)}
              />
              Starred only
            </label>
          </div>

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
              <Link
                href={catHref}
                className="font-semibold text-[var(--semantic-info)] underline underline-offset-2"
              >
                Adaptive CAT
              </Link>
            ) : null}
            {hubTopicSlug?.trim() ? (
              <Link
                href={buildAppPracticeTestsTopicHref(
                  scopedPathwayId,
                  hubTopicSlug,
                )}
                className="font-semibold text-[color-mix(in_srgb,var(--semantic-chart-3)_88%,var(--semantic-text-primary))] underline underline-offset-2"
                data-testid="flashcards-hub-link-practice-tests-topic"
                data-nn-pathway-id={scopedPathwayId}
              >
                {t("learner.studyLoop.practiceQuestionsThisTopic")}
              </Link>
            ) : null}
          </div>

          {process.env.NODE_ENV === "development" &&
          lessonVirtualDiagnostics ? (
            <div
              className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-3 py-2 text-xs text-[var(--semantic-text-secondary)]"
              data-nn-e2e-flashcards-lesson-diagnostics
            >
              <p className="font-semibold text-[var(--semantic-text-primary)]">
                Lesson-linked inventory (dev)
              </p>
              <ul className="mt-1 list-disc space-y-0.5 pl-4 font-mono leading-relaxed">
                <li>pathwayId: {lessonVirtualDiagnostics.pathwayId}</li>
                <li>
                  catalog lessons: {lessonVirtualDiagnostics.catalogLessonCount}
                </li>
                <li>
                  lessons with derived cards:{" "}
                  {lessonVirtualDiagnostics.lessonsWithDerivedCards}
                </li>
                <li>
                  total generated virtual cards:{" "}
                  {lessonVirtualDiagnostics.totalGeneratedVirtualCards}
                </li>
                <li>
                  recall rows: {lessonVirtualDiagnostics.recallVirtualCount}
                </li>
                <li>
                  section-derived rows:{" "}
                  {lessonVirtualDiagnostics.sectionDerivedVirtualCount}
                </li>
                <li>
                  generic-filler-tagged section rows:{" "}
                  {lessonVirtualDiagnostics.genericFillerSectionCardHits}
                </li>
                <li>
                  selected systems/categories:{" "}
                  {lessonVirtualDiagnostics.selectedCategoryIds.join(", ") ||
                    "(all)"}
                </li>
                <li>filter mode: {lessonVirtualDiagnostics.filterModeLabel}</li>
              </ul>
            </div>
          ) : null}
          {process.env.NODE_ENV === "development" && poolDiagnostics ? (
            <div
              className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-3 py-2 text-xs text-[var(--semantic-text-secondary)]"
              data-nn-e2e-flashcards-pool-diagnostics
            >
              <p className="font-semibold text-[var(--semantic-text-primary)]">
                Pool diagnostics (dev)
              </p>
              <ul className="mt-1 list-disc space-y-0.5 pl-4 font-mono leading-relaxed">
                <li>pathwayId: {poolDiagnostics.pathwayId}</li>
                <li>
                  exam_question SQL pool:{" "}
                  {poolDiagnostics.examQuestionSqlPoolCount}
                </li>
                <li>
                  dedicated Flashcard rows (deck pathway):{" "}
                  {poolDiagnostics.dedicatedFlashcardRowCount}
                </li>
                <li>
                  tier / country scope: {poolDiagnostics.tier ?? "—"} /{" "}
                  {poolDiagnostics.country ?? "—"}
                </li>
                <li>pool source: {poolDiagnostics.poolSource}</li>
                {poolDiagnostics.legacyCanonicalPrismaPoolCount != null ? (
                  <li>
                    legacy Prisma exam IN() count:{" "}
                    {poolDiagnostics.legacyCanonicalPrismaPoolCount}
                  </li>
                ) : null}
                {poolDiagnostics.zeroHint ? (
                  <li className="text-[var(--semantic-warning)]">
                    {poolDiagnostics.zeroHint}
                  </li>
                ) : null}
              </ul>
            </div>
          ) : null}
        </div>
      </details>

      <details className="nn-flashcards-collapsed-panel rounded-xl border border-[color-mix(in_srgb,var(--semantic-border-soft)_90%,transparent)] px-1 py-1">
        <summary className="cursor-pointer list-none rounded-lg px-3 py-2 text-sm font-medium text-[var(--semantic-text-muted)] hover:bg-[color-mix(in_srgb,var(--semantic-panel-muted)_40%,transparent)]">
          Performance insights
        </summary>
        <div className="pt-3">
          <FlashcardsHubAnalytics pathwayId={scopedPathwayId} />
        </div>
      </details>
    </SharedStudySetupLayout>
  );
}
