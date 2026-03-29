import crypto from "crypto";
import { pool } from "./storage";
import { VALID_BODY_SYSTEMS, TOPICS_BY_SYSTEM } from "./generatorV2/taxonomyRegistry";

function generateId(): string {
  return crypto.randomUUID();
}

function stemHash(stem: string): string {
  return crypto.createHash("md5").update(stem.toLowerCase().trim()).digest("hex").substring(0, 16);
}

interface QuestionTemplate {
  tier: string;
  exam: string;
  stem: string;
  options: string[];
  correctAnswer: number[];
  rationale: string;
  bodySystem: string;
  topic: string;
  difficulty: number;
  questionType: string;
  regionScope: string;
  scenario: string;
  clinicalPearl: string;
  correctAnswerExplanation: string;
  incorrectAnswerRationale: Record<string, string>;
  clinicalReasoning: string;
  keyTakeaway: string;
}

const NP_EXAM_PATHWAYS: Record<string, { tier: string; exam: string; region: string; label: string }> = {
  AANP_FNP: { tier: "np", exam: "AANP-FNP", region: "US", label: "AANP Family NP" },
  ANCC_FNP: { tier: "np", exam: "ANCC-FNP", region: "US", label: "ANCC Family NP" },
  AGPCNP: { tier: "np", exam: "AGPCNP", region: "US", label: "Adult-Gero Primary Care NP" },
  AGACNP: { tier: "np", exam: "AGACNP", region: "US", label: "Adult-Gero Acute Care NP" },
  PMHNP: { tier: "np", exam: "PMHNP", region: "US", label: "Psychiatric-Mental Health NP" },
  PNP: { tier: "np", exam: "PNP", region: "US", label: "Pediatric NP" },
  WHNP: { tier: "np", exam: "WHNP", region: "US", label: "Women's Health NP" },
  ENP: { tier: "np", exam: "ENP", region: "US", label: "Emergency NP" },
  CNPLE: { tier: "np", exam: "CNPLE", region: "CA", label: "Canadian NP Licensing" },
};

const RPN_QUESTIONS: Record<string, QuestionTemplate[]> = {};
const RN_QUESTIONS: Record<string, QuestionTemplate[]> = {};
const NP_QUESTIONS: Record<string, Record<string, QuestionTemplate[]>> = {};

function makeQ(
  tier: string, exam: string, stem: string, options: string[], correct: number[],
  rationale: string, bodySystem: string, topic: string, difficulty: number,
  qType: string, region: string, scenario: string, pearl: string,
  correctExpl: string, incorrectRat: Record<string, string>,
  reasoning: string, takeaway: string
): QuestionTemplate {
  return {
    tier, exam, stem, options, correctAnswer: correct, rationale, bodySystem, topic,
    difficulty, questionType: qType, regionScope: region, scenario, clinicalPearl: pearl,
    correctAnswerExplanation: correctExpl, incorrectAnswerRationale: incorrectRat,
    clinicalReasoning: reasoning, keyTakeaway: takeaway,
  };
}

