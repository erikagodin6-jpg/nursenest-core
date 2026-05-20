import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { FaqJsonLd } from "@/components/seo/faq-json-ld";
import { WebPageJsonLd } from "@/components/seo/seo-json-ld";
import type { MarketingMessages } from "@/lib/marketing-i18n-core";
import { buildMarketingWebPageJsonLdProps } from "@/lib/seo/marketing-webpage-jsonld";
import { marketingCanonicalPathForLocale } from "@/lib/seo/marketing-alternates";
import { simpleMarketingBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { ExamsChinaHub } from "./exams-china-hub";

const EN_PATH = "/exams/china";

function faqFromMessages(m: MarketingMessages) {
  const out: { question: string; answer: string }[] = [];
  for (let i = 1; i <= 15; i += 1) {
    const q = m[`exams.china.faq.q${i}`];
    const a = m[`exams.china.faq.a${i}`];
    if (q?.trim() && a?.trim()) out.push({ question: q, answer: a });
  }
  return out;
}

export function ExamsChinaHubShell({
  locale,
  messages,
}: {
  locale: string;
  messages: MarketingMessages;
}) {
  const title = messages["exams.china.metaTitle"] ?? messages["exams.china.title"] ?? "China nursing exams";
  const description =
    messages["exams.china.metaDescription"] ?? messages["exams.china.lead"] ?? "National Nurse Qualification Examination and pathways abroad.";
  const path = marketingCanonicalPathForLocale(locale, EN_PATH);
  const { schemaItems } = simpleMarketingBreadcrumbs(
    messages["exams.china.breadcrumb"] ?? "China nursing",
    path,
  );

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
      <ExamsChinaHub />
    </>
  );
}
