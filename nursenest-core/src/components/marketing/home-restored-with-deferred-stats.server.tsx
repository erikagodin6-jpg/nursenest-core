import "server-only";

import type { ReactNode } from "react";

import HomeRestoredClient from "@/components/marketing/home-restored-client";
import {
  getDegradedPublicHomeStatsFallback,
  type PublicHomeStatsPayload,
} from "@/lib/marketing/public-home-stats-payload";
import type { HomeMarketingStats } from "@/components/marketing/home-marketing-stats";

export type HomeRestoredWithDeferredStatsProps = {
  skipOptionalDbReads: boolean;
  publishedGlobalRegionCardIds?: readonly string[] | null;
  introAfterHero?: ReactNode;
};

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

/**
 * Single server await for homepage stats — no Suspense swap on `/` so the first
 * paint is one consistent HomeRestoredClient tree (degraded stats on failure).
 */
export async function HomeRestoredWithDeferredStats({
  skipOptionalDbReads,
  publishedGlobalRegionCardIds,
  introAfterHero,
}: HomeRestoredWithDeferredStatsProps) {
  const safeCardIds = safeRegionCardIds(publishedGlobalRegionCardIds);

  const stats = skipOptionalDbReads
    ? getDegradedPublicHomeStatsFallback("db_skipped")
    : await getStatsSafe();

  return (
    <HomeRestoredClient
      homeMarketingStats={homeMarketingStatsFromPayload(stats)}
      publishedGlobalRegionCardIds={safeCardIds}
      introAfterHero={introAfterHero}
    />
  );
}
