import type { Metadata } from "next";
import Link from "next/link";
import { Activity, ArrowRight, CheckCircle2 } from "lucide-react";
import { AcademyBreadcrumbBar, ClinicalAcademyJsonLdGraph } from "@/components/clinical-academy/clinical-academy-chrome";
import { ecgAdvancedLeafBreadcrumbs } from "@/lib/breadcrumbs/academy-breadcrumbs";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";

export const revalidate = 86400;

const PATH = "/advanced-ecg-nursing/pediatric-ecg";
const PAGE_TITLE = "Pediatric ECG Interpretation for Nurses — Normal Values, Arrhythmias, Congenital Disorders | NurseNest";
const PAGE_H1 = "Pediatric ECG interpretation: age-specific norms, tachyarrhythmias, and congenital rhythm disorders for pediatric nurses";
const PAGE_DESCRIPTION =
  "Pediatric ECG training for RN and NP. Learn age-specific rate norms, pediatric tachyarrhythmia recognition, congenital rhythm disorders, lead placement differences, and how pediatric ECG interpretation differs fundamentally from adult interpretation.";

const PILLAR = "/advanced-ecg-nursing";

const SECTIONS = [
  {
    id: "pediatric-normal-values",
    heading: "Why pediatric ECG cannot be interpreted using adult normal values",
    body: `The most dangerous error in pediatric ECG interpretation is applying adult normal value thresholds to pediatric patients. The cardiac electrical system of a neonate is fundamentally different from that of an adult, and the values that define normal change continuously from birth through adolescence. A "normal" adult heart rate of 70 bpm is bradycardia in a neonate. A QRS duration of 100 ms — borderline in an adult — may be frankly wide in a young child. Adult interpretation criteria, applied uncritically to a child, produce systematic false positives and false negatives that delay or misdirect care.

Pediatric heart rate norms by age: Neonates (0–28 days): 100–165 bpm normal, <100 bpm bradycardia threshold. Infants (1–12 months): 100–150 bpm normal. Toddlers (1–3 years): 90–150 bpm normal. Preschool (3–5 years): 80–140 bpm normal. School age (5–12 years): 70–120 bpm normal. Adolescents (>12 years): 60–100 bpm, approaching adult norms.

PR interval norms also vary with age and heart rate. In neonates, a PR interval of 80–140 ms is normal. The adult upper limit of 200 ms is not the threshold for pediatric first-degree AV block. Similarly, QRS duration norms are shorter in younger children — a QRS of 80 ms in a 5-year-old is normal; a QRS of 80 ms in a neonate may represent bundle branch conduction.

The right ventricular dominance pattern in neonates and young infants is a critical difference from adult interpretation. The right ventricle is the dominant pumping chamber in fetal life and remains relatively hypertrophied after birth. This produces T-wave upright in V1 during the neonatal period — a finding that represents right ventricular dominance, not ischemia. After approximately 3–4 months of age, the left ventricle becomes dominant, and T-waves in V1 should invert. Persistent upright T-waves in V1 after 3–4 months of age are abnormal and suggest right ventricular hypertrophy, which warrants further evaluation.`,
  },
  {
    id: "pediatric-tachyarrhythmias",
    heading: "Pediatric tachyarrhythmias: SVT, atrial flutter, and ventricular tachycardia in children",
    body: `Supraventricular tachycardia (SVT) is the most common significant arrhythmia of childhood, occurring in approximately 1 in 250 children. Pediatric SVT most commonly results from accessory pathway-mediated reentry (Wolff-Parkinson-White syndrome or concealed pathway) or AV nodal reentry. The ECG appearance is a regular narrow-complex tachycardia at rates that typically range from 220–280 bpm in infants — substantially faster than the 150–250 bpm range in adults — because pediatric AV nodal refractoriness is shorter.

The clinical presentation of SVT in infants requires specific awareness. Infants cannot verbalize palpitations and present with feeding intolerance, fussiness, pallor, diaphoresis, and tachypnea. Heart failure presentation is common when SVT is prolonged because neonatal myocardium has less reserve. The diagnosis may be delayed because the tachycardia is attributed to infection or dehydration without ECG monitoring. Any infant with persistent unexplained tachycardia above 220 bpm requires immediate ECG evaluation.

Wolff-Parkinson-White (WPW) syndrome in pediatric patients carries an additional risk: the accessory pathway can conduct antegradely during atrial fibrillation, bypassing the protective rate-limiting function of the AV node and producing very rapid ventricular rates (>300 bpm) that can degenerate to ventricular fibrillation. The WPW ECG pattern — short PR interval, delta wave (slurred initial QRS upstroke), and wide QRS — identifies patients at risk. In WPW patients with atrial fibrillation, AV-blocking medications (adenosine, digoxin, verapamil, diltiazem) are contraindicated because they paradoxically increase conduction through the accessory pathway.

Ventricular tachycardia in children is less common than in adults but requires immediate recognition. Catecholaminergic polymorphic VT (CPVT) is an important pediatric diagnosis — it is exercise-induced, produces polymorphic or bidirectional VT during adrenergic stimulation, and is caused by mutations in the ryanodine receptor (RYR2 gene). A child who experiences syncope during exercise requires exercise testing and genetic evaluation for CPVT, even with a normal resting ECG.`,
  },
  {
    id: "congenital-rhythm-disorders",
    heading: "Congenital rhythm disorders and structural heart disease ECG patterns",
    body: `Congenital heart disease produces specific ECG patterns reflecting the altered cardiac anatomy and pressure loading of the affected chambers. While definitive structural diagnosis requires echocardiography, ECG findings provide important screening information and clinical context.

Long QT syndrome (LQTS) is the most clinically important congenital channelopathy from an emergency nursing perspective because it causes sudden cardiac death in apparently healthy children and young adults. The QTc threshold for LQTS diagnosis is ≥450 ms in males and ≥460 ms in females, though affected individuals with modest QTc prolongation remain at risk. LQTS genotypes differ in their arrhythmia triggers: LQT1 (most common, KCNQ1 mutation) triggers during exercise, especially swimming. LQT2 (KCNH2 mutation) triggers during sudden auditory stimuli. LQT3 (SCN5A mutation) triggers during sleep or rest. These trigger patterns are clinically actionable — LQT1 patients require restriction from competitive swimming; LQT2 patients may benefit from alarm clock and telephone modifications.

Brugada syndrome — caused by SCN5A gain-of-function mutations reducing sodium channel function — produces the characteristic Brugada ECG pattern in V1–V2: coved-type ST elevation with a descending ST morphology (Type 1) or saddle-back ST elevation (Type 2 and 3, requiring provocation testing). VF risk in Brugada occurs predominantly during sleep and fever. Fever — including from common infections or antipyretics not given before fever peaks — can unmask Brugada pattern and precipitate VF, a clinical fact relevant to any nurse caring for febrile children with known or suspected Brugada syndrome.

Congenital complete heart block is a specific neonatal arrhythmia most commonly caused by maternal anti-Ro/SSA or anti-La/SSB antibodies crossing the placenta and targeting the fetal cardiac conduction system. The ECG shows AV dissociation with a ventricular escape rate typically 40–60 bpm. Neonates with hydrops or ventricular rates below 55 bpm at birth generally require pacemaker implantation. The maternal antibody screen in any pregnant patient with Sjögren syndrome, systemic lupus, or other connective tissue disease is a preventive assessment for congenital heart block risk.`,
  },
  {
    id: "pediatric-lead-placement",
    heading: "Pediatric ECG lead placement: why adult placement produces systematic errors in children",
    body: `Standard adult ECG lead placement positions, particularly for the precordial leads, are designed around adult cardiac anatomy. Applying adult lead positions without adjustment to infants and small children produces systematic ECG distortion that leads to misinterpretation.

The pediatric heart occupies a more central thoracic position and is relatively larger in proportion to the chest than in adults. The precordial lead positions in small children must be adjusted to maintain appropriate proximity to the cardiac chambers. In neonates and infants, V4 is typically placed in the midclavicular line, but the more medial cardiac position means V5 and V6 require lateral positioning that is different from adult placement.

Right-sided leads are more clinically important in pediatrics than in adults. V3R and V4R — the right-sided mirror positions of V3 and V4 — are routinely included in pediatric ECG interpretation because right ventricular assessment is more clinically relevant during the period of right ventricular dominance. Right ventricular hypertrophy assessment requires adequate right precordial lead data, which standard adult lead placement does not provide.

Limb lead placement in small infants requires electrodes designed for small surface areas. Standard adult limb lead electrodes on an infant's limb cause excessive contact artifact and poor signal quality. Neonatal electrode use is required for reliable ECG quality in infants, and electrode placement should be on the appropriate limb surface — not the trunk — to maintain standard lead vector relationships. Clinicians interpreting neonatal ECGs must be aware of the recording conditions because improper electrode placement creates pseudo-abnormalities that can be misinterpreted as axis deviation, bundle branch block, or ischemia.`,
  },
];

