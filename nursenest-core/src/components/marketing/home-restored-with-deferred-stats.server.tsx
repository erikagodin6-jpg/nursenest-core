import "server-only";

import { Suspense, type ReactNode } from "react";

import HomeRestoredClient from "@/components/marketing/home-restored-client";
import {
  getDegradedPublicHomeStatsFallback,
  type PublicHomeStatsPayload,
} from "@/lib/marketing/public-home-stats-payload";
import { getHomepagePublicHomeStatsSyncInitial } from "@/lib/marketing/public-home-stats-memory";
import type { HomeMarketingStats } from "@/components/marketing/home-marketing-stats";

function safeNumber(value: unknown): number {
  return Number.isFinite(value) ? Number(value) : 0;
}

function homeMarketingStatsFromPayload(raw: Partial<PublicHomeStatsPayload> | null | undefined): HomeMarketingStats {
  return {
    questionCount: safeNumber(raw?.questionCount),
    registeredLearners: safeNumber(raw?.registeredLearners),
    totalLessons: safeNumber(raw?.totalLessons),
  };
}

function safeRegionCardIds(ids: readonly string[] | null | undefined): readonly string[] {
  return Array.isArray(ids) ? ids.filter((id) => typeof id === "string" && id.length > 0) : [];
}

function getSafeInitial(): PublicHomeStatsPayload {
  try {
    return getHomepagePublicHomeStatsSyncInitial();
  } catch (error) {
    console.error("[home-restored-with-deferred-stats] initial stats failed", error);
    return getDegradedPublicHomeStatsFallback("initial_failed");
  }
}

async function getStatsSafe(): Promise<PublicHomeStatsPayload> {
  try {
    const mod = await import("@/lib/marketing/public-home-stats");

    if (typeof mod.getHomepagePublicHomeStats !== "function") {
      throw new Error("Stats module missing getHomepagePublicHomeStats");
    }

    return await mod.getHomepagePublicHomeStats();
  } catch (error) {
    console.error("[home-restored-with-deferred-stats] deferred stats failed", error);
    return getDegradedPublicHomeStatsFallback("deferred_failed");
  }
}

async function HomeDeferred({
  publishedGlobalRegionCardIds,
  introAfterHero,
}: {
  publishedGlobalRegionCardIds?: readonly string[] | null;
  introAfterHero?: ReactNode;
}) {
  const stats = await getStatsSafe();

  return (
    <HomeRestoredClient
      homeMarketingStats={homeMarketingStatsFromPayload(stats)}
      publishedGlobalRegionCardIds={safeRegionCardIds(publishedGlobalRegionCardIds)}
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
  publishedGlobalRegionCardIds?: readonly string[] | null;
  introAfterHero?: ReactNode;
}) {
  const safeCardIds = safeRegionCardIds(publishedGlobalRegionCardIds);

  if (skipOptionalDbReads) {
    const stats = getDegradedPublicHomeStatsFallback("db_skipped");

    return (
      <HomeRestoredClient
        homeMarketingStats={homeMarketingStatsFromPayload(stats)}
        publishedGlobalRegionCardIds={safeCardIds}
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
          publishedGlobalRegionCardIds={safeCardIds}
          introAfterHero={introAfterHero}
        />
      }
    >
      <HomeDeferred
        publishedGlobalRegionCardIds={safeCardIds}
        introAfterHero={introAfterHero}
      />
    </Suspense>
  );
}