import type { Metadata } from "next";
import Link from "next/link";
import { AcademyBreadcrumbBar, ClinicalAcademyJsonLdGraph } from "@/components/clinical-academy/clinical-academy-chrome";
import { ecgAdvancedHubBreadcrumbs } from "@/lib/breadcrumbs/academy-breadcrumbs";
import { Activity, ArrowRight, BookOpen, CheckCircle2, Zap } from "lucide-react";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";

export const revalidate = 86400;

const PATH = "/advanced-ecg-nursing";
const PAGE_TITLE = "Advanced ECG Interpretation for Critical Care Nurses | NurseNest";
const PAGE_H1 = "Advanced ECG interpretation: 12-lead analysis, STEMI recognition, and critical care telemetry";
const PAGE_DESCRIPTION =
  "Advanced ECG interpretation for RN and NP nurses: STEMI localization, arrhythmia recognition, 12-lead analysis, electrolyte ECG changes, and ICU/CCU telemetry scenarios. 200+ clinical questions.";

const SITE_ORIGIN = "https://nursenest.ca";

const FAQ_ITEMS = [
  {
    question: "What ECG topics are covered in the Advanced ECG module?",
    answer:
      "Nine clinical tracks: Advanced ECG Foundations, 12-Lead Interpretation, Ischemia and Infarction (including STEMI equivalents), Conduction Blocks, Heart Blocks, Pacemakers, Electrolytes and Toxicology, Critical-Care Telemetry, ACLS ECG Decision-Making, and Advanced ECG Case Simulations. Specialty content adds ARVC, cardiac tamponade, Takotsubo, channelopathies, and EP-level pearls.",
  },
  {
    question: "Is the Advanced ECG module included with an RN subscription?",
    answer:
      "No. Advanced ECG is a separate paid add-on for RN and NP learners. Core ECG (rhythm recognition foundations) is included with eligible base RN and NP subscriptions. Advanced ECG unlocks 200+ questions across nine tracks.",
  },
  {
    question: "How is NurseNest advanced ECG different from ACLS training?",
    answer:
      "ACLS trains algorithm execution during cardiac arrest. NurseNest Advanced ECG builds the interpretive skills that precede ACLS: recognizing rhythms, understanding shockable vs non-shockable, identifying reversible causes. The two are complementary — ACLS tells you what to do; NurseNest ECG training builds the judgment to know when.",
  },
  {
    question: "Does the module cover 12-lead ECG interpretation?",
    answer:
      "Yes. The 12-lead ECG track covers axis interpretation, bundle branch block morphology, STEMI localization by territory, posterior STEMI recognition (ST depression V1–V3), STEMI equivalents (De Winter T-waves, Wellens syndrome), and high-lateral, inferior, and right ventricular MI patterns.",
  },
  {
    question: "What heart block types are covered?",
    answer:
      "All degrees: first-degree AV block, Mobitz I (Wenckebach) vs Mobitz II distinction with clinical significance, 2:1 block, and complete (third-degree) heart block. Emphasis on the Mobitz I vs II distinction — the most clinically consequential because Mobitz II requires urgent pacemaker evaluation while Mobitz I is usually benign.",
  },
  {
    question: "Are ECG practice questions included for exam prep?",
    answer:
      "Yes. 200+ strip-based practice questions are integrated with the NurseNest adaptive weak-area system. Questions include detailed rationales explaining both why the correct answer is right and why each distractor is wrong. Weak ECG topics surface alongside other clinical gaps in your study loop.",
  },
];

const COVERAGE_ITEMS = [
  "Brugada 4-step WCT algorithm — VT vs SVT",
  "Posterior STEMI: dominant R in V2, ST depression V1–V3",
  "De Winter T-waves: LAD occlusion without ST elevation",
  "Wellens syndrome: reperfused proximal LAD critical stenosis",
  "Mobitz I vs Mobitz II: clinical significance and urgency",
  "Complete heart block: escape rhythm recognition and urgency",
  "Failure to capture vs undersensing vs failure to pace",
  "R-on-T risk from pacemaker undersensing",
  "Hyperkalemia ECG progression: peaked T → wide QRS → sine wave",
  "Hypokalemia: U waves, T-wave flattening, arrhythmia risk",
  "TCA overdose: terminal R in aVR, sodium bicarbonate",
  "QT prolongation: torsades de pointes risk and prevention",
  "Digoxin toxicity: bigeminal PVCs, bidirectional VT",
  "Electrical alternans: cardiac tamponade recognition",
  "ARVC: epsilon wave, LBBB-morphology VT",
  "LQT genotype-specific triggers (LQT1, LQT2, LQT3)",
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
          "ECG interpretation for nurses",
          "12 lead ECG course nursing",
          "arrhythmia interpretation nursing",
          "cardiac rhythm interpretation",
          "telemetry nursing",
          "ACLS rhythm interpretation",
          "ECG practice questions RN",
          "heart block nursing",
          "STEMI recognition nursing",
          "NP ECG interpretation",
          "ICU ECG training",
        ],
        openGraph: {
          title: PAGE_TITLE,
          description: PAGE_DESCRIPTION,
          url: alt.canonical,
          type: "article",
          siteName: "NurseNest",
        },
        twitter: {
          card: "summary_large_image",
          title: PAGE_TITLE,
          description: PAGE_DESCRIPTION,
        },
      };
    },
    { pathname: PATH, locale: DEFAULT_MARKETING_LOCALE, routeGroup: "marketing.default.advancedEcgNursing" },
  );
}

