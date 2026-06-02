import type { Metadata } from "next";
import Link from "next/link";
import {
  AcademyBreadcrumbBar,
  ClinicalAcademyJsonLdGraph,
} from "@/components/clinical-academy/clinical-academy-chrome";
import { ecgHubBreadcrumbs } from "@/lib/breadcrumbs/academy-breadcrumbs";
import {
  Activity,
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronRight,
  Crosshair,
  Heart,
  Layers,
  Zap,
} from "lucide-react";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";

export const revalidate = 86400;

const PATH = "/ecg";

const PAGE_TITLE = "ECG Learning Hub for Nurses | NurseNest";

const PAGE_H1 =
  "Master ECG Interpretation for Nursing and Clinical Practice";

const PAGE_DESCRIPTION =
  "Comprehensive ECG education for RN and NP nurses: rhythm recognition, telemetry, ACLS/PALS rhythms, pediatric ECG, STEMI interpretation, and clinical decision-making.";

const SITE_ORIGIN = "https://nursenest.ca";

const FAQ_ITEMS = [
  {
    question:
      "What ECG content is included with an RN or NP subscription?",
    answer:
      "Core ECG (rhythm recognition, strip interpretation, AV blocks, sinus rhythms, atrial and ventricular arrhythmias, paced rhythms) is included with eligible RN and NP base subscriptions. Advanced ECG — which adds STEMI localization, electrolyte effects, medication-ECG integration, ICU telemetry, and clinical case simulations — is a separate paid add-on.",
  },
  {
    question: "Is there pediatric ECG content?",
    answer:
      "Yes. The Pediatric ECG lane covers age-specific rate thresholds, respiratory sinus arrhythmia, SVT vs sinus tachycardia in infants, bradycardia with hypoxia, PALS shockable and non-shockable rhythms, hyperkalemia ECG changes, LQTS and torsades risk, WPW and pre-excitation, and post-operative congenital heart telemetry patterns. Content is clinically reviewed per AHA PALS 2020 guidelines.",
  },
  {
    question: "Does the ECG module cover ACLS and PALS rhythms?",
    answer:
      "Yes. ACLS-relevant rhythms (VF, pulseless VT, asystole, PEA, shockable vs non-shockable, post-ROSC monitoring) and PALS rhythms (pediatric SVT, bradycardia algorithms, VF/pulseless VT in children) are covered in the Advanced ECG and Pediatric ECG tracks respectively.",
  },
  {
    question:
      "How is ECG practice integrated into my NurseNest study loop?",
    answer:
      "ECG questions are integrated with your adaptive weak-area tracking, flashcard system, and progress analytics. Gaps in rhythm interpretation surface in the same study loop as other clinical topics — so telemetry weaknesses are addressed in context, not as isolated skill drills on a separate platform.",
  },
  {
    question:
      "What rhythms are covered in the core ECG module?",
    answer:
      "Sinus rhythms and rate variants, supraventricular arrhythmias (AFib, atrial flutter, SVT), ventricular rhythms (VT, VF, PVCs), AV conduction blocks (first-degree through complete heart block), Mobitz I vs Mobitz II distinction, junctional rhythms, ectopic beats, paced rhythms, and electrolyte-related ECG changes (hyperkalemia, hypokalemia).",
  },
  {
    question:
      "Is NurseNest ECG training appropriate for NCLEX-RN preparation?",
    answer:
      "Yes. ECG and telemetry questions appear on NCLEX-RN, particularly within cardiovascular system, critical care, and pharmacology content. NurseNest ECG training builds the clinical reasoning framework that NCLEX questions probe — not just pattern recognition, but understanding why a rhythm matters and what the nursing priority is.",
  },
  {
    question:
      "Can NPs access Advanced ECG content for CNPLE or NP exam prep?",
    answer:
      "Yes. Advanced ECG is available to NP learners as a separate add-on. NP-relevant content includes 12-lead interpretation in a primary care and outpatient context, recognizing when ECG findings require urgent referral, differential reasoning with ECG integration, and medication-ECG safety relevant to NP prescribing scope.",
  },
];

const CTA_ITEMS = [
  {
    key: "lessons",
    label: "Start ECG Lessons",
    href: "/modules/ecg/basic/lessons",
    description:
      "Systematic rhythm recognition from rate to diagnosis",
    icon: BookOpen,
    tone: "success" as const,
  },
  {
    key: "drills",
    label: "Practice ECG Strips",
    href: "/modules/ecg/basic/quizzes",
    description:
      "Adaptive strip identification drills with rationale",
    icon: Activity,
    tone: "info" as const,
  },
  {
    key: "flashcards",
    label: "ECG Flashcards",
    href: "/flashcards",
    description:
      "Spaced-repetition rhythm and interval review",
    icon: Brain,
    tone: "chart3" as const,
  },
  {
    key: "acls",
    label: "ACLS/PALS Rhythms",
    href: "/advanced-ecg-nursing/acls-rhythms",
    description:
      "Shockable vs non-shockable, arrest rhythm management",
    icon: Crosshair,
    tone: "brand" as const,
  },
  {
    key: "advanced",
    label: "Advanced ECG",
    href: "/advanced-ecg-nursing",
    description:
      "STEMI, electrolytes, ICU telemetry, hemodynamic correlation",
    icon: Layers,
    tone: "warning" as const,
  },
  {
    key: "pediatric",
    label: "Pediatric ECG",
    href: "/advanced-ecg-nursing/pediatric-ecg",
    description:
      "PALS rhythms, SVT in infants, LQTS, congenital heart",
    icon: Heart,
    tone: "chart4" as const,
  },
];

