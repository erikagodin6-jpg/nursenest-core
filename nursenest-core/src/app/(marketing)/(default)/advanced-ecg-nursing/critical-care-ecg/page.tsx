import type { Metadata } from "next";
import Link from "next/link";
import { Activity, ArrowRight, CheckCircle2 } from "lucide-react";
import { AcademyBreadcrumbBar, ClinicalAcademyJsonLdGraph } from "@/components/clinical-academy/clinical-academy-chrome";
import { ecgAdvancedLeafBreadcrumbs } from "@/lib/breadcrumbs/academy-breadcrumbs";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";

export const revalidate = 86400;

const PATH = "/advanced-ecg-nursing/critical-care-ecg";
const PAGE_TITLE = "Critical Care ECG for ICU Nurses — Bundle Branch Blocks, Ischemia Monitoring, Telemetry | NurseNest";
const PAGE_H1 = "Critical care ECG interpretation: ICU-focused bundle branch blocks, ventricular ectopy, and hemodynamic instability";
const PAGE_DESCRIPTION =
  "ICU-focused ECG training for critical care and telemetry nurses. Bundle branch block interpretation, ventricular ectopy management, ischemia monitoring in ventilated patients, artifact recognition, hemodynamic instability ECG patterns, and ICU case studies.";

const PILLAR = "/advanced-ecg-nursing";

