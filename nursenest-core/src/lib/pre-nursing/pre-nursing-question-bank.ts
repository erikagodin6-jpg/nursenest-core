/**
 * Pre-Nursing Static Question Bank.
 *
 * 80 beginner-friendly MCQ questions across 10 core pre-nursing modules.
 * Questions are self-contained (no DB dependency) so they load instantly
 * on free marketing pages with zero latency.
 *
 * Difficulty: 1 = easy, 2 = medium, 3 = hard (relative to pre-nursing level).
 * All questions are single-select MCQ with a rationale.
 *
 * To add questions: append to the relevant module array.
 * To add a module: add a new entry to PRE_NURSING_QUESTION_BANK.
 */

export type PreNursingQuestion = {
  id: string;
  question: string;
  options: string[];
  /** Zero-based index of the correct option. */
  correct: number;
  rationale: string;
  /** 1 = easy, 2 = medium, 3 = hard (relative to pre-nursing level). */
  difficulty: 1 | 2 | 3;
  moduleSlug: string;
};

const q = (
  id: string,
  question: string,
  options: string[],
  correct: number,
  rationale: string,
  difficulty: 1 | 2 | 3,
  moduleSlug: string,
): PreNursingQuestion => ({ id, question, options, correct, rationale, difficulty, moduleSlug });

// ── Anatomy & Physiology (8 questions) ────────────────────────────────────────

const ANATOMY_PHYSIOLOGY: PreNursingQuestion[] = [
  q("ap-01", "What is the primary function of the cardiovascular system?",
    ["To filter waste from the blood", "To transport oxygen, nutrients, and waste products", "To produce hormones that regulate metabolism", "To protect the body from pathogens"],
    1, "The cardiovascular system consists of the heart and blood vessels. Its primary role is to circulate blood throughout the body, delivering oxygen and nutrients to tissues and carrying away waste products like carbon dioxide.",
    1, "anatomy-physiology"),
  q("ap-02", "Which body cavity contains the heart and lungs?",
    ["Abdominal cavity", "Pelvic cavity", "Thoracic cavity", "Cranial cavity"],
    2, "The thoracic cavity (chest cavity) houses the heart and lungs. It is separated from the abdominal cavity by the diaphragm.",
    1, "anatomy-physiology"),
  q("ap-03", "The smallest functional unit of the nervous system is the:",
    ["Axon", "Dendrite", "Neuron", "Myelin sheath"],
    2, "A neuron (nerve cell) is the basic structural and functional unit of the nervous system. It consists of a cell body, dendrites (receive signals), and an axon (transmits signals).",
    1, "anatomy-physiology"),
  q("ap-04", "Which of the following describes a negative feedback loop?",
    ["A change leads to more change in the same direction", "A change triggers a response that reverses the original change", "Two hormones stimulate each other simultaneously", "Feedback that only occurs during illness"],
    1, "Negative feedback is the most common homeostatic mechanism. When a variable (e.g., body temperature) deviates from the set point, the body responds in a way that brings it back — the opposite of the original change.",
    2, "anatomy-physiology"),
  q("ap-05", "Osteocytes are cells found in which tissue?",
    ["Muscle tissue", "Nervous tissue", "Epithelial tissue", "Bone tissue"],
    3, "Osteocytes are mature bone cells embedded in the hard matrix of bone tissue. They maintain bone mineral density and communicate with other bone cells.",
    2, "anatomy-physiology"),
  q("ap-06", "The term 'ipsilateral' means:",
    ["On the opposite side of the body", "On the same side of the body", "Above the midline", "Toward the surface"],
    1, "Ipsilateral means on the same side. For example, the right hand and right foot are ipsilateral. 'Contralateral' means the opposite side.",
    2, "anatomy-physiology"),
  q("ap-07", "Which part of the brain regulates involuntary functions like heart rate and breathing?",
    ["Cerebral cortex", "Cerebellum", "Medulla oblongata", "Thalamus"],
    2, "The medulla oblongata, located in the brainstem, controls vital autonomic functions including heart rate, respiratory rate, blood pressure, and swallowing.",
    3, "anatomy-physiology"),
  q("ap-08", "The process by which cells divide to produce two identical daughter cells is called:",
    ["Meiosis", "Mitosis", "Apoptosis", "Phagocytosis"],
    1, "Mitosis is cell division for growth, repair, and replacement. It produces two genetically identical daughter cells (each with 46 chromosomes in humans). Meiosis produces gametes (sperm/egg) with 23 chromosomes.",
    3, "anatomy-physiology"),
];

// ── Medical Terminology (8 questions) ────────────────────────────────────────

