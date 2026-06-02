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
  practice:   60 * 60,       // 60 minutes (question ID pools; stable between publishes)
  cat:        30 * 60,       // 30 minutes
  count:      10 * 60,       // 10 minutes (for count-only queries: due-summary, study-queue counts)
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

// ─── Flashcard hub inventory snapshot ────────────────────────────────────────
// Precomputed category counts + totals keyed by (pathway, tier, country).
// User-independent: flashcard content and exam question metadata are shared
// across all subscribers with the same entitlement profile.
// TTL: 30 min (same cadence as practice pool).

export type FlashcardHubInventorySnapshot = {
  mergedCounts: Record<string, number>;
  examTotal: number;
  lessonVirtualTotal: number;
  catalogLessonCount: number;
  lessonsWithDerivedCards: number;
  recallVirtualCount: number;
  sectionDerivedVirtualCount: number;
  genericFillerSectionCardHits: number;
  poolInventoryDiagnostics: unknown;
};

export function flashcardHubInventoryCacheKey(
  pathwayId: string,
  tier: string,
  country: string,
): string {
  return key("flashcard", "hub-inv", pathwayId, tier || "_", country || "_");
}

export async function getFlashcardHubInventory(
  pathwayId: string,
  tier: string,
  country: string,
): Promise<FlashcardHubInventorySnapshot | null> {
  return cacheGet<FlashcardHubInventorySnapshot>(
    flashcardHubInventoryCacheKey(pathwayId, tier, country),
  );
}

export async function setFlashcardHubInventory(
  pathwayId: string,
  tier: string,
  country: string,
  value: FlashcardHubInventorySnapshot,
): Promise<void> {
  return cacheSet(
    flashcardHubInventoryCacheKey(pathwayId, tier, country),
    value,
    TTL.cat,
  );
}

// ─── CAT readiness summary cache ─────────────────────────────────────────────
// Caches the pass/fail result of assessCatPracticeReadinessForPathway so the
// expensive batch pool scan is not repeated on every session-create attempt.
// Keyed by (userId, pathwayId) because readiness depends on user entitlement.
// TTL: 10 min — short enough that entitlement changes land promptly.

export type CatReadinessSummaryCache = {
  ok: boolean;
  code?: string;
  message?: string;
  availableQuestions?: number;
  requiredQuestions?: number;
  eligibleCatQuestions?: number;
  completePracticeQuestions?: number;
};

export function catReadinessCacheKey(userId: string, pathwayId: string): string {
  return key("cat", "readiness", userId, pathwayId);
}

export async function getCatReadiness(
  userId: string,
  pathwayId: string,
): Promise<CatReadinessSummaryCache | null> {
  return cacheGet<CatReadinessSummaryCache>(catReadinessCacheKey(userId, pathwayId));
}

export async function setCatReadiness(
  userId: string,
  pathwayId: string,
  value: CatReadinessSummaryCache,
): Promise<void> {
  return cacheSet(catReadinessCacheKey(userId, pathwayId), value, 10 * 60);
}

export async function invalidateCatReadiness(userId: string, pathwayId: string): Promise<void> {
  return cacheDelete(catReadinessCacheKey(userId, pathwayId));
}

// ─── Flashcard due-summary cache ─────────────────────────────────────────────
// Per-user SRS queue snapshot: due/overdue/learning/lapsing counts.
// TTL: 5 min — short enough that study activity lands promptly.

export type FlashcardDueSummaryCache = {
  dueToday: number;
  overdue: number;
  learning: number;
  lapsingCards: number;
  newCards: number;
  totalReviewed: number;
  asOf: string;
};

export function flashcardDueSummaryCacheKey(userId: string): string {
  return key("count", "flashcard-due-summary", userId);
}

export async function getFlashcardDueSummary(userId: string): Promise<FlashcardDueSummaryCache | null> {
  return cacheGet<FlashcardDueSummaryCache>(flashcardDueSummaryCacheKey(userId));
}

