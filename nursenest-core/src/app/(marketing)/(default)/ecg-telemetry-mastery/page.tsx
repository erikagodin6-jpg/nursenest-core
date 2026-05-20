import type { Metadata } from "next";
import Link from "next/link";
import { AcademyBreadcrumbBar, ClinicalAcademyJsonLdGraph } from "@/components/clinical-academy/clinical-academy-chrome";
import { ecgStandaloneLeafBreadcrumbs } from "@/lib/breadcrumbs/academy-breadcrumbs";
import { Activity, ArrowRight, CheckCircle2, Monitor, Shield, Zap } from "lucide-react";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";

export const revalidate = 86400;

const PATH = "/ecg-telemetry-mastery";
const PAGE_TITLE = "ECG & Telemetry Mastery for Nurses — ICU, CCU, ER Specialty Training | NurseNest";
const PAGE_H1 = "Advanced ECG and telemetry mastery for ICU, CCU, ER, and cardiac stepdown nurses";
const PAGE_DESCRIPTION =
  "200+ clinician-reviewed ECG questions covering complex ventricular rhythms, STEMI equivalents, pacemaker malfunctions, electrolyte emergencies, and ACLS decision-making. Designed for RN and NP specialty practice, not basic NCLEX prep.";

const TRACKS = [
  { icon: Zap, title: "Complex Ventricular Rhythms", desc: "VT morphology criteria, torsades, AIVR, electrical storm, R-on-T. 25+ questions with AV dissociation framing.", accent: "var(--semantic-chart-1)" },
  { icon: Monitor, title: "Advanced Ischemia & STEMI", desc: "Posterior STEMI, De Winter T-waves, Wellens syndrome, left main patterns, occlusion MI equivalents. Not just ST elevation basics.", accent: "var(--semantic-danger)" },
  { icon: Activity, title: "Critical-Care Telemetry", desc: "PEA recognition, artifact vs lethal rhythm, TTM monitoring, shockable vs non-shockable, ROSC ECG priorities, alarm fatigue systems.", accent: "var(--semantic-warning)" },
  { icon: Shield, title: "Pacemaker Mastery", desc: "Failure to capture, undersensing R-on-T risk, PMT, CRT mechanics, ICD shock management, battery EOL, Twiddler's syndrome.", accent: "var(--semantic-chart-3)" },
];

const FAQ_ITEMS = [
  {
    question: "Who is the Advanced ECG module designed for?",
    answer:
      "The Advanced ECG module is designed for RN and NP learners in telemetry, ICU, CCU, emergency department, cardiac stepdown, and progressive care settings. It is not designed for basic NCLEX rhythm recognition — it starts where the foundational ECG module ends, covering clinical decision-making, ACLS integration, and high-acuity telemetry scenarios.",
  },
  {
    question: "How is this different from the core NurseNest ECG module?",
    answer:
      "The core ECG module covers rhythm recognition foundations: sinus rhythms, atrial arrhythmias, basic AV blocks, pacemakers introduction, and basic ECG strips. The Advanced ECG add-on goes significantly deeper: complete heart block management, Brugada criteria for VT vs SVT, posterior STEMI recognition, advanced pacemaker malfunctions, toxicology ECG patterns, ACLS decision pathways, and ICU-level case scenarios. The two modules are complementary and separately purchased.",
  },
  {
    question: "Are the ECG strips real patient tracings?",
    answer:
      "The ECG strips use deterministic waveform generation built from validated clinical rhythm templates — not real patient tracings. This design is intentional for educational purposes: deterministic strips present the teaching-critical morphologic features consistently without confounding artifact, cable noise, or patient-specific variability. Each strip configuration is clinician-reviewed before learner exposure.",
  },
  {
    question: "Does the Advanced ECG module cover ACLS-relevant rhythms?",
    answer:
      "Yes. An entire track (ACLS ECG Decision-Making) covers shockable vs non-shockable rhythm identification, defibrillation energy selection, antiarrhythmic sequencing, cardioversion indications, pacing escalation pathways, and rhythm recognition tied to ACLS decision branches. This is integrated throughout the module — not siloed into a single section.",
  },
  {
    question: "Is this available for NP learners?",
    answer:
      "Yes. Advanced ECG is available to both RN and NP learners. NP-focused content includes outpatient ECG interpretation for chest pain evaluation, prescribing safety with QT-prolonging drugs, CNPLE-relevant advanced ECG recognition, and autonomy in making ECG-based diagnostic decisions including differential diagnosis and urgent referral thresholds.",
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
          "ECG telemetry mastery",
          "advanced ECG nursing",
          "ICU telemetry training nurses",
          "ACLS ECG interpretation",
          "VT vs SVT nursing",
          "CCU rhythm recognition",
          "advanced cardiac nursing ECG",
          "NP ECG interpretation",
        ],
        openGraph: {
          title: PAGE_TITLE,
          description: PAGE_DESCRIPTION,
          url: alt.canonical,
          type: "article",
          siteName: "NurseNest",
        },
        twitter: { card: "summary_large_image", title: PAGE_TITLE, description: PAGE_DESCRIPTION },
      };
    },
    { pathname: PATH, locale: DEFAULT_MARKETING_LOCALE, routeGroup: "marketing.default.ecgTelemetryMastery" },
  );
}

