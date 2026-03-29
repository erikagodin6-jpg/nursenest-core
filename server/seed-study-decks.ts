import { Pool } from "pg";

const SYSTEM_USER_ID = "system-nursenest";

interface SeedDeck {
  title: string;
  slug: string;
  description: string;
  tags: string[];
  cards: { front: string; back: string; rationale?: string }[];
}

const preNursingDecks: SeedDeck[] = [
  {
    title: "Medical Terminology Essentials",
    slug: "medical-terminology-essentials",
    description: "Master root words, prefixes, and suffixes used in nursing and medicine. Essential for pre-nursing students.",
    tags: ["pre-nursing", "terminology", "fundamentals"],
    cards: [
      { front: "What does the prefix 'hyper-' mean?", back: "Above normal / excessive", rationale: "Example: Hypertension = excessively high blood pressure" },
      { front: "What does the prefix 'hypo-' mean?", back: "Below normal / deficient", rationale: "Example: Hypoglycemia = below-normal blood glucose" },
      { front: "What does the suffix '-itis' indicate?", back: "Inflammation", rationale: "Example: Appendicitis = inflammation of the appendix" },
      { front: "What does the suffix '-ectomy' mean?", back: "Surgical removal", rationale: "Example: Appendectomy = surgical removal of the appendix" },
      { front: "What does the suffix '-osis' indicate?", back: "Abnormal condition or disease", rationale: "Example: Cyanosis = abnormal blue discoloration" },
      { front: "What does 'tachy-' mean?", back: "Fast / rapid", rationale: "Example: Tachycardia = abnormally fast heart rate (>100 bpm)" },
      { front: "What does 'brady-' mean?", back: "Slow", rationale: "Example: Bradycardia = abnormally slow heart rate (<60 bpm)" },
      { front: "What does '-pnea' refer to?", back: "Breathing", rationale: "Dyspnea = difficult breathing; Apnea = absence of breathing" },
      { front: "What does the prefix 'hemo-' or 'hemato-' mean?", back: "Blood", rationale: "Hematuria = blood in urine; Hemorrhage = excessive bleeding" },
      { front: "What does '-ology' mean?", back: "Study of", rationale: "Cardiology = study of the heart; Neurology = study of the nervous system" },
      { front: "What does 'nephro-' refer to?", back: "Kidney", rationale: "Nephrology = study of kidney diseases; Nephrectomy = kidney removal" },
      { front: "What does 'hepato-' refer to?", back: "Liver", rationale: "Hepatitis = liver inflammation; Hepatomegaly = enlarged liver" },
      { front: "What does '-algia' mean?", back: "Pain", rationale: "Myalgia = muscle pain; Neuralgia = nerve pain" },
      { front: "What does 'cardi-' or 'cardio-' refer to?", back: "Heart", rationale: "Cardiomegaly = enlarged heart; Cardiomyopathy = heart muscle disease" },
      { front: "What does the suffix '-scopy' mean?", back: "Visual examination", rationale: "Colonoscopy = visual examination of the colon" },
      { front: "What does 'dys-' mean?", back: "Difficult, painful, abnormal", rationale: "Dysphagia = difficulty swallowing; Dysuria = painful urination" },
      { front: "What does '-emia' refer to?", back: "Blood condition", rationale: "Anemia = deficiency of red blood cells; Septicemia = blood infection" },
      { front: "What does 'poly-' mean?", back: "Many / excessive", rationale: "Polyuria = excessive urination; Polydipsia = excessive thirst" },
      { front: "What does 'pneumo-' refer to?", back: "Lung / air", rationale: "Pneumonia = lung infection; Pneumothorax = air in pleural space" },
      { front: "What does '-plasty' mean?", back: "Surgical repair / reconstruction", rationale: "Rhinoplasty = nose reconstruction; Arthroplasty = joint repair" },
    ],
  },
  {
    title: "Cell Biology for Nursing",
    slug: "cell-biology-nursing",
    description: "Understand cell structure, organelles, and cellular processes essential for nursing pathophysiology.",
    tags: ["pre-nursing", "biology", "cells", "A&P"],
    cards: [
      { front: "What is the function of the cell membrane?", back: "Selectively permeable barrier that controls what enters and exits the cell", rationale: "Uses phospholipid bilayer with embedded proteins for transport" },
      { front: "What is the function of mitochondria?", back: "Produce ATP (cellular energy) through aerobic respiration", rationale: "Known as the 'powerhouse of the cell.' Cells with high energy needs (muscle, liver) have more mitochondria" },
      { front: "What is the nucleus responsible for?", back: "Contains DNA and controls cell activities including protein synthesis", rationale: "The 'control center' of the cell. Red blood cells lack a nucleus" },
      { front: "What does the endoplasmic reticulum (ER) do?", back: "Rough ER: synthesizes proteins. Smooth ER: synthesizes lipids and detoxifies drugs", rationale: "Liver cells have extensive smooth ER for drug metabolism" },
      { front: "What is osmosis?", back: "Movement of water across a semipermeable membrane from low solute concentration to high solute concentration", rationale: "Critical for understanding IV fluid therapy and electrolyte balance" },
      { front: "What is active transport?", back: "Movement of substances against their concentration gradient, requiring ATP energy", rationale: "The sodium-potassium pump (Na+/K+ ATPase) is a key example" },
      { front: "What is the difference between hypertonic, hypotonic, and isotonic solutions?", back: "Hypertonic: higher solute (cell shrinks). Hypotonic: lower solute (cell swells). Isotonic: equal solute (no change)", rationale: "Essential for IV fluid selection: 0.9% NS is isotonic; D5W is hypotonic once metabolized" },
      { front: "What are the phases of the cell cycle?", back: "Interphase (G1, S, G2) → Mitosis (prophase, metaphase, anaphase, telophase) → Cytokinesis", rationale: "Chemotherapy drugs target specific phases to kill rapidly dividing cancer cells" },
      { front: "What is apoptosis?", back: "Programmed cell death — a controlled, orderly process of cell self-destruction", rationale: "Differs from necrosis (uncontrolled cell death from injury). Important in cancer biology" },
      { front: "What is diffusion?", back: "Movement of particles from an area of high concentration to low concentration (passive, no energy required)", rationale: "Gas exchange in the lungs occurs via diffusion: O2 diffuses into blood, CO2 diffuses out" },
      { front: "What are lysosomes?", back: "Organelles containing digestive enzymes that break down cellular waste, bacteria, and damaged organelles", rationale: "Dysfunction leads to lysosomal storage diseases (e.g., Tay-Sachs)" },
      { front: "What is the Golgi apparatus?", back: "Modifies, packages, and sorts proteins for secretion or use within the cell", rationale: "Acts as the cell's 'post office' — processes and ships products" },
    ],
  },
  {
    title: "pH, Buffers & Acid-Base Basics",
    slug: "ph-buffers-acid-base-basics",
    description: "Foundation concepts for understanding acid-base balance, essential for ABG interpretation.",
    tags: ["pre-nursing", "chemistry", "acid-base", "ABG"],
    cards: [
      { front: "What is the normal blood pH range?", back: "7.35 – 7.45", rationale: "Below 7.35 = acidosis; Above 7.45 = alkalosis. Life-threatening outside 6.8–7.8" },
      { front: "What is an acid?", back: "A substance that donates hydrogen ions (H+), lowering pH", rationale: "More H+ ions = lower pH = more acidic" },
      { front: "What is a base (alkali)?", back: "A substance that accepts hydrogen ions (H+), raising pH", rationale: "Bicarbonate (HCO3-) is the body's main base buffer" },
      { front: "What are the 3 buffer systems in the body?", back: "1) Bicarbonate buffer system 2) Respiratory system (CO2) 3) Renal system (kidneys)", rationale: "Bicarb: immediate. Lungs: minutes. Kidneys: hours to days" },
      { front: "How do the lungs regulate pH?", back: "By adjusting CO2 elimination: faster breathing = more CO2 blown off = pH rises", rationale: "CO2 is an acid. Hyperventilation causes respiratory alkalosis" },
      { front: "How do the kidneys regulate pH?", back: "By excreting or retaining H+ and HCO3-", rationale: "Kidneys can regenerate bicarbonate. Slowest but most powerful buffer" },
      { front: "What is the normal PaCO2 range?", back: "35–45 mmHg", rationale: "CO2 is regulated by the respiratory system. High CO2 = acidosis" },
      { front: "What is the normal HCO3- range?", back: "22–26 mEq/L", rationale: "Bicarbonate is the metabolic component. Low HCO3 = metabolic acidosis" },
      { front: "What does compensation mean in acid-base?", back: "The opposite system (respiratory or metabolic) adjusts to normalize pH", rationale: "If metabolic acidosis → lungs compensate by hyperventilating to blow off CO2" },
      { front: "What is a buffer?", back: "A chemical system that resists changes in pH by absorbing excess H+ or OH- ions", rationale: "The bicarbonate-carbonic acid system is the most important extracellular buffer" },
    ],
  },
  {
    title: "Homeostasis & Vital Signs",
    slug: "homeostasis-vital-signs",
    description: "Understand homeostatic mechanisms and normal vital sign ranges for nursing assessment.",
    tags: ["pre-nursing", "fundamentals", "vitals", "assessment"],
    cards: [
      { front: "What is homeostasis?", back: "The body's ability to maintain a stable internal environment despite external changes", rationale: "Temperature regulation, blood glucose control, and fluid balance are all examples" },
      { front: "What is normal adult body temperature?", back: "36.1°C – 37.2°C (97°F – 99°F)", rationale: "Fever (pyrexia) ≥ 38°C (100.4°F). Hypothermia < 35°C (95°F)" },
      { front: "What is normal adult heart rate?", back: "60–100 beats per minute (bpm)", rationale: "Tachycardia > 100 bpm; Bradycardia < 60 bpm. Athletes may normally be < 60" },
      { front: "What is normal adult blood pressure?", back: "Systolic < 120 mmHg and Diastolic < 80 mmHg", rationale: "Hypertension Stage 1: 130-139/80-89. Hypertensive crisis: > 180/120" },
      { front: "What is normal adult respiratory rate?", back: "12–20 breaths per minute", rationale: "Tachypnea > 20; Bradypnea < 12. Apnea = absence of breathing" },
      { front: "What is normal SpO2 (oxygen saturation)?", back: "95–100%", rationale: "Below 90% is concerning. COPD patients may have a baseline of 88-92%" },
      { front: "What is a negative feedback loop?", back: "A mechanism where the output reduces the original stimulus to maintain homeostasis", rationale: "Example: High blood glucose → insulin release → glucose drops → insulin stops" },
      { front: "What is a positive feedback loop?", back: "A mechanism where the output amplifies the original stimulus", rationale: "Example: Oxytocin during labor — contractions increase oxytocin which increases contractions" },
      { front: "What is the normal urine output for adults?", back: "0.5–1 mL/kg/hr (approximately 30–60 mL/hr)", rationale: "Output < 0.5 mL/kg/hr may indicate dehydration, renal failure, or shock" },
      { front: "What is pulse pressure?", back: "The difference between systolic and diastolic BP (normal: 30-40 mmHg)", rationale: "Widened pulse pressure seen in increased ICP; narrowed in shock" },
    ],
  },
];

