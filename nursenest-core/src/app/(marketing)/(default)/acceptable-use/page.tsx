import type { Metadata } from "next";
import { LegalDocMarketingView } from "@/components/legal/legal-doc-marketing-view";
import { simpleMarketingBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { absoluteUrl } from "@/lib/seo/site-origin";

export const metadata: Metadata = {
  title: "Acceptable Use & Content Protection | NurseNest",
  description: "Rules for fair use of NurseNest content, anti-scraping, and account protection.",
  alternates: { canonical: absoluteUrl("/acceptable-use") },
  robots: { index: true, follow: true },
};

export default async function AcceptableUsePage() {
  return (
    <LegalDocMarketingView
      docId="acceptable-use-policy"
      breadcrumbResolution={simpleMarketingBreadcrumbs("Acceptable use", "/acceptable-use")}
    />
  );
}
