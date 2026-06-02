export interface ComparisonRow {
  category: string;
  conditionA: string;
  conditionB: string;
}

export interface ComparisonPracticeQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  rationale: string;
}

export interface ClinicalComparison {
  slug: string;
  conditionA: string;
  conditionB: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  introduction: string;
  pathophysiologyA: string;
  pathophysiologyB: string;
  rows: ComparisonRow[];
  nursingInterventionsA: string[];
  nursingInterventionsB: string[];
  examTips: string[];
  practiceQuestions: ComparisonPracticeQuestion[];
  faq: { question: string; answer: string }[];
  relatedSlugs: string[];
}

export const clinicalComparisons: ClinicalComparison[] = [
  {
    slug: "dka-vs-hhs",
    conditionA: "Diabetic Ketoacidosis (DKA)",
    conditionB: "Hyperosmolar Hyperglycemic State (HHS)",
    title: "DKA vs HHS: Clinical Comparison for Nursing Students",
    metaTitle: "DKA vs HHS Comparison | Pathophysiology, Labs & Nursing Care",
    metaDescription: "Compare DKA and HHS side-by-side: pathophysiology, signs and symptoms, lab values, medications, nursing interventions, and NCLEX exam tips for nursing students.",
    keywords: "DKA vs HHS, diabetic ketoacidosis vs hyperosmolar hyperglycemic state, DKA HHS comparison nursing, NCLEX DKA HHS",
    introduction: "Diabetic Ketoacidosis (DKA) and Hyperosmolar Hyperglycemic State (HHS) are both life-threatening diabetic emergencies characterized by severe hyperglycemia, but they differ significantly in pathophysiology, clinical presentation, and laboratory findings. Understanding these differences is critical for nursing students, as NCLEX and clinical exams frequently test the ability to distinguish between these two conditions and apply the correct interventions.",
    pathophysiologyA: "DKA occurs primarily in Type 1 diabetes due to absolute insulin deficiency. Without insulin, cells cannot utilize glucose, triggering lipolysis. Free fatty acids are converted to ketone bodies (acetoacetate, beta-hydroxybutyrate, acetone) in the liver. Accumulation of ketoacids causes metabolic acidosis with an elevated anion gap. Hyperglycemia causes osmotic diuresis leading to dehydration and electrolyte losses. DKA develops rapidly, typically within 24 hours.",
    pathophysiologyB: "HHS occurs primarily in Type 2 diabetes where there is enough residual insulin to prevent ketogenesis but not enough to prevent hyperglycemia. Blood glucose rises dramatically (often >600 mg/dL) causing severe osmotic diuresis, profound dehydration, and hyperosmolality. Without significant ketone production, acidosis is absent or mild. HHS develops gradually over days to weeks, resulting in more severe dehydration and higher mortality than DKA.",
    rows: [
      { category: "Typical Diabetes Type", conditionA: "Type 1 (absolute insulin deficiency)", conditionB: "Type 2 (relative insulin deficiency)" },
      { category: "Onset", conditionA: "Rapid (hours to <24 hours)", conditionB: "Gradual (days to weeks)" },
      { category: "Blood Glucose", conditionA: ">250 mg/dL (usually 300-800)", conditionB: ">600 mg/dL (often >1000)" },
      { category: "Serum pH", conditionA: "<7.35 (acidotic)", conditionB: ">7.30 (normal or mildly acidotic)" },
      { category: "Serum Ketones", conditionA: "Positive (elevated)", conditionB: "Negative or trace" },
      { category: "Serum Osmolality", conditionA: "Variable (usually <320 mOsm/kg)", conditionB: ">320 mOsm/kg (often >350)" },
      { category: "Anion Gap", conditionA: "Elevated (>12)", conditionB: "Normal or slightly elevated" },
      { category: "Dehydration", conditionA: "Moderate (3-6L deficit)", conditionB: "Severe (8-12L deficit)" },
      { category: "Kussmaul Respirations", conditionA: "Present (compensatory for acidosis)", conditionB: "Absent" },
      { category: "Fruity Breath Odor", conditionA: "Present (acetone)", conditionB: "Absent" },
      { category: "Mental Status", conditionA: "Alert to obtunded", conditionB: "Frequently obtunded to comatose" },
      { category: "Mortality Rate", conditionA: "1-5%", conditionB: "10-20% (higher due to age and comorbidities)" },
      { category: "Primary Treatment", conditionA: "IV insulin + fluids + electrolytes", conditionB: "Aggressive IV fluid replacement + insulin" },
      { category: "Potassium Monitoring", conditionA: "Critical (shifts with insulin and acidosis)", conditionB: "Important but less volatile" },
    ],
    nursingInterventionsA: [
      "Initiate continuous IV insulin drip as ordered (typically 0.1 units/kg/hr)",
      "Check potassium BEFORE starting insulin — replace if K+ <3.3 mEq/L",
      "Administer isotonic IV fluids (0.9% NS) for initial volume resuscitation",
      "Monitor blood glucose every 1 hour; add D5W when glucose reaches 200-250 mg/dL",
      "Monitor serum potassium every 1-2 hours during insulin infusion",
      "Assess for Kussmaul respirations and fruity breath odor",
      "Monitor ABG for pH correction and anion gap closure",
      "Maintain strict I&O; monitor for fluid overload",
      "Do NOT stop insulin when glucose normalizes — continue until anion gap closes",
    ],
    nursingInterventionsB: [
      "Initiate aggressive IV fluid resuscitation (0.9% NS initially, may need 6-12L)",
      "Administer IV insulin after initial fluid bolus (lower dose than DKA)",
      "Monitor serum osmolality and mental status frequently",
      "Monitor blood glucose every 1 hour; switch to D5 half-NS when glucose reaches 250-300 mg/dL",
      "Assess neurological status frequently (confusion, seizures, coma)",
      "Monitor for signs of cerebral edema with rapid fluid correction",
      "Replace electrolytes (potassium, sodium, phosphate) as indicated",
      "Implement fall precautions and seizure precautions",
      "Monitor for thromboembolism (HHS increases clotting risk)",
    ],
    examTips: [
      "DKA = acidosis + ketones + Kussmaul respirations + fruity breath. HHS = NO acidosis, NO ketones, profound dehydration",
      "Check potassium BEFORE insulin in DKA — hypokalemia kills before hyperglycemia",
      "HHS has HIGHER mortality than DKA despite less dramatic presentation",
      "DKA: do NOT stop insulin when glucose normalizes — add dextrose and continue until anion gap closes",
      "HHS priority is FLUIDS first, then insulin. DKA priority is insulin AND fluids simultaneously",
      "DKA onset is rapid (hours); HHS onset is gradual (days to weeks)",
    ],
    practiceQuestions: [
      {
        question: "A patient presents with blood glucose 850 mg/dL, pH 7.38, negative ketones, and serum osmolality 345 mOsm/kg. Which condition does this most likely represent?",
        options: ["Diabetic Ketoacidosis (DKA)", "Hyperosmolar Hyperglycemic State (HHS)", "Metabolic acidosis", "Diabetic nephropathy"],
        correctIndex: 1,
        rationale: "HHS is characterized by extreme hyperglycemia (>600 mg/dL), normal or near-normal pH (no acidosis), negative or trace ketones, and elevated serum osmolality (>320 mOsm/kg). DKA would present with acidosis (pH <7.35) and positive ketones."
      },
      {
        question: "What is the priority nursing intervention before starting an insulin drip in a patient with DKA?",
        options: ["Obtain a 12-lead ECG", "Check serum potassium level", "Insert a Foley catheter", "Administer sodium bicarbonate"],
        correctIndex: 1,
        rationale: "Potassium must be checked before starting insulin in DKA. Insulin drives potassium intracellularly, and if the patient is already hypokalemic (<3.3 mEq/L), starting insulin could cause fatal cardiac arrhythmias. Potassium must be replaced first."
      },
      {
        question: "A patient in DKA has a blood glucose of 220 mg/dL. The nurse should anticipate which order?",
        options: ["Discontinue the insulin drip", "Add dextrose to the IV fluids and continue insulin", "Switch to subcutaneous insulin immediately", "Administer an oral hypoglycemic agent"],
        correctIndex: 1,
        rationale: "In DKA, insulin must continue until the anion gap closes and ketoacidosis resolves, regardless of blood glucose. When glucose approaches 200-250 mg/dL, dextrose is added to IV fluids to prevent hypoglycemia while continuing insulin therapy."
      },
    ],
    faq: [
      { question: "What is the main difference between DKA and HHS?", answer: "The key difference is that DKA involves metabolic acidosis with ketone production (due to absolute insulin deficiency in Type 1 diabetes), while HHS involves extreme hyperglycemia and dehydration WITHOUT significant acidosis or ketones (in Type 2 diabetes). DKA presents with Kussmaul respirations and fruity breath; HHS does not." },
      { question: "Why does HHS have a higher mortality rate than DKA?", answer: "HHS has a mortality rate of 10-20% compared to DKA's 1-5%. This is because HHS patients are typically older with more comorbidities, the onset is gradual leading to more severe dehydration (8-12L deficit), and the extreme hyperosmolality causes more severe neurological complications including seizures and coma." },
      { question: "Can a patient have both DKA and HHS?", answer: "Yes, overlap syndromes exist where patients present with features of both conditions — significant hyperglycemia with hyperosmolality AND acidosis with ketones. This is treated by addressing both the acidosis and dehydration aggressively." },
    ],
    relatedSlugs: ["type-1-vs-type-2-diabetes", "stable-vs-unstable-angina"],
  },
  {
    slug: "crohns-vs-ulcerative-colitis",
    conditionA: "Crohn's Disease",
    conditionB: "Ulcerative Colitis",
    title: "Crohn's Disease vs Ulcerative Colitis: Clinical Comparison",
    metaTitle: "Crohn's vs UC Comparison | Pathophysiology, Labs & Nursing Care",
    metaDescription: "Compare Crohn's disease and ulcerative colitis side-by-side: pathophysiology, clinical features, diagnostics, medications, nursing interventions, and NCLEX tips.",
    keywords: "Crohn's vs ulcerative colitis, IBD comparison nursing, Crohn's disease vs UC, inflammatory bowel disease NCLEX",
    introduction: "Crohn's disease and ulcerative colitis are the two main types of inflammatory bowel disease (IBD). While both cause chronic intestinal inflammation, they differ in location, depth of involvement, clinical features, and complications. Distinguishing between them is essential for nursing practice and frequently tested on NCLEX examinations.",
    pathophysiologyA: "Crohn's disease is a chronic transmural inflammatory condition that can affect ANY part of the GI tract from mouth to anus, though it most commonly involves the terminal ileum and proximal colon. Inflammation is transmural (full-thickness), affecting all layers of the bowel wall. It presents in a discontinuous pattern with 'skip lesions' — areas of diseased bowel separated by normal segments. Granulomas are a hallmark finding. Transmural inflammation leads to fistulas, abscesses, and strictures.",
    pathophysiologyB: "Ulcerative colitis is a chronic inflammatory condition limited to the colon and rectum. Inflammation begins in the rectum and extends proximally in a continuous pattern — there are no skip lesions. Inflammation is superficial, affecting only the mucosa and submucosa (not transmural). The inflammatory process causes mucosal ulceration, friability, and pseudopolyp formation. Toxic megacolon is a life-threatening complication.",
    rows: [
      { category: "Location", conditionA: "Anywhere from mouth to anus (most common: terminal ileum)", conditionB: "Colon and rectum only" },
      { category: "Distribution Pattern", conditionA: "Discontinuous (skip lesions)", conditionB: "Continuous (starts at rectum, extends proximally)" },
      { category: "Depth of Inflammation", conditionA: "Transmural (full-thickness)", conditionB: "Mucosal and submucosal only" },
      { category: "Rectal Involvement", conditionA: "Often spared", conditionB: "Always involved" },
      { category: "Stool Pattern", conditionA: "Diarrhea (usually non-bloody)", conditionB: "Bloody diarrhea with mucus" },
      { category: "Abdominal Pain", conditionA: "Right lower quadrant (colicky)", conditionB: "Left lower quadrant (crampy)" },
      { category: "Fistulas", conditionA: "Common (transmural inflammation)", conditionB: "Rare" },
      { category: "Strictures", conditionA: "Common", conditionB: "Rare" },
      { category: "Granulomas", conditionA: "Present (non-caseating)", conditionB: "Absent" },
      { category: "Cobblestone Appearance", conditionA: "Present", conditionB: "Absent" },
      { category: "Toxic Megacolon Risk", conditionA: "Rare", conditionB: "Significant risk" },
      { category: "Colorectal Cancer Risk", conditionA: "Slightly increased", conditionB: "Significantly increased (after 8-10 years)" },
      { category: "Surgical Cure", conditionA: "No (recurrence after surgery)", conditionB: "Yes (total colectomy is curative)" },
      { category: "Nutritional Deficiencies", conditionA: "Common (B12, iron, fat-soluble vitamins)", conditionB: "Less common (iron deficiency from blood loss)" },
    ],
    nursingInterventionsA: [
      "Monitor for signs of fistula formation (perianal drainage, skin breakdown)",
      "Assess nutritional status — malabsorption is common (B12, iron, fat-soluble vitamins)",
      "Administer TPN if bowel rest is required during acute flares",
      "Monitor for stricture symptoms (cramping, distension, vomiting)",
      "Educate on smoking cessation — smoking worsens Crohn's disease",
      "Administer immunosuppressants and biologics as ordered",
      "Assess for perianal complications and provide skin care",
    ],
    nursingInterventionsB: [
      "Monitor stool frequency, consistency, and presence of blood",
      "Assess for signs of toxic megacolon (abdominal distension, fever, tachycardia)",
      "Prepare for potential colectomy if refractory to medical management",
      "Administer 5-ASA medications (mesalamine) as first-line therapy",
      "Screen for colorectal cancer after 8-10 years of disease",
      "Monitor for iron deficiency anemia from chronic blood loss",
      "Educate that smoking may actually be protective in UC (but not recommended)",
    ],
    examTips: [
      "Crohn's = skip lesions, transmural, fistulas, cobblestoning, terminal ileum. UC = continuous, mucosal only, bloody diarrhea, rectum always involved",
      "Crohn's: right lower quadrant pain. UC: left lower quadrant pain",
      "Only UC can be cured by surgery (total colectomy). Crohn's recurs after surgery",
      "Toxic megacolon = UC complication (dilated colon >6 cm, risk of perforation)",
      "Smoking worsens Crohn's but may be protective in UC (still not recommended)",
      "UC has higher colorectal cancer risk — screen with colonoscopy after 8-10 years",
    ],
    practiceQuestions: [
      {
        question: "A patient with inflammatory bowel disease reports right lower quadrant pain and non-bloody diarrhea. Colonoscopy shows skip lesions and cobblestoning. Which diagnosis is most likely?",
        options: ["Ulcerative colitis", "Crohn's disease", "Irritable bowel syndrome", "Diverticulitis"],
        correctIndex: 1,
        rationale: "Crohn's disease is characterized by right lower quadrant pain (terminal ileum involvement), non-bloody diarrhea, skip lesions (discontinuous inflammation), and cobblestone appearance of the mucosa. UC presents with continuous inflammation starting at the rectum and bloody diarrhea."
      },
      {
        question: "Which complication is most associated with ulcerative colitis?",
        options: ["Perianal fistulas", "Toxic megacolon", "Bowel strictures", "Malabsorption of B12"],
        correctIndex: 1,
        rationale: "Toxic megacolon is a life-threatening complication most associated with ulcerative colitis. It involves massive dilation of the colon (>6 cm) with risk of perforation. Fistulas, strictures, and B12 malabsorption are more characteristic of Crohn's disease."
      },
      {
        question: "A patient with UC asks about surgical options. The nurse explains that total colectomy can:",
        options: ["Temporarily reduce symptoms", "Cure the disease", "Prevent all future GI problems", "Only be performed laparoscopically"],
        correctIndex: 1,
        rationale: "Total colectomy is curative for ulcerative colitis because UC is limited to the colon. Removing the entire colon eliminates the disease. This is NOT true for Crohn's disease, which can affect any part of the GI tract and recurs after surgery."
      },
    ],
    faq: [
      { question: "What is the difference between Crohn's and UC?", answer: "Crohn's disease can affect any part of the GI tract with transmural (full-thickness) inflammation in a discontinuous pattern. Ulcerative colitis is limited to the colon and rectum with superficial (mucosal) inflammation in a continuous pattern. Crohn's causes fistulas and strictures; UC causes bloody diarrhea and toxic megacolon risk." },
      { question: "Which is worse, Crohn's or UC?", answer: "Neither is universally 'worse' — they present different challenges. Crohn's can cause malnutrition and complications like fistulas throughout the GI tract but is not curable by surgery. UC carries a higher colorectal cancer risk but can be cured by colectomy. Severity varies greatly between individuals." },
      { question: "Can you have both Crohn's and UC?", answer: "About 10-15% of IBD patients have 'indeterminate colitis' where features overlap and a definitive diagnosis cannot be made. True simultaneous occurrence of both is extremely rare, but the distinction can sometimes be unclear, especially when inflammation is limited to the colon." },
    ],
    relatedSlugs: ["dka-vs-hhs", "dvt-vs-pe"],
  },
  {
    slug: "stable-vs-unstable-angina",
    conditionA: "Stable Angina",
    conditionB: "Unstable Angina",
    title: "Stable vs Unstable Angina: Clinical Comparison for Nurses",
    metaTitle: "Stable vs Unstable Angina | Pathophysiology & Nursing Care",
    metaDescription: "Compare stable and unstable angina: pathophysiology, presentation, diagnostics, medications, nursing interventions, and NCLEX exam preparation tips.",
    keywords: "stable vs unstable angina, angina comparison nursing, chest pain differential, acute coronary syndrome NCLEX",
    introduction: "Angina pectoris is chest pain caused by myocardial ischemia — insufficient oxygen supply to the heart muscle. Stable angina is predictable chest pain with exertion that resolves with rest or nitroglycerin. Unstable angina is a medical emergency representing an acute coronary syndrome (ACS) with chest pain at rest or with increasing frequency. Distinguishing between these is a critical nursing skill.",
    pathophysiologyA: "Stable angina results from fixed atherosclerotic narrowing of coronary arteries (typically >70% stenosis). During exertion, increased myocardial oxygen demand exceeds the limited supply through the narrowed vessel. The ischemia is temporary and reversible — pain occurs predictably with a consistent level of exertion and resolves within 3-5 minutes with rest or nitroglycerin. There is no myocardial cell death. ECG may show ST depression during episodes but normalizes at rest.",
    pathophysiologyB: "Unstable angina results from plaque rupture in a coronary artery, triggering platelet aggregation and partial thrombus formation. Unlike stable angina, the obstruction is dynamic and progressive. Chest pain occurs at REST, with increasing frequency, or with less exertion than before (crescendo pattern). It represents an acute coronary syndrome and is a medical emergency — without treatment, it can progress to myocardial infarction. Troponin remains negative (no myocardial necrosis yet).",
    rows: [
      { category: "Trigger", conditionA: "Predictable exertion, stress, cold weather", conditionB: "At rest, minimal exertion, or unpredictable" },
      { category: "Pattern", conditionA: "Consistent and predictable", conditionB: "New onset, crescendo, or at rest" },
      { category: "Duration", conditionA: "3-5 minutes", conditionB: ">20 minutes or prolonged" },
      { category: "Relief", conditionA: "Rest or nitroglycerin (within 5 min)", conditionB: "Not fully relieved by rest or nitroglycerin" },
      { category: "Underlying Cause", conditionA: "Fixed atherosclerotic stenosis", conditionB: "Plaque rupture with partial thrombosis" },
      { category: "Troponin", conditionA: "Negative", conditionB: "Negative (distinguishes from NSTEMI)" },
      { category: "ECG Changes", conditionA: "ST depression during episode, normalizes at rest", conditionB: "ST depression or T-wave inversion (may persist)" },
      { category: "Myocardial Damage", conditionA: "None (reversible ischemia)", conditionB: "None yet (but high risk of progression)" },
      { category: "Risk of MI", conditionA: "Low (with proper management)", conditionB: "High (ACS spectrum)" },
      { category: "Emergency?", conditionA: "No (managed as outpatient)", conditionB: "Yes (requires immediate evaluation)" },
      { category: "Treatment Setting", conditionA: "Outpatient with lifestyle modification", conditionB: "Hospital admission, cardiac catheterization" },
    ],
    nursingInterventionsA: [
      "Educate on identifying triggers and activity tolerance",
      "Teach proper nitroglycerin use: 1 tab SL every 5 min x3; call 911 if no relief",
      "Encourage lifestyle modifications (diet, exercise, smoking cessation)",
      "Administer prescribed medications (beta-blockers, nitrates, statins, aspirin)",
      "Monitor for progression to unstable angina pattern",
      "Teach patient to avoid Valsalva maneuver and heavy meals",
    ],
    nursingInterventionsB: [
      "Activate ACS protocol: continuous cardiac monitoring, IV access, oxygen if SpO2 <94%",
      "Administer MONA: Morphine, Oxygen (if needed), Nitroglycerin, Aspirin 325 mg chewable",
      "Obtain serial troponins (0, 3, 6 hours) to rule out NSTEMI progression",
      "Obtain 12-lead ECG immediately and repeat with any change in symptoms",
      "Maintain bedrest to reduce myocardial oxygen demand",
      "Prepare for cardiac catheterization and possible PCI",
      "Administer anticoagulation (heparin) as ordered",
      "Monitor vital signs every 15 minutes during acute phase",
    ],
    examTips: [
      "Stable angina = predictable, resolves with rest/NTG in 5 min. Unstable angina = unpredictable, at rest, medical emergency",
      "Unstable angina has NEGATIVE troponin — this distinguishes it from NSTEMI (which has positive troponin)",
      "Both unstable angina and NSTEMI are acute coronary syndromes (ACS)",
      "Nitroglycerin: 1 tablet SL every 5 minutes x3 doses. If no relief after 3 doses, call 911",
      "MONA for ACS: Morphine, Oxygen (if SpO2 <94%), Nitroglycerin, Aspirin",
    ],
    practiceQuestions: [
      {
        question: "A patient reports chest pain at rest that is not relieved by nitroglycerin. Troponin is negative. What is the most likely diagnosis?",
        options: ["Stable angina", "Unstable angina", "STEMI", "NSTEMI"],
        correctIndex: 1,
        rationale: "Unstable angina presents with chest pain at rest that is not fully relieved by nitroglycerin, with negative troponin (no myocardial necrosis). STEMI would show ST elevation, NSTEMI would have positive troponin, and stable angina resolves with rest and NTG."
      },
      {
        question: "Which finding differentiates unstable angina from NSTEMI?",
        options: ["Chest pain at rest", "ST depression on ECG", "Negative troponin levels", "Response to nitroglycerin"],
        correctIndex: 2,
        rationale: "The key differentiator between unstable angina and NSTEMI is troponin. Unstable angina has negative troponin (no myocardial cell death), while NSTEMI has elevated troponin (indicating myocardial necrosis). Both can present with chest pain and ST depression."
      },
    ],
    faq: [
      { question: "Can stable angina become unstable angina?", answer: "Yes. If an atherosclerotic plaque ruptures in a patient with stable angina, it can trigger partial thrombosis and convert to unstable angina. Warning signs include chest pain occurring with less exertion than usual, lasting longer, or occurring at rest." },
      { question: "Is unstable angina a heart attack?", answer: "Unstable angina is not technically a heart attack because there is no myocardial cell death (troponin is negative). However, it is part of the acute coronary syndrome (ACS) spectrum and represents a medical emergency because it can progress to a full myocardial infarction without treatment." },
    ],
    relatedSlugs: ["left-vs-right-heart-failure", "dvt-vs-pe"],
  },
  {
    slug: "type-1-vs-type-2-diabetes",
    conditionA: "Type 1 Diabetes Mellitus",
    conditionB: "Type 2 Diabetes Mellitus",
    title: "Type 1 vs Type 2 Diabetes: Clinical Comparison for Nursing",
    metaTitle: "Type 1 vs Type 2 Diabetes | Pathophysiology & Nursing Guide",
    metaDescription: "Compare Type 1 and Type 2 diabetes side-by-side: pathophysiology, onset, treatment, complications, nursing interventions, and NCLEX practice questions.",
    keywords: "type 1 vs type 2 diabetes, diabetes comparison nursing, T1DM vs T2DM, insulin dependent diabetes NCLEX",
    introduction: "Type 1 and Type 2 diabetes mellitus are both characterized by chronic hyperglycemia, but they differ fundamentally in pathophysiology, onset, treatment approach, and risk of acute complications. Type 1 involves autoimmune destruction of beta cells requiring lifelong insulin, while Type 2 involves insulin resistance that can often be managed initially with lifestyle changes and oral medications.",
    pathophysiologyA: "Type 1 diabetes results from autoimmune destruction of pancreatic beta cells in the islets of Langerhans, mediated by autoreactive T-lymphocytes. This leads to absolute insulin deficiency. Without insulin, glucose cannot enter cells, and the body shifts to fat metabolism, producing ketone bodies. Patients are prone to diabetic ketoacidosis (DKA). Onset is typically in childhood or adolescence. Genetic susceptibility (HLA-DR3/DR4) and environmental triggers (viral infections) play a role.",
    pathophysiologyB: "Type 2 diabetes involves peripheral insulin resistance (primarily in skeletal muscle, liver, and adipose tissue) combined with progressive beta-cell dysfunction. Initially, the pancreas compensates by producing more insulin (hyperinsulinemia), but beta cells eventually become exhausted. Strongly associated with obesity, sedentary lifestyle, and metabolic syndrome. Onset is typically in adulthood (though increasingly seen in adolescents). Patients are prone to HHS rather than DKA.",
    rows: [
      { category: "Pathogenesis", conditionA: "Autoimmune beta-cell destruction", conditionB: "Insulin resistance + beta-cell exhaustion" },
      { category: "Insulin Production", conditionA: "Absolute deficiency", conditionB: "Relative deficiency (initially high, then declining)" },
      { category: "Typical Onset Age", conditionA: "Childhood/adolescence", conditionB: "Adulthood (>40 years, increasingly younger)" },
      { category: "Body Habitus", conditionA: "Usually lean/normal weight", conditionB: "Usually overweight/obese" },
      { category: "Onset Speed", conditionA: "Rapid (days to weeks)", conditionB: "Gradual (months to years)" },
      { category: "Ketosis-Prone", conditionA: "Yes (DKA risk)", conditionB: "Rarely (HHS risk instead)" },
      { category: "Autoantibodies", conditionA: "Present (GAD65, IA-2, insulin antibodies)", conditionB: "Absent" },
      { category: "C-Peptide Level", conditionA: "Low or absent", conditionB: "Normal or elevated (initially)" },
      { category: "Genetic Link", conditionA: "HLA-DR3/DR4 (moderate concordance)", conditionB: "Strong family history (high concordance)" },
      { category: "Treatment", conditionA: "Insulin therapy (mandatory, lifelong)", conditionB: "Lifestyle + oral agents ± insulin" },
      { category: "First-Line Medication", conditionA: "Insulin (no alternative)", conditionB: "Metformin" },
      { category: "Prevalence", conditionA: "5-10% of diabetes cases", conditionB: "90-95% of diabetes cases" },
    ],
    nursingInterventionsA: [
      "Administer insulin as prescribed (basal-bolus regimen with carb counting)",
      "Teach proper insulin injection technique and site rotation",
      "Monitor for DKA symptoms: Kussmaul respirations, fruity breath, nausea",
      "Educate on carbohydrate counting and insulin-to-carb ratios",
      "Teach hypoglycemia recognition and Rule of 15 treatment",
      "Encourage medical alert identification",
      "Coordinate with endocrinology for insulin pump management if applicable",
    ],
    nursingInterventionsB: [
      "Educate on lifestyle modifications: diet, exercise, weight management",
      "Administer metformin with meals to reduce GI side effects",
      "Monitor HbA1C every 3 months (target <7% for most adults)",
      "Perform comprehensive foot assessments (neuropathy screening)",
      "Screen for complications: retinopathy, nephropathy, neuropathy annually",
      "Teach blood glucose self-monitoring technique",
      "Assess medication adherence at each visit",
    ],
    examTips: [
      "Type 1 = autoimmune, absolute insulin deficiency, DKA risk. Type 2 = insulin resistance, relative deficiency, HHS risk",
      "C-peptide: low in Type 1 (no beta cells left), normal/high in early Type 2",
      "Metformin is FIRST-LINE for Type 2 and does NOT cause hypoglycemia as monotherapy",
      "Type 1 patients ALWAYS need insulin. Type 2 may eventually need insulin when beta cells fail",
      "DKA = Type 1 emergency. HHS = Type 2 emergency",
    ],
    practiceQuestions: [
      {
        question: "A 12-year-old presents with polyuria, polydipsia, weight loss, and blood glucose of 380 mg/dL with positive ketones. What is the most likely diagnosis?",
        options: ["Type 2 diabetes", "Type 1 diabetes", "Gestational diabetes", "Prediabetes"],
        correctIndex: 1,
        rationale: "The presentation of a young patient with rapid onset of hyperglycemia, weight loss, and ketosis is classic for Type 1 diabetes. Autoimmune destruction of beta cells causes absolute insulin deficiency, leading to ketone production. Type 2 is more common in adults and rarely presents with ketosis."
      },
      {
        question: "Which lab test differentiates Type 1 from Type 2 diabetes?",
        options: ["Fasting blood glucose", "HbA1C", "C-peptide level", "Oral glucose tolerance test"],
        correctIndex: 2,
        rationale: "C-peptide is produced alongside insulin by beta cells. In Type 1 diabetes, C-peptide is low or absent (destroyed beta cells). In Type 2, C-peptide is initially normal or elevated (insulin resistance causes compensatory insulin production). FBG, A1C, and OGTT diagnose diabetes but don't differentiate types."
      },
    ],
    faq: [
      { question: "Can Type 2 diabetes become Type 1?", answer: "Type 2 does not 'become' Type 1, but over time beta cells can become exhausted, requiring insulin therapy. This is sometimes called 'insulin-requiring Type 2 diabetes.' Additionally, some adults are misdiagnosed with Type 2 when they actually have Latent Autoimmune Diabetes in Adults (LADA), a slow-onset form of Type 1." },
      { question: "Can you prevent Type 1 diabetes?", answer: "Currently, there is no proven way to prevent Type 1 diabetes. It is an autoimmune disease with genetic and environmental triggers. Research into immunotherapy to preserve beta-cell function is ongoing. Type 2 diabetes, however, can often be prevented or delayed through lifestyle modifications." },
    ],
    relatedSlugs: ["dka-vs-hhs", "hypothyroid-vs-hyperthyroid"],
  },
  {
    slug: "left-vs-right-heart-failure",
    conditionA: "Left-Sided Heart Failure",
    conditionB: "Right-Sided Heart Failure",
    title: "Left vs Right Heart Failure: Clinical Comparison for Nurses",
    metaTitle: "Left vs Right Heart Failure | Symptoms, Labs & Nursing Care",
    metaDescription: "Compare left-sided and right-sided heart failure: pathophysiology, symptoms, diagnostics, medications, nursing interventions, and NCLEX exam tips.",
    keywords: "left vs right heart failure, heart failure comparison nursing, CHF left right, congestive heart failure NCLEX",
    introduction: "Heart failure occurs when the heart cannot pump blood effectively to meet the body's metabolic demands. Left-sided heart failure (the most common form) causes pulmonary congestion, while right-sided heart failure causes systemic venous congestion. Understanding the difference in clinical presentation is essential because the symptoms and nursing priorities differ significantly between the two.",
    pathophysiologyA: "Left-sided heart failure occurs when the left ventricle fails to adequately pump blood into systemic circulation. Blood backs up into the pulmonary vasculature, increasing pulmonary capillary pressure and causing fluid to leak into the alveoli (pulmonary edema). Two subtypes: systolic failure (HFrEF — reduced ejection fraction, <40%) where the ventricle cannot contract forcefully enough, and diastolic failure (HFpEF — preserved ejection fraction, >50%) where the stiffened ventricle cannot relax and fill properly. Common causes include MI, hypertension, and cardiomyopathy.",
    pathophysiologyB: "Right-sided heart failure occurs when the right ventricle fails to pump blood effectively into the pulmonary vasculature. Blood backs up into the systemic venous system, causing peripheral congestion. The most common cause of right-sided heart failure is LEFT-sided heart failure (increased pulmonary pressures overload the right ventricle). Other causes include COPD (cor pulmonale), pulmonary hypertension, and pulmonary embolism. Right heart failure causes dependent edema, JVD, hepatomegaly, and ascites.",
    rows: [
      { category: "Congestion Location", conditionA: "Pulmonary (lungs)", conditionB: "Systemic (body)" },
      { category: "Primary Symptoms", conditionA: "Dyspnea, orthopnea, crackles, PND", conditionB: "Peripheral edema, JVD, hepatomegaly, ascites" },
      { category: "Crackles on Auscultation", conditionA: "Present (fluid in alveoli)", conditionB: "Absent (unless biventricular failure)" },
      { category: "Jugular Venous Distension", conditionA: "Absent (unless biventricular)", conditionB: "Present" },
      { category: "Peripheral Edema", conditionA: "Minimal (unless progressed)", conditionB: "Significant (dependent edema)" },
      { category: "Orthopnea", conditionA: "Present (fluid redistributes when lying flat)", conditionB: "Less common" },
      { category: "Hepatomegaly", conditionA: "Absent", conditionB: "Present (liver congestion)" },
      { category: "Ascites", conditionA: "Absent", conditionB: "Present (portal congestion)" },
      { category: "Weight Gain", conditionA: "From pulmonary fluid", conditionB: "From peripheral fluid retention" },
      { category: "Most Common Cause", conditionA: "MI, hypertension, cardiomyopathy", conditionB: "Left-sided heart failure" },
      { category: "Key Diagnostic Finding", conditionA: "Pulmonary edema on CXR, elevated BNP", conditionB: "JVD, hepatojugular reflux, elevated CVP" },
      { category: "Memory Aid", conditionA: "Left = Lung (pulmonary symptoms)", conditionB: "Right = Rest of body (systemic symptoms)" },
    ],
    nursingInterventionsA: [
      "Auscultate lung sounds for crackles and monitor respiratory status",
      "Position patient in high-Fowler's to reduce pulmonary congestion",
      "Administer diuretics (furosemide) as ordered to reduce fluid overload",
      "Monitor oxygen saturation and apply supplemental O2 as needed",
      "Restrict fluids and sodium as ordered",
      "Monitor BNP/NT-proBNP levels as indicator of HF severity",
      "Assess for paroxysmal nocturnal dyspnea (PND)",
      "Administer ACE inhibitors and beta-blockers as ordered for chronic management",
    ],
    nursingInterventionsB: [
      "Monitor and measure peripheral edema (pitting edema scale)",
      "Assess JVD with patient at 45-degree angle",
      "Weigh patient daily at same time with same clothing",
      "Monitor liver function tests (hepatic congestion marker)",
      "Elevate lower extremities when sitting",
      "Administer diuretics to reduce systemic fluid overload",
      "Monitor abdominal girth if ascites present",
      "Restrict sodium intake to reduce fluid retention",
    ],
    examTips: [
      "Left = Lung symptoms (crackles, dyspnea, orthopnea, PND). Right = Rest of body (edema, JVD, hepatomegaly, ascites)",
      "Most common cause of RIGHT heart failure is LEFT heart failure",
      "BNP >100 pg/mL suggests heart failure; used to differentiate cardiac from pulmonary dyspnea",
      "Daily weights are the BEST indicator of fluid status in HF patients",
      "Furosemide: monitor potassium (causes hypokalemia). ACE inhibitors: monitor potassium (causes hyperkalemia)",
    ],
    practiceQuestions: [
      {
        question: "A patient with heart failure presents with crackles in bilateral lung fields, orthopnea, and pink frothy sputum. This is most consistent with:",
        options: ["Right-sided heart failure", "Left-sided heart failure", "Cor pulmonale", "Cardiac tamponade"],
        correctIndex: 1,
        rationale: "Crackles, orthopnea, and pink frothy sputum indicate pulmonary edema from left-sided heart failure. Blood backs up into the pulmonary vasculature when the left ventricle fails. Right-sided failure would present with peripheral edema, JVD, and hepatomegaly."
      },
      {
        question: "Which assessment finding is most specific for right-sided heart failure?",
        options: ["Bilateral crackles", "Jugular venous distension", "Paroxysmal nocturnal dyspnea", "S3 heart sound"],
        correctIndex: 1,
        rationale: "JVD is most specific for right-sided heart failure because it indicates systemic venous congestion — blood backs up from the failing right ventricle into the jugular veins. Crackles, PND, and S3 are more associated with left-sided failure."
      },
    ],
    faq: [
      { question: "Can you have both left and right heart failure?", answer: "Yes. Biventricular (or global) heart failure is common because the most frequent cause of right-sided failure is left-sided failure. When both sides fail, the patient has both pulmonary and systemic congestion — crackles, dyspnea, peripheral edema, JVD, and hepatomegaly simultaneously." },
      { question: "What is the best way to remember left vs right heart failure?", answer: "Left = Lung (pulmonary symptoms like crackles, dyspnea, orthopnea). Right = Rest of the body (systemic symptoms like edema, JVD, hepatomegaly, ascites). Remember: blood backs up BEHIND the failing ventricle." },
    ],
    relatedSlugs: ["stable-vs-unstable-angina", "dvt-vs-pe"],
  },
  {
    slug: "dvt-vs-pe",
    conditionA: "Deep Vein Thrombosis (DVT)",
    conditionB: "Pulmonary Embolism (PE)",
    title: "DVT vs PE: Clinical Comparison for Nursing Students",
    metaTitle: "DVT vs PE Comparison | Signs, Labs & Nursing Interventions",
    metaDescription: "Compare DVT and pulmonary embolism side-by-side: pathophysiology, signs and symptoms, diagnostics, medications, nursing interventions, and NCLEX tips.",
    keywords: "DVT vs PE, deep vein thrombosis vs pulmonary embolism, venous thromboembolism nursing, VTE comparison NCLEX",
    introduction: "Deep vein thrombosis (DVT) and pulmonary embolism (PE) represent two manifestations of venous thromboembolism (VTE). DVT is a blood clot in the deep veins (usually legs), while PE occurs when a DVT fragment dislodges and travels to the pulmonary vasculature. PE can be rapidly fatal, making early recognition of DVT and prompt treatment essential nursing priorities.",
    pathophysiologyA: "DVT forms when a thrombus develops in the deep venous system, most commonly in the lower extremities (iliac, femoral, popliteal veins). Virchow's triad explains the pathogenesis: venous stasis (immobility, surgery), endothelial injury (trauma, central lines), and hypercoagulability (malignancy, pregnancy, clotting disorders). The thrombus obstructs venous return, causing localized swelling, pain, and warmth. The greatest risk is embolization to the pulmonary vasculature.",
    pathophysiologyB: "PE occurs when a thrombus (usually from a DVT) breaks free and travels through the venous system to the right heart and into the pulmonary arteries. The embolus obstructs pulmonary blood flow, creating a ventilation-perfusion (V/Q) mismatch — the affected lung segment is ventilated but not perfused. This causes acute hypoxemia and increases pulmonary vascular resistance. Massive PE can cause acute right heart failure, hemodynamic collapse, and death within minutes.",
    rows: [
      { category: "Location", conditionA: "Deep veins of legs (femoral, popliteal, iliac)", conditionB: "Pulmonary arteries" },
      { category: "Primary Symptom", conditionA: "Unilateral leg swelling, pain, warmth", conditionB: "Sudden dyspnea, chest pain, tachycardia" },
      { category: "Pain Character", conditionA: "Calf or thigh pain (localized)", conditionB: "Pleuritic chest pain (worse with inspiration)" },
      { category: "Homan's Sign", conditionA: "May be positive (unreliable)", conditionB: "Not applicable" },
      { category: "Hemodynamic Impact", conditionA: "Minimal (local obstruction)", conditionB: "Can be massive (right heart failure, shock)" },
      { category: "Diagnostic Test", conditionA: "Duplex ultrasound (gold standard)", conditionB: "CT pulmonary angiography (CTPA)" },
      { category: "D-Dimer", conditionA: "Elevated (sensitive but not specific)", conditionB: "Elevated (sensitive but not specific)" },
      { category: "Mortality Risk", conditionA: "Low if treated", conditionB: "Up to 30% if massive and untreated" },
      { category: "Oxygen Saturation", conditionA: "Normal", conditionB: "Decreased (hypoxemia)" },
      { category: "Treatment", conditionA: "Anticoagulation (heparin → warfarin/DOACs)", conditionB: "Anticoagulation ± thrombolytics for massive PE" },
    ],
    nursingInterventionsA: [
      "Initiate anticoagulation therapy as ordered (heparin drip or LMWH)",
      "Elevate affected extremity above heart level",
      "Apply graduated compression stockings to unaffected leg",
      "Do NOT massage affected leg (risk of embolization)",
      "Monitor for signs of PE (sudden dyspnea, chest pain, tachycardia)",
      "Measure calf and thigh circumference daily for comparison",
      "Educate on anticoagulation therapy and bleeding precautions",
    ],
    nursingInterventionsB: [
      "Administer oxygen to maintain SpO2 >94%",
      "Initiate continuous cardiac monitoring",
      "Administer IV heparin bolus followed by continuous infusion",
      "Prepare for thrombolytic therapy if massive PE with hemodynamic instability",
      "Position patient in high-Fowler's for breathing ease",
      "Monitor ABG for respiratory acidosis and hypoxemia",
      "Assess for signs of right heart failure (JVD, hypotension)",
      "Maintain IV access and have emergency equipment available",
    ],
    examTips: [
      "DVT = unilateral leg swelling + pain + warmth. PE = sudden dyspnea + chest pain + tachycardia",
      "NEVER massage a leg with suspected DVT — this can dislodge the clot and cause PE",
      "Homan's sign is unreliable — do NOT rely on it for diagnosis",
      "D-dimer is sensitive but NOT specific — a negative D-dimer rules out VTE, but a positive requires further testing",
      "Massive PE can cause PEA (pulseless electrical activity) — be prepared for cardiac arrest management",
    ],
    practiceQuestions: [
      {
        question: "A postoperative patient suddenly develops dyspnea, chest pain, and tachycardia with SpO2 of 85%. The nurse should suspect:",
        options: ["Pneumonia", "Atelectasis", "Pulmonary embolism", "Pneumothorax"],
        correctIndex: 2,
        rationale: "Sudden onset dyspnea, pleuritic chest pain, tachycardia, and acute hypoxemia in a postoperative patient (risk factor: immobility) is the classic presentation of pulmonary embolism. PE should be at the top of the differential in any post-surgical patient with acute respiratory distress."
      },
      {
        question: "A patient has a confirmed DVT in the left leg. Which nursing action is contraindicated?",
        options: ["Elevating the affected extremity", "Applying warm compresses", "Massaging the affected calf", "Administering heparin as ordered"],
        correctIndex: 2,
        rationale: "Massaging the affected leg is absolutely contraindicated in DVT because it can dislodge the thrombus and cause a pulmonary embolism. Elevation, warm compresses (for comfort), and anticoagulation are all appropriate interventions."
      },
    ],
    faq: [
      { question: "Can DVT cause pulmonary embolism?", answer: "Yes. Pulmonary embolism most commonly results from a DVT that breaks free (embolizes) and travels through the venous system to the pulmonary arteries. This is why prompt treatment of DVT with anticoagulation is essential — to prevent the clot from growing or embolizing." },
      { question: "What is Virchow's triad?", answer: "Virchow's triad describes the three factors that predispose to clot formation: venous stasis (immobility, prolonged bed rest), endothelial injury (surgery, trauma, central lines), and hypercoagulability (malignancy, pregnancy, clotting disorders, oral contraceptives). Identifying these risk factors is key to VTE prevention." },
    ],
    relatedSlugs: ["stable-vs-unstable-angina", "left-vs-right-heart-failure"],
  },
  {
    slug: "addisons-vs-cushings",
    conditionA: "Addison's Disease (Adrenal Insufficiency)",
    conditionB: "Cushing's Syndrome (Hypercortisolism)",
    title: "Addison's vs Cushing's Disease: Clinical Comparison",
    metaTitle: "Addison's vs Cushing's | Adrenal Disorders Nursing Comparison",
    metaDescription: "Compare Addison's disease and Cushing's syndrome: pathophysiology, signs, lab values, medications, nursing interventions, and NCLEX practice questions.",
    keywords: "Addison's vs Cushing's, adrenal insufficiency vs hypercortisolism, endocrine comparison nursing, NCLEX adrenal disorders",
    introduction: "Addison's disease (adrenal insufficiency) and Cushing's syndrome (hypercortisolism) represent opposite ends of the adrenal cortex spectrum. Addison's involves deficient cortisol and aldosterone production, while Cushing's involves excess cortisol. Their clinical presentations are essentially mirror images of each other, making comparison a high-yield NCLEX topic.",
    pathophysiologyA: "Addison's disease is primary adrenal insufficiency caused by destruction of the adrenal cortex, most commonly by autoimmune adrenalitis. This results in deficiency of cortisol (glucocorticoid), aldosterone (mineralocorticoid), and adrenal androgens. Without cortisol, the body cannot mount a stress response, maintain blood glucose, or regulate inflammation. Without aldosterone, sodium and water are lost while potassium is retained. Elevated ACTH from the pituitary (attempting to stimulate the failing adrenals) causes hyperpigmentation via melanocyte stimulation.",
    pathophysiologyB: "Cushing's syndrome results from prolonged exposure to excessive glucocorticoids. The most common cause is iatrogenic (long-term corticosteroid therapy). Endogenous causes include ACTH-secreting pituitary adenoma (Cushing's disease), adrenal tumors, or ectopic ACTH production. Excess cortisol causes widespread metabolic effects: hyperglycemia, protein catabolism, fat redistribution, sodium/water retention, and immunosuppression. Chronic cortisol excess suppresses the HPA axis.",
    rows: [
      { category: "Cortisol Level", conditionA: "Decreased", conditionB: "Increased" },
      { category: "ACTH Level", conditionA: "Elevated (primary) or low (secondary)", conditionB: "Variable (depends on cause)" },
      { category: "Blood Pressure", conditionA: "Hypotension", conditionB: "Hypertension" },
      { category: "Blood Glucose", conditionA: "Hypoglycemia", conditionB: "Hyperglycemia" },
      { category: "Sodium", conditionA: "Hyponatremia", conditionB: "Hypernatremia" },
      { category: "Potassium", conditionA: "Hyperkalemia", conditionB: "Hypokalemia" },
      { category: "Weight", conditionA: "Weight loss", conditionB: "Weight gain (truncal obesity)" },
      { category: "Skin", conditionA: "Bronze hyperpigmentation", conditionB: "Thin, fragile skin; purple striae; easy bruising" },
      { category: "Body Shape", conditionA: "Thin, muscle wasting", conditionB: "Moon face, buffalo hump, truncal obesity" },
      { category: "Immune Function", conditionA: "Normal", conditionB: "Immunosuppressed (infection risk)" },
      { category: "Bone Health", conditionA: "Normal", conditionB: "Osteoporosis (calcium loss)" },
      { category: "Crisis Risk", conditionA: "Addisonian crisis (acute adrenal insufficiency)", conditionB: "Adrenal crisis if steroids suddenly stopped" },
      { category: "Treatment", conditionA: "Lifelong cortisol and aldosterone replacement", conditionB: "Remove cause; gradual steroid taper" },
    ],
    nursingInterventionsA: [
      "Administer hydrocortisone and fludrocortisone as prescribed (lifelong replacement)",
      "Educate on stress dosing: double or triple cortisol dose during illness, surgery, or injury",
      "Monitor for Addisonian crisis: severe hypotension, dehydration, altered consciousness",
      "Teach patient to wear medical alert identification at all times",
      "Monitor electrolytes (sodium, potassium) regularly",
      "Educate on increased salt intake (aldosterone deficiency causes sodium loss)",
      "Administer IV hydrocortisone 100 mg immediately if crisis suspected",
    ],
    nursingInterventionsB: [
      "Monitor blood glucose frequently (cortisol-induced hyperglycemia)",
      "Assess for signs of infection (immunosuppression masks typical symptoms)",
      "Implement fall precautions (muscle weakness, osteoporosis risk)",
      "Monitor skin integrity (thin, fragile skin with poor wound healing)",
      "Educate on gradual steroid taper — NEVER stop corticosteroids abruptly",
      "Monitor blood pressure and manage hypertension",
      "Assess for mood changes (depression, psychosis from cortisol excess)",
    ],
    examTips: [
      "Addison's = hypo everything (low cortisol, low BP, low glucose, low Na). Cushing's = hyper everything (high cortisol, high BP, high glucose, high Na)",
      "Addison's: HYPERkalemia and HYPOpigmentation is WRONG — it's HYPERpigmentation (from elevated ACTH stimulating melanocytes)",
      "Cushing's: moon face + buffalo hump + purple striae + easy bruising = cortisol excess",
      "NEVER stop corticosteroids abruptly — causes Addisonian crisis from suppressed HPA axis",
      "Addisonian crisis = medical emergency requiring immediate IV hydrocortisone",
    ],
    practiceQuestions: [
      {
        question: "A patient with Addison's disease presents with bronze skin discoloration, hypotension, and hyperkalemia. Which medication is the priority?",
        options: ["Prednisone oral", "Hydrocortisone IV", "Fludrocortisone oral", "Desmopressin"],
        correctIndex: 1,
        rationale: "A patient with Addison's presenting with hypotension and hyperkalemia may be developing an Addisonian crisis. IV hydrocortisone is the priority to rapidly replace deficient cortisol and prevent cardiovascular collapse. Oral medications are for chronic management, not acute crisis."
      },
      {
        question: "Which clinical finding is associated with Cushing's syndrome but NOT Addison's disease?",
        options: ["Hypotension", "Moon face with truncal obesity", "Bronze hyperpigmentation", "Hyperkalemia"],
        correctIndex: 1,
        rationale: "Moon face with truncal obesity is characteristic of Cushing's syndrome (cortisol excess causes fat redistribution). Addison's disease presents with the opposite: weight loss, hypotension, and bronze hyperpigmentation."
      },
    ],
    faq: [
      { question: "How do you remember the difference between Addison's and Cushing's?", answer: "Think of them as opposites. Addison's = ADD cortisol (deficient, needs replacement). Cushing's = too much CUSHION (excess cortisol causes weight gain, moon face, buffalo hump). Addison's = hypo everything (low BP, low glucose, low sodium). Cushing's = hyper everything (high BP, high glucose, high sodium)." },
      { question: "Why can't you stop steroids suddenly?", answer: "Long-term corticosteroid use suppresses the hypothalamic-pituitary-adrenal (HPA) axis. The adrenal glands atrophy from disuse. Suddenly stopping steroids leaves the body without cortisol production, causing acute adrenal insufficiency (Addisonian crisis) — a life-threatening emergency with severe hypotension, hypoglycemia, and cardiovascular collapse." },
    ],
    relatedSlugs: ["hypothyroid-vs-hyperthyroid", "type-1-vs-type-2-diabetes"],
  },
  {
    slug: "hypothyroid-vs-hyperthyroid",
    conditionA: "Hypothyroidism",
    conditionB: "Hyperthyroidism",
    title: "Hypothyroidism vs Hyperthyroidism: Clinical Comparison",
    metaTitle: "Hypothyroid vs Hyperthyroid | Thyroid Disorders Nursing Guide",
    metaDescription: "Compare hypothyroidism and hyperthyroidism side-by-side: pathophysiology, signs, labs, medications, nursing interventions, and NCLEX practice questions.",
    keywords: "hypothyroidism vs hyperthyroidism, thyroid comparison nursing, Hashimoto's vs Graves, thyroid disorders NCLEX",
    introduction: "Hypothyroidism and hyperthyroidism represent opposite extremes of thyroid function. Hypothyroidism (underactive thyroid) slows metabolic processes throughout the body, while hyperthyroidism (overactive thyroid) accelerates them. Understanding the contrasting clinical presentations, lab findings, and emergency complications is essential for nursing practice and NCLEX preparation.",
    pathophysiologyA: "Hypothyroidism is a deficiency of thyroid hormones (T3 and T4). The most common cause is Hashimoto's thyroiditis, an autoimmune condition where antibodies attack and destroy thyroid tissue. Other causes include thyroidectomy, radioactive iodine therapy, and iodine deficiency. Decreased thyroid hormones slow basal metabolic rate, affecting every organ system. Severe untreated hypothyroidism can lead to myxedema coma — a life-threatening emergency with hypothermia, bradycardia, and altered mental status.",
    pathophysiologyB: "Hyperthyroidism is excess production of thyroid hormones. The most common cause is Graves' disease, an autoimmune condition where thyroid-stimulating immunoglobulins (TSI) mimic TSH and continuously stimulate the thyroid. Other causes include toxic multinodular goiter and thyroiditis. Excess thyroid hormones dramatically increase metabolic rate and sympathetic nervous system activity. Severe untreated hyperthyroidism can lead to thyroid storm — a life-threatening emergency with extreme hyperthermia, tachycardia, and multi-organ failure.",
    rows: [
      { category: "Metabolic Rate", conditionA: "Decreased (everything slows down)", conditionB: "Increased (everything speeds up)" },
      { category: "TSH Level", conditionA: "Elevated (pituitary trying to stimulate thyroid)", conditionB: "Suppressed (negative feedback from excess T3/T4)" },
      { category: "T3/T4 Levels", conditionA: "Decreased", conditionB: "Increased" },
      { category: "Heart Rate", conditionA: "Bradycardia", conditionB: "Tachycardia, atrial fibrillation" },
      { category: "Weight", conditionA: "Weight gain (despite decreased appetite)", conditionB: "Weight loss (despite increased appetite)" },
      { category: "Temperature Tolerance", conditionA: "Cold intolerance", conditionB: "Heat intolerance" },
      { category: "Skin/Hair", conditionA: "Dry, coarse skin; hair loss; brittle nails", conditionB: "Warm, moist skin; fine tremor; hair thinning" },
      { category: "GI Function", conditionA: "Constipation", conditionB: "Diarrhea, increased bowel movements" },
      { category: "Mental Status", conditionA: "Fatigue, depression, cognitive slowing", conditionB: "Anxiety, irritability, insomnia" },
      { category: "Most Common Cause", conditionA: "Hashimoto's thyroiditis (autoimmune)", conditionB: "Graves' disease (autoimmune)" },
      { category: "Eye Changes", conditionA: "Periorbital edema", conditionB: "Exophthalmos (Graves' ophthalmopathy)" },
      { category: "Emergency Complication", conditionA: "Myxedema coma (hypothermia, bradycardia)", conditionB: "Thyroid storm (hyperthermia, tachycardia)" },
      { category: "Treatment", conditionA: "Levothyroxine (synthetic T4) replacement", conditionB: "Antithyroid drugs (methimazole, PTU), RAI, surgery" },
    ],
    nursingInterventionsA: [
      "Administer levothyroxine on an empty stomach, 30-60 minutes before breakfast",
      "Monitor TSH levels (goal: normalize TSH with replacement therapy)",
      "Assess for signs of myxedema coma: hypothermia, bradycardia, altered LOC",
      "Educate that levothyroxine is a lifelong medication — do not stop",
      "Monitor for over-replacement symptoms (tachycardia, anxiety = hyperthyroid symptoms)",
      "Implement fall precautions (fatigue, cognitive slowing)",
      "Avoid sedatives and opioids (increased sensitivity in hypothyroid patients)",
    ],
    nursingInterventionsB: [
      "Monitor heart rate and rhythm continuously (tachycardia, atrial fibrillation risk)",
      "Administer antithyroid medications (methimazole or PTU) as ordered",
      "Provide cool environment and lightweight clothing for heat intolerance",
      "Monitor for thyroid storm: temperature >104°F, severe tachycardia, delirium",
      "Protect eyes if exophthalmos present (lubricating drops, eye shields at night)",
      "Provide high-calorie diet to compensate for increased metabolic rate",
      "Promote rest periods — minimize stimulation and anxiety triggers",
    ],
    examTips: [
      "Hypothyroid = everything SLOW (bradycardia, constipation, cold, weight gain, fatigue). Hyperthyroid = everything FAST (tachycardia, diarrhea, heat, weight loss, anxiety)",
      "TSH is the MOST sensitive screening test for thyroid disorders",
      "Levothyroxine: take on empty stomach, 30-60 min before breakfast, lifelong therapy",
      "Myxedema coma = hypothyroid emergency. Thyroid storm = hyperthyroid emergency",
      "PTU is preferred in first trimester of pregnancy (methimazole is teratogenic in T1)",
    ],
    practiceQuestions: [
      {
        question: "A patient has TSH 12.5 mU/L and free T4 0.2 ng/dL. Which condition does this represent?",
        options: ["Hyperthyroidism", "Hypothyroidism", "Euthyroid sick syndrome", "Thyroid storm"],
        correctIndex: 1,
        rationale: "Elevated TSH with low free T4 is the classic lab pattern for primary hypothyroidism. The pituitary releases more TSH trying to stimulate an underperforming thyroid. In hyperthyroidism, TSH would be suppressed and T4 would be elevated."
      },
      {
        question: "A patient with Graves' disease develops temperature 105°F, heart rate 160, and delirium. This is most consistent with:",
        options: ["Myxedema coma", "Thyroid storm", "Addisonian crisis", "Neuroleptic malignant syndrome"],
        correctIndex: 1,
        rationale: "Thyroid storm is a life-threatening hyperthyroid emergency characterized by extreme hyperthermia (>104°F), severe tachycardia, delirium, and multi-organ dysfunction. It requires immediate treatment with beta-blockers, antithyroid drugs, iodine, and supportive care."
      },
    ],
    faq: [
      { question: "How do I remember hypothyroid vs hyperthyroid symptoms?", answer: "Think of thyroid hormones as the body's 'gas pedal.' Hypothyroid = too little gas (everything slows: bradycardia, constipation, cold, fatigue, weight gain). Hyperthyroid = too much gas (everything speeds up: tachycardia, diarrhea, heat, anxiety, weight loss)." },
      { question: "Can hypothyroidism become hyperthyroidism?", answer: "Not typically, but Hashimoto's thyroiditis can cause transient hyperthyroidism (hashitoxicosis) early in the disease as inflammatory destruction of the thyroid releases stored hormones. This is temporary and eventually progresses to permanent hypothyroidism." },
    ],
    relatedSlugs: ["addisons-vs-cushings", "type-1-vs-type-2-diabetes"],
  },
  {
    slug: "ulcerative-colitis-vs-crohns-disease",
    conditionA: "Ulcerative Colitis",
    conditionB: "Crohn's Disease",
    title: "Ulcerative Colitis vs Crohn's Disease: Side-by-Side Comparison",
    metaTitle: "UC vs Crohn's Disease | IBD Clinical Comparison for Nurses",
    metaDescription: "Compare ulcerative colitis and Crohn's disease: clinical features, diagnostics, surgical options, nursing interventions, and NCLEX practice questions.",
    keywords: "ulcerative colitis vs Crohn's disease, UC vs Crohn's nursing, inflammatory bowel disease comparison, IBD NCLEX",
    introduction: "This comparison approaches inflammatory bowel disease from the ulcerative colitis perspective, emphasizing the key clinical distinctions that guide nursing assessment, intervention, and patient education. While Crohn's and UC share the IBD umbrella, their management and prognosis differ substantially.",
    pathophysiologyA: "Ulcerative colitis involves chronic inflammation limited to the mucosal and submucosal layers of the large intestine. It invariably begins at the rectum and extends proximally in a continuous fashion. The inflamed mucosa becomes edematous, ulcerated, and friable, leading to characteristic bloody diarrhea with mucus. Crypt abscesses and pseudopolyps develop. Long-standing UC significantly increases colorectal cancer risk, necessitating regular surveillance colonoscopy.",
    pathophysiologyB: "Crohn's disease involves transmural inflammation that can occur anywhere along the GI tract. Unlike UC, Crohn's presents with skip lesions — discontinuous areas of inflammation separated by normal bowel. The transmural nature leads to complications including fistulas (enterocutaneous, enterovesical, perianal), abscesses, and strictures. Granulomas are a pathological hallmark. Malabsorption of nutrients (B12, iron, fat-soluble vitamins) is common due to ileal involvement.",
    rows: [
      { category: "Affected Area", conditionA: "Colon and rectum only", conditionB: "Mouth to anus (any GI segment)" },
      { category: "Inflammation Pattern", conditionA: "Continuous, starting at rectum", conditionB: "Discontinuous (skip lesions)" },
      { category: "Inflammation Depth", conditionA: "Mucosal/submucosal", conditionB: "Transmural (all layers)" },
      { category: "Characteristic Stool", conditionA: "Bloody diarrhea with mucus", conditionB: "Non-bloody diarrhea (usually)" },
      { category: "Surgical Cure", conditionA: "Total colectomy is curative", conditionB: "No surgical cure (disease recurs)" },
      { category: "Cancer Risk", conditionA: "High after 8-10 years", conditionB: "Slightly elevated" },
      { category: "Fistula Risk", conditionA: "Rare", conditionB: "Common" },
      { category: "Toxic Megacolon", conditionA: "Significant risk", conditionB: "Rare" },
    ],
    nursingInterventionsA: [
      "Monitor for bloody diarrhea frequency and severity",
      "Assess for toxic megacolon (fever, distension, absent bowel sounds)",
      "Administer 5-ASA drugs (mesalamine) as first-line therapy",
      "Educate on colorectal cancer screening schedule",
      "Monitor hemoglobin for iron-deficiency anemia",
      "Prepare patient for potential colectomy with ileostomy",
    ],
    nursingInterventionsB: [
      "Monitor for fistula drainage and perianal complications",
      "Assess nutritional status and supplement B12, iron, and fat-soluble vitamins",
      "Administer immunomodulators and biologics as ordered",
      "Educate on smoking cessation (smoking worsens Crohn's)",
      "Monitor for bowel obstruction from strictures",
      "Provide TPN during severe flares if bowel rest needed",
    ],
    examTips: [
      "UC = continuous, mucosal, bloody diarrhea, rectum always involved, curable by colectomy",
      "Crohn's = skip lesions, transmural, fistulas, terminal ileum, NOT curable by surgery",
      "Toxic megacolon is primarily a UC complication",
      "Smoking: worsens Crohn's, may protect against UC (but never recommend smoking)",
    ],
    practiceQuestions: [
      {
        question: "A patient with UC develops fever, abdominal distension, and absent bowel sounds. X-ray shows colonic diameter of 8 cm. What complication has developed?",
        options: ["Bowel perforation", "Toxic megacolon", "Fistula formation", "Small bowel obstruction"],
        correctIndex: 1,
        rationale: "Toxic megacolon is characterized by colonic dilation >6 cm with systemic toxicity (fever, tachycardia, leukocytosis). This is a life-threatening complication of UC requiring surgical consultation for potential emergency colectomy."
      },
    ],
    faq: [
      { question: "Is IBD the same as IBS?", answer: "No. Inflammatory bowel disease (IBD — Crohn's and UC) involves actual inflammation and tissue damage visible on endoscopy. Irritable bowel syndrome (IBS) is a functional disorder with no visible inflammation. IBD can cause fever, weight loss, and bloody stools; IBS typically does not." },
    ],
    relatedSlugs: ["crohns-vs-ulcerative-colitis", "dka-vs-hhs"],
  },
  {
    slug: "preeclampsia-vs-eclampsia",
    conditionA: "Preeclampsia",
    conditionB: "Eclampsia",
    title: "Preeclampsia vs Eclampsia: Clinical Comparison for Nurses",
    metaTitle: "Preeclampsia vs Eclampsia | Maternity Nursing Comparison",
    metaDescription: "Compare preeclampsia and eclampsia: pathophysiology, diagnostic criteria, magnesium sulfate management, nursing interventions, and NCLEX practice questions.",
    keywords: "preeclampsia vs eclampsia, hypertensive disorders pregnancy nursing, magnesium sulfate nursing, maternity NCLEX",
    introduction: "Preeclampsia and eclampsia are hypertensive disorders of pregnancy that represent a spectrum of disease severity. Preeclampsia is characterized by new-onset hypertension and proteinuria after 20 weeks gestation, while eclampsia is defined by the development of seizures in a preeclamptic patient. Both are leading causes of maternal and fetal morbidity and mortality worldwide.",
    pathophysiologyA: "Preeclampsia results from abnormal placental development and inadequate spiral artery remodeling, leading to placental ischemia. The ischemic placenta releases anti-angiogenic factors that cause widespread endothelial dysfunction. This leads to vasospasm (hypertension), increased capillary permeability (edema, proteinuria), and activation of the coagulation cascade. Severe features include blood pressure ≥160/110, thrombocytopenia, liver dysfunction (elevated transaminases), renal insufficiency, pulmonary edema, or cerebral/visual disturbances.",
    pathophysiologyB: "Eclampsia is the occurrence of generalized tonic-clonic seizures in a patient with preeclampsia, not attributable to other causes. Seizures result from cerebral vasospasm, ischemia, and cytotoxic edema. Eclampsia can occur antepartum, intrapartum, or postpartum (up to 6 weeks after delivery). It carries significant risk of maternal death from intracranial hemorrhage, pulmonary edema, or multi-organ failure, and fetal risk from placental abruption and hypoxia.",
    rows: [
      { category: "Definition", conditionA: "HTN + proteinuria after 20 weeks gestation", conditionB: "Preeclampsia + seizures" },
      { category: "Blood Pressure", conditionA: "≥140/90 mmHg (severe: ≥160/110)", conditionB: "Usually severely elevated" },
      { category: "Proteinuria", conditionA: "Present (≥300 mg/24h or protein/creatinine ratio ≥0.3)", conditionB: "Usually present" },
      { category: "Seizures", conditionA: "Absent", conditionB: "Present (defining feature)" },
      { category: "Headache", conditionA: "May be present (severe, frontal)", conditionB: "Often precedes seizure" },
      { category: "Visual Changes", conditionA: "May occur (blurred vision, scotomata)", conditionB: "Often precedes seizure" },
      { category: "Epigastric Pain", conditionA: "Severe feature (liver capsule distension)", conditionB: "May be present" },
      { category: "HELLP Syndrome Risk", conditionA: "Possible complication", conditionB: "Increased risk" },
      { category: "Treatment", conditionA: "Antihypertensives + magnesium sulfate prophylaxis", conditionB: "Magnesium sulfate + delivery" },
      { category: "Definitive Treatment", conditionA: "Delivery of the placenta", conditionB: "Delivery of the placenta" },
      { category: "Mortality Risk", conditionA: "Low with proper management", conditionB: "1-2% maternal mortality" },
    ],
    nursingInterventionsA: [
      "Monitor blood pressure every 4 hours (every 15-30 min if severe)",
      "Monitor urine protein levels and I&O",
      "Administer magnesium sulfate IV for seizure prophylaxis in severe preeclampsia",
      "Assess for severe features: headache, visual changes, epigastric pain, RUQ pain",
      "Monitor fetal heart rate and fetal movement patterns",
      "Prepare for delivery if gestational age allows or condition worsens",
      "Administer antihypertensives (labetalol, hydralazine, nifedipine) as ordered",
      "Monitor for HELLP syndrome: CBC, liver enzymes, LDH",
    ],
    nursingInterventionsB: [
      "Maintain airway and position patient on left side during seizure",
      "Administer magnesium sulfate loading dose 4-6g IV over 15-20 min",
      "Maintain magnesium drip at 1-2 g/hr and monitor serum levels (therapeutic: 4-7 mEq/L)",
      "Monitor for magnesium toxicity: loss of DTR, respiratory depression, cardiac arrest",
      "Keep calcium gluconate at bedside (magnesium antidote)",
      "Prepare for emergency delivery after maternal stabilization",
      "Continuous fetal monitoring",
      "Monitor for signs of placental abruption (vaginal bleeding, rigid abdomen, fetal distress)",
    ],
    examTips: [
      "Magnesium sulfate = SEIZURE PREVENTION in preeclampsia, not for blood pressure reduction",
      "Magnesium toxicity signs: loss of deep tendon reflexes → respiratory depression → cardiac arrest",
      "Antidote for magnesium toxicity = calcium gluconate",
      "Therapeutic magnesium level: 4-7 mEq/L. Check DTR before each dose",
      "Definitive treatment for both preeclampsia and eclampsia = DELIVERY of the placenta",
      "Eclampsia seizures can occur up to 6 WEEKS postpartum",
    ],
    practiceQuestions: [
      {
        question: "A patient at 34 weeks gestation receiving magnesium sulfate loses deep tendon reflexes. What is the priority nursing action?",
        options: ["Increase the magnesium infusion rate", "Continue the infusion and recheck in 1 hour", "Stop the magnesium infusion and notify the provider", "Administer epinephrine"],
        correctIndex: 2,
        rationale: "Loss of deep tendon reflexes is the first sign of magnesium toxicity. The infusion must be stopped immediately and the provider notified. If respiratory depression occurs, calcium gluconate is administered as the antidote. Therapeutic magnesium level is 4-7 mEq/L."
      },
      {
        question: "What differentiates eclampsia from preeclampsia?",
        options: ["Blood pressure above 160/110", "Proteinuria >5g/24h", "Onset of seizures", "Presence of edema"],
        correctIndex: 2,
        rationale: "Eclampsia is defined by the occurrence of generalized tonic-clonic seizures in a patient with preeclampsia. While severe hypertension and significant proteinuria are features of severe preeclampsia, seizures are the defining distinction of eclampsia."
      },
    ],
    faq: [
      { question: "Why is magnesium sulfate given for preeclampsia?", answer: "Magnesium sulfate is given as seizure PROPHYLAXIS — it prevents preeclampsia from progressing to eclampsia. It works by blocking NMDA receptors and reducing cerebral vasospasm. Important: magnesium sulfate does NOT lower blood pressure; separate antihypertensives are needed for BP control." },
      { question: "Can preeclampsia occur after delivery?", answer: "Yes. Postpartum preeclampsia and eclampsia can occur up to 6 weeks after delivery. Patients should be educated to seek immediate medical attention for severe headache, visual changes, epigastric pain, or seizures after discharge." },
    ],
    relatedSlugs: ["dka-vs-hhs", "left-vs-right-heart-failure"],
  },
];

export function getClinicalComparisonBySlug(slug: string): ClinicalComparison | undefined {
  return clinicalComparisons.find(c => c.slug === slug);
}

export function getAllClinicalComparisonSlugs(): string[] {
  return clinicalComparisons.map(c => c.slug);
}
