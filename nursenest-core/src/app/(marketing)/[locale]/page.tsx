import type { Metadata } from "next";
import { notFound } from "next/navigation";
import HomeRestoredClient from "@/components/marketing/home-restored-client";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { FaqJsonLd } from "@/components/seo/faq-json-ld";
import { MARKETING_HOME_FAQ_JSONLD } from "@/lib/seo/marketing-home-faq-schema";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { isCoreHostedNonDefaultLocale } from "@/lib/i18n/marketing-locale-policy";
import { localizeBreadcrumbResolution } from "@/lib/seo/breadcrumb-i18n";
import { loadMarketingMessages } from "@/lib/marketing-i18n/load-marketing-messages";
import { marketingHomeSurfaceBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";

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
  const raw = marketingHomeSurfaceBreadcrumbs();
  const primary = await loadMarketingMessages(locale);
  const { crumbs, schemaItems } = localizeBreadcrumbResolution(raw, primary);
  return (
    <>
      <BreadcrumbJsonLd items={schemaItems} />
      <FaqJsonLd items={MARKETING_HOME_FAQ_JSONLD} />
      {crumbs.length > 0 ? (
        <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
          <BreadcrumbTrail items={crumbs} />
        </div>
      ) : null}
      <HomeRestoredClient />
    </>
  );
}
