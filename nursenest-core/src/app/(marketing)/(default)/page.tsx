import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { FaqJsonLd } from "@/components/seo/faq-json-ld";
import { WebPageJsonLd } from "@/components/seo/seo-json-ld";
import { MARKETING_HOME_FAQ_JSONLD } from "@/lib/seo/marketing-home-faq-schema";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import HomeRestoredClient from "@/components/marketing/home-restored-client";
import { marketingHomeSurfaceBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { buildMarketingWebPageJsonLdProps } from "@/lib/seo/marketing-webpage-jsonld";
import { resolveMarketingCopy } from "@/lib/marketing-i18n-core";
import { defaultHomeMetaDescription, defaultHomeMetaTitle } from "@/lib/marketing/nursing-tier-public-labels";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { ExamSelectorGate } from "@/components/onboarding/exam-selector-gate";

/** ISR: homepage shell — static with 10-min revalidation. No cookies; locale/region defaults to en/US. */
export const revalidate = 600;

const STATIC_LOCALE = DEFAULT_MARKETING_LOCALE;
const STATIC_REGION = "US" as const;

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => {
      const m = await loadMarketingMessages(STATIC_LOCALE);
      const title = resolveMarketingCopy(m, "pages.home.metaTitleUS", m, defaultHomeMetaTitle(STATIC_REGION));
      const description = resolveMarketingCopy(
        m,
        "pages.home.metaDescriptionUS",
        m,
        defaultHomeMetaDescription(STATIC_REGION),
      );
      const alt = marketingAlternatesSharedPage(STATIC_LOCALE, "/");
      return {
        title,
        description,
        alternates: { canonical: alt.canonical, languages: alt.languages },
        openGraph: {
          title,
          description,
          url: alt.canonical,
          type: "website",
        },
      };
    },
    { pathname: "/", routeGroup: "marketing.default.home" },
  );
}

export default async function HomePage() {
  const m = await loadMarketingMessages(STATIC_LOCALE);
  const title = resolveMarketingCopy(m, "pages.home.metaTitleUS", m, defaultHomeMetaTitle(STATIC_REGION));
  const description = resolveMarketingCopy(
    m,
    "pages.home.metaDescriptionUS",
    m,
    defaultHomeMetaDescription(STATIC_REGION),
  );
  const { crumbs, schemaItems } = marketingHomeSurfaceBreadcrumbs();
  return (
    <>
      <WebPageJsonLd
        {...buildMarketingWebPageJsonLdProps({
          locale: STATIC_LOCALE,
          enPath: "/",
          title,
          description,
        })}
      />
      <BreadcrumbJsonLd items={schemaItems} />
      <FaqJsonLd items={MARKETING_HOME_FAQ_JSONLD} />
      {crumbs.length > 0 ? (
        <div className="mx-auto max-w-7xl px-4 pt-2 sm:px-6 sm:pt-3 lg:px-8">
          <BreadcrumbTrail items={crumbs} />
        </div>
      ) : null}
      <HomeRestoredClient />
      <section className="mx-auto mt-6 w-full max-w-7xl px-4 pb-2 sm:px-6 lg:px-8">
        <div className="nn-card border border-[var(--border-subtle)] bg-[var(--theme-card-bg)] p-5">
          <h2 className="text-lg font-semibold text-[var(--theme-heading-text)]">From the NurseNest blog</h2>
          <p className="mt-1 text-sm text-[var(--theme-muted-text)]">
            Fresh NCLEX guides, symptom explainers, and clinical breakdowns are published daily.
          </p>
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            <Link href="/blog" className="font-semibold text-primary hover:underline">
              View all blog posts
            </Link>
            <Link href="/blog/tag/nclex" className="font-medium text-primary hover:underline">
              NCLEX guides
            </Link>
            <Link href="/blog/tag/clinical-reasoning" className="font-medium text-primary hover:underline">
              Clinical reasoning
            </Link>
          </div>
        </div>
      </section>
      <ExamSelectorGate />
    </>
  );
}
