import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isCoreHostedNonDefaultLocale, DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";
import { resolveMarketingCopy } from "@/lib/marketing-i18n-core";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { getMarketingRegionFromCookies } from "@/lib/region/marketing-region-server";
import {
  defaultQuestionBankMetaDescription,
  defaultQuestionBankMetaTitle,
} from "@/lib/marketing/nursing-tier-public-labels";
import { PublicQuestionBankHubView } from "@/components/marketing/public-question-bank-hub-view";
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
        `pages.publicQuestionBank.metaTitle${metaSfx}`,
        en,
        defaultQuestionBankMetaTitle(marketingRegion),
      );
      const description = resolveMarketingCopy(
        m,
        `pages.publicQuestionBank.metaDescription${metaSfx}`,
        en,
        defaultQuestionBankMetaDescription(marketingRegion),
      );
      const alt = marketingAlternatesSharedPage(locale, "/question-bank");
      return {
        title,
        description,
        alternates: { canonical: alt.canonical, languages: alt.languages },
        openGraph: { title, description, url: alt.canonical, type: "website" },
      };
    },
    { pathname: `/${locale}/question-bank`, locale, routeGroup: "marketing.locale.question_bank" },
  );
}

export default async function LocalizedQuestionBankPage({ params }: Props) {
  const { locale } = await params;
  if (!isCoreHostedNonDefaultLocale(locale)) notFound();
  const marketingRegion = (await getMarketingRegionFromCookies()) as MarketingRegionToggle;
  const m = await loadMarketingMessages(locale);
  const en = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
  const metaSfx = marketingRegion === "US" ? "US" : "CA";
  const title = resolveMarketingCopy(
    m,
    `pages.publicQuestionBank.metaTitle${metaSfx}`,
    en,
    defaultQuestionBankMetaTitle(marketingRegion),
  );
  const description = resolveMarketingCopy(
    m,
    `pages.publicQuestionBank.metaDescription${metaSfx}`,
    en,
    defaultQuestionBankMetaDescription(marketingRegion),
  );
  return (
    <>
      <WebPageJsonLd
        {...buildMarketingWebPageJsonLdProps({
          locale,
          enPath: "/question-bank",
          title,
          description,
        })}
      />
      <PublicQuestionBankHubView locale={locale} />
    </>
  );
}
