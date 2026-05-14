import type { Metadata } from "next";
import Link from "next/link";
import { Activity, ArrowRight, CheckCircle2 } from "lucide-react";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";

export const revalidate = 86400;

const PATH = "/advanced-ecg-nursing/12-lead-stemi";
const PAGE_TITLE = "12-Lead STEMI Interpretation for Nurses — STEMI Localization & Culprit Artery | NurseNest";
const PAGE_H1 = "12-lead STEMI interpretation: localization, culprit artery identification, and STEMI equivalents";
const PAGE_DESCRIPTION =
  "Clinician-reviewed STEMI localization training for RN and NP. Learn inferior, anterior, lateral, posterior, and septal STEMI patterns, reciprocal changes, culprit artery identification, and STEMI equivalents (De Winter, Wellens, posterior occlusion) for cath lab activation decisions.";

const PILLAR = "/advanced-ecg-nursing";

const SECTIONS = [
  {
    id: "stemi-localization-system",
    heading: "STEMI localization: which leads, which wall, which artery",
    body: `STEMI localization is the process of identifying which coronary artery is occluded based on the distribution of ST elevation across the 12-lead ECG. The anatomical relationship between coronary artery territory and ECG lead orientation is systematic — once the lead-to-wall mapping is understood, localization becomes a spatial reasoning task rather than memorization.

The inferior wall is supplied primarily by the right coronary artery (RCA) in approximately 80% of right-dominant individuals. Inferior STEMI appears as ST elevation in leads II, III, and aVF. The accompanying reciprocal depression in leads I and aVL confirms the inferior injury vector and strengthens diagnostic confidence. A critical clinical point: inferior STEMI requires right-sided ECG leads (V4R) to evaluate for right ventricular (RV) MI. RV MI complicates 30–50% of inferior STEMIs and completely changes hemodynamic management — nitrates are contraindicated in RV MI because the right ventricle is preload-dependent and vasodilation causes catastrophic hypotension.

Anterior STEMI involves the left anterior descending artery (LAD) and presents with ST elevation in the precordial leads V1–V4. Proximal LAD occlusion — before the first septal perforator — produces the most extensive infarction territory and carries the highest mortality risk. Septal involvement extends elevation into V1–V2; apical involvement extends into V3–V4. An anterior STEMI in V1–V6 plus lead aVL suggests a very proximal LAD occlusion.

Lateral STEMI involves the left circumflex artery (LCx) or diagonal branches. High lateral MI produces elevation in leads I and aVL with reciprocal depression in II, III, and aVF. Low lateral MI shows elevation in V5–V6. Isolated lateral STEMI with elevation only in aVL is the most commonly missed pattern because the elevation is subtle and easily attributed to position.

Posterior STEMI — the most missed STEMI pattern — produces ST depression in V1–V3 rather than ST elevation, because the standard leads face the anterior wall and record the electrically opposite signal from the posterior surface. The finding of horizontal ST depression maximal in V1–V3 with a dominant R wave in V2 (the posterior Q-wave equivalent) mandates posterior leads V7–V9 and immediate clinical escalation pending posterior lead confirmation.`,
  },
  {
    id: "stemi-equivalents",
    heading: "STEMI equivalents: the patterns requiring cath lab activation without classic ST elevation",
    body: `The occlusion MI (OMI) framework recognizes that approximately 25% of acute coronary occlusions do not meet traditional STEMI criteria. Several specific ECG patterns represent acute culprit artery occlusion requiring emergent reperfusion with the same urgency as an ST-elevation STEMI.

De Winter T-waves represent acute proximal LAD occlusion in approximately 2% of STEMI presentations. The pattern is distinctive: J-point depression with 1–3 mm upsloping ST segments that merge into tall, peaked, symmetric T-waves in the precordial leads V1–V6. The absence of ST elevation makes this pattern consistently underrecognized, but it carries the same prognostic urgency as anterior STEMI. Distinguishing De Winter T-waves from hyperkalemia-peaked T-waves requires context: De Winter T-waves appear with J-point depression and precordial distribution; hyperkalemic T-waves are narrow-based, symmetric, and accompanied by QRS widening and peaked T-waves in limb leads.

Wellens syndrome represents a reperfused proximal LAD critical stenosis captured on ECG during a pain-free interval. Two morphologic types: Type A shows biphasic T-waves in V2–V3 (positive then negative deflection), which is less recognized but present in 25% of cases. Type B shows deeply inverted symmetric T-waves in V2–V3, present in 75% of cases. Both patterns indicate a vessel that transiently reperfused and will re-occlude without revascularization. Stress testing in a patient with Wellens pattern carries risk of precipitating massive anterior MI and is contraindicated.

Left main and proximal LAD occlusion can produce aVR elevation — a pattern of diffuse ST depression in multiple leads (I, II, V4–V6) with ST elevation in aVR greater than 1 mm. This pattern suggests diffuse subendocardial ischemia from either left main occlusion or severe proximal LAD disease, and requires emergent cardiology consultation regardless of whether traditional STEMI criteria are met.`,
  },
  {
    id: "reciprocal-changes",
    heading: "Reciprocal changes: why the opposite leads matter for diagnosis",
    body: `Reciprocal ST depression is not simply an incidental finding — it is a diagnostically meaningful electrical mirror that confirms the direction of the ST injury vector. When the heart is injured, the injured zone generates current toward the injury — ST elevation in leads facing the injury, ST depression in leads electrically opposite to the injury.

The presence of reciprocal changes has two clinical functions: it increases diagnostic specificity for true MI (distinguishing STEMI from benign early repolarization or pericarditis), and it helps identify the culprit territory when the primary elevation is subtle or ambiguous. Inferior STEMI with reciprocal lateral depression (leads I and aVL) is more diagnostically certain than isolated inferior elevation without reciprocal changes.

Pericarditis is the most common benign condition that mimics STEMI. Pericarditis produces diffuse ST elevation in multiple leads across different coronary territories — it does not respect the anatomical distribution of a single artery. Pericarditis typically shows: saddle-shaped ST elevation, PR segment depression (particularly notable in lead II and aVR), and importantly, no reciprocal ST depression in any lead. The absence of reciprocal changes in a patient with inferior ST elevation should prompt consideration of pericarditis rather than STEMI — though when in doubt, the clinical presentation and troponin trend resolve the differential.`,
  },
  {
    id: "ischemia-injury-infarction",
    heading: "Ischemia vs injury vs infarction: the ECG progression timeline",
    body: `Coronary occlusion produces a temporal sequence of ECG changes that reflect progressive myocardial damage. Understanding this progression helps nurses recognize where in the ischemic cascade a patient is located, which informs urgency and intervention priorities.

The earliest changes in acute coronary occlusion are hyperacute T-waves — tall, broad-based, peaked T-waves that appear within minutes of occlusion and precede ST elevation. These are frequently missed because they occur before the patient's pain becomes severe enough to seek care. When present, hyperacute T-waves mandate immediate serial ECG and cardiac monitoring.

ST segment elevation follows, developing over minutes to hours depending on collateral circulation and infarct territory. Transmural ischemia produces ST elevation; subendocardial ischemia produces ST depression. The J-point elevation transitions from convex (injury pattern) to concave (STEMI pattern) as the occlusion becomes complete.

Q waves begin developing within hours as necrotic myocardium loses its electrical contribution. A pathological Q wave is defined as greater than 40 ms duration or greater than 25% of the R-wave amplitude in the same lead. New Q waves in the setting of acute symptoms confirm infarction. Historic Q waves may represent old MI, and their presence does not rule out new ischemia.

T-wave inversion in the territory of the injured zone occurs during or after reperfusion and can persist for weeks. This inversion pattern — symmetric, deep T-wave inversions in the distribution of the affected artery — is diagnostically useful for identifying the culprit vessel when a patient presents days after the acute event.`,
  },
];

