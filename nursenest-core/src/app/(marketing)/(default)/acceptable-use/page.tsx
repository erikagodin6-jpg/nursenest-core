import type { Metadata } from "next";
import { LegalDocMarketingView } from "@/components/legal/legal-doc-marketing-view";
import { simpleMarketingBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => {
      const alt = marketingAlternatesSharedPage(DEFAULT_MARKETING_LOCALE, "/acceptable-use");
      return {
        title: "Acceptable Use & Content Protection | NurseNest",
        description: "Rules for fair use of NurseNest content, anti-scraping, and account protection.",
        alternates: { canonical: alt.canonical, languages: alt.languages },
        robots: { index: true, follow: true },
        openGraph: { title: "Acceptable Use & Content Protection | NurseNest", url: alt.canonical, type: "website" },
      };
    },
    { pathname: "/acceptable-use", locale: DEFAULT_MARKETING_LOCALE, routeGroup: "marketing.default.legal" },
  );
}

export default async function AcceptableUsePage() {
  return (
    <LegalDocMarketingView
      docId="acceptable-use-policy"
      breadcrumbResolution={simpleMarketingBreadcrumbs("Acceptable use", "/acceptable-use")}
    />
  );
}
