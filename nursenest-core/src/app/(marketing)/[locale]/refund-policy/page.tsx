import type { Metadata } from "next";
import { LegalDocMarketingView } from "@/components/legal/legal-doc-marketing-view";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return safeGenerateMetadata(
    async () => {
      const alt = marketingAlternatesSharedPage(locale, "/refund-policy");
      return {
        title: "Subscription, Cancellation, and Refund Policy | NurseNest",
        description: "How NurseNest subscriptions, renewals, cancellations, trials, and refunds work.",
        alternates: { canonical: alt.canonical, languages: alt.languages },
        robots: { index: true, follow: true },
        openGraph: {
          title: "Subscription, Cancellation, and Refund Policy | NurseNest",
          url: alt.canonical,
          type: "website",
        },
      };
    },
    { pathname: `/${locale}/refund-policy`, locale, routeGroup: "marketing.locale.legal" },
  );
}

export default async function LocalizedRefundPolicyPage({ params }: Props) {
  const { locale } = await params;
  return (
    <LegalDocMarketingView
      docId="subscription-refund-policy"
      breadcrumbLabel="Subscription & refund policy"
      path={`/${locale}/refund-policy`}
    />
  );
}