const TONE_CLASSES: Record<
  (typeof CTA_ITEMS)[number]["tone"],
  string
> = {
  success:
    "border-[color-mix(in_srgb,var(--semantic-success)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_08%,var(--semantic-surface))] hover:bg-[color-mix(in_srgb,var(--semantic-success)_14%,var(--semantic-surface))]",
  info:
    "border-[color-mix(in_srgb,var(--semantic-info)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_08%,var(--semantic-surface))] hover:bg-[color-mix(in_srgb,var(--semantic-info)_14%,var(--semantic-surface))]",
  chart3:
    "border-[color-mix(in_srgb,var(--semantic-chart-3)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-3)_08%,var(--semantic-surface))] hover:bg-[color-mix(in_srgb,var(--semantic-chart-3)_14%,var(--semantic-surface))]",
  brand:
    "border-[color-mix(in_srgb,var(--semantic-brand)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_08%,var(--semantic-surface))] hover:bg-[color-mix(in_srgb,var(--semantic-brand)_14%,var(--semantic-surface))]",
  warning:
    "border-[color-mix(in_srgb,var(--semantic-warning)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_08%,var(--semantic-surface))] hover:bg-[color-mix(in_srgb,var(--semantic-warning)_14%,var(--semantic-surface))]",
  chart4:
    "border-[color-mix(in_srgb,var(--semantic-chart-4)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-4)_08%,var(--semantic-surface))] hover:bg-[color-mix(in_srgb,var(--semantic-chart-4)_14%,var(--semantic-surface))]",
};

const TONE_ICON_CLASSES: Record<
  (typeof CTA_ITEMS)[number]["tone"],
  string
> = {
  success: "text-[var(--semantic-success)]",
  info: "text-[var(--semantic-info)]",
  chart3: "text-[var(--semantic-chart-3)]",
  brand: "text-[var(--semantic-brand)]",
  warning: "text-[var(--semantic-warning-contrast)]",
  chart4: "text-[var(--semantic-chart-4)]",
};

const COVERAGE_CORE = [
  "Systematic 8-step ECG interpretation method",
  "Sinus rhythms: normal, tachycardia, bradycardia, arrhythmia",
  "Atrial fibrillation — rate, rhythm irregularity, stroke risk",
  "Atrial flutter with variable block",
  "SVT: types, vagal maneuver context, adenosine rationale",
  "PVCs: uniform vs multifocal, R-on-T risk",
  "Ventricular tachycardia: Brugada 4-step WCT algorithm",
  "Ventricular fibrillation: recognition and ACLS initiation",
  "First-degree AV block",
  "Mobitz I (Wenckebach): pattern, clinical significance",
  "Mobitz II: clinical urgency, pacemaker indication",
  "Complete (third-degree) heart block: escape rhythm recognition",
  "Paced rhythms: sensing, capture, pacemaker spikes",
  "Hyperkalemia ECG progression: peaked T → wide QRS → sine wave",
  "Hypokalemia: U waves, T-wave flattening, arrhythmia risk",
  "QT interval measurement and QTc calculation",
];

const COVERAGE_ADVANCED = [
  "12-lead ECG: lead placement, territory, axis interpretation",
  "STEMI localization by territory (inferior, anterior, lateral, posterior)",
  "De Winter T-waves: LAD occlusion without ST elevation",
  "Wellens syndrome: reperfused proximal LAD critical stenosis",
  "Posterior STEMI: dominant R in V2, ST depression V1–V3",
  "Right ventricular MI: V4R, fluid management implications",
  "Bundle branch block: LBBB, RBBB morphology and SGARBOSSA",
  "QT prolongation: torsades de pointes risk and prevention",
  "Digoxin toxicity: bigeminal PVCs, bidirectional VT",
  "TCA overdose: terminal R in aVR, sodium bicarbonate rationale",
  "Brugada pattern: type 1 coved ST vs type 2 saddle-back",
  "Electrical alternans: cardiac tamponade recognition",
  "WPW: delta wave, pre-excitation, AF-with-WPW risk",
  "ICU telemetry: artifact, ischemia monitoring, alarm fatigue",
  "Pacemaker malfunction: failure to capture vs undersensing",
  "Hemodynamic correlation: rhythm-to-bedside assessment integration",
];

