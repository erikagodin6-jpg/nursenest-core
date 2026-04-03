import type { Metadata } from "next";
import { notFound } from "next/navigation";
import HomeRestoredClient from "@/components/marketing/home-restored-client";
import { getHomepageLessonTeasers } from "@/lib/marketing/homepage-lesson-teasers";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { isCoreHostedNonDefaultLocale } from "@/lib/i18n/marketing-locale-policy";
import { localizeBreadcrumbResolution } from "@/lib/seo/breadcrumb-i18n";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";
import { marketingHomeSurfaceBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";

export const revalidate = 600;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isCoreHostedNonDefaultLocale(locale)) {
    notFound();
  }
  const m = await loadMarketingMessages(locale);
  return {
    title: m["pages.home.metaTitle"],
    description: m["pages.home.metaDescription"],
    alternates: { canonical: `/${locale}` },
  };
}

export default async function LocalizedHomePage({ params }: Props) {
  const { locale } = await params;
  const lessonTeasers = await getHomepageLessonTeasers();
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
      <HomeRestoredClient lessonTeasers={lessonTeasers} />
    </>
  );
}
