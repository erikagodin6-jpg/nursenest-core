"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Check, Layers, Plus, Shuffle, SlidersHorizontal } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { LearnerStudyPageShell } from "@/components/learner-study-ui";
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
import { LearnerCtaLink } from "@/components/learner-ui/learner-cta-link";
import { weakAreaFlashcardsHref } from "@/lib/learner/weak-area-flashcards-href";
import { LearnerStudyLiveSyncBanner } from "@/components/student/learner-study-live-sync-banner";
import type { FlashcardLessonVirtualDiagnostics } from "@/lib/flashcards/flashcard-custom-session-response";
import type { FlashcardsHubServerPayload, FlashcardsPoolInventoryDiagnostics } from "@/lib/flashcards/flashcards-hub-types";
import { isAlliedMarketingCorePathwayId } from "@/lib/lessons/canonical-lessons-hubs";
import { buildAppPracticeTestsTopicHref } from "@/lib/learner/app-study-internal-links";
import { FlashcardsHubAnalytics } from "@/components/flashcards/flashcards-hub-analytics";
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
import { buildFlashcardsSessionPreview } from "@/lib/flashcards/flashcards-hub-session-copy";
import { parseHubMode, parseHubSystemsFromSearchParams } from "@/lib/flashcards/flashcards-hub-url";
import { toggleFlashcardsHubSystemSelection } from "@/lib/flashcards/flashcards-hub-system-selection";

const FLASHCARDS_HUB_CLIENT_FETCH_TIMEOUT_MS = 2000;
type InventoryStatus = "loading" | "ready" | "degraded";

