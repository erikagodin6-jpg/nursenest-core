import "server-only";

import { Suspense } from "react";
import HomeRestoredClient from "@/components/marketing/home-restored-client";
import { getDegradedPublicHomeStatsFallback } from "@/lib/marketing/public-home-stats-payload";
import { getHomepagePublicHomeStatsSyncInitial } from "@/lib/marketing/public-home-stats-memory";
import { homePerfFinalForGetRoot, homePerfLogForGetRoot } from "@/lib/observability/home-perf-trace";
import { layoutStderrTrace } from "@/lib/observability/layout-stderr-trace";

function homeMarketingStatsFromPayload(raw: {
  questionCount: number;
  registeredLearners: number;
  totalLessons: number;
}) {
  return {
    questionCount: raw.questionCount,
    registeredLearners: raw.registeredLearners,
    totalLessons: raw.totalLessons,
  };
}

async function HomeRestoredAfterStatsLoad({
  publishedGlobalRegionCardIds,
}: {
  publishedGlobalRegionCardIds: readonly string[];
}) {
  const perfStatsT0 = Date.now();
  await homePerfLogForGetRoot("home.server.deferred_stats_start", perfStatsT0);
  try {
    const { getHomepagePublicHomeStats } = await import("@/lib/marketing/public-home-stats");
    const homeStatsRaw = await getHomepagePublicHomeStats();
    await homePerfLogForGetRoot("home.server.deferred_stats_finish", perfStatsT0, {
      stats_degraded: Boolean(homeStatsRaw.degraded),
    });
    layoutStderrTrace("marketing_home", "home stats deferred segment ready", {
      route: "/",
      degraded: Boolean(homeStatsRaw.degraded),
    });
    await homePerfFinalForGetRoot("success", { stats_path: "deferred" });
    return (
      <HomeRestoredClient
        homeMarketingStats={homeMarketingStatsFromPayload(homeStatsRaw)}
        publishedGlobalRegionCardIds={publishedGlobalRegionCardIds}
      />
    );
  } catch (e) {
    await homePerfFinalForGetRoot("failure", { error_phase: "deferred_stats", stats_path: "deferred" });
    throw e;
  }
}

/**
 * Homepage body: stats resolve after the shell — initial paint uses memory snapshot or silent
 * degraded placeholders, then the same subtree replaces once `getHomepagePublicHomeStats` finishes.
 */
export async function HomeRestoredWithDeferredStats({
  skipOptionalDbReads,
  publishedGlobalRegionCardIds,
}: {
  skipOptionalDbReads: boolean;
  publishedGlobalRegionCardIds: readonly string[];
}) {
  if (skipOptionalDbReads) {
    const perfSkipT0 = Date.now();
    await homePerfLogForGetRoot("home.server.deferred_stats_skipped", perfSkipT0);
    const homeStatsRaw = getDegradedPublicHomeStatsFallback("production_request_optional_db_skipped");
    await homePerfFinalForGetRoot("success", { stats_path: "skipped_optional_db" });
    return (
      <HomeRestoredClient
        homeMarketingStats={homeMarketingStatsFromPayload(homeStatsRaw)}
        publishedGlobalRegionCardIds={publishedGlobalRegionCardIds}
      />
    );
  }

  const initial = getHomepagePublicHomeStatsSyncInitial();
  return (
    <Suspense
      fallback={
        <HomeRestoredClient
          homeMarketingStats={homeMarketingStatsFromPayload(initial)}
          publishedGlobalRegionCardIds={publishedGlobalRegionCardIds}
        />
      }
    >
      <HomeRestoredAfterStatsLoad publishedGlobalRegionCardIds={publishedGlobalRegionCardIds} />
    </Suspense>
  );
}
