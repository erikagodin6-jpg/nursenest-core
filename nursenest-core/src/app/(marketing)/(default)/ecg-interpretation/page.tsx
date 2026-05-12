import type { Metadata } from "next";
import Link from "next/link";
import { Activity, BookOpen, Gauge, Zap } from "lucide-react";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";

export const revalidate = 86400;

const PATH = "/ecg-interpretation";
const PAGE_TITLE = "ECG Interpretation for Nurses — RN and NP Telemetry Training | NurseNest";
const PAGE_H1 = "ECG interpretation training for RN and NP learners";
const PAGE_DESCRIPTION =
  "Rhythm recognition, telemetry drills, and clinical reasoning for registered nurses and nurse practitioners. Integrated with your NurseNest pathway — lessons, quizzes, and adaptive practice.";

const FAQ_ITEMS = [
  {
    question: "What is included in the NurseNest ECG module?",
    answer:
      "The NurseNest ECG module includes basic and advanced tracks. Basic ECG covers rhythm recognition foundations, strip interpretation lessons, quiz banks, and printable worksheets. Advanced ECG covers clinical scenarios, high-acuity telemetry, medication-ECG integration, and ACLS-relevant rhythm progression. Both tracks use deterministic ECG strip illustrations and include rationale-rich questions.",
  },
  {
    question: "Is ECG included with my RN or NP subscription?",
    answer:
      "Core ECG (Basic track) is included with eligible RN and NP base subscriptions. Advanced ECG is a separate paid add-on module and is not included with standard subscriptions. RPN/PN pathways do not include ECG access.",
  },
  {
    question: "How does NurseNest ECG training differ from a standalone simulator?",
    answer:
      "NurseNest ECG learning is woven into your existing study loop rather than requiring a separate platform. Strip questions are integrated with your question bank weak-area tracking, flashcards, and adaptive practice — so telemetry gaps surface in the same place as all other clinical gaps. This is intentional: ECG literacy is a clinical reasoning skill, not an isolated technical competency.",
  },
  {
    question: "Can NPs access the Advanced ECG module?",
    answer:
      "Yes. Advanced ECG is available to both RN and NP learners as a separate add-on purchase. NP learners benefit from the advanced clinical context — including scenario-based differential reasoning and medication-ECG integration that aligns with NP scope of practice.",
  },
  {
    question: "What rhythms are covered?",
    answer:
      "The core module covers sinus rhythms, atrial arrhythmias (AFib, flutter, SVT), ventricular rhythms (VT, VF, PVCs), AV blocks, paced rhythms, electrolyte effects (hyperkalemia, hypokalemia), and STEMI pattern recognition. The advanced module adds ACLS progression, clinical scenarios, and medication-ECG safety questions.",
  },
];

