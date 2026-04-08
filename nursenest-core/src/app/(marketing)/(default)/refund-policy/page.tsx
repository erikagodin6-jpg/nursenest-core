import type { Metadata } from "next";
import { LegalDocMarketingView } from "@/components/legal/legal-doc-marketing-view";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";

export async function generateMetadata(): Promise<Metadata> {
  const alt = marketingAlternatesSharedPage(DEFAULT_MARKETING_LOCALE, "/refund-policy");
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
}

export default async function RefundPolicyPage() {
  return (
    <LegalDocMarketingView
      docId="subscription-refund-policy"
      breadcrumbLabel="Subscription & refund policy"
      path="/refund-policy"
    />
  );
}