function generateRpnCardiacQuestions(): QuestionTemplate[] {
  const questions: QuestionTemplate[] = [];
  const tier = "rpn";
  const exam = "REX-PN";
  const bs = "Cardiac";
  const region = "BOTH";
  const qType = "multiple_choice";

  const templates = [
    {
      topic: "Heart Failure",
      scenarios: [
        { stem: "A 72-year-old patient with a history of heart failure presents with increased dyspnea, bilateral crackles, and 3+ pitting edema. The patient's weight has increased by 2.5 kg over the past 3 days. Which assessment finding should the practical nurse report to the registered nurse first?", opts: ["Weight gain of 2.5 kg in 3 days", "Bilateral crackles in lung bases", "3+ pitting edema in lower extremities", "Dyspnea on exertion"], correct: [0], rationale: "Rapid weight gain (more than 1 kg/day or 2 kg/week) is a critical early indicator of fluid overload in heart failure and requires immediate reporting. While all findings suggest decompensation, the weight gain pattern indicates worsening fluid retention that may require urgent medication adjustment.", pearl: "Weight gain of 1 kg = approximately 1 litre of fluid retention", reasoning: "In heart failure monitoring, daily weight is the most sensitive indicator of fluid status changes. A gain of 2.5 kg in 3 days suggests approximately 2.5 litres of excess fluid accumulation.", takeaway: "Daily weights are the gold standard for monitoring fluid status in heart failure patients." },
        { stem: "A patient with left-sided heart failure is positioned in bed. Which position should the practical nurse use to optimize respiratory function?", opts: ["High Fowler's position (60-90 degrees)", "Supine with legs elevated", "Right lateral position", "Trendelenburg position"], correct: [0], rationale: "High Fowler's position reduces venous return to the heart and lungs, decreasing pulmonary congestion. It also allows the diaphragm to descend, improving lung expansion and gas exchange.", pearl: "Fowler's position = decreased preload = decreased pulmonary congestion", reasoning: "Left-sided heart failure causes pulmonary congestion. Upright positioning uses gravity to reduce venous return and improve respiratory mechanics.", takeaway: "Position patients with heart failure in high Fowler's to decrease preload and improve breathing." },
        { stem: "A patient taking furosemide (Lasix) for heart failure reports muscle cramps, weakness, and an irregular heartbeat. Which electrolyte imbalance should the practical nurse suspect?", opts: ["Hypokalemia", "Hypernatremia", "Hypercalcemia", "Hypermagnesemia"], correct: [0], rationale: "Furosemide is a loop diuretic that causes potassium excretion. Muscle cramps, weakness, and cardiac arrhythmias are classic signs of hypokalemia. Serum potassium should be monitored regularly in patients on loop diuretics.", pearl: "Loop diuretics lose potassium - monitor K+ levels and ECG changes", reasoning: "Loop diuretics inhibit the Na-K-2Cl cotransporter in the loop of Henle, causing significant potassium loss in urine.", takeaway: "Monitor potassium levels in all patients taking loop diuretics and report levels below 3.5 mEq/L." },
        { stem: "A patient with heart failure is prescribed a sodium-restricted diet of 2 grams per day. Which meal choice indicates the patient understands the dietary restriction?", opts: ["Grilled chicken breast with steamed vegetables and brown rice", "Canned tomato soup with crackers and deli meat sandwich", "Frozen dinner with a side salad and bottled dressing", "Fast food hamburger with french fries and ketchup"], correct: [0], rationale: "Fresh grilled chicken, steamed vegetables, and brown rice are naturally low in sodium. Canned soups, deli meats, frozen dinners, and fast food are all high in sodium and inappropriate for a sodium-restricted diet.", pearl: "Fresh foods = low sodium; Processed/canned/frozen = high sodium", reasoning: "Sodium restriction reduces fluid retention in heart failure. Processed foods contain significantly more sodium than fresh-prepared meals.", takeaway: "Teach heart failure patients to choose fresh, unprocessed foods and read nutrition labels for sodium content." },
        { stem: "While assessing a patient with right-sided heart failure, the practical nurse expects to find which of the following findings?", opts: ["Jugular vein distension and hepatomegaly", "Frothy pink sputum and crackles", "Decreased urine output and confusion", "Chest pain and diaphoresis"], correct: [0], rationale: "Right-sided heart failure causes systemic venous congestion, leading to jugular vein distension (JVD), hepatomegaly, peripheral edema, and ascites. Left-sided heart failure causes pulmonary congestion (crackles, dyspnea, frothy sputum).", pearl: "Right = systemic congestion (JVD, edema, liver); Left = pulmonary congestion (crackles, dyspnea)", reasoning: "When the right ventricle fails to pump effectively, blood backs up into the systemic venous circulation, causing congestion in the liver, abdomen, and peripheral tissues.", takeaway: "Distinguish right-sided (peripheral/systemic) from left-sided (pulmonary) heart failure symptoms." },
      ]
    },
    {
      topic: "Hypertension",
      scenarios: [
        { stem: "A 58-year-old patient has a blood pressure reading of 162/98 mmHg on two separate occasions. The patient has no symptoms. Which classification does this represent according to current guidelines?", opts: ["Stage 2 hypertension", "Stage 1 hypertension", "Hypertensive urgency", "Prehypertension"], correct: [0], rationale: "Stage 2 hypertension is defined as systolic >= 140 mmHg or diastolic >= 90 mmHg (per Canadian guidelines) or systolic >= 140 mmHg (per ACC/AHA). A reading of 162/98 on two occasions meets criteria for Stage 2 hypertension.", pearl: "Stage 2 HTN: >= 140/90 mmHg on two or more readings", reasoning: "Blood pressure classification requires confirmation on at least two separate visits. The reading of 162/98 exceeds Stage 2 thresholds.", takeaway: "Always confirm elevated blood pressure readings on at least two separate occasions before classifying." },
        { stem: "A patient newly diagnosed with hypertension asks about lifestyle modifications. Which response by the practical nurse is most appropriate?", opts: ["Reducing sodium intake, increasing physical activity, and limiting alcohol can help lower blood pressure", "Medication is the only effective treatment for high blood pressure", "Stress reduction alone will control your blood pressure", "You only need to make changes if your blood pressure goes above 180/120"], correct: [0], rationale: "Lifestyle modifications are first-line interventions for hypertension and include sodium reduction (< 2 g/day), regular physical activity (30 minutes most days), weight management, limiting alcohol, and the DASH diet. These can reduce systolic BP by 5-20 mmHg.", pearl: "DASH diet + exercise + sodium restriction = 10-20 mmHg systolic BP reduction", reasoning: "Non-pharmacological interventions are evidence-based approaches that can significantly reduce blood pressure and may delay or reduce the need for medications.", takeaway: "Teach all hypertensive patients about lifestyle modifications as foundational management." },
        { stem: "A patient taking amlodipine (Norvasc) for hypertension reports swollen ankles. What should the practical nurse explain to the patient?", opts: ["Peripheral edema is a common side effect of calcium channel blockers and should be reported to the provider", "The swelling indicates heart failure and requires emergency care", "Elevating the feet will permanently resolve the swelling", "The medication should be stopped immediately"], correct: [0], rationale: "Peripheral edema is a common side effect of dihydropyridine calcium channel blockers like amlodipine due to arteriolar vasodilation. The patient should report this to the prescriber but not stop the medication without medical advice.", pearl: "Amlodipine = ankle edema (arteriolar vasodilation, not heart failure)", reasoning: "Dihydropyridine CCBs cause preferential arteriolar dilation, leading to increased capillary pressure and fluid movement into interstitial spaces, producing dependent edema.", takeaway: "Educate patients that ankle swelling on CCBs is a medication side effect, not necessarily heart failure." },
        { stem: "When measuring a patient's blood pressure, the practical nurse notes that the cuff is too small for the patient's arm. How does an undersized cuff affect the reading?", opts: ["It gives a falsely high reading", "It gives a falsely low reading", "It does not affect the reading", "It causes an irregular reading"], correct: [0], rationale: "A blood pressure cuff that is too small does not adequately compress the brachial artery, requiring more pressure to occlude blood flow. This results in a falsely elevated reading. The cuff bladder should cover 80% of the arm circumference.", pearl: "Small cuff = falsely HIGH; Large cuff = falsely LOW", reasoning: "Inadequate compression of the brachial artery due to an undersized cuff means the cuff must be inflated to a higher pressure to occlude the artery, producing an artificially elevated reading.", takeaway: "Always use the correct cuff size - the bladder should encircle at least 80% of the upper arm." },
        { stem: "A patient with hypertension is prescribed hydrochlorothiazide (HCTZ). Which laboratory value should the practical nurse monitor most closely?", opts: ["Serum potassium level", "Serum calcium level", "Serum sodium level", "Blood glucose level"], correct: [0], rationale: "Thiazide diuretics increase renal potassium excretion, potentially causing hypokalemia. Symptoms include muscle weakness, cramping, and cardiac arrhythmias. Potassium levels should be monitored regularly.", pearl: "Thiazides waste K+ and spare Ca2+ - opposite of loop diuretics for calcium", reasoning: "HCTZ inhibits the sodium-chloride cotransporter in the distal convoluted tubule, increasing sodium and potassium excretion while enhancing calcium reabsorption.", takeaway: "Monitor potassium levels in patients on thiazide diuretics and encourage potassium-rich foods." },
      ]
    },
    {
      topic: "Acute Coronary Syndrome",
      scenarios: [
        { stem: "A 65-year-old male presents to the emergency department with crushing substernal chest pain radiating to the left arm, diaphoresis, and nausea. Which action should the practical nurse take first?", opts: ["Administer supplemental oxygen and obtain a 12-lead ECG as ordered", "Prepare the patient for cardiac catheterization", "Administer morphine for pain relief", "Draw blood for cardiac enzyme levels"], correct: [0], rationale: "The initial priority in suspected acute coronary syndrome is to ensure adequate oxygenation and obtain a 12-lead ECG within 10 minutes to identify ST-segment changes. This guides further treatment decisions including fibrinolytic therapy or PCI.", pearl: "ACS protocol: Oxygen, ECG within 10 minutes, ASA, Nitro, Morphine (MONA)", reasoning: "Rapid ECG acquisition is critical because it determines whether the patient has a STEMI (requiring emergent reperfusion) or NSTEMI/unstable angina (requiring medical management).", takeaway: "In suspected ACS, obtain a 12-lead ECG within 10 minutes of arrival - time is myocardium." },
        { stem: "A patient recovering from a myocardial infarction asks why they need to take aspirin daily. Which explanation by the practical nurse is most accurate?", opts: ["Aspirin prevents blood clots from forming on damaged coronary artery walls", "Aspirin reduces cholesterol levels in the blood", "Aspirin strengthens the heart muscle after damage", "Aspirin prevents future blockages from forming"], correct: [0], rationale: "Aspirin irreversibly inhibits cyclooxygenase (COX-1), preventing thromboxane A2 synthesis and platelet aggregation. After MI, the damaged endothelium is prone to thrombus formation, making antiplatelet therapy essential.", pearl: "ASA = irreversible COX-1 inhibition = decreased platelet aggregation for 7-10 days", reasoning: "Post-MI, the coronary artery endothelium is damaged and prothrombotic. Daily aspirin reduces the risk of recurrent thrombotic events by 25%.", takeaway: "Daily aspirin after MI is a cornerstone of secondary prevention - explain the antiplatelet mechanism to patients." },
        { stem: "A patient with chest pain has been prescribed sublingual nitroglycerin. The practical nurse should instruct the patient to do which of the following?", opts: ["Take one tablet under the tongue and sit down; if pain persists after 5 minutes, call emergency services", "Take three tablets at once for faster relief", "Swallow the tablet with water for better absorption", "Take a tablet only if the pain lasts longer than 30 minutes"], correct: [0], rationale: "Sublingual nitroglycerin is taken one tablet under the tongue while sitting or lying down (to prevent orthostatic hypotension). If chest pain is not relieved within 5 minutes, emergency services should be called as this may indicate MI.", pearl: "NTG protocol: 1 tab SL, sit down, wait 5 min - no relief = call 911", reasoning: "Nitroglycerin causes vasodilation, reducing preload and myocardial oxygen demand. If anginal pain persists after one dose, it suggests possible acute coronary occlusion requiring emergency intervention.", takeaway: "Teach patients: take 1 NTG sublingual, sit down, call 911 if pain persists after 5 minutes." },
        { stem: "A practical nurse is caring for a patient 24 hours post-myocardial infarction. Which finding requires immediate notification of the healthcare team?", opts: ["New onset of irregular heart rhythm on the cardiac monitor", "Mild soreness at the IV insertion site", "Patient requesting pain medication rated 3/10", "Slight increase in temperature to 37.8°C (100°F)"], correct: [0], rationale: "New-onset arrhythmias in the first 24-48 hours post-MI are common and can be life-threatening (ventricular tachycardia, ventricular fibrillation). These require immediate medical evaluation and potentially emergent treatment.", pearl: "Post-MI arrhythmia risk is highest in the first 24-48 hours", reasoning: "Ischemic myocardium is electrically unstable, creating re-entry circuits that can trigger fatal arrhythmias. Continuous cardiac monitoring is essential in the acute post-MI period.", takeaway: "Monitor for and immediately report any new arrhythmias in the first 48 hours post-MI." },
      ]
    },
    {
      topic: "Arrhythmias",
      scenarios: [
        { stem: "A patient on telemetry monitoring shows a heart rate of 42 beats per minute with a regular rhythm. The patient reports dizziness and lightheadedness. Which action should the practical nurse take first?", opts: ["Assess the patient's blood pressure and level of consciousness and notify the registered nurse immediately", "Administer epinephrine as a standing order", "Encourage the patient to ambulate to increase heart rate", "Apply a defibrillator and prepare for cardioversion"], correct: [0], rationale: "Symptomatic bradycardia (HR < 60 with symptoms like dizziness, hypotension, or syncope) requires immediate assessment and notification. The RN or provider needs to evaluate for atropine administration or temporary pacing.", pearl: "Symptomatic bradycardia: Assess, notify, prepare atropine 0.5 mg IV", reasoning: "A heart rate of 42 with dizziness indicates hemodynamically significant bradycardia. Assessment of blood pressure and mental status determines the urgency of intervention.", takeaway: "Report symptomatic bradycardia immediately - patients may deteriorate to asystole without treatment." },
        { stem: "The practical nurse observes that a patient's cardiac monitor shows an irregular rhythm with no discernible P waves and a ventricular rate of 88 beats per minute. This rhythm is most consistent with which arrhythmia?", opts: ["Atrial fibrillation", "Sinus arrhythmia", "Atrial flutter", "Ventricular tachycardia"], correct: [0], rationale: "Atrial fibrillation is characterized by an irregularly irregular rhythm, absence of organized P waves (replaced by fibrillatory waves), and a variable ventricular rate. A rate of 88 bpm suggests controlled atrial fibrillation.", pearl: "A-fib = irregularly irregular + no P waves + fibrillatory baseline", reasoning: "In atrial fibrillation, the atria fire chaotically at 350-600 times per minute, producing no organized P waves. The AV node conducts impulses irregularly, creating the hallmark irregularly irregular ventricular response.", takeaway: "Identify atrial fibrillation by its irregularly irregular rhythm and absence of P waves on the monitor." },
      ]
    },
    {
      topic: "Deep Vein Thrombosis",
      scenarios: [
        { stem: "A post-surgical patient reports calf pain, warmth, and swelling in the left leg. The practical nurse notes a positive Homans' sign. Which action is most appropriate?", opts: ["Keep the patient on bed rest, elevate the affected leg, and notify the registered nurse immediately", "Apply ice to the affected leg and encourage ambulation", "Massage the affected calf to relieve the pain", "Apply a warm compress and encourage the patient to walk"], correct: [0], rationale: "Signs of deep vein thrombosis (DVT) require immediate bed rest (to prevent embolization), leg elevation, and urgent notification. The leg should never be massaged as this could dislodge a clot, causing a pulmonary embolism.", pearl: "Suspected DVT: No massage, no ambulation, notify immediately - risk of PE", reasoning: "DVT presents with unilateral leg pain, swelling, warmth, and erythema. Positive Homans' sign (calf pain with dorsiflexion) supports the clinical suspicion. Manipulation of the affected limb risks clot embolization.", takeaway: "Never massage a limb with suspected DVT - bed rest, elevate, notify provider for anticoagulation and diagnostic imaging." },
        { stem: "A patient is prescribed enoxaparin (Lovenox) for DVT prophylaxis after hip replacement surgery. Which injection technique should the practical nurse use?", opts: ["Inject subcutaneously into the abdomen, alternating sides, without aspirating", "Inject intramuscularly into the deltoid muscle", "Inject subcutaneously into the thigh and aspirate before injecting", "Inject intravenously through the existing IV line"], correct: [0], rationale: "Enoxaparin is a low-molecular-weight heparin administered subcutaneously into the abdomen, at least 2 inches from the umbilicus. Do not aspirate before injection or rub the site afterward, as this increases bruising risk.", pearl: "LMWH injection: SQ abdomen, no aspiration, no rubbing, rotate sites", reasoning: "Subcutaneous abdominal injection provides consistent absorption of LMWH. Aspiration and rubbing cause tissue trauma and increase the risk of hematoma formation at the injection site.", takeaway: "Administer LMWH subcutaneously into the abdomen without aspirating - rotate injection sites." },
      ]
    },
  ];

  for (const group of templates) {
    for (const s of group.scenarios) {
      questions.push(makeQ(
        tier, exam, s.stem, s.opts, s.correct,
        s.rationale, bs, group.topic, 3, qType, region,
        s.stem.split(".")[0] + ".", s.pearl,
        s.rationale, { "B": "Incorrect option", "C": "Incorrect option", "D": "Incorrect option" },
        s.reasoning, s.takeaway
      ));
    }
  }
  return questions;
}

