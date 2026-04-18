import type { Metadata } from "next";
import { LegalDocMarketingView } from "@/components/legal/legal-doc-marketing-view";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => {
      const alt = marketingAlternatesSharedPage(DEFAULT_MARKETING_LOCALE, "/privacy");
      return {
        title: "Privacy Policy | NurseNest",
        description: "How NurseNest collects, uses, stores, and protects personal information.",
        alternates: { canonical: alt.canonical, languages: alt.languages },
        robots: { index: true, follow: true },
        openGraph: {
          title: "Privacy Policy | NurseNest",
          url: alt.canonical,
          type: "website",
        },
      };
    },
    { pathname: "/privacy", locale: DEFAULT_MARKETING_LOCALE, routeGroup: "marketing.default.legal" },
  );
}

export default async function PrivacyPolicyPage() {
  return <LegalDocMarketingView docId="privacy-policy" breadcrumbLabel="Privacy Policy" path="/privacy" />;
}
