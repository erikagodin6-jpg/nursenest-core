import type { Metadata } from "next";
import Link from "next/link";
import { Activity, ArrowRight, BookOpen, Heart, Lock, Zap } from "lucide-react";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";

export const revalidate = 86400;

const PATH = "/advanced-hemodynamic-monitoring";
const PAGE_TITLE = "Advanced Hemodynamic Monitoring for Nurses | Swan-Ganz, SVR, PAOP & ICU Simulation | NurseNest";
const PAGE_DESCRIPTION =
  "Advanced hemodynamic monitoring for RN and NP: Swan-Ganz / pulmonary artery catheter, cardiac index, SVR, SVV, PAOP/wedge pressure, mixed venous oxygen saturation (SvO2), vasopressor reasoning, fluid responsiveness, and ICU case simulations. $149 CAD one-time add-on.";
const SITE_ORIGIN = "https://nursenest.ca";

const FAQ_ITEMS = [
  {
    question: "What is included in Advanced Hemodynamic Monitoring?",
    answer:
      "Advanced Hemodynamic Monitoring covers: Swan-Ganz pulmonary artery catheter interpretation, cardiac index (CI), systemic vascular resistance (SVR), stroke volume variation (SVV), pulmonary artery occlusion pressure (PAOP/wedge), mixed venous oxygen saturation (SvO2/ScvO2), septic shock and cardiogenic shock hemodynamics, vasopressor selection and titration reasoning, fluid responsiveness assessment, and waveform interpretation with ICU case simulations.",
  },
  {
    question: "Is Advanced Hemodynamic Monitoring included with my RN subscription?",
    answer:
      "No. Hemodynamic Monitoring Fundamentals (MAP, preload, afterload, CVP, arterial lines, basic shock states) is included with eligible RN and NP subscriptions. Advanced Hemodynamic Monitoring — covering Swan-Ganz catheters, cardiac index, SVR, SVV, PAOP, SvO2, and ICU simulations — is a separate $149 CAD one-time add-on for RN and NP learners.",
  },
  {
    question: "What is the Critical Care Bundle?",
    answer:
      "The Critical Care Bundle ($249 CAD one-time) includes both Advanced ECG Interpretation and Advanced Hemodynamic Monitoring at a combined discount of $49 CAD versus purchasing separately. It provides complete ICU/CCU clinical readiness: STEMI recognition, telemetry mastery, Swan-Ganz interpretation, vasopressor reasoning, and ICU case simulations.",
  },
  {
    question: "What does a pulmonary artery catheter (Swan-Ganz) measure?",
    answer:
      "The Swan-Ganz catheter (pulmonary artery catheter, PAC) measures: right atrial pressure (RAP/CVP), right ventricular pressure (RVP), pulmonary artery pressure (PAP), pulmonary artery occlusion pressure (PAOP/wedge — estimates left ventricular preload), and mixed venous oxygen saturation (SvO2) via continuous oximetry. Cardiac output is measured by thermodilution. SVR and PVR are calculated from these values.",
  },
  {
    question: "What is a normal cardiac index (CI)?",
    answer:
      "Normal cardiac index (CI) is 2.5–4.0 L/min/m². CI below 2.2 L/min/m² with signs of hypoperfusion indicates cardiogenic shock. Cardiac index normalizes cardiac output (CO) for body surface area — it is the more clinically meaningful parameter for comparing patients of different sizes.",
  },
  {
    question: "How is fluid responsiveness assessed at the bedside?",
    answer:
      "Fluid responsiveness is assessed using static parameters (CVP, PAOP) but these are unreliable predictors. Dynamic parameters are preferred: stroke volume variation (SVV) >13% with mechanical ventilation suggests fluid responsiveness; pulse pressure variation (PPV) >13% also indicates preload dependence. Passive leg raise (PLR) with real-time CO measurement is a reliable functional test. Point-of-care echo (IVC collapsibility >50%) is increasingly used.",
  },
];

