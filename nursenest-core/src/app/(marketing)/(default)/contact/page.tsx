import type { Metadata } from "next";
import { LegalDocMarketingView } from "@/components/legal/legal-doc-marketing-view";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";


export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => {
      const alt = marketingAlternatesSharedPage(DEFAULT_MARKETING_LOCALE, "/contact");
      return {
        title: "Contact & Support | NurseNest",
        description: "Contact NurseNest for billing help, privacy requests, and product support.",
        alternates: { canonical: alt.canonical, languages: alt.languages },
        robots: { index: true, follow: true },
        openGraph: { title: "Contact & Support | NurseNest", url: alt.canonical, type: "website" },
      };
    },
    { pathname: "/contact", locale: DEFAULT_MARKETING_LOCALE, routeGroup: "marketing.default.contact" },
  );
}

export default async function ContactPage() {
  return <LegalDocMarketingView docId="contact" breadcrumbLabel="Contact" path="/contact" />;
}