export default function EcgTelemetryMasteryPage() {
  const breadcrumbResolution = ecgStandaloneLeafBreadcrumbs("Telemetry Mastery", PATH);
  const jsonLdGraph = [
      {
        "@type": "WebPage",
        "@id": `https://nursenest.io${PATH}`,
        url: `https://nursenest.io${PATH}`,
        name: PAGE_TITLE,
        description: PAGE_DESCRIPTION,
        inLanguage: "en",
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ_ITEMS.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      },
    ];

  return (
    <>
      <ClinicalAcademyJsonLdGraph graph={jsonLdGraph} />
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <AcademyBreadcrumbBar resolution={breadcrumbResolution} />

        {/* hero */}
        <header className="mb-10 space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[color-mix(in_srgb,var(--semantic-chart-1)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-1)_08%,var(--semantic-surface))] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[color-mix(in_srgb,var(--semantic-chart-1)_90%,var(--semantic-text-primary))]">
              <Activity className="h-3 w-3 shrink-0" aria-hidden />
              Advanced ECG · Telemetry Specialty
            </span>
            <span className="rounded-full border border-[color-mix(in_srgb,var(--semantic-success)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_07%,transparent)] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--semantic-success)]">
              Live Module
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[var(--semantic-text-primary)] sm:text-4xl">
            {PAGE_H1}
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-[var(--semantic-text-secondary)]">{PAGE_DESCRIPTION}</p>

          <div className="flex flex-wrap gap-3 pt-1">
            <Link
              href="/modules/ecg-advanced"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--role-cta)] px-5 py-2.5 text-sm font-semibold text-[var(--role-cta-foreground)] shadow-[0_2px_10px_var(--role-cta-shadow)]"
            >
              Open Advanced ECG Module
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href="/pricing#advanced-ecg-add-on"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-5 py-2.5 text-sm font-semibold text-[var(--semantic-text-secondary)] hover:bg-[var(--semantic-surface-alt)]"
            >
              View add-on pricing
            </Link>
          </div>

          {/* stat strip */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { value: "200+", label: "Curated questions" },
              { value: "9", label: "Clinical tracks" },
              { value: "ICU/CCU", label: "Focus" },
              { value: "ACLS", label: "Integrated" },
            ].map(({ value, label }) => (
              <div key={label} className="rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_18%,var(--semantic-surface))] p-3 text-center">
                <p className="text-lg font-bold tabular-nums text-[var(--semantic-text-primary)]">{value}</p>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--semantic-text-muted)]">{label}</p>
              </div>
            ))}
          </div>
        </header>

        {/* track grid */}
        <section className="mb-10 space-y-4">
          <h2 className="text-xl font-semibold text-[var(--semantic-text-primary)]">What the Advanced ECG module covers</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {TRACKS.map(({ icon: Icon, title, desc, accent }) => (
              <div
                key={title}
                className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 shadow-[var(--semantic-shadow-soft)]"
                style={{ borderTopColor: accent, borderTopWidth: "2px" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="h-4 w-4 shrink-0" aria-hidden style={{ color: accent }} />
                  <h3 className="text-sm font-semibold text-[var(--semantic-text-primary)]">{title}</h3>
                </div>
                <p className="text-xs leading-relaxed text-[var(--semantic-text-secondary)]">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* positioning */}
        <section className="mb-10 rounded-2xl border border-[color-mix(in_srgb,var(--semantic-info)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_05%,var(--semantic-surface))] p-5 sm:p-6">
          <h2 className="text-base font-semibold text-[var(--semantic-text-primary)]">This is NOT basic NCLEX prep</h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
            Normal sinus rhythm, sinus bradycardia, sinus tachycardia, basic PAC/PVC recognition, first-degree AV block, and simple AF identification are covered in the NurseNest core ECG module (included with base RN/NP subscriptions). The Advanced ECG module begins where the foundational module ends — at the clinical decision layer.
          </p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {[
              "VT vs SVT: Brugada 4-step algorithm",
              "STEMI equivalents: De Winter, Wellens, posterior",
              "Complete heart block: narrow vs wide escape",
              "Pre-excited AF: why verapamil is contraindicated",
              "Torsades: pause-dependent vs adrenergic-triggered",
              "Pacemaker: failure to capture, undersensing, PMT",
              "EP pearls: HV interval, SNRT, entrainment mapping",
              "ICU workflow: A-line PEA recognition, electrical storm",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-xs text-[var(--semantic-text-secondary)]">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--semantic-info)]" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* FAQ */}
        <section className="mb-10 space-y-4">
          <h2 className="text-xl font-semibold text-[var(--semantic-text-primary)]">Frequently asked questions</h2>
          <dl className="space-y-3">
            {FAQ_ITEMS.map((f) => (
              <div key={f.question} className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
                <dt className="text-sm font-semibold text-[var(--semantic-text-primary)]">{f.question}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{f.answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* related */}
        <nav aria-label="Related pages" className="border-t border-[var(--semantic-border-soft)] pt-6">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[var(--semantic-text-muted)]">Related resources</p>
          <ul className="flex flex-wrap gap-2">
            {[
              { href: "/ecg-interpretation", label: "ECG Interpretation for Nurses" },
              { href: "/advanced-ecg-nursing", label: "Advanced ECG Nursing" },
              { href: "/modules/ecg-advanced", label: "Advanced ECG Module" },
              { href: "/modules/ecg", label: "Core ECG Telemetry Hub" },
              { href: "/canada/np/cnple", label: "CNPLE Exam Hub" },
            ].map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className="rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-1.5 text-xs font-medium text-[var(--semantic-text-secondary)] hover:text-[var(--semantic-text-primary)]">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </main>
    </>
  );
}
