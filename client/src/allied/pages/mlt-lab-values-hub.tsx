import { useState } from "react";
import { Link } from "wouter";
import { AlliedSEO } from "@/allied/allied-seo";
import { mltLabValues } from "@/data/mlt-lab-values";
import { useI18n } from "@/lib/i18n";
import {
  Microscope,
  FlaskConical,
  ArrowRight,
  BookOpen,
  Brain,
  ChevronRight,
  CheckCircle2,
  ChevronDown,
  Search,
  FileText,
  ClipboardList,
  HelpCircle,
} from "lucide-react";

function FAQAccordion({ items }: { items: { q: string; a: string }[] }) {
  const { t } = useI18n();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <div className="space-y-3" data-testid="faq-accordion">
      {items.map((item, i) => (
        <div key={i} className="border border-gray-200 rounded-lg overflow-hidden" data-testid={`faq-item-${i}`}>
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
            data-testid={`faq-toggle-${i}`}
          >
            <span className="font-medium text-gray-800 text-sm pr-4">{item.q}</span>
            <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${openIndex === i ? "rotate-180" : ""}`} />
          </button>
          {openIndex === i && (
            <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">{item.a}</div>
          )}
        </div>
      ))}
    </div>
  );
}

const HUB_FAQS = [
  { q: "What lab values should I memorize for the MLT exam?", a: "Focus on electrolytes (sodium, potassium, calcium, magnesium), renal function (BUN, creatinine), CBC components (hemoglobin, WBC, platelets), glucose/A1C, ABG values (pH, PaCO₂, HCO₃⁻), and cardiac biomarkers (troponin). Know both SI and conventional units, critical values, and common interferences." },
  { q: "What is the difference between SI and conventional lab units?", a: "SI (Système International) units are used in Canada and most of the world (mmol/L, µmol/L, g/L). Conventional units are used in the United States (mEq/L, mg/dL, g/dL). The CSMLS exam uses SI units; the ASCP exam uses conventional units. Our pages display both systems with a toggle." },
  { q: "How do I study lab values for the CSMLS exam?", a: "Focus on SI unit reference ranges, critical values, specimen requirements, analytical methods (ISE, spectrophotometry, HPLC), and common pre-analytical errors (hemolysis, lipemia, wrong tube type). Use our practice questions to test your knowledge with exam-authentic scenarios." },
  { q: "How do I study lab values for the ASCP exam?", a: "Focus on conventional unit reference ranges, clinical correlations, analytical methods, quality control (Westgard rules), and troubleshooting. The ASCP tests your ability to interpret results in clinical context and identify sources of analytical error." },
  { q: "What are critical values and why are they important for MLT?", a: "Critical values are lab results so abnormal they represent a life-threatening condition requiring immediate clinical action. Laboratory technologists must verify critical results and notify the ordering physician within a defined timeframe (usually 30 minutes). Failure to report critical values is a serious quality/patient safety issue." },
  { q: "What pre-analytical errors affect lab values most commonly?", a: "Hemolysis (falsely elevates K⁺, LDH, AST, Mg²⁺), lipemia (turbidity interference with spectrophotometric assays), wrong tube type (EDTA chelates calcium; fluoride inhibits glycolysis for glucose), and delayed processing (glycolysis decreases glucose ~5-7%/hour)." },
];

export function MltLabValuesHub() {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = mltLabValues.filter(
    (lv) =>
      lv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lv.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lv.discipline.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const disciplines = [...new Set(mltLabValues.map((lv) => lv.discipline))];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: HUB_FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "MLT Lab Values Reference — Normal Ranges for CSMLS & ASCP Exams",
    description: "Complete lab values reference for Medical Laboratory Technologists. Normal ranges in SI and conventional units, critical values, clinical significance, and practice questions.",
    url: "https://www.nursenest.ca/allied-health/mlt/lab-values",
    publisher: { "@type": "Organization", name: "NurseNest Allied" },
    hasPart: mltLabValues.map((lv) => ({
      "@type": "Article",
      name: lv.h1Title,
      url: `https://www.nursenest.ca/allied-health/mlt/lab-values/${lv.slug}`,
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Allied Health", item: "https://www.nursenest.ca/allied-health" },
      { "@type": "ListItem", position: 2, name: "MLT", item: "https://www.nursenest.ca/allied-health/mlt" },
      { "@type": "ListItem", position: 3, name: "Lab Values", item: "https://www.nursenest.ca/allied-health/mlt/lab-values" },
    ],
  };

  return (
    <>
      <AlliedSEO
        title={t("allied.mltLabValuesHub.normalLabValuesForMlt")}
        description={t("allied.mltLabValuesHub.completeLabValuesReferenceFor")}
        keywords="normal lab values MLT, lab values chart MLT exam, CSMLS lab values SI units, ASCP lab values conventional units, MLT reference ranges, clinical chemistry lab values"
        canonicalPath="/allied-health/mlt/lab-values"
        structuredData={collectionPageSchema}
        additionalStructuredData={[faqSchema, breadcrumbSchema]}
      />

      <div className="max-w-5xl mx-auto px-4 py-8" data-testid="mlt-lab-values-hub">
        <nav aria-label={t("allied.mltLabValuesHub.breadcrumb")} className="text-sm text-gray-500 mb-6" data-testid="breadcrumbs">
          <ol className="flex flex-wrap items-center gap-1">
            <li><Link href="/allied-health" className="hover:text-purple-600">{t("allied.mltLabValuesHub.alliedHealth")}</Link></li>
            <li><ChevronRight className="w-3 h-3 inline" /></li>
            <li><Link href="/allied-health/mlt" className="hover:text-purple-600">MLT</Link></li>
            <li><ChevronRight className="w-3 h-3 inline" /></li>
            <li className="text-gray-800 font-medium">{t("allied.mltLabValuesHub.labValues")}</li>
          </ol>
        </nav>

        <section className="text-center py-12" data-testid="hub-hero">
          <div className="flex items-center justify-center gap-2 text-sm text-purple-600 font-medium mb-4">
            <Microscope className="w-4 h-4" />
            <span>{t("allied.mltLabValuesHub.mltExamPrepCsmlsAscp")}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight" data-testid="hub-h1">
            Normal Lab Values for MLT Exam
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6 leading-relaxed">
            Complete reference for every lab value tested on the CSMLS and ASCP certification exams. Each page includes normal ranges in both SI and conventional units, critical values, analytical methods, clinical significance, pre-analytical considerations, and embedded practice questions with detailed rationales.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            <Link
              href="/allied-health/mlt/lab-values/complete-chart"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200"
              data-testid="cta-complete-chart"
            >
              Complete Lab Values Chart <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/allied-health/mlt/lab-values/top-50"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-700 border border-purple-200 rounded-xl font-semibold hover:bg-purple-50 transition-colors"
              data-testid="cta-top-50"
            >
              Top 50 Must-Know Lab Values
            </Link>
          </div>
        </section>

        <section className="mb-8" data-testid="hub-search">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={t("allied.mltLabValuesHub.searchLabValues")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-300"
              data-testid="input-search"
            />
          </div>
        </section>

        <section className="mb-8" data-testid="hub-feature-badges">
          <div className="flex flex-wrap justify-center gap-3">
            {["SI & Conventional Units", "Critical Values", "Practice Questions", "Pre-Analytical Considerations", "Analytical Methods", "Exam Tips"].map((feat) => (
              <div key={feat} className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-xs font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {feat}
              </div>
            ))}
          </div>
        </section>

        {disciplines.map((discipline) => {
          const labs = filtered.filter((lv) => lv.discipline === discipline);
          if (labs.length === 0) return null;
          return (
            <section key={discipline} className="mb-10" data-testid={`discipline-${discipline.toLowerCase().replace(/\s+/g, "-")}`}>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-purple-500" />
                {discipline}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {labs.map((lv) => (
                  <Link
                    key={lv.slug}
                    href={`/allied-health/mlt/lab-values/${lv.slug}`}
                    className="group bg-white rounded-xl border border-gray-100 p-5 hover:border-purple-200 hover:shadow-md transition-all"
                    data-testid={`card-lab-${lv.slug}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">{lv.name}</h3>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-purple-500 flex-shrink-0 mt-1" />
                    </div>
                    <p className="text-xs text-gray-500 mb-3">{lv.fullName}</p>
                    <div className="flex flex-col gap-1.5">
                      <div className="text-xs">
                        <span className="text-gray-400 font-medium">{t("allied.mltLabValuesHub.si")} </span>
                        <span className="text-emerald-700 font-medium">{lv.normalRange.si.value} {lv.normalRange.si.unit}</span>
                      </div>
                      <div className="text-xs">
                        <span className="text-gray-400 font-medium">{t("allied.mltLabValuesHub.us")} </span>
                        <span className="text-blue-700 font-medium">{lv.normalRange.conventional.value} {lv.normalRange.conventional.unit}</span>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                      <Brain className="w-3 h-3" />
                      {lv.practiceQuestions.length} practice questions
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500" data-testid="no-results">
            <p>{t("allied.mltLabValuesHub.noLabValuesMatchYour")}</p>
          </div>
        )}

        <section className="py-12" data-testid="hub-content">
          <div className="bg-white rounded-xl border border-gray-100 p-8 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t("allied.mltLabValuesHub.whyLabValuesMatterFor")}</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Lab values are among the most heavily tested topics on both the CSMLS and ASCP certification exams. As a Medical Laboratory Technologist, you must know normal reference ranges, critical values, specimen requirements, analytical methods, and pre-analytical variables that affect results. Understanding the clinical significance of abnormal results — and knowing when to call a critical value — is essential for patient safety and exam success.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our lab value pages are designed specifically for MLT exam preparation, covering both the laboratory science (analytical methods, quality control, interferences) and clinical correlation (associated conditions, differential diagnosis) that certification exams test. Every page includes practice questions with detailed rationales to help you apply your knowledge in exam-authentic scenarios.
            </p>
          </div>
        </section>

        <section className="py-8" data-testid="hub-internal-links">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{t("allied.mltLabValuesHub.continueStudying")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Link href="/allied-health/mlt/lab-values/complete-chart" className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all" data-testid="link-chart">
              <ClipboardList className="w-5 h-5 text-purple-500 flex-shrink-0" />
              <div>
                <div className="font-medium text-gray-900 text-sm">{t("allied.mltLabValuesHub.completeLabChart")}</div>
                <div className="text-xs text-gray-500">{t("allied.mltLabValuesHub.allValuesInOneView")}</div>
              </div>
            </Link>
            <Link href="/allied-health/mlt/lab-values/top-50" className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all" data-testid="link-top50">
              <BookOpen className="w-5 h-5 text-purple-500 flex-shrink-0" />
              <div>
                <div className="font-medium text-gray-900 text-sm">{t("allied.mltLabValuesHub.top50LabValues")}</div>
                <div className="text-xs text-gray-500">{t("allied.mltLabValuesHub.mustknowForYourExam")}</div>
              </div>
            </Link>
            <Link href="/allied-health/mlt/questions" className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all" data-testid="link-questions">
              <Brain className="w-5 h-5 text-purple-500 flex-shrink-0" />
              <div>
                <div className="font-medium text-gray-900 text-sm">{t("allied.mltLabValuesHub.mltQuestionBank")}</div>
                <div className="text-xs text-gray-500">{t("allied.mltLabValuesHub.1000PracticeQuestions")}</div>
              </div>
            </Link>
            <Link href="/allied-health/mlt/exams" className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all" data-testid="link-exams">
              <FileText className="w-5 h-5 text-purple-500 flex-shrink-0" />
              <div>
                <div className="font-medium text-gray-900 text-sm">{t("allied.mltLabValuesHub.practiceExams")}</div>
                <div className="text-xs text-gray-500">{t("allied.mltLabValuesHub.csmlsAscpMockExams")}</div>
              </div>
            </Link>
          </div>
        </section>

        <section className="py-8" data-testid="hub-faq">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-purple-500" />
            Lab Values FAQ
          </h2>
          <FAQAccordion items={HUB_FAQS} />
        </section>
      </div>
    </>
  );
}