const MEDICAL_TERMINOLOGY: PreNursingQuestion[] = [
  q("mt-01", "The prefix 'brady-' means:",
    ["Fast", "Slow", "Painful", "Without"],
    1, "'Brady-' means slow. Examples include bradycardia (slow heart rate) and bradypnea (slow breathing rate).",
    1, "medical-terminology"),
  q("mt-02", "The suffix '-itis' indicates:",
    ["Removal of", "Inflammation of", "Condition of", "Surgical repair"],
    1, "'-itis' means inflammation. Examples: appendicitis (inflammation of appendix), arthritis (inflammation of joints), dermatitis (inflammation of skin).",
    1, "medical-terminology"),
  q("mt-03", "The medical term 'tachycardia' means:",
    ["Slow heart rate", "Irregular heart rhythm", "Fast heart rate", "Absent heartbeat"],
    2, "'Tachy-' means fast, and '-cardia' refers to the heart. Tachycardia is a heart rate greater than 100 beats per minute in adults.",
    1, "medical-terminology"),
  q("mt-04", "What does the prefix 'hypo-' mean?",
    ["Above normal", "Below normal", "Without", "Excessive"],
    1, "'Hypo-' means below or deficient. Examples: hypoglycemia (low blood sugar), hypotension (low blood pressure), hypothermia (low body temperature). 'Hyper-' means above or excessive.",
    1, "medical-terminology"),
  q("mt-05", "The term 'dyspnea' refers to:",
    ["Absence of breathing", "Difficulty breathing", "Rapid breathing", "Painful swallowing"],
    1, "'Dys-' means difficult/painful and '-pnea' means breathing. Dyspnea is the subjective feeling of breathlessness or difficulty breathing.",
    2, "medical-terminology"),
  q("mt-06", "Which suffix means 'surgical removal'?",
    ["-plasty", "-scopy", "-ectomy", "-otomy"],
    2, "'-ectomy' means surgical removal. Examples: appendectomy (removal of appendix), tonsillectomy (removal of tonsils). '-otomy' means incision; '-plasty' means surgical repair; '-scopy' means visual examination.",
    2, "medical-terminology"),
  q("mt-07", "The combining form 'hepat/o' refers to the:",
    ["Heart", "Liver", "Kidney", "Lung"],
    1, "'Hepat/o' refers to the liver. Hepatitis = liver inflammation, hepatomegaly = enlarged liver. 'Cardio' = heart, 'nephro' = kidney, 'pneumo' = lung.",
    2, "medical-terminology"),
  q("mt-08", "What does the abbreviation 'NPO' stand for in clinical settings?",
    ["Normal pulse oximetry", "Nothing by mouth", "Not previously observed", "Non-pharmacological option"],
    1, "NPO stands for 'nil per os' (Latin) meaning 'nothing by mouth.' Patients are placed NPO before surgery or procedures requiring anesthesia to prevent aspiration.",
    3, "medical-terminology"),
];

// ── Pharmacology (8 questions) ────────────────────────────────────────────────

const PHARMACOLOGY: PreNursingQuestion[] = [
  q("ph-01", "Which route of drug administration has the fastest onset of action?",
    ["Oral (PO)", "Subcutaneous (SQ)", "Intravenous (IV)", "Intramuscular (IM)"],
    2, "Intravenous (IV) administration delivers the drug directly into the bloodstream, bypassing absorption barriers. This results in the fastest onset of action — nearly immediate.",
    1, "pharmacology"),
  q("ph-02", "The term 'therapeutic range' refers to:",
    ["The maximum dose before toxicity occurs", "The concentration range in which a drug is effective without causing toxicity", "The time required for a drug to be eliminated", "The dose that causes side effects in 50% of patients"],
    1, "The therapeutic range (or therapeutic window) is the drug concentration range that produces the desired effect without causing significant adverse or toxic effects. Staying within this range is a key goal of drug therapy.",
    1, "pharmacology"),
  q("ph-03", "A patient is prescribed a drug with a narrow therapeutic index. This means:",
    ["The drug is safe to use at any dose", "Small dosing errors can lead to toxicity or treatment failure", "The drug has no side effects", "The drug can only be given intravenously"],
    1, "Narrow therapeutic index drugs (e.g., warfarin, digoxin, lithium) require careful monitoring because the difference between effective and toxic doses is small. Even small changes in dose or patient physiology can cause serious problems.",
    2, "pharmacology"),
  q("ph-04", "The 'five rights' of medication administration include all of the following EXCEPT:",
    ["Right patient", "Right dose", "Right diagnosis", "Right route"],
    2, "The five rights are: right patient, right medication, right dose, right route, and right time. 'Right diagnosis' is not one of them — nurses administer medications based on orders, not their own diagnosis.",
    2, "pharmacology"),
  q("ph-05", "Drug tolerance is best defined as:",
    ["An allergic reaction to a medication", "A decreased response to a drug after repeated exposure, requiring higher doses for the same effect", "The body's inability to metabolize a drug", "A life-threatening immune response"],
    1, "Tolerance develops when repeated exposure to a drug leads to a diminished effect at the same dose. The body adapts to the drug's presence, often through receptor downregulation or enzyme induction.",
    2, "pharmacology"),
  q("ph-06", "Which organ is primarily responsible for drug metabolism?",
    ["Kidney", "Liver", "Lung", "Small intestine"],
    1, "The liver is the primary site of drug metabolism (biotransformation). It uses enzymes (mainly the CYP450 system) to convert drugs into more water-soluble forms that can be excreted. Liver disease can significantly alter drug metabolism.",
    1, "pharmacology"),
  q("ph-07", "An adverse drug effect is best described as:",
    ["The intended therapeutic effect of a medication", "A harmful, unintended effect occurring at normal therapeutic doses", "A drug overdose", "An allergy to a medication"],
    1, "Adverse drug effects (also called adverse drug reactions or ADRs) are unintended and harmful responses that occur at doses normally used for therapy. They differ from side effects (which may be predictable but unwanted) and from overdose.",
    3, "pharmacology"),
  q("ph-08", "The term 'half-life' of a drug refers to:",
    ["The time it takes for a drug to start working", "The time required for the plasma concentration of a drug to decrease by 50%", "The duration of peak drug effectiveness", "The time between doses"],
    1, "Half-life (t½) is the time required for the plasma drug concentration to decrease by half. It determines dosing frequency — drugs with short half-lives need more frequent dosing; those with long half-lives may be given once daily or less.",
    3, "pharmacology"),
];

