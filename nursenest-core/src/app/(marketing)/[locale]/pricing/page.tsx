import type { Metadata } from "next";
import { Suspense } from "react";
import {
  PricingDeferredSeoLocalized,
  PricingMarketingPlansRscLocalized,
} from "@/components/marketing/pricing-page-rsc-parts";
import { loadMarketingMetadataMessages } from "@/lib/marketing-i18n/load-marketing-metadata-messages";
import { serializeMarketingPageSearchParams } from "@/lib/marketing/serialize-marketing-search-params";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const PRICING_META_KEYS = ["pages.pricing.title", "pages.pricing.description"] as const;

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

  return (
    <>
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
