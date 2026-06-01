/**
 * Tertiary fallback for flashcard study sessions when the primary DB path fails after retries.
 *
 * Fallback chain:
 *   Primary:   DB-backed SRS session (full progress, due-date ordering)
 *   Secondary: Stale process-local cache (existing, handled by decks list route)
 *   Tertiary:  Static catalog cards (this module — no SRS, no progress tracking)
 *
 * Cards served via this path:
 * - Are derived from static TypeScript content bundles (nclex-pn-gap-closure-flashcards, cnple-gap-closure-flashcards)
 * - Are augmented with lesson-linked virtual flashcards from flashcard-pool-snapshot.server.ts
 * - Do NOT carry SRS scheduling data (no due dates, no progress weighting)
 * - Are returned with mode="preview" so the client renders them without SRS controls
 * - Are served with X-NurseNest-Content-Fallback: 1 and logged as a durability event
 */
import "server-only";

import { safeServerLog } from "@/lib/observability/safe-server-log";
import { NCLEX_PN_GAP_FLASHCARDS } from "@/content/flashcards/nclex-pn-gap-closure-flashcards";
import { CNPLE_GAP_FLASHCARDS } from "@/content/flashcards/cnple-gap-closure-flashcards";
import type { FlashcardStudyApiCard } from "@/lib/flashcards/flashcard-study-serialize";

/** Pathway IDs whose static bundles are available for fallback. */
const STATIC_BUNDLE_PATHWAY_PREFIXES = new Map<string, "pn" | "cnple">([
  ["us-lpn-nclex-pn", "pn"],
  ["ca-rpn-rex-pn", "pn"],
  ["ca-np-cnple", "cnple"],
  ["us-np-fnp", "cnple"],
]);

/** Minimal card representation from the static bundles. */
type StaticFlashcard = {
  id: string;
  topic: string;
  front: string;
  back: string;
  weakAreaTag: string;
  lessonSlug: string;
};

function staticBundleForPathway(pathwayId: string | null | undefined): readonly StaticFlashcard[] {
  const pid = (pathwayId ?? "").trim().toLowerCase();

  // Direct pathway match
  const bundleKey = STATIC_BUNDLE_PATHWAY_PREFIXES.get(pid);
  if (bundleKey === "pn") return NCLEX_PN_GAP_FLASHCARDS as unknown as StaticFlashcard[];
  if (bundleKey === "cnple") return CNPLE_GAP_FLASHCARDS as unknown as StaticFlashcard[];

  // Prefix matching for allied/FNP variants
  if (pid.includes("pn") || pid.includes("lpn") || pid.includes("rpn")) {
    return NCLEX_PN_GAP_FLASHCARDS as unknown as StaticFlashcard[];
  }
  if (pid.includes("np") || pid.includes("cnple")) {
    return CNPLE_GAP_FLASHCARDS as unknown as StaticFlashcard[];
  }

  // Universal fallback: mix both bundles
  return [
    ...(NCLEX_PN_GAP_FLASHCARDS as unknown as StaticFlashcard[]),
    ...(CNPLE_GAP_FLASHCARDS as unknown as StaticFlashcard[]),
  ];
}

function toStudyApiCard(card: StaticFlashcard, pathwayId: string | null): FlashcardStudyApiCard {
  return {
    id: card.id,
    front: card.front,
    back: card.back,
    fullBackAvailable: true,
    topic: card.topic,
    subtopic: null,
    sourceKey: card.lessonSlug ?? null,
    pathwayId: pathwayId ?? null,
  };
}

export type FlashcardSessionFallbackResult = {
  cards: FlashcardStudyApiCard[];
  totalAvailable: number;
  source: "static_catalog";
};

/**
 * Build a fallback study session from static content bundles.
 * Called only when the primary DB path has failed after all retries.
 *
 * @param deckRef  - original deck reference (used for logging)
 * @param pathwayId - pathway context for bundle selection
 * @param limit    - max cards to return
 * @param topicFilter - optional topic keyword to filter cards (best-effort)
 */
export function buildFlashcardSessionFallback(args: {
  deckRef: string;
  pathwayId: string | null;
  limit: number;
  topicFilter?: string | null;
}): FlashcardSessionFallbackResult {
  const { deckRef, pathwayId, limit, topicFilter } = args;

  safeServerLog("flashcard_session_fallback", "static_bundle_activated", {
    deckRef,
    pathwayId,
    limit,
    topicFilter: topicFilter ?? null,
  });

  const bundle = staticBundleForPathway(pathwayId);
  let candidates = [...bundle];

  // Best-effort topic filtering
  if (topicFilter && topicFilter.trim().length > 2) {
    const needle = topicFilter.trim().toLowerCase();
    const filtered = candidates.filter(
      (c) =>
        c.topic.toLowerCase().includes(needle) ||
        c.front.toLowerCase().includes(needle) ||
        c.weakAreaTag?.toLowerCase().includes(needle),
    );
    if (filtered.length >= 5) {
      candidates = filtered;
    }
    // If fewer than 5 topic-matched cards, fall through to full bundle (better than empty)
  }

  // Deterministic shuffle based on deckRef so the same deck always gets the same fallback order
  const seed = deckRef.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  candidates.sort((a, b) => {
    const ha = ((a.id.charCodeAt(0) ?? 0) + seed) % 997;
    const hb = ((b.id.charCodeAt(0) ?? 0) + seed) % 997;
    return ha - hb;
  });

  const selected = candidates.slice(0, Math.min(limit, candidates.length));
  const cards = selected.map((c) => toStudyApiCard(c, pathwayId));

  return {
    cards,
    totalAvailable: candidates.length,
    source: "static_catalog",
  };
}

/** True when the static bundle has content for the given pathway. */
export function hasFallbackContentForPathway(pathwayId: string | null | undefined): boolean {
  const bundle = staticBundleForPathway(pathwayId);
  return bundle.length > 0;
}
