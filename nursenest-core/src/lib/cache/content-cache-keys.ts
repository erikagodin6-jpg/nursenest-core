/**
 * Canonical Redis content cache key builders.
 *
 * All keys are prefixed `nn:` to avoid collision with rate-limit keys (`rl:…`).
 */

export const CACHE_TTL = {
  FLASHCARD_LIST: 300,      // 5 min — high traffic, low churn
  LESSON_HUB: 600,          // 10 min — published content, low churn
  PRACTICE_POOL: 900,       // 15 min — stable question pools
  CAT_SESSION: 1800,        // 30 min — in-flight exam progress
  CAT_POOL: 3600,           // 1 hr  — resilience pool (nightly refresh)
} as const;

export function flashcardListKey(
  tier: string,
  country: string,
  locale: string,
  page: number,
  pageSize: number,
): string {
  return `nn:fc:list:${tier}:${country}:${locale}:p${page}:s${pageSize}`;
}

export function lessonHubKey(pathwayId: string, locale: string): string {
  return `nn:lesson:hub:${pathwayId}:${locale}`;
}

export function practicePoolKey(pathway: string, topic: string): string {
  return `nn:practice:pool:${pathway}:${topic}`;
}

export function catSessionKey(sessionId: string): string {
  return `nn:cat:session:${sessionId}`;
}

export function catResiliencePoolKey(poolId: string): string {
  return `nn:cat:pool:${poolId}`;
}
