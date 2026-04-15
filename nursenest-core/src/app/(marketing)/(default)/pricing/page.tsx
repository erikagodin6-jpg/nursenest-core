import type { Metadata } from "next";
import { MarketingPricingPage } from "@/components/marketing/marketing-pricing-page";
import { FaqJsonLd } from "@/components/seo/faq-json-ld";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { WebPageJsonLd } from "@/components/seo/seo-json-ld";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { getMarketingLocaleForDefaultRoute } from "@/lib/i18n/marketing-locale-server";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";
import { marketingPricingBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { buildMarketingWebPageJsonLdProps } from "@/lib/seo/marketing-webpage-jsonld";
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
  const m = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
  const mLocale = await loadMarketingMessages(locale);
  const pricingFaqJsonLd = [
    {
      question: mLocale["pages.pricing.regionFaq.usCanadaQuestion"],
      answer: mLocale["pages.pricing.regionFaq.usCanadaAnswer"],
    },
    {
      question: mLocale["pages.pricing.regionFaq.correctExamQuestion"],
      answer: mLocale["pages.pricing.regionFaq.correctExamAnswer"],
    },
    {
      question: mLocale["pages.pricing.regionFaq.switchCountryQuestion"],
      answer: mLocale["pages.pricing.regionFaq.switchCountryAnswer"],
    },
    {
      question: mLocale["pages.pricing.reliabilityFaq.siteCrashQuestion"],
      answer: mLocale["pages.pricing.reliabilityFaq.siteCrashAnswer"],
    },
    {
      question: mLocale["pages.pricing.reliabilityFaq.slowExperienceQuestion"],
      answer: mLocale["pages.pricing.reliabilityFaq.slowExperienceAnswer"],
    },
    {
      question: mLocale["pages.pricing.reliabilityFaq.studyReliabilityQuestion"],
      answer: mLocale["pages.pricing.reliabilityFaq.studyReliabilityAnswer"],
    },
    {
      question: mLocale["pages.pricing.learnerFaq.passGuaranteeQuestion"],
      answer: mLocale["pages.pricing.learnerFaq.passGuaranteeAnswer"],
    },
    {
      question: mLocale["pages.pricing.learnerFaq.startingBehindQuestion"],
      answer: mLocale["pages.pricing.learnerFaq.startingBehindAnswer"],
    },
    {
      question: mLocale["pages.pricing.learnerFaq.tryBeforePayQuestion"],
      answer: mLocale["pages.pricing.learnerFaq.tryBeforePayAnswer"],
    },
    {
      question: mLocale["pages.pricing.learnerFaq.examRealismQuestion"],
      answer: mLocale["pages.pricing.learnerFaq.examRealismAnswer"],
    },
    {
      question: mLocale["pages.pricing.learnerFaq.refundRemorseQuestion"],
      answer: mLocale["pages.pricing.learnerFaq.refundRemorseAnswer"],
    },
  ];
  return (
    <>
      <WebPageJsonLd
        {...buildMarketingWebPageJsonLdProps({
          locale: DEFAULT_MARKETING_LOCALE,
          enPath: "/pricing",
          title: m["pages.pricing.title"],
          description: m["pages.pricing.description"],
        })}
      />
      <BreadcrumbJsonLd items={schemaItems} />
      <FaqJsonLd items={pricingFaqJsonLd} />
      <div className="mx-auto max-w-6xl nn-marketing-x pb-[var(--nn-rhythm-tight-y)] pt-[var(--nn-rhythm-page-y)]">
        <BreadcrumbTrail items={crumbs} />
      </div>
      <MarketingPricingPage locale={locale} />
    </>
  );
}
