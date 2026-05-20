import type { Metadata } from "next";
import { HowItWorksPageClient } from "@/components/marketing/how-it-works-page-client";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { WebPageJsonLd } from "@/components/seo/seo-json-ld";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { simpleMarketingBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { buildMarketingWebPageJsonLdProps } from "@/lib/seo/marketing-webpage-jsonld";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";


export const dynamic = "force-dynamic";

const PAGE_TITLE = "How NurseNest Works — Adaptive Exam Prep System";
const PAGE_DESCRIPTION =
  "See how NurseNest guides you step-by-step through baseline testing, personalised study plans, smart review, and readiness tracking to help you pass your nursing exam.";

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => {
      const alt = marketingAlternatesSharedPage(DEFAULT_MARKETING_LOCALE, "/how-it-works");
      return {
        title: PAGE_TITLE,
        description: PAGE_DESCRIPTION,
        alternates: { canonical: alt.canonical, languages: alt.languages },
        robots: { index: true, follow: true },
        openGraph: {
          title: PAGE_TITLE,
          description: PAGE_DESCRIPTION,
          url: alt.canonical,
          type: "website",
          siteName: "NurseNest",
        },
        twitter: {
          card: "summary_large_image",
          title: PAGE_TITLE,
          description: PAGE_DESCRIPTION,
        },
      };
    },
    {
      pathname: "/how-it-works",
      locale: DEFAULT_MARKETING_LOCALE,
      routeGroup: "marketing.default.howItWorks",
    },
  );
}

export default function HowItWorksPage() {
  const { crumbs, schemaItems } = simpleMarketingBreadcrumbs("How It Works", "/how-it-works");
  return (
    <>
      <WebPageJsonLd
        {...buildMarketingWebPageJsonLdProps({
          locale: DEFAULT_MARKETING_LOCALE,
          enPath: "/how-it-works",
          title: PAGE_TITLE,
          description: PAGE_DESCRIPTION,
        })}
      />
      <BreadcrumbJsonLd items={schemaItems} />
      <div className="mx-auto max-w-6xl nn-marketing-x pb-[var(--nn-rhythm-tight-y)] pt-[var(--nn-rhythm-page-y)]">
        <BreadcrumbTrail items={crumbs} />
      </div>
      <HowItWorksPageClient />
    </>
  );
}
