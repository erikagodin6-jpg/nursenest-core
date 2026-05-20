import type { Metadata } from "next";
import Link from "next/link";
import { Activity, ArrowRight, CheckCircle2 } from "lucide-react";
import { AcademyBreadcrumbBar, ClinicalAcademyJsonLdGraph } from "@/components/clinical-academy/clinical-academy-chrome";
import { ecgAdvancedLeafBreadcrumbs } from "@/lib/breadcrumbs/academy-breadcrumbs";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";

export const revalidate = 86400;

const PATH = "/advanced-ecg-nursing/ecg-case-simulations";
const PAGE_TITLE = "ECG Case Simulations for Nurses — Branching Clinical ECG Scenarios | NurseNest";
const PAGE_H1 = "ECG case simulations: branching clinical scenarios with evolving rhythms, deterioration logic, and intervention consequences";
const PAGE_DESCRIPTION =
  "Premium branching ECG clinical simulations for RN and NP. Evolving patient vitals, changing ECGs, STEMI progression, hyperkalemia arrest, torsades after QT prolongation, septic shock arrhythmia, and branching decision pathways with real clinical consequences.";

const PILLAR = "/advanced-ecg-nursing";

const SECTIONS = [
  {
    id: "why-branching-simulation",
    heading: "Why branching ECG simulations build clinical judgment that drills cannot",
    body: `Pattern recognition drills — identifying a strip and selecting a rhythm label — train the first step of clinical ECG competency. Branching simulations train the second and more difficult step: deciding what to do about the rhythm, in the context of a real patient, with consequences that follow from each decision. The cognitive difference is substantial, and the second skill is the one that transfers to actual clinical performance.

In a rhythm drill, the ECG is static and the task is identification. In a clinical simulation, the ECG changes based on the patient's trajectory and the nurse's actions. A defibrillation decision produces a post-shock rhythm. A medication administration changes the rate and morphology. A delay in recognizing deterioration is reflected in worsening hemodynamics. The simulation creates a feedback loop that static drills cannot provide: every decision has a consequence visible in the next clinical frame.

This structure develops several cognitive skills simultaneously. Clinical judgment — knowing not just what the rhythm is, but when it requires intervention and which intervention — develops through repeated exposure to scenarios where the stakes of judgment are visible. Anticipatory reasoning — predicting what is likely to happen next based on the current trajectory — develops through scenarios with realistic deterioration logic. Prioritization under uncertainty — managing multiple evolving clinical variables — develops through scenarios where labs, vitals, and rhythms all change in parallel.

The NurseNest ECG Case Simulation engine uses branching pathway logic derived from clinical practice scenarios reviewed by cardiology and critical care educators. Each simulation has three to five decision branches per major decision point, realistic timing of physiologic changes, and a post-simulation debrief that explains not only the optimal pathway but why the alternative pathways were suboptimal.`,
  },
  {
    id: "stemi-progression-scenario",
    heading: "STEMI progression scenario: from chest pain to cath lab activation",
    body: `The STEMI progression simulation presents a patient with new-onset chest pain, diaphoresis, and an initial 12-lead ECG that shows early hyperacute T-waves without clear ST elevation. The first branch: recognize this as a pre-STEMI pattern and initiate serial ECGs, or attribute the T-wave changes to non-cardiac causes and reassess in one hour.

Learners who recognize the hyperacute T-wave pattern and obtain serial ECGs at 15 minutes see the progression to full STEMI criteria. The cath lab activation branch follows: contact the cardiologist immediately, versus wait for one more ECG, versus obtain troponin first before activating. Each branch produces a different door-to-balloon time outcome and a different patient trajectory.

The inferior STEMI branch of the scenario includes the right ventricular MI complication. Learners who administer nitroglycerin to a patient with RV MI (as they would for anterior STEMI) see immediate hemodynamic deterioration — the simulation models the catastrophic hypotension from preload reduction in the RV-dependent state. The clinical lesson is visceral: the ECG finding (V4R ST elevation) is the contraindication trigger, and missing it in the simulation produces a consequence that makes it memorable in practice.

A separate branch of the scenario addresses the Wellens pattern — the patient's pain resolved before the ECG was obtained, and the 12-lead shows biphasic T-waves in V2–V3. The branch challenge: discharge the patient since the pain resolved, or recognize Wellens pattern and activate emergent cardiology evaluation. The discharge branch leads to rearrest within 12 hours. The Wellens recognition branch leads to emergent catheterization revealing 95% LAD stenosis with successful intervention.`,
  },
  {
    id: "hyperkalemia-arrest-scenario",
    heading: "Hyperkalemia arrest scenario: from peaked T-waves to resuscitation",
    body: `The hyperkalemia arrest simulation begins with a dialysis-dependent patient who presents with generalized weakness. Initial vitals show mild bradycardia (54 bpm) and the ECG demonstrates peaked, narrow T-waves with a PR interval of 220 ms. The first branch: recognize early hyperkalemia and initiate treatment, versus attribute the bradycardia to beta-blocker therapy and monitor.

Learners who recognize the hyperkalemia pattern and initiate IV calcium gluconate, insulin-glucose, and sodium bicarbonate see the ECG normalize over 20 minutes and the patient stabilize pending dialysis. Learners who choose to monitor see the ECG progress: QRS widens to 160 ms, P-waves disappear, and the sine wave pattern appears. The branch at this point is defibrillation (the monitor alarmed for a "wide-complex rhythm"), versus immediate calcium administration.

The simulation specifically addresses the common error of attempting defibrillation for hyperkalemia sine wave before stabilizing the membrane with calcium. Defibrillation without calcium in severe hyperkalemia is ineffective — the underlying ionic abnormality is not corrected by the electrical intervention, and VF is likely to recur even if an organized rhythm is transiently achieved. The simulation branch models this: post-defibrillation rhythm briefly organizes then degenerates to VF while the hyperkalemia is uncorrected.

Learners who choose calcium first in the sine wave branch see the QRS narrow, the pattern resolve to a broad-complex rhythm, and the hemodynamics stabilize enough to allow dialysis to be arranged. The post-simulation debrief specifically addresses why the ECG pattern — not the rhythm label — drives treatment decisions in electrolyte emergencies.`,
  },
  {
    id: "qT-torsades-scenario",
    heading: "QT prolongation to torsades scenario: the iatrogenic arrhythmia",
    body: `The QT-prolongation-to-torsades simulation presents an ICU patient on azithromycin for pneumonia, haloperidol for delirium, and ondansetron for nausea, with baseline hypokalemia (K+ 3.1) and hypomagnesemia (Mg2+ 1.6). The initial QTc is 490 ms. The first branch: recognize the QTc and risk factor combination and initiate electrolyte correction plus medication review, versus note the QTc as "borderline" and continue current therapy.

The monitor path shows QTc progressively increasing to 530 ms over 6 hours. A premature ventricular beat triggers torsades de pointes — the telemetry alarm sounds with the characteristic twisting polymorphic VT. The first treatment branch: defibrillation (recognizing it as "VT"), versus magnesium sulfate 2g IV push.

Learners who choose defibrillation without magnesium see the rhythm convert temporarily, then reinitiate torsades within 3 minutes because the substrate (prolonged QT + electrolyte imbalance + QT-prolonging medications) was not addressed. Learners who give magnesium first see the torsades terminate and a sinus tachycardia establish with QTc 510 ms. The next branch: discontinue all QT-prolonging medications and continue electrolyte replacement, versus continue current medications and observe.

The simulation concludes with the provider review of medication lists, electrolyte trends, and QTc trajectory — connecting the pharmacologic decision-making that prevents torsades recurrence to the ECG monitoring that detected the arrhythmia early enough to intervene.`,
  },
];

