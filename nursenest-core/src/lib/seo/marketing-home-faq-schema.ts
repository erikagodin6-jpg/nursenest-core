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
    answer: "Yes. Toggle your country—labels and pathways update for your region.",
  },
  {
    question: "Do I need a subscription?",
    answer: "Start free. Full banks and saved work are on paid plans; see pricing when you are ready.",
  },
  {
    question: "What is included?",
    answer:
      "Pathway questions, timed practice, lessons, and flashcards. The homepage shows the live question count; your pathway filters what you see first.",
  },
  {
    question: "Is this like UWorld?",
    answer:
      "Similar—exam-style items with rationales—but built for nursing and allied licensing, not a generic Qbank.",
  },
];