const apDecks: SeedDeck[] = [
  {
    title: "Cardiovascular System — Anatomy & Physiology",
    slug: "cardiovascular-anatomy-physiology",
    description: "Heart chambers, valves, blood flow, cardiac cycle, and conduction system for nursing students.",
    tags: ["A&P", "cardiovascular", "heart", "anatomy"],
    cards: [
      { front: "Trace blood flow through the heart", back: "Vena cava → RA → Tricuspid valve → RV → Pulmonic valve → Pulmonary artery → Lungs → Pulmonary veins → LA → Mitral valve → LV → Aortic valve → Aorta", rationale: "Mnemonic: 'Tri before you Bi' — tricuspid is on the right, bicuspid (mitral) on the left" },
      { front: "What are the components of the cardiac conduction system?", back: "SA node → AV node → Bundle of His → Right and left bundle branches → Purkinje fibers", rationale: "SA node is the primary pacemaker (60-100 bpm). AV node backup (40-60 bpm)" },
      { front: "What is cardiac output (CO)?", back: "CO = Heart Rate × Stroke Volume. Normal: 4-8 L/min", rationale: "Stroke volume affected by preload, afterload, and contractility" },
      { front: "What is preload?", back: "The volume of blood in the ventricles at the end of diastole (end-diastolic volume)", rationale: "Increased by IV fluids; decreased by diuretics. Think: 'the stretch before the beat'" },
      { front: "What is afterload?", back: "The resistance the heart must pump against to eject blood (primarily systemic vascular resistance)", rationale: "Increased by vasoconstriction/HTN. Vasodilators decrease afterload" },
      { front: "What does the P wave represent on ECG?", back: "Atrial depolarization (atrial contraction)", rationale: "Absent P waves may indicate atrial fibrillation" },
      { front: "What does the QRS complex represent?", back: "Ventricular depolarization (ventricular contraction)", rationale: "Normal duration: 0.06-0.12 seconds. Wide QRS (>0.12s) may indicate bundle branch block" },
      { front: "What coronary artery supplies the left ventricle?", back: "Left anterior descending (LAD) artery", rationale: "Called 'the widow maker' — occlusion causes massive anterior MI" },
      { front: "What are the normal hemodynamic values for CVP?", back: "Central Venous Pressure: 2-6 mmHg", rationale: "Elevated in right heart failure, fluid overload. Low in hypovolemia" },
      { front: "What is ejection fraction (EF)?", back: "Percentage of blood pumped out of the LV with each contraction. Normal: 55-70%", rationale: "EF < 40% = systolic heart failure (HFrEF)" },
      { front: "What is the Frank-Starling law?", back: "The more the heart muscle is stretched (preload), the greater the force of contraction, up to a point", rationale: "In heart failure, the muscle is overstretched and this mechanism fails" },
      { front: "What valve prevents backflow from the aorta to the LV?", back: "Aortic valve", rationale: "Aortic regurgitation causes a diastolic murmur and bounding pulses" },
    ],
  },
  {
    title: "Respiratory System — Anatomy & Physiology",
    slug: "respiratory-anatomy-physiology",
    description: "Airways, gas exchange, lung volumes, and respiratory mechanics for nursing students.",
    tags: ["A&P", "respiratory", "lungs", "anatomy"],
    cards: [
      { front: "What is the primary function of the respiratory system?", back: "Gas exchange: deliver O2 to tissues and remove CO2", rationale: "External respiration occurs in alveoli; internal respiration occurs at tissue level" },
      { front: "Where does gas exchange occur?", back: "In the alveoli of the lungs, across the alveolar-capillary membrane", rationale: "~300 million alveoli provide enormous surface area (~70 m²)" },
      { front: "What is tidal volume (TV)?", back: "Volume of air inhaled or exhaled in one normal breath (~500 mL)", rationale: "Used in ventilator settings: typically 6-8 mL/kg ideal body weight" },
      { front: "What is the oxyhemoglobin dissociation curve?", back: "Shows the relationship between PaO2 and hemoglobin oxygen saturation", rationale: "Right shift (↑ unloading): fever, acidosis, ↑2,3-DPG. Left shift (↑ binding): alkalosis, hypothermia" },
      { front: "What causes the Hering-Breuer reflex?", back: "Stretch receptors in the lungs prevent over-inflation by inhibiting inspiration", rationale: "A protective mechanism — triggers expiration when lungs are maximally inflated" },
      { front: "What is ventilation-perfusion (V/Q) matching?", back: "The balance between alveolar ventilation and pulmonary capillary blood flow", rationale: "V/Q mismatch is the most common cause of hypoxemia. PE causes dead space (ventilation without perfusion)" },
      { front: "What is residual volume?", back: "Volume of air remaining in the lungs after maximal exhalation (~1200 mL)", rationale: "Prevents alveolar collapse. Increased in obstructive diseases (air trapping)" },
      { front: "What muscles are used in normal inspiration?", back: "Diaphragm (primary) and external intercostals", rationale: "Accessory muscles (SCM, scalenes) used in respiratory distress — a key assessment finding" },
      { front: "What is surfactant?", back: "A phospholipid produced by Type II alveolar cells that reduces surface tension and prevents alveolar collapse", rationale: "Premature infants lack surfactant → neonatal respiratory distress syndrome" },
      { front: "What is the normal PaO2 range?", back: "80-100 mmHg", rationale: "PaO2 < 60 mmHg = respiratory failure requiring intervention" },
    ],
  },
  {
    title: "Renal System — Anatomy & Physiology",
    slug: "renal-anatomy-physiology",
    description: "Nephron structure, filtration, fluid balance, and renal function for nursing students.",
    tags: ["A&P", "renal", "kidneys", "fluid balance"],
    cards: [
      { front: "What is the functional unit of the kidney?", back: "The nephron (~1 million per kidney)", rationale: "Each nephron filters blood, reabsorbs nutrients, and secretes waste" },
      { front: "What is GFR (glomerular filtration rate)?", back: "The rate at which blood is filtered by the glomeruli. Normal: ~120 mL/min", rationale: "GFR < 60 for 3+ months = chronic kidney disease. GFR < 15 = kidney failure" },
      { front: "What hormones do the kidneys produce?", back: "Erythropoietin (EPO), Renin, Active Vitamin D (calcitriol)", rationale: "CKD → low EPO → anemia; low calcitriol → low calcium → bone disease" },
      { front: "What does aldosterone do?", back: "Promotes sodium reabsorption and potassium excretion in the distal tubule", rationale: "Released by adrenal cortex via RAAS. Aldosterone = 'salt-saving hormone'" },
      { front: "What does ADH (antidiuretic hormone) do?", back: "Promotes water reabsorption in the collecting ducts, concentrating urine", rationale: "SIADH = excess ADH → dilutional hyponatremia. Diabetes insipidus = low ADH → dilute urine" },
      { front: "What is the normal BUN range?", back: "10-20 mg/dL", rationale: "BUN elevated in dehydration, GI bleeding, high protein intake, kidney disease" },
      { front: "What is the normal serum creatinine range?", back: "0.6-1.2 mg/dL", rationale: "Creatinine is the most reliable indicator of kidney function. Rises when ~50% nephrons lost" },
      { front: "What is the RAAS system?", back: "Renin → Angiotensinogen → Angiotensin I → (ACE) → Angiotensin II → Aldosterone release", rationale: "ACE inhibitors (-pril drugs) block this cascade. Used in HTN and heart failure" },
      { front: "What is the normal urine specific gravity?", back: "1.005-1.030", rationale: "Low: overhydration or diabetes insipidus. High: dehydration or SIADH" },
      { front: "Where is most glucose and sodium reabsorbed?", back: "In the proximal convoluted tubule (PCT)", rationale: "~65% of filtered sodium and nearly 100% of glucose reabsorbed here" },
    ],
  },
  {
    title: "Nervous System — Anatomy & Physiology",
    slug: "nervous-system-anatomy-physiology",
    description: "CNS, PNS, neurons, reflexes, and cranial nerves for nursing students.",
    tags: ["A&P", "neuro", "nervous system", "anatomy"],
    cards: [
      { front: "What are the two divisions of the nervous system?", back: "Central Nervous System (brain + spinal cord) and Peripheral Nervous System (cranial + spinal nerves)", rationale: "CNS is protected by meninges, CSF, and bone" },
      { front: "What are the 3 layers of meninges (outer to inner)?", back: "Dura mater → Arachnoid mater → Pia mater", rationale: "Epidural hematoma: between skull and dura. Subdural: between dura and arachnoid. Subarachnoid hemorrhage: between arachnoid and pia" },
      { front: "What is the function of the sympathetic nervous system?", back: "Fight or flight: increases HR, BP, bronchodilation, pupil dilation, diverts blood to muscles", rationale: "Releases norepinephrine and epinephrine. Opposite of parasympathetic" },
      { front: "What is the function of the parasympathetic nervous system?", back: "Rest and digest: decreases HR, increases GI motility, constricts pupils", rationale: "Mediated by the vagus nerve (CN X). Releases acetylcholine" },
      { front: "What are the lobes of the brain and their primary functions?", back: "Frontal: personality, judgment, motor. Parietal: sensory, spatial. Temporal: hearing, memory. Occipital: vision", rationale: "Broca's area (frontal): speech production. Wernicke's area (temporal): speech comprehension" },
      { front: "What is the Glasgow Coma Scale (GCS) range?", back: "3-15. Eye opening (1-4) + Verbal response (1-5) + Motor response (1-6)", rationale: "GCS ≤ 8 = severe (intubation needed). GCS 9-12 = moderate. GCS 13-15 = mild" },
      { front: "What is the blood-brain barrier (BBB)?", back: "A selective barrier formed by tight junctions in brain capillaries that restricts passage of substances", rationale: "Allows lipid-soluble and small molecules through. Many drugs cannot cross it" },
      { front: "What does cranial nerve X (vagus) innervate?", back: "Heart, lungs, and GI tract — controls HR, breathing, digestion", rationale: "Vagal stimulation slows the heart. Bearing down (Valsalva) stimulates the vagus nerve" },
      { front: "What is the normal intracranial pressure (ICP)?", back: "5-15 mmHg", rationale: "ICP > 20 mmHg requires intervention. Signs of ↑ICP: headache, vomiting, altered LOC, Cushing's triad" },
      { front: "What is Cushing's triad?", back: "Hypertension + Bradycardia + Irregular respirations", rationale: "Late sign of increased ICP — indicates brainstem compression. Medical emergency" },
    ],
  },
  {
    title: "Endocrine System — Anatomy & Physiology",
    slug: "endocrine-anatomy-physiology",
    description: "Hormones, glands, and endocrine disorders for nursing students.",
    tags: ["A&P", "endocrine", "hormones", "anatomy"],
    cards: [
      { front: "What hormones does the anterior pituitary produce?", back: "FSH, LH, ACTH, TSH, GH, Prolactin", rationale: "Mnemonic: FLAT PiG (FSH, LH, ACTH, TSH, Prolactin, GH)" },
      { front: "What hormones does the posterior pituitary release?", back: "ADH (vasopressin) and Oxytocin", rationale: "These are actually produced in the hypothalamus and stored/released by posterior pituitary" },
      { front: "What does insulin do?", back: "Lowers blood glucose by promoting cellular uptake and glycogen storage", rationale: "Produced by beta cells of the pancreas. Deficiency = diabetes mellitus" },
      { front: "What does glucagon do?", back: "Raises blood glucose by stimulating glycogenolysis and gluconeogenesis in the liver", rationale: "Produced by alpha cells of the pancreas. Used to treat severe hypoglycemia" },
      { front: "What hormones does the thyroid gland produce?", back: "T3 (triiodothyronine), T4 (thyroxine), and Calcitonin", rationale: "T3/T4 regulate metabolism. Calcitonin lowers serum calcium ('calci-tonin tones down calcium')" },
      { front: "What is the difference between Addison's disease and Cushing's syndrome?", back: "Addison's: adrenal insufficiency (low cortisol/aldosterone). Cushing's: excess cortisol", rationale: "Addison's: hypotension, hyperkalemia, bronze skin. Cushing's: moon face, buffalo hump, hyperglycemia" },
      { front: "What does the parathyroid hormone (PTH) do?", back: "Raises serum calcium by stimulating bone resorption, renal reabsorption, and vitamin D activation", rationale: "PTH and calcitonin have opposite effects on calcium. Hyperparathyroidism → hypercalcemia" },
      { front: "What does cortisol do?", back: "Increases blood glucose, suppresses immune response, and mobilizes nutrients during stress", rationale: "Produced by adrenal cortex. Chronic elevation causes Cushing's syndrome" },
      { front: "What is the normal fasting blood glucose range?", back: "70-100 mg/dL (3.9-5.6 mmol/L)", rationale: "Pre-diabetes: 100-125 mg/dL. Diabetes: ≥126 mg/dL. Hypoglycemia: <70 mg/dL" },
      { front: "What is the normal HbA1c target for diabetics?", back: "< 7% (reflects average blood glucose over 2-3 months)", rationale: "HbA1c 7% ≈ average glucose of 154 mg/dL. Each 1% change ≈ 30 mg/dL change" },
    ],
  },
  {
    title: "GI System — Anatomy & Physiology",
    slug: "gi-system-anatomy-physiology",
    description: "Digestive tract, accessory organs, enzymes, and GI physiology for nursing students.",
    tags: ["A&P", "GI", "digestive", "anatomy"],
    cards: [
      { front: "What is the order of the GI tract?", back: "Mouth → Esophagus → Stomach → Duodenum → Jejunum → Ileum → Cecum → Ascending colon → Transverse colon → Descending colon → Sigmoid → Rectum → Anus", rationale: "The small intestine has 3 parts: duodenum (shortest), jejunum (middle), ileum (longest)" },
      { front: "Where are most nutrients absorbed?", back: "In the small intestine, primarily the jejunum", rationale: "Villi and microvilli increase surface area. B12 and bile salts absorbed in ileum" },
      { front: "What does the liver produce?", back: "Bile, albumin, clotting factors, and processes drugs/toxins", rationale: "Liver failure → low albumin → edema; low clotting factors → bleeding; high ammonia → encephalopathy" },
      { front: "What is the function of bile?", back: "Emulsifies fats (breaks large fat globules into smaller droplets) for easier digestion", rationale: "Produced by liver, stored in gallbladder, released into duodenum" },
      { front: "What does the pancreas secrete?", back: "Exocrine: digestive enzymes (lipase, amylase, trypsin) and bicarbonate. Endocrine: insulin and glucagon", rationale: "Pancreatitis → elevated amylase and lipase" },
      { front: "What is normal serum albumin?", back: "3.5-5.0 g/dL", rationale: "Low albumin → third-spacing, edema. Indicator of nutritional status and liver function" },
      { front: "Where is the appendix located?", back: "Right lower quadrant (RLQ) at McBurney's point", rationale: "Appendicitis pain starts periumbilical then localizes to RLQ. Rebound tenderness is classic" },
      { front: "What enzyme breaks down starch?", back: "Amylase (salivary and pancreatic)", rationale: "Elevated amylase and lipase are diagnostic markers for acute pancreatitis" },
      { front: "What is peristalsis?", back: "Wave-like muscular contractions that move food through the GI tract", rationale: "Absent bowel sounds post-op may indicate paralytic ileus" },
      { front: "What are the 4 layers of the GI wall?", back: "Mucosa → Submucosa → Muscularis → Serosa", rationale: "Cancer staging depends on which layers are involved (TNM staging)" },
    ],
  },
];

