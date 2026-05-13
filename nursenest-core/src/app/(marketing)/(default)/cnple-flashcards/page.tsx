import type { Metadata } from "next";
import { CnpleSeoHubPage, CNPLE_RELATED_LINKS } from "@/components/cnple/cnple-seo-hub-page";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { robotsForRegionalMarketingHub } from "@/lib/seo/expansion-hub-robots";

export const revalidate = 86400;

const PATH = "/cnple-flashcards";
const PAGE_TITLE = "CNPLE Flashcards — 1,054 NP-Level Study Cards | NurseNest";
const PAGE_H1 = "CNPLE flashcards for Canadian NP exam preparation";
const PAGE_DESCRIPTION =
  "1,054 CNPLE-aligned flashcards with spaced repetition for Canadian Nurse Practitioner Licensure Examination preparation. Condition-specific NP-level cards covering prescribing decisions, diagnostic workup, management priorities, red flags, and Canadian NP scope — across all major CNPLE competency domains.";

const FAQ_ITEMS = [
  {
    question: "Are these official CNPLE flashcards?",
    answer:
      "No. NurseNest flashcards are independent preparation materials aligned to published Canadian NP competency frameworks. They are not affiliated with CCRNR or sourced from official exam materials. Use them alongside structured lessons and clinical practice questions for best effect.",
  },
  {
    question: "What CNPLE domains do the flashcard decks cover?",
    answer:
      "NurseNest CNPLE flashcard decks cover all major Canadian NP competency domains: prescribing safety and pharmacology, diagnostics and lab interpretation, lifespan care, chronic disease management, acute deterioration recognition, professional and legal practice, mental health, women's health, paediatrics, and geriatrics.",
  },
  {
    question: "How does spaced repetition help CNPLE preparation?",
    answer:
      "Spaced repetition schedules card reviews at intervals calibrated to how well you know each card — reviewing difficult cards more frequently and well-known cards less often. This approach builds long-term retention far more efficiently than re-reading notes or passive review, which is particularly valuable for the pharmacology and clinical guidelines that the CNPLE tests in depth.",
  },
  {
    question: "How do I use flashcards alongside CNPLE simulation sessions?",
    answer:
      "After a simulation session, your domain report card identifies weak areas. Use those domain tags to filter flashcard decks to the specific competency areas where your score was lowest. Targeted flashcard review after simulation builds the recall foundation that integrated practice questions then reinforce — the combination is more efficient than either method alone.",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => {
      const alt = marketingAlternatesSharedPage(DEFAULT_MARKETING_LOCALE, PATH);
      return {
        title: PAGE_TITLE,
        description: PAGE_DESCRIPTION,
        alternates: { canonical: alt.canonical, languages: alt.languages },
        robots: robotsForRegionalMarketingHub("canada"),
        keywords: [
          "CNPLE flashcards",
          "Canadian NP flashcards",
          "CNPLE study cards",
          "Canadian NP exam flashcards",
          "CNPLE pharmacology flashcards",
          "Canadian NP spaced repetition",
        ],
        openGraph: {
          title: PAGE_TITLE,
          description: PAGE_DESCRIPTION,
          url: alt.canonical,
          type: "article",
          siteName: "NurseNest",
        },
        twitter: { card: "summary_large_image", title: PAGE_TITLE, description: PAGE_DESCRIPTION },
      };
    },
    { pathname: PATH, locale: DEFAULT_MARKETING_LOCALE, routeGroup: "marketing.cnple_seo_hub" },
  );
}

export default function CnpleFlashcardsPage() {
  return (
    <CnpleSeoHubPage
      path={PATH}
      title={PAGE_TITLE}
      h1={PAGE_H1}
      description={PAGE_DESCRIPTION}
      lead="CNPLE-aligned flashcard decks with spaced repetition. Domain-targeted coverage across all Canadian NP competency areas — from prescribing pharmacology to diagnostic pattern recognition. Integrated with your simulation report card for targeted remediation."
      faq={FAQ_ITEMS}
      primaryCtaHref="/canada/np/cnple/flashcards"
      primaryCtaLabel="CNPLE Flashcard Decks"
      secondaryCtaHref="/canada/np/cnple"
      secondaryCtaLabel="CNPLE Hub"
      relatedLinks={[
        CNPLE_RELATED_LINKS[0],
        CNPLE_RELATED_LINKS[1],
        CNPLE_RELATED_LINKS[3],
        CNPLE_RELATED_LINKS[5],
        CNPLE_RELATED_LINKS[9],
        CNPLE_RELATED_LINKS[10],
        CNPLE_RELATED_LINKS[11],
      ]}
      sections={[
        {
          id: "why-flashcards-cnple",
          heading: "How CNPLE flashcards support exam retention",
          body: (
            <>
              <p>
                The CNPLE tests a breadth of Canadian NP competencies — prescribing across
                multiple therapeutic areas, diagnostic pattern recognition, lifespan care
                principles, and professional practice standards. The volume of material requires
                a retention strategy beyond passive re-reading. Spaced repetition flashcards
                address this by scheduling each concept at the precise interval that prevents
                forgetting before it consolidates into long-term memory.
              </p>
              <p>
                For CNPLE preparation, flashcards are most effective for the recall-dependent
                foundations: drug class indications and contraindications, lab reference ranges
                and their clinical significance, Canadian screening guidelines by population and
                interval, and regulatory principles relevant to NP professional practice. These
                foundational facts underpin the integrated reasoning the CNPLE actually tests —
                but without them, clinical case practice becomes guesswork rather than reasoning.
              </p>
            </>
          ),
        },
        {
          id: "domain-coverage",
          heading: "Domain coverage across CNPLE competency areas",
          body: (
            <>
              <p>
                NurseNest CNPLE flashcard decks are tagged to the major Canadian NP competency
                domains, making it possible to filter study sessions to specific weak areas
                rather than rotating passively through all content. After a simulation session or
                practice block, identify which domains produced the most errors and focus
                flashcard review there.
              </p>
              <p>
                Prescribing pharmacology decks cover first-line and second-line drug selection,
                contraindications in pregnancy and renal/hepatic impairment, monitoring
                parameters, and drug-drug interaction patterns. Diagnostics decks cover lab
                interpretation patterns — anaemia subtypes, metabolic panel interpretation,
                thyroid function, coagulation — and clinical ECG recognition within NP scope.
                Lifespan, geriatric, women's health, paediatric, and mental health decks each
                cover domain-specific clinical facts, screening guidelines, and management
                thresholds relevant to Canadian NP practice.
              </p>
            </>
          ),
        },
        {
          id: "integration-with-simulation",
          heading: "Integrating flashcards with simulation and practice questions",
          body: (
            <>
              <p>
                Flashcards, practice questions, and simulation sessions work best as a reinforcing
                cycle rather than independent tracks. Use flashcards to build the recall foundation
                first, then move to practice questions that apply those facts in clinical context.
                After a simulation session, use your domain report card to identify which areas
                need flashcard reinforcement — then return to integrated practice questions to
                confirm the recall translated into applied reasoning.
              </p>
              <p>
                This cycle — recall → application → gap identification → targeted recall →
                re-application — is the structure that most efficiently converts study time into
                exam-ready performance. CNPLE preparation that skips the recall phase
                underperforms on integrated items because the foundational knowledge needed to
                reason through the case is not reliably accessible under time pressure.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