const FAQ_ITEMS = [
  {
    question: "How are the ECG case simulations different from standard practice questions?",
    answer:
      "Standard ECG practice questions test static rhythm identification: identify the strip and select the correct label or intervention. ECG case simulations present evolving clinical scenarios where the ECG changes based on your decisions, patient vitals update over time, and the consequences of each decision branch are visible in the patient's trajectory. This branching logic trains anticipatory clinical reasoning, prioritization under uncertainty, and the integration of ECG data with clinical context — skills that pattern drills develop only partially.",
  },
  {
    question: "What ECG scenarios are included in the simulation library?",
    answer:
      "The current simulation library includes: STEMI progression with Wellens branch and RV MI complication, hyperkalemia progression from peaked T-waves to sine wave and arrest, QT prolongation to torsades (iatrogenic, with medication de-escalation branch), unstable atrial fibrillation with cardioversion decision, septic shock with tachyarrhythmia and rate control decision, pacemaker malfunction with capture failure and hemodynamic consequences, and aortic stenosis with Afib new-onset and anticoagulation timing.",
  },
  {
    question: "Are the ECG case simulations appropriate for NP-level learners?",
    answer:
      "Yes. Each simulation includes NP-specific branches for diagnostic reasoning decisions (ordering posterior leads, right-sided ECG, echo), prescribing decisions (choosing between antiarrhythmic options, determining rate vs rhythm control), and escalation decision-making (direct cath lab activation vs cardiology consultation). NP learners also encounter documentation and informed consent branches in simulation scenarios involving cardioversion or anticoagulation initiation. The RN and NP branches can be selected at simulation start.",
  },
  {
    question: "Is the simulation gated content or available with the standard subscription?",
    answer:
      "ECG case simulations are premium gated content included with the Advanced ECG add-on module. They are not included in base RN or NP subscriptions. A free preview simulation (STEMI vs non-cardiac chest pain differentiation) is available to all learners. The full simulation library of 7+ cases is unlocked with Advanced ECG module activation.",
  },
];