const electrolyteDecks: SeedDeck[] = [
  {
    title: "Sodium Disorders — Hypo & Hypernatremia",
    slug: "sodium-disorders-hyponatremia-hypernatremia",
    description: "Causes, symptoms, and nursing management of sodium imbalances. Essential for NCLEX prep.",
    tags: ["electrolytes", "sodium", "fluids", "NCLEX"],
    cards: [
      { front: "What is the normal serum sodium range?", back: "135-145 mEq/L", rationale: "Sodium is the most abundant extracellular cation and major determinant of serum osmolality" },
      { front: "What are signs of hyponatremia (<135)?", back: "Confusion, lethargy, headache, nausea, seizures, muscle cramps", rationale: "Severe hyponatremia (<120) can cause cerebral edema and death. Neuro symptoms dominate" },
      { front: "What are common causes of hyponatremia?", back: "SIADH, water intoxication, diuretics (thiazides), heart failure, liver cirrhosis, Addison's disease", rationale: "Dilutional hyponatremia: too much water. Depletional: sodium loss" },
      { front: "What is the danger of correcting hyponatremia too quickly?", back: "Osmotic demyelination syndrome (central pontine myelinolysis)", rationale: "Correct no faster than 8-12 mEq/L per 24 hours. Causes irreversible brain damage" },
      { front: "What are signs of hypernatremia (>145)?", back: "Thirst, dry mucous membranes, restlessness, irritability, seizures, elevated temperature", rationale: "Water shifts out of cells → cellular dehydration. Brain cells most affected" },
      { front: "What are common causes of hypernatremia?", back: "Dehydration, diabetes insipidus, excessive sodium intake, watery diarrhea, fever", rationale: "Most common cause in hospitalized patients: inadequate free water intake" },
      { front: "What IV fluid is used for hypernatremia?", back: "Hypotonic solutions (0.45% NS or D5W) to replace free water", rationale: "Correct slowly to prevent cerebral edema. Max correction: 10-12 mEq/L per 24 hours" },
      { front: "What is SIADH?", back: "Syndrome of Inappropriate ADH — excessive ADH causes water retention → dilutional hyponatremia", rationale: "Treatment: fluid restriction, hypertonic saline for severe cases, demeclocycline" },
      { front: "What is diabetes insipidus (DI)?", back: "Deficiency of ADH (central) or kidney resistance to ADH (nephrogenic) → excessive dilute urine", rationale: "Urine SG < 1.005, urine output 5-20 L/day. Central DI treated with desmopressin (DDAVP)" },
      { front: "How does sodium affect fluid balance?", back: "Water follows sodium — where sodium goes, water follows (osmotic pull)", rationale: "This principle guides IV fluid therapy. Hypertonic saline pulls water into vasculature" },
    ],
  },
  {
    title: "Potassium Disorders — Hypo & Hyperkalemia",
    slug: "potassium-disorders-hypokalemia-hyperkalemia",
    description: "Critical potassium imbalances, ECG changes, and nursing interventions for NCLEX.",
    tags: ["electrolytes", "potassium", "cardiac", "NCLEX"],
    cards: [
      { front: "What is the normal serum potassium range?", back: "3.5-5.0 mEq/L", rationale: "Potassium is the major intracellular cation. Even small changes can be life-threatening" },
      { front: "What ECG changes occur with hypokalemia?", back: "Flattened T waves, ST depression, prominent U waves, prolonged QT", rationale: "Mnemonic: 'No Pot, No T, Big U' — T waves flatten, U waves appear" },
      { front: "What ECG changes occur with hyperkalemia?", back: "Tall peaked T waves → widened QRS → sine wave → cardiac arrest", rationale: "Hyperkalemia is a cardiac emergency. K+ > 6.5 = urgent treatment needed" },
      { front: "What are common causes of hypokalemia?", back: "Diuretics (loop/thiazide), vomiting, NG suction, diarrhea, alkalosis, insulin administration", rationale: "Alkalosis shifts K+ into cells. Always check K+ before giving insulin" },
      { front: "What are common causes of hyperkalemia?", back: "Renal failure, ACE inhibitors/ARBs, potassium-sparing diuretics, crush injuries, acidosis, burns", rationale: "Acidosis shifts K+ out of cells. Hemolyzed lab specimens give false highs" },
      { front: "What is the maximum IV potassium infusion rate?", back: "10-20 mEq/hour (NEVER IV push). Must be on cardiac monitor", rationale: "Rapid IV potassium can cause fatal cardiac arrest. Always dilute and infuse slowly" },
      { front: "What is the treatment for severe hyperkalemia?", back: "1) Calcium gluconate (cardiac protection) 2) Insulin + D50 (shifts K+ into cells) 3) Kayexalate (removes K+) 4) Dialysis", rationale: "Calcium gluconate is given FIRST to stabilize the myocardium but doesn't lower K+" },
      { front: "Why is potassium important for cardiac function?", back: "K+ is essential for cardiac muscle repolarization and maintaining normal heart rhythm", rationale: "Both hypo and hyperkalemia cause dysrhythmias. Digoxin toxicity worsened by hypokalemia" },
      { front: "What drugs can cause hyperkalemia?", back: "ACE inhibitors, ARBs, potassium-sparing diuretics (spironolactone), NSAIDs, succinylcholine", rationale: "Monitor K+ levels when starting these medications, especially in renal impairment" },
      { front: "What foods are high in potassium?", back: "Bananas, oranges, potatoes, tomatoes, avocados, spinach, dried fruits, beans", rationale: "Teach patients on K+-sparing diuretics to AVOID high-K+ foods. Teach those on loop diuretics to EAT more" },
    ],
  },
  {
    title: "Calcium & Magnesium Disorders",
    slug: "calcium-magnesium-disorders",
    description: "Hypo/hypercalcemia and hypo/hypermagnesemia — signs, causes, and NCLEX nursing interventions.",
    tags: ["electrolytes", "calcium", "magnesium", "NCLEX"],
    cards: [
      { front: "What is the normal serum calcium range?", back: "8.5-10.5 mg/dL (total) or 4.5-5.5 mg/dL (ionized)", rationale: "Always interpret with albumin level. Low albumin → falsely low total calcium" },
      { front: "What is Trousseau's sign?", back: "Carpal spasm (hand spasm) when BP cuff is inflated above systolic for 3 minutes", rationale: "Positive in hypocalcemia. The spasm occurs due to neuromuscular irritability" },
      { front: "What is Chvostek's sign?", back: "Facial muscle twitching when the facial nerve is tapped in front of the ear", rationale: "Positive in hypocalcemia. Both Chvostek's and Trousseau's indicate neuromuscular excitability" },
      { front: "What are signs of hypocalcemia?", back: "Numbness/tingling, muscle cramps, tetany, seizures, prolonged QT, Trousseau's, Chvostek's", rationale: "Low calcium increases neuromuscular excitability. Can be life-threatening (laryngospasm)" },
      { front: "What are signs of hypercalcemia?", back: "Bones (pain), Stones (renal), Groans (GI: N/V, constipation), Moans (confusion, lethargy)", rationale: "Mnemonic: 'Bones, Stones, Groans, and Psychiatric Moans.' Shortened QT on ECG" },
      { front: "What is the normal serum magnesium range?", back: "1.5-2.5 mEq/L", rationale: "Magnesium is essential for neuromuscular function, cardiac rhythm, and PTH secretion" },
      { front: "What are signs of hypomagnesemia?", back: "Similar to hypocalcemia: tremors, tetany, seizures, dysrhythmias, positive Trousseau's/Chvostek's", rationale: "Often coexists with hypokalemia. Must correct Mg2+ before K+ will correct" },
      { front: "Why is magnesium sulfate given in preeclampsia?", back: "Prevents seizures (eclampsia) by decreasing neuromuscular excitability", rationale: "Monitor: deep tendon reflexes, respiratory rate (>12), urine output. Antidote: calcium gluconate" },
      { front: "What is the relationship between calcium and phosphorus?", back: "Inverse relationship — when calcium goes up, phosphorus goes down (and vice versa)", rationale: "In CKD: high phosphorus → low calcium → secondary hyperparathyroidism → bone disease" },
      { front: "What causes hypocalcemia?", back: "Hypoparathyroidism, CKD, vitamin D deficiency, pancreatitis, massive blood transfusions", rationale: "Citrate in stored blood binds calcium. Post-thyroidectomy: risk of accidental parathyroid removal" },
    ],
  },
  {
    title: "ABG Interpretation — Step by Step",
    slug: "abg-interpretation-step-by-step",
    description: "Master arterial blood gas analysis with this systematic approach. Essential for NCLEX and clinical practice.",
    tags: ["electrolytes", "ABG", "acid-base", "respiratory", "NCLEX"],
    cards: [
      { front: "What are the normal ABG values?", back: "pH: 7.35-7.45 | PaCO2: 35-45 | HCO3: 22-26 | PaO2: 80-100", rationale: "Remember: pH and PaCO2 are inversely related (CO2 is an acid)" },
      { front: "Step 1 of ABG interpretation: Look at the pH", back: "< 7.35 = Acidosis | > 7.45 = Alkalosis | 7.35-7.45 = Normal or compensated", rationale: "The pH tells you the primary direction of the imbalance" },
      { front: "Step 2: Determine respiratory or metabolic cause", back: "If pH and PaCO2 move in OPPOSITE directions → Respiratory. If pH and HCO3 move in SAME direction → Metabolic", rationale: "CO2 is an acid controlled by lungs. HCO3 is a base controlled by kidneys" },
      { front: "What is respiratory acidosis?", back: "pH < 7.35, PaCO2 > 45 (CO2 retention)", rationale: "Causes: COPD, respiratory depression (opioids), pneumonia, airway obstruction" },
      { front: "What is respiratory alkalosis?", back: "pH > 7.45, PaCO2 < 35 (CO2 blown off)", rationale: "Causes: hyperventilation, anxiety, fever, pain, mechanical over-ventilation" },
      { front: "What is metabolic acidosis?", back: "pH < 7.35, HCO3 < 22", rationale: "Causes: DKA, renal failure, lactic acidosis, diarrhea, salicylate toxicity" },
      { front: "What is metabolic alkalosis?", back: "pH > 7.45, HCO3 > 26", rationale: "Causes: vomiting, NG suction, excessive antacids, diuretics, hypokalemia" },
      { front: "How does compensation work?", back: "The opposite system tries to normalize pH. Respiratory compensates for metabolic (and vice versa)", rationale: "Full compensation: pH returns to normal range. Partial: pH improved but still abnormal" },
      { front: "What does ROME stand for in ABG interpretation?", back: "Respiratory = Opposite (pH and CO2 go opposite ways). Metabolic = Equal (pH and HCO3 go same way)", rationale: "Helpful mnemonic for determining if the disorder is respiratory or metabolic" },
      { front: "Interpret: pH 7.30, PaCO2 50, HCO3 24", back: "Respiratory acidosis (uncompensated)", rationale: "pH is acidotic. CO2 is high (respiratory cause). HCO3 is normal (kidneys haven't compensated yet)" },
      { front: "Interpret: pH 7.48, PaCO2 30, HCO3 24", back: "Respiratory alkalosis (uncompensated)", rationale: "pH is alkalotic. CO2 is low (hyperventilating). HCO3 normal (no renal compensation)" },
      { front: "Interpret: pH 7.32, PaCO2 40, HCO3 18", back: "Metabolic acidosis (uncompensated)", rationale: "pH is acidotic. CO2 is normal (lungs haven't compensated). HCO3 is low (metabolic cause)" },
    ],
  },
  {
    title: "IV Fluids — Types & Indications",
    slug: "iv-fluids-types-indications",
    description: "Crystalloid and colloid solutions, tonicity, and clinical indications for nursing practice.",
    tags: ["electrolytes", "IV fluids", "fluids", "NCLEX"],
    cards: [
      { front: "What type of solution is 0.9% Normal Saline (NS)?", back: "Isotonic crystalloid", rationale: "Stays in the intravascular space. Used for: fluid resuscitation, blood transfusions, DKA" },
      { front: "What type of solution is Lactated Ringer's (LR)?", back: "Isotonic crystalloid", rationale: "Similar to plasma. Used for: burns, surgery, trauma. Contraindicated in liver failure (can't metabolize lactate)" },
      { front: "What type of solution is 0.45% NS (half-normal saline)?", back: "Hypotonic crystalloid", rationale: "Free water moves into cells. Used for: hypernatremia, cellular dehydration. Do NOT give to patients with increased ICP" },
      { front: "What type of solution is D5W after metabolism?", back: "Becomes hypotonic (free water) once dextrose is metabolized", rationale: "Initially isotonic in the bag, but acts as free water in the body. Used for hypernatremia" },
      { front: "What type of solution is 3% saline?", back: "Hypertonic crystalloid", rationale: "Pulls water from cells into vasculature. Used for severe hyponatremia with seizures. Monitor closely" },
      { front: "When are hypotonic solutions contraindicated?", back: "Increased ICP (cerebral edema), burns (third-spacing), liver disease, trauma", rationale: "Hypotonic fluids would shift water into brain cells, worsening cerebral edema" },
      { front: "When are hypertonic solutions used?", back: "Severe hyponatremia, cerebral edema (3% saline or mannitol)", rationale: "Must be given via central line (peripheral can cause phlebitis). Monitor sodium closely" },
      { front: "What are isotonic solutions used for?", back: "Fluid volume deficit, dehydration, shock, blood product administration", rationale: "Expand intravascular volume without shifting fluid between compartments" },
      { front: "What is the difference between crystalloids and colloids?", back: "Crystalloids: electrolyte solutions that pass through membranes. Colloids: contain large molecules that stay in vasculature (albumin, dextran)", rationale: "Colloids expand plasma volume more effectively but are more expensive" },
      { front: "Why is D5W NOT used for fluid resuscitation?", back: "The dextrose is quickly metabolized, leaving only free water which distributes to all compartments", rationale: "Only 8% of D5W stays in the intravascular space vs. 25% for NS" },
    ],
  },
];

const preNursingDecks2: SeedDeck[] = [
  {
    title: "Nursing Process: ADPIE",
    slug: "nursing-process-adpie",
    description: "Assessment, Diagnosis, Planning, Implementation, Evaluation — the foundation of clinical decision-making.",
    tags: ["pre-nursing", "fundamentals", "nursing process"],
    cards: [
      { front: "What are the 5 steps of the nursing process?", back: "Assessment, Diagnosis, Planning, Implementation, Evaluation (ADPIE)", rationale: "A systematic approach to patient care used by all nurses" },
      { front: "What is the first step of the nursing process?", back: "Assessment — collecting subjective and objective data", rationale: "Subjective: what the patient tells you. Objective: what you observe/measure" },
      { front: "What is a nursing diagnosis?", back: "A clinical judgment about actual or potential health problems the nurse can independently manage", rationale: "Different from a medical diagnosis. Example: 'Risk for falls related to impaired mobility'" },
      { front: "What does SMART stand for in goal setting?", back: "Specific, Measurable, Achievable, Relevant, Time-bound", rationale: "Example: 'Patient will ambulate 50 feet with walker by discharge (Day 3)'" },
      { front: "What is the difference between assessment and evaluation?", back: "Assessment is initial data collection. Evaluation is determining if goals were met after interventions", rationale: "If goals are not met, the nurse must reassess and revise the care plan" },
      { front: "What type of data is a patient's blood pressure?", back: "Objective data (measurable, observable)", rationale: "Objective data can be verified by another nurse. Subjective data = patient's own report" },
      { front: "What type of data is a patient reporting 'I feel nauseous'?", back: "Subjective data (patient's self-report)", rationale: "Subjective data can only come from the patient and cannot be independently verified" },
      { front: "What does implementation include?", back: "Carrying out the nursing interventions, documenting actions, and monitoring responses", rationale: "Includes delegating tasks appropriately and ensuring patient safety" },
    ],
  },
  {
    title: "Infection Control & Standard Precautions",
    slug: "infection-control-precautions",
    description: "Chain of infection, PPE, isolation precautions, and hand hygiene for nursing students.",
    tags: ["pre-nursing", "fundamentals", "infection control"],
    cards: [
      { front: "What are the 6 links of the chain of infection?", back: "1) Infectious agent 2) Reservoir 3) Portal of exit 4) Mode of transmission 5) Portal of entry 6) Susceptible host", rationale: "Breaking any link prevents infection transmission" },
      { front: "What are standard precautions?", back: "Precautions used for ALL patients regardless of diagnosis: hand hygiene, PPE, safe injection practices, respiratory hygiene", rationale: "Assumes every patient could be infectious. Applies to blood, body fluids, secretions, excretions" },
      { front: "What type of isolation is required for TB?", back: "Airborne precautions: N95 respirator, negative-pressure room, door closed", rationale: "TB, measles, and varicella (chickenpox) require airborne precautions" },
      { front: "What type of isolation is required for MRSA?", back: "Contact precautions: gown and gloves for all contact", rationale: "Also C. diff, VRE, and scabies. Dedicated equipment" },
      { front: "What type of isolation is required for influenza?", back: "Droplet precautions: surgical mask within 3-6 feet", rationale: "Also pertussis, meningococcal disease, mumps. Private room or cohort" },
      { front: "When should hand hygiene be performed?", back: "Before and after patient contact, before aseptic tasks, after body fluid exposure, after touching surroundings", rationale: "WHO '5 Moments of Hand Hygiene.' Soap and water required for C. diff (not alcohol-based gel)" },
      { front: "What is the correct order for donning PPE?", back: "Gown → Mask/Respirator → Goggles/Face shield → Gloves", rationale: "Remember: 'Going My Grandma's Garden' for donning order" },
      { front: "What is the correct order for doffing PPE?", back: "Gloves → Goggles/Face shield → Gown → Mask/Respirator", rationale: "Gloves are most contaminated — remove first. Mask removed last" },
      { front: "What is surgical asepsis (sterile technique)?", back: "Maintaining a sterile field free from ALL microorganisms. Used for: surgery, catheterization, dressing changes", rationale: "A contaminated field must be discarded and re-created. Never turn your back on a sterile field" },
      { front: "When is surgical asepsis required?", back: "Urinary catheterization, IV insertion, wound care with open wounds, surgical procedures", rationale: "Differs from medical asepsis (clean technique) which reduces but doesn't eliminate organisms" },
    ],
  },
  {
    title: "Patient Safety & Fall Prevention",
    slug: "patient-safety-fall-prevention",
    description: "QSEN competencies, patient identification, fall risk assessment, and safety interventions.",
    tags: ["pre-nursing", "fundamentals", "safety"],
    cards: [
      { front: "How many patient identifiers are required before any procedure?", back: "At least 2 identifiers (name + DOB or name + MRN)", rationale: "Never use room number as an identifier. Verify before medications, blood draws, transfusions" },
      { front: "What is the Morse Fall Scale?", back: "A tool that assesses fall risk based on: history of falls, secondary diagnosis, ambulatory aid, IV therapy, gait, mental status", rationale: "Score ≥45 = high risk. Implement fall precautions: bed alarm, non-skid socks, call light within reach" },
      { front: "What are key nursing interventions for fall prevention?", back: "Bed in lowest position, side rails up, non-skid footwear, call light within reach, bed alarm, adequate lighting", rationale: "Toileting schedule reduces falls. Review medications that cause dizziness/orthostatic hypotension" },
      { front: "What does RACE stand for in fire safety?", back: "Rescue, Alarm, Contain, Extinguish/Evacuate", rationale: "First priority: remove patients from immediate danger" },
      { front: "What does PASS stand for (fire extinguisher)?", back: "Pull pin, Aim at base of fire, Squeeze handle, Sweep side to side", rationale: "Stand 6-8 feet from fire. Know the location of extinguishers on your unit" },
      { front: "What is a Sentinel Event?", back: "An unexpected occurrence involving death or serious physical/psychological injury", rationale: "Requires root cause analysis (RCA). Examples: wrong-site surgery, medication error causing death" },
      { front: "What is a 'never event'?", back: "A preventable medical error that should never occur (e.g., wrong-site surgery, retained surgical item)", rationale: "CMS does not reimburse hospitals for never events" },
      { front: "What is a restraint?", back: "Any device that restricts patient movement. Requires a physician order, reassessment every 1-2 hours, and documentation", rationale: "Last resort. Must assess circulation, sensation, and range of motion. Release every 2 hours" },
    ],
  },
  {
    title: "Documentation & Communication",
    slug: "documentation-communication-nursing",
    description: "SBAR, DAR, nursing documentation, handoff communication, and interprofessional collaboration.",
    tags: ["pre-nursing", "fundamentals", "documentation", "communication"],
    cards: [
      { front: "What does SBAR stand for?", back: "Situation, Background, Assessment, Recommendation", rationale: "Standardized handoff communication tool. Reduces errors during transitions of care" },
      { front: "What is the 'Situation' in SBAR?", back: "What is happening right now? State the problem concisely", rationale: "Example: 'I'm calling about Mr. Smith in Room 204. His blood pressure has dropped to 80/50'" },
      { front: "What does DAR stand for in documentation?", back: "Data, Action, Response (focus charting format)", rationale: "D: what you assessed. A: what you did. R: how the patient responded" },
      { front: "What should nursing documentation include?", back: "Objective findings, interventions, patient responses, education provided, and changes in condition", rationale: "Document factually. Avoid subjective opinions. 'If it wasn't documented, it wasn't done'" },
      { front: "What is a late entry in documentation?", back: "Documentation added after the fact, clearly labeled as 'late entry' with the original time of the event", rationale: "Must note the current date/time and reference the missed event time. Never backdate" },
      { front: "What should you NEVER document in a medical record?", back: "Incident reports, staffing complaints, personal opinions, blaming language", rationale: "Incident reports are separate quality documents. Charting 'MD was notified' requires including time and response" },
      { front: "What is therapeutic communication?", back: "Goal-directed communication that promotes patient well-being using active listening, open-ended questions, and empathy", rationale: "Avoid: asking 'why,' giving advice, false reassurance, changing the subject" },
      { front: "What is an open-ended question?", back: "A question that cannot be answered with 'yes' or 'no' — encourages the patient to elaborate", rationale: "Example: 'Tell me about your pain' vs 'Do you have pain?'" },
    ],
  },
  {
    title: "Nutrition & Fluid Balance Basics",
    slug: "nutrition-fluid-balance-basics",
    description: "Macronutrients, therapeutic diets, fluid intake/output, and nutritional assessment for nursing.",
    tags: ["pre-nursing", "fundamentals", "nutrition", "fluids"],
    cards: [
      { front: "What are the 3 macronutrients?", back: "Carbohydrates (4 cal/g), Proteins (4 cal/g), Fats (9 cal/g)", rationale: "Alcohol = 7 cal/g. Fats are the most calorie-dense macronutrient" },
      { front: "What is the recommended daily fluid intake for adults?", back: "Approximately 2,000-3,000 mL/day (or ~30 mL/kg/day)", rationale: "Adjusted for heart failure (restrict), renal failure, fever (+500 mL per °C above normal)" },
      { front: "What is a clear liquid diet?", back: "Transparent liquids: broth, Jell-O, apple juice, tea, popsicles", rationale: "Used pre-surgery or for bowel rest. No milk, orange juice, or tomato juice" },
      { front: "What foods are high in potassium?", back: "Bananas, oranges, potatoes, spinach, tomatoes, avocados, dried fruits", rationale: "Important for patients on K+-sparing diuretics or with renal failure (may need to restrict)" },
      { front: "What foods are high in sodium?", back: "Canned foods, deli meats, chips, soy sauce, fast food, pickles, cheese", rationale: "Heart failure and hypertension patients often restricted to <2g sodium/day" },
      { front: "What is a BRAT diet?", back: "Bananas, Rice, Applesauce, Toast — bland diet for recovering from GI illness", rationale: "Low fiber, easy to digest. Used after vomiting or diarrhea. Transition to regular diet as tolerated" },
      { front: "What is BMI and what ranges indicate overweight/obesity?", back: "BMI = weight(kg)/height(m²). <18.5 underweight, 18.5-24.9 normal, 25-29.9 overweight, ≥30 obese", rationale: "Does not account for muscle mass. Use in conjunction with other assessments" },
      { front: "What is a calorie count and when is it ordered?", back: "Tracking all food/beverage intake in calories to assess nutritional adequacy", rationale: "Ordered for patients at risk for malnutrition, eating disorders, or weight loss" },
    ],
  },
  {
    title: "Pharmacology Foundations",
    slug: "pharmacology-foundations-nursing",
    description: "Drug classification, absorption, distribution, metabolism, excretion, and the rights of medication administration.",
    tags: ["pre-nursing", "pharmacology", "fundamentals"],
    cards: [
      { front: "What are the 6 Rights of Medication Administration?", back: "Right patient, Right drug, Right dose, Right route, Right time, Right documentation", rationale: "Some institutions add: right reason, right response, right to refuse" },
      { front: "What is pharmacokinetics?", back: "How the body processes a drug: Absorption, Distribution, Metabolism, Excretion (ADME)", rationale: "Liver metabolizes most drugs. Kidneys excrete most drug metabolites" },
      { front: "What is pharmacodynamics?", back: "How a drug affects the body — mechanism of action, therapeutic effects, and side effects", rationale: "Agonists activate receptors; antagonists block receptors" },
      { front: "What is a drug's half-life?", back: "The time it takes for the plasma concentration of a drug to decrease by 50%", rationale: "After 4-5 half-lives, a drug is considered eliminated. Important for dosing intervals" },
      { front: "What is the therapeutic range?", back: "The range of drug concentration in the blood that produces desired effects without toxicity", rationale: "Drugs with narrow therapeutic ranges (digoxin, lithium, warfarin) require careful monitoring" },
      { front: "What is a peak level?", back: "The highest concentration of a drug in the blood after administration", rationale: "Drawn 30-60 minutes after IV administration. Used for drugs like vancomycin, aminoglycosides" },
      { front: "What is a trough level?", back: "The lowest concentration of a drug in the blood, drawn just before the next dose", rationale: "Ensures the level stays within therapeutic range. Drawn 30 minutes before next dose" },
      { front: "What is a loading dose?", back: "A higher initial dose given to quickly reach therapeutic blood levels", rationale: "Common with: digoxin, heparin, phenytoin. Followed by lower maintenance doses" },
      { front: "What is first-pass metabolism?", back: "Oral drugs are absorbed in the GI tract and pass through the liver before reaching systemic circulation, reducing bioavailability", rationale: "Sublingual and IV routes bypass first-pass metabolism for faster onset" },
      { front: "What are the common routes of drug administration?", back: "Oral (PO), Sublingual (SL), Intravenous (IV), Intramuscular (IM), Subcutaneous (SubQ), Topical, Rectal, Inhalation", rationale: "IV has 100% bioavailability and fastest onset. Oral is most common but slowest" },
    ],
  },
];

