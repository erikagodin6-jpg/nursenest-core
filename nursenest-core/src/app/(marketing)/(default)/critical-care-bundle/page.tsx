import type { Metadata } from "next";
import Link from "next/link";
import { Activity, ArrowRight, CheckCircle2, FlaskConical, Heart, Zap } from "lucide-react";
import { AcademyBreadcrumbBar } from "@/components/clinical-academy/clinical-academy-chrome";
import { labsClinicalModuleLeafBreadcrumbs } from "@/lib/breadcrumbs/academy-breadcrumbs";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";

export const revalidate = 86400;

const PATH = "/critical-care-bundle";
const PAGE_TITLE = "Critical Care Bundle | Advanced ECG + Hemodynamics + Labs | NurseNest";
const PAGE_DESCRIPTION =
  "Complete ICU/CCU clinical readiness: Advanced ECG + Advanced Hemodynamic Monitoring + Advanced Labs Interpretation in one bundle. $299 CAD one-time for RN and NP — save $148 vs buying separately.";
const SITE_ORIGIN = "https://nursenest.ca";

const BUNDLE_INCLUDES = [
  {
    icon: Activity,
    label: "Advanced ECG Interpretation",
    items: [
      "STEMI localization by territory",
      "12-lead analysis and axis interpretation",
      "Complex arrhythmias: VT, VF, WPW, torsades",
      "Bundle branch blocks, AV blocks, pacemaker rhythms",
      "Electrolyte and toxicology ECG changes",
      "200+ strip-based practice questions",
    ],
  },
  {
    icon: Heart,
    label: "Advanced Hemodynamic Monitoring",
    items: [
      "Swan-Ganz / pulmonary artery catheter",
      "Cardiac index, SVR, SVV, PAOP/wedge pressure",
      "Mixed venous oxygen saturation (SvO2)",
      "Vasopressor selection and titration reasoning",
      "Fluid responsiveness assessment",
      "ICU case simulations",
    ],
  },
  {
    icon: FlaskConical,
    label: "Advanced Labs Interpretation",
    items: [
      "CBC mastery: RBC indices, HIT recognition, DIC pattern",
      "Anion gap with albumin correction, electrolyte emergencies",
      "DKA: potassium management, anion gap closure endpoint",
      "ABG: 5-step systematic interpretation + ventilator decisions",
      "AKI: KDIGO staging, FENa, nephrotoxin management",
      "Critical care electrolytes: Mg, phosphate, ionized Ca",
    ],
  },
];

