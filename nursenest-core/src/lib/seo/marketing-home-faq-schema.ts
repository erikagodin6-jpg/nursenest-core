import type { FaqJsonLdItem } from "@/components/seo/faq-json-ld";

/** Keep in sync with `home.landing.faq.q1`–`q5` / `a1`–`a5` in `public/i18n/en.json` and `HomeLandingSections` FAQ keys. */
export const MARKETING_HOME_FAQ_JSONLD: FaqJsonLdItem[] = [
  {
    question: "Which exam is this for?",
    answer:
      "NCLEX-RN, practical nursing (NCLEX-PN with LPN scope in the US or REx-PN with RPN scope in Canada), NP, or allied health. Use the card that matches your goal.",
  },
  {
    question: "Is this for the US and Canada?",
    answer: "Yes. Toggle your country and labels plus pathways update for your region.",
  },
  {
    question: "Do I need a subscription?",
    answer: "Start free. Full banks and saved work are on paid plans; see pricing when you are ready.",
  },
  {
    question: "What is included?",
    answer:
      "Everything stays tied to the exam card you pick: scope, totals, and depth follow that pathway. The homepage shows a live question count; filters keep your first screen aligned with the license you are pursuing.",
  },
  {
    question: "Is this like UWorld?",
    answer:
      "Similar in that items are exam-style with rationales, but built for nursing and allied licensing, not a generic Qbank.",
  },
];
