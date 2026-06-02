import type { Metadata } from "next";
import Link from "next/link";
import { Activity, Baby, BookOpen, Heart } from "lucide-react";
import { AcademyBreadcrumbBar, ClinicalAcademyJsonLdGraph } from "@/components/clinical-academy/clinical-academy-chrome";
import { ecgStandaloneLeafBreadcrumbs } from "@/lib/breadcrumbs/academy-breadcrumbs";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";

export const revalidate = 86400;

const PATH = "/pals-rhythms";
const PAGE_TITLE = "PALS Rhythms for Nurses — Pediatric Cardiac Rhythm Recognition | NurseNest";
const PAGE_H1 = "PALS rhythms for nurses: pediatric cardiac rhythm recognition and algorithm integration";
const PAGE_DESCRIPTION =
  "PALS rhythm recognition for RN and NP nurses: pediatric SVT vs sinus tachycardia, hypoxic bradycardia, VF, asystole, PEA, shockable vs non-shockable rhythms, and PALS algorithm decision branches with age-specific rate thresholds.";

const SITE_ORIGIN = "https://nursenest.ca";

const KEY_DIFFERENTIALS = [
  {
    topic: "Pediatric SVT vs Sinus Tachycardia",
    importance: "Critical",
    points: [
      "SVT: rate > 220 in infants, fixed regardless of activity/state",
      "Sinus tach: rate varies with crying, fever, pain — responds to state change",
      "SVT: no identifiable sinus P-waves (retrograde or absent)",
      "Wrong treatment: cardioverting sinus tachycardia = dangerous",
      "Ice-to-face vagal maneuver for infants; Valsalva for older children",
    ],
  },
  {
    topic: "Hypoxic Bradycardia vs Primary Conduction Disease",
    importance: "Life-threatening",
    points: [
      "Hypoxic bradycardia: SpO₂ falling, respiratory distress — ventilate FIRST",
      "Hypoxic bradycardia reverses with 30 seconds of effective BVM ventilation",
      "Atropine treats vagal bradycardia — NOT hypoxic bradycardia",
      "HR < 60 with poor perfusion not responding to ventilation → CPR per PALS",
      "Children arrest from respiratory failure first — airway intervention is primary",
    ],
  },
  {
    topic: "Shockable vs Non-Shockable Pediatric Arrest",
    importance: "Critical",
    points: [
      "Shockable: VF, pulseless VT → 2 J/kg first shock (4 J/kg subsequent)",
      "Non-shockable: asystole, PEA → CPR + epinephrine 0.01 mg/kg IV/IO",
      "Confirm VF in two leads — fine VF can mimic asystole",
      "Resume CPR immediately after shock — do not pause for rhythm check",
      "Pediatric VF is less common than adult; most pediatric arrests are respiratory",
    ],
  },
];

const AGE_SPECIFIC_RATES = [
  { group: "Neonate (0–30 days)", normal: "100–160", sinus_tach_max: "< 220", svt_range: "220–300", brady: "< 100" },
  { group: "Infant (1–12 months)", normal: "90–150", sinus_tach_max: "< 220", svt_range: "220–300", brady: "< 80" },
  { group: "Toddler (1–3 years)", normal: "70–120", sinus_tach_max: "< 200", svt_range: "180–270", brady: "< 70" },
  { group: "Child (4–12 years)", normal: "60–100", sinus_tach_max: "< 180", svt_range: "150–260", brady: "< 60" },
  { group: "Adolescent (13–18)", normal: "55–95", sinus_tach_max: "< 160", svt_range: "150–250", brady: "< 55" },
];

