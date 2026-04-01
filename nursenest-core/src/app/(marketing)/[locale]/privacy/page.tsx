import type { Metadata } from "next";
import { LegalDocMarketingView } from "@/components/legal/legal-doc-marketing-view";
import { absoluteUrl } from "@/lib/seo/site-origin";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const path = `/${locale}/privacy`;
  return {
    title: "Privacy Policy | NurseNest",
    description: "How NurseNest collects, uses, stores, and protects personal information.",
    alternates: { canonical: absoluteUrl(path) },
    robots: { index: true, follow: true },
    openGraph: {
      title: "Privacy Policy | NurseNest",
      url: absoluteUrl(path),
      type: "website",
    },
  };
}

export default async function LocalizedPrivacyPage({ params }: Props) {
  const { locale } = await params;
  return <LegalDocMarketingView docId="privacy-policy" breadcrumbLabel="Privacy Policy" path={`/${locale}/privacy`} />;
}