const FAQ_ITEMS = [
  {
    question: "What is the normal heart rate for a neonate vs a school-age child?",
    answer:
      "Normal heart rates by age: Neonates (0–28 days): 100–165 bpm; Infants (1–12 months): 100–150 bpm; Toddlers (1–3 years): 90–150 bpm; Preschool (3–5 years): 80–140 bpm; School age (5–12 years): 70–120 bpm; Adolescents (>12 years): 60–100 bpm. A heart rate that would be normal sinus tachycardia in an adult may be within normal limits for an infant. Bradycardia thresholds also differ: <100 bpm in a neonate is bradycardia, not a 'slow normal rate.'",
  },
  {
    question: "Why is SVT more dangerous in infants than in adults?",
    answer:
      "Infants cannot tolerate sustained tachycardia as well as adults because neonatal myocardium has less metabolic reserve and cannot sustain the high cardiac workload of rates >220 bpm for extended periods. Heart failure develops rapidly in infants with unrecognized SVT. Additionally, infants cannot report symptoms, so SVT may be attributed to feeding difficulty, irritability, or respiratory distress rather than diagnosed promptly. Any infant with unexplained persistent tachycardia >220 bpm requires ECG evaluation immediately.",
  },
  {
    question: "What is the significance of upright T-waves in V1 in a 6-month-old?",
    answer:
      "Upright T-waves in V1 are normal in the first 3–4 days of life (neonatal period). They should invert by approximately 3–4 months as left ventricular dominance establishes. Persistent upright T-waves in V1 after 3–4 months of age are abnormal and suggest right ventricular hypertrophy, which can result from congenital heart disease, pulmonary hypertension, or right ventricular outflow tract obstruction. This is the opposite of the adult interpretation where upright T-waves in V1 occasionally represent right ventricular hypertrophy but are not the defining norm reversal.",
  },
  {
    question: "Which medications are contraindicated in Wolff-Parkinson-White syndrome with atrial fibrillation?",
    answer:
      "In WPW with atrial fibrillation, the following are contraindicated: adenosine, digoxin, verapamil, and diltiazem. These AV-blocking medications slow conduction through the AV node but paradoxically increase conduction through the accessory pathway (which lacks AV-node rate-limiting properties), potentially accelerating ventricular rate to >300 bpm and precipitating ventricular fibrillation. Treatment for WPW with AF is electrical cardioversion for hemodynamic instability, or procainamide (slows accessory pathway conduction) for stable patients.",
  },
];