export async function setFlashcardDueSummary(userId: string, value: FlashcardDueSummaryCache): Promise<void> {
  return cacheSet(flashcardDueSummaryCacheKey(userId), value, TTL.count);
}

export async function invalidateFlashcardDueSummary(userId: string): Promise<void> {
  return cacheDelete(flashcardDueSummaryCacheKey(userId));
}

// ─── Study queue counts cache ─────────────────────────────────────────────────
// Per-user+pathway SRS segment counts.
// TTL: 5 min.

export type StudyQueueCountsCache = {
  newCards: number;
  dueToday: number;
  overdue: number;
  lapsing: number;
  totalReviewed: number;
};

export function studyQueueCountsCacheKey(userId: string, pathwayId: string | null | undefined): string {
  return key("count", "study-queue-counts", userId, pathwayId ?? "_");
}

export async function getStudyQueueCounts(
  userId: string,
  pathwayId: string | null | undefined,
): Promise<StudyQueueCountsCache | null> {
  return cacheGet<StudyQueueCountsCache>(studyQueueCountsCacheKey(userId, pathwayId));
}

export async function setStudyQueueCounts(
  userId: string,
  pathwayId: string | null | undefined,
  value: StudyQueueCountsCache,
): Promise<void> {
  return cacheSet(studyQueueCountsCacheKey(userId, pathwayId), value, TTL.count);
}

export async function invalidateStudyQueueCounts(
  userId: string,
  pathwayId: string | null | undefined,
): Promise<void> {
  return cacheDelete(studyQueueCountsCacheKey(userId, pathwayId));
}

// ─── Weak-area flashcard inventory cache (Phase 3D) ─────────────────────────
// Precomputed weak and incorrect card IDs per user+pathway.
// Background-refreshed every 15 minutes; short enough that one study event
// lands within the next session window, long enough to skip the full
// flashcard.findMany + flashcardProgress.findMany round trip on cache hit.

export type WeakFlashcardInventoryCache = {
  weakCardIds: string[];
  incorrectCardIds: string[];
  pathwayId: string;
  cachedAtMs: number;
};

const WEAK_INVENTORY_TTL_SECONDS = 15 * 60; // 15 minutes

export function weakInventoryCacheKey(userId: string, pathwayId: string): string {
  return key("count", "weak-inv", userId, pathwayId);
}

export async function getWeakInventory(
  userId: string,
  pathwayId: string,
): Promise<WeakFlashcardInventoryCache | null> {
  return cacheGet<WeakFlashcardInventoryCache>(weakInventoryCacheKey(userId, pathwayId));
}

export async function setWeakInventory(
  userId: string,
  pathwayId: string,
  value: WeakFlashcardInventoryCache,
): Promise<void> {
  return cacheSet(weakInventoryCacheKey(userId, pathwayId), value, WEAK_INVENTORY_TTL_SECONDS);
}

export async function invalidateWeakInventory(userId: string, pathwayId: string): Promise<void> {
  return cacheDelete(weakInventoryCacheKey(userId, pathwayId));
}

// ─── Session card-ID cache (Phase 3E) ─────────────────────────────────────
// Resolved card ID list for standard (non-progress-filtered) sessions.
// Key encodes pathway + categories + sourceKind; user-specific so wrong IDs
// cannot leak across users. TTL 10 min — content changes on publish (admin
// fires revalidation); within a session the card pool is stable.

export type SessionCardIdCache = {
  cardIds: string[];
  pathwayId: string | null;
  cachedAtMs: number;
};

const SESSION_CARD_ID_TTL_SECONDS = 10 * 60; // 10 minutes

export function sessionCardIdCacheKey(
  userId: string,
  pathwayId: string | null,
  selectedCategories: readonly string[],
  sourceKind: string,
): string {
  const cats = [...selectedCategories].sort().join(",");
  return key("count", "session-ids", userId, pathwayId ?? "_", sourceKind, cats || "_");
}

