import type { Metadata } from "next";
import { LegalDocMarketingView } from "@/components/legal/legal-doc-marketing-view";
import { absoluteUrl } from "@/lib/seo/site-origin";

export const metadata: Metadata = {
  title: "Privacy Policy | NurseNest",
  description: "How NurseNest collects, uses, stores, and protects personal information.",
  alternates: { canonical: absoluteUrl("/privacy") },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Privacy Policy | NurseNest",
    url: absoluteUrl("/privacy"),
    type: "website",
  },
};

export default async function PrivacyPolicyPage() {
  return <LegalDocMarketingView docId="privacy-policy" breadcrumbLabel="Privacy Policy" path="/privacy" />;
}