const apDecks2: SeedDeck[] = [
  {
    title: "Musculoskeletal System — Anatomy & Physiology",
    slug: "musculoskeletal-anatomy-physiology",
    description: "Bones, joints, muscles, fractures, and mobility assessment for nursing students.",
    tags: ["A&P", "musculoskeletal", "orthopedic", "anatomy"],
    cards: [
      { front: "What are the 5 types of bones?", back: "Long (femur), Short (carpals), Flat (sternum), Irregular (vertebrae), Sesamoid (patella)", rationale: "Long bones contain red marrow for hematopoiesis (blood cell production)" },
      { front: "What is the function of red bone marrow?", back: "Produces red blood cells, white blood cells, and platelets (hematopoiesis)", rationale: "Found in flat bones (sternum, pelvis, ribs) and ends of long bones in adults" },
      { front: "What are the types of muscle tissue?", back: "Skeletal (voluntary, striated), Cardiac (involuntary, striated), Smooth (involuntary, non-striated)", rationale: "Skeletal muscles attach to bones via tendons and produce movement" },
      { front: "What is the difference between a ligament and a tendon?", back: "Ligament: connects bone to bone. Tendon: connects muscle to bone", rationale: "ACL (anterior cruciate ligament) connects femur to tibia. Achilles tendon connects calf to heel" },
      { front: "What are the types of fractures?", back: "Open/compound (breaks skin), Closed/simple (skin intact), Comminuted (shattered), Greenstick (incomplete, pediatric), Pathologic (from disease)", rationale: "Open fractures are surgical emergencies due to infection risk" },
      { front: "What are the 5 P's of neurovascular assessment?", back: "Pain, Pulse, Pallor, Paresthesia (numbness/tingling), Paralysis", rationale: "Assess distal to injury/cast. Absent pulse or paralysis = compartment syndrome emergency" },
      { front: "What is compartment syndrome?", back: "Increased pressure within a muscle compartment that compromises circulation and nerve function", rationale: "Signs: severe pain out of proportion, pain with passive stretch. Treatment: fasciotomy" },
      { front: "What is osteoporosis?", back: "Decreased bone density making bones fragile and fracture-prone", rationale: "Risk factors: postmenopausal women, vitamin D/calcium deficiency, sedentary lifestyle, corticosteroid use" },
      { front: "What is the normal range for serum calcium?", back: "8.5-10.5 mg/dL (or 2.1-2.6 mmol/L)", rationale: "Calcium is critical for bone health, muscle contraction, and nerve impulse transmission" },
      { front: "What type of joint is the knee?", back: "Hinge joint (synovial) — allows flexion and extension", rationale: "Ball-and-socket (hip, shoulder) allows widest range. Pivot (C1-C2) allows rotation" },
    ],
  },
  {
    title: "Immune & Lymphatic System — Anatomy & Physiology",
    slug: "immune-lymphatic-anatomy-physiology",
    description: "Innate and adaptive immunity, WBC types, antibodies, and immune responses for nursing.",
    tags: ["A&P", "immune", "lymphatic", "anatomy"],
    cards: [
      { front: "What are the two types of immunity?", back: "Innate (nonspecific, born with it) and Adaptive (specific, acquired through exposure)", rationale: "Innate: skin, mucous membranes, WBCs. Adaptive: T cells, B cells, antibodies" },
      { front: "What are the 5 types of white blood cells?", back: "Neutrophils (most abundant, fight bacteria), Lymphocytes (T/B cells), Monocytes (become macrophages), Eosinophils (parasites/allergies), Basophils (release histamine)", rationale: "Mnemonic: 'Never Let Monkeys Eat Bananas' in order of abundance" },
      { front: "What is the function of T cells?", back: "Cell-mediated immunity: directly attack infected cells, cancer cells, and transplanted tissue", rationale: "Helper T cells (CD4) coordinate immune response. Cytotoxic T cells (CD8) kill infected cells" },
      { front: "What is the function of B cells?", back: "Produce antibodies (immunoglobulins) for humoral immunity", rationale: "B cells → Plasma cells (produce antibodies) + Memory cells (long-term immunity)" },
      { front: "What are the 5 classes of immunoglobulins?", back: "IgG (crosses placenta, most abundant), IgA (secretory/mucosal), IgM (first responder), IgE (allergies/parasites), IgD (B cell activation)", rationale: "Mnemonic: GAMED. IgG is the only one that crosses the placenta" },
      { front: "What is the normal WBC count?", back: "5,000-10,000/μL (or 5.0-10.0 × 10⁹/L)", rationale: "Leukocytosis (>10,000): infection, inflammation. Leukopenia (<5,000): immunosuppression, chemo" },
      { front: "What is the difference between active and passive immunity?", back: "Active: body produces own antibodies (natural infection or vaccine). Passive: receives pre-formed antibodies (maternal, immunoglobulin)", rationale: "Active immunity is long-lasting. Passive immunity is temporary (weeks to months)" },
      { front: "What are the cardinal signs of inflammation?", back: "Redness (rubor), Heat (calor), Swelling (tumor), Pain (dolor), Loss of function (functio laesa)", rationale: "Inflammation is a nonspecific immune response that begins the healing process" },
      { front: "What is anaphylaxis?", back: "A severe, life-threatening allergic reaction causing airway constriction, hypotension, and shock", rationale: "Treatment: epinephrine IM (EpiPen), maintain airway, IV fluids. Call code/rapid response" },
      { front: "What are the organs of the lymphatic system?", back: "Lymph nodes, spleen, thymus, tonsils, bone marrow", rationale: "Spleen filters blood and recycles RBCs. Thymus is where T cells mature. Splenectomy → infection risk" },
    ],
  },
  {
    title: "Integumentary System — Skin Assessment",
    slug: "integumentary-skin-assessment",
    description: "Skin layers, wound healing, pressure injuries, and dermatological assessment for nursing.",
    tags: ["A&P", "integumentary", "skin", "wound care"],
    cards: [
      { front: "What are the 3 layers of skin?", back: "Epidermis (outer, avascular), Dermis (middle, blood vessels/nerves), Hypodermis/Subcutaneous (deepest, fat/connective tissue)", rationale: "Epidermis regenerates. Dermis contains collagen, hair follicles, sweat glands" },
      { front: "What are the stages of pressure injuries?", back: "Stage 1: Non-blanchable redness. Stage 2: Partial-thickness (blister). Stage 3: Full-thickness (fat visible). Stage 4: Deep tissue/bone/muscle visible. Unstageable: covered by eschar/slough", rationale: "Never reverse-stage (a healing Stage 4 is not a Stage 3)" },
      { front: "What is the Braden Scale?", back: "A tool to assess pressure injury risk: sensory perception, moisture, activity, mobility, nutrition, friction/shear", rationale: "Score range 6-23. Lower score = higher risk. ≤18 = at risk. ≤12 = high risk" },
      { front: "What are the phases of wound healing?", back: "1) Hemostasis (clotting) 2) Inflammation (WBCs clean wound) 3) Proliferation (granulation tissue) 4) Maturation/Remodeling (scar strengthens)", rationale: "Healing by primary intention: surgical wound, edges approximated. Secondary: wound fills in from bottom" },
      { front: "What does wound granulation tissue look like?", back: "Beefy red, moist tissue that fills in the wound bed during healing", rationale: "Healthy sign of proliferative phase. Yellow/green tissue = possible infection" },
      { front: "What is eschar?", back: "Dead, necrotic tissue that is black or brown and leathery", rationale: "Must be debrided for wound healing to progress. Cannot stage a wound covered by eschar" },
      { front: "What is a blanch test?", back: "Press on a reddened area — if it turns white and returns to red, perfusion is adequate. Non-blanchable = Stage 1 pressure injury", rationale: "Assess bony prominences: sacrum, heels, ischial tuberosities, occiput, trochanter" },
      { front: "How often should patients be repositioned to prevent pressure injuries?", back: "Every 2 hours minimum. Use pressure-relief devices (specialty mattress, heel elevators)", rationale: "High-risk areas: sacrum (#1 in supine), ischial tuberosities (sitting), heels, occiput" },
    ],
  },
  {
    title: "Reproductive System — Anatomy & Physiology",
    slug: "reproductive-anatomy-physiology",
    description: "Male and female reproductive anatomy, menstrual cycle, and hormones for nursing students.",
    tags: ["A&P", "reproductive", "OB", "anatomy"],
    cards: [
      { front: "What hormones regulate the menstrual cycle?", back: "FSH (stimulates follicle growth), LH (triggers ovulation), Estrogen (builds endometrium), Progesterone (maintains endometrium)", rationale: "LH surge = ovulation (~Day 14). If no implantation → progesterone drops → menstruation" },
      { front: "When does ovulation typically occur?", back: "Around Day 14 of a 28-day cycle (14 days before expected menstruation)", rationale: "Triggered by LH surge. Egg is viable for 12-24 hours. Sperm viable for 3-5 days" },
      { front: "What is the function of estrogen?", back: "Develops secondary sex characteristics, builds uterine lining, maintains bone density, regulates cholesterol", rationale: "Postmenopausal estrogen decline → osteoporosis, cardiovascular risk, hot flashes" },
      { front: "What is the function of testosterone?", back: "Primary male sex hormone: sperm production, muscle mass, bone density, secondary sex characteristics", rationale: "Produced by Leydig cells in testes. Small amounts produced by adrenal glands in females" },
      { front: "What does hCG indicate?", back: "Human chorionic gonadotropin — hormone produced by the placenta after implantation; basis of pregnancy tests", rationale: "Doubles every 48-72 hours in early pregnancy. Abnormal levels may indicate ectopic or molar pregnancy" },
      { front: "What is the function of the prostate gland?", back: "Produces alkaline fluid that makes up part of semen, protecting sperm from vaginal acidity", rationale: "Prostate enlargement (BPH) in older males → urinary retention, frequency, weak stream" },
      { front: "What are the phases of the menstrual cycle?", back: "1) Menstrual (Day 1-5) 2) Follicular (Day 1-13) 3) Ovulation (Day 14) 4) Luteal (Day 15-28)", rationale: "The luteal phase is always ~14 days. Cycle length varies due to follicular phase length" },
      { front: "What is menopause?", back: "Cessation of menstruation for 12 consecutive months, typically ages 45-55", rationale: "Symptoms: hot flashes, night sweats, vaginal dryness, mood changes, bone loss" },
    ],
  },
];

