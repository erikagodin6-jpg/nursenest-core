import type { Metadata } from "next";
import Link from "next/link";
import { Activity, AlertTriangle, BookOpen, CheckCircle2, Monitor, Shield, Zap } from "lucide-react";
import { AcademyBreadcrumbBar, ClinicalAcademyJsonLdGraph } from "@/components/clinical-academy/clinical-academy-chrome";
import { ecgStandaloneLeafBreadcrumbs } from "@/lib/breadcrumbs/academy-breadcrumbs";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";

export const revalidate = 86400;

const PATH = "/telemetry-nursing";
const PAGE_TITLE = "Telemetry Nursing — ECG & Cardiac Monitor Interpretation | NurseNest";
const PAGE_H1 = "Telemetry nursing: ECG interpretation, monitor alarms, and cardiac rhythm recognition";
const PAGE_DESCRIPTION =
  "Telemetry nursing training for RN and NP: cardiac monitor interpretation, rhythm recognition, alarm management, artifact identification, and bedside ECG clinical reasoning. Integrated with NCLEX and CNPLE prep.";

const SITE_ORIGIN = "https://nursenest.ca";

const CORE_SKILLS = [
  {
    icon: Activity,
    title: "Rhythm Strip Interpretation",
    body: "Systematic rhythm analysis using the 7-step method: rate → rhythm → P waves → PR interval → QRS → ST/T changes → diagnosis. Applicable to both lead-II telemetry strips and 12-lead ECG interpretation.",
  },
  {
    icon: Monitor,
    title: "Cardiac Monitor Alarm Management",
    body: "Distinguishing true alarms from artifact, setting appropriate alarm parameters, understanding rate/rhythm alarm thresholds, and managing telemetry in step-down and ICU environments without alarm fatigue.",
  },
  {
    icon: AlertTriangle,
    title: "Artifact Recognition",
    body: "Motion artifact vs lethal rhythm (VF vs artifact — the patient first rule), lead-placement artifact, pacemaker artifact, 60-Hz interference, and cable-related false alarms. Critical for telemetry nurses making real-time clinical decisions.",
  },
  {
    icon: Shield,
    title: "Escalation and Rapid Response",
    body: "Which rhythms require immediate bedside assessment, which require provider notification within minutes, and which can be monitored with documentation. Understanding hemodynamic correlation — not every alarming rhythm requires the same urgency.",
  },
];

const RHYTHMS = [
  "Normal sinus rhythm — rate, regularity, and morphology",
  "Sinus tachycardia vs SVT — the rate threshold is not the answer",
  "Sinus bradycardia — when to worry vs when to document",
  "Atrial fibrillation — irregularly irregular, absent P waves",
  "Atrial flutter — sawtooth 2:1/3:1/4:1 patterns",
  "First-degree AV block — prolonged PR, all beats conduct",
  "Wenckebach (Mobitz I) — progressive PR, dropped beat, reset",
  "Mobitz II — constant PR, sudden dropped QRS, pacemaker urgency",
  "Complete (third-degree) heart block — AV dissociation",
  "PVCs — premature wide bizarre QRS, compensatory pause",
  "Ventricular tachycardia — rate > 100, wide QRS, AV dissociation",
  "Paced rhythms — spike recognition, capture vs malfunction",
];