// ── Fluids & Electrolytes (8 questions) ───────────────────────────────────────

const FLUIDS_ELECTROLYTES: PreNursingQuestion[] = [
  q("fe-01", "Which electrolyte is the most abundant in the intracellular fluid (ICF)?",
    ["Sodium (Na+)", "Potassium (K+)", "Calcium (Ca2+)", "Chloride (Cl-)"],
    1, "Potassium (K+) is the primary intracellular cation. Sodium (Na+) is the primary extracellular cation. This difference is maintained by the sodium-potassium ATPase pump and is critical for cell membrane potential.",
    1, "fluids-electrolytes"),
  q("fe-02", "Normal serum sodium (Na+) level in adults is approximately:",
    ["115–125 mEq/L", "135–145 mEq/L", "150–160 mEq/L", "3.5–5.0 mEq/L"],
    1, "Normal serum sodium is 135–145 mEq/L. Values below 135 = hyponatremia; above 145 = hypernatremia. Sodium is the primary regulator of extracellular fluid osmolality.",
    1, "fluids-electrolytes"),
  q("fe-03", "Edema is most commonly caused by:",
    ["Increased plasma osmotic pressure", "Increased capillary hydrostatic pressure or decreased plasma oncotic pressure", "Decreased blood volume", "Hypokalemia"],
    1, "Edema (fluid accumulation in interstitial spaces) results from imbalances in Starling forces: increased capillary hydrostatic pressure (pushes fluid out) or decreased plasma oncotic pressure (less force pulling fluid back in).",
    2, "fluids-electrolytes"),
  q("fe-04", "A patient with hypokalemia (low potassium) is at increased risk for:",
    ["Bone fractures", "Cardiac arrhythmias", "Blood clotting disorders", "Seizures"],
    1, "Potassium is essential for maintaining the resting membrane potential of cardiac and muscle cells. Hypokalemia makes cells more excitable and susceptible to dangerous cardiac arrhythmias, including ventricular fibrillation.",
    2, "fluids-electrolytes"),
  q("fe-05", "Which condition is characterized by excess fluid in the intravascular space?",
    ["Dehydration", "Hypovolemia", "Hypervolemia (fluid volume excess)", "Third-spacing"],
    2, "Hypervolemia (fluid volume excess) is a state of excess fluid in the vascular compartment. It can cause hypertension, edema, dyspnea, and heart failure. Causes include excessive IV fluids, heart failure, or renal failure.",
    2, "fluids-electrolytes"),
  q("fe-06", "Which electrolyte is the primary regulator of neuromuscular function and is often supplemented in IV fluids?",
    ["Potassium (K+)", "Magnesium (Mg2+)", "Calcium (Ca2+)", "Phosphate (PO4)"],
    2, "Calcium (Ca2+) is critical for neuromuscular function, cardiac contractility, and bone health. Hypocalcemia causes increased neuromuscular excitability (tetany, Trousseau's sign, Chvostek's sign). It is commonly supplemented as calcium gluconate or calcium chloride.",
    3, "fluids-electrolytes"),
  q("fe-07", "Isotonic IV fluids (such as 0.9% Normal Saline) are used because:",
    ["They move fluid into cells to hydrate them", "They have the same osmolality as blood and do not shift fluid between compartments", "They are hypertonic to the plasma", "They rapidly replace electrolyte deficits"],
    1, "Isotonic fluids have approximately the same osmolality as plasma (~290 mOsm/kg). They expand the extracellular fluid volume without causing significant shifts of fluid between the intracellular and extracellular compartments.",
    3, "fluids-electrolytes"),
  q("fe-08", "Which finding is most consistent with metabolic acidosis?",
    ["pH > 7.45 with elevated HCO3-", "pH < 7.35 with decreased HCO3-", "pH < 7.35 with elevated CO2", "pH > 7.45 with decreased CO2"],
    1, "Metabolic acidosis is defined by pH < 7.35 and HCO3- < 22 mEq/L. The low bicarbonate reflects a metabolic cause (e.g., diabetic ketoacidosis, lactic acidosis, diarrhea). Respiratory acidosis has low pH with elevated CO2.",
    3, "fluids-electrolytes"),
];

// ── Infection Control (8 questions) ──────────────────────────────────────────

