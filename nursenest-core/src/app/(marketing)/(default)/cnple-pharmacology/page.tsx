import type { Metadata } from "next";
import { CnpleSeoHubPage, CNPLE_RELATED_LINKS } from "@/components/cnple/cnple-seo-hub-page";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

export const revalidate = 86400;

const PATH = "/cnple-pharmacology";
const PAGE_TITLE = "CNPLE Pharmacology — Canadian NP Prescribing and Drug Safety | NurseNest";
const PAGE_H1 = "CNPLE pharmacology: drug mechanisms, polypharmacy, and prescribing safety for Canadian NPs";
const PAGE_DESCRIPTION =
  "Deep pharmacology preparation for the CNPLE: drug class mechanisms, drug interactions, renal and hepatic dose adjustment, Beers criteria polypharmacy, high-alert medications, and Canadian prescribing regulations.";

const FAQ_ITEMS = [
  {
    question: "How heavily is pharmacology tested on the CNPLE?",
    answer:
      "Pharmacology content intersects with virtually every clinical domain on the CNPLE — it is not isolated to a single section. Prescribing decisions appear in cardiology, endocrinology, respiratory, mental health, geriatrics, and every other clinical area. Strong pharmacology knowledge is a multiplier: improving it raises accuracy across all domains simultaneously.",
  },
  {
    question: "Should I use Canadian or US drug references for CNPLE prep?",
    answer:
      "Canadian references. The Compendium of Pharmaceuticals and Specialties (CPS) is the primary Canadian drug reference. Drug scheduling in Canada follows the Controlled Drugs and Substances Act (CDSA) — not the US DEA schedules. Some drugs available in Canada differ from the US market, and formulary restrictions vary. US prep materials can teach pharmacological mechanisms, but regulatory and formulary content must come from Canadian sources.",
  },
  {
    question: "What are the highest-yield pharmacology topics for the CNPLE?",
    answer:
      "Based on Canadian NP competency frameworks: polypharmacy and Beers criteria for older adults, renal dose adjustment (metformin, NSAIDs, renally-cleared antibiotics, digoxin), drug interactions (warfarin, SSRIs, QT-prolonging agents), high-alert medications (insulin, warfarin, opioids, lithium, methotrexate), controlled substance regulations under the CDSA, and safe prescribing in pregnancy and lactation.",
  },
  {
    question: "What is the Beers Criteria and why does it matter for the CNPLE?",
    answer:
      "The Beers Criteria is an evidence-based list of medications that are potentially inappropriate for older adults due to increased risk of adverse effects in that population. For CNPLE purposes, it flags drug classes to avoid or use cautiously in patients over 65: anticholinergics, benzodiazepines, first-generation antihistamines, tricyclic antidepressants, NSAIDs for chronic use, and others. Geriatric pharmacology questions frequently test whether candidates can apply Beers reasoning to clinical scenarios.",
  },
];

