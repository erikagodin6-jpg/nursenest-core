import type { Metadata } from "next";
import Link from "next/link";
import { Activity, ArrowRight, BookOpen, CheckCircle2, Heart, Target, TrendingUp, Zap } from "lucide-react";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";

export const revalidate = 86400;

const PATH = "/hemodynamics-monitoring";
const PAGE_TITLE =
  "Hemodynamics Monitoring for Nurses | Arterial Lines, CVP, Cardiac Output & Shock | NurseNest";
const PAGE_DESCRIPTION =
  "Master hemodynamics monitoring for ICU, cardiac, and ER nursing. Learn arterial line waveforms, CVP interpretation, cardiac output, SVR, shock pattern recognition, and vasopressor reasoning — from first principles, not rote recall.";
const SITE_ORIGIN = "https://nursenest.ca";

const FAQ_ITEMS = [
  {
    question: "What is hemodynamics monitoring in nursing practice?",
    answer:
      "Hemodynamics monitoring is the continuous measurement and interpretation of cardiovascular pressures, flows, and oxygenation parameters to assess perfusion adequacy and guide clinical decisions. For nurses, this includes mean arterial pressure (MAP), central venous pressure (CVP), arterial line waveforms, cardiac output (CO/CI), systemic vascular resistance (SVR), and pulmonary artery pressures in ICU and cardiac settings.",
  },
  {
    question: "What is a normal MAP and why does it matter?",
    answer:
      "Normal MAP is 70–100 mmHg. A MAP ≥65 mmHg is the minimum threshold for adequate organ perfusion. Below 65 mmHg, the kidneys, brain, and heart cannot maintain perfusion without intervention. MAP = (SBP + 2×DBP) ÷ 3. Nursing priorities at MAP <65: immediate provider notification, vasopressor initiation or titration, and fluid resuscitation per clinical context.",
  },
  {
    question: "What are the four main types of shock and their hemodynamic profiles?",
    answer:
      "Distributive (septic/anaphylactic): low SVR, high CO, warm periphery, low MAP. Cardiogenic: low CO, high SVR, elevated PAOP (>18 mmHg), cool extremities, pulmonary congestion. Hypovolemic: low preload (CVP <2), low CO, high SVR, tachycardia. Obstructive (PE, tamponade, tension pneumothorax): impaired filling — elevated CVP with tamponade/tension, low CO, low MAP despite normal volume status.",
  },
  {
    question: "How do nurses interpret arterial line waveforms?",
    answer:
      "The normal a-line waveform shows: systolic upstroke (rapid ventricular ejection), systolic peak (SBP), dicrotic notch (aortic valve closure marking diastole onset), and diastolic runoff. Overdamped waveform (loss of dicrotic notch, blunted peak): clot, air bubble, kinked catheter, vasodilation — underestimates SBP. Underdamped waveform (exaggerated peaks, multiple oscillations): overestimates SBP. Always perform square wave test every 4–8 hours.",
  },
  {
    question: "What does CVP measure and what are its limitations?",
    answer:
      "CVP (normal 2–8 mmHg) estimates right ventricular preload and serves as a rough indicator of intravascular volume status. CVP is elevated in: right heart failure, fluid overload, cardiac tamponade, tension pneumothorax. CVP is low in: hypovolemia, vasodilation. Critical limitation: CVP does NOT reliably predict fluid responsiveness — cardiac compliance, positive pressure ventilation, and RV dysfunction all confound interpretation. Dynamic measures (PPV, SVV) are more predictive.",
  },
  {
    question: "Is hemodynamics monitoring included with an RN or NP subscription?",
    answer:
      "Hemodynamic Monitoring Fundamentals is included with eligible RN and NP NurseNest subscriptions. It covers MAP/perfusion, preload/afterload physiology, arterial lines, CVP, cardiac output, and shock state recognition. Advanced Hemodynamic Monitoring (Swan-Ganz/PA catheter, cardiac index, SVR calculation, PAOP, SvO2, ICU case simulations) is a separate one-time add-on for RN and NP learners.",
  },
  {
    question: "What vasopressors are used for septic shock and how do they work hemodynamically?",
    answer:
      "Norepinephrine (first-line): α1-agonist → vasoconstriction → increased SVR and MAP; mild β1 → mild inotropy. Vasopressin (adjunct): V1-receptor → vasoconstriction independent of adrenergic receptors; useful when catecholamine-resistant. Dopamine: dose-dependent — low dose (2–5 mcg/kg/min): renal vasodilation; moderate (5–10 mcg/kg/min): β1 → inotropy/HR; high dose (>10 mcg/kg/min): α1 → vasoconstriction. Phenylephrine: pure α1 → ↑SVR without inotropy; useful in hypotension with tachycardia (reflex bradycardia beneficial).",
  },
];