const INFECTION_CONTROL: PreNursingQuestion[] = [
  q("ic-01", "The most effective way to prevent the spread of infection is:",
    ["Wearing gloves at all times", "Hand hygiene with soap and water or alcohol-based hand rub", "Wearing a surgical mask", "Administering antibiotics prophylactically"],
    1, "Hand hygiene is the single most effective infection prevention measure. The World Health Organization identifies 5 moments for hand hygiene: before patient contact, before a clean/aseptic procedure, after body fluid exposure, after patient contact, and after contact with patient surroundings.",
    1, "infection-control"),
  q("ic-02", "Contact precautions are used for patients with which type of pathogen?",
    ["Airborne infections like tuberculosis", "Infections spread by direct or indirect contact, such as MRSA", "Droplet infections like influenza", "All healthcare-associated infections"],
    1, "Contact precautions are used for pathogens transmitted by direct (touching the patient) or indirect (touching contaminated surfaces/equipment) contact. Examples include MRSA, VRE, C. difficile, and wound infections.",
    1, "infection-control"),
  q("ic-03", "Which type of precaution requires the patient to be in a negative pressure room?",
    ["Contact precautions", "Droplet precautions", "Airborne precautions", "Standard precautions"],
    2, "Airborne precautions are used for infections spread by tiny droplet nuclei that remain suspended in air (e.g., tuberculosis, measles, varicella/chickenpox). A negative pressure room prevents contaminated air from escaping into hallways.",
    2, "infection-control"),
  q("ic-04", "Standard precautions apply to:",
    ["Only patients known to have infections", "All patients, regardless of infection status", "Only immunocompromised patients", "Only patients in the ICU"],
    1, "Standard precautions are the minimum level of infection prevention applied to ALL patients in all healthcare settings, regardless of suspected or confirmed infection status. They include hand hygiene, PPE use, safe injection practices, and respiratory hygiene.",
    1, "infection-control"),
  q("ic-05", "The chain of infection includes all of the following EXCEPT:",
    ["Infectious agent", "Mode of transmission", "Susceptible host", "Antibiotic resistance"],
    3, "The chain of infection has 6 links: infectious agent, reservoir, portal of exit, mode of transmission, portal of entry, and susceptible host. Antibiotic resistance is a property of some pathogens (part of the 'infectious agent' link), not a separate link in the chain.",
    2, "infection-control"),
  q("ic-06", "Droplet precautions are required for a patient diagnosed with influenza. In addition to standard precautions, the nurse should:",
    ["Place patient in a negative pressure room", "Wear a surgical/procedural mask when within 3 feet of the patient", "Wear an N95 respirator at all times", "Isolate the patient in a positive pressure room"],
    1, "Droplet precautions for influenza require a surgical mask when within 3 feet (or 1 meter) of the patient, plus a private room. Unlike airborne precautions, a negative pressure room and N95 respirator are not required for standard influenza.",
    3, "infection-control"),
  q("ic-07", "Which of the following breaks the chain of infection at the 'susceptible host' link?",
    ["Hand hygiene", "Sterilizing equipment", "Vaccination", "Wearing gloves"],
    2, "Vaccination reduces host susceptibility by stimulating an immune response before exposure. Breaking the chain at the susceptible host link makes the individual resistant. Hand hygiene and PPE break the chain at other links (transmission, portal of entry).",
    3, "infection-control"),
  q("ic-08", "Personal protective equipment (PPE) should be removed in which order?",
    ["Mask, gloves, gown, eye protection", "Gloves, gown, eye protection, mask/respirator", "Gown, gloves, mask, eye protection", "Eye protection, gown, gloves, mask"],
    1, "The CDC recommends removing PPE in this order: (1) gloves (most contaminated), (2) gown, (3) eye protection, (4) mask/respirator (saved for last as it protects your respiratory tract). Hand hygiene is performed after removing each item.",
    3, "infection-control"),
];

// ── Pathophysiology (8 questions) ─────────────────────────────────────────────

