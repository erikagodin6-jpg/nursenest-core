import type { FaqJsonLdItem } from "@/components/seo/faq-json-ld";

const PRICING_FAQ_KEYS: ReadonlyArray<{ q: string; a: string }> = [
  { q: "pages.pricing.regionFaq.usCanadaQuestion", a: "pages.pricing.regionFaq.usCanadaAnswer" },
  { q: "pages.pricing.regionFaq.correctExamQuestion", a: "pages.pricing.regionFaq.correctExamAnswer" },
  { q: "pages.pricing.regionFaq.switchCountryQuestion", a: "pages.pricing.regionFaq.switchCountryAnswer" },
  { q: "pages.pricing.reliabilityFaq.siteCrashQuestion", a: "pages.pricing.reliabilityFaq.siteCrashAnswer" },
  { q: "pages.pricing.reliabilityFaq.slowExperienceQuestion", a: "pages.pricing.reliabilityFaq.slowExperienceAnswer" },
  { q: "pages.pricing.reliabilityFaq.studyReliabilityQuestion", a: "pages.pricing.reliabilityFaq.studyReliabilityAnswer" },
  { q: "pages.pricing.learnerFaq.passGuaranteeQuestion", a: "pages.pricing.learnerFaq.passGuaranteeAnswer" },
  { q: "pages.pricing.learnerFaq.startingBehindQuestion", a: "pages.pricing.learnerFaq.startingBehindAnswer" },
  { q: "pages.pricing.learnerFaq.tryBeforePayQuestion", a: "pages.pricing.learnerFaq.tryBeforePayAnswer" },
  { q: "pages.pricing.learnerFaq.examRealismQuestion", a: "pages.pricing.learnerFaq.examRealismAnswer" },
  { q: "pages.pricing.learnerFaq.refundRemorseQuestion", a: "pages.pricing.learnerFaq.refundRemorseAnswer" },
];

/** FAQPage JSON-LD entries for `/pricing` (default + localized shards). */
export function buildPricingFaqJsonLdItems(messages: Record<string, string | undefined>): FaqJsonLdItem[] {
  const out: FaqJsonLdItem[] = [];
  for (const { q, a } of PRICING_FAQ_KEYS) {
    const question = (messages[q] ?? "").trim();
    const answer = (messages[a] ?? "").trim();
    if (question && answer) out.push({ question, answer });
  }
  return out;
}
