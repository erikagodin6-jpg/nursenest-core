import type { Metadata } from "next";
import { Suspense } from "react";
import {
  PricingDeferredSeoDefault,
  PricingMarketingPlansRscDefault,
} from "@/components/marketing/pricing-page-rsc-parts";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { serializeMarketingPageSearchParams } from "@/lib/marketing/serialize-marketing-search-params";
import { loadMarketingMetadataMessages } from "@/lib/marketing-i18n/load-marketing-metadata-messages";
import { marketingPricingBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

const PRICING_META_KEYS = ["pages.pricing.title", "pages.pricing.description"] as const;

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

/**
 * Resolves quickly (searchParams only) so `loading.tsx` does not block on FAQ / i18n shards.
 * Plan cards stream in the first Suspense branch; JSON-LD + FAQ follow in parallel.
 */
export default async function PricingPage({ searchParams }: PricingPageProps) {
  const resolvedSearch = searchParams ? await searchParams : {};
  const initialSearchParamsString = serializeMarketingPageSearchParams(resolvedSearch);
  const { crumbs } = marketingPricingBreadcrumbs();

  return (
    <>
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