const PATHOPHYSIOLOGY: PreNursingQuestion[] = [
  q("pp-01", "Homeostasis is best described as:",
    ["The complete absence of disease", "The body's ability to maintain stable internal conditions despite external changes", "A state of rest and inactivity", "The balance between anabolism and catabolism only"],
    1, "Homeostasis is the dynamic process by which the body maintains relatively stable internal conditions (e.g., temperature, pH, blood glucose) through continuous adjustments involving feedback mechanisms.",
    1, "pathophysiology"),
  q("pp-02", "Inflammation is characterized by all of the following EXCEPT:",
    ["Redness (rubor)", "Swelling (tumor)", "Decreased white blood cell count", "Pain (dolor)"],
    2, "The cardinal signs of inflammation are: redness (rubor), swelling (tumor), heat (calor), pain (dolor), and loss of function (functio laesa). Inflammation actually increases white blood cell count as they are recruited to the site.",
    1, "pathophysiology"),
  q("pp-03", "Hypoxia is defined as:",
    ["Excess oxygen in the bloodstream", "Decreased oxygen delivery to tissues", "Increased carbon dioxide in the blood", "Decreased breathing rate"],
    1, "Hypoxia refers to inadequate oxygen supply to tissues and cells. It can result from decreased blood oxygen (hypoxemia), reduced blood flow (ischemia), or impaired cellular oxygen utilization.",
    1, "pathophysiology"),
  q("pp-04", "An embolism is best described as:",
    ["A blood clot that forms in a vein and remains there", "A substance (clot, fat, air) that travels through the bloodstream and blocks a vessel", "Inflammation of a blood vessel", "Narrowing of an artery due to plaque"],
    1, "An embolism occurs when a substance (most commonly a thrombus/blood clot, but also fat, air, or amniotic fluid) travels through the bloodstream until it lodges in a vessel too small for it to pass, obstructing blood flow.",
    2, "pathophysiology"),
  q("pp-05", "Ischemia refers to:",
    ["Excessive blood flow to a tissue", "Insufficient blood flow to a tissue, leading to oxygen deprivation", "An immune response to tissue injury", "The death of cells due to infection"],
    1, "Ischemia is inadequate blood supply to a tissue or organ, resulting in oxygen and nutrient deprivation. If prolonged, ischemia leads to infarction (tissue death). Common examples: myocardial ischemia, cerebral ischemia.",
    2, "pathophysiology"),
  q("pp-06", "Necrosis is defined as:",
    ["Programmed cell death (cell suicide)", "Uncontrolled cell death due to injury or disease", "Abnormal cell growth", "Cell division for repair"],
    1, "Necrosis is uncontrolled cell death caused by injury, ischemia, infection, or toxins. It triggers inflammation. This differs from apoptosis, which is programmed (intentional) cell death that does not cause inflammation.",
    2, "pathophysiology"),
  q("pp-07", "Which phase of disease occurs before symptoms appear?",
    ["Acute phase", "Prodromal phase", "Incubation period", "Resolution phase"],
    2, "The incubation period is the time between exposure to a pathogen and the first symptoms (when the pathogen is multiplying but not yet causing detectable symptoms). The prodromal phase involves early, nonspecific symptoms. The acute phase has peak symptoms.",
    3, "pathophysiology"),
  q("pp-08", "Compensated shock is characterized by:",
    ["Low blood pressure and altered mental status", "Normal or near-normal vital signs due to the body's compensatory mechanisms", "Complete organ failure", "High fever and tachycardia only"],
    1, "In compensated shock, the body's compensatory mechanisms (vasoconstriction, tachycardia, increased contractility) maintain near-normal blood pressure and perfusion despite the underlying deficit. If untreated, compensation fails and decompensated shock develops.",
    3, "pathophysiology"),
];

// ── Chemistry (8 questions) ───────────────────────────────────────────────────

const CHEMISTRY: PreNursingQuestion[] = [
  q("ch-01", "An atom that has gained or lost electrons is called a:",
    ["Molecule", "Ion", "Isotope", "Compound"],
    1, "An ion is an atom or group of atoms that has a net electric charge because it has lost or gained electrons. Cations are positively charged (lost electrons); anions are negatively charged (gained electrons).",
    1, "chemistry"),
  q("ch-02", "What is the pH of a neutral solution?",
    ["0", "7", "14", "7.4"],
    1, "The pH scale runs from 0 (most acidic) to 14 (most basic/alkaline). A pH of 7 is neutral (pure water). Human blood has a slightly alkaline pH of 7.35–7.45.",
    1, "chemistry"),
  q("ch-03", "A solution with a pH of 3 is:",
    ["Neutral", "Slightly alkaline", "Acidic", "Strongly alkaline"],
    2, "pH below 7 is acidic. A pH of 3 indicates a strong acid. Each unit change in pH represents a 10-fold change in hydrogen ion concentration (logarithmic scale).",
    1, "chemistry"),
  q("ch-04", "Which type of bond holds water molecules together and gives water its unique properties?",
    ["Ionic bonds", "Covalent bonds", "Hydrogen bonds", "Peptide bonds"],
    2, "Hydrogen bonds between water molecules (due to water's polarity) give water its high surface tension, high specific heat, and solvent properties. These bonds are individually weak but collectively strong.",
    2, "chemistry"),
  q("ch-05", "A buffer system maintains:",
    ["Constant blood glucose", "Stable pH by resisting changes in hydrogen ion concentration", "Body temperature", "Blood volume"],
    1, "Buffer systems resist changes in pH by accepting or donating hydrogen ions (H+). The bicarbonate buffer system is the major buffer in blood. Without buffers, small additions of acid or base would cause large, dangerous pH swings.",
    2, "chemistry"),
  q("ch-06", "The process of breaking large molecules into smaller ones with the addition of water is called:",
    ["Dehydration synthesis", "Hydrolysis", "Oxidation", "Phosphorylation"],
    1, "Hydrolysis (hydro = water, lysis = to break) splits large molecules (proteins, carbohydrates, lipids) into smaller units using water. Dehydration synthesis is the reverse — joining monomers by releasing water.",
    2, "chemistry"),
  q("ch-07", "Which macromolecule carries genetic information?",
    ["Proteins", "Lipids", "Carbohydrates", "Nucleic acids (DNA/RNA)"],
    3, "Nucleic acids (DNA and RNA) store and transmit genetic information. DNA contains the genetic blueprint; RNA carries instructions for protein synthesis. Proteins are built according to this information.",
    1, "chemistry"),
  q("ch-08", "Enzyme activity can be affected by all of the following EXCEPT:",
    ["Temperature", "pH", "Substrate concentration", "The color of the solution"],
    3, "Enzymes are affected by temperature (denaturation above optimal), pH (each enzyme has an optimal pH), substrate concentration (enzyme kinetics), inhibitors, and cofactors. The color of a solution has no direct effect on enzyme activity.",
    3, "chemistry"),
];

