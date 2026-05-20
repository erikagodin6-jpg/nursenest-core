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

const PATH = "/cnple-simulation-exam";

const PAGE_TITLE = "CNPLE Simulation Exam — 15 LOFT-Format Cases | NurseNest";
const PAGE_H1 = "CNPLE simulation exam: LOFT-format practice for the Canadian NP licensure test";
const PAGE_DESCRIPTION =
  "Practice for the CNPLE with 15 longitudinal clinical cases and timed fixed-length simulation sessions that mirror the LOFT format. Covers primary care, prescribing safety, chronic disease, women's health, pediatrics, geriatrics, mental health, urgent care, and professional practice. Build pacing discipline, identify domain gaps under pressure, and track performance trends across practice runs.";

const FAQ_ITEMS = [
  {
    question: "What is a CNPLE simulation exam?",
    answer:
      "A CNPLE simulation exam is a full-length, timed practice session designed to replicate the conditions and pressure of the actual CNPLE. It uses a fixed number of questions (matching the LOFT format — linear on-the-fly testing) with a set time limit. NurseNest simulation sessions are independently designed and not endorsed by or affiliated with CCRNR.",
  },
  {
    question: "How is the CNPLE exam format different from NCLEX CAT?",
    answer:
      "The CNPLE uses LOFT (linear on-the-fly testing), a fixed-length format where every candidate receives a pre-selected set of items regardless of performance. NCLEX uses CAT (computerized adaptive testing) where item difficulty shifts based on your responses and the exam can end early once the algorithm estimates competence. This means CNPLE preparation requires different pacing strategy: consistent performance across all items, not just peak performance in easy early items.",
  },
  {
    question: "When should I start doing CNPLE simulation runs?",
    answer:
      "Start simulation runs after you have completed at least 4 weeks of domain-focused practice. Running simulations too early (before establishing baseline domain accuracy) produces noise rather than signal — you will not be able to distinguish time-pressure failures from knowledge gaps. Week 6 of a 12-week plan is a typical entry point for first full-length timed simulation.",
  },
  {
    question: "How many simulation exams should I do before the CNPLE?",
    answer:
      "Most candidates benefit from 4–6 full-length simulation runs in the final 6 weeks of preparation. Two per week in the final 3 weeks, combined with weak-area review between runs, is a reasonable target. Prioritize quality review of each run over volume — simulation without deliberate miss analysis is just expensive stress.",
  },
  {
    question: "What should I do after a CNPLE simulation run?",
    answer:
      "Tag every miss by domain and reasoning error type: knowledge gap, clinical reasoning error, reading error, or time-pressure panic. Track the distribution across successive runs. A narrowing miss-type distribution (not just a rising score) predicts exam-day readiness. Focus the next study block on the highest-frequency miss domain.",
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
          "CNPLE simulation exam",
          "CNPLE mock exam",
          "CNPLE practice test",
          "Canadian NP licensure practice exam",
          "LOFT format CNPLE",
          "CNPLE exam simulator",
          "NP exam simulation Canada",
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
      routeGroup: "marketing.default.cnpleSimulationExam",
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

export default function CnpleSimulationExamPage() {
  const { crumbs, schemaItems } = simpleMarketingBreadcrumbs("CNPLE Simulation Exam", PATH);

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
            A simulation exam is not just a long practice session. For the CNPLE specifically, simulation trains a
            skill that domain blocks cannot: pacing and sustained clinical judgment across a fixed-length linear test.
            This page explains why the LOFT format matters, how to use simulation correctly, and what to do with your
            results.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={CNPLE_SIMULATION}
              className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[var(--semantic-brand)] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-90"
            >
              Start a simulation session
            </Link>
            <Link
              href={CNPLE_QUESTIONS}
              className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-6 py-3 text-sm font-semibold text-[var(--theme-body-text)] hover:border-[var(--semantic-brand)]/40"
            >
              Practice questions first
            </Link>
          </div>

          <section className="mt-12" aria-labelledby="why-loft-matters">
            <h2 id="why-loft-matters" className="nn-marketing-h2">
              Why LOFT format changes everything about CNPLE simulation
            </h2>
            <p>
              Most Canadian nursing candidates are familiar with CAT (computerized adaptive testing) from NCLEX. In a
              CAT exam, item difficulty adapts to your performance, and the exam can terminate early once the algorithm
              estimates competence. Your strategy in a CAT environment naturally emphasizes accuracy on early items,
              where the algorithm is most sensitive to your responses.
            </p>
            <p>
              The CNPLE uses LOFT — linear on-the-fly testing. Every candidate receives a fixed set of items. The exam
              does not adapt. There is no early termination. Your score depends on consistent performance across the
              entire item set, not peak performance in a strategic early window.
            </p>
            <p>
              This changes the simulation strategy completely. You need:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-5">
              <li>
                <strong>Even pacing:</strong> You cannot slow down on difficult items and accelerate on easy ones the
                way you might in a test with early termination. A fixed time budget divided across a fixed item count
                requires disciplined pacing from item 1 to the last item.
              </li>
              <li>
                <strong>Stamina and breadth:</strong> Clinical performance tends to degrade toward the end of long
                examinations. Your simulation runs must build the endurance to maintain accuracy in the final third of
                the exam, where fatigue typically hurts performance the most.
              </li>
              <li>
                <strong>Domain breadth coverage:</strong> Because the item set is fixed, you cannot outperform a
                weak domain by acing another. Every domain contributes to your final score proportionally.
              </li>
            </ul>
            <p className="mt-4">
              For deeper background on the format, see{" "}
              <ProseLink href={CNPLE_CLUSTER.loftTesting}>LOFT testing explained</ProseLink>.
            </p>
          </section>

          <section className="mt-12" aria-labelledby="when-to-simulate">
            <h2 id="when-to-simulate" className="nn-marketing-h2">
              When to start CNPLE simulation runs
            </h2>
            <p>
              Simulation is not a starting point — it is a pressure test. Starting simulation before you have
              established domain-level accuracy produces noise: you cannot distinguish knowledge failures from pacing
              failures, and repeated low scores early in preparation are demoralizing without being instructive.
            </p>
            <p>
              The right sequencing in a 12-week preparation plan:
            </p>
            <ol className="mt-4 list-decimal space-y-3 pl-6">
              <li>
                <strong>Weeks 1–4:</strong> Domain diagnostic + focused domain blocks. Build accuracy in your two
                weakest areas. Daily{" "}
                <ProseLink href={CNPLE_QUESTIONS}>CNPLE practice questions</ProseLink> with full rationale review.
              </li>
              <li>
                <strong>Weeks 5–6:</strong> Mixed-domain breadth practice. First simulation run at the end of Week 6.
                Use this run primarily for pacing data — how did you distribute time, where did you rush, where did
                you stall?
              </li>
              <li>
                <strong>Weeks 7–10:</strong> Two simulation runs per two-week block, alternating with weak-domain
                remediation. Track domain accuracy trends across successive runs.
              </li>
              <li>
                <strong>Weeks 11–12:</strong> Two simulation runs per week. No new content. Focus is consolidation,
                pacing refinement, and sleep protection. Working memory degrades with sleep deprivation faster than
                clinical knowledge does.
              </li>
            </ol>
          </section>

          <section className="mt-12" aria-labelledby="after-simulation">
            <h2 id="after-simulation" className="nn-marketing-h2">
              How to review a CNPLE simulation run
            </h2>
            <p>
              A simulation run without deliberate review is half the value. After every run, complete this four-step
              review protocol:
            </p>
            <h3 className="nn-marketing-h3 mt-8">1. Tag every miss by error type</h3>
            <p>
              Knowledge gap (did not know the clinical content), reasoning error (knew the content but applied it
              wrong), reading error (misread the stem or question), or pacing error (chose quickly without processing).
              These types respond to different interventions.
            </p>
            <h3 className="nn-marketing-h3 mt-8">2. Map errors to domains</h3>
            <p>
              Which domain generated the most misses? Which error type was most common in that domain? A domain with
              mostly knowledge gaps needs lesson review and focused question blocks. A domain with mostly reasoning
              errors needs case-based practice with explicit differential reasoning steps.
            </p>
            <h3 className="nn-marketing-h3 mt-8">3. Identify the time distribution</h3>
            <p>
              Did you rush the final 20% of items? Did you slow down on a particular question type? The time stamp on
              each item (when available) shows where your pacing broke. Practice that exact pacing pattern in the next
              simulation run.
            </p>
            <h3 className="nn-marketing-h3 mt-8">4. Build your next block from your data</h3>
            <p>
              Your next study block after a simulation run should be a 20–30 question focused block in your
              highest-error domain, followed by lesson review of the specific clinical content that generated the most
              misses. Then re-test with a 10-question mini-block before your next full simulation.
            </p>
          </section>

          <section className="mt-12" aria-labelledby="related">
            <h2 id="related" className="nn-marketing-h2">
              Related CNPLE preparation resources
            </h2>
            <ul className="mt-4 list-disc space-y-3 pl-5">
              <li>
                <ProseLink href={CNPLE_CLUSTER.loftTesting}>LOFT testing explained</ProseLink> — full breakdown of the
                CNPLE exam format, why it is not CAT, and what that means for your simulation strategy.
              </li>
              <li>
                <ProseLink href={CNPLE_CLUSTER.practiceQuestions}>CNPLE practice questions</ProseLink> — build domain
                accuracy before moving to full simulation runs.
              </li>
              <li>
                <ProseLink href={CNPLE_CLUSTER.clinicalJudgment}>CNPLE clinical judgment</ProseLink> — the
                cross-cutting reasoning skill that simulation pressure most reliably exposes as a gap.
              </li>
              <li>
                <ProseLink href={CNPLE_CLUSTER.studyGuide}>CNPLE study guide</ProseLink> — complete timeline and
                domain rotation planning for the full preparation period.
              </li>
              <li>
                <ProseLink href={CNPLE_HUB}>CNPLE hub</ProseLink> — all preparation resources in one place.
              </li>
            </ul>
          </section>

          <aside
            className="mt-14 rounded-2xl border border-[var(--semantic-border-soft)] p-8"
            style={{ background: "color-mix(in srgb, var(--semantic-brand) 5%, var(--semantic-surface))" }}
          >
            <p className="nn-marketing-h3 !mt-0">Ready to simulate under pressure?</p>
            <p className="mt-2 text-[var(--theme-muted-text)]">
              Build domain accuracy first — then move to timed LOFT-style simulation runs on NurseNest.
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Link
                href={CNPLE_SIMULATION}
                className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[var(--semantic-brand)] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-90"
              >
                Start simulation
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