const electrolyteDecks2: SeedDeck[] = [
  {
    title: "Sodium Imbalances — Hyponatremia & Hypernatremia",
    slug: "sodium-imbalances-nursing",
    description: "Causes, symptoms, and nursing management of sodium disorders. Essential for NCLEX prep.",
    tags: ["electrolytes", "sodium", "fluid balance", "NCLEX"],
    cards: [
      { front: "What is the normal serum sodium range?", back: "135-145 mEq/L", rationale: "Sodium is the most abundant extracellular electrolyte and primary regulator of ECF volume" },
      { front: "What is hyponatremia?", back: "Serum sodium < 135 mEq/L", rationale: "Most common electrolyte imbalance in hospitalized patients" },
      { front: "What are causes of hyponatremia?", back: "SIADH, water intoxication, diuretics, heart failure, cirrhosis, vomiting, diarrhea", rationale: "Dilutional (too much water) vs. depletional (sodium loss)" },
      { front: "What are symptoms of hyponatremia?", back: "Confusion, lethargy, headache, nausea, seizures, muscle weakness, decreased LOC", rationale: "Severe (<120 mEq/L): seizures, coma, cerebral edema. Water shifts into brain cells" },
      { front: "What is the nursing priority for severe hyponatremia?", back: "Administer hypertonic saline (3% NS) slowly with frequent sodium monitoring", rationale: "Correct slowly (no more than 10-12 mEq/L in 24 hours). Rapid correction → osmotic demyelination syndrome" },
      { front: "What is hypernatremia?", back: "Serum sodium > 145 mEq/L", rationale: "Usually caused by water deficit rather than sodium excess" },
      { front: "What are causes of hypernatremia?", back: "Dehydration, diabetes insipidus, excessive sodium intake, watery diarrhea, fever, burns", rationale: "Water loss concentrates sodium. Assess intake/output and daily weights" },
      { front: "What are symptoms of hypernatremia?", back: "Thirst, dry mucous membranes, restlessness, tachycardia, low-grade fever, muscle twitching, seizures", rationale: "Water shifts out of cells → cellular dehydration. Brain cells shrink" },
      { front: "What is the treatment for hypernatremia?", back: "Administer hypotonic fluids (0.45% NS or D5W) to replace free water. Correct slowly", rationale: "Rapid correction can cause cerebral edema. Monitor sodium every 4-6 hours" },
      { front: "What is the role of ADH in sodium regulation?", back: "ADH causes water reabsorption in kidneys. Low ADH → dilute urine → hypernatremia (diabetes insipidus)", rationale: "SIADH = too much ADH → water retention → dilutional hyponatremia" },
    ],
  },
  {
    title: "Potassium Imbalances — Hypokalemia & Hyperkalemia",
    slug: "potassium-imbalances-nursing",
    description: "Critical potassium disorders with ECG changes, causes, and emergency nursing management.",
    tags: ["electrolytes", "potassium", "ECG", "cardiac", "NCLEX"],
    cards: [
      { front: "What is the normal serum potassium range?", back: "3.5-5.0 mEq/L", rationale: "Narrow range — even small changes can cause lethal cardiac arrhythmias" },
      { front: "What is hypokalemia?", back: "Serum potassium < 3.5 mEq/L", rationale: "Most dangerous effect: cardiac arrhythmias. Always check potassium before giving digoxin" },
      { front: "What are ECG changes in hypokalemia?", back: "Flattened T waves, ST depression, U waves, prolonged QT interval", rationale: "U waves are characteristic of hypokalemia. Risk of torsades de pointes" },
      { front: "What are causes of hypokalemia?", back: "Diuretics (loop, thiazide), vomiting, NG suction, diarrhea, alkalosis, insulin administration", rationale: "Alkalosis shifts K+ into cells. Always check K+ when giving insulin drips" },
      { front: "What is the maximum IV potassium infusion rate?", back: "10-20 mEq/hr via peripheral IV (40 mEq/hr via central line with cardiac monitoring)", rationale: "NEVER give IV potassium as a bolus push — causes cardiac arrest. Always dilute and infuse" },
      { front: "What is hyperkalemia?", back: "Serum potassium > 5.0 mEq/L", rationale: "Life-threatening at >6.5 mEq/L. Causes: renal failure, acidosis, tissue destruction, K+-sparing diuretics" },
      { front: "What are ECG changes in hyperkalemia?", back: "Peaked/tall T waves → widened QRS → sine wave pattern → V-fib/asystole", rationale: "Peaked T waves are the earliest sign. Sine wave is pre-arrest. Treat immediately" },
      { front: "What is the emergency treatment for severe hyperkalemia?", back: "1) Calcium gluconate (cardiac protection) 2) Insulin + glucose (shifts K+ into cells) 3) Sodium bicarb 4) Kayexalate 5) Dialysis", rationale: "Calcium gluconate stabilizes cardiac membrane but doesn't lower K+. Insulin+glucose works in minutes" },
      { front: "Why must you replace magnesium before potassium?", back: "Magnesium is required for potassium to enter cells. Without adequate Mg, K+ replacement is ineffective (refractory hypokalemia)", rationale: "Always check Mg level when K+ is low and not responding to replacement" },
      { front: "What foods are high in potassium?", back: "Bananas, oranges, potatoes, spinach, tomatoes, avocados, dried fruits, beans, dairy", rationale: "Teach patients on K+-wasting diuretics to eat potassium-rich foods" },
    ],
  },
  {
    title: "Calcium Imbalances — Hypocalcemia & Hypercalcemia",
    slug: "calcium-imbalances-nursing",
    description: "Calcium disorders, Chvostek/Trousseau signs, ECG changes, and nursing interventions.",
    tags: ["electrolytes", "calcium", "ECG", "NCLEX"],
    cards: [
      { front: "What is the normal serum calcium range?", back: "8.5-10.5 mg/dL (or ionized: 4.5-5.5 mg/dL)", rationale: "Ionized calcium is the active form. Total calcium must be corrected for albumin levels" },
      { front: "What is Chvostek's sign?", back: "Tapping the facial nerve (in front of ear) causes facial twitching — indicates hypocalcemia", rationale: "A positive sign suggests neuromuscular irritability from low calcium" },
      { front: "What is Trousseau's sign?", back: "Inflating a BP cuff causes carpal spasm (hand/wrist flexion) — indicates hypocalcemia", rationale: "More reliable than Chvostek's. Inflate cuff above systolic for 3 minutes" },
      { front: "What are symptoms of hypocalcemia?", back: "Muscle cramps, tetany, numbness/tingling (perioral, fingers), hyperactive reflexes, seizures, prolonged QT", rationale: "Severe cases: laryngospasm, bronchospasm, cardiac arrest" },
      { front: "What are causes of hypocalcemia?", back: "Hypoparathyroidism, thyroidectomy, renal failure, pancreatitis, vitamin D deficiency, blood transfusions (citrate binds Ca)", rationale: "Post-thyroidectomy: monitor for signs of hypocalcemia (parathyroids may be damaged)" },
      { front: "What is the treatment for acute hypocalcemia?", back: "IV calcium gluconate (preferred, less irritating) or calcium chloride. Cardiac monitoring required", rationale: "Give slowly — rapid IV calcium can cause cardiac arrest. Have crash cart available" },
      { front: "What are symptoms of hypercalcemia?", back: "Weakness, fatigue, constipation, confusion, polyuria, kidney stones, shortened QT, cardiac arrest", rationale: "Mnemonic: 'Stones, Bones, Groans, Moans, Psychiatric Overtones'" },
      { front: "What are causes of hypercalcemia?", back: "Hyperparathyroidism (#1), malignancy, prolonged immobilization, excessive vitamin D, thiazide diuretics", rationale: "Cancer causes hypercalcemia through bone metastasis or PTHrP secretion" },
      { front: "What is the treatment for hypercalcemia?", back: "IV normal saline hydration, loop diuretics (furosemide), calcitonin, bisphosphonates, dialysis if severe", rationale: "NS dilutes calcium and promotes renal excretion. Avoid thiazide diuretics (retain calcium)" },
      { front: "What is the relationship between calcium and phosphorus?", back: "Inverse relationship: when calcium rises, phosphorus falls (and vice versa)", rationale: "In renal failure: phosphorus rises → calcium drops → secondary hyperparathyroidism" },
    ],
  },
  {
    title: "Magnesium Imbalances — Hypomagnesemia & Hypermagnesemia",
    slug: "magnesium-imbalances-nursing",
    description: "Magnesium disorders, clinical significance, preeclampsia management, and nursing priorities.",
    tags: ["electrolytes", "magnesium", "OB", "NCLEX"],
    cards: [
      { front: "What is the normal serum magnesium range?", back: "1.5-2.5 mEq/L (or 1.8-3.0 mg/dL)", rationale: "Magnesium is critical for neuromuscular function and is closely linked to potassium and calcium" },
      { front: "What are causes of hypomagnesemia?", back: "Alcoholism, malnutrition, diuretics, diarrhea, DKA, pancreatitis, proton pump inhibitors (long-term)", rationale: "Alcoholism is the most common cause. Mg is depleted before symptoms appear" },
      { front: "What are symptoms of hypomagnesemia?", back: "Muscle weakness, tremors, tetany, seizures, cardiac arrhythmias, Chvostek/Trousseau positive", rationale: "Similar to hypocalcemia. Low Mg causes refractory hypokalemia and hypocalcemia" },
      { front: "What is the therapeutic range for magnesium sulfate in preeclampsia?", back: "4-7 mEq/L (therapeutic level for seizure prophylaxis)", rationale: "Given IV loading dose then continuous infusion. Monitor for toxicity" },
      { front: "What are signs of magnesium toxicity?", back: "Loss of DTRs (first sign), respiratory depression, bradycardia, hypotension, cardiac arrest", rationale: "DTR check every 1-2 hours. If absent reflexes → hold magnesium. Antidote: calcium gluconate" },
      { front: "What should you assess before giving magnesium sulfate?", back: "Deep tendon reflexes (DTRs), respiratory rate (≥12), urine output (≥30 mL/hr), level of consciousness", rationale: "Hold if: DTRs absent, RR <12, urine output <30 mL/hr. Keep calcium gluconate at bedside" },
      { front: "What are causes of hypermagnesemia?", back: "Renal failure (most common), excessive Mg intake (antacids, laxatives), IV magnesium overload", rationale: "Rare in patients with normal kidney function. Kidneys normally excrete excess Mg" },
      { front: "What is the antidote for magnesium toxicity?", back: "Calcium gluconate IV", rationale: "Antagonizes the effects of magnesium on cardiac and neuromuscular function" },
      { front: "Why does magnesium affect potassium levels?", back: "Mg is required for the Na+/K+-ATPase pump. Low Mg → K+ leaks out of cells → refractory hypokalemia", rationale: "Always replace magnesium first when treating hypokalemia that doesn't respond to K+ replacement" },
      { front: "What foods are high in magnesium?", back: "Dark leafy greens, nuts, seeds, whole grains, dark chocolate, avocados, beans", rationale: "Dietary education important for patients with chronic Mg depletion" },
    ],
  },
  {
    title: "Phosphorus Imbalances",
    slug: "phosphorus-imbalances-nursing",
    description: "Hypophosphatemia and hyperphosphatemia: causes, symptoms, and clinical management.",
    tags: ["electrolytes", "phosphorus", "renal", "NCLEX"],
    cards: [
      { front: "What is the normal serum phosphorus range?", back: "2.5-4.5 mg/dL", rationale: "Phosphorus is essential for ATP production, bone formation, and acid-base buffering" },
      { front: "What is the relationship between phosphorus and calcium?", back: "Inverse relationship: when phosphorus rises, calcium falls (and vice versa)", rationale: "Regulated by PTH and vitamin D. Critical to understand for renal failure management" },
      { front: "What are causes of hypophosphatemia?", back: "Refeeding syndrome, alcoholism, DKA treatment (insulin shifts PO4 into cells), antacids (bind phosphorus)", rationale: "Refeeding syndrome is the most tested cause — occurs when malnourished patients are fed too rapidly" },
      { front: "What are symptoms of hypophosphatemia?", back: "Muscle weakness, respiratory failure, confusion, seizures, reduced immunity, rhabdomyolysis", rationale: "Without phosphorus, cells cannot produce ATP — affects all organ systems" },
      { front: "What are causes of hyperphosphatemia?", back: "Renal failure (#1), tumor lysis syndrome, rhabdomyolysis, excessive intake, hypoparathyroidism", rationale: "Kidneys are primary excretors. When they fail, phosphorus accumulates" },
      { front: "What are symptoms of hyperphosphatemia?", back: "Symptoms of hypocalcemia (tetany, muscle cramps) due to inverse relationship + soft tissue calcification", rationale: "Calcium-phosphorus product >70 → calcium phosphate deposits in soft tissues" },
      { front: "What is the treatment for hyperphosphatemia?", back: "Phosphate binders (calcium carbonate, sevelamer) with meals, dietary phosphorus restriction, dialysis", rationale: "Phosphate binders prevent GI absorption. Take WITH meals to bind dietary phosphorus" },
      { front: "What is refeeding syndrome?", back: "Severe electrolyte shifts (low PO4, K+, Mg) when malnourished patients receive nutrition too rapidly", rationale: "Insulin surge drives PO4, K+, Mg into cells. Can cause cardiac arrest. Start feeds slowly" },
    ],
  },
  {
    title: "Fluid Volume Disorders",
    slug: "fluid-volume-disorders-nursing",
    description: "Fluid volume deficit and excess: assessment, interventions, and monitoring for nursing practice.",
    tags: ["electrolytes", "fluids", "assessment", "NCLEX"],
    cards: [
      { front: "What are signs of fluid volume deficit (dehydration)?", back: "Tachycardia, hypotension, dry mucous membranes, poor skin turgor, decreased urine output, elevated BUN/Cr ratio", rationale: "Weight loss: 1 L of water = 1 kg (2.2 lbs). Acute weight loss = fluid loss" },
      { front: "What are signs of fluid volume excess (overload)?", back: "Weight gain, edema, JVD, crackles (rales), dyspnea, bounding pulses, elevated BP, decreased hematocrit", rationale: "Common in heart failure and renal failure. Restrict fluids and sodium" },
      { front: "How is daily weight used to monitor fluid status?", back: "Weigh at same time daily, same clothing, same scale. 1 kg weight change = ~1 L fluid change", rationale: "Most accurate indicator of fluid status. More reliable than intake/output" },
      { front: "What is third-spacing?", back: "Fluid shifts from the intravascular space into interstitial or transcellular spaces (where it's not usable)", rationale: "Causes: burns, liver failure, pancreatitis, sepsis. Patient is edematous but intravascularly depleted" },
      { front: "What lab values indicate dehydration?", back: "Elevated BUN (>20:1 BUN:Cr ratio), elevated hematocrit, elevated sodium, elevated urine specific gravity (>1.030)", rationale: "Concentrated blood and urine indicate fluid deficit. BUN rises disproportionately to creatinine" },
      { front: "What is the priority nursing intervention for fluid overload?", back: "Elevate HOB, administer diuretics as ordered, restrict fluids and sodium, monitor I&O and daily weights", rationale: "Assess lung sounds for crackles. Monitor potassium with diuretic therapy" },
      { front: "What are isotonic fluid losses?", back: "Equal loss of water and sodium (hemorrhage, vomiting, diarrhea) — serum sodium stays normal", rationale: "Replace with isotonic fluids (0.9% NS, LR). Different from free water loss (hypernatremia)" },
      { front: "What is insensible fluid loss?", back: "Unnoticeable fluid loss through skin (perspiration) and lungs (respiration) — approximately 500-1000 mL/day", rationale: "Increases with fever, tachypnea, burns, and mechanical ventilation. Must account for in I&O" },
    ],
  },
];

