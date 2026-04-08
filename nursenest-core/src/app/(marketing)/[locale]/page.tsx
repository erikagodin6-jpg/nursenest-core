import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import HomeRestoredClient from "@/components/marketing/home-restored-client";
import { getHomepageLessonTeasers } from "@/lib/marketing/homepage-lesson-teasers";
import { buildSimulatedAdaptiveRecommendationsForConversionPreview } from "@/lib/learner/adaptive-recommendations";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { isCoreHostedNonDefaultLocale } from "@/lib/i18n/marketing-locale-policy";
import { localizeBreadcrumbResolution } from "@/lib/seo/breadcrumb-i18n";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";
import { marketingHomeSurfaceBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";

const HomeStudyNextPreviewSection = dynamic(
  () =>
    import("@/components/marketing/home-study-next-preview-section").then((mod) => ({
      default: mod.HomeStudyNextPreviewSection,
    })),
  {
    loading: () => (
      <div className="mx-auto max-w-7xl px-4 pb-2 pt-3 sm:px-6 sm:pb-3 sm:pt-4 lg:px-8">
        <div
          className="nn-card min-h-[240px] animate-pulse rounded-xl border border-[var(--border-subtle)] bg-[var(--nn-presentation-wash)] p-5 sm:p-6"
          aria-hidden
        />
      </div>
    ),
  },
);

export const revalidate = 600;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isCoreHostedNonDefaultLocale(locale)) {
    notFound();
  }
  const m = await loadMarketingMessages(locale);
  const alt = marketingAlternatesSharedPage(locale, "/");
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

export default async function LocalizedHomePage({ params }: Props) {
  const { locale } = await params;
  const lessonTeasers = await getHomepageLessonTeasers();
  const studyNextPreview = buildSimulatedAdaptiveRecommendationsForConversionPreview();
  const raw = marketingHomeSurfaceBreadcrumbs();
  const primary = await loadMarketingMessages(locale);
  const { crumbs, schemaItems } = localizeBreadcrumbResolution(raw, primary);
  return (
    <>
      <BreadcrumbJsonLd items={schemaItems} />
      {crumbs.length > 0 ? (
        <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
          <BreadcrumbTrail items={crumbs} />
        </div>
      ) : null}
      <div className="mx-auto max-w-7xl px-4 pb-2 pt-3 sm:px-6 sm:pb-3 sm:pt-4 lg:px-8">
        <HomeStudyNextPreviewSection
          adaptive={studyNextPreview}
          pricingHref={withMarketingLocale(locale, "/pricing")}
          signupHref={withMarketingLocale(locale, "/signup")}
        />
      </div>
      <HomeRestoredClient lessonTeasers={lessonTeasers} />
    </>
  );
}