function generateSystemQuestions(
  tier: string, exam: string, bodySystem: string, topics: string[],
  region: string, scopeContext: string, count: number
): QuestionTemplate[] {
  const questions: QuestionTemplate[] = [];
  const difficulties = [2, 2, 3, 3, 3, 4, 4, 4, 5, 5];

  const settings = [
    "medical-surgical unit", "emergency department", "outpatient clinic", "home health visit",
    "rehabilitation center", "long-term care facility", "community health center", "ambulatory surgery center",
    "intensive care unit", "pediatric ward", "telemetry unit", "post-anesthesia care unit",
  ];

  const ages = [22, 28, 34, 38, 42, 45, 48, 52, 55, 58, 62, 65, 68, 72, 75, 78, 82, 85, 88, 91];

  for (const topic of topics) {
    const perTopic = Math.ceil(count / topics.length);
    for (let i = 0; i < perTopic; i++) {
      const diff = difficulties[i % difficulties.length];
      const age = ages[i % ages.length];
      const gender = i % 3 === 0 ? "male" : i % 3 === 1 ? "female" : (i % 2 === 0 ? "male" : "female");
      const setting = settings[i % settings.length];
      const pronoun = gender === "female" ? "she" : "he";
      const possessive = gender === "female" ? "her" : "his";

      const allVariants = [
        {
          stem: `A ${age}-year-old ${gender} patient is admitted to the ${setting} with ${topic}. The nurse notes changes in ${possessive} condition. Which assessment finding should be reported to the healthcare provider first?`,
          options: [
            `Change in level of consciousness or vital sign instability`,
            `Patient reports mild discomfort rated 3/10`,
            `Slight change in appetite over the past 24 hours`,
            `Patient requests information about ${possessive} diagnosis`,
          ],
          correct: [0],
          rationale: `Changes in level of consciousness or vital sign instability can indicate acute deterioration and require immediate medical evaluation. This is a priority finding that may signal a life-threatening change in the patient's condition.`,
          qType: "multiple_choice",
        },
        {
          stem: `A nurse in the ${setting} is caring for a patient with ${topic}. Which nursing intervention takes priority in the plan of care?`,
          options: [
            `Monitor for signs and symptoms of complications specific to ${topic.toLowerCase()}`,
            `Provide written educational materials about the condition`,
            `Schedule a follow-up appointment with the specialist`,
            `Encourage the patient to join a support group`,
          ],
          correct: [0],
          rationale: `Monitoring for complications is the priority nursing intervention because early detection of deterioration allows for timely intervention. Patient education and follow-up are important but secondary to safety monitoring.`,
          qType: "multiple_choice",
        },
        {
          stem: `A ${age}-year-old patient with ${topic} asks the nurse about expected outcomes of treatment. Which response demonstrates therapeutic communication?`,
          options: [
            `Treatment goals include managing symptoms, preventing complications, and improving quality of life`,
            `You will be completely cured within a few weeks`,
            `There is nothing that can be done for this condition`,
            `You should discuss this with your family, not the healthcare team`,
          ],
          correct: [0],
          rationale: `Providing accurate, honest, and hopeful information about treatment goals demonstrates therapeutic communication. The nurse should explain that treatment aims to manage symptoms, prevent complications, and optimize quality of life.`,
          qType: "multiple_choice",
        },
        {
          stem: `When caring for a patient diagnosed with ${topic} on the ${setting}, which assessment should the nurse prioritize?`,
          options: [
            `Vital signs, pain level, and system-specific assessment findings`,
            `Patient's preferred visiting hours`,
            `Patient's dietary preferences for the next meal`,
            `Patient's entertainment needs during hospitalization`,
          ],
          correct: [0],
          rationale: `Priority assessments include vital signs, pain assessment, and system-specific findings related to ${topic}. These assessments provide critical data for clinical decision-making and early detection of complications.`,
          qType: "multiple_choice",
        },
        {
          stem: `A patient with ${topic} is being prepared for discharge from the ${setting}. Which statement by the patient indicates a need for further teaching?`,
          options: [
            `I can stop taking my medications once I feel better`,
            `I should follow up with my healthcare provider as scheduled`,
            `I need to monitor for signs that my condition is getting worse`,
            `I should contact my provider if I notice new or worsening symptoms`,
          ],
          correct: [0],
          rationale: `Stating that medications can be stopped when feeling better indicates a misunderstanding of medication adherence. Many conditions require continued medication even when symptoms improve.`,
          qType: "multiple_choice",
        },
        {
          stem: `A ${age}-year-old ${gender} patient in the ${setting} is receiving treatment for ${topic}. The patient suddenly becomes anxious and reports new symptoms. What is the nurse's priority action?`,
          options: [
            `Perform an immediate focused assessment and obtain vital signs`,
            `Reassure the patient that everything will be fine`,
            `Document the patient's complaints in the medical record`,
            `Call the patient's family to inform them of the change`,
          ],
          correct: [0],
          rationale: `When a patient reports new symptoms, the nurse's priority is to perform an immediate assessment and obtain vital signs to determine the severity of the situation. Assessment must come before other nursing actions.`,
          qType: "multiple_choice",
        },
        {
          stem: `The nurse is delegating care for multiple patients, including a patient with ${topic}. Which task can be safely delegated to unlicensed assistive personnel (UAP)?`,
          options: [
            `Obtaining and recording vital signs at scheduled intervals`,
            `Administering oral medications for the condition`,
            `Performing the initial patient assessment`,
            `Educating the patient about disease management`,
          ],
          correct: [0],
          rationale: `Obtaining and recording vital signs is within the scope of UAP practice. Assessment, medication administration, and patient education require the judgment and knowledge of a licensed nurse and cannot be delegated.`,
          qType: "multiple_choice",
        },
        {
          stem: `A ${age}-year-old ${gender} presents to the ${setting} with suspected ${topic}. Which diagnostic finding is most important for the nurse to monitor?`,
          options: [
            `Laboratory values and diagnostic test results specific to ${topic.toLowerCase()}`,
            `The patient's clothing size for proper gown fitting`,
            `Whether the patient has dental insurance`,
            `The patient's preferred television channels`,
          ],
          correct: [0],
          rationale: `Laboratory values and diagnostic test results provide objective data essential for confirming the diagnosis, monitoring disease progression, and evaluating treatment response for ${topic}.`,
          qType: "multiple_choice",
        },
        {
          stem: `A nurse is caring for a ${age}-year-old ${gender} with ${topic} on the ${setting}. The patient has a history of non-adherence to the treatment plan. Which approach is most effective?`,
          options: [
            `Explore the patient's barriers to adherence and develop a collaborative plan`,
            `Repeat the same instructions more loudly and slowly`,
            `Report the patient's non-adherence to hospital administration`,
            `Tell the patient that non-adherence will result in discharge`,
          ],
          correct: [0],
          rationale: `Exploring barriers to adherence and developing a collaborative plan addresses the root cause of non-adherence. Using motivational interviewing and patient-centered approaches improves treatment compliance.`,
          qType: "multiple_choice",
        },
        {
          stem: `During shift report, the nurse learns that a ${age}-year-old patient with ${topic} had deteriorating vital signs overnight. Which action should the nurse take first upon receiving this patient?`,
          options: [
            `Immediately assess the patient and compare current findings to the reported baseline`,
            `Review the patient's chart before going to the bedside`,
            `Contact the healthcare provider before seeing the patient`,
            `Ask the night nurse to continue monitoring for another hour`,
          ],
          correct: [0],
          rationale: `The nurse's first priority is to assess the patient directly when reported changes suggest deterioration. Direct assessment provides current data and allows the nurse to identify any immediate interventions needed.`,
          qType: "multiple_choice",
        },
        {
          stem: `A ${age}-year-old ${gender} patient with ${topic} in the ${setting} requires pain management. Which nursing action demonstrates best practice for pain assessment?`,
          options: [
            `Use a validated pain scale appropriate for the patient's age and cognitive status`,
            `Assume the patient's pain level based on facial expressions alone`,
            `Administer the maximum dose of analgesic without assessment`,
            `Ask the family to rate the patient's pain level`,
          ],
          correct: [0],
          rationale: `Using a validated pain scale ensures objective, consistent pain assessment. Self-report is the gold standard for pain assessment when the patient can communicate. The tool should be appropriate for the patient's developmental and cognitive level.`,
          qType: "multiple_choice",
        },
        {
          stem: `The nurse is developing a care plan for a patient with ${topic}. ${scopeContext} Which of the following should be included in the plan? Select all that apply.`,
          options: [
            `Perform a focused ${bodySystem.toLowerCase()} assessment every shift`,
            `Document and communicate all findings to the healthcare team`,
            `Monitor vital signs and report significant changes`,
            `Provide patient education about ${topic.toLowerCase()} management`,
            `Delay assessment until the patient requests it`,
            `Wait for the physician to initiate all interventions`,
          ],
          correct: [0, 1, 2, 3],
          rationale: `Focused assessment, documentation, vital sign monitoring, and patient education are all essential nursing care plan components. Delaying assessment until requested is unsafe, and nurses should initiate interventions within scope of practice rather than waiting for physician direction.`,
          qType: "select_all_that_apply",
        },
        {
          stem: `A patient with ${topic} on the ${setting} develops signs of a complication. Which findings require immediate nursing intervention? Select all that apply.`,
          options: [
            `Sudden change in mental status`,
            `New onset of difficulty breathing`,
            `Vital sign instability (hypotension or tachycardia)`,
            `Patient requesting a meal tray`,
            `Patient asking when visitors can arrive`,
          ],
          correct: [0, 1, 2],
          rationale: `Sudden mental status changes, new respiratory distress, and vital sign instability are urgent findings requiring immediate nursing intervention. Meal requests and visitor questions are routine, non-urgent matters that can be addressed after priority concerns.`,
          qType: "select_all_that_apply",
        },
        {
          stem: `The nurse is providing education to a ${age}-year-old ${gender} patient newly diagnosed with ${topic}. Which statements indicate effective patient education? Select all that apply.`,
          options: [
            `The patient can describe warning signs that require medical attention`,
            `The patient verbalizes understanding of the medication regimen`,
            `The patient demonstrates proper technique for self-monitoring`,
            `The patient states "I'll just look up my condition online"`,
            `The patient says "My family will remember everything for me"`,
          ],
          correct: [0, 1, 2],
          rationale: `Effective patient education is demonstrated when the patient can describe warning signs, verbalize medication understanding, and demonstrate self-care techniques. Relying solely on online information or delegating all responsibility to family members does not indicate personal comprehension and readiness for self-management.`,
          qType: "select_all_that_apply",
        },
        {
          stem: `A nurse is prioritizing care for four patients. Which patient should the nurse assess first? Patient A has stable ${topic}, Patient B has new onset chest pain, Patient C is requesting pain medication, and Patient D needs a dressing change.`,
          options: [
            `Patient B with new onset chest pain`,
            `Patient A with stable ${topic}`,
            `Patient C requesting pain medication`,
            `Patient D needing a dressing change`,
          ],
          correct: [0],
          rationale: `New onset chest pain requires immediate assessment as it may indicate a life-threatening condition such as myocardial infarction or pulmonary embolism. Using the ABCs and priority framework, acute changes take precedence over stable conditions and routine care.`,
          qType: "multiple_choice",
        },
        {
          stem: `A ${age}-year-old ${gender} with a history of ${topic} presents to the ${setting} for a follow-up visit. The nurse reviews the medical record and notes that the patient's condition has been well-controlled. What is the most important action for the nurse?`,
          options: [
            `Perform a comprehensive assessment to confirm the patient's current status`,
            `Skip the assessment since the condition is well-controlled`,
            `Only review the patient's medication list`,
            `Focus solely on scheduling the next appointment`,
          ],
          correct: [0],
          rationale: `Even when a condition is well-controlled, the nurse must perform a comprehensive assessment to identify any subtle changes, verify medication adherence, and screen for new concerns. Assessment is always the first step in the nursing process.`,
          qType: "multiple_choice",
        },
        {
          stem: `A nurse in the ${setting} is caring for a ${age}-year-old ${gender} with ${topic} who is experiencing anxiety about ${possessive} condition. Which nursing intervention is most appropriate?`,
          options: [
            `Use therapeutic communication techniques to acknowledge the patient's feelings and provide factual information`,
            `Tell the patient not to worry because the doctor will handle everything`,
            `Administer anti-anxiety medication without further assessment`,
            `Avoid discussing the condition to prevent further anxiety`,
          ],
          correct: [0],
          rationale: `Therapeutic communication techniques, including active listening, empathy, and providing factual information, are evidence-based approaches to managing patient anxiety. Acknowledging feelings validates the patient's experience and builds trust.`,
          qType: "multiple_choice",
        },
        {
          stem: `The nurse is reviewing laboratory results for a ${age}-year-old patient with ${topic} on the ${setting}. Which action should the nurse take when a critical laboratory value is identified?`,
          options: [
            `Immediately notify the healthcare provider and document the critical value and time of notification`,
            `Wait until the next scheduled vital sign check to report the value`,
            `Reorder the laboratory test to confirm the result before reporting`,
            `Document the value in the chart without notifying anyone`,
          ],
          correct: [0],
          rationale: `Critical laboratory values must be reported immediately to the healthcare provider as they may indicate a life-threatening condition requiring urgent intervention. The nurse must document the value, time of notification, provider contacted, and orders received.`,
          qType: "multiple_choice",
        },
        {
          stem: `A patient with ${topic} on the ${setting} requires infection prevention measures. Which nursing interventions are essential? Select all that apply.`,
          options: [
            `Perform hand hygiene before and after patient contact`,
            `Use appropriate personal protective equipment (PPE) as indicated`,
            `Monitor for signs and symptoms of infection`,
            `Reuse single-use equipment between patients to save resources`,
            `Skip gown changes when moving between isolation rooms`,
          ],
          correct: [0, 1, 2],
          rationale: `Hand hygiene, appropriate PPE use, and infection monitoring are essential infection prevention interventions. Reusing single-use equipment and skipping gown changes between isolation rooms are unsafe practices that increase cross-contamination risk.`,
          qType: "select_all_that_apply",
        },
        {
          stem: `A ${age}-year-old ${gender} patient with ${topic} in the ${setting} falls while attempting to ambulate to the bathroom. What is the nurse's immediate priority?`,
          options: [
            `Assess the patient for injuries and obtain vital signs`,
            `Complete an incident report before helping the patient`,
            `Call the supervisor to report the fall`,
            `Move the patient back to bed immediately without assessment`,
          ],
          correct: [0],
          rationale: `After a patient fall, the nurse's immediate priority is to assess for injuries (head injury, fractures, lacerations) and obtain vital signs. Patient safety and assessment take priority over documentation and reporting.`,
          qType: "multiple_choice",
        },
        {
          stem: `A nurse is administering medications to a ${age}-year-old patient with ${topic}. The patient states the medication looks different from what ${pronoun} usually takes. What should the nurse do?`,
          options: [
            `Hold the medication, verify the order, and confirm with the pharmacy before administering`,
            `Administer the medication and tell the patient it is the same drug in a different form`,
            `Document that the patient refused the medication`,
            `Give the medication anyway since it was verified during preparation`,
          ],
          correct: [0],
          rationale: `When a patient questions a medication, the nurse must stop and verify. Patients are an important safety barrier in medication administration. The nurse should hold the medication, verify the order, and confirm with the pharmacy before proceeding.`,
          qType: "multiple_choice",
        },
        {
          stem: `The nurse is caring for a ${age}-year-old ${gender} with ${topic} who requires a blood transfusion. Which assessment is most critical during the first 15 minutes of the transfusion?`,
          options: [
            `Monitor for signs of transfusion reaction including fever, chills, hives, and respiratory distress`,
            `Check the patient's dietary intake for the day`,
            `Review the patient's activity orders`,
            `Verify the patient's next scheduled appointment`,
          ],
          correct: [0],
          rationale: `The first 15 minutes of a blood transfusion is the most critical period for detecting adverse reactions. The nurse must stay with the patient and monitor for signs of hemolytic, allergic, or febrile reactions including fever, chills, urticaria, and dyspnea.`,
          qType: "multiple_choice",
        },
        {
          stem: `A ${age}-year-old ${gender} patient with ${topic} in the ${setting} is at risk for pressure injuries. Which interventions should the nurse implement? Select all that apply.`,
          options: [
            `Reposition the patient at least every 2 hours`,
            `Perform skin assessments using a validated tool (e.g., Braden Scale)`,
            `Ensure adequate nutrition and hydration`,
            `Massage reddened bony prominences vigorously`,
            `Apply a heat lamp to pressure areas to improve circulation`,
          ],
          correct: [0, 1, 2],
          rationale: `Regular repositioning, systematic skin assessment, and nutrition optimization are evidence-based pressure injury prevention strategies. Massaging reddened areas can cause further tissue damage, and heat lamps can burn fragile skin — both are contraindicated.`,
          qType: "select_all_that_apply",
        },
        {
          stem: `A nurse in the ${setting} receives a telephone order for a ${age}-year-old patient with ${topic}. Which action is essential for safe telephone order management?`,
          options: [
            `Read back the complete order to the prescriber for verification before implementing`,
            `Implement the order immediately without verification`,
            `Write the order on a napkin and transfer it later`,
            `Ask another nurse to take the order instead`,
          ],
          correct: [0],
          rationale: `Read-back verification is a critical patient safety practice for telephone orders. The nurse must write the order, read it back to the prescriber for confirmation, and have the order co-signed within the facility's timeframe.`,
          qType: "multiple_choice",
        },
        {
          stem: `The nurse identifies that a ${age}-year-old patient with ${topic} is at risk for falls. Which interventions should be implemented? Select all that apply.`,
          options: [
            `Place the call light within reach and ensure the bed is in the lowest position`,
            `Apply non-skid footwear when the patient ambulates`,
            `Complete a fall risk assessment using a validated tool`,
            `Apply bilateral wrist restraints to keep the patient in bed`,
            `Sedate the patient to prevent ambulation attempts`,
          ],
          correct: [0, 1, 2],
          rationale: `Environmental modifications (call light, low bed), non-skid footwear, and validated fall risk assessment are evidence-based fall prevention strategies. Restraints and sedation are not appropriate fall prevention measures and can increase injury risk and cause harm.`,
          qType: "select_all_that_apply",
        },
      ];

      const variant = allVariants[i % allVariants.length];
      const pearl = `Key concept: ${topic} requires systematic assessment and evidence-based management within scope of practice.`;
      const reasoning = `Clinical reasoning for ${topic} involves recognizing priority findings, applying evidence-based interventions, and communicating effectively with the healthcare team.`;
      const takeaway = `For ${topic}: prioritize safety, systematic assessment, and timely communication of changes.`;

      const incorrectRat: Record<string, string> = {};
      variant.options.forEach((_, idx) => {
        if (!variant.correct.includes(idx)) {
          const letter = String.fromCharCode(65 + idx);
          incorrectRat[letter] = `This option is not the priority action in this clinical scenario.`;
        }
      });

      questions.push(makeQ(
        tier, exam, variant.stem, variant.options, variant.correct, variant.rationale, bodySystem, topic,
        diff, variant.qType, region, variant.stem.split(".")[0] + ".",
        pearl, variant.rationale, incorrectRat, reasoning, takeaway
      ));
    }
  }

  return questions;
}

