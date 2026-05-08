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
    <div className="nn-faq-marketing-root" data-testid="marketing-faq-legal">
      <FaqJsonLd items={faqItems} />
      <BreadcrumbJsonLd items={schemaItems} />
      <div className="mx-auto max-w-3xl px-4 pt-6 sm:px-6 lg:px-8">
        <BreadcrumbTrail items={crumbs} />
      </div>
      <article className="mx-auto max-w-3xl px-4 pb-12 pt-6 sm:px-6 sm:pb-14 lg:px-8">
        <div className="nn-premium-faq-card rounded-2xl border border-[color-mix(in_srgb,var(--semantic-border-soft)_1,var(--border))] bg-[var(--semantic-surface)] p-6 shadow-[var(--elevation-rest)] sm:p-8">
          <LegalMarkdownBody markdown={md} />
        </div>
      </article>
    </div>
  );
}
