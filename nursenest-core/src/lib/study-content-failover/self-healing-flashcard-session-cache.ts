import "server-only";

import type { BuildFlashcardCustomSessionSuccess } from "@/lib/flashcards/build-flashcard-custom-session";

const CACHE_TTL_MS = 3 * 60 * 1000;
const CACHE_MAX = 500;

type CacheEntry = { value: BuildFlashcardCustomSessionSuccess; expiresAt: number };
const sessionCache = new Map<string, CacheEntry>();

function pruneExpired(now: number): void {
  for (const [k, entry] of sessionCache) {
    if (entry.expiresAt <= now) sessionCache.delete(k);
  }
  while (sessionCache.size > CACHE_MAX) {
    const oldest = sessionCache.keys().next().value;
    if (oldest) sessionCache.delete(oldest);
  }
}

export function buildSelfHealingCacheKey(params: {
  pathwayId: string | null;
  lessonId: string | null;
  tier: string;
  country: string;
  selectedCategories: string[];
  sourceKind: string;
  mode: string;
  limit: number;
  weakOnly: boolean;
  incorrectOnly: boolean;
  starredOnly: boolean;
  savedOnly: boolean;
  notesOnly: boolean;
  revisitOnly: boolean;
  notStudiedOnly: boolean;
  recentStudiedOnly: boolean;
}): string {
  const cats = [...params.selectedCategories].sort().join(",");
  const filters = [
    params.weakOnly ? "w" : "",
    params.incorrectOnly ? "i" : "",
    params.starredOnly ? "s" : "",
    params.savedOnly ? "sv" : "",
    params.notesOnly ? "n" : "",
    params.revisitOnly ? "rv" : "",
    params.notStudiedOnly ? "ns" : "",
    params.recentStudiedOnly ? "rs" : "",
  ]
    .filter(Boolean)
    .join("+");
  return [
    params.pathwayId ?? "nil",
    params.lessonId ?? "nil",
    params.tier,
    params.country,
    cats || "all",
    params.sourceKind,
    params.mode,
    String(params.limit),
    filters || "none",
  ].join("|");
}

export function getSelfHealingSessionCache(
  key: string,
): BuildFlashcardCustomSessionSuccess | null {
  const now = Date.now();
  const entry = sessionCache.get(key);
  if (!entry || entry.expiresAt <= now) return null;
  return entry.value;
}

export function setSelfHealingSessionCache(
  key: string,
  value: BuildFlashcardCustomSessionSuccess,
): void {
  const now = Date.now();
  pruneExpired(now);
  sessionCache.set(key, { value, expiresAt: now + CACHE_TTL_MS });
}
