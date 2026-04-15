import "server-only";
import {
  getCachedPublicHomeStats,
  getDegradedPublicHomeStatsFallback,
  type PublicHomeStatsPayload,
} from "@/lib/marketing/public-home-stats";
import { safeServerLog } from "@/lib/observability/safe-server-log";

/**
 * Server-only stats for the learner shell paywall — **no client fetch**.
 * Uses the same `unstable_cache` as `/api/public/home-stats` and the marketing homepage (`PUBLIC_HOME_STATS_CACHE_REVALIDATE_SEC`).
 */
export async function loadPaywallHomeStatsForShell(): Promise<PublicHomeStatsPayload> {
  try {
    return await getCachedPublicHomeStats();
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    safeServerLog("learner_shell", "paywall_home_stats_load_failed", { message: msg.slice(0, 200) });
    return getDegradedPublicHomeStatsFallback("learner_shell", { silent: true });
  }
}
