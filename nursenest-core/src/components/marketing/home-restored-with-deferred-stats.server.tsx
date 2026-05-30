import "server-only";

import type { PropsWithChildren } from "react";

import HomeRestoredClient from "@/components/marketing/home-restored-client";
import { HomepageEcosystemDiscovery } from "@/components/marketing/home/homepage-ecosystem-discovery";
import { PremiumClinicalDepth } from "@/components/marketing/home/premium-clinical-depth";
import { PremiumHomepageHero } from "@/components/marketing/home/premium-homepage-hero";
import { PremiumHomepageTrust } from "@/components/marketing/home/premium-homepage-trust";
import {
  getDegradedPublicHomeStatsFallback,
  type PublicHomeStatsPayload,
} from "@/lib/marketing/public-home-stats-payload";
import type { HomeMarketingStats } from "@/components/marketing/home-marketing-stats";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { getMarketingRegionFromCookies } from "@/lib/region/marketing-region-server";

export type HomeRestoredWithDeferredStatsProps = PropsWithChildren<{
  skipOptionalDbReads: boolean;
  publishedGlobalRegionCardIds?: readonly string[] | null;
}>;

function safeNumber(value: unknown): number {
  return Number.isFinite(value) ? Number(value) : 0;
}

function homeMarketingStatsFromPayload(raw: Partial<PublicHomeStatsPayload> | null | undefined): HomeMarketingStats {
  return {
    questionCount: safeNumber(raw?.questionCount),
    registeredLearners: safeNumber(raw?.registeredLearners),
    totalLessons: safeNumber(raw?.totalLessons),
    totalFlashcards: safeNumber(raw?.totalFlashcards),
    scenarioCount: safeNumber(raw?.scenarioCount),
    clinicalSkillCount: safeNumber(raw?.clinicalSkillCount),
    medicationMathProblemCount: safeNumber(raw?.medicationMathProblemCount),
    ecgCaseCount: safeNumber(raw?.ecgCaseCount),
    labCaseCount: safeNumber(raw?.labCaseCount),
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
 * Load page-body i18n messages for server-island sections (pages + marketing shards).
 * Returns empty object on failure so server islands fall back to English defaults.
 * Messages are read from filesystem — no network calls. Bounded at 500ms to protect
 * against unexpected fs stalls in the standalone environment.
 */
async function loadServerIslandMessagesSafe(): Promise<Record<string, string>> {
  try {
    // 100ms: i18n files are on the local filesystem (standalone) and should load
    // in <30ms. Falling back to empty (English defaults) after 100ms prevents
    // a single slow disk read from padding TTFB by up to 500ms.
    const TIMEOUT_MS = 100;
    const timeoutFallback = new Promise<Record<string, string>>((resolve) =>
      setTimeout(() => resolve({}), TIMEOUT_MS),
    );
    const load = import(
      "@/lib/marketing-i18n/load-marketing-message-shards"
    ).then(({ loadMarketingMessageShards }) =>
      loadMarketingMessageShards(DEFAULT_MARKETING_LOCALE, ["pages", "marketing", "brand"]),
    );
    return await Promise.race([load, timeoutFallback]);
  } catch {
    return {};
  }
}

/**
 * Single server await for homepage stats — no Suspense swap on `/` so the first
 * paint is one consistent HomeRestoredClient tree (degraded stats on failure).
 *
 * Server islands: PremiumClinicalDepth and PremiumHomepageTrust are rendered here
 * as React Server Components and passed as named slots to the client wrapper.
 * React does not hydrate these subtrees — they become static HTML.
 */
export async function HomeRestoredWithDeferredStats({
  skipOptionalDbReads,
  publishedGlobalRegionCardIds,
  children,
}: HomeRestoredWithDeferredStatsProps) {
  const safeCardIds = safeRegionCardIds(publishedGlobalRegionCardIds);

  // Promise.allSettled: a single rejected promise cannot bring down the entire homepage.
  // All four are already fail-safe, but allSettled adds a final safety net.
  const [statsResult, messagesResult, regionResult] = await Promise.allSettled([
    skipOptionalDbReads ? Promise.resolve(getDegradedPublicHomeStatsFallback("db_skipped")) : getStatsSafe(),
    loadServerIslandMessagesSafe(),
    getMarketingRegionFromCookies(),
  ]);

  const stats = statsResult.status === "fulfilled"
    ? statsResult.value
    : getDegradedPublicHomeStatsFallback("promise_rejected");
  const serverIslandMessages = messagesResult.status === "fulfilled" ? messagesResult.value : {};
  const region = regionResult.status === "fulfilled" ? regionResult.value : "CA";

  // Server-rendered islands: rendered here as RSC, slotted into the client wrapper.
  // These sections have zero browser API usage and are fully static — no hydration needed.
  //
  // heroSlot: PremiumHomepageHero is now a server component. Passing it as a slot
  // eliminates above-fold client hydration cost — the hero HTML is fully static.
  // Only MarketingTrackedLink (CTA buttons) and LeafWatermark inside it hydrate.
  const heroSlot = (
    <PremiumHomepageHero
      locale={DEFAULT_MARKETING_LOCALE}
      region={region}
      questionCount={safeNumber(stats?.questionCount)}
      lessonCount={safeNumber(stats?.totalLessons)}
      messages={serverIslandMessages}
    />
  );
  const clinicalDepthSlot = (
    <PremiumClinicalDepth messages={serverIslandMessages} locale={DEFAULT_MARKETING_LOCALE} />
  );
  const featureDiscoverySlot = (
    <HomepageEcosystemDiscovery stats={homeMarketingStatsFromPayload(stats)} />
  );
  const trustSlot = (
    <PremiumHomepageTrust messages={serverIslandMessages} />
  );

  return (
    <HomeRestoredClient
      homeMarketingStats={homeMarketingStatsFromPayload(stats)}
      publishedGlobalRegionCardIds={safeCardIds}
      heroSlot={heroSlot}
      featureDiscoverySlot={featureDiscoverySlot}
      clinicalDepthSlot={clinicalDepthSlot}
      trustSlot={trustSlot}
    >
      {children}
    </HomeRestoredClient>
  );
}
