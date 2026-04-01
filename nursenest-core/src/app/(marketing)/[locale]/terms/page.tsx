import type { Metadata } from "next";
import { LegalDocMarketingView } from "@/components/legal/legal-doc-marketing-view";
import { absoluteUrl } from "@/lib/seo/site-origin";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const path = `/${locale}/terms`;
  return {
    title: "Terms of Service | NurseNest",
    description:
      "NurseNest Terms of Service: subscription license, acceptable use, paywall enforcement, billing, disclaimers, and dispute terms.",
    alternates: { canonical: absoluteUrl(path) },
    robots: { index: true, follow: true },
    openGraph: {
      title: "Terms of Service | NurseNest",
      description: "Terms governing use of NurseNest exam prep, subscriptions, and content.",
      url: absoluteUrl(path),
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
