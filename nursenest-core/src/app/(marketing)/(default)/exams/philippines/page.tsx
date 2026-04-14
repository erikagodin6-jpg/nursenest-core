import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { BreadcrumbTrail } from "@/components/seo/breadcrumb-trail";
import { FaqJsonLd } from "@/components/seo/faq-json-ld";
import { WebPageJsonLd } from "@/components/seo/seo-json-ld";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { withMarketingLocale } from "@/lib/i18n/marketing-path";
import { HUB, RN, loginWithCallback } from "@/lib/marketing/marketing-entry-routes";
import { simpleMarketingBreadcrumbs } from "@/lib/seo/breadcrumb-resolver";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { buildMarketingWebPageJsonLdProps } from "@/lib/seo/marketing-webpage-jsonld";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";

const PATH = "/exams/philippines";

const PAGE_TITLE =
  "Philippines Nurse Licensure Examination (NLE): Structure, Volume, NCLEX Pathway, and Migration (2026 Guide)";

const PAGE_DESCRIPTION =
  "Guide to the Philippine nursing board exam (NLE nursing): Professional Regulation Commission structure, why candidate volume matters, how Philippine nursing education connects to NCLEX-RN preparation, and migration steps toward the United States and Canada. Includes NurseNest practice links, language options, and a deep article series.";