async function fetchFlashcardsHubJson(url: string): Promise<{ res: Response; json: unknown }> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), FLASHCARDS_HUB_CLIENT_FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      credentials: "include",
      cache: "no-store",
      signal: controller.signal,
    });
    const json = await res.json();
    return { res, json };
  } finally {
    window.clearTimeout(timeoutId);
  }
}

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
  recentStudiedOnly: boolean;
  includeCards: boolean;
  forceCategoryFilter?: boolean;
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
    (args.forceCategoryFilter || args.selectedBuilderCategoryIds.length < args.allBuilderCategoryIds.length)
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
  if (args.recentStudiedOnly) {
    q.set("recentStudiedOnly", "1");
    q.set("recentDays", "14");
  }
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
  const heroTitle = flashcardsHeroTitle?.trim() || t("learner.flashcards.hub.title");
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
  const [inventoryStatus, setInventoryStatus] = useState<InventoryStatus>(() =>
    initialPoolDiagnostics ?? initialHub?.poolDiagnostics ? "ready" : "loading",
  );
  useEffect(() => {
    setPoolDiagnostics(initialPoolDiagnostics ?? initialHub?.poolDiagnostics ?? null);
    setInventoryStatus(initialPoolDiagnostics ?? initialHub?.poolDiagnostics ? "ready" : "loading");
  }, [initialPoolDiagnostics, initialHub?.poolDiagnostics]);
  const [selectedCanonicalIds, setSelectedCanonicalIds] = useState<string[]>([]);
  const [cardLimit, setCardLimit] = useState<FlashcardsHubCardLimit>(25);
  const [customLimitInput, setCustomLimitInput] = useState("");
  const [shuffleOn, setShuffleOn] = useState(true);
  const [weakOnly, setWeakOnly] = useState(Boolean(initialWeakOnly));
  useEffect(() => {
    setWeakOnly(Boolean(initialWeakOnly));
  }, [initialWeakOnly]);
  const [incorrectOnly, setIncorrectOnly] = useState(false);
  const [starredOnly, setStarredOnly] = useState(false);
  const [notStudiedOnly, setNotStudiedOnly] = useState(false);
  const [recentStudiedOnly, setRecentStudiedOnly] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [resumeCk, setResumeCk] = useState(() =>
    typeof window !== "undefined" ? readFlashcardsCustomSessionCheckpoint(scopedPathwayId) : null,
  );

  useEffect(() => {
    setResumeCk(readFlashcardsCustomSessionCheckpoint(scopedPathwayId));
  }, [scopedPathwayId, cardLimit, selectedCanonicalIds, shuffleOn, weakOnly]);

  const effectiveCardCount = useMemo(
    () => effectiveSessionCardCount(cardLimit, matchingCards),
    [cardLimit, matchingCards],
  );

  const isCustomCardLimit = useMemo(
    () =>
      cardLimit !== "all" &&
      !(FLASHCARD_SESSION_PRESETS as readonly number[]).includes(cardLimit as number),
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
        if (!(FLASHCARD_SESSION_PRESETS as readonly number[]).includes(clamped)) {
          setCustomLimitInput(String(clamped));
        }
      }
    } else {
      setCardLimit(prefs.cardLimit);
      if (prefs.customCardLimit != null) setCustomLimitInput(String(prefs.customCardLimit));
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
      customCardLimit: Number.isFinite(custom as number) ? (custom as number) : null,
      shuffleOn,
      selectedCanonicalIds: selectedCanonicalIds as FlashcardsHubPreferencesV1["selectedCanonicalIds"],
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
    setInventoryStatus((current) => (builderCategoriesRef.current.length > 0 ? current : "loading"));

    try {
      const progressFiltersActive =
        weakOnly || incorrectOnly || notStudiedOnly || starredOnly || recentStudiedOnly;

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
          recentStudiedOnly,
          includeCards: false,
          alliedProfession: apForQuery || null,
          hubTopicSlug,
        });
        let res: Response;
        let json: unknown;
        try {
          const fetched = await fetchFlashcardsHubJson(`/api/flashcards/custom-session?${qs}`);
          res = fetched.res;
          json = fetched.json;
        } catch {
          if (builderCategoriesRef.current.length > 0) {
            logDedupedClientDiagnostic("flashcards_hub", "custom_session_timeout_kept_stale", scopedPathwayId, {
              pathwayId: scopedPathwayId,
              timeoutMs: FLASHCARDS_HUB_CLIENT_FETCH_TIMEOUT_MS,
            });
            setLoadError("Flashcard counts are taking longer than expected. You can keep studying with the deck categories shown below or retry counts.");
            setInventoryStatus("degraded");
            return;
          }
          const base = "Flashcard inventory took too long to load. Try again or continue with available deck categories.";
          setLoadError(
            process.env.NODE_ENV === "development"
              ? `${base} (pathwayId=${scopedPathwayId}, timeoutMs=${FLASHCARDS_HUB_CLIENT_FETCH_TIMEOUT_MS})`
              : base,
          );
          setBuilderCategories([]);
          setMatchingCards(null);
          setLessonVirtualDiagnostics(null);
          setPoolDiagnostics(null);
          setInventoryStatus("degraded");
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
            setInventoryStatus("degraded");
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
          setInventoryStatus("degraded");
          return;
        }
        setBuilderCategories(parsed.categoryOptions);
        setMatchingCards(parsed.summary?.matchingCards ?? 0);
        setLessonVirtualDiagnostics(parsed.summary?.lessonVirtualDiagnostics ?? null);
        setPoolDiagnostics(parsed.summary?.poolInventoryDiagnostics ?? null);
        setInventoryStatus("ready");
        return;
      }

      const invUrl = `/api/flashcards/inventory?pathwayId=${encodeURIComponent(scopedPathwayId)}`;
      let res: Response;
      let json: unknown;
      try {
        const fetched = await fetchFlashcardsHubJson(invUrl);
        res = fetched.res;
        json = fetched.json;
      } catch {
        logDedupedClientDiagnostic("flashcards_hub", "inventory_timeout_or_json_parse_failed", scopedPathwayId, {
          pathwayId: scopedPathwayId,
          timeoutMs: FLASHCARDS_HUB_CLIENT_FETCH_TIMEOUT_MS,
        });
        if (builderCategoriesRef.current.length > 0) {
          logDedupedClientDiagnostic("flashcards_hub", "inventory_timeout_kept_stale", scopedPathwayId, {
            pathwayId: scopedPathwayId,
            timeoutMs: FLASHCARDS_HUB_CLIENT_FETCH_TIMEOUT_MS,
          });
          setLoadError("Flashcard counts are taking longer than expected. You can keep studying with the deck categories shown below or retry counts.");
          setInventoryStatus("degraded");
          return;
        }
        const base = "Flashcard inventory took too long to load. Try again or continue with available deck categories.";
        setLoadError(
          process.env.NODE_ENV === "development"
            ? `${base} (pathwayId=${scopedPathwayId}, timeoutMs=${FLASHCARDS_HUB_CLIENT_FETCH_TIMEOUT_MS})`
            : base,
        );
        setBuilderCategories([]);
        setMatchingCards(null);
        setPoolDiagnostics(null);
        setInventoryStatus("degraded");
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
          setInventoryStatus("degraded");
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
        const base = parsed.message.trim() ? parsed.message : "Could not load flashcard pool counts.";
        setLoadError(
          process.env.NODE_ENV === "development"
            ? `${base} (pathwayId=${scopedPathwayId}, httpStatus=${res.status})`
            : base,
        );
        setBuilderCategories([]);
        setMatchingCards(null);
        setPoolDiagnostics(null);
        setInventoryStatus("degraded");
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
          setInventoryStatus("degraded");
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
        setInventoryStatus("degraded");
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
      setInventoryStatus("ready");
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
        setInventoryStatus("degraded");
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
      setInventoryStatus("degraded");
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
    recentStudiedOnly,
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

  const { ctaSubline } = useMemo(
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
    resumeCk && resumeCk.totalCards > 0 ? Math.max(1, resumeCk.totalCards - resumeCk.index) : 0;

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
        recentStudiedOnly,
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
      recentStudiedOnly,
      apForQuery,
      hubTopicSlug,
    ],
  );

  const startHref = `/app/flashcards/custom?${startQuery}`;
  const flashcardCountFormatter = useMemo(() => new Intl.NumberFormat("en-US"), []);
  const starredCount = useMemo(() => countSavedStudyItems().starred, []);

  const activePreset = useMemo((): "all" | "weak" | "incorrect" | "recent" | "starred" | "unseen" | "custom" => {
    if (starredOnly && !weakOnly && !incorrectOnly && !notStudiedOnly && !recentStudiedOnly) return "starred";
    if (notStudiedOnly && !weakOnly && !incorrectOnly && !starredOnly && !recentStudiedOnly) return "unseen";
    if (recentStudiedOnly && !weakOnly && !incorrectOnly && !starredOnly && !notStudiedOnly) return "recent";
    if (incorrectOnly && !weakOnly && !starredOnly && !notStudiedOnly && !recentStudiedOnly) return "incorrect";
    if (weakOnly && !incorrectOnly && !starredOnly && !notStudiedOnly && !recentStudiedOnly) return "weak";
    if (!weakOnly && !incorrectOnly && !starredOnly && !notStudiedOnly && !recentStudiedOnly) return "all";
    return "custom";
  }, [weakOnly, incorrectOnly, starredOnly, notStudiedOnly, recentStudiedOnly]);

  const selectedSystemLabel =
    selectedCanonicalIds.length === 0 || selectedCanonicalIds.length >= CANONICAL_STUDY_CATEGORIES.length
      ? "All systems"
      : `${selectedCanonicalIds.length} ${selectedCanonicalIds.length === 1 ? "system" : "systems"}`;

  const countsReliable = inventoryStatus === "ready";
  const systemCountLabel = (count: number): string | null => {
    if (!countsReliable || count <= 0) return null;
    return `${flashcardCountFormatter.format(count)} Flashcards`;
  };

  const visibleCardCountLabel = cardLimit === "all" ? "All matched cards" : `${effectiveCardCount} cards selected`;

  const applyFilterPreset = (p: "all" | "weak" | "incorrect" | "recent" | "starred" | "unseen") => {
    if (p === "all") {
      setWeakOnly(false);
      setIncorrectOnly(false);
      setStarredOnly(false);
      setNotStudiedOnly(false);
      setRecentStudiedOnly(false);
    } else if (p === "weak") {
      setWeakOnly(true);
      setIncorrectOnly(false);
      setStarredOnly(false);
      setNotStudiedOnly(false);
      setRecentStudiedOnly(false);
    } else if (p === "incorrect") {
      setWeakOnly(false);
      setIncorrectOnly(true);
      setStarredOnly(false);
      setNotStudiedOnly(false);
      setRecentStudiedOnly(false);
    } else if (p === "starred") {
      setWeakOnly(false);
      setIncorrectOnly(false);
      setStarredOnly(true);
      setNotStudiedOnly(false);
      setRecentStudiedOnly(false);
    } else if (p === "recent") {
      setWeakOnly(false);
      setIncorrectOnly(false);
      setStarredOnly(false);
      setNotStudiedOnly(false);
      setRecentStudiedOnly(true);
    } else {
      setWeakOnly(false);
      setIncorrectOnly(false);
      setStarredOnly(false);
      setNotStudiedOnly(true);
      setRecentStudiedOnly(false);
    }
  };

  /** Single contextual hint below the fold — avoids stacked grey empty-state panels. */
  const hubContextualNotice = useMemo(() => {
    if (loadError) return null;
    if (
      matchingCards === 0 &&
      !starredOnly &&
      builderCategories.length > 0 &&
      (weakOnly || incorrectOnly || notStudiedOnly || recentStudiedOnly || selectedCanonicalIds.length > 0)
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
      !recentStudiedOnly &&
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
    recentStudiedOnly,
    selectedCanonicalIds.length,
    sumCanonicalPool,
    lessonVirtualDiagnostics,
    scopedPathwayId,
    resolvedLessonsHubHref,
    starredCount,
  ]);

  return (
    <LearnerStudyPageShell
      className="nn-flashcards-hub-premium nn-flashcards-hub-premium-v2 space-y-5 py-4 pb-24 sm:space-y-6 sm:py-6 md:pb-6"
      data-nn-flashcards-premium-hub=""
      data-nn-premium-flashcard-convergence
      data-nn-premium-full-platform-convergence=""
      data-nn-premium-platform-family="exam-study"
      data-nn-premium-platform-module="flashcards"
      data-nn-e2e-flashcards-hub
      data-nn-e2e-flashcards-launcher
    >
      {pathwayBootstrapSource === "secondary" ? <LearnerStudyLiveSyncBanner /> : null}

      <nav
        aria-label="Flashcards breadcrumb"
        className="mx-auto flex w-full max-w-5xl items-center gap-2 px-1 text-sm text-[var(--semantic-text-secondary)]"
        data-nn-e2e-flashcards-breadcrumb
      >
        <Link href="/app" className="font-medium hover:text-[var(--semantic-text-primary)]">
          Home
        </Link>
        <span aria-hidden className="text-[var(--semantic-text-muted)]">/</span>
        <span className="rounded-md bg-[color-mix(in_srgb,var(--semantic-warning)_18%,var(--semantic-surface))] px-2 py-0.5 font-semibold text-[var(--semantic-text-primary)]">
          Flashcards
        </span>
      </nav>

      <header className="nn-flashcards-hub-page-header mx-auto w-full max-w-5xl px-1" data-nn-e2e-flashcards-page-header>
        <p className="nn-premium-home-eyebrow">Flashcards</p>
        <h1 className="mt-2 max-w-3xl text-3xl font-semibold tracking-tight text-[var(--semantic-text-primary)] sm:text-4xl">
          {heroTitle}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--semantic-text-secondary)] sm:text-base">
          {flashcardsHeroSubtitle?.trim() || "Choose a body system to begin studying."}
        </p>
      </header>

      {loadError ? (
        builderCategories.length === 0 ? (
          <FlashcardErrorBoundary error={new Error(loadError)} onRetry={refreshCategories} />
        ) : (
          <div
            className="mx-auto flex w-full max-w-5xl flex-col gap-3 rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-3 py-2 text-sm text-[var(--semantic-text-primary)] sm:flex-row sm:items-center sm:justify-between"
            data-nn-e2e-flashcards-retry-counts
          >
            <span>{loadError}</span>
            <button
              type="button"
              onClick={() => void refreshCategories()}
              className="inline-flex min-h-10 items-center justify-center rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 text-xs font-bold text-[var(--semantic-text-primary)] hover:border-[var(--semantic-brand)]"
            >
              Retry Counts
            </button>
          </div>
        )
      ) : null}

      <section
        className="nn-flashcards-deck-library-surface nn-flashcards-deck-library-surface-v2 mx-auto w-full max-w-5xl rounded-[1.5rem] border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-surface)_88%,var(--semantic-panel-muted))] p-5 shadow-[var(--semantic-shadow-soft)] sm:p-7 lg:p-8"
        aria-labelledby="flashcards-setup-title"
        data-nn-e2e-flashcards-canonical-grid
        data-nn-e2e-flashcards-setup-panel
      >
        <div className="mx-auto max-w-2xl text-center">
          <p className="nn-premium-home-eyebrow justify-center">Flashcards</p>
          <h2
            id="flashcards-setup-title"
            className="mt-2 text-3xl font-semibold tracking-tight text-[var(--semantic-text-primary)] sm:text-4xl"
          >
            Choose What to Study
          </h2>
          <p className="mt-3 text-sm leading-6 text-[var(--semantic-text-secondary)] sm:text-base">
            Select one or more systems, target the cards that need attention, and begin.
          </p>
        </div>

        {resumeHref && resumeCk ? (
          <div
            className="mt-7 rounded-[1.25rem] border border-[color-mix(in_srgb,var(--semantic-info)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_7%,var(--semantic-surface))] p-4 sm:p-5"
            data-nn-e2e-flashcards-resume
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--semantic-info)]">
                  {t("learner.flashcards.hub.resumeEyebrow")}
                </p>
                <p className="mt-1 text-lg font-semibold text-[var(--semantic-text-primary)]">
                  {t("learner.flashcards.hub.resumeHeadline")}
                </p>
                <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">
                  {resumeCk.systemsLabel} · {resumeProgressPct}% complete · {resumeCardsRemaining} card
                  {resumeCardsRemaining === 1 ? "" : "s"} remaining
                </p>
              </div>
              <LearnerCtaLink
                href={resumeHref}
                data-nn-e2e-flashcards-resume-primary
                className="inline-flex min-h-11 w-full items-center justify-center px-6 text-sm font-semibold sm:w-auto"
              >
                {t("learner.flashcards.hub.ctaResume")}
              </LearnerCtaLink>
            </div>
          </div>
        ) : null}

        <div className="mt-8 space-y-8">
          <section aria-labelledby="flashcards-systems-title">
            <div className="mb-4 flex flex-col gap-2 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--semantic-brand)]">
                  1. Systems &amp; Categories
                </p>
                <h3 id="flashcards-systems-title" className="mt-1 text-lg font-semibold text-[var(--semantic-text-primary)]">
                  Pick your focus
                </h3>
              </div>
              <p className="text-sm font-medium text-[var(--semantic-text-secondary)]">{selectedSystemLabel}</p>
            </div>

            <div
              className="nn-flashcards-system-actions mb-4 flex flex-wrap justify-center gap-2 sm:justify-start"
              data-nn-e2e-flashcards-system-actions
            >
              <button
                type="button"
                aria-pressed={selectedCanonicalIds.length === 0}
                data-active={selectedCanonicalIds.length === 0}
                className="nn-flashcards-study-chip inline-flex min-h-10 items-center gap-2 rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 text-xs font-bold text-[var(--semantic-text-primary)] hover:border-[var(--semantic-brand)]"
                onClick={() => setSelectedCanonicalIds([])}
              >
                <Check className="h-3.5 w-3.5 text-[var(--semantic-brand)]" aria-hidden />
                All Systems
              </button>
              <button
                type="button"
                aria-hidden={selectedCanonicalIds.length === 0}
                disabled={selectedCanonicalIds.length === 0}
                tabIndex={selectedCanonicalIds.length === 0 ? -1 : undefined}
                className={`nn-flashcards-study-chip inline-flex min-h-10 min-w-[9.75rem] items-center justify-center rounded-full border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-surface)_82%,var(--semantic-panel-muted))] px-4 text-xs font-bold text-[var(--semantic-text-secondary)] hover:text-[var(--semantic-text-primary)] ${
                  selectedCanonicalIds.length === 0 ? "pointer-events-none invisible" : ""
                }`}
                onClick={() => setSelectedCanonicalIds([])}
              >
                Clear system picks
              </button>
            </div>

            <div
              className="nn-flashcards-system-grid grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5"
              data-nn-e2e-flashcards-system-grid
            >
              {CANONICAL_STUDY_CATEGORIES.map((system) => {
                const active = selectedCanonicalIds.includes(system.id);
                const count = countsByCanonical[system.id] ?? 0;
                const countLabel = systemCountLabel(Math.max(0, count));
                const accentIndex = CANONICAL_STUDY_CATEGORIES.findIndex((category) => category.id === system.id) % 4;
                return (
                  <button
                    key={system.id}
                    type="button"
                    aria-pressed={active}
                    aria-label={`${active ? "Remove" : "Add"} ${system.label}${countLabel ? `, ${countLabel}` : ""}`}
                    data-selected={active}
                    data-accent={accentIndex}
                    className="nn-flashcards-system-card-v2 group flex h-[10.75rem] min-h-[10.75rem] flex-col justify-between rounded-[1.25rem] border-2 p-4 text-left text-sm font-semibold focus-visible:outline-none"
                    data-nn-e2e-flashcards-system-card={system.id}
                    onClick={() => {
                      setSelectedCanonicalIds((current) => {
                        return toggleFlashcardsHubSystemSelection(current, system.id);
                      });
                    }}
                  >
                    <span className="flex items-start justify-between gap-3">
                      <span className="nn-flashcards-system-card-v2__icon inline-flex h-10 w-10 items-center justify-center rounded-full border" aria-hidden>
                        <Layers className="h-5 w-5" />
                      </span>
                      <span className="nn-flashcards-system-card-v2__arrow inline-flex h-8 w-8 items-center justify-center rounded-full" aria-hidden>
                        {active ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                      </span>
                    </span>
                    <span className="block min-h-[3.25rem]">
                      <span className="block text-base leading-snug text-[var(--semantic-text-primary)]">
                        {system.label}
                      </span>
                      <span
                        className="mt-2 block min-h-[1rem] text-sm font-semibold leading-none text-[var(--semantic-text-secondary)]"
                        data-nn-e2e-flashcards-system-count
                        aria-hidden={countLabel ? undefined : true}
                      >
                        {countLabel}
                      </span>
                    </span>
                    <span className="block min-h-7" aria-hidden />
                  </button>
                );
              })}
            </div>
          </section>

          {hubContextualNotice}

          <section aria-labelledby="flashcards-filters-title">
            <div className="mb-4 text-center sm:text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--semantic-brand)]">
                2. Study Filters
              </p>
              <h3 id="flashcards-filters-title" className="mt-1 text-lg font-semibold text-[var(--semantic-text-primary)]">
                Target your review
              </h3>
            </div>

            <div className="flex flex-wrap justify-center gap-2 sm:justify-start" data-nn-e2e-flashcard-filter-presets>
              {(
                [
                  ["weak", "Weak Areas"],
                  ["unseen", "Unstudied"],
                  ["incorrect", "Incorrect Cards"],
                  ["recent", "Recently Missed"],
                  ["all", "All Cards"],
                ] as const
              ).map(([key, label]) => {
                const on = activePreset === key;
                return (
                  <button
                    key={key}
                    type="button"
                    aria-pressed={on}
                    data-active={on}
                    className={`nn-flashcards-study-chip inline-flex min-h-[42px] items-center justify-center rounded-full border px-4 text-sm font-semibold transition ${
                      on
                        ? "border-[color-mix(in_srgb,var(--semantic-brand)_35%,var(--semantic-border-soft))] bg-[var(--semantic-brand)] nn-text-on-solid-fill shadow-[0_10px_22px_color-mix(in_srgb,var(--semantic-brand)_18%,transparent)]"
                        : "border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-surface)_82%,var(--semantic-panel-muted))] text-[var(--semantic-text-primary)] hover:bg-[color-mix(in_srgb,var(--semantic-brand)_5%,var(--semantic-surface))]"
                    }`}
                    onClick={() => applyFilterPreset(key)}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </section>

          <section aria-labelledby="flashcards-count-title">
            <div className="mb-4 text-center sm:text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--semantic-brand)]">
                3. Card Count
              </p>
              <h3 id="flashcards-count-title" className="mt-1 text-lg font-semibold text-[var(--semantic-text-primary)]">
                Set session size
              </h3>
            </div>

            <div className="rounded-[1.25rem] border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-surface)_74%,var(--semantic-panel-muted))] p-4" data-nn-e2e-flashcards-session-size>
              <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Card count">
                {FLASHCARD_SESSION_PRESETS.map((count) => {
                  const on = cardLimit === count && !isCustomCardLimit;
                  return (
                    <button
                      key={count}
                      type="button"
                      aria-pressed={on}
                      data-active={on}
                      data-nn-e2e-session-size-preset={count}
                      onClick={() => {
                        setCardLimit(count);
                        setCustomLimitInput("");
                      }}
                      className={`nn-flashcards-session-chip inline-flex h-11 min-w-[68px] items-center justify-center rounded-full border px-4 text-sm font-semibold transition ${
                        on
                          ? "border-[color-mix(in_srgb,var(--semantic-brand)_35%,var(--semantic-border-soft))] bg-[var(--semantic-brand)] nn-text-on-solid-fill"
                          : "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] text-[var(--semantic-text-primary)] hover:bg-[color-mix(in_srgb,var(--semantic-brand)_5%,var(--semantic-surface))]"
                      }`}
                    >
                      {count}
                    </button>
                  );
                })}
                <button
                  type="button"
                  aria-pressed={cardLimit === "all"}
                  data-active={cardLimit === "all"}
                  data-nn-e2e-session-size-preset="all"
                  onClick={() => {
                    setCardLimit("all");
                    setCustomLimitInput("");
                  }}
                  className={`nn-flashcards-session-chip inline-flex h-11 min-w-[92px] items-center justify-center rounded-full border px-4 text-sm font-semibold transition ${
                    cardLimit === "all"
                      ? "border-[color-mix(in_srgb,var(--semantic-brand)_35%,var(--semantic-border-soft))] bg-[var(--semantic-brand)] nn-text-on-solid-fill"
                      : "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] text-[var(--semantic-text-primary)] hover:bg-[color-mix(in_srgb,var(--semantic-brand)_5%,var(--semantic-surface))]"
                  }`}
                >
                  All
                </button>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-sm font-medium text-[var(--semantic-text-secondary)]">
                <span className="inline-flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-[var(--semantic-brand)]" aria-hidden />
                  {visibleCardCountLabel}
                </span>
                <button
                  type="button"
                  data-active={shuffleOn}
                  aria-pressed={shuffleOn}
                  className="nn-flashcards-study-chip inline-flex min-h-9 items-center gap-2 rounded-full border border-[var(--semantic-border-soft)] px-3 text-xs font-semibold text-[var(--semantic-text-secondary)]"
                  onClick={() => setShuffleOn((v) => !v)}
                  data-nn-e2e-flashcards-shuffle
                >
                  <Shuffle className="h-3.5 w-3.5 text-[var(--semantic-brand)]" aria-hidden />
                  {shuffleOn ? "Shuffle on" : "Shuffle off"}
                </button>
              </div>
            </div>
          </section>

          <section className="space-y-2 text-center" aria-label="Start flashcards">
            <LearnerCtaLink
              href={startHref}
              data-nn-e2e-start-review
              className="inline-flex min-h-12 min-w-[190px] items-center justify-center rounded-full px-7 text-sm font-semibold"
            >
              Start Flashcards
            </LearnerCtaLink>
            <p
              className="mx-auto max-w-xl text-xs text-[var(--semantic-text-muted)]"
              data-nn-e2e-flashcards-cta-subline
            >
              {ctaSubline}
            </p>
          </section>
        </div>
      </section>

      <div
        className="nn-flashcards-sticky-start hidden fixed inset-x-0 bottom-0 z-20 border-t border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-surface)_92%,transparent)] px-4 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] pt-3 shadow-[0_-8px_24px_color-mix(in_srgb,var(--semantic-text-primary)_6%,transparent)] backdrop-blur-md supports-[backdrop-filter]:bg-[color-mix(in_srgb,var(--semantic-surface)_85%,transparent)] sm:px-6 md:hidden"
        data-nn-e2e-flashcards-sticky-cta
      >
        <p className="mb-2 line-clamp-2 text-center text-[11px] text-[var(--semantic-text-muted)]">{ctaSubline}</p>
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
            <p className="text-xs text-[var(--semantic-text-muted)]">Multiple progress filters are active.</p>
          ) : null}
          <div className="grid gap-2 sm:grid-cols-2">
            <label className="flex min-h-11 items-center gap-2 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 text-sm text-[var(--semantic-text-primary)]">
              <input type="checkbox" checked={weakOnly} onChange={(e) => setWeakOnly(e.target.checked)} />
              Weak areas only
            </label>
            <label className="flex min-h-11 items-center gap-2 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 text-sm text-[var(--semantic-text-primary)]">
              <input type="checkbox" checked={incorrectOnly} onChange={(e) => setIncorrectOnly(e.target.checked)} />
              Previously incorrect
            </label>
            <label className="flex min-h-11 items-center gap-2 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 text-sm text-[var(--semantic-text-primary)]">
              <input type="checkbox" checked={notStudiedOnly} onChange={(e) => setNotStudiedOnly(e.target.checked)} />
              Not studied
            </label>
            <label className="flex min-h-11 items-center gap-2 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 text-sm text-[var(--semantic-text-primary)]">
              <input type="checkbox" checked={starredOnly} onChange={(e) => setStarredOnly(e.target.checked)} />
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

      <details
        className="nn-flashcards-collapsed-panel rounded-xl border border-[color-mix(in_srgb,var(--semantic-border-soft)_90%,transparent)] px-1 py-1"
        onToggle={(event) => {
          if (event.currentTarget.open) setShowAnalytics(true);
        }}
      >
        <summary className="cursor-pointer list-none rounded-lg px-3 py-2 text-sm font-medium text-[var(--semantic-text-muted)] hover:bg-[color-mix(in_srgb,var(--semantic-panel-muted)_40%,transparent)]">
          Performance insights
        </summary>
        <div className="pt-3">
          {showAnalytics ? <FlashcardsHubAnalytics pathwayId={scopedPathwayId} /> : null}
        </div>
      </details>
    </LearnerStudyPageShell>
  );
}
