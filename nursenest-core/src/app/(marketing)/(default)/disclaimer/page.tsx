import type { Metadata } from "next";
import { LegalDocMarketingView } from "@/components/legal/legal-doc-marketing-view";
import { absoluteUrl } from "@/lib/seo/site-origin";

export const metadata: Metadata = {
  title: "Educational Disclaimer | NurseNest",
  description: "NurseNest is for educational use only—not medical advice or a guarantee of exam results.",
  alternates: { canonical: absoluteUrl("/disclaimer") },
  robots: { index: true, follow: true },
};

export default async function DisclaimerPage() {
  return <LegalDocMarketingView docId="educational-disclaimer" breadcrumbLabel="Disclaimer" path="/disclaimer" />;
}
