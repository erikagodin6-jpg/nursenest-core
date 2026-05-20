import type { Metadata } from "next";
import { CnpleSeoHubPage, CNPLE_RELATED_LINKS } from "@/components/cnple/cnple-seo-hub-page";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { robotsForRegionalMarketingHub } from "@/lib/seo/expansion-hub-robots";

export const revalidate = 86400;

const PATH = "/cnple";

const PAGE_TITLE =
  "CNPLE Exam Prep — Canadian Nurse Practitioner Licensure Examination | NurseNest";

const PAGE_H1 = "CNPLE exam prep for Canadian nurse practitioners";

const PAGE_DESCRIPTION =
  "Comprehensive CNPLE-aligned preparation for the Canadian Nurse Practitioner Licensure Examination. Practice clinical judgment, prescribing safety, diagnostics, and lifespan care — all scoped to Canadian NP competencies.";

const FAQ_ITEMS = [
  {
    question: "What is the CNPLE?",
    answer:
      "The Canadian Nurse Practitioner Licensure Examination (CNPLE) is the national entry-to-practice examination for nurse practitioners in Canada, administered under CCRNR (Canadian Council of Registered Nurse Regulators). It uses a LOFT (linear on-the-fly testing) format — a fixed-length linear exam, not a computerized adaptive test. NurseNest is an independent prep platform and is not affiliated with CCRNR.",
  },
  {
    question: "Who writes the CNPLE?",
    answer:
      "NP graduates who have completed an approved nurse practitioner programme in Canada and meet their provincial or territorial college's eligibility requirements. Requirements vary by jurisdiction — confirm current eligibility rules and scheduling directly at ccrnr.ca and with your provincial regulatory college.",
  },
  {
    question: "How does the CNPLE differ from the NCLEX?",
    answer:
      "The CNPLE and NCLEX are entirely separate examinations targeting different practice scopes and regulatory bodies. The NCLEX-RN tests registered nurse entry-to-practice competencies; the CNPLE tests advanced practice nurse practitioner competencies including autonomous diagnosis, prescribing, and clinical management within Canadian regulatory frameworks. Structurally, the NCLEX uses computerized adaptive testing (CAT) while the CNPLE uses LOFT (fixed-length linear). Preparation content for one does not substitute for the other.",
  },
  {
    question: "What does NurseNest offer for CNPLE prep?",
    answer:
      "NurseNest offers CNPLE-aligned practice questions organized by domain, clinical case studies, a linear simulation experience inspired by the LOFT format, spaced-repetition flashcard decks, and Canadian NP-specific lessons covering prescribing safety, diagnostics, clinical judgment, and lifespan care. All content is independently authored and scoped to Canadian NP competency frameworks.",
  },
];

