import type { Metadata } from "next";
import Link from "next/link";
import { Activity, ArrowRight, CheckCircle2 } from "lucide-react";
import { AcademyBreadcrumbBar, ClinicalAcademyJsonLdGraph } from "@/components/clinical-academy/clinical-academy-chrome";
import { ecgAdvancedLeafBreadcrumbs } from "@/lib/breadcrumbs/academy-breadcrumbs";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";

export const revalidate = 86400;

const PATH = "/advanced-ecg-nursing/rhythm-practice";
const PAGE_TITLE = "ECG Rhythm Practice Lab — Telemetry Drills for RN and NP | NurseNest";
const PAGE_H1 = "ECG rhythm practice lab: from beginner strips to advanced telemetry interpretation";
const PAGE_DESCRIPTION =
  "Interactive ECG rhythm identification drills for RN, NP, ICU, ER, and telemetry nurses. Practice Afib, VTach, heart blocks, paced rhythms, and 20+ arrhythmias with rationale-first explanations and adaptive weak-topic tracking.";

const PILLAR = "/advanced-ecg-nursing";

const SECTIONS = [
  {
    id: "why-rhythm-practice-matters",
    heading: "Why structured rhythm practice outperforms passive study",
    body: `Rhythm recognition is a pattern-matching skill, not a memorization task. Nurses who study rhythm strips passively — reading a textbook description, seeing one example, then moving on — consistently underperform in clinical settings compared to nurses who practice active strip identification repeatedly across varying presentations. The difference is exposure volume combined with immediate corrective feedback.

The most dangerous telemetry errors cluster in three zones: mistaking ventricular tachycardia for supraventricular tachycardia with aberrancy, misidentifying complete heart block as a slow junctional rhythm, and attributing a lethal rhythm to artifact. Each of these errors has killed patients. Each is preventable with systematic drill practice that specifically trains the recognition of distinguishing features under time pressure.

Deliberate practice in the NurseNest Rhythm Practice Lab uses adaptive difficulty — strips become progressively more complex as accuracy improves — and tracks weak-topic patterns across sessions. When a learner consistently misidentifies Mobitz II as Mobitz I, the system routes additional Mobitz II strips and surfaces the lesson on AV node physiology. This feedback loop compresses the learning curve that traditional study materials cannot replicate.`,
  },
  {
    id: "core-rhythm-curriculum",
    heading: "Core rhythm curriculum: 20+ arrhythmias from foundational to advanced",
    body: `The foundational tier covers the rhythms every nurse must recognize before entering any unit with telemetry monitoring. Sinus bradycardia and tachycardia establish the baseline for rate and regularity. Normal sinus rhythm recognition anchors all deviation identification. P-wave morphology and PR interval consistency are the first analytical skills developed before introducing arrhythmias.

The intermediate tier introduces the arrhythmias most frequently encountered on clinical units. Atrial fibrillation — characterized by irregularly irregular rhythm, absent P waves replaced by fibrillatory baseline, and variable ventricular response — requires more than label recognition. Learners must also identify rapid versus controlled ventricular response and recognize signs of hemodynamic compromise. Atrial flutter with its characteristic sawtooth flutter waves at 250–350 bpm and typical 2:1, 3:1, or 4:1 conduction ratios appears consistently in cardiac and post-operative populations.

Supraventricular tachycardia presents as a narrow-complex regular tachycardia at 150–250 bpm with P waves often buried in or immediately before the QRS. Heart block identification requires systematic analysis: first-degree block shows a PR interval greater than 200 ms; Mobitz I (Wenckebach) shows progressive PR prolongation before a dropped QRS; Mobitz II shows constant PR intervals with suddenly dropped beats without warning — the clinically critical distinction that determines whether the patient needs urgent pacing consultation. Third-degree heart block shows complete AV dissociation with P waves and QRS complexes marching at independent rates.

The advanced tier covers ventricular arrhythmias, paced rhythms, and the rhythms that require emergency response. Ventricular tachycardia, ventricular fibrillation, torsades de pointes, junctional rhythms, PEA recognition, and asystole all require precise identification because the intervention choices diverge completely.`,
  },
  {
    id: "paced-rhythms-practice",
    heading: "Paced rhythm identification: a clinically underestimated skill gap",
    body: `Paced rhythm interpretation consistently ranks among the weakest areas in nursing telemetry competency assessments. The skill gap is not theoretical — it translates directly into failure to recognize pacemaker malfunction in dependent patients.

Ventricular paced rhythms are identified by the pacer spike preceding a wide, aberrant QRS with a left bundle branch block morphology. Atrial paced rhythms show a spike before each P wave with normal QRS conduction unless a conduction disorder is present. Dual-chamber pacing shows both atrial and ventricular spikes. AV sequential pacing requires two spikes: one before the P wave and one before a wide QRS.

Malfunction patterns demand recognition skills beyond baseline capture identification. Failure to capture means spikes appear at the programmed rate but are not followed by a P wave or QRS — the electrical stimulus is delivered but the myocardium does not respond. Failure to sense means the device fires inappropriately without recognizing native beats, potentially delivering competitive pulses or spike-on-T events. Failure to pace means spikes do not appear at the expected rate. Each pattern requires immediate notification and clinical response.`,
  },
  {
    id: "telemetry-alarm-interpretation",
    heading: "Telemetry alarm interpretation: reducing alarm fatigue while catching real events",
    body: `Alarm fatigue is a documented patient safety crisis. Hospitals receive between 150 and 350 monitor alarms per bed per day, and studies consistently show alarm response rates below 50% on busy units. The nurse who responds to every alarm identically — or who defaults to silencing alarms without systematic assessment — creates risk in both directions.

Effective telemetry alarm management requires competency in rapid strip review: assess the alarm context, identify whether the rhythm on screen is genuinely abnormal or artifact, evaluate the patient's clinical presentation in the bedside context, and decide whether the alarm demands immediate escalation, further observation, or electrode intervention.

Artifact recognition is a specific teachable skill. Motion artifact produces irregular baseline interference that can mimic ventricular fibrillation — identifying the preserved QRS complexes buried within artifact prevents emergency response for a patient changing position. Lead failure alarms from a disconnected electrode should not trigger the same response as a rhythm change alarm, but they still require prompt correction because monitoring gaps miss real events. Practice in the NurseNest lab includes deliberate artifact and lead failure scenarios alongside genuine arrhythmia strips to build the clinical discrimination skills that alarm-response protocols require.`,
  },
];

