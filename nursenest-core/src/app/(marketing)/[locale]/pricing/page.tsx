import type { Metadata } from "next";
import { MarketingPricingPage } from "@/components/marketing/marketing-pricing-page";
import { FaqJsonLd } from "@/components/seo/faq-json-ld";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { WebPageJsonLd } from "@/components/seo/seo-json-ld";
import { loadMarketingLayoutShardsOverlay } from "@/lib/marketing-i18n/load-marketing-route-shard-bundles";
import { loadMarketingMetadataMessages } from "@/lib/marketing-i18n/load-marketing-metadata-messages";
import { localizeBreadcrumbResolution } from "@/lib/seo/breadcrumb-i18n";
import { marketingPricingBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { buildMarketingWebPageJsonLdProps } from "@/lib/seo/marketing-webpage-jsonld";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

type Props = { params: Promise<{ locale: string }> };

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

export default async function LocalizedPricingPage({ params }: Props) {
  const { locale } = await params;
  const raw = marketingPricingBreadcrumbs();
  const messages = await loadMarketingLayoutShardsOverlay(locale);
  const { crumbs, schemaItems } = localizeBreadcrumbResolution(raw, messages);
  const pricingFaqJsonLd = [
    {
      question: messages["pages.pricing.regionFaq.usCanadaQuestion"],
      answer: messages["pages.pricing.regionFaq.usCanadaAnswer"],
    },
    {
      question: messages["pages.pricing.regionFaq.correctExamQuestion"],
      answer: messages["pages.pricing.regionFaq.correctExamAnswer"],
    },
    {
      question: messages["pages.pricing.regionFaq.switchCountryQuestion"],
      answer: messages["pages.pricing.regionFaq.switchCountryAnswer"],
    },
    {
      question: messages["pages.pricing.reliabilityFaq.siteCrashQuestion"],
      answer: messages["pages.pricing.reliabilityFaq.siteCrashAnswer"],
    },
    {
      question: messages["pages.pricing.reliabilityFaq.slowExperienceQuestion"],
      answer: messages["pages.pricing.reliabilityFaq.slowExperienceAnswer"],
    },
    {
      question: messages["pages.pricing.reliabilityFaq.studyReliabilityQuestion"],
      answer: messages["pages.pricing.reliabilityFaq.studyReliabilityAnswer"],
    },
    {
      question: messages["pages.pricing.learnerFaq.passGuaranteeQuestion"],
      answer: messages["pages.pricing.learnerFaq.passGuaranteeAnswer"],
    },
    {
      question: messages["pages.pricing.learnerFaq.startingBehindQuestion"],
      answer: messages["pages.pricing.learnerFaq.startingBehindAnswer"],
    },
    {
      question: messages["pages.pricing.learnerFaq.tryBeforePayQuestion"],
      answer: messages["pages.pricing.learnerFaq.tryBeforePayAnswer"],
    },
    {
      question: messages["pages.pricing.learnerFaq.examRealismQuestion"],
      answer: messages["pages.pricing.learnerFaq.examRealismAnswer"],
    },
    {
      question: messages["pages.pricing.learnerFaq.refundRemorseQuestion"],
      answer: messages["pages.pricing.learnerFaq.refundRemorseAnswer"],
    },
  ];
  return (
    <>
      <WebPageJsonLd
        {...buildMarketingWebPageJsonLdProps({
          locale,
          enPath: "/pricing",
          title: messages["pages.pricing.title"],
          description: messages["pages.pricing.description"],
        })}
      />
      <BreadcrumbJsonLd items={schemaItems} />
      <FaqJsonLd items={pricingFaqJsonLd} />
      <div className="mx-auto max-w-6xl px-4 pb-2 pt-2 sm:px-6 sm:pb-3 sm:pt-3 lg:px-8">
        <BreadcrumbTrail items={crumbs} />
      </div>
      <MarketingPricingPage locale={locale} />
    </>
  );
}