function generateNpPathwayQuestions(
  pathway: string, exam: string, region: string, bodySystem: string, topics: string[], count: number
): QuestionTemplate[] {
  const questions: QuestionTemplate[] = [];
  const tier = "np";

  const pathwayContexts: Record<string, string> = {
    "AANP-FNP": "As a Family Nurse Practitioner, the NP independently manages this primary care patient across the lifespan.",
    "ANCC-FNP": "Using evidence-based practice guidelines, the FNP-BC evaluates this patient in a primary care setting.",
    "AGPCNP": "The Adult-Gerontology Primary Care NP evaluates this older adult patient with multiple comorbidities in the outpatient setting.",
    "AGACNP": "The Acute Care NP manages this critically ill patient in the intensive care unit with complex hemodynamic monitoring.",
    "PMHNP": "The Psychiatric-Mental Health NP assesses this patient presenting with psychiatric symptoms and psychopharmacological needs.",
    "PNP": "The Pediatric NP evaluates this pediatric patient considering growth, development, and weight-based pharmacology.",
    "WHNP": "The Women's Health NP assesses this patient presenting with reproductive health concerns.",
    "ENP": "The Emergency NP rapidly evaluates this patient presenting to the emergency department requiring time-sensitive clinical decisions.",
    "CNPLE": "Using Canadian clinical practice guidelines and SI units, the NP assesses this patient in the Canadian healthcare context.",
  };

  const context = pathwayContexts[exam] || "The Nurse Practitioner independently evaluates and manages this patient.";

  for (const topic of topics) {
    const perTopic = Math.ceil(count / topics.length);
    for (let i = 0; i < perTopic; i++) {
      const diff = [3, 4, 4, 5, 5][i % 5];
      const patientAge = pathway === "PNP" ? (2 + (i * 3) % 15) : pathway === "AGPCNP" || pathway === "AGACNP" ? (55 + (i * 5) % 35) : (30 + (i * 7) % 40);
      const gender = i % 2 === 0 ? "female" : "male";

      const npQuestionTypes = [
        {
          stem: `A ${patientAge}-year-old ${gender} patient presents to the ${exam === "ENP" ? "emergency department" : exam === "AGACNP" ? "ICU" : "clinic"} with symptoms suggestive of ${topic}. ${context} Which diagnostic workup should the NP order first?`,
          options: [
            `Comprehensive metabolic panel, CBC with differential, and condition-specific diagnostic studies`,
            `Referral to a specialist without initial workup`,
            `Repeat assessment in 6 months without intervention`,
            `Empiric treatment without diagnostic confirmation`,
          ],
          correct: [0],
          rationale: `Initial diagnostic workup for ${topic} should include appropriate laboratory studies and condition-specific diagnostics to establish or confirm the diagnosis before initiating treatment. Evidence-based practice requires diagnostic confirmation to guide appropriate management.`,
        },
        {
          stem: `The NP is managing a patient with established ${topic}. ${context} The patient's current medication regimen is not achieving therapeutic goals. Which pharmacological adjustment is most appropriate?`,
          options: [
            `Review current medications for efficacy, interactions, and adherence, then adjust therapy based on current clinical guidelines`,
            `Discontinue all current medications and start an entirely new regimen`,
            `Continue the current regimen without changes for another 6 months`,
            `Add a new medication without evaluating the current regimen`,
          ],
          correct: [0],
          rationale: `Before making pharmacological changes, the NP should review the current regimen for efficacy, adherence, drug interactions, and contraindications. Guideline-directed therapy adjustments should be evidence-based and consider the patient's complete clinical picture.`,
        },
        {
          stem: `A patient presents to the NP with a differential diagnosis that includes ${topic}. ${context} Which clinical finding would most strongly support this diagnosis?`,
          options: [
            `Condition-specific signs and symptoms with supporting diagnostic evidence consistent with ${topic.toLowerCase()}`,
            `Normal physical examination with no abnormal findings`,
            `Patient's self-diagnosis based on internet research`,
            `Family history of the condition without any personal symptoms`,
          ],
          correct: [0],
          rationale: `Definitive diagnosis of ${topic} requires correlation of clinical signs and symptoms with diagnostic findings. The NP must synthesize history, physical examination, and diagnostic data to reach an accurate diagnosis and differentiate from similar conditions.`,
        },
        {
          stem: `The NP is developing a treatment plan for a newly diagnosed patient with ${topic}. ${context} Which component is essential to include in the initial management plan?`,
          options: [
            `Patient education, lifestyle modifications, pharmacotherapy as indicated, and scheduled follow-up for monitoring`,
            `Immediate surgical referral without conservative management trial`,
            `Wait-and-see approach without any intervention or follow-up`,
            `Prescribe the most expensive medication available for the condition`,
          ],
          correct: [0],
          rationale: `Comprehensive management of ${topic} includes patient education about the condition, evidence-based lifestyle modifications, appropriate pharmacotherapy when indicated, and scheduled follow-up to monitor treatment response and adjust the plan as needed.`,
        },
        {
          stem: `During follow-up, a patient being treated for ${topic} reports new symptoms. ${context} Which assessment finding would require the most urgent clinical action?`,
          options: [
            `Signs or symptoms indicating a serious complication or treatment failure requiring immediate intervention`,
            `Mild side effect that has been stable and previously discussed`,
            `Patient requesting a medication refill before the next scheduled visit`,
            `Patient asking about alternative therapy options`,
          ],
          correct: [0],
          rationale: `New symptoms in a patient being treated for ${topic} must be evaluated for complications or treatment failure. Signs of serious complications require urgent intervention, as delayed response can lead to adverse outcomes.`,
        },
      ];

      const variant = npQuestionTypes[i % npQuestionTypes.length];

      questions.push(makeQ(
        tier, exam, variant.stem, variant.options, variant.correct,
        variant.rationale, bodySystem, topic, diff, "multiple_choice",
        region === "CA" ? "CA" : "US",
        variant.stem.split(".")[0] + ".",
        `NP clinical decision-making for ${topic}: systematic assessment, evidence-based management, and appropriate follow-up.`,
        variant.rationale,
        { "B": "Not the priority action in this scenario.", "C": "Does not address the immediate clinical need.", "D": "Not consistent with evidence-based practice." },
        `Advanced clinical reasoning for ${topic} requires integration of assessment findings, diagnostic data, and guideline-directed therapy.`,
        `NP management of ${topic}: diagnose accurately, treat evidence-based, monitor outcomes, and adjust as needed.`
      ));
    }
  }

  return questions;
}

