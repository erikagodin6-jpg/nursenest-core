import {
  HomeRestoredWithDeferredStats,
  type HomeRestoredWithDeferredStatsProps,
} from "@/components/marketing/home-restored-with-deferred-stats.server";
import { MarketingHomeEmergencyFallback } from "@/components/marketing/marketing-home-emergency-fallback";
import { MarketingI18nShardLayer } from "@/components/i18n/marketing-i18n-provider";
import { WebPageJsonLd } from "@/components/seo/seo-json-ld";

import {
  HomeBlogTeaserSectionAsync,
  HomeBlogTeaserSectionShell,
} from "@/components/marketing/home-blog-teaser-section.server";

import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { getMarketingLocaleForDefaultRoute } from "@/lib/i18n/marketing-locale-server";
import {
  loadMarketingMessageShards,
  loadMarketingMessageShardsSync,
} from "@/lib/marketing-i18n/load-marketing-message-shards";
import { MARKETING_PAGE_BODY_MESSAGE_SHARDS } from "@/lib/marketing-i18n/marketing-i18n-shard-groups";
import { defaultHomeMetaDescription, defaultHomeMetaTitle } from "@/lib/marketing/nursing-tier-public-labels";
import { listPublishedHomeGlobalRegionCardIds } from "@/lib/marketing/published-regional-marketing-urls";
import { getMarketingRegionFromCookies } from "@/lib/region/marketing-region-server";
import { buildMarketingWebPageJsonLdProps } from "@/lib/seo/marketing-webpage-jsonld";

/**
 * Dynamic rendering required (layout reads cookies for region/locale).
 * Removing revalidate=0 restores unstable_cache (1-hour TTL) for home stats,
 * so the DB is not hit on every warm request.
 */
export const dynamic = "force-dynamic";
const STATIC_LOCALE = DEFAULT_MARKETING_LOCALE;

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
    return await HomeRestoredWithDeferredStats(props);
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

async function loadHomePageBodyMessages() {
  try {
    const locale = await getMarketingLocaleForDefaultRoute();
    const messages = await loadMarketingMessageShards(locale, MARKETING_PAGE_BODY_MESSAGE_SHARDS);
    const fallbackMessages =
      locale === DEFAULT_MARKETING_LOCALE
        ? undefined
        : loadMarketingMessageShardsSync(DEFAULT_MARKETING_LOCALE, MARKETING_PAGE_BODY_MESSAGE_SHARDS);
    return { messages, fallbackMessages };
  } catch {
    return null;
  }
}

/**
 * HOMEPAGE
 *
 * All optional data dependencies (blog, body messages) are fetched in parallel
 * using Promise.allSettled so a slow/failed optional fetch cannot block the
 * primary render or produce a 504. Stats and carousel are bounded inside
 * HomeRestoredWithDeferredStats via their own timeout guards.
 */
export default async function HomePage() {
  try {
    // Run all optional data fetches in parallel — none can reject the render.
    const [blogResult, bodyMessagesResult, marketingRegionResult] = await Promise.allSettled([
      safeBlog(),
      loadHomePageBodyMessages(),
      getMarketingRegionFromCookies(),
    ]);

    const blogSection =
      blogResult.status === "fulfilled"
        ? blogResult.value
        : <HomeBlogTeaserSectionShell m={{}} posts={[]} />;

    const bodyMessages =
      bodyMessagesResult.status === "fulfilled" ? bodyMessagesResult.value : null;
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
          skipOptionalDbReads: false,
          publishedGlobalRegionCardIds: cards,
        })}

        {blogSection}
      </>
    );

    if (!bodyMessages) return content;

    return (
      <MarketingI18nShardLayer
        messages={bodyMessages.messages}
        fallbackMessages={bodyMessages.fallbackMessages}
      >
        {content}
      </MarketingI18nShardLayer>
    );
  } catch (err) {
    console.error("FINAL HOMEPAGE FAILSAFE:", err);
    return <MarketingHomeEmergencyFallback />;
  }
}
