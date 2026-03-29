import { useState } from "react";
import { Link } from "wouter";
import { AlliedSEO } from "@/allied/allied-seo";
import { mltLabValues } from "@/data/mlt-lab-values";
import { useI18n } from "@/lib/i18n";
import {
  Microscope,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  ChevronDown,
  BookOpen,
  Brain,
  FileText,
  ClipboardList,
  Download,
  Star,
  HelpCircle,
  FlaskConical,
  Lock,
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

const EXTENDED_LAB_VALUES = [
  { name: "Sodium (Na⁺)", si: "136–145 mmol/L", us: "136–145 mEq/L", specimen: "Serum/Plasma", discipline: "Clinical Chemistry", slug: "sodium" },
  { name: "Potassium (K⁺)", si: "3.5–5.0 mmol/L", us: "3.5–5.0 mEq/L", specimen: "Serum (no hemolysis)", discipline: "Clinical Chemistry", slug: "potassium" },
  { name: "Chloride (Cl⁻)", si: "98–106 mmol/L", us: "98–106 mEq/L", specimen: "Serum/Plasma", discipline: "Clinical Chemistry", slug: "" },
  { name: "Bicarbonate (HCO₃⁻)", si: "22–26 mmol/L", us: "22–26 mEq/L", specimen: "Serum/ABG", discipline: "Clinical Chemistry", slug: "abg" },
  { name: "Calcium (Total)", si: "2.15–2.55 mmol/L", us: "8.6–10.2 mg/dL", specimen: "Serum (no EDTA)", discipline: "Clinical Chemistry", slug: "calcium" },
  { name: "Ionized Calcium", si: "1.15–1.30 mmol/L", us: "4.6–5.2 mg/dL", specimen: "Heparinized syringe", discipline: "Clinical Chemistry", slug: "calcium" },
  { name: "Magnesium (Mg²⁺)", si: "0.75–1.05 mmol/L", us: "1.8–2.5 mg/dL", specimen: "Serum", discipline: "Clinical Chemistry", slug: "magnesium" },
  { name: "Phosphorus", si: "0.81–1.45 mmol/L", us: "2.5–4.5 mg/dL", specimen: "Serum (fasting)", discipline: "Clinical Chemistry", slug: "" },
  { name: "Glucose (Fasting)", si: "3.9–5.6 mmol/L", us: "70–100 mg/dL", specimen: "NaF plasma (gray-top)", discipline: "Clinical Chemistry", slug: "glucose" },
  { name: "HbA1c", si: "<39 mmol/mol", us: "<5.7%", specimen: "EDTA whole blood", discipline: "Clinical Chemistry", slug: "a1c" },
  { name: "BUN (Urea)", si: "2.5–7.1 mmol/L", us: "7–20 mg/dL", specimen: "Serum", discipline: "Clinical Chemistry", slug: "bun-creatinine" },
  { name: "Creatinine", si: "62–115 µmol/L (M)", us: "0.7–1.3 mg/dL (M)", specimen: "Serum", discipline: "Clinical Chemistry", slug: "bun-creatinine" },
  { name: "Uric Acid", si: "210–420 µmol/L (M)", us: "3.5–7.0 mg/dL (M)", specimen: "Serum", discipline: "Clinical Chemistry", slug: "" },
  { name: "Total Protein", si: "60–80 g/L", us: "6.0–8.0 g/dL", specimen: "Serum", discipline: "Clinical Chemistry", slug: "" },
  { name: "Albumin", si: "35–50 g/L", us: "3.5–5.0 g/dL", specimen: "Serum", discipline: "Clinical Chemistry", slug: "" },
  { name: "Total Bilirubin", si: "5–21 µmol/L", us: "0.3–1.2 mg/dL", specimen: "Serum (protect from light)", discipline: "Clinical Chemistry", slug: "" },
  { name: "Direct Bilirubin", si: "0–5 µmol/L", us: "0–0.3 mg/dL", specimen: "Serum", discipline: "Clinical Chemistry", slug: "" },
  { name: "AST (SGOT)", si: "10–40 U/L", us: "10–40 U/L", specimen: "Serum", discipline: "Clinical Chemistry", slug: "" },
  { name: "ALT (SGPT)", si: "7–56 U/L", us: "7–56 U/L", specimen: "Serum", discipline: "Clinical Chemistry", slug: "" },
  { name: "ALP", si: "44–147 U/L", us: "44–147 U/L", specimen: "Serum", discipline: "Clinical Chemistry", slug: "" },
  { name: "GGT", si: "9–48 U/L", us: "9–48 U/L", specimen: "Serum", discipline: "Clinical Chemistry", slug: "" },
  { name: "LDH", si: "140–280 U/L", us: "140–280 U/L", specimen: "Serum (no hemolysis)", discipline: "Clinical Chemistry", slug: "" },
  { name: "CK (Total)", si: "30–200 U/L (M)", us: "30–200 U/L (M)", specimen: "Serum", discipline: "Clinical Chemistry", slug: "" },
  { name: "CK-MB", si: "<25 U/L", us: "<25 U/L", specimen: "Serum", discipline: "Clinical Chemistry", slug: "" },
  { name: "Troponin I", si: "<0.04 ng/mL", us: "<0.04 ng/mL", specimen: "Serum/Plasma", discipline: "Clinical Chemistry", slug: "troponin" },
  { name: "BNP", si: "<100 pg/mL", us: "<100 pg/mL", specimen: "EDTA plasma", discipline: "Clinical Chemistry", slug: "" },
  { name: "Amylase", si: "28–100 U/L", us: "28–100 U/L", specimen: "Serum", discipline: "Clinical Chemistry", slug: "" },
  { name: "Lipase", si: "0–160 U/L", us: "0–160 U/L", specimen: "Serum", discipline: "Clinical Chemistry", slug: "" },
  { name: "Total Cholesterol", si: "<5.2 mmol/L", us: "<200 mg/dL", specimen: "Serum (fasting 12h)", discipline: "Clinical Chemistry", slug: "" },
  { name: "Triglycerides", si: "<1.7 mmol/L", us: "<150 mg/dL", specimen: "Serum (fasting 12h)", discipline: "Clinical Chemistry", slug: "" },
  { name: "HDL Cholesterol", si: ">1.0 mmol/L (M)", us: ">40 mg/dL (M)", specimen: "Serum (fasting)", discipline: "Clinical Chemistry", slug: "" },
  { name: "LDL Cholesterol", si: "<3.4 mmol/L", us: "<130 mg/dL", specimen: "Calculated (Friedewald)", discipline: "Clinical Chemistry", slug: "" },
  { name: "Iron (Serum)", si: "12–31 µmol/L", us: "65–175 µg/dL", specimen: "Serum (morning)", discipline: "Clinical Chemistry", slug: "" },
  { name: "TIBC", si: "45–73 µmol/L", us: "250–410 µg/dL", specimen: "Serum", discipline: "Clinical Chemistry", slug: "" },
  { name: "Ferritin", si: "12–300 µg/L (M)", us: "12–300 ng/mL (M)", specimen: "Serum", discipline: "Clinical Chemistry", slug: "" },
  { name: "Hemoglobin", si: "140–180 g/L (M)", us: "14.0–18.0 g/dL (M)", specimen: "EDTA whole blood", discipline: "Hematology", slug: "hemoglobin" },
  { name: "Hematocrit", si: "0.40–0.54 L/L (M)", us: "40–54% (M)", specimen: "EDTA whole blood", discipline: "Hematology", slug: "" },
  { name: "RBC Count", si: "4.5–5.5 × 10¹²/L (M)", us: "4.5–5.5 M/µL (M)", specimen: "EDTA whole blood", discipline: "Hematology", slug: "" },
  { name: "WBC Count", si: "4.5–11.0 × 10⁹/L", us: "4,500–11,000/µL", specimen: "EDTA whole blood", discipline: "Hematology", slug: "wbc" },
  { name: "Platelet Count", si: "150–400 × 10⁹/L", us: "150,000–400,000/µL", specimen: "EDTA whole blood", discipline: "Hematology", slug: "platelet-count" },
  { name: "MCV", si: "80–100 fL", us: "80–100 fL", specimen: "Calculated", discipline: "Hematology", slug: "" },
  { name: "MCH", si: "27–33 pg", us: "27–33 pg", specimen: "Calculated", discipline: "Hematology", slug: "" },
  { name: "MCHC", si: "320–360 g/L", us: "32–36 g/dL", specimen: "Calculated", discipline: "Hematology", slug: "" },
  { name: "RDW", si: "11.5–14.5%", us: "11.5–14.5%", specimen: "Calculated", discipline: "Hematology", slug: "" },
  { name: "Reticulocyte Count", si: "0.5–2.5%", us: "0.5–2.5%", specimen: "EDTA whole blood", discipline: "Hematology", slug: "" },
  { name: "ESR", si: "0–20 mm/hr (M)", us: "0–20 mm/hr (M)", specimen: "Citrate/EDTA", discipline: "Hematology", slug: "" },
  { name: "PT", si: "11–13.5 seconds", us: "11–13.5 seconds", specimen: "Citrate plasma", discipline: "Hemostasis", slug: "" },
  { name: "INR", si: "0.8–1.2 (normal)", us: "0.8–1.2 (normal)", specimen: "Citrate plasma", discipline: "Hemostasis", slug: "" },
  { name: "aPTT", si: "25–35 seconds", us: "25–35 seconds", specimen: "Citrate plasma", discipline: "Hemostasis", slug: "" },
  { name: "Fibrinogen", si: "2–4 g/L", us: "200–400 mg/dL", specimen: "Citrate plasma", discipline: "Hemostasis", slug: "" },
];

export function MltLabValuesCompleteChart() {
  const [unit, setUnit] = useState<"si" | "us">("si");

  const chartFaqs = [
    { q: "Can I print this lab values chart?", a: "Yes, use your browser's print function (Ctrl/Cmd + P) to print this chart. The table is formatted for clean printing. Bookmark this page for quick reference during your study sessions." },
    { q: "Are these values accurate for the CSMLS exam?", a: "Yes, these reference ranges reflect standard clinical laboratory values used in CSMLS exam preparation. SI units are displayed for the Canadian track. Always check your textbook for institution-specific ranges, as some may vary slightly." },
    { q: "Are these values accurate for the ASCP exam?", a: "Yes, these conventional unit values are aligned with ASCP exam preparation materials. The ASCP tests conventional (US) units. Use the unit toggle to switch between SI and conventional display." },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: chartFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Complete Lab Values Chart for MLT Exam — SI & Conventional Units",
    description: "Comprehensive lab values reference chart for MLT exam preparation with 50+ analytes in both SI and conventional units.",
    author: { "@type": "Organization", name: "NurseNest Allied" },
  };

  return (
    <>
      <AlliedSEO
        title={t("allied.mltLabValuesViral.completeLabValuesChartFor")}
        description={t("allied.mltLabValuesViral.comprehensiveLabValuesChartFor")}
        keywords="lab values chart MLT exam, complete lab values reference, MLT normal ranges chart, CSMLS lab values chart, ASCP lab values chart, printable lab values MLT"
        canonicalPath="/allied-health/mlt/lab-values/complete-chart"
        structuredData={articleSchema}
        additionalStructuredData={[faqSchema]}
      />

      <div className="max-w-6xl mx-auto px-4 py-8" data-testid="mlt-lab-values-chart">
        <nav aria-label={t("allied.mltLabValuesViral.breadcrumb")} className="text-sm text-gray-500 mb-6" data-testid="breadcrumbs">
          <ol className="flex flex-wrap items-center gap-1">
            <li><Link href="/allied-health" className="hover:text-purple-600">{t("allied.mltLabValuesViral.alliedHealth")}</Link></li>
            <li><ChevronRight className="w-3 h-3 inline" /></li>
            <li><Link href="/allied-health/mlt" className="hover:text-purple-600">MLT</Link></li>
            <li><ChevronRight className="w-3 h-3 inline" /></li>
            <li><Link href="/allied-health/mlt/lab-values" className="hover:text-purple-600">{t("allied.mltLabValuesViral.labValues")}</Link></li>
            <li><ChevronRight className="w-3 h-3 inline" /></li>
            <li className="text-gray-800 font-medium">{t("allied.mltLabValuesViral.completeChart")}</li>
          </ol>
        </nav>

        <section className="text-center py-8" data-testid="chart-hero">
          <div className="flex items-center justify-center gap-2 text-sm text-purple-600 font-medium mb-4">
            <ClipboardList className="w-4 h-4" />
            <span>{t("allied.mltLabValuesViral.mltExamReference")}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight" data-testid="chart-h1">
            Complete Lab Values Chart for MLT Exam
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6 leading-relaxed">
            Every lab value you need to know for the CSMLS and ASCP certification exams, organized by discipline with both SI and conventional units. Bookmark this page as your go-to reference during exam prep.
          </p>
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="inline-flex rounded-lg border border-gray-200 overflow-hidden text-sm" data-testid="chart-unit-toggle">
              <button
                onClick={() => setUnit("si")}
                className={`px-4 py-2 font-medium transition-colors ${unit === "si" ? "bg-purple-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
                data-testid="button-si"
              >
                SI Units (Canada)
              </button>
              <button
                onClick={() => setUnit("us")}
                className={`px-4 py-2 font-medium transition-colors ${unit === "us" ? "bg-purple-600 text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
                data-testid="button-us"
              >
                Conventional (US)
              </button>
            </div>
          </div>
        </section>

        <section className="mb-8" data-testid="chart-table-section">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse" data-testid="chart-table">
              <thead>
                <tr className="bg-purple-50">
                  <th className="text-left px-4 py-3 font-semibold text-purple-900 border-b border-purple-100">{t("allied.mltLabValuesViral.analyte")}</th>
                  <th className="text-left px-4 py-3 font-semibold text-purple-900 border-b border-purple-100">
                    {unit === "si" ? "Normal Range (SI)" : "Normal Range (US)"}
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-purple-900 border-b border-purple-100">{t("allied.mltLabValuesViral.specimen")}</th>
                  <th className="text-left px-4 py-3 font-semibold text-purple-900 border-b border-purple-100">{t("allied.mltLabValuesViral.discipline")}</th>
                </tr>
              </thead>
              <tbody>
                {EXTENDED_LAB_VALUES.map((lv, i) => (
                  <tr key={i} className={`border-b border-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`} data-testid={`chart-row-${i}`}>
                    <td className="px-4 py-2.5 font-medium text-gray-800">
                      {lv.slug ? (
                        <Link href={`/allied-health/mlt/lab-values/${lv.slug}`} className="text-purple-700 hover:text-purple-900 hover:underline">
                          {lv.name}
                        </Link>
                      ) : (
                        lv.name
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-emerald-700 font-medium">{unit === "si" ? lv.si : lv.us}</td>
                    <td className="px-4 py-2.5 text-gray-500">{lv.specimen}</td>
                    <td className="px-4 py-2.5 text-gray-500">{lv.discipline}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-8 bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6 text-center" data-testid="chart-cta">
          <Lock className="w-10 h-10 text-purple-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-gray-900 mb-2">{t("allied.mltLabValuesViral.testYourLabValuesKnowledge")}</h2>
          <p className="text-sm text-gray-600 mb-4 max-w-md mx-auto">
            Knowing reference ranges is just the beginning. Practice applying lab values in clinical scenarios with our MLT question bank.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Link href="/allied-health/mlt" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200" data-testid="cta-qbank">
              Unlock Full MLT Question Bank <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/allied-health/mlt/lab-values" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-purple-700 border border-purple-200 rounded-xl font-semibold hover:bg-purple-50 transition-colors" data-testid="cta-detailed">
              Detailed Lab Value Pages
            </Link>
          </div>
        </section>

        <section className="py-8" data-testid="chart-faq">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-purple-500" />
            Frequently Asked Questions
          </h2>
          <FAQAccordion items={chartFaqs} />
        </section>
      </div>
    </>
  );
}

const TOP_50_SECTIONS = [
  {
    title: "Electrolytes — The Foundation",
    items: [
      { name: "Sodium (Na⁺)", range: "136–145 mmol/L / mEq/L", tip: "Primary determinant of serum osmolality. SIADH → hyponatremia. DI → hypernatremia.", slug: "sodium" },
      { name: "Potassium (K⁺)", range: "3.5–5.0 mmol/L / mEq/L", tip: "Hemolysis = #1 cause of falsely elevated K⁺. Inversely related to pH.", slug: "potassium" },
      { name: "Calcium (Total)", range: "2.15–2.55 mmol/L / 8.6–10.2 mg/dL", tip: "Inversely related to phosphorus. Correct for albumin. Never use EDTA tubes.", slug: "calcium" },
      { name: "Magnesium (Mg²⁺)", range: "0.75–1.05 mmol/L / 1.8–2.5 mg/dL", tip: "Hypomagnesemia causes refractory hypokalemia — correct Mg²⁺ first!", slug: "magnesium" },
      { name: "Chloride (Cl⁻)", range: "98–106 mmol/L / mEq/L", tip: "Follows sodium. Used in anion gap calculation: AG = Na⁺ − (Cl⁻ + HCO₃⁻)." },
      { name: "Phosphorus", range: "0.81–1.45 mmol/L / 2.5–4.5 mg/dL", tip: "Inversely related to calcium (PTH regulation). Elevated in CKD." },
    ],
  },
  {
    title: "Renal Function — BUN & Creatinine",
    items: [
      { name: "BUN (Urea)", range: "2.5–7.1 mmol/L / 7–20 mg/dL", tip: "Affected by diet, GI bleeding, liver function. BUN/Cr ratio >20:1 = prerenal.", slug: "bun-creatinine" },
      { name: "Creatinine", range: "62–115 µmol/L / 0.7–1.3 mg/dL", tip: "More specific than BUN. Jaffe reaction subject to interference from ketones.", slug: "bun-creatinine" },
      { name: "eGFR", range: ">90 mL/min (normal)", tip: "Calculated from creatinine. <60 for >3 months = CKD. Use CKD-EPI equation." },
      { name: "Uric Acid", range: "210–420 µmol/L / 3.5–7.0 mg/dL", tip: "Elevated in gout, tumor lysis syndrome, renal failure." },
    ],
  },
  {
    title: "Glucose & Diabetes Monitoring",
    items: [
      { name: "Fasting Glucose", range: "3.9–5.6 mmol/L / 70–100 mg/dL", tip: "NaF tube preserves glucose. Hexokinase = reference method.", slug: "glucose" },
      { name: "HbA1c", range: "<5.7% / <39 mmol/mol", tip: "Reflects 2–3 month average. HPLC = reference method. Hemolysis → falsely low.", slug: "a1c" },
      { name: "2-hour OGTT", range: "<7.8 mmol/L / <140 mg/dL", tip: "≥11.1 mmol/L (200 mg/dL) = diabetes. 7.8–11.0 = impaired glucose tolerance." },
    ],
  },
  {
    title: "CBC — Complete Blood Count",
    items: [
      { name: "Hemoglobin", range: "M: 140–180 g/L / F: 120–160 g/L", tip: "Cyanmethemoglobin (HiCN) = reference method. Rule of three: Hgb × 3 ≈ Hct.", slug: "hemoglobin" },
      { name: "WBC Count", range: "4.5–11.0 × 10⁹/L", tip: "Left shift (↑ bands) = bacterial infection. NRBCs falsely elevate WBC count.", slug: "wbc" },
      { name: "Platelet Count", range: "150–400 × 10⁹/L", tip: "EDTA-dependent clumping = pseudothrombocytopenia. Check feathered edge.", slug: "platelet-count" },
      { name: "MCV", range: "80–100 fL", tip: "Classifies anemias: <80 microcytic (Fe deficiency), >100 macrocytic (B12/folate)." },
      { name: "MCHC", range: "320–360 g/L / 32–36 g/dL", tip: "Decreased in iron deficiency (hypochromic). Increased = spherocytosis or cold agglutinins." },
      { name: "RDW", range: "11.5–14.5%", tip: "Increased = anisocytosis. Helps differentiate iron deficiency (high RDW) from thalassemia trait (normal RDW)." },
      { name: "Reticulocyte Count", range: "0.5–2.5%", tip: "Increased = appropriate marrow response (hemolysis, blood loss). Decreased = marrow failure." },
    ],
  },
  {
    title: "Cardiac Biomarkers",
    items: [
      { name: "Troponin I/T", range: "<0.04 ng/mL", tip: "Gold standard for MI. Rises 3–6 hours. Serial testing at 0, 3, 6 hours.", slug: "troponin" },
      { name: "CK-MB", range: "<25 U/L", tip: "Rises 4–6 hours, normalizes 48–72 hours. Useful for detecting reinfarction." },
      { name: "BNP", range: "<100 pg/mL", tip: "Heart failure marker. >400 pg/mL = high probability of CHF." },
      { name: "Myoglobin", range: "M: 28–72 ng/mL", tip: "Earliest cardiac marker (1–3 hours) but NOT specific — also from skeletal muscle." },
    ],
  },
  {
    title: "Liver Function Panel",
    items: [
      { name: "AST (SGOT)", range: "10–40 U/L", tip: "Not liver-specific (also in heart, muscle). Elevated in hepatitis, MI, hemolysis." },
      { name: "ALT (SGPT)", range: "7–56 U/L", tip: "Most specific liver enzyme. ALT > AST in viral hepatitis. AST > ALT in alcoholic hepatitis." },
      { name: "ALP", range: "44–147 U/L", tip: "Elevated in biliary obstruction, bone disease (Paget disease), pregnancy. Isoenzymes differentiate source." },
      { name: "GGT", range: "9–48 U/L", tip: "Confirms hepatic origin of ALP elevation. Elevated in alcohol abuse." },
      { name: "Total Bilirubin", range: "5–21 µmol/L / 0.3–1.2 mg/dL", tip: "Direct (conjugated) = hepatic/posthepatic. Indirect (unconjugated) = prehepatic (hemolysis)." },
      { name: "Albumin", range: "35–50 g/L / 3.5–5.0 g/dL", tip: "Decreased in liver disease, nephrotic syndrome, malnutrition. Affects total calcium interpretation." },
    ],
  },
  {
    title: "ABG & Acid-Base",
    items: [
      { name: "pH", range: "7.35–7.45", tip: "<7.35 = acidosis. >7.45 = alkalosis. pH electrode = glass electrode.", slug: "abg" },
      { name: "PaCO₂", range: "35–45 mmHg / 4.7–6.0 kPa", tip: "Respiratory component. Measured by Severinghaus electrode.", slug: "abg" },
      { name: "HCO₃⁻", range: "22–26 mmol/L", tip: "Metabolic component. Calculated from Henderson-Hasselbalch equation.", slug: "abg" },
      { name: "PaO₂", range: "80–100 mmHg / 10.7–13.3 kPa", tip: "Oxygenation marker. Measured by Clark electrode. Air bubbles falsely elevate.", slug: "abg" },
      { name: "Anion Gap", range: "8–12 mEq/L", tip: "= Na⁺ − (Cl⁻ + HCO₃⁻). Elevated: DKA, lactic acidosis, renal failure, toxins (MUDPILES)." },
    ],
  },
  {
    title: "Coagulation",
    items: [
      { name: "PT", range: "11–13.5 seconds", tip: "Extrinsic pathway (Factor VII). Monitors warfarin therapy." },
      { name: "INR", range: "0.8–1.2 (normal); 2.0–3.0 (warfarin)", tip: "Standardized PT ratio. Critical >4.5 (bleeding risk)." },
      { name: "aPTT", range: "25–35 seconds", tip: "Intrinsic pathway. Monitors heparin therapy. Mixing study differentiates factor deficiency vs inhibitor." },
      { name: "Fibrinogen", range: "2–4 g/L / 200–400 mg/dL", tip: "Decreased in DIC. Acute phase reactant (increased in inflammation)." },
      { name: "D-dimer", range: "<0.5 µg/mL (FEU)", tip: "Elevated in DIC, PE, DVT. High negative predictive value for VTE exclusion." },
    ],
  },
  {
    title: "Iron Studies & Lipids",
    items: [
      { name: "Serum Iron", range: "12–31 µmol/L / 65–175 µg/dL", tip: "Decreased in iron deficiency. Diurnal variation (highest in morning)." },
      { name: "TIBC", range: "45–73 µmol/L / 250–410 µg/dL", tip: "Increased in iron deficiency (body trying to absorb more iron). Decreased in chronic disease." },
      { name: "Ferritin", range: "12–300 µg/L (M)", tip: "Best single test for iron stores. Acute phase reactant (elevated in inflammation)." },
      { name: "Total Cholesterol", range: "<5.2 mmol/L / <200 mg/dL", tip: "12-hour fasting specimen. Enzymatic methods (cholesterol oxidase/esterase)." },
      { name: "Triglycerides", range: "<1.7 mmol/L / <150 mg/dL", tip: "Fasting required. Lipemia interferes with many spectrophotometric assays." },
    ],
  },
];

export function MltLabValuesTop50() {
  const top50Faqs = [
    { q: "How many lab values do I need to know for the MLT exam?", a: "You should know at least 50 key lab values including their normal ranges, critical values, specimen requirements, and clinical significance. Focus on electrolytes, CBC, renal function, liver function, cardiac biomarkers, ABG, coagulation, and glucose/diabetes markers." },
    { q: "Should I memorize SI or conventional units?", a: "For CSMLS (Canada): memorize SI units. For ASCP (US): memorize conventional units. Ideally, know both systems and their conversion factors. Our study materials display both units for every analyte." },
    { q: "What is the best way to memorize lab values?", a: "Use active recall and spaced repetition. Create flashcards with the analyte on one side and the normal range + clinical significance on the other. Practice with clinical scenarios rather than isolated memorization. Our practice questions help you apply lab values in context." },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: top50Faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Top 50 Lab Values You Must Know for the MLT Exam",
    description: "The 50 most important lab values for MLT certification exam success, with normal ranges, exam tips, and clinical pearls.",
    author: { "@type": "Organization", name: "NurseNest Allied" },
  };

  return (
    <>
      <AlliedSEO
        title={t("allied.mltLabValuesViral.top50LabValuesYou")}
        description={t("allied.mltLabValuesViral.the50MostImportantLab")}
        keywords="top lab values MLT exam, must know lab values MLT, high yield lab values MLT certification, CSMLS lab values study, ASCP lab values review"
        canonicalPath="/allied-health/mlt/lab-values/top-50"
        structuredData={articleSchema}
        additionalStructuredData={[faqSchema]}
      />

      <div className="max-w-5xl mx-auto px-4 py-8" data-testid="mlt-lab-values-top50">
        <nav aria-label={t("allied.mltLabValuesViral.breadcrumb2")} className="text-sm text-gray-500 mb-6" data-testid="breadcrumbs">
          <ol className="flex flex-wrap items-center gap-1">
            <li><Link href="/allied-health" className="hover:text-purple-600">{t("allied.mltLabValuesViral.alliedHealth2")}</Link></li>
            <li><ChevronRight className="w-3 h-3 inline" /></li>
            <li><Link href="/allied-health/mlt" className="hover:text-purple-600">MLT</Link></li>
            <li><ChevronRight className="w-3 h-3 inline" /></li>
            <li><Link href="/allied-health/mlt/lab-values" className="hover:text-purple-600">{t("allied.mltLabValuesViral.labValues2")}</Link></li>
            <li><ChevronRight className="w-3 h-3 inline" /></li>
            <li className="text-gray-800 font-medium">{t("allied.mltLabValuesViral.top50")}</li>
          </ol>
        </nav>

        <section className="text-center py-8" data-testid="top50-hero">
          <div className="flex items-center justify-center gap-2 text-sm text-purple-600 font-medium mb-4">
            <Star className="w-4 h-4" />
            <span>{t("allied.mltLabValuesViral.highyieldMltStudyGuide")}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight" data-testid="top50-h1">
            Top 50 Lab Values You Must Know for the MLT Exam
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6 leading-relaxed">
            These are the 50 most commonly tested lab values on the CSMLS and ASCP certification exams. Each entry includes the normal range, a high-yield exam tip, and links to detailed study pages. Master these and you'll be ready for any lab value question on exam day.
          </p>
        </section>

        <div className="space-y-10 mb-12">
          {TOP_50_SECTIONS.map((section, si) => (
            <section key={si} data-testid={`top50-section-${si}`}>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-purple-500" />
                {section.title}
              </h2>
              <div className="space-y-3">
                {section.items.map((item, ii) => (
                  <div key={ii} className="bg-white rounded-xl border border-gray-100 p-4 hover:border-purple-200 transition-all" data-testid={`top50-item-${si}-${ii}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {item.slug ? (
                          <Link href={`/allied-health/mlt/lab-values/${item.slug}`} className="text-purple-700 hover:text-purple-900 hover:underline">
                            {item.name}
                          </Link>
                        ) : (
                          item.name
                        )}
                      </h3>
                      <span className="text-sm text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded">{item.range}</span>
                    </div>
                    <p className="text-sm text-gray-600 flex items-start gap-2">
                      <Brain className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                      {item.tip}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className="mb-8 bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6 text-center" data-testid="top50-cta">
          <Lock className="w-10 h-10 text-purple-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-gray-900 mb-2">{t("allied.mltLabValuesViral.readyToTestYourKnowledge")}</h2>
          <p className="text-sm text-gray-600 mb-4 max-w-md mx-auto">
            Practice applying these lab values in exam-authentic clinical scenarios with our MLT question bank.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Link href="/allied-health/mlt" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200" data-testid="cta-qbank">
              Unlock Full MLT Question Bank <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/allied-health/mlt/lab-values/complete-chart" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-purple-700 border border-purple-200 rounded-xl font-semibold hover:bg-purple-50 transition-colors" data-testid="cta-chart">
              View Complete Chart
            </Link>
          </div>
        </section>

        <section className="py-8" data-testid="top50-links">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{t("allied.mltLabValuesViral.continueStudying")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <Link href="/allied-health/mlt/lab-values" className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all" data-testid="link-hub">
              <FlaskConical className="w-5 h-5 text-purple-500 flex-shrink-0" />
              <div>
                <div className="font-medium text-gray-900 text-sm">{t("allied.mltLabValuesViral.allLabValues")}</div>
                <div className="text-xs text-gray-500">{t("allied.mltLabValuesViral.detailedPagesForEachAnalyte")}</div>
              </div>
            </Link>
            <Link href="/allied-health/mlt/questions" className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all" data-testid="link-questions">
              <Brain className="w-5 h-5 text-purple-500 flex-shrink-0" />
              <div>
                <div className="font-medium text-gray-900 text-sm">{t("allied.mltLabValuesViral.mltQuestionBank")}</div>
                <div className="text-xs text-gray-500">{t("allied.mltLabValuesViral.1000PracticeQuestions")}</div>
              </div>
            </Link>
            <Link href="/allied-health/mlt/exams" className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all" data-testid="link-exams">
              <FileText className="w-5 h-5 text-purple-500 flex-shrink-0" />
              <div>
                <div className="font-medium text-gray-900 text-sm">{t("allied.mltLabValuesViral.practiceExams")}</div>
                <div className="text-xs text-gray-500">{t("allied.mltLabValuesViral.csmlsAscpMockExams")}</div>
              </div>
            </Link>
          </div>
        </section>

        <section className="py-8" data-testid="top50-faq">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-purple-500" />
            Frequently Asked Questions
          </h2>
          <FAQAccordion items={top50Faqs} />
        </section>
      </div>
    </>
  );
}
