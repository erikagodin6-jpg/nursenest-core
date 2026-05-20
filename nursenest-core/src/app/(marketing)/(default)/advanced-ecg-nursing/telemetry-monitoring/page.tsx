import type { Metadata } from "next";
import Link from "next/link";
import { Activity, ArrowRight, CheckCircle2 } from "lucide-react";
import { AcademyBreadcrumbBar, ClinicalAcademyJsonLdGraph } from "@/components/clinical-academy/clinical-academy-chrome";
import { ecgAdvancedLeafBreadcrumbs } from "@/lib/breadcrumbs/academy-breadcrumbs";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";

export const revalidate = 86400;

const PATH = "/advanced-ecg-nursing/telemetry-monitoring";
const PAGE_TITLE = "Telemetry Monitoring for Nurses — Alarm Management, Rhythm Surveillance, ICU Telemetry | NurseNest";
const PAGE_H1 = "Advanced telemetry monitoring: alarm management, continuous rhythm surveillance, and rapid deterioration recognition";
const PAGE_DESCRIPTION =
  "Telemetry monitoring training for RN, ICU, step-down, and cardiac nursing. Alarm fatigue reduction, rhythm surveillance protocols, rapid deterioration recognition, lead selection strategy, continuous ST monitoring, and telemetry competency for monitored units.";

const PILLAR = "/advanced-ecg-nursing";

