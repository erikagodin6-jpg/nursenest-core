import type { Metadata } from "next";
import { LegalDocMarketingView } from "@/components/legal/legal-doc-marketing-view";
import { absoluteUrl } from "@/lib/seo/site-origin";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const path = `/${locale}/acceptable-use`;
  return {
    title: "Acceptable Use & Content Protection | NurseNest",
    description: "Rules for fair use of NurseNest content, anti-scraping, and account protection.",
    alternates: { canonical: absoluteUrl(path) },
    robots: { index: true, follow: true },
  };
}

export default async function LocalizedAcceptableUsePage({ params }: Props) {
  const { locale } = await params;
  return (
    <LegalDocMarketingView
      docId="acceptable-use-policy"
      breadcrumbLabel="Acceptable use"
      path={`/${locale}/acceptable-use`}
    />
  );
}
