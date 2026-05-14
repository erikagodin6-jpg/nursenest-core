import type { Metadata } from "next";
import Link from "next/link";
import { Activity, ArrowRight, CheckCircle2 } from "lucide-react";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";

export const revalidate = 86400;

const PATH = "/advanced-ecg-nursing/medication-induced-ecg-changes";
const PAGE_TITLE = "Medication-Induced ECG Changes for Nurses — Digoxin, QT Prolongation, Antiarrhythmics | NurseNest";
const PAGE_H1 = "Medication-induced ECG changes: digoxin toxicity, QT prolongation, sodium channel blockade, and antiarrhythmic monitoring";
const PAGE_DESCRIPTION =
  "Clinician-reviewed pharmacologic ECG pattern training for RN and NP. Recognize digoxin toxicity, QT-prolonging drug effects, TCA overdose sodium channel blockade, beta-blocker and calcium channel blocker ECG changes, and antiarrhythmic monitoring requirements.";

const PILLAR = "/advanced-ecg-nursing";

const SECTIONS = [
  {
    id: "digoxin-toxicity-ecg",
    heading: "Digoxin toxicity ECG patterns: from therapeutic effect to life-threatening arrhythmia",
    body: `Digoxin produces distinct ECG changes at therapeutic levels that must be distinguished from the arrhythmias of toxicity. Understanding both the expected and toxic signatures prevents dangerous misinterpretation in patients on chronic digoxin therapy.

Therapeutic digoxin effect produces the characteristic "digitalis effect" or "Salvador Dalí mustache" appearance: downsloping ST depression with a scooped or sagging morphology, shortened QT interval from accelerated repolarization, and flattened or inverted T-waves in leads with prominent R-waves. These findings are expected in patients receiving digoxin and do not represent toxicity or ischemia. Identifying them correctly prevents unnecessary workup and medication changes.

Digoxin toxicity produces a spectrum of arrhythmias tied to its dual mechanism: increased automaticity (causing ectopy) and decreased AV conduction (causing blocks). The most common toxic arrhythmia is bigeminal PVCs — a pattern of alternating native beats and premature ventricular complexes — which appears because digoxin sensitizes pacemaker cells to triggered activity. Paroxysmal atrial tachycardia with AV block (PAT with block) is nearly pathognomonic for digoxin toxicity when present: the atrial rate is typically 150–250 bpm, and there is 2:1 or variable block at the AV node from digoxin's vagotonic effects. Junctional tachycardia with AV dissociation reflects enhanced automaticity in the AV junctional tissue.

Bidirectional ventricular tachycardia — alternating QRS axis with each beat — is the most severe manifestation of digoxin toxicity and carries high mortality if not recognized immediately. This pattern is so specifically associated with digoxin toxicity and catecholaminergic polymorphic VT (CPVT) that its presence should prompt immediate toxicologic evaluation and consideration of digoxin-specific Fab fragment antibody therapy.

Digoxin level does not perfectly predict toxicity. Clinical toxicity can occur at "therapeutic" levels in patients with hypokalemia, hypomagnesemia, hypothyroidism, or renal impairment. Conversely, some patients tolerate elevated digoxin levels without toxicity. The ECG and clinical presentation guide management decisions alongside the level.`,
  },
  {
    id: "qt-prolongation",
    heading: "QT prolongation and torsades risk: the drug combinations every nurse must recognize",
    body: `QT interval prolongation is the ECG substrate for torsades de pointes, a potentially lethal polymorphic ventricular tachycardia. Nurses caring for patients on QT-prolonging medications must understand the risk assessment, the monitoring requirements, and the intervention thresholds.

QTc (corrected QT interval) is the standard monitoring metric. Normal QTc is less than 450 ms in men and less than 470 ms in women. A QTc exceeding 500 ms carries significantly elevated torsades risk and should trigger medication review and electrolyte assessment. A QTc increase of more than 60 ms from baseline is also a clinically significant change regardless of the absolute value.

The QT-prolonging drug categories with highest clinical frequency in hospital settings include: Class IA antiarrhythmics (quinidine, procainamide, disopyramide), Class III antiarrhythmics (amiodarone, sotalol, dofetilide), certain antibiotics (azithromycin, fluoroquinolones — particularly moxifloxacin), antipsychotics (haloperidol, quetiapine, ziprasidone), antiemetics (ondansetron, metoclopramide at high doses), and methadone. The critical safety principle is additivity: each additional QT-prolonging drug increases QTc independently, and two agents with modest individual effects can combine to produce dangerous prolongation.

Drug-drug interactions that amplify QT risk through altered metabolism require specific recognition. Azithromycin combined with fluconazole (which inhibits CYP3A4 metabolism of azithromycin) produces substantially higher azithromycin exposure. Haloperidol at high intravenous doses — a common ICU sedation agent for agitation — has been associated with fatal torsades, particularly in patients with concurrent hypokalemia and receiving other QT-prolonging agents. Nursing assessment should include review of all QT-prolonging agents, electrolyte levels, and baseline QTc before initiating any new QT-prolonging medication.`,
  },
  {
    id: "sodium-channel-blockade",
    heading: "Sodium channel blockade ECG patterns: TCA overdose, flecainide, cocaine toxicity",
    body: `Sodium channel blockers produce a characteristic and immediately recognizable ECG pattern that represents a toxicologic emergency. Fast sodium channel blockade slows phase 0 depolarization — the initial rapid upstroke of the action potential — producing QRS widening and specific morphologic changes that predict serious complications.

Tricyclic antidepressant (TCA) overdose is the most clinically important sodium channel blockade scenario in emergency and critical care nursing. The ECG changes of TCA toxicity are specific and prognostically critical. QRS widening greater than 100 ms correlates with seizure risk; QRS widening greater than 160 ms correlates with ventricular arrhythmia risk. A terminal R wave in aVR (positive deflection in the terminal portion of the QRS in lead aVR) greater than 3 mm or an R-to-S ratio in aVR greater than 0.7 is the most specific ECG finding for TCA toxicity and identifies patients at highest risk for seizures and ventricular tachycardia. The treatment is sodium bicarbonate IV — the mechanism is competitive sodium loading (overcomes channel blockade) combined with alkalinization (reduces drug-channel binding).

Class IC antiarrhythmics (flecainide, propafenone) produce use-dependent sodium channel blockade with rate-dependent QRS widening. Flecainide toxicity can cause marked QRS prolongation, a sinusoidal VT pattern, and complete AV block. In patients presenting with wide-complex tachycardia and a history of flecainide use, hypertonic sodium bicarbonate is the specific antidote. The distinction between flecainide-induced wide-complex tachycardia and true ventricular tachycardia has direct management implications.

Cocaine toxicity causes sodium channel blockade through a similar mechanism to TCAs, often combined with adrenergic stimulation producing simultaneous tachycardia and QRS widening. Cocaine-associated chest pain with ECG changes requires both ST-elevation assessment (cocaine causes coronary vasospasm) and QRS width monitoring (sodium channel blockade risk). Calcium channel blockers and beta-blockers are relatively contraindicated because adrenergic stimulation may be protective; sodium bicarbonate and benzodiazepines are preferred for acute toxicity management.`,
  },
  {
    id: "antiarrhythmic-monitoring",
    heading: "Antiarrhythmic ECG monitoring: what nurses must track for each drug class",
    body: `Antiarrhythmic medications require ECG monitoring as a core nursing safety responsibility. Each drug class produces expected ECG changes and has toxicity thresholds detectable on the rhythm strip or 12-lead before clinical deterioration occurs.

Beta-blockers decrease heart rate and prolong AV conduction, producing PR interval prolongation and bradycardia at therapeutic doses. Toxicity manifests as high-degree AV block, severe bradycardia, and QRS widening (from sodium channel effects at high doses). The combination of bradycardia, hypotension, and QRS widening in a patient on beta-blocker therapy requires immediate dose assessment and electrolyte review.

Calcium channel blockers (non-dihydropyridine: diltiazem, verapamil) prolong AV nodal conduction at therapeutic doses, producing PR prolongation and rate reduction in Afib. Toxicity causes severe bradycardia, high-degree AV block, junctional rhythm, and hypotension from peripheral vasodilation and negative inotropy. The ECG-specific toxicity signal is progressive PR prolongation leading to Wenckebach patterns or complete AV block.

Amiodarone requires QTc monitoring because its multi-channel blockade prolongs repolarization. Expected QTc prolongation during amiodarone therapy is approximately 60–80 ms. A QTc exceeding 550 ms on amiodarone, or a QTc increase of greater than 100 ms from baseline, suggests excess drug effect and warrants dose assessment. Amiodarone also causes thyroid dysfunction (hyper and hypothyroidism), pulmonary toxicity, and hepatotoxicity — the ECG monitors the cardiac component while other organ systems require separate surveillance.`,
  },
];

