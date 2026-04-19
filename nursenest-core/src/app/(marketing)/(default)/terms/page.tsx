import type { Metadata } from "next";
import { LegalDocMarketingView } from "@/components/legal/legal-doc-marketing-view";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";


export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => {
      const alt = marketingAlternatesSharedPage(DEFAULT_MARKETING_LOCALE, "/terms");
      return {
        title: "Terms of Service | NurseNest",
        description:
          "NurseNest Terms of Service: subscription license, acceptable use, paywall enforcement, billing, disclaimers, and dispute terms.",
        alternates: { canonical: alt.canonical, languages: alt.languages },
        robots: { index: true, follow: true },
        openGraph: {
          title: "Terms of Service | NurseNest",
          description: "Terms governing use of NurseNest exam prep, subscriptions, and content.",
          url: alt.canonical,
          type: "website",
        },
      };
    },
    { pathname: "/terms", locale: DEFAULT_MARKETING_LOCALE, routeGroup: "marketing.default.legal" },
  );
}

export default async function TermsOfServicePage() {
  return <LegalDocMarketingView docId="terms-of-service" breadcrumbLabel="Terms of Service" path="/terms" />;
}
