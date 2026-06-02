import type { ConversionEntry } from "@/lib/unit-conversions";

export interface ClusterFAQ {
  question: string;
  answer: string;
}

export interface ConversionExample {
  label: string;
  siValue: string;
  convValue: string;
  interpretation: string;
  color: string;
}

export interface ReferenceRow {
  condition: string;
  siRange: string;
  convRange: string;
  significance: string;
}

export interface InternalLink {
  href: string;
  label: string;
  description: string;
}

export interface ClusterPageData {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  h1: string;
  heroDescription: string;
  converterIds: string[];
  sections: {
    whatIsThis: { heading: string; paragraphs: string[] };
    whyItMatters: { heading: string; items: { bold: string; text: string }[] };
    clinicalContext: { heading: string; paragraphs: string[] };
    nursingExamples: { heading: string; examples: ConversionExample[] };
    referenceChart: { heading: string; rows: ReferenceRow[] };
  };
  faqs: ClusterFAQ[];
  relatedClusterLinks: InternalLink[];
  externalLinks: InternalLink[];
  breadcrumbLabel: string;
}

export const clusterPages: Record<string, ClusterPageData> = {
  "canadian-vs-american-lab-values": {
    slug: "canadian-vs-american-lab-values",
    title: "Canadian vs American Lab Values",
    metaTitle: "Canadian vs American Lab Values — SI vs Conventional Units Explained | NurseNest",
    metaDescription: "Understand why Canada and the U.S. report lab values differently. Learn the difference between SI units and conventional units, why it matters for nursing exams (NCLEX, REx-PN), and how to convert between systems.",
    keywords: "Canadian vs American lab values, SI units vs conventional units, lab value differences Canada US, nursing lab values, NCLEX lab values, REx-PN lab values",
    h1: "Canadian vs American Lab Values: SI & Conventional Units Explained",
    heroDescription: "Canada and the United States report laboratory values using different measurement systems. This guide explains what SI and conventional units are, why they differ, and how to confidently interpret lab results in both systems — essential knowledge for nursing students, NCLEX and REx-PN exam preparation, and cross-border clinical practice.",
    converterIds: ["glucose", "creatinine", "hemoglobin", "bilirubin", "calcium", "cholesterol-total"],
    breadcrumbLabel: "Canadian vs American Lab Values",
    sections: {
      whatIsThis: {
        heading: "What Are SI Units and Conventional Units?",
        paragraphs: [
          "The International System of Units (SI — Système International d'Unités) is the globally standardized measurement system used by most countries for scientific and clinical laboratory reporting. SI units express substance concentration in moles per liter (mol/L), emphasizing the number of molecules rather than their mass. Canada, the United Kingdom, Australia, and most of Europe use SI units in clinical practice.",
          "Conventional units (also called traditional or U.S. customary units) express concentration as mass per volume — typically milligrams per deciliter (mg/dL) or grams per deciliter (g/dL). This system is the primary standard in the United States. Each analyte has a unique conversion factor based on its molecular weight, which is why there is no single universal formula to convert between the two systems.",
          "Important: Some measurements — like electrolytes (sodium, potassium, chloride) — use the same units (mEq/L or mmol/L) in both systems. The differences primarily affect metabolites, proteins, and other analytes measured by mass or molar concentration.",
        ],
      },
      whyItMatters: {
        heading: "Why This Matters for Nursing Students",
        items: [
          { bold: "Licensing exams cross systems:", text: "NCLEX (U.S.) and REx-PN (Canada) may present lab values in either SI or conventional units. Being fluent in both prevents misinterpretation on exam day." },
          { bold: "Textbook literacy:", text: "Many widely-used nursing textbooks are published in the U.S. and use conventional units exclusively. Canadian students must mentally convert these to match their clinical training." },
          { bold: "Cross-border practice:", text: "Nurses licensed in Canada who work in the U.S. (and vice versa) need to seamlessly translate between systems at the bedside." },
          { bold: "Patient safety:", text: "Misreading a glucose of 10 mmol/L (normal-high) as 10 mg/dL (critically low) could trigger an inappropriate clinical response. Unit awareness is a patient safety skill." },
          { bold: "Clinical placement readiness:", text: "Canadian nursing students doing placements in U.S.-affiliated hospitals, or reviewing U.S. clinical guidelines, encounter conventional units daily." },
        ],
      },
      clinicalContext: {
        heading: "A Brief History of the Two Systems",
        paragraphs: [
          "Before the 1970s, all countries used mass-based (conventional) units for lab reporting. In 1971, the International Federation of Clinical Chemistry recommended that clinical laboratories adopt SI units to align with the global scientific community. Canada adopted SI units for clinical labs in the early 1980s, while the United States chose not to transition.",
          "This means that a patient's blood glucose reported as '5.5' in Toronto and '99' in Detroit represents the same physiological state — normal fasting glucose. The measurement is identical; only the scale differs. Understanding this equivalence is fundamental to safe cross-border nursing practice.",
        ],
      },
      nursingExamples: {
        heading: "Common Lab Value Comparisons",
        examples: [
          { label: "Fasting Glucose", siValue: "5.0 mmol/L", convValue: "90 mg/dL", interpretation: "Normal fasting glucose in both systems", color: "bg-green-50/50" },
          { label: "Creatinine", siValue: "88 µmol/L", convValue: "1.0 mg/dL", interpretation: "Normal kidney function marker", color: "bg-blue-50/50" },
          { label: "Hemoglobin", siValue: "140 g/L", convValue: "14.0 g/dL", interpretation: "Normal for adult males", color: "bg-purple-50/50" },
          { label: "Total Bilirubin", siValue: "17 µmol/L", convValue: "1.0 mg/dL", interpretation: "Normal — no jaundice concern", color: "bg-amber-50/50" },
          { label: "Calcium", siValue: "2.35 mmol/L", convValue: "9.4 mg/dL", interpretation: "Normal total calcium", color: "bg-teal-50/50" },
          { label: "Total Cholesterol", siValue: "5.0 mmol/L", convValue: "193 mg/dL", interpretation: "Borderline — near desirable limit", color: "bg-rose-50/50" },
        ],
      },
      referenceChart: {
        heading: "Quick Reference: Key Lab Values in Both Systems",
        rows: [
          { condition: "Glucose (fasting)", siRange: "3.9–5.5 mmol/L", convRange: "70–100 mg/dL", significance: "Diabetes screening, hypoglycemia detection" },
          { condition: "Creatinine", siRange: "62–106 µmol/L", convRange: "0.7–1.2 mg/dL", significance: "Kidney function assessment" },
          { condition: "Hemoglobin (F)", siRange: "120–160 g/L", convRange: "12.0–16.0 g/dL", significance: "Anemia evaluation" },
          { condition: "Total Bilirubin", siRange: "3.4–20.5 µmol/L", convRange: "0.2–1.2 mg/dL", significance: "Liver function, jaundice assessment" },
          { condition: "Calcium (total)", siRange: "2.12–2.62 mmol/L", convRange: "8.5–10.5 mg/dL", significance: "Bone/parathyroid function, cardiac rhythm" },
          { condition: "Urea / BUN", siRange: "2.5–7.1 mmol/L", convRange: "7–20 mg/dL", significance: "Kidney function, hydration status" },
          { condition: "Total Cholesterol", siRange: "<5.2 mmol/L", convRange: "<200 mg/dL", significance: "Cardiovascular risk assessment" },
        ],
      },
    },
    faqs: [
      { question: "Do Canadian and American nurses learn different lab values?", answer: "They learn the same physiology and the same clinical significance — the only difference is the unit of measurement used to express lab results. A Canadian nurse knows that a glucose of 5.5 mmol/L is normal; an American nurse knows 100 mg/dL is normal. Both values represent the same blood glucose concentration." },
      { question: "Which system does the NCLEX use?", answer: "NCLEX primarily uses conventional (U.S.) units, but questions may include SI values, especially in scenarios involving international patients or cross-border practice. Canadian students preparing for NCLEX should be comfortable with both systems." },
      { question: "Which system does the REx-PN use?", answer: "The REx-PN (Regulatory Exam for Practical Nurses, used in Canada) primarily uses SI units. However, familiarity with conventional units is still beneficial since many study resources are U.S.-based." },
      { question: "Are any lab values the same in both systems?", answer: "Yes. Electrolytes such as sodium (Na+), potassium (K+), chloride (Cl-), and bicarbonate (HCO3-) are reported in mEq/L or mmol/L in both systems — no conversion needed. This is because these are monovalent ions where 1 mEq = 1 mmol." },
      { question: "Why doesn't the U.S. just switch to SI units?", answer: "The transition would require retraining hundreds of thousands of healthcare providers, reprogramming laboratory equipment, updating all clinical decision support systems, and revising medication protocols. The cost and risk of errors during transition have kept the U.S. on conventional units, though some U.S. labs do report certain values in SI alongside conventional." },
    ],
    relatedClusterLinks: [
      { href: "/glucose-mmol-l-to-mg-dl", label: "Glucose Conversion (mmol/L ↔ mg/dL)", description: "Glucose-specific conversion with diabetes context" },
      { href: "/creatinine-umol-l-to-mg-dl", label: "Creatinine Conversion (µmol/L ↔ mg/dL)", description: "Creatinine conversion with renal function context" },
      { href: "/hemoglobin-g-l-to-g-dl", label: "Hemoglobin Conversion (g/L ↔ g/dL)", description: "Hemoglobin conversion with anemia context" },
      { href: "/bilirubin-umol-l-to-mg-dl", label: "Bilirubin Conversion (µmol/L ↔ mg/dL)", description: "Bilirubin conversion with liver/neonatal context" },
      { href: "/calcium-mmol-l-to-mg-dl", label: "Calcium Conversion (mmol/L ↔ mg/dL)", description: "Calcium conversion with electrolyte context" },
      { href: "/urea-to-bun-conversion-nursing", label: "Urea to BUN Conversion", description: "Urea vs BUN — not a simple relabeling" },
      { href: "/cholesterol-triglyceride-unit-conversion", label: "Cholesterol & Triglyceride Conversion", description: "Lipid panel unit conversions" },
      { href: "/kg-to-lb-nursing", label: "kg to lb Nursing Conversion", description: "Weight conversion for medication dosing" },
      { href: "/celsius-to-fahrenheit-nursing", label: "°C to °F Nursing Conversion", description: "Temperature conversion for vital signs" },
    ],
    externalLinks: [
      { href: "/si-to-conventional-units-converter", label: "Full SI ↔ Conventional Converter", description: "Interactive converter for all lab values" },
      { href: "/lab-values", label: "Lab Values Interpretation", description: "Clinical scenarios with abnormal lab clusters" },
      { href: "/med-math", label: "Med Math Practice", description: "Dosage calculation practice problems" },
      { href: "/medication-mastery", label: "Pharmacology & Medication Mastery", description: "Drug classes and nursing considerations" },
    ],
  },

  "glucose-mmol-l-to-mg-dl": {
    slug: "glucose-mmol-l-to-mg-dl",
    title: "Glucose mmol/L to mg/dL Conversion",
    metaTitle: "Glucose mmol/L to mg/dL Conversion — Blood Sugar Unit Calculator | NurseNest",
    metaDescription: "Convert blood glucose between mmol/L (SI/Canadian) and mg/dL (conventional/U.S.). Includes conversion formula, diabetes thresholds, quick-reference chart, and nursing clinical context.",
    keywords: "glucose mmol/L to mg/dL, blood sugar conversion, glucose unit conversion, diabetes glucose levels, nursing glucose conversion, blood glucose calculator",
    h1: "Glucose Conversion: mmol/L ↔ mg/dL",
    heroDescription: "Blood glucose is one of the most frequently measured lab values in clinical practice, and one of the most common conversions nursing students encounter. Canada reports glucose in mmol/L (SI units), while the U.S. uses mg/dL (conventional units). The conversion factor is 18.0182 — a number worth memorizing for exams.",
    converterIds: ["glucose"],
    breadcrumbLabel: "Glucose Conversion",
    sections: {
      whatIsThis: {
        heading: "Understanding Glucose Units",
        paragraphs: [
          "Blood glucose measures the concentration of glucose (a simple sugar) in the blood. In SI units, glucose is expressed in millimoles per liter (mmol/L), which counts the number of glucose molecules. In conventional units, it is expressed in milligrams per deciliter (mg/dL), which measures the mass of glucose.",
          "The conversion factor of 18.0182 comes from glucose's molecular weight (180.16 g/mol). To convert mmol/L to mg/dL, multiply by 18. To convert mg/dL to mmol/L, divide by 18. For clinical purposes, using 18 as the factor is accurate enough — many nurses round to this value for quick mental math.",
          "This conversion is critical in diabetes management, emergency hypoglycemia assessment, and perioperative blood sugar monitoring. Knowing both systems ensures you can interpret finger-stick glucometer readings, lab panels, and insulin sliding scales regardless of which country's system you're working in.",
        ],
      },
      whyItMatters: {
        heading: "Why Glucose Conversion Matters in Nursing",
        items: [
          { bold: "Diabetes management:", text: "Insulin dosing, sliding scale interpretation, and glucose target ranges are the backbone of diabetes nursing care. Misreading a unit could mean giving insulin when it's contraindicated (or withholding it when needed)." },
          { bold: "Hypoglycemia recognition:", text: "A glucose of 3.0 mmol/L = 54 mg/dL — symptomatic hypoglycemia requiring immediate intervention. Recognizing this threshold in both systems prevents delayed treatment." },
          { bold: "DKA/HHS monitoring:", text: "Diabetic ketoacidosis and hyperosmolar hyperglycemic state involve extremely elevated glucose. A value of 30 mmol/L (540 mg/dL) signals a life-threatening emergency in either unit system." },
          { bold: "Exam preparation:", text: "NCLEX questions frequently use glucose values. If your training used mmol/L, you must quickly convert to mg/dL to interpret the clinical scenario correctly." },
          { bold: "Gestational diabetes screening:", text: "Oral glucose tolerance test (OGTT) thresholds differ between Canadian and U.S. guidelines, but the underlying glucose values are equivalent once converted." },
        ],
      },
      clinicalContext: {
        heading: "Glucose in Endocrine & Diabetes Nursing",
        paragraphs: [
          "Glucose regulation involves a complex interplay between insulin (produced by pancreatic beta cells) and counter-regulatory hormones (glucagon, cortisol, epinephrine, growth hormone). In type 1 diabetes, autoimmune destruction of beta cells eliminates insulin production. In type 2 diabetes, insulin resistance and progressive beta cell dysfunction lead to hyperglycemia.",
          "Nursing students should understand that glucose values guide clinical decisions at every stage: fasting glucose for diabetes diagnosis (≥7.0 mmol/L or ≥126 mg/dL), random glucose for emergency assessment, HbA1c for long-term glycemic control, and bedside glucometer readings for insulin titration. Each of these may be reported in either unit system depending on location.",
          "In critical care, tight glycemic control (typically targeting 7.8–10.0 mmol/L or 140–180 mg/dL) reduces mortality in ICU patients. In obstetrics, gestational diabetes screening uses a 50g glucose challenge test with different threshold criteria in Canadian vs U.S. practice guidelines.",
        ],
      },
      nursingExamples: {
        heading: "Glucose Conversion Examples",
        examples: [
          { label: "Normal Fasting", siValue: "5.0 mmol/L", convValue: "90 mg/dL", interpretation: "Normal fasting glucose — no intervention needed", color: "bg-green-50/50" },
          { label: "Prediabetes", siValue: "6.5 mmol/L", convValue: "117 mg/dL", interpretation: "Impaired fasting glucose — lifestyle counseling indicated", color: "bg-yellow-50/50" },
          { label: "Diabetic (Fasting)", siValue: "8.0 mmol/L", convValue: "144 mg/dL", interpretation: "Elevated — assess insulin/medication adherence", color: "bg-orange-50/50" },
          { label: "Hypoglycemia", siValue: "2.8 mmol/L", convValue: "50 mg/dL", interpretation: "Symptomatic hypo — give 15g fast-acting carb, recheck in 15 min", color: "bg-red-50/50" },
          { label: "Severe Hyperglycemia", siValue: "25.0 mmol/L", convValue: "450 mg/dL", interpretation: "DKA/HHS risk — check ketones, assess for acidosis", color: "bg-red-50/50" },
          { label: "ICU Target", siValue: "8.5 mmol/L", convValue: "153 mg/dL", interpretation: "Within typical ICU glucose target range (140–180 mg/dL)", color: "bg-blue-50/50" },
        ],
      },
      referenceChart: {
        heading: "Glucose Quick-Reference Chart",
        rows: [
          { condition: "Hypoglycemia (severe)", siRange: "<2.8 mmol/L", convRange: "<50 mg/dL", significance: "Neurological symptoms, seizure risk — treat immediately" },
          { condition: "Hypoglycemia (mild)", siRange: "2.8–3.9 mmol/L", convRange: "50–70 mg/dL", significance: "Shakiness, sweating — give 15g carbs, recheck" },
          { condition: "Normal (fasting)", siRange: "3.9–5.5 mmol/L", convRange: "70–100 mg/dL", significance: "Target range for fasting glucose" },
          { condition: "Prediabetes (fasting)", siRange: "5.6–6.9 mmol/L", convRange: "100–125 mg/dL", significance: "Impaired fasting glucose — screen for diabetes" },
          { condition: "Diabetes (fasting)", siRange: "≥7.0 mmol/L", convRange: "≥126 mg/dL", significance: "Diagnostic threshold for diabetes mellitus" },
          { condition: "DKA / HHS range", siRange: ">13.9 mmol/L", convRange: ">250 mg/dL", significance: "Assess for ketoacidosis or hyperosmolar state" },
          { condition: "Critical high", siRange: ">27.8 mmol/L", convRange: ">500 mg/dL", significance: "Medical emergency — aggressive IV insulin, fluid resuscitation" },
        ],
      },
    },
    faqs: [
      { question: "What is the easiest way to convert glucose mmol/L to mg/dL?", answer: "Multiply by 18. For example, 5.5 mmol/L × 18 = 99 mg/dL. This is the most common shortcut used by nurses and healthcare providers. The precise factor is 18.0182, but 18 is accurate enough for clinical purposes." },
      { question: "Why is glucose measured differently in Canada and the U.S.?", answer: "Canada adopted the International System of Units (SI) in the 1980s, which expresses glucose in mmol/L (millimoles per liter — counting molecules). The U.S. retained the older conventional system using mg/dL (milligrams per deciliter — measuring mass). Both values represent the same blood glucose concentration." },
      { question: "What is a normal fasting glucose in both units?", answer: "Normal fasting glucose is 3.9–5.5 mmol/L in SI units, which equals 70–100 mg/dL in conventional units. Values above 7.0 mmol/L (126 mg/dL) on two separate occasions are diagnostic for diabetes mellitus." },
      { question: "At what glucose level should I be concerned about hypoglycemia?", answer: "Glucose below 3.9 mmol/L (70 mg/dL) is considered hypoglycemia. Below 2.8 mmol/L (50 mg/dL) is severe and can cause confusion, seizures, and loss of consciousness. The 'Rule of 15' applies: give 15g of fast-acting carbohydrate and recheck in 15 minutes." },
      { question: "Does the NCLEX use mmol/L or mg/dL for glucose?", answer: "NCLEX primarily uses mg/dL (conventional units), but some questions may present SI values. Canadian students should be able to quickly convert between systems. Memorizing the factor of 18 is highly recommended for exam day." },
    ],
    relatedClusterLinks: [
      { href: "/canadian-vs-american-lab-values", label: "Canadian vs American Lab Values", description: "Overview of SI vs conventional units" },
      { href: "/creatinine-umol-l-to-mg-dl", label: "Creatinine Conversion", description: "Creatinine with renal context" },
      { href: "/hemoglobin-g-l-to-g-dl", label: "Hemoglobin Conversion", description: "Hemoglobin with anemia context" },
      { href: "/cholesterol-triglyceride-unit-conversion", label: "Cholesterol & Triglyceride Conversion", description: "Lipid panel conversions" },
    ],
    externalLinks: [
      { href: "/si-to-conventional-units-converter", label: "Full SI ↔ Conventional Converter", description: "Interactive converter for all lab values" },
      { href: "/lab-values", label: "Lab Values Interpretation", description: "Clinical lab scenarios" },
      { href: "/med-math", label: "Med Math Practice", description: "Dosage calculations including insulin" },
      { href: "/medication-mastery", label: "Pharmacology & Medication Mastery", description: "Drug classes including insulin" },
    ],
  },

  "creatinine-umol-l-to-mg-dl": {
    slug: "creatinine-umol-l-to-mg-dl",
    title: "Creatinine µmol/L to mg/dL Conversion",
    metaTitle: "Creatinine µmol/L to mg/dL Conversion — Renal Function Calculator | NurseNest",
    metaDescription: "Convert creatinine between µmol/L (SI/Canadian) and mg/dL (conventional/U.S.). Includes renal function context, GFR interpretation, CKD staging, and nursing clinical pearls.",
    keywords: "creatinine umol/L to mg/dL, creatinine conversion, kidney function creatinine, renal creatinine levels, nursing creatinine, GFR creatinine",
    h1: "Creatinine Conversion: µmol/L ↔ mg/dL",
    heroDescription: "Serum creatinine is the cornerstone lab value for assessing kidney function. Canada reports creatinine in µmol/L while the U.S. uses mg/dL. The conversion factor is 88.42 — divide µmol/L by 88.42 to get mg/dL. Understanding creatinine in both systems is essential for evaluating GFR, staging chronic kidney disease, and adjusting renally-cleared medications.",
    converterIds: ["creatinine"],
    breadcrumbLabel: "Creatinine Conversion",
    sections: {
      whatIsThis: {
        heading: "Understanding Creatinine and Kidney Function",
        paragraphs: [
          "Creatinine is a waste product produced by muscle metabolism (breakdown of creatine phosphate). It is filtered by the kidneys and excreted in urine at a fairly constant rate. When kidney function declines, creatinine accumulates in the blood — making serum creatinine a reliable marker of glomerular filtration rate (GFR).",
          "In SI units (used in Canada), creatinine is measured in micromoles per liter (µmol/L). In conventional units (used in the U.S.), it is measured in milligrams per deciliter (mg/dL). To convert: mg/dL = µmol/L ÷ 88.42 (or µmol/L = mg/dL × 88.42). The molecular weight of creatinine is 113.12 g/mol.",
          "Important nuance: creatinine values must be interpreted in context. A 'normal' creatinine of 1.0 mg/dL (88 µmol/L) in a muscular young man may actually represent normal kidney function, while the same value in a frail elderly woman could indicate significantly reduced kidney function. This is why eGFR calculations (which account for age, sex, and race) are used alongside raw creatinine values.",
        ],
      },
      whyItMatters: {
        heading: "Why Creatinine Conversion Matters in Nursing",
        items: [
          { bold: "Medication dose adjustment:", text: "Many drugs (vancomycin, metformin, ACE inhibitors, aminoglycosides) require dose adjustment based on creatinine clearance or eGFR. Misreading the unit could lead to overdosing or underdosing." },
          { bold: "CKD staging:", text: "Chronic kidney disease is staged by eGFR, which is calculated from serum creatinine. Knowing which unit system is being used prevents staging errors." },
          { bold: "Contrast dye decisions:", text: "Before CT with IV contrast, creatinine is checked. The threshold for holding contrast differs if you're reading µmol/L vs mg/dL — confusing the units could delay necessary imaging or expose kidneys to unnecessary risk." },
          { bold: "Acute kidney injury detection:", text: "AKI is defined by a rise in creatinine (>26.5 µmol/L or >0.3 mg/dL within 48 hours). Recognizing this threshold in both systems enables early intervention." },
          { bold: "NCLEX renal questions:", text: "Renal nursing is heavily tested on NCLEX. Questions present creatinine values — you must know whether the value is normal or abnormal in whichever unit system is used." },
        ],
      },
      clinicalContext: {
        heading: "Creatinine in Renal Nursing",
        paragraphs: [
          "The kidneys filter approximately 180 liters of blood daily. When nephrons are damaged (by diabetes, hypertension, glomerulonephritis, or toxins), glomerular filtration rate drops and creatinine rises. However, creatinine is a lagging indicator — GFR must decline by approximately 50% before serum creatinine rises above normal range. This means early kidney disease can be present with a 'normal' creatinine.",
          "In acute kidney injury (AKI), creatinine rises rapidly (hours to days) and is classified by the KDIGO criteria: Stage 1 (1.5–1.9× baseline or ≥26.5 µmol/L / ≥0.3 mg/dL increase), Stage 2 (2.0–2.9× baseline), Stage 3 (3.0× baseline or creatinine ≥354 µmol/L / ≥4.0 mg/dL, or initiation of dialysis).",
          "Nursing considerations include monitoring I&O carefully, holding nephrotoxic medications when creatinine is rising, assessing for fluid overload, and educating patients about kidney-protective strategies (hydration, avoiding NSAIDs, controlling blood pressure and blood sugar).",
        ],
      },
      nursingExamples: {
        heading: "Creatinine Conversion Examples",
        examples: [
          { label: "Normal Adult", siValue: "88 µmol/L", convValue: "1.0 mg/dL", interpretation: "Normal kidney function — no concerns", color: "bg-green-50/50" },
          { label: "Mildly Elevated", siValue: "133 µmol/L", convValue: "1.5 mg/dL", interpretation: "Mild elevation — assess hydration, medications, trends", color: "bg-yellow-50/50" },
          { label: "CKD Stage 3", siValue: "177 µmol/L", convValue: "2.0 mg/dL", interpretation: "Significant impairment — renal diet, dose adjustments", color: "bg-orange-50/50" },
          { label: "Severe Elevation", siValue: "354 µmol/L", convValue: "4.0 mg/dL", interpretation: "KDIGO Stage 3 AKI threshold — evaluate for dialysis", color: "bg-red-50/50" },
        ],
      },
      referenceChart: {
        heading: "Creatinine Quick-Reference Chart",
        rows: [
          { condition: "Normal (male)", siRange: "62–106 µmol/L", convRange: "0.7–1.2 mg/dL", significance: "Baseline kidney function" },
          { condition: "Normal (female)", siRange: "44–80 µmol/L", convRange: "0.5–0.9 mg/dL", significance: "Lower due to less muscle mass" },
          { condition: "Mild impairment", siRange: "106–177 µmol/L", convRange: "1.2–2.0 mg/dL", significance: "CKD Stage 2–3 range" },
          { condition: "Moderate impairment", siRange: "177–354 µmol/L", convRange: "2.0–4.0 mg/dL", significance: "CKD Stage 3–4, medication adjustments needed" },
          { condition: "Severe / dialysis range", siRange: ">354 µmol/L", convRange: ">4.0 mg/dL", significance: "Consider dialysis, urgent nephrology consult" },
          { condition: "AKI increase threshold", siRange: "≥26.5 µmol/L rise", convRange: "≥0.3 mg/dL rise", significance: "Within 48 hours = Stage 1 AKI" },
        ],
      },
    },
    faqs: [
      { question: "How do I convert creatinine from µmol/L to mg/dL?", answer: "Divide by 88.42. For example, 150 µmol/L ÷ 88.42 = 1.7 mg/dL. To convert the other way, multiply mg/dL by 88.42. The factor comes from creatinine's molecular weight (113.12 g/mol) and unit scaling." },
      { question: "What is a normal creatinine level?", answer: "Normal serum creatinine is approximately 62–106 µmol/L (0.7–1.2 mg/dL) for adult males and 44–80 µmol/L (0.5–0.9 mg/dL) for adult females. Values above these ranges suggest impaired kidney function, though interpretation must consider age, muscle mass, and clinical context." },
      { question: "Why can a 'normal' creatinine still indicate kidney disease?", answer: "Creatinine is produced by muscles and filtered by kidneys. In elderly or low-muscle-mass patients, less creatinine is produced — so even with significantly reduced GFR, serum creatinine may remain within 'normal' range. This is why eGFR (estimated glomerular filtration rate) is a better indicator than raw creatinine alone." },
      { question: "What medications require dose adjustment based on creatinine?", answer: "Many medications are renally cleared and require adjustment: metformin (hold if eGFR <30), vancomycin, aminoglycosides (gentamicin, tobramycin), digoxin, enoxaparin, ACE inhibitors/ARBs, and certain antibiotics. Always check renal dosing guidelines when creatinine is elevated." },
    ],
    relatedClusterLinks: [
      { href: "/canadian-vs-american-lab-values", label: "Canadian vs American Lab Values", description: "Overview of SI vs conventional units" },
      { href: "/urea-to-bun-conversion-nursing", label: "Urea to BUN Conversion", description: "BUN — the other key renal marker" },
      { href: "/glucose-mmol-l-to-mg-dl", label: "Glucose Conversion", description: "Glucose with diabetes context" },
      { href: "/calcium-mmol-l-to-mg-dl", label: "Calcium Conversion", description: "Calcium — affected by renal disease" },
    ],
    externalLinks: [
      { href: "/si-to-conventional-units-converter", label: "Full SI ↔ Conventional Converter", description: "Interactive converter for all lab values" },
      { href: "/lab-values", label: "Lab Values Interpretation", description: "Renal clinical scenarios" },
      { href: "/med-math", label: "Med Math Practice", description: "Dose calculations" },
    ],
  },

  "hemoglobin-g-l-to-g-dl": {
    slug: "hemoglobin-g-l-to-g-dl",
    title: "Hemoglobin g/L to g/dL Conversion",
    metaTitle: "Hemoglobin g/L to g/dL Conversion — Anemia & Transfusion Calculator | NurseNest",
    metaDescription: "Convert hemoglobin between g/L (SI/Canadian) and g/dL (conventional/U.S.). Includes anemia classification, transfusion thresholds, and nursing clinical context for blood transfusion decisions.",
    keywords: "hemoglobin g/L to g/dL, hemoglobin conversion, anemia hemoglobin levels, blood transfusion threshold, nursing hemoglobin, Hgb conversion",
    h1: "Hemoglobin Conversion: g/L ↔ g/dL",
    heroDescription: "Hemoglobin is the oxygen-carrying protein in red blood cells and is the primary lab value used to diagnose anemia and guide blood transfusion decisions. Canada reports hemoglobin in g/L while the U.S. uses g/dL. The conversion is simple: divide g/L by 10 to get g/dL (or multiply g/dL by 10). A hemoglobin of 120 g/L = 12.0 g/dL.",
    converterIds: ["hemoglobin"],
    breadcrumbLabel: "Hemoglobin Conversion",
    sections: {
      whatIsThis: {
        heading: "Understanding Hemoglobin Measurement",
        paragraphs: [
          "Hemoglobin (Hgb or Hb) is a protein in red blood cells that binds and transports oxygen from the lungs to tissues. It is measured as a concentration — the amount of hemoglobin per volume of blood. In SI units, this is grams per liter (g/L); in conventional units, grams per deciliter (g/dL).",
          "The conversion between these units is the simplest of all lab conversions: since 1 dL = 0.1 L, just divide g/L by 10 to get g/dL (or move the decimal point one place to the left). For example: 140 g/L = 14.0 g/dL. No molecular weight calculation is needed because both units measure mass per volume — just at different scales.",
          "Despite this simple conversion, unit confusion can still cause clinical errors. A hemoglobin of '70' could be 70 g/L (critically low, transfusion needed) or 7.0 g/dL (same value, different expression). Context and unit awareness prevent misinterpretation.",
        ],
      },
      whyItMatters: {
        heading: "Why Hemoglobin Conversion Matters in Nursing",
        items: [
          { bold: "Transfusion decisions:", text: "Blood transfusion is typically considered when hemoglobin falls below 70 g/L (7.0 g/dL) in hemodynamically stable patients. Knowing this threshold in both systems prevents unnecessary delays in ordering blood products." },
          { bold: "Anemia classification:", text: "Mild anemia (100–120 g/L or 10–12 g/dL in females), moderate (70–100 g/L or 7–10 g/dL), and severe (<70 g/L or <7 g/dL) guide treatment urgency and approach." },
          { bold: "Surgical clearance:", text: "Pre-operative hemoglobin assessment determines whether surgery can safely proceed. Different institutions may use different unit systems, and perioperative nurses must interpret both." },
          { bold: "Postpartum hemorrhage:", text: "In obstetric nursing, hemoglobin monitoring after delivery guides transfusion and iron supplementation decisions. Quick conversion between units supports rapid clinical assessment." },
          { bold: "Chronic disease monitoring:", text: "Patients with CKD, cancer, or chronic inflammatory conditions often have anemia. Serial hemoglobin monitoring requires consistent unit interpretation." },
        ],
      },
      clinicalContext: {
        heading: "Hemoglobin in Hematology & Transfusion Nursing",
        paragraphs: [
          "Anemia is defined as hemoglobin below the sex-specific normal range: <120 g/L (12.0 g/dL) for adult females and <140 g/L (14.0 g/dL) for adult males. The cause of anemia is determined by additional labs: MCV (mean corpuscular volume) classifies it as microcytic, normocytic, or macrocytic; reticulocyte count assesses bone marrow response; iron studies, B12, and folate identify nutritional deficiencies.",
          "The restrictive transfusion strategy (transfuse at Hgb <70 g/L / <7.0 g/dL) is supported by evidence showing equivalent or better outcomes compared to liberal strategies (transfuse at <100 g/L / <10 g/dL) in most patient populations. Exceptions include acute coronary syndrome (threshold may be higher) and active hemorrhage (transfuse based on clinical assessment, not just hemoglobin level).",
          "Nursing responsibilities during transfusion include verifying blood type and patient identity (two-nurse check), monitoring vital signs before, during (at 15 min, 30 min, and hourly), and after transfusion. Watch for transfusion reactions: febrile non-hemolytic (most common), allergic, acute hemolytic (most dangerous — stop transfusion immediately), and TRALI (transfusion-related acute lung injury).",
        ],
      },
      nursingExamples: {
        heading: "Hemoglobin Conversion Examples",
        examples: [
          { label: "Normal Female", siValue: "135 g/L", convValue: "13.5 g/dL", interpretation: "Within normal range — no intervention needed", color: "bg-green-50/50" },
          { label: "Mild Anemia", siValue: "105 g/L", convValue: "10.5 g/dL", interpretation: "Mild anemia — investigate cause, consider iron studies", color: "bg-yellow-50/50" },
          { label: "Moderate Anemia", siValue: "85 g/L", convValue: "8.5 g/dL", interpretation: "Moderate — symptoms may include fatigue, tachycardia", color: "bg-orange-50/50" },
          { label: "Transfusion Threshold", siValue: "68 g/L", convValue: "6.8 g/dL", interpretation: "Below transfusion threshold — prepare for blood products", color: "bg-red-50/50" },
        ],
      },
      referenceChart: {
        heading: "Hemoglobin Quick-Reference Chart",
        rows: [
          { condition: "Normal (male)", siRange: "140–180 g/L", convRange: "14.0–18.0 g/dL", significance: "Normal range" },
          { condition: "Normal (female)", siRange: "120–160 g/L", convRange: "12.0–16.0 g/dL", significance: "Normal range" },
          { condition: "Mild anemia", siRange: "100–120 g/L (F) / 100–140 (M)", convRange: "10–12 (F) / 10–14 (M) g/dL", significance: "Investigate cause" },
          { condition: "Moderate anemia", siRange: "70–100 g/L", convRange: "7.0–10.0 g/dL", significance: "Symptomatic — consider treatment" },
          { condition: "Severe anemia", siRange: "<70 g/L", convRange: "<7.0 g/dL", significance: "Transfusion threshold in stable patients" },
          { condition: "Polycythemia", siRange: ">180 g/L (M) / >160 (F)", convRange: ">18.0 (M) / >16.0 (F) g/dL", significance: "Investigate — risk of thrombosis" },
        ],
      },
    },
    faqs: [
      { question: "How do I convert hemoglobin from g/L to g/dL?", answer: "Divide by 10. This is the simplest lab conversion: 120 g/L ÷ 10 = 12.0 g/dL. To convert back, multiply g/dL by 10. Both units measure the same thing (mass of hemoglobin per volume of blood), just at different scales (liters vs deciliters)." },
      { question: "At what hemoglobin level is a blood transfusion needed?", answer: "In hemodynamically stable patients, the restrictive transfusion threshold is typically <70 g/L (<7.0 g/dL). For patients with acute coronary syndrome, a threshold of <80 g/L (<8.0 g/dL) may be used. In active hemorrhage, transfuse based on clinical assessment and hemodynamic status, not hemoglobin alone." },
      { question: "What are normal hemoglobin levels for men and women?", answer: "Adult males: 140–180 g/L (14.0–18.0 g/dL). Adult females: 120–160 g/L (12.0–16.0 g/dL). The difference is primarily due to the effect of testosterone on erythropoiesis and menstrual blood loss in females. Pregnant women have lower values due to hemodilution." },
      { question: "Why is hemoglobin lower during pregnancy?", answer: "Plasma volume increases by 40–50% during pregnancy, while red blood cell mass increases by only 20–30%. This hemodilution causes a physiological decrease in hemoglobin concentration. Normal pregnancy hemoglobin is approximately 110 g/L (11.0 g/dL) in the second trimester." },
    ],
    relatedClusterLinks: [
      { href: "/canadian-vs-american-lab-values", label: "Canadian vs American Lab Values", description: "Overview of SI vs conventional units" },
      { href: "/bilirubin-umol-l-to-mg-dl", label: "Bilirubin Conversion", description: "Bilirubin — related to hemoglobin breakdown" },
      { href: "/glucose-mmol-l-to-mg-dl", label: "Glucose Conversion", description: "Glucose with diabetes context" },
      { href: "/creatinine-umol-l-to-mg-dl", label: "Creatinine Conversion", description: "Renal function assessment" },
    ],
    externalLinks: [
      { href: "/si-to-conventional-units-converter", label: "Full SI ↔ Conventional Converter", description: "Interactive converter for all lab values" },
      { href: "/lab-values", label: "Lab Values Interpretation", description: "Clinical lab scenarios" },
      { href: "/blood-transfusion-simulator", label: "Blood Transfusion Simulator", description: "Practice transfusion safety protocols" },
    ],
  },

  "bilirubin-umol-l-to-mg-dl": {
    slug: "bilirubin-umol-l-to-mg-dl",
    title: "Bilirubin µmol/L to mg/dL Conversion",
    metaTitle: "Bilirubin µmol/L to mg/dL Conversion — Liver & Neonatal Jaundice Calculator | NurseNest",
    metaDescription: "Convert bilirubin between µmol/L (SI/Canadian) and mg/dL (conventional/U.S.). Includes liver function context, neonatal jaundice thresholds, phototherapy guidelines, and nursing clinical pearls.",
    keywords: "bilirubin umol/L to mg/dL, bilirubin conversion, neonatal jaundice bilirubin, liver function bilirubin, nursing bilirubin, newborn bilirubin levels",
    h1: "Bilirubin Conversion: µmol/L ↔ mg/dL",
    heroDescription: "Bilirubin is a yellow pigment produced from hemoglobin breakdown that is processed by the liver and excreted in bile. Elevated bilirubin causes jaundice — visible yellowing of the skin and sclera. Canada reports bilirubin in µmol/L while the U.S. uses mg/dL. The conversion factor is 17.1: divide µmol/L by 17.1 to get mg/dL.",
    converterIds: ["bilirubin"],
    breadcrumbLabel: "Bilirubin Conversion",
    sections: {
      whatIsThis: {
        heading: "Understanding Bilirubin",
        paragraphs: [
          "Bilirubin is produced when red blood cells reach the end of their lifespan (approximately 120 days) and are broken down by the reticuloendothelial system (primarily in the spleen). The heme portion of hemoglobin is converted to unconjugated (indirect) bilirubin, which travels to the liver bound to albumin. The liver conjugates bilirubin with glucuronic acid, making it water-soluble (conjugated/direct bilirubin), which is then excreted into bile.",
          "In SI units, bilirubin is measured in micromoles per liter (µmol/L). In conventional units, it is measured in milligrams per deciliter (mg/dL). The conversion factor is 17.1 (based on bilirubin's molecular weight of 584.66 g/mol): mg/dL = µmol/L ÷ 17.1.",
          "Bilirubin is clinically significant in two major contexts: liver disease (in adults) and neonatal jaundice (in newborns). The interpretation, thresholds, and treatment decisions differ dramatically between these two populations, making accurate unit conversion essential.",
        ],
      },
      whyItMatters: {
        heading: "Why Bilirubin Conversion Matters in Nursing",
        items: [
          { bold: "Neonatal jaundice management:", text: "Phototherapy and exchange transfusion thresholds for newborn jaundice are based on total serum bilirubin. Canadian NICUs use µmol/L; U.S. references use mg/dL. A bilirubin of 340 µmol/L (≈20 mg/dL) in a 72-hour-old term infant typically triggers phototherapy — but only if you read the units correctly." },
          { bold: "Liver disease assessment:", text: "Elevated bilirubin is a hallmark of hepatic dysfunction. Distinguishing between direct and indirect bilirubin helps differentiate pre-hepatic (hemolysis), hepatic (hepatitis, cirrhosis), and post-hepatic (obstructive) causes of jaundice." },
          { bold: "Post-surgical monitoring:", text: "After liver surgery or transplant, bilirubin trends indicate graft function. Rising bilirubin post-operatively may signal rejection or bile duct complications." },
          { bold: "Drug-induced liver injury:", text: "Many medications (acetaminophen, statins, antibiotics) can elevate bilirubin. Monitoring bilirubin in both unit systems helps interpret drug safety data from different countries." },
        ],
      },
      clinicalContext: {
        heading: "Bilirubin in Liver & Neonatal Nursing",
        paragraphs: [
          "In adults, total bilirubin consists of direct (conjugated) and indirect (unconjugated) fractions. Predominantly indirect hyperbilirubinemia suggests hemolytic anemia or Gilbert syndrome. Predominantly direct hyperbilirubinemia suggests obstructive causes (gallstones, tumors) or hepatocellular damage (hepatitis, cirrhosis). Jaundice becomes clinically visible when total bilirubin exceeds approximately 34–43 µmol/L (2.0–2.5 mg/dL).",
          "In neonates, physiological jaundice is common (affecting 60% of term and 80% of preterm infants) due to immature liver enzymes and increased red blood cell turnover. Pathological jaundice — appearing within 24 hours of birth, rising rapidly, or exceeding age-specific thresholds — requires investigation and treatment. The Bhutani nomogram (hour-specific bilirubin chart) guides management decisions.",
          "Nursing assessments for jaundice include cephalocaudal progression assessment (jaundice progresses from head to feet as bilirubin rises), transcutaneous bilirubin screening, monitoring feeding adequacy (poor feeding increases enterohepatic recirculation of bilirubin), and assessing for risk factors (ABO incompatibility, Rh disease, prematurity, bruising from birth trauma).",
        ],
      },
      nursingExamples: {
        heading: "Bilirubin Conversion Examples",
        examples: [
          { label: "Normal Adult", siValue: "12 µmol/L", convValue: "0.7 mg/dL", interpretation: "Within normal range", color: "bg-green-50/50" },
          { label: "Mild Elevation", siValue: "34 µmol/L", convValue: "2.0 mg/dL", interpretation: "Jaundice may become visible — assess sclera", color: "bg-yellow-50/50" },
          { label: "Neonatal (48h term)", siValue: "200 µmol/L", convValue: "11.7 mg/dL", interpretation: "Moderate — check nomogram for phototherapy threshold", color: "bg-orange-50/50" },
          { label: "Severe (hepatic failure)", siValue: "340 µmol/L", convValue: "19.9 mg/dL", interpretation: "Severe — assess for encephalopathy, liver failure workup", color: "bg-red-50/50" },
        ],
      },
      referenceChart: {
        heading: "Bilirubin Quick-Reference Chart",
        rows: [
          { condition: "Normal (total)", siRange: "3.4–20.5 µmol/L", convRange: "0.2–1.2 mg/dL", significance: "Normal bilirubin metabolism" },
          { condition: "Visible jaundice onset", siRange: ">34 µmol/L", convRange: ">2.0 mg/dL", significance: "Scleral icterus becomes detectable" },
          { condition: "Moderate elevation", siRange: "34–170 µmol/L", convRange: "2.0–10.0 mg/dL", significance: "Investigate cause: hepatic, obstructive, hemolytic" },
          { condition: "Severe (adult)", siRange: ">170 µmol/L", convRange: ">10.0 mg/dL", significance: "Significant liver dysfunction — urgent workup" },
          { condition: "Neonatal phototherapy (term, 48h)", siRange: "~260 µmol/L", convRange: "~15 mg/dL", significance: "Approximate phototherapy threshold (varies by age)" },
          { condition: "Exchange transfusion risk", siRange: ">425 µmol/L", convRange: ">25 mg/dL", significance: "Risk of kernicterus — urgent intervention" },
        ],
      },
    },
    faqs: [
      { question: "How do I convert bilirubin from µmol/L to mg/dL?", answer: "Divide by 17.1. For example, 85.5 µmol/L ÷ 17.1 = 5.0 mg/dL. To convert the other way, multiply mg/dL by 17.1. The factor is based on bilirubin's molecular weight (584.66 g/mol)." },
      { question: "What causes elevated bilirubin in newborns?", answer: "Neonatal jaundice results from a combination of factors: increased red blood cell breakdown (neonatal RBCs have shorter lifespan), immature liver conjugation enzymes (UGT1A1), and increased enterohepatic circulation. Pathological causes include blood type incompatibility (ABO, Rh), G6PD deficiency, sepsis, and breast milk jaundice." },
      { question: "When is phototherapy needed for neonatal jaundice?", answer: "Phototherapy thresholds depend on the infant's age in hours and risk factors. For a healthy term infant at 48 hours, phototherapy is typically started at approximately 260 µmol/L (15 mg/dL). For high-risk infants (premature, hemolytic disease), thresholds are lower. The Bhutani nomogram provides hour-specific guidelines." },
      { question: "What is the difference between direct and indirect bilirubin?", answer: "Indirect (unconjugated) bilirubin has not yet been processed by the liver — elevated levels suggest hemolysis or liver uptake problems. Direct (conjugated) bilirubin has been processed by the liver — elevated levels suggest bile duct obstruction or liver excretion problems. Total bilirubin = direct + indirect." },
    ],
    relatedClusterLinks: [
      { href: "/canadian-vs-american-lab-values", label: "Canadian vs American Lab Values", description: "Overview of SI vs conventional units" },
      { href: "/hemoglobin-g-l-to-g-dl", label: "Hemoglobin Conversion", description: "Hemoglobin — bilirubin comes from its breakdown" },
      { href: "/creatinine-umol-l-to-mg-dl", label: "Creatinine Conversion", description: "Renal function assessment" },
      { href: "/cholesterol-triglyceride-unit-conversion", label: "Cholesterol & Triglyceride Conversion", description: "Lipid panel conversions" },
    ],
    externalLinks: [
      { href: "/si-to-conventional-units-converter", label: "Full SI ↔ Conventional Converter", description: "Interactive converter for all lab values" },
      { href: "/lab-values", label: "Lab Values Interpretation", description: "Clinical lab scenarios" },
      { href: "/blood-transfusion-simulator", label: "Blood Transfusion Simulator", description: "Transfusion safety practice" },
    ],
  },

  "calcium-mmol-l-to-mg-dl": {
    slug: "calcium-mmol-l-to-mg-dl",
    title: "Calcium mmol/L to mg/dL Conversion",
    metaTitle: "Calcium mmol/L to mg/dL Conversion — Hypo/Hypercalcemia Calculator | NurseNest",
    metaDescription: "Convert calcium between mmol/L (SI/Canadian) and mg/dL (conventional/U.S.). Includes hypo/hypercalcemia clinical context, corrected calcium formula, ECG changes, and nursing assessment pearls.",
    keywords: "calcium mmol/L to mg/dL, calcium conversion, hypocalcemia hypercalcemia, corrected calcium, nursing calcium levels, Trousseau Chvostek sign",
    h1: "Calcium Conversion: mmol/L ↔ mg/dL",
    heroDescription: "Calcium is critical for muscle contraction, nerve conduction, blood clotting, and cardiac rhythm. Abnormal calcium levels can cause life-threatening arrhythmias, seizures, or cardiac arrest. Canada reports calcium in mmol/L while the U.S. uses mg/dL. The conversion factor is 4.0: multiply mmol/L by 4.0 to get mg/dL.",
    converterIds: ["calcium"],
    breadcrumbLabel: "Calcium Conversion",
    sections: {
      whatIsThis: {
        heading: "Understanding Calcium Measurement",
        paragraphs: [
          "Total serum calcium exists in three forms: approximately 45% is bound to albumin, 10% is complexed with anions (phosphate, citrate), and 45% is ionized (free) — which is the physiologically active form. Standard lab tests typically measure total calcium, which must be interpreted in the context of albumin levels.",
          "In SI units, calcium is expressed in millimoles per liter (mmol/L). In conventional units, it is expressed in milligrams per deciliter (mg/dL). The conversion: mg/dL = mmol/L × 4.008 (clinically rounded to 4.0). This factor comes from calcium's atomic weight (40.08 g/mol).",
          "The corrected calcium formula accounts for low albumin: Corrected Ca (mg/dL) = Measured Ca + 0.8 × (4.0 − Albumin). In SI: Corrected Ca (mmol/L) = Measured Ca + 0.02 × (40 − Albumin in g/L). This is essential because hypoalbuminemia (common in hospitalized patients) artificially lowers total calcium without affecting the physiologically important ionized fraction.",
        ],
      },
      whyItMatters: {
        heading: "Why Calcium Conversion Matters in Nursing",
        items: [
          { bold: "Cardiac monitoring:", text: "Calcium directly affects cardiac conduction. Hypocalcemia prolongs QT interval (risk of torsades de pointes), while hypercalcemia shortens QT and can cause arrhythmias. Both are ECG emergencies." },
          { bold: "Neuromuscular assessment:", text: "Hypocalcemia causes tetany, Trousseau sign (carpal spasm with BP cuff inflation), and Chvostek sign (facial twitching with nerve tap). These are classic nursing assessment findings that must be correlated with calcium levels in either unit system." },
          { bold: "Post-thyroidectomy monitoring:", text: "After thyroid or parathyroid surgery, calcium must be monitored q4–6h because of the risk of iatrogenic hypoparathyroidism. Canadian and U.S. surgical centers use different units." },
          { bold: "Oncology nursing:", text: "Hypercalcemia of malignancy is a common oncologic emergency (especially in breast cancer, lung cancer, and multiple myeloma). Aggressive IV hydration and bisphosphonates are first-line treatments." },
          { bold: "CKD mineral-bone disorder:", text: "Chronic kidney disease disrupts calcium-phosphorus balance. Understanding calcium in both systems is essential for managing renal patients." },
        ],
      },
      clinicalContext: {
        heading: "Calcium in Medical-Surgical Nursing",
        paragraphs: [
          "Calcium homeostasis is maintained by three hormones: parathyroid hormone (PTH) raises calcium by stimulating bone resorption, renal reabsorption, and activation of vitamin D; calcitonin lowers calcium (minor role); and active vitamin D (1,25-dihydroxyvitamin D) increases intestinal calcium absorption. Disruption of any of these mechanisms leads to calcium imbalance.",
          "Hypocalcemia (Ca <2.12 mmol/L or <8.5 mg/dL) is most commonly caused by hypoparathyroidism (post-surgical), vitamin D deficiency, chronic kidney disease, and hypomagnesemia (magnesium is required for PTH secretion). Acute symptoms include perioral numbness, muscle cramps, tetany, laryngospasm, and seizures. Treatment: IV calcium gluconate (preferred over calcium chloride for peripheral IV due to lower tissue necrosis risk).",
          "Hypercalcemia (Ca >2.62 mmol/L or >10.5 mg/dL) presents with the mnemonic 'stones, bones, groans, moans, and psychiatric overtones' — renal stones, bone pain, abdominal pain/constipation, fatigue, and confusion. Severe hypercalcemia (>3.5 mmol/L or >14 mg/dL) is a medical emergency requiring aggressive IV normal saline hydration, calcitonin, and bisphosphonates.",
        ],
      },
      nursingExamples: {
        heading: "Calcium Conversion Examples",
        examples: [
          { label: "Normal", siValue: "2.35 mmol/L", convValue: "9.4 mg/dL", interpretation: "Normal total calcium — no intervention", color: "bg-green-50/50" },
          { label: "Hypocalcemia", siValue: "1.8 mmol/L", convValue: "7.2 mg/dL", interpretation: "Low — check for Trousseau/Chvostek signs, monitor ECG", color: "bg-orange-50/50" },
          { label: "Hypercalcemia", siValue: "3.2 mmol/L", convValue: "12.8 mg/dL", interpretation: "Elevated — hydrate, assess for malignancy, stones", color: "bg-red-50/50" },
          { label: "Severe Hypercalcemia", siValue: "3.75 mmol/L", convValue: "15.0 mg/dL", interpretation: "Medical emergency — aggressive IV hydration, calcitonin", color: "bg-red-50/50" },
        ],
      },
      referenceChart: {
        heading: "Calcium Quick-Reference Chart",
        rows: [
          { condition: "Normal (total)", siRange: "2.12–2.62 mmol/L", convRange: "8.5–10.5 mg/dL", significance: "Normal calcium balance" },
          { condition: "Mild hypocalcemia", siRange: "1.9–2.12 mmol/L", convRange: "7.6–8.5 mg/dL", significance: "May be asymptomatic — monitor trends" },
          { condition: "Symptomatic hypocalcemia", siRange: "<1.9 mmol/L", convRange: "<7.6 mg/dL", significance: "Tetany, Trousseau, Chvostek — treat IV calcium" },
          { condition: "Mild hypercalcemia", siRange: "2.62–3.0 mmol/L", convRange: "10.5–12.0 mg/dL", significance: "Mild — investigate cause, hydrate" },
          { condition: "Moderate hypercalcemia", siRange: "3.0–3.5 mmol/L", convRange: "12.0–14.0 mg/dL", significance: "Symptomatic — active treatment needed" },
          { condition: "Severe hypercalcemia", siRange: ">3.5 mmol/L", convRange: ">14.0 mg/dL", significance: "Medical emergency — risk of cardiac arrest" },
        ],
      },
    },
    faqs: [
      { question: "How do I convert calcium from mmol/L to mg/dL?", answer: "Multiply by 4.0 (precisely 4.008). For example, 2.5 mmol/L × 4.0 = 10.0 mg/dL. To convert the other way, divide mg/dL by 4.0." },
      { question: "What is corrected calcium and why does it matter?", answer: "Total calcium includes a fraction bound to albumin. When albumin is low (common in hospitalized patients), total calcium appears falsely low even though ionized (active) calcium is normal. Corrected calcium formula: Corrected Ca = Measured Ca + 0.8 × (4.0 − Albumin g/dL). This adjustment prevents unnecessary treatment of pseudo-hypocalcemia." },
      { question: "What are Trousseau and Chvostek signs?", answer: "Trousseau sign: inflate a blood pressure cuff above systolic pressure for 3 minutes — carpal spasm (hand flexion/adduction) indicates hypocalcemia. Chvostek sign: tap the facial nerve anterior to the ear — twitching of the ipsilateral facial muscles indicates hypocalcemia. Both are classic bedside assessments taught in nursing programs." },
      { question: "Why is IV calcium gluconate preferred over calcium chloride for peripheral IV?", answer: "Calcium chloride is 3× more concentrated in elemental calcium and causes severe tissue necrosis if it extravasates from a peripheral IV. Calcium gluconate is safer for peripheral administration. Calcium chloride is reserved for central line administration or cardiac arrest situations where rapid calcium replacement is critical." },
    ],
    relatedClusterLinks: [
      { href: "/canadian-vs-american-lab-values", label: "Canadian vs American Lab Values", description: "Overview of SI vs conventional units" },
      { href: "/creatinine-umol-l-to-mg-dl", label: "Creatinine Conversion", description: "Renal function — CKD affects calcium" },
      { href: "/hemoglobin-g-l-to-g-dl", label: "Hemoglobin Conversion", description: "Hematology context" },
      { href: "/glucose-mmol-l-to-mg-dl", label: "Glucose Conversion", description: "Endocrine context" },
    ],
    externalLinks: [
      { href: "/si-to-conventional-units-converter", label: "Full SI ↔ Conventional Converter", description: "Interactive converter for all lab values" },
      { href: "/lab-values", label: "Lab Values Interpretation", description: "Clinical lab scenarios" },
      { href: "/electrolyte-abg-simulator", label: "Electrolyte & ABG Simulator", description: "Practice electrolyte interpretation" },
    ],
  },

  "urea-to-bun-conversion-nursing": {
    slug: "urea-to-bun-conversion-nursing",
    title: "Urea to BUN Conversion for Nursing",
    metaTitle: "Urea to BUN Conversion — Why It's Not a Simple Relabeling | NurseNest",
    metaDescription: "Convert between urea (mmol/L, SI/Canadian) and BUN (mg/dL, conventional/U.S.). Understand why this conversion involves molecular weight, not just unit relabeling. Includes renal nursing context and clinical interpretation.",
    keywords: "urea to BUN conversion, urea vs BUN, blood urea nitrogen, nursing BUN, kidney function BUN, urea mmol/L to BUN mg/dL",
    h1: "Urea to BUN Conversion: More Than Just Units",
    heroDescription: "Unlike most lab conversions, urea and BUN are not simply the same substance expressed in different units — they measure different molecular entities. SI labs (Canada) report urea (the whole molecule, in mmol/L), while U.S. labs report blood urea nitrogen or BUN (only the nitrogen portion, in mg/dL). This distinction involves molecular weight differences, making this one of the most commonly confused lab conversions in nursing.",
    converterIds: ["urea-bun"],
    breadcrumbLabel: "Urea / BUN Conversion",
    sections: {
      whatIsThis: {
        heading: "Urea vs BUN: What's the Difference?",
        paragraphs: [
          "Urea is a waste product formed in the liver from protein metabolism (via the urea cycle). It is filtered by the kidneys and excreted in urine. Canadian (SI) labs measure the entire urea molecule in millimoles per liter (mmol/L). U.S. (conventional) labs measure only the nitrogen component of urea — hence 'blood urea nitrogen' or BUN — in milligrams per deciliter (mg/dL).",
          "This is NOT a simple unit conversion. The molecular weight of urea is 60.06 g/mol, but BUN only accounts for the two nitrogen atoms (molecular weight of N₂ = 28.02 g/mol). The conversion formula is: BUN (mg/dL) = Urea (mmol/L) × 2.801. Conversely: Urea (mmol/L) = BUN (mg/dL) × 0.357.",
          "This distinction matters because reference ranges are completely different: normal urea is 2.5–7.1 mmol/L, while normal BUN is 7–20 mg/dL. A direct 'multiply by 1' comparison would be dangerously wrong. Understanding that these measure different things — the whole molecule vs just its nitrogen — is fundamental to interpreting renal function correctly across unit systems.",
        ],
      },
      whyItMatters: {
        heading: "Why the Urea/BUN Distinction Matters in Nursing",
        items: [
          { bold: "Renal function assessment:", text: "Urea/BUN is used alongside creatinine to assess kidney function. The BUN-to-creatinine ratio (normally 10:1 to 20:1 in conventional units) helps differentiate prerenal azotemia (>20:1) from intrinsic renal disease (10:1 to 15:1)." },
          { bold: "GI bleed detection:", text: "Upper GI bleeding elevates BUN/urea disproportionately (digested blood is a protein load converted to urea by the liver), while creatinine remains stable. This elevated ratio is a clinical clue to occult GI hemorrhage." },
          { bold: "Dehydration assessment:", text: "Prerenal azotemia from dehydration causes BUN/urea to rise disproportionately to creatinine. Recognizing this pattern requires knowing normal values in whichever unit system you're using." },
          { bold: "Dialysis adequacy:", text: "Urea reduction ratio (URR) and Kt/V are dialysis adequacy measures based on pre- and post-dialysis urea/BUN values. Correct unit interpretation ensures accurate assessment of dialysis effectiveness." },
          { bold: "Avoiding common errors:", text: "Students often assume urea and BUN are the same value in different units. This can lead to dramatically wrong interpretations — a BUN of 7 mg/dL is normal, but a urea of 7 mmol/L is at the upper limit of normal." },
        ],
      },
      clinicalContext: {
        heading: "Urea/BUN in Renal & Critical Care Nursing",
        paragraphs: [
          "Urea is produced in the liver as the end product of protein catabolism. Amino acids are deaminated, and the resulting ammonia is converted to urea via the urea cycle (Krebs-Henseleit cycle). Urea then enters the bloodstream and is filtered by the kidneys — approximately 40–50% is passively reabsorbed in the tubules (more in dehydration, less in volume-expanded states).",
          "In prerenal azotemia (decreased renal perfusion from dehydration, heart failure, or shock), urea/BUN rises disproportionately because slow tubular flow allows more urea reabsorption. This creates the elevated BUN:Cr ratio (>20:1) that is a hallmark of prerenal kidney injury. In intrinsic renal disease, both urea/BUN and creatinine rise proportionally.",
          "Nursing considerations: Monitor urea/BUN trends alongside creatinine, urine output, and fluid balance. In patients with liver cirrhosis, urea production is decreased (because the damaged liver cannot complete the urea cycle), so BUN/urea may be misleadingly low even with impaired kidney function. Always correlate lab values with the clinical picture.",
        ],
      },
      nursingExamples: {
        heading: "Urea/BUN Conversion Examples",
        examples: [
          { label: "Normal", siValue: "5.0 mmol/L (urea)", convValue: "14 mg/dL (BUN)", interpretation: "Normal renal function — both values within range", color: "bg-green-50/50" },
          { label: "Prerenal Elevation", siValue: "15.0 mmol/L (urea)", convValue: "42 mg/dL (BUN)", interpretation: "Elevated — assess hydration status, BUN:Cr ratio", color: "bg-orange-50/50" },
          { label: "GI Bleed Pattern", siValue: "20.0 mmol/L (urea)", convValue: "56 mg/dL (BUN)", interpretation: "BUN disproportionately high — assess for GI bleeding", color: "bg-red-50/50" },
          { label: "Uremia", siValue: "35.0 mmol/L (urea)", convValue: "98 mg/dL (BUN)", interpretation: "Uremic symptoms likely — assess for dialysis need", color: "bg-red-50/50" },
        ],
      },
      referenceChart: {
        heading: "Urea/BUN Quick-Reference Chart",
        rows: [
          { condition: "Normal", siRange: "2.5–7.1 mmol/L (urea)", convRange: "7–20 mg/dL (BUN)", significance: "Normal protein metabolism and renal excretion" },
          { condition: "Mild elevation", siRange: "7.1–14.3 mmol/L", convRange: "20–40 mg/dL", significance: "Assess hydration, protein intake, kidney function" },
          { condition: "Moderate elevation", siRange: "14.3–25.0 mmol/L", convRange: "40–70 mg/dL", significance: "Significant renal impairment or prerenal cause" },
          { condition: "Severe / uremia", siRange: ">25.0 mmol/L", convRange: ">70 mg/dL", significance: "Uremic symptoms — consider dialysis" },
          { condition: "BUN:Cr ratio >20:1", siRange: "N/A (use conventional)", convRange: ">20:1", significance: "Prerenal azotemia pattern" },
        ],
      },
    },
    faqs: [
      { question: "Why can't I just convert urea to BUN by changing units?", answer: "Because they measure different things. Urea measures the entire urea molecule (CO(NH₂)₂, MW 60.06). BUN measures only the nitrogen atoms within urea (2 × N, MW 28.02). The conversion factor 2.801 accounts for this molecular weight difference, not just a unit scale change." },
      { question: "What is the urea to BUN conversion formula?", answer: "BUN (mg/dL) = Urea (mmol/L) × 2.801. Conversely, Urea (mmol/L) = BUN (mg/dL) × 0.357 (or ÷ 2.801). For example, a urea of 5.0 mmol/L = BUN of 14.0 mg/dL." },
      { question: "What does an elevated BUN:Creatinine ratio mean?", answer: "A BUN:Cr ratio >20:1 (in conventional units) suggests prerenal azotemia — the kidneys are underperfused (dehydration, heart failure, shock) causing disproportionate urea reabsorption. A ratio of 10:1 to 15:1 is more typical of intrinsic renal disease. An elevated ratio with GI symptoms may indicate upper GI bleeding." },
      { question: "Can urea/BUN be low? What causes that?", answer: "Yes. Low urea/BUN can result from liver failure (impaired urea cycle), low protein diet, overhydration, or pregnancy (increased GFR and plasma volume expansion). In cirrhosis, a misleadingly low BUN may mask concurrent kidney dysfunction." },
    ],
    relatedClusterLinks: [
      { href: "/canadian-vs-american-lab-values", label: "Canadian vs American Lab Values", description: "Overview of SI vs conventional units" },
      { href: "/creatinine-umol-l-to-mg-dl", label: "Creatinine Conversion", description: "The other key renal function marker" },
      { href: "/calcium-mmol-l-to-mg-dl", label: "Calcium Conversion", description: "Electrolyte affected by renal disease" },
      { href: "/glucose-mmol-l-to-mg-dl", label: "Glucose Conversion", description: "Endocrine context" },
    ],
    externalLinks: [
      { href: "/si-to-conventional-units-converter", label: "Full SI ↔ Conventional Converter", description: "Interactive converter for all lab values" },
      { href: "/lab-values", label: "Lab Values Interpretation", description: "Renal clinical scenarios" },
      { href: "/med-math", label: "Med Math Practice", description: "Dose calculations" },
    ],
  },

  "cholesterol-triglyceride-unit-conversion": {
    slug: "cholesterol-triglyceride-unit-conversion",
    title: "Cholesterol & Triglyceride Unit Conversion",
    metaTitle: "Cholesterol & Triglyceride mmol/L to mg/dL Conversion — Lipid Panel Calculator | NurseNest",
    metaDescription: "Convert total cholesterol, LDL, HDL, and triglycerides between mmol/L (SI/Canadian) and mg/dL (conventional/U.S.). Includes cardiovascular risk context, target values, and nursing clinical pearls.",
    keywords: "cholesterol mmol/L to mg/dL, triglyceride conversion, LDL HDL conversion, lipid panel units, cholesterol unit conversion nursing, cardiovascular cholesterol",
    h1: "Cholesterol & Triglyceride Conversion: mmol/L ↔ mg/dL",
    heroDescription: "A complete lipid panel includes total cholesterol, LDL, HDL, and triglycerides — all reported differently between Canadian (SI, mmol/L) and U.S. (conventional, mg/dL) labs. Cholesterol (total, LDL, HDL) uses a conversion factor of 38.67, while triglycerides use 88.57. This page covers all four lipid values with cardiovascular nursing context.",
    converterIds: ["cholesterol-total", "cholesterol-ldl", "cholesterol-hdl", "triglycerides"],
    breadcrumbLabel: "Cholesterol & Triglyceride Conversion",
    sections: {
      whatIsThis: {
        heading: "Understanding Lipid Panel Units",
        paragraphs: [
          "A lipid panel (also called lipid profile) measures four key blood fats: total cholesterol, LDL cholesterol ('bad' cholesterol), HDL cholesterol ('good' cholesterol), and triglycerides. These values guide cardiovascular risk assessment, statin therapy decisions, and lifestyle counseling.",
          "Total cholesterol, LDL, and HDL all share the same conversion factor of 38.67 because they are all cholesterol molecules (molecular weight 386.65 g/mol). To convert: mg/dL = mmol/L × 38.67. Triglycerides have a different conversion factor of 88.57 (average molecular weight ~885 g/mol) because triglycerides are larger molecules composed of glycerol and three fatty acid chains.",
          "Canadian labs report all lipid values in mmol/L, while U.S. labs use mg/dL. Major cardiovascular guidelines (e.g., Canadian Cardiovascular Society vs. American Heart Association/ACC) use their respective unit systems, making conversion essential when referencing international guidelines or interpreting research from different countries.",
        ],
      },
      whyItMatters: {
        heading: "Why Lipid Conversion Matters in Nursing",
        items: [
          { bold: "Statin therapy decisions:", text: "Guidelines recommend statins for LDL above certain thresholds (e.g., >2.6 mmol/L or >100 mg/dL for moderate risk; >1.8 mmol/L or >70 mg/dL for high risk). Misreading units could mean withholding indicated therapy or overtreating." },
          { bold: "Patient education:", text: "When patients receive lab results in one system and Google values in the other, nurses must help them understand that '5.2 mmol/L total cholesterol' and '200 mg/dL' represent the same borderline-high value." },
          { bold: "Cardiovascular risk assessment:", text: "Framingham Risk Score, ASCVD risk calculator, and other tools use specific unit inputs. Entering mmol/L into a mg/dL field (or vice versa) produces dangerously inaccurate risk scores." },
          { bold: "Pancreatitis risk:", text: "Very high triglycerides (>11.3 mmol/L or >1000 mg/dL) significantly increase pancreatitis risk. Recognizing this threshold in either system triggers urgent intervention." },
        ],
      },
      clinicalContext: {
        heading: "Lipids in Cardiovascular Nursing",
        paragraphs: [
          "Atherosclerosis — the buildup of cholesterol-containing plaques in arterial walls — is the leading cause of myocardial infarction and stroke. LDL cholesterol is the primary driver: oxidized LDL infiltrates the arterial intima, triggers an inflammatory response, and forms the lipid core of atherosclerotic plaques. HDL cholesterol is protective because it facilitates reverse cholesterol transport (removing cholesterol from plaques back to the liver for excretion).",
          "Treatment targets are guided by cardiovascular risk level. For very high-risk patients (prior MI, diabetes + risk factors), LDL targets of <1.4 mmol/L (<55 mg/dL) are recommended by European guidelines, while U.S. guidelines recommend >50% LDL reduction from baseline. Nursing education should address both approaches and their equivalent unit targets.",
          "Triglycerides are metabolized differently from cholesterol. Elevated triglycerides (hypertriglyceridemia) are associated with metabolic syndrome, insulin resistance, and pancreatitis risk. Non-pharmacological management includes weight loss, alcohol reduction, carbohydrate restriction, and omega-3 fatty acid supplementation. Severe hypertriglyceridemia (>5.6 mmol/L or >500 mg/dL) may require fibrate therapy.",
        ],
      },
      nursingExamples: {
        heading: "Lipid Panel Conversion Examples",
        examples: [
          { label: "Desirable Total Cholesterol", siValue: "4.5 mmol/L", convValue: "174 mg/dL", interpretation: "Desirable range — no pharmacological intervention needed", color: "bg-green-50/50" },
          { label: "Optimal LDL", siValue: "2.0 mmol/L", convValue: "77 mg/dL", interpretation: "Optimal LDL — within target for moderate risk", color: "bg-green-50/50" },
          { label: "High LDL", siValue: "4.1 mmol/L", convValue: "159 mg/dL", interpretation: "High LDL — statin therapy likely indicated", color: "bg-orange-50/50" },
          { label: "Protective HDL", siValue: "1.6 mmol/L", convValue: "62 mg/dL", interpretation: "Good HDL — cardiovascular protective effect", color: "bg-blue-50/50" },
          { label: "High Triglycerides", siValue: "3.5 mmol/L", convValue: "310 mg/dL", interpretation: "Elevated — lifestyle modification, assess metabolic syndrome", color: "bg-orange-50/50" },
          { label: "Pancreatitis Risk TG", siValue: "12.0 mmol/L", convValue: "1063 mg/dL", interpretation: "Severe — pancreatitis risk — urgent fibrate therapy", color: "bg-red-50/50" },
        ],
      },
      referenceChart: {
        heading: "Lipid Panel Quick-Reference Chart",
        rows: [
          { condition: "Total Cholesterol (desirable)", siRange: "<5.2 mmol/L", convRange: "<200 mg/dL", significance: "Low cardiovascular risk" },
          { condition: "Total Cholesterol (high)", siRange: "≥6.2 mmol/L", convRange: "≥240 mg/dL", significance: "Increased CV risk — treatment indicated" },
          { condition: "LDL (optimal)", siRange: "<2.6 mmol/L", convRange: "<100 mg/dL", significance: "Target for moderate risk patients" },
          { condition: "LDL (very high risk target)", siRange: "<1.8 mmol/L", convRange: "<70 mg/dL", significance: "Target for very high risk (post-MI, diabetes)" },
          { condition: "HDL (low/protective)", siRange: "<1.0 (M) / <1.3 (F)", convRange: "<40 (M) / <50 (F) mg/dL", significance: "Low = increased risk; higher is protective" },
          { condition: "Triglycerides (normal)", siRange: "<1.7 mmol/L", convRange: "<150 mg/dL", significance: "Normal fasting triglycerides" },
          { condition: "Triglycerides (pancreatitis risk)", siRange: ">11.3 mmol/L", convRange: ">1000 mg/dL", significance: "Urgent — risk of acute pancreatitis" },
        ],
      },
    },
    faqs: [
      { question: "Is the conversion factor the same for total cholesterol, LDL, and HDL?", answer: "Yes! All three are cholesterol molecules with the same molecular weight (386.65 g/mol), so they share the conversion factor of 38.67 (mmol/L × 38.67 = mg/dL). Triglycerides use a different factor (88.57) because they are larger, structurally different molecules." },
      { question: "What is a normal lipid panel in SI units?", answer: "Total cholesterol: <5.2 mmol/L; LDL: <2.6 mmol/L (optimal); HDL: >1.0 mmol/L (M) or >1.3 mmol/L (F); Triglycerides: <1.7 mmol/L. These correspond to TC <200, LDL <100, HDL >40/50, TG <150 mg/dL in conventional units." },
      { question: "Why do triglycerides have a different conversion factor?", answer: "Triglycerides are much larger molecules than cholesterol (average MW ~885 vs 387 g/mol). They consist of glycerol bonded to three fatty acid chains. Because mmol/L is based on molecular count and mg/dL on mass, the larger molecular weight of triglycerides produces a larger conversion factor (88.57 vs 38.67)." },
      { question: "At what triglyceride level should I worry about pancreatitis?", answer: "Triglycerides above 11.3 mmol/L (1000 mg/dL) significantly increase the risk of acute pancreatitis. Values above 5.6 mmol/L (500 mg/dL) are considered very high and warrant aggressive treatment (fibrates, dietary changes, alcohol cessation). Pancreatitis from hypertriglyceridemia is a medical emergency." },
    ],
    relatedClusterLinks: [
      { href: "/canadian-vs-american-lab-values", label: "Canadian vs American Lab Values", description: "Overview of SI vs conventional units" },
      { href: "/glucose-mmol-l-to-mg-dl", label: "Glucose Conversion", description: "Metabolic syndrome connection" },
      { href: "/creatinine-umol-l-to-mg-dl", label: "Creatinine Conversion", description: "Renal function assessment" },
      { href: "/hemoglobin-g-l-to-g-dl", label: "Hemoglobin Conversion", description: "Hematology context" },
    ],
    externalLinks: [
      { href: "/si-to-conventional-units-converter", label: "Full SI ↔ Conventional Converter", description: "Interactive converter for all lab values" },
      { href: "/lab-values", label: "Lab Values Interpretation", description: "Clinical lab scenarios" },
      { href: "/pharmacology", label: "Pharmacology", description: "Statin and lipid medications" },
    ],
  },

  "kg-to-lb-nursing": {
    slug: "kg-to-lb-nursing",
    title: "kg to lb Conversion for Nursing",
    metaTitle: "kg to lb Conversion for Nursing — Medication Dosing Weight Calculator | NurseNest",
    metaDescription: "Convert between kilograms and pounds for nursing medication dosing. Includes weight-based dosing examples, pediatric calculations, BMI context, and clinical safety pearls.",
    keywords: "kg to lb nursing, weight conversion nursing, medication dosing weight, kg to pounds, nursing weight calculation, weight-based dosing",
    h1: "kg to lb Conversion for Nursing & Medication Dosing",
    heroDescription: "Accurate weight conversion between kilograms and pounds is a daily nursing task with direct patient safety implications. Weight-based medication dosing (mg/kg), IV fluid calculations, and nutritional assessments all depend on correct weight measurement. The conversion: 1 kg = 2.2046 lb (clinically rounded to 2.2 lb). This page provides quick-reference charts, dosing examples, and clinical safety notes.",
    converterIds: ["weight"],
    breadcrumbLabel: "kg to lb Conversion",
    sections: {
      whatIsThis: {
        heading: "Understanding Weight Conversion in Clinical Practice",
        paragraphs: [
          "In clinical settings worldwide, medications are dosed by body weight in kilograms. However, many patients — especially in the U.S. and among older Canadian patients — know their weight in pounds. Converting accurately between these units is essential for calculating weight-based drug doses, fluid requirements, and nutritional needs.",
          "The precise conversion is 1 kg = 2.2046 lb (or 1 lb = 0.4536 kg). In clinical nursing, the rounded value of 1 kg ≈ 2.2 lb is standard for bedside calculations. For most clinical purposes, this rounding introduces negligible error. However, in pediatric and neonatal dosing where milligram precision matters, using the precise factor may be appropriate.",
          "Important safety note: never dose medications based on patient-reported weight alone. Actual measured weight (using a calibrated scale) should be used for all weight-based calculations. Patient-reported weights can be inaccurate by 5–10 lb or more, which translates to significant dosing errors for narrow-therapeutic-index drugs.",
        ],
      },
      whyItMatters: {
        heading: "Why Weight Conversion Matters in Nursing",
        items: [
          { bold: "Weight-based medication dosing:", text: "Many critical medications are dosed in mg/kg: heparin loading dose (80 units/kg), vancomycin (15–20 mg/kg), chemotherapy agents, and pediatric medications. A 70 kg patient vs. a 70 lb (31.8 kg) patient would receive drastically different doses." },
          { bold: "Pediatric safety:", text: "In pediatrics, nearly all medications are weight-based. A 22 lb (10 kg) child receiving a dose calculated for '22 kg' would receive more than double the intended dose — a potentially fatal error." },
          { bold: "IV fluid calculations:", text: "Maintenance IV fluids use the 4-2-1 rule based on kg: 4 mL/kg/hr for the first 10 kg, 2 mL/kg/hr for the next 10 kg, 1 mL/kg/hr thereafter. Incorrect weight conversion cascades into fluid errors." },
          { bold: "BMI calculation:", text: "BMI = weight (kg) ÷ height (m²). Using pounds instead of kilograms without conversion produces incorrect BMI, potentially misclassifying nutritional status." },
          { bold: "Anesthetic dosing:", text: "Perioperative medications (propofol, succinylcholine, neuromuscular blockers) are all weight-based. Anesthesia teams require accurate kg weight for safe induction." },
        ],
      },
      clinicalContext: {
        heading: "Weight in Medication Safety & Dosing",
        paragraphs: [
          "Medication errors related to weight conversion are among the most common preventable adverse events in healthcare, particularly in pediatric settings. The Institute for Safe Medication Practices (ISMP) has issued multiple safety alerts about kg/lb confusion, including cases where patients received 2.2× the intended dose because pounds were mistakenly used as kilograms.",
          "Best practices for weight-based dosing safety include: always documenting weight in kilograms in the medical record (even if initially obtained in pounds), using standardized weight-based dosing references, employing double-checks for high-risk medications (insulin, heparin, opioids, chemotherapy), and programming infusion pumps with weight in the correct units.",
          "For obese patients, dosing may require adjusted body weight (ABW) rather than actual body weight for certain medications. ABW = Ideal Body Weight (IBW) + 0.4 × (Actual Weight − IBW). Aminoglycosides, for example, distribute into lean tissue and should be dosed on ABW to avoid toxicity.",
        ],
      },
      nursingExamples: {
        heading: "Weight Conversion Examples",
        examples: [
          { label: "Average Adult", siValue: "70 kg", convValue: "154 lb", interpretation: "Common reference weight for many drug dosing examples", color: "bg-green-50/50" },
          { label: "Pediatric (Toddler)", siValue: "12 kg", convValue: "26.4 lb", interpretation: "Typical 2-year-old weight — all meds weight-based", color: "bg-blue-50/50" },
          { label: "Neonate", siValue: "3.5 kg", convValue: "7.7 lb", interpretation: "Term newborn — precision critical for dosing", color: "bg-purple-50/50" },
          { label: "Obese Adult", siValue: "120 kg", convValue: "264 lb", interpretation: "May need adjusted body weight for certain drugs", color: "bg-orange-50/50" },
        ],
      },
      referenceChart: {
        heading: "Weight Conversion Quick-Reference Chart",
        rows: [
          { condition: "50 lb", siRange: "22.7 kg", convRange: "50 lb", significance: "Common pediatric weight" },
          { condition: "100 lb", siRange: "45.4 kg", convRange: "100 lb", significance: "Small adult / older pediatric" },
          { condition: "150 lb", siRange: "68.0 kg", convRange: "150 lb", significance: "Average adult" },
          { condition: "200 lb", siRange: "90.7 kg", convRange: "200 lb", significance: "Above average adult" },
          { condition: "250 lb", siRange: "113.4 kg", convRange: "250 lb", significance: "Obese — consider ABW for dosing" },
          { condition: "300 lb", siRange: "136.1 kg", convRange: "300 lb", significance: "Morbidly obese — special dosing considerations" },
        ],
      },
    },
    faqs: [
      { question: "How do I quickly convert kg to lb at the bedside?", answer: "Multiply by 2.2. For example, 80 kg × 2.2 = 176 lb. To convert lb to kg, divide by 2.2: 176 lb ÷ 2.2 = 80 kg. The precise factor is 2.2046, but 2.2 is accurate enough for clinical nursing calculations." },
      { question: "Why do hospitals use kilograms instead of pounds?", answer: "The metric system (kg) is the international standard for medical dosing. Using kg eliminates a conversion step and reduces medication errors. Most drug references, dosing calculators, and infusion pumps are calibrated in kg. The ISMP recommends that all U.S. hospitals use kg for medication dosing." },
      { question: "What is the 4-2-1 rule for maintenance IV fluids?", answer: "The Holliday-Segar formula: 4 mL/kg/hr for the first 10 kg of body weight, 2 mL/kg/hr for the next 10 kg, and 1 mL/kg/hr for each kg above 20. For a 70 kg adult: (4×10) + (2×10) + (1×50) = 40 + 20 + 50 = 110 mL/hr. This calculation requires weight in kg." },
      { question: "When should I use adjusted body weight vs actual weight?", answer: "Use adjusted body weight (ABW) for aminoglycosides (gentamicin, tobramycin) and some chemotherapy agents in obese patients. ABW = IBW + 0.4 × (Actual − IBW). Use actual body weight for most other medications. Use ideal body weight (IBW) for tidal volume calculations in mechanical ventilation." },
    ],
    relatedClusterLinks: [
      { href: "/celsius-to-fahrenheit-nursing", label: "°C to °F Conversion", description: "Temperature conversion for vital signs" },
      { href: "/canadian-vs-american-lab-values", label: "Canadian vs American Lab Values", description: "Overview of measurement differences" },
      { href: "/glucose-mmol-l-to-mg-dl", label: "Glucose Conversion", description: "Blood glucose unit conversion" },
      { href: "/creatinine-umol-l-to-mg-dl", label: "Creatinine Conversion", description: "Renal dosing context" },
    ],
    externalLinks: [
      { href: "/si-to-conventional-units-converter", label: "Full SI ↔ Conventional Converter", description: "Interactive converter for all values" },
      { href: "/med-math", label: "Med Math Practice", description: "Weight-based dosage calculations" },
      { href: "/lab-values", label: "Lab Values Interpretation", description: "Clinical lab scenarios" },
      { href: "/medication-mastery", label: "Pharmacology", description: "Drug dosing and safety" },
    ],
  },

  "celsius-to-fahrenheit-nursing": {
    slug: "celsius-to-fahrenheit-nursing",
    title: "Celsius to Fahrenheit Conversion for Nursing",
    metaTitle: "Celsius to Fahrenheit Conversion for Nursing — Vital Signs Temperature Calculator | NurseNest",
    metaDescription: "Convert temperature between Celsius and Fahrenheit for nursing vital signs. Includes fever thresholds, hypothermia classification, pediatric considerations, and clinical assessment pearls.",
    keywords: "celsius to fahrenheit nursing, temperature conversion nursing, fever threshold celsius fahrenheit, vital signs temperature, nursing temperature assessment, hypothermia classification",
    h1: "Celsius to Fahrenheit Conversion for Nursing Vital Signs",
    heroDescription: "Temperature is a core vital sign measured at every patient encounter. Canada and most of the world use Celsius (°C), while the U.S. primarily uses Fahrenheit (°F). The formula is: °F = (°C × 9/5) + 32. Key nursing thresholds: fever ≥38.0°C (100.4°F), hypothermia <35.0°C (95.0°F). This page provides quick-reference charts, clinical fever assessment context, and pediatric temperature considerations.",
    converterIds: ["temperature"],
    breadcrumbLabel: "°C to °F Conversion",
    sections: {
      whatIsThis: {
        heading: "Understanding Temperature Scales in Clinical Practice",
        paragraphs: [
          "The Celsius (centigrade) scale is based on the freezing point of water (0°C) and boiling point of water (100°C). The Fahrenheit scale uses different reference points (32°F for freezing, 212°F for boiling). In clinical settings, the relevant range is narrow: approximately 35–42°C (95–107.6°F) covers everything from severe hypothermia to lethal hyperthermia.",
          "The conversion formula is: °F = (°C × 9/5) + 32, or equivalently °F = (°C × 1.8) + 32. To convert back: °C = (°F − 32) × 5/9 or °C = (°F − 32) ÷ 1.8. Unlike lab value conversions that involve a single multiplication factor, temperature conversion uses a formula with both multiplication and addition because the two scales have different zero points.",
          "For bedside nursing, memorizing a few key temperature equivalents is more practical than calculating each time: normal body temperature ≈ 37.0°C = 98.6°F; fever threshold = 38.0°C = 100.4°F; hypothermia = 35.0°C = 95.0°F. These three values cover the majority of clinical assessment needs.",
        ],
      },
      whyItMatters: {
        heading: "Why Temperature Conversion Matters in Nursing",
        items: [
          { bold: "Fever assessment:", text: "The clinical definition of fever is temperature ≥38.0°C (100.4°F). In neutropenic patients, even a single reading of 38.3°C (101°F) requires immediate blood cultures and empiric antibiotics — recognizing fever in either scale is time-critical." },
          { bold: "Hypothermia classification:", text: "Hypothermia is classified as mild (32–35°C / 89.6–95°F), moderate (28–32°C / 82.4–89.6°F), and severe (<28°C / <82.4°F). Severe hypothermia causes cardiac arrhythmias (J waves, V-fib) — accurate temperature assessment guides rewarming strategy." },
          { bold: "Perioperative temperature monitoring:", text: "Patients lose body heat during surgery. The AORN recommends maintaining core temperature ≥36.0°C (96.8°F) to reduce surgical site infection risk and coagulopathy." },
          { bold: "Pediatric febrile assessment:", text: "In neonates and infants <3 months, a temperature ≥38.0°C (100.4°F) warrants emergent evaluation (full sepsis workup) due to immature immune systems. In older children, antipyretic thresholds and febrile seizure risk assessment require accurate temperature interpretation." },
          { bold: "Therapeutic hypothermia:", text: "Post-cardiac arrest targeted temperature management (TTM) aims for 32–36°C (89.6–96.8°F). ICU nurses titrate cooling devices in whichever unit system their equipment displays." },
        ],
      },
      clinicalContext: {
        heading: "Temperature in Clinical Assessment",
        paragraphs: [
          "Body temperature is regulated by the hypothalamus, which maintains core temperature near 37.0°C (98.6°F) through a balance of heat production (metabolism, shivering, vasoconstriction) and heat loss (sweating, vasodilation, radiation, convection, evaporation). Normal body temperature actually ranges from 36.1–37.2°C (97.0–99.0°F) and varies with time of day (lowest in early morning, highest in late afternoon), menstrual cycle, age, and measurement site.",
          "Temperature measurement sites and their approximate offsets: oral (reference standard for adults), rectal (+0.5°C / +0.9°F above oral — most accurate core temperature in children), axillary (−0.5°C / −0.9°F below oral — less reliable but non-invasive), temporal artery (comparable to oral), and tympanic (variable accuracy depending on technique). Documenting the measurement site alongside the temperature is essential nursing practice.",
          "Fever is the body's immune response to infection, inflammation, or tissue injury. Pyrogens (endogenous IL-1, TNF-α; exogenous bacterial endotoxins) act on the hypothalamus to raise the temperature set point. Antipyretic medications (acetaminophen, ibuprofen) work by inhibiting prostaglandin synthesis in the hypothalamus. In most adults, fever itself is not dangerous below 41°C (105.8°F), but the underlying cause requires investigation.",
        ],
      },
      nursingExamples: {
        heading: "Temperature Conversion Examples",
        examples: [
          { label: "Normal", siValue: "37.0°C", convValue: "98.6°F", interpretation: "Normal core body temperature", color: "bg-green-50/50" },
          { label: "Low-Grade Fever", siValue: "37.8°C", convValue: "100.0°F", interpretation: "Borderline — monitor for trend, assess for infection", color: "bg-yellow-50/50" },
          { label: "Fever", siValue: "38.5°C", convValue: "101.3°F", interpretation: "Fever — investigate cause, consider antipyretics", color: "bg-orange-50/50" },
          { label: "High Fever", siValue: "39.5°C", convValue: "103.1°F", interpretation: "High fever — blood cultures if indicated, cooling measures", color: "bg-red-50/50" },
          { label: "Hypothermia", siValue: "34.5°C", convValue: "94.1°F", interpretation: "Mild hypothermia — active warming, cardiac monitoring", color: "bg-blue-50/50" },
          { label: "Hyperthermia Emergency", siValue: "41.0°C", convValue: "105.8°F", interpretation: "Hyperthermia — aggressive cooling, assess for heatstroke/MH", color: "bg-red-50/50" },
        ],
      },
      referenceChart: {
        heading: "Temperature Quick-Reference Chart",
        rows: [
          { condition: "Severe hypothermia", siRange: "<28.0°C", convRange: "<82.4°F", significance: "Cardiac arrest risk — slow rewarming" },
          { condition: "Moderate hypothermia", siRange: "28.0–32.0°C", convRange: "82.4–89.6°F", significance: "Arrhythmia risk — active core rewarming" },
          { condition: "Mild hypothermia", siRange: "32.0–35.0°C", convRange: "89.6–95.0°F", significance: "Passive external rewarming, warm blankets" },
          { condition: "Normal range", siRange: "36.1–37.2°C", convRange: "97.0–99.0°F", significance: "Normal body temperature" },
          { condition: "Fever threshold", siRange: "≥38.0°C", convRange: "≥100.4°F", significance: "Clinical fever — investigate cause" },
          { condition: "High fever", siRange: "39.0–40.5°C", convRange: "102.2–104.9°F", significance: "Assess for sepsis, consider cooling" },
          { condition: "Hyperthermia / heatstroke", siRange: ">40.5°C", convRange: ">104.9°F", significance: "Medical emergency — aggressive cooling" },
        ],
      },
    },
    faqs: [
      { question: "What is the formula to convert Celsius to Fahrenheit?", answer: "°F = (°C × 9/5) + 32, or equivalently °F = (°C × 1.8) + 32. For example, 38.0°C = (38 × 1.8) + 32 = 68.4 + 32 = 100.4°F. To convert back: °C = (°F − 32) ÷ 1.8." },
      { question: "What temperature is considered a fever?", answer: "In clinical practice, fever is defined as a core temperature ≥38.0°C (100.4°F). Some sources use 38.3°C (101°F) as the threshold for clinical significance. In neutropenic patients, a single reading ≥38.3°C or sustained temperature ≥38.0°C for one hour triggers the neutropenic fever protocol." },
      { question: "Why is 98.6°F considered normal body temperature?", answer: "This value comes from Carl Reinhold August Wunderlich's 1868 study measuring axillary temperatures. More recent studies suggest that average normal body temperature is actually slightly lower — approximately 36.6°C (97.9°F) — and varies with time of day, age, and measurement method. The 98.6°F benchmark is a historical average, not an absolute normal." },
      { question: "What is the difference between fever and hyperthermia?", answer: "Fever is a regulated increase in the hypothalamic set point (the body 'wants' to be hotter) — antipyretics work because they lower the set point. Hyperthermia is an unregulated rise in body temperature where heat production exceeds the body's ability to dissipate it (heatstroke, malignant hyperthermia, neuroleptic malignant syndrome). Antipyretics are ineffective in hyperthermia — external cooling is required." },
    ],
    relatedClusterLinks: [
      { href: "/kg-to-lb-nursing", label: "kg to lb Conversion", description: "Weight conversion for medication dosing" },
      { href: "/canadian-vs-american-lab-values", label: "Canadian vs American Lab Values", description: "Overview of measurement differences" },
      { href: "/glucose-mmol-l-to-mg-dl", label: "Glucose Conversion", description: "Blood glucose unit conversion" },
      { href: "/hemoglobin-g-l-to-g-dl", label: "Hemoglobin Conversion", description: "Hematology context" },
    ],
    externalLinks: [
      { href: "/si-to-conventional-units-converter", label: "Full SI ↔ Conventional Converter", description: "Interactive converter for all values" },
      { href: "/med-math", label: "Med Math Practice", description: "Clinical calculations practice" },
      { href: "/lab-values", label: "Lab Values Interpretation", description: "Clinical lab scenarios" },
    ],
  },
};

export const allClusterSlugs = Object.keys(clusterPages);
