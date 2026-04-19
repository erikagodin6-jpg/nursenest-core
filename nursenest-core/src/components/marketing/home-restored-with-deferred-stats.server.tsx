import "server-only";

import { Suspense } from "react";
import HomeRestoredClient from "@/components/marketing/home-restored-client";
import { getDegradedPublicHomeStatsFallback } from "@/lib/marketing/public-home-stats-payload";
import { getHomepagePublicHomeStatsSyncInitial } from "@/lib/marketing/public-home-stats-memory";
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
  const { getHomepagePublicHomeStats } = await import("@/lib/marketing/public-home-stats");
  const homeStatsRaw = await getHomepagePublicHomeStats();
  layoutStderrTrace("marketing_home", "home stats deferred segment ready", {
    route: "/",
    degraded: Boolean(homeStatsRaw.degraded),
  });
  return (
    <HomeRestoredClient
      homeMarketingStats={homeMarketingStatsFromPayload(homeStatsRaw)}
      publishedGlobalRegionCardIds={publishedGlobalRegionCardIds}
    />
  );
}

/**
 * Homepage body: stats resolve after the shell — initial paint uses memory snapshot or silent
 * degraded placeholders, then the same subtree replaces once `getHomepagePublicHomeStats` finishes.
 */
export function HomeRestoredWithDeferredStats({
  skipOptionalDbReads,
  publishedGlobalRegionCardIds,
}: {
  skipOptionalDbReads: boolean;
  publishedGlobalRegionCardIds: readonly string[];
}) {
  if (skipOptionalDbReads) {
    const homeStatsRaw = getDegradedPublicHomeStatsFallback("production_request_optional_db_skipped");
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