const clinicalDecks: SeedDeck[] = [
  {
    title: "Heart Failure — Nursing Management",
    slug: "heart-failure-nursing-management",
    description: "HFrEF vs HFpEF, NYHA classification, medications, and nursing priorities for heart failure.",
    tags: ["cardiac", "heart failure", "pharmacology", "NCLEX"],
    cards: [
      { front: "What is the difference between HFrEF and HFpEF?", back: "HFrEF (systolic): EF <40%, weak contraction. HFpEF (diastolic): EF ≥50%, stiff ventricle, poor relaxation", rationale: "HFrEF = heart can't pump out enough. HFpEF = heart can't fill properly" },
      { front: "What are the NYHA heart failure classes?", back: "Class I: No limitation. Class II: Slight limitation. Class III: Marked limitation. Class IV: Symptoms at rest", rationale: "Guides treatment decisions. Class III-IV = advanced heart failure" },
      { front: "What are left-sided heart failure symptoms?", back: "Pulmonary symptoms: dyspnea, orthopnea, crackles, paroxysmal nocturnal dyspnea, pink frothy sputum", rationale: "Blood backs up into lungs. Assess lung sounds. Position in high Fowler's" },
      { front: "What are right-sided heart failure symptoms?", back: "Systemic congestion: JVD, peripheral edema, hepatomegaly, ascites, weight gain", rationale: "Blood backs up into systemic circulation. Often develops secondary to left-sided failure" },
      { front: "What medications are used in HFrEF?", back: "ACE inhibitors/ARBs, Beta-blockers (carvedilol, metoprolol), Aldosterone antagonists (spironolactone), Diuretics, Hydralazine/Nitrates", rationale: "ACEi + Beta-blocker + aldosterone antagonist = mortality benefit triad" },
      { front: "What is BNP and what does an elevated level indicate?", back: "B-type natriuretic peptide. BNP >100 pg/mL suggests heart failure", rationale: "Released when ventricles are stretched. Higher BNP = more severe HF. Used for diagnosis and monitoring" },
      { front: "What patient education is essential for heart failure?", back: "Daily weights, 2g sodium diet, fluid restriction, medication compliance, report weight gain >2 lbs/day or 5 lbs/week", rationale: "Weight gain = fluid retention. Activity as tolerated. Report worsening dyspnea immediately" },
      { front: "What is the action of digoxin in heart failure?", back: "Increases contractility (positive inotrope) and slows heart rate (negative chronotrope)", rationale: "Therapeutic level: 0.5-2.0 ng/mL. Hold if HR <60. Check potassium (hypokalemia increases toxicity)" },
      { front: "What are signs of digoxin toxicity?", back: "Nausea/vomiting, anorexia, visual disturbances (yellow-green halos), bradycardia, heart block", rationale: "Antidote: Digibind (digoxin immune fab). Risk increased with hypokalemia and renal impairment" },
      { front: "What is the role of diuretics in heart failure?", back: "Reduce fluid volume and relieve congestion symptoms (edema, dyspnea, crackles)", rationale: "Loop diuretics (furosemide) most common. Monitor K+, Na+, and renal function" },
    ],
  },
  {
    title: "Diabetes Management — Nursing Essentials",
    slug: "diabetes-management-nursing",
    description: "Type 1 vs Type 2, insulin types, DKA vs HHS, and blood glucose management for nursing.",
    tags: ["endocrine", "diabetes", "insulin", "pharmacology", "NCLEX"],
    cards: [
      { front: "What is the difference between Type 1 and Type 2 diabetes?", back: "Type 1: autoimmune destruction of beta cells, no insulin production, requires insulin. Type 2: insulin resistance, relative deficiency, managed with lifestyle + oral agents ± insulin", rationale: "Type 1: younger onset, ketosis-prone. Type 2: usually older, associated with obesity" },
      { front: "What is the onset, peak, and duration of rapid-acting insulin (lispro/aspart)?", back: "Onset: 10-15 min. Peak: 1-2 hrs. Duration: 3-4 hrs", rationale: "Give immediately before meals. Monitor for hypoglycemia at peak time" },
      { front: "What is the onset, peak, and duration of NPH insulin?", back: "Onset: 1-2 hrs. Peak: 4-12 hrs. Duration: 18-24 hrs", rationale: "Intermediate-acting. Cloudy appearance. Can be mixed with regular insulin (draw clear first)" },
      { front: "What is the onset of long-acting insulin (glargine/Lantus)?", back: "Onset: 1-2 hrs. No pronounced peak. Duration: 24 hrs", rationale: "Given once daily at same time. NEVER mix with other insulins. Clear solution" },
      { front: "What are the 3 P's of diabetes?", back: "Polyuria (frequent urination), Polydipsia (excessive thirst), Polyphagia (excessive hunger)", rationale: "Classic presenting symptoms, especially Type 1. Caused by hyperglycemia and osmotic diuresis" },
      { front: "What is DKA (Diabetic Ketoacidosis)?", back: "Life-threatening complication of Type 1 DM: hyperglycemia (>250), metabolic acidosis (pH <7.35), ketonemia, dehydration", rationale: "Kussmaul respirations (deep rapid breathing to blow off CO2). Fruity breath odor from ketones" },
      { front: "What is HHS (Hyperosmolar Hyperglycemic State)?", back: "Severe hyperglycemia (>600 mg/dL), hyperosmolarity, severe dehydration, NO significant ketosis", rationale: "More common in Type 2 DM. Higher mortality than DKA. Some insulin present prevents ketosis" },
      { front: "What is the treatment priority for DKA?", back: "1) IV fluids (NS) for dehydration 2) IV insulin drip 3) Potassium replacement (K+ drops as acidosis corrects) 4) Monitor glucose hourly", rationale: "Correct fluids first. Don't add dextrose until glucose <250. Check K+ before insulin (correct if <3.3)" },
      { front: "What are signs of hypoglycemia?", back: "Shakiness, sweating, tachycardia, anxiety, confusion, irritability, hunger, dizziness, seizures (if severe)", rationale: "Blood glucose <70 mg/dL. Treat with 15g fast-acting carbs, recheck in 15 min (Rule of 15)" },
      { front: "What is the HbA1c target for most diabetics?", back: "< 7% (reflects average blood glucose over 2-3 months)", rationale: "Pre-diabetes: 5.7-6.4%. Diabetes: ≥6.5%. Each 1% ≈ 30 mg/dL average glucose change" },
    ],
  },
  {
    title: "Sepsis & Shock — Recognition & Management",
    slug: "sepsis-shock-recognition-management",
    description: "Early sepsis recognition, sepsis bundles, shock types, and vasopressor management for nursing.",
    tags: ["sepsis", "shock", "critical care", "NCLEX"],
    cards: [
      { front: "What is SIRS (Systemic Inflammatory Response Syndrome)?", back: "2+ of: Temp >38°C or <36°C, HR >90, RR >20 or PaCO2 <32, WBC >12,000 or <4,000 or >10% bands", rationale: "SIRS is a nonspecific response. Sepsis = SIRS + suspected/confirmed infection" },
      { front: "What are the qSOFA criteria?", back: "Altered mental status (GCS <15), Systolic BP ≤100 mmHg, RR ≥22", rationale: "≥2 criteria suggests high risk for sepsis-related poor outcomes. Used for bedside screening" },
      { front: "What is included in the Hour-1 Sepsis Bundle?", back: "1) Measure lactate 2) Blood cultures before antibiotics 3) Broad-spectrum antibiotics 4) 30 mL/kg crystalloid for hypotension 5) Vasopressors if MAP <65 after fluids", rationale: "Time-sensitive. Every hour of delay in antibiotics increases mortality" },
      { front: "What is the MAP target in septic shock?", back: "MAP ≥ 65 mmHg", rationale: "MAP = (SBP + 2×DBP) / 3. Below 65 = inadequate organ perfusion" },
      { front: "What is the first-line vasopressor for septic shock?", back: "Norepinephrine (Levophed)", rationale: "Alpha-1 agonist → vasoconstriction → increased BP. Given via central line" },
      { front: "What are the 4 types of shock?", back: "Distributive (septic, anaphylactic, neurogenic), Cardiogenic (pump failure), Hypovolemic (volume loss), Obstructive (tamponade, PE)", rationale: "Distributive = vasodilation. Cardiogenic = low CO. Hypovolemic = low volume. Obstructive = blocked flow" },
      { front: "What is the earliest sign of shock?", back: "Tachycardia (compensatory mechanism to maintain cardiac output)", rationale: "Hypotension is a LATE sign. By the time BP drops, compensation has failed" },
      { front: "What lactate level indicates tissue hypoperfusion?", back: "Lactate > 2 mmol/L (>4 mmol/L indicates severe hypoperfusion)", rationale: "Goal: lactate clearance (decreasing levels with treatment). Trend is more important than single value" },
      { front: "What is the hemodynamic profile of septic shock?", back: "High CO (warm shock initially), Low SVR (vasodilation), Low CVP (relative hypovolemia)", rationale: "Early/warm phase: flushed, warm skin, bounding pulses. Late/cold phase: cool, mottled, thready pulses" },
      { front: "What nursing assessments are priority in sepsis?", back: "Vital signs q15-30min, mental status, urine output (>0.5 mL/kg/hr), lactate trends, end-organ function (BUN/Cr, LFTs)", rationale: "Report any decline immediately. Document time of recognition and interventions" },
    ],
  },
  {
    title: "Blood Transfusion — Types & Reactions",
    slug: "blood-transfusion-reactions-nursing",
    description: "Blood product administration, transfusion reactions, and emergency nursing interventions.",
    tags: ["hematology", "transfusion", "safety", "NCLEX"],
    cards: [
      { front: "What are the types of blood products?", back: "Packed RBCs (anemia), Fresh Frozen Plasma (clotting factors), Platelets (thrombocytopenia), Cryoprecipitate (fibrinogen), Albumin (volume expansion)", rationale: "PRBCs increase oxygen-carrying capacity. FFP replaces clotting factors in bleeding/DIC" },
      { front: "What must be verified before administering blood?", back: "Two nurse verification: patient ID (2 identifiers), blood type/Rh, crossmatch compatibility, expiration date, unit number", rationale: "Most fatal transfusion reactions are due to clerical errors (wrong patient/wrong blood)" },
      { front: "What IV solution is compatible with blood products?", back: "Only 0.9% Normal Saline", rationale: "D5W causes hemolysis. Lactated Ringer's contains calcium which causes clotting. No medications in blood line" },
      { front: "What is the first nursing action for a transfusion reaction?", back: "STOP the transfusion immediately. Keep the IV line open with NS", rationale: "Do not discard the blood bag — send it to the lab along with blood/urine samples" },
      { front: "What are signs of an acute hemolytic reaction?", back: "Fever, chills, flank/back pain, hypotension, hemoglobinuria (dark/red urine), DIC", rationale: "Most serious reaction. Caused by ABO incompatibility. Can be fatal within minutes" },
      { front: "What are signs of a febrile non-hemolytic reaction?", back: "Fever, chills, headache (without hemolysis)", rationale: "Most common reaction. Caused by antibodies to donor WBCs. Give acetaminophen, use leukocyte-reduced products" },
      { front: "What is TRALI (Transfusion-Related Acute Lung Injury)?", back: "Acute respiratory distress within 6 hours of transfusion: dyspnea, hypoxemia, bilateral pulmonary infiltrates", rationale: "Leading cause of transfusion-related death. Supportive care: oxygen, ventilation if needed" },
      { front: "What are signs of an allergic transfusion reaction?", back: "Urticaria (hives), itching, flushing. Severe: anaphylaxis (bronchospasm, hypotension)", rationale: "Mild: slow rate, give antihistamine. Severe: stop transfusion, epinephrine, maintain airway" },
      { front: "How long can a unit of blood hang?", back: "Must be completed within 4 hours of leaving blood bank. Infuse first 50 mL slowly over 15 minutes", rationale: "Stay with patient first 15 minutes. Monitor vitals: before, 15 min, 30 min, end, and 1 hour post" },
      { front: "What is the trigger for PRBC transfusion?", back: "Generally Hgb <7 g/dL (or <8-10 g/dL in cardiac patients or active bleeding)", rationale: "Restrictive transfusion strategy reduces complications. Each unit should raise Hgb ~1 g/dL" },
    ],
  },
  {
    title: "Delegation & Prioritization — NCLEX",
    slug: "delegation-prioritization-nclex",
    description: "Delegation rules, priority frameworks, and clinical decision-making for nursing exams.",
    tags: ["delegation", "prioritization", "NCLEX", "leadership"],
    cards: [
      { front: "What are the 5 Rights of Delegation?", back: "Right Task, Right Circumstance, Right Person, Right Direction/Communication, Right Supervision/Evaluation", rationale: "The RN is always responsible for assessment, planning, evaluation, and teaching — these cannot be delegated" },
      { front: "What tasks can be delegated to a UAP/CNA?", back: "Vital signs (stable patients), bathing, feeding, ambulation, toileting, I&O measurement, daily weights, specimen collection", rationale: "UAPs perform tasks that are routine, predictable, and don't require clinical judgment" },
      { front: "What can NEVER be delegated to a UAP?", back: "Assessment, Evaluation, Teaching, Nursing Judgment, Unstable patients, Initial/first-time tasks", rationale: "Mnemonic: 'AETNJU' — these require RN education and clinical judgment" },
      { front: "What can be delegated to an LPN/LVN?", back: "Medication administration (PO, IM, SubQ), wound care (stable), trach suctioning, catheterization, reinforcing teaching", rationale: "LPNs cannot: assess, develop care plans, give IV push meds, perform initial teaching, manage blood products" },
      { front: "How do you prioritize using ABCs?", back: "Airway first (obstruction, aspiration), then Breathing (respiratory distress, hypoxia), then Circulation (hemorrhage, shock)", rationale: "If a patient can talk, airway is patent. Actual breathing problems before circulation" },
      { front: "How does Maslow's hierarchy apply to nursing prioritization?", back: "Physiological needs first (oxygen, food, water, elimination), then Safety, Love/Belonging, Esteem, Self-actualization", rationale: "A patient with respiratory distress (physiological) takes priority over one with anxiety (safety/love)" },
      { front: "Acute vs Chronic: which patient is priority?", back: "Acute/new-onset symptoms take priority over chronic/expected findings", rationale: "New-onset chest pain > chronic stable angina. New confusion > baseline dementia" },
      { front: "Which patient should the RN see FIRST?", back: "The patient with unexpected/abnormal findings that require assessment and clinical judgment", rationale: "Expected post-op pain is lower priority than unexpected hypotension. Abnormal > Normal" },
      { front: "What is the priority when multiple patients deteriorate?", back: "Assess the patient at greatest risk for death first. Apply ABCs to determine order", rationale: "Airway obstruction > active hemorrhage > pain. Delegate stable tasks while managing critical ones" },
      { front: "When should you call the Rapid Response Team?", back: "Acute change in mental status, respiratory distress, new-onset chest pain, SBP <90 or >180, HR <40 or >130", rationale: "Trust your instincts: 'Something is wrong with my patient.' Better to call and be wrong than to delay" },
    ],
  },
];

