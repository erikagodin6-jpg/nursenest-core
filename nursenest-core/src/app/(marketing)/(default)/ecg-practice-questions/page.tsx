import type { Metadata } from "next";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Gauge,
  Zap,
} from "lucide-react";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";

export const revalidate = 86400;

const PATH = "/ecg-practice-questions";
const PAGE_TITLE = "ECG Practice Questions for Nurses — Strip-Based Rhythm Drills | NurseNest";
const PAGE_H1 = "ECG practice questions for nurses: strip-based rhythm drills, ACLS scenarios, and clinical reasoning";
const PAGE_DESCRIPTION =
  "200+ ECG practice questions for RN and NP nurses: strip-based rhythm recognition, 12-lead interpretation, ACLS/PALS scenarios, adaptive weak-area tracking, and mechanism-based rationales for NCLEX and clinical telemetry.";

const SITE_ORIGIN = "https://nursenest.ca";

const QUESTION_CATEGORIES = [
  {
    icon: Activity,
    title: "Rhythm Recognition",
    count: "60+",
    description: "Strip-based rhythm identification across all major rhythms: sinus, atrial, AV blocks, ventricular, and arrest rhythms.",
    sampleTopics: ["Sinus tachycardia vs SVT", "AFib vs atrial flutter", "VT vs SVT with aberrancy", "Mobitz I vs Mobitz II", "PEA vs organized rhythm"],
  },
  {
    icon: Gauge,
    title: "12-Lead Interpretation",
    count: "50+",
    description: "STEMI localization, STEMI equivalents, posterior MI, ischemia patterns, and electrolyte ECG changes.",
    sampleTopics: ["Inferior STEMI with RV involvement", "Posterior STEMI recognition", "De Winter T-waves", "Hyperkalemia progression", "QT prolongation + torsades risk"],
  },
  {
    icon: Zap,
    title: "ACLS Integration",
    count: "40+",
    description: "Shockable vs non-shockable arrest rhythms, cardioversion indications, defibrillation energy, and algorithm decision branches.",
    sampleTopics: ["VF vs asystole: defibrillation decision", "Synchronized vs unsynchronized", "PEA reversible causes (6Hs/5Ts)", "Post-ROSC monitoring priorities"],
  },
  {
    icon: ClipboardList,
    title: "Clinical Scenarios",
    count: "50+",
    description: "Multi-step clinical vignettes requiring rhythm interpretation integrated with nursing response, medication decisions, and escalation priorities.",
    sampleTopics: ["AFib with RVR: anticoagulation timing", "Complete heart block: pacing urgency", "WPW + rapid AFib contraindications", "Pacemaker malfunction identification"],
  },
];

const APPROACH_STEPS = [
  {
    step: "1",
    title: "See the strip first",
    body: "The ECG strip is presented before the clinical question. Analyze what you see before reading the question stem — this trains the systematic habit, not just answer selection.",
  },
  {
    step: "2",
    title: "Apply the 7-step method",
    body: "Rate → Rhythm → P waves → PR interval → QRS width → ST/T changes → Diagnosis. The scaffold guides each step without showing the answer.",
  },
  {
    step: "3",
    title: "Submit, then see the rationale",
    body: "Answers are hidden until submission. After submitting, the full mechanism-based explanation reveals why the correct answer is right AND why each distractor is clinically wrong.",
  },
  {
    step: "4",
    title: "Adaptive weak-area tracking",
    body: "Missed ECG questions feed into your adaptive weak-area queue. The system resurfaces ECG questions in the context of your overall clinical gaps — so telemetry deficits surface alongside pharmacology and pathophysiology.",
  },
];

