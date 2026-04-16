import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { FaqJsonLd } from "@/components/seo/faq-json-ld";
import { WebPageJsonLd } from "@/components/seo/seo-json-ld";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { HUB, RN, loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
import { simpleMarketingBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { buildMarketingWebPageJsonLdProps } from "@/lib/seo/marketing-webpage-jsonld";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { robotsForRegionalMarketingHub } from "@/lib/seo/expansion-hub-robots";


const PATH = "/exams/uk";

const PAGE_TITLE = "UK Nursing and Allied Health Licensure: NMC CBT, OSCE, and HCPC (2026 Guide)";

const PAGE_DESCRIPTION =
  "Complete guide to UK nursing registration: NMC Test of Competence (CBT and OSCE), Nursing and Midwifery Council requirements, international nurse pathways, HCPC allied health regulation, migration steps, and how UK testing compares to NCLEX. Links to NurseNest practice and study planning.";

const FAQ_ITEMS = [
  {
    question: "What is the UK nursing exam OSCE?",
    answer:
      "For many internationally educated nurses seeking UK registration, the NMC Test of Competence Part 2 is a practical OSCE-style assessment with scenario stations (for example communication, assessment, and skills). It is not the same as US clinical skills checklists. Always follow the latest NMC candidate guidance for station mix and booking.",
  },
  {
    question: "What is CBT nursing in the UK?",
    answer:
      "The NMC Test of Competence Part 1 is a computer-based test (CBT) that assesses knowledge and application aligned to UK nursing practice. It is one step in the registration journey and must be combined with eligibility evidence, health and character declarations, and (where required) OSCE Part 2.",
  },
  {
    question: "Is UK nursing registration the same as NCLEX?",
    answer:
      "No. NCLEX is the US RN licensing examination pathway. The UK uses the NMC registration process, which includes eligibility assessment, the Test of Competence (CBT plus OSCE where applicable), and NMC registration decisions. Skills transfer in studying, but the systems are not interchangeable.",
  },
  {
    question: "What is HCPC?",
    answer:
      "The Health and Care Professions Council is the statutory regulator for many allied health professions in the UK. Registration is profession-specific: you meet standards for your profession, submit evidence, and there is no single national clinical exam that covers every HCPC title.",
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
        robots: robotsForRegionalMarketingHub("uk"),
        keywords: [
          "UK nursing exam OSCE",
          "CBT nursing UK",
          "NMC CBT",
          "NMC OSCE",
          "HCPC registration",
          "international nurses UK",
          "NCLEX vs UK nursing",
          "Test of Competence",
          "Nursing and Midwifery Council",
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
      routeGroup: "marketing.default.examsUk",
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

export default function UkLicensingExamsPage() {
  const { crumbs, schemaItems } = simpleMarketingBreadcrumbs("UK licensing exams", PATH);

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
          <p className="nn-marketing-eyebrow text-[var(--semantic-text-muted)]">Updated for 2026</p>
          <h1 className="nn-marketing-h1 mt-2 text-balance">{PAGE_TITLE}</h1>
          <p className="nn-marketing-lead mt-4 text-[var(--theme-muted-text)]">
            UK healthcare registration is regulator-first: you prove education, health, character, and competence, then you
            gain the right title and pin for your role. This guide explains nursing (NMC) and allied health (HCPC) routes,
            the two-part nursing test of competence, international pathways, and how UK prep compares to NCLEX-style
            training you may already know.
          </p>

          <section className="mt-12" aria-labelledby="nursing-nmc">
            <h2 id="nursing-nmc" className="nn-marketing-h2">
              Nursing: NMC, CBT, and OSCE
            </h2>
            <p>
              The <strong>Nursing and Midwifery Council (NMC)</strong> maintains the register for nurses and midwives in
              the UK. Registration is not a single “UK NCLEX.” It is a bundle of eligibility checks plus the{" "}
              <strong>Test of Competence</strong> where the NMC requires it for your route.
            </p>
            <h3 className="nn-marketing-h3 mt-6">Part 1: Computer Based Test (CBT)</h3>
            <p>
              The <strong>NMC CBT</strong> is a computer-based assessment that tests nursing theory and application in a UK
              regulatory context. Expect items that reward safe practice, professional accountability, and clinical
              decision-making aligned to the Code and relevant skills clusters. It is one milestone: passing does not by
              itself grant registration without completing other NMC requirements.
            </p>
            <h3 className="nn-marketing-h3 mt-6">Part 2: Objective Structured Clinical Examination (OSCE)</h3>
            <p>
              For many internationally educated nurses, the NMC specifies a practical{" "}
              <strong>OSCE-style Test of Competence Part 2</strong>. Candidates move through stations that assess
              communication, assessment, and procedural skills under observation. This is the sense in which people search
              for a <strong>“UK nursing exam OSCE”</strong>: it is skills and behaviour under exam conditions, not a
              duplicate of US NCLEX item formats.
            </p>
            <p>
              <strong>Two-part system:</strong> think “knowledge screen” (CBT) plus “performance screen” (OSCE) where
              required. Your decision letter and NMC guidance define your exact sequence and deadlines.
            </p>

            <h3 className="nn-marketing-h3 mt-6">International nurse pathway (high level)</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Confirm eligibility category and required evidence for your nursing program and practice history.</li>
              <li>Complete health and character declarations and pay NMC fees as instructed.</li>
              <li>Book and pass the CBT when you are eligible under NMC communications.</li>
              <li>Book and pass the OSCE Part 2 when that applies to your route.</li>
              <li>Receive registration once all NMC requirements are satisfied.</li>
            </ul>
            <p className="mt-4">
              English proficiency requirements (commonly IELTS or OET at thresholds published by the NMC) sit alongside
              technical competence. Treat language evidence as part of the same migration timeline, not an afterthought.
            </p>
          </section>

          <section className="mt-12" aria-labelledby="hcpc">
            <h2 id="hcpc" className="nn-marketing-h2">
              Allied health: HCPC and profession-based licensing
            </h2>
            <p>
              The <strong>Health and Care Professions Council (HCPC)</strong> regulates a defined list of allied
              professions (for example physiotherapists, occupational therapists, radiographers, paramedics, speech and
              language therapists, biomedical scientists, and others).{" "}
              <strong>There is no single HCPC clinical exam that replaces profession-specific routes for every title.</strong>{" "}
              Instead, you demonstrate education, practice, health, character, and standards of proficiency for your
              profession. Some professions include practical assessments or portfolios as part of education or
              international entry routes, but that is not the same model as one national nursing CAT exam.
            </p>
            <p>
              If you are comparing systems: <strong>NCLEX is US RN licensing exam culture</strong>.{" "}
              <strong>UK nursing uses NMC Test of Competence components</strong>.{" "}
              <strong>HCPC uses profession standards plus evidence</strong>, not one shared “HCPC MCQ” for all titles.
            </p>
          </section>

          <section className="mt-12" aria-labelledby="nclex-compare">
            <h2 id="nclex-compare" className="nn-marketing-h2">
              Comparison to NCLEX (practical, not a score converter)
            </h2>
            <p>
              NurseNest builds NCLEX-style clinical judgment practice for US and Canadian RN pathways. That training
              strengthens pathophysiology, pharmacology, prioritization, and safety reasoning. Those skills help any nurse,
              but <strong>UK CBT and OSCE item styles and administrative rules are not NCLEX</strong>. Use NCLEX-style
              practice to build thinking muscle, then pivot to NMC-specific guidance for station skills, documentation
              habits, and UK scope language for your assessment window.
            </p>
            <p>
              <ProseLink href={RN.usLessons}>NCLEX-RN lessons (US hub)</ProseLink> and{" "}
              <ProseLink href={RN.usQuestions}>practice questions</ProseLink> remain useful for cognitive rehearsal. Pair
              them with NMC candidate briefings for authentic UK expectations.
            </p>
          </section>

          <section className="mt-12" aria-labelledby="migration">
            <h2 id="migration" className="nn-marketing-h2">
              Migration funnel: plan the sequence, not just the exam
            </h2>
            <ol className="list-decimal space-y-3 pl-6">
              <li>
                <strong>Credential and eligibility:</strong> align your nursing qualification with NMC categories and
                gather verifiable evidence.
              </li>
              <li>
                <strong>English:</strong> schedule IELTS or OET early if required; scores must meet NMC thresholds.
              </li>
              <li>
                <strong>CBT:</strong> prepare with structured revision mapped to UK practice framing, then book when
                permitted.
              </li>
              <li>
                <strong>OSCE:</strong> rehearse communication, safety, and skills stations with feedback loops.
              </li>
              <li>
                <strong>Employer and visa:</strong> separate from NMC registration; secure offers and immigration advice
                with qualified advisers. Your pin and role requirements sit in the employment and sponsorship layer.
              </li>
            </ol>
            <p className="mt-4">
              NurseNest cannot grant NMC or HCPC decisions. We provide clinical reasoning practice and study structure so
              you are not learning in isolation. Start from this hub, then use{" "}
              <ProseLink href="/blog/tag/uk-nursing">UK-focused articles on the blog</ProseLink> for topic drills.
            </p>
          </section>

          <section className="mt-12" aria-labelledby="internal">
            <h2 id="internal" className="nn-marketing-h2">
              Practice and study links on NurseNest
            </h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <ProseLink href={HUB.questionBank}>Question bank hub</ProseLink> for timed, rationale-rich practice.
              </li>
              <li>
                <ProseLink href={HUB.practiceExams}>Practice exams hub</ProseLink> for full-set stamina.
              </li>
              <li>
                <ProseLink href={HUB.examLessons}>Clinical lessons library</ProseLink> for structured review.
              </li>
              <li>
                <ProseLink href={loginWithCallback("/app/study-plan")}>Study plan</ProseLink> after sign-in.
              </li>
              <li>
                <ProseLink href="/blog">Blog</ProseLink> for UK CBT and OSCE topic articles.
              </li>
            </ul>
          </section>

          <section className="mt-12" aria-labelledby="faq">
            <h2 id="faq" className="nn-marketing-h2">
              FAQ
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
            className="mt-14 rounded-2xl border border-[var(--semantic-border-soft)] p-8"
            style={{ background: "color-mix(in srgb, var(--semantic-info) 6%, var(--semantic-surface))" }}
          >
            <p className="nn-marketing-h3 !mt-0">Next step</p>
            <p className="mt-2 text-[var(--theme-muted-text)]">
              Read the UK article series, then layer timed practice. Your regulator remains the source of truth for
              booking and eligibility.
            </p>
            <p className="mt-4">
              <ProseLink href="/blog/tag/uk-nursing">Browse UK nursing articles</ProseLink>
            </p>
          </aside>
        </article>
      </div>
    </>
  );
}
