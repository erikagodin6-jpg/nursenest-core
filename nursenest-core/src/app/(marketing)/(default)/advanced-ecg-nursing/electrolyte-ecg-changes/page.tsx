import type { Metadata } from "next";
import Link from "next/link";
import { Activity, ArrowRight, CheckCircle2 } from "lucide-react";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";

export const revalidate = 86400;

const PATH = "/advanced-ecg-nursing/electrolyte-ecg-changes";
const PAGE_TITLE = "Electrolyte ECG Changes for Nurses — Hyperkalemia, Hypokalemia, Calcium, Magnesium | NurseNest";
const PAGE_H1 = "Electrolyte ECG changes: recognizing hyperkalemia, hypokalemia, calcium, and magnesium disorders on the 12-lead";
const PAGE_DESCRIPTION =
  "Clinician-reviewed electrolyte ECG pattern training for RN, NP, ICU, and critical care nurses. Recognize hyperkalemia, hypokalemia, hypercalcemia, hypocalcemia, and magnesium disorder ECG findings with pathophysiology, labs, and clinical priorities.";

const PILLAR = "/advanced-ecg-nursing";

const SECTIONS = [
  {
    id: "hyperkalemia-ecg",
    heading: "Hyperkalemia ECG progression: from peaked T-waves to sine wave to cardiac arrest",
    body: `Hyperkalemia is a medical emergency with a predictable ECG progression tied to serum potassium level. Recognizing the pattern before the patient deteriorates to cardiac arrest is one of the highest-yield clinical skills in critical care and emergency nursing.

The earliest ECG change in hyperkalemia is tall, peaked, narrow-based T-waves — classically described as "tent-shaped" — appearing when serum potassium rises above approximately 5.5–6.0 mEq/L. These T-waves differ from benign early repolarization T-waves in that they are narrow at the base, symmetric, and appear in a diffuse distribution (particularly V2–V5 and II). The cardiac physiology underlying this change is slowed repolarization due to elevated extracellular potassium reducing the electrochemical gradient driving phase 3 repolarization.

As potassium rises above 6.5–7.0 mEq/L, the PR interval prolongs and QRS widens as conduction slows across the AV node and ventricular myocardium. PR prolongation > 200 ms reflects AV node depression. QRS widening > 120 ms reflects intraventricular conduction delay. Simultaneously, P-wave amplitude decreases because elevated potassium depresses atrial automaticity — the atria become electrically silent before the ventricles. An absent P-wave with a wide QRS and bradycardia is a hyperkalemia signature pattern that cannot be attributed to AV block without potassium status.

Above 7.0–8.0 mEq/L, the QRS widens dramatically and merges with the T-wave to produce the "sine wave" pattern — a pathognomonic finding that indicates imminent ventricular fibrillation or asystole. The sine wave represents near-total loss of organized conduction. Immediate treatment with calcium gluconate or calcium chloride is the priority — calcium antagonizes the membrane effects of hyperkalemia at the cardiac sarcolemma within 1–3 minutes, buying time for definitive potassium lowering with insulin, glucose, and sodium bicarbonate.`,
  },
  {
    id: "hypokalemia-ecg",
    heading: "Hypokalemia ECG changes: U-waves, QT prolongation, and torsades risk",
    body: `Hypokalemia creates a proarrhythmic cardiac environment by prolonging the action potential duration and increasing afterdepolarization risk. The ECG changes reflect abnormal repolarization and escalating vulnerability to ventricular tachyarrhythmias as potassium falls.

The characteristic finding of hypokalemia is the appearance of a prominent U-wave — a deflection after the T-wave most visible in leads V2–V4. The U-wave represents delayed repolarization of the His-Purkinje system. In hypokalemia, the U-wave enlarges and, in severe deficiency, the T-wave and U-wave fuse to create a T-U complex that falsely prolongs the measured QT interval. This T-U fusion is why QTc measurement in hypokalemic patients requires careful identification of the true T-wave endpoint — misidentifying the T-U complex as the T-wave overestimates QTc.

The clinical significance of hypokalemia-associated QT prolongation is torsades de pointes risk. Torsades requires two conditions: a prolonged QT interval and a trigger (typically a premature ventricular contraction with specific R-on-T timing). Hypokalemia provides both the substrate (QT prolongation) and, by increasing automaticity, a source of triggering ectopy. The combination of hypokalemia, concurrent hypomagnesemia, and QT-prolonging medications is additive — and this combination is common in hospitalized patients receiving diuretics, antiemetics, and antibiotics simultaneously.

Flat or inverted T-waves with prominent U-waves distinguish hypokalemia from hyperkalemia. The T-wave changes in hypokalemia reflect impaired repolarization; the peaked T-waves of hyperkalemia reflect accelerated early repolarization. When the ECG is ambiguous, the potassium level always resolves the question.`,
  },
  {
    id: "calcium-ecg",
    heading: "Calcium ECG effects: QT changes in hypercalcemia and hypocalcemia",
    body: `Calcium disorders produce opposite effects on the QT interval through opposing mechanisms at the cardiac sarcolemma. This directional symmetry makes calcium ECG changes one of the most systematically learnable electrolyte patterns.

Hypercalcemia shortens the QT interval by accelerating phase 2 repolarization (the plateau phase of the action potential). As intracellular calcium accumulates, the plateau shortens, the action potential duration decreases, and the ST segment — the plateau phase equivalent on the ECG — abbreviates. A QTc below 360 ms (particularly below 340 ms) in a patient without structural explanation should trigger calcium level assessment. Severe hypercalcemia (typically > 14 mg/dL) can cause J-point elevation resembling ST elevation in some leads, Osborn wave-like patterns, PR prolongation, and ultimately ventricular arrhythmias from triggered activity.

Hypocalcemia produces the opposite: prolonged QT interval without significant change to the T-wave duration itself. The ST segment (isoelectric between QRS and T-wave) elongates — the QT prolongation in hypocalcemia is characterized by a long, flat ST segment before a normal-duration T-wave. This distinguishes hypocalcemia from drug-induced QT prolongation, which typically prolongs the T-wave itself and may produce T-wave morphology changes.

Clinical context: hypocalcemia is common after massive transfusion (citrate chelates calcium), parathyroid surgery, sepsis with ionized calcium depression, and in patients receiving calcitonin, bisphosphonates, or loop diuretics. Hypercalcemia is most commonly encountered in malignancy (PTHrP-mediated) and hyperparathyroidism. Both require ECG surveillance alongside laboratory monitoring because rhythm complications — arrhythmias in hypercalcemia, torsades in hypocalcemia — can occur before electrolyte correction is complete.`,
  },
  {
    id: "magnesium-ecg",
    heading: "Magnesium disorders and ECG: the electrolyte every QT-prolongation case requires",
    body: `Magnesium is the cofactor for the sodium-potassium ATPase pump and the inward rectifier potassium channel (IKr) — both critical to cardiac repolarization. Hypomagnesemia therefore creates repolarization instability independent of potassium and calcium, and is a required assessment in every patient with QT prolongation or arrhythmia.

Isolated hypomagnesemia does not produce pathognomonic ECG changes visible on routine review. Its effect is primarily mediated through potassium depletion — hypomagnesemia causes renal potassium wasting because magnesium is required for normal tubular potassium reabsorption. A patient with persistent hypokalemia despite adequate potassium supplementation should be evaluated for concurrent hypomagnesemia, because potassium replacement is ineffective until magnesium is corrected.

The clinical ECG relevance of hypomagnesemia is its role in torsades de pointes. Magnesium is both a contributor to QT prolongation (via potassium depletion) and the specific treatment for torsades. IV magnesium sulfate 1–2g over 15 minutes is the first-line pharmacologic treatment for torsades de pointes, including in patients with normal serum magnesium levels. The mechanism is direct suppression of the triggered afterdepolarizations that initiate torsades rather than correction of the QT interval itself.

Hypermagnesemia — most commonly iatrogenic from magnesium infusion in preeclampsia management — produces ECG changes similar to hyperkalemia: PR prolongation, QRS widening, and complete heart block at toxic levels. Calcium gluconate antagonizes magnesium toxicity and is the specific antidote for cardiac toxicity from magnesium excess.`,
  },
];

