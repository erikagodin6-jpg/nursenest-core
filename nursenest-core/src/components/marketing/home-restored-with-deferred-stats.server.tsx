import "server-only";

import { Suspense, type ReactNode } from "react";
import HomeRestoredClient from "@/components/marketing/home-restored-client";
import {
  getDegradedPublicHomeStatsFallback,
  type PublicHomeStatsPayload,
} from "@/lib/marketing/public-home-stats-payload";
import { getHomepagePublicHomeStatsSyncInitial } from "@/lib/marketing/public-home-stats-memory";
import { homePerfFinalForGetRoot, homePerfLogForGetRoot } from "@/lib/observability/home-perf-trace";
import { layoutStderrTrace } from "@/lib/observability/layout-stderr-trace";

const DEFERRED_STATS_BUDGET_MS = 2000;

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

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error("timeout")), ms);
  });
  return Promise.race([promise, timeout]).finally(() => {
    if (timer) clearTimeout(timer);
  }) as Promise<T>;
}

function getHomepagePublicHomeStatsSyncInitialSafe(): PublicHomeStatsPayload {
  try {
    return getHomepagePublicHomeStatsSyncInitial();
  } catch {
    return getDegradedPublicHomeStatsFallback("ssr_initial_sync_error", { silent: true });
  }
}

async function HomeRestoredAfterStatsLoad({
  publishedGlobalRegionCardIds,
  introAfterHero,
}: {
  publishedGlobalRegionCardIds: readonly string[];
  introAfterHero?: ReactNode;
}) {
  const perfStatsT0 = Date.now();
  void homePerfLogForGetRoot("home.server.07_deferred_stats_start", perfStatsT0).catch(() => {});

  try {
    const { getHomepagePublicHomeStats } = await import("@/lib/marketing/public-home-stats");
    let homeStatsRaw: PublicHomeStatsPayload;
    try {
      homeStatsRaw = await withTimeout(getHomepagePublicHomeStats(), DEFERRED_STATS_BUDGET_MS);
    } catch {
      homeStatsRaw = getDegradedPublicHomeStatsFallback("deferred_stats_timeout_or_error");
    }

    void homePerfLogForGetRoot("home.server.08_deferred_stats_finish", perfStatsT0, {
      stats_degraded: Boolean(homeStatsRaw.degraded),
    }).catch(() => {});

    try {
      layoutStderrTrace("marketing_home", "home stats deferred segment ready", {
        route: "/",
        degraded: Boolean(homeStatsRaw.degraded),
      });
    } catch {
      /* stderr only */
    }

    void homePerfFinalForGetRoot("success", { stats_path: "deferred" }).catch(() => {});

    return (
      <HomeRestoredClient
        homeMarketingStats={homeMarketingStatsFromPayload(homeStatsRaw)}
        publishedGlobalRegionCardIds={publishedGlobalRegionCardIds}
        introAfterHero={introAfterHero}
      />
    );
  } catch {
    const homeStatsRaw = getDegradedPublicHomeStatsFallback("deferred_stats_fatal");
    void homePerfLogForGetRoot("home.server.08_deferred_stats_finish", perfStatsT0, {
      stats_degraded: true,
      recovered: true,
    }).catch(() => {});
    void homePerfFinalForGetRoot("success", {
      stats_path: "deferred",
      recovered: true,
      error_phase: "deferred_stats_catchall",
    }).catch(() => {});
    return (
      <HomeRestoredClient
        homeMarketingStats={homeMarketingStatsFromPayload(homeStatsRaw)}
        publishedGlobalRegionCardIds={publishedGlobalRegionCardIds}
        introAfterHero={introAfterHero}
      />
    );
  }
}

/**
 * Homepage body: stats resolve after the shell — initial paint uses memory snapshot or silent
 * degraded placeholders, then the same subtree replaces once `getHomepagePublicHomeStats` finishes.
 */
export function HomeRestoredWithDeferredStats({
  skipOptionalDbReads,
  publishedGlobalRegionCardIds,
  skipOptionalDbPerfSegmentT0,
  introAfterHero,
}: {
  skipOptionalDbReads: boolean;
  publishedGlobalRegionCardIds: readonly string[];
  /** From homepage render start — avoids `Date.now` in sync RSC (react-hooks/purity). */
  skipOptionalDbPerfSegmentT0?: number;
  introAfterHero?: ReactNode;
}) {
  if (skipOptionalDbReads) {
    void homePerfLogForGetRoot(
      "home.server.06b_stats_skipped_optional_db",
      skipOptionalDbPerfSegmentT0 ?? 0,
    ).catch(() => {});
    const homeStatsRaw = getDegradedPublicHomeStatsFallback("production_request_optional_db_skipped");
    void homePerfFinalForGetRoot("success", { stats_path: "skipped_optional_db" }).catch(() => {});
    return (
      <HomeRestoredClient
        homeMarketingStats={homeMarketingStatsFromPayload(homeStatsRaw)}
        publishedGlobalRegionCardIds={publishedGlobalRegionCardIds}
        introAfterHero={introAfterHero}
      />
    );
  }

  const initial = getHomepagePublicHomeStatsSyncInitialSafe();
  return (
    <Suspense
      fallback={
        <HomeRestoredClient
          homeMarketingStats={homeMarketingStatsFromPayload(initial)}
          publishedGlobalRegionCardIds={publishedGlobalRegionCardIds}
          introAfterHero={introAfterHero}
        />
      }
    >
      <HomeRestoredAfterStatsLoad
        publishedGlobalRegionCardIds={publishedGlobalRegionCardIds}
        introAfterHero={introAfterHero}
      />
    </Suspense>
  );
}
