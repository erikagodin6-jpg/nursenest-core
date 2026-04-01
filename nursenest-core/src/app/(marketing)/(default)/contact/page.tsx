import type { Metadata } from "next";
import { LegalMarkdownBody } from "@/components/legal/legal-markdown-body";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { loadLegalMarkdownDoc } from "@/lib/legal/load-legal-doc";
import { simpleMarketingBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { absoluteUrl } from "@/lib/seo/site-origin";

export const metadata: Metadata = {
  title: "Contact & Support | NurseNest",
  description: "Contact NurseNest for billing help, privacy requests, and product support.",
  alternates: { canonical: absoluteUrl("/contact") },
  robots: { index: true, follow: true },
};

export default async function ContactPage() {
  const md = await loadLegalMarkdownDoc("contact");
  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Contact", href: "/contact" },
  ];
  const schemaItems = crumbs.map((c, i) => ({
    name: c.label,
    item: absoluteUrl(c.href),
    position: i + 1,
  }));
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