// ── Nutrition Foundations (8 questions) ───────────────────────────────────────

const NUTRITION_FOUNDATIONS: PreNursingQuestion[] = [
  q("nf-01", "The primary source of energy for the body is:",
    ["Fats", "Proteins", "Carbohydrates", "Vitamins"],
    2, "Carbohydrates are the body's preferred energy source. They are broken down into glucose, which is used by cells for ATP production. The brain relies almost exclusively on glucose for energy.",
    1, "nutrition-foundations"),
  q("nf-02", "Which vitamin is produced by the skin when exposed to sunlight?",
    ["Vitamin A", "Vitamin C", "Vitamin D", "Vitamin K"],
    2, "Vitamin D (calciferol) is synthesized in the skin when UVB radiation converts 7-dehydrocholesterol to previtamin D3. It is essential for calcium absorption, bone health, and immune function.",
    1, "nutrition-foundations"),
  q("nf-03", "A patient who is malnourished and has low serum albumin is at risk for:",
    ["Hypertension", "Edema (low oncotic pressure)", "Hyperglycemia", "Bone fractures"],
    1, "Albumin is the main plasma protein maintaining oncotic (colloid osmotic) pressure, which pulls fluid into capillaries. Low albumin reduces oncotic pressure, allowing fluid to leak into interstitial spaces and causing edema.",
    2, "nutrition-foundations"),
  q("nf-04", "Iron deficiency anemia is most effectively treated with:",
    ["Vitamin B12 supplements", "Increased dietary fiber intake", "Iron supplements and iron-rich foods (e.g., red meat, leafy greens)", "Calcium supplements"],
    2, "Iron deficiency anemia results from inadequate iron for hemoglobin synthesis. Treatment includes oral iron supplements and foods high in heme iron (red meat) or non-heme iron (legumes, spinach) plus vitamin C to enhance non-heme absorption.",
    2, "nutrition-foundations"),
  q("nf-05", "Body mass index (BMI) is calculated using:",
    ["Age and waist circumference", "Weight in kilograms divided by height in meters squared", "Caloric intake and physical activity level", "Cholesterol levels and blood pressure"],
    1, "BMI = weight (kg) ÷ height (m²). It is a screening tool for weight categories: underweight (<18.5), normal (18.5–24.9), overweight (25–29.9), obese (≥30). BMI has limitations and does not directly measure body fat.",
    2, "nutrition-foundations"),
  q("nf-06", "Which electrolyte is most closely associated with bone and tooth formation?",
    ["Sodium", "Potassium", "Calcium", "Iron"],
    2, "Calcium is the most abundant mineral in the body. 99% is stored in bones and teeth as hydroxyapatite. The remaining 1% in blood is critical for muscle contraction, nerve transmission, and blood clotting.",
    1, "nutrition-foundations"),
  q("nf-07", "Essential amino acids are those that:",
    ["The body can synthesize on its own", "Must be obtained through diet because the body cannot produce them", "Are only found in animal products", "Are harmful in large quantities"],
    1, "There are 9 essential amino acids (e.g., leucine, lysine, tryptophan) that the human body cannot synthesize and must obtain from food. Complete proteins (meat, fish, eggs, soy) contain all essential amino acids.",
    2, "nutrition-foundations"),
  q("nf-08", "Vitamin K is essential for:",
    ["Immune function and collagen synthesis", "Blood clotting and bone metabolism", "Vision and epithelial cell integrity", "Energy metabolism and nerve function"],
    1, "Vitamin K is required for the synthesis of clotting factors (II, VII, IX, X) and proteins involved in bone mineralization. Deficiency leads to increased bleeding time. Warfarin works by blocking vitamin K activity.",
    3, "nutrition-foundations"),
];

// ── Oxygenation (8 questions) ─────────────────────────────────────────────────

