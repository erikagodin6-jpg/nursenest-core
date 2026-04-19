import type { Metadata } from "next";
import { notFound } from "next/navigation";
import HomeRestoredClient from "@/components/marketing/home-restored-client";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { FaqJsonLd } from "@/components/seo/faq-json-ld";
import { WebPageJsonLd } from "@/components/seo/seo-json-ld";
import { MARKETING_HOME_FAQ_JSONLD } from "@/lib/seo/marketing-home-faq-schema";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { isCoreHostedNonDefaultLocale } from "@/lib/i18n/marketing-locale-policy";
import { localizeBreadcrumbResolution } from "@/lib/seo/breadcrumb-i18n";
import { marketingHomeSurfaceBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { loadHomepageMessageBundle } from "@/lib/marketing-i18n/homepage-message-shards";
import { resolveMarketingCopy } from "@/lib/marketing-i18n-core";
import { getMarketingRegionFromCookies } from "@/lib/region/marketing-region-server";
import { defaultHomeMetaDescription, defaultHomeMetaTitle } from "@/lib/marketing/nursing-tier-public-labels";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { buildMarketingWebPageJsonLdProps } from "@/lib/seo/marketing-webpage-jsonld";
import { listPublishedHomeGlobalRegionCardIds } from "@/lib/marketing/published-regional-marketing-urls";

/** Literal required for Next segment config static analysis — keep in sync with `PUBLIC_HOME_STATS_CACHE_REVALIDATE_SEC`. */
export const revalidate = 3600;

type Props = { params: Promise<{ locale: string }> };

async function loadLocalizedHomePageStats() {
  const { getHomepagePublicHomeStats } = await import("@/lib/marketing/public-home-stats");
  return getHomepagePublicHomeStats();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isCoreHostedNonDefaultLocale(locale)) {
    notFound();
  }
  return safeGenerateMetadata(
    async () => {
      const marketingRegion = await getMarketingRegionFromCookies();
      const { messages, fallbackMessages } = await loadHomepageMessageBundle(locale);
      const metaSfx = marketingRegion === "US" ? "US" : "CA";
      const title = resolveMarketingCopy(
        messages,
        `pages.home.metaTitle${metaSfx}`,
        fallbackMessages,
        defaultHomeMetaTitle(marketingRegion),
      );
      const description = resolveMarketingCopy(
        messages,
        `pages.home.metaDescription${metaSfx}`,
        fallbackMessages,
        defaultHomeMetaDescription(marketingRegion),
      );
      const alt = marketingAlternatesSharedPage(locale, "/");
      return {
        title,
        description,
        alternates: { canonical: alt.canonical, languages: alt.languages },
        openGraph: {
          title,
          description,
          url: alt.canonical,
          type: "website",
        },
      };
    },
    { pathname: `/${locale}`, locale, routeGroup: "marketing.locale.home" },
  );
}

export default async function LocalizedHomePage({ params }: Props) {
  const { locale } = await params;
  const raw = marketingHomeSurfaceBreadcrumbs();
  const marketingRegion = await getMarketingRegionFromCookies();
  const [homeStatsRaw, bundle, publishedGlobalRegionCardIds] = await Promise.all([
    loadLocalizedHomePageStats(),
    loadHomepageMessageBundle(locale),
    listPublishedHomeGlobalRegionCardIds(),
  ]);
  const { messages, fallbackMessages } = bundle;
  const homeMarketingStats = {
    questionCount: homeStatsRaw.questionCount,
    registeredLearners: homeStatsRaw.registeredLearners,
    totalLessons: homeStatsRaw.totalLessons,
  };
  const metaSfx = marketingRegion === "US" ? "US" : "CA";
  const title = resolveMarketingCopy(
    messages,
    `pages.home.metaTitle${metaSfx}`,
    fallbackMessages,
    defaultHomeMetaTitle(marketingRegion),
  );
  const description = resolveMarketingCopy(
    messages,
    `pages.home.metaDescription${metaSfx}`,
    fallbackMessages,
    defaultHomeMetaDescription(marketingRegion),
  );
  const { crumbs, schemaItems } = localizeBreadcrumbResolution(raw, messages);
  return (
    <>
      <WebPageJsonLd
        {...buildMarketingWebPageJsonLdProps({
          locale,
          enPath: "/",
          title,
          description,
        })}
      />
      <BreadcrumbJsonLd items={schemaItems} />
      <FaqJsonLd items={MARKETING_HOME_FAQ_JSONLD} />
      {crumbs.length > 0 ? (
        <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
          <BreadcrumbTrail items={crumbs} />
        </div>
      ) : null}
      <HomeRestoredClient
        homeMarketingStats={homeMarketingStats}
        publishedGlobalRegionCardIds={publishedGlobalRegionCardIds}
      />
    </>
  );
}