const FAQ_ITEMS = [
  {
    question: "What ECG finding is most specific for digoxin toxicity vs therapeutic effect?",
    answer:
      "The scooped downsloping ST depression (digitalis effect) is an expected therapeutic finding, not toxicity. Toxic ECG patterns include: bigeminal PVCs (most common), PAT with AV block (nearly pathognomonic when present), junctional tachycardia with AV dissociation, and bidirectional ventricular tachycardia (most severe, alternating QRS axis). The bidirectional VT is so specific for digoxin toxicity and CPVT that its presence mandates immediate toxicologic evaluation. Digoxin-specific Fab fragments treat life-threatening toxicity.",
  },
  {
    question: "At what QTc value should nurses escalate about QT prolongation risk?",
    answer:
      "QTc exceeding 500 ms is the standard escalation threshold — this represents clinically significant prolongation that markedly increases torsades risk. Additionally, a QTc increase greater than 60 ms from baseline warrants notification regardless of absolute value. Actionable steps: notify provider, review all QT-prolonging medications, check and correct electrolytes (potassium > 4 mEq/L, magnesium > 2 mg/dL), and initiate continuous telemetry monitoring if not already in place.",
  },
  {
    question: "What is the TCA overdose ECG finding that predicts arrhythmia risk?",
    answer:
      "A terminal R wave in lead aVR greater than 3 mm, or an R:S ratio in aVR greater than 0.7, is the most specific ECG marker for TCA sodium channel blockade and predicts ventricular arrhythmia and seizure risk. QRS widening is the general marker: >100 ms correlates with seizure risk, >160 ms with ventricular arrhythmia. Treatment is sodium bicarbonate 1–2 mEq/kg IV to overcome channel blockade and alkalinize plasma (shifting drug off channels). Target arterial pH 7.45–7.55.",
  },
  {
    question: "Which antiarrhythmics require the most careful QTc monitoring?",
    answer:
      "Sotalol (Class III + beta-blocker) and dofetilide require stringent QTc monitoring and are often initiated only in monitored settings with baseline QTc requirements. QTc >500 ms or increase >60 ms warrants dose hold. Amiodarone causes QTc prolongation but has lower torsades risk due to its multiple channel effects (including sodium channel blockade that stabilizes). Quinidine and procainamide (Class IA) have higher torsades risk relative to amiodarone. Flecainide monitoring focuses on QRS width rather than QTc.",
  },
];