const SECTIONS = [
  {
    id: "alarm-fatigue-management",
    heading: "Alarm fatigue: the patient safety crisis hiding in plain sight",
    body: `Alarm fatigue is defined as desensitization of clinical staff to monitor alarms from overexposure to high alarm volumes that are predominantly non-actionable. It is not a personal failure of vigilance — it is a systemic consequence of poorly calibrated alarm parameters on monitoring equipment paired with high patient volume. Joint Commission Sentinel Event data consistently identifies alarm fatigue as a contributing factor in patient deaths across hospital settings, with monitor alarms specifically cited in numerous avoidable cardiac arrest events.

Quantifying the problem provides context for why systematic alarm management training matters: published studies report 180–350 alarms per monitored bed per day in typical hospital environments. Alarm response rates in these environments average 50–70%. Of the alarms that do receive clinical response, the majority are false alarms, artifact, or clinically non-actionable events. The nurse who responds identically to every alarm — or who has learned to ignore alarms that have previously been false — is placed in an impossible position by a system with inadequate alarm calibration.

The clinical competency required is not faster alarm response — it is better alarm discrimination. The nurse who can rapidly assess a telemetry strip, determine whether the alarm represents a real rhythm change or artifact, correlate with patient clinical status, and triage response urgency is more effective than one who responds at equal speed to every alert. This discrimination skill requires: pattern recognition for artifact vs genuine arrhythmia, real-time assessment integrating monitor data with bedside observation, systematic alarm customization that matches alarm thresholds to individual patient baseline, and alarm silence discipline — escalating rather than silencing when the rhythm assessment is inconclusive.

Organizational-level interventions that complement individual competency include: individualized alarm threshold setting (e.g., setting heart rate alarms based on patient baseline rather than universal parameters), daily electrode replacement (poor skin contact is the most common technical cause of false alarms), lead selection optimization (matching the monitored lead to the clinical goal), and alarm escalation protocols that define nursing response requirements for different alarm categories.`,
  },
  {
    id: "lead-selection",
    heading: "Lead selection strategy: matching the monitored lead to the clinical goal",
    body: `Continuous telemetry monitoring with a single lead cannot detect all clinically relevant rhythm changes equally well. Choosing the optimal monitoring lead for a specific patient or clinical objective is a nursing decision that directly affects diagnostic yield.

For general cardiac monitoring in post-operative or medical-surgical patients, lead II is the traditional single-lead choice because P-waves are most visible (the vector runs parallel to the mean atrial depolarization axis). Clear P-wave identification supports rate assessment, rhythm regularity evaluation, and PR interval assessment — all foundational telemetry monitoring tasks.

For monitoring patients at risk for ventricular tachycardia or wide-complex rhythm changes, lead V1 is preferred because it best demonstrates QRS morphology differences between narrow and wide complexes and shows the RBBB vs LBBB morphology needed for VT vs SVT discrimination. In systems that support two-lead monitoring (which is the current standard of care in telemetry and stepdown units), the combination of lead II and lead V1 or V5 provides both P-wave visibility and QRS morphology information simultaneously.

For ischemia monitoring in patients with acute coronary syndrome or following PCI, the optimal ischemia-detection lead combination is lead III (inferior wall — RCA and LCx territory) plus lead V5 (lateral wall — LAD territory). This combination detects approximately 80% of ischemic events. ST-segment monitoring algorithms built into modern telemetry systems use this lead combination for automated ST-elevation alerts that trigger before the clinician would identify the change visually.

For paced rhythm assessment, the most visible pacing spikes typically appear in lead II (atrial pacing) and V1 or III (ventricular pacing) depending on pacemaker electrode position. Confirming capture in multiple leads is important because a spike may be visible in one lead and isoelectric in another, potentially misrepresenting capture status in any single monitored lead.`,
  },
  {
    id: "rapid-deterioration-recognition",
    heading: "Rapid deterioration recognition: the rhythm changes that precede cardiac arrest by minutes",
    body: `Clinical cardiac arrest is rarely instantaneous — it is typically preceded by a period of physiological deterioration that includes ECG changes identifiable on continuous monitoring. The ability to recognize pre-arrest rhythms and ECG deterioration patterns creates a window for intervention that prevents arrest rather than responding to it.

Accelerated idioventricular rhythm (AIVR) — an ectopic ventricular rhythm at 40–100 bpm with wide QRS complexes — is common in the first hours after reperfusion (fibrinolysis or PCI) and is generally benign (it is sometimes called a "reperfusion rhythm"). However, AIVR that appears in a non-reperfusion setting, or that increases in rate (approaching ventricular tachycardia territory), requires clinical reassessment.

Bradyarrhythmias that precede arrest: progressive sinus bradycardia in a hemodynamically compromised patient suggests vasovagal or cardiogenic causes and requires assessment before rate falls below the functional threshold for consciousness. Progressive Mobitz II block with episodic dropped beats can progress to complete heart block and ventricular standstill without warning — the consistent PR interval before drops makes Mobitz II unpredictable in a way that Mobitz I (Wenckebach) is not. Any Mobitz II pattern with symptoms or hemodynamic compromise requires immediate pacing consultation.

Tachyarrhythmia acceleration patterns: sustained non-sustained VT runs (NSVT) occurring in a patient with known structural heart disease, or with increasing frequency, represent escalating myocardial instability. A patient who has three runs of 4-beat NSVT in one hour requires assessment, medication review, and electrolyte correction — the frequency trajectory matters as much as any individual event.

Electrical alternans — the beat-to-beat alternation of QRS amplitude — is the pathognomonic ECG finding of pericardial effusion with hemodynamic compromise (cardiac tamponade). It results from the heart swinging within the pericardial fluid. When identified on telemetry, it requires immediate bedside assessment for Beck's triad (hypotension, muffled heart sounds, elevated JVP) and urgent echocardiography.`,
  },
  {
    id: "continuous-st-monitoring",
    heading: "Continuous ST-segment monitoring: protocol, thresholds, and clinical integration",
    body: `Continuous ST-segment monitoring using automated telemetry algorithms represents a significant advance in ischemia surveillance for patients who cannot report symptoms. The clinical effectiveness depends entirely on appropriate patient selection, correct lead configuration, accurate baseline ST-segment setting, and a clear nursing response protocol when threshold alerts trigger.

Patient selection for continuous ST monitoring: highest benefit is in patients following PCI (monitoring for acute stent thrombosis), patients with known or suspected ACS, patients with recent reperfusion therapy, and critically ill patients who cannot report symptoms. The AHA/AACN guidelines support continuous ST monitoring for these populations in monitored care settings.

Baseline ST-segment calibration is the most common implementation failure. The automated algorithm compares real-time ST to a stored baseline and alerts when the difference exceeds a threshold (typically ≥1 mm change). If the baseline is set incorrectly — capturing an ischemic period, or not accounting for paced rhythm or BBB — the alerts will be systematically inaccurate. Baseline should be set after the patient is in a stable non-ischemic state, and re-baselined after any significant rhythm change.

Alert thresholds and clinical response: a ≥1 mm ST elevation or depression change from baseline that persists for 60 seconds triggers a significant alert. Nursing response includes: visual confirmation of the rhythm strip, correlation with patient clinical presentation, 12-lead ECG acquisition, and notification of the provider with the ST-change data and clinical context. The automated alert is a surveillance tool — clinical judgment determines urgency and intervention, not the algorithm alone.

False positive ST alerts are common from body position changes (which shift the cardiac electrical axis), lead disconnection, artifact, and left bundle branch block. Teaching nurses to differentiate position-related transient ST changes from ischemic persistent ST changes reduces alarm fatigue within the ST monitoring system and maintains the clinical value of the alerts that represent genuine events.`,
  },
];

