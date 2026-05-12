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
  CNPLE_PRICING,
  CNPLE_QUESTIONS,
  CNPLE_REGULATOR_REF,
} from "@/lib/seo/cnple-seo-cluster";

export const revalidate = 86400;

const PATH = "/cnple-vs-cnpe";

const PAGE_TITLE = "CNPLE vs CNPE: What Changed for Canadian NP Licensing | NurseNest";
const PAGE_H1 = "CNPLE vs CNPE: what changed for Canadian NP licensing";
const PAGE_DESCRIPTION =
  "The CNPLE replaces the CNPE stream-specific model with a single unified NP licensing exam. Learn what changed, who is affected, and how the new exam format (LOFT) differs from the old CNPE structure.";

const FAQ_ITEMS = [
  {
    question: "Does the CNPLE replace the CNPE?",
    answer:
      "Yes. The CNPLE (Canadian Nurse Practitioner Licensure Examination) replaces the CNPE (Canadian Nurse Practitioner Examination) under Canada's single NP classification model. The CNPE's stream-specific structure (PCNP, ACNP, etc.) is being replaced by a single unified examination for all Canadian NP candidates.",
  },
  {
    question: "If I already passed the CNPE, do I need to write the CNPLE?",
    answer:
      "Candidates who have already passed a CNPE stream and hold current NP registration are not expected to rewrite the CNPLE. Transitional provisions for candidates currently in the CNPE process vary by province. Confirm your status directly with your provincial regulatory college and CCRNR.",
  },
  {
    question: "How is the CNPLE format different from the CNPE?",
    answer:
      "The CNPLE uses LOFT (linear on-the-fly testing) — a fixed-length format where every candidate receives the same number of items regardless of performance. The CNPE used a different format. The CNPLE is also unified across NP streams rather than tailored to a specialty focus area.",
  },
  {
    question: "Is the content broader on the CNPLE than the CNPE?",
    answer:
      "Yes, in the sense that the CNPLE covers the full scope of Canadian NP practice under the single classification model. The CNPE's PCNP stream, for example, focused on primary care across the lifespan; the ACNP stream focused on adult care. The CNPLE is designed to test unified NP competencies across all populations and contexts within NP scope.",
  },
  {
    question: "What study materials should I use if I was preparing for the CNPE?",
    answer:
      "Most CNPE preparation materials remain relevant as foundational clinical content (pharmacology, diagnostics, primary care). The main adjustments needed are: (1) ensure coverage is lifespan-complete rather than stream-specific, (2) adjust simulation strategy for LOFT format rather than previous CNPE format, and (3) verify that screening and guideline content reflects current Canadian standards (NACI, Canadian Task Force on Preventive Health Care, etc.).",
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
          "CNPLE vs CNPE",
          "CNPLE replaces CNPE",
          "Canadian NP exam change 2026",
          "CNPE to CNPLE transition",
          "single NP classification Canada exam",
          "Canadian NP licensure exam differences",
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
      routeGroup: "marketing.default.cnpleVsCnpe",
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

export default function CnpleVsCnpePage() {
  const { crumbs, schemaItems } = simpleMarketingBreadcrumbs("CNPLE vs CNPE", PATH);

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
            Canada's NP exam is changing. The CNPLE (Canadian Nurse Practitioner Licensure Examination) replaces the
            CNPE stream-specific model under the national single NP classification framework. If you are a Canadian NP
            candidate, this comparison tells you exactly what changed, what stayed the same, and how to adjust your
            preparation.
          </p>

          <section className="mt-12" aria-labelledby="comparison-table">
            <h2 id="comparison-table" className="nn-marketing-h2">
              CNPLE vs CNPE: side-by-side comparison
            </h2>

            <div className="mt-6 rounded-xl border border-[var(--semantic-border-soft)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)]">
                    <th className="px-4 py-3 text-left font-semibold text-[var(--theme-heading-text)]">Feature</th>
                    <th className="px-4 py-3 text-left font-semibold text-[var(--theme-heading-text)]">CNPE (old)</th>
                    <th className="px-4 py-3 text-left font-semibold text-[var(--theme-heading-text)]">CNPLE (new)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--semantic-border-soft)]">
                  <tr>
                    <td className="px-4 py-3 font-medium">Structure</td>
                    <td className="px-4 py-3">Multiple streams (PCNP, ACNP, etc.)</td>
                    <td className="px-4 py-3">Single unified exam</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Model</td>
                    <td className="px-4 py-3">Stream-specific NP classification</td>
                    <td className="px-4 py-3">Single NP classification model</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Format</td>
                    <td className="px-4 py-3">CNPE-specific format</td>
                    <td className="px-4 py-3">LOFT (linear on-the-fly testing)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Content scope</td>
                    <td className="px-4 py-3">Focused by stream (population/setting)</td>
                    <td className="px-4 py-3">Full lifespan NP scope</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Administered by</td>
                    <td className="px-4 py-3">CNA (Canadian Nurses Association)</td>
                    <td className="px-4 py-3">CCRNR</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Adaptive?</td>
                    <td className="px-4 py-3">No</td>
                    <td className="px-4 py-3">No (LOFT = fixed-length linear)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Launch</td>
                    <td className="px-4 py-3">Phased out</td>
                    <td className="px-4 py-3">Target July 2026</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-12" aria-labelledby="what-stayed-same">
            <h2 id="what-stayed-same" className="nn-marketing-h2">
              What stayed the same
            </h2>
            <p>
              Despite the structural change, the core of NP clinical competence being tested remains consistent with
              what the CNPE assessed. The regulatory goal — ensuring Canadian NP candidates can safely practice at
              advanced practice scope — has not changed.
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-5">
              <li>Clinical judgment and decision-making is still central</li>
              <li>Pharmacotherapeutics and safe prescribing are still high-yield</li>
              <li>Differential diagnosis, history, and physical examination remain foundational</li>
              <li>Lab and diagnostic interpretation is still tested</li>
              <li>Professional, ethical, and legal practice in a Canadian context is retained</li>
              <li>Chronic disease management across the lifespan remains core</li>
            </ul>
            <p className="mt-4">
              If you have been preparing for the CNPE, the vast majority of your clinical content knowledge transfers.
              The adaptation needed is primarily in scope breadth (ensure full lifespan coverage, not just your stream)
              and simulation strategy (LOFT format, not CNPE format).
            </p>
          </section>

          <section className="mt-12" aria-labelledby="what-changed">
            <h2 id="what-changed" className="nn-marketing-h2">
              What changed — and what it means for prep
            </h2>

            <h3 className="nn-marketing-h3 mt-8">1. No more stream selection</h3>
            <p>
              Under the CNPE model, candidates chose the stream most aligned to their program: PCNP, ACNP, PNP, or NNP
              depending on their province, program, and regulatory requirements. Under the CNPLE, there is no stream
              selection — all candidates write the same unified examination.
            </p>
            <p>
              <strong>What this means for prep:</strong> If your program had a primary care focus, you cannot anchor
              your preparation there. If your program had an adult care focus, pediatric and reproductive health
              content now require deliberate coverage. All population groups and primary care contexts are fair game.
            </p>

            <h3 className="nn-marketing-h3 mt-8">2. Full lifespan scope</h3>
            <p>
              The CNPLE tests NP competence across the full lifespan — pediatrics through older adult care — within
              the unified single classification model. This is a broader clinical scope than any single CNPE stream
              tested.
            </p>
            <p>
              Key content areas requiring attention for candidates from focused-stream CNPE prep:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-5">
              <li>
                <ProseLink href={CNPLE_CLUSTER.pediatrics}>Pediatrics</ProseLink> — developmental milestones, growth
                surveillance, pediatric pharmacology, vaccine schedules (NACI)
              </li>
              <li>
                <ProseLink href={CNPLE_CLUSTER.geriatrics}>Geriatric care</ProseLink> — frailty, polypharmacy and
                Beers criteria, dementia and delirium, falls prevention
              </li>
              <li>
                <ProseLink href={CNPLE_CLUSTER.womensHealth}>Reproductive and sexual health</ProseLink> —
                contraception, prenatal care, STI management, menopause
              </li>
              <li>
                <ProseLink href={CNPLE_CLUSTER.mentalHealth}>Mental health</ProseLink> — assessment and management of
                depression, anxiety, PTSD, substance use disorders, and safe prescribing
              </li>
            </ul>

            <h3 className="nn-marketing-h3 mt-8">3. LOFT format replaces previous CNPE format</h3>
            <p>
              The CNPLE uses LOFT (linear on-the-fly testing): a fixed number of items pre-selected by the testing
              engine, delivered sequentially without real-time adaptation. The previous CNPE also used a fixed format,
              but the CNPLE's LOFT implementation is new under the CCRNR administration framework.
            </p>
            <p>
              The key pacing implication: consistent performance across the full item set, not peak performance in
              early items. See{" "}
              <ProseLink href={CNPLE_CLUSTER.loftTesting}>LOFT testing explained</ProseLink> for full detail.
            </p>

            <h3 className="nn-marketing-h3 mt-8">4. Canadian guideline anchoring is more important than ever</h3>
            <p>
              With a single unified exam, provincial variation in guideline adoption matters less than national
              Canadian standards. Your primary references should be Canadian Task Force on Preventive Health Care
              (screening), NACI (immunization), Hypertension Canada, Diabetes Canada, CTS COPD guidelines, and
              CCRNR-recognized scope-of-practice frameworks.
            </p>
          </section>

          <section className="mt-12" aria-labelledby="transition-planning">
            <h2 id="transition-planning" className="nn-marketing-h2">
              Transitional planning if you were preparing for the CNPE
            </h2>
            <p>
              If you have already been preparing for the CNPE and are transitioning to CNPLE preparation, here is the
              minimal adaptation checklist:
            </p>
            <ol className="mt-4 list-decimal space-y-3 pl-6">
              <li>
                <strong>Audit your domain coverage for population gaps.</strong> Run a diagnostic{" "}
                <ProseLink href={CNPLE_QUESTIONS}>practice session</ProseLink> to identify which populations
                (pediatric, geriatric, reproductive, mental health) show the most accuracy deficits.
              </li>
              <li>
                <strong>Add population-specific practice blocks for your gaps.</strong> If your CNPE stream was
                adult-focused, add deliberate pediatric and geriatric content blocks before simulation runs.
              </li>
              <li>
                <strong>Recalibrate simulation strategy for LOFT.</strong> If you practiced with adaptive-style
                short sessions, shift to full-length fixed-time runs. See{" "}
                <ProseLink href={CNPLE_CLUSTER.simulationExam}>CNPLE simulation</ProseLink>.
              </li>
              <li>
                <strong>Verify guideline currency.</strong> Some CNPE preparation materials reference older Canadian
                guidelines. Ensure your screening intervals, drug choice thresholds, and immunization schedules
                reflect current NACI, Canadian Task Force on Preventive Health Care, and relevant specialty guidelines.
              </li>
            </ol>
          </section>

          <aside
            className="mt-14 rounded-2xl border border-[var(--semantic-border-soft)] p-8"
            style={{ background: "color-mix(in srgb, var(--semantic-brand) 5%, var(--semantic-surface))" }}
          >
            <p className="nn-marketing-h3 !mt-0">Prepare for the CNPLE with NurseNest</p>
            <p className="mt-2 text-[var(--theme-muted-text)]">
              CNPLE-aligned practice questions, clinical lessons, and timed simulation — purpose-built for Canadian NP scope.
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Link
                href={CNPLE_QUESTIONS}
                className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[var(--semantic-brand)] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-90"
              >
                Start CNPLE practice
              </Link>
              <Link
                href={CNPLE_HUB}
                className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-6 py-3 text-sm font-semibold text-[var(--theme-body-text)] hover:border-[var(--semantic-brand)]/40"
              >
                CNPLE hub
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

          <aside
            className="mt-10 rounded-lg border border-[var(--semantic-border-soft)] p-4 text-sm text-[var(--semantic-text-muted)]"
          >
            <p className="font-semibold text-[var(--semantic-text-primary)]">Regulatory source</p>
            <p className="mt-1">{CNPLE_REGULATOR_REF}</p>
          </aside>

          <p className="mt-6 text-xs text-[var(--semantic-text-muted)] italic">{CNPLE_DISCLAIMER}</p>
        </article>
      </div>
    </>
  );
}
