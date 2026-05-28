/**
 * Content cache — typed Redis wrappers for learner content (lessons, flashcards, CAT pools).
 *
 * Requires: UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN (Railway Upstash / managed Redis).
 *
 * Gracefully no-ops when Redis is not configured — the caller always gets null on a miss
 * and skips the set, so primary DB path is unaffected.
 *
 * TTLs:
 *   lesson        60 min  — content changes infrequently; publish invalidates
 *   flashcard     60 min  — same cadence as lessons
 *   practice pool 30 min  — question IDs; may change after publish
 *   cat pool      30 min  — adaptive pool metadata
 *   entitlement   60 s    — already handled in entitlements.ts; here for API-layer cache
 *
 * Keys:
 *   content:lesson:{lessonId}:{locale}
 *   content:flashcard:deck:{deckId}
 *   content:flashcard:bank:{userId}:{tier}              — adaptive next-cards pool
 *   content:practice:pool:{userId}:{pathwayId}:{mode}
 *   content:cat:pool:{userId}:{pathwayId}
 */
import "server-only";
import { getRedisClient } from "@/lib/server/redis";

const TTL = {
  lesson:     60 * 60,       // 60 minutes
  flashcard:  60 * 60,       // 60 minutes
  practice:   30 * 60,       // 30 minutes
  cat:        30 * 60,       // 30 minutes
  count:      5  * 60,       // 5 minutes (for count-only queries)
} as const;

type CacheNamespace = keyof typeof TTL;

function key(ns: CacheNamespace, ...parts: string[]): string {
  const safe = parts.map((p) => p.replace(/[^a-zA-Z0-9_:.-]/g, "_")).join(":");
  return `content:${ns}:${safe}`;
}

// ─── Generic get/set ─────────────────────────────────────────────────────────

export async function cacheGet<T>(cacheKey: string): Promise<T | null> {
  const r = getRedisClient();
  if (!r) return null;
  try {
    return await r.get<T>(cacheKey);
  } catch {
    return null;
  }
}

export async function cacheSet<T>(
  cacheKey: string,
  value: T,
  ttlSeconds: number,
): Promise<void> {
  const r = getRedisClient();
  if (!r) return;
  try {
    await r.set(cacheKey, value, { ex: ttlSeconds });
  } catch {
    // Never throw on cache write failure
  }
}

export async function cacheDelete(cacheKey: string): Promise<void> {
  const r = getRedisClient();
  if (!r) return;
  try {
    await r.del(cacheKey);
  } catch {}
}

// ─── Lesson cache ─────────────────────────────────────────────────────────────

export function lessonCacheKey(lessonId: string, locale = "en"): string {
  return key("lesson", lessonId, locale);
}

export async function getLesson<T>(lessonId: string, locale = "en"): Promise<T | null> {
  return cacheGet<T>(lessonCacheKey(lessonId, locale));
}

export async function setLesson<T>(lessonId: string, locale: string, value: T): Promise<void> {
  return cacheSet(lessonCacheKey(lessonId, locale), value, TTL.lesson);
}

export async function invalidateLesson(lessonId: string): Promise<void> {
  // Invalidate all locales by pattern prefix — Upstash REST doesn't support SCAN,
  // so we invalidate known locales explicitly.
  const locales = ["en", "fr", "es", "hi", "tl", "pt", "ar", "de", "it", "ja", "ko", "zh", "ru"];
  await Promise.allSettled(locales.map((l) => cacheDelete(lessonCacheKey(lessonId, l))));
}

// ─── Flashcard deck cache ─────────────────────────────────────────────────────

export function flashcardDeckCacheKey(deckId: string): string {
  return key("flashcard", "deck", deckId);
}

export async function getFlashcardDeck<T>(deckId: string): Promise<T | null> {
  return cacheGet<T>(flashcardDeckCacheKey(deckId));
}

export async function setFlashcardDeck<T>(deckId: string, value: T): Promise<void> {
  return cacheSet(flashcardDeckCacheKey(deckId), value, TTL.flashcard);
}

// ─── Adaptive flashcard pool cache ───────────────────────────────────────────
// Keyed by userId+tier so each user gets their own pool window.

export function flashcardBankCacheKey(userId: string, tier: string): string {
  return key("flashcard", "bank", userId, tier);
}

export async function getFlashcardBank<T>(userId: string, tier: string): Promise<T | null> {
  return cacheGet<T>(flashcardBankCacheKey(userId, tier));
}

export async function setFlashcardBank<T>(userId: string, tier: string, value: T): Promise<void> {
  return cacheSet(flashcardBankCacheKey(userId, tier), value, TTL.flashcard);
}

// ─── Practice test pool cache ─────────────────────────────────────────────────

export function practiceCacheKey(userId: string, pathwayId: string, selectionMode: string): string {
  return key("practice", "pool", userId, pathwayId, selectionMode);
}

export async function getPracticePool<T>(
  userId: string,
  pathwayId: string,
  selectionMode: string,
): Promise<T | null> {
  return cacheGet<T>(practiceCacheKey(userId, pathwayId, selectionMode));
}

export async function setPracticePool<T>(
  userId: string,
  pathwayId: string,
  selectionMode: string,
  value: T,
): Promise<void> {
  return cacheSet(practiceCacheKey(userId, pathwayId, selectionMode), value, TTL.practice);
}

// ─── CAT pool cache ──────────────────────────────────────────────────────────

export function catPoolCacheKey(userId: string, pathwayId: string): string {
  return key("cat", "pool", userId, pathwayId);
}

export async function getCatPool<T>(userId: string, pathwayId: string): Promise<T | null> {
  return cacheGet<T>(catPoolCacheKey(userId, pathwayId));
}

export async function setCatPool<T>(userId: string, pathwayId: string, value: T): Promise<void> {
  return cacheSet(catPoolCacheKey(userId, pathwayId), value, TTL.cat);
}

// ─── Content publish invalidation ────────────────────────────────────────────

/**
 * Call when a lesson, flashcard, or question is published/updated.
 * Clears the relevant cache keys so the next request reads fresh data.
 */
export async function invalidateOnPublish(opts: {
  lessonId?: string;
  deckId?: string;
}): Promise<void> {
  const ops: Promise<void>[] = [];
  if (opts.lessonId) ops.push(invalidateLesson(opts.lessonId));
  if (opts.deckId) ops.push(cacheDelete(flashcardDeckCacheKey(opts.deckId)));
  await Promise.allSettled(ops);
}
