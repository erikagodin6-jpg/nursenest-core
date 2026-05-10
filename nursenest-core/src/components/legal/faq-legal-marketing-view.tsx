import { parseFaqMarkdownForJsonLd } from "@/components/legal/parse-faq-for-json-ld";
import { PremiumFaqAccordion, type PremiumFaqCategory, type PremiumFaqItem } from "@/components/legal/premium-faq-accordion";
import { FaqJsonLd } from "@/components/seo/faq-json-ld";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { loadLegalMarkdownDoc } from "@/lib/legal/load-legal-doc";
import { simpleMarketingBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";

function categoryForQuestion(question: string): PremiumFaqCategory {
  const lower = question.toLowerCase();
  if (/(subscription|renew|cancel|refund|charge|billing|purchase|free|pay)/u.test(lower)) return "Billing";
  if (/(account|access|copy|print|export|screenshot|share|device|log in)/u.test(lower)) return "Access";
  if (/(pass|exam|readiness|rationale|question|medical advice|nursenest actually help)/u.test(lower)) return "Learning";
  return "Platform";
}

function parsePremiumFaqItems(markdown: string): { title: string; items: PremiumFaqItem[] } {
  const title = markdown.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? "NurseNest FAQ";
  return {
    title,
    items: parseFaqMarkdownForJsonLd(markdown).map((item) => ({
      question: item.question,
      answer: item.answer,
      category: categoryForQuestion(item.question),
    })),
  };
}

export async function FaqLegalMarketingView({ path }: { path: string }) {
  const md = await loadLegalMarkdownDoc("faq");
  const faqItems = parseFaqMarkdownForJsonLd(md);
  const premiumFaq = parsePremiumFaqItems(md);
  const { crumbs, schemaItems } = simpleMarketingBreadcrumbs("FAQ", path);
  return (
    <div className="nn-faq-marketing-root" data-testid="marketing-faq-legal">
      <FaqJsonLd items={faqItems} />
      <BreadcrumbJsonLd items={schemaItems} />
      <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 lg:px-8">
        <BreadcrumbTrail items={crumbs} />
      </div>
      <PremiumFaqAccordion title={premiumFaq.title} items={premiumFaq.items} />
    </div>
  );
}