const RELATED_LINKS = [
  { href: PILLAR, label: "Advanced ECG for Nurses" },
  { href: "/advanced-ecg-nursing/12-lead-stemi", label: "12-Lead STEMI Interpretation" },
  { href: "/advanced-ecg-nursing/acls-rhythms", label: "ACLS Rhythms" },
  { href: "/advanced-ecg-nursing/electrolyte-ecg-changes", label: "Electrolyte ECG Changes" },
  { href: "/advanced-ecg-nursing/medication-induced-ecg-changes", label: "Medication-Induced ECG Changes" },
  { href: "/advanced-ecg-nursing/critical-care-ecg", label: "Critical Care ECG" },
  { href: "/ecg-telemetry-mastery", label: "ECG Telemetry Mastery" },
];

const COVERAGE_ITEMS = [
  "Branching ECG logic: decisions that change rhythm and vitals in real time",
  "STEMI progression: hyperacute T-waves → cath lab activation → RV MI",
  "Wellens pattern: pain-free ECG, discharge vs emergent catheterization branch",
  "Hyperkalemia arrest: sine wave → calcium first vs defibrillate first branch",
  "QT-to-torsades: iatrogenic scenario, magnesium vs defibrillation decision",
  "Unstable Afib: cardioversion timing, anticoagulation decision branch",
  "Pacemaker malfunction: failure to capture consequences in dependent patient",
  "Septic shock arrhythmia: rate vs rhythm control, hemodynamic correlation",
  "NP branches: diagnostic ordering, prescribing, escalation decision paths",
  "Post-simulation debrief: optimal vs suboptimal pathway explanation",
  "Free preview simulation: STEMI vs non-cardiac chest pain",
  "Premium library: 7+ cases included with Advanced ECG add-on",
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
          "ECG case simulations nursing",
          "ECG clinical scenarios nursing",
          "branching ECG simulation",
          "STEMI simulation nursing",
          "cardiac simulation nursing",
          "ECG clinical reasoning nursing",
          "advanced ECG case studies",
          "torsades simulation nursing",
          "hyperkalemia ECG simulation",
          "NP ECG case simulations",
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
    { pathname: PATH, locale: DEFAULT_MARKETING_LOCALE, routeGroup: "marketing.default.advancedEcgCaseSimulations" },
  );
}

export default function EcgCaseSimulationsPage() {

  const breadcrumbResolution = ecgAdvancedLeafBreadcrumbs('ECG Case Simulations', PATH);
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
              ECG Mastery · Case Simulations
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
              Start ECG Simulations
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
          <h2 className="text-base font-semibold text-[var(--semantic-text-primary)]">ECG simulation coverage at a glance</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {COVERAGE_ITEMS.map((item) => (
              <li key={item} className="flex items-start gap-2 text-xs text-[var(--semantic-text-secondary)]">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--semantic-chart-1)]" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-10 rounded-2xl border border-[color-mix(in_srgb,var(--semantic-chart-1)_15%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] p-5 sm:p-6">
          <h2 className="text-base font-semibold text-[var(--semantic-text-primary)]">Master ECG interpretation with real clinical simulations</h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
            The ECG Case Simulation library is included with the Advanced ECG add-on. Unlock branching scenarios, evolving rhythms, and consequence-driven clinical reasoning for RN and NP learners.
          </p>
          <Link
            href="/pricing"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-[var(--role-cta)] px-5 py-2.5 text-sm font-semibold text-[var(--role-cta-foreground)] shadow-[0_2px_10px_var(--role-cta-shadow)]"
          >
            Unlock Advanced ECG
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
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
