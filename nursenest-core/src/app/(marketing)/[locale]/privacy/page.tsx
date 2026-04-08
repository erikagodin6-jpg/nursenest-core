import type { Metadata } from "next";
import { LegalDocMarketingView } from "@/components/legal/legal-doc-marketing-view";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const alt = marketingAlternatesSharedPage(locale, "/privacy");
  return {
    title: "Privacy Policy | NurseNest",
    description: "How NurseNest collects, uses, stores, and protects personal information.",
    alternates: { canonical: alt.canonical, languages: alt.languages },
    robots: { index: true, follow: true },
    openGraph: {
      title: "Privacy Policy | NurseNest",
      url: alt.canonical,
      type: "website",
    },
  };
}

export default async function LocalizedPrivacyPage({ params }: Props) {
  const { locale } = await params;
  return <LegalDocMarketingView docId="privacy-policy" breadcrumbLabel="Privacy Policy" path={`/${locale}/privacy`} />;
}
