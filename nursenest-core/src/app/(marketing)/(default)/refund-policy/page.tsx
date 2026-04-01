import type { Metadata } from "next";
import { LegalMarkdownBody } from "@/components/legal/legal-markdown-body";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { loadLegalMarkdownDoc } from "@/lib/legal/load-legal-doc";
import { simpleMarketingBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
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
  const md = await loadLegalMarkdownDoc("subscription-refund-policy");
  const { crumbs, schemaItems } = simpleMarketingBreadcrumbs("Subscription & refund policy", "/refund-policy");
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
