import type { Metadata } from "next";
import { LegalMarkdownBody } from "@/components/legal/legal-markdown-body";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { loadLegalMarkdownDoc } from "@/lib/legal/load-legal-doc";
import { simpleMarketingBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
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
  const md = await loadLegalMarkdownDoc("terms-of-service");
  const { crumbs, schemaItems } = simpleMarketingBreadcrumbs("Terms of Service", "/terms");
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
