import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PracticeExamsHubContent } from "@/components/marketing/practice-exams-hub-content";
import { DEFAULT_MARKETING_LOCALE, isCoreHostedNonDefaultLocale } from "@/lib/i18n/marketing-locale-policy";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";
import { resolveMarketingCopy } from "@/lib/marketing-i18n-core";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { getMarketingRegionFromCookies } from "@/lib/region/marketing-region-server";
import {
  defaultPracticeExamsMetaDescription,
  defaultPracticeExamsMetaTitle,
} from "@/lib/marketing/nursing-tier-public-labels";
import { WebPageJsonLd } from "@/components/seo/seo-json-ld";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { buildMarketingWebPageJsonLdProps } from "@/lib/seo/marketing-webpage-jsonld";

export const revalidate = 600;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isCoreHostedNonDefaultLocale(locale)) notFound();
  return safeGenerateMetadata(
    async () => {
      const marketingRegion = await getMarketingRegionFromCookies();
      const m = await loadMarketingMessages(locale);
      const en = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
      const metaSfx = marketingRegion === "US" ? "US" : "CA";
      const title = resolveMarketingCopy(
        m,
        `pages.publicPracticeExams.metaTitle${metaSfx}`,
        en,
        defaultPracticeExamsMetaTitle(marketingRegion),
      );
      const description = resolveMarketingCopy(
        m,
        `pages.publicPracticeExams.metaDescription${metaSfx}`,
        en,
        defaultPracticeExamsMetaDescription(marketingRegion),
      );
      const alt = marketingAlternatesSharedPage(locale, "/practice-exams");
      return {
        title,
        description,
        alternates: { canonical: alt.canonical, languages: alt.languages },
        openGraph: { title, description, url: alt.canonical, type: "website" },
      };
    },
    { pathname: `/${locale}/practice-exams`, locale, routeGroup: "marketing.locale.practice_exams" },
  );
}

export default async function LocalizedPracticeExamsPage({ params }: Props) {
  const { locale } = await params;
  if (!isCoreHostedNonDefaultLocale(locale)) notFound();
  const marketingRegion = await getMarketingRegionFromCookies();
  const m = await loadMarketingMessages(locale);
  const en = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
  const metaSfx = marketingRegion === "US" ? "US" : "CA";
  const title = resolveMarketingCopy(
    m,
    `pages.publicPracticeExams.metaTitle${metaSfx}`,
    en,
    defaultPracticeExamsMetaTitle(marketingRegion),
  );
  const description = resolveMarketingCopy(
    m,
    `pages.publicPracticeExams.metaDescription${metaSfx}`,
    en,
    defaultPracticeExamsMetaDescription(marketingRegion),
  );
  return (
    <>
      <WebPageJsonLd
        {...buildMarketingWebPageJsonLdProps({
          locale,
          enPath: "/practice-exams",
          title,
          description,
        })}
      />
      <PracticeExamsHubContent locale={locale} />
    </>
  );
}