const CLUSTER_LINKS = [
  { slug: "sinus-rhythm", label: "Sinus Rhythm" },
  { slug: "atrial-fibrillation", label: "Atrial Fibrillation" },
  { slug: "svt", label: "SVT" },
  { slug: "ventricular-tachycardia", label: "Ventricular Tachycardia" },
  { slug: "stemi-localization", label: "STEMI Localization" },
  { slug: "heart-blocks", label: "Heart Blocks" },
  { slug: "qt-prolongation", label: "QT Prolongation" },
  { slug: "hyperkalemia-ecg", label: "Hyperkalemia ECG" },
  { slug: "pacemaker-rhythms", label: "Pacemaker Rhythms" },
  { slug: "ecg-leads-explained", label: "ECG Leads Explained" },
];

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(
    async () => {
      const alt = marketingAlternatesSharedPage(
        DEFAULT_MARKETING_LOCALE,
        PATH,
      );

      return {
        title: PAGE_TITLE,
        description: PAGE_DESCRIPTION,

        keywords: [
          "ECG interpretation for nurses",
          "telemetry nursing",
          "ACLS rhythms",
          "PALS rhythms",
          "12 lead ECG",
          "STEMI interpretation",
          "arrhythmia recognition",
          "ECG nursing course",
          "pediatric ECG",
          "critical care ECG",
        ],

        alternates: {
          canonical: alt.canonical,
          languages: alt.languages,
        },

        robots: {
          index: true,
          follow: true,
        },

        openGraph: {
          title: PAGE_TITLE,
          description: PAGE_DESCRIPTION,
          url: `${SITE_ORIGIN}${PATH}`,
          type: "website",
        },

        twitter: {
          card: "summary_large_image",
          title: PAGE_TITLE,
          description: PAGE_DESCRIPTION,
        },
      };
    },
    {
      title: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
      robots: {
        index: true,
        follow: true,
      },
    },
  );
}

export default function EcgHubPage() {
  const breadcrumbs = ecgHubBreadcrumbs();
  const jsonLdGraph = [
    {
      "@type": "WebPage",
      "@id": `${SITE_ORIGIN}${PATH}#webpage`,
      url: `${SITE_ORIGIN}${PATH}`,
      name: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
      inLanguage: "en-CA",
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_ORIGIN}${PATH}#faq`,
      mainEntity: FAQ_ITEMS.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
  ];

  return (
    <main className="bg-[var(--semantic-page-bg)] text-[var(--semantic-text-primary)]">
      <ClinicalAcademyJsonLdGraph graph={jsonLdGraph} />
      <section className="border-b border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)]">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <AcademyBreadcrumbBar resolution={breadcrumbs} pathname={PATH} />
          <div className="grid gap-8 lg:grid-cols-[1fr_340px] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-[var(--semantic-brand)]">
                ECG academy
              </p>
              <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
                {PAGE_H1}
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--semantic-text-secondary)]">
                {PAGE_DESCRIPTION}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/modules/ecg/basic/lessons"
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--semantic-brand)] px-5 py-3 text-sm font-semibold text-white"
                >
                  Start ECG lessons
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                <Link
                  href="/advanced-ecg-nursing"
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--semantic-border-soft)] px-5 py-3 text-sm font-semibold text-[var(--semantic-text-primary)]"
                >
                  Explore advanced ECG
                  <Zap className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            </div>
            <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface-raised)] p-5">
              <h2 className="text-base font-semibold">Integrated study loop</h2>
              <ul className="mt-4 space-y-3 text-sm text-[var(--semantic-text-secondary)]">
                {[
                  "Rhythm recognition",
                  "Clinical reasoning",
                  "Adaptive practice",
                  "Flashcard reinforcement",
                ].map((item) => (
                  <li key={item} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-4 py-10 sm:px-6 md:grid-cols-2 lg:grid-cols-3 lg:px-8">
        {CTA_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.key}
              href={item.href}
              className={`rounded-2xl border p-5 transition ${TONE_CLASSES[item.tone]}`}
            >
              <Icon className={`h-5 w-5 ${TONE_ICON_CLASSES[item.tone]}`} aria-hidden />
              <h2 className="mt-4 text-lg font-semibold">{item.label}</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--semantic-text-secondary)]">
                {item.description}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold">
                Open
                <ChevronRight className="h-4 w-4" aria-hidden />
              </span>
            </Link>
          );
        })}
      </section>

      <section className="border-y border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)]">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:px-8">
          <CoverageList title="Core ECG coverage" items={COVERAGE_CORE} />
          <CoverageList title="Advanced ECG coverage" items={COVERAGE_ADVANCED} />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold">ECG topic clusters</h2>
        <div className="mt-5 flex flex-wrap gap-3">
          {CLUSTER_LINKS.map((link) => (
            <Link
              key={link.slug}
              href={`/ecg/${link.slug}`}
              className="rounded-full border border-[var(--semantic-border-soft)] px-4 py-2 text-sm font-semibold text-[var(--semantic-text-secondary)] hover:text-[var(--semantic-text-primary)]"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

function CoverageList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h2 className="text-xl font-bold">{title}</h2>
      <ul className="mt-4 space-y-2 text-sm leading-6 text-[var(--semantic-text-secondary)]">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
