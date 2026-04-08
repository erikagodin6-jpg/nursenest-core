import type { FaqJsonLdItem } from "@/components/seo/faq-json-ld";

/** Keep in sync with `home.landing.faq.q*` / `home.landing.faq.a*` in `public/i18n/en.json`. */
export const MARKETING_HOME_FAQ_JSONLD: FaqJsonLdItem[] = [
  {
    question: "Which exam do I choose?",
    answer:
      "Use the country toggle, then pick the pathway that matches your license goal: RN (NCLEX-RN), Practical Nursing (NCLEX-PN or REx-PN by country), NP, or Allied Health. Each pathway opens the right question bank and lessons for that track.",
  },
  {
    question: "Is this for Canada and the US?",
    answer:
      "Yes. Switch between United States and Canada at the top of the page. Content labels and pathways (for example PN vs REx-PN) update for your region.",
  },
  {
    question: "Do I need a subscription?",
    answer:
      "You can create a free account and explore pathway-aligned previews. Full banks, saved sessions, and premium features are listed on the pricing page. No credit card is required to start.",
  },
  {
    question: "How many questions are included?",
    answer:
      "The question bank grows continuously. The homepage shows the current practice question count. Your pathway determines which items you see first.",
  },
  {
    question: "Is this like UWorld?",
    answer:
      "NurseNest is built for nursing and allied health licensing exams with rationale-first items, timed practice, and lessons aligned to your exam—not a generic flashcard app. Many students use it alongside other tools; pick what fits your study plan.",
  },
  {
    question: "What is readiness tracking?",
    answer:
      "As you practice, NurseNest highlights weak areas and trends so you can focus review before test day. It complements timed mocks and the question bank.",
  },
];
