import type { Metadata } from "next";
import { MarketingPricingPage } from "@/components/marketing/marketing-pricing-page";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { getMarketingLocaleForDefaultRoute } from "@/lib/i18n/marketing-locale-server";
import { marketingPricingBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { absoluteUrl } from "@/lib/seo/site-origin";

export const metadata: Metadata = {
  title: "Pricing and plans | NurseNest",
  description:
    "NurseNest plans by exam pathway: full question bank, lessons, flashcards, planner, readiness, timed mocks, and saved history. Try starter questions before checkout.",
  alternates: { canonical: absoluteUrl("/pricing") },
  openGraph: {
    title: "Pricing and plans | NurseNest",
    description:
      "Pathway-aligned plans: bank, lessons, flashcards, planner, readiness, and mocks in one subscription. Secure checkout with Stripe.",
    url: absoluteUrl("/pricing"),
    type: "website",
  },
};

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