const HIGH_YIELD_TOPICS = [
  "Posterior STEMI: ST depression V1–V3 mimicking NSTEMI",
  "Mobitz II: constant PR before dropped beat (not Wenckebach)",
  "VT vs SVT with aberrancy: Brugada criteria, AV dissociation",
  "WPW + AFib: adenosine contraindicated for sustained rapid preexcited response",
  "Pacemaker failure to capture: spikes without following QRS",
  "Hyperkalemia sine wave: calcium first, before electrical therapy",
  "PEA: pulse check mandatory — ECG alone never diagnoses PEA",
  "2:1 AV block: QRS width discriminates Mobitz I from II",
  "Torsades: short-long-short initiating sequence, QT context",
  "Electrical alternans: cardiac tamponade, not RSA",
];

const FAQ_ITEMS = [
  {
    question: "What types of ECG practice questions are included?",
    answer:
      "Four categories: (1) Rhythm recognition — strip-based identification of sinus rhythms, atrial arrhythmias, AV blocks, ventricular rhythms, and arrest rhythms. (2) 12-lead interpretation — STEMI localization, posterior MI, De Winter T-waves, Wellens syndrome, electrolyte changes. (3) ACLS integration — shockable vs non-shockable, cardioversion thresholds, defibrillation energy, post-ROSC priorities. (4) Clinical scenarios — multi-step vignettes requiring rhythm interpretation plus clinical judgment: medication decisions, escalation priorities, nursing response sequencing.",
  },
  {
    question: "How are ECG practice questions different from regular NCLEX questions?",
    answer:
      "Most NCLEX ECG questions describe the rhythm in text (e.g., 'a patient has a heart rate of 150 with irregular rhythm'). NurseNest ECG practice questions present an actual ECG strip or deterministic waveform alongside the clinical vignette — requiring visual pattern recognition, not just reading a description. This matches both real clinical telemetry practice and the increasing use of ECG-embedded questions on NCLEX and CNPLE examinations.",
  },
  {
    question: "What is the most commonly missed pattern on ECG nursing exams?",
    answer:
      "Posterior STEMI is the most commonly missed pattern on both nursing examinations and clinical telemetry. On the standard 12-lead ECG, posterior STEMI shows ST DEPRESSION in V1–V3 (not elevation), because those leads are recording the electrically opposite view of the posterior wall. This is routinely misidentified as subendocardial ischemia or NSTEMI — missing that it requires emergent cath lab activation. Any patient with ST depression in V1–V3 and chest pain requires posterior leads V7–V9 before STEMI is excluded.",
  },
  {
    question: "How many ECG practice questions are in the NurseNest module?",
    answer:
      "The Core ECG module includes 60+ rhythm recognition questions and 40+ ACLS-integrated clinical scenarios. The Advanced ECG add-on adds 200+ questions across nine tracks including 12-lead STEMI/ischemia, electrolytes, pacemaker malfunction, medication-ECG interactions, and critical-care scenarios. All questions include strip-based media and detailed mechanism-based rationales.",
  },
  {
    question: "Are ECG practice questions included with my RN or NP subscription?",
    answer:
      "Core ECG practice questions (rhythm recognition, ACLS basics, AV blocks, sinus rhythms, atrial and ventricular arrhythmias, paced rhythms) are included with eligible RN and NP base subscriptions. Advanced ECG questions (STEMI localization, complex arrhythmias, pacemaker malfunction, electrolyte changes, medication-ECG effects, ICU scenarios) are in the separate Advanced ECG add-on.",
  },
  {
    question: "How do ECG practice questions integrate with adaptive weak-area tracking?",
    answer:
      "NurseNest's adaptive system tracks your performance by clinical category — including ECG topics. Missed ECG questions surface in your personalized weak-area queue alongside other clinical gaps. If you're weak on AV block interpretation, those questions will appear more frequently until your accuracy improves. This integration means ECG literacy is built in the context of your entire study loop, not siloed into a separate practice bank.",
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
          "ECG practice questions nurses",
          "ECG practice questions nursing",
          "cardiac rhythm practice questions",
          "ECG strip practice nursing",
          "ACLS rhythm practice questions",
          "ECG practice NCLEX nursing",
          "ECG quiz nursing",
          "telemetry practice questions nurses",
        ],
        openGraph: {
          title: PAGE_TITLE,
          description: PAGE_DESCRIPTION,
          type: "website",
          url: `${SITE_ORIGIN}${PATH}`,
        },
      };
    },
    {
      title: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
      robots: { index: true, follow: true },
    },
  );
}

