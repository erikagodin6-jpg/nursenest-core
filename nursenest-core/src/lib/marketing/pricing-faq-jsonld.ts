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
  { q: "pages.pricing.subscriptionFaq.q1", a: "pages.pricing.subscriptionFaq.a1" },
  { q: "pages.pricing.subscriptionFaq.q2", a: "pages.pricing.subscriptionFaq.a2" },
  { q: "pages.pricing.subscriptionFaq.q3", a: "pages.pricing.subscriptionFaq.a3" },
  { q: "pages.pricing.subscriptionFaq.q4", a: "pages.pricing.subscriptionFaq.a4" },
  { q: "pages.pricing.subscriptionFaq.q5", a: "pages.pricing.subscriptionFaq.a5" },
  { q: "pages.pricing.subscriptionFaq.q6", a: "pages.pricing.subscriptionFaq.a6" },
  { q: "pages.pricing.subscriptionFaq.q7", a: "pages.pricing.subscriptionFaq.a7" },
  { q: "pages.pricing.subscriptionFaq.q8", a: "pages.pricing.subscriptionFaq.a8" },
  { q: "pages.pricing.subscriptionFaq.q9", a: "pages.pricing.subscriptionFaq.a9" },
  { q: "pages.pricing.subscriptionFaq.q10", a: "pages.pricing.subscriptionFaq.a10" },
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
