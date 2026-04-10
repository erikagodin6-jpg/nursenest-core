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
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";
import { marketingHomeSurfaceBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { marketingAlternatesSharedPage, marketingCanonicalPathForLocale } from "@/lib/seo/marketing-alternates";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { resolveMarketingCopy } from "@/lib/marketing-i18n-core";
import { getMarketingRegionFromCookies } from "@/lib/region/marketing-region-server";
import { defaultHomeMetaDescription, defaultHomeMetaTitle } from "@/lib/marketing/nursing-tier-public-labels";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

export const revalidate = 600;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isCoreHostedNonDefaultLocale(locale)) {
    notFound();
  }
  return safeGenerateMetadata(
    async () => {
      const marketingRegion = await getMarketingRegionFromCookies();
      const m = await loadMarketingMessages(locale);
      const en = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
      const metaSfx = marketingRegion === "US" ? "US" : "CA";
      const title = resolveMarketingCopy(m, `pages.home.metaTitle${metaSfx}`, en, defaultHomeMetaTitle(marketingRegion));
      const description = resolveMarketingCopy(
        m,
        `pages.home.metaDescription${metaSfx}`,
        en,
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
  const primary = await loadMarketingMessages(locale);
  const en = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
  const metaSfx = marketingRegion === "US" ? "US" : "CA";
  const title = resolveMarketingCopy(primary, `pages.home.metaTitle${metaSfx}`, en, defaultHomeMetaTitle(marketingRegion));
  const description = resolveMarketingCopy(
    primary,
    `pages.home.metaDescription${metaSfx}`,
    en,
    defaultHomeMetaDescription(marketingRegion),
  );
  const { crumbs, schemaItems } = localizeBreadcrumbResolution(raw, primary);
  return (
    <>
      <WebPageJsonLd
        title={title}
        description={description}
        path={marketingCanonicalPathForLocale(locale, "/")}
        inLanguage={locale}
      />
      <BreadcrumbJsonLd items={schemaItems} />
      <FaqJsonLd items={MARKETING_HOME_FAQ_JSONLD} />
      {crumbs.length > 0 ? (
        <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
          <BreadcrumbTrail items={crumbs} />
        </div>
      ) : null}
      <HomeRestoredClient />
    </>
  );
}
