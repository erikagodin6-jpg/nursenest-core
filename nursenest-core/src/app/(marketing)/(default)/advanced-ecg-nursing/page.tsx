import type { Metadata } from "next";
import Link from "next/link";
import { Activity, ArrowRight, CheckCircle2 } from "lucide-react";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";

export const revalidate = 86400;

const PATH = "/advanced-ecg-nursing";
const PAGE_TITLE = "Advanced ECG for Nurses — Specialty Rhythm Interpretation & Clinical Decision-Making | NurseNest";
const PAGE_H1 = "Advanced ECG for nurses: beyond rhythm labels into clinical decisions";
const PAGE_DESCRIPTION =
  "Clinician-reviewed advanced ECG training for RN and NP. VT differentiation, STEMI equivalents, pacemaker malfunction, toxicology ECG patterns, and ACLS-integrated decision pathways for ICU, CCU, ER, and telemetry nurses.";

const SECTIONS = [
  {
    id: "vt-vs-svt",
    heading: "VT vs SVT differentiation: the most dangerous diagnostic error in telemetry",
    body: `Wide-complex tachycardia presents one of the highest-stakes diagnostic challenges in nursing. The default assumption must be ventricular tachycardia — not SVT with aberrancy — because the consequence of treating VT as SVT (administering verapamil or diltiazem) can cause hemodynamic collapse in minutes.

The Brugada four-step algorithm provides a systematic approach: first, assess whether an RS complex is absent in all precordial leads — its absence is the most specific criterion for VT. Second, evaluate RS interval duration in any lead. Third, look for AV dissociation (P waves marching independently through QRS). Fourth, apply morphologic criteria in V1 and V6. Each step — applied in sequence — identifies VT before SVT by default.

Morphologic criteria add precision. In RBBB-pattern wide-complex tachycardia, true RBBB aberrancy shows a triphasic rSR' in V1 with upright Rs in V6. VT with RBBB-like morphology shows monophasic R or qR in V1 and QS or rS (negative) in V6. In LBBB-pattern tachycardia, true LBBB aberrancy has a clean, rapid downstroke in V1. VT with LBBB-like morphology shows a notched or slurred downstroke and initial r wave greater than 30 ms — reflecting slow activation through diseased myocardium rather than the rapid His-Purkinje system.

AV dissociation — visible as P waves "marching through" the QRS at a different rate — confirms VT definitively. Capture beats (narrow complexes during VT when a sinus impulse transiently conducts through the AV node) and fusion beats (hybrid complexes from simultaneous sinus and ventricular activation) are pathognomonic for VT. Their presence eliminates SVT with aberrancy from consideration entirely.`,
  },
  {
    id: "stemi-equivalents",
    heading: "STEMI equivalents: the patterns that require cath lab activation without ST elevation",
    body: `Relying on classic ST elevation criteria to identify acute coronary occlusion misses approximately 25% of cases. The occlusion MI (OMI) framework recognizes that several ECG patterns represent acute coronary occlusion requiring emergent reperfusion — even without meeting traditional STEMI criteria.

Posterior STEMI is the most commonly missed pattern. Standard 12-lead ECG shows ST depression in V1–V3 because the standard leads face the anterior wall — they are electrically opposite the posterior wall. The true ST elevation is on the posterior surface, visible only on posterior leads V7, V8, and V9. The key recognition clue is ST depression in V1–V3 with a dominant R wave in V2 (the posterior Q-wave equivalent). Any nurse identifying this pattern in a chest pain patient should request posterior leads and alert the team before waiting for repeat troponins.

De Winter T-waves represent approximately 2% of acute LAD occlusions. The pattern — J-point depression with upsloping ST merging into tall, peaked T-waves in the precordial leads — lacks the classic ST elevation and is consistently missed. Once recognized, it requires the same cath lab activation urgency as an anterior STEMI. Unlike hyperkalemia-peaked T-waves (symmetric, narrow base, no J-point depression), De Winter T-waves have a specific morphology context that distinguishes them.

Wellens syndrome represents a reperfused proximal LAD critical stenosis — the patient is pain-free when the ECG is obtained. Type A shows deeply inverted symmetric T-waves in V2–V3. Type B shows biphasic T-waves in V2–V3. Both patterns indicate a vessel that transiently reperfused and will re-occlude unless urgently revascularized. Stress testing in this context can precipitate massive anterior MI. The pain-free ECG with anterior T-wave changes in a patient with recent chest pain demands same-day cardiology evaluation and likely coronary angiography.`,
  },
  {
    id: "pacemaker-advanced",
    heading: "Advanced pacemaker interpretation: beyond spike-and-capture basics",
    body: `Basic pacemaker interpretation identifies a spike followed by a capture. Advanced pacemaker competency recognizes the specific malfunction patterns that can be immediately life-threatening in pacemaker-dependent patients.

Failure to capture presents as pacer spikes visible at the programmed rate with intermittent or complete absence of QRS complexes following each spike. The clinical significance depends entirely on whether the patient has an adequate native escape rhythm. In a pacemaker-dependent patient with complete heart block and no escape rhythm, failure to capture is a hemodynamic emergency requiring transcutaneous pacing while the cause is identified.

Undersensing — the pacemaker fails to detect native beats and fires inappropriately — produces competitive pacing where spikes fall on native QRS or, critically, on T-waves (R-on-T). This is not a theoretical risk: pacer spikes delivered during the relative refractory period can trigger VF, especially in patients with prolonged QT, ischemia, or electrolyte disturbance. Any telemetry nurse identifying pacer spikes on T-waves must notify the team immediately.

Pacemaker-mediated tachycardia (PMT) — also called endless-loop tachycardia — is a reentry arrhythmia using the pacemaker as the antegrade limb. A ventricular paced beat generates retrograde VA conduction, producing a retrograde P wave that the atrial lead detects as a new atrial event and triggers another ventricular spike. The resulting tachycardia is regular at exactly the programmed upper rate limit. Magnet application converts the device to asynchronous mode and terminates the loop.`,
  },
  {
    id: "toxicology-ecg",
    heading: "Toxicology ECG patterns: recognizing the drug-induced cardiac emergencies",
    body: `Sodium channel blockers produce a characteristic ECG progression that is immediately recognizable once learned. Tricyclic antidepressants, flecainide, cocaine, and diphenhydramine block fast sodium channels, causing progressive QRS widening. A terminal R wave in aVR — greater than 3 mm in amplitude, or an R-to-S ratio greater than 0.7 — is highly specific for TCA toxicity and predicts both seizure risk and VT risk. Treatment is IV sodium bicarbonate, which overcomes channel blockade through competitive sodium loading and pH-dependent drug-binding reduction.

QT-prolonging drug combinations are uniquely dangerous because their effects are additive and often synergistic. Azithromycin, haloperidol, methadone, ondansetron, and many common antibiotics all independently prolong QTc. When combined in a hospitalized patient with concurrent hypokalemia and hypomagnesemia, the result can be a QTc exceeding 600 ms with imminent torsades risk. Proactive telemetry monitoring with QTc trend surveillance — and immediate notification when QTc exceeds 500 ms or increases more than 60 ms from baseline — is a patient safety intervention that prevents arrests.

Digoxin toxicity produces a characteristic arrhythmic signature: bigeminal PVCs (the most common pattern), paroxysmal atrial tachycardia with AV block (nearly pathognomonic when present), junctional tachycardia, and bidirectional VT in severe toxicity. The bidirectional VT pattern — alternating QRS axis with each beat — is so specifically associated with digitalis toxicity and catecholaminergic polymorphic VT that its presence should prompt immediate toxicologic or genetic investigation. Treatment is digoxin-specific Fab antibody fragments for life-threatening toxicity.`,
  },
];