const SECTIONS = [
  {
    id: "bundle-branch-blocks",
    heading: "Bundle branch block interpretation in the ICU: clinical significance beyond the label",
    body: `Bundle branch blocks (BBB) are among the most frequently encountered abnormal ECG patterns in critical care settings, yet their clinical significance is often underappreciated or mischaracterized. Understanding BBB in the ICU context requires more than identification — it requires integrating the finding with hemodynamic status, medication exposures, and trajectory.

Right bundle branch block (RBBB) is characterized by QRS duration > 120 ms, a terminal R wave in V1 (rSR' or "rabbit ears" pattern), and wide slurred S waves in leads I, aVL, and V5–V6. The right bundle branch is supplied by the anterior descending artery and is more susceptible to ischemic injury than the left bundle. New RBBB in the setting of acute anterior MI suggests proximal LAD involvement affecting the septal perforators. New RBBB in a septic patient may reflect right heart strain — a pattern also seen in massive pulmonary embolism, where acute cor pulmonale produces RBBB along with the S1Q3T3 pattern.

Left bundle branch block (LBBB) is the ECG pattern that most complicates ischemia detection. LBBB produces secondary ST-T changes that can both mimic ischemia (ST elevation in LBBB-morphology leads is expected and not diagnostic of STEMI) and mask ischemia (new ischemic changes may be superimposed on the BBB pattern). Sgarbossa criteria provide a validated approach to identifying superimposed MI in LBBB: ST elevation concordant with the QRS (both positive) is the most specific criterion — because LBBB characteristically produces discordant ST changes, any concordant ST elevation is abnormal and suggests STEMI.

New BBB in a critically ill patient always requires clinical correlation. Rate-related BBB (aberrancy) — which appears at faster heart rates and resolves when rate decreases — is common in sepsis and needs to be distinguished from fixed BBB to avoid unnecessary intervention. Rate-related aberrancy most commonly produces RBBB morphology at the higher rate, resolving to normal conduction below a patient-specific threshold rate.`,
  },
  {
    id: "ventricular-ectopy-icu",
    heading: "Ventricular ectopy in the ICU: benign context vs hemodynamic threat",
    body: `Premature ventricular complexes (PVCs) are nearly universal in critically ill patients, reflecting the irritable myocardium of metabolic derangement, electrolyte abnormality, ischemia, or catecholamine excess. Differentiating clinically significant ectopy from benign PVCs requires integration of frequency, morphology, hemodynamic impact, and clinical context.

PVC morphology characterization guides management. Uniform PVCs — all from the same ectopic focus, identical morphology — are generally less concerning than multifocal PVCs (different morphologies from different foci), which suggest diffuse myocardial irritability. Bigeminy (alternating native and PVC beats) reduces effective heart rate by half and can cause significant cardiac output reduction in patients with poor contractility or high heart rate dependence. Runs of three or more consecutive PVCs constitute non-sustained ventricular tachycardia (NSVT) — a finding that requires electrocardiographic and clinical reassessment.

R-on-T phenomenon — a PVC occurring during the vulnerable period of the preceding T-wave — is the ECG finding that preceded fatal arrhythmias in multiple landmark studies. The mechanism is that the ventricle is in a state of non-uniform repolarization during the T-wave, creating the electrical substrate for reentry. While R-on-T does not inevitably trigger VF, its presence in the setting of prolonged QT, acute ischemia, or electrolyte abnormality substantially elevates risk and requires immediate notification and electrolyte assessment.

The most common reversible causes of new or worsening PVCs in the ICU are hypokalemia, hypomagnesemia, hypoxia, acidosis, ischemia, and catecholamine-containing vasopressor infusions. Correcting potassium to > 4 mEq/L and magnesium to > 2 mg/dL reduces PVC burden in the majority of cases without requiring antiarrhythmic therapy, which carries its own proarrhythmic risk.`,
  },
  {
    id: "ischemia-monitoring-icu",
    heading: "Ischemia monitoring in the ICU: detecting silent ischemia in ventilated and sedated patients",
    body: `Critically ill patients frequently cannot report chest pain — they may be intubated, sedated, pharmacologically paralyzed, or altered from encephalopathy. Silent ischemia — coronary artery occlusion without pain — is substantially more common in critically ill patients than in ambulatory populations and requires proactive ECG monitoring rather than symptom-driven response.

Continuous ST-segment monitoring is the standard of care in cardiac intensive care units and is increasingly used in medical ICUs for high-risk patients. Modern telemetry systems display real-time ST trends across multiple leads, alerting clinicians to ST elevation or depression thresholds defined per patient baseline. The most sensitive lead configurations for ischemia detection use leads III (inferior wall) and V5 (lateral wall) in combination — this two-lead combination detects approximately 80% of ischemic events that would require a full 12-lead to characterize.

Serial 12-lead ECGs remain essential for ischemia characterization that continuous single-lead monitoring misses. Posterior wall ischemia, non-classic STEMI equivalents, and right ventricular involvement require the full 12-lead perspective. In intubated patients, establishing a baseline 12-lead ECG on ICU admission and repeating it with any unexplained hemodynamic deterioration is a standard safety practice.

New bundle branch block, new Q waves, or new ST changes in a critically ill patient with unexplained hypotension, elevation in troponin, new arrhythmia, or decreased cardiac output are ischemic until proven otherwise. The clinical temptation to attribute ECG changes to "critical illness" or "septic cardiomyopathy" without coronary evaluation delays time-sensitive revascularization when an acute coronary event is the precipitant.`,
  },
  {
    id: "artifact-recognition",
    heading: "Artifact recognition in the ICU: when the monitor lies",
    body: `Artifact is the most common false-positive ECG finding in the ICU and is responsible for a significant proportion of unnecessary emergency responses, inappropriate therapy, and alarm fatigue-driven desensitization that ultimately misses real events. Systematic artifact recognition is a learnable clinical skill.

Motion artifact produces irregular, high-frequency baseline interference that can completely obscure QRS complexes or, at lower amplitude, mimic atrial fibrillation or ventricular fibrillation. The distinguishing feature of motion artifact is that it occurs in distinct bursts corresponding to patient movement, and that the underlying rhythm often becomes visible during artifact-free intervals. When VF is suspected but the patient remains responsive, artifact is the more likely diagnosis — confirm with a different lead or a brief limb immobilization.

60-Hz electrical interference appears as a perfectly regular fine oscillation at 60 cycles per second superimposed on the baseline. It is caused by inadequate electrode grounding or proximity to electrical equipment. The regular, perfectly uniform frequency distinguishes 60-Hz interference from biological signals. It does not mimic dangerous rhythms but degrades QRS and ST measurement accuracy.

Electrode placement errors are systematic and produce consistent changes. Limb lead reversals — such as right arm/left arm reversal — produce characteristic patterns including negative P-QRS-T in lead I and apparent left axis deviation. Standard electrode placement confirmation is the first step in any "abnormal" ECG that appears inconsistent with clinical context. Precordial electrode misplacement shifts R-wave progression and can produce false poor R-wave progression mimicking anterior MI or false ST changes.`,
  },
];

