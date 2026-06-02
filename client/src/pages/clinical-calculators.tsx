import { useState } from "react";
import { useRoute } from "wouter";
import { Navigation } from "@/components/navigation";
import { SEO } from "@/components/seo";
import { LocaleLink } from "@/lib/LocaleLink";
import { useI18n } from "@/lib/i18n";
import { buildFaqStructuredData } from "@/lib/structured-data";
import {
  Calculator, Activity, Heart, Baby, Wind, Droplets, Scale,
  ArrowRight, ChevronDown, ChevronRight, AlertCircle, CheckCircle2,
  BookOpen, Lightbulb, Info
} from "lucide-react";

interface CalculatorDef {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  icon: typeof Calculator;
  color: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
}

const CALCULATORS: CalculatorDef[] = [
  {
    slug: "anion-gap",
    title: "Anion Gap Calculator",
    shortTitle: "Anion Gap",
    description: "Calculate the anion gap to evaluate metabolic acidosis. Essential for ABG interpretation and critical care nursing.",
    icon: Activity,
    color: "#DC2626",
    metaTitle: "Anion Gap Calculator for Nurses — Clinical Tool | NurseNest",
    metaDescription: "Free anion gap calculator with clinical interpretation for nursing students. Calculate AG from sodium, chloride, and bicarbonate. Includes exam tips for NCLEX and nursing exams.",
    keywords: "anion gap calculator, nursing calculator, metabolic acidosis, ABG interpretation, NCLEX prep",
  },
  {
    slug: "iv-drip-rate",
    title: "IV Drip Rate Calculator",
    shortTitle: "IV Drip Rate",
    description: "Calculate IV flow rates in mL/hr and gtt/min. Covers standard and micro drip tubing for medication administration.",
    icon: Droplets,
    color: "#2563EB",
    metaTitle: "IV Drip Rate Calculator — Flow Rate & Drop Rate | NurseNest",
    metaDescription: "Free IV drip rate calculator for nursing students. Calculate mL/hr and drops per minute for standard and micro drip tubing. Med math made easy with exam tips.",
    keywords: "IV drip rate calculator, flow rate, drops per minute, nursing med math, NCLEX calculator",
  },
  {
    slug: "body-surface-area",
    title: "Body Surface Area (BSA) Calculator",
    shortTitle: "BSA",
    description: "Calculate BSA using the Mosteller or DuBois formula. Used for chemotherapy dosing, burn assessment, and pediatric medication calculations.",
    icon: Scale,
    color: "#7C3AED",
    metaTitle: "Body Surface Area (BSA) Calculator for Nurses | NurseNest",
    metaDescription: "Free BSA calculator using Mosteller and DuBois formulas. Essential for chemotherapy dosing, burn assessment, and pediatric medication calculations in nursing practice.",
    keywords: "BSA calculator, body surface area, Mosteller formula, burn assessment, chemotherapy dosing",
  },
  {
    slug: "pediatric-dose",
    title: "Pediatric Medication Dose Calculator",
    shortTitle: "Pediatric Dose",
    description: "Calculate weight-based pediatric medication doses. Includes safe dose range verification for common medications.",
    icon: Baby,
    color: "#EC4899",
    metaTitle: "Pediatric Dose Calculator — Weight-Based Dosing | NurseNest",
    metaDescription: "Free pediatric medication dose calculator for nursing students. Calculate weight-based doses with safe range verification. Essential for pediatric nursing and NCLEX prep.",
    keywords: "pediatric dose calculator, weight-based dosing, pediatric nursing, medication calculation, NCLEX",
  },
  {
    slug: "abg-interpretation",
    title: "ABG Interpretation Helper",
    shortTitle: "ABG Helper",
    description: "Enter arterial blood gas values and get step-by-step interpretation. Identifies acidosis, alkalosis, and compensation status.",
    icon: Wind,
    color: "#059669",
    metaTitle: "ABG Interpretation Helper — Arterial Blood Gas Analysis | NurseNest",
    metaDescription: "Free ABG interpretation tool for nursing students. Enter pH, PaCO2, HCO3, and PaO2 values for step-by-step acid-base analysis with clinical interpretation and exam tips.",
    keywords: "ABG interpretation, arterial blood gas, acid-base balance, nursing calculator, respiratory acidosis",
  },
  {
    slug: "gfr-calculator",
    title: "GFR Calculator (CKD-EPI)",
    shortTitle: "GFR",
    description: "Estimate glomerular filtration rate using the CKD-EPI equation. Assess kidney function staging for renal nursing care.",
    icon: Heart,
    color: "#D97706",
    metaTitle: "GFR Calculator (CKD-EPI) for Nurses | NurseNest",
    metaDescription: "Free GFR calculator using the CKD-EPI equation for nursing students. Estimate kidney function, determine CKD staging, and understand clinical implications for patient care.",
    keywords: "GFR calculator, CKD-EPI, glomerular filtration rate, kidney function, renal nursing",
  },
  {
    slug: "bmi-calculator",
    title: "BMI Calculator",
    shortTitle: "BMI",
    description: "Calculate Body Mass Index with clinical interpretation. Includes WHO and CDC classifications for adult and pediatric nursing assessments.",
    icon: Calculator,
    color: "#0891B2",
    metaTitle: "BMI Calculator with Clinical Interpretation | NurseNest",
    metaDescription: "Free BMI calculator for nursing students with WHO classifications and clinical interpretation. Understand BMI in patient assessment, health screening, and nursing care planning.",
    keywords: "BMI calculator, body mass index, nursing assessment, health screening, WHO classification",
  },
];

