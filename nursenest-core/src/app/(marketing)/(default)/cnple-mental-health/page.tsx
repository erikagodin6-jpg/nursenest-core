import type { Metadata } from "next";
import { CnpleSeoHubPage, CNPLE_RELATED_LINKS } from "@/components/cnple/cnple-seo-hub-page";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { robotsForRegionalMarketingHub } from "@/lib/seo/expansion-hub-robots";

export const revalidate = 86400;

const PATH = "/cnple-mental-health";
const PAGE_TITLE = "CNPLE Mental Health Questions — Canadian NP Exam Prep | NurseNest";
const PAGE_H1 = "CNPLE mental health: assessment, prescribing, and Canadian NP scope";
const PAGE_DESCRIPTION =
  "Mental health is a core CNPLE domain. Practice depression and anxiety assessment, psychotropic prescribing safety, substance use disorder management, suicide risk assessment, and professional practice in Canadian NP mental health scope.";

const FAQ_ITEMS = [
  {
    question: "What mental health topics are tested on the CNPLE?",
    answer:
      "Based on Canadian NP competency frameworks, CNPLE-relevant mental health content includes: assessment and management of depression, anxiety disorders, PTSD, substance use disorders, and psychosis risk; suicide and self-harm risk assessment and safety planning; psychotropic prescribing safety within Canadian formulary and scope constraints; mandatory reporting and capacity assessment; and trauma-informed, culturally safe mental health care for diverse Canadian populations.",
  },
  {
    question: "Can Canadian NPs prescribe psychiatric medications?",
    answer:
      "NP prescribing authority for psychiatric medications varies by province. Most Canadian NPs can prescribe common psychotropics including SSRIs, SNRIs, anxiolytics, and mood stabilizers within their scope. Prescribing authority for antipsychotics and controlled substances used in mental health (benzodiazepines, stimulants for ADHD) is provincially regulated. CNPLE questions test prescribing safety reasoning and regulatory awareness rather than province-specific authority limits.",
  },
  {
    question: "How should I approach suicide risk assessment questions on the CNPLE?",
    answer:
      "Use structured risk stratification rather than clinical intuition alone. CNPLE mental health questions test whether candidates can integrate risk factors (prior attempts, access to means, social isolation, substance use, hopelessness) with protective factors (social support, future orientation, treatment engagement) to reach a risk classification that guides the appropriate next step. The correct answer in high-risk scenarios is safety planning and urgent mental health referral, not ongoing outpatient management.",
  },
  {
    question: "What is the first-line treatment for depression on Canadian NP exams?",
    answer:
      "Canadian clinical practice guidelines (CANMAT) support SSRIs as first-line pharmacotherapy for major depressive disorder in adults without contraindications, combined with psychotherapy where available. CNPLE prescribing questions in depression test drug selection rationale, monitoring timelines (4–6 weeks for adequate trial), side effect counselling, and when to augment or switch rather than continue a failing regimen.",
  },
];

