import type { Metadata } from "next";
import { LegalDocMarketingView } from "@/components/legal/legal-doc-marketing-view";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return safeGenerateMetadata(
    async () => {
      const alt = marketingAlternatesSharedPage(locale, "/editorial-policy");
      return {
        title: "Editorial Policy | NurseNest",
        description:
          "How NurseNest authors, reviews, and maintains exam preparation and nursing education content for accuracy and trust.",
        alternates: { canonical: alt.canonical, languages: alt.languages },
        robots: { index: true, follow: true },
        openGraph: { title: "Editorial Policy | NurseNest", url: alt.canonical, type: "website" },
      };
    },
    { pathname: `/${locale}/editorial-policy`, locale, routeGroup: "marketing.locale.legal" },
  );
}

export default async function LocalizedEditorialPolicyPage({ params }: Props) {
  const { locale } = await params;
  return (
    <LegalDocMarketingView
      docId="editorial-policy"
      breadcrumbLabel="Editorial policy"
      path={`/${locale}/editorial-policy`}
    />
  );
}
