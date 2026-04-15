import type { Metadata } from "next";
import { MarketingPricingPage } from "@/components/marketing/marketing-pricing-page";
import { FaqJsonLd } from "@/components/seo/faq-json-ld";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { WebPageJsonLd } from "@/components/seo/seo-json-ld";
import { localizeBreadcrumbResolution } from "@/lib/seo/breadcrumb-i18n";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";
import { marketingPricingBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { buildMarketingWebPageJsonLdProps } from "@/lib/seo/marketing-webpage-jsonld";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return safeGenerateMetadata(
    async () => {
      const m = await loadMarketingMessages(locale);
      const alt = marketingAlternatesSharedPage(locale, "/pricing");
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
    { pathname: `/${locale}/pricing`, locale, routeGroup: "marketing.locale.pricing" },
  );
}

export default async function LocalizedPricingPage({ params }: Props) {
  const { locale } = await params;
  const raw = marketingPricingBreadcrumbs();
  const primary = await loadMarketingMessages(locale);
  const { crumbs, schemaItems } = localizeBreadcrumbResolution(raw, primary);
  const pricingFaqJsonLd = [
    {
      question: primary["pages.pricing.regionFaq.usCanadaQuestion"],
      answer: primary["pages.pricing.regionFaq.usCanadaAnswer"],
    },
    {
      question: primary["pages.pricing.regionFaq.correctExamQuestion"],
      answer: primary["pages.pricing.regionFaq.correctExamAnswer"],
    },
    {
      question: primary["pages.pricing.regionFaq.switchCountryQuestion"],
      answer: primary["pages.pricing.regionFaq.switchCountryAnswer"],
    },
    {
      question: primary["pages.pricing.reliabilityFaq.siteCrashQuestion"],
      answer: primary["pages.pricing.reliabilityFaq.siteCrashAnswer"],
    },
    {
      question: primary["pages.pricing.reliabilityFaq.slowExperienceQuestion"],
      answer: primary["pages.pricing.reliabilityFaq.slowExperienceAnswer"],
    },
    {
      question: primary["pages.pricing.reliabilityFaq.studyReliabilityQuestion"],
      answer: primary["pages.pricing.reliabilityFaq.studyReliabilityAnswer"],
    },
    {
      question: primary["pages.pricing.learnerFaq.passGuaranteeQuestion"],
      answer: primary["pages.pricing.learnerFaq.passGuaranteeAnswer"],
    },
    {
      question: primary["pages.pricing.learnerFaq.startingBehindQuestion"],
      answer: primary["pages.pricing.learnerFaq.startingBehindAnswer"],
    },
    {
      question: primary["pages.pricing.learnerFaq.tryBeforePayQuestion"],
      answer: primary["pages.pricing.learnerFaq.tryBeforePayAnswer"],
    },
    {
      question: primary["pages.pricing.learnerFaq.examRealismQuestion"],
      answer: primary["pages.pricing.learnerFaq.examRealismAnswer"],
    },
    {
      question: primary["pages.pricing.learnerFaq.refundRemorseQuestion"],
      answer: primary["pages.pricing.learnerFaq.refundRemorseAnswer"],
    },
  ];
  return (
    <>
      <WebPageJsonLd
        {...buildMarketingWebPageJsonLdProps({
          locale,
          enPath: "/pricing",
          title: primary["pages.pricing.title"],
          description: primary["pages.pricing.description"],
        })}
      />
      <BreadcrumbJsonLd items={schemaItems} />
      <FaqJsonLd items={pricingFaqJsonLd} />
      <div className="mx-auto max-w-6xl px-4 pt-4 sm:px-6 lg:px-8">
        <BreadcrumbTrail items={crumbs} />
      </div>
      <MarketingPricingPage locale={locale} />
    </>
  );
}