const SECTIONS = [
  {
    id: "pharmacology-as-integrating-domain",
    heading: "Why pharmacology is the highest-leverage CNPLE study domain",
    body: (
      <>
        <p>
          Every clinical encounter managed by a nurse practitioner has a pharmacological dimension. Diagnosing
          hypertension requires knowing the first-line agent for this patient's specific comorbidity profile.
          Managing COPD requires knowing which bronchodilator class to initiate and when to step up. Treating
          depression in a patient already on tramadol requires serotonin syndrome risk assessment before
          prescribing an SSRI. This integration means pharmacology knowledge directly amplifies accuracy
          across every other CNPLE domain.
        </p>
        <p>
          Candidates who invest early in pharmacology preparation — drug class mechanisms, interaction patterns,
          monitoring requirements, and dose adjustment principles — report the broadest accuracy improvement
          across mixed-domain practice sessions. Pharmacology is the highest-return early investment in CNPLE
          preparation.
        </p>
      </>
    ),
  },
  {
    id: "drug-interactions",
    heading: "High-priority drug interactions for Canadian NP practice",
    body: (
      <>
        <p>
          Drug interactions appear throughout the CNPLE in clinical vignette format: a patient on an existing
          medication regimen presents for a new condition, and the correct management requires recognising an
          interaction before prescribing. The most frequently tested interaction categories in Canadian advanced
          practice exam contexts:
        </p>
        <p>
          <strong>QT-prolongation risk</strong> — combining two QT-prolonging agents (azithromycin with
          antipsychotics, fluoroquinolones with SSRIs) creates additive risk for torsades de pointes. Baseline
          ECG consideration before prescribing in high-risk combinations is a clinical judgment competency.
        </p>
        <p>
          <strong>CYP450 interactions</strong> — warfarin is the canonical example (CYP2C9 inhibitors like
          fluconazole increase bleeding risk; inducers like rifampin decrease INR). For Canadian NPs, warfarin
          monitoring obligations and interaction awareness are consistently tested because warfarin remains
          common in older adult primary care despite newer anticoagulants.
        </p>
        <p>
          <strong>Serotonin syndrome risk</strong> — SSRI or SNRI combined with tramadol, triptans, linezolid,
          fentanyl, or St. John's Wort creates serotonergic excess risk. Recognition of the symptom triad
          (altered mental status, autonomic instability, neuromuscular abnormalities) and the causative
          combination is a high-yield CNPLE clinical judgment item.
        </p>
        <p>
          <strong>Nephrotoxic combinations</strong> — NSAID plus ACE inhibitor plus diuretic ("triple whammy")
          significantly increases acute kidney injury risk, particularly in older adults and those with CKD.
          This combination appears across geriatric and chronic disease management scenarios.
        </p>
      </>
    ),
  },
  {
    id: "renal-dose-adjustment",
    heading: "Renal and hepatic dose adjustment for the CNPLE",
    body: (
      <>
        <p>
          Renal function alters the clearance of many medications commonly prescribed in primary care. The CNPLE
          tests whether candidates can identify which drugs require dose adjustment, discontinuation, or
          avoidance when renal function is impaired — a particularly important competency in older adult and
          chronic disease management scenarios.
        </p>
        <p>
          Key drugs requiring renal dose adjustment in Canadian NP primary care: metformin (hold if eGFR below
          30, caution 30–45), direct oral anticoagulants (dose adjustments for rivaroxaban, apixaban,
          dabigatran based on eGFR and creatinine clearance), methotrexate (significant caution below eGFR 30),
          gabapentin and pregabalin (dose reduction with declining eGFR), renally cleared antibiotics
          (nitrofurantoin ineffective and potentially toxic below eGFR 30; ciprofloxacin dose reduction needed).
        </p>
        <p>
          Hepatic impairment affects metabolism of drugs reliant on cytochrome P450 pathways. Primary care NPs
          encounter hepatic considerations most often with acetaminophen dosing, warfarin sensitivity, and
          statins in patients with active liver disease. The key CNPLE competency is recognising when hepatic
          or renal status changes the prescribing decision — not memorising every dose table.
        </p>
      </>
    ),
  },
  {
    id: "beers-criteria-polypharmacy",
    heading: "Beers Criteria and polypharmacy in older adults",
    body: (
      <>
        <p>
          Polypharmacy — typically defined as five or more concurrent medications — is among the most common and
          consequential clinical problems in older adult primary care. The CNPLE tests polypharmacy reasoning
          in geriatric scenarios that require candidates to identify potentially inappropriate medications,
          recognise drug-disease interactions specific to older adults, and prioritise deprescribing safety.
        </p>
        <p>
          The American Geriatrics Society Beers Criteria is the primary evidence-based tool for this domain
          (referenced in Canadian geriatrics practice despite being a US document, because no equivalent
          Canadian tool is as comprehensive). Key Beers categories for CNPLE preparation: anticholinergics
          (risk of cognitive impairment, constipation, urinary retention in older adults), benzodiazepines
          (fall and fracture risk, cognitive impairment, paradoxical agitation), first-generation
          antihistamines (diphenhydramine — profound anticholinergic burden), NSAIDs for chronic use (GI
          bleeding, renal impairment, fluid retention), and muscle relaxants (CNS depression, fall risk).
        </p>
        <p>
          Deprescribing is a clinical judgment competency in itself: recognising that stopping a medication
          is sometimes the most clinically appropriate intervention, and knowing how to taper safely (opioids,
          benzodiazepines, corticosteroids, SSRIs all require planned tapering rather than abrupt discontinuation).
        </p>
      </>
    ),
  },
  {
    id: "canadian-prescribing-regulations",
    heading: "Canadian prescribing regulations for NP candidates",
    body: (
      <>
        <p>
          Prescribing authority for Canadian NPs is legislated at the provincial level. While the CNPLE tests
          nationally applicable NP competencies rather than province-specific authority details, several
          regulatory frameworks appear consistently in Canadian NP practice exam contexts:
        </p>
        <p>
          The <strong>Controlled Drugs and Substances Act (CDSA)</strong> governs controlled substance
          scheduling in Canada. CNPLE-relevant controlled substances include opioids (Schedule I), anxiolytics
          and sedatives (benzodiazepines — Schedule IV), and stimulants used in ADHD treatment. NP prescribing
          authority for controlled substances varies by province — exam questions test recognition of the
          regulatory framework, not province-specific authority thresholds.
        </p>
        <p>
          <strong>High-alert medication documentation</strong> — insulin, warfarin, opioids, lithium, and
          methotrexate are considered high-alert medications requiring specific prescribing precautions,
          patient education, and monitoring protocols. CNPLE scenarios involving these medications frequently
          test monitoring requirements and documentation obligations alongside clinical selection rationale.
        </p>
        <p>
          <strong>Safe prescribing in pregnancy and lactation</strong> — the CNPLE tests category-based
          reasoning about medication safety in pregnancy (teratogenic risk recognition) and lactation (drug
          transfer into breast milk and infant safety). The LactMed database (NIH) and Health Canada
          monographs are the primary reference sources for Canadian NP practice in this domain.
        </p>
      </>
    ),
  },
];

