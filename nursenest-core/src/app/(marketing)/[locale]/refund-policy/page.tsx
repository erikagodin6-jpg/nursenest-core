import type { Metadata } from "next";
import { LegalDocMarketingView } from "@/components/legal/legal-doc-marketing-view";
import { absoluteUrl } from "@/lib/seo/site-origin";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const path = `/${locale}/refund-policy`;
  return {
    title: "Subscription, Cancellation, and Refund Policy | NurseNest",
    description: "How NurseNest subscriptions, renewals, cancellations, trials, and refunds work.",
    alternates: { canonical: absoluteUrl(path) },
    robots: { index: true, follow: true },
    openGraph: {
      title: "Subscription, Cancellation, and Refund Policy | NurseNest",
      url: absoluteUrl(path),
      type: "website",
    },
  };
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
