import type { Metadata } from "next";
import { LegalDocMarketingView } from "@/components/legal/legal-doc-marketing-view";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return safeGenerateMetadata(
    async () => {
      const alt = marketingAlternatesSharedPage(locale, "/content-review-policy");
      return {
        title: "Content Review Policy | NurseNest",
        description:
          "How NurseNest reviews clinical and exam-preparation content for YMYL quality, safety, and transparency.",
        alternates: { canonical: alt.canonical, languages: alt.languages },
        robots: { index: true, follow: true },
        openGraph: { title: "Content Review Policy | NurseNest", url: alt.canonical, type: "website" },
      };
    },
    { pathname: `/${locale}/content-review-policy`, locale, routeGroup: "marketing.locale.legal" },
  );
}

export default async function LocalizedContentReviewPolicyPage({ params }: Props) {
  const { locale } = await params;
  return (
    <LegalDocMarketingView
      docId="content-review-policy"
      breadcrumbLabel="Content review policy"
      path={`/${locale}/content-review-policy`}
    />
  );
}