const FAQ_ITEMS = [
  {
    question: "How do I identify which coronary artery is occluded on the 12-lead ECG?",
    answer:
      "Inferior STEMI (II, III, aVF elevation) is most often the RCA. Always check V4R for right ventricular MI. Anterior STEMI (V1–V4) is the LAD — proximal occlusion extends to V5–V6 and aVL. Lateral STEMI (I, aVL or V5–V6) is the LCx or diagonal. Posterior STEMI (ST depression in V1–V3 with dominant R in V2) requires posterior leads V7–V9 to confirm LCx or RCA circumflex involvement. Left main occlusion can produce aVR elevation with diffuse ST depression.",
  },
  {
    question: "What is a STEMI equivalent and why does it matter clinically?",
    answer:
      "STEMI equivalents are ECG patterns that represent acute coronary occlusion requiring cath lab activation urgency but lack classic ST elevation on the standard 12-lead. The three most important are: De Winter T-waves (proximal LAD occlusion with J-point depression and peaked precordial T-waves), Wellens syndrome (reperfused proximal LAD critical stenosis with biphasic or inverted T-waves in V2–V3 during a pain-free period), and posterior STEMI (ST depression in V1–V3 that represents posterior wall injury). Missing these patterns means delayed reperfusion for a patient with acute coronary occlusion.",
  },
  {
    question: "Why is right-sided ECG important in inferior STEMI?",
    answer:
      "The RCA supplies both the inferior wall and the right ventricle in most patients. Right ventricular MI complicates 30–50% of inferior STEMIs. RV MI requires specific management: aggressive fluid resuscitation (RV is preload-dependent), avoidance of nitrates (cause severe hypotension by reducing RV preload), and awareness of the triad of inferior STEMI, hypotension, and clear lung fields. V4R showing ST elevation ≥1 mm confirms RV MI. Without right-sided leads, this life-threatening complication is missed and standard STEMI medications can cause cardiovascular collapse.",
  },
  {
    question: "How do I distinguish STEMI from pericarditis on ECG?",
    answer:
      "Four distinguishing features: (1) Distribution — STEMI follows a coronary artery territory; pericarditis shows diffuse, multiterritorial ST elevation. (2) Reciprocal changes — present in STEMI, absent in pericarditis. (3) ST shape — STEMI shows convex ('tombstone') ST; pericarditis shows saddle-shaped ST. (4) PR depression — characteristic of pericarditis (especially in aVR), absent in STEMI. When the ECG is ambiguous, clinical context (chest pain quality, pericardial rub, pleuritic component) and urgent troponin trend resolve the differential.",
  },
];

