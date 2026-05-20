import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { FaqJsonLd } from "@/components/seo/faq-json-ld";
import { WebPageJsonLd } from "@/components/seo/seo-json-ld";
import type { MarketingMessages } from "@/lib/marketing-i18n-core";
import { buildMarketingWebPageJsonLdProps } from "@/lib/seo/marketing-webpage-jsonld";
import { marketingCanonicalPathForLocale } from "@/lib/seo/marketing-alternates";
import { simpleMarketingBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { ExamsGermanyHub } from "./exams-germany-hub";

const EN_PATH = "/exams/germany";

function faqFromMessages(m: MarketingMessages) {
  const out: { question: string; answer: string }[] = [];
  for (let i = 1; i <= 15; i += 1) {
    const q = m[`exams.germany.faq.q${i}`];
    const a = m[`exams.germany.faq.a${i}`];
    if (q?.trim() && a?.trim()) out.push({ question: q, answer: a });
  }
  return out;
}

export function ExamsGermanyHubShell({
  locale,
  messages,
}: {
  locale: string;
  messages: MarketingMessages;
}) {
  const title = messages["exams.germany.metaTitle"] ?? messages["exams.germany.title"] ?? "Germany nursing registration";
  const description =
    messages["exams.germany.metaDescription"] ??
    messages["exams.germany.lead"] ??
    "Nursing recognition and registration in Germany.";
  const path = marketingCanonicalPathForLocale(locale, EN_PATH);
  const { schemaItems } = simpleMarketingBreadcrumbs(messages["exams.germany.breadcrumb"] ?? "Germany nursing", path);

  return (
    <>
      <WebPageJsonLd
        {...buildMarketingWebPageJsonLdProps({
          locale,
          enPath: EN_PATH,
          title,
          description,
        })}
      />
      <BreadcrumbJsonLd items={schemaItems} />
      <FaqJsonLd items={faqFromMessages(messages)} />
      <ExamsGermanyHub />
    </>
  );
}
