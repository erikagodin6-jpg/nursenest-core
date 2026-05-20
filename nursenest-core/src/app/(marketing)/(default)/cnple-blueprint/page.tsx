import type { Metadata } from "next";
import { CnpleSeoHubPage, CNPLE_RELATED_LINKS } from "@/components/cnple/cnple-seo-hub-page";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

export const revalidate = 86400;

const PATH = "/cnple-blueprint";
const PAGE_TITLE = "CNPLE Blueprint Overview — Exam Content and Domain Structure | NurseNest";
const PAGE_H1 = "CNPLE blueprint: what is publicly known about exam content and domains";
const PAGE_DESCRIPTION =
  "What is publicly known about the CNPLE content blueprint, domain structure, and clinical competency areas — based on Canadian NP competency frameworks and CCRNR documentation as of 2026.";

const FAQ_ITEMS = [
  {
    question: "Has CCRNR published the official CNPLE blueprint?",
    answer:
      "As of 2026, a fully detailed CNPLE blueprint with official domain percentages and item-type specifications has not been broadly published by CCRNR. NurseNest's content domains are derived from Canadian NP entry-level competency frameworks, scope-of-practice legislation, and publicly available CCRNR documentation — not from a proprietary official blueprint. Always check ccrnr.ca for the most current official exam information.",
  },
  {
    question: "What domains does the CNPLE test?",
    answer:
      "Based on Canadian NP competency frameworks, CNPLE content is expected to cover: clinical assessment and differential diagnosis, pharmacotherapeutics and prescribing safety, laboratory and diagnostic interpretation, health promotion and screening (Canadian guidelines), chronic disease management, acute deterioration recognition, pediatric and lifespan care, older adult and geriatric care, reproductive and sexual health, mental health, indigenous health and cultural safety, and professional/ethical/legal practice in Canadian regulatory contexts.",
  },
  {
    question: "How should I study if the official blueprint is not fully released?",
    answer:
      "Use Canadian NP entry-level competency frameworks as your primary blueprint proxy. These documents are publicly available and were the foundation for CNPLE development. Prioritize domains that appear consistently across Canadian NP competency literature: prescribing safety, clinical judgment and differential diagnosis, lab interpretation, and chronic disease management across the lifespan. These domains carry high integration density in all Canadian advanced practice exam frameworks regardless of whether specific percentages are published.",
  },
  {
    question: "Will the CNPLE blueprint be updated over time?",
    answer:
      "Yes. Like all high-stakes licensure examinations, the CNPLE blueprint will be reviewed and updated periodically — typically every 5–7 years through a practice analysis process that surveys what Canadian NPs actually do in clinical practice. The initial blueprint will reflect the competencies identified in the most recent Canadian NP practice analysis prior to the 2026 launch.",
  },
];

