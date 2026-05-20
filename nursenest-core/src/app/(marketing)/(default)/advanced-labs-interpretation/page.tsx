import type { Metadata } from "next";
import Link from "next/link";
import { AcademyBreadcrumbBar } from "@/components/clinical-academy/clinical-academy-chrome";
import { labsHubChildBreadcrumbs } from "@/lib/breadcrumbs/academy-breadcrumbs";
import { ArrowRight, CheckCircle2, FlaskConical, Heart, Zap } from "lucide-react";
import { safeGenerateMetadata } from "@/lib/seo/safe-marketing-metadata";
import { marketingAlternatesSharedPage } from "@/lib/seo/marketing-alternates";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";

export const revalidate = 86400;

const PATH = "/advanced-labs-interpretation";
const PAGE_TITLE = "Advanced Lab Interpretation for Nurses | ICU Labs, DKA, ABG, AKI | NurseNest";
const PAGE_DESCRIPTION =
  "Advanced clinical lab interpretation for RN and NP: CBC mastery, anion gap with albumin correction, DKA potassium management, ABG 5-step interpretation, AKI KDIGO staging, coagulation crisis, and critical care electrolytes. $149 CAD one-time add-on.";
const SITE_ORIGIN = "https://nursenest.ca";

const CURRICULUM = [
  {
    number: "01",
    title: "CBC Mastery: Beyond Normal Ranges",
    desc: "RBC indices, differential white counts, HIT recognition, DIC pattern, transfusion triggers",
  },
  {
    number: "02",
    title: "BMP & CMP: Anion Gap & Electrolyte Emergencies",
    desc: "Anion gap calculation with albumin correction, hyponatremia correction rates, hyperkalemia emergencies",
  },
  {
    number: "03",
    title: "Liver Function Tests: Hepatocellular vs Cholestatic",
    desc: "AST/ALT patterns, ischemic hepatitis, acetaminophen toxicity, synthetic function failure",
  },
  {
    number: "04",
    title: "Coagulation: PT, INR, aPTT & Anti-Xa",
    desc: "Correct monitoring for each anticoagulant, DIC recognition, supratherapeutic reversal",
  },
  {
    number: "05",
    title: "Lactate & Sepsis-3 Lab Cluster",
    desc: "Lactate clearance endpoints, procalcitonin guidance, sepsis bundle lab requirements",
  },
  {
    number: "06",
    title: "ABG Mastery: 5-Step Systematic Interpretation",
    desc: "Primary disorder, compensation check, A-a gradient, ventilator implications, permissive hypercapnia",
  },
  {
    number: "07",
    title: "Cardiac Markers: Troponin Kinetics & BNP",
    desc: "Delta troponin protocols, Type 1 vs Type 2 MI, BNP in heart failure and PE",
  },
  {
    number: "08",
    title: "DKA: The Complete Lab Pattern",
    desc: "Euglycemic DKA, potassium management before/during insulin, anion gap closure as endpoint",
  },
  {
    number: "09",
    title: "AKI Lab Pattern: KDIGO Staging & FENa",
    desc: "Creatinine trend staging, prerenal vs intrinsic classification, nephrotoxin review",
  },
  {
    number: "10",
    title: "Critical Care Electrolytes: Mg, Phos, Ca & Ammonia",
    desc: "Refractory hypokalemia from hypomagnesemia, refeeding syndrome, ionized calcium in CRRT",
  },
];

