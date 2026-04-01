import type { Metadata } from "next";
import { LegalMarkdownBody } from "@/components/legal/legal-markdown-body";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { loadLegalMarkdownDoc } from "@/lib/legal/load-legal-doc";
import { simpleMarketingBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
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
  const md = await loadLegalMarkdownDoc("privacy-policy");
  const { crumbs, schemaItems } = simpleMarketingBreadcrumbs("Privacy Policy", "/privacy");
  return (
    <>
      <BreadcrumbJsonLd items={schemaItems} />
      <div className="mx-auto max-w-3xl px-4 pt-4 sm:px-6 lg:px-8">
        <BreadcrumbTrail items={crumbs} />
      </div>
      <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <LegalMarkdownBody markdown={md} />
      </article>
    </>
  );
}
