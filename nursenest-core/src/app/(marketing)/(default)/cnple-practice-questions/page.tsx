import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { FaqJsonLd } from "@/components/seo/faq-json-ld";
import { WebPageJsonLd } from "@/components/seo/seo-json-ld";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { simpleMarketingBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { buildMarketingWebPageJsonLdProps } from "@/lib/seo/marketing-webpage-jsonld";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import {
  CNPLE_CLUSTER,
  CNPLE_DISCLAIMER,
  CNPLE_FRESHNESS_LABEL,
  CNPLE_HUB,
  CNPLE_LESSONS,
  CNPLE_PRICING,
  CNPLE_QUESTIONS,
  CNPLE_SIMULATION,
} from "@/lib/seo/cnple-seo-cluster";

export const revalidate = 86400;

const PATH = "/cnple-practice-questions";

const PAGE_TITLE = "CNPLE Practice Questions — Canadian NP Exam Prep | NurseNest";
const PAGE_H1 = "CNPLE practice questions for the Canadian NP exam";
const PAGE_DESCRIPTION =
  "Practice clinical judgment questions aligned to Canadian NP competency frameworks: prescribing safety, lab interpretation, differential diagnosis, primary care across the lifespan. Designed for the CNPLE.";

const FAQ_ITEMS = [
  {
    question: "Are these official CNPLE questions?",
    answer:
      "No. NurseNest practice questions are independently authored and are not sourced from or endorsed by CCRNR. They are designed to develop the clinical reasoning skills that Canadian NP practice and competency frameworks emphasize. Always verify exam format details directly with CCRNR and your provincial college.",
  },
  {
    question: "What topics do CNPLE practice questions cover?",
    answer:
      "NurseNest CNPLE-track questions span clinical assessment and differential diagnosis, pharmacotherapeutics and prescribing safety, laboratory and diagnostic interpretation, health promotion and screening, chronic disease management, pediatrics, older adult care, reproductive and sexual health, mental health, and professional and ethical practice — all grounded in Canadian clinical guidelines and NP scope.",
  },
  {
    question: "Is the CNPLE multiple choice?",
    answer:
      "The CNPLE uses a linear on-the-fly testing (LOFT) format. Confirmed item types have not been fully published by CCRNR as of 2026. NurseNest builds practice questions that develop clinical judgment depth consistent with advanced practice Canadian NP competencies, using single-best-answer and case-based clinical vignette formats.",
  },
  {
    question: "How many questions should I practice before the CNPLE?",
    answer:
      "There is no universal answer — it depends on your baseline accuracy, weak-topic profile, and time before your exam date. A useful target is consistent accuracy improvement across your weakest three domains rather than a raw question count. Use NurseNest's weak-area reporting to identify and systematically address gaps.",
  },
  {
    question: "Do the practice questions include rationales?",
    answer:
      "Yes. Every NurseNest question includes a detailed rationale explaining why each answer is correct or incorrect, the clinical reasoning behind the best choice, and in many cases the Canadian guideline or regulatory framework that informs the decision.",
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
        keywords: [
          "CNPLE practice questions",
          "Canadian NP exam questions",
          "CNPLE question bank",
          "Canadian nurse practitioner exam prep",
          "CNPLE clinical judgment questions",
          "CNPLE prescribing questions",
          "NP exam Canada 2026",
          "CCRNR exam prep",
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
      routeGroup: "marketing.default.cnplePracticeQuestions",
    },
  );
}

function ProseLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link className="font-semibold text-[var(--theme-primary)] underline-offset-4 hover:underline" href={href}>
      {children}
    </Link>
  );
}