const FAQ_ITEMS = [
  {
    question: "What is included in the Critical Care Bundle?",
    answer:
      "The Critical Care Bundle includes three advanced add-on modules: Advanced ECG Interpretation (STEMI, complex arrhythmias, pacemaker rhythms, 200+ practice questions), Advanced Hemodynamic Monitoring (Swan-Ganz, cardiac index, SVR, PAOP, SvO2, vasopressor reasoning), and Advanced Labs Interpretation (CBC mastery, anion gap, DKA labs, ABG interpretation, AKI staging, critical care electrolytes). All three modules require an active RN or NP subscription.",
  },
  {
    question: "How much do I save with the Critical Care Bundle?",
    answer:
      "Individual pricing: Advanced ECG $149 + Advanced Hemodynamics $149 + Advanced Labs $149 = $447 CAD. The Critical Care Bundle is $299 CAD — saving $148 CAD (33%) versus purchasing all three separately.",
  },
  {
    question: "Is a base RN or NP subscription required?",
    answer:
      "Yes. The Critical Care Bundle is an add-on purchase for active RN or NP subscribers. It cannot be purchased standalone. Your base subscription includes Hemodynamic Monitoring Fundamentals, Core ECG, and lab values tools; the bundle adds the advanced ICU-level content.",
  },
  {
    question: "Do I get instant access after purchase?",
    answer:
      "Yes. Access to all three advanced modules is granted immediately after successful Stripe checkout. You will be redirected to your learner hub upon completion.",
  },
  {
    question: "What is the difference between Advanced ECG and the ECG included in my subscription?",
    answer:
      "Your base RN/NP subscription includes Core ECG: rhythm recognition, basic intervals, AV blocks, ACLS foundations, and beginner interpretation. Advanced ECG adds: STEMI localization, 12-lead systematic analysis, complex arrhythmias (VT, VF, WPW, torsades), bundle branch blocks, electrolyte ECG changes, and case-based simulation with 200+ practice questions.",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  return safeGenerateMetadata(() => Promise.resolve({
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: `${SITE_ORIGIN}${PATH}`,
    alternates: marketingAlternatesSharedPage(PATH, DEFAULT_MARKETING_LOCALE),
    structuredData: [
      {
        "@context": "https://schema.org",
        "@type": "Product",
        name: "Critical Care Bundle — Advanced ECG + Hemodynamics + Labs",
        description: PAGE_DESCRIPTION,
        brand: { "@type": "Brand", name: "NurseNest" },
        offers: {
          "@type": "Offer",
          price: "299",
          priceCurrency: "CAD",
          availability: "https://schema.org/InStock",
          priceValidUntil: "2027-12-31",
          description: "One-time purchase for RN and NP subscribers",
        },
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: FAQ_ITEMS.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
],
  } as Metadata));
}

export default function CriticalCareBundlePage() {
  const breadcrumbResolution = labsClinicalModuleLeafBreadcrumbs("Critical Care Bundle", PATH);
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <AcademyBreadcrumbBar pathname={PATH} resolution={breadcrumbResolution} className="mb-8" />
<div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-100 text-rose-700 text-sm font-semibold mb-4">
          <Zap className="w-4 h-4" />
          Best value — save $148 CAD vs separate purchases
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-4">
          Critical Care Bundle: Advanced ECG + Hemodynamics + Labs
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed">{PAGE_DESCRIPTION}</p>
      </div>

      {/* Pricing CTA */}
      <div className="rounded-2xl border-2 border-rose-200 bg-gradient-to-br from-rose-50 to-white p-8 mb-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-3xl font-bold text-gray-900">$299 <span className="text-base font-normal text-gray-500">CAD</span></p>
            <p className="text-sm text-gray-500">One-time · RN &amp; NP only · Instant access</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold text-rose-600">Save $148 CAD</p>
            <p className="text-xs text-gray-400">vs $447 separately</p>
          </div>
        </div>
        <Link
          href="/modules/hemodynamics-advanced#upgrade?bundle=critical-care"
          className="block text-center px-6 py-3.5 rounded-full bg-rose-600 text-white font-semibold hover:brightness-110 transition-all mb-4"
        >
          <Heart className="inline w-4 h-4 mr-2" />
          Get Critical Care Bundle — $299 CAD
        </Link>
        <p className="text-xs text-center text-gray-500">
          One-time purchase · Requires active RN or NP subscription · Instant access to all three modules
        </p>
      </div>

      {/* What's included */}
      <section aria-labelledby="includes-heading" className="mb-12">
        <h2 id="includes-heading" className="text-xl font-bold text-gray-900 mb-6">
          Three complete advanced modules
        </h2>
        <div className="grid sm:grid-cols-3 gap-5">
          {BUNDLE_INCLUDES.map((section) => (
            <div key={section.label} className="rounded-xl border border-gray-100 bg-white p-5">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-sm">
                <section.icon className="w-4 h-4 text-rose-500" />
                {section.label}
              </h3>
              <ul className="space-y-1.5">
                {section.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs text-gray-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Savings comparison */}
      <section aria-labelledby="savings-heading" className="rounded-xl border border-gray-100 bg-gray-50 p-6 mb-12">
        <h2 id="savings-heading" className="font-bold text-gray-900 mb-4">Price comparison</h2>
        <div className="space-y-3">
          {[
            { label: "Advanced ECG Interpretation", price: "$149" },
            { label: "Advanced Hemodynamic Monitoring", price: "$149" },
            { label: "Advanced Labs Interpretation", price: "$149" },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between text-sm text-gray-600">
              <span>{item.label}</span>
              <span className="font-semibold text-gray-400 line-through">{item.price} CAD</span>
            </div>
          ))}
          <div className="border-t border-gray-200 pt-3 flex items-center justify-between">
            <span className="font-bold text-gray-900">Critical Care Bundle</span>
            <div className="text-right">
              <span className="font-bold text-rose-600 text-lg">$299 CAD</span>
              <span className="ml-2 text-xs text-emerald-600 font-semibold">Save $148</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section aria-labelledby="faq-heading" className="mb-10">
        <h2 id="faq-heading" className="text-xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
        <div className="space-y-5">
          {FAQ_ITEMS.map((faq) => (
            <div key={faq.question} className="border-b border-gray-100 pb-5">
              <h3 className="font-semibold text-gray-900 mb-2 text-sm">{faq.question}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Module detail links */}
      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        <Link
          href="/advanced-ecg-nursing"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50"
        >
          Advanced ECG details
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/advanced-hemodynamic-monitoring"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50"
        >
          Advanced Hemodynamics details
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/advanced-labs-interpretation"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50"
        >
          Advanced Labs details
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </main>
  );
}
