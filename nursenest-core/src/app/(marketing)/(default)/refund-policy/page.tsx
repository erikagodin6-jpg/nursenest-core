import type { Metadata } from "next";
import { LegalDocMarketingView } from "@/components/legal/legal-doc-marketing-view";
import { absoluteUrl } from "@/lib/seo/site-origin";

export const metadata: Metadata = {
  title: "Subscription, Cancellation, and Refund Policy | NurseNest",
  description: "How NurseNest subscriptions, renewals, cancellations, trials, and refunds work.",
  alternates: { canonical: absoluteUrl("/refund-policy") },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Subscription, Cancellation, and Refund Policy | NurseNest",
    url: absoluteUrl("/refund-policy"),
    type: "website",
  },
};

export default async function RefundPolicyPage() {
  return (
    <LegalDocMarketingView
      docId="subscription-refund-policy"
      breadcrumbLabel="Subscription & refund policy"
      path="/refund-policy"
    />
  );
}
