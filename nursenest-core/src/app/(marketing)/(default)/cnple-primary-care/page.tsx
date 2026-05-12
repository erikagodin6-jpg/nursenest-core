import type { Metadata } from "next";
import { CnpleSeoHubPage, CNPLE_RELATED_LINKS } from "@/components/cnple/cnple-seo-hub-page";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { robotsForRegionalMarketingHub } from "@/lib/seo/expansion-hub-robots";

export const revalidate = 86400;

const PATH = "/cnple-primary-care";

const PAGE_TITLE = "CNPLE Primary Care — Canadian NP Exam Prep | NurseNest";
const PAGE_H1 = "CNPLE primary care questions for Canadian nurse practitioners";
const PAGE_DESCRIPTION =
  "CNPLE-aligned primary care practice questions for Canadian NP exam preparation. Covers chronic disease management, preventive care, screening, patient education, and longitudinal primary care reasoning across the lifespan.";

const FAQ_ITEMS = [
  {
    question: "What primary care topics are on the CNPLE?",
    answer:
      "Primary care is one of the largest domains in the CNPLE competency framework. Expect questions on chronic disease management (diabetes, hypertension, COPD, asthma, dyslipidaemia), preventive care and screening aligned to Canadian Task Force on Preventive Health Care recommendations, patient education, therapeutic decision-making, and longitudinal management of complex patients across multiple visits. Cultural safety and equitable care are embedded throughout rather than siloed into a single topic.",
  },
  {
    question: "How is primary care different in Canadian NP practice?",
    answer:
      "Canadian NPs in primary care operate within legislated provincial scope that includes independent assessment, diagnosis, and prescribing where authorised. The clinical context differs from US NP practice in several important ways: Canadian guidelines from Hypertension Canada, Diabetes Canada, and the Canadian Thoracic Society drive treatment targets and drug selection rather than JNC 8 or ADA frameworks. Privacy obligations follow PIPEDA and provincial legislation rather than HIPAA. Controlled substances are scheduled under the Controlled Drugs and Substances Act. The CNPLE reflects this Canadian regulatory and guideline context throughout.",
  },
  {
    question: "Are there chronic disease questions on the CNPLE?",
    answer:
      "Yes — chronic disease management is heavily represented. Expect scenarios requiring you to initiate or adjust treatment for type 2 diabetes (including SGLT2 inhibitors and GLP-1 agents where indicated), manage blood pressure targets aligned to Hypertension Canada guidelines, titrate inhaled therapies for COPD and asthma, and interpret lipid panels using Canadian cardiovascular risk calculators such as the Framingham Risk Score or QRISK. Questions often test your ability to manage multiple concurrent chronic conditions in the same patient rather than each condition in isolation.",
  },
  {
    question: "How does NurseNest cover primary care for the CNPLE?",
    answer:
      "NurseNest offers CNPLE-aligned primary care practice questions written to Canadian NP scope, Canadian clinical guidelines, and the CNPLE competency blueprint. Questions include detailed rationales that explain guideline-based reasoning rather than just identifying the correct answer. You can work through primary care questions by domain, use adaptive-style sessions to surface your weakest subtopics, or run full simulation sessions that include primary care scenarios alongside other CNPLE content areas. All content uses Canadian spelling and Canadian guideline references.",
  },
];

