import type { Metadata } from "next";

import {
  HomeRestoredWithDeferredStats,
  type HomeRestoredWithDeferredStatsProps,
} from "@/components/marketing/home-restored-with-deferred-stats.server";
import { MarketingHomeEmergencyFallback } from "@/components/marketing/marketing-home-emergency-fallback";
import { WebPageJsonLd } from "@/components/seo/seo-json-ld";

import {
  HomeBlogTeaserSectionAsync,
  HomeBlogTeaserSectionShell,
} from "@/components/marketing/home-blog-teaser-section.server";

import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { defaultHomeMetaDescription, defaultHomeMetaTitle } from "@/lib/marketing/nursing-tier-public-labels";
import { listPublishedHomeGlobalRegionCardIds } from "@/lib/marketing/published-regional-marketing-urls";
import { getMarketingRegionFromCookies } from "@/lib/region/marketing-region-server";
import { buildMarketingWebPageJsonLdProps } from "@/lib/seo/marketing-webpage-jsonld";
import { absoluteUrl } from "@/lib/seo/site-origin";

/**
 * 🧊 ISR window for homepage: revalidates every 5 minutes.
 * The default layout above already provides `revalidate: 300`.
 * This explicit `revalidate` ensures the homepage follows the same ISR policy.
 * 
 * Homepage stats use unstable_cache (1-hour TTL) — they are not refetched on every request.
 */
export const revalidate = 300;
const STATIC_LOCALE = DEFAULT_MARKETING_LOCALE;

export function generateMetadata(): Metadata {
  const title = defaultHomeMetaTitle("CA");
  const description = defaultHomeMetaDescription("CA");
  const canonical = absoluteUrl("/");
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

function safeRegionCards(): string[] {
  try {
    const cards = listPublishedHomeGlobalRegionCardIds();
    return Array.isArray(cards) ? cards : [];
  } catch {
    return [];
  }
}

async function safeStats(props: HomeRestoredWithDeferredStatsProps) {
  try {
    const withTimeout = Promise.race([
      HomeRestoredWithDeferredStats(props),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error("homepage_stats_timeout")), 1200)),
    ]);
    return await withTimeout;
  } catch (err) {
    console.error("[homepage] stats failed", err);
    return <MarketingHomeEmergencyFallback />;
  }
}

async function safeBlog() {
  try {
    // 1000ms timeout: blog posts are a below-fold enhancement. If the DB query
    // takes longer than 1s, render the empty shell and skip the teaser section
    // rather than holding the entire page render hostage.
    const withTimeout = Promise.race([
      HomeBlogTeaserSectionAsync({ m: {} }),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error("blog_timeout")), 1000)),
    ]);
    return await withTimeout;
  } catch {
    return <HomeBlogTeaserSectionShell m={{}} posts={[]} />;
  }
}

/**
 * HOMEPAGE
 *
 * Optional data dependencies are fetched in parallel using Promise.allSettled
 * so a slow/failed optional fetch cannot block the
 * primary render or produce a 504. Stats and carousel are bounded inside
 * HomeRestoredWithDeferredStats via their own timeout guards.
 */
export default async function HomePage() {
  try {
    // Run all optional data fetches in parallel — none can reject the render.
    const [blogResult, marketingRegionResult] = await Promise.allSettled([
      safeBlog(),
      getMarketingRegionFromCookies(),
    ]);

    const blogSection =
      blogResult.status === "fulfilled"
        ? blogResult.value
        : <HomeBlogTeaserSectionShell m={{}} posts={[]} />;

    const marketingRegion =
      marketingRegionResult.status === "fulfilled" ? marketingRegionResult.value : "CA";
    const title = defaultHomeMetaTitle(marketingRegion);
    const description = defaultHomeMetaDescription(marketingRegion);

    // Region cards are synchronous (no network) — read after parallel phase.
    const cards = safeRegionCards();

    const content = (
      <>
        <WebPageJsonLd
          {...buildMarketingWebPageJsonLdProps({
            locale: STATIC_LOCALE,
            enPath: "/",
            title,
            description,
          })}
        />
        {await safeStats({
          skipOptionalDbReads: true,
          publishedGlobalRegionCardIds: cards,
        })}

        {blogSection}
      </>
    );

    return content;
  } catch (err) {
    console.error("FINAL HOMEPAGE FAILSAFE:", err);
    return <MarketingHomeEmergencyFallback />;
  }
}