function generateNgnCaseQuestions(
  tier: string, exam: string, bodySystem: string, topic: string,
  region: string, caseNum: number
): QuestionTemplate[] {
  const questions: QuestionTemplate[] = [];
  const patientAge = 45 + (caseNum * 11) % 40;
  const gender = caseNum % 2 === 0 ? "female" : "male";
  const pronoun = gender === "female" ? "she" : "he";
  const possessive = gender === "female" ? "her" : "his";

  const caseContext = `A ${patientAge}-year-old ${gender} patient is admitted with a primary diagnosis related to ${topic}. The patient has a complex medical history requiring multi-step clinical judgment.`;

  const caseSteps = [
    {
      stem: `${caseContext} Based on the initial assessment data, which finding requires the nurse's immediate attention? (Step 1 of 6 - Recognize Cues)`,
      options: [
        `Abnormal vital signs or assessment findings that indicate clinical deterioration`,
        `Patient reports being hungry and wants a meal tray`,
        `Family member asks about visiting hours`,
        `Patient's insurance information needs to be updated`,
      ],
      correct: [0],
      rationale: `In the Clinical Judgment Measurement Model (CJMM), the first step is recognizing cues. Abnormal vital signs or clinical findings indicating deterioration are priority cues that require immediate nursing attention.`,
    },
    {
      stem: `${caseContext} After recognizing the relevant cues, which analysis is most important for the nurse to perform? (Step 2 of 6 - Analyze Cues)`,
      options: [
        `Compare current findings to baseline and identify patterns that suggest clinical deterioration or improvement`,
        `Review the patient's dietary preferences`,
        `Check the patient's social media profile for health information`,
        `Count the number of visitors the patient has had today`,
      ],
      correct: [0],
      rationale: `Analyzing cues involves comparing current assessment data to baseline values, identifying trends, and recognizing patterns that indicate changes in the patient's condition. This step is critical for accurate clinical judgment.`,
    },
    {
      stem: `${caseContext} Based on the analysis of assessment data, which hypothesis is most likely? (Step 3 of 6 - Prioritize Hypotheses)`,
      options: [
        `The patient is experiencing a complication related to ${topic.toLowerCase()} that requires prompt intervention`,
        `The patient is simply anxious about being in the hospital`,
        `The assessment data is unreliable and should be repeated tomorrow`,
        `The patient's condition is improving and no action is needed`,
      ],
      correct: [0],
      rationale: `Prioritizing hypotheses involves determining which clinical explanation best fits the assessment data. When findings suggest a complication of ${topic}, this hypothesis takes priority because it has the most significant implications for patient safety.`,
    },
    {
      stem: `${caseContext} The nurse identifies that the patient is at risk for complications. Which action should the nurse take? (Step 4 of 6 - Generate Solutions)`,
      options: [
        `Implement evidence-based interventions, notify the healthcare provider, and increase monitoring frequency`,
        `Wait until the next shift to reassess the patient`,
        `Document the findings but take no immediate action`,
        `Discharge the patient to reduce hospital costs`,
      ],
      correct: [0],
      rationale: `Generating solutions involves identifying evidence-based interventions that address the patient's clinical needs. For a patient at risk for complications from ${topic}, appropriate actions include implementing interventions, notifying the provider, and increasing monitoring.`,
    },
    {
      stem: `${caseContext} The nurse implements the planned interventions. Which action best demonstrates appropriate prioritization? (Step 5 of 6 - Take Action)`,
      options: [
        `Address life-threatening concerns first, then systematic assessment, then comfort measures`,
        `Complete all comfort measures before addressing clinical concerns`,
        `Delegate all tasks to the nursing assistant without supervision`,
        `Complete documentation before providing any patient care`,
      ],
      correct: [0],
      rationale: `Taking action requires prioritization using the ABCs (Airway, Breathing, Circulation), Maslow's hierarchy, or the nursing process. Life-threatening concerns are always addressed first, followed by systematic assessment and comfort measures.`,
    },
    {
      stem: `${caseContext} After implementing interventions, how should the nurse evaluate the effectiveness of care? (Step 6 of 6 - Evaluate Outcomes)`,
      options: [
        `Reassess vital signs and clinical findings to determine if interventions achieved desired outcomes`,
        `Assume the interventions were effective without reassessment`,
        `Ask the patient's family if they think the treatment is working`,
        `Wait for the physician to evaluate the outcomes during rounds`,
      ],
      correct: [0],
      rationale: `Evaluating outcomes involves reassessing the patient's condition to determine if interventions were effective. The nurse should compare post-intervention assessment data to pre-intervention findings and expected outcomes, adjusting the plan of care as needed.`,
    },
  ];

  for (const step of caseSteps) {
    questions.push(makeQ(
      tier, exam, step.stem, step.options, step.correct,
      step.rationale, bodySystem, topic, 4, "ngn_case_study",
      region, caseContext,
      `NGN Clinical Judgment: ${topic} - use the CJMM framework for systematic decision-making.`,
      step.rationale,
      { "B": "Not a priority clinical action.", "C": "Does not demonstrate appropriate clinical judgment.", "D": "Not consistent with patient safety priorities." },
      `The NGN Clinical Judgment Measurement Model guides nurses through 6 steps: Recognize Cues, Analyze Cues, Prioritize Hypotheses, Generate Solutions, Take Action, and Evaluate Outcomes.`,
      `Apply the CJMM framework systematically when answering NGN-style questions.`
    ));
  }

  return questions;
}

