import type { Metadata } from "next";
import { MarketingPricingPage } from "@/components/marketing/marketing-pricing-page";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { getMarketingLocaleForDefaultRoute } from "@/lib/i18n/marketing-locale-server";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";
import { marketingPricingBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => {
      const m = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
      const alt = marketingAlternatesSharedPage(DEFAULT_MARKETING_LOCALE, "/pricing");
      return {
        title: m["pages.pricing.title"],
        description: m["pages.pricing.description"],
        alternates: { canonical: alt.canonical, languages: alt.languages },
        openGraph: {
          title: m["pages.pricing.title"],
          description: m["pages.pricing.description"],
          url: alt.canonical,
          type: "website",
        },
      };
    },
    { pathname: "/pricing", locale: DEFAULT_MARKETING_LOCALE, routeGroup: "marketing.default.pricing" },
  );
}

export default async function PricingPage() {
  const { crumbs, schemaItems } = marketingPricingBreadcrumbs();
  const locale = await getMarketingLocaleForDefaultRoute();
  return (
    <>
      <BreadcrumbJsonLd items={schemaItems} />
      <div className="mx-auto max-w-6xl nn-marketing-x pb-[var(--nn-rhythm-tight-y)] pt-[var(--nn-rhythm-page-y)]">
        <BreadcrumbTrail items={crumbs} />
      </div>
      <MarketingPricingPage locale={locale} />
    </>
  );
}