function CalculatorCard({ calc }: { calc: CalculatorDef }) {
  const Icon = calc.icon;
  return (
    <LocaleLink href={`/clinical-calculators/${calc.slug}`} className="block" data-testid={`card-calculator-${calc.slug}`}>
      <div className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${calc.color}15` }}>
            <Icon className="w-6 h-6" style={{ color: calc.color }} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors" data-testid={`text-calculator-title-${calc.slug}`}>
              {calc.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
              {calc.description}
            </p>
            <span className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 mt-3 group-hover:gap-2 transition-all">
              Use Calculator <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </div>
    </LocaleLink>
  );
}

function ClinicalCalculatorsHub() {
  const { t } = useI18n();

  const hubFaqs = [
    { question: "Are these clinical calculators accurate for nursing practice?", answer: "Yes. These calculators use standard medical formulas (CKD-EPI, Mosteller, standard drip rate equations) that are widely accepted in clinical practice. However, they are educational tools — always verify calculations with your facility's protocols and supervising clinician." },
    { question: "Can I use these calculators for my nursing exams?", answer: "These calculators are designed to help you practice and understand the formulas tested on NCLEX, REX-PN, and other nursing exams. While you won't have access to calculators during most exams, practicing with them builds your understanding of the underlying math and clinical reasoning." },
    { question: "What clinical calculators do nursing students need to know?", answer: "Nursing students should be comfortable with IV drip rate calculations, medication dose calculations (especially pediatric weight-based dosing), BMI, ABG interpretation, and basic renal function assessment (GFR). These are commonly tested on licensing exams and used daily in clinical practice." },
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Clinical Calculators for Nursing Students",
    "description": "Free interactive clinical calculators for nursing students. Includes anion gap, IV drip rate, BSA, pediatric dose, ABG interpretation, GFR, and BMI calculators.",
    "provider": { "@type": "EducationalOrganization", "name": "NurseNest", "url": "https://www.nursenest.ca" },
    "hasPart": CALCULATORS.map(c => ({
      "@type": "WebApplication",
      "name": c.title,
      "url": `https://www.nursenest.ca/clinical-calculators/${c.slug}`,
      "applicationCategory": "HealthApplication",
    })),
  };

  return (
    <>
      <SEO
        title={t("pages.clinicalCalculators.clinicalCalculatorsForNursingStudents")}
        description={t("pages.clinicalCalculators.freeInteractiveClinicalCalculatorsFor")}
        keywords="clinical calculators, nursing calculators, med math, IV drip rate, anion gap, ABG interpretation, GFR calculator, BMI calculator"
        canonicalPath="/clinical-calculators"
        structuredData={structuredData}
        additionalStructuredData={[buildFaqStructuredData(hubFaqs)]}
      />
      <Navigation />
      <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="max-w-5xl mx-auto px-4 py-12 sm:py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-1.5 rounded-full text-sm font-medium mb-4" data-testid="badge-calculators">
              <Calculator className="w-4 h-4" /> Free Clinical Tools
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4" data-testid="text-calculators-heading">
              {t("clinicalCalculators.heading", { "default": "Clinical Calculators for Nursing Students" })}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto" data-testid="text-calculators-subtitle">
              Interactive tools with step-by-step calculations, clinical interpretation, and exam tips. Practice the formulas you need for nursing exams and clinical rotations.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2" data-testid="grid-calculators">
            {CALCULATORS.map(calc => (
              <CalculatorCard key={calc.slug} calc={calc} />
            ))}
          </div>

          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t("pages.clinicalCalculators.frequentlyAskedQuestions")}</h2>
            <div className="space-y-4">
              {hubFaqs.map((faq, i) => (
                <FaqAccordion key={i} question={faq.question} answer={faq.answer} index={i} />
              ))}
            </div>
          </div>

          <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{t("pages.clinicalCalculators.buildYourClinicalSkills")}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Pair these calculators with our pathophysiology lessons, question banks, and clinical simulations to strengthen your exam readiness.
            </p>
            <div className="flex flex-wrap gap-3">
              <LocaleLink href="/lessons" className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors" data-testid="link-lessons-cta">
                <BookOpen className="w-4 h-4" /> Explore Lessons
              </LocaleLink>
              <LocaleLink href="/question-bank" className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 text-blue-600 border border-blue-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors" data-testid="link-qbank-cta">
                Practice Questions <ArrowRight className="w-4 h-4" />
              </LocaleLink>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

function FaqAccordion({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg" data-testid={`faq-item-${index}`}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-4 text-left" data-testid={`button-faq-toggle-${index}`}>
        <span className="font-medium text-gray-900 dark:text-white">{question}</span>
        {open ? <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" /> : <ChevronRight className="w-5 h-5 text-gray-500 flex-shrink-0" />}
      </button>
      {open && <div className="px-4 pb-4 text-gray-600 dark:text-gray-400 text-sm">{answer}</div>}
    </div>
  );
}

function InputField({ label, value, onChange, unit, placeholder, id }: { label: string; value: string; onChange: (v: string) => void; unit?: string; placeholder?: string; id: string }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      <div className="flex">
        <input
          id={id}
          type="number"
          step="any"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          data-testid={`input-${id}`}
        />
        {unit && <span className="px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-l-0 border-gray-300 dark:border-gray-600 rounded-r-lg text-sm text-gray-600 dark:text-gray-400 flex items-center">{unit}</span>}
      </div>
    </div>
  );
}

function ResultBox({ label, value, interpretation, color = "blue" }: { label: string; value: string; interpretation?: string; color?: string }) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
    green: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
    red: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
    yellow: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800",
  };
  return (
    <div className={`p-4 rounded-lg border ${colors[color] || colors.blue}`} data-testid={`result-${label.toLowerCase().replace(/\s+/g, "-")}`}>
      <div className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</div>
      {interpretation && <div className="text-sm text-gray-700 dark:text-gray-300 mt-2">{interpretation}</div>}
    </div>
  );
}

