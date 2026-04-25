import { Suspense } from "react";

import { HomeRestoredWithDeferredStats } from "@/components/marketing/home-restored-with-deferred-stats.server";
import { GlobalMarketingHomeIntro } from "@/components/marketing/global-marketing-home-intro.server";
import { MarketingHomeEmergencyFallback } from "@/components/marketing/marketing-home-emergency-fallback";

import {
  HomeBlogTeaserSectionAsync,
  HomeBlogTeaserSectionShell,
} from "@/components/marketing/home-blog-teaser-section.server";

import { listPublishedHomeGlobalRegionCardIds } from "@/lib/marketing/published-regional-marketing-urls";

/**
 * Keep dynamic rendering, but remove unnecessary complexity
 */
export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Safe helpers
 */
function safeNow() {
  try {
    return Date.now();
  } catch {
    return 0;
  }
}

async function safeRegionCards(): Promise<string[]> {
  try {
    const cards = listPublishedHomeGlobalRegionCardIds();
    return Array.isArray(cards) ? cards : [];
  } catch {
    return [];
  }
}

async function safeIntro() {
  try {
    return await GlobalMarketingHomeIntro();
  } catch {
    return null;
  }
}

async function safeStats(props: any) {
  try {
    return await HomeRestoredWithDeferredStats(props);
  } catch (err) {
    console.error("[homepage] stats failed", err);
    return (
      <>
        {props.introAfterHero}
        <MarketingHomeEmergencyFallback />
      </>
    );
  }
}

async function safeBlog() {
  try {
    return await HomeBlogTeaserSectionAsync({ m: {} });
  } catch {
    return <HomeBlogTeaserSectionShell m={{}} posts={[]} />;
  }
}

/**
 * HOMEPAGE
 */
export default async function HomePage() {
  const t0 = safeNow();

  try {
    const cards = await safeRegionCards();
    const intro = await safeIntro();

    return (
      <>
        {/* MAIN HOMEPAGE */}
        {await safeStats({
          skipOptionalDbReads: false,
          publishedGlobalRegionCardIds: cards,
          skipOptionalDbPerfSegmentT0: t0,
          introAfterHero: intro,
        })}

        {/* BLOG SECTION */}
        <Suspense fallback={<HomeBlogTeaserSectionShell m={{}} posts={[]} />}>
          {await safeBlog()}
        </Suspense>
      </>
    );
  } catch (err) {
    console.error("FINAL HOMEPAGE FAILSAFE:", err);
    return <MarketingHomeEmergencyFallback />;
  }
}