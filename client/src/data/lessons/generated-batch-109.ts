import type { LessonContent } from "./types";

export const generatedBatch109Lessons: Record<string, LessonContent> = {
  "acute-kidney-injury": {
    title: "Acute Kidney Injury",
    cellular: {
      title: "Pathophysiology of Acute Kidney Injury",
      content: "Acute kidney injury (AKI) is characterized by a rapid decline in glomerular filtration rate (GFR) occurring over hours to days, resulting in the accumulation of nitrogenous waste products (azotemia) and disruption of fluid, electrolyte, and acid-base homeostasis. The kidneys normally filter approximately 180 liters of plasma per day through the glomerular capillaries, reabsorbing the vast majority of filtered solutes and water in the tubular segments.\n\nAKI is classified into three categories based on etiology: prerenal, intrarenal (intrinsic), and postrenal. Prerenal AKI accounts for approximately 60% of cases and results from decreased renal perfusion—caused by hypovolemia, heart failure, sepsis, or hepatorenal syndrome—without structural damage to the nephron. When renal perfusion drops below the autoregulatory threshold, the afferent arteriole can no longer maintain adequate glomerular hydrostatic pressure, and filtration ceases.\n\nIntrinsic AKI involves direct structural damage to the glomeruli, tubules, interstitium, or renal vasculature. Acute tubular necrosis (ATN) is the most common form, caused by ischemia or nephrotoxins (aminoglycosides, contrast dye, myoglobin). Tubular epithelial cells undergo necrosis and slough into the lumen, forming casts that obstruct flow and allow back-leak of filtrate. Postrenal AKI results from obstruction of urine outflow at any level from the renal pelvis to the urethra, causing increased hydrostatic pressure that opposes filtration.\n\nAt the cellular level, ischemic injury triggers ATP depletion, loss of cell polarity, cytoskeletal disruption, and calcium influx. Inflammatory mediators recruit neutrophils and macrophages, amplifying tissue damage. The recovery phase depends on surviving tubular cells dedifferentiating, proliferating, and re-establishing tubular integrity."
    },
    riskFactors: [
      "Advanced age (>65 years) with decreased renal reserve",
      "Pre-existing chronic kidney disease (reduced nephron mass)",
      "Diabetes mellitus with diabetic nephropathy",
      "Heart failure or hepatic cirrhosis causing decreased renal perfusion",
      "Nephrotoxic medication exposure (NSAIDs, aminoglycosides, contrast dye)",
      "Major surgery, trauma, or sepsis causing hemodynamic instability"
    ],
    diagnostics: [
      "Serum creatinine: rising trend (increase ≥0.3 mg/dL in 48h or ≥1.5x baseline in 7 days defines AKI per KDIGO)",
      "BUN:Creatinine ratio: >20:1 suggests prerenal etiology; 10-15:1 suggests intrinsic renal",
      "Urinalysis: muddy brown granular casts in ATN; RBC casts in glomerulonephritis; WBC casts in interstitial nephritis",
      "Fractional excretion of sodium (FENa): <1% prerenal; >2% intrinsic renal",
      "Renal ultrasound: evaluates kidney size, hydronephrosis (postrenal obstruction)",
      "Urine output monitoring: oliguria (<400 mL/day) or anuria (<100 mL/day)"
    ],
    management: [
      "Identify and treat underlying cause (restore perfusion, relieve obstruction, discontinue nephrotoxins)",
      "Fluid resuscitation for prerenal AKI with isotonic crystalloids; avoid fluid overload in oliguric patients",
      "Strict intake and output monitoring with daily weights",
      "Renal replacement therapy (hemodialysis or CRRT) for refractory hyperkalemia, severe metabolic acidosis, fluid overload, or uremic symptoms",
      "Adjust all renally-cleared medications based on estimated GFR",
      "Nutritional support: adequate calories with moderate protein restriction (0.8-1.0 g/kg/day)"
    ],
    nursingActions: [
      "Monitor strict I&O every hour in acute phase; report urine output <0.5 mL/kg/hr",
      "Assess for fluid overload: auscultate lungs for crackles, assess JVD, peripheral edema, daily weights",
      "Monitor serum potassium levels closely—hyperkalemia is the most life-threatening complication",
      "Administer medications at renally-adjusted doses; hold nephrotoxic agents",
      "Monitor for uremic symptoms: asterixis, pericardial friction rub, altered mental status",
      "Educate patient on fluid and dietary restrictions (potassium, phosphorus, sodium)"
    ],
    signs: {
      left: [
        "Oliguria or anuria (decreased urine output)",
        "Peripheral edema and weight gain",
        "Elevated serum creatinine and BUN",
        "Hyperkalemia (peaked T waves on ECG)",
        "Metabolic acidosis (Kussmaul respirations)"
      ],
      right: [
        "Nausea, vomiting, anorexia",
        "Fatigue and lethargy",
        "Fluid overload with pulmonary crackles",
        "Hypertension from fluid retention",
        "Uremic frost (late finding)"
      ]
    },
    medications: [
      { name: "Furosemide", type: "Loop diuretic", action: "Inhibits Na-K-2Cl cotransporter in the thick ascending limb of Henle, promoting sodium and water excretion", sideEffects: "Hypokalemia, hyponatremia, ototoxicity, dehydration, hypotension", contra: "Anuria unresponsive to fluid challenge, severe hypovolemia, sulfonamide allergy", pearl: "Furosemide does not improve outcomes in AKI but may help manage fluid overload; monitor potassium closely" },
      { name: "Sodium polystyrene sulfonate (Kayexalate)", type: "Potassium-binding resin", action: "Exchanges sodium for potassium in the GI tract, promoting fecal potassium excretion", sideEffects: "Constipation, nausea, hypokalemia, intestinal necrosis (rare)", contra: "Bowel obstruction, neonates with reduced gut motility", pearl: "Onset is slow (hours); for acute hyperkalemia, use IV calcium gluconate and insulin/dextrose first as temporizing measures" }
    ],
    pearls: [
      "The RIFLE and KDIGO criteria classify AKI severity—know the staging for exams",
      "Prerenal AKI is reversible with fluid resuscitation if caught early; prolonged hypoperfusion leads to ATN",
      "FENa <1% with concentrated urine (high specific gravity) points to prerenal; FENa >2% with dilute urine suggests intrinsic",
      "Hyperkalemia is the #1 life-threatening electrolyte emergency in AKI—always check potassium first"
    ],
    quiz: [
      { question: "A patient with AKI has a FENa of 0.5% and BUN:Creatinine ratio of 25:1. Which type of AKI is most likely?", options: ["Prerenal AKI", "Intrinsic renal AKI", "Postrenal AKI", "Chronic kidney disease"], correct: 0, rationale: "FENa <1% and elevated BUN:Cr ratio >20:1 indicate that the kidneys are avidly retaining sodium, consistent with prerenal azotemia from decreased perfusion." },
      { question: "Which laboratory finding is the most immediately life-threatening complication of acute kidney injury?", options: ["Elevated BUN", "Hyperkalemia", "Hyperphosphatemia", "Metabolic alkalosis"], correct: 1, rationale: "Hyperkalemia can cause fatal cardiac dysrhythmias (peaked T waves, widened QRS, ventricular fibrillation) and requires emergent treatment with calcium gluconate, insulin/dextrose, and potentially dialysis." },
      { question: "A nurse is caring for a patient with oliguric AKI. Which assessment finding should be reported immediately?", options: ["Urine specific gravity of 1.025", "Serum potassium of 6.8 mEq/L", "BUN of 35 mg/dL", "Serum sodium of 138 mEq/L"], correct: 1, rationale: "A serum potassium of 6.8 mEq/L is critically elevated and can cause lethal cardiac arrhythmias, requiring immediate intervention." }
    ]
  },

  "uremia-recognition": {
    title: "Uremia Recognition",
    cellular: {
      title: "Pathophysiology of Uremia",
      content: "Uremia represents the clinical syndrome resulting from severe loss of kidney function, characterized by the accumulation of uremic toxins—organic waste products normally cleared by renal excretion. These toxins include urea, creatinine, guanidinosuccinic acid, indoxyl sulfate, p-cresyl sulfate, and advanced glycation end products (AGEs). While urea itself is relatively nontoxic, its elevation serves as a surrogate marker for the accumulation of hundreds of other retained solutes.\n\nUremic toxins exert systemic effects through multiple mechanisms. They impair platelet adhesion and aggregation, leading to uremic bleeding (prolonged bleeding time despite normal platelet count). They inhibit erythropoietin production and suppress bone marrow erythropoiesis, causing normocytic normochromic anemia. Uremic toxins cross the blood-brain barrier, causing encephalopathy manifesting as asterixis, myoclonus, seizures, and coma.\n\nThe pericardium is particularly susceptible to uremic inflammation, and uremic pericarditis is a classic indication for emergent dialysis. Fibrinous exudates accumulate in the pericardial space, producing a characteristic friction rub on auscultation. If untreated, hemorrhagic pericardial effusion and cardiac tamponade can develop.\n\nUremia also disrupts immune function, impairing neutrophil chemotaxis, phagocytosis, and T-cell function, predisposing patients to infections. Gastrointestinal manifestations include anorexia, nausea, vomiting, and uremic fetor (ammonia-like breath odor from bacterial urease converting salivary urea to ammonia). Pruritus results from calcium-phosphate crystal deposition in the skin, and uremic frost—crystalline urea deposits on the skin surface—is a rare late-stage finding."
    },
    riskFactors: [
      "End-stage renal disease (ESRD) or severe acute kidney injury",
      "Noncompliance with dialysis schedule",
      "Inadequate dialysis clearance (Kt/V <1.2)",
      "High protein diet in advanced CKD increasing urea generation",
      "GI bleeding causing increased urea production from protein catabolism",
      "Catabolic states (sepsis, trauma, burns) increasing nitrogenous waste"
    ],
    diagnostics: [
      "BUN markedly elevated (typically >80-100 mg/dL with symptoms)",
      "Serum creatinine significantly elevated reflecting severe GFR reduction",
      "CBC: normocytic normochromic anemia, prolonged bleeding time",
      "Arterial blood gas: metabolic acidosis with elevated anion gap",
      "ECG: diffuse ST elevation in uremic pericarditis; peaked T waves if hyperkalemic",
      "Echocardiogram: pericardial effusion if pericarditis present"
    ],
    management: [
      "Urgent initiation of dialysis (hemodialysis or peritoneal dialysis) for symptomatic uremia",
      "Emergent dialysis for uremic pericarditis, encephalopathy, or refractory hyperkalemia",
      "Erythropoiesis-stimulating agents (ESAs) for uremic anemia when Hgb <10 g/dL",
      "Dietary protein restriction to reduce urea generation (0.6-0.8 g/kg/day in non-dialysis CKD)",
      "Phosphate binders and vitamin D analogs for renal osteodystrophy",
      "Antiemetics for GI symptoms; antipruritic measures for uremic pruritus"
    ],
    nursingActions: [
      "Assess for uremic encephalopathy: confusion, asterixis (flapping tremor), myoclonus, seizure precautions",
      "Auscultate for pericardial friction rub (3-component scratchy sound best heard with patient leaning forward)",
      "Monitor for bleeding: petechiae, ecchymoses, GI bleeding, prolonged oozing from puncture sites",
      "Monitor dialysis access site for patency (thrill and bruit in AV fistula)",
      "Educate on dietary restrictions: low protein, low potassium, low phosphorus, fluid restriction",
      "Assess skin for pruritus, excoriation, and uremic frost"
    ],
    signs: {
      left: [
        "Asterixis (flapping tremor of hands)",
        "Pericardial friction rub",
        "Uremic frost on skin",
        "Ammonia-like breath (uremic fetor)",
        "Prolonged bleeding time"
      ],
      right: [
        "Anorexia, nausea, vomiting",
        "Fatigue and pallor (anemia)",
        "Pruritus and excoriations",
        "Confusion and lethargy",
        "Peripheral neuropathy (restless legs, numbness)"
      ]
    },
    medications: [
      { name: "Epoetin alfa (Epogen)", type: "Erythropoiesis-stimulating agent", action: "Recombinant erythropoietin that stimulates red blood cell production in bone marrow", sideEffects: "Hypertension, headache, arthralgia, increased risk of thromboembolic events", contra: "Uncontrolled hypertension, pure red cell aplasia from prior ESA use", pearl: "Target Hgb 10-11 g/dL; higher targets increase cardiovascular risk. Ensure adequate iron stores (ferritin >200, TSAT >20%) before starting." },
      { name: "Sevelamer (Renagel)", type: "Phosphate binder", action: "Non-calcium, non-metal phosphate binder that binds dietary phosphorus in the GI tract preventing absorption", sideEffects: "Nausea, vomiting, constipation, flatulence", contra: "Bowel obstruction, hypophosphatemia", pearl: "Must be taken WITH meals to bind dietary phosphorus; does not cause hypercalcemia unlike calcium-based binders" }
    ],
    pearls: [
      "Uremic pericarditis is an absolute indication for emergent dialysis—do NOT anticoagulate (risk of hemorrhagic tamponade)",
      "Asterixis is a hallmark of metabolic encephalopathy (uremia, hepatic failure)—test by asking patient to dorsiflex wrists",
      "Uremic bleeding responds to desmopressin (DDAVP) as a temporizing measure before dialysis",
      "Uremic frost is a LATE finding rarely seen today due to earlier dialysis initiation"
    ],
    quiz: [
      { question: "A patient with ESRD missed three dialysis sessions. The nurse auscultates a scratchy, three-component sound over the precordium. What is the priority action?", options: ["Administer heparin anticoagulation", "Notify the provider for emergent dialysis", "Position the patient supine and flat", "Administer acetaminophen for pain"], correct: 1, rationale: "A pericardial friction rub in a uremic patient indicates uremic pericarditis, which is an emergency indication for dialysis. Heparin is contraindicated due to risk of hemorrhagic pericardial effusion." },
      { question: "Which assessment finding is most characteristic of uremic encephalopathy?", options: ["Unilateral weakness", "Asterixis (flapping tremor)", "Papilledema", "Nuchal rigidity"], correct: 1, rationale: "Asterixis (negative myoclonus producing a flapping tremor when wrists are dorsiflexed) is the hallmark of metabolic encephalopathy, including uremia." }
    ]
  },

  "metabolic-alkalosis": {
    title: "Metabolic Alkalosis",
    cellular: {
      title: "Pathophysiology of Metabolic Alkalosis",
      content: "Metabolic alkalosis is an acid-base disorder characterized by a primary increase in serum bicarbonate (HCO3- >26 mEq/L) and elevated arterial pH (>7.45). It is the most common acid-base disorder in hospitalized patients. The pathophysiology involves two distinct processes: generation of the alkalosis (gain of bicarbonate or loss of hydrogen ions) and maintenance of the alkalosis (impaired renal bicarbonate excretion).\n\nGeneration occurs through several mechanisms. Loss of hydrogen ions via the GI tract (prolonged vomiting, nasogastric suction) removes HCl from the stomach, leaving behind bicarbonate in the blood. Renal hydrogen ion loss occurs with loop and thiazide diuretics, which increase distal sodium delivery and stimulate H+ and K+ secretion. Contraction alkalosis occurs when isotonic fluid loss (diuretics, vomiting) concentrates the remaining bicarbonate in a smaller extracellular volume.\n\nMaintenance of metabolic alkalosis requires impaired renal bicarbonate excretion. Normally, the kidneys can excrete enormous amounts of bicarbonate. Maintenance factors include volume depletion (stimulating proximal tubule bicarbonate reabsorption), chloride depletion (preventing bicarbonate secretion in the collecting duct), and hypokalemia (stimulating H+/K+ exchange and ammoniagenesis). This is why metabolic alkalosis is classified as chloride-responsive (urine Cl- <20 mEq/L, responds to saline) or chloride-resistant (urine Cl- >20 mEq/L, caused by mineralocorticoid excess).\n\nRespiratory compensation involves hypoventilation to retain CO2 and raise PaCO2 (expected PaCO2 = 0.7 × HCO3- + 21 ± 2). However, hypoxic drive limits the degree of compensatory hypoventilation, so PaCO2 rarely exceeds 55 mmHg. Severe alkalosis (pH >7.55) can cause decreased ionized calcium (increased protein binding), leading to tetany and seizures."
    },
    riskFactors: [
      "Prolonged vomiting or nasogastric suction (loss of gastric HCl)",
      "Loop or thiazide diuretic therapy causing chloride and potassium depletion",
      "Excessive sodium bicarbonate administration",
      "Primary hyperaldosteronism (Conn syndrome) or Cushing syndrome",
      "Massive blood transfusion (citrate metabolized to bicarbonate)",
      "Hypokalemia from any cause (drives intracellular H+ shift)"
    ],
    diagnostics: [
      "ABG: pH >7.45, HCO3- >26 mEq/L, compensatory rise in PaCO2",
      "Basic metabolic panel: elevated bicarbonate, hypokalemia, hypochloremia",
      "Urine chloride: <20 mEq/L (chloride-responsive/saline-responsive) vs >20 mEq/L (chloride-resistant)",
      "Serum ionized calcium: may be decreased due to alkalemia-induced protein binding",
      "Urine pH: paradoxically acidic in severe hypokalemia despite systemic alkalosis"
    ],
    management: [
      "Chloride-responsive: IV normal saline (0.9% NaCl) to restore volume and chloride",
      "Potassium replacement: KCl corrects both hypokalemia and chloride deficit",
      "Discontinue offending agents (diuretics, NG suction, bicarbonate)",
      "Chloride-resistant (hyperaldosteronism): spironolactone, surgical adrenalectomy if indicated",
      "Severe refractory alkalosis (pH >7.6): acetazolamide to promote renal bicarbonate excretion",
      "Monitor and replace magnesium (hypomagnesemia perpetuates hypokalemia)"
    ],
    nursingActions: [
      "Monitor ABG values and serum electrolytes (K+, Cl-, Ca2+, Mg2+) serially",
      "Assess for signs of hypokalemia: muscle weakness, ileus, U waves on ECG, cardiac dysrhythmias",
      "Assess for hypocalcemia symptoms: Chvostek sign, Trousseau sign, tetany, paresthesias",
      "Monitor respiratory rate and depth—compensatory hypoventilation may cause hypoxemia",
      "Administer IV potassium chloride safely: never faster than 10 mEq/hr peripherally; use cardiac monitor for rates >10 mEq/hr",
      "Accurate I&O including NG output volume to quantify HCl losses"
    ],
    signs: {
      left: [
        "pH >7.45 with elevated HCO3-",
        "Hypokalemia (muscle weakness, U waves)",
        "Hypochloremia",
        "Compensatory hypoventilation (shallow, slow respirations)"
      ],
      right: [
        "Tetany and muscle cramping (decreased ionized Ca2+)",
        "Confusion, irritability, seizures (severe alkalosis)",
        "Cardiac dysrhythmias (PACs, PVCs from hypokalemia)",
        "Paresthesias of extremities and perioral area"
      ]
    },
    medications: [
      { name: "Potassium chloride (KCl)", type: "Electrolyte replacement", action: "Replaces potassium deficit and provides chloride to correct hypochloremic alkalosis", sideEffects: "GI irritation (oral), phlebitis (IV), hyperkalemia if given too rapidly", contra: "Hyperkalemia, severe renal impairment with oliguria, concurrent potassium-sparing diuretics", pearl: "Always use KCl (not potassium citrate or gluconate) in metabolic alkalosis—the chloride is essential for correction" },
      { name: "Acetazolamide", type: "Carbonic anhydrase inhibitor", action: "Inhibits proximal tubular bicarbonate reabsorption, promoting bicarbonaturia and metabolic acidosis", sideEffects: "Metabolic acidosis, hypokalemia, paresthesias, kidney stones", contra: "Severe hepatic disease, hyponatremia, hypokalemia, adrenal insufficiency", pearl: "Useful for refractory metabolic alkalosis in ventilated ICU patients who cannot be volume-loaded" }
    ],
    pearls: [
      "Metabolic alkalosis is the most common acid-base disorder in hospitalized patients",
      "Urine chloride is the key test to differentiate chloride-responsive (saline-correctable) from chloride-resistant forms",
      "Hypokalemia and metabolic alkalosis perpetuate each other—you must correct both simultaneously",
      "Paradoxical aciduria occurs when severe hypokalemia forces the kidney to secrete H+ instead of K+, worsening alkalosis"
    ],
    quiz: [
      { question: "A patient on furosemide has pH 7.52, HCO3- 34, PaCO2 48, K+ 2.8, Cl- 88. What is the priority intervention?", options: ["Administer sodium bicarbonate", "Initiate mechanical ventilation", "Replace potassium chloride and administer normal saline", "Restrict oral fluids"], correct: 2, rationale: "This is chloride-responsive metabolic alkalosis from diuretic use. KCl replaces potassium and chloride, and normal saline restores volume, allowing renal bicarbonate excretion." },
      { question: "Which urine chloride level indicates chloride-responsive metabolic alkalosis?", options: ["<20 mEq/L", ">40 mEq/L", ">80 mEq/L", "Urine chloride is not relevant"], correct: 0, rationale: "Urine chloride <20 mEq/L indicates the kidneys are avidly retaining chloride, suggesting volume and chloride depletion that will respond to normal saline administration." }
    ]
  },

  "respiratory-acidosis-management": {
    title: "Respiratory Acidosis Management",
    cellular: {
      title: "Pathophysiology of Respiratory Acidosis",
      content: "Respiratory acidosis results from alveolar hypoventilation leading to carbon dioxide (CO2) retention (hypercapnia), with PaCO2 >45 mmHg and arterial pH <7.35. Carbon dioxide is a volatile acid that combines with water via carbonic anhydrase to form carbonic acid (H2CO3), which dissociates into hydrogen ions and bicarbonate. Therefore, any condition that impairs CO2 elimination causes acidemia.\n\nThe pathophysiology involves failure at any level of the ventilatory apparatus. Central nervous system depression (opioids, sedatives, brainstem stroke) reduces the respiratory drive. Neuromuscular diseases (myasthenia gravis, Guillain-Barré syndrome, amyotrophic lateral sclerosis) impair the signal transmission to respiratory muscles. Chest wall abnormalities (kyphoscoliosis, flail chest, obesity hypoventilation syndrome) restrict thoracic expansion. Airway obstruction (COPD, severe asthma, obstructive sleep apnea) increases dead space and limits alveolar ventilation.\n\nAcute respiratory acidosis occurs when CO2 rises rapidly before renal compensation can occur. For every 10 mmHg rise in PaCO2, HCO3- increases only 1 mEq/L acutely (from tissue buffering), and pH drops significantly. Chronic respiratory acidosis allows renal compensation over 3-5 days: the kidneys increase H+ excretion and HCO3- reabsorption, raising serum bicarbonate approximately 3.5 mEq/L per 10 mmHg rise in PaCO2.\n\nSevere acute hypercapnia causes cerebral vasodilation and increased intracranial pressure (CO2 narcosis), presenting as headache, papilledema, confusion, and eventually coma. Acidemia also decreases myocardial contractility, causes peripheral vasodilation, and shifts the oxyhemoglobin dissociation curve rightward (Bohr effect), facilitating oxygen unloading but potentially worsening tissue acidosis."
    },
    riskFactors: [
      "COPD with chronic CO2 retention and acute exacerbation",
      "Opioid or sedative overdose causing CNS respiratory depression",
      "Neuromuscular diseases (myasthenia gravis, Guillain-Barré, ALS)",
      "Severe obesity (obesity hypoventilation syndrome / Pickwickian syndrome)",
      "Chest wall deformities (kyphoscoliosis, flail chest)",
      "Inadequate mechanical ventilation settings (low tidal volume/rate)"
    ],
    diagnostics: [
      "ABG: pH <7.35, PaCO2 >45 mmHg; differentiate acute vs chronic by HCO3- compensation",
      "Acute: HCO3- rises 1 mEq/L per 10 mmHg PaCO2 increase",
      "Chronic: HCO3- rises 3.5 mEq/L per 10 mmHg PaCO2 increase",
      "Pulse oximetry: may show hypoxemia (SpO2 <90%)",
      "Chest X-ray: evaluate for pneumonia, COPD changes, pleural effusion, pneumothorax",
      "Pulmonary function tests: FEV1/FVC ratio decreased in obstructive disease"
    ],
    management: [
      "Treat underlying cause: bronchodilators for COPD/asthma, naloxone for opioid overdose",
      "Improve ventilation: BiPAP/CPAP for non-invasive ventilatory support",
      "Intubation and mechanical ventilation for severe respiratory failure (pH <7.20, declining mental status)",
      "For COPD patients: low-flow O2 (1-2 L/min via nasal cannula) to avoid suppressing hypoxic drive",
      "Avoid rapid correction of chronic hypercapnia—can cause posthypercapnic metabolic alkalosis",
      "Chest physiotherapy and incentive spirometry for mucus clearance"
    ],
    nursingActions: [
      "Monitor respiratory rate, depth, and pattern continuously; assess for accessory muscle use",
      "Position patient upright (high Fowler's) to optimize diaphragmatic excursion",
      "Administer oxygen cautiously in COPD patients—titrate to SpO2 88-92%",
      "Monitor ABG values serially to assess response to interventions",
      "Maintain patent airway: suction as needed, encourage cough and deep breathing",
      "Assess level of consciousness frequently—CO2 narcosis causes progressive somnolence"
    ],
    signs: {
      left: [
        "pH <7.35 with PaCO2 >45 mmHg",
        "Hypoventilation (slow, shallow respirations)",
        "Elevated HCO3- (if chronic compensation)",
        "Hypoxemia on pulse oximetry"
      ],
      right: [
        "Headache and confusion (cerebral vasodilation)",
        "Drowsiness progressing to coma (CO2 narcosis)",
        "Flushed skin and diaphoresis",
        "Bounding pulse and hypertension (initially)",
        "Tremor, asterixis"
      ]
    },
    medications: [
      { name: "Naloxone (Narcan)", type: "Opioid antagonist", action: "Competitively binds opioid receptors, reversing CNS and respiratory depression caused by opioids", sideEffects: "Acute opioid withdrawal (tachycardia, hypertension, agitation, vomiting), pulmonary edema (rare)", contra: "Hypersensitivity; use cautiously in opioid-dependent patients (precipitates withdrawal)", pearl: "Half-life is shorter than most opioids (30-90 min)—patient may re-sedate; continuous monitoring or repeat dosing/infusion may be required" },
      { name: "Ipratropium bromide (Atrovent)", type: "Anticholinergic bronchodilator", action: "Blocks muscarinic receptors in bronchial smooth muscle, causing bronchodilation and decreased mucus secretion", sideEffects: "Dry mouth, urinary retention, blurred vision, constipation", contra: "Hypersensitivity to atropine or its derivatives; use cautiously in narrow-angle glaucoma", pearl: "Often combined with albuterol (DuoNeb) in COPD exacerbations; slower onset than beta-agonists but provides additive bronchodilation" }
    ],
    pearls: [
      "In COPD patients with chronic CO2 retention, the respiratory drive shifts from CO2-based to hypoxic drive—high-flow O2 can suppress ventilation",
      "Never correct chronic hypercapnia rapidly on a ventilator—set the rate/tidal volume to match the patient's baseline PaCO2",
      "Acute-on-chronic respiratory acidosis shows a pH lower than expected for the degree of HCO3- compensation",
      "BiPAP is first-line for COPD exacerbation with respiratory acidosis—reduces intubation rates by 50%"
    ],
    quiz: [
      { question: "A COPD patient arrives with ABG: pH 7.28, PaCO2 68, HCO3- 31. How is this best classified?", options: ["Acute respiratory acidosis", "Chronic respiratory acidosis", "Acute-on-chronic respiratory acidosis", "Mixed respiratory and metabolic acidosis"], correct: 2, rationale: "The elevated HCO3- of 31 indicates chronic renal compensation, but the low pH (7.28) indicates an acute component. In fully compensated chronic respiratory acidosis, pH would be near-normal." },
      { question: "What is the appropriate oxygen delivery target for a patient with COPD and chronic CO2 retention?", options: ["SpO2 99-100%", "SpO2 95-99%", "SpO2 88-92%", "SpO2 80-85%"], correct: 2, rationale: "COPD patients with chronic hypercapnia rely on hypoxic drive. Targeting SpO2 88-92% provides adequate oxygenation without suppressing the respiratory drive." }
    ]
  },

  "respiratory-alkalosis-management": {
    title: "Respiratory Alkalosis Management",
    cellular: {
      title: "Pathophysiology of Respiratory Alkalosis",
      content: "Respiratory alkalosis results from alveolar hyperventilation causing excessive CO2 elimination, with PaCO2 <35 mmHg and arterial pH >7.45. It is the most common acid-base disorder in critically ill patients. The excessive elimination of CO2 shifts the carbonic acid equilibrium leftward, reducing hydrogen ion concentration and raising pH.\n\nThe causes of hyperventilation are broadly categorized. Hypoxemia-driven hyperventilation occurs in pneumonia, pulmonary embolism, high altitude, and severe anemia—peripheral and central chemoreceptors detect low PaO2 and stimulate ventilation. Central stimulation of the respiratory center occurs with anxiety/pain, fever, salicylate toxicity (early), CNS infections (meningitis, encephalitis), pregnancy (progesterone stimulates ventilation), and hepatic encephalopathy (ammonia stimulates central chemoreceptors).\n\nAcute respiratory alkalosis causes an immediate decrease in ionized calcium due to increased protein binding in alkalemic serum. This reduced ionized calcium increases neuronal excitability, producing the classic symptoms: perioral and digital paresthesias, carpopedal spasm, and tetany. Cerebral vasoconstriction from hypocapnia reduces cerebral blood flow by approximately 2% per mmHg drop in PaCO2, causing lightheadedness and potentially syncope.\n\nRenal compensation for chronic respiratory alkalosis occurs over 2-5 days: the kidneys decrease hydrogen ion excretion and bicarbonate reabsorption, lowering serum HCO3- by approximately 5 mEq/L per 10 mmHg decrease in PaCO2. Chronic respiratory alkalosis (as in pregnancy or chronic liver disease) may have a near-normal pH due to complete renal compensation."
    },
    riskFactors: [
      "Anxiety and panic disorder (psychogenic hyperventilation)",
      "Pain causing increased respiratory rate",
      "Hypoxemia from any cause (pneumonia, PE, high altitude)",
      "Early salicylate (aspirin) toxicity stimulating the medullary respiratory center",
      "Pregnancy (progesterone-mediated hyperventilation is physiologic)",
      "Sepsis and systemic inflammatory response (early phase)",
      "Mechanical over-ventilation (excessive rate or tidal volume settings)"
    ],
    diagnostics: [
      "ABG: pH >7.45, PaCO2 <35 mmHg, with variable HCO3- depending on chronicity",
      "Acute: HCO3- drops 2 mEq/L per 10 mmHg decrease in PaCO2",
      "Chronic: HCO3- drops 5 mEq/L per 10 mmHg decrease in PaCO2",
      "Serum ionized calcium: decreased due to alkalemia-enhanced protein binding",
      "Serum salicylate level if aspirin toxicity suspected",
      "CT pulmonary angiogram or V/Q scan if pulmonary embolism suspected"
    ],
    management: [
      "Treat the underlying cause (anxiolytics for anxiety, analgesics for pain, antibiotics for sepsis)",
      "For psychogenic hyperventilation: calm reassurance, coaching slow breathing techniques",
      "Correct hypoxemia with supplemental oxygen (removes hypoxic ventilatory drive)",
      "Adjust mechanical ventilator settings: decrease respiratory rate or tidal volume",
      "Monitor and correct electrolytes: replace calcium if symptomatic hypocalcemia",
      "Rebreathing into a paper bag is NO LONGER recommended (risk of worsening hypoxemia in undiagnosed PE/pneumonia)"
    ],
    nursingActions: [
      "Assess and address the underlying cause of hyperventilation before assuming anxiety",
      "Monitor respiratory rate and pattern; coach patient through slow, pursed-lip breathing",
      "Assess for signs of hypocalcemia: Chvostek sign, Trousseau sign, paresthesias, tetany",
      "Provide calm, reassuring environment for anxious patients; stay at bedside",
      "Monitor cardiac rhythm—alkalosis can precipitate dysrhythmias",
      "If mechanically ventilated, verify ventilator settings match prescribed parameters"
    ],
    signs: {
      left: [
        "pH >7.45 with PaCO2 <35 mmHg",
        "Tachypnea and deep respirations",
        "Decreased HCO3- (if chronic compensation)",
        "Decreased ionized calcium"
      ],
      right: [
        "Lightheadedness and dizziness (cerebral vasoconstriction)",
        "Perioral and digital paresthesias (tingling)",
        "Carpopedal spasm and tetany",
        "Anxiety, palpitations, chest tightness",
        "Syncope in severe cases"
      ]
    },
    medications: [
      { name: "Lorazepam (Ativan)", type: "Benzodiazepine anxiolytic", action: "Enhances GABA-A receptor activity, reducing anxiety, agitation, and psychogenic hyperventilation", sideEffects: "Sedation, respiratory depression, hypotension, dependence with prolonged use", contra: "Severe respiratory depression, acute narrow-angle glaucoma, sleep apnea", pearl: "Use only for confirmed psychogenic hyperventilation; always rule out organic causes (PE, pneumonia, sepsis) before attributing to anxiety" }
    ],
    pearls: [
      "Always rule out life-threatening causes of hyperventilation (PE, pneumothorax, sepsis, MI) before attributing to anxiety",
      "Rebreathing into a paper bag is outdated and potentially dangerous—can worsen hypoxemia",
      "Early salicylate toxicity causes respiratory alkalosis; late toxicity causes metabolic acidosis—the combination is classic",
      "Respiratory alkalosis in a septic patient is an early warning sign that may precede hemodynamic deterioration"
    ],
    quiz: [
      { question: "A patient presents with tachypnea, ABG showing pH 7.52, PaCO2 28, HCO3- 22. The nurse should first:", options: ["Have the patient rebreathe into a paper bag", "Assess for underlying causes such as PE or pneumonia", "Administer sodium bicarbonate", "Increase the FiO2 to 100%"], correct: 1, rationale: "Before assuming psychogenic hyperventilation, the nurse must assess for life-threatening causes of hyperventilation including pulmonary embolism, pneumonia, and sepsis." },
      { question: "Which symptom is caused by the decreased ionized calcium in respiratory alkalosis?", options: ["Bradycardia", "Carpopedal spasm", "Hyporeflexia", "Polyuria"], correct: 1, rationale: "Alkalosis increases calcium binding to albumin, reducing ionized calcium. Low ionized calcium increases neuromuscular excitability, causing carpopedal spasm, tetany, and positive Chvostek/Trousseau signs." }
    ]
  },

  "alzheimer-disease": {
    title: "Alzheimer Disease",
    cellular: {
      title: "Pathophysiology of Alzheimer Disease",
      content: "Alzheimer disease (AD) is a progressive, irreversible neurodegenerative disorder and the most common cause of dementia, accounting for 60-80% of all dementia cases. The hallmark neuropathological features are extracellular amyloid-beta (Aβ) plaques and intracellular neurofibrillary tangles (NFTs) composed of hyperphosphorylated tau protein.\n\nAmyloid-beta peptides are generated by sequential cleavage of amyloid precursor protein (APP) by beta-secretase and gamma-secretase enzymes. In AD, these peptides aggregate into oligomers and fibrils that deposit as senile plaques in the brain parenchyma. These plaques activate microglia and astrocytes, triggering a chronic inflammatory response that damages surrounding neurons and synapses. The amyloid cascade hypothesis proposes that Aβ accumulation is the primary initiating event.\n\nTau protein normally stabilizes microtubules in axons, maintaining neuronal structure and facilitating intracellular transport. In AD, tau becomes hyperphosphorylated, detaches from microtubules, and aggregates into paired helical filaments forming neurofibrillary tangles. This leads to microtubule collapse, impaired axonal transport, synaptic dysfunction, and eventually neuronal death.\n\nNeurotransmitter depletion is prominent, particularly acetylcholine (ACh). Cholinergic neurons in the nucleus basalis of Meynert undergo early and severe degeneration, reducing cortical ACh levels by up to 90%. This cholinergic deficit correlates with cognitive decline and is the basis for cholinesterase inhibitor therapy. Glutamatergic dysfunction also contributes through excitotoxicity—excessive NMDA receptor activation causes calcium influx and neuronal death. Brain atrophy follows a characteristic pattern, beginning in the entorhinal cortex and hippocampus (explaining early memory loss), then spreading to the temporal, parietal, and frontal cortices."
    },
    riskFactors: [
      "Advanced age (greatest risk factor—incidence doubles every 5 years after age 65)",
      "Family history of AD and genetic factors (APOE ε4 allele, early-onset APP/presenilin mutations)",
      "Down syndrome (trisomy 21—extra copy of APP gene on chromosome 21)",
      "Cardiovascular risk factors: hypertension, diabetes, hyperlipidemia, obesity",
      "History of traumatic brain injury",
      "Low educational attainment and limited cognitive engagement (reduced cognitive reserve)"
    ],
    diagnostics: [
      "Clinical diagnosis based on progressive cognitive decline: use Mini-Mental State Exam (MMSE) or Montreal Cognitive Assessment (MoCA)",
      "Brain MRI: hippocampal and medial temporal lobe atrophy, widened sulci, enlarged ventricles",
      "PET scan: amyloid PET shows Aβ plaque burden; FDG-PET shows temporoparietal hypometabolism",
      "CSF biomarkers: decreased Aβ42, increased total tau and phosphorylated tau",
      "Rule out reversible causes: TSH, B12, RPR, CBC, metabolic panel, medication review",
      "Definitive diagnosis requires postmortem neuropathological examination"
    ],
    management: [
      "Cholinesterase inhibitors (donepezil, rivastigmine, galantamine) for mild-moderate AD",
      "Memantine (NMDA receptor antagonist) for moderate-severe AD; can combine with cholinesterase inhibitors",
      "Structured daily routines and consistent environment to reduce confusion",
      "Safety measures: fall prevention, wandering precautions, driving assessment, medication management",
      "Caregiver support and education: respite care, support groups, advance care planning",
      "Non-pharmacological interventions: cognitive stimulation, music therapy, regular physical activity"
    ],
    nursingActions: [
      "Use simple, clear communication: one-step commands, face the patient, allow time for response",
      "Maintain consistent routines, caregivers, and environment to reduce agitation and confusion",
      "Implement safety measures: bed alarms, ID bracelets, locked exits for wandering patients",
      "Assess for swallowing difficulties (aspiration risk increases with disease progression)",
      "Monitor for behavioral symptoms (sundowning, agitation, hallucinations) and use redirection first",
      "Support caregiver well-being: assess for caregiver burnout, provide resources"
    ],
    signs: {
      left: [
        "Progressive short-term memory loss (earliest symptom)",
        "Anomia and word-finding difficulty",
        "Hippocampal atrophy on MRI",
        "Apraxia (inability to perform learned motor tasks)"
      ],
      right: [
        "Disorientation to time, place, then person",
        "Personality changes and social withdrawal",
        "Sundowning (increased confusion in evening)",
        "Wandering behavior",
        "Late: incontinence, dysphagia, immobility"
      ]
    },
    medications: [
      { name: "Donepezil (Aricept)", type: "Cholinesterase inhibitor", action: "Reversibly inhibits acetylcholinesterase, increasing ACh concentration at cholinergic synapses in the brain", sideEffects: "Nausea, diarrhea, insomnia, vivid dreams, bradycardia, muscle cramps", contra: "Sick sinus syndrome, severe bradycardia, GI obstruction", pearl: "Administer at bedtime to minimize GI side effects; does not cure or halt disease progression but may slow cognitive decline for 6-12 months" },
      { name: "Memantine (Namenda)", type: "NMDA receptor antagonist", action: "Blocks pathological NMDA receptor activation by glutamate, reducing excitotoxic neuronal damage while allowing physiological signaling", sideEffects: "Dizziness, headache, confusion, constipation", contra: "Severe renal impairment (requires dose adjustment), concurrent use of other NMDA antagonists", pearl: "Approved for moderate-to-severe AD; can be combined with donepezil for additive benefit" }
    ],
    pearls: [
      "Alzheimer disease is a diagnosis of exclusion—always rule out reversible causes of dementia (B12 deficiency, hypothyroidism, NPH, depression)",
      "Sundowning (late-day confusion) can be managed with consistent routines, adequate lighting, and limiting naps",
      "APOE ε4 is a risk factor, not diagnostic—it increases risk but does not guarantee development of AD",
      "The 3 A's of Alzheimer's: Amnesia (memory loss), Aphasia (language difficulty), Apraxia (motor planning difficulty)"
    ],
    quiz: [
      { question: "Which neuropathological finding is most characteristic of Alzheimer disease?", options: ["Lewy bodies in the cortex", "Amyloid-beta plaques and neurofibrillary tangles", "Prion protein deposits", "Demyelinating lesions"], correct: 1, rationale: "The hallmarks of AD are extracellular amyloid-beta (senile) plaques and intracellular neurofibrillary tangles composed of hyperphosphorylated tau protein." },
      { question: "A nurse is caring for a patient with moderate Alzheimer disease who becomes increasingly agitated at 6 PM daily. What is the most appropriate initial intervention?", options: ["Administer haloperidol PRN", "Apply physical restraints for safety", "Reduce environmental stimuli and redirect the patient", "Encourage the patient to take a nap"], correct: 2, rationale: "Sundowning is best managed initially with non-pharmacological interventions: reducing stimuli, providing calm redirection, maintaining consistent routines, and ensuring adequate lighting. Restraints and sedatives are last resorts." }
    ]
  },

  "status-epilepticus": {
    title: "Status Epilepticus",
    cellular: {
      title: "Pathophysiology of Status Epilepticus",
      content: "Status epilepticus (SE) is defined as continuous seizure activity lasting 5 or more minutes, or two or more seizures without full recovery of consciousness between episodes. It is a neurological emergency with a mortality rate of 15-20% in adults. Generalized convulsive SE (GCSE) is the most dangerous form due to systemic metabolic derangements.\n\nDuring a seizure, massive synchronous neuronal depolarization occurs due to an imbalance between excitatory (glutamate/NMDA) and inhibitory (GABA) neurotransmission. In SE, the normal mechanisms that terminate seizures fail. GABA-A receptor internalization occurs within minutes of continuous seizure activity—the receptors are endocytosed from the synaptic membrane, reducing the effectiveness of benzodiazepines the longer seizures persist. Simultaneously, NMDA receptors are trafficked to the cell surface, amplifying excitatory transmission.\n\nThe metabolic consequences of prolonged SE are devastating. Initially, sympathetic activation causes tachycardia, hypertension, and hyperglycemia. Sustained muscle contraction produces hyperthermia, lactic acidosis, rhabdomyolysis with myoglobinuria, and hyperkalemia. After 30 minutes, compensatory mechanisms fail: hypotension, hypoglycemia, and cerebral edema develop. Excitotoxic neuronal death occurs through massive calcium influx via NMDA receptors, activating calcium-dependent proteases (calpains), lipases, and endonucleases that destroy cellular components.\n\nThe hippocampus is particularly vulnerable to excitotoxic injury, and prolonged SE can cause permanent hippocampal sclerosis with chronic epilepsy and memory impairment. Systemic complications include aspiration pneumonia, pulmonary edema (neurogenic), disseminated intravascular coagulation, and acute kidney injury from rhabdomyolysis."
    },
    riskFactors: [
      "Subtherapeutic antiepileptic drug (AED) levels or abrupt AED withdrawal",
      "Known epilepsy with poor medication adherence",
      "CNS infections (meningitis, encephalitis, brain abscess)",
      "Acute stroke, traumatic brain injury, or intracranial hemorrhage",
      "Metabolic derangements (hypoglycemia, hyponatremia, hypocalcemia, uremia)",
      "Alcohol withdrawal seizures",
      "Drug toxicity (cocaine, theophylline, isoniazid)"
    ],
    diagnostics: [
      "Clinical observation: continuous or repetitive seizures without return to baseline consciousness",
      "Continuous EEG monitoring: confirms electrical seizure activity, essential for nonconvulsive SE",
      "Point-of-care glucose: rule out hypoglycemia immediately",
      "Serum AED levels: assess for subtherapeutic concentrations",
      "Basic metabolic panel: sodium, calcium, magnesium, BUN, creatinine",
      "CT head: rule out structural causes (hemorrhage, mass, stroke)",
      "LP if CNS infection suspected (after CT to rule out mass effect)"
    ],
    management: [
      "ABCs first: secure airway, provide oxygen, establish IV access, check glucose",
      "First-line (0-5 min): IV lorazepam 0.1 mg/kg (max 4 mg/dose) or IM midazolam if no IV access",
      "Second-line (5-20 min): IV fosphenytoin 20 mg PE/kg or IV valproate or IV levetiracetam",
      "Third-line (>20 min, refractory SE): continuous IV infusion of midazolam, propofol, or pentobarbital with intubation",
      "Correct underlying cause: dextrose for hypoglycemia, antibiotics for infection, AED adjustment",
      "Continuous EEG monitoring to confirm seizure termination, especially after paralysis for intubation"
    ],
    nursingActions: [
      "Time the seizure from onset—duration determines treatment protocol",
      "Protect patient from injury: clear area, pad side rails, do NOT restrain or insert objects in mouth",
      "Position on side (recovery position) after convulsive activity to prevent aspiration",
      "Establish large-bore IV access; prepare emergency medications (lorazepam, fosphenytoin)",
      "Monitor continuous pulse oximetry, cardiac rhythm, blood pressure, and temperature",
      "Document seizure characteristics: type of movement, body parts involved, pupil changes, duration"
    ],
    signs: {
      left: [
        "Continuous tonic-clonic activity >5 minutes",
        "Failure to regain consciousness between seizures",
        "Elevated temperature (hyperthermia from sustained muscle activity)",
        "Tachycardia and hypertension (early sympathetic response)"
      ],
      right: [
        "Cyanosis (impaired ventilation during seizure)",
        "Tongue/cheek bite lacerations",
        "Urinary incontinence",
        "Postictal confusion, Todd paralysis",
        "Late: hypotension, rhabdomyolysis, metabolic acidosis"
      ]
    },
    medications: [
      { name: "Lorazepam (Ativan)", type: "Benzodiazepine", action: "Enhances GABA-A receptor activity, rapidly terminating seizure activity by increasing chloride influx and neuronal inhibition", sideEffects: "Respiratory depression, hypotension, sedation, paradoxical agitation", contra: "Severe respiratory depression, acute narrow-angle glaucoma", pearl: "First-line for SE; give IV push over 2 minutes. Must be refrigerated. Effectiveness decreases with seizure duration due to GABA receptor internalization—treat early" },
      { name: "Fosphenytoin (Cerebyx)", type: "Hydantoin anticonvulsant (prodrug of phenytoin)", action: "Blocks voltage-gated sodium channels, stabilizing neuronal membranes and preventing sustained repetitive firing", sideEffects: "Hypotension, bradycardia, purple glove syndrome (with IV phenytoin), nystagmus, ataxia", contra: "Sinus bradycardia, AV block, Adams-Stokes syndrome", pearl: "Dosed in phenytoin equivalents (PE); can be given IM unlike phenytoin. Requires cardiac monitoring during infusion. Never mix with dextrose solutions." }
    ],
    pearls: [
      "Time is brain—benzodiazepine effectiveness drops from ~80% at 5 minutes to <40% after 30 minutes due to GABA receptor internalization",
      "Always check a point-of-care glucose immediately—hypoglycemia is a rapidly reversible cause",
      "Nonconvulsive SE presents as altered mental status without obvious convulsions—requires EEG for diagnosis",
      "Never use phenytoin/fosphenytoin for alcohol withdrawal seizures—use benzodiazepines"
    ],
    quiz: [
      { question: "What is the first-line medication for status epilepticus?", options: ["Phenytoin IV", "Lorazepam IV", "Carbamazepine PO", "Valproic acid IV"], correct: 1, rationale: "IV lorazepam is the first-line treatment for status epilepticus due to its rapid onset of action (1-3 minutes IV) and proven efficacy in terminating seizures." },
      { question: "A patient has been seizing for 25 minutes and has received two doses of lorazepam without effect. What is the next step?", options: ["Administer a third dose of lorazepam", "Begin continuous IV midazolam infusion with intubation", "Administer IV fosphenytoin loading dose", "Wait and observe for spontaneous termination"], correct: 2, rationale: "After benzodiazepines fail (established SE at 5-20 min), second-line agents include IV fosphenytoin, valproate, or levetiracetam. Continuous infusions are reserved for refractory SE (>30-60 min or failure of two agents)." }
    ]
  },

  "migraine-vs-cluster-headache": {
    title: "Migraine vs Cluster Headache",
    cellular: {
      title: "Migraine and Cluster Headache",
      content: "Migraine and cluster headache are primary headache disorders with distinct pathophysiological mechanisms, clinical presentations, and treatment approaches. Understanding their differences is essential for accurate diagnosis and management.\n\nMigraine is a neurovascular disorder involving cortical spreading depression (CSD)—a wave of neuronal depolarization followed by prolonged suppression that propagates across the cortex at 2-5 mm/min. CSD activates trigeminal sensory afferents, causing release of calcitonin gene-related peptide (CGRP), substance P, and neurokinin A from perivascular nerve terminals. These neuropeptides cause neurogenic inflammation: meningeal vasodilation, plasma protein extravasation, and mast cell degranulation. The trigeminovascular system transmits pain signals to the trigeminal nucleus caudalis, thalamus, and cortex, producing the characteristic throbbing, unilateral headache.\n\nMigraine aura (present in ~25% of migraineurs) corresponds to CSD affecting specific cortical regions: visual cortex (scintillating scotomas, fortification spectra), sensory cortex (paresthesias), or language areas (aphasia). Central sensitization occurs when sustained trigeminal input amplifies pain processing in brainstem and cortical neurons, producing cutaneous allodynia and medication resistance.\n\nCluster headache belongs to the trigeminal autonomic cephalalgias (TACs) and involves hypothalamic activation as the primary generator. Neuroimaging studies consistently show activation of the ipsilateral posterior hypothalamic gray matter during attacks. The hypothalamus drives the circadian and circannual periodicity of cluster periods. Activation of the trigeminal-autonomic reflex produces the hallmark ipsilateral autonomic features: lacrimation, conjunctival injection, nasal congestion, rhinorrhea, ptosis, and miosis (partial Horner syndrome). Unlike migraine, patients with cluster headache are characteristically agitated and restless during attacks."
    },
    riskFactors: [
      "Migraine: female sex (3:1 female predominance), family history, hormonal fluctuations (menstruation, oral contraceptives)",
      "Migraine triggers: stress, sleep disturbances, certain foods (aged cheese, alcohol, MSG), weather changes",
      "Cluster headache: male sex (6:1 male predominance), age 20-40 at onset",
      "Cluster triggers: alcohol (during cluster period), nitroglycerin, high altitude",
      "Smoking history (strong association with cluster headache)",
      "Family history of either disorder (genetic predisposition)"
    ],
    diagnostics: [
      "Clinical diagnosis based on ICHD-3 criteria for both disorders",
      "Migraine: ≥5 attacks lasting 4-72 hours; unilateral, pulsating, moderate-severe; aggravated by activity; nausea/photophobia",
      "Cluster: ≥5 attacks of severe unilateral orbital/supraorbital pain lasting 15-180 minutes; ipsilateral autonomic features; restlessness",
      "Brain MRI: indicated for first or worst headache, focal neurological signs, or atypical features to rule out secondary causes",
      "ESR/CRP: rule out temporal (giant cell) arteritis in patients >50 with new headache",
      "CT head: indicated for thunderclap headache to rule out subarachnoid hemorrhage"
    ],
    management: [
      "Migraine acute: triptans (sumatriptan), NSAIDs, antiemetics; avoid opioids",
      "Migraine prophylaxis: topiramate, propranolol, amitriptyline, valproate, CGRP monoclonal antibodies (erenumab)",
      "Cluster acute: high-flow 100% oxygen (12-15 L/min via non-rebreather for 15-20 min), subcutaneous sumatriptan",
      "Cluster prophylaxis: verapamil (first-line), lithium, corticosteroid bridge during cluster onset",
      "Lifestyle modifications: regular sleep, hydration, stress management, trigger avoidance",
      "Avoid medication overuse headache: limit acute headache medication use to <10-15 days/month"
    ],
    nursingActions: [
      "Assess headache characteristics using PQRST format to differentiate headache types",
      "Administer prescribed abortive medications at headache onset for maximum efficacy",
      "For migraine: provide dark, quiet environment; apply cold compresses to forehead",
      "For cluster headache: administer high-flow oxygen immediately; position patient upright",
      "Educate on trigger identification and headache diary maintenance",
      "Monitor for medication overuse patterns and educate on rebound headache prevention"
    ],
    signs: {
      left: [
        "Migraine: unilateral pulsating pain, 4-72 hour duration",
        "Migraine: photophobia, phonophobia, nausea/vomiting",
        "Migraine: aura (visual disturbances, paresthesias) in 25%",
        "Migraine: patient prefers to lie still in dark room"
      ],
      right: [
        "Cluster: severe unilateral periorbital boring pain, 15-180 minutes",
        "Cluster: ipsilateral tearing, conjunctival injection, nasal congestion",
        "Cluster: ipsilateral ptosis and miosis (partial Horner syndrome)",
        "Cluster: patient is agitated, restless, paces during attack"
      ]
    },
    medications: [
      { name: "Sumatriptan (Imitrex)", type: "Serotonin 5-HT1B/1D receptor agonist (triptan)", action: "Causes vasoconstriction of dilated meningeal arteries, inhibits CGRP release from trigeminal neurons, and blocks pain signal transmission", sideEffects: "Chest tightness (triptan sensation), tingling, flushing, dizziness, rebound headache with overuse", contra: "Coronary artery disease, uncontrolled hypertension, hemiplegic or basilar migraine, MAO inhibitor use within 14 days, concurrent ergotamine use", pearl: "Subcutaneous injection is the fastest route (onset 10 min); nasal spray works within 15 min. Most effective when given early in the attack. For cluster headache, use SC injection." },
      { name: "Verapamil", type: "Calcium channel blocker", action: "Modulates hypothalamic circadian pacemaker activity and reduces vascular reactivity in cluster headache prophylaxis", sideEffects: "Constipation, bradycardia, hypotension, AV block, peripheral edema", contra: "Severe heart failure, 2nd/3rd degree AV block, sick sinus syndrome, concurrent IV beta-blocker", pearl: "First-line prophylaxis for cluster headache; often requires higher doses (240-960 mg/day) than used for cardiac indications. Monitor ECG for PR prolongation." }
    ],
    pearls: [
      "Key differentiator: migraine patients seek quiet dark rooms; cluster patients pace and are restless/agitated",
      "Cluster headache is called 'suicide headache' due to the extreme severity of pain",
      "High-flow 100% oxygen is first-line abortive therapy for cluster headache—works in 10-15 minutes",
      "Triptans are contraindicated in patients with CAD, uncontrolled HTN, and hemiplegic migraine"
    ],
    quiz: [
      { question: "A patient presents with severe right periorbital pain lasting 45 minutes, right eye tearing, nasal congestion, and extreme restlessness. Which headache type is most likely?", options: ["Migraine with aura", "Tension-type headache", "Cluster headache", "Migraine without aura"], correct: 2, rationale: "Severe unilateral periorbital pain with ipsilateral autonomic features (tearing, nasal congestion) and restlessness/agitation are classic for cluster headache." },
      { question: "What is the first-line abortive treatment for cluster headache?", options: ["Oral sumatriptan", "IV morphine", "High-flow 100% oxygen via non-rebreather mask", "Oral ibuprofen"], correct: 2, rationale: "High-flow 100% oxygen at 12-15 L/min via non-rebreather for 15-20 minutes is first-line for acute cluster headache, with response rates of ~70% within 15 minutes." }
    ]
  },

  "increased-intracranial-pressure": {
    title: "Increased Intracranial Pressure",
    cellular: {
      title: "Increased Intracranial Pressure",
      content: "Intracranial pressure (ICP) is the pressure within the rigid cranial vault, normally maintained between 5-15 mmHg. The cranium contains three components: brain parenchyma (80%), cerebrospinal fluid (10%), and blood (10%). According to the Monro-Kellie doctrine, the total volume of these components must remain constant—an increase in any one component must be compensated by a decrease in another, or ICP will rise.\n\nCompensatory mechanisms include displacement of CSF from the cranial to the spinal subarachnoid space, increased CSF absorption through arachnoid granulations, and compression of the low-pressure venous sinuses to reduce intracranial blood volume. These mechanisms can accommodate small volume increases (approximately 100-150 mL), but once exhausted, the intracranial compliance curve becomes steep—small additional volume increases cause large ICP elevations.\n\nCerebral perfusion pressure (CPP) equals mean arterial pressure minus ICP (CPP = MAP - ICP). Normal CPP is 60-100 mmHg. When ICP rises, CPP falls, threatening cerebral blood flow. The Cushing reflex is a late, ominous response: systemic hypertension (to maintain CPP), reflex bradycardia (baroreceptor response to hypertension), and irregular respirations. This triad indicates brainstem compression and impending herniation.\n\nBrain herniation occurs when pressure differentials force tissue across rigid intracranial compartments. Uncal (transtentorial) herniation compresses the ipsilateral CN III (causing fixed, dilated pupil), cerebral peduncle (contralateral hemiparesis), and posterior cerebral artery (occipital infarction). Tonsillar herniation pushes the cerebellar tonsils through the foramen magnum, compressing the medulla and causing respiratory arrest and death. Central herniation causes bilateral pupil dilation and decorticate progressing to decerebrate posturing."
    },
    riskFactors: [
      "Traumatic brain injury (epidural, subdural, or intracerebral hemorrhage)",
      "Brain tumors (primary or metastatic) with mass effect and perilesional edema",
      "Ischemic or hemorrhagic stroke with cerebral edema",
      "Hydrocephalus (obstructive or communicating)",
      "CNS infections (meningitis, encephalitis, brain abscess)",
      "Hepatic encephalopathy with cerebral edema"
    ],
    diagnostics: [
      "CT head without contrast: first-line to identify mass lesion, hemorrhage, edema, midline shift, hydrocephalus",
      "ICP monitoring: intraventricular catheter (EVD) is gold standard—allows both monitoring and therapeutic CSF drainage",
      "Neurological assessment: GCS trending, pupil reactivity and size, motor response",
      "Cushing triad: hypertension, bradycardia, irregular respirations (LATE sign of brainstem compression)",
      "MRI brain: superior for identifying tumor, abscess, ischemia, and herniation patterns",
      "Fundoscopic exam: papilledema (chronic ICP elevation); absent in acute rises"
    ],
    management: [
      "Elevate head of bed 30 degrees with head midline to promote venous drainage",
      "Osmotic therapy: IV mannitol (0.25-1 g/kg) or hypertonic saline (3% or 23.4%) to reduce cerebral edema",
      "CSF drainage via external ventricular drain (EVD) if available",
      "Controlled hyperventilation (target PaCO2 30-35 mmHg) as temporizing measure—causes cerebral vasoconstriction",
      "Surgical intervention: craniotomy for mass evacuation, decompressive craniectomy for refractory ICP",
      "Maintain CPP >60 mmHg with vasopressors if needed",
      "Treat fever aggressively—hyperthermia increases cerebral metabolic rate and ICP"
    ],
    nursingActions: [
      "Perform neurological checks every 1-2 hours: GCS, pupil size/reactivity, motor strength",
      "Maintain HOB 30 degrees, head midline, avoid neck flexion (prevents jugular venous compression)",
      "Avoid activities that increase ICP: suctioning >10 seconds, Valsalva maneuver, clustering care activities",
      "Monitor ICP waveforms and report sustained ICP >20 mmHg; calculate CPP (CPP = MAP - ICP)",
      "Maintain normothermia—administer antipyretics for fever",
      "Monitor for signs of herniation: blown pupil, posturing, Cushing triad—report IMMEDIATELY"
    ],
    signs: {
      left: [
        "Cushing triad: hypertension, bradycardia, irregular respirations",
        "Unilateral fixed dilated pupil (uncal herniation, CN III compression)",
        "Papilledema on fundoscopy (chronic elevation)",
        "Decreased level of consciousness (GCS decline)"
      ],
      right: [
        "Headache (worse in morning, with coughing/straining)",
        "Projectile vomiting without nausea",
        "Posturing: decorticate (flexion) then decerebrate (extension)",
        "Seizures",
        "Altered vital signs (widened pulse pressure)"
      ]
    },
    medications: [
      { name: "Mannitol", type: "Osmotic diuretic", action: "Creates osmotic gradient across blood-brain barrier, drawing water from brain parenchyma into the intravascular space, reducing cerebral edema and ICP", sideEffects: "Hypovolemia, electrolyte imbalances (hyponatremia, hyperkalemia initially then hypokalemia), renal failure with repeated use, rebound ICP elevation", contra: "Anuria, severe dehydration, active intracranial hemorrhage (relative)", pearl: "Monitor serum osmolality—hold if >320 mOsm/kg (risk of renal failure). Use an in-line filter for IV administration. Effect begins in 15-30 minutes." },
      { name: "Hypertonic saline (3% NaCl)", type: "Osmotic agent", action: "Creates osmotic gradient to reduce cerebral edema; also expands intravascular volume, improving CPP", sideEffects: "Hypernatremia, central pontine myelinolysis (if sodium corrected too rapidly), phlebitis (administer via central line for concentrations >3%)", contra: "Hypernatremia (Na+ >155 mEq/L)", pearl: "Preferred over mannitol in hypovolemic patients because it expands volume rather than causing diuresis. Monitor sodium every 4-6 hours." }
    ],
    pearls: [
      "Cushing triad (HTN, bradycardia, irregular respirations) is a LATE sign indicating brainstem herniation—do not wait for this to intervene",
      "A blown (fixed, dilated) pupil ipsilateral to a mass lesion indicates uncal herniation compressing CN III",
      "Hyperventilation is only a temporizing measure—prolonged hyperventilation causes cerebral vasoconstriction and ischemia",
      "Avoid hypotonic IV fluids (D5W, 0.45% NS)—they worsen cerebral edema by moving water into brain tissue"
    ],
    quiz: [
      { question: "A patient with a head injury develops a fixed, dilated right pupil, left hemiparesis, and decreasing GCS. What type of herniation is occurring?", options: ["Tonsillar herniation", "Central herniation", "Right uncal (transtentorial) herniation", "Subfalcine herniation"], correct: 2, rationale: "A fixed dilated pupil ipsilateral to the lesion (CN III compression) with contralateral motor deficit (cerebral peduncle compression) is classic for uncal transtentorial herniation." },
      { question: "Which nursing intervention is MOST important to prevent ICP elevation?", options: ["Encourage coughing and deep breathing exercises", "Maintain the head of bed at 30 degrees with head midline", "Administer hypotonic IV fluids", "Cluster nursing care activities to allow long rest periods"], correct: 1, rationale: "HOB at 30 degrees with head midline promotes jugular venous drainage, reducing intracranial blood volume and ICP. Coughing increases ICP, hypotonic fluids worsen edema, and clustering care increases ICP." }
    ]
  },

  "respiratory-failure-types": {
    title: "Respiratory Failure Types (Type I vs II)",
    cellular: {
      title: "Pathophysiology of Respiratory Failure",
      content: "Respiratory failure is defined as the inability of the respiratory system to adequately oxygenate the blood or eliminate carbon dioxide. It is classified into two primary types based on arterial blood gas findings, each with distinct pathophysiological mechanisms.\n\nType I (hypoxemic) respiratory failure is characterized by PaO2 <60 mmHg with normal or low PaCO2. The fundamental problem is failure of oxygen transfer across the alveolar-capillary membrane. Five mechanisms cause hypoxemia: V/Q mismatch (most common—areas of lung with reduced ventilation relative to perfusion, as in pneumonia, atelectasis, PE), shunt (blood passes through non-ventilated alveoli or bypasses lungs entirely—ARDS, complete atelectasis, intracardiac shunt), diffusion impairment (thickened alveolar-capillary membrane—pulmonary fibrosis, interstitial lung disease), low inspired oxygen (high altitude), and hypoventilation. True shunt does not respond to supplemental oxygen because blood never contacts functional alveoli.\n\nType II (hypercapnic) respiratory failure is characterized by PaCO2 >50 mmHg, with or without hypoxemia. The fundamental problem is inadequate alveolar ventilation—the lungs cannot eliminate CO2 at the rate it is produced. Alveolar ventilation (VA) = respiratory rate × (tidal volume - dead space). Any condition that reduces respiratory rate, tidal volume, or increases dead space causes hypercapnia. Causes include CNS depression (opioids, brainstem stroke), neuromuscular disease (GBS, MG), chest wall restriction (kyphoscoliosis, obesity), airway obstruction (severe COPD, upper airway obstruction), and increased dead space.\n\nType I and Type II can coexist—a patient with COPD exacerbation may have both V/Q mismatch (hypoxemia) and alveolar hypoventilation (hypercapnia). The A-a gradient helps differentiate: a normal A-a gradient (<10 mmHg in young adults) with hypoxemia suggests pure hypoventilation, while an elevated A-a gradient indicates a problem at the level of the lung (V/Q mismatch, shunt, or diffusion impairment)."
    },
    riskFactors: [
      "Type I: pneumonia, ARDS, pulmonary embolism, pulmonary edema, pulmonary fibrosis, severe asthma",
      "Type II: COPD exacerbation, opioid overdose, neuromuscular disease (GBS, MG, ALS)",
      "Type II: morbid obesity (obesity hypoventilation syndrome), chest wall deformities",
      "Both types: advanced age, smoking history, chronic lung disease",
      "Post-surgical: abdominal/thoracic surgery (atelectasis, diaphragm splinting)",
      "Sepsis (ARDS-related Type I; respiratory muscle fatigue causing Type II)"
    ],
    diagnostics: [
      "ABG: Type I—PaO2 <60, PaCO2 normal or low; Type II—PaCO2 >50, PaO2 may also be low",
      "A-a gradient calculation: elevated in V/Q mismatch, shunt, diffusion impairment; normal in pure hypoventilation",
      "Pulse oximetry: SpO2 <90% correlates with PaO2 ~60 mmHg (on the steep part of the oxyhemoglobin curve)",
      "Chest X-ray: infiltrates (pneumonia/ARDS), hyperinflation (COPD), pleural effusion, atelectasis",
      "CT chest/CTA: PE evaluation, interstitial lung disease assessment",
      "Pulmonary function tests: obstructive vs restrictive pattern"
    ],
    management: [
      "Type I: supplemental oxygen (goal SpO2 ≥92-94%); high-flow nasal cannula or non-rebreather for severe hypoxemia",
      "Type I with shunt (ARDS): positive pressure ventilation with PEEP to recruit collapsed alveoli",
      "Type II: non-invasive ventilation (BiPAP) to augment tidal volume and reduce CO2",
      "Type II severe: intubation and mechanical ventilation if BiPAP fails or mental status deteriorates",
      "Treat underlying cause: antibiotics for pneumonia, bronchodilators for COPD, naloxone for opioid OD",
      "Prone positioning for severe ARDS (PaO2/FiO2 <150) improves V/Q matching"
    ],
    nursingActions: [
      "Continuously monitor SpO2, respiratory rate, depth, and pattern; assess work of breathing",
      "Position upright (high Fowler's) or prone as ordered to optimize ventilation",
      "Titrate oxygen to prescribed target: 92-94% for most patients, 88-92% for COPD with chronic hypercapnia",
      "Assess for signs of respiratory muscle fatigue: paradoxical abdominal breathing, accessory muscle use, tachypnea",
      "If on BiPAP: ensure proper mask fit, monitor for air leaks, assess comfort and tolerance",
      "Prepare for intubation if patient shows signs of clinical deterioration (rising PaCO2, declining consciousness)"
    ],
    signs: {
      left: [
        "Type I: hypoxemia (PaO2 <60) with normal/low PaCO2",
        "Type I: tachypnea, dyspnea, cyanosis",
        "Type I: elevated A-a gradient",
        "Type I: responds to supplemental O2 (unless true shunt)"
      ],
      right: [
        "Type II: hypercapnia (PaCO2 >50) with or without hypoxemia",
        "Type II: hypoventilation (decreased RR or shallow breathing)",
        "Type II: headache, confusion, somnolence (CO2 narcosis)",
        "Type II: may have normal A-a gradient (pure hypoventilation)"
      ]
    },
    medications: [
      { name: "Albuterol (Ventolin)", type: "Short-acting beta-2 agonist bronchodilator", action: "Stimulates beta-2 adrenergic receptors on bronchial smooth muscle, causing relaxation and bronchodilation within minutes", sideEffects: "Tachycardia, tremor, hypokalemia, nervousness, palpitations", contra: "Hypersensitivity; use cautiously in cardiac arrhythmias, coronary artery disease", pearl: "First-line rescue bronchodilator for acute bronchospasm; onset 5-15 minutes, duration 4-6 hours. Hypokalemia occurs from beta-2 mediated intracellular potassium shift." },
      { name: "Methylprednisolone", type: "Systemic corticosteroid", action: "Reduces airway inflammation, decreases mucus production, and enhances beta-2 receptor responsiveness in COPD/asthma exacerbations", sideEffects: "Hyperglycemia, immunosuppression, GI bleeding, insomnia, mood changes", contra: "Active untreated fungal infection; use cautiously in diabetes, peptic ulcer disease", pearl: "In ARDS, low-dose dexamethasone may reduce mortality and ventilator days; in COPD exacerbation, 5-day course of prednisone is standard" }
    ],
    pearls: [
      "PaO2/FiO2 ratio (P/F ratio) quantifies hypoxemia severity: <300 = ALI, <200 = ARDS, <100 = severe ARDS",
      "True shunt (ARDS, complete atelectasis) does not improve with supplemental O2—requires PEEP to recruit alveoli",
      "The A-a gradient differentiates lung pathology (elevated) from pure hypoventilation (normal)",
      "In COPD with chronic Type II failure, target SpO2 88-92%—higher targets suppress hypoxic drive"
    ],
    quiz: [
      { question: "A patient has ABG: PaO2 52, PaCO2 38, pH 7.47. What type of respiratory failure is this?", options: ["Type I (hypoxemic)", "Type II (hypercapnic)", "Mixed Type I and II", "No respiratory failure"], correct: 0, rationale: "PaO2 <60 with normal PaCO2 defines Type I (hypoxemic) respiratory failure. The slight alkalemia and low-normal PaCO2 reflect compensatory hyperventilation." },
      { question: "Which condition is most likely to cause Type II respiratory failure?", options: ["Pneumonia", "Pulmonary embolism", "Opioid overdose", "Pulmonary fibrosis"], correct: 2, rationale: "Opioid overdose causes CNS respiratory depression leading to hypoventilation and CO2 retention (Type II/hypercapnic failure). The other conditions primarily cause V/Q mismatch or diffusion impairment (Type I)." }
    ]
  },

  "chest-trauma-management": {
    title: "Chest Trauma Management",
    cellular: {
      title: "Pathophysiology of Chest Trauma",
      content: "Chest trauma accounts for approximately 25% of trauma-related deaths and contributes to another 25% as a complicating factor. Injuries are classified as blunt (motor vehicle collisions, falls, assaults) or penetrating (stab wounds, gunshot wounds). The pathophysiology varies depending on the specific injury pattern.\n\nPneumothorax occurs when air enters the pleural space, disrupting the negative intrapleural pressure that maintains lung expansion. Simple pneumothorax involves partial lung collapse. Tension pneumothorax is immediately life-threatening—a one-way valve mechanism allows air to enter the pleural space during inspiration but traps it during expiration. Progressive air accumulation causes complete ipsilateral lung collapse, mediastinal shift to the contralateral side, compression of the contralateral lung, and impaired venous return due to compression of the great vessels. Cardiac output drops precipitously, and death ensues if not immediately decompressed.\n\nHemothorax involves blood accumulation in the pleural space from lacerated intercostal, internal mammary, or pulmonary vessels. Massive hemothorax (>1500 mL or >200 mL/hr drainage) often requires surgical thoracotomy. Flail chest occurs when three or more adjacent ribs fracture in two or more places, creating a free-floating chest wall segment. This segment moves paradoxically—inward during inspiration and outward during expiration—reducing ventilatory efficiency. The underlying pulmonary contusion (not the paradoxical movement itself) is the primary cause of respiratory failure.\n\nCardiac tamponade from penetrating trauma occurs when blood accumulates in the pericardial sac, compressing the heart and impairing diastolic filling. Beck's triad (hypotension, muffled heart sounds, JVD) is the classic presentation. As little as 150-200 mL of rapidly accumulating blood can cause tamponade."
    },
    riskFactors: [
      "Motor vehicle collision (especially unrestrained occupants, high-speed impact)",
      "Falls from height (blunt chest trauma, rib fractures)",
      "Penetrating trauma: stab wounds, gunshot wounds",
      "Advanced age (brittle ribs fracture more easily)",
      "Anticoagulant therapy (increases hemorrhagic complications)",
      "Pre-existing lung disease (COPD patients tolerate pneumothorax poorly)"
    ],
    diagnostics: [
      "Chest X-ray: pneumothorax (absent lung markings), hemothorax (opacification), rib fractures, widened mediastinum",
      "FAST exam (focused assessment with sonography for trauma): detects pericardial effusion and hemothorax",
      "CT chest: gold standard for identifying pulmonary contusion, small pneumothorax, aortic injury",
      "Tension pneumothorax: CLINICAL DIAGNOSIS—do NOT delay decompression for imaging",
      "Chest tube output: monitor volume and rate—>1500 mL initial or >200 mL/hr suggests need for thoracotomy",
      "ABG: assess oxygenation and ventilation status"
    ],
    management: [
      "Primary survey: ABCDE approach; secure airway, provide high-flow oxygen, IV fluid resuscitation",
      "Tension pneumothorax: immediate needle decompression (2nd intercostal space, midclavicular line) followed by chest tube",
      "Simple pneumothorax/hemothorax: chest tube insertion (5th intercostal space, anterior axillary line)",
      "Flail chest: pain management (epidural or intercostal nerve block), supplemental oxygen, possible mechanical ventilation",
      "Cardiac tamponade: emergent pericardiocentesis or operating room thoracotomy",
      "Massive hemothorax: chest tube drainage, surgical thoracotomy if >1500 mL initial or ongoing >200 mL/hr",
      "Open pneumothorax (sucking chest wound): three-sided occlusive dressing, then chest tube"
    ],
    nursingActions: [
      "Assess and maintain airway patency; prepare for intubation if respiratory distress worsens",
      "Monitor vital signs continuously: tachycardia and hypotension suggest hemorrhage or tension pneumothorax",
      "Assess chest wall for paradoxical movement (flail chest), subcutaneous emphysema, tracheal deviation",
      "Manage chest tube: maintain below chest level, ensure water seal, monitor drainage color/volume/rate",
      "Never clamp a chest tube without a physician order—can cause tension pneumothorax",
      "Assess pain and administer analgesics—rib fracture pain impairs ventilation and promotes atelectasis"
    ],
    signs: {
      left: [
        "Tension pneumothorax: tracheal deviation AWAY from affected side",
        "Absent breath sounds on affected side",
        "JVD with hypotension (impaired venous return)",
        "Subcutaneous emphysema (crepitus on palpation)"
      ],
      right: [
        "Hemothorax: dullness to percussion on affected side",
        "Flail chest: paradoxical chest wall movement",
        "Cardiac tamponade: Beck's triad (hypotension, muffled heart sounds, JVD)",
        "Respiratory distress: dyspnea, tachypnea, cyanosis",
        "Open pneumothorax: sucking wound on inspiration"
      ]
    },
    medications: [
      { name: "Morphine sulfate", type: "Opioid analgesic", action: "Binds mu-opioid receptors in the CNS, providing potent analgesia for severe chest wall pain from rib fractures and thoracic injuries", sideEffects: "Respiratory depression, hypotension, nausea, constipation, sedation", contra: "Severe respiratory depression, head injury with increased ICP (masks neuro assessment), paralytic ileus", pearl: "Adequate pain control is essential in chest trauma—splinting from pain causes shallow breathing, atelectasis, and pneumonia. Epidural analgesia is superior for multiple rib fractures." },
      { name: "Ketamine", type: "NMDA receptor antagonist/dissociative anesthetic", action: "Provides potent analgesia and dissociative sedation while maintaining respiratory drive and hemodynamic stability", sideEffects: "Emergence reactions (hallucinations), increased secretions, tachycardia, elevated ICP", contra: "Conditions where elevated blood pressure is hazardous, known psychotic disorders, elevated ICP", pearl: "Preferred analgesic in trauma when hemodynamic instability is a concern—maintains blood pressure and respiratory drive unlike opioids" }
    ],
    pearls: [
      "Tension pneumothorax is a CLINICAL diagnosis—never delay needle decompression for a chest X-ray",
      "Beck's triad (hypotension, muffled heart sounds, JVD) = cardiac tamponade until proven otherwise",
      "In flail chest, the pulmonary contusion underneath causes more respiratory compromise than the paradoxical movement",
      "Three-sided occlusive dressing for open (sucking) chest wound allows air out during expiration but prevents entry during inspiration"
    ],
    quiz: [
      { question: "A trauma patient has absent breath sounds on the right, tracheal deviation to the left, JVD, and hypotension. What is the priority intervention?", options: ["Obtain a chest X-ray", "Perform needle decompression of the right chest", "Insert a Foley catheter", "Administer IV antibiotics"], correct: 1, rationale: "This presentation is classic tension pneumothorax: absent breath sounds, tracheal deviation AWAY from affected side, JVD, and hypotension. Immediate needle decompression (2nd ICS, midclavicular line) is life-saving." },
      { question: "A patient with multiple rib fractures has a section of chest wall moving inward during inspiration. What is this called?", options: ["Pneumothorax", "Flail chest", "Cardiac tamponade", "Hemothorax"], correct: 1, rationale: "Flail chest occurs when 3+ adjacent ribs are fractured in 2+ places, creating a free-floating segment that moves paradoxically—inward on inspiration, outward on expiration." }
    ]
  },

  "ventilator-associated-pneumonia": {
    title: "Ventilator-Associated Pneumonia",
    cellular: {
      title: "Ventilator-Associated Pneumonia",
      content: "Ventilator-associated pneumonia (VAP) is a hospital-acquired pneumonia that develops ≥48 hours after endotracheal intubation and mechanical ventilation. It is the most common ICU-acquired infection, affecting 10-25% of mechanically ventilated patients, with attributable mortality rates of 13-30%. VAP significantly increases ICU length of stay, duration of mechanical ventilation, and healthcare costs.\n\nThe primary pathogenic mechanism is microaspiration of contaminated oropharyngeal secretions around the endotracheal tube (ETT) cuff. Despite cuff inflation, secretions pool above the cuff in the subglottic space and leak past into the lower airways through longitudinal folds in the cuff material. The ETT also provides a direct conduit for bacteria to bypass the upper airway's natural defense mechanisms (cough reflex, mucociliary clearance, IgA secretion).\n\nBiofilm formation on the inner surface of the ETT is another critical mechanism. Within hours of intubation, bacteria colonize the tube surface and form a polysaccharide matrix (biofilm) that protects them from antibiotics and host immune defenses. Ventilator circuits, humidifiers, and suctioning equipment can serve as additional reservoirs for bacterial contamination.\n\nEarly-onset VAP (within 4 days of intubation) is typically caused by community-acquired pathogens: Streptococcus pneumoniae, Haemophilus influenzae, and methicillin-sensitive Staphylococcus aureus. Late-onset VAP (≥5 days) involves multidrug-resistant (MDR) organisms: Pseudomonas aeruginosa, MRSA, Acinetobacter baumannii, and extended-spectrum beta-lactamase (ESBL)-producing Enterobacteriaceae. The shift from early to late-onset pathogens reflects the progressive colonization of the oropharynx with hospital flora, facilitated by broad-spectrum antibiotics, acid-suppressing medications, and impaired host defenses."
    },
    riskFactors: [
      "Prolonged mechanical ventilation (risk increases 1-3% per ventilator day)",
      "Supine positioning (facilitates gastric-to-tracheal aspiration)",
      "Reintubation (disrupts airway defenses, increases aspiration risk)",
      "Prior antibiotic use (promotes MDR organism colonization)",
      "Acid-suppressive therapy (H2 blockers, PPIs raise gastric pH, allowing bacterial overgrowth)",
      "Poor oral hygiene and dental plaque (reservoir for respiratory pathogens)",
      "Immunosuppression, malnutrition, and advanced age"
    ],
    diagnostics: [
      "Clinical suspicion: new or progressive pulmonary infiltrate on CXR plus ≥2 of: fever >38°C, leukocytosis/leukopenia, purulent secretions",
      "Quantitative cultures: bronchoalveolar lavage (BAL ≥10⁴ CFU/mL) or protected specimen brush (≥10³ CFU/mL)",
      "Endotracheal aspirate cultures: semi-quantitative (less specific but more practical)",
      "Blood cultures: positive in ~15% of VAP cases; indicate bacteremia",
      "Procalcitonin: helps guide antibiotic duration (serial measurements)",
      "CPIS (Clinical Pulmonary Infection Score): integrates temperature, WBC, secretions, oxygenation, CXR, culture"
    ],
    management: [
      "Empiric broad-spectrum antibiotics within 1 hour of clinical suspicion (before culture results)",
      "Early-onset VAP: ceftriaxone, ampicillin-sulbactam, or fluoroquinolone",
      "Late-onset or MDR risk: antipseudomonal beta-lactam + aminoglycoside or fluoroquinolone + MRSA coverage (vancomycin or linezolid)",
      "De-escalate antibiotics based on culture sensitivities within 48-72 hours",
      "Standard treatment duration: 7 days (shorter courses guided by procalcitonin)",
      "Assess daily readiness for extubation (spontaneous breathing trial) to minimize ventilator duration"
    ],
    nursingActions: [
      "Implement VAP prevention bundle: HOB ≥30-45°, daily sedation vacation, daily SBT assessment",
      "Perform oral care with chlorhexidine 0.12% every 2-4 hours per protocol",
      "Maintain ETT cuff pressure 20-30 cmH2O to prevent secretion aspiration",
      "Use subglottic secretion drainage ETT when available",
      "Practice meticulous hand hygiene before and after airway management",
      "Monitor for VAP signs: increasing FiO2 requirements, fever, change in sputum character, new infiltrate on CXR"
    ],
    signs: {
      left: [
        "New or progressive infiltrate on chest X-ray",
        "Fever >38°C or hypothermia <36°C",
        "Leukocytosis (>12,000) or leukopenia (<4,000)",
        "Increased purulent tracheal secretions"
      ],
      right: [
        "Declining oxygenation (increased FiO2 or PEEP requirements)",
        "Tachycardia and hemodynamic instability",
        "Adventitious lung sounds (crackles, rhonchi, bronchial breath sounds)",
        "Increased ventilator triggering or patient-ventilator asynchrony"
      ]
    },
    medications: [
      { name: "Piperacillin-tazobactam (Zosyn)", type: "Extended-spectrum penicillin/beta-lactamase inhibitor", action: "Broad-spectrum bactericidal activity against gram-positive, gram-negative (including Pseudomonas), and anaerobic organisms by inhibiting cell wall synthesis", sideEffects: "Diarrhea (C. difficile risk), rash, thrombocytopenia, elevated LFTs, seizures (high doses in renal failure)", contra: "Penicillin allergy (assess cross-reactivity risk), history of cholestatic jaundice with piperacillin use", pearl: "Often paired with vancomycin for empiric late-onset VAP coverage; requires renal dose adjustment. Extended infusion (4-hour infusion) improves pharmacokinetic target attainment for serious infections." },
      { name: "Vancomycin", type: "Glycopeptide antibiotic", action: "Inhibits cell wall synthesis by binding D-Ala-D-Ala terminus of peptidoglycan precursors; bactericidal against MRSA and other gram-positive organisms", sideEffects: "Nephrotoxicity, ototoxicity, Red Man syndrome (histamine-mediated flushing with rapid infusion), thrombocytopenia", contra: "Known hypersensitivity; use cautiously with other nephrotoxic agents", pearl: "Infuse over ≥1 hour to prevent Red Man syndrome. Monitor trough levels (target AUC/MIC ≥400). Always de-escalate if MRSA cultures are negative." }
    ],
    pearls: [
      "The VAP bundle (HOB elevation, oral care, sedation vacation, SBT, DVT/PUD prophylaxis) reduces VAP rates by 40-70%",
      "Oral care with chlorhexidine reduces oropharyngeal colonization and VAP incidence",
      "Subglottic secretion drainage tubes reduce early-onset VAP by preventing pooled secretion aspiration",
      "De-escalation to narrow-spectrum antibiotics based on cultures reduces resistance development and C. difficile risk"
    ],
    quiz: [
      { question: "Which nursing intervention is MOST effective in preventing ventilator-associated pneumonia?", options: ["Administering prophylactic antibiotics", "Keeping the head of bed elevated ≥30 degrees", "Performing tracheal suctioning every hour", "Changing ventilator circuits daily"], correct: 1, rationale: "HOB elevation ≥30 degrees is a cornerstone of VAP prevention—it reduces gastroesophageal reflux and aspiration of contaminated secretions into the lower airway." },
      { question: "A ventilated patient develops fever, leukocytosis, and purulent secretions on day 7 of intubation. Which organisms should empiric therapy cover?", options: ["Only gram-positive organisms", "Community-acquired organisms (S. pneumoniae, H. influenzae)", "MDR organisms including Pseudomonas and MRSA", "Only anaerobic organisms"], correct: 2, rationale: "Late-onset VAP (≥5 days) is associated with MDR organisms (Pseudomonas, MRSA, Acinetobacter). Empiric therapy must cover these pathogens and then be de-escalated based on culture results." }
    ]
  },

  "respiratory-distress-recognition": {
    title: "Respiratory Distress Recognition",
    cellular: {
      title: "Pathophysiology of Respiratory Distress",
      content: "Respiratory distress is a clinical syndrome characterized by increased work of breathing and signs of inadequate gas exchange. Recognizing the progression from compensated distress to decompensated respiratory failure is a critical nursing competency. Early recognition and intervention can prevent respiratory arrest and cardiac arrest, as respiratory failure is the most common pathway to cardiopulmonary arrest in hospitalized patients.\n\nThe physiology of respiratory distress involves activation of compensatory mechanisms in response to hypoxemia, hypercapnia, or increased airway resistance. Peripheral chemoreceptors (carotid and aortic bodies) detect falling PaO2 (<60 mmHg) and rising PaCO2, while central chemoreceptors in the medulla respond to CSF acidosis from elevated CO2. These signals increase respiratory drive, producing tachypnea and increased tidal volume.\n\nWhen the primary respiratory muscles (diaphragm and external intercostals) cannot generate sufficient tidal volume, accessory muscles are recruited: sternocleidomastoid, scalenes, and trapezius for inspiration; internal intercostals and abdominal muscles for active expiration. Nasal flaring in infants reflects the effort to reduce nasal airway resistance. Intercostal, suprasternal, and substernal retractions indicate highly negative intrapleural pressures generated during labored inspiration against obstructed or stiff airways.\n\nAs respiratory distress progresses toward failure, compensatory mechanisms become exhausted. The transition from tachypnea to bradypnea or irregular breathing is an ominous sign of impending respiratory arrest. Paradoxical (see-saw) breathing—where the abdomen rises while the chest falls during inspiration—indicates diaphragmatic fatigue and imminent ventilatory failure. Other decompensation signs include declining mental status (from hypoxemia and hypercapnia), diaphoresis (sympathetic activation), inability to speak in full sentences, and tripod positioning."
    },
    riskFactors: [
      "Acute asthma exacerbation or COPD exacerbation",
      "Pneumonia (community-acquired or hospital-acquired)",
      "Heart failure with pulmonary edema",
      "Anaphylaxis with airway compromise",
      "Foreign body aspiration (especially in children and elderly)",
      "Neuromuscular weakness (Guillain-Barré, myasthenia crisis)",
      "Morbid obesity, sleep apnea, restrictive lung disease"
    ],
    diagnostics: [
      "Clinical assessment: respiratory rate, pattern, depth, accessory muscle use, SpO2",
      "ABG: PaO2, PaCO2, pH—differentiates hypoxemic vs hypercapnic failure",
      "Peak expiratory flow rate (PEFR): quantifies airflow obstruction in asthma",
      "Chest X-ray: identify pneumonia, pneumothorax, pleural effusion, pulmonary edema",
      "Capnography (ETCO2): non-invasive CO2 monitoring; rising ETCO2 suggests hypoventilation",
      "Rapid bedside ultrasound: evaluate for pneumothorax, pleural effusion, B-lines (pulmonary edema)"
    ],
    management: [
      "Immediate: position upright (high Fowler's), apply supplemental oxygen, call for help",
      "Identify and treat underlying cause: bronchodilators for bronchospasm, diuretics for pulmonary edema",
      "Non-invasive ventilation (BiPAP/CPAP) for moderate respiratory distress if patient is alert and cooperative",
      "Intubation and mechanical ventilation for severe distress with signs of decompensation",
      "Epinephrine for anaphylaxis with respiratory compromise",
      "Activate rapid response team (RRT) for acute deterioration on medical/surgical units"
    ],
    nursingActions: [
      "Assess respiratory rate, rhythm, depth, and effort at least every 1-2 hours in at-risk patients",
      "Recognize early warning signs: rising respiratory rate (often the FIRST sign of deterioration), subtle accessory muscle use",
      "Apply continuous pulse oximetry; escalate care if SpO2 <92% or trending downward",
      "Position patient upright; assist with pursed-lip breathing for obstructive disease",
      "Keep intubation equipment readily available (airway cart at bedside for high-risk patients)",
      "Communicate concerns using SBAR format to the healthcare team; activate RRT if criteria met"
    ],
    signs: {
      left: [
        "Tachypnea (RR >20 in adults, age-adjusted for pediatrics)",
        "Accessory muscle use (SCM, scalenes, intercostals)",
        "Nasal flaring (especially significant in infants/children)",
        "Intercostal, suprasternal, substernal retractions"
      ],
      right: [
        "Inability to speak in full sentences",
        "Tripod positioning (sitting upright, leaning forward, arms braced)",
        "Diaphoresis with air hunger",
        "Paradoxical (see-saw) breathing (LATE ominous sign)",
        "Declining mental status, agitation progressing to lethargy"
      ]
    },
    medications: [
      { name: "Epinephrine (Adrenaline)", type: "Catecholamine (alpha and beta agonist)", action: "Beta-2 effect causes bronchodilation; alpha-1 effect reduces mucosal edema and laryngeal swelling; increases heart rate and cardiac output", sideEffects: "Tachycardia, hypertension, tremor, anxiety, palpitations, hyperglycemia", contra: "No absolute contraindications in life-threatening anaphylaxis or respiratory arrest", pearl: "IM epinephrine (0.3-0.5 mg of 1:1000 in anterolateral thigh) is first-line for anaphylaxis-related respiratory distress; can repeat every 5-15 minutes" },
      { name: "Albuterol (Salbutamol)", type: "Short-acting beta-2 agonist", action: "Selectively stimulates beta-2 receptors on bronchial smooth muscle, producing rapid bronchodilation", sideEffects: "Tachycardia, tremor, hypokalemia, nervousness", contra: "Hypersensitivity to albuterol", pearl: "Continuous nebulization (10-15 mg/hour) can be used for severe acute asthma; MDI with spacer is equally effective as nebulizer in mild-moderate exacerbations" }
    ],
    pearls: [
      "Tachypnea is often the FIRST vital sign to change in clinical deterioration—always investigate a rising respiratory rate",
      "A 'normal' or decreasing respiratory rate in a distressed patient is MORE concerning than tachypnea—it suggests exhaustion and impending arrest",
      "The inability to speak in full sentences indicates severe respiratory distress requiring immediate intervention",
      "Paradoxical (see-saw) breathing is a pre-arrest finding indicating diaphragmatic fatigue",
      "Silent chest in an asthmatic is an emergency—it means airflow is too restricted to generate wheezes"
    ],
    quiz: [
      { question: "Which finding indicates a patient in respiratory distress is progressing toward respiratory failure?", options: ["Respiratory rate increasing from 22 to 28", "Use of accessory muscles", "Respiratory rate decreasing from 30 to 12 with increasing lethargy", "Ability to speak in short phrases"], correct: 2, rationale: "A decreasing respiratory rate with increasing lethargy in a previously tachypneic, distressed patient indicates respiratory muscle exhaustion and impending respiratory arrest—this is a pre-arrest finding requiring immediate intervention." },
      { question: "A nurse assesses an asthmatic patient who was previously wheezing and now has a 'silent chest.' What is the appropriate action?", options: ["Document improvement and continue monitoring", "Administer oral corticosteroids", "Activate the rapid response team—this is an emergency", "Increase supplemental oxygen and reassess in 30 minutes"], correct: 2, rationale: "A silent chest in a previously wheezing asthmatic means airflow is so severely restricted that air movement is insufficient to generate wheezes. This indicates critical bronchospasm and impending respiratory arrest—immediate intervention (RRT, epinephrine, continuous nebulization, possible intubation) is required." }
    ]
  },
};
