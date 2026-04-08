import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { FaqJsonLd } from "@/components/seo/faq-json-ld";
import { MARKETING_HOME_FAQ_JSONLD } from "@/lib/seo/marketing-home-faq-schema";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import HomeRestoredClient from "@/components/marketing/home-restored-client";
import { HomeStudyNextPreviewSection } from "@/components/marketing/home-study-next-preview-section";
import { getHomepageLessonTeasers } from "@/lib/marketing/homepage-lesson-teasers";
import { buildSimulatedAdaptiveRecommendationsForConversionPreview } from "@/lib/learner/adaptive-recommendations";
import { marketingHomeSurfaceBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";

/** ISR: homepage shell + cached lesson teaser strip (see getHomepageLessonTeasers). */
export const revalidate = 600;

export async function generateMetadata(): Promise<Metadata> {
  const m = await loadMarketingMessages(DEFAULT_MARKETING_LOCALE);
  const alt = marketingAlternatesSharedPage(DEFAULT_MARKETING_LOCALE, "/");
  return {
    title: m["pages.home.metaTitle"],
    description: m["pages.home.metaDescription"],
    alternates: { canonical: alt.canonical, languages: alt.languages },
    openGraph: {
      title: m["pages.home.metaTitle"],
      description: m["pages.home.metaDescription"],
      url: alt.canonical,
      type: "website",
    },
  };
}

export default async function HomePage() {
  const lessonTeasers = await getHomepageLessonTeasers();
  const studyNextPreview = buildSimulatedAdaptiveRecommendationsForConversionPreview();
  const { crumbs, schemaItems } = marketingHomeSurfaceBreadcrumbs();
  return (
    <>
      <BreadcrumbJsonLd items={schemaItems} />
      <FaqJsonLd items={MARKETING_HOME_FAQ_JSONLD} />
      {crumbs.length > 0 ? (
        <div className="mx-auto max-w-7xl px-4 pt-2 sm:px-6 sm:pt-3 lg:px-8">
          <BreadcrumbTrail items={crumbs} />
        </div>
      ) : null}
      <div className="mx-auto max-w-7xl px-4 pb-2 pt-3 sm:px-6 sm:pb-3 sm:pt-4 lg:px-8">
        <HomeStudyNextPreviewSection adaptive={studyNextPreview} />
      </div>
      <HomeRestoredClient lessonTeasers={lessonTeasers} />
    </>
  );
}