export async function getSessionCardIds(
  userId: string,
  pathwayId: string | null,
  selectedCategories: readonly string[],
  sourceKind: string,
): Promise<SessionCardIdCache | null> {
  return cacheGet<SessionCardIdCache>(
    sessionCardIdCacheKey(userId, pathwayId, selectedCategories, sourceKind),
  );
}

export async function setSessionCardIds(
  userId: string,
  pathwayId: string | null,
  selectedCategories: readonly string[],
  sourceKind: string,
  value: SessionCardIdCache,
): Promise<void> {
  return cacheSet(
    sessionCardIdCacheKey(userId, pathwayId, selectedCategories, sourceKind),
    value,
    SESSION_CARD_ID_TTL_SECONDS,
  );
}

export async function invalidateSessionCardIds(
  userId: string,
  pathwayId: string | null,
): Promise<void> {
  // Invalidate all category variants by deleting the wildcard prefix pattern.
  // Upstash REST supports DEL by key only, not SCAN+DEL. We accept that category-specific
  // caches survive until TTL expiry (10 min max) — not a correctness issue, only stale
  // category counts which the hub UI already tolerates via Redis hub-inventory TTL.
  return cacheDelete(key("count", "session-ids", userId, pathwayId ?? "_", "_", "_"));
}

// ─── Flashcard self-healing session recovery ──────────────────────────────────
// Persists full serialised sessions across deployments, instance restarts, and
// scale-out events. The in-process Map in self-healing-flashcard-session-cache.ts
// acts as L1; this Redis layer acts as L2 (survives across process boundaries).
//
// TTL: 15 minutes — matches the in-process TTL so both caches expire together.
// Key: "content:flashcard:recovery-session:{sanitised-self-healing-key}"
// Max value size: ~40 cards × 2 KB = ~80 KB — well within Upstash 512 KB limit.
const FLASHCARD_SESSION_RECOVERY_TTL_SECONDS = 15 * 60;

export function flashcardSessionRecoveryCacheKey(sessionKey: string): string {
  return key("flashcard", "recovery-session", sessionKey);
}

export async function getFlashcardRecoverySession<T>(sessionKey: string): Promise<T | null> {
  return cacheGet<T>(flashcardSessionRecoveryCacheKey(sessionKey));
}

export async function setFlashcardRecoverySession<T>(sessionKey: string, value: T): Promise<void> {
  return cacheSet(flashcardSessionRecoveryCacheKey(sessionKey), value, FLASHCARD_SESSION_RECOVERY_TTL_SECONDS);
}

// ─── Practice test session recovery ──────────────────────────────────────────
// Caches the question ID set chosen by pickPracticeQuestionIds / createCatPracticeTestPayload.
// On cache hit, the expensive selection logic is skipped; the cached IDs are used to
// create a new DB session or recover from selection failure.
// TTL: 20 minutes — long enough to cover a deployment window; short enough to avoid
// serving stale question pools when content is published.

const PRACTICE_SESSION_RECOVERY_TTL_SECONDS = 20 * 60;

export function practiceSessionRecoveryCacheKey(
  userId: string,
  pathwayId: string | null,
  selectionMode: string,
): string {
  return key("practice", "recovery-session", userId, pathwayId ?? "_", selectionMode);
}

export async function getPracticeSessionRecovery<T>(
  userId: string,
  pathwayId: string | null,
  selectionMode: string,
): Promise<T | null> {
  return cacheGet<T>(practiceSessionRecoveryCacheKey(userId, pathwayId, selectionMode));
}

export async function setPracticeSessionRecovery<T>(
  userId: string,
  pathwayId: string | null,
  selectionMode: string,
  value: T,
): Promise<void> {
  return cacheSet(
    practiceSessionRecoveryCacheKey(userId, pathwayId, selectionMode),
    value,
    PRACTICE_SESSION_RECOVERY_TTL_SECONDS,
  );
}

