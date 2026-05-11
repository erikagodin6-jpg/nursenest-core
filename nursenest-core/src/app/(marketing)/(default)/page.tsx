import {
  HomeRestoredWithDeferredStats,
  type HomeRestoredWithDeferredStatsProps,
} from "@/components/marketing/home-restored-with-deferred-stats.server";
import { MarketingHomeEmergencyFallback } from "@/components/marketing/marketing-home-emergency-fallback";
import { MarketingI18nShardLayer } from "@/components/i18n/marketing-i18n-provider";

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
 */
export default async function HomePage() {
  try {
    const cards = await safeRegionCards();
    const blogSection = await safeBlog();
    const bodyMessages = await loadHomePageBodyMessages();

    const content = (
      <>
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