const FAQ_ITEMS = [
  {
    question: "What is included in Advanced Labs Interpretation?",
    answer:
      "Advanced Labs Interpretation includes 10 fully authored clinical lessons: CBC mastery (RBC indices, HIT, DIC), BMP/CMP with anion gap calculation, liver function tests, coagulation panel interpretation, lactate and sepsis-3 markers, ABG 5-step systematic approach, cardiac markers (troponin kinetics, BNP), complete DKA lab pattern with potassium management, AKI KDIGO staging, and critical care electrolytes (magnesium, phosphate, ionized calcium, ammonia). Each lesson includes clinical cases, practice questions, and nursing priorities.",
  },
  {
    question: "Is Advanced Labs different from the fundamentals content in the RN subscription?",
    answer:
      "Yes. The fundamentals included with RN/NP subscriptions cover normal ranges, basic interpretation, and common clinical scenarios. Advanced Labs Interpretation targets ICU-level reasoning: anion gap with albumin correction, delta-delta ratio, euglycemic DKA in SGLT2 inhibitor patients, KDIGO AKI staging, FENa interpretation, HIT recognition protocol, ABG compensation checks with Winter's formula, and critical care electrolyte emergencies.",
  },
  {
    question: "Who is Advanced Labs Interpretation designed for?",
    answer:
      "Advanced Labs Interpretation is designed for RN and NP learners working in or preparing for ICU, ED, step-down, cardiac, and complex medical-surgical environments. It is particularly valuable for CNPLE preparation (lab interpretation is a core CNPLE domain), ICU transition programs, and NPs managing complex patients.",
  },
  {
    question: "What is the Critical Care Bundle?",
    answer:
      "The Critical Care Bundle ($299 CAD one-time) includes Advanced ECG Interpretation, Advanced Hemodynamic Monitoring, and Advanced Labs Interpretation at a combined discount versus purchasing separately. It provides complete ICU/CCU clinical readiness: STEMI recognition, Swan-Ganz interpretation, vasopressor reasoning, and advanced lab decision support.",
  },
  {
    question: "How does DKA lab management appear on the CNPLE?",
    answer:
      "The CNPLE tests clinical judgment for complex medical management, including DKA. Key testable areas: potassium management before insulin initiation (hold insulin if K <3.5), anion gap closure as the true resolution endpoint (not glucose normalization), euglycemic DKA in SGLT2 inhibitor users, and the insulin-to-subcutaneous transition protocol.",
  },
  {
    question: "Why does hypomagnesemia cause refractory hypokalemia?",
    answer:
      "Magnesium is required for the function of the Na/K-ATPase pump in the renal tubule. Without adequate magnesium, the kidney continuously wastes potassium regardless of how much is replaced. This is why potassium fails to normalize in ICU patients despite aggressive replacement — until magnesium is corrected first.",
  },
];

