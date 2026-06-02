import type { QuizQuestion } from "@/components/pre-nursing/interactive-learning";

/**
 * Capstone self-check (legacy `client/src/pages/pre-nursing.tsx` → `preNursingComprehensiveQuiz`).
 * Content preserved verbatim for pedagogy parity.
 */
export const PRE_NURSING_COMPREHENSIVE_REVIEW_QUIZ: QuizQuestion[] = [
  {
    id: "pnc1",
    question: "Which organelle contains its own DNA and is inherited exclusively from the mother?",
    options: ["Nucleus", "Golgi apparatus", "Mitochondria", "Ribosome"],
    correctIndex: 2,
    rationale:
      "Mitochondria have their own circular DNA (mtDNA) that is maternally inherited. Mitochondrial DNA mutations can cause diseases like MELAS syndrome and Leber hereditary optic neuropathy.",
  },
  {
    id: "pnc2",
    question: "Endocytosis is a process by which cells:",
    options: ["Release molecules outside the cell", "Take in substances by engulfing them in membrane vesicles", "Produce ATP", "Replicate DNA"],
    correctIndex: 1,
    rationale:
      "Endocytosis is active transport where the cell membrane invaginates to engulf extracellular material, forming intracellular vesicles. Types include phagocytosis (cell eating), pinocytosis (cell drinking), and receptor-mediated endocytosis.",
  },
  {
    id: "pnc3",
    question: "Homeostasis is best defined as:",
    options: [
      "A constant, unchanging internal state",
      "The body's ability to maintain a stable internal environment despite external changes",
      "The process of cell division",
      "The breakdown of nutrients for energy",
    ],
    correctIndex: 1,
    rationale:
      "Homeostasis is the dynamic process of maintaining relatively stable internal conditions (temperature, pH, blood glucose, etc.) through feedback mechanisms, despite constantly changing external environments.",
  },
  {
    id: "pnc4",
    question: "A negative feedback loop functions by:",
    options: ["Amplifying the original stimulus", "Reversing the direction of the stimulus to restore balance", "Maintaining the stimulus indefinitely", "Shutting down all body systems"],
    correctIndex: 1,
    rationale:
      "Negative feedback opposes the initial change to restore homeostasis. Example: when body temperature rises, sweating and vasodilation cool the body back toward the set point. Most physiological processes use negative feedback.",
  },
  {
    id: "pnc5",
    question: "An example of a positive feedback loop in the body is:",
    options: ["Blood glucose regulation by insulin", "Thermoregulation during fever", "Oxytocin release during labor contractions", "Blood pressure regulation by baroreceptors"],
    correctIndex: 2,
    rationale:
      "Oxytocin during labor is a classic positive feedback example: contractions stimulate oxytocin release, which intensifies contractions, releasing more oxytocin, until delivery occurs. Positive feedback amplifies the stimulus.",
  },
  {
    id: "pnc6",
    question: "The prefix 'hypo-' means:",
    options: ["Above normal", "Below normal", "Around", "Within"],
    correctIndex: 1,
    rationale:
      "The prefix 'hypo-' means below normal, under, or deficient. Examples: hypothermia (low body temperature), hypoglycemia (low blood glucose), hypothyroidism (underactive thyroid).",
  },
  {
    id: "pnc7",
    question: "The suffix '-osis' typically indicates:",
    options: ["Inflammation", "An abnormal condition or disease", "Surgical removal", "Pain"],
    correctIndex: 1,
    rationale:
      "The suffix '-osis' indicates an abnormal condition, disease state, or increase. Examples: cyanosis (blue discoloration), stenosis (narrowing), nephrosis (kidney disease), fibrosis (excessive fibrous tissue).",
  },
  {
    id: "pnc8",
    question: "The term 'tachypnea' means:",
    options: ["Slow heart rate", "Rapid breathing", "Difficulty breathing", "Absence of breathing"],
    correctIndex: 1,
    rationale:
      "Tachypnea breaks down as: tachy- (rapid/fast) + -pnea (breathing). Normal adult respiratory rate is 12-20 breaths/min. Tachypnea (>20/min) can indicate respiratory distress, fever, pain, or metabolic acidosis.",
    hint: "Break the word into its prefix and suffix.",
  },
  {
    id: "pnc9",
    question: "The root word 'cardi-' refers to which organ?",
    options: ["Brain", "Liver", "Heart", "Lung"],
    correctIndex: 2,
    rationale:
      "The root 'cardi-' or 'cardio-' refers to the heart. Examples: cardiology (study of the heart), cardiomegaly (enlarged heart), cardiomyopathy (disease of heart muscle), tachycardia (fast heart rate).",
  },
  {
    id: "pnc10",
    question: "The term 'bioavailability' in pharmacology refers to:",
    options: [
      "How quickly a drug is metabolized",
      "The fraction of administered drug that reaches systemic circulation unchanged",
      "The total amount of drug in a tablet",
      "How long a drug stays in the body",
    ],
    correctIndex: 1,
    rationale:
      "Bioavailability is the percentage of an administered drug dose that reaches systemic circulation in its active form. IV drugs have 100% bioavailability. Oral drugs have lower bioavailability due to first-pass metabolism in the liver.",
  },
  {
    id: "pnc11",
    question: "First-pass metabolism occurs primarily in the:",
    options: ["Kidneys", "Lungs", "Liver", "Stomach"],
    correctIndex: 2,
    rationale:
      "First-pass (presystemic) metabolism occurs when orally administered drugs are absorbed from the GI tract and pass through the portal vein to the liver before reaching systemic circulation. The liver metabolizes a significant portion, reducing bioavailability.",
    hint: "Oral drugs must pass through this organ before reaching the rest of the body.",
  },
  {
    id: "pnc12",
    question: "A patient with a pH of 7.30 and a PaCO2 of 55 mmHg is likely experiencing:",
    options: ["Respiratory alkalosis", "Metabolic acidosis", "Respiratory acidosis", "Metabolic alkalosis"],
    correctIndex: 2,
    rationale:
      "pH < 7.35 = acidosis. Elevated PaCO2 (>45 mmHg) indicates CO2 retention, meaning the respiratory system is the cause. This is respiratory acidosis, seen in conditions like COPD exacerbation, respiratory depression, or airway obstruction.",
    hint: "Look at which value (CO2 or HCO3) explains the pH change.",
  },
  {
    id: "pnc13",
    question: "Inflammation is characterized by which five cardinal signs?",
    options: [
      "Fever, chills, fatigue, malaise, weight loss",
      "Redness, heat, swelling, pain, loss of function",
      "Cough, sputum, dyspnea, tachycardia, cyanosis",
      "Nausea, vomiting, diarrhea, anorexia, abdominal pain",
    ],
    correctIndex: 1,
    rationale:
      "The five cardinal signs of inflammation are: rubor (redness), calor (heat), tumor (swelling), dolor (pain), and functio laesa (loss of function). These result from increased blood flow, vascular permeability, and chemical mediator release.",
  },
  {
    id: "pnc14",
    question: "Apoptosis differs from necrosis in that apoptosis is:",
    options: ["Uncontrolled cell death from injury", "Programmed, orderly cell death", "Caused exclusively by infection", "Always pathological"],
    correctIndex: 1,
    rationale:
      "Apoptosis is programmed cell death — an orderly, energy-dependent process where cells shrink, fragment, and are phagocytosed without triggering inflammation. Necrosis is uncontrolled cell death from injury, causing cell swelling, membrane rupture, and inflammatory response.",
  },
  {
    id: "pnc15",
    question: "Which type of immunity develops after receiving a vaccine?",
    options: ["Natural passive immunity", "Artificial active immunity", "Natural active immunity", "Artificial passive immunity"],
    correctIndex: 1,
    rationale:
      "Vaccines provide artificial active immunity by exposing the immune system to an antigen (weakened, killed, or component of a pathogen), stimulating the body to produce its own antibodies and memory cells for long-term protection.",
  },
  {
    id: "pnc16",
    question: "The suffix '-ectomy' means:",
    options: ["Inflammation of", "Surgical removal of", "Examination of", "Disease of"],
    correctIndex: 1,
    rationale:
      "The suffix '-ectomy' means surgical removal or excision. Examples: appendectomy (removal of appendix), cholecystectomy (removal of gallbladder), mastectomy (removal of breast), nephrectomy (removal of kidney).",
  },
  {
    id: "pnc17",
    question: "Osmosis is the movement of:",
    options: [
      "Solute from high to low concentration",
      "Water across a semipermeable membrane toward higher solute concentration",
      "Gases from high to low pressure",
      "Ions through protein channels",
    ],
    correctIndex: 1,
    rationale:
      "Osmosis is the passive movement of water (solvent) across a semipermeable membrane from an area of lower solute concentration to an area of higher solute concentration, equalizing concentrations on both sides.",
    hint: "Remember: 'water follows salt.'",
  },
  {
    id: "pnc18",
    question: "Which compensatory mechanism is activated FIRST when cardiac output drops?",
    options: ["Renal compensation (fluid retention)", "Sympathetic nervous system activation", "Hormonal response (RAAS)", "Cellular adaptation"],
    correctIndex: 1,
    rationale:
      "The sympathetic nervous system is the fastest compensatory response (seconds). Baroreceptors detect decreased blood pressure and trigger release of norepinephrine and epinephrine, causing tachycardia and vasoconstriction to maintain perfusion.",
  },
  {
    id: "pnc19",
    question: "A drug's 'volume of distribution' (Vd) describes:",
    options: [
      "How much drug is in each tablet",
      "The theoretical volume needed to contain the total drug at plasma concentration",
      "The rate of drug elimination",
      "The organ that metabolizes the drug",
    ],
    correctIndex: 1,
    rationale:
      "Volume of distribution (Vd) is a pharmacokinetic parameter that relates the total amount of drug in the body to its plasma concentration. A large Vd means the drug distributes extensively into tissues; a small Vd means it stays mostly in the plasma.",
  },
  {
    id: "pnc20",
    question: "Hypoxia at the cellular level primarily impairs which organelle's function?",
    options: ["Golgi apparatus", "Nucleus", "Mitochondria", "Ribosomes"],
    correctIndex: 2,
    rationale:
      "Cellular hypoxia directly impairs mitochondrial function because oxidative phosphorylation requires oxygen as the final electron acceptor. Without oxygen, ATP production drops dramatically, forcing cells to rely on anaerobic glycolysis, which produces lactic acid and far less ATP.",
    hint: "Which organelle requires oxygen to produce ATP?",
  },
];
