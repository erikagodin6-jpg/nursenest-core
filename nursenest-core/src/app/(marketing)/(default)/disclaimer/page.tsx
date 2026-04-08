import type { Metadata } from "next";
import { LegalDocMarketingView } from "@/components/legal/legal-doc-marketing-view";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";

export async function generateMetadata(): Promise<Metadata> {
  const alt = marketingAlternatesSharedPage(DEFAULT_MARKETING_LOCALE, "/disclaimer");
  return {
    title: "Educational Disclaimer | NurseNest",
    description: "NurseNest is for educational use only, not medical advice or a guarantee of exam results.",
    alternates: { canonical: alt.canonical, languages: alt.languages },
    robots: { index: true, follow: true },
    openGraph: { title: "Educational Disclaimer | NurseNest", url: alt.canonical, type: "website" },
  };
}

export default async function DisclaimerPage() {
  return <LegalDocMarketingView docId="educational-disclaimer" breadcrumbLabel="Disclaimer" path="/disclaimer" />;
}