const OXYGENATION: PreNursingQuestion[] = [
  q("ox-01", "Normal oxygen saturation (SpO2) in a healthy adult is:",
    ["85–90%", "90–94%", "95–100%", "75–85%"],
    2, "Normal SpO2 is 95–100%. Values 90–94% are borderline (mild hypoxia); below 90% is significant hypoxemia requiring intervention. SpO2 is measured non-invasively by pulse oximetry.",
    1, "oxygenation"),
  q("ox-02", "Which structure separates the right and left sides of the heart?",
    ["Pericardium", "Septum", "Pleura", "Diaphragm"],
    1, "The cardiac septum (interatrial septum between atria; interventricular septum between ventricles) separates the right and left sides of the heart, preventing mixing of oxygenated and deoxygenated blood.",
    1, "oxygenation"),
  q("ox-03", "The primary muscle responsible for breathing is the:",
    ["Intercostal muscles", "Diaphragm", "Sternocleidomastoid", "Pectoralis major"],
    1, "The diaphragm, a dome-shaped muscle separating the thoracic and abdominal cavities, is the primary muscle of respiration. During inhalation, it contracts and flattens, increasing thoracic volume and drawing air in.",
    1, "oxygenation"),
  q("ox-04", "Cyanosis (bluish discoloration) indicates:",
    ["Excess oxygen in the blood", "Inadequate oxygenation, resulting in high levels of deoxygenated hemoglobin", "Liver failure", "Increased red blood cell count"],
    1, "Cyanosis occurs when there is approximately ≥5 g/dL of deoxygenated hemoglobin in the blood. It appears in the lips, fingertips, and nail beds. Central cyanosis (lips/tongue) indicates significant hypoxemia.",
    2, "oxygenation"),
  q("ox-05", "In a patient with chronic obstructive pulmonary disease (COPD), high-flow oxygen therapy must be used cautiously because:",
    ["Oxygen is too expensive for long-term use", "Some COPD patients rely on a hypoxic drive to breathe; high O2 may suppress respiration", "Oxygen causes bronchoconstriction in COPD", "COPD patients cannot absorb oxygen through the alveoli"],
    1, "Some COPD patients with chronic CO2 retention become desensitized to CO2 as a breathing stimulus and rely instead on low oxygen levels (hypoxic drive) to trigger breathing. High-flow oxygen can blunt this drive, potentially causing respiratory depression.",
    3, "oxygenation"),
  q("ox-06", "Tidal volume is defined as:",
    ["The maximum air exhaled after a deep breath", "The volume of air inhaled or exhaled in a single normal breath", "The volume of air remaining in the lungs after maximum exhalation", "The total lung capacity"],
    1, "Tidal volume (TV) is the amount of air moved in or out of the lungs with each normal quiet breath — approximately 500 mL in adults. It is used in calculating minute ventilation (TV × respiratory rate).",
    2, "oxygenation"),
  q("ox-07", "The oxyhemoglobin dissociation curve shifts to the right when:",
    ["pH increases and temperature decreases", "pH decreases, temperature increases, or CO2 increases", "Oxygen levels in the blood rise", "The patient is at high altitude"],
    1, "A rightward shift of the oxyhemoglobin curve means hemoglobin has a lower affinity for oxygen, facilitating O2 release to tissues. It occurs with: acidosis (low pH), increased CO2, increased temperature, and increased 2,3-DPG — often in active/stressed tissues.",
    3, "oxygenation"),
  q("ox-08", "Which assessment finding warrants immediate oxygen administration?",
    ["SpO2 of 97%, respiratory rate of 14", "SpO2 of 88%, use of accessory muscles, and agitation", "Mild shortness of breath with exertion only", "Respiratory rate of 18 with clear lung sounds"],
    1, "SpO2 of 88% combined with accessory muscle use and agitation indicates significant hypoxia. All three signs together suggest the patient is compensating (using extra muscles) and is distressed — immediate supplemental oxygen and further assessment are required.",
    3, "oxygenation"),
];

// ── Health Assessment (8 questions) ───────────────────────────────────────────

