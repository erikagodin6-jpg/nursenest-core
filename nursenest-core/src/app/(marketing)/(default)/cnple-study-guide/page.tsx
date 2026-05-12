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

const PATH = "/cnple-study-guide";

const PAGE_TITLE = "CNPLE Study Guide — Canadian NP Licensure Exam | NurseNest";
const PAGE_H1 = "CNPLE study guide: how to prepare for the Canadian NP licensure exam";
const PAGE_DESCRIPTION =
  "A structured CNPLE study guide covering timeline planning, domain prioritization, LOFT format strategy, weak-area remediation loops, and Canadian-specific clinical content focus for the 2026 exam.";

const FAQ_ITEMS = [
  {
    question: "How long should I study for the CNPLE?",
    answer:
      "Most NP graduates benefit from 10–16 weeks of structured preparation depending on their baseline clinical knowledge, available weekly hours, and weak-domain profile. A shorter timeline with more daily hours can work for candidates with strong recent clinical exposure; a longer timeline with fewer hours per week works better for working NPs. Use a baseline practice session in your first week to identify your weakest domains before committing to a timeline.",
  },
  {
    question: "What is the best CNPLE study strategy?",
    answer:
      "The most effective approach combines: (1) domain diagnostic to find weak areas, (2) focused domain blocks alternating with lesson review, (3) timed simulation runs to build pacing discipline for the fixed-length LOFT format, and (4) spaced repetition through flashcards for high-volume recall items like lab reference ranges, drug contraindications, and screening intervals. Avoid passive re-reading; retrieval practice under time pressure is what actually improves exam performance.",
  },
  {
    question: "How many hours per week should I study for the CNPLE?",
    answer:
      "Most candidates preparing over 12 weeks target 10–15 hours per week. Working NPs with busy clinical schedules often use 8 hours/week across a 16-week plan. Time efficiency matters more than total hours: a 90-minute focused session with deliberate review of misses outperforms three hours of passive question grinding. Protect your study schedule from clinical schedule creep in the final four weeks.",
  },
  {
    question: "Which CNPLE topics should I prioritize?",
    answer:
      "Prioritize based on your personal weak-domain profile, not a generic list. That said, prescribing safety, differential diagnosis, and lab interpretation tend to expose the largest gaps because they require clinical reasoning integration rather than domain-specific knowledge alone. Most candidates who score well in pharmacology and diagnostics are well-positioned across the rest of the exam.",
  },
  {
    question: "Can I use US NP prep materials to study for the CNPLE?",
    answer:
      "Cautiously, and only for clinical mechanisms. US FNP, AGPCNP, or PMHNP prep materials can reinforce pharmacology mechanisms and clinical reasoning patterns. However, they use US guidelines, USPSTF screening recommendations, HIPAA-based privacy scenarios, and US scope-of-practice framing — all of which differ from Canadian practice. Using US prep as your primary source risks training on the wrong regulatory and guideline context.",
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
          "CNPLE study guide",
          "how to study for CNPLE",
          "Canadian NP exam study plan",
          "CNPLE exam preparation",
          "CNPLE prep timeline",
          "NP licensure exam Canada study guide",
          "CNPLE 2026",
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
      routeGroup: "marketing.default.cnpleStudyGuide",
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

export default function CnpleStudyGuidePage() {
  const { crumbs, schemaItems } = simpleMarketingBreadcrumbs("CNPLE Study Guide", PATH);

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
            This guide gives you a realistic, domain-structured study architecture for the CNPLE — including how to
            calibrate your timeline, which domains to prioritize, how to use simulation correctly for the LOFT format,
            and how to avoid the most common preparation mistakes that keep strong clinicians from passing.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={CNPLE_QUESTIONS}
              className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[var(--semantic-brand)] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-90"
            >
              Start CNPLE practice questions
            </Link>
            <Link
              href={CNPLE_HUB}
              className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-6 py-3 text-sm font-semibold text-[var(--theme-body-text)] hover:border-[var(--semantic-brand)]/40"
            >
              CNPLE hub
            </Link>
          </div>

          <section className="mt-12" aria-labelledby="step-one">
            <h2 id="step-one" className="nn-marketing-h2">
              Step 1: understand the format before you build a schedule
            </h2>
            <p>
              The CNPLE uses <ProseLink href={CNPLE_CLUSTER.loftTesting}>LOFT (linear on-the-fly testing)</ProseLink> —
              a fixed-length exam, not a computerized adaptive test (CAT). This distinction matters for your
              preparation strategy:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-5">
              <li>
                <strong>LOFT:</strong> Every candidate receives a pre-selected fixed set of items. The exam does not
                adapt to your performance. Your score depends on consistent performance across all items.
              </li>
              <li>
                <strong>CAT:</strong> Item difficulty shifts based on your responses. You can exit early once the
                algorithm estimates competence with confidence.
              </li>
            </ul>
            <p className="mt-4">
              Because the CNPLE is fixed-length, pacing discipline matters as much as clinical knowledge. You must
              distribute your attention evenly across all items rather than expending energy on a small number of
              difficulty spikes. This changes how you use simulation: full-length timed runs matter more than short
              adaptive drills.
            </p>
            <p>
              Also confirm the exam is scheduled as expected. The CNPLE targets a July 2026 live date under CCRNR
              administration, but regulatory timelines can shift. Check ccrnr.ca for current scheduling and eligibility
              details.
            </p>
          </section>

          <section className="mt-12" aria-labelledby="step-two">
            <h2 id="step-two" className="nn-marketing-h2">
              Step 2: run a baseline domain diagnostic
            </h2>
            <p>
              Before building a study schedule, you need data. Run a mixed{" "}
              <ProseLink href={CNPLE_QUESTIONS}>CNPLE practice session</ProseLink> of 40–60 items across domains. Tag
              every miss by category. Your goal is to identify the two or three domains where your accuracy is
              weakest — those drive the structure of your first study block.
            </p>
            <p>
              Common weak-domain patterns by NP background:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-5">
              <li>
                <strong>FNP/PCNP background:</strong> Often strong in primary care adult and women's health; weaker in
                pediatric pharmacology dosing, geriatric polypharmacy, and acute deterioration recognition thresholds.
              </li>
              <li>
                <strong>ACNP/hospital background:</strong> Often strong in acute presentations; weaker in chronic
                disease management targets, screening intervals, and health promotion counselling at primary care depth.
              </li>
              <li>
                <strong>PMHNP background:</strong> Often strong in mental health pharmacotherapy; weaker in primary
                care somatic conditions, pediatric milestones, and lab interpretation outside psychiatric panels.
              </li>
            </ul>
            <p className="mt-4">
              The baseline diagnostic is not about your score. It is about your domain gap map.
            </p>
          </section>

          <section className="mt-12" aria-labelledby="step-three">
            <h2 id="step-three" className="nn-marketing-h2">
              Step 3: build a 12-week domain rotation
            </h2>
            <p>
              A 12-week rotation (10–15 hours/week) structures preparation into three phases:
            </p>

            <div className="mt-6 rounded-xl border border-[var(--semantic-border-soft)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)]">
                    <th className="px-4 py-3 text-left font-semibold text-[var(--theme-heading-text)]">Phase</th>
                    <th className="px-4 py-3 text-left font-semibold text-[var(--theme-heading-text)]">Weeks</th>
                    <th className="px-4 py-3 text-left font-semibold text-[var(--theme-heading-text)]">Focus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--semantic-border-soft)]">
                  <tr>
                    <td className="px-4 py-3 font-medium">Foundation</td>
                    <td className="px-4 py-3">1–4</td>
                    <td className="px-4 py-3">
                      Weak-domain blocks: rotate through your two lowest-accuracy domains. Lesson → 30-question block
                      → rationale review → flashcards.
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Breadth</td>
                    <td className="px-4 py-3">5–8</td>
                    <td className="px-4 py-3">
                      Mixed-domain practice across all clinical areas. Add first timed simulation run at Week 6.
                      Continue flashcards daily.
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Pressure</td>
                    <td className="px-4 py-3">9–12</td>
                    <td className="px-4 py-3">
                      Reduce new content. Two full-length timed simulations per week. Repeat weakest-domain blocks
                      from Phase 1. Protect sleep — working memory matters.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="mt-6">
              Working NPs who can only commit 8 hours/week should extend Phase 1 to 6 weeks and compress Phase 3 to 2
              weeks. The phases can compress but the sequencing should not reverse — breadth before pressure.
            </p>
          </section>

          <section className="mt-12" aria-labelledby="domain-priorities">
            <h2 id="domain-priorities" className="nn-marketing-h2">
              Domain priorities for the CNPLE
            </h2>
            <p>
              All domains are testable. These clusters carry the highest integration density across Canadian NP
              competency frameworks and therefore appear most consistently in advanced practice examinations:
            </p>
            <ul className="mt-4 list-disc space-y-3 pl-5">
              <li>
                <ProseLink href={CNPLE_CLUSTER.prescribingQuestions}>Prescribing safety</ProseLink> — drug selection,
                drug interactions, renal/hepatic dose adjustment, high-alert medications, controlled substance
                regulations. Appears in every clinical scenario regardless of system.
              </li>
              <li>
                <ProseLink href={CNPLE_CLUSTER.differentialDiagnosis}>Differential diagnosis</ProseLink> — forming a
                working diagnosis from clinical data, selecting the most discriminating investigation, ruling in/out
                conditions systematically.
              </li>
              <li>
                <ProseLink href={CNPLE_CLUSTER.labInterpretation}>Lab and diagnostic interpretation</ProseLink> — CBC,
                metabolic panels, thyroid function, coagulation, urinalysis, lipids, ECG, clinical value recognition.
              </li>
              <li>
                <ProseLink href={CNPLE_CLUSTER.clinicalJudgment}>Clinical judgment</ProseLink> — integrated
                decision-making: next best step, referral thresholds, escalation triggers, safe vs. unsafe management.
              </li>
              <li>
                <ProseLink href={CNPLE_CLUSTER.geriatrics}>Geriatrics and older adult care</ProseLink> — polypharmacy
                and Beers criteria, frailty, falls, dementia and delirium differentiation, atypical disease
                presentation.
              </li>
            </ul>
          </section>

          <section className="mt-12" aria-labelledby="canadian-specific">
            <h2 id="canadian-specific" className="nn-marketing-h2">
              Key Canadian-specific content for the CNPLE
            </h2>
            <p>
              If you have prepared primarily on US NP exam materials, the following areas require deliberate
              reorientation to Canadian context:
            </p>
            <ul className="mt-4 list-disc space-y-3 pl-5">
              <li>
                <strong>Screening guidelines:</strong> Reference the Canadian Task Force on Preventive Health Care
                (not USPSTF) for cancer, diabetes, and cardiovascular screening recommendations. Intervals and
                thresholds differ.
              </li>
              <li>
                <strong>Immunization schedules:</strong> Use NACI (National Advisory Committee on Immunization)
                recommendations, not ACIP schedules. Timing windows and specific vaccines vary.
              </li>
              <li>
                <strong>Privacy legislation:</strong> Canada operates under PIPEDA (federal) and provincial privacy
                acts — not HIPAA. Mandatory reporting obligations also differ by province.
              </li>
              <li>
                <strong>Prescribing regulations:</strong> Controlled drug scheduling follows the Controlled Drugs and
                Substances Act (CDSA), not the DEA schedule. NP prescribing authority varies by province.
              </li>
              <li>
                <strong>Chronic disease guidelines:</strong> Reference Hypertension Canada, Diabetes Canada, CTS COPD
                guidelines, and CCS Heart Failure guidelines rather than JNC 8, ADA, or GOLD as primary sources.
              </li>
              <li>
                <strong>Indigenous health:</strong> Cultural safety, trauma-informed care, UNDRIP principles, and NP
                responsibilities in providing equitable care for Indigenous peoples in Canada are explicitly tested
                domains in Canadian advanced practice frameworks.
              </li>
            </ul>
          </section>

          <section className="mt-12" aria-labelledby="simulation">
            <h2 id="simulation" className="nn-marketing-h2">
              Using CNPLE simulation correctly
            </h2>
            <p>
              Because the CNPLE is LOFT (fixed-length linear), simulation runs should be full-length and timed. Partial
              sessions and untimed practice are useful for warm-up, but they do not build the pacing discipline that
              exam day demands.
            </p>
            <p>
              Start your first{" "}
              <ProseLink href={CNPLE_SIMULATION}>simulation session</ProseLink> at Week 6 of a 12-week plan. Do not
              simulate earlier — you want at least 4 weeks of domain-building before exposing yourself to full-length
              performance pressure. Use your simulation scores to identify domain patterns that domain blocks may have
              missed.
            </p>
            <p>
              After each simulation: tag every miss by domain and reasoning type (knowledge gap, reading error,
              guessing, time pressure). Track the distribution over successive runs. Your goal is not a higher
              simulation score — it is a narrowing distribution of miss types, which predicts comfort on exam day.
            </p>
          </section>

          <aside
            className="mt-14 rounded-2xl border border-[var(--semantic-border-soft)] p-8"
            style={{ background: "color-mix(in srgb, var(--semantic-brand) 5%, var(--semantic-surface))" }}
          >
            <p className="nn-marketing-h3 !mt-0">Build your CNPLE study plan now</p>
            <p className="mt-2 text-[var(--theme-muted-text)]">
              Start with a diagnostic session, identify your weak domains, and follow the NurseNest CNPLE system.
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Link
                href={CNPLE_QUESTIONS}
                className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[var(--semantic-brand)] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-90"
              >
                Start diagnostic session
              </Link>
              <Link
                href={CNPLE_LESSONS}
                className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-6 py-3 text-sm font-semibold text-[var(--theme-body-text)] hover:border-[var(--semantic-brand)]/40"
              >
                Browse CNPLE lessons
              </Link>
              <Link
                href={CNPLE_PRICING}
                className="text-sm font-semibold text-[var(--semantic-brand)] underline-offset-4 hover:underline self-center"
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
