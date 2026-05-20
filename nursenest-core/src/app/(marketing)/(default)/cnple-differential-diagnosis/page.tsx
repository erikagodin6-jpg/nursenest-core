import type { Metadata } from "next";
import { CnpleSeoHubPage, CNPLE_RELATED_LINKS } from "@/components/cnple/cnple-seo-hub-page";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { robotsForRegionalMarketingHub } from "@/lib/seo/expansion-hub-robots";

export const revalidate = 86400;

const PATH = "/cnple-differential-diagnosis";
const PAGE_TITLE = "CNPLE Differential Diagnosis — Canadian NP Exam Practice | NurseNest";
const PAGE_H1 = "CNPLE differential diagnosis practice for Canadian nurse practitioners";
const PAGE_DESCRIPTION =
  "CNPLE-aligned differential diagnosis practice for Canadian NP exam preparation. Build systematic reasoning for generating, narrowing, and confirming differentials at Canadian NP scope — across primary care, acute presentations, and chronic disease.";

const FAQ_ITEMS = [
  {
    question: "How does the CNPLE test differential diagnosis?",
    answer:
      "CNPLE differential diagnosis questions present a patient with a symptom cluster or evolving presentation and ask the NP to identify the most likely diagnosis, the most important diagnosis to rule out, or the highest-priority next step in workup. Items are integrated — the diagnosis informs the management decision, not just the label.",
  },
  {
    question: "What are the highest-yield differential diagnosis scenarios for the CNPLE?",
    answer:
      "Based on Canadian NP competency frameworks, high-yield differential clusters include: chest pain (ACS vs. GERD vs. musculoskeletal vs. pulmonary embolism vs. anxiety), dyspnoea (heart failure vs. COPD/asthma exacerbation vs. pulmonary embolism vs. pneumonia), abdominal pain (appendicitis vs. biliary vs. inflammatory bowel vs. renal colic vs. ectopic pregnancy), headache (tension vs. migraine vs. subarachnoid haemorrhage vs. hypertensive emergency), and fatigue (anaemia vs. thyroid disease vs. depression vs. chronic disease).",
  },
  {
    question: "How do I improve differential diagnosis speed on the CNPLE?",
    answer:
      "Speed in differential diagnosis comes from pattern recognition built through deliberate case-based practice. Work through clinical scenarios and force yourself to generate a ranked differential before looking at the answer. Then focus on the discriminating features — the symptoms, signs, and test results that shift probability between your top candidates. That deliberate discrimination practice builds the rapid pattern recognition the exam rewards.",
  },
  {
    question: "Does NurseNest include 'must-not-miss' differential practice?",
    answer:
      "Yes. CNPLE-aligned practice includes scenarios where the most common diagnosis is NOT the most important one to rule out first — a classic exam testing pattern. Chest pain in a 45-year-old with three risk factors requires ruling out ACS before GERD even if GERD is statistically more likely. NurseNest cases embed these must-not-miss anchor points throughout the clinical case library.",
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
          "CNPLE differential diagnosis",
          "Canadian NP differential diagnosis",
          "CNPLE clinical reasoning",
          "Canadian NP exam differentials",
          "CNPLE diagnosis questions",
          "Canadian NP must not miss",
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

export default function CnpleDifferentialDiagnosisPage() {
  return (
    <CnpleSeoHubPage
      path={PATH}
      title={PAGE_TITLE}
      h1={PAGE_H1}
      description={PAGE_DESCRIPTION}
      lead="CNPLE-aligned differential diagnosis practice targeting systematic generation, probabilistic ranking, and evidence-based narrowing of differentials at Canadian NP scope. The CNPLE rewards candidates who reason through the differential, not those who memorise it."
      faq={FAQ_ITEMS}
      primaryCtaHref="/canada/np/cnple/questions"
      primaryCtaLabel="Practice Questions"
      secondaryCtaHref="/canada/np/cnple/simulation"
      secondaryCtaLabel="CNPLE Simulation"
      relatedLinks={[
        CNPLE_RELATED_LINKS[0],
        CNPLE_RELATED_LINKS[1],
        CNPLE_RELATED_LINKS[3],
        CNPLE_RELATED_LINKS[10],
        CNPLE_RELATED_LINKS[11],
        CNPLE_RELATED_LINKS[12],
        CNPLE_RELATED_LINKS[13],
      ]}
      sections={[
        {
          id: "np-scope-differential",
          heading: "Differential diagnosis at NP scope: what changes",
          body: (
            <>
              <p>
                At NP scope, differential diagnosis is not a step that leads to a physician referral
                — it is a step that leads to an NP management decision. After generating and
                narrowing a differential, the Canadian NP owns the workup, the diagnosis, and the
                treatment plan within legislated scope. The CNPLE tests whether candidates can close
                that loop independently rather than escalating prematurely.
              </p>
              <p>
                This distinction matters for exam preparation. NCLEX-RN differential practice often
                ends at "which finding warrants immediate reporting to the physician." CNPLE
                differential practice ends at "what does the NP prescribe, order, or initiate
                next?" Candidates who practise using only RN-scope materials will under-prepare
                for this ownership of the diagnostic outcome.
              </p>
            </>
          ),
        },
        {
          id: "systematic-approach",
          heading: "A systematic approach to CNPLE differentials",
          body: (
            <>
              <p>
                A reliable exam differential approach: (1) Identify the anchor — the single most
                discriminating feature of the presentation. (2) Generate candidates — two to five
                diagnoses that explain the anchor, ordered by probability. (3) Apply discriminating
                features — symptoms, signs, timing, and patient factors that raise or lower each
                candidate's probability. (4) Identify the must-not-miss — the dangerous diagnosis
                that must be ruled out even if less probable. (5) Determine the highest-yield next
                step — the single test or action that most efficiently confirms or excludes the top
                candidates.
              </p>
              <p>
                This five-step loop, practised consistently with case-based scenarios, builds the
                pattern recognition that makes CNPLE differential questions feel familiar rather
                than novel. The goal is not to memorise every differential — it is to apply the
                same reasoning scaffold reliably across presentations.
              </p>
            </>
          ),
        },
        {
          id: "high-yield-clusters",
          heading: "High-yield differential clusters for the CNPLE",
          body: (
            <>
              <p>
                Chest pain differentials are among the most tested in NP primary care exams.
                The must-not-miss anchor (ACS, pulmonary embolism, aortic dissection) must be
                systematically excluded before settling on the more common (GERD, musculoskeletal,
                anxiety). Key discriminating features include onset and character of pain, associated
                symptoms, risk factor burden, and response to positional or dietary triggers.
              </p>
              <p>
                Dyspnoea differentials are equally prevalent: heart failure (orthopnoea, PND,
                elevated BNP), COPD/asthma exacerbation (wheeze, smoking history, peak flow),
                pneumonia (fever, productive cough, consolidation on imaging), pulmonary embolism
                (risk factors, pleuritic pain, asymmetric leg swelling), and anaemia (pallor,
                fatigue, haematological context). Each requires a different initial investigation
                and management pathway — making them ideal CNPLE integration targets.
              </p>
              <p>
                Headache differentials require particular attention to red flags: sudden-onset
                "thunderclap" headache (subarachnoid haemorrhage until proven otherwise), new
                headache in a patient over 50 (giant cell arteritis), headache with systemic
                symptoms (meningitis, space-occupying lesion). NurseNest embeds these red-flag
                anchors throughout clinical case practice.
              </p>
            </>
          ),
        },
        {
          id: "narrowing-with-diagnostics",
          heading: "Narrowing and confirming differentials with targeted diagnostics",
          body: (
            <>
              <p>
                Once a differential is generated, the CNPLE tests which investigation is ordered
                first and why. The highest-yield next step is not always the most definitive test
                — it is the one that most efficiently changes management. A D-dimer in a low
                pre-test probability PE has high negative predictive value and may safely exclude
                the diagnosis without CT-PA. A troponin in a chest pain presentation with classic
                ACS features does not change the immediate management (transfer for PCI) — the
                ECG does.
              </p>
              <p>
                This investigation-efficiency reasoning is a distinctly NP-level skill. Canadian
                primary care NPs operate in environments where investigation access, patient
                burden, and management pathways all factor into test selection. CNPLE-aligned
                differential diagnosis practice targets this integration — not just "which test
                diagnoses this condition" but "which test changes what I do next."
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