const SECTIONS = [
  {
    id: "blueprint-context",
    heading: "Understanding CNPLE blueprint development",
    body: (
      <>
        <p>
          A licensing examination blueprint is the content specification document that defines what domains are
          tested, in what proportions, and at what depth. For the CNPLE, this blueprint was developed through a
          practice analysis — a systematic survey of what Canadian nurse practitioners actually do in their clinical
          roles — combined with regulatory input from provincial and territorial colleges and CCRNR's standard-setting
          process.
        </p>
        <p>
          As of 2026, CCRNR has not publicly released a detailed domain-weighted blueprint with exact percentages.
          This is not unusual at exam launch — full blueprint disclosure often follows after the exam has been
          operational for one or more test cycles. NurseNest monitors official CCRNR communications and will update
          preparation content as additional blueprint information becomes available.
        </p>
        <p>
          In the interim, Canadian NP entry-level competency documents — which CNPLE development was explicitly
          grounded in — provide the most reliable proxy for content coverage and domain weighting.
        </p>
      </>
    ),
  },
  {
    id: "known-domains",
    heading: "Domains aligned with Canadian NP competency frameworks",
    body: (
      <>
        <p>
          These content areas appear consistently across Canadian NP competency frameworks and are the foundation
          of NurseNest's CNPLE preparation content. They represent NurseNest's clinical taxonomy — not confirmed
          official CNPLE blueprint categories.
        </p>
        <p>
          <strong>Clinical assessment and differential diagnosis</strong> covers history-taking across the lifespan,
          targeted physical examination, generation of a systematic differential, and selection of the most probable
          working diagnosis from the available clinical data. This domain runs through every clinical scenario.
        </p>
        <p>
          <strong>Pharmacotherapeutics and prescribing safety</strong> covers drug selection rationale, dose
          adjustment for organ impairment (renal, hepatic, age-related), drug-drug and drug-disease interactions,
          contraindications, black-box warnings, high-alert medications, Canadian controlled substance regulations
          under the CDSA, and safe prescribing documentation practices. This domain intersects with every body
          system.
        </p>
        <p>
          <strong>Laboratory and diagnostic interpretation</strong> covers ordering rationale, result interpretation
          within a clinical vignette, critical value recognition, and clinical decision-making based on diagnostic
          findings — always toward a management decision, not pure result identification.
        </p>
        <p>
          <strong>Health promotion and disease prevention</strong> covers Canadian screening guidelines (Canadian
          Task Force on Preventive Health Care), NACI immunization schedules, lifestyle counselling, and
          population-level health approaches relevant to NP primary care practice.
        </p>
        <p>
          <strong>Chronic disease management</strong> covers guideline-based management of hypertension, diabetes,
          COPD, heart failure, dyslipidemia, CKD, osteoporosis, and other prevalent chronic conditions across
          adult and older adult populations using Canadian clinical guidelines as primary references.
        </p>
        <p>
          <strong>Population-specific care</strong> includes pediatrics, older adult and geriatric care,
          reproductive and sexual health, and mental health — each requiring population-specific reasoning that
          general mixed-mode practice does not reliably develop.
        </p>
        <p>
          <strong>Professional, ethical, legal, and scope-of-practice practice</strong> covers informed consent,
          capacity assessment, mandatory reporting under Canadian provincial legislation, privacy (PIPEDA and
          provincial acts), and NP scope-of-practice boundaries across Canadian jurisdictions.
        </p>
        <p>
          <strong>Indigenous health and culturally safe care</strong> covers culturally safe practice principles,
          trauma-informed approaches, UNDRIP principles, and NP responsibilities in providing equitable care for
          Indigenous peoples in Canada. This is an explicitly named domain in Canadian NP competency frameworks.
        </p>
      </>
    ),
  },
  {
    id: "studying-without-blueprint",
    heading: "How to prepare when the full blueprint is not published",
    body: (
      <>
        <p>
          Uncertainty about blueprint details is a source of anxiety for many CNPLE candidates — particularly those
          who prepared for the CNPE with a stream-specific content focus. The most effective response to blueprint
          uncertainty is breadth-first preparation anchored to Canadian NP competency frameworks.
        </p>
        <p>
          Practically: complete a domain diagnostic across all major content areas, identify your weakest two to
          three domains, build focused practice blocks in those domains, then expand to full-breadth mixed practice
          before simulation. Do not over-index on any single domain just because it has historically been
          emphasized in a specific exam stream — the CNPLE's single-classification model makes lifespan breadth
          more important than stream-specific depth.
        </p>
        <p>
          Use Canadian guideline sources rather than US equivalents: Hypertension Canada, Diabetes Canada, CTS
          COPD guidelines, CCS Heart Failure guidelines, Canadian Task Force on Preventive Health Care, and NACI
          immunization recommendations. These are the guideline sets Canadian NP competency frameworks reference.
        </p>
        <p>
          Monitor ccrnr.ca and your provincial college for official CNPLE blueprint updates. NurseNest updates
          preparation content as additional information becomes publicly available.
        </p>
      </>
    ),
  },
];

const RELATED = CNPLE_RELATED_LINKS.filter((l) =>
  [
    "/cnple",
    "/cnple-study-guide",
    "/cnple-practice-questions",
    "/cnple-clinical-judgment",
    "/cnple-prescribing-questions",
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
          "CNPLE blueprint",
          "CNPLE exam content",
          "CNPLE domains",
          "CNPLE content outline",
          "Canadian NP exam blueprint 2026",
          "CCRNR CNPLE content",
          "CNPLE competency areas",
        ],
        openGraph: { title: PAGE_TITLE, description: PAGE_DESCRIPTION, url: alt.canonical, type: "article", siteName: "NurseNest" },
        twitter: { card: "summary_large_image", title: PAGE_TITLE, description: PAGE_DESCRIPTION },
      };
    },
    { pathname: PATH, locale: DEFAULT_MARKETING_LOCALE, routeGroup: "marketing.default.cnpleBlueprint" },
  );
}

export default function CnpleBlueprintPage() {
  return (
    <CnpleSeoHubPage
      path={PATH}
      title={PAGE_TITLE}
      h1={PAGE_H1}
      description={PAGE_DESCRIPTION}
      lead="The full CNPLE content blueprint has not been publicly released by CCRNR as of 2026. This page summarises what is publicly known from Canadian NP competency frameworks and official sources — and how to prepare effectively in the absence of a detailed published weighting."
      sections={SECTIONS}
      faq={FAQ_ITEMS}
      relatedLinks={RELATED}
      primaryCtaHref="/canada/np/cnple/questions"
      primaryCtaLabel="Start CNPLE Practice"
      secondaryCtaHref="/cnple-study-guide"
      secondaryCtaLabel="Study Guide"
    />
  );
}
