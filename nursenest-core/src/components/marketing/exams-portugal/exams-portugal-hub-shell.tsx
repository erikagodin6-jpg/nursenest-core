import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { FaqJsonLd } from "@/components/seo/faq-json-ld";
import { WebPageJsonLd } from "@/components/seo/seo-json-ld";
import type { MarketingMessages } from "@/lib/marketing-i18n-core";
import { buildMarketingWebPageJsonLdProps } from "@/lib/seo/marketing-webpage-jsonld";
import { marketingCanonicalPathForLocale } from "@/lib/seo/marketing-alternates";
import { simpleMarketingBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { ExamsPortugalHub } from "./exams-portugal-hub";

const EN_PATH = "/exams/portugal";

function faqFromMessages(m: MarketingMessages) {
  const out: { question: string; answer: string }[] = [];
  for (let i = 1; i <= 15; i += 1) {
    const q = m[`exams.portugal.faq.q${i}`];
    const a = m[`exams.portugal.faq.a${i}`];
    if (q?.trim() && a?.trim()) out.push({ question: q, answer: a });
  }
  return out;
}

export function ExamsPortugalHubShell({
  locale,
  messages,
}: {
  locale: string;
  messages: MarketingMessages;
}) {
  const title = messages["exams.portugal.metaTitle"] ?? messages["exams.portugal.title"] ?? "Portugal nursing registration";
  const description =
    messages["exams.portugal.metaDescription"] ??
    messages["exams.portugal.lead"] ??
    "Nursing registration and recognition in Portugal.";
  const path = marketingCanonicalPathForLocale(locale, EN_PATH);
  const { schemaItems } = simpleMarketingBreadcrumbs(messages["exams.portugal.breadcrumb"] ?? "Portugal nursing", path);

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
      <ExamsPortugalHub />
    </>
  );
}
