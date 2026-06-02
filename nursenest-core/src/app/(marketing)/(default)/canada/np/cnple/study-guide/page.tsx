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

const PATH = "/canada/np/cnple/study-guide";

const PAGE_TITLE =
  "CNPLE Study Guide — How to Prepare for the Canadian NP Licensure Examination | NurseNest";

const PAGE_H1 = "CNPLE study guide: a structured preparation framework for Canadian NPs";

const PAGE_DESCRIPTION =
  "A phase-by-phase CNPLE study guide covering diagnostic baseline, domain-focused preparation, full-length simulation, and targeted remediation — built for the LOFT format of the Canadian Nurse Practitioner Licensure Examination.";

const FAQ_ITEMS = [
  {
    question: "How long should I study for the CNPLE?",
    answer:
      "Most NP graduates preparing for the CNPLE target 12 to 16 weeks of structured preparation. Working NPs with full-time clinical schedules often extend to 20 weeks. The total time matters less than the sequencing: diagnostic baseline in week one, domain-focused blocks through the foundation phase, mixed practice through the breadth phase, and full-length simulation runs in the final pressure phase. Starting simulation too late is a common error — pacing and stamina are not built in the final week.",
  },
  {
    question: "What are the main domains tested on the CNPLE?",
    answer:
      "CCRNR has not published confirmed blueprint percentages as of 2026. Based on publicly available Canadian NP competency frameworks, the CNPLE draws from: clinical assessment and diagnosis, therapeutic management and prescribing, health promotion and disease prevention, and professional and ethical practice. Prescribing safety and diagnostic reasoning appear across all clinical scenarios regardless of body system. NurseNest organises preparation across these domains — this reflects NurseNest's clinical taxonomy, not confirmed official CNPLE blueprint percentages.",
  },
  {
    question: "What makes a CNPLE study guide different from an NCLEX study guide?",
    answer:
      "The clinical reasoning demand is categorically different. NCLEX-RN preparation focuses on safe care within registered nurse scope. CNPLE preparation targets autonomous NP-level decisions: forming differentials, selecting investigations, choosing prescribing plans, and managing complex comorbidities within Canadian regulatory context. Content specific to Canadian guidelines — NACI immunisation schedules, Canadian Task Force screening recommendations, PIPEDA, the Controlled Drugs and Substances Act — does not appear in NCLEX study materials and must be deliberately built into CNPLE preparation.",
  },
  {
    question: "How is the CNPLE different from NCLEX in terms of format?",
    answer:
      "The CNPLE uses LOFT (linear on-the-fly testing): a fixed-length linear exam with no adaptive shutdown. Every candidate receives a complete item set regardless of performance. NCLEX uses CAT (computerized adaptive testing), which shuts off early once a confidence threshold is reached. If your only simulation experience is with CAT-style tools that shut off at 75 questions, your pacing and endurance preparation for a full fixed-length linear examination will have a significant gap.",
  },
  {
    question: "Should I use US NP study materials for the CNPLE?",
    answer:
      "US NP study materials are not suitable substitutes for CNPLE preparation. US NP examinations use different competency frameworks, USPSTF guidelines instead of Canadian Task Force guidelines, HIPAA instead of PIPEDA, and a different prescribing and regulatory structure. The correct answer to a clinical scenario often depends on which guidelines you apply — using US-calibrated materials can actively build incorrect response patterns for Canadian content.",
  },
];