const SECTIONS = [
  {
    id: "mental-health-in-cnple",
    heading: "Mental health as a primary care NP competency",
    body: (
      <>
        <p>
          Mental health is not a specialty-only domain for Canadian NPs — it is a primary care competency.
          The majority of Canadians with depression, anxiety, PTSD, and substance use disorders are managed
          in primary care, not in tertiary psychiatric settings. Canadian NP competency frameworks explicitly
          include mental health assessment and management within the NP primary care role, making it a
          consistent CNPLE content area rather than an edge-case specialty topic.
        </p>
        <p>
          For CNPLE preparation, this means mental health content should be studied with the same systematic
          approach as cardiovascular or endocrine content — not treated as supplementary. Assessment tools
          (PHQ-9, GAD-7, AUDIT-C, CAGE, Columbia Suicide Severity Rating Scale), first-line management
          algorithms, psychotropic prescribing safety, and mandatory reporting obligations are all testable
          competencies under the CNPLE's advanced practice scope.
        </p>
      </>
    ),
  },
  {
    id: "depression-anxiety",
    heading: "Depression and anxiety: assessment to management",
    body: (
      <>
        <p>
          Depression and anxiety are the highest-prevalence mental health conditions in Canadian primary care
          and consistently high-yield areas on Canadian NP advanced practice examinations. CNPLE assessment
          questions test structured tool use (PHQ-9 for depression severity, GAD-7 for anxiety severity)
          alongside clinical history integration — distinguishing major depressive disorder from persistent
          depressive disorder, bipolar depression, and adjustment disorder requires integrating the clinical
          picture beyond questionnaire scores alone.
        </p>
        <p>
          Management questions test CANMAT guideline alignment: SSRIs as first-line pharmacotherapy for MDD
          and GAD (without contraindication), adequate trial duration before switching (minimum 4–6 weeks at
          therapeutic dose), psychotherapy recommendation (CBT has the strongest evidence base for both
          conditions), and when to refer for specialist consultation (psychotic features, bipolar concerns,
          treatment-resistant course, complex comorbidity). Prescribing safety in this domain includes SSRI
          discontinuation syndrome awareness, serotonin syndrome risk with polypharmacy, and QTc
          prolongation risk with citalopram and escitalopram at higher doses.
        </p>
      </>
    ),
  },
  {
    id: "substance-use",
    heading: "Substance use disorders in Canadian NP primary care",
    body: (
      <>
        <p>
          Substance use disorder management is an expanding Canadian NP competency, particularly as opioid
          use disorder (OUD) management with buprenorphine-naloxone has moved substantially into primary
          care practice across Canada. CNPLE questions in this domain test: screening tool application
          (AUDIT-C for alcohol, DAST-10 for drug use), brief intervention and motivational interviewing
          principles, harm reduction counselling, and pharmacotherapy awareness for OUD (buprenorphine-
          naloxone, methadone — noting that methadone prescribing for OUD requires specific exemptions in
          most Canadian provinces).
        </p>
        <p>
          Alcohol withdrawal management requires recognising the spectrum from uncomplicated withdrawal
          to alcohol withdrawal seizure and delirium tremens (DTs). CNPLE questions test recognition of
          withdrawal severity indicators and appropriate escalation — outpatient management for mild
          withdrawal is appropriate; moderate-to-severe withdrawal with seizure risk or DT risk requires
          inpatient management. The CIWA-Ar (Clinical Institute Withdrawal Assessment for Alcohol) framework
          is referenced in Canadian emergency and primary care guidelines for severity assessment.
        </p>
      </>
    ),
  },
  {
    id: "safety-planning",
    heading: "Suicide risk assessment and safety planning",
    body: (
      <>
        <p>
          Suicide risk assessment is a mandatory Canadian NP competency and a high-yield CNPLE content area.
          Questions test structured risk factor integration (prior attempts, current ideation with plan and
          means access, hopelessness, social isolation, active substance use, recent loss) alongside
          protective factor recognition (reasons for living, social support, future orientation, treatment
          engagement, help-seeking behaviour).
        </p>
        <p>
          The clinical judgment tested is not a binary safe-versus-unsafe classification — it is the mapping
          of risk level to the appropriate clinical response. Low-risk ideation with no plan and strong
          protective factors: structured safety planning, regular follow-up, and ongoing depression
          management. Moderate risk with plan but no immediate intent and means access limited: urgent mental
          health referral within 24–48 hours, means restriction counselling, safety plan with crisis
          contacts. High risk with plan, means access, and strong intent: immediate psychiatric evaluation,
          possible involuntary assessment under provincial mental health legislation.
        </p>
        <p>
          Canadian mandatory reporting obligations in mental health (duty to warn, duty to protect, mandatory
          child abuse reporting) are tested in professional practice scenarios alongside clinical content.
          These obligations are governed by provincial legislation, and CNPLE questions test the principle
          and threshold, not province-specific procedural details.
        </p>
      </>
    ),
  },
];

const RELATED = CNPLE_RELATED_LINKS.filter((l) =>
  [
    "/cnple-prescribing-questions",
    "/cnple-clinical-judgment",
    "/cnple-primary-care",
    "/cnple-practice-questions",
    "/cnple-geriatrics",
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
          "CNPLE mental health questions",
          "Canadian NP mental health exam",
          "CNPLE depression anxiety",
          "NP mental health exam Canada",
          "CNPLE substance use disorder",
          "Canadian NP psychiatric prescribing",
        ],
        openGraph: { title: PAGE_TITLE, description: PAGE_DESCRIPTION, url: alt.canonical, type: "article", siteName: "NurseNest" },
        twitter: { card: "summary_large_image", title: PAGE_TITLE, description: PAGE_DESCRIPTION },
      };
    },
    { pathname: PATH, locale: DEFAULT_MARKETING_LOCALE, routeGroup: "marketing.default.cnpleMentalHealth" },
  );
}

export default function CnpleMentalHealthPage() {
  return (
    <CnpleSeoHubPage
      path={PATH}
      title={PAGE_TITLE}
      h1={PAGE_H1}
      description={PAGE_DESCRIPTION}
      lead="Mental health is a primary care NP competency, not a specialty referral — and the CNPLE tests it accordingly. Build structured assessment skills, safe psychotropic prescribing reasoning, and the clinical judgment to match mental health presentations to the right intervention level."
      sections={SECTIONS}
      faq={FAQ_ITEMS}
      relatedLinks={RELATED}
      primaryCtaHref="/canada/np/cnple/questions"
      primaryCtaLabel="Practice Mental Health Questions"
      secondaryCtaHref="/cnple-prescribing-questions"
      secondaryCtaLabel="Prescribing Safety"
    />
  );
}
