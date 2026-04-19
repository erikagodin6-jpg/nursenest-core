import type { Metadata } from "next";
import { LegalDocMarketingView } from "@/components/legal/legal-doc-marketing-view";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";


export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => {
      const alt = marketingAlternatesSharedPage(DEFAULT_MARKETING_LOCALE, "/editorial-policy");
      return {
        title: "Editorial Policy | NurseNest",
        description:
          "How NurseNest authors, reviews, and maintains exam preparation and nursing education content for accuracy and trust.",
        alternates: { canonical: alt.canonical, languages: alt.languages },
        robots: { index: true, follow: true },
        openGraph: { title: "Editorial Policy | NurseNest", url: alt.canonical, type: "website" },
      };
    },
    { pathname: "/editorial-policy", locale: DEFAULT_MARKETING_LOCALE, routeGroup: "marketing.default.legal" },
  );
}

export default async function EditorialPolicyPage() {
  return (
    <LegalDocMarketingView docId="editorial-policy" breadcrumbLabel="Editorial policy" path="/editorial-policy" />
  );
}
