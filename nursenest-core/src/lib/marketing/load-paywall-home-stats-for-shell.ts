import "server-only";
import {
  getDegradedPublicHomeStatsFallback,
  type PublicHomeStatsPayload,
} from "@/lib/marketing/public-home-stats-payload";
import { safeServerLog } from "@/lib/observability/safe-server-log";

/** Caps wait so marketing cache work cannot block the learner shell under DB/cache pressure. */
const PAYWALL_STATS_SHELL_TIMEOUT_MS = 2500;

/**
 * Server-only stats for the learner shell paywall — **no client fetch**.
 * Uses the same `unstable_cache` as `/api/public/home-stats` and the marketing homepage (`PUBLIC_HOME_STATS_CACHE_REVALIDATE_SEC`).
 */
export async function loadPaywallHomeStatsForShell(): Promise<PublicHomeStatsPayload> {
  try {
    const { getCachedPublicHomeStats } = await import("@/lib/marketing/public-home-stats");
    return await Promise.race([
      getCachedPublicHomeStats(),
      new Promise<PublicHomeStatsPayload>((_, reject) => {
        setTimeout(() => reject(new Error("paywall_home_stats_timeout")), PAYWALL_STATS_SHELL_TIMEOUT_MS);
      }),
    ]);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    safeServerLog("learner_shell", "paywall_home_stats_load_failed", { message: msg.slice(0, 200) });
    return getDegradedPublicHomeStatsFallback("learner_shell", { silent: true });
  }
}
