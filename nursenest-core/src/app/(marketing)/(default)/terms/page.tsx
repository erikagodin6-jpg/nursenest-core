import type { Metadata } from "next";
import { LegalDocMarketingView } from "@/components/legal/legal-doc-marketing-view";
import { absoluteUrl } from "@/lib/seo/site-origin";

export const metadata: Metadata = {
  title: "Terms of Service | NurseNest",
  description:
    "NurseNest Terms of Service: subscription license, acceptable use, paywall enforcement, billing, disclaimers, and dispute terms.",
  alternates: { canonical: absoluteUrl("/terms") },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Terms of Service | NurseNest",
    description: "Terms governing use of NurseNest exam prep, subscriptions, and content.",
    url: absoluteUrl("/terms"),
    type: "website",
  },
};

export default async function TermsOfServicePage() {
  return <LegalDocMarketingView docId="terms-of-service" breadcrumbLabel="Terms of Service" path="/terms" />;
}