const RELATED_LINKS = [
  { href: PILLAR, label: "Advanced ECG for Nurses" },
  { href: "/advanced-ecg-nursing/rhythm-practice", label: "Rhythm Practice Lab" },
  { href: "/advanced-ecg-nursing/acls-rhythms", label: "ACLS Rhythms" },
  { href: "/advanced-ecg-nursing/critical-care-ecg", label: "Critical Care ECG" },
  { href: "/advanced-ecg-nursing/ecg-case-simulations", label: "ECG Case Simulations" },
  { href: "/ecg-interpretation", label: "ECG Interpretation for Nurses" },
  { href: "/modules/ecg-advanced", label: "Advanced ECG Module" },
];

const COVERAGE_ITEMS = [
  "Age-specific HR norms: neonate 100–165, infant 100–150, school-age 70–120",
  "Right ventricular dominance: normal upright V1 T-wave in neonates",
  "T-wave inversion V1 expected after 3–4 months of age",
  "Pediatric SVT: 220–280 bpm in infants, accessory pathway mechanism",
  "WPW contraindications: adenosine, digoxin, verapamil in AF with WPW",
  "CPVT: exercise-induced polymorphic VT, RYR2 mutation, syncope workup",
  "LQTS genotypes: LQT1 (swim triggers), LQT2 (auditory), LQT3 (sleep)",
  "Brugada: coved-type V1 ST elevation, fever-triggered VF risk",
  "Congenital heart block: maternal anti-Ro/SSA antibodies, AV dissociation",
  "Neonatal lead placement: right-sided leads V3R/V4R for RV assessment",
  "Electrode size: neonatal electrodes required for quality infant ECG",
  "PR interval norms: neonatal 80–140 ms, adult 120–200 ms threshold not applicable",
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
          "pediatric ECG interpretation nursing",
          "pediatric heart rate norms",
          "pediatric tachyarrhythmia nursing",
          "SVT infant nursing",
          "Wolff-Parkinson-White pediatric",
          "congenital heart block nursing",
          "long QT syndrome nursing",
          "Brugada syndrome nursing",
          "CPVT pediatric",
          "pediatric ECG lead placement",
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
    { pathname: PATH, locale: DEFAULT_MARKETING_LOCALE, routeGroup: "marketing.default.advancedEcgPediatric" },
  );
}

export default function PediatricEcgPage() {

  const breadcrumbResolution = ecgAdvancedLeafBreadcrumbs('Pediatric ECG', PATH);
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
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--semantic-chart-3)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-3)_08%,var(--semantic-surface))] text-[var(--semantic-chart-3)]">
              <Activity className="h-5 w-5" aria-hidden />
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--semantic-text-muted)]">
              ECG Mastery · Pediatric ECG
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
              Practice Pediatric ECG
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
          <h2 className="text-base font-semibold text-[var(--semantic-text-primary)]">Pediatric ECG coverage at a glance</h2>
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