async function getExistingHashes(): Promise<Set<string>> {
  const result = await pool.query(`SELECT stem_hash FROM exam_questions WHERE stem_hash IS NOT NULL`);
  return new Set(result.rows.map((r: any) => r.stem_hash));
}

async function insertQuestionBatch(questions: QuestionTemplate[], existingHashes: Set<string>): Promise<number> {
  let inserted = 0;
  const BATCH = 50;
  const toInsert: { q: QuestionTemplate; hash: string; id: string }[] = [];

  for (const q of questions) {
    const compositeKey = `${q.tier}:${q.exam}:${q.stem}`;
    const hash = stemHash(compositeKey);
    if (existingHashes.has(hash)) continue;
    existingHashes.add(hash);
    toInsert.push({ q, hash, id: generateId() });
  }

  for (let i = 0; i < toInsert.length; i += BATCH) {
    const batch = toInsert.slice(i, i + BATCH);
    const values: string[] = [];
    const params: any[] = [];
    let p = 1;

    for (const { q, hash, id } of batch) {
      values.push(`($${p++},$${p++},$${p++},$${p++},$${p++},$${p++},$${p++},$${p++},$${p++},$${p++},$${p++},$${p++},$${p++},$${p++},$${p++},$${p++},$${p++},$${p++},NOW(),NOW(),NOW())`);
      params.push(
        id, q.tier, q.exam, q.questionType, "published",
        q.stem, JSON.stringify(q.options), JSON.stringify(q.correctAnswer),
        q.rationale, q.difficulty, q.bodySystem, q.topic,
        q.regionScope, hash, "nursing", q.scenario || "",
        q.clinicalPearl,
        JSON.stringify({ ...q.incorrectAnswerRationale, keyTakeaway: q.keyTakeaway, clinicalReasoning: q.clinicalReasoning }),
      );
    }

    if (values.length === 0) continue;

    try {
      const result = await pool.query(`INSERT INTO exam_questions (
        id, tier, exam, question_type, status,
        stem, options, correct_answer,
        rationale, difficulty, body_system, topic,
        region_scope, stem_hash, career_type, scenario,
        clinical_pearl, distractor_rationales,
        created_at, updated_at, published_at
      ) VALUES ${values.join(",")}`, params);
      inserted += result.rowCount || 0;
    } catch (err: any) {
      for (const { q, hash, id } of batch) {
        try {
          await pool.query(`INSERT INTO exam_questions (
            id, tier, exam, question_type, status,
            stem, options, correct_answer,
            rationale, difficulty, body_system, topic,
            region_scope, stem_hash, career_type, scenario,
            clinical_pearl, distractor_rationales,
            created_at, updated_at, published_at
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,NOW(),NOW(),NOW())`, [
            id, q.tier, q.exam, q.questionType, "published",
            q.stem, JSON.stringify(q.options), JSON.stringify(q.correctAnswer),
            q.rationale, q.difficulty, q.bodySystem, q.topic,
            q.regionScope, hash, "nursing", q.scenario || "",
            q.clinicalPearl,
            JSON.stringify({ ...q.incorrectAnswerRationale, keyTakeaway: q.keyTakeaway, clinicalReasoning: q.clinicalReasoning }),
          ]);
          inserted++;
        } catch (rowErr: any) {
          if (rowErr?.code !== '23505') {
            console.error(`[Seeder] Failed to insert question (hash=${hash}): ${rowErr?.message || rowErr}`);
          }
        }
      }
    }
  }

  return inserted;
}

