import "server-only";

import { Suspense, type ReactNode } from "react";
import HomeRestoredClient from "@/components/marketing/home-restored-client";
import {
  getDegradedPublicHomeStatsFallback,
  type PublicHomeStatsPayload,
} from "@/lib/marketing/public-home-stats-payload";
import { getHomepagePublicHomeStatsSyncInitial } from "@/lib/marketing/public-home-stats-memory";

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

function getSafeInitial(): PublicHomeStatsPayload {
  try {
    return getHomepagePublicHomeStatsSyncInitial();
  } catch (e) {
    console.error("Initial stats failed:", e);
    return getDegradedPublicHomeStatsFallback("initial_failed");
  }
}

async function getStatsSafe(): Promise<PublicHomeStatsPayload> {
  try {
    const mod = await import("@/lib/marketing/public-home-stats");

    if (!mod?.getHomepagePublicHomeStats) {
      throw new Error("Stats module missing function");
    }

    return await mod.getHomepagePublicHomeStats();
  } catch (e) {
    console.error("Deferred stats failed:", e);
    return getDegradedPublicHomeStatsFallback("deferred_failed");
  }
}

async function HomeDeferred({
  publishedGlobalRegionCardIds,
  introAfterHero,
}: {
  publishedGlobalRegionCardIds: readonly string[];
  introAfterHero?: ReactNode;
}) {
  const stats = await getStatsSafe();

  return (
    <HomeRestoredClient
      homeMarketingStats={homeMarketingStatsFromPayload(stats)}
      publishedGlobalRegionCardIds={publishedGlobalRegionCardIds}
      introAfterHero={introAfterHero}
    />
  );
}

export function HomeRestoredWithDeferredStats({
  skipOptionalDbReads,
  publishedGlobalRegionCardIds,
  introAfterHero,
}: {
  skipOptionalDbReads: boolean;
  publishedGlobalRegionCardIds: readonly string[];
  introAfterHero?: ReactNode;
}) {
  if (skipOptionalDbReads) {
    const stats = getDegradedPublicHomeStatsFallback("db_skipped");
    return (
      <HomeRestoredClient
        homeMarketingStats={homeMarketingStatsFromPayload(stats)}
        publishedGlobalRegionCardIds={publishedGlobalRegionCardIds}
        introAfterHero={introAfterHero}
      />
    );
  }

  const initial = getSafeInitial();

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
      <HomeDeferred
        publishedGlobalRegionCardIds={publishedGlobalRegionCardIds}
        introAfterHero={introAfterHero}
      />
    </Suspense>
  );
}