// ─── Lesson manifest recovery ─────────────────────────────────────────────────
// Caches the full rendered lesson payload (sections, metadata, access gate result)
// for the subscriber lesson detail page. On Redis hit, skips the DB join entirely.
// TTL: 60 minutes — invalidated on admin publish via invalidateLesson().
// Note: invalidateLesson() already exists; this key uses the same lessonId so
// both the content cache and manifest cache are invalidated together on publish.

const LESSON_MANIFEST_RECOVERY_TTL_SECONDS = 60 * 60;

export function lessonManifestRecoveryCacheKey(lessonId: string): string {
  return key("lesson", "manifest", lessonId);
}

export async function getLessonManifest<T>(lessonId: string): Promise<T | null> {
  return cacheGet<T>(lessonManifestRecoveryCacheKey(lessonId));
}

export async function setLessonManifest<T>(lessonId: string, value: T): Promise<void> {
  return cacheSet(lessonManifestRecoveryCacheKey(lessonId), value, LESSON_MANIFEST_RECOVERY_TTL_SECONDS);
}

export async function invalidateLessonManifest(lessonId: string): Promise<void> {
  return cacheDelete(lessonManifestRecoveryCacheKey(lessonId));
}

// ─── Reliability counters ─────────────────────────────────────────────────────
// Redis INCR counters for recovery tier tracking. Used by the admin reliability dashboard.
// Keys use daily buckets so historical data is preserved for 7d.
// Key format: "reliability:{surface}:{tier}:{YYYY-MM-DD}"

export type ReliabilitySurface = "flashcard" | "practice" | "lesson";
export type ReliabilityTier = "tier_a" | "tier_b" | "tier_c" | "tier_d_error";

function reliabilityCounterKey(
  surface: ReliabilitySurface,
  tier: ReliabilityTier,
  date: string,
): string {
  return `reliability:${surface}:${tier}:${date}`;
}

function todayDateKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function incrementReliabilityCounter(
  surface: ReliabilitySurface,
  tier: ReliabilityTier,
): Promise<void> {
  const r = getRedisClient();
  if (!r) return;
  try {
    const k = reliabilityCounterKey(surface, tier, todayDateKey());
    await r.incr(k);
    // 8-day TTL — keep one full week + buffer for the dashboard
    await r.expire(k, 8 * 24 * 60 * 60);
  } catch {
    // Never throw on counter failure
  }
}

export async function getReliabilityCounters(
  surface: ReliabilitySurface,
  daysBack: number = 7,
): Promise<Record<string, Record<ReliabilityTier, number>>> {
  const r = getRedisClient();
  if (!r) return {};
  const tiers: ReliabilityTier[] = ["tier_a", "tier_b", "tier_c", "tier_d_error"];
  const result: Record<string, Record<ReliabilityTier, number>> = {};
  const dates: string[] = [];
  for (let i = 0; i < daysBack; i++) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - i);
    dates.push(d.toISOString().slice(0, 10));
  }
  await Promise.all(
    dates.map(async (date) => {
      const dayResult: Partial<Record<ReliabilityTier, number>> = {};
      await Promise.all(
        tiers.map(async (tier) => {
          try {
            const raw = await r.get<number>(reliabilityCounterKey(surface, tier, date));
            dayResult[tier] = typeof raw === "number" ? raw : 0;
          } catch {
            dayResult[tier] = 0;
          }
        }),
      );
      result[date] = dayResult as Record<ReliabilityTier, number>;
    }),
  );
  return result;
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
  if (opts.lessonId) {
    ops.push(invalidateLesson(opts.lessonId));
    ops.push(invalidateLessonManifest(opts.lessonId));
  }
  if (opts.deckId) ops.push(cacheDelete(flashcardDeckCacheKey(opts.deckId)));
  await Promise.allSettled(ops);
}