const SECTIONS = [
  {
    id: "primary-care-scope",
    heading: "Primary care scope for Canadian nurse practitioners",
    body: (
      <>
        <p>
          Primary care nurse practitioners in Canada hold a legislated scope that encompasses independent assessment,
          differential diagnosis, ordering and interpreting investigations, and prescribing within provincial authorisation
          frameworks. Unlike the registered nurse role, the NP in primary care is typically the most responsible provider
          for a defined patient panel — accountable for longitudinal management, follow-up, and coordination of specialist
          input when clinical complexity exceeds primary care scope. This accountability is what the CNPLE tests: not just
          whether you can identify a correct answer in isolation, but whether you demonstrate safe, competent, autonomous
          advanced practice reasoning across the lifespan.
        </p>
        <p>
          Canadian NP scope is legislated provincially, so prescribing authority, formulary access, and referral
          pathways vary by jurisdiction. The CNPLE is written to national NP competency standards rather than any single
          province's scope, which means exam scenarios reflect the consensus of what a safe, competent Canadian NP
          in primary care should be capable of doing. Candidates from provinces with more restrictive local scope
          should prepare for the full national standard, not their local practice environment.
        </p>
        <p>
          The CNPLE-aligned primary care content on NurseNest covers the full lifespan across the primary care
          encounter: infant and well-child visits, adolescent health and mental health screening, adult chronic and
          acute presentations, occupational and travel health, and complex older adult care. Expect integration across
          systems rather than single-organ questions, because the primary care NP manages the whole person across time.
        </p>
      </>
    ),
  },
  {
    id: "chronic-disease",
    heading: "Chronic disease management in primary care (diabetes, hypertension, COPD, asthma, lipids)",
    body: (
      <>
        <p>
          Chronic disease management is the centrepiece of Canadian NP primary care practice, and it is correspondingly
          prominent in the CNPLE. For diabetes, the CNPLE tests initiation and intensification of pharmacotherapy using
          Canadian Diabetes Standards guidelines, including understanding of SGLT2 inhibitors and GLP-1 receptor agonists
          for patients with established cardiovascular disease or high risk, renal protection thresholds, and A1C target
          individualisation based on frailty, life expectancy, and hypoglycaemia risk. Insulin management, sick-day rules,
          and foot care referral decision-making also appear in this domain.
        </p>
        <p>
          Hypertension Canada guidelines anchor blood pressure management questions. Expect target thresholds that differ
          from JNC 8 framing — particularly around systolic targets in older adults and drug class selection based on
          Canadian formulary positioning (ACE inhibitors and ARBs as preferred first-line in most diabetic patients; CCBs
          and thiazides in Black Canadian patients with uncomplicated hypertension). COPD questions reference the Canadian
          Thoracic Society guidelines for inhaler escalation: SABA for reliever, LAMA or LAMA/LABA combinations for
          maintenance, and ICS addition criteria tied to eosinophil levels and exacerbation frequency rather than spirometry
          severity alone. Asthma management follows Canadian Thoracic Society stepwise protocols with particular emphasis on
          confirming the diagnosis with spirometry before committing to long-term controller therapy.
        </p>
        <p>
          Lipid management scenarios on the CNPLE use Canadian cardiovascular risk calculators and Lipid Guidelines from
          the Canadian Cardiovascular Society — not ACC/AHA pooled cohort equations. A candidate who has prepared
          exclusively on US materials will encounter unfamiliar thresholds. NurseNest CNPLE-style primary care questions
          consistently anchor lipid scenarios to Canadian targets so that your practice reflects what the actual exam expects.
        </p>
      </>
    ),
  },
  {
    id: "preventive-care",
    heading: "Preventive care and screening in Canadian primary care (cancer screening, immunisations, cardiovascular risk)",
    body: (
      <>
        <p>
          Preventive care questions test your knowledge of Canadian screening recommendations and your ability to apply
          them to individual patients with varying risk profiles. The Canadian Task Force on Preventive Health Care
          (CTFPHC) is the authoritative source for cancer screening intervals on the CNPLE — not the USPSTF. This
          distinction matters: CTFPHC cervical cancer screening recommendations include specific intervals for HPV-based
          testing that differ from USPSTF timelines. Breast cancer screening recommendations vary by age and risk level
          and have been subject to updated CTFPHC guidance. Lung cancer screening with low-dose CT applies to high-risk
          smokers using Canadian eligibility criteria. The CNPLE expects you to know which recommendations apply, not
          merely that screening exists.
        </p>
        <p>
          Immunisation scenarios on the CNPLE reference the National Advisory Committee on Immunization (NACI) schedule
          rather than ACIP. Key differences include timing of combination vaccines, high-dose influenza vaccine
          recommendations for adults over 65, pneumococcal vaccination schedules aligned to Canadian sequencing protocols,
          HPV vaccination catch-up ages, and RSV immunisation recommendations as they have evolved. Primary care NPs
          are frequently the sole provider ordering and administering immunisations for their panels, so the CNPLE expects
          confident, guideline-accurate vaccination decision-making.
        </p>
        <p>
          Cardiovascular risk screening uses the Framingham Risk Score and Canadian Cardiovascular Society lipid
          guidelines as primary references. Questions may present a patient's demographic and laboratory profile and ask
          you to calculate risk category, determine whether statin therapy is indicated, or select appropriate lifestyle
          counselling targets. Combining cardiovascular, diabetes, and renal risk screening in the same patient — a
          common real-world NP encounter — is a frequent CNPLE scenario type.
        </p>
      </>
    ),
  },
  {
    id: "longitudinal-management",
    heading: "Longitudinal patient management across visits",
    body: (
      <>
        <p>
          The CNPLE frequently tests longitudinal reasoning: not just what you do at the first visit, but how you follow
          up, adjust the plan, escalate when warranted, and maintain continuity of care. Scenario stems often present
          a patient returning after a prior visit and ask what the NP should do next given new information, a
          missed target, a new symptom, or an adverse drug effect. This tests the depth of your clinical judgment in
          a way that single-visit questions cannot.
        </p>
        <p>
          Common longitudinal scenarios include: reviewing a patient with type 2 diabetes whose A1C has not met target
          after three months of first-line therapy and deciding whether to add a second agent versus refer; a patient
          with hypertension whose blood pressure remains elevated despite two-drug therapy and evaluating adherence,
          secondary causes, or white-coat effect; a patient with COPD returning after an exacerbation and adjusting
          the maintenance inhaler regimen or initiating pulmonary rehabilitation referral. Each of these tests your
          ability to synthesise prior history, current presentation, and evidence-based next steps.
        </p>
        <p>
          NurseNest CNPLE-aligned primary care questions include multi-step scenario types that mirror this longitudinal
          reasoning demand. Rather than single isolated facts, you practice integrating prior context into a new decision —
          which is exactly what the CNPLE blueprint describes as advanced practice clinical judgment. Working through
          these scenarios with attention to rationale, not just the correct answer, builds the reasoning pattern that
          the exam rewards.
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
          "CNPLE primary care",
          "Canadian NP primary care exam",
          "CNPLE primary care questions",
          "Ontario NP exam primary care",
          "Canadian NP exam 2026",
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
      routeGroup: "marketing.default.cnplePrimaryCare",
    },
  );
}

export default function CnplePrimaryCarePage() {
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