const SECTIONS = [
  {
    id: "ecg-basics-nurses",
    heading: "ECG basics for nurses: rhythm recognition and strip interpretation",
    body: (
      <>
        <p>
          Telemetry competency is a foundational expectation across emergency, critical care, step-down,
          cardiac, and medical-surgical nursing practice. Rhythm recognition requires pattern literacy —
          knowing what organized versus disorganized ventricular activity looks like, how AV conduction
          delays present across different block types, and when a rhythm demands immediate escalation
          versus watchful assessment.
        </p>
        <p>
          NurseNest Basic ECG covers the core recognition curriculum: sinus rhythms and rate variants,
          supraventricular arrhythmias including atrial fibrillation and flutter, ventricular rhythms
          including VT and VF, AV conduction blocks from first-degree through complete heart block, and
          ectopic beats. Lessons use deterministic ECG strip illustrations purpose-built for nursing
          education — not deidentified clinical tracings — which allows consistent, repeatable learning
          without ambiguity.
        </p>
        <p>
          Quizzes include immediate rationale review. Every answer explanation connects strip features to
          clinical significance — not just "this is AFib" but why the irregularly irregular pattern matters
          for stroke risk assessment, rate control goals, and nursing monitoring priorities. This clinical
          framing is what separates memorization of rhythm labels from the judgment that actual clinical
          environments require.
        </p>
      </>
    ),
  },
  {
    id: "advanced-ecg-np-rn",
    heading: "Advanced ECG for RN and NP: clinical scenarios and telemetry mastery",
    body: (
      <>
        <p>
          The Advanced ECG add-on module is designed for learners who need to move past rhythm labeling
          into high-acuity clinical reasoning. Advanced track content covers ACLS-relevant rhythm
          recognition for arrest and peri-arrest scenarios, 12-lead pattern recognition including STEMI
          equivalents and ischemia localization, medication-ECG integration across cardiac drug classes
          and electrolyte abnormalities, and clinical scenario questions that require simultaneous rhythm
          recognition and priority intervention reasoning.
        </p>
        <p>
          For NP learners, Advanced ECG adds the outpatient and primary care perspective: interpreting a
          12-lead in a chest pain evaluation, recognizing when incidental ECG findings require urgent
          referral, and integrating ECG changes into a diagnostic reasoning chain that also includes labs,
          history, and differential formation. This is the clinical depth the CNPLE and NP certification
          examinations (AANP, ANCC) probe through integrated case-based questions.
        </p>
        <p>
          Advanced ECG is a separate paid add-on and is not included in base RN or NP subscriptions.
          Learners who purchase the add-on access the advanced curriculum alongside their existing
          NurseNest study loop — adaptive weak-area tracking, flashcard integration, and progress
          analytics update to include advanced ECG performance.
        </p>
      </>
    ),
  },
  {
    id: "ecg-medication-electrolyte",
    heading: "ECG changes from medications and electrolyte imbalances",
    body: (
      <>
        <p>
          Some of the highest-yield ECG questions in both RN and NP examinations test the intersection
          between ECG pattern recognition and pharmacology or electrolyte physiology. Hyperkalemia
          produces a progression from peaked T waves through QRS widening to sine-wave morphology —
          each stage carrying different clinical urgency. Hypokalemia flattens T waves and accentuates
          U waves, with increasing arrhythmia risk as severity worsens. QT-prolonging medications
          predispose to torsades de pointes, which requires immediate intervention and trigger
          identification rather than rate control alone.
        </p>
        <p>
          NurseNest medication-ECG integration questions are written to probe this reasoning explicitly.
          Rather than asking you to label a rhythm in isolation, questions provide clinical context —
          the patient recently received a loop diuretic, or is on a QT-prolonging antibiotic alongside
          a class III antiarrhythmic — and require you to connect the ECG finding to the management
          priority. This is the format that determines whether a learner holds surface knowledge or
          applies integrated clinical reasoning.
        </p>
      </>
    ),
  },
];

const RELATED_LINKS = [
  { href: "/modules/ecg", label: "ECG Telemetry Hub" },
  { href: "/modules/ecg/basic/lessons", label: "Basic ECG Lessons" },
  { href: "/modules/ecg/basic/quizzes", label: "Basic ECG Quizzes" },
  { href: "/modules/ecg-advanced", label: "Advanced ECG Add-On" },
  { href: "/canada/np/cnple", label: "CNPLE Exam Hub" },
  { href: "/cnple-practice-questions", label: "CNPLE Practice Questions" },
  { href: "/cnple-lab-interpretation", label: "CNPLE Lab Interpretation" },
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
          "ECG interpretation for nurses",
          "nursing telemetry training",
          "rhythm recognition nursing",
          "ECG strip practice RN",
          "NP ECG training",
          "NCLEX ECG questions",
          "CNPLE ECG interpretation",
          "advanced ECG nursing",
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
      routeGroup: "marketing.default.ecgInterpretation",
    },
  );
}