const SECTIONS = [
  {
    id: "cnple-study-guide-overview",
    heading: "Why a structured CNPLE study guide matters",
    body: (
      <>
        <p>
          The CNPLE tests a practice scope that most NP candidates have not systematically studied for as
          a unified body of knowledge. Clinical NP work is necessarily focused: you develop depth in the
          populations and conditions you see, but the CNPLE samples broadly across the full scope of Canadian
          NP advanced practice — from paediatric assessment to geriatric polypharmacy to reproductive health
          to mental health prescribing. A structured study guide counters the natural bias toward familiar
          clinical territory and ensures breadth without sacrificing depth in the domains that carry the
          highest clinical reasoning demand.
        </p>
        <p>
          The LOFT format adds a structural preparation requirement that many candidates underestimate.
          Linear on-the-fly testing delivers a fixed-length item set to every candidate. There is no
          adaptive shutdown, no confidence-based early termination, and no shift in difficulty based on
          your responses. You must maintain consistent accuracy across the full examination. Candidates who
          prepare exclusively with short-session practice do not build the pacing discipline and sustained
          concentration that a full-length linear examination demands. The study guide phases below address
          this directly.
        </p>
      </>
    ),
  },
  {
    id: "phase-1-foundation",
    heading: "Phase 1 — Foundation: diagnostic baseline and domain accuracy",
    body: (
      <>
        <p>
          Begin preparation with a mixed-domain diagnostic session of 40 to 60 questions. Do not guess
          which domains need work — measure them. Your first session exists to produce data, not a score.
          Accuracy by domain tells you where to build first. Most NP candidates discover one or two domains
          where clinical experience has produced strong baseline accuracy, and two to three where preparation
          is genuinely needed regardless of how good their clinical work feels.
        </p>
        <p>
          With your baseline data, build domain-focused blocks of 20 to 30 questions in your three weakest
          areas. For each block, read every rationale regardless of whether you answered correctly —
          surface-level correct answers often reveal reasoning shortcuts that degrade under exam pressure.
          The foundation phase typically runs three to five weeks for full-time preparation and six to eight
          weeks for working NPs.
        </p>
        <p>
          Prescribing safety and pharmacotherapeutics warrant specific attention in the foundation phase.
          These appear across every clinical domain in CNPLE-style questions. Canadian prescribing
          considerations, drug interaction recognition, renal and hepatic dose adjustment principles, and
          contraindication reasoning should be built into your review from week one — not added as a
          late-stage supplement.
        </p>
      </>
    ),
  },
  {
    id: "phase-2-breadth",
    heading: "Phase 2 — Breadth: cross-domain integration and simulation introduction",
    body: (
      <>
        <p>
          The breadth phase expands coverage across all clinical domains with mixed-domain question sets.
          Canadian guideline alignment becomes the focus of this phase — content that US study materials
          systematically miss. Screening recommendations from the Canadian Task Force on Preventive Health
          Care differ meaningfully from USPSTF recommendations for several major conditions. NACI
          immunisation schedules differ from US schedules. Prescribing decisions in Canada reference the
          Controlled Drugs and Substances Act, Canadian formulary context, and provincial-level prescribing
          authority variations.
        </p>
        <p>
          Introduce your first full-length timed simulation run in the breadth phase — typically around
          week six to eight. This run functions as a diagnostic for pacing and stamina, not a performance
          test. Note where your concentration falters, where you begin rushing, and where you change correct
          answers under time pressure. These data points shape the pressure phase more than your accuracy
          score on the first run.
        </p>
        <p>
          Population-specific clinical reasoning — paediatrics, older adult care, reproductive health —
          should be deliberately addressed in this phase. Candidates with narrowly focused clinical
          backgrounds consistently discover that depth in one population area does not transfer to others.
          Build paediatric dosing, developmental milestone assessment, and age-specific screening content
          into your breadth-phase blocks explicitly if your practice background is narrow.
        </p>
      </>
    ),
  },
  {
    id: "phase-3-pressure",
    heading: "Phase 3 — Pressure: simulation cadence, remediation, and pacing",
    body: (
      <>
        <p>
          The pressure phase runs the final three to four weeks before your examination date. The primary
          work of this phase is full-length timed simulation — aim for two runs per week if your schedule
          permits, reviewing every question set systematically afterward. Prioritise remediation of domains
          where your accuracy remains below your overall average. Do not spend pressure-phase time on
          domains where you are already performing well.
        </p>
        <p>
          Address pacing explicitly. The CNPLE's LOFT format requires consistent pacing across the full
          item set. Most candidates have a default question pace that works well in short blocks but
          degrades in the second half of a full-length examination. Target a pace that allows review of
          flagged questions without rushing the final 30 items. If you are consistently running short of
          time on simulation runs, you are either spending too long on individual questions or not moving
          confidently when you know the answer.
        </p>
        <p>
          In the week before your examination, reduce question volume and avoid introducing new content.
          Your final two days should include only light review, pacing maintenance, and examination-day
          logistics. Arriving at the CNPLE undertested is far less common than arriving fatigued from
          trying to cover new material in the final 72 hours.
        </p>
      </>
    ),
  },
];

const RELATED_LINKS = CNPLE_HUB_RELATED_LINKS.filter((l) =>
  [
    "/canada/np/cnple",
    "/canada/np/cnple/questions",
    "/canada/np/cnple/case-based-questions",
    "/canada/np/cnple/loft-exam",
    "/canada/np/cnple/provisional-registration",
    "/cnple",
    "/cnple-practice-questions",
    "/cnple-simulation-exam",
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
          "CNPLE study guide",
          "how to study for CNPLE",
          "Canadian NP exam preparation",
          "CNPLE preparation timeline",
          "CNPLE LOFT format study",
          "Canadian nurse practitioner licensure examination guide",
          "CCRNR NP exam prep",
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
      routeGroup: "marketing.default.cnple.study_guide",
    },
  );
}

export default function CnpleStudyGuidePage() {
  return (
    <ExamClusterHubPage
      path={PATH}
      title={PAGE_TITLE}
      h1={PAGE_H1}
      eyebrow="CNPLE Study Guide 2026"
      lead={PAGE_DESCRIPTION}
      description={PAGE_DESCRIPTION}
      sections={SECTIONS}
      faq={FAQ_ITEMS}
      relatedLinks={RELATED_LINKS}
      breadcrumbs={cnpleHubClusterBreadcrumbs("Study Guide", PATH)}
      primaryCtaHref="/canada/np/cnple"
      primaryCtaLabel="CNPLE Prep Hub"
      secondaryCtaHref="/canada/np/cnple/questions"
      secondaryCtaLabel="Practice Questions"
      ctaHeading="Prepare for the CNPLE on NurseNest"
      ctaBody="Phase-structured preparation with clinical cases, domain-focused question blocks, and a full linear LOFT simulation — all scoped to Canadian NP competencies."
      disclaimer={<CnpleProvisionalDisclaimer variant="card" hideWhenConfirmed={false} />}
    />
  );
}
