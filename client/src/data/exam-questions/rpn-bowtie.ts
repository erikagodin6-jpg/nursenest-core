import type { BowtieQuestion } from "./types";

export const rpnBowtieQuestions: BowtieQuestion[] = [
  {
    id: "bt_rpn_cardiovascular_0_0",
    scenario: "A 68-year-old male with a history of hypertension presents to the emergency department with crushing substernal chest pain radiating to the left arm and jaw. He is diaphoretic and nauseated. Vital signs: BP 158/94 mmHg, HR 102 bpm, RR 22/min, SpO2 94% on room air. ECG shows ST-segment elevation in leads II, III, and aVF.",
    centerOptions: ["Inferior ST-elevation myocardial infarction","Unstable angina","Aortic dissection","Pulmonary embolism"],
    centerCorrect: 0,
    leftFindings: ["ST-elevation in leads II, III, aVF","Crushing substernal chest pain radiating to left arm","Diaphoresis and nausea","Elevated troponin levels expected","Normal chest X-ray findings","Bilateral equal blood pressures"],
    leftCorrect: [0,1,2],
    leftSelectCount: 3,
    rightActions: ["Administer aspirin 325 mg chewed immediately","Activate cardiac catheterization lab","Administer morphine for pain if not hypotensive","Administer thrombolytics without ECG confirmation","Obtain serial troponin levels","Discharge with follow-up appointment"],
    rightCorrect: [0,1,4],
    rightSelectCount: 3,
    rationale: {
      condition: "ST-elevation in inferior leads (II, III, aVF) with classic symptoms of crushing chest pain, diaphoresis, and nausea indicates an inferior STEMI requiring emergent intervention.",
      findings: "ST-elevation in inferior leads, crushing substernal pain radiating to the arm, and diaphoresis are hallmark findings of acute MI. Normal chest X-ray and bilateral equal BPs help rule out aortic dissection.",
      actions: "Aspirin inhibits platelet aggregation and is first-line. Cardiac catheterization lab activation enables primary PCI. Serial troponins confirm myocardial injury. Thrombolytics without ECG confirmation is inappropriate, and discharge is unsafe."
    },
    bodySystem: "Cardiovascular",
    tier: "rpn"
  },
  {
    id: "bt_rpn_cardiovascular_1_0",
    scenario: "A 72-year-old female with a history of atrial fibrillation and heart failure presents with increasing dyspnea, orthopnea, and bilateral lower extremity edema over 3 days. She reports sleeping on 3 pillows. Vital signs: BP 142/88 mmHg, HR 112 bpm irregular, RR 28/min, SpO2 88% on room air. Auscultation reveals bilateral crackles and an S3 gallop. BNP is 1,240 pg/mL.",
    centerOptions: ["Acute decompensated heart failure","Community-acquired pneumonia","Chronic obstructive pulmonary disease exacerbation","Pleural effusion"],
    centerCorrect: 0,
    leftFindings: ["Bilateral crackles with S3 gallop","Orthopnea requiring 3-pillow elevation","BNP 1,240 pg/mL","Bilateral lower extremity edema","Productive cough with green sputum","Barrel chest with prolonged expiration"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer IV furosemide as ordered","Position in high Fowler's position","Apply supplemental oxygen to maintain SpO2 above 94%","Encourage increased oral fluid intake","Monitor strict intake and output","Administer IV normal saline bolus"],
    rightCorrect: [0,1,2,4],
    rightSelectCount: 4,
    rationale: {
      condition: "Bilateral crackles, S3 gallop, orthopnea, peripheral edema, and markedly elevated BNP (greater than 400 pg/mL) are classic findings of acute decompensated heart failure.",
      findings: "S3 gallop indicates volume overload. Orthopnea and elevated BNP confirm fluid status. Bilateral edema reflects right-sided congestion. Green sputum and barrel chest are distractors suggesting pneumonia and COPD respectively.",
      actions: "IV furosemide promotes diuresis. High Fowler's reduces preload and improves breathing. Oxygen treats hypoxemia. Strict I&O monitors fluid balance. Increased fluids and saline bolus would worsen volume overload."
    },
    bodySystem: "Cardiovascular",
    tier: "rpn"
  },
  {
    id: "bt_rpn_cardiovascular_2_0",
    scenario: "A 55-year-old male with uncontrolled hypertension presents with sudden onset of severe tearing chest pain radiating to the back between the scapulae. He appears anxious and diaphoretic. Vital signs: Right arm BP 182/110 mmHg, Left arm BP 148/90 mmHg, HR 118 bpm, RR 24/min. Chest X-ray shows widened mediastinum.",
    centerOptions: ["Aortic dissection","Myocardial infarction","Tension pneumothorax","Esophageal rupture"],
    centerCorrect: 0,
    leftFindings: ["Tearing chest pain radiating to the back","Blood pressure differential between arms greater than 20 mmHg","Widened mediastinum on chest X-ray","History of uncontrolled hypertension","ST-elevation on ECG","Subcutaneous emphysema"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer IV beta-blocker to reduce heart rate and BP","Obtain emergent CT angiography","Prepare for possible surgical intervention","Administer thrombolytics immediately","Establish two large-bore IV lines","Administer aspirin 325 mg"],
    rightCorrect: [0,1,2,4],
    rightSelectCount: 4,
    rationale: {
      condition: "Sudden tearing chest pain radiating to the back, blood pressure differential greater than 20 mmHg between arms, and widened mediastinum are classic for aortic dissection.",
      findings: "Tearing pain to the back, BP differential, widened mediastinum, and uncontrolled HTN history are hallmark findings. ST-elevation suggests MI, and subcutaneous emphysema suggests esophageal rupture.",
      actions: "IV beta-blockers control heart rate and shear stress. CT angiography confirms diagnosis. Surgical prep is essential. Large-bore IVs allow resuscitation. Thrombolytics and aspirin are absolutely contraindicated as they would worsen hemorrhage."
    },
    bodySystem: "Cardiovascular",
    tier: "rpn"
  },
  {
    id: "bt_rpn_respiratory_3_0",
    scenario: "A 42-year-old female with a history of asthma presents to the emergency department with severe dyspnea, audible wheezing, and inability to speak in full sentences. She has used her albuterol inhaler 8 times today without relief. Vital signs: BP 138/82 mmHg, HR 124 bpm, RR 32/min, SpO2 87% on room air. Peak flow is 120 L/min (predicted 380 L/min).",
    centerOptions: ["Severe acute asthma exacerbation (status asthmaticus)","Chronic obstructive pulmonary disease exacerbation","Anaphylaxis","Spontaneous pneumothorax"],
    centerCorrect: 0,
    leftFindings: ["Inability to speak in full sentences","Peak flow less than 33% of predicted","SpO2 87% on room air","No relief from repeated albuterol use","Inspiratory stridor","Unilateral absent breath sounds"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer continuous nebulized albuterol","Administer IV corticosteroids (methylprednisolone)","Prepare for possible intubation","Administer ipratropium bromide nebulization","Discharge with oral prednisone taper","Apply high-flow supplemental oxygen"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Severe dyspnea with inability to speak in full sentences, peak flow below 33% predicted, refractory to beta-agonist therapy, and hypoxemia indicate status asthmaticus requiring aggressive treatment.",
      findings: "Inability to speak in sentences, severely reduced peak flow, hypoxemia, and albuterol resistance are hallmarks of severe exacerbation. Stridor suggests upper airway obstruction, and unilateral absent sounds suggest pneumothorax.",
      actions: "Continuous nebulized albuterol provides sustained bronchodilation. IV steroids reduce inflammation. Intubation preparation ensures airway protection. Ipratropium provides additional bronchodilation. High-flow oxygen treats hypoxemia. Discharge is inappropriate for this severity."
    },
    bodySystem: "Respiratory",
    tier: "rpn"
  },
  {
    id: "bt_rpn_respiratory_4_0",
    scenario: "A 63-year-old male, 4 days post total hip replacement, suddenly develops sharp pleuritic chest pain, dyspnea, and hemoptysis. He is tachycardic and anxious. Vital signs: BP 110/70 mmHg, HR 118 bpm, RR 28/min, SpO2 89% on room air. D-dimer is 2,400 ng/mL. CT pulmonary angiography reveals a filling defect in the right main pulmonary artery.",
    centerOptions: ["Pulmonary embolism","Hospital-acquired pneumonia","Fat embolism syndrome","Acute coronary syndrome"],
    centerCorrect: 0,
    leftFindings: ["Pleuritic chest pain with hemoptysis","Recent surgical procedure with immobility","D-dimer 2,400 ng/mL","CT showing filling defect in pulmonary artery","Petechial rash on chest and axillae","Productive cough with purulent sputum"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Initiate anticoagulation with IV heparin","Apply supplemental oxygen","Elevate the head of bed","Prepare for thrombolysis if hemodynamically unstable","Encourage early ambulation without restrictions","Monitor for signs of right ventricular failure"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Pleuritic chest pain, hemoptysis, tachycardia, and hypoxemia in a postoperative patient with elevated D-dimer and CT-confirmed filling defect confirm pulmonary embolism.",
      findings: "Pleuritic pain with hemoptysis, surgical immobility risk factor, markedly elevated D-dimer, and CT angiography findings are diagnostic. Petechial rash suggests fat embolism; purulent sputum suggests pneumonia.",
      actions: "IV heparin prevents clot propagation. Oxygen treats hypoxemia. Head elevation improves ventilation. Thrombolysis is reserved for massive PE with hemodynamic instability. Monitoring for RV failure detects deterioration. Unrestricted ambulation could dislodge further emboli."
    },
    bodySystem: "Respiratory",
    tier: "rpn"
  },
  {
    id: "bt_rpn_respiratory_5_0",
    scenario: "A 58-year-old male with a 40-pack-year smoking history presents with worsening dyspnea, increased sputum production with yellow-green color, and low-grade fever for 3 days. He uses home oxygen at 2 L/min. Vital signs: BP 136/82 mmHg, HR 98 bpm, RR 26/min, SpO2 85% on 2 L/min NC, Temp 38.2C. ABG: pH 7.31, PaCO2 58 mmHg, PaO2 52 mmHg, HCO3 28 mEq/L.",
    centerOptions: ["Acute exacerbation of COPD","Community-acquired pneumonia","Acute asthma attack","Pulmonary fibrosis"],
    centerCorrect: 0,
    leftFindings: ["40-pack-year smoking history with chronic dyspnea","Increased purulent sputum production","Compensated respiratory acidosis on ABG","Hypoxemia despite home oxygen","No wheezing or reversible obstruction","Bilateral fine inspiratory crackles only"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Increase oxygen to maintain SpO2 88-92%","Administer short-acting bronchodilator nebulization","Administer systemic corticosteroids","Start antibiotics for infectious exacerbation","Administer high-flow oxygen to achieve SpO2 100%","Monitor for CO2 narcosis and worsening respiratory acidosis"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "A COPD patient with worsening dyspnea, increased purulent sputum, fever, and compensated respiratory acidosis with chronic CO2 retention meets criteria for acute COPD exacerbation.",
      findings: "Smoking history, baseline dyspnea, purulent sputum increase, and ABG showing compensated respiratory acidosis (elevated PaCO2 with elevated HCO3) confirm chronic CO2 retention with acute worsening.",
      actions: "Target SpO2 88-92% to avoid suppressing hypoxic drive. Bronchodilators relieve airflow obstruction. Steroids reduce inflammation. Antibiotics treat infectious trigger. High-flow O2 to 100% risks CO2 narcosis. Monitoring respiratory status is essential."
    },
    bodySystem: "Respiratory",
    tier: "rpn"
  },
  {
    id: "bt_rpn_neurological_6_0",
    scenario: "A 74-year-old male is brought to the emergency department by his wife who noticed sudden onset of right-sided facial droop, right arm weakness, and slurred speech 45 minutes ago. He has a history of atrial fibrillation and takes warfarin irregularly. Vital signs: BP 178/96 mmHg, HR 88 bpm irregular, RR 18/min, SpO2 97%. NIHSS score is 14. CT head shows no hemorrhage.",
    centerOptions: ["Acute ischemic stroke","Hemorrhagic stroke","Transient ischemic attack","Bell's palsy"],
    centerCorrect: 0,
    leftFindings: ["Sudden right-sided facial droop and arm weakness","Slurred speech (dysarthria)","History of atrial fibrillation","CT head negative for hemorrhage","NIHSS score of 14","Gradual bilateral facial weakness"],
    leftCorrect: [0,1,2,3,4],
    leftSelectCount: 5,
    rightActions: ["Determine eligibility for IV alteplase (tPA) within window","Obtain STAT INR and coagulation studies","Maintain blood pressure below 185/110 mmHg if thrombolysis candidate","Administer aspirin 325 mg immediately before imaging","Perform neurological assessments every 15 minutes","Position head of bed flat if no increased ICP"],
    rightCorrect: [0,1,2,4,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Sudden onset focal neurological deficits (facial droop, arm weakness, dysarthria) with negative CT for hemorrhage and atrial fibrillation as embolic source confirms acute ischemic stroke.",
      findings: "Sudden unilateral deficits, dysarthria, A-fib history, negative CT, and elevated NIHSS are classic. Gradual bilateral weakness suggests other diagnoses like myasthenia gravis.",
      actions: "tPA eligibility assessment is time-critical (within 4.5 hours). INR is essential since the patient takes warfarin (tPA contraindicated if INR greater than 1.7). BP management enables safe thrombolysis. Frequent neuro checks detect deterioration. Flat HOB improves cerebral perfusion. Aspirin before imaging is contraindicated as hemorrhage must be ruled out first."
    },
    bodySystem: "Neurological",
    tier: "rpn"
  },
  {
    id: "bt_rpn_neurological_7_0",
    scenario: "A 28-year-old female presents with severe headache described as the worst headache of my life, sudden onset while exercising. She reports neck stiffness and photophobia. Vital signs: BP 168/94 mmHg, HR 92 bpm, RR 18/min, Temp 37.8C. Neurological exam reveals nuchal rigidity. CT head is negative.",
    centerOptions: ["Subarachnoid hemorrhage","Tension headache","Meningitis","Migraine with aura"],
    centerCorrect: 0,
    leftFindings: ["Thunderclap headache - worst headache of life","Sudden onset during physical exertion","Nuchal rigidity on examination","Photophobia","Gradual onset over several hours","Aura with visual scotoma preceding headache"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Perform lumbar puncture to assess for xanthochromia","Order CT angiography to identify aneurysm","Maintain strict bed rest with dim lighting","Administer IV nimodipine to prevent vasospasm","Discharge with analgesics if CT is negative","Initiate seizure precautions"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Thunderclap headache with sudden onset during exertion, nuchal rigidity, and photophobia are classic for subarachnoid hemorrhage even with a negative CT (sensitivity decreases after 6 hours).",
      findings: "Worst headache of life with sudden onset, exertional trigger, nuchal rigidity, and photophobia strongly suggest SAH. Gradual onset and visual aura are migraine features.",
      actions: "Lumbar puncture after negative CT detects xanthochromia (blood breakdown products). CTA identifies the bleeding source. Bed rest reduces rebleeding risk. Nimodipine prevents cerebral vasospasm. Seizure precautions prevent further injury. Discharge without LP is unsafe."
    },
    bodySystem: "Neurological",
    tier: "rpn"
  },
  {
    id: "bt_rpn_gastrointestinal_8_0",
    scenario: "A 45-year-old male with a history of alcohol use disorder presents with hematemesis of approximately 500 mL of bright red blood. He appears pale, anxious, and diaphoretic. Vital signs: BP 88/52 mmHg, HR 128 bpm, RR 24/min, SpO2 96%. Abdomen is distended with a fluid wave. He has spider angiomata on his chest and palmar erythema.",
    centerOptions: ["Esophageal variceal hemorrhage","Peptic ulcer disease bleeding","Mallory-Weiss tear","Gastric carcinoma"],
    centerCorrect: 0,
    leftFindings: ["Large-volume hematemesis with bright red blood","Signs of portal hypertension (ascites, spider angiomata)","Hemodynamic instability (hypotension, tachycardia)","History of alcohol use disorder","Epigastric pain relieved by eating","Coffee-ground emesis with melena only"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Establish two large-bore IV lines for volume resuscitation","Type and crossmatch for packed red blood cells","Administer IV octreotide to reduce portal pressure","Prepare for emergent endoscopy","Insert nasogastric tube for gastric lavage first","Administer IV proton pump inhibitor"],
    rightCorrect: [0,1,2,3],
    rightSelectCount: 4,
    rationale: {
      condition: "Large-volume hematemesis in a patient with alcohol use disorder and signs of portal hypertension (ascites, spider angiomata, palmar erythema) is consistent with esophageal variceal bleeding.",
      findings: "Bright red hematemesis, portal hypertension signs, hemodynamic instability, and alcohol history point to variceal hemorrhage. Epigastric pain relieved by eating suggests PUD. Coffee-ground emesis suggests slower upper GI bleed.",
      actions: "Large-bore IVs enable rapid resuscitation. Blood products correct hemorrhagic shock. Octreotide reduces portal venous pressure. Emergent endoscopy allows band ligation or sclerotherapy. NG tube in suspected varices is controversial and may worsen bleeding. PPI is appropriate for PUD but not primary therapy for varices."
    },
    bodySystem: "Gastrointestinal",
    tier: "rpn"
  },
  {
    id: "bt_rpn_gastrointestinal_9_0",
    scenario: "A 35-year-old female presents with acute onset right lower quadrant pain that began periumbilically 12 hours ago and migrated. She reports nausea, one episode of vomiting, and anorexia. Vital signs: BP 126/78 mmHg, HR 96 bpm, RR 18/min, Temp 38.4C. McBurney's point tenderness is positive. Rovsing sign is positive. WBC 14,200/mm3.",
    centerOptions: ["Acute appendicitis","Ectopic pregnancy","Ovarian torsion","Crohn's disease flare"],
    centerCorrect: 0,
    leftFindings: ["Pain migration from periumbilical to right lower quadrant","McBurney's point tenderness","Positive Rovsing sign","Leukocytosis with left shift","Positive pregnancy test","Chronic intermittent cramping with bloody diarrhea"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Maintain NPO status","Administer IV fluids and antibiotics","Prepare patient for surgical consultation","Obtain CT abdomen/pelvis with contrast","Administer oral laxatives for constipation","Apply heating pad to abdomen for comfort"],
    rightCorrect: [0,1,2,3],
    rightSelectCount: 4,
    rationale: {
      condition: "Classic migratory pain from periumbilical to RLQ, positive McBurney's and Rovsing signs, fever, and leukocytosis strongly suggest acute appendicitis.",
      findings: "Pain migration pattern, McBurney's tenderness, positive Rovsing sign, and elevated WBC are classic appendicitis findings. Positive pregnancy test suggests ectopic pregnancy. Chronic bloody diarrhea suggests Crohn's.",
      actions: "NPO status prepares for potential surgery. IV fluids maintain hydration and antibiotics prevent peritonitis. Surgical consult is essential. CT confirms diagnosis. Laxatives are contraindicated with possible appendicitis. Heat application may increase inflammation risk."
    },
    bodySystem: "Gastrointestinal",
    tier: "rpn"
  },
  {
    id: "bt_rpn_renalurinary_10_0",
    scenario: "A 62-year-old male with a history of type 2 diabetes and chronic kidney disease (Stage 3) presents with generalized weakness, nausea, and muscle cramping. Lab results show: K+ 6.8 mEq/L, BUN 48 mg/dL, Creatinine 4.2 mg/dL, GFR 18 mL/min. ECG shows peaked T waves and widened QRS complex.",
    centerOptions: ["Severe hyperkalemia with ECG changes","Diabetic ketoacidosis","Hyponatremia","Acute renal failure"],
    centerCorrect: 0,
    leftFindings: ["Potassium 6.8 mEq/L","Peaked T waves on ECG","Widened QRS complex","Muscle weakness and cramping","Deep Kussmaul respirations","Serum sodium 118 mEq/L"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer IV calcium gluconate for cardiac membrane stabilization","Administer insulin with dextrose to shift potassium intracellularly","Place on continuous cardiac monitoring","Administer sodium polystyrene sulfonate (Kayexalate)","Administer potassium chloride supplement","Prepare for possible emergent hemodialysis"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Potassium of 6.8 mEq/L with ECG changes (peaked T waves, widened QRS) represents a cardiac emergency requiring immediate treatment to prevent fatal arrhythmia.",
      findings: "Severely elevated potassium, peaked T waves, widened QRS, and neuromuscular symptoms confirm symptomatic hyperkalemia. Kussmaul breathing is a DKA finding. Low sodium would indicate hyponatremia.",
      actions: "Calcium gluconate stabilizes cardiac membranes immediately (does not lower K+). Insulin/dextrose shifts K+ into cells. Continuous monitoring detects arrhythmias. Kayexalate removes K+ from the body. Hemodialysis is definitive treatment for refractory cases. Additional potassium is absolutely contraindicated."
    },
    bodySystem: "Renal/Urinary",
    tier: "rpn"
  },
  {
    id: "bt_rpn_endocrine_11_0",
    scenario: "A 22-year-old female with Type 1 diabetes is brought to the ED by her roommate. She has had nausea, vomiting, and abdominal pain for 2 days following a urinary tract infection. She appears dehydrated with dry mucous membranes. Vital signs: BP 96/58 mmHg, HR 118 bpm, RR 28/min deep (Kussmaul), Temp 38.1C. Labs: Blood glucose 486 mg/dL, pH 7.18, HCO3 10 mEq/L, Anion gap 24, Serum K+ 5.6 mEq/L.",
    centerOptions: ["Diabetic ketoacidosis","Hyperosmolar hyperglycemic state","Lactic acidosis","Uremic acidosis"],
    centerCorrect: 0,
    leftFindings: ["Blood glucose 486 mg/dL with metabolic acidosis","Kussmaul respirations (deep and rapid)","Elevated anion gap of 24","Type 1 diabetes with intercurrent infection","Serum osmolality greater than 320 mOsm/kg","Gradual onset over 1-2 weeks"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Initiate aggressive IV normal saline resuscitation","Begin continuous IV regular insulin infusion","Monitor serum potassium every 1-2 hours","Administer IV potassium when K+ falls below 5.3 mEq/L","Administer subcutaneous long-acting insulin immediately","Monitor blood glucose hourly"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Type 1 diabetes, severe hyperglycemia, metabolic acidosis (pH 7.18, low HCO3), elevated anion gap, and Kussmaul respirations confirm DKA triggered by infection.",
      findings: "High glucose with acidosis, Kussmaul breathing (compensatory CO2 elimination), high anion gap (ketoacids), and Type 1 DM with infection trigger are diagnostic. Osmolality greater than 320 and gradual onset are HHS features.",
      actions: "IV NS corrects severe dehydration. Continuous insulin infusion corrects hyperglycemia and halts ketogenesis. K+ monitoring is critical as insulin drives K+ intracellularly. Replace K+ when it drops below 5.3 to prevent hypokalemia. Hourly glucose monitoring guides insulin titration. SubQ long-acting insulin during acute DKA is inappropriate."
    },
    bodySystem: "Endocrine",
    tier: "rpn"
  },
  {
    id: "bt_rpn_endocrine_12_0",
    scenario: "A 48-year-old female is found unresponsive by coworkers at her office. She has a medical alert bracelet indicating Addison's disease. Vital signs: BP 72/48 mmHg, HR 130 bpm, RR 22/min, Temp 36.0C, Blood glucose 52 mg/dL. Skin appears hyperpigmented. Serum sodium is 126 mEq/L, potassium 6.1 mEq/L.",
    centerOptions: ["Adrenal crisis (acute adrenal insufficiency)","Septic shock","Hypoglycemic episode","Myxedema coma"],
    centerCorrect: 0,
    leftFindings: ["Profound hypotension refractory to fluids alone","Hypoglycemia (blood glucose 52 mg/dL)","Hyponatremia with hyperkalemia","Known Addison's disease","High fever with chills","Severe hypothermia with bradycardia"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer IV hydrocortisone 100 mg STAT","Initiate aggressive IV normal saline with dextrose","Administer IV dextrose 50% for hypoglycemia","Monitor hemodynamic status continuously","Hold all corticosteroids until cortisol level returns","Obtain random cortisol and ACTH levels before treatment if possible"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Unresponsiveness, severe hypotension, hypoglycemia, hyponatremia, hyperkalemia, and known Addison's disease are classic for adrenal crisis requiring emergent glucocorticoid replacement.",
      findings: "Refractory hypotension, hypoglycemia, electrolyte pattern (low Na, high K), and Addison's history confirm adrenal crisis. High fever suggests sepsis. Hypothermia with bradycardia suggests myxedema coma.",
      actions: "IV hydrocortisone is life-saving and must not be delayed. IV NS with dextrose corrects dehydration and hypoglycemia. D50 treats acute hypoglycemia. Continuous monitoring detects hemodynamic changes. Cortisol/ACTH levels should be drawn before treatment if it does not delay therapy. Withholding steroids is dangerous."
    },
    bodySystem: "Endocrine",
    tier: "rpn"
  },
  {
    id: "bt_rpn_hematology_13_0",
    scenario: "A 6-year-old African American male presents to the ED with severe bilateral leg pain, swollen hands, and fever. His mother reports he has sickle cell disease. Vital signs: BP 100/62 mmHg, HR 122 bpm, RR 24/min, Temp 39.2C, SpO2 91%. CBC shows Hgb 6.2 g/dL, WBC 18,400/mm3, reticulocyte count 12%.",
    centerOptions: ["Vaso-occlusive sickle cell crisis with fever","Osteomyelitis","Acute lymphoblastic leukemia","Juvenile rheumatoid arthritis"],
    centerCorrect: 0,
    leftFindings: ["Severe bilateral bone pain","Known sickle cell disease","Fever with leukocytosis","Hemoglobin 6.2 g/dL with elevated reticulocytes","Painless joint swelling without warmth","Pancytopenia with blast cells"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer IV opioid analgesics for pain management","Initiate aggressive IV fluid hydration","Obtain blood cultures before antibiotics","Administer supplemental oxygen for SpO2 below 95%","Apply cold compresses to painful areas","Prepare for possible blood transfusion"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "A child with known sickle cell disease presenting with bilateral bone pain, dactylitis, fever, anemia, and elevated reticulocytes indicates vaso-occlusive crisis with possible infection requiring urgent treatment.",
      findings: "Bilateral bone pain, sickle cell history, fever, anemia with reticulocytosis (hemolysis compensation) confirm crisis. Painless joint swelling suggests JRA. Pancytopenia with blasts suggests leukemia.",
      actions: "IV opioids address severe pain (do not undertreat sickle cell pain). IV fluids reduce blood viscosity and sickling. Blood cultures identify infection source. O2 maintains oxygenation to reduce sickling. Transfusion may be needed for severe anemia. Cold compresses are contraindicated as cold promotes sickling."
    },
    bodySystem: "Hematology",
    tier: "rpn"
  },
  {
    id: "bt_rpn_mentalhealth_14_0",
    scenario: "A 32-year-old male is brought to the psychiatric emergency department by police after being found on a bridge railing. He reports feeling hopeless for 3 months after losing his job and a recent divorce. He states he has a plan to use a firearm stored at his home. He admits to heavy alcohol use daily. He has no prior psychiatric history. Vital signs are stable.",
    centerOptions: ["Acute suicidal crisis with imminent risk","Major depressive episode without suicidality","Adjustment disorder with depressed mood","Alcohol use disorder only"],
    centerCorrect: 0,
    leftFindings: ["Verbalized specific plan with access to lethal means","Hopelessness lasting 3 months","Multiple recent psychosocial stressors (job loss, divorce)","Active heavy alcohol use (disinhibiting factor)","Reports passive thoughts without plan","Denies any intent to harm self"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Implement one-to-one continuous observation","Initiate safety planning and restrict access to lethal means","Obtain psychiatric consultation for inpatient admission","Screen for substance intoxication and withdrawal","Discharge with outpatient follow-up referral","Ensure therapeutic, non-judgmental communication"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Active suicidal ideation with a specific lethal plan (firearm), access to means, multiple risk factors (hopelessness, substance use, psychosocial stressors), and behavioral evidence (found on bridge) indicate imminent suicide risk.",
      findings: "Specific plan with access, hopelessness, stressors, and alcohol use as a disinhibitor are high-risk factors. Passive thoughts without plan and denial of intent would lower risk but are not present here.",
      actions: "One-to-one observation prevents self-harm. Safety planning addresses means restriction. Psychiatric consult evaluates for involuntary hold if needed. Substance screening identifies intoxication. Therapeutic communication builds rapport. Discharge is unsafe given imminent risk level."
    },
    bodySystem: "Mental Health",
    tier: "rpn"
  },
  {
    id: "bt_rpn_immuneinfectious_15_0",
    scenario: "A 71-year-old male nursing home resident presents with altered mental status, fever, and productive cough with rust-colored sputum for 2 days. He has a history of COPD and type 2 diabetes. Vital signs: BP 86/54 mmHg, HR 112 bpm, RR 28/min, Temp 39.4C, SpO2 86% on room air. WBC 22,600/mm3. Lactate 4.2 mmol/L. Chest X-ray shows right lower lobe consolidation.",
    centerOptions: ["Sepsis secondary to community-acquired pneumonia","COPD exacerbation","Acute heart failure","Aspiration pneumonitis"],
    centerCorrect: 0,
    leftFindings: ["Fever with productive rust-colored sputum","Hypotension with tachycardia (signs of septic shock)","Elevated lactate 4.2 mmol/L indicating tissue hypoperfusion","Right lower lobe consolidation on chest X-ray","Bilateral wheezing without consolidation","Frothy pink sputum with bilateral infiltrates"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Initiate IV broad-spectrum antibiotics within 1 hour","Administer 30 mL/kg IV crystalloid bolus","Obtain blood cultures before antibiotics if possible","Apply supplemental oxygen to target SpO2 above 94%","Administer IV corticosteroids as first-line treatment","Measure serial lactate levels to assess resuscitation adequacy"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Suspected infection (pneumonia), organ dysfunction (hypotension, altered mental status), and elevated lactate greater than 2 mmol/L meet Sepsis-3 criteria. This represents septic shock requiring the SEP-1 bundle.",
      findings: "Fever, productive cough, consolidation confirm pneumonia source. Hypotension and tachycardia indicate shock. Elevated lactate confirms tissue hypoperfusion. Wheezing without consolidation suggests COPD. Frothy pink sputum suggests heart failure.",
      actions: "Antibiotics within 1 hour reduce mortality in sepsis. Fluid bolus restores perfusion. Blood cultures guide targeted therapy. Oxygen corrects hypoxemia. Corticosteroids are not first-line for sepsis (reserved for refractory shock). Serial lactate measures guide resuscitation."
    },
    bodySystem: "Immune/Infectious",
    tier: "rpn"
  },
  {
    id: "bt_rpn_reproductivematernity_16_0",
    scenario: "A 28-year-old G2P1 at 34 weeks gestation presents with sudden onset of severe abdominal pain and vaginal bleeding. She reports the pain is constant and her abdomen feels rigid and board-like. She has a history of chronic hypertension. Vital signs: BP 168/108 mmHg, HR 120 bpm, RR 24/min. Fetal heart rate shows persistent late decelerations with decreased variability.",
    centerOptions: ["Placental abruption","Placenta previa","Uterine rupture","Preterm labor"],
    centerCorrect: 0,
    leftFindings: ["Sudden onset constant abdominal pain with rigidity","Dark red vaginal bleeding","Board-like rigid uterus on palpation","Chronic hypertension as risk factor","Painless bright red vaginal bleeding","Intermittent cramping with progressive cervical dilation"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Initiate continuous fetal monitoring","Establish two large-bore IV lines for fluid resuscitation","Prepare for emergent cesarean delivery","Type and crossmatch blood products","Perform digital cervical examination","Administer IV magnesium sulfate for seizure prophylaxis"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Sudden severe constant pain, board-like rigidity, dark bleeding, chronic HTN risk factor, and fetal distress (late decels, decreased variability) are classic for placental abruption.",
      findings: "Constant pain with rigidity (Couvelaire uterus), dark bleeding, and HTN history are hallmarks. Painless bright bleeding suggests previa. Intermittent cramping with dilation suggests preterm labor.",
      actions: "Continuous FHR monitoring detects fetal compromise. Large-bore IVs prepare for hemorrhage management. Emergent cesarean is indicated for fetal distress. Blood products address hemorrhagic shock. MgSO4 prevents eclamptic seizures with severe HTN. Digital exam is contraindicated until previa is ruled out."
    },
    bodySystem: "Reproductive/Maternity",
    tier: "rpn"
  },
  {
    id: "bt_rpn_pediatrics_17_0",
    scenario: "A 3-year-old male is brought to the ED with a barking cough, inspiratory stridor, and hoarse voice that started after a mild upper respiratory infection. His parents report the symptoms worsened tonight. He has mild substernal retractions. Vital signs: HR 120 bpm, RR 30/min, Temp 38.3C, SpO2 93%. He is sitting upright and appears anxious but alert.",
    centerOptions: ["Moderate croup (laryngotracheobronchitis)","Epiglottitis","Foreign body aspiration","Bacterial tracheitis"],
    centerCorrect: 0,
    leftFindings: ["Barking (seal-like) cough","Inspiratory stridor at rest","Preceded by upper respiratory infection","Hoarse voice with mild retractions","Sudden onset while eating with unilateral wheeze","Drooling with tripod positioning and high fever"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer nebulized racemic epinephrine","Administer oral or IM dexamethasone","Keep the child calm and in a position of comfort","Monitor for rebound stridor after epinephrine","Examine the throat with tongue depressor","Place on continuous pulse oximetry"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Barking cough, inspiratory stridor, hoarseness following URI, and age 6 months to 3 years are classic for viral croup (laryngotracheobronchitis), most commonly caused by parainfluenza virus.",
      findings: "Barking cough, stridor at rest, URI prodrome, and hoarseness with retractions confirm moderate croup. Sudden onset with eating suggests foreign body. Drooling, tripod, and high fever suggest epiglottitis.",
      actions: "Racemic epinephrine reduces subglottic edema. Dexamethasone reduces inflammation (single dose is standard). Keeping the child calm prevents worsening airway obstruction. Rebound monitoring detects recurrence after epinephrine. Pulse oximetry tracks oxygenation. Throat examination with a tongue depressor is contraindicated as it may worsen obstruction and is specifically avoided in suspected epiglottitis."
    },
    bodySystem: "Pediatrics",
    tier: "rpn"
  },
  {
    id: "bt_rpn_emergencytrauma_18_0",
    scenario: "A 34-year-old male arrives via EMS after a motorcycle collision at approximately 60 km/h. He is alert but confused. He has a large open wound on the right thigh with visible bone and significant hemorrhage. Vital signs: BP 82/50 mmHg, HR 138 bpm, RR 28/min, SpO2 94%. He is pale, cool, and diaphoretic. Estimated blood loss is greater than 1,500 mL.",
    centerOptions: ["Hemorrhagic shock (Class III-IV)","Neurogenic shock","Cardiogenic shock","Tension pneumothorax"],
    centerCorrect: 0,
    leftFindings: ["Tachycardia with hypotension","Pale, cool, diaphoretic skin","Open fracture with greater than 1,500 mL estimated blood loss","Altered mental status (confusion)","Warm, flushed skin with bradycardia","Distended neck veins with tracheal deviation"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Apply direct pressure and tourniquet to hemorrhaging extremity","Initiate massive transfusion protocol","Establish two large-bore IV lines with warmed fluids","Perform primary survey using ABCDE approach","Elevate the injured extremity above heart level only","Obtain type and crossmatch and administer blood products"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Tachycardia, hypotension, altered mental status, cool/pale/diaphoretic skin, and estimated blood loss greater than 1,500 mL in a trauma patient indicate Class III-IV hemorrhagic shock.",
      findings: "Tachycardia, hypotension, cool diaphoretic skin, and AMS with significant blood loss are classic hemorrhagic shock findings. Warm flushed skin with bradycardia suggests neurogenic shock. Distended neck veins with tracheal deviation suggests tension pneumothorax.",
      actions: "Direct pressure and tourniquet control active hemorrhage. Massive transfusion protocol provides balanced blood product resuscitation. Large-bore IVs enable rapid volume replacement. ABCDE primary survey ensures systematic assessment. Blood products restore oxygen-carrying capacity. Elevation alone is insufficient for active hemorrhage of this magnitude."
    },
    bodySystem: "Emergency/Trauma",
    tier: "rpn"
  },
  {
    id: "bt_rpn_musculoskeletal_19_0",
    scenario: "A 19-year-old male presents 6 hours after a tibial fracture reduction and casting. He reports increasing severe pain in his lower leg that is not relieved by prescribed opioids. Pain worsens with passive dorsiflexion of the toes. His leg feels tight and tense. Capillary refill is 4 seconds. He reports tingling and numbness in his toes.",
    centerOptions: ["Compartment syndrome","Deep vein thrombosis","Fat embolism syndrome","Cellulitis"],
    centerCorrect: 0,
    leftFindings: ["Pain out of proportion to injury not relieved by analgesics","Pain with passive stretch (dorsiflexion)","Paresthesia (tingling and numbness)","Tense and swollen compartment","Warmth and erythema along the vein","Petechial rash with confusion"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Notify surgeon immediately for possible fasciotomy","Remove or bivalve the cast immediately","Elevate the limb to heart level only (not above)","Monitor neurovascular status every 15-30 minutes","Apply compression bandage to reduce swelling","Measure compartment pressures if available"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "The 5 Ps of compartment syndrome: Pain out of proportion, Pain with passive stretch, Paresthesia, Pressure (tense compartment), and delayed capillary refill indicate a surgical emergency.",
      findings: "Disproportionate pain, pain with passive stretch, paresthesia, and tense compartment are classic. Warmth along a vein suggests DVT. Petechial rash with confusion suggests fat embolism.",
      actions: "Surgical fasciotomy is definitive treatment. Cast removal releases external pressure. Elevate to heart level (not above, which could worsen ischemia). Frequent neurovascular checks track progression. Compartment pressure measurement confirms diagnosis. Compression is contraindicated as it increases compartment pressure."
    },
    bodySystem: "Musculoskeletal",
    tier: "rpn"
  },
  {
    id: "bt_rpn_integumentary_20_0",
    scenario: "A 45-year-old male is admitted to the burn unit after a house fire with estimated 35% TBSA second and third degree burns to his chest, bilateral arms, and face. He was in an enclosed space with smoke exposure. His voice is hoarse and he has singed nasal hairs. Vital signs: BP 102/64 mmHg, HR 124 bpm, RR 26/min, SpO2 92%. He weighs 80 kg.",
    centerOptions: ["Major thermal burn with inhalation injury","Superficial burn requiring outpatient care","Chemical burn exposure","Electrical burn injury"],
    centerCorrect: 0,
    leftFindings: ["35% TBSA second and third degree burns","Hoarse voice with singed nasal hairs (inhalation injury signs)","Enclosed space fire exposure","Facial burns present","Burns limited to extremities only","Entry and exit wounds visible"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Initiate Parkland formula fluid resuscitation (4 mL x kg x %TBSA)","Prepare for early intubation due to inhalation injury signs","Obtain carboxyhemoglobin level","Monitor urine output target 0.5-1 mL/kg/hr","Apply ice directly to burn wounds","Administer tetanus prophylaxis if not current"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Greater than 20% TBSA burns with facial involvement, hoarse voice, singed nasal hairs, and enclosed space exposure indicate major burns with high suspicion for inhalation injury.",
      findings: "35% TBSA, hoarseness, singed nasal hairs, enclosed space, and facial burns are classic for inhalation injury. Burns limited to extremities without airway signs lower risk. Entry/exit wounds suggest electrical injury.",
      actions: "Parkland formula guides crystalloid resuscitation (half in first 8 hours). Early intubation protects airway before edema progresses. Carboxyhemoglobin detects CO poisoning. Urine output guides fluid adequacy. Tetanus prophylaxis prevents infection. Ice is contraindicated as it causes vasoconstriction and worsens tissue damage."
    },
    bodySystem: "Integumentary",
    tier: "rpn"
  },
  {
    id: "bt_rpn_cardiovascular_21_1",
    scenario: "A 63-year-old male with a history of hypertension presents to the emergency department with crushing substernal chest pain radiating to the left arm and jaw. He is diaphoretic and nauseated. Vital signs: BP 158/94 mmHg, HR 102 bpm, RR 22/min, SpO2 94% on room air. ECG shows ST-segment elevation in leads II, III, and aVF. The patient's family is present and asking questions.",
    centerOptions: ["Inferior ST-elevation myocardial infarction","Unstable angina","Aortic dissection","Pulmonary embolism"],
    centerCorrect: 0,
    leftFindings: ["ST-elevation in leads II, III, aVF","Crushing substernal chest pain radiating to left arm","Diaphoresis and nausea","Elevated troponin levels expected","Normal chest X-ray findings","Bilateral equal blood pressures"],
    leftCorrect: [0,1,2],
    leftSelectCount: 3,
    rightActions: ["Administer aspirin 325 mg chewed immediately","Activate cardiac catheterization lab","Administer morphine for pain if not hypotensive","Administer thrombolytics without ECG confirmation","Obtain serial troponin levels","Discharge with follow-up appointment"],
    rightCorrect: [0,1,4],
    rightSelectCount: 3,
    rationale: {
      condition: "ST-elevation in inferior leads (II, III, aVF) with classic symptoms of crushing chest pain, diaphoresis, and nausea indicates an inferior STEMI requiring emergent intervention.",
      findings: "ST-elevation in inferior leads, crushing substernal pain radiating to the arm, and diaphoresis are hallmark findings of acute MI. Normal chest X-ray and bilateral equal BPs help rule out aortic dissection.",
      actions: "Aspirin inhibits platelet aggregation and is first-line. Cardiac catheterization lab activation enables primary PCI. Serial troponins confirm myocardial injury. Thrombolytics without ECG confirmation is inappropriate, and discharge is unsafe."
    },
    bodySystem: "Cardiovascular",
    tier: "rpn"
  },
  {
    id: "bt_rpn_cardiovascular_22_1",
    scenario: "A 67-year-old female with a history of atrial fibrillation and heart failure presents with increasing dyspnea, orthopnea, and bilateral lower extremity edema over 3 days. She reports sleeping on 3 pillows. Vital signs: BP 142/88 mmHg, HR 112 bpm irregular, RR 28/min, SpO2 88% on room air. Auscultation reveals bilateral crackles and an S3 gallop. BNP is 1,240 pg/mL. The patient's family is present and asking questions.",
    centerOptions: ["Acute decompensated heart failure","Community-acquired pneumonia","Chronic obstructive pulmonary disease exacerbation","Pleural effusion"],
    centerCorrect: 0,
    leftFindings: ["Bilateral crackles with S3 gallop","Orthopnea requiring 3-pillow elevation","BNP 1,240 pg/mL","Bilateral lower extremity edema","Productive cough with green sputum","Barrel chest with prolonged expiration"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer IV furosemide as ordered","Position in high Fowler's position","Apply supplemental oxygen to maintain SpO2 above 94%","Encourage increased oral fluid intake","Monitor strict intake and output","Administer IV normal saline bolus"],
    rightCorrect: [0,1,2,4],
    rightSelectCount: 4,
    rationale: {
      condition: "Bilateral crackles, S3 gallop, orthopnea, peripheral edema, and markedly elevated BNP (greater than 400 pg/mL) are classic findings of acute decompensated heart failure.",
      findings: "S3 gallop indicates volume overload. Orthopnea and elevated BNP confirm fluid status. Bilateral edema reflects right-sided congestion. Green sputum and barrel chest are distractors suggesting pneumonia and COPD respectively.",
      actions: "IV furosemide promotes diuresis. High Fowler's reduces preload and improves breathing. Oxygen treats hypoxemia. Strict I&O monitors fluid balance. Increased fluids and saline bolus would worsen volume overload."
    },
    bodySystem: "Cardiovascular",
    tier: "rpn"
  },
  {
    id: "bt_rpn_cardiovascular_23_1",
    scenario: "A 50-year-old male with uncontrolled hypertension presents with sudden onset of severe tearing chest pain radiating to the back between the scapulae. He appears anxious and diaphoretic. Vital signs: Right arm BP 182/110 mmHg, Left arm BP 148/90 mmHg, HR 118 bpm, RR 24/min. Chest X-ray shows widened mediastinum. The patient's family is present and asking questions.",
    centerOptions: ["Aortic dissection","Myocardial infarction","Tension pneumothorax","Esophageal rupture"],
    centerCorrect: 0,
    leftFindings: ["Tearing chest pain radiating to the back","Blood pressure differential between arms greater than 20 mmHg","Widened mediastinum on chest X-ray","History of uncontrolled hypertension","ST-elevation on ECG","Subcutaneous emphysema"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer IV beta-blocker to reduce heart rate and BP","Obtain emergent CT angiography","Prepare for possible surgical intervention","Administer thrombolytics immediately","Establish two large-bore IV lines","Administer aspirin 325 mg"],
    rightCorrect: [0,1,2,4],
    rightSelectCount: 4,
    rationale: {
      condition: "Sudden tearing chest pain radiating to the back, blood pressure differential greater than 20 mmHg between arms, and widened mediastinum are classic for aortic dissection.",
      findings: "Tearing pain to the back, BP differential, widened mediastinum, and uncontrolled HTN history are hallmark findings. ST-elevation suggests MI, and subcutaneous emphysema suggests esophageal rupture.",
      actions: "IV beta-blockers control heart rate and shear stress. CT angiography confirms diagnosis. Surgical prep is essential. Large-bore IVs allow resuscitation. Thrombolytics and aspirin are absolutely contraindicated as they would worsen hemorrhage."
    },
    bodySystem: "Cardiovascular",
    tier: "rpn"
  },
  {
    id: "bt_rpn_respiratory_24_1",
    scenario: "A 37-year-old female with a history of asthma presents to the emergency department with severe dyspnea, audible wheezing, and inability to speak in full sentences. She has used her albuterol inhaler 8 times today without relief. Vital signs: BP 138/82 mmHg, HR 124 bpm, RR 32/min, SpO2 87% on room air. Peak flow is 120 L/min (predicted 380 L/min). The patient's family is present and asking questions.",
    centerOptions: ["Severe acute asthma exacerbation (status asthmaticus)","Chronic obstructive pulmonary disease exacerbation","Anaphylaxis","Spontaneous pneumothorax"],
    centerCorrect: 0,
    leftFindings: ["Inability to speak in full sentences","Peak flow less than 33% of predicted","SpO2 87% on room air","No relief from repeated albuterol use","Inspiratory stridor","Unilateral absent breath sounds"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer continuous nebulized albuterol","Administer IV corticosteroids (methylprednisolone)","Prepare for possible intubation","Administer ipratropium bromide nebulization","Discharge with oral prednisone taper","Apply high-flow supplemental oxygen"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Severe dyspnea with inability to speak in full sentences, peak flow below 33% predicted, refractory to beta-agonist therapy, and hypoxemia indicate status asthmaticus requiring aggressive treatment.",
      findings: "Inability to speak in sentences, severely reduced peak flow, hypoxemia, and albuterol resistance are hallmarks of severe exacerbation. Stridor suggests upper airway obstruction, and unilateral absent sounds suggest pneumothorax.",
      actions: "Continuous nebulized albuterol provides sustained bronchodilation. IV steroids reduce inflammation. Intubation preparation ensures airway protection. Ipratropium provides additional bronchodilation. High-flow oxygen treats hypoxemia. Discharge is inappropriate for this severity."
    },
    bodySystem: "Respiratory",
    tier: "rpn"
  },
  {
    id: "bt_rpn_respiratory_25_1",
    scenario: "A 58-year-old male, 4 days post total hip replacement, suddenly develops sharp pleuritic chest pain, dyspnea, and hemoptysis. He is tachycardic and anxious. Vital signs: BP 110/70 mmHg, HR 118 bpm, RR 28/min, SpO2 89% on room air. D-dimer is 2,400 ng/mL. CT pulmonary angiography reveals a filling defect in the right main pulmonary artery. The patient's family is present and asking questions.",
    centerOptions: ["Pulmonary embolism","Hospital-acquired pneumonia","Fat embolism syndrome","Acute coronary syndrome"],
    centerCorrect: 0,
    leftFindings: ["Pleuritic chest pain with hemoptysis","Recent surgical procedure with immobility","D-dimer 2,400 ng/mL","CT showing filling defect in pulmonary artery","Petechial rash on chest and axillae","Productive cough with purulent sputum"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Initiate anticoagulation with IV heparin","Apply supplemental oxygen","Elevate the head of bed","Prepare for thrombolysis if hemodynamically unstable","Encourage early ambulation without restrictions","Monitor for signs of right ventricular failure"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Pleuritic chest pain, hemoptysis, tachycardia, and hypoxemia in a postoperative patient with elevated D-dimer and CT-confirmed filling defect confirm pulmonary embolism.",
      findings: "Pleuritic pain with hemoptysis, surgical immobility risk factor, markedly elevated D-dimer, and CT angiography findings are diagnostic. Petechial rash suggests fat embolism; purulent sputum suggests pneumonia.",
      actions: "IV heparin prevents clot propagation. Oxygen treats hypoxemia. Head elevation improves ventilation. Thrombolysis is reserved for massive PE with hemodynamic instability. Monitoring for RV failure detects deterioration. Unrestricted ambulation could dislodge further emboli."
    },
    bodySystem: "Respiratory",
    tier: "rpn"
  },
  {
    id: "bt_rpn_respiratory_26_1",
    scenario: "A 53-year-old male with a 40-pack-year smoking history presents with worsening dyspnea, increased sputum production with yellow-green color, and low-grade fever for 3 days. He uses home oxygen at 2 L/min. Vital signs: BP 136/82 mmHg, HR 98 bpm, RR 26/min, SpO2 85% on 2 L/min NC, Temp 38.2C. ABG: pH 7.31, PaCO2 58 mmHg, PaO2 52 mmHg, HCO3 28 mEq/L. The patient's family is present and asking questions.",
    centerOptions: ["Acute exacerbation of COPD","Community-acquired pneumonia","Acute asthma attack","Pulmonary fibrosis"],
    centerCorrect: 0,
    leftFindings: ["40-pack-year smoking history with chronic dyspnea","Increased purulent sputum production","Compensated respiratory acidosis on ABG","Hypoxemia despite home oxygen","No wheezing or reversible obstruction","Bilateral fine inspiratory crackles only"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Increase oxygen to maintain SpO2 88-92%","Administer short-acting bronchodilator nebulization","Administer systemic corticosteroids","Start antibiotics for infectious exacerbation","Administer high-flow oxygen to achieve SpO2 100%","Monitor for CO2 narcosis and worsening respiratory acidosis"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "A COPD patient with worsening dyspnea, increased purulent sputum, fever, and compensated respiratory acidosis with chronic CO2 retention meets criteria for acute COPD exacerbation.",
      findings: "Smoking history, baseline dyspnea, purulent sputum increase, and ABG showing compensated respiratory acidosis (elevated PaCO2 with elevated HCO3) confirm chronic CO2 retention with acute worsening.",
      actions: "Target SpO2 88-92% to avoid suppressing hypoxic drive. Bronchodilators relieve airflow obstruction. Steroids reduce inflammation. Antibiotics treat infectious trigger. High-flow O2 to 100% risks CO2 narcosis. Monitoring respiratory status is essential."
    },
    bodySystem: "Respiratory",
    tier: "rpn"
  },
  {
    id: "bt_rpn_neurological_27_1",
    scenario: "A 69-year-old male is brought to the emergency department by his wife who noticed sudden onset of right-sided facial droop, right arm weakness, and slurred speech 45 minutes ago. He has a history of atrial fibrillation and takes warfarin irregularly. Vital signs: BP 178/96 mmHg, HR 88 bpm irregular, RR 18/min, SpO2 97%. NIHSS score is 14. CT head shows no hemorrhage. The patient's family is present and asking questions.",
    centerOptions: ["Acute ischemic stroke","Hemorrhagic stroke","Transient ischemic attack","Bell's palsy"],
    centerCorrect: 0,
    leftFindings: ["Sudden right-sided facial droop and arm weakness","Slurred speech (dysarthria)","History of atrial fibrillation","CT head negative for hemorrhage","NIHSS score of 14","Gradual bilateral facial weakness"],
    leftCorrect: [0,1,2,3,4],
    leftSelectCount: 5,
    rightActions: ["Determine eligibility for IV alteplase (tPA) within window","Obtain STAT INR and coagulation studies","Maintain blood pressure below 185/110 mmHg if thrombolysis candidate","Administer aspirin 325 mg immediately before imaging","Perform neurological assessments every 15 minutes","Position head of bed flat if no increased ICP"],
    rightCorrect: [0,1,2,4,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Sudden onset focal neurological deficits (facial droop, arm weakness, dysarthria) with negative CT for hemorrhage and atrial fibrillation as embolic source confirms acute ischemic stroke.",
      findings: "Sudden unilateral deficits, dysarthria, A-fib history, negative CT, and elevated NIHSS are classic. Gradual bilateral weakness suggests other diagnoses like myasthenia gravis.",
      actions: "tPA eligibility assessment is time-critical (within 4.5 hours). INR is essential since the patient takes warfarin (tPA contraindicated if INR greater than 1.7). BP management enables safe thrombolysis. Frequent neuro checks detect deterioration. Flat HOB improves cerebral perfusion. Aspirin before imaging is contraindicated as hemorrhage must be ruled out first."
    },
    bodySystem: "Neurological",
    tier: "rpn"
  },
  {
    id: "bt_rpn_neurological_28_1",
    scenario: "A 23-year-old female presents with severe headache described as the worst headache of my life, sudden onset while exercising. She reports neck stiffness and photophobia. Vital signs: BP 168/94 mmHg, HR 92 bpm, RR 18/min, Temp 37.8C. Neurological exam reveals nuchal rigidity. CT head is negative. The patient's family is present and asking questions.",
    centerOptions: ["Subarachnoid hemorrhage","Tension headache","Meningitis","Migraine with aura"],
    centerCorrect: 0,
    leftFindings: ["Thunderclap headache - worst headache of life","Sudden onset during physical exertion","Nuchal rigidity on examination","Photophobia","Gradual onset over several hours","Aura with visual scotoma preceding headache"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Perform lumbar puncture to assess for xanthochromia","Order CT angiography to identify aneurysm","Maintain strict bed rest with dim lighting","Administer IV nimodipine to prevent vasospasm","Discharge with analgesics if CT is negative","Initiate seizure precautions"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Thunderclap headache with sudden onset during exertion, nuchal rigidity, and photophobia are classic for subarachnoid hemorrhage even with a negative CT (sensitivity decreases after 6 hours).",
      findings: "Worst headache of life with sudden onset, exertional trigger, nuchal rigidity, and photophobia strongly suggest SAH. Gradual onset and visual aura are migraine features.",
      actions: "Lumbar puncture after negative CT detects xanthochromia (blood breakdown products). CTA identifies the bleeding source. Bed rest reduces rebleeding risk. Nimodipine prevents cerebral vasospasm. Seizure precautions prevent further injury. Discharge without LP is unsafe."
    },
    bodySystem: "Neurological",
    tier: "rpn"
  },
  {
    id: "bt_rpn_gastrointestinal_29_1",
    scenario: "A 40-year-old male with a history of alcohol use disorder presents with hematemesis of approximately 500 mL of bright red blood. He appears pale, anxious, and diaphoretic. Vital signs: BP 88/52 mmHg, HR 128 bpm, RR 24/min, SpO2 96%. Abdomen is distended with a fluid wave. He has spider angiomata on his chest and palmar erythema. The patient's family is present and asking questions.",
    centerOptions: ["Esophageal variceal hemorrhage","Peptic ulcer disease bleeding","Mallory-Weiss tear","Gastric carcinoma"],
    centerCorrect: 0,
    leftFindings: ["Large-volume hematemesis with bright red blood","Signs of portal hypertension (ascites, spider angiomata)","Hemodynamic instability (hypotension, tachycardia)","History of alcohol use disorder","Epigastric pain relieved by eating","Coffee-ground emesis with melena only"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Establish two large-bore IV lines for volume resuscitation","Type and crossmatch for packed red blood cells","Administer IV octreotide to reduce portal pressure","Prepare for emergent endoscopy","Insert nasogastric tube for gastric lavage first","Administer IV proton pump inhibitor"],
    rightCorrect: [0,1,2,3],
    rightSelectCount: 4,
    rationale: {
      condition: "Large-volume hematemesis in a patient with alcohol use disorder and signs of portal hypertension (ascites, spider angiomata, palmar erythema) is consistent with esophageal variceal bleeding.",
      findings: "Bright red hematemesis, portal hypertension signs, hemodynamic instability, and alcohol history point to variceal hemorrhage. Epigastric pain relieved by eating suggests PUD. Coffee-ground emesis suggests slower upper GI bleed.",
      actions: "Large-bore IVs enable rapid resuscitation. Blood products correct hemorrhagic shock. Octreotide reduces portal venous pressure. Emergent endoscopy allows band ligation or sclerotherapy. NG tube in suspected varices is controversial and may worsen bleeding. PPI is appropriate for PUD but not primary therapy for varices."
    },
    bodySystem: "Gastrointestinal",
    tier: "rpn"
  },
  {
    id: "bt_rpn_gastrointestinal_30_1",
    scenario: "A 30-year-old female presents with acute onset right lower quadrant pain that began periumbilically 12 hours ago and migrated. She reports nausea, one episode of vomiting, and anorexia. Vital signs: BP 126/78 mmHg, HR 96 bpm, RR 18/min, Temp 38.4C. McBurney's point tenderness is positive. Rovsing sign is positive. WBC 14,200/mm3. The patient's family is present and asking questions.",
    centerOptions: ["Acute appendicitis","Ectopic pregnancy","Ovarian torsion","Crohn's disease flare"],
    centerCorrect: 0,
    leftFindings: ["Pain migration from periumbilical to right lower quadrant","McBurney's point tenderness","Positive Rovsing sign","Leukocytosis with left shift","Positive pregnancy test","Chronic intermittent cramping with bloody diarrhea"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Maintain NPO status","Administer IV fluids and antibiotics","Prepare patient for surgical consultation","Obtain CT abdomen/pelvis with contrast","Administer oral laxatives for constipation","Apply heating pad to abdomen for comfort"],
    rightCorrect: [0,1,2,3],
    rightSelectCount: 4,
    rationale: {
      condition: "Classic migratory pain from periumbilical to RLQ, positive McBurney's and Rovsing signs, fever, and leukocytosis strongly suggest acute appendicitis.",
      findings: "Pain migration pattern, McBurney's tenderness, positive Rovsing sign, and elevated WBC are classic appendicitis findings. Positive pregnancy test suggests ectopic pregnancy. Chronic bloody diarrhea suggests Crohn's.",
      actions: "NPO status prepares for potential surgery. IV fluids maintain hydration and antibiotics prevent peritonitis. Surgical consult is essential. CT confirms diagnosis. Laxatives are contraindicated with possible appendicitis. Heat application may increase inflammation risk."
    },
    bodySystem: "Gastrointestinal",
    tier: "rpn"
  },
  {
    id: "bt_rpn_renalurinary_31_1",
    scenario: "A 57-year-old male with a history of type 2 diabetes and chronic kidney disease (Stage 3) presents with generalized weakness, nausea, and muscle cramping. Lab results show: K+ 6.8 mEq/L, BUN 48 mg/dL, Creatinine 4.2 mg/dL, GFR 18 mL/min. ECG shows peaked T waves and widened QRS complex. The patient's family is present and asking questions.",
    centerOptions: ["Severe hyperkalemia with ECG changes","Diabetic ketoacidosis","Hyponatremia","Acute renal failure"],
    centerCorrect: 0,
    leftFindings: ["Potassium 6.8 mEq/L","Peaked T waves on ECG","Widened QRS complex","Muscle weakness and cramping","Deep Kussmaul respirations","Serum sodium 118 mEq/L"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer IV calcium gluconate for cardiac membrane stabilization","Administer insulin with dextrose to shift potassium intracellularly","Place on continuous cardiac monitoring","Administer sodium polystyrene sulfonate (Kayexalate)","Administer potassium chloride supplement","Prepare for possible emergent hemodialysis"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Potassium of 6.8 mEq/L with ECG changes (peaked T waves, widened QRS) represents a cardiac emergency requiring immediate treatment to prevent fatal arrhythmia.",
      findings: "Severely elevated potassium, peaked T waves, widened QRS, and neuromuscular symptoms confirm symptomatic hyperkalemia. Kussmaul breathing is a DKA finding. Low sodium would indicate hyponatremia.",
      actions: "Calcium gluconate stabilizes cardiac membranes immediately (does not lower K+). Insulin/dextrose shifts K+ into cells. Continuous monitoring detects arrhythmias. Kayexalate removes K+ from the body. Hemodialysis is definitive treatment for refractory cases. Additional potassium is absolutely contraindicated."
    },
    bodySystem: "Renal/Urinary",
    tier: "rpn"
  },
  {
    id: "bt_rpn_endocrine_32_1",
    scenario: "A 17-year-old female with Type 1 diabetes is brought to the ED by her roommate. She has had nausea, vomiting, and abdominal pain for 2 days following a urinary tract infection. She appears dehydrated with dry mucous membranes. Vital signs: BP 96/58 mmHg, HR 118 bpm, RR 28/min deep (Kussmaul), Temp 38.1C. Labs: Blood glucose 486 mg/dL, pH 7.18, HCO3 10 mEq/L, Anion gap 24, Serum K+ 5.6 mEq/L. The patient's family is present and asking questions.",
    centerOptions: ["Diabetic ketoacidosis","Hyperosmolar hyperglycemic state","Lactic acidosis","Uremic acidosis"],
    centerCorrect: 0,
    leftFindings: ["Blood glucose 486 mg/dL with metabolic acidosis","Kussmaul respirations (deep and rapid)","Elevated anion gap of 24","Type 1 diabetes with intercurrent infection","Serum osmolality greater than 320 mOsm/kg","Gradual onset over 1-2 weeks"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Initiate aggressive IV normal saline resuscitation","Begin continuous IV regular insulin infusion","Monitor serum potassium every 1-2 hours","Administer IV potassium when K+ falls below 5.3 mEq/L","Administer subcutaneous long-acting insulin immediately","Monitor blood glucose hourly"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Type 1 diabetes, severe hyperglycemia, metabolic acidosis (pH 7.18, low HCO3), elevated anion gap, and Kussmaul respirations confirm DKA triggered by infection.",
      findings: "High glucose with acidosis, Kussmaul breathing (compensatory CO2 elimination), high anion gap (ketoacids), and Type 1 DM with infection trigger are diagnostic. Osmolality greater than 320 and gradual onset are HHS features.",
      actions: "IV NS corrects severe dehydration. Continuous insulin infusion corrects hyperglycemia and halts ketogenesis. K+ monitoring is critical as insulin drives K+ intracellularly. Replace K+ when it drops below 5.3 to prevent hypokalemia. Hourly glucose monitoring guides insulin titration. SubQ long-acting insulin during acute DKA is inappropriate."
    },
    bodySystem: "Endocrine",
    tier: "rpn"
  },
  {
    id: "bt_rpn_endocrine_33_1",
    scenario: "A 43-year-old female is found unresponsive by coworkers at her office. She has a medical alert bracelet indicating Addison's disease. Vital signs: BP 72/48 mmHg, HR 130 bpm, RR 22/min, Temp 36.0C, Blood glucose 52 mg/dL. Skin appears hyperpigmented. Serum sodium is 126 mEq/L, potassium 6.1 mEq/L. The patient's family is present and asking questions.",
    centerOptions: ["Adrenal crisis (acute adrenal insufficiency)","Septic shock","Hypoglycemic episode","Myxedema coma"],
    centerCorrect: 0,
    leftFindings: ["Profound hypotension refractory to fluids alone","Hypoglycemia (blood glucose 52 mg/dL)","Hyponatremia with hyperkalemia","Known Addison's disease","High fever with chills","Severe hypothermia with bradycardia"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer IV hydrocortisone 100 mg STAT","Initiate aggressive IV normal saline with dextrose","Administer IV dextrose 50% for hypoglycemia","Monitor hemodynamic status continuously","Hold all corticosteroids until cortisol level returns","Obtain random cortisol and ACTH levels before treatment if possible"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Unresponsiveness, severe hypotension, hypoglycemia, hyponatremia, hyperkalemia, and known Addison's disease are classic for adrenal crisis requiring emergent glucocorticoid replacement.",
      findings: "Refractory hypotension, hypoglycemia, electrolyte pattern (low Na, high K), and Addison's history confirm adrenal crisis. High fever suggests sepsis. Hypothermia with bradycardia suggests myxedema coma.",
      actions: "IV hydrocortisone is life-saving and must not be delayed. IV NS with dextrose corrects dehydration and hypoglycemia. D50 treats acute hypoglycemia. Continuous monitoring detects hemodynamic changes. Cortisol/ACTH levels should be drawn before treatment if it does not delay therapy. Withholding steroids is dangerous."
    },
    bodySystem: "Endocrine",
    tier: "rpn"
  },
  {
    id: "bt_rpn_hematology_34_1",
    scenario: "A 1-year-old African American male presents to the ED with severe bilateral leg pain, swollen hands, and fever. His mother reports he has sickle cell disease. Vital signs: BP 100/62 mmHg, HR 122 bpm, RR 24/min, Temp 39.2C, SpO2 91%. CBC shows Hgb 6.2 g/dL, WBC 18,400/mm3, reticulocyte count 12%. The patient's family is present and asking questions.",
    centerOptions: ["Vaso-occlusive sickle cell crisis with fever","Osteomyelitis","Acute lymphoblastic leukemia","Juvenile rheumatoid arthritis"],
    centerCorrect: 0,
    leftFindings: ["Severe bilateral bone pain","Known sickle cell disease","Fever with leukocytosis","Hemoglobin 6.2 g/dL with elevated reticulocytes","Painless joint swelling without warmth","Pancytopenia with blast cells"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer IV opioid analgesics for pain management","Initiate aggressive IV fluid hydration","Obtain blood cultures before antibiotics","Administer supplemental oxygen for SpO2 below 95%","Apply cold compresses to painful areas","Prepare for possible blood transfusion"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "A child with known sickle cell disease presenting with bilateral bone pain, dactylitis, fever, anemia, and elevated reticulocytes indicates vaso-occlusive crisis with possible infection requiring urgent treatment.",
      findings: "Bilateral bone pain, sickle cell history, fever, anemia with reticulocytosis (hemolysis compensation) confirm crisis. Painless joint swelling suggests JRA. Pancytopenia with blasts suggests leukemia.",
      actions: "IV opioids address severe pain (do not undertreat sickle cell pain). IV fluids reduce blood viscosity and sickling. Blood cultures identify infection source. O2 maintains oxygenation to reduce sickling. Transfusion may be needed for severe anemia. Cold compresses are contraindicated as cold promotes sickling."
    },
    bodySystem: "Hematology",
    tier: "rpn"
  },
  {
    id: "bt_rpn_mentalhealth_35_1",
    scenario: "A 27-year-old male is brought to the psychiatric emergency department by police after being found on a bridge railing. He reports feeling hopeless for 3 months after losing his job and a recent divorce. He states he has a plan to use a firearm stored at his home. He admits to heavy alcohol use daily. He has no prior psychiatric history. Vital signs are stable. The patient's family is present and asking questions.",
    centerOptions: ["Acute suicidal crisis with imminent risk","Major depressive episode without suicidality","Adjustment disorder with depressed mood","Alcohol use disorder only"],
    centerCorrect: 0,
    leftFindings: ["Verbalized specific plan with access to lethal means","Hopelessness lasting 3 months","Multiple recent psychosocial stressors (job loss, divorce)","Active heavy alcohol use (disinhibiting factor)","Reports passive thoughts without plan","Denies any intent to harm self"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Implement one-to-one continuous observation","Initiate safety planning and restrict access to lethal means","Obtain psychiatric consultation for inpatient admission","Screen for substance intoxication and withdrawal","Discharge with outpatient follow-up referral","Ensure therapeutic, non-judgmental communication"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Active suicidal ideation with a specific lethal plan (firearm), access to means, multiple risk factors (hopelessness, substance use, psychosocial stressors), and behavioral evidence (found on bridge) indicate imminent suicide risk.",
      findings: "Specific plan with access, hopelessness, stressors, and alcohol use as a disinhibitor are high-risk factors. Passive thoughts without plan and denial of intent would lower risk but are not present here.",
      actions: "One-to-one observation prevents self-harm. Safety planning addresses means restriction. Psychiatric consult evaluates for involuntary hold if needed. Substance screening identifies intoxication. Therapeutic communication builds rapport. Discharge is unsafe given imminent risk level."
    },
    bodySystem: "Mental Health",
    tier: "rpn"
  },
  {
    id: "bt_rpn_immuneinfectious_36_1",
    scenario: "A 66-year-old male nursing home resident presents with altered mental status, fever, and productive cough with rust-colored sputum for 2 days. He has a history of COPD and type 2 diabetes. Vital signs: BP 86/54 mmHg, HR 112 bpm, RR 28/min, Temp 39.4C, SpO2 86% on room air. WBC 22,600/mm3. Lactate 4.2 mmol/L. Chest X-ray shows right lower lobe consolidation. The patient's family is present and asking questions.",
    centerOptions: ["Sepsis secondary to community-acquired pneumonia","COPD exacerbation","Acute heart failure","Aspiration pneumonitis"],
    centerCorrect: 0,
    leftFindings: ["Fever with productive rust-colored sputum","Hypotension with tachycardia (signs of septic shock)","Elevated lactate 4.2 mmol/L indicating tissue hypoperfusion","Right lower lobe consolidation on chest X-ray","Bilateral wheezing without consolidation","Frothy pink sputum with bilateral infiltrates"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Initiate IV broad-spectrum antibiotics within 1 hour","Administer 30 mL/kg IV crystalloid bolus","Obtain blood cultures before antibiotics if possible","Apply supplemental oxygen to target SpO2 above 94%","Administer IV corticosteroids as first-line treatment","Measure serial lactate levels to assess resuscitation adequacy"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Suspected infection (pneumonia), organ dysfunction (hypotension, altered mental status), and elevated lactate greater than 2 mmol/L meet Sepsis-3 criteria. This represents septic shock requiring the SEP-1 bundle.",
      findings: "Fever, productive cough, consolidation confirm pneumonia source. Hypotension and tachycardia indicate shock. Elevated lactate confirms tissue hypoperfusion. Wheezing without consolidation suggests COPD. Frothy pink sputum suggests heart failure.",
      actions: "Antibiotics within 1 hour reduce mortality in sepsis. Fluid bolus restores perfusion. Blood cultures guide targeted therapy. Oxygen corrects hypoxemia. Corticosteroids are not first-line for sepsis (reserved for refractory shock). Serial lactate measures guide resuscitation."
    },
    bodySystem: "Immune/Infectious",
    tier: "rpn"
  },
  {
    id: "bt_rpn_reproductivematernity_37_1",
    scenario: "A 23-year-old G2P1 at 34 weeks gestation presents with sudden onset of severe abdominal pain and vaginal bleeding. She reports the pain is constant and her abdomen feels rigid and board-like. She has a history of chronic hypertension. Vital signs: BP 168/108 mmHg, HR 120 bpm, RR 24/min. Fetal heart rate shows persistent late decelerations with decreased variability. The patient's family is present and asking questions.",
    centerOptions: ["Placental abruption","Placenta previa","Uterine rupture","Preterm labor"],
    centerCorrect: 0,
    leftFindings: ["Sudden onset constant abdominal pain with rigidity","Dark red vaginal bleeding","Board-like rigid uterus on palpation","Chronic hypertension as risk factor","Painless bright red vaginal bleeding","Intermittent cramping with progressive cervical dilation"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Initiate continuous fetal monitoring","Establish two large-bore IV lines for fluid resuscitation","Prepare for emergent cesarean delivery","Type and crossmatch blood products","Perform digital cervical examination","Administer IV magnesium sulfate for seizure prophylaxis"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Sudden severe constant pain, board-like rigidity, dark bleeding, chronic HTN risk factor, and fetal distress (late decels, decreased variability) are classic for placental abruption.",
      findings: "Constant pain with rigidity (Couvelaire uterus), dark bleeding, and HTN history are hallmarks. Painless bright bleeding suggests previa. Intermittent cramping with dilation suggests preterm labor.",
      actions: "Continuous FHR monitoring detects fetal compromise. Large-bore IVs prepare for hemorrhage management. Emergent cesarean is indicated for fetal distress. Blood products address hemorrhagic shock. MgSO4 prevents eclamptic seizures with severe HTN. Digital exam is contraindicated until previa is ruled out."
    },
    bodySystem: "Reproductive/Maternity",
    tier: "rpn"
  },
  {
    id: "bt_rpn_pediatrics_38_1",
    scenario: "A 1-year-old male is brought to the ED with a barking cough, inspiratory stridor, and hoarse voice that started after a mild upper respiratory infection. His parents report the symptoms worsened tonight. He has mild substernal retractions. Vital signs: HR 120 bpm, RR 30/min, Temp 38.3C, SpO2 93%. He is sitting upright and appears anxious but alert. The patient's family is present and asking questions.",
    centerOptions: ["Moderate croup (laryngotracheobronchitis)","Epiglottitis","Foreign body aspiration","Bacterial tracheitis"],
    centerCorrect: 0,
    leftFindings: ["Barking (seal-like) cough","Inspiratory stridor at rest","Preceded by upper respiratory infection","Hoarse voice with mild retractions","Sudden onset while eating with unilateral wheeze","Drooling with tripod positioning and high fever"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer nebulized racemic epinephrine","Administer oral or IM dexamethasone","Keep the child calm and in a position of comfort","Monitor for rebound stridor after epinephrine","Examine the throat with tongue depressor","Place on continuous pulse oximetry"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Barking cough, inspiratory stridor, hoarseness following URI, and age 6 months to 3 years are classic for viral croup (laryngotracheobronchitis), most commonly caused by parainfluenza virus.",
      findings: "Barking cough, stridor at rest, URI prodrome, and hoarseness with retractions confirm moderate croup. Sudden onset with eating suggests foreign body. Drooling, tripod, and high fever suggest epiglottitis.",
      actions: "Racemic epinephrine reduces subglottic edema. Dexamethasone reduces inflammation (single dose is standard). Keeping the child calm prevents worsening airway obstruction. Rebound monitoring detects recurrence after epinephrine. Pulse oximetry tracks oxygenation. Throat examination with a tongue depressor is contraindicated as it may worsen obstruction and is specifically avoided in suspected epiglottitis."
    },
    bodySystem: "Pediatrics",
    tier: "rpn"
  },
  {
    id: "bt_rpn_emergencytrauma_39_1",
    scenario: "A 29-year-old male arrives via EMS after a motorcycle collision at approximately 60 km/h. He is alert but confused. He has a large open wound on the right thigh with visible bone and significant hemorrhage. Vital signs: BP 82/50 mmHg, HR 138 bpm, RR 28/min, SpO2 94%. He is pale, cool, and diaphoretic. Estimated blood loss is greater than 1,500 mL. The patient's family is present and asking questions.",
    centerOptions: ["Hemorrhagic shock (Class III-IV)","Neurogenic shock","Cardiogenic shock","Tension pneumothorax"],
    centerCorrect: 0,
    leftFindings: ["Tachycardia with hypotension","Pale, cool, diaphoretic skin","Open fracture with greater than 1,500 mL estimated blood loss","Altered mental status (confusion)","Warm, flushed skin with bradycardia","Distended neck veins with tracheal deviation"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Apply direct pressure and tourniquet to hemorrhaging extremity","Initiate massive transfusion protocol","Establish two large-bore IV lines with warmed fluids","Perform primary survey using ABCDE approach","Elevate the injured extremity above heart level only","Obtain type and crossmatch and administer blood products"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Tachycardia, hypotension, altered mental status, cool/pale/diaphoretic skin, and estimated blood loss greater than 1,500 mL in a trauma patient indicate Class III-IV hemorrhagic shock.",
      findings: "Tachycardia, hypotension, cool diaphoretic skin, and AMS with significant blood loss are classic hemorrhagic shock findings. Warm flushed skin with bradycardia suggests neurogenic shock. Distended neck veins with tracheal deviation suggests tension pneumothorax.",
      actions: "Direct pressure and tourniquet control active hemorrhage. Massive transfusion protocol provides balanced blood product resuscitation. Large-bore IVs enable rapid volume replacement. ABCDE primary survey ensures systematic assessment. Blood products restore oxygen-carrying capacity. Elevation alone is insufficient for active hemorrhage of this magnitude."
    },
    bodySystem: "Emergency/Trauma",
    tier: "rpn"
  },
  {
    id: "bt_rpn_musculoskeletal_40_1",
    scenario: "A 14-year-old male presents 6 hours after a tibial fracture reduction and casting. He reports increasing severe pain in his lower leg that is not relieved by prescribed opioids. Pain worsens with passive dorsiflexion of the toes. His leg feels tight and tense. Capillary refill is 4 seconds. He reports tingling and numbness in his toes. The patient's family is present and asking questions.",
    centerOptions: ["Compartment syndrome","Deep vein thrombosis","Fat embolism syndrome","Cellulitis"],
    centerCorrect: 0,
    leftFindings: ["Pain out of proportion to injury not relieved by analgesics","Pain with passive stretch (dorsiflexion)","Paresthesia (tingling and numbness)","Tense and swollen compartment","Warmth and erythema along the vein","Petechial rash with confusion"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Notify surgeon immediately for possible fasciotomy","Remove or bivalve the cast immediately","Elevate the limb to heart level only (not above)","Monitor neurovascular status every 15-30 minutes","Apply compression bandage to reduce swelling","Measure compartment pressures if available"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "The 5 Ps of compartment syndrome: Pain out of proportion, Pain with passive stretch, Paresthesia, Pressure (tense compartment), and delayed capillary refill indicate a surgical emergency.",
      findings: "Disproportionate pain, pain with passive stretch, paresthesia, and tense compartment are classic. Warmth along a vein suggests DVT. Petechial rash with confusion suggests fat embolism.",
      actions: "Surgical fasciotomy is definitive treatment. Cast removal releases external pressure. Elevate to heart level (not above, which could worsen ischemia). Frequent neurovascular checks track progression. Compartment pressure measurement confirms diagnosis. Compression is contraindicated as it increases compartment pressure."
    },
    bodySystem: "Musculoskeletal",
    tier: "rpn"
  },
  {
    id: "bt_rpn_integumentary_41_1",
    scenario: "A 40-year-old male is admitted to the burn unit after a house fire with estimated 35% TBSA second and third degree burns to his chest, bilateral arms, and face. He was in an enclosed space with smoke exposure. His voice is hoarse and he has singed nasal hairs. Vital signs: BP 102/64 mmHg, HR 124 bpm, RR 26/min, SpO2 92%. He weighs 80 kg. The patient's family is present and asking questions.",
    centerOptions: ["Major thermal burn with inhalation injury","Superficial burn requiring outpatient care","Chemical burn exposure","Electrical burn injury"],
    centerCorrect: 0,
    leftFindings: ["35% TBSA second and third degree burns","Hoarse voice with singed nasal hairs (inhalation injury signs)","Enclosed space fire exposure","Facial burns present","Burns limited to extremities only","Entry and exit wounds visible"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Initiate Parkland formula fluid resuscitation (4 mL x kg x %TBSA)","Prepare for early intubation due to inhalation injury signs","Obtain carboxyhemoglobin level","Monitor urine output target 0.5-1 mL/kg/hr","Apply ice directly to burn wounds","Administer tetanus prophylaxis if not current"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Greater than 20% TBSA burns with facial involvement, hoarse voice, singed nasal hairs, and enclosed space exposure indicate major burns with high suspicion for inhalation injury.",
      findings: "35% TBSA, hoarseness, singed nasal hairs, enclosed space, and facial burns are classic for inhalation injury. Burns limited to extremities without airway signs lower risk. Entry/exit wounds suggest electrical injury.",
      actions: "Parkland formula guides crystalloid resuscitation (half in first 8 hours). Early intubation protects airway before edema progresses. Carboxyhemoglobin detects CO poisoning. Urine output guides fluid adequacy. Tetanus prophylaxis prevents infection. Ice is contraindicated as it causes vasoconstriction and worsens tissue damage."
    },
    bodySystem: "Integumentary",
    tier: "rpn"
  },
  {
    id: "bt_rpn_cardiovascular_42_2",
    scenario: "A 76-year-old male with a history of hypertension presents to the emergency department with crushing substernal chest pain radiating to the left arm and jaw. He is diaphoretic and nauseated. Vital signs: BP 158/94 mmHg, HR 102 bpm, RR 22/min, SpO2 94% on room air. ECG shows ST-segment elevation in leads II, III, and aVF. The patient has a history of medication non-adherence.",
    centerOptions: ["Inferior ST-elevation myocardial infarction","Unstable angina","Aortic dissection","Pulmonary embolism"],
    centerCorrect: 0,
    leftFindings: ["ST-elevation in leads II, III, aVF","Crushing substernal chest pain radiating to left arm","Diaphoresis and nausea","Elevated troponin levels expected","Normal chest X-ray findings","Bilateral equal blood pressures"],
    leftCorrect: [0,1,2],
    leftSelectCount: 3,
    rightActions: ["Administer aspirin 325 mg chewed immediately","Activate cardiac catheterization lab","Administer morphine for pain if not hypotensive","Administer thrombolytics without ECG confirmation","Obtain serial troponin levels","Discharge with follow-up appointment"],
    rightCorrect: [0,1,4],
    rightSelectCount: 3,
    rationale: {
      condition: "ST-elevation in inferior leads (II, III, aVF) with classic symptoms of crushing chest pain, diaphoresis, and nausea indicates an inferior STEMI requiring emergent intervention.",
      findings: "ST-elevation in inferior leads, crushing substernal pain radiating to the arm, and diaphoresis are hallmark findings of acute MI. Normal chest X-ray and bilateral equal BPs help rule out aortic dissection.",
      actions: "Aspirin inhibits platelet aggregation and is first-line. Cardiac catheterization lab activation enables primary PCI. Serial troponins confirm myocardial injury. Thrombolytics without ECG confirmation is inappropriate, and discharge is unsafe."
    },
    bodySystem: "Cardiovascular",
    tier: "rpn"
  },
  {
    id: "bt_rpn_cardiovascular_43_2",
    scenario: "A 80-year-old female with a history of atrial fibrillation and heart failure presents with increasing dyspnea, orthopnea, and bilateral lower extremity edema over 3 days. She reports sleeping on 3 pillows. Vital signs: BP 142/88 mmHg, HR 112 bpm irregular, RR 28/min, SpO2 88% on room air. Auscultation reveals bilateral crackles and an S3 gallop. BNP is 1,240 pg/mL. The patient has a history of medication non-adherence.",
    centerOptions: ["Acute decompensated heart failure","Community-acquired pneumonia","Chronic obstructive pulmonary disease exacerbation","Pleural effusion"],
    centerCorrect: 0,
    leftFindings: ["Bilateral crackles with S3 gallop","Orthopnea requiring 3-pillow elevation","BNP 1,240 pg/mL","Bilateral lower extremity edema","Productive cough with green sputum","Barrel chest with prolonged expiration"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer IV furosemide as ordered","Position in high Fowler's position","Apply supplemental oxygen to maintain SpO2 above 94%","Encourage increased oral fluid intake","Monitor strict intake and output","Administer IV normal saline bolus"],
    rightCorrect: [0,1,2,4],
    rightSelectCount: 4,
    rationale: {
      condition: "Bilateral crackles, S3 gallop, orthopnea, peripheral edema, and markedly elevated BNP (greater than 400 pg/mL) are classic findings of acute decompensated heart failure.",
      findings: "S3 gallop indicates volume overload. Orthopnea and elevated BNP confirm fluid status. Bilateral edema reflects right-sided congestion. Green sputum and barrel chest are distractors suggesting pneumonia and COPD respectively.",
      actions: "IV furosemide promotes diuresis. High Fowler's reduces preload and improves breathing. Oxygen treats hypoxemia. Strict I&O monitors fluid balance. Increased fluids and saline bolus would worsen volume overload."
    },
    bodySystem: "Cardiovascular",
    tier: "rpn"
  },
  {
    id: "bt_rpn_cardiovascular_44_2",
    scenario: "A 63-year-old male with uncontrolled hypertension presents with sudden onset of severe tearing chest pain radiating to the back between the scapulae. He appears anxious and diaphoretic. Vital signs: Right arm BP 182/110 mmHg, Left arm BP 148/90 mmHg, HR 118 bpm, RR 24/min. Chest X-ray shows widened mediastinum. The patient has a history of medication non-adherence.",
    centerOptions: ["Aortic dissection","Myocardial infarction","Tension pneumothorax","Esophageal rupture"],
    centerCorrect: 0,
    leftFindings: ["Tearing chest pain radiating to the back","Blood pressure differential between arms greater than 20 mmHg","Widened mediastinum on chest X-ray","History of uncontrolled hypertension","ST-elevation on ECG","Subcutaneous emphysema"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer IV beta-blocker to reduce heart rate and BP","Obtain emergent CT angiography","Prepare for possible surgical intervention","Administer thrombolytics immediately","Establish two large-bore IV lines","Administer aspirin 325 mg"],
    rightCorrect: [0,1,2,4],
    rightSelectCount: 4,
    rationale: {
      condition: "Sudden tearing chest pain radiating to the back, blood pressure differential greater than 20 mmHg between arms, and widened mediastinum are classic for aortic dissection.",
      findings: "Tearing pain to the back, BP differential, widened mediastinum, and uncontrolled HTN history are hallmark findings. ST-elevation suggests MI, and subcutaneous emphysema suggests esophageal rupture.",
      actions: "IV beta-blockers control heart rate and shear stress. CT angiography confirms diagnosis. Surgical prep is essential. Large-bore IVs allow resuscitation. Thrombolytics and aspirin are absolutely contraindicated as they would worsen hemorrhage."
    },
    bodySystem: "Cardiovascular",
    tier: "rpn"
  },
  {
    id: "bt_rpn_respiratory_45_2",
    scenario: "A 50-year-old female with a history of asthma presents to the emergency department with severe dyspnea, audible wheezing, and inability to speak in full sentences. She has used her albuterol inhaler 8 times today without relief. Vital signs: BP 138/82 mmHg, HR 124 bpm, RR 32/min, SpO2 87% on room air. Peak flow is 120 L/min (predicted 380 L/min). The patient has a history of medication non-adherence.",
    centerOptions: ["Severe acute asthma exacerbation (status asthmaticus)","Chronic obstructive pulmonary disease exacerbation","Anaphylaxis","Spontaneous pneumothorax"],
    centerCorrect: 0,
    leftFindings: ["Inability to speak in full sentences","Peak flow less than 33% of predicted","SpO2 87% on room air","No relief from repeated albuterol use","Inspiratory stridor","Unilateral absent breath sounds"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer continuous nebulized albuterol","Administer IV corticosteroids (methylprednisolone)","Prepare for possible intubation","Administer ipratropium bromide nebulization","Discharge with oral prednisone taper","Apply high-flow supplemental oxygen"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Severe dyspnea with inability to speak in full sentences, peak flow below 33% predicted, refractory to beta-agonist therapy, and hypoxemia indicate status asthmaticus requiring aggressive treatment.",
      findings: "Inability to speak in sentences, severely reduced peak flow, hypoxemia, and albuterol resistance are hallmarks of severe exacerbation. Stridor suggests upper airway obstruction, and unilateral absent sounds suggest pneumothorax.",
      actions: "Continuous nebulized albuterol provides sustained bronchodilation. IV steroids reduce inflammation. Intubation preparation ensures airway protection. Ipratropium provides additional bronchodilation. High-flow oxygen treats hypoxemia. Discharge is inappropriate for this severity."
    },
    bodySystem: "Respiratory",
    tier: "rpn"
  },
  {
    id: "bt_rpn_respiratory_46_2",
    scenario: "A 71-year-old male, 4 days post total hip replacement, suddenly develops sharp pleuritic chest pain, dyspnea, and hemoptysis. He is tachycardic and anxious. Vital signs: BP 110/70 mmHg, HR 118 bpm, RR 28/min, SpO2 89% on room air. D-dimer is 2,400 ng/mL. CT pulmonary angiography reveals a filling defect in the right main pulmonary artery. The patient has a history of medication non-adherence.",
    centerOptions: ["Pulmonary embolism","Hospital-acquired pneumonia","Fat embolism syndrome","Acute coronary syndrome"],
    centerCorrect: 0,
    leftFindings: ["Pleuritic chest pain with hemoptysis","Recent surgical procedure with immobility","D-dimer 2,400 ng/mL","CT showing filling defect in pulmonary artery","Petechial rash on chest and axillae","Productive cough with purulent sputum"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Initiate anticoagulation with IV heparin","Apply supplemental oxygen","Elevate the head of bed","Prepare for thrombolysis if hemodynamically unstable","Encourage early ambulation without restrictions","Monitor for signs of right ventricular failure"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Pleuritic chest pain, hemoptysis, tachycardia, and hypoxemia in a postoperative patient with elevated D-dimer and CT-confirmed filling defect confirm pulmonary embolism.",
      findings: "Pleuritic pain with hemoptysis, surgical immobility risk factor, markedly elevated D-dimer, and CT angiography findings are diagnostic. Petechial rash suggests fat embolism; purulent sputum suggests pneumonia.",
      actions: "IV heparin prevents clot propagation. Oxygen treats hypoxemia. Head elevation improves ventilation. Thrombolysis is reserved for massive PE with hemodynamic instability. Monitoring for RV failure detects deterioration. Unrestricted ambulation could dislodge further emboli."
    },
    bodySystem: "Respiratory",
    tier: "rpn"
  },
  {
    id: "bt_rpn_respiratory_47_2",
    scenario: "A 66-year-old male with a 40-pack-year smoking history presents with worsening dyspnea, increased sputum production with yellow-green color, and low-grade fever for 3 days. He uses home oxygen at 2 L/min. Vital signs: BP 136/82 mmHg, HR 98 bpm, RR 26/min, SpO2 85% on 2 L/min NC, Temp 38.2C. ABG: pH 7.31, PaCO2 58 mmHg, PaO2 52 mmHg, HCO3 28 mEq/L. The patient has a history of medication non-adherence.",
    centerOptions: ["Acute exacerbation of COPD","Community-acquired pneumonia","Acute asthma attack","Pulmonary fibrosis"],
    centerCorrect: 0,
    leftFindings: ["40-pack-year smoking history with chronic dyspnea","Increased purulent sputum production","Compensated respiratory acidosis on ABG","Hypoxemia despite home oxygen","No wheezing or reversible obstruction","Bilateral fine inspiratory crackles only"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Increase oxygen to maintain SpO2 88-92%","Administer short-acting bronchodilator nebulization","Administer systemic corticosteroids","Start antibiotics for infectious exacerbation","Administer high-flow oxygen to achieve SpO2 100%","Monitor for CO2 narcosis and worsening respiratory acidosis"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "A COPD patient with worsening dyspnea, increased purulent sputum, fever, and compensated respiratory acidosis with chronic CO2 retention meets criteria for acute COPD exacerbation.",
      findings: "Smoking history, baseline dyspnea, purulent sputum increase, and ABG showing compensated respiratory acidosis (elevated PaCO2 with elevated HCO3) confirm chronic CO2 retention with acute worsening.",
      actions: "Target SpO2 88-92% to avoid suppressing hypoxic drive. Bronchodilators relieve airflow obstruction. Steroids reduce inflammation. Antibiotics treat infectious trigger. High-flow O2 to 100% risks CO2 narcosis. Monitoring respiratory status is essential."
    },
    bodySystem: "Respiratory",
    tier: "rpn"
  },
  {
    id: "bt_rpn_neurological_48_2",
    scenario: "A 82-year-old male is brought to the emergency department by his wife who noticed sudden onset of right-sided facial droop, right arm weakness, and slurred speech 45 minutes ago. He has a history of atrial fibrillation and takes warfarin irregularly. Vital signs: BP 178/96 mmHg, HR 88 bpm irregular, RR 18/min, SpO2 97%. NIHSS score is 14. CT head shows no hemorrhage. The patient has a history of medication non-adherence.",
    centerOptions: ["Acute ischemic stroke","Hemorrhagic stroke","Transient ischemic attack","Bell's palsy"],
    centerCorrect: 0,
    leftFindings: ["Sudden right-sided facial droop and arm weakness","Slurred speech (dysarthria)","History of atrial fibrillation","CT head negative for hemorrhage","NIHSS score of 14","Gradual bilateral facial weakness"],
    leftCorrect: [0,1,2,3,4],
    leftSelectCount: 5,
    rightActions: ["Determine eligibility for IV alteplase (tPA) within window","Obtain STAT INR and coagulation studies","Maintain blood pressure below 185/110 mmHg if thrombolysis candidate","Administer aspirin 325 mg immediately before imaging","Perform neurological assessments every 15 minutes","Position head of bed flat if no increased ICP"],
    rightCorrect: [0,1,2,4,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Sudden onset focal neurological deficits (facial droop, arm weakness, dysarthria) with negative CT for hemorrhage and atrial fibrillation as embolic source confirms acute ischemic stroke.",
      findings: "Sudden unilateral deficits, dysarthria, A-fib history, negative CT, and elevated NIHSS are classic. Gradual bilateral weakness suggests other diagnoses like myasthenia gravis.",
      actions: "tPA eligibility assessment is time-critical (within 4.5 hours). INR is essential since the patient takes warfarin (tPA contraindicated if INR greater than 1.7). BP management enables safe thrombolysis. Frequent neuro checks detect deterioration. Flat HOB improves cerebral perfusion. Aspirin before imaging is contraindicated as hemorrhage must be ruled out first."
    },
    bodySystem: "Neurological",
    tier: "rpn"
  },
  {
    id: "bt_rpn_neurological_49_2",
    scenario: "A 36-year-old female presents with severe headache described as the worst headache of my life, sudden onset while exercising. She reports neck stiffness and photophobia. Vital signs: BP 168/94 mmHg, HR 92 bpm, RR 18/min, Temp 37.8C. Neurological exam reveals nuchal rigidity. CT head is negative. The patient has a history of medication non-adherence.",
    centerOptions: ["Subarachnoid hemorrhage","Tension headache","Meningitis","Migraine with aura"],
    centerCorrect: 0,
    leftFindings: ["Thunderclap headache - worst headache of life","Sudden onset during physical exertion","Nuchal rigidity on examination","Photophobia","Gradual onset over several hours","Aura with visual scotoma preceding headache"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Perform lumbar puncture to assess for xanthochromia","Order CT angiography to identify aneurysm","Maintain strict bed rest with dim lighting","Administer IV nimodipine to prevent vasospasm","Discharge with analgesics if CT is negative","Initiate seizure precautions"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Thunderclap headache with sudden onset during exertion, nuchal rigidity, and photophobia are classic for subarachnoid hemorrhage even with a negative CT (sensitivity decreases after 6 hours).",
      findings: "Worst headache of life with sudden onset, exertional trigger, nuchal rigidity, and photophobia strongly suggest SAH. Gradual onset and visual aura are migraine features.",
      actions: "Lumbar puncture after negative CT detects xanthochromia (blood breakdown products). CTA identifies the bleeding source. Bed rest reduces rebleeding risk. Nimodipine prevents cerebral vasospasm. Seizure precautions prevent further injury. Discharge without LP is unsafe."
    },
    bodySystem: "Neurological",
    tier: "rpn"
  },
  {
    id: "bt_rpn_gastrointestinal_50_2",
    scenario: "A 53-year-old male with a history of alcohol use disorder presents with hematemesis of approximately 500 mL of bright red blood. He appears pale, anxious, and diaphoretic. Vital signs: BP 88/52 mmHg, HR 128 bpm, RR 24/min, SpO2 96%. Abdomen is distended with a fluid wave. He has spider angiomata on his chest and palmar erythema. The patient has a history of medication non-adherence.",
    centerOptions: ["Esophageal variceal hemorrhage","Peptic ulcer disease bleeding","Mallory-Weiss tear","Gastric carcinoma"],
    centerCorrect: 0,
    leftFindings: ["Large-volume hematemesis with bright red blood","Signs of portal hypertension (ascites, spider angiomata)","Hemodynamic instability (hypotension, tachycardia)","History of alcohol use disorder","Epigastric pain relieved by eating","Coffee-ground emesis with melena only"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Establish two large-bore IV lines for volume resuscitation","Type and crossmatch for packed red blood cells","Administer IV octreotide to reduce portal pressure","Prepare for emergent endoscopy","Insert nasogastric tube for gastric lavage first","Administer IV proton pump inhibitor"],
    rightCorrect: [0,1,2,3],
    rightSelectCount: 4,
    rationale: {
      condition: "Large-volume hematemesis in a patient with alcohol use disorder and signs of portal hypertension (ascites, spider angiomata, palmar erythema) is consistent with esophageal variceal bleeding.",
      findings: "Bright red hematemesis, portal hypertension signs, hemodynamic instability, and alcohol history point to variceal hemorrhage. Epigastric pain relieved by eating suggests PUD. Coffee-ground emesis suggests slower upper GI bleed.",
      actions: "Large-bore IVs enable rapid resuscitation. Blood products correct hemorrhagic shock. Octreotide reduces portal venous pressure. Emergent endoscopy allows band ligation or sclerotherapy. NG tube in suspected varices is controversial and may worsen bleeding. PPI is appropriate for PUD but not primary therapy for varices."
    },
    bodySystem: "Gastrointestinal",
    tier: "rpn"
  },
  {
    id: "bt_rpn_gastrointestinal_51_2",
    scenario: "A 43-year-old female presents with acute onset right lower quadrant pain that began periumbilically 12 hours ago and migrated. She reports nausea, one episode of vomiting, and anorexia. Vital signs: BP 126/78 mmHg, HR 96 bpm, RR 18/min, Temp 38.4C. McBurney's point tenderness is positive. Rovsing sign is positive. WBC 14,200/mm3. The patient has a history of medication non-adherence.",
    centerOptions: ["Acute appendicitis","Ectopic pregnancy","Ovarian torsion","Crohn's disease flare"],
    centerCorrect: 0,
    leftFindings: ["Pain migration from periumbilical to right lower quadrant","McBurney's point tenderness","Positive Rovsing sign","Leukocytosis with left shift","Positive pregnancy test","Chronic intermittent cramping with bloody diarrhea"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Maintain NPO status","Administer IV fluids and antibiotics","Prepare patient for surgical consultation","Obtain CT abdomen/pelvis with contrast","Administer oral laxatives for constipation","Apply heating pad to abdomen for comfort"],
    rightCorrect: [0,1,2,3],
    rightSelectCount: 4,
    rationale: {
      condition: "Classic migratory pain from periumbilical to RLQ, positive McBurney's and Rovsing signs, fever, and leukocytosis strongly suggest acute appendicitis.",
      findings: "Pain migration pattern, McBurney's tenderness, positive Rovsing sign, and elevated WBC are classic appendicitis findings. Positive pregnancy test suggests ectopic pregnancy. Chronic bloody diarrhea suggests Crohn's.",
      actions: "NPO status prepares for potential surgery. IV fluids maintain hydration and antibiotics prevent peritonitis. Surgical consult is essential. CT confirms diagnosis. Laxatives are contraindicated with possible appendicitis. Heat application may increase inflammation risk."
    },
    bodySystem: "Gastrointestinal",
    tier: "rpn"
  },
  {
    id: "bt_rpn_renalurinary_52_2",
    scenario: "A 70-year-old male with a history of type 2 diabetes and chronic kidney disease (Stage 3) presents with generalized weakness, nausea, and muscle cramping. Lab results show: K+ 6.8 mEq/L, BUN 48 mg/dL, Creatinine 4.2 mg/dL, GFR 18 mL/min. ECG shows peaked T waves and widened QRS complex. The patient has a history of medication non-adherence.",
    centerOptions: ["Severe hyperkalemia with ECG changes","Diabetic ketoacidosis","Hyponatremia","Acute renal failure"],
    centerCorrect: 0,
    leftFindings: ["Potassium 6.8 mEq/L","Peaked T waves on ECG","Widened QRS complex","Muscle weakness and cramping","Deep Kussmaul respirations","Serum sodium 118 mEq/L"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer IV calcium gluconate for cardiac membrane stabilization","Administer insulin with dextrose to shift potassium intracellularly","Place on continuous cardiac monitoring","Administer sodium polystyrene sulfonate (Kayexalate)","Administer potassium chloride supplement","Prepare for possible emergent hemodialysis"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Potassium of 6.8 mEq/L with ECG changes (peaked T waves, widened QRS) represents a cardiac emergency requiring immediate treatment to prevent fatal arrhythmia.",
      findings: "Severely elevated potassium, peaked T waves, widened QRS, and neuromuscular symptoms confirm symptomatic hyperkalemia. Kussmaul breathing is a DKA finding. Low sodium would indicate hyponatremia.",
      actions: "Calcium gluconate stabilizes cardiac membranes immediately (does not lower K+). Insulin/dextrose shifts K+ into cells. Continuous monitoring detects arrhythmias. Kayexalate removes K+ from the body. Hemodialysis is definitive treatment for refractory cases. Additional potassium is absolutely contraindicated."
    },
    bodySystem: "Renal/Urinary",
    tier: "rpn"
  },
  {
    id: "bt_rpn_endocrine_53_2",
    scenario: "A 30-year-old female with Type 1 diabetes is brought to the ED by her roommate. She has had nausea, vomiting, and abdominal pain for 2 days following a urinary tract infection. She appears dehydrated with dry mucous membranes. Vital signs: BP 96/58 mmHg, HR 118 bpm, RR 28/min deep (Kussmaul), Temp 38.1C. Labs: Blood glucose 486 mg/dL, pH 7.18, HCO3 10 mEq/L, Anion gap 24, Serum K+ 5.6 mEq/L. The patient has a history of medication non-adherence.",
    centerOptions: ["Diabetic ketoacidosis","Hyperosmolar hyperglycemic state","Lactic acidosis","Uremic acidosis"],
    centerCorrect: 0,
    leftFindings: ["Blood glucose 486 mg/dL with metabolic acidosis","Kussmaul respirations (deep and rapid)","Elevated anion gap of 24","Type 1 diabetes with intercurrent infection","Serum osmolality greater than 320 mOsm/kg","Gradual onset over 1-2 weeks"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Initiate aggressive IV normal saline resuscitation","Begin continuous IV regular insulin infusion","Monitor serum potassium every 1-2 hours","Administer IV potassium when K+ falls below 5.3 mEq/L","Administer subcutaneous long-acting insulin immediately","Monitor blood glucose hourly"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Type 1 diabetes, severe hyperglycemia, metabolic acidosis (pH 7.18, low HCO3), elevated anion gap, and Kussmaul respirations confirm DKA triggered by infection.",
      findings: "High glucose with acidosis, Kussmaul breathing (compensatory CO2 elimination), high anion gap (ketoacids), and Type 1 DM with infection trigger are diagnostic. Osmolality greater than 320 and gradual onset are HHS features.",
      actions: "IV NS corrects severe dehydration. Continuous insulin infusion corrects hyperglycemia and halts ketogenesis. K+ monitoring is critical as insulin drives K+ intracellularly. Replace K+ when it drops below 5.3 to prevent hypokalemia. Hourly glucose monitoring guides insulin titration. SubQ long-acting insulin during acute DKA is inappropriate."
    },
    bodySystem: "Endocrine",
    tier: "rpn"
  },
  {
    id: "bt_rpn_endocrine_54_2",
    scenario: "A 56-year-old female is found unresponsive by coworkers at her office. She has a medical alert bracelet indicating Addison's disease. Vital signs: BP 72/48 mmHg, HR 130 bpm, RR 22/min, Temp 36.0C, Blood glucose 52 mg/dL. Skin appears hyperpigmented. Serum sodium is 126 mEq/L, potassium 6.1 mEq/L. The patient has a history of medication non-adherence.",
    centerOptions: ["Adrenal crisis (acute adrenal insufficiency)","Septic shock","Hypoglycemic episode","Myxedema coma"],
    centerCorrect: 0,
    leftFindings: ["Profound hypotension refractory to fluids alone","Hypoglycemia (blood glucose 52 mg/dL)","Hyponatremia with hyperkalemia","Known Addison's disease","High fever with chills","Severe hypothermia with bradycardia"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer IV hydrocortisone 100 mg STAT","Initiate aggressive IV normal saline with dextrose","Administer IV dextrose 50% for hypoglycemia","Monitor hemodynamic status continuously","Hold all corticosteroids until cortisol level returns","Obtain random cortisol and ACTH levels before treatment if possible"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Unresponsiveness, severe hypotension, hypoglycemia, hyponatremia, hyperkalemia, and known Addison's disease are classic for adrenal crisis requiring emergent glucocorticoid replacement.",
      findings: "Refractory hypotension, hypoglycemia, electrolyte pattern (low Na, high K), and Addison's history confirm adrenal crisis. High fever suggests sepsis. Hypothermia with bradycardia suggests myxedema coma.",
      actions: "IV hydrocortisone is life-saving and must not be delayed. IV NS with dextrose corrects dehydration and hypoglycemia. D50 treats acute hypoglycemia. Continuous monitoring detects hemodynamic changes. Cortisol/ACTH levels should be drawn before treatment if it does not delay therapy. Withholding steroids is dangerous."
    },
    bodySystem: "Endocrine",
    tier: "rpn"
  },
  {
    id: "bt_rpn_hematology_55_2",
    scenario: "A 14-year-old African American male presents to the ED with severe bilateral leg pain, swollen hands, and fever. His mother reports he has sickle cell disease. Vital signs: BP 100/62 mmHg, HR 122 bpm, RR 24/min, Temp 39.2C, SpO2 91%. CBC shows Hgb 6.2 g/dL, WBC 18,400/mm3, reticulocyte count 12%. The patient has a history of medication non-adherence.",
    centerOptions: ["Vaso-occlusive sickle cell crisis with fever","Osteomyelitis","Acute lymphoblastic leukemia","Juvenile rheumatoid arthritis"],
    centerCorrect: 0,
    leftFindings: ["Severe bilateral bone pain","Known sickle cell disease","Fever with leukocytosis","Hemoglobin 6.2 g/dL with elevated reticulocytes","Painless joint swelling without warmth","Pancytopenia with blast cells"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer IV opioid analgesics for pain management","Initiate aggressive IV fluid hydration","Obtain blood cultures before antibiotics","Administer supplemental oxygen for SpO2 below 95%","Apply cold compresses to painful areas","Prepare for possible blood transfusion"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "A child with known sickle cell disease presenting with bilateral bone pain, dactylitis, fever, anemia, and elevated reticulocytes indicates vaso-occlusive crisis with possible infection requiring urgent treatment.",
      findings: "Bilateral bone pain, sickle cell history, fever, anemia with reticulocytosis (hemolysis compensation) confirm crisis. Painless joint swelling suggests JRA. Pancytopenia with blasts suggests leukemia.",
      actions: "IV opioids address severe pain (do not undertreat sickle cell pain). IV fluids reduce blood viscosity and sickling. Blood cultures identify infection source. O2 maintains oxygenation to reduce sickling. Transfusion may be needed for severe anemia. Cold compresses are contraindicated as cold promotes sickling."
    },
    bodySystem: "Hematology",
    tier: "rpn"
  },
  {
    id: "bt_rpn_mentalhealth_56_2",
    scenario: "A 40-year-old male is brought to the psychiatric emergency department by police after being found on a bridge railing. He reports feeling hopeless for 3 months after losing his job and a recent divorce. He states he has a plan to use a firearm stored at his home. He admits to heavy alcohol use daily. He has no prior psychiatric history. Vital signs are stable. The patient has a history of medication non-adherence.",
    centerOptions: ["Acute suicidal crisis with imminent risk","Major depressive episode without suicidality","Adjustment disorder with depressed mood","Alcohol use disorder only"],
    centerCorrect: 0,
    leftFindings: ["Verbalized specific plan with access to lethal means","Hopelessness lasting 3 months","Multiple recent psychosocial stressors (job loss, divorce)","Active heavy alcohol use (disinhibiting factor)","Reports passive thoughts without plan","Denies any intent to harm self"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Implement one-to-one continuous observation","Initiate safety planning and restrict access to lethal means","Obtain psychiatric consultation for inpatient admission","Screen for substance intoxication and withdrawal","Discharge with outpatient follow-up referral","Ensure therapeutic, non-judgmental communication"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Active suicidal ideation with a specific lethal plan (firearm), access to means, multiple risk factors (hopelessness, substance use, psychosocial stressors), and behavioral evidence (found on bridge) indicate imminent suicide risk.",
      findings: "Specific plan with access, hopelessness, stressors, and alcohol use as a disinhibitor are high-risk factors. Passive thoughts without plan and denial of intent would lower risk but are not present here.",
      actions: "One-to-one observation prevents self-harm. Safety planning addresses means restriction. Psychiatric consult evaluates for involuntary hold if needed. Substance screening identifies intoxication. Therapeutic communication builds rapport. Discharge is unsafe given imminent risk level."
    },
    bodySystem: "Mental Health",
    tier: "rpn"
  },
  {
    id: "bt_rpn_immuneinfectious_57_2",
    scenario: "A 79-year-old male nursing home resident presents with altered mental status, fever, and productive cough with rust-colored sputum for 2 days. He has a history of COPD and type 2 diabetes. Vital signs: BP 86/54 mmHg, HR 112 bpm, RR 28/min, Temp 39.4C, SpO2 86% on room air. WBC 22,600/mm3. Lactate 4.2 mmol/L. Chest X-ray shows right lower lobe consolidation. The patient has a history of medication non-adherence.",
    centerOptions: ["Sepsis secondary to community-acquired pneumonia","COPD exacerbation","Acute heart failure","Aspiration pneumonitis"],
    centerCorrect: 0,
    leftFindings: ["Fever with productive rust-colored sputum","Hypotension with tachycardia (signs of septic shock)","Elevated lactate 4.2 mmol/L indicating tissue hypoperfusion","Right lower lobe consolidation on chest X-ray","Bilateral wheezing without consolidation","Frothy pink sputum with bilateral infiltrates"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Initiate IV broad-spectrum antibiotics within 1 hour","Administer 30 mL/kg IV crystalloid bolus","Obtain blood cultures before antibiotics if possible","Apply supplemental oxygen to target SpO2 above 94%","Administer IV corticosteroids as first-line treatment","Measure serial lactate levels to assess resuscitation adequacy"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Suspected infection (pneumonia), organ dysfunction (hypotension, altered mental status), and elevated lactate greater than 2 mmol/L meet Sepsis-3 criteria. This represents septic shock requiring the SEP-1 bundle.",
      findings: "Fever, productive cough, consolidation confirm pneumonia source. Hypotension and tachycardia indicate shock. Elevated lactate confirms tissue hypoperfusion. Wheezing without consolidation suggests COPD. Frothy pink sputum suggests heart failure.",
      actions: "Antibiotics within 1 hour reduce mortality in sepsis. Fluid bolus restores perfusion. Blood cultures guide targeted therapy. Oxygen corrects hypoxemia. Corticosteroids are not first-line for sepsis (reserved for refractory shock). Serial lactate measures guide resuscitation."
    },
    bodySystem: "Immune/Infectious",
    tier: "rpn"
  },
  {
    id: "bt_rpn_reproductivematernity_58_2",
    scenario: "A 36-year-old G2P1 at 34 weeks gestation presents with sudden onset of severe abdominal pain and vaginal bleeding. She reports the pain is constant and her abdomen feels rigid and board-like. She has a history of chronic hypertension. Vital signs: BP 168/108 mmHg, HR 120 bpm, RR 24/min. Fetal heart rate shows persistent late decelerations with decreased variability. The patient has a history of medication non-adherence.",
    centerOptions: ["Placental abruption","Placenta previa","Uterine rupture","Preterm labor"],
    centerCorrect: 0,
    leftFindings: ["Sudden onset constant abdominal pain with rigidity","Dark red vaginal bleeding","Board-like rigid uterus on palpation","Chronic hypertension as risk factor","Painless bright red vaginal bleeding","Intermittent cramping with progressive cervical dilation"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Initiate continuous fetal monitoring","Establish two large-bore IV lines for fluid resuscitation","Prepare for emergent cesarean delivery","Type and crossmatch blood products","Perform digital cervical examination","Administer IV magnesium sulfate for seizure prophylaxis"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Sudden severe constant pain, board-like rigidity, dark bleeding, chronic HTN risk factor, and fetal distress (late decels, decreased variability) are classic for placental abruption.",
      findings: "Constant pain with rigidity (Couvelaire uterus), dark bleeding, and HTN history are hallmarks. Painless bright bleeding suggests previa. Intermittent cramping with dilation suggests preterm labor.",
      actions: "Continuous FHR monitoring detects fetal compromise. Large-bore IVs prepare for hemorrhage management. Emergent cesarean is indicated for fetal distress. Blood products address hemorrhagic shock. MgSO4 prevents eclamptic seizures with severe HTN. Digital exam is contraindicated until previa is ruled out."
    },
    bodySystem: "Reproductive/Maternity",
    tier: "rpn"
  },
  {
    id: "bt_rpn_pediatrics_59_2",
    scenario: "A 11-year-old male is brought to the ED with a barking cough, inspiratory stridor, and hoarse voice that started after a mild upper respiratory infection. His parents report the symptoms worsened tonight. He has mild substernal retractions. Vital signs: HR 120 bpm, RR 30/min, Temp 38.3C, SpO2 93%. He is sitting upright and appears anxious but alert. The patient has a history of medication non-adherence.",
    centerOptions: ["Moderate croup (laryngotracheobronchitis)","Epiglottitis","Foreign body aspiration","Bacterial tracheitis"],
    centerCorrect: 0,
    leftFindings: ["Barking (seal-like) cough","Inspiratory stridor at rest","Preceded by upper respiratory infection","Hoarse voice with mild retractions","Sudden onset while eating with unilateral wheeze","Drooling with tripod positioning and high fever"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer nebulized racemic epinephrine","Administer oral or IM dexamethasone","Keep the child calm and in a position of comfort","Monitor for rebound stridor after epinephrine","Examine the throat with tongue depressor","Place on continuous pulse oximetry"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Barking cough, inspiratory stridor, hoarseness following URI, and age 6 months to 3 years are classic for viral croup (laryngotracheobronchitis), most commonly caused by parainfluenza virus.",
      findings: "Barking cough, stridor at rest, URI prodrome, and hoarseness with retractions confirm moderate croup. Sudden onset with eating suggests foreign body. Drooling, tripod, and high fever suggest epiglottitis.",
      actions: "Racemic epinephrine reduces subglottic edema. Dexamethasone reduces inflammation (single dose is standard). Keeping the child calm prevents worsening airway obstruction. Rebound monitoring detects recurrence after epinephrine. Pulse oximetry tracks oxygenation. Throat examination with a tongue depressor is contraindicated as it may worsen obstruction and is specifically avoided in suspected epiglottitis."
    },
    bodySystem: "Pediatrics",
    tier: "rpn"
  },
  {
    id: "bt_rpn_emergencytrauma_60_2",
    scenario: "A 42-year-old male arrives via EMS after a motorcycle collision at approximately 60 km/h. He is alert but confused. He has a large open wound on the right thigh with visible bone and significant hemorrhage. Vital signs: BP 82/50 mmHg, HR 138 bpm, RR 28/min, SpO2 94%. He is pale, cool, and diaphoretic. Estimated blood loss is greater than 1,500 mL. The patient has a history of medication non-adherence.",
    centerOptions: ["Hemorrhagic shock (Class III-IV)","Neurogenic shock","Cardiogenic shock","Tension pneumothorax"],
    centerCorrect: 0,
    leftFindings: ["Tachycardia with hypotension","Pale, cool, diaphoretic skin","Open fracture with greater than 1,500 mL estimated blood loss","Altered mental status (confusion)","Warm, flushed skin with bradycardia","Distended neck veins with tracheal deviation"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Apply direct pressure and tourniquet to hemorrhaging extremity","Initiate massive transfusion protocol","Establish two large-bore IV lines with warmed fluids","Perform primary survey using ABCDE approach","Elevate the injured extremity above heart level only","Obtain type and crossmatch and administer blood products"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Tachycardia, hypotension, altered mental status, cool/pale/diaphoretic skin, and estimated blood loss greater than 1,500 mL in a trauma patient indicate Class III-IV hemorrhagic shock.",
      findings: "Tachycardia, hypotension, cool diaphoretic skin, and AMS with significant blood loss are classic hemorrhagic shock findings. Warm flushed skin with bradycardia suggests neurogenic shock. Distended neck veins with tracheal deviation suggests tension pneumothorax.",
      actions: "Direct pressure and tourniquet control active hemorrhage. Massive transfusion protocol provides balanced blood product resuscitation. Large-bore IVs enable rapid volume replacement. ABCDE primary survey ensures systematic assessment. Blood products restore oxygen-carrying capacity. Elevation alone is insufficient for active hemorrhage of this magnitude."
    },
    bodySystem: "Emergency/Trauma",
    tier: "rpn"
  },
  {
    id: "bt_rpn_musculoskeletal_61_2",
    scenario: "A 27-year-old male presents 6 hours after a tibial fracture reduction and casting. He reports increasing severe pain in his lower leg that is not relieved by prescribed opioids. Pain worsens with passive dorsiflexion of the toes. His leg feels tight and tense. Capillary refill is 4 seconds. He reports tingling and numbness in his toes. The patient has a history of medication non-adherence.",
    centerOptions: ["Compartment syndrome","Deep vein thrombosis","Fat embolism syndrome","Cellulitis"],
    centerCorrect: 0,
    leftFindings: ["Pain out of proportion to injury not relieved by analgesics","Pain with passive stretch (dorsiflexion)","Paresthesia (tingling and numbness)","Tense and swollen compartment","Warmth and erythema along the vein","Petechial rash with confusion"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Notify surgeon immediately for possible fasciotomy","Remove or bivalve the cast immediately","Elevate the limb to heart level only (not above)","Monitor neurovascular status every 15-30 minutes","Apply compression bandage to reduce swelling","Measure compartment pressures if available"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "The 5 Ps of compartment syndrome: Pain out of proportion, Pain with passive stretch, Paresthesia, Pressure (tense compartment), and delayed capillary refill indicate a surgical emergency.",
      findings: "Disproportionate pain, pain with passive stretch, paresthesia, and tense compartment are classic. Warmth along a vein suggests DVT. Petechial rash with confusion suggests fat embolism.",
      actions: "Surgical fasciotomy is definitive treatment. Cast removal releases external pressure. Elevate to heart level (not above, which could worsen ischemia). Frequent neurovascular checks track progression. Compartment pressure measurement confirms diagnosis. Compression is contraindicated as it increases compartment pressure."
    },
    bodySystem: "Musculoskeletal",
    tier: "rpn"
  },
  {
    id: "bt_rpn_integumentary_62_2",
    scenario: "A 53-year-old male is admitted to the burn unit after a house fire with estimated 35% TBSA second and third degree burns to his chest, bilateral arms, and face. He was in an enclosed space with smoke exposure. His voice is hoarse and he has singed nasal hairs. Vital signs: BP 102/64 mmHg, HR 124 bpm, RR 26/min, SpO2 92%. He weighs 80 kg. The patient has a history of medication non-adherence.",
    centerOptions: ["Major thermal burn with inhalation injury","Superficial burn requiring outpatient care","Chemical burn exposure","Electrical burn injury"],
    centerCorrect: 0,
    leftFindings: ["35% TBSA second and third degree burns","Hoarse voice with singed nasal hairs (inhalation injury signs)","Enclosed space fire exposure","Facial burns present","Burns limited to extremities only","Entry and exit wounds visible"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Initiate Parkland formula fluid resuscitation (4 mL x kg x %TBSA)","Prepare for early intubation due to inhalation injury signs","Obtain carboxyhemoglobin level","Monitor urine output target 0.5-1 mL/kg/hr","Apply ice directly to burn wounds","Administer tetanus prophylaxis if not current"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Greater than 20% TBSA burns with facial involvement, hoarse voice, singed nasal hairs, and enclosed space exposure indicate major burns with high suspicion for inhalation injury.",
      findings: "35% TBSA, hoarseness, singed nasal hairs, enclosed space, and facial burns are classic for inhalation injury. Burns limited to extremities without airway signs lower risk. Entry/exit wounds suggest electrical injury.",
      actions: "Parkland formula guides crystalloid resuscitation (half in first 8 hours). Early intubation protects airway before edema progresses. Carboxyhemoglobin detects CO poisoning. Urine output guides fluid adequacy. Tetanus prophylaxis prevents infection. Ice is contraindicated as it causes vasoconstriction and worsens tissue damage."
    },
    bodySystem: "Integumentary",
    tier: "rpn"
  },
  {
    id: "bt_rpn_cardiovascular_63_3",
    scenario: "A 66-year-old male with a history of hypertension presents to the emergency department with crushing substernal chest pain radiating to the left arm and jaw. He is diaphoretic and nauseated. Vital signs: BP 158/94 mmHg, HR 102 bpm, RR 22/min, SpO2 94% on room air. ECG shows ST-segment elevation in leads II, III, and aVF. This is the patient's second presentation this month.",
    centerOptions: ["Inferior ST-elevation myocardial infarction","Unstable angina","Aortic dissection","Pulmonary embolism"],
    centerCorrect: 0,
    leftFindings: ["ST-elevation in leads II, III, aVF","Crushing substernal chest pain radiating to left arm","Diaphoresis and nausea","Elevated troponin levels expected","Normal chest X-ray findings","Bilateral equal blood pressures"],
    leftCorrect: [0,1,2],
    leftSelectCount: 3,
    rightActions: ["Administer aspirin 325 mg chewed immediately","Activate cardiac catheterization lab","Administer morphine for pain if not hypotensive","Administer thrombolytics without ECG confirmation","Obtain serial troponin levels","Discharge with follow-up appointment"],
    rightCorrect: [0,1,4],
    rightSelectCount: 3,
    rationale: {
      condition: "ST-elevation in inferior leads (II, III, aVF) with classic symptoms of crushing chest pain, diaphoresis, and nausea indicates an inferior STEMI requiring emergent intervention.",
      findings: "ST-elevation in inferior leads, crushing substernal pain radiating to the arm, and diaphoresis are hallmark findings of acute MI. Normal chest X-ray and bilateral equal BPs help rule out aortic dissection.",
      actions: "Aspirin inhibits platelet aggregation and is first-line. Cardiac catheterization lab activation enables primary PCI. Serial troponins confirm myocardial injury. Thrombolytics without ECG confirmation is inappropriate, and discharge is unsafe."
    },
    bodySystem: "Cardiovascular",
    tier: "rpn"
  },
  {
    id: "bt_rpn_cardiovascular_64_3",
    scenario: "A 70-year-old female with a history of atrial fibrillation and heart failure presents with increasing dyspnea, orthopnea, and bilateral lower extremity edema over 3 days. She reports sleeping on 3 pillows. Vital signs: BP 142/88 mmHg, HR 112 bpm irregular, RR 28/min, SpO2 88% on room air. Auscultation reveals bilateral crackles and an S3 gallop. BNP is 1,240 pg/mL. This is the patient's second presentation this month.",
    centerOptions: ["Acute decompensated heart failure","Community-acquired pneumonia","Chronic obstructive pulmonary disease exacerbation","Pleural effusion"],
    centerCorrect: 0,
    leftFindings: ["Bilateral crackles with S3 gallop","Orthopnea requiring 3-pillow elevation","BNP 1,240 pg/mL","Bilateral lower extremity edema","Productive cough with green sputum","Barrel chest with prolonged expiration"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer IV furosemide as ordered","Position in high Fowler's position","Apply supplemental oxygen to maintain SpO2 above 94%","Encourage increased oral fluid intake","Monitor strict intake and output","Administer IV normal saline bolus"],
    rightCorrect: [0,1,2,4],
    rightSelectCount: 4,
    rationale: {
      condition: "Bilateral crackles, S3 gallop, orthopnea, peripheral edema, and markedly elevated BNP (greater than 400 pg/mL) are classic findings of acute decompensated heart failure.",
      findings: "S3 gallop indicates volume overload. Orthopnea and elevated BNP confirm fluid status. Bilateral edema reflects right-sided congestion. Green sputum and barrel chest are distractors suggesting pneumonia and COPD respectively.",
      actions: "IV furosemide promotes diuresis. High Fowler's reduces preload and improves breathing. Oxygen treats hypoxemia. Strict I&O monitors fluid balance. Increased fluids and saline bolus would worsen volume overload."
    },
    bodySystem: "Cardiovascular",
    tier: "rpn"
  },
  {
    id: "bt_rpn_cardiovascular_65_3",
    scenario: "A 53-year-old male with uncontrolled hypertension presents with sudden onset of severe tearing chest pain radiating to the back between the scapulae. He appears anxious and diaphoretic. Vital signs: Right arm BP 182/110 mmHg, Left arm BP 148/90 mmHg, HR 118 bpm, RR 24/min. Chest X-ray shows widened mediastinum. This is the patient's second presentation this month.",
    centerOptions: ["Aortic dissection","Myocardial infarction","Tension pneumothorax","Esophageal rupture"],
    centerCorrect: 0,
    leftFindings: ["Tearing chest pain radiating to the back","Blood pressure differential between arms greater than 20 mmHg","Widened mediastinum on chest X-ray","History of uncontrolled hypertension","ST-elevation on ECG","Subcutaneous emphysema"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer IV beta-blocker to reduce heart rate and BP","Obtain emergent CT angiography","Prepare for possible surgical intervention","Administer thrombolytics immediately","Establish two large-bore IV lines","Administer aspirin 325 mg"],
    rightCorrect: [0,1,2,4],
    rightSelectCount: 4,
    rationale: {
      condition: "Sudden tearing chest pain radiating to the back, blood pressure differential greater than 20 mmHg between arms, and widened mediastinum are classic for aortic dissection.",
      findings: "Tearing pain to the back, BP differential, widened mediastinum, and uncontrolled HTN history are hallmark findings. ST-elevation suggests MI, and subcutaneous emphysema suggests esophageal rupture.",
      actions: "IV beta-blockers control heart rate and shear stress. CT angiography confirms diagnosis. Surgical prep is essential. Large-bore IVs allow resuscitation. Thrombolytics and aspirin are absolutely contraindicated as they would worsen hemorrhage."
    },
    bodySystem: "Cardiovascular",
    tier: "rpn"
  },
  {
    id: "bt_rpn_respiratory_66_3",
    scenario: "A 40-year-old female with a history of asthma presents to the emergency department with severe dyspnea, audible wheezing, and inability to speak in full sentences. She has used her albuterol inhaler 8 times today without relief. Vital signs: BP 138/82 mmHg, HR 124 bpm, RR 32/min, SpO2 87% on room air. Peak flow is 120 L/min (predicted 380 L/min). This is the patient's second presentation this month.",
    centerOptions: ["Severe acute asthma exacerbation (status asthmaticus)","Chronic obstructive pulmonary disease exacerbation","Anaphylaxis","Spontaneous pneumothorax"],
    centerCorrect: 0,
    leftFindings: ["Inability to speak in full sentences","Peak flow less than 33% of predicted","SpO2 87% on room air","No relief from repeated albuterol use","Inspiratory stridor","Unilateral absent breath sounds"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer continuous nebulized albuterol","Administer IV corticosteroids (methylprednisolone)","Prepare for possible intubation","Administer ipratropium bromide nebulization","Discharge with oral prednisone taper","Apply high-flow supplemental oxygen"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Severe dyspnea with inability to speak in full sentences, peak flow below 33% predicted, refractory to beta-agonist therapy, and hypoxemia indicate status asthmaticus requiring aggressive treatment.",
      findings: "Inability to speak in sentences, severely reduced peak flow, hypoxemia, and albuterol resistance are hallmarks of severe exacerbation. Stridor suggests upper airway obstruction, and unilateral absent sounds suggest pneumothorax.",
      actions: "Continuous nebulized albuterol provides sustained bronchodilation. IV steroids reduce inflammation. Intubation preparation ensures airway protection. Ipratropium provides additional bronchodilation. High-flow oxygen treats hypoxemia. Discharge is inappropriate for this severity."
    },
    bodySystem: "Respiratory",
    tier: "rpn"
  },
  {
    id: "bt_rpn_respiratory_67_3",
    scenario: "A 61-year-old male, 4 days post total hip replacement, suddenly develops sharp pleuritic chest pain, dyspnea, and hemoptysis. He is tachycardic and anxious. Vital signs: BP 110/70 mmHg, HR 118 bpm, RR 28/min, SpO2 89% on room air. D-dimer is 2,400 ng/mL. CT pulmonary angiography reveals a filling defect in the right main pulmonary artery. This is the patient's second presentation this month.",
    centerOptions: ["Pulmonary embolism","Hospital-acquired pneumonia","Fat embolism syndrome","Acute coronary syndrome"],
    centerCorrect: 0,
    leftFindings: ["Pleuritic chest pain with hemoptysis","Recent surgical procedure with immobility","D-dimer 2,400 ng/mL","CT showing filling defect in pulmonary artery","Petechial rash on chest and axillae","Productive cough with purulent sputum"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Initiate anticoagulation with IV heparin","Apply supplemental oxygen","Elevate the head of bed","Prepare for thrombolysis if hemodynamically unstable","Encourage early ambulation without restrictions","Monitor for signs of right ventricular failure"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Pleuritic chest pain, hemoptysis, tachycardia, and hypoxemia in a postoperative patient with elevated D-dimer and CT-confirmed filling defect confirm pulmonary embolism.",
      findings: "Pleuritic pain with hemoptysis, surgical immobility risk factor, markedly elevated D-dimer, and CT angiography findings are diagnostic. Petechial rash suggests fat embolism; purulent sputum suggests pneumonia.",
      actions: "IV heparin prevents clot propagation. Oxygen treats hypoxemia. Head elevation improves ventilation. Thrombolysis is reserved for massive PE with hemodynamic instability. Monitoring for RV failure detects deterioration. Unrestricted ambulation could dislodge further emboli."
    },
    bodySystem: "Respiratory",
    tier: "rpn"
  },
  {
    id: "bt_rpn_respiratory_68_3",
    scenario: "A 56-year-old male with a 40-pack-year smoking history presents with worsening dyspnea, increased sputum production with yellow-green color, and low-grade fever for 3 days. He uses home oxygen at 2 L/min. Vital signs: BP 136/82 mmHg, HR 98 bpm, RR 26/min, SpO2 85% on 2 L/min NC, Temp 38.2C. ABG: pH 7.31, PaCO2 58 mmHg, PaO2 52 mmHg, HCO3 28 mEq/L. This is the patient's second presentation this month.",
    centerOptions: ["Acute exacerbation of COPD","Community-acquired pneumonia","Acute asthma attack","Pulmonary fibrosis"],
    centerCorrect: 0,
    leftFindings: ["40-pack-year smoking history with chronic dyspnea","Increased purulent sputum production","Compensated respiratory acidosis on ABG","Hypoxemia despite home oxygen","No wheezing or reversible obstruction","Bilateral fine inspiratory crackles only"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Increase oxygen to maintain SpO2 88-92%","Administer short-acting bronchodilator nebulization","Administer systemic corticosteroids","Start antibiotics for infectious exacerbation","Administer high-flow oxygen to achieve SpO2 100%","Monitor for CO2 narcosis and worsening respiratory acidosis"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "A COPD patient with worsening dyspnea, increased purulent sputum, fever, and compensated respiratory acidosis with chronic CO2 retention meets criteria for acute COPD exacerbation.",
      findings: "Smoking history, baseline dyspnea, purulent sputum increase, and ABG showing compensated respiratory acidosis (elevated PaCO2 with elevated HCO3) confirm chronic CO2 retention with acute worsening.",
      actions: "Target SpO2 88-92% to avoid suppressing hypoxic drive. Bronchodilators relieve airflow obstruction. Steroids reduce inflammation. Antibiotics treat infectious trigger. High-flow O2 to 100% risks CO2 narcosis. Monitoring respiratory status is essential."
    },
    bodySystem: "Respiratory",
    tier: "rpn"
  },
  {
    id: "bt_rpn_neurological_69_3",
    scenario: "A 72-year-old male is brought to the emergency department by his wife who noticed sudden onset of right-sided facial droop, right arm weakness, and slurred speech 45 minutes ago. He has a history of atrial fibrillation and takes warfarin irregularly. Vital signs: BP 178/96 mmHg, HR 88 bpm irregular, RR 18/min, SpO2 97%. NIHSS score is 14. CT head shows no hemorrhage. This is the patient's second presentation this month.",
    centerOptions: ["Acute ischemic stroke","Hemorrhagic stroke","Transient ischemic attack","Bell's palsy"],
    centerCorrect: 0,
    leftFindings: ["Sudden right-sided facial droop and arm weakness","Slurred speech (dysarthria)","History of atrial fibrillation","CT head negative for hemorrhage","NIHSS score of 14","Gradual bilateral facial weakness"],
    leftCorrect: [0,1,2,3,4],
    leftSelectCount: 5,
    rightActions: ["Determine eligibility for IV alteplase (tPA) within window","Obtain STAT INR and coagulation studies","Maintain blood pressure below 185/110 mmHg if thrombolysis candidate","Administer aspirin 325 mg immediately before imaging","Perform neurological assessments every 15 minutes","Position head of bed flat if no increased ICP"],
    rightCorrect: [0,1,2,4,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Sudden onset focal neurological deficits (facial droop, arm weakness, dysarthria) with negative CT for hemorrhage and atrial fibrillation as embolic source confirms acute ischemic stroke.",
      findings: "Sudden unilateral deficits, dysarthria, A-fib history, negative CT, and elevated NIHSS are classic. Gradual bilateral weakness suggests other diagnoses like myasthenia gravis.",
      actions: "tPA eligibility assessment is time-critical (within 4.5 hours). INR is essential since the patient takes warfarin (tPA contraindicated if INR greater than 1.7). BP management enables safe thrombolysis. Frequent neuro checks detect deterioration. Flat HOB improves cerebral perfusion. Aspirin before imaging is contraindicated as hemorrhage must be ruled out first."
    },
    bodySystem: "Neurological",
    tier: "rpn"
  },
  {
    id: "bt_rpn_neurological_70_3",
    scenario: "A 26-year-old female presents with severe headache described as the worst headache of my life, sudden onset while exercising. She reports neck stiffness and photophobia. Vital signs: BP 168/94 mmHg, HR 92 bpm, RR 18/min, Temp 37.8C. Neurological exam reveals nuchal rigidity. CT head is negative. This is the patient's second presentation this month.",
    centerOptions: ["Subarachnoid hemorrhage","Tension headache","Meningitis","Migraine with aura"],
    centerCorrect: 0,
    leftFindings: ["Thunderclap headache - worst headache of life","Sudden onset during physical exertion","Nuchal rigidity on examination","Photophobia","Gradual onset over several hours","Aura with visual scotoma preceding headache"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Perform lumbar puncture to assess for xanthochromia","Order CT angiography to identify aneurysm","Maintain strict bed rest with dim lighting","Administer IV nimodipine to prevent vasospasm","Discharge with analgesics if CT is negative","Initiate seizure precautions"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Thunderclap headache with sudden onset during exertion, nuchal rigidity, and photophobia are classic for subarachnoid hemorrhage even with a negative CT (sensitivity decreases after 6 hours).",
      findings: "Worst headache of life with sudden onset, exertional trigger, nuchal rigidity, and photophobia strongly suggest SAH. Gradual onset and visual aura are migraine features.",
      actions: "Lumbar puncture after negative CT detects xanthochromia (blood breakdown products). CTA identifies the bleeding source. Bed rest reduces rebleeding risk. Nimodipine prevents cerebral vasospasm. Seizure precautions prevent further injury. Discharge without LP is unsafe."
    },
    bodySystem: "Neurological",
    tier: "rpn"
  },
  {
    id: "bt_rpn_gastrointestinal_71_3",
    scenario: "A 43-year-old male with a history of alcohol use disorder presents with hematemesis of approximately 500 mL of bright red blood. He appears pale, anxious, and diaphoretic. Vital signs: BP 88/52 mmHg, HR 128 bpm, RR 24/min, SpO2 96%. Abdomen is distended with a fluid wave. He has spider angiomata on his chest and palmar erythema. This is the patient's second presentation this month.",
    centerOptions: ["Esophageal variceal hemorrhage","Peptic ulcer disease bleeding","Mallory-Weiss tear","Gastric carcinoma"],
    centerCorrect: 0,
    leftFindings: ["Large-volume hematemesis with bright red blood","Signs of portal hypertension (ascites, spider angiomata)","Hemodynamic instability (hypotension, tachycardia)","History of alcohol use disorder","Epigastric pain relieved by eating","Coffee-ground emesis with melena only"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Establish two large-bore IV lines for volume resuscitation","Type and crossmatch for packed red blood cells","Administer IV octreotide to reduce portal pressure","Prepare for emergent endoscopy","Insert nasogastric tube for gastric lavage first","Administer IV proton pump inhibitor"],
    rightCorrect: [0,1,2,3],
    rightSelectCount: 4,
    rationale: {
      condition: "Large-volume hematemesis in a patient with alcohol use disorder and signs of portal hypertension (ascites, spider angiomata, palmar erythema) is consistent with esophageal variceal bleeding.",
      findings: "Bright red hematemesis, portal hypertension signs, hemodynamic instability, and alcohol history point to variceal hemorrhage. Epigastric pain relieved by eating suggests PUD. Coffee-ground emesis suggests slower upper GI bleed.",
      actions: "Large-bore IVs enable rapid resuscitation. Blood products correct hemorrhagic shock. Octreotide reduces portal venous pressure. Emergent endoscopy allows band ligation or sclerotherapy. NG tube in suspected varices is controversial and may worsen bleeding. PPI is appropriate for PUD but not primary therapy for varices."
    },
    bodySystem: "Gastrointestinal",
    tier: "rpn"
  },
  {
    id: "bt_rpn_gastrointestinal_72_3",
    scenario: "A 33-year-old female presents with acute onset right lower quadrant pain that began periumbilically 12 hours ago and migrated. She reports nausea, one episode of vomiting, and anorexia. Vital signs: BP 126/78 mmHg, HR 96 bpm, RR 18/min, Temp 38.4C. McBurney's point tenderness is positive. Rovsing sign is positive. WBC 14,200/mm3. This is the patient's second presentation this month.",
    centerOptions: ["Acute appendicitis","Ectopic pregnancy","Ovarian torsion","Crohn's disease flare"],
    centerCorrect: 0,
    leftFindings: ["Pain migration from periumbilical to right lower quadrant","McBurney's point tenderness","Positive Rovsing sign","Leukocytosis with left shift","Positive pregnancy test","Chronic intermittent cramping with bloody diarrhea"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Maintain NPO status","Administer IV fluids and antibiotics","Prepare patient for surgical consultation","Obtain CT abdomen/pelvis with contrast","Administer oral laxatives for constipation","Apply heating pad to abdomen for comfort"],
    rightCorrect: [0,1,2,3],
    rightSelectCount: 4,
    rationale: {
      condition: "Classic migratory pain from periumbilical to RLQ, positive McBurney's and Rovsing signs, fever, and leukocytosis strongly suggest acute appendicitis.",
      findings: "Pain migration pattern, McBurney's tenderness, positive Rovsing sign, and elevated WBC are classic appendicitis findings. Positive pregnancy test suggests ectopic pregnancy. Chronic bloody diarrhea suggests Crohn's.",
      actions: "NPO status prepares for potential surgery. IV fluids maintain hydration and antibiotics prevent peritonitis. Surgical consult is essential. CT confirms diagnosis. Laxatives are contraindicated with possible appendicitis. Heat application may increase inflammation risk."
    },
    bodySystem: "Gastrointestinal",
    tier: "rpn"
  },
  {
    id: "bt_rpn_renalurinary_73_3",
    scenario: "A 60-year-old male with a history of type 2 diabetes and chronic kidney disease (Stage 3) presents with generalized weakness, nausea, and muscle cramping. Lab results show: K+ 6.8 mEq/L, BUN 48 mg/dL, Creatinine 4.2 mg/dL, GFR 18 mL/min. ECG shows peaked T waves and widened QRS complex. This is the patient's second presentation this month.",
    centerOptions: ["Severe hyperkalemia with ECG changes","Diabetic ketoacidosis","Hyponatremia","Acute renal failure"],
    centerCorrect: 0,
    leftFindings: ["Potassium 6.8 mEq/L","Peaked T waves on ECG","Widened QRS complex","Muscle weakness and cramping","Deep Kussmaul respirations","Serum sodium 118 mEq/L"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer IV calcium gluconate for cardiac membrane stabilization","Administer insulin with dextrose to shift potassium intracellularly","Place on continuous cardiac monitoring","Administer sodium polystyrene sulfonate (Kayexalate)","Administer potassium chloride supplement","Prepare for possible emergent hemodialysis"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Potassium of 6.8 mEq/L with ECG changes (peaked T waves, widened QRS) represents a cardiac emergency requiring immediate treatment to prevent fatal arrhythmia.",
      findings: "Severely elevated potassium, peaked T waves, widened QRS, and neuromuscular symptoms confirm symptomatic hyperkalemia. Kussmaul breathing is a DKA finding. Low sodium would indicate hyponatremia.",
      actions: "Calcium gluconate stabilizes cardiac membranes immediately (does not lower K+). Insulin/dextrose shifts K+ into cells. Continuous monitoring detects arrhythmias. Kayexalate removes K+ from the body. Hemodialysis is definitive treatment for refractory cases. Additional potassium is absolutely contraindicated."
    },
    bodySystem: "Renal/Urinary",
    tier: "rpn"
  },
  {
    id: "bt_rpn_endocrine_74_3",
    scenario: "A 20-year-old female with Type 1 diabetes is brought to the ED by her roommate. She has had nausea, vomiting, and abdominal pain for 2 days following a urinary tract infection. She appears dehydrated with dry mucous membranes. Vital signs: BP 96/58 mmHg, HR 118 bpm, RR 28/min deep (Kussmaul), Temp 38.1C. Labs: Blood glucose 486 mg/dL, pH 7.18, HCO3 10 mEq/L, Anion gap 24, Serum K+ 5.6 mEq/L. This is the patient's second presentation this month.",
    centerOptions: ["Diabetic ketoacidosis","Hyperosmolar hyperglycemic state","Lactic acidosis","Uremic acidosis"],
    centerCorrect: 0,
    leftFindings: ["Blood glucose 486 mg/dL with metabolic acidosis","Kussmaul respirations (deep and rapid)","Elevated anion gap of 24","Type 1 diabetes with intercurrent infection","Serum osmolality greater than 320 mOsm/kg","Gradual onset over 1-2 weeks"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Initiate aggressive IV normal saline resuscitation","Begin continuous IV regular insulin infusion","Monitor serum potassium every 1-2 hours","Administer IV potassium when K+ falls below 5.3 mEq/L","Administer subcutaneous long-acting insulin immediately","Monitor blood glucose hourly"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Type 1 diabetes, severe hyperglycemia, metabolic acidosis (pH 7.18, low HCO3), elevated anion gap, and Kussmaul respirations confirm DKA triggered by infection.",
      findings: "High glucose with acidosis, Kussmaul breathing (compensatory CO2 elimination), high anion gap (ketoacids), and Type 1 DM with infection trigger are diagnostic. Osmolality greater than 320 and gradual onset are HHS features.",
      actions: "IV NS corrects severe dehydration. Continuous insulin infusion corrects hyperglycemia and halts ketogenesis. K+ monitoring is critical as insulin drives K+ intracellularly. Replace K+ when it drops below 5.3 to prevent hypokalemia. Hourly glucose monitoring guides insulin titration. SubQ long-acting insulin during acute DKA is inappropriate."
    },
    bodySystem: "Endocrine",
    tier: "rpn"
  },
  {
    id: "bt_rpn_endocrine_75_3",
    scenario: "A 46-year-old female is found unresponsive by coworkers at her office. She has a medical alert bracelet indicating Addison's disease. Vital signs: BP 72/48 mmHg, HR 130 bpm, RR 22/min, Temp 36.0C, Blood glucose 52 mg/dL. Skin appears hyperpigmented. Serum sodium is 126 mEq/L, potassium 6.1 mEq/L. This is the patient's second presentation this month.",
    centerOptions: ["Adrenal crisis (acute adrenal insufficiency)","Septic shock","Hypoglycemic episode","Myxedema coma"],
    centerCorrect: 0,
    leftFindings: ["Profound hypotension refractory to fluids alone","Hypoglycemia (blood glucose 52 mg/dL)","Hyponatremia with hyperkalemia","Known Addison's disease","High fever with chills","Severe hypothermia with bradycardia"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer IV hydrocortisone 100 mg STAT","Initiate aggressive IV normal saline with dextrose","Administer IV dextrose 50% for hypoglycemia","Monitor hemodynamic status continuously","Hold all corticosteroids until cortisol level returns","Obtain random cortisol and ACTH levels before treatment if possible"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Unresponsiveness, severe hypotension, hypoglycemia, hyponatremia, hyperkalemia, and known Addison's disease are classic for adrenal crisis requiring emergent glucocorticoid replacement.",
      findings: "Refractory hypotension, hypoglycemia, electrolyte pattern (low Na, high K), and Addison's history confirm adrenal crisis. High fever suggests sepsis. Hypothermia with bradycardia suggests myxedema coma.",
      actions: "IV hydrocortisone is life-saving and must not be delayed. IV NS with dextrose corrects dehydration and hypoglycemia. D50 treats acute hypoglycemia. Continuous monitoring detects hemodynamic changes. Cortisol/ACTH levels should be drawn before treatment if it does not delay therapy. Withholding steroids is dangerous."
    },
    bodySystem: "Endocrine",
    tier: "rpn"
  },
  {
    id: "bt_rpn_hematology_76_3",
    scenario: "A 4-year-old African American male presents to the ED with severe bilateral leg pain, swollen hands, and fever. His mother reports he has sickle cell disease. Vital signs: BP 100/62 mmHg, HR 122 bpm, RR 24/min, Temp 39.2C, SpO2 91%. CBC shows Hgb 6.2 g/dL, WBC 18,400/mm3, reticulocyte count 12%. This is the patient's second presentation this month.",
    centerOptions: ["Vaso-occlusive sickle cell crisis with fever","Osteomyelitis","Acute lymphoblastic leukemia","Juvenile rheumatoid arthritis"],
    centerCorrect: 0,
    leftFindings: ["Severe bilateral bone pain","Known sickle cell disease","Fever with leukocytosis","Hemoglobin 6.2 g/dL with elevated reticulocytes","Painless joint swelling without warmth","Pancytopenia with blast cells"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer IV opioid analgesics for pain management","Initiate aggressive IV fluid hydration","Obtain blood cultures before antibiotics","Administer supplemental oxygen for SpO2 below 95%","Apply cold compresses to painful areas","Prepare for possible blood transfusion"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "A child with known sickle cell disease presenting with bilateral bone pain, dactylitis, fever, anemia, and elevated reticulocytes indicates vaso-occlusive crisis with possible infection requiring urgent treatment.",
      findings: "Bilateral bone pain, sickle cell history, fever, anemia with reticulocytosis (hemolysis compensation) confirm crisis. Painless joint swelling suggests JRA. Pancytopenia with blasts suggests leukemia.",
      actions: "IV opioids address severe pain (do not undertreat sickle cell pain). IV fluids reduce blood viscosity and sickling. Blood cultures identify infection source. O2 maintains oxygenation to reduce sickling. Transfusion may be needed for severe anemia. Cold compresses are contraindicated as cold promotes sickling."
    },
    bodySystem: "Hematology",
    tier: "rpn"
  },
  {
    id: "bt_rpn_mentalhealth_77_3",
    scenario: "A 30-year-old male is brought to the psychiatric emergency department by police after being found on a bridge railing. He reports feeling hopeless for 3 months after losing his job and a recent divorce. He states he has a plan to use a firearm stored at his home. He admits to heavy alcohol use daily. He has no prior psychiatric history. Vital signs are stable. This is the patient's second presentation this month.",
    centerOptions: ["Acute suicidal crisis with imminent risk","Major depressive episode without suicidality","Adjustment disorder with depressed mood","Alcohol use disorder only"],
    centerCorrect: 0,
    leftFindings: ["Verbalized specific plan with access to lethal means","Hopelessness lasting 3 months","Multiple recent psychosocial stressors (job loss, divorce)","Active heavy alcohol use (disinhibiting factor)","Reports passive thoughts without plan","Denies any intent to harm self"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Implement one-to-one continuous observation","Initiate safety planning and restrict access to lethal means","Obtain psychiatric consultation for inpatient admission","Screen for substance intoxication and withdrawal","Discharge with outpatient follow-up referral","Ensure therapeutic, non-judgmental communication"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Active suicidal ideation with a specific lethal plan (firearm), access to means, multiple risk factors (hopelessness, substance use, psychosocial stressors), and behavioral evidence (found on bridge) indicate imminent suicide risk.",
      findings: "Specific plan with access, hopelessness, stressors, and alcohol use as a disinhibitor are high-risk factors. Passive thoughts without plan and denial of intent would lower risk but are not present here.",
      actions: "One-to-one observation prevents self-harm. Safety planning addresses means restriction. Psychiatric consult evaluates for involuntary hold if needed. Substance screening identifies intoxication. Therapeutic communication builds rapport. Discharge is unsafe given imminent risk level."
    },
    bodySystem: "Mental Health",
    tier: "rpn"
  },
  {
    id: "bt_rpn_immuneinfectious_78_3",
    scenario: "A 69-year-old male nursing home resident presents with altered mental status, fever, and productive cough with rust-colored sputum for 2 days. He has a history of COPD and type 2 diabetes. Vital signs: BP 86/54 mmHg, HR 112 bpm, RR 28/min, Temp 39.4C, SpO2 86% on room air. WBC 22,600/mm3. Lactate 4.2 mmol/L. Chest X-ray shows right lower lobe consolidation. This is the patient's second presentation this month.",
    centerOptions: ["Sepsis secondary to community-acquired pneumonia","COPD exacerbation","Acute heart failure","Aspiration pneumonitis"],
    centerCorrect: 0,
    leftFindings: ["Fever with productive rust-colored sputum","Hypotension with tachycardia (signs of septic shock)","Elevated lactate 4.2 mmol/L indicating tissue hypoperfusion","Right lower lobe consolidation on chest X-ray","Bilateral wheezing without consolidation","Frothy pink sputum with bilateral infiltrates"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Initiate IV broad-spectrum antibiotics within 1 hour","Administer 30 mL/kg IV crystalloid bolus","Obtain blood cultures before antibiotics if possible","Apply supplemental oxygen to target SpO2 above 94%","Administer IV corticosteroids as first-line treatment","Measure serial lactate levels to assess resuscitation adequacy"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Suspected infection (pneumonia), organ dysfunction (hypotension, altered mental status), and elevated lactate greater than 2 mmol/L meet Sepsis-3 criteria. This represents septic shock requiring the SEP-1 bundle.",
      findings: "Fever, productive cough, consolidation confirm pneumonia source. Hypotension and tachycardia indicate shock. Elevated lactate confirms tissue hypoperfusion. Wheezing without consolidation suggests COPD. Frothy pink sputum suggests heart failure.",
      actions: "Antibiotics within 1 hour reduce mortality in sepsis. Fluid bolus restores perfusion. Blood cultures guide targeted therapy. Oxygen corrects hypoxemia. Corticosteroids are not first-line for sepsis (reserved for refractory shock). Serial lactate measures guide resuscitation."
    },
    bodySystem: "Immune/Infectious",
    tier: "rpn"
  },
  {
    id: "bt_rpn_reproductivematernity_79_3",
    scenario: "A 26-year-old G2P1 at 34 weeks gestation presents with sudden onset of severe abdominal pain and vaginal bleeding. She reports the pain is constant and her abdomen feels rigid and board-like. She has a history of chronic hypertension. Vital signs: BP 168/108 mmHg, HR 120 bpm, RR 24/min. Fetal heart rate shows persistent late decelerations with decreased variability. This is the patient's second presentation this month.",
    centerOptions: ["Placental abruption","Placenta previa","Uterine rupture","Preterm labor"],
    centerCorrect: 0,
    leftFindings: ["Sudden onset constant abdominal pain with rigidity","Dark red vaginal bleeding","Board-like rigid uterus on palpation","Chronic hypertension as risk factor","Painless bright red vaginal bleeding","Intermittent cramping with progressive cervical dilation"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Initiate continuous fetal monitoring","Establish two large-bore IV lines for fluid resuscitation","Prepare for emergent cesarean delivery","Type and crossmatch blood products","Perform digital cervical examination","Administer IV magnesium sulfate for seizure prophylaxis"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Sudden severe constant pain, board-like rigidity, dark bleeding, chronic HTN risk factor, and fetal distress (late decels, decreased variability) are classic for placental abruption.",
      findings: "Constant pain with rigidity (Couvelaire uterus), dark bleeding, and HTN history are hallmarks. Painless bright bleeding suggests previa. Intermittent cramping with dilation suggests preterm labor.",
      actions: "Continuous FHR monitoring detects fetal compromise. Large-bore IVs prepare for hemorrhage management. Emergent cesarean is indicated for fetal distress. Blood products address hemorrhagic shock. MgSO4 prevents eclamptic seizures with severe HTN. Digital exam is contraindicated until previa is ruled out."
    },
    bodySystem: "Reproductive/Maternity",
    tier: "rpn"
  },
  {
    id: "bt_rpn_pediatrics_80_3",
    scenario: "A 1-year-old male is brought to the ED with a barking cough, inspiratory stridor, and hoarse voice that started after a mild upper respiratory infection. His parents report the symptoms worsened tonight. He has mild substernal retractions. Vital signs: HR 120 bpm, RR 30/min, Temp 38.3C, SpO2 93%. He is sitting upright and appears anxious but alert. This is the patient's second presentation this month.",
    centerOptions: ["Moderate croup (laryngotracheobronchitis)","Epiglottitis","Foreign body aspiration","Bacterial tracheitis"],
    centerCorrect: 0,
    leftFindings: ["Barking (seal-like) cough","Inspiratory stridor at rest","Preceded by upper respiratory infection","Hoarse voice with mild retractions","Sudden onset while eating with unilateral wheeze","Drooling with tripod positioning and high fever"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer nebulized racemic epinephrine","Administer oral or IM dexamethasone","Keep the child calm and in a position of comfort","Monitor for rebound stridor after epinephrine","Examine the throat with tongue depressor","Place on continuous pulse oximetry"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Barking cough, inspiratory stridor, hoarseness following URI, and age 6 months to 3 years are classic for viral croup (laryngotracheobronchitis), most commonly caused by parainfluenza virus.",
      findings: "Barking cough, stridor at rest, URI prodrome, and hoarseness with retractions confirm moderate croup. Sudden onset with eating suggests foreign body. Drooling, tripod, and high fever suggest epiglottitis.",
      actions: "Racemic epinephrine reduces subglottic edema. Dexamethasone reduces inflammation (single dose is standard). Keeping the child calm prevents worsening airway obstruction. Rebound monitoring detects recurrence after epinephrine. Pulse oximetry tracks oxygenation. Throat examination with a tongue depressor is contraindicated as it may worsen obstruction and is specifically avoided in suspected epiglottitis."
    },
    bodySystem: "Pediatrics",
    tier: "rpn"
  },
  {
    id: "bt_rpn_emergencytrauma_81_3",
    scenario: "A 32-year-old male arrives via EMS after a motorcycle collision at approximately 60 km/h. He is alert but confused. He has a large open wound on the right thigh with visible bone and significant hemorrhage. Vital signs: BP 82/50 mmHg, HR 138 bpm, RR 28/min, SpO2 94%. He is pale, cool, and diaphoretic. Estimated blood loss is greater than 1,500 mL. This is the patient's second presentation this month.",
    centerOptions: ["Hemorrhagic shock (Class III-IV)","Neurogenic shock","Cardiogenic shock","Tension pneumothorax"],
    centerCorrect: 0,
    leftFindings: ["Tachycardia with hypotension","Pale, cool, diaphoretic skin","Open fracture with greater than 1,500 mL estimated blood loss","Altered mental status (confusion)","Warm, flushed skin with bradycardia","Distended neck veins with tracheal deviation"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Apply direct pressure and tourniquet to hemorrhaging extremity","Initiate massive transfusion protocol","Establish two large-bore IV lines with warmed fluids","Perform primary survey using ABCDE approach","Elevate the injured extremity above heart level only","Obtain type and crossmatch and administer blood products"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Tachycardia, hypotension, altered mental status, cool/pale/diaphoretic skin, and estimated blood loss greater than 1,500 mL in a trauma patient indicate Class III-IV hemorrhagic shock.",
      findings: "Tachycardia, hypotension, cool diaphoretic skin, and AMS with significant blood loss are classic hemorrhagic shock findings. Warm flushed skin with bradycardia suggests neurogenic shock. Distended neck veins with tracheal deviation suggests tension pneumothorax.",
      actions: "Direct pressure and tourniquet control active hemorrhage. Massive transfusion protocol provides balanced blood product resuscitation. Large-bore IVs enable rapid volume replacement. ABCDE primary survey ensures systematic assessment. Blood products restore oxygen-carrying capacity. Elevation alone is insufficient for active hemorrhage of this magnitude."
    },
    bodySystem: "Emergency/Trauma",
    tier: "rpn"
  },
  {
    id: "bt_rpn_musculoskeletal_82_3",
    scenario: "A 17-year-old male presents 6 hours after a tibial fracture reduction and casting. He reports increasing severe pain in his lower leg that is not relieved by prescribed opioids. Pain worsens with passive dorsiflexion of the toes. His leg feels tight and tense. Capillary refill is 4 seconds. He reports tingling and numbness in his toes. This is the patient's second presentation this month.",
    centerOptions: ["Compartment syndrome","Deep vein thrombosis","Fat embolism syndrome","Cellulitis"],
    centerCorrect: 0,
    leftFindings: ["Pain out of proportion to injury not relieved by analgesics","Pain with passive stretch (dorsiflexion)","Paresthesia (tingling and numbness)","Tense and swollen compartment","Warmth and erythema along the vein","Petechial rash with confusion"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Notify surgeon immediately for possible fasciotomy","Remove or bivalve the cast immediately","Elevate the limb to heart level only (not above)","Monitor neurovascular status every 15-30 minutes","Apply compression bandage to reduce swelling","Measure compartment pressures if available"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "The 5 Ps of compartment syndrome: Pain out of proportion, Pain with passive stretch, Paresthesia, Pressure (tense compartment), and delayed capillary refill indicate a surgical emergency.",
      findings: "Disproportionate pain, pain with passive stretch, paresthesia, and tense compartment are classic. Warmth along a vein suggests DVT. Petechial rash with confusion suggests fat embolism.",
      actions: "Surgical fasciotomy is definitive treatment. Cast removal releases external pressure. Elevate to heart level (not above, which could worsen ischemia). Frequent neurovascular checks track progression. Compartment pressure measurement confirms diagnosis. Compression is contraindicated as it increases compartment pressure."
    },
    bodySystem: "Musculoskeletal",
    tier: "rpn"
  },
  {
    id: "bt_rpn_integumentary_83_3",
    scenario: "A 43-year-old male is admitted to the burn unit after a house fire with estimated 35% TBSA second and third degree burns to his chest, bilateral arms, and face. He was in an enclosed space with smoke exposure. His voice is hoarse and he has singed nasal hairs. Vital signs: BP 102/64 mmHg, HR 124 bpm, RR 26/min, SpO2 92%. He weighs 80 kg. This is the patient's second presentation this month.",
    centerOptions: ["Major thermal burn with inhalation injury","Superficial burn requiring outpatient care","Chemical burn exposure","Electrical burn injury"],
    centerCorrect: 0,
    leftFindings: ["35% TBSA second and third degree burns","Hoarse voice with singed nasal hairs (inhalation injury signs)","Enclosed space fire exposure","Facial burns present","Burns limited to extremities only","Entry and exit wounds visible"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Initiate Parkland formula fluid resuscitation (4 mL x kg x %TBSA)","Prepare for early intubation due to inhalation injury signs","Obtain carboxyhemoglobin level","Monitor urine output target 0.5-1 mL/kg/hr","Apply ice directly to burn wounds","Administer tetanus prophylaxis if not current"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Greater than 20% TBSA burns with facial involvement, hoarse voice, singed nasal hairs, and enclosed space exposure indicate major burns with high suspicion for inhalation injury.",
      findings: "35% TBSA, hoarseness, singed nasal hairs, enclosed space, and facial burns are classic for inhalation injury. Burns limited to extremities without airway signs lower risk. Entry/exit wounds suggest electrical injury.",
      actions: "Parkland formula guides crystalloid resuscitation (half in first 8 hours). Early intubation protects airway before edema progresses. Carboxyhemoglobin detects CO poisoning. Urine output guides fluid adequacy. Tetanus prophylaxis prevents infection. Ice is contraindicated as it causes vasoconstriction and worsens tissue damage."
    },
    bodySystem: "Integumentary",
    tier: "rpn"
  },
  {
    id: "bt_rpn_cardiovascular_84_4",
    scenario: "A 80-year-old male with a history of hypertension presents to the emergency department with crushing substernal chest pain radiating to the left arm and jaw. He is diaphoretic and nauseated. Vital signs: BP 158/94 mmHg, HR 102 bpm, RR 22/min, SpO2 94% on room air. ECG shows ST-segment elevation in leads II, III, and aVF. The patient recently relocated and has no established primary care provider.",
    centerOptions: ["Inferior ST-elevation myocardial infarction","Unstable angina","Aortic dissection","Pulmonary embolism"],
    centerCorrect: 0,
    leftFindings: ["ST-elevation in leads II, III, aVF","Crushing substernal chest pain radiating to left arm","Diaphoresis and nausea","Elevated troponin levels expected","Normal chest X-ray findings","Bilateral equal blood pressures"],
    leftCorrect: [0,1,2],
    leftSelectCount: 3,
    rightActions: ["Administer aspirin 325 mg chewed immediately","Activate cardiac catheterization lab","Administer morphine for pain if not hypotensive","Administer thrombolytics without ECG confirmation","Obtain serial troponin levels","Discharge with follow-up appointment"],
    rightCorrect: [0,1,4],
    rightSelectCount: 3,
    rationale: {
      condition: "ST-elevation in inferior leads (II, III, aVF) with classic symptoms of crushing chest pain, diaphoresis, and nausea indicates an inferior STEMI requiring emergent intervention.",
      findings: "ST-elevation in inferior leads, crushing substernal pain radiating to the arm, and diaphoresis are hallmark findings of acute MI. Normal chest X-ray and bilateral equal BPs help rule out aortic dissection.",
      actions: "Aspirin inhibits platelet aggregation and is first-line. Cardiac catheterization lab activation enables primary PCI. Serial troponins confirm myocardial injury. Thrombolytics without ECG confirmation is inappropriate, and discharge is unsafe."
    },
    bodySystem: "Cardiovascular",
    tier: "rpn"
  },
  {
    id: "bt_rpn_cardiovascular_85_4",
    scenario: "A 84-year-old female with a history of atrial fibrillation and heart failure presents with increasing dyspnea, orthopnea, and bilateral lower extremity edema over 3 days. She reports sleeping on 3 pillows. Vital signs: BP 142/88 mmHg, HR 112 bpm irregular, RR 28/min, SpO2 88% on room air. Auscultation reveals bilateral crackles and an S3 gallop. BNP is 1,240 pg/mL. The patient recently relocated and has no established primary care provider.",
    centerOptions: ["Acute decompensated heart failure","Community-acquired pneumonia","Chronic obstructive pulmonary disease exacerbation","Pleural effusion"],
    centerCorrect: 0,
    leftFindings: ["Bilateral crackles with S3 gallop","Orthopnea requiring 3-pillow elevation","BNP 1,240 pg/mL","Bilateral lower extremity edema","Productive cough with green sputum","Barrel chest with prolonged expiration"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer IV furosemide as ordered","Position in high Fowler's position","Apply supplemental oxygen to maintain SpO2 above 94%","Encourage increased oral fluid intake","Monitor strict intake and output","Administer IV normal saline bolus"],
    rightCorrect: [0,1,2,4],
    rightSelectCount: 4,
    rationale: {
      condition: "Bilateral crackles, S3 gallop, orthopnea, peripheral edema, and markedly elevated BNP (greater than 400 pg/mL) are classic findings of acute decompensated heart failure.",
      findings: "S3 gallop indicates volume overload. Orthopnea and elevated BNP confirm fluid status. Bilateral edema reflects right-sided congestion. Green sputum and barrel chest are distractors suggesting pneumonia and COPD respectively.",
      actions: "IV furosemide promotes diuresis. High Fowler's reduces preload and improves breathing. Oxygen treats hypoxemia. Strict I&O monitors fluid balance. Increased fluids and saline bolus would worsen volume overload."
    },
    bodySystem: "Cardiovascular",
    tier: "rpn"
  },
  {
    id: "bt_rpn_cardiovascular_86_4",
    scenario: "A 67-year-old male with uncontrolled hypertension presents with sudden onset of severe tearing chest pain radiating to the back between the scapulae. He appears anxious and diaphoretic. Vital signs: Right arm BP 182/110 mmHg, Left arm BP 148/90 mmHg, HR 118 bpm, RR 24/min. Chest X-ray shows widened mediastinum. The patient recently relocated and has no established primary care provider.",
    centerOptions: ["Aortic dissection","Myocardial infarction","Tension pneumothorax","Esophageal rupture"],
    centerCorrect: 0,
    leftFindings: ["Tearing chest pain radiating to the back","Blood pressure differential between arms greater than 20 mmHg","Widened mediastinum on chest X-ray","History of uncontrolled hypertension","ST-elevation on ECG","Subcutaneous emphysema"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer IV beta-blocker to reduce heart rate and BP","Obtain emergent CT angiography","Prepare for possible surgical intervention","Administer thrombolytics immediately","Establish two large-bore IV lines","Administer aspirin 325 mg"],
    rightCorrect: [0,1,2,4],
    rightSelectCount: 4,
    rationale: {
      condition: "Sudden tearing chest pain radiating to the back, blood pressure differential greater than 20 mmHg between arms, and widened mediastinum are classic for aortic dissection.",
      findings: "Tearing pain to the back, BP differential, widened mediastinum, and uncontrolled HTN history are hallmark findings. ST-elevation suggests MI, and subcutaneous emphysema suggests esophageal rupture.",
      actions: "IV beta-blockers control heart rate and shear stress. CT angiography confirms diagnosis. Surgical prep is essential. Large-bore IVs allow resuscitation. Thrombolytics and aspirin are absolutely contraindicated as they would worsen hemorrhage."
    },
    bodySystem: "Cardiovascular",
    tier: "rpn"
  },
  {
    id: "bt_rpn_respiratory_87_4",
    scenario: "A 54-year-old female with a history of asthma presents to the emergency department with severe dyspnea, audible wheezing, and inability to speak in full sentences. She has used her albuterol inhaler 8 times today without relief. Vital signs: BP 138/82 mmHg, HR 124 bpm, RR 32/min, SpO2 87% on room air. Peak flow is 120 L/min (predicted 380 L/min). The patient recently relocated and has no established primary care provider.",
    centerOptions: ["Severe acute asthma exacerbation (status asthmaticus)","Chronic obstructive pulmonary disease exacerbation","Anaphylaxis","Spontaneous pneumothorax"],
    centerCorrect: 0,
    leftFindings: ["Inability to speak in full sentences","Peak flow less than 33% of predicted","SpO2 87% on room air","No relief from repeated albuterol use","Inspiratory stridor","Unilateral absent breath sounds"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer continuous nebulized albuterol","Administer IV corticosteroids (methylprednisolone)","Prepare for possible intubation","Administer ipratropium bromide nebulization","Discharge with oral prednisone taper","Apply high-flow supplemental oxygen"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Severe dyspnea with inability to speak in full sentences, peak flow below 33% predicted, refractory to beta-agonist therapy, and hypoxemia indicate status asthmaticus requiring aggressive treatment.",
      findings: "Inability to speak in sentences, severely reduced peak flow, hypoxemia, and albuterol resistance are hallmarks of severe exacerbation. Stridor suggests upper airway obstruction, and unilateral absent sounds suggest pneumothorax.",
      actions: "Continuous nebulized albuterol provides sustained bronchodilation. IV steroids reduce inflammation. Intubation preparation ensures airway protection. Ipratropium provides additional bronchodilation. High-flow oxygen treats hypoxemia. Discharge is inappropriate for this severity."
    },
    bodySystem: "Respiratory",
    tier: "rpn"
  },
  {
    id: "bt_rpn_respiratory_88_4",
    scenario: "A 75-year-old male, 4 days post total hip replacement, suddenly develops sharp pleuritic chest pain, dyspnea, and hemoptysis. He is tachycardic and anxious. Vital signs: BP 110/70 mmHg, HR 118 bpm, RR 28/min, SpO2 89% on room air. D-dimer is 2,400 ng/mL. CT pulmonary angiography reveals a filling defect in the right main pulmonary artery. The patient recently relocated and has no established primary care provider.",
    centerOptions: ["Pulmonary embolism","Hospital-acquired pneumonia","Fat embolism syndrome","Acute coronary syndrome"],
    centerCorrect: 0,
    leftFindings: ["Pleuritic chest pain with hemoptysis","Recent surgical procedure with immobility","D-dimer 2,400 ng/mL","CT showing filling defect in pulmonary artery","Petechial rash on chest and axillae","Productive cough with purulent sputum"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Initiate anticoagulation with IV heparin","Apply supplemental oxygen","Elevate the head of bed","Prepare for thrombolysis if hemodynamically unstable","Encourage early ambulation without restrictions","Monitor for signs of right ventricular failure"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Pleuritic chest pain, hemoptysis, tachycardia, and hypoxemia in a postoperative patient with elevated D-dimer and CT-confirmed filling defect confirm pulmonary embolism.",
      findings: "Pleuritic pain with hemoptysis, surgical immobility risk factor, markedly elevated D-dimer, and CT angiography findings are diagnostic. Petechial rash suggests fat embolism; purulent sputum suggests pneumonia.",
      actions: "IV heparin prevents clot propagation. Oxygen treats hypoxemia. Head elevation improves ventilation. Thrombolysis is reserved for massive PE with hemodynamic instability. Monitoring for RV failure detects deterioration. Unrestricted ambulation could dislodge further emboli."
    },
    bodySystem: "Respiratory",
    tier: "rpn"
  },
  {
    id: "bt_rpn_respiratory_89_4",
    scenario: "A 70-year-old male with a 40-pack-year smoking history presents with worsening dyspnea, increased sputum production with yellow-green color, and low-grade fever for 3 days. He uses home oxygen at 2 L/min. Vital signs: BP 136/82 mmHg, HR 98 bpm, RR 26/min, SpO2 85% on 2 L/min NC, Temp 38.2C. ABG: pH 7.31, PaCO2 58 mmHg, PaO2 52 mmHg, HCO3 28 mEq/L. The patient recently relocated and has no established primary care provider.",
    centerOptions: ["Acute exacerbation of COPD","Community-acquired pneumonia","Acute asthma attack","Pulmonary fibrosis"],
    centerCorrect: 0,
    leftFindings: ["40-pack-year smoking history with chronic dyspnea","Increased purulent sputum production","Compensated respiratory acidosis on ABG","Hypoxemia despite home oxygen","No wheezing or reversible obstruction","Bilateral fine inspiratory crackles only"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Increase oxygen to maintain SpO2 88-92%","Administer short-acting bronchodilator nebulization","Administer systemic corticosteroids","Start antibiotics for infectious exacerbation","Administer high-flow oxygen to achieve SpO2 100%","Monitor for CO2 narcosis and worsening respiratory acidosis"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "A COPD patient with worsening dyspnea, increased purulent sputum, fever, and compensated respiratory acidosis with chronic CO2 retention meets criteria for acute COPD exacerbation.",
      findings: "Smoking history, baseline dyspnea, purulent sputum increase, and ABG showing compensated respiratory acidosis (elevated PaCO2 with elevated HCO3) confirm chronic CO2 retention with acute worsening.",
      actions: "Target SpO2 88-92% to avoid suppressing hypoxic drive. Bronchodilators relieve airflow obstruction. Steroids reduce inflammation. Antibiotics treat infectious trigger. High-flow O2 to 100% risks CO2 narcosis. Monitoring respiratory status is essential."
    },
    bodySystem: "Respiratory",
    tier: "rpn"
  },
  {
    id: "bt_rpn_neurological_90_4",
    scenario: "A 86-year-old male is brought to the emergency department by his wife who noticed sudden onset of right-sided facial droop, right arm weakness, and slurred speech 45 minutes ago. He has a history of atrial fibrillation and takes warfarin irregularly. Vital signs: BP 178/96 mmHg, HR 88 bpm irregular, RR 18/min, SpO2 97%. NIHSS score is 14. CT head shows no hemorrhage. The patient recently relocated and has no established primary care provider.",
    centerOptions: ["Acute ischemic stroke","Hemorrhagic stroke","Transient ischemic attack","Bell's palsy"],
    centerCorrect: 0,
    leftFindings: ["Sudden right-sided facial droop and arm weakness","Slurred speech (dysarthria)","History of atrial fibrillation","CT head negative for hemorrhage","NIHSS score of 14","Gradual bilateral facial weakness"],
    leftCorrect: [0,1,2,3,4],
    leftSelectCount: 5,
    rightActions: ["Determine eligibility for IV alteplase (tPA) within window","Obtain STAT INR and coagulation studies","Maintain blood pressure below 185/110 mmHg if thrombolysis candidate","Administer aspirin 325 mg immediately before imaging","Perform neurological assessments every 15 minutes","Position head of bed flat if no increased ICP"],
    rightCorrect: [0,1,2,4,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Sudden onset focal neurological deficits (facial droop, arm weakness, dysarthria) with negative CT for hemorrhage and atrial fibrillation as embolic source confirms acute ischemic stroke.",
      findings: "Sudden unilateral deficits, dysarthria, A-fib history, negative CT, and elevated NIHSS are classic. Gradual bilateral weakness suggests other diagnoses like myasthenia gravis.",
      actions: "tPA eligibility assessment is time-critical (within 4.5 hours). INR is essential since the patient takes warfarin (tPA contraindicated if INR greater than 1.7). BP management enables safe thrombolysis. Frequent neuro checks detect deterioration. Flat HOB improves cerebral perfusion. Aspirin before imaging is contraindicated as hemorrhage must be ruled out first."
    },
    bodySystem: "Neurological",
    tier: "rpn"
  },
  {
    id: "bt_rpn_neurological_91_4",
    scenario: "A 40-year-old female presents with severe headache described as the worst headache of my life, sudden onset while exercising. She reports neck stiffness and photophobia. Vital signs: BP 168/94 mmHg, HR 92 bpm, RR 18/min, Temp 37.8C. Neurological exam reveals nuchal rigidity. CT head is negative. The patient recently relocated and has no established primary care provider.",
    centerOptions: ["Subarachnoid hemorrhage","Tension headache","Meningitis","Migraine with aura"],
    centerCorrect: 0,
    leftFindings: ["Thunderclap headache - worst headache of life","Sudden onset during physical exertion","Nuchal rigidity on examination","Photophobia","Gradual onset over several hours","Aura with visual scotoma preceding headache"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Perform lumbar puncture to assess for xanthochromia","Order CT angiography to identify aneurysm","Maintain strict bed rest with dim lighting","Administer IV nimodipine to prevent vasospasm","Discharge with analgesics if CT is negative","Initiate seizure precautions"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Thunderclap headache with sudden onset during exertion, nuchal rigidity, and photophobia are classic for subarachnoid hemorrhage even with a negative CT (sensitivity decreases after 6 hours).",
      findings: "Worst headache of life with sudden onset, exertional trigger, nuchal rigidity, and photophobia strongly suggest SAH. Gradual onset and visual aura are migraine features.",
      actions: "Lumbar puncture after negative CT detects xanthochromia (blood breakdown products). CTA identifies the bleeding source. Bed rest reduces rebleeding risk. Nimodipine prevents cerebral vasospasm. Seizure precautions prevent further injury. Discharge without LP is unsafe."
    },
    bodySystem: "Neurological",
    tier: "rpn"
  },
  {
    id: "bt_rpn_gastrointestinal_92_4",
    scenario: "A 57-year-old male with a history of alcohol use disorder presents with hematemesis of approximately 500 mL of bright red blood. He appears pale, anxious, and diaphoretic. Vital signs: BP 88/52 mmHg, HR 128 bpm, RR 24/min, SpO2 96%. Abdomen is distended with a fluid wave. He has spider angiomata on his chest and palmar erythema. The patient recently relocated and has no established primary care provider.",
    centerOptions: ["Esophageal variceal hemorrhage","Peptic ulcer disease bleeding","Mallory-Weiss tear","Gastric carcinoma"],
    centerCorrect: 0,
    leftFindings: ["Large-volume hematemesis with bright red blood","Signs of portal hypertension (ascites, spider angiomata)","Hemodynamic instability (hypotension, tachycardia)","History of alcohol use disorder","Epigastric pain relieved by eating","Coffee-ground emesis with melena only"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Establish two large-bore IV lines for volume resuscitation","Type and crossmatch for packed red blood cells","Administer IV octreotide to reduce portal pressure","Prepare for emergent endoscopy","Insert nasogastric tube for gastric lavage first","Administer IV proton pump inhibitor"],
    rightCorrect: [0,1,2,3],
    rightSelectCount: 4,
    rationale: {
      condition: "Large-volume hematemesis in a patient with alcohol use disorder and signs of portal hypertension (ascites, spider angiomata, palmar erythema) is consistent with esophageal variceal bleeding.",
      findings: "Bright red hematemesis, portal hypertension signs, hemodynamic instability, and alcohol history point to variceal hemorrhage. Epigastric pain relieved by eating suggests PUD. Coffee-ground emesis suggests slower upper GI bleed.",
      actions: "Large-bore IVs enable rapid resuscitation. Blood products correct hemorrhagic shock. Octreotide reduces portal venous pressure. Emergent endoscopy allows band ligation or sclerotherapy. NG tube in suspected varices is controversial and may worsen bleeding. PPI is appropriate for PUD but not primary therapy for varices."
    },
    bodySystem: "Gastrointestinal",
    tier: "rpn"
  },
  {
    id: "bt_rpn_gastrointestinal_93_4",
    scenario: "A 47-year-old female presents with acute onset right lower quadrant pain that began periumbilically 12 hours ago and migrated. She reports nausea, one episode of vomiting, and anorexia. Vital signs: BP 126/78 mmHg, HR 96 bpm, RR 18/min, Temp 38.4C. McBurney's point tenderness is positive. Rovsing sign is positive. WBC 14,200/mm3. The patient recently relocated and has no established primary care provider.",
    centerOptions: ["Acute appendicitis","Ectopic pregnancy","Ovarian torsion","Crohn's disease flare"],
    centerCorrect: 0,
    leftFindings: ["Pain migration from periumbilical to right lower quadrant","McBurney's point tenderness","Positive Rovsing sign","Leukocytosis with left shift","Positive pregnancy test","Chronic intermittent cramping with bloody diarrhea"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Maintain NPO status","Administer IV fluids and antibiotics","Prepare patient for surgical consultation","Obtain CT abdomen/pelvis with contrast","Administer oral laxatives for constipation","Apply heating pad to abdomen for comfort"],
    rightCorrect: [0,1,2,3],
    rightSelectCount: 4,
    rationale: {
      condition: "Classic migratory pain from periumbilical to RLQ, positive McBurney's and Rovsing signs, fever, and leukocytosis strongly suggest acute appendicitis.",
      findings: "Pain migration pattern, McBurney's tenderness, positive Rovsing sign, and elevated WBC are classic appendicitis findings. Positive pregnancy test suggests ectopic pregnancy. Chronic bloody diarrhea suggests Crohn's.",
      actions: "NPO status prepares for potential surgery. IV fluids maintain hydration and antibiotics prevent peritonitis. Surgical consult is essential. CT confirms diagnosis. Laxatives are contraindicated with possible appendicitis. Heat application may increase inflammation risk."
    },
    bodySystem: "Gastrointestinal",
    tier: "rpn"
  },
  {
    id: "bt_rpn_renalurinary_94_4",
    scenario: "A 74-year-old male with a history of type 2 diabetes and chronic kidney disease (Stage 3) presents with generalized weakness, nausea, and muscle cramping. Lab results show: K+ 6.8 mEq/L, BUN 48 mg/dL, Creatinine 4.2 mg/dL, GFR 18 mL/min. ECG shows peaked T waves and widened QRS complex. The patient recently relocated and has no established primary care provider.",
    centerOptions: ["Severe hyperkalemia with ECG changes","Diabetic ketoacidosis","Hyponatremia","Acute renal failure"],
    centerCorrect: 0,
    leftFindings: ["Potassium 6.8 mEq/L","Peaked T waves on ECG","Widened QRS complex","Muscle weakness and cramping","Deep Kussmaul respirations","Serum sodium 118 mEq/L"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer IV calcium gluconate for cardiac membrane stabilization","Administer insulin with dextrose to shift potassium intracellularly","Place on continuous cardiac monitoring","Administer sodium polystyrene sulfonate (Kayexalate)","Administer potassium chloride supplement","Prepare for possible emergent hemodialysis"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Potassium of 6.8 mEq/L with ECG changes (peaked T waves, widened QRS) represents a cardiac emergency requiring immediate treatment to prevent fatal arrhythmia.",
      findings: "Severely elevated potassium, peaked T waves, widened QRS, and neuromuscular symptoms confirm symptomatic hyperkalemia. Kussmaul breathing is a DKA finding. Low sodium would indicate hyponatremia.",
      actions: "Calcium gluconate stabilizes cardiac membranes immediately (does not lower K+). Insulin/dextrose shifts K+ into cells. Continuous monitoring detects arrhythmias. Kayexalate removes K+ from the body. Hemodialysis is definitive treatment for refractory cases. Additional potassium is absolutely contraindicated."
    },
    bodySystem: "Renal/Urinary",
    tier: "rpn"
  },
  {
    id: "bt_rpn_endocrine_95_4",
    scenario: "A 34-year-old female with Type 1 diabetes is brought to the ED by her roommate. She has had nausea, vomiting, and abdominal pain for 2 days following a urinary tract infection. She appears dehydrated with dry mucous membranes. Vital signs: BP 96/58 mmHg, HR 118 bpm, RR 28/min deep (Kussmaul), Temp 38.1C. Labs: Blood glucose 486 mg/dL, pH 7.18, HCO3 10 mEq/L, Anion gap 24, Serum K+ 5.6 mEq/L. The patient recently relocated and has no established primary care provider.",
    centerOptions: ["Diabetic ketoacidosis","Hyperosmolar hyperglycemic state","Lactic acidosis","Uremic acidosis"],
    centerCorrect: 0,
    leftFindings: ["Blood glucose 486 mg/dL with metabolic acidosis","Kussmaul respirations (deep and rapid)","Elevated anion gap of 24","Type 1 diabetes with intercurrent infection","Serum osmolality greater than 320 mOsm/kg","Gradual onset over 1-2 weeks"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Initiate aggressive IV normal saline resuscitation","Begin continuous IV regular insulin infusion","Monitor serum potassium every 1-2 hours","Administer IV potassium when K+ falls below 5.3 mEq/L","Administer subcutaneous long-acting insulin immediately","Monitor blood glucose hourly"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Type 1 diabetes, severe hyperglycemia, metabolic acidosis (pH 7.18, low HCO3), elevated anion gap, and Kussmaul respirations confirm DKA triggered by infection.",
      findings: "High glucose with acidosis, Kussmaul breathing (compensatory CO2 elimination), high anion gap (ketoacids), and Type 1 DM with infection trigger are diagnostic. Osmolality greater than 320 and gradual onset are HHS features.",
      actions: "IV NS corrects severe dehydration. Continuous insulin infusion corrects hyperglycemia and halts ketogenesis. K+ monitoring is critical as insulin drives K+ intracellularly. Replace K+ when it drops below 5.3 to prevent hypokalemia. Hourly glucose monitoring guides insulin titration. SubQ long-acting insulin during acute DKA is inappropriate."
    },
    bodySystem: "Endocrine",
    tier: "rpn"
  },
  {
    id: "bt_rpn_endocrine_96_4",
    scenario: "A 60-year-old female is found unresponsive by coworkers at her office. She has a medical alert bracelet indicating Addison's disease. Vital signs: BP 72/48 mmHg, HR 130 bpm, RR 22/min, Temp 36.0C, Blood glucose 52 mg/dL. Skin appears hyperpigmented. Serum sodium is 126 mEq/L, potassium 6.1 mEq/L. The patient recently relocated and has no established primary care provider.",
    centerOptions: ["Adrenal crisis (acute adrenal insufficiency)","Septic shock","Hypoglycemic episode","Myxedema coma"],
    centerCorrect: 0,
    leftFindings: ["Profound hypotension refractory to fluids alone","Hypoglycemia (blood glucose 52 mg/dL)","Hyponatremia with hyperkalemia","Known Addison's disease","High fever with chills","Severe hypothermia with bradycardia"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer IV hydrocortisone 100 mg STAT","Initiate aggressive IV normal saline with dextrose","Administer IV dextrose 50% for hypoglycemia","Monitor hemodynamic status continuously","Hold all corticosteroids until cortisol level returns","Obtain random cortisol and ACTH levels before treatment if possible"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Unresponsiveness, severe hypotension, hypoglycemia, hyponatremia, hyperkalemia, and known Addison's disease are classic for adrenal crisis requiring emergent glucocorticoid replacement.",
      findings: "Refractory hypotension, hypoglycemia, electrolyte pattern (low Na, high K), and Addison's history confirm adrenal crisis. High fever suggests sepsis. Hypothermia with bradycardia suggests myxedema coma.",
      actions: "IV hydrocortisone is life-saving and must not be delayed. IV NS with dextrose corrects dehydration and hypoglycemia. D50 treats acute hypoglycemia. Continuous monitoring detects hemodynamic changes. Cortisol/ACTH levels should be drawn before treatment if it does not delay therapy. Withholding steroids is dangerous."
    },
    bodySystem: "Endocrine",
    tier: "rpn"
  },
  {
    id: "bt_rpn_hematology_97_4",
    scenario: "A 18-year-old African American male presents to the ED with severe bilateral leg pain, swollen hands, and fever. His mother reports he has sickle cell disease. Vital signs: BP 100/62 mmHg, HR 122 bpm, RR 24/min, Temp 39.2C, SpO2 91%. CBC shows Hgb 6.2 g/dL, WBC 18,400/mm3, reticulocyte count 12%. The patient recently relocated and has no established primary care provider.",
    centerOptions: ["Vaso-occlusive sickle cell crisis with fever","Osteomyelitis","Acute lymphoblastic leukemia","Juvenile rheumatoid arthritis"],
    centerCorrect: 0,
    leftFindings: ["Severe bilateral bone pain","Known sickle cell disease","Fever with leukocytosis","Hemoglobin 6.2 g/dL with elevated reticulocytes","Painless joint swelling without warmth","Pancytopenia with blast cells"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer IV opioid analgesics for pain management","Initiate aggressive IV fluid hydration","Obtain blood cultures before antibiotics","Administer supplemental oxygen for SpO2 below 95%","Apply cold compresses to painful areas","Prepare for possible blood transfusion"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "A child with known sickle cell disease presenting with bilateral bone pain, dactylitis, fever, anemia, and elevated reticulocytes indicates vaso-occlusive crisis with possible infection requiring urgent treatment.",
      findings: "Bilateral bone pain, sickle cell history, fever, anemia with reticulocytosis (hemolysis compensation) confirm crisis. Painless joint swelling suggests JRA. Pancytopenia with blasts suggests leukemia.",
      actions: "IV opioids address severe pain (do not undertreat sickle cell pain). IV fluids reduce blood viscosity and sickling. Blood cultures identify infection source. O2 maintains oxygenation to reduce sickling. Transfusion may be needed for severe anemia. Cold compresses are contraindicated as cold promotes sickling."
    },
    bodySystem: "Hematology",
    tier: "rpn"
  },
  {
    id: "bt_rpn_mentalhealth_98_4",
    scenario: "A 44-year-old male is brought to the psychiatric emergency department by police after being found on a bridge railing. He reports feeling hopeless for 3 months after losing his job and a recent divorce. He states he has a plan to use a firearm stored at his home. He admits to heavy alcohol use daily. He has no prior psychiatric history. Vital signs are stable. The patient recently relocated and has no established primary care provider.",
    centerOptions: ["Acute suicidal crisis with imminent risk","Major depressive episode without suicidality","Adjustment disorder with depressed mood","Alcohol use disorder only"],
    centerCorrect: 0,
    leftFindings: ["Verbalized specific plan with access to lethal means","Hopelessness lasting 3 months","Multiple recent psychosocial stressors (job loss, divorce)","Active heavy alcohol use (disinhibiting factor)","Reports passive thoughts without plan","Denies any intent to harm self"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Implement one-to-one continuous observation","Initiate safety planning and restrict access to lethal means","Obtain psychiatric consultation for inpatient admission","Screen for substance intoxication and withdrawal","Discharge with outpatient follow-up referral","Ensure therapeutic, non-judgmental communication"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Active suicidal ideation with a specific lethal plan (firearm), access to means, multiple risk factors (hopelessness, substance use, psychosocial stressors), and behavioral evidence (found on bridge) indicate imminent suicide risk.",
      findings: "Specific plan with access, hopelessness, stressors, and alcohol use as a disinhibitor are high-risk factors. Passive thoughts without plan and denial of intent would lower risk but are not present here.",
      actions: "One-to-one observation prevents self-harm. Safety planning addresses means restriction. Psychiatric consult evaluates for involuntary hold if needed. Substance screening identifies intoxication. Therapeutic communication builds rapport. Discharge is unsafe given imminent risk level."
    },
    bodySystem: "Mental Health",
    tier: "rpn"
  },
  {
    id: "bt_rpn_immuneinfectious_99_4",
    scenario: "A 83-year-old male nursing home resident presents with altered mental status, fever, and productive cough with rust-colored sputum for 2 days. He has a history of COPD and type 2 diabetes. Vital signs: BP 86/54 mmHg, HR 112 bpm, RR 28/min, Temp 39.4C, SpO2 86% on room air. WBC 22,600/mm3. Lactate 4.2 mmol/L. Chest X-ray shows right lower lobe consolidation. The patient recently relocated and has no established primary care provider.",
    centerOptions: ["Sepsis secondary to community-acquired pneumonia","COPD exacerbation","Acute heart failure","Aspiration pneumonitis"],
    centerCorrect: 0,
    leftFindings: ["Fever with productive rust-colored sputum","Hypotension with tachycardia (signs of septic shock)","Elevated lactate 4.2 mmol/L indicating tissue hypoperfusion","Right lower lobe consolidation on chest X-ray","Bilateral wheezing without consolidation","Frothy pink sputum with bilateral infiltrates"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Initiate IV broad-spectrum antibiotics within 1 hour","Administer 30 mL/kg IV crystalloid bolus","Obtain blood cultures before antibiotics if possible","Apply supplemental oxygen to target SpO2 above 94%","Administer IV corticosteroids as first-line treatment","Measure serial lactate levels to assess resuscitation adequacy"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Suspected infection (pneumonia), organ dysfunction (hypotension, altered mental status), and elevated lactate greater than 2 mmol/L meet Sepsis-3 criteria. This represents septic shock requiring the SEP-1 bundle.",
      findings: "Fever, productive cough, consolidation confirm pneumonia source. Hypotension and tachycardia indicate shock. Elevated lactate confirms tissue hypoperfusion. Wheezing without consolidation suggests COPD. Frothy pink sputum suggests heart failure.",
      actions: "Antibiotics within 1 hour reduce mortality in sepsis. Fluid bolus restores perfusion. Blood cultures guide targeted therapy. Oxygen corrects hypoxemia. Corticosteroids are not first-line for sepsis (reserved for refractory shock). Serial lactate measures guide resuscitation."
    },
    bodySystem: "Immune/Infectious",
    tier: "rpn"
  },
  {
    id: "bt_rpn_reproductivematernity_100_4",
    scenario: "A 40-year-old G2P1 at 34 weeks gestation presents with sudden onset of severe abdominal pain and vaginal bleeding. She reports the pain is constant and her abdomen feels rigid and board-like. She has a history of chronic hypertension. Vital signs: BP 168/108 mmHg, HR 120 bpm, RR 24/min. Fetal heart rate shows persistent late decelerations with decreased variability. The patient recently relocated and has no established primary care provider.",
    centerOptions: ["Placental abruption","Placenta previa","Uterine rupture","Preterm labor"],
    centerCorrect: 0,
    leftFindings: ["Sudden onset constant abdominal pain with rigidity","Dark red vaginal bleeding","Board-like rigid uterus on palpation","Chronic hypertension as risk factor","Painless bright red vaginal bleeding","Intermittent cramping with progressive cervical dilation"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Initiate continuous fetal monitoring","Establish two large-bore IV lines for fluid resuscitation","Prepare for emergent cesarean delivery","Type and crossmatch blood products","Perform digital cervical examination","Administer IV magnesium sulfate for seizure prophylaxis"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Sudden severe constant pain, board-like rigidity, dark bleeding, chronic HTN risk factor, and fetal distress (late decels, decreased variability) are classic for placental abruption.",
      findings: "Constant pain with rigidity (Couvelaire uterus), dark bleeding, and HTN history are hallmarks. Painless bright bleeding suggests previa. Intermittent cramping with dilation suggests preterm labor.",
      actions: "Continuous FHR monitoring detects fetal compromise. Large-bore IVs prepare for hemorrhage management. Emergent cesarean is indicated for fetal distress. Blood products address hemorrhagic shock. MgSO4 prevents eclamptic seizures with severe HTN. Digital exam is contraindicated until previa is ruled out."
    },
    bodySystem: "Reproductive/Maternity",
    tier: "rpn"
  },
  {
    id: "bt_rpn_pediatrics_101_4",
    scenario: "A 15-year-old male is brought to the ED with a barking cough, inspiratory stridor, and hoarse voice that started after a mild upper respiratory infection. His parents report the symptoms worsened tonight. He has mild substernal retractions. Vital signs: HR 120 bpm, RR 30/min, Temp 38.3C, SpO2 93%. He is sitting upright and appears anxious but alert. The patient recently relocated and has no established primary care provider.",
    centerOptions: ["Moderate croup (laryngotracheobronchitis)","Epiglottitis","Foreign body aspiration","Bacterial tracheitis"],
    centerCorrect: 0,
    leftFindings: ["Barking (seal-like) cough","Inspiratory stridor at rest","Preceded by upper respiratory infection","Hoarse voice with mild retractions","Sudden onset while eating with unilateral wheeze","Drooling with tripod positioning and high fever"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer nebulized racemic epinephrine","Administer oral or IM dexamethasone","Keep the child calm and in a position of comfort","Monitor for rebound stridor after epinephrine","Examine the throat with tongue depressor","Place on continuous pulse oximetry"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Barking cough, inspiratory stridor, hoarseness following URI, and age 6 months to 3 years are classic for viral croup (laryngotracheobronchitis), most commonly caused by parainfluenza virus.",
      findings: "Barking cough, stridor at rest, URI prodrome, and hoarseness with retractions confirm moderate croup. Sudden onset with eating suggests foreign body. Drooling, tripod, and high fever suggest epiglottitis.",
      actions: "Racemic epinephrine reduces subglottic edema. Dexamethasone reduces inflammation (single dose is standard). Keeping the child calm prevents worsening airway obstruction. Rebound monitoring detects recurrence after epinephrine. Pulse oximetry tracks oxygenation. Throat examination with a tongue depressor is contraindicated as it may worsen obstruction and is specifically avoided in suspected epiglottitis."
    },
    bodySystem: "Pediatrics",
    tier: "rpn"
  },
  {
    id: "bt_rpn_emergencytrauma_102_4",
    scenario: "A 46-year-old male arrives via EMS after a motorcycle collision at approximately 60 km/h. He is alert but confused. He has a large open wound on the right thigh with visible bone and significant hemorrhage. Vital signs: BP 82/50 mmHg, HR 138 bpm, RR 28/min, SpO2 94%. He is pale, cool, and diaphoretic. Estimated blood loss is greater than 1,500 mL. The patient recently relocated and has no established primary care provider.",
    centerOptions: ["Hemorrhagic shock (Class III-IV)","Neurogenic shock","Cardiogenic shock","Tension pneumothorax"],
    centerCorrect: 0,
    leftFindings: ["Tachycardia with hypotension","Pale, cool, diaphoretic skin","Open fracture with greater than 1,500 mL estimated blood loss","Altered mental status (confusion)","Warm, flushed skin with bradycardia","Distended neck veins with tracheal deviation"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Apply direct pressure and tourniquet to hemorrhaging extremity","Initiate massive transfusion protocol","Establish two large-bore IV lines with warmed fluids","Perform primary survey using ABCDE approach","Elevate the injured extremity above heart level only","Obtain type and crossmatch and administer blood products"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Tachycardia, hypotension, altered mental status, cool/pale/diaphoretic skin, and estimated blood loss greater than 1,500 mL in a trauma patient indicate Class III-IV hemorrhagic shock.",
      findings: "Tachycardia, hypotension, cool diaphoretic skin, and AMS with significant blood loss are classic hemorrhagic shock findings. Warm flushed skin with bradycardia suggests neurogenic shock. Distended neck veins with tracheal deviation suggests tension pneumothorax.",
      actions: "Direct pressure and tourniquet control active hemorrhage. Massive transfusion protocol provides balanced blood product resuscitation. Large-bore IVs enable rapid volume replacement. ABCDE primary survey ensures systematic assessment. Blood products restore oxygen-carrying capacity. Elevation alone is insufficient for active hemorrhage of this magnitude."
    },
    bodySystem: "Emergency/Trauma",
    tier: "rpn"
  },
  {
    id: "bt_rpn_musculoskeletal_103_4",
    scenario: "A 31-year-old male presents 6 hours after a tibial fracture reduction and casting. He reports increasing severe pain in his lower leg that is not relieved by prescribed opioids. Pain worsens with passive dorsiflexion of the toes. His leg feels tight and tense. Capillary refill is 4 seconds. He reports tingling and numbness in his toes. The patient recently relocated and has no established primary care provider.",
    centerOptions: ["Compartment syndrome","Deep vein thrombosis","Fat embolism syndrome","Cellulitis"],
    centerCorrect: 0,
    leftFindings: ["Pain out of proportion to injury not relieved by analgesics","Pain with passive stretch (dorsiflexion)","Paresthesia (tingling and numbness)","Tense and swollen compartment","Warmth and erythema along the vein","Petechial rash with confusion"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Notify surgeon immediately for possible fasciotomy","Remove or bivalve the cast immediately","Elevate the limb to heart level only (not above)","Monitor neurovascular status every 15-30 minutes","Apply compression bandage to reduce swelling","Measure compartment pressures if available"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "The 5 Ps of compartment syndrome: Pain out of proportion, Pain with passive stretch, Paresthesia, Pressure (tense compartment), and delayed capillary refill indicate a surgical emergency.",
      findings: "Disproportionate pain, pain with passive stretch, paresthesia, and tense compartment are classic. Warmth along a vein suggests DVT. Petechial rash with confusion suggests fat embolism.",
      actions: "Surgical fasciotomy is definitive treatment. Cast removal releases external pressure. Elevate to heart level (not above, which could worsen ischemia). Frequent neurovascular checks track progression. Compartment pressure measurement confirms diagnosis. Compression is contraindicated as it increases compartment pressure."
    },
    bodySystem: "Musculoskeletal",
    tier: "rpn"
  },
  {
    id: "bt_rpn_integumentary_104_4",
    scenario: "A 57-year-old male is admitted to the burn unit after a house fire with estimated 35% TBSA second and third degree burns to his chest, bilateral arms, and face. He was in an enclosed space with smoke exposure. His voice is hoarse and he has singed nasal hairs. Vital signs: BP 102/64 mmHg, HR 124 bpm, RR 26/min, SpO2 92%. He weighs 80 kg. The patient recently relocated and has no established primary care provider.",
    centerOptions: ["Major thermal burn with inhalation injury","Superficial burn requiring outpatient care","Chemical burn exposure","Electrical burn injury"],
    centerCorrect: 0,
    leftFindings: ["35% TBSA second and third degree burns","Hoarse voice with singed nasal hairs (inhalation injury signs)","Enclosed space fire exposure","Facial burns present","Burns limited to extremities only","Entry and exit wounds visible"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Initiate Parkland formula fluid resuscitation (4 mL x kg x %TBSA)","Prepare for early intubation due to inhalation injury signs","Obtain carboxyhemoglobin level","Monitor urine output target 0.5-1 mL/kg/hr","Apply ice directly to burn wounds","Administer tetanus prophylaxis if not current"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Greater than 20% TBSA burns with facial involvement, hoarse voice, singed nasal hairs, and enclosed space exposure indicate major burns with high suspicion for inhalation injury.",
      findings: "35% TBSA, hoarseness, singed nasal hairs, enclosed space, and facial burns are classic for inhalation injury. Burns limited to extremities without airway signs lower risk. Entry/exit wounds suggest electrical injury.",
      actions: "Parkland formula guides crystalloid resuscitation (half in first 8 hours). Early intubation protects airway before edema progresses. Carboxyhemoglobin detects CO poisoning. Urine output guides fluid adequacy. Tetanus prophylaxis prevents infection. Ice is contraindicated as it causes vasoconstriction and worsens tissue damage."
    },
    bodySystem: "Integumentary",
    tier: "rpn"
  },
  {
    id: "bt_rpn_cardiovascular_105_5",
    scenario: "A 71-year-old male with a history of hypertension presents to the emergency department with crushing substernal chest pain radiating to the left arm and jaw. He is diaphoretic and nauseated. Vital signs: BP 158/94 mmHg, HR 102 bpm, RR 22/min, SpO2 94% on room air. ECG shows ST-segment elevation in leads II, III, and aVF.",
    centerOptions: ["Inferior ST-elevation myocardial infarction","Unstable angina","Aortic dissection","Pulmonary embolism"],
    centerCorrect: 0,
    leftFindings: ["ST-elevation in leads II, III, aVF","Crushing substernal chest pain radiating to left arm","Diaphoresis and nausea","Elevated troponin levels expected","Normal chest X-ray findings","Bilateral equal blood pressures"],
    leftCorrect: [0,1,2],
    leftSelectCount: 3,
    rightActions: ["Administer aspirin 325 mg chewed immediately","Activate cardiac catheterization lab","Administer morphine for pain if not hypotensive","Administer thrombolytics without ECG confirmation","Obtain serial troponin levels","Discharge with follow-up appointment"],
    rightCorrect: [0,1,4],
    rightSelectCount: 3,
    rationale: {
      condition: "ST-elevation in inferior leads (II, III, aVF) with classic symptoms of crushing chest pain, diaphoresis, and nausea indicates an inferior STEMI requiring emergent intervention.",
      findings: "ST-elevation in inferior leads, crushing substernal pain radiating to the arm, and diaphoresis are hallmark findings of acute MI. Normal chest X-ray and bilateral equal BPs help rule out aortic dissection.",
      actions: "Aspirin inhibits platelet aggregation and is first-line. Cardiac catheterization lab activation enables primary PCI. Serial troponins confirm myocardial injury. Thrombolytics without ECG confirmation is inappropriate, and discharge is unsafe."
    },
    bodySystem: "Cardiovascular",
    tier: "rpn"
  },
  {
    id: "bt_rpn_cardiovascular_106_5",
    scenario: "A 75-year-old female with a history of atrial fibrillation and heart failure presents with increasing dyspnea, orthopnea, and bilateral lower extremity edema over 3 days. She reports sleeping on 3 pillows. Vital signs: BP 142/88 mmHg, HR 112 bpm irregular, RR 28/min, SpO2 88% on room air. Auscultation reveals bilateral crackles and an S3 gallop. BNP is 1,240 pg/mL.",
    centerOptions: ["Acute decompensated heart failure","Community-acquired pneumonia","Chronic obstructive pulmonary disease exacerbation","Pleural effusion"],
    centerCorrect: 0,
    leftFindings: ["Bilateral crackles with S3 gallop","Orthopnea requiring 3-pillow elevation","BNP 1,240 pg/mL","Bilateral lower extremity edema","Productive cough with green sputum","Barrel chest with prolonged expiration"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer IV furosemide as ordered","Position in high Fowler's position","Apply supplemental oxygen to maintain SpO2 above 94%","Encourage increased oral fluid intake","Monitor strict intake and output","Administer IV normal saline bolus"],
    rightCorrect: [0,1,2,4],
    rightSelectCount: 4,
    rationale: {
      condition: "Bilateral crackles, S3 gallop, orthopnea, peripheral edema, and markedly elevated BNP (greater than 400 pg/mL) are classic findings of acute decompensated heart failure.",
      findings: "S3 gallop indicates volume overload. Orthopnea and elevated BNP confirm fluid status. Bilateral edema reflects right-sided congestion. Green sputum and barrel chest are distractors suggesting pneumonia and COPD respectively.",
      actions: "IV furosemide promotes diuresis. High Fowler's reduces preload and improves breathing. Oxygen treats hypoxemia. Strict I&O monitors fluid balance. Increased fluids and saline bolus would worsen volume overload."
    },
    bodySystem: "Cardiovascular",
    tier: "rpn"
  },
  {
    id: "bt_rpn_cardiovascular_107_5",
    scenario: "A 58-year-old male with uncontrolled hypertension presents with sudden onset of severe tearing chest pain radiating to the back between the scapulae. He appears anxious and diaphoretic. Vital signs: Right arm BP 182/110 mmHg, Left arm BP 148/90 mmHg, HR 118 bpm, RR 24/min. Chest X-ray shows widened mediastinum.",
    centerOptions: ["Aortic dissection","Myocardial infarction","Tension pneumothorax","Esophageal rupture"],
    centerCorrect: 0,
    leftFindings: ["Tearing chest pain radiating to the back","Blood pressure differential between arms greater than 20 mmHg","Widened mediastinum on chest X-ray","History of uncontrolled hypertension","ST-elevation on ECG","Subcutaneous emphysema"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer IV beta-blocker to reduce heart rate and BP","Obtain emergent CT angiography","Prepare for possible surgical intervention","Administer thrombolytics immediately","Establish two large-bore IV lines","Administer aspirin 325 mg"],
    rightCorrect: [0,1,2,4],
    rightSelectCount: 4,
    rationale: {
      condition: "Sudden tearing chest pain radiating to the back, blood pressure differential greater than 20 mmHg between arms, and widened mediastinum are classic for aortic dissection.",
      findings: "Tearing pain to the back, BP differential, widened mediastinum, and uncontrolled HTN history are hallmark findings. ST-elevation suggests MI, and subcutaneous emphysema suggests esophageal rupture.",
      actions: "IV beta-blockers control heart rate and shear stress. CT angiography confirms diagnosis. Surgical prep is essential. Large-bore IVs allow resuscitation. Thrombolytics and aspirin are absolutely contraindicated as they would worsen hemorrhage."
    },
    bodySystem: "Cardiovascular",
    tier: "rpn"
  },
  {
    id: "bt_rpn_respiratory_108_5",
    scenario: "A 45-year-old female with a history of asthma presents to the emergency department with severe dyspnea, audible wheezing, and inability to speak in full sentences. She has used her albuterol inhaler 8 times today without relief. Vital signs: BP 138/82 mmHg, HR 124 bpm, RR 32/min, SpO2 87% on room air. Peak flow is 120 L/min (predicted 380 L/min).",
    centerOptions: ["Severe acute asthma exacerbation (status asthmaticus)","Chronic obstructive pulmonary disease exacerbation","Anaphylaxis","Spontaneous pneumothorax"],
    centerCorrect: 0,
    leftFindings: ["Inability to speak in full sentences","Peak flow less than 33% of predicted","SpO2 87% on room air","No relief from repeated albuterol use","Inspiratory stridor","Unilateral absent breath sounds"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer continuous nebulized albuterol","Administer IV corticosteroids (methylprednisolone)","Prepare for possible intubation","Administer ipratropium bromide nebulization","Discharge with oral prednisone taper","Apply high-flow supplemental oxygen"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Severe dyspnea with inability to speak in full sentences, peak flow below 33% predicted, refractory to beta-agonist therapy, and hypoxemia indicate status asthmaticus requiring aggressive treatment.",
      findings: "Inability to speak in sentences, severely reduced peak flow, hypoxemia, and albuterol resistance are hallmarks of severe exacerbation. Stridor suggests upper airway obstruction, and unilateral absent sounds suggest pneumothorax.",
      actions: "Continuous nebulized albuterol provides sustained bronchodilation. IV steroids reduce inflammation. Intubation preparation ensures airway protection. Ipratropium provides additional bronchodilation. High-flow oxygen treats hypoxemia. Discharge is inappropriate for this severity."
    },
    bodySystem: "Respiratory",
    tier: "rpn"
  },
  {
    id: "bt_rpn_respiratory_109_5",
    scenario: "A 66-year-old male, 4 days post total hip replacement, suddenly develops sharp pleuritic chest pain, dyspnea, and hemoptysis. He is tachycardic and anxious. Vital signs: BP 110/70 mmHg, HR 118 bpm, RR 28/min, SpO2 89% on room air. D-dimer is 2,400 ng/mL. CT pulmonary angiography reveals a filling defect in the right main pulmonary artery.",
    centerOptions: ["Pulmonary embolism","Hospital-acquired pneumonia","Fat embolism syndrome","Acute coronary syndrome"],
    centerCorrect: 0,
    leftFindings: ["Pleuritic chest pain with hemoptysis","Recent surgical procedure with immobility","D-dimer 2,400 ng/mL","CT showing filling defect in pulmonary artery","Petechial rash on chest and axillae","Productive cough with purulent sputum"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Initiate anticoagulation with IV heparin","Apply supplemental oxygen","Elevate the head of bed","Prepare for thrombolysis if hemodynamically unstable","Encourage early ambulation without restrictions","Monitor for signs of right ventricular failure"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Pleuritic chest pain, hemoptysis, tachycardia, and hypoxemia in a postoperative patient with elevated D-dimer and CT-confirmed filling defect confirm pulmonary embolism.",
      findings: "Pleuritic pain with hemoptysis, surgical immobility risk factor, markedly elevated D-dimer, and CT angiography findings are diagnostic. Petechial rash suggests fat embolism; purulent sputum suggests pneumonia.",
      actions: "IV heparin prevents clot propagation. Oxygen treats hypoxemia. Head elevation improves ventilation. Thrombolysis is reserved for massive PE with hemodynamic instability. Monitoring for RV failure detects deterioration. Unrestricted ambulation could dislodge further emboli."
    },
    bodySystem: "Respiratory",
    tier: "rpn"
  },
  {
    id: "bt_rpn_respiratory_110_5",
    scenario: "A 61-year-old male with a 40-pack-year smoking history presents with worsening dyspnea, increased sputum production with yellow-green color, and low-grade fever for 3 days. He uses home oxygen at 2 L/min. Vital signs: BP 136/82 mmHg, HR 98 bpm, RR 26/min, SpO2 85% on 2 L/min NC, Temp 38.2C. ABG: pH 7.31, PaCO2 58 mmHg, PaO2 52 mmHg, HCO3 28 mEq/L.",
    centerOptions: ["Acute exacerbation of COPD","Community-acquired pneumonia","Acute asthma attack","Pulmonary fibrosis"],
    centerCorrect: 0,
    leftFindings: ["40-pack-year smoking history with chronic dyspnea","Increased purulent sputum production","Compensated respiratory acidosis on ABG","Hypoxemia despite home oxygen","No wheezing or reversible obstruction","Bilateral fine inspiratory crackles only"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Increase oxygen to maintain SpO2 88-92%","Administer short-acting bronchodilator nebulization","Administer systemic corticosteroids","Start antibiotics for infectious exacerbation","Administer high-flow oxygen to achieve SpO2 100%","Monitor for CO2 narcosis and worsening respiratory acidosis"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "A COPD patient with worsening dyspnea, increased purulent sputum, fever, and compensated respiratory acidosis with chronic CO2 retention meets criteria for acute COPD exacerbation.",
      findings: "Smoking history, baseline dyspnea, purulent sputum increase, and ABG showing compensated respiratory acidosis (elevated PaCO2 with elevated HCO3) confirm chronic CO2 retention with acute worsening.",
      actions: "Target SpO2 88-92% to avoid suppressing hypoxic drive. Bronchodilators relieve airflow obstruction. Steroids reduce inflammation. Antibiotics treat infectious trigger. High-flow O2 to 100% risks CO2 narcosis. Monitoring respiratory status is essential."
    },
    bodySystem: "Respiratory",
    tier: "rpn"
  },
  {
    id: "bt_rpn_neurological_111_5",
    scenario: "A 77-year-old male is brought to the emergency department by his wife who noticed sudden onset of right-sided facial droop, right arm weakness, and slurred speech 45 minutes ago. He has a history of atrial fibrillation and takes warfarin irregularly. Vital signs: BP 178/96 mmHg, HR 88 bpm irregular, RR 18/min, SpO2 97%. NIHSS score is 14. CT head shows no hemorrhage.",
    centerOptions: ["Acute ischemic stroke","Hemorrhagic stroke","Transient ischemic attack","Bell's palsy"],
    centerCorrect: 0,
    leftFindings: ["Sudden right-sided facial droop and arm weakness","Slurred speech (dysarthria)","History of atrial fibrillation","CT head negative for hemorrhage","NIHSS score of 14","Gradual bilateral facial weakness"],
    leftCorrect: [0,1,2,3,4],
    leftSelectCount: 5,
    rightActions: ["Determine eligibility for IV alteplase (tPA) within window","Obtain STAT INR and coagulation studies","Maintain blood pressure below 185/110 mmHg if thrombolysis candidate","Administer aspirin 325 mg immediately before imaging","Perform neurological assessments every 15 minutes","Position head of bed flat if no increased ICP"],
    rightCorrect: [0,1,2,4,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Sudden onset focal neurological deficits (facial droop, arm weakness, dysarthria) with negative CT for hemorrhage and atrial fibrillation as embolic source confirms acute ischemic stroke.",
      findings: "Sudden unilateral deficits, dysarthria, A-fib history, negative CT, and elevated NIHSS are classic. Gradual bilateral weakness suggests other diagnoses like myasthenia gravis.",
      actions: "tPA eligibility assessment is time-critical (within 4.5 hours). INR is essential since the patient takes warfarin (tPA contraindicated if INR greater than 1.7). BP management enables safe thrombolysis. Frequent neuro checks detect deterioration. Flat HOB improves cerebral perfusion. Aspirin before imaging is contraindicated as hemorrhage must be ruled out first."
    },
    bodySystem: "Neurological",
    tier: "rpn"
  },
  {
    id: "bt_rpn_neurological_112_5",
    scenario: "A 31-year-old female presents with severe headache described as the worst headache of my life, sudden onset while exercising. She reports neck stiffness and photophobia. Vital signs: BP 168/94 mmHg, HR 92 bpm, RR 18/min, Temp 37.8C. Neurological exam reveals nuchal rigidity. CT head is negative.",
    centerOptions: ["Subarachnoid hemorrhage","Tension headache","Meningitis","Migraine with aura"],
    centerCorrect: 0,
    leftFindings: ["Thunderclap headache - worst headache of life","Sudden onset during physical exertion","Nuchal rigidity on examination","Photophobia","Gradual onset over several hours","Aura with visual scotoma preceding headache"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Perform lumbar puncture to assess for xanthochromia","Order CT angiography to identify aneurysm","Maintain strict bed rest with dim lighting","Administer IV nimodipine to prevent vasospasm","Discharge with analgesics if CT is negative","Initiate seizure precautions"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Thunderclap headache with sudden onset during exertion, nuchal rigidity, and photophobia are classic for subarachnoid hemorrhage even with a negative CT (sensitivity decreases after 6 hours).",
      findings: "Worst headache of life with sudden onset, exertional trigger, nuchal rigidity, and photophobia strongly suggest SAH. Gradual onset and visual aura are migraine features.",
      actions: "Lumbar puncture after negative CT detects xanthochromia (blood breakdown products). CTA identifies the bleeding source. Bed rest reduces rebleeding risk. Nimodipine prevents cerebral vasospasm. Seizure precautions prevent further injury. Discharge without LP is unsafe."
    },
    bodySystem: "Neurological",
    tier: "rpn"
  },
  {
    id: "bt_rpn_gastrointestinal_113_5",
    scenario: "A 48-year-old male with a history of alcohol use disorder presents with hematemesis of approximately 500 mL of bright red blood. He appears pale, anxious, and diaphoretic. Vital signs: BP 88/52 mmHg, HR 128 bpm, RR 24/min, SpO2 96%. Abdomen is distended with a fluid wave. He has spider angiomata on his chest and palmar erythema.",
    centerOptions: ["Esophageal variceal hemorrhage","Peptic ulcer disease bleeding","Mallory-Weiss tear","Gastric carcinoma"],
    centerCorrect: 0,
    leftFindings: ["Large-volume hematemesis with bright red blood","Signs of portal hypertension (ascites, spider angiomata)","Hemodynamic instability (hypotension, tachycardia)","History of alcohol use disorder","Epigastric pain relieved by eating","Coffee-ground emesis with melena only"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Establish two large-bore IV lines for volume resuscitation","Type and crossmatch for packed red blood cells","Administer IV octreotide to reduce portal pressure","Prepare for emergent endoscopy","Insert nasogastric tube for gastric lavage first","Administer IV proton pump inhibitor"],
    rightCorrect: [0,1,2,3],
    rightSelectCount: 4,
    rationale: {
      condition: "Large-volume hematemesis in a patient with alcohol use disorder and signs of portal hypertension (ascites, spider angiomata, palmar erythema) is consistent with esophageal variceal bleeding.",
      findings: "Bright red hematemesis, portal hypertension signs, hemodynamic instability, and alcohol history point to variceal hemorrhage. Epigastric pain relieved by eating suggests PUD. Coffee-ground emesis suggests slower upper GI bleed.",
      actions: "Large-bore IVs enable rapid resuscitation. Blood products correct hemorrhagic shock. Octreotide reduces portal venous pressure. Emergent endoscopy allows band ligation or sclerotherapy. NG tube in suspected varices is controversial and may worsen bleeding. PPI is appropriate for PUD but not primary therapy for varices."
    },
    bodySystem: "Gastrointestinal",
    tier: "rpn"
  },
  {
    id: "bt_rpn_gastrointestinal_114_5",
    scenario: "A 38-year-old female presents with acute onset right lower quadrant pain that began periumbilically 12 hours ago and migrated. She reports nausea, one episode of vomiting, and anorexia. Vital signs: BP 126/78 mmHg, HR 96 bpm, RR 18/min, Temp 38.4C. McBurney's point tenderness is positive. Rovsing sign is positive. WBC 14,200/mm3.",
    centerOptions: ["Acute appendicitis","Ectopic pregnancy","Ovarian torsion","Crohn's disease flare"],
    centerCorrect: 0,
    leftFindings: ["Pain migration from periumbilical to right lower quadrant","McBurney's point tenderness","Positive Rovsing sign","Leukocytosis with left shift","Positive pregnancy test","Chronic intermittent cramping with bloody diarrhea"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Maintain NPO status","Administer IV fluids and antibiotics","Prepare patient for surgical consultation","Obtain CT abdomen/pelvis with contrast","Administer oral laxatives for constipation","Apply heating pad to abdomen for comfort"],
    rightCorrect: [0,1,2,3],
    rightSelectCount: 4,
    rationale: {
      condition: "Classic migratory pain from periumbilical to RLQ, positive McBurney's and Rovsing signs, fever, and leukocytosis strongly suggest acute appendicitis.",
      findings: "Pain migration pattern, McBurney's tenderness, positive Rovsing sign, and elevated WBC are classic appendicitis findings. Positive pregnancy test suggests ectopic pregnancy. Chronic bloody diarrhea suggests Crohn's.",
      actions: "NPO status prepares for potential surgery. IV fluids maintain hydration and antibiotics prevent peritonitis. Surgical consult is essential. CT confirms diagnosis. Laxatives are contraindicated with possible appendicitis. Heat application may increase inflammation risk."
    },
    bodySystem: "Gastrointestinal",
    tier: "rpn"
  },
  {
    id: "bt_rpn_renalurinary_115_5",
    scenario: "A 65-year-old male with a history of type 2 diabetes and chronic kidney disease (Stage 3) presents with generalized weakness, nausea, and muscle cramping. Lab results show: K+ 6.8 mEq/L, BUN 48 mg/dL, Creatinine 4.2 mg/dL, GFR 18 mL/min. ECG shows peaked T waves and widened QRS complex.",
    centerOptions: ["Severe hyperkalemia with ECG changes","Diabetic ketoacidosis","Hyponatremia","Acute renal failure"],
    centerCorrect: 0,
    leftFindings: ["Potassium 6.8 mEq/L","Peaked T waves on ECG","Widened QRS complex","Muscle weakness and cramping","Deep Kussmaul respirations","Serum sodium 118 mEq/L"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer IV calcium gluconate for cardiac membrane stabilization","Administer insulin with dextrose to shift potassium intracellularly","Place on continuous cardiac monitoring","Administer sodium polystyrene sulfonate (Kayexalate)","Administer potassium chloride supplement","Prepare for possible emergent hemodialysis"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Potassium of 6.8 mEq/L with ECG changes (peaked T waves, widened QRS) represents a cardiac emergency requiring immediate treatment to prevent fatal arrhythmia.",
      findings: "Severely elevated potassium, peaked T waves, widened QRS, and neuromuscular symptoms confirm symptomatic hyperkalemia. Kussmaul breathing is a DKA finding. Low sodium would indicate hyponatremia.",
      actions: "Calcium gluconate stabilizes cardiac membranes immediately (does not lower K+). Insulin/dextrose shifts K+ into cells. Continuous monitoring detects arrhythmias. Kayexalate removes K+ from the body. Hemodialysis is definitive treatment for refractory cases. Additional potassium is absolutely contraindicated."
    },
    bodySystem: "Renal/Urinary",
    tier: "rpn"
  },
  {
    id: "bt_rpn_endocrine_116_5",
    scenario: "A 25-year-old female with Type 1 diabetes is brought to the ED by her roommate. She has had nausea, vomiting, and abdominal pain for 2 days following a urinary tract infection. She appears dehydrated with dry mucous membranes. Vital signs: BP 96/58 mmHg, HR 118 bpm, RR 28/min deep (Kussmaul), Temp 38.1C. Labs: Blood glucose 486 mg/dL, pH 7.18, HCO3 10 mEq/L, Anion gap 24, Serum K+ 5.6 mEq/L.",
    centerOptions: ["Diabetic ketoacidosis","Hyperosmolar hyperglycemic state","Lactic acidosis","Uremic acidosis"],
    centerCorrect: 0,
    leftFindings: ["Blood glucose 486 mg/dL with metabolic acidosis","Kussmaul respirations (deep and rapid)","Elevated anion gap of 24","Type 1 diabetes with intercurrent infection","Serum osmolality greater than 320 mOsm/kg","Gradual onset over 1-2 weeks"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Initiate aggressive IV normal saline resuscitation","Begin continuous IV regular insulin infusion","Monitor serum potassium every 1-2 hours","Administer IV potassium when K+ falls below 5.3 mEq/L","Administer subcutaneous long-acting insulin immediately","Monitor blood glucose hourly"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Type 1 diabetes, severe hyperglycemia, metabolic acidosis (pH 7.18, low HCO3), elevated anion gap, and Kussmaul respirations confirm DKA triggered by infection.",
      findings: "High glucose with acidosis, Kussmaul breathing (compensatory CO2 elimination), high anion gap (ketoacids), and Type 1 DM with infection trigger are diagnostic. Osmolality greater than 320 and gradual onset are HHS features.",
      actions: "IV NS corrects severe dehydration. Continuous insulin infusion corrects hyperglycemia and halts ketogenesis. K+ monitoring is critical as insulin drives K+ intracellularly. Replace K+ when it drops below 5.3 to prevent hypokalemia. Hourly glucose monitoring guides insulin titration. SubQ long-acting insulin during acute DKA is inappropriate."
    },
    bodySystem: "Endocrine",
    tier: "rpn"
  },
  {
    id: "bt_rpn_endocrine_117_5",
    scenario: "A 51-year-old female is found unresponsive by coworkers at her office. She has a medical alert bracelet indicating Addison's disease. Vital signs: BP 72/48 mmHg, HR 130 bpm, RR 22/min, Temp 36.0C, Blood glucose 52 mg/dL. Skin appears hyperpigmented. Serum sodium is 126 mEq/L, potassium 6.1 mEq/L.",
    centerOptions: ["Adrenal crisis (acute adrenal insufficiency)","Septic shock","Hypoglycemic episode","Myxedema coma"],
    centerCorrect: 0,
    leftFindings: ["Profound hypotension refractory to fluids alone","Hypoglycemia (blood glucose 52 mg/dL)","Hyponatremia with hyperkalemia","Known Addison's disease","High fever with chills","Severe hypothermia with bradycardia"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer IV hydrocortisone 100 mg STAT","Initiate aggressive IV normal saline with dextrose","Administer IV dextrose 50% for hypoglycemia","Monitor hemodynamic status continuously","Hold all corticosteroids until cortisol level returns","Obtain random cortisol and ACTH levels before treatment if possible"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Unresponsiveness, severe hypotension, hypoglycemia, hyponatremia, hyperkalemia, and known Addison's disease are classic for adrenal crisis requiring emergent glucocorticoid replacement.",
      findings: "Refractory hypotension, hypoglycemia, electrolyte pattern (low Na, high K), and Addison's history confirm adrenal crisis. High fever suggests sepsis. Hypothermia with bradycardia suggests myxedema coma.",
      actions: "IV hydrocortisone is life-saving and must not be delayed. IV NS with dextrose corrects dehydration and hypoglycemia. D50 treats acute hypoglycemia. Continuous monitoring detects hemodynamic changes. Cortisol/ACTH levels should be drawn before treatment if it does not delay therapy. Withholding steroids is dangerous."
    },
    bodySystem: "Endocrine",
    tier: "rpn"
  },
  {
    id: "bt_rpn_hematology_118_5",
    scenario: "A 9-year-old African American male presents to the ED with severe bilateral leg pain, swollen hands, and fever. His mother reports he has sickle cell disease. Vital signs: BP 100/62 mmHg, HR 122 bpm, RR 24/min, Temp 39.2C, SpO2 91%. CBC shows Hgb 6.2 g/dL, WBC 18,400/mm3, reticulocyte count 12%.",
    centerOptions: ["Vaso-occlusive sickle cell crisis with fever","Osteomyelitis","Acute lymphoblastic leukemia","Juvenile rheumatoid arthritis"],
    centerCorrect: 0,
    leftFindings: ["Severe bilateral bone pain","Known sickle cell disease","Fever with leukocytosis","Hemoglobin 6.2 g/dL with elevated reticulocytes","Painless joint swelling without warmth","Pancytopenia with blast cells"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer IV opioid analgesics for pain management","Initiate aggressive IV fluid hydration","Obtain blood cultures before antibiotics","Administer supplemental oxygen for SpO2 below 95%","Apply cold compresses to painful areas","Prepare for possible blood transfusion"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "A child with known sickle cell disease presenting with bilateral bone pain, dactylitis, fever, anemia, and elevated reticulocytes indicates vaso-occlusive crisis with possible infection requiring urgent treatment.",
      findings: "Bilateral bone pain, sickle cell history, fever, anemia with reticulocytosis (hemolysis compensation) confirm crisis. Painless joint swelling suggests JRA. Pancytopenia with blasts suggests leukemia.",
      actions: "IV opioids address severe pain (do not undertreat sickle cell pain). IV fluids reduce blood viscosity and sickling. Blood cultures identify infection source. O2 maintains oxygenation to reduce sickling. Transfusion may be needed for severe anemia. Cold compresses are contraindicated as cold promotes sickling."
    },
    bodySystem: "Hematology",
    tier: "rpn"
  },
  {
    id: "bt_rpn_mentalhealth_119_5",
    scenario: "A 35-year-old male is brought to the psychiatric emergency department by police after being found on a bridge railing. He reports feeling hopeless for 3 months after losing his job and a recent divorce. He states he has a plan to use a firearm stored at his home. He admits to heavy alcohol use daily. He has no prior psychiatric history. Vital signs are stable.",
    centerOptions: ["Acute suicidal crisis with imminent risk","Major depressive episode without suicidality","Adjustment disorder with depressed mood","Alcohol use disorder only"],
    centerCorrect: 0,
    leftFindings: ["Verbalized specific plan with access to lethal means","Hopelessness lasting 3 months","Multiple recent psychosocial stressors (job loss, divorce)","Active heavy alcohol use (disinhibiting factor)","Reports passive thoughts without plan","Denies any intent to harm self"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Implement one-to-one continuous observation","Initiate safety planning and restrict access to lethal means","Obtain psychiatric consultation for inpatient admission","Screen for substance intoxication and withdrawal","Discharge with outpatient follow-up referral","Ensure therapeutic, non-judgmental communication"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Active suicidal ideation with a specific lethal plan (firearm), access to means, multiple risk factors (hopelessness, substance use, psychosocial stressors), and behavioral evidence (found on bridge) indicate imminent suicide risk.",
      findings: "Specific plan with access, hopelessness, stressors, and alcohol use as a disinhibitor are high-risk factors. Passive thoughts without plan and denial of intent would lower risk but are not present here.",
      actions: "One-to-one observation prevents self-harm. Safety planning addresses means restriction. Psychiatric consult evaluates for involuntary hold if needed. Substance screening identifies intoxication. Therapeutic communication builds rapport. Discharge is unsafe given imminent risk level."
    },
    bodySystem: "Mental Health",
    tier: "rpn"
  },
  {
    id: "bt_rpn_immuneinfectious_120_5",
    scenario: "A 74-year-old male nursing home resident presents with altered mental status, fever, and productive cough with rust-colored sputum for 2 days. He has a history of COPD and type 2 diabetes. Vital signs: BP 86/54 mmHg, HR 112 bpm, RR 28/min, Temp 39.4C, SpO2 86% on room air. WBC 22,600/mm3. Lactate 4.2 mmol/L. Chest X-ray shows right lower lobe consolidation.",
    centerOptions: ["Sepsis secondary to community-acquired pneumonia","COPD exacerbation","Acute heart failure","Aspiration pneumonitis"],
    centerCorrect: 0,
    leftFindings: ["Fever with productive rust-colored sputum","Hypotension with tachycardia (signs of septic shock)","Elevated lactate 4.2 mmol/L indicating tissue hypoperfusion","Right lower lobe consolidation on chest X-ray","Bilateral wheezing without consolidation","Frothy pink sputum with bilateral infiltrates"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Initiate IV broad-spectrum antibiotics within 1 hour","Administer 30 mL/kg IV crystalloid bolus","Obtain blood cultures before antibiotics if possible","Apply supplemental oxygen to target SpO2 above 94%","Administer IV corticosteroids as first-line treatment","Measure serial lactate levels to assess resuscitation adequacy"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Suspected infection (pneumonia), organ dysfunction (hypotension, altered mental status), and elevated lactate greater than 2 mmol/L meet Sepsis-3 criteria. This represents septic shock requiring the SEP-1 bundle.",
      findings: "Fever, productive cough, consolidation confirm pneumonia source. Hypotension and tachycardia indicate shock. Elevated lactate confirms tissue hypoperfusion. Wheezing without consolidation suggests COPD. Frothy pink sputum suggests heart failure.",
      actions: "Antibiotics within 1 hour reduce mortality in sepsis. Fluid bolus restores perfusion. Blood cultures guide targeted therapy. Oxygen corrects hypoxemia. Corticosteroids are not first-line for sepsis (reserved for refractory shock). Serial lactate measures guide resuscitation."
    },
    bodySystem: "Immune/Infectious",
    tier: "rpn"
  },
  {
    id: "bt_rpn_reproductivematernity_121_5",
    scenario: "A 31-year-old G2P1 at 34 weeks gestation presents with sudden onset of severe abdominal pain and vaginal bleeding. She reports the pain is constant and her abdomen feels rigid and board-like. She has a history of chronic hypertension. Vital signs: BP 168/108 mmHg, HR 120 bpm, RR 24/min. Fetal heart rate shows persistent late decelerations with decreased variability.",
    centerOptions: ["Placental abruption","Placenta previa","Uterine rupture","Preterm labor"],
    centerCorrect: 0,
    leftFindings: ["Sudden onset constant abdominal pain with rigidity","Dark red vaginal bleeding","Board-like rigid uterus on palpation","Chronic hypertension as risk factor","Painless bright red vaginal bleeding","Intermittent cramping with progressive cervical dilation"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Initiate continuous fetal monitoring","Establish two large-bore IV lines for fluid resuscitation","Prepare for emergent cesarean delivery","Type and crossmatch blood products","Perform digital cervical examination","Administer IV magnesium sulfate for seizure prophylaxis"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Sudden severe constant pain, board-like rigidity, dark bleeding, chronic HTN risk factor, and fetal distress (late decels, decreased variability) are classic for placental abruption.",
      findings: "Constant pain with rigidity (Couvelaire uterus), dark bleeding, and HTN history are hallmarks. Painless bright bleeding suggests previa. Intermittent cramping with dilation suggests preterm labor.",
      actions: "Continuous FHR monitoring detects fetal compromise. Large-bore IVs prepare for hemorrhage management. Emergent cesarean is indicated for fetal distress. Blood products address hemorrhagic shock. MgSO4 prevents eclamptic seizures with severe HTN. Digital exam is contraindicated until previa is ruled out."
    },
    bodySystem: "Reproductive/Maternity",
    tier: "rpn"
  },
  {
    id: "bt_rpn_pediatrics_122_5",
    scenario: "A 6-year-old male is brought to the ED with a barking cough, inspiratory stridor, and hoarse voice that started after a mild upper respiratory infection. His parents report the symptoms worsened tonight. He has mild substernal retractions. Vital signs: HR 120 bpm, RR 30/min, Temp 38.3C, SpO2 93%. He is sitting upright and appears anxious but alert.",
    centerOptions: ["Moderate croup (laryngotracheobronchitis)","Epiglottitis","Foreign body aspiration","Bacterial tracheitis"],
    centerCorrect: 0,
    leftFindings: ["Barking (seal-like) cough","Inspiratory stridor at rest","Preceded by upper respiratory infection","Hoarse voice with mild retractions","Sudden onset while eating with unilateral wheeze","Drooling with tripod positioning and high fever"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer nebulized racemic epinephrine","Administer oral or IM dexamethasone","Keep the child calm and in a position of comfort","Monitor for rebound stridor after epinephrine","Examine the throat with tongue depressor","Place on continuous pulse oximetry"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Barking cough, inspiratory stridor, hoarseness following URI, and age 6 months to 3 years are classic for viral croup (laryngotracheobronchitis), most commonly caused by parainfluenza virus.",
      findings: "Barking cough, stridor at rest, URI prodrome, and hoarseness with retractions confirm moderate croup. Sudden onset with eating suggests foreign body. Drooling, tripod, and high fever suggest epiglottitis.",
      actions: "Racemic epinephrine reduces subglottic edema. Dexamethasone reduces inflammation (single dose is standard). Keeping the child calm prevents worsening airway obstruction. Rebound monitoring detects recurrence after epinephrine. Pulse oximetry tracks oxygenation. Throat examination with a tongue depressor is contraindicated as it may worsen obstruction and is specifically avoided in suspected epiglottitis."
    },
    bodySystem: "Pediatrics",
    tier: "rpn"
  },
  {
    id: "bt_rpn_emergencytrauma_123_5",
    scenario: "A 37-year-old male arrives via EMS after a motorcycle collision at approximately 60 km/h. He is alert but confused. He has a large open wound on the right thigh with visible bone and significant hemorrhage. Vital signs: BP 82/50 mmHg, HR 138 bpm, RR 28/min, SpO2 94%. He is pale, cool, and diaphoretic. Estimated blood loss is greater than 1,500 mL.",
    centerOptions: ["Hemorrhagic shock (Class III-IV)","Neurogenic shock","Cardiogenic shock","Tension pneumothorax"],
    centerCorrect: 0,
    leftFindings: ["Tachycardia with hypotension","Pale, cool, diaphoretic skin","Open fracture with greater than 1,500 mL estimated blood loss","Altered mental status (confusion)","Warm, flushed skin with bradycardia","Distended neck veins with tracheal deviation"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Apply direct pressure and tourniquet to hemorrhaging extremity","Initiate massive transfusion protocol","Establish two large-bore IV lines with warmed fluids","Perform primary survey using ABCDE approach","Elevate the injured extremity above heart level only","Obtain type and crossmatch and administer blood products"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Tachycardia, hypotension, altered mental status, cool/pale/diaphoretic skin, and estimated blood loss greater than 1,500 mL in a trauma patient indicate Class III-IV hemorrhagic shock.",
      findings: "Tachycardia, hypotension, cool diaphoretic skin, and AMS with significant blood loss are classic hemorrhagic shock findings. Warm flushed skin with bradycardia suggests neurogenic shock. Distended neck veins with tracheal deviation suggests tension pneumothorax.",
      actions: "Direct pressure and tourniquet control active hemorrhage. Massive transfusion protocol provides balanced blood product resuscitation. Large-bore IVs enable rapid volume replacement. ABCDE primary survey ensures systematic assessment. Blood products restore oxygen-carrying capacity. Elevation alone is insufficient for active hemorrhage of this magnitude."
    },
    bodySystem: "Emergency/Trauma",
    tier: "rpn"
  },
  {
    id: "bt_rpn_musculoskeletal_124_5",
    scenario: "A 22-year-old male presents 6 hours after a tibial fracture reduction and casting. He reports increasing severe pain in his lower leg that is not relieved by prescribed opioids. Pain worsens with passive dorsiflexion of the toes. His leg feels tight and tense. Capillary refill is 4 seconds. He reports tingling and numbness in his toes.",
    centerOptions: ["Compartment syndrome","Deep vein thrombosis","Fat embolism syndrome","Cellulitis"],
    centerCorrect: 0,
    leftFindings: ["Pain out of proportion to injury not relieved by analgesics","Pain with passive stretch (dorsiflexion)","Paresthesia (tingling and numbness)","Tense and swollen compartment","Warmth and erythema along the vein","Petechial rash with confusion"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Notify surgeon immediately for possible fasciotomy","Remove or bivalve the cast immediately","Elevate the limb to heart level only (not above)","Monitor neurovascular status every 15-30 minutes","Apply compression bandage to reduce swelling","Measure compartment pressures if available"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "The 5 Ps of compartment syndrome: Pain out of proportion, Pain with passive stretch, Paresthesia, Pressure (tense compartment), and delayed capillary refill indicate a surgical emergency.",
      findings: "Disproportionate pain, pain with passive stretch, paresthesia, and tense compartment are classic. Warmth along a vein suggests DVT. Petechial rash with confusion suggests fat embolism.",
      actions: "Surgical fasciotomy is definitive treatment. Cast removal releases external pressure. Elevate to heart level (not above, which could worsen ischemia). Frequent neurovascular checks track progression. Compartment pressure measurement confirms diagnosis. Compression is contraindicated as it increases compartment pressure."
    },
    bodySystem: "Musculoskeletal",
    tier: "rpn"
  },
  {
    id: "bt_rpn_integumentary_125_5",
    scenario: "A 48-year-old male is admitted to the burn unit after a house fire with estimated 35% TBSA second and third degree burns to his chest, bilateral arms, and face. He was in an enclosed space with smoke exposure. His voice is hoarse and he has singed nasal hairs. Vital signs: BP 102/64 mmHg, HR 124 bpm, RR 26/min, SpO2 92%. He weighs 80 kg.",
    centerOptions: ["Major thermal burn with inhalation injury","Superficial burn requiring outpatient care","Chemical burn exposure","Electrical burn injury"],
    centerCorrect: 0,
    leftFindings: ["35% TBSA second and third degree burns","Hoarse voice with singed nasal hairs (inhalation injury signs)","Enclosed space fire exposure","Facial burns present","Burns limited to extremities only","Entry and exit wounds visible"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Initiate Parkland formula fluid resuscitation (4 mL x kg x %TBSA)","Prepare for early intubation due to inhalation injury signs","Obtain carboxyhemoglobin level","Monitor urine output target 0.5-1 mL/kg/hr","Apply ice directly to burn wounds","Administer tetanus prophylaxis if not current"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Greater than 20% TBSA burns with facial involvement, hoarse voice, singed nasal hairs, and enclosed space exposure indicate major burns with high suspicion for inhalation injury.",
      findings: "35% TBSA, hoarseness, singed nasal hairs, enclosed space, and facial burns are classic for inhalation injury. Burns limited to extremities without airway signs lower risk. Entry/exit wounds suggest electrical injury.",
      actions: "Parkland formula guides crystalloid resuscitation (half in first 8 hours). Early intubation protects airway before edema progresses. Carboxyhemoglobin detects CO poisoning. Urine output guides fluid adequacy. Tetanus prophylaxis prevents infection. Ice is contraindicated as it causes vasoconstriction and worsens tissue damage."
    },
    bodySystem: "Integumentary",
    tier: "rpn"
  },
  {
    id: "bt_rpn_cardiovascular_126_6",
    scenario: "A 63-year-old male with a history of hypertension presents to the emergency department with crushing substernal chest pain radiating to the left arm and jaw. He is diaphoretic and nauseated. Vital signs: BP 158/94 mmHg, HR 102 bpm, RR 22/min, SpO2 94% on room air. ECG shows ST-segment elevation in leads II, III, and aVF.",
    centerOptions: ["Inferior ST-elevation myocardial infarction","Unstable angina","Aortic dissection","Pulmonary embolism"],
    centerCorrect: 0,
    leftFindings: ["ST-elevation in leads II, III, aVF","Crushing substernal chest pain radiating to left arm","Diaphoresis and nausea","Elevated troponin levels expected","Normal chest X-ray findings","Bilateral equal blood pressures"],
    leftCorrect: [0,1,2],
    leftSelectCount: 3,
    rightActions: ["Administer aspirin 325 mg chewed immediately","Activate cardiac catheterization lab","Administer morphine for pain if not hypotensive","Administer thrombolytics without ECG confirmation","Obtain serial troponin levels","Discharge with follow-up appointment"],
    rightCorrect: [0,1,4],
    rightSelectCount: 3,
    rationale: {
      condition: "ST-elevation in inferior leads (II, III, aVF) with classic symptoms of crushing chest pain, diaphoresis, and nausea indicates an inferior STEMI requiring emergent intervention.",
      findings: "ST-elevation in inferior leads, crushing substernal pain radiating to the arm, and diaphoresis are hallmark findings of acute MI. Normal chest X-ray and bilateral equal BPs help rule out aortic dissection.",
      actions: "Aspirin inhibits platelet aggregation and is first-line. Cardiac catheterization lab activation enables primary PCI. Serial troponins confirm myocardial injury. Thrombolytics without ECG confirmation is inappropriate, and discharge is unsafe."
    },
    bodySystem: "Cardiovascular",
    tier: "rpn"
  },
  {
    id: "bt_rpn_cardiovascular_127_6",
    scenario: "A 67-year-old female with a history of atrial fibrillation and heart failure presents with increasing dyspnea, orthopnea, and bilateral lower extremity edema over 3 days. She reports sleeping on 3 pillows. Vital signs: BP 142/88 mmHg, HR 112 bpm irregular, RR 28/min, SpO2 88% on room air. Auscultation reveals bilateral crackles and an S3 gallop. BNP is 1,240 pg/mL.",
    centerOptions: ["Acute decompensated heart failure","Community-acquired pneumonia","Chronic obstructive pulmonary disease exacerbation","Pleural effusion"],
    centerCorrect: 0,
    leftFindings: ["Bilateral crackles with S3 gallop","Orthopnea requiring 3-pillow elevation","BNP 1,240 pg/mL","Bilateral lower extremity edema","Productive cough with green sputum","Barrel chest with prolonged expiration"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer IV furosemide as ordered","Position in high Fowler's position","Apply supplemental oxygen to maintain SpO2 above 94%","Encourage increased oral fluid intake","Monitor strict intake and output","Administer IV normal saline bolus"],
    rightCorrect: [0,1,2,4],
    rightSelectCount: 4,
    rationale: {
      condition: "Bilateral crackles, S3 gallop, orthopnea, peripheral edema, and markedly elevated BNP (greater than 400 pg/mL) are classic findings of acute decompensated heart failure.",
      findings: "S3 gallop indicates volume overload. Orthopnea and elevated BNP confirm fluid status. Bilateral edema reflects right-sided congestion. Green sputum and barrel chest are distractors suggesting pneumonia and COPD respectively.",
      actions: "IV furosemide promotes diuresis. High Fowler's reduces preload and improves breathing. Oxygen treats hypoxemia. Strict I&O monitors fluid balance. Increased fluids and saline bolus would worsen volume overload."
    },
    bodySystem: "Cardiovascular",
    tier: "rpn"
  },
  {
    id: "bt_rpn_cardiovascular_128_6",
    scenario: "A 50-year-old male with uncontrolled hypertension presents with sudden onset of severe tearing chest pain radiating to the back between the scapulae. He appears anxious and diaphoretic. Vital signs: Right arm BP 182/110 mmHg, Left arm BP 148/90 mmHg, HR 118 bpm, RR 24/min. Chest X-ray shows widened mediastinum.",
    centerOptions: ["Aortic dissection","Myocardial infarction","Tension pneumothorax","Esophageal rupture"],
    centerCorrect: 0,
    leftFindings: ["Tearing chest pain radiating to the back","Blood pressure differential between arms greater than 20 mmHg","Widened mediastinum on chest X-ray","History of uncontrolled hypertension","ST-elevation on ECG","Subcutaneous emphysema"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer IV beta-blocker to reduce heart rate and BP","Obtain emergent CT angiography","Prepare for possible surgical intervention","Administer thrombolytics immediately","Establish two large-bore IV lines","Administer aspirin 325 mg"],
    rightCorrect: [0,1,2,4],
    rightSelectCount: 4,
    rationale: {
      condition: "Sudden tearing chest pain radiating to the back, blood pressure differential greater than 20 mmHg between arms, and widened mediastinum are classic for aortic dissection.",
      findings: "Tearing pain to the back, BP differential, widened mediastinum, and uncontrolled HTN history are hallmark findings. ST-elevation suggests MI, and subcutaneous emphysema suggests esophageal rupture.",
      actions: "IV beta-blockers control heart rate and shear stress. CT angiography confirms diagnosis. Surgical prep is essential. Large-bore IVs allow resuscitation. Thrombolytics and aspirin are absolutely contraindicated as they would worsen hemorrhage."
    },
    bodySystem: "Cardiovascular",
    tier: "rpn"
  },
  {
    id: "bt_rpn_respiratory_129_6",
    scenario: "A 37-year-old female with a history of asthma presents to the emergency department with severe dyspnea, audible wheezing, and inability to speak in full sentences. She has used her albuterol inhaler 8 times today without relief. Vital signs: BP 138/82 mmHg, HR 124 bpm, RR 32/min, SpO2 87% on room air. Peak flow is 120 L/min (predicted 380 L/min).",
    centerOptions: ["Severe acute asthma exacerbation (status asthmaticus)","Chronic obstructive pulmonary disease exacerbation","Anaphylaxis","Spontaneous pneumothorax"],
    centerCorrect: 0,
    leftFindings: ["Inability to speak in full sentences","Peak flow less than 33% of predicted","SpO2 87% on room air","No relief from repeated albuterol use","Inspiratory stridor","Unilateral absent breath sounds"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer continuous nebulized albuterol","Administer IV corticosteroids (methylprednisolone)","Prepare for possible intubation","Administer ipratropium bromide nebulization","Discharge with oral prednisone taper","Apply high-flow supplemental oxygen"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Severe dyspnea with inability to speak in full sentences, peak flow below 33% predicted, refractory to beta-agonist therapy, and hypoxemia indicate status asthmaticus requiring aggressive treatment.",
      findings: "Inability to speak in sentences, severely reduced peak flow, hypoxemia, and albuterol resistance are hallmarks of severe exacerbation. Stridor suggests upper airway obstruction, and unilateral absent sounds suggest pneumothorax.",
      actions: "Continuous nebulized albuterol provides sustained bronchodilation. IV steroids reduce inflammation. Intubation preparation ensures airway protection. Ipratropium provides additional bronchodilation. High-flow oxygen treats hypoxemia. Discharge is inappropriate for this severity."
    },
    bodySystem: "Respiratory",
    tier: "rpn"
  },
  {
    id: "bt_rpn_respiratory_130_6",
    scenario: "A 58-year-old male, 4 days post total hip replacement, suddenly develops sharp pleuritic chest pain, dyspnea, and hemoptysis. He is tachycardic and anxious. Vital signs: BP 110/70 mmHg, HR 118 bpm, RR 28/min, SpO2 89% on room air. D-dimer is 2,400 ng/mL. CT pulmonary angiography reveals a filling defect in the right main pulmonary artery.",
    centerOptions: ["Pulmonary embolism","Hospital-acquired pneumonia","Fat embolism syndrome","Acute coronary syndrome"],
    centerCorrect: 0,
    leftFindings: ["Pleuritic chest pain with hemoptysis","Recent surgical procedure with immobility","D-dimer 2,400 ng/mL","CT showing filling defect in pulmonary artery","Petechial rash on chest and axillae","Productive cough with purulent sputum"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Initiate anticoagulation with IV heparin","Apply supplemental oxygen","Elevate the head of bed","Prepare for thrombolysis if hemodynamically unstable","Encourage early ambulation without restrictions","Monitor for signs of right ventricular failure"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Pleuritic chest pain, hemoptysis, tachycardia, and hypoxemia in a postoperative patient with elevated D-dimer and CT-confirmed filling defect confirm pulmonary embolism.",
      findings: "Pleuritic pain with hemoptysis, surgical immobility risk factor, markedly elevated D-dimer, and CT angiography findings are diagnostic. Petechial rash suggests fat embolism; purulent sputum suggests pneumonia.",
      actions: "IV heparin prevents clot propagation. Oxygen treats hypoxemia. Head elevation improves ventilation. Thrombolysis is reserved for massive PE with hemodynamic instability. Monitoring for RV failure detects deterioration. Unrestricted ambulation could dislodge further emboli."
    },
    bodySystem: "Respiratory",
    tier: "rpn"
  },
  {
    id: "bt_rpn_respiratory_131_6",
    scenario: "A 53-year-old male with a 40-pack-year smoking history presents with worsening dyspnea, increased sputum production with yellow-green color, and low-grade fever for 3 days. He uses home oxygen at 2 L/min. Vital signs: BP 136/82 mmHg, HR 98 bpm, RR 26/min, SpO2 85% on 2 L/min NC, Temp 38.2C. ABG: pH 7.31, PaCO2 58 mmHg, PaO2 52 mmHg, HCO3 28 mEq/L.",
    centerOptions: ["Acute exacerbation of COPD","Community-acquired pneumonia","Acute asthma attack","Pulmonary fibrosis"],
    centerCorrect: 0,
    leftFindings: ["40-pack-year smoking history with chronic dyspnea","Increased purulent sputum production","Compensated respiratory acidosis on ABG","Hypoxemia despite home oxygen","No wheezing or reversible obstruction","Bilateral fine inspiratory crackles only"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Increase oxygen to maintain SpO2 88-92%","Administer short-acting bronchodilator nebulization","Administer systemic corticosteroids","Start antibiotics for infectious exacerbation","Administer high-flow oxygen to achieve SpO2 100%","Monitor for CO2 narcosis and worsening respiratory acidosis"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "A COPD patient with worsening dyspnea, increased purulent sputum, fever, and compensated respiratory acidosis with chronic CO2 retention meets criteria for acute COPD exacerbation.",
      findings: "Smoking history, baseline dyspnea, purulent sputum increase, and ABG showing compensated respiratory acidosis (elevated PaCO2 with elevated HCO3) confirm chronic CO2 retention with acute worsening.",
      actions: "Target SpO2 88-92% to avoid suppressing hypoxic drive. Bronchodilators relieve airflow obstruction. Steroids reduce inflammation. Antibiotics treat infectious trigger. High-flow O2 to 100% risks CO2 narcosis. Monitoring respiratory status is essential."
    },
    bodySystem: "Respiratory",
    tier: "rpn"
  },
  {
    id: "bt_rpn_neurological_132_6",
    scenario: "A 69-year-old male is brought to the emergency department by his wife who noticed sudden onset of right-sided facial droop, right arm weakness, and slurred speech 45 minutes ago. He has a history of atrial fibrillation and takes warfarin irregularly. Vital signs: BP 178/96 mmHg, HR 88 bpm irregular, RR 18/min, SpO2 97%. NIHSS score is 14. CT head shows no hemorrhage.",
    centerOptions: ["Acute ischemic stroke","Hemorrhagic stroke","Transient ischemic attack","Bell's palsy"],
    centerCorrect: 0,
    leftFindings: ["Sudden right-sided facial droop and arm weakness","Slurred speech (dysarthria)","History of atrial fibrillation","CT head negative for hemorrhage","NIHSS score of 14","Gradual bilateral facial weakness"],
    leftCorrect: [0,1,2,3,4],
    leftSelectCount: 5,
    rightActions: ["Determine eligibility for IV alteplase (tPA) within window","Obtain STAT INR and coagulation studies","Maintain blood pressure below 185/110 mmHg if thrombolysis candidate","Administer aspirin 325 mg immediately before imaging","Perform neurological assessments every 15 minutes","Position head of bed flat if no increased ICP"],
    rightCorrect: [0,1,2,4,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Sudden onset focal neurological deficits (facial droop, arm weakness, dysarthria) with negative CT for hemorrhage and atrial fibrillation as embolic source confirms acute ischemic stroke.",
      findings: "Sudden unilateral deficits, dysarthria, A-fib history, negative CT, and elevated NIHSS are classic. Gradual bilateral weakness suggests other diagnoses like myasthenia gravis.",
      actions: "tPA eligibility assessment is time-critical (within 4.5 hours). INR is essential since the patient takes warfarin (tPA contraindicated if INR greater than 1.7). BP management enables safe thrombolysis. Frequent neuro checks detect deterioration. Flat HOB improves cerebral perfusion. Aspirin before imaging is contraindicated as hemorrhage must be ruled out first."
    },
    bodySystem: "Neurological",
    tier: "rpn"
  },
  {
    id: "bt_rpn_neurological_133_6",
    scenario: "A 23-year-old female presents with severe headache described as the worst headache of my life, sudden onset while exercising. She reports neck stiffness and photophobia. Vital signs: BP 168/94 mmHg, HR 92 bpm, RR 18/min, Temp 37.8C. Neurological exam reveals nuchal rigidity. CT head is negative.",
    centerOptions: ["Subarachnoid hemorrhage","Tension headache","Meningitis","Migraine with aura"],
    centerCorrect: 0,
    leftFindings: ["Thunderclap headache - worst headache of life","Sudden onset during physical exertion","Nuchal rigidity on examination","Photophobia","Gradual onset over several hours","Aura with visual scotoma preceding headache"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Perform lumbar puncture to assess for xanthochromia","Order CT angiography to identify aneurysm","Maintain strict bed rest with dim lighting","Administer IV nimodipine to prevent vasospasm","Discharge with analgesics if CT is negative","Initiate seizure precautions"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Thunderclap headache with sudden onset during exertion, nuchal rigidity, and photophobia are classic for subarachnoid hemorrhage even with a negative CT (sensitivity decreases after 6 hours).",
      findings: "Worst headache of life with sudden onset, exertional trigger, nuchal rigidity, and photophobia strongly suggest SAH. Gradual onset and visual aura are migraine features.",
      actions: "Lumbar puncture after negative CT detects xanthochromia (blood breakdown products). CTA identifies the bleeding source. Bed rest reduces rebleeding risk. Nimodipine prevents cerebral vasospasm. Seizure precautions prevent further injury. Discharge without LP is unsafe."
    },
    bodySystem: "Neurological",
    tier: "rpn"
  },
  {
    id: "bt_rpn_gastrointestinal_134_6",
    scenario: "A 40-year-old male with a history of alcohol use disorder presents with hematemesis of approximately 500 mL of bright red blood. He appears pale, anxious, and diaphoretic. Vital signs: BP 88/52 mmHg, HR 128 bpm, RR 24/min, SpO2 96%. Abdomen is distended with a fluid wave. He has spider angiomata on his chest and palmar erythema.",
    centerOptions: ["Esophageal variceal hemorrhage","Peptic ulcer disease bleeding","Mallory-Weiss tear","Gastric carcinoma"],
    centerCorrect: 0,
    leftFindings: ["Large-volume hematemesis with bright red blood","Signs of portal hypertension (ascites, spider angiomata)","Hemodynamic instability (hypotension, tachycardia)","History of alcohol use disorder","Epigastric pain relieved by eating","Coffee-ground emesis with melena only"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Establish two large-bore IV lines for volume resuscitation","Type and crossmatch for packed red blood cells","Administer IV octreotide to reduce portal pressure","Prepare for emergent endoscopy","Insert nasogastric tube for gastric lavage first","Administer IV proton pump inhibitor"],
    rightCorrect: [0,1,2,3],
    rightSelectCount: 4,
    rationale: {
      condition: "Large-volume hematemesis in a patient with alcohol use disorder and signs of portal hypertension (ascites, spider angiomata, palmar erythema) is consistent with esophageal variceal bleeding.",
      findings: "Bright red hematemesis, portal hypertension signs, hemodynamic instability, and alcohol history point to variceal hemorrhage. Epigastric pain relieved by eating suggests PUD. Coffee-ground emesis suggests slower upper GI bleed.",
      actions: "Large-bore IVs enable rapid resuscitation. Blood products correct hemorrhagic shock. Octreotide reduces portal venous pressure. Emergent endoscopy allows band ligation or sclerotherapy. NG tube in suspected varices is controversial and may worsen bleeding. PPI is appropriate for PUD but not primary therapy for varices."
    },
    bodySystem: "Gastrointestinal",
    tier: "rpn"
  },
  {
    id: "bt_rpn_gastrointestinal_135_6",
    scenario: "A 30-year-old female presents with acute onset right lower quadrant pain that began periumbilically 12 hours ago and migrated. She reports nausea, one episode of vomiting, and anorexia. Vital signs: BP 126/78 mmHg, HR 96 bpm, RR 18/min, Temp 38.4C. McBurney's point tenderness is positive. Rovsing sign is positive. WBC 14,200/mm3.",
    centerOptions: ["Acute appendicitis","Ectopic pregnancy","Ovarian torsion","Crohn's disease flare"],
    centerCorrect: 0,
    leftFindings: ["Pain migration from periumbilical to right lower quadrant","McBurney's point tenderness","Positive Rovsing sign","Leukocytosis with left shift","Positive pregnancy test","Chronic intermittent cramping with bloody diarrhea"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Maintain NPO status","Administer IV fluids and antibiotics","Prepare patient for surgical consultation","Obtain CT abdomen/pelvis with contrast","Administer oral laxatives for constipation","Apply heating pad to abdomen for comfort"],
    rightCorrect: [0,1,2,3],
    rightSelectCount: 4,
    rationale: {
      condition: "Classic migratory pain from periumbilical to RLQ, positive McBurney's and Rovsing signs, fever, and leukocytosis strongly suggest acute appendicitis.",
      findings: "Pain migration pattern, McBurney's tenderness, positive Rovsing sign, and elevated WBC are classic appendicitis findings. Positive pregnancy test suggests ectopic pregnancy. Chronic bloody diarrhea suggests Crohn's.",
      actions: "NPO status prepares for potential surgery. IV fluids maintain hydration and antibiotics prevent peritonitis. Surgical consult is essential. CT confirms diagnosis. Laxatives are contraindicated with possible appendicitis. Heat application may increase inflammation risk."
    },
    bodySystem: "Gastrointestinal",
    tier: "rpn"
  },
  {
    id: "bt_rpn_renalurinary_136_6",
    scenario: "A 57-year-old male with a history of type 2 diabetes and chronic kidney disease (Stage 3) presents with generalized weakness, nausea, and muscle cramping. Lab results show: K+ 6.8 mEq/L, BUN 48 mg/dL, Creatinine 4.2 mg/dL, GFR 18 mL/min. ECG shows peaked T waves and widened QRS complex.",
    centerOptions: ["Severe hyperkalemia with ECG changes","Diabetic ketoacidosis","Hyponatremia","Acute renal failure"],
    centerCorrect: 0,
    leftFindings: ["Potassium 6.8 mEq/L","Peaked T waves on ECG","Widened QRS complex","Muscle weakness and cramping","Deep Kussmaul respirations","Serum sodium 118 mEq/L"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer IV calcium gluconate for cardiac membrane stabilization","Administer insulin with dextrose to shift potassium intracellularly","Place on continuous cardiac monitoring","Administer sodium polystyrene sulfonate (Kayexalate)","Administer potassium chloride supplement","Prepare for possible emergent hemodialysis"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Potassium of 6.8 mEq/L with ECG changes (peaked T waves, widened QRS) represents a cardiac emergency requiring immediate treatment to prevent fatal arrhythmia.",
      findings: "Severely elevated potassium, peaked T waves, widened QRS, and neuromuscular symptoms confirm symptomatic hyperkalemia. Kussmaul breathing is a DKA finding. Low sodium would indicate hyponatremia.",
      actions: "Calcium gluconate stabilizes cardiac membranes immediately (does not lower K+). Insulin/dextrose shifts K+ into cells. Continuous monitoring detects arrhythmias. Kayexalate removes K+ from the body. Hemodialysis is definitive treatment for refractory cases. Additional potassium is absolutely contraindicated."
    },
    bodySystem: "Renal/Urinary",
    tier: "rpn"
  },
  {
    id: "bt_rpn_endocrine_137_6",
    scenario: "A 17-year-old female with Type 1 diabetes is brought to the ED by her roommate. She has had nausea, vomiting, and abdominal pain for 2 days following a urinary tract infection. She appears dehydrated with dry mucous membranes. Vital signs: BP 96/58 mmHg, HR 118 bpm, RR 28/min deep (Kussmaul), Temp 38.1C. Labs: Blood glucose 486 mg/dL, pH 7.18, HCO3 10 mEq/L, Anion gap 24, Serum K+ 5.6 mEq/L.",
    centerOptions: ["Diabetic ketoacidosis","Hyperosmolar hyperglycemic state","Lactic acidosis","Uremic acidosis"],
    centerCorrect: 0,
    leftFindings: ["Blood glucose 486 mg/dL with metabolic acidosis","Kussmaul respirations (deep and rapid)","Elevated anion gap of 24","Type 1 diabetes with intercurrent infection","Serum osmolality greater than 320 mOsm/kg","Gradual onset over 1-2 weeks"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Initiate aggressive IV normal saline resuscitation","Begin continuous IV regular insulin infusion","Monitor serum potassium every 1-2 hours","Administer IV potassium when K+ falls below 5.3 mEq/L","Administer subcutaneous long-acting insulin immediately","Monitor blood glucose hourly"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Type 1 diabetes, severe hyperglycemia, metabolic acidosis (pH 7.18, low HCO3), elevated anion gap, and Kussmaul respirations confirm DKA triggered by infection.",
      findings: "High glucose with acidosis, Kussmaul breathing (compensatory CO2 elimination), high anion gap (ketoacids), and Type 1 DM with infection trigger are diagnostic. Osmolality greater than 320 and gradual onset are HHS features.",
      actions: "IV NS corrects severe dehydration. Continuous insulin infusion corrects hyperglycemia and halts ketogenesis. K+ monitoring is critical as insulin drives K+ intracellularly. Replace K+ when it drops below 5.3 to prevent hypokalemia. Hourly glucose monitoring guides insulin titration. SubQ long-acting insulin during acute DKA is inappropriate."
    },
    bodySystem: "Endocrine",
    tier: "rpn"
  },
  {
    id: "bt_rpn_endocrine_138_6",
    scenario: "A 43-year-old female is found unresponsive by coworkers at her office. She has a medical alert bracelet indicating Addison's disease. Vital signs: BP 72/48 mmHg, HR 130 bpm, RR 22/min, Temp 36.0C, Blood glucose 52 mg/dL. Skin appears hyperpigmented. Serum sodium is 126 mEq/L, potassium 6.1 mEq/L.",
    centerOptions: ["Adrenal crisis (acute adrenal insufficiency)","Septic shock","Hypoglycemic episode","Myxedema coma"],
    centerCorrect: 0,
    leftFindings: ["Profound hypotension refractory to fluids alone","Hypoglycemia (blood glucose 52 mg/dL)","Hyponatremia with hyperkalemia","Known Addison's disease","High fever with chills","Severe hypothermia with bradycardia"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer IV hydrocortisone 100 mg STAT","Initiate aggressive IV normal saline with dextrose","Administer IV dextrose 50% for hypoglycemia","Monitor hemodynamic status continuously","Hold all corticosteroids until cortisol level returns","Obtain random cortisol and ACTH levels before treatment if possible"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Unresponsiveness, severe hypotension, hypoglycemia, hyponatremia, hyperkalemia, and known Addison's disease are classic for adrenal crisis requiring emergent glucocorticoid replacement.",
      findings: "Refractory hypotension, hypoglycemia, electrolyte pattern (low Na, high K), and Addison's history confirm adrenal crisis. High fever suggests sepsis. Hypothermia with bradycardia suggests myxedema coma.",
      actions: "IV hydrocortisone is life-saving and must not be delayed. IV NS with dextrose corrects dehydration and hypoglycemia. D50 treats acute hypoglycemia. Continuous monitoring detects hemodynamic changes. Cortisol/ACTH levels should be drawn before treatment if it does not delay therapy. Withholding steroids is dangerous."
    },
    bodySystem: "Endocrine",
    tier: "rpn"
  },
  {
    id: "bt_rpn_hematology_139_6",
    scenario: "A 1-year-old African American male presents to the ED with severe bilateral leg pain, swollen hands, and fever. His mother reports he has sickle cell disease. Vital signs: BP 100/62 mmHg, HR 122 bpm, RR 24/min, Temp 39.2C, SpO2 91%. CBC shows Hgb 6.2 g/dL, WBC 18,400/mm3, reticulocyte count 12%.",
    centerOptions: ["Vaso-occlusive sickle cell crisis with fever","Osteomyelitis","Acute lymphoblastic leukemia","Juvenile rheumatoid arthritis"],
    centerCorrect: 0,
    leftFindings: ["Severe bilateral bone pain","Known sickle cell disease","Fever with leukocytosis","Hemoglobin 6.2 g/dL with elevated reticulocytes","Painless joint swelling without warmth","Pancytopenia with blast cells"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer IV opioid analgesics for pain management","Initiate aggressive IV fluid hydration","Obtain blood cultures before antibiotics","Administer supplemental oxygen for SpO2 below 95%","Apply cold compresses to painful areas","Prepare for possible blood transfusion"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "A child with known sickle cell disease presenting with bilateral bone pain, dactylitis, fever, anemia, and elevated reticulocytes indicates vaso-occlusive crisis with possible infection requiring urgent treatment.",
      findings: "Bilateral bone pain, sickle cell history, fever, anemia with reticulocytosis (hemolysis compensation) confirm crisis. Painless joint swelling suggests JRA. Pancytopenia with blasts suggests leukemia.",
      actions: "IV opioids address severe pain (do not undertreat sickle cell pain). IV fluids reduce blood viscosity and sickling. Blood cultures identify infection source. O2 maintains oxygenation to reduce sickling. Transfusion may be needed for severe anemia. Cold compresses are contraindicated as cold promotes sickling."
    },
    bodySystem: "Hematology",
    tier: "rpn"
  },
  {
    id: "bt_rpn_mentalhealth_140_6",
    scenario: "A 27-year-old male is brought to the psychiatric emergency department by police after being found on a bridge railing. He reports feeling hopeless for 3 months after losing his job and a recent divorce. He states he has a plan to use a firearm stored at his home. He admits to heavy alcohol use daily. He has no prior psychiatric history. Vital signs are stable.",
    centerOptions: ["Acute suicidal crisis with imminent risk","Major depressive episode without suicidality","Adjustment disorder with depressed mood","Alcohol use disorder only"],
    centerCorrect: 0,
    leftFindings: ["Verbalized specific plan with access to lethal means","Hopelessness lasting 3 months","Multiple recent psychosocial stressors (job loss, divorce)","Active heavy alcohol use (disinhibiting factor)","Reports passive thoughts without plan","Denies any intent to harm self"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Implement one-to-one continuous observation","Initiate safety planning and restrict access to lethal means","Obtain psychiatric consultation for inpatient admission","Screen for substance intoxication and withdrawal","Discharge with outpatient follow-up referral","Ensure therapeutic, non-judgmental communication"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Active suicidal ideation with a specific lethal plan (firearm), access to means, multiple risk factors (hopelessness, substance use, psychosocial stressors), and behavioral evidence (found on bridge) indicate imminent suicide risk.",
      findings: "Specific plan with access, hopelessness, stressors, and alcohol use as a disinhibitor are high-risk factors. Passive thoughts without plan and denial of intent would lower risk but are not present here.",
      actions: "One-to-one observation prevents self-harm. Safety planning addresses means restriction. Psychiatric consult evaluates for involuntary hold if needed. Substance screening identifies intoxication. Therapeutic communication builds rapport. Discharge is unsafe given imminent risk level."
    },
    bodySystem: "Mental Health",
    tier: "rpn"
  },
  {
    id: "bt_rpn_immuneinfectious_141_6",
    scenario: "A 66-year-old male nursing home resident presents with altered mental status, fever, and productive cough with rust-colored sputum for 2 days. He has a history of COPD and type 2 diabetes. Vital signs: BP 86/54 mmHg, HR 112 bpm, RR 28/min, Temp 39.4C, SpO2 86% on room air. WBC 22,600/mm3. Lactate 4.2 mmol/L. Chest X-ray shows right lower lobe consolidation.",
    centerOptions: ["Sepsis secondary to community-acquired pneumonia","COPD exacerbation","Acute heart failure","Aspiration pneumonitis"],
    centerCorrect: 0,
    leftFindings: ["Fever with productive rust-colored sputum","Hypotension with tachycardia (signs of septic shock)","Elevated lactate 4.2 mmol/L indicating tissue hypoperfusion","Right lower lobe consolidation on chest X-ray","Bilateral wheezing without consolidation","Frothy pink sputum with bilateral infiltrates"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Initiate IV broad-spectrum antibiotics within 1 hour","Administer 30 mL/kg IV crystalloid bolus","Obtain blood cultures before antibiotics if possible","Apply supplemental oxygen to target SpO2 above 94%","Administer IV corticosteroids as first-line treatment","Measure serial lactate levels to assess resuscitation adequacy"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Suspected infection (pneumonia), organ dysfunction (hypotension, altered mental status), and elevated lactate greater than 2 mmol/L meet Sepsis-3 criteria. This represents septic shock requiring the SEP-1 bundle.",
      findings: "Fever, productive cough, consolidation confirm pneumonia source. Hypotension and tachycardia indicate shock. Elevated lactate confirms tissue hypoperfusion. Wheezing without consolidation suggests COPD. Frothy pink sputum suggests heart failure.",
      actions: "Antibiotics within 1 hour reduce mortality in sepsis. Fluid bolus restores perfusion. Blood cultures guide targeted therapy. Oxygen corrects hypoxemia. Corticosteroids are not first-line for sepsis (reserved for refractory shock). Serial lactate measures guide resuscitation."
    },
    bodySystem: "Immune/Infectious",
    tier: "rpn"
  },
  {
    id: "bt_rpn_reproductivematernity_142_6",
    scenario: "A 23-year-old G2P1 at 34 weeks gestation presents with sudden onset of severe abdominal pain and vaginal bleeding. She reports the pain is constant and her abdomen feels rigid and board-like. She has a history of chronic hypertension. Vital signs: BP 168/108 mmHg, HR 120 bpm, RR 24/min. Fetal heart rate shows persistent late decelerations with decreased variability.",
    centerOptions: ["Placental abruption","Placenta previa","Uterine rupture","Preterm labor"],
    centerCorrect: 0,
    leftFindings: ["Sudden onset constant abdominal pain with rigidity","Dark red vaginal bleeding","Board-like rigid uterus on palpation","Chronic hypertension as risk factor","Painless bright red vaginal bleeding","Intermittent cramping with progressive cervical dilation"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Initiate continuous fetal monitoring","Establish two large-bore IV lines for fluid resuscitation","Prepare for emergent cesarean delivery","Type and crossmatch blood products","Perform digital cervical examination","Administer IV magnesium sulfate for seizure prophylaxis"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Sudden severe constant pain, board-like rigidity, dark bleeding, chronic HTN risk factor, and fetal distress (late decels, decreased variability) are classic for placental abruption.",
      findings: "Constant pain with rigidity (Couvelaire uterus), dark bleeding, and HTN history are hallmarks. Painless bright bleeding suggests previa. Intermittent cramping with dilation suggests preterm labor.",
      actions: "Continuous FHR monitoring detects fetal compromise. Large-bore IVs prepare for hemorrhage management. Emergent cesarean is indicated for fetal distress. Blood products address hemorrhagic shock. MgSO4 prevents eclamptic seizures with severe HTN. Digital exam is contraindicated until previa is ruled out."
    },
    bodySystem: "Reproductive/Maternity",
    tier: "rpn"
  },
  {
    id: "bt_rpn_pediatrics_143_6",
    scenario: "A 1-year-old male is brought to the ED with a barking cough, inspiratory stridor, and hoarse voice that started after a mild upper respiratory infection. His parents report the symptoms worsened tonight. He has mild substernal retractions. Vital signs: HR 120 bpm, RR 30/min, Temp 38.3C, SpO2 93%. He is sitting upright and appears anxious but alert.",
    centerOptions: ["Moderate croup (laryngotracheobronchitis)","Epiglottitis","Foreign body aspiration","Bacterial tracheitis"],
    centerCorrect: 0,
    leftFindings: ["Barking (seal-like) cough","Inspiratory stridor at rest","Preceded by upper respiratory infection","Hoarse voice with mild retractions","Sudden onset while eating with unilateral wheeze","Drooling with tripod positioning and high fever"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer nebulized racemic epinephrine","Administer oral or IM dexamethasone","Keep the child calm and in a position of comfort","Monitor for rebound stridor after epinephrine","Examine the throat with tongue depressor","Place on continuous pulse oximetry"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Barking cough, inspiratory stridor, hoarseness following URI, and age 6 months to 3 years are classic for viral croup (laryngotracheobronchitis), most commonly caused by parainfluenza virus.",
      findings: "Barking cough, stridor at rest, URI prodrome, and hoarseness with retractions confirm moderate croup. Sudden onset with eating suggests foreign body. Drooling, tripod, and high fever suggest epiglottitis.",
      actions: "Racemic epinephrine reduces subglottic edema. Dexamethasone reduces inflammation (single dose is standard). Keeping the child calm prevents worsening airway obstruction. Rebound monitoring detects recurrence after epinephrine. Pulse oximetry tracks oxygenation. Throat examination with a tongue depressor is contraindicated as it may worsen obstruction and is specifically avoided in suspected epiglottitis."
    },
    bodySystem: "Pediatrics",
    tier: "rpn"
  },
  {
    id: "bt_rpn_emergencytrauma_144_6",
    scenario: "A 29-year-old male arrives via EMS after a motorcycle collision at approximately 60 km/h. He is alert but confused. He has a large open wound on the right thigh with visible bone and significant hemorrhage. Vital signs: BP 82/50 mmHg, HR 138 bpm, RR 28/min, SpO2 94%. He is pale, cool, and diaphoretic. Estimated blood loss is greater than 1,500 mL.",
    centerOptions: ["Hemorrhagic shock (Class III-IV)","Neurogenic shock","Cardiogenic shock","Tension pneumothorax"],
    centerCorrect: 0,
    leftFindings: ["Tachycardia with hypotension","Pale, cool, diaphoretic skin","Open fracture with greater than 1,500 mL estimated blood loss","Altered mental status (confusion)","Warm, flushed skin with bradycardia","Distended neck veins with tracheal deviation"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Apply direct pressure and tourniquet to hemorrhaging extremity","Initiate massive transfusion protocol","Establish two large-bore IV lines with warmed fluids","Perform primary survey using ABCDE approach","Elevate the injured extremity above heart level only","Obtain type and crossmatch and administer blood products"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Tachycardia, hypotension, altered mental status, cool/pale/diaphoretic skin, and estimated blood loss greater than 1,500 mL in a trauma patient indicate Class III-IV hemorrhagic shock.",
      findings: "Tachycardia, hypotension, cool diaphoretic skin, and AMS with significant blood loss are classic hemorrhagic shock findings. Warm flushed skin with bradycardia suggests neurogenic shock. Distended neck veins with tracheal deviation suggests tension pneumothorax.",
      actions: "Direct pressure and tourniquet control active hemorrhage. Massive transfusion protocol provides balanced blood product resuscitation. Large-bore IVs enable rapid volume replacement. ABCDE primary survey ensures systematic assessment. Blood products restore oxygen-carrying capacity. Elevation alone is insufficient for active hemorrhage of this magnitude."
    },
    bodySystem: "Emergency/Trauma",
    tier: "rpn"
  },
  {
    id: "bt_rpn_musculoskeletal_145_6",
    scenario: "A 14-year-old male presents 6 hours after a tibial fracture reduction and casting. He reports increasing severe pain in his lower leg that is not relieved by prescribed opioids. Pain worsens with passive dorsiflexion of the toes. His leg feels tight and tense. Capillary refill is 4 seconds. He reports tingling and numbness in his toes.",
    centerOptions: ["Compartment syndrome","Deep vein thrombosis","Fat embolism syndrome","Cellulitis"],
    centerCorrect: 0,
    leftFindings: ["Pain out of proportion to injury not relieved by analgesics","Pain with passive stretch (dorsiflexion)","Paresthesia (tingling and numbness)","Tense and swollen compartment","Warmth and erythema along the vein","Petechial rash with confusion"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Notify surgeon immediately for possible fasciotomy","Remove or bivalve the cast immediately","Elevate the limb to heart level only (not above)","Monitor neurovascular status every 15-30 minutes","Apply compression bandage to reduce swelling","Measure compartment pressures if available"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "The 5 Ps of compartment syndrome: Pain out of proportion, Pain with passive stretch, Paresthesia, Pressure (tense compartment), and delayed capillary refill indicate a surgical emergency.",
      findings: "Disproportionate pain, pain with passive stretch, paresthesia, and tense compartment are classic. Warmth along a vein suggests DVT. Petechial rash with confusion suggests fat embolism.",
      actions: "Surgical fasciotomy is definitive treatment. Cast removal releases external pressure. Elevate to heart level (not above, which could worsen ischemia). Frequent neurovascular checks track progression. Compartment pressure measurement confirms diagnosis. Compression is contraindicated as it increases compartment pressure."
    },
    bodySystem: "Musculoskeletal",
    tier: "rpn"
  },
  {
    id: "bt_rpn_integumentary_146_6",
    scenario: "A 40-year-old male is admitted to the burn unit after a house fire with estimated 35% TBSA second and third degree burns to his chest, bilateral arms, and face. He was in an enclosed space with smoke exposure. His voice is hoarse and he has singed nasal hairs. Vital signs: BP 102/64 mmHg, HR 124 bpm, RR 26/min, SpO2 92%. He weighs 80 kg.",
    centerOptions: ["Major thermal burn with inhalation injury","Superficial burn requiring outpatient care","Chemical burn exposure","Electrical burn injury"],
    centerCorrect: 0,
    leftFindings: ["35% TBSA second and third degree burns","Hoarse voice with singed nasal hairs (inhalation injury signs)","Enclosed space fire exposure","Facial burns present","Burns limited to extremities only","Entry and exit wounds visible"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Initiate Parkland formula fluid resuscitation (4 mL x kg x %TBSA)","Prepare for early intubation due to inhalation injury signs","Obtain carboxyhemoglobin level","Monitor urine output target 0.5-1 mL/kg/hr","Apply ice directly to burn wounds","Administer tetanus prophylaxis if not current"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Greater than 20% TBSA burns with facial involvement, hoarse voice, singed nasal hairs, and enclosed space exposure indicate major burns with high suspicion for inhalation injury.",
      findings: "35% TBSA, hoarseness, singed nasal hairs, enclosed space, and facial burns are classic for inhalation injury. Burns limited to extremities without airway signs lower risk. Entry/exit wounds suggest electrical injury.",
      actions: "Parkland formula guides crystalloid resuscitation (half in first 8 hours). Early intubation protects airway before edema progresses. Carboxyhemoglobin detects CO poisoning. Urine output guides fluid adequacy. Tetanus prophylaxis prevents infection. Ice is contraindicated as it causes vasoconstriction and worsens tissue damage."
    },
    bodySystem: "Integumentary",
    tier: "rpn"
  },
  {
    id: "bt_rpn_cardiovascular_147_7",
    scenario: "A 76-year-old male with a history of hypertension presents to the emergency department with crushing substernal chest pain radiating to the left arm and jaw. He is diaphoretic and nauseated. Vital signs: BP 158/94 mmHg, HR 102 bpm, RR 22/min, SpO2 94% on room air. ECG shows ST-segment elevation in leads II, III, and aVF.",
    centerOptions: ["Inferior ST-elevation myocardial infarction","Unstable angina","Aortic dissection","Pulmonary embolism"],
    centerCorrect: 0,
    leftFindings: ["ST-elevation in leads II, III, aVF","Crushing substernal chest pain radiating to left arm","Diaphoresis and nausea","Elevated troponin levels expected","Normal chest X-ray findings","Bilateral equal blood pressures"],
    leftCorrect: [0,1,2],
    leftSelectCount: 3,
    rightActions: ["Administer aspirin 325 mg chewed immediately","Activate cardiac catheterization lab","Administer morphine for pain if not hypotensive","Administer thrombolytics without ECG confirmation","Obtain serial troponin levels","Discharge with follow-up appointment"],
    rightCorrect: [0,1,4],
    rightSelectCount: 3,
    rationale: {
      condition: "ST-elevation in inferior leads (II, III, aVF) with classic symptoms of crushing chest pain, diaphoresis, and nausea indicates an inferior STEMI requiring emergent intervention.",
      findings: "ST-elevation in inferior leads, crushing substernal pain radiating to the arm, and diaphoresis are hallmark findings of acute MI. Normal chest X-ray and bilateral equal BPs help rule out aortic dissection.",
      actions: "Aspirin inhibits platelet aggregation and is first-line. Cardiac catheterization lab activation enables primary PCI. Serial troponins confirm myocardial injury. Thrombolytics without ECG confirmation is inappropriate, and discharge is unsafe."
    },
    bodySystem: "Cardiovascular",
    tier: "rpn"
  },
  {
    id: "bt_rpn_cardiovascular_148_7",
    scenario: "A 80-year-old female with a history of atrial fibrillation and heart failure presents with increasing dyspnea, orthopnea, and bilateral lower extremity edema over 3 days. She reports sleeping on 3 pillows. Vital signs: BP 142/88 mmHg, HR 112 bpm irregular, RR 28/min, SpO2 88% on room air. Auscultation reveals bilateral crackles and an S3 gallop. BNP is 1,240 pg/mL.",
    centerOptions: ["Acute decompensated heart failure","Community-acquired pneumonia","Chronic obstructive pulmonary disease exacerbation","Pleural effusion"],
    centerCorrect: 0,
    leftFindings: ["Bilateral crackles with S3 gallop","Orthopnea requiring 3-pillow elevation","BNP 1,240 pg/mL","Bilateral lower extremity edema","Productive cough with green sputum","Barrel chest with prolonged expiration"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer IV furosemide as ordered","Position in high Fowler's position","Apply supplemental oxygen to maintain SpO2 above 94%","Encourage increased oral fluid intake","Monitor strict intake and output","Administer IV normal saline bolus"],
    rightCorrect: [0,1,2,4],
    rightSelectCount: 4,
    rationale: {
      condition: "Bilateral crackles, S3 gallop, orthopnea, peripheral edema, and markedly elevated BNP (greater than 400 pg/mL) are classic findings of acute decompensated heart failure.",
      findings: "S3 gallop indicates volume overload. Orthopnea and elevated BNP confirm fluid status. Bilateral edema reflects right-sided congestion. Green sputum and barrel chest are distractors suggesting pneumonia and COPD respectively.",
      actions: "IV furosemide promotes diuresis. High Fowler's reduces preload and improves breathing. Oxygen treats hypoxemia. Strict I&O monitors fluid balance. Increased fluids and saline bolus would worsen volume overload."
    },
    bodySystem: "Cardiovascular",
    tier: "rpn"
  },
  {
    id: "bt_rpn_cardiovascular_149_7",
    scenario: "A 63-year-old male with uncontrolled hypertension presents with sudden onset of severe tearing chest pain radiating to the back between the scapulae. He appears anxious and diaphoretic. Vital signs: Right arm BP 182/110 mmHg, Left arm BP 148/90 mmHg, HR 118 bpm, RR 24/min. Chest X-ray shows widened mediastinum.",
    centerOptions: ["Aortic dissection","Myocardial infarction","Tension pneumothorax","Esophageal rupture"],
    centerCorrect: 0,
    leftFindings: ["Tearing chest pain radiating to the back","Blood pressure differential between arms greater than 20 mmHg","Widened mediastinum on chest X-ray","History of uncontrolled hypertension","ST-elevation on ECG","Subcutaneous emphysema"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer IV beta-blocker to reduce heart rate and BP","Obtain emergent CT angiography","Prepare for possible surgical intervention","Administer thrombolytics immediately","Establish two large-bore IV lines","Administer aspirin 325 mg"],
    rightCorrect: [0,1,2,4],
    rightSelectCount: 4,
    rationale: {
      condition: "Sudden tearing chest pain radiating to the back, blood pressure differential greater than 20 mmHg between arms, and widened mediastinum are classic for aortic dissection.",
      findings: "Tearing pain to the back, BP differential, widened mediastinum, and uncontrolled HTN history are hallmark findings. ST-elevation suggests MI, and subcutaneous emphysema suggests esophageal rupture.",
      actions: "IV beta-blockers control heart rate and shear stress. CT angiography confirms diagnosis. Surgical prep is essential. Large-bore IVs allow resuscitation. Thrombolytics and aspirin are absolutely contraindicated as they would worsen hemorrhage."
    },
    bodySystem: "Cardiovascular",
    tier: "rpn"
  },
  {
    id: "bt_rpn_respiratory_150_7",
    scenario: "A 50-year-old female with a history of asthma presents to the emergency department with severe dyspnea, audible wheezing, and inability to speak in full sentences. She has used her albuterol inhaler 8 times today without relief. Vital signs: BP 138/82 mmHg, HR 124 bpm, RR 32/min, SpO2 87% on room air. Peak flow is 120 L/min (predicted 380 L/min).",
    centerOptions: ["Severe acute asthma exacerbation (status asthmaticus)","Chronic obstructive pulmonary disease exacerbation","Anaphylaxis","Spontaneous pneumothorax"],
    centerCorrect: 0,
    leftFindings: ["Inability to speak in full sentences","Peak flow less than 33% of predicted","SpO2 87% on room air","No relief from repeated albuterol use","Inspiratory stridor","Unilateral absent breath sounds"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer continuous nebulized albuterol","Administer IV corticosteroids (methylprednisolone)","Prepare for possible intubation","Administer ipratropium bromide nebulization","Discharge with oral prednisone taper","Apply high-flow supplemental oxygen"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Severe dyspnea with inability to speak in full sentences, peak flow below 33% predicted, refractory to beta-agonist therapy, and hypoxemia indicate status asthmaticus requiring aggressive treatment.",
      findings: "Inability to speak in sentences, severely reduced peak flow, hypoxemia, and albuterol resistance are hallmarks of severe exacerbation. Stridor suggests upper airway obstruction, and unilateral absent sounds suggest pneumothorax.",
      actions: "Continuous nebulized albuterol provides sustained bronchodilation. IV steroids reduce inflammation. Intubation preparation ensures airway protection. Ipratropium provides additional bronchodilation. High-flow oxygen treats hypoxemia. Discharge is inappropriate for this severity."
    },
    bodySystem: "Respiratory",
    tier: "rpn"
  },
  {
    id: "bt_rpn_respiratory_151_7",
    scenario: "A 71-year-old male, 4 days post total hip replacement, suddenly develops sharp pleuritic chest pain, dyspnea, and hemoptysis. He is tachycardic and anxious. Vital signs: BP 110/70 mmHg, HR 118 bpm, RR 28/min, SpO2 89% on room air. D-dimer is 2,400 ng/mL. CT pulmonary angiography reveals a filling defect in the right main pulmonary artery.",
    centerOptions: ["Pulmonary embolism","Hospital-acquired pneumonia","Fat embolism syndrome","Acute coronary syndrome"],
    centerCorrect: 0,
    leftFindings: ["Pleuritic chest pain with hemoptysis","Recent surgical procedure with immobility","D-dimer 2,400 ng/mL","CT showing filling defect in pulmonary artery","Petechial rash on chest and axillae","Productive cough with purulent sputum"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Initiate anticoagulation with IV heparin","Apply supplemental oxygen","Elevate the head of bed","Prepare for thrombolysis if hemodynamically unstable","Encourage early ambulation without restrictions","Monitor for signs of right ventricular failure"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Pleuritic chest pain, hemoptysis, tachycardia, and hypoxemia in a postoperative patient with elevated D-dimer and CT-confirmed filling defect confirm pulmonary embolism.",
      findings: "Pleuritic pain with hemoptysis, surgical immobility risk factor, markedly elevated D-dimer, and CT angiography findings are diagnostic. Petechial rash suggests fat embolism; purulent sputum suggests pneumonia.",
      actions: "IV heparin prevents clot propagation. Oxygen treats hypoxemia. Head elevation improves ventilation. Thrombolysis is reserved for massive PE with hemodynamic instability. Monitoring for RV failure detects deterioration. Unrestricted ambulation could dislodge further emboli."
    },
    bodySystem: "Respiratory",
    tier: "rpn"
  },
  {
    id: "bt_rpn_respiratory_152_7",
    scenario: "A 66-year-old male with a 40-pack-year smoking history presents with worsening dyspnea, increased sputum production with yellow-green color, and low-grade fever for 3 days. He uses home oxygen at 2 L/min. Vital signs: BP 136/82 mmHg, HR 98 bpm, RR 26/min, SpO2 85% on 2 L/min NC, Temp 38.2C. ABG: pH 7.31, PaCO2 58 mmHg, PaO2 52 mmHg, HCO3 28 mEq/L.",
    centerOptions: ["Acute exacerbation of COPD","Community-acquired pneumonia","Acute asthma attack","Pulmonary fibrosis"],
    centerCorrect: 0,
    leftFindings: ["40-pack-year smoking history with chronic dyspnea","Increased purulent sputum production","Compensated respiratory acidosis on ABG","Hypoxemia despite home oxygen","No wheezing or reversible obstruction","Bilateral fine inspiratory crackles only"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Increase oxygen to maintain SpO2 88-92%","Administer short-acting bronchodilator nebulization","Administer systemic corticosteroids","Start antibiotics for infectious exacerbation","Administer high-flow oxygen to achieve SpO2 100%","Monitor for CO2 narcosis and worsening respiratory acidosis"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "A COPD patient with worsening dyspnea, increased purulent sputum, fever, and compensated respiratory acidosis with chronic CO2 retention meets criteria for acute COPD exacerbation.",
      findings: "Smoking history, baseline dyspnea, purulent sputum increase, and ABG showing compensated respiratory acidosis (elevated PaCO2 with elevated HCO3) confirm chronic CO2 retention with acute worsening.",
      actions: "Target SpO2 88-92% to avoid suppressing hypoxic drive. Bronchodilators relieve airflow obstruction. Steroids reduce inflammation. Antibiotics treat infectious trigger. High-flow O2 to 100% risks CO2 narcosis. Monitoring respiratory status is essential."
    },
    bodySystem: "Respiratory",
    tier: "rpn"
  },
  {
    id: "bt_rpn_neurological_153_7",
    scenario: "A 82-year-old male is brought to the emergency department by his wife who noticed sudden onset of right-sided facial droop, right arm weakness, and slurred speech 45 minutes ago. He has a history of atrial fibrillation and takes warfarin irregularly. Vital signs: BP 178/96 mmHg, HR 88 bpm irregular, RR 18/min, SpO2 97%. NIHSS score is 14. CT head shows no hemorrhage.",
    centerOptions: ["Acute ischemic stroke","Hemorrhagic stroke","Transient ischemic attack","Bell's palsy"],
    centerCorrect: 0,
    leftFindings: ["Sudden right-sided facial droop and arm weakness","Slurred speech (dysarthria)","History of atrial fibrillation","CT head negative for hemorrhage","NIHSS score of 14","Gradual bilateral facial weakness"],
    leftCorrect: [0,1,2,3,4],
    leftSelectCount: 5,
    rightActions: ["Determine eligibility for IV alteplase (tPA) within window","Obtain STAT INR and coagulation studies","Maintain blood pressure below 185/110 mmHg if thrombolysis candidate","Administer aspirin 325 mg immediately before imaging","Perform neurological assessments every 15 minutes","Position head of bed flat if no increased ICP"],
    rightCorrect: [0,1,2,4,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Sudden onset focal neurological deficits (facial droop, arm weakness, dysarthria) with negative CT for hemorrhage and atrial fibrillation as embolic source confirms acute ischemic stroke.",
      findings: "Sudden unilateral deficits, dysarthria, A-fib history, negative CT, and elevated NIHSS are classic. Gradual bilateral weakness suggests other diagnoses like myasthenia gravis.",
      actions: "tPA eligibility assessment is time-critical (within 4.5 hours). INR is essential since the patient takes warfarin (tPA contraindicated if INR greater than 1.7). BP management enables safe thrombolysis. Frequent neuro checks detect deterioration. Flat HOB improves cerebral perfusion. Aspirin before imaging is contraindicated as hemorrhage must be ruled out first."
    },
    bodySystem: "Neurological",
    tier: "rpn"
  },
  {
    id: "bt_rpn_neurological_154_7",
    scenario: "A 36-year-old female presents with severe headache described as the worst headache of my life, sudden onset while exercising. She reports neck stiffness and photophobia. Vital signs: BP 168/94 mmHg, HR 92 bpm, RR 18/min, Temp 37.8C. Neurological exam reveals nuchal rigidity. CT head is negative.",
    centerOptions: ["Subarachnoid hemorrhage","Tension headache","Meningitis","Migraine with aura"],
    centerCorrect: 0,
    leftFindings: ["Thunderclap headache - worst headache of life","Sudden onset during physical exertion","Nuchal rigidity on examination","Photophobia","Gradual onset over several hours","Aura with visual scotoma preceding headache"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Perform lumbar puncture to assess for xanthochromia","Order CT angiography to identify aneurysm","Maintain strict bed rest with dim lighting","Administer IV nimodipine to prevent vasospasm","Discharge with analgesics if CT is negative","Initiate seizure precautions"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Thunderclap headache with sudden onset during exertion, nuchal rigidity, and photophobia are classic for subarachnoid hemorrhage even with a negative CT (sensitivity decreases after 6 hours).",
      findings: "Worst headache of life with sudden onset, exertional trigger, nuchal rigidity, and photophobia strongly suggest SAH. Gradual onset and visual aura are migraine features.",
      actions: "Lumbar puncture after negative CT detects xanthochromia (blood breakdown products). CTA identifies the bleeding source. Bed rest reduces rebleeding risk. Nimodipine prevents cerebral vasospasm. Seizure precautions prevent further injury. Discharge without LP is unsafe."
    },
    bodySystem: "Neurological",
    tier: "rpn"
  },
  {
    id: "bt_rpn_gastrointestinal_155_7",
    scenario: "A 53-year-old male with a history of alcohol use disorder presents with hematemesis of approximately 500 mL of bright red blood. He appears pale, anxious, and diaphoretic. Vital signs: BP 88/52 mmHg, HR 128 bpm, RR 24/min, SpO2 96%. Abdomen is distended with a fluid wave. He has spider angiomata on his chest and palmar erythema.",
    centerOptions: ["Esophageal variceal hemorrhage","Peptic ulcer disease bleeding","Mallory-Weiss tear","Gastric carcinoma"],
    centerCorrect: 0,
    leftFindings: ["Large-volume hematemesis with bright red blood","Signs of portal hypertension (ascites, spider angiomata)","Hemodynamic instability (hypotension, tachycardia)","History of alcohol use disorder","Epigastric pain relieved by eating","Coffee-ground emesis with melena only"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Establish two large-bore IV lines for volume resuscitation","Type and crossmatch for packed red blood cells","Administer IV octreotide to reduce portal pressure","Prepare for emergent endoscopy","Insert nasogastric tube for gastric lavage first","Administer IV proton pump inhibitor"],
    rightCorrect: [0,1,2,3],
    rightSelectCount: 4,
    rationale: {
      condition: "Large-volume hematemesis in a patient with alcohol use disorder and signs of portal hypertension (ascites, spider angiomata, palmar erythema) is consistent with esophageal variceal bleeding.",
      findings: "Bright red hematemesis, portal hypertension signs, hemodynamic instability, and alcohol history point to variceal hemorrhage. Epigastric pain relieved by eating suggests PUD. Coffee-ground emesis suggests slower upper GI bleed.",
      actions: "Large-bore IVs enable rapid resuscitation. Blood products correct hemorrhagic shock. Octreotide reduces portal venous pressure. Emergent endoscopy allows band ligation or sclerotherapy. NG tube in suspected varices is controversial and may worsen bleeding. PPI is appropriate for PUD but not primary therapy for varices."
    },
    bodySystem: "Gastrointestinal",
    tier: "rpn"
  },
  {
    id: "bt_rpn_gastrointestinal_156_7",
    scenario: "A 43-year-old female presents with acute onset right lower quadrant pain that began periumbilically 12 hours ago and migrated. She reports nausea, one episode of vomiting, and anorexia. Vital signs: BP 126/78 mmHg, HR 96 bpm, RR 18/min, Temp 38.4C. McBurney's point tenderness is positive. Rovsing sign is positive. WBC 14,200/mm3.",
    centerOptions: ["Acute appendicitis","Ectopic pregnancy","Ovarian torsion","Crohn's disease flare"],
    centerCorrect: 0,
    leftFindings: ["Pain migration from periumbilical to right lower quadrant","McBurney's point tenderness","Positive Rovsing sign","Leukocytosis with left shift","Positive pregnancy test","Chronic intermittent cramping with bloody diarrhea"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Maintain NPO status","Administer IV fluids and antibiotics","Prepare patient for surgical consultation","Obtain CT abdomen/pelvis with contrast","Administer oral laxatives for constipation","Apply heating pad to abdomen for comfort"],
    rightCorrect: [0,1,2,3],
    rightSelectCount: 4,
    rationale: {
      condition: "Classic migratory pain from periumbilical to RLQ, positive McBurney's and Rovsing signs, fever, and leukocytosis strongly suggest acute appendicitis.",
      findings: "Pain migration pattern, McBurney's tenderness, positive Rovsing sign, and elevated WBC are classic appendicitis findings. Positive pregnancy test suggests ectopic pregnancy. Chronic bloody diarrhea suggests Crohn's.",
      actions: "NPO status prepares for potential surgery. IV fluids maintain hydration and antibiotics prevent peritonitis. Surgical consult is essential. CT confirms diagnosis. Laxatives are contraindicated with possible appendicitis. Heat application may increase inflammation risk."
    },
    bodySystem: "Gastrointestinal",
    tier: "rpn"
  },
  {
    id: "bt_rpn_renalurinary_157_7",
    scenario: "A 70-year-old male with a history of type 2 diabetes and chronic kidney disease (Stage 3) presents with generalized weakness, nausea, and muscle cramping. Lab results show: K+ 6.8 mEq/L, BUN 48 mg/dL, Creatinine 4.2 mg/dL, GFR 18 mL/min. ECG shows peaked T waves and widened QRS complex.",
    centerOptions: ["Severe hyperkalemia with ECG changes","Diabetic ketoacidosis","Hyponatremia","Acute renal failure"],
    centerCorrect: 0,
    leftFindings: ["Potassium 6.8 mEq/L","Peaked T waves on ECG","Widened QRS complex","Muscle weakness and cramping","Deep Kussmaul respirations","Serum sodium 118 mEq/L"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer IV calcium gluconate for cardiac membrane stabilization","Administer insulin with dextrose to shift potassium intracellularly","Place on continuous cardiac monitoring","Administer sodium polystyrene sulfonate (Kayexalate)","Administer potassium chloride supplement","Prepare for possible emergent hemodialysis"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Potassium of 6.8 mEq/L with ECG changes (peaked T waves, widened QRS) represents a cardiac emergency requiring immediate treatment to prevent fatal arrhythmia.",
      findings: "Severely elevated potassium, peaked T waves, widened QRS, and neuromuscular symptoms confirm symptomatic hyperkalemia. Kussmaul breathing is a DKA finding. Low sodium would indicate hyponatremia.",
      actions: "Calcium gluconate stabilizes cardiac membranes immediately (does not lower K+). Insulin/dextrose shifts K+ into cells. Continuous monitoring detects arrhythmias. Kayexalate removes K+ from the body. Hemodialysis is definitive treatment for refractory cases. Additional potassium is absolutely contraindicated."
    },
    bodySystem: "Renal/Urinary",
    tier: "rpn"
  },
  {
    id: "bt_rpn_endocrine_158_7",
    scenario: "A 30-year-old female with Type 1 diabetes is brought to the ED by her roommate. She has had nausea, vomiting, and abdominal pain for 2 days following a urinary tract infection. She appears dehydrated with dry mucous membranes. Vital signs: BP 96/58 mmHg, HR 118 bpm, RR 28/min deep (Kussmaul), Temp 38.1C. Labs: Blood glucose 486 mg/dL, pH 7.18, HCO3 10 mEq/L, Anion gap 24, Serum K+ 5.6 mEq/L.",
    centerOptions: ["Diabetic ketoacidosis","Hyperosmolar hyperglycemic state","Lactic acidosis","Uremic acidosis"],
    centerCorrect: 0,
    leftFindings: ["Blood glucose 486 mg/dL with metabolic acidosis","Kussmaul respirations (deep and rapid)","Elevated anion gap of 24","Type 1 diabetes with intercurrent infection","Serum osmolality greater than 320 mOsm/kg","Gradual onset over 1-2 weeks"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Initiate aggressive IV normal saline resuscitation","Begin continuous IV regular insulin infusion","Monitor serum potassium every 1-2 hours","Administer IV potassium when K+ falls below 5.3 mEq/L","Administer subcutaneous long-acting insulin immediately","Monitor blood glucose hourly"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Type 1 diabetes, severe hyperglycemia, metabolic acidosis (pH 7.18, low HCO3), elevated anion gap, and Kussmaul respirations confirm DKA triggered by infection.",
      findings: "High glucose with acidosis, Kussmaul breathing (compensatory CO2 elimination), high anion gap (ketoacids), and Type 1 DM with infection trigger are diagnostic. Osmolality greater than 320 and gradual onset are HHS features.",
      actions: "IV NS corrects severe dehydration. Continuous insulin infusion corrects hyperglycemia and halts ketogenesis. K+ monitoring is critical as insulin drives K+ intracellularly. Replace K+ when it drops below 5.3 to prevent hypokalemia. Hourly glucose monitoring guides insulin titration. SubQ long-acting insulin during acute DKA is inappropriate."
    },
    bodySystem: "Endocrine",
    tier: "rpn"
  },
  {
    id: "bt_rpn_endocrine_159_7",
    scenario: "A 56-year-old female is found unresponsive by coworkers at her office. She has a medical alert bracelet indicating Addison's disease. Vital signs: BP 72/48 mmHg, HR 130 bpm, RR 22/min, Temp 36.0C, Blood glucose 52 mg/dL. Skin appears hyperpigmented. Serum sodium is 126 mEq/L, potassium 6.1 mEq/L.",
    centerOptions: ["Adrenal crisis (acute adrenal insufficiency)","Septic shock","Hypoglycemic episode","Myxedema coma"],
    centerCorrect: 0,
    leftFindings: ["Profound hypotension refractory to fluids alone","Hypoglycemia (blood glucose 52 mg/dL)","Hyponatremia with hyperkalemia","Known Addison's disease","High fever with chills","Severe hypothermia with bradycardia"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer IV hydrocortisone 100 mg STAT","Initiate aggressive IV normal saline with dextrose","Administer IV dextrose 50% for hypoglycemia","Monitor hemodynamic status continuously","Hold all corticosteroids until cortisol level returns","Obtain random cortisol and ACTH levels before treatment if possible"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Unresponsiveness, severe hypotension, hypoglycemia, hyponatremia, hyperkalemia, and known Addison's disease are classic for adrenal crisis requiring emergent glucocorticoid replacement.",
      findings: "Refractory hypotension, hypoglycemia, electrolyte pattern (low Na, high K), and Addison's history confirm adrenal crisis. High fever suggests sepsis. Hypothermia with bradycardia suggests myxedema coma.",
      actions: "IV hydrocortisone is life-saving and must not be delayed. IV NS with dextrose corrects dehydration and hypoglycemia. D50 treats acute hypoglycemia. Continuous monitoring detects hemodynamic changes. Cortisol/ACTH levels should be drawn before treatment if it does not delay therapy. Withholding steroids is dangerous."
    },
    bodySystem: "Endocrine",
    tier: "rpn"
  },
  {
    id: "bt_rpn_hematology_160_7",
    scenario: "A 14-year-old African American male presents to the ED with severe bilateral leg pain, swollen hands, and fever. His mother reports he has sickle cell disease. Vital signs: BP 100/62 mmHg, HR 122 bpm, RR 24/min, Temp 39.2C, SpO2 91%. CBC shows Hgb 6.2 g/dL, WBC 18,400/mm3, reticulocyte count 12%.",
    centerOptions: ["Vaso-occlusive sickle cell crisis with fever","Osteomyelitis","Acute lymphoblastic leukemia","Juvenile rheumatoid arthritis"],
    centerCorrect: 0,
    leftFindings: ["Severe bilateral bone pain","Known sickle cell disease","Fever with leukocytosis","Hemoglobin 6.2 g/dL with elevated reticulocytes","Painless joint swelling without warmth","Pancytopenia with blast cells"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer IV opioid analgesics for pain management","Initiate aggressive IV fluid hydration","Obtain blood cultures before antibiotics","Administer supplemental oxygen for SpO2 below 95%","Apply cold compresses to painful areas","Prepare for possible blood transfusion"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "A child with known sickle cell disease presenting with bilateral bone pain, dactylitis, fever, anemia, and elevated reticulocytes indicates vaso-occlusive crisis with possible infection requiring urgent treatment.",
      findings: "Bilateral bone pain, sickle cell history, fever, anemia with reticulocytosis (hemolysis compensation) confirm crisis. Painless joint swelling suggests JRA. Pancytopenia with blasts suggests leukemia.",
      actions: "IV opioids address severe pain (do not undertreat sickle cell pain). IV fluids reduce blood viscosity and sickling. Blood cultures identify infection source. O2 maintains oxygenation to reduce sickling. Transfusion may be needed for severe anemia. Cold compresses are contraindicated as cold promotes sickling."
    },
    bodySystem: "Hematology",
    tier: "rpn"
  },
  {
    id: "bt_rpn_mentalhealth_161_7",
    scenario: "A 40-year-old male is brought to the psychiatric emergency department by police after being found on a bridge railing. He reports feeling hopeless for 3 months after losing his job and a recent divorce. He states he has a plan to use a firearm stored at his home. He admits to heavy alcohol use daily. He has no prior psychiatric history. Vital signs are stable.",
    centerOptions: ["Acute suicidal crisis with imminent risk","Major depressive episode without suicidality","Adjustment disorder with depressed mood","Alcohol use disorder only"],
    centerCorrect: 0,
    leftFindings: ["Verbalized specific plan with access to lethal means","Hopelessness lasting 3 months","Multiple recent psychosocial stressors (job loss, divorce)","Active heavy alcohol use (disinhibiting factor)","Reports passive thoughts without plan","Denies any intent to harm self"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Implement one-to-one continuous observation","Initiate safety planning and restrict access to lethal means","Obtain psychiatric consultation for inpatient admission","Screen for substance intoxication and withdrawal","Discharge with outpatient follow-up referral","Ensure therapeutic, non-judgmental communication"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Active suicidal ideation with a specific lethal plan (firearm), access to means, multiple risk factors (hopelessness, substance use, psychosocial stressors), and behavioral evidence (found on bridge) indicate imminent suicide risk.",
      findings: "Specific plan with access, hopelessness, stressors, and alcohol use as a disinhibitor are high-risk factors. Passive thoughts without plan and denial of intent would lower risk but are not present here.",
      actions: "One-to-one observation prevents self-harm. Safety planning addresses means restriction. Psychiatric consult evaluates for involuntary hold if needed. Substance screening identifies intoxication. Therapeutic communication builds rapport. Discharge is unsafe given imminent risk level."
    },
    bodySystem: "Mental Health",
    tier: "rpn"
  },
  {
    id: "bt_rpn_immuneinfectious_162_7",
    scenario: "A 79-year-old male nursing home resident presents with altered mental status, fever, and productive cough with rust-colored sputum for 2 days. He has a history of COPD and type 2 diabetes. Vital signs: BP 86/54 mmHg, HR 112 bpm, RR 28/min, Temp 39.4C, SpO2 86% on room air. WBC 22,600/mm3. Lactate 4.2 mmol/L. Chest X-ray shows right lower lobe consolidation.",
    centerOptions: ["Sepsis secondary to community-acquired pneumonia","COPD exacerbation","Acute heart failure","Aspiration pneumonitis"],
    centerCorrect: 0,
    leftFindings: ["Fever with productive rust-colored sputum","Hypotension with tachycardia (signs of septic shock)","Elevated lactate 4.2 mmol/L indicating tissue hypoperfusion","Right lower lobe consolidation on chest X-ray","Bilateral wheezing without consolidation","Frothy pink sputum with bilateral infiltrates"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Initiate IV broad-spectrum antibiotics within 1 hour","Administer 30 mL/kg IV crystalloid bolus","Obtain blood cultures before antibiotics if possible","Apply supplemental oxygen to target SpO2 above 94%","Administer IV corticosteroids as first-line treatment","Measure serial lactate levels to assess resuscitation adequacy"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Suspected infection (pneumonia), organ dysfunction (hypotension, altered mental status), and elevated lactate greater than 2 mmol/L meet Sepsis-3 criteria. This represents septic shock requiring the SEP-1 bundle.",
      findings: "Fever, productive cough, consolidation confirm pneumonia source. Hypotension and tachycardia indicate shock. Elevated lactate confirms tissue hypoperfusion. Wheezing without consolidation suggests COPD. Frothy pink sputum suggests heart failure.",
      actions: "Antibiotics within 1 hour reduce mortality in sepsis. Fluid bolus restores perfusion. Blood cultures guide targeted therapy. Oxygen corrects hypoxemia. Corticosteroids are not first-line for sepsis (reserved for refractory shock). Serial lactate measures guide resuscitation."
    },
    bodySystem: "Immune/Infectious",
    tier: "rpn"
  },
  {
    id: "bt_rpn_reproductivematernity_163_7",
    scenario: "A 36-year-old G2P1 at 34 weeks gestation presents with sudden onset of severe abdominal pain and vaginal bleeding. She reports the pain is constant and her abdomen feels rigid and board-like. She has a history of chronic hypertension. Vital signs: BP 168/108 mmHg, HR 120 bpm, RR 24/min. Fetal heart rate shows persistent late decelerations with decreased variability.",
    centerOptions: ["Placental abruption","Placenta previa","Uterine rupture","Preterm labor"],
    centerCorrect: 0,
    leftFindings: ["Sudden onset constant abdominal pain with rigidity","Dark red vaginal bleeding","Board-like rigid uterus on palpation","Chronic hypertension as risk factor","Painless bright red vaginal bleeding","Intermittent cramping with progressive cervical dilation"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Initiate continuous fetal monitoring","Establish two large-bore IV lines for fluid resuscitation","Prepare for emergent cesarean delivery","Type and crossmatch blood products","Perform digital cervical examination","Administer IV magnesium sulfate for seizure prophylaxis"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Sudden severe constant pain, board-like rigidity, dark bleeding, chronic HTN risk factor, and fetal distress (late decels, decreased variability) are classic for placental abruption.",
      findings: "Constant pain with rigidity (Couvelaire uterus), dark bleeding, and HTN history are hallmarks. Painless bright bleeding suggests previa. Intermittent cramping with dilation suggests preterm labor.",
      actions: "Continuous FHR monitoring detects fetal compromise. Large-bore IVs prepare for hemorrhage management. Emergent cesarean is indicated for fetal distress. Blood products address hemorrhagic shock. MgSO4 prevents eclamptic seizures with severe HTN. Digital exam is contraindicated until previa is ruled out."
    },
    bodySystem: "Reproductive/Maternity",
    tier: "rpn"
  },
  {
    id: "bt_rpn_pediatrics_164_7",
    scenario: "A 11-year-old male is brought to the ED with a barking cough, inspiratory stridor, and hoarse voice that started after a mild upper respiratory infection. His parents report the symptoms worsened tonight. He has mild substernal retractions. Vital signs: HR 120 bpm, RR 30/min, Temp 38.3C, SpO2 93%. He is sitting upright and appears anxious but alert.",
    centerOptions: ["Moderate croup (laryngotracheobronchitis)","Epiglottitis","Foreign body aspiration","Bacterial tracheitis"],
    centerCorrect: 0,
    leftFindings: ["Barking (seal-like) cough","Inspiratory stridor at rest","Preceded by upper respiratory infection","Hoarse voice with mild retractions","Sudden onset while eating with unilateral wheeze","Drooling with tripod positioning and high fever"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer nebulized racemic epinephrine","Administer oral or IM dexamethasone","Keep the child calm and in a position of comfort","Monitor for rebound stridor after epinephrine","Examine the throat with tongue depressor","Place on continuous pulse oximetry"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Barking cough, inspiratory stridor, hoarseness following URI, and age 6 months to 3 years are classic for viral croup (laryngotracheobronchitis), most commonly caused by parainfluenza virus.",
      findings: "Barking cough, stridor at rest, URI prodrome, and hoarseness with retractions confirm moderate croup. Sudden onset with eating suggests foreign body. Drooling, tripod, and high fever suggest epiglottitis.",
      actions: "Racemic epinephrine reduces subglottic edema. Dexamethasone reduces inflammation (single dose is standard). Keeping the child calm prevents worsening airway obstruction. Rebound monitoring detects recurrence after epinephrine. Pulse oximetry tracks oxygenation. Throat examination with a tongue depressor is contraindicated as it may worsen obstruction and is specifically avoided in suspected epiglottitis."
    },
    bodySystem: "Pediatrics",
    tier: "rpn"
  },
  {
    id: "bt_rpn_emergencytrauma_165_7",
    scenario: "A 42-year-old male arrives via EMS after a motorcycle collision at approximately 60 km/h. He is alert but confused. He has a large open wound on the right thigh with visible bone and significant hemorrhage. Vital signs: BP 82/50 mmHg, HR 138 bpm, RR 28/min, SpO2 94%. He is pale, cool, and diaphoretic. Estimated blood loss is greater than 1,500 mL.",
    centerOptions: ["Hemorrhagic shock (Class III-IV)","Neurogenic shock","Cardiogenic shock","Tension pneumothorax"],
    centerCorrect: 0,
    leftFindings: ["Tachycardia with hypotension","Pale, cool, diaphoretic skin","Open fracture with greater than 1,500 mL estimated blood loss","Altered mental status (confusion)","Warm, flushed skin with bradycardia","Distended neck veins with tracheal deviation"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Apply direct pressure and tourniquet to hemorrhaging extremity","Initiate massive transfusion protocol","Establish two large-bore IV lines with warmed fluids","Perform primary survey using ABCDE approach","Elevate the injured extremity above heart level only","Obtain type and crossmatch and administer blood products"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Tachycardia, hypotension, altered mental status, cool/pale/diaphoretic skin, and estimated blood loss greater than 1,500 mL in a trauma patient indicate Class III-IV hemorrhagic shock.",
      findings: "Tachycardia, hypotension, cool diaphoretic skin, and AMS with significant blood loss are classic hemorrhagic shock findings. Warm flushed skin with bradycardia suggests neurogenic shock. Distended neck veins with tracheal deviation suggests tension pneumothorax.",
      actions: "Direct pressure and tourniquet control active hemorrhage. Massive transfusion protocol provides balanced blood product resuscitation. Large-bore IVs enable rapid volume replacement. ABCDE primary survey ensures systematic assessment. Blood products restore oxygen-carrying capacity. Elevation alone is insufficient for active hemorrhage of this magnitude."
    },
    bodySystem: "Emergency/Trauma",
    tier: "rpn"
  },
  {
    id: "bt_rpn_musculoskeletal_166_7",
    scenario: "A 27-year-old male presents 6 hours after a tibial fracture reduction and casting. He reports increasing severe pain in his lower leg that is not relieved by prescribed opioids. Pain worsens with passive dorsiflexion of the toes. His leg feels tight and tense. Capillary refill is 4 seconds. He reports tingling and numbness in his toes.",
    centerOptions: ["Compartment syndrome","Deep vein thrombosis","Fat embolism syndrome","Cellulitis"],
    centerCorrect: 0,
    leftFindings: ["Pain out of proportion to injury not relieved by analgesics","Pain with passive stretch (dorsiflexion)","Paresthesia (tingling and numbness)","Tense and swollen compartment","Warmth and erythema along the vein","Petechial rash with confusion"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Notify surgeon immediately for possible fasciotomy","Remove or bivalve the cast immediately","Elevate the limb to heart level only (not above)","Monitor neurovascular status every 15-30 minutes","Apply compression bandage to reduce swelling","Measure compartment pressures if available"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "The 5 Ps of compartment syndrome: Pain out of proportion, Pain with passive stretch, Paresthesia, Pressure (tense compartment), and delayed capillary refill indicate a surgical emergency.",
      findings: "Disproportionate pain, pain with passive stretch, paresthesia, and tense compartment are classic. Warmth along a vein suggests DVT. Petechial rash with confusion suggests fat embolism.",
      actions: "Surgical fasciotomy is definitive treatment. Cast removal releases external pressure. Elevate to heart level (not above, which could worsen ischemia). Frequent neurovascular checks track progression. Compartment pressure measurement confirms diagnosis. Compression is contraindicated as it increases compartment pressure."
    },
    bodySystem: "Musculoskeletal",
    tier: "rpn"
  },
  {
    id: "bt_rpn_integumentary_167_7",
    scenario: "A 53-year-old male is admitted to the burn unit after a house fire with estimated 35% TBSA second and third degree burns to his chest, bilateral arms, and face. He was in an enclosed space with smoke exposure. His voice is hoarse and he has singed nasal hairs. Vital signs: BP 102/64 mmHg, HR 124 bpm, RR 26/min, SpO2 92%. He weighs 80 kg.",
    centerOptions: ["Major thermal burn with inhalation injury","Superficial burn requiring outpatient care","Chemical burn exposure","Electrical burn injury"],
    centerCorrect: 0,
    leftFindings: ["35% TBSA second and third degree burns","Hoarse voice with singed nasal hairs (inhalation injury signs)","Enclosed space fire exposure","Facial burns present","Burns limited to extremities only","Entry and exit wounds visible"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Initiate Parkland formula fluid resuscitation (4 mL x kg x %TBSA)","Prepare for early intubation due to inhalation injury signs","Obtain carboxyhemoglobin level","Monitor urine output target 0.5-1 mL/kg/hr","Apply ice directly to burn wounds","Administer tetanus prophylaxis if not current"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Greater than 20% TBSA burns with facial involvement, hoarse voice, singed nasal hairs, and enclosed space exposure indicate major burns with high suspicion for inhalation injury.",
      findings: "35% TBSA, hoarseness, singed nasal hairs, enclosed space, and facial burns are classic for inhalation injury. Burns limited to extremities without airway signs lower risk. Entry/exit wounds suggest electrical injury.",
      actions: "Parkland formula guides crystalloid resuscitation (half in first 8 hours). Early intubation protects airway before edema progresses. Carboxyhemoglobin detects CO poisoning. Urine output guides fluid adequacy. Tetanus prophylaxis prevents infection. Ice is contraindicated as it causes vasoconstriction and worsens tissue damage."
    },
    bodySystem: "Integumentary",
    tier: "rpn"
  },
  {
    id: "bt_rpn_cardiovascular_168_8",
    scenario: "A 66-year-old male with a history of hypertension presents to the emergency department with crushing substernal chest pain radiating to the left arm and jaw. He is diaphoretic and nauseated. Vital signs: BP 158/94 mmHg, HR 102 bpm, RR 22/min, SpO2 94% on room air. ECG shows ST-segment elevation in leads II, III, and aVF.",
    centerOptions: ["Inferior ST-elevation myocardial infarction","Unstable angina","Aortic dissection","Pulmonary embolism"],
    centerCorrect: 0,
    leftFindings: ["ST-elevation in leads II, III, aVF","Crushing substernal chest pain radiating to left arm","Diaphoresis and nausea","Elevated troponin levels expected","Normal chest X-ray findings","Bilateral equal blood pressures"],
    leftCorrect: [0,1,2],
    leftSelectCount: 3,
    rightActions: ["Administer aspirin 325 mg chewed immediately","Activate cardiac catheterization lab","Administer morphine for pain if not hypotensive","Administer thrombolytics without ECG confirmation","Obtain serial troponin levels","Discharge with follow-up appointment"],
    rightCorrect: [0,1,4],
    rightSelectCount: 3,
    rationale: {
      condition: "ST-elevation in inferior leads (II, III, aVF) with classic symptoms of crushing chest pain, diaphoresis, and nausea indicates an inferior STEMI requiring emergent intervention.",
      findings: "ST-elevation in inferior leads, crushing substernal pain radiating to the arm, and diaphoresis are hallmark findings of acute MI. Normal chest X-ray and bilateral equal BPs help rule out aortic dissection.",
      actions: "Aspirin inhibits platelet aggregation and is first-line. Cardiac catheterization lab activation enables primary PCI. Serial troponins confirm myocardial injury. Thrombolytics without ECG confirmation is inappropriate, and discharge is unsafe."
    },
    bodySystem: "Cardiovascular",
    tier: "rpn"
  },
  {
    id: "bt_rpn_cardiovascular_169_8",
    scenario: "A 70-year-old female with a history of atrial fibrillation and heart failure presents with increasing dyspnea, orthopnea, and bilateral lower extremity edema over 3 days. She reports sleeping on 3 pillows. Vital signs: BP 142/88 mmHg, HR 112 bpm irregular, RR 28/min, SpO2 88% on room air. Auscultation reveals bilateral crackles and an S3 gallop. BNP is 1,240 pg/mL.",
    centerOptions: ["Acute decompensated heart failure","Community-acquired pneumonia","Chronic obstructive pulmonary disease exacerbation","Pleural effusion"],
    centerCorrect: 0,
    leftFindings: ["Bilateral crackles with S3 gallop","Orthopnea requiring 3-pillow elevation","BNP 1,240 pg/mL","Bilateral lower extremity edema","Productive cough with green sputum","Barrel chest with prolonged expiration"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer IV furosemide as ordered","Position in high Fowler's position","Apply supplemental oxygen to maintain SpO2 above 94%","Encourage increased oral fluid intake","Monitor strict intake and output","Administer IV normal saline bolus"],
    rightCorrect: [0,1,2,4],
    rightSelectCount: 4,
    rationale: {
      condition: "Bilateral crackles, S3 gallop, orthopnea, peripheral edema, and markedly elevated BNP (greater than 400 pg/mL) are classic findings of acute decompensated heart failure.",
      findings: "S3 gallop indicates volume overload. Orthopnea and elevated BNP confirm fluid status. Bilateral edema reflects right-sided congestion. Green sputum and barrel chest are distractors suggesting pneumonia and COPD respectively.",
      actions: "IV furosemide promotes diuresis. High Fowler's reduces preload and improves breathing. Oxygen treats hypoxemia. Strict I&O monitors fluid balance. Increased fluids and saline bolus would worsen volume overload."
    },
    bodySystem: "Cardiovascular",
    tier: "rpn"
  },
  {
    id: "bt_rpn_cardiovascular_170_8",
    scenario: "A 53-year-old male with uncontrolled hypertension presents with sudden onset of severe tearing chest pain radiating to the back between the scapulae. He appears anxious and diaphoretic. Vital signs: Right arm BP 182/110 mmHg, Left arm BP 148/90 mmHg, HR 118 bpm, RR 24/min. Chest X-ray shows widened mediastinum.",
    centerOptions: ["Aortic dissection","Myocardial infarction","Tension pneumothorax","Esophageal rupture"],
    centerCorrect: 0,
    leftFindings: ["Tearing chest pain radiating to the back","Blood pressure differential between arms greater than 20 mmHg","Widened mediastinum on chest X-ray","History of uncontrolled hypertension","ST-elevation on ECG","Subcutaneous emphysema"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer IV beta-blocker to reduce heart rate and BP","Obtain emergent CT angiography","Prepare for possible surgical intervention","Administer thrombolytics immediately","Establish two large-bore IV lines","Administer aspirin 325 mg"],
    rightCorrect: [0,1,2,4],
    rightSelectCount: 4,
    rationale: {
      condition: "Sudden tearing chest pain radiating to the back, blood pressure differential greater than 20 mmHg between arms, and widened mediastinum are classic for aortic dissection.",
      findings: "Tearing pain to the back, BP differential, widened mediastinum, and uncontrolled HTN history are hallmark findings. ST-elevation suggests MI, and subcutaneous emphysema suggests esophageal rupture.",
      actions: "IV beta-blockers control heart rate and shear stress. CT angiography confirms diagnosis. Surgical prep is essential. Large-bore IVs allow resuscitation. Thrombolytics and aspirin are absolutely contraindicated as they would worsen hemorrhage."
    },
    bodySystem: "Cardiovascular",
    tier: "rpn"
  },
  {
    id: "bt_rpn_respiratory_171_8",
    scenario: "A 40-year-old female with a history of asthma presents to the emergency department with severe dyspnea, audible wheezing, and inability to speak in full sentences. She has used her albuterol inhaler 8 times today without relief. Vital signs: BP 138/82 mmHg, HR 124 bpm, RR 32/min, SpO2 87% on room air. Peak flow is 120 L/min (predicted 380 L/min).",
    centerOptions: ["Severe acute asthma exacerbation (status asthmaticus)","Chronic obstructive pulmonary disease exacerbation","Anaphylaxis","Spontaneous pneumothorax"],
    centerCorrect: 0,
    leftFindings: ["Inability to speak in full sentences","Peak flow less than 33% of predicted","SpO2 87% on room air","No relief from repeated albuterol use","Inspiratory stridor","Unilateral absent breath sounds"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer continuous nebulized albuterol","Administer IV corticosteroids (methylprednisolone)","Prepare for possible intubation","Administer ipratropium bromide nebulization","Discharge with oral prednisone taper","Apply high-flow supplemental oxygen"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Severe dyspnea with inability to speak in full sentences, peak flow below 33% predicted, refractory to beta-agonist therapy, and hypoxemia indicate status asthmaticus requiring aggressive treatment.",
      findings: "Inability to speak in sentences, severely reduced peak flow, hypoxemia, and albuterol resistance are hallmarks of severe exacerbation. Stridor suggests upper airway obstruction, and unilateral absent sounds suggest pneumothorax.",
      actions: "Continuous nebulized albuterol provides sustained bronchodilation. IV steroids reduce inflammation. Intubation preparation ensures airway protection. Ipratropium provides additional bronchodilation. High-flow oxygen treats hypoxemia. Discharge is inappropriate for this severity."
    },
    bodySystem: "Respiratory",
    tier: "rpn"
  },
  {
    id: "bt_rpn_respiratory_172_8",
    scenario: "A 61-year-old male, 4 days post total hip replacement, suddenly develops sharp pleuritic chest pain, dyspnea, and hemoptysis. He is tachycardic and anxious. Vital signs: BP 110/70 mmHg, HR 118 bpm, RR 28/min, SpO2 89% on room air. D-dimer is 2,400 ng/mL. CT pulmonary angiography reveals a filling defect in the right main pulmonary artery.",
    centerOptions: ["Pulmonary embolism","Hospital-acquired pneumonia","Fat embolism syndrome","Acute coronary syndrome"],
    centerCorrect: 0,
    leftFindings: ["Pleuritic chest pain with hemoptysis","Recent surgical procedure with immobility","D-dimer 2,400 ng/mL","CT showing filling defect in pulmonary artery","Petechial rash on chest and axillae","Productive cough with purulent sputum"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Initiate anticoagulation with IV heparin","Apply supplemental oxygen","Elevate the head of bed","Prepare for thrombolysis if hemodynamically unstable","Encourage early ambulation without restrictions","Monitor for signs of right ventricular failure"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Pleuritic chest pain, hemoptysis, tachycardia, and hypoxemia in a postoperative patient with elevated D-dimer and CT-confirmed filling defect confirm pulmonary embolism.",
      findings: "Pleuritic pain with hemoptysis, surgical immobility risk factor, markedly elevated D-dimer, and CT angiography findings are diagnostic. Petechial rash suggests fat embolism; purulent sputum suggests pneumonia.",
      actions: "IV heparin prevents clot propagation. Oxygen treats hypoxemia. Head elevation improves ventilation. Thrombolysis is reserved for massive PE with hemodynamic instability. Monitoring for RV failure detects deterioration. Unrestricted ambulation could dislodge further emboli."
    },
    bodySystem: "Respiratory",
    tier: "rpn"
  },
  {
    id: "bt_rpn_respiratory_173_8",
    scenario: "A 56-year-old male with a 40-pack-year smoking history presents with worsening dyspnea, increased sputum production with yellow-green color, and low-grade fever for 3 days. He uses home oxygen at 2 L/min. Vital signs: BP 136/82 mmHg, HR 98 bpm, RR 26/min, SpO2 85% on 2 L/min NC, Temp 38.2C. ABG: pH 7.31, PaCO2 58 mmHg, PaO2 52 mmHg, HCO3 28 mEq/L.",
    centerOptions: ["Acute exacerbation of COPD","Community-acquired pneumonia","Acute asthma attack","Pulmonary fibrosis"],
    centerCorrect: 0,
    leftFindings: ["40-pack-year smoking history with chronic dyspnea","Increased purulent sputum production","Compensated respiratory acidosis on ABG","Hypoxemia despite home oxygen","No wheezing or reversible obstruction","Bilateral fine inspiratory crackles only"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Increase oxygen to maintain SpO2 88-92%","Administer short-acting bronchodilator nebulization","Administer systemic corticosteroids","Start antibiotics for infectious exacerbation","Administer high-flow oxygen to achieve SpO2 100%","Monitor for CO2 narcosis and worsening respiratory acidosis"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "A COPD patient with worsening dyspnea, increased purulent sputum, fever, and compensated respiratory acidosis with chronic CO2 retention meets criteria for acute COPD exacerbation.",
      findings: "Smoking history, baseline dyspnea, purulent sputum increase, and ABG showing compensated respiratory acidosis (elevated PaCO2 with elevated HCO3) confirm chronic CO2 retention with acute worsening.",
      actions: "Target SpO2 88-92% to avoid suppressing hypoxic drive. Bronchodilators relieve airflow obstruction. Steroids reduce inflammation. Antibiotics treat infectious trigger. High-flow O2 to 100% risks CO2 narcosis. Monitoring respiratory status is essential."
    },
    bodySystem: "Respiratory",
    tier: "rpn"
  },
  {
    id: "bt_rpn_neurological_174_8",
    scenario: "A 72-year-old male is brought to the emergency department by his wife who noticed sudden onset of right-sided facial droop, right arm weakness, and slurred speech 45 minutes ago. He has a history of atrial fibrillation and takes warfarin irregularly. Vital signs: BP 178/96 mmHg, HR 88 bpm irregular, RR 18/min, SpO2 97%. NIHSS score is 14. CT head shows no hemorrhage.",
    centerOptions: ["Acute ischemic stroke","Hemorrhagic stroke","Transient ischemic attack","Bell's palsy"],
    centerCorrect: 0,
    leftFindings: ["Sudden right-sided facial droop and arm weakness","Slurred speech (dysarthria)","History of atrial fibrillation","CT head negative for hemorrhage","NIHSS score of 14","Gradual bilateral facial weakness"],
    leftCorrect: [0,1,2,3,4],
    leftSelectCount: 5,
    rightActions: ["Determine eligibility for IV alteplase (tPA) within window","Obtain STAT INR and coagulation studies","Maintain blood pressure below 185/110 mmHg if thrombolysis candidate","Administer aspirin 325 mg immediately before imaging","Perform neurological assessments every 15 minutes","Position head of bed flat if no increased ICP"],
    rightCorrect: [0,1,2,4,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Sudden onset focal neurological deficits (facial droop, arm weakness, dysarthria) with negative CT for hemorrhage and atrial fibrillation as embolic source confirms acute ischemic stroke.",
      findings: "Sudden unilateral deficits, dysarthria, A-fib history, negative CT, and elevated NIHSS are classic. Gradual bilateral weakness suggests other diagnoses like myasthenia gravis.",
      actions: "tPA eligibility assessment is time-critical (within 4.5 hours). INR is essential since the patient takes warfarin (tPA contraindicated if INR greater than 1.7). BP management enables safe thrombolysis. Frequent neuro checks detect deterioration. Flat HOB improves cerebral perfusion. Aspirin before imaging is contraindicated as hemorrhage must be ruled out first."
    },
    bodySystem: "Neurological",
    tier: "rpn"
  },
  {
    id: "bt_rpn_neurological_175_8",
    scenario: "A 26-year-old female presents with severe headache described as the worst headache of my life, sudden onset while exercising. She reports neck stiffness and photophobia. Vital signs: BP 168/94 mmHg, HR 92 bpm, RR 18/min, Temp 37.8C. Neurological exam reveals nuchal rigidity. CT head is negative.",
    centerOptions: ["Subarachnoid hemorrhage","Tension headache","Meningitis","Migraine with aura"],
    centerCorrect: 0,
    leftFindings: ["Thunderclap headache - worst headache of life","Sudden onset during physical exertion","Nuchal rigidity on examination","Photophobia","Gradual onset over several hours","Aura with visual scotoma preceding headache"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Perform lumbar puncture to assess for xanthochromia","Order CT angiography to identify aneurysm","Maintain strict bed rest with dim lighting","Administer IV nimodipine to prevent vasospasm","Discharge with analgesics if CT is negative","Initiate seizure precautions"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Thunderclap headache with sudden onset during exertion, nuchal rigidity, and photophobia are classic for subarachnoid hemorrhage even with a negative CT (sensitivity decreases after 6 hours).",
      findings: "Worst headache of life with sudden onset, exertional trigger, nuchal rigidity, and photophobia strongly suggest SAH. Gradual onset and visual aura are migraine features.",
      actions: "Lumbar puncture after negative CT detects xanthochromia (blood breakdown products). CTA identifies the bleeding source. Bed rest reduces rebleeding risk. Nimodipine prevents cerebral vasospasm. Seizure precautions prevent further injury. Discharge without LP is unsafe."
    },
    bodySystem: "Neurological",
    tier: "rpn"
  },
  {
    id: "bt_rpn_gastrointestinal_176_8",
    scenario: "A 43-year-old male with a history of alcohol use disorder presents with hematemesis of approximately 500 mL of bright red blood. He appears pale, anxious, and diaphoretic. Vital signs: BP 88/52 mmHg, HR 128 bpm, RR 24/min, SpO2 96%. Abdomen is distended with a fluid wave. He has spider angiomata on his chest and palmar erythema.",
    centerOptions: ["Esophageal variceal hemorrhage","Peptic ulcer disease bleeding","Mallory-Weiss tear","Gastric carcinoma"],
    centerCorrect: 0,
    leftFindings: ["Large-volume hematemesis with bright red blood","Signs of portal hypertension (ascites, spider angiomata)","Hemodynamic instability (hypotension, tachycardia)","History of alcohol use disorder","Epigastric pain relieved by eating","Coffee-ground emesis with melena only"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Establish two large-bore IV lines for volume resuscitation","Type and crossmatch for packed red blood cells","Administer IV octreotide to reduce portal pressure","Prepare for emergent endoscopy","Insert nasogastric tube for gastric lavage first","Administer IV proton pump inhibitor"],
    rightCorrect: [0,1,2,3],
    rightSelectCount: 4,
    rationale: {
      condition: "Large-volume hematemesis in a patient with alcohol use disorder and signs of portal hypertension (ascites, spider angiomata, palmar erythema) is consistent with esophageal variceal bleeding.",
      findings: "Bright red hematemesis, portal hypertension signs, hemodynamic instability, and alcohol history point to variceal hemorrhage. Epigastric pain relieved by eating suggests PUD. Coffee-ground emesis suggests slower upper GI bleed.",
      actions: "Large-bore IVs enable rapid resuscitation. Blood products correct hemorrhagic shock. Octreotide reduces portal venous pressure. Emergent endoscopy allows band ligation or sclerotherapy. NG tube in suspected varices is controversial and may worsen bleeding. PPI is appropriate for PUD but not primary therapy for varices."
    },
    bodySystem: "Gastrointestinal",
    tier: "rpn"
  },
  {
    id: "bt_rpn_gastrointestinal_177_8",
    scenario: "A 33-year-old female presents with acute onset right lower quadrant pain that began periumbilically 12 hours ago and migrated. She reports nausea, one episode of vomiting, and anorexia. Vital signs: BP 126/78 mmHg, HR 96 bpm, RR 18/min, Temp 38.4C. McBurney's point tenderness is positive. Rovsing sign is positive. WBC 14,200/mm3.",
    centerOptions: ["Acute appendicitis","Ectopic pregnancy","Ovarian torsion","Crohn's disease flare"],
    centerCorrect: 0,
    leftFindings: ["Pain migration from periumbilical to right lower quadrant","McBurney's point tenderness","Positive Rovsing sign","Leukocytosis with left shift","Positive pregnancy test","Chronic intermittent cramping with bloody diarrhea"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Maintain NPO status","Administer IV fluids and antibiotics","Prepare patient for surgical consultation","Obtain CT abdomen/pelvis with contrast","Administer oral laxatives for constipation","Apply heating pad to abdomen for comfort"],
    rightCorrect: [0,1,2,3],
    rightSelectCount: 4,
    rationale: {
      condition: "Classic migratory pain from periumbilical to RLQ, positive McBurney's and Rovsing signs, fever, and leukocytosis strongly suggest acute appendicitis.",
      findings: "Pain migration pattern, McBurney's tenderness, positive Rovsing sign, and elevated WBC are classic appendicitis findings. Positive pregnancy test suggests ectopic pregnancy. Chronic bloody diarrhea suggests Crohn's.",
      actions: "NPO status prepares for potential surgery. IV fluids maintain hydration and antibiotics prevent peritonitis. Surgical consult is essential. CT confirms diagnosis. Laxatives are contraindicated with possible appendicitis. Heat application may increase inflammation risk."
    },
    bodySystem: "Gastrointestinal",
    tier: "rpn"
  },
  {
    id: "bt_rpn_renalurinary_178_8",
    scenario: "A 60-year-old male with a history of type 2 diabetes and chronic kidney disease (Stage 3) presents with generalized weakness, nausea, and muscle cramping. Lab results show: K+ 6.8 mEq/L, BUN 48 mg/dL, Creatinine 4.2 mg/dL, GFR 18 mL/min. ECG shows peaked T waves and widened QRS complex.",
    centerOptions: ["Severe hyperkalemia with ECG changes","Diabetic ketoacidosis","Hyponatremia","Acute renal failure"],
    centerCorrect: 0,
    leftFindings: ["Potassium 6.8 mEq/L","Peaked T waves on ECG","Widened QRS complex","Muscle weakness and cramping","Deep Kussmaul respirations","Serum sodium 118 mEq/L"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer IV calcium gluconate for cardiac membrane stabilization","Administer insulin with dextrose to shift potassium intracellularly","Place on continuous cardiac monitoring","Administer sodium polystyrene sulfonate (Kayexalate)","Administer potassium chloride supplement","Prepare for possible emergent hemodialysis"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Potassium of 6.8 mEq/L with ECG changes (peaked T waves, widened QRS) represents a cardiac emergency requiring immediate treatment to prevent fatal arrhythmia.",
      findings: "Severely elevated potassium, peaked T waves, widened QRS, and neuromuscular symptoms confirm symptomatic hyperkalemia. Kussmaul breathing is a DKA finding. Low sodium would indicate hyponatremia.",
      actions: "Calcium gluconate stabilizes cardiac membranes immediately (does not lower K+). Insulin/dextrose shifts K+ into cells. Continuous monitoring detects arrhythmias. Kayexalate removes K+ from the body. Hemodialysis is definitive treatment for refractory cases. Additional potassium is absolutely contraindicated."
    },
    bodySystem: "Renal/Urinary",
    tier: "rpn"
  },
  {
    id: "bt_rpn_endocrine_179_8",
    scenario: "A 20-year-old female with Type 1 diabetes is brought to the ED by her roommate. She has had nausea, vomiting, and abdominal pain for 2 days following a urinary tract infection. She appears dehydrated with dry mucous membranes. Vital signs: BP 96/58 mmHg, HR 118 bpm, RR 28/min deep (Kussmaul), Temp 38.1C. Labs: Blood glucose 486 mg/dL, pH 7.18, HCO3 10 mEq/L, Anion gap 24, Serum K+ 5.6 mEq/L.",
    centerOptions: ["Diabetic ketoacidosis","Hyperosmolar hyperglycemic state","Lactic acidosis","Uremic acidosis"],
    centerCorrect: 0,
    leftFindings: ["Blood glucose 486 mg/dL with metabolic acidosis","Kussmaul respirations (deep and rapid)","Elevated anion gap of 24","Type 1 diabetes with intercurrent infection","Serum osmolality greater than 320 mOsm/kg","Gradual onset over 1-2 weeks"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Initiate aggressive IV normal saline resuscitation","Begin continuous IV regular insulin infusion","Monitor serum potassium every 1-2 hours","Administer IV potassium when K+ falls below 5.3 mEq/L","Administer subcutaneous long-acting insulin immediately","Monitor blood glucose hourly"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Type 1 diabetes, severe hyperglycemia, metabolic acidosis (pH 7.18, low HCO3), elevated anion gap, and Kussmaul respirations confirm DKA triggered by infection.",
      findings: "High glucose with acidosis, Kussmaul breathing (compensatory CO2 elimination), high anion gap (ketoacids), and Type 1 DM with infection trigger are diagnostic. Osmolality greater than 320 and gradual onset are HHS features.",
      actions: "IV NS corrects severe dehydration. Continuous insulin infusion corrects hyperglycemia and halts ketogenesis. K+ monitoring is critical as insulin drives K+ intracellularly. Replace K+ when it drops below 5.3 to prevent hypokalemia. Hourly glucose monitoring guides insulin titration. SubQ long-acting insulin during acute DKA is inappropriate."
    },
    bodySystem: "Endocrine",
    tier: "rpn"
  },
  {
    id: "bt_rpn_endocrine_180_8",
    scenario: "A 46-year-old female is found unresponsive by coworkers at her office. She has a medical alert bracelet indicating Addison's disease. Vital signs: BP 72/48 mmHg, HR 130 bpm, RR 22/min, Temp 36.0C, Blood glucose 52 mg/dL. Skin appears hyperpigmented. Serum sodium is 126 mEq/L, potassium 6.1 mEq/L.",
    centerOptions: ["Adrenal crisis (acute adrenal insufficiency)","Septic shock","Hypoglycemic episode","Myxedema coma"],
    centerCorrect: 0,
    leftFindings: ["Profound hypotension refractory to fluids alone","Hypoglycemia (blood glucose 52 mg/dL)","Hyponatremia with hyperkalemia","Known Addison's disease","High fever with chills","Severe hypothermia with bradycardia"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer IV hydrocortisone 100 mg STAT","Initiate aggressive IV normal saline with dextrose","Administer IV dextrose 50% for hypoglycemia","Monitor hemodynamic status continuously","Hold all corticosteroids until cortisol level returns","Obtain random cortisol and ACTH levels before treatment if possible"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Unresponsiveness, severe hypotension, hypoglycemia, hyponatremia, hyperkalemia, and known Addison's disease are classic for adrenal crisis requiring emergent glucocorticoid replacement.",
      findings: "Refractory hypotension, hypoglycemia, electrolyte pattern (low Na, high K), and Addison's history confirm adrenal crisis. High fever suggests sepsis. Hypothermia with bradycardia suggests myxedema coma.",
      actions: "IV hydrocortisone is life-saving and must not be delayed. IV NS with dextrose corrects dehydration and hypoglycemia. D50 treats acute hypoglycemia. Continuous monitoring detects hemodynamic changes. Cortisol/ACTH levels should be drawn before treatment if it does not delay therapy. Withholding steroids is dangerous."
    },
    bodySystem: "Endocrine",
    tier: "rpn"
  },
  {
    id: "bt_rpn_hematology_181_8",
    scenario: "A 4-year-old African American male presents to the ED with severe bilateral leg pain, swollen hands, and fever. His mother reports he has sickle cell disease. Vital signs: BP 100/62 mmHg, HR 122 bpm, RR 24/min, Temp 39.2C, SpO2 91%. CBC shows Hgb 6.2 g/dL, WBC 18,400/mm3, reticulocyte count 12%.",
    centerOptions: ["Vaso-occlusive sickle cell crisis with fever","Osteomyelitis","Acute lymphoblastic leukemia","Juvenile rheumatoid arthritis"],
    centerCorrect: 0,
    leftFindings: ["Severe bilateral bone pain","Known sickle cell disease","Fever with leukocytosis","Hemoglobin 6.2 g/dL with elevated reticulocytes","Painless joint swelling without warmth","Pancytopenia with blast cells"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer IV opioid analgesics for pain management","Initiate aggressive IV fluid hydration","Obtain blood cultures before antibiotics","Administer supplemental oxygen for SpO2 below 95%","Apply cold compresses to painful areas","Prepare for possible blood transfusion"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "A child with known sickle cell disease presenting with bilateral bone pain, dactylitis, fever, anemia, and elevated reticulocytes indicates vaso-occlusive crisis with possible infection requiring urgent treatment.",
      findings: "Bilateral bone pain, sickle cell history, fever, anemia with reticulocytosis (hemolysis compensation) confirm crisis. Painless joint swelling suggests JRA. Pancytopenia with blasts suggests leukemia.",
      actions: "IV opioids address severe pain (do not undertreat sickle cell pain). IV fluids reduce blood viscosity and sickling. Blood cultures identify infection source. O2 maintains oxygenation to reduce sickling. Transfusion may be needed for severe anemia. Cold compresses are contraindicated as cold promotes sickling."
    },
    bodySystem: "Hematology",
    tier: "rpn"
  },
  {
    id: "bt_rpn_mentalhealth_182_8",
    scenario: "A 30-year-old male is brought to the psychiatric emergency department by police after being found on a bridge railing. He reports feeling hopeless for 3 months after losing his job and a recent divorce. He states he has a plan to use a firearm stored at his home. He admits to heavy alcohol use daily. He has no prior psychiatric history. Vital signs are stable.",
    centerOptions: ["Acute suicidal crisis with imminent risk","Major depressive episode without suicidality","Adjustment disorder with depressed mood","Alcohol use disorder only"],
    centerCorrect: 0,
    leftFindings: ["Verbalized specific plan with access to lethal means","Hopelessness lasting 3 months","Multiple recent psychosocial stressors (job loss, divorce)","Active heavy alcohol use (disinhibiting factor)","Reports passive thoughts without plan","Denies any intent to harm self"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Implement one-to-one continuous observation","Initiate safety planning and restrict access to lethal means","Obtain psychiatric consultation for inpatient admission","Screen for substance intoxication and withdrawal","Discharge with outpatient follow-up referral","Ensure therapeutic, non-judgmental communication"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Active suicidal ideation with a specific lethal plan (firearm), access to means, multiple risk factors (hopelessness, substance use, psychosocial stressors), and behavioral evidence (found on bridge) indicate imminent suicide risk.",
      findings: "Specific plan with access, hopelessness, stressors, and alcohol use as a disinhibitor are high-risk factors. Passive thoughts without plan and denial of intent would lower risk but are not present here.",
      actions: "One-to-one observation prevents self-harm. Safety planning addresses means restriction. Psychiatric consult evaluates for involuntary hold if needed. Substance screening identifies intoxication. Therapeutic communication builds rapport. Discharge is unsafe given imminent risk level."
    },
    bodySystem: "Mental Health",
    tier: "rpn"
  },
  {
    id: "bt_rpn_immuneinfectious_183_8",
    scenario: "A 69-year-old male nursing home resident presents with altered mental status, fever, and productive cough with rust-colored sputum for 2 days. He has a history of COPD and type 2 diabetes. Vital signs: BP 86/54 mmHg, HR 112 bpm, RR 28/min, Temp 39.4C, SpO2 86% on room air. WBC 22,600/mm3. Lactate 4.2 mmol/L. Chest X-ray shows right lower lobe consolidation.",
    centerOptions: ["Sepsis secondary to community-acquired pneumonia","COPD exacerbation","Acute heart failure","Aspiration pneumonitis"],
    centerCorrect: 0,
    leftFindings: ["Fever with productive rust-colored sputum","Hypotension with tachycardia (signs of septic shock)","Elevated lactate 4.2 mmol/L indicating tissue hypoperfusion","Right lower lobe consolidation on chest X-ray","Bilateral wheezing without consolidation","Frothy pink sputum with bilateral infiltrates"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Initiate IV broad-spectrum antibiotics within 1 hour","Administer 30 mL/kg IV crystalloid bolus","Obtain blood cultures before antibiotics if possible","Apply supplemental oxygen to target SpO2 above 94%","Administer IV corticosteroids as first-line treatment","Measure serial lactate levels to assess resuscitation adequacy"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Suspected infection (pneumonia), organ dysfunction (hypotension, altered mental status), and elevated lactate greater than 2 mmol/L meet Sepsis-3 criteria. This represents septic shock requiring the SEP-1 bundle.",
      findings: "Fever, productive cough, consolidation confirm pneumonia source. Hypotension and tachycardia indicate shock. Elevated lactate confirms tissue hypoperfusion. Wheezing without consolidation suggests COPD. Frothy pink sputum suggests heart failure.",
      actions: "Antibiotics within 1 hour reduce mortality in sepsis. Fluid bolus restores perfusion. Blood cultures guide targeted therapy. Oxygen corrects hypoxemia. Corticosteroids are not first-line for sepsis (reserved for refractory shock). Serial lactate measures guide resuscitation."
    },
    bodySystem: "Immune/Infectious",
    tier: "rpn"
  },
  {
    id: "bt_rpn_reproductivematernity_184_8",
    scenario: "A 26-year-old G2P1 at 34 weeks gestation presents with sudden onset of severe abdominal pain and vaginal bleeding. She reports the pain is constant and her abdomen feels rigid and board-like. She has a history of chronic hypertension. Vital signs: BP 168/108 mmHg, HR 120 bpm, RR 24/min. Fetal heart rate shows persistent late decelerations with decreased variability.",
    centerOptions: ["Placental abruption","Placenta previa","Uterine rupture","Preterm labor"],
    centerCorrect: 0,
    leftFindings: ["Sudden onset constant abdominal pain with rigidity","Dark red vaginal bleeding","Board-like rigid uterus on palpation","Chronic hypertension as risk factor","Painless bright red vaginal bleeding","Intermittent cramping with progressive cervical dilation"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Initiate continuous fetal monitoring","Establish two large-bore IV lines for fluid resuscitation","Prepare for emergent cesarean delivery","Type and crossmatch blood products","Perform digital cervical examination","Administer IV magnesium sulfate for seizure prophylaxis"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Sudden severe constant pain, board-like rigidity, dark bleeding, chronic HTN risk factor, and fetal distress (late decels, decreased variability) are classic for placental abruption.",
      findings: "Constant pain with rigidity (Couvelaire uterus), dark bleeding, and HTN history are hallmarks. Painless bright bleeding suggests previa. Intermittent cramping with dilation suggests preterm labor.",
      actions: "Continuous FHR monitoring detects fetal compromise. Large-bore IVs prepare for hemorrhage management. Emergent cesarean is indicated for fetal distress. Blood products address hemorrhagic shock. MgSO4 prevents eclamptic seizures with severe HTN. Digital exam is contraindicated until previa is ruled out."
    },
    bodySystem: "Reproductive/Maternity",
    tier: "rpn"
  },
  {
    id: "bt_rpn_pediatrics_185_8",
    scenario: "A 1-year-old male is brought to the ED with a barking cough, inspiratory stridor, and hoarse voice that started after a mild upper respiratory infection. His parents report the symptoms worsened tonight. He has mild substernal retractions. Vital signs: HR 120 bpm, RR 30/min, Temp 38.3C, SpO2 93%. He is sitting upright and appears anxious but alert.",
    centerOptions: ["Moderate croup (laryngotracheobronchitis)","Epiglottitis","Foreign body aspiration","Bacterial tracheitis"],
    centerCorrect: 0,
    leftFindings: ["Barking (seal-like) cough","Inspiratory stridor at rest","Preceded by upper respiratory infection","Hoarse voice with mild retractions","Sudden onset while eating with unilateral wheeze","Drooling with tripod positioning and high fever"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer nebulized racemic epinephrine","Administer oral or IM dexamethasone","Keep the child calm and in a position of comfort","Monitor for rebound stridor after epinephrine","Examine the throat with tongue depressor","Place on continuous pulse oximetry"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Barking cough, inspiratory stridor, hoarseness following URI, and age 6 months to 3 years are classic for viral croup (laryngotracheobronchitis), most commonly caused by parainfluenza virus.",
      findings: "Barking cough, stridor at rest, URI prodrome, and hoarseness with retractions confirm moderate croup. Sudden onset with eating suggests foreign body. Drooling, tripod, and high fever suggest epiglottitis.",
      actions: "Racemic epinephrine reduces subglottic edema. Dexamethasone reduces inflammation (single dose is standard). Keeping the child calm prevents worsening airway obstruction. Rebound monitoring detects recurrence after epinephrine. Pulse oximetry tracks oxygenation. Throat examination with a tongue depressor is contraindicated as it may worsen obstruction and is specifically avoided in suspected epiglottitis."
    },
    bodySystem: "Pediatrics",
    tier: "rpn"
  },
  {
    id: "bt_rpn_emergencytrauma_186_8",
    scenario: "A 32-year-old male arrives via EMS after a motorcycle collision at approximately 60 km/h. He is alert but confused. He has a large open wound on the right thigh with visible bone and significant hemorrhage. Vital signs: BP 82/50 mmHg, HR 138 bpm, RR 28/min, SpO2 94%. He is pale, cool, and diaphoretic. Estimated blood loss is greater than 1,500 mL.",
    centerOptions: ["Hemorrhagic shock (Class III-IV)","Neurogenic shock","Cardiogenic shock","Tension pneumothorax"],
    centerCorrect: 0,
    leftFindings: ["Tachycardia with hypotension","Pale, cool, diaphoretic skin","Open fracture with greater than 1,500 mL estimated blood loss","Altered mental status (confusion)","Warm, flushed skin with bradycardia","Distended neck veins with tracheal deviation"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Apply direct pressure and tourniquet to hemorrhaging extremity","Initiate massive transfusion protocol","Establish two large-bore IV lines with warmed fluids","Perform primary survey using ABCDE approach","Elevate the injured extremity above heart level only","Obtain type and crossmatch and administer blood products"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Tachycardia, hypotension, altered mental status, cool/pale/diaphoretic skin, and estimated blood loss greater than 1,500 mL in a trauma patient indicate Class III-IV hemorrhagic shock.",
      findings: "Tachycardia, hypotension, cool diaphoretic skin, and AMS with significant blood loss are classic hemorrhagic shock findings. Warm flushed skin with bradycardia suggests neurogenic shock. Distended neck veins with tracheal deviation suggests tension pneumothorax.",
      actions: "Direct pressure and tourniquet control active hemorrhage. Massive transfusion protocol provides balanced blood product resuscitation. Large-bore IVs enable rapid volume replacement. ABCDE primary survey ensures systematic assessment. Blood products restore oxygen-carrying capacity. Elevation alone is insufficient for active hemorrhage of this magnitude."
    },
    bodySystem: "Emergency/Trauma",
    tier: "rpn"
  },
  {
    id: "bt_rpn_musculoskeletal_187_8",
    scenario: "A 17-year-old male presents 6 hours after a tibial fracture reduction and casting. He reports increasing severe pain in his lower leg that is not relieved by prescribed opioids. Pain worsens with passive dorsiflexion of the toes. His leg feels tight and tense. Capillary refill is 4 seconds. He reports tingling and numbness in his toes.",
    centerOptions: ["Compartment syndrome","Deep vein thrombosis","Fat embolism syndrome","Cellulitis"],
    centerCorrect: 0,
    leftFindings: ["Pain out of proportion to injury not relieved by analgesics","Pain with passive stretch (dorsiflexion)","Paresthesia (tingling and numbness)","Tense and swollen compartment","Warmth and erythema along the vein","Petechial rash with confusion"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Notify surgeon immediately for possible fasciotomy","Remove or bivalve the cast immediately","Elevate the limb to heart level only (not above)","Monitor neurovascular status every 15-30 minutes","Apply compression bandage to reduce swelling","Measure compartment pressures if available"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "The 5 Ps of compartment syndrome: Pain out of proportion, Pain with passive stretch, Paresthesia, Pressure (tense compartment), and delayed capillary refill indicate a surgical emergency.",
      findings: "Disproportionate pain, pain with passive stretch, paresthesia, and tense compartment are classic. Warmth along a vein suggests DVT. Petechial rash with confusion suggests fat embolism.",
      actions: "Surgical fasciotomy is definitive treatment. Cast removal releases external pressure. Elevate to heart level (not above, which could worsen ischemia). Frequent neurovascular checks track progression. Compartment pressure measurement confirms diagnosis. Compression is contraindicated as it increases compartment pressure."
    },
    bodySystem: "Musculoskeletal",
    tier: "rpn"
  },
  {
    id: "bt_rpn_integumentary_188_8",
    scenario: "A 43-year-old male is admitted to the burn unit after a house fire with estimated 35% TBSA second and third degree burns to his chest, bilateral arms, and face. He was in an enclosed space with smoke exposure. His voice is hoarse and he has singed nasal hairs. Vital signs: BP 102/64 mmHg, HR 124 bpm, RR 26/min, SpO2 92%. He weighs 80 kg.",
    centerOptions: ["Major thermal burn with inhalation injury","Superficial burn requiring outpatient care","Chemical burn exposure","Electrical burn injury"],
    centerCorrect: 0,
    leftFindings: ["35% TBSA second and third degree burns","Hoarse voice with singed nasal hairs (inhalation injury signs)","Enclosed space fire exposure","Facial burns present","Burns limited to extremities only","Entry and exit wounds visible"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Initiate Parkland formula fluid resuscitation (4 mL x kg x %TBSA)","Prepare for early intubation due to inhalation injury signs","Obtain carboxyhemoglobin level","Monitor urine output target 0.5-1 mL/kg/hr","Apply ice directly to burn wounds","Administer tetanus prophylaxis if not current"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Greater than 20% TBSA burns with facial involvement, hoarse voice, singed nasal hairs, and enclosed space exposure indicate major burns with high suspicion for inhalation injury.",
      findings: "35% TBSA, hoarseness, singed nasal hairs, enclosed space, and facial burns are classic for inhalation injury. Burns limited to extremities without airway signs lower risk. Entry/exit wounds suggest electrical injury.",
      actions: "Parkland formula guides crystalloid resuscitation (half in first 8 hours). Early intubation protects airway before edema progresses. Carboxyhemoglobin detects CO poisoning. Urine output guides fluid adequacy. Tetanus prophylaxis prevents infection. Ice is contraindicated as it causes vasoconstriction and worsens tissue damage."
    },
    bodySystem: "Integumentary",
    tier: "rpn"
  },
  {
    id: "bt_rpn_cardiovascular_189_9",
    scenario: "A 80-year-old male with a history of hypertension presents to the emergency department with crushing substernal chest pain radiating to the left arm and jaw. He is diaphoretic and nauseated. Vital signs: BP 158/94 mmHg, HR 102 bpm, RR 22/min, SpO2 94% on room air. ECG shows ST-segment elevation in leads II, III, and aVF.",
    centerOptions: ["Inferior ST-elevation myocardial infarction","Unstable angina","Aortic dissection","Pulmonary embolism"],
    centerCorrect: 0,
    leftFindings: ["ST-elevation in leads II, III, aVF","Crushing substernal chest pain radiating to left arm","Diaphoresis and nausea","Elevated troponin levels expected","Normal chest X-ray findings","Bilateral equal blood pressures"],
    leftCorrect: [0,1,2],
    leftSelectCount: 3,
    rightActions: ["Administer aspirin 325 mg chewed immediately","Activate cardiac catheterization lab","Administer morphine for pain if not hypotensive","Administer thrombolytics without ECG confirmation","Obtain serial troponin levels","Discharge with follow-up appointment"],
    rightCorrect: [0,1,4],
    rightSelectCount: 3,
    rationale: {
      condition: "ST-elevation in inferior leads (II, III, aVF) with classic symptoms of crushing chest pain, diaphoresis, and nausea indicates an inferior STEMI requiring emergent intervention.",
      findings: "ST-elevation in inferior leads, crushing substernal pain radiating to the arm, and diaphoresis are hallmark findings of acute MI. Normal chest X-ray and bilateral equal BPs help rule out aortic dissection.",
      actions: "Aspirin inhibits platelet aggregation and is first-line. Cardiac catheterization lab activation enables primary PCI. Serial troponins confirm myocardial injury. Thrombolytics without ECG confirmation is inappropriate, and discharge is unsafe."
    },
    bodySystem: "Cardiovascular",
    tier: "rpn"
  },
  {
    id: "bt_rpn_cardiovascular_190_9",
    scenario: "A 84-year-old female with a history of atrial fibrillation and heart failure presents with increasing dyspnea, orthopnea, and bilateral lower extremity edema over 3 days. She reports sleeping on 3 pillows. Vital signs: BP 142/88 mmHg, HR 112 bpm irregular, RR 28/min, SpO2 88% on room air. Auscultation reveals bilateral crackles and an S3 gallop. BNP is 1,240 pg/mL.",
    centerOptions: ["Acute decompensated heart failure","Community-acquired pneumonia","Chronic obstructive pulmonary disease exacerbation","Pleural effusion"],
    centerCorrect: 0,
    leftFindings: ["Bilateral crackles with S3 gallop","Orthopnea requiring 3-pillow elevation","BNP 1,240 pg/mL","Bilateral lower extremity edema","Productive cough with green sputum","Barrel chest with prolonged expiration"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer IV furosemide as ordered","Position in high Fowler's position","Apply supplemental oxygen to maintain SpO2 above 94%","Encourage increased oral fluid intake","Monitor strict intake and output","Administer IV normal saline bolus"],
    rightCorrect: [0,1,2,4],
    rightSelectCount: 4,
    rationale: {
      condition: "Bilateral crackles, S3 gallop, orthopnea, peripheral edema, and markedly elevated BNP (greater than 400 pg/mL) are classic findings of acute decompensated heart failure.",
      findings: "S3 gallop indicates volume overload. Orthopnea and elevated BNP confirm fluid status. Bilateral edema reflects right-sided congestion. Green sputum and barrel chest are distractors suggesting pneumonia and COPD respectively.",
      actions: "IV furosemide promotes diuresis. High Fowler's reduces preload and improves breathing. Oxygen treats hypoxemia. Strict I&O monitors fluid balance. Increased fluids and saline bolus would worsen volume overload."
    },
    bodySystem: "Cardiovascular",
    tier: "rpn"
  },
  {
    id: "bt_rpn_cardiovascular_191_9",
    scenario: "A 67-year-old male with uncontrolled hypertension presents with sudden onset of severe tearing chest pain radiating to the back between the scapulae. He appears anxious and diaphoretic. Vital signs: Right arm BP 182/110 mmHg, Left arm BP 148/90 mmHg, HR 118 bpm, RR 24/min. Chest X-ray shows widened mediastinum.",
    centerOptions: ["Aortic dissection","Myocardial infarction","Tension pneumothorax","Esophageal rupture"],
    centerCorrect: 0,
    leftFindings: ["Tearing chest pain radiating to the back","Blood pressure differential between arms greater than 20 mmHg","Widened mediastinum on chest X-ray","History of uncontrolled hypertension","ST-elevation on ECG","Subcutaneous emphysema"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer IV beta-blocker to reduce heart rate and BP","Obtain emergent CT angiography","Prepare for possible surgical intervention","Administer thrombolytics immediately","Establish two large-bore IV lines","Administer aspirin 325 mg"],
    rightCorrect: [0,1,2,4],
    rightSelectCount: 4,
    rationale: {
      condition: "Sudden tearing chest pain radiating to the back, blood pressure differential greater than 20 mmHg between arms, and widened mediastinum are classic for aortic dissection.",
      findings: "Tearing pain to the back, BP differential, widened mediastinum, and uncontrolled HTN history are hallmark findings. ST-elevation suggests MI, and subcutaneous emphysema suggests esophageal rupture.",
      actions: "IV beta-blockers control heart rate and shear stress. CT angiography confirms diagnosis. Surgical prep is essential. Large-bore IVs allow resuscitation. Thrombolytics and aspirin are absolutely contraindicated as they would worsen hemorrhage."
    },
    bodySystem: "Cardiovascular",
    tier: "rpn"
  },
  {
    id: "bt_rpn_respiratory_192_9",
    scenario: "A 54-year-old female with a history of asthma presents to the emergency department with severe dyspnea, audible wheezing, and inability to speak in full sentences. She has used her albuterol inhaler 8 times today without relief. Vital signs: BP 138/82 mmHg, HR 124 bpm, RR 32/min, SpO2 87% on room air. Peak flow is 120 L/min (predicted 380 L/min).",
    centerOptions: ["Severe acute asthma exacerbation (status asthmaticus)","Chronic obstructive pulmonary disease exacerbation","Anaphylaxis","Spontaneous pneumothorax"],
    centerCorrect: 0,
    leftFindings: ["Inability to speak in full sentences","Peak flow less than 33% of predicted","SpO2 87% on room air","No relief from repeated albuterol use","Inspiratory stridor","Unilateral absent breath sounds"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer continuous nebulized albuterol","Administer IV corticosteroids (methylprednisolone)","Prepare for possible intubation","Administer ipratropium bromide nebulization","Discharge with oral prednisone taper","Apply high-flow supplemental oxygen"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Severe dyspnea with inability to speak in full sentences, peak flow below 33% predicted, refractory to beta-agonist therapy, and hypoxemia indicate status asthmaticus requiring aggressive treatment.",
      findings: "Inability to speak in sentences, severely reduced peak flow, hypoxemia, and albuterol resistance are hallmarks of severe exacerbation. Stridor suggests upper airway obstruction, and unilateral absent sounds suggest pneumothorax.",
      actions: "Continuous nebulized albuterol provides sustained bronchodilation. IV steroids reduce inflammation. Intubation preparation ensures airway protection. Ipratropium provides additional bronchodilation. High-flow oxygen treats hypoxemia. Discharge is inappropriate for this severity."
    },
    bodySystem: "Respiratory",
    tier: "rpn"
  },
  {
    id: "bt_rpn_respiratory_193_9",
    scenario: "A 75-year-old male, 4 days post total hip replacement, suddenly develops sharp pleuritic chest pain, dyspnea, and hemoptysis. He is tachycardic and anxious. Vital signs: BP 110/70 mmHg, HR 118 bpm, RR 28/min, SpO2 89% on room air. D-dimer is 2,400 ng/mL. CT pulmonary angiography reveals a filling defect in the right main pulmonary artery.",
    centerOptions: ["Pulmonary embolism","Hospital-acquired pneumonia","Fat embolism syndrome","Acute coronary syndrome"],
    centerCorrect: 0,
    leftFindings: ["Pleuritic chest pain with hemoptysis","Recent surgical procedure with immobility","D-dimer 2,400 ng/mL","CT showing filling defect in pulmonary artery","Petechial rash on chest and axillae","Productive cough with purulent sputum"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Initiate anticoagulation with IV heparin","Apply supplemental oxygen","Elevate the head of bed","Prepare for thrombolysis if hemodynamically unstable","Encourage early ambulation without restrictions","Monitor for signs of right ventricular failure"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Pleuritic chest pain, hemoptysis, tachycardia, and hypoxemia in a postoperative patient with elevated D-dimer and CT-confirmed filling defect confirm pulmonary embolism.",
      findings: "Pleuritic pain with hemoptysis, surgical immobility risk factor, markedly elevated D-dimer, and CT angiography findings are diagnostic. Petechial rash suggests fat embolism; purulent sputum suggests pneumonia.",
      actions: "IV heparin prevents clot propagation. Oxygen treats hypoxemia. Head elevation improves ventilation. Thrombolysis is reserved for massive PE with hemodynamic instability. Monitoring for RV failure detects deterioration. Unrestricted ambulation could dislodge further emboli."
    },
    bodySystem: "Respiratory",
    tier: "rpn"
  },
  {
    id: "bt_rpn_respiratory_194_9",
    scenario: "A 70-year-old male with a 40-pack-year smoking history presents with worsening dyspnea, increased sputum production with yellow-green color, and low-grade fever for 3 days. He uses home oxygen at 2 L/min. Vital signs: BP 136/82 mmHg, HR 98 bpm, RR 26/min, SpO2 85% on 2 L/min NC, Temp 38.2C. ABG: pH 7.31, PaCO2 58 mmHg, PaO2 52 mmHg, HCO3 28 mEq/L.",
    centerOptions: ["Acute exacerbation of COPD","Community-acquired pneumonia","Acute asthma attack","Pulmonary fibrosis"],
    centerCorrect: 0,
    leftFindings: ["40-pack-year smoking history with chronic dyspnea","Increased purulent sputum production","Compensated respiratory acidosis on ABG","Hypoxemia despite home oxygen","No wheezing or reversible obstruction","Bilateral fine inspiratory crackles only"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Increase oxygen to maintain SpO2 88-92%","Administer short-acting bronchodilator nebulization","Administer systemic corticosteroids","Start antibiotics for infectious exacerbation","Administer high-flow oxygen to achieve SpO2 100%","Monitor for CO2 narcosis and worsening respiratory acidosis"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "A COPD patient with worsening dyspnea, increased purulent sputum, fever, and compensated respiratory acidosis with chronic CO2 retention meets criteria for acute COPD exacerbation.",
      findings: "Smoking history, baseline dyspnea, purulent sputum increase, and ABG showing compensated respiratory acidosis (elevated PaCO2 with elevated HCO3) confirm chronic CO2 retention with acute worsening.",
      actions: "Target SpO2 88-92% to avoid suppressing hypoxic drive. Bronchodilators relieve airflow obstruction. Steroids reduce inflammation. Antibiotics treat infectious trigger. High-flow O2 to 100% risks CO2 narcosis. Monitoring respiratory status is essential."
    },
    bodySystem: "Respiratory",
    tier: "rpn"
  },
  {
    id: "bt_rpn_neurological_195_9",
    scenario: "A 86-year-old male is brought to the emergency department by his wife who noticed sudden onset of right-sided facial droop, right arm weakness, and slurred speech 45 minutes ago. He has a history of atrial fibrillation and takes warfarin irregularly. Vital signs: BP 178/96 mmHg, HR 88 bpm irregular, RR 18/min, SpO2 97%. NIHSS score is 14. CT head shows no hemorrhage.",
    centerOptions: ["Acute ischemic stroke","Hemorrhagic stroke","Transient ischemic attack","Bell's palsy"],
    centerCorrect: 0,
    leftFindings: ["Sudden right-sided facial droop and arm weakness","Slurred speech (dysarthria)","History of atrial fibrillation","CT head negative for hemorrhage","NIHSS score of 14","Gradual bilateral facial weakness"],
    leftCorrect: [0,1,2,3,4],
    leftSelectCount: 5,
    rightActions: ["Determine eligibility for IV alteplase (tPA) within window","Obtain STAT INR and coagulation studies","Maintain blood pressure below 185/110 mmHg if thrombolysis candidate","Administer aspirin 325 mg immediately before imaging","Perform neurological assessments every 15 minutes","Position head of bed flat if no increased ICP"],
    rightCorrect: [0,1,2,4,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Sudden onset focal neurological deficits (facial droop, arm weakness, dysarthria) with negative CT for hemorrhage and atrial fibrillation as embolic source confirms acute ischemic stroke.",
      findings: "Sudden unilateral deficits, dysarthria, A-fib history, negative CT, and elevated NIHSS are classic. Gradual bilateral weakness suggests other diagnoses like myasthenia gravis.",
      actions: "tPA eligibility assessment is time-critical (within 4.5 hours). INR is essential since the patient takes warfarin (tPA contraindicated if INR greater than 1.7). BP management enables safe thrombolysis. Frequent neuro checks detect deterioration. Flat HOB improves cerebral perfusion. Aspirin before imaging is contraindicated as hemorrhage must be ruled out first."
    },
    bodySystem: "Neurological",
    tier: "rpn"
  },
  {
    id: "bt_rpn_neurological_196_9",
    scenario: "A 40-year-old female presents with severe headache described as the worst headache of my life, sudden onset while exercising. She reports neck stiffness and photophobia. Vital signs: BP 168/94 mmHg, HR 92 bpm, RR 18/min, Temp 37.8C. Neurological exam reveals nuchal rigidity. CT head is negative.",
    centerOptions: ["Subarachnoid hemorrhage","Tension headache","Meningitis","Migraine with aura"],
    centerCorrect: 0,
    leftFindings: ["Thunderclap headache - worst headache of life","Sudden onset during physical exertion","Nuchal rigidity on examination","Photophobia","Gradual onset over several hours","Aura with visual scotoma preceding headache"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Perform lumbar puncture to assess for xanthochromia","Order CT angiography to identify aneurysm","Maintain strict bed rest with dim lighting","Administer IV nimodipine to prevent vasospasm","Discharge with analgesics if CT is negative","Initiate seizure precautions"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Thunderclap headache with sudden onset during exertion, nuchal rigidity, and photophobia are classic for subarachnoid hemorrhage even with a negative CT (sensitivity decreases after 6 hours).",
      findings: "Worst headache of life with sudden onset, exertional trigger, nuchal rigidity, and photophobia strongly suggest SAH. Gradual onset and visual aura are migraine features.",
      actions: "Lumbar puncture after negative CT detects xanthochromia (blood breakdown products). CTA identifies the bleeding source. Bed rest reduces rebleeding risk. Nimodipine prevents cerebral vasospasm. Seizure precautions prevent further injury. Discharge without LP is unsafe."
    },
    bodySystem: "Neurological",
    tier: "rpn"
  },
  {
    id: "bt_rpn_gastrointestinal_197_9",
    scenario: "A 57-year-old male with a history of alcohol use disorder presents with hematemesis of approximately 500 mL of bright red blood. He appears pale, anxious, and diaphoretic. Vital signs: BP 88/52 mmHg, HR 128 bpm, RR 24/min, SpO2 96%. Abdomen is distended with a fluid wave. He has spider angiomata on his chest and palmar erythema.",
    centerOptions: ["Esophageal variceal hemorrhage","Peptic ulcer disease bleeding","Mallory-Weiss tear","Gastric carcinoma"],
    centerCorrect: 0,
    leftFindings: ["Large-volume hematemesis with bright red blood","Signs of portal hypertension (ascites, spider angiomata)","Hemodynamic instability (hypotension, tachycardia)","History of alcohol use disorder","Epigastric pain relieved by eating","Coffee-ground emesis with melena only"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Establish two large-bore IV lines for volume resuscitation","Type and crossmatch for packed red blood cells","Administer IV octreotide to reduce portal pressure","Prepare for emergent endoscopy","Insert nasogastric tube for gastric lavage first","Administer IV proton pump inhibitor"],
    rightCorrect: [0,1,2,3],
    rightSelectCount: 4,
    rationale: {
      condition: "Large-volume hematemesis in a patient with alcohol use disorder and signs of portal hypertension (ascites, spider angiomata, palmar erythema) is consistent with esophageal variceal bleeding.",
      findings: "Bright red hematemesis, portal hypertension signs, hemodynamic instability, and alcohol history point to variceal hemorrhage. Epigastric pain relieved by eating suggests PUD. Coffee-ground emesis suggests slower upper GI bleed.",
      actions: "Large-bore IVs enable rapid resuscitation. Blood products correct hemorrhagic shock. Octreotide reduces portal venous pressure. Emergent endoscopy allows band ligation or sclerotherapy. NG tube in suspected varices is controversial and may worsen bleeding. PPI is appropriate for PUD but not primary therapy for varices."
    },
    bodySystem: "Gastrointestinal",
    tier: "rpn"
  },
  {
    id: "bt_rpn_gastrointestinal_198_9",
    scenario: "A 47-year-old female presents with acute onset right lower quadrant pain that began periumbilically 12 hours ago and migrated. She reports nausea, one episode of vomiting, and anorexia. Vital signs: BP 126/78 mmHg, HR 96 bpm, RR 18/min, Temp 38.4C. McBurney's point tenderness is positive. Rovsing sign is positive. WBC 14,200/mm3.",
    centerOptions: ["Acute appendicitis","Ectopic pregnancy","Ovarian torsion","Crohn's disease flare"],
    centerCorrect: 0,
    leftFindings: ["Pain migration from periumbilical to right lower quadrant","McBurney's point tenderness","Positive Rovsing sign","Leukocytosis with left shift","Positive pregnancy test","Chronic intermittent cramping with bloody diarrhea"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Maintain NPO status","Administer IV fluids and antibiotics","Prepare patient for surgical consultation","Obtain CT abdomen/pelvis with contrast","Administer oral laxatives for constipation","Apply heating pad to abdomen for comfort"],
    rightCorrect: [0,1,2,3],
    rightSelectCount: 4,
    rationale: {
      condition: "Classic migratory pain from periumbilical to RLQ, positive McBurney's and Rovsing signs, fever, and leukocytosis strongly suggest acute appendicitis.",
      findings: "Pain migration pattern, McBurney's tenderness, positive Rovsing sign, and elevated WBC are classic appendicitis findings. Positive pregnancy test suggests ectopic pregnancy. Chronic bloody diarrhea suggests Crohn's.",
      actions: "NPO status prepares for potential surgery. IV fluids maintain hydration and antibiotics prevent peritonitis. Surgical consult is essential. CT confirms diagnosis. Laxatives are contraindicated with possible appendicitis. Heat application may increase inflammation risk."
    },
    bodySystem: "Gastrointestinal",
    tier: "rpn"
  },
  {
    id: "bt_rpn_renalurinary_199_9",
    scenario: "A 74-year-old male with a history of type 2 diabetes and chronic kidney disease (Stage 3) presents with generalized weakness, nausea, and muscle cramping. Lab results show: K+ 6.8 mEq/L, BUN 48 mg/dL, Creatinine 4.2 mg/dL, GFR 18 mL/min. ECG shows peaked T waves and widened QRS complex.",
    centerOptions: ["Severe hyperkalemia with ECG changes","Diabetic ketoacidosis","Hyponatremia","Acute renal failure"],
    centerCorrect: 0,
    leftFindings: ["Potassium 6.8 mEq/L","Peaked T waves on ECG","Widened QRS complex","Muscle weakness and cramping","Deep Kussmaul respirations","Serum sodium 118 mEq/L"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer IV calcium gluconate for cardiac membrane stabilization","Administer insulin with dextrose to shift potassium intracellularly","Place on continuous cardiac monitoring","Administer sodium polystyrene sulfonate (Kayexalate)","Administer potassium chloride supplement","Prepare for possible emergent hemodialysis"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Potassium of 6.8 mEq/L with ECG changes (peaked T waves, widened QRS) represents a cardiac emergency requiring immediate treatment to prevent fatal arrhythmia.",
      findings: "Severely elevated potassium, peaked T waves, widened QRS, and neuromuscular symptoms confirm symptomatic hyperkalemia. Kussmaul breathing is a DKA finding. Low sodium would indicate hyponatremia.",
      actions: "Calcium gluconate stabilizes cardiac membranes immediately (does not lower K+). Insulin/dextrose shifts K+ into cells. Continuous monitoring detects arrhythmias. Kayexalate removes K+ from the body. Hemodialysis is definitive treatment for refractory cases. Additional potassium is absolutely contraindicated."
    },
    bodySystem: "Renal/Urinary",
    tier: "rpn"
  },
  {
    id: "bt_rpn_endocrine_200_9",
    scenario: "A 34-year-old female with Type 1 diabetes is brought to the ED by her roommate. She has had nausea, vomiting, and abdominal pain for 2 days following a urinary tract infection. She appears dehydrated with dry mucous membranes. Vital signs: BP 96/58 mmHg, HR 118 bpm, RR 28/min deep (Kussmaul), Temp 38.1C. Labs: Blood glucose 486 mg/dL, pH 7.18, HCO3 10 mEq/L, Anion gap 24, Serum K+ 5.6 mEq/L.",
    centerOptions: ["Diabetic ketoacidosis","Hyperosmolar hyperglycemic state","Lactic acidosis","Uremic acidosis"],
    centerCorrect: 0,
    leftFindings: ["Blood glucose 486 mg/dL with metabolic acidosis","Kussmaul respirations (deep and rapid)","Elevated anion gap of 24","Type 1 diabetes with intercurrent infection","Serum osmolality greater than 320 mOsm/kg","Gradual onset over 1-2 weeks"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Initiate aggressive IV normal saline resuscitation","Begin continuous IV regular insulin infusion","Monitor serum potassium every 1-2 hours","Administer IV potassium when K+ falls below 5.3 mEq/L","Administer subcutaneous long-acting insulin immediately","Monitor blood glucose hourly"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Type 1 diabetes, severe hyperglycemia, metabolic acidosis (pH 7.18, low HCO3), elevated anion gap, and Kussmaul respirations confirm DKA triggered by infection.",
      findings: "High glucose with acidosis, Kussmaul breathing (compensatory CO2 elimination), high anion gap (ketoacids), and Type 1 DM with infection trigger are diagnostic. Osmolality greater than 320 and gradual onset are HHS features.",
      actions: "IV NS corrects severe dehydration. Continuous insulin infusion corrects hyperglycemia and halts ketogenesis. K+ monitoring is critical as insulin drives K+ intracellularly. Replace K+ when it drops below 5.3 to prevent hypokalemia. Hourly glucose monitoring guides insulin titration. SubQ long-acting insulin during acute DKA is inappropriate."
    },
    bodySystem: "Endocrine",
    tier: "rpn"
  },
  {
    id: "bt_rpn_endocrine_201_9",
    scenario: "A 60-year-old female is found unresponsive by coworkers at her office. She has a medical alert bracelet indicating Addison's disease. Vital signs: BP 72/48 mmHg, HR 130 bpm, RR 22/min, Temp 36.0C, Blood glucose 52 mg/dL. Skin appears hyperpigmented. Serum sodium is 126 mEq/L, potassium 6.1 mEq/L.",
    centerOptions: ["Adrenal crisis (acute adrenal insufficiency)","Septic shock","Hypoglycemic episode","Myxedema coma"],
    centerCorrect: 0,
    leftFindings: ["Profound hypotension refractory to fluids alone","Hypoglycemia (blood glucose 52 mg/dL)","Hyponatremia with hyperkalemia","Known Addison's disease","High fever with chills","Severe hypothermia with bradycardia"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer IV hydrocortisone 100 mg STAT","Initiate aggressive IV normal saline with dextrose","Administer IV dextrose 50% for hypoglycemia","Monitor hemodynamic status continuously","Hold all corticosteroids until cortisol level returns","Obtain random cortisol and ACTH levels before treatment if possible"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Unresponsiveness, severe hypotension, hypoglycemia, hyponatremia, hyperkalemia, and known Addison's disease are classic for adrenal crisis requiring emergent glucocorticoid replacement.",
      findings: "Refractory hypotension, hypoglycemia, electrolyte pattern (low Na, high K), and Addison's history confirm adrenal crisis. High fever suggests sepsis. Hypothermia with bradycardia suggests myxedema coma.",
      actions: "IV hydrocortisone is life-saving and must not be delayed. IV NS with dextrose corrects dehydration and hypoglycemia. D50 treats acute hypoglycemia. Continuous monitoring detects hemodynamic changes. Cortisol/ACTH levels should be drawn before treatment if it does not delay therapy. Withholding steroids is dangerous."
    },
    bodySystem: "Endocrine",
    tier: "rpn"
  },
  {
    id: "bt_rpn_hematology_202_9",
    scenario: "A 18-year-old African American male presents to the ED with severe bilateral leg pain, swollen hands, and fever. His mother reports he has sickle cell disease. Vital signs: BP 100/62 mmHg, HR 122 bpm, RR 24/min, Temp 39.2C, SpO2 91%. CBC shows Hgb 6.2 g/dL, WBC 18,400/mm3, reticulocyte count 12%.",
    centerOptions: ["Vaso-occlusive sickle cell crisis with fever","Osteomyelitis","Acute lymphoblastic leukemia","Juvenile rheumatoid arthritis"],
    centerCorrect: 0,
    leftFindings: ["Severe bilateral bone pain","Known sickle cell disease","Fever with leukocytosis","Hemoglobin 6.2 g/dL with elevated reticulocytes","Painless joint swelling without warmth","Pancytopenia with blast cells"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer IV opioid analgesics for pain management","Initiate aggressive IV fluid hydration","Obtain blood cultures before antibiotics","Administer supplemental oxygen for SpO2 below 95%","Apply cold compresses to painful areas","Prepare for possible blood transfusion"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "A child with known sickle cell disease presenting with bilateral bone pain, dactylitis, fever, anemia, and elevated reticulocytes indicates vaso-occlusive crisis with possible infection requiring urgent treatment.",
      findings: "Bilateral bone pain, sickle cell history, fever, anemia with reticulocytosis (hemolysis compensation) confirm crisis. Painless joint swelling suggests JRA. Pancytopenia with blasts suggests leukemia.",
      actions: "IV opioids address severe pain (do not undertreat sickle cell pain). IV fluids reduce blood viscosity and sickling. Blood cultures identify infection source. O2 maintains oxygenation to reduce sickling. Transfusion may be needed for severe anemia. Cold compresses are contraindicated as cold promotes sickling."
    },
    bodySystem: "Hematology",
    tier: "rpn"
  },
  {
    id: "bt_rpn_mentalhealth_203_9",
    scenario: "A 44-year-old male is brought to the psychiatric emergency department by police after being found on a bridge railing. He reports feeling hopeless for 3 months after losing his job and a recent divorce. He states he has a plan to use a firearm stored at his home. He admits to heavy alcohol use daily. He has no prior psychiatric history. Vital signs are stable.",
    centerOptions: ["Acute suicidal crisis with imminent risk","Major depressive episode without suicidality","Adjustment disorder with depressed mood","Alcohol use disorder only"],
    centerCorrect: 0,
    leftFindings: ["Verbalized specific plan with access to lethal means","Hopelessness lasting 3 months","Multiple recent psychosocial stressors (job loss, divorce)","Active heavy alcohol use (disinhibiting factor)","Reports passive thoughts without plan","Denies any intent to harm self"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Implement one-to-one continuous observation","Initiate safety planning and restrict access to lethal means","Obtain psychiatric consultation for inpatient admission","Screen for substance intoxication and withdrawal","Discharge with outpatient follow-up referral","Ensure therapeutic, non-judgmental communication"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Active suicidal ideation with a specific lethal plan (firearm), access to means, multiple risk factors (hopelessness, substance use, psychosocial stressors), and behavioral evidence (found on bridge) indicate imminent suicide risk.",
      findings: "Specific plan with access, hopelessness, stressors, and alcohol use as a disinhibitor are high-risk factors. Passive thoughts without plan and denial of intent would lower risk but are not present here.",
      actions: "One-to-one observation prevents self-harm. Safety planning addresses means restriction. Psychiatric consult evaluates for involuntary hold if needed. Substance screening identifies intoxication. Therapeutic communication builds rapport. Discharge is unsafe given imminent risk level."
    },
    bodySystem: "Mental Health",
    tier: "rpn"
  },
  {
    id: "bt_rpn_immuneinfectious_204_9",
    scenario: "A 83-year-old male nursing home resident presents with altered mental status, fever, and productive cough with rust-colored sputum for 2 days. He has a history of COPD and type 2 diabetes. Vital signs: BP 86/54 mmHg, HR 112 bpm, RR 28/min, Temp 39.4C, SpO2 86% on room air. WBC 22,600/mm3. Lactate 4.2 mmol/L. Chest X-ray shows right lower lobe consolidation.",
    centerOptions: ["Sepsis secondary to community-acquired pneumonia","COPD exacerbation","Acute heart failure","Aspiration pneumonitis"],
    centerCorrect: 0,
    leftFindings: ["Fever with productive rust-colored sputum","Hypotension with tachycardia (signs of septic shock)","Elevated lactate 4.2 mmol/L indicating tissue hypoperfusion","Right lower lobe consolidation on chest X-ray","Bilateral wheezing without consolidation","Frothy pink sputum with bilateral infiltrates"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Initiate IV broad-spectrum antibiotics within 1 hour","Administer 30 mL/kg IV crystalloid bolus","Obtain blood cultures before antibiotics if possible","Apply supplemental oxygen to target SpO2 above 94%","Administer IV corticosteroids as first-line treatment","Measure serial lactate levels to assess resuscitation adequacy"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Suspected infection (pneumonia), organ dysfunction (hypotension, altered mental status), and elevated lactate greater than 2 mmol/L meet Sepsis-3 criteria. This represents septic shock requiring the SEP-1 bundle.",
      findings: "Fever, productive cough, consolidation confirm pneumonia source. Hypotension and tachycardia indicate shock. Elevated lactate confirms tissue hypoperfusion. Wheezing without consolidation suggests COPD. Frothy pink sputum suggests heart failure.",
      actions: "Antibiotics within 1 hour reduce mortality in sepsis. Fluid bolus restores perfusion. Blood cultures guide targeted therapy. Oxygen corrects hypoxemia. Corticosteroids are not first-line for sepsis (reserved for refractory shock). Serial lactate measures guide resuscitation."
    },
    bodySystem: "Immune/Infectious",
    tier: "rpn"
  },
  {
    id: "bt_rpn_reproductivematernity_205_9",
    scenario: "A 40-year-old G2P1 at 34 weeks gestation presents with sudden onset of severe abdominal pain and vaginal bleeding. She reports the pain is constant and her abdomen feels rigid and board-like. She has a history of chronic hypertension. Vital signs: BP 168/108 mmHg, HR 120 bpm, RR 24/min. Fetal heart rate shows persistent late decelerations with decreased variability.",
    centerOptions: ["Placental abruption","Placenta previa","Uterine rupture","Preterm labor"],
    centerCorrect: 0,
    leftFindings: ["Sudden onset constant abdominal pain with rigidity","Dark red vaginal bleeding","Board-like rigid uterus on palpation","Chronic hypertension as risk factor","Painless bright red vaginal bleeding","Intermittent cramping with progressive cervical dilation"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Initiate continuous fetal monitoring","Establish two large-bore IV lines for fluid resuscitation","Prepare for emergent cesarean delivery","Type and crossmatch blood products","Perform digital cervical examination","Administer IV magnesium sulfate for seizure prophylaxis"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Sudden severe constant pain, board-like rigidity, dark bleeding, chronic HTN risk factor, and fetal distress (late decels, decreased variability) are classic for placental abruption.",
      findings: "Constant pain with rigidity (Couvelaire uterus), dark bleeding, and HTN history are hallmarks. Painless bright bleeding suggests previa. Intermittent cramping with dilation suggests preterm labor.",
      actions: "Continuous FHR monitoring detects fetal compromise. Large-bore IVs prepare for hemorrhage management. Emergent cesarean is indicated for fetal distress. Blood products address hemorrhagic shock. MgSO4 prevents eclamptic seizures with severe HTN. Digital exam is contraindicated until previa is ruled out."
    },
    bodySystem: "Reproductive/Maternity",
    tier: "rpn"
  },
  {
    id: "bt_rpn_pediatrics_206_9",
    scenario: "A 15-year-old male is brought to the ED with a barking cough, inspiratory stridor, and hoarse voice that started after a mild upper respiratory infection. His parents report the symptoms worsened tonight. He has mild substernal retractions. Vital signs: HR 120 bpm, RR 30/min, Temp 38.3C, SpO2 93%. He is sitting upright and appears anxious but alert.",
    centerOptions: ["Moderate croup (laryngotracheobronchitis)","Epiglottitis","Foreign body aspiration","Bacterial tracheitis"],
    centerCorrect: 0,
    leftFindings: ["Barking (seal-like) cough","Inspiratory stridor at rest","Preceded by upper respiratory infection","Hoarse voice with mild retractions","Sudden onset while eating with unilateral wheeze","Drooling with tripod positioning and high fever"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer nebulized racemic epinephrine","Administer oral or IM dexamethasone","Keep the child calm and in a position of comfort","Monitor for rebound stridor after epinephrine","Examine the throat with tongue depressor","Place on continuous pulse oximetry"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Barking cough, inspiratory stridor, hoarseness following URI, and age 6 months to 3 years are classic for viral croup (laryngotracheobronchitis), most commonly caused by parainfluenza virus.",
      findings: "Barking cough, stridor at rest, URI prodrome, and hoarseness with retractions confirm moderate croup. Sudden onset with eating suggests foreign body. Drooling, tripod, and high fever suggest epiglottitis.",
      actions: "Racemic epinephrine reduces subglottic edema. Dexamethasone reduces inflammation (single dose is standard). Keeping the child calm prevents worsening airway obstruction. Rebound monitoring detects recurrence after epinephrine. Pulse oximetry tracks oxygenation. Throat examination with a tongue depressor is contraindicated as it may worsen obstruction and is specifically avoided in suspected epiglottitis."
    },
    bodySystem: "Pediatrics",
    tier: "rpn"
  },
  {
    id: "bt_rpn_emergencytrauma_207_9",
    scenario: "A 46-year-old male arrives via EMS after a motorcycle collision at approximately 60 km/h. He is alert but confused. He has a large open wound on the right thigh with visible bone and significant hemorrhage. Vital signs: BP 82/50 mmHg, HR 138 bpm, RR 28/min, SpO2 94%. He is pale, cool, and diaphoretic. Estimated blood loss is greater than 1,500 mL.",
    centerOptions: ["Hemorrhagic shock (Class III-IV)","Neurogenic shock","Cardiogenic shock","Tension pneumothorax"],
    centerCorrect: 0,
    leftFindings: ["Tachycardia with hypotension","Pale, cool, diaphoretic skin","Open fracture with greater than 1,500 mL estimated blood loss","Altered mental status (confusion)","Warm, flushed skin with bradycardia","Distended neck veins with tracheal deviation"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Apply direct pressure and tourniquet to hemorrhaging extremity","Initiate massive transfusion protocol","Establish two large-bore IV lines with warmed fluids","Perform primary survey using ABCDE approach","Elevate the injured extremity above heart level only","Obtain type and crossmatch and administer blood products"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Tachycardia, hypotension, altered mental status, cool/pale/diaphoretic skin, and estimated blood loss greater than 1,500 mL in a trauma patient indicate Class III-IV hemorrhagic shock.",
      findings: "Tachycardia, hypotension, cool diaphoretic skin, and AMS with significant blood loss are classic hemorrhagic shock findings. Warm flushed skin with bradycardia suggests neurogenic shock. Distended neck veins with tracheal deviation suggests tension pneumothorax.",
      actions: "Direct pressure and tourniquet control active hemorrhage. Massive transfusion protocol provides balanced blood product resuscitation. Large-bore IVs enable rapid volume replacement. ABCDE primary survey ensures systematic assessment. Blood products restore oxygen-carrying capacity. Elevation alone is insufficient for active hemorrhage of this magnitude."
    },
    bodySystem: "Emergency/Trauma",
    tier: "rpn"
  },
  {
    id: "bt_rpn_musculoskeletal_208_9",
    scenario: "A 31-year-old male presents 6 hours after a tibial fracture reduction and casting. He reports increasing severe pain in his lower leg that is not relieved by prescribed opioids. Pain worsens with passive dorsiflexion of the toes. His leg feels tight and tense. Capillary refill is 4 seconds. He reports tingling and numbness in his toes.",
    centerOptions: ["Compartment syndrome","Deep vein thrombosis","Fat embolism syndrome","Cellulitis"],
    centerCorrect: 0,
    leftFindings: ["Pain out of proportion to injury not relieved by analgesics","Pain with passive stretch (dorsiflexion)","Paresthesia (tingling and numbness)","Tense and swollen compartment","Warmth and erythema along the vein","Petechial rash with confusion"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Notify surgeon immediately for possible fasciotomy","Remove or bivalve the cast immediately","Elevate the limb to heart level only (not above)","Monitor neurovascular status every 15-30 minutes","Apply compression bandage to reduce swelling","Measure compartment pressures if available"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "The 5 Ps of compartment syndrome: Pain out of proportion, Pain with passive stretch, Paresthesia, Pressure (tense compartment), and delayed capillary refill indicate a surgical emergency.",
      findings: "Disproportionate pain, pain with passive stretch, paresthesia, and tense compartment are classic. Warmth along a vein suggests DVT. Petechial rash with confusion suggests fat embolism.",
      actions: "Surgical fasciotomy is definitive treatment. Cast removal releases external pressure. Elevate to heart level (not above, which could worsen ischemia). Frequent neurovascular checks track progression. Compartment pressure measurement confirms diagnosis. Compression is contraindicated as it increases compartment pressure."
    },
    bodySystem: "Musculoskeletal",
    tier: "rpn"
  },
  {
    id: "bt_rpn_integumentary_209_9",
    scenario: "A 57-year-old male is admitted to the burn unit after a house fire with estimated 35% TBSA second and third degree burns to his chest, bilateral arms, and face. He was in an enclosed space with smoke exposure. His voice is hoarse and he has singed nasal hairs. Vital signs: BP 102/64 mmHg, HR 124 bpm, RR 26/min, SpO2 92%. He weighs 80 kg.",
    centerOptions: ["Major thermal burn with inhalation injury","Superficial burn requiring outpatient care","Chemical burn exposure","Electrical burn injury"],
    centerCorrect: 0,
    leftFindings: ["35% TBSA second and third degree burns","Hoarse voice with singed nasal hairs (inhalation injury signs)","Enclosed space fire exposure","Facial burns present","Burns limited to extremities only","Entry and exit wounds visible"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Initiate Parkland formula fluid resuscitation (4 mL x kg x %TBSA)","Prepare for early intubation due to inhalation injury signs","Obtain carboxyhemoglobin level","Monitor urine output target 0.5-1 mL/kg/hr","Apply ice directly to burn wounds","Administer tetanus prophylaxis if not current"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Greater than 20% TBSA burns with facial involvement, hoarse voice, singed nasal hairs, and enclosed space exposure indicate major burns with high suspicion for inhalation injury.",
      findings: "35% TBSA, hoarseness, singed nasal hairs, enclosed space, and facial burns are classic for inhalation injury. Burns limited to extremities without airway signs lower risk. Entry/exit wounds suggest electrical injury.",
      actions: "Parkland formula guides crystalloid resuscitation (half in first 8 hours). Early intubation protects airway before edema progresses. Carboxyhemoglobin detects CO poisoning. Urine output guides fluid adequacy. Tetanus prophylaxis prevents infection. Ice is contraindicated as it causes vasoconstriction and worsens tissue damage."
    },
    bodySystem: "Integumentary",
    tier: "rpn"
  },
  {
    id: "bt_rpn_cardiovascular_210_10",
    scenario: "A 71-year-old male with a history of hypertension presents to the emergency department with crushing substernal chest pain radiating to the left arm and jaw. He is diaphoretic and nauseated. Vital signs: BP 158/94 mmHg, HR 102 bpm, RR 22/min, SpO2 94% on room air. ECG shows ST-segment elevation in leads II, III, and aVF.",
    centerOptions: ["Inferior ST-elevation myocardial infarction","Unstable angina","Aortic dissection","Pulmonary embolism"],
    centerCorrect: 0,
    leftFindings: ["ST-elevation in leads II, III, aVF","Crushing substernal chest pain radiating to left arm","Diaphoresis and nausea","Elevated troponin levels expected","Normal chest X-ray findings","Bilateral equal blood pressures"],
    leftCorrect: [0,1,2],
    leftSelectCount: 3,
    rightActions: ["Administer aspirin 325 mg chewed immediately","Activate cardiac catheterization lab","Administer morphine for pain if not hypotensive","Administer thrombolytics without ECG confirmation","Obtain serial troponin levels","Discharge with follow-up appointment"],
    rightCorrect: [0,1,4],
    rightSelectCount: 3,
    rationale: {
      condition: "ST-elevation in inferior leads (II, III, aVF) with classic symptoms of crushing chest pain, diaphoresis, and nausea indicates an inferior STEMI requiring emergent intervention.",
      findings: "ST-elevation in inferior leads, crushing substernal pain radiating to the arm, and diaphoresis are hallmark findings of acute MI. Normal chest X-ray and bilateral equal BPs help rule out aortic dissection.",
      actions: "Aspirin inhibits platelet aggregation and is first-line. Cardiac catheterization lab activation enables primary PCI. Serial troponins confirm myocardial injury. Thrombolytics without ECG confirmation is inappropriate, and discharge is unsafe."
    },
    bodySystem: "Cardiovascular",
    tier: "rpn"
  },
  {
    id: "bt_rpn_cardiovascular_211_10",
    scenario: "A 75-year-old female with a history of atrial fibrillation and heart failure presents with increasing dyspnea, orthopnea, and bilateral lower extremity edema over 3 days. She reports sleeping on 3 pillows. Vital signs: BP 142/88 mmHg, HR 112 bpm irregular, RR 28/min, SpO2 88% on room air. Auscultation reveals bilateral crackles and an S3 gallop. BNP is 1,240 pg/mL.",
    centerOptions: ["Acute decompensated heart failure","Community-acquired pneumonia","Chronic obstructive pulmonary disease exacerbation","Pleural effusion"],
    centerCorrect: 0,
    leftFindings: ["Bilateral crackles with S3 gallop","Orthopnea requiring 3-pillow elevation","BNP 1,240 pg/mL","Bilateral lower extremity edema","Productive cough with green sputum","Barrel chest with prolonged expiration"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer IV furosemide as ordered","Position in high Fowler's position","Apply supplemental oxygen to maintain SpO2 above 94%","Encourage increased oral fluid intake","Monitor strict intake and output","Administer IV normal saline bolus"],
    rightCorrect: [0,1,2,4],
    rightSelectCount: 4,
    rationale: {
      condition: "Bilateral crackles, S3 gallop, orthopnea, peripheral edema, and markedly elevated BNP (greater than 400 pg/mL) are classic findings of acute decompensated heart failure.",
      findings: "S3 gallop indicates volume overload. Orthopnea and elevated BNP confirm fluid status. Bilateral edema reflects right-sided congestion. Green sputum and barrel chest are distractors suggesting pneumonia and COPD respectively.",
      actions: "IV furosemide promotes diuresis. High Fowler's reduces preload and improves breathing. Oxygen treats hypoxemia. Strict I&O monitors fluid balance. Increased fluids and saline bolus would worsen volume overload."
    },
    bodySystem: "Cardiovascular",
    tier: "rpn"
  },
  {
    id: "bt_rpn_cardiovascular_212_10",
    scenario: "A 58-year-old male with uncontrolled hypertension presents with sudden onset of severe tearing chest pain radiating to the back between the scapulae. He appears anxious and diaphoretic. Vital signs: Right arm BP 182/110 mmHg, Left arm BP 148/90 mmHg, HR 118 bpm, RR 24/min. Chest X-ray shows widened mediastinum.",
    centerOptions: ["Aortic dissection","Myocardial infarction","Tension pneumothorax","Esophageal rupture"],
    centerCorrect: 0,
    leftFindings: ["Tearing chest pain radiating to the back","Blood pressure differential between arms greater than 20 mmHg","Widened mediastinum on chest X-ray","History of uncontrolled hypertension","ST-elevation on ECG","Subcutaneous emphysema"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer IV beta-blocker to reduce heart rate and BP","Obtain emergent CT angiography","Prepare for possible surgical intervention","Administer thrombolytics immediately","Establish two large-bore IV lines","Administer aspirin 325 mg"],
    rightCorrect: [0,1,2,4],
    rightSelectCount: 4,
    rationale: {
      condition: "Sudden tearing chest pain radiating to the back, blood pressure differential greater than 20 mmHg between arms, and widened mediastinum are classic for aortic dissection.",
      findings: "Tearing pain to the back, BP differential, widened mediastinum, and uncontrolled HTN history are hallmark findings. ST-elevation suggests MI, and subcutaneous emphysema suggests esophageal rupture.",
      actions: "IV beta-blockers control heart rate and shear stress. CT angiography confirms diagnosis. Surgical prep is essential. Large-bore IVs allow resuscitation. Thrombolytics and aspirin are absolutely contraindicated as they would worsen hemorrhage."
    },
    bodySystem: "Cardiovascular",
    tier: "rpn"
  },
  {
    id: "bt_rpn_respiratory_213_10",
    scenario: "A 45-year-old female with a history of asthma presents to the emergency department with severe dyspnea, audible wheezing, and inability to speak in full sentences. She has used her albuterol inhaler 8 times today without relief. Vital signs: BP 138/82 mmHg, HR 124 bpm, RR 32/min, SpO2 87% on room air. Peak flow is 120 L/min (predicted 380 L/min).",
    centerOptions: ["Severe acute asthma exacerbation (status asthmaticus)","Chronic obstructive pulmonary disease exacerbation","Anaphylaxis","Spontaneous pneumothorax"],
    centerCorrect: 0,
    leftFindings: ["Inability to speak in full sentences","Peak flow less than 33% of predicted","SpO2 87% on room air","No relief from repeated albuterol use","Inspiratory stridor","Unilateral absent breath sounds"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer continuous nebulized albuterol","Administer IV corticosteroids (methylprednisolone)","Prepare for possible intubation","Administer ipratropium bromide nebulization","Discharge with oral prednisone taper","Apply high-flow supplemental oxygen"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Severe dyspnea with inability to speak in full sentences, peak flow below 33% predicted, refractory to beta-agonist therapy, and hypoxemia indicate status asthmaticus requiring aggressive treatment.",
      findings: "Inability to speak in sentences, severely reduced peak flow, hypoxemia, and albuterol resistance are hallmarks of severe exacerbation. Stridor suggests upper airway obstruction, and unilateral absent sounds suggest pneumothorax.",
      actions: "Continuous nebulized albuterol provides sustained bronchodilation. IV steroids reduce inflammation. Intubation preparation ensures airway protection. Ipratropium provides additional bronchodilation. High-flow oxygen treats hypoxemia. Discharge is inappropriate for this severity."
    },
    bodySystem: "Respiratory",
    tier: "rpn"
  },
  {
    id: "bt_rpn_respiratory_214_10",
    scenario: "A 66-year-old male, 4 days post total hip replacement, suddenly develops sharp pleuritic chest pain, dyspnea, and hemoptysis. He is tachycardic and anxious. Vital signs: BP 110/70 mmHg, HR 118 bpm, RR 28/min, SpO2 89% on room air. D-dimer is 2,400 ng/mL. CT pulmonary angiography reveals a filling defect in the right main pulmonary artery.",
    centerOptions: ["Pulmonary embolism","Hospital-acquired pneumonia","Fat embolism syndrome","Acute coronary syndrome"],
    centerCorrect: 0,
    leftFindings: ["Pleuritic chest pain with hemoptysis","Recent surgical procedure with immobility","D-dimer 2,400 ng/mL","CT showing filling defect in pulmonary artery","Petechial rash on chest and axillae","Productive cough with purulent sputum"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Initiate anticoagulation with IV heparin","Apply supplemental oxygen","Elevate the head of bed","Prepare for thrombolysis if hemodynamically unstable","Encourage early ambulation without restrictions","Monitor for signs of right ventricular failure"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Pleuritic chest pain, hemoptysis, tachycardia, and hypoxemia in a postoperative patient with elevated D-dimer and CT-confirmed filling defect confirm pulmonary embolism.",
      findings: "Pleuritic pain with hemoptysis, surgical immobility risk factor, markedly elevated D-dimer, and CT angiography findings are diagnostic. Petechial rash suggests fat embolism; purulent sputum suggests pneumonia.",
      actions: "IV heparin prevents clot propagation. Oxygen treats hypoxemia. Head elevation improves ventilation. Thrombolysis is reserved for massive PE with hemodynamic instability. Monitoring for RV failure detects deterioration. Unrestricted ambulation could dislodge further emboli."
    },
    bodySystem: "Respiratory",
    tier: "rpn"
  },
  {
    id: "bt_rpn_respiratory_215_10",
    scenario: "A 61-year-old male with a 40-pack-year smoking history presents with worsening dyspnea, increased sputum production with yellow-green color, and low-grade fever for 3 days. He uses home oxygen at 2 L/min. Vital signs: BP 136/82 mmHg, HR 98 bpm, RR 26/min, SpO2 85% on 2 L/min NC, Temp 38.2C. ABG: pH 7.31, PaCO2 58 mmHg, PaO2 52 mmHg, HCO3 28 mEq/L.",
    centerOptions: ["Acute exacerbation of COPD","Community-acquired pneumonia","Acute asthma attack","Pulmonary fibrosis"],
    centerCorrect: 0,
    leftFindings: ["40-pack-year smoking history with chronic dyspnea","Increased purulent sputum production","Compensated respiratory acidosis on ABG","Hypoxemia despite home oxygen","No wheezing or reversible obstruction","Bilateral fine inspiratory crackles only"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Increase oxygen to maintain SpO2 88-92%","Administer short-acting bronchodilator nebulization","Administer systemic corticosteroids","Start antibiotics for infectious exacerbation","Administer high-flow oxygen to achieve SpO2 100%","Monitor for CO2 narcosis and worsening respiratory acidosis"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "A COPD patient with worsening dyspnea, increased purulent sputum, fever, and compensated respiratory acidosis with chronic CO2 retention meets criteria for acute COPD exacerbation.",
      findings: "Smoking history, baseline dyspnea, purulent sputum increase, and ABG showing compensated respiratory acidosis (elevated PaCO2 with elevated HCO3) confirm chronic CO2 retention with acute worsening.",
      actions: "Target SpO2 88-92% to avoid suppressing hypoxic drive. Bronchodilators relieve airflow obstruction. Steroids reduce inflammation. Antibiotics treat infectious trigger. High-flow O2 to 100% risks CO2 narcosis. Monitoring respiratory status is essential."
    },
    bodySystem: "Respiratory",
    tier: "rpn"
  },
  {
    id: "bt_rpn_neurological_216_10",
    scenario: "A 77-year-old male is brought to the emergency department by his wife who noticed sudden onset of right-sided facial droop, right arm weakness, and slurred speech 45 minutes ago. He has a history of atrial fibrillation and takes warfarin irregularly. Vital signs: BP 178/96 mmHg, HR 88 bpm irregular, RR 18/min, SpO2 97%. NIHSS score is 14. CT head shows no hemorrhage.",
    centerOptions: ["Acute ischemic stroke","Hemorrhagic stroke","Transient ischemic attack","Bell's palsy"],
    centerCorrect: 0,
    leftFindings: ["Sudden right-sided facial droop and arm weakness","Slurred speech (dysarthria)","History of atrial fibrillation","CT head negative for hemorrhage","NIHSS score of 14","Gradual bilateral facial weakness"],
    leftCorrect: [0,1,2,3,4],
    leftSelectCount: 5,
    rightActions: ["Determine eligibility for IV alteplase (tPA) within window","Obtain STAT INR and coagulation studies","Maintain blood pressure below 185/110 mmHg if thrombolysis candidate","Administer aspirin 325 mg immediately before imaging","Perform neurological assessments every 15 minutes","Position head of bed flat if no increased ICP"],
    rightCorrect: [0,1,2,4,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Sudden onset focal neurological deficits (facial droop, arm weakness, dysarthria) with negative CT for hemorrhage and atrial fibrillation as embolic source confirms acute ischemic stroke.",
      findings: "Sudden unilateral deficits, dysarthria, A-fib history, negative CT, and elevated NIHSS are classic. Gradual bilateral weakness suggests other diagnoses like myasthenia gravis.",
      actions: "tPA eligibility assessment is time-critical (within 4.5 hours). INR is essential since the patient takes warfarin (tPA contraindicated if INR greater than 1.7). BP management enables safe thrombolysis. Frequent neuro checks detect deterioration. Flat HOB improves cerebral perfusion. Aspirin before imaging is contraindicated as hemorrhage must be ruled out first."
    },
    bodySystem: "Neurological",
    tier: "rpn"
  },
  {
    id: "bt_rpn_neurological_217_10",
    scenario: "A 31-year-old female presents with severe headache described as the worst headache of my life, sudden onset while exercising. She reports neck stiffness and photophobia. Vital signs: BP 168/94 mmHg, HR 92 bpm, RR 18/min, Temp 37.8C. Neurological exam reveals nuchal rigidity. CT head is negative.",
    centerOptions: ["Subarachnoid hemorrhage","Tension headache","Meningitis","Migraine with aura"],
    centerCorrect: 0,
    leftFindings: ["Thunderclap headache - worst headache of life","Sudden onset during physical exertion","Nuchal rigidity on examination","Photophobia","Gradual onset over several hours","Aura with visual scotoma preceding headache"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Perform lumbar puncture to assess for xanthochromia","Order CT angiography to identify aneurysm","Maintain strict bed rest with dim lighting","Administer IV nimodipine to prevent vasospasm","Discharge with analgesics if CT is negative","Initiate seizure precautions"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Thunderclap headache with sudden onset during exertion, nuchal rigidity, and photophobia are classic for subarachnoid hemorrhage even with a negative CT (sensitivity decreases after 6 hours).",
      findings: "Worst headache of life with sudden onset, exertional trigger, nuchal rigidity, and photophobia strongly suggest SAH. Gradual onset and visual aura are migraine features.",
      actions: "Lumbar puncture after negative CT detects xanthochromia (blood breakdown products). CTA identifies the bleeding source. Bed rest reduces rebleeding risk. Nimodipine prevents cerebral vasospasm. Seizure precautions prevent further injury. Discharge without LP is unsafe."
    },
    bodySystem: "Neurological",
    tier: "rpn"
  },
  {
    id: "bt_rpn_gastrointestinal_218_10",
    scenario: "A 48-year-old male with a history of alcohol use disorder presents with hematemesis of approximately 500 mL of bright red blood. He appears pale, anxious, and diaphoretic. Vital signs: BP 88/52 mmHg, HR 128 bpm, RR 24/min, SpO2 96%. Abdomen is distended with a fluid wave. He has spider angiomata on his chest and palmar erythema.",
    centerOptions: ["Esophageal variceal hemorrhage","Peptic ulcer disease bleeding","Mallory-Weiss tear","Gastric carcinoma"],
    centerCorrect: 0,
    leftFindings: ["Large-volume hematemesis with bright red blood","Signs of portal hypertension (ascites, spider angiomata)","Hemodynamic instability (hypotension, tachycardia)","History of alcohol use disorder","Epigastric pain relieved by eating","Coffee-ground emesis with melena only"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Establish two large-bore IV lines for volume resuscitation","Type and crossmatch for packed red blood cells","Administer IV octreotide to reduce portal pressure","Prepare for emergent endoscopy","Insert nasogastric tube for gastric lavage first","Administer IV proton pump inhibitor"],
    rightCorrect: [0,1,2,3],
    rightSelectCount: 4,
    rationale: {
      condition: "Large-volume hematemesis in a patient with alcohol use disorder and signs of portal hypertension (ascites, spider angiomata, palmar erythema) is consistent with esophageal variceal bleeding.",
      findings: "Bright red hematemesis, portal hypertension signs, hemodynamic instability, and alcohol history point to variceal hemorrhage. Epigastric pain relieved by eating suggests PUD. Coffee-ground emesis suggests slower upper GI bleed.",
      actions: "Large-bore IVs enable rapid resuscitation. Blood products correct hemorrhagic shock. Octreotide reduces portal venous pressure. Emergent endoscopy allows band ligation or sclerotherapy. NG tube in suspected varices is controversial and may worsen bleeding. PPI is appropriate for PUD but not primary therapy for varices."
    },
    bodySystem: "Gastrointestinal",
    tier: "rpn"
  },
  {
    id: "bt_rpn_gastrointestinal_219_10",
    scenario: "A 38-year-old female presents with acute onset right lower quadrant pain that began periumbilically 12 hours ago and migrated. She reports nausea, one episode of vomiting, and anorexia. Vital signs: BP 126/78 mmHg, HR 96 bpm, RR 18/min, Temp 38.4C. McBurney's point tenderness is positive. Rovsing sign is positive. WBC 14,200/mm3.",
    centerOptions: ["Acute appendicitis","Ectopic pregnancy","Ovarian torsion","Crohn's disease flare"],
    centerCorrect: 0,
    leftFindings: ["Pain migration from periumbilical to right lower quadrant","McBurney's point tenderness","Positive Rovsing sign","Leukocytosis with left shift","Positive pregnancy test","Chronic intermittent cramping with bloody diarrhea"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Maintain NPO status","Administer IV fluids and antibiotics","Prepare patient for surgical consultation","Obtain CT abdomen/pelvis with contrast","Administer oral laxatives for constipation","Apply heating pad to abdomen for comfort"],
    rightCorrect: [0,1,2,3],
    rightSelectCount: 4,
    rationale: {
      condition: "Classic migratory pain from periumbilical to RLQ, positive McBurney's and Rovsing signs, fever, and leukocytosis strongly suggest acute appendicitis.",
      findings: "Pain migration pattern, McBurney's tenderness, positive Rovsing sign, and elevated WBC are classic appendicitis findings. Positive pregnancy test suggests ectopic pregnancy. Chronic bloody diarrhea suggests Crohn's.",
      actions: "NPO status prepares for potential surgery. IV fluids maintain hydration and antibiotics prevent peritonitis. Surgical consult is essential. CT confirms diagnosis. Laxatives are contraindicated with possible appendicitis. Heat application may increase inflammation risk."
    },
    bodySystem: "Gastrointestinal",
    tier: "rpn"
  },
  {
    id: "bt_rpn_renalurinary_220_10",
    scenario: "A 65-year-old male with a history of type 2 diabetes and chronic kidney disease (Stage 3) presents with generalized weakness, nausea, and muscle cramping. Lab results show: K+ 6.8 mEq/L, BUN 48 mg/dL, Creatinine 4.2 mg/dL, GFR 18 mL/min. ECG shows peaked T waves and widened QRS complex.",
    centerOptions: ["Severe hyperkalemia with ECG changes","Diabetic ketoacidosis","Hyponatremia","Acute renal failure"],
    centerCorrect: 0,
    leftFindings: ["Potassium 6.8 mEq/L","Peaked T waves on ECG","Widened QRS complex","Muscle weakness and cramping","Deep Kussmaul respirations","Serum sodium 118 mEq/L"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer IV calcium gluconate for cardiac membrane stabilization","Administer insulin with dextrose to shift potassium intracellularly","Place on continuous cardiac monitoring","Administer sodium polystyrene sulfonate (Kayexalate)","Administer potassium chloride supplement","Prepare for possible emergent hemodialysis"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Potassium of 6.8 mEq/L with ECG changes (peaked T waves, widened QRS) represents a cardiac emergency requiring immediate treatment to prevent fatal arrhythmia.",
      findings: "Severely elevated potassium, peaked T waves, widened QRS, and neuromuscular symptoms confirm symptomatic hyperkalemia. Kussmaul breathing is a DKA finding. Low sodium would indicate hyponatremia.",
      actions: "Calcium gluconate stabilizes cardiac membranes immediately (does not lower K+). Insulin/dextrose shifts K+ into cells. Continuous monitoring detects arrhythmias. Kayexalate removes K+ from the body. Hemodialysis is definitive treatment for refractory cases. Additional potassium is absolutely contraindicated."
    },
    bodySystem: "Renal/Urinary",
    tier: "rpn"
  },
  {
    id: "bt_rpn_endocrine_221_10",
    scenario: "A 25-year-old female with Type 1 diabetes is brought to the ED by her roommate. She has had nausea, vomiting, and abdominal pain for 2 days following a urinary tract infection. She appears dehydrated with dry mucous membranes. Vital signs: BP 96/58 mmHg, HR 118 bpm, RR 28/min deep (Kussmaul), Temp 38.1C. Labs: Blood glucose 486 mg/dL, pH 7.18, HCO3 10 mEq/L, Anion gap 24, Serum K+ 5.6 mEq/L.",
    centerOptions: ["Diabetic ketoacidosis","Hyperosmolar hyperglycemic state","Lactic acidosis","Uremic acidosis"],
    centerCorrect: 0,
    leftFindings: ["Blood glucose 486 mg/dL with metabolic acidosis","Kussmaul respirations (deep and rapid)","Elevated anion gap of 24","Type 1 diabetes with intercurrent infection","Serum osmolality greater than 320 mOsm/kg","Gradual onset over 1-2 weeks"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Initiate aggressive IV normal saline resuscitation","Begin continuous IV regular insulin infusion","Monitor serum potassium every 1-2 hours","Administer IV potassium when K+ falls below 5.3 mEq/L","Administer subcutaneous long-acting insulin immediately","Monitor blood glucose hourly"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Type 1 diabetes, severe hyperglycemia, metabolic acidosis (pH 7.18, low HCO3), elevated anion gap, and Kussmaul respirations confirm DKA triggered by infection.",
      findings: "High glucose with acidosis, Kussmaul breathing (compensatory CO2 elimination), high anion gap (ketoacids), and Type 1 DM with infection trigger are diagnostic. Osmolality greater than 320 and gradual onset are HHS features.",
      actions: "IV NS corrects severe dehydration. Continuous insulin infusion corrects hyperglycemia and halts ketogenesis. K+ monitoring is critical as insulin drives K+ intracellularly. Replace K+ when it drops below 5.3 to prevent hypokalemia. Hourly glucose monitoring guides insulin titration. SubQ long-acting insulin during acute DKA is inappropriate."
    },
    bodySystem: "Endocrine",
    tier: "rpn"
  },
  {
    id: "bt_rpn_endocrine_222_10",
    scenario: "A 51-year-old female is found unresponsive by coworkers at her office. She has a medical alert bracelet indicating Addison's disease. Vital signs: BP 72/48 mmHg, HR 130 bpm, RR 22/min, Temp 36.0C, Blood glucose 52 mg/dL. Skin appears hyperpigmented. Serum sodium is 126 mEq/L, potassium 6.1 mEq/L.",
    centerOptions: ["Adrenal crisis (acute adrenal insufficiency)","Septic shock","Hypoglycemic episode","Myxedema coma"],
    centerCorrect: 0,
    leftFindings: ["Profound hypotension refractory to fluids alone","Hypoglycemia (blood glucose 52 mg/dL)","Hyponatremia with hyperkalemia","Known Addison's disease","High fever with chills","Severe hypothermia with bradycardia"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer IV hydrocortisone 100 mg STAT","Initiate aggressive IV normal saline with dextrose","Administer IV dextrose 50% for hypoglycemia","Monitor hemodynamic status continuously","Hold all corticosteroids until cortisol level returns","Obtain random cortisol and ACTH levels before treatment if possible"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Unresponsiveness, severe hypotension, hypoglycemia, hyponatremia, hyperkalemia, and known Addison's disease are classic for adrenal crisis requiring emergent glucocorticoid replacement.",
      findings: "Refractory hypotension, hypoglycemia, electrolyte pattern (low Na, high K), and Addison's history confirm adrenal crisis. High fever suggests sepsis. Hypothermia with bradycardia suggests myxedema coma.",
      actions: "IV hydrocortisone is life-saving and must not be delayed. IV NS with dextrose corrects dehydration and hypoglycemia. D50 treats acute hypoglycemia. Continuous monitoring detects hemodynamic changes. Cortisol/ACTH levels should be drawn before treatment if it does not delay therapy. Withholding steroids is dangerous."
    },
    bodySystem: "Endocrine",
    tier: "rpn"
  },
  {
    id: "bt_rpn_hematology_223_10",
    scenario: "A 9-year-old African American male presents to the ED with severe bilateral leg pain, swollen hands, and fever. His mother reports he has sickle cell disease. Vital signs: BP 100/62 mmHg, HR 122 bpm, RR 24/min, Temp 39.2C, SpO2 91%. CBC shows Hgb 6.2 g/dL, WBC 18,400/mm3, reticulocyte count 12%.",
    centerOptions: ["Vaso-occlusive sickle cell crisis with fever","Osteomyelitis","Acute lymphoblastic leukemia","Juvenile rheumatoid arthritis"],
    centerCorrect: 0,
    leftFindings: ["Severe bilateral bone pain","Known sickle cell disease","Fever with leukocytosis","Hemoglobin 6.2 g/dL with elevated reticulocytes","Painless joint swelling without warmth","Pancytopenia with blast cells"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer IV opioid analgesics for pain management","Initiate aggressive IV fluid hydration","Obtain blood cultures before antibiotics","Administer supplemental oxygen for SpO2 below 95%","Apply cold compresses to painful areas","Prepare for possible blood transfusion"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "A child with known sickle cell disease presenting with bilateral bone pain, dactylitis, fever, anemia, and elevated reticulocytes indicates vaso-occlusive crisis with possible infection requiring urgent treatment.",
      findings: "Bilateral bone pain, sickle cell history, fever, anemia with reticulocytosis (hemolysis compensation) confirm crisis. Painless joint swelling suggests JRA. Pancytopenia with blasts suggests leukemia.",
      actions: "IV opioids address severe pain (do not undertreat sickle cell pain). IV fluids reduce blood viscosity and sickling. Blood cultures identify infection source. O2 maintains oxygenation to reduce sickling. Transfusion may be needed for severe anemia. Cold compresses are contraindicated as cold promotes sickling."
    },
    bodySystem: "Hematology",
    tier: "rpn"
  },
  {
    id: "bt_rpn_mentalhealth_224_10",
    scenario: "A 35-year-old male is brought to the psychiatric emergency department by police after being found on a bridge railing. He reports feeling hopeless for 3 months after losing his job and a recent divorce. He states he has a plan to use a firearm stored at his home. He admits to heavy alcohol use daily. He has no prior psychiatric history. Vital signs are stable.",
    centerOptions: ["Acute suicidal crisis with imminent risk","Major depressive episode without suicidality","Adjustment disorder with depressed mood","Alcohol use disorder only"],
    centerCorrect: 0,
    leftFindings: ["Verbalized specific plan with access to lethal means","Hopelessness lasting 3 months","Multiple recent psychosocial stressors (job loss, divorce)","Active heavy alcohol use (disinhibiting factor)","Reports passive thoughts without plan","Denies any intent to harm self"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Implement one-to-one continuous observation","Initiate safety planning and restrict access to lethal means","Obtain psychiatric consultation for inpatient admission","Screen for substance intoxication and withdrawal","Discharge with outpatient follow-up referral","Ensure therapeutic, non-judgmental communication"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Active suicidal ideation with a specific lethal plan (firearm), access to means, multiple risk factors (hopelessness, substance use, psychosocial stressors), and behavioral evidence (found on bridge) indicate imminent suicide risk.",
      findings: "Specific plan with access, hopelessness, stressors, and alcohol use as a disinhibitor are high-risk factors. Passive thoughts without plan and denial of intent would lower risk but are not present here.",
      actions: "One-to-one observation prevents self-harm. Safety planning addresses means restriction. Psychiatric consult evaluates for involuntary hold if needed. Substance screening identifies intoxication. Therapeutic communication builds rapport. Discharge is unsafe given imminent risk level."
    },
    bodySystem: "Mental Health",
    tier: "rpn"
  },
  {
    id: "bt_rpn_immuneinfectious_225_10",
    scenario: "A 74-year-old male nursing home resident presents with altered mental status, fever, and productive cough with rust-colored sputum for 2 days. He has a history of COPD and type 2 diabetes. Vital signs: BP 86/54 mmHg, HR 112 bpm, RR 28/min, Temp 39.4C, SpO2 86% on room air. WBC 22,600/mm3. Lactate 4.2 mmol/L. Chest X-ray shows right lower lobe consolidation.",
    centerOptions: ["Sepsis secondary to community-acquired pneumonia","COPD exacerbation","Acute heart failure","Aspiration pneumonitis"],
    centerCorrect: 0,
    leftFindings: ["Fever with productive rust-colored sputum","Hypotension with tachycardia (signs of septic shock)","Elevated lactate 4.2 mmol/L indicating tissue hypoperfusion","Right lower lobe consolidation on chest X-ray","Bilateral wheezing without consolidation","Frothy pink sputum with bilateral infiltrates"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Initiate IV broad-spectrum antibiotics within 1 hour","Administer 30 mL/kg IV crystalloid bolus","Obtain blood cultures before antibiotics if possible","Apply supplemental oxygen to target SpO2 above 94%","Administer IV corticosteroids as first-line treatment","Measure serial lactate levels to assess resuscitation adequacy"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Suspected infection (pneumonia), organ dysfunction (hypotension, altered mental status), and elevated lactate greater than 2 mmol/L meet Sepsis-3 criteria. This represents septic shock requiring the SEP-1 bundle.",
      findings: "Fever, productive cough, consolidation confirm pneumonia source. Hypotension and tachycardia indicate shock. Elevated lactate confirms tissue hypoperfusion. Wheezing without consolidation suggests COPD. Frothy pink sputum suggests heart failure.",
      actions: "Antibiotics within 1 hour reduce mortality in sepsis. Fluid bolus restores perfusion. Blood cultures guide targeted therapy. Oxygen corrects hypoxemia. Corticosteroids are not first-line for sepsis (reserved for refractory shock). Serial lactate measures guide resuscitation."
    },
    bodySystem: "Immune/Infectious",
    tier: "rpn"
  },
  {
    id: "bt_rpn_reproductivematernity_226_10",
    scenario: "A 31-year-old G2P1 at 34 weeks gestation presents with sudden onset of severe abdominal pain and vaginal bleeding. She reports the pain is constant and her abdomen feels rigid and board-like. She has a history of chronic hypertension. Vital signs: BP 168/108 mmHg, HR 120 bpm, RR 24/min. Fetal heart rate shows persistent late decelerations with decreased variability.",
    centerOptions: ["Placental abruption","Placenta previa","Uterine rupture","Preterm labor"],
    centerCorrect: 0,
    leftFindings: ["Sudden onset constant abdominal pain with rigidity","Dark red vaginal bleeding","Board-like rigid uterus on palpation","Chronic hypertension as risk factor","Painless bright red vaginal bleeding","Intermittent cramping with progressive cervical dilation"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Initiate continuous fetal monitoring","Establish two large-bore IV lines for fluid resuscitation","Prepare for emergent cesarean delivery","Type and crossmatch blood products","Perform digital cervical examination","Administer IV magnesium sulfate for seizure prophylaxis"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Sudden severe constant pain, board-like rigidity, dark bleeding, chronic HTN risk factor, and fetal distress (late decels, decreased variability) are classic for placental abruption.",
      findings: "Constant pain with rigidity (Couvelaire uterus), dark bleeding, and HTN history are hallmarks. Painless bright bleeding suggests previa. Intermittent cramping with dilation suggests preterm labor.",
      actions: "Continuous FHR monitoring detects fetal compromise. Large-bore IVs prepare for hemorrhage management. Emergent cesarean is indicated for fetal distress. Blood products address hemorrhagic shock. MgSO4 prevents eclamptic seizures with severe HTN. Digital exam is contraindicated until previa is ruled out."
    },
    bodySystem: "Reproductive/Maternity",
    tier: "rpn"
  },
  {
    id: "bt_rpn_pediatrics_227_10",
    scenario: "A 6-year-old male is brought to the ED with a barking cough, inspiratory stridor, and hoarse voice that started after a mild upper respiratory infection. His parents report the symptoms worsened tonight. He has mild substernal retractions. Vital signs: HR 120 bpm, RR 30/min, Temp 38.3C, SpO2 93%. He is sitting upright and appears anxious but alert.",
    centerOptions: ["Moderate croup (laryngotracheobronchitis)","Epiglottitis","Foreign body aspiration","Bacterial tracheitis"],
    centerCorrect: 0,
    leftFindings: ["Barking (seal-like) cough","Inspiratory stridor at rest","Preceded by upper respiratory infection","Hoarse voice with mild retractions","Sudden onset while eating with unilateral wheeze","Drooling with tripod positioning and high fever"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer nebulized racemic epinephrine","Administer oral or IM dexamethasone","Keep the child calm and in a position of comfort","Monitor for rebound stridor after epinephrine","Examine the throat with tongue depressor","Place on continuous pulse oximetry"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Barking cough, inspiratory stridor, hoarseness following URI, and age 6 months to 3 years are classic for viral croup (laryngotracheobronchitis), most commonly caused by parainfluenza virus.",
      findings: "Barking cough, stridor at rest, URI prodrome, and hoarseness with retractions confirm moderate croup. Sudden onset with eating suggests foreign body. Drooling, tripod, and high fever suggest epiglottitis.",
      actions: "Racemic epinephrine reduces subglottic edema. Dexamethasone reduces inflammation (single dose is standard). Keeping the child calm prevents worsening airway obstruction. Rebound monitoring detects recurrence after epinephrine. Pulse oximetry tracks oxygenation. Throat examination with a tongue depressor is contraindicated as it may worsen obstruction and is specifically avoided in suspected epiglottitis."
    },
    bodySystem: "Pediatrics",
    tier: "rpn"
  },
  {
    id: "bt_rpn_emergencytrauma_228_10",
    scenario: "A 37-year-old male arrives via EMS after a motorcycle collision at approximately 60 km/h. He is alert but confused. He has a large open wound on the right thigh with visible bone and significant hemorrhage. Vital signs: BP 82/50 mmHg, HR 138 bpm, RR 28/min, SpO2 94%. He is pale, cool, and diaphoretic. Estimated blood loss is greater than 1,500 mL.",
    centerOptions: ["Hemorrhagic shock (Class III-IV)","Neurogenic shock","Cardiogenic shock","Tension pneumothorax"],
    centerCorrect: 0,
    leftFindings: ["Tachycardia with hypotension","Pale, cool, diaphoretic skin","Open fracture with greater than 1,500 mL estimated blood loss","Altered mental status (confusion)","Warm, flushed skin with bradycardia","Distended neck veins with tracheal deviation"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Apply direct pressure and tourniquet to hemorrhaging extremity","Initiate massive transfusion protocol","Establish two large-bore IV lines with warmed fluids","Perform primary survey using ABCDE approach","Elevate the injured extremity above heart level only","Obtain type and crossmatch and administer blood products"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Tachycardia, hypotension, altered mental status, cool/pale/diaphoretic skin, and estimated blood loss greater than 1,500 mL in a trauma patient indicate Class III-IV hemorrhagic shock.",
      findings: "Tachycardia, hypotension, cool diaphoretic skin, and AMS with significant blood loss are classic hemorrhagic shock findings. Warm flushed skin with bradycardia suggests neurogenic shock. Distended neck veins with tracheal deviation suggests tension pneumothorax.",
      actions: "Direct pressure and tourniquet control active hemorrhage. Massive transfusion protocol provides balanced blood product resuscitation. Large-bore IVs enable rapid volume replacement. ABCDE primary survey ensures systematic assessment. Blood products restore oxygen-carrying capacity. Elevation alone is insufficient for active hemorrhage of this magnitude."
    },
    bodySystem: "Emergency/Trauma",
    tier: "rpn"
  },
  {
    id: "bt_rpn_musculoskeletal_229_10",
    scenario: "A 22-year-old male presents 6 hours after a tibial fracture reduction and casting. He reports increasing severe pain in his lower leg that is not relieved by prescribed opioids. Pain worsens with passive dorsiflexion of the toes. His leg feels tight and tense. Capillary refill is 4 seconds. He reports tingling and numbness in his toes.",
    centerOptions: ["Compartment syndrome","Deep vein thrombosis","Fat embolism syndrome","Cellulitis"],
    centerCorrect: 0,
    leftFindings: ["Pain out of proportion to injury not relieved by analgesics","Pain with passive stretch (dorsiflexion)","Paresthesia (tingling and numbness)","Tense and swollen compartment","Warmth and erythema along the vein","Petechial rash with confusion"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Notify surgeon immediately for possible fasciotomy","Remove or bivalve the cast immediately","Elevate the limb to heart level only (not above)","Monitor neurovascular status every 15-30 minutes","Apply compression bandage to reduce swelling","Measure compartment pressures if available"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "The 5 Ps of compartment syndrome: Pain out of proportion, Pain with passive stretch, Paresthesia, Pressure (tense compartment), and delayed capillary refill indicate a surgical emergency.",
      findings: "Disproportionate pain, pain with passive stretch, paresthesia, and tense compartment are classic. Warmth along a vein suggests DVT. Petechial rash with confusion suggests fat embolism.",
      actions: "Surgical fasciotomy is definitive treatment. Cast removal releases external pressure. Elevate to heart level (not above, which could worsen ischemia). Frequent neurovascular checks track progression. Compartment pressure measurement confirms diagnosis. Compression is contraindicated as it increases compartment pressure."
    },
    bodySystem: "Musculoskeletal",
    tier: "rpn"
  },
  {
    id: "bt_rpn_integumentary_230_10",
    scenario: "A 48-year-old male is admitted to the burn unit after a house fire with estimated 35% TBSA second and third degree burns to his chest, bilateral arms, and face. He was in an enclosed space with smoke exposure. His voice is hoarse and he has singed nasal hairs. Vital signs: BP 102/64 mmHg, HR 124 bpm, RR 26/min, SpO2 92%. He weighs 80 kg.",
    centerOptions: ["Major thermal burn with inhalation injury","Superficial burn requiring outpatient care","Chemical burn exposure","Electrical burn injury"],
    centerCorrect: 0,
    leftFindings: ["35% TBSA second and third degree burns","Hoarse voice with singed nasal hairs (inhalation injury signs)","Enclosed space fire exposure","Facial burns present","Burns limited to extremities only","Entry and exit wounds visible"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Initiate Parkland formula fluid resuscitation (4 mL x kg x %TBSA)","Prepare for early intubation due to inhalation injury signs","Obtain carboxyhemoglobin level","Monitor urine output target 0.5-1 mL/kg/hr","Apply ice directly to burn wounds","Administer tetanus prophylaxis if not current"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Greater than 20% TBSA burns with facial involvement, hoarse voice, singed nasal hairs, and enclosed space exposure indicate major burns with high suspicion for inhalation injury.",
      findings: "35% TBSA, hoarseness, singed nasal hairs, enclosed space, and facial burns are classic for inhalation injury. Burns limited to extremities without airway signs lower risk. Entry/exit wounds suggest electrical injury.",
      actions: "Parkland formula guides crystalloid resuscitation (half in first 8 hours). Early intubation protects airway before edema progresses. Carboxyhemoglobin detects CO poisoning. Urine output guides fluid adequacy. Tetanus prophylaxis prevents infection. Ice is contraindicated as it causes vasoconstriction and worsens tissue damage."
    },
    bodySystem: "Integumentary",
    tier: "rpn"
  },
  {
    id: "bt_rpn_cardiovascular_231_11",
    scenario: "A 63-year-old male with a history of hypertension presents to the emergency department with crushing substernal chest pain radiating to the left arm and jaw. He is diaphoretic and nauseated. Vital signs: BP 158/94 mmHg, HR 102 bpm, RR 22/min, SpO2 94% on room air. ECG shows ST-segment elevation in leads II, III, and aVF.",
    centerOptions: ["Inferior ST-elevation myocardial infarction","Unstable angina","Aortic dissection","Pulmonary embolism"],
    centerCorrect: 0,
    leftFindings: ["ST-elevation in leads II, III, aVF","Crushing substernal chest pain radiating to left arm","Diaphoresis and nausea","Elevated troponin levels expected","Normal chest X-ray findings","Bilateral equal blood pressures"],
    leftCorrect: [0,1,2],
    leftSelectCount: 3,
    rightActions: ["Administer aspirin 325 mg chewed immediately","Activate cardiac catheterization lab","Administer morphine for pain if not hypotensive","Administer thrombolytics without ECG confirmation","Obtain serial troponin levels","Discharge with follow-up appointment"],
    rightCorrect: [0,1,4],
    rightSelectCount: 3,
    rationale: {
      condition: "ST-elevation in inferior leads (II, III, aVF) with classic symptoms of crushing chest pain, diaphoresis, and nausea indicates an inferior STEMI requiring emergent intervention.",
      findings: "ST-elevation in inferior leads, crushing substernal pain radiating to the arm, and diaphoresis are hallmark findings of acute MI. Normal chest X-ray and bilateral equal BPs help rule out aortic dissection.",
      actions: "Aspirin inhibits platelet aggregation and is first-line. Cardiac catheterization lab activation enables primary PCI. Serial troponins confirm myocardial injury. Thrombolytics without ECG confirmation is inappropriate, and discharge is unsafe."
    },
    bodySystem: "Cardiovascular",
    tier: "rpn"
  },
  {
    id: "bt_rpn_cardiovascular_232_11",
    scenario: "A 67-year-old female with a history of atrial fibrillation and heart failure presents with increasing dyspnea, orthopnea, and bilateral lower extremity edema over 3 days. She reports sleeping on 3 pillows. Vital signs: BP 142/88 mmHg, HR 112 bpm irregular, RR 28/min, SpO2 88% on room air. Auscultation reveals bilateral crackles and an S3 gallop. BNP is 1,240 pg/mL.",
    centerOptions: ["Acute decompensated heart failure","Community-acquired pneumonia","Chronic obstructive pulmonary disease exacerbation","Pleural effusion"],
    centerCorrect: 0,
    leftFindings: ["Bilateral crackles with S3 gallop","Orthopnea requiring 3-pillow elevation","BNP 1,240 pg/mL","Bilateral lower extremity edema","Productive cough with green sputum","Barrel chest with prolonged expiration"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer IV furosemide as ordered","Position in high Fowler's position","Apply supplemental oxygen to maintain SpO2 above 94%","Encourage increased oral fluid intake","Monitor strict intake and output","Administer IV normal saline bolus"],
    rightCorrect: [0,1,2,4],
    rightSelectCount: 4,
    rationale: {
      condition: "Bilateral crackles, S3 gallop, orthopnea, peripheral edema, and markedly elevated BNP (greater than 400 pg/mL) are classic findings of acute decompensated heart failure.",
      findings: "S3 gallop indicates volume overload. Orthopnea and elevated BNP confirm fluid status. Bilateral edema reflects right-sided congestion. Green sputum and barrel chest are distractors suggesting pneumonia and COPD respectively.",
      actions: "IV furosemide promotes diuresis. High Fowler's reduces preload and improves breathing. Oxygen treats hypoxemia. Strict I&O monitors fluid balance. Increased fluids and saline bolus would worsen volume overload."
    },
    bodySystem: "Cardiovascular",
    tier: "rpn"
  },
  {
    id: "bt_rpn_cardiovascular_233_11",
    scenario: "A 50-year-old male with uncontrolled hypertension presents with sudden onset of severe tearing chest pain radiating to the back between the scapulae. He appears anxious and diaphoretic. Vital signs: Right arm BP 182/110 mmHg, Left arm BP 148/90 mmHg, HR 118 bpm, RR 24/min. Chest X-ray shows widened mediastinum.",
    centerOptions: ["Aortic dissection","Myocardial infarction","Tension pneumothorax","Esophageal rupture"],
    centerCorrect: 0,
    leftFindings: ["Tearing chest pain radiating to the back","Blood pressure differential between arms greater than 20 mmHg","Widened mediastinum on chest X-ray","History of uncontrolled hypertension","ST-elevation on ECG","Subcutaneous emphysema"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer IV beta-blocker to reduce heart rate and BP","Obtain emergent CT angiography","Prepare for possible surgical intervention","Administer thrombolytics immediately","Establish two large-bore IV lines","Administer aspirin 325 mg"],
    rightCorrect: [0,1,2,4],
    rightSelectCount: 4,
    rationale: {
      condition: "Sudden tearing chest pain radiating to the back, blood pressure differential greater than 20 mmHg between arms, and widened mediastinum are classic for aortic dissection.",
      findings: "Tearing pain to the back, BP differential, widened mediastinum, and uncontrolled HTN history are hallmark findings. ST-elevation suggests MI, and subcutaneous emphysema suggests esophageal rupture.",
      actions: "IV beta-blockers control heart rate and shear stress. CT angiography confirms diagnosis. Surgical prep is essential. Large-bore IVs allow resuscitation. Thrombolytics and aspirin are absolutely contraindicated as they would worsen hemorrhage."
    },
    bodySystem: "Cardiovascular",
    tier: "rpn"
  },
  {
    id: "bt_rpn_respiratory_234_11",
    scenario: "A 37-year-old female with a history of asthma presents to the emergency department with severe dyspnea, audible wheezing, and inability to speak in full sentences. She has used her albuterol inhaler 8 times today without relief. Vital signs: BP 138/82 mmHg, HR 124 bpm, RR 32/min, SpO2 87% on room air. Peak flow is 120 L/min (predicted 380 L/min).",
    centerOptions: ["Severe acute asthma exacerbation (status asthmaticus)","Chronic obstructive pulmonary disease exacerbation","Anaphylaxis","Spontaneous pneumothorax"],
    centerCorrect: 0,
    leftFindings: ["Inability to speak in full sentences","Peak flow less than 33% of predicted","SpO2 87% on room air","No relief from repeated albuterol use","Inspiratory stridor","Unilateral absent breath sounds"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer continuous nebulized albuterol","Administer IV corticosteroids (methylprednisolone)","Prepare for possible intubation","Administer ipratropium bromide nebulization","Discharge with oral prednisone taper","Apply high-flow supplemental oxygen"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Severe dyspnea with inability to speak in full sentences, peak flow below 33% predicted, refractory to beta-agonist therapy, and hypoxemia indicate status asthmaticus requiring aggressive treatment.",
      findings: "Inability to speak in sentences, severely reduced peak flow, hypoxemia, and albuterol resistance are hallmarks of severe exacerbation. Stridor suggests upper airway obstruction, and unilateral absent sounds suggest pneumothorax.",
      actions: "Continuous nebulized albuterol provides sustained bronchodilation. IV steroids reduce inflammation. Intubation preparation ensures airway protection. Ipratropium provides additional bronchodilation. High-flow oxygen treats hypoxemia. Discharge is inappropriate for this severity."
    },
    bodySystem: "Respiratory",
    tier: "rpn"
  },
  {
    id: "bt_rpn_respiratory_235_11",
    scenario: "A 58-year-old male, 4 days post total hip replacement, suddenly develops sharp pleuritic chest pain, dyspnea, and hemoptysis. He is tachycardic and anxious. Vital signs: BP 110/70 mmHg, HR 118 bpm, RR 28/min, SpO2 89% on room air. D-dimer is 2,400 ng/mL. CT pulmonary angiography reveals a filling defect in the right main pulmonary artery.",
    centerOptions: ["Pulmonary embolism","Hospital-acquired pneumonia","Fat embolism syndrome","Acute coronary syndrome"],
    centerCorrect: 0,
    leftFindings: ["Pleuritic chest pain with hemoptysis","Recent surgical procedure with immobility","D-dimer 2,400 ng/mL","CT showing filling defect in pulmonary artery","Petechial rash on chest and axillae","Productive cough with purulent sputum"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Initiate anticoagulation with IV heparin","Apply supplemental oxygen","Elevate the head of bed","Prepare for thrombolysis if hemodynamically unstable","Encourage early ambulation without restrictions","Monitor for signs of right ventricular failure"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Pleuritic chest pain, hemoptysis, tachycardia, and hypoxemia in a postoperative patient with elevated D-dimer and CT-confirmed filling defect confirm pulmonary embolism.",
      findings: "Pleuritic pain with hemoptysis, surgical immobility risk factor, markedly elevated D-dimer, and CT angiography findings are diagnostic. Petechial rash suggests fat embolism; purulent sputum suggests pneumonia.",
      actions: "IV heparin prevents clot propagation. Oxygen treats hypoxemia. Head elevation improves ventilation. Thrombolysis is reserved for massive PE with hemodynamic instability. Monitoring for RV failure detects deterioration. Unrestricted ambulation could dislodge further emboli."
    },
    bodySystem: "Respiratory",
    tier: "rpn"
  },
  {
    id: "bt_rpn_respiratory_236_11",
    scenario: "A 53-year-old male with a 40-pack-year smoking history presents with worsening dyspnea, increased sputum production with yellow-green color, and low-grade fever for 3 days. He uses home oxygen at 2 L/min. Vital signs: BP 136/82 mmHg, HR 98 bpm, RR 26/min, SpO2 85% on 2 L/min NC, Temp 38.2C. ABG: pH 7.31, PaCO2 58 mmHg, PaO2 52 mmHg, HCO3 28 mEq/L.",
    centerOptions: ["Acute exacerbation of COPD","Community-acquired pneumonia","Acute asthma attack","Pulmonary fibrosis"],
    centerCorrect: 0,
    leftFindings: ["40-pack-year smoking history with chronic dyspnea","Increased purulent sputum production","Compensated respiratory acidosis on ABG","Hypoxemia despite home oxygen","No wheezing or reversible obstruction","Bilateral fine inspiratory crackles only"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Increase oxygen to maintain SpO2 88-92%","Administer short-acting bronchodilator nebulization","Administer systemic corticosteroids","Start antibiotics for infectious exacerbation","Administer high-flow oxygen to achieve SpO2 100%","Monitor for CO2 narcosis and worsening respiratory acidosis"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "A COPD patient with worsening dyspnea, increased purulent sputum, fever, and compensated respiratory acidosis with chronic CO2 retention meets criteria for acute COPD exacerbation.",
      findings: "Smoking history, baseline dyspnea, purulent sputum increase, and ABG showing compensated respiratory acidosis (elevated PaCO2 with elevated HCO3) confirm chronic CO2 retention with acute worsening.",
      actions: "Target SpO2 88-92% to avoid suppressing hypoxic drive. Bronchodilators relieve airflow obstruction. Steroids reduce inflammation. Antibiotics treat infectious trigger. High-flow O2 to 100% risks CO2 narcosis. Monitoring respiratory status is essential."
    },
    bodySystem: "Respiratory",
    tier: "rpn"
  },
  {
    id: "bt_rpn_neurological_237_11",
    scenario: "A 69-year-old male is brought to the emergency department by his wife who noticed sudden onset of right-sided facial droop, right arm weakness, and slurred speech 45 minutes ago. He has a history of atrial fibrillation and takes warfarin irregularly. Vital signs: BP 178/96 mmHg, HR 88 bpm irregular, RR 18/min, SpO2 97%. NIHSS score is 14. CT head shows no hemorrhage.",
    centerOptions: ["Acute ischemic stroke","Hemorrhagic stroke","Transient ischemic attack","Bell's palsy"],
    centerCorrect: 0,
    leftFindings: ["Sudden right-sided facial droop and arm weakness","Slurred speech (dysarthria)","History of atrial fibrillation","CT head negative for hemorrhage","NIHSS score of 14","Gradual bilateral facial weakness"],
    leftCorrect: [0,1,2,3,4],
    leftSelectCount: 5,
    rightActions: ["Determine eligibility for IV alteplase (tPA) within window","Obtain STAT INR and coagulation studies","Maintain blood pressure below 185/110 mmHg if thrombolysis candidate","Administer aspirin 325 mg immediately before imaging","Perform neurological assessments every 15 minutes","Position head of bed flat if no increased ICP"],
    rightCorrect: [0,1,2,4,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Sudden onset focal neurological deficits (facial droop, arm weakness, dysarthria) with negative CT for hemorrhage and atrial fibrillation as embolic source confirms acute ischemic stroke.",
      findings: "Sudden unilateral deficits, dysarthria, A-fib history, negative CT, and elevated NIHSS are classic. Gradual bilateral weakness suggests other diagnoses like myasthenia gravis.",
      actions: "tPA eligibility assessment is time-critical (within 4.5 hours). INR is essential since the patient takes warfarin (tPA contraindicated if INR greater than 1.7). BP management enables safe thrombolysis. Frequent neuro checks detect deterioration. Flat HOB improves cerebral perfusion. Aspirin before imaging is contraindicated as hemorrhage must be ruled out first."
    },
    bodySystem: "Neurological",
    tier: "rpn"
  },
  {
    id: "bt_rpn_neurological_238_11",
    scenario: "A 23-year-old female presents with severe headache described as the worst headache of my life, sudden onset while exercising. She reports neck stiffness and photophobia. Vital signs: BP 168/94 mmHg, HR 92 bpm, RR 18/min, Temp 37.8C. Neurological exam reveals nuchal rigidity. CT head is negative.",
    centerOptions: ["Subarachnoid hemorrhage","Tension headache","Meningitis","Migraine with aura"],
    centerCorrect: 0,
    leftFindings: ["Thunderclap headache - worst headache of life","Sudden onset during physical exertion","Nuchal rigidity on examination","Photophobia","Gradual onset over several hours","Aura with visual scotoma preceding headache"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Perform lumbar puncture to assess for xanthochromia","Order CT angiography to identify aneurysm","Maintain strict bed rest with dim lighting","Administer IV nimodipine to prevent vasospasm","Discharge with analgesics if CT is negative","Initiate seizure precautions"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Thunderclap headache with sudden onset during exertion, nuchal rigidity, and photophobia are classic for subarachnoid hemorrhage even with a negative CT (sensitivity decreases after 6 hours).",
      findings: "Worst headache of life with sudden onset, exertional trigger, nuchal rigidity, and photophobia strongly suggest SAH. Gradual onset and visual aura are migraine features.",
      actions: "Lumbar puncture after negative CT detects xanthochromia (blood breakdown products). CTA identifies the bleeding source. Bed rest reduces rebleeding risk. Nimodipine prevents cerebral vasospasm. Seizure precautions prevent further injury. Discharge without LP is unsafe."
    },
    bodySystem: "Neurological",
    tier: "rpn"
  },
  {
    id: "bt_rpn_gastrointestinal_239_11",
    scenario: "A 40-year-old male with a history of alcohol use disorder presents with hematemesis of approximately 500 mL of bright red blood. He appears pale, anxious, and diaphoretic. Vital signs: BP 88/52 mmHg, HR 128 bpm, RR 24/min, SpO2 96%. Abdomen is distended with a fluid wave. He has spider angiomata on his chest and palmar erythema.",
    centerOptions: ["Esophageal variceal hemorrhage","Peptic ulcer disease bleeding","Mallory-Weiss tear","Gastric carcinoma"],
    centerCorrect: 0,
    leftFindings: ["Large-volume hematemesis with bright red blood","Signs of portal hypertension (ascites, spider angiomata)","Hemodynamic instability (hypotension, tachycardia)","History of alcohol use disorder","Epigastric pain relieved by eating","Coffee-ground emesis with melena only"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Establish two large-bore IV lines for volume resuscitation","Type and crossmatch for packed red blood cells","Administer IV octreotide to reduce portal pressure","Prepare for emergent endoscopy","Insert nasogastric tube for gastric lavage first","Administer IV proton pump inhibitor"],
    rightCorrect: [0,1,2,3],
    rightSelectCount: 4,
    rationale: {
      condition: "Large-volume hematemesis in a patient with alcohol use disorder and signs of portal hypertension (ascites, spider angiomata, palmar erythema) is consistent with esophageal variceal bleeding.",
      findings: "Bright red hematemesis, portal hypertension signs, hemodynamic instability, and alcohol history point to variceal hemorrhage. Epigastric pain relieved by eating suggests PUD. Coffee-ground emesis suggests slower upper GI bleed.",
      actions: "Large-bore IVs enable rapid resuscitation. Blood products correct hemorrhagic shock. Octreotide reduces portal venous pressure. Emergent endoscopy allows band ligation or sclerotherapy. NG tube in suspected varices is controversial and may worsen bleeding. PPI is appropriate for PUD but not primary therapy for varices."
    },
    bodySystem: "Gastrointestinal",
    tier: "rpn"
  },
  {
    id: "bt_rpn_gastrointestinal_240_11",
    scenario: "A 30-year-old female presents with acute onset right lower quadrant pain that began periumbilically 12 hours ago and migrated. She reports nausea, one episode of vomiting, and anorexia. Vital signs: BP 126/78 mmHg, HR 96 bpm, RR 18/min, Temp 38.4C. McBurney's point tenderness is positive. Rovsing sign is positive. WBC 14,200/mm3.",
    centerOptions: ["Acute appendicitis","Ectopic pregnancy","Ovarian torsion","Crohn's disease flare"],
    centerCorrect: 0,
    leftFindings: ["Pain migration from periumbilical to right lower quadrant","McBurney's point tenderness","Positive Rovsing sign","Leukocytosis with left shift","Positive pregnancy test","Chronic intermittent cramping with bloody diarrhea"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Maintain NPO status","Administer IV fluids and antibiotics","Prepare patient for surgical consultation","Obtain CT abdomen/pelvis with contrast","Administer oral laxatives for constipation","Apply heating pad to abdomen for comfort"],
    rightCorrect: [0,1,2,3],
    rightSelectCount: 4,
    rationale: {
      condition: "Classic migratory pain from periumbilical to RLQ, positive McBurney's and Rovsing signs, fever, and leukocytosis strongly suggest acute appendicitis.",
      findings: "Pain migration pattern, McBurney's tenderness, positive Rovsing sign, and elevated WBC are classic appendicitis findings. Positive pregnancy test suggests ectopic pregnancy. Chronic bloody diarrhea suggests Crohn's.",
      actions: "NPO status prepares for potential surgery. IV fluids maintain hydration and antibiotics prevent peritonitis. Surgical consult is essential. CT confirms diagnosis. Laxatives are contraindicated with possible appendicitis. Heat application may increase inflammation risk."
    },
    bodySystem: "Gastrointestinal",
    tier: "rpn"
  },
  {
    id: "bt_rpn_renalurinary_241_11",
    scenario: "A 57-year-old male with a history of type 2 diabetes and chronic kidney disease (Stage 3) presents with generalized weakness, nausea, and muscle cramping. Lab results show: K+ 6.8 mEq/L, BUN 48 mg/dL, Creatinine 4.2 mg/dL, GFR 18 mL/min. ECG shows peaked T waves and widened QRS complex.",
    centerOptions: ["Severe hyperkalemia with ECG changes","Diabetic ketoacidosis","Hyponatremia","Acute renal failure"],
    centerCorrect: 0,
    leftFindings: ["Potassium 6.8 mEq/L","Peaked T waves on ECG","Widened QRS complex","Muscle weakness and cramping","Deep Kussmaul respirations","Serum sodium 118 mEq/L"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer IV calcium gluconate for cardiac membrane stabilization","Administer insulin with dextrose to shift potassium intracellularly","Place on continuous cardiac monitoring","Administer sodium polystyrene sulfonate (Kayexalate)","Administer potassium chloride supplement","Prepare for possible emergent hemodialysis"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Potassium of 6.8 mEq/L with ECG changes (peaked T waves, widened QRS) represents a cardiac emergency requiring immediate treatment to prevent fatal arrhythmia.",
      findings: "Severely elevated potassium, peaked T waves, widened QRS, and neuromuscular symptoms confirm symptomatic hyperkalemia. Kussmaul breathing is a DKA finding. Low sodium would indicate hyponatremia.",
      actions: "Calcium gluconate stabilizes cardiac membranes immediately (does not lower K+). Insulin/dextrose shifts K+ into cells. Continuous monitoring detects arrhythmias. Kayexalate removes K+ from the body. Hemodialysis is definitive treatment for refractory cases. Additional potassium is absolutely contraindicated."
    },
    bodySystem: "Renal/Urinary",
    tier: "rpn"
  },
  {
    id: "bt_rpn_endocrine_242_11",
    scenario: "A 17-year-old female with Type 1 diabetes is brought to the ED by her roommate. She has had nausea, vomiting, and abdominal pain for 2 days following a urinary tract infection. She appears dehydrated with dry mucous membranes. Vital signs: BP 96/58 mmHg, HR 118 bpm, RR 28/min deep (Kussmaul), Temp 38.1C. Labs: Blood glucose 486 mg/dL, pH 7.18, HCO3 10 mEq/L, Anion gap 24, Serum K+ 5.6 mEq/L.",
    centerOptions: ["Diabetic ketoacidosis","Hyperosmolar hyperglycemic state","Lactic acidosis","Uremic acidosis"],
    centerCorrect: 0,
    leftFindings: ["Blood glucose 486 mg/dL with metabolic acidosis","Kussmaul respirations (deep and rapid)","Elevated anion gap of 24","Type 1 diabetes with intercurrent infection","Serum osmolality greater than 320 mOsm/kg","Gradual onset over 1-2 weeks"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Initiate aggressive IV normal saline resuscitation","Begin continuous IV regular insulin infusion","Monitor serum potassium every 1-2 hours","Administer IV potassium when K+ falls below 5.3 mEq/L","Administer subcutaneous long-acting insulin immediately","Monitor blood glucose hourly"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Type 1 diabetes, severe hyperglycemia, metabolic acidosis (pH 7.18, low HCO3), elevated anion gap, and Kussmaul respirations confirm DKA triggered by infection.",
      findings: "High glucose with acidosis, Kussmaul breathing (compensatory CO2 elimination), high anion gap (ketoacids), and Type 1 DM with infection trigger are diagnostic. Osmolality greater than 320 and gradual onset are HHS features.",
      actions: "IV NS corrects severe dehydration. Continuous insulin infusion corrects hyperglycemia and halts ketogenesis. K+ monitoring is critical as insulin drives K+ intracellularly. Replace K+ when it drops below 5.3 to prevent hypokalemia. Hourly glucose monitoring guides insulin titration. SubQ long-acting insulin during acute DKA is inappropriate."
    },
    bodySystem: "Endocrine",
    tier: "rpn"
  },
  {
    id: "bt_rpn_endocrine_243_11",
    scenario: "A 43-year-old female is found unresponsive by coworkers at her office. She has a medical alert bracelet indicating Addison's disease. Vital signs: BP 72/48 mmHg, HR 130 bpm, RR 22/min, Temp 36.0C, Blood glucose 52 mg/dL. Skin appears hyperpigmented. Serum sodium is 126 mEq/L, potassium 6.1 mEq/L.",
    centerOptions: ["Adrenal crisis (acute adrenal insufficiency)","Septic shock","Hypoglycemic episode","Myxedema coma"],
    centerCorrect: 0,
    leftFindings: ["Profound hypotension refractory to fluids alone","Hypoglycemia (blood glucose 52 mg/dL)","Hyponatremia with hyperkalemia","Known Addison's disease","High fever with chills","Severe hypothermia with bradycardia"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer IV hydrocortisone 100 mg STAT","Initiate aggressive IV normal saline with dextrose","Administer IV dextrose 50% for hypoglycemia","Monitor hemodynamic status continuously","Hold all corticosteroids until cortisol level returns","Obtain random cortisol and ACTH levels before treatment if possible"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Unresponsiveness, severe hypotension, hypoglycemia, hyponatremia, hyperkalemia, and known Addison's disease are classic for adrenal crisis requiring emergent glucocorticoid replacement.",
      findings: "Refractory hypotension, hypoglycemia, electrolyte pattern (low Na, high K), and Addison's history confirm adrenal crisis. High fever suggests sepsis. Hypothermia with bradycardia suggests myxedema coma.",
      actions: "IV hydrocortisone is life-saving and must not be delayed. IV NS with dextrose corrects dehydration and hypoglycemia. D50 treats acute hypoglycemia. Continuous monitoring detects hemodynamic changes. Cortisol/ACTH levels should be drawn before treatment if it does not delay therapy. Withholding steroids is dangerous."
    },
    bodySystem: "Endocrine",
    tier: "rpn"
  },
  {
    id: "bt_rpn_hematology_244_11",
    scenario: "A 1-year-old African American male presents to the ED with severe bilateral leg pain, swollen hands, and fever. His mother reports he has sickle cell disease. Vital signs: BP 100/62 mmHg, HR 122 bpm, RR 24/min, Temp 39.2C, SpO2 91%. CBC shows Hgb 6.2 g/dL, WBC 18,400/mm3, reticulocyte count 12%.",
    centerOptions: ["Vaso-occlusive sickle cell crisis with fever","Osteomyelitis","Acute lymphoblastic leukemia","Juvenile rheumatoid arthritis"],
    centerCorrect: 0,
    leftFindings: ["Severe bilateral bone pain","Known sickle cell disease","Fever with leukocytosis","Hemoglobin 6.2 g/dL with elevated reticulocytes","Painless joint swelling without warmth","Pancytopenia with blast cells"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer IV opioid analgesics for pain management","Initiate aggressive IV fluid hydration","Obtain blood cultures before antibiotics","Administer supplemental oxygen for SpO2 below 95%","Apply cold compresses to painful areas","Prepare for possible blood transfusion"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "A child with known sickle cell disease presenting with bilateral bone pain, dactylitis, fever, anemia, and elevated reticulocytes indicates vaso-occlusive crisis with possible infection requiring urgent treatment.",
      findings: "Bilateral bone pain, sickle cell history, fever, anemia with reticulocytosis (hemolysis compensation) confirm crisis. Painless joint swelling suggests JRA. Pancytopenia with blasts suggests leukemia.",
      actions: "IV opioids address severe pain (do not undertreat sickle cell pain). IV fluids reduce blood viscosity and sickling. Blood cultures identify infection source. O2 maintains oxygenation to reduce sickling. Transfusion may be needed for severe anemia. Cold compresses are contraindicated as cold promotes sickling."
    },
    bodySystem: "Hematology",
    tier: "rpn"
  },
  {
    id: "bt_rpn_mentalhealth_245_11",
    scenario: "A 27-year-old male is brought to the psychiatric emergency department by police after being found on a bridge railing. He reports feeling hopeless for 3 months after losing his job and a recent divorce. He states he has a plan to use a firearm stored at his home. He admits to heavy alcohol use daily. He has no prior psychiatric history. Vital signs are stable.",
    centerOptions: ["Acute suicidal crisis with imminent risk","Major depressive episode without suicidality","Adjustment disorder with depressed mood","Alcohol use disorder only"],
    centerCorrect: 0,
    leftFindings: ["Verbalized specific plan with access to lethal means","Hopelessness lasting 3 months","Multiple recent psychosocial stressors (job loss, divorce)","Active heavy alcohol use (disinhibiting factor)","Reports passive thoughts without plan","Denies any intent to harm self"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Implement one-to-one continuous observation","Initiate safety planning and restrict access to lethal means","Obtain psychiatric consultation for inpatient admission","Screen for substance intoxication and withdrawal","Discharge with outpatient follow-up referral","Ensure therapeutic, non-judgmental communication"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Active suicidal ideation with a specific lethal plan (firearm), access to means, multiple risk factors (hopelessness, substance use, psychosocial stressors), and behavioral evidence (found on bridge) indicate imminent suicide risk.",
      findings: "Specific plan with access, hopelessness, stressors, and alcohol use as a disinhibitor are high-risk factors. Passive thoughts without plan and denial of intent would lower risk but are not present here.",
      actions: "One-to-one observation prevents self-harm. Safety planning addresses means restriction. Psychiatric consult evaluates for involuntary hold if needed. Substance screening identifies intoxication. Therapeutic communication builds rapport. Discharge is unsafe given imminent risk level."
    },
    bodySystem: "Mental Health",
    tier: "rpn"
  },
  {
    id: "bt_rpn_immuneinfectious_246_11",
    scenario: "A 66-year-old male nursing home resident presents with altered mental status, fever, and productive cough with rust-colored sputum for 2 days. He has a history of COPD and type 2 diabetes. Vital signs: BP 86/54 mmHg, HR 112 bpm, RR 28/min, Temp 39.4C, SpO2 86% on room air. WBC 22,600/mm3. Lactate 4.2 mmol/L. Chest X-ray shows right lower lobe consolidation.",
    centerOptions: ["Sepsis secondary to community-acquired pneumonia","COPD exacerbation","Acute heart failure","Aspiration pneumonitis"],
    centerCorrect: 0,
    leftFindings: ["Fever with productive rust-colored sputum","Hypotension with tachycardia (signs of septic shock)","Elevated lactate 4.2 mmol/L indicating tissue hypoperfusion","Right lower lobe consolidation on chest X-ray","Bilateral wheezing without consolidation","Frothy pink sputum with bilateral infiltrates"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Initiate IV broad-spectrum antibiotics within 1 hour","Administer 30 mL/kg IV crystalloid bolus","Obtain blood cultures before antibiotics if possible","Apply supplemental oxygen to target SpO2 above 94%","Administer IV corticosteroids as first-line treatment","Measure serial lactate levels to assess resuscitation adequacy"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Suspected infection (pneumonia), organ dysfunction (hypotension, altered mental status), and elevated lactate greater than 2 mmol/L meet Sepsis-3 criteria. This represents septic shock requiring the SEP-1 bundle.",
      findings: "Fever, productive cough, consolidation confirm pneumonia source. Hypotension and tachycardia indicate shock. Elevated lactate confirms tissue hypoperfusion. Wheezing without consolidation suggests COPD. Frothy pink sputum suggests heart failure.",
      actions: "Antibiotics within 1 hour reduce mortality in sepsis. Fluid bolus restores perfusion. Blood cultures guide targeted therapy. Oxygen corrects hypoxemia. Corticosteroids are not first-line for sepsis (reserved for refractory shock). Serial lactate measures guide resuscitation."
    },
    bodySystem: "Immune/Infectious",
    tier: "rpn"
  },
  {
    id: "bt_rpn_reproductivematernity_247_11",
    scenario: "A 23-year-old G2P1 at 34 weeks gestation presents with sudden onset of severe abdominal pain and vaginal bleeding. She reports the pain is constant and her abdomen feels rigid and board-like. She has a history of chronic hypertension. Vital signs: BP 168/108 mmHg, HR 120 bpm, RR 24/min. Fetal heart rate shows persistent late decelerations with decreased variability.",
    centerOptions: ["Placental abruption","Placenta previa","Uterine rupture","Preterm labor"],
    centerCorrect: 0,
    leftFindings: ["Sudden onset constant abdominal pain with rigidity","Dark red vaginal bleeding","Board-like rigid uterus on palpation","Chronic hypertension as risk factor","Painless bright red vaginal bleeding","Intermittent cramping with progressive cervical dilation"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Initiate continuous fetal monitoring","Establish two large-bore IV lines for fluid resuscitation","Prepare for emergent cesarean delivery","Type and crossmatch blood products","Perform digital cervical examination","Administer IV magnesium sulfate for seizure prophylaxis"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Sudden severe constant pain, board-like rigidity, dark bleeding, chronic HTN risk factor, and fetal distress (late decels, decreased variability) are classic for placental abruption.",
      findings: "Constant pain with rigidity (Couvelaire uterus), dark bleeding, and HTN history are hallmarks. Painless bright bleeding suggests previa. Intermittent cramping with dilation suggests preterm labor.",
      actions: "Continuous FHR monitoring detects fetal compromise. Large-bore IVs prepare for hemorrhage management. Emergent cesarean is indicated for fetal distress. Blood products address hemorrhagic shock. MgSO4 prevents eclamptic seizures with severe HTN. Digital exam is contraindicated until previa is ruled out."
    },
    bodySystem: "Reproductive/Maternity",
    tier: "rpn"
  },
  {
    id: "bt_rpn_pediatrics_248_11",
    scenario: "A 1-year-old male is brought to the ED with a barking cough, inspiratory stridor, and hoarse voice that started after a mild upper respiratory infection. His parents report the symptoms worsened tonight. He has mild substernal retractions. Vital signs: HR 120 bpm, RR 30/min, Temp 38.3C, SpO2 93%. He is sitting upright and appears anxious but alert.",
    centerOptions: ["Moderate croup (laryngotracheobronchitis)","Epiglottitis","Foreign body aspiration","Bacterial tracheitis"],
    centerCorrect: 0,
    leftFindings: ["Barking (seal-like) cough","Inspiratory stridor at rest","Preceded by upper respiratory infection","Hoarse voice with mild retractions","Sudden onset while eating with unilateral wheeze","Drooling with tripod positioning and high fever"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer nebulized racemic epinephrine","Administer oral or IM dexamethasone","Keep the child calm and in a position of comfort","Monitor for rebound stridor after epinephrine","Examine the throat with tongue depressor","Place on continuous pulse oximetry"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Barking cough, inspiratory stridor, hoarseness following URI, and age 6 months to 3 years are classic for viral croup (laryngotracheobronchitis), most commonly caused by parainfluenza virus.",
      findings: "Barking cough, stridor at rest, URI prodrome, and hoarseness with retractions confirm moderate croup. Sudden onset with eating suggests foreign body. Drooling, tripod, and high fever suggest epiglottitis.",
      actions: "Racemic epinephrine reduces subglottic edema. Dexamethasone reduces inflammation (single dose is standard). Keeping the child calm prevents worsening airway obstruction. Rebound monitoring detects recurrence after epinephrine. Pulse oximetry tracks oxygenation. Throat examination with a tongue depressor is contraindicated as it may worsen obstruction and is specifically avoided in suspected epiglottitis."
    },
    bodySystem: "Pediatrics",
    tier: "rpn"
  },
  {
    id: "bt_rpn_emergencytrauma_249_11",
    scenario: "A 29-year-old male arrives via EMS after a motorcycle collision at approximately 60 km/h. He is alert but confused. He has a large open wound on the right thigh with visible bone and significant hemorrhage. Vital signs: BP 82/50 mmHg, HR 138 bpm, RR 28/min, SpO2 94%. He is pale, cool, and diaphoretic. Estimated blood loss is greater than 1,500 mL.",
    centerOptions: ["Hemorrhagic shock (Class III-IV)","Neurogenic shock","Cardiogenic shock","Tension pneumothorax"],
    centerCorrect: 0,
    leftFindings: ["Tachycardia with hypotension","Pale, cool, diaphoretic skin","Open fracture with greater than 1,500 mL estimated blood loss","Altered mental status (confusion)","Warm, flushed skin with bradycardia","Distended neck veins with tracheal deviation"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Apply direct pressure and tourniquet to hemorrhaging extremity","Initiate massive transfusion protocol","Establish two large-bore IV lines with warmed fluids","Perform primary survey using ABCDE approach","Elevate the injured extremity above heart level only","Obtain type and crossmatch and administer blood products"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Tachycardia, hypotension, altered mental status, cool/pale/diaphoretic skin, and estimated blood loss greater than 1,500 mL in a trauma patient indicate Class III-IV hemorrhagic shock.",
      findings: "Tachycardia, hypotension, cool diaphoretic skin, and AMS with significant blood loss are classic hemorrhagic shock findings. Warm flushed skin with bradycardia suggests neurogenic shock. Distended neck veins with tracheal deviation suggests tension pneumothorax.",
      actions: "Direct pressure and tourniquet control active hemorrhage. Massive transfusion protocol provides balanced blood product resuscitation. Large-bore IVs enable rapid volume replacement. ABCDE primary survey ensures systematic assessment. Blood products restore oxygen-carrying capacity. Elevation alone is insufficient for active hemorrhage of this magnitude."
    },
    bodySystem: "Emergency/Trauma",
    tier: "rpn"
  },
  {
    id: "bt_rpn_musculoskeletal_250_11",
    scenario: "A 14-year-old male presents 6 hours after a tibial fracture reduction and casting. He reports increasing severe pain in his lower leg that is not relieved by prescribed opioids. Pain worsens with passive dorsiflexion of the toes. His leg feels tight and tense. Capillary refill is 4 seconds. He reports tingling and numbness in his toes.",
    centerOptions: ["Compartment syndrome","Deep vein thrombosis","Fat embolism syndrome","Cellulitis"],
    centerCorrect: 0,
    leftFindings: ["Pain out of proportion to injury not relieved by analgesics","Pain with passive stretch (dorsiflexion)","Paresthesia (tingling and numbness)","Tense and swollen compartment","Warmth and erythema along the vein","Petechial rash with confusion"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Notify surgeon immediately for possible fasciotomy","Remove or bivalve the cast immediately","Elevate the limb to heart level only (not above)","Monitor neurovascular status every 15-30 minutes","Apply compression bandage to reduce swelling","Measure compartment pressures if available"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "The 5 Ps of compartment syndrome: Pain out of proportion, Pain with passive stretch, Paresthesia, Pressure (tense compartment), and delayed capillary refill indicate a surgical emergency.",
      findings: "Disproportionate pain, pain with passive stretch, paresthesia, and tense compartment are classic. Warmth along a vein suggests DVT. Petechial rash with confusion suggests fat embolism.",
      actions: "Surgical fasciotomy is definitive treatment. Cast removal releases external pressure. Elevate to heart level (not above, which could worsen ischemia). Frequent neurovascular checks track progression. Compartment pressure measurement confirms diagnosis. Compression is contraindicated as it increases compartment pressure."
    },
    bodySystem: "Musculoskeletal",
    tier: "rpn"
  },
  {
    id: "bt_rpn_integumentary_251_11",
    scenario: "A 40-year-old male is admitted to the burn unit after a house fire with estimated 35% TBSA second and third degree burns to his chest, bilateral arms, and face. He was in an enclosed space with smoke exposure. His voice is hoarse and he has singed nasal hairs. Vital signs: BP 102/64 mmHg, HR 124 bpm, RR 26/min, SpO2 92%. He weighs 80 kg.",
    centerOptions: ["Major thermal burn with inhalation injury","Superficial burn requiring outpatient care","Chemical burn exposure","Electrical burn injury"],
    centerCorrect: 0,
    leftFindings: ["35% TBSA second and third degree burns","Hoarse voice with singed nasal hairs (inhalation injury signs)","Enclosed space fire exposure","Facial burns present","Burns limited to extremities only","Entry and exit wounds visible"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Initiate Parkland formula fluid resuscitation (4 mL x kg x %TBSA)","Prepare for early intubation due to inhalation injury signs","Obtain carboxyhemoglobin level","Monitor urine output target 0.5-1 mL/kg/hr","Apply ice directly to burn wounds","Administer tetanus prophylaxis if not current"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Greater than 20% TBSA burns with facial involvement, hoarse voice, singed nasal hairs, and enclosed space exposure indicate major burns with high suspicion for inhalation injury.",
      findings: "35% TBSA, hoarseness, singed nasal hairs, enclosed space, and facial burns are classic for inhalation injury. Burns limited to extremities without airway signs lower risk. Entry/exit wounds suggest electrical injury.",
      actions: "Parkland formula guides crystalloid resuscitation (half in first 8 hours). Early intubation protects airway before edema progresses. Carboxyhemoglobin detects CO poisoning. Urine output guides fluid adequacy. Tetanus prophylaxis prevents infection. Ice is contraindicated as it causes vasoconstriction and worsens tissue damage."
    },
    bodySystem: "Integumentary",
    tier: "rpn"
  },
  {
    id: "bt_rpn_cardiovascular_252_12",
    scenario: "A 76-year-old male with a history of hypertension presents to the emergency department with crushing substernal chest pain radiating to the left arm and jaw. He is diaphoretic and nauseated. Vital signs: BP 158/94 mmHg, HR 102 bpm, RR 22/min, SpO2 94% on room air. ECG shows ST-segment elevation in leads II, III, and aVF.",
    centerOptions: ["Inferior ST-elevation myocardial infarction","Unstable angina","Aortic dissection","Pulmonary embolism"],
    centerCorrect: 0,
    leftFindings: ["ST-elevation in leads II, III, aVF","Crushing substernal chest pain radiating to left arm","Diaphoresis and nausea","Elevated troponin levels expected","Normal chest X-ray findings","Bilateral equal blood pressures"],
    leftCorrect: [0,1,2],
    leftSelectCount: 3,
    rightActions: ["Administer aspirin 325 mg chewed immediately","Activate cardiac catheterization lab","Administer morphine for pain if not hypotensive","Administer thrombolytics without ECG confirmation","Obtain serial troponin levels","Discharge with follow-up appointment"],
    rightCorrect: [0,1,4],
    rightSelectCount: 3,
    rationale: {
      condition: "ST-elevation in inferior leads (II, III, aVF) with classic symptoms of crushing chest pain, diaphoresis, and nausea indicates an inferior STEMI requiring emergent intervention.",
      findings: "ST-elevation in inferior leads, crushing substernal pain radiating to the arm, and diaphoresis are hallmark findings of acute MI. Normal chest X-ray and bilateral equal BPs help rule out aortic dissection.",
      actions: "Aspirin inhibits platelet aggregation and is first-line. Cardiac catheterization lab activation enables primary PCI. Serial troponins confirm myocardial injury. Thrombolytics without ECG confirmation is inappropriate, and discharge is unsafe."
    },
    bodySystem: "Cardiovascular",
    tier: "rpn"
  },
  {
    id: "bt_rpn_cardiovascular_253_12",
    scenario: "A 80-year-old female with a history of atrial fibrillation and heart failure presents with increasing dyspnea, orthopnea, and bilateral lower extremity edema over 3 days. She reports sleeping on 3 pillows. Vital signs: BP 142/88 mmHg, HR 112 bpm irregular, RR 28/min, SpO2 88% on room air. Auscultation reveals bilateral crackles and an S3 gallop. BNP is 1,240 pg/mL.",
    centerOptions: ["Acute decompensated heart failure","Community-acquired pneumonia","Chronic obstructive pulmonary disease exacerbation","Pleural effusion"],
    centerCorrect: 0,
    leftFindings: ["Bilateral crackles with S3 gallop","Orthopnea requiring 3-pillow elevation","BNP 1,240 pg/mL","Bilateral lower extremity edema","Productive cough with green sputum","Barrel chest with prolonged expiration"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer IV furosemide as ordered","Position in high Fowler's position","Apply supplemental oxygen to maintain SpO2 above 94%","Encourage increased oral fluid intake","Monitor strict intake and output","Administer IV normal saline bolus"],
    rightCorrect: [0,1,2,4],
    rightSelectCount: 4,
    rationale: {
      condition: "Bilateral crackles, S3 gallop, orthopnea, peripheral edema, and markedly elevated BNP (greater than 400 pg/mL) are classic findings of acute decompensated heart failure.",
      findings: "S3 gallop indicates volume overload. Orthopnea and elevated BNP confirm fluid status. Bilateral edema reflects right-sided congestion. Green sputum and barrel chest are distractors suggesting pneumonia and COPD respectively.",
      actions: "IV furosemide promotes diuresis. High Fowler's reduces preload and improves breathing. Oxygen treats hypoxemia. Strict I&O monitors fluid balance. Increased fluids and saline bolus would worsen volume overload."
    },
    bodySystem: "Cardiovascular",
    tier: "rpn"
  },
  {
    id: "bt_rpn_cardiovascular_254_12",
    scenario: "A 63-year-old male with uncontrolled hypertension presents with sudden onset of severe tearing chest pain radiating to the back between the scapulae. He appears anxious and diaphoretic. Vital signs: Right arm BP 182/110 mmHg, Left arm BP 148/90 mmHg, HR 118 bpm, RR 24/min. Chest X-ray shows widened mediastinum.",
    centerOptions: ["Aortic dissection","Myocardial infarction","Tension pneumothorax","Esophageal rupture"],
    centerCorrect: 0,
    leftFindings: ["Tearing chest pain radiating to the back","Blood pressure differential between arms greater than 20 mmHg","Widened mediastinum on chest X-ray","History of uncontrolled hypertension","ST-elevation on ECG","Subcutaneous emphysema"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer IV beta-blocker to reduce heart rate and BP","Obtain emergent CT angiography","Prepare for possible surgical intervention","Administer thrombolytics immediately","Establish two large-bore IV lines","Administer aspirin 325 mg"],
    rightCorrect: [0,1,2,4],
    rightSelectCount: 4,
    rationale: {
      condition: "Sudden tearing chest pain radiating to the back, blood pressure differential greater than 20 mmHg between arms, and widened mediastinum are classic for aortic dissection.",
      findings: "Tearing pain to the back, BP differential, widened mediastinum, and uncontrolled HTN history are hallmark findings. ST-elevation suggests MI, and subcutaneous emphysema suggests esophageal rupture.",
      actions: "IV beta-blockers control heart rate and shear stress. CT angiography confirms diagnosis. Surgical prep is essential. Large-bore IVs allow resuscitation. Thrombolytics and aspirin are absolutely contraindicated as they would worsen hemorrhage."
    },
    bodySystem: "Cardiovascular",
    tier: "rpn"
  },
  {
    id: "bt_rpn_respiratory_255_12",
    scenario: "A 50-year-old female with a history of asthma presents to the emergency department with severe dyspnea, audible wheezing, and inability to speak in full sentences. She has used her albuterol inhaler 8 times today without relief. Vital signs: BP 138/82 mmHg, HR 124 bpm, RR 32/min, SpO2 87% on room air. Peak flow is 120 L/min (predicted 380 L/min).",
    centerOptions: ["Severe acute asthma exacerbation (status asthmaticus)","Chronic obstructive pulmonary disease exacerbation","Anaphylaxis","Spontaneous pneumothorax"],
    centerCorrect: 0,
    leftFindings: ["Inability to speak in full sentences","Peak flow less than 33% of predicted","SpO2 87% on room air","No relief from repeated albuterol use","Inspiratory stridor","Unilateral absent breath sounds"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer continuous nebulized albuterol","Administer IV corticosteroids (methylprednisolone)","Prepare for possible intubation","Administer ipratropium bromide nebulization","Discharge with oral prednisone taper","Apply high-flow supplemental oxygen"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Severe dyspnea with inability to speak in full sentences, peak flow below 33% predicted, refractory to beta-agonist therapy, and hypoxemia indicate status asthmaticus requiring aggressive treatment.",
      findings: "Inability to speak in sentences, severely reduced peak flow, hypoxemia, and albuterol resistance are hallmarks of severe exacerbation. Stridor suggests upper airway obstruction, and unilateral absent sounds suggest pneumothorax.",
      actions: "Continuous nebulized albuterol provides sustained bronchodilation. IV steroids reduce inflammation. Intubation preparation ensures airway protection. Ipratropium provides additional bronchodilation. High-flow oxygen treats hypoxemia. Discharge is inappropriate for this severity."
    },
    bodySystem: "Respiratory",
    tier: "rpn"
  },
  {
    id: "bt_rpn_respiratory_256_12",
    scenario: "A 71-year-old male, 4 days post total hip replacement, suddenly develops sharp pleuritic chest pain, dyspnea, and hemoptysis. He is tachycardic and anxious. Vital signs: BP 110/70 mmHg, HR 118 bpm, RR 28/min, SpO2 89% on room air. D-dimer is 2,400 ng/mL. CT pulmonary angiography reveals a filling defect in the right main pulmonary artery.",
    centerOptions: ["Pulmonary embolism","Hospital-acquired pneumonia","Fat embolism syndrome","Acute coronary syndrome"],
    centerCorrect: 0,
    leftFindings: ["Pleuritic chest pain with hemoptysis","Recent surgical procedure with immobility","D-dimer 2,400 ng/mL","CT showing filling defect in pulmonary artery","Petechial rash on chest and axillae","Productive cough with purulent sputum"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Initiate anticoagulation with IV heparin","Apply supplemental oxygen","Elevate the head of bed","Prepare for thrombolysis if hemodynamically unstable","Encourage early ambulation without restrictions","Monitor for signs of right ventricular failure"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Pleuritic chest pain, hemoptysis, tachycardia, and hypoxemia in a postoperative patient with elevated D-dimer and CT-confirmed filling defect confirm pulmonary embolism.",
      findings: "Pleuritic pain with hemoptysis, surgical immobility risk factor, markedly elevated D-dimer, and CT angiography findings are diagnostic. Petechial rash suggests fat embolism; purulent sputum suggests pneumonia.",
      actions: "IV heparin prevents clot propagation. Oxygen treats hypoxemia. Head elevation improves ventilation. Thrombolysis is reserved for massive PE with hemodynamic instability. Monitoring for RV failure detects deterioration. Unrestricted ambulation could dislodge further emboli."
    },
    bodySystem: "Respiratory",
    tier: "rpn"
  },
  {
    id: "bt_rpn_respiratory_257_12",
    scenario: "A 66-year-old male with a 40-pack-year smoking history presents with worsening dyspnea, increased sputum production with yellow-green color, and low-grade fever for 3 days. He uses home oxygen at 2 L/min. Vital signs: BP 136/82 mmHg, HR 98 bpm, RR 26/min, SpO2 85% on 2 L/min NC, Temp 38.2C. ABG: pH 7.31, PaCO2 58 mmHg, PaO2 52 mmHg, HCO3 28 mEq/L.",
    centerOptions: ["Acute exacerbation of COPD","Community-acquired pneumonia","Acute asthma attack","Pulmonary fibrosis"],
    centerCorrect: 0,
    leftFindings: ["40-pack-year smoking history with chronic dyspnea","Increased purulent sputum production","Compensated respiratory acidosis on ABG","Hypoxemia despite home oxygen","No wheezing or reversible obstruction","Bilateral fine inspiratory crackles only"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Increase oxygen to maintain SpO2 88-92%","Administer short-acting bronchodilator nebulization","Administer systemic corticosteroids","Start antibiotics for infectious exacerbation","Administer high-flow oxygen to achieve SpO2 100%","Monitor for CO2 narcosis and worsening respiratory acidosis"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "A COPD patient with worsening dyspnea, increased purulent sputum, fever, and compensated respiratory acidosis with chronic CO2 retention meets criteria for acute COPD exacerbation.",
      findings: "Smoking history, baseline dyspnea, purulent sputum increase, and ABG showing compensated respiratory acidosis (elevated PaCO2 with elevated HCO3) confirm chronic CO2 retention with acute worsening.",
      actions: "Target SpO2 88-92% to avoid suppressing hypoxic drive. Bronchodilators relieve airflow obstruction. Steroids reduce inflammation. Antibiotics treat infectious trigger. High-flow O2 to 100% risks CO2 narcosis. Monitoring respiratory status is essential."
    },
    bodySystem: "Respiratory",
    tier: "rpn"
  },
  {
    id: "bt_rpn_neurological_258_12",
    scenario: "A 82-year-old male is brought to the emergency department by his wife who noticed sudden onset of right-sided facial droop, right arm weakness, and slurred speech 45 minutes ago. He has a history of atrial fibrillation and takes warfarin irregularly. Vital signs: BP 178/96 mmHg, HR 88 bpm irregular, RR 18/min, SpO2 97%. NIHSS score is 14. CT head shows no hemorrhage.",
    centerOptions: ["Acute ischemic stroke","Hemorrhagic stroke","Transient ischemic attack","Bell's palsy"],
    centerCorrect: 0,
    leftFindings: ["Sudden right-sided facial droop and arm weakness","Slurred speech (dysarthria)","History of atrial fibrillation","CT head negative for hemorrhage","NIHSS score of 14","Gradual bilateral facial weakness"],
    leftCorrect: [0,1,2,3,4],
    leftSelectCount: 5,
    rightActions: ["Determine eligibility for IV alteplase (tPA) within window","Obtain STAT INR and coagulation studies","Maintain blood pressure below 185/110 mmHg if thrombolysis candidate","Administer aspirin 325 mg immediately before imaging","Perform neurological assessments every 15 minutes","Position head of bed flat if no increased ICP"],
    rightCorrect: [0,1,2,4,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Sudden onset focal neurological deficits (facial droop, arm weakness, dysarthria) with negative CT for hemorrhage and atrial fibrillation as embolic source confirms acute ischemic stroke.",
      findings: "Sudden unilateral deficits, dysarthria, A-fib history, negative CT, and elevated NIHSS are classic. Gradual bilateral weakness suggests other diagnoses like myasthenia gravis.",
      actions: "tPA eligibility assessment is time-critical (within 4.5 hours). INR is essential since the patient takes warfarin (tPA contraindicated if INR greater than 1.7). BP management enables safe thrombolysis. Frequent neuro checks detect deterioration. Flat HOB improves cerebral perfusion. Aspirin before imaging is contraindicated as hemorrhage must be ruled out first."
    },
    bodySystem: "Neurological",
    tier: "rpn"
  },
  {
    id: "bt_rpn_neurological_259_12",
    scenario: "A 36-year-old female presents with severe headache described as the worst headache of my life, sudden onset while exercising. She reports neck stiffness and photophobia. Vital signs: BP 168/94 mmHg, HR 92 bpm, RR 18/min, Temp 37.8C. Neurological exam reveals nuchal rigidity. CT head is negative.",
    centerOptions: ["Subarachnoid hemorrhage","Tension headache","Meningitis","Migraine with aura"],
    centerCorrect: 0,
    leftFindings: ["Thunderclap headache - worst headache of life","Sudden onset during physical exertion","Nuchal rigidity on examination","Photophobia","Gradual onset over several hours","Aura with visual scotoma preceding headache"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Perform lumbar puncture to assess for xanthochromia","Order CT angiography to identify aneurysm","Maintain strict bed rest with dim lighting","Administer IV nimodipine to prevent vasospasm","Discharge with analgesics if CT is negative","Initiate seizure precautions"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Thunderclap headache with sudden onset during exertion, nuchal rigidity, and photophobia are classic for subarachnoid hemorrhage even with a negative CT (sensitivity decreases after 6 hours).",
      findings: "Worst headache of life with sudden onset, exertional trigger, nuchal rigidity, and photophobia strongly suggest SAH. Gradual onset and visual aura are migraine features.",
      actions: "Lumbar puncture after negative CT detects xanthochromia (blood breakdown products). CTA identifies the bleeding source. Bed rest reduces rebleeding risk. Nimodipine prevents cerebral vasospasm. Seizure precautions prevent further injury. Discharge without LP is unsafe."
    },
    bodySystem: "Neurological",
    tier: "rpn"
  },
  {
    id: "bt_rpn_gastrointestinal_260_12",
    scenario: "A 53-year-old male with a history of alcohol use disorder presents with hematemesis of approximately 500 mL of bright red blood. He appears pale, anxious, and diaphoretic. Vital signs: BP 88/52 mmHg, HR 128 bpm, RR 24/min, SpO2 96%. Abdomen is distended with a fluid wave. He has spider angiomata on his chest and palmar erythema.",
    centerOptions: ["Esophageal variceal hemorrhage","Peptic ulcer disease bleeding","Mallory-Weiss tear","Gastric carcinoma"],
    centerCorrect: 0,
    leftFindings: ["Large-volume hematemesis with bright red blood","Signs of portal hypertension (ascites, spider angiomata)","Hemodynamic instability (hypotension, tachycardia)","History of alcohol use disorder","Epigastric pain relieved by eating","Coffee-ground emesis with melena only"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Establish two large-bore IV lines for volume resuscitation","Type and crossmatch for packed red blood cells","Administer IV octreotide to reduce portal pressure","Prepare for emergent endoscopy","Insert nasogastric tube for gastric lavage first","Administer IV proton pump inhibitor"],
    rightCorrect: [0,1,2,3],
    rightSelectCount: 4,
    rationale: {
      condition: "Large-volume hematemesis in a patient with alcohol use disorder and signs of portal hypertension (ascites, spider angiomata, palmar erythema) is consistent with esophageal variceal bleeding.",
      findings: "Bright red hematemesis, portal hypertension signs, hemodynamic instability, and alcohol history point to variceal hemorrhage. Epigastric pain relieved by eating suggests PUD. Coffee-ground emesis suggests slower upper GI bleed.",
      actions: "Large-bore IVs enable rapid resuscitation. Blood products correct hemorrhagic shock. Octreotide reduces portal venous pressure. Emergent endoscopy allows band ligation or sclerotherapy. NG tube in suspected varices is controversial and may worsen bleeding. PPI is appropriate for PUD but not primary therapy for varices."
    },
    bodySystem: "Gastrointestinal",
    tier: "rpn"
  },
  {
    id: "bt_rpn_gastrointestinal_261_12",
    scenario: "A 43-year-old female presents with acute onset right lower quadrant pain that began periumbilically 12 hours ago and migrated. She reports nausea, one episode of vomiting, and anorexia. Vital signs: BP 126/78 mmHg, HR 96 bpm, RR 18/min, Temp 38.4C. McBurney's point tenderness is positive. Rovsing sign is positive. WBC 14,200/mm3.",
    centerOptions: ["Acute appendicitis","Ectopic pregnancy","Ovarian torsion","Crohn's disease flare"],
    centerCorrect: 0,
    leftFindings: ["Pain migration from periumbilical to right lower quadrant","McBurney's point tenderness","Positive Rovsing sign","Leukocytosis with left shift","Positive pregnancy test","Chronic intermittent cramping with bloody diarrhea"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Maintain NPO status","Administer IV fluids and antibiotics","Prepare patient for surgical consultation","Obtain CT abdomen/pelvis with contrast","Administer oral laxatives for constipation","Apply heating pad to abdomen for comfort"],
    rightCorrect: [0,1,2,3],
    rightSelectCount: 4,
    rationale: {
      condition: "Classic migratory pain from periumbilical to RLQ, positive McBurney's and Rovsing signs, fever, and leukocytosis strongly suggest acute appendicitis.",
      findings: "Pain migration pattern, McBurney's tenderness, positive Rovsing sign, and elevated WBC are classic appendicitis findings. Positive pregnancy test suggests ectopic pregnancy. Chronic bloody diarrhea suggests Crohn's.",
      actions: "NPO status prepares for potential surgery. IV fluids maintain hydration and antibiotics prevent peritonitis. Surgical consult is essential. CT confirms diagnosis. Laxatives are contraindicated with possible appendicitis. Heat application may increase inflammation risk."
    },
    bodySystem: "Gastrointestinal",
    tier: "rpn"
  },
  {
    id: "bt_rpn_renalurinary_262_12",
    scenario: "A 70-year-old male with a history of type 2 diabetes and chronic kidney disease (Stage 3) presents with generalized weakness, nausea, and muscle cramping. Lab results show: K+ 6.8 mEq/L, BUN 48 mg/dL, Creatinine 4.2 mg/dL, GFR 18 mL/min. ECG shows peaked T waves and widened QRS complex.",
    centerOptions: ["Severe hyperkalemia with ECG changes","Diabetic ketoacidosis","Hyponatremia","Acute renal failure"],
    centerCorrect: 0,
    leftFindings: ["Potassium 6.8 mEq/L","Peaked T waves on ECG","Widened QRS complex","Muscle weakness and cramping","Deep Kussmaul respirations","Serum sodium 118 mEq/L"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer IV calcium gluconate for cardiac membrane stabilization","Administer insulin with dextrose to shift potassium intracellularly","Place on continuous cardiac monitoring","Administer sodium polystyrene sulfonate (Kayexalate)","Administer potassium chloride supplement","Prepare for possible emergent hemodialysis"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Potassium of 6.8 mEq/L with ECG changes (peaked T waves, widened QRS) represents a cardiac emergency requiring immediate treatment to prevent fatal arrhythmia.",
      findings: "Severely elevated potassium, peaked T waves, widened QRS, and neuromuscular symptoms confirm symptomatic hyperkalemia. Kussmaul breathing is a DKA finding. Low sodium would indicate hyponatremia.",
      actions: "Calcium gluconate stabilizes cardiac membranes immediately (does not lower K+). Insulin/dextrose shifts K+ into cells. Continuous monitoring detects arrhythmias. Kayexalate removes K+ from the body. Hemodialysis is definitive treatment for refractory cases. Additional potassium is absolutely contraindicated."
    },
    bodySystem: "Renal/Urinary",
    tier: "rpn"
  },
  {
    id: "bt_rpn_endocrine_263_12",
    scenario: "A 30-year-old female with Type 1 diabetes is brought to the ED by her roommate. She has had nausea, vomiting, and abdominal pain for 2 days following a urinary tract infection. She appears dehydrated with dry mucous membranes. Vital signs: BP 96/58 mmHg, HR 118 bpm, RR 28/min deep (Kussmaul), Temp 38.1C. Labs: Blood glucose 486 mg/dL, pH 7.18, HCO3 10 mEq/L, Anion gap 24, Serum K+ 5.6 mEq/L.",
    centerOptions: ["Diabetic ketoacidosis","Hyperosmolar hyperglycemic state","Lactic acidosis","Uremic acidosis"],
    centerCorrect: 0,
    leftFindings: ["Blood glucose 486 mg/dL with metabolic acidosis","Kussmaul respirations (deep and rapid)","Elevated anion gap of 24","Type 1 diabetes with intercurrent infection","Serum osmolality greater than 320 mOsm/kg","Gradual onset over 1-2 weeks"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Initiate aggressive IV normal saline resuscitation","Begin continuous IV regular insulin infusion","Monitor serum potassium every 1-2 hours","Administer IV potassium when K+ falls below 5.3 mEq/L","Administer subcutaneous long-acting insulin immediately","Monitor blood glucose hourly"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Type 1 diabetes, severe hyperglycemia, metabolic acidosis (pH 7.18, low HCO3), elevated anion gap, and Kussmaul respirations confirm DKA triggered by infection.",
      findings: "High glucose with acidosis, Kussmaul breathing (compensatory CO2 elimination), high anion gap (ketoacids), and Type 1 DM with infection trigger are diagnostic. Osmolality greater than 320 and gradual onset are HHS features.",
      actions: "IV NS corrects severe dehydration. Continuous insulin infusion corrects hyperglycemia and halts ketogenesis. K+ monitoring is critical as insulin drives K+ intracellularly. Replace K+ when it drops below 5.3 to prevent hypokalemia. Hourly glucose monitoring guides insulin titration. SubQ long-acting insulin during acute DKA is inappropriate."
    },
    bodySystem: "Endocrine",
    tier: "rpn"
  },
  {
    id: "bt_rpn_endocrine_264_12",
    scenario: "A 56-year-old female is found unresponsive by coworkers at her office. She has a medical alert bracelet indicating Addison's disease. Vital signs: BP 72/48 mmHg, HR 130 bpm, RR 22/min, Temp 36.0C, Blood glucose 52 mg/dL. Skin appears hyperpigmented. Serum sodium is 126 mEq/L, potassium 6.1 mEq/L.",
    centerOptions: ["Adrenal crisis (acute adrenal insufficiency)","Septic shock","Hypoglycemic episode","Myxedema coma"],
    centerCorrect: 0,
    leftFindings: ["Profound hypotension refractory to fluids alone","Hypoglycemia (blood glucose 52 mg/dL)","Hyponatremia with hyperkalemia","Known Addison's disease","High fever with chills","Severe hypothermia with bradycardia"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer IV hydrocortisone 100 mg STAT","Initiate aggressive IV normal saline with dextrose","Administer IV dextrose 50% for hypoglycemia","Monitor hemodynamic status continuously","Hold all corticosteroids until cortisol level returns","Obtain random cortisol and ACTH levels before treatment if possible"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Unresponsiveness, severe hypotension, hypoglycemia, hyponatremia, hyperkalemia, and known Addison's disease are classic for adrenal crisis requiring emergent glucocorticoid replacement.",
      findings: "Refractory hypotension, hypoglycemia, electrolyte pattern (low Na, high K), and Addison's history confirm adrenal crisis. High fever suggests sepsis. Hypothermia with bradycardia suggests myxedema coma.",
      actions: "IV hydrocortisone is life-saving and must not be delayed. IV NS with dextrose corrects dehydration and hypoglycemia. D50 treats acute hypoglycemia. Continuous monitoring detects hemodynamic changes. Cortisol/ACTH levels should be drawn before treatment if it does not delay therapy. Withholding steroids is dangerous."
    },
    bodySystem: "Endocrine",
    tier: "rpn"
  },
  {
    id: "bt_rpn_hematology_265_12",
    scenario: "A 14-year-old African American male presents to the ED with severe bilateral leg pain, swollen hands, and fever. His mother reports he has sickle cell disease. Vital signs: BP 100/62 mmHg, HR 122 bpm, RR 24/min, Temp 39.2C, SpO2 91%. CBC shows Hgb 6.2 g/dL, WBC 18,400/mm3, reticulocyte count 12%.",
    centerOptions: ["Vaso-occlusive sickle cell crisis with fever","Osteomyelitis","Acute lymphoblastic leukemia","Juvenile rheumatoid arthritis"],
    centerCorrect: 0,
    leftFindings: ["Severe bilateral bone pain","Known sickle cell disease","Fever with leukocytosis","Hemoglobin 6.2 g/dL with elevated reticulocytes","Painless joint swelling without warmth","Pancytopenia with blast cells"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer IV opioid analgesics for pain management","Initiate aggressive IV fluid hydration","Obtain blood cultures before antibiotics","Administer supplemental oxygen for SpO2 below 95%","Apply cold compresses to painful areas","Prepare for possible blood transfusion"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "A child with known sickle cell disease presenting with bilateral bone pain, dactylitis, fever, anemia, and elevated reticulocytes indicates vaso-occlusive crisis with possible infection requiring urgent treatment.",
      findings: "Bilateral bone pain, sickle cell history, fever, anemia with reticulocytosis (hemolysis compensation) confirm crisis. Painless joint swelling suggests JRA. Pancytopenia with blasts suggests leukemia.",
      actions: "IV opioids address severe pain (do not undertreat sickle cell pain). IV fluids reduce blood viscosity and sickling. Blood cultures identify infection source. O2 maintains oxygenation to reduce sickling. Transfusion may be needed for severe anemia. Cold compresses are contraindicated as cold promotes sickling."
    },
    bodySystem: "Hematology",
    tier: "rpn"
  },
  {
    id: "bt_rpn_mentalhealth_266_12",
    scenario: "A 40-year-old male is brought to the psychiatric emergency department by police after being found on a bridge railing. He reports feeling hopeless for 3 months after losing his job and a recent divorce. He states he has a plan to use a firearm stored at his home. He admits to heavy alcohol use daily. He has no prior psychiatric history. Vital signs are stable.",
    centerOptions: ["Acute suicidal crisis with imminent risk","Major depressive episode without suicidality","Adjustment disorder with depressed mood","Alcohol use disorder only"],
    centerCorrect: 0,
    leftFindings: ["Verbalized specific plan with access to lethal means","Hopelessness lasting 3 months","Multiple recent psychosocial stressors (job loss, divorce)","Active heavy alcohol use (disinhibiting factor)","Reports passive thoughts without plan","Denies any intent to harm self"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Implement one-to-one continuous observation","Initiate safety planning and restrict access to lethal means","Obtain psychiatric consultation for inpatient admission","Screen for substance intoxication and withdrawal","Discharge with outpatient follow-up referral","Ensure therapeutic, non-judgmental communication"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Active suicidal ideation with a specific lethal plan (firearm), access to means, multiple risk factors (hopelessness, substance use, psychosocial stressors), and behavioral evidence (found on bridge) indicate imminent suicide risk.",
      findings: "Specific plan with access, hopelessness, stressors, and alcohol use as a disinhibitor are high-risk factors. Passive thoughts without plan and denial of intent would lower risk but are not present here.",
      actions: "One-to-one observation prevents self-harm. Safety planning addresses means restriction. Psychiatric consult evaluates for involuntary hold if needed. Substance screening identifies intoxication. Therapeutic communication builds rapport. Discharge is unsafe given imminent risk level."
    },
    bodySystem: "Mental Health",
    tier: "rpn"
  },
  {
    id: "bt_rpn_immuneinfectious_267_12",
    scenario: "A 79-year-old male nursing home resident presents with altered mental status, fever, and productive cough with rust-colored sputum for 2 days. He has a history of COPD and type 2 diabetes. Vital signs: BP 86/54 mmHg, HR 112 bpm, RR 28/min, Temp 39.4C, SpO2 86% on room air. WBC 22,600/mm3. Lactate 4.2 mmol/L. Chest X-ray shows right lower lobe consolidation.",
    centerOptions: ["Sepsis secondary to community-acquired pneumonia","COPD exacerbation","Acute heart failure","Aspiration pneumonitis"],
    centerCorrect: 0,
    leftFindings: ["Fever with productive rust-colored sputum","Hypotension with tachycardia (signs of septic shock)","Elevated lactate 4.2 mmol/L indicating tissue hypoperfusion","Right lower lobe consolidation on chest X-ray","Bilateral wheezing without consolidation","Frothy pink sputum with bilateral infiltrates"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Initiate IV broad-spectrum antibiotics within 1 hour","Administer 30 mL/kg IV crystalloid bolus","Obtain blood cultures before antibiotics if possible","Apply supplemental oxygen to target SpO2 above 94%","Administer IV corticosteroids as first-line treatment","Measure serial lactate levels to assess resuscitation adequacy"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Suspected infection (pneumonia), organ dysfunction (hypotension, altered mental status), and elevated lactate greater than 2 mmol/L meet Sepsis-3 criteria. This represents septic shock requiring the SEP-1 bundle.",
      findings: "Fever, productive cough, consolidation confirm pneumonia source. Hypotension and tachycardia indicate shock. Elevated lactate confirms tissue hypoperfusion. Wheezing without consolidation suggests COPD. Frothy pink sputum suggests heart failure.",
      actions: "Antibiotics within 1 hour reduce mortality in sepsis. Fluid bolus restores perfusion. Blood cultures guide targeted therapy. Oxygen corrects hypoxemia. Corticosteroids are not first-line for sepsis (reserved for refractory shock). Serial lactate measures guide resuscitation."
    },
    bodySystem: "Immune/Infectious",
    tier: "rpn"
  },
  {
    id: "bt_rpn_reproductivematernity_268_12",
    scenario: "A 36-year-old G2P1 at 34 weeks gestation presents with sudden onset of severe abdominal pain and vaginal bleeding. She reports the pain is constant and her abdomen feels rigid and board-like. She has a history of chronic hypertension. Vital signs: BP 168/108 mmHg, HR 120 bpm, RR 24/min. Fetal heart rate shows persistent late decelerations with decreased variability.",
    centerOptions: ["Placental abruption","Placenta previa","Uterine rupture","Preterm labor"],
    centerCorrect: 0,
    leftFindings: ["Sudden onset constant abdominal pain with rigidity","Dark red vaginal bleeding","Board-like rigid uterus on palpation","Chronic hypertension as risk factor","Painless bright red vaginal bleeding","Intermittent cramping with progressive cervical dilation"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Initiate continuous fetal monitoring","Establish two large-bore IV lines for fluid resuscitation","Prepare for emergent cesarean delivery","Type and crossmatch blood products","Perform digital cervical examination","Administer IV magnesium sulfate for seizure prophylaxis"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Sudden severe constant pain, board-like rigidity, dark bleeding, chronic HTN risk factor, and fetal distress (late decels, decreased variability) are classic for placental abruption.",
      findings: "Constant pain with rigidity (Couvelaire uterus), dark bleeding, and HTN history are hallmarks. Painless bright bleeding suggests previa. Intermittent cramping with dilation suggests preterm labor.",
      actions: "Continuous FHR monitoring detects fetal compromise. Large-bore IVs prepare for hemorrhage management. Emergent cesarean is indicated for fetal distress. Blood products address hemorrhagic shock. MgSO4 prevents eclamptic seizures with severe HTN. Digital exam is contraindicated until previa is ruled out."
    },
    bodySystem: "Reproductive/Maternity",
    tier: "rpn"
  },
  {
    id: "bt_rpn_pediatrics_269_12",
    scenario: "A 11-year-old male is brought to the ED with a barking cough, inspiratory stridor, and hoarse voice that started after a mild upper respiratory infection. His parents report the symptoms worsened tonight. He has mild substernal retractions. Vital signs: HR 120 bpm, RR 30/min, Temp 38.3C, SpO2 93%. He is sitting upright and appears anxious but alert.",
    centerOptions: ["Moderate croup (laryngotracheobronchitis)","Epiglottitis","Foreign body aspiration","Bacterial tracheitis"],
    centerCorrect: 0,
    leftFindings: ["Barking (seal-like) cough","Inspiratory stridor at rest","Preceded by upper respiratory infection","Hoarse voice with mild retractions","Sudden onset while eating with unilateral wheeze","Drooling with tripod positioning and high fever"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer nebulized racemic epinephrine","Administer oral or IM dexamethasone","Keep the child calm and in a position of comfort","Monitor for rebound stridor after epinephrine","Examine the throat with tongue depressor","Place on continuous pulse oximetry"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Barking cough, inspiratory stridor, hoarseness following URI, and age 6 months to 3 years are classic for viral croup (laryngotracheobronchitis), most commonly caused by parainfluenza virus.",
      findings: "Barking cough, stridor at rest, URI prodrome, and hoarseness with retractions confirm moderate croup. Sudden onset with eating suggests foreign body. Drooling, tripod, and high fever suggest epiglottitis.",
      actions: "Racemic epinephrine reduces subglottic edema. Dexamethasone reduces inflammation (single dose is standard). Keeping the child calm prevents worsening airway obstruction. Rebound monitoring detects recurrence after epinephrine. Pulse oximetry tracks oxygenation. Throat examination with a tongue depressor is contraindicated as it may worsen obstruction and is specifically avoided in suspected epiglottitis."
    },
    bodySystem: "Pediatrics",
    tier: "rpn"
  },
  {
    id: "bt_rpn_emergencytrauma_270_12",
    scenario: "A 42-year-old male arrives via EMS after a motorcycle collision at approximately 60 km/h. He is alert but confused. He has a large open wound on the right thigh with visible bone and significant hemorrhage. Vital signs: BP 82/50 mmHg, HR 138 bpm, RR 28/min, SpO2 94%. He is pale, cool, and diaphoretic. Estimated blood loss is greater than 1,500 mL.",
    centerOptions: ["Hemorrhagic shock (Class III-IV)","Neurogenic shock","Cardiogenic shock","Tension pneumothorax"],
    centerCorrect: 0,
    leftFindings: ["Tachycardia with hypotension","Pale, cool, diaphoretic skin","Open fracture with greater than 1,500 mL estimated blood loss","Altered mental status (confusion)","Warm, flushed skin with bradycardia","Distended neck veins with tracheal deviation"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Apply direct pressure and tourniquet to hemorrhaging extremity","Initiate massive transfusion protocol","Establish two large-bore IV lines with warmed fluids","Perform primary survey using ABCDE approach","Elevate the injured extremity above heart level only","Obtain type and crossmatch and administer blood products"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Tachycardia, hypotension, altered mental status, cool/pale/diaphoretic skin, and estimated blood loss greater than 1,500 mL in a trauma patient indicate Class III-IV hemorrhagic shock.",
      findings: "Tachycardia, hypotension, cool diaphoretic skin, and AMS with significant blood loss are classic hemorrhagic shock findings. Warm flushed skin with bradycardia suggests neurogenic shock. Distended neck veins with tracheal deviation suggests tension pneumothorax.",
      actions: "Direct pressure and tourniquet control active hemorrhage. Massive transfusion protocol provides balanced blood product resuscitation. Large-bore IVs enable rapid volume replacement. ABCDE primary survey ensures systematic assessment. Blood products restore oxygen-carrying capacity. Elevation alone is insufficient for active hemorrhage of this magnitude."
    },
    bodySystem: "Emergency/Trauma",
    tier: "rpn"
  },
  {
    id: "bt_rpn_musculoskeletal_271_12",
    scenario: "A 27-year-old male presents 6 hours after a tibial fracture reduction and casting. He reports increasing severe pain in his lower leg that is not relieved by prescribed opioids. Pain worsens with passive dorsiflexion of the toes. His leg feels tight and tense. Capillary refill is 4 seconds. He reports tingling and numbness in his toes.",
    centerOptions: ["Compartment syndrome","Deep vein thrombosis","Fat embolism syndrome","Cellulitis"],
    centerCorrect: 0,
    leftFindings: ["Pain out of proportion to injury not relieved by analgesics","Pain with passive stretch (dorsiflexion)","Paresthesia (tingling and numbness)","Tense and swollen compartment","Warmth and erythema along the vein","Petechial rash with confusion"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Notify surgeon immediately for possible fasciotomy","Remove or bivalve the cast immediately","Elevate the limb to heart level only (not above)","Monitor neurovascular status every 15-30 minutes","Apply compression bandage to reduce swelling","Measure compartment pressures if available"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "The 5 Ps of compartment syndrome: Pain out of proportion, Pain with passive stretch, Paresthesia, Pressure (tense compartment), and delayed capillary refill indicate a surgical emergency.",
      findings: "Disproportionate pain, pain with passive stretch, paresthesia, and tense compartment are classic. Warmth along a vein suggests DVT. Petechial rash with confusion suggests fat embolism.",
      actions: "Surgical fasciotomy is definitive treatment. Cast removal releases external pressure. Elevate to heart level (not above, which could worsen ischemia). Frequent neurovascular checks track progression. Compartment pressure measurement confirms diagnosis. Compression is contraindicated as it increases compartment pressure."
    },
    bodySystem: "Musculoskeletal",
    tier: "rpn"
  },
  {
    id: "bt_rpn_integumentary_272_12",
    scenario: "A 53-year-old male is admitted to the burn unit after a house fire with estimated 35% TBSA second and third degree burns to his chest, bilateral arms, and face. He was in an enclosed space with smoke exposure. His voice is hoarse and he has singed nasal hairs. Vital signs: BP 102/64 mmHg, HR 124 bpm, RR 26/min, SpO2 92%. He weighs 80 kg.",
    centerOptions: ["Major thermal burn with inhalation injury","Superficial burn requiring outpatient care","Chemical burn exposure","Electrical burn injury"],
    centerCorrect: 0,
    leftFindings: ["35% TBSA second and third degree burns","Hoarse voice with singed nasal hairs (inhalation injury signs)","Enclosed space fire exposure","Facial burns present","Burns limited to extremities only","Entry and exit wounds visible"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Initiate Parkland formula fluid resuscitation (4 mL x kg x %TBSA)","Prepare for early intubation due to inhalation injury signs","Obtain carboxyhemoglobin level","Monitor urine output target 0.5-1 mL/kg/hr","Apply ice directly to burn wounds","Administer tetanus prophylaxis if not current"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Greater than 20% TBSA burns with facial involvement, hoarse voice, singed nasal hairs, and enclosed space exposure indicate major burns with high suspicion for inhalation injury.",
      findings: "35% TBSA, hoarseness, singed nasal hairs, enclosed space, and facial burns are classic for inhalation injury. Burns limited to extremities without airway signs lower risk. Entry/exit wounds suggest electrical injury.",
      actions: "Parkland formula guides crystalloid resuscitation (half in first 8 hours). Early intubation protects airway before edema progresses. Carboxyhemoglobin detects CO poisoning. Urine output guides fluid adequacy. Tetanus prophylaxis prevents infection. Ice is contraindicated as it causes vasoconstriction and worsens tissue damage."
    },
    bodySystem: "Integumentary",
    tier: "rpn"
  },
  {
    id: "bt_rpn_cardiovascular_273_13",
    scenario: "A 66-year-old male with a history of hypertension presents to the emergency department with crushing substernal chest pain radiating to the left arm and jaw. He is diaphoretic and nauseated. Vital signs: BP 158/94 mmHg, HR 102 bpm, RR 22/min, SpO2 94% on room air. ECG shows ST-segment elevation in leads II, III, and aVF.",
    centerOptions: ["Inferior ST-elevation myocardial infarction","Unstable angina","Aortic dissection","Pulmonary embolism"],
    centerCorrect: 0,
    leftFindings: ["ST-elevation in leads II, III, aVF","Crushing substernal chest pain radiating to left arm","Diaphoresis and nausea","Elevated troponin levels expected","Normal chest X-ray findings","Bilateral equal blood pressures"],
    leftCorrect: [0,1,2],
    leftSelectCount: 3,
    rightActions: ["Administer aspirin 325 mg chewed immediately","Activate cardiac catheterization lab","Administer morphine for pain if not hypotensive","Administer thrombolytics without ECG confirmation","Obtain serial troponin levels","Discharge with follow-up appointment"],
    rightCorrect: [0,1,4],
    rightSelectCount: 3,
    rationale: {
      condition: "ST-elevation in inferior leads (II, III, aVF) with classic symptoms of crushing chest pain, diaphoresis, and nausea indicates an inferior STEMI requiring emergent intervention.",
      findings: "ST-elevation in inferior leads, crushing substernal pain radiating to the arm, and diaphoresis are hallmark findings of acute MI. Normal chest X-ray and bilateral equal BPs help rule out aortic dissection.",
      actions: "Aspirin inhibits platelet aggregation and is first-line. Cardiac catheterization lab activation enables primary PCI. Serial troponins confirm myocardial injury. Thrombolytics without ECG confirmation is inappropriate, and discharge is unsafe."
    },
    bodySystem: "Cardiovascular",
    tier: "rpn"
  },
  {
    id: "bt_rpn_cardiovascular_274_13",
    scenario: "A 70-year-old female with a history of atrial fibrillation and heart failure presents with increasing dyspnea, orthopnea, and bilateral lower extremity edema over 3 days. She reports sleeping on 3 pillows. Vital signs: BP 142/88 mmHg, HR 112 bpm irregular, RR 28/min, SpO2 88% on room air. Auscultation reveals bilateral crackles and an S3 gallop. BNP is 1,240 pg/mL.",
    centerOptions: ["Acute decompensated heart failure","Community-acquired pneumonia","Chronic obstructive pulmonary disease exacerbation","Pleural effusion"],
    centerCorrect: 0,
    leftFindings: ["Bilateral crackles with S3 gallop","Orthopnea requiring 3-pillow elevation","BNP 1,240 pg/mL","Bilateral lower extremity edema","Productive cough with green sputum","Barrel chest with prolonged expiration"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer IV furosemide as ordered","Position in high Fowler's position","Apply supplemental oxygen to maintain SpO2 above 94%","Encourage increased oral fluid intake","Monitor strict intake and output","Administer IV normal saline bolus"],
    rightCorrect: [0,1,2,4],
    rightSelectCount: 4,
    rationale: {
      condition: "Bilateral crackles, S3 gallop, orthopnea, peripheral edema, and markedly elevated BNP (greater than 400 pg/mL) are classic findings of acute decompensated heart failure.",
      findings: "S3 gallop indicates volume overload. Orthopnea and elevated BNP confirm fluid status. Bilateral edema reflects right-sided congestion. Green sputum and barrel chest are distractors suggesting pneumonia and COPD respectively.",
      actions: "IV furosemide promotes diuresis. High Fowler's reduces preload and improves breathing. Oxygen treats hypoxemia. Strict I&O monitors fluid balance. Increased fluids and saline bolus would worsen volume overload."
    },
    bodySystem: "Cardiovascular",
    tier: "rpn"
  },
  {
    id: "bt_rpn_cardiovascular_275_13",
    scenario: "A 53-year-old male with uncontrolled hypertension presents with sudden onset of severe tearing chest pain radiating to the back between the scapulae. He appears anxious and diaphoretic. Vital signs: Right arm BP 182/110 mmHg, Left arm BP 148/90 mmHg, HR 118 bpm, RR 24/min. Chest X-ray shows widened mediastinum.",
    centerOptions: ["Aortic dissection","Myocardial infarction","Tension pneumothorax","Esophageal rupture"],
    centerCorrect: 0,
    leftFindings: ["Tearing chest pain radiating to the back","Blood pressure differential between arms greater than 20 mmHg","Widened mediastinum on chest X-ray","History of uncontrolled hypertension","ST-elevation on ECG","Subcutaneous emphysema"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer IV beta-blocker to reduce heart rate and BP","Obtain emergent CT angiography","Prepare for possible surgical intervention","Administer thrombolytics immediately","Establish two large-bore IV lines","Administer aspirin 325 mg"],
    rightCorrect: [0,1,2,4],
    rightSelectCount: 4,
    rationale: {
      condition: "Sudden tearing chest pain radiating to the back, blood pressure differential greater than 20 mmHg between arms, and widened mediastinum are classic for aortic dissection.",
      findings: "Tearing pain to the back, BP differential, widened mediastinum, and uncontrolled HTN history are hallmark findings. ST-elevation suggests MI, and subcutaneous emphysema suggests esophageal rupture.",
      actions: "IV beta-blockers control heart rate and shear stress. CT angiography confirms diagnosis. Surgical prep is essential. Large-bore IVs allow resuscitation. Thrombolytics and aspirin are absolutely contraindicated as they would worsen hemorrhage."
    },
    bodySystem: "Cardiovascular",
    tier: "rpn"
  },
  {
    id: "bt_rpn_respiratory_276_13",
    scenario: "A 40-year-old female with a history of asthma presents to the emergency department with severe dyspnea, audible wheezing, and inability to speak in full sentences. She has used her albuterol inhaler 8 times today without relief. Vital signs: BP 138/82 mmHg, HR 124 bpm, RR 32/min, SpO2 87% on room air. Peak flow is 120 L/min (predicted 380 L/min).",
    centerOptions: ["Severe acute asthma exacerbation (status asthmaticus)","Chronic obstructive pulmonary disease exacerbation","Anaphylaxis","Spontaneous pneumothorax"],
    centerCorrect: 0,
    leftFindings: ["Inability to speak in full sentences","Peak flow less than 33% of predicted","SpO2 87% on room air","No relief from repeated albuterol use","Inspiratory stridor","Unilateral absent breath sounds"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer continuous nebulized albuterol","Administer IV corticosteroids (methylprednisolone)","Prepare for possible intubation","Administer ipratropium bromide nebulization","Discharge with oral prednisone taper","Apply high-flow supplemental oxygen"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Severe dyspnea with inability to speak in full sentences, peak flow below 33% predicted, refractory to beta-agonist therapy, and hypoxemia indicate status asthmaticus requiring aggressive treatment.",
      findings: "Inability to speak in sentences, severely reduced peak flow, hypoxemia, and albuterol resistance are hallmarks of severe exacerbation. Stridor suggests upper airway obstruction, and unilateral absent sounds suggest pneumothorax.",
      actions: "Continuous nebulized albuterol provides sustained bronchodilation. IV steroids reduce inflammation. Intubation preparation ensures airway protection. Ipratropium provides additional bronchodilation. High-flow oxygen treats hypoxemia. Discharge is inappropriate for this severity."
    },
    bodySystem: "Respiratory",
    tier: "rpn"
  },
  {
    id: "bt_rpn_respiratory_277_13",
    scenario: "A 61-year-old male, 4 days post total hip replacement, suddenly develops sharp pleuritic chest pain, dyspnea, and hemoptysis. He is tachycardic and anxious. Vital signs: BP 110/70 mmHg, HR 118 bpm, RR 28/min, SpO2 89% on room air. D-dimer is 2,400 ng/mL. CT pulmonary angiography reveals a filling defect in the right main pulmonary artery.",
    centerOptions: ["Pulmonary embolism","Hospital-acquired pneumonia","Fat embolism syndrome","Acute coronary syndrome"],
    centerCorrect: 0,
    leftFindings: ["Pleuritic chest pain with hemoptysis","Recent surgical procedure with immobility","D-dimer 2,400 ng/mL","CT showing filling defect in pulmonary artery","Petechial rash on chest and axillae","Productive cough with purulent sputum"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Initiate anticoagulation with IV heparin","Apply supplemental oxygen","Elevate the head of bed","Prepare for thrombolysis if hemodynamically unstable","Encourage early ambulation without restrictions","Monitor for signs of right ventricular failure"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Pleuritic chest pain, hemoptysis, tachycardia, and hypoxemia in a postoperative patient with elevated D-dimer and CT-confirmed filling defect confirm pulmonary embolism.",
      findings: "Pleuritic pain with hemoptysis, surgical immobility risk factor, markedly elevated D-dimer, and CT angiography findings are diagnostic. Petechial rash suggests fat embolism; purulent sputum suggests pneumonia.",
      actions: "IV heparin prevents clot propagation. Oxygen treats hypoxemia. Head elevation improves ventilation. Thrombolysis is reserved for massive PE with hemodynamic instability. Monitoring for RV failure detects deterioration. Unrestricted ambulation could dislodge further emboli."
    },
    bodySystem: "Respiratory",
    tier: "rpn"
  },
  {
    id: "bt_rpn_respiratory_278_13",
    scenario: "A 56-year-old male with a 40-pack-year smoking history presents with worsening dyspnea, increased sputum production with yellow-green color, and low-grade fever for 3 days. He uses home oxygen at 2 L/min. Vital signs: BP 136/82 mmHg, HR 98 bpm, RR 26/min, SpO2 85% on 2 L/min NC, Temp 38.2C. ABG: pH 7.31, PaCO2 58 mmHg, PaO2 52 mmHg, HCO3 28 mEq/L.",
    centerOptions: ["Acute exacerbation of COPD","Community-acquired pneumonia","Acute asthma attack","Pulmonary fibrosis"],
    centerCorrect: 0,
    leftFindings: ["40-pack-year smoking history with chronic dyspnea","Increased purulent sputum production","Compensated respiratory acidosis on ABG","Hypoxemia despite home oxygen","No wheezing or reversible obstruction","Bilateral fine inspiratory crackles only"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Increase oxygen to maintain SpO2 88-92%","Administer short-acting bronchodilator nebulization","Administer systemic corticosteroids","Start antibiotics for infectious exacerbation","Administer high-flow oxygen to achieve SpO2 100%","Monitor for CO2 narcosis and worsening respiratory acidosis"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "A COPD patient with worsening dyspnea, increased purulent sputum, fever, and compensated respiratory acidosis with chronic CO2 retention meets criteria for acute COPD exacerbation.",
      findings: "Smoking history, baseline dyspnea, purulent sputum increase, and ABG showing compensated respiratory acidosis (elevated PaCO2 with elevated HCO3) confirm chronic CO2 retention with acute worsening.",
      actions: "Target SpO2 88-92% to avoid suppressing hypoxic drive. Bronchodilators relieve airflow obstruction. Steroids reduce inflammation. Antibiotics treat infectious trigger. High-flow O2 to 100% risks CO2 narcosis. Monitoring respiratory status is essential."
    },
    bodySystem: "Respiratory",
    tier: "rpn"
  },
  {
    id: "bt_rpn_neurological_279_13",
    scenario: "A 72-year-old male is brought to the emergency department by his wife who noticed sudden onset of right-sided facial droop, right arm weakness, and slurred speech 45 minutes ago. He has a history of atrial fibrillation and takes warfarin irregularly. Vital signs: BP 178/96 mmHg, HR 88 bpm irregular, RR 18/min, SpO2 97%. NIHSS score is 14. CT head shows no hemorrhage.",
    centerOptions: ["Acute ischemic stroke","Hemorrhagic stroke","Transient ischemic attack","Bell's palsy"],
    centerCorrect: 0,
    leftFindings: ["Sudden right-sided facial droop and arm weakness","Slurred speech (dysarthria)","History of atrial fibrillation","CT head negative for hemorrhage","NIHSS score of 14","Gradual bilateral facial weakness"],
    leftCorrect: [0,1,2,3,4],
    leftSelectCount: 5,
    rightActions: ["Determine eligibility for IV alteplase (tPA) within window","Obtain STAT INR and coagulation studies","Maintain blood pressure below 185/110 mmHg if thrombolysis candidate","Administer aspirin 325 mg immediately before imaging","Perform neurological assessments every 15 minutes","Position head of bed flat if no increased ICP"],
    rightCorrect: [0,1,2,4,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Sudden onset focal neurological deficits (facial droop, arm weakness, dysarthria) with negative CT for hemorrhage and atrial fibrillation as embolic source confirms acute ischemic stroke.",
      findings: "Sudden unilateral deficits, dysarthria, A-fib history, negative CT, and elevated NIHSS are classic. Gradual bilateral weakness suggests other diagnoses like myasthenia gravis.",
      actions: "tPA eligibility assessment is time-critical (within 4.5 hours). INR is essential since the patient takes warfarin (tPA contraindicated if INR greater than 1.7). BP management enables safe thrombolysis. Frequent neuro checks detect deterioration. Flat HOB improves cerebral perfusion. Aspirin before imaging is contraindicated as hemorrhage must be ruled out first."
    },
    bodySystem: "Neurological",
    tier: "rpn"
  },
  {
    id: "bt_rpn_neurological_280_13",
    scenario: "A 26-year-old female presents with severe headache described as the worst headache of my life, sudden onset while exercising. She reports neck stiffness and photophobia. Vital signs: BP 168/94 mmHg, HR 92 bpm, RR 18/min, Temp 37.8C. Neurological exam reveals nuchal rigidity. CT head is negative.",
    centerOptions: ["Subarachnoid hemorrhage","Tension headache","Meningitis","Migraine with aura"],
    centerCorrect: 0,
    leftFindings: ["Thunderclap headache - worst headache of life","Sudden onset during physical exertion","Nuchal rigidity on examination","Photophobia","Gradual onset over several hours","Aura with visual scotoma preceding headache"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Perform lumbar puncture to assess for xanthochromia","Order CT angiography to identify aneurysm","Maintain strict bed rest with dim lighting","Administer IV nimodipine to prevent vasospasm","Discharge with analgesics if CT is negative","Initiate seizure precautions"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Thunderclap headache with sudden onset during exertion, nuchal rigidity, and photophobia are classic for subarachnoid hemorrhage even with a negative CT (sensitivity decreases after 6 hours).",
      findings: "Worst headache of life with sudden onset, exertional trigger, nuchal rigidity, and photophobia strongly suggest SAH. Gradual onset and visual aura are migraine features.",
      actions: "Lumbar puncture after negative CT detects xanthochromia (blood breakdown products). CTA identifies the bleeding source. Bed rest reduces rebleeding risk. Nimodipine prevents cerebral vasospasm. Seizure precautions prevent further injury. Discharge without LP is unsafe."
    },
    bodySystem: "Neurological",
    tier: "rpn"
  },
  {
    id: "bt_rpn_gastrointestinal_281_13",
    scenario: "A 43-year-old male with a history of alcohol use disorder presents with hematemesis of approximately 500 mL of bright red blood. He appears pale, anxious, and diaphoretic. Vital signs: BP 88/52 mmHg, HR 128 bpm, RR 24/min, SpO2 96%. Abdomen is distended with a fluid wave. He has spider angiomata on his chest and palmar erythema.",
    centerOptions: ["Esophageal variceal hemorrhage","Peptic ulcer disease bleeding","Mallory-Weiss tear","Gastric carcinoma"],
    centerCorrect: 0,
    leftFindings: ["Large-volume hematemesis with bright red blood","Signs of portal hypertension (ascites, spider angiomata)","Hemodynamic instability (hypotension, tachycardia)","History of alcohol use disorder","Epigastric pain relieved by eating","Coffee-ground emesis with melena only"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Establish two large-bore IV lines for volume resuscitation","Type and crossmatch for packed red blood cells","Administer IV octreotide to reduce portal pressure","Prepare for emergent endoscopy","Insert nasogastric tube for gastric lavage first","Administer IV proton pump inhibitor"],
    rightCorrect: [0,1,2,3],
    rightSelectCount: 4,
    rationale: {
      condition: "Large-volume hematemesis in a patient with alcohol use disorder and signs of portal hypertension (ascites, spider angiomata, palmar erythema) is consistent with esophageal variceal bleeding.",
      findings: "Bright red hematemesis, portal hypertension signs, hemodynamic instability, and alcohol history point to variceal hemorrhage. Epigastric pain relieved by eating suggests PUD. Coffee-ground emesis suggests slower upper GI bleed.",
      actions: "Large-bore IVs enable rapid resuscitation. Blood products correct hemorrhagic shock. Octreotide reduces portal venous pressure. Emergent endoscopy allows band ligation or sclerotherapy. NG tube in suspected varices is controversial and may worsen bleeding. PPI is appropriate for PUD but not primary therapy for varices."
    },
    bodySystem: "Gastrointestinal",
    tier: "rpn"
  },
  {
    id: "bt_rpn_gastrointestinal_282_13",
    scenario: "A 33-year-old female presents with acute onset right lower quadrant pain that began periumbilically 12 hours ago and migrated. She reports nausea, one episode of vomiting, and anorexia. Vital signs: BP 126/78 mmHg, HR 96 bpm, RR 18/min, Temp 38.4C. McBurney's point tenderness is positive. Rovsing sign is positive. WBC 14,200/mm3.",
    centerOptions: ["Acute appendicitis","Ectopic pregnancy","Ovarian torsion","Crohn's disease flare"],
    centerCorrect: 0,
    leftFindings: ["Pain migration from periumbilical to right lower quadrant","McBurney's point tenderness","Positive Rovsing sign","Leukocytosis with left shift","Positive pregnancy test","Chronic intermittent cramping with bloody diarrhea"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Maintain NPO status","Administer IV fluids and antibiotics","Prepare patient for surgical consultation","Obtain CT abdomen/pelvis with contrast","Administer oral laxatives for constipation","Apply heating pad to abdomen for comfort"],
    rightCorrect: [0,1,2,3],
    rightSelectCount: 4,
    rationale: {
      condition: "Classic migratory pain from periumbilical to RLQ, positive McBurney's and Rovsing signs, fever, and leukocytosis strongly suggest acute appendicitis.",
      findings: "Pain migration pattern, McBurney's tenderness, positive Rovsing sign, and elevated WBC are classic appendicitis findings. Positive pregnancy test suggests ectopic pregnancy. Chronic bloody diarrhea suggests Crohn's.",
      actions: "NPO status prepares for potential surgery. IV fluids maintain hydration and antibiotics prevent peritonitis. Surgical consult is essential. CT confirms diagnosis. Laxatives are contraindicated with possible appendicitis. Heat application may increase inflammation risk."
    },
    bodySystem: "Gastrointestinal",
    tier: "rpn"
  },
  {
    id: "bt_rpn_renalurinary_283_13",
    scenario: "A 60-year-old male with a history of type 2 diabetes and chronic kidney disease (Stage 3) presents with generalized weakness, nausea, and muscle cramping. Lab results show: K+ 6.8 mEq/L, BUN 48 mg/dL, Creatinine 4.2 mg/dL, GFR 18 mL/min. ECG shows peaked T waves and widened QRS complex.",
    centerOptions: ["Severe hyperkalemia with ECG changes","Diabetic ketoacidosis","Hyponatremia","Acute renal failure"],
    centerCorrect: 0,
    leftFindings: ["Potassium 6.8 mEq/L","Peaked T waves on ECG","Widened QRS complex","Muscle weakness and cramping","Deep Kussmaul respirations","Serum sodium 118 mEq/L"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer IV calcium gluconate for cardiac membrane stabilization","Administer insulin with dextrose to shift potassium intracellularly","Place on continuous cardiac monitoring","Administer sodium polystyrene sulfonate (Kayexalate)","Administer potassium chloride supplement","Prepare for possible emergent hemodialysis"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Potassium of 6.8 mEq/L with ECG changes (peaked T waves, widened QRS) represents a cardiac emergency requiring immediate treatment to prevent fatal arrhythmia.",
      findings: "Severely elevated potassium, peaked T waves, widened QRS, and neuromuscular symptoms confirm symptomatic hyperkalemia. Kussmaul breathing is a DKA finding. Low sodium would indicate hyponatremia.",
      actions: "Calcium gluconate stabilizes cardiac membranes immediately (does not lower K+). Insulin/dextrose shifts K+ into cells. Continuous monitoring detects arrhythmias. Kayexalate removes K+ from the body. Hemodialysis is definitive treatment for refractory cases. Additional potassium is absolutely contraindicated."
    },
    bodySystem: "Renal/Urinary",
    tier: "rpn"
  },
  {
    id: "bt_rpn_endocrine_284_13",
    scenario: "A 20-year-old female with Type 1 diabetes is brought to the ED by her roommate. She has had nausea, vomiting, and abdominal pain for 2 days following a urinary tract infection. She appears dehydrated with dry mucous membranes. Vital signs: BP 96/58 mmHg, HR 118 bpm, RR 28/min deep (Kussmaul), Temp 38.1C. Labs: Blood glucose 486 mg/dL, pH 7.18, HCO3 10 mEq/L, Anion gap 24, Serum K+ 5.6 mEq/L.",
    centerOptions: ["Diabetic ketoacidosis","Hyperosmolar hyperglycemic state","Lactic acidosis","Uremic acidosis"],
    centerCorrect: 0,
    leftFindings: ["Blood glucose 486 mg/dL with metabolic acidosis","Kussmaul respirations (deep and rapid)","Elevated anion gap of 24","Type 1 diabetes with intercurrent infection","Serum osmolality greater than 320 mOsm/kg","Gradual onset over 1-2 weeks"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Initiate aggressive IV normal saline resuscitation","Begin continuous IV regular insulin infusion","Monitor serum potassium every 1-2 hours","Administer IV potassium when K+ falls below 5.3 mEq/L","Administer subcutaneous long-acting insulin immediately","Monitor blood glucose hourly"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Type 1 diabetes, severe hyperglycemia, metabolic acidosis (pH 7.18, low HCO3), elevated anion gap, and Kussmaul respirations confirm DKA triggered by infection.",
      findings: "High glucose with acidosis, Kussmaul breathing (compensatory CO2 elimination), high anion gap (ketoacids), and Type 1 DM with infection trigger are diagnostic. Osmolality greater than 320 and gradual onset are HHS features.",
      actions: "IV NS corrects severe dehydration. Continuous insulin infusion corrects hyperglycemia and halts ketogenesis. K+ monitoring is critical as insulin drives K+ intracellularly. Replace K+ when it drops below 5.3 to prevent hypokalemia. Hourly glucose monitoring guides insulin titration. SubQ long-acting insulin during acute DKA is inappropriate."
    },
    bodySystem: "Endocrine",
    tier: "rpn"
  },
  {
    id: "bt_rpn_endocrine_285_13",
    scenario: "A 46-year-old female is found unresponsive by coworkers at her office. She has a medical alert bracelet indicating Addison's disease. Vital signs: BP 72/48 mmHg, HR 130 bpm, RR 22/min, Temp 36.0C, Blood glucose 52 mg/dL. Skin appears hyperpigmented. Serum sodium is 126 mEq/L, potassium 6.1 mEq/L.",
    centerOptions: ["Adrenal crisis (acute adrenal insufficiency)","Septic shock","Hypoglycemic episode","Myxedema coma"],
    centerCorrect: 0,
    leftFindings: ["Profound hypotension refractory to fluids alone","Hypoglycemia (blood glucose 52 mg/dL)","Hyponatremia with hyperkalemia","Known Addison's disease","High fever with chills","Severe hypothermia with bradycardia"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer IV hydrocortisone 100 mg STAT","Initiate aggressive IV normal saline with dextrose","Administer IV dextrose 50% for hypoglycemia","Monitor hemodynamic status continuously","Hold all corticosteroids until cortisol level returns","Obtain random cortisol and ACTH levels before treatment if possible"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Unresponsiveness, severe hypotension, hypoglycemia, hyponatremia, hyperkalemia, and known Addison's disease are classic for adrenal crisis requiring emergent glucocorticoid replacement.",
      findings: "Refractory hypotension, hypoglycemia, electrolyte pattern (low Na, high K), and Addison's history confirm adrenal crisis. High fever suggests sepsis. Hypothermia with bradycardia suggests myxedema coma.",
      actions: "IV hydrocortisone is life-saving and must not be delayed. IV NS with dextrose corrects dehydration and hypoglycemia. D50 treats acute hypoglycemia. Continuous monitoring detects hemodynamic changes. Cortisol/ACTH levels should be drawn before treatment if it does not delay therapy. Withholding steroids is dangerous."
    },
    bodySystem: "Endocrine",
    tier: "rpn"
  },
  {
    id: "bt_rpn_hematology_286_13",
    scenario: "A 4-year-old African American male presents to the ED with severe bilateral leg pain, swollen hands, and fever. His mother reports he has sickle cell disease. Vital signs: BP 100/62 mmHg, HR 122 bpm, RR 24/min, Temp 39.2C, SpO2 91%. CBC shows Hgb 6.2 g/dL, WBC 18,400/mm3, reticulocyte count 12%.",
    centerOptions: ["Vaso-occlusive sickle cell crisis with fever","Osteomyelitis","Acute lymphoblastic leukemia","Juvenile rheumatoid arthritis"],
    centerCorrect: 0,
    leftFindings: ["Severe bilateral bone pain","Known sickle cell disease","Fever with leukocytosis","Hemoglobin 6.2 g/dL with elevated reticulocytes","Painless joint swelling without warmth","Pancytopenia with blast cells"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer IV opioid analgesics for pain management","Initiate aggressive IV fluid hydration","Obtain blood cultures before antibiotics","Administer supplemental oxygen for SpO2 below 95%","Apply cold compresses to painful areas","Prepare for possible blood transfusion"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "A child with known sickle cell disease presenting with bilateral bone pain, dactylitis, fever, anemia, and elevated reticulocytes indicates vaso-occlusive crisis with possible infection requiring urgent treatment.",
      findings: "Bilateral bone pain, sickle cell history, fever, anemia with reticulocytosis (hemolysis compensation) confirm crisis. Painless joint swelling suggests JRA. Pancytopenia with blasts suggests leukemia.",
      actions: "IV opioids address severe pain (do not undertreat sickle cell pain). IV fluids reduce blood viscosity and sickling. Blood cultures identify infection source. O2 maintains oxygenation to reduce sickling. Transfusion may be needed for severe anemia. Cold compresses are contraindicated as cold promotes sickling."
    },
    bodySystem: "Hematology",
    tier: "rpn"
  },
  {
    id: "bt_rpn_mentalhealth_287_13",
    scenario: "A 30-year-old male is brought to the psychiatric emergency department by police after being found on a bridge railing. He reports feeling hopeless for 3 months after losing his job and a recent divorce. He states he has a plan to use a firearm stored at his home. He admits to heavy alcohol use daily. He has no prior psychiatric history. Vital signs are stable.",
    centerOptions: ["Acute suicidal crisis with imminent risk","Major depressive episode without suicidality","Adjustment disorder with depressed mood","Alcohol use disorder only"],
    centerCorrect: 0,
    leftFindings: ["Verbalized specific plan with access to lethal means","Hopelessness lasting 3 months","Multiple recent psychosocial stressors (job loss, divorce)","Active heavy alcohol use (disinhibiting factor)","Reports passive thoughts without plan","Denies any intent to harm self"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Implement one-to-one continuous observation","Initiate safety planning and restrict access to lethal means","Obtain psychiatric consultation for inpatient admission","Screen for substance intoxication and withdrawal","Discharge with outpatient follow-up referral","Ensure therapeutic, non-judgmental communication"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Active suicidal ideation with a specific lethal plan (firearm), access to means, multiple risk factors (hopelessness, substance use, psychosocial stressors), and behavioral evidence (found on bridge) indicate imminent suicide risk.",
      findings: "Specific plan with access, hopelessness, stressors, and alcohol use as a disinhibitor are high-risk factors. Passive thoughts without plan and denial of intent would lower risk but are not present here.",
      actions: "One-to-one observation prevents self-harm. Safety planning addresses means restriction. Psychiatric consult evaluates for involuntary hold if needed. Substance screening identifies intoxication. Therapeutic communication builds rapport. Discharge is unsafe given imminent risk level."
    },
    bodySystem: "Mental Health",
    tier: "rpn"
  },
  {
    id: "bt_rpn_immuneinfectious_288_13",
    scenario: "A 69-year-old male nursing home resident presents with altered mental status, fever, and productive cough with rust-colored sputum for 2 days. He has a history of COPD and type 2 diabetes. Vital signs: BP 86/54 mmHg, HR 112 bpm, RR 28/min, Temp 39.4C, SpO2 86% on room air. WBC 22,600/mm3. Lactate 4.2 mmol/L. Chest X-ray shows right lower lobe consolidation.",
    centerOptions: ["Sepsis secondary to community-acquired pneumonia","COPD exacerbation","Acute heart failure","Aspiration pneumonitis"],
    centerCorrect: 0,
    leftFindings: ["Fever with productive rust-colored sputum","Hypotension with tachycardia (signs of septic shock)","Elevated lactate 4.2 mmol/L indicating tissue hypoperfusion","Right lower lobe consolidation on chest X-ray","Bilateral wheezing without consolidation","Frothy pink sputum with bilateral infiltrates"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Initiate IV broad-spectrum antibiotics within 1 hour","Administer 30 mL/kg IV crystalloid bolus","Obtain blood cultures before antibiotics if possible","Apply supplemental oxygen to target SpO2 above 94%","Administer IV corticosteroids as first-line treatment","Measure serial lactate levels to assess resuscitation adequacy"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Suspected infection (pneumonia), organ dysfunction (hypotension, altered mental status), and elevated lactate greater than 2 mmol/L meet Sepsis-3 criteria. This represents septic shock requiring the SEP-1 bundle.",
      findings: "Fever, productive cough, consolidation confirm pneumonia source. Hypotension and tachycardia indicate shock. Elevated lactate confirms tissue hypoperfusion. Wheezing without consolidation suggests COPD. Frothy pink sputum suggests heart failure.",
      actions: "Antibiotics within 1 hour reduce mortality in sepsis. Fluid bolus restores perfusion. Blood cultures guide targeted therapy. Oxygen corrects hypoxemia. Corticosteroids are not first-line for sepsis (reserved for refractory shock). Serial lactate measures guide resuscitation."
    },
    bodySystem: "Immune/Infectious",
    tier: "rpn"
  },
  {
    id: "bt_rpn_reproductivematernity_289_13",
    scenario: "A 26-year-old G2P1 at 34 weeks gestation presents with sudden onset of severe abdominal pain and vaginal bleeding. She reports the pain is constant and her abdomen feels rigid and board-like. She has a history of chronic hypertension. Vital signs: BP 168/108 mmHg, HR 120 bpm, RR 24/min. Fetal heart rate shows persistent late decelerations with decreased variability.",
    centerOptions: ["Placental abruption","Placenta previa","Uterine rupture","Preterm labor"],
    centerCorrect: 0,
    leftFindings: ["Sudden onset constant abdominal pain with rigidity","Dark red vaginal bleeding","Board-like rigid uterus on palpation","Chronic hypertension as risk factor","Painless bright red vaginal bleeding","Intermittent cramping with progressive cervical dilation"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Initiate continuous fetal monitoring","Establish two large-bore IV lines for fluid resuscitation","Prepare for emergent cesarean delivery","Type and crossmatch blood products","Perform digital cervical examination","Administer IV magnesium sulfate for seizure prophylaxis"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Sudden severe constant pain, board-like rigidity, dark bleeding, chronic HTN risk factor, and fetal distress (late decels, decreased variability) are classic for placental abruption.",
      findings: "Constant pain with rigidity (Couvelaire uterus), dark bleeding, and HTN history are hallmarks. Painless bright bleeding suggests previa. Intermittent cramping with dilation suggests preterm labor.",
      actions: "Continuous FHR monitoring detects fetal compromise. Large-bore IVs prepare for hemorrhage management. Emergent cesarean is indicated for fetal distress. Blood products address hemorrhagic shock. MgSO4 prevents eclamptic seizures with severe HTN. Digital exam is contraindicated until previa is ruled out."
    },
    bodySystem: "Reproductive/Maternity",
    tier: "rpn"
  },
  {
    id: "bt_rpn_pediatrics_290_13",
    scenario: "A 1-year-old male is brought to the ED with a barking cough, inspiratory stridor, and hoarse voice that started after a mild upper respiratory infection. His parents report the symptoms worsened tonight. He has mild substernal retractions. Vital signs: HR 120 bpm, RR 30/min, Temp 38.3C, SpO2 93%. He is sitting upright and appears anxious but alert.",
    centerOptions: ["Moderate croup (laryngotracheobronchitis)","Epiglottitis","Foreign body aspiration","Bacterial tracheitis"],
    centerCorrect: 0,
    leftFindings: ["Barking (seal-like) cough","Inspiratory stridor at rest","Preceded by upper respiratory infection","Hoarse voice with mild retractions","Sudden onset while eating with unilateral wheeze","Drooling with tripod positioning and high fever"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer nebulized racemic epinephrine","Administer oral or IM dexamethasone","Keep the child calm and in a position of comfort","Monitor for rebound stridor after epinephrine","Examine the throat with tongue depressor","Place on continuous pulse oximetry"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Barking cough, inspiratory stridor, hoarseness following URI, and age 6 months to 3 years are classic for viral croup (laryngotracheobronchitis), most commonly caused by parainfluenza virus.",
      findings: "Barking cough, stridor at rest, URI prodrome, and hoarseness with retractions confirm moderate croup. Sudden onset with eating suggests foreign body. Drooling, tripod, and high fever suggest epiglottitis.",
      actions: "Racemic epinephrine reduces subglottic edema. Dexamethasone reduces inflammation (single dose is standard). Keeping the child calm prevents worsening airway obstruction. Rebound monitoring detects recurrence after epinephrine. Pulse oximetry tracks oxygenation. Throat examination with a tongue depressor is contraindicated as it may worsen obstruction and is specifically avoided in suspected epiglottitis."
    },
    bodySystem: "Pediatrics",
    tier: "rpn"
  },
  {
    id: "bt_rpn_emergencytrauma_291_13",
    scenario: "A 32-year-old male arrives via EMS after a motorcycle collision at approximately 60 km/h. He is alert but confused. He has a large open wound on the right thigh with visible bone and significant hemorrhage. Vital signs: BP 82/50 mmHg, HR 138 bpm, RR 28/min, SpO2 94%. He is pale, cool, and diaphoretic. Estimated blood loss is greater than 1,500 mL.",
    centerOptions: ["Hemorrhagic shock (Class III-IV)","Neurogenic shock","Cardiogenic shock","Tension pneumothorax"],
    centerCorrect: 0,
    leftFindings: ["Tachycardia with hypotension","Pale, cool, diaphoretic skin","Open fracture with greater than 1,500 mL estimated blood loss","Altered mental status (confusion)","Warm, flushed skin with bradycardia","Distended neck veins with tracheal deviation"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Apply direct pressure and tourniquet to hemorrhaging extremity","Initiate massive transfusion protocol","Establish two large-bore IV lines with warmed fluids","Perform primary survey using ABCDE approach","Elevate the injured extremity above heart level only","Obtain type and crossmatch and administer blood products"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Tachycardia, hypotension, altered mental status, cool/pale/diaphoretic skin, and estimated blood loss greater than 1,500 mL in a trauma patient indicate Class III-IV hemorrhagic shock.",
      findings: "Tachycardia, hypotension, cool diaphoretic skin, and AMS with significant blood loss are classic hemorrhagic shock findings. Warm flushed skin with bradycardia suggests neurogenic shock. Distended neck veins with tracheal deviation suggests tension pneumothorax.",
      actions: "Direct pressure and tourniquet control active hemorrhage. Massive transfusion protocol provides balanced blood product resuscitation. Large-bore IVs enable rapid volume replacement. ABCDE primary survey ensures systematic assessment. Blood products restore oxygen-carrying capacity. Elevation alone is insufficient for active hemorrhage of this magnitude."
    },
    bodySystem: "Emergency/Trauma",
    tier: "rpn"
  },
  {
    id: "bt_rpn_musculoskeletal_292_13",
    scenario: "A 17-year-old male presents 6 hours after a tibial fracture reduction and casting. He reports increasing severe pain in his lower leg that is not relieved by prescribed opioids. Pain worsens with passive dorsiflexion of the toes. His leg feels tight and tense. Capillary refill is 4 seconds. He reports tingling and numbness in his toes.",
    centerOptions: ["Compartment syndrome","Deep vein thrombosis","Fat embolism syndrome","Cellulitis"],
    centerCorrect: 0,
    leftFindings: ["Pain out of proportion to injury not relieved by analgesics","Pain with passive stretch (dorsiflexion)","Paresthesia (tingling and numbness)","Tense and swollen compartment","Warmth and erythema along the vein","Petechial rash with confusion"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Notify surgeon immediately for possible fasciotomy","Remove or bivalve the cast immediately","Elevate the limb to heart level only (not above)","Monitor neurovascular status every 15-30 minutes","Apply compression bandage to reduce swelling","Measure compartment pressures if available"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "The 5 Ps of compartment syndrome: Pain out of proportion, Pain with passive stretch, Paresthesia, Pressure (tense compartment), and delayed capillary refill indicate a surgical emergency.",
      findings: "Disproportionate pain, pain with passive stretch, paresthesia, and tense compartment are classic. Warmth along a vein suggests DVT. Petechial rash with confusion suggests fat embolism.",
      actions: "Surgical fasciotomy is definitive treatment. Cast removal releases external pressure. Elevate to heart level (not above, which could worsen ischemia). Frequent neurovascular checks track progression. Compartment pressure measurement confirms diagnosis. Compression is contraindicated as it increases compartment pressure."
    },
    bodySystem: "Musculoskeletal",
    tier: "rpn"
  },
  {
    id: "bt_rpn_integumentary_293_13",
    scenario: "A 43-year-old male is admitted to the burn unit after a house fire with estimated 35% TBSA second and third degree burns to his chest, bilateral arms, and face. He was in an enclosed space with smoke exposure. His voice is hoarse and he has singed nasal hairs. Vital signs: BP 102/64 mmHg, HR 124 bpm, RR 26/min, SpO2 92%. He weighs 80 kg.",
    centerOptions: ["Major thermal burn with inhalation injury","Superficial burn requiring outpatient care","Chemical burn exposure","Electrical burn injury"],
    centerCorrect: 0,
    leftFindings: ["35% TBSA second and third degree burns","Hoarse voice with singed nasal hairs (inhalation injury signs)","Enclosed space fire exposure","Facial burns present","Burns limited to extremities only","Entry and exit wounds visible"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Initiate Parkland formula fluid resuscitation (4 mL x kg x %TBSA)","Prepare for early intubation due to inhalation injury signs","Obtain carboxyhemoglobin level","Monitor urine output target 0.5-1 mL/kg/hr","Apply ice directly to burn wounds","Administer tetanus prophylaxis if not current"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Greater than 20% TBSA burns with facial involvement, hoarse voice, singed nasal hairs, and enclosed space exposure indicate major burns with high suspicion for inhalation injury.",
      findings: "35% TBSA, hoarseness, singed nasal hairs, enclosed space, and facial burns are classic for inhalation injury. Burns limited to extremities without airway signs lower risk. Entry/exit wounds suggest electrical injury.",
      actions: "Parkland formula guides crystalloid resuscitation (half in first 8 hours). Early intubation protects airway before edema progresses. Carboxyhemoglobin detects CO poisoning. Urine output guides fluid adequacy. Tetanus prophylaxis prevents infection. Ice is contraindicated as it causes vasoconstriction and worsens tissue damage."
    },
    bodySystem: "Integumentary",
    tier: "rpn"
  },
  {
    id: "bt_rpn_cardiovascular_294_14",
    scenario: "A 80-year-old male with a history of hypertension presents to the emergency department with crushing substernal chest pain radiating to the left arm and jaw. He is diaphoretic and nauseated. Vital signs: BP 158/94 mmHg, HR 102 bpm, RR 22/min, SpO2 94% on room air. ECG shows ST-segment elevation in leads II, III, and aVF.",
    centerOptions: ["Inferior ST-elevation myocardial infarction","Unstable angina","Aortic dissection","Pulmonary embolism"],
    centerCorrect: 0,
    leftFindings: ["ST-elevation in leads II, III, aVF","Crushing substernal chest pain radiating to left arm","Diaphoresis and nausea","Elevated troponin levels expected","Normal chest X-ray findings","Bilateral equal blood pressures"],
    leftCorrect: [0,1,2],
    leftSelectCount: 3,
    rightActions: ["Administer aspirin 325 mg chewed immediately","Activate cardiac catheterization lab","Administer morphine for pain if not hypotensive","Administer thrombolytics without ECG confirmation","Obtain serial troponin levels","Discharge with follow-up appointment"],
    rightCorrect: [0,1,4],
    rightSelectCount: 3,
    rationale: {
      condition: "ST-elevation in inferior leads (II, III, aVF) with classic symptoms of crushing chest pain, diaphoresis, and nausea indicates an inferior STEMI requiring emergent intervention.",
      findings: "ST-elevation in inferior leads, crushing substernal pain radiating to the arm, and diaphoresis are hallmark findings of acute MI. Normal chest X-ray and bilateral equal BPs help rule out aortic dissection.",
      actions: "Aspirin inhibits platelet aggregation and is first-line. Cardiac catheterization lab activation enables primary PCI. Serial troponins confirm myocardial injury. Thrombolytics without ECG confirmation is inappropriate, and discharge is unsafe."
    },
    bodySystem: "Cardiovascular",
    tier: "rpn"
  },
  {
    id: "bt_rpn_cardiovascular_295_14",
    scenario: "A 84-year-old female with a history of atrial fibrillation and heart failure presents with increasing dyspnea, orthopnea, and bilateral lower extremity edema over 3 days. She reports sleeping on 3 pillows. Vital signs: BP 142/88 mmHg, HR 112 bpm irregular, RR 28/min, SpO2 88% on room air. Auscultation reveals bilateral crackles and an S3 gallop. BNP is 1,240 pg/mL.",
    centerOptions: ["Acute decompensated heart failure","Community-acquired pneumonia","Chronic obstructive pulmonary disease exacerbation","Pleural effusion"],
    centerCorrect: 0,
    leftFindings: ["Bilateral crackles with S3 gallop","Orthopnea requiring 3-pillow elevation","BNP 1,240 pg/mL","Bilateral lower extremity edema","Productive cough with green sputum","Barrel chest with prolonged expiration"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer IV furosemide as ordered","Position in high Fowler's position","Apply supplemental oxygen to maintain SpO2 above 94%","Encourage increased oral fluid intake","Monitor strict intake and output","Administer IV normal saline bolus"],
    rightCorrect: [0,1,2,4],
    rightSelectCount: 4,
    rationale: {
      condition: "Bilateral crackles, S3 gallop, orthopnea, peripheral edema, and markedly elevated BNP (greater than 400 pg/mL) are classic findings of acute decompensated heart failure.",
      findings: "S3 gallop indicates volume overload. Orthopnea and elevated BNP confirm fluid status. Bilateral edema reflects right-sided congestion. Green sputum and barrel chest are distractors suggesting pneumonia and COPD respectively.",
      actions: "IV furosemide promotes diuresis. High Fowler's reduces preload and improves breathing. Oxygen treats hypoxemia. Strict I&O monitors fluid balance. Increased fluids and saline bolus would worsen volume overload."
    },
    bodySystem: "Cardiovascular",
    tier: "rpn"
  },
  {
    id: "bt_rpn_cardiovascular_296_14",
    scenario: "A 67-year-old male with uncontrolled hypertension presents with sudden onset of severe tearing chest pain radiating to the back between the scapulae. He appears anxious and diaphoretic. Vital signs: Right arm BP 182/110 mmHg, Left arm BP 148/90 mmHg, HR 118 bpm, RR 24/min. Chest X-ray shows widened mediastinum.",
    centerOptions: ["Aortic dissection","Myocardial infarction","Tension pneumothorax","Esophageal rupture"],
    centerCorrect: 0,
    leftFindings: ["Tearing chest pain radiating to the back","Blood pressure differential between arms greater than 20 mmHg","Widened mediastinum on chest X-ray","History of uncontrolled hypertension","ST-elevation on ECG","Subcutaneous emphysema"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer IV beta-blocker to reduce heart rate and BP","Obtain emergent CT angiography","Prepare for possible surgical intervention","Administer thrombolytics immediately","Establish two large-bore IV lines","Administer aspirin 325 mg"],
    rightCorrect: [0,1,2,4],
    rightSelectCount: 4,
    rationale: {
      condition: "Sudden tearing chest pain radiating to the back, blood pressure differential greater than 20 mmHg between arms, and widened mediastinum are classic for aortic dissection.",
      findings: "Tearing pain to the back, BP differential, widened mediastinum, and uncontrolled HTN history are hallmark findings. ST-elevation suggests MI, and subcutaneous emphysema suggests esophageal rupture.",
      actions: "IV beta-blockers control heart rate and shear stress. CT angiography confirms diagnosis. Surgical prep is essential. Large-bore IVs allow resuscitation. Thrombolytics and aspirin are absolutely contraindicated as they would worsen hemorrhage."
    },
    bodySystem: "Cardiovascular",
    tier: "rpn"
  },
  {
    id: "bt_rpn_respiratory_297_14",
    scenario: "A 54-year-old female with a history of asthma presents to the emergency department with severe dyspnea, audible wheezing, and inability to speak in full sentences. She has used her albuterol inhaler 8 times today without relief. Vital signs: BP 138/82 mmHg, HR 124 bpm, RR 32/min, SpO2 87% on room air. Peak flow is 120 L/min (predicted 380 L/min).",
    centerOptions: ["Severe acute asthma exacerbation (status asthmaticus)","Chronic obstructive pulmonary disease exacerbation","Anaphylaxis","Spontaneous pneumothorax"],
    centerCorrect: 0,
    leftFindings: ["Inability to speak in full sentences","Peak flow less than 33% of predicted","SpO2 87% on room air","No relief from repeated albuterol use","Inspiratory stridor","Unilateral absent breath sounds"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Administer continuous nebulized albuterol","Administer IV corticosteroids (methylprednisolone)","Prepare for possible intubation","Administer ipratropium bromide nebulization","Discharge with oral prednisone taper","Apply high-flow supplemental oxygen"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Severe dyspnea with inability to speak in full sentences, peak flow below 33% predicted, refractory to beta-agonist therapy, and hypoxemia indicate status asthmaticus requiring aggressive treatment.",
      findings: "Inability to speak in sentences, severely reduced peak flow, hypoxemia, and albuterol resistance are hallmarks of severe exacerbation. Stridor suggests upper airway obstruction, and unilateral absent sounds suggest pneumothorax.",
      actions: "Continuous nebulized albuterol provides sustained bronchodilation. IV steroids reduce inflammation. Intubation preparation ensures airway protection. Ipratropium provides additional bronchodilation. High-flow oxygen treats hypoxemia. Discharge is inappropriate for this severity."
    },
    bodySystem: "Respiratory",
    tier: "rpn"
  },
  {
    id: "bt_rpn_respiratory_298_14",
    scenario: "A 75-year-old male, 4 days post total hip replacement, suddenly develops sharp pleuritic chest pain, dyspnea, and hemoptysis. He is tachycardic and anxious. Vital signs: BP 110/70 mmHg, HR 118 bpm, RR 28/min, SpO2 89% on room air. D-dimer is 2,400 ng/mL. CT pulmonary angiography reveals a filling defect in the right main pulmonary artery.",
    centerOptions: ["Pulmonary embolism","Hospital-acquired pneumonia","Fat embolism syndrome","Acute coronary syndrome"],
    centerCorrect: 0,
    leftFindings: ["Pleuritic chest pain with hemoptysis","Recent surgical procedure with immobility","D-dimer 2,400 ng/mL","CT showing filling defect in pulmonary artery","Petechial rash on chest and axillae","Productive cough with purulent sputum"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Initiate anticoagulation with IV heparin","Apply supplemental oxygen","Elevate the head of bed","Prepare for thrombolysis if hemodynamically unstable","Encourage early ambulation without restrictions","Monitor for signs of right ventricular failure"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "Pleuritic chest pain, hemoptysis, tachycardia, and hypoxemia in a postoperative patient with elevated D-dimer and CT-confirmed filling defect confirm pulmonary embolism.",
      findings: "Pleuritic pain with hemoptysis, surgical immobility risk factor, markedly elevated D-dimer, and CT angiography findings are diagnostic. Petechial rash suggests fat embolism; purulent sputum suggests pneumonia.",
      actions: "IV heparin prevents clot propagation. Oxygen treats hypoxemia. Head elevation improves ventilation. Thrombolysis is reserved for massive PE with hemodynamic instability. Monitoring for RV failure detects deterioration. Unrestricted ambulation could dislodge further emboli."
    },
    bodySystem: "Respiratory",
    tier: "rpn"
  },
  {
    id: "bt_rpn_respiratory_299_14",
    scenario: "A 70-year-old male with a 40-pack-year smoking history presents with worsening dyspnea, increased sputum production with yellow-green color, and low-grade fever for 3 days. He uses home oxygen at 2 L/min. Vital signs: BP 136/82 mmHg, HR 98 bpm, RR 26/min, SpO2 85% on 2 L/min NC, Temp 38.2C. ABG: pH 7.31, PaCO2 58 mmHg, PaO2 52 mmHg, HCO3 28 mEq/L.",
    centerOptions: ["Acute exacerbation of COPD","Community-acquired pneumonia","Acute asthma attack","Pulmonary fibrosis"],
    centerCorrect: 0,
    leftFindings: ["40-pack-year smoking history with chronic dyspnea","Increased purulent sputum production","Compensated respiratory acidosis on ABG","Hypoxemia despite home oxygen","No wheezing or reversible obstruction","Bilateral fine inspiratory crackles only"],
    leftCorrect: [0,1,2,3],
    leftSelectCount: 4,
    rightActions: ["Increase oxygen to maintain SpO2 88-92%","Administer short-acting bronchodilator nebulization","Administer systemic corticosteroids","Start antibiotics for infectious exacerbation","Administer high-flow oxygen to achieve SpO2 100%","Monitor for CO2 narcosis and worsening respiratory acidosis"],
    rightCorrect: [0,1,2,3,5],
    rightSelectCount: 5,
    rationale: {
      condition: "A COPD patient with worsening dyspnea, increased purulent sputum, fever, and compensated respiratory acidosis with chronic CO2 retention meets criteria for acute COPD exacerbation.",
      findings: "Smoking history, baseline dyspnea, purulent sputum increase, and ABG showing compensated respiratory acidosis (elevated PaCO2 with elevated HCO3) confirm chronic CO2 retention with acute worsening.",
      actions: "Target SpO2 88-92% to avoid suppressing hypoxic drive. Bronchodilators relieve airflow obstruction. Steroids reduce inflammation. Antibiotics treat infectious trigger. High-flow O2 to 100% risks CO2 narcosis. Monitoring respiratory status is essential."
    },
    bodySystem: "Respiratory",
    tier: "rpn"
  },
];