const SECTIONS = [
  {
    id: "what-is-cnple",
    heading: "What is the Canadian Nurse Practitioner Licensure Examination",
    body: (
      <>
        <p>
          The CNPLE is Canada's national licensure examination for nurse practitioners. Administered by
          CCRNR (Canadian Council of Registered Nurse Regulators), it replaces the legacy Canadian Nurse
          Practitioner Examination (CNPE) that many provinces previously used. The CNPLE targets a 2026 live
          date and represents a unified national standard for NP entry-to-practice across participating
          jurisdictions. Always confirm current scheduling and eligibility requirements directly with CCRNR and
          your provincial college, as timelines may shift.
        </p>
        <p>
          The examination uses LOFT — linear on-the-fly testing. Unlike the computerized adaptive testing (CAT)
          format used in NCLEX, the CNPLE delivers a fixed set of items to every candidate. There is no adaptive
          shutdown, no early termination, and no shift in item difficulty based on your performance. This format
          demands consistent accuracy across the entire item set, not peak performance in a strategic early
          window. Understanding the format before beginning preparation prevents the common mistake of training
          exclusively for a CAT-style dynamic that does not apply.
        </p>
        <p>
          NurseNest is an independent study platform and is not affiliated with CCRNR. Content on this platform
          reflects NurseNest's clinical taxonomy and publicly available Canadian NP competency frameworks — it
          is CNPLE-aligned preparation, not an official source.
        </p>
      </>
    ),
  },
  {
    id: "cnple-blueprint-domains",
    heading: "CNPLE blueprint domains and competency areas",
    body: (
      <>
        <p>
          The CNPLE is built on Canadian NP competency frameworks. CCRNR has not published explicit blueprint
          weighting percentages as of 2026, but the examination draws from the full scope of advanced NP
          practice: clinical assessment and diagnosis, therapeutic management and prescribing, health promotion
          and disease prevention, and professional and ethical practice. NurseNest organises preparation across
          these major domains with deliberate depth in the areas that require the steepest clinical reasoning
          integration.
        </p>
        <p>
          Prescribing safety and pharmacotherapeutics appear throughout every clinical scenario regardless of
          body system — an NP candidate who has not systematically reviewed drug interactions, contraindications,
          renal and hepatic dose adjustment, and Canadian prescribing regulations will encounter those gaps under
          exam pressure. Laboratory and diagnostic interpretation functions similarly: the ability to integrate a
          metabolic panel, CBC, thyroid function, or urinalysis into a clinical decision is a fundamental NP
          competency that CNPLE-style questions probe repeatedly.
        </p>
        <p>
          Population-specific clinical reasoning — paediatrics, older adult care, reproductive health, and mental
          health — adds breadth to the examination that generalist clinical experience alone does not guarantee.
          Candidates with a focused clinical background should systematically assess and address their
          population-specific gaps during preparation, not assume that clinical depth in one area transfers
          proportionally to others.
        </p>
      </>
    ),
  },
  {
    id: "nursesnest-cnple-alignment",
    heading: "How NurseNest aligns with Canadian NP competencies",
    body: (
      <>
        <p>
          NurseNest structures CNPLE prep around the clinical reasoning demands of advanced practice. Practice
          questions are written as clinical vignettes — patient scenarios requiring differential diagnosis,
          investigation selection, management decisions, and prescribing choices within Canadian regulatory and
          guideline context. Rationales explain not only which answer is correct but why each distractor is
          inferior, building the discrimination skill that distinguishes experienced NP candidates from those
          who have memorised facts without integrating them.
        </p>
        <p>
          Canadian guideline alignment is built into content at the source level. Screening recommendations
          reference the Canadian Task Force on Preventive Health Care rather than USPSTF. Immunisation content
          draws from NACI schedules. Prescribing scenarios reference the Controlled Drugs and Substances Act
          and Canadian formulary context. Privacy and reporting obligations reflect PIPEDA and provincial
          legislation rather than HIPAA. For candidates who have previously used US NP preparation resources,
          this Canadian-specific calibration is non-trivial — the regulatory and guideline differences affect
          the correct answer in a significant proportion of clinical scenarios.
        </p>
        <p>
          The NurseNest simulation experience is inspired by the LOFT format: fixed length, no adaptive
          shutdown, and timed to build the pacing discipline that the CNPLE's linear format demands.
          Candidates who have prepared exclusively with adaptive practice tools often discover pacing and
          endurance gaps on full-length simulations that domain block practice alone does not expose.
        </p>
      </>
    ),
  },
  {
    id: "cnple-study-approach",
    heading: "Study approach for the CNPLE",
    body: (
      <>
        <p>
          An effective CNPLE preparation plan moves through three phases. The foundation phase uses domain
          diagnostic data to identify weak areas, then builds accuracy through focused domain blocks paired
          with lesson review. The breadth phase expands coverage across all clinical areas with mixed-domain
          practice and introduces the first full-length timed simulation run. The pressure phase consolidates
          gains with two simulation runs per week, targeted remediation of remaining gaps, and deliberate
          attention to pacing and stamina — the elements that degrade most visibly under exam-day conditions.
        </p>
        <p>
          Most NP graduates preparing over 12 weeks target 10 to 15 hours of study per week. Working NPs with
          busy clinical schedules often use 8 hours per week across a 16-week timeline. The sequencing matters
          more than the total hours: starting simulation before establishing domain-level accuracy produces
          noise rather than signal, and starting too late on simulation leaves pacing as an unresolved variable.
          Use the CNPLE study guide for a full timeline framework, and the practice questions hub to run your
          baseline diagnostic session in the first week of preparation.
        </p>
      </>
    ),
  },
];

const RELATED_LINKS = CNPLE_RELATED_LINKS.filter((l) =>
  [
    "/cnple-simulation-exam",
    "/cnple-practice-questions",
    "/cnple-study-guide",
    "/cnple-flashcards",
    "/cnple-clinical-judgment",
    "/exams/canada",
  ].includes(l.href),
);

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
          "CNPLE",
          "Canadian NP exam",
          "Canadian Nurse Practitioner Licensure Examination",
          "CNPLE prep",
          "Canada NP exam 2026",
          "NP licensure exam Canada",
          "CCRNR NP exam",
          "Canadian NP competencies",
        ],
        openGraph: {
          title: PAGE_TITLE,
          description: PAGE_DESCRIPTION,
          url: alt.canonical,
          type: "article",
          siteName: "NurseNest",
        },
        twitter: {
          card: "summary_large_image",
          title: PAGE_TITLE,
          description: PAGE_DESCRIPTION,
        },
      };
    },
    {
      pathname: PATH,
      locale: DEFAULT_MARKETING_LOCALE,
      routeGroup: "marketing.default.cnple",
    },
  );
}

export default function CnplePage() {
  return (
    <CnpleSeoHubPage
      path={PATH}
      title={PAGE_TITLE}
      h1={PAGE_H1}
      lead={PAGE_DESCRIPTION}
      description={PAGE_DESCRIPTION}
      sections={SECTIONS}
      faq={FAQ_ITEMS}
      relatedLinks={RELATED_LINKS}
      primaryCtaHref="/canada/np/cnple"
      primaryCtaLabel="CNPLE Prep Hub"
      secondaryCtaHref="/cnple-practice-questions"
      secondaryCtaLabel="Practice Questions"
    />
  );
}
