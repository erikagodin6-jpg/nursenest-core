import { LegalMarkdownBody } from "@/components/legal/legal-markdown-body";
import { parseFaqMarkdownForJsonLd } from "@/components/legal/parse-faq-for-json-ld";
import { FaqJsonLd } from "@/components/seo/faq-json-ld";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { loadLegalMarkdownDoc } from "@/lib/legal/load-legal-doc";
import { simpleMarketingBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";

export async function FaqLegalMarketingView({ path }: { path: string }) {
  const md = await loadLegalMarkdownDoc("faq");
  const faqItems = parseFaqMarkdownForJsonLd(md);
  const { crumbs, schemaItems } = simpleMarketingBreadcrumbs("FAQ", path);
  return (
    <>
      <FaqJsonLd items={faqItems} />
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