const FAQ_ITEMS = [
  {
    question: "How do Sgarbossa criteria help identify STEMI in the presence of LBBB?",
    answer:
      "Sgarbossa criteria identify three ECG features that are abnormal in LBBB and suggest superimposed MI: (1) ST elevation ≥1 mm concordant with the QRS direction (most specific — concordant ST elevation is never expected in LBBB), (2) ST depression ≥1 mm in V1, V2, or V3 (unexpected in LBBB where ST elevation is the norm in these leads), (3) ST elevation ≥5 mm discordant with the QRS (proportionality criterion — discordant elevation >25% of the preceding S-wave amplitude is the modified Smith-Sgarbossa criterion). Any of these in a patient with acute symptoms warrants emergent cardiology evaluation.",
  },
  {
    question: "When should PVCs in an ICU patient prompt immediate intervention?",
    answer:
      "Immediate intervention is warranted for: R-on-T PVCs (especially with prolonged QT), runs of NSVT (≥3 consecutive PVCs), PVC-triggered hemodynamic compromise, new PVCs in the context of acute MI or ischemia, and PVCs with multifocal morphology in the setting of electrolyte disturbance or drug toxicity. The first steps are always electrolyte correction (K+ > 4, Mg2+ > 2), oxygen optimization, ischemia assessment, and medication review before antiarrhythmic escalation.",
  },
  {
    question: "How should nurses approach unexplained hemodynamic deterioration in an ICU patient on telemetry?",
    answer:
      "In unexplained hemodynamic deterioration, obtain a 12-lead ECG immediately — not just a rhythm strip. Look for: new ST changes (ischemia or right heart strain), new conduction abnormality (BBB, AV block), rate/rhythm changes, signs of pericardial effusion (electrical alternans, sinus tachycardia with low voltage), or pulmonary embolism patterns (S1Q3T3, new RBBB, sinus tachycardia). The ECG is one of several simultaneous assessments — chest X-ray, bedside echo, and laboratory assessment run concurrently.",
  },
  {
    question: "What are the most common ICU-specific causes of new arrhythmias?",
    answer:
      "The most common reversible causes of new ICU arrhythmias are: hypokalemia and hypomagnesemia (new PVCs, torsades), hypoxia (sinus tachycardia, atrial arrhythmias), septic cardiomyopathy (new AF, reduced EF, sinus tachycardia), acid-base disturbances (metabolic acidosis causes VF at extremes), vasopressor-related catecholamine excess (AF, PVCs, VT), medication toxicity (see medication-induced ECG changes), and pulmonary embolism (sinus tachycardia, new RBBB, S1Q3T3). Systematic assessment of each category guides targeted treatment.",
  },
];

const RELATED_LINKS = [
  { href: PILLAR, label: "Advanced ECG for Nurses" },
  { href: "/advanced-ecg-nursing/acls-rhythms", label: "ACLS Rhythms" },
  { href: "/advanced-ecg-nursing/12-lead-stemi", label: "12-Lead STEMI Interpretation" },
  { href: "/advanced-ecg-nursing/electrolyte-ecg-changes", label: "Electrolyte ECG Changes" },
  { href: "/advanced-ecg-nursing/telemetry-monitoring", label: "Telemetry Monitoring" },
  { href: "/advanced-ecg-nursing/ecg-case-simulations", label: "ECG Case Simulations" },
  { href: "/ecg-telemetry-mastery", label: "ECG Telemetry Mastery" },
];

const COVERAGE_ITEMS = [
  "RBBB: rSR' in V1, clinical significance in ischemia and PE",
  "LBBB: ischemia masking, Sgarbossa concordant ST elevation criterion",
  "Rate-related BBB: aberrancy vs fixed block distinction",
  "PVC assessment: uniform vs multifocal, bigeminy hemodynamic impact",
  "R-on-T: vulnerable period, QT prolongation, immediate escalation",
  "Reversible PVC causes: K+, Mg2+, hypoxia, vasopressors",
  "Silent ischemia: continuous ST monitoring, serial 12-lead protocol",
  "Posterior wall ischemia: V3R-V5R, full 12-lead necessity",
  "Motion artifact: VF mimicry, patient responsiveness confirms artifact",
  "60-Hz interference: equipment grounding, does not mimic danger",
  "Electrode reversal: RA/LA swap — negative lead I, apparent axis shift",
  "Hemodynamic deterioration ECG protocol: 12-lead first, concurrent assessment",
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
          "critical care ECG nursing",
          "ICU ECG interpretation",
          "bundle branch block ICU nursing",
          "ventricular ectopy ICU nursing",
          "Sgarbossa criteria nursing",
          "ischemia monitoring ICU",
          "ECG artifact recognition",
          "telemetry ICU nurse",
          "PVC ICU nursing",
          "silent ischemia ICU nursing",
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
    { pathname: PATH, locale: DEFAULT_MARKETING_LOCALE, routeGroup: "marketing.default.advancedEcgCriticalCare" },
  );
}

export default function CriticalCareEcgPage() {

  const breadcrumbResolution = ecgAdvancedLeafBreadcrumbs('Critical Care ECG', PATH);
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
        <AcademyBreadcrumbBar resolution={breadcrumbResolution} />
<header className="mb-10 space-y-4">
          <div className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--semantic-danger)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-danger)_08%,var(--semantic-surface))] text-[var(--semantic-danger)]">
              <Activity className="h-5 w-5" aria-hidden />
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--semantic-text-muted)]">
              ECG Mastery · Critical Care ECG
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
              Practice Critical Care ECG
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

        <section className="mb-10 rounded-2xl border border-[color-mix(in_srgb,var(--semantic-danger)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_18%,var(--semantic-surface))] p-5 sm:p-6">
          <h2 className="text-base font-semibold text-[var(--semantic-text-primary)]">Critical care ECG coverage at a glance</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {COVERAGE_ITEMS.map((item) => (
              <li key={item} className="flex items-start gap-2 text-xs text-[var(--semantic-text-secondary)]">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--semantic-danger)]" aria-hidden />
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
