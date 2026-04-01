import type { Metadata } from "next";
import { LegalDocMarketingView } from "@/components/legal/legal-doc-marketing-view";
import { absoluteUrl } from "@/lib/seo/site-origin";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const path = `/${locale}/contact`;
  return {
    title: "Contact & Support | NurseNest",
    description: "Contact NurseNest for billing help, privacy requests, and product support.",
    alternates: { canonical: absoluteUrl(path) },
    robots: { index: true, follow: true },
  };
}

export default async function LocalizedContactPage({ params }: Props) {
  const { locale } = await params;
  return <LegalDocMarketingView docId="contact" breadcrumbLabel="Contact" path={`/${locale}/contact`} />;
}