const FAQ_ITEMS = [
  {
    question: "What ECG topics are covered in the Advanced ECG module?",
    answer:
      "The module covers nine clinical tracks: Advanced ECG Foundations, 12-Lead Interpretation, Ischemia and Infarction (including STEMI equivalents), Conduction Blocks, Pacemakers, Electrolytes and Toxicology, Critical-Care Telemetry, ACLS ECG Decision-Making, and Advanced ECG Case Studies. Specialty expansion content covers ARVC, cardiac tamponade with electrical alternans, Takotsubo cardiomyopathy, LV aneurysm patterns, massive PE ECG changes, HOCM, channelopathies (Brugada, short QT, LQTS genotype-specific triggers), and EP-level pearls.",
  },
  {
    question: "How is NurseNest advanced ECG different from ACLS training?",
    answer:
      "ACLS training focuses on algorithm execution during cardiac arrest. NurseNest Advanced ECG develops the interpretive skills and clinical judgment that precede and inform ACLS decisions: recognizing the rhythm that triggers the algorithm, understanding why a rhythm is shockable vs non-shockable, identifying the reversible causes during arrest, and knowing when pharmacologic vs electrical intervention is appropriate. The two are complementary — ACLS tells you what to do; NurseNest ECG training builds the pattern recognition to know when to do it.",
  },
  {
    question: "Is the Advanced ECG module included with an RN subscription?",
    answer:
      "No. Advanced ECG is a separate paid add-on and is not included in base RN, NP, RPN, PN, or Allied subscriptions. It is available to RN and NP learners only. Purchasing the add-on unlocks all nine tracks and 200+ questions. The core ECG module (rhythm recognition foundations) is included with eligible base RN and NP subscriptions.",
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
          "advanced ECG nursing",
          "VT vs SVT nurse",
          "STEMI equivalents nursing",
          "pacemaker malfunction nursing",
          "toxicology ECG nursing",
          "ICU ECG interpretation",
          "ACLS ECG nursing",
          "NP ECG advanced",
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
    { pathname: PATH, locale: DEFAULT_MARKETING_LOCALE, routeGroup: "marketing.default.advancedEcgNursing" },
  );
}

