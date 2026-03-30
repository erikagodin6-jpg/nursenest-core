import type { Metadata } from "next";
import { MarketingPricingPage } from "@/components/marketing/marketing-pricing-page";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { marketingPricingBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { absoluteUrl } from "@/lib/seo/site-origin";

export const metadata: Metadata = {
  title: "Pricing and plans | NurseNest",
  description:
    "NurseNest plans by exam pathway: practice questions, lessons, timed exams, and score history. Try free questions before you subscribe.",
  alternates: { canonical: absoluteUrl("/pricing") },
  openGraph: {
    title: "Pricing and plans | NurseNest",
    description:
      "Choose a pathway-aligned plan. Questions, lessons, and mock exams stay in one subscription with Stripe checkout.",
    url: absoluteUrl("/pricing"),
    type: "website",
  },
};

export default function PricingPage() {
  const { crumbs, schemaItems } = marketingPricingBreadcrumbs();
  return (
    <>
      <BreadcrumbJsonLd items={schemaItems} />
      <div className="mx-auto max-w-6xl px-4 pt-4 sm:px-6 lg:px-8">
        <BreadcrumbTrail items={crumbs} />
      </div>
      <MarketingPricingPage locale="en" />
    </>
  );
}
