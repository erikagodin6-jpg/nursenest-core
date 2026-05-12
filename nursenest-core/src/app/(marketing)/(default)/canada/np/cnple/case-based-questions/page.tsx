import type { Metadata } from "next";
import { ExamClusterHubPage } from "@/components/seo/exam-cluster-hub-page";
import { CnpleProvisionalDisclaimer } from "@/components/cnple/cnple-provisional-disclaimer";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { robotsForRegionalMarketingHub } from "@/lib/seo/expansion-hub-robots";
import { cnpleHubClusterBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { CNPLE_HUB_RELATED_LINKS } from "@/lib/seo/cnple-seo-cluster";

export const revalidate = 86400;

const PATH = "/canada/np/cnple/case-based-questions";

const PAGE_TITLE =
  "CNPLE Case-Based Questions — Clinical Reasoning Practice for Canadian NPs | NurseNest";

const PAGE_H1 = "CNPLE case-based questions: building clinical reasoning for the Canadian NP exam";

const PAGE_DESCRIPTION =
  "Case-based questions for CNPLE preparation — multi-step clinical scenarios requiring differential diagnosis, investigation selection, and prescribing decisions within Canadian NP competency frameworks.";

const FAQ_ITEMS = [
  {
    question: "What are case-based questions on the CNPLE?",
    answer:
      "Case-based questions present an extended patient scenario — typically 3 to 6 sentences of clinical context including presenting complaint, history, vitals, and relevant investigation results — and require you to make one or more advanced practice decisions. Unlike single-answer recognition questions, case-based format demands that you integrate the full clinical picture before selecting the most appropriate diagnosis, investigation, or management option. CCRNR has not confirmed official item types or case formats as of 2026. NurseNest builds case-based questions in this format to develop the clinical reasoning depth consistent with Canadian NP advanced practice competencies.",
  },
  {
    question: "How do case-based questions differ from single-answer questions?",
    answer:
      "Single-answer questions often test isolated clinical facts: a specific drug interaction, a diagnostic criterion, a screening recommendation. Case-based questions test your ability to apply clinical reasoning to a realistic patient presentation — forming a differential, prioritising the most discriminating investigation, and selecting a management plan that accounts for comorbidities, Canadian guidelines, and prescribing safety. Both formats appear in comprehensive CNPLE preparation. Candidates who practise only isolated-fact questions often struggle with case-based scenarios under time pressure because the integration skill has not been built explicitly.",
  },
  {
    question: "How should I approach a case-based CNPLE question?",
    answer:
      "Read the entire case before looking at the answer options. Identify the patient's key clinical features — age, sex, presenting complaint, relevant history, vital signs, and any investigation results provided. Form your working diagnosis or differential before reading the options. Then evaluate each option against your clinical reasoning, not against which option sounds most familiar. The most common error on case-based questions is selecting a plausible answer that matches a superficial cue in the scenario rather than the most appropriate answer for the complete clinical picture.",
  },
  {
    question: "Do case-based questions include prescribing scenarios?",
    answer:
      "Yes. Prescribing safety and pharmacotherapeutic decision-making are embedded across case-based clinical scenarios in CNPLE-style questions. Cases may require selecting an initial prescribing plan, adjusting a dose for renal impairment, recognising a drug interaction, or choosing between equivalent agents in a Canadian formulary context. The autonomous prescribing authority of nurse practitioners is a defining feature of NP practice that the CNPLE is specifically designed to assess. Prescribing decisions integrated into clinical cases are not a peripheral topic — they are a core testing target.",
  },
];

const SECTIONS = [
  {
    id: "case-based-questions-overview",
    heading: "Why case-based questions are central to CNPLE preparation",
    body: (
      <>
        <p>
          The CNPLE tests the clinical reasoning depth of nurse practitioner advanced practice — not
          nursing knowledge at the RN scope level. That distinction matters most visibly in how questions
          are constructed. Where NCLEX-RN questions often test what to observe, report, or delegate,
          CNPLE-aligned questions test what you would diagnose, investigate, and prescribe as an autonomous
          NP practitioner. Case-based format is the natural vehicle for this level of clinical reasoning
          because it requires integrating a full clinical picture rather than retrieving a fact.
        </p>
        <p>
          Most NP candidates underestimate how different case-based clinical reasoning feels at the NP
          scope compared to the RN scope. In your RN practice, a patient with chest pain requires you to
          assess, intervene, and notify the physician. In NP practice — and in the CNPLE — that same patient
          requires you to form a differential that includes ACS, PE, aortic dissection, pneumothorax, and
          musculoskeletal causes; select the most discriminating initial investigation; interpret the result;
          and determine a management plan including prescribing decisions. Building that reasoning process
          explicitly through case-based practice is not optional for CNPLE readiness.
        </p>
      </>
    ),
  },
  {
    id: "case-based-structure",
    heading: "Structure of CNPLE-style case-based questions",
    body: (
      <>
        <p>
          A well-constructed case-based question for CNPLE preparation includes a realistic clinical
          scenario with sufficient context to require integration, not just pattern recognition. The
          scenario typically includes: patient demographics relevant to the clinical question, presenting
          complaint and relevant history, vital signs and examination findings where appropriate, and
          relevant investigation results when the question tests interpretation or next-step decisions.
          Answer options are plausible, not obviously wrong — each distractor represents a clinically
          coherent but inferior choice given the full clinical picture.
        </p>
        <p>
          The rationale for each question explains not only why the correct answer is best but why each
          distractor is inferior. Reading rationales for questions you answered correctly is as valuable
          as reviewing misses — correct answers reached through incorrect reasoning are a reliability
          risk under exam pressure. The reasoning step between a correct answer and an incorrect one is
          usually specific: a Canadian guideline distinction, a prescribing safety consideration, a
          diagnostic priority based on pre-test probability, or a scope-of-practice boundary.
        </p>
        <p>
          Multi-step cases present a patient scenario and ask two or more sequential questions — what is
          the most appropriate initial investigation, what does the result indicate, and what is the next
          management step. These are particularly effective for building the sequential clinical reasoning
          that the CNPLE's advanced practice scope demands. They force you to hold the clinical picture
          in working memory across multiple decisions, which mirrors the real diagnostic and management
          process in NP practice.
        </p>
      </>
    ),
  },
  {
    id: "case-based-domains",
    heading: "Clinical domains covered in CNPLE case-based practice",
    body: (
      <>
        <p>
          NurseNest builds case-based CNPLE questions across the full scope of Canadian NP advanced
          practice. This includes but is not limited to: cardiovascular assessment and management,
          respiratory presentations including COPD, asthma, and pneumonia, musculoskeletal and
          rheumatologic cases, endocrine presentations including diabetes and thyroid disease, neurological
          presentations including headache, dizziness, and stroke risk, and psychiatric cases requiring
          prescribing and safety assessment.
        </p>
        <p>
          Population-specific cases are built explicitly rather than assumed. Paediatric cases include
          developmental milestones, weight-based prescribing, and age-specific screening. Older adult
          cases include polypharmacy management, functional decline, and frailty-adjusted decision-making.
          Reproductive health cases include contraception, prenatal care, and perinatal mental health.
          Each population requires different reasoning anchors, and the CNPLE samples across populations
          systematically. Candidates whose clinical experience is population-narrow should address that
          gap through case-based practice in their less-familiar populations, not just through didactic
          content review.
        </p>
        <p>
          Canadian guideline application is embedded at the case level. A cardiovascular risk case will
          reference Canadian cardiovascular guidelines rather than American Heart Association guidelines
          where the recommendations diverge. A cancer screening case will apply the Canadian Task Force
          on Preventive Health Care rather than US screening organisations. An immunisation case will use
          NACI schedules. For candidates who have used any US NP preparation material, identifying and
          correcting these guideline gaps through Canadian-calibrated case-based practice is one of the
          most high-value preparation activities available.
        </p>
      </>
    ),
  },
  {
    id: "case-based-strategy",
    heading: "Strategy for case-based questions under CNPLE conditions",
    body: (
      <>
        <p>
          Under the time pressure of a full-length CNPLE, case-based questions require a consistent
          approach. Read the case end-to-end before looking at answers. The question stem often contains
          a piece of information in the third or fourth sentence that critically modifies the clinical
          picture. Candidates who jump to the answer options after reading the first two sentences
          frequently miss the modifier — a relevant drug the patient is already taking, a piece of
          history that narrows the differential significantly, or a vital sign that changes urgency.
        </p>
        <p>
          Once you have read the full case, identify the clinical question being asked. Many case-based
          questions are asking one of a small set of core questions: What is the most likely diagnosis?
          What is the most appropriate next investigation? What is the most appropriate initial
          management? What is the most important safety consideration? Identifying the type of question
          before evaluating the options focuses your reasoning and reduces the time you spend considering
          irrelevant clinical information.
        </p>
        <p>
          Flag and return if time allows rather than spending disproportionate time on a single difficult
          case. LOFT format means every question counts equally — a case-based question is worth the same
          as a knowledge-recall question. Do not let difficult cases pull disproportionate time from the
          remainder of your examination.
        </p>
      </>
    ),
  },
];

const RELATED_LINKS = CNPLE_HUB_RELATED_LINKS.filter((l) =>
  [
    "/canada/np/cnple",
    "/canada/np/cnple/questions",
    "/canada/np/cnple/study-guide",
    "/canada/np/cnple/loft-exam",
    "/canada/np/cnple/provisional-registration",
    "/cnple",
    "/cnple-practice-questions",
    "/cnple-clinical-judgment",
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
          "CNPLE case-based questions",
          "CNPLE clinical reasoning",
          "Canadian NP exam clinical cases",
          "CNPLE case studies",
          "Canadian nurse practitioner case questions",
          "CNPLE differential diagnosis practice",
          "CCRNR NP exam cases",
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
      routeGroup: "marketing.default.cnple.case_based_questions",
    },
  );
}

export default function CnpleCaseBasedQuestionsPage() {
  return (
    <ExamClusterHubPage
      path={PATH}
      title={PAGE_TITLE}
      h1={PAGE_H1}
      eyebrow="CNPLE Clinical Reasoning 2026"
      lead={PAGE_DESCRIPTION}
      description={PAGE_DESCRIPTION}
      sections={SECTIONS}
      faq={FAQ_ITEMS}
      relatedLinks={RELATED_LINKS}
      breadcrumbs={cnpleHubClusterBreadcrumbs("Case-Based Questions", PATH)}
      primaryCtaHref="/canada/np/cnple/questions"
      primaryCtaLabel="Practice Questions"
      secondaryCtaHref="/canada/np/cnple"
      secondaryCtaLabel="CNPLE Hub"
      ctaHeading="Build clinical reasoning for the CNPLE on NurseNest"
      ctaBody="Case-based clinical scenarios, multi-step diagnostic reasoning, and prescribing safety questions — all scoped to Canadian NP advanced practice competencies."
      disclaimer={<CnpleProvisionalDisclaimer variant="card" hideWhenConfirmed={false} />}
    />
  );
}
