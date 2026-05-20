import type { Metadata } from "next";
import Link from "next/link";
import { Activity, Baby, BookOpen, CheckCircle2, Heart, Shield, Zap } from "lucide-react";
import { AcademyBreadcrumbBar, ClinicalAcademyJsonLdGraph } from "@/components/clinical-academy/clinical-academy-chrome";
import { ecgStandaloneLeafBreadcrumbs } from "@/lib/breadcrumbs/academy-breadcrumbs";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";

export const revalidate = 86400;

const PATH = "/pediatric-ecg";
const PAGE_TITLE = "Pediatric ECG Interpretation for Nurses — PALS & Congenital Heart | NurseNest";
const PAGE_H1 = "Pediatric ECG interpretation for nurses: rhythm recognition, PALS algorithms, and congenital heart patterns";
const PAGE_DESCRIPTION =
  "Pediatric ECG for RN and NP nurses: age-specific rhythm recognition, respiratory sinus arrhythmia, SVT in infants, hypoxic bradycardia, long QT syndrome, WPW, post-operative congenital heart telemetry patterns, and PALS 2020 algorithm integration.";

const SITE_ORIGIN = "https://nursenest.ca";

const KEY_DISTINCTIONS = [
  {
    title: "Age-Specific Rate Thresholds",
    body: "Normal pediatric heart rates vary dramatically by age. A rate of 160 bpm is bradycardia in a neonate and tachycardia in a school-age child. Using adult rate thresholds produces systematic errors in pediatric ECG interpretation — both over-escalation (alarming on normal neonatal rates) and under-escalation (missing bradycardia in infants).",
    icon: Heart,
  },
  {
    title: "Respiratory Sinus Arrhythmia",
    body: "The most commonly over-escalated normal pediatric finding. RSA produces smooth cyclic R-R variation directly linked to breathing. It reflects healthy vagal tone — NOT AFib, NOT ectopy. Uniform sinus P-waves before every QRS, no dropped beats, respiratory-synchronized variability. Escalating RSA as an arrhythmia is a clinical error.",
    icon: Activity,
  },
  {
    title: "SVT in Infants",
    body: "SVT is the most common pathologic tachyarrhythmia in infants. Rate > 220 bpm, fixed regardless of state (feeding, crying, sleeping). Absent organized P-waves. Poor feeding, pallor, tachypnea, and mottled skin signal hemodynamic compromise. Management: ice-to-face vagal maneuver (infants), then adenosine rapid IV push, then synchronized cardioversion for unstable presentations.",
    icon: Zap,
  },
  {
    title: "Hypoxic Bradycardia",
    body: "In children, bradycardia is caused by hypoxia until proven otherwise. PALS mandates: ventilate FIRST. Thirty seconds of effective BVM ventilation with supplemental O₂ should reverse hypoxic bradycardia. Giving atropine before ventilating treats a symptom and delays the life-saving intervention. HR < 60 with poor perfusion not responding to ventilation → CPR.",
    icon: Shield,
  },
];

const CURRICULUM_TOPICS = [
  "Pediatric normal rate ranges by age group (neonate through adolescent)",
  "Respiratory sinus arrhythmia — normal variant, not arrhythmia",
  "SVT vs sinus tachycardia in infants — critical diagnostic differential",
  "Hypoxic bradycardia — ventilate before medicating",
  "PALS shockable rhythms: VF, pulseless VT — 2 J/kg defibrillation",
  "PALS non-shockable rhythms: asystole, PEA — CPR + epinephrine",
  "Hyperkalemia ECG changes in pediatric patients",
  "Long QT syndrome (LQTS) — genotype-specific triggers, magnesium treatment",
  "WPW and pre-excitation — SVT treatment, AFib + WPW contraindications",
  "Post-operative congenital heart telemetry patterns",
  "Junctional ectopic tachycardia (JET) — not adenosine, cooling protocol",
  "Pediatric complete heart block — congenital, post-operative",
];

const PALS_CASES = [
  { title: "4-Month-Old with SVT and Poor Feeding", tier: "Intermediate", outcome: "Ice-water vagal maneuver → adenosine → synchronized cardioversion" },
  { title: "8-Year-Old: Severe Asthma with Pulsus Paradoxus", tier: "Intermediate", outcome: "Pulsus paradoxus assessed by BP cuff (hemodynamic finding, not rhythm)" },
  { title: "Post-op Tetralogy of Fallot — JET Recognition", tier: "Advanced", outcome: "Cooling protocol, minimize catecholamines — NOT cardioversion" },
  { title: "14-Year-Old: Exertional Syncope and Long QT", tier: "Advanced", outcome: "Magnesium + drug discontinuation + LQTS workup" },
  { title: "7-Year-Old: Tumor Lysis + Widening QRS", tier: "Advanced", outcome: "IV calcium first (membrane stabilization) before potassium removal" },
  { title: "2-Year-Old: Hypoxic Bradycardia → Arrest", tier: "Intermediate", outcome: "BVM first → if HR < 60 after 30s → CPR → epinephrine" },
];