function ExamTip({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg mt-4">
      <Lightbulb className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
      <div className="text-sm text-amber-800 dark:text-amber-200">{children}</div>
    </div>
  );
}

function ClinicalNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg mt-4">
      <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
      <div className="text-sm text-blue-800 dark:text-blue-200">{children}</div>
    </div>
  );
}

function CalculatorPageWrapper({ calc, children }: { calc: CalculatorDef; children: React.ReactNode }) {
  const faqData = getCalculatorFaqs(calc.slug);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": calc.title,
    "description": calc.metaDescription,
    "url": `https://www.nursenest.ca/clinical-calculators/${calc.slug}`,
    "applicationCategory": "HealthApplication",
    "operatingSystem": "Web",
    "provider": { "@type": "EducationalOrganization", "name": "NurseNest", "url": "https://www.nursenest.ca" },
  };

  return (
    <>
      <SEO
        title={calc.metaTitle}
        description={calc.metaDescription}
        keywords={calc.keywords}
        canonicalPath={`/clinical-calculators/${calc.slug}`}
        structuredData={structuredData}
        additionalStructuredData={faqData.length > 0 ? [buildFaqStructuredData(faqData)] : undefined}
      />
      <Navigation />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
          <div className="mb-6">
            <LocaleLink href="/clinical-calculators" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1" data-testid="link-back-calculators">
              <ChevronRight className="w-4 h-4 rotate-180" /> All Calculators
            </LocaleLink>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${calc.color}15` }}>
              <calc.icon className="w-5 h-5" style={{ color: calc.color }} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white" data-testid="text-calculator-page-title">
              {calc.title}
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-8">{calc.description}</p>
          {children}
          {faqData.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{t("pages.clinicalCalculators.frequentlyAskedQuestions2")}</h2>
              <div className="space-y-3">
                {faqData.map((faq, i) => (
                  <FaqAccordion key={i} question={faq.question} answer={faq.answer} index={i} />
                ))}
              </div>
            </div>
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            <LocaleLink href="/lessons" className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium" data-testid="link-related-lessons">
              <BookOpen className="w-4 h-4" /> Related Lessons
            </LocaleLink>
            <LocaleLink href="/question-bank" className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium" data-testid="link-related-questions">
              <CheckCircle2 className="w-4 h-4" /> Practice Questions
            </LocaleLink>
          </div>
        </div>
      </main>
    </>
  );
}

function getCalculatorFaqs(slug: string): { question: string; answer: string }[] {
  const faqs: Record<string, { question: string; answer: string }[]> = {
    "anion-gap": [
      { question: "What is a normal anion gap?", answer: "A normal anion gap is typically 8–12 mEq/L (without albumin correction). Values above 12 suggest an elevated anion gap metabolic acidosis, which can be caused by conditions like DKA, lactic acidosis, renal failure, or toxic ingestions (MUDPILES mnemonic)." },
      { question: "When should nurses calculate the anion gap?", answer: "Calculate the anion gap when a patient has metabolic acidosis (low pH, low HCO3) to differentiate between anion gap acidosis (DKA, lactic acidosis) and non-anion gap acidosis (diarrhea, renal tubular acidosis). This helps guide treatment decisions." },
    ],
    "iv-drip-rate": [
      { question: "What is the IV drip rate formula?", answer: "The IV drip rate formula is: Drops per minute = (Volume in mL × Drop factor) ÷ Time in minutes. For mL/hr: Volume (mL) ÷ Time (hours). Standard drip tubing has a drop factor of 10, 15, or 20 gtt/mL; micro drip is 60 gtt/mL." },
      { question: "How do I calculate drops per minute for an IV infusion?", answer: "To calculate drops per minute: multiply the volume to be infused (mL) by the drop factor of the tubing (gtt/mL), then divide by the total infusion time in minutes. Example: 1000 mL over 8 hours with 15 gtt/mL tubing = (1000 × 15) ÷ 480 = 31 gtt/min." },
    ],
    "abg-interpretation": [
      { question: "How do you interpret ABG results step by step?", answer: "Step 1: Check pH (normal 7.35–7.45) — below 7.35 is acidosis, above 7.45 is alkalosis. Step 2: Check PaCO2 (normal 35–45 mmHg) — if it matches the pH direction, it's respiratory. Step 3: Check HCO3 (normal 22–26 mEq/L) — if it matches the pH direction, it's metabolic. Step 4: Determine compensation status." },
      { question: "What is the difference between compensated and uncompensated ABG?", answer: "Uncompensated: pH is abnormal and only one system (respiratory or metabolic) is abnormal. Partially compensated: pH is still abnormal but both systems show changes. Fully compensated: pH is within normal range (or near-normal) with both systems showing compensatory changes." },
    ],
    "gfr-calculator": [
      { question: "What GFR indicates kidney disease?", answer: "GFR staging: ≥90 = Stage 1 (normal or high), 60-89 = Stage 2 (mildly decreased), 45-59 = Stage 3a (mild-moderate decrease), 30-44 = Stage 3b (moderate-severe decrease), 15-29 = Stage 4 (severely decreased), <15 = Stage 5 (kidney failure). GFR below 60 for 3+ months indicates chronic kidney disease." },
    ],
    "bmi-calculator": [
      { question: "What are the BMI categories according to WHO?", answer: "WHO BMI classifications: Underweight = <18.5, Normal weight = 18.5–24.9, Overweight = 25.0–29.9, Obesity Class I = 30.0–34.9, Obesity Class II = 35.0–39.9, Obesity Class III = ≥40.0. Note that BMI does not account for muscle mass, bone density, or body composition." },
    ],
    "body-surface-area": [
      { question: "Why is BSA important in nursing?", answer: "BSA is used to calculate chemotherapy drug doses (most cytotoxic drugs are dosed per m²), assess burn extent using the Rule of Nines, and determine pediatric medication doses. Accurate BSA calculation is critical for patient safety in oncology and burn nursing." },
    ],
    "pediatric-dose": [
      { question: "How do you calculate pediatric medication doses?", answer: "Pediatric doses are typically calculated based on weight: Dose = Weight (kg) × Dose per kg. Always verify the calculated dose falls within the safe dose range for the specific medication. For some medications, BSA-based dosing is more accurate, especially for chemotherapy agents." },
    ],
  };
  return faqs[slug] || [];
}

function AnionGapCalculator() {
  const [na, setNa] = useState("");
  const [cl, setCl] = useState("");
  const [hco3, setHco3] = useState("");
  const [albumin, setAlbumin] = useState("");
  const calc = CALCULATORS.find(c => c.slug === "anion-gap")!;
  const naVal = parseFloat(na); const clVal = parseFloat(cl); const hco3Val = parseFloat(hco3); const albVal = parseFloat(albumin);
  const hasResult = !isNaN(naVal) && !isNaN(clVal) && !isNaN(hco3Val);
  const ag = hasResult ? naVal - (clVal + hco3Val) : null;
  const correctedAg = ag !== null && !isNaN(albVal) ? ag + 2.5 * (4.0 - albVal) : null;

  let interpretation = "";
  let color = "blue";
  if (ag !== null) {
    if (ag > 12) { interpretation = "Elevated anion gap — suggests anion gap metabolic acidosis. Consider MUDPILES: Methanol, Uremia, DKA, Propylene glycol, Isoniazid/Iron, Lactic acidosis, Ethylene glycol, Salicylates."; color = "red"; }
    else if (ag < 8) { interpretation = "Low anion gap — may indicate hypoalbuminemia, multiple myeloma, or lab error. Consider checking albumin level."; color = "yellow"; }
    else { interpretation = "Normal anion gap (8–12 mEq/L). If metabolic acidosis is present, consider non-anion gap causes: diarrhea, RTA, saline infusion (HARDUPS mnemonic)."; color = "green"; }
  }

  return (
    <CalculatorPageWrapper calc={calc}>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t("pages.clinicalCalculators.enterLabValues")}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField label={t("pages.clinicalCalculators.sodiumNa")} value={na} onChange={setNa} unit="mEq/L" placeholder={t("pages.clinical_calculators.135145")} id="sodium" />
          <InputField label={t("pages.clinicalCalculators.chlorideCl")} value={cl} onChange={setCl} unit="mEq/L" placeholder={t("pages.clinical_calculators.96106")} id="chloride" />
          <InputField label={t("pages.clinicalCalculators.bicarbonateHco")} value={hco3} onChange={setHco3} unit="mEq/L" placeholder={t("pages.clinical_calculators.2226")} id="bicarbonate" />
          <InputField label={t("pages.clinicalCalculators.albuminOptional")} value={albumin} onChange={setAlbumin} unit="g/dL" placeholder={t("pages.clinical_calculators.3550")} id="albumin" />
        </div>
        {hasResult && ag !== null && (
          <div className="mt-6 space-y-3">
            <ResultBox label={t("pages.clinicalCalculators.anionGap")} value={`${ag.toFixed(1)} mEq/L`} interpretation={interpretation} color={color} />
            {correctedAg !== null && (
              <ResultBox label={t("pages.clinicalCalculators.albumincorrectedAg")} value={`${correctedAg.toFixed(1)} mEq/L`} interpretation={`Corrected for albumin ${albVal} g/dL (normal 4.0 g/dL). Each 1 g/dL decrease in albumin lowers the AG by ~2.5 mEq/L.`} color="blue" />
            )}
          </div>
        )}
        <ClinicalNote>
          <strong>{t("pages.clinicalCalculators.formula")}</strong> AG = Na⁺ − (Cl⁻ + HCO₃⁻). Normal range: 8–12 mEq/L. Albumin correction: Corrected AG = AG + 2.5 × (4.0 − measured albumin).
        </ClinicalNote>
        <ExamTip>
          <strong>{t("pages.clinicalCalculators.nclexTip")}</strong> The anion gap is a must-know for distinguishing DKA (elevated AG) from hyperchloremic acidosis (normal AG). Remember MUDPILES for elevated AG causes and HARDUPS for normal AG causes.
        </ExamTip>
      </div>
    </CalculatorPageWrapper>
  );
}

function IVDripRateCalculator() {
  const [volume, setVolume] = useState("");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");
  const [dropFactor, setDropFactor] = useState("15");
  const calc = CALCULATORS.find(c => c.slug === "iv-drip-rate")!;
  const vol = parseFloat(volume); const hrs = parseFloat(hours); const mins = parseFloat(minutes); const df = parseFloat(dropFactor);
  const totalMinutes = (isNaN(hrs) ? 0 : hrs * 60) + (isNaN(mins) ? 0 : mins);
  const hasResult = !isNaN(vol) && totalMinutes > 0 && !isNaN(df);
  const mlPerHr = hasResult ? vol / (totalMinutes / 60) : null;
  const gttsPerMin = hasResult ? (vol * df) / totalMinutes : null;

  return (
    <CalculatorPageWrapper calc={calc}>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t("pages.clinicalCalculators.enterInfusionParameters")}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField label={t("pages.clinicalCalculators.totalVolume")} value={volume} onChange={setVolume} unit="mL" placeholder="1000" id="volume" />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("pages.clinicalCalculators.dropFactor")}</label>
            <select value={dropFactor} onChange={e => setDropFactor(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" data-testid="select-drop-factor">
              <option value="10">{t("pages.clinicalCalculators.10GttmlStandard")}</option>
              <option value="15">{t("pages.clinicalCalculators.15GttmlStandard")}</option>
              <option value="20">{t("pages.clinicalCalculators.20GttmlStandard")}</option>
              <option value="60">{t("pages.clinicalCalculators.60GttmlMicroDrip")}</option>
            </select>
          </div>
          <InputField label={t("pages.clinicalCalculators.hours")} value={hours} onChange={setHours} unit="hr" placeholder="8" id="hours" />
          <InputField label={t("pages.clinicalCalculators.minutes")} value={minutes} onChange={setMinutes} unit="min" placeholder="0" id="minutes" />
        </div>
        {hasResult && mlPerHr !== null && gttsPerMin !== null && (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <ResultBox label={t("pages.clinicalCalculators.flowRate")} value={`${mlPerHr.toFixed(1)} mL/hr`} color="blue" />
            <ResultBox label={t("pages.clinicalCalculators.dropRate")} value={`${gttsPerMin.toFixed(1)} gtt/min`} interpretation={`≈ ${Math.round(gttsPerMin)} drops per minute`} color="green" />
          </div>
        )}
        <ClinicalNote>
          <strong>{t("pages.clinicalCalculators.formula2")}</strong> gtt/min = (Volume × Drop Factor) ÷ Time in minutes. mL/hr = Volume ÷ Time in hours. Micro drip (60 gtt/mL): gtt/min = mL/hr when using 60 gtt/mL tubing.
        </ClinicalNote>
        <ExamTip>
          <strong>{t("pages.clinicalCalculators.nclexTip2")}</strong> Remember that with micro drip tubing (60 gtt/mL), the gtt/min equals the mL/hr rate — this shortcut is frequently tested. Always double-check drop factor on the tubing package before calculating.
        </ExamTip>
      </div>
    </CalculatorPageWrapper>
  );
}

function BSACalculator() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [formula, setFormula] = useState<"mosteller" | "dubois">("mosteller");
  const calc = CALCULATORS.find(c => c.slug === "body-surface-area")!;
  const h = parseFloat(height); const w = parseFloat(weight);
  const hasResult = !isNaN(h) && !isNaN(w) && h > 0 && w > 0;
  let bsa: number | null = null;
  if (hasResult) {
    if (formula === "mosteller") bsa = Math.sqrt((h * w) / 3600);
    else bsa = 0.007184 * Math.pow(h, 0.725) * Math.pow(w, 0.425);
  }

  return (
    <CalculatorPageWrapper calc={calc}>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t("pages.clinicalCalculators.enterPatientData")}</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("pages.clinicalCalculators.formula3")}</label>
          <select value={formula} onChange={e => setFormula(e.target.value as "mosteller" | "dubois")} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" data-testid="select-formula">
            <option value="mosteller">{t("pages.clinicalCalculators.mostellerRecommended")}</option>
            <option value="dubois">{t("pages.clinicalCalculators.duboisDubois")}</option>
          </select>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField label={t("pages.clinicalCalculators.height")} value={height} onChange={setHeight} unit="cm" placeholder="170" id="height" />
          <InputField label={t("pages.clinicalCalculators.weight")} value={weight} onChange={setWeight} unit="kg" placeholder="70" id="weight" />
        </div>
        {hasResult && bsa !== null && (
          <div className="mt-6">
            <ResultBox label={t("pages.clinicalCalculators.bodySurfaceArea")} value={`${bsa.toFixed(2)} m²`} interpretation={`Average adult BSA is approximately 1.7 m². ${bsa < 1.5 ? "Below average — verify pediatric dosing adjustments." : bsa > 2.2 ? "Above average — monitor for dose-related toxicity with BSA-based dosing." : "Within typical adult range."}`} color="blue" />
          </div>
        )}
        <ClinicalNote>
          <strong>{t("pages.clinicalCalculators.mosteller")}</strong>{t("pages.clinical_calculators.bsaMHeightCmWeight")}<strong>{t("pages.clinicalCalculators.dubois")}</strong> BSA = 0.007184 × Height⁰·⁷²⁵ × Weight⁰·⁴²⁵.
        </ClinicalNote>
        <ExamTip>
          <strong>{t("pages.clinicalCalculators.examTip")}</strong> BSA is used for chemotherapy dosing (mg/m²), burn assessment (Rule of Nines uses BSA percentages), and cardiac index calculation (CI = CO/BSA). Know the Mosteller formula — it's the most commonly tested.
        </ExamTip>
      </div>
    </CalculatorPageWrapper>
  );
}

function PediatricDoseCalculator() {
  const [weight, setWeight] = useState("");
  const [dosePerKg, setDosePerKg] = useState("");
  const [frequency, setFrequency] = useState("1");
  const [concentration, setConcentration] = useState("");
  const calc = CALCULATORS.find(c => c.slug === "pediatric-dose")!;
  const w = parseFloat(weight); const dpk = parseFloat(dosePerKg); const freq = parseFloat(frequency); const conc = parseFloat(concentration);
  const hasResult = !isNaN(w) && !isNaN(dpk) && w > 0 && dpk > 0;
  const singleDose = hasResult ? w * dpk : null;
  const dailyDose = singleDose !== null && !isNaN(freq) ? singleDose * freq : null;
  const volumePerDose = singleDose !== null && !isNaN(conc) && conc > 0 ? singleDose / conc : null;

  return (
    <CalculatorPageWrapper calc={calc}>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t("pages.clinicalCalculators.enterMedicationParameters")}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField label={t("pages.clinicalCalculators.patientWeight")} value={weight} onChange={setWeight} unit="kg" placeholder="20" id="patient-weight" />
          <InputField label={t("pages.clinicalCalculators.dosePerKg")} value={dosePerKg} onChange={setDosePerKg} unit="mg/kg" placeholder="10" id="dose-per-kg" />
          <InputField label={t("pages.clinicalCalculators.timesPerDay")} value={frequency} onChange={setFrequency} unit="×/day" placeholder="3" id="frequency" />
          <InputField label={t("pages.clinicalCalculators.concentrationOptional")} value={concentration} onChange={setConcentration} unit="mg/mL" placeholder="25" id="concentration" />
        </div>
        {hasResult && singleDose !== null && (
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <ResultBox label={t("pages.clinicalCalculators.singleDose")} value={`${singleDose.toFixed(1)} mg`} color="blue" />
            {dailyDose !== null && <ResultBox label={t("pages.clinicalCalculators.totalDailyDose")} value={`${dailyDose.toFixed(1)} mg/day`} color="green" />}
            {volumePerDose !== null && <ResultBox label={t("pages.clinicalCalculators.volumePerDose")} value={`${volumePerDose.toFixed(2)} mL`} interpretation={`Based on ${conc} mg/mL concentration`} color="blue" />}
          </div>
        )}
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700 dark:text-red-300"><strong>{t("pages.clinicalCalculators.safetyCheck")}</strong> {t("pages.clinicalCalculators.alwaysVerifyTheCalculatedDose")}</p>
        </div>
        <ExamTip>
          <strong>{t("pages.clinicalCalculators.nclexTip3")}</strong> Pediatric dosing questions are high-yield on nursing exams. Always calculate mg/kg first, then verify the total dose falls within the safe range. If the ordered dose exceeds the recommended range, contact the prescriber before administering.
        </ExamTip>
      </div>
    </CalculatorPageWrapper>
  );
}

function ABGCalculator() {
  const [ph, setPh] = useState("");
  const [paco2, setPaco2] = useState("");
  const [hco3, setHco3] = useState("");
  const [pao2, setPao2] = useState("");
  const calc = CALCULATORS.find(c => c.slug === "abg-interpretation")!;
  const phVal = parseFloat(ph); const co2Val = parseFloat(paco2); const hco3Val = parseFloat(hco3); const o2Val = parseFloat(pao2);
  const hasResult = !isNaN(phVal) && !isNaN(co2Val) && !isNaN(hco3Val);

  let analysis = { status: "", type: "", compensation: "", oxygenation: "", steps: [] as string[] };
  if (hasResult) {
    const isAcidotic = phVal < 7.35;
    const isAlkalotic = phVal > 7.45;
    const co2High = co2Val > 45; const co2Low = co2Val < 35;
    const hco3High = hco3Val > 26; const hco3Low = hco3Val < 22;

    analysis.steps.push(`pH = ${phVal} → ${isAcidotic ? "Acidosis" : isAlkalotic ? "Alkalosis" : "Normal pH"}`);
    analysis.steps.push(`PaCO₂ = ${co2Val} mmHg → ${co2High ? "Elevated (respiratory acidosis)" : co2Low ? "Low (respiratory alkalosis)" : "Normal"}`);
    analysis.steps.push(`HCO₃⁻ = ${hco3Val} mEq/L → ${hco3High ? "Elevated (metabolic alkalosis)" : hco3Low ? "Low (metabolic acidosis)" : "Normal"}`);

    if (isAcidotic) {
      analysis.status = "Acidosis";
      if (co2High && !hco3Low) { analysis.type = "Respiratory Acidosis"; analysis.compensation = hco3High ? "With metabolic compensation" : "Uncompensated"; }
      else if (hco3Low && !co2High) { analysis.type = "Metabolic Acidosis"; analysis.compensation = co2Low ? "With respiratory compensation" : "Uncompensated"; }
      else if (co2High && hco3Low) { analysis.type = "Mixed Acidosis"; analysis.compensation = "Combined respiratory and metabolic acidosis"; }
      else { analysis.type = "Acidosis"; analysis.compensation = "Evaluate clinically"; }
    } else if (isAlkalotic) {
      analysis.status = "Alkalosis";
      if (co2Low && !hco3High) { analysis.type = "Respiratory Alkalosis"; analysis.compensation = hco3Low ? "With metabolic compensation" : "Uncompensated"; }
      else if (hco3High && !co2Low) { analysis.type = "Metabolic Alkalosis"; analysis.compensation = co2High ? "With respiratory compensation" : "Uncompensated"; }
      else if (co2Low && hco3High) { analysis.type = "Mixed Alkalosis"; analysis.compensation = "Combined respiratory and metabolic alkalosis"; }
      else { analysis.type = "Alkalosis"; analysis.compensation = "Evaluate clinically"; }
    } else {
      analysis.status = "Normal";
      if (co2High && hco3High) { analysis.type = "Compensated Respiratory Acidosis"; analysis.compensation = "Fully compensated — pH normal but both CO2 and HCO3 elevated"; }
      else if (co2Low && hco3Low) { analysis.type = "Compensated Respiratory Alkalosis"; analysis.compensation = "Fully compensated — pH normal but both CO2 and HCO3 decreased"; }
      else { analysis.type = "Normal ABG"; analysis.compensation = "No acid-base disturbance"; }
    }

    if (!isNaN(o2Val)) {
      analysis.oxygenation = o2Val < 60 ? "Severe hypoxemia (PaO₂ < 60 mmHg) — respiratory failure" : o2Val < 80 ? "Mild hypoxemia (PaO₂ 60–80 mmHg)" : "Normal oxygenation (PaO₂ 80–100 mmHg)";
      analysis.steps.push(`PaO₂ = ${o2Val} mmHg → ${analysis.oxygenation}`);
    }
  }

  const resultColor = analysis.status === "Acidosis" ? "red" : analysis.status === "Alkalosis" ? "yellow" : "green";

  return (
    <CalculatorPageWrapper calc={calc}>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t("pages.clinicalCalculators.enterAbgValues")}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField label="pH" value={ph} onChange={setPh} placeholder={t("pages.clinical_calculators.735745")} id="ph" />
          <InputField label={t("pages.clinicalCalculators.paco")} value={paco2} onChange={setPaco2} unit="mmHg" placeholder={t("pages.clinical_calculators.3545")} id="paco2" />
          <InputField label={t("pages.clinicalCalculators.hco")} value={hco3} onChange={setHco3} unit="mEq/L" placeholder={t("pages.clinical_calculators.2226")} id="hco3" />
          <InputField label={t("pages.clinicalCalculators.paoOptional")} value={pao2} onChange={setPao2} unit="mmHg" placeholder={t("pages.clinical_calculators.80100")} id="pao2" />
        </div>
        {hasResult && (
          <div className="mt-6 space-y-3">
            <ResultBox label={t("pages.clinicalCalculators.interpretation")} value={analysis.type} interpretation={analysis.compensation} color={resultColor} />
            {analysis.oxygenation && <ResultBox label={t("pages.clinicalCalculators.oxygenationStatus")} value={analysis.oxygenation} color={o2Val < 60 ? "red" : o2Val < 80 ? "yellow" : "green"} />}
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">{t("pages.clinicalCalculators.stepbystepAnalysis")}</h3>
              <ol className="space-y-1">
                {analysis.steps.map((step, i) => (
                  <li key={i} className="text-sm text-gray-700 dark:text-gray-300 flex gap-2">
                    <span className="font-medium text-blue-600 dark:text-blue-400">Step {i + 1}:</span> {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
        <ExamTip>
          <strong>{t("pages.clinicalCalculators.nclexTip4")}</strong> Use the "Tic-Tac-Toe" method: draw a grid with pH in the center, PaCO₂ on one side, and HCO₃ on the other. Match the abnormal value that corresponds to the pH direction to identify the primary disorder. This is one of the most commonly tested topics on nursing exams.
        </ExamTip>
      </div>
    </CalculatorPageWrapper>
  );
}

function GFRCalculator() {
  const [age, setAge] = useState("");
  const [creatinine, setCreatinine] = useState("");
  const [sex, setSex] = useState<"male" | "female">("female");
  const calc = CALCULATORS.find(c => c.slug === "gfr-calculator")!;
  const ageVal = parseFloat(age); const crVal = parseFloat(creatinine);
  const hasResult = !isNaN(ageVal) && !isNaN(crVal) && crVal > 0 && ageVal > 0;

  let gfr: number | null = null;
  if (hasResult) {
    const kappa = sex === "female" ? 0.7 : 0.9;
    const alpha = sex === "female" ? -0.241 : -0.302;
    const sexMultiplier = sex === "female" ? 1.012 : 1.0;
    gfr = 142 * Math.pow(Math.min(crVal / kappa, 1), alpha) * Math.pow(Math.max(crVal / kappa, 1), -1.200) * Math.pow(0.9938, ageVal) * sexMultiplier;
  }

  let stage = ""; let interpretation = ""; let color = "green";
  if (gfr !== null) {
    if (gfr >= 90) { stage = "G1"; interpretation = "Normal or high kidney function. If other markers of kidney damage are absent, no CKD."; color = "green"; }
    else if (gfr >= 60) { stage = "G2"; interpretation = "Mildly decreased. Monitor annually. May indicate early CKD if proteinuria or structural abnormalities are present."; color = "green"; }
    else if (gfr >= 45) { stage = "G3a"; interpretation = "Mild-to-moderate decrease. Refer to nephrology. Adjust renally-cleared medications."; color = "yellow"; }
    else if (gfr >= 30) { stage = "G3b"; interpretation = "Moderate-to-severe decrease. Monitor for complications: anemia, bone disease, electrolyte imbalances."; color = "yellow"; }
    else if (gfr >= 15) { stage = "G4"; interpretation = "Severely decreased. Prepare for renal replacement therapy. Restrict potassium, phosphorus. Avoid nephrotoxins."; color = "red"; }
    else { stage = "G5"; interpretation = "Kidney failure. Dialysis or transplant indicated. Monitor closely for uremic symptoms, fluid overload, hyperkalemia."; color = "red"; }
  }

  return (
    <CalculatorPageWrapper calc={calc}>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t("pages.clinicalCalculators.enterPatientData2")}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField label={t("pages.clinicalCalculators.age")} value={age} onChange={setAge} unit="years" placeholder="45" id="age" />
          <InputField label={t("pages.clinicalCalculators.serumCreatinine")} value={creatinine} onChange={setCreatinine} unit="mg/dL" placeholder="1.0" id="creatinine" />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("pages.clinicalCalculators.sex")}</label>
            <select value={sex} onChange={e => setSex(e.target.value as "male" | "female")} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" data-testid="select-sex">
              <option value="female">{t("pages.clinicalCalculators.female")}</option>
              <option value="male">{t("pages.clinicalCalculators.male")}</option>
            </select>
          </div>
        </div>
        {hasResult && gfr !== null && (
          <div className="mt-6">
            <ResultBox label={`eGFR — CKD Stage ${stage}`} value={`${gfr.toFixed(1)} mL/min/1.73m²`} interpretation={interpretation} color={color} />
          </div>
        )}
        <ClinicalNote>
          <strong>{t("pages.clinicalCalculators.ckdepi2021")}</strong> This calculator uses the race-free CKD-EPI 2021 equation recommended by KDIGO. GFR naturally declines with age — interpret results in clinical context.
        </ClinicalNote>
        <ExamTip>
          <strong>{t("pages.clinicalCalculators.examTip2")}</strong> Know the CKD stages and their nursing implications: Stage 3+ requires medication dose adjustments (metformin, digoxin, aminoglycosides). Stage 4+ requires preparation for dialysis. GFR &lt; 15 = kidney failure.
        </ExamTip>
      </div>
    </CalculatorPageWrapper>
  );
}

function BMICalculator() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const calc = CALCULATORS.find(c => c.slug === "bmi-calculator")!;
  const h = parseFloat(height); const w = parseFloat(weight);
  const hasResult = !isNaN(h) && !isNaN(w) && h > 0 && w > 0;
  let bmi: number | null = null;
  if (hasResult) {
    if (unit === "metric") bmi = w / Math.pow(h / 100, 2);
    else bmi = (w * 703) / Math.pow(h, 2);
  }

  let category = ""; let interpretation = ""; let color = "green";
  if (bmi !== null) {
    if (bmi < 18.5) { category = "Underweight"; interpretation = "BMI < 18.5 — Assess for malnutrition, eating disorders, chronic illness. Consider nutritional support and dietitian referral."; color = "yellow"; }
    else if (bmi < 25) { category = "Normal Weight"; interpretation = "BMI 18.5–24.9 — Within healthy range. Encourage continued healthy lifestyle behaviors."; color = "green"; }
    else if (bmi < 30) { category = "Overweight"; interpretation = "BMI 25.0–29.9 — Increased risk for cardiovascular disease, type 2 diabetes, hypertension. Lifestyle counseling recommended."; color = "yellow"; }
    else if (bmi < 35) { category = "Obesity Class I"; interpretation = "BMI 30.0–34.9 — High risk for metabolic syndrome, OSA, and joint problems. Structured weight management program recommended."; color = "red"; }
    else if (bmi < 40) { category = "Obesity Class II"; interpretation = "BMI 35.0–39.9 — Very high risk for obesity-related complications. Consider multidisciplinary approach including bariatric evaluation."; color = "red"; }
    else { category = "Obesity Class III"; interpretation = "BMI ≥ 40.0 — Highest risk category. Bariatric surgery evaluation indicated. Special nursing considerations for mobility, skin integrity, airway management."; color = "red"; }
  }

  return (
    <CalculatorPageWrapper calc={calc}>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t("pages.clinicalCalculators.enterMeasurements")}</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("pages.clinicalCalculators.unitSystem")}</label>
          <select value={unit} onChange={e => setUnit(e.target.value as "metric" | "imperial")} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" data-testid="select-unit">
            <option value="metric">{t("pages.clinicalCalculators.metricKgCm")}</option>
            <option value="imperial">{t("pages.clinicalCalculators.imperialLbsInches")}</option>
          </select>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField label={t("pages.clinicalCalculators.height2")} value={height} onChange={setHeight} unit={unit === "metric" ? "cm" : "in"} placeholder={unit === "metric" ? "170" : "67"} id="bmi-height" />
          <InputField label={t("pages.clinicalCalculators.weight2")} value={weight} onChange={setWeight} unit={unit === "metric" ? "kg" : "lbs"} placeholder={unit === "metric" ? "70" : "154"} id="bmi-weight" />
        </div>
        {hasResult && bmi !== null && (
          <div className="mt-6">
            <ResultBox label={`BMI — ${category}`} value={bmi.toFixed(1)} interpretation={interpretation} color={color} />
          </div>
        )}
        <ClinicalNote>
          <strong>{t("pages.clinicalCalculators.formula4")}</strong> Metric: BMI = weight (kg) ÷ height² (m²). Imperial: BMI = (weight (lbs) × 703) ÷ height² (in²). BMI does not distinguish between muscle and fat mass — interpret alongside waist circumference and clinical assessment.
        </ClinicalNote>
        <ExamTip>
          <strong>{t("pages.clinicalCalculators.examTip3")}</strong> BMI is commonly tested in community health and wellness questions. Know the WHO categories and associated health risks. Remember: BMI alone is insufficient for nutritional assessment — always combine with clinical findings, lab values, and dietary history.
        </ExamTip>
      </div>
    </CalculatorPageWrapper>
  );
}

function CalculatorRouter() {
  const [, params] = useRoute("/clinical-calculators/:slug");
  const slug = params?.slug;

  if (!slug) return <ClinicalCalculatorsHub />;

  switch (slug) {
    case "anion-gap": return <AnionGapCalculator />;
    case "iv-drip-rate": return <IVDripRateCalculator />;
    case "body-surface-area": return <BSACalculator />;
    case "pediatric-dose": return <PediatricDoseCalculator />;
    case "abg-interpretation": return <ABGCalculator />;
    case "gfr-calculator": return <GFRCalculator />;
    case "bmi-calculator": return <BMICalculator />;
    default: return <ClinicalCalculatorsHub />;
  }
}

export default function ClinicalCalculatorsPage() {
  return <CalculatorRouter />;
}

export { ClinicalCalculatorsHub };
