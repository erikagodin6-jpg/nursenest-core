import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdvancedEcgMarketingPageView } from "@/components/marketing/advanced-ecg-marketing-page";
import { getAdvancedEcgMarketingPageBySegments } from "@/lib/advanced-ecg/advanced-ecg-marketing-pages";
import { isCoreHostedNonDefaultLocale } from "@/lib/i18n/marketing-locale-policy";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

type Props = {
  params: Promise<{ locale: string; slug?: string[] }>;
};

export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isCoreHostedNonDefaultLocale(locale)) notFound();
  const page = getAdvancedEcgMarketingPageBySegments(slug);
  if (!page) {
    return {
      title: "Advanced ECG page unavailable | NurseNest",
      robots: { index: false, follow: true },
    };
  }
  return safeGenerateMetadata(
    async () => {
      const alt = marketingAlternatesSharedPage(locale, page.path);
      return {
        title: page.title,
        description: page.description,
        alternates: { canonical: alt.canonical, languages: alt.languages },
        openGraph: {
          title: page.title,
          description: page.description,
          url: alt.canonical,
          type: "website",
        },
        twitter: {
          card: "summary_large_image",
          title: page.title,
          description: page.description,
        },
      };
    },
    { pathname: `/${locale}${page.path}`, locale, routeGroup: "marketing.locale.advanced-ecg" },
  );
}

export default async function LocalizedAdvancedEcgMarketingPage({ params }: Props) {
  const { locale, slug } = await params;
  if (!isCoreHostedNonDefaultLocale(locale)) notFound();
  const page = getAdvancedEcgMarketingPageBySegments(slug);
  if (!page) notFound();
  return <AdvancedEcgMarketingPageView locale={locale} segments={slug} />;
}