const FAQ_ITEMS = [
  {
    question: "Why is pediatric bradycardia managed differently from adult bradycardia?",
    answer:
      "In children, bradycardia is most often caused by hypoxia, not primary conduction disease. The PALS approach mandates: support ventilation and oxygenation FIRST. If 30 seconds of effective bag-valve-mask ventilation with supplemental O₂ does not improve heart rate, then CPR and medications are initiated. Giving atropine before ventilating a hypoxic child treats a symptom while ignoring the cause. This is the fundamental difference from adult ACLS: in children, respiratory failure precedes and causes cardiac arrest — treat the airway first.",
  },
  {
    question: "What is the pediatric defibrillation energy and how does it differ from adults?",
    answer:
      "Pediatric defibrillation: 2 J/kg for the first shock. Subsequent shocks can be increased to 4 J/kg. This is weight-based — a 20 kg child receives 40J (first shock), up to 80J (subsequent). Adult defibrillation uses fixed energy: 120–200J biphasic for adults. Use pediatric-specific pads/paddles when available (< 10 kg: infant paddles). If only adult pads are available, ensure minimum 3 cm separation between pads on the chest.",
  },
  {
    question: "What is the key discriminator between SVT and sinus tachycardia in an infant?",
    answer:
      "Rate variability with state change is the most clinically useful bedside discriminator before a 12-lead is available. SVT has a fixed rate regardless of whether the infant is crying, being held, or sleeping. Sinus tachycardia rate decreases when the infant is calmed, fed, or the cause (fever, pain, dehydration) is addressed. On the monitor: SVT shows absent or retrograde P-waves; sinus tachycardia shows upright sinus P-waves before every QRS. Rate threshold (> 220 in infants) is supportive but not definitive — some sinus tachycardias in febrile neonates can reach 220.",
  },
  {
    question: "Why is respiratory sinus arrhythmia a normal finding in children?",
    answer:
      "Respiratory sinus arrhythmia (RSA) is a normal, healthy physiologic variation caused by vagal tone fluctuations with breathing. Heart rate increases with inspiration (vagal inhibition) and slows with expiration (vagal restoration). RSA is more prominent in children and athletes because of higher baseline vagal tone. It is NOT AFib, NOT ectopy, and NOT conduction disease. Key discriminators: RSA has uniformly sinus P-waves throughout, R-R variation correlates exactly with breathing, and no beats are dropped. RSA should not trigger escalation — it is a sign of healthy autonomic function.",
  },
  {
    question: "Is PALS rhythm content covered in the NurseNest ECG module?",
    answer:
      "Yes. The Pediatric ECG lane within the NurseNest ECG module covers PALS-relevant rhythms: SVT vs sinus tachycardia across age groups, hypoxic bradycardia management, PALS arrest rhythms (shockable and non-shockable), hyperkalemia ECG changes in pediatric patients, long QT syndrome and torsades risk, WPW and pre-excitation, and post-operative congenital heart telemetry patterns. Six PALS deterioration case simulations include decision-point interaction and nursing error trap teaching. Included with eligible RN and NP subscriptions.",
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
          "PALS rhythms nursing",
          "pediatric cardiac rhythm recognition",
          "pediatric SVT nursing",
          "PALS algorithm nursing",
          "pediatric bradycardia hypoxia",
          "pediatric VF nursing",
          "shockable non-shockable PALS",
          "pediatric ECG RN NP",
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

export default function PalsRhythmsPage() {
  const breadcrumbResolution = ecgStandaloneLeafBreadcrumbs("PALS Rhythms", PATH);
  const jsonLdGraph = [
      {
        "@type": "Course",
        name: "PALS Rhythms for Nurses",
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

      <header className="mb-10">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--semantic-chart-4)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-4)_06%,var(--semantic-surface))] px-3 py-1 text-xs font-semibold text-[var(--semantic-chart-4)]">
          <Baby className="h-3.5 w-3.5" aria-hidden />
          Pediatric ECG — PALS 2020 Guidelines
        </div>
        <h1 className="mb-4 text-3xl font-bold leading-tight text-[var(--semantic-text-primary)] sm:text-4xl">
          {PAGE_H1}
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-[var(--semantic-text-secondary)]">
          Pediatric rhythm recognition requires age-specific rate thresholds and different algorithm
          logic than adult ACLS. This page covers the critical PALS differentials, age-stratified
          normal rate ranges, and the key management differences driven by pediatric physiology.
        </p>
      </header>

      {/* Age-specific rates */}
      <section className="mb-12 overflow-x-auto" aria-labelledby="rates-heading">
        <h2 id="rates-heading" className="mb-4 text-2xl font-bold text-[var(--semantic-text-primary)]">
          Age-specific pediatric heart rate thresholds
        </h2>
        <p className="mb-4 text-sm text-[var(--semantic-text-secondary)]">
          Using adult rate thresholds for pediatric patients causes both under- and over-escalation.
          A heart rate of 160 bpm is bradycardia in a neonate but tachycardia in an adolescent.
        </p>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-[var(--semantic-surface-alt)] text-left text-xs font-semibold text-[var(--semantic-text-muted)] uppercase tracking-wide">
              <th className="px-3 py-2 border border-[var(--semantic-border-soft)]">Age Group</th>
              <th className="px-3 py-2 border border-[var(--semantic-border-soft)]">Normal (bpm)</th>
              <th className="px-3 py-2 border border-[var(--semantic-border-soft)]">Sinus Tach Max</th>
              <th className="px-3 py-2 border border-[var(--semantic-border-soft)]">SVT Range</th>
              <th className="px-3 py-2 border border-[var(--semantic-border-soft)]">Brady Threshold</th>
            </tr>
          </thead>
          <tbody>
            {AGE_SPECIFIC_RATES.map((row) => (
              <tr key={row.group} className="border-b border-[var(--semantic-border-soft)]">
                <td className="px-3 py-2 border border-[var(--semantic-border-soft)] font-medium text-[var(--semantic-text-primary)]">{row.group}</td>
                <td className="px-3 py-2 border border-[var(--semantic-border-soft)] text-[var(--semantic-text-secondary)]">{row.normal}</td>
                <td className="px-3 py-2 border border-[var(--semantic-border-soft)] text-[var(--semantic-text-secondary)]">{row.sinus_tach_max}</td>
                <td className="px-3 py-2 border border-[var(--semantic-border-soft)] text-[var(--semantic-danger)] font-medium">{row.svt_range}</td>
                <td className="px-3 py-2 border border-[var(--semantic-border-soft)] text-[var(--semantic-warning-contrast)]">{row.brady}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Key differentials */}
      <section className="mb-12 space-y-6" aria-labelledby="differentials-heading">
        <h2 id="differentials-heading" className="text-2xl font-bold text-[var(--semantic-text-primary)]">
          Critical PALS rhythm differentials
        </h2>
        {KEY_DIFFERENTIALS.map((diff) => (
          <div key={diff.topic} className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5">
            <div className="mb-3 flex items-center gap-2">
              <Heart className="h-5 w-5 text-[var(--semantic-danger)]" aria-hidden />
              <div>
                <span className="font-bold text-[var(--semantic-text-primary)]">{diff.topic}</span>
                <span className={`ml-2 rounded-full px-2 py-0.5 text-[10px] font-bold ${diff.importance === "Life-threatening" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>
                  {diff.importance}
                </span>
              </div>
            </div>
            <ul className="space-y-1">
              {diff.points.map((p) => (
                <li key={p} className="flex items-start gap-2 text-sm text-[var(--semantic-text-secondary)]">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--semantic-brand)]" aria-hidden />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {/* FAQ */}
      <section className="mb-12" aria-labelledby="faq-heading">
        <h2 id="faq-heading" className="mb-6 text-2xl font-bold text-[var(--semantic-text-primary)]">
          Frequently asked questions — PALS rhythms
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
        <h2 id="related-heading" className="mb-4 text-lg font-semibold text-[var(--semantic-text-primary)]">Related pediatric and ACLS topics</h2>
        <div className="flex flex-wrap gap-2">
          {[
            { href: "/pediatric-ecg", label: "Pediatric ECG" },
            { href: "/acls-rhythms", label: "ACLS Rhythms" },
            { href: "/advanced-ecg-nursing/pediatric-ecg", label: "Advanced Pediatric ECG" },
            { href: "/ecg", label: "ECG Hub" },
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
          Practice PALS rhythm recognition
        </h2>
        <p className="mb-5 text-sm text-[color-mix(in_srgb,var(--role-cta-foreground)_80%,transparent)]">
          Pediatric ECG lane with PALS case simulations included with eligible RN and NP subscriptions.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/modules/ecg/pediatric" className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[var(--role-cta)] shadow-sm">
            <Baby className="h-4 w-4" aria-hidden />
            Pediatric ECG Module
          </Link>
          <Link href="/modules/ecg/pediatric/cases" className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold text-white">
            <Activity className="h-4 w-4" aria-hidden />
            PALS Case Simulations
          </Link>
        </div>
      </section>
    </main>
  );
}
