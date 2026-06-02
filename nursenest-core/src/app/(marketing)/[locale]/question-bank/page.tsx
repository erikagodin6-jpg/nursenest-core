import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isCoreHostedNonDefaultLocale } from "@/lib/i18n/marketing-locale-policy";
import { loadMarketingLayoutShardsOverlay } from "@/lib/marketing-i18n/load-marketing-route-shard-bundles";
import { getRequiredPublicMetadataLine } from "@/lib/marketing-i18n/marketing-metadata-strict";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { getMarketingRegionFromCookies } from "@/lib/region/marketing-region-server";
import { parseMarketingRegionCookieValue } from "@/lib/region/marketing-region-cookie";
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
      /** Deterministic US/CA meta keys for prerender — same anonymous default as a missing region cookie. */
      const marketingRegion = parseMarketingRegionCookieValue(undefined) as MarketingRegionToggle;
      const messages = await loadMarketingLayoutShardsOverlay(locale);
      const metaSfx = marketingRegion === "US" ? "US" : "CA";
      const title = getRequiredPublicMetadataLine(
        messages,
        `pages.publicQuestionBank.metaTitle${metaSfx}`,
        undefined,
        defaultQuestionBankMetaTitle(marketingRegion),
      );
      const description = getRequiredPublicMetadataLine(
        messages,
        `pages.publicQuestionBank.metaDescription${metaSfx}`,
        undefined,
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
  const messages = await loadMarketingLayoutShardsOverlay(locale);
  const metaSfx = marketingRegion === "US" ? "US" : "CA";
  const title = getRequiredPublicMetadataLine(
    messages,
    `pages.publicQuestionBank.metaTitle${metaSfx}`,
    undefined,
    defaultQuestionBankMetaTitle(marketingRegion),
  );
  const description = getRequiredPublicMetadataLine(
    messages,
    `pages.publicQuestionBank.metaDescription${metaSfx}`,
    undefined,
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
