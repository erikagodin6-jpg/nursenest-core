import type { Metadata } from "next";
import { CnpleSeoHubPage, CNPLE_RELATED_LINKS } from "@/components/cnple/cnple-seo-hub-page";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { robotsForRegionalMarketingHub } from "@/lib/seo/expansion-hub-robots";

export const revalidate = 86400;

const PATH = "/cnple-case-studies";

const PAGE_TITLE = "CNPLE Case Studies — Clinical Case Practice for Canadian NPs | NurseNest";
const PAGE_H1 = "CNPLE clinical case studies for Canadian NP exam preparation";
const PAGE_DESCRIPTION =
  "CNPLE-aligned clinical case studies presenting evolving patient scenarios across primary care, acute deterioration, chronic disease management, and specialty populations. Builds the longitudinal reasoning the CNPLE demands.";

const FAQ_ITEMS = [
  {
    question: "What is the format of clinical case studies on the CNPLE?",
    answer:
      "The CNPLE uses a LOFT (linear on-the-fly testing) format with clinical vignettes that require integrated decision-making. NurseNest case studies are independently authored to develop the same kind of longitudinal clinical reasoning — presenting patient presentations that unfold across assessment, investigation, diagnosis, management, and follow-up. These are not sourced from official CNPLE item banks.",
  },
  {
    question: "How do CNPLE clinical cases differ from NCLEX cases?",
    answer:
      "CNPLE-style cases operate at NP scope, which means the candidate must make autonomous decisions: forming a differential, ordering and interpreting investigations, selecting and monitoring a treatment plan including prescribing where indicated, and recognising referral thresholds. NCLEX-RN cases test nursing interventions within RN scope — a categorically different reasoning demand.",
  },
  {
    question: "Which clinical domains do the case studies cover?",
    answer:
      "NurseNest CNPLE-aligned cases span primary care across the lifespan, acute and sub-acute presentations, chronic disease management, reproductive and sexual health, paediatrics, older adult and geriatric care, and mental health. Each case is grounded in Canadian clinical practice guidelines and current NP competency frameworks.",
  },
  {
    question: "How many case studies should I complete before the CNPLE?",
    answer:
      "There is no universal volume target. The most productive approach is to work systematically through your weakest clinical domains until your case accuracy and reasoning speed are consistently high. Use NurseNest's performance tracking to identify which case domains expose gaps, then focus practice there before shifting to mixed-case runs.",
  },
];