const LESSON_MODULES = [
  {
    number: "01",
    title: "Introduction to Hemodynamics",
    topics: ["Preload, afterload, contractility", "Cardiac output and stroke volume", "SVR, PVR, and oxygen delivery", "Frank-Starling mechanism"],
    level: "Foundation",
  },
  {
    number: "02",
    title: "Arterial Line Monitoring",
    topics: ["Waveform components and morphology", "Zeroing, leveling, and square wave test", "Overdamped vs underdamped traces", "Troubleshooting and nursing safety"],
    level: "Core",
  },
  {
    number: "03",
    title: "Central Venous Pressure",
    topics: ["CVP normal range (2–8 mmHg)", "CVP waveform (a/c/v waves)", "High vs low CVP causes", "Fluid responsiveness limitations"],
    level: "Core",
  },
  {
    number: "04",
    title: "Pulmonary Artery Catheter",
    topics: ["RA → RV → PA → PAOP tracing", "Normal pressure values", "PAOP/wedge interpretation", "Complications and nursing implications"],
    level: "Advanced",
  },
  {
    number: "05",
    title: "Cardiac Output and Index",
    topics: ["CO, CI, SV, SVI calculations", "Thermodilution and Fick method", "High-output vs low-output states", "Nursing interpretation at bedside"],
    level: "Core",
  },
  {
    number: "06",
    title: "SVR and Afterload",
    topics: ["SVR calculation and clinical meaning", "Vasodilation vs vasoconstriction patterns", "Shock type differentiation by SVR", "Vasopressor and inotrope implications"],
    level: "Core",
  },
  {
    number: "07",
    title: "Shock Pattern Recognition",
    topics: ["Distributive, cardiogenic, hypovolemic, obstructive", "Hemodynamic profiles per type", "Clinical cues and early recognition", "Nursing intervention priority"],
    level: "Clinical",
  },
  {
    number: "08",
    title: "Hemodynamics in Sepsis",
    topics: ["MAP targets and lactate clearance", "Fluid responsiveness assessment", "Vasopressor selection and titration", "When normal BP is not enough"],
    level: "Clinical",
  },
  {
    number: "09",
    title: "Cardiogenic Shock & Heart Failure",
    topics: ["Low CI, high SVR, elevated filling pressures", "Pulmonary congestion pathophysiology", "Inotropes, vasodilators, and diuresis", "Mechanical support overview (IABP, Impella)"],
    level: "Advanced",
  },
  {
    number: "10",
    title: "Hemodynamic Case Interpretation",
    topics: ["Integrate vitals + waveforms + labs", "Step-by-step reasoning framework", "Clinical decision-making under uncertainty", "NCLEX/CNPLE application scenarios"],
    level: "Mastery",
  },
];

