import type { Metadata } from "next";
import { LegalDocMarketingView } from "@/components/legal/legal-doc-marketing-view";
import { absoluteUrl } from "@/lib/seo/site-origin";

export const metadata: Metadata = {
  title: "Contact & Support | NurseNest",
  description: "Contact NurseNest for billing help, privacy requests, and product support.",
  alternates: { canonical: absoluteUrl("/contact") },
  robots: { index: true, follow: true },
};

export default async function ContactPage() {
  return <LegalDocMarketingView docId="contact" breadcrumbLabel="Contact" path="/contact" />;
}