export default function AdvancedEcgNursingPage() {
  const breadcrumbResolution = ecgAdvancedHubBreadcrumbs();
  const jsonLdGraph = [
      {
        "@type": "EducationalCourse",
        "@id": `${SITE_ORIGIN}${PATH}#course`,
        name: "Advanced ECG Nursing — Cardiac Rhythm Mastery",
        description: PAGE_DESCRIPTION,
        url: `${SITE_ORIGIN}${PATH}`,
        provider: {
          "@type": "Organization",
          name: "NurseNest",
          url: SITE_ORIGIN,
        },
        educationalLevel: "Advanced",
        teaches: [
          "12-lead ECG interpretation",
          "Arrhythmia recognition",
          "STEMI and STEMI equivalent recognition",
          "Heart block interpretation (Mobitz I, Mobitz II, complete heart block)",
          "Ventricular tachycardia differentiation (VT vs SVT)",
          "Pacemaker malfunction recognition",
          "Electrolyte ECG changes (hyperkalemia, hypokalemia)",
          "Toxicology ECG patterns (TCA, digoxin, QT prolongation)",
          "ACLS-integrated ECG decision-making",
          "Cardiac tamponade recognition",
        ],
        audience: {
          "@type": "EducationalAudience",
          educationalRole: "Student",
          audienceType: "Registered Nurses, Nurse Practitioners, Nursing Students",
        },
        inLanguage: "en",
        isAccessibleForFree: false,
        courseMode: "online",
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

        {/* Hero */}
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
          <p className="max-w-2xl text-base leading-relaxed text-[var(--semantic-text-secondary)]">
            {PAGE_DESCRIPTION}
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link
              href="/modules/ecg-advanced"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--role-cta)] px-5 py-2.5 text-sm font-semibold text-[var(--role-cta-foreground)] shadow-[0_2px_10px_var(--role-cta-shadow)]"
            >
              <Zap className="h-4 w-4" aria-hidden />
              Open Advanced ECG Module
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href="/ecg-interpretation"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-5 py-2.5 text-sm font-semibold text-[var(--semantic-text-secondary)] hover:bg-[var(--semantic-surface-alt)]"
            >
              <BookOpen className="h-4 w-4" aria-hidden />
              Start Basic ECG First
            </Link>
          </div>
        </header>

        {/* ECG Ecosystem Hub */}
        <section className="mb-10" aria-labelledby="ecosystem-heading">
          <h2 id="ecosystem-heading" className="mb-2 text-xl font-semibold text-[var(--semantic-text-primary)]">
            ECG Mastery ecosystem — 9 clinical tracks
          </h2>
          <p className="mb-5 text-sm text-[var(--semantic-text-secondary)]">
            Master ECG interpretation with advanced rhythm practice, STEMI recognition, telemetry interpretation, and real clinical simulations.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { href: "/advanced-ecg-nursing/rhythm-practice", badge: "Module 1", title: "Rhythm Practice Lab", desc: "20+ arrhythmias, adaptive drills, telemetry alarm triage, paced rhythm interpretation." },
              { href: "/advanced-ecg-nursing/12-lead-stemi", badge: "Module 2", title: "12-Lead STEMI Interpretation", desc: "STEMI localization, culprit artery identification, STEMI equivalents, reciprocal changes." },
              { href: "/advanced-ecg-nursing/acls-rhythms", badge: "Module 3", title: "ACLS + Emergency ECG", desc: "Shockable vs non-shockable, cardioversion, defibrillation, post-ROSC ECG, antiarrhythmics." },
              { href: "/advanced-ecg-nursing/electrolyte-ecg-changes", badge: "Module 4", title: "Electrolyte ECG Changes", desc: "Hyperkalemia progression, hypokalemia U-waves, calcium effects, magnesium and torsades." },
              { href: "/advanced-ecg-nursing/medication-induced-ecg-changes", badge: "Module 5", title: "Medication-Induced ECG Changes", desc: "Digoxin toxicity, QT prolongation, TCA sodium channel blockade, antiarrhythmic monitoring." },
              { href: "/advanced-ecg-nursing/critical-care-ecg", badge: "Module 6", title: "Critical Care ECG", desc: "Bundle branch blocks, ventricular ectopy, ICU ischemia monitoring, artifact recognition." },
              { href: "/advanced-ecg-nursing/pediatric-ecg", badge: "Module 7", title: "Pediatric ECG", desc: "Age-specific rate norms, pediatric SVT, WPW, LQTS, Brugada, congenital heart block." },
              { href: "/advanced-ecg-nursing/telemetry-monitoring", badge: "Module 8", title: "Telemetry Monitoring", desc: "Alarm fatigue management, lead selection strategy, ST monitoring, rapid deterioration." },
              { href: "/advanced-ecg-nursing/ecg-case-simulations", badge: "Module 9 · Premium", title: "ECG Case Simulations", desc: "Branching clinical scenarios: STEMI progression, hyperkalemia arrest, torsades, and more." },
            ].map((mod) => (
              <Link
                key={mod.href}
                href={mod.href}
                className="group flex flex-col gap-2 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 transition-colors hover:border-[color-mix(in_srgb,var(--semantic-chart-1)_40%,var(--semantic-border-soft))] hover:bg-[color-mix(in_srgb,var(--semantic-chart-1)_04%,var(--semantic-surface))]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--semantic-chart-1)]">{mod.badge}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-[var(--semantic-text-muted)] transition-transform group-hover:translate-x-0.5" aria-hidden />
                </div>
                <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">{mod.title}</p>
                <p className="text-xs leading-relaxed text-[var(--semantic-text-secondary)]">{mod.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Coverage grid */}
        <section className="mb-10 rounded-2xl border border-[color-mix(in_srgb,var(--semantic-chart-1)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_14%,var(--semantic-surface))] p-5 sm:p-6" aria-labelledby="coverage-heading">
          <h2 id="coverage-heading" className="text-base font-semibold text-[var(--semantic-text-primary)]">
            What you learn in Advanced ECG
          </h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2" aria-label="Advanced ECG topics covered">
            {COVERAGE_ITEMS.map((item) => (
              <li key={item} className="flex items-start gap-2 text-xs text-[var(--semantic-text-secondary)]">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--semantic-chart-1)]" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Main content sections */}
        <article className="mb-10 space-y-10">

          {/* 1. Advanced ECG Interpretation */}
          <section id="advanced-ecg-interpretation" aria-labelledby="h-adv-ecg">
            <h2 id="h-adv-ecg" className="mb-4 text-xl font-semibold text-[var(--semantic-text-primary)]">
              Advanced ECG interpretation: beyond rhythm labels
            </h2>
            <div className="space-y-4 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
              <p>
                Advanced ECG interpretation for nurses moves beyond naming rhythms into understanding what each rhythm demands clinically. Wide-complex tachycardia is the highest-stakes diagnostic challenge: the default assumption must be ventricular tachycardia — not SVT with aberrancy — because treating VT as SVT with verapamil can cause hemodynamic collapse in minutes. The Brugada four-step algorithm provides a systematic approach: absence of RS complex in precordial leads, RS interval duration, AV dissociation, and V1/V6 morphologic criteria — each applied in sequence.
              </p>
              <p>
                Morphologic criteria distinguish VT from SVT with aberrancy. In RBBB-pattern wide-complex tachycardia, true RBBB shows a triphasic rSR′ in V1 with upright Rs in V6. VT with RBBB-like morphology shows monophasic R or qR in V1 and QS or rS in V6. AV dissociation — P waves marching through QRS at a different rate — confirms VT definitively. Capture beats and fusion beats are pathognomonic for VT.
              </p>
              <p>
                For RN and NP students targeting NCLEX, CNPLE, or specialty certification, advanced ECG interpretation is examined through integrated clinical vignettes — not isolated rhythm labeling. NurseNest{" "}
                <Link href="/advanced-ecg-nursing" className="font-medium text-[var(--semantic-info)] hover:underline">
                  Advanced ECG lessons
                </Link>{" "}
                and{" "}
                <Link href="/advanced-ecg-nursing/ecg-case-simulations" className="font-medium text-[var(--semantic-info)] hover:underline">
                  clinical scenarios
                </Link>{" "}
                build this integrated reasoning explicitly.
              </p>
            </div>
          </section>

          {/* 2. 12-Lead ECG Analysis */}
          <section id="twelve-lead-ecg-analysis" aria-labelledby="h-12lead">
            <h2 id="h-12lead" className="mb-4 text-xl font-semibold text-[var(--semantic-text-primary)]">
              12-lead ECG analysis: axis, morphology, and territory
            </h2>
            <div className="space-y-4 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
              <p>
                Systematic 12-lead ECG analysis begins with rate and rhythm, then axis (normal, left axis deviation, right axis deviation, extreme axis), followed by intervals (PR, QRS, QT/QTc), morphology (bundle branch blocks, hypertrophy patterns), and ST-T changes (ischemia, strain, pericarditis). Each step narrows the differential before clinical context is applied.
              </p>
              <p>
                Axis interpretation using leads I and aVF guides the initial assessment: normal axis falls in the left quadrant (positive I, positive aVF), left axis deviation points leftward (positive I, negative aVF), right axis deviation points rightward (negative I, positive aVF). Left bundle branch block (LBBB) changes the interpretation of ST changes entirely — the Sgarbossa criteria and modified Sgarbossa criteria identify ischemia superimposed on LBBB, preventing both missed MI and inappropriate cath lab activation.
              </p>
              <p>
                For NP learners, 12-lead ECG analysis includes the outpatient perspective: interpreting an incidental ECG in a chest pain evaluation, recognizing when left ventricular hypertrophy (LVH) voltage criteria require further evaluation, and identifying the ECG findings that demand same-day cardiology referral versus routine follow-up. NurseNest{" "}
                <Link href="/advanced-ecg-nursing/12-lead-stemi" className="font-medium text-[var(--semantic-info)] hover:underline">
                  Advanced ECG video drills
                </Link>{" "}
                provide strip-by-strip 12-lead analysis with full rationale.
              </p>
            </div>
          </section>

          {/* 3. Arrhythmia Recognition */}
          <section id="arrhythmia-recognition" aria-labelledby="h-arrhythmia">
            <h2 id="h-arrhythmia" className="mb-4 text-xl font-semibold text-[var(--semantic-text-primary)]">
              Arrhythmia recognition: supraventricular, ventricular, and conduction
            </h2>
            <div className="space-y-4 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
              <p>
                Arrhythmia recognition for telemetry nursing requires systematic classification: Is the rhythm regular or irregular? Is the QRS narrow or wide? Are P waves present and related to QRS? This three-question approach generates an initial differential before morphologic analysis applies.
              </p>
              <p>
                Supraventricular arrhythmias include atrial fibrillation (irregularly irregular, absent P waves), atrial flutter (sawtooth flutter waves at 300 bpm, regular ventricular rate at 2:1, 3:1, or 4:1 ratio), AVNRT (retrograde P waves buried in or just after QRS), and AVRT (retrograde P waves after QRS using accessory pathway). The therapeutic distinction matters: adenosine terminates both AVNRT and AVRT — it will not convert atrial flutter or AFib.
              </p>
              <p>
                Ventricular arrhythmias include PVCs (early, wide, compensatory pause), ventricular bigeminy and trigeminy (pattern recognition), non-sustained VT (3+ consecutive wide complexes, terminates spontaneously), and sustained VT. VF appears as chaotic electrical activity without organized QRS — no pulse, immediate defibrillation. AIVR (accelerated idioventricular rhythm) is a benign reperfusion rhythm: slow, wide-complex rhythm at 60–100 bpm, typically seen post-STEMI thrombolysis.
              </p>
            </div>
          </section>

          {/* 4. STEMI/NSTEMI Recognition */}
          <section id="stemi-nstemi-recognition" aria-labelledby="h-stemi">
            <h2 id="h-stemi" className="mb-4 text-xl font-semibold text-[var(--semantic-text-primary)]">
              STEMI and STEMI equivalent recognition
            </h2>
            <div className="space-y-4 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
              <p>
                Classic STEMI criteria (≥1 mm ST elevation in ≥2 contiguous leads, or ≥2 mm in V1–V4) miss approximately 25% of acute coronary occlusions. The occlusion MI (OMI) framework recognizes patterns that require emergent reperfusion even without meeting traditional criteria.
              </p>
              <p>
                Posterior STEMI is the most commonly missed pattern: standard 12-lead shows ST depression in V1–V3 because these leads are electrically opposite the posterior wall. The clue is ST depression with a dominant R wave in V2 (the posterior Q-wave equivalent). Posterior leads V7, V8, V9 reveal the true ST elevation. De Winter T-waves — J-point depression with upsloping ST merging into tall peaked T-waves in precordial leads — represent acute LAD occlusion without ST elevation and requires the same urgency as anterior STEMI. Wellens syndrome (deeply inverted or biphasic T-waves in V2–V3 in a pain-free patient with recent chest pain) signals a reperfused proximal LAD critical stenosis that will re-occlude without urgent revascularization.
              </p>
              <p>
                Territory localization from ST changes guides clinical urgency: inferior STEMI (II, III, aVF) requires right-sided leads to detect concurrent RV involvement, which changes fluid management; lateral STEMI (I, aVL, V5–V6) often reflects diagonal or circumflex territory; anterior STEMI (V1–V4) typically indicates LAD involvement.
              </p>
            </div>
          </section>

          {/* 5. Heart Blocks */}
          <section id="heart-blocks" aria-labelledby="h-blocks">
            <h2 id="h-blocks" className="mb-4 text-xl font-semibold text-[var(--semantic-text-primary)]">
              Heart block interpretation: Mobitz I, Mobitz II, and complete heart block
            </h2>
            <div className="space-y-4 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
              <p>
                AV conduction blocks are classified by the relationship between P waves and QRS complexes. First-degree AV block is a prolonged PR interval (greater than 200 ms) with every P wave conducting — benign in isolation, clinically significant only when it contributes to hemodynamic compromise in already-compromised patients.
              </p>
              <p>
                Second-degree AV block requires distinguishing Mobitz I from Mobitz II — the most clinically consequential distinction in ECG interpretation. Mobitz I (Wenckebach) shows progressive PR prolongation until a QRS is dropped, then resets. The block is at the AV node level, usually benign, rarely requires pacing, and is commonly seen with inferior MI and increased vagal tone. Mobitz II shows a constant PR interval with sudden, unexpected dropped QRS complexes without PR prolongation. The block is infranodal (His-Purkinje), carries a high risk of progression to complete heart block, and requires urgent pacemaker evaluation even when the patient is asymptomatic. A 2:1 block — every other P wave conducts — requires analysis of adjacent conducted beats to distinguish Mobitz I from Mobitz II.
              </p>
              <p>
                Complete (third-degree) heart block shows P waves and QRS complexes marching independently at different rates — complete AV dissociation. The ventricular rate depends entirely on the escape rhythm: a junctional escape at 40–60 bpm produces narrow QRS complexes and is more stable; a ventricular escape at 20–40 bpm produces wide QRS complexes and is less reliable. Complete heart block is a transcutaneous pacing emergency when the escape rhythm is inadequate or the patient is hemodynamically compromised.
              </p>
            </div>
          </section>

          {/* 6. Electrolyte ECG Changes — below fold on most devices */}
          <section id="electrolyte-ecg-changes" aria-labelledby="h-electrolyte" className="nn-content-visibility-auto">
            <h2 id="h-electrolyte" className="mb-4 text-xl font-semibold text-[var(--semantic-text-primary)]">
              Electrolyte ECG changes: hyperkalemia, hypokalemia, and QT prolongation
            </h2>
            <div className="space-y-4 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
              <p>
                Hyperkalemia produces a recognizable ECG progression that correlates with serum potassium levels. Mild hyperkalemia (5.5–6.5 mEq/L) produces tall, peaked, narrow-based T waves — most prominent in precordial leads. Moderate hyperkalemia (6.5–7.5 mEq/L) flattens and widens the P wave and prolongs the PR interval. Severe hyperkalemia (greater than 7.5 mEq/L) widens the QRS progressively, eventually producing a sine-wave morphology as P waves disappear and the QRS and T wave merge. This pattern can be mistaken for VT and requires immediate emergency treatment — calcium gluconate to stabilize the myocardium, insulin and dextrose to shift potassium intracellularly, and dialysis for definitive treatment in severe cases.
              </p>
              <p>
                Hypokalemia produces a subtler but equally dangerous ECG signature. Flattened T waves with prominent U waves — a positive deflection after the T wave, best seen in V2–V3 — increase in prominence as potassium falls. The distinction from QT prolongation matters: apparent QT prolongation in hypokalemia often reflects a QU interval (T wave merging with U wave), which carries different arrhythmia risk than true QTc prolongation. Hypokalemia markedly amplifies arrhythmia risk from digoxin and QT-prolonging drugs.
              </p>
              <p>
                QT prolongation predisposes to torsades de pointes — a polymorphic VT with characteristic twisting axis around the isoelectric line. QTc above 500 ms, or an increase of more than 60 ms from baseline, warrants immediate reassessment of QT-prolonging medications, electrolyte repletion (target K+ above 4.0, Mg++ above 2.0), and consideration of telemetry upgrade. Torsades that does not self-terminate requires IV magnesium sulfate as first-line treatment, with overdrive pacing for refractory cases.
              </p>
            </div>
          </section>

          {/* 7. ECG Practice Questions */}
          <section id="ecg-practice-questions" aria-labelledby="h-practice-q" className="nn-content-visibility-auto">
            <h2 id="h-practice-q" className="mb-4 text-xl font-semibold text-[var(--semantic-text-primary)]">
              ECG practice questions: strip-based adaptive learning
            </h2>
            <div className="space-y-4 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
              <p>
                ECG practice questions integrated into the NurseNest{" "}
                <Link href="/advanced-ecg-nursing" className="font-medium text-[var(--semantic-info)] hover:underline">
                  Advanced ECG module
                </Link>{" "}
                use deterministic waveform strips — purpose-built for nursing education, not deidentified clinical tracings — ensuring consistent, unambiguous morphologic teaching. Every question includes a detailed rationale covering why the correct answer is right and why each distractor is wrong.
              </p>
              <p>
                Strip-based practice questions for telemetry and cardiac nursing appear in multiple formats: identify the rhythm, select the immediate nursing priority, choose the correct pharmacologic intervention, recognize the malfunction type from a pacemaker strip, or interpret the 12-lead in a clinical scenario context. The adaptive weak-area system surfaces ECG question categories where performance is lowest, ensuring focused practice rather than passive rotation through all content.
              </p>
              <p>
                For RN and NP exam preparation, ECG questions on NCLEX (RN and PN), CNPLE, AANP, and ANCC examinations use clinical vignettes rather than isolated strip identification. The NurseNest approach mirrors this format: ECG strips are embedded in a patient scenario with vital signs, history, and medication context, requiring the learner to integrate rhythm recognition with clinical decision-making. Practice with{" "}
                <Link href="/ecg/ecg-practice-questions" className="font-medium text-[var(--semantic-info)] hover:underline">
                  Basic ECG quizzes
                </Link>{" "}
                builds the recognition foundation before{" "}
                <Link href="/advanced-ecg-nursing/ecg-case-simulations" className="font-medium text-[var(--semantic-info)] hover:underline">
                  Advanced ECG scenarios
                </Link>{" "}
                add the clinical reasoning layer.
              </p>
            </div>
          </section>

          {/* 8. ECG Flashcards */}
          <section id="ecg-flashcards" aria-labelledby="h-flashcards" className="nn-content-visibility-auto">
            <h2 id="h-flashcards" className="mb-4 text-xl font-semibold text-[var(--semantic-text-primary)]">
              ECG flashcards: spaced repetition for cardiac rhythm mastery
            </h2>
            <div className="space-y-4 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
              <p>
                ECG flashcards in the NurseNest study system integrate with the spaced repetition engine to surface cardiac rhythm and interpretation concepts at intervals matched to your current retention level. Hard-won recognition for rare but dangerous rhythms — bidirectional VT in digoxin toxicity, epsilon waves in ARVC, De Winter T-waves — requires spaced review rather than one-time exposure.
              </p>
              <p>
                Flashcard domains for cardiac and ECG content include: rhythm identification, ECG drug effects (digoxin, antiarrhythmics, QT-prolonging agents), electrolyte ECG changes, STEMI territory localization, pacemaker nomenclature and malfunction types, and ACLS rhythm decision-making. Reviewing ECG flashcards after practice question sessions reinforces pattern recognition and prevents the "I knew it when I saw the strip" gap that emerges under timed test conditions.
              </p>
            </div>
          </section>

          {/* 9. ECG Clinical Case Simulations */}
          <section id="ecg-clinical-cases" aria-labelledby="h-cases" className="nn-content-visibility-auto">
            <h2 id="h-cases" className="mb-4 text-xl font-semibold text-[var(--semantic-text-primary)]">
              ECG clinical case simulations
            </h2>
            <div className="space-y-4 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
              <p>
                The{" "}
                <Link href="/advanced-ecg-nursing/ecg-case-simulations" className="font-medium text-[var(--semantic-info)] hover:underline">
                  Advanced ECG scenario track
                </Link>{" "}
                presents multi-step clinical cases integrating ECG interpretation with nursing priority decisions. A scenario might present a post-cardiac surgery patient with a new wide-complex tachycardia: the learner must apply the Brugada algorithm to classify the rhythm, assess hemodynamic stability, identify the correct ACLS pathway, and recognize that pacemaker-mediated tachycardia is in the differential given the surgical context.
              </p>
              <p>
                Video-drill exercises pair ECG strip review with short-form teaching explanations — ideal for spaced repetition review after completing lesson modules. Worksheets provide downloadable systematic ECG interpretation frameworks for self-directed practice outside the digital platform.
              </p>
              <p>
                For NP learners, clinical case simulations include outpatient ECG scenarios: a patient presenting with palpitations whose ECG reveals intermittent pre-excitation (WPW pattern), a hypertensive patient whose routine ECG shows LVH with strain pattern, or a patient on azithromycin with a QTc of 520 ms. These scenarios mirror the autonomous clinical decision-making that NP examinations and scope of practice require.
              </p>
            </div>
          </section>

          {/* 10. ECG for RN/RPN/NP Students */}
          <section id="ecg-rn-rpn-np" aria-labelledby="h-pathways" className="nn-content-visibility-auto">
            <h2 id="h-pathways" className="mb-4 text-xl font-semibold text-[var(--semantic-text-primary)]">
              ECG for RN, RPN, and NP students
            </h2>
            <div className="space-y-4 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
              <p>
                ECG training requirements differ by scope of practice and examination target. RN learners preparing for NCLEX-RN encounter ECG questions in the physiological adaptation and clinical judgment categories — rhythm recognition, priority nursing interventions for arrhythmias, and recognizing rhythm changes requiring notification. The{" "}
                <Link href="/us/rn/nclex-rn/lessons" className="font-medium text-[var(--semantic-info)] hover:underline">
                  NCLEX-RN lesson hub
                </Link>{" "}
                integrates ECG content within cardiovascular lessons.
              </p>
              <p>
                NP learners preparing for CNPLE, AANP, or ANCC examinations encounter ECG questions with a higher degree of clinical integration: interpreting a 12-lead in the context of chest pain and deciding whether the patient requires emergency department transfer, recognizing medication-ECG interactions in a patient on multiple QT-prolonging drugs, or determining the appropriate outpatient workup for incidental bundle branch block. The{" "}
                <Link href="/canada/np/cnple/lessons" className="font-medium text-[var(--semantic-info)] hover:underline">
                  CNPLE lesson hub
                </Link>{" "}
                and{" "}
                <Link href="/advanced-ecg-nursing" className="font-medium text-[var(--semantic-info)] hover:underline">
                  Advanced ECG module
                </Link>{" "}
                together address this integration requirement.
              </p>
              <p>
                RPN (Registered Practical Nurse / REx-PN) learners have a narrower ECG scope focused on basic rhythm recognition for patient safety: identifying life-threatening rhythms requiring immediate notification, understanding telemetry alarm significance, and performing foundational cardiac assessment. Core ECG access for RPN learners depends on subscription eligibility.
              </p>
            </div>
          </section>

          {/* Pacemaker / toxicology (existing content compressed) */}
          <section id="pacemaker-toxicology" aria-labelledby="h-pacer-tox" className="nn-content-visibility-auto">
            <h2 id="h-pacer-tox" className="mb-4 text-xl font-semibold text-[var(--semantic-text-primary)]">
              Pacemaker malfunction and toxicology ECG patterns
            </h2>
            <div className="space-y-4 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
              <p>
                Advanced pacemaker competency recognizes specific malfunction types. Failure to capture presents as pacer spikes without following QRS complexes — a hemodynamic emergency in pacemaker-dependent patients. Undersensing — the pacemaker fires inappropriately, failing to detect native beats — can produce R-on-T: pacer spikes delivered during the relative refractory period can trigger VF, especially with prolonged QT or ischemia. Pacemaker-mediated tachycardia (endless-loop tachycardia) uses the pacemaker as the antegrade limb of a reentry circuit and terminates with magnet application.
              </p>
              <p>
                Toxicology ECG patterns include: sodium channel blockade (TCA overdose — terminal R wave in aVR, QRS widening, treatment with IV sodium bicarbonate), QT-prolonging drug combinations (additive risk, torsades de pointes, IV magnesium treatment), and digoxin toxicity (bigeminal PVCs, paroxysmal atrial tachycardia with AV block, bidirectional VT — Fab antibody fragment treatment).
              </p>
            </div>
          </section>
        </article>

        {/* Premium CTA block */}
        <section className="mb-10 rounded-2xl border border-[color-mix(in_srgb,var(--semantic-chart-1)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-1)_06%,var(--semantic-surface))] p-5 sm:p-7" aria-labelledby="cta-heading">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 id="cta-heading" className="text-base font-semibold text-[var(--semantic-text-primary)]">
                Advanced ECG Interpretation & Cardiac Rhythm Mastery
              </h2>
              <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">
                200+ strip-based questions across 9 clinical tracks. Available for RN and NP learners as a separate add-on module.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 sm:shrink-0">
              <Link
                href="/modules/ecg-advanced"
                className="inline-flex items-center gap-1.5 rounded-full bg-[var(--role-cta)] px-4 py-2 text-sm font-semibold text-[var(--role-cta-foreground)] whitespace-nowrap"
              >
                <Zap className="h-3.5 w-3.5" aria-hidden />
                Open Advanced ECG
              </Link>
              <Link
                href="/clinical-modules"
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 py-2 text-sm font-semibold text-[var(--semantic-text-secondary)] whitespace-nowrap"
              >
                All Clinical Modules
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-10 space-y-4" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-xl font-semibold text-[var(--semantic-text-primary)]">
            Frequently asked questions
          </h2>
          <dl className="space-y-3">
            {FAQ_ITEMS.map((f) => (
              <div key={f.question} className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4">
                <dt className="text-sm font-semibold text-[var(--semantic-text-primary)]">{f.question}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{f.answer}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Internal links */}
        <nav aria-label="Related ECG and cardiac resources" className="border-t border-[var(--semantic-border-soft)] pt-6">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[var(--semantic-text-muted)]">
            Related resources
          </p>
          <ul className="flex flex-wrap gap-2">
            {[
              { href: "/advanced-ecg-nursing/rhythm-practice", label: "Rhythm Practice Lab" },
              { href: "/advanced-ecg-nursing/12-lead-stemi", label: "12-Lead STEMI Interpretation" },
              { href: "/advanced-ecg-nursing/acls-rhythms", label: "ACLS Rhythms" },
              { href: "/advanced-ecg-nursing/electrolyte-ecg-changes", label: "Electrolyte ECG Changes" },
              { href: "/advanced-ecg-nursing/medication-induced-ecg-changes", label: "Medication-Induced ECG Changes" },
              { href: "/advanced-ecg-nursing/critical-care-ecg", label: "Critical Care ECG" },
              { href: "/advanced-ecg-nursing/pediatric-ecg", label: "Pediatric ECG" },
              { href: "/advanced-ecg-nursing/telemetry-monitoring", label: "Telemetry Monitoring" },
              { href: "/advanced-ecg-nursing/ecg-case-simulations", label: "ECG Case Simulations" },
              { href: "/ecg-interpretation", label: "ECG Interpretation for Nurses" },
              { href: "/ecg-telemetry-mastery", label: "ECG Telemetry Mastery" },
              { href: "/clinical-modules", label: "Clinical Modules Hub" },
              { href: "/ecg-interpretation", label: "Basic ECG Lessons" },
              { href: "/ecg/ecg-practice-questions", label: "Basic ECG Quizzes" },
              { href: "/modules/ecg-advanced", label: "Advanced ECG Module" },
              { href: "/advanced-ecg-nursing", label: "Advanced ECG Lessons" },
              { href: "/advanced-ecg-nursing/rhythm-practice", label: "Advanced ECG Drills" },
              { href: "/advanced-ecg-nursing/ecg-case-simulations", label: "ECG Clinical Scenarios" },
              { href: "/ecg/ecg-practice-questions", label: "ECG Worksheets" },
              { href: "/us/rn/nclex-rn/lessons", label: "NCLEX-RN Lessons" },
              { href: "/canada/np/cnple/lessons", label: "CNPLE Lessons" },
              { href: "/ecg/stemi-localization", label: "STEMI Localization Guide" },
              { href: "/ecg/heart-block-interpretation", label: "Heart Block Interpretation" },
              { href: "/ecg/hyperkalemia-ecg-changes", label: "Hyperkalemia ECG Changes" },
              { href: "/ecg/qt-prolongation", label: "QT Prolongation" },
              { href: "/ecg/ventricular-tachycardia", label: "Ventricular Tachycardia" },
            ].map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-1.5 text-xs font-medium text-[var(--semantic-text-secondary)] hover:border-[color-mix(in_srgb,var(--semantic-info)_35%,var(--semantic-border-soft))] hover:text-[var(--semantic-text-primary)]"
                >
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
