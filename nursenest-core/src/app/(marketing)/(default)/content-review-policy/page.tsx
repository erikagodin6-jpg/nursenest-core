import type { Metadata } from "next";
import { LegalDocMarketingView } from "@/components/legal/legal-doc-marketing-view";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => {
      const alt = marketingAlternatesSharedPage(DEFAULT_MARKETING_LOCALE, "/content-review-policy");
      return {
        title: "Content Review Policy | NurseNest",
        description:
          "How NurseNest reviews clinical and exam-preparation content for YMYL quality, safety, and transparency.",
        alternates: { canonical: alt.canonical, languages: alt.languages },
        robots: { index: true, follow: true },
        openGraph: { title: "Content Review Policy | NurseNest", url: alt.canonical, type: "website" },
      };
    },
    { pathname: "/content-review-policy", locale: DEFAULT_MARKETING_LOCALE, routeGroup: "marketing.default.legal" },
  );
}

export default async function ContentReviewPolicyPage() {
  return (
    <LegalDocMarketingView
      docId="content-review-policy"
      breadcrumbLabel="Content review policy"
      path="/content-review-policy"
    />
  );
}
