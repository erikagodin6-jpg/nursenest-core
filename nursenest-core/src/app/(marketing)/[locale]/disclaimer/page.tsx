import type { Metadata } from "next";
import { LegalDocMarketingView } from "@/components/legal/legal-doc-marketing-view";
import { absoluteUrl } from "@/lib/seo/site-origin";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const path = `/${locale}/disclaimer`;
  return {
    title: "Educational Disclaimer | NurseNest",
    description: "NurseNest is for educational use only—not medical advice or a guarantee of exam results.",
    alternates: { canonical: absoluteUrl(path) },
    robots: { index: true, follow: true },
  };
}

export default async function LocalizedDisclaimerPage({ params }: Props) {
  const { locale } = await params;
  return (
    <LegalDocMarketingView docId="educational-disclaimer" breadcrumbLabel="Disclaimer" path={`/${locale}/disclaimer`} />
  );
}