const FAQ_ITEMS = [
  {
    question: "What is the best single lead for cardiac telemetry monitoring?",
    answer:
      "Lead II is the traditional single-lead choice for general monitoring because P-waves are maximally visible, supporting rate and rhythm assessment. For two-lead monitoring, II + V1 is optimal for most patients: lead II for P-wave visibility and lead V1 for QRS morphology assessment. For ischemia-focused monitoring, lead III + V5 detect approximately 80% of ischemic events. For paced patients, choose the lead where spikes are most visible for your pacemaker configuration. Lead selection should match the monitoring objective, not just use a unit default.",
  },
  {
    question: "How does alarm fatigue contribute to patient harm?",
    answer:
      "Alarm fatigue causes patient harm through two mechanisms: (1) desensitization — nurses who have been conditioned by high false-alarm rates begin silencing or ignoring alarms reflexively, missing the occasional true alarm that represents genuine danger. (2) Delayed response — when response latency to alarms increases above institutional response-time standards, ischemic events, arrhythmias, or respiratory deterioration that were detectable and treatable progress to cardiac arrest. Alarm fatigue is a well-documented contributor to preventable in-hospital death in Joint Commission sentinel event data.",
  },
  {
    question: "What should a nurse do when an ST monitoring alert triggers?",
    answer:
      "Immediate response: visually confirm the telemetry strip is not artifact. Correlate with patient presentation — go to bedside if patient is symptomatic (chest pain, dyspnea, diaphoresis, hemodynamic change). Obtain a 12-lead ECG. Notify the provider with the ST change magnitude, lead distribution, and clinical context. If the ST change meets STEMI criteria in the 12-lead, follow the institutional STEMI activation protocol. Document the alert, your assessment, and provider notification regardless of outcome.",
  },
  {
    question: "How often should telemetry electrodes be replaced?",
    answer:
      "Most institutional protocols recommend electrode replacement every 24–48 hours. Poor electrode-skin contact from dried gel, hair, or skin oils is the leading technical cause of false alarms and artifact on telemetry systems. Daily electrode replacement significantly reduces artifact-related alarm burden. Skin preparation (gentle abrasion, cleansing, ensuring dry skin) before electrode placement improves contact quality and extends electrode effectiveness. In diaphoretic patients, replacement every 12–24 hours may be necessary.",
  },
];

const RELATED_LINKS = [
  { href: PILLAR, label: "Advanced ECG for Nurses" },
  { href: "/advanced-ecg-nursing/rhythm-practice", label: "Rhythm Practice Lab" },
  { href: "/advanced-ecg-nursing/critical-care-ecg", label: "Critical Care ECG" },
  { href: "/advanced-ecg-nursing/acls-rhythms", label: "ACLS Rhythms" },
  { href: "/advanced-ecg-nursing/12-lead-stemi", label: "12-Lead STEMI Interpretation" },
  { href: "/ecg-telemetry-mastery", label: "ECG Telemetry Mastery" },
  { href: "/modules/ecg-advanced", label: "Advanced ECG Module" },
];

