import type { FlashcardData } from "./flashcards-rpn";

export const rnExpansion2Flashcards: FlashcardData[] = [
  // ============================================================
  // RN EXPANDED — CRITICAL CARE & HEMODYNAMICS (30 cards)
  // ============================================================
  {
    id: "rn-exp2-cc-q1",
    type: "question",
    question: "A patient in septic shock has the following hemodynamic parameters: CVP 4 mmHg, PCWP 6 mmHg, CO 8.5 L/min, SVR 480 dynes. What phase of septic shock does this represent?",
    options: ["Cold/late septic shock", "Warm/hyperdynamic septic shock", "Cardiogenic shock", "Neurogenic shock"],
    correctIndex: 1,
    answer: "Warm (hyperdynamic) septic shock is characterized by LOW SVR (vasodilation from inflammatory mediators), HIGH cardiac output (compensatory), LOW CVP/PCWP (relative hypovolemia from third-spacing and vasodilation), and warm/flushed skin. Cold/late septic shock occurs when the heart decompensates: LOW CO, HIGH SVR, cool/mottled extremities.",
    category: "Critical Care",
    difficulty: 3,
    clinicalPearl: "Shock hemodynamic profiles: Septic (warm) = ↓SVR, ↑CO, ↓PCWP; Septic (cold/late) = ↑SVR, ↓CO, variable PCWP; Cardiogenic = ↑SVR, ↓CO, ↑PCWP; Hypovolemic = ↑SVR, ↓CO, ↓PCWP; Neurogenic = ↓SVR, ↓CO, ↓PCWP with bradycardia."
  },
  {
    id: "rn-exp2-cc-q2",
    type: "question",
    question: "A patient on a ventilator develops auto-PEEP (intrinsic PEEP). Which condition is the most common cause?",
    options: ["Pneumothorax", "COPD/obstructive lung disease", "Heart failure", "Pulmonary fibrosis"],
    correctIndex: 1,
    answer: "Auto-PEEP (air trapping) occurs most commonly in obstructive lung diseases (COPD, asthma) when expiratory time is insufficient for complete exhalation. Gas becomes trapped, increasing end-expiratory pressure. This reduces venous return, increases work of breathing, and can cause hemodynamic instability. Treatment: increase expiratory time (lower RR, increase I:E ratio), bronchodilators, reduce tidal volume.",
    category: "Critical Care",
    difficulty: 3,
    clinicalPearl: "Detecting auto-PEEP: Look for expiratory flow that doesn't reach zero before next breath on the flow-time waveform. To measure: perform an expiratory hold maneuver. Clinical effects: hemodynamic instability (decreased preload), patient-ventilator asynchrony, difficulty triggering breaths. Intervention: reduce minute ventilation, increase expiratory time, treat bronchospasm."
  },
  {
    id: "rn-exp2-cc-q3",
    type: "question",
    question: "A patient with ARDS is on mechanical ventilation. Which ventilator strategy is recommended by the ARDSNet protocol?",
    options: ["High tidal volume (12 mL/kg) to maximize oxygenation", "Low tidal volume (6 mL/kg IBW) with plateau pressure ≤30 cmH₂O", "Pressure support ventilation with minimal PEEP", "High-frequency oscillatory ventilation as first-line"],
    correctIndex: 1,
    answer: "The ARDSNet lung-protective ventilation strategy: Low tidal volume (4-6 mL/kg of IDEAL body weight, based on height), plateau pressure ≤30 cmH₂O, moderate-high PEEP (titrated using FiO₂/PEEP tables), and permissive hypercapnia (accept PaCO₂ up to 50-60 if pH >7.25). This reduces ventilator-induced lung injury and has been shown to reduce mortality by 22%.",
    category: "Critical Care",
    difficulty: 3,
    clinicalPearl: "ARDS management pearls: Use IDEAL body weight (not actual weight) for TV calculation: Males = 50 + 2.3(height in inches - 60); Females = 45.5 + 2.3(height in inches - 60). Prone positioning for 16 hours/day improves mortality in moderate-severe ARDS (P/F <150). Neuromuscular blockade (cisatracurium) considered in first 48 hours of severe ARDS."
  },
  // ============================================================
  // RN EXPANDED — PHARMACOLOGY ADVANCED (25 cards)
  // ============================================================
  {
    id: "rn-exp2-pharm-q1",
    type: "question",
    question: "A patient is receiving tissue plasminogen activator (tPA/alteplase) for acute ischemic stroke. What is the maximum time window from symptom onset for IV tPA administration?",
    options: ["60 minutes", "3 hours", "4.5 hours", "24 hours"],
    correctIndex: 2,
    answer: "IV tPA (alteplase) for acute ischemic stroke can be administered within 4.5 hours of symptom onset (or last known well time). The original window was 3 hours; the ECASS III trial extended it to 4.5 hours with additional exclusion criteria. Door-to-needle time goal: <60 minutes. Key exclusions: active bleeding, recent surgery, INR >1.7, platelet count <100,000, BP >185/110 (must be controlled before tPA).",
    category: "Pharmacology",
    difficulty: 3,
    clinicalPearl: "Stroke timeline: IV tPA ≤4.5 hours; Mechanical thrombectomy ≤24 hours for large vessel occlusion (LVO) with salvageable tissue on perfusion imaging. Post-tPA monitoring: neuro checks q15min x 2h, q30min x 6h, q1h x 16h. No anticoagulants or antiplatelets for 24 hours post-tPA. Blood pressure goal post-tPA: <180/105 mmHg."
  },
  {
    id: "rn-exp2-pharm-q2",
    type: "question",
    question: "A nurse is preparing to administer IV potassium chloride. Which safety measure is essential?",
    options: ["Administer as an IV push for rapid correction", "Verify the infusion rate does not exceed 10-20 mEq/hour via peripheral line", "Mix with dextrose 5% only", "No cardiac monitoring is needed for IV potassium"],
    correctIndex: 1,
    answer: "IV potassium must NEVER be given as an IV push — it causes fatal cardiac arrest. Maximum infusion rate via peripheral IV: 10-20 mEq/hour. Central line allows up to 40 mEq/hour with continuous cardiac monitoring. Concentrations should not exceed 40 mEq/L peripherally (80 mEq/L centrally). Always use an infusion pump.",
    category: "Pharmacology",
    difficulty: 2,
    clinicalPearl: "High-alert medication safety (ISMP): Potassium chloride, insulin, heparin, opioids, neuromuscular blocking agents. These require independent double-checks, weight-based dosing verification, and pump programming verification. Potassium chloride is the most common cause of medication-related death in hospitals."
  },
  {
    id: "rn-exp2-pharm-q3",
    type: "question",
    question: "A patient receiving chemotherapy develops a temperature of 38.8°C, ANC of 400/mm³, and appears ill. What does this presentation indicate and what is the priority action?",
    options: ["Expected side effect, monitor only", "Febrile neutropenia — obtain cultures and start broad-spectrum antibiotics within 1 hour", "Allergic reaction to chemotherapy", "Tumor lysis syndrome"],
    correctIndex: 1,
    answer: "Febrile neutropenia (fever >38.3°C or ≥38.0°C sustained for 1 hour + ANC <500 or <1000 with expected decline) is a medical emergency. Obtain blood cultures (peripheral and central line if present) and start empiric broad-spectrum antibiotics within 1 hour — do NOT wait for culture results. First-line: anti-pseudomonal beta-lactam (piperacillin-tazobactam, cefepime, or meropenem).",
    category: "Oncology",
    difficulty: 3,
    clinicalPearl: "Neutropenia risk levels: ANC 1000-1500 = mild; ANC 500-1000 = moderate; ANC <500 = severe; ANC <100 = profound. Neutropenic precautions: no raw fruits/vegetables, avoid crowds, no rectal temperatures, no IM injections, meticulous hand hygiene. G-CSF (filgrastim) may be given to shorten neutropenia duration."
  },
  // ============================================================
  // RN EXPANDED — LEADERSHIP & DELEGATION (20 cards)
  // ============================================================
  {
    id: "rn-exp2-lead-q1",
    type: "question",
    question: "The RN is delegating tasks to a UAP (unlicensed assistive personnel). Which task is appropriate to delegate?",
    options: ["Initial assessment of a newly admitted patient", "Taking vital signs on a stable postoperative patient", "Evaluating a patient's response to pain medication", "Teaching a newly diagnosed diabetic about insulin injection"],
    correctIndex: 1,
    answer: "UAPs can perform tasks that are routine, standardized, and do not require clinical judgment: vital signs on stable patients, ADLs (bathing, feeding, ambulating), I&O recording, specimen collection, and glucose monitoring. The RN retains responsibility for assessment, evaluation, teaching, clinical judgment, and care of unstable patients. The Five Rights of Delegation: Right Task, Right Circumstance, Right Person, Right Direction, Right Supervision.",
    category: "Leadership",
    difficulty: 1,
    clinicalPearl: "NEVER delegate: Initial assessment, nursing judgment/clinical decision-making, patient education, care of unstable patients, evaluation of outcomes, triage, administration of IV medications. The RN is ALWAYS accountable for the outcome even when delegating appropriately."
  },
  {
    id: "rn-exp2-lead-q2",
    type: "question",
    question: "A charge nurse receives report on 4 patients. Which patient should be assessed FIRST?",
    options: ["Post-op day 1 cholecystectomy with pain rated 4/10", "Diabetic patient with blood glucose of 210 mg/dL before lunch", "Patient with chest tube with continuous bubbling in the water seal chamber", "Patient with pneumonia on antibiotics day 3 with temperature of 37.8°C"],
    correctIndex: 2,
    answer: "Continuous bubbling in the water seal chamber indicates an air leak — either from the patient (bronchopleural fistula) or from the system (disconnection, crack in tubing). This requires immediate assessment to determine if it is a patient problem (potentially dangerous) or system problem. Intermittent bubbling with respiration is expected; CONTINUOUS bubbling is abnormal and requires investigation.",
    category: "Prioritization",
    difficulty: 2,
    clinicalPearl: "Chest tube assessment: Tidaling (fluctuation in water seal) = normal, confirms patency; Intermittent bubbling with cough/expiration = expected air leak; Continuous bubbling = system leak (check connections) or large bronchopleural fistula; No tidaling = tube may be kinked, clamped, or lung has re-expanded. NEVER clamp a chest tube without a provider order."
  },
  {
    id: "rn-exp2-lead-q3",
    type: "question",
    question: "An RN witnesses a nursing assistant slap a confused elderly patient. What is the legal obligation of the RN?",
    options: ["Discuss the behavior with the assistant privately", "Report to the charge nurse only", "Report as suspected abuse to the appropriate authority as a mandatory reporter", "Document the incident and wait for the next shift to report"],
    correctIndex: 2,
    answer: "Nurses are mandatory reporters of suspected abuse, neglect, or exploitation. The RN must: 1) Intervene immediately to ensure patient safety, 2) Report to the charge nurse AND facility administration, 3) Report to the state regulatory authority (Adult Protective Services for elderly), 4) Document objectively. Failure to report is a violation of the Nurse Practice Act and may result in criminal charges.",
    category: "Ethics & Legal",
    difficulty: 1,
    clinicalPearl: "Mandatory reporting obligations: All healthcare workers must report suspected abuse (child, elder, vulnerable adult), communicable diseases, gunshot/stab wounds, and impaired practice by colleagues. Reports can be made anonymously. Mandatory reporters are protected from civil liability for good-faith reports."
  },
  // ============================================================
  // RN EXPANDED — NGN-STYLE CLINICAL JUDGMENT (20 cards)
  // ============================================================
  {
    id: "rn-exp2-ngn-q1",
    type: "question",
    question: "A nurse is caring for a patient 4 hours post-total hip arthroplasty. The patient reports sudden onset of sharp chest pain, dyspnea, and has an SpO₂ of 88%. HR is 118, BP 100/68. Based on clinical judgment, what is the priority hypothesis?",
    options: ["Pneumonia from immobility", "Pulmonary embolism", "Fat embolism syndrome", "Myocardial infarction"],
    correctIndex: 1,
    answer: "The acute onset of chest pain, dyspnea, tachycardia, hypotension, and hypoxemia in a post-surgical orthopedic patient is classic for pulmonary embolism (PE). Orthopedic surgery (especially hip/knee) carries the highest DVT/PE risk. Fat embolism typically presents 24-72 hours post-fracture with petechial rash. Priority: oxygen, notify provider, prepare for CTA, anticoagulation.",
    category: "Clinical Judgment",
    difficulty: 3,
    clinicalPearl: "NGN Clinical Judgment Model steps: Recognize Cues (identify relevant data) → Analyze Cues (link data to conditions) → Prioritize Hypotheses (rank likely diagnoses) → Generate Solutions (plan interventions) → Take Action (implement priority interventions) → Evaluate Outcomes (assess effectiveness). This question tests hypothesis prioritization."
  },
  {
    id: "rn-exp2-ngn-q2",
    type: "question",
    question: "A patient with type 1 diabetes is found unresponsive with cool, clammy skin, diaphoresis, and tachycardia. Fingerstick glucose reads 38 mg/dL. The nurse recognizes these cues. What is the priority action?",
    options: ["Administer 50% dextrose IV push if IV access available", "Give oral glucose gel sublingually", "Administer regular insulin", "Start an IV normal saline bolus"],
    correctIndex: 0,
    answer: "Severe hypoglycemia with altered consciousness requires IV dextrose 50% (D50W) 25-50 mL push. The patient cannot safely swallow oral glucose. If no IV access: glucagon 1 mg IM or intranasal glucagon (Baqsimi). Once conscious: follow with complex carbohydrate + protein snack. Do NOT give insulin — this would worsen the hypoglycemia. Identify and address the cause (missed meal, excess insulin, exercise).",
    category: "Clinical Judgment",
    difficulty: 2,
    clinicalPearl: "Hypoglycemia Rule of 15: For conscious patients: give 15g fast-acting carbohydrate, recheck glucose in 15 minutes, repeat if still <70 mg/dL. For unconscious patients: IV D50W or IM/IN glucagon. Never give oral anything to an unconscious patient (aspiration risk). Common precipitants: insulin dose errors, missed meals, increased activity, alcohol intake."
  },
  {
    id: "rn-exp2-ngn-q3",
    type: "question",
    question: "A nurse reviews the following lab results for a patient with suspected DIC: Platelets 45,000/mm³, fibrinogen 85 mg/dL (low), D-dimer 8,500 ng/mL (elevated), PT 22 seconds (prolonged), aPTT 55 seconds (prolonged). Which condition is most consistent with these findings?",
    options: ["Idiopathic thrombocytopenic purpura (ITP)", "Disseminated intravascular coagulation (DIC)", "Hemophilia A", "Vitamin K deficiency"],
    correctIndex: 1,
    answer: "DIC shows simultaneous clotting AND bleeding: low platelets (consumed), low fibrinogen (consumed), elevated D-dimer (fibrin degradation products), prolonged PT/aPTT (clotting factors depleted). The key differentiator from other coagulopathies is the LOW fibrinogen + HIGH D-dimer combination. ITP has isolated thrombocytopenia with normal coagulation studies. Hemophilia has prolonged aPTT with normal PT and platelets.",
    category: "Clinical Judgment",
    difficulty: 3,
    clinicalPearl: "DIC is always secondary to an underlying trigger: Sepsis, Trauma, Obstetric complications (placental abruption, amniotic fluid embolism), Malignancy, Transfusion reactions. Treatment: Treat the underlying cause FIRST, supportive: platelets (<50K with bleeding), cryoprecipitate (fibrinogen <100), FFP (for factor replacement). Heparin is controversial."
  },
];
