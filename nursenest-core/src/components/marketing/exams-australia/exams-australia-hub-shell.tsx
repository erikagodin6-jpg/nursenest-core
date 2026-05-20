import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { FaqJsonLd } from "@/components/seo/faq-json-ld";
import { WebPageJsonLd } from "@/components/seo/seo-json-ld";
import type { MarketingMessages } from "@/lib/marketing-i18n-core";
import { buildMarketingWebPageJsonLdProps } from "@/lib/seo/marketing-webpage-jsonld";
import { marketingCanonicalPathForLocale } from "@/lib/seo/marketing-alternates";
import { simpleMarketingBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { ExamsAustraliaHub } from "./exams-australia-hub";

const EN_PATH = "/exams/australia";

function faqFromMessages(m: MarketingMessages) {
  const out: { question: string; answer: string }[] = [];
  for (let i = 1; i <= 13; i += 1) {
    const q = m[`exams.australia.faq.q${i}`];
    const a = m[`exams.australia.faq.a${i}`];
    if (q?.trim() && a?.trim()) out.push({ question: q, answer: a });
  }
  return out;
}

export function ExamsAustraliaHubShell({
  locale,
  messages,
}: {
  locale: string;
  messages: MarketingMessages;
}) {
  const title = messages["exams.australia.metaTitle"] ?? messages["exams.australia.title"] ?? "Australia nursing registration";
  const description =
    messages["exams.australia.metaDescription"] ?? messages["exams.australia.lead"] ?? "AHPRA, OSCE, OBA, and international nurse pathways.";
  const path = marketingCanonicalPathForLocale(locale, EN_PATH);
  const { schemaItems } = simpleMarketingBreadcrumbs(
    messages["exams.australia.breadcrumb"] ?? "Australia nursing",
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
      <ExamsAustraliaHub />
    </>
  );
}
