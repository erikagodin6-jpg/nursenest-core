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
import { loadMarketingLayoutShardsOverlay } from "@/lib/marketing-i18n/load-marketing-route-shard-bundles";
import { marketingHomeSurfaceBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { getRequiredPublicMetadataLine } from "@/lib/marketing-i18n/marketing-metadata-strict";
import { getMarketingRegionFromCookies } from "@/lib/region/marketing-region-server";
import { defaultHomeMetaDescription, defaultHomeMetaTitle } from "@/lib/marketing/nursing-tier-public-labels";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { buildMarketingWebPageJsonLdProps } from "@/lib/seo/marketing-webpage-jsonld";
import { listPublishedHomeGlobalRegionCardIds } from "@/lib/marketing/published-regional-marketing-urls";

export const dynamic = "force-dynamic";

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
      const m = await loadMarketingLayoutShardsOverlay(locale);
      const metaSfx = marketingRegion === "US" ? "US" : "CA";
      const title = getRequiredPublicMetadataLine(
        m,
        `pages.home.metaTitle${metaSfx}`,
        undefined,
        defaultHomeMetaTitle(marketingRegion),
      );
      const description = getRequiredPublicMetadataLine(
        m,
        `pages.home.metaDescription${metaSfx}`,
        undefined,
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
        twitter: {
          card: "summary_large_image",
          title,
          description,
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
  const [homeStatsRaw, messages, publishedGlobalRegionCardIds] = await Promise.all([
    loadLocalizedHomePageStats(),
    loadMarketingLayoutShardsOverlay(locale),
    listPublishedHomeGlobalRegionCardIds(),
  ]);
  const homeMarketingStats = {
    questionCount: homeStatsRaw.questionCount,
    registeredLearners: homeStatsRaw.registeredLearners,
    totalLessons: homeStatsRaw.totalLessons,
  };
  const metaSfx = marketingRegion === "US" ? "US" : "CA";
  const title = getRequiredPublicMetadataLine(
    messages,
    `pages.home.metaTitle${metaSfx}`,
    undefined,
    defaultHomeMetaTitle(marketingRegion),
  );
  const description = getRequiredPublicMetadataLine(
    messages,
    `pages.home.metaDescription${metaSfx}`,
    undefined,
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
