import type { FaqJsonLdItem } from "@/components/seo/faq-json-ld";

/** Keep in sync with `home.conversion.faq*` keys in `public/i18n/en.json` (FAQ section + JSON-LD). */
export const MARKETING_HOME_FAQ_JSONLD: FaqJsonLdItem[] = [
  {
    question: "Is NurseNest for NCLEX-RN, REx-PN, or both?",
    answer:
      "Yes. Pick your country at the top of the page, then open the RN or PN pathway. US candidates use NCLEX-RN and NCLEX-PN hubs; Canadian PN candidates use the REx-PN track with its own lessons and question bank.",
  },
  {
    question: "Do I need a credit card to try questions?",
    answer:
      "You can start with pathway-scoped previews and short bank passes before subscribing. Full-length sessions and saved progress use your NurseNest account; pricing and tiers are listed on the pricing page.",
  },
  {
    question: "How is this different from flashcard-only apps?",
    answer:
      "NurseNest is built around exam-style stems, rationales that explain incorrect options, and timed practice so you rehearse clinical judgment, not isolated definitions. Lessons and question banks stay aligned to your track.",
  },
  {
    question: "Does NP content cover FNP and AGPCNP?",
    answer:
      "US boards: open the FNP or AGPCNP lesson and question hubs for the exam you are sitting. Canadian NP preparation uses the CNPLE pathway hub; that track may show waitlist messaging while national requirements stabilize.",
  },
  {
    question: "Where do allied health exams fit?",
    answer:
      "Allied health has its own hub and in-app bank, separate from nursing tiers. Use the allied careers overview to see supported exams, then jump into the pathway question bank for your region.",
  },
  {
    question: "Can I use NurseNest on my phone?",
    answer:
      "The marketing site and app routes are responsive. Long practice sessions work best on a tablet or laptop; short review and question runs work well on mobile.",
  },
];