async function generateFlashcardsForQuestions(tier: string, exam: string): Promise<number> {
  const existingSourceIds = await pool.query(
    `SELECT DISTINCT source_question_id FROM flashcard_bank WHERE source_question_id IS NOT NULL`
  );
  const existingSourceSet = new Set(existingSourceIds.rows.map((r: any) => r.source_question_id));

  const PAGE_SIZE = 5000;
  let offset = 0;
  let allRows: any[] = [];
  while (true) {
    const page = await pool.query(`
      SELECT id, stem, options, correct_answer, rationale, body_system, topic, clinical_pearl, difficulty
      FROM exam_questions 
      WHERE tier = $1 AND exam = $2 AND status = 'published'
      ORDER BY id
      LIMIT $3 OFFSET $4
    `, [tier, exam, PAGE_SIZE, offset]);
    if (page.rows.length === 0) break;
    allRows = allRows.concat(page.rows);
    offset += page.rows.length;
    if (page.rows.length < PAGE_SIZE) break;
  }
  const result = { rows: allRows };

  let created = 0;
  const BATCH = 50;
  const toInsert: any[] = [];

  for (const q of result.rows) {
    if (existingSourceSet.has(q.id)) continue;
    existingSourceSet.add(q.id);

    let opts = q.options;
    if (typeof opts === "string") {
      try { opts = JSON.parse(opts); } catch { opts = []; }
    }
    let correctIdx = 0;
    let correctAnswer = q.correct_answer;
    if (typeof correctAnswer === "string") {
      try { correctAnswer = JSON.parse(correctAnswer); } catch { correctAnswer = [0]; }
    }
    if (Array.isArray(correctAnswer) && correctAnswer.length > 0) {
      correctIdx = typeof correctAnswer[0] === "number" ? correctAnswer[0] : 0;
    }
    const correctText = Array.isArray(opts) && opts[correctIdx] ? opts[correctIdx] : "See rationale";

    const front = q.stem.length > 300 ? q.stem.substring(0, 300) + "..." : q.stem;
    const back = `Answer: ${correctText}\n\n${q.rationale || ""}${q.clinical_pearl ? "\n\nClinical Pearl: " + q.clinical_pearl : ""}`.trim();
    const contentHash = stemHash(front + back);
    const tags = JSON.stringify([tier, exam, q.body_system, q.topic].filter(Boolean));
    const category = q.body_system || q.topic || "General";

    toInsert.push([
      generateId(), tier, q.topic || category, front, back, tags, "published", contentHash,
      "nursing", "exam_question", q.id, "multiple_choice",
      JSON.stringify(opts), JSON.stringify(correctAnswer), q.rationale, q.clinical_pearl,
      q.difficulty || 3, q.body_system, q.topic, exam, true,
      category, "BOTH"
    ]);
  }

  for (let i = 0; i < toInsert.length; i += BATCH) {
    const batch = toInsert.slice(i, i + BATCH);
    const values: string[] = [];
    const params: any[] = [];
    let p = 1;

    for (const row of batch) {
      values.push(`($${p++},$${p++},$${p++},$${p++},$${p++},$${p++},$${p++},$${p++},$${p++},$${p++},$${p++},$${p++},$${p++},$${p++},$${p++},$${p++},$${p++},$${p++},$${p++},$${p++},$${p++},$${p++},$${p++},NOW(),NOW())`);
      params.push(...row);
    }

    try {
      const result = await pool.query(`INSERT INTO flashcard_bank (
        id, tier, topic_tag, front, back, tags_json, status, content_hash,
        career_type, source_type, source_question_id, question_type,
        options, correct_answer, rationale_correct, exam_pearl,
        difficulty, body_system, topic, exam_type, flashcard_enabled,
        category, region_scope, created_at, updated_at
      ) VALUES ${values.join(",")}`, params);
      created += result.rowCount || 0;
    } catch (err: any) {
      for (const row of batch) {
        try {
          await pool.query(`INSERT INTO flashcard_bank (
            id, tier, topic_tag, front, back, tags_json, status, content_hash,
            career_type, source_type, source_question_id, question_type,
            options, correct_answer, rationale_correct, exam_pearl,
            difficulty, body_system, topic, exam_type, flashcard_enabled,
            category, region_scope, created_at, updated_at
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,NOW(),NOW())`, row);
          created++;
        } catch (rowErr: any) {
          if (rowErr?.code !== '23505') {
            console.error(`[Seeder] Failed to insert flashcard: ${rowErr?.message || rowErr}`);
          }
        }
      }
    }
  }

  return created;
}

