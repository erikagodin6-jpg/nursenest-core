import type { Metadata } from "next";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Crosshair,
  Heart,
  Layers,
  Stethoscope,
  Zap,
} from "lucide-react";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";

export const revalidate = 86400;

const PATH = "/ecg";
// ≤60 chars
const PAGE_TITLE = "ECG Interpretation for Nurses | NurseNest";
const PAGE_H1 = "Master ECG Interpretation for Nursing and Clinical Practice";
// ≤155 chars
const PAGE_DESCRIPTION =
  "ECG interpretation training for RN and NP nurses: rhythm recognition, ACLS/PALS rhythms, pediatric ECG, telemetry, hemodynamic correlation, and real-world clinical decision-making.";

const SITE_ORIGIN = "https://nursenest.ca";

const FAQ_ITEMS = [
  {
    question: "What ECG content is included with an RN or NP subscription?",
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
    question: "How is ECG practice integrated into my NurseNest study loop?",
    answer:
      "ECG questions are integrated with your adaptive weak-area tracking, flashcard system, and progress analytics. Gaps in rhythm interpretation surface in the same study loop as other clinical topics — so telemetry weaknesses are addressed in context, not as isolated skill drills on a separate platform.",
  },
  {
    question: "What rhythms are covered in the core ECG module?",
    answer:
      "Sinus rhythms and rate variants, supraventricular arrhythmias (AFib, atrial flutter, SVT), ventricular rhythms (VT, VF, PVCs), AV conduction blocks (first-degree through complete heart block), Mobitz I vs Mobitz II distinction, junctional rhythms, ectopic beats, paced rhythms, and electrolyte-related ECG changes (hyperkalemia, hypokalemia).",
  },
  {
    question: "Is NurseNest ECG training appropriate for NCLEX-RN preparation?",
    answer:
      "Yes. ECG and telemetry questions appear on NCLEX-RN, particularly within cardiovascular system, critical care, and pharmacology content. NurseNest ECG training builds the clinical reasoning framework that NCLEX questions probe — not just pattern recognition, but understanding why a rhythm matters and what the nursing priority is.",
  },
  {
    question: "Can NPs access Advanced ECG content for CNPLE or NP exam prep?",
    answer:
      "Yes. Advanced ECG is available to NP learners as a separate add-on. NP-relevant content includes 12-lead interpretation in a primary care and outpatient context, recognizing when ECG findings require urgent referral, differential reasoning with ECG integration, and medication-ECG safety relevant to NP prescribing scope.",
  },
];

const CTA_ITEMS = [
  {
    key: "lessons",
    label: "Start ECG Lessons",
    href: "/modules/ecg/basic/lessons",
    description: "Systematic rhythm recognition from rate to diagnosis",
    icon: BookOpen,
    tone: "success" as const,
  },
  {
    key: "drills",
    label: "Practice ECG Strips",
    href: "/modules/ecg/basic/quizzes",
    description: "Adaptive strip identification drills with rationale",
    icon: Activity,
    tone: "info" as const,
  },
  {
    key: "flashcards",
    label: "ECG Flashcards",
    href: "/app/flashcards",
    description: "Spaced-repetition rhythm and interval review",
    icon: Brain,
    tone: "chart3" as const,
  },
  {
    key: "acls",
    label: "ACLS/PALS Rhythms",
    href: "/advanced-ecg-nursing/acls-rhythms",
    description: "Shockable vs non-shockable, arrest rhythm management",
    icon: Crosshair,
    tone: "brand" as const,
  },
  {
    key: "advanced",
    label: "Advanced ECG",
    href: "/advanced-ecg-nursing",
    description: "STEMI, electrolytes, ICU telemetry, hemodynamic correlation",
    icon: Layers,
    tone: "warning" as const,
  },
  {
    key: "pediatric",
    label: "Pediatric ECG",
    href: "/advanced-ecg-nursing/pediatric-ecg",
    description: "PALS rhythms, SVT in infants, LQTS, congenital heart",
    icon: Heart,
    tone: "chart4" as const,
  },
  {
    key: "cases",
    label: "ECG Clinical Cases",
    href: "/advanced-ecg-nursing/ecg-case-simulations",
    description: "Branching clinical scenarios with intervention consequences",
    icon: ClipboardList,
    tone: "info" as const,
  },
  {
    key: "telemetry",
    label: "Telemetry Mastery",
    href: "/advanced-ecg-nursing/telemetry-monitoring",
    description: "Alarm fatigue, lead selection, ST monitoring, rapid deterioration",
    icon: Stethoscope,
    tone: "success" as const,
  },
];

