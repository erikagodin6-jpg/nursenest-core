import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isCoreHostedNonDefaultLocale, DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";
import { resolveMarketingCopy } from "@/lib/marketing-i18n-core";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { getMarketingRegionFromCookies } from "@/lib/region/marketing-region-server";
import {
  defaultPublicLessonsMetaDescription,
  defaultPublicLessonsMetaTitle,
} from "@/lib/marketing/nursing-tier-public-labels";
import { PublicLessonsHubView } from "@/components/marketing/public-lessons-hub-view";
import { WebPageJsonLd } from "@/components/seo/seo-json-ld";
import type { MarketingRegionToggle } from "@/lib/marketing/marketing-entry-routes";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { buildMarketingWebPageJsonLdProps } from "@/lib/seo/marketing-webpage-jsonld";

export const revalidate = 600;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isCoreHostedNonDefaultLocale(locale)) notFound();
  return safeGenerateMetadata(
    async () => {
      const marketingRegion = (await getMarketingRegionFromCookies()) as MarketingRegionToggle;
      const m = await loadMarketingMessages(locale);
      const en = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
      const metaSfx = marketingRegion === "US" ? "US" : "CA";
      const title = resolveMarketingCopy(
        m,
        `pages.publicLessons.metaTitle${metaSfx}`,
        en,
        defaultPublicLessonsMetaTitle(marketingRegion),
      );
      const description = resolveMarketingCopy(
        m,
        `pages.publicLessons.metaDescription${metaSfx}`,
        en,
        defaultPublicLessonsMetaDescription(marketingRegion),
      );
      const alt = marketingAlternatesSharedPage(locale, "/lessons");
      return {
        title,
        description,
        alternates: { canonical: alt.canonical, languages: alt.languages },
        openGraph: { title, description, url: alt.canonical, type: "website" },
      };
    },
    { pathname: `/${locale}/lessons`, locale, routeGroup: "marketing.locale.public_lessons" },
  );
}

export default async function LocalizedLessonsPage({ params }: Props) {
  const { locale } = await params;
  if (!isCoreHostedNonDefaultLocale(locale)) notFound();
  const marketingRegion = (await getMarketingRegionFromCookies()) as MarketingRegionToggle;
  const m = await loadMarketingMessages(locale);
  const en = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
  const metaSfx = marketingRegion === "US" ? "US" : "CA";
  const title = resolveMarketingCopy(
    m,
    `pages.publicLessons.metaTitle${metaSfx}`,
    en,
    defaultPublicLessonsMetaTitle(marketingRegion),
  );
  const description = resolveMarketingCopy(
    m,
    `pages.publicLessons.metaDescription${metaSfx}`,
    en,
    defaultPublicLessonsMetaDescription(marketingRegion),
  );
  return (
    <>
      <WebPageJsonLd
        {...buildMarketingWebPageJsonLdProps({
          locale,
          enPath: "/lessons",
          title,
          description,
        })}
      />
      <PublicLessonsHubView locale={locale} />
    </>
  );
}