const COVERAGE_ITEMS = [
  "Swan-Ganz / pulmonary artery catheter: insertion, waveform transitions, interpretation",
  "PAOP/wedge pressure: ≤18 mmHg normal, elevated in LHFD, low in hypovolemia",
  "Cardiac index: normal 2.5–4.0 L/min/m², cardiogenic shock threshold <2.2",
  "SVR calculation and clinical interpretation: vasoplegia vs vasoconstrictive states",
  "SVV and PPV: dynamic fluid responsiveness predictors with mechanical ventilation",
  "SvO2 interpretation: normal 65–75%, reduced in low CO or high O2 extraction",
  "Septic shock: low SVR, high CO, SvO2 may be elevated (poor extraction)",
  "Cardiogenic shock: low CO, elevated PAOP, elevated SVR, reduced SvO2",
  "Vasopressor selection: norepinephrine, vasopressin, epinephrine, phenylephrine",
  "Dobutamine and inotrope reasoning: when to add vs titrate vasopressors",
  "ICU case simulations: multi-parameter hemodynamic decision-making",
  "Waveform artifacts and troubleshooting: dampening, overwedging, air emboli",
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
        name: "Advanced Hemodynamic Monitoring for RN & NP",
        description: PAGE_DESCRIPTION,
        url: `${SITE_ORIGIN}${PATH}`,
        provider: { "@type": "EducationalOrganization", name: "NurseNest", url: SITE_ORIGIN },
        courseMode: "online",
        educationalLevel: "Advanced",
        teaches: ["Swan-Ganz catheter", "pulmonary artery catheter", "cardiac index", "SVR", "PAOP", "SvO2", "vasopressor reasoning", "fluid responsiveness"],
        offers: {
          "@type": "Offer",
          price: "149",
          priceCurrency: "CAD",
          availability: "https://schema.org/InStock",
          description: "One-time add-on for RN and NP subscribers",
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
          { "@type": "ListItem", position: 2, name: "Hemodynamic Monitoring", item: `${SITE_ORIGIN}/hemodynamic-monitoring` },
          { "@type": "ListItem", position: 3, name: "Advanced Hemodynamic Monitoring", item: `${SITE_ORIGIN}${PATH}` },
        ],
      },
      {
        "@context": "https://schema.org",
        "@type": "Product",
        name: "Advanced Hemodynamic Monitoring Add-On",
        description: "Advanced hemodynamic monitoring for RN and NP: Swan-Ganz, cardiac index, SVR, PAOP, SvO2, and ICU simulations.",
        brand: { "@type": "Brand", name: "NurseNest" },
        offers: {
          "@type": "Offer",
          price: "149",
          priceCurrency: "CAD",
          availability: "https://schema.org/InStock",
          priceValidUntil: "2027-12-31",
        },
      },
    ],
  });
}

export default function AdvancedHemodynamicMonitoringPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span>/</span>
        <Link href="/hemodynamic-monitoring" className="hover:text-primary">Hemodynamic Monitoring</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Advanced Hemodynamics</span>
      </nav>

      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-100 text-rose-700 text-sm font-semibold mb-4">
          <Lock className="w-4 h-4" />
          Premium add-on — $149 CAD one-time · RN &amp; NP only
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-4">
          Advanced hemodynamic monitoring: Swan-Ganz, cardiac index, SVR, PAOP, SvO2, and ICU simulation
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed">{PAGE_DESCRIPTION}</p>
      </div>

      <div className="rounded-2xl bg-gradient-to-br from-rose-50 to-white border border-rose-100 p-6 mb-10">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Advanced Hemodynamics curriculum</h2>
        <div className="grid sm:grid-cols-2 gap-2.5">
          {COVERAGE_ITEMS.map((item) => (
            <div key={item} className="flex items-start gap-2">
              <Activity className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span className="text-sm text-gray-700">{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        <div className="rounded-xl border border-gray-100 bg-white p-5">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Add-on only</p>
          <p className="text-3xl font-bold text-gray-900 mb-1">$149 <span className="text-base font-normal text-gray-500">CAD</span></p>
          <p className="text-sm text-gray-600 mb-4">Advanced Hemodynamic Monitoring · One-time</p>
          <Link href="/modules/hemodynamics-advanced#upgrade" className="block text-center px-4 py-2.5 rounded-full bg-primary text-white font-semibold text-sm hover:brightness-110 transition-all">
            Get Advanced Hemodynamics
          </Link>
        </div>
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-5">
          <p className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-2">Best value</p>
          <p className="text-3xl font-bold text-gray-900 mb-1">$249 <span className="text-base font-normal text-gray-500">CAD</span></p>
          <p className="text-sm text-gray-600 mb-4">Critical Care Bundle · Advanced ECG + Advanced Hemodynamics</p>
          <Link href="/critical-care-bundle" className="block text-center px-4 py-2.5 rounded-full bg-rose-600 text-white font-semibold text-sm hover:brightness-110 transition-all">
            <Heart className="inline w-4 h-4 mr-1" />
            Get Critical Care Bundle
          </Link>
        </div>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Related clinical modules</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { href: "/hemodynamic-monitoring", label: "Hemodynamic Fundamentals", desc: "MAP, preload, afterload, CVP, shock states (included with RN/NP)" },
            { href: "/advanced-ecg-nursing", label: "Advanced ECG & Telemetry", desc: "12-lead, STEMI, arrhythmia — premium add-on" },
            { href: "/shock-and-perfusion", label: "Shock & Perfusion", desc: "Shock taxonomy, vasopressor selection" },
            { href: "/pulmonary-artery-catheter", label: "Pulmonary Artery Catheter", desc: "Swan-Ganz insertion, waveforms, interpretation" },
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
    </main>
  );
}
