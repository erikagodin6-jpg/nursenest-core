import type { Metadata } from "next";
import { LegalDocMarketingView } from "@/components/legal/legal-doc-marketing-view";
import { simpleMarketingBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const alt = marketingAlternatesSharedPage(locale, "/acceptable-use");
  return {
    title: "Acceptable Use & Content Protection | NurseNest",
    description: "Rules for fair use of NurseNest content, anti-scraping, and account protection.",
    alternates: { canonical: alt.canonical, languages: alt.languages },
    robots: { index: true, follow: true },
    openGraph: { title: "Acceptable Use & Content Protection | NurseNest", url: alt.canonical, type: "website" },
  };
}

export default async function LocalizedAcceptableUsePage({ params }: Props) {
  const { locale } = await params;
  const path = `/${locale}/acceptable-use`;
  return (
    <LegalDocMarketingView
      docId="acceptable-use-policy"
      breadcrumbResolution={simpleMarketingBreadcrumbs("Acceptable use", path)}
    />
  );
}
