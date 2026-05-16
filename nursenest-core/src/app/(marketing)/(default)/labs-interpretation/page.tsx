import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, FlaskConical, Zap } from "lucide-react";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";

export const revalidate = 86400;

const PATH = "/labs-interpretation";
const PAGE_TITLE = "Lab Values Interpretation for Nurses | CBC, BMP, LFTs, ABG & More | NurseNest";
const PAGE_DESCRIPTION =
  "Clinical lab interpretation for RN and NP: understand CBC patterns, anion gap, BMP electrolytes, liver function tests, coagulation, ABGs, and sepsis markers. Included with RN and NP subscriptions — go beyond normal ranges to clinical reasoning.";
const SITE_ORIGIN = "https://nursenest.ca";

const FUNDAMENTALS_TOPICS = [
  { label: "CBC interpretation", desc: "Hemoglobin, MCV, WBC differential, platelet count — anemia classification and infection recognition" },
  { label: "BMP/CMP panel", desc: "Sodium, potassium, chloride, bicarbonate, BUN, creatinine, glucose — the electrolyte story" },
  { label: "Anion gap basics", desc: "Calculate and interpret the anion gap — the gateway to metabolic acidosis diagnosis" },
  { label: "Liver function tests", desc: "AST, ALT, ALP, bilirubin — hepatocellular vs cholestatic patterns" },
  { label: "Coagulation fundamentals", desc: "PT/INR, aPTT — when to use each, what they monitor, what's emergent" },
  { label: "Lactate & infection markers", desc: "Lactate, procalcitonin, CRP — sepsis recognition from labs" },
  { label: "Renal function labs", desc: "Creatinine trend, BUN/Cr ratio, eGFR, AKI recognition" },
  { label: "Electrolyte patterns", desc: "Hypo/hypernatremia, potassium emergencies, calcium and magnesium basics" },
];

const FAQ_ITEMS = [
  {
    question: "What lab interpretation content is included with the RN or NP subscription?",
    answer:
      "Hemodynamic Monitoring Fundamentals and the core ECG curriculum are included with RN and NP subscriptions. Advanced Labs Interpretation — covering advanced clinical reasoning for CBC, coagulation, ABG, DKA, AKI, and critical care electrolytes — is available as a $149 CAD one-time add-on.",
  },
  {
    question: "Why are CBC patterns important for nursing practice?",
    answer:
      "The CBC contains the most common critical values in acute care: hemoglobin indicating transfusion need, platelet trends indicating HIT or DIC, and WBC differential distinguishing bacterial from viral infection. Nurses who interpret indices like MCV and understand the differential catch clinical deterioration earlier.",
  },
  {
    question: "What is the anion gap and why should nurses know it?",
    answer:
      "The anion gap (Na - [Cl + HCO3]) represents unmeasured anions in the blood. An elevated gap signals acid accumulation — from DKA, lactic acidosis, renal failure, or toxic ingestion — before the patient looks critically ill. Nurses who know the anion gap catch metabolic emergencies faster.",
  },
  {
    question: "Is Advanced Labs Interpretation included with my subscription?",
    answer:
      "No. Advanced Labs Interpretation ($149 CAD one-time) covers advanced clinical reasoning for CBC mastery, anion gap with albumin correction, DKA lab patterns and potassium management, ABG 5-step interpretation, AKI staging, and critical care electrolytes. It extends the fundamentals into ICU-level decision support.",
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
        "@type": "Course",
        name: "Lab Values Interpretation for Nurses",
        description: PAGE_DESCRIPTION,
        url: `${SITE_ORIGIN}${PATH}`,
        provider: { "@type": "EducationalOrganization", name: "NurseNest", url: SITE_ORIGIN },
        courseMode: "online",
        educationalLevel: "Intermediate",
        teaches: ["CBC interpretation", "BMP", "anion gap", "liver function tests", "coagulation", "lactate", "ABG", "AKI"],
        audience: { "@type": "EducationalAudience", educationalRole: "nurse" },
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
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_ORIGIN },
          { "@type": "ListItem", position: 2, name: "Clinical Modules", item: `${SITE_ORIGIN}/clinical-modules` },
          { "@type": "ListItem", position: 3, name: "Lab Interpretation", item: `${SITE_ORIGIN}${PATH}` },
        ],
      },
    ],
  } as Metadata));
}

export default function LabsInterpretationPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span>/</span>
        <Link href="/clinical-modules" className="hover:text-primary">Clinical Modules</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Lab Interpretation</span>
      </nav>

      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-semibold mb-4">
          <FlaskConical className="w-4 h-4" />
          Included with RN &amp; NP subscriptions
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-4">
          Lab Values Interpretation for Nurses
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed max-w-3xl">
          Go beyond memorizing normal ranges. This module teaches you to interpret CBC patterns,
          calculate the anion gap, recognize electrolyte emergencies, and apply lab results to
          clinical decisions at the bedside.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-12">
        {FUNDAMENTALS_TOPICS.map((topic) => (
          <div key={topic.label} className="rounded-xl border border-gray-100 bg-white p-5">
            <h3 className="font-bold text-gray-900 mb-1.5 flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              {topic.label}
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed ml-6">{topic.desc}</p>
          </div>
        ))}
      </div>

      {/* Advanced upgrade CTA */}
      <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-8 mb-12">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold mb-2">
              Premium Add-On · $149 CAD one-time
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Advanced Labs Interpretation</h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              ICU-level lab reasoning for RN and NP: anion gap with albumin correction, DKA potassium management,
              ABG 5-step systematic interpretation, AKI KDIGO staging, HIT recognition, coagulation crisis protocols,
              and critical care electrolytes (Mg, phosphate, ionized calcium, ammonia).
            </p>
            <div className="grid sm:grid-cols-2 gap-2 mb-5">
              {[
                "CBC mastery: RBC indices, HIT, DIC pattern",
                "Anion gap + delta-delta ratio",
                "DKA: K management, gap closure endpoint",
                "ABG: 5-step + A-a gradient + ventilator",
                "AKI: KDIGO staging, FENa, nephrotoxins",
                "Critical electrolytes: Mg, phos, ionized Ca",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2 text-xs text-gray-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  {item}
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/advanced-labs-interpretation"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 text-white text-sm font-semibold hover:brightness-110 transition-all"
              >
                Learn more about Advanced Labs
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/critical-care-bundle"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-emerald-200 text-emerald-700 text-sm font-medium hover:bg-emerald-50"
              >
                Critical Care Bundle (best value)
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <section aria-labelledby="faq-heading" className="mb-10">
        <h2 id="faq-heading" className="text-xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
        <div className="space-y-5">
          {FAQ_ITEMS.map((faq) => (
            <div key={faq.question} className="border-b border-gray-100 pb-5">
              <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/advanced-labs-interpretation"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 text-white text-sm font-semibold hover:brightness-110"
        >
          Advanced Labs — $149 CAD
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/clinical-modules"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50"
        >
          View all clinical modules
        </Link>
      </div>
    </main>
  );
}