const RELATED_LINKS = [
  { href: PILLAR, label: "Advanced ECG for Nurses" },
  { href: "/advanced-ecg-nursing/electrolyte-ecg-changes", label: "Electrolyte ECG Changes" },
  { href: "/advanced-ecg-nursing/acls-rhythms", label: "ACLS Rhythms" },
  { href: "/advanced-ecg-nursing/critical-care-ecg", label: "Critical Care ECG" },
  { href: "/advanced-ecg-nursing/ecg-case-simulations", label: "ECG Case Simulations" },
  { href: "/ecg-interpretation", label: "ECG Interpretation for Nurses" },
  { href: "/ecg-telemetry-mastery", label: "ECG Telemetry Mastery" },
];

const COVERAGE_ITEMS = [
  "Digoxin effect: scooped ST vs toxicity arrhythmias — bigeminy, PAT with block",
  "Bidirectional VT: digoxin signature, Fab fragment antidote",
  "QTc thresholds: >500ms escalation, >60ms increase from baseline",
  "High-risk QT drug combinations: azithromycin, haloperidol, ondansetron",
  "TCA overdose: terminal R in aVR, QRS > 100ms seizure risk threshold",
  "Sodium bicarbonate: TCA and sodium channel blockade antidote",
  "Flecainide toxicity: use-dependent QRS widening, sinusoidal VT",
  "Cocaine: vasospasm + sodium channel blockade dual ECG risk",
  "Beta-blocker monitoring: PR prolongation, bradycardia, toxicity thresholds",
  "Calcium channel blocker toxicity: progressive AV block, junctional rhythm",
  "Amiodarone: expected QTc shift, >550ms dose-review threshold",
  "Sotalol and dofetilide: stringent QTc monitoring requirements",
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
          "medication induced ECG changes nursing",
          "digoxin toxicity ECG",
          "QT prolongation nursing",
          "TCA overdose ECG nursing",
          "sodium channel blockade ECG",
          "antiarrhythmic ECG monitoring",
          "drug ECG changes nursing",
          "QTc monitoring nursing",
          "torsades risk medications",
          "amiodarone ECG monitoring",
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
    { pathname: PATH, locale: DEFAULT_MARKETING_LOCALE, routeGroup: "marketing.default.advancedEcgMedications" },
  );
}

export default function MedicationEcgChangesPage() {
  const breadcrumbs = [
    { name: "NurseNest", href: "/" },
    { name: "ECG Interpretation", href: "/ecg-interpretation" },
    { name: "Advanced ECG for Nurses", href: PILLAR },
    { name: "Medication-Induced ECG Changes", href: PATH },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `https://nursenest.io${PATH}`,
        url: `https://nursenest.io${PATH}`,
        name: PAGE_TITLE,
        description: PAGE_DESCRIPTION,
        headline: PAGE_H1,
        inLanguage: "en",
        author: { "@type": "Organization", name: "NurseNest" },
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: breadcrumbs.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: c.name,
            item: `https://nursenest.io${c.href}`,
          })),
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ_ITEMS.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs text-[var(--semantic-text-muted)]">
            {breadcrumbs.map((c, i) => (
              <li key={c.href} className="flex items-center gap-1.5">
                {i > 0 && <span aria-hidden>/</span>}
                {i < breadcrumbs.length - 1 ? (
                  <Link href={c.href} className="hover:underline">{c.name}</Link>
                ) : (
                  <span className="text-[var(--semantic-text-secondary)]">{c.name}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <header className="mb-10 space-y-4">
          <div className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--semantic-chart-1)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-1)_08%,var(--semantic-surface))] text-[var(--semantic-chart-1)]">
              <Activity className="h-5 w-5" aria-hidden />
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--semantic-text-muted)]">
              ECG Mastery · Medication-Induced ECG Changes
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
              Practice Medication ECG Cases
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
          <h2 className="text-base font-semibold text-[var(--semantic-text-primary)]">Medication ECG coverage at a glance</h2>
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
