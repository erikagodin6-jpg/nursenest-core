import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { FaqJsonLd } from "@/components/seo/faq-json-ld";
import { WebPageJsonLd } from "@/components/seo/seo-json-ld";
import type { MarketingMessages } from "@/lib/marketing-i18n-core";
import { buildMarketingWebPageJsonLdProps } from "@/lib/seo/marketing-webpage-jsonld";
import { marketingCanonicalPathForLocale } from "@/lib/seo/marketing-alternates";
import { simpleMarketingBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { ExamsKoreaHub } from "./exams-korea-hub";

const EN_PATH = "/exams/korea";

function faqFromMessages(m: MarketingMessages) {
  const out: { question: string; answer: string }[] = [];
  for (let i = 1; i <= 15; i += 1) {
    const q = m[`exams.korea.faq.q${i}`];
    const a = m[`exams.korea.faq.a${i}`];
    if (q?.trim() && a?.trim()) out.push({ question: q, answer: a });
  }
  return out;
}

export function ExamsKoreaHubShell({
  locale,
  messages,
}: {
  locale: string;
  messages: MarketingMessages;
}) {
  const title = messages["exams.korea.metaTitle"] ?? messages["exams.korea.title"] ?? "Korea nursing exams";
  const description =
    messages["exams.korea.metaDescription"] ??
    messages["exams.korea.lead"] ??
    "Korean Nursing Licensing Examination and international pathways.";
  const path = marketingCanonicalPathForLocale(locale, EN_PATH);
  const { schemaItems } = simpleMarketingBreadcrumbs(messages["exams.korea.breadcrumb"] ?? "Korea nursing exams", path);

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
      <ExamsKoreaHub />
    </>
  );
}