const FAQ_ITEMS = [
  {
    question: "What rhythms does a telemetry nurse need to recognize immediately?",
    answer:
      "Telemetry nurses must immediately recognize: (1) Ventricular fibrillation and pulseless ventricular tachycardia — code response, defibrillate. (2) Complete heart block with hemodynamic compromise — pacing. (3) Sustained VT with or without a pulse — assess hemodynamics, escalate. (4) Asystole — confirm in two leads, initiate code. (5) New ST elevation — STEMI protocol, activate cath lab. (6) Pacemaker malfunction with symptoms — assess, escalate. All other rhythms allow time for systematic assessment before escalation, though all require documentation and communication.",
  },
  {
    question: "How do you tell VF from motion artifact on telemetry?",
    answer:
      "The first rule of telemetry is: assess the patient, not the monitor. In true VF, the patient is unconscious and pulseless. Motion artifact — even when it appears identical to VF on the strip — is associated with a responsive, perfusing patient. Three practical checks: (1) Can the patient respond to voice? (2) Is there a palpable pulse? (3) Does the pulse oximetry waveform show organized pulsatile flow? If YES to any, the rhythm on the monitor is almost certainly artifact. NEVER defibrillate based on monitor findings alone without a pulse check.",
  },
  {
    question: "What is the difference between Mobitz I and Mobitz II and why does it matter?",
    answer:
      "Mobitz I (Wenckebach): progressive PR prolongation until a QRS is dropped, then the cycle resets. Block is at the AV node level (nodal). Usually benign — inferior MI, vagal tone, athletes. Mobitz II: constant PR interval followed by a sudden dropped QRS without prior PR lengthening. Block is infranodal — at the bundle branches. Dangerous because it can progress to complete heart block without warning. Requires urgent cardiology consultation and pacemaker evaluation even when asymptomatic. This distinction is life-affecting: misidentifying Mobitz II as Mobitz I means delaying pacemaker workup in a patient who can suddenly develop fatal heart block.",
  },
  {
    question: "How should alarm parameters be set on telemetry units?",
    answer:
      "Alarm parameters should be individualized to the patient's baseline. A patient in chronic AFib should not have an 'irregular rhythm' alarm active — it will alarm continuously. Rate alarms should be set around the patient's current documented rate plus a safety margin (typically ±20 bpm from resting rate for alert patients; tighter for post-cardiac-surgery). Alarm fatigue is a patient safety issue — excessive alarms desensitize staff. Review and reset alarms at each assessment, not just at shift start.",
  },
  {
    question: "Is ECG telemetry training included in the NurseNest RN subscription?",
    answer:
      "Core ECG and telemetry interpretation training is included with eligible RN and NP base subscriptions. This covers rhythm recognition, systematic interpretation, telemetry concepts, and nursing response. Advanced ECG (STEMI localization, complex arrhythmias, advanced pacemaker malfunction, ICU telemetry) is a separate paid add-on.",
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
          "telemetry nursing",
          "cardiac monitor interpretation nursing",
          "ECG interpretation nursing",
          "telemetry rhythm recognition",
          "cardiac telemetry nursing",
          "bedside ECG nursing",
          "telemetry alarm management",
          "cardiac rhythm recognition RN",
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

export default function TelemetryNursingPage() {
  const breadcrumbResolution = ecgStandaloneLeafBreadcrumbs("Telemetry Nursing", PATH);
  const jsonLdGraph = [
      {
        "@type": "Course",
        name: "Telemetry Nursing — Cardiac Monitor Interpretation",
        description: PAGE_DESCRIPTION,
        provider: { "@type": "Organization", name: "NurseNest", url: SITE_ORIGIN },
        hasCourseInstance: { "@type": "CourseInstance", courseMode: "online" },
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ_ITEMS.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ];

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <ClinicalAcademyJsonLdGraph graph={jsonLdGraph} />
      <AcademyBreadcrumbBar pathname={PATH} resolution={breadcrumbResolution} />

      {/* Header */}
      <header className="mb-10">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--semantic-info)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_06%,var(--semantic-surface))] px-3 py-1 text-xs font-semibold text-[var(--semantic-info)]">
          <Activity className="h-3.5 w-3.5" aria-hidden />
          Core ECG — Included with RN/NP Subscription
        </div>
        <h1 className="mb-4 text-3xl font-bold leading-tight text-[var(--semantic-text-primary)] sm:text-4xl">
          {PAGE_H1}
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-[var(--semantic-text-secondary)]">
          Telemetry nurses interpret continuous cardiac monitor data for dozens of patients
          simultaneously. This page covers the core competencies: systematic rhythm interpretation,
          alarm management, artifact identification, and clinical escalation decisions.
        </p>
      </header>

      {/* Core skill areas */}
      <section className="mb-12" aria-labelledby="core-skills-heading">
        <h2 id="core-skills-heading" className="mb-6 text-2xl font-bold text-[var(--semantic-text-primary)]">
          Core telemetry nursing competencies
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {CORE_SKILLS.map((skill) => {
            const Icon = skill.icon;
            return (
              <div
                key={skill.title}
                className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5"
              >
                <div className="mb-3 flex items-center gap-2">
                  <Icon className="h-5 w-5 text-[var(--semantic-info)]" aria-hidden />
                  <h3 className="font-semibold text-[var(--semantic-text-primary)]">{skill.title}</h3>
                </div>
                <p className="text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{skill.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Rhythms covered */}
      <section className="mb-12" aria-labelledby="rhythms-heading">
        <h2 id="rhythms-heading" className="mb-4 text-2xl font-bold text-[var(--semantic-text-primary)]">
          Rhythms covered in telemetry interpretation training
        </h2>
        <p className="mb-5 text-[var(--semantic-text-secondary)]">
          Each rhythm requires understanding mechanism, ECG criteria, clinical significance, and
          appropriate nursing response — not just pattern recognition.
        </p>
        <ul className="grid gap-2 sm:grid-cols-2">
          {RHYTHMS.map((r) => (
            <li key={r} className="flex items-start gap-2.5 text-sm text-[var(--semantic-text-secondary)]">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden />
              {r}
            </li>
          ))}
        </ul>
      </section>

      {/* Systematic interpretation */}
      <section className="mb-12 rounded-2xl border border-[color-mix(in_srgb,var(--semantic-info)_20%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_04%,var(--semantic-surface))] p-6" aria-labelledby="method-heading">
        <h2 id="method-heading" className="mb-4 text-xl font-bold text-[var(--semantic-text-primary)]">
          Systematic rhythm interpretation — the 7-step method
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
          Telemetry errors most often result from skipping steps — seeing a fast rate and assuming SVT,
          or seeing an irregular rhythm and diagnosing AFib without checking P-wave morphology.
          A systematic approach prevents these errors.
        </p>
        <ol className="space-y-2">
          {[
            ["Rate", "Count ventricular rate. Bradycardia < 60, normal 60–100, tachycardia > 100. For irregular rhythms, use the 6-second strip × 10 method."],
            ["Rhythm", "Regular, irregular, or regularly irregular? Measure R-R intervals across the strip."],
            ["P waves", "Present or absent? One per QRS? Morphology consistent throughout? Retrograde?"],
            ["PR interval", "Normal (120–200 ms), prolonged, or variable? Progressive lengthening?"],
            ["QRS width", "Narrow (< 120 ms) or wide (≥ 120 ms)? Wide QRS = ventricular or aberrant conduction."],
            ["ST and T waves", "Elevation, depression, inversion, peaked? Any pattern suggesting ischemia?"],
            ["Interpretation", "Apply findings. Default to most dangerous interpretation when uncertain."],
          ].map(([step, desc], i) => (
            <li key={step} className="flex items-start gap-3 text-sm">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--semantic-info)] text-[10px] font-bold text-white">
                {i + 1}
              </span>
              <div>
                <span className="font-semibold text-[var(--semantic-text-primary)]">{step}: </span>
                <span className="text-[var(--semantic-text-secondary)]">{desc}</span>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* FAQ */}
      <section className="mb-12" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="mb-6 text-2xl font-bold text-[var(--semantic-text-primary)]">
          Frequently asked questions — telemetry nursing
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

      {/* Internal links */}
      <section className="mb-10" aria-labelledby="related-heading">
        <h2 id="related-heading" className="mb-4 text-lg font-semibold text-[var(--semantic-text-primary)]">
          Related ECG and telemetry topics
        </h2>
        <div className="flex flex-wrap gap-2">
          {[
            { href: "/ecg", label: "ECG Interpretation Hub" },
            { href: "/ecg-interpretation", label: "ECG Interpretation for Nurses" },
            { href: "/acls-rhythms", label: "ACLS Rhythms" },
            { href: "/advanced-ecg-nursing", label: "Advanced ECG Nursing" },
            { href: "/advanced-ecg-nursing/telemetry-monitoring", label: "Advanced Telemetry Monitoring" },
            { href: "/ecg/ventricular-tachycardia", label: "Ventricular Tachycardia" },
            { href: "/ecg/svt-vs-atrial-fibrillation", label: "SVT vs Atrial Fibrillation" },
            { href: "/ecg/heart-block-interpretation", label: "Heart Block Interpretation" },
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
          Start practicing telemetry interpretation
        </h2>
        <p className="mb-5 text-sm text-[color-mix(in_srgb,var(--role-cta-foreground)_80%,transparent)]">
          Core ECG and telemetry content is included with eligible RN and NP subscriptions.
          Strip-based practice questions, adaptive weak-area tracking, and mechanism-based lessons.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/modules/ecg/basic/lessons"
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[var(--role-cta)] shadow-sm"
          >
            <BookOpen className="h-4 w-4" aria-hidden />
            Start ECG Lessons
          </Link>
          <Link
            href="/modules/ecg/basic/quizzes"
            className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold text-white"
          >
            <Zap className="h-4 w-4" aria-hidden />
            Strip Practice Drills
          </Link>
        </div>
      </section>
    </main>
  );
}