const SECTIONS = [
  {
    id: "cnple-vs-nclex-cases",
    heading: "What makes CNPLE cases different from NCLEX scenarios",
    body: (
      <>
        <p>
          The most important conceptual shift for any NP candidate who trained extensively on NCLEX-RN material is
          understanding scope elevation. An NCLEX case asks: given this patient, what does the nurse do? A
          CNPLE-aligned case asks: given this patient, what does the NP diagnose, investigate, prescribe, manage, and
          monitor? That distinction is not cosmetic — it restructures the entire clinical reasoning framework the
          candidate must apply.
        </p>
        <p>
          Canadian NP scope includes autonomous diagnosis, ordering and interpreting diagnostics, prescribing within
          the provincial formulary and regulatory authority, and maintaining longitudinal management relationships
          with patients. Clinical cases at CNPLE depth therefore present more ambiguous presentations, richer
          co-morbidity profiles, and decisions that require weighing multiple valid management pathways rather than
          identifying a single correct nursing intervention. The prescribing dimension alone — drug selection,
          monitoring parameters, contraindication avoidance, and adjustment for renal or hepatic function — adds an
          entire reasoning layer absent from RN-scope cases.
        </p>
        <p>
          Practically, this means CNPLE-aligned case study practice should feel harder than NCLEX preparation. If it
          does not, the cases are not operating at the right scope. NurseNest cases are deliberately calibrated to
          force the candidate to reason through the full NP decision cycle: history, examination, differential,
          investigations, diagnosis confirmation, management plan, prescribing, follow-up, and referral thresholds.
          Candidates who spend adequate time at this reasoning depth before their exam date are measurably better
          prepared than those who rely on RN-level question banks alone.
        </p>
      </>
    ),
  },
  {
    id: "case-formats",
    heading: "Types of clinical case formats in CNPLE-style preparation",
    body: (
      <>
        <p>
          NurseNest structures CNPLE-aligned case study practice across several formats, each targeting a different
          dimension of clinical reasoning. Single-encounter cases present a new patient or an acute presentation and
          require the candidate to move from initial assessment through differential diagnosis to a management
          decision within one clinical visit. These cases develop breadth and speed — the ability to rapidly
          organise an unfamiliar presentation and reach a sound working diagnosis without over-investigating.
        </p>
        <p>
          Multi-visit cases present an evolving patient relationship across time: an initial presentation, a
          follow-up showing partial response or an unexpected development, and a further decision point requiring
          plan modification. This format is particularly valuable for chronic disease management and mental health
          scenarios, where Canadian NPs are expected to maintain longitudinal therapeutic relationships and adjust
          management based on outcome data. The reasoning demand shifts from "what do I do now?" to "what does this
          trajectory tell me, and how do I adapt?"
        </p>
        <p>
          Acute deterioration cases present a patient whose condition is changing — a stable-appearing presentation
          that develops new features suggesting a more serious diagnosis, or a known patient who returns with
          decompensation. These cases test the candidate's ability to recognise red flags, escalate appropriately,
          and distinguish between in-scope NP management and situations requiring immediate physician or emergency
          transfer. Mastery of this format is directly relevant to safe NP practice and is a consistent theme in
          Canadian NP competency frameworks.
        </p>
      </>
    ),
  },
  {
    id: "case-domains",
    heading: "Clinical case domains: lifespan, geriatrics, women's health, paediatrics, mental health",
    body: (
      <>
        <p>
          Canadian NP scope covers the full lifespan, and CNPLE-aligned case study practice must reflect that
          breadth. Primary care across the lifespan cases address the presentations most common in NP-led practice
          settings: respiratory infections, cardiovascular risk management, diabetes, hypertension, skin and
          musculoskeletal complaints, and preventive care including screening and immunisation. These cases require
          integration of Canadian clinical practice guidelines — such as Hypertension Canada, Diabetes Canada, and
          CANMAT — rather than generic pathophysiology recall.
        </p>
        <p>
          Geriatric cases demand a distinct clinical framework. Polypharmacy, atypical presentations of serious
          illness, functional decline, cognitive impairment overlay, and the Beers Criteria for potentially
          inappropriate medications in older adults all introduce reasoning complexity that does not appear in
          younger-patient cases. Women's health and reproductive cases encompass contraception management,
          perimenopause, sexually transmitted infection screening and treatment, prenatal care within NP scope, and
          gynaecological assessment. Paediatric cases require weight-based dosing awareness, developmental context,
          and recognition of the parent-caregiver communication dimension alongside the clinical presentation.
        </p>
        <p>
          Mental health cases are a high-yield domain for Canadian NP candidates because NP scope in this area
          includes assessment, diagnosis, prescribing of psychotropic medications, and management of common mental
          health conditions in primary care. Cases span major depressive disorder, anxiety disorders, attention
          deficit hyperactivity disorder, and early psychosis recognition — each requiring awareness of Canadian
          psychiatric prescribing guidelines, monitoring parameters, and the threshold for specialist referral. This
          domain rewards systematic preparation; candidates who treat mental health as peripheral to NP practice
          consistently underperform on cases that integrate psychiatric and physical co-morbidity.
        </p>
      </>
    ),
  },
  {
    id: "how-to-practice",
    heading: "How to practice with clinical cases effectively",
    body: (
      <>
        <p>
          The most common error in clinical case practice is reading the answer without reconstructing the reasoning.
          When a case reveals the correct answer, the productive question is not "was I right?" but "what was the
          reasoning sequence that leads reliably to this answer, and where did my reasoning diverge?" Candidates who
          habitually perform this reconstruction after each case build durable clinical judgment; those who track
          accuracy scores without interrogating their process do not.
        </p>
        <p>
          Build case practice into a structured weekly rhythm rather than concentrating it in the final weeks before
          the exam. Early in preparation, favour domain-focused blocks: a week of cardiovascular cases, a week of
          respiratory, a week of mental health. This builds schema depth in each area. As the exam date approaches,
          shift to mixed-domain case sessions that replicate the unpredictability of the actual exam, where you do
          not know the domain before you read the first sentence. This transition trains the pattern recognition and
          rapid schema-switching that high-stakes linear testing demands.
        </p>
        <p>
          Use the rationale for every case, not just the cases you got wrong. Correct answers reached through
          partially flawed reasoning are a hidden vulnerability — you may have chosen correctly for the wrong reason,
          which means a slight variation in the scenario would lead you to an incorrect answer. Reading the rationale
          even after a correct response confirms whether your reasoning pathway was sound and deepens the clinical
          schema for that presentation. Over hundreds of cases, this habit compounds into the kind of pattern
          recognition that distinguishes candidates who pass on their first attempt from those who need to re-sit.
        </p>
      </>
    ),
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
          "CNPLE case studies",
          "Canadian NP clinical cases",
          "CNPLE clinical scenarios",
          "Canadian NP primary care cases",
          "CNPLE patient scenarios",
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
      routeGroup: "marketing.default.cnpleCaseStudies",
    },
  );
}

export default function CnpleCaseStudiesPage() {
  return (
    <CnpleSeoHubPage
      path={PATH}
      title={PAGE_TITLE}
      h1={PAGE_H1}
      lead={PAGE_DESCRIPTION}
      description={PAGE_DESCRIPTION}
      sections={SECTIONS}
      faq={FAQ_ITEMS}
      relatedLinks={[...CNPLE_RELATED_LINKS]}
    />
  );
}
