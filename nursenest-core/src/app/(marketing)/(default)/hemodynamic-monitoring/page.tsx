import type { Metadata } from "next";
import Link from "next/link";
import { Activity, ArrowRight, BookOpen, CheckCircle2, Heart, Zap } from "lucide-react";
import { AcademyBreadcrumbBar } from "@/components/clinical-academy/clinical-academy-chrome";
import { labsClinicalModuleLeafBreadcrumbs } from "@/lib/breadcrumbs/academy-breadcrumbs";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";

export const revalidate = 86400;

const PATH = "/hemodynamic-monitoring";
const PAGE_TITLE = "Hemodynamic Monitoring for Nurses | MAP, Preload, Afterload & Cardiac Output | NurseNest";
const PAGE_DESCRIPTION =
  "Master hemodynamic monitoring for nursing practice and exams. Perfusion fundamentals, preload, afterload, contractility, MAP, arterial lines, CVP, cardiac output, and shock state recognition. Included with RN and NP subscriptions.";
const SITE_ORIGIN = "https://nursenest.ca";

const FAQ_ITEMS = [
  {
    question: "What does hemodynamic monitoring mean in nursing?",
    answer:
      "Hemodynamic monitoring is the measurement and interpretation of cardiovascular pressures, flows, and oxygenation to assess perfusion adequacy and guide clinical interventions. In nursing, it includes monitoring mean arterial pressure (MAP), central venous pressure (CVP), arterial lines, and cardiac output to detect deterioration and evaluate response to treatment.",
  },
  {
    question: "Is hemodynamic monitoring included with an RN or NP subscription?",
    answer:
      "Yes. Hemodynamic Monitoring Fundamentals — covering perfusion basics, preload, afterload, contractility, MAP, arterial lines, CVP, cardiac output, and shock states — is included with eligible RN and NP NurseNest subscriptions. Advanced Hemodynamic Monitoring (Swan-Ganz, cardiac index, SVR, SVV, PAOP, SvO2, ICU case simulations) is a separate paid add-on.",
  },
  {
    question: "What is a normal MAP in nursing?",
    answer:
      "A mean arterial pressure (MAP) of 70–100 mmHg is considered normal for adults. A MAP below 65 mmHg indicates inadequate organ perfusion and typically triggers fluid resuscitation, vasopressor therapy, or other hemodynamic interventions. MAP = (SBP + 2×DBP) ÷ 3.",
  },
  {
    question: "What is the difference between preload and afterload?",
    answer:
      "Preload is the ventricular end-diastolic volume — the stretch on cardiac muscle fibers before contraction, determined by venous return. Afterload is the resistance the ventricle must overcome to eject blood — primarily determined by systemic vascular resistance (SVR). Clinically: high preload with poor output = volume overload or poor contractility. High afterload = hypertension or vasoconstriction.",
  },
  {
    question: "How do nurses interpret arterial line waveforms?",
    answer:
      "An arterial line waveform shows systolic peak, dicrotic notch (aortic valve closure), and diastolic runoff. A dampened waveform (low amplitude, loss of dicrotic notch) suggests clot, air bubble, or malposition. An over-damped trace overestimates diastolic and underestimates systolic. The dicrotic notch position indicates aortic valve competency.",
  },
  {
    question: "What are the four types of shock and how do they differ hemodynamically?",
    answer:
      "Distributive shock (septic, anaphylactic, neurogenic): low SVR, elevated CO, warm periphery. Cardiogenic shock: low CO, elevated PAOP, cool extremities, elevated SVR. Hypovolemic shock: low preload, low CO, elevated SVR. Obstructive shock (PE, cardiac tamponade, tension pneumo): impaired ventricular filling with elevated CVP in tamponade/tension pneumo.",
  },
];