const FAQ_ITEMS = [
  {
    question: "What is the classic ECG progression of hyperkalemia?",
    answer:
      "Hyperkalemia progresses through five ECG stages: (1) Peaked narrow T-waves (K+ ~5.5–6.0), (2) PR prolongation and P-wave flattening (K+ ~6.5–7.0), (3) QRS widening (K+ ~7.0–7.5), (4) Sine wave pattern (K+ >7.5–8.0), (5) VF or asystole. The sine wave pattern — where the QRS and T-wave merge into a continuous sinusoidal waveform — is the pre-arrest signal requiring immediate calcium gluconate to stabilize the myocardium.",
  },
  {
    question: "How does hypokalemia cause torsades de pointes?",
    answer:
      "Hypokalemia prolongs the QT interval by slowing phase 3 repolarization, creating a prolonged window of vulnerability. Simultaneously, low intracellular potassium increases myocardial automaticity, producing premature ventricular contractions. When a PVC falls on a prolonged T-wave (R-on-T), the electrical instability triggers torsades — polymorphic VT with characteristic twisting of the QRS axis. Magnesium sulfate 2g IV is the immediate treatment. Concurrent hypomagnesemia amplifies the risk because magnesium is required for potassium reabsorption.",
  },
  {
    question: "How do calcium disorders affect the QT interval differently?",
    answer:
      "They act in opposite directions. Hypocalcemia prolongs the QT interval by elongating the ST segment — the flat isoelectric portion between QRS and T-wave extends, while the T-wave itself remains normal in duration. Hypercalcemia shortens the QT interval by accelerating phase 2 repolarization (plateau phase). A useful rule: if QT is prolonged and T-wave appears normal in shape but the ST is long, suspect hypocalcemia. If QT is abbreviated with a short ST segment, suspect hypercalcemia.",
  },
  {
    question: "Why must magnesium be corrected before hypokalemia will respond to replacement?",
    answer:
      "Magnesium is the cofactor for the Na/K-ATPase pump, which drives potassium into cells, and for the inward rectifier potassium channels that govern renal tubular potassium reabsorption. Without adequate magnesium, the kidney cannot retain supplemented potassium — it is excreted renally despite IV or oral replacement. In patients with persistent hypokalemia despite aggressive potassium supplementation, checking and correcting magnesium (target >2.0 mg/dL) resolves the refractory deficit.",
  },
];

