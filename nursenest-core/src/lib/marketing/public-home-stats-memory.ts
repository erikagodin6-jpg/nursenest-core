import {
  getDegradedPublicHomeStatsFallback,
  type PublicHomeStatsPayload,
} from "@/lib/marketing/public-home-stats-payload";

type HomeStatsMemorySnapshot = {
  payload: PublicHomeStatsPayload;
  cachedAtMs: number;
};

type HomeStatsMemoryState = {
  snapshot?: HomeStatsMemorySnapshot;
  inflightRefresh?: Promise<void>;
  lastRefreshStartedAtMs?: number;
};

type GlobalHomeStatsState = typeof globalThis & {
  __nursenestHomeStatsMemoryState?: HomeStatsMemoryState;
};

/** Shared process-local state for homepage stats — safe to import without pulling Prisma. */
export function getHomeStatsMemoryState(): HomeStatsMemoryState {
  const globalState = globalThis as GlobalHomeStatsState;
  globalState.__nursenestHomeStatsMemoryState ??= {};
  return globalState.__nursenestHomeStatsMemoryState;
}

export function setHomeStatsMemorySnapshot(payload: PublicHomeStatsPayload, cachedAtMs = Date.now()): void {
  getHomeStatsMemoryState().snapshot = { payload, cachedAtMs };
}

/**
 * Synchronous stats for the homepage critical path — never awaits DB or `unstable_cache`.
 * Prefers in-process memory snapshot when present; otherwise silent degraded placeholders
 * until `getHomepagePublicHomeStats` resolves in a deferred server subtree.
 */
export function getHomepagePublicHomeStatsSyncInitial(): PublicHomeStatsPayload {
  const snapshot = getHomeStatsMemoryState().snapshot;
  if (snapshot) return snapshot.payload;
  return getDegradedPublicHomeStatsFallback("ssr_initial_paint_deferred", { silent: true });
}