const COVERAGE_ITEMS = [
  "Alarm fatigue: causes, consequences, and discrimination training",
  "Alarm customization: individualized thresholds vs universal defaults",
  "Lead II: P-wave visibility, rate and rhythm assessment",
  "Lead V1: QRS morphology, narrow vs wide complex discrimination",
  "Lead II + V1: dual-lead standard for monitored units",
  "Ischemia monitoring: Lead III + V5, 80% event detection coverage",
  "ST monitoring: baseline calibration, alert thresholds, response protocol",
  "False positive ST alerts: position changes, BBB, electrode issues",
  "AIVR: reperfusion rhythm vs pathologic ventricular ectopy",
  "Mobitz II on telemetry: unpredictable progression, pacing urgency",
  "Electrical alternans: tamponade signature, Beck's triad assessment",
  "Electrode replacement: every 24–48 hours, skin prep, diaphoresis protocol",
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
          "telemetry monitoring nursing",
          "telemetry nurse training",
          "alarm fatigue nursing",
          "cardiac monitoring nurses",
          "continuous ST monitoring nursing",
          "ECG lead selection telemetry",
          "rapid deterioration recognition nursing",
          "telemetry alarm management",
          "cardiac telemetry nursing",
          "rhythm surveillance ICU",
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
    { pathname: PATH, locale: DEFAULT_MARKETING_LOCALE, routeGroup: "marketing.default.advancedEcgTelemetry" },
  );
}

export default function TelemetryMonitoringPage() {

  const breadcrumbResolution = ecgAdvancedLeafBreadcrumbs('Telemetry Monitoring', PATH);
  const jsonLdGraph = [
      {
        "@type": "Article",
        "@id": `https://nursenest.io${PATH}`,
        url: `https://nursenest.io${PATH}`,
        name: PAGE_TITLE,
        description: PAGE_DESCRIPTION,
        headline: PAGE_H1,
        inLanguage: "en",
        author: { "@type": "Organization", name: "NurseNest" },
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
        <AcademyBreadcrumbBar pathname={PATH} resolution={breadcrumbResolution} />
<header className="mb-10 space-y-4">
          <div className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--semantic-chart-1)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-1)_08%,var(--semantic-surface))] text-[var(--semantic-chart-1)]">
              <Activity className="h-5 w-5" aria-hidden />
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--semantic-text-muted)]">
              ECG Mastery · Telemetry Monitoring
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
              Open Telemetry Training
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href={PILLAR}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-5 py-2.5 text-sm font-semibold text-[var(--semantic-text-secondary)] hover:bg-[var(--semantic-surface-alt)]"
            >
              Advanced ECG hub
            </Link>
          </div>
        </header>

        <article className="mb-10 space-y-10 text-[var(--semantic-text-secondary)]">
          {SECTIONS.map((section) => (
            <section key={section.id} id={section.id}>
              <h2 className="mb-4 text-xl font-semibold text-[var(--semantic-text-primary)]">{section.heading}</h2>
              <div className="space-y-4">
                {section.body.split("\n\n").map((para, i) => (
                  <p key={i} className="text-sm leading-relaxed">{para}</p>
                ))}
              </div>
            </section>
          ))}
        </article>

        <section className="mb-10 rounded-2xl border border-[color-mix(in_srgb,var(--semantic-chart-1)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_18%,var(--semantic-surface))] p-5 sm:p-6">
          <h2 className="text-base font-semibold text-[var(--semantic-text-primary)]">Telemetry monitoring coverage at a glance</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {COVERAGE_ITEMS.map((item) => (
              <li key={item} className="flex items-start gap-2 text-xs text-[var(--semantic-text-secondary)]">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--semantic-chart-1)]" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </section>

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

        <nav aria-label="Related pages" className="border-t border-[var(--semantic-border-soft)] pt-6">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[var(--semantic-text-muted)]">ECG mastery ecosystem</p>
          <ul className="flex flex-wrap gap-2">
            {RELATED_LINKS.map(({ href, label }) => (
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