export default function CnplePracticeQuestionsPage() {
  const { crumbs, schemaItems } = simpleMarketingBreadcrumbs("CNPLE Practice Questions", PATH);

  return (
    <>
      <WebPageJsonLd
        {...buildMarketingWebPageJsonLdProps({
          locale: DEFAULT_MARKETING_LOCALE,
          enPath: PATH,
          title: PAGE_TITLE,
          description: PAGE_DESCRIPTION,
        })}
      />
      <BreadcrumbJsonLd items={schemaItems} />
      <FaqJsonLd items={FAQ_ITEMS} />

      <div className="mx-auto max-w-3xl nn-marketing-x pb-[var(--nn-rhythm-tight-y)] pt-[var(--nn-rhythm-page-y)]">
        <BreadcrumbTrail items={crumbs} />

        <article className="nn-marketing-body">
          <p className="nn-marketing-eyebrow text-[var(--semantic-text-muted)]">{CNPLE_FRESHNESS_LABEL}</p>
          <h1 className="nn-marketing-h1 mt-2 text-balance">{PAGE_H1}</h1>
          <p className="nn-marketing-lead mt-4 text-[var(--theme-muted-text)]">
            The Canadian Nurse Practitioner Licensure Examination (CNPLE) tests clinical reasoning across the full scope
            of NP practice — from primary care across the lifespan to prescribing safety and diagnostic interpretation.
            Practice questions that develop that reasoning depth are the highest-leverage study tool you have.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={CNPLE_QUESTIONS}
              className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[var(--semantic-brand)] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-90"
            >
              Start CNPLE practice questions
            </Link>
            <Link
              href={CNPLE_SIMULATION}
              className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-6 py-3 text-sm font-semibold text-[var(--theme-body-text)] hover:border-[var(--semantic-brand)]/40"
            >
              Try a simulation session
            </Link>
          </div>

          <section className="mt-12" aria-labelledby="what-makes-cnple-different">
            <h2 id="what-makes-cnple-different" className="nn-marketing-h2">
              What makes CNPLE practice questions different from RN prep
            </h2>
            <p>
              The CNPLE sits above NCLEX-RN in clinical depth. Where RN exam questions emphasize safe care within nursing
              scope, CNPLE-track questions emphasize autonomous advanced practice decisions: forming a working diagnosis,
              selecting and interpreting investigations, choosing a management plan including prescribing, and recognizing
              when to refer.
            </p>
            <p>
              A question that works for NCLEX-RN will test you on appropriate nursing interventions. A CNPLE-aligned
              question will give you a clinical scenario and ask you to determine the most likely diagnosis from a
              differential, order the most discriminating next investigation, or choose the safest prescribing decision
              for a patient with comorbidities. The clinical reasoning demand is categorically different.
            </p>
            <p>
              This means your preparation must include{" "}
              <ProseLink href={CNPLE_CLUSTER.prescribingQuestions}>prescribing safety practice</ProseLink>,{" "}
              <ProseLink href={CNPLE_CLUSTER.labInterpretation}>laboratory and diagnostic interpretation</ProseLink>, and{" "}
              <ProseLink href={CNPLE_CLUSTER.differentialDiagnosis}>structured differential diagnosis practice</ProseLink> —
              not just recall of pathophysiology.
            </p>
          </section>

          <section className="mt-12" aria-labelledby="domains">
            <h2 id="domains" className="nn-marketing-h2">
              Core domains covered in CNPLE-aligned practice
            </h2>
            <p>
              NurseNest structures CNPLE-track practice across the domains that Canadian NP competency frameworks
              consistently emphasize. No official CNPLE blueprint weighting has been published as of 2026; the domain
              breakdown below reflects NurseNest's clinical taxonomy derived from publicly available Canadian NP
              competency documents.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: "Clinical Assessment & Diagnosis",
                  href: CNPLE_CLUSTER.differentialDiagnosis,
                  desc: "History, physical examination, differential diagnosis formation, and working diagnosis selection across acuity levels.",
                },
                {
                  title: "Prescribing Safety",
                  href: CNPLE_CLUSTER.prescribingQuestions,
                  desc: "Safe drug selection, dose, drug interactions, contraindications, renal/hepatic adjustments, and Canadian prescribing regulations.",
                },
                {
                  title: "Lab & Diagnostic Interpretation",
                  href: CNPLE_CLUSTER.labInterpretation,
                  desc: "CBC, metabolic panels, urinalysis, lipids, thyroid function, ECG interpretation, critical value recognition.",
                },
                {
                  title: "Clinical Judgment",
                  href: CNPLE_CLUSTER.clinicalJudgment,
                  desc: "Integrated decision-making under uncertainty: next best step, referral thresholds, safety and escalation priorities.",
                },
                {
                  title: "Pharmacology",
                  href: CNPLE_CLUSTER.pharmacology,
                  desc: "Drug mechanisms, polypharmacy, Beers criteria for older adults, high-alert medications, controlled substance regulations.",
                },
                {
                  title: "Primary Care Across the Lifespan",
                  href: CNPLE_CLUSTER.primaryCare,
                  desc: "Preventive care, chronic disease management, acute presentations, and population-specific assessment.",
                },
              ].map((d) => (
                <Link
                  key={d.href}
                  href={d.href}
                  className="rounded-xl border border-[var(--semantic-border-soft)] p-4 hover:border-[var(--semantic-brand)]/40 hover:shadow-sm transition-shadow"
                >
                  <p className="font-semibold text-[var(--theme-heading-text)]">{d.title}</p>
                  <p className="mt-1 text-sm text-[var(--theme-body-text)]">{d.desc}</p>
                </Link>
              ))}
            </div>

            <p className="mt-6">
              Population-specific practice includes{" "}
              <ProseLink href={CNPLE_CLUSTER.pediatrics}>pediatrics</ProseLink>,{" "}
              <ProseLink href={CNPLE_CLUSTER.geriatrics}>older adult and geriatric care</ProseLink>,{" "}
              <ProseLink href={CNPLE_CLUSTER.womensHealth}>reproductive and sexual health</ProseLink>, and{" "}
              <ProseLink href={CNPLE_CLUSTER.mentalHealth}>mental health</ProseLink> — each requiring
              population-specific clinical reasoning that general mixed-mode practice does not reliably build.
            </p>
          </section>

          <section className="mt-12" aria-labelledby="how-to-use">
            <h2 id="how-to-use" className="nn-marketing-h2">
              How to use CNPLE practice questions effectively
            </h2>
            <p>
              The most common error in exam preparation is treating questions as a score game rather than a reasoning
              drill. Your accuracy percentages are useful signals, but the clinical reasoning behind each miss is the
              actual study asset.
            </p>
            <h3 className="nn-marketing-h3 mt-8">Start with a domain diagnostic</h3>
            <p>
              Run a mixed practice session across all major domains. Tag your misses by category. Your goal is to find
              the two or three domains where your accuracy is weakest — those are where NP practice scenarios are most
              likely to expose gaps under exam pressure.
            </p>
            <h3 className="nn-marketing-h3 mt-8">Build domain blocks, not random marathons</h3>
            <p>
              Once you have a weak-domain list, do focused blocks: 20–30 questions in a single domain, review every
              rationale whether you got it right or not, then repeat the block two days later. Retrieval practice with
              spaced repetition outperforms passive re-reading by a large margin.
            </p>
            <h3 className="nn-marketing-h3 mt-8">Integrate prescribing and diagnostics into every session</h3>
            <p>
              The CNPLE tests advanced practice scope, which means prescribing and diagnostic interpretation questions
              will appear across clinical scenarios regardless of body system. Build a habit of thinking through the
              pharmacological implications and lab context of every clinical vignette — not just the organ system.
            </p>
            <h3 className="nn-marketing-h3 mt-8">Use simulation runs to pressure-test readiness</h3>
            <p>
              Once you are consistent in domain blocks, move to timed{" "}
              <ProseLink href={CNPLE_SIMULATION}>CNPLE simulation sessions</ProseLink>. The CNPLE uses LOFT
              (linear on-the-fly testing) — a fixed-length format, not adaptive. That means you need pacing discipline
              across a set number of items, not adaptation to shifting difficulty. Timed full-length simulations build
              that discipline.
            </p>
          </section>

          <section className="mt-12" aria-labelledby="case-types">
            <h2 id="case-types" className="nn-marketing-h2">
              Question formats in CNPLE-aligned practice
            </h2>
            <p>
              NurseNest builds practice across several clinical reasoning formats. These are independently designed
              practice formats, not confirmed official CNPLE item types.
            </p>
            <ul className="mt-4 list-disc space-y-3 pl-5">
              <li>
                <strong>Single-best-answer clinical judgment:</strong> A 2–5 sentence patient scenario with one clearly
                superior answer. Distractors differ in priority or safety profile, not in correctness of clinical
                knowledge alone. Rationales explain why each distractor is inferior.
              </li>
              <li>
                <strong>Case-based diagnostic reasoning:</strong> Richer patient cases requiring differential formation,
                selection of the most discriminating next investigation, or ruling in/out a diagnosis based on
                cumulative findings. See{" "}
                <ProseLink href={CNPLE_CLUSTER.caseStudies}>CNPLE clinical case studies</ProseLink>.
              </li>
              <li>
                <strong>Safe prescribing and medication management:</strong> Drug selection, contraindication avoidance,
                interaction management, monitoring requirements, and Canadian prescribing regulations. See{" "}
                <ProseLink href={CNPLE_CLUSTER.prescribingQuestions}>CNPLE prescribing questions</ProseLink>.
              </li>
              <li>
                <strong>Lab and diagnostic interpretation:</strong> Interpreting panels and results within a clinical
                vignette to reach a management decision, not just identifying abnormals. See{" "}
                <ProseLink href={CNPLE_CLUSTER.labInterpretation}>CNPLE lab interpretation</ProseLink>.
              </li>
              <li>
                <strong>Professional, ethical, and legal scenarios:</strong> Informed consent, capacity assessment,
                mandatory reporting, and NP scope-of-practice limits within Canadian regulatory frameworks.
              </li>
            </ul>
          </section>

          <section className="mt-12" aria-labelledby="study-resources">
            <h2 id="study-resources" className="nn-marketing-h2">
              Full CNPLE prep resources on NurseNest
            </h2>
            <ul className="mt-4 list-disc space-y-3 pl-5">
              <li>
                <ProseLink href={CNPLE_HUB}>CNPLE hub</ProseLink> — your primary prep command centre: questions,
                lessons, simulation, and performance tracking in one place.
              </li>
              <li>
                <ProseLink href={CNPLE_LESSONS}>CNPLE lessons</ProseLink> — in-depth clinical lessons organized by
                domain and population, written for Canadian NP scope.
              </li>
              <li>
                <ProseLink href={CNPLE_SIMULATION}>CNPLE simulation sessions</ProseLink> — timed LOFT-style full-length
                practice runs to build exam-day pacing and endurance.
              </li>
              <li>
                <ProseLink href={CNPLE_CLUSTER.studyGuide}>CNPLE study guide</ProseLink> — how to plan your
                preparation timeline, organize domain blocks, and use readiness metrics effectively.
              </li>
              <li>
                <ProseLink href={CNPLE_CLUSTER.loftTesting}>LOFT testing explained</ProseLink> — understand the CNPLE
                format (linear fixed-length, not adaptive) so your simulation strategy is correctly calibrated.
              </li>
            </ul>
          </section>

          <aside
            className="mt-14 rounded-2xl border border-[var(--semantic-border-soft)] p-8"
            style={{ background: "color-mix(in srgb, var(--semantic-brand) 5%, var(--semantic-surface))" }}
          >
            <p className="nn-marketing-h3 !mt-0">Ready to start practicing?</p>
            <p className="mt-2 text-[var(--theme-muted-text)]">
              Open the CNPLE question bank, work through domain blocks, and track your accuracy improvement over time.
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Link
                href={CNPLE_QUESTIONS}
                className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[var(--semantic-brand)] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-90"
              >
                Start practice questions
              </Link>
              <Link
                href={CNPLE_PRICING}
                className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-6 py-3 text-sm font-semibold text-[var(--theme-body-text)] hover:border-[var(--semantic-brand)]/40"
              >
                See pricing
              </Link>
            </div>
          </aside>

          <section className="mt-12" aria-labelledby="faq">
            <h2 id="faq" className="nn-marketing-h2">
              Frequently asked questions
            </h2>
            <dl className="space-y-6">
              {FAQ_ITEMS.map((item) => (
                <div key={item.question}>
                  <dt className="font-semibold text-[var(--theme-heading-text)]">{item.question}</dt>
                  <dd className="mt-2 text-[var(--theme-body-text)]">{item.answer}</dd>
                </div>
              ))}
            </dl>
          </section>

          <p className="mt-10 text-xs text-[var(--semantic-text-muted)] italic">{CNPLE_DISCLAIMER}</p>
        </article>
      </div>
    </>
  );
}
