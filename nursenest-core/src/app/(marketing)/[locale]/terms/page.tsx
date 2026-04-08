import type { Metadata } from "next";
import { LegalDocMarketingView } from "@/components/legal/legal-doc-marketing-view";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const alt = marketingAlternatesSharedPage(locale, "/terms");
  return {
    title: "Terms of Service | NurseNest",
    description:
      "NurseNest Terms of Service: subscription license, acceptable use, paywall enforcement, billing, disclaimers, and dispute terms.",
    alternates: { canonical: alt.canonical, languages: alt.languages },
    robots: { index: true, follow: true },
    openGraph: {
      title: "Terms of Service | NurseNest",
      description: "Terms governing use of NurseNest exam prep, subscriptions, and content.",
      url: alt.canonical,
      type: "website",
    },
  };
}

export default async function LocalizedTermsPage({ params }: Props) {
  const { locale } = await params;
  return (
    <LegalDocMarketingView docId="terms-of-service" breadcrumbLabel="Terms of Service" path={`/${locale}/terms`} />
  );
}