const RELATED_LINKS = [
  { href: PILLAR, label: "Advanced ECG for Nurses" },
  { href: "/advanced-ecg-nursing/rhythm-practice", label: "Rhythm Practice Lab" },
  { href: "/advanced-ecg-nursing/acls-rhythms", label: "ACLS Rhythms" },
  { href: "/advanced-ecg-nursing/electrolyte-ecg-changes", label: "Electrolyte ECG Changes" },
  { href: "/advanced-ecg-nursing/critical-care-ecg", label: "Critical Care ECG" },
  { href: "/advanced-ecg-nursing/ecg-case-simulations", label: "ECG Case Simulations" },
  { href: "/ecg-interpretation", label: "ECG Interpretation for Nurses" },
];

const COVERAGE_ITEMS = [
  "Inferior STEMI: II, III, aVF — RCA territory, RV MI screen",
  "Anterior STEMI: V1–V4 — LAD territory, proximal vs distal",
  "Lateral STEMI: I, aVL, V5–V6 — LCx, diagonal branch",
  "Posterior STEMI: V1–V3 depression — posterior leads V7–V9",
  "De Winter T-waves: proximal LAD occlusion without ST elevation",
  "Wellens syndrome: Type A biphasic, Type B deep inversion V2–V3",
  "aVR elevation: left main or diffuse subendocardial ischemia",
  "Reciprocal changes: confirming injury vector, ruling out pericarditis",
  "Right ventricular MI: V4R criteria, nitrate contraindication",
  "Hyperacute T-waves: earliest ischemia sign before ST elevation",
  "Q-wave development: infarction timeline and significance",
  "STEMI vs pericarditis: distribution, PR depression, reciprocal absent",
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
          "STEMI localization nursing",
          "12 lead ECG interpretation",
          "STEMI ECG examples nursing",
          "myocardial infarction ECG",
          "De Winter T waves nursing",
          "Wellens syndrome",
          "posterior STEMI nursing",
          "culprit artery identification",
          "STEMI equivalents nursing",
          "right ventricular MI",
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
    { pathname: PATH, locale: DEFAULT_MARKETING_LOCALE, routeGroup: "marketing.default.advancedEcgStemi" },
  );
}

export default function StemiPage() {
  const breadcrumbs = [
    { name: "NurseNest", href: "/" },
    { name: "ECG Interpretation", href: "/ecg-interpretation" },
    { name: "Advanced ECG for Nurses", href: PILLAR },
    { name: "12-Lead STEMI Interpretation", href: PATH },
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
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--semantic-danger)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-danger)_08%,var(--semantic-surface))] text-[var(--semantic-danger)]">
              <Activity className="h-5 w-5" aria-hidden />
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--semantic-text-muted)]">
              ECG Mastery · STEMI Interpretation
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
              Practice STEMI Interpretation
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
          <h2 className="text-base font-semibold text-[var(--semantic-text-primary)]">STEMI interpretation coverage at a glance</h2>
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