const FAQ_ITEMS = [
  {
    question: "What rhythms are covered in the ECG Rhythm Practice Lab?",
    answer:
      "The lab covers 20+ rhythms across three difficulty tiers. Foundational: sinus bradycardia, sinus tachycardia, normal sinus rhythm. Intermediate: Afib, Aflutter, SVT, first-degree block, Mobitz I, Mobitz II, complete heart block, junctional rhythms, PVCs. Advanced: ventricular tachycardia, ventricular fibrillation, torsades de pointes, paced rhythms (ventricular, atrial, dual-chamber, AV sequential), PEA, asystole, accelerated idioventricular rhythm.",
  },
  {
    question: "How does adaptive difficulty work in the rhythm practice lab?",
    answer:
      "The practice lab tracks your accuracy by rhythm type across sessions. When you consistently identify a rhythm correctly, it reduces that rhythm's frequency and introduces more challenging variants. When you miss a rhythm repeatedly, it surfaces more strips of that type alongside the related lesson content. Timed drill mode adds time pressure to simulate the clinical environment where rhythm recognition must happen rapidly.",
  },
  {
    question: "How is rhythm practice different from the ECG quiz bank?",
    answer:
      "The Rhythm Practice Lab focuses specifically on strip identification with rapid feedback loops and adaptive routing. The ECG quiz bank includes strip identification as part of broader clinical reasoning questions — integrating rhythm recognition with rate control decisions, medication choices, nursing interventions, and escalation thresholds. Both are included in the Advanced ECG add-on and designed to work together.",
  },
  {
    question: "Do telemetry nurses in step-down units benefit from this content?",
    answer:
      "Yes. Step-down and telemetry nurses are among the highest-priority learners for this module. The advanced rhythm content — especially paced rhythm malfunction recognition, VT vs SVT differentiation, and alarm fatigue management — directly addresses the clinical scenarios most commonly encountered in monitored step-down care settings. The content is also highly relevant for new-to-telemetry nurses completing unit-based competency validation.",
  },
];

const RELATED_LINKS = [
  { href: PILLAR, label: "Advanced ECG for Nurses" },
  { href: "/advanced-ecg-nursing/12-lead-stemi", label: "12-Lead STEMI Interpretation" },
  { href: "/advanced-ecg-nursing/acls-rhythms", label: "ACLS Rhythms" },
  { href: "/advanced-ecg-nursing/critical-care-ecg", label: "Critical Care ECG" },
  { href: "/advanced-ecg-nursing/telemetry-monitoring", label: "Telemetry Monitoring" },
  { href: "/ecg-interpretation", label: "ECG Interpretation for Nurses" },
  { href: "/modules/ecg-advanced", label: "Advanced ECG Module" },
];

const COVERAGE_ITEMS = [
  "Afib: irregularly irregular, rate control vs rhythm control framing",
  "Aflutter: sawtooth flutter waves, variable conduction ratios",
  "SVT: narrow-complex, retrograde P waves, vagal maneuver response",
  "Ventricular tachycardia: wide-complex, Brugada criteria application",
  "Ventricular fibrillation: chaotic waveform, defibrillation urgency",
  "Torsades de Pointes: QT prolongation context, polymorphic VT pattern",
  "Heart blocks: first-degree, Mobitz I, Mobitz II, complete heart block",
  "Paced rhythms: ventricular, atrial, dual-chamber, malfunction patterns",
  "Junctional rhythms: rate, inverted P waves, clinical context",
  "PEA and asystole: rhythm vs no rhythm, reversible causes",
  "Artifact recognition: motion, lead failure, vs lethal rhythm mimics",
  "Telemetry alarm triage: real event vs false positive decision framework",
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
          "ECG rhythm practice",
          "rhythm strip practice nurses",
          "telemetry practice questions",
          "ECG interpretation practice",
          "ECG quiz nursing",
          "heart block identification",
          "paced rhythm interpretation",
          "telemetry nurse training",
          "VTach VFib recognition",
          "Afib nursing",
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
    { pathname: PATH, locale: DEFAULT_MARKETING_LOCALE, routeGroup: "marketing.default.advancedEcgRhythmPractice" },
  );
}

export default function RhythmPracticePage() {

  const breadcrumbResolution = ecgAdvancedLeafBreadcrumbs('Rhythm Practice Lab', PATH);
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
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--semantic-chart-1)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-1)_08%,var(--semantic-surface))] text-[var(--semantic-chart-1)]">
              <Activity className="h-5 w-5" aria-hidden />
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--semantic-text-muted)]">
              ECG Mastery · Rhythm Practice Lab
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
              Start Rhythm Drills
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
          <h2 className="text-base font-semibold text-[var(--semantic-text-primary)]">Rhythm lab coverage at a glance</h2>
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