const examReviewDecks: SeedDeck[] = [
  {
    title: "Electrolyte ECG Patterns",
    slug: "electrolyte-ecg-patterns",
    description: "Recognize ECG changes caused by electrolyte imbalances. High-yield for NCLEX and clinical practice.",
    tags: ["electrolytes", "ECG", "critical care", "NCLEX", "exam-review"],
    cards: [
      { front: "What ECG changes does hyperkalemia cause?", back: "Peaked T waves (earliest), widened QRS, flattened P waves, sine wave pattern (lethal), bradycardia, asystole", rationale: "Clinical pearl: Peaked T waves appear at K+ >5.5. Sine wave at >8.0 is a medical emergency. Exam trap: Peaked T waves are NOT the same as tall T waves in MI -- hyperkalemia T waves are narrow and symmetric." },
      { front: "What ECG changes does hypokalemia cause?", back: "Flattened T waves, ST depression, prominent U waves, prolonged QT interval, increased risk of torsades de pointes", rationale: "Clinical pearl: U waves are the hallmark of hypokalemia -- they appear after the T wave. Exam trap: U waves can be mistaken for a prolonged QT. Hypokalemia makes digoxin toxicity more likely." },
      { front: "What ECG changes does hypercalcemia cause?", back: "Shortened QT interval, widened T waves, Osborn (J) waves in severe cases, bradycardia", rationale: "Clinical pearl: Shortened QT is the opposite of hypocalcemia. Exam trap: Hypercalcemia does NOT cause peaked T waves -- that is hyperkalemia." },
      { front: "What ECG changes does hypocalcemia cause?", back: "Prolonged QT interval, flattened or inverted T waves, ST segment prolongation", rationale: "Clinical pearl: Prolonged QT increases risk of torsades de pointes. Exam trap: Chvostek and Trousseau signs are neuromuscular findings, not ECG findings." },
      { front: "What ECG changes does hypomagnesemia cause?", back: "Prolonged QT and PR intervals, T wave flattening, increased risk of atrial and ventricular dysrhythmias", rationale: "Clinical pearl: Hypomagnesemia often coexists with hypokalemia and must be corrected first -- potassium replacement fails without adequate magnesium. Exam trap: Must correct Mg2+ before K+ will respond to replacement." },
      { front: "What ECG changes does hypermagnesemia cause?", back: "Prolonged PR interval, widened QRS, bradycardia, heart block, cardiac arrest at very high levels (>10 mEq/L)", rationale: "Clinical pearl: Similar to hyperkalemia pattern because both slow cardiac conduction. Exam trap: Calcium gluconate is the antidote for symptomatic hypermagnesemia -- same as for hyperkalemia." },
      { front: "A patient with renal failure has K+ of 6.8 mEq/L. Which intervention provides the FASTEST cardiac protection?", back: "IV calcium gluconate (stabilizes cardiac membrane within 1-3 minutes)", rationale: "Clinical pearl: Calcium does NOT lower potassium -- it stabilizes the myocardium while you give insulin+glucose or other K+-lowering therapies. Exam trap: Kayexalate removes K+ but takes hours. Insulin+D50 shifts K+ intracellularly in 15-30 minutes but does not provide immediate cardiac protection." },
      { front: "Which electrolyte imbalance is most associated with torsades de pointes?", back: "Hypomagnesemia (and hypokalemia), both prolong QT interval", rationale: "Clinical pearl: Treatment of torsades is IV magnesium sulfate 1-2g, even if serum Mg2+ is normal. Exam trap: Standard antiarrhythmics can worsen torsades -- magnesium is first-line." },
      { front: "A patient on loop diuretics develops new U waves on ECG. What electrolyte should the nurse check FIRST?", back: "Potassium (hypokalemia causes U waves; loop diuretics waste potassium)", rationale: "Clinical pearl: Loop diuretics waste K+, Na+, and Mg2+. Exam trap: The question asks about ECG findings -- U waves point specifically to hypokalemia, not the other electrolytes also lost." },
      { front: "How do you differentiate hyperkalemia peaked T waves from acute MI tall T waves?", back: "Hyperkalemia: symmetric, narrow, tent-shaped T waves in ALL leads. MI: asymmetric, broad T waves in specific coronary territory leads", rationale: "Clinical pearl: Hyperkalemia is diffuse (all leads affected); MI is regional (specific leads based on coronary anatomy). Exam trap: Both can present with chest pain -- always check K+ level in acute chest pain workups." },
    ],
  },
  {
    title: "Acid-Base Compensation Patterns",
    slug: "acid-base-compensation-patterns",
    description: "Master ABG interpretation with compensation analysis. Essential for critical care and NCLEX.",
    tags: ["acid-base", "ABG", "respiratory", "critical care", "NCLEX", "exam-review"],
    cards: [
      { front: "What are the steps to interpret an ABG?", back: "1) Check pH (acidosis <7.35 or alkalosis >7.45), 2) Check PaCO2 (respiratory component), 3) Check HCO3- (metabolic component), 4) Determine primary disorder, 5) Check for compensation", rationale: "Clinical pearl: The component that matches the pH direction is the PRIMARY disorder. Exam trap: If pH is normal but PaCO2 and HCO3- are both abnormal, it is a mixed or fully compensated disorder -- check which value is most abnormal." },
      { front: "How does the respiratory system compensate for metabolic acidosis?", back: "Hyperventilation to blow off CO2 (Kussmaul respirations), lowering PaCO2", rationale: "Clinical pearl: Respiratory compensation is FAST (minutes to hours). Expected PaCO2 = (1.5 x HCO3-) + 8 (Winter formula). Exam trap: If actual PaCO2 differs from predicted, a second acid-base disorder exists." },
      { front: "How do the kidneys compensate for respiratory acidosis?", back: "Retain HCO3- and excrete H+ ions, raising serum bicarbonate", rationale: "Clinical pearl: Renal compensation is SLOW (24-72 hours). Acute: HCO3- rises 1 mEq/L per 10 mmHg rise in PaCO2. Chronic: HCO3- rises 3.5 per 10. Exam trap: If HCO3- is normal with high PaCO2, it is acute (not yet compensated)." },
      { front: "ABG: pH 7.28, PaCO2 55, HCO3- 26. What is the interpretation?", back: "Acute respiratory acidosis (uncompensated). High CO2 matches the acidosis. Normal HCO3- means kidneys have not yet compensated.", rationale: "Clinical pearl: Common causes include COPD exacerbation, opioid overdose, neuromuscular disease. Exam trap: If HCO3- were elevated (say 32), it would be chronic/partially compensated respiratory acidosis." },
      { front: "ABG: pH 7.50, PaCO2 28, HCO3- 24. What is the interpretation?", back: "Acute respiratory alkalosis (uncompensated). Low CO2 from hyperventilation matches alkalosis. Normal HCO3-.", rationale: "Clinical pearl: Common causes include anxiety/panic, pain, PE, early sepsis, mechanical overventilation. Exam trap: Anxiety is the most common cause on exams -- but rule out PE and sepsis in clinical scenarios." },
      { front: "ABG: pH 7.30, PaCO2 35, HCO3- 16. What is the interpretation?", back: "Metabolic acidosis with partial respiratory compensation. Low HCO3- is the primary disorder. PaCO2 is low-normal from compensatory hyperventilation.", rationale: "Clinical pearl: Calculate anion gap: Na+ - (Cl- + HCO3-). Normal 8-12. Elevated AG suggests DKA, lactic acidosis, renal failure, toxins (MUDPILES). Exam trap: Normal AG metabolic acidosis (hyperchloremic) suggests diarrhea, RTA, or saline overload." },
      { front: "What is the anion gap and how is it calculated?", back: "AG = Na+ - (Cl- + HCO3-). Normal: 8-12 mEq/L. Elevated AG indicates unmeasured acids (lactate, ketones, uremia, toxins).", rationale: "Clinical pearl: MUDPILES mnemonic for elevated AG: Methanol, Uremia, DKA, Propylene glycol, Isoniazid/Iron, Lactic acidosis, Ethylene glycol, Salicylates. Exam trap: An elevated AG with normal pH may indicate a mixed disorder (metabolic acidosis + metabolic alkalosis)." },
      { front: "A COPD patient has pH 7.37, PaCO2 58, HCO3- 33. What is the interpretation?", back: "Fully compensated chronic respiratory acidosis. High CO2 is baseline for COPD. Kidneys have retained bicarbonate to normalize pH.", rationale: "Clinical pearl: In COPD, the goal is NOT to normalize PaCO2 -- their baseline is elevated. Over-oxygenation can suppress hypoxic drive. Exam trap: A normal pH does NOT mean normal -- this patient is chronically ill with compensated disease." },
      { front: "What causes metabolic alkalosis?", back: "Vomiting/NG suction (HCl loss), diuretics (K+ and volume loss), excessive antacids, Cushing syndrome, hypokalemia", rationale: "Clinical pearl: Vomiting is the most common exam cause. Loss of HCl shifts balance toward alkalosis. Exam trap: Hypokalemia CAUSES metabolic alkalosis (H+ shifts into cells as K+ shifts out) and metabolic alkalosis CAUSES hypokalemia -- they perpetuate each other." },
      { front: "A patient with DKA has pH 7.18, PaCO2 22, HCO3- 8. Is compensation adequate?", back: "Apply Winter formula: expected PaCO2 = (1.5 x 8) + 8 = 20. Actual is 22, which is close -- compensation is appropriate.", rationale: "Clinical pearl: If actual PaCO2 is significantly higher than predicted, a concurrent respiratory acidosis exists. If lower, a concurrent respiratory alkalosis exists. Exam trap: You must calculate expected compensation to detect mixed disorders -- this is a common NCLEX critical thinking question." },
    ],
  },
  {
    title: "Shock Hemodynamic Profiles",
    slug: "shock-hemodynamic-profiles",
    description: "Differentiate shock types by hemodynamic parameters. Critical for exam questions and clinical practice.",
    tags: ["shock", "hemodynamics", "critical care", "NCLEX", "exam-review"],
    cards: [
      { front: "What are the hemodynamic findings in cardiogenic shock?", back: "Low CO/CI, High SVR, High PCWP/CVP, Low SvO2", rationale: "Clinical pearl: The heart is failing as a pump -- backup causes high filling pressures (PCWP elevated). Body compensates with vasoconstriction (high SVR). Exam trap: Giving fluids to cardiogenic shock WORSENS the condition (already fluid-overloaded)." },
      { front: "What are the hemodynamic findings in hypovolemic shock?", back: "Low CO/CI, High SVR, Low PCWP/CVP, Low SvO2", rationale: "Clinical pearl: Low filling pressures distinguish it from cardiogenic (both have low CO, high SVR). Treatment: volume resuscitation. Exam trap: Tachycardia is an early sign; hypotension is a LATE sign indicating 30-40% volume loss." },
      { front: "What are the hemodynamic findings in early (warm) septic shock?", back: "High CO/CI, Low SVR, Low-normal PCWP, High-normal SvO2", rationale: "Clinical pearl: Massive vasodilation (low SVR) causes relative hypovolemia despite adequate or high CO. Patient is warm, flushed, with bounding pulses. Exam trap: High CO in early sepsis is counterintuitive -- it is compensatory hyperdynamic response." },
      { front: "What are the hemodynamic findings in late (cold) septic shock?", back: "Low CO/CI, High SVR, Variable PCWP, Low SvO2", rationale: "Clinical pearl: Myocardial depression occurs from inflammatory mediators. Now resembles cardiogenic shock clinically (cool, mottled). Exam trap: Late septic shock has DIFFERENT hemodynamics than early -- do not assume all sepsis looks the same." },
      { front: "What are the hemodynamic findings in neurogenic shock?", back: "Low CO/CI, Low SVR, Low CVP/PCWP, Low-normal SvO2, with bradycardia (unlike other shock types)", rationale: "Clinical pearl: Loss of sympathetic tone causes vasodilation AND bradycardia. Unique feature: hypotension WITH bradycardia. Exam trap: All other shock types cause tachycardia -- neurogenic shock causes BRADYCARDIA." },
      { front: "What are the hemodynamic findings in obstructive shock?", back: "Low CO/CI, High SVR, High CVP (with cardiac tamponade/tension pneumo), equalized pressures in tamponade", rationale: "Clinical pearl: Mechanical obstruction prevents cardiac filling or ejection. Beck triad in tamponade: muffled heart sounds, JVD, hypotension. Exam trap: Obstructive shock requires removing the obstruction -- fluids and vasopressors alone will not fix it." },
      { front: "How do you differentiate cardiogenic from hypovolemic shock at the bedside?", back: "Cardiogenic: JVD present, crackles, S3 gallop, high CVP. Hypovolemic: flat neck veins, clear lungs, dry mucous membranes, low CVP", rationale: "Clinical pearl: Both have low CO and high SVR, but filling pressures differentiate them. Exam trap: Giving IV fluids to cardiogenic shock = worsens pulmonary edema. Giving diuretics to hypovolemic shock = worsens hypoperfusion." },
      { front: "What does a rising lactate level indicate in shock?", back: "Tissue hypoperfusion and anaerobic metabolism. Lactate >4 mmol/L indicates severe shock with high mortality.", rationale: "Clinical pearl: Lactate clearance (decrease by 20% in 2 hours) is a better prognostic marker than a single value. Exam trap: Lactate can be elevated without shock (metformin, liver failure, seizures) -- always correlate with clinical picture." },
      { front: "A patient has hypotension, JVD, muffled heart sounds, and pulsus paradoxus. What type of shock?", back: "Obstructive shock from cardiac tamponade (Beck triad + pulsus paradoxus)", rationale: "Clinical pearl: Pulsus paradoxus = SBP drop >10 mmHg during inspiration. Treatment: emergent pericardiocentesis. Exam trap: Tension pneumothorax also causes obstructive shock with JVD -- but has tracheal deviation and absent breath sounds on one side." },
      { front: "Which shock type has the HIGHEST cardiac output initially?", back: "Distributive (septic) shock -- in the early/warm phase, CO is elevated due to compensatory hyperdynamic response", rationale: "Clinical pearl: Despite high CO, tissue perfusion is impaired due to maldistribution of blood flow and mitochondrial dysfunction. Exam trap: High CO does NOT mean adequate perfusion -- sepsis disrupts oxygen utilization at the cellular level." },
    ],
  },
  {
    title: "Critical Lab Value Recognition",
    slug: "critical-lab-value-recognition",
    description: "Identify critical laboratory values that require immediate nursing action. Essential for patient safety and NCLEX.",
    tags: ["lab values", "critical care", "safety", "NCLEX", "exam-review"],
    cards: [
      { front: "What potassium level requires STAT notification?", back: "K+ <3.0 or >6.0 mEq/L (critical values). Normal: 3.5-5.0 mEq/L", rationale: "Clinical pearl: Both extremes cause fatal dysrhythmias. Check ECG immediately. Exam trap: Hemolyzed blood samples falsely elevate K+ -- if unexpected high K+, redraw before treating." },
      { front: "What sodium level is considered critical?", back: "Na+ <120 or >160 mEq/L (critical values). Normal: 135-145 mEq/L", rationale: "Clinical pearl: Severe hyponatremia (<120) causes cerebral edema and seizures. Correction must be slow (no more than 8-10 mEq/L per 24 hours). Exam trap: Rapid correction of chronic hyponatremia causes osmotic demyelination syndrome (central pontine myelinolysis)." },
      { front: "What glucose level requires immediate intervention?", back: "Glucose <50 mg/dL (severe hypoglycemia) or >500 mg/dL (DKA/HHS risk). Normal fasting: 70-100 mg/dL", rationale: "Clinical pearl: Hypoglycemia: give D50 IV if unconscious. Hyperglycemia >600 with altered mental status suggests HHS. Exam trap: Check glucose in ANY patient with altered mental status -- hypoglycemia mimics stroke." },
      { front: "What hemoglobin level typically triggers transfusion?", back: "Hgb <7 g/dL (restrictive threshold). <8-10 g/dL in cardiac patients or active hemorrhage. Normal: 12-16 (F), 14-18 (M)", rationale: "Clinical pearl: Tachycardia at rest is often the first sign of symptomatic anemia. Each unit of PRBCs raises Hgb approximately 1 g/dL. Exam trap: Chronic anemia may be well-tolerated at Hgb 7-8 due to compensation -- acute anemia at same level is dangerous." },
      { front: "What platelet count constitutes critical thrombocytopenia?", back: "Platelets <20,000 (risk of spontaneous bleeding). <50,000 (risk of surgical bleeding). Normal: 150,000-400,000", rationale: "Clinical pearl: Implement bleeding precautions: no IM injections, soft toothbrush, avoid rectal temps, fall prevention. Exam trap: HIT causes thrombocytopenia with THROMBOSIS, not bleeding -- despite low platelets." },
      { front: "What INR level indicates dangerous over-anticoagulation?", back: "INR >4.0 without bleeding = hold warfarin. INR >9.0 = vitamin K. Any INR with active bleeding = vitamin K + PCC/FFP. Normal: 0.8-1.2. Therapeutic on warfarin: 2.0-3.0", rationale: "Clinical pearl: INR of 5-9 without bleeding: hold warfarin 1-2 doses, may give vitamin K 1-2.5 mg PO. Exam trap: An elevated INR does NOT mean the patient IS bleeding -- but it means they CAN bleed easily." },
      { front: "What troponin level indicates myocardial infarction?", back: "Any troponin elevation above the 99th percentile of normal with rise/fall pattern indicates myocardial injury. Most assays: >0.04 ng/mL", rationale: "Clinical pearl: Troponin is the most specific cardiac biomarker. Peaks at 12-24 hours, remains elevated 7-14 days. Exam trap: Troponin can be elevated without MI (renal failure, PE, sepsis, myocarditis) -- clinical correlation required." },
      { front: "What lactate level indicates severe tissue hypoperfusion?", back: "Lactate >4 mmol/L indicates severe tissue hypoperfusion with high mortality. Normal: <2 mmol/L", rationale: "Clinical pearl: Lactate clearance (trending down) predicts survival better than absolute value. Exam trap: Lactate is not specific to sepsis -- it rises with any cause of tissue hypoxia including seizures, liver failure, and metformin." },
      { front: "What WBC count is critically abnormal?", back: "WBC <2,000 (severe neutropenia, infection risk) or >30,000 (severe infection, leukemia). Normal: 4,500-11,000", rationale: "Clinical pearl: Neutropenic precautions at ANC <500: reverse isolation, no fresh flowers/fruits, no rectal temps, hand hygiene. Exam trap: Left shift (high bands/immature WBCs) suggests acute bacterial infection even if total WBC is not markedly elevated." },
      { front: "A patient on heparin has aPTT of 150 seconds (therapeutic: 60-80). What is the priority action?", back: "STOP the heparin infusion immediately and notify the provider. Have protamine sulfate available.", rationale: "Clinical pearl: aPTT >2.5x control indicates dangerous anticoagulation. Monitor for bleeding. Exam trap: Do NOT give protamine unless there is active bleeding or per provider order -- sometimes stopping heparin and rechecking aPTT is sufficient." },
    ],
  },
  {
    title: "Emergency Drug Antidotes",
    slug: "emergency-drug-antidotes",
    description: "Know the antidotes for common overdoses and toxic exposures. Essential for emergency nursing and NCLEX.",
    tags: ["pharmacology", "emergency", "antidotes", "NCLEX", "exam-review"],
    cards: [
      { front: "What is the antidote for acetaminophen (Tylenol) overdose?", back: "N-acetylcysteine (NAC / Mucomyst)", rationale: "Clinical pearl: Most effective within 8 hours of ingestion. Replenishes glutathione to prevent hepatotoxicity. Exam trap: Acetaminophen toxicity causes liver failure, NOT kidney failure. Check LFTs, not just drug level." },
      { front: "What is the antidote for opioid overdose?", back: "Naloxone (Narcan)", rationale: "Clinical pearl: Short half-life (30-90 min) -- patient may re-sedate after naloxone wears off. May need repeated doses or continuous infusion. Exam trap: Naloxone can precipitate acute withdrawal in opioid-dependent patients (vomiting, agitation, seizures). Titrate to respiratory effort, not full consciousness." },
      { front: "What is the antidote for benzodiazepine overdose?", back: "Flumazenil (Romazicon)", rationale: "Clinical pearl: Use cautiously -- can precipitate seizures in chronic benzodiazepine users or patients with seizure disorders. Exam trap: Flumazenil is CONTRAINDICATED in patients who may have co-ingested tricyclic antidepressants (increases seizure risk)." },
      { front: "What is the antidote for warfarin over-anticoagulation?", back: "Vitamin K (phytonadione) for non-emergent reversal. 4-factor PCC or FFP for emergent/active bleeding.", rationale: "Clinical pearl: IV vitamin K works in 6-12 hours. PCC provides immediate factor replacement. Exam trap: Vitamin K reverses warfarin but has NO effect on heparin or DOACs -- each has its own reversal agent." },
      { front: "What is the antidote for heparin overdose?", back: "Protamine sulfate", rationale: "Clinical pearl: 1 mg protamine neutralizes 100 units of heparin given in the last 2-3 hours. Maximum single dose 50 mg. Exam trap: Protamine can cause hypotension, bradycardia, and anaphylaxis (especially in patients allergic to fish or who have had prior protamine exposure)." },
      { front: "What is the antidote for digoxin toxicity?", back: "Digoxin immune Fab (Digibind)", rationale: "Clinical pearl: Monitor for hypokalemia (increases digoxin toxicity) and hyperkalemia (which occurs WITH toxicity because digoxin inhibits Na+/K+ ATPase). Exam trap: Hold digoxin if HR <60 or K+ <3.5 mEq/L. Visual changes (yellow-green halos) and GI symptoms are early warning signs." },
      { front: "What is the antidote for beta-blocker overdose?", back: "Glucagon (first-line), high-dose insulin euglycemic therapy (HIET) for refractory cases", rationale: "Clinical pearl: Glucagon bypasses the beta receptor and stimulates cAMP directly to increase heart rate and contractility. Exam trap: Standard atropine and vasopressors often fail in severe beta-blocker toxicity -- glucagon works through a different pathway." },
      { front: "What is the antidote for organophosphate (pesticide) poisoning?", back: "Atropine (muscarinic blockade) + Pralidoxime/2-PAM (reactivates acetylcholinesterase)", rationale: "Clinical pearl: SLUDGE mnemonic: Salivation, Lacrimation, Urination, Defecation, GI distress, Emesis. Give atropine until secretions dry. Exam trap: Pralidoxime must be given early (within 24-48 hours) before aging of the enzyme complex makes it irreversible." },
      { front: "What is the antidote for magnesium sulfate toxicity?", back: "Calcium gluconate (10 mL of 10% solution IV over 3 minutes)", rationale: "Clinical pearl: Magnesium toxicity signs: absent DTRs (first sign), respiratory depression, cardiac arrest. Always check patellar reflexes before next MgSO4 dose. Exam trap: Loss of deep tendon reflexes occurs BEFORE respiratory depression -- stop MgSO4 and give calcium gluconate." },
      { front: "What is the antidote for methanol or ethylene glycol poisoning?", back: "Fomepizole (Antizol) -- inhibits alcohol dehydrogenase, preventing formation of toxic metabolites. Alternative: ethanol infusion.", rationale: "Clinical pearl: Methanol produces formic acid (blindness). Ethylene glycol produces oxalic acid (renal failure with calcium oxalate crystals). Exam trap: Both cause high anion gap metabolic acidosis with an osmolar gap -- the toxic alcohols themselves are not harmful until metabolized." },
    ],
  },
  {
    title: "Vital Sign Red Flag Patterns",
    slug: "vital-sign-red-flag-patterns",
    description: "Recognize dangerous vital sign combinations that indicate clinical deterioration. Essential for early recognition and NCLEX.",
    tags: ["assessment", "vital signs", "clinical judgment", "NCLEX", "exam-review"],
    cards: [
      { front: "A patient develops hypotension + tachycardia + narrowing pulse pressure. What does this indicate?", back: "Hypovolemic shock (hemorrhage or severe dehydration). Narrowing pulse pressure reflects decreasing stroke volume.", rationale: "Clinical pearl: Pulse pressure = SBP - DBP. Normal 30-40 mmHg. Narrowing indicates failing compensation. Exam trap: Tachycardia is the EARLIEST sign of hemorrhage; hypotension is a LATE sign (appears after 30% blood volume loss)." },
      { front: "A patient has hypertension + bradycardia + irregular respirations. What is this triad?", back: "Cushing triad -- indicating critically increased intracranial pressure (late, ominous sign)", rationale: "Clinical pearl: This is a medical emergency. The brain is herniating. Interventions: elevate HOB 30 degrees, hyperventilate, mannitol/hypertonic saline, emergent neurosurgery. Exam trap: Cushing triad is a LATE sign -- earlier signs include headache, altered LOC, and pupil changes." },
      { front: "A patient has widening pulse pressure with bounding pulses. What conditions cause this?", back: "Aortic regurgitation, thyrotoxicosis, early septic shock, anemia, exercise", rationale: "Clinical pearl: Wide pulse pressure = SBP - DBP >40. In early sepsis, vasodilation causes low DBP (wide pulse pressure, warm shock). Exam trap: Widening pulse pressure in a head injury patient indicates RISING ICP -- different mechanism from sepsis." },
      { front: "A patient has tachycardia + hypoxia + sudden pleuritic chest pain + hemoptysis. What is the likely emergency?", back: "Pulmonary embolism (PE)", rationale: "Clinical pearl: Risk factors: immobility, recent surgery, DVT, oral contraceptives, cancer. Exam trap: ABG in PE shows respiratory alkalosis (hyperventilation) and hypoxemia. Not all PEs have hemoptysis -- dyspnea and tachycardia are most common." },
      { front: "What do Kussmaul respirations (deep, rapid breathing) indicate?", back: "Metabolic acidosis -- the body compensates by blowing off CO2. Most commonly seen in DKA.", rationale: "Clinical pearl: Kussmaul respirations + fruity breath odor + polyuria + dehydration = DKA. Exam trap: Kussmaul breathing is a compensatory mechanism, not a respiratory disorder. Treating the underlying acidosis (insulin, fluids) resolves the breathing pattern." },
      { front: "A patient has fever + tachycardia + hypotension + altered mental status. What should you suspect?", back: "Sepsis progressing to septic shock. Meets qSOFA criteria. Activate sepsis protocol.", rationale: "Clinical pearl: Hour-1 bundle: lactate, blood cultures, broad-spectrum antibiotics, 30 mL/kg crystalloid, vasopressors if MAP <65 after fluids. Exam trap: The presence of all four findings suggests SEVERE sepsis. Do NOT wait for lab confirmation to start antibiotics." },
      { front: "What does a temperature below 36 degrees C (96.8 F) in a critically ill patient suggest?", back: "Hypothermia as a sign of severe sepsis, overdose, hypothyroidism, or exposure. In sepsis, hypothermia carries worse prognosis than fever.", rationale: "Clinical pearl: SIRS criteria include temp >38 OR <36 degrees C. Hypothermia in sepsis indicates immune system failure. Exam trap: Absence of fever does NOT rule out infection -- elderly and immunocompromised patients may be hypothermic with sepsis." },
      { front: "A trauma patient has distended neck veins, hypotension, and muffled heart sounds. What is the diagnosis?", back: "Cardiac tamponade (Beck triad). Blood in the pericardium compresses the heart, preventing filling.", rationale: "Clinical pearl: Emergent pericardiocentesis required. Also assess for pulsus paradoxus (SBP drop >10 mmHg on inspiration). Exam trap: Tension pneumothorax also causes JVD and hypotension but adds tracheal deviation and absent breath sounds -- different treatment (needle decompression)." },
      { front: "An obstetric patient has severe hypertension (>160/110), headache, visual changes, and hyperreflexia. What is the emergency?", back: "Severe preeclampsia with risk of eclampsia (seizures) or HELLP syndrome", rationale: "Clinical pearl: Give magnesium sulfate for seizure prophylaxis. Antihypertensives: labetalol or hydralazine. Monitor for HELLP: Hemolysis, Elevated Liver enzymes, Low Platelets. Exam trap: Preeclampsia occurs after 20 weeks gestation. If before 20 weeks, consider molar pregnancy or chronic hypertension." },
      { front: "A patient on an opioid PCA has respirations of 6/min with pinpoint pupils. What are the priority actions?", back: "Stop PCA immediately. Stimulate patient. Administer naloxone (Narcan). Maintain airway. Apply O2. Call rapid response.", rationale: "Clinical pearl: Sedation precedes respiratory depression -- sedation scoring catches problems before desaturation. Exam trap: Naloxone has a shorter half-life than most opioids -- patient may re-sedate. Monitor closely for 2-4 hours and consider naloxone infusion." },
    ],
  },
  {
    title: "Common Medication Mechanisms",
    slug: "common-medication-mechanisms",
    description: "Understand how high-yield medications work at the receptor level. Essential for pharmacology exams.",
    tags: ["pharmacology", "mechanisms", "NCLEX", "exam-review"],
    cards: [
      { front: "How do ACE inhibitors (lisinopril, enalapril) work?", back: "Block angiotensin-converting enzyme, preventing angiotensin I to angiotensin II conversion. Results in vasodilation, decreased aldosterone, reduced preload/afterload.", rationale: "Clinical pearl: Also decrease bradykinin breakdown, which causes the characteristic dry cough (10-15% of patients). Exam trap: ACEi are CONTRAINDICATED in pregnancy (teratogenic). Switch to ARB if cough is intolerable -- ARBs do NOT affect bradykinin." },
      { front: "How do beta-blockers (metoprolol, atenolol, propranolol) work?", back: "Block beta-adrenergic receptors. Beta-1 (heart): decrease HR, contractility, conduction. Beta-2 (lungs): can cause bronchoconstriction.", rationale: "Clinical pearl: Cardioselective (beta-1 selective): metoprolol, atenolol -- safer in asthma/COPD. Non-selective: propranolol -- affects both beta-1 and beta-2. Exam trap: Beta-blockers mask hypoglycemia symptoms in diabetics (tachycardia, tremor) -- sweating is preserved." },
      { front: "How do loop diuretics (furosemide/Lasix) work?", back: "Block Na-K-2Cl cotransporter in ascending loop of Henle. Prevent reabsorption of sodium, potassium, and chloride. Most potent diuretics.", rationale: "Clinical pearl: Monitor K+, Na+, Mg2+, Ca2+ (loops LOSE calcium). Can cause ototoxicity at high IV doses. Exam trap: Loops waste K+ -- potassium supplements or K+-sparing diuretic often co-prescribed. Furosemide + aminoglycoside = additive ototoxicity." },
      { front: "How does insulin lower blood glucose?", back: "Binds to insulin receptors on cells, activating GLUT4 transporters that move glucose from blood into cells. Also promotes glycogen synthesis and inhibits gluconeogenesis.", rationale: "Clinical pearl: Insulin also shifts K+ INTO cells -- this is why insulin+D50 is used to treat hyperkalemia. Exam trap: Always check K+ before giving insulin. Insulin-induced hypokalemia can cause fatal dysrhythmias." },
      { front: "How do SSRIs (fluoxetine, sertraline, escitalopram) work?", back: "Selectively block serotonin reuptake at the presynaptic neuron, increasing serotonin availability in the synaptic cleft.", rationale: "Clinical pearl: Takes 2-6 weeks for full therapeutic effect. Initially may INCREASE anxiety and suicidal ideation in young adults (black box warning). Exam trap: Do NOT combine SSRIs with MAOIs or tramadol -- risk of serotonin syndrome (hyperthermia, rigidity, myoclonus, altered mental status)." },
      { front: "How does nitroglycerin work?", back: "Converted to nitric oxide, which relaxes vascular smooth muscle. Primarily venous dilation (decreases preload). Also coronary artery dilation.", rationale: "Clinical pearl: Give sublingual q5min x3 for chest pain. Causes headache and hypotension. Exam trap: CONTRAINDICATED within 24-48 hours of PDE5 inhibitors (sildenafil/Viagra) -- severe hypotension. Also contraindicated in right ventricular MI (preload-dependent)." },
      { front: "How do proton pump inhibitors (omeprazole, pantoprazole) work?", back: "Irreversibly block the H+/K+ ATPase pump (proton pump) on gastric parietal cells, inhibiting gastric acid secretion.", rationale: "Clinical pearl: Most effective if taken 30-60 min before first meal. Take up to 3-5 days for full effect. Exam trap: Long-term PPI use increases risk of C. difficile, bone fractures, B12 deficiency, and hypomagnesemia. They also interfere with clopidogrel (Plavix) absorption -- use pantoprazole if on Plavix." },
      { front: "How does metformin work?", back: "Decreases hepatic glucose production, increases insulin sensitivity, and decreases intestinal absorption of glucose. Does NOT stimulate insulin secretion.", rationale: "Clinical pearl: First-line for Type 2 DM. Weight-neutral or causes slight weight loss. Exam trap: Hold metformin 48 hours before and after IV contrast dye (risk of lactic acidosis). Contraindicated in eGFR <30. GI side effects (diarrhea) are common initially." },
      { front: "How do statins (atorvastatin, rosuvastatin) work?", back: "Inhibit HMG-CoA reductase, blocking cholesterol synthesis in the liver. Upregulate LDL receptors, increasing LDL clearance from blood.", rationale: "Clinical pearl: Take at bedtime (cholesterol synthesis peaks at night) -- except atorvastatin and rosuvastatin which have long half-lives. Exam trap: Monitor LFTs and for rhabdomyolysis (muscle pain, dark urine, elevated CK). Risk increases with concurrent grapefruit juice or gemfibrozil." },
      { front: "How does epinephrine work in anaphylaxis?", back: "Alpha-1: vasoconstriction (reverses hypotension, reduces angioedema). Beta-1: increases HR and contractility. Beta-2: bronchodilation (reverses bronchospasm).", rationale: "Clinical pearl: IM injection into lateral thigh (vastus lateralis) is preferred. 0.3-0.5 mg of 1:1000 (adult). Can repeat every 5-15 min. Exam trap: Epi is the FIRST-LINE drug in anaphylaxis, NOT antihistamines. Diphenhydramine and steroids are adjuncts, not replacements." },
    ],
  },
];