const TONE_CLASSES: Record<(typeof CTA_ITEMS)[number]["tone"], string> = {
  success:
    "border-[color-mix(in_srgb,var(--semantic-success)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_08%,var(--semantic-surface))] hover:bg-[color-mix(in_srgb,var(--semantic-success)_14%,var(--semantic-surface))]",
  info: "border-[color-mix(in_srgb,var(--semantic-info)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_08%,var(--semantic-surface))] hover:bg-[color-mix(in_srgb,var(--semantic-info)_14%,var(--semantic-surface))]",
  chart3:
    "border-[color-mix(in_srgb,var(--semantic-chart-3)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-3)_08%,var(--semantic-surface))] hover:bg-[color-mix(in_srgb,var(--semantic-chart-3)_14%,var(--semantic-surface))]",
  brand:
    "border-[color-mix(in_srgb,var(--semantic-brand)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_08%,var(--semantic-surface))] hover:bg-[color-mix(in_srgb,var(--semantic-brand)_14%,var(--semantic-surface))]",
  warning:
    "border-[color-mix(in_srgb,var(--semantic-warning)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_08%,var(--semantic-surface))] hover:bg-[color-mix(in_srgb,var(--semantic-warning)_14%,var(--semantic-surface))]",
  chart4:
    "border-[color-mix(in_srgb,var(--semantic-chart-4)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-4)_08%,var(--semantic-surface))] hover:bg-[color-mix(in_srgb,var(--semantic-chart-4)_14%,var(--semantic-surface))]",
};