const SPECIALTY_USE_CASES = [
  { role: "ICU / Critical Care RN", value: "DKA protocols, AKI staging, ABG-to-ventilator decision-making, CRRT electrolyte monitoring" },
  { role: "Emergency Department RN", value: "Sepsis lab bundle, lactate clearance monitoring, troponin delta protocols, hyperkalemia emergencies" },
  { role: "NP (All Specialties)", value: "CNPLE preparation, complex patient management, prescribing decisions driven by lab data" },
  { role: "Step-Down / PCU RN", value: "Anticoagulation monitoring, cardiac marker interpretation, DKA/HHS management" },
  { role: "Float Pool / Agency", value: "Confidently interpreting any lab panel in any unit, clinical reasoning across specialties" },
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
        name: "Advanced Lab Interpretation for RN & NP",
        description: PAGE_DESCRIPTION,
        url: `${SITE_ORIGIN}${PATH}`,
        provider: { "@type": "EducationalOrganization", name: "NurseNest", url: SITE_ORIGIN },
        courseMode: "online",
        educationalLevel: "Advanced",
        teaches: [
          "CBC interpretation", "anion gap", "DKA lab pattern", "ABG interpretation",
          "AKI staging", "KDIGO criteria", "coagulation panel", "troponin kinetics", "critical care electrolytes",
        ],
        offers: {
          "@type": "Offer",
          price: "149",
          priceCurrency: "CAD",
          availability: "https://schema.org/InStock",
          priceValidUntil: "2027-12-31",
          description: "One-time purchase for active RN and NP subscribers",
        },
        audience: { "@type": "EducationalAudience", educationalRole: "nurse" },
      },
      {
        "@context": "https://schema.org",
        "@type": "Product",
        name: "Advanced Labs Interpretation — NurseNest",
        description: PAGE_DESCRIPTION,
        brand: { "@type": "Brand", name: "NurseNest" },
        offers: {
          "@type": "Offer",
          price: "149",
          priceCurrency: "CAD",
          availability: "https://schema.org/InStock",
          priceValidUntil: "2027-12-31",
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

export default function AdvancedLabsInterpretationPage() {
  const breadcrumbResolution = labsHubChildBreadcrumbs(
    "Labs Interpretation",
    "/labs-interpretation",
    "Advanced Labs",
    PATH,
  );
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <AcademyBreadcrumbBar pathname={PATH} resolution={breadcrumbResolution} className="mb-8" />

      {/* Hero */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-semibold mb-4">
          <Zap className="w-4 h-4" />
          Premium Add-On · $149 CAD one-time · RN &amp; NP
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-4">
          Advanced Lab Interpretation for Nurses
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed max-w-3xl">{PAGE_DESCRIPTION}</p>
      </div>

      {/* Primary CTA */}
      <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-8 mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-3xl font-bold text-gray-900">$149 <span className="text-base font-normal text-gray-500">CAD</span></p>
            <p className="text-sm text-gray-500">One-time · RN &amp; NP only · Instant access</p>
          </div>
          <div className="text-right text-sm text-gray-500">
            <p>10 lessons · ~5.5 hours</p>
            <p>30+ practice questions</p>
          </div>
        </div>
        <Link
          href="/modules/labs-advanced#upgrade"
          className="block text-center px-6 py-3.5 rounded-full bg-emerald-600 text-white font-semibold hover:brightness-110 transition-all mb-3"
        >
          <FlaskConical className="inline w-4 h-4 mr-2" />
          Get Advanced Labs Interpretation — $149 CAD
        </Link>
        <p className="text-xs text-center text-gray-500 mb-4">
          One-time purchase · Requires active RN or NP subscription · No recurring charges
        </p>
        <div className="border-t border-emerald-100 pt-4">
          <p className="text-xs text-center text-emerald-700 font-semibold mb-2">
            Or save with the Critical Care Bundle
          </p>
          <Link
            href="/critical-care-bundle"
            className="block text-center px-4 py-2.5 rounded-full border border-emerald-300 text-emerald-700 text-sm font-medium hover:bg-emerald-50"
          >
            <Heart className="inline w-3.5 h-3.5 mr-1.5" />
            Critical Care Bundle — ECG + Hemodynamics + Labs · $299 CAD
          </Link>
        </div>
      </div>

      {/* Curriculum */}
      <section aria-labelledby="curriculum-heading" className="mb-12">
        <h2 id="curriculum-heading" className="text-xl font-bold text-gray-900 mb-6">
          10 lessons — mechanism-first clinical reasoning
        </h2>
        <div className="space-y-3">
          {CURRICULUM.map((lesson) => (
            <div key={lesson.number} className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 bg-white">
              <span className="text-sm font-mono font-bold text-emerald-600 w-7 shrink-0 mt-0.5">
                {lesson.number}
              </span>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{lesson.title}</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{lesson.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Who it's for */}
      <section aria-labelledby="who-heading" className="mb-12">
        <h2 id="who-heading" className="text-xl font-bold text-gray-900 mb-4">Who this is for</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {SPECIALTY_USE_CASES.map((uc) => (
            <div key={uc.role} className="rounded-xl border border-gray-100 bg-white p-4">
              <p className="font-semibold text-gray-900 text-sm mb-1">{uc.role}</p>
              <p className="text-xs text-gray-600 leading-relaxed">{uc.value}</p>
            </div>
          ))}
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

      {/* Bottom CTA */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/modules/labs-advanced#upgrade"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-emerald-600 text-white text-sm font-semibold hover:brightness-110"
        >
          Get Advanced Labs — $149 CAD
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/critical-care-bundle"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50"
        >
          Critical Care Bundle (best value)
        </Link>
        <Link
          href="/labs-interpretation"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50"
        >
          Labs fundamentals
        </Link>
      </div>
    </main>
  );
}
