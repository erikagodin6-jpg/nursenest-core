import type { Metadata } from "next";
import { Suspense } from "react";
import {
  PricingDeferredSeoDefault,
  PricingMarketingPlansRscDefault,
} from "@/components/marketing/pricing-page-rsc-parts";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { WebPageJsonLd } from "@/components/seo/seo-json-ld";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { serializeMarketingPageSearchParams } from "@/lib/marketing/serialize-marketing-search-params";
import { loadMarketingMetadataMessages } from "@/lib/marketing-i18n/load-marketing-metadata-messages";
import { marketingPricingBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { buildMarketingWebPageJsonLdProps } from "@/lib/seo/marketing-webpage-jsonld";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import {
  MARKETING_PRICING_CONVERSION_H1_FALLBACK,
  MARKETING_PRICING_CONVERSION_LEAD_FALLBACK,
} from "@/lib/marketing-i18n/marketing-safe-fallbacks";
import { safeServerLog } from "@/lib/observability/safe-server-log";

const PRICING_META_KEYS = ["pages.pricing.title", "pages.pricing.description"] as const;
const PRICING_TITLE_FALLBACK = "Pricing | NurseNest";
const PRICING_DESCRIPTION_FALLBACK =
  "NurseNest plans by exam pathway, with practice questions, clinical lessons, flashcards, and mock exams.";

// 🧊 ISR window: pricing content changes infrequently.
// Revalidates at most every hour. Individual plan data can be stale up to 1h.
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => {
      const m = await loadMarketingMetadataMessages(DEFAULT_MARKETING_LOCALE, [...PRICING_META_KEYS]);
      const alt = marketingAlternatesSharedPage(DEFAULT_MARKETING_LOCALE, "/pricing");
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
    { pathname: "/pricing", locale: DEFAULT_MARKETING_LOCALE, routeGroup: "marketing.default.pricing" },
  );
}

type PricingPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

async function loadPricingPageMetadataMessagesSafe(): Promise<Record<(typeof PRICING_META_KEYS)[number], string>> {
  try {
    const m = await loadMarketingMetadataMessages(DEFAULT_MARKETING_LOCALE, [...PRICING_META_KEYS]);
    return {
      "pages.pricing.title": m["pages.pricing.title"] ?? PRICING_TITLE_FALLBACK,
      "pages.pricing.description": m["pages.pricing.description"] ?? PRICING_DESCRIPTION_FALLBACK,
    };
  } catch (error) {
    safeServerLog("billing", "pricing_page_metadata_messages_fallback", {
      detail: (error instanceof Error ? error.message : String(error)).slice(0, 300),
    });
    return {
      "pages.pricing.title": MARKETING_PRICING_CONVERSION_H1_FALLBACK || PRICING_TITLE_FALLBACK,
      "pages.pricing.description": MARKETING_PRICING_CONVERSION_LEAD_FALLBACK || PRICING_DESCRIPTION_FALLBACK,
    };
  }
}

/**
 * Resolves quickly (searchParams only) so `loading.tsx` does not block on FAQ / i18n shards.
 * Plan cards stream in the first Suspense branch; JSON-LD + FAQ follow in parallel.
 *
 * 🧊 ISR-compatible: no force-dynamic needed. searchParams access is safe during ISR.
 */
export default async function PricingPage({ searchParams }: PricingPageProps) {
  const resolvedSearch = searchParams ? await searchParams : {};
  const initialSearchParamsString = serializeMarketingPageSearchParams(resolvedSearch);
  const { crumbs } = marketingPricingBreadcrumbs();
  const m = await loadPricingPageMetadataMessagesSafe();

  return (
    <>
      <WebPageJsonLd
        {...buildMarketingWebPageJsonLdProps({
          locale: DEFAULT_MARKETING_LOCALE,
          enPath: "/pricing",
          title: m["pages.pricing.title"]!,
          description: m["pages.pricing.description"]!,
        })}
      />
      <div className="mx-auto max-w-6xl nn-marketing-x pb-1 pt-1 sm:pb-2 sm:pt-2">
        <BreadcrumbTrail items={crumbs} />
      </div>
      <Suspense fallback={null}>
        <PricingMarketingPlansRscDefault initialSearchParamsString={initialSearchParamsString} />
      </Suspense>
      <Suspense fallback={null}>
        <PricingDeferredSeoDefault />
      </Suspense>
    </>
  );
}