export default function EcgPracticeQuestionsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "NurseNest", item: SITE_ORIGIN },
          { "@type": "ListItem", position: 2, name: "ECG Interpretation", item: `${SITE_ORIGIN}/ecg` },
          { "@type": "ListItem", position: 3, name: "ECG Practice Questions", item: `${SITE_ORIGIN}${PATH}` },
        ],
      },
      {
        "@type": "Course",
        name: "ECG Practice Questions for Nurses",
        description: PAGE_DESCRIPTION,
        provider: { "@type": "Organization", name: "NurseNest", url: SITE_ORIGIN },
        hasCourseInstance: {
          "@type": "CourseInstance",
          courseMode: "online",
          courseWorkload: "200+ practice questions",
        },
        educationalLevel: "Professional",
        teaches: ["Cardiac rhythm recognition", "12-lead ECG interpretation", "ACLS algorithm integration"],
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ_ITEMS.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-xs text-[var(--semantic-text-muted)]" aria-label="Breadcrumb">
        <Link href="/ecg" className="hover:text-[var(--semantic-brand)]">ECG Interpretation</Link>
        <ChevronRight className="h-3 w-3" aria-hidden />
        <span className="text-[var(--semantic-text-primary)] font-medium">ECG Practice Questions</span>
      </nav>

      {/* Header */}
      <header className="mb-10">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--semantic-brand)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_06%,var(--semantic-surface))] px-3 py-1 text-xs font-semibold text-[var(--semantic-brand)]">
          <Activity className="h-3.5 w-3.5" aria-hidden />
          200+ Strip-Based Practice Questions
        </div>
        <h1 className="mb-4 text-3xl font-bold leading-tight text-[var(--semantic-text-primary)] sm:text-4xl">
          {PAGE_H1}
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-[var(--semantic-text-secondary)]">
          ECG practice questions built for clinical mastery, not just exam pattern-matching.
          Strip-based rhythm identification, 12-lead interpretation, and ACLS-integrated clinical
          scenarios — with mechanism-based rationales explaining the why behind every answer.
        </p>
      </header>

      {/* Question categories */}
      <section className="mb-12" aria-labelledby="categories-heading">
        <h2 id="categories-heading" className="mb-6 text-2xl font-bold text-[var(--semantic-text-primary)]">
          ECG practice question categories
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {QUESTION_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <div key={cat.title} className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-[var(--semantic-brand)]" aria-hidden />
                    <h3 className="font-semibold text-[var(--semantic-text-primary)]">{cat.title}</h3>
                  </div>
                  <span className="rounded-full bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--semantic-surface))] px-2.5 py-0.5 text-xs font-bold text-[var(--semantic-brand)]">
                    {cat.count} questions
                  </span>
                </div>
                <p className="mb-3 text-sm text-[var(--semantic-text-secondary)]">{cat.description}</p>
                <ul className="space-y-1">
                  {cat.sampleTopics.map((t) => (
                    <li key={t} className="flex items-start gap-1.5 text-xs text-[var(--semantic-text-muted)]">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[var(--semantic-text-muted)]" aria-hidden />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="mb-12" aria-labelledby="approach-heading">
        <h2 id="approach-heading" className="mb-6 text-2xl font-bold text-[var(--semantic-text-primary)]">
          How NurseNest ECG practice works
        </h2>
        <ol className="space-y-4">
          {APPROACH_STEPS.map((step) => (
            <li key={step.step} className="flex items-start gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--semantic-brand)] text-sm font-bold text-white">
                {step.step}
              </span>
              <div>
                <p className="font-semibold text-[var(--semantic-text-primary)]">{step.title}</p>
                <p className="mt-0.5 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* High-yield topics */}
      <section className="mb-12" aria-labelledby="high-yield-heading">
        <h2 id="high-yield-heading" className="mb-4 text-2xl font-bold text-[var(--semantic-text-primary)]">
          High-yield ECG practice topics
        </h2>
        <p className="mb-4 text-sm text-[var(--semantic-text-secondary)]">
          These patterns appear most frequently on nursing examinations and are most commonly missed
          in clinical telemetry. Focused practice on these topics produces the highest exam and
          clinical performance improvement.
        </p>
        <ul className="grid gap-2 sm:grid-cols-2">
          {HIGH_YIELD_TOPICS.map((topic) => (
            <li key={topic} className="flex items-start gap-2.5 text-sm text-[var(--semantic-text-secondary)]">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-warning-contrast)]" aria-hidden />
              {topic}
            </li>
          ))}
        </ul>
      </section>

      {/* FAQ */}
      <section className="mb-12" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="mb-6 text-2xl font-bold text-[var(--semantic-text-primary)]">
          Frequently asked questions — ECG practice questions
        </h2>
        <div className="space-y-5">
          {FAQ_ITEMS.map((faq) => (
            <div key={faq.question} className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5">
              <h3 className="mb-2 font-semibold text-[var(--semantic-text-primary)]">{faq.question}</h3>
              <p className="text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Internal cluster links */}
      <section className="mb-10" aria-labelledby="topics-heading">
        <h2 id="topics-heading" className="mb-4 text-lg font-semibold text-[var(--semantic-text-primary)]">
          ECG topic deep-dives
        </h2>
        <div className="flex flex-wrap gap-2">
          {[
            { href: "/ecg/ventricular-tachycardia", label: "Ventricular Tachycardia" },
            { href: "/ecg/torsades-de-pointes", label: "Torsades de Pointes" },
            { href: "/ecg/qt-prolongation", label: "QT Prolongation" },
            { href: "/ecg/mobitz-1-vs-mobitz-2", label: "Mobitz I vs Mobitz II" },
            { href: "/ecg/svt-vs-atrial-fibrillation", label: "SVT vs AFib" },
            { href: "/ecg/stemi-localization", label: "STEMI Localization" },
            { href: "/ecg/hyperkalemia-ecg-changes", label: "Hyperkalemia ECG" },
            { href: "/ecg/heart-block-interpretation", label: "Heart Block" },
            { href: "/ecg/ecg-leads-explained", label: "ECG Leads" },
            { href: "/acls-rhythms", label: "ACLS Rhythms" },
            { href: "/telemetry-nursing", label: "Telemetry Nursing" },
            { href: "/advanced-ecg-nursing", label: "Advanced ECG" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-1.5 text-sm font-medium text-[var(--semantic-brand)] hover:bg-[color-mix(in_srgb,var(--semantic-brand)_06%,var(--semantic-surface))]"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-2xl bg-[var(--role-cta)] p-6 sm:p-8" aria-labelledby="cta-heading">
        <h2 id="cta-heading" className="mb-2 text-xl font-bold text-[var(--role-cta-foreground)]">
          Start ECG practice now
        </h2>
        <p className="mb-5 text-sm text-[color-mix(in_srgb,var(--role-cta-foreground)_80%,transparent)]">
          Core ECG practice questions included with eligible RN and NP subscriptions.
          200+ Advanced ECG questions available as a separate add-on.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/modules/ecg/basic/quizzes"
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[var(--role-cta)] shadow-sm"
          >
            <Activity className="h-4 w-4" aria-hidden />
            Start ECG Quizzes
          </Link>
          <Link
            href="/modules/ecg/basic/lessons"
            className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold text-white"
          >
            <BookOpen className="h-4 w-4" aria-hidden />
            ECG Lessons First
          </Link>
          <Link
            href="/advanced-ecg-nursing"
            className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold text-white"
          >
            Advanced ECG
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </section>
    </main>
  );
}
