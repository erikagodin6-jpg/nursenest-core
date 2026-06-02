import type { Metadata } from "next";
import { Suspense } from "react";
import {
  PricingDeferredSeoLocalized,
  PricingMarketingPlansRscLocalized,
} from "@/components/marketing/pricing-page-rsc-parts";
import { WebPageJsonLd } from "@/components/seo/seo-json-ld";
import { loadMarketingMetadataMessages } from "@/lib/marketing-i18n/load-marketing-metadata-messages";
import { serializeMarketingPageSearchParams } from "@/lib/marketing/serialize-marketing-search-params";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { buildMarketingWebPageJsonLdProps } from "@/lib/seo/marketing-webpage-jsonld";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import {
  MARKETING_PRICING_CONVERSION_H1_FALLBACK,
  MARKETING_PRICING_CONVERSION_LEAD_FALLBACK,
} from "@/lib/marketing-i18n/marketing-safe-fallbacks";
import { safeServerLog } from "@/lib/observability/safe-server-log";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const PRICING_META_KEYS = ["pages.pricing.title", "pages.pricing.description"] as const;
const PRICING_TITLE_FALLBACK = "Pricing | NurseNest";
const PRICING_DESCRIPTION_FALLBACK =
  "NurseNest plans by exam pathway, with practice questions, clinical lessons, flashcards, and mock exams.";

async function loadPricingPageMetadataMessagesSafe(
  locale: string,
): Promise<Record<(typeof PRICING_META_KEYS)[number], string>> {
  try {
    const m = await loadMarketingMetadataMessages(locale, [...PRICING_META_KEYS]);
    return {
      "pages.pricing.title": m["pages.pricing.title"] ?? PRICING_TITLE_FALLBACK,
      "pages.pricing.description": m["pages.pricing.description"] ?? PRICING_DESCRIPTION_FALLBACK,
    };
  } catch (error) {
    safeServerLog("billing", "localized_pricing_page_metadata_messages_fallback", {
      locale,
      detail: (error instanceof Error ? error.message : String(error)).slice(0, 300),
    });
    return {
      "pages.pricing.title": MARKETING_PRICING_CONVERSION_H1_FALLBACK || PRICING_TITLE_FALLBACK,
      "pages.pricing.description": MARKETING_PRICING_CONVERSION_LEAD_FALLBACK || PRICING_DESCRIPTION_FALLBACK,
    };
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return safeGenerateMetadata(
    async () => {
      const m = await loadMarketingMetadataMessages(locale, [...PRICING_META_KEYS]);
      const alt = marketingAlternatesSharedPage(locale, "/pricing");
      return {
        title: m["pages.pricing.title"]!,
        description: m["pages.pricing.description"]!,
        alternates: { canonical: alt.canonical, languages: alt.languages },
        openGraph: {
          title: m["pages.pricing.title"]!,
          description: m["pages.pricing.description"]!,
          url: alt.canonical,
          type: "website",
        },
      };
    },
    { pathname: `/${locale}/pricing`, locale, routeGroup: "marketing.locale.pricing" },
  );
}

/** `params` + `searchParams` only — shards + JSON-LD stream in the deferred branch after plans. */
export default async function LocalizedPricingPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const resolvedSearch = searchParams ? await searchParams : {};
  const initialSearchParamsString = serializeMarketingPageSearchParams(resolvedSearch);
  const m = await loadPricingPageMetadataMessagesSafe(locale);

  return (
    <>
      <WebPageJsonLd
        {...buildMarketingWebPageJsonLdProps({
          locale,
          enPath: "/pricing",
          title: m["pages.pricing.title"]!,
          description: m["pages.pricing.description"]!,
        })}
      />
      <Suspense fallback={null}>
        <PricingMarketingPlansRscLocalized
          locale={locale}
          initialSearchParamsString={initialSearchParamsString}
        />
      </Suspense>
      <Suspense fallback={null}>
        <PricingDeferredSeoLocalized locale={locale} />
      </Suspense>
    </>
  );
}
