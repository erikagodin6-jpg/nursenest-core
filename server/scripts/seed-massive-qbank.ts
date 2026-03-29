import crypto from "crypto";
import pg from "pg";

const pool = new pg.Pool({
  host: process.env.PGHOST || "helium",
  user: process.env.PGUSER || "postgres",
  password: process.env.PGPASSWORD || "password",
  database: process.env.PGDATABASE || "heliumdb",
  ssl: false,
});

function stemHash(text: string): string {
  return crypto.createHash("sha256").update(text.trim().toLowerCase().replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ")).digest("hex").substring(0, 16);
}

interface Q {
  tier: string; exam: string; questionType: string; stem: string;
  options: { label: string; text: string }[];
  correctAnswer: string[]; rationale: string; difficulty: number;
  tags: string[]; topic: string; subtopic: string; regionScope: string;
  scenario: string; clinicalPearl: string; examStrategy: string;
  clinicalTrap: string; distractorRationales: Record<string, string>;
  bodySystem: string;
}

const O = (l: string, t: string) => ({ label: l, text: t });

function makeQ(tier: string, exam: string, rs: string, topic: string, sub: string, bs: string, qt: string, diff: number, stem: string, opts: {label:string;text:string}[], ca: string[], rat: string, cp: string, es: string, ct: string, dr: Record<string,string>, tags: string[]): Q {
  return { tier, exam, questionType: qt, stem, options: opts, correctAnswer: ca, rationale: rat, difficulty: diff, tags, topic, subtopic: sub, regionScope: rs, scenario: stem.substring(0, 120), clinicalPearl: cp, examStrategy: es, clinicalTrap: ct, distractorRationales: dr, bodySystem: bs };
}

function buildAllQuestions(): Q[] {
  const qs: Q[] = [];

  // Helper functions
  const rpn = (t: string, s: string, bs: string, qt: string, d: number, stem: string, opts: any[], ca: string[], rat: string, cp: string, es: string, ct: string, dr: any, tags: string[]) => makeQ("rpn","REx-PN","CA",t,s,bs,qt,d,stem,opts,ca,rat,cp,es,ct,dr,tags);
  const pn = (t: string, s: string, bs: string, qt: string, d: number, stem: string, opts: any[], ca: string[], rat: string, cp: string, es: string, ct: string, dr: any, tags: string[]) => makeQ("rpn","NCLEX-PN","US",t,s,bs,qt,d,stem,opts,ca,rat,cp,es,ct,dr,tags);
  const rn = (t: string, s: string, bs: string, qt: string, d: number, stem: string, opts: any[], ca: string[], rat: string, cp: string, es: string, ct: string, dr: any, tags: string[]) => makeQ("rn","NCLEX-RN","BOTH",t,s,bs,qt,d,stem,opts,ca,rat,cp,es,ct,dr,tags);

  // ===== REx-PN (Canadian) Questions =====

  // Pharmacology - Drug Classes
  const drugScenarios = [
    { drug: "metformin 500 mg", condition: "type 2 diabetes", age: 62, vital: "blood glucose 14.2 mmol/L", teaching: "Take with meals to reduce GI side effects; report persistent nausea, vomiting, or muscle pain as these may indicate lactic acidosis", wrongTeaching1: "Take on an empty stomach for best absorption", wrongTeaching2: "This medication may cause significant weight gain", wrongTeaching3: "You can take this medication with alcohol without any concerns", correctExplanation: "Metformin should be taken with food to minimize gastrointestinal side effects (nausea, diarrhea, metallic taste). Lactic acidosis is a rare but serious complication that requires immediate medical attention. Metformin is actually weight-neutral or may cause modest weight loss, unlike sulfonylureas or insulin. Alcohol consumption increases the risk of lactic acidosis and should be limited.", tags: ["metformin", "diabetes", "oral-hypoglycemic"] },
    { drug: "amlodipine 5 mg", condition: "hypertension", age: 58, vital: "BP 162/94 mmHg", teaching: "Rise slowly from sitting or lying positions to prevent dizziness; do not stop the medication abruptly; report significant ankle swelling", wrongTeaching1: "Take the medication only when your blood pressure feels high", wrongTeaching2: "This medication works immediately; you should see results within minutes", wrongTeaching3: "Grapefruit juice enhances the effectiveness of this medication", correctExplanation: "Amlodipine is a calcium channel blocker that requires consistent daily dosing regardless of how the patient feels. It takes 6-12 hours for peak effect and 6-8 weeks for full therapeutic benefit. Peripheral edema (ankle swelling) is a common side effect due to precapillary vasodilation. Grapefruit juice inhibits CYP3A4 metabolism, potentially increasing drug levels and side effects, and should be avoided.", tags: ["amlodipine", "CCB", "hypertension", "antihypertensive"] },
    { drug: "levothyroxine 75 mcg", condition: "hypothyroidism", age: 45, vital: "TSH 8.2 mIU/L", teaching: "Take on an empty stomach 30-60 minutes before breakfast with a full glass of water; separate from calcium, iron, and antacids by at least 4 hours", wrongTeaching1: "Take with breakfast for better absorption", wrongTeaching2: "Double the dose if you miss one day", wrongTeaching3: "Stop taking the medication once your energy improves", correctExplanation: "Levothyroxine absorption is significantly reduced by food, calcium, iron, and antacids. Taking it on an empty stomach ensures optimal absorption. The dose should never be doubled; take the missed dose as soon as remembered unless it is close to the next dose. Hypothyroidism is a lifelong condition requiring continuous treatment; stopping the medication will cause symptoms to return. TSH levels should be monitored every 6-8 weeks during dose adjustments and annually once stable.", tags: ["levothyroxine", "hypothyroidism", "thyroid", "hormone-replacement"] },
    { drug: "pantoprazole 40 mg", condition: "gastroesophageal reflux disease (GERD)", age: 52, vital: "reports heartburn after meals", teaching: "Take 30 minutes before breakfast for maximum effectiveness; do not crush or chew the tablet; long-term use may increase risk of bone fractures and C. difficile infection", wrongTeaching1: "Take after meals when heartburn occurs for quick relief", wrongTeaching2: "Crush the tablet and mix with food if swallowing is difficult", wrongTeaching3: "This medication is safe for indefinite long-term use without monitoring", correctExplanation: "Pantoprazole is a proton pump inhibitor (PPI) that irreversibly blocks the H+/K+-ATPase pump in gastric parietal cells. It must be taken BEFORE meals (ideally 30 minutes before breakfast) because the proton pumps are most active during eating. The enteric-coated tablet should not be crushed or chewed as this destroys the protective coating and inactivates the drug in stomach acid. Long-term PPI use (>1 year) is associated with increased risk of osteoporotic fractures (decreased calcium absorption), Clostridioides difficile infection, hypomagnesemia, and vitamin B12 deficiency.", tags: ["pantoprazole", "PPI", "GERD", "acid-suppression"] },
    { drug: "clopidogrel 75 mg", condition: "recent coronary stent placement", age: 67, vital: "HR 78 bpm, BP 132/80 mmHg", teaching: "Take this medication at the same time every day; do NOT stop taking it without consulting your cardiologist as stopping can cause a life-threatening stent thrombosis", wrongTeaching1: "You can stop this medication if you feel fine after a few weeks", wrongTeaching2: "Take this medication with aspirin but only on alternate days", wrongTeaching3: "Minor bleeding like nosebleeds is not concerning while on this medication", correctExplanation: "Clopidogrel is an antiplatelet agent (P2Y12 inhibitor) that prevents platelet aggregation. After coronary stent placement, dual antiplatelet therapy (DAPT) with aspirin AND clopidogrel is mandatory for a specified period (typically 6-12 months for drug-eluting stents). Premature discontinuation is the strongest risk factor for stent thrombosis, a potentially fatal complication where a blood clot forms inside the stent. Both medications should be taken daily together, not on alternate days. Any bleeding, including epistaxis, should be monitored and reported as it may indicate excessive anticoagulation.", tags: ["clopidogrel", "antiplatelet", "stent", "DAPT", "cardiac"] },
  ];

  for (const ds of drugScenarios) {
    qs.push(rpn("Pharmacology", "Medication Teaching", "Physiological Integrity", "MCQ", 3,
      `An RPN is providing medication teaching to a ${ds.age}-year-old patient prescribed ${ds.drug} for ${ds.condition}. The patient's current ${ds.vital}. Which teaching statement is correct?`,
      [O("A", ds.wrongTeaching1), O("B", ds.teaching), O("C", ds.wrongTeaching2), O("D", ds.wrongTeaching3)],
      ["B"], ds.correctExplanation, ds.teaching, "For medication teaching questions, identify the option that includes correct timing, administration, and realistic side effects/precautions",
      `${ds.wrongTeaching1} is a common misconception that could affect therapeutic outcomes`, { A: `${ds.wrongTeaching1} - this is incorrect and could reduce medication effectiveness or cause harm`, C: `${ds.wrongTeaching2} - this is dangerous advice that could have serious consequences`, D: `${ds.wrongTeaching3} - this is inaccurate and could lead to adverse outcomes` }, ds.tags
    ));
  }

  // Assessment - Body Systems
  const assessmentScenarios = [
    { system: "Respiratory", finding: "barrel chest, prolonged expiratory phase, pursed lip breathing, and use of accessory muscles", condition: "chronic obstructive pulmonary disease (COPD)", wrongCondition1: "pneumonia", wrongCondition2: "pulmonary embolism", wrongCondition3: "pleural effusion",
      rationale: "A barrel chest (increased anteroposterior diameter equal to the lateral diameter) develops over time in COPD patients due to chronic air trapping and hyperinflation of the lungs. The prolonged expiratory phase occurs because airflow obstruction makes it difficult to exhale completely. Pursed lip breathing is a compensatory mechanism that creates back-pressure to keep airways open during exhalation (acts as a natural PEEP). Use of accessory muscles (sternocleidomastoid, scalene, intercostal) indicates increased work of breathing. Pneumonia typically presents with fever, productive cough, and crackles rather than barrel chest. Pulmonary embolism presents acutely with sudden dyspnea, chest pain, and tachycardia. Pleural effusion presents with decreased breath sounds and dullness to percussion on the affected side.",
      dr: { A: "Pneumonia presents acutely with fever, cough, and localized crackles, not chronic findings like barrel chest", C: "Pulmonary embolism has an acute onset with sudden dyspnea and chest pain, not chronic respiratory changes", D: "Pleural effusion causes decreased breath sounds and dullness to percussion, not barrel chest or pursed lip breathing" } },
    { system: "Cardiovascular", finding: "jugular venous distension (JVD), bilateral crackles in the lung bases, peripheral pitting edema (3+), and weight gain of 2.5 kg in the past 3 days", condition: "right-sided heart failure with secondary left-sided congestion", wrongCondition1: "dehydration", wrongCondition2: "pneumonia", wrongCondition3: "renal calculi",
      rationale: "JVD, peripheral edema, and rapid weight gain are cardinal signs of fluid overload from heart failure. JVD indicates elevated central venous pressure from the heart's inability to effectively pump venous return. Bilateral crackles indicate pulmonary congestion from left-sided involvement. Peripheral pitting edema (3+ = 5-6 mm depression, 15-30 second rebound) results from fluid shifting into interstitial spaces due to elevated hydrostatic pressure. Weight gain of 2.5 kg over 3 days reflects fluid retention (1 kg ≈ 1 L of fluid). Heart failure patients should weigh themselves daily and report weight gain >1 kg/day or >2.5 kg/week. Dehydration would show opposite signs. Pneumonia does not cause JVD or peripheral edema. Renal calculi present with flank pain, not fluid overload symptoms.",
      dr: { A: "Dehydration presents with decreased skin turgor, dry mucous membranes, and weight LOSS, the opposite of these findings", C: "Pneumonia causes fever, productive cough, and localized crackles, not JVD or peripheral edema", D: "Renal calculi cause severe colicky flank pain and hematuria, not fluid overload signs" } },
    { system: "Neurological", finding: "unilateral facial droop on the right side, slurred speech, right arm weakness with pronator drift, and confusion with onset 45 minutes ago", condition: "acute ischemic stroke affecting the left cerebral hemisphere", wrongCondition1: "migraine headache", wrongCondition2: "hypoglycemia", wrongCondition3: "Bell palsy",
      rationale: "The FAST assessment (Face drooping, Arm weakness, Speech difficulty, Time to call emergency services) identifies this as an acute stroke. Unilateral symptoms affecting the RIGHT side of the body indicate LEFT hemisphere involvement (the brain controls the contralateral side). The left hemisphere is also dominant for speech in most people, explaining the slurred speech. Onset 45 minutes ago is critical information because tissue plasminogen activator (tPA/alteplase) can be administered within 4.5 hours of symptom onset for ischemic stroke. Time is brain: every minute of untreated large vessel occlusion results in approximately 1.9 million neurons dying. The RPN must immediately activate stroke protocols, note the exact time of symptom onset (the 'last known well' time), and facilitate rapid CT scan to differentiate ischemic from hemorrhagic stroke before tPA can be administered.",
      dr: { A: "Migraine may cause neurological aura but presents with severe headache and typically does not cause motor deficits or facial droop", C: "Hypoglycemia can cause confusion but is bilateral, does not cause unilateral facial droop or pronator drift, and resolves with glucose administration", D: "Bell palsy affects only the facial nerve (CN VII) causing facial weakness; it does not cause arm weakness, speech changes, or confusion" } },
    { system: "Gastrointestinal", finding: "rigid board-like abdomen, absent bowel sounds, severe diffuse abdominal pain that worsens with movement, rebound tenderness, and guarding", condition: "peritonitis requiring emergency surgical intervention", wrongCondition1: "gastroenteritis", wrongCondition2: "constipation", wrongCondition3: "irritable bowel syndrome",
      rationale: "A rigid board-like abdomen with absent bowel sounds, rebound tenderness, and guarding are hallmark signs of peritonitis (inflammation of the peritoneal lining). This is a surgical emergency. The rigidity results from involuntary contraction of the abdominal muscles in response to peritoneal irritation. Absent bowel sounds indicate paralytic ileus (the bowel stops moving in response to the peritoneal inflammation). Rebound tenderness (pain that worsens when pressure is released rather than applied) and voluntary/involuntary guarding are peritoneal signs. Common causes include perforated peptic ulcer, ruptured appendix, bowel perforation, and abdominal trauma. The patient requires immediate IV access, NPO status, broad-spectrum antibiotics, nasogastric tube placement for decompression, and emergency surgical consultation. Vital signs may show tachycardia, hypotension, and fever indicating sepsis.",
      dr: { A: "Gastroenteritis presents with hyperactive bowel sounds, cramping, diarrhea, and vomiting, not a rigid abdomen with absent bowel sounds", C: "Constipation causes hypoactive bowel sounds and a distended but not rigid abdomen", D: "Irritable bowel syndrome is a functional disorder with cramping and altered bowel habits, not an acute abdomen with peritoneal signs" } },
    { system: "Endocrine", finding: "extreme fatigue, cold intolerance, dry coarse skin, constipation, bradycardia (HR 52 bpm), weight gain of 7 kg over 3 months despite no dietary changes, facial puffiness, and non-pitting periorbital edema", condition: "hypothyroidism (myxedema)", wrongCondition1: "hyperthyroidism (Graves disease)", wrongCondition2: "Cushing syndrome", wrongCondition3: "type 2 diabetes mellitus",
      rationale: "These findings represent the classic presentation of hypothyroidism (decreased thyroid hormone production). Thyroid hormones regulate cellular metabolism; when deficient, ALL body systems slow down: decreased metabolic rate causes fatigue, cold intolerance, and weight gain; decreased GI motility causes constipation; decreased cardiac output causes bradycardia; decreased protein metabolism leads to accumulation of mucopolysaccharides in tissues causing non-pitting edema (myxedema), especially periorbital and facial puffiness, and dry, coarse skin. The non-pitting quality of the edema differentiates it from cardiac edema. Laboratory confirmation includes elevated TSH and low free T4. Treatment is levothyroxine replacement therapy, starting at a low dose and titrating slowly, especially in elderly patients or those with cardiac disease, to prevent cardiac complications from rapid metabolic changes.",
      dr: { A: "Hyperthyroidism presents with the OPPOSITE: heat intolerance, weight loss, tachycardia, diarrhea, and anxiety; these are easy to differentiate", C: "Cushing syndrome causes central obesity with moon face and buffalo hump, hypertension, and hyperglycemia, not the hypothyroid picture described", D: "Type 2 diabetes presents with polyuria, polydipsia, and polyphagia; while weight gain can occur, the other symptoms (bradycardia, cold intolerance, myxedema) point to thyroid dysfunction" } },
  ];

  for (const as of assessmentScenarios) {
    qs.push(rpn("Physical Assessment", `${as.system} Assessment`, "Physiological Integrity", "MCQ", 3,
      `An RPN performing a physical assessment documents the following findings: ${as.finding}. Which condition do these findings MOST likely indicate?`,
      [O("A", as.wrongCondition1), O("B", as.condition), O("C", as.wrongCondition2), O("D", as.wrongCondition3)],
      ["B"], as.rationale, `Key assessment findings for ${as.condition}: ${as.finding.substring(0, 80)}`,
      "Match the cluster of assessment findings to the condition; look for the option that explains ALL findings, not just one",
      `Do not focus on a single finding; consider the COMPLETE clinical picture to identify the correct condition`,
      as.dr, [`assessment`, `${as.system.toLowerCase()}`, `clinical-findings`, `physical-exam`]
    ));
  }

  // Lab Values Interpretation
  const labScenarios = [
    { lab: "hemoglobin", value: "68 g/L", normal: "120-160 g/L (female) or 140-180 g/L (male)", context: "3 days post-gastrectomy", priority: "Assess for signs of hemorrhage (tachycardia, hypotension, pallor, dizziness), check surgical drain output for blood, and notify the physician immediately for possible blood transfusion", wrong1: "Encourage increased oral fluid intake and recheck in 24 hours", wrong2: "Administer oral iron supplements and reassess in one week", wrong3: "Document the finding and continue routine monitoring",
      rationale: "A hemoglobin of 68 g/L is critically low (normal female: 120-160 g/L, male: 140-180 g/L) and represents severe anemia. In a post-gastrectomy patient, this suggests significant surgical bleeding. The patient is at risk for hypovolemic shock and tissue hypoxia. Immediate nursing actions include: assessing for signs of hemorrhage and shock (tachycardia, hypotension, tachypnea, pallor, cool clammy skin, decreased urine output), checking surgical drains and dressings for excessive blood loss, maintaining IV access with large-bore catheters, preparing for possible blood transfusion (type and crossmatch), and notifying the physician urgently. Blood transfusion is typically indicated when hemoglobin drops below 70 g/L in a symptomatic patient. Oral fluid intake and iron supplements are inappropriate interventions for acute severe anemia requiring immediate treatment." },
    { lab: "serum potassium", value: "6.2 mmol/L", normal: "3.5-5.0 mmol/L", context: "with chronic kidney disease and currently on spironolactone", priority: "Place the patient on continuous cardiac monitoring immediately, obtain a 12-lead ECG, and notify the physician urgently; anticipate orders for calcium gluconate, insulin with dextrose, and possible kayexalate", wrong1: "Encourage the patient to eat more potassium-rich foods like bananas", wrong2: "Administer a potassium supplement as scheduled", wrong3: "Recheck the potassium in the morning with routine blood work",
      rationale: "A serum potassium of 6.2 mmol/L is dangerously elevated (normal: 3.5-5.0 mmol/L) and constitutes a medical emergency due to the risk of fatal cardiac dysrhythmias. In this patient, hyperkalemia is multifactorial: CKD impairs renal potassium excretion, and spironolactone is a potassium-sparing diuretic that further elevates potassium levels. This combination is a well-known drug-disease interaction. ECG changes in hyperkalemia progress from peaked T waves (early) to prolonged PR interval, widened QRS complex, loss of P waves, and eventually sine wave pattern preceding cardiac arrest. Immediate interventions include: IV calcium gluconate to stabilize cardiac membranes, regular insulin 10 units with 50 mL of D50W to shift potassium intracellularly, sodium bicarbonate if acidotic, nebulized salbutamol, and sodium polystyrene sulfonate (Kayexalate) to remove potassium from the body. Encouraging potassium-rich foods or administering potassium supplements would be extremely dangerous." },
    { lab: "blood glucose", value: "2.1 mmol/L", normal: "3.9-6.1 mmol/L fasting", context: "with type 1 diabetes who received their morning insulin but has not eaten breakfast", priority: "Administer 15 g of fast-acting glucose immediately (3-4 glucose tablets or 125 mL fruit juice), recheck blood glucose in 15 minutes, and follow the hypoglycemia protocol", wrong1: "Administer the next scheduled insulin dose to maintain glycemic control", wrong2: "Give the patient a complex carbohydrate snack and recheck in 2 hours", wrong3: "Call the physician before taking any action",
      rationale: "A blood glucose of 2.1 mmol/L (37.8 mg/dL) represents severe hypoglycemia requiring immediate treatment. The patient received insulin but did not eat, creating a mismatch between insulin action and glucose availability. Severe hypoglycemia can rapidly progress to seizures, loss of consciousness, and death if untreated. The 'Rule of 15' guides treatment: give 15 g of fast-acting carbohydrate (glucose tablets, juice, regular soda), wait 15 minutes, recheck glucose; if still <4.0 mmol/L, repeat the treatment. Once glucose normalizes, the patient should eat a snack or meal containing protein and complex carbohydrates to prevent recurrence. Administering MORE insulin (option A) would be life-threatening. Complex carbohydrates (option B) take too long to raise blood glucose in an emergency. Waiting to call the physician (option D) delays critical treatment." },
    { lab: "INR", value: "5.8", normal: "2.0-3.0 for therapeutic anticoagulation", context: "on warfarin therapy who presents with gum bleeding and dark tarry stools", priority: "Hold warfarin immediately, notify the physician urgently, prepare for possible vitamin K (phytonadione) administration and possible fresh frozen plasma, and monitor closely for signs of further hemorrhage", wrong1: "Continue warfarin at the same dose and monitor the patient", wrong2: "Increase the warfarin dose to achieve better therapeutic control", wrong3: "Switch to subcutaneous heparin immediately without physician orders",
      rationale: "An INR of 5.8 is dangerously supratherapeutic (therapeutic range: 2.0-3.0 for most indications). Combined with signs of active bleeding (gum bleeding and melena/dark tarry stools indicating GI bleeding), this is a medical emergency. Melena indicates upper GI bleeding, where blood has been partially digested by gastric acid, turning it dark and tarry. The immediate priorities are: hold all anticoagulation therapy, protect the patient from falls or injury, notify the physician for orders regarding reversal agents (vitamin K 2.5-5 mg IV/oral for non-life-threatening bleeding; PCC or FFP for life-threatening hemorrhage), type and crossmatch for possible transfusion, monitor hemoglobin/hematocrit, and assess for signs of hypovolemic shock. The source of GI bleeding must be investigated (likely upper GI given melena). Continuing or increasing warfarin would be catastrophic." },
    { lab: "troponin I", value: "2.4 ng/mL", normal: "<0.04 ng/mL", context: "presenting with substernal chest pain radiating to the left arm for 2 hours", priority: "Activate cardiac emergency protocols (code STEMI if indicated), obtain 12-lead ECG immediately, administer aspirin 325 mg chewed, establish IV access, and prepare for cardiac catheterization", wrong1: "Administer antacids for possible gastric reflux and reassess pain in 30 minutes", wrong2: "Have the patient rest quietly and recheck troponin in 6 hours", wrong3: "Apply oxygen via nasal cannula at 6 L/min regardless of oxygen saturation",
      rationale: "A troponin I of 2.4 ng/mL is markedly elevated (normal <0.04 ng/mL, with >0.4 ng/mL highly suggestive of myocardial infarction) indicating significant myocardial cell death. Combined with the classic presentation (substernal chest pain radiating to the left arm for 2 hours), this indicates an acute myocardial infarction (AMI). Time is muscle: every minute of coronary occlusion results in progressive myocardial necrosis. Door-to-balloon time (for PCI) should be <90 minutes. Immediate interventions include: aspirin 325 mg chewed (not swallowed, for faster buccal absorption and antiplatelet effect), 12-lead ECG within 10 minutes, IV access with large-bore catheter, cardiac monitoring, morphine for pain if not relieved by nitroglycerin, and preparation for cardiac catheterization laboratory. Oxygen is given only if SpO2 <94% (current guidelines). Treating as reflux delays life-saving intervention. Waiting 6 hours wastes critical time." },
  ];

  for (const ls of labScenarios) {
    qs.push(rpn("Lab Interpretation", `${ls.lab} Interpretation`, "Physiological Integrity", "MCQ", 3,
      `An RPN reviews laboratory results for a patient ${ls.context}. The ${ls.lab} level is ${ls.value} (normal: ${ls.normal}). What is the RPN's priority action?`,
      [O("A", ls.wrong1), O("B", ls.priority), O("C", ls.wrong2), O("D", ls.wrong3)],
      ["B"], ls.rationale, `${ls.lab} ${ls.value} with ${ls.context.substring(0, 40)}: ${ls.priority.substring(0, 60)}`,
      "For critical lab values, the correct answer involves IMMEDIATE assessment, intervention, and physician notification",
      "Do not choose options that delay treatment (recheck later, continue monitoring) when lab values are critically abnormal",
      { A: `${ls.wrong1} - this is inappropriate given the critical nature of the lab value`, C: `${ls.wrong2} - this would worsen the patient's condition or delay critical treatment`, D: `${ls.wrong3} - this fails to address the urgency of the situation` },
      ["lab-interpretation", ls.lab.replace(/\s+/g, "-").toLowerCase(), "critical-values", "priority-action"]
    ));
  }

  // Priority / Delegation scenarios
  const priorityScenarios = [
    { scenario: "The RPN receives shift report on four patients. Which patient should the RPN assess FIRST?",
      correct: "A patient with type 1 diabetes whose blood glucose was 3.2 mmol/L 15 minutes ago and is now trembling and diaphoretic",
      wrong1: "A patient 2 days post-hip replacement who is requesting pain medication rated 5/10",
      wrong2: "A patient with pneumonia whose temperature is 38.1°C and is receiving IV antibiotics as scheduled",
      wrong3: "A patient awaiting discharge who needs teaching about new medications",
      rationale: "Using the ABCs and Maslow's hierarchy prioritization framework, the patient with severe hypoglycemia (3.2 mmol/L with worsening symptoms of trembling and diaphoresis) is the highest priority because hypoglycemia can rapidly progress to seizures, loss of consciousness, and death. This is an acute, life-threatening physiological emergency that requires immediate intervention (Rule of 15: 15 g fast-acting carbohydrate). The post-hip replacement patient's pain at 5/10 is important but not life-threatening. The pneumonia patient's mild fever with ongoing treatment is expected and being addressed. The discharge teaching patient has a stable condition with planned educational needs.",
      topic: "Priority Setting", subtopic: "Triage", tags: ["priority", "triage", "hypoglycemia", "assessment-first"] },
    { scenario: "During morning medication administration, the RPN is interrupted by four situations occurring simultaneously. Which situation requires the RPN's IMMEDIATE attention?",
      correct: "A patient on heparin infusion who reports a sudden severe headache and has blood on the pillowcase from epistaxis",
      wrong1: "A patient who is requesting their morning multivitamin tablet",
      wrong2: "A family member asking for an update on their loved one's condition",
      wrong3: "A patient whose IV infusion pump alarm is beeping for 'infusion complete'",
      rationale: "The patient on heparin with sudden severe headache and epistaxis shows signs of a potential serious bleeding complication, possibly including intracranial hemorrhage (severe headache is a red flag). Heparin anticoagulation increases bleeding risk, and uncontrolled bleeding can be life-threatening. The nurse must immediately stop the heparin infusion, assess neurological status, check vital signs, and notify the physician urgently. The multivitamin request and family update are non-urgent. The infusion pump alarm for 'complete' means the infusion has finished, which is not an emergency and can be addressed shortly.",
      topic: "Priority Setting", subtopic: "Interrupt Management", tags: ["priority", "heparin", "bleeding", "anticoagulation", "headache"] },
    { scenario: "An RPN is delegating tasks to an unregulated care provider (UCP/PSW). Which task is appropriate to delegate?",
      correct: "Assisting a stable patient with feeding, bathing, and ambulation to the washroom",
      wrong1: "Performing an initial assessment on a newly admitted patient",
      wrong2: "Administering a subcutaneous insulin injection to a diabetic patient",
      wrong3: "Evaluating a patient's response to a newly prescribed pain medication",
      rationale: "Activities of daily living (ADLs) such as feeding, bathing, toileting, and ambulation for STABLE patients are within the scope of an unregulated care provider (UCP/PSW). The five rights of delegation apply: right task (predictable, routine ADLs), right circumstance (patient is stable), right person (UCP is competent in ADLs), right direction/communication (clear instructions given), and right supervision (RPN maintains oversight). Initial assessment (option A) requires professional nursing judgment and cannot be delegated. Medication administration (option B) is within the RPN's scope and cannot be delegated to a UCP. Evaluating medication response (option D) requires clinical judgment and assessment skills that UCPs are not trained for.",
      topic: "Delegation & Scope", subtopic: "UCP Delegation", tags: ["delegation", "scope-of-practice", "UCP", "PSW", "ADLs"] },
  ];

  for (const ps of priorityScenarios) {
    qs.push(rpn(ps.topic, ps.subtopic, "Safe & Effective Care Environment", "priority", 3,
      ps.scenario,
      [O("A", ps.wrong1), O("B", ps.correct), O("C", ps.wrong2), O("D", ps.wrong3)],
      ["B"], ps.rationale,
      `Priority: address acute, life-threatening, or unstable conditions first; then urgent needs; then routine care`,
      "Prioritize using ABCs and Maslow's hierarchy: life-threatening conditions > acute changes > routine care > patient education/discharge",
      "Do not confuse urgency with importance; all patient needs are important, but acute safety threats take priority",
      { A: `${ps.wrong1.substring(0, 50)}... - this is important but not the most urgent`, C: `${ps.wrong2.substring(0, 50)}... - this can wait until the priority patient is stabilized`, D: `${ps.wrong3.substring(0, 50)}... - this is the lowest priority among the options` },
      ps.tags
    ));
  }

  // Nursing Process Scenarios
  const processScenarios = [
    { phase: "Assessment", stem: "An RPN admits a patient to the medical unit. Which action demonstrates the ASSESSMENT phase of the nursing process?",
      correct: "Collecting the patient's health history, performing a physical examination, and reviewing diagnostic test results",
      wrong1: "Identifying that the patient is at risk for falls based on the assessment data",
      wrong2: "Setting a goal that the patient will ambulate independently within 48 hours",
      wrong3: "Teaching the patient about fall prevention strategies",
      rationale: "The nursing process consists of five phases: Assessment (systematic collection of subjective and objective data), Diagnosis (analysis of data to identify actual or potential health problems), Planning (setting measurable goals and selecting interventions), Implementation (carrying out the planned interventions), and Evaluation (determining if goals were met and modifying the plan as needed). Data collection (health history, physical exam, lab review) is the defining activity of the Assessment phase. Identifying risk (option B) is Diagnosis. Setting goals (option C) is Planning. Teaching (option D) is Implementation.",
      tags: ["nursing-process", "assessment", "data-collection"] },
    { phase: "Evaluation", stem: "After implementing a pain management plan for a postoperative patient, the RPN checks the patient's pain level 30 minutes after administering an analgesic. The patient reports pain decreased from 8/10 to 3/10. This action represents which phase of the nursing process?",
      correct: "Evaluation",
      wrong1: "Assessment",
      wrong2: "Implementation",
      wrong3: "Planning",
      rationale: "Reassessing the patient's pain level after implementing an intervention (administering the analgesic) and comparing the outcome (pain decreased from 8/10 to 3/10) to the expected goal is the EVALUATION phase of the nursing process. While the nurse uses assessment skills (checking pain level), the PURPOSE of this reassessment is to determine the effectiveness of the intervention, which defines Evaluation. The key distinction is CONTEXT: an initial pain assessment = Assessment phase; a pain reassessment after intervention to judge effectiveness = Evaluation phase. This evaluation data may lead to maintaining, modifying, or terminating the pain management plan.",
      tags: ["nursing-process", "evaluation", "pain-management", "outcome-assessment"] },
  ];

  for (const ns of processScenarios) {
    qs.push(rpn("Nursing Process", ns.phase, "Safe & Effective Care Environment", "MCQ", 2,
      ns.stem,
      [O("A", ns.wrong1), O("B", ns.correct), O("C", ns.wrong2), O("D", ns.wrong3)],
      ["B"], ns.rationale,
      `${ns.phase} phase key identifier: ${ns.phase === "Assessment" ? "data collection (history, exam, labs)" : "comparing outcomes to goals after intervention"}`,
      "Identify the nursing process phase by asking: Am I collecting data? (Assessment), Analyzing data? (Diagnosis), Setting goals? (Planning), Doing interventions? (Implementation), or Checking outcomes? (Evaluation)",
      "Reassessment after intervention = Evaluation, not Assessment; the PURPOSE determines the phase, not the activity itself",
      { A: `${ns.wrong1} - this represents a different phase of the nursing process`, C: `${ns.wrong2} - this describes another phase's activities`, D: `${ns.wrong3} - this is a separate phase with different objectives` },
      ns.tags
    ));
  }

  // Cultural Safety (Canadian-specific)
  const culturalScenarios = [
    { context: "Indigenous patient care", stem: "An RPN is providing care to a First Nations patient who expresses a desire to have a traditional healer visit and perform a smudging ceremony in the hospital room. What is the MOST culturally safe response?",
      correct: "Advocate for the patient's request by contacting the hospital's Indigenous health services or spiritual care team to facilitate the ceremony in accordance with hospital policy",
      wrong1: "Inform the patient that cultural practices are not allowed in the hospital due to fire safety regulations",
      wrong2: "Suggest the patient wait until discharge to perform cultural ceremonies at home",
      wrong3: "Tell the patient that Western medicine is the standard of care in this hospital",
      rationale: "Cultural safety in Canadian healthcare requires recognizing and supporting Indigenous peoples' right to traditional healing practices as an integral part of their healthcare. The Truth and Reconciliation Commission (TRC) Calls to Action specifically address the need for culturally safe healthcare for Indigenous peoples. Many Canadian hospitals have developed policies and procedures to accommodate smudging ceremonies and traditional healing practices, including designated spaces, ventilation considerations, and protocols developed in collaboration with Indigenous Elders and communities. The RPN should act as a patient advocate by connecting the patient with available resources such as Indigenous health navigators, spiritual care teams, or Elder services. Denying the request outright violates cultural safety principles and may contribute to healthcare avoidance in Indigenous communities. Dismissing cultural practices or suggesting Western medicine is superior demonstrates cultural imposition and fails to provide patient-centred care.",
      tags: ["cultural-safety", "Indigenous", "First-Nations", "smudging", "TRC", "advocacy"] },
    { context: "Newcomer patient care", stem: "An RPN is caring for a recently arrived refugee patient who speaks limited English and appears anxious about receiving healthcare. The RPN cannot locate a professional medical interpreter. What is the MOST appropriate action?",
      correct: "Contact the language services department for telephone or video interpretation services, and use non-verbal communication and visual aids to provide comfort until an interpreter is available",
      wrong1: "Ask the patient's 12-year-old child who speaks English to interpret during the assessment",
      wrong2: "Speak loudly and slowly in English, assuming the patient will understand",
      wrong3: "Proceed with care without attempting to communicate since the treatment is standard",
      rationale: "Professional medical interpretation is essential for providing safe, informed healthcare to patients with limited English proficiency. Using children as interpreters is inappropriate because: (1) children lack medical vocabulary and understanding, (2) it reverses the parent-child power dynamic, (3) the child may censor or modify sensitive medical information, (4) it places an inappropriate burden on the child, and (5) it does not meet the standard for informed consent. Speaking loudly does not overcome a language barrier and can increase the patient's anxiety. Proceeding without communication violates the principles of informed consent and patient-centred care. Canadian healthcare facilities are required to provide language access services. While awaiting interpretation, the nurse should use visual aids, simple gestures, translation apps as supplementary tools, and demonstrate empathy through non-verbal communication (calm tone, appropriate touch, reassuring presence).",
      tags: ["cultural-safety", "interpretation", "newcomer", "refugee", "language-access", "communication"] },
  ];

  for (const cs of culturalScenarios) {
    qs.push(rpn("Cultural Safety", cs.context, "Psychosocial Integrity", "MCQ", 3,
      cs.stem,
      [O("A", cs.wrong1), O("B", cs.correct), O("C", cs.wrong2), O("D", cs.wrong3)],
      ["B"], cs.rationale, `Cultural safety: respect and advocate for patients' cultural practices and communication needs`,
      "Cultural safety questions: the correct answer respects the patient's culture and facilitates their needs within the healthcare system",
      "Cultural imposition (imposing one's own cultural values) and ethnocentrism are always incorrect nursing approaches",
      { A: `${cs.wrong1.substring(0, 60)}... - this dismisses the patient's cultural needs`, C: `${cs.wrong2.substring(0, 60)}... - this delays or denies appropriate cultural care`, D: `${cs.wrong3.substring(0, 60)}... - this demonstrates cultural insensitivity` },
      cs.tags
    ));
  }

  // More Clinical REx-PN scenarios
  const clinicalScenariosRPN = [
    { topic: "Diabetes Management", stem: "An RPN is teaching a patient with type 1 diabetes about sick day management. Which instruction is correct?",
      correct: "Continue taking insulin even when sick, monitor blood glucose every 2-4 hours, drink sugar-free fluids to prevent dehydration, and check urine or blood ketones regularly",
      wrong1: "Skip all insulin doses when you cannot eat regular meals to prevent hypoglycemia",
      wrong2: "Only check blood glucose twice per day as usual during illness",
      wrong3: "Take extra insulin before illness symptoms appear to prevent high blood sugar",
      rationale: "Sick day management for type 1 diabetes is critical because illness causes stress hormones (cortisol, epinephrine, glucagon) to rise, which increases blood glucose levels even if food intake is reduced. The key principles are: (1) NEVER stop insulin during illness - stopping insulin in type 1 diabetes can rapidly lead to diabetic ketoacidosis (DKA), which is life-threatening; (2) monitor blood glucose more frequently (every 2-4 hours) because illness causes unpredictable glucose fluctuations; (3) check ketones regularly (urine or blood) to detect DKA early; (4) maintain hydration with sugar-free fluids; (5) consume easily digestible carbohydrates if possible; (6) contact the healthcare provider if blood glucose remains above 14 mmol/L for more than 6 hours, if ketones are present, or if unable to keep fluids down. Skipping insulin (option A) is the most dangerous advice as it leads to DKA. Usual monitoring frequency (option B) is insufficient during illness. Taking extra insulin prophylactically (option D) without glucose monitoring guidance can cause severe hypoglycemia.",
      tags: ["diabetes", "sick-day-management", "type-1-diabetes", "DKA-prevention", "patient-education"], bs: "Endocrine" },
    { topic: "Respiratory Care", stem: "An RPN is caring for a patient with asthma who is prescribed both a salbutamol (Ventolin) metered-dose inhaler (MDI) and a fluticasone (Flovent) MDI. Which instruction about the correct order of administration is appropriate?",
      correct: "Use the salbutamol (bronchodilator) first to open the airways, wait 1-2 minutes, then use the fluticasone (corticosteroid) for the anti-inflammatory effect to penetrate deeper into open airways",
      wrong1: "Use the fluticasone first because corticosteroids are more important than bronchodilators",
      wrong2: "Use both inhalers at the same time to save time and get both medications simultaneously",
      wrong3: "Alternate days between the two inhalers, using salbutamol on odd days and fluticasone on even days",
      rationale: "When a patient has both a short-acting bronchodilator (salbutamol/Ventolin - a beta-2 agonist) and an inhaled corticosteroid (fluticasone/Flovent), the bronchodilator should be used FIRST. The rationale is pharmacological: the bronchodilator relaxes and opens the bronchial smooth muscle (bronchodilation), which then allows the subsequently administered corticosteroid to penetrate deeper into the airways for better anti-inflammatory effect. Additionally, the corticosteroid deposited on open airways provides more effective local anti-inflammatory action. Important teaching points include: rinse the mouth with water and spit after using the corticosteroid inhaler to prevent oral candidiasis (thrush) and systemic absorption; use a spacer device with MDIs to improve drug delivery; the bronchodilator provides quick relief (rescue) while the corticosteroid provides maintenance (controller) therapy. Alternating days (option D) is incorrect as the corticosteroid is a daily maintenance medication.",
      tags: ["respiratory", "asthma", "inhaler-technique", "bronchodilator", "corticosteroid", "MDI"], bs: "Respiratory" },
    { topic: "Post-Operative Care", stem: "An RPN is caring for a patient 6 hours after an appendectomy performed under general anesthesia. The patient has not voided since surgery. What is the RPN's priority assessment?",
      correct: "Palpate the suprapubic area for bladder distension, assess the time since last void, measure fluid intake, and implement non-invasive measures to promote voiding before considering catheterization",
      wrong1: "Insert a urinary catheter immediately without assessment since 6 hours without voiding post-surgery is automatic indication",
      wrong2: "Restrict fluid intake to reduce urinary output and prevent voiding difficulties",
      wrong3: "Assume the patient is dehydrated and increase IV fluids to maximum rate",
      rationale: "Postoperative urinary retention is common after general anesthesia because anesthetic agents and opioid analgesics suppress the micturition reflex and reduce detrusor muscle tone. The patient should void within 6-8 hours after surgery. The RPN should first ASSESS before intervening: (1) palpate the suprapubic area for bladder distension (a distended bladder will feel firm and rounded above the symphysis pubis), (2) use a bladder scanner if available to determine urine volume (catheterization is typically considered if >500-600 mL is retained), (3) try non-invasive interventions first: running water, warm water poured over perineum, ambulation to the bathroom, privacy, warm compresses to the lower abdomen. Straight catheterization may be necessary if non-invasive measures fail and the bladder is significantly distended. Immediate catheterization without assessment (option A) is not evidence-based practice and introduces unnecessary infection risk (CAUTI). Fluid restriction (option C) would worsen the problem. Maximizing IV fluids (option D) without assessment could contribute to fluid overload.",
      tags: ["postoperative", "urinary-retention", "assessment", "bladder", "anesthesia"], bs: "Renal/Urinary" },
    { topic: "Blood Transfusion", stem: "An RPN is monitoring a patient during a blood transfusion. Fifteen minutes into the transfusion, the patient reports chills, lower back pain, and chest tightness. The patient's temperature has increased from 37.0°C to 38.8°C. What is the RPN's FIRST action?",
      correct: "Stop the transfusion immediately, keep the IV line open with normal saline, and stay with the patient while another nurse notifies the physician and the blood bank",
      wrong1: "Slow the transfusion rate and administer acetaminophen for the fever",
      wrong2: "Continue the transfusion and monitor the patient more frequently, as mild reactions are expected",
      wrong3: "Disconnect the IV line completely, remove the blood product, and begin a new IV at a different site",
      rationale: "The symptoms described (chills, lower back pain, chest tightness, and fever rising 1.8°C from baseline) within 15 minutes of starting the transfusion are classic signs of an acute hemolytic transfusion reaction, the most severe and potentially fatal transfusion reaction. This occurs when ABO-incompatible blood is transfused, causing antibody-mediated destruction of donor red blood cells. The immediate nursing actions are: (1) STOP the transfusion immediately - every additional mL of incompatible blood worsens the reaction; (2) MAINTAIN IV patency with normal saline (0.9% NaCl) using new tubing - do not run normal saline through the blood tubing as it may push remaining blood into the patient; (3) STAY with the patient and assess vital signs; (4) NOTIFY the physician and blood bank immediately; (5) SAVE the blood bag and tubing for laboratory investigation; (6) OBTAIN blood and urine samples as ordered. Slowing the rate (option A) does not stop the antigen-antibody reaction. Continuing the transfusion (option B) is dangerous. Disconnecting the IV entirely (option D) eliminates venous access needed for emergency medications.",
      tags: ["blood-transfusion", "hemolytic-reaction", "transfusion-reaction", "emergency", "patient-safety"], bs: "Hematological" },
    { topic: "Skin Integrity", stem: "An RPN is assessing a patient on bed rest and identifies a stage 2 pressure injury on the sacrum. The wound bed appears pink/red with a shallow open area and no visible granulation tissue or slough. Which intervention is MOST appropriate?",
      correct: "Apply a moisture-retentive dressing (hydrocolloid or transparent film), reposition the patient every 2 hours, and implement pressure redistribution measures including specialty mattress and heel elevation",
      wrong1: "Apply a dry gauze dressing and tape securely to protect the wound from contamination",
      wrong2: "Massage the reddened area vigorously to improve blood circulation to the wound bed",
      wrong3: "Apply a heat lamp to the wound for 15 minutes every 4 hours to promote drying and healing",
      rationale: "A stage 2 pressure injury presents as a shallow, open ulcer with a red-pink wound bed, without slough or eschar. It may also appear as an intact or ruptured serum-filled blister. Treatment principles include: (1) MOISTURE-RETENTIVE DRESSINGS (hydrocolloid, transparent film, or hydrogel) promote moist wound healing, which is superior to dry wound healing for epithelial cell migration; (2) PRESSURE REDISTRIBUTION is essential - reposition every 2 hours using the 30-degree lateral position to avoid pressure on bony prominences, use specialty support surfaces (alternating pressure mattress, low air-loss), float heels off the bed surface; (3) NUTRITIONAL SUPPORT with adequate protein and calorie intake to support healing. Dry gauze (option A) promotes desiccation of the wound bed and delays healing. Massaging damaged tissue (option B) causes further tissue injury and capillary damage. Heat lamps (option D) cause tissue drying and are no longer recommended in evidence-based wound care.",
      tags: ["skin-integrity", "pressure-injury", "wound-care", "repositioning", "moisture-retentive"], bs: "Integumentary" },
  ];

  for (const cs of clinicalScenariosRPN) {
    qs.push(rpn(cs.topic, cs.topic, cs.bs || "Physiological Integrity", "MCQ", 3,
      cs.stem,
      [O("A", cs.wrong1), O("B", cs.correct), O("C", cs.wrong2), O("D", cs.wrong3)],
      ["B"], cs.rationale, `${cs.topic}: key principle from the correct answer`,
      "Select the answer that demonstrates systematic assessment before intervention, evidence-based practice, and patient safety",
      "Interventions that skip assessment, use outdated practices, or could worsen the patient's condition are typically incorrect",
      { A: `This option ${cs.wrong1.substring(0, 40)}... is inappropriate because it fails to follow evidence-based practice`, C: `This option could worsen the situation or delay appropriate care`, D: `This approach is outdated, unnecessary, or potentially harmful` },
      cs.tags
    ));
  }

  // Canadian-specific content: CPNRE/REx-PN blueprint categories
  const canadianSpecific = [
    { stem: "An RPN working in Ontario reviews the College of Nurses of Ontario (CNO) practice standards. Which document outlines the mandatory professional standards that guide all aspects of RPN practice?",
      correct: "The Professional Standards, Revised (CNO) which includes accountability, continuing competence, ethics, knowledge, and therapeutic nurse-client relationship",
      wrong1: "The Canadian Medical Association (CMA) Code of Ethics",
      wrong2: "The Personal Health Information Protection Act (PHIPA) alone",
      wrong3: "The hospital's employee handbook and human resources policies",
      rationale: "The College of Nurses of Ontario (CNO) publishes mandatory Professional Standards that all RPNs must meet. These standards include: (1) Accountability - taking responsibility for one's own actions and decisions; (2) Continuing Competence - maintaining and improving nursing knowledge and skills; (3) Ethics - practicing in accordance with the CNO Code of Conduct and ethical framework; (4) Knowledge - applying evidence-based knowledge to practice; (5) Knowledge Application - using critical thinking and clinical judgment; (6) Leadership - contributing to positive practice environments; (7) Therapeutic Nurse-Client Relationship - establishing and maintaining professional boundaries and therapeutic rapport. PHIPA governs privacy of health information but is only one aspect of professional practice. The CMA Code of Ethics applies to physicians, not nurses. Hospital policies provide institution-specific guidelines but do not replace regulatory standards.",
      tags: ["CNO", "professional-standards", "regulatory", "Ontario", "RPN-scope"], topic: "Professional Standards", sub: "CNO Standards" },
    { stem: "An RPN in British Columbia is caring for a patient who expresses suicidal ideation. Under the BC Mental Health Act, which action is the RPN's legal obligation?",
      correct: "Ensure the patient's immediate safety, stay with the patient, report to the charge nurse and physician immediately, initiate a risk assessment, and facilitate psychiatric evaluation for possible involuntary admission if the patient meets the criteria",
      wrong1: "Maintain confidentiality about the suicidal ideation as the patient requested",
      wrong2: "Discharge the patient and refer them to a community crisis line for follow-up",
      wrong3: "Contact the patient's family to inform them before doing anything else",
      rationale: "When a patient expresses suicidal ideation, the RPN has both professional and legal obligations to ensure patient safety. Under the BC Mental Health Act (and similar legislation in other provinces), a person who is at risk of harming themselves or others may be involuntarily detained for psychiatric assessment under specific criteria. The RPN must: (1) ensure IMMEDIATE SAFETY by staying with the patient, removing access to harmful items (sharps, medications, ligature points), and creating a safe environment; (2) REPORT immediately to the charge nurse and physician/psychiatrist; (3) conduct or facilitate a SUICIDE RISK ASSESSMENT (asking directly about suicidal thoughts, plans, means, and intent is evidence-based practice that does NOT increase suicide risk); (4) DOCUMENT findings and actions; (5) facilitate ongoing MONITORING per facility policy. Confidentiality (option A) does NOT apply when there is risk of harm to self or others - this is a legal exception to confidentiality. Discharging (option B) puts the patient at immediate risk. Contacting family first (option D) delays the priority of ensuring patient safety.",
      tags: ["mental-health", "suicidal-ideation", "Mental-Health-Act", "BC", "safety", "legal"], topic: "Mental Health", sub: "Crisis Intervention" },
    { stem: "An RPN is preparing to discharge a patient from hospital who requires ongoing wound care at home. Which Canadian community resource should the RPN arrange?",
      correct: "Home and Community Care Support Services (formerly CCAC/LHIN Home Care) for registered nursing visits to provide wound care in the patient's home",
      wrong1: "Emergency Medical Services (EMS) for daily wound care visits",
      wrong2: "The patient's family physician to perform daily wound dressing changes at the clinic",
      wrong3: "A private gym membership for rehabilitation services",
      rationale: "In Ontario and other Canadian provinces, Home and Community Care Support Services (the organization that replaced Community Care Access Centres/CCACs) coordinate publicly funded home care services. These services include registered nursing visits for wound care, IV therapy, medication administration, and other skilled nursing interventions that patients need after hospital discharge. The RPN should initiate the referral before discharge to ensure continuity of care. Home care nursing visits are covered under provincial health insurance plans (OHIP in Ontario) and do not require out-of-pocket payment. EMS (option A) is for emergency situations, not ongoing care. While the family physician (option B) manages the overall treatment plan, they do not typically perform daily wound care. Rehabilitation services (option C) are provided by physiotherapists through community or hospital-based programs, not gym memberships.",
      tags: ["community-resources", "home-care", "discharge-planning", "wound-care", "CCAC"], topic: "Community Health", sub: "Home Care Coordination" },
  ];

  for (const cs of canadianSpecific) {
    qs.push(rpn(cs.topic, cs.sub, "Safe & Effective Care Environment", "MCQ", 3,
      cs.stem,
      [O("A", cs.wrong1), O("B", cs.correct), O("C", cs.wrong2), O("D", cs.wrong3)],
      ["B"], cs.rationale, `Canadian-specific knowledge: ${cs.correct.substring(0, 60)}`,
      "For Canadian practice questions, know the provincial regulatory bodies, legislation, and publicly funded healthcare services",
      "Do not apply American healthcare system concepts (e.g., JCAHO, CMS) to Canadian practice questions",
      { A: `This option is incorrect for the Canadian healthcare context`, C: `This option does not align with standard Canadian healthcare practice or resources`, D: `This option is inappropriate or not a recognized healthcare resource` },
      cs.tags
    ));
  }

  // ===== NCLEX-PN (US) Questions =====

  const nclexPNscenarios = [
    { topic: "Physiological Integrity", sub: "Respiratory Care", stem: "An LPN is caring for a patient with a tracheostomy who requires suctioning. Which technique is correct?",
      correct: "Apply suction only during withdrawal of the catheter using intermittent suction for no more than 10-15 seconds per pass, and pre-oxygenate the patient before and after suctioning",
      wrong1: "Apply continuous suction during both insertion and withdrawal of the catheter for maximum secretion removal",
      wrong2: "Suction for 30-45 seconds per pass to ensure all secretions are removed thoroughly",
      wrong3: "Insert the suction catheter with suction applied to clear the airway immediately upon entering",
      rationale: "Proper tracheostomy suctioning technique is critical to prevent complications including hypoxemia, cardiac dysrhythmias, mucosal trauma, and vagal stimulation. The correct technique involves: (1) pre-oxygenate with 100% oxygen for 30 seconds to 1 minute to build an oxygen reserve and prevent hypoxemia during suctioning; (2) insert the catheter WITHOUT suction applied (applying suction during insertion can cause mucosal damage and grab tissue); (3) advance the catheter until resistance is met, then withdraw 1 cm; (4) apply INTERMITTENT suction only during WITHDRAWAL using a rotating/twisting motion to cover all surfaces; (5) limit each suction pass to 10-15 seconds maximum to prevent hypoxemia; (6) allow the patient to rest and re-oxygenate between passes; (7) limit to 3 suction passes per session; (8) use sterile technique with a new catheter for each suctioning session. Catheter size should be no more than half the internal diameter of the tracheostomy tube.", tags: ["respiratory", "tracheostomy", "suctioning", "airway-management"] },
    { topic: "Pharmacological Therapies", sub: "Insulin Administration", stem: "An LPN is preparing to administer insulin to a patient with type 1 diabetes. The physician has ordered both regular insulin (Humulin R) and NPH insulin (Humulin N) to be drawn up in the same syringe. Which action is correct?",
      correct: "Draw up the regular (clear) insulin first, then draw up the NPH (cloudy) insulin second to prevent contamination of the regular insulin vial with NPH",
      wrong1: "Draw up the NPH (cloudy) insulin first, then draw up the regular (clear) insulin",
      wrong2: "Mix the two insulins in a separate container before drawing them into the syringe",
      wrong3: "Draw up each insulin in a separate syringe because mixing insulins is never recommended",
      rationale: "When mixing insulin in one syringe, the cardinal rule is 'CLEAR BEFORE CLOUDY' - draw up the rapid/short-acting (clear) insulin FIRST, then the intermediate-acting (cloudy/NPH) insulin SECOND. The mnemonic 'RN' = Regular before NPH. The rationale is contamination prevention: if NPH (which contains protamine, a protein that creates the cloudy suspension and extends the insulin's duration of action) accidentally enters the regular insulin vial, it would change the onset and duration of the regular insulin for all future doses drawn from that vial. Regular insulin entering the NPH vial would have minimal effect. The preparation technique includes: (1) inject air into the NPH vial first (equal to the NPH dose), (2) inject air into the regular insulin vial (equal to the regular dose), (3) withdraw the regular (clear) insulin dose first, (4) then carefully withdraw the NPH (cloudy) insulin dose, (5) check total units equal the combined dose. Note: insulin glargine (Lantus) and insulin detemir (Levemir) should NEVER be mixed with any other insulin.", tags: ["diabetes", "insulin", "mixing-insulin", "medication-administration"] },
    { topic: "Safe & Effective Care Environment", sub: "Infection Prevention", stem: "An LPN is caring for a patient diagnosed with active pulmonary tuberculosis (TB). Which type of isolation precautions should be implemented?",
      correct: "Airborne precautions with a negative-pressure isolation room and N95 respirator or PAPR for all healthcare workers entering the room",
      wrong1: "Contact precautions with gown and gloves in a standard patient room",
      wrong2: "Droplet precautions with a surgical mask and private room",
      wrong3: "Standard precautions only, as TB is not transmitted through the air",
      rationale: "Active pulmonary tuberculosis (TB) is transmitted via airborne nuclei (droplet nuclei less than 5 micrometers in diameter) that remain suspended in the air for extended periods and can be inhaled by susceptible individuals. Airborne precautions are REQUIRED and include: (1) NEGATIVE-PRESSURE ISOLATION ROOM (also called airborne infection isolation room/AIIR) - the room maintains negative pressure relative to the hallway, with air exhausted directly outside or through HEPA filtration, and the door must remain closed; (2) N95 RESPIRATOR (not a surgical mask) must be worn by all personnel entering the room - N95 respirators filter at least 95% of airborne particles, including TB droplet nuclei; a powered air-purifying respirator (PAPR) is an alternative for staff who cannot be fit-tested for N95; (3) the patient should wear a surgical mask when transported outside the isolation room to reduce droplet generation; (4) visitors should be educated about respiratory protection. Contact precautions (option A) are for pathogens spread by direct or indirect contact (MRSA, C. diff). Droplet precautions (option B) are for larger droplets (influenza, meningococcal disease) and do not require negative pressure. Standard precautions alone (option D) are insufficient for TB.", tags: ["TB", "airborne-precautions", "N95", "infection-control", "isolation"] },
    { topic: "Physiological Integrity", sub: "Post-Operative Complications", stem: "An LPN is caring for a patient 2 days post-abdominal surgery who reports sudden sharp chest pain and dyspnea. The patient's vital signs show HR 118 bpm, RR 28 breaths/min, SpO2 88%, and temperature 37.2°C. Which complication should the LPN suspect?",
      correct: "Pulmonary embolism (PE) from a deep vein thrombosis, evidenced by sudden dyspnea, tachycardia, tachypnea, hypoxemia, and pleuritic chest pain in a post-surgical patient",
      wrong1: "Pneumothorax requiring immediate chest tube placement",
      wrong2: "Myocardial infarction requiring immediate cardiac catheterization",
      wrong3: "Post-operative atelectasis that will resolve on its own with coughing and deep breathing",
      rationale: "Pulmonary embolism (PE) is a potentially fatal complication of surgery, occurring when a thrombus (usually from the deep veins of the legs or pelvis) dislodges and travels to the pulmonary vasculature, obstructing blood flow. Post-surgical patients are at high risk for PE due to Virchow's triad: (1) venous stasis (immobility during and after surgery), (2) endothelial injury (surgical trauma), and (3) hypercoagulability (surgical stress response). Classic PE presentation includes SUDDEN onset of dyspnea, pleuritic chest pain (sharp pain that worsens with breathing), tachycardia, tachypnea, and hypoxemia. The LPN must immediately: notify the RN/physician urgently, administer oxygen, position the patient in high-Fowler's, obtain IV access, and prepare for diagnostic testing (CT pulmonary angiography is the gold standard, D-dimer may be used for screening). Treatment includes anticoagulation (heparin followed by warfarin or DOAC) and possible thrombolysis for massive PE. Prevention includes early ambulation, sequential compression devices (SCDs), low-molecular-weight heparin prophylaxis, and adequate hydration.", tags: ["postoperative", "PE", "pulmonary-embolism", "DVT", "emergency", "Virchow-triad"] },
    { topic: "Coordinated Care", sub: "Scope of Practice", stem: "An LPN/LVN is working with an RN and nursing assistant (CNA). A patient develops signs of respiratory distress with SpO2 of 85%. Which action demonstrates the LPN's correct role?",
      correct: "Initiate oxygen therapy per standing orders, position the patient in high-Fowler's, assess breath sounds, and notify the RN immediately for further evaluation and physician notification",
      wrong1: "Delegate the respiratory assessment to the CNA while the LPN documents the event",
      wrong2: "Wait for the RN to arrive before taking any action because respiratory distress is outside LPN scope",
      wrong3: "Administer bronchodilators and titrate oxygen independently without RN or physician notification",
      rationale: "In a respiratory emergency, the LPN/LVN has both the training and the obligation to initiate immediate stabilizing interventions within their scope of practice. This includes: applying supplemental oxygen (typically started at 2-4 L/min via nasal cannula or higher flow via mask depending on severity), positioning the patient in high-Fowler's position (45-90 degrees) to maximize lung expansion, performing a focused respiratory assessment (rate, depth, effort, breath sounds, accessory muscle use, color), and immediately communicating the situation to the RN for collaborative care. The LPN should NOT wait for the RN before initiating emergency oxygen therapy, as delay could result in respiratory arrest. Delegating respiratory assessment to a CNA (option A) is inappropriate because respiratory assessment requires licensed nursing judgment. Waiting passively (option B) could endanger the patient. Independently titrating medications and oxygen without notification (option D) exceeds the LPN's scope in most states and fails to engage necessary team members.", tags: ["scope-of-practice", "respiratory-distress", "teamwork", "emergency", "LPN-role"] },
    { topic: "Health Promotion & Maintenance", sub: "Prenatal Education", stem: "An LPN is providing prenatal education to a first-time mother at 28 weeks gestation. The patient asks about warning signs that require immediate medical attention. Which response is correct?",
      correct: "Go to the hospital immediately if you experience: vaginal bleeding, severe headache with visual changes, decreased fetal movement, regular contractions before 37 weeks, sudden swelling of face or hands, or rupture of membranes",
      wrong1: "Mild back pain, occasional heartburn, and moderate ankle swelling are reasons to go to the emergency room",
      wrong2: "Only go to the hospital when contractions are 2 minutes apart regardless of gestational age",
      wrong3: "Call your physician during regular office hours if you notice any changes in your condition",
      rationale: "Pregnant patients must be educated to recognize danger signs that require IMMEDIATE medical evaluation: (1) VAGINAL BLEEDING - may indicate placenta previa, placental abruption, or preterm labor; (2) SEVERE HEADACHE WITH VISUAL CHANGES (scotomata, blurred vision) - may indicate preeclampsia with severe features or eclampsia risk; (3) DECREASED FETAL MOVEMENT - may indicate fetal distress; the patient should perform kick counts (10 movements in 2 hours); (4) REGULAR CONTRACTIONS BEFORE 37 WEEKS - may indicate preterm labor; (5) SUDDEN SWELLING OF FACE/HANDS - may indicate preeclampsia (different from normal ankle edema); (6) RUPTURE OF MEMBRANES (fluid gushing or leaking from vagina) - requires evaluation for preterm premature rupture of membranes (PPROM) and risk of cord prolapse and infection. Mild back pain, heartburn, and moderate ankle swelling (option A) are common pregnancy discomforts, not emergencies. Waiting until contractions are 2 minutes apart (option B) at 28 weeks would miss preterm labor. Calling during office hours only (option C) delays care for potentially life-threatening complications.", tags: ["prenatal", "pregnancy", "danger-signs", "patient-education", "maternal-health"] },
    { topic: "Psychosocial Integrity", sub: "Substance Abuse", stem: "An LPN is caring for a patient admitted for alcohol withdrawal who began experiencing symptoms 48 hours after the last drink. The patient exhibits visual hallucinations, severe tremors, diaphoresis, tachycardia (HR 126 bpm), and fever (39.4°C). What is this condition?",
      correct: "Delirium tremens (DT), a life-threatening alcohol withdrawal syndrome requiring immediate medical intervention including IV benzodiazepines, fluid resuscitation, and continuous monitoring",
      wrong1: "A minor anxiety reaction to hospitalization that will resolve on its own",
      wrong2: "Alcohol intoxication requiring observation until the patient sobers up",
      wrong3: "Schizophrenia with new-onset psychotic features",
      rationale: "Delirium tremens (DT) is the most severe and potentially fatal form of alcohol withdrawal, occurring typically 48-72 hours after the last drink (but can occur up to 5 days later). It has a mortality rate of 5-15% without treatment. The hallmark features include: severe autonomic hyperactivity (tachycardia, hypertension, diaphoresis, hyperthermia), altered mental status (confusion, disorientation, agitation), visual and tactile hallucinations, severe tremors, and seizure risk. DT occurs because chronic alcohol consumption enhances inhibitory GABA neurotransmission and suppresses excitatory glutamate (NMDA) activity. When alcohol is suddenly removed, the brain becomes hyperexcitable. Treatment is MEDICAL EMERGENCY: IV benzodiazepines (lorazepam, diazepam, or chlordiazepoxide) are the mainstay treatment, titrated using a symptom-triggered protocol (CIWA-Ar scale); aggressive IV fluid and electrolyte replacement (thiamine BEFORE glucose to prevent Wernicke encephalopathy); continuous cardiac and neurological monitoring in ICU setting; seizure precautions; and nutritional support. This is NOT a minor anxiety reaction, alcohol intoxication (the patient is IN withdrawal), or schizophrenia (the hallucinations are specific to withdrawal context).", tags: ["substance-abuse", "alcohol-withdrawal", "delirium-tremens", "emergency", "benzodiazepines"] },
    { topic: "Physiological Integrity", sub: "Renal Assessment", stem: "An LPN is monitoring a patient with acute kidney injury (AKI). Which laboratory finding is MOST consistent with AKI?",
      correct: "Elevated serum creatinine (from 1.0 mg/dL to 2.8 mg/dL over 48 hours), elevated BUN, decreased urine output (<0.5 mL/kg/hour for >6 hours), and hyperkalemia",
      wrong1: "Decreased serum creatinine, low BUN, and increased urine output with dilute urine",
      wrong2: "Normal creatinine with positive urine culture and pyuria",
      wrong3: "Low serum potassium with metabolic alkalosis and excessive thirst",
      rationale: "Acute kidney injury (AKI) is characterized by a rapid decline in kidney function over hours to days, resulting in the inability to filter waste products and regulate fluid/electrolyte balance. The KDIGO criteria define AKI as: increase in serum creatinine by ≥0.3 mg/dL within 48 hours, OR increase to ≥1.5x baseline within 7 days, OR urine output <0.5 mL/kg/hour for ≥6 hours. In this case, creatinine nearly tripled from 1.0 to 2.8 mg/dL in 48 hours, indicating severe AKI. Associated laboratory findings include: elevated BUN (the kidneys cannot excrete urea), hyperkalemia (impaired renal potassium excretion - this is the most dangerous electrolyte abnormality as it can cause fatal cardiac dysrhythmias), metabolic acidosis (impaired hydrogen ion excretion), hyperphosphatemia, and hypocalcemia. Oliguria (<400 mL/day or <0.5 mL/kg/hour) is common but not always present (non-oliguric AKI can occur). The LPN should strictly monitor I&O, report decreasing urine output, monitor potassium levels, assess for fluid overload signs, and report abnormal lab values immediately.", tags: ["renal", "AKI", "creatinine", "lab-values", "electrolytes", "oliguria"] },
  ];

  for (const sc of nclexPNscenarios) {
    qs.push(pn(sc.topic, sc.sub, "Physiological Integrity", "MCQ", 3,
      sc.stem,
      [O("A", sc.wrong1), O("B", sc.correct), O("C", sc.wrong2), O("D", sc.wrong3)],
      ["B"], sc.rationale, `${sc.sub}: key concept from the correct answer`,
      "Select the answer that demonstrates evidence-based practice, proper technique, and patient safety priorities",
      "Avoid answers that describe outdated practices, skip assessment steps, or could harm the patient",
      { A: "This option describes an incorrect or dangerous approach", C: "This option is inaccurate or inappropriate for the situation described", D: "This option fails to meet the standard of care" },
      sc.tags
    ));
  }

  // ===== NCLEX-RN Questions =====

  const nclexRNscenarios = [
    { topic: "Critical Care", sub: "Hemodynamic Monitoring", stem: "An RN is interpreting hemodynamic values for a patient in the ICU with a pulmonary artery catheter. The readings show: CVP 18 mmHg (normal 2-6), PAP 48/26 mmHg (normal 20-30/8-15), PCWP 24 mmHg (normal 4-12), CI 1.8 L/min/m2 (normal 2.5-4.0), SVR 2100 dynes/sec/cm-5 (normal 900-1400). Which condition do these values indicate?",
      correct: "Cardiogenic shock with left ventricular failure: elevated filling pressures (CVP, PAP, PCWP), decreased cardiac index, and compensatory elevated systemic vascular resistance",
      wrong1: "Hypovolemic shock with fluid deficit requiring aggressive volume resuscitation",
      wrong2: "Septic shock with vasodilation and distributive circulatory failure",
      wrong3: "Normal hemodynamic values in a critically ill patient",
      rationale: "The hemodynamic profile clearly indicates cardiogenic shock from left ventricular failure. The interpretation: Elevated CVP (18, normal 2-6) = elevated right-sided filling pressures indicating volume backup. Elevated PAP (48/26) and PCWP (24, normal 4-12) = elevated left-sided filling pressures indicating the left ventricle cannot effectively pump blood forward, causing backup into the pulmonary vasculature. This elevated PCWP also leads to pulmonary edema when >18 mmHg. Decreased CI (1.8, normal 2.5-4.0) = the heart is not generating adequate cardiac output for the patient's body size. Elevated SVR (2100, normal 900-1400) = compensatory vasoconstriction as the body attempts to maintain blood pressure despite low cardiac output (through sympathetic nervous system activation). Treatment includes: inotropic support (dobutamine to strengthen cardiac contraction), vasodilators (nitroglycerin, nitroprusside) to reduce preload and afterload, diuretics (furosemide) to reduce volume overload, and intra-aortic balloon pump (IABP) if medications are insufficient. Hypovolemic shock would show LOW filling pressures (low CVP, low PCWP). Septic shock would show LOW SVR (vasodilation) with HIGH cardiac output initially.", tags: ["critical-care", "hemodynamics", "cardiogenic-shock", "PAC", "PCWP", "cardiac-index"] },
    { topic: "Critical Care", sub: "Ventilator Management", stem: "An RN is caring for a patient on mechanical ventilation. The high-pressure alarm sounds. Which assessment finding would the RN expect?",
      correct: "Increased airway resistance from mucus plugging, bronchospasm, biting the endotracheal tube, patient-ventilator dyssynchrony, or kinking of the ventilator tubing",
      wrong1: "Disconnection of the ventilator circuit from the endotracheal tube",
      wrong2: "A deflated endotracheal tube cuff allowing air leak around the tube",
      wrong3: "The patient is breathing spontaneously and the ventilator rate is too low",
      rationale: "The HIGH-PRESSURE alarm on a mechanical ventilator indicates that the pressure needed to deliver the set tidal volume has exceeded the set limit. This occurs when resistance to airflow INCREASES or lung compliance DECREASES. Common causes include: (1) MUCUS PLUGGING - secretions in the airway or ET tube increase resistance; (2) BRONCHOSPASM - airway constriction increases resistance; (3) BITING the ET tube - the patient's teeth compress the tube, increasing resistance; (4) PATIENT-VENTILATOR DYSSYNCHRONY (fighting/bucking the ventilator) - the patient's respiratory effort opposes the machine; (5) KINKING of ventilator tubing or ET tube position change; (6) DECREASED COMPLIANCE from pneumothorax, pulmonary edema, ARDS, or atelectasis; (7) PATIENT COUGHING. The nurse should assess systematically: suction the airway, check tubing for kinks, assess lung sounds, check ET tube position, assess the patient's breathing pattern, and consider sedation if fighting the ventilator. LOW-PRESSURE alarms (options B, C) indicate air LEAK or disconnection (decreased pressure in the circuit). Disconnection and cuff leak cause LOW-pressure alarms, not high-pressure.", tags: ["critical-care", "ventilator", "high-pressure-alarm", "airway-management", "respiratory-failure"] },
    { topic: "Leadership & Management", sub: "Charge Nurse Role", stem: "An RN charge nurse receives report on four patients. A new graduate RN, an experienced RN, and an LPN are available for assignment. Which patient assignment is MOST appropriate?",
      correct: "Assign the new graduate RN to the patient with a stable post-op day 2 cholecystectomy awaiting discharge, the experienced RN to the patient with chest pain and troponin pending with continuous cardiac monitoring, and the LPN to the patient with a chronic wound requiring dressing changes per protocol",
      wrong1: "Assign the new graduate RN to the chest pain patient because it will be a good learning experience",
      wrong2: "Assign the LPN to the patient requiring blood transfusion and the new graduate RN to perform the initial admission assessment",
      wrong3: "Assign all complex patients to the experienced RN to avoid any complications",
      rationale: "Safe patient assignment considers the competency of each team member, patient acuity, and scope of practice. (1) The NEW GRADUATE RN should receive stable, predictable patients to build competence safely. A stable post-op day 2 patient awaiting discharge is appropriate - the condition is stable, interventions are routine, and discharge teaching allows the new nurse to practice patient education. (2) The EXPERIENCED RN should receive the highest acuity patient - the chest pain patient with pending troponin and cardiac monitoring requires experienced clinical judgment to recognize subtle changes, interpret cardiac rhythms, and respond to potential MI. (3) The LPN receives a patient requiring skills within their scope - wound care using established protocols is appropriate for LPN practice. Blood transfusion (option B) is typically an RN-only task in most jurisdictions. Initial admission assessment (option B) requires comprehensive RN-level assessment. Overloading the experienced RN (option D) leads to burnout and unsafe patient ratios.", tags: ["leadership", "patient-assignment", "delegation", "charge-nurse", "new-graduate", "scope-of-practice"] },
    { topic: "Obstetric Nursing", sub: "Fetal Heart Rate Monitoring", stem: "An RN is interpreting electronic fetal heart rate (FHR) monitoring for a patient in active labor. The tracing shows a baseline FHR of 145 bpm with moderate variability, two accelerations in 20 minutes, and no decelerations. How should the RN interpret this tracing?",
      correct: "Category I (normal): reassuring tracing with normal baseline, moderate variability, and reactive accelerations indicating fetal well-being; continue routine monitoring",
      wrong1: "Category III (abnormal): this tracing requires immediate delivery by emergency cesarean section",
      wrong2: "Category II (indeterminate): this tracing requires additional testing and continuous monitoring with possible intervention",
      wrong3: "The tracing is uninterpretable and requires the fetal scalp electrode for accurate monitoring",
      rationale: "The National Institute of Child Health and Human Development (NICHD) three-tier classification system categorizes FHR tracings as: CATEGORY I (Normal/Reassuring): normal baseline (110-160 bpm) + moderate variability (6-25 bpm) + accelerations may or may not be present + no late or variable decelerations. This tracing meets ALL Category I criteria: baseline 145 bpm (normal), moderate variability (present), accelerations present (reactive), and no decelerations. Category I tracings indicate fetal well-being and require only routine monitoring. CATEGORY II (Indeterminate): any tracing not meeting Category I or III criteria; requires continued monitoring and additional assessment. CATEGORY III (Abnormal): absent variability WITH recurrent late decelerations, recurrent variable decelerations, or bradycardia; OR sinusoidal pattern. Category III requires immediate evaluation and intervention, potentially including emergency delivery. The presence of moderate variability is the MOST important indicator of fetal oxygenation and neurological integrity, as it reflects an intact autonomic nervous system.", tags: ["obstetric", "fetal-monitoring", "FHR", "Category-I", "labor-and-delivery"] },
    { topic: "Pediatric Nursing", sub: "Pediatric Assessment", stem: "An RN is assessing a 2-year-old child brought to the emergency department. The child is listless, has a bulging anterior fontanelle, sunset eyes (sclera visible above the iris), a high-pitched cry, and vomiting. Which condition should the RN suspect?",
      correct: "Increased intracranial pressure (ICP), possibly from meningitis, hydrocephalus, or head trauma; notify the physician immediately and prepare for neurological emergency management",
      wrong1: "Normal developmental findings for a 2-year-old who is tired and cranky",
      wrong2: "Gastroesophageal reflux disease (GERD) requiring feeding modification",
      wrong3: "Iron deficiency anemia requiring blood work and iron supplementation",
      rationale: "The combination of a bulging anterior fontanelle, sunset eyes (eyes deviated downward with sclera visible above the iris, also called 'setting sun sign'), high-pitched cry, listlessness, and vomiting are CLASSIC signs of increased intracranial pressure (ICP) in an infant/toddler. While the anterior fontanelle typically closes by 18 months, in some children it may remain open slightly longer, and in the context of increased ICP, it becomes tense and bulging as cerebrospinal fluid pressure increases within the closed cranium. Sunset eyes occur because increased pressure on the midbrain tectum affects the vertical gaze centers. The high-pitched cry results from meningeal irritation. Causes include bacterial meningitis (medical emergency), hydrocephalus (obstruction of CSF drainage), intracranial hemorrhage, and tumors. The RN must: elevate the head of bed 30 degrees, maintain a quiet environment (reduce stimulation that could increase ICP), monitor neurological status closely (level of consciousness, pupil size and reactivity, vital signs for Cushing's triad: hypertension, bradycardia, irregular respirations which indicate brain herniation), establish IV access, and prepare for CT scan and lumbar puncture (if meningitis is suspected and no signs of herniation are present).", tags: ["pediatric", "increased-ICP", "fontanelle", "sunset-eyes", "neurological-emergency"] },
    { topic: "Pharmacology", sub: "Vasopressor Administration", stem: "An RN is administering norepinephrine (Levophed) via a peripheral IV to a patient in septic shock. During the infusion, the RN notices the IV site is pale, cool, and firm. What is the RN's immediate action?",
      correct: "Stop the infusion immediately, keep the IV catheter in place, and notify the physician; prepare for possible phentolamine (Regitine) infiltration around the IV site to counteract the vasoconstrictive tissue damage",
      wrong1: "Continue the infusion at a lower rate and apply warm compresses to the site",
      wrong2: "Increase the infusion rate to ensure the medication reaches the central circulation",
      wrong3: "Remove the IV catheter, apply pressure to the site, and restart the infusion at the same site",
      rationale: "The pale, cool, and firm IV site indicates extravasation (infiltration) of norepinephrine, a potent alpha-adrenergic vasopressor. When norepinephrine extravasates into surrounding tissue, its powerful vasoconstrictive effects cause local ischemia that can progress to tissue necrosis and gangrene if not treated promptly. The immediate management includes: (1) STOP the infusion - every additional drop of extravasated vasopressor worsens tissue damage; (2) KEEP the IV catheter in place initially for possible antidote administration; (3) NOTIFY the physician immediately; (4) PREPARE PHENTOLAMINE (Regitine) - this is an alpha-adrenergic ANTAGONIST that directly reverses the vasoconstrictive effects of norepinephrine; it is injected subcutaneously around the extravasation site in 5-10 mg doses diluted in 10-15 mL normal saline using a fine-gauge needle; (5) ideally, vasopressors should be administered through a CENTRAL line to prevent this complication; (6) DOCUMENT the incident thoroughly including the appearance of the site and all interventions. Continuing the infusion (option A) causes further tissue destruction. Increasing the rate (option B) worsens the extravasation. Removing the catheter (option C) eliminates the access for antidote delivery.", tags: ["pharmacology", "vasopressor", "norepinephrine", "extravasation", "phentolamine", "IV-safety"] },
    { topic: "Endocrine", sub: "Thyroid Storm", stem: "An RN is caring for a patient with Graves disease who undergoes an emergency appendectomy. Postoperatively, the patient develops a temperature of 40.5°C (104.9°F), heart rate of 168 bpm, extreme agitation, and systolic blood pressure of 200 mmHg. What complication should the RN suspect?",
      correct: "Thyroid storm (thyrotoxic crisis), a life-threatening emergency triggered by the surgical stress in a patient with uncontrolled hyperthyroidism, requiring immediate treatment with beta-blockers, antithyroid medications, corticosteroids, and cooling measures",
      wrong1: "Malignant hyperthermia from anesthetic agents requiring dantrolene",
      wrong2: "Postoperative wound infection causing sepsis",
      wrong3: "Normal postoperative stress response that will resolve within 24 hours",
      rationale: "Thyroid storm (thyrotoxic crisis) is a rare but life-threatening endocrine emergency characterized by extreme exaggeration of hyperthyroid symptoms. It is most commonly precipitated by physiological stress (surgery, trauma, infection, DKA) in patients with poorly controlled or undiagnosed hyperthyroidism. Clinical features include: EXTREME HYPERTHERMIA (temperature >40°C/104°F - the most distinguishing feature), severe tachycardia (often >140 bpm, may progress to atrial fibrillation or heart failure), HYPERTENSION (widened pulse pressure initially, progressing to cardiovascular collapse), ALTERED MENTAL STATUS (extreme agitation, delirium, psychosis, progressing to coma), GI symptoms (nausea, vomiting, diarrhea), and DIAPHORESIS. Treatment is MULTI-MODAL and IMMEDIATE: (1) BETA-BLOCKERS (propranolol) to control heart rate and block peripheral conversion of T4 to T3; (2) ANTITHYROID medications (propylthiouracil or methimazole) to block new thyroid hormone synthesis; (3) IODINE SOLUTION (Lugol's or potassium iodide) given 1 hour AFTER antithyroid medication to block thyroid hormone release; (4) CORTICOSTEROIDS (hydrocortisone or dexamethasone) to block T4-to-T3 conversion and prevent relative adrenal insufficiency; (5) COOLING MEASURES (cooling blankets, acetaminophen - NOT aspirin which displaces thyroid hormone from binding proteins). While malignant hyperthermia (option A) should be considered in the differential, it typically occurs during anesthesia induction, not postoperatively, and the patient's history of Graves disease makes thyroid storm more likely.", tags: ["endocrine", "thyroid-storm", "Graves-disease", "emergency", "hyperthyroidism", "postoperative"] },
    { topic: "Neurology", sub: "Stroke Management", stem: "An RN receives a patient in the emergency department with acute left-sided weakness, slurred speech, and right gaze preference, with symptom onset 2 hours ago. CT scan shows no hemorrhage. The patient's blood pressure is 186/104 mmHg. What is the priority intervention?",
      correct: "Prepare for IV alteplase (tPA) administration within the 4.5-hour window while maintaining the blood pressure below 185/110 mmHg per protocol, ensuring two large-bore IVs, obtaining baseline labs, and calculating the weight-based dose (0.9 mg/kg, max 90 mg)",
      wrong1: "Administer aspirin 325 mg immediately and schedule an MRI for tomorrow morning",
      wrong2: "Aggressively lower the blood pressure to below 120/80 mmHg to prevent further brain damage",
      wrong3: "Start a heparin drip immediately and consult neurosurgery for craniotomy",
      rationale: "This patient presents with acute ischemic stroke within the tPA (alteplase) treatment window of 4.5 hours from symptom onset. The CT showing no hemorrhage clears the patient for thrombolytic therapy. tPA is the only FDA-approved treatment for acute ischemic stroke and works by converting plasminogen to plasmin, which dissolves the fibrin clot obstructing cerebral blood flow. Time-critical steps include: (1) BP MANAGEMENT: before tPA, blood pressure must be maintained below 185/110 mmHg (use IV labetalol or nicardipine); after tPA, maintain below 180/105 mmHg for 24 hours. The current BP of 186/104 needs mild reduction. (2) DOSE CALCULATION: 0.9 mg/kg (maximum 90 mg total), with 10% given as IV bolus over 1 minute and the remaining 90% infused over 60 minutes. (3) MONITORING: neurological checks every 15 minutes during infusion, then every 30 minutes for 6 hours, then hourly for 24 hours. (4) NO anticoagulants or antiplatelets for 24 hours after tPA. Aspirin (option A) should not be given until 24 hours post-tPA. Aggressive BP lowering (option B) to normal levels can worsen ischemia by reducing perfusion to the penumbra. Heparin (option C) is not indicated for acute stroke treatment and would increase hemorrhagic risk.", tags: ["neurology", "stroke", "tPA", "alteplase", "thrombolytic", "emergency", "blood-pressure"] },
    { topic: "Renal", sub: "Dialysis Nursing", stem: "An RN is caring for a patient who receives hemodialysis three times per week through a left arteriovenous (AV) fistula. Which nursing action is correct?",
      correct: "Assess the fistula at least every shift for a palpable thrill and audible bruit; never use the fistula arm for blood pressure measurements, venipuncture, or IV access; elevate the arm to reduce swelling",
      wrong1: "Use the AV fistula arm preferentially for blood pressure measurement since the increased blood flow provides more accurate readings",
      wrong2: "Apply tight bandages or restrictive clothing to the fistula arm to protect it from accidental damage",
      wrong3: "Routinely clamp the fistula between dialysis sessions to preserve its lifespan",
      rationale: "An arteriovenous (AV) fistula is a surgically created connection between an artery and a vein (typically in the forearm or upper arm) that provides vascular access for hemodialysis. The arterial blood flow 'arterializes' the vein, making it larger, stronger, and able to withstand repeated needle punctures. Essential nursing care for AV fistulas includes: (1) ASSESS every shift for a thrill (palpable vibration/buzzing felt over the fistula) and bruit (audible whooshing sound heard with a stethoscope) - these indicate patency and blood flow; absence suggests thrombosis, a medical emergency; (2) NEVER use the fistula arm for blood pressure measurement (compression can damage the fistula), venipuncture, or IV access; (3) NEVER apply restrictive items (tight clothing, blood pressure cuffs, watches, tight bandages) to the arm; (4) EDUCATE the patient to avoid sleeping on the fistula arm, carrying heavy objects, or allowing anyone to draw blood from that arm; (5) monitor for signs of infection, aneurysm, and steal syndrome (ischemia of the hand distal to the fistula). The fistula must remain open continuously between dialysis sessions; clamping would cause thrombosis.", tags: ["renal", "hemodialysis", "AV-fistula", "vascular-access", "patient-education"] },
    { topic: "Respiratory", sub: "Chest Tube Management", stem: "An RN is caring for a patient with a chest tube connected to a water-seal drainage system following a thoracotomy. The nurse observes continuous bubbling in the water-seal chamber. What does this finding indicate?",
      correct: "An air leak in the system: assess all connections for tightness, check the insertion site dressing for occlusion, and if connections are secure, notify the physician as the air leak may be from the patient's lung (bronchopleural fistula)",
      wrong1: "Normal functioning of the chest tube system; the bubbling indicates effective drainage",
      wrong2: "The suction is set too high and should be decreased immediately to stop the bubbling",
      wrong3: "The patient's lung is fully re-expanded and the chest tube can be removed",
      rationale: "Continuous bubbling in the WATER-SEAL chamber indicates an air leak in the system. Understanding the three-chamber chest drainage system is essential: (1) COLLECTION CHAMBER - collects fluid drainage; (2) WATER-SEAL CHAMBER - acts as a one-way valve allowing air to exit the pleural space but preventing re-entry; normal finding is TIDALING (fluid level rises on inspiration and falls on expiration in spontaneously breathing patients); intermittent bubbling during forced expiration or coughing is normal, but CONTINUOUS bubbling indicates an air leak; (3) SUCTION CONTROL CHAMBER - gentle continuous bubbling here IS normal and indicates correct suction. To troubleshoot CONTINUOUS bubbling in the water-seal chamber: (1) check all tubing connections for tightness (most common cause of external air leak); (2) examine the tubing for cracks or holes; (3) check the insertion site dressing for adequate seal; (4) if all external connections are secure, the air leak is likely from the patient's lung (persistent pneumothorax, bronchopleural fistula), requiring physician notification. NEVER clamp a chest tube for extended periods (risk of tension pneumothorax). The cessation of tidaling (not bubbling) may indicate lung re-expansion or tube occlusion.", tags: ["respiratory", "chest-tube", "water-seal", "air-leak", "thoracotomy", "pneumothorax"] },
    { topic: "Hematology", sub: "DIC Management", stem: "An RN is caring for a patient diagnosed with disseminated intravascular coagulation (DIC) secondary to sepsis. The patient has petechiae, oozing from IV sites, and gum bleeding. Lab results show: platelets 28,000/mm3, fibrinogen 85 mg/dL (normal 200-400), D-dimer elevated, PT/INR prolonged, and aPTT prolonged. Which pathophysiological process explains DIC?",
      correct: "Widespread activation of the coagulation cascade causing simultaneous clotting AND bleeding: microthrombi consume clotting factors and platelets (consumption coagulopathy), leading to hemorrhage from depleted hemostatic resources",
      wrong1: "Simple vitamin K deficiency causing inability to produce clotting factors",
      wrong2: "Overproduction of platelets causing excessive clotting without any bleeding risk",
      wrong3: "Isolated platelet destruction by autoimmune antibodies similar to ITP",
      rationale: "DIC (disseminated intravascular coagulation) is a complex, life-threatening coagulation disorder characterized by the SIMULTANEOUS occurrence of widespread microvascular clotting AND hemorrhage - a seemingly paradoxical combination. The pathophysiology: (1) TRIGGER (sepsis, trauma, malignancy, obstetric complications) causes systemic activation of the coagulation cascade; (2) WIDESPREAD MICROTHROMBI form in small blood vessels throughout the body, causing organ damage (kidneys, lungs, brain) from ischemia; (3) CONSUMPTION of clotting factors (reflected in prolonged PT/INR and aPTT), platelets (thrombocytopenia: 28,000), and fibrinogen (depleted to 85 mg/dL) occurs as they are used up in the massive clotting process; (4) SECONDARY FIBRINOLYSIS activates to dissolve the widespread clots, producing elevated D-dimer (fibrin degradation products); (5) With clotting factors and platelets depleted, the patient BLEEDS from every compromised surface (petechiae, IV site oozing, gum bleeding, potential hemorrhage). Treatment addresses: (1) the UNDERLYING CAUSE (antibiotics for sepsis), (2) SUPPORTIVE replacement (platelets, FFP, cryoprecipitate to replace consumed factors), (3) careful monitoring, and (4) possible heparin in chronic DIC to interrupt the clotting cascade.", tags: ["hematology", "DIC", "coagulation", "sepsis", "consumption-coagulopathy", "critical-care"] },
  ];

  for (const sc of nclexRNscenarios) {
    qs.push(rn(sc.topic, sc.sub, "Physiological Integrity", "MCQ", 4,
      sc.stem,
      [O("A", sc.wrong1), O("B", sc.correct), O("C", sc.wrong2), O("D", sc.wrong3)],
      ["B"], sc.rationale, `${sc.sub}: key concept from correct answer`,
      "For advanced clinical questions, select the answer that demonstrates comprehensive pathophysiological understanding and systematic clinical reasoning",
      "Avoid answers that oversimplify complex conditions, describe outdated practices, or could worsen the patient's condition",
      { A: "This option is incorrect or dangerous for this clinical scenario", C: "This option misidentifies the condition or appropriate intervention", D: "This option is inappropriate and does not address the clinical situation" },
      sc.tags
    ));
  }

  // SATA questions for NCLEX-RN
  const sataScenarios = [
    { topic: "Cardiac", sub: "Heart Failure Management", stem: "An RN is educating a patient with heart failure about self-management at home. Which instructions should the RN include? (Select all that apply.)",
      opts: [
        O("A", "Weigh yourself every morning at the same time, on the same scale, in similar clothing, and report a gain of more than 1 kg (2 lbs) in 24 hours or 2.5 kg (5 lbs) in 1 week"),
        O("B", "Restrict sodium intake to less than 2,000 mg per day and monitor fluid intake as directed by your healthcare provider"),
        O("C", "Take your medications as prescribed, including ACE inhibitors, beta-blockers, and diuretics; do not skip doses even if you feel better"),
        O("D", "Drink at least 3 litres of fluid daily to maintain adequate hydration"),
        O("E", "Report symptoms of worsening heart failure promptly: increasing shortness of breath, orthopnea, swelling, fatigue, or persistent cough"),
        O("F", "Engage in regular moderate exercise as recommended by your healthcare provider; cardiac rehabilitation may be beneficial"),
      ],
      ca: ["A","B","C","E","F"],
      rationale: "Heart failure self-management education is critical for preventing exacerbations and hospital readmissions. (A) CORRECT: Daily weight monitoring is the most sensitive indicator of fluid retention; a gain of >1 kg/day or >2.5 kg/week suggests fluid overload requiring intervention. (B) CORRECT: Sodium restriction (<2000 mg/day) reduces fluid retention; fluid restriction (typically 1.5-2 L/day) may be prescribed for advanced HF. (C) CORRECT: Medication adherence is essential; ACE inhibitors reduce preload and afterload and prevent cardiac remodeling, beta-blockers reduce heart rate and improve survival, diuretics manage fluid overload. (D) INCORRECT: Patients with heart failure typically require FLUID RESTRICTION (1.5-2 L/day), not increased fluid intake; 3 L/day would worsen fluid overload and exacerbate symptoms. (E) CORRECT: Early recognition of worsening symptoms enables prompt treatment and may prevent hospitalization. (F) CORRECT: Regular moderate exercise improves functional capacity, quality of life, and survival in stable HF patients; the recommendation has shifted from rest to activity.",
      tags: ["cardiac", "heart-failure", "self-management", "patient-education", "daily-weight"] },
    { topic: "Pharmacology", sub: "Medication Administration Safety", stem: "An RN is administering medications to multiple patients. Which actions demonstrate safe medication administration practices? (Select all that apply.)",
      opts: [
        O("A", "Verify the patient's identity using two identifiers before each medication administration"),
        O("B", "Check the medication against the Medication Administration Record (MAR) three times: when retrieving, when preparing, and at the bedside"),
        O("C", "Crush all medications together and mix them with applesauce for easier administration"),
        O("D", "Assess the patient for allergies before administering any new medication"),
        O("E", "Educate the patient about the medication's purpose, expected effects, and potential side effects"),
        O("F", "Have another nurse verify the dose calculation for high-alert medications such as insulin, heparin, and chemotherapy"),
      ],
      ca: ["A","B","D","E","F"],
      rationale: "(A) CORRECT: Two patient identifiers (name + DOB, or name + MRN) are required per Joint Commission NPSG. (B) CORRECT: The three-check system minimizes errors. (C) INCORRECT: NOT all medications can be crushed - enteric-coated tablets, extended-release formulations, capsules with special coatings, and sublingual medications should NEVER be crushed as it alters absorption, may cause toxicity from rapid release, or destroys the medication's protective coating. Additionally, medications should not all be mixed together as they may interact chemically. (D) CORRECT: Allergy assessment is a fundamental safety check before medication administration. (E) CORRECT: Patient education is a right of medication administration (right education/right to know). (F) CORRECT: Independent double-checks for high-alert medications are a recommended safety practice by the Institute for Safe Medication Practices (ISMP).",
      tags: ["medication-safety", "administration", "high-alert", "rights-of-medication", "nursing-practice"] },
  ];

  for (const ss of sataScenarios) {
    qs.push(rn(ss.topic, ss.sub, "Safe & Effective Care Environment", "SATA", 3,
      ss.stem, ss.opts, ss.ca, ss.rationale,
      `SATA: evaluate each option independently; multiple options can be correct`,
      "For SATA questions, evaluate each option as true/false independently; do not look for patterns in letter selection",
      "Do not assume that all options are correct or that there is always exactly one incorrect option in SATA questions",
      { C: "This option is incorrect because it violates a fundamental principle of safe medication administration", D: "This option would worsen the patient's condition or is contraindicated" },
      ss.tags
    ));
  }

  return qs;
}

async function main() {
  console.log("=== Massive Question Bank Scaling ===\n");

  const beforeCounts = await pool.query(
    `SELECT tier, exam, COUNT(*)::int as count FROM exam_questions WHERE tier IN ('rpn','rn') AND exam IN ('REx-PN','NCLEX-PN','NCLEX-RN') GROUP BY tier, exam ORDER BY tier, exam`
  );
  console.log("BEFORE counts:");
  for (const r of beforeCounts.rows) console.log(`  ${r.tier}/${r.exam}: ${r.count}`);

  const allQuestions = buildAllQuestions();
  console.log(`\nGenerated ${allQuestions.length} questions total`);

  const breakdown = { "REx-PN": 0, "NCLEX-PN": 0, "NCLEX-RN": 0 };
  for (const q of allQuestions) breakdown[q.exam as keyof typeof breakdown]++;
  console.log("Breakdown:", breakdown);

  let inserted = 0, duplicates = 0, errors = 0;

  for (const q of allQuestions) {
    const hash = stemHash(q.stem);
    try {
      const existing = await pool.query(
        `SELECT id FROM exam_questions WHERE stem_hash = $1 AND tier = $2 AND exam = $3 LIMIT 1`,
        [hash, q.tier, q.exam]
      );
      if (existing.rows.length > 0) { duplicates++; continue; }

      await pool.query(
        `INSERT INTO exam_questions (id, tier, exam, question_type, status, stem, options, correct_answer, rationale, difficulty, tags, body_system, topic, subtopic, region_scope, stem_hash, scenario, clinical_pearl, exam_strategy, clinical_trap, distractor_rationales, career_type, created_at, updated_at)
         VALUES (gen_random_uuid(), $1, $2, $3, 'published', $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, 'nursing', NOW(), NOW())`,
        [q.tier, q.exam, q.questionType, q.stem, JSON.stringify(q.options), JSON.stringify(q.correctAnswer), q.rationale, q.difficulty, q.tags, q.bodySystem, q.topic, q.subtopic, q.regionScope, hash, q.scenario, q.clinicalPearl, q.examStrategy, q.clinicalTrap, JSON.stringify(q.distractorRationales)]
      );
      inserted++;
    } catch (err: any) {
      errors++;
      console.error(`  [ERROR]: ${err.message.substring(0, 120)}`);
    }
  }

  console.log(`\nInserted: ${inserted}, Duplicates: ${duplicates}, Errors: ${errors}`);

  const afterCounts = await pool.query(
    `SELECT tier, exam, COUNT(*)::int as count FROM exam_questions WHERE tier IN ('rpn','rn') AND exam IN ('REx-PN','NCLEX-PN','NCLEX-RN') GROUP BY tier, exam ORDER BY tier, exam`
  );
  console.log("\nAFTER counts:");
  for (const r of afterCounts.rows) console.log(`  ${r.tier}/${r.exam}: ${r.count}`);

  await pool.end();
  console.log("\n=== Done! ===");
}

main().catch(err => { console.error("Fatal:", err); process.exit(1); });