export async function runNursingQuestionExpansion(): Promise<{
  rpnInserted: number;
  rnInserted: number;
  npInserted: number;
  npPathwayBreakdown: Record<string, number>;
  ngnCaseSets: number;
  flashcardsCreated: number;
  totalInserted: number;
}> {
  console.log("[NursingExpansion] Starting massive question bank expansion...");

  const existingHashes = await getExistingHashes();
  console.log(`[NursingExpansion] Found ${existingHashes.size} existing question hashes`);

  const allSystems = [...VALID_BODY_SYSTEMS] as string[];
  let rpnInserted = 0;
  let rnInserted = 0;
  let npInserted = 0;
  const npPathwayBreakdown: Record<string, number> = {};
  let ngnCaseSets = 0;
  let flashcardsCreated = 0;

  const rpnHandcrafted = generateRpnCardiacQuestions();
  const rpnHandcraftedCount = await insertQuestionBatch(rpnHandcrafted, existingHashes);
  rpnInserted += rpnHandcraftedCount;
  console.log(`[NursingExpansion] RPN handcrafted cardiac: ${rpnHandcraftedCount} inserted`);

  for (const system of allSystems) {
    const topics = TOPICS_BY_SYSTEM[system as keyof typeof TOPICS_BY_SYSTEM] || [];
    if (topics.length === 0) continue;

    const rpnQuestions = generateSystemQuestions(
      "rpn", "REX-PN", system, topics, "BOTH",
      "The practical nurse is responsible for monitoring and reporting changes within RPN scope of practice.",
      topics.length * 25
    );
    const rpnCount = await insertQuestionBatch(rpnQuestions, existingHashes);
    rpnInserted += rpnCount;

    const rpnUsQuestions = generateSystemQuestions(
      "rpn", "NCLEX-PN", system, topics, "US",
      "The LPN/LVN is responsible for providing safe care within the practical nursing scope of practice.",
      topics.length * 25
    );
    const rpnUsCount = await insertQuestionBatch(rpnUsQuestions, existingHashes);
    rpnInserted += rpnUsCount;

    const rpnCatQuestions = generateSystemQuestions(
      "rpn", "RPN-CAT", system, topics, "BOTH",
      "The practical nurse demonstrates clinical judgment in an adaptive testing environment within PN scope.",
      topics.length * 10
    );
    const rpnCatCount = await insertQuestionBatch(rpnCatQuestions, existingHashes);
    rpnInserted += rpnCatCount;

    const rnQuestions = generateSystemQuestions(
      "rn", "NCLEX-RN", system, topics, "BOTH",
      "The registered nurse applies clinical judgment, prioritization, and delegation within RN scope of practice.",
      topics.length * 25
    );
    const rnCount = await insertQuestionBatch(rnQuestions, existingHashes);
    rnInserted += rnCount;

    const rnCatQuestions = generateSystemQuestions(
      "rn", "RN-CAT", system, topics, "BOTH",
      "The RN demonstrates clinical judgment in an adaptive testing environment.",
      topics.length * 15
    );
    const rnCatCount = await insertQuestionBatch(rnCatQuestions, existingHashes);
    rnInserted += rnCatCount;

    const npCoreQuestions = generateSystemQuestions(
      "np", "NP-Advanced", system, topics, "BOTH",
      "The Nurse Practitioner independently assesses, diagnoses, and manages patients at the advanced practice level.",
      topics.length * 15
    );
    const npCoreCount = await insertQuestionBatch(npCoreQuestions, existingHashes);
    npInserted += npCoreCount;

    const npAanpQuestions = generateSystemQuestions(
      "np", "AANP", system, topics, "US",
      "The AANP-certified NP demonstrates advanced clinical judgment in primary care across the lifespan.",
      topics.length * 10
    );
    const npAanpCount = await insertQuestionBatch(npAanpQuestions, existingHashes);
    npInserted += npAanpCount;

    const npCatQuestions = generateSystemQuestions(
      "np", "NP-CAT", system, topics, "BOTH",
      "The NP demonstrates advanced clinical reasoning in a computer-adaptive testing format.",
      topics.length * 10
    );
    const npCatCount = await insertQuestionBatch(npCatQuestions, existingHashes);
    npInserted += npCatCount;

    console.log(`[NursingExpansion] ${system}: RPN=${rpnCount + rpnUsCount + rpnCatCount}, RN=${rnCount + rnCatCount}, NP=${npCoreCount + npAanpCount + npCatCount}`);
  }

  for (const [pathwayKey, pathwayConfig] of Object.entries(NP_EXAM_PATHWAYS)) {
    let pathwayInserted = 0;

    for (const system of allSystems) {
      const topics = TOPICS_BY_SYSTEM[system as keyof typeof TOPICS_BY_SYSTEM] || [];
      if (topics.length === 0) continue;

      const pathwayQuestions = generateNpPathwayQuestions(
        pathwayKey, pathwayConfig.exam, pathwayConfig.region,
        system, topics, topics.length * 5
      );
      const count = await insertQuestionBatch(pathwayQuestions, existingHashes);
      pathwayInserted += count;
      npInserted += count;
    }

    npPathwayBreakdown[pathwayKey] = pathwayInserted;
    console.log(`[NursingExpansion] NP pathway ${pathwayConfig.label}: ${pathwayInserted} questions`);
  }

  const ngnTiers = [
    { tier: "rpn", exam: "REX-PN", target: 300 },
    { tier: "rn", exam: "NCLEX-RN", target: 500 },
    { tier: "np", exam: "NP-Advanced", target: 800 },
  ];

  for (const ngnConfig of ngnTiers) {
    let tierNgnSets = 0;
    const systemsForNgn = allSystems.slice(0, 8);
    const casesPerSystem = Math.ceil(ngnConfig.target / (systemsForNgn.length * 6));

    for (const system of systemsForNgn) {
      const topics = TOPICS_BY_SYSTEM[system as keyof typeof TOPICS_BY_SYSTEM] || [];
      const topicsForCases = topics.slice(0, Math.min(topics.length, casesPerSystem));

      for (let caseIdx = 0; caseIdx < topicsForCases.length; caseIdx++) {
        const caseQuestions = generateNgnCaseQuestions(
          ngnConfig.tier, ngnConfig.exam, system, topicsForCases[caseIdx],
          "BOTH", caseIdx
        );
        const caseCount = await insertQuestionBatch(caseQuestions, existingHashes);
        if (caseCount > 0) tierNgnSets++;

        if (ngnConfig.tier === "rpn") rpnInserted += caseCount;
        else if (ngnConfig.tier === "rn") rnInserted += caseCount;
        else npInserted += caseCount;
      }
    }

    ngnCaseSets += tierNgnSets;
    console.log(`[NursingExpansion] NGN case sets for ${ngnConfig.tier}: ${tierNgnSets} sets`);
  }

  const allExams = [
    { tier: "rpn", exam: "REX-PN" },
    { tier: "rpn", exam: "NCLEX-PN" },
    { tier: "rn", exam: "NCLEX-RN" },
    { tier: "rn", exam: "RN-CAT" },
    { tier: "np", exam: "NP-Advanced" },
    { tier: "np", exam: "AANP" },
    ...Object.values(NP_EXAM_PATHWAYS).map(p => ({ tier: p.tier, exam: p.exam })),
  ];

  for (const examConfig of allExams) {
    const fc = await generateFlashcardsForQuestions(examConfig.tier, examConfig.exam);
    flashcardsCreated += fc;
  }

  console.log(`[NursingExpansion] Flashcards created: ${flashcardsCreated}`);

  const totalInserted = rpnInserted + rnInserted + npInserted;
  console.log(`[NursingExpansion] EXPANSION COMPLETE:`);
  console.log(`  RPN: ${rpnInserted} new questions`);
  console.log(`  RN: ${rnInserted} new questions`);
  console.log(`  NP: ${npInserted} new questions`);
  console.log(`  NGN case sets: ${ngnCaseSets}`);
  console.log(`  Flashcards: ${flashcardsCreated}`);
  console.log(`  Total new: ${totalInserted}`);

  return { rpnInserted, rnInserted, npInserted, npPathwayBreakdown, ngnCaseSets, flashcardsCreated, totalInserted };
}
