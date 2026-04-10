import type { Metadata } from "next";
import { LegalDocMarketingView } from "@/components/legal/legal-doc-marketing-view";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return safeGenerateMetadata(
    async () => {
      const alt = marketingAlternatesSharedPage(locale, "/disclaimer");
      return {
        title: "Educational Disclaimer | NurseNest",
        description: "NurseNest is for educational use only. It is not medical advice and does not guarantee exam results.",
        alternates: { canonical: alt.canonical, languages: alt.languages },
        robots: { index: true, follow: true },
        openGraph: { title: "Educational Disclaimer | NurseNest", url: alt.canonical, type: "website" },
      };
    },
    { pathname: `/${locale}/disclaimer`, locale, routeGroup: "marketing.locale.legal" },
  );
}

export default async function LocalizedDisclaimerPage({ params }: Props) {
  const { locale } = await params;
  return (
    <LegalDocMarketingView docId="educational-disclaimer" breadcrumbLabel="Disclaimer" path={`/${locale}/disclaimer`} />
  );
}
