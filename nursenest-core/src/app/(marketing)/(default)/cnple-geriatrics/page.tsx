import type { Metadata } from "next";
import { CnpleSeoHubPage, CNPLE_RELATED_LINKS } from "@/components/cnple/cnple-seo-hub-page";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { robotsForRegionalMarketingHub } from "@/lib/seo/expansion-hub-robots";

export const revalidate = 86400;

const PATH = "/cnple-geriatrics";
const PAGE_TITLE = "CNPLE Geriatrics — Canadian NP Exam Prep | NurseNest";
const PAGE_H1 = "CNPLE geriatric questions for Canadian nurse practitioners";
const PAGE_DESCRIPTION =
  "CNPLE-aligned geriatric practice questions for Canadian NP exam preparation. Frailty assessment, polypharmacy, cognitive screening, falls prevention, dementia management, and end-of-life care within Canadian NP scope.";

const FAQ_ITEMS = [
  {
    question: "What geriatric topics are on the CNPLE?",
    answer:
      "CNPLE-aligned geriatric content includes: frailty assessment and the comprehensive geriatric assessment framework, polypharmacy review and deprescribing (Beers Criteria, STOPP/START), cognitive impairment screening (MMSE, MoCA), dementia management within primary care NP scope, falls risk assessment and prevention, delirium recognition and management, urinary incontinence, and goals-of-care conversations. Medical assistance in dying (MAID) within Canadian federal and provincial frameworks is a professional-legal competency relevant to geriatric NP practice.",
  },
  {
    question: "Is polypharmacy a major focus of CNPLE geriatric questions?",
    answer:
      "Yes. Polypharmacy is one of the highest-risk areas in geriatric primary care and appears frequently in CNPLE-aligned preparation. Questions test whether the NP can identify potentially inappropriate medications using tools like the Beers Criteria and STOPP/START, prioritise which medications to deprescribe given the patient's goals, adjust doses for age-related pharmacokinetic changes, and recognise drug-disease interactions particularly hazardous in older adults.",
  },
  {
    question: "How does the CNPLE test frailty?",
    answer:
      "Frailty assessment on the CNPLE tests whether the NP can identify frailty using validated tools (Rockwood Clinical Frailty Scale, FRAIL questionnaire) and translate that assessment into clinical decisions — adjusting treatment intensity, setting appropriate goals of care, and recognising when a frail older adult's care plan requires a different approach than a robust patient with the same diagnosis.",
  },
  {
    question: "Is MAID included in CNPLE preparation?",
    answer:
      "Medical assistance in dying (MAID) is a legal, regulated practice in Canada and a dimension of professional NP practice. CNPLE-aligned preparation covers the regulatory framework, eligibility criteria, the NP's role in assessment and provision (where legislated), conscience rights, and the professional obligations around referral. This is a professional-legal competency domain, not a clinical procedural one, for NP exam purposes.",
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
          "CNPLE geriatrics",
          "Canadian NP geriatric exam",
          "CNPLE older adult questions",
          "Canadian NP geriatrics practice",
          "CNPLE polypharmacy",
          "Canadian NP dementia management",
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

export default function CnpleGeriatricsPage() {
  return (
    <CnpleSeoHubPage
      path={PATH}
      title={PAGE_TITLE}
      h1={PAGE_H1}
      description={PAGE_DESCRIPTION}
      lead="CNPLE-aligned geriatric practice questions for Canadian NP exam preparation. Canada's aging demographic makes geriatric primary care a core NP competency — frailty, polypharmacy, cognitive care, falls, and goals-of-care are all tested in the CNPLE's lifespan framework."
      faq={FAQ_ITEMS}
      primaryCtaHref="/canada/np/cnple/questions"
      primaryCtaLabel="Practice Questions"
      secondaryCtaHref="/canada/np/cnple"
      secondaryCtaLabel="CNPLE Hub"
      relatedLinks={[
        CNPLE_RELATED_LINKS[0],
        CNPLE_RELATED_LINKS[1],
        CNPLE_RELATED_LINKS[3],
        { href: "/cnple-pediatrics", label: "Paediatrics" },
        { href: "/cnple-womens-health", label: "Women's Health" },
        { href: "/cnple-prescribing-questions", label: "Prescribing Questions" },
        CNPLE_RELATED_LINKS[10],
      ]}
      sections={[
        {
          id: "geriatric-scope",
          heading: "Geriatric NP scope in Canadian primary care",
          body: (
            <>
              <p>
                Canada's aging population means that geriatric primary care is a central NP
                practice domain. Canadian NPs in community settings routinely assess frailty,
                manage multimorbidity, review complex medication regimens, coordinate dementia
                care, counsel on advance care planning, and support patients and families through
                end-of-life decisions. The CNPLE tests these competencies as part of the lifespan
                framework that underpins the national single NP classification model.
              </p>
              <p>
                Geriatric scenarios on the CNPLE do not present single-system pathology in
                isolation. They present the clinical complexity of the real older adult: a patient
                with diabetes, hypertension, moderate dementia, and recent falls who presents with
                increasing confusion. The NP must systematically assess each contributing factor,
                manage polypharmacy safely, address functional decline, and engage appropriate
                community supports — all within primary care scope.
              </p>
            </>
          ),
        },
        {
          id: "frailty-cga",
          heading: "Frailty, functional assessment, and the comprehensive geriatric assessment",
          body: (
            <>
              <p>
                Frailty is not synonymous with age — it is a clinical syndrome of reduced
                physiological reserve that increases vulnerability to adverse outcomes. The
                Rockwood Clinical Frailty Scale (CFS) provides a practical clinical tool used
                widely in Canadian primary care, rating patients from Very Fit (1) to Terminally
                Ill (9). CNPLE-aligned preparation covers how frailty staging informs treatment
                decisions: a CFS 6–7 patient with a new atrial fibrillation diagnosis has a
                different anticoagulation risk-benefit calculus than a robust 80-year-old.
              </p>
              <p>
                The comprehensive geriatric assessment (CGA) concept informs CNPLE scenarios:
                systematic evaluation of functional status (ADLs, IADLs), cognitive function
                (MMSE, MoCA — knowing which tool to use and how to interpret the result),
                mood (GDS, PHQ-9 adapted for older adults), medication burden, social supports,
                and home safety. The NP does not need to memorise scoring algorithms verbatim;
                the CNPLE tests whether the candidate understands what the assessment reveals
                and how it changes management.
              </p>
            </>
          ),
        },
        {
          id: "polypharmacy",
          heading: "Polypharmacy and deprescribing in older Canadians",
          body: (
            <>
              <p>
                Polypharmacy — typically defined as five or more concurrent medications — is
                ubiquitous in older Canadian primary care patients and carries compounding risks:
                adverse drug reactions, drug-disease interactions, drug-drug interactions,
                adherence challenges, and falls risk. The CNPLE tests the NP's ability to
                critically review a medication list and identify candidates for deprescribing.
              </p>
              <p>
                The Beers Criteria (American Geriatrics Society) and STOPP/START (European)
                tools provide systematic frameworks for identifying potentially inappropriate
                medications in older adults — anticholinergic burden (TCAs, first-generation
                antihistamines, bladder agents in a patient with dementia), benzodiazepine use
                (falls risk, dependence, cognitive impairment), NSAIDs (renal function, GI risk,
                fluid retention in heart failure), and proton pump inhibitors at doses or
                durations exceeding indication. CNPLE-aligned preparation includes scenario-based
                practice applying these frameworks rather than list memorisation.
              </p>
            </>
          ),
        },
        {
          id: "dementia-eol",
          heading: "Dementia management and goals-of-care conversations",
          body: (
            <>
              <p>
                Dementia management in Canadian primary care NP practice includes early
                identification (cognitive screening triggers, appropriate investigation to rule out
                reversible causes), pharmacological management (cholinesterase inhibitors — who
                benefits, realistic expectations, when to discontinue), behavioural and
                psychological symptoms of dementia (non-pharmacological first-line, antipsychotic
                risks in older adults with dementia), and advance care planning initiated early
                while the patient retains decision-making capacity.
              </p>
              <p>
                Goals-of-care conversations are a core NP professional competency — knowing how
                to introduce advance care planning, use tools like the Serious Illness Conversation
                Guide, and document substitute decision-maker designation and treatment preferences
                in the patient's record. Medical assistance in dying (MAID) competency for the
                CNPLE focuses on the regulatory framework, eligibility criteria assessment, and
                professional obligations around referral — not procedural technique, which is a
                separate scope consideration by province.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