const TONE_ICON_CLASSES: Record<(typeof CTA_ITEMS)[number]["tone"], string> = {
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
      const alt = marketingAlternatesSharedPage(DEFAULT_MARKETING_LOCALE, PATH);
      return {
        title: PAGE_TITLE,
        description: PAGE_DESCRIPTION,
        alternates: { canonical: alt.canonical, languages: alt.languages },
        robots: { index: true, follow: true },
        openGraph: {
          title: PAGE_TITLE,
          description: PAGE_DESCRIPTION,
          url: `${SITE_ORIGIN}${PATH}`,
          type: "website",
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

export default function EcgAuthorityHubPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${SITE_ORIGIN}${PATH}#article`,
        headline: PAGE_H1,
        description: PAGE_DESCRIPTION,
        url: `${SITE_ORIGIN}${PATH}`,
        author: { "@type": "Organization", name: "NurseNest", url: SITE_ORIGIN },
        publisher: { "@type": "Organization", name: "NurseNest", url: SITE_ORIGIN },
        educationalLevel: "Professional",
        about: [
          { "@type": "MedicalCondition", name: "Cardiac Arrhythmia" },
          { "@type": "MedicalCondition", name: "Atrial Fibrillation" },
        ],
      },
      {
        "@type": "EducationalCourse",
        "@id": `${SITE_ORIGIN}${PATH}#course`,
        name: "ECG Interpretation for Nurses",
        description: PAGE_DESCRIPTION,
        url: `${SITE_ORIGIN}${PATH}`,
        provider: { "@type": "Organization", name: "NurseNest", url: SITE_ORIGIN },
        educationalLevel: "Professional",
        teaches: [
          "Cardiac rhythm recognition",
          "12-lead ECG interpretation",
          "ACLS and PALS rhythms",
          "Pediatric ECG interpretation",
          "Telemetry nursing",
          "Hemodynamic correlation",
        ],
        hasCourseInstance: [
          {
            "@type": "CourseInstance",
            courseMode: "online",
            name: "Core ECG — Rhythm Recognition Foundations",
          },
          {
            "@type": "CourseInstance",
            courseMode: "online",
            name: "Advanced ECG — Add-On Module",
          },
          {
            "@type": "CourseInstance",
            courseMode: "online",
            name: "Pediatric ECG — PALS and Congenital Heart",
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_ORIGIN}${PATH}#faq`,
        mainEntity: FAQ_ITEMS.map(({ question, answer }) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: { "@type": "Answer", text: answer },
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${SITE_ORIGIN}${PATH}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_ORIGIN },
          { "@type": "ListItem", position: 2, name: "ECG Interpretation", item: `${SITE_ORIGIN}${PATH}` },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Breadcrumb ── */}
      <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs text-[var(--semantic-text-muted)]">
        <Link href="/" className="hover:text-[var(--semantic-brand)]">Home</Link>
        <ChevronRight className="h-3 w-3 shrink-0" aria-hidden />
        <span aria-current="page" className="text-[var(--semantic-text-secondary)]">ECG Interpretation</span>
      </nav>

      {/* ── Hero ── */}
      <header className="relative overflow-hidden rounded-2xl border border-[var(--semantic-border-soft)] bg-gradient-to-br from-[color-mix(in_srgb,var(--semantic-brand)_08%,var(--semantic-surface))] via-[var(--semantic-surface)] to-[color-mix(in_srgb,var(--semantic-chart-4)_06%,var(--semantic-surface))] px-6 py-10 shadow-[var(--semantic-shadow-soft)] sm:px-10 sm:py-14">
        {/* decorative waveform strip */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-16 opacity-[0.06]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 60'%3E%3Cpolyline points='0,30 40,30 50,5 60,55 70,5 80,55 90,30 130,30 140,10 150,50 160,30 200,30 210,5 220,55 230,5 240,55 250,30 290,30 300,10 310,50 320,30 360,30 370,5 380,55 390,5 400,30' fill='none' stroke='%23000' stroke-width='2'/%3E%3C/svg%3E\")",
            backgroundRepeat: "repeat-x",
            backgroundPosition: "center bottom",
            backgroundSize: "400px 60px",
          }}
        />
        <div className="relative">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[color-mix(in_srgb,var(--semantic-brand)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--semantic-surface))] px-3 py-1 text-xs font-semibold text-[var(--semantic-brand)]">
              <Activity className="h-3 w-3 shrink-0" aria-hidden />
              ECG Mastery System
            </span>
            <span className="rounded-full border border-[color-mix(in_srgb,var(--semantic-success)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_10%,var(--semantic-surface))] px-3 py-1 text-xs font-semibold text-[var(--semantic-success)]">
              RN &amp; NP
            </span>
          </div>

          <h1 className="nn-marketing-h1 max-w-3xl text-[var(--semantic-text-primary)]">
            {PAGE_H1}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--semantic-text-secondary)] sm:text-lg">
            Rhythm recognition, telemetry, ACLS/PALS readiness, pediatric ECG, and hemodynamic
            correlation — integrated with your NurseNest study loop.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/modules/ecg/basic/lessons"
              className="nn-cta-primary inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold"
            >
              <Zap className="h-4 w-4 shrink-0" aria-hidden />
              Start ECG Lessons
            </Link>
            <Link
              href="/advanced-ecg-nursing"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-5 py-2.5 text-sm font-semibold text-[var(--semantic-text-primary)] transition-colors hover:bg-[var(--accent-soft)]"
            >
              Advanced ECG
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
            </Link>
          </div>
        </div>
      </header>

      {/* ── CTA Grid ── */}
      <section className="mt-10" aria-labelledby="ecg-actions-heading">
        <h2
          id="ecg-actions-heading"
          className="nn-marketing-h2 mb-6 text-[var(--semantic-text-primary)]"
        >
          ECG learning pathways
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {CTA_ITEMS.map(({ key, label, href, description, icon: Icon, tone }) => (
            <Link
              key={key}
              href={href}
              className={`group flex flex-col gap-2 rounded-xl border p-4 transition-[background-color,box-shadow] duration-200 hover:shadow-[var(--semantic-shadow-soft)] motion-safe:hover:-translate-y-px ${TONE_CLASSES[tone]}`}
            >
              <Icon
                className={`h-5 w-5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 ${TONE_ICON_CLASSES[tone]}`}
                strokeWidth={2}
                aria-hidden
              />
              <span className="text-sm font-semibold text-[var(--semantic-text-primary)]">{label}</span>
              <span className="text-xs leading-relaxed text-[var(--semantic-text-secondary)]">{description}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Tier comparison ── */}
      <section className="mt-12" aria-labelledby="ecg-tiers-heading">
        <h2
          id="ecg-tiers-heading"
          className="nn-marketing-h2 mb-2 text-[var(--semantic-text-primary)]"
        >
          Core ECG vs Advanced ECG
        </h2>
        <p className="mb-6 text-sm text-[var(--semantic-text-secondary)]">
          Core ECG is included with eligible RN and NP subscriptions. Advanced ECG is a separate paid add-on.
        </p>

        <div className="grid gap-6 sm:grid-cols-2">
          {/* Core */}
          <div className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-success)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_05%,var(--semantic-surface))] p-5 sm:p-6">
            <div className="mb-4 flex items-center gap-2">
              <span className="rounded-full border border-[color-mix(in_srgb,var(--semantic-success)_40%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_12%,var(--semantic-surface))] px-3 py-1 text-xs font-bold text-[var(--semantic-success)]">
                CORE ECG — INCLUDED
              </span>
            </div>
            <h3 className="mb-3 text-base font-semibold text-[var(--semantic-text-primary)]">
              Rhythm Recognition Foundations
            </h3>
            <ul className="space-y-2">
              {COVERAGE_CORE.map((item) => (
                <li key={item} className="flex items-start gap-2 text-xs text-[var(--semantic-text-secondary)]">
                  <CheckCircle2
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--semantic-success)]"
                    strokeWidth={2.5}
                    aria-hidden
                  />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/modules/ecg/basic/lessons"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--semantic-success)] hover:underline"
            >
              Start Core ECG <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>

          {/* Advanced */}
          <div className="rounded-2xl border border-[color-mix(in_srgb,var(--semantic-warning)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_05%,var(--semantic-surface))] p-5 sm:p-6">
            <div className="mb-4 flex items-center gap-2">
              <span className="rounded-full border border-[color-mix(in_srgb,var(--semantic-warning)_40%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_12%,var(--semantic-surface))] px-3 py-1 text-xs font-bold text-[var(--semantic-warning-contrast)]">
                ADVANCED ECG — ADD-ON
              </span>
            </div>
            <h3 className="mb-3 text-base font-semibold text-[var(--semantic-text-primary)]">
              High-Acuity Telemetry &amp; Clinical Reasoning
            </h3>
            <ul className="space-y-2">
              {COVERAGE_ADVANCED.map((item) => (
                <li key={item} className="flex items-start gap-2 text-xs text-[var(--semantic-text-secondary)]">
                  <CheckCircle2
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--semantic-warning-contrast)]"
                    strokeWidth={2.5}
                    aria-hidden
                  />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/advanced-ecg-nursing"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--semantic-warning-contrast)] hover:underline"
            >
              Explore Advanced ECG <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Cluster topic links ── */}
      <section className="mt-12" aria-labelledby="ecg-topics-heading">
        <h2
          id="ecg-topics-heading"
          className="nn-marketing-h2 mb-2 text-[var(--semantic-text-primary)]"
        >
          ECG topic guides
        </h2>
        <p className="mb-5 text-sm text-[var(--semantic-text-secondary)]">
          Deep-dive reference pages for individual ECG topics — rhythm features, clinical significance, and nursing priorities.
        </p>
        <div className="flex flex-wrap gap-2">
          {CLUSTER_LINKS.map(({ slug, label }) => (
            <Link
              key={slug}
              href={`/ecg/${slug}`}
              className="inline-flex items-center gap-1 rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3.5 py-1.5 text-xs font-semibold text-[var(--semantic-text-secondary)] transition-colors hover:border-[var(--semantic-brand)] hover:bg-[color-mix(in_srgb,var(--semantic-brand)_08%,var(--semantic-surface))] hover:text-[var(--semantic-brand)]"
            >
              {label}
              <ChevronRight className="h-3 w-3 shrink-0" aria-hidden />
            </Link>
          ))}
        </div>
      </section>

      {/* ── Ecosystem hub grid ── */}
      <section className="mt-12" aria-labelledby="ecg-ecosystem-heading">
        <h2
          id="ecg-ecosystem-heading"
          className="nn-marketing-h2 mb-2 text-[var(--semantic-text-primary)]"
        >
          Advanced ECG specialty tracks
        </h2>
        <p className="mb-5 text-sm text-[var(--semantic-text-secondary)]">
          Nine clinical tracks inside the Advanced ECG ecosystem — each a standalone learning surface.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { href: "/advanced-ecg-nursing/rhythm-practice", label: "Rhythm Practice", desc: "20+ arrhythmias, adaptive drills, alarm triage" },
            { href: "/advanced-ecg-nursing/12-lead-stemi", label: "12-Lead & STEMI", desc: "STEMI localization, equivalents, culprit artery" },
            { href: "/advanced-ecg-nursing/acls-rhythms", label: "ACLS Rhythms", desc: "Shockable/non-shockable, cardioversion, post-ROSC" },
            { href: "/advanced-ecg-nursing/electrolyte-ecg-changes", label: "Electrolyte ECG Changes", desc: "Hyperkalemia, hypokalemia, calcium, magnesium" },
            { href: "/advanced-ecg-nursing/medication-induced-ecg-changes", label: "Medication-Induced ECG", desc: "Digoxin toxicity, QT prolongation, TCA/sodium channel" },
            { href: "/advanced-ecg-nursing/critical-care-ecg", label: "Critical Care ECG", desc: "BBB, ventricular ectopy, ICU ischemia monitoring" },
            { href: "/advanced-ecg-nursing/pediatric-ecg", label: "Pediatric ECG", desc: "Age-specific norms, SVT, WPW, LQTS, congenital" },
            { href: "/advanced-ecg-nursing/telemetry-monitoring", label: "Telemetry Monitoring", desc: "Alarm fatigue, lead selection, ST monitoring" },
            { href: "/advanced-ecg-nursing/ecg-case-simulations", label: "ECG Case Simulations", desc: "Branching clinical scenarios with interventions" },
          ].map(({ href, label, desc }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-start justify-between gap-3 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 py-3.5 transition-[background-color,border-color] hover:border-[var(--semantic-brand)] hover:bg-[color-mix(in_srgb,var(--semantic-brand)_05%,var(--semantic-surface))]"
            >
              <div>
                <span className="text-sm font-semibold text-[var(--semantic-text-primary)] group-hover:text-[var(--semantic-brand)]">
                  {label}
                </span>
                <p className="mt-0.5 text-xs leading-relaxed text-[var(--semantic-text-muted)]">{desc}</p>
              </div>
              <ArrowRight
                className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-text-muted)] transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-[var(--semantic-brand)]"
                aria-hidden
              />
            </Link>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="mt-12" aria-labelledby="ecg-faq-heading">
        <h2
          id="ecg-faq-heading"
          className="nn-marketing-h2 mb-6 text-[var(--semantic-text-primary)]"
        >
          Frequently asked questions
        </h2>
        <div className="space-y-4">
          {FAQ_ITEMS.map(({ question, answer }) => (
            <div
              key={question}
              className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-5 py-4 sm:px-6"
            >
              <h3 className="text-sm font-semibold text-[var(--semantic-text-primary)]">{question}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Internal links ── */}
      <nav
        className="mt-12 rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-brand)_04%,var(--semantic-surface))] px-5 py-4 sm:px-6"
        aria-label="Related ECG pages"
      >
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
          Related ECG resources
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
          {[
            { href: "/ecg-interpretation", label: "ECG Interpretation for RN/NP" },
            { href: "/ecg-telemetry-mastery", label: "Telemetry Mastery" },
            { href: "/advanced-ecg-nursing", label: "Advanced ECG Nursing" },
            { href: "/advanced-ecg-nursing/pediatric-ecg", label: "Pediatric ECG" },
            { href: "/advanced-ecg-nursing/acls-rhythms", label: "ACLS Rhythms" },
            { href: "/clinical-modules", label: "Clinical Modules" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="font-medium text-[var(--semantic-brand)] hover:underline"
            >
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
