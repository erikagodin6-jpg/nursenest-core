import type { BankQuestion } from "./types";

export const prenursingQuestions: BankQuestion[] = [
  // ===== MEDICAL TERMINOLOGY (pn-001 to pn-012) =====
  {
    id: "pn-001",
    course: "pre-nursing",
    topic: "Medical Terminology",
    subtopic: "Prefixes",
    stem: "Which prefix means 'above' or 'excessive'?",
    options: ["Hypo-", "Hyper-", "Sub-", "Intra-"],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "The prefix 'hyper-' means above, excessive, or beyond normal. It is commonly used in medical terms such as hypertension (high blood pressure) and hyperglycemia (high blood sugar).",
    rationaleIncorrect: [
      "Hypo- means below or deficient, the opposite of hyper-",
      "Sub- means under or beneath",
      "Intra- means within"
    ],
    difficulty: 1,
    bloomLevel: "recall",
    clinicalCorrelation: "Understanding prefixes helps nurses quickly interpret medical terminology used in patient charts, physician orders, and diagnostic reports.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["medical terminology", "prefixes", "hyper", "foundations"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-002",
    course: "pre-nursing",
    topic: "Medical Terminology",
    subtopic: "Suffixes",
    stem: "The suffix '-itis' refers to which condition?",
    options: ["Pain", "Inflammation", "Disease", "Surgical removal"],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "The suffix '-itis' denotes inflammation. Examples include appendicitis (inflammation of the appendix), bronchitis (inflammation of the bronchi), and arthritis (inflammation of the joints).",
    rationaleIncorrect: [
      "Pain is indicated by the suffix -algia or -dynia",
      "Disease is a general term not represented by -itis specifically",
      "Surgical removal is indicated by the suffix -ectomy"
    ],
    difficulty: 1,
    bloomLevel: "recall",
    clinicalCorrelation: "Recognizing the suffix -itis allows nurses to quickly identify that a condition involves an inflammatory process, guiding assessment priorities.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["medical terminology", "suffixes", "inflammation", "foundations"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-003",
    course: "pre-nursing",
    topic: "Medical Terminology",
    subtopic: "Root Words",
    stem: "The root word 'cardi' refers to which body structure?",
    options: ["Brain", "Lung", "Heart", "Kidney"],
    correctAnswer: 2,
    type: "mcq",
    rationaleCorrect: "The root word 'cardi' or 'cardio' refers to the heart. It is used in terms such as cardiology, cardiovascular, and electrocardiogram (ECG).",
    rationaleIncorrect: [
      "Brain is referred to by the root words 'cerebr' or 'encephal'",
      "Lung is referred to by the root words 'pulmon' or 'pneum'",
      "Kidney is referred to by the root words 'ren' or 'nephr'"
    ],
    difficulty: 1,
    bloomLevel: "recall",
    clinicalCorrelation: "Knowing root words helps nurses interpret diagnostic test names and medical conditions, improving communication with the healthcare team.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["medical terminology", "root words", "cardiac", "anatomy"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-004",
    course: "pre-nursing",
    topic: "Medical Terminology",
    subtopic: "Combining Forms",
    stem: "What does the term 'tachycardia' mean?",
    options: ["Slow heart rate", "Rapid heart rate", "Irregular heart rate", "Absent heart rate"],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "Tachycardia combines 'tachy-' (rapid or fast) with 'cardia' (heart condition). It refers to a heart rate that is faster than normal, typically defined as greater than 100 beats per minute in adults.",
    rationaleIncorrect: [
      "Slow heart rate is called bradycardia (brady- means slow)",
      "Irregular heart rate is called arrhythmia or dysrhythmia",
      "Absent heart rate would be described as asystole"
    ],
    difficulty: 1,
    bloomLevel: "recall",
    clinicalCorrelation: "Nurses must recognize tachycardia as a potential sign of physiological stress, pain, fever, dehydration, or cardiac dysfunction requiring further assessment.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["medical terminology", "tachycardia", "heart rate", "combining forms"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-005",
    course: "pre-nursing",
    topic: "Medical Terminology",
    subtopic: "Abbreviations",
    stem: "In medical documentation, the abbreviation 'PRN' means:",
    options: ["Immediately", "As needed", "Every hour", "Before meals"],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "PRN stands for 'pro re nata,' a Latin term meaning 'as needed' or 'as the situation requires.' It is commonly used in medication orders to indicate that a medication should be given only when the patient needs it.",
    rationaleIncorrect: [
      "Immediately is indicated by the abbreviation 'stat'",
      "Every hour is indicated by the abbreviation 'q1h'",
      "Before meals is indicated by the abbreviation 'ac' (ante cibum)"
    ],
    difficulty: 1,
    bloomLevel: "recall",
    clinicalCorrelation: "PRN medications require nursing judgment to determine when administration is appropriate based on patient assessment findings.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["medical terminology", "abbreviations", "PRN", "medication orders"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-006",
    course: "pre-nursing",
    topic: "Medical Terminology",
    subtopic: "Directional Terms",
    stem: "The term 'proximal' describes a body part that is:",
    options: ["Far from the trunk", "Close to the trunk", "On the back", "On the front"],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "Proximal means closer to the point of attachment or the trunk of the body. For example, the elbow is proximal to the wrist because it is closer to the trunk.",
    rationaleIncorrect: [
      "Far from the trunk is described by the term 'distal'",
      "On the back is described by the term 'posterior' or 'dorsal'",
      "On the front is described by the term 'anterior' or 'ventral'"
    ],
    difficulty: 1,
    bloomLevel: "recall",
    clinicalCorrelation: "Directional terms are essential for accurate documentation of wound locations, assessment findings, and surgical site descriptions.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["medical terminology", "directional terms", "proximal", "anatomy"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-007",
    course: "pre-nursing",
    topic: "Medical Terminology",
    subtopic: "Suffixes",
    stem: "The suffix '-ectomy' refers to:",
    options: ["Incision into", "Surgical removal of", "Visual examination of", "Creation of an opening"],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "The suffix '-ectomy' means surgical removal or excision. Common examples include appendectomy (removal of the appendix), cholecystectomy (removal of the gallbladder), and mastectomy (removal of the breast).",
    rationaleIncorrect: [
      "Incision into is indicated by the suffix -otomy or -tomy",
      "Visual examination of is indicated by the suffix -oscopy or -scopy",
      "Creation of an opening is indicated by the suffix -ostomy or -stomy"
    ],
    difficulty: 1,
    bloomLevel: "recall",
    clinicalCorrelation: "Understanding surgical suffixes helps nurses anticipate post-operative care needs and communicate effectively about procedures.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["medical terminology", "suffixes", "surgery", "ectomy"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-008",
    course: "pre-nursing",
    topic: "Medical Terminology",
    subtopic: "Body Planes",
    stem: "Which anatomical plane divides the body into front and back portions?",
    options: ["Sagittal plane", "Transverse plane", "Coronal (frontal) plane", "Oblique plane"],
    correctAnswer: 2,
    type: "mcq",
    rationaleCorrect: "The coronal (frontal) plane divides the body into anterior (front) and posterior (back) portions. It runs vertically from side to side, perpendicular to the sagittal plane.",
    rationaleIncorrect: [
      "The sagittal plane divides the body into left and right portions",
      "The transverse plane divides the body into upper and lower (superior and inferior) portions",
      "An oblique plane is any plane that is not parallel to the other standard planes"
    ],
    difficulty: 2,
    bloomLevel: "recall",
    clinicalCorrelation: "Understanding body planes is essential for interpreting imaging studies such as CT scans and MRIs, which display cross-sectional images along these planes.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["medical terminology", "body planes", "anatomy", "coronal plane"],
    estimatedTimeSeconds: 45
  },
  {
    id: "pn-009",
    course: "pre-nursing",
    topic: "Medical Terminology",
    subtopic: "Prefixes",
    stem: "A patient's chart states they have 'bilateral' knee pain. This means pain in:",
    options: ["One knee only", "Both knees", "The front of the knee", "The back of the knee"],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "The prefix 'bi-' means two, and 'lateral' refers to the side. Bilateral means affecting both sides. Therefore, bilateral knee pain means pain in both knees.",
    rationaleIncorrect: [
      "One knee only would be described as unilateral",
      "The front of the knee would be described as anterior knee pain",
      "The back of the knee would be described as posterior or popliteal area pain"
    ],
    difficulty: 1,
    bloomLevel: "understanding",
    clinicalCorrelation: "Accurate interpretation of laterality terms prevents errors in assessment, documentation, and treatment planning.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["medical terminology", "bilateral", "prefixes", "documentation"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-010",
    course: "pre-nursing",
    topic: "Medical Terminology",
    subtopic: "Combining Forms",
    stem: "The term 'dyspnea' refers to:",
    options: ["Difficulty swallowing", "Difficulty breathing", "Difficulty urinating", "Difficulty speaking"],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "Dyspnea combines 'dys-' (difficult or painful) with '-pnea' (breathing). It refers to difficulty breathing or shortness of breath, which is a common symptom reported by patients with respiratory or cardiac conditions.",
    rationaleIncorrect: [
      "Difficulty swallowing is called dysphagia (dys- + -phagia)",
      "Difficulty urinating is called dysuria (dys- + -uria)",
      "Difficulty speaking is called dysphasia or dysarthria"
    ],
    difficulty: 2,
    bloomLevel: "understanding",
    clinicalCorrelation: "Dyspnea is a subjective symptom that requires nursing assessment of respiratory rate, oxygen saturation, and work of breathing.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["medical terminology", "dyspnea", "respiratory", "combining forms"],
    estimatedTimeSeconds: 45
  },
  {
    id: "pn-011",
    course: "pre-nursing",
    topic: "Medical Terminology",
    subtopic: "Abbreviations",
    stem: "Which abbreviation should a nurse avoid using due to safety concerns? (Select all that apply)",
    options: [
      "U for units",
      "mg for milligrams",
      "QD for daily",
      "mL for millilitres",
      "IU for international units",
      "IV for intravenous"
    ],
    correctAnswers: [0, 2, 4],
    type: "sata",
    rationaleCorrect: "'U' can be mistaken for '0' or '4', 'QD' can be confused with 'QID' (four times daily), and 'IU' can be misread as 'IV.' These abbreviations are on the 'Do Not Use' list to prevent medication errors. The full words should be written instead.",
    rationaleIncorrect: [
      "U for units is on the Do Not Use list",
      "mg for milligrams is an accepted abbreviation",
      "QD for daily is on the Do Not Use list",
      "mL for millilitres is an accepted abbreviation",
      "IU for international units is on the Do Not Use list",
      "IV for intravenous is an accepted abbreviation"
    ],
    difficulty: 2,
    bloomLevel: "application",
    clinicalCorrelation: "Using prohibited abbreviations is a leading cause of medication errors. Nurses must use approved abbreviations to ensure patient safety.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["medical terminology", "abbreviations", "patient safety", "medication errors", "Do Not Use list"],
    estimatedTimeSeconds: 60
  },
  {
    id: "pn-012",
    course: "pre-nursing",
    topic: "Medical Terminology",
    subtopic: "Root Words",
    stem: "The root word 'hepat' refers to which organ?",
    options: ["Stomach", "Liver", "Spleen", "Pancreas"],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "The root word 'hepat' or 'hepato' refers to the liver. It appears in terms such as hepatitis (inflammation of the liver), hepatomegaly (enlarged liver), and hepatocyte (liver cell).",
    rationaleIncorrect: [
      "Stomach is referred to by the root word 'gastr'",
      "Spleen is referred to by the root word 'splen'",
      "Pancreas is referred to by the root word 'pancreat'"
    ],
    difficulty: 1,
    bloomLevel: "recall",
    clinicalCorrelation: "Knowing that 'hepat' means liver helps nurses understand conditions such as hepatitis and interpret liver function test results.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["medical terminology", "root words", "liver", "hepatic"],
    estimatedTimeSeconds: 30
  },

  // ===== BASIC MATH & DIMENSIONAL ANALYSIS (pn-013 to pn-024) =====
  {
    id: "pn-013",
    course: "pre-nursing",
    topic: "Basic Math & Dimensional Analysis",
    subtopic: "Unit Conversion",
    stem: "How many milligrams (mg) are in 1 gram (g)?",
    options: ["10 mg", "100 mg", "1000 mg", "10000 mg"],
    correctAnswer: 2,
    type: "mcq",
    rationaleCorrect: "There are 1000 milligrams in 1 gram. The prefix 'milli-' means one-thousandth, so 1 mg = 0.001 g, and conversely, 1 g = 1000 mg. This is a fundamental metric conversion used in medication dosing.",
    rationaleIncorrect: [
      "10 mg is incorrect; this would be 0.01 g",
      "100 mg is incorrect; this would be 0.1 g",
      "10000 mg is incorrect; this would be 10 g"
    ],
    difficulty: 1,
    bloomLevel: "recall",
    clinicalCorrelation: "Accurate metric conversions are essential for calculating medication doses and preventing medication errors.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["math", "unit conversion", "metric system", "dosage calculation"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-014",
    course: "pre-nursing",
    topic: "Basic Math & Dimensional Analysis",
    subtopic: "Dosage Calculation",
    stem: "A patient is prescribed 500 mg of amoxicillin. The medication is available in 250 mg tablets. How many tablets should the nurse administer?",
    options: ["1 tablet", "2 tablets", "3 tablets", "4 tablets"],
    correctAnswer: 1,
    type: "fill-in-blank",
    rationaleCorrect: "Using dimensional analysis: 500 mg × (1 tablet / 250 mg) = 2 tablets. The desired dose divided by the available dose equals the number of tablets to administer.",
    rationaleIncorrect: [
      "1 tablet would only provide 250 mg, which is less than the prescribed dose",
      "2 tablets is the correct answer",
      "3 tablets would provide 750 mg, exceeding the prescribed dose",
      "4 tablets would provide 1000 mg, double the prescribed dose"
    ],
    difficulty: 1,
    bloomLevel: "application",
    clinicalCorrelation: "Dosage calculations are a critical nursing competency. Errors in calculation can lead to underdosing or overdosing, both of which can harm patients.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["math", "dosage calculation", "dimensional analysis", "medication administration"],
    estimatedTimeSeconds: 45
  },
  {
    id: "pn-015",
    course: "pre-nursing",
    topic: "Basic Math & Dimensional Analysis",
    subtopic: "Unit Conversion",
    stem: "Convert 2.5 litres (L) to millilitres (mL).",
    options: ["25 mL", "250 mL", "2500 mL", "25000 mL"],
    correctAnswer: 2,
    type: "fill-in-blank",
    rationaleCorrect: "There are 1000 mL in 1 L. Therefore, 2.5 L × 1000 mL/L = 2500 mL. This conversion is commonly used when calculating IV fluid volumes and intake/output records.",
    rationaleIncorrect: [
      "25 mL is incorrect; this would be 0.025 L",
      "250 mL is incorrect; this would be 0.25 L",
      "2500 mL is the correct answer",
      "25000 mL is incorrect; this would be 25 L"
    ],
    difficulty: 1,
    bloomLevel: "application",
    clinicalCorrelation: "Fluid volume conversions are used daily in nursing practice for monitoring intake and output and calculating IV fluid rates.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["math", "unit conversion", "litres", "millilitres", "fluid balance"],
    estimatedTimeSeconds: 45
  },
  {
    id: "pn-016",
    course: "pre-nursing",
    topic: "Basic Math & Dimensional Analysis",
    subtopic: "Dosage Calculation",
    stem: "A physician orders 0.25 mg of digoxin. The pharmacy dispenses 0.125 mg tablets. How many tablets should be administered?",
    options: ["0.5 tablet", "1 tablet", "2 tablets", "3 tablets"],
    correctAnswer: 2,
    type: "fill-in-blank",
    rationaleCorrect: "Using dimensional analysis: 0.25 mg ÷ 0.125 mg/tablet = 2 tablets. Always verify calculations with a second nurse when administering high-alert medications like digoxin.",
    rationaleIncorrect: [
      "0.5 tablet would provide only 0.0625 mg",
      "1 tablet would provide only 0.125 mg, which is half the prescribed dose",
      "2 tablets is the correct answer",
      "3 tablets would provide 0.375 mg, exceeding the prescribed dose"
    ],
    difficulty: 2,
    bloomLevel: "application",
    clinicalCorrelation: "Digoxin has a narrow therapeutic range. Accurate calculation is critical to prevent toxicity.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["math", "dosage calculation", "digoxin", "high-alert medication"],
    estimatedTimeSeconds: 60
  },
  {
    id: "pn-017",
    course: "pre-nursing",
    topic: "Basic Math & Dimensional Analysis",
    subtopic: "Weight Conversion",
    stem: "A patient weighs 176 pounds (lbs). What is their approximate weight in kilograms (kg)?",
    options: ["60 kg", "70 kg", "80 kg", "90 kg"],
    correctAnswer: 2,
    type: "fill-in-blank",
    rationaleCorrect: "To convert pounds to kilograms, divide by 2.2. Therefore, 176 lbs ÷ 2.2 = 80 kg. This conversion is necessary because medication dosages are often calculated based on weight in kilograms.",
    rationaleIncorrect: [
      "60 kg would be approximately 132 lbs",
      "70 kg would be approximately 154 lbs",
      "80 kg is the correct answer",
      "90 kg would be approximately 198 lbs"
    ],
    difficulty: 1,
    bloomLevel: "application",
    clinicalCorrelation: "Weight-based dosing requires accurate conversion between pounds and kilograms. Many medications, especially in pediatric and critical care, are dosed per kilogram.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["math", "weight conversion", "pounds", "kilograms", "dosing"],
    estimatedTimeSeconds: 45
  },
  {
    id: "pn-018",
    course: "pre-nursing",
    topic: "Basic Math & Dimensional Analysis",
    subtopic: "Fractions and Decimals",
    stem: "Express 3/4 as a decimal:",
    options: ["0.25", "0.50", "0.75", "1.25"],
    correctAnswer: 2,
    type: "mcq",
    rationaleCorrect: "To convert a fraction to a decimal, divide the numerator by the denominator: 3 ÷ 4 = 0.75. Understanding fraction-to-decimal conversion is essential for accurate medication calculations.",
    rationaleIncorrect: [
      "0.25 is the decimal equivalent of 1/4",
      "0.50 is the decimal equivalent of 1/2",
      "1.25 is the decimal equivalent of 5/4 or 1 and 1/4"
    ],
    difficulty: 1,
    bloomLevel: "recall",
    clinicalCorrelation: "Fractions and decimals are used interchangeably in medication orders. Nurses must be proficient in converting between them.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["math", "fractions", "decimals", "foundations"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-019",
    course: "pre-nursing",
    topic: "Basic Math & Dimensional Analysis",
    subtopic: "Percentages",
    stem: "A solution is labelled as 0.9% normal saline. This means there are how many grams of sodium chloride per 100 mL?",
    options: ["0.09 g", "0.9 g", "9 g", "90 g"],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "A percentage solution indicates grams of solute per 100 mL of solution. Therefore, 0.9% means 0.9 grams of sodium chloride per 100 mL of solution. This is the most commonly used isotonic IV fluid.",
    rationaleIncorrect: [
      "0.09 g per 100 mL would represent a 0.09% solution",
      "9 g per 100 mL would represent a 9% solution",
      "90 g per 100 mL would represent a 90% solution, which is not a clinical concentration"
    ],
    difficulty: 2,
    bloomLevel: "understanding",
    clinicalCorrelation: "Understanding solution concentrations is necessary for safe IV fluid administration and recognizing isotonic versus hypertonic solutions.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["math", "percentages", "solutions", "normal saline", "IV fluids"],
    estimatedTimeSeconds: 45
  },
  {
    id: "pn-020",
    course: "pre-nursing",
    topic: "Basic Math & Dimensional Analysis",
    subtopic: "IV Flow Rate",
    stem: "An IV infusion of 1000 mL is to run over 8 hours. What is the flow rate in mL/hour?",
    options: ["100 mL/hr", "125 mL/hr", "150 mL/hr", "200 mL/hr"],
    correctAnswer: 1,
    type: "fill-in-blank",
    rationaleCorrect: "Flow rate = Total volume ÷ Time. Therefore, 1000 mL ÷ 8 hours = 125 mL/hr. This is a basic IV calculation that nurses perform routinely when programming infusion pumps.",
    rationaleIncorrect: [
      "100 mL/hr would require 10 hours to infuse 1000 mL",
      "125 mL/hr is the correct answer",
      "150 mL/hr would infuse 1000 mL in approximately 6.7 hours",
      "200 mL/hr would infuse 1000 mL in 5 hours"
    ],
    difficulty: 2,
    bloomLevel: "application",
    clinicalCorrelation: "Accurate IV flow rate calculations prevent fluid overload or underhydration, both of which can compromise patient outcomes.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["math", "IV flow rate", "infusion", "dosage calculation"],
    estimatedTimeSeconds: 60
  },
  {
    id: "pn-021",
    course: "pre-nursing",
    topic: "Basic Math & Dimensional Analysis",
    subtopic: "Temperature Conversion",
    stem: "Convert 38.5°C to Fahrenheit (°F). Which is the closest value?",
    options: ["99.5°F", "100.1°F", "101.3°F", "102.5°F"],
    correctAnswer: 2,
    type: "fill-in-blank",
    rationaleCorrect: "The formula is °F = (°C × 9/5) + 32. Therefore, (38.5 × 1.8) + 32 = 69.3 + 32 = 101.3°F. Temperature conversion is important when different scales are used in clinical settings.",
    rationaleIncorrect: [
      "99.5°F is approximately 37.5°C",
      "100.1°F is approximately 37.8°C",
      "101.3°F is the correct conversion of 38.5°C",
      "102.5°F is approximately 39.2°C"
    ],
    difficulty: 2,
    bloomLevel: "application",
    clinicalCorrelation: "Nurses must convert temperatures accurately to identify fever (pyrexia) and communicate findings to the healthcare team using the appropriate scale.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["math", "temperature conversion", "Celsius", "Fahrenheit"],
    estimatedTimeSeconds: 60
  },
  {
    id: "pn-022",
    course: "pre-nursing",
    topic: "Basic Math & Dimensional Analysis",
    subtopic: "Ratio and Proportion",
    stem: "If a medication comes in a concentration of 100 mg per 5 mL, how many mL are needed to administer 250 mg?",
    options: ["7.5 mL", "10 mL", "12.5 mL", "15 mL"],
    correctAnswer: 2,
    type: "mcq",
    rationaleCorrect: "Using ratio and proportion: 100 mg/5 mL = 250 mg/x mL. Cross-multiply: 100x = 1250, x = 12.5 mL. This method is a reliable approach for calculating liquid medication doses.",
    rationaleIncorrect: [
      "7.5 mL would deliver 150 mg",
      "10 mL would deliver 200 mg",
      "15 mL would deliver 300 mg"
    ],
    difficulty: 2,
    bloomLevel: "application",
    clinicalCorrelation: "Liquid medication calculations using ratio and proportion ensure accurate dosing, especially important for pediatric and geriatric patients.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["math", "ratio and proportion", "liquid medication", "dosage calculation"],
    estimatedTimeSeconds: 60
  },
  {
    id: "pn-023",
    course: "pre-nursing",
    topic: "Basic Math & Dimensional Analysis",
    subtopic: "Rounding Rules",
    stem: "When calculating a medication dose of 1.67 tablets, the nurse should:",
    options: [
      "Administer 1.5 tablets",
      "Administer 2 tablets",
      "Contact the prescriber to clarify the order",
      "Administer 1 tablet and discard the rest"
    ],
    correctAnswer: 2,
    type: "mcq",
    rationaleCorrect: "When a dosage calculation results in an unusual number of tablets (e.g., 1.67), the nurse should contact the prescriber to clarify the order. Tablets cannot always be accurately split into thirds, and the calculated dose may indicate an error in the order.",
    rationaleIncorrect: [
      "Administering 1.5 tablets would provide a different dose than prescribed",
      "Administering 2 tablets would provide more than the prescribed dose without authorization",
      "Administering only 1 tablet would provide less than the prescribed dose"
    ],
    difficulty: 2,
    bloomLevel: "application",
    clinicalCorrelation: "Unusual calculation results may indicate a prescribing error. Nurses must use critical thinking and verify with the prescriber rather than assume.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["math", "rounding", "medication safety", "critical thinking"],
    estimatedTimeSeconds: 45
  },
  {
    id: "pn-024",
    course: "pre-nursing",
    topic: "Basic Math & Dimensional Analysis",
    subtopic: "Metric System",
    stem: "How many micrograms (mcg) are in 1 milligram (mg)?",
    options: ["10 mcg", "100 mcg", "1000 mcg", "10000 mcg"],
    correctAnswer: 2,
    type: "mcq",
    rationaleCorrect: "There are 1000 micrograms in 1 milligram. The prefix 'micro-' means one-millionth, while 'milli-' means one-thousandth. Moving from mg to mcg requires multiplying by 1000.",
    rationaleIncorrect: [
      "10 mcg in 1 mg is incorrect; this confuses the metric scale",
      "100 mcg in 1 mg is incorrect",
      "10000 mcg in 1 mg is incorrect; this would mean 10 mg"
    ],
    difficulty: 1,
    bloomLevel: "recall",
    clinicalCorrelation: "Medications such as levothyroxine and fentanyl are dosed in micrograms. Confusing mcg with mg can result in a 1000-fold dosing error.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["math", "metric system", "micrograms", "milligrams", "conversion"],
    estimatedTimeSeconds: 30
  },

  // ===== VITAL SIGNS BASICS (pn-025 to pn-034) =====
  {
    id: "pn-025",
    course: "pre-nursing",
    topic: "Vital Signs Basics",
    subtopic: "Normal Ranges",
    stem: "What is the normal resting heart rate range for a healthy adult?",
    options: ["40-60 bpm", "60-100 bpm", "100-120 bpm", "80-140 bpm"],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "The normal resting heart rate for a healthy adult is 60-100 beats per minute (bpm). Rates below 60 bpm are classified as bradycardia, and rates above 100 bpm are classified as tachycardia.",
    rationaleIncorrect: [
      "40-60 bpm would generally be considered bradycardia in most adults",
      "100-120 bpm exceeds the normal resting range and may indicate tachycardia",
      "80-140 bpm is too broad and includes tachycardic rates"
    ],
    difficulty: 1,
    bloomLevel: "recall",
    clinicalCorrelation: "Monitoring heart rate is a fundamental nursing assessment that helps detect early signs of cardiovascular compromise, infection, or pain.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["vital signs", "heart rate", "normal ranges", "assessment"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-026",
    course: "pre-nursing",
    topic: "Vital Signs Basics",
    subtopic: "Blood Pressure",
    stem: "A blood pressure reading of 120/80 mmHg represents which values?",
    options: [
      "Diastolic/systolic pressure",
      "Systolic/diastolic pressure",
      "Mean arterial pressure/pulse pressure",
      "Venous/arterial pressure"
    ],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "Blood pressure is recorded as systolic pressure over diastolic pressure. The systolic (120 mmHg) represents the pressure during ventricular contraction, and the diastolic (80 mmHg) represents the pressure during ventricular relaxation.",
    rationaleIncorrect: [
      "The first number is always systolic, not diastolic",
      "Mean arterial pressure and pulse pressure are derived calculations, not direct readings",
      "Blood pressure measures arterial pressure, not venous pressure"
    ],
    difficulty: 1,
    bloomLevel: "recall",
    clinicalCorrelation: "Accurate blood pressure measurement and interpretation are essential nursing skills for detecting hypertension, hypotension, and changes in cardiovascular status.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["vital signs", "blood pressure", "systolic", "diastolic", "assessment"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-027",
    course: "pre-nursing",
    topic: "Vital Signs Basics",
    subtopic: "Temperature",
    stem: "Which route for temperature measurement is considered the most accurate reflection of core body temperature?",
    options: ["Oral", "Axillary", "Rectal", "Tympanic"],
    correctAnswer: 2,
    type: "mcq",
    rationaleCorrect: "The rectal route is considered the most accurate measurement of core body temperature because it is less affected by environmental factors. It is approximately 0.5°C higher than the oral temperature reading.",
    rationaleIncorrect: [
      "Oral temperature is reliable but can be affected by recently consumed hot or cold foods/fluids",
      "Axillary temperature is the least accurate and reads lower than core temperature",
      "Tympanic temperature is quick but can be affected by improper technique or cerumen"
    ],
    difficulty: 1,
    bloomLevel: "recall",
    clinicalCorrelation: "Nurses select the appropriate temperature route based on the patient's age, condition, and level of consciousness to ensure accurate readings.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["vital signs", "temperature", "core temperature", "rectal", "assessment"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-028",
    course: "pre-nursing",
    topic: "Vital Signs Basics",
    subtopic: "Respiratory Rate",
    stem: "The normal respiratory rate for an adult at rest is:",
    options: ["8-12 breaths/min", "12-20 breaths/min", "20-30 breaths/min", "30-40 breaths/min"],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "The normal respiratory rate for an adult at rest is 12-20 breaths per minute. Rates below 12 may indicate respiratory depression, and rates above 20 may indicate respiratory distress, pain, or anxiety.",
    rationaleIncorrect: [
      "8-12 breaths/min is below normal and may indicate respiratory depression",
      "20-30 breaths/min exceeds normal adult range and suggests tachypnea",
      "30-40 breaths/min is the normal range for infants, not adults"
    ],
    difficulty: 1,
    bloomLevel: "recall",
    clinicalCorrelation: "Respiratory rate is often called the 'neglected vital sign.' Changes in respiratory rate can be an early indicator of patient deterioration.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["vital signs", "respiratory rate", "normal ranges", "assessment"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-029",
    course: "pre-nursing",
    topic: "Vital Signs Basics",
    subtopic: "Oxygen Saturation",
    stem: "A normal oxygen saturation (SpO2) reading for a healthy adult is:",
    options: ["85-90%", "90-94%", "95-100%", "100-105%"],
    correctAnswer: 2,
    type: "mcq",
    rationaleCorrect: "Normal oxygen saturation for a healthy adult is 95-100%. Values below 95% indicate hypoxemia and may require supplemental oxygen. An SpO2 below 90% is considered a medical emergency.",
    rationaleIncorrect: [
      "85-90% indicates significant hypoxemia requiring immediate intervention",
      "90-94% is below normal and warrants further assessment and possible supplemental oxygen",
      "Oxygen saturation cannot exceed 100%"
    ],
    difficulty: 1,
    bloomLevel: "recall",
    clinicalCorrelation: "Pulse oximetry provides a non-invasive method to monitor oxygenation. Nurses must assess perfusion to the monitoring site for accurate readings.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["vital signs", "oxygen saturation", "SpO2", "pulse oximetry"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-030",
    course: "pre-nursing",
    topic: "Vital Signs Basics",
    subtopic: "Blood Pressure Technique",
    stem: "When measuring blood pressure, the nurse should place the stethoscope over which artery?",
    options: ["Radial artery", "Brachial artery", "Carotid artery", "Femoral artery"],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "The brachial artery is the standard site for auscultating blood pressure. It is located on the medial aspect of the antecubital fossa. The stethoscope is placed over this artery to listen for Korotkoff sounds during deflation of the cuff.",
    rationaleIncorrect: [
      "The radial artery is used for pulse assessment but not standard blood pressure auscultation",
      "The carotid artery is used for pulse checks during emergencies, not blood pressure measurement",
      "The femoral artery is not a standard site for blood pressure measurement in routine practice"
    ],
    difficulty: 1,
    bloomLevel: "recall",
    clinicalCorrelation: "Correct placement of the stethoscope over the brachial artery is essential for obtaining accurate blood pressure readings.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["vital signs", "blood pressure", "brachial artery", "technique"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-031",
    course: "pre-nursing",
    topic: "Vital Signs Basics",
    subtopic: "Pain Assessment",
    stem: "Pain is often referred to as the 'fifth vital sign.' Which scale is most commonly used to assess pain intensity in adults?",
    options: [
      "Glasgow Coma Scale",
      "Numeric Rating Scale (0-10)",
      "Braden Scale",
      "Morse Fall Scale"
    ],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "The Numeric Rating Scale (NRS) asks patients to rate their pain on a scale from 0 (no pain) to 10 (worst possible pain). It is the most widely used tool for self-reported pain intensity in adults who can communicate.",
    rationaleIncorrect: [
      "The Glasgow Coma Scale assesses level of consciousness, not pain",
      "The Braden Scale assesses risk for pressure injuries",
      "The Morse Fall Scale assesses fall risk"
    ],
    difficulty: 1,
    bloomLevel: "understanding",
    clinicalCorrelation: "Pain assessment is a nursing priority. Using a standardized tool ensures consistent communication about pain levels and guides treatment decisions.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["vital signs", "pain assessment", "numeric rating scale", "fifth vital sign"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-032",
    course: "pre-nursing",
    topic: "Vital Signs Basics",
    subtopic: "Orthostatic Vitals",
    stem: "When assessing for orthostatic hypotension, the nurse should measure blood pressure in which positions?",
    options: [
      "Sitting only",
      "Lying, sitting, and standing",
      "Standing only",
      "Left side-lying and right side-lying"
    ],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "Orthostatic blood pressure assessment involves measuring blood pressure and pulse in three positions: lying (supine), sitting, and standing. A drop of 20 mmHg systolic or 10 mmHg diastolic upon position change indicates orthostatic hypotension.",
    rationaleIncorrect: [
      "Sitting only would not capture positional changes in blood pressure",
      "Standing only would miss baseline measurements in other positions",
      "Side-lying positions are not part of the standard orthostatic assessment"
    ],
    difficulty: 2,
    bloomLevel: "understanding",
    clinicalCorrelation: "Orthostatic hypotension increases fall risk. Nurses assess for this in patients who are post-operative, dehydrated, or on antihypertensive medications.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["vital signs", "orthostatic hypotension", "blood pressure", "fall prevention"],
    estimatedTimeSeconds: 45
  },
  {
    id: "pn-033",
    course: "pre-nursing",
    topic: "Vital Signs Basics",
    subtopic: "Factors Affecting Vital Signs",
    stem: "Which of the following factors can cause an elevated heart rate? (Select all that apply)",
    options: [
      "Fever",
      "Pain",
      "Anxiety",
      "Administration of beta-blockers",
      "Dehydration"
    ],
    correctAnswers: [0, 1, 2, 4],
    type: "sata",
    rationaleCorrect: "Fever, pain, anxiety, and dehydration all stimulate the sympathetic nervous system, resulting in an increased heart rate. The body compensates for fluid loss, infection, and stress by increasing cardiac output through a faster heart rate.",
    rationaleIncorrect: [
      "Fever causes an increase in metabolic demand and heart rate",
      "Pain activates the sympathetic nervous system, increasing heart rate",
      "Anxiety triggers a fight-or-flight response with increased heart rate",
      "Beta-blockers decrease heart rate by blocking sympathetic stimulation",
      "Dehydration reduces blood volume, causing compensatory tachycardia"
    ],
    difficulty: 2,
    bloomLevel: "understanding",
    clinicalCorrelation: "Identifying the cause of tachycardia is essential for appropriate nursing interventions, whether addressing pain, fever, or fluid replacement.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["vital signs", "heart rate", "tachycardia", "factors", "assessment"],
    estimatedTimeSeconds: 60
  },
  {
    id: "pn-034",
    course: "pre-nursing",
    topic: "Vital Signs Basics",
    subtopic: "Pulse Assessment",
    stem: "When counting a patient's pulse, the nurse should assess for at least how many seconds if the rhythm is regular?",
    options: ["15 seconds", "30 seconds", "60 seconds", "120 seconds"],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "For a regular pulse, the nurse counts for 30 seconds and multiplies by 2 to obtain the rate per minute. If the rhythm is irregular, the nurse should count for a full 60 seconds to obtain an accurate rate.",
    rationaleIncorrect: [
      "15 seconds is too brief to detect subtle rate or rhythm variations",
      "60 seconds is used when the rhythm is irregular, not required for a regular rhythm",
      "120 seconds is not a standard assessment duration for pulse"
    ],
    difficulty: 1,
    bloomLevel: "recall",
    clinicalCorrelation: "Accurate pulse assessment includes evaluating rate, rhythm, and quality to detect cardiac abnormalities early.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["vital signs", "pulse", "assessment technique", "heart rate"],
    estimatedTimeSeconds: 30
  },

  // ===== INFECTION PREVENTION & PPE (pn-035 to pn-044) =====
  {
    id: "pn-035",
    course: "pre-nursing",
    topic: "Infection Prevention & PPE",
    subtopic: "Hand Hygiene",
    stem: "According to infection prevention guidelines, the single most effective way to prevent the spread of infection is:",
    options: [
      "Wearing gloves at all times",
      "Hand hygiene",
      "Using antibiotics prophylactically",
      "Isolating all patients"
    ],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "Hand hygiene is recognized as the single most effective measure to prevent the transmission of healthcare-associated infections. It includes both handwashing with soap and water and the use of alcohol-based hand rub.",
    rationaleIncorrect: [
      "Gloves are important but do not replace hand hygiene and can harbour organisms if not changed properly",
      "Prophylactic antibiotics contribute to antimicrobial resistance and are not a primary prevention strategy",
      "Isolating all patients is not practical or necessary; isolation is used based on specific precautions"
    ],
    difficulty: 1,
    bloomLevel: "recall",
    clinicalCorrelation: "Nurses perform hand hygiene before and after every patient contact, making it the cornerstone of infection prevention in clinical practice.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["infection prevention", "hand hygiene", "patient safety", "foundations"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-036",
    course: "pre-nursing",
    topic: "Infection Prevention & PPE",
    subtopic: "Chain of Infection",
    stem: "Which component of the chain of infection is broken when a nurse performs hand hygiene?",
    options: [
      "Infectious agent",
      "Reservoir",
      "Mode of transmission",
      "Susceptible host"
    ],
    correctAnswer: 2,
    type: "mcq",
    rationaleCorrect: "Hand hygiene breaks the chain of infection at the mode of transmission. By removing or killing microorganisms on the hands, the nurse prevents the direct contact transmission of pathogens from one surface or person to another.",
    rationaleIncorrect: [
      "The infectious agent is the pathogen itself; hand hygiene does not eliminate the original source",
      "The reservoir is where the pathogen lives and multiplies; hand hygiene does not address the reservoir",
      "The susceptible host is the person at risk; hand hygiene does not change host susceptibility"
    ],
    difficulty: 2,
    bloomLevel: "understanding",
    clinicalCorrelation: "Understanding the chain of infection helps nurses identify the most effective interventions to prevent infection transmission at each link.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["infection prevention", "chain of infection", "hand hygiene", "transmission"],
    estimatedTimeSeconds: 45
  },
  {
    id: "pn-037",
    course: "pre-nursing",
    topic: "Infection Prevention & PPE",
    subtopic: "PPE Donning Order",
    stem: "What is the correct order for donning (putting on) personal protective equipment (PPE)?",
    options: [
      "Gloves, gown, mask, eye protection",
      "Gown, mask, eye protection, gloves",
      "Mask, gown, gloves, eye protection",
      "Eye protection, mask, gown, gloves"
    ],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "The correct order for donning PPE is gown first, then mask or respirator, followed by eye protection (goggles or face shield), and finally gloves. This order ensures each item is properly secured and that the gloves cover the gown cuffs.",
    rationaleIncorrect: [
      "Putting gloves on first is incorrect; gloves are the last item to be donned",
      "The mask should be applied before eye protection to ensure a proper seal",
      "Eye protection should not be applied before the mask and gown"
    ],
    difficulty: 2,
    bloomLevel: "recall",
    clinicalCorrelation: "Correct donning sequence prevents contamination of PPE and protects the nurse from exposure to infectious agents.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["infection prevention", "PPE", "donning", "sequence", "safety"],
    estimatedTimeSeconds: 45
  },
  {
    id: "pn-038",
    course: "pre-nursing",
    topic: "Infection Prevention & PPE",
    subtopic: "PPE Doffing Order",
    stem: "When removing (doffing) PPE, which item should be removed first?",
    options: ["Mask", "Gown", "Gloves", "Eye protection"],
    correctAnswer: 2,
    type: "mcq",
    rationaleCorrect: "Gloves are removed first because they are the most contaminated item. The correct doffing order is gloves, then eye protection (or face shield), then gown, and finally the mask or respirator. Hand hygiene is performed after removing gloves and again after all PPE is removed.",
    rationaleIncorrect: [
      "The mask is the last item removed to maintain respiratory protection until the end",
      "The gown is removed after gloves and eye protection",
      "Eye protection is removed after gloves"
    ],
    difficulty: 2,
    bloomLevel: "recall",
    clinicalCorrelation: "Incorrect doffing is a major source of self-contamination. Nurses must follow the proper sequence to protect themselves from infection.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["infection prevention", "PPE", "doffing", "sequence", "safety"],
    estimatedTimeSeconds: 45
  },
  {
    id: "pn-039",
    course: "pre-nursing",
    topic: "Infection Prevention & PPE",
    subtopic: "Standard Precautions",
    stem: "Standard precautions are used for:",
    options: [
      "Only patients with known infections",
      "Only patients in isolation rooms",
      "All patients regardless of diagnosis",
      "Only immunocompromised patients"
    ],
    correctAnswer: 2,
    type: "mcq",
    rationaleCorrect: "Standard precautions are applied to all patients regardless of their diagnosis or presumed infection status. They are based on the principle that all blood, body fluids, non-intact skin, and mucous membranes may contain transmissible infectious agents.",
    rationaleIncorrect: [
      "Standard precautions are not limited to patients with known infections",
      "They apply in all care settings, not just isolation rooms",
      "They apply to all patients, not only those who are immunocompromised"
    ],
    difficulty: 1,
    bloomLevel: "understanding",
    clinicalCorrelation: "Standard precautions form the foundation of infection prevention and include hand hygiene, PPE use, respiratory hygiene, and safe injection practices.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["infection prevention", "standard precautions", "universal precautions", "safety"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-040",
    course: "pre-nursing",
    topic: "Infection Prevention & PPE",
    subtopic: "Transmission-Based Precautions",
    stem: "A patient with active pulmonary tuberculosis requires which type of precautions?",
    options: ["Contact precautions", "Droplet precautions", "Airborne precautions", "Standard precautions only"],
    correctAnswer: 2,
    type: "mcq",
    rationaleCorrect: "Active pulmonary tuberculosis requires airborne precautions because the TB bacillus is transmitted via small droplet nuclei that remain suspended in the air. This requires a negative-pressure isolation room and an N95 respirator for healthcare workers.",
    rationaleIncorrect: [
      "Contact precautions are used for organisms spread by direct or indirect contact (e.g., MRSA, C. difficile)",
      "Droplet precautions are for organisms spread by large respiratory droplets (e.g., influenza, pertussis)",
      "Standard precautions alone are insufficient for TB due to its airborne transmission"
    ],
    difficulty: 2,
    bloomLevel: "understanding",
    clinicalCorrelation: "Nurses must identify the correct isolation precautions to protect themselves and other patients from airborne pathogens like tuberculosis.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["infection prevention", "airborne precautions", "tuberculosis", "isolation"],
    estimatedTimeSeconds: 45
  },
  {
    id: "pn-041",
    course: "pre-nursing",
    topic: "Infection Prevention & PPE",
    subtopic: "Sterile Technique",
    stem: "Which action would break sterile technique during a sterile field setup?",
    options: [
      "Keeping the sterile field at waist level",
      "Reaching over the sterile field",
      "Opening sterile packages away from the body",
      "Using sterile gloves to handle sterile supplies"
    ],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "Reaching over a sterile field contaminates it because non-sterile items (such as the nurse's arm or clothing) pass over the sterile area, potentially dropping microorganisms. Sterile supplies should be added to the field from the edges.",
    rationaleIncorrect: [
      "Keeping the sterile field at waist level or above is correct technique",
      "Opening packages away from the body is the correct method to prevent contamination",
      "Using sterile gloves to handle sterile supplies maintains sterility"
    ],
    difficulty: 2,
    bloomLevel: "application",
    clinicalCorrelation: "Maintaining sterile technique is critical during procedures such as catheter insertion, wound care, and surgical preparation to prevent infection.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["infection prevention", "sterile technique", "asepsis", "procedure"],
    estimatedTimeSeconds: 45
  },
  {
    id: "pn-042",
    course: "pre-nursing",
    topic: "Infection Prevention & PPE",
    subtopic: "Sharps Safety",
    stem: "After administering an injection, the nurse should dispose of the needle by:",
    options: [
      "Recapping the needle before disposal",
      "Placing it in a puncture-resistant sharps container immediately",
      "Bending the needle to prevent reuse",
      "Placing it in the regular waste bin"
    ],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "Used needles should be disposed of immediately in a designated puncture-resistant sharps container at the point of use. This prevents needlestick injuries and potential exposure to bloodborne pathogens.",
    rationaleIncorrect: [
      "Recapping needles is a leading cause of needlestick injuries and should be avoided",
      "Bending needles increases the risk of injury and is not recommended",
      "Regular waste bins are not appropriate for sharps disposal and pose injury risks"
    ],
    difficulty: 1,
    bloomLevel: "understanding",
    clinicalCorrelation: "Needlestick injuries can expose nurses to serious bloodborne infections. Proper sharps disposal is a fundamental safety practice.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["infection prevention", "sharps safety", "needlestick prevention", "workplace safety"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-043",
    course: "pre-nursing",
    topic: "Infection Prevention & PPE",
    subtopic: "Hand Hygiene Indications",
    stem: "Which of the following are indications for performing hand hygiene? (Select all that apply)",
    options: [
      "Before touching a patient",
      "After touching a patient",
      "After touching patient surroundings",
      "Before putting on gloves",
      "After an aseptic procedure only"
    ],
    correctAnswers: [0, 1, 2, 3],
    type: "sata",
    rationaleCorrect: "Hand hygiene should be performed before touching a patient, after touching a patient, after touching patient surroundings, and before donning gloves. Hand hygiene should also be performed both before and after aseptic procedures, not only after.",
    rationaleIncorrect: [
      "Before touching a patient is a correct indication",
      "After touching a patient is a correct indication",
      "After touching patient surroundings is a correct indication",
      "Before putting on gloves is a correct indication",
      "Hand hygiene is required both before and after aseptic procedures, not only after"
    ],
    difficulty: 2,
    bloomLevel: "application",
    clinicalCorrelation: "The 'moments of hand hygiene' guide nurses to perform hand hygiene at specific critical points during patient care to prevent cross-contamination.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["infection prevention", "hand hygiene", "moments", "patient safety"],
    estimatedTimeSeconds: 60
  },
  {
    id: "pn-044",
    course: "pre-nursing",
    topic: "Infection Prevention & PPE",
    subtopic: "Surgical Asepsis",
    stem: "A one-inch border around a sterile drape is considered:",
    options: ["Sterile", "Clean", "Contaminated", "Disinfected"],
    correctAnswer: 2,
    type: "mcq",
    rationaleCorrect: "The outer one-inch (2.5 cm) border of a sterile drape is considered contaminated because it is in contact with the non-sterile surface beneath. Only the area inside this border is considered sterile.",
    rationaleIncorrect: [
      "The border is not sterile because it contacts non-sterile surfaces",
      "Clean is not a sterility classification used in this context",
      "Disinfected is a different level of microbial reduction and does not apply here"
    ],
    difficulty: 2,
    bloomLevel: "understanding",
    clinicalCorrelation: "Recognizing the contaminated border prevents nurses from placing sterile supplies on the non-sterile edge, maintaining the integrity of the sterile field.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["infection prevention", "sterile field", "surgical asepsis", "contamination"],
    estimatedTimeSeconds: 45
  },

  // ===== COMMUNICATION & DOCUMENTATION BASICS (pn-045 to pn-052) =====
  {
    id: "pn-045",
    course: "pre-nursing",
    topic: "Communication & Documentation Basics",
    subtopic: "Therapeutic Communication",
    stem: "Which of the following is an example of therapeutic communication?",
    options: [
      "\"Why did you do that?\"",
      "\"Tell me more about what you are feeling.\"",
      "\"Don't worry, everything will be fine.\"",
      "\"I know exactly how you feel.\""
    ],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "\"Tell me more about what you are feeling\" is an open-ended question that encourages the patient to express their thoughts and emotions. This technique shows active listening and promotes a trusting nurse-patient relationship.",
    rationaleIncorrect: [
      "\"Why did you do that?\" is a non-therapeutic response that may make the patient feel defensive",
      "\"Don't worry, everything will be fine\" offers false reassurance and dismisses the patient's concerns",
      "\"I know exactly how you feel\" is a non-therapeutic response that minimizes the patient's individual experience"
    ],
    difficulty: 1,
    bloomLevel: "understanding",
    clinicalCorrelation: "Therapeutic communication techniques are essential for building trust, gathering accurate health histories, and providing emotional support to patients.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["communication", "therapeutic communication", "open-ended questions", "nursing process"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-046",
    course: "pre-nursing",
    topic: "Communication & Documentation Basics",
    subtopic: "Documentation Principles",
    stem: "When documenting in a patient's health record, the nurse should:",
    options: [
      "Use abbreviations freely to save time",
      "Document objective and subjective data accurately and promptly",
      "Wait until the end of the shift to document all care provided",
      "Include personal opinions about the patient's behaviour"
    ],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "Documentation should be accurate, timely, and include both objective findings (measurable data) and subjective data (patient statements in quotes). Prompt documentation reduces the risk of errors and omissions.",
    rationaleIncorrect: [
      "Only approved abbreviations should be used; some abbreviations are prohibited due to safety concerns",
      "Delayed documentation increases the risk of forgetting important details",
      "Personal opinions are not appropriate in clinical documentation; only factual observations should be recorded"
    ],
    difficulty: 1,
    bloomLevel: "recall",
    clinicalCorrelation: "The health record is a legal document. Accurate documentation protects both the patient and the nurse and supports continuity of care.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["documentation", "charting", "health record", "legal document"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-047",
    course: "pre-nursing",
    topic: "Communication & Documentation Basics",
    subtopic: "SBAR Communication",
    stem: "In the SBAR communication framework, the 'A' stands for:",
    options: ["Action", "Assessment", "Analysis", "Approach"],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "In SBAR, the 'A' stands for Assessment. SBAR is a structured communication tool: Situation (what is happening), Background (relevant history), Assessment (your clinical assessment of the situation), and Recommendation (what you suggest).",
    rationaleIncorrect: [
      "Action is not part of the SBAR acronym",
      "Analysis is not the correct term; Assessment captures the nurse's clinical judgment",
      "Approach is not part of the SBAR acronym"
    ],
    difficulty: 1,
    bloomLevel: "recall",
    clinicalCorrelation: "SBAR is used extensively in healthcare to provide concise, structured communication during handoffs, phone calls to physicians, and emergency situations.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["communication", "SBAR", "handoff", "patient safety"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-048",
    course: "pre-nursing",
    topic: "Communication & Documentation Basics",
    subtopic: "Active Listening",
    stem: "A patient appears anxious and states, \"I'm worried about my surgery tomorrow.\" Which response demonstrates active listening?",
    options: [
      "\"Surgery is very safe these days.\"",
      "\"You seem worried. Can you tell me more about your concerns?\"",
      "\"Your surgeon is one of the best. You'll be fine.\"",
      "\"Let me get you something to help you sleep.\""
    ],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "Reflecting the patient's feelings and asking them to elaborate demonstrates active listening. This validates the patient's emotions and opens the door for further communication, which can help address specific fears and reduce anxiety.",
    rationaleIncorrect: [
      "Stating surgery is safe dismisses the patient's individual concerns",
      "Reassuring about the surgeon does not address the patient's specific worries",
      "Offering medication does not address the emotional need expressed by the patient"
    ],
    difficulty: 2,
    bloomLevel: "application",
    clinicalCorrelation: "Active listening builds therapeutic relationships and helps nurses identify underlying concerns that may affect patient outcomes.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["communication", "active listening", "therapeutic relationship", "pre-operative"],
    estimatedTimeSeconds: 45
  },
  {
    id: "pn-049",
    course: "pre-nursing",
    topic: "Communication & Documentation Basics",
    subtopic: "Documentation Errors",
    stem: "If a documentation error is made in a patient's paper health record, the nurse should:",
    options: [
      "Use correction fluid to cover the error",
      "Draw a single line through the error, write 'error,' initial, and date it",
      "Tear out the page and rewrite it",
      "Leave it as is and document the correction elsewhere"
    ],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "The correct method to correct a documentation error in a paper record is to draw a single line through the error so it remains legible, write 'error' above or near it, and initial and date the correction. This maintains the integrity of the legal document.",
    rationaleIncorrect: [
      "Correction fluid alters the record and is never acceptable in medical documentation",
      "Removing pages from a medical record is tampering with a legal document",
      "Leaving the error uncorrected could lead to clinical misinterpretation"
    ],
    difficulty: 1,
    bloomLevel: "understanding",
    clinicalCorrelation: "Proper correction of documentation errors preserves the legal integrity of the health record and demonstrates transparency in care.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["documentation", "error correction", "legal document", "charting"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-050",
    course: "pre-nursing",
    topic: "Communication & Documentation Basics",
    subtopic: "Non-Verbal Communication",
    stem: "Which non-verbal communication technique conveys openness and attentiveness to a patient?",
    options: [
      "Crossing arms across the chest",
      "Maintaining appropriate eye contact",
      "Standing at the doorway during conversation",
      "Looking at the computer while the patient speaks"
    ],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "Maintaining appropriate eye contact conveys interest, respect, and attentiveness. It is a key non-verbal communication technique that supports therapeutic communication and helps build trust with patients.",
    rationaleIncorrect: [
      "Crossing arms can be perceived as defensive, closed, or unapproachable",
      "Standing at the doorway signals the nurse is in a hurry and not fully present",
      "Looking at the computer while the patient speaks suggests disinterest and breaks rapport"
    ],
    difficulty: 1,
    bloomLevel: "understanding",
    clinicalCorrelation: "Non-verbal cues account for a significant portion of communication. Nurses must be aware of their body language during patient interactions.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["communication", "non-verbal", "body language", "therapeutic communication"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-051",
    course: "pre-nursing",
    topic: "Communication & Documentation Basics",
    subtopic: "Interprofessional Communication",
    stem: "When communicating a critical change in patient status to the physician, the most appropriate tool to use is:",
    options: ["Progress notes", "SBAR", "Nursing care plan", "Incident report"],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "SBAR (Situation, Background, Assessment, Recommendation) is the recommended structured communication tool for reporting critical changes in patient status. It provides a concise, organized format that ensures all relevant information is communicated clearly.",
    rationaleIncorrect: [
      "Progress notes are for documenting in the chart, not for urgent verbal communication",
      "The nursing care plan outlines ongoing goals and interventions, not urgent status changes",
      "An incident report documents events after they occur and is not a communication tool for real-time patient status changes"
    ],
    difficulty: 1,
    bloomLevel: "understanding",
    clinicalCorrelation: "Using SBAR during critical situations reduces communication errors, ensures important information is conveyed, and facilitates timely decision-making.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["communication", "SBAR", "interprofessional", "critical thinking"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-052",
    course: "pre-nursing",
    topic: "Communication & Documentation Basics",
    subtopic: "Confidentiality",
    stem: "A nurse is discussing a patient's condition in the hospital hallway with a colleague. This is a violation of:",
    options: [
      "Standard precautions",
      "Chain of command",
      "Patient confidentiality",
      "Scope of practice"
    ],
    correctAnswer: 2,
    type: "mcq",
    rationaleCorrect: "Discussing patient information in public areas such as hallways, elevators, or cafeterias violates patient confidentiality. Patient health information should only be discussed in private settings with individuals who have a legitimate need to know.",
    rationaleIncorrect: [
      "Standard precautions relate to infection prevention, not information privacy",
      "Chain of command refers to the organizational hierarchy for reporting concerns",
      "Scope of practice defines the boundaries of a nurse's professional role"
    ],
    difficulty: 1,
    bloomLevel: "understanding",
    clinicalCorrelation: "Maintaining confidentiality is a legal and ethical obligation. Breaches can result in disciplinary action and loss of patient trust.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["communication", "confidentiality", "privacy", "ethics", "documentation"],
    estimatedTimeSeconds: 30
  },

  // ===== SAFETY / FALL PREVENTION / RESTRAINTS (pn-053 to pn-060) =====
  {
    id: "pn-053",
    course: "pre-nursing",
    topic: "Safety / Fall Prevention / Restraints",
    subtopic: "Fall Risk Assessment",
    stem: "Which tool is commonly used to assess a patient's risk for falls?",
    options: [
      "Braden Scale",
      "Morse Fall Scale",
      "Glasgow Coma Scale",
      "Norton Scale"
    ],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "The Morse Fall Scale assesses fall risk factors including history of falling, secondary diagnosis, ambulatory aids, IV therapy, gait, and mental status. It helps identify patients who need fall prevention interventions.",
    rationaleIncorrect: [
      "The Braden Scale assesses risk for pressure injuries, not falls",
      "The Glasgow Coma Scale assesses level of consciousness",
      "The Norton Scale assesses risk for pressure injuries"
    ],
    difficulty: 1,
    bloomLevel: "recall",
    clinicalCorrelation: "Fall prevention is a nursing priority. Early identification of high-risk patients allows nurses to implement targeted interventions such as bed alarms and non-slip footwear.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["safety", "fall prevention", "Morse Fall Scale", "risk assessment"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-054",
    course: "pre-nursing",
    topic: "Safety / Fall Prevention / Restraints",
    subtopic: "Fall Prevention Interventions",
    stem: "Which of the following are appropriate fall prevention interventions? (Select all that apply)",
    options: [
      "Keep the bed in the lowest position",
      "Ensure the call bell is within reach",
      "Apply physical restraints to all high-risk patients",
      "Use non-slip footwear for ambulating patients",
      "Keep the room well-lit",
      "Raise all four side rails"
    ],
    correctAnswers: [0, 1, 3, 4],
    type: "sata",
    rationaleCorrect: "Effective fall prevention includes keeping the bed low, ensuring the call bell is accessible, using non-slip footwear, and maintaining adequate lighting. Physical restraints are a last resort and raising all four side rails is considered a form of restraint.",
    rationaleIncorrect: [
      "Keeping the bed in the lowest position reduces injury from bed falls",
      "Ensuring the call bell is within reach allows patients to summon help",
      "Physical restraints are a last resort and are not applied to all high-risk patients",
      "Non-slip footwear prevents slipping during ambulation",
      "Good lighting helps patients see obstacles and navigate safely",
      "Raising all four side rails is considered a restraint and can increase fall risk if the patient climbs over them"
    ],
    difficulty: 2,
    bloomLevel: "application",
    clinicalCorrelation: "A combination of environmental and patient-centered interventions is most effective in preventing falls in the healthcare setting.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["safety", "fall prevention", "interventions", "patient safety"],
    estimatedTimeSeconds: 60
  },
  {
    id: "pn-055",
    course: "pre-nursing",
    topic: "Safety / Fall Prevention / Restraints",
    subtopic: "Restraint Use",
    stem: "Before applying physical restraints, the nurse must first:",
    options: [
      "Apply the restraint and document later",
      "Exhaust all alternative interventions",
      "Get verbal permission from the family",
      "Transfer the patient to a private room"
    ],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "Restraints are a last resort. The nurse must first try all alternative interventions such as reorientation, distraction, de-escalation, bed alarms, sitters, and environmental modifications before applying any physical restraint.",
    rationaleIncorrect: [
      "Restraints should never be applied without first exhausting alternatives and obtaining an order",
      "Family permission is not the primary requirement; a prescriber's order and exploration of alternatives come first",
      "Room transfer is not required before restraint application"
    ],
    difficulty: 2,
    bloomLevel: "understanding",
    clinicalCorrelation: "Restraint use is associated with physical and psychological harm. Nurses advocate for the least restrictive interventions to maintain patient dignity and safety.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["safety", "restraints", "alternatives", "patient rights", "least restrictive"],
    estimatedTimeSeconds: 45
  },
  {
    id: "pn-056",
    course: "pre-nursing",
    topic: "Safety / Fall Prevention / Restraints",
    subtopic: "Restraint Monitoring",
    stem: "When a patient is in physical restraints, how frequently should the nurse assess circulation, sensation, and movement of the restrained extremity?",
    options: ["Every 4 hours", "Every 2 hours", "Every 1 hour", "Every 15-30 minutes"],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "Neurovascular checks (circulation, sensation, and movement) of the restrained extremity should be performed at least every 2 hours, and more frequently per institutional policy. The restraint should be released periodically to allow range of motion.",
    rationaleIncorrect: [
      "Every 4 hours is too infrequent and may delay detection of complications",
      "Every 1 hour may be required in some policies but 2 hours is the standard minimum",
      "Every 15-30 minutes may be used for continuous observation but is not the standard for restraint checks"
    ],
    difficulty: 2,
    bloomLevel: "recall",
    clinicalCorrelation: "Regular assessment prevents complications such as impaired circulation, skin breakdown, and nerve damage from restraint use.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["safety", "restraints", "neurovascular checks", "monitoring"],
    estimatedTimeSeconds: 45
  },
  {
    id: "pn-057",
    course: "pre-nursing",
    topic: "Safety / Fall Prevention / Restraints",
    subtopic: "Fire Safety",
    stem: "The acronym RACE in fire safety stands for:",
    options: [
      "Rescue, Alarm, Contain, Extinguish",
      "Run, Alert, Close, Evacuate",
      "Report, Assess, Control, Eliminate",
      "Rescue, Assess, Contain, Exit"
    ],
    correctAnswer: 0,
    type: "mcq",
    rationaleCorrect: "RACE stands for Rescue (remove patients from danger), Alarm (activate the fire alarm), Contain (close doors and windows to contain the fire), and Extinguish (attempt to extinguish small fires if safe). This is the standard fire response protocol in healthcare settings.",
    rationaleIncorrect: [
      "RACE is the correct answer",
      "Run, Alert, Close, Evacuate is not the correct acronym expansion",
      "Report, Assess, Control, Eliminate is not the correct acronym expansion",
      "Rescue, Assess, Contain, Exit is not the standard expansion"
    ],
    difficulty: 1,
    bloomLevel: "recall",
    clinicalCorrelation: "Fire safety protocols protect patients who may have limited mobility. Nurses must know the RACE procedure and location of fire exits and extinguishers.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["safety", "fire safety", "RACE", "emergency preparedness"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-058",
    course: "pre-nursing",
    topic: "Safety / Fall Prevention / Restraints",
    subtopic: "Patient Identification",
    stem: "The nurse should use at least how many patient identifiers before administering medications?",
    options: ["One", "Two", "Three", "Four"],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "At least two patient identifiers must be used before administering medications, performing procedures, or providing treatments. Common identifiers include the patient's full name and date of birth. Room numbers should never be used as an identifier.",
    rationaleIncorrect: [
      "One identifier is insufficient to ensure correct patient identification",
      "Three identifiers exceed the minimum requirement but two is the standard",
      "Four identifiers are not required by standard protocols"
    ],
    difficulty: 1,
    bloomLevel: "recall",
    clinicalCorrelation: "Using two patient identifiers is a fundamental safety practice that prevents wrong-patient errors in medication administration and procedures.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["safety", "patient identification", "medication safety", "two identifiers"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-059",
    course: "pre-nursing",
    topic: "Safety / Fall Prevention / Restraints",
    subtopic: "Body Mechanics",
    stem: "When lifting a patient, the nurse should use which body mechanics principle?",
    options: [
      "Bend at the waist and keep legs straight",
      "Maintain a wide base of support and bend at the knees",
      "Twist the body to move the patient quickly",
      "Keep the patient far from the nurse's body during transfer"
    ],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "Proper body mechanics include maintaining a wide base of support, bending at the knees (not the waist), keeping the back straight, and holding the load close to the body. These principles reduce strain on the back and prevent musculoskeletal injuries.",
    rationaleIncorrect: [
      "Bending at the waist increases strain on the lower back and risk of injury",
      "Twisting increases the risk of spinal injury; the whole body should turn together",
      "Keeping the patient far from the body increases strain due to the increased lever arm"
    ],
    difficulty: 3,
    bloomLevel: "application",
    clinicalCorrelation: "Back injuries are among the most common workplace injuries in nursing. Proper body mechanics and use of assistive devices protect nurses from injury.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["safety", "body mechanics", "lifting", "injury prevention"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-060",
    course: "pre-nursing",
    topic: "Safety / Fall Prevention / Restraints",
    subtopic: "Incident Reporting",
    stem: "When a patient falls, the nurse's first action should be:",
    options: [
      "Complete an incident report",
      "Assess the patient for injuries",
      "Notify the family",
      "Move the patient back to bed"
    ],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "The nurse's first priority after a patient fall is to assess the patient for injuries. This includes checking for pain, deformity, altered level of consciousness, and vital signs. Moving the patient without assessment could worsen a potential injury.",
    rationaleIncorrect: [
      "An incident report is completed after the patient has been assessed and treated",
      "The family is notified after the patient has been assessed and stabilized",
      "Moving the patient without assessment could worsen injuries such as fractures or head injuries"
    ],
    difficulty: 1,
    bloomLevel: "application",
    clinicalCorrelation: "Post-fall assessment guides treatment decisions and documentation. Early detection of injuries such as fractures or head injuries improves patient outcomes.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["safety", "falls", "assessment", "incident reporting", "priority"],
    estimatedTimeSeconds: 30
  },

  // ===== BASIC PHARMACOLOGY CONCEPTS (pn-061 to pn-070) =====
  {
    id: "pn-061",
    course: "pre-nursing",
    topic: "Basic Pharmacology Concepts",
    subtopic: "Rights of Medication Administration",
    stem: "Which of the following is NOT one of the traditional 'rights' of medication administration?",
    options: [
      "Right patient",
      "Right medication",
      "Right diagnosis",
      "Right dose"
    ],
    correctAnswer: 2,
    type: "mcq",
    rationaleCorrect: "The traditional rights of medication administration include right patient, right medication, right dose, right route, right time, and right documentation. 'Right diagnosis' is not one of the traditional rights, although nurses should understand the reason for each medication.",
    rationaleIncorrect: [
      "Right patient is one of the fundamental rights of medication administration",
      "Right medication is one of the fundamental rights of medication administration",
      "Right dose is one of the fundamental rights of medication administration"
    ],
    difficulty: 1,
    bloomLevel: "recall",
    clinicalCorrelation: "Adhering to the rights of medication administration is the primary safeguard against medication errors, which are a leading cause of patient harm.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["pharmacology", "medication administration", "rights", "patient safety"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-062",
    course: "pre-nursing",
    topic: "Basic Pharmacology Concepts",
    subtopic: "Drug Forms",
    stem: "A medication administered 'sublingual' is placed:",
    options: [
      "In the ear",
      "Under the tongue",
      "On the skin",
      "Into the rectum"
    ],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "Sublingual administration involves placing the medication under the tongue, where it dissolves and is absorbed rapidly through the mucous membranes into the bloodstream. Nitroglycerin is a common sublingual medication.",
    rationaleIncorrect: [
      "In the ear is the otic route of administration",
      "On the skin is the topical route of administration",
      "Into the rectum is the rectal route of administration"
    ],
    difficulty: 1,
    bloomLevel: "recall",
    clinicalCorrelation: "The sublingual route provides rapid absorption and bypasses first-pass metabolism in the liver, making it ideal for medications that need to act quickly.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["pharmacology", "drug routes", "sublingual", "administration"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-063",
    course: "pre-nursing",
    topic: "Basic Pharmacology Concepts",
    subtopic: "Adverse Effects",
    stem: "The difference between a side effect and an adverse effect of a medication is:",
    options: [
      "There is no difference; the terms are interchangeable",
      "Side effects are expected and usually mild; adverse effects are unexpected and potentially harmful",
      "Side effects are always harmful; adverse effects are always beneficial",
      "Side effects occur immediately; adverse effects occur days later"
    ],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "Side effects are predictable, often mild pharmacological effects that occur at therapeutic doses (e.g., drowsiness from antihistamines). Adverse effects are unintended, harmful reactions that may be serious and require intervention or discontinuation of the medication.",
    rationaleIncorrect: [
      "The terms have distinct clinical meanings and are not interchangeable",
      "Side effects are not always harmful and adverse effects are never beneficial",
      "Both can occur at varying times; timing does not distinguish them"
    ],
    difficulty: 2,
    bloomLevel: "understanding",
    clinicalCorrelation: "Nurses must educate patients about expected side effects and instruct them to report adverse effects promptly for timely intervention.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["pharmacology", "side effects", "adverse effects", "medication safety"],
    estimatedTimeSeconds: 45
  },
  {
    id: "pn-064",
    course: "pre-nursing",
    topic: "Basic Pharmacology Concepts",
    subtopic: "Drug Interactions",
    stem: "A drug-drug interaction occurs when:",
    options: [
      "A medication is stored improperly",
      "Two or more medications alter each other's effects when taken together",
      "A patient takes a medication on an empty stomach",
      "A medication is administered by the wrong route"
    ],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "A drug-drug interaction occurs when two or more medications taken together alter each other's absorption, distribution, metabolism, or excretion, potentially enhancing or diminishing their therapeutic effects or causing unexpected adverse reactions.",
    rationaleIncorrect: [
      "Improper storage affects drug stability, not drug interactions",
      "Taking medication on an empty stomach relates to drug-food interactions, not drug-drug interactions",
      "Wrong route administration is a medication error, not a drug interaction"
    ],
    difficulty: 1,
    bloomLevel: "understanding",
    clinicalCorrelation: "Nurses must check for potential drug interactions before administering medications, especially in patients taking multiple medications (polypharmacy).",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["pharmacology", "drug interactions", "polypharmacy", "medication safety"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-065",
    course: "pre-nursing",
    topic: "Basic Pharmacology Concepts",
    subtopic: "Pharmacokinetics",
    stem: "The process by which the body breaks down a drug into metabolites is called:",
    options: ["Absorption", "Distribution", "Metabolism", "Excretion"],
    correctAnswer: 2,
    type: "mcq",
    rationaleCorrect: "Metabolism (also called biotransformation) is the process by which the body chemically alters a drug, primarily in the liver, converting it into metabolites that can be excreted. This is one of the four pharmacokinetic processes.",
    rationaleIncorrect: [
      "Absorption is the movement of a drug from the site of administration into the bloodstream",
      "Distribution is the transport of a drug through the bloodstream to body tissues",
      "Excretion is the elimination of the drug and its metabolites from the body, primarily via the kidneys"
    ],
    difficulty: 1,
    bloomLevel: "recall",
    clinicalCorrelation: "Liver function affects drug metabolism. Nurses monitor liver function tests in patients on medications that undergo significant hepatic metabolism.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["pharmacology", "pharmacokinetics", "metabolism", "liver"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-066",
    course: "pre-nursing",
    topic: "Basic Pharmacology Concepts",
    subtopic: "Medication Storage",
    stem: "Which factor is most important for safe medication storage?",
    options: [
      "Storing all medications in the freezer",
      "Following manufacturer guidelines for temperature, light, and humidity",
      "Removing medications from their original packaging for convenience",
      "Keeping all medications in the same location regardless of type"
    ],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "Safe medication storage requires following manufacturer guidelines for temperature, light exposure, and humidity. Some medications require refrigeration, protection from light, or specific temperature ranges to maintain efficacy and safety.",
    rationaleIncorrect: [
      "Not all medications should be frozen; freezing can alter the chemical structure of some medications",
      "Removing medications from original packaging makes identification difficult and may affect stability",
      "Certain medications (e.g., narcotics, chemotherapy) require separate, secured storage"
    ],
    difficulty: 1,
    bloomLevel: "understanding",
    clinicalCorrelation: "Improperly stored medications may lose potency or become harmful. Nurses verify storage conditions, especially for insulin, vaccines, and reconstituted medications.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["pharmacology", "medication storage", "safety", "temperature"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-067",
    course: "pre-nursing",
    topic: "Basic Pharmacology Concepts",
    subtopic: "Routes of Administration",
    stem: "Which route of medication administration has the fastest onset of action?",
    options: ["Oral", "Intramuscular", "Intravenous", "Transdermal"],
    correctAnswer: 2,
    type: "mcq",
    rationaleCorrect: "The intravenous (IV) route has the fastest onset of action because the medication is administered directly into the bloodstream, bypassing absorption barriers. This is why IV is used in emergencies when rapid drug effect is needed.",
    rationaleIncorrect: [
      "Oral medications must pass through the GI tract and liver before reaching systemic circulation, resulting in a slower onset",
      "Intramuscular medications are absorbed through muscle tissue, which is faster than oral but slower than IV",
      "Transdermal medications are absorbed through the skin, providing a slow, sustained release"
    ],
    difficulty: 1,
    bloomLevel: "recall",
    clinicalCorrelation: "Understanding onset of action by route helps nurses anticipate when medications will take effect and select the appropriate route for the clinical situation.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["pharmacology", "routes", "intravenous", "onset of action"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-068",
    course: "pre-nursing",
    topic: "Basic Pharmacology Concepts",
    subtopic: "Generic vs Brand Names",
    stem: "Acetaminophen is an example of a:",
    options: [
      "Brand name",
      "Generic (non-proprietary) name",
      "Chemical name",
      "Trade name"
    ],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "Acetaminophen is the generic (non-proprietary) name for the drug commonly known by the brand name Tylenol. Generic names are assigned by official naming committees and are not owned by any company.",
    rationaleIncorrect: [
      "Tylenol is a brand name for acetaminophen, not the other way around",
      "The chemical name describes the molecular structure and is more complex (e.g., N-acetyl-p-aminophenol)",
      "Trade name is another term for brand name, which would be Tylenol in this case"
    ],
    difficulty: 3,
    bloomLevel: "recall",
    clinicalCorrelation: "Nurses should know both generic and brand names to prevent duplication errors when patients take the same drug under different names.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["pharmacology", "generic name", "brand name", "drug names"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-069",
    course: "pre-nursing",
    topic: "Basic Pharmacology Concepts",
    subtopic: "Allergic Reactions",
    stem: "Which of the following symptoms would indicate a potential allergic reaction to a medication? (Select all that apply)",
    options: [
      "Urticaria (hives)",
      "Difficulty breathing",
      "Mild drowsiness",
      "Swelling of the face or throat",
      "Itching or rash"
    ],
    correctAnswers: [0, 1, 3, 4],
    type: "sata",
    rationaleCorrect: "Allergic reactions to medications can present with urticaria (hives), difficulty breathing (bronchospasm), facial or throat swelling (angioedema), and itching or rash. Mild drowsiness is typically a side effect, not an allergic reaction.",
    rationaleIncorrect: [
      "Urticaria (hives) is a classic allergic reaction symptom",
      "Difficulty breathing may indicate anaphylaxis, a severe allergic reaction",
      "Mild drowsiness is a common side effect of many medications, not an allergic response",
      "Swelling of the face or throat is a sign of angioedema, which can be life-threatening",
      "Itching or rash commonly accompanies allergic reactions"
    ],
    difficulty: 2,
    bloomLevel: "application",
    clinicalCorrelation: "Early recognition of allergic reactions is critical. Nurses must assess for allergy history before medication administration and monitor for reactions after administration.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["pharmacology", "allergic reaction", "anaphylaxis", "patient safety", "assessment"],
    estimatedTimeSeconds: 60
  },
  {
    id: "pn-070",
    course: "pre-nursing",
    topic: "Basic Pharmacology Concepts",
    subtopic: "Controlled Substances",
    stem: "When administering a controlled substance, the nurse must:",
    options: [
      "Administer it without documentation to protect patient privacy",
      "Count, document, and have a witness for discarded portions",
      "Keep leftover medication for future use",
      "Store it in the patient's bedside drawer"
    ],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "Controlled substances (narcotics) require strict documentation including the count at the beginning and end of each shift. Any wasted or discarded portions must be witnessed by a second nurse and documented to prevent diversion.",
    rationaleIncorrect: [
      "All medications, including controlled substances, must be documented",
      "Keeping leftover controlled substances is illegal and constitutes drug diversion",
      "Controlled substances must be stored in a locked, secure location, not at the bedside"
    ],
    difficulty: 2,
    bloomLevel: "understanding",
    clinicalCorrelation: "Nurses are legally accountable for the handling of controlled substances. Proper documentation and witnessing prevent diversion and protect both patients and nurses.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["pharmacology", "controlled substances", "narcotics", "documentation", "safety"],
    estimatedTimeSeconds: 45
  },

  // ===== FLUID BALANCE & ELECTROLYTES BASICS (pn-071 to pn-080) =====
  {
    id: "pn-071",
    course: "pre-nursing",
    topic: "Fluid Balance & Electrolytes Basics",
    subtopic: "Body Fluid Compartments",
    stem: "The majority of body water is found in which fluid compartment?",
    options: [
      "Intravascular (plasma)",
      "Interstitial",
      "Intracellular",
      "Transcellular"
    ],
    correctAnswer: 2,
    type: "mcq",
    rationaleCorrect: "Approximately two-thirds (about 60-65%) of total body water is found in the intracellular fluid (ICF) compartment, which is the fluid inside cells. The remaining one-third is in the extracellular fluid (ECF), which includes interstitial and intravascular compartments.",
    rationaleIncorrect: [
      "Intravascular fluid (plasma) accounts for about 5% of body weight",
      "Interstitial fluid is between cells and accounts for about 15% of body weight",
      "Transcellular fluid (CSF, synovial, peritoneal) is the smallest compartment"
    ],
    difficulty: 2,
    bloomLevel: "recall",
    clinicalCorrelation: "Understanding fluid distribution helps nurses assess hydration status, predict fluid shifts, and manage IV fluid therapy effectively.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["fluid balance", "intracellular", "body compartments", "physiology"],
    estimatedTimeSeconds: 45
  },
  {
    id: "pn-072",
    course: "pre-nursing",
    topic: "Fluid Balance & Electrolytes Basics",
    subtopic: "Dehydration",
    stem: "Which of the following are signs of dehydration? (Select all that apply)",
    options: [
      "Dry mucous membranes",
      "Decreased urine output",
      "Increased skin turgor",
      "Elevated heart rate",
      "Hypertension"
    ],
    correctAnswers: [0, 1, 3],
    type: "sata",
    rationaleCorrect: "Signs of dehydration include dry mucous membranes, decreased urine output (concentrated urine), and elevated heart rate (compensatory tachycardia). The body attempts to maintain blood pressure by increasing heart rate when fluid volume is reduced.",
    rationaleIncorrect: [
      "Dry mucous membranes indicate fluid deficit",
      "Decreased urine output reflects the kidneys conserving fluid",
      "Decreased (poor) skin turgor is a sign of dehydration, not increased turgor",
      "Elevated heart rate is a compensatory response to decreased fluid volume",
      "Dehydration causes hypotension, not hypertension"
    ],
    difficulty: 2,
    bloomLevel: "understanding",
    clinicalCorrelation: "Early recognition of dehydration allows nurses to initiate fluid replacement and prevent complications such as hypotension, acute kidney injury, and confusion.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["fluid balance", "dehydration", "assessment", "signs and symptoms"],
    estimatedTimeSeconds: 60
  },
  {
    id: "pn-073",
    course: "pre-nursing",
    topic: "Fluid Balance & Electrolytes Basics",
    subtopic: "Electrolytes",
    stem: "Which electrolyte is the most abundant cation in the intracellular fluid?",
    options: ["Sodium (Na+)", "Potassium (K+)", "Calcium (Ca2+)", "Chloride (Cl-)"],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "Potassium (K+) is the most abundant cation in the intracellular fluid. It plays a critical role in cell membrane potential, nerve impulse transmission, and muscle contraction, particularly cardiac muscle function.",
    rationaleIncorrect: [
      "Sodium is the most abundant cation in the extracellular fluid, not intracellular",
      "Calcium is found primarily in bones and plays a role in muscle contraction and coagulation",
      "Chloride is an anion (negative charge), not a cation"
    ],
    difficulty: 1,
    bloomLevel: "recall",
    clinicalCorrelation: "Potassium imbalances can cause life-threatening cardiac arrhythmias. Nurses monitor serum potassium levels closely, especially in patients on diuretics or with renal impairment.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["fluid balance", "electrolytes", "potassium", "intracellular"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-074",
    course: "pre-nursing",
    topic: "Fluid Balance & Electrolytes Basics",
    subtopic: "Normal Lab Values",
    stem: "The normal serum sodium level for an adult is approximately:",
    options: ["120-130 mmol/L", "135-145 mmol/L", "150-160 mmol/L", "3.5-5.0 mmol/L"],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "The normal serum sodium level is 135-145 mmol/L. Sodium is the primary electrolyte responsible for maintaining extracellular fluid volume and osmolality. Values outside this range can cause neurological symptoms.",
    rationaleIncorrect: [
      "120-130 mmol/L represents hyponatremia, which can cause confusion and seizures",
      "150-160 mmol/L represents hypernatremia, which can cause dehydration symptoms",
      "3.5-5.0 mmol/L is the normal range for serum potassium, not sodium"
    ],
    difficulty: 1,
    bloomLevel: "recall",
    clinicalCorrelation: "Nurses monitor sodium levels in patients receiving IV fluids, diuretics, or with conditions such as heart failure or syndrome of inappropriate antidiuretic hormone (SIADH).",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["fluid balance", "sodium", "lab values", "electrolytes"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-075",
    course: "pre-nursing",
    topic: "Fluid Balance & Electrolytes Basics",
    subtopic: "Intake and Output",
    stem: "When monitoring a patient's fluid balance, the nurse records intake and output (I&O). Which of the following should be counted as fluid intake?",
    options: [
      "IV fluids and oral fluids only",
      "All IV fluids, oral fluids, tube feedings, and fluids given with medications",
      "Only water consumed by mouth",
      "Only IV fluids"
    ],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "Fluid intake includes all sources: oral fluids (water, juice, soup, gelatin, ice chips), IV fluids, tube feedings, and fluids used to administer medications (IV flushes, piggyback medications). Accurate intake recording is essential for fluid balance assessment.",
    rationaleIncorrect: [
      "This excludes tube feedings and medication flushes, which are also part of intake",
      "Water alone does not represent total fluid intake",
      "IV fluids alone do not account for all fluid intake sources"
    ],
    difficulty: 2,
    bloomLevel: "understanding",
    clinicalCorrelation: "Accurate I&O monitoring helps detect fluid imbalances early and guides fluid management in patients with heart failure, renal disease, or post-surgical recovery.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["fluid balance", "intake and output", "I&O", "monitoring"],
    estimatedTimeSeconds: 45
  },
  {
    id: "pn-076",
    course: "pre-nursing",
    topic: "Fluid Balance & Electrolytes Basics",
    subtopic: "IV Fluid Types",
    stem: "Normal saline (0.9% NaCl) is classified as which type of IV solution?",
    options: ["Hypotonic", "Isotonic", "Hypertonic", "Colloid"],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "Normal saline (0.9% NaCl) is an isotonic solution, meaning it has the same osmolality as blood plasma (approximately 308 mOsm/L). It does not cause fluid shifts between intracellular and extracellular compartments.",
    rationaleIncorrect: [
      "Hypotonic solutions (e.g., 0.45% NaCl) have lower osmolality than blood and cause fluid to shift into cells",
      "Hypertonic solutions (e.g., 3% NaCl) have higher osmolality and draw fluid out of cells",
      "Colloids (e.g., albumin) contain large molecules that remain in the intravascular space"
    ],
    difficulty: 1,
    bloomLevel: "recall",
    clinicalCorrelation: "Isotonic solutions like normal saline are used to expand intravascular volume in dehydration and hypovolemia without causing cellular fluid shifts.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["fluid balance", "IV fluids", "isotonic", "normal saline"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-077",
    course: "pre-nursing",
    topic: "Fluid Balance & Electrolytes Basics",
    subtopic: "Fluid Overload",
    stem: "Which finding is most indicative of fluid volume excess (fluid overload)?",
    options: [
      "Weight loss of 2 kg in 24 hours",
      "Dry, cracked lips",
      "Crackles (rales) heard on lung auscultation",
      "Dark concentrated urine"
    ],
    correctAnswer: 2,
    type: "mcq",
    rationaleCorrect: "Crackles (rales) heard during lung auscultation indicate fluid accumulation in the alveoli, which is a key sign of fluid volume excess. Other signs include peripheral edema, jugular vein distension, and rapid weight gain.",
    rationaleIncorrect: [
      "Weight loss indicates fluid volume deficit, not excess",
      "Dry, cracked lips are a sign of dehydration (fluid deficit)",
      "Dark concentrated urine indicates fluid deficit as the kidneys conserve water"
    ],
    difficulty: 2,
    bloomLevel: "understanding",
    clinicalCorrelation: "Nurses auscultate lung sounds to detect pulmonary edema early, especially in patients receiving IV fluids or those with heart failure.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["fluid balance", "fluid overload", "crackles", "pulmonary edema", "assessment"],
    estimatedTimeSeconds: 45
  },
  {
    id: "pn-078",
    course: "pre-nursing",
    topic: "Fluid Balance & Electrolytes Basics",
    subtopic: "Potassium",
    stem: "Which of the following foods are good dietary sources of potassium? (Select all that apply)",
    options: ["White bread", "Bananas", "Oranges", "Potatoes", "Rice"],
    correctAnswers: [1, 2, 3],
    type: "sata",
    rationaleCorrect: "Bananas, oranges, and potatoes are all excellent dietary sources of potassium. Other potassium-rich foods include spinach, avocados, and tomatoes. Dietary counselling about potassium-rich foods is important for patients on certain medications.",
    rationaleIncorrect: [
      "White bread is not a significant source of potassium",
      "Bananas are an excellent source of potassium",
      "Oranges are a good source of potassium",
      "Potatoes are a good source of potassium",
      "Rice is primarily a carbohydrate source with low potassium content"
    ],
    difficulty: 1,
    bloomLevel: "recall",
    clinicalCorrelation: "Nurses educate patients on potassium-rich foods, especially those taking potassium-wasting diuretics, to prevent hypokalemia.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["fluid balance", "potassium", "nutrition", "dietary sources"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-079",
    course: "pre-nursing",
    topic: "Fluid Balance & Electrolytes Basics",
    subtopic: "Edema",
    stem: "Pitting edema is assessed by:",
    options: [
      "Measuring the circumference of the extremity",
      "Pressing a finger firmly into the skin over a bony prominence and observing for an indentation",
      "Asking the patient to rate their swelling on a scale of 1-10",
      "Weighing the patient before and after meals"
    ],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "Pitting edema is assessed by pressing a finger firmly into the swollen tissue over a bony prominence for several seconds and then observing whether an indentation (pit) remains. The depth of the pit is graded on a scale of 1+ to 4+.",
    rationaleIncorrect: [
      "Circumference measurements assess overall swelling but do not determine pitting vs non-pitting edema",
      "Patient self-report of swelling is subjective and does not replace physical assessment",
      "Weight changes indicate fluid retention but do not specifically assess pitting edema"
    ],
    difficulty: 2,
    bloomLevel: "understanding",
    clinicalCorrelation: "Assessing pitting edema helps nurses evaluate fluid status and monitor the effectiveness of diuretic therapy and fluid restrictions.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["fluid balance", "edema", "pitting edema", "assessment"],
    estimatedTimeSeconds: 45
  },
  {
    id: "pn-080",
    course: "pre-nursing",
    topic: "Fluid Balance & Electrolytes Basics",
    subtopic: "Daily Fluid Needs",
    stem: "The average healthy adult requires approximately how much total fluid intake per day?",
    options: ["500-1000 mL", "1500-2000 mL", "2000-2500 mL", "3500-4000 mL"],
    correctAnswer: 2,
    type: "fill-in-blank",
    rationaleCorrect: "The average healthy adult requires approximately 2000-2500 mL of total fluid per day from all sources (beverages, food, and metabolic water). This amount may vary based on body size, activity level, climate, and health conditions.",
    rationaleIncorrect: [
      "500-1000 mL is insufficient for most adults and could lead to dehydration",
      "1500-2000 mL is below the typical recommended intake for a healthy adult",
      "3500-4000 mL exceeds typical needs unless the individual has increased losses"
    ],
    difficulty: 1,
    bloomLevel: "recall",
    clinicalCorrelation: "Nurses assess daily fluid intake to ensure patients are meeting hydration needs, especially those with fluid restrictions or those at risk for dehydration.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["fluid balance", "daily requirements", "hydration", "intake"],
    estimatedTimeSeconds: 30
  },

  // ===== NUTRITION BASICS (pn-081 to pn-088) =====
  {
    id: "pn-081",
    course: "pre-nursing",
    topic: "Nutrition Basics",
    subtopic: "Macronutrients",
    stem: "Which macronutrient is the body's primary source of energy?",
    options: ["Protein", "Fat", "Carbohydrate", "Vitamins"],
    correctAnswer: 2,
    type: "mcq",
    rationaleCorrect: "Carbohydrates are the body's primary and preferred source of energy. They are broken down into glucose, which is used by cells for energy production. Each gram of carbohydrate provides approximately 4 kilocalories of energy.",
    rationaleIncorrect: [
      "Protein is primarily used for growth, repair, and maintenance of body tissues, not as the primary energy source",
      "Fat is a concentrated energy source (9 kcal/g) but is the secondary energy source, not the primary one",
      "Vitamins are micronutrients that facilitate metabolic processes but do not provide energy"
    ],
    difficulty: 1,
    bloomLevel: "recall",
    clinicalCorrelation: "Understanding macronutrient functions helps nurses provide dietary counselling and assess nutritional status in patients with various health conditions.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["nutrition", "macronutrients", "carbohydrates", "energy"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-082",
    course: "pre-nursing",
    topic: "Nutrition Basics",
    subtopic: "Dietary Assessment",
    stem: "Which assessment finding best indicates a patient's current nutritional status?",
    options: [
      "Food preferences",
      "Body mass index (BMI)",
      "Number of meals eaten per day",
      "Favourite restaurants"
    ],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "Body mass index (BMI) is a calculated measure using height and weight that provides an objective indicator of nutritional status. It helps identify underweight, normal weight, overweight, and obesity classifications.",
    rationaleIncorrect: [
      "Food preferences indicate what a person likes to eat but not their actual nutritional status",
      "The number of meals per day does not account for meal quality or quantity",
      "Favourite restaurants are not relevant to clinical nutritional assessment"
    ],
    difficulty: 1,
    bloomLevel: "understanding",
    clinicalCorrelation: "Nutritional assessment is part of the comprehensive health assessment. BMI, along with lab values and dietary history, guides nutritional interventions.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["nutrition", "assessment", "BMI", "nutritional status"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-083",
    course: "pre-nursing",
    topic: "Nutrition Basics",
    subtopic: "Vitamins and Minerals",
    stem: "Vitamin D is essential for the absorption of which mineral?",
    options: ["Iron", "Potassium", "Calcium", "Zinc"],
    correctAnswer: 2,
    type: "mcq",
    rationaleCorrect: "Vitamin D promotes the absorption of calcium from the gastrointestinal tract and plays a vital role in maintaining bone health. Without adequate vitamin D, calcium absorption is impaired, leading to bone disorders such as osteoporosis and rickets.",
    rationaleIncorrect: [
      "Iron absorption is enhanced by vitamin C, not vitamin D",
      "Potassium absorption is not dependent on vitamin D",
      "Zinc absorption is not primarily dependent on vitamin D"
    ],
    difficulty: 1,
    bloomLevel: "recall",
    clinicalCorrelation: "Nurses educate patients about vitamin D and calcium intake to support bone health, especially in older adults and postmenopausal women at risk for osteoporosis.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["nutrition", "vitamin D", "calcium", "bone health"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-084",
    course: "pre-nursing",
    topic: "Nutrition Basics",
    subtopic: "Therapeutic Diets",
    stem: "A patient with heart failure is most likely prescribed which type of therapeutic diet?",
    options: [
      "High-protein diet",
      "Sodium-restricted diet",
      "High-calorie diet",
      "Clear liquid diet"
    ],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "Patients with heart failure are typically prescribed a sodium-restricted diet to reduce fluid retention and decrease the workload on the heart. Excess sodium causes the body to retain water, worsening edema and symptoms of heart failure.",
    rationaleIncorrect: [
      "A high-protein diet is not the primary dietary modification for heart failure",
      "A high-calorie diet may be needed in some conditions but is not specific to heart failure management",
      "A clear liquid diet is used for bowel preparation or post-surgical situations, not long-term heart failure management"
    ],
    difficulty: 2,
    bloomLevel: "understanding",
    clinicalCorrelation: "Sodium restriction is a key non-pharmacological intervention for heart failure. Nurses educate patients about reading food labels and reducing dietary sodium.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["nutrition", "therapeutic diet", "sodium restriction", "heart failure"],
    estimatedTimeSeconds: 45
  },
  {
    id: "pn-085",
    course: "pre-nursing",
    topic: "Nutrition Basics",
    subtopic: "Dysphagia",
    stem: "A patient with dysphagia should be positioned in which manner during and after meals?",
    options: [
      "Flat (supine) position",
      "Upright (at least 45-90 degrees) for at least 30 minutes after eating",
      "Left side-lying position",
      "Trendelenburg position"
    ],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "Patients with dysphagia should be positioned upright (at least 45-90 degrees) during and for at least 30 minutes after eating to reduce the risk of aspiration. An upright position uses gravity to assist with swallowing and prevent food from entering the airway.",
    rationaleIncorrect: [
      "Supine position increases the risk of aspiration",
      "Side-lying position does not use gravity to assist with safe swallowing",
      "Trendelenburg (head lower than feet) greatly increases aspiration risk"
    ],
    difficulty: 2,
    bloomLevel: "application",
    clinicalCorrelation: "Aspiration prevention is a critical nursing intervention for patients with swallowing difficulties. Proper positioning, diet texture modifications, and supervision during meals reduce aspiration risk.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["nutrition", "dysphagia", "aspiration prevention", "positioning"],
    estimatedTimeSeconds: 45
  },
  {
    id: "pn-086",
    course: "pre-nursing",
    topic: "Nutrition Basics",
    subtopic: "Protein Functions",
    stem: "Protein is essential for which body function?",
    options: [
      "Primary energy source for the brain",
      "Tissue growth and repair",
      "Insulation and temperature regulation",
      "Primary source of dietary fibre"
    ],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "Protein is essential for tissue growth, repair, and maintenance. It is needed for wound healing, immune function, enzyme and hormone production, and maintaining muscle mass. Each gram of protein provides approximately 4 kilocalories.",
    rationaleIncorrect: [
      "Glucose (from carbohydrates) is the primary energy source for the brain",
      "Insulation and temperature regulation are primarily functions of body fat (adipose tissue)",
      "Dietary fibre comes from carbohydrate sources like whole grains, fruits, and vegetables"
    ],
    difficulty: 3,
    bloomLevel: "recall",
    clinicalCorrelation: "Adequate protein intake is crucial for wound healing. Nurses assess protein intake and educate patients about protein-rich foods, especially those recovering from surgery or illness.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["nutrition", "protein", "tissue repair", "wound healing"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-087",
    course: "pre-nursing",
    topic: "Nutrition Basics",
    subtopic: "Fibre",
    stem: "Which of the following are benefits of a high-fibre diet? (Select all that apply)",
    options: ["Prevents constipation", "Promotes healthy blood glucose control", "Increases iron absorption", "Supports cardiovascular health", "Cures hypothyroidism"],
    correctAnswers: [0, 1, 3],
    type: "sata",
    rationaleCorrect: "A high-fibre diet prevents constipation by adding bulk and stimulating peristalsis, helps regulate blood glucose by slowing carbohydrate absorption, and supports cardiovascular health by helping reduce cholesterol levels. Good sources include whole grains, fruits, vegetables, and legumes.",
    rationaleIncorrect: [
      "Preventing constipation is a well-established benefit of dietary fibre",
      "Soluble fibre slows glucose absorption, aiding blood sugar management",
      "Fibre does not increase iron absorption; vitamin C enhances iron absorption",
      "Soluble fibre helps lower cholesterol, supporting cardiovascular health",
      "Hypothyroidism is a thyroid hormone disorder not treated by fibre intake"
    ],
    difficulty: 1,
    bloomLevel: "application",
    clinicalCorrelation: "Nurses encourage adequate fibre and fluid intake to promote bowel regularity, especially in older adults and patients with reduced mobility.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["nutrition", "fibre", "constipation", "bowel health"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-088",
    course: "pre-nursing",
    topic: "Nutrition Basics",
    subtopic: "Malnutrition Indicators",
    stem: "Which laboratory value is commonly used to assess a patient's protein and nutritional status?",
    options: ["Hemoglobin", "Serum albumin", "Blood glucose", "Serum sodium"],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "Serum albumin is a commonly used laboratory marker for assessing protein and overall nutritional status. Low albumin levels (hypoalbuminemia) can indicate malnutrition, liver disease, or chronic illness and are associated with poor wound healing and increased infection risk.",
    rationaleIncorrect: [
      "Hemoglobin reflects oxygen-carrying capacity and is used to assess for anemia",
      "Blood glucose reflects carbohydrate metabolism and is used to monitor diabetes",
      "Serum sodium reflects fluid and electrolyte balance, not nutritional status directly"
    ],
    difficulty: 2,
    bloomLevel: "understanding",
    clinicalCorrelation: "Low serum albumin is associated with increased risk of pressure injuries, poor wound healing, and higher morbidity. Nurses use this value to guide nutritional interventions.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["nutrition", "albumin", "lab values", "malnutrition", "assessment"],
    estimatedTimeSeconds: 45
  },

  // ===== ETHICS, PRIVACY, CONSENT BASICS (pn-089 to pn-100) =====
  {
    id: "pn-089",
    course: "pre-nursing",
    topic: "Ethics, Privacy, Consent Basics",
    subtopic: "Informed Consent",
    stem: "Informed consent requires that the patient:",
    options: [
      "Simply signs the consent form",
      "Receives information about the procedure, risks, benefits, and alternatives, and voluntarily agrees",
      "Has a family member present at all times",
      "Receives sedation before the procedure"
    ],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "Informed consent requires that the patient receives clear information about the proposed procedure, its risks, benefits, and alternatives, and voluntarily agrees without coercion. The patient must have decision-making capacity and understand the information provided.",
    rationaleIncorrect: [
      "Simply signing a form without understanding the information does not constitute informed consent",
      "A family member's presence is not a legal requirement for informed consent, although support persons may be helpful",
      "Sedation before the procedure would impair the patient's ability to give informed consent"
    ],
    difficulty: 1,
    bloomLevel: "understanding",
    clinicalCorrelation: "Nurses play a key role in ensuring informed consent by verifying the patient's understanding, witnessing the signature, and advocating if the patient has questions.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["ethics", "informed consent", "patient rights", "autonomy"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-090",
    course: "pre-nursing",
    topic: "Ethics, Privacy, Consent Basics",
    subtopic: "Autonomy",
    stem: "The ethical principle of autonomy refers to:",
    options: [
      "Doing good for the patient",
      "Respecting the patient's right to make their own decisions",
      "Treating all patients equally",
      "Preventing harm to the patient"
    ],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "Autonomy is the ethical principle that respects an individual's right to self-determination and independent decision-making about their own healthcare. Nurses uphold autonomy by providing information and supporting patients' choices, even when they differ from the nurse's recommendations.",
    rationaleIncorrect: [
      "Doing good for the patient is the principle of beneficence",
      "Treating all patients equally is the principle of justice",
      "Preventing harm is the principle of nonmaleficence"
    ],
    difficulty: 1,
    bloomLevel: "recall",
    clinicalCorrelation: "Respecting patient autonomy is fundamental to ethical nursing practice and includes supporting informed consent, advance directives, and treatment refusal.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["ethics", "autonomy", "patient rights", "ethical principles"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-091",
    course: "pre-nursing",
    topic: "Ethics, Privacy, Consent Basics",
    subtopic: "Beneficence",
    stem: "The ethical principle of beneficence means:",
    options: [
      "Maintaining patient privacy",
      "Acting in the best interest of the patient",
      "Distributing resources fairly",
      "Being honest and truthful"
    ],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "Beneficence is the ethical obligation to act in the best interest of the patient and to do good. This principle guides nurses to provide competent care, advocate for patients, and take actions that promote the patient's well-being.",
    rationaleIncorrect: [
      "Maintaining patient privacy relates to confidentiality, which is part of professional ethics but not beneficence specifically",
      "Distributing resources fairly is the principle of justice",
      "Being honest and truthful is the principle of veracity"
    ],
    difficulty: 1,
    bloomLevel: "recall",
    clinicalCorrelation: "Beneficence guides nursing actions such as pain management, health promotion, and advocating for appropriate treatment for patients.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["ethics", "beneficence", "ethical principles", "patient care"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-092",
    course: "pre-nursing",
    topic: "Ethics, Privacy, Consent Basics",
    subtopic: "Confidentiality",
    stem: "A nurse may share a patient's health information with:",
    options: [
      "Anyone who asks about the patient",
      "The patient's employer without consent",
      "Members of the healthcare team involved in the patient's care",
      "The patient's family members without the patient's consent"
    ],
    correctAnswer: 2,
    type: "mcq",
    rationaleCorrect: "Patient health information can be shared with members of the healthcare team who are directly involved in the patient's care, on a need-to-know basis. Sharing information beyond this circle requires the patient's explicit consent or a legal requirement.",
    rationaleIncorrect: [
      "Health information is confidential and cannot be shared with just anyone",
      "Sharing with an employer requires the patient's written consent",
      "Family members should only receive information with the patient's consent, unless legally authorized"
    ],
    difficulty: 1,
    bloomLevel: "understanding",
    clinicalCorrelation: "Privacy legislation in Canada requires that personal health information be protected. Nurses share information only as needed for patient care.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["ethics", "confidentiality", "privacy", "information sharing"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-093",
    course: "pre-nursing",
    topic: "Ethics, Privacy, Consent Basics",
    subtopic: "Patient Rights",
    stem: "A competent adult patient has the right to:",
    options: [
      "Demand any treatment they want",
      "Refuse treatment even if it may result in harm",
      "Access other patients' health records",
      "Override the healthcare team's clinical judgment at all times"
    ],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "A competent adult patient has the legal and ethical right to refuse treatment, even if the refusal may result in harm or death. This right is based on the principle of autonomy. The nurse must ensure the patient understands the consequences and document the refusal.",
    rationaleIncorrect: [
      "Patients can request but not demand specific treatments; treatment decisions are made collaboratively",
      "Privacy legislation protects all patients' records from unauthorized access",
      "Clinical judgment and patient preferences should be balanced through shared decision-making"
    ],
    difficulty: 2,
    bloomLevel: "understanding",
    clinicalCorrelation: "Nurses must respect a patient's right to refuse treatment while ensuring the patient is fully informed about the potential consequences of their decision.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["ethics", "patient rights", "refusal of treatment", "autonomy"],
    estimatedTimeSeconds: 45
  },
  {
    id: "pn-094",
    course: "pre-nursing",
    topic: "Ethics, Privacy, Consent Basics",
    subtopic: "Advance Directives",
    stem: "An advance directive is a legal document that:",
    options: [
      "Assigns a nurse to make all healthcare decisions",
      "Outlines a patient's wishes for healthcare if they become unable to make decisions",
      "Grants the hospital permission to treat all conditions",
      "Replaces the need for informed consent"
    ],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "An advance directive is a legal document that outlines a person's wishes regarding healthcare treatment in the event they become unable to communicate or make decisions for themselves. It may include a living will and designation of a substitute decision-maker.",
    rationaleIncorrect: [
      "Nurses do not make healthcare decisions for patients through advance directives",
      "An advance directive reflects the patient's preferences, not blanket permission for all treatments",
      "Advance directives complement but do not replace the informed consent process for specific procedures"
    ],
    difficulty: 2,
    bloomLevel: "understanding",
    clinicalCorrelation: "Nurses should ask patients about advance directives upon admission and ensure they are documented and accessible to the healthcare team.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["ethics", "advance directives", "end-of-life", "patient rights"],
    estimatedTimeSeconds: 45
  },
  {
    id: "pn-095",
    course: "pre-nursing",
    topic: "Ethics, Privacy, Consent Basics",
    subtopic: "Nonmaleficence",
    stem: "The ethical principle of nonmaleficence means:",
    options: [
      "Telling the truth",
      "Doing no harm",
      "Being fair in resource allocation",
      "Keeping promises"
    ],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "Nonmaleficence is the ethical principle that obligates healthcare providers to 'do no harm.' It requires nurses to avoid actions that could cause unnecessary harm or injury to patients, whether through commission (wrong action) or omission (failure to act).",
    rationaleIncorrect: [
      "Telling the truth is the principle of veracity",
      "Fair resource allocation is the principle of justice",
      "Keeping promises is the principle of fidelity"
    ],
    difficulty: 1,
    bloomLevel: "recall",
    clinicalCorrelation: "Nonmaleficence guides nurses to carefully assess risks and benefits of interventions and to report any unsafe conditions or practices.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["ethics", "nonmaleficence", "do no harm", "ethical principles"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-096",
    course: "pre-nursing",
    topic: "Ethics, Privacy, Consent Basics",
    subtopic: "Privacy Protection",
    stem: "Which of the following actions protect patient privacy? (Select all that apply)",
    options: [
      "Closing the curtain and door during examinations",
      "Logging out of the electronic health record when leaving the workstation",
      "Discussing patient conditions only with the care team in private",
      "Leaving the patient's chart open at the nursing station",
      "Sharing the patient's room number over the phone"
    ],
    correctAnswers: [0, 1, 2],
    type: "sata",
    rationaleCorrect: "Closing curtains and doors protects physical privacy. Logging out of the EHR prevents unauthorized access. Discussing conditions only with the care team in private protects informational confidentiality. Privacy protection extends to both physical privacy and informational privacy.",
    rationaleIncorrect: [
      "Closing curtains and doors protects the patient's physical privacy and dignity",
      "Logging out prevents unauthorized access to patient health information",
      "Private discussion with the care team maintains confidentiality",
      "Leaving charts open allows unauthorized persons to view patient information",
      "Sharing room numbers over the phone can compromise patient safety and privacy"
    ],
    difficulty: 3,
    bloomLevel: "application",
    clinicalCorrelation: "Privacy is a fundamental patient right. Nurses protect both physical and informational privacy as part of professional practice.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["ethics", "privacy", "dignity", "patient care", "confidentiality"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-097",
    course: "pre-nursing",
    topic: "Ethics, Privacy, Consent Basics",
    subtopic: "Consent and Minors",
    stem: "In general, who provides consent for a minor's medical treatment?",
    options: [
      "The minor always provides their own consent",
      "A parent or legal guardian",
      "The attending physician",
      "The charge nurse on duty"
    ],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "In general, a parent or legal guardian provides consent for medical treatment of a minor (under the age of majority). However, some jurisdictions recognize the concept of the 'mature minor' who may provide consent if deemed capable of understanding the treatment.",
    rationaleIncorrect: [
      "Minors generally cannot provide their own consent, with some exceptions for mature minors",
      "The physician explains the procedure but does not provide consent on behalf of the minor",
      "Nurses do not provide consent on behalf of patients"
    ],
    difficulty: 2,
    bloomLevel: "understanding",
    clinicalCorrelation: "Nurses must verify that appropriate consent has been obtained for minors and be aware of the mature minor doctrine when it applies in their jurisdiction.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["ethics", "consent", "minors", "legal guardian", "pediatrics"],
    estimatedTimeSeconds: 45
  },
  {
    id: "pn-098",
    course: "pre-nursing",
    topic: "Ethics, Privacy, Consent Basics",
    subtopic: "Justice",
    stem: "The ethical principle of justice in healthcare means:",
    options: [
      "Always agreeing with the patient's wishes",
      "Fair and equitable distribution of resources and treatment",
      "Keeping all patient information confidential",
      "Following physician orders without question"
    ],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "Justice in healthcare ethics refers to the fair and equitable distribution of resources, treatment, and care. It means treating all patients impartially regardless of their background, socioeconomic status, or personal characteristics.",
    rationaleIncorrect: [
      "Always agreeing with the patient relates more to autonomy than justice",
      "Confidentiality is a separate ethical obligation, not the principle of justice",
      "Following orders without question contradicts the nurse's duty to advocate and use critical thinking"
    ],
    difficulty: 1,
    bloomLevel: "recall",
    clinicalCorrelation: "Justice guides nurses in advocating for equitable care, especially for vulnerable and marginalized populations who may face barriers to accessing healthcare.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["ethics", "justice", "equity", "ethical principles", "advocacy"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-099",
    course: "pre-nursing",
    topic: "Ethics, Privacy, Consent Basics",
    subtopic: "Ethical Decision-Making",
    stem: "When facing an ethical dilemma, the nurse's first step should be to:",
    options: [
      "Make an immediate decision based on personal values",
      "Identify the ethical issue and gather all relevant facts",
      "Defer all decisions to the physician",
      "Ask the patient's family to decide"
    ],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "The first step in ethical decision-making is to identify the ethical issue and gather all relevant facts. This includes understanding the patient's condition, values, preferences, and the perspectives of all stakeholders before considering options and making a decision.",
    rationaleIncorrect: [
      "Decisions based solely on personal values may not align with professional ethics or the patient's best interests",
      "Ethical dilemmas require collaborative decision-making, not deferral to one person",
      "While family input is important, the decision-making process starts with fact-gathering"
    ],
    difficulty: 2,
    bloomLevel: "application",
    clinicalCorrelation: "Ethical dilemmas are common in nursing. A structured approach to ethical decision-making promotes consistent, thoughtful responses that respect all stakeholders.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["ethics", "ethical dilemma", "decision-making", "critical thinking"],
    estimatedTimeSeconds: 45
  },
  {
    id: "pn-100",
    course: "pre-nursing",
    topic: "Ethics, Privacy, Consent Basics",
    subtopic: "Social Media and Privacy",
    stem: "A nurse takes a photo of an interesting wound for educational purposes and posts it on social media without identifiable patient information visible. This is:",
    options: [
      "Acceptable because the patient cannot be identified",
      "A violation of patient privacy and professional standards",
      "Acceptable if the nurse has a medical social media account",
      "Acceptable if the photo is shared only with nursing students"
    ],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "Posting any patient photos on social media, even without visible identifiers, is a violation of patient privacy and professional standards. Unique physical features, tattoos, or contextual information could lead to identification. Written consent is required for any clinical photography.",
    rationaleIncorrect: [
      "Even without visible identifiers, the photo was taken without consent and could potentially identify the patient",
      "Having a medical social media account does not grant permission to share patient photos",
      "Sharing patient photos in any forum without explicit consent is a privacy violation"
    ],
    difficulty: 3,
    bloomLevel: "application",
    clinicalCorrelation: "Social media violations can result in disciplinary action, termination, and loss of nursing licence. Nurses must maintain professional boundaries in all online activity.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["ethics", "social media", "privacy", "professional standards", "photography"],
    estimatedTimeSeconds: 45
  },

  // ===== ANATOMY & BODY SYSTEMS BASICS (pn-101 to pn-110) =====
  {
    id: "pn-101",
    course: "pre-nursing",
    topic: "Anatomy & Body Systems Basics",
    subtopic: "Cardiovascular System",
    stem: "The heart has how many chambers?",
    options: ["Two", "Three", "Four", "Five"],
    correctAnswer: 2,
    type: "mcq",
    rationaleCorrect: "The heart has four chambers: two atria (right and left) and two ventricles (right and left). The right side receives deoxygenated blood and pumps it to the lungs. The left side receives oxygenated blood and pumps it to the body.",
    rationaleIncorrect: [
      "Two chambers would describe a simpler organism's heart, not the human heart",
      "Three chambers is incorrect for the human heart",
      "Five chambers is incorrect; the human heart has four chambers"
    ],
    difficulty: 1,
    bloomLevel: "recall",
    clinicalCorrelation: "Understanding heart anatomy is fundamental to interpreting cardiac assessments, ECG findings, and understanding conditions like heart failure and valvular disease.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["anatomy", "cardiovascular", "heart chambers", "physiology"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-102",
    course: "pre-nursing",
    topic: "Anatomy & Body Systems Basics",
    subtopic: "Respiratory System",
    stem: "Gas exchange in the lungs occurs at the:",
    options: ["Bronchi", "Trachea", "Alveoli", "Pharynx"],
    correctAnswer: 2,
    type: "mcq",
    rationaleCorrect: "Gas exchange occurs at the alveoli, the tiny air sacs at the terminal ends of the bronchioles. Oxygen diffuses from the alveoli into the pulmonary capillaries, while carbon dioxide diffuses from the blood into the alveoli to be exhaled.",
    rationaleIncorrect: [
      "The bronchi are air passageways that do not participate in gas exchange",
      "The trachea is the windpipe that conducts air to the bronchi but does not perform gas exchange",
      "The pharynx is the throat area that serves as a passageway for both air and food"
    ],
    difficulty: 1,
    bloomLevel: "recall",
    clinicalCorrelation: "Understanding alveolar gas exchange helps nurses interpret conditions such as pneumonia, COPD, and ARDS where gas exchange is impaired.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["anatomy", "respiratory", "alveoli", "gas exchange"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-103",
    course: "pre-nursing",
    topic: "Anatomy & Body Systems Basics",
    subtopic: "Nervous System",
    stem: "The central nervous system (CNS) consists of:",
    options: [
      "Brain and spinal cord",
      "Peripheral nerves and ganglia",
      "Sympathetic and parasympathetic divisions",
      "Cranial nerves and spinal nerves"
    ],
    correctAnswer: 0,
    type: "mcq",
    rationaleCorrect: "The central nervous system (CNS) consists of the brain and spinal cord. It is the main processing centre for the entire nervous system, receiving sensory information, integrating it, and coordinating responses.",
    rationaleIncorrect: [
      "Peripheral nerves and ganglia are part of the peripheral nervous system (PNS)",
      "Sympathetic and parasympathetic divisions are components of the autonomic nervous system within the PNS",
      "Cranial nerves and spinal nerves are part of the peripheral nervous system"
    ],
    difficulty: 1,
    bloomLevel: "recall",
    clinicalCorrelation: "CNS assessment includes level of consciousness, pupil reactions, and motor/sensory function, all of which are critical components of the neurological examination.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["anatomy", "nervous system", "CNS", "brain", "spinal cord"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-104",
    course: "pre-nursing",
    topic: "Anatomy & Body Systems Basics",
    subtopic: "Digestive System",
    stem: "The primary organ responsible for nutrient absorption is the:",
    options: ["Stomach", "Large intestine", "Small intestine", "Esophagus"],
    correctAnswer: 2,
    type: "mcq",
    rationaleCorrect: "The small intestine is the primary site for nutrient absorption. Its extensive surface area, created by villi and microvilli, allows for efficient absorption of carbohydrates, proteins, fats, vitamins, and minerals into the bloodstream.",
    rationaleIncorrect: [
      "The stomach primarily functions in mechanical and chemical digestion, not absorption (except for alcohol and some medications)",
      "The large intestine absorbs water and electrolytes and forms stool but is not the primary site for nutrient absorption",
      "The esophagus is a passageway from the pharynx to the stomach and does not absorb nutrients"
    ],
    difficulty: 1,
    bloomLevel: "recall",
    clinicalCorrelation: "Conditions affecting the small intestine (e.g., Crohn's disease, celiac disease) can impair nutrient absorption, leading to malnutrition and nutritional deficiencies.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["anatomy", "digestive system", "small intestine", "absorption"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-105",
    course: "pre-nursing",
    topic: "Anatomy & Body Systems Basics",
    subtopic: "Urinary System",
    stem: "The primary function of the kidneys is to:",
    options: [
      "Produce hormones for digestion",
      "Filter blood and produce urine",
      "Store and release bile",
      "Produce red blood cells"
    ],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "The primary function of the kidneys is to filter blood, removing waste products and excess substances, and produce urine. The kidneys also regulate fluid and electrolyte balance, acid-base balance, and blood pressure.",
    rationaleIncorrect: [
      "Digestive hormones are produced by the stomach, pancreas, and intestines",
      "Bile is produced by the liver and stored in the gallbladder",
      "Red blood cells are produced in the bone marrow, although the kidneys produce erythropoietin which stimulates their production"
    ],
    difficulty: 1,
    bloomLevel: "recall",
    clinicalCorrelation: "Monitoring kidney function through urine output, serum creatinine, and BUN levels is essential for detecting renal impairment and guiding fluid and medication management.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["anatomy", "urinary system", "kidneys", "filtration"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-106",
    course: "pre-nursing",
    topic: "Anatomy & Body Systems Basics",
    subtopic: "Musculoskeletal System",
    stem: "Which type of muscle tissue is found in the heart?",
    options: ["Skeletal muscle", "Smooth muscle", "Cardiac muscle", "Connective tissue"],
    correctAnswer: 2,
    type: "mcq",
    rationaleCorrect: "Cardiac muscle is found exclusively in the heart. It is striated like skeletal muscle but contracts involuntarily and rhythmically. Cardiac muscle cells are connected by intercalated discs that allow synchronized contraction.",
    rationaleIncorrect: [
      "Skeletal muscle is attached to bones and is under voluntary control",
      "Smooth muscle is found in the walls of hollow organs (e.g., blood vessels, GI tract) and contracts involuntarily",
      "Connective tissue provides structural support but is not a type of muscle tissue"
    ],
    difficulty: 1,
    bloomLevel: "recall",
    clinicalCorrelation: "Understanding cardiac muscle function helps nurses interpret cardiac conditions such as heart failure, cardiomyopathy, and the effects of cardiac medications.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["anatomy", "musculoskeletal", "cardiac muscle", "heart"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-107",
    course: "pre-nursing",
    topic: "Anatomy & Body Systems Basics",
    subtopic: "Integumentary System",
    stem: "Which of the following are functions of the skin (integumentary system)? (Select all that apply)",
    options: [
      "Protection against infection",
      "Temperature regulation",
      "Sensory reception",
      "Production of insulin",
      "Vitamin D synthesis"
    ],
    correctAnswers: [0, 1, 2, 4],
    type: "sata",
    rationaleCorrect: "The skin protects against pathogens, regulates body temperature through sweating and vasodilation/vasoconstriction, contains sensory receptors for touch, pain, and temperature, and synthesizes vitamin D when exposed to sunlight. These are all essential functions of the integumentary system.",
    rationaleIncorrect: [
      "The skin acts as a physical barrier against microorganisms and environmental hazards",
      "Sweat glands and blood vessel changes help regulate body temperature",
      "The skin contains numerous sensory nerve endings for touch, pressure, pain, and temperature",
      "Insulin is produced by the pancreas, not the skin",
      "The skin synthesizes vitamin D precursors when exposed to ultraviolet light"
    ],
    difficulty: 1,
    bloomLevel: "recall",
    clinicalCorrelation: "Skin assessment is a routine nursing task. Changes in skin integrity, colour, temperature, and turgor provide important clinical information about a patient's overall health status.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["anatomy", "integumentary", "skin", "largest organ"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-108",
    course: "pre-nursing",
    topic: "Anatomy & Body Systems Basics",
    subtopic: "Endocrine System",
    stem: "Which gland produces insulin?",
    options: ["Thyroid gland", "Adrenal gland", "Pancreas", "Pituitary gland"],
    correctAnswer: 2,
    type: "mcq",
    rationaleCorrect: "The pancreas produces insulin from the beta cells of the islets of Langerhans. Insulin is essential for regulating blood glucose levels by facilitating the uptake of glucose into cells for energy production.",
    rationaleIncorrect: [
      "The thyroid gland produces thyroid hormones (T3 and T4) that regulate metabolism",
      "The adrenal gland produces cortisol, aldosterone, and epinephrine",
      "The pituitary gland is the 'master gland' producing growth hormone, TSH, ACTH, and other hormones"
    ],
    difficulty: 1,
    bloomLevel: "recall",
    clinicalCorrelation: "Insulin deficiency or resistance leads to diabetes mellitus. Nurses monitor blood glucose levels and administer insulin as part of diabetes management.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["anatomy", "endocrine", "pancreas", "insulin", "diabetes"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-109",
    course: "pre-nursing",
    topic: "Anatomy & Body Systems Basics",
    subtopic: "Blood Components",
    stem: "Which blood component is primarily responsible for oxygen transport?",
    options: ["White blood cells", "Platelets", "Red blood cells (erythrocytes)", "Plasma"],
    correctAnswer: 2,
    type: "mcq",
    rationaleCorrect: "Red blood cells (erythrocytes) contain hemoglobin, a protein that binds to oxygen in the lungs and transports it to tissues throughout the body. Each molecule of hemoglobin can carry up to four molecules of oxygen.",
    rationaleIncorrect: [
      "White blood cells (leukocytes) are part of the immune system and fight infection",
      "Platelets (thrombocytes) are involved in blood clotting and hemostasis",
      "Plasma is the liquid portion of blood that transports proteins, electrolytes, and waste products"
    ],
    difficulty: 1,
    bloomLevel: "recall",
    clinicalCorrelation: "A decrease in red blood cells or hemoglobin (anemia) reduces oxygen-carrying capacity and can cause fatigue, pallor, and shortness of breath.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["anatomy", "blood", "red blood cells", "hemoglobin", "oxygen transport"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-110",
    course: "pre-nursing",
    topic: "Anatomy & Body Systems Basics",
    subtopic: "Lymphatic System",
    stem: "The lymphatic system plays a primary role in:",
    options: [
      "Producing insulin",
      "Immune defense and fluid balance",
      "Hormone regulation",
      "Bone formation"
    ],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "The lymphatic system plays a primary role in immune defense by filtering pathogens and foreign materials through lymph nodes. It also helps maintain fluid balance by returning excess interstitial fluid to the bloodstream.",
    rationaleIncorrect: [
      "Insulin production is a function of the pancreas",
      "Hormone regulation is primarily managed by the endocrine system",
      "Bone formation is managed by the musculoskeletal system with osteoblasts and osteoclasts"
    ],
    difficulty: 2,
    bloomLevel: "recall",
    clinicalCorrelation: "Nurses assess lymph nodes for swelling (lymphadenopathy), which can indicate infection, inflammation, or malignancy.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["anatomy", "lymphatic system", "immune defense", "fluid balance"],
    estimatedTimeSeconds: 45
  },

  // ===== HEALTH ASSESSMENT FUNDAMENTALS (pn-111 to pn-120) =====
  {
    id: "pn-111",
    course: "pre-nursing",
    topic: "Health Assessment Fundamentals",
    subtopic: "Assessment Techniques",
    stem: "What is the correct sequence of physical assessment techniques?",
    options: [
      "Palpation, inspection, percussion, auscultation",
      "Inspection, palpation, percussion, auscultation",
      "Auscultation, inspection, palpation, percussion",
      "Percussion, auscultation, inspection, palpation"
    ],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "The correct sequence for physical assessment is inspection (visual observation), palpation (touch), percussion (tapping), and auscultation (listening with a stethoscope). The exception is abdominal assessment, where auscultation precedes palpation and percussion.",
    rationaleIncorrect: [
      "Palpation should not precede inspection; visual assessment comes first",
      "Auscultation is typically performed last in the general sequence",
      "Percussion is not the first step in the assessment sequence"
    ],
    difficulty: 1,
    bloomLevel: "recall",
    clinicalCorrelation: "Following the correct assessment sequence ensures thorough data collection and prevents findings from being altered by the assessment itself.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["assessment", "physical examination", "inspection", "palpation", "auscultation"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-112",
    course: "pre-nursing",
    topic: "Health Assessment Fundamentals",
    subtopic: "Abdominal Assessment",
    stem: "When performing an abdominal assessment, which technique is performed immediately after inspection?",
    options: ["Palpation", "Percussion", "Auscultation", "Deep palpation"],
    correctAnswer: 2,
    type: "mcq",
    rationaleCorrect: "In abdominal assessment, the sequence differs from other body systems. After inspection, auscultation is performed next to assess bowel sounds before palpation or percussion, which could alter bowel motility and produce inaccurate findings.",
    rationaleIncorrect: [
      "Palpation before auscultation can stimulate or alter bowel sounds",
      "Percussion before auscultation can also alter bowel activity",
      "Deep palpation is performed last and is the most invasive technique"
    ],
    difficulty: 2,
    bloomLevel: "understanding",
    clinicalCorrelation: "The modified assessment sequence for the abdomen ensures accurate bowel sound assessment, which is essential for detecting ileus, bowel obstruction, and other GI conditions.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["assessment", "abdominal assessment", "auscultation", "bowel sounds"],
    estimatedTimeSeconds: 45
  },
  {
    id: "pn-113",
    course: "pre-nursing",
    topic: "Health Assessment Fundamentals",
    subtopic: "Subjective vs Objective Data",
    stem: "A patient states, \"My pain is 7 out of 10.\" This is an example of:",
    options: ["Objective data", "Subjective data", "Diagnostic data", "Empirical data"],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "Subjective data is information reported by the patient and cannot be directly measured or observed by the nurse. A pain rating is subjective because it is the patient's personal perception and experience. Only the patient can describe their pain intensity.",
    rationaleIncorrect: [
      "Objective data is measurable and observable (e.g., vital signs, lab values, wound measurements)",
      "Diagnostic data refers to test results and imaging findings",
      "Empirical data refers to information derived from research or experimentation"
    ],
    difficulty: 1,
    bloomLevel: "understanding",
    clinicalCorrelation: "Nurses distinguish between subjective and objective data to create comprehensive assessments and develop individualized care plans.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["assessment", "subjective data", "objective data", "pain", "documentation"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-114",
    course: "pre-nursing",
    topic: "Health Assessment Fundamentals",
    subtopic: "Nursing Process",
    stem: "The first step of the nursing process is:",
    options: ["Diagnosis", "Planning", "Assessment", "Implementation"],
    correctAnswer: 2,
    type: "mcq",
    rationaleCorrect: "Assessment is the first step of the nursing process (ADPIE: Assessment, Diagnosis, Planning, Implementation, Evaluation). It involves systematic data collection through health history, physical examination, and review of diagnostic results.",
    rationaleIncorrect: [
      "Diagnosis is the second step, following assessment",
      "Planning is the third step, after assessment and diagnosis",
      "Implementation is the fourth step, where the care plan is put into action"
    ],
    difficulty: 1,
    bloomLevel: "recall",
    clinicalCorrelation: "Thorough assessment provides the foundation for all subsequent nursing actions. Without accurate assessment, nursing diagnoses and interventions may be inappropriate.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["assessment", "nursing process", "ADPIE", "foundations"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-115",
    course: "pre-nursing",
    topic: "Health Assessment Fundamentals",
    subtopic: "Head-to-Toe Assessment",
    stem: "During a head-to-toe assessment, the nurse assesses pupil reaction. The expected finding is pupils that are:",
    options: [
      "Fixed and dilated",
      "Unequal in size",
      "Equal, round, and reactive to light",
      "Constricted and non-reactive"
    ],
    correctAnswer: 2,
    type: "mcq",
    rationaleCorrect: "Normal pupil findings are described as PERRLA: Pupils Equal, Round, Reactive to Light, and Accommodation. This indicates normal cranial nerve function and intact neurological pathways.",
    rationaleIncorrect: [
      "Fixed and dilated pupils may indicate severe neurological damage or brain death",
      "Unequal pupils (anisocoria) may indicate neurological pathology and require further assessment",
      "Constricted and non-reactive pupils may indicate opioid overdose or specific neurological conditions"
    ],
    difficulty: 1,
    bloomLevel: "recall",
    clinicalCorrelation: "Pupil assessment is a quick, non-invasive neurological check. Changes in pupil response can indicate increased intracranial pressure or neurological deterioration.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["assessment", "pupils", "PERRLA", "neurological", "head-to-toe"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-116",
    course: "pre-nursing",
    topic: "Health Assessment Fundamentals",
    subtopic: "Skin Assessment",
    stem: "During skin assessment, a nurse notes that the patient's skin rebounds slowly after being gently pinched. This finding is known as:",
    options: ["Jaundice", "Cyanosis", "Poor skin turgor", "Petechiae"],
    correctAnswer: 2,
    type: "mcq",
    rationaleCorrect: "Poor (decreased) skin turgor occurs when the skin rebounds slowly after being pinched, forming a 'tent' that takes longer than 2-3 seconds to return to its normal position. This is a sign of dehydration, especially in adults.",
    rationaleIncorrect: [
      "Jaundice is a yellowing of the skin due to elevated bilirubin levels",
      "Cyanosis is a bluish discolouration of the skin due to inadequate oxygenation",
      "Petechiae are small, flat, round red or purple spots caused by bleeding under the skin"
    ],
    difficulty: 2,
    bloomLevel: "understanding",
    clinicalCorrelation: "Skin turgor assessment is a simple bedside test for hydration status. Nurses assess turgor on the forearm or sternum, as skin elasticity decreases with age.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["assessment", "skin turgor", "dehydration", "skin assessment"],
    estimatedTimeSeconds: 45
  },
  {
    id: "pn-117",
    course: "pre-nursing",
    topic: "Health Assessment Fundamentals",
    subtopic: "Health History",
    stem: "When collecting a patient's health history, which question best elicits information about the patient's current health concern?",
    options: [
      "\"What medications do you take?\"",
      "\"What brought you to the hospital today?\"",
      "\"Do you have any allergies?\"",
      "\"What is your family medical history?\""
    ],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "\"What brought you to the hospital today?\" is an open-ended question that allows the patient to describe their chief complaint in their own words. This is the starting point for the history of present illness and guides the focused assessment.",
    rationaleIncorrect: [
      "Medication history is important but does not address the current concern directly",
      "Allergy assessment is essential for safety but is a separate component of the history",
      "Family medical history provides background information but does not address the current reason for seeking care"
    ],
    difficulty: 1,
    bloomLevel: "understanding",
    clinicalCorrelation: "Eliciting the chief complaint in the patient's own words provides valuable context and ensures the nurse focuses on the most pressing health issue.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["assessment", "health history", "chief complaint", "interview"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-118",
    course: "pre-nursing",
    topic: "Health Assessment Fundamentals",
    subtopic: "Lung Sounds",
    stem: "Normal breath sounds heard over most lung fields during auscultation are called:",
    options: ["Bronchial sounds", "Bronchovesicular sounds", "Vesicular sounds", "Adventitious sounds"],
    correctAnswer: 2,
    type: "mcq",
    rationaleCorrect: "Vesicular breath sounds are the normal, soft, low-pitched sounds heard over most peripheral lung fields during auscultation. They are louder during inspiration and softer during expiration.",
    rationaleIncorrect: [
      "Bronchial sounds are loud, high-pitched sounds normally heard over the trachea; they are abnormal when heard over peripheral lung fields",
      "Bronchovesicular sounds are moderate in pitch and normally heard between the scapulae and over the upper sternum",
      "Adventitious sounds are abnormal sounds such as crackles, wheezes, or rhonchi that indicate pathology"
    ],
    difficulty: 2,
    bloomLevel: "recall",
    clinicalCorrelation: "Recognizing normal versus abnormal breath sounds is essential for detecting respiratory conditions such as pneumonia, asthma, and pleural effusion.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["assessment", "lung sounds", "vesicular", "auscultation", "respiratory"],
    estimatedTimeSeconds: 45
  },
  {
    id: "pn-119",
    course: "pre-nursing",
    topic: "Health Assessment Fundamentals",
    subtopic: "Glasgow Coma Scale",
    stem: "The Glasgow Coma Scale (GCS) assesses:",
    options: [
      "Pain intensity",
      "Level of consciousness",
      "Fall risk",
      "Skin integrity"
    ],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "The Glasgow Coma Scale (GCS) is a standardized neurological assessment tool that evaluates level of consciousness by scoring three components: eye opening (1-4), verbal response (1-5), and motor response (1-6). The total score ranges from 3 to 15.",
    rationaleIncorrect: [
      "Pain intensity is assessed using the Numeric Rating Scale or other pain tools",
      "Fall risk is assessed using the Morse Fall Scale",
      "Skin integrity is assessed using the Braden Scale"
    ],
    difficulty: 2,
    bloomLevel: "recall",
    clinicalCorrelation: "The GCS is used to monitor patients with head injuries, neurological conditions, and altered consciousness. A declining GCS score indicates neurological deterioration.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["assessment", "Glasgow Coma Scale", "neurological", "level of consciousness"],
    estimatedTimeSeconds: 45
  },
  {
    id: "pn-120",
    course: "pre-nursing",
    topic: "Health Assessment Fundamentals",
    subtopic: "Focused Assessment",
    stem: "A focused assessment is performed when:",
    options: [
      "The patient is admitted to the hospital for the first time",
      "A specific health concern or change in condition requires targeted evaluation",
      "Annual physical examinations are scheduled",
      "A comprehensive database is needed"
    ],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "A focused assessment is a targeted evaluation that concentrates on a specific body system or health concern. It is performed when a patient presents with a particular complaint or when there is a change in condition that requires detailed evaluation of a specific area.",
    rationaleIncorrect: [
      "Initial admission assessments are comprehensive, not focused",
      "Annual physical examinations are comprehensive assessments",
      "A comprehensive database requires a complete head-to-toe assessment, not a focused one"
    ],
    difficulty: 1,
    bloomLevel: "understanding",
    clinicalCorrelation: "Focused assessments allow nurses to efficiently evaluate specific concerns without performing a complete head-to-toe assessment, saving time and directing interventions appropriately.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["assessment", "focused assessment", "nursing process", "clinical judgment"],
    estimatedTimeSeconds: 30
  },

  // ===== GROWTH & DEVELOPMENT (pn-121 to pn-130) =====
  {
    id: "pn-121",
    course: "pre-nursing",
    topic: "Growth & Development",
    subtopic: "Erikson's Stages",
    stem: "According to Erikson's psychosocial development theory, the developmental task of adolescents (12-18 years) is:",
    options: [
      "Trust vs. Mistrust",
      "Industry vs. Inferiority",
      "Identity vs. Role Confusion",
      "Intimacy vs. Isolation"
    ],
    correctAnswer: 2,
    type: "mcq",
    rationaleCorrect: "Erikson's fifth stage, Identity vs. Role Confusion, occurs during adolescence (12-18 years). During this stage, adolescents explore their identity, values, beliefs, and goals. Successful resolution leads to a strong sense of personal identity.",
    rationaleIncorrect: [
      "Trust vs. Mistrust is the first stage, occurring in infancy (0-18 months)",
      "Industry vs. Inferiority is the fourth stage, occurring in school age (6-12 years)",
      "Intimacy vs. Isolation is the sixth stage, occurring in young adulthood (18-40 years)"
    ],
    difficulty: 1,
    bloomLevel: "recall",
    clinicalCorrelation: "Understanding adolescent development helps nurses provide age-appropriate care, communicate effectively, and support identity formation during health challenges.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["growth and development", "Erikson", "adolescence", "identity", "psychosocial"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-122",
    course: "pre-nursing",
    topic: "Growth & Development",
    subtopic: "Infant Development",
    stem: "A major developmental milestone for an infant at 6 months of age is:",
    options: [
      "Walking independently",
      "Speaking in complete sentences",
      "Sitting with support",
      "Riding a tricycle"
    ],
    correctAnswer: 2,
    type: "mcq",
    rationaleCorrect: "At approximately 6 months of age, infants can sit with support and may begin to sit independently briefly. Other milestones at this age include reaching for objects, rolling over, and babbling. These milestones reflect normal motor development.",
    rationaleIncorrect: [
      "Walking independently typically occurs around 12 months of age",
      "Speaking in complete sentences develops between 2-3 years of age",
      "Riding a tricycle is a preschool milestone, typically around 3 years of age"
    ],
    difficulty: 1,
    bloomLevel: "recall",
    clinicalCorrelation: "Nurses assess developmental milestones during well-child visits to identify delays early, allowing for timely intervention and referral.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["growth and development", "infant", "milestones", "motor development"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-123",
    course: "pre-nursing",
    topic: "Growth & Development",
    subtopic: "Piaget's Theory",
    stem: "According to Piaget's cognitive development theory, a child in the 'preoperational stage' is typically:",
    options: ["0-2 years old", "2-7 years old", "7-11 years old", "12 years and older"],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "Piaget's preoperational stage spans approximately ages 2-7 years. Children in this stage develop symbolic thinking (using language and imagination), engage in pretend play, and are egocentric (difficulty seeing others' perspectives). They do not yet understand conservation or logical reasoning.",
    rationaleIncorrect: [
      "0-2 years is the sensorimotor stage, where infants learn through sensory experiences and motor actions",
      "7-11 years is the concrete operational stage, where children develop logical thinking about concrete events",
      "12 years and older is the formal operational stage, where abstract and hypothetical thinking develops"
    ],
    difficulty: 2,
    bloomLevel: "recall",
    clinicalCorrelation: "Understanding cognitive stages helps nurses use age-appropriate language and teaching strategies when explaining procedures or providing health education to children.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["growth and development", "Piaget", "preoperational", "cognitive development"],
    estimatedTimeSeconds: 45
  },
  {
    id: "pn-124",
    course: "pre-nursing",
    topic: "Growth & Development",
    subtopic: "Toddler Development",
    stem: "The most common safety concern for toddlers (1-3 years) is:",
    options: ["Substance abuse", "Accidental injury and poisoning", "Peer pressure", "Eating disorders"],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "Toddlers are naturally curious, mobile, and lack the cognitive ability to recognize danger. Accidental injuries (falls, burns, drowning) and poisoning are the most common safety concerns for this age group. Childproofing and constant supervision are essential.",
    rationaleIncorrect: [
      "Substance abuse is primarily a concern for adolescents and adults",
      "Peer pressure becomes significant in school age and adolescence",
      "Eating disorders typically emerge in adolescence"
    ],
    difficulty: 1,
    bloomLevel: "understanding",
    clinicalCorrelation: "Nurses provide anticipatory guidance to parents about childproofing the home, safe medication storage, water safety, and supervision to prevent accidental injuries.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["growth and development", "toddler", "safety", "poisoning", "injury prevention"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-125",
    course: "pre-nursing",
    topic: "Growth & Development",
    subtopic: "Older Adult",
    stem: "Which of the following are normal physiological changes associated with aging? (Select all that apply)",
    options: [
      "Decreased reaction time",
      "Decreased skin elasticity",
      "Increased muscle mass",
      "Decreased visual acuity",
      "Improved short-term memory",
      "Decreased bone density"
    ],
    correctAnswers: [0, 1, 3, 5],
    type: "sata",
    rationaleCorrect: "Normal aging includes decreased reaction time from slower nerve conduction, decreased skin elasticity leading to wrinkles and poor turgor, decreased visual acuity from presbyopia, and decreased bone density increasing fracture risk. These changes are expected and guide nursing assessments for older adults.",
    rationaleIncorrect: [
      "Decreased reaction time results from slower nerve conduction velocity",
      "Decreased skin elasticity is a normal aging change affecting turgor assessment",
      "Muscle mass decreases with age (sarcopenia), not increases",
      "Visual acuity typically decreases with age due to presbyopia and other changes",
      "Short-term memory tends to decline with normal aging, not improve",
      "Decreased bone density (osteopenia/osteoporosis) is a common aging change"
    ],
    difficulty: 3,
    bloomLevel: "understanding",
    clinicalCorrelation: "Understanding age-related changes helps nurses provide appropriate care, modify teaching approaches, and implement safety measures for older adults.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["growth and development", "older adult", "aging", "physiological changes"],
    estimatedTimeSeconds: 45
  },
  {
    id: "pn-126",
    course: "pre-nursing",
    topic: "Growth & Development",
    subtopic: "Erikson's Stages",
    stem: "According to Erikson, the developmental task of infancy (0-18 months) is:",
    options: [
      "Autonomy vs. Shame and Doubt",
      "Trust vs. Mistrust",
      "Initiative vs. Guilt",
      "Industry vs. Inferiority"
    ],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "Trust vs. Mistrust is Erikson's first psychosocial stage, occurring from birth to approximately 18 months. Infants develop trust when caregivers consistently meet their needs for food, warmth, comfort, and affection. Inconsistent care leads to mistrust.",
    rationaleIncorrect: [
      "Autonomy vs. Shame and Doubt occurs in toddlerhood (18 months - 3 years)",
      "Initiative vs. Guilt occurs in the preschool years (3-6 years)",
      "Industry vs. Inferiority occurs in school age (6-12 years)"
    ],
    difficulty: 1,
    bloomLevel: "recall",
    clinicalCorrelation: "In hospital settings, nurses promote trust in infants by maintaining consistent routines, minimizing separation from caregivers, and providing comfort measures.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["growth and development", "Erikson", "infancy", "trust", "psychosocial"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-127",
    course: "pre-nursing",
    topic: "Growth & Development",
    subtopic: "School-Age Development",
    stem: "Which activity is most developmentally appropriate for a school-age child (6-12 years)?",
    options: [
      "Playing peek-a-boo",
      "Board games with rules and teamwork",
      "Exploring by putting objects in the mouth",
      "Abstract philosophical discussions"
    ],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "Board games with rules and teamwork are appropriate for school-age children because they are in Erikson's stage of Industry vs. Inferiority and Piaget's concrete operational stage. They enjoy structured activities, following rules, and developing competence through achievement.",
    rationaleIncorrect: [
      "Peek-a-boo is appropriate for infants who are developing object permanence",
      "Exploring objects by mouthing is characteristic of infants in the sensorimotor stage",
      "Abstract philosophical discussions are appropriate for adolescents and adults in the formal operational stage"
    ],
    difficulty: 1,
    bloomLevel: "understanding",
    clinicalCorrelation: "Providing age-appropriate activities during hospitalization promotes normal development and reduces the psychological impact of illness on children.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["growth and development", "school-age", "play", "developmentally appropriate"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-128",
    course: "pre-nursing",
    topic: "Growth & Development",
    subtopic: "Preschool Development",
    stem: "A preschool-age child (3-6 years) who fears that medical procedures are punishment is demonstrating which cognitive characteristic?",
    options: ["Object permanence", "Magical thinking", "Abstract reasoning", "Conservation"],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "Magical thinking is a characteristic of Piaget's preoperational stage (ages 2-7). Preschoolers may believe that their thoughts or actions caused their illness or that medical procedures are punishment for misbehaviour. Nurses should reassure children that procedures are not their fault.",
    rationaleIncorrect: [
      "Object permanence develops during the sensorimotor stage in infancy",
      "Abstract reasoning develops in the formal operational stage during adolescence",
      "Conservation (understanding that quantity remains the same despite changes in shape) develops in the concrete operational stage"
    ],
    difficulty: 2,
    bloomLevel: "understanding",
    clinicalCorrelation: "Nurses use simple, honest explanations and reassurance to address magical thinking and reduce fear and anxiety in preschool patients.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["growth and development", "preschool", "magical thinking", "Piaget", "cognitive"],
    estimatedTimeSeconds: 45
  },
  {
    id: "pn-129",
    course: "pre-nursing",
    topic: "Growth & Development",
    subtopic: "Middle Adulthood",
    stem: "According to Erikson, the primary psychosocial task of middle adulthood (40-65 years) is:",
    options: [
      "Identity vs. Role Confusion",
      "Intimacy vs. Isolation",
      "Generativity vs. Stagnation",
      "Integrity vs. Despair"
    ],
    correctAnswer: 2,
    type: "mcq",
    rationaleCorrect: "Generativity vs. Stagnation is Erikson's seventh stage, occurring during middle adulthood (approximately 40-65 years). Adults in this stage focus on contributing to society, guiding the next generation, and creating a lasting legacy through work, family, and community involvement.",
    rationaleIncorrect: [
      "Identity vs. Role Confusion occurs during adolescence (12-18 years)",
      "Intimacy vs. Isolation occurs during young adulthood (18-40 years)",
      "Integrity vs. Despair occurs during late adulthood (65+ years)"
    ],
    difficulty: 2,
    bloomLevel: "recall",
    clinicalCorrelation: "Middle-aged adults facing chronic illness may struggle with generativity if they feel unable to contribute. Nurses support coping and role adaptation.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["growth and development", "Erikson", "middle adulthood", "generativity"],
    estimatedTimeSeconds: 45
  },
  {
    id: "pn-130",
    course: "pre-nursing",
    topic: "Growth & Development",
    subtopic: "Principles of Growth",
    stem: "Growth and development follows which general pattern?",
    options: [
      "Distal to proximal (extremities to trunk)",
      "Cephalocaudal (head to toe) and proximodistal (centre to periphery)",
      "Random with no predictable pattern",
      "Peripheral to central"
    ],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "Growth and development follows predictable patterns: cephalocaudal (head to toe), meaning head control develops before walking, and proximodistal (centre to periphery), meaning trunk control develops before fine finger movements.",
    rationaleIncorrect: [
      "Distal to proximal is the reverse of the actual pattern; development occurs from proximal to distal",
      "Growth and development follow predictable, sequential patterns, not random ones",
      "Development proceeds from central to peripheral, not the reverse"
    ],
    difficulty: 2,
    bloomLevel: "understanding",
    clinicalCorrelation: "Understanding growth patterns helps nurses assess developmental milestones and identify delays that may require early intervention.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["growth and development", "cephalocaudal", "proximodistal", "principles"],
    estimatedTimeSeconds: 45
  },

  // ===== LEGAL & PROFESSIONAL STANDARDS (pn-131 to pn-140) =====
  {
    id: "pn-131",
    course: "pre-nursing",
    topic: "Legal & Professional Standards",
    subtopic: "Scope of Practice",
    stem: "Which of the following define a nurse's scope of practice? (Select all that apply)",
    options: [
      "Provincial or territorial nursing legislation",
      "Nursing regulatory body standards",
      "The attending physician's preferences",
      "The nurse's education and competency",
      "The nurse's personal comfort level"
    ],
    correctAnswers: [0, 1, 3],
    type: "sata",
    rationaleCorrect: "Scope of practice is defined by provincial or territorial legislation, nursing regulatory body standards, and the nurse's individual education and demonstrated competency. These three elements together determine what activities a nurse is authorized to perform.",
    rationaleIncorrect: [
      "Provincial or territorial legislation establishes the legal framework for nursing practice",
      "Regulatory body standards outline the expectations and boundaries of practice",
      "Physicians do not define nursing scope; nursing is a self-regulated profession",
      "Education and competency determine the individual nurse's ability to perform specific tasks",
      "Personal comfort level does not determine scope; it is defined by regulatory standards and competency"
    ],
    difficulty: 1,
    bloomLevel: "recall",
    clinicalCorrelation: "Practising within scope of practice protects both the nurse and the patient. Nurses must know their scope and seek clarification when unsure about an assigned task.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["legal", "scope of practice", "regulatory body", "professional standards"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-132",
    course: "pre-nursing",
    topic: "Legal & Professional Standards",
    subtopic: "Negligence",
    stem: "Negligence in nursing occurs when:",
    options: [
      "A nurse intentionally harms a patient",
      "A nurse fails to provide the standard of care that a reasonable nurse would provide",
      "A patient falls despite all safety measures being in place",
      "A nurse follows physician orders correctly"
    ],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "Negligence is the failure to provide care that meets the accepted standard of practice, resulting in harm to the patient. It involves a duty of care, breach of that duty, causation, and damages. It differs from intentional torts because negligence is unintentional.",
    rationaleIncorrect: [
      "Intentional harm is assault or battery, not negligence",
      "If all reasonable safety measures were in place, this may not constitute negligence",
      "Following physician orders correctly is practicing within acceptable standards"
    ],
    difficulty: 2,
    bloomLevel: "understanding",
    clinicalCorrelation: "Nurses protect themselves from negligence claims by documenting thoroughly, following evidence-based standards, and providing competent care within their scope of practice.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["legal", "negligence", "standard of care", "malpractice", "liability"],
    estimatedTimeSeconds: 45
  },
  {
    id: "pn-133",
    course: "pre-nursing",
    topic: "Legal & Professional Standards",
    subtopic: "Delegation",
    stem: "When delegating tasks, the nurse remains responsible for:",
    options: [
      "Only the tasks they perform personally",
      "Ensuring the delegated task is within the delegate's scope and supervising its completion",
      "Nothing, once the task is delegated",
      "Only documenting the delegation"
    ],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "The delegating nurse retains accountability for ensuring the task is appropriate for the delegate's scope, the delegate is competent, clear instructions are given, and appropriate supervision and follow-up are provided. Delegation does not transfer accountability.",
    rationaleIncorrect: [
      "The nurse is responsible for both personal tasks and oversight of delegated tasks",
      "Accountability cannot be delegated; the nurse remains responsible for patient outcomes",
      "Documentation is part of the process but does not represent the full scope of delegation responsibility"
    ],
    difficulty: 2,
    bloomLevel: "understanding",
    clinicalCorrelation: "Effective delegation is essential for efficient nursing care. Nurses must evaluate the five rights of delegation: right task, right circumstance, right person, right direction, and right supervision.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["legal", "delegation", "accountability", "supervision", "teamwork"],
    estimatedTimeSeconds: 45
  },
  {
    id: "pn-134",
    course: "pre-nursing",
    topic: "Legal & Professional Standards",
    subtopic: "Mandatory Reporting",
    stem: "Nurses are legally required to report which of the following?",
    options: [
      "A patient's dissatisfaction with hospital food",
      "Suspected child abuse or neglect",
      "A colleague arriving 5 minutes late for their shift",
      "A patient's request for a second opinion"
    ],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "Nurses are legally obligated to report suspected child abuse or neglect to the appropriate authorities (e.g., child protection services). This is a mandatory reporting requirement in all Canadian provinces and territories, and failure to report can result in legal consequences.",
    rationaleIncorrect: [
      "Dissatisfaction with food is addressed through patient services, not mandatory reporting",
      "Minor tardiness is a workplace management issue, not a legal reporting requirement",
      "A patient's request for a second opinion is a right, not something that requires reporting"
    ],
    difficulty: 2,
    bloomLevel: "understanding",
    clinicalCorrelation: "Nurses are often the first to identify signs of abuse. Mandatory reporting protects vulnerable populations and is a legal and ethical duty.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["legal", "mandatory reporting", "child abuse", "protection", "ethical duty"],
    estimatedTimeSeconds: 45
  },
  {
    id: "pn-135",
    course: "pre-nursing",
    topic: "Legal & Professional Standards",
    subtopic: "Professional Accountability",
    stem: "Which of the following are components of professional accountability in nursing? (Select all that apply)",
    options: [
      "Being answerable for one's own actions and decisions",
      "Following all orders without questioning",
      "Maintaining ongoing professional competence",
      "Practising within one's scope of practice",
      "Avoiding documentation of errors"
    ],
    correctAnswers: [0, 2, 3],
    type: "sata",
    rationaleCorrect: "Professional accountability includes being answerable for one's actions and decisions, maintaining competence through continuing education and self-assessment, and practising within the defined scope of practice. These elements together form the foundation of professional nursing practice.",
    rationaleIncorrect: [
      "Being answerable for actions and decisions is central to accountability",
      "Nurses must use critical thinking and question orders that seem inappropriate or unsafe",
      "Maintaining competence through lifelong learning is an essential component of accountability",
      "Practising within scope protects both the nurse and the patient",
      "Errors must be documented honestly; avoiding documentation violates accountability standards"
    ],
    difficulty: 3,
    bloomLevel: "application",
    clinicalCorrelation: "Accountability is a cornerstone of professional nursing. It includes maintaining competence through continuing education and reflecting on practice.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["legal", "accountability", "professional standards", "nursing practice"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-136",
    course: "pre-nursing",
    topic: "Legal & Professional Standards",
    subtopic: "Incident Reports",
    stem: "The primary purpose of an incident (occurrence) report is to:",
    options: [
      "Assign blame to the individual responsible",
      "Document the event for quality improvement and risk management",
      "Replace the patient's health record documentation",
      "Provide evidence for disciplinary action"
    ],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "Incident reports are used for quality improvement and risk management purposes. They document unusual events, near misses, and adverse events to identify patterns and implement system changes that prevent future occurrences.",
    rationaleIncorrect: [
      "Incident reports are not intended to assign blame but to improve systems",
      "Incident reports are separate documents and do not replace health record documentation",
      "While incidents may lead to review, the primary purpose is quality improvement, not discipline"
    ],
    difficulty: 2,
    bloomLevel: "understanding",
    clinicalCorrelation: "Completing incident reports honestly and promptly contributes to a culture of safety and continuous improvement in healthcare settings.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["legal", "incident report", "quality improvement", "risk management", "safety"],
    estimatedTimeSeconds: 45
  },
  {
    id: "pn-137",
    course: "pre-nursing",
    topic: "Legal & Professional Standards",
    subtopic: "Consent Capacity",
    stem: "A healthcare provider determines that a patient lacks decision-making capacity. This means the patient:",
    options: [
      "Must be discharged immediately",
      "Cannot understand, retain, or weigh information to make a specific healthcare decision",
      "Has been declared legally incompetent by a court",
      "Is under 18 years of age"
    ],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "Lacking decision-making capacity means the patient cannot understand relevant information, retain it, use it to weigh options, or communicate a decision. Capacity is assessed for specific decisions and can fluctuate. It is different from legal incompetence, which requires a court declaration.",
    rationaleIncorrect: [
      "Lacking capacity does not require discharge; a substitute decision-maker can provide consent",
      "Legal incompetence is a separate court-determined status; capacity assessment is a clinical determination",
      "Age alone does not determine capacity; mature minors may have capacity for certain decisions"
    ],
    difficulty: 3,
    bloomLevel: "understanding",
    clinicalCorrelation: "Nurses assess capacity as part of the consent process and involve substitute decision-makers when patients cannot make informed decisions.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["legal", "capacity", "consent", "decision-making", "substitute decision-maker"],
    estimatedTimeSeconds: 60
  },
  {
    id: "pn-138",
    course: "pre-nursing",
    topic: "Legal & Professional Standards",
    subtopic: "Professional Boundaries",
    stem: "Which situation represents a violation of professional boundaries?",
    options: [
      "Providing emotional support to a grieving patient",
      "Accepting a large monetary gift from a patient's family",
      "Advocating for a patient's treatment preferences",
      "Educating a patient about their medication regimen"
    ],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "Accepting large monetary gifts from patients or families crosses professional boundaries and creates a dual relationship that can compromise objective clinical judgment. Nurses should politely decline and redirect gratitude appropriately.",
    rationaleIncorrect: [
      "Providing emotional support is within the therapeutic nurse-patient relationship",
      "Advocating for patient preferences is a core nursing role",
      "Patient education is a fundamental nursing responsibility"
    ],
    difficulty: 2,
    bloomLevel: "application",
    clinicalCorrelation: "Maintaining professional boundaries protects both the nurse and the patient and ensures the therapeutic relationship remains focused on patient needs.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["legal", "professional boundaries", "ethics", "therapeutic relationship"],
    estimatedTimeSeconds: 45
  },
  {
    id: "pn-139",
    course: "pre-nursing",
    topic: "Legal & Professional Standards",
    subtopic: "Continuing Competence",
    stem: "Continuing competence in nursing requires:",
    options: [
      "Working the maximum number of hours possible",
      "Ongoing professional development and self-assessment",
      "Obtaining a new degree every 5 years",
      "Only attending mandatory workplace training"
    ],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "Continuing competence requires nurses to engage in ongoing professional development, self-assessment, and lifelong learning. This includes attending workshops, reviewing current evidence, reflective practice, and maintaining skills relevant to their area of practice.",
    rationaleIncorrect: [
      "Working excessive hours does not ensure competence and may impair it through fatigue",
      "A new degree every 5 years is not required; continuing education and self-assessment are sufficient",
      "Mandatory workplace training alone may not address all areas of competence"
    ],
    difficulty: 1,
    bloomLevel: "recall",
    clinicalCorrelation: "Regulatory bodies require nurses to demonstrate continuing competence as a condition of licence renewal. This ensures the public receives safe, competent care.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["legal", "continuing competence", "professional development", "lifelong learning"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-140",
    course: "pre-nursing",
    topic: "Legal & Professional Standards",
    subtopic: "Whistleblowing",
    stem: "A nurse who reports unsafe practices by a colleague to the appropriate authority is engaging in:",
    options: [
      "Gossip",
      "Whistleblowing (reporting in good faith)",
      "Defamation",
      "Insubordination"
    ],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "Whistleblowing is the act of reporting unsafe, unethical, or illegal practices to the appropriate authority in good faith. Nurses have a professional and ethical obligation to report concerns about patient safety, and many jurisdictions provide legal protections for whistleblowers.",
    rationaleIncorrect: [
      "Gossip is spreading information casually; whistleblowing is formal reporting through proper channels",
      "Defamation involves making false statements that damage reputation; good-faith reporting is not defamation",
      "Insubordination is refusing to follow legitimate directives; reporting safety concerns is a professional duty"
    ],
    difficulty: 3,
    bloomLevel: "understanding",
    clinicalCorrelation: "Nurses must advocate for patient safety, even when it means reporting colleagues or supervisors. Proper channels (charge nurse, manager, regulatory body) should be followed.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["legal", "whistleblowing", "patient safety", "advocacy", "reporting"],
    estimatedTimeSeconds: 45
  },

  // ===== CULTURAL COMPETENCE & PATIENT-CENTERED CARE (pn-141 to pn-150) =====
  {
    id: "pn-141",
    course: "pre-nursing",
    topic: "Cultural Competence & Patient-Centered Care",
    subtopic: "Cultural Awareness",
    stem: "Cultural competence in nursing begins with:",
    options: [
      "Learning about every culture in the world",
      "Self-awareness of one's own cultural values, beliefs, and biases",
      "Treating all patients exactly the same way",
      "Avoiding discussions about culture with patients"
    ],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "Cultural competence begins with self-awareness  -  understanding one's own cultural background, values, beliefs, and potential biases. This self-reflection helps nurses recognize how their own culture may influence their interactions with patients from different backgrounds.",
    rationaleIncorrect: [
      "It is impossible to learn about every culture; cultural humility and openness are more practical approaches",
      "Treating all patients the same ignores individual cultural needs and preferences",
      "Avoiding cultural discussions misses opportunities to provide culturally sensitive care"
    ],
    difficulty: 2,
    bloomLevel: "understanding",
    clinicalCorrelation: "Self-awareness allows nurses to approach patients with cultural humility, ask respectful questions, and avoid imposing their own cultural values on patient care.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["cultural competence", "self-awareness", "diversity", "patient-centered care"],
    estimatedTimeSeconds: 45
  },
  {
    id: "pn-142",
    course: "pre-nursing",
    topic: "Cultural Competence & Patient-Centered Care",
    subtopic: "Language Barriers",
    stem: "When a patient speaks a language different from the nurse, the most appropriate action is to:",
    options: [
      "Speak louder and slower",
      "Use a professional interpreter or language services",
      "Ask the patient's child to interpret",
      "Use hand gestures exclusively"
    ],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "Using a professional interpreter or language services ensures accurate communication while protecting patient confidentiality. Professional interpreters are trained in medical terminology and cultural nuances, reducing the risk of miscommunication and errors.",
    rationaleIncorrect: [
      "Speaking louder does not help if the patient does not understand the language",
      "Using family members, especially children, is inappropriate because it may compromise confidentiality and accuracy",
      "Hand gestures alone are insufficient for communicating complex medical information"
    ],
    difficulty: 1,
    bloomLevel: "application",
    clinicalCorrelation: "Language barriers can lead to misunderstanding of diagnosis, treatment plans, and medication instructions. Professional interpretation services improve patient outcomes and safety.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["cultural competence", "language barriers", "interpreter", "communication"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-143",
    course: "pre-nursing",
    topic: "Cultural Competence & Patient-Centered Care",
    subtopic: "Patient-Centered Care",
    stem: "Which of the following are principles of patient-centered care? (Select all that apply)",
    options: [
      "Respecting patient preferences and values",
      "Providing emotional support and alleviating fears",
      "The nurse decides what is best without patient input",
      "Involving family and friends as the patient wishes",
      "Ensuring coordination and continuity of care"
    ],
    correctAnswers: [0, 1, 3, 4],
    type: "sata",
    rationaleCorrect: "Patient-centered care includes respecting preferences and values, providing emotional support, involving family as desired, and ensuring coordination and continuity. It places the patient at the centre of all care decisions and activities.",
    rationaleIncorrect: [
      "Respecting patient preferences and values is a core principle",
      "Providing emotional support helps patients cope with illness and treatment",
      "Nurse-directed decisions without patient input contradict patient-centered care principles",
      "Family involvement is encouraged when the patient desires it",
      "Coordination and continuity prevent fragmented care and improve outcomes"
    ],
    difficulty: 3,
    bloomLevel: "application",
    clinicalCorrelation: "Patient-centered care improves satisfaction, adherence to treatment plans, and health outcomes. It is a core competency for all healthcare professionals.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["patient-centered care", "preferences", "values", "holistic care"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-144",
    course: "pre-nursing",
    topic: "Cultural Competence & Patient-Centered Care",
    subtopic: "Dietary Practices",
    stem: "A patient requests a halal meal during their hospital stay. The nurse should:",
    options: [
      "Tell the patient the hospital only serves standard meals",
      "Respect the request and arrange for halal meal options through dietary services",
      "Suggest the patient bring food from home instead",
      "Ignore the request because nutrition content is the same"
    ],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "The nurse should respect the patient's cultural and religious dietary practices and work with dietary services to provide appropriate meal options. Accommodating dietary preferences is part of patient-centered, culturally sensitive care.",
    rationaleIncorrect: [
      "Refusing to accommodate dietary requests disrespects the patient's cultural and religious practices",
      "While bringing food from home may be an option, the hospital should first attempt to accommodate the request",
      "Ignoring cultural dietary requests is disrespectful and does not support patient-centered care"
    ],
    difficulty: 1,
    bloomLevel: "application",
    clinicalCorrelation: "Cultural dietary practices affect patient satisfaction, nutritional intake, and trust in the healthcare system. Nurses advocate for dietary accommodations.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["cultural competence", "dietary practices", "halal", "patient-centered care"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-145",
    course: "pre-nursing",
    topic: "Cultural Competence & Patient-Centered Care",
    subtopic: "Health Disparities",
    stem: "Health disparities refer to:",
    options: [
      "Differences in health outcomes that are linked to social, economic, or environmental disadvantages",
      "Normal variations in health between individuals",
      "Differences in health insurance plans",
      "Genetic variations between populations"
    ],
    correctAnswer: 0,
    type: "mcq",
    rationaleCorrect: "Health disparities are differences in health outcomes and access to healthcare that are closely linked with social, economic, and environmental disadvantages. These affect marginalized populations disproportionately and are influenced by factors such as income, education, geography, and systemic racism.",
    rationaleIncorrect: [
      "Normal individual health variations are not the same as systemic disparities",
      "Insurance plan differences may contribute to disparities but do not define them",
      "While genetic variations exist, health disparities specifically refer to inequities driven by social determinants"
    ],
    difficulty: 3,
    bloomLevel: "understanding",
    clinicalCorrelation: "Nurses play a role in addressing health disparities through advocacy, culturally competent care, and supporting equitable access to health services.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["cultural competence", "health disparities", "equity", "social determinants"],
    estimatedTimeSeconds: 60
  },
  {
    id: "pn-146",
    course: "pre-nursing",
    topic: "Cultural Competence & Patient-Centered Care",
    subtopic: "Spiritual Care",
    stem: "When a patient expresses a desire for spiritual support, the nurse should:",
    options: [
      "Share the nurse's own religious beliefs",
      "Assess the patient's spiritual needs and offer to contact a chaplain or spiritual care provider",
      "Tell the patient to focus on their medical treatment instead",
      "Ignore the request as it is not within nursing scope"
    ],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "When a patient expresses spiritual needs, the nurse should assess those needs through compassionate inquiry and offer to contact a chaplain, spiritual care provider, or other support. Spiritual care is a component of holistic nursing and addresses the patient's emotional and spiritual well-being.",
    rationaleIncorrect: [
      "Sharing personal religious beliefs imposes the nurse's values and crosses professional boundaries",
      "Dismissing spiritual needs ignores an important aspect of holistic care",
      "Spiritual care is within the scope of nursing; nurses assess and address spiritual needs as part of comprehensive care"
    ],
    difficulty: 2,
    bloomLevel: "application",
    clinicalCorrelation: "Spiritual distress can affect coping, healing, and quality of life. Nurses address spiritual needs as part of holistic, patient-centered care.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["cultural competence", "spiritual care", "holistic nursing", "patient-centered care"],
    estimatedTimeSeconds: 45
  },
  {
    id: "pn-147",
    course: "pre-nursing",
    topic: "Cultural Competence & Patient-Centered Care",
    subtopic: "Indigenous Health",
    stem: "When providing care to Indigenous patients in Canada, the nurse should prioritize:",
    options: [
      "Assuming all Indigenous patients have the same health practices",
      "Building trust through cultural safety, respect, and acknowledgment of historical impacts on health",
      "Avoiding discussion of cultural practices",
      "Applying standardized care without cultural consideration"
    ],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "Providing care to Indigenous patients requires cultural safety, which involves building trust, respecting cultural practices, acknowledging the historical impacts of colonialism and residential schools on health, and ensuring the patient feels safe and respected in the healthcare environment.",
    rationaleIncorrect: [
      "Indigenous peoples are diverse with varied cultural practices; generalizations are inappropriate",
      "Avoiding cultural discussions prevents the nurse from understanding and respecting the patient's values",
      "Standardized care without cultural consideration fails to address the unique needs and historical context of Indigenous patients"
    ],
    difficulty: 3,
    bloomLevel: "application",
    clinicalCorrelation: "Cultural safety is essential in Canadian healthcare. Nurses must understand the impacts of colonialism and residential schools and create safe, respectful care environments for Indigenous patients.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["cultural competence", "Indigenous health", "cultural safety", "Canada", "trust"],
    estimatedTimeSeconds: 60
  },
  {
    id: "pn-148",
    course: "pre-nursing",
    topic: "Cultural Competence & Patient-Centered Care",
    subtopic: "Health Literacy",
    stem: "Which of the following strategies address health literacy when teaching a patient about new medication? (Select all that apply)",
    options: [
      "Use plain, jargon-free language",
      "Employ the teach-back method to confirm understanding",
      "Provide visual aids such as diagrams or pictograms",
      "Use complex medical terminology to sound professional",
      "Assume the patient understands because they nodded"
    ],
    correctAnswers: [0, 1, 2],
    type: "sata",
    rationaleCorrect: "Using plain language, employing teach-back methods, and providing visual aids are evidence-based strategies to address varying health literacy levels. These approaches ensure the patient truly comprehends instructions and can safely manage their medication at home.",
    rationaleIncorrect: [
      "Plain language ensures patients can understand key instructions regardless of literacy level",
      "Teach-back confirms comprehension by having the patient explain in their own words",
      "Visual aids reinforce verbal instructions and improve retention",
      "Complex terminology can confuse patients and reduce understanding",
      "Nodding does not confirm comprehension; patients may nod without understanding"
    ],
    difficulty: 3,
    bloomLevel: "application",
    clinicalCorrelation: "Low health literacy is associated with poor health outcomes, medication errors, and increased hospitalizations. Nurses use teach-back to verify understanding.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["cultural competence", "health literacy", "teach-back", "patient education"],
    estimatedTimeSeconds: 45
  },
  {
    id: "pn-149",
    course: "pre-nursing",
    topic: "Cultural Competence & Patient-Centered Care",
    subtopic: "LGBTQ+ Inclusive Care",
    stem: "To provide inclusive care for LGBTQ+ patients, the nurse should:",
    options: [
      "Assume the patient's gender identity based on their appearance",
      "Use the patient's preferred name and pronouns and create a welcoming environment",
      "Avoid asking about the patient's support system",
      "Apply the same assessment questions without modification"
    ],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "Inclusive care for LGBTQ+ patients includes using their preferred name and pronouns, asking open-ended questions about relationships and support systems, and creating a non-judgmental, welcoming environment. This promotes trust and ensures the patient feels safe disclosing relevant health information.",
    rationaleIncorrect: [
      "Assuming gender identity based on appearance can be disrespectful and inaccurate",
      "Understanding the patient's support system is important for holistic care and discharge planning",
      "Assessment questions may need modification to be inclusive (e.g., asking about partners rather than assuming heterosexual relationships)"
    ],
    difficulty: 3,
    bloomLevel: "application",
    clinicalCorrelation: "LGBTQ+ patients may avoid seeking care due to past discrimination. Creating safe, inclusive environments improves health outcomes and trust in the healthcare system.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["cultural competence", "LGBTQ+", "inclusive care", "pronouns", "patient-centered care"],
    estimatedTimeSeconds: 60
  },
  {
    id: "pn-150",
    course: "pre-nursing",
    topic: "Cultural Competence & Patient-Centered Care",
    subtopic: "Cultural Humility",
    stem: "Cultural humility differs from cultural competence in that cultural humility emphasizes:",
    options: [
      "Mastering knowledge about all cultures",
      "An ongoing process of self-reflection, openness, and learning from each patient's unique experience",
      "Treating every patient identically regardless of background",
      "Relying on cultural stereotypes for efficient care"
    ],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "Cultural humility is an ongoing, lifelong process of self-reflection and self-critique. Rather than claiming expertise about another's culture, it emphasizes openness, respectful partnership, and learning from each patient as the expert on their own experience and cultural identity.",
    rationaleIncorrect: [
      "Mastering all cultural knowledge is unrealistic; cultural humility acknowledges the limits of one's knowledge",
      "Identical treatment ignores individual needs and cultural differences",
      "Cultural stereotypes lead to biased care and are contrary to cultural humility"
    ],
    difficulty: 3,
    bloomLevel: "understanding",
    clinicalCorrelation: "Cultural humility encourages nurses to approach each patient interaction as a learning opportunity, fostering deeper connections and more effective, respectful care.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["cultural competence", "cultural humility", "self-reflection", "diversity", "lifelong learning"],
    estimatedTimeSeconds: 60
  },

  {
    id: "pn-151",
    course: "pre-nursing",
    topic: "Basic Math & Dimensional Analysis",
    subtopic: "Drip Rate Calculation",
    stem: "An IV of 500 mL is to infuse over 4 hours using tubing with a drop factor of 15 gtt/mL. What is the drip rate in gtt/min?",
    options: ["25 gtt/min", "31 gtt/min", "42 gtt/min", "60 gtt/min"],
    correctAnswer: 1,
    type: "fill-in-blank",
    rationaleCorrect: "Drip rate = (Volume × Drop factor) / (Time in minutes). (500 × 15) / 240 = 7500 / 240 = 31.25, rounded to 31 gtt/min.",
    rationaleIncorrect: [
      "25 gtt/min is too low for this calculation",
      "42 gtt/min would infuse the volume too quickly",
      "60 gtt/min would infuse 500 mL in about 2 hours"
    ],
    difficulty: 2,
    bloomLevel: "application",
    clinicalCorrelation: "Manual drip rate calculations are essential when infusion pumps are unavailable or malfunctioning.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["math", "drip rate", "IV calculation", "gtt/min"],
    estimatedTimeSeconds: 60
  },
  {
    id: "pn-152",
    course: "pre-nursing",
    topic: "Study Skills & Test-Taking Strategies",
    subtopic: "Critical Thinking",
    stem: "When answering a multiple-choice nursing exam question, which strategy is MOST effective?",
    options: [
      "Always choose the longest answer",
      "Identify what the question is really asking before reviewing options",
      "Choose the first option that seems correct",
      "Look for patterns in answer choices"
    ],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "Identifying the core of the question before looking at options prevents being distracted by plausible distractors. Understanding what is being asked helps select the best answer.",
    rationaleIncorrect: [
      "Answer length is not a reliable indicator of correctness",
      "Rushing to the first plausible option increases error risk",
      "Pattern-seeking is unreliable and can lead to wrong answers"
    ],
    difficulty: 1,
    bloomLevel: "understanding",
    clinicalCorrelation: "Critical thinking skills developed through effective test-taking strategies translate to clinical decision-making at the bedside.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["study skills", "test-taking", "critical thinking", "exam preparation"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-153",
    course: "pre-nursing",
    topic: "Biology Foundations",
    subtopic: "DNA and RNA",
    stem: "Which of the following correctly describes a difference between DNA and RNA?",
    options: [
      "DNA is single-stranded; RNA is double-stranded",
      "DNA contains uracil; RNA contains thymine",
      "DNA contains deoxyribose sugar; RNA contains ribose sugar",
      "DNA is found only in the cytoplasm; RNA is found only in the nucleus"
    ],
    correctAnswer: 2,
    type: "mcq",
    rationaleCorrect: "DNA contains deoxyribose sugar (missing one oxygen atom), while RNA contains ribose sugar. Additionally, DNA is typically double-stranded and uses thymine, whereas RNA is single-stranded and uses uracil.",
    rationaleIncorrect: [
      "DNA is double-stranded; RNA is typically single-stranded",
      "DNA contains thymine; RNA contains uracil, not the reverse",
      "DNA is primarily in the nucleus; RNA is found in both the nucleus and cytoplasm"
    ],
    difficulty: 2,
    bloomLevel: "recall",
    clinicalCorrelation: "Understanding DNA and RNA structure is foundational for comprehending genetic disorders, gene therapy, and how mRNA vaccines work.",
    references: ["Tortora & Derrickson, Principles of Anatomy & Physiology"],
    tags: ["biology", "DNA", "RNA", "nucleic acids", "genetics"],
    estimatedTimeSeconds: 45
  },
  {
    id: "pn-154",
    course: "pre-nursing",
    topic: "Biology Foundations",
    subtopic: "Cell Cycle",
    stem: "During which phase of the cell cycle does DNA replication occur?",
    options: ["G1 phase", "S phase", "G2 phase", "M phase"],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "DNA replication occurs during the S (synthesis) phase of interphase. During this phase, each chromosome is duplicated so the cell has two copies of its genetic material before mitosis.",
    rationaleIncorrect: [
      "G1 phase involves cell growth and preparation for DNA synthesis",
      "G2 phase occurs after DNA replication and prepares the cell for mitosis",
      "M phase is mitosis, where the duplicated chromosomes are separated"
    ],
    difficulty: 2,
    bloomLevel: "recall",
    clinicalCorrelation: "Many chemotherapy drugs target the S phase to prevent DNA replication in rapidly dividing cancer cells.",
    references: ["Tortora & Derrickson, Principles of Anatomy & Physiology"],
    tags: ["biology", "cell cycle", "DNA replication", "S phase"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-155",
    course: "pre-nursing",
    topic: "Biology Foundations",
    subtopic: "Enzymes",
    stem: "Which statement about enzymes is correct?",
    options: [
      "Enzymes are consumed during chemical reactions",
      "Enzymes lower the activation energy needed for a reaction",
      "Enzymes work equally well at all temperatures",
      "Enzymes are composed of lipids"
    ],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "Enzymes are biological catalysts that lower the activation energy required for a chemical reaction to proceed. They are not consumed in the reaction and can be reused.",
    rationaleIncorrect: [
      "Enzymes are not consumed; they are recycled after each reaction",
      "Enzymes have optimal temperature and pH ranges; extreme conditions denature them",
      "Most enzymes are proteins, not lipids"
    ],
    difficulty: 2,
    bloomLevel: "understanding",
    clinicalCorrelation: "Elevated enzyme levels in blood tests (e.g., troponin, AST, ALT) indicate tissue damage and are key diagnostic markers nurses monitor.",
    references: ["Tortora & Derrickson, Principles of Anatomy & Physiology"],
    tags: ["biology", "enzymes", "activation energy", "catalysts"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-156",
    course: "pre-nursing",
    topic: "Biology Foundations",
    subtopic: "Cellular Respiration",
    stem: "What is the primary product of aerobic cellular respiration?",
    options: ["Lactic acid", "ATP", "Glucose", "Oxygen"],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "Aerobic cellular respiration produces approximately 36-38 ATP molecules per glucose molecule through glycolysis, the Krebs cycle, and the electron transport chain. ATP is the primary energy currency of cells.",
    rationaleIncorrect: [
      "Lactic acid is produced during anaerobic respiration, not aerobic",
      "Glucose is a reactant (input), not a product of cellular respiration",
      "Oxygen is a reactant consumed during aerobic respiration"
    ],
    difficulty: 1,
    bloomLevel: "recall",
    clinicalCorrelation: "When oxygen delivery is impaired (e.g., shock, respiratory failure), cells switch to anaerobic metabolism, producing less ATP and generating lactic acid, which causes metabolic acidosis.",
    references: ["Tortora & Derrickson, Principles of Anatomy & Physiology"],
    tags: ["biology", "cellular respiration", "ATP", "aerobic metabolism"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-157",
    course: "pre-nursing",
    topic: "Biology Foundations",
    subtopic: "pH and Buffers",
    stem: "A solution with a pH of 7.35 is classified as:",
    options: ["Strongly acidic", "Weakly acidic", "Neutral", "Weakly alkaline"],
    correctAnswer: 3,
    type: "mcq",
    rationaleCorrect: "A pH of 7.35 is slightly above neutral (7.0) and falls within the normal blood pH range of 7.35-7.45, making it weakly alkaline (basic). Normal physiological pH is slightly alkaline.",
    rationaleIncorrect: [
      "Strongly acidic pH values are below 3",
      "Weakly acidic would be a pH between 5 and 6.9",
      "Neutral pH is exactly 7.0"
    ],
    difficulty: 1,
    bloomLevel: "understanding",
    clinicalCorrelation: "Maintaining blood pH within the narrow range of 7.35-7.45 is critical. Deviations indicate acidosis or alkalosis, which nurses must recognize and report immediately.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["biology", "pH", "acid-base", "buffers", "blood pH"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-158",
    course: "pre-nursing",
    topic: "Biology Foundations",
    subtopic: "Osmosis",
    stem: "Water moves across a semipermeable membrane from an area of _____ solute concentration to an area of _____ solute concentration.",
    options: [
      "Higher; lower",
      "Lower; higher",
      "Equal; equal",
      "The direction depends on temperature only"
    ],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "During osmosis, water moves from an area of lower solute concentration (higher water concentration) to an area of higher solute concentration (lower water concentration) across a semipermeable membrane.",
    rationaleIncorrect: [
      "Water moves toward higher solute concentration, not away from it",
      "If concentrations are equal (isotonic), there is no net water movement",
      "Temperature affects the rate of osmosis but does not determine direction"
    ],
    difficulty: 2,
    bloomLevel: "understanding",
    clinicalCorrelation: "Osmosis governs fluid shifts between body compartments. Nurses must understand this when administering IV solutions to avoid cellular swelling or dehydration.",
    references: ["Tortora & Derrickson, Principles of Anatomy & Physiology"],
    tags: ["biology", "osmosis", "semipermeable membrane", "fluid balance"],
    estimatedTimeSeconds: 45
  },
  {
    id: "pn-159",
    course: "pre-nursing",
    topic: "Nutrition Basics",
    subtopic: "Macronutrients",
    stem: "Which macronutrient provides the MOST kilocalories per gram?",
    options: ["Carbohydrates", "Proteins", "Fats", "Vitamins"],
    correctAnswer: 2,
    type: "mcq",
    rationaleCorrect: "Fats provide 9 kcal per gram, compared to 4 kcal/g for carbohydrates and proteins. Vitamins are micronutrients and do not provide caloric energy.",
    rationaleIncorrect: [
      "Carbohydrates provide 4 kcal per gram",
      "Proteins provide 4 kcal per gram",
      "Vitamins are micronutrients that do not provide calories"
    ],
    difficulty: 1,
    bloomLevel: "recall",
    clinicalCorrelation: "Understanding caloric density of macronutrients is essential for dietary counselling, enteral feeding calculations, and managing patients with malnutrition.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["nutrition", "macronutrients", "fats", "calories", "dietary assessment"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-160",
    course: "pre-nursing",
    topic: "Nutrition Basics",
    subtopic: "Vitamins",
    stem: "Vitamin D deficiency is most closely associated with which condition?",
    options: ["Scurvy", "Rickets", "Night blindness", "Pellagra"],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "Vitamin D deficiency causes rickets in children (softening and weakening of bones) and osteomalacia in adults. Vitamin D is essential for calcium absorption and bone mineralization.",
    rationaleIncorrect: [
      "Scurvy is caused by vitamin C deficiency",
      "Night blindness is caused by vitamin A deficiency",
      "Pellagra is caused by niacin (vitamin B3) deficiency"
    ],
    difficulty: 1,
    bloomLevel: "recall",
    clinicalCorrelation: "Nurses should assess for vitamin D deficiency risk factors including limited sun exposure, dark skin, and malabsorption conditions.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["nutrition", "vitamins", "vitamin D", "rickets", "bone health"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-161",
    course: "pre-nursing",
    topic: "Nutrition Basics",
    subtopic: "Electrolytes",
    stem: "Which electrolyte is most important for maintaining normal cardiac rhythm?",
    options: ["Sodium", "Potassium", "Calcium", "Chloride"],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "Potassium is critical for cardiac conduction and maintaining normal heart rhythm. Both hypokalemia and hyperkalemia can cause life-threatening dysrhythmias.",
    rationaleIncorrect: [
      "Sodium is important for fluid balance but is less directly associated with cardiac rhythm than potassium",
      "Calcium affects muscle contraction but potassium has the most direct effect on cardiac rhythm",
      "Chloride is important for acid-base balance but less directly affects cardiac rhythm"
    ],
    difficulty: 2,
    bloomLevel: "understanding",
    clinicalCorrelation: "Nurses must monitor potassium levels carefully, especially in patients taking diuretics or with renal impairment, as abnormal levels can be rapidly fatal.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["nutrition", "electrolytes", "potassium", "cardiac rhythm", "dysrhythmia"],
    estimatedTimeSeconds: 45
  },
  {
    id: "pn-162",
    course: "pre-nursing",
    topic: "Psychology Foundations",
    subtopic: "Maslow's Hierarchy",
    stem: "According to Maslow's hierarchy of needs, which need must be met FIRST?",
    options: ["Safety and security", "Love and belonging", "Physiological needs", "Self-esteem"],
    correctAnswer: 2,
    type: "mcq",
    rationaleCorrect: "Maslow's hierarchy places physiological needs (oxygen, food, water, shelter, sleep) at the base. These must be met before higher-level needs like safety, belonging, esteem, and self-actualization.",
    rationaleIncorrect: [
      "Safety and security is the second level, addressed after physiological needs",
      "Love and belonging is the third level",
      "Self-esteem is the fourth level"
    ],
    difficulty: 1,
    bloomLevel: "recall",
    clinicalCorrelation: "Nurses use Maslow's hierarchy to prioritize patient care. Airway, breathing, and circulation (ABCs) align with meeting physiological needs first.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["psychology", "Maslow", "hierarchy of needs", "prioritization"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-163",
    course: "pre-nursing",
    topic: "Psychology Foundations",
    subtopic: "Growth and Development",
    stem: "According to Piaget, the sensorimotor stage of cognitive development occurs during which age range?",
    options: ["Birth to 2 years", "2 to 7 years", "7 to 11 years", "12 years and older"],
    correctAnswer: 0,
    type: "mcq",
    rationaleCorrect: "Piaget's sensorimotor stage spans from birth to approximately 2 years of age. During this stage, infants learn about the world through sensory experiences and motor actions, developing object permanence.",
    rationaleIncorrect: [
      "2 to 7 years is the preoperational stage",
      "7 to 11 years is the concrete operational stage",
      "12 years and older is the formal operational stage"
    ],
    difficulty: 2,
    bloomLevel: "recall",
    clinicalCorrelation: "Understanding developmental stages helps nurses provide age-appropriate care, education, and assessment for pediatric patients.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["psychology", "Piaget", "cognitive development", "sensorimotor", "pediatrics"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-164",
    course: "pre-nursing",
    topic: "Psychology Foundations",
    subtopic: "Defense Mechanisms",
    stem: "A patient who was recently diagnosed with cancer states, 'There must be a mistake with my lab results.' This is an example of which defense mechanism?",
    options: ["Projection", "Denial", "Rationalization", "Displacement"],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "Denial is a defense mechanism where a person refuses to accept reality or facts. The patient is rejecting the diagnosis by suggesting the results are wrong, which is a common initial response to distressing news.",
    rationaleIncorrect: [
      "Projection involves attributing one's own unacceptable feelings to others",
      "Rationalization involves creating logical explanations for unacceptable behavior",
      "Displacement involves redirecting emotions toward a less threatening target"
    ],
    difficulty: 2,
    bloomLevel: "application",
    clinicalCorrelation: "Nurses must recognize defense mechanisms to provide therapeutic communication and allow patients time to process difficult diagnoses.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["psychology", "defense mechanisms", "denial", "coping", "therapeutic communication"],
    estimatedTimeSeconds: 45
  },
  {
    id: "pn-165",
    course: "pre-nursing",
    topic: "Microbiology Basics",
    subtopic: "Microorganism Types",
    stem: "Which type of microorganism requires a living host cell to replicate?",
    options: ["Bacteria", "Fungi", "Viruses", "Protozoa"],
    correctAnswer: 2,
    type: "mcq",
    rationaleCorrect: "Viruses are obligate intracellular parasites that cannot replicate independently. They must invade a host cell and hijack its machinery to produce new viral particles.",
    rationaleIncorrect: [
      "Bacteria can replicate independently through binary fission",
      "Fungi reproduce independently through spores or budding",
      "Protozoa are single-celled organisms that can reproduce independently"
    ],
    difficulty: 1,
    bloomLevel: "recall",
    clinicalCorrelation: "Understanding that viruses require host cells explains why antibiotics are ineffective against viral infections and why antiviral medications target viral replication processes.",
    references: ["Tortora, Funke & Case, Microbiology: An Introduction"],
    tags: ["microbiology", "viruses", "replication", "obligate intracellular parasite"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-166",
    course: "pre-nursing",
    topic: "Microbiology Basics",
    subtopic: "Chain of Infection",
    stem: "Which component of the chain of infection represents the method by which a pathogen leaves the reservoir?",
    options: ["Susceptible host", "Portal of entry", "Portal of exit", "Mode of transmission"],
    correctAnswer: 2,
    type: "mcq",
    rationaleCorrect: "The portal of exit is the path by which a pathogen leaves its reservoir (the infected host). Examples include the respiratory tract (coughing), gastrointestinal tract (feces), and blood.",
    rationaleIncorrect: [
      "A susceptible host is the person who can become infected",
      "The portal of entry is how the pathogen enters a new host",
      "The mode of transmission is how the pathogen travels between hosts"
    ],
    difficulty: 1,
    bloomLevel: "recall",
    clinicalCorrelation: "Breaking the chain of infection at any link prevents disease transmission. Nurses apply this knowledge when implementing isolation precautions.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["microbiology", "chain of infection", "portal of exit", "infection control"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-167",
    course: "pre-nursing",
    topic: "Microbiology Basics",
    subtopic: "Gram Staining",
    stem: "Gram-positive bacteria appear which colour after Gram staining?",
    options: ["Pink/Red", "Purple/Blue", "Green", "Yellow"],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "Gram-positive bacteria retain the crystal violet stain due to their thick peptidoglycan cell wall, appearing purple/blue. Gram-negative bacteria have a thinner peptidoglycan layer and appear pink/red after counterstaining.",
    rationaleIncorrect: [
      "Pink/red is the colour of gram-negative bacteria",
      "Green is not a standard result of Gram staining",
      "Yellow is not a standard result of Gram staining"
    ],
    difficulty: 2,
    bloomLevel: "recall",
    clinicalCorrelation: "Gram stain results guide initial antibiotic selection before culture and sensitivity results are available, directly affecting nursing medication administration.",
    references: ["Tortora, Funke & Case, Microbiology: An Introduction"],
    tags: ["microbiology", "Gram stain", "gram-positive", "bacteria", "antibiotics"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-168",
    course: "pre-nursing",
    topic: "Microbiology Basics",
    subtopic: "Immunity",
    stem: "Which type of immunity is acquired by receiving a vaccination?",
    options: [
      "Natural active immunity",
      "Artificial active immunity",
      "Natural passive immunity",
      "Artificial passive immunity"
    ],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "Vaccination provides artificial active immunity. The vaccine introduces antigens that stimulate the immune system to produce antibodies and memory cells without causing the disease.",
    rationaleIncorrect: [
      "Natural active immunity results from actual infection with a pathogen",
      "Natural passive immunity occurs through transfer of antibodies from mother to fetus via placenta",
      "Artificial passive immunity involves receiving pre-formed antibodies (e.g., immunoglobulin injection)"
    ],
    difficulty: 2,
    bloomLevel: "understanding",
    clinicalCorrelation: "Nurses play a vital role in vaccine education and administration. Understanding immunity types helps explain why booster doses may be needed.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["microbiology", "immunity", "vaccination", "active immunity", "immunization"],
    estimatedTimeSeconds: 45
  },
  {
    id: "pn-169",
    course: "pre-nursing",
    topic: "Chemistry Basics",
    subtopic: "Chemical Bonds",
    stem: "Which type of chemical bond involves the sharing of electron pairs between atoms?",
    options: ["Ionic bond", "Covalent bond", "Hydrogen bond", "Van der Waals forces"],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "Covalent bonds form when atoms share one or more pairs of electrons. These bonds are strong and form the backbone of organic molecules essential to life.",
    rationaleIncorrect: [
      "Ionic bonds involve the transfer of electrons from one atom to another",
      "Hydrogen bonds are weak attractions between a hydrogen atom and an electronegative atom",
      "Van der Waals forces are weak intermolecular attractions"
    ],
    difficulty: 1,
    bloomLevel: "recall",
    clinicalCorrelation: "Covalent bonds hold together the molecules of medications, nutrients, and body compounds. Understanding bond types helps explain drug stability and metabolism.",
    references: ["Tortora & Derrickson, Principles of Anatomy & Physiology"],
    tags: ["chemistry", "covalent bond", "chemical bonds", "electron sharing"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-170",
    course: "pre-nursing",
    topic: "Chemistry Basics",
    subtopic: "Acids and Bases",
    stem: "Which of the following is true about a buffer system in the body?",
    options: [
      "It eliminates all acids from the blood",
      "It maintains pH within a narrow range by neutralizing excess acids or bases",
      "It only works in alkaline conditions",
      "It functions independently of the respiratory and renal systems"
    ],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "Buffer systems resist changes in pH by neutralizing excess hydrogen ions (acids) or hydroxide ions (bases). The bicarbonate buffer system is the most important extracellular buffer, maintaining blood pH between 7.35 and 7.45.",
    rationaleIncorrect: [
      "Buffers do not eliminate all acids; they balance acids and bases to maintain a stable pH",
      "Buffers work in both acidic and alkaline conditions",
      "Buffer systems work in conjunction with the respiratory system (CO2 elimination) and renal system (bicarbonate regulation)"
    ],
    difficulty: 2,
    bloomLevel: "understanding",
    clinicalCorrelation: "Nurses must understand buffer systems to interpret arterial blood gas (ABG) results and recognize acid-base imbalances in critically ill patients.",
    references: ["Tortora & Derrickson, Principles of Anatomy & Physiology"],
    tags: ["chemistry", "buffers", "acid-base", "pH regulation", "bicarbonate"],
    estimatedTimeSeconds: 45
  },
  {
    id: "pn-171",
    course: "pre-nursing",
    topic: "Medical Terminology",
    subtopic: "Combining Forms",
    stem: "The term 'hematuria' refers to:",
    options: ["Blood in the stool", "Blood in the urine", "Blood in the sputum", "Blood in the vomit"],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "'Hemat-' refers to blood and '-uria' refers to urine. Hematuria means the presence of blood in the urine, which may indicate urinary tract infection, kidney stones, or kidney disease.",
    rationaleIncorrect: [
      "Blood in the stool is called hematochezia (bright red) or melena (dark/tarry)",
      "Blood in the sputum is called hemoptysis",
      "Blood in the vomit is called hematemesis"
    ],
    difficulty: 2,
    bloomLevel: "understanding",
    clinicalCorrelation: "Nurses must accurately document and report hematuria, as it can indicate conditions ranging from UTI to malignancy.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["medical terminology", "hematuria", "blood", "urine", "urinary system"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-172",
    course: "pre-nursing",
    topic: "Medical Terminology",
    subtopic: "Prefixes",
    stem: "The prefix 'poly-' means:",
    options: ["Few", "Many", "One", "Half"],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "The prefix 'poly-' means many or excessive. It appears in terms such as polydipsia (excessive thirst), polyuria (excessive urination), and polycythemia (excessive red blood cells).",
    rationaleIncorrect: [
      "Few is indicated by the prefix 'oligo-'",
      "One is indicated by the prefix 'mono-' or 'uni-'",
      "Half is indicated by the prefix 'hemi-' or 'semi-'"
    ],
    difficulty: 1,
    bloomLevel: "recall",
    clinicalCorrelation: "The 'three Ps' of diabetes—polydipsia, polyuria, and polyphagia—use this prefix and are key symptoms nurses assess.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["medical terminology", "prefixes", "poly", "diabetes symptoms"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-173",
    course: "pre-nursing",
    topic: "Anatomy Overview",
    subtopic: "Organ Systems",
    stem: "Which organ system is primarily responsible for transporting oxygen, nutrients, and waste products throughout the body?",
    options: ["Respiratory system", "Cardiovascular system", "Lymphatic system", "Digestive system"],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "The cardiovascular system, composed of the heart, blood vessels, and blood, is responsible for transporting oxygen, nutrients, hormones, and waste products throughout the body.",
    rationaleIncorrect: [
      "The respiratory system exchanges gases (O2 and CO2) but does not transport them throughout the body",
      "The lymphatic system returns interstitial fluid to blood and is part of immune defense",
      "The digestive system breaks down food and absorbs nutrients but relies on the cardiovascular system for distribution"
    ],
    difficulty: 1,
    bloomLevel: "recall",
    clinicalCorrelation: "Cardiovascular assessment is a fundamental nursing skill. Impaired circulation affects every organ system.",
    references: ["Tortora & Derrickson, Principles of Anatomy & Physiology"],
    tags: ["anatomy", "cardiovascular system", "organ systems", "circulation"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-174",
    course: "pre-nursing",
    topic: "Anatomy Overview",
    subtopic: "Organ Systems",
    stem: "The integumentary system includes which of the following structures? (Select all that apply)",
    options: ["Skin", "Hair", "Nails", "Sweat glands", "Bones", "Tendons"],
    correctAnswers: [0, 1, 2, 3],
    type: "sata",
    rationaleCorrect: "The integumentary system includes the skin, hair, nails, and associated glands (sweat and sebaceous). It serves as the body's first line of defense against pathogens and environmental hazards.",
    rationaleIncorrect: [
      "Correct: skin is the primary organ of the integumentary system",
      "Correct: hair is an accessory structure of the integumentary system",
      "Correct: nails are accessory structures of the integumentary system",
      "Correct: sweat glands are part of the integumentary system",
      "Bones belong to the skeletal system",
      "Tendons belong to the musculoskeletal system"
    ],
    difficulty: 1,
    bloomLevel: "recall",
    clinicalCorrelation: "Nurses assess integumentary integrity during every patient encounter. Skin assessment can reveal dehydration, jaundice, cyanosis, and pressure injuries.",
    references: ["Tortora & Derrickson, Principles of Anatomy & Physiology"],
    tags: ["anatomy", "integumentary system", "skin", "assessment"],
    estimatedTimeSeconds: 45
  },
  {
    id: "pn-175",
    course: "pre-nursing",
    topic: "Anatomy Overview",
    subtopic: "Vital Organs",
    stem: "Which organ produces bile that aids in the digestion of fats?",
    options: ["Stomach", "Pancreas", "Liver", "Gallbladder"],
    correctAnswer: 2,
    type: "mcq",
    rationaleCorrect: "The liver produces bile, which is then stored and concentrated in the gallbladder. Bile emulsifies fats in the small intestine, breaking them into smaller droplets for enzymatic digestion.",
    rationaleIncorrect: [
      "The stomach produces hydrochloric acid and pepsin for protein digestion",
      "The pancreas produces digestive enzymes and bicarbonate but not bile",
      "The gallbladder stores and concentrates bile but does not produce it"
    ],
    difficulty: 1,
    bloomLevel: "recall",
    clinicalCorrelation: "Liver dysfunction affects bile production, leading to impaired fat digestion and fat-soluble vitamin absorption. Nurses monitor for signs of jaundice and steatorrhea.",
    references: ["Tortora & Derrickson, Principles of Anatomy & Physiology"],
    tags: ["anatomy", "liver", "bile", "digestion", "gastrointestinal"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-176",
    course: "pre-nursing",
    topic: "Reading Comprehension",
    subtopic: "Research Articles",
    stem: "When reading a nursing research article, the section that describes the study's purpose, design, and sample is called the:",
    options: ["Abstract", "Methods", "Results", "Discussion"],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "The Methods section describes the study design, sample selection, data collection procedures, and analysis methods. It provides the detail needed to evaluate the study's validity and reproducibility.",
    rationaleIncorrect: [
      "The Abstract is a brief summary of the entire study",
      "The Results section presents the data and findings",
      "The Discussion section interprets the results and compares them with existing literature"
    ],
    difficulty: 2,
    bloomLevel: "understanding",
    clinicalCorrelation: "Evidence-based practice requires nurses to critically appraise research. Understanding article structure helps nurses efficiently extract relevant information.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["reading comprehension", "research", "methods section", "evidence-based practice"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-177",
    course: "pre-nursing",
    topic: "Reading Comprehension",
    subtopic: "Critical Analysis",
    stem: "A nursing student reads: 'The intervention group showed a statistically significant decrease in falls (p < 0.05).' This means:",
    options: [
      "The decrease in falls was clinically important",
      "There is less than a 5% probability the results occurred by chance",
      "The falls decreased by exactly 5%",
      "95% of patients in the intervention group experienced falls"
    ],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "A p-value less than 0.05 means there is less than a 5% probability that the observed results occurred by chance. This is the conventional threshold for statistical significance in healthcare research.",
    rationaleIncorrect: [
      "Statistical significance does not automatically equal clinical significance",
      "The p-value is about probability, not the percentage of decrease",
      "The p-value does not indicate what percentage of patients experienced the outcome"
    ],
    difficulty: 3,
    bloomLevel: "analysis",
    clinicalCorrelation: "Nurses must interpret research findings to apply evidence-based practice. Understanding statistical significance helps evaluate whether study results should influence clinical decisions.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["reading comprehension", "statistics", "p-value", "significance", "research literacy"],
    estimatedTimeSeconds: 60
  },
  {
    id: "pn-178",
    course: "pre-nursing",
    topic: "Basic Math & Dimensional Analysis",
    subtopic: "Ratio and Proportion",
    stem: "If a medication is available as 100 mg/5 mL, how many mL are needed to administer 250 mg?",
    options: ["10 mL", "12.5 mL", "15 mL", "25 mL"],
    correctAnswer: 1,
    type: "fill-in-blank",
    rationaleCorrect: "Using ratio and proportion: 100 mg/5 mL = 250 mg/x mL. Cross-multiply: 100x = 1250. x = 12.5 mL.",
    rationaleIncorrect: [
      "10 mL would deliver only 200 mg",
      "15 mL would deliver 300 mg",
      "25 mL would deliver 500 mg"
    ],
    difficulty: 2,
    bloomLevel: "application",
    clinicalCorrelation: "Liquid medication calculations are essential for pediatric and geriatric nursing where patients cannot swallow tablets.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["math", "ratio proportion", "liquid medication", "dosage calculation"],
    estimatedTimeSeconds: 60
  },
  {
    id: "pn-179",
    course: "pre-nursing",
    topic: "Study Skills & Test-Taking Strategies",
    subtopic: "Learning Styles",
    stem: "A student who learns best by creating diagrams and concept maps is likely a:",
    options: ["Auditory learner", "Visual learner", "Kinesthetic learner", "Reading/writing learner"],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "Visual learners benefit from diagrams, charts, concept maps, and colour-coded notes. They process information best when it is presented graphically.",
    rationaleIncorrect: [
      "Auditory learners prefer listening to lectures, discussions, and recordings",
      "Kinesthetic learners prefer hands-on activities and simulations",
      "Reading/writing learners prefer text-based information such as notes and textbooks"
    ],
    difficulty: 1,
    bloomLevel: "understanding",
    clinicalCorrelation: "Nurses use knowledge of learning styles when providing patient education, adapting teaching methods to the patient's preferred learning style.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["study skills", "learning styles", "visual learner", "concept maps"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-180",
    course: "pre-nursing",
    topic: "Biology Foundations",
    subtopic: "Protein Structure",
    stem: "Which level of protein structure describes the sequence of amino acids in a polypeptide chain?",
    options: ["Primary structure", "Secondary structure", "Tertiary structure", "Quaternary structure"],
    correctAnswer: 0,
    type: "mcq",
    rationaleCorrect: "The primary structure of a protein is its unique sequence of amino acids. This linear sequence is determined by the gene encoding the protein and dictates how the protein folds into higher-order structures.",
    rationaleIncorrect: [
      "Secondary structure refers to local folding patterns like alpha helices and beta sheets",
      "Tertiary structure is the overall 3D shape of a single polypeptide chain",
      "Quaternary structure involves the arrangement of multiple polypeptide subunits"
    ],
    difficulty: 2,
    bloomLevel: "recall",
    clinicalCorrelation: "Mutations that alter amino acid sequence (primary structure) can cause diseases like sickle cell anemia, where a single amino acid change dramatically affects protein function.",
    references: ["Tortora & Derrickson, Principles of Anatomy & Physiology"],
    tags: ["biology", "protein structure", "amino acids", "primary structure"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-181",
    course: "pre-nursing",
    topic: "Psychology Foundations",
    subtopic: "Stress Response",
    stem: "The 'fight-or-flight' response is primarily mediated by which division of the nervous system?",
    options: ["Parasympathetic nervous system", "Sympathetic nervous system", "Somatic nervous system", "Central nervous system"],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "The sympathetic nervous system activates the fight-or-flight response, releasing epinephrine and norepinephrine. This causes increased heart rate, blood pressure, respiratory rate, and pupil dilation.",
    rationaleIncorrect: [
      "The parasympathetic nervous system promotes 'rest-and-digest' responses",
      "The somatic nervous system controls voluntary skeletal muscle movements",
      "The central nervous system processes information but the sympathetic division mediates the fight-or-flight response"
    ],
    difficulty: 2,
    bloomLevel: "understanding",
    clinicalCorrelation: "Understanding the sympathetic response helps nurses recognize anxiety, pain, and stress in patients and explains vital sign changes seen during these states.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["psychology", "stress response", "sympathetic nervous system", "fight or flight"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-182",
    course: "pre-nursing",
    topic: "Anatomy Overview",
    subtopic: "Skeletal System",
    stem: "How many bones are in the adult human body?",
    options: ["186", "206", "226", "256"],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "The adult human skeleton contains 206 bones. These are divided into the axial skeleton (80 bones) and appendicular skeleton (126 bones).",
    rationaleIncorrect: [
      "186 is incorrect; the adult skeleton has 206 bones",
      "226 is incorrect",
      "256 is incorrect"
    ],
    difficulty: 1,
    bloomLevel: "recall",
    clinicalCorrelation: "Knowledge of skeletal anatomy is essential for assessing fractures, performing orthopedic assessments, and understanding musculoskeletal disorders.",
    references: ["Tortora & Derrickson, Principles of Anatomy & Physiology"],
    tags: ["anatomy", "skeletal system", "bones", "206 bones"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-183",
    course: "pre-nursing",
    topic: "Microbiology Basics",
    subtopic: "Standard Precautions",
    stem: "Standard precautions should be applied to:",
    options: [
      "Only patients with known infections",
      "Only patients in isolation rooms",
      "All patients regardless of diagnosis",
      "Only patients who are immunocompromised"
    ],
    correctAnswer: 2,
    type: "mcq",
    rationaleCorrect: "Standard precautions are applied to ALL patients in ALL healthcare settings, regardless of known or suspected infection. They include hand hygiene, PPE use, and safe injection practices to prevent transmission of infectious agents.",
    rationaleIncorrect: [
      "Standard precautions are not limited to patients with known infections",
      "Standard precautions apply everywhere, not just isolation rooms",
      "Standard precautions protect all patients and healthcare workers, not just immunocompromised patients"
    ],
    difficulty: 1,
    bloomLevel: "understanding",
    clinicalCorrelation: "Standard precautions are the foundation of infection prevention. Nurses must consistently apply them to protect themselves and their patients.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["microbiology", "standard precautions", "infection control", "hand hygiene", "PPE"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-184",
    course: "pre-nursing",
    topic: "Chemistry Basics",
    subtopic: "Water Properties",
    stem: "Water is considered a universal solvent because it:",
    options: [
      "Can dissolve any substance",
      "Has a high heat capacity",
      "Can dissolve more substances than any other liquid",
      "Is the most abundant molecule in the body"
    ],
    correctAnswer: 2,
    type: "mcq",
    rationaleCorrect: "Water is called the universal solvent because it can dissolve more substances than any other liquid. Its polar nature allows it to interact with and dissolve ionic compounds and polar molecules.",
    rationaleIncorrect: [
      "Water cannot dissolve all substances; nonpolar substances like oils do not dissolve in water",
      "High heat capacity is a property of water but does not explain why it is called a universal solvent",
      "Abundance in the body is true but does not explain its solvent properties"
    ],
    difficulty: 2,
    bloomLevel: "understanding",
    clinicalCorrelation: "Water's solvent properties are essential for dissolving medications, nutrients, electrolytes, and waste products in body fluids.",
    references: ["Tortora & Derrickson, Principles of Anatomy & Physiology"],
    tags: ["chemistry", "water", "solvent", "polar molecule"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-185",
    course: "pre-nursing",
    topic: "Biology Foundations",
    subtopic: "Mitosis vs Meiosis",
    stem: "Which statement correctly distinguishes mitosis from meiosis?",
    options: [
      "Mitosis produces four genetically unique cells",
      "Meiosis produces two identical daughter cells",
      "Mitosis produces two identical daughter cells; meiosis produces four genetically unique cells",
      "Both processes produce the same number of cells"
    ],
    correctAnswer: 2,
    type: "mcq",
    rationaleCorrect: "Mitosis produces two genetically identical diploid daughter cells for growth and repair. Meiosis produces four genetically unique haploid cells (gametes) for sexual reproduction.",
    rationaleIncorrect: [
      "Mitosis produces two cells, not four",
      "Meiosis produces four cells, not two, and they are genetically unique",
      "Mitosis produces 2 cells and meiosis produces 4 cells"
    ],
    difficulty: 2,
    bloomLevel: "understanding",
    clinicalCorrelation: "Errors in meiosis can lead to chromosomal abnormalities such as Down syndrome (trisomy 21), which nurses must understand for prenatal education and newborn assessment.",
    references: ["Tortora & Derrickson, Principles of Anatomy & Physiology"],
    tags: ["biology", "mitosis", "meiosis", "cell division", "genetics"],
    estimatedTimeSeconds: 45
  },
  {
    id: "pn-186",
    course: "pre-nursing",
    topic: "Nutrition Basics",
    subtopic: "Minerals",
    stem: "Iron deficiency is most commonly associated with which type of anemia?",
    options: ["Pernicious anemia", "Sickle cell anemia", "Iron-deficiency anemia", "Aplastic anemia"],
    correctAnswer: 2,
    type: "mcq",
    rationaleCorrect: "Iron-deficiency anemia is the most common type of anemia worldwide. Iron is essential for hemoglobin synthesis; without adequate iron, the body cannot produce enough healthy red blood cells.",
    rationaleIncorrect: [
      "Pernicious anemia is caused by vitamin B12 deficiency",
      "Sickle cell anemia is a genetic disorder affecting hemoglobin structure",
      "Aplastic anemia results from bone marrow failure"
    ],
    difficulty: 1,
    bloomLevel: "recall",
    clinicalCorrelation: "Nurses assess for signs of iron-deficiency anemia including pallor, fatigue, tachycardia, and brittle nails, and educate patients on iron-rich foods.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["nutrition", "iron", "anemia", "iron-deficiency anemia", "hemoglobin"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-187",
    course: "pre-nursing",
    topic: "Basic Math & Dimensional Analysis",
    subtopic: "Pediatric Dosing",
    stem: "A child weighing 20 kg is prescribed a medication at 10 mg/kg/day divided into 2 doses. What is each individual dose?",
    options: ["50 mg", "100 mg", "150 mg", "200 mg"],
    correctAnswer: 1,
    type: "fill-in-blank",
    rationaleCorrect: "Total daily dose = 20 kg × 10 mg/kg = 200 mg/day. Divided into 2 doses: 200 ÷ 2 = 100 mg per dose.",
    rationaleIncorrect: [
      "50 mg would be the dose if divided into 4 doses per day",
      "150 mg is incorrect",
      "200 mg is the total daily dose, not the individual dose"
    ],
    difficulty: 2,
    bloomLevel: "application",
    clinicalCorrelation: "Pediatric dosing calculations require accuracy. Weight-based dosing is standard in pediatrics, and nurses must verify calculations before administration.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["math", "pediatric dosing", "weight-based dosing", "dosage calculation"],
    estimatedTimeSeconds: 60
  },
  {
    id: "pn-188",
    course: "pre-nursing",
    topic: "Psychology Foundations",
    subtopic: "Erikson's Stages",
    stem: "According to Erikson, the psychosocial crisis of adolescence (12-18 years) is:",
    options: [
      "Trust vs. Mistrust",
      "Industry vs. Inferiority",
      "Identity vs. Role Confusion",
      "Intimacy vs. Isolation"
    ],
    correctAnswer: 2,
    type: "mcq",
    rationaleCorrect: "Erikson identified Identity vs. Role Confusion as the crisis of adolescence. During this stage, teens explore their identity, values, beliefs, and goals. Failure to establish identity leads to role confusion.",
    rationaleIncorrect: [
      "Trust vs. Mistrust is the crisis of infancy (birth to 1 year)",
      "Industry vs. Inferiority is the crisis of school age (6-12 years)",
      "Intimacy vs. Isolation is the crisis of young adulthood (18-40 years)"
    ],
    difficulty: 2,
    bloomLevel: "recall",
    clinicalCorrelation: "Understanding developmental crises helps nurses provide age-appropriate care and recognize when adolescents may be struggling with identity formation.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["psychology", "Erikson", "identity", "adolescence", "psychosocial development"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-189",
    course: "pre-nursing",
    topic: "Medical Terminology",
    subtopic: "Suffixes",
    stem: "The suffix '-penia' refers to:",
    options: ["Excess", "Deficiency", "Pain", "Inflammation"],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "The suffix '-penia' means deficiency or decrease. Examples include leukopenia (decreased white blood cells), thrombocytopenia (decreased platelets), and neutropenia (decreased neutrophils).",
    rationaleIncorrect: [
      "Excess is indicated by suffixes like -osis or prefixes like hyper-",
      "Pain is indicated by the suffix -algia",
      "Inflammation is indicated by the suffix -itis"
    ],
    difficulty: 2,
    bloomLevel: "recall",
    clinicalCorrelation: "Recognizing '-penia' in lab results helps nurses quickly identify low cell counts that may require precautions such as bleeding precautions for thrombocytopenia.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["medical terminology", "suffixes", "penia", "deficiency", "blood counts"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-190",
    course: "pre-nursing",
    topic: "Biology Foundations",
    subtopic: "Homeostasis",
    stem: "Which of the following is an example of positive feedback in the body?",
    options: [
      "Thermoregulation when body temperature rises",
      "Blood glucose regulation by insulin",
      "Oxytocin release during labour contractions",
      "Blood pressure regulation by baroreceptors"
    ],
    correctAnswer: 2,
    type: "mcq",
    rationaleCorrect: "Oxytocin release during labour is a classic example of positive feedback. Uterine contractions stimulate oxytocin release, which intensifies contractions, which stimulates more oxytocin release, until delivery occurs.",
    rationaleIncorrect: [
      "Thermoregulation uses negative feedback to return body temperature to normal",
      "Insulin regulation of blood glucose is a negative feedback mechanism",
      "Baroreceptor regulation of blood pressure is a negative feedback mechanism"
    ],
    difficulty: 2,
    bloomLevel: "application",
    clinicalCorrelation: "Nurses administering synthetic oxytocin (Pitocin) must understand the positive feedback loop to monitor for uterine hyperstimulation.",
    references: ["Tortora & Derrickson, Principles of Anatomy & Physiology"],
    tags: ["biology", "positive feedback", "oxytocin", "labour", "homeostasis"],
    estimatedTimeSeconds: 45
  },
  {
    id: "pn-191",
    course: "pre-nursing",
    topic: "Anatomy Overview",
    subtopic: "Nervous System",
    stem: "The central nervous system consists of:",
    options: [
      "Brain and cranial nerves",
      "Brain and spinal cord",
      "Spinal cord and peripheral nerves",
      "Autonomic and somatic divisions"
    ],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "The central nervous system (CNS) consists of the brain and spinal cord. The peripheral nervous system (PNS) includes cranial nerves, spinal nerves, and ganglia outside the CNS.",
    rationaleIncorrect: [
      "Cranial nerves are part of the peripheral nervous system",
      "Peripheral nerves are part of the PNS",
      "Autonomic and somatic divisions are classifications of the PNS"
    ],
    difficulty: 1,
    bloomLevel: "recall",
    clinicalCorrelation: "CNS assessment (neurological checks) is a core nursing competency, including level of consciousness, pupil response, and motor/sensory function.",
    references: ["Tortora & Derrickson, Principles of Anatomy & Physiology"],
    tags: ["anatomy", "nervous system", "CNS", "brain", "spinal cord"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-192",
    course: "pre-nursing",
    topic: "Nutrition Basics",
    subtopic: "Dietary Guidelines",
    stem: "Canada's Food Guide recommends that approximately half of every plate should consist of:",
    options: ["Protein foods", "Whole grains", "Fruits and vegetables", "Dairy products"],
    correctAnswer: 2,
    type: "mcq",
    rationaleCorrect: "Canada's Food Guide (2019) recommends that fruits and vegetables make up half of each plate. The other half should be divided between whole grains and protein foods.",
    rationaleIncorrect: [
      "Protein foods should make up approximately one quarter of the plate",
      "Whole grains should make up approximately one quarter of the plate",
      "Dairy is no longer a separate food group in Canada's Food Guide (2019)"
    ],
    difficulty: 1,
    bloomLevel: "recall",
    clinicalCorrelation: "Nurses use dietary guidelines when providing nutrition counselling and meal planning for patients managing chronic conditions.",
    references: ["Health Canada, Canada's Food Guide (2019)"],
    tags: ["nutrition", "Canada's Food Guide", "dietary guidelines", "fruits vegetables"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-193",
    course: "pre-nursing",
    topic: "Microbiology Basics",
    subtopic: "Hand Hygiene",
    stem: "Alcohol-based hand rub is NOT effective against which type of pathogen?",
    options: ["Influenza virus", "MRSA", "Clostridium difficile (C. diff) spores", "Streptococcus"],
    correctAnswer: 2,
    type: "mcq",
    rationaleCorrect: "Alcohol-based hand rubs are not effective against Clostridium difficile spores. C. diff spores are resistant to alcohol. Soap and water with friction must be used when caring for patients with C. diff infection.",
    rationaleIncorrect: [
      "Alcohol-based hand rubs are effective against influenza virus",
      "Alcohol-based hand rubs are effective against MRSA",
      "Alcohol-based hand rubs are effective against Streptococcus"
    ],
    difficulty: 2,
    bloomLevel: "application",
    clinicalCorrelation: "Nurses must use soap and water hand washing when caring for C. diff patients to prevent transmission of spores.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["microbiology", "hand hygiene", "C. difficile", "spores", "infection control"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-194",
    course: "pre-nursing",
    topic: "Chemistry Basics",
    subtopic: "Electrolytes",
    stem: "Sodium (Na+) is the most abundant cation in which body fluid compartment?",
    options: ["Intracellular fluid", "Extracellular fluid", "Cerebrospinal fluid only", "Synovial fluid only"],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "Sodium is the primary cation in extracellular fluid (ECF), including plasma and interstitial fluid. Its concentration is regulated by the kidneys and is essential for fluid balance, nerve impulses, and muscle contraction.",
    rationaleIncorrect: [
      "Potassium is the most abundant cation in intracellular fluid",
      "CSF contains sodium but it is not exclusively found there",
      "Synovial fluid contains sodium but it is not exclusively found there"
    ],
    difficulty: 2,
    bloomLevel: "recall",
    clinicalCorrelation: "Sodium imbalances (hyponatremia and hypernatremia) affect fluid balance and neurological function. Nurses monitor sodium levels and fluid status closely.",
    references: ["Tortora & Derrickson, Principles of Anatomy & Physiology"],
    tags: ["chemistry", "sodium", "electrolytes", "extracellular fluid", "cation"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-195",
    course: "pre-nursing",
    topic: "Basic Math & Dimensional Analysis",
    subtopic: "Military Time",
    stem: "What is 2:30 PM in 24-hour (military) time?",
    options: ["0230", "1230", "1430", "2230"],
    correctAnswer: 2,
    type: "mcq",
    rationaleCorrect: "To convert PM times to 24-hour time, add 12 to the hour. 2:30 PM = 14:30 or 1430 in military time.",
    rationaleIncorrect: [
      "0230 is 2:30 AM",
      "1230 is 12:30 PM",
      "2230 is 10:30 PM"
    ],
    difficulty: 1,
    bloomLevel: "application",
    clinicalCorrelation: "Healthcare facilities use 24-hour time to prevent medication timing errors. Nurses must be proficient in converting between 12-hour and 24-hour time formats.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["math", "military time", "24-hour time", "medication timing"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-196",
    course: "pre-nursing",
    topic: "Anatomy Overview",
    subtopic: "Respiratory System",
    stem: "Gas exchange in the lungs occurs at the level of the:",
    options: ["Bronchi", "Bronchioles", "Alveoli", "Trachea"],
    correctAnswer: 2,
    type: "mcq",
    rationaleCorrect: "Gas exchange occurs at the alveoli, which are tiny air sacs at the ends of the bronchial tree. Oxygen diffuses from alveoli into pulmonary capillaries, while carbon dioxide diffuses from blood into alveoli.",
    rationaleIncorrect: [
      "Bronchi conduct air but do not participate in gas exchange",
      "Bronchioles are conducting airways; gas exchange occurs at the alveoli",
      "The trachea is a conducting airway and does not participate in gas exchange"
    ],
    difficulty: 1,
    bloomLevel: "recall",
    clinicalCorrelation: "Conditions that damage alveoli (such as emphysema or ARDS) impair gas exchange, leading to hypoxemia that nurses must monitor and manage.",
    references: ["Tortora & Derrickson, Principles of Anatomy & Physiology"],
    tags: ["anatomy", "respiratory system", "alveoli", "gas exchange"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-197",
    course: "pre-nursing",
    topic: "Psychology Foundations",
    subtopic: "Communication",
    stem: "Which communication technique is an example of therapeutic communication?",
    options: [
      "Giving advice: 'You should stop smoking'",
      "Open-ended question: 'Tell me how you are feeling today'",
      "Changing the subject when the patient becomes emotional",
      "Using medical jargon to explain a diagnosis"
    ],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "Open-ended questions encourage patients to express their thoughts and feelings in their own words. This is a core therapeutic communication technique that promotes trust and patient-centred care.",
    rationaleIncorrect: [
      "Giving advice is non-therapeutic; it imposes the nurse's values",
      "Changing the subject blocks communication and dismisses patient concerns",
      "Medical jargon creates barriers to understanding"
    ],
    difficulty: 1,
    bloomLevel: "application",
    clinicalCorrelation: "Therapeutic communication is fundamental to nursing practice. It builds rapport, encourages patient disclosure, and supports shared decision-making.",
    references: ["Potter & Perry, Canadian Fundamentals of Nursing"],
    tags: ["psychology", "therapeutic communication", "open-ended questions", "patient-centred care"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-198",
    course: "pre-nursing",
    topic: "Biology Foundations",
    subtopic: "Genetics",
    stem: "An individual who has two different alleles for a particular gene is described as:",
    options: ["Homozygous", "Heterozygous", "Hemizygous", "Polyploid"],
    correctAnswer: 1,
    type: "mcq",
    rationaleCorrect: "Heterozygous means having two different alleles for a gene (e.g., one dominant and one recessive). Homozygous means having two identical alleles.",
    rationaleIncorrect: [
      "Homozygous means having two identical alleles",
      "Hemizygous refers to having only one copy of a gene, as in X-linked genes in males",
      "Polyploid refers to having more than two sets of chromosomes"
    ],
    difficulty: 2,
    bloomLevel: "recall",
    clinicalCorrelation: "Understanding heterozygosity is important for genetic counselling and explaining carrier status for conditions like cystic fibrosis and sickle cell trait.",
    references: ["Tortora & Derrickson, Principles of Anatomy & Physiology"],
    tags: ["biology", "genetics", "heterozygous", "alleles", "inheritance"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-199",
    course: "pre-nursing",
    topic: "Anatomy Overview",
    subtopic: "Endocrine System",
    stem: "Which gland is referred to as the 'master gland' because it regulates other endocrine glands?",
    options: ["Thyroid gland", "Adrenal gland", "Pituitary gland", "Pineal gland"],
    correctAnswer: 2,
    type: "mcq",
    rationaleCorrect: "The pituitary gland (hypophysis) is called the master gland because it produces hormones that regulate the thyroid, adrenals, gonads, and other endocrine glands. It is controlled by the hypothalamus.",
    rationaleIncorrect: [
      "The thyroid gland is regulated by TSH from the pituitary",
      "The adrenal glands are regulated by ACTH from the pituitary",
      "The pineal gland produces melatonin and is not considered the master gland"
    ],
    difficulty: 1,
    bloomLevel: "recall",
    clinicalCorrelation: "Pituitary disorders can cause widespread hormonal imbalances. Nurses must understand the cascading effects of pituitary dysfunction on multiple organ systems.",
    references: ["Tortora & Derrickson, Principles of Anatomy & Physiology"],
    tags: ["anatomy", "endocrine system", "pituitary gland", "master gland", "hormones"],
    estimatedTimeSeconds: 30
  },
  {
    id: "pn-200",
    course: "pre-nursing",
    topic: "Biology Foundations",
    subtopic: "Tissues",
    stem: "Which tissue type is specialized for transmitting electrical impulses?",
    options: ["Epithelial tissue", "Connective tissue", "Nervous tissue", "Muscle tissue"],
    correctAnswer: 2,
    type: "mcq",
    rationaleCorrect: "Nervous tissue is specialized for generating and transmitting electrical impulses (action potentials). It consists of neurons that carry signals and neuroglia that support neuronal function.",
    rationaleIncorrect: [
      "Epithelial tissue provides protection and secretion but does not transmit electrical impulses",
      "Connective tissue provides support and structure",
      "Muscle tissue contracts in response to stimulation but does not transmit impulses like nervous tissue"
    ],
    difficulty: 1,
    bloomLevel: "recall",
    clinicalCorrelation: "Understanding nervous tissue function helps nurses comprehend neurological disorders, anesthesia mechanisms, and the effects of neurotoxins.",
    references: ["Tortora & Derrickson, Principles of Anatomy & Physiology"],
    tags: ["biology", "nervous tissue", "neurons", "action potential", "tissue types"],
    estimatedTimeSeconds: 30
  }
];