const RELATED_LINKS = [
  { href: PILLAR, label: "Advanced ECG for Nurses" },
  { href: "/advanced-ecg-nursing/medication-induced-ecg-changes", label: "Medication-Induced ECG Changes" },
  { href: "/advanced-ecg-nursing/critical-care-ecg", label: "Critical Care ECG" },
  { href: "/advanced-ecg-nursing/acls-rhythms", label: "ACLS Rhythms" },
  { href: "/advanced-ecg-nursing/ecg-case-simulations", label: "ECG Case Simulations" },
  { href: "/ecg-interpretation", label: "ECG Interpretation for Nurses" },
  { href: "/modules/ecg-advanced", label: "Advanced ECG Module" },
];

const COVERAGE_ITEMS = [
  "Hyperkalemia: peaked T-waves → QRS widening → sine wave → arrest",
  "Hyperkalemia treatment: calcium gluconate, insulin/glucose, bicarbonate",
  "Hypokalemia: U-waves, T-U fusion, QT prolongation, torsades risk",
  "Hypokalemia: magnesium correction required before K+ responds",
  "Hypercalcemia: shortened QT, abbreviated ST segment, arrhythmia risk",
  "Hypocalcemia: prolonged flat ST segment, QT prolongation",
  "Hypomagnesemia: potassium wasting, QT prolongation cofactor",
  "Hypermagnesemia: PR prolongation, QRS widening, calcium antidote",
  "Torsades de pointes: IV magnesium 2g first-line treatment",
  "Electrolyte additive risk: hypokalemia + hypomagnesemia + QT drug",
  "Differentiating peaked T: hyperkalemia vs benign early repolarization",
  "Lab-ECG correlation: when electrolyte level drives urgency of intervention",
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
          "hyperkalemia ECG nursing",
          "hypokalemia ECG changes",
          "electrolyte ECG nursing",
          "hyperkalemia peaked T waves",
          "hypocalcemia QT prolongation",
          "torsades de pointes nursing",
          "magnesium ECG nursing",
          "electrolyte cardiac changes",
          "potassium ECG changes nursing",
          "calcium ECG changes nursing",
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
    { pathname: PATH, locale: DEFAULT_MARKETING_LOCALE, routeGroup: "marketing.default.advancedEcgElectrolytes" },
  );
}

export default function ElectrolyteEcgChangesPage() {
  const breadcrumbs = [
    { name: "NurseNest", href: "/" },
    { name: "ECG Interpretation", href: "/ecg-interpretation" },
    { name: "Advanced ECG for Nurses", href: PILLAR },
    { name: "Electrolyte ECG Changes", href: PATH },
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
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--semantic-chart-3)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-3)_08%,var(--semantic-surface))] text-[var(--semantic-chart-3)]">
              <Activity className="h-5 w-5" aria-hidden />
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--semantic-text-muted)]">
              ECG Mastery · Electrolyte ECG Changes
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
              Practice Electrolyte ECG
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

        <section className="mb-10 rounded-2xl border border-[color-mix(in_srgb,var(--semantic-chart-3)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_18%,var(--semantic-surface))] p-5 sm:p-6">
          <h2 className="text-base font-semibold text-[var(--semantic-text-primary)]">Electrolyte ECG coverage at a glance</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {COVERAGE_ITEMS.map((item) => (
              <li key={item} className="flex items-start gap-2 text-xs text-[var(--semantic-text-secondary)]">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--semantic-chart-3)]" aria-hidden />
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