export default function AdvancedEcgNursingPage() {
  const breadcrumbs = [
    { name: "NurseNest", href: "/" },
    { name: "ECG Interpretation", href: "/ecg-interpretation" },
    { name: "Advanced ECG for Nurses", href: PATH },
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
              Advanced ECG · Specialty Nursing
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
              href="/ecg-telemetry-mastery"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-5 py-2.5 text-sm font-semibold text-[var(--semantic-text-secondary)] hover:bg-[var(--semantic-surface-alt)]"
            >
              Telemetry mastery overview
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
          <h2 className="text-base font-semibold text-[var(--semantic-text-primary)]">Advanced ECG coverage at a glance</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {[
              "Brugada 4-step WCT algorithm",
              "Posterior STEMI: V1–V3 depression pattern",
              "De Winter T-waves: LAD occlusion without ST elevation",
              "Wellens syndrome: reperfused proximal LAD",
              "Failure to capture vs undersensing vs failure to pace",
              "R-on-T from undersensing: pacemaker-triggered VF risk",
              "TCA overdose: terminal R in aVR, sodium bicarbonate",
              "ARVC: epsilon wave, LBBB-morphology VT",
              "Electrical alternans: cardiac tamponade",
              "LQT1/2/3 genotype-specific triggers",
              "HOCM: lateral Q waves, apical variant T-wave inversions",
              "Fascicular VT: verapamil-sensitive RBBB + left axis",
            ].map((item) => (
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
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[var(--semantic-text-muted)]">Related resources</p>
          <ul className="flex flex-wrap gap-2">
            {[
              { href: "/ecg-interpretation", label: "ECG Interpretation for Nurses" },
              { href: "/ecg-telemetry-mastery", label: "ECG Telemetry Mastery" },
              { href: "/modules/ecg-advanced", label: "Advanced ECG Module" },
              { href: "/modules/ecg/advanced/lessons", label: "Advanced ECG Lessons" },
              { href: "/modules/ecg/advanced/video-drills", label: "Advanced ECG Drills" },
              { href: "/canada/np/cnple", label: "CNPLE Hub" },
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
