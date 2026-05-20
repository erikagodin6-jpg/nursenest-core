import { useState, useMemo } from "react";
import { Navigation } from "@/components/navigation";
import { SEO } from "@/components/seo";
import { AdminEditButton } from "@/components/admin-edit-button";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  ArrowRightLeft,
  Calculator,
  FlaskConical,
  Heart,
  Ruler,
  Beaker,
  RotateCcw,
  Info,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Stethoscope,
  GraduationCap,
} from "lucide-react";
import { LocaleLink } from "@/lib/LocaleLink";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { useI18n } from "@/lib/i18n";
import {
  conversionEntries,
  convertValue,
  formatResult,
  categoryLabels,
  quickReferenceEntries,
  type ConversionEntry,
  type ConversionDirection,
} from "@/lib/unit-conversions";

const categoryIcons: Record<string, any> = {
  "blood-chemistry": FlaskConical,
  "lipids": Heart,
  "hematology": Beaker,
  "physical": Ruler,
  "other": Calculator,
};

const categories = Object.keys(categoryLabels);

function ConverterCard({ entry }: { entry: ConversionEntry }) {
  const { t } = useI18n();
  const [inputValue, setInputValue] = useState("");
  const [direction, setDirection] = useState<ConversionDirection>("si-to-conv");
  const [showPrecise, setShowPrecise] = useState(false);

  const result = useMemo(() => {
    const val = parseFloat(inputValue);
    if (isNaN(val) || inputValue.trim() === "") return null;
    const converted = convertValue(entry, val, direction);
    return formatResult(converted);
  }, [inputValue, direction, entry]);

  const fromUnit = direction === "si-to-conv" ? entry.siUnit : entry.conventionalUnit;
  const toUnit = direction === "si-to-conv" ? entry.conventionalUnit : entry.siUnit;
  const fromLabel = direction === "si-to-conv" ? "SI" : "Conventional";
  const toLabel = direction === "si-to-conv" ? "Conventional" : "SI";

  return (
    <Card className="border border-gray-200 hover:border-primary/30 transition-colors" data-testid={`card-converter-${entry.id}`}>
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900 text-sm sm:text-base" data-testid={`text-converter-name-${entry.id}`}>{entry.name}</h3>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs text-gray-500 hover:text-primary"
            onClick={() => {
              setDirection(d => d === "si-to-conv" ? "conv-to-si" : "si-to-conv");
              setInputValue("");
            }}
            data-testid={`button-toggle-direction-${entry.id}`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5 mr-1" />
            Swap
          </Button>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1">
            <label htmlFor={`input-${entry.id}`} className="text-xs text-gray-500 mb-1 block">{fromLabel} ({fromUnit})</label>
            <Input
              id={`input-${entry.id}`}
              type="number"
              step="any"
              placeholder={`Enter ${fromUnit}`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="h-9 text-sm"
              data-testid={`input-value-${entry.id}`}
            />
          </div>
          <ArrowRightLeft className="w-4 h-4 text-gray-300 mt-5 flex-shrink-0" />
          <div className="flex-1">
            <label id={`result-label-${entry.id}`} className="text-xs text-gray-500 mb-1 block">{toLabel} ({toUnit})</label>
            <div
              className={`h-9 rounded-md border px-3 flex items-center text-sm font-medium ${
                result ? "bg-primary/5 border-primary/20 text-gray-900" : "bg-gray-50 border-gray-200 text-gray-400"
              }`}
              data-testid={`text-result-${entry.id}`}
            >
              {result ? (
                <span>
                  {result.rounded} {toUnit}
                  {showPrecise && (
                    <span className="text-xs text-gray-400 ml-1">({result.precise})</span>
                  )}
                </span>
              ) : (
                "—"
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {result && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-[10px] text-gray-400 hover:text-gray-600"
                onClick={() => setShowPrecise(!showPrecise)}
                data-testid={`button-precise-${entry.id}`}
              >
                {showPrecise ? "Hide precise" : "Show precise"}
              </Button>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-[10px] text-gray-400 hover:text-gray-600"
            onClick={() => { setInputValue(""); setShowPrecise(false); }}
            data-testid={`button-reset-${entry.id}`}
          >
            <RotateCcw className="w-3 h-3 mr-1" />
            Reset
          </Button>
        </div>

        {entry.formula && (
          <div className="mt-2 text-[11px] text-gray-400 bg-gray-50 rounded px-2 py-1.5">
            <strong>{t("pages.siConventionalConverter.formula")}</strong> {entry.formula}
          </div>
        )}

        {(entry.siNormalRange || entry.conventionalNormalRange) && (
          <div className="mt-2 text-[11px] text-gray-500 flex flex-wrap gap-x-4">
            {entry.siNormalRange && <span>SI normal: {entry.siNormalRange} {entry.siUnit}</span>}
            {entry.conventionalNormalRange && <span>Conv. normal: {entry.conventionalNormalRange} {entry.conventionalUnit}</span>}
          </div>
        )}

        {entry.notes && (
          <p className="mt-2 text-[11px] text-gray-400 leading-relaxed">{entry.notes}</p>
        )}
      </CardContent>
    </Card>
  );
}

function QuickReferenceTable() {
  const entries = conversionEntries.filter(e => quickReferenceEntries.includes(e.id));

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse" data-testid="table-quick-reference">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-2 px-3 font-semibold text-gray-700">{t("pages.siConventionalConverter.analyte")}</th>
            <th className="text-left py-2 px-3 font-semibold text-gray-700">{t("pages.siConventionalConverter.siUnit")}</th>
            <th className="text-left py-2 px-3 font-semibold text-gray-700">{t("pages.siConventionalConverter.siNormal")}</th>
            <th className="text-left py-2 px-3 font-semibold text-gray-700">{t("pages.siConventionalConverter.convUnit")}</th>
            <th className="text-left py-2 px-3 font-semibold text-gray-700">{t("pages.siConventionalConverter.convNormal")}</th>
            <th className="text-left py-2 px-3 font-semibold text-gray-700">{t("pages.siConventionalConverter.factor")}</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e, i) => (
            <tr key={e.id} className={i % 2 === 0 ? "bg-gray-50/50" : ""} data-testid={`row-reference-${e.id}`}>
              <td className="py-2 px-3 font-medium text-gray-800">{e.name}</td>
              <td className="py-2 px-3 text-gray-600">{e.siUnit}</td>
              <td className="py-2 px-3 text-gray-600">{e.siNormalRange || "—"}</td>
              <td className="py-2 px-3 text-gray-600">{e.conventionalUnit}</td>
              <td className="py-2 px-3 text-gray-600">{e.conventionalNormalRange || "—"}</td>
              <td className="py-2 px-3 text-gray-500 text-xs">
                {e.id === "temperature" ? "Special" : e.id === "urea-bun" ? "×2.801 / ×0.357" : e.id === "creatinine" ? "÷88.42" : e.id === "bilirubin" ? "÷17.1" : e.id === "hemoglobin" ? "÷10" : `×${e.factor}`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is the difference between SI units and conventional units?",
      answer: "SI (Système International) units are the standard measurement system used in most countries, including Canada, for reporting lab values. Conventional units are used primarily in the United States. For example, blood glucose is reported in mmol/L (SI) in Canada and mg/dL (conventional) in the U.S. The underlying measurement is the same — only the units of expression differ.",
    },
    {
      question: "Why do nursing students need to know both unit systems?",
      answer: "Nursing students — especially those studying for NCLEX, REx-PN, or practicing across borders — encounter both systems. NCLEX questions may use either unit system. Canadian students trained with SI units must recognize conventional values in U.S. textbooks, and vice versa. Understanding both systems prevents medication errors and improves clinical reasoning.",
    },
    {
      question: "Is the urea/BUN conversion just a simple multiplication?",
      answer: "No. In SI, the lab measures urea (the whole molecule, mmol/L). In conventional U.S. labs, they measure blood urea nitrogen (BUN) — only the nitrogen portion (mg/dL). Because the molecular weights differ, the conversion factor is 2.801 (urea mmol/L × 2.801 = BUN mg/dL). This is one of the most commonly confused conversions.",
    },
    {
      question: "Are sodium, potassium, and chloride different between SI and conventional?",
      answer: "No. Electrolytes like sodium (Na⁺), potassium (K⁺), and chloride (Cl⁻) use the same units (mEq/L or mmol/L) in both systems, so no conversion is necessary. This is why they are not included as calculator entries — including them would imply a false conversion.",
    },
    {
      question: "Can I use this converter for clinical decision-making?",
      answer: "This converter is designed as an educational study tool for nursing students. While the conversion factors are accurate and based on standard references, always verify values using your institution's lab reference ranges and clinical decision support tools in actual clinical practice. Lab normal ranges can vary between institutions and patient populations.",
    },
    {
      question: "What is the temperature conversion formula?",
      answer: "To convert Celsius to Fahrenheit: °F = (°C × 9/5) + 32. To convert Fahrenheit to Celsius: °C = (°F − 32) × 5/9. Key clinical thresholds: fever ≥38.0°C (100.4°F), hypothermia <35.0°C (95.0°F).",
    },
    {
      question: "How do I convert between kg and lb for medication dosing?",
      answer: "Multiply kg by 2.2046 to get pounds, or divide pounds by 2.2046 to get kg. For clinical nursing, the approximation of 1 kg ≈ 2.2 lb is commonly used. Accurate weight conversion is critical for weight-based dosing (e.g., mg/kg) of medications like heparin, vancomycin, and pediatric drugs.",
    },
  ];

  return (
    <div className="space-y-2" data-testid="section-faq">
      {faqs.map((faq, i) => (
        <div
          key={i}
          className="border border-gray-200 rounded-lg overflow-hidden"
          data-testid={`faq-item-${i}`}
        >
          <button
            className="w-full text-left p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            data-testid={`button-faq-${i}`}
          >
            <span className="font-medium text-gray-800 text-sm pr-4">{faq.question}</span>
            {openIndex === i ? (
              <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
            )}
          </button>
          {openIndex === i && (
            <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function SIConventionalConverterPage() {
  const [activeTab, setActiveTab] = useState(categories[0]);

  const entriesByCategory = useMemo(() => {
    const grouped: Record<string, ConversionEntry[]> = {};
    for (const cat of categories) {
      grouped[cat] = conversionEntries.filter(e => e.category === cat);
    }
    return grouped;
  }, []);

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the difference between SI units and conventional units?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "SI (Système International) units are the standard measurement system used in most countries, including Canada, for reporting lab values. Conventional units are used primarily in the United States. For example, blood glucose is reported in mmol/L (SI) in Canada and mg/dL (conventional) in the U.S.",
        },
      },
      {
        "@type": "Question",
        name: "Why do nursing students need to know both unit systems?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Nursing students studying for NCLEX, REx-PN, or practicing across borders encounter both systems. NCLEX questions may use either unit system. Understanding both systems prevents medication errors and improves clinical reasoning.",
        },
      },
      {
        "@type": "Question",
        name: "Is the urea/BUN conversion just a simple multiplication?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. In SI, the lab measures urea (mmol/L). In conventional U.S. labs, they measure blood urea nitrogen (BUN) in mg/dL. The conversion factor is 2.801 (urea mmol/L × 2.801 = BUN mg/dL) because the molecular weights differ.",
        },
      },
      {
        "@type": "Question",
        name: "Are sodium, potassium, and chloride different between SI and conventional?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Electrolytes like sodium (Na+), potassium (K+), and chloride (Cl-) use the same units (mEq/L or mmol/L) in both systems, so no conversion is necessary.",
        },
      },
      {
        "@type": "Question",
        name: "Can I use this converter for clinical decision-making?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "This converter is designed as an educational study tool for nursing students. While the conversion factors are accurate, always verify values using your institution's lab reference ranges in actual clinical practice.",
        },
      },
      {
        "@type": "Question",
        name: "What is the temperature conversion formula?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "To convert Celsius to Fahrenheit: °F = (°C × 9/5) + 32. To convert Fahrenheit to Celsius: °C = (°F − 32) × 5/9. Key clinical thresholds: fever ≥38.0°C (100.4°F), hypothermia <35.0°C (95.0°F).",
        },
      },
      {
        "@type": "Question",
        name: "How do I convert between kg and lb for medication dosing?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Multiply kg by 2.2046 to get pounds, or divide pounds by 2.2046 to get kg. Accurate weight conversion is critical for weight-based dosing of medications like heparin, vancomycin, and pediatric drugs.",
        },
      },
    ],
  };

  const medicalWebPageData = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: "SI to Conventional Units Nursing Converter",
    description: "Free interactive converter between SI (Canadian) and conventional (U.S.) units for common lab values and clinical measurements. Study tool for nursing students preparing for NCLEX, REx-PN, and cross-border practice.",
    url: "https://www.nursenest.ca/en/si-to-conventional-units-converter",
    audience: {
      "@type": "MedicalAudience",
      audienceType: "Nursing Students",
    },
    medicalAudience: {
      "@type": "MedicalAudience",
      audienceType: "Clinician",
    },
    about: [
      { "@type": "MedicalEntity", name: "Clinical Laboratory Techniques" },
      { "@type": "MedicalEntity", name: "Unit Conversion" },
    ],
    publisher: {
      "@type": "Organization",
      name: "NurseNest",
      url: "https://www.nursenest.ca",
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--theme-gradient-from)] to-[var(--theme-gradient-to)]">
      <SEO
        title={t("pages.siConventionalConverter.siToConventionalUnitsConverter")}
        description={t("pages.siConventionalConverter.freeNursingUnitConverterConvert")}
        keywords="SI to conventional units nursing, glucose mmol/L to mg/dL, Canadian to American lab values, nursing unit converter, lab value conversion, NCLEX units, SI units nursing, conventional units nursing"
        canonicalPath="/si-to-conventional-units-converter"
        structuredData={medicalWebPageData}
        additionalStructuredData={[faqStructuredData]}
      />
      <Navigation />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <BreadcrumbNav />

        <div className="space-y-2 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <ArrowRightLeft className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900" data-testid="text-page-title">
                SI ↔ Conventional Units Converter
              </h1>
              <p className="text-gray-500 mt-1">{t("pages.siConventionalConverter.convertBetweenCanadianSiUnits")}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-primary/5 border border-primary/15 rounded-xl px-4 py-3 hover:bg-primary/10 transition-colors mt-4">
            <GraduationCap className="w-5 h-5 text-primary flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900">{t("pages.siConventionalConverter.freeStudyToolForNursing")}</p>
              <p className="text-xs text-gray-500">{t("pages.siConventionalConverter.rpnRnNpNclexRexpn")}</p>
            </div>
          </div>
        </div>

        <section className="mb-10" data-testid="section-calculator">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-primary" />
            Interactive Calculator
          </h2>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" data-testid="tabs-converter">
            <TabsList className="grid w-full grid-cols-5 h-11 mb-6">
              {categories.map(cat => {
                const Icon = categoryIcons[cat] || Calculator;
                return (
                  <TabsTrigger key={cat} value={cat} className="gap-1 text-[10px] sm:text-xs" data-testid={`tab-${cat}`}>
                    <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">{categoryLabels[cat]}</span>
                    <span className="sm:hidden">{categoryLabels[cat].split(" ")[0]}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {categories.map(cat => (
              <TabsContent key={cat} value={cat}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {entriesByCategory[cat].map(entry => (
                    <ConverterCard key={entry.id} entry={entry} />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </section>

        <section className="mb-10" data-testid="section-quick-reference">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-primary" />
            Quick Reference Table
          </h2>
          <Card className="border border-gray-200">
            <CardContent className="p-0 sm:p-2">
              <QuickReferenceTable />
            </CardContent>
          </Card>
          <p className="text-xs text-gray-400 mt-2">
            Note: Electrolytes (Na⁺, K⁺, Cl⁻, HCO₃⁻) use the same units (mEq/L or mmol/L) in both systems and are not listed as conversions.
          </p>
        </section>

        <section className="mb-10 space-y-6" data-testid="section-educational">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Understanding SI vs. Conventional Units
          </h2>

          <Card className="border border-gray-200">
            <CardContent className="p-5 space-y-4">
              <h3 className="font-semibold text-gray-900">{t("pages.siConventionalConverter.whatAreSiAndConventional")}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                The <strong>{t("pages.siConventionalConverter.internationalSystemOfUnitsSi")}</strong> is the globally standardized measurement system adopted by most countries — including Canada, the UK, Australia, and much of Europe — for clinical laboratory reporting. SI units typically express substance concentration in moles per liter (e.g., mmol/L, µmol/L).
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                <strong>{t("pages.siConventionalConverter.conventionalUnits")}</strong> (also called traditional or U.S. customary units) express concentration as mass per volume (e.g., mg/dL, g/dL). These are the primary system used in the United States. Each analyte has its own conversion factor based on molecular weight.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-gray-200">
            <CardContent className="p-5 space-y-4">
              <h3 className="font-semibold text-gray-900">{t("pages.siConventionalConverter.whyThisMattersForNursing")}</h3>
              <ul className="text-sm text-gray-600 space-y-3">
                <li className="flex items-start gap-2">
                  <Stethoscope className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span><strong>{t("pages.siConventionalConverter.nclexRexpnExams")}</strong> {t("pages.siConventionalConverter.mayPresentLabValuesIn")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRightLeft className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span><strong>{t("pages.siConventionalConverter.crossborderPractice")}</strong> {t("pages.siConventionalConverter.canadianNursesWorkingInThe")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <BookOpen className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span><strong>{t("pages.siConventionalConverter.textbookLiteracy")}</strong> {t("pages.siConventionalConverter.manyNursingTextbooksEspeciallyUspublished")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <span><strong>{t("pages.siConventionalConverter.patientSafety")}</strong> {t("pages.siConventionalConverter.misinterpretingAGlucoseOf10")}</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border border-gray-200">
            <CardContent className="p-5 space-y-4">
              <h3 className="font-semibold text-gray-900">{t("pages.siConventionalConverter.commonNursingExamples")}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="bg-blue-50/50 rounded-lg p-3 space-y-1">
                  <p className="font-medium text-gray-800">{t("pages.siConventionalConverter.glucoseCheck")}</p>
                  <p>Patient glucose: <strong>8.5 mmol/L</strong></p>
                  <p>Converted: 8.5 × 18 = <strong>{t("pages.siConventionalConverter.153Mgdl")}</strong></p>
                  <p className="text-xs text-gray-500">{t("pages.siConventionalConverter.aboveFastingNormalAssessFor")}</p>
                </div>
                <div className="bg-green-50/50 rounded-lg p-3 space-y-1">
                  <p className="font-medium text-gray-800">{t("pages.siConventionalConverter.hemoglobinAssessment")}</p>
                  <p>Patient Hgb: <strong>95 g/L</strong></p>
                  <p>Converted: 95 ÷ 10 = <strong>9.5 g/dL</strong></p>
                  <p className="text-xs text-gray-500">{t("pages.siConventionalConverter.belowNormalAssessForAnemia")}</p>
                </div>
                <div className="bg-amber-50/50 rounded-lg p-3 space-y-1">
                  <p className="font-medium text-gray-800">{t("pages.siConventionalConverter.creatinineEvaluation")}</p>
                  <p>Patient creatinine: <strong>{t("pages.siConventionalConverter.150Moll")}</strong></p>
                  <p>Converted: 150 ÷ 88.42 = <strong>1.7 mg/dL</strong></p>
                  <p className="text-xs text-gray-500">{t("pages.siConventionalConverter.elevatedAssessRenalFunctionAnd")}</p>
                </div>
                <div className="bg-purple-50/50 rounded-lg p-3 space-y-1">
                  <p className="font-medium text-gray-800">{t("pages.siConventionalConverter.temperatureAssessment")}</p>
                  <p>Patient temp: <strong>38.5°C</strong></p>
                  <p>Converted: (38.5 × 9/5) + 32 = <strong>101.3°F</strong></p>
                  <p className="text-xs text-gray-500">{t("pages.siConventionalConverter.feverImplementFeverManagementProtocol")}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-amber-200 bg-amber-50/30">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{t("pages.siConventionalConverter.safetyNote")}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    This converter is an <strong>{t("pages.siConventionalConverter.educationalStudyTool")}</strong> for nursing students. While all conversion factors are based on standard clinical references, always verify critical lab values against your institution's reference ranges before making clinical decisions. Normal ranges may vary between laboratories, testing methods, and patient populations. Never substitute this tool for institutional clinical decision support systems in patient care settings.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="mb-10" data-testid="section-faq-wrapper">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-primary" />
            Frequently Asked Questions
          </h2>
          <FAQSection />
        </section>

        <section className="mb-10" data-testid="section-conversion-guides">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            In-Depth Conversion Guides
          </h2>
          <p className="text-sm text-gray-500 mb-4">{t("pages.siConventionalConverter.exploreDetailedEducationalGuidesFor")}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <LocaleLink href="/canadian-vs-american-lab-values">
              <Card className="border border-gray-200 hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer group h-full" data-testid="link-guide-canadian-vs-american">
                <CardContent className="p-4 flex items-center gap-3">
                  <FlaskConical className="w-7 h-7 text-primary/70 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm group-hover:text-primary transition-colors">{t("pages.siConventionalConverter.canadianVsAmericanLabValues")}</p>
                    <p className="text-xs text-gray-500">{t("pages.siConventionalConverter.siVsConventionalUnitsWhy")}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                </CardContent>
              </Card>
            </LocaleLink>
            <LocaleLink href="/glucose-mmol-l-to-mg-dl">
              <Card className="border border-gray-200 hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer group h-full" data-testid="link-guide-glucose">
                <CardContent className="p-4 flex items-center gap-3">
                  <FlaskConical className="w-7 h-7 text-primary/70 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm group-hover:text-primary transition-colors">{t("pages.siConventionalConverter.glucoseMmollMgdl")}</p>
                    <p className="text-xs text-gray-500">{t("pages.siConventionalConverter.bloodSugarConversionWithDiabetes")}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                </CardContent>
              </Card>
            </LocaleLink>
            <LocaleLink href="/creatinine-umol-l-to-mg-dl">
              <Card className="border border-gray-200 hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer group h-full" data-testid="link-guide-creatinine">
                <CardContent className="p-4 flex items-center gap-3">
                  <FlaskConical className="w-7 h-7 text-primary/70 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm group-hover:text-primary transition-colors">{t("pages.siConventionalConverter.creatinineMollMgdl")}</p>
                    <p className="text-xs text-gray-500">{t("pages.siConventionalConverter.renalFunctionContextWithCkd")}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                </CardContent>
              </Card>
            </LocaleLink>
            <LocaleLink href="/hemoglobin-g-l-to-g-dl">
              <Card className="border border-gray-200 hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer group h-full" data-testid="link-guide-hemoglobin">
                <CardContent className="p-4 flex items-center gap-3">
                  <FlaskConical className="w-7 h-7 text-primary/70 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm group-hover:text-primary transition-colors">{t("pages.siConventionalConverter.hemoglobinGlGdl")}</p>
                    <p className="text-xs text-gray-500">{t("pages.siConventionalConverter.anemiaClassificationAndTransfusionThresholds")}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                </CardContent>
              </Card>
            </LocaleLink>
            <LocaleLink href="/bilirubin-umol-l-to-mg-dl">
              <Card className="border border-gray-200 hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer group h-full" data-testid="link-guide-bilirubin">
                <CardContent className="p-4 flex items-center gap-3">
                  <FlaskConical className="w-7 h-7 text-primary/70 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm group-hover:text-primary transition-colors">{t("pages.siConventionalConverter.bilirubinMollMgdl")}</p>
                    <p className="text-xs text-gray-500">{t("pages.siConventionalConverter.liverFunctionAndNeonatalJaundice")}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                </CardContent>
              </Card>
            </LocaleLink>
            <LocaleLink href="/calcium-mmol-l-to-mg-dl">
              <Card className="border border-gray-200 hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer group h-full" data-testid="link-guide-calcium">
                <CardContent className="p-4 flex items-center gap-3">
                  <FlaskConical className="w-7 h-7 text-primary/70 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm group-hover:text-primary transition-colors">{t("pages.siConventionalConverter.calciumMmollMgdl")}</p>
                    <p className="text-xs text-gray-500">{t("pages.siConventionalConverter.hypohypercalcemiaWithCorrectedCalciumFormula")}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                </CardContent>
              </Card>
            </LocaleLink>
            <LocaleLink href="/urea-to-bun-conversion-nursing">
              <Card className="border border-gray-200 hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer group h-full" data-testid="link-guide-urea-bun">
                <CardContent className="p-4 flex items-center gap-3">
                  <FlaskConical className="w-7 h-7 text-primary/70 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm group-hover:text-primary transition-colors">{t("pages.siConventionalConverter.ureaToBunConversion")}</p>
                    <p className="text-xs text-gray-500">{t("pages.siConventionalConverter.whyItsNotASimple")}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                </CardContent>
              </Card>
            </LocaleLink>
            <LocaleLink href="/cholesterol-triglyceride-unit-conversion">
              <Card className="border border-gray-200 hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer group h-full" data-testid="link-guide-cholesterol">
                <CardContent className="p-4 flex items-center gap-3">
                  <FlaskConical className="w-7 h-7 text-primary/70 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm group-hover:text-primary transition-colors">{t("pages.siConventionalConverter.cholesterolTriglycerideConversion")}</p>
                    <p className="text-xs text-gray-500">{t("pages.siConventionalConverter.lipidPanelConversionsWithCardiovascular")}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                </CardContent>
              </Card>
            </LocaleLink>
            <LocaleLink href="/kg-to-lb-nursing">
              <Card className="border border-gray-200 hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer group h-full" data-testid="link-guide-kg-lb">
                <CardContent className="p-4 flex items-center gap-3">
                  <FlaskConical className="w-7 h-7 text-primary/70 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm group-hover:text-primary transition-colors">{t("pages.siConventionalConverter.kgToLbNursingConversion")}</p>
                    <p className="text-xs text-gray-500">{t("pages.siConventionalConverter.weightbasedMedicationDosingAndSafety")}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                </CardContent>
              </Card>
            </LocaleLink>
            <LocaleLink href="/celsius-to-fahrenheit-nursing">
              <Card className="border border-gray-200 hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer group h-full" data-testid="link-guide-celsius">
                <CardContent className="p-4 flex items-center gap-3">
                  <FlaskConical className="w-7 h-7 text-primary/70 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm group-hover:text-primary transition-colors">{t("pages.siConventionalConverter.cToFNursingConversion")}</p>
                    <p className="text-xs text-gray-500">{t("pages.siConventionalConverter.feverThresholdsHypothermiaClassificationVita")}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                </CardContent>
              </Card>
            </LocaleLink>
          </div>
        </section>

        <section className="mb-10" data-testid="section-related-tools">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <ArrowRight className="w-5 h-5 text-primary" />
            Related Study Tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <LocaleLink href="/med-math">
              <Card className="border border-gray-200 hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer group" data-testid="link-related-med-math">
                <CardContent className="p-4 flex items-center gap-3">
                  <Calculator className="w-8 h-8 text-primary/70 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm group-hover:text-primary transition-colors">{t("pages.siConventionalConverter.medMathDosageCalculations")}</p>
                    <p className="text-xs text-gray-500">{t("pages.siConventionalConverter.practiceDosageIvFlowRate")}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </CardContent>
              </Card>
            </LocaleLink>

            <LocaleLink href="/lab-values">
              <Card className="border border-gray-200 hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer group" data-testid="link-related-lab-values">
                <CardContent className="p-4 flex items-center gap-3">
                  <FlaskConical className="w-8 h-8 text-primary/70 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm group-hover:text-primary transition-colors">{t("pages.siConventionalConverter.labValuesInterpretation")}</p>
                    <p className="text-xs text-gray-500">{t("pages.siConventionalConverter.interpretAbnormalLabClustersWith")}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </CardContent>
              </Card>
            </LocaleLink>

            <LocaleLink href="/medication-mastery">
              <Card className="border border-gray-200 hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer group" data-testid="link-related-pharmacology">
                <CardContent className="p-4 flex items-center gap-3">
                  <Beaker className="w-8 h-8 text-primary/70 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm group-hover:text-primary transition-colors">{t("pages.siConventionalConverter.medicationMasteryPharmacology")}</p>
                    <p className="text-xs text-gray-500">{t("pages.siConventionalConverter.masterDrugClassesInteractionsAnd")}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </CardContent>
              </Card>
            </LocaleLink>

            <LocaleLink href="/free-practice">
              <Card className="border border-gray-200 hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer group" data-testid="link-related-practice">
                <CardContent className="p-4 flex items-center gap-3">
                  <GraduationCap className="w-8 h-8 text-primary/70 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm group-hover:text-primary transition-colors">{t("pages.siConventionalConverter.practiceQuestions")}</p>
                    <p className="text-xs text-gray-500">{t("pages.siConventionalConverter.nclexrnNclexpnAndRexpnStyle")}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </CardContent>
              </Card>
            </LocaleLink>
          </div>
        </section>

        <div className="mt-16 border-t border-gray-200 pt-6">
          <div className="flex items-start gap-2 text-xs text-gray-400 max-w-3xl mx-auto">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-gray-300" />
            <p>
              NurseNest provides independently developed educational content grounded in established physiological principles and widely accepted clinical reasoning frameworks. Not affiliated with or endorsed by any licensing or regulatory authority.
            </p>
          </div>
        </div>
      </main>
      <AdminEditButton />
      <Footer />
    </div>
  );
}
