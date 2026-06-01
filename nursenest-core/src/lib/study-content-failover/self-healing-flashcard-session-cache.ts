import "server-only";

import type { BuildFlashcardCustomSessionSuccess } from "@/lib/flashcards/build-flashcard-custom-session";
import {
  getFlashcardRecoverySession,
  setFlashcardRecoverySession,
  incrementReliabilityCounter,
} from "@/lib/server/content-cache";

// ─── In-process L1 cache (TTL 15 min) ────────────────────────────────────────
// Survives within a single server process. On in-process miss, the Redis L2 layer
// below is consulted so sessions survive deployments, restarts, and instance scale-out.
const CACHE_TTL_MS = 15 * 60 * 1000;
const CACHE_MAX = 500;

type CacheEntry = { value: BuildFlashcardCustomSessionSuccess; expiresAt: number };
const sessionCache = new Map<string, CacheEntry>();

// ─── Recovery metrics ───────────────────────────────────────────────────────
const recoveryCounters = {
  tier_a_precheck_hit: 0,
  tier_a_fallback_hit: 0,
  tier_b_primary_success: 0,
  tier_c_catalog_hit: 0,
  tier_d_error: 0,
};

export function recordRecoveryEvent(
  tier: keyof typeof recoveryCounters,
): void {
  recoveryCounters[tier] += 1;
}

export function getRecoveryMetrics(): typeof recoveryCounters {
  return { ...recoveryCounters };
}

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
  userPrefix?: string;
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
    params.userPrefix ?? "shared",
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

/**
 * Read a session from the two-layer cache (L1 in-process + L2 Redis).
 *
 * Layer resolution:
 *  1. In-process Map (< 1 ms) — expires at CACHE_TTL_MS
 *  2. Redis (< 10 ms) — same 15-min TTL, survives deployments
 *     On L2 hit: populate L1 so subsequent calls within the same process are instant.
 */
export async function getSelfHealingSessionCache(
  key: string,
): Promise<BuildFlashcardCustomSessionSuccess | null> {
  const now = Date.now();
  pruneExpired(now);

  // L1 — in-process
  const entry = sessionCache.get(key);
  if (entry && entry.expiresAt > now) return entry.value;

  // L2 — Redis (graceful no-op when Redis is not configured)
  try {
    const redisValue = await getFlashcardRecoverySession<BuildFlashcardCustomSessionSuccess>(key);
    if (redisValue && redisValue.ok && redisValue.summary.returnedCards > 0) {
      // Warm L1 so the next call within this process is instant
      sessionCache.set(key, { value: redisValue, expiresAt: now + CACHE_TTL_MS });
      return redisValue;
    }
  } catch {
    // Redis failure must never block session delivery
  }

  return null;
}

/**
 * Write a session to both cache layers (L1 in-process + L2 Redis fire-and-forget).
 */
export function setSelfHealingSessionCache(
  key: string,
  value: BuildFlashcardCustomSessionSuccess,
): void {
  const now = Date.now();
  pruneExpired(now);
  sessionCache.set(key, { value, expiresAt: now + CACHE_TTL_MS });
  // L2 — Redis, fire-and-forget so write latency never blocks the response
  void setFlashcardRecoverySession(key, value);
}

/**
 * Increment the per-surface reliability counter in Redis for dashboard aggregation.
 * Wraps `incrementReliabilityCounter` from content-cache — co-located here so callers
 * only need to import from this module.
 */
export async function recordFlashcardReliabilityCounter(
  tier: "tier_a" | "tier_b" | "tier_c" | "tier_d_error",
): Promise<void> {
  void incrementReliabilityCounter("flashcard", tier);
}