const allDecks = [
  ...preNursingDecks,
  ...preNursingDecks2,
  ...apDecks,
  ...apDecks2,
  ...electrolyteDecks,
  ...electrolyteDecks2,
  ...clinicalDecks,
  ...examReviewDecks,
];

export async function seedStudyDecks(pool: Pool) {
  try {
    const existing = await pool.query(
      `SELECT COUNT(*)::int as count FROM flashcard_decks WHERE owner_id = $1`,
      [SYSTEM_USER_ID]
    );
    if (existing.rows[0].count >= allDecks.length) {
      console.log(`[Seed] ${existing.rows[0].count} system decks already exist, skipping seed`);
      return;
    }

    let systemUser = await pool.query(`SELECT id FROM users WHERE id = $1`, [SYSTEM_USER_ID]);
    if (systemUser.rows.length === 0) {
      const existingByName = await pool.query(`SELECT id FROM users WHERE username = $1`, ["NurseNest"]);
      if (existingByName.rows.length > 0) {
        const realId = existingByName.rows[0].id;
        console.log(`[Seed] Using existing NurseNest user: ${realId}`);
        const deckCount = await pool.query(
          `SELECT COUNT(*)::int as count FROM flashcard_decks WHERE owner_id = $1`,
          [realId]
        );
        if (deckCount.rows[0].count >= allDecks.length) {
          console.log(`[Seed] ${deckCount.rows[0].count} decks already exist for NurseNest, skipping`);
          return;
        }
        for (const deck of allDecks) {
          const ed = await pool.query(`SELECT id FROM flashcard_decks WHERE slug = $1`, [deck.slug]);
          if (ed.rows.length > 0) continue;
          const dr = await pool.query(
            `INSERT INTO flashcard_decks (title, slug, description, owner_id, visibility, tags, is_upgraded, upgraded_limit)
             VALUES ($1, $2, $3, $4, $5, $6::jsonb, true, 500) RETURNING id`,
            [deck.title, deck.slug, deck.description, realId, "public", JSON.stringify(deck.tags)]
          );
          for (let i = 0; i < deck.cards.length; i++) {
            const c = deck.cards[i];
            await pool.query(
              `INSERT INTO deck_flashcards (deck_id, front, back, rationale) VALUES ($1, $2, $3, $4)`,
              [dr.rows[0].id, c.front, c.back, c.rationale || null]
            );
          }
          console.log(`[Seed] Created deck: ${deck.title} (${deck.cards.length} cards)`);
        }
        console.log(`[Seed] Study deck seeding complete.`);
        return;
      }
      await pool.query(
        `INSERT INTO users (id, username, password, tier, subscription_status)
         VALUES ($1, $2, $3, $4, $5)`,
        [SYSTEM_USER_ID, "NurseNest-System", "system-no-login", "admin", "active"]
      );
    }

    for (const deck of allDecks) {
      const existingDeck = await pool.query(
        `SELECT id FROM flashcard_decks WHERE slug = $1`,
        [deck.slug]
      );
      if (existingDeck.rows.length > 0) continue;

      const deckResult = await pool.query(
        `INSERT INTO flashcard_decks (title, slug, description, owner_id, visibility, tags, is_upgraded, upgraded_limit)
         VALUES ($1, $2, $3, $4, $5, $6::jsonb, true, 500)
         RETURNING id`,
        [deck.title, deck.slug, deck.description, SYSTEM_USER_ID, "public", JSON.stringify(deck.tags)]
      );
      const deckId = deckResult.rows[0].id;

      for (let i = 0; i < deck.cards.length; i++) {
        const card = deck.cards[i];
        await pool.query(
          `INSERT INTO deck_flashcards (deck_id, front, back, rationale)
           VALUES ($1, $2, $3, $4)`,
          [deckId, card.front, card.back, card.rationale || null]
        );
      }

      console.log(`[Seed] Created deck: ${deck.title} (${deck.cards.length} cards)`);
    }

    console.log(`[Seed] Study deck seeding complete. ${allDecks.length} decks processed.`);
  } catch (error) {
    console.error("[Seed] Error seeding study decks:", error);
  }
}
