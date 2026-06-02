export interface MltLabValuePracticeQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  rationale: string;
}

export interface MltLabValuePageData {
  slug: string;
  name: string;
  fullName: string;
  seoTitle: string;
  h1Title: string;
  metaDescription: string;
  keywords: string;
  discipline: string;
  normalRange: {
    si: { value: string; unit: string };
    conventional: { value: string; unit: string };
  };
  specimen: string;
  overview: string;
  clinicalSignificance: string;
  highCauses: { condition: string; explanation: string }[];
  lowCauses: { condition: string; explanation: string }[];
  criticalValues: {
    high?: string;
    low?: string;
    action: string;
  };
  associatedConditions: string[];
  labCorrelations: string[];
  examTips: string[];
  practiceQuestions: MltLabValuePracticeQuestion[];
  relatedLabSlugs: string[];
  faqItems: { question: string; answer: string }[];
}

export const mltLabValues: MltLabValuePageData[] = [
  {
    slug: "potassium",
    name: "Potassium",
    fullName: "Serum Potassium (K⁺)",
    seoTitle: "Potassium Lab Values for MLT Exam | Normal Range, SI & Conventional Units",
    h1Title: "Potassium (K⁺): Normal Range, Critical Values & MLT Exam Review",
    metaDescription: "MLT exam review of potassium (K⁺) — normal range 3.5–5.0 mmol/L (SI) / 3.5–5.0 mEq/L (US), specimen requirements, causes of hyperkalemia and hypokalemia, critical values, and practice questions.",
    keywords: "potassium lab values MLT, K+ normal range, hyperkalemia hypokalemia MLT exam, potassium critical values, electrolyte panel MLT",
    discipline: "Clinical Chemistry",
    normalRange: {
      si: { value: "3.5–5.0", unit: "mmol/L" },
      conventional: { value: "3.5–5.0", unit: "mEq/L" },
    },
    specimen: "Serum (red-top or SST) or plasma (green-top lithium heparin). Avoid hemolysis — falsely elevates potassium due to release from RBCs.",
    overview: "Potassium is the primary intracellular cation, with only ~2% found extracellularly. It is critical for maintaining resting membrane potential, cardiac conduction, and neuromuscular function. Serum potassium is tightly regulated by the kidneys (primarily via aldosterone-mediated secretion in the distal nephron) and by transcellular shifts driven by insulin, pH, and catecholamines.",
    clinicalSignificance: "Potassium abnormalities are among the most dangerous electrolyte disorders because small changes directly affect cardiac conduction. Hyperkalemia causes peaked T waves progressing to widened QRS and sine wave patterns. Hypokalemia causes flattened T waves and prominent U waves. Both can lead to fatal arrhythmias. Pre-analytical errors (hemolysis, prolonged tourniquet time, fist clenching) are the most common cause of falsely elevated potassium in the laboratory.",
    highCauses: [
      { condition: "Hemolyzed specimen (pre-analytical)", explanation: "Most common cause of falsely elevated K+ in the lab. RBC lysis releases intracellular potassium into the serum." },
      { condition: "Acute kidney injury / renal failure", explanation: "Impaired renal excretion leads to potassium retention." },
      { condition: "Metabolic acidosis", explanation: "H⁺ ions move intracellularly; K⁺ shifts extracellularly to maintain electroneutrality." },
      { condition: "Tissue destruction (rhabdomyolysis, tumor lysis, burns)", explanation: "Massive cellular injury releases intracellular potassium stores into the plasma." },
      { condition: "ACE inhibitors, ARBs, potassium-sparing diuretics", explanation: "Reduce aldosterone effect or block potassium secretion in the distal nephron." },
    ],
    lowCauses: [
      { condition: "Loop and thiazide diuretics", explanation: "Increase renal potassium excretion by enhancing flow through the distal nephron." },
      { condition: "Vomiting / GI losses", explanation: "Loss of gastric acid causes metabolic alkalosis, driving K⁺ intracellularly; renal K⁺ wasting follows." },
      { condition: "Insulin administration", explanation: "Insulin activates Na⁺/K⁺-ATPase, shifting potassium into cells." },
      { condition: "Metabolic alkalosis", explanation: "K⁺ moves intracellularly in exchange for H⁺ ions to buffer the alkalosis." },
      { condition: "Hyperaldosteronism", explanation: "Excess aldosterone promotes renal potassium secretion in the collecting duct." },
    ],
    criticalValues: {
      high: ">6.0 mmol/L (>6.0 mEq/L)",
      low: "<3.0 mmol/L (<3.0 mEq/L)",
      action: "Verify specimen is not hemolyzed. If confirmed, notify physician immediately. Critical hyperkalemia requires ECG monitoring and emergent treatment (calcium gluconate, insulin + dextrose, sodium bicarbonate).",
    },
    associatedConditions: ["Renal failure (acute and chronic)", "Diabetic ketoacidosis", "Addison disease", "Conn syndrome (primary hyperaldosteronism)", "Metabolic acidosis/alkalosis"],
    labCorrelations: ["Sodium (Na⁺)", "Bicarbonate (HCO₃⁻)", "BUN/Creatinine", "Magnesium (Mg²⁺)", "Arterial blood gas (ABG)"],
    examTips: [
      "Hemolysis is the #1 pre-analytical cause of falsely elevated potassium — always check specimen quality",
      "Potassium and pH have an inverse relationship: acidosis → hyperkalemia, alkalosis → hypokalemia",
      "Hyperkalemia ECG progression: peaked T waves → widened QRS → sine wave → asystole",
      "Correct hypomagnesemia first — refractory hypokalemia often has concurrent magnesium depletion",
      "ISE (ion-selective electrode) is the standard method for potassium measurement in clinical chemistry",
    ],
    practiceQuestions: [
      {
        question: "A serum potassium result of 6.8 mmol/L is obtained from a specimen that appears pink-tinged. What is the most appropriate action?",
        options: ["Report the result as critical", "Request a recollection due to suspected hemolysis", "Repeat the test on the same specimen", "Dilute the specimen and rerun"],
        correctIndex: 1,
        rationale: "A pink-tinged serum indicates hemolysis, which falsely elevates potassium due to release from lysed RBCs. The specimen should be recollected before reporting. Reporting a hemolyzed critical potassium without verification could lead to inappropriate treatment.",
      },
      {
        question: "Which electrolyte imbalance must be corrected before hypokalemia will respond to potassium replacement?",
        options: ["Hypocalcemia", "Hyponatremia", "Hypomagnesemia", "Hypophosphatemia"],
        correctIndex: 2,
        rationale: "Hypomagnesemia impairs the kidney's ability to retain potassium by affecting the ROMK channels in the distal nephron. Potassium replacement will be ineffective until magnesium is corrected first.",
      },
      {
        question: "A patient with metabolic acidosis has a potassium of 5.8 mmol/L. Once the acidosis is corrected, what change in potassium should be expected?",
        options: ["Potassium will increase further", "Potassium will remain the same", "Potassium will decrease as K⁺ shifts intracellularly", "Potassium will be excreted renally only"],
        correctIndex: 2,
        rationale: "During acidosis, H⁺ enters cells and K⁺ exits to maintain electroneutrality. When acidosis is corrected, H⁺ moves back out of cells and K⁺ shifts intracellularly, lowering the serum potassium. The patient may become hypokalemic after correction.",
      },
      {
        question: "Which analytical method is most commonly used to measure serum potassium in an automated chemistry analyzer?",
        options: ["Flame photometry", "Ion-selective electrode (ISE)", "Atomic absorption spectrophotometry", "Colorimetric assay"],
        correctIndex: 1,
        rationale: "Ion-selective electrode (ISE) is the standard method for electrolyte measurement (Na⁺, K⁺, Cl⁻) in modern automated chemistry analyzers. ISE can be direct (undiluted) or indirect (diluted). Flame photometry was the historical method but has been largely replaced by ISE.",
      },
    ],
    relatedLabSlugs: ["sodium", "magnesium", "calcium", "abg", "bun-creatinine"],
    faqItems: [
      { question: "What is the normal potassium range for MLT exams?", answer: "The normal serum potassium range is 3.5–5.0 mmol/L (SI units) or 3.5–5.0 mEq/L (conventional units). For potassium, SI and conventional values are numerically identical." },
      { question: "Why does hemolysis affect potassium levels?", answer: "Red blood cells contain approximately 23 times more potassium than serum. When RBCs lyse during collection or handling, intracellular potassium is released into the serum, causing falsely elevated results." },
      { question: "How is potassium measured in the clinical laboratory?", answer: "Potassium is measured by ion-selective electrode (ISE), either direct or indirect, on automated chemistry analyzers. Direct ISE measures undiluted specimens and is used on blood gas analyzers and point-of-care devices." },
    ],
  },
  {
    slug: "sodium",
    name: "Sodium",
    fullName: "Serum Sodium (Na⁺)",
    seoTitle: "Sodium Lab Values for MLT Exam | Normal Range, SI & Conventional Units",
    h1Title: "Sodium (Na⁺): Normal Range, Critical Values & MLT Exam Review",
    metaDescription: "MLT exam review of sodium (Na⁺) — normal range 136–145 mmol/L (SI) / 136–145 mEq/L (US), causes of hyponatremia and hypernatremia, osmolality correlation, and practice questions.",
    keywords: "sodium lab values MLT, Na+ normal range, hyponatremia hypernatremia MLT exam, sodium critical values, electrolyte panel MLT",
    discipline: "Clinical Chemistry",
    normalRange: {
      si: { value: "136–145", unit: "mmol/L" },
      conventional: { value: "136–145", unit: "mEq/L" },
    },
    specimen: "Serum or plasma (lithium heparin). Hemolysis has minimal effect. Specimens collected from IV arm may be diluted (contaminated with IV fluid).",
    overview: "Sodium is the primary extracellular cation and the major determinant of serum osmolality. It plays a critical role in fluid balance, nerve impulse transmission, and muscle contraction. Serum sodium concentration reflects the ratio of sodium to water rather than total body sodium content. Regulation involves ADH (vasopressin), aldosterone, and atrial natriuretic peptide (ANP).",
    clinicalSignificance: "Sodium imbalances are the most common electrolyte disorders encountered clinically. Hyponatremia causes cerebral edema due to osmotic water shifts into brain cells; hypernatremia causes cellular dehydration. Rapid correction of either condition can cause devastating neurological damage (osmotic demyelination syndrome or cerebral edema). The laboratory plays a critical role in monitoring correction rates.",
    highCauses: [
      { condition: "Dehydration / free water loss", explanation: "Loss of water without proportional sodium loss concentrates serum sodium." },
      { condition: "Diabetes insipidus (central or nephrogenic)", explanation: "Insufficient ADH production or renal resistance to ADH causes massive dilute urine output and water loss." },
      { condition: "Excessive sodium intake", explanation: "Hypertonic IV solutions (3% NaCl), sodium bicarbonate infusions, or excessive dietary intake." },
      { condition: "Hyperaldosteronism (Conn syndrome)", explanation: "Excess aldosterone promotes sodium reabsorption in the distal nephron." },
    ],
    lowCauses: [
      { condition: "SIADH (Syndrome of Inappropriate ADH)", explanation: "Excess ADH causes water retention, diluting serum sodium (dilutional hyponatremia)." },
      { condition: "Heart failure / cirrhosis / nephrotic syndrome", explanation: "Effective circulating volume depletion triggers ADH release and water retention." },
      { condition: "Thiazide diuretics", explanation: "Impair sodium reabsorption in the distal convoluted tubule without proportional water loss." },
      { condition: "Pseudohyponatremia", explanation: "Falsely low sodium from hyperlipidemia or hyperproteinemia when using indirect ISE methods. Direct ISE avoids this error." },
    ],
    criticalValues: {
      high: ">160 mmol/L (>160 mEq/L)",
      low: "<120 mmol/L (<120 mEq/L)",
      action: "Notify physician immediately. Correction rate must not exceed 8–10 mmol/L per 24 hours to prevent osmotic demyelination syndrome (central pontine myelinolysis).",
    },
    associatedConditions: ["SIADH", "Diabetes insipidus", "Adrenal insufficiency (Addison disease)", "Congestive heart failure", "Hepatic cirrhosis"],
    labCorrelations: ["Serum osmolality", "Urine sodium", "Urine osmolality", "Potassium (K⁺)", "Chloride (Cl⁻)"],
    examTips: [
      "Sodium is the primary determinant of serum osmolality: estimated osmolality = 2(Na⁺) + glucose/18 + BUN/2.8",
      "Pseudohyponatremia occurs with indirect ISE in hyperlipidemic/hyperproteinemic specimens — direct ISE gives correct results",
      "SIADH = dilutional hyponatremia with concentrated urine (urine osmolality > serum osmolality)",
      "Diabetes insipidus = hypernatremia with dilute urine (urine osmolality < serum osmolality)",
      "The osmolal gap (measured − calculated osmolality) >10 mOsm/kg suggests unmeasured osmoles (ethanol, methanol, ethylene glycol)",
    ],
    practiceQuestions: [
      {
        question: "A patient's serum sodium is 118 mmol/L with a serum osmolality of 255 mOsm/kg and urine osmolality of 600 mOsm/kg. Which condition is most consistent with these findings?",
        options: ["Diabetes insipidus", "SIADH", "Primary polydipsia", "Pseudohyponatremia"],
        correctIndex: 1,
        rationale: "SIADH presents with hyponatremia, low serum osmolality (hypotonic hyponatremia), and inappropriately concentrated urine (urine osmolality > 100 mOsm/kg). The kidneys are retaining water due to excess ADH, diluting sodium while concentrating the urine.",
      },
      {
        question: "A lipemic specimen analyzed by indirect ISE shows Na⁺ 128 mmol/L. When reanalyzed by direct ISE, Na⁺ is 140 mmol/L. What phenomenon explains the discrepancy?",
        options: ["Hemolysis interference", "Pseudohyponatremia", "Lab calibration error", "Specimen contamination"],
        correctIndex: 1,
        rationale: "Pseudohyponatremia occurs when indirect ISE methods dilute the specimen before measurement. Lipids and proteins occupy volume in the specimen, displacing the aqueous phase where sodium resides. Direct ISE measures the undiluted aqueous phase directly, giving the correct result.",
      },
      {
        question: "What is the maximum safe correction rate for chronic hyponatremia to prevent osmotic demyelination syndrome?",
        options: ["4–6 mmol/L per hour", "8–10 mmol/L per 24 hours", "15–20 mmol/L per 24 hours", "No correction rate limit exists"],
        correctIndex: 1,
        rationale: "Chronic hyponatremia must not be corrected faster than 8–10 mmol/L per 24 hours. Rapid correction can cause osmotic demyelination syndrome (central pontine myelinolysis), leading to irreversible neurological damage. Serial sodium monitoring every 2–4 hours is essential during correction.",
      },
    ],
    relatedLabSlugs: ["potassium", "calcium", "glucose", "bun-creatinine"],
    faqItems: [
      { question: "What is the normal sodium range for MLT exams?", answer: "The normal serum sodium range is 136–145 mmol/L (SI units) or 136–145 mEq/L (conventional units). SI and conventional values are numerically identical for sodium." },
      { question: "What is pseudohyponatremia?", answer: "Pseudohyponatremia is a falsely low sodium result caused by high lipid or protein levels when using indirect ISE methods. The sample dilution step causes an artifact. Direct ISE avoids this error by measuring the undiluted aqueous phase." },
      { question: "How does the lab measure sodium?", answer: "Sodium is measured by ion-selective electrode (ISE). Indirect ISE (most automated analyzers) requires sample dilution; direct ISE (blood gas analyzers, some POCT devices) measures undiluted samples and is not affected by lipemia or hyperproteinemia." },
    ],
  },
  {
    slug: "hemoglobin",
    name: "Hemoglobin",
    fullName: "Hemoglobin (Hgb / Hb)",
    seoTitle: "Hemoglobin Lab Values for MLT Exam | Normal Range, SI & Conventional Units",
    h1Title: "Hemoglobin (Hgb): Normal Range, Critical Values & MLT Exam Review",
    metaDescription: "MLT exam review of hemoglobin — normal range 120–160 g/L (SI) / 12.0–16.0 g/dL (US), anemia classification, critical values, and practice questions for CSMLS and ASCP exams.",
    keywords: "hemoglobin lab values MLT, Hgb normal range, anemia classification MLT exam, hemoglobin critical values, CBC hematology MLT",
    discipline: "Hematology",
    normalRange: {
      si: { value: "Male: 140–180; Female: 120–160", unit: "g/L" },
      conventional: { value: "Male: 14.0–18.0; Female: 12.0–16.0", unit: "g/dL" },
    },
    specimen: "EDTA whole blood (lavender-top tube). Hemoglobin is measured as part of the CBC. Lipemia, very high WBC counts, and abnormal hemoglobins can interfere with spectrophotometric measurement.",
    overview: "Hemoglobin is the iron-containing protein in red blood cells responsible for oxygen transport. It is the most commonly ordered hematology test and forms part of the complete blood count (CBC). Hemoglobin concentration is used to diagnose and classify anemias, monitor blood loss, and assess erythropoietic function. It is measured by automated hematology analyzers using the cyanmethemoglobin (HiCN) method or its non-cyanide equivalents.",
    clinicalSignificance: "Decreased hemoglobin defines anemia and is classified by MCV: microcytic (<80 fL), normocytic (80–100 fL), or macrocytic (>100 fL). The hemoglobin value is used alongside RBC count, hematocrit, and red cell indices (MCV, MCH, MCHC) to characterize anemias. Elevated hemoglobin occurs in polycythemia vera, dehydration, and chronic hypoxia. The laboratory must also identify hemoglobin variants (HbS, HbC) by electrophoresis or HPLC.",
    highCauses: [
      { condition: "Polycythemia vera (primary)", explanation: "Clonal myeloproliferative disorder with JAK2 V617F mutation causing autonomous erythrocyte production." },
      { condition: "Dehydration / hemoconcentration", explanation: "Reduced plasma volume artificially concentrates hemoglobin (relative polycythemia)." },
      { condition: "Chronic hypoxia (COPD, high altitude)", explanation: "Chronic low oxygen stimulates EPO release, driving compensatory erythrocytosis (secondary polycythemia)." },
      { condition: "Smoking", explanation: "Carbon monoxide binds hemoglobin, reducing oxygen carrying capacity and triggering compensatory erythropoiesis." },
    ],
    lowCauses: [
      { condition: "Iron deficiency anemia", explanation: "Most common anemia worldwide. Decreased iron limits heme synthesis → microcytic, hypochromic anemia with low MCV, MCH, MCHC." },
      { condition: "Vitamin B12 / folate deficiency", explanation: "Impaired DNA synthesis → megaloblastic anemia with macrocytic RBCs (MCV >100 fL), hypersegmented neutrophils." },
      { condition: "Chronic disease / inflammation", explanation: "Cytokines (IL-6) increase hepcidin, sequestering iron in storage. Normocytic or mildly microcytic anemia." },
      { condition: "Acute blood loss / hemorrhage", explanation: "Volume loss initially shows normal Hgb (dilution takes 24–48 hours to manifest). Reticulocyte count rises compensatorily." },
      { condition: "Hemolytic anemias", explanation: "Premature RBC destruction (autoimmune, mechanical, enzymatic, membrane defects) → elevated LDH, bilirubin, reticulocytes; decreased haptoglobin." },
    ],
    criticalValues: {
      high: ">200 g/L (>20.0 g/dL)",
      low: "<70 g/L (<7.0 g/dL)",
      action: "Notify physician immediately. Critical low hemoglobin may require transfusion. Verify specimen identity and integrity before reporting.",
    },
    associatedConditions: ["Iron deficiency anemia", "Thalassemia", "Sickle cell disease", "Polycythemia vera", "Megaloblastic anemia", "Hemolytic anemias"],
    labCorrelations: ["Hematocrit (Hct)", "RBC indices (MCV, MCH, MCHC)", "Reticulocyte count", "Iron studies (serum iron, TIBC, ferritin)", "Peripheral blood smear"],
    examTips: [
      "Hemoglobin is measured spectrophotometrically at 540 nm after conversion to cyanmethemoglobin (HiCN) — this is the reference method",
      "To convert g/L to g/dL: divide by 10 (e.g., 140 g/L = 14.0 g/dL)",
      "Rule of three: Hgb × 3 ≈ Hct (within ±3). If this rule fails, suspect an error or abnormal condition",
      "MCV classifies anemias: <80 fL (microcytic = iron deficiency, thalassemia), 80–100 fL (normocytic = chronic disease), >100 fL (macrocytic = B12/folate deficiency)",
      "Lipemia and very high WBC counts cause falsely elevated hemoglobin by increasing specimen turbidity",
    ],
    practiceQuestions: [
      {
        question: "A CBC shows Hgb 95 g/L, MCV 68 fL, MCH 22 pg, MCHC 290 g/L. Which anemia is most consistent with these findings?",
        options: ["Vitamin B12 deficiency", "Iron deficiency anemia", "Anemia of chronic disease", "Aplastic anemia"],
        correctIndex: 1,
        rationale: "The low MCV (<80 fL), low MCH, and low MCHC indicate microcytic, hypochromic anemia. Iron deficiency is the most common cause of microcytic anemia. Further confirmation requires iron studies: low serum iron, high TIBC, low ferritin.",
      },
      {
        question: "What is the reference method for hemoglobin measurement in the clinical laboratory?",
        options: ["Conductance method", "Impedance counting", "Cyanmethemoglobin (HiCN) spectrophotometry", "Flow cytometry"],
        correctIndex: 2,
        rationale: "The cyanmethemoglobin (HiCN) method is the internationally accepted reference method for hemoglobin measurement. Blood is mixed with Drabkin reagent (potassium ferricyanide + potassium cyanide), converting hemoglobin to cyanmethemoglobin, measured spectrophotometrically at 540 nm.",
      },
      {
        question: "A patient's Hgb is 150 g/L and Hct is 0.35 L/L. Applying the rule of three, what discrepancy exists?",
        options: ["No discrepancy — values are consistent", "Hct is too low for the hemoglobin level", "Hemoglobin is too low for the hematocrit", "MCV must be elevated"],
        correctIndex: 1,
        rationale: "The rule of three states Hgb (g/dL) × 3 ≈ Hct (%). Here, 15.0 × 3 = 45%, but Hct is 35%. The Hct is too low, suggesting a possible error, cold agglutinins (falsely low RBC/Hct), or lipemia (falsely elevated Hgb). The discrepancy warrants investigation.",
      },
    ],
    relatedLabSlugs: ["wbc", "platelet-count", "glucose", "a1c"],
    faqItems: [
      { question: "What is the normal hemoglobin range for MLT exams?", answer: "Normal hemoglobin ranges are sex-dependent. Males: 140–180 g/L (SI) or 14.0–18.0 g/dL (conventional). Females: 120–160 g/L (SI) or 12.0–16.0 g/dL (conventional). To convert: divide g/L by 10 to get g/dL." },
      { question: "How is hemoglobin measured in the lab?", answer: "Hemoglobin is measured spectrophotometrically using the cyanmethemoglobin (HiCN) method or its non-cyanide equivalents (sodium lauryl sulfate method). Blood is lysed and hemoglobin is converted to a stable chromogen measured at 540 nm." },
      { question: "What causes falsely elevated hemoglobin?", answer: "Lipemia (turbidity), severe leukocytosis (WBC >100,000/µL), and carboxyhemoglobin can cause falsely elevated hemoglobin by interfering with the spectrophotometric measurement. Plasma replacement (saline substitution) corrects for lipemia and leukocytosis." },
    ],
  },
  {
    slug: "wbc",
    name: "WBC Count",
    fullName: "White Blood Cell Count (WBC / Leukocyte Count)",
    seoTitle: "WBC Count Lab Values for MLT Exam | Normal Range & Differential",
    h1Title: "WBC Count: Normal Range, Differential & MLT Exam Review",
    metaDescription: "MLT exam review of WBC count — normal range 4.5–11.0 × 10⁹/L (SI) / 4,500–11,000/µL (US), differential interpretation, leukocytosis and leukopenia causes, and practice questions.",
    keywords: "WBC count lab values MLT, white blood cell normal range, leukocyte differential MLT exam, neutrophilia lymphocytosis, hematology MLT",
    discipline: "Hematology",
    normalRange: {
      si: { value: "4.5–11.0", unit: "× 10⁹/L" },
      conventional: { value: "4,500–11,000", unit: "/µL (cells/µL)" },
    },
    specimen: "EDTA whole blood (lavender-top tube). Counted as part of the CBC. Clotted or clumped specimens give falsely low counts.",
    overview: "The white blood cell (WBC) count measures the total number of leukocytes in peripheral blood. The WBC differential identifies the proportion and absolute count of each leukocyte type: neutrophils, lymphocytes, monocytes, eosinophils, and basophils. WBC count and differential are essential for diagnosing infections, leukemias, and immune disorders. Automated hematology analyzers count WBCs using impedance, optical scatter, or fluorescence flow cytometry.",
    clinicalSignificance: "Leukocytosis (elevated WBC) is most commonly caused by bacterial infection (neutrophilia). Left shift (increased bands/immature granulocytes) indicates active infection or bone marrow response. Leukopenia (decreased WBC) occurs with viral infections, bone marrow suppression, and autoimmune conditions. Markedly elevated WBC counts with blasts suggest leukemia. Manual differential review is required when automated flags indicate morphological abnormalities.",
    highCauses: [
      { condition: "Bacterial infection", explanation: "Neutrophilia with left shift (increased bands and metamyelocytes) is the hallmark of acute bacterial infection." },
      { condition: "Leukemia (acute and chronic)", explanation: "CML may present with WBC >100 × 10⁹/L with all stages of granulocyte maturation. AML/ALL show circulating blasts." },
      { condition: "Inflammatory conditions", explanation: "Tissue necrosis, surgery, burns, and autoimmune conditions stimulate leukocyte production and demargination." },
      { condition: "Physiological leukocytosis", explanation: "Stress, exercise, pregnancy, and corticosteroid use cause transient neutrophilia via demargination." },
    ],
    lowCauses: [
      { condition: "Viral infections", explanation: "Many viral infections (influenza, HIV, hepatitis) suppress bone marrow or cause lymphocyte redistribution." },
      { condition: "Bone marrow failure / aplastic anemia", explanation: "Pancytopenia with decreased production of all cell lines, including leukocytes." },
      { condition: "Chemotherapy / radiation", explanation: "Cytotoxic drugs and radiation suppress rapidly dividing bone marrow precursors." },
      { condition: "Autoimmune neutropenia / SLE", explanation: "Antibody-mediated destruction of neutrophils or peripheral sequestration." },
    ],
    criticalValues: {
      high: ">30.0 × 10⁹/L (>30,000/µL)",
      low: "<2.0 × 10⁹/L (<2,000/µL)",
      action: "Critically high: review smear for blasts, notify physician, consider leukemia workup. Critically low: notify physician, patient at high risk for infection (absolute neutrophil count <500/µL = severe neutropenia).",
    },
    associatedConditions: ["Acute leukemia (AML, ALL)", "Chronic leukemia (CML, CLL)", "Bacterial sepsis", "Aplastic anemia", "Myelodysplastic syndromes"],
    labCorrelations: ["WBC differential (manual and automated)", "Peripheral blood smear", "Hemoglobin / Hct / Platelet count (CBC)", "Bone marrow biopsy", "Flow cytometry (immunophenotyping)"],
    examTips: [
      "Normal WBC differential: Neutrophils 40–70%, Lymphocytes 20–40%, Monocytes 2–8%, Eosinophils 1–4%, Basophils 0–1%",
      "Left shift = increased bands (>10%) and immature granulocytes → indicates acute bacterial infection",
      "Absolute counts are more clinically significant than relative percentages for evaluating individual cell lines",
      "CML: WBC very high, Philadelphia chromosome t(9;22), BCR-ABL1 fusion gene, basophilia",
      "Nucleated RBCs (NRBCs) can falsely elevate WBC counts on automated analyzers — must be corrected",
    ],
    practiceQuestions: [
      {
        question: "A CBC shows WBC 45.0 × 10⁹/L with 60% blasts on the peripheral smear. Which condition is most likely?",
        options: ["Bacterial pneumonia", "Chronic myeloid leukemia", "Acute leukemia", "Infectious mononucleosis"],
        correctIndex: 2,
        rationale: "The presence of >20% blasts in peripheral blood is diagnostic of acute leukemia (AML or ALL). CML typically shows all stages of granulocyte maturation without significant blasts. Bacterial infections cause neutrophilia without blasts.",
      },
      {
        question: "Nucleated red blood cells (NRBCs) are present on a blood smear. How does this affect the automated WBC count?",
        options: ["WBC count is falsely decreased", "WBC count is falsely elevated", "No effect on WBC count", "WBC count is accurate but RBC count is affected"],
        correctIndex: 1,
        rationale: "NRBCs have nuclei and are counted as WBCs by automated analyzers that use impedance or basic optical methods. This falsely elevates the WBC count. A corrected WBC count must be calculated: Corrected WBC = (Reported WBC × 100) / (100 + NRBC per 100 WBCs).",
      },
      {
        question: "A patient has WBC 2.5 × 10⁹/L with 20% neutrophils. What is the absolute neutrophil count (ANC)?",
        options: ["500/µL — severe neutropenia", "2,500/µL — normal", "1,250/µL — mild neutropenia", "250/µL — agranulocytosis"],
        correctIndex: 0,
        rationale: "ANC = WBC × % neutrophils = 2,500 × 0.20 = 500/µL. An ANC <500/µL indicates severe neutropenia, placing the patient at high risk for life-threatening infection. This is a critical value requiring immediate notification.",
      },
    ],
    relatedLabSlugs: ["hemoglobin", "platelet-count", "sodium", "glucose"],
    faqItems: [
      { question: "What is the normal WBC count for MLT exams?", answer: "Normal WBC count is 4.5–11.0 × 10⁹/L (SI units) or 4,500–11,000/µL (conventional units). The WBC differential breaks this into neutrophils, lymphocytes, monocytes, eosinophils, and basophils." },
      { question: "What is a left shift?", answer: "A left shift refers to an increase in immature granulocytes (bands, metamyelocytes, myelocytes) in the peripheral blood. It indicates the bone marrow is releasing immature cells to meet demand, typically seen in acute bacterial infections." },
      { question: "What is the absolute neutrophil count (ANC)?", answer: "ANC = WBC × (% neutrophils + % bands) / 100. ANC <1,500/µL = neutropenia. ANC <500/µL = severe neutropenia with high infection risk. ANC is more clinically useful than the relative percentage." },
    ],
  },
  {
    slug: "platelet-count",
    name: "Platelet Count",
    fullName: "Platelet Count (PLT / Thrombocytes)",
    seoTitle: "Platelet Count Lab Values for MLT Exam | Normal Range & Interpretation",
    h1Title: "Platelet Count: Normal Range, Critical Values & MLT Exam Review",
    metaDescription: "MLT exam review of platelet count — normal range 150–400 × 10⁹/L (SI) / 150,000–400,000/µL (US), thrombocytopenia and thrombocytosis causes, and practice questions.",
    keywords: "platelet count lab values MLT, thrombocytopenia thrombocytosis, PLT normal range MLT exam, platelet clumping, hematology MLT",
    discipline: "Hematology",
    normalRange: {
      si: { value: "150–400", unit: "× 10⁹/L" },
      conventional: { value: "150,000–400,000", unit: "/µL" },
    },
    specimen: "EDTA whole blood (lavender-top tube). Platelet clumping (pseudothrombocytopenia) is a common pre-analytical issue — always verify by examining the smear feathered edge.",
    overview: "Platelets (thrombocytes) are anucleate cell fragments derived from megakaryocytes in the bone marrow. They play a central role in primary hemostasis by forming the initial platelet plug at sites of vascular injury. Platelet count is part of the CBC and is measured by automated hematology analyzers using impedance or optical methods. The platelet count is essential for evaluating bleeding risk, diagnosing thrombocytopenias, and monitoring chemotherapy.",
    clinicalSignificance: "Thrombocytopenia (<150 × 10⁹/L) increases bleeding risk — spontaneous bleeding typically occurs below 20 × 10⁹/L. Thrombocytosis (>400 × 10⁹/L) can be reactive (infection, iron deficiency) or clonal (essential thrombocythemia, CML). Pseudothrombocytopenia from EDTA-dependent platelet clumping is the most common cause of falsely low platelet counts and must be ruled out before reporting.",
    highCauses: [
      { condition: "Reactive thrombocytosis (infection, inflammation, iron deficiency)", explanation: "Acute phase response and iron deficiency stimulate thrombopoietin and megakaryocyte production." },
      { condition: "Essential thrombocythemia", explanation: "Clonal myeloproliferative neoplasm with JAK2, CALR, or MPL mutations causing autonomous platelet production." },
      { condition: "Post-splenectomy", explanation: "The spleen normally sequesters ~30% of platelets. After removal, platelet count rises." },
      { condition: "Chronic myeloid leukemia (CML)", explanation: "Myeloproliferative neoplasm with increased production of granulocytes and often platelets." },
    ],
    lowCauses: [
      { condition: "Immune thrombocytopenic purpura (ITP)", explanation: "Autoantibodies against platelet glycoproteins (GPIIb/IIIa) cause splenic destruction." },
      { condition: "DIC (disseminated intravascular coagulation)", explanation: "Widespread activation of coagulation consumes platelets and clotting factors." },
      { condition: "Heparin-induced thrombocytopenia (HIT)", explanation: "Antibodies against heparin-PF4 complexes cause platelet activation and paradoxical thrombosis." },
      { condition: "TTP / HUS", explanation: "Microangiopathic hemolytic anemia with platelet consumption in microvascular thrombi. TTP = ADAMTS13 deficiency." },
      { condition: "Bone marrow failure / chemotherapy", explanation: "Reduced megakaryocyte production from aplastic anemia, leukemia infiltration, or cytotoxic drugs." },
    ],
    criticalValues: {
      high: ">1,000 × 10⁹/L (>1,000,000/µL)",
      low: "<50 × 10⁹/L (<50,000/µL)",
      action: "Critical low: verify no clumping on smear, notify physician — bleeding risk increases. Below 10 × 10⁹/L: risk of spontaneous intracranial hemorrhage. Critical high: evaluate for myeloproliferative neoplasm.",
    },
    associatedConditions: ["ITP", "TTP/HUS", "DIC", "Essential thrombocythemia", "Heparin-induced thrombocytopenia (HIT)"],
    labCorrelations: ["Peripheral blood smear (platelet clumping, giant platelets, schistocytes)", "PT/INR and aPTT", "Fibrinogen and D-dimer (for DIC)", "Mean platelet volume (MPV)", "Bone marrow biopsy"],
    examTips: [
      "EDTA-dependent pseudothrombocytopenia: always check the feathered edge for platelet clumps. If clumping present, recollect in citrate tube.",
      "Platelet estimate from smear: average platelets per oil immersion field × 20,000 = estimated platelet count",
      "DIC pentad: thrombocytopenia + prolonged PT/aPTT + low fibrinogen + elevated D-dimer + schistocytes",
      "TTP pentad: thrombocytopenia + microangiopathic hemolytic anemia (schistocytes) + fever + renal dysfunction + neurological symptoms",
      "Giant platelets (macrothrombocytes) can be counted as RBCs by impedance analyzers, causing falsely low platelet counts",
    ],
    practiceQuestions: [
      {
        question: "An automated platelet count is 45 × 10⁹/L but the patient has no bleeding symptoms. What should the MLT do first?",
        options: ["Report the result as critical immediately", "Review the peripheral blood smear for platelet clumps", "Request a new specimen in a citrate tube", "Run the specimen on a different analyzer"],
        correctIndex: 1,
        rationale: "The first step is to review the peripheral smear feathered edge for EDTA-dependent platelet clumping (pseudothrombocytopenia). This is the most common cause of falsely low platelet counts. If clumps are present, a citrate tube specimen should be requested for accurate counting.",
      },
      {
        question: "A patient presents with thrombocytopenia, schistocytes on the peripheral smear, elevated LDH, and low haptoglobin. Which condition is most likely?",
        options: ["ITP", "DIC", "TTP/HUS (microangiopathic hemolytic anemia)", "Drug-induced thrombocytopenia"],
        correctIndex: 2,
        rationale: "The combination of thrombocytopenia with schistocytes (fragmented RBCs), elevated LDH, and low haptoglobin defines microangiopathic hemolytic anemia (MAHA), characteristic of TTP/HUS. In TTP, ADAMTS13 deficiency leads to uncleaved vWF multimers causing microvascular thrombi that shear RBCs.",
      },
      {
        question: "How is the platelet count estimated from a peripheral blood smear?",
        options: ["Count platelets in 10 low-power fields and multiply by 1,000", "Average platelets per oil immersion field × 20,000", "Count total platelets on the entire slide", "Estimate based on the proportion to RBCs"],
        correctIndex: 1,
        rationale: "The standard platelet estimate method is to count platelets in 10 oil immersion (100×) fields in the monolayer zone, calculate the average per field, and multiply by 20,000. This provides a reasonable estimate that should correlate with the automated count (±20%).",
      },
    ],
    relatedLabSlugs: ["hemoglobin", "wbc", "potassium", "calcium"],
    faqItems: [
      { question: "What is the normal platelet count for MLT exams?", answer: "Normal platelet count is 150–400 × 10⁹/L (SI units) or 150,000–400,000/µL (conventional units). Values below 150 × 10⁹/L indicate thrombocytopenia; above 400 × 10⁹/L indicate thrombocytosis." },
      { question: "What is pseudothrombocytopenia?", answer: "Pseudothrombocytopenia is a falsely low automated platelet count caused by EDTA-dependent platelet clumping. The anticoagulant EDTA causes platelet aggregation in some patients. Examine the smear feathered edge for clumps and redraw in a citrate tube if present." },
      { question: "What is the platelet estimate from a blood smear?", answer: "Average the number of platelets per oil immersion (100×) field in the monolayer counting zone (10 fields), then multiply by 20,000. For example, an average of 10 platelets/field × 20,000 = 200,000/µL (200 × 10⁹/L)." },
    ],
  },
  {
    slug: "calcium",
    name: "Calcium",
    fullName: "Serum Calcium (Ca²⁺)",
    seoTitle: "Calcium Lab Values for MLT Exam | Total & Ionized Normal Range",
    h1Title: "Calcium (Ca²⁺): Normal Range, Critical Values & MLT Exam Review",
    metaDescription: "MLT exam review of calcium — total calcium 2.15–2.55 mmol/L (SI) / 8.6–10.2 mg/dL (US), ionized calcium, albumin correction, and practice questions for CSMLS and ASCP.",
    keywords: "calcium lab values MLT, Ca2+ normal range, hypercalcemia hypocalcemia MLT exam, ionized calcium, albumin correction calcium",
    discipline: "Clinical Chemistry",
    normalRange: {
      si: { value: "Total: 2.15–2.55; Ionized: 1.15–1.30", unit: "mmol/L" },
      conventional: { value: "Total: 8.6–10.2; Ionized: 4.6–5.2", unit: "mg/dL" },
    },
    specimen: "Serum (red-top or SST) for total calcium. Ionized calcium: anaerobic heparinized whole blood (blood gas syringe). Avoid prolonged tourniquet use (falsely elevates total calcium).",
    overview: "Calcium exists in three forms in blood: ionized (free, ~50% — physiologically active), protein-bound (~40%, primarily to albumin), and complexed (~10%, bound to citrate, phosphate, lactate). Total calcium measures all three forms. Ionized calcium is the biologically active form and is preferred for critical assessment. Calcium homeostasis is regulated by PTH, vitamin D (calcitriol), and calcitonin acting on bone, kidney, and intestine.",
    clinicalSignificance: "Calcium is essential for muscle contraction, nerve conduction, coagulation cascade, and bone metabolism. Hypercalcemia can cause cardiac arrhythmias, kidney stones, and altered mental status. Hypocalcemia causes tetany, Chvostek and Trousseau signs, and prolonged QT interval. In hypoalbuminemia, total calcium may appear low while ionized calcium is normal — corrected calcium formula or direct ionized calcium measurement is needed.",
    highCauses: [
      { condition: "Primary hyperparathyroidism", explanation: "PTH-secreting adenoma causes increased bone resorption, renal calcium reabsorption, and intestinal absorption via vitamin D activation." },
      { condition: "Malignancy (PTHrP-secreting tumors)", explanation: "Squamous cell carcinomas, breast cancer, and multiple myeloma produce PTHrP or cause osteolytic bone destruction." },
      { condition: "Vitamin D toxicity", explanation: "Excessive vitamin D supplementation increases intestinal calcium absorption." },
      { condition: "Granulomatous diseases (sarcoidosis)", explanation: "Macrophages in granulomas convert 25-OH vitamin D to active 1,25-(OH)₂D₃ (calcitriol)." },
    ],
    lowCauses: [
      { condition: "Hypoparathyroidism", explanation: "Post-surgical (thyroidectomy complication) or autoimmune destruction of parathyroid glands → decreased PTH → decreased calcium." },
      { condition: "Vitamin D deficiency", explanation: "Inadequate dietary intake, malabsorption, or insufficient sun exposure reduces calcium absorption from the GI tract." },
      { condition: "Chronic kidney disease", explanation: "Impaired 1-alpha-hydroxylation of vitamin D → decreased calcitriol → decreased intestinal calcium absorption + hyperphosphatemia." },
      { condition: "Hypoalbuminemia", explanation: "Low albumin decreases protein-bound calcium, lowering total calcium. Ionized calcium may be normal (pseudohypocalcemia)." },
    ],
    criticalValues: {
      high: ">3.25 mmol/L (>13.0 mg/dL)",
      low: "<1.75 mmol/L (<7.0 mg/dL)",
      action: "Hypercalcemic crisis: notify physician immediately — risk of cardiac arrest. Severe hypocalcemia: risk of tetany, laryngospasm, seizures.",
    },
    associatedConditions: ["Primary hyperparathyroidism", "Malignancy-associated hypercalcemia", "Chronic kidney disease (renal osteodystrophy)", "Osteoporosis", "Pancreatitis (calcium deposition)"],
    labCorrelations: ["Phosphorus (inverse relationship with calcium)", "PTH (parathyroid hormone)", "Vitamin D (25-OH and 1,25-dihydroxy)", "Albumin (for corrected calcium)", "Magnesium"],
    examTips: [
      "Corrected calcium = measured total Ca + 0.8 × (4.0 − albumin in g/dL). This adjusts for hypoalbuminemia.",
      "Calcium and phosphorus have an INVERSE relationship (governed by PTH)",
      "Ionized calcium is measured by ISE on blood gas analyzers — pH affects ionized calcium (acidosis ↑ ionized Ca, alkalosis ↓ ionized Ca)",
      "EDTA tubes must NEVER be used for calcium testing — EDTA chelates calcium, giving falsely undetectable results",
      "PTH + high calcium = primary hyperparathyroidism. PTH suppressed + high calcium = malignancy or vitamin D toxicity",
    ],
    practiceQuestions: [
      {
        question: "A patient has total calcium of 7.8 mg/dL and albumin of 2.0 g/dL. What is the corrected calcium?",
        options: ["7.8 mg/dL", "9.4 mg/dL", "10.0 mg/dL", "6.2 mg/dL"],
        correctIndex: 1,
        rationale: "Corrected Ca = 7.8 + 0.8 × (4.0 − 2.0) = 7.8 + 1.6 = 9.4 mg/dL. The corrected calcium is within normal range, indicating the low total calcium was due to hypoalbuminemia (pseudohypocalcemia), not true calcium deficiency.",
      },
      {
        question: "Which specimen tube must NEVER be used for calcium measurement?",
        options: ["Red-top (no additive)", "Green-top (lithium heparin)", "Lavender-top (EDTA)", "Gold-top (SST)"],
        correctIndex: 2,
        rationale: "EDTA (ethylenediaminetetraacetic acid) chelates divalent cations, including calcium. A specimen collected in EDTA will show falsely undetectable calcium levels. Calcium should be measured in serum (red-top or SST) or lithium heparin plasma.",
      },
      {
        question: "How does acidosis affect ionized calcium levels?",
        options: ["Ionized calcium decreases", "Ionized calcium increases", "No effect on ionized calcium", "Ionized calcium becomes unmeasurable"],
        correctIndex: 1,
        rationale: "In acidosis, excess H⁺ ions compete with calcium for binding sites on albumin, displacing calcium from protein-bound to ionized form. This increases ionized (free) calcium. Conversely, alkalosis increases protein binding, decreasing ionized calcium. This is why pH must be controlled when measuring ionized calcium.",
      },
    ],
    relatedLabSlugs: ["magnesium", "potassium", "sodium", "abg"],
    faqItems: [
      { question: "What is the difference between total and ionized calcium?", answer: "Total calcium measures all three forms: ionized (free, ~50%), protein-bound (~40%), and complexed (~10%). Ionized calcium is the physiologically active form and is measured directly by ISE on blood gas analyzers. In hypoalbuminemia, total calcium may be low but ionized calcium may be normal." },
      { question: "Why is corrected calcium calculated?", answer: "Total calcium includes the protein-bound fraction. In hypoalbuminemia, total calcium appears low even when ionized calcium is normal. The correction formula adjusts for low albumin: Corrected Ca = measured Ca + 0.8 × (4.0 − albumin in g/dL)." },
      { question: "Can EDTA tubes be used for calcium testing?", answer: "Never. EDTA is a chelating agent that binds divalent cations like calcium, making the result falsely undetectable. Use serum (red-top, SST) or lithium heparin for calcium testing." },
    ],
  },
  {
    slug: "abg",
    name: "ABG (Arterial Blood Gas)",
    fullName: "Arterial Blood Gas (pH, PaCO₂, HCO₃⁻, PaO₂)",
    seoTitle: "ABG Lab Values for MLT Exam | pH, PaCO₂, HCO₃ Normal Ranges",
    h1Title: "ABG (Arterial Blood Gas): Normal Values & MLT Exam Review",
    metaDescription: "MLT exam review of arterial blood gases — pH 7.35–7.45, PaCO₂ 35–45 mmHg, HCO₃ 22–26 mmol/L, PaO₂ 80–100 mmHg. Acid-base interpretation and practice questions.",
    keywords: "ABG lab values MLT, arterial blood gas interpretation, pH PaCO2 HCO3 normal range, acid-base balance MLT exam, respiratory metabolic acidosis alkalosis",
    discipline: "Clinical Chemistry",
    normalRange: {
      si: { value: "pH 7.35–7.45; PaCO₂ 4.7–6.0 kPa; HCO₃⁻ 22–26 mmol/L; PaO₂ 10.7–13.3 kPa", unit: "various" },
      conventional: { value: "pH 7.35–7.45; PaCO₂ 35–45 mmHg; HCO₃⁻ 22–26 mEq/L; PaO₂ 80–100 mmHg", unit: "various" },
    },
    specimen: "Arterial blood in pre-heparinized syringe. Must be analyzed within 30 minutes (or iced for transport). Air bubbles must be expelled immediately — room air contamination raises PaO₂ and lowers PaCO₂.",
    overview: "Arterial blood gas (ABG) analysis measures pH, partial pressures of carbon dioxide (PaCO₂) and oxygen (PaO₂), and calculated values including bicarbonate (HCO₃⁻) and base excess. ABGs are analyzed on blood gas analyzers using potentiometric (pH, PaCO₂) and amperometric (PaO₂) electrodes. ABGs assess acid-base status, ventilation (PaCO₂), and oxygenation (PaO₂). The Henderson-Hasselbalch equation describes the relationship: pH = 6.1 + log([HCO₃⁻] / 0.03 × PaCO₂).",
    clinicalSignificance: "ABG interpretation identifies four primary acid-base disorders: respiratory acidosis (hypoventilation), respiratory alkalosis (hyperventilation), metabolic acidosis (acid gain or bicarbonate loss), and metabolic alkalosis (acid loss or bicarbonate gain). Compensation mechanisms involve the lungs (adjusting PaCO₂) and kidneys (adjusting HCO₃⁻ reabsorption/excretion). The anion gap [Na⁺ − (Cl⁻ + HCO₃⁻)] differentiates causes of metabolic acidosis.",
    highCauses: [
      { condition: "Respiratory alkalosis (low PaCO₂, high pH)", explanation: "Hyperventilation from anxiety, pain, PE, early sepsis, or mechanical overventilation blows off CO₂." },
      { condition: "Metabolic alkalosis (high HCO₃⁻, high pH)", explanation: "Vomiting (loss of HCl), NG suction, diuretics, or excessive bicarbonate administration." },
    ],
    lowCauses: [
      { condition: "Respiratory acidosis (high PaCO₂, low pH)", explanation: "Hypoventilation from COPD, sedation, neuromuscular disease, or airway obstruction retains CO₂." },
      { condition: "Metabolic acidosis (low HCO₃⁻, low pH)", explanation: "DKA, lactic acidosis, renal failure (high anion gap) or diarrhea, RTA (normal anion gap)." },
    ],
    criticalValues: {
      high: "pH >7.60 or PaCO₂ >70 mmHg or PaO₂ <40 mmHg",
      low: "pH <7.20",
      action: "Notify physician immediately. Severe acidemia or alkalemia can cause cardiac arrest. Verify specimen integrity (no air bubbles, analyzed promptly).",
    },
    associatedConditions: ["COPD (chronic respiratory acidosis)", "DKA (high anion gap metabolic acidosis)", "Pulmonary embolism (respiratory alkalosis)", "Renal tubular acidosis", "Salicylate toxicity (mixed disorder)"],
    labCorrelations: ["Electrolytes (Na⁺, K⁺, Cl⁻) for anion gap calculation", "Lactate", "Serum osmolality (osmolal gap)", "BUN/Creatinine", "Glucose"],
    examTips: [
      "Anion gap = Na⁺ − (Cl⁻ + HCO₃⁻). Normal = 8–12 mEq/L. Elevated in DKA, lactic acidosis, renal failure, toxins (MUDPILES mnemonic)",
      "Henderson-Hasselbalch: pH = 6.1 + log([HCO₃⁻] / 0.03 × PaCO₂)",
      "pH electrode = modified glass electrode (Severinghaus for PaCO₂, Clark for PaO₂)",
      "Air bubbles equilibrate with room air: PaO₂ falsely ↑, PaCO₂ falsely ↓",
      "To convert mmHg to kPa: divide by 7.5 (e.g., 40 mmHg ÷ 7.5 = 5.3 kPa)",
    ],
    practiceQuestions: [
      {
        question: "ABG results: pH 7.28, PaCO₂ 30 mmHg, HCO₃⁻ 14 mEq/L. What is the acid-base disturbance?",
        options: ["Respiratory acidosis", "Respiratory alkalosis", "Metabolic acidosis with respiratory compensation", "Mixed respiratory and metabolic alkalosis"],
        correctIndex: 2,
        rationale: "pH 7.28 is acidotic. HCO₃⁻ is low (14 mEq/L), indicating metabolic acidosis as the primary disorder. PaCO₂ is low (30 mmHg), representing respiratory compensation (hyperventilation to blow off CO₂ and raise pH). The anion gap should be calculated next.",
      },
      {
        question: "What electrode is used to measure PaO₂ in a blood gas analyzer?",
        options: ["Glass electrode", "Severinghaus electrode", "Clark electrode (polarographic)", "Ion-selective electrode"],
        correctIndex: 2,
        rationale: "The Clark electrode (polarographic electrode) measures PaO₂ amperometrically. It consists of a platinum cathode and silver/silver chloride anode separated from the specimen by an oxygen-permeable membrane. The pH glass electrode measures pH, and the Severinghaus electrode measures PaCO₂.",
      },
      {
        question: "An ABG specimen is received with visible air bubbles. How will this affect the results?",
        options: ["PaO₂ falsely decreased, PaCO₂ falsely increased", "PaO₂ falsely increased, PaCO₂ falsely decreased", "Only pH is affected", "No significant effect if analyzed within 30 minutes"],
        correctIndex: 1,
        rationale: "Air bubbles equilibrate with room air (PO₂ ~150 mmHg, PCO₂ ~0.3 mmHg). This raises PaO₂ (room air PO₂ > most arterial PO₂) and lowers PaCO₂ (room air PCO₂ < arterial PCO₂). Air bubbles must be expelled immediately before analysis.",
      },
    ],
    relatedLabSlugs: ["potassium", "sodium", "calcium", "glucose", "bun-creatinine"],
    faqItems: [
      { question: "What are normal ABG values for MLT exams?", answer: "pH 7.35–7.45, PaCO₂ 35–45 mmHg (4.7–6.0 kPa), HCO₃⁻ 22–26 mmol/L (mEq/L), PaO₂ 80–100 mmHg (10.7–13.3 kPa). These values represent arterial blood from a healthy individual at sea level." },
      { question: "How is ABG different from a venous blood gas?", answer: "ABGs measure arterial blood (reflecting lung function and systemic oxygenation). Venous blood gases have lower PaO₂, higher PaCO₂, and slightly lower pH. ABGs are the gold standard for assessing oxygenation and acid-base status." },
      { question: "What is the anion gap and why does it matter?", answer: "Anion gap = Na⁺ − (Cl⁻ + HCO₃⁻). Normal is 8–12 mEq/L. An elevated anion gap indicates unmeasured anions (lactate, ketoacids, uremia, toxins). It differentiates causes of metabolic acidosis: high AG (DKA, lactic acidosis) vs. normal AG (diarrhea, RTA)." },
    ],
  },
  {
    slug: "bun-creatinine",
    name: "BUN/Creatinine",
    fullName: "Blood Urea Nitrogen (BUN) & Serum Creatinine",
    seoTitle: "BUN & Creatinine Lab Values for MLT Exam | Renal Function Panel",
    h1Title: "BUN/Creatinine: Normal Range, Ratio Interpretation & MLT Exam Review",
    metaDescription: "MLT exam review of BUN and creatinine — BUN 2.5–7.1 mmol/L (SI), creatinine 62–115 µmol/L (SI), BUN/creatinine ratio, GFR estimation, and practice questions.",
    keywords: "BUN creatinine lab values MLT, renal function panel, GFR estimation MLT exam, BUN creatinine ratio, kidney function tests",
    discipline: "Clinical Chemistry",
    normalRange: {
      si: { value: "BUN (Urea): 2.5–7.1 mmol/L; Creatinine: 62–115 µmol/L (male), 44–97 µmol/L (female)", unit: "mmol/L / µmol/L" },
      conventional: { value: "BUN: 7–20 mg/dL; Creatinine: 0.7–1.3 mg/dL (male), 0.5–1.1 mg/dL (female)", unit: "mg/dL" },
    },
    specimen: "Serum (red-top or SST). Fasting preferred for BUN (high-protein meals can elevate BUN). Creatinine is less affected by diet.",
    overview: "BUN and creatinine are the primary markers for assessing renal function. BUN is the end product of protein catabolism, produced in the liver via the urea cycle and excreted by the kidneys. Creatinine is a waste product of creatine phosphate metabolism in skeletal muscle, produced at a constant rate and freely filtered by the glomeruli. Creatinine is a more specific marker of renal function than BUN because it is less affected by diet, hydration, and liver function.",
    clinicalSignificance: "Both BUN and creatinine rise in renal dysfunction, but the BUN/creatinine ratio helps differentiate prerenal, intrinsic renal, and postrenal causes. BUN/Cr ratio >20:1 suggests prerenal azotemia (dehydration, CHF, hemorrhage). Ratio 10–20:1 is normal or intrinsic renal disease. Creatinine is used to estimate GFR using the CKD-EPI or MDRD equations. eGFR <60 mL/min/1.73m² for >3 months defines chronic kidney disease.",
    highCauses: [
      { condition: "Prerenal azotemia (dehydration, CHF, shock)", explanation: "Decreased renal perfusion reduces GFR. BUN rises disproportionately to creatinine (ratio >20:1) because urea is passively reabsorbed with water." },
      { condition: "Intrinsic renal disease (ATN, glomerulonephritis)", explanation: "Direct kidney damage impairs filtration. Both BUN and creatinine rise proportionally (ratio 10–20:1)." },
      { condition: "Postrenal obstruction (kidney stones, BPH, tumor)", explanation: "Obstruction causes back-pressure that impairs filtration. Both markers rise." },
      { condition: "High protein diet / GI bleeding (BUN only)", explanation: "Increased protein load from diet or digested blood in GI bleeding elevates BUN without affecting creatinine." },
    ],
    lowCauses: [
      { condition: "Liver disease (BUN only)", explanation: "Impaired hepatic urea cycle reduces BUN production despite normal/impaired renal function." },
      { condition: "Malnutrition / low protein intake (BUN only)", explanation: "Reduced substrate for urea production lowers BUN." },
      { condition: "Low muscle mass (creatinine only)", explanation: "Elderly patients, amputees, and cachectic patients produce less creatinine from reduced muscle mass." },
    ],
    criticalValues: {
      high: "Creatinine >707 µmol/L (>8.0 mg/dL) or BUN >35.7 mmol/L (>100 mg/dL)",
      action: "Notify physician immediately. Severely elevated creatinine and BUN indicate acute or end-stage renal failure requiring urgent evaluation for dialysis.",
    },
    associatedConditions: ["Acute kidney injury (AKI)", "Chronic kidney disease (CKD)", "Diabetic nephropathy", "Prerenal azotemia", "Urinary tract obstruction"],
    labCorrelations: ["eGFR (calculated from creatinine)", "Cystatin C (alternative GFR marker)", "Urinalysis (proteinuria, casts)", "Electrolytes (K⁺, Na⁺, Ca²⁺, phosphorus)", "Albumin (nephrotic syndrome)"],
    examTips: [
      "Creatinine is more specific for renal function than BUN (BUN is affected by diet, hydration, liver function, GI bleeding)",
      "BUN/Cr ratio >20:1 = prerenal; 10–20:1 = normal/intrinsic; <10:1 = liver disease or malnutrition",
      "Jaffe reaction (alkaline picrate) is the classic colorimetric method for creatinine — subject to positive interference from ketones, bilirubin, cephalosporins",
      "Enzymatic creatinine methods are more specific and less susceptible to interferences",
      "eGFR should be calculated using CKD-EPI equation — a creatinine of 1.0 mg/dL gives different eGFR values depending on age, sex, and race",
    ],
    practiceQuestions: [
      {
        question: "A patient has BUN 84 mg/dL and creatinine 2.8 mg/dL. What is the BUN/creatinine ratio and what does it suggest?",
        options: ["30:1 — prerenal azotemia", "15:1 — intrinsic renal disease", "10:1 — normal", "5:1 — liver disease"],
        correctIndex: 0,
        rationale: "BUN/Cr ratio = 84/2.8 = 30:1. A ratio >20:1 suggests prerenal azotemia — decreased renal perfusion (dehydration, CHF, hemorrhage) causes enhanced urea reabsorption in the proximal tubule, disproportionately elevating BUN relative to creatinine.",
      },
      {
        question: "Which method for creatinine measurement is most susceptible to interference from ketones and bilirubin?",
        options: ["Enzymatic creatinine assay", "Jaffe reaction (alkaline picrate)", "HPLC reference method", "Mass spectrometry"],
        correctIndex: 1,
        rationale: "The Jaffe reaction uses alkaline picrate to form a red chromogen with creatinine, measured at 520 nm. It is subject to positive interference from non-creatinine chromogens including acetoacetate (ketones), bilirubin, cephalosporin antibiotics, and proteins. Enzymatic methods are more specific.",
      },
      {
        question: "A patient has a stable creatinine of 1.0 mg/dL with a calculated eGFR of 85 mL/min. What stage of CKD does this represent?",
        options: ["Stage 1 (eGFR ≥90)", "Stage 2 (eGFR 60–89)", "Stage 3a (eGFR 45–59)", "No CKD"],
        correctIndex: 1,
        rationale: "eGFR 60–89 mL/min/1.73m² corresponds to Stage 2 CKD (mildly decreased kidney function). However, CKD diagnosis also requires evidence of kidney damage (proteinuria, abnormal imaging, or structural abnormality). eGFR alone without kidney damage markers may not establish CKD diagnosis at Stage 2.",
      },
    ],
    relatedLabSlugs: ["potassium", "sodium", "calcium", "glucose", "abg"],
    faqItems: [
      { question: "What is the normal BUN and creatinine range for MLT exams?", answer: "BUN: 7–20 mg/dL (2.5–7.1 mmol/L). Creatinine: 0.7–1.3 mg/dL (62–115 µmol/L) for males; 0.5–1.1 mg/dL (44–97 µmol/L) for females. Note: the SI conversion for urea nitrogen (BUN) to urea involves a factor of 2.14." },
      { question: "Why is creatinine better than BUN for assessing kidney function?", answer: "Creatinine is produced at a constant rate from muscle metabolism, is freely filtered by the glomeruli, and is not significantly reabsorbed or affected by diet. BUN is affected by protein intake, GI bleeding, hydration, liver function, and tubular reabsorption." },
      { question: "What is the BUN/creatinine ratio used for?", answer: "The ratio differentiates causes of azotemia. >20:1 suggests prerenal causes (dehydration, CHF). 10–20:1 is normal or intrinsic renal. <10:1 suggests liver disease or malnutrition (low BUN production)." },
    ],
  },
  {
    slug: "a1c",
    name: "Hemoglobin A1C",
    fullName: "Glycated Hemoglobin (HbA1c / A1C)",
    seoTitle: "HbA1c Lab Values for MLT Exam | Normal Range & Methodology",
    h1Title: "HbA1c (Hemoglobin A1C): Normal Range, Methods & MLT Exam Review",
    metaDescription: "MLT exam review of HbA1c — normal <5.7%, diagnostic threshold ≥6.5%, HPLC and immunoassay methods, interferences from hemoglobin variants, and practice questions.",
    keywords: "HbA1c lab values MLT, hemoglobin A1C normal range, glycated hemoglobin MLT exam, HPLC A1C method, diabetes monitoring MLT",
    discipline: "Clinical Chemistry",
    normalRange: {
      si: { value: "<39 (normal); 39–47 (prediabetes); ≥48 (diabetes)", unit: "mmol/mol" },
      conventional: { value: "<5.7% (normal); 5.7–6.4% (prediabetes); ≥6.5% (diabetes)", unit: "% of total Hgb" },
    },
    specimen: "EDTA whole blood (lavender-top tube). Not affected by fasting status, time of day, or acute glucose changes. Reflects average glucose over preceding 2–3 months (RBC lifespan ~120 days).",
    overview: "HbA1c is formed by the non-enzymatic glycation of the N-terminal valine on the beta chain of hemoglobin A. The degree of glycation is proportional to the average blood glucose concentration over the preceding 2–3 months (the lifespan of a red blood cell). HbA1c is used for both diabetes diagnosis (≥6.5%) and long-term glycemic monitoring. Methods include HPLC (reference method), immunoassay, and boronate affinity chromatography.",
    clinicalSignificance: "HbA1c provides a time-averaged assessment of glycemic control, unlike fasting glucose which is a single point-in-time measurement. Target HbA1c for most diabetic patients is <7.0% (53 mmol/mol). Conditions that affect RBC lifespan or hemoglobin structure can produce misleading results. Any condition that shortens RBC lifespan (hemolytic anemia, blood loss) falsely lowers A1c. Hemoglobin variants (HbS, HbC, HbE) can interfere with certain analytical methods.",
    highCauses: [
      { condition: "Uncontrolled diabetes mellitus", explanation: "Chronic hyperglycemia increases non-enzymatic glycation of hemoglobin over the RBC lifespan." },
      { condition: "Iron deficiency anemia", explanation: "Prolonged RBC lifespan (fewer new RBCs) allows more glycation time, falsely elevating A1c relative to actual glucose control." },
      { condition: "Splenectomy", explanation: "Reduced RBC clearance extends RBC lifespan, increasing glycation time." },
    ],
    lowCauses: [
      { condition: "Hemolytic anemias", explanation: "Shortened RBC lifespan reduces glycation time, producing falsely low A1c that underestimates true glucose control." },
      { condition: "Recent blood transfusion", explanation: "Transfused normal Hgb dilutes the patient's glycated hemoglobin, lowering the measured A1c." },
      { condition: "Chronic blood loss", explanation: "Increased RBC turnover introduces younger RBCs with less glycation exposure." },
      { condition: "Hemoglobin variants (HbS, HbC, HbF)", explanation: "Can interfere with HPLC and immunoassay methods — may produce falsely high or low results depending on the method." },
    ],
    criticalValues: {
      high: ">15% (>140 mmol/mol)",
      action: "Notify physician. Severely elevated A1c indicates profound sustained hyperglycemia with high risk for diabetic complications.",
    },
    associatedConditions: ["Type 1 and Type 2 diabetes mellitus", "Gestational diabetes", "Prediabetes", "Hemoglobinopathies (method interference)", "Hemolytic anemias (falsely low results)"],
    labCorrelations: ["Fasting glucose", "Oral glucose tolerance test (OGTT)", "Fructosamine (2–3 week glycemic average)", "Glycated albumin", "C-peptide (insulin production marker)"],
    examTips: [
      "HPLC (ion-exchange chromatography) is the reference/gold standard method for HbA1c — separates hemoglobin fractions by charge",
      "NGSP (National Glycohemoglobin Standardization Program) ensures method standardization",
      "Conditions that shorten RBC lifespan → falsely LOW A1c (hemolysis, blood loss, transfusion)",
      "Conditions that prolong RBC lifespan → falsely HIGH A1c (iron deficiency, splenectomy)",
      "HbF (fetal hemoglobin) interferes with some HPLC methods by co-eluting with HbA1c peak",
    ],
    practiceQuestions: [
      {
        question: "A patient with sickle cell disease (HbSS) has an HbA1c of 5.2% but a fasting glucose of 180 mg/dL. What is the most likely explanation?",
        options: ["The fasting glucose is falsely elevated", "The HbA1c is falsely low due to shortened RBC lifespan", "The patient has excellent glycemic control", "The HbA1c method is not affected by hemoglobin variants"],
        correctIndex: 1,
        rationale: "Sickle cell disease causes chronic hemolysis, significantly shortening RBC lifespan. With fewer days of glucose exposure, glycation is reduced and HbA1c is falsely low. The elevated fasting glucose suggests poor glycemic control. Fructosamine or glycated albumin should be used for monitoring instead.",
      },
      {
        question: "Which analytical method is considered the reference method for HbA1c measurement?",
        options: ["Immunoassay (immunoturbidimetric)", "Boronate affinity chromatography", "Ion-exchange HPLC", "Enzymatic assay"],
        correctIndex: 2,
        rationale: "Ion-exchange HPLC is the reference method for HbA1c, separating hemoglobin fractions based on charge differences. It is the method standardized by the NGSP and IFCC. However, HPLC is susceptible to interference from hemoglobin variants (HbS, HbC, HbE) that co-elute with or near the HbA1c peak.",
      },
      {
        question: "What does an HbA1c of 7.0% correspond to in terms of estimated average glucose (eAG)?",
        options: ["100 mg/dL (5.6 mmol/L)", "126 mg/dL (7.0 mmol/L)", "154 mg/dL (8.6 mmol/L)", "200 mg/dL (11.1 mmol/L)"],
        correctIndex: 2,
        rationale: "Using the eAG formula: eAG (mg/dL) = 28.7 × A1c − 46.7. For A1c 7.0%: 28.7 × 7.0 − 46.7 = 154.2 mg/dL (8.6 mmol/L). This formula was validated by the ADAG study and is recommended by the ADA for patient communication.",
      },
    ],
    relatedLabSlugs: ["glucose", "hemoglobin", "bun-creatinine", "calcium"],
    faqItems: [
      { question: "What is the normal HbA1c range for MLT exams?", answer: "Normal: <5.7% (<39 mmol/mol). Prediabetes: 5.7–6.4% (39–47 mmol/mol). Diabetes diagnosis: ≥6.5% (≥48 mmol/mol). Target for most diabetic patients: <7.0% (<53 mmol/mol)." },
      { question: "Why can hemoglobin variants affect HbA1c results?", answer: "Hemoglobin variants (HbS, HbC, HbE, HbF) can interfere with HPLC and immunoassay methods by co-eluting with or masking the HbA1c peak. Some variants cause falsely high results, others falsely low. Method-specific interference charts are available from the NGSP." },
      { question: "What is the difference between A1c and fructosamine?", answer: "A1c reflects average glucose over 2–3 months (RBC lifespan). Fructosamine reflects average glucose over 2–3 weeks (albumin half-life). Fructosamine is useful when A1c is unreliable (hemoglobinopathies, hemolytic anemia, recent transfusion)." },
    ],
  },
  {
    slug: "glucose",
    name: "Glucose",
    fullName: "Blood Glucose (Fasting & Random)",
    seoTitle: "Glucose Lab Values for MLT Exam | Fasting, Random & OGTT Normal Ranges",
    h1Title: "Glucose: Normal Range, Diagnostic Criteria & MLT Exam Review",
    metaDescription: "MLT exam review of glucose — fasting 3.9–5.6 mmol/L (SI) / 70–100 mg/dL (US), OGTT, diagnostic thresholds for diabetes, glycolysis artifact, and practice questions.",
    keywords: "glucose lab values MLT, fasting glucose normal range, diabetes diagnosis MLT exam, OGTT, glycolysis artifact, blood glucose testing",
    discipline: "Clinical Chemistry",
    normalRange: {
      si: { value: "Fasting: 3.9–5.6; Random: <7.8", unit: "mmol/L" },
      conventional: { value: "Fasting: 70–100; Random: <140", unit: "mg/dL" },
    },
    specimen: "Plasma (gray-top NaF/KOx tube preferred — sodium fluoride inhibits glycolysis). Serum acceptable if separated within 30 minutes. Whole blood glucose is ~15% lower than plasma glucose.",
    overview: "Glucose is the primary energy substrate for cellular metabolism. Blood glucose measurement is the most frequently ordered chemistry test. It is critical for diagnosing and monitoring diabetes mellitus, hypoglycemia, and metabolic emergencies (DKA, HHS). Glucose is measured by enzymatic methods: hexokinase (reference method) or glucose oxidase. Sodium fluoride tubes inhibit glycolysis to preserve glucose concentration during transport.",
    clinicalSignificance: "Hyperglycemia is defined by fasting glucose ≥126 mg/dL (7.0 mmol/L) or random glucose ≥200 mg/dL (11.1 mmol/L) with symptoms. The 2-hour OGTT with 75g glucose load has a threshold of ≥200 mg/dL (11.1 mmol/L) for diabetes diagnosis. Glycolysis in unseparated specimens decreases glucose by ~5–7% per hour at room temperature — sodium fluoride tubes or rapid separation prevents this artifact.",
    highCauses: [
      { condition: "Diabetes mellitus (Type 1 and Type 2)", explanation: "Insulin deficiency (T1DM) or insulin resistance (T2DM) impairs glucose uptake, causing sustained hyperglycemia." },
      { condition: "Diabetic ketoacidosis (DKA)", explanation: "Absolute insulin deficiency causes lipolysis, ketogenesis, and severe hyperglycemia (often >300 mg/dL)." },
      { condition: "Hyperosmolar hyperglycemic state (HHS)", explanation: "Severe hyperglycemia (often >600 mg/dL) with profound dehydration, without significant ketosis." },
      { condition: "Cushing syndrome / corticosteroid use", explanation: "Cortisol increases gluconeogenesis and insulin resistance." },
      { condition: "Stress response (acute illness, trauma, surgery)", explanation: "Catecholamines and cortisol released during stress increase hepatic glucose output." },
    ],
    lowCauses: [
      { condition: "Insulin overdose / sulfonylurea use", explanation: "Excessive insulin or insulin secretagogues cause hypoglycemia by driving glucose into cells." },
      { condition: "Insulinoma", explanation: "Pancreatic islet cell tumor autonomously secretes insulin despite low glucose (Whipple triad)." },
      { condition: "Glycolysis artifact (pre-analytical)", explanation: "In vitro glycolysis in specimens not collected in NaF tubes or not promptly separated decreases glucose ~5–7%/hour." },
      { condition: "Hepatic failure", explanation: "Impaired gluconeogenesis and glycogenolysis reduce glucose production." },
      { condition: "Sepsis", explanation: "Increased cellular glucose consumption and impaired gluconeogenesis can cause hypoglycemia." },
    ],
    criticalValues: {
      high: ">27.8 mmol/L (>500 mg/dL)",
      low: "<2.2 mmol/L (<40 mg/dL)",
      action: "Critical high: notify physician — risk of DKA or HHS. Critical low: notify immediately — risk of seizures, loss of consciousness, brain damage.",
    },
    associatedConditions: ["Diabetes mellitus (Type 1, Type 2, gestational)", "DKA and HHS", "Insulinoma", "Metabolic syndrome", "Hypoglycemia of infancy"],
    labCorrelations: ["HbA1c (long-term glucose control)", "Fructosamine", "C-peptide and insulin levels", "Ketones (urine and serum)", "Anion gap (for DKA)"],
    examTips: [
      "Hexokinase is the reference method for glucose; glucose oxidase is also widely used but is susceptible to oxygen tension interference",
      "Sodium fluoride (NaF) inhibits enolase in the glycolytic pathway — use gray-top tube to preserve glucose",
      "Glycolysis decreases glucose ~5–7% per hour in unseparated specimens at room temperature",
      "Diabetes diagnosis requires TWO abnormal results on separate days (unless unequivocal hyperglycemia with symptoms)",
      "Point-of-care glucose meters use glucose oxidase or glucose dehydrogenase; hematocrit extremes affect accuracy",
    ],
    practiceQuestions: [
      {
        question: "A fasting glucose specimen is drawn in a red-top tube and sits at room temperature for 3 hours before centrifugation. The glucose result is 62 mg/dL. What is the most likely explanation?",
        options: ["The patient has true hypoglycemia", "Glycolysis has decreased the glucose level artificially", "The specimen is hemolyzed", "The analyzer needs calibration"],
        correctIndex: 1,
        rationale: "In a red-top (non-NaF) tube left at room temperature, glycolysis by blood cells decreases glucose by ~5–7% per hour. After 3 hours, the result is falsely low. A gray-top NaF tube should have been used, or the serum should have been separated within 30 minutes.",
      },
      {
        question: "Which enzymatic method is the reference method for glucose measurement?",
        options: ["Glucose oxidase/peroxidase", "Hexokinase/G-6-PDH", "Glucose dehydrogenase", "Benedict's copper reduction"],
        correctIndex: 1,
        rationale: "The hexokinase/glucose-6-phosphate dehydrogenase (G-6-PDH) method is the reference method for glucose. Hexokinase phosphorylates glucose to G-6-P, which is oxidized by G-6-PDH with NAD⁺ → NADH. The increase in NADH is measured at 340 nm and is proportional to glucose concentration.",
      },
      {
        question: "A 2-hour OGTT result of 165 mg/dL (9.2 mmol/L) indicates what diagnostic category?",
        options: ["Normal glucose tolerance", "Impaired glucose tolerance (prediabetes)", "Diabetes mellitus", "Impaired fasting glucose"],
        correctIndex: 1,
        rationale: "A 2-hour OGTT of 140–199 mg/dL (7.8–11.0 mmol/L) indicates impaired glucose tolerance (IGT), classified as prediabetes. Normal is <140 mg/dL. Diabetes is diagnosed at ≥200 mg/dL (11.1 mmol/L). Impaired fasting glucose (IFG) is a separate category based on fasting glucose 100–125 mg/dL.",
      },
    ],
    relatedLabSlugs: ["a1c", "potassium", "sodium", "abg", "bun-creatinine"],
    faqItems: [
      { question: "What is the normal fasting glucose for MLT exams?", answer: "Normal fasting glucose: 70–100 mg/dL (3.9–5.6 mmol/L). Impaired fasting glucose (prediabetes): 100–125 mg/dL (5.6–6.9 mmol/L). Diabetes: ≥126 mg/dL (≥7.0 mmol/L) on two separate occasions." },
      { question: "Why are gray-top (NaF) tubes used for glucose specimens?", answer: "Sodium fluoride inhibits enolase, an enzyme in the glycolytic pathway, preventing blood cells from consuming glucose in vitro. Without NaF, glucose decreases ~5–7% per hour at room temperature, producing falsely low results." },
      { question: "What is the difference between the hexokinase and glucose oxidase methods?", answer: "Hexokinase (reference method) uses HK + G-6-PDH to produce NADH measured at 340 nm. Glucose oxidase uses GOD + peroxidase with a chromogenic substrate. GOD is more susceptible to interference from reducing substances (ascorbic acid, uric acid) and oxygen tension." },
    ],
  },
  {
    slug: "magnesium",
    name: "Magnesium",
    fullName: "Serum Magnesium (Mg²⁺)",
    seoTitle: "Magnesium Lab Values for MLT Exam | Normal Range & Clinical Significance",
    h1Title: "Magnesium (Mg²⁺): Normal Range, Critical Values & MLT Exam Review",
    metaDescription: "MLT exam review of magnesium — normal range 0.75–1.05 mmol/L (SI) / 1.8–2.5 mg/dL (US), hypomagnesemia causes, refractory hypokalemia, and practice questions.",
    keywords: "magnesium lab values MLT, Mg2+ normal range, hypomagnesemia MLT exam, magnesium critical values, electrolyte panel MLT",
    discipline: "Clinical Chemistry",
    normalRange: {
      si: { value: "0.75–1.05", unit: "mmol/L" },
      conventional: { value: "1.8–2.5", unit: "mg/dL" },
    },
    specimen: "Serum (red-top or SST). Avoid hemolysis — RBCs contain 3× more magnesium than serum. Separate promptly.",
    overview: "Magnesium is the fourth most abundant cation in the body and the second most abundant intracellular cation after potassium. It is an essential cofactor for >300 enzymatic reactions, including ATP-dependent reactions, DNA/RNA synthesis, and ion channel regulation. About 60% of body magnesium is in bone, 39% intracellular, and only ~1% extracellular. Serum magnesium is measured by spectrophotometric methods (xylidyl blue, calmagite) or atomic absorption.",
    clinicalSignificance: "Hypomagnesemia is common and often underdiagnosed. It frequently coexists with hypokalemia and hypocalcemia. Importantly, hypokalemia is refractory to potassium replacement until magnesium is corrected — this is a high-yield exam concept. Severe hypomagnesemia causes neuromuscular irritability (tetany, seizures), cardiac arrhythmias (torsades de pointes), and can be life-threatening.",
    highCauses: [
      { condition: "Renal failure", explanation: "Impaired renal magnesium excretion leads to accumulation. Both AKI and CKD can cause hypermagnesemia." },
      { condition: "Excessive magnesium intake", explanation: "Magnesium-containing antacids, laxatives, or IV magnesium sulfate (eclampsia treatment) can cause iatrogenic hypermagnesemia." },
      { condition: "Hemolyzed specimen", explanation: "RBCs contain ~3× more magnesium than serum. Hemolysis falsely elevates the result." },
    ],
    lowCauses: [
      { condition: "Alcoholism / malnutrition", explanation: "Chronic alcohol use impairs intestinal absorption and increases renal excretion of magnesium." },
      { condition: "Loop and thiazide diuretics", explanation: "Increase renal magnesium wasting by reducing reabsorption in the Loop of Henle and DCT." },
      { condition: "GI losses (diarrhea, malabsorption)", explanation: "Magnesium is primarily absorbed in the small intestine; chronic diarrhea depletes stores." },
      { condition: "Proton pump inhibitors (PPIs)", explanation: "Long-term PPI use reduces intestinal magnesium absorption, causing chronic hypomagnesemia." },
    ],
    criticalValues: {
      high: ">2.06 mmol/L (>5.0 mg/dL)",
      low: "<0.5 mmol/L (<1.2 mg/dL)",
      action: "Critical high: risk of respiratory depression, cardiac arrest (treat with IV calcium). Critical low: risk of cardiac arrhythmias (torsades de pointes), seizures.",
    },
    associatedConditions: ["Chronic alcoholism", "Renal failure", "Eclampsia/preeclampsia", "Refractory hypokalemia", "Torsades de pointes"],
    labCorrelations: ["Potassium (K⁺) — refractory hypokalemia", "Calcium (Ca²⁺) — concurrent hypocalcemia", "Phosphorus", "BUN/Creatinine", "ECG (prolonged QT)"],
    examTips: [
      "Key concept: hypokalemia that doesn't respond to potassium replacement → check and correct magnesium FIRST",
      "Hemolysis falsely elevates magnesium — RBCs contain ~3× more Mg²⁺ than serum",
      "Magnesium sulfate is the drug of choice for eclampsia/preeclampsia seizure prophylaxis and torsades de pointes",
      "Colorimetric methods (xylidyl blue, calmagite) are most commonly used for serum magnesium measurement",
      "Only ~1% of total body magnesium is in serum — a normal serum level does not exclude total body depletion",
    ],
    practiceQuestions: [
      {
        question: "A patient has persistent hypokalemia despite aggressive IV potassium replacement. What electrolyte should be checked?",
        options: ["Sodium", "Chloride", "Magnesium", "Phosphorus"],
        correctIndex: 2,
        rationale: "Hypomagnesemia causes refractory hypokalemia by affecting the ROMK channels in the distal nephron, leading to continued renal potassium wasting. Potassium will not normalize until magnesium is corrected first. This is a critical concept for both MLT and clinical exams.",
      },
      {
        question: "Which pre-analytical factor most commonly causes falsely elevated magnesium results?",
        options: ["Lipemia", "Icterus", "Hemolysis", "Delayed centrifugation"],
        correctIndex: 2,
        rationale: "RBCs contain approximately three times more magnesium than serum. Hemolysis releases intracellular magnesium, causing falsely elevated results. Always check specimen quality and reject hemolyzed specimens for magnesium testing.",
      },
      {
        question: "What is the drug of choice for seizure prophylaxis in eclampsia?",
        options: ["Diazepam", "Phenytoin", "Magnesium sulfate", "Calcium gluconate"],
        correctIndex: 2,
        rationale: "Magnesium sulfate is the first-line treatment for seizure prophylaxis in eclampsia and preeclampsia. It is also the treatment of choice for torsades de pointes (polymorphic ventricular tachycardia associated with prolonged QT interval).",
      },
    ],
    relatedLabSlugs: ["potassium", "calcium", "sodium", "bun-creatinine"],
    faqItems: [
      { question: "What is the normal magnesium range for MLT exams?", answer: "Normal serum magnesium: 1.8–2.5 mg/dL (0.75–1.05 mmol/L). Critical low: <1.2 mg/dL (<0.5 mmol/L). Critical high: >5.0 mg/dL (>2.06 mmol/L)." },
      { question: "Why does low magnesium cause refractory hypokalemia?", answer: "Hypomagnesemia affects ROMK potassium channels in the distal nephron, causing ongoing renal potassium wasting that cannot be overcome by potassium replacement alone. Magnesium must be repleted first to close these channels and allow potassium retention." },
      { question: "How is serum magnesium measured?", answer: "Serum magnesium is most commonly measured by colorimetric methods using dye-binding reagents (xylidyl blue or calmagite) that form colored complexes with Mg²⁺. Atomic absorption spectrophotometry (AAS) is the reference method but is rarely used in routine clinical labs." },
    ],
  },
  {
    slug: "troponin",
    name: "Troponin",
    fullName: "Cardiac Troponin (cTnI / cTnT)",
    seoTitle: "Troponin Lab Values for MLT Exam | Cardiac Biomarkers & Methodology",
    h1Title: "Troponin (cTnI/cTnT): Normal Range, Methods & MLT Exam Review",
    metaDescription: "MLT exam review of cardiac troponin — normal <0.04 ng/mL, high-sensitivity assays, immunoassay methodology, serial testing for MI diagnosis, and practice questions.",
    keywords: "troponin lab values MLT, cardiac troponin cTnI cTnT, myocardial infarction diagnosis MLT exam, high-sensitivity troponin, cardiac biomarkers",
    discipline: "Clinical Chemistry",
    normalRange: {
      si: { value: "<0.04 (conventional); hs-cTn: <14–52 ng/L (assay-dependent)", unit: "ng/mL or ng/L" },
      conventional: { value: "<0.04 ng/mL (conventional); hs-cTn: <14–52 ng/L (assay-dependent)", unit: "ng/mL or ng/L" },
    },
    specimen: "Serum or plasma (lithium heparin). Serial sampling at 0, 3, and 6 hours (or 0 and 1–2 hours with hs-cTn assays) for MI rule-in/rule-out protocols.",
    overview: "Cardiac troponin is a regulatory protein complex (troponin I, T, and C) found in cardiac myofibrils. Cardiac-specific isoforms (cTnI and cTnT) are released into the bloodstream following myocardial injury. Troponin is the gold standard biomarker for diagnosing acute myocardial infarction (AMI). It is measured by immunoassay methods: sandwich immunoassay (ELISA, chemiluminescence) with monoclonal antibodies specific to cardiac troponin isoforms.",
    clinicalSignificance: "Troponin rises 3–6 hours after myocardial injury with conventional assays (1–3 hours with hs-cTn assays), peaks at 12–24 hours, and remains elevated for 7–14 days. The 4th Universal Definition of MI requires a rise and/or fall pattern of troponin with at least one value above the 99th percentile URL, plus clinical evidence of ischemia. High-sensitivity troponin (hs-cTn) assays detect nanogram-per-liter concentrations, enabling earlier detection and rule-out.",
    highCauses: [
      { condition: "Acute myocardial infarction (Type 1 MI)", explanation: "Atherosclerotic plaque rupture with coronary thrombosis causes ischemic myocardial necrosis." },
      { condition: "Type 2 MI (supply-demand mismatch)", explanation: "Myocardial oxygen supply-demand imbalance from tachyarrhythmia, hypotension, anemia, or respiratory failure." },
      { condition: "Myocarditis", explanation: "Viral, autoimmune, or toxic inflammation of the myocardium releases troponin without coronary occlusion." },
      { condition: "Pulmonary embolism", explanation: "Acute right ventricular strain from massive PE causes troponin release from right heart myocardial injury." },
      { condition: "Chronic kidney disease", explanation: "Impaired clearance and chronic subclinical myocardial stress cause chronically elevated baseline troponin." },
    ],
    lowCauses: [
      { condition: "Normal finding", explanation: "Troponin is normally undetectable or present at extremely low levels. A non-elevated troponin at appropriate timing rules out myocardial injury." },
    ],
    criticalValues: {
      high: "Above the 99th percentile URL with rise/fall pattern",
      action: "Notify physician immediately when troponin is elevated above the 99th percentile URL and clinical presentation is consistent with ACS. Ensure serial sampling protocol is followed.",
    },
    associatedConditions: ["Acute coronary syndrome (STEMI, NSTEMI)", "Myocarditis", "Pulmonary embolism", "Heart failure", "Sepsis-related myocardial injury", "CKD"],
    labCorrelations: ["CK-MB (rises 4–6 hours, returns to normal in 48–72 hours — useful for reinfarction)", "BNP/NT-proBNP (heart failure)", "Myoglobin (earliest marker but non-specific)", "D-dimer (PE)", "CBC, BMP"],
    examTips: [
      "Troponin is the GOLD STANDARD for MI diagnosis — most sensitive and specific cardiac biomarker",
      "Rise and/or fall pattern is required for AMI diagnosis (a single elevated value is not diagnostic)",
      "hs-cTn assays can detect troponin in healthy individuals — the 99th percentile URL defines the cutoff",
      "CK-MB normalizes in 48–72 hours → useful for detecting reinfarction when troponin is still elevated from initial event",
      "Troponin is measured by sandwich immunoassay using monoclonal antibodies specific to cardiac troponin isoforms",
    ],
    practiceQuestions: [
      {
        question: "A patient presents with chest pain. Initial hs-cTnI is 25 ng/L (99th percentile URL = 26 ng/L). At 3 hours, hs-cTnI is 120 ng/L. What does this pattern indicate?",
        options: ["Normal — both values are near the cutoff", "Acute myocardial infarction (rise/fall pattern above 99th percentile)", "Chronic troponin elevation from CKD", "Troponin interference artifact"],
        correctIndex: 1,
        rationale: "The 3-hour value exceeds the 99th percentile URL with a significant rise (>50% delta from baseline when baseline is near the URL). This rise and/or fall pattern with at least one value above the 99th percentile, plus clinical ischemia, meets the 4th Universal Definition of MI.",
      },
      {
        question: "Which cardiac biomarker is most useful for detecting reinfarction 3 days after an initial MI?",
        options: ["Troponin I (remains elevated 7–14 days)", "CK-MB (returns to normal in 48–72 hours)", "Myoglobin (returns to normal in 24 hours)", "BNP (heart failure marker)"],
        correctIndex: 1,
        rationale: "CK-MB returns to normal within 48–72 hours after initial MI. A second rise in CK-MB indicates reinfarction. Troponin remains elevated for 7–14 days from the initial event, making it difficult to distinguish a new event from the ongoing elevation.",
      },
      {
        question: "What analytical method is used for troponin measurement in the clinical laboratory?",
        options: ["Ion-selective electrode", "Spectrophotometric enzymatic assay", "Sandwich immunoassay (chemiluminescence/ELISA)", "HPLC"],
        correctIndex: 2,
        rationale: "Troponin is measured by sandwich immunoassay using two monoclonal antibodies: a capture antibody and a detection antibody (labeled with chemiluminescent, fluorescent, or enzyme conjugate) specific to cardiac troponin I or T epitopes. This provides the specificity and sensitivity needed for cardiac biomarker testing.",
      },
    ],
    relatedLabSlugs: ["glucose", "potassium", "bun-creatinine", "abg"],
    faqItems: [
      { question: "What is a normal troponin level for MLT exams?", answer: "With conventional assays: <0.04 ng/mL is considered normal. With high-sensitivity troponin assays (hs-cTn): the 99th percentile upper reference limit (URL) is assay-specific (typically 14–52 ng/L). Any value above the 99th percentile URL with a rise/fall pattern suggests myocardial injury." },
      { question: "What is the difference between troponin I and troponin T?", answer: "Both cTnI and cTnT are cardiac-specific isoforms used to detect myocardial injury. cTnI has a unique cardiac isoform with no skeletal muscle cross-reactivity. cTnT may be mildly elevated in skeletal muscle disease and CKD. Only one hs-cTnT assay exists commercially (Roche), while multiple hs-cTnI assays are available." },
      { question: "What are high-sensitivity troponin assays?", answer: "High-sensitivity troponin (hs-cTn) assays detect troponin at much lower concentrations (ng/L) than conventional assays, enabling earlier MI detection and faster rule-out protocols (0/1-hour or 0/2-hour algorithms). They can detect troponin in >50% of healthy individuals." },
    ],
  },
];

export function getMltLabValueBySlug(slug: string): MltLabValuePageData | undefined {
  return mltLabValues.find((lv) => lv.slug === slug);
}

export function getAllMltLabValueSlugs(): string[] {
  return mltLabValues.map((lv) => lv.slug);
}