const FAQ_ITEMS = [
  {
    question: "Why does pediatric ECG interpretation require separate training from adult ECG?",
    answer:
      "Pediatric ECG interpretation requires different normal rate thresholds, different rhythm recognition criteria, different algorithm logic, and different management priorities. A heart rate of 220 bpm triggers a very different response in a 3-month-old (possible SVT — assess and treat) versus a 30-year-old (same, but different vagal maneuver and adenosine approach). Scoring pediatric ECG performance against adult ACLS competency benchmarks produces inaccurate mastery assessments. The NurseNest Pediatric ECG lane is separated from the adult ECG module to ensure age-appropriate standards are applied throughout.",
  },
  {
    question: "What is respiratory sinus arrhythmia and why is it important to recognize?",
    answer:
      "Respiratory sinus arrhythmia is a normal physiologic variation where heart rate increases slightly with inspiration and decreases with expiration. It is caused by vagal tone fluctuations with the respiratory cycle (Bainbridge reflex). It is most prominent in healthy children and athletes — precisely the patients with the highest vagal tone. RSA produces an irregular-appearing rhythm strip that can trigger monitoring alarms and nurse concern. Key teaching: RSA has uniform sinus P-waves before every QRS, no dropped beats, and R-R variation that correlates exactly with the respiratory cycle. It is NOT AFib, NOT ectopy. Escalating RSA as an arrhythmia is a clinical error that causes unnecessary interventions.",
  },
  {
    question: "What is junctional ectopic tachycardia (JET) and how is it managed?",
    answer:
      "JET is a common post-operative arrhythmia after pediatric cardiac surgery — particularly tetralogy of Fallot repair, VSD repair, and AV canal repair. It presents as a near-narrow complex tachycardia with AV dissociation: QRS rate is FASTER than the P-wave rate. Unlike SVT, JET does not respond to adenosine or synchronized cardioversion — these are ineffective. First-line management is therapeutic hypothermia (cooling to 34–35°C core temperature), minimizing catecholamine infusions, and maximizing sedation. Antiarrhythmics (amiodarone or procainamide) are used secondarily per the cardiac surgery team. Nurses must recognize that attempting to cardiovert JET is inappropriate and potentially harmful.",
  },
  {
    question: "What ECG findings indicate long QT syndrome in a child or adolescent?",
    answer:
      "Prolonged QTc in children: > 450 ms in boys, > 460 ms in girls (corrected for rate using Bazett formula). QTc > 500 ms indicates high torsades de pointes risk regardless of sex. Clinical presentations include exertional syncope (LQT1 — triggered by swimming or exercise), syncope with auditory startle (LQT2), or nocturnal syncope (LQT3). Family history of unexplained sudden cardiac death in a young person is a major risk indicator. Drug review is essential: azithromycin, ondansetron, antipsychotics, and many common pediatric medications prolong QTc. IV magnesium 25–50 mg/kg (max 2g) is first-line for active torsades in children.",
  },
  {
    question: "Is pediatric ECG content included in the NurseNest subscription?",
    answer:
      "Yes. The Pediatric ECG lane is included with eligible RN and NP base subscriptions. It includes 9 curriculum topics covering pediatric rhythm recognition and PALS algorithms, 6 PALS deterioration case simulations with interactive decision points, 50 clinician-reviewed practice questions across 6 categories (RSA, SVT, hypoxic bradycardia, PALS arrest rhythms, pulsus paradoxus clinical context, post-op JET), and full governance separation from the adult ECG module to prevent mastery score contamination.",
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
          "pediatric ECG nursing",
          "pediatric ECG interpretation",
          "PALS rhythms nursing",
          "pediatric SVT nursing",
          "respiratory sinus arrhythmia children",
          "pediatric heart block",
          "long QT children nursing",
          "WPW pediatric",
          "pediatric congenital heart ECG",
          "PALS 2020 nursing",
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

export default function PediatricEcgPage() {
  const breadcrumbResolution = ecgStandaloneLeafBreadcrumbs("Pediatric ECG", PATH);
  const jsonLdGraph = [
      {
        "@type": "Course",
        name: "Pediatric ECG Interpretation for Nurses",
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
      <AcademyBreadcrumbBar resolution={breadcrumbResolution} />

      <header className="mb-10">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--semantic-chart-3)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-3)_06%,var(--semantic-surface))] px-3 py-1 text-xs font-semibold text-[var(--semantic-chart-3)]">
          <Baby className="h-3.5 w-3.5" aria-hidden />
          Pediatric ECG — Included with RN/NP Subscription
        </div>
        <h1 className="mb-4 text-3xl font-bold leading-tight text-[var(--semantic-text-primary)] sm:text-4xl">
          {PAGE_H1}
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-[var(--semantic-text-secondary)]">
          Pediatric ECG interpretation requires age-specific knowledge that differs meaningfully from
          adult ECG. This page covers the core competencies: age-stratified rate thresholds, the
          most common misinterpreted normal variants, critical PALS differentials, and advanced
          congenital heart telemetry patterns.
        </p>
      </header>

      {/* Key distinctions */}
      <section className="mb-12" aria-labelledby="distinctions-heading">
        <h2 id="distinctions-heading" className="mb-6 text-2xl font-bold text-[var(--semantic-text-primary)]">
          What makes pediatric ECG interpretation different
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {KEY_DISTINCTIONS.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5">
                <div className="mb-3 flex items-center gap-2">
                  <Icon className="h-5 w-5 text-[var(--semantic-brand)]" aria-hidden />
                  <h3 className="font-semibold text-[var(--semantic-text-primary)]">{item.title}</h3>
                </div>
                <p className="text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{item.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Curriculum topics */}
      <section className="mb-12" aria-labelledby="curriculum-heading">
        <h2 id="curriculum-heading" className="mb-4 text-2xl font-bold text-[var(--semantic-text-primary)]">
          Pediatric ECG curriculum topics
        </h2>
        <ul className="grid gap-2 sm:grid-cols-2">
          {CURRICULUM_TOPICS.map((topic) => (
            <li key={topic} className="flex items-start gap-2.5 text-sm text-[var(--semantic-text-secondary)]">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden />
              {topic}
            </li>
          ))}
        </ul>
      </section>

      {/* PALS case simulations */}
      <section className="mb-12" aria-labelledby="cases-heading">
        <h2 id="cases-heading" className="mb-4 text-2xl font-bold text-[var(--semantic-text-primary)]">
          PALS deterioration case simulations
        </h2>
        <p className="mb-4 text-sm text-[var(--semantic-text-secondary)]">
          Six structured clinical cases with decision points, nursing error traps, and PALS algorithm pathways.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {PALS_CASES.map((c) => (
            <div key={c.title} className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
              <div className="mb-1 flex items-center gap-2">
                <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${c.tier === "Advanced" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"}`}>{c.tier}</span>
              </div>
              <p className="mb-1 text-sm font-semibold text-[var(--semantic-text-primary)]">{c.title}</p>
              <p className="text-xs text-[var(--semantic-text-muted)]">{c.outcome}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-12" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="mb-6 text-2xl font-bold text-[var(--semantic-text-primary)]">
          Frequently asked questions — pediatric ECG
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
        <h2 id="related-heading" className="mb-4 text-lg font-semibold text-[var(--semantic-text-primary)]">Related ECG topics</h2>
        <div className="flex flex-wrap gap-2">
          {[
            { href: "/ecg", label: "ECG Hub" },
            { href: "/pals-rhythms", label: "PALS Rhythms" },
            { href: "/acls-rhythms", label: "ACLS Rhythms" },
            { href: "/advanced-ecg-nursing/pediatric-ecg", label: "Advanced Pediatric ECG" },
            { href: "/ecg-interpretation", label: "ECG Interpretation" },
          ].map((link) => (
            <Link key={link.href} href={link.href} className="rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-1.5 text-sm font-medium text-[var(--semantic-brand)] hover:bg-[color-mix(in_srgb,var(--semantic-brand)_06%,var(--semantic-surface))]">
              {link.label}
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-2xl bg-[var(--role-cta)] p-6" aria-labelledby="cta-heading">
        <h2 id="cta-heading" className="mb-2 text-xl font-bold text-[var(--role-cta-foreground)]">
          Start Pediatric ECG learning
        </h2>
        <p className="mb-5 text-sm text-[color-mix(in_srgb,var(--role-cta-foreground)_80%,transparent)]">
          Full pediatric ECG lane with PALS case simulations and 50 clinician-reviewed questions. Included with eligible RN and NP subscriptions.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/modules/ecg/pediatric" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[var(--role-cta)] shadow-sm">
            <Baby className="h-4 w-4" aria-hidden />
            Pediatric ECG Module
          </Link>
          <Link href="/modules/ecg/pediatric/cases" className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold text-white">
            <Zap className="h-4 w-4" aria-hidden />
            PALS Case Simulations
          </Link>
        </div>
      </section>
    </main>
  );
}