const HEALTH_ASSESSMENT: PreNursingQuestion[] = [
  q("ha-01", "The correct order of physical assessment techniques is:",
    ["Inspection, percussion, palpation, auscultation", "Inspection, auscultation, palpation, percussion", "Palpation, inspection, auscultation, percussion", "Auscultation, inspection, palpation, percussion"],
    0, "The standard order for most body systems is IPPA: Inspection, Palpation, Percussion, Auscultation. The abdomen is the exception: Inspection, Auscultation, Percussion, Palpation — because palpation and percussion may alter bowel sounds.",
    1, "health-assessment"),
  q("ha-02", "A normal resting heart rate for an adult is:",
    ["40–60 beats per minute", "60–100 beats per minute", "100–120 beats per minute", "50–70 beats per minute"],
    1, "Normal adult resting heart rate is 60–100 bpm. Below 60 = bradycardia; above 100 = tachycardia. Conditioned athletes may have resting rates below 60 as a normal variant.",
    1, "health-assessment"),
  q("ha-03", "When auscultating lung sounds, crackles (rales) indicate:",
    ["Obstruction by mucus in large airways", "Fluid in the alveoli or small airways opening and closing", "Narrowed bronchioles", "Normal air movement through large airways"],
    1, "Crackles are discontinuous, non-musical sounds caused by fluid in the alveoli (as in pneumonia or pulmonary edema) or small airways snapping open during inspiration. They are described as 'fine' or 'coarse.'",
    2, "health-assessment"),
  q("ha-04", "The Glasgow Coma Scale (GCS) assesses:",
    ["Pain level, mobility, and urinary output", "Eye opening, verbal response, and motor response", "Blood pressure, heart rate, and respiratory rate", "Orientation, memory, and attention"],
    1, "The GCS evaluates three components: Eye opening (1–4), Verbal response (1–5), and Motor response (1–6). Total scores range from 3 (deep unconsciousness) to 15 (fully alert). Scores ≤8 typically indicate severe brain injury.",
    2, "health-assessment"),
  q("ha-05", "Orthostatic hypotension is diagnosed when standing blood pressure decreases by at least:",
    ["5 mmHg systolic or 3 mmHg diastolic", "20 mmHg systolic or 10 mmHg diastolic", "10 mmHg systolic or 5 mmHg diastolic", "30 mmHg systolic or 15 mmHg diastolic"],
    1, "Orthostatic (postural) hypotension is defined as a drop of ≥20 mmHg systolic or ≥10 mmHg diastolic within 3 minutes of standing. It can cause dizziness/falls and may indicate dehydration, autonomic dysfunction, or medication effects.",
    2, "health-assessment"),
  q("ha-06", "During abdominal assessment, which sound is normal when auscultated?",
    ["No sounds at all", "Hyperactive bowel sounds every 5 seconds", "Bowel sounds every 5–30 seconds (5–30 per minute)", "Bruits over the aorta"],
    2, "Normal bowel sounds are soft, gurgling sounds heard approximately 5–30 times per minute (every 5–30 seconds). Absent bowel sounds suggest paralytic ileus; hyperactive sounds suggest obstruction or diarrhea. Aortic bruits are abnormal.",
    2, "health-assessment"),
  q("ha-07", "Pitting edema is graded on a scale of 1+ to 4+. A 3+ pitting edema means:",
    ["Slight pitting, disappears rapidly", "Moderate pitting that disappears in 10–15 seconds", "Deep pitting (>5 mm) that may persist 1–2 minutes", "Severe pitting with permanent deformity"],
    2, "3+ pitting edema is characterized by a deep indentation (approximately 5–6 mm) that takes 1–2 minutes to rebound. It indicates significant fluid accumulation. 4+ is the most severe with indentation >8 mm lasting over 2 minutes.",
    3, "health-assessment"),
  q("ha-08", "A patient's pain is rated 8/10 on the numerical rating scale. According to standard classification, this pain level is:",
    ["Mild", "Moderate", "Severe", "No pain"],
    2, "The numerical rating scale (NRS): 0 = no pain, 1–3 = mild, 4–6 = moderate, 7–10 = severe. A rating of 8/10 is severe pain requiring prompt assessment and likely intervention.",
    1, "health-assessment"),
];

// ── Question Bank ─────────────────────────────────────────────────────────────

export const PRE_NURSING_QUESTION_BANK: PreNursingQuestion[] = [
  ...ANATOMY_PHYSIOLOGY,
  ...MEDICAL_TERMINOLOGY,
  ...PHARMACOLOGY,
  ...FLUIDS_ELECTROLYTES,
  ...INFECTION_CONTROL,
  ...PATHOPHYSIOLOGY,
  ...CHEMISTRY,
  ...NUTRITION_FOUNDATIONS,
  ...OXYGENATION,
  ...HEALTH_ASSESSMENT,
];

/** All module slugs that have questions in the bank. */
export const BANK_MODULE_SLUGS = [
  "anatomy-physiology",
  "medical-terminology",
  "pharmacology",
  "fluids-electrolytes",
  "infection-control",
  "pathophysiology",
  "chemistry",
  "nutrition-foundations",
  "oxygenation",
  "health-assessment",
] as const;

export type BankModuleSlug = (typeof BANK_MODULE_SLUGS)[number];

/** Return all questions for a specific module. */
export function getQuestionsForModule(moduleSlug: string): PreNursingQuestion[] {
  return PRE_NURSING_QUESTION_BANK.filter((q) => q.moduleSlug === moduleSlug);
}

/** Return questions filtered by difficulty. */
export function getQuestionsByDifficulty(
  questions: PreNursingQuestion[],
  difficulty: 1 | 2 | 3,
): PreNursingQuestion[] {
  return questions.filter((q) => q.difficulty === difficulty);
}

/** Return the whole bank shuffled deterministically using a seed integer. */
export function getShuffledBank(seed: number): PreNursingQuestion[] {
  const arr = [...PRE_NURSING_QUESTION_BANK];
  // Simple seeded Fisher-Yates — good enough for client-side variety
  let s = seed;
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [arr[i], arr[j]] = [arr[j]!, arr[i]!];
  }
  return arr;
}

/** Total questions per module summary. */
export const BANK_SUMMARY = BANK_MODULE_SLUGS.map((slug) => ({
  moduleSlug: slug,
  total: PRE_NURSING_QUESTION_BANK.filter((q) => q.moduleSlug === slug).length,
  easy: PRE_NURSING_QUESTION_BANK.filter((q) => q.moduleSlug === slug && q.difficulty === 1).length,
  medium: PRE_NURSING_QUESTION_BANK.filter((q) => q.moduleSlug === slug && q.difficulty === 2).length,
  hard: PRE_NURSING_QUESTION_BANK.filter((q) => q.moduleSlug === slug && q.difficulty === 3).length,
}));