const RELATED = CNPLE_RELATED_LINKS.filter((l) =>
  [
    "/cnple-prescribing-questions",
    "/cnple-geriatrics",
    "/cnple-mental-health",
    "/cnple-lab-interpretation",
    "/cnple-practice-questions",
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
        keywords: [
          "CNPLE pharmacology",
          "Canadian NP prescribing exam",
          "CNPLE drug interactions",
          "Canadian NP polypharmacy",
          "CNPLE Beers criteria",
          "NP pharmacology exam Canada",
          "CDSA prescribing NP",
        ],
        openGraph: { title: PAGE_TITLE, description: PAGE_DESCRIPTION, url: alt.canonical, type: "article", siteName: "NurseNest" },
        twitter: { card: "summary_large_image", title: PAGE_TITLE, description: PAGE_DESCRIPTION },
      };
    },
    { pathname: PATH, locale: DEFAULT_MARKETING_LOCALE, routeGroup: "marketing.default.cnplePharmacology" },
  );
}

export default function CnplePharmacologyPage() {
  return (
    <CnpleSeoHubPage
      path={PATH}
      title={PAGE_TITLE}
      h1={PAGE_H1}
      description={PAGE_DESCRIPTION}
      lead="Pharmacology knowledge is a multiplier across every CNPLE domain. Improve your drug interaction recognition, renal dose adjustment reasoning, Beers criteria application, and Canadian regulatory context — and accuracy rises across cardiology, geriatrics, mental health, and chronic disease simultaneously."
      sections={SECTIONS}
      faq={FAQ_ITEMS}
      relatedLinks={RELATED}
      primaryCtaHref="/canada/np/cnple/questions"
      primaryCtaLabel="Practice Pharmacology Questions"
      secondaryCtaHref="/cnple-prescribing-questions"
      secondaryCtaLabel="Prescribing Safety"
    />
  );
}