const FAQ_ITEMS = [
  {
    question: "What is the Philippines nursing board exam?",
    answer:
      "In common search language, people mean the Nurse Licensure Examination (NLE) administered under the Professional Regulation Commission (PRC) for the practice of nursing in the Philippines. It is the national licensure examination Filipino nursing graduates must pass to become registered nurses in the Philippines, subject to current PRC and Board of Nursing rules.",
  },
  {
    question: "What does NLE nursing cover?",
    answer:
      "The examination is organized around professional nursing competencies aligned to Philippine nursing education and regulatory expectations. Domains typically span major clinical and community areas (for example medical-surgical, maternal-child, community health, mental health, and related foundations). Always read the latest PRC bulletin and table of specifications for your testing window because blueprints can be updated.",
  },
  {
    question: "Why is Philippine NLE candidate volume so high?",
    answer:
      "The Philippines trains a very large cohort of nursing students each year relative to domestic job openings, and nursing remains a major export profession. That combination produces high annual sit volumes for the NLE and strong competition for domestic acute-care roles, which is why many graduates plan international pathways early.",
  },
  {
    question: "Is the Philippine NLE the same as NCLEX?",
    answer:
      "No. NCLEX-RN is the United States (and Canadian RN) regulatory examination for registered nurse licensure in those jurisdictions. The Philippine NLE validates entry to practice under Philippine law. Many nurses take the NLE first, then pursue CGFNS, English tests, credential review, and NCLEX-RN as separate steps for US or Canadian registration.",
  },
  {
    question: "How do Philippine nurses prepare for NCLEX after the NLE?",
    answer:
      "After Philippine licensure, NCLEX preparation is usually a dedicated phase: confirm eligibility with a US state board of nursing or a Canadian provincial college, complete international credential steps where required, schedule NCLEX-RN, and train using NCLEX-style clinical judgment practice. NurseNest provides NCLEX-aligned lessons and question banks for that phase rather than a duplicate of PRC bulletin content.",
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
        robots: { index: true, follow: true },
        keywords: [
          "Philippines nursing board exam",
          "NLE nursing",
          "Nurse Licensure Examination Philippines",
          "PRC nursing exam",
          "Philippine Board of Nursing",
          "NCLEX after Philippines nursing",
          "Filipino nurse migration Canada",
          "Filipino nurse migration United States",
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
      routeGroup: "marketing.default.examsPhilippines",
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

export default function PhilippinesLicensingExamsPage() {
  const { crumbs, schemaItems } = simpleMarketingBreadcrumbs("Philippines licensing exams", PATH);
  const tagalogPricing = withMarketingLocale("tl", HUB.pricing);
  const tagalogLessons = withMarketingLocale("tl", HUB.examLessons);

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
            If you are searching for the <strong>Philippines nursing board exam</strong> or <strong>NLE nursing</strong>{" "}
            information, this hub explains how the national licensure examination fits into Philippine training, why
            candidate volumes are high, how that connects to NCLEX-RN preparation, and what migration toward the United
            States or Canada typically involves. It also shows how to pair NurseNest&apos;s NCLEX-aligned banks with study in
            English or Tagalog marketing locales.
          </p>

          <section className="mt-12" aria-labelledby="structure">
            <h2 id="structure" className="nn-marketing-h2">
              Structure: PRC, Board of Nursing, and the NLE
            </h2>
            <p>
              Nursing licensure in the Philippines sits under the{" "}
              <strong>Professional Regulation Commission (PRC)</strong> and the{" "}
              <strong>Professional Regulatory Board of Nursing</strong>. The{" "}
              <strong>Nurse Licensure Examination (NLE)</strong> is the national examination that validates
              entry-to-practice competence for Filipino nursing graduates under current rules. Examination design follows
              published professional standards and a table of specifications that groups content into major nursing
              domains rather than a single narrow topic list.
            </p>
            <p>
              <strong>What to expect at a high level:</strong> items typically reward safe nursing judgment across
              foundational sciences, adult health, maternal and child health, community-oriented nursing, mental health,
              leadership and ethical practice, and research literacy, expressed in ways that match Philippine nursing
              curricula. Administrative details (exact subject weights, testing dates, and retake policies) belong to the
              official PRC bulletin for your cohort.
            </p>
            <p>
              <strong>Not legal advice:</strong> NurseNest does not administer the NLE and cannot interpret PRC
              eligibility for you. Use this page for orientation, then anchor your plan in primary sources from the PRC and
              your school.
            </p>
          </section>

          <section className="mt-12" aria-labelledby="volume">
            <h2 id="volume" className="nn-marketing-h2">
              High-volume candidates and workforce context
            </h2>
            <p>
              Philippine nursing programs graduate very large classes each year. When domestic hospital hiring cannot
              absorb every new registrant at once, many candidates experience intense competition for prized training slots
              and staff lines. That structural pressure is one reason the <strong>NLE nursing</strong> cohort feels
              high-stakes: the examination is both a licensure gate and a sorting mechanism for early career opportunities.
            </p>
            <p>
              International migration is also part of the landscape. Filipino nurses are sought after in many health
              systems, which means a meaningful share of graduates will eventually pursue foreign registration. Treating
              NLE preparation as the foundation, then layering NCLEX-style training once you aim at a US or Canadian
              licence, keeps your study honest: you master Philippine regulatory expectations first, then specialise for
              the next regulator.
            </p>
          </section>

          <section className="mt-12" aria-labelledby="scope-banks">
            <h2 id="scope-banks" className="nn-marketing-h2">
              Exam scope and NurseNest test banks (NCLEX-aligned)
            </h2>
            <p>
              NurseNest does not replicate proprietary NLE item banks. Instead, our{" "}
              <ProseLink href={HUB.questionBank}>question bank</ProseLink> and pathway lessons are built for{" "}
              <strong>NCLEX-RN clinical judgment</strong> and related North American scopes. The overlap is conceptual:
              pathophysiology, pharmacology, prioritisation, therapeutic communication, and safety systems appear across
              many nursing regulatory exams, even when item formats differ.
            </p>
            <p>
              <strong>Practical workflow:</strong> use PRC materials for NLE-specific rules and blueprint fidelity. When
              you are ready for NCLEX-RN, shift heavy time into{" "}
              <ProseLink href={RN.usLessons}>US NCLEX-RN lessons</ProseLink>,{" "}
              <ProseLink href={RN.usQuestions}>US practice questions</ProseLink>, and the parallel{" "}
              <ProseLink href={RN.caLessons}>Canada NCLEX-RN lessons</ProseLink> /{" "}
              <ProseLink href={RN.caQuestions}>Canada questions</ProseLink> if Canada is your target province.
            </p>
          </section>

          <section className="mt-12" aria-labelledby="nclex-path">
            <h2 id="nclex-path" className="nn-marketing-h2">
              Pathway from Philippine licensure toward NCLEX-RN
            </h2>
            <p>
              After you pass the <strong>Philippines nursing board exam</strong> and complete local registration steps,
              NCLEX-RN is not automatic. You must satisfy a US state board of nursing or a Canadian provincial college,
              including credential evaluation, English proficiency where required, and eligibility to test. Only then does
              NCLEX-RN become the national examination that supports RN licensure in that jurisdiction.
            </p>
            <ol className="mt-4 list-decimal space-y-3 pl-6">
              <li>
                <strong>Clarify target regulator:</strong> pick a state or province early because paperwork and timelines
                differ.
              </li>
              <li>
                <strong>Credential pathway:</strong> complete CGFNS or other evaluation steps your board requires before
                an ATT (Authorization to Test) or Canadian equivalent.
              </li>
              <li>
                <strong>English tests:</strong> schedule IELTS, PTE, or TOEFL where mandated; do not underestimate lead
                times.
              </li>
              <li>
                <strong>NCLEX training:</strong> use CAT-style practice, remediation loops, and rationales until your
                weak domains stabilise.
              </li>
            </ol>
          </section>

          <section className="mt-12" aria-labelledby="migration">
            <h2 id="migration" className="nn-marketing-h2">
              Migration: Philippines to the United States or Canada
            </h2>
            <h3 className="nn-marketing-h3 mt-6">United States</h3>
            <p>
              US pathways for internationally educated nurses usually combine CGFNS certification services (for example
              VisaScreen where applicable), state board requirements, background checks, and NCLEX-RN. Employers and visa
              categories add another layer that sits outside nursing examinations. NurseNest supports the{" "}
              <strong>clinical knowledge and judgment</strong> portion of that journey through NCLEX-aligned practice, not
              immigration legal advice.
            </p>
            <h3 className="nn-marketing-h3 mt-8">Canada</h3>
            <p>
              Canadian RN registration is provincial. Internationally educated nurses often begin with credential
              assessment (commonly through NNAS for many RN streams), then follow the college&apos;s gap requirements,
              English tests, and the NCLEX-RN as the national entry-to-practice examination for registered nurses. Compare
              provincial timelines before you commit to a job offer or relocation plan.
            </p>
          </section>

          <section className="mt-12" aria-labelledby="languages">
            <h2 id="languages" className="nn-marketing-h2">
              Study in the languages you use day to day
            </h2>
            <p>
              NurseNest&apos;s marketing shell supports multiple locales. English remains the primary study language for
              NCLEX-RN content inside the product, but you can browse pricing, lessons landing, and other marketing pages in{" "}
              <strong>Tagalog</strong> where translations exist: try{" "}
              <ProseLink href={tagalogPricing}>Tagalog pricing</ProseLink> and{" "}
              <ProseLink href={tagalogLessons}>Tagalog lessons entry</ProseLink>. Many Filipino candidates mix English
              study materials with Tagalog note-taking or peer groups; both are compatible with a disciplined NCLEX plan.
            </p>
            <p>
              Cebuano, Ilocano, Hiligaynon, and other regional languages are widely spoken in the Philippines. NurseNest
              does not yet offer full product UI translation for every regional language, but you can still pair English
              NCLEX lessons with study groups in your preferred spoken language while keeping clinical terminology in
              English for exam alignment.
            </p>
          </section>

          <section className="mt-12" aria-labelledby="blog-series">
            <h2 id="blog-series" className="nn-marketing-h2">
              Long-form articles: Philippines nursing board exam and NLE nursing series
            </h2>
            <p>
              We publish an extensive educational series covering <strong>NLE nursing</strong> context, clinical domains,
              NCLEX bridges, and migration planning. Start with the tag page for structured reading.
            </p>
            <p className="mt-4">
              <ProseLink href="/blog/tag/philippines-nle">Browse philippines-nle articles</ProseLink>
            </p>
          </section>

          <section className="mt-12" aria-labelledby="internal">
            <h2 id="internal" className="nn-marketing-h2">
              Practice and study links on NurseNest
            </h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <ProseLink href={HUB.questionBank}>Question bank hub</ProseLink> for NCLEX-style practice.
              </li>
              <li>
                <ProseLink href={RN.usQuestions}>US NCLEX-RN questions</ProseLink> and{" "}
                <ProseLink href={RN.caQuestions}>Canada NCLEX-RN questions</ProseLink>.
              </li>
              <li>
                <ProseLink href={HUB.examLessons}>Clinical lessons library</ProseLink>.
              </li>
              <li>
                <ProseLink href={loginWithCallback("/app/study-plan")}>Study plan</ProseLink> after sign-in.
              </li>
              <li>
                <ProseLink href="/blog">Blog index</ProseLink>.
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
            style={{ background: "color-mix(in srgb, var(--semantic-panel-cool) 8%, var(--semantic-surface))" }}
          >
            <p className="nn-marketing-h3 !mt-0">Next step</p>
            <p className="mt-2 text-[var(--theme-muted-text)]">
              Read the article series, align PRC requirements for your NLE window, then invest in NCLEX-aligned practice
              when your target board clears you to test.
            </p>
            <p className="mt-4">
              <ProseLink href="/blog/tag/philippines-nle">Open the Philippines NLE article hub</ProseLink>
            </p>
          </aside>
        </article>
      </div>
    </>
  );
}