export default function EcgInterpretationPage() {
  const breadcrumbs = [
    { name: "NurseNest", href: "/" },
    { name: "ECG Interpretation", href: PATH },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `https://nursenest.io${PATH}`,
        url: `https://nursenest.io${PATH}`,
        name: PAGE_TITLE,
        description: PAGE_DESCRIPTION,
        inLanguage: "en",
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: breadcrumbs.map((crumb, idx) => ({
            "@type": "ListItem",
            position: idx + 1,
            name: crumb.name,
            item: `https://nursenest.io${crumb.href}`,
          })),
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ_ITEMS.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs text-[var(--semantic-text-muted)]">
            {breadcrumbs.map((crumb, idx) => (
              <li key={crumb.href} className="flex items-center gap-1.5">
                {idx > 0 && <span aria-hidden>/</span>}
                {idx < breadcrumbs.length - 1 ? (
                  <Link href={crumb.href} className="hover:underline">
                    {crumb.name}
                  </Link>
                ) : (
                  <span className="text-[var(--semantic-text-secondary)]">{crumb.name}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <header className="mb-8 space-y-4">
          <div className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--semantic-info)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_08%,var(--semantic-surface))] text-[var(--semantic-info)]">
              <Activity className="h-5 w-5" aria-hidden />
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--semantic-text-muted)]">
              Telemetry Module
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--semantic-text-primary)] sm:text-4xl">
            {PAGE_H1}
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-[var(--semantic-text-secondary)]">
            {PAGE_DESCRIPTION}
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/modules/ecg/basic/lessons"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--role-cta)] px-5 py-2.5 text-sm font-semibold text-[var(--role-cta-foreground)] shadow-[0_2px_10px_var(--role-cta-shadow)]"
            >
              <BookOpen className="h-4 w-4" aria-hidden />
              Start Basic ECG
            </Link>
            <Link
              href="/modules/ecg-advanced"
              className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--semantic-warning)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_08%,var(--semantic-surface))] px-5 py-2.5 text-sm font-semibold text-[color-mix(in_srgb,var(--semantic-warning)_92%,var(--semantic-text-primary))] shadow-[var(--semantic-shadow-soft)]"
            >
              <Zap className="h-4 w-4" aria-hidden />
              Advanced ECG (Add-On)
            </Link>
          </div>
        </header>

        <div className="grid gap-4 sm:grid-cols-3 mb-10">
          {[
            {
              icon: Gauge,
              title: "Basic ECG",
              desc: "Rhythm recognition, strip quizzes, and worksheets for RN and NP learners.",
              href: "/modules/ecg/basic/lessons",
              label: "Open Basic ECG",
              tone: "info" as const,
            },
            {
              icon: Zap,
              title: "Advanced ECG",
              desc: "High-acuity telemetry, scenarios, and ACLS rhythm progression — paid add-on.",
              href: "/modules/ecg-advanced",
              label: "View Advanced ECG",
              tone: "warning" as const,
            },
            {
              icon: Activity,
              title: "ECG Telemetry Hub",
              desc: "All ECG tracks, drills, worksheets, and video-drills in one place.",
              href: "/modules/ecg",
              label: "Open Hub",
              tone: "chart3" as const,
            },
          ].map((card) => {
            const Icon = card.icon;
            const toneWrap =
              card.tone === "info"
                ? "border-[color-mix(in_srgb,var(--semantic-info)_26%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_06%,var(--semantic-surface))]"
                : card.tone === "warning"
                  ? "border-[color-mix(in_srgb,var(--semantic-warning)_26%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_06%,var(--semantic-surface))]"
                  : "border-[color-mix(in_srgb,var(--semantic-chart-3)_26%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-3)_06%,var(--semantic-surface))]";
            const toneIcon =
              card.tone === "info"
                ? "text-[var(--semantic-info)]"
                : card.tone === "warning"
                  ? "text-[var(--semantic-warning)]"
                  : "text-[color-mix(in_srgb,var(--semantic-chart-3)_90%,var(--semantic-text-primary))]";
            return (
              <Link
                key={card.href}
                href={card.href}
                className={`group flex flex-col gap-3 rounded-2xl border p-4 shadow-[var(--semantic-shadow-soft)] transition-shadow hover:shadow-md ${toneWrap}`}
              >
                <Icon className={`h-5 w-5 ${toneIcon}`} aria-hidden />
                <div>
                  <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">{card.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">{card.desc}</p>
                </div>
                <span className={`text-xs font-semibold ${toneIcon} group-hover:underline`}>{card.label} →</span>
              </Link>
            );
          })}
        </div>

        <article className="prose prose-sm max-w-none text-[var(--semantic-text-secondary)] [&_h2]:text-[var(--semantic-text-primary)] [&_h2]:font-semibold [&_h2]:text-xl [&_h2]:mt-8 [&_h2]:mb-3 [&_p]:leading-relaxed [&_p]:mb-4">
          {SECTIONS.map((section) => (
            <section key={section.id} id={section.id}>
              <h2>{section.heading}</h2>
              {section.body}
            </section>
          ))}
        </article>

        <section className="mt-10 space-y-4" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-xl font-semibold text-[var(--semantic-text-primary)]">
            Frequently asked questions
          </h2>
          <dl className="space-y-4">
            {FAQ_ITEMS.map((item) => (
              <div
                key={item.question}
                className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4"
              >
                <dt className="text-sm font-semibold text-[var(--semantic-text-primary)]">{item.question}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        <nav className="mt-10 border-t border-[var(--semantic-border-soft)] pt-6" aria-label="Related pages">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[var(--semantic-text-muted)]">
            Related resources
          </p>
          <ul className="flex flex-wrap gap-2">
            {RELATED_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-1.5 text-xs font-medium text-[var(--semantic-text-secondary)] hover:border-[color-mix(in_srgb,var(--semantic-info)_35%,var(--semantic-border-soft))] hover:text-[var(--semantic-text-primary)]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </main>
    </>
  );
}
