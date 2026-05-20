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

const PATH = "/canada-np-exam-prep";

const PAGE_TITLE = "Canada NP Exam Prep — CNPLE Study System | NurseNest";
const PAGE_H1 = "Canada NP exam prep: the complete CNPLE study system";
const PAGE_DESCRIPTION =
  "Prepare for the Canadian Nurse Practitioner Licensure Examination with clinical judgment practice, prescribing safety drills, diagnostic interpretation, and LOFT-format simulation — built for Canadian NP scope.";

const FAQ_ITEMS = [
  {
    question: "What is the CNPLE?",
    answer:
      "The CNPLE (Canadian Nurse Practitioner Licensure Examination) is Canada's national licensing exam for nurse practitioners under the single NP classification model. It is administered by CCRNR (Canadian Council of Registered Nurse Regulators) and is scheduled to go live in 2026. It uses LOFT (linear on-the-fly testing), a fixed-length format. Verify current exam details and your eligibility directly with your provincial college and CCRNR.",
  },
  {
    question: "How is the CNPLE different from the CNPE?",
    answer:
      "The CNPE (Canadian Nurse Practitioner Examination) was stream-specific — candidates wrote the exam most aligned to their program focus (primary care across the lifespan, adult care, etc.). The CNPLE replaces this with a single unified examination for all nurse practitioners under Canada's single NP classification model. This change reflects a major regulatory shift in how Canadian provinces and territories license NP practice.",
  },
  {
    question: "When does CNPLE prep need to start?",
    answer:
      "Now. Search volume for CNPLE preparation is already growing among NP graduates and students who are aware of the regulatory change. Starting early lets you build systematic domain coverage rather than cramming. The exam is targeted to go live July 2026; graduates completing programs in 2025–2026 should begin structured preparation at least 3–4 months before their intended exam date.",
  },
  {
    question: "What topics should I study for the CNPLE?",
    answer:
      "Canadian NP competency frameworks emphasize: clinical assessment and differential diagnosis, pharmacotherapeutics and prescribing safety, laboratory and diagnostic interpretation, health promotion and disease prevention, chronic disease management across the lifespan, acute deterioration recognition, pediatrics, older adult care and geriatrics, reproductive and sexual health, mental health, indigenous health and cultural safety, interprofessional collaboration, and professional/ethical/legal practice in a Canadian regulatory context.",
  },
  {
    question: "Does NurseNest have official CNPLE content?",
    answer:
      "NurseNest is an independent exam prep platform — not affiliated with or endorsed by CCRNR. Practice questions and study domains are independently authored based on Canadian NP competency frameworks and clinical guidelines. There is no official CNPLE question bank that can be licensed by third parties; any platform claiming 'official CNPLE questions' should be viewed skeptically.",
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
          "Canada NP exam prep",
          "Canadian NP exam preparation",
          "CNPLE study guide",
          "CNPLE prep 2026",
          "Canadian nurse practitioner licensure exam",
          "CNPLE study materials",
          "NP exam Canada",
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
      routeGroup: "marketing.default.canadaNpExamPrep",
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

export default function CanadaNpExamPrepPage() {
  const { crumbs, schemaItems } = simpleMarketingBreadcrumbs("Canada NP Exam Prep", PATH);

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
            Canada's NP licensing landscape changed fundamentally with the introduction of the Canadian Nurse
            Practitioner Licensure Examination (CNPLE) — a single unified exam replacing the stream-specific CNPE model.
            NurseNest is building the first major preparation ecosystem purpose-built for this exam. Here is what you
            need to know and how to prepare.
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
              Explore the CNPLE hub
            </Link>
          </div>

          <section className="mt-12" aria-labelledby="the-exam">
            <h2 id="the-exam" className="nn-marketing-h2">
              The CNPLE: what you need to know right now
            </h2>
            <p>
              <strong>What it is:</strong> The Canadian Nurse Practitioner Licensure Examination (CNPLE) is the new
              national entry-to-practice exam for nurse practitioners in Canada. It is administered by CCRNR (Canadian
              Council of Registered Nurse Regulators) and underpins the single NP classification model — one NP title,
              one national exam, with provincial regulatory bodies setting additional eligibility requirements.
            </p>
            <p>
              <strong>What changed:</strong> Previously, Canadian NP candidates wrote the CNPE in the stream most
              aligned to their program: primary care across the lifespan (PCNP), adult care (ACNP), or other focused
              streams depending on province and program. The CNPLE consolidates this into one unified examination. See{" "}
              <ProseLink href={CNPLE_CLUSTER.cnpleVsCnpe}>CNPLE vs CNPE</ProseLink> for a full breakdown of how the
              exams differ.
            </p>
            <p>
              <strong>Format:</strong> The CNPLE uses LOFT (linear on-the-fly testing), not computerized adaptive
              testing (CAT). This is important for how you calibrate your practice. A LOFT exam delivers a fixed,
              pre-selected sequence of items that does not adapt to your performance in real time. You need pacing
              discipline and consistent breadth — not just peak performance in strong domains. See{" "}
              <ProseLink href={CNPLE_CLUSTER.loftTesting}>LOFT testing explained</ProseLink> for full detail.
            </p>
            <p>
              <strong>Timeline:</strong> The CNPLE is targeted to go live in July 2026 under CCRNR administration.
              Confirm current scheduling, registration, and eligibility rules directly with CCRNR and your provincial
              college. Regulatory timelines can shift.
            </p>
          </section>

          <section className="mt-12" aria-labelledby="prep-system">
            <h2 id="prep-system" className="nn-marketing-h2">
              The complete CNPLE preparation system
            </h2>
            <p>
              Effective CNPLE prep combines four elements: clinical knowledge depth, structured retrieval practice,
              simulation-based pacing, and systematic weak-area remediation. No single element works in isolation.
            </p>

            <h3 className="nn-marketing-h3 mt-8">1. Clinical lessons by domain</h3>
            <p>
              The CNPLE tests advanced practice scope — assessment, diagnosis, prescribing, and management across
              populations and body systems. You need to understand the clinical reasoning behind decisions, not just
              recognize answer stems. <ProseLink href={CNPLE_LESSONS}>CNPLE lessons on NurseNest</ProseLink> cover key
              domains with Canadian guideline alignment: Hypertension Canada, Diabetes Canada, CTS COPD guidelines,
              NACI immunization schedules, and Canadian Task Force on Preventive Health Care recommendations.
            </p>

            <h3 className="nn-marketing-h3 mt-8">2. Structured question practice</h3>
            <p>
              Retrieval practice with deliberate review is the most evidence-supported study method for high-stakes
              clinical exams. Use <ProseLink href={CNPLE_QUESTIONS}>CNPLE practice questions</ProseLink> in structured
              domain blocks rather than randomized marathons. After each session, review every rationale — including
              questions you got right — to identify near-misses and gaps in reasoning rather than just knowledge.
            </p>

            <h3 className="nn-marketing-h3 mt-8">3. Simulation runs with timed pressure</h3>
            <p>
              Because the CNPLE is a fixed-length LOFT exam, pacing is a separate skill from clinical knowledge. Run{" "}
              <ProseLink href={CNPLE_SIMULATION}>CNPLE simulation sessions</ProseLink> under timed conditions after
              you have established baseline domain accuracy. These sessions surface time-management failures that domain
              practice blocks do not expose.
            </p>

            <h3 className="nn-marketing-h3 mt-8">4. Weak-area remediation loops</h3>
            <p>
              Use NurseNest's performance reporting to identify your lowest-accuracy domains and build remediation
              loops: lesson review → focused practice block → re-test → track accuracy trend. The goal is narrowing the
              gap between your weakest and strongest domains, not inflating performance in topics you already master.
            </p>
          </section>

          <section className="mt-12" aria-labelledby="high-yield">
            <h2 id="high-yield" className="nn-marketing-h2">
              High-yield CNPLE study domains
            </h2>
            <p>
              Based on Canadian NP competency frameworks and scope-of-practice literature, these domains carry
              consistently high weighting across advanced practice NP exams. NurseNest has purpose-built practice
              coverage for each.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                { label: "Prescribing & Pharmacology", href: CNPLE_CLUSTER.prescribingQuestions },
                { label: "Clinical Judgment & Diagnosis", href: CNPLE_CLUSTER.clinicalJudgment },
                { label: "Lab & Diagnostic Interpretation", href: CNPLE_CLUSTER.labInterpretation },
                { label: "Differential Diagnosis", href: CNPLE_CLUSTER.differentialDiagnosis },
                { label: "Primary Care Across Lifespan", href: CNPLE_CLUSTER.primaryCare },
                { label: "Mental Health", href: CNPLE_CLUSTER.mentalHealth },
                { label: "Pediatrics", href: CNPLE_CLUSTER.pediatrics },
                { label: "Geriatrics", href: CNPLE_CLUSTER.geriatrics },
                { label: "Women's & Reproductive Health", href: CNPLE_CLUSTER.womensHealth },
                { label: "Pharmacology Deep Dive", href: CNPLE_CLUSTER.pharmacology },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 rounded-lg border border-[var(--semantic-border-soft)] px-4 py-3 text-sm font-semibold text-[var(--theme-heading-text)] hover:border-[var(--semantic-brand)]/40 hover:shadow-sm transition-shadow"
                >
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--semantic-brand)]" aria-hidden />
                  {item.label}
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-12" aria-labelledby="exam-understanding">
            <h2 id="exam-understanding" className="nn-marketing-h2">
              Understanding the exam before you sit it
            </h2>
            <p>
              A recurring mistake in high-stakes exam prep is studying the right content in the wrong format. Before
              you build a study schedule, invest time in understanding the CNPLE's structure:
            </p>
            <ul className="mt-4 list-disc space-y-3 pl-5">
              <li>
                <ProseLink href={CNPLE_CLUSTER.whatIsCnple}>What is the CNPLE?</ProseLink> — full overview of the exam,
                its regulatory context, and who needs to write it.
              </li>
              <li>
                <ProseLink href={CNPLE_CLUSTER.loftTesting}>LOFT testing explained</ProseLink> — why the CNPLE format
                (fixed-length linear) changes how you should approach simulation practice.
              </li>
              <li>
                <ProseLink href={CNPLE_CLUSTER.cnpleVsCnpe}>CNPLE vs CNPE</ProseLink> — how the new exam differs from
                the previous stream-specific CNPE model.
              </li>
              <li>
                <ProseLink href={CNPLE_CLUSTER.blueprint}>CNPLE blueprint overview</ProseLink> — what is publicly
                known about content weighting and domain structure.
              </li>
            </ul>
          </section>

          <aside
            className="mt-14 rounded-2xl border border-[var(--semantic-border-soft)] p-8"
            style={{ background: "color-mix(in srgb, var(--semantic-brand) 5%, var(--semantic-surface))" }}
          >
            <p className="nn-marketing-h3 !mt-0">Start your CNPLE prep today</p>
            <p className="mt-2 text-[var(--theme-muted-text)]">
              Questions, lessons, simulation, and performance tracking — all in one place for Canadian NP prep.
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Link
                href={CNPLE_QUESTIONS}
                className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[var(--semantic-brand)] px-6 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-90"
              >
                Start practice questions
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