const COVERAGE_ITEMS = [
  "MAP target ≥65 mmHg: calculation, thresholds, and nursing response",
  "Preload and afterload physiology: Frank-Starling curve at the bedside",
  "Arterial line waveform: systolic peak, dicrotic notch, dampening, square-wave test",
  "CVP normal range (2–8 mmHg): causes of high and low CVP",
  "Cardiac output and cardiac index: normal values, determinants, clinical interpretation",
  "SVR calculation and shock type differentiation",
  "Shock taxonomy: distributive, cardiogenic, hypovolemic, obstructive hemodynamic profiles",
  "Septic shock hemodynamics: vasodilation, warm periphery, low SVR, high CO",
  "Cardiogenic shock: elevated PAOP, low CO, high SVR, pulmonary congestion",
  "PA catheter waveform progression: RA → RV → PA → wedge",
  "Vasopressors: norepinephrine, vasopressin, dopamine — mechanism and hemodynamic effects",
  "Fluid responsiveness: static (CVP) vs dynamic measures (PPV, SVV)",
];

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata({
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: `${SITE_ORIGIN}${PATH}`,
    alternates: marketingAlternatesSharedPage(PATH, DEFAULT_MARKETING_LOCALE),
    structuredData: [
      {
        "@context": "https://schema.org",
        "@type": "Course",
        name: "Hemodynamics Monitoring for Nurses",
        description: PAGE_DESCRIPTION,
        url: `${SITE_ORIGIN}${PATH}`,
        provider: { "@type": "EducationalOrganization", name: "NurseNest", url: SITE_ORIGIN },
        courseMode: "online",
        educationalLevel: "Professional",
        teaches: [
          "hemodynamic monitoring", "arterial line waveforms", "CVP interpretation",
          "cardiac output", "systemic vascular resistance", "shock recognition",
          "vasopressor reasoning", "sepsis hemodynamics", "cardiogenic shock",
        ],
        hasCourseInstance: {
          "@type": "CourseInstance",
          courseMode: "online",
          instructor: { "@type": "Organization", name: "NurseNest" },
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: FAQ_ITEMS.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_ORIGIN },
          { "@type": "ListItem", position: 2, name: "Clinical Modules", item: `${SITE_ORIGIN}/clinical-modules` },
          { "@type": "ListItem", position: 3, name: "Hemodynamics Monitoring", item: `${SITE_ORIGIN}${PATH}` },
        ],
      },
    ],
  });
}

const LEVEL_COLOR: Record<string, string> = {
  Foundation: "bg-blue-50 text-blue-700 border-blue-100",
  Core: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Advanced: "bg-violet-50 text-violet-700 border-violet-100",
  Clinical: "bg-amber-50 text-amber-700 border-amber-100",
  Mastery: "bg-rose-50 text-rose-700 border-rose-100",
};

export default function HemodynamicsMonitoringPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span aria-hidden>/</span>
        <Link href="/clinical-modules" className="hover:text-primary transition-colors">Clinical Modules</Link>
        <span aria-hidden>/</span>
        <span className="text-gray-900 font-medium">Hemodynamics Monitoring</span>
      </nav>

      {/* Hero */}
      <header className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-semibold mb-4">
          <CheckCircle2 className="w-4 h-4" aria-hidden />
          Included with RN &amp; NP subscriptions
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-4">
          Hemodynamics monitoring for nurses: arterial lines, cardiac output, shock patterns, and vasopressor reasoning
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed max-w-3xl">{PAGE_DESCRIPTION}</p>
      </header>

      {/* Coverage grid */}
      <section aria-labelledby="coverage-heading" className="rounded-2xl bg-gradient-to-br from-blue-50 to-white border border-blue-100 p-6 mb-10">
        <h2 id="coverage-heading" className="text-lg font-bold text-gray-900 mb-4">What you will learn</h2>
        <div className="grid sm:grid-cols-2 gap-2.5">
          {COVERAGE_ITEMS.map((item) => (
            <div key={item} className="flex items-start gap-2">
              <Activity className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" aria-hidden />
              <span className="text-sm text-gray-700">{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 mb-14">
        <Link
          href="/modules/hemodynamics"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-semibold shadow hover:brightness-110 transition-all"
        >
          Start Hemodynamics Module
          <ArrowRight className="w-4 h-4" aria-hidden />
        </Link>
        <Link
          href="/advanced-hemodynamic-monitoring"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-gray-200 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-all"
        >
          <Heart className="w-4 h-4 text-rose-500" aria-hidden />
          Explore Advanced Hemodynamics
        </Link>
      </div>

      {/* Lesson modules */}
      <section aria-labelledby="lessons-heading" className="mb-14">
        <h2 id="lessons-heading" className="text-2xl font-bold text-gray-900 mb-2">10 lessons — from physiology to clinical reasoning</h2>
        <p className="text-gray-600 text-sm mb-6">
          Each lesson teaches mechanism first, then clinical application, then interpretation. No rote memorization.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {LESSON_MODULES.map((mod) => (
            <div key={mod.number} className="p-5 rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs font-bold text-gray-400 font-mono">{mod.number}</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${LEVEL_COLOR[mod.level] ?? "bg-gray-50 text-gray-600 border-gray-100"}`}>
                  {mod.level}
                </span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-sm">{mod.title}</h3>
              <ul className="space-y-1">
                {mod.topics.map((t) => (
                  <li key={t} className="flex items-start gap-1.5 text-xs text-gray-600">
                    <Target className="w-3 h-3 text-primary/60 shrink-0 mt-0.5" aria-hidden />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Why mechanism first */}
      <section aria-labelledby="approach-heading" className="mb-14 rounded-2xl border border-gray-100 bg-gray-50 p-8">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-6 h-6 text-primary" aria-hidden />
          <h2 id="approach-heading" className="text-xl font-bold text-gray-900">Mechanism first, not memorization</h2>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          Most hemodynamics content teaches numbers without explanation: "normal CVP is 2–8 mmHg." You memorize it and forget it. NurseNest teaches <em>why</em> CVP is elevated in cardiac tamponade but low in hypovolemia — so you can reason through a scenario you have never seen before.
        </p>
        <p className="text-gray-600 text-sm leading-relaxed">
          Every lesson follows the same progression: physiology → waveform/metric explanation → normal vs abnormal → nursing priorities → clinical case. By the end, you understand hemodynamics well enough to interpret an unfamiliar scenario at 3 AM without a reference card.
        </p>
      </section>

      {/* Related modules */}
      <section aria-labelledby="related-heading" className="mb-12">
        <h2 id="related-heading" className="text-2xl font-bold text-gray-900 mb-4">Related clinical modules</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { href: "/ecg-interpretation", label: "ECG Interpretation for Nurses", desc: "Rhythm recognition, arrhythmia identification, interval analysis" },
            { href: "/advanced-ecg-nursing", label: "Advanced ECG & Telemetry", desc: "12-lead STEMI, electrolyte ECG changes, ICU rhythms" },
            { href: "/advanced-hemodynamic-monitoring", label: "Advanced Hemodynamic Monitoring", desc: "Swan-Ganz, cardiac index, SVR, PAOP, SvO2, ICU simulations" },
            { href: "/shock-and-perfusion", label: "Shock & Perfusion", desc: "Deep dive: distributive, cardiogenic, hypovolemic, obstructive physiology" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 bg-white hover:border-primary/30 hover:shadow-sm transition-all"
            >
              <BookOpen className="w-5 h-5 text-primary/70 shrink-0 mt-0.5" aria-hidden />
              <div>
                <p className="font-semibold text-gray-900 text-sm">{link.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{link.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section aria-labelledby="faq-heading" className="mb-12">
        <h2 id="faq-heading" className="text-2xl font-bold text-gray-900 mb-6">Frequently asked questions</h2>
        <div className="space-y-6">
          {FAQ_ITEMS.map((item) => (
            <div key={item.question} className="border-b border-gray-100 pb-6">
              <h3 className="font-semibold text-gray-900 mb-2">{item.question}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Advanced upsell */}
      <section className="rounded-2xl bg-gradient-to-br from-rose-50 to-white border border-rose-100 p-8 text-center">
        <Zap className="w-8 h-8 text-rose-500 mx-auto mb-3" aria-hidden />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Ready for advanced hemodynamics?</h2>
        <p className="text-gray-600 text-sm mb-5 max-w-lg mx-auto">
          Advanced Hemodynamic Monitoring adds Swan-Ganz / PA catheter interpretation, cardiac index, SVR calculation, PAOP/wedge pressure, mixed venous oxygen saturation (SvO₂), vasopressor titration reasoning, and ICU case simulations.
        </p>
        <Link
          href="/advanced-hemodynamic-monitoring"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-rose-600 text-white font-semibold hover:brightness-110 transition-all"
        >
          Explore Advanced Hemodynamics
          <ArrowRight className="w-4 h-4" aria-hidden />
        </Link>
      </section>
    </main>
  );
}
