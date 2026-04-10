import type { Metadata } from "next";
import { LegalDocMarketingView } from "@/components/legal/legal-doc-marketing-view";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return safeGenerateMetadata(
    async () => {
      const alt = marketingAlternatesSharedPage(locale, "/contact");
      return {
        title: "Contact & Support | NurseNest",
        description: "Contact NurseNest for billing help, privacy requests, and product support.",
        alternates: { canonical: alt.canonical, languages: alt.languages },
        robots: { index: true, follow: true },
        openGraph: { title: "Contact & Support | NurseNest", url: alt.canonical, type: "website" },
      };
    },
    { pathname: `/${locale}/contact`, locale, routeGroup: "marketing.locale.legal" },
  );
}

export default async function LocalizedContactPage({ params }: Props) {
  const { locale } = await params;
  return <LegalDocMarketingView docId="contact" breadcrumbLabel="Contact" path={`/${locale}/contact`} />;
}
