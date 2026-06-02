import type { Metadata } from "next";
import { CnpleSeoHubPage, CNPLE_RELATED_LINKS } from "@/components/cnple/cnple-seo-hub-page";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { robotsForRegionalMarketingHub } from "@/lib/seo/expansion-hub-robots";

export const revalidate = 86400;

const PATH = "/cnple-prescribing-questions";
const PAGE_TITLE = "CNPLE Prescribing Questions — Canadian NP Pharmacology Practice | NurseNest";
const PAGE_H1 = "CNPLE prescribing and pharmacology questions for Canadian NPs";
const PAGE_DESCRIPTION =
  "CNPLE-aligned prescribing practice questions covering medication selection, drug interactions, contraindications, monitoring parameters, and prescribing safety across Canadian NP scope. Rationale-rich, domain-targeted.";

const FAQ_ITEMS = [
  {
    question: "What prescribing topics are on the CNPLE?",
    answer:
      "CNPLE-aligned prescribing questions cover drug selection for first-line and second-line management, contraindications in special populations (pregnancy, renal impairment, hepatic dysfunction, paediatrics, older adults), drug–drug interactions, dosing adjustments, therapeutic monitoring, and prescribing safety decisions. NurseNest targets these across all major Canadian NP clinical domains.",
  },
  {
    question: "What pharmacology is highest yield for the CNPLE?",
    answer:
      "Based on Canadian NP competency frameworks, high-yield pharmacology domains include cardiovascular (antihypertensives, anticoagulants, statins, heart failure agents), mental health (antidepressants, antipsychotics, mood stabilisers, benzodiazepine safety), respiratory (inhalers, corticosteroids), endocrine (metformin, insulin, thyroid agents), and women's health (contraception, hormone therapy). Prescribing safety in older adults and paediatric populations also features prominently.",
  },
  {
    question: "How do CNPLE prescribing questions differ from NCLEX pharmacology?",
    answer:
      "NCLEX-RN pharmacology tests safe administration and monitoring within nursing scope — delegated from a physician. CNPLE prescribing questions test the NP's autonomous decision about which drug to initiate, how to adjust if the patient does not respond, which combination is contraindicated, and when to refer. The locus of decision is the NP, not an order to follow.",
  },
  {
    question: "Are these official CNPLE prescribing questions?",
    answer:
      "No. NurseNest is an independent preparation platform. Questions are CNPLE-aligned based on published Canadian NP competency frameworks. They are not affiliated with CCRNR, not sourced from official exam materials, and should be used for preparation alongside your own clinical and academic review.",
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
          "CNPLE prescribing questions",
          "Canadian NP pharmacology",
          "CNPLE medication safety",
          "Canadian NP prescribing practice",
          "Canadian NP prescribing exam",
          "CNPLE pharmacology questions",
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

export default function CnplePrescribingQuestionsPage() {
  return (
    <CnpleSeoHubPage
      path={PATH}
      title={PAGE_TITLE}
      h1={PAGE_H1}
      description={PAGE_DESCRIPTION}
      lead="CNPLE-aligned prescribing practice questions across all major Canadian NP pharmacology domains. Medication selection, safety, monitoring, and special population prescribing — the full scope of Canadian NP prescriptive authority."
      faq={FAQ_ITEMS}
      primaryCtaHref="/canada/np/cnple/questions"
      primaryCtaLabel="Practice Questions"
      secondaryCtaHref="/canada/np/cnple/simulation"
      secondaryCtaLabel="CNPLE Simulation"
      relatedLinks={[
        CNPLE_RELATED_LINKS[0],
        CNPLE_RELATED_LINKS[1],
        CNPLE_RELATED_LINKS[3],
        CNPLE_RELATED_LINKS[4],
        CNPLE_RELATED_LINKS[10],
        CNPLE_RELATED_LINKS[11],
        CNPLE_RELATED_LINKS[12],
      ]}
      sections={[
        {
          id: "prescribing-scope",
          heading: "Prescribing scope for Canadian nurse practitioners",
          body: (
            <>
              <p>
                Canadian NPs hold independent prescriptive authority within their legislated scope —
                the breadth of which varies by province and territory but generally includes a wide
                formulary for primary care, mental health, women's health, paediatrics, and
                chronic disease management. Unlike registered nurses, NPs do not require physician
                co-signature to prescribe within their scope. This independent authority is central
                to the CNPLE's prescribing safety emphasis.
              </p>
              <p>
                CNPLE prescribing questions test this authority directly. Scenarios present a patient
                with a new diagnosis or an ongoing condition requiring medication adjustment, and ask
                the NP to select the most appropriate pharmacological management — accounting for
                comorbidities, drug interactions, and patient-specific factors like renal function,
                hepatic status, pregnancy, age, and adherence context.
              </p>
            </>
          ),
        },
        {
          id: "high-yield-pharmacology",
          heading: "High-yield pharmacology domains for the CNPLE",
          body: (
            <>
              <p>
                Cardiovascular pharmacology is consistently high yield: antihypertensive selection
                (ACE inhibitors vs. ARBs vs. CCBs vs. thiazides, with specific contraindications),
                anticoagulation initiation and monitoring (warfarin vs. DOACs), statin prescribing
                and safety, and heart failure pharmacotherapy. Candidates who understand the
                rationale behind drug selection — not just the drug name — perform significantly
                better on integrated CNPLE-style scenarios.
              </p>
              <p>
                Mental health pharmacology is equally essential: antidepressant selection (SSRIs,
                SNRIs, bupropion, mirtazapine), SSRI titration and discontinuation syndrome,
                antipsychotic adverse effect profiles, lithium monitoring, and benzodiazepine
                prescribing safety. Women's health pharmacology — contraception selection,
                hormone therapy initiation and contraindications, and pregnancy-safe prescribing —
                is another reliable CNPLE domain.
              </p>
              <p>
                Special population prescribing is tested through every domain: dose adjustments in
                renal impairment, hepatic dysfunction, older adults (Beers Criteria, polypharmacy
                risk), and pregnancy. Understanding how a first-line drug changes — or becomes
                contraindicated — in the presence of a comorbidity is the clinical reasoning
                the CNPLE rewards.
              </p>
            </>
          ),
        },
        {
          id: "drug-interactions",
          heading: "Drug interactions and prescribing safety",
          body: (
            <>
              <p>
                Drug–drug interactions appear in CNPLE prescribing scenarios because real NP
                practice requires scanning the medication list before adding a new agent. Key
                interaction patterns include: CYP450-mediated interactions (clarithromycin +
                statins, warfarin + multiple agents), QTc-prolonging combinations, serotonin
                syndrome risk with dual serotoninergic prescribing, and nephrotoxicity with
                combined NSAID/ACE inhibitor/diuretic use.
              </p>
              <p>
                The clinical format is usually: a patient on two or three existing medications
                presents with a new condition requiring pharmacotherapy. The NP must select an
                appropriate agent that does not create a dangerous interaction, adjusting for
                comorbidities and monitoring needs. Practice with this integrated format prevents
                the common error of answering based on a single condition in isolation.
              </p>
            </>
          ),
        },
        {
          id: "monitoring-and-safety",
          heading: "Therapeutic monitoring and prescribing safety decisions",
          body: (
            <>
              <p>
                Prescribing safety on the CNPLE extends beyond drug selection to ongoing management:
                when to check drug levels (lithium, digoxin, vancomycin), what lab monitoring a new
                prescription requires (renal function with ACE inhibitors, LFTs with statins, CBC
                with methotrexate), and which adverse effects require immediate discontinuation
                versus watchful management.
              </p>
              <p>
                Follow-up prescribing decisions are also tested: a patient prescribed an
                antihypertensive returns with an inadequate response. The CNPLE-aligned question
                asks whether to increase the dose, add a second agent, switch to a different class,
                or investigate for secondary hypertension. The answer depends on baseline values,
                adherence, adverse effects, and the clinical picture — precisely the integrated
                reasoning prescribing practice builds.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
