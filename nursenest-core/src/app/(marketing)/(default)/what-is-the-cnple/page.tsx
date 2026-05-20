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

const PATH = "/what-is-the-cnple";

const PAGE_TITLE = "What Is the CNPLE? Canadian NP Licensure Exam Explained | NurseNest";
const PAGE_H1 = "What is the CNPLE? The Canadian NP licensure exam explained";
const PAGE_DESCRIPTION =
  "The CNPLE (Canadian Nurse Practitioner Licensure Examination) is Canada's new national NP licensing exam under the single NP classification model. Learn what it is, who writes it, how it works, and what LOFT testing means for prep.";

const FAQ_ITEMS = [
  {
    question: "What does CNPLE stand for?",
    answer:
      "CNPLE stands for Canadian Nurse Practitioner Licensure Examination. It is the new national licensing examination for nurse practitioners in Canada under the single NP classification model, replacing the previous stream-specific CNPE (Canadian Nurse Practitioner Examination) structure.",
  },
  {
    question: "Who administers the CNPLE?",
    answer:
      "The CNPLE is administered by CCRNR — the Canadian Council of Registered Nurse Regulators. CCRNR works with provincial and territorial nursing regulatory bodies to deliver the examination under the national single NP classification framework. NurseNest is not affiliated with or endorsed by CCRNR.",
  },
  {
    question: "Who needs to write the CNPLE?",
    answer:
      "Nurse practitioner candidates who complete approved NP programs and meet their provincial regulatory college's eligibility requirements will be required to pass the CNPLE as part of the NP registration process. Eligibility details and transitional provisions (for candidates already in the CNPE system) vary by province — confirm with your college directly.",
  },
  {
    question: "When does the CNPLE start?",
    answer:
      "The CNPLE is targeted to go live in July 2026 under CCRNR administration. Regulatory timelines can shift; confirm current scheduling at ccrnr.ca and with your provincial college.",
  },
  {
    question: "Is the CNPLE harder than the old CNPE?",
    answer:
      "The CNPLE represents a single unified examination replacing stream-specific exams. Because it covers the full scope of Canadian NP practice under a single classification model rather than a focused stream, breadth of preparation is more important than under the previous stream-specific structure. Whether this makes it objectively 'harder' depends on individual background and preparation.",
  },
  {
    question: "Is the CNPLE adaptive like NCLEX?",
    answer:
      "No. The CNPLE uses LOFT (linear on-the-fly testing), not CAT (computerized adaptive testing). The exam delivers a fixed pre-selected set of items to all candidates. Item difficulty does not adapt to your performance in real time. This is a fundamental difference from NCLEX-RN and REx-PN, which both use adaptive formats.",
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
          "what is the CNPLE",
          "CNPLE exam explained",
          "Canadian NP licensure examination",
          "CNPLE Canada 2026",
          "CNPLE overview",
          "Canadian nurse practitioner exam what to expect",
          "CCRNR CNPLE",
          "single NP classification Canada",
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
      routeGroup: "marketing.default.whatIsCnple",
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

export default function WhatIsTheCnplePage() {
  const { crumbs, schemaItems } = simpleMarketingBreadcrumbs("What Is the CNPLE?", PATH);

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

          <div
            className="mt-6 rounded-xl border p-4 text-sm"
            style={{
              borderColor: "color-mix(in srgb, var(--semantic-info) 35%, var(--semantic-border-soft))",
              background: "color-mix(in srgb, var(--semantic-info) 6%, var(--semantic-surface))",
            }}
          >
            <p className="font-semibold text-[var(--semantic-text-primary)]">Key facts at a glance</p>
            <ul className="mt-2 space-y-1 text-[var(--semantic-text-secondary)]">
              <li>
                <strong>Full name:</strong> Canadian Nurse Practitioner Licensure Examination
              </li>
              <li>
                <strong>Administered by:</strong> CCRNR (Canadian Council of Registered Nurse Regulators)
              </li>
              <li>
                <strong>Format:</strong> LOFT — linear on-the-fly testing (fixed-length, not adaptive)
              </li>
              <li>
                <strong>Target launch:</strong> July 2026
              </li>
              <li>
                <strong>Who writes it:</strong> Canadian NP candidates completing approved programs
              </li>
              <li>
                <strong>Replaces:</strong> The stream-specific CNPE structure
              </li>
            </ul>
          </div>

          <p className="nn-marketing-lead mt-6 text-[var(--theme-muted-text)]">
            The CNPLE represents the most significant change to Canadian NP licensing in a generation. It consolidates
            the previously fragmented stream-specific examination model into a single national exam for all nurse
            practitioners under Canada's new single NP classification framework. Here is everything you need to know.
          </p>

          <section className="mt-12" aria-labelledby="context">
            <h2 id="context" className="nn-marketing-h2">
              The regulatory context: why the CNPLE exists
            </h2>
            <p>
              For most of Canadian NP history, nurse practitioners were licensed under separate designations depending
              on their program focus — Primary Care NP (PCNP), Adult NP (ACNP), Pediatric NP (PNP), and Neonatal NP
              (NNP) in various provinces, each with their own examination streams under the CNPE. This produced a
              fragmented national landscape where NP titles, scope, and exam streams varied significantly across
              provinces and territories.
            </p>
            <p>
              In response to regulatory fragmentation and labour mobility barriers, Canada's provincial and territorial
              nursing regulators (through CCRNR) developed a single NP classification model: one NP title, one national
              entry-to-practice standard, one licensing examination. The CNPLE is the examination vehicle for that
              unified model.
            </p>
            <p>
              The single NP classification simplifies cross-provincial licensure for NPs, makes NP scope-of-practice
              expectations more consistent across jurisdictions, and gives patients, employers, and health systems a
              clearer picture of what a licensed NP can do. For candidates, it means one examination covering the full
              scope of Canadian NP practice — not one subset aligned to a particular stream.
            </p>
          </section>

          <section className="mt-12" aria-labelledby="vs-cnpe">
            <h2 id="vs-cnpe" className="nn-marketing-h2">
              CNPLE vs CNPE: what changed
            </h2>
            <p>
              The CNPE (Canadian Nurse Practitioner Examination) operated as a series of stream-specific exams.
              Candidates wrote the exam most aligned to their program focus — PCNP for primary care programs, ACNP for
              adult care programs, etc. Each stream had its own content blueprint and weighting.
            </p>
            <p>
              The CNPLE replaces all of these streams with a single examination that covers the full scope of Canadian
              NP practice under the single classification model. This means:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-5">
              <li>
                No more stream selection: all candidates write the same exam regardless of program focus area.
              </li>
              <li>
                Broader content coverage: the examination tests clinical competence across the lifespan, not within a
                focused population subset.
              </li>
              <li>
                New format: LOFT (linear on-the-fly testing) instead of the previous CNPE format.
              </li>
            </ul>
            <p className="mt-4">
              For a detailed comparison, see{" "}
              <ProseLink href={CNPLE_CLUSTER.cnpleVsCnpe}>CNPLE vs CNPE: what changed for Canadian NP licensing</ProseLink>.
            </p>
          </section>

          <section className="mt-12" aria-labelledby="format">
            <h2 id="format" className="nn-marketing-h2">
              CNPLE exam format: what is LOFT?
            </h2>
            <p>
              The CNPLE uses <strong>LOFT — linear on-the-fly testing</strong>. This is fundamentally different from
              the adaptive testing (CAT) used in NCLEX-RN and REx-PN, and understanding the difference matters for how
              you prepare.
            </p>

            <div className="mt-6 rounded-xl border border-[var(--semantic-border-soft)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)]">
                    <th className="px-4 py-3 text-left font-semibold text-[var(--theme-heading-text)]">Feature</th>
                    <th className="px-4 py-3 text-left font-semibold text-[var(--theme-heading-text)]">LOFT (CNPLE)</th>
                    <th className="px-4 py-3 text-left font-semibold text-[var(--theme-heading-text)]">CAT (NCLEX)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--semantic-border-soft)]">
                  <tr>
                    <td className="px-4 py-3 font-medium">Item count</td>
                    <td className="px-4 py-3">Fixed (same for all candidates)</td>
                    <td className="px-4 py-3">Variable (minimum to maximum range)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Adapts to you?</td>
                    <td className="px-4 py-3">No — pre-selected fixed set</td>
                    <td className="px-4 py-3">Yes — difficulty shifts with responses</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Early exit?</td>
                    <td className="px-4 py-3">No</td>
                    <td className="px-4 py-3">Yes (once competence estimated)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">Pacing strategy</td>
                    <td className="px-4 py-3">Consistent throughout</td>
                    <td className="px-4 py-3">Strategic early-item focus</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="mt-6">
              For candidates accustomed to CAT thinking, the LOFT format requires a mental recalibration. You cannot
              rely on early termination as a safety net, and you cannot afford to deplete your cognitive reserves on
              a small number of early items. Consistent performance across the entire test is the goal.
            </p>
            <p>
              See <ProseLink href={CNPLE_CLUSTER.loftTesting}>LOFT testing explained</ProseLink> for a complete
              breakdown of what this means for your simulation and pacing strategy.
            </p>
          </section>

          <section className="mt-12" aria-labelledby="content">
            <h2 id="content" className="nn-marketing-h2">
              What the CNPLE tests
            </h2>
            <p>
              The CNPLE assesses competence across the full scope of Canadian NP advanced practice. As of 2026, a
              fully detailed official blueprint with exact domain percentages has not been publicly released by CCRNR.
              NurseNest's study domains are derived from Canadian NP competency frameworks, scope-of-practice
              legislation, and publicly available CCRNR documentation — not from proprietary official sources.
            </p>
            <p>
              The broad content areas consistent with Canadian NP competency frameworks include:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-5">
              <li>Clinical assessment and history-taking across the lifespan</li>
              <li>Differential diagnosis and diagnostic reasoning</li>
              <li>Pharmacotherapeutics and safe prescribing within Canadian regulatory scope</li>
              <li>Laboratory and diagnostic test ordering and interpretation</li>
              <li>Health promotion, screening, and disease prevention (Canadian guidelines)</li>
              <li>Chronic disease management across populations</li>
              <li>Acute deterioration recognition and urgent referral</li>
              <li>Pediatric, adult, and older adult (geriatric) primary care</li>
              <li>Reproductive and sexual health</li>
              <li>Mental health assessment and management</li>
              <li>Indigenous health and culturally safe care</li>
              <li>Ethics, legal obligations, and professional accountability in Canadian regulatory contexts</li>
              <li>Interprofessional collaboration and consultation</li>
            </ul>
            <p className="mt-4">
              See the <ProseLink href={CNPLE_CLUSTER.blueprint}>CNPLE blueprint overview</ProseLink> for the most
              current publicly available information on domain structure and weighting.
            </p>
          </section>

          <section className="mt-12" aria-labelledby="how-to-prepare">
            <h2 id="how-to-prepare" className="nn-marketing-h2">
              How to prepare for the CNPLE
            </h2>
            <p>
              Because the CNPLE is a new examination with a broad unified scope, preparation should start early and
              cover domains systematically. The most important first steps:
            </p>
            <ol className="mt-4 list-decimal space-y-3 pl-6">
              <li>
                Confirm your eligibility and registration details with your provincial college and CCRNR.
              </li>
              <li>
                Read the <ProseLink href={CNPLE_CLUSTER.studyGuide}>CNPLE study guide</ProseLink> to understand
                how to structure your preparation timeline and domain rotation.
              </li>
              <li>
                Run a baseline diagnostic on{" "}
                <ProseLink href={CNPLE_QUESTIONS}>CNPLE practice questions</ProseLink> to identify your weakest
                domains before building a study schedule.
              </li>
              <li>
                Use Canadian-specific study resources: Hypertension Canada, Diabetes Canada, NACI immunization
                schedules, Canadian Task Force on Preventive Health Care guidelines — not US equivalents.
              </li>
              <li>
                Add timed simulation runs after Week 4–6 of domain-focused preparation. See{" "}
                <ProseLink href={CNPLE_CLUSTER.simulationExam}>CNPLE simulation exam</ProseLink>.
              </li>
            </ol>
          </section>

          <aside
            className="mt-14 rounded-2xl border border-[var(--semantic-border-soft)] p-8"
            style={{ background: "color-mix(in srgb, var(--semantic-brand) 5%, var(--semantic-surface))" }}
          >
            <p className="nn-marketing-h3 !mt-0">Start preparing for the CNPLE</p>
            <p className="mt-2 text-[var(--theme-muted-text)]">
              Practice questions, lessons, and simulation — all built for Canadian NP scope on NurseNest.
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
