import type { Metadata } from "next";
import { CnpleSeoHubPage, CNPLE_RELATED_LINKS } from "@/components/cnple/cnple-seo-hub-page";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { robotsForRegionalMarketingHub } from "@/lib/seo/expansion-hub-robots";

export const revalidate = 86400;

const PATH = "/cnple-lab-interpretation";
const PAGE_TITLE = "CNPLE Lab Interpretation — Diagnostic Reasoning for Canadian NPs | NurseNest";
const PAGE_H1 = "CNPLE lab interpretation and diagnostic reasoning practice";
const PAGE_DESCRIPTION =
  "CNPLE-aligned laboratory and diagnostic interpretation practice for Canadian NP exam preparation. From routine screening panels to complex multi-system presentations — build the pattern recognition and clinical integration the CNPLE demands.";

const FAQ_ITEMS = [
  {
    question: "How does the CNPLE test lab interpretation?",
    answer:
      "CNPLE lab questions are typically integrated within clinical cases — not standalone value-recall items. A patient presents with a symptom cluster, labs are provided, and the NP must interpret the pattern, narrow the differential, and determine the appropriate management step. Understanding normal ranges is necessary but not sufficient; what matters is what the NP does next.",
  },
  {
    question: "Which lab panels are highest yield for the CNPLE?",
    answer:
      "Based on Canadian NP competency frameworks, highest-yield panels include: CBC with differential (anaemia pattern recognition, infection, thrombocytopenia), comprehensive metabolic panel (renal function, electrolytes, glucose, hepatic enzymes), thyroid function (TSH, T4, T3), lipid panel, HbA1c, urinalysis with microscopy, and coagulation studies. Specific disease-monitoring panels (PSA, ferritin/iron studies, vitamin B12, folate) are also tested.",
  },
  {
    question: "Does the CNPLE include ECG interpretation?",
    answer:
      "ECG interpretation within NP scope — recognising clinically significant patterns like AF, ST-elevation, complete heart block, or LVH — is a reasonable CNPLE preparation domain. NurseNest includes ECG-related diagnostic reasoning questions as part of CNPLE-aligned preparation. Specific CNPLE item formats are confirmed by CCRNR, not NurseNest.",
  },
  {
    question: "How should I practise lab interpretation for the CNPLE?",
    answer:
      "Practise in integrated case format, not isolated value drills. Given a clinical scenario, identify the most informative lab to order before looking at results, then interpret results in the context of the presentation. After a practice session, examine which pattern-recognition decisions were wrong — is it recognising the anaemia subtype, interpreting the metabolic pattern, or determining the clinical significance of a borderline result?",
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
          "CNPLE lab interpretation",
          "Canadian NP diagnostics",
          "CNPLE laboratory questions",
          "Canadian NP lab values",
          "CNPLE diagnostic reasoning",
          "Canadian NP exam diagnostics",
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

export default function CnpleLabInterpretationPage() {
  return (
    <CnpleSeoHubPage
      path={PATH}
      title={PAGE_TITLE}
      h1={PAGE_H1}
      description={PAGE_DESCRIPTION}
      lead="CNPLE-aligned laboratory and diagnostic interpretation practice. The CNPLE does not test isolated lab value recall — it tests whether the NP can integrate diagnostic findings into a clinically coherent management decision. Build that integration here."
      faq={FAQ_ITEMS}
      primaryCtaHref="/canada/np/cnple/questions"
      primaryCtaLabel="Practice Questions"
      secondaryCtaHref="/canada/np/cnple"
      secondaryCtaLabel="CNPLE Hub"
      relatedLinks={[
        CNPLE_RELATED_LINKS[0],
        CNPLE_RELATED_LINKS[1],
        CNPLE_RELATED_LINKS[3],
        CNPLE_RELATED_LINKS[10],
        CNPLE_RELATED_LINKS[11],
        CNPLE_RELATED_LINKS[13],
      ]}
      sections={[
        {
          id: "integrated-diagnostics",
          heading: "How the CNPLE tests diagnostics: integrated, not isolated",
          body: (
            <>
              <p>
                A common mistake in CNPLE preparation is drilling reference range tables without
                clinical context. The CNPLE does not ask "what is the normal serum sodium?" — it
                asks what the NP should do when a patient with heart failure and dyspnoea has a
                sodium of 128, creatinine rising from baseline, and is currently on furosemide
                and an ACE inhibitor. That is a clinical integration problem, not a recall problem.
              </p>
              <p>
                CNPLE-aligned lab interpretation questions embed findings within patient scenarios.
                The candidate must first interpret whether the result is expected or unexpected
                given the presentation, then determine whether it confirms the working diagnosis,
                shifts the differential, or triggers an urgent management change. This sequence
                mirrors actual NP reasoning — which is precisely why it is tested.
              </p>
            </>
          ),
        },
        {
          id: "essential-panels",
          heading: "Essential lab panels for Canadian NPs",
          body: (
            <>
              <p>
                CBC with differential is foundational. Anaemia pattern recognition alone — microcytic
                (iron deficiency vs. thalassaemia), normocytic (chronic disease, renal failure,
                acute haemorrhage), macrocytic (B12/folate deficiency, hypothyroidism, medication
                effect) — is a high-yield skill tested across multiple CNPLE domains including
                geriatrics, women's health, and chronic disease management.
              </p>
              <p>
                Comprehensive metabolic panel interpretation drives prescribing safety decisions:
                eGFR determines whether to initiate metformin, dose-adjust renally-cleared
                medications, or stop nephrotoxic agents; AST/ALT elevation changes statin
                initiation decisions; hyponatraemia and hyperkalaemia patterns guide adjustment
                of diuretics, ACE inhibitors, and ARBs. Thyroid function tests are tested in the
                context of hypothyroidism dosing adjustments, hyperthyroid presentations, and
                subclinical disease management decisions.
              </p>
              <p>
                Urinalysis with microscopy, coagulation panels (PT/INR in anticoagulation
                monitoring, bleeding disorders), inflammatory markers (CRP, ESR in the right
                clinical context), and disease-monitoring panels (HbA1c in diabetes, PSA screening
                in appropriate populations, ferritin in iron-deficiency workup) complete the
                essential CNPLE diagnostics repertoire.
              </p>
            </>
          ),
        },
        {
          id: "imaging-diagnostics",
          heading: "Imaging and ECG interpretation in Canadian NP practice",
          body: (
            <>
              <p>
                Canadian NPs interpret and order diagnostic imaging within their scope — and the
                CNPLE tests the clinical reasoning around this, not just radiological reading.
                Given a chest X-ray description (hyperinflated lungs, reticular opacities, pleural
                effusion), the CNPLE asks what the NP should do next — not to replicate a
                radiologist's report.
              </p>
              <p>
                ECG pattern recognition within NP scope is similarly tested in clinical context:
                recognising AF in a patient presenting with palpitations and dyspnoea (and
                initiating anticoagulation discussion), identifying ST-elevation as requiring
                immediate emergency transfer, or recognising complete heart block as incompatible
                with outpatient management. The emphasis is on the clinical action triggered by the
                finding, not the technical measurement.
              </p>
            </>
          ),
        },
        {
          id: "integration-strategy",
          heading: "Integrating lab results into clinical decisions",
          body: (
            <>
              <p>
                The highest-value CNPLE lab interpretation skill is determining whether a finding
                changes management. If an mildly elevated TSH in an asymptomatic patient changes
                the management plan (initiate levothyroxine, watchful waiting, or repeat in 6
                months) depends on the clinical context — symptom burden, cardiovascular risk,
                patient preferences, and baseline values. The CNPLE rewards candidates who can
                navigate this nuance rather than applying a single algorithm mechanically.
              </p>
              <p>
                Practise by actively predicting interpretation and management before viewing
                rationales. Given a patient and a result, ask: Is this expected or unexpected?
                Does it confirm, shift, or rule out my working diagnosis? Does it require
                immediate action, scheduled follow-up, or watchful waiting? Then verify with
                rationale-rich feedback. This deliberate loop builds the pattern recognition
                the CNPLE rewards more efficiently than passive review.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