const COVERAGE_ITEMS = [
  "MAP target ≥65 mmHg: clinical significance, calculation, and nursing response",
  "Preload and afterload: clinical correlates, manipulators, and hemodynamic effects",
  "Frank-Starling mechanism: starling curve interpretation at the bedside",
  "Arterial line waveform: normal morphology, dampening, over-damped trace, zeroing",
  "CVP interpretation: 2–8 mmHg normal range, elevated vs low clinical meaning",
  "Cardiac output estimation: Fick principle, thermodilution, non-invasive correlates",
  "Shock taxonomy: distributive, cardiogenic, hypovolemic, obstructive",
  "Septic shock hemodynamics: vasodilation, warm periphery, low SVR, high CO",
  "Cardiogenic shock: cool periphery, elevated PAOP, low CO, high SVR",
  "Vasopressors: norepinephrine, dopamine, vasopressin — mechanism and hemodynamic effects",
  "Fluid responsiveness: clinical assessment without invasive monitoring",
  "Nursing priorities: alarm response, position, documentation, escalation triggers",
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
        name: "Hemodynamic Monitoring Fundamentals for Nurses",
        description: PAGE_DESCRIPTION,
        url: `${SITE_ORIGIN}${PATH}`,
        provider: { "@type": "EducationalOrganization", name: "NurseNest", url: SITE_ORIGIN },
        courseMode: "online",
        educationalLevel: "Professional",
        teaches: ["hemodynamic monitoring", "MAP", "preload", "afterload", "cardiac output", "shock states", "arterial lines", "CVP"],
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
],
  });
}

export default function HemodynamicMonitoringPage() {
  const breadcrumbResolution = labsClinicalModuleLeafBreadcrumbs("Hemodynamic Monitoring", PATH);
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <AcademyBreadcrumbBar pathname={PATH} resolution={breadcrumbResolution} className="mb-8" />
<div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-semibold mb-4">
          <CheckCircle2 className="w-4 h-4" />
          Included with RN &amp; NP subscriptions
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-4">
          Hemodynamic monitoring fundamentals: MAP, perfusion, preload, afterload, and shock states
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed">{PAGE_DESCRIPTION}</p>
      </div>

      <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-white border border-blue-100 p-6 mb-10">
        <h2 className="text-lg font-bold text-gray-900 mb-3">What's covered in Hemodynamic Fundamentals</h2>
        <div className="grid sm:grid-cols-2 gap-2.5">
          {COVERAGE_ITEMS.map((item) => (
            <div key={item} className="flex items-start gap-2">
              <Activity className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span className="text-sm text-gray-700">{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-12">
        <Link
          href="/modules/hemodynamics"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-semibold shadow hover:brightness-110 transition-all"
        >
          Start Hemodynamics Module
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/advanced-hemodynamic-monitoring"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-gray-200 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-all"
        >
          <Heart className="w-4 h-4 text-rose-500" />
          Explore Advanced Hemodynamics
        </Link>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Related clinical modules</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { href: "/ecg-interpretation", label: "ECG Interpretation for Nurses", desc: "Rhythm recognition, arrhythmia identification" },
            { href: "/advanced-ecg-nursing", label: "Advanced ECG & Telemetry", desc: "12-lead analysis, STEMI, ICU rhythms" },
            { href: "/shock-and-perfusion", label: "Shock & Perfusion", desc: "Distributive, cardiogenic, hypovolemic, obstructive" },
            { href: "/arterial-line-interpretation", label: "Arterial Line Interpretation", desc: "Waveform analysis, zeroing, complications" },
          ].map((link) => (
            <Link key={link.href} href={link.href} className="flex items-start gap-3 p-4 rounded-xl border border-gray-100 bg-white hover:border-primary/30 hover:shadow-sm transition-all">
              <BookOpen className="w-5 h-5 text-primary/70 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900 text-sm">{link.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{link.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently asked questions</h2>
        <div className="space-y-6">
          {FAQ_ITEMS.map((item) => (
            <div key={item.question} className="border-b border-gray-100 pb-6">
              <h3 className="font-semibold text-gray-900 mb-2">{item.question}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-gradient-to-br from-rose-50 to-white border border-rose-100 p-8 text-center">
        <Zap className="w-8 h-8 text-rose-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Ready for advanced hemodynamics?</h2>
        <p className="text-gray-600 text-sm mb-4 max-w-lg mx-auto">
          Advanced Hemodynamic Monitoring covers Swan-Ganz catheters, cardiac index, SVR, SVV, PAOP/wedge pressure,
          mixed venous oxygen saturation, ICU case simulations, and vasopressor reasoning.
        </p>
        <Link
          href="/advanced-hemodynamic-monitoring"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-rose-600 text-white font-semibold hover:brightness-110 transition-all"
        >
          Explore Advanced Hemodynamics
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </main>
  );
}
