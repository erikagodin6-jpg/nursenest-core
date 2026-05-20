import type { Metadata } from "next";
import { CnpleSeoHubPage, CNPLE_RELATED_LINKS } from "@/components/cnple/cnple-seo-hub-page";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { robotsForRegionalMarketingHub } from "@/lib/seo/expansion-hub-robots";

export const revalidate = 86400;

const PATH = "/cnple-practice-questions";

const PAGE_TITLE = "CNPLE Practice Questions — Canadian NP Exam Prep | NurseNest";

const PAGE_H1 = "CNPLE practice questions for Canadian NP exam preparation";

const PAGE_DESCRIPTION =
  "CNPLE-aligned practice questions covering clinical judgment, prescribing safety, diagnostics, and lifespan care. Rationale-rich, domain-tagged, and scoped to Canadian NP competencies.";

const FAQ_ITEMS = [
  {
    question: "Are these official CNPLE questions?",
    answer:
      "No. NurseNest practice questions are independently authored and are not sourced from or endorsed by CCRNR. They are designed to build the clinical reasoning depth that Canadian NP competency frameworks and advanced practice examinations demand. Always verify exam format and content details directly with CCRNR and your provincial college.",
  },
  {
    question: "What question types does the CNPLE use?",
    answer:
      "CCRNR has not published confirmed item type details as of 2026. NurseNest builds practice questions in single-best-answer clinical vignette format and case-based diagnostic reasoning format, which reflect the clinical judgment depth consistent with Canadian NP advanced practice competencies. NurseNest question formats are independently designed for preparation — they are not confirmed CNPLE item types.",
  },
  {
    question: "How many practice questions should I do?",
    answer:
      "There is no universal target number. Consistent improvement in accuracy across your weakest two or three domains is a better readiness signal than raw question count. Use your first mixed diagnostic session to identify domain gaps, then build focused blocks in those areas. Track accuracy trends across successive sessions rather than cumulative totals.",
  },
  {
    question: "Are rationales provided?",
    answer:
      "Yes. Every NurseNest practice question includes a detailed rationale explaining the correct answer, why each distractor is inferior, and the clinical reasoning or Canadian guideline context informing the decision. Reading rationales on questions you answered correctly is as important as reviewing misses — surface-level correct answers often reveal reasoning shortcuts that become a liability under exam pressure.",
  },
];

