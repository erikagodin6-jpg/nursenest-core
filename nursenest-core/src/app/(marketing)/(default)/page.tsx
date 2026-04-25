// SAME IMPORTS (unchanged)
import type { Metadata } from "next";
import { headers } from "next/headers";
import { Suspense } from "react";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { FaqJsonLd } from "@/components/seo/faq-json-ld";
import { WebPageJsonLd } from "@/components/seo/seo-json-ld";
import { MARKETING_HOME_FAQ_JSONLD } from "@/lib/seo/marketing-home-faq-schema";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { HomeRestoredWithDeferredStats } from "@/components/marketing/home-restored-with-deferred-stats.server";
import { GlobalMarketingHomeIntro } from "@/components/marketing/global-marketing-home-intro.server";
import { MarketingHomeEmergencyFallback } from "@/components/marketing/marketing-home-emergency-fallback";
import { marketingHomeSurfaceBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import {
  loadMarketingMessageShards,
  loadMarketingMessageShardsSync,
} from "@/lib/marketing-i18n/load-marketing-message-shards";
import { MARKETING_PAGE_BODY_MESSAGE_SHARDS } from "@/lib/marketing-i18n/marketing-i18n-shard-groups";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { buildMarketingWebPageJsonLdProps } from "@/lib/seo/marketing-webpage-jsonld";
import { type MarketingMessages } from "@/lib/marketing-i18n-core";
import { getRequiredPublicMetadataLine } from "@/lib/marketing-i18n/marketing-metadata-strict";
import { defaultHomeMetaDescription, defaultHomeMetaTitle } from "@/lib/marketing/nursing-tier-public-labels";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import {
  HomeBlogTeaserSectionAsync,
  HomeBlogTeaserSectionShell,
} from "@/components/marketing/home-blog-teaser-section.server";
import { listPublishedHomeGlobalRegionCardIds } from "@/lib/marketing/published-regional-marketing-urls";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const STATIC_LOCALE = DEFAULT_MARKETING_LOCALE;
const STATIC_REGION = "CA" as const;

function safeNow() {
  try {
    return Date.now();
  } catch {
    return 0;
  }
}

async function safeMessages(): Promise<MarketingMessages> {
  try {
    const m = await loadMarketingMessageShards(STATIC_LOCALE, MARKETING_PAGE_BODY_MESSAGE_SHARDS);
    if (m && Object.keys(m).length > 0) return m;
  } catch {}

  try {
    return loadMarketingMessageShardsSync(STATIC_LOCALE, MARKETING_PAGE_BODY_MESSAGE_SHARDS);
  } catch {}

  return {};
}

async function safeRegionCards() {
  try {
    return listPublishedHomeGlobalRegionCardIds();
  } catch {
    return ["us", "ca"];
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
  } catch {
    return (
      <>
        {props.introAfterHero}
        <MarketingHomeEmergencyFallback />
      </>
    );
  }
}

async function safeBlog(m: MarketingMessages) {
  try {
    return await HomeBlogTeaserSectionAsync({ m });
  } catch {
    return <HomeBlogTeaserSectionShell m={m} posts={[]} />;
  }
}

export default async function HomePage() {
  const t0 = safeNow();

  try {
    const [m, cards] = await Promise.all([
      safeMessages(),
      safeRegionCards(),
    ]);

    const title = getRequiredPublicMetadataLine(
      m,
      "pages.home.metaTitleCA",
      m,
      defaultHomeMetaTitle(STATIC_REGION),
    );

    const description = getRequiredPublicMetadataLine(
      m,
      "pages.home.metaDescriptionCA",
      m,
      defaultHomeMetaDescription(STATIC_REGION),
    );

    let crumbs: any[] = [];
    let schemaItems: any[] = [];

    try {
      const b = marketingHomeSurfaceBreadcrumbs();
      crumbs = b.crumbs;
      schemaItems = b.schemaItems;
    } catch {}

    let webPageProps: any = null;

    try {
      webPageProps = buildMarketingWebPageJsonLdProps({
        locale: STATIC_LOCALE,
        enPath: "/",
        title,
        description,
        inLanguage: "en-CA",
      });
    } catch {}

    return (
      <>
        {webPageProps ? <WebPageJsonLd {...webPageProps} /> : null}
        {schemaItems.length > 0 ? <BreadcrumbJsonLd items={schemaItems} /> : null}
        <FaqJsonLd items={MARKETING_HOME_FAQ_JSONLD} />

        {crumbs.length > 0 && (
          <div className="mx-auto max-w-7xl px-4 pt-2 sm:px-6 sm:pt-3 lg:px-8">
            <BreadcrumbTrail items={crumbs} />
          </div>
        )}

        {await safeStats({
          skipOptionalDbReads: false,
          publishedGlobalRegionCardIds: cards,
          skipOptionalDbPerfSegmentT0: t0,
          introAfterHero: await safeIntro(),
        })}

        <Suspense fallback={<HomeBlogTeaserSectionShell m={m} posts={[]} />}>
          {await safeBlog(m)}
        </Suspense>
      </>
    );
  } catch (err) {
    console.error("FINAL HOMEPAGE FAILSAFE:", err);
    return <MarketingHomeEmergencyFallback />;
  }
}