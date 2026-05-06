import {
  HomeRestoredWithDeferredStats,
  type HomeRestoredWithDeferredStatsProps,
} from "@/components/marketing/home-restored-with-deferred-stats.server";
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

async function safeRegionCards(): Promise<string[]> {
  try {
    const cards = listPublishedHomeGlobalRegionCardIds();
    return Array.isArray(cards) ? cards : [];
  } catch {
    return [];
  }
}

async function safeStats(props: HomeRestoredWithDeferredStatsProps) {
  try {
    return await HomeRestoredWithDeferredStats(props);
  } catch (err) {
    console.error("[homepage] stats failed", err);
    return <MarketingHomeEmergencyFallback />;
  }
}

async function safeBlog() {
  try {
    return await HomeBlogTeaserSectionAsync({ m: {} });
  } catch {
    return <HomeBlogTeaserSectionShell m={{}} posts={[]} />;
  }
}

/** Server slot so global intro streams as client `children` (not a named prop) — preserves DOM order vs hero. */
async function HomepageGlobalIntroSlot() {
  try {
    return await GlobalMarketingHomeIntro();
  } catch {
    return null;
  }
}

/**
 * HOMEPAGE
 */
export default async function HomePage() {
  try {
    const cards = await safeRegionCards();
    const blogSection = await safeBlog();

    return (
      <>
        {await safeStats({
          skipOptionalDbReads: false,
          publishedGlobalRegionCardIds: cards,
          children: <HomepageGlobalIntroSlot />,
        })}

        {blogSection}
      </>
    );
  } catch (err) {
    console.error("FINAL HOMEPAGE FAILSAFE:", err);
    return <MarketingHomeEmergencyFallback />;
  }
}