const SECTIONS = [
  {
    id: "types-of-cnple-questions",
    heading: "Types of CNPLE-aligned practice questions",
    body: (
      <>
        <p>
          CNPLE-aligned practice questions differ categorically from RN exam questions. Where NCLEX-RN
          questions emphasise safe nursing care within registered nurse scope, CNPLE-style questions test
          autonomous advanced practice decisions: selecting a working diagnosis from a differential, choosing
          the most discriminating investigation, determining the safest prescribing plan for a patient with
          comorbidities, and recognising when to refer or escalate. The clinical reasoning demand is steeper
          because the practice scope is steeper.
        </p>
        <p>
          NurseNest builds practice across several clinical reasoning formats. Single-best-answer clinical
          vignettes present a 2 to 5 sentence patient scenario with one clearly superior answer — distractors
          differ in priority or safety profile, not in clinical accuracy alone. Case-based diagnostic reasoning
          questions present richer patient presentations requiring differential formation, investigation
          selection, and cumulative reasoning across a longer clinical arc. Prescribing safety questions isolate
          the drug selection, monitoring, interaction, and contraindication reasoning that appears throughout
          every body system in advanced practice examination contexts.
        </p>
        <p>
          All question formats are independently designed for preparation purposes. NurseNest question formats
          reflect NurseNest's clinical taxonomy and are not confirmed CNPLE item types. Confirm official exam
          format details directly with CCRNR.
        </p>
      </>
    ),
  },
  {
    id: "clinical-case-clusters",
    heading: "Clinical case clusters and domain coverage",
    body: (
      <>
        <p>
          NurseNest organises CNPLE-aligned practice across the major domains that Canadian NP competency
          frameworks consistently emphasise. Clinical assessment and differential diagnosis covers history
          integration, physical examination findings, and the systematic formation of a working diagnosis across
          acuity levels. Laboratory and diagnostic interpretation covers CBC, metabolic panels, thyroid function,
          coagulation studies, urinalysis, lipid panels, and ECG interpretation — always within a clinical
          vignette requiring a management decision, not just identification of abnormals.
        </p>
        <p>
          Population-specific clinical reasoning includes paediatrics (developmental milestones, weight-based
          dosing, well-child surveillance, fever management), older adult and geriatric care (polypharmacy and
          Beers criteria, frailty assessment, delirium versus dementia differentiation, atypical disease
          presentation), reproductive and sexual health (contraception, prenatal care, STI management, menopause),
          and mental health (depression, anxiety, psychosis, substance use disorders, psychotropic prescribing
          within Canadian formulary constraints). Each population cluster requires reasoning patterns that general
          mixed-mode practice does not reliably build.
        </p>
        <p>
          Professional, ethical, and legal scenarios cover informed consent, capacity assessment, mandatory
          reporting obligations under Canadian provincial legislation, and the scope-of-practice limits of NP
          practice across different jurisdictions. These scenarios test regulatory knowledge that clinical
          experience alone does not guarantee.
        </p>
      </>
    ),
  },
  {
    id: "prescribing-safety-questions",
    heading: "Prescribing safety questions for Canadian NP candidates",
    body: (
      <>
        <p>
          Prescribing safety is the highest-integration domain in the CNPLE because it intersects with every
          clinical system and population. An NP managing a patient with type 2 diabetes and chronic kidney
          disease must integrate renal function into metformin dosing decisions. An NP managing an older adult
          must apply Beers criteria to assess polypharmacy risk. An NP managing a patient with depression must
          navigate drug interactions between antidepressants and their other medications, assess suicide risk,
          and align prescribing with Canadian formulary and regulatory context.
        </p>
        <p>
          NurseNest prescribing safety questions cover drug selection rationale, dose adjustment for organ
          impairment, contraindications and black-box warnings, drug-drug and drug-disease interactions,
          monitoring requirements, and Canadian prescribing regulations including controlled drug scheduling
          under the Controlled Drugs and Substances Act (CDSA). Candidates who have studied primarily on US
          NP preparation materials should note that DEA scheduling and HIPAA-based scenario framing do not
          reflect Canadian practice — reorientation to Canadian regulatory context is necessary before sitting
          the CNPLE.
        </p>
      </>
    ),
  },
  {
    id: "effective-use-of-practice-questions",
    heading: "How to use practice questions effectively for CNPLE prep",
    body: (
      <>
        <p>
          The most common preparation error is treating practice questions as a score game rather than a
          reasoning drill. Your accuracy percentage is a useful signal, but the clinical reasoning behind each
          miss is the actual study asset. Reviewing rationales on every incorrect answer — and on correct
          answers reached by uncertain reasoning — is the mechanism through which practice questions actually
          improve performance.
        </p>
        <p>
          Run a mixed diagnostic session of 40 to 60 questions across all domains in your first week. Tag every
          miss by domain. Your goal is to identify the two or three domains where accuracy is weakest — those
          drive the structure of your foundation study block. Then move to focused 20 to 30 question blocks
          within your weakest domains, reviewing every rationale and spacing repetition across sessions two
          days apart. Once domain accuracy has improved, shift to mixed-domain breadth practice and begin
          integrating full-length timed simulation runs to build the pacing discipline that the CNPLE's
          fixed-length LOFT format demands.
        </p>
      </>
    ),
  },
];

const RELATED_LINKS = CNPLE_RELATED_LINKS.filter((l) =>
  [
    "/cnple",
    "/cnple-simulation-exam",
    "/cnple-study-guide",
    "/cnple-case-studies",
    "/cnple-prescribing-questions",
    "/cnple-lab-interpretation",
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
          "CNPLE practice questions",
          "Canadian NP practice test",
          "CNPLE clinical judgment questions",
          "Canadian NP exam questions",
          "CNPLE question bank",
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
      routeGroup: "marketing.default.cnplePracticeQuestions",
    },
  );
}

export default function CnplePracticeQuestionsPage() {
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
      primaryCtaHref="/canada/np/cnple/questions"
      primaryCtaLabel="Start Practice Questions"
      secondaryCtaHref="/cnple-simulation-exam"
      secondaryCtaLabel="Try a Simulation"
    />
  );
}
