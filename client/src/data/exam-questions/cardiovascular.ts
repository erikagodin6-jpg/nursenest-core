import { getAssetUrl } from "@/lib/asset-url";
import type { ExamQuestion } from "./types";

const imgDVTExam = getAssetUrl("dvt_1773517432559.png");
const imgFirstDegreeBlockExam = getAssetUrl("firstdegreeblock_1773517432559.png");

export const cardiovascularQuestions: ExamQuestion[] = [
  // === MCQ Questions 1-210 ===
  // Topic 1: Heart Failure (HFrEF, HFpEF)
  {
    q: "A 72-year-old client with heart failure (HFrEF) reports increased shortness of breath when lying flat and needing three pillows to sleep. Vital signs: BP 98/62, HR 102, RR 26, SpO2 89% on room air. Which nursing action is the priority?",
    o: ["Elevate the head of the bed to high Fowler's position and apply oxygen as ordered", "Encourage the client to ambulate to improve circulation", "Administer the scheduled oral diazepam for anxiety", "Restrict fluids and weigh the client"],
    a: 0,
    r: "Orthopnea with low SpO2 requires immediate positioning (high Fowler's) and supplemental oxygen to reduce preload and improve oxygenation. Ambulation would worsen dyspnea. Diazepam may depress respirations. Fluid restriction and daily weights are important but not the immediate priority with acute respiratory distress.",
    s: "Cardiovascular"
  },
  {
    q: "A 68-year-old client with HFpEF is being discharged on furosemide 40 mg daily. The client's potassium level is 3.2 mEq/L. Which finding should the nurse monitor and report to the healthcare provider before discharge?",
    o: ["The low potassium level, as it increases risk for dysrhythmias", "The client's age, as furosemide is contraindicated in older adults", "A blood pressure of 128/78, as this is too high for a heart failure client", "A heart rate of 72 bpm, as bradycardia is expected with furosemide"],
    a: 0,
    r: "Potassium of 3.2 mEq/L is below normal (3.5-5.0 mEq/L). Loop diuretics cause potassium loss, and hypokalemia increases risk for life-threatening dysrhythmias, especially in heart failure clients on digoxin. Age alone is not a contraindication. BP 128/78 is acceptable. HR 72 is normal, not bradycardia.",
    s: "Cardiovascular"
  },
  {
    q: "A 75-year-old client with heart failure has gained 2.3 kg (5 lbs) over 2 days. The nurse notes bilateral ankle edema and crackles in the lung bases. Which assessment finding most strongly suggests fluid volume overload?",
    o: ["Rapid weight gain of 2.3 kg over 2 days", "Ankle edema bilaterally", "Blood pressure of 142/88 mmHg", "Decreased appetite reported by the client"],
    a: 0,
    r: "Rapid weight gain (more than 1 kg/day) is the most reliable indicator of fluid retention in heart failure. Each kilogram of weight gain corresponds to approximately 1 litre of fluid. Edema can have other causes, BP may be chronically elevated, and decreased appetite is nonspecific.",
    s: "Cardiovascular"
  },
  {
    q: "A 70-year-old client with chronic heart failure is taking digoxin 0.125 mg daily. The client's heart rate is 54 bpm and they report nausea and blurred vision. What is the nurse's priority action?",
    o: ["Hold the digoxin dose and report findings to the healthcare provider", "Administer the digoxin as scheduled since the dose is low", "Encourage the client to eat a high-potassium snack", "Document the findings and recheck the heart rate in 1 hour"],
    a: 0,
    r: "Heart rate below 60 bpm combined with nausea and visual disturbances are classic signs of digoxin toxicity. The nurse should hold the dose and notify the provider immediately. Administering the drug could worsen toxicity. A potassium snack does not address acute toxicity. Waiting could allow toxicity to progress to dangerous dysrhythmias.",
    s: "Cardiovascular"
  },
  {
    q: "A 62-year-old client with newly diagnosed HFrEF asks why the healthcare provider started them on carvedilol. Which response by the nurse best explains the rationale?",
    o: ["Beta-blockers help reduce the heart's workload and improve long-term survival in heart failure", "Beta-blockers increase heart rate to pump blood more efficiently", "Beta-blockers are primarily used to manage chest pain in heart failure", "Beta-blockers replace the need for ACE inhibitors in heart failure treatment"],
    a: 0,
    r: "Carvedilol (a beta-blocker) reduces myocardial oxygen demand by decreasing heart rate and contractility, improving long-term outcomes and survival in HFrEF. It does not increase heart rate. While it may help with angina, that is not the primary indication in HF. Beta-blockers complement, not replace, ACE inhibitors.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is caring for a 78-year-old client with heart failure who is receiving IV furosemide. Which laboratory value requires the nurse to notify the healthcare provider?",
    o: ["Sodium 128 mEq/L", "Potassium 4.2 mEq/L", "BUN 18 mg/dL", "Creatinine 1.0 mg/dL"],
    a: 0,
    r: "Sodium 128 mEq/L indicates hyponatremia (normal 135-145 mEq/L), which can occur with aggressive diuresis and may cause neurological symptoms. This requires provider notification. K+ 4.2 is normal. BUN 18 and creatinine 1.0 are within normal limits.",
    s: "Cardiovascular"
  },
  {
    q: "A 65-year-old client with HFpEF and a history of hypertension presents with BP 168/94, HR 88, and bilateral lower extremity edema. Which nursing intervention is most appropriate?",
    o: ["Administer antihypertensive medications as ordered and monitor blood pressure closely", "Place the client in Trendelenburg position to improve cardiac output", "Increase IV fluid rate to improve kidney perfusion", "Administer a bolus of normal saline to reduce peripheral edema"],
    a: 0,
    r: "HFpEF management focuses on blood pressure control and volume management. Administering ordered antihypertensives addresses the elevated BP contributing to symptoms. Trendelenburg increases preload and worsens pulmonary congestion. Increasing fluids or giving a saline bolus would worsen fluid overload and edema.",
    s: "Cardiovascular"
  },
  {
    q: "A 69-year-old client with heart failure is prescribed enalapril. During morning assessment, the client reports a persistent dry cough that started 2 weeks ago. What is the nurse's best action?",
    o: ["Report the cough to the healthcare provider as a known side effect of ACE inhibitors", "Administer a cough suppressant and reassure the client", "Hold the enalapril and administer a bronchodilator", "Encourage increased fluid intake to loosen secretions"],
    a: 0,
    r: "A persistent dry cough is a well-known side effect of ACE inhibitors caused by bradykinin accumulation. The nurse should report this so the provider can consider switching to an ARB. A cough suppressant does not address the cause. Holding medication without an order is outside scope. Increased fluids are inappropriate in heart failure.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is educating a 74-year-old client with heart failure about dietary modifications. Which client statement indicates a need for further teaching?",
    o: ["I can use as much salt as I want because I take a water pill", "I should weigh myself every morning at the same time", "I need to limit my fluid intake as instructed by my provider", "I should report a weight gain of more than 1 kg in one day"],
    a: 0,
    r: "Sodium restriction is essential in heart failure management regardless of diuretic use. Excess sodium causes fluid retention and worsens heart failure symptoms. Daily weights, fluid restriction, and reporting rapid weight gain are all correct self-management practices.",
    s: "Cardiovascular"
  },
  {
    q: "A 71-year-old client with heart failure has a BNP level of 1,200 pg/mL (normal less than 100 pg/mL). The client's SpO2 is 91%, RR 28, and the nurse hears crackles bilaterally. Which nursing action takes priority?",
    o: ["Position the client upright and prepare to administer oxygen and diuretics as ordered", "Obtain a repeat BNP level to confirm the result", "Encourage deep breathing exercises to clear the crackles", "Administer oral potassium supplements prophylactically"],
    a: 0,
    r: "Severely elevated BNP with respiratory distress, crackles, and low SpO2 indicates acute decompensated heart failure. Immediate upright positioning reduces preload, oxygen improves oxygenation, and diuretics reduce fluid overload. Repeating BNP delays treatment. Deep breathing alone is insufficient. Prophylactic potassium is not the priority.",
    s: "Cardiovascular"
  },
  {
    q: "A 66-year-old client with heart failure is prescribed spironolactone 25 mg daily. The client's potassium is 5.6 mEq/L. What is the nurse's priority action?",
    o: ["Hold the spironolactone and notify the healthcare provider of the elevated potassium", "Administer the spironolactone with orange juice to improve absorption", "Encourage the client to eat potassium-rich foods", "Document the lab value and administer the medication as scheduled"],
    a: 0,
    r: "Spironolactone is a potassium-sparing diuretic. A potassium of 5.6 mEq/L is dangerously elevated (normal 3.5-5.0 mEq/L) and can cause fatal dysrhythmias. The nurse must hold the medication and notify the provider. Orange juice adds potassium. Encouraging potassium-rich foods would worsen hyperkalemia. Administering the drug is unsafe.",
    s: "Cardiovascular"
  },
  {
    q: "A 58-year-old client with newly diagnosed heart failure asks why they must limit alcohol intake. Which nursing response is most accurate?",
    o: ["Alcohol is a cardiac depressant that can worsen heart function and interact with heart failure medications", "Alcohol increases blood clotting, which raises the risk for heart attack", "Alcohol causes the heart valves to stiffen, worsening valve disease", "Small amounts of alcohol are actually beneficial and may improve heart failure outcomes"],
    a: 0,
    r: "Alcohol is a direct myocardial depressant that can worsen systolic dysfunction, contribute to cardiomyopathy, and interact with medications such as ACE inhibitors and diuretics. It does not increase clotting or stiffen valves. Alcohol is not considered beneficial in heart failure.",
    s: "Cardiovascular"
  },
  {
    q: "A 80-year-old client with heart failure is receiving a continuous IV infusion of dobutamine. The nurse notes the client's heart rate has increased from 88 to 132 bpm. What is the most appropriate nursing action?",
    o: ["Reduce the infusion rate and notify the healthcare provider immediately", "Increase the infusion rate to improve cardiac output", "Administer a fluid bolus to compensate for the tachycardia", "Continue monitoring, as tachycardia is an expected response to dobutamine"],
    a: 0,
    r: "Significant tachycardia (HR 132) during dobutamine infusion indicates excessive stimulation, which increases myocardial oxygen demand and can precipitate dysrhythmias. The nurse should reduce the rate and notify the provider. Increasing the rate would worsen tachycardia. A fluid bolus is inappropriate. While some increase in HR is expected, this degree is excessive.",
    s: "Cardiovascular"
  },
  {
    q: "A 73-year-old client with chronic heart failure has a serum digoxin level of 2.8 ng/mL (therapeutic range 0.5-2.0 ng/mL). Which assessment finding would the nurse expect?",
    o: ["Nausea, vomiting, and visual disturbances such as seeing yellow-green halos", "Hypertension and facial flushing", "Increased urine output and polyuria", "Hyperactive bowel sounds and diarrhea"],
    a: 0,
    r: "A digoxin level of 2.8 ng/mL is toxic. Classic signs of digoxin toxicity include GI symptoms (nausea, vomiting, anorexia) and visual changes (yellow-green halos, blurred vision). Hypertension and flushing are not typical. Increased urine output relates to diuretics. Hyperactive bowels are nonspecific.",
    s: "Cardiovascular"
  },
  // Topic 2: Acute Coronary Syndromes
  {
    q: "A 58-year-old male client presents to the emergency department with crushing substernal chest pain radiating to the left arm, diaphoresis, and nausea. Vital signs: BP 148/92, HR 110, RR 24, SpO2 94%. A 12-lead ECG shows ST-segment elevation in leads II, III, and aVF. What is the nurse's priority action?",
    o: ["Administer aspirin as ordered and prepare for emergent cardiac catheterization", "Administer morphine IV to control pain before any other interventions", "Obtain serial troponin levels and wait for results before acting", "Apply ice packs to the chest to reduce inflammation"],
    a: 0,
    r: "ST-elevation in inferior leads (II, III, aVF) indicates an acute STEMI requiring emergent reperfusion. Aspirin inhibits platelet aggregation and is a first-line intervention. Morphine is no longer routinely given first as it may mask symptoms and cause hypotension. Waiting for troponins delays critical treatment. Ice packs have no role in ACS management.",
    s: "Cardiovascular"
  },
  {
    q: "A 64-year-old female client is admitted with NSTEMI. Troponin I is 0.8 ng/mL (normal less than 0.04 ng/mL). She rates her chest pain as 7/10. Which medication should the nurse anticipate administering first?",
    o: ["Sublingual nitroglycerin as ordered to relieve ischemic chest pain", "Oral metoprolol to reduce heart rate", "IV amiodarone to prevent dysrhythmias", "Oral warfarin to prevent clot extension"],
    a: 0,
    r: "For active ischemic chest pain in NSTEMI, sublingual nitroglycerin is a priority to promote coronary vasodilation and reduce myocardial oxygen demand. Metoprolol may be given but pain relief is first priority. Amiodarone is not indicated without dysrhythmia. Warfarin is not used acutely for ACS.",
    s: "Cardiovascular"
  },
  {
    q: "A 55-year-old client who had a STEMI and underwent percutaneous coronary intervention (PCI) 6 hours ago reports new-onset chest pain. The nurse notes blood pressure has dropped from 130/80 to 88/58 mmHg. Which complication should the nurse suspect?",
    o: ["Cardiac tamponade or coronary artery re-occlusion requiring immediate provider notification", "Expected post-procedure pain that can be managed with acetaminophen", "Musculoskeletal chest wall pain from lying flat on the procedure table", "Anxiety-related chest discomfort that will resolve with reassurance"],
    a: 0,
    r: "New chest pain with significant hypotension after PCI may indicate coronary re-occlusion, stent thrombosis, or cardiac tamponade from vessel perforation. These are life-threatening emergencies requiring immediate intervention. Post-procedure pain would not cause hemodynamic instability. Musculoskeletal and anxiety pain do not present with hypotension.",
    s: "Cardiovascular"
  },
  {
    q: "A 48-year-old client presents with chest pain that worsens with exertion and is relieved by rest. The ECG shows no ST changes, and troponin levels are negative. Which condition does the nurse suspect?",
    o: ["Stable angina pectoris", "Acute myocardial infarction", "Aortic dissection", "Pulmonary embolism"],
    a: 0,
    r: "Chest pain that occurs with exertion, is relieved by rest, has no ECG changes, and negative troponins is characteristic of stable angina. MI would show troponin elevation and/or ECG changes. Aortic dissection presents with sudden tearing pain. PE presents with dyspnea and pleuritic pain.",
    s: "Cardiovascular"
  },
  {
    q: "A 60-year-old client is prescribed clopidogrel (Plavix) after a coronary stent placement. Which client statement indicates understanding of the medication?",
    o: ["I need to take this medication every day to prevent my stent from clotting off", "I can stop taking this medication once my chest pain goes away", "I should take extra doses if I miss one to catch up", "This medication will dissolve any blood clots that form in my stent"],
    a: 0,
    r: "Clopidogrel is an antiplatelet agent that prevents platelet aggregation and stent thrombosis. It must be taken consistently as prescribed after stent placement. Stopping prematurely can cause stent thrombosis. Double-dosing is not recommended. It prevents new clots but does not dissolve existing ones.",
    s: "Cardiovascular"
  },
  {
    q: "A 52-year-old client in the emergency department has been given three sublingual nitroglycerin tablets 5 minutes apart, but chest pain persists at 8/10. Blood pressure is 100/68 mmHg. What should the nurse do next?",
    o: ["Notify the healthcare provider, as the client may require IV nitroglycerin or emergent intervention", "Administer a fourth sublingual nitroglycerin tablet", "Apply a nitroglycerin patch for sustained relief", "Position the client flat to raise blood pressure before giving more nitroglycerin"],
    a: 0,
    r: "Persistent chest pain after three doses of sublingual nitroglycerin indicates the need for escalated treatment such as IV nitroglycerin or emergent catheterization. A fourth sublingual dose is not standard protocol. Adding a patch with existing hypotension is unsafe. Flat positioning does not address ongoing ischemia.",
    s: "Cardiovascular"
  },
  {
    q: "A 67-year-old client is admitted with unstable angina. The nurse notes the client has been taking sildenafil (Viagra) at home. Why is this information critical?",
    o: ["Sildenafil causes severe hypotension when combined with nitrates, which may be needed for chest pain", "Sildenafil increases heart rate and may worsen tachycardia", "Sildenafil masks the symptoms of angina, making diagnosis difficult", "Sildenafil causes hypercoagulability that increases clot formation"],
    a: 0,
    r: "Sildenafil (a PDE5 inhibitor) combined with nitrates can cause life-threatening hypotension. This is critical because nitrates are a primary treatment for angina. The provider needs this information before administering nitroglycerin. Sildenafil does not significantly affect heart rate, mask angina, or cause hypercoagulability.",
    s: "Cardiovascular"
  },
  {
    q: "A 59-year-old client with ACS has the following lab results: Troponin I 4.2 ng/mL, CK-MB 85 U/L, BNP 450 pg/mL. Which lab value is the most specific indicator of myocardial injury?",
    o: ["Troponin I of 4.2 ng/mL", "CK-MB of 85 U/L", "BNP of 450 pg/mL", "All three values equally indicate myocardial injury"],
    a: 0,
    r: "Troponin I is the most specific cardiac biomarker for myocardial injury, as it is found almost exclusively in cardiac muscle. CK-MB is also elevated in MI but is less specific (can rise with skeletal muscle injury). BNP indicates heart failure/ventricular stretch, not specifically myocardial injury.",
    s: "Cardiovascular"
  },
  {
    q: "A 63-year-old female client reports intermittent jaw pain and fatigue that worsens with activity. She has a history of type 2 diabetes and hyperlipidemia. What should the nurse consider?",
    o: ["Atypical presentation of acute coronary syndrome, common in women and diabetic clients", "Temporomandibular joint disorder requiring dental referral", "Iron deficiency anemia causing fatigue", "Hypothyroidism causing fatigue and muscle pain"],
    a: 0,
    r: "Women and diabetic clients often present with atypical ACS symptoms including jaw pain, fatigue, nausea, and dyspnea rather than classic chest pain. The nurse should suspect cardiac involvement given her risk factors. TMJ, anemia, and hypothyroidism are possible but lower priority given the cardiac risk profile.",
    s: "Cardiovascular"
  },
  {
    q: "A 56-year-old client post-STEMI is prescribed a statin medication. The client asks why they need a cholesterol medication when their MI was caused by a blood clot. Which response by the nurse is most accurate?",
    o: ["Statins stabilize arterial plaque and reduce inflammation, lowering the risk of future cardiac events", "Statins dissolve blood clots that caused your heart attack", "Statins are only needed if your cholesterol is high after the heart attack", "Statins replace the need for aspirin therapy after a heart attack"],
    a: 0,
    r: "Statins have pleiotropic effects beyond cholesterol lowering, including plaque stabilization, anti-inflammatory properties, and endothelial function improvement. They are standard post-MI therapy regardless of cholesterol levels. They do not dissolve clots, are indicated regardless of lipid levels, and do not replace antiplatelet therapy.",
    s: "Cardiovascular"
  },
  {
    q: "A 61-year-old client has just returned from cardiac catheterization via the right femoral artery. Which nursing assessment is the highest priority?",
    o: ["Check the right pedal pulse, assess the groin insertion site for bleeding, and monitor vital signs", "Encourage the client to ambulate within 1 hour to prevent deep vein thrombosis", "Elevate the right leg above heart level to reduce swelling", "Ask the client to flex the right hip to prevent stiffness"],
    a: 0,
    r: "After femoral artery catheterization, the priority is assessing for vascular complications: checking distal pulses ensures arterial patency, monitoring the groin site detects hemorrhage, and vital signs detect hemodynamic changes. Early ambulation is contraindicated (bed rest required). Leg elevation and hip flexion can disrupt the closure site.",
    s: "Cardiovascular"
  },
  // Topic 3: Hypertension
  {
    q: "A 54-year-old client is newly diagnosed with hypertension. Blood pressure is 158/96 mmHg on two separate visits. The client asks why treatment is important since they feel fine. Which response by the nurse is most appropriate?",
    o: ["Uncontrolled hypertension can silently damage your heart, kidneys, brain, and blood vessels even without symptoms", "If you feel fine, your blood pressure is probably not high enough to need treatment", "Hypertension only needs treatment when you start having headaches or dizziness", "You only need medication if lifestyle changes do not work within 6 months"],
    a: 0,
    r: "Hypertension is called the 'silent killer' because end-organ damage (cardiac, renal, cerebral, vascular) occurs without symptoms until advanced disease. Feeling fine does not mean BP is safe. Symptoms like headaches occur only with severely elevated BP. Treatment decisions are based on BP values and risk factors, not symptoms alone.",
    s: "Cardiovascular"
  },
  {
    q: "A 62-year-old client on lisinopril 10 mg daily has a blood pressure of 162/98 mmHg at a follow-up visit. The client admits to not taking the medication regularly. What is the nurse's best response?",
    o: ["Explore barriers to medication adherence and reinforce the importance of taking it consistently", "Double the medication dose to compensate for missed doses", "Discontinue the current medication and request a different one", "Tell the client their blood pressure will be fine if they just reduce salt intake"],
    a: 0,
    r: "Non-adherence is the most common cause of uncontrolled hypertension. The nurse should explore reasons (cost, side effects, forgetfulness) and provide education. Doubling the dose is not within nursing scope and is medically inappropriate. Changing medication before addressing adherence is premature. Salt reduction alone is unlikely sufficient with this BP.",
    s: "Cardiovascular"
  },
  {
    q: "A 48-year-old client presents to the emergency department with a blood pressure of 220/130 mmHg, severe headache, blurred vision, and chest pain. Which condition does the nurse suspect?",
    o: ["Hypertensive emergency requiring immediate blood pressure reduction", "Essential hypertension that can be managed with oral medication over several days", "Tension headache coinciding with elevated blood pressure", "Migraine with aura causing temporary blood pressure elevation"],
    a: 0,
    r: "BP greater than 180/120 mmHg with evidence of end-organ damage (headache indicating encephalopathy, blurred vision indicating retinopathy, chest pain indicating cardiac ischemia) constitutes a hypertensive emergency. This requires IV antihypertensives and immediate intervention. It is not simple essential hypertension or a headache disorder.",
    s: "Cardiovascular"
  },
  {
    q: "A 70-year-old client taking amlodipine for hypertension reports swollen ankles bilaterally. Vital signs: BP 132/78, HR 72. What should the nurse advise?",
    o: ["Peripheral edema is a common side effect of calcium channel blockers; report it to the healthcare provider", "The swelling indicates heart failure and requires emergency treatment", "Stop taking the medication immediately and call the pharmacy", "Elevate the legs and increase salt intake to retain fluids in the vascular space"],
    a: 0,
    r: "Peripheral edema is a well-known side effect of dihydropyridine calcium channel blockers like amlodipine due to arteriolar dilation. It should be reported to the provider for potential medication adjustment. With stable vital signs and no other HF symptoms, emergency treatment is not warranted. The client should not stop medication independently. Increasing salt is contraindicated.",
    s: "Cardiovascular"
  },
  {
    q: "A 56-year-old client with hypertension has a blood pressure of 142/90 mmHg. The nurse rechecks and gets 138/88 mmHg. The client took their antihypertensive this morning. Which action is most appropriate?",
    o: ["Document the readings and report to the healthcare provider for medication evaluation", "Administer an additional dose of the antihypertensive medication", "Tell the client the readings are acceptable and no changes are needed", "Instruct the client to lie down and recheck in 30 minutes"],
    a: 0,
    r: "Blood pressure of 138/88 mmHg on current therapy is above target for most clients (less than 130/80 mmHg for those with cardiovascular risk). The provider should evaluate for dose adjustment. The nurse cannot give additional doses without an order. Telling the client it is acceptable is incorrect. Lying down may alter readings but does not address medication management.",
    s: "Cardiovascular"
  },
  {
    q: "A 45-year-old client with hypertension asks why the healthcare provider recommended the DASH diet. Which response by the nurse is most accurate?",
    o: ["The DASH diet emphasizes fruits, vegetables, low-fat dairy, and reduced sodium, which has been shown to lower blood pressure", "The DASH diet eliminates all carbohydrates to promote weight loss and lower blood pressure", "The DASH diet focuses on high protein intake to strengthen blood vessel walls", "The DASH diet is only effective for clients who are overweight"],
    a: 0,
    r: "The DASH (Dietary Approaches to Stop Hypertension) diet is rich in fruits, vegetables, whole grains, low-fat dairy, lean protein, and limited in sodium, saturated fat, and added sugars. It has strong evidence for lowering blood pressure. It does not eliminate carbs, is not high protein focused, and benefits all hypertensive clients regardless of weight.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is administering IV labetalol to a client in hypertensive crisis. The client's blood pressure drops from 210/120 to 150/88 mmHg within 15 minutes. Which nursing action is most appropriate?",
    o: ["Continue monitoring closely, as a rapid drop may cause cerebral hypoperfusion", "Administer another bolus immediately to bring BP to normal range", "Discontinue the IV line since the target BP has been achieved", "Encourage the client to stand up to assess for orthostatic changes"],
    a: 0,
    r: "In hypertensive crisis, blood pressure should be reduced gradually (no more than 25% in the first hour) to prevent cerebral hypoperfusion, stroke, or renal damage. A drop from 210/120 to 150/88 in 15 minutes is significant and requires close monitoring. Additional boluses risk over-correction. The IV should remain for continued therapy. Standing would risk falls.",
    s: "Cardiovascular"
  },
  // Topic 4: Dysrhythmias
  {
    q: "A 74-year-old client on a telemetry unit has a heart rate of 42 bpm with a regular rhythm. The client reports dizziness and lightheadedness. Blood pressure is 88/54 mmHg. Which intervention should the nurse prioritize?",
    o: ["Administer atropine as ordered and prepare for potential transcutaneous pacing", "Encourage the client to cough vigorously to stimulate the heart", "Administer a beta-blocker to regulate the heart rhythm", "Document the findings and recheck vital signs in 4 hours"],
    a: 0,
    r: "Symptomatic bradycardia (HR 42 with dizziness and hypotension) is a medical emergency. Atropine is the first-line medication, and transcutaneous pacing should be prepared as backup. Coughing is not effective for bradycardia. Beta-blockers would further reduce heart rate. Waiting 4 hours risks deterioration.",
    s: "Cardiovascular"
  },
  {
    q: "A 68-year-old client's telemetry shows an irregularly irregular rhythm with no discernible P waves and a ventricular rate of 134 bpm. Which dysrhythmia does the nurse suspect?",
    o: ["Atrial fibrillation with rapid ventricular response", "Normal sinus rhythm with premature atrial contractions", "Ventricular tachycardia", "Third-degree heart block"],
    a: 0,
    r: "An irregularly irregular rhythm without P waves is the hallmark of atrial fibrillation. The rate of 134 indicates rapid ventricular response. NSR with PACs would show some P waves and a mostly regular rhythm. Vtach is regular and wide-complex. Third-degree heart block shows regular ventricular rate with dissociated P waves.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is caring for a client with newly diagnosed atrial fibrillation. The healthcare provider prescribes diltiazem IV. Which parameter should the nurse monitor most closely?",
    o: ["Heart rate and blood pressure, as diltiazem can cause bradycardia and hypotension", "Blood glucose levels, as diltiazem affects insulin secretion", "Respiratory rate, as diltiazem commonly causes respiratory depression", "Urine output, as diltiazem is primarily a diuretic"],
    a: 0,
    r: "Diltiazem is a calcium channel blocker that slows conduction through the AV node to control ventricular rate in atrial fibrillation. It can cause significant bradycardia and hypotension. It does not affect blood glucose or insulin. It is not a respiratory depressant. It is not a diuretic.",
    s: "Cardiovascular"
  },
  {
    q: "A 52-year-old client suddenly becomes unresponsive. The telemetry monitor shows a chaotic, disorganized waveform with no identifiable QRS complexes. What is the nurse's immediate action?",
    o: ["Call a code and begin CPR immediately, as this is ventricular fibrillation", "Administer sublingual nitroglycerin and recheck the rhythm", "Turn the client on their side and wait for the episode to pass", "Check lead placement, as the rhythm is likely artifact"],
    a: 0,
    r: "An unresponsive client with a chaotic rhythm and no identifiable QRS complexes is in ventricular fibrillation, a lethal dysrhythmia requiring immediate CPR and defibrillation. Nitroglycerin is not indicated. Waiting would be fatal. While artifact should be considered, an unresponsive client should be treated as a cardiac arrest until proven otherwise.",
    s: "Cardiovascular",
    image: getAssetUrl("lethaldysrhythmias_1773517523349.png")
  },
  {
    q: "A 60-year-old client with atrial fibrillation has been cardioverted successfully to normal sinus rhythm. Which medication does the nurse anticipate will be continued post-cardioversion?",
    o: ["Anticoagulant therapy to prevent thromboembolic events", "IV dopamine to maintain heart rate", "Digoxin immune Fab to prevent digoxin toxicity", "Calcium gluconate to stabilize the myocardium"],
    a: 0,
    r: "After cardioversion for atrial fibrillation, anticoagulation is continued because blood stasis in the atria during afib may have formed clots that could embolize when normal rhythm returns. Dopamine is not routinely indicated. Digoxin immune Fab is for toxicity only. Calcium gluconate is for hyperkalemia.",
    s: "Cardiovascular"
  },
  {
    q: "A 70-year-old client with a permanent pacemaker reports hiccups, muscle twitching near the device, and dizziness. What should the nurse suspect?",
    o: ["Pacemaker malfunction with lead displacement or failure to capture", "Normal pacemaker function with expected side effects", "Electromagnetic interference from a nearby microwave", "Low battery requiring routine replacement"],
    a: 0,
    r: "Hiccups and muscle twitching near the pacemaker site can indicate lead displacement causing stimulation of the diaphragm or chest wall muscles. Dizziness suggests inadequate cardiac output from failure to capture. These are not normal pacemaker sensations. Modern pacemakers are shielded from household microwaves. Low battery typically shows rate changes.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is monitoring a client on telemetry who shows a rhythm with progressively lengthening PR intervals until a QRS complex is dropped. Which type of heart block is this?",
    o: ["Second-degree AV block Type I (Wenckebach)", "First-degree AV block", "Second-degree AV block Type II", "Third-degree (complete) heart block"],
    a: 0,
    r: "Progressive PR prolongation until a dropped QRS is the classic pattern of Wenckebach (Mobitz Type I). First-degree shows a consistently prolonged PR without dropped beats. Type II shows consistent PR intervals with sudden dropped QRS complexes. Third-degree shows complete AV dissociation.",
    s: "Cardiovascular"
  },
  {
    q: "A 45-year-old client presents with palpitations, heart rate 188 bpm, and blood pressure 102/64. The ECG shows a narrow-complex tachycardia with regular rhythm. Which intervention should the nurse anticipate?",
    o: ["Vagal maneuvers such as bearing down, followed by IV adenosine if unsuccessful", "Immediate synchronized cardioversion as first-line treatment", "IV atropine to slow the heart rate", "Oral metoprolol to control the tachycardia"],
    a: 0,
    r: "Narrow-complex regular tachycardia at this rate is likely supraventricular tachycardia (SVT). First-line treatment includes vagal maneuvers (Valsalva, carotid massage) followed by IV adenosine if vagal maneuvers fail. Cardioversion is reserved for hemodynamically unstable clients. Atropine increases heart rate. Oral metoprolol acts too slowly for acute SVT.",
    s: "Cardiovascular"
  },
  {
    q: "A 78-year-old client with a history of atrial fibrillation presents with sudden weakness on the left side of the body, facial drooping, and slurred speech. Which complication of atrial fibrillation does the nurse suspect?",
    o: ["Embolic stroke caused by a thrombus from the fibrillating atria", "Transient ischemic attack caused by carotid artery stenosis", "Hemorrhagic stroke caused by anticoagulant therapy", "Cardiac arrest caused by the atrial fibrillation"],
    a: 0,
    r: "Atrial fibrillation causes blood stasis in the atria, leading to thrombus formation. If a clot embolizes to the brain, it causes an ischemic (embolic) stroke presenting with sudden neurological deficits. While TIA and hemorrhagic stroke are possible, the most likely cause given afib history is embolic stroke. Afib alone does not cause cardiac arrest.",
    s: "Cardiovascular"
  },
  // Topic 5: DVT and Pulmonary Embolism
  {
    q: "A 42-year-old postoperative client reports calf pain, warmth, and swelling in the left leg 5 days after hip replacement surgery. The nurse notes a positive Homans' sign. Which action is the priority?",
    o: ["Notify the healthcare provider immediately and maintain the client on bed rest", "Apply warm compresses and encourage the client to walk to promote circulation", "Massage the affected calf vigorously to relieve the pain", "Administer aspirin orally and elevate the leg"],
    a: 0,
    r: "These symptoms strongly suggest deep vein thrombosis (DVT). The nurse should notify the provider for diagnostic testing (Doppler ultrasound) and treatment (anticoagulation). Bed rest prevents clot dislodgement. Walking could dislodge the clot. Massaging a DVT can cause embolization. Aspirin alone is insufficient treatment for DVT.",
    s: "Cardiovascular",
    image: imgDVTExam
  },
  {
    q: "A 55-year-old client on IV heparin for DVT has the following lab results: aPTT 120 seconds (therapeutic range 60-80 seconds). What is the nurse's priority action?",
    o: ["Stop the heparin infusion and notify the healthcare provider of the supratherapeutic aPTT", "Continue the heparin infusion and recheck aPTT in 6 hours", "Increase the heparin rate to dissolve the clot faster", "Administer vitamin K to reverse the heparin effect"],
    a: 0,
    r: "An aPTT of 120 seconds is significantly above the therapeutic range, placing the client at high risk for hemorrhage. The nurse should stop the infusion and notify the provider. Continuing would increase bleeding risk. Increasing the dose would worsen the situation. Vitamin K reverses warfarin, not heparin; protamine sulfate reverses heparin.",
    s: "Cardiovascular"
  },
  {
    q: "A 38-year-old client suddenly develops severe dyspnea, sharp pleuritic chest pain, tachycardia (HR 128), and SpO2 82% on room air. The client had been on bed rest for 3 days following leg surgery. Which condition does the nurse suspect?",
    o: ["Pulmonary embolism", "Pneumothorax", "Acute myocardial infarction", "Atelectasis"],
    a: 0,
    r: "Sudden dyspnea, pleuritic chest pain, tachycardia, and severe hypoxemia in a post-surgical client on prolonged bed rest are classic signs of pulmonary embolism. Pneumothorax would show absent breath sounds. MI typically presents with substernal pressure. Atelectasis develops gradually and rarely causes this degree of hypoxemia acutely.",
    s: "Cardiovascular"
  },
  {
    q: "A client receiving IV heparin for pulmonary embolism develops heparin-induced thrombocytopenia (HIT). The platelet count has dropped from 220,000 to 85,000/mcL. What is the nurse's priority action?",
    o: ["Discontinue heparin immediately and notify the healthcare provider", "Continue heparin and administer a platelet transfusion", "Reduce the heparin dose by half and monitor platelets daily", "Switch to subcutaneous heparin instead of IV"],
    a: 0,
    r: "HIT is a serious immune-mediated reaction that paradoxically causes both thrombocytopenia and increased thrombosis risk. All forms of heparin must be discontinued immediately. Platelet transfusion can worsen thrombosis in HIT. Reducing the dose or switching routes does not help since HIT is an immune reaction to heparin itself.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is educating a 50-year-old client being discharged on warfarin therapy after DVT. Which statement by the client indicates correct understanding?",
    o: ["I should have regular blood tests to check my INR level", "I can eat as many green leafy vegetables as I want without concern", "I should take extra warfarin if I miss a dose to catch up", "Warfarin starts working immediately, so I do not need any other blood thinners"],
    a: 0,
    r: "Warfarin requires regular INR monitoring to maintain therapeutic anticoagulation (typically INR 2.0-3.0). Vitamin K-rich foods (green leafy vegetables) should be consumed consistently, not avoided or eaten excessively. Double-dosing increases bleeding risk. Warfarin takes several days to reach full effect, requiring bridging with heparin initially.",
    s: "Cardiovascular"
  },
  {
    q: "A 65-year-old client with DVT is prescribed enoxaparin (Lovenox) subcutaneously. Which injection technique should the nurse use?",
    o: ["Inject into the abdominal subcutaneous tissue, alternating sides, without aspirating", "Inject into the deltoid muscle using a 1.5-inch needle", "Inject into the vastus lateralis with aspiration before injecting", "Apply firm massage to the injection site after administration"],
    a: 0,
    r: "Enoxaparin is given subcutaneously, preferably in the abdomen. Aspiration is not recommended as it increases bruising risk. It is not an intramuscular injection. The deltoid and vastus lateralis are IM sites. Massaging the site increases bruising and hematoma formation with anticoagulants.",
    s: "Cardiovascular"
  },
  {
    q: "A 72-year-old client has been on long-term warfarin therapy. The INR result is 5.2 (target 2.0-3.0). The client has no signs of active bleeding. What should the nurse anticipate?",
    o: ["Hold warfarin doses and possibly administer oral vitamin K as ordered", "Continue warfarin at the current dose and recheck INR in one week", "Administer protamine sulfate IV to reverse the effect", "Prepare for emergent blood transfusion"],
    a: 0,
    r: "An INR of 5.2 without active bleeding requires holding warfarin and potentially administering low-dose oral vitamin K to lower the INR to therapeutic range. Continuing the dose would increase bleeding risk. Protamine sulfate reverses heparin, not warfarin. Blood transfusion is for active hemorrhage.",
    s: "Cardiovascular"
  },
  // Topic 6: Peripheral Arterial Disease
  {
    q: "A 68-year-old client with peripheral arterial disease (PAD) reports leg pain when walking two blocks that is relieved by rest. The nurse notes diminished pedal pulses, cool skin, and pale color in both lower extremities. Which finding is most consistent with PAD?",
    o: ["Intermittent claudication with diminished pulses and cool, pale extremities", "Warm, edematous legs with visible varicose veins", "Bilateral lower leg erythema with weeping wounds", "Sharp pain at rest that worsens with leg elevation"],
    a: 0,
    r: "Intermittent claudication (pain with activity relieved by rest) combined with diminished pulses, cool skin, and pallor are classic PAD findings from arterial insufficiency. Warm edematous legs with varicosities indicate venous disease. Erythema with weeping suggests cellulitis or venous stasis. While rest pain occurs in severe PAD, the scenario describes exertional pain.",
    s: "Cardiovascular"
  },
  {
    q: "A 70-year-old client with PAD asks about foot care. Which instruction by the nurse is most important?",
    o: ["Inspect your feet daily and report any cuts, blisters, or color changes to your healthcare provider", "Soak your feet in hot water nightly to improve circulation", "Wear tight-fitting shoes to provide support to the foot", "Use a heating pad on your feet when they feel cold"],
    a: 0,
    r: "Daily foot inspection is critical in PAD because decreased blood flow impairs wound healing and increases infection risk. Small injuries can progress to non-healing ulcers and amputation. Hot water soaks risk burns due to decreased sensation. Tight shoes cause pressure injuries. Heating pads can cause burns without the client feeling them.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is caring for a client with PAD. The client's ankle-brachial index (ABI) is 0.5. What does this result indicate?",
    o: ["Severe peripheral arterial disease with significantly reduced blood flow to the extremities", "Normal arterial perfusion to the lower extremities", "Mild arterial insufficiency requiring lifestyle modifications only", "Venous insufficiency requiring compression stockings"],
    a: 0,
    r: "An ABI of 0.5 indicates severe PAD (normal is 1.0-1.2; mild PAD is 0.71-0.90; moderate is 0.41-0.70; severe is less than 0.40, but 0.5 is at the low moderate/high severity range). This client has significantly compromised arterial perfusion. ABI does not measure venous disease.",
    s: "Cardiovascular"
  },
  {
    q: "A 64-year-old client with PAD is being assessed for arterial vs. venous leg ulcers. Which finding is characteristic of an arterial ulcer?",
    o: ["Deep, well-defined wound with pale or necrotic base located on the toes or bony prominences", "Shallow, irregular wound with granulating base around the medial malleolus", "Large weeping wound with dark pigmented skin surrounding it", "Warm, erythematous wound with purulent drainage and surrounding cellulitis"],
    a: 0,
    r: "Arterial ulcers are typically deep, well-defined ('punched out'), with pale or necrotic wound beds, and occur on toes, heels, and bony prominences due to poor arterial perfusion. Venous ulcers are shallow, irregular, near the medial malleolus. Pigmented weeping wounds suggest venous stasis. Purulent drainage with cellulitis suggests infection, not specifically arterial disease.",
    s: "Cardiovascular"
  },
  // Topic 7: Valvular Heart Disease
  {
    q: "A 58-year-old client with mitral valve stenosis reports increasing dyspnea on exertion and fatigue. The nurse auscultates a low-pitched diastolic murmur at the apex. Which complication should the nurse monitor for?",
    o: ["Atrial fibrillation and pulmonary edema due to left atrial pressure overload", "Aortic dissection from increased aortic root pressure", "Right-sided heart failure from decreased right ventricular filling", "Ventricular septal defect from chronic valve damage"],
    a: 0,
    r: "Mitral stenosis causes blood to back up into the left atrium, causing atrial enlargement, atrial fibrillation, and pulmonary congestion leading to pulmonary edema. Aortic dissection is not directly related. Right-sided heart failure can occur but secondarily to pulmonary hypertension. VSD is a congenital or traumatic condition, not from mitral stenosis.",
    s: "Cardiovascular"
  },
  {
    q: "A 45-year-old client with a mechanical aortic valve replacement is being discharged on lifelong warfarin therapy. Which teaching point is most critical?",
    o: ["Take warfarin exactly as prescribed and never stop it without consulting your healthcare provider, as stopping increases risk of valve thrombosis", "You can take aspirin instead of warfarin on days you feel well", "Warfarin is only needed for the first year after surgery", "You should double your warfarin dose before dental procedures to prevent bleeding"],
    a: 0,
    r: "Mechanical heart valves require lifelong anticoagulation with warfarin to prevent thrombus formation on the prosthetic valve surface. Stopping anticoagulation can cause life-threatening valve thrombosis and embolization. Aspirin cannot replace warfarin for mechanical valves. It is not limited to one year. Doubling the dose before procedures increases bleeding risk.",
    s: "Cardiovascular"
  },
  {
    q: "A 62-year-old client with aortic stenosis is scheduled for valve replacement. Vital signs: BP 118/82, HR 76. The nurse notes a harsh systolic murmur at the right upper sternal border. Which symptom triad should the nurse monitor for that indicates worsening aortic stenosis?",
    o: ["Syncope, angina, and dyspnea on exertion", "Headache, visual changes, and nosebleeds", "Peripheral edema, ascites, and jugular vein distension", "Palpitations, diaphoresis, and tremors"],
    a: 0,
    r: "The classic triad of symptomatic aortic stenosis is syncope (from decreased cerebral perfusion), angina (from increased myocardial oxygen demand), and dyspnea on exertion (from heart failure). The second option suggests hypertensive crisis. The third suggests right heart failure. The fourth suggests hyperthyroidism or anxiety.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is caring for a client with mitral valve prolapse (MVP) who reports palpitations and anxiety. The nurse auscultates a midsystolic click. Which nursing intervention is most appropriate?",
    o: ["Reassure the client that MVP is usually benign, educate about when to seek medical attention, and monitor symptoms", "Prepare the client for emergent valve replacement surgery", "Administer IV amiodarone to control the palpitations", "Restrict all physical activity and place the client on strict bed rest"],
    a: 0,
    r: "MVP is usually benign and the midsystolic click is characteristic. Palpitations and anxiety are common symptoms. The nurse should provide reassurance, education about red flags (chest pain, severe dyspnea, syncope), and symptom monitoring. Emergent surgery is not indicated. IV amiodarone is excessive. Strict bed rest is unnecessary for stable MVP.",
    s: "Cardiovascular"
  },
  // Topic 8: Cardiogenic Shock
  {
    q: "A 66-year-old client 4 hours post-MI develops cardiogenic shock. Vital signs: BP 72/48, HR 128, RR 30, SpO2 84%, urine output 10 mL/hour. Which set of hemodynamic findings would the nurse expect?",
    o: ["Low cardiac output, elevated pulmonary capillary wedge pressure, and high systemic vascular resistance", "High cardiac output, low pulmonary capillary wedge pressure, and low systemic vascular resistance", "Normal cardiac output with low systemic vascular resistance", "Low cardiac output, low pulmonary capillary wedge pressure, and low systemic vascular resistance"],
    a: 0,
    r: "Cardiogenic shock results from pump failure: the heart cannot generate adequate cardiac output (low CO), blood backs up into the lungs (elevated PCWP), and the body compensates by vasoconstricting (high SVR). High CO with low SVR describes distributive shock. The other options do not match the cardiogenic shock profile.",
    s: "Cardiovascular"
  },
  {
    q: "A client in cardiogenic shock is started on norepinephrine (Levophed) IV infusion. Which nursing assessment is most critical during this infusion?",
    o: ["Monitor the IV insertion site frequently for signs of extravasation, which can cause tissue necrosis", "Check blood glucose levels hourly, as norepinephrine causes hyperglycemia", "Monitor for signs of allergic reaction such as urticaria and wheezing", "Assess for hearing changes, as norepinephrine is ototoxic"],
    a: 0,
    r: "Norepinephrine is a potent vasoconstrictor. Extravasation can cause severe tissue necrosis and ischemia. The IV site must be monitored closely, and phentolamine should be available for infiltration. Norepinephrine does not primarily cause hyperglycemia, is not typically allergenic, and is not ototoxic.",
    s: "Cardiovascular"
  },
  {
    q: "A 71-year-old client in cardiogenic shock has an intra-aortic balloon pump (IABP) inserted. Which finding should the nurse report immediately?",
    o: ["Absent left pedal pulse and left foot that is cool and pale", "Heart rate of 86 bpm on the cardiac monitor", "Blood pressure of 92/60 mmHg with the IABP augmentation", "Client reports mild discomfort at the femoral insertion site"],
    a: 0,
    r: "Absent pedal pulse with a cool, pale foot suggests arterial occlusion or compromised perfusion from the IABP catheter, which is a vascular emergency requiring immediate intervention. HR 86 is normal. BP 92/60 may be acceptable with IABP support in shock. Mild insertion site discomfort is expected.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is caring for a client with cardiogenic shock who is receiving dobutamine. The client's blood pressure improves from 70/40 to 96/62 mmHg. The nurse understands dobutamine works primarily by which mechanism?",
    o: ["Increasing myocardial contractility (positive inotropic effect) to improve cardiac output", "Causing peripheral vasoconstriction to raise blood pressure", "Decreasing preload by promoting diuresis", "Blocking calcium channels to reduce afterload"],
    a: 0,
    r: "Dobutamine is a beta-1 agonist that primarily increases myocardial contractility (positive inotropy), thereby improving cardiac output and blood pressure. It has mild vasodilatory effects, not vasoconstrictive. It does not cause diuresis directly. It is not a calcium channel blocker.",
    s: "Cardiovascular"
  },
  // Topic 9: Endocarditis/Pericarditis
  {
    q: "A 34-year-old client with a history of IV drug use presents with fever (39.2 C), new-onset heart murmur, and small painful nodules on the finger pads. Which condition does the nurse suspect?",
    o: ["Infective endocarditis", "Rheumatic heart disease", "Pericarditis", "Myocarditis"],
    a: 0,
    r: "IV drug use is a major risk factor for infective endocarditis. Fever, new heart murmur, and Osler nodes (painful nodules on finger pads from immune complex deposition) are classic findings. Rheumatic heart disease follows streptococcal infections and has different presentation. Pericarditis presents with chest pain and friction rub. Myocarditis presents with heart failure symptoms.",
    s: "Cardiovascular"
  },
  {
    q: "A 28-year-old client presents with sharp, stabbing chest pain that worsens with inspiration and improves when leaning forward. The nurse auscultates a friction rub. Which condition is most likely?",
    o: ["Acute pericarditis", "Acute myocardial infarction", "Pulmonary embolism", "Costochondritis"],
    a: 0,
    r: "Sharp pleuritic chest pain that worsens with inspiration and improves with leaning forward, combined with a pericardial friction rub, is the hallmark of acute pericarditis. MI pain is typically substernal and constant. PE pain is pleuritic but without friction rub. Costochondritis is reproducible with palpation and has no friction rub.",
    s: "Cardiovascular"
  },
  {
    q: "A client with pericarditis develops Beck's triad: hypotension, muffled heart sounds, and distended jugular veins. Which life-threatening complication does the nurse suspect?",
    o: ["Cardiac tamponade", "Tension pneumothorax", "Cardiogenic shock from myocardial infarction", "Pulmonary embolism"],
    a: 0,
    r: "Beck's triad (hypotension, muffled/distant heart sounds, JVD) is the classic presentation of cardiac tamponade, where fluid accumulation in the pericardial sac compresses the heart and impairs filling. Tension pneumothorax has absent breath sounds and tracheal deviation. Cardiogenic shock may have similar hypotension but with different heart sounds. PE does not produce muffled heart sounds.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is caring for a client with infective endocarditis who is receiving IV antibiotics. Which assessment finding should the nurse report immediately?",
    o: ["Sudden onset of hemiplegia and aphasia, suggesting embolic stroke", "Temperature of 37.8 C during the first week of antibiotic therapy", "Positive blood cultures at the start of treatment", "Mild fatigue and malaise during treatment"],
    a: 0,
    r: "Infective endocarditis carries a high risk of septic emboli. Sudden hemiplegia and aphasia indicate stroke from vegetation embolization to the brain, requiring immediate intervention. Low-grade fever early in treatment is expected. Positive initial cultures are expected. Fatigue is a common symptom of the underlying infection.",
    s: "Cardiovascular"
  },
  {
    q: "A 40-year-old client with pericarditis is prescribed colchicine and ibuprofen. Which instruction should the nurse provide?",
    o: ["Take ibuprofen with food to reduce gastrointestinal irritation, and report any signs of recurrent chest pain", "Stop taking both medications as soon as chest pain resolves to avoid side effects", "Avoid physical activity permanently, as it will worsen pericarditis", "Take both medications on an empty stomach for better absorption"],
    a: 0,
    r: "NSAIDs like ibuprofen should be taken with food to minimize GI irritation. The client should be educated to complete the full course and report symptom recurrence. Stopping medications prematurely can lead to recurrent pericarditis. Activity restrictions are temporary, not permanent. Taking NSAIDs on an empty stomach increases GI bleeding risk.",
    s: "Cardiovascular"
  },
  // Topic 10: Aortic Aneurysm
  {
    q: "A 72-year-old male client with a known 5.2 cm abdominal aortic aneurysm (AAA) presents with sudden, severe abdominal pain radiating to the back, blood pressure 78/42 mmHg, and heart rate 134 bpm. What is the nurse's priority action?",
    o: ["Establish large-bore IV access, initiate rapid fluid resuscitation, and prepare for emergent surgery", "Administer oral antihypertensive medication to reduce pressure on the aneurysm", "Apply abdominal binder for comfort and administer oral analgesics", "Encourage the client to walk to determine the source of pain"],
    a: 0,
    r: "Sudden severe abdominal pain radiating to the back with hemodynamic instability in a client with known AAA strongly suggests aneurysm rupture, a surgical emergency. Large-bore IV access and rapid volume resuscitation are critical while preparing for surgery. The client is hypotensive, so antihypertensives would be harmful. Oral analgesics and walking are inappropriate for a hemodynamically unstable client.",
    s: "Cardiovascular"
  },
  {
    q: "A 68-year-old client with a thoracic aortic aneurysm is prescribed labetalol and enalapril. The client asks why blood pressure control is so important. Which response by the nurse is correct?",
    o: ["Keeping blood pressure controlled reduces the force on the weakened aortic wall, decreasing the risk of rupture or further enlargement", "These medications will shrink the aneurysm back to normal size", "Blood pressure medication prevents new aneurysms from forming in other vessels", "These medications are given to prevent blood clots inside the aneurysm"],
    a: 0,
    r: "Controlling blood pressure reduces shear stress on the weakened aortic wall, slowing aneurysm growth and reducing rupture risk. Medications do not shrink aneurysms. They do not prevent new aneurysm formation. While thrombus can form in aneurysms, the primary goal of BP control is wall stress reduction.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is monitoring a post-operative client who underwent open surgical repair of an abdominal aortic aneurysm. Which assessment finding requires immediate intervention?",
    o: ["Urine output of 15 mL over the past 2 hours, indicating possible renal ischemia", "Mild incisional pain rated 3/10 managed with ordered analgesics", "Temperature of 37.4 C on postoperative day 1", "Hemoglobin of 11.0 g/dL on the first postoperative day"],
    a: 0,
    r: "Urine output less than 30 mL/hour post-AAA repair may indicate renal artery occlusion or hypoperfusion from aortic cross-clamping, requiring immediate assessment and intervention. Mild pain is expected and managed. Low-grade temperature is common postoperatively. Hemoglobin of 11.0 is acceptable after surgery.",
    s: "Cardiovascular"
  },
  // Topic 11: Cardiac Catheterization
  {
    q: "A 60-year-old client is scheduled for cardiac catheterization via the right femoral artery. The client reports an allergy to shellfish. What should the nurse do?",
    o: ["Notify the healthcare provider, as the client may need premedication with corticosteroids and antihistamines before contrast dye administration", "Cancel the procedure since shellfish allergy is an absolute contraindication", "Proceed with the procedure as shellfish allergy is unrelated to contrast dye", "Administer epinephrine prophylactically before the procedure"],
    a: 0,
    r: "While the direct link between shellfish allergy and contrast dye reaction has been questioned, shellfish allergy may indicate iodine sensitivity. The prudent approach is to notify the provider for possible premedication with corticosteroids and diphenhydramine. It is not an absolute contraindication. Proceeding without precautions is not safe practice. Prophylactic epinephrine is not standard.",
    s: "Cardiovascular"
  },
  {
    q: "A client returns from cardiac catheterization via the right radial artery with a TR Band in place. Which nursing assessment is most important?",
    o: ["Assess the right hand for capillary refill, sensation, and radial pulse distal to the TR Band", "Check the client's left pedal pulses every 15 minutes", "Maintain strict bed rest with the right arm immobilized for 24 hours", "Apply ice to the right wrist to reduce swelling at the insertion site"],
    a: 0,
    r: "After radial artery catheterization, the TR Band provides hemostasis. The nurse must assess distal perfusion (capillary refill, sensation, and pulse) in the right hand to detect vascular compromise. Left pedal pulses are irrelevant for radial access. Strict bed rest is required for femoral access, not radial. Ice is not routinely indicated.",
    s: "Cardiovascular"
  },
  {
    q: "A 55-year-old client had a cardiac catheterization 2 hours ago via the femoral approach. The nurse notes a rapidly expanding hematoma at the groin site. Blood pressure is 94/58 mmHg. What is the priority action?",
    o: ["Apply firm manual pressure above the puncture site and call for immediate assistance", "Apply a warm compress to promote reabsorption of the hematoma", "Elevate the affected leg to reduce venous pressure at the site", "Document the hematoma size and recheck in 30 minutes"],
    a: 0,
    r: "A rapidly expanding hematoma with hypotension indicates active arterial bleeding at the femoral puncture site. Immediate firm pressure proximal to the site controls hemorrhage while calling for help. Warm compresses do not control arterial bleeding. Leg elevation does not address arterial hemorrhage. Waiting 30 minutes risks hemodynamic collapse.",
    s: "Cardiovascular"
  },
  {
    q: "A client is being prepared for cardiac catheterization. The nurse reviews lab results and notes a creatinine level of 2.8 mg/dL (normal 0.6-1.2 mg/dL). Why is this finding significant?",
    o: ["Elevated creatinine indicates impaired kidney function, increasing the risk of contrast-induced nephropathy", "Elevated creatinine indicates liver disease and increased bleeding risk during the procedure", "Elevated creatinine is a normal finding in clients with heart disease", "Elevated creatinine means the client has an infection and the procedure should be delayed"],
    a: 0,
    r: "Creatinine 2.8 mg/dL indicates significant renal impairment. Contrast dye used during catheterization is nephrotoxic and can worsen kidney function (contrast-induced nephropathy). The provider should be notified for possible hydration protocol or renal-protective measures. Creatinine reflects kidney, not liver, function. It is not a normal cardiac finding. It does not indicate infection.",
    s: "Cardiovascular"
  },
  // Topic 12: ECG Interpretation Basics
  {
    q: "A nurse reviewing a client's 12-lead ECG notes that the PR interval is consistently 0.28 seconds. The rhythm is regular with a rate of 72 bpm. Which condition does this finding suggest?",
    o: ["First-degree AV block", "Normal sinus rhythm", "Atrial fibrillation", "Bundle branch block"],
    a: 0,
    r: "A PR interval greater than 0.20 seconds indicates delayed conduction through the AV node, which defines first-degree AV block. Normal PR interval is 0.12-0.20 seconds. NSR would have a normal PR interval. Atrial fibrillation has no measurable PR interval. Bundle branch block widens the QRS complex, not the PR interval.",
    s: "Cardiovascular",
    image: imgFirstDegreeBlockExam
  },
  {
    q: "A nurse is analyzing a client's telemetry strip. The rhythm shows regular P waves at a rate of 80 bpm, but the QRS complexes occur at a rate of 36 bpm with no relationship between P waves and QRS complexes. Which dysrhythmia does this represent?",
    o: ["Third-degree (complete) heart block", "Second-degree AV block Type I", "Atrial flutter", "Sinus bradycardia"],
    a: 0,
    r: "Complete AV dissociation with P waves occurring independently of QRS complexes at different rates defines third-degree heart block. The atria fire at 80 bpm while the ventricles escape at 36 bpm with no conduction between them. Type I shows progressive PR prolongation. Atrial flutter shows sawtooth waves. Sinus bradycardia has coordinated P-QRS complexes.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse reviews an ECG that shows tall, peaked T waves, widened QRS complexes, and a shortened QT interval. The client's potassium level is 6.8 mEq/L. Which intervention should the nurse prioritize?",
    o: ["Administer IV calcium gluconate as ordered to stabilize the myocardium and prevent fatal dysrhythmias", "Administer IV potassium to correct the ECG abnormalities", "Encourage the client to eat a banana to increase potassium levels", "Apply a 12-lead ECG and wait for the healthcare provider to review it"],
    a: 0,
    r: "Hyperkalemia (K+ 6.8) with ECG changes (peaked T waves, wide QRS) is a medical emergency. IV calcium gluconate stabilizes the cardiac membrane to prevent fatal dysrhythmias while other treatments reduce potassium. Administering more potassium would be fatal. Eating potassium-rich foods worsens the problem. Waiting risks cardiac arrest.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse notes ST-segment depression in leads V1 through V4 on a client's ECG. The client reports substernal chest pressure. Which condition do these findings most likely indicate?",
    o: ["Myocardial ischemia", "Pericarditis", "Left ventricular hypertrophy", "Normal ECG variant"],
    a: 0,
    r: "ST-segment depression, especially in the precordial leads with chest pain, is a strong indicator of myocardial ischemia (subendocardial). Pericarditis typically shows diffuse ST elevation. LVH can cause ST changes but in a different pattern and without acute chest symptoms. This is not a normal variant when associated with symptoms.",
    s: "Cardiovascular"
  },
  // Topic 13: Anticoagulant Therapy
  {
    q: "A 72-year-old client is taking rivaroxaban (Xarelto) for atrial fibrillation. The client asks if they need routine blood testing like their friend who takes warfarin. Which response by the nurse is correct?",
    o: ["Rivaroxaban does not require routine INR monitoring because it has a predictable dose-response, but you should still have regular follow-up appointments", "Yes, you need weekly INR checks just like warfarin", "You do not need any monitoring or follow-up while on rivaroxaban", "You only need blood tests if you notice signs of bleeding"],
    a: 0,
    r: "Direct oral anticoagulants (DOACs) like rivaroxaban have predictable pharmacokinetics and do not require routine coagulation monitoring like warfarin. However, regular follow-up for renal function, hemoglobin, and clinical assessment is still important. INR monitoring is specific to warfarin. No follow-up at all is unsafe. Waiting for bleeding symptoms is reactive, not proactive.",
    s: "Cardiovascular"
  },
  {
    q: "A client on IV heparin develops bleeding from the gums and a nosebleed. The aPTT is 110 seconds (therapeutic range 60-80 seconds). Which medication should the nurse prepare to administer?",
    o: ["Protamine sulfate, the antidote for heparin", "Vitamin K (phytonadione), the antidote for warfarin", "Tranexamic acid, to stop fibrinolysis", "Aminocaproic acid, to inhibit plasminogen activation"],
    a: 0,
    r: "Protamine sulfate is the specific antidote for unfractionated heparin. It neutralizes heparin by forming a stable complex. Vitamin K reverses warfarin, not heparin. While tranexamic acid and aminocaproic acid can help with bleeding, protamine sulfate is the specific reversal agent for heparin overdose.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is discharging a client on warfarin therapy. The client takes a daily multivitamin containing vitamin K 80 mcg. What advice should the nurse give?",
    o: ["Maintain consistent daily vitamin K intake; do not stop or change the multivitamin without consulting the provider", "Stop taking the multivitamin immediately because any vitamin K will make warfarin ineffective", "Double the warfarin dose to overcome the vitamin K in the multivitamin", "Switch to a multivitamin without any vitamin K for safer anticoagulation"],
    a: 0,
    r: "Consistency in vitamin K intake is key with warfarin therapy. The warfarin dose is adjusted based on the client's usual diet and supplements. Abrupt changes in vitamin K intake affect INR. Stopping the vitamin may cause INR to rise dangerously. Doubling the dose is unsafe. Switching may alter the established INR equilibrium.",
    s: "Cardiovascular"
  },
  {
    q: "A 68-year-old client on enoxaparin (Lovenox) for DVT prevention develops a platelet count of 82,000/mcL (previously 210,000/mcL). The nurse suspects heparin-induced thrombocytopenia. Which assessment finding would further support this suspicion?",
    o: ["New onset of warmth, redness, and swelling in the opposite leg suggesting a new clot", "Increased bruising at the injection sites only", "Elevated white blood cell count indicating infection", "Decreased hemoglobin from chronic blood loss"],
    a: 0,
    r: "HIT paradoxically causes thrombocytopenia AND thrombosis formation. A new DVT (warmth, redness, swelling in the opposite leg) in the setting of declining platelets on heparin products strongly supports HIT. Bruising at injection sites alone is common. Elevated WBC suggests infection. Decreased hemoglobin could have many causes.",
    s: "Cardiovascular"
  },
  {
    q: "A client taking dabigatran (Pradaxa) for stroke prevention in atrial fibrillation is scheduled for an emergency appendectomy. Which reversal agent should the nurse anticipate?",
    o: ["Idarucizumab (Praxbind), the specific reversal agent for dabigatran", "Protamine sulfate, the reversal agent for heparin", "Vitamin K, the reversal agent for warfarin", "Fresh frozen plasma to replace clotting factors"],
    a: 0,
    r: "Idarucizumab (Praxbind) is the specific monoclonal antibody fragment that reverses the anticoagulant effect of dabigatran. Protamine reverses heparin. Vitamin K reverses warfarin. FFP may provide some hemostatic benefit but is not the specific reversal agent for dabigatran.",
    s: "Cardiovascular"
  },
  // Topic 14: Cardiac Rehabilitation
  {
    q: "A 58-year-old client who had a STEMI 2 weeks ago is starting Phase I cardiac rehabilitation. Which activity is appropriate for this phase?",
    o: ["Gradual range-of-motion exercises and supervised ambulation in the hallway", "Running on a treadmill for 30 minutes at moderate intensity", "Lifting 20-pound weights to rebuild strength", "Swimming laps for cardiovascular conditioning"],
    a: 0,
    r: "Phase I cardiac rehabilitation (inpatient phase) involves low-level activities such as self-care, range-of-motion exercises, and short supervised walks to prevent deconditioning. Treadmill running, weight lifting, and swimming are too vigorous for early post-MI recovery and appropriate for later rehabilitation phases.",
    s: "Cardiovascular"
  },
  {
    q: "A client in Phase II cardiac rehabilitation asks how to monitor exercise intensity. Which response by the nurse is most appropriate?",
    o: ["Use the rating of perceived exertion (RPE) scale and stop if you experience chest pain, severe dyspnea, or dizziness", "Exercise until you feel exhausted to get the maximum benefit", "Your heart rate does not matter as long as you complete the exercise session", "Only aerobic exercise is beneficial; strength training should be avoided entirely"],
    a: 0,
    r: "RPE and symptom monitoring (chest pain, severe dyspnea, dizziness) are practical tools for cardiac rehab clients to self-monitor intensity. Exercising to exhaustion risks cardiac events. Heart rate monitoring is important for safety. Both aerobic and appropriate resistance training are recommended in cardiac rehabilitation.",
    s: "Cardiovascular"
  },
  {
    q: "A 65-year-old client recovering from coronary artery bypass graft (CABG) surgery is in Phase II cardiac rehabilitation. The client reports being afraid to exercise because of fear of another cardiac event. What should the nurse do?",
    o: ["Acknowledge the fear, provide education about the safety of supervised exercise, and encourage gradual progression", "Tell the client their fears are unfounded and they must exercise immediately", "Excuse the client from all exercise and suggest rest instead", "Refer the client to a psychiatrist for anxiety disorder"],
    a: 0,
    r: "Fear and anxiety after cardiac events are common and valid. The nurse should validate feelings while educating about the supervised, safe nature of cardiac rehab, which actually reduces future cardiac event risk. Dismissing fears damages rapport. Excusing from exercise eliminates rehabilitation benefits. A psychiatry referral is premature without assessing further.",
    s: "Cardiovascular"
  },
  // Topic 15: Heart Transplant
  {
    q: "A 52-year-old client is 3 months post-heart transplant and presents with low-grade fever, fatigue, and new-onset dyspnea. Which complication should the nurse suspect?",
    o: ["Acute organ rejection", "Common cold that will resolve without treatment", "Expected post-transplant recovery symptoms", "Pulmonary embolism unrelated to the transplant"],
    a: 0,
    r: "Low-grade fever, fatigue, and dyspnea in a transplant recipient may indicate acute rejection, which requires immediate evaluation including endomyocardial biopsy. Even minor symptoms in immunosuppressed clients must be taken seriously. A common cold is possible but rejection must be ruled out first. These are not normal recovery symptoms at 3 months. While PE is possible, rejection is the primary concern.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is caring for a post-heart transplant client on tacrolimus and mycophenolate. The client asks why they cannot stop the medications once they feel better. Which response is most accurate?",
    o: ["Immunosuppressive medications must be taken lifelong to prevent your body's immune system from rejecting the transplanted heart", "You can gradually wean off these medications after 2 years if your heart function is good", "These medications are temporary and will be replaced with herbal supplements", "You only need the medications when you feel symptoms of rejection"],
    a: 0,
    r: "Heart transplant recipients require lifelong immunosuppression to prevent rejection. The immune system will always recognize the donor heart as foreign. Medications cannot be weaned off. Herbal supplements cannot replace immunosuppressants. Taking medications only with symptoms would allow rejection to progress beyond treatment.",
    s: "Cardiovascular"
  },
  {
    q: "A heart transplant recipient asks why they should avoid being around people who are sick. Which explanation by the nurse is most accurate?",
    o: ["Your immunosuppressive medications reduce your body's ability to fight infections, making even minor illnesses potentially serious", "People who are sick may cause your transplanted heart to be rejected", "You are at risk of transmitting your immunosuppressant medications to others", "This restriction only applies during the first month after transplant"],
    a: 0,
    r: "Immunosuppressive therapy weakens the immune response, making transplant recipients highly susceptible to infections that healthy people could easily fight off. Sick people do not directly cause rejection. Medications are not transmissible. Infection risk is lifelong while on immunosuppression, not limited to the first month.",
    s: "Cardiovascular"
  },
  {
    q: "A 48-year-old heart transplant recipient reports not feeling chest pain during exercise, even when they are working very hard. The nurse explains this is because:",
    o: ["The transplanted heart is denervated, meaning it does not receive pain signals from the nervous system", "The immunosuppressive medications block all pain receptors", "The surgery cured any underlying coronary artery disease permanently", "The client has developed a high pain tolerance since transplant"],
    a: 0,
    r: "The transplanted heart is surgically denervated (nerve connections are severed), so the recipient cannot feel typical cardiac pain (angina). This means they must rely on other indicators of cardiac distress. Immunosuppressants do not block pain. CAD can develop in transplanted hearts. Pain tolerance is not the explanation.",
    s: "Cardiovascular"
  },
  // Additional MCQ: Heart Failure
  {
    q: "A 76-year-old client with heart failure is prescribed sacubitril/valsartan (Entresto). The nurse notes the client was previously taking enalapril. Which safety concern should the nurse identify?",
    o: ["There must be a 36-hour washout period between stopping an ACE inhibitor and starting Entresto to prevent angioedema", "Entresto can be started immediately after the last dose of enalapril", "Entresto should be taken with the ACE inhibitor for maximum benefit", "Entresto is contraindicated in clients over 75 years of age"],
    a: 0,
    r: "Sacubitril/valsartan (Entresto) must not be given within 36 hours of the last ACE inhibitor dose due to the risk of life-threatening angioedema from combined neprilysin and ACE inhibition. Immediate switching is dangerous. Concurrent use is contraindicated. There is no age contraindication.",
    s: "Cardiovascular"
  },
  {
    q: "A client with right-sided heart failure presents with jugular vein distension, hepatomegaly, and peripheral edema. Which additional finding would the nurse expect?",
    o: ["Weight gain and ascites from systemic venous congestion", "Frothy pink sputum from pulmonary edema", "Elevated troponin from myocardial injury", "Petechiae from thrombocytopenia"],
    a: 0,
    r: "Right-sided heart failure causes systemic venous congestion resulting in JVD, hepatomegaly, peripheral edema, weight gain, and ascites. Frothy pink sputum is characteristic of left-sided heart failure with pulmonary edema. Troponin elevation indicates MI. Petechiae relate to platelet disorders.",
    s: "Cardiovascular"
  },
  // Additional MCQ: ACS
  {
    q: "A 57-year-old client post-MI is being discharged. Which statement by the client indicates a need for further teaching about activity after discharge?",
    o: ["I plan to start running 5 km daily starting tomorrow to get my strength back quickly", "I will gradually increase my activity as directed by my healthcare provider", "I should stop exercising and rest if I develop chest pain or shortness of breath", "I plan to attend cardiac rehabilitation sessions as recommended"],
    a: 0,
    r: "Vigorous exercise like running 5 km immediately after MI is dangerous and could precipitate another cardiac event. Activity should be gradually increased following medical guidance and cardiac rehabilitation protocols. The other statements demonstrate appropriate understanding of post-MI activity management.",
    s: "Cardiovascular"
  },
  {
    q: "A 63-year-old client is receiving tissue plasminogen activator (tPA) for an acute STEMI. Which finding should the nurse report immediately?",
    o: ["Sudden change in level of consciousness and unilateral weakness suggesting intracranial hemorrhage", "Slight oozing from an IV insertion site", "Bruising around the IV site", "Heart rate decrease from 110 to 88 bpm after treatment"],
    a: 0,
    r: "Intracranial hemorrhage is the most feared complication of thrombolytic therapy. Sudden neurological changes (altered LOC, unilateral weakness) require immediate discontinuation of tPA and emergent CT scan. Slight oozing and bruising at IV sites are expected minor effects. Heart rate improvement likely indicates reperfusion.",
    s: "Cardiovascular"
  },
  // Additional MCQ: Hypertension
  {
    q: "A 50-year-old client asks about risk factors for hypertension. Which factor is non-modifiable?",
    o: ["Family history of hypertension in both parents", "High sodium diet", "Physical inactivity and sedentary lifestyle", "Excessive alcohol consumption"],
    a: 0,
    r: "Family history is a non-modifiable risk factor for hypertension, as genetic predisposition cannot be changed. Diet, exercise, and alcohol consumption are all modifiable lifestyle factors that can be adjusted to reduce hypertension risk.",
    s: "Cardiovascular"
  },
  {
    q: "A 62-year-old client taking hydrochlorothiazide (HCTZ) for hypertension reports muscle cramps and weakness. The nurse checks lab results and finds potassium 2.9 mEq/L. Which dietary counseling should the nurse provide?",
    o: ["Increase dietary potassium by eating bananas, oranges, potatoes, and spinach", "Reduce fluid intake to concentrate the potassium in the blood", "Increase sodium intake to balance the electrolytes", "Eat more red meat to improve muscle strength"],
    a: 0,
    r: "HCTZ is a thiazide diuretic that causes potassium loss. With K+ 2.9 mEq/L (critically low), the client needs potassium supplementation and dietary sources rich in potassium (bananas, oranges, potatoes, spinach). Fluid restriction does not correct hypokalemia. Sodium increase worsens hypertension. Red meat is not particularly high in potassium.",
    s: "Cardiovascular"
  },
  // Additional MCQ: Dysrhythmias
  {
    q: "A 55-year-old client with an implantable cardioverter-defibrillator (ICD) reports receiving a shock while at rest. The client is asymptomatic and the rhythm shows normal sinus rhythm. What should the nurse advise?",
    o: ["Contact the healthcare provider to evaluate the ICD for possible inappropriate discharge", "Reassure the client that occasional shocks are normal and nothing needs to be done", "Tell the client to remove the ICD immediately", "Administer amiodarone to prevent future shocks"],
    a: 0,
    r: "An ICD shock during rest with a current normal sinus rhythm suggests possible inappropriate discharge (device malfunction, lead fracture, or electromagnetic interference). The client should contact their provider for ICD interrogation. While occasional appropriate shocks can occur, shocks at rest without symptoms warrant investigation. Removing an ICD requires surgery. Medication decisions require provider evaluation.",
    s: "Cardiovascular"
  },
  {
    q: "A client on continuous telemetry monitoring shows a rhythm with a sawtooth pattern at a rate of approximately 300 atrial waves per minute with a ventricular rate of 75 bpm. Which dysrhythmia does the nurse identify?",
    o: ["Atrial flutter with 4:1 conduction", "Atrial fibrillation with controlled rate", "Ventricular tachycardia", "Sinus tachycardia"],
    a: 0,
    r: "A sawtooth (flutter wave) pattern at approximately 300 bpm with a ventricular rate of 75 bpm indicates atrial flutter with 4:1 conduction (300/4 = 75). Atrial fibrillation has an irregularly irregular rhythm without flutter waves. VT has wide QRS complexes. Sinus tachycardia has normal P waves at 100-150 bpm.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse notes multifocal premature ventricular contractions (PVCs) on a client's telemetry. The client has just had an MI. Why is this finding particularly concerning?",
    o: ["Multifocal PVCs indicate myocardial irritability and increase the risk for ventricular tachycardia or fibrillation", "Multifocal PVCs are a normal finding after MI and do not require treatment", "PVCs only become dangerous if they occur more than 100 times per day", "Multifocal PVCs indicate atrial, not ventricular, dysfunction"],
    a: 0,
    r: "Multifocal PVCs (arising from multiple ectopic foci) in the setting of acute MI indicate significant myocardial irritability. The ischemic myocardium is electrically unstable and multifocal PVCs can deteriorate into ventricular tachycardia or fibrillation. They are not benign post-MI. Frequency alone does not determine danger. PVCs are ventricular, not atrial.",
    s: "Cardiovascular"
  },
  // Additional MCQ: DVT/PE
  {
    q: "A nurse is educating a 46-year-old client about DVT prevention before a long international flight. Which recommendation is most appropriate?",
    o: ["Walk in the aisle periodically, perform ankle exercises while seated, and stay well-hydrated", "Remain seated for the entire flight to minimize fall risk", "Cross your legs at the knee for comfort during the flight", "Take aspirin daily for a week before the flight to thin the blood"],
    a: 0,
    r: "DVT prevention during long flights includes frequent movement (walking, ankle pumps), adequate hydration, and avoiding prolonged immobility. Remaining seated increases DVT risk. Crossing legs compresses veins and impedes blood flow. Aspirin alone is insufficient DVT prophylaxis and self-prescribing medication is not recommended.",
    s: "Cardiovascular",
    image: imgDVTExam
  },
  {
    q: "A client with a confirmed pulmonary embolism is started on a heparin drip. The initial aPTT is 28 seconds (control 25-35 seconds). Six hours later, the aPTT is 45 seconds. The therapeutic target is 60-80 seconds. What should the nurse anticipate?",
    o: ["Increasing the heparin infusion rate as ordered to reach therapeutic aPTT", "Discontinuing the heparin infusion since the aPTT has already increased", "Maintaining the current rate and rechecking in 24 hours", "Administering protamine sulfate to prevent over-anticoagulation"],
    a: 0,
    r: "The aPTT of 45 seconds is below the therapeutic range (60-80 seconds), indicating subtherapeutic anticoagulation. The heparin rate should be increased per protocol to achieve therapeutic aPTT. Discontinuing would leave the PE untreated. Waiting 24 hours risks clot extension. Protamine is the antidote and is not indicated when the aPTT is subtherapeutic.",
    s: "Cardiovascular"
  },
  // Additional MCQ: PAD
  {
    q: "A client with PAD and diabetes has a small ulcer on the right great toe. The wound is dry with no granulation tissue. Which wound care approach should the nurse anticipate?",
    o: ["Keep the wound clean, apply moist wound dressing, protect from pressure, and optimize blood glucose control", "Apply compression bandaging to promote wound healing", "Soak the foot in warm water with Epsom salts twice daily", "Debride the wound aggressively and apply hydrogen peroxide", ],
    a: 0,
    r: "Arterial ulcers in diabetic clients require moisture balance, protection from further injury, and blood glucose optimization to promote healing. Compression bandaging is for venous ulcers and can worsen arterial insufficiency. Soaking increases maceration risk. Aggressive debridement and hydrogen peroxide can damage fragile tissue.",
    s: "Cardiovascular"
  },
  // Additional MCQ: Valvular
  {
    q: "A 50-year-old client with a history of rheumatic fever as a child presents for a routine assessment. The nurse auscultates a diastolic murmur at the apex. Which valve disorder does the nurse suspect?",
    o: ["Mitral stenosis from prior rheumatic carditis", "Aortic stenosis from degenerative calcification", "Tricuspid regurgitation from right ventricular dilation", "Pulmonic stenosis from congenital defect"],
    a: 0,
    r: "Rheumatic fever damages the mitral valve, causing stenosis. A diastolic murmur heard best at the apex (mitral area) is characteristic of mitral stenosis. Aortic stenosis produces a systolic murmur at the right upper sternal border. Tricuspid regurgitation produces a systolic murmur at the left lower sternal border. Pulmonic stenosis is rare in adults without congenital disease.",
    s: "Cardiovascular"
  },
  // Additional MCQ: Cardiogenic Shock
  {
    q: "A nurse is caring for a client in cardiogenic shock who has cold, clammy skin, a weak thready pulse, and altered mental status. The nurse understands these findings are caused by:",
    o: ["Inadequate cardiac output resulting in poor tissue perfusion", "Excessive vasodilation from sepsis", "Fluid volume deficit from hemorrhage", "Allergic reaction causing histamine release"],
    a: 0,
    r: "Cardiogenic shock results from pump failure with inadequate cardiac output, leading to poor tissue perfusion. Cold clammy skin (peripheral vasoconstriction), weak pulse (low CO), and altered mental status (cerebral hypoperfusion) are classic findings. Vasodilation describes distributive shock. Hemorrhage causes hypovolemic shock. Allergic reaction causes anaphylaxis.",
    s: "Cardiovascular"
  },
  // Additional MCQ: Endocarditis/Pericarditis
  {
    q: "A client with endocarditis is to receive prophylactic antibiotics before a dental procedure. Which client in the nurse's care is at highest risk for endocarditis and should receive prophylaxis?",
    o: ["A client with a prosthetic heart valve", "A client with well-controlled hypertension", "A client with a history of migraine headaches", "A client with a previous appendectomy"],
    a: 0,
    r: "Prosthetic heart valves carry the highest risk for infective endocarditis and are a primary indication for prophylactic antibiotics before invasive dental procedures. Hypertension, migraines, and previous appendectomy do not increase endocarditis risk.",
    s: "Cardiovascular"
  },
  // Additional MCQ: Aortic Aneurysm
  {
    q: "A 74-year-old male client is being screened for abdominal aortic aneurysm. Which risk factor is most significant for AAA development?",
    o: ["History of smoking for 30 years", "History of type 2 diabetes mellitus", "Body mass index of 23 (normal weight)", "Regular aerobic exercise"],
    a: 0,
    r: "Smoking is the strongest modifiable risk factor for AAA development, causing oxidative stress and inflammation that weakens the aortic wall. Male sex and age over 65 are additional risk factors. Diabetes, while a cardiovascular risk factor, is not as strongly linked to AAA. Normal BMI and exercise are protective factors.",
    s: "Cardiovascular"
  },
  // Additional MCQ: Cardiac Catheterization
  {
    q: "A client scheduled for cardiac catheterization takes metformin for type 2 diabetes. The nurse knows that metformin should be:",
    o: ["Held for 48 hours after the procedure due to the risk of contrast-induced lactic acidosis", "Doubled on the day of the procedure to manage stress hyperglycemia", "Continued without interruption throughout the procedure", "Replaced with insulin glargine permanently after catheterization"],
    a: 0,
    r: "Metformin is held before and for 48 hours after contrast dye administration due to the risk of contrast-induced nephropathy leading to lactic acidosis. The kidneys must be functioning properly to clear metformin safely. Doubling the dose is dangerous. It should be resumed once renal function is confirmed. Permanent replacement is unnecessary.",
    s: "Cardiovascular"
  },
  // Additional MCQ: ECG
  {
    q: "A nurse analyzes an ECG and finds a QT interval of 560 ms (corrected). The client is on a medication known to prolong QT. Which dysrhythmia is the client at risk for?",
    o: ["Torsades de pointes, a polymorphic ventricular tachycardia", "Atrial fibrillation from atrial conduction delay", "First-degree AV block from prolonged PR interval", "Sinus bradycardia from enhanced vagal tone"],
    a: 0,
    r: "Prolonged QT interval (normal QTc less than 440 ms in males, 460 ms in females) predisposes to Torsades de pointes, a dangerous polymorphic ventricular tachycardia that can degenerate into ventricular fibrillation. QT prolongation affects ventricular repolarization, not atrial conduction, AV conduction, or sinus rate.",
    s: "Cardiovascular"
  },
  // Additional MCQ: Anticoagulant
  {
    q: "A client on warfarin therapy has an INR of 1.4 (target 2.0-3.0). The client has not changed diet or missed any doses. What does this INR suggest?",
    o: ["The warfarin dose may need to be increased, as the client is not adequately anticoagulated", "The warfarin is working perfectly and no changes are needed", "The client is over-anticoagulated and at risk for bleeding", "The client should be switched to heparin immediately"],
    a: 0,
    r: "An INR of 1.4 is below the therapeutic range of 2.0-3.0, meaning the client is inadequately anticoagulated and at risk for thromboembolic events. The provider may need to increase the dose. This is not therapeutic. An INR of 1.4 is subtherapeutic, not supra. Switching to heparin is not indicated for dose adjustment.",
    s: "Cardiovascular"
  },
  // Additional MCQ: Cardiac Rehab
  {
    q: "A 62-year-old client in cardiac rehabilitation reports feeling dizzy during exercise. Heart rate is 158 bpm and blood pressure is 168/100 mmHg. What should the nurse do?",
    o: ["Stop the exercise immediately, have the client sit down, and monitor vital signs until stable", "Encourage the client to push through the dizziness to build endurance", "Increase the exercise intensity to improve cardiovascular fitness", "Administer sublingual nitroglycerin immediately"],
    a: 0,
    r: "Dizziness with elevated heart rate and blood pressure during cardiac rehab indicates the client has exceeded safe exercise limits. Exercise should be stopped, the client should rest, and vital signs should be monitored. Pushing through risks cardiac events. Increasing intensity is dangerous. Nitroglycerin is for chest pain, not exercise-induced hypertension.",
    s: "Cardiovascular"
  },
  // Additional MCQ: Heart Transplant
  {
    q: "A heart transplant recipient on cyclosporine develops elevated creatinine levels over several months. Which complication does the nurse suspect?",
    o: ["Cyclosporine-induced nephrotoxicity", "Acute cardiac rejection", "Infection from immunosuppression", "Normal aging of the transplanted heart"],
    a: 0,
    r: "Cyclosporine is nephrotoxic, and chronic use can cause progressive renal impairment evidenced by rising creatinine. This is one of the most significant long-term complications of calcineurin inhibitor therapy. Cardiac rejection presents with cardiac symptoms. Infection would show other systemic signs. Rising creatinine is not from normal aging.",
    s: "Cardiovascular"
  },
  // More MCQ distributed across topics
  {
    q: "A 74-year-old client with chronic heart failure has been placed on fluid restriction of 1,500 mL per day. The client reports extreme thirst. Which intervention is most helpful?",
    o: ["Offer ice chips and suggest rinsing the mouth with cold water to relieve thirst without exceeding fluid limits", "Increase the fluid restriction to 2,500 mL per day for comfort", "Tell the client to drink as much as they want since thirst indicates dehydration", "Provide caffeinated beverages to suppress thirst"],
    a: 0,
    r: "Ice chips provide oral moisture while consuming less volume than drinking. Mouth rinsing relieves thirst sensation without significant fluid intake. Increasing fluids contradicts the prescribed restriction. Thirst in HF does not indicate dehydration. Caffeine is a mild diuretic but does not effectively suppress thirst and may cause other issues.",
    s: "Cardiovascular"
  },
  {
    q: "A 59-year-old client presents with sudden onset of palpitations, lightheadedness, and blood pressure 82/50. The ECG shows a wide-complex tachycardia at a rate of 180 bpm. What is the nurse's priority intervention?",
    o: ["Prepare for immediate synchronized cardioversion as the client is hemodynamically unstable", "Administer adenosine IV push to convert the rhythm", "Encourage the client to perform vagal maneuvers", "Administer oral metoprolol and recheck the rhythm in 30 minutes"],
    a: 0,
    r: "Wide-complex tachycardia with hemodynamic instability (hypotension, altered consciousness) requires immediate synchronized cardioversion. Adenosine is used for stable narrow-complex SVT. Vagal maneuvers are for stable SVT. Oral metoprolol is too slow-acting for an unstable rhythm and may worsen hypotension.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is assessing a 66-year-old client admitted with bilateral lower extremity edema and jugular vein distension. The chest X-ray shows an enlarged heart. Which position should the nurse place the client in to most accurately assess jugular vein distension?",
    o: ["Semi-Fowler's position (30-45 degree angle) with the head turned slightly to the side", "Flat supine with the head turned to the right", "Standing upright with arms at the sides", "Prone position with the head turned to the left"],
    a: 0,
    r: "JVD is best assessed with the client in semi-Fowler's position (30-45 degrees) with the head turned slightly away from the side being assessed. Supine position may show JVD even in healthy individuals due to gravity. Standing position may not demonstrate JVD even when elevated. Prone position is inappropriate for this assessment.",
    s: "Cardiovascular"
  },
  {
    q: "A 71-year-old client with peripheral arterial disease reports that their legs ache at night while in bed. Which position would the nurse suggest to improve arterial blood flow to the legs?",
    o: ["Dangle the legs over the side of the bed to use gravity to improve arterial perfusion", "Elevate the legs on two pillows above heart level", "Keep the legs flat and apply compression stockings", "Cross the legs at the ankles for comfort"],
    a: 0,
    r: "In PAD, dependent positioning (dangling legs) uses gravity to improve arterial blood flow to the lower extremities, relieving rest pain. Elevation reduces arterial flow. Compression stockings impede already compromised arterial flow. Crossing legs further restricts circulation.",
    s: "Cardiovascular"
  },
  {
    q: "A 78-year-old client with atrial fibrillation has a CHA2DS2-VASc score of 5. The nurse understands this score indicates:",
    o: ["High risk for stroke requiring anticoagulation therapy", "Low risk for stroke with no need for anticoagulation", "Moderate risk managed with aspirin alone", "A cardiac function measurement unrelated to stroke risk"],
    a: 0,
    r: "The CHA2DS2-VASc score assesses stroke risk in atrial fibrillation. A score of 5 indicates high stroke risk, strongly indicating the need for anticoagulation therapy. Low scores (0-1) may not require anticoagulation. A score of 5 is well above the threshold for aspirin alone. It specifically predicts stroke risk in afib, not general cardiac function.",
    s: "Cardiovascular"
  },
  {
    q: "A 43-year-old client is admitted with suspected myocarditis after a viral illness. The nurse notes tachycardia, low-grade fever, and mild chest discomfort. Which diagnostic test does the nurse anticipate to confirm the diagnosis?",
    o: ["Cardiac MRI to assess myocardial inflammation and edema", "Chest X-ray to visualize coronary artery stenosis", "Ankle-brachial index to assess peripheral perfusion", "Pulmonary function tests to rule out respiratory causes"],
    a: 0,
    r: "Cardiac MRI is the gold standard for diagnosing myocarditis, as it can detect myocardial inflammation, edema, and fibrosis. Chest X-ray cannot visualize coronary arteries or myocardial inflammation directly. ABI assesses peripheral arterial disease. PFTs assess lung function, not cardiac inflammation.",
    s: "Cardiovascular"
  },
  {
    q: "A 69-year-old client post-coronary artery bypass grafting (CABG) has a chest tube in place. The nurse notes 250 mL of sanguineous drainage in the first hour. What is the most appropriate action?",
    o: ["Monitor the drainage closely and report to the healthcare provider, as output exceeding 200 mL/hour may indicate hemorrhage", "Clamp the chest tube to slow the drainage", "Milk the chest tube to increase drainage flow", "Remove the chest tube immediately since it is draining too much"],
    a: 0,
    r: "Chest tube output greater than 200 mL/hour post-CABG may indicate surgical hemorrhage requiring re-exploration. The nurse should monitor trends and notify the provider. Clamping the chest tube can cause cardiac tamponade. Routine milking is not recommended. Removing the tube would be dangerous.",
    s: "Cardiovascular"
  },
  {
    q: "A 55-year-old client with stable angina is prescribed isosorbide mononitrate. The nurse should educate the client to:",
    o: ["Allow a nitrate-free interval of 10-12 hours daily to prevent tolerance", "Take the medication every 4 hours around the clock for continuous protection", "Avoid all physical activity while taking this medication", "Take the medication only when chest pain occurs"],
    a: 0,
    r: "Long-acting nitrates require a daily nitrate-free interval (typically 10-12 hours, usually overnight) to prevent the development of nitrate tolerance, which reduces effectiveness. Around-the-clock dosing leads to tolerance. Physical activity is not contraindicated. The medication is taken scheduled for prevention, not as needed.",
    s: "Cardiovascular"
  },
  {
    q: "A 82-year-old client with heart failure is receiving IV nitroglycerin. The nurse notes the blood pressure has decreased from 110/70 to 84/52 mmHg. What is the appropriate nursing action?",
    o: ["Reduce the nitroglycerin infusion rate and notify the healthcare provider", "Increase the nitroglycerin to further reduce preload", "Elevate the legs and continue the infusion at the current rate", "Administer a beta-blocker to raise blood pressure"],
    a: 0,
    r: "Hypotension (BP 84/52) is a common adverse effect of IV nitroglycerin from excessive vasodilation. The nurse should reduce the rate and notify the provider. Increasing the dose worsens hypotension. Leg elevation may temporarily help but does not address the medication-induced cause. Beta-blockers lower BP and HR further.",
    s: "Cardiovascular"
  },
  {
    q: "A 67-year-old client with chronic atrial fibrillation on apixaban (Eliquis) is admitted for a hip fracture. The surgical team asks about the last dose of apixaban. The nurse knows this information is critical because:",
    o: ["Apixaban affects bleeding risk during surgery and must be discontinued for an appropriate period before the procedure", "Apixaban prevents anesthesia from working properly", "Apixaban increases the risk of wound infection postoperatively", "Apixaban must be increased before surgery to prevent DVT"],
    a: 0,
    r: "Apixaban is a direct oral anticoagulant that increases bleeding risk. Knowing the last dose helps determine safe timing for surgery to minimize hemorrhagic complications. It does not affect anesthesia effectiveness or infection risk. It should be held, not increased, before surgery.",
    s: "Cardiovascular"
  },
  {
    q: "A 44-year-old client has been diagnosed with Wolff-Parkinson-White (WPW) syndrome after experiencing recurrent episodes of SVT. The nurse notes a short PR interval and a delta wave on the ECG. Which medication is contraindicated in this client?",
    o: ["Verapamil, as it may cause conduction through the accessory pathway and lead to ventricular fibrillation", "Aspirin, as it may cause bleeding in clients with WPW", "Digoxin, as it increases heart rate in clients with WPW", "Amiodarone, as it has no effect on accessory pathways"],
    a: 0,
    r: "Verapamil (and other AV node blockers) is contraindicated in WPW because blocking the AV node may force conduction through the accessory pathway, potentially causing ventricular fibrillation. Aspirin does not interact with WPW. Digoxin is also contraindicated in WPW for similar reasons, but verapamil is the classic answer. Amiodarone can actually be used in WPW.",
    s: "Cardiovascular"
  },
  {
    q: "A 56-year-old client is admitted with acute pericarditis. The healthcare provider orders an echocardiogram. The nurse expects this test to evaluate for:",
    o: ["Pericardial effusion that could progress to cardiac tamponade", "Coronary artery stenosis requiring stent placement", "Valvular vegetations from infective endocarditis", "Left ventricular ejection fraction for heart failure staging"],
    a: 0,
    r: "In acute pericarditis, echocardiography is primarily performed to assess for pericardial effusion, which can progress to life-threatening cardiac tamponade. While echocardiography can visualize valves and EF, the urgent concern in pericarditis is fluid accumulation. Coronary stenosis requires angiography, not echo.",
    s: "Cardiovascular"
  },
  {
    q: "A 73-year-old client with a thoracic aortic aneurysm has a systolic blood pressure of 178 mmHg despite prescribed medications. The client admits to eating high-sodium processed foods regularly. Which teaching is most important?",
    o: ["Reducing sodium intake is essential because high blood pressure increases stress on the aneurysm, raising the risk of rupture", "Sodium restriction is only necessary if the client has kidney disease", "The client can eat whatever they want as long as they take their medications", "High sodium only affects cholesterol levels, not blood pressure"],
    a: 0,
    r: "In thoracic aortic aneurysm, blood pressure control is critical to prevent rupture. High sodium intake raises blood pressure, increasing wall stress on the weakened aorta. Sodium restriction benefits all hypertensive clients, not only those with kidney disease. Medications alone may be insufficient without dietary changes. Sodium directly affects blood pressure through fluid retention.",
    s: "Cardiovascular"
  },
  {
    q: "A client is 24 hours post-cardiac catheterization via the femoral approach. The nurse assesses that the client's right pedal pulse is strong, the groin site is clean and dry, and the client has been on bed rest. When can the nurse anticipate ambulation?",
    o: ["Within 4-6 hours after the procedure if hemostasis is confirmed and no complications are present", "Not until 72 hours post-procedure to prevent bleeding", "Immediately if the client feels well enough to stand", "Only after repeat angiography confirms the artery has healed"],
    a: 0,
    r: "After femoral artery catheterization, most clients can ambulate 4-6 hours after the procedure if hemostasis is achieved and no vascular complications are present. The scenario states 24 hours have passed, so ambulation should already be occurring. 72 hours is excessively long. Immediate ambulation risks bleeding. Repeat angiography is not needed for routine clearance.",
    s: "Cardiovascular"
  },
  {
    q: "A 47-year-old client presents with severe tearing chest pain radiating to the back. Blood pressure in the right arm is 180/100 mmHg and in the left arm is 140/82 mmHg. Which condition does the nurse suspect?",
    o: ["Aortic dissection, based on the tearing pain and significant blood pressure difference between arms", "Acute myocardial infarction, based on the chest pain and hypertension", "Pericarditis, based on the radiating pain", "Costochondritis, based on the chest wall tenderness"],
    a: 0,
    r: "Sudden tearing chest/back pain with a significant blood pressure difference between arms (more than 20 mmHg systolic) is the classic presentation of aortic dissection. The dissection flap can obstruct blood flow to one arm. MI pain is typically crushing, not tearing. Pericarditis improves with leaning forward. Costochondritis is reproducible with palpation.",
    s: "Cardiovascular"
  },
  {
    q: "A 65-year-old client with heart failure is being titrated on carvedilol. After dose increase, the client reports increased fatigue and the heart rate is 52 bpm. What should the nurse do?",
    o: ["Hold the next dose and notify the healthcare provider about the bradycardia", "Administer the next scheduled dose at the higher amount", "Tell the client fatigue is normal and to continue the medication", "Administer atropine immediately"],
    a: 0,
    r: "Heart rate of 52 bpm with increased fatigue after a beta-blocker dose increase indicates the dose may be too high. The nurse should hold the next dose and notify the provider for dose adjustment. Continuing the higher dose may worsen bradycardia. While some fatigue is expected initially, significant bradycardia requires evaluation. Atropine is reserved for symptomatic emergent bradycardia.",
    s: "Cardiovascular"
  },
  {
    q: "A 58-year-old client with a history of rheumatic heart disease and mitral valve replacement is scheduled for a colonoscopy. The nurse should ensure which preparation is completed?",
    o: ["Antibiotic prophylaxis administered before the procedure to prevent endocarditis", "NPO for 48 hours before the procedure", "Discontinuation of all cardiac medications 1 week before", "An exercise stress test to clear the client for the procedure"],
    a: 0,
    r: "Clients with prosthetic heart valves require antibiotic prophylaxis before certain invasive procedures to prevent infective endocarditis. NPO for 48 hours is excessive. Cardiac medications should generally continue. A stress test is not routinely needed before colonoscopy.",
    s: "Cardiovascular"
  },
  {
    q: "A 80-year-old client presents with a blood pressure of 160/60 mmHg. The nurse notes a widened pulse pressure. Which condition is most commonly associated with this finding?",
    o: ["Aortic regurgitation, where blood leaks back into the left ventricle during diastole", "Mitral stenosis, where blood cannot flow freely from the left atrium", "Cardiac tamponade, where fluid compresses the heart", "Hypovolemic shock from dehydration"],
    a: 0,
    r: "A widened pulse pressure (systolic minus diastolic greater than 40 mmHg; here 100 mmHg) is characteristic of aortic regurgitation. The regurgitant flow back into the LV raises systolic pressure and lowers diastolic pressure. Mitral stenosis does not typically cause widened pulse pressure. Tamponade and hypovolemia cause narrowed pulse pressure.",
    s: "Cardiovascular"
  },
  {
    q: "A 63-year-old client presents with rest pain in the left foot that has worsened over the past month. The ABI is 0.35. The client has a small non-healing ulcer on the left fifth toe. Which intervention should the nurse anticipate?",
    o: ["Referral for vascular surgery evaluation, as the ABI indicates critical limb ischemia", "Application of compression stockings to improve circulation", "Instruction to begin a vigorous walking program", "Topical antibiotic ointment alone for the ulcer"],
    a: 0,
    r: "ABI less than 0.40 with rest pain and non-healing ulcers indicates critical limb ischemia requiring urgent vascular surgery evaluation for possible revascularization to prevent amputation. Compression stockings worsen arterial insufficiency. Vigorous walking with critical ischemia could cause further tissue damage. Topical antibiotics alone are insufficient for critical ischemia.",
    s: "Cardiovascular"
  },
  {
    q: "A 55-year-old client is in the intensive care unit following a massive anterior wall MI. An arterial line shows blood pressure fluctuating between 70/40 and 80/50 mmHg. Urine output is less than 20 mL/hour. The nurse anticipates which treatment?",
    o: ["Vasopressor and inotropic support to improve cardiac output and maintain perfusion", "Oral antihypertensive medications to stabilize blood pressure", "Aggressive IV fluid boluses of 2 litres of normal saline", "Immediate discharge home with outpatient follow-up"],
    a: 0,
    r: "Persistent hypotension with oliguria after massive MI indicates cardiogenic shock requiring vasopressor and inotropic support to improve cardiac output. Antihypertensives would lower BP further. Aggressive fluids may worsen pulmonary edema in cardiogenic shock. Discharge is inappropriate for hemodynamic instability.",
    s: "Cardiovascular"
  },
  {
    q: "A 49-year-old client had a drug-eluting stent placed 2 months ago. The client wants to stop clopidogrel because it is expensive. What should the nurse emphasize?",
    o: ["Stopping dual antiplatelet therapy prematurely after drug-eluting stent placement can cause stent thrombosis, which is life-threatening", "It is safe to stop clopidogrel after 1 month with drug-eluting stents", "Aspirin alone provides adequate protection after stent placement", "The client can switch to vitamin E as a natural blood thinner"],
    a: 0,
    r: "Drug-eluting stents require at least 12 months of dual antiplatelet therapy (aspirin plus clopidogrel or ticagrelor). Premature discontinuation is the leading cause of stent thrombosis, which is often fatal. One month is insufficient. Aspirin alone is inadequate. Vitamin E is not a proven antiplatelet substitute.",
    s: "Cardiovascular"
  },
  {
    q: "A 68-year-old client with heart failure is being started on hydralazine and isosorbide dinitrate combination. The nurse understands this combination is particularly beneficial for which client population?",
    o: ["Clients of African descent who remain symptomatic despite standard heart failure therapy", "All clients with heart failure regardless of ethnicity or symptoms", "Only clients under 50 years old with early heart failure", "Clients who are allergic to beta-blockers only"],
    a: 0,
    r: "The combination of hydralazine and isosorbide dinitrate (BiDil) has been shown to provide additional mortality benefit specifically in African American/Black clients with HFrEF who remain symptomatic on standard therapy. This is based on the A-HeFT trial. It is not first-line for all HF clients, is not age-restricted, and is not a beta-blocker substitute.",
    s: "Cardiovascular"
  },
  {
    q: "A 72-year-old client recovering from a STEMI asks why cardiac enzymes are drawn multiple times. Which response by the nurse is most accurate?",
    o: ["Serial enzyme levels help track the timing and extent of heart muscle damage and detect complications", "We only need one set; the repeated draws are for billing purposes", "Cardiac enzymes must be drawn every hour for the first 24 hours without exception", "Serial draws are done to test for infections that may occur after a heart attack"],
    a: 0,
    r: "Serial cardiac enzyme (troponin) measurements establish the pattern of rise and fall, helping determine the timing of MI onset, the extent of myocardial damage, and whether there is ongoing or new injury. A single value provides limited information. They are not for billing, not drawn hourly, and do not test for infection.",
    s: "Cardiovascular"
  },
  {
    q: "A 60-year-old client with known coronary artery disease develops chest pain during a stress test. The ECG shows 3 mm ST depression in multiple leads. What should the nurse do?",
    o: ["Stop the stress test immediately, place the client supine, and administer nitroglycerin as ordered", "Continue the test to obtain more diagnostic information", "Encourage the client to exercise harder to provoke more changes for diagnosis", "Administer a bronchodilator to improve oxygen delivery"],
    a: 0,
    r: "Significant ST depression (3 mm or more) with chest pain during a stress test is a positive result indicating myocardial ischemia. The test must be stopped immediately to prevent MI. Continuing or increasing exercise risks cardiac damage. A bronchodilator does not address cardiac ischemia.",
    s: "Cardiovascular"
  },
  {
    q: "A 54-year-old client with hypertension and chronic kidney disease is prescribed an ACE inhibitor. The nurse should monitor which laboratory value most closely?",
    o: ["Serum potassium and creatinine, as ACE inhibitors can cause hyperkalemia and worsen renal function", "Serum calcium, as ACE inhibitors cause hypocalcemia", "Liver enzymes, as ACE inhibitors are hepatotoxic", "Thyroid function tests, as ACE inhibitors affect thyroid hormones"],
    a: 0,
    r: "ACE inhibitors reduce aldosterone secretion (causing potassium retention) and can reduce renal perfusion (especially in CKD or bilateral renal artery stenosis). Monitoring potassium and creatinine is essential. ACE inhibitors do not cause hypocalcemia, hepatotoxicity, or thyroid dysfunction.",
    s: "Cardiovascular"
  },
  {
    q: "A 77-year-old client with heart failure and renal insufficiency is prescribed a loop diuretic. The client's blood pressure is 100/64 mmHg. Before administering the medication, what should the nurse assess?",
    o: ["Current blood pressure, fluid status, and electrolyte levels to ensure the client can safely tolerate the diuretic", "Only the client's weight, as that is the most important parameter", "The client's appetite, as diuretics cause increased hunger", "The client's temperature, as diuretics cause fever"],
    a: 0,
    r: "Before administering a loop diuretic with borderline blood pressure (100/64), the nurse must assess BP (further drop may cause hypotension), fluid status (over-diuresis risk), and electrolytes (risk of hypokalemia, hyponatremia). Weight alone is insufficient. Diuretics do not cause increased hunger or fever.",
    s: "Cardiovascular"
  },
  {
    q: "A 46-year-old client with Marfan syndrome is being monitored for aortic root dilation. The nurse understands this client is at increased risk for:",
    o: ["Aortic dissection or rupture due to connective tissue weakness in the aortic wall", "Coronary artery disease from atherosclerotic plaque buildup", "Pulmonary embolism from venous stasis", "Infective endocarditis from valve vegetations"],
    a: 0,
    r: "Marfan syndrome affects connective tissue, weakening the aortic wall and causing dilation (particularly of the aortic root). This significantly increases the risk of aortic dissection and rupture. While Marfan clients can develop other cardiac conditions, aortic complications are the primary life-threatening concern.",
    s: "Cardiovascular"
  },
  {
    q: "A 65-year-old client post-CABG is being transitioned from IV heparin to warfarin. The nurse notes the INR is 1.8 on day 3 of warfarin. Should heparin be discontinued?",
    o: ["No, heparin should continue until the INR is therapeutic (2.0-3.0) for at least 24 hours", "Yes, the INR of 1.8 is close enough to therapeutic to stop heparin", "Yes, heparin should be stopped as soon as warfarin is started", "No, heparin and warfarin should never be given simultaneously"],
    a: 0,
    r: "Heparin provides immediate anticoagulation while warfarin takes several days to reach therapeutic effect. Heparin should be continued until the INR reaches 2.0-3.0 for at least 24 consecutive hours. An INR of 1.8 is subtherapeutic. Stopping heparin when warfarin starts leaves the client unprotected. Overlap therapy is standard practice.",
    s: "Cardiovascular"
  },
  {
    q: "A 69-year-old client with dilated cardiomyopathy has an ejection fraction of 18%. The client is being evaluated for advanced therapies. Which device may be recommended as a bridge to transplant?",
    o: ["Left ventricular assist device (LVAD) to provide mechanical circulatory support", "Implantable cardioverter-defibrillator (ICD) to improve ejection fraction", "Temporary transvenous pacemaker for rate control", "Cardiac resynchronization therapy to replace the need for transplant"],
    a: 0,
    r: "An LVAD provides mechanical circulatory support as a bridge to heart transplant (or destination therapy) in clients with severely reduced EF who are failing medical management. An ICD prevents sudden cardiac death but does not improve EF. Temporary pacing is short-term. CRT may help some clients but may be insufficient at EF 18%.",
    s: "Cardiovascular"
  },
  {
    q: "A 71-year-old client is prescribed amiodarone for ventricular dysrhythmias. Which baseline test should the nurse ensure is completed before starting the medication?",
    o: ["Thyroid function tests, pulmonary function tests, and liver function tests", "Renal function tests and urinalysis only", "Blood glucose and hemoglobin A1c", "Bone density scan and calcium levels"],
    a: 0,
    r: "Amiodarone has significant toxicities affecting the thyroid (contains iodine), lungs (pulmonary fibrosis), and liver (hepatotoxicity). Baseline tests of these organ systems must be completed before starting and monitored regularly thereafter. Renal function is less affected. Blood glucose and bone density are not primary concerns with amiodarone.",
    s: "Cardiovascular"
  },
  {
    q: "A 62-year-old client with atrial fibrillation is prescribed flecainide to maintain sinus rhythm. The nurse should ensure the client also has which condition ruled out before starting this medication?",
    o: ["Structural heart disease, as flecainide is contraindicated and can cause fatal dysrhythmias in clients with structural heart disease", "Diabetes mellitus, as flecainide causes severe hypoglycemia", "Osteoporosis, as flecainide decreases bone density", "Sleep apnea, as flecainide worsens respiratory depression during sleep"],
    a: 0,
    r: "Flecainide (Class IC antiarrhythmic) is contraindicated in structural heart disease (previous MI, heart failure) due to increased risk of pro-arrhythmia and sudden death, as demonstrated by the CAST trial. It does not cause hypoglycemia, bone loss, or respiratory depression.",
    s: "Cardiovascular"
  },
  {
    q: "A 75-year-old client with chronic venous insufficiency presents with bilateral brown discoloration of the lower legs, mild edema, and a shallow ulcer near the left medial malleolus. Which intervention is most appropriate?",
    o: ["Apply compression therapy as ordered and elevate the legs when sitting to promote venous return", "Apply a heating pad to improve blood flow to the ulcer", "Place the legs in a dependent position to increase blood supply", "Administer anticoagulants to prevent further venous damage"],
    a: 0,
    r: "Venous insufficiency ulcers are managed with compression therapy (graduated compression stockings or wraps) and leg elevation to reduce venous hypertension and promote healing. Heating pads risk burns. Dependent positioning worsens venous congestion. Anticoagulants treat clots but do not address chronic venous insufficiency.",
    s: "Cardiovascular"
  },
  {
    q: "A 58-year-old client is receiving a blood transfusion for anemia. Fifteen minutes into the transfusion, the client develops fever, chills, back pain, and dark urine. What is the nurse's priority action?",
    o: ["Stop the transfusion immediately, maintain IV access with normal saline, and notify the healthcare provider", "Slow the transfusion rate and administer acetaminophen for the fever", "Continue the transfusion and apply warm blankets for the chills", "Increase the transfusion rate to finish quickly and minimize exposure"],
    a: 0,
    r: "Fever, chills, back pain, and dark urine (hemoglobinuria) indicate an acute hemolytic transfusion reaction, a life-threatening emergency. The transfusion must be stopped immediately, IV access maintained with saline, and the provider notified. Slowing the rate does not address the reaction. Continuing or increasing the rate worsens the reaction.",
    s: "Cardiovascular"
  },
  {
    q: "A 66-year-old client with an inferior wall MI develops nausea, vomiting, and diaphoresis with a heart rate of 48 bpm and blood pressure of 86/54 mmHg. The nurse understands the bradycardia is likely caused by:",
    o: ["Vagal stimulation from the inferior MI affecting the right coronary artery, which supplies the AV node", "Medication side effects from beta-blockers the client is not taking", "Normal physiological response to pain", "Dehydration from the nausea and vomiting"],
    a: 0,
    r: "Inferior MIs involve the right coronary artery, which typically supplies the AV node. Ischemia to the AV node causes bradycardia. Vagal stimulation is also common with inferior MIs. The bradycardia is directly related to the coronary artery involved, not medications, pain response, or dehydration.",
    s: "Cardiovascular"
  },
  {
    q: "A 74-year-old client with heart failure has been prescribed an SGLT2 inhibitor (dapagliflozin) even though they do not have diabetes. The client questions this. Which response by the nurse is correct?",
    o: ["SGLT2 inhibitors have been shown to reduce heart failure hospitalizations and cardiovascular death regardless of diabetes status", "The healthcare provider made a mistake; this medication is only for diabetes", "SGLT2 inhibitors cure heart failure when taken consistently", "This medication will lower your blood sugar, which helps heart failure indirectly"],
    a: 0,
    r: "SGLT2 inhibitors (dapagliflozin, empagliflozin) have demonstrated significant benefit in HFrEF independent of diabetes status, reducing hospitalizations and cardiovascular mortality. This is a guideline-directed therapy for heart failure. It is not a prescribing error. It does not cure heart failure. The cardiac benefits are direct, not solely from glucose lowering.",
    s: "Cardiovascular"
  },
  {
    q: "A 52-year-old client on the telemetry unit has frequent PVCs that are occurring every other beat. The nurse identifies this pattern as:",
    o: ["Ventricular bigeminy", "Ventricular trigeminy", "Ventricular couplets", "Ventricular escape rhythm"],
    a: 0,
    r: "PVCs occurring every other beat (alternating with normal sinus beats) is called ventricular bigeminy. Trigeminy occurs every third beat. Couplets are two consecutive PVCs. Ventricular escape rhythm occurs when higher pacemakers fail, producing a regular slow ventricular rate.",
    s: "Cardiovascular"
  },
  {
    q: "A 60-year-old client taking losartan (Cozaar) for hypertension reports dizziness when standing up from a seated position. Blood pressure sitting is 134/82, standing is 98/60. What does the nurse identify?",
    o: ["Orthostatic hypotension, a side effect of antihypertensive therapy", "Hypertensive crisis requiring emergency treatment", "Normal blood pressure response when changing positions", "Allergic reaction to losartan requiring immediate discontinuation"],
    a: 0,
    r: "A drop in systolic BP greater than 20 mmHg upon standing defines orthostatic hypotension, which is a common side effect of antihypertensive medications. This is not a hypertensive crisis (BP is dropping, not rising). The drop exceeds normal physiological variation. It is not an allergic reaction.",
    s: "Cardiovascular"
  },
  {
    q: "A 78-year-old client with heart failure is on a continuous IV milrinone infusion. The nurse understands milrinone works by:",
    o: ["Inhibiting phosphodiesterase, which increases contractility and causes vasodilation", "Stimulating beta-1 receptors to increase heart rate", "Blocking sodium channels to slow cardiac conduction", "Inhibiting ACE to reduce afterload"],
    a: 0,
    r: "Milrinone is a phosphodiesterase-3 inhibitor (inodilator) that increases intracellular cAMP, leading to increased myocardial contractility (positive inotropy) and peripheral vasodilation. It does not stimulate beta receptors, block sodium channels, or inhibit ACE.",
    s: "Cardiovascular"
  },
  {
    q: "A 64-year-old client post-MI is experiencing Dressler syndrome 3 weeks after the event. Which symptoms does the nurse anticipate?",
    o: ["Fever, pleuritic chest pain, and pericardial friction rub from post-MI inflammatory pericarditis", "Recurrent ST elevation indicating new myocardial infarction", "Severe hypertension with headache and visual changes", "Sudden cardiac arrest from ventricular fibrillation"],
    a: 0,
    r: "Dressler syndrome (post-MI syndrome) is an autoimmune inflammatory response occurring weeks after MI, presenting with fever, pleuritic chest pain, pericardial friction rub, and pericardial effusion. It is not a recurrent MI, hypertensive crisis, or sudden arrest.",
    s: "Cardiovascular"
  },
  {
    q: "A 70-year-old client with peripheral arterial disease is scheduled for surgical revascularization. Preoperatively, the nurse should prioritize which assessment?",
    o: ["Baseline neurovascular status of both lower extremities for post-operative comparison", "Visual acuity testing for intraoperative monitoring", "Hearing assessment for communication during surgery", "Dental examination to rule out oral infections"],
    a: 0,
    r: "Baseline neurovascular assessment (pulses, sensation, skin color, temperature, capillary refill) of both extremities is essential before vascular surgery for post-operative comparison to detect complications like graft occlusion or thrombosis. Visual and hearing assessments are not specific priorities. Dental exam is relevant for cardiac valve surgery, not PAD surgery.",
    s: "Cardiovascular"
  },
  {
    q: "A 55-year-old client is prescribed ivabradine for chronic heart failure with a resting heart rate of 78 bpm despite maximum beta-blocker therapy. The nurse understands ivabradine works by:",
    o: ["Selectively inhibiting the If current in the sinoatrial node to reduce heart rate without affecting blood pressure or contractility", "Blocking beta-1 and beta-2 receptors to reduce heart rate and blood pressure", "Inhibiting calcium channels to slow conduction through the AV node", "Increasing vagal tone to slow the heart rate"],
    a: 0,
    r: "Ivabradine selectively inhibits the If ('funny') current in the SA node, reducing heart rate without affecting blood pressure, contractility, or AV conduction. It is used when heart rate remains above 70 bpm despite beta-blocker therapy. It does not block beta receptors, calcium channels, or directly increase vagal tone.",
    s: "Cardiovascular"
  },
  {
    q: "A 83-year-old client with severe aortic stenosis is deemed too high-risk for open surgical valve replacement. Which alternative procedure does the nurse anticipate?",
    o: ["Transcatheter aortic valve replacement (TAVR), a minimally invasive valve replacement via catheter", "Mitral valve repair through open heart surgery", "Coronary artery bypass graft surgery", "Heart transplantation"],
    a: 0,
    r: "TAVR (transcatheter aortic valve replacement) is a minimally invasive alternative for high-risk surgical candidates with severe aortic stenosis. A prosthetic valve is delivered via catheter, avoiding open heart surgery. Mitral valve repair addresses the wrong valve. CABG is for coronary disease. Transplant is not indicated for isolated aortic stenosis.",
    s: "Cardiovascular"
  },
  {
    q: "A 67-year-old client in the cardiac care unit has a pulmonary artery catheter in place. The pulmonary capillary wedge pressure (PCWP) reading is 24 mmHg (normal 6-12 mmHg). What does this indicate?",
    o: ["Left ventricular failure with fluid backing up into the pulmonary vasculature", "Normal fluid status requiring no intervention", "Right ventricular failure with systemic congestion", "Hypovolemia requiring fluid replacement"],
    a: 0,
    r: "Elevated PCWP (24 mmHg, normal 6-12) indicates increased left atrial and left ventricular end-diastolic pressure, signifying left ventricular failure with pulmonary congestion. Normal PCWP is 6-12. Right heart failure elevates CVP/RAP, not PCWP directly. Hypovolemia would show low PCWP.",
    s: "Cardiovascular"
  },
  {
    q: "A 50-year-old client with Raynaud's phenomenon reports episodes of white, blue, then red color changes in the fingers during cold exposure. Which nursing advice is most helpful?",
    o: ["Wear warm gloves, avoid cold exposure, and stop smoking if applicable to prevent vasospasm", "Soak hands in ice water daily to build tolerance to cold", "Take aspirin daily to prevent clot formation in the fingers", "Apply topical nitroglycerin to the fingers during color changes"],
    a: 0,
    r: "Raynaud's involves vasospasm triggered by cold or stress. Prevention focuses on avoiding cold exposure (warm gloves, warm environment), avoiding vasoconstrictors (nicotine), and stress management. Ice water immersion would trigger attacks. Daily aspirin is not standard therapy. While nitroglycerin may be used topically, prevention is the primary approach.",
    s: "Cardiovascular"
  },
  {
    q: "A 61-year-old client recovering from cardiac surgery develops a temperature of 38.8 C on postoperative day 3, with sternal wound redness and purulent drainage. Which complication does the nurse suspect?",
    o: ["Mediastinitis or sternal wound infection requiring urgent evaluation and treatment", "Normal postoperative healing with expected wound inflammation", "Pericarditis from surgical trauma", "Drug fever from postoperative antibiotics"],
    a: 0,
    r: "Fever, wound redness, and purulent drainage on post-op day 3 after cardiac surgery strongly suggest sternal wound infection or mediastinitis, a serious complication requiring urgent intervention. Normal healing would not produce purulent drainage. Pericarditis presents with chest pain and friction rub. Drug fever typically does not produce wound drainage.",
    s: "Cardiovascular"
  },
  {
    q: "A 73-year-old client with heart failure is admitted with acute pulmonary edema. The nurse expects to see which classic finding on chest X-ray?",
    o: ["Bilateral butterfly-shaped or bat-wing opacities with bilateral pleural effusions", "Clear lung fields with normal cardiac silhouette", "Unilateral consolidation in the right lower lobe", "Pneumothorax with collapsed left lung"],
    a: 0,
    r: "Acute pulmonary edema from heart failure produces characteristic bilateral butterfly-shaped (bat-wing) opacities on chest X-ray from fluid in the perihilar regions, often with bilateral pleural effusions and an enlarged cardiac silhouette. Clear lung fields would be normal. Unilateral consolidation suggests pneumonia. Pneumothorax has a different appearance.",
    s: "Cardiovascular"
  },
  {
    q: "A 56-year-old client taking metoprolol for hypertension is scheduled for surgery. The surgeon asks the nurse if the client has been taking their medication. Why is this information important?",
    o: ["Abrupt discontinuation of beta-blockers can cause rebound tachycardia and hypertension, increasing perioperative cardiac risk", "Metoprolol must be stopped 2 weeks before surgery to prevent anesthetic interactions", "Beta-blockers have no effect on surgical outcomes", "Metoprolol should be doubled on the day of surgery for extra protection"],
    a: 0,
    r: "Beta-blockers should not be abruptly discontinued before surgery. Sudden withdrawal can cause rebound sympathetic activation leading to tachycardia, hypertension, and increased risk of perioperative MI. Metoprolol should be continued perioperatively. It does interact with anesthesia but should not be stopped. Doubling is inappropriate.",
    s: "Cardiovascular"
  },
  {
    q: "A 68-year-old client with heart failure is prescribed tolvaptan (Samsca). The nurse understands this medication is indicated specifically for:",
    o: ["Hypervolemic hyponatremia that has not responded to fluid restriction", "Hyperkalemia from ACE inhibitor therapy", "Elevated BNP levels", "Stage 1 hypertension"],
    a: 0,
    r: "Tolvaptan is a vasopressin receptor antagonist (aquaretic) used to treat hypervolemic or euvolemic hyponatremia (dilutional) that has not responded to fluid restriction. It promotes free water excretion. It does not treat hyperkalemia, directly lower BNP, or serve as a first-line antihypertensive.",
    s: "Cardiovascular"
  },
  {
    q: "A 79-year-old client is brought to the emergency department after a syncopal episode. The ECG shows no P waves, a regular narrow-complex rhythm at 44 bpm. Which rhythm does the nurse identify?",
    o: ["Junctional escape rhythm", "Normal sinus rhythm", "Atrial fibrillation with slow ventricular response", "Ventricular tachycardia"],
    a: 0,
    r: "Absence of P waves with a regular narrow-complex rhythm at 40-60 bpm is characteristic of a junctional escape rhythm, where the AV junction takes over pacing. NSR has visible P waves. Atrial fibrillation is irregularly irregular. Ventricular tachycardia has wide QRS complexes and a faster rate.",
    s: "Cardiovascular"
  },
  {
    q: "A 62-year-old client with heart failure reports waking up suddenly at night gasping for air, requiring them to sit upright in bed. The nurse documents this as:",
    o: ["Paroxysmal nocturnal dyspnea (PND), indicating worsening left-sided heart failure", "Sleep apnea requiring CPAP therapy", "Nocturnal panic attack from anxiety disorder", "Bronchospasm from reactive airway disease"],
    a: 0,
    r: "PND (paroxysmal nocturnal dyspnea) is sudden awakening with dyspnea relieved by sitting upright, caused by fluid redistribution when lying flat in heart failure. It indicates worsening left-sided HF. Sleep apnea has a different pattern. While anxiety and bronchospasm can cause nocturnal dyspnea, PND in a HF client is the most likely diagnosis.",
    s: "Cardiovascular"
  },
  {
    q: "A 57-year-old client with known DVT suddenly develops tachypnea (RR 34), SpO2 78%, sharp chest pain, and a sense of impending doom. Which diagnostic test should the nurse anticipate as the definitive test for suspected PE?",
    o: ["CT pulmonary angiography (CTPA) to visualize the pulmonary vasculature for thrombus", "Chest X-ray to rule out pneumonia", "Complete blood count to check for infection", "Electrocardiogram to diagnose myocardial infarction"],
    a: 0,
    r: "CT pulmonary angiography is the gold standard diagnostic test for pulmonary embolism, directly visualizing thrombus in the pulmonary arteries. Chest X-ray may be normal or show non-specific findings in PE. CBC does not diagnose PE. ECG may show right heart strain but is not definitive for PE diagnosis.",
    s: "Cardiovascular"
  },
  {
    q: "A 45-year-old client is being treated for hypertensive urgency with oral captopril. The blood pressure is 196/118 mmHg without end-organ damage. How quickly should the blood pressure be lowered?",
    o: ["Gradually over 24 to 48 hours to prevent organ hypoperfusion", "Immediately to normal values within 1 hour", "Within 6 hours to below 120/80 mmHg", "No treatment is needed since there is no end-organ damage"],
    a: 0,
    r: "Hypertensive urgency (severely elevated BP without end-organ damage) is managed with gradual BP reduction over 24-48 hours using oral medications. Rapid reduction can cause cerebral, renal, or coronary hypoperfusion. Immediate normalization is the approach for hypertensive emergency, not urgency. Treatment is still necessary to prevent progression to emergency.",
    s: "Cardiovascular"
  },
  {
    q: "A 68-year-old client with peripheral arterial disease is advised to participate in a supervised walking program. The nurse explains the purpose of this program is to:",
    o: ["Promote collateral circulation development, which improves blood flow to the legs over time", "Build upper body strength to compensate for leg weakness", "Reduce the need for anticoagulant therapy", "Cure the underlying atherosclerotic disease"],
    a: 0,
    r: "Supervised exercise (walking until claudication, resting, then resuming) is the primary non-surgical intervention for PAD. It promotes the development of collateral blood vessels, improving perfusion. It does not primarily target upper body strength. Exercise does not eliminate anticoagulant needs. It manages symptoms but does not cure atherosclerosis.",
    s: "Cardiovascular"
  },
  {
    q: "A 76-year-old client with chronic heart failure has a serum sodium of 127 mEq/L (normal 135-145 mEq/L). The nurse is concerned because dilutional hyponatremia in heart failure indicates:",
    o: ["Fluid overload with excess water relative to sodium, suggesting worsening heart failure", "Excessive sodium intake requiring dietary counseling", "Kidney failure requiring immediate dialysis", "Normal electrolyte variation in older adults"],
    a: 0,
    r: "Dilutional hyponatremia in heart failure occurs when excess water retention (from elevated ADH and reduced renal perfusion) dilutes serum sodium concentration. It indicates worsening heart failure and is associated with worse prognosis. It is not from excessive sodium intake, does not necessarily require dialysis, and is not a normal age-related change.",
    s: "Cardiovascular"
  },
  {
    q: "A 53-year-old client is prescribed ranolazine (Ranexa) for chronic stable angina that is not adequately controlled with other antianginal agents. The nurse should educate the client about which potential side effect?",
    o: ["QT prolongation, which requires monitoring for dizziness, fainting, or palpitations", "Severe hypertension requiring frequent blood pressure monitoring", "Weight gain of 5-10 kg in the first month", "Complete loss of taste sensation"],
    a: 0,
    r: "Ranolazine can prolong the QT interval, increasing the risk for Torsades de pointes. Clients should be educated to report dizziness, syncope, or palpitations. It does not cause hypertension, significant weight gain, or taste loss.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is assessing a 75-year-old client with a history of aortic stenosis. The client becomes pale, diaphoretic, and unresponsive after standing from a chair. What should the nurse do first?",
    o: ["Lower the client to a safe position, assess airway/breathing/circulation, and call for help", "Place the client back in the chair and offer a glass of water", "Administer nitroglycerin sublingual for possible angina", "Perform a detailed neurological assessment before taking any action"],
    a: 0,
    r: "Syncope in aortic stenosis is a medical emergency potentially caused by fixed cardiac output unable to meet the demands of position change. The priority is ensuring safety (lowering the client), assessing ABCs, and calling for help. Placing them in a chair risks another fall. Nitroglycerin is contraindicated in severe aortic stenosis as it can cause fatal hypotension. A detailed neuro exam delays critical interventions.",
    s: "Cardiovascular"
  },
  // === SATA Questions 211-250 ===
  {
    q: "A 72-year-old client with heart failure is being discharged. Which discharge instructions should the nurse include? (Select all that apply.)",
    o: ["Weigh yourself daily at the same time on the same scale", "Report a weight gain of more than 1 kg (2.2 lbs) in one day to the healthcare provider", "Limit sodium intake as prescribed", "Take diuretics at bedtime to promote continuous fluid removal", "Monitor for signs of fluid overload such as swollen ankles and shortness of breath", "Increase fluid intake to prevent dehydration"],
    a: -1,
    ca: [0, 1, 2, 4],
    t: "sata",
    r: "Daily weights, reporting rapid weight gain, sodium restriction, and monitoring for fluid overload are all essential HF self-management instructions. Diuretics should be taken in the morning (not bedtime) to prevent nocturia. Increasing fluids is generally contraindicated in heart failure unless otherwise specified.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is caring for a client with acute STEMI. Which interventions are appropriate for this client? (Select all that apply.)",
    o: ["Administer aspirin as ordered", "Obtain a 12-lead ECG", "Start supplemental oxygen if SpO2 is below 94%", "Administer a beta-blocker to all STEMI clients regardless of heart rate and blood pressure", "Establish IV access and draw cardiac biomarkers", "Prepare for possible percutaneous coronary intervention"],
    a: -1,
    ca: [0, 1, 2, 4, 5],
    t: "sata",
    r: "Aspirin, 12-lead ECG, oxygen for hypoxemia, IV access with biomarkers, and PCI preparation are all standard STEMI interventions. Beta-blockers are not given universally, as they are contraindicated in clients with bradycardia, hypotension, or acute heart failure.",
    s: "Cardiovascular"
  },
  {
    q: "A client is on IV heparin therapy. Which nursing interventions are appropriate? (Select all that apply.)",
    o: ["Monitor aPTT levels as ordered", "Use an infusion pump for accurate dosing", "Assess for signs of bleeding (petechiae, hematuria, black stools)", "Administer intramuscular injections as needed for pain", "Have protamine sulfate available as the antidote", "Apply direct pressure for at least 5 minutes after venipuncture"],
    a: -1,
    ca: [0, 1, 2, 4, 5],
    t: "sata",
    r: "aPTT monitoring, infusion pump use, bleeding assessment, protamine sulfate availability, and prolonged pressure after venipuncture are all appropriate heparin therapy interventions. IM injections are avoided during anticoagulant therapy because they can cause large hematomas.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is assessing a client for signs of right-sided heart failure. Which findings would the nurse expect? (Select all that apply.)",
    o: ["Jugular vein distension", "Hepatomegaly", "Peripheral edema", "Crackles in the lung bases", "Ascites", "Weight gain"],
    a: -1,
    ca: [0, 1, 2, 4, 5],
    t: "sata",
    r: "Right-sided heart failure causes systemic venous congestion: JVD, hepatomegaly, peripheral edema, ascites, and weight gain. Crackles in the lung bases are characteristic of left-sided heart failure from pulmonary congestion.",
    s: "Cardiovascular"
  },
  {
    q: "A client with atrial fibrillation is being discharged on warfarin. Which teaching points should the nurse include? (Select all that apply.)",
    o: ["Maintain consistent vitamin K intake in the diet", "Report signs of bleeding such as unusual bruising, dark stools, or blood in urine", "Have regular INR blood tests as scheduled", "Use a soft-bristle toothbrush and electric razor", "Take double doses if a dose is missed", "Avoid contact sports and activities with high injury risk"],
    a: -1,
    ca: [0, 1, 2, 3, 5],
    t: "sata",
    r: "Consistent vitamin K intake, bleeding sign recognition, regular INR monitoring, using soft toothbrush/electric razor, and avoiding high-injury activities are all correct warfarin education points. Double dosing is never recommended, as it increases bleeding risk.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is caring for a client post-cardiac catheterization via the femoral artery. Which assessments are essential? (Select all that apply.)",
    o: ["Check pedal pulses in the affected extremity", "Assess the insertion site for bleeding or hematoma", "Monitor vital signs frequently", "Encourage hip flexion on the affected side to prevent stiffness", "Assess skin color and temperature of the affected leg", "Monitor urine output for signs of contrast-induced nephropathy"],
    a: -1,
    ca: [0, 1, 2, 4, 5],
    t: "sata",
    r: "Pedal pulse assessment, insertion site monitoring, vital signs, skin assessment of the affected leg, and urine output monitoring are all essential post-catheterization care. Hip flexion is contraindicated after femoral catheterization as it can disrupt the arterial closure and cause hemorrhage.",
    s: "Cardiovascular"
  },
  {
    q: "A client in the emergency department has signs of cardiac tamponade. Which findings should the nurse expect? (Select all that apply.)",
    o: ["Hypotension", "Muffled or distant heart sounds", "Jugular vein distension", "Pulsus paradoxus (systolic BP drops more than 10 mmHg during inspiration)", "Hypertension with widened pulse pressure", "Tachycardia"],
    a: -1,
    ca: [0, 1, 2, 3, 5],
    t: "sata",
    r: "Cardiac tamponade presents with Beck's triad (hypotension, muffled heart sounds, JVD) plus pulsus paradoxus and tachycardia. Hypertension with widened pulse pressure is not characteristic; tamponade causes hypotension with narrowed pulse pressure.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is preparing a client for an ECG. Which actions are correct? (Select all that apply.)",
    o: ["Place the client in a supine position", "Ensure the skin is clean and dry where electrodes will be placed", "Remove chest hair if needed to improve electrode contact", "Ask the client to hold their breath during the recording", "Ensure all 10 electrodes are properly placed", "Inform the client the test is painless and takes only a few minutes"],
    a: -1,
    ca: [0, 1, 2, 4, 5],
    t: "sata",
    r: "Supine positioning, clean dry skin, chest hair removal, proper 10-electrode placement, and client education about the painless nature of the test are all correct. Clients should breathe normally during ECG recording, as breath-holding can cause artifact or affect the tracing.",
    s: "Cardiovascular"
  },
  {
    q: "A client with DVT is being transitioned from IV heparin to oral warfarin. Which nursing actions are appropriate during the transition? (Select all that apply.)",
    o: ["Continue heparin and warfarin simultaneously until INR is therapeutic for at least 24 hours", "Monitor INR daily during the overlap period", "Educate the client about dietary considerations with warfarin", "Discontinue heparin as soon as the first dose of warfarin is given", "Assess for signs and symptoms of bleeding during overlap therapy", "Maintain bed rest throughout the entire overlap period"],
    a: -1,
    ca: [0, 1, 2, 4],
    t: "sata",
    r: "Overlapping heparin and warfarin, monitoring INR, dietary education, and bleeding assessment are all appropriate. Heparin should NOT be stopped immediately when warfarin starts because warfarin takes several days to reach full effect. Strict bed rest throughout the overlap is unnecessary once initial DVT treatment is established.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is educating a client about modifiable risk factors for coronary artery disease. Which factors should be included? (Select all that apply.)",
    o: ["Smoking", "Hyperlipidemia", "Sedentary lifestyle", "Age over 65 years", "Poorly controlled diabetes mellitus", "Obesity", "Family history of heart disease"],
    a: -1,
    ca: [0, 1, 2, 4, 5],
    t: "sata",
    r: "Smoking, hyperlipidemia, sedentary lifestyle, poorly controlled diabetes, and obesity are all modifiable risk factors that can be changed through lifestyle modifications and medical management. Age over 65 and family history of heart disease are non-modifiable risk factors.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is caring for a client with infective endocarditis. Which findings should the nurse assess for? (Select all that apply.)",
    o: ["Petechiae on the conjunctivae or mucous membranes", "Splinter hemorrhages in the nail beds", "Osler nodes on the fingers and toes", "Janeway lesions on the palms and soles", "New or changing heart murmur", "Decreased platelet count from spleen infection"],
    a: -1,
    ca: [0, 1, 2, 3, 4],
    t: "sata",
    r: "Petechiae, splinter hemorrhages, Osler nodes, Janeway lesions, and new/changing murmurs are classic findings of infective endocarditis from septic emboli and immune complex deposition. Decreased platelet count from splenic infection is not a hallmark finding of endocarditis (thrombocytopenia can occur but is not a classic assessment finding).",
    s: "Cardiovascular"
  },
  {
    q: "A client is post-open heart surgery. Which signs of complications should the nurse monitor for? (Select all that apply.)",
    o: ["Excessive chest tube drainage exceeding 200 mL per hour", "Cardiac tamponade from bleeding into the pericardial space", "Mediastinitis indicated by fever and sternal wound drainage", "New-onset atrial fibrillation, which is common after cardiac surgery", "Renal impairment from cardiopulmonary bypass", "Mild incisional pain on postoperative day 1"],
    a: -1,
    ca: [0, 1, 2, 3, 4],
    t: "sata",
    r: "Excessive chest tube drainage, cardiac tamponade, mediastinitis, new-onset afib, and renal impairment are all recognized complications after open heart surgery. Mild incisional pain on post-op day 1 is expected and normal, not a complication.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is caring for a client with pulmonary embolism. Which nursing interventions are appropriate? (Select all that apply.)",
    o: ["Administer supplemental oxygen to maintain SpO2 above 92%", "Initiate anticoagulation therapy as ordered", "Elevate the head of the bed to ease breathing", "Encourage vigorous coughing to clear pulmonary secretions", "Monitor for signs of right ventricular failure", "Provide emotional support and reduce anxiety"],
    a: -1,
    ca: [0, 1, 2, 4, 5],
    t: "sata",
    r: "Oxygen therapy, anticoagulation, elevating the HOB, monitoring for right heart failure, and emotional support are all appropriate PE interventions. Vigorous coughing is not recommended as it does not address the underlying problem (thrombus) and may increase discomfort.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is assessing a client for signs and symptoms of left-sided heart failure. Which findings are expected? (Select all that apply.)",
    o: ["Dyspnea on exertion", "Orthopnea", "Crackles in the lung fields", "Paroxysmal nocturnal dyspnea", "Hepatomegaly", "S3 heart sound (ventricular gallop)"],
    a: -1,
    ca: [0, 1, 2, 3, 5],
    t: "sata",
    r: "Left-sided heart failure causes pulmonary congestion: dyspnea on exertion, orthopnea, crackles, PND, and S3 heart sound (indicating volume overload). Hepatomegaly is a sign of right-sided heart failure from systemic venous congestion.",
    s: "Cardiovascular"
  },
  {
    q: "A client with an AAA is being managed conservatively. Which instructions should the nurse include? (Select all that apply.)",
    o: ["Take blood pressure medications as prescribed", "Report any sudden severe abdominal or back pain immediately", "Avoid heavy lifting and straining", "Stop smoking if applicable", "Attend regular surveillance imaging as scheduled", "Increase sodium intake to maintain blood pressure"],
    a: -1,
    ca: [0, 1, 2, 3, 4],
    t: "sata",
    r: "BP control, reporting warning signs (sudden pain), avoiding activities that increase aortic pressure (heavy lifting), smoking cessation, and regular imaging surveillance are all essential for conservative AAA management. Increasing sodium would raise blood pressure and increase aneurysm rupture risk.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is educating a client about PAD self-management. Which instructions are correct? (Select all that apply.)",
    o: ["Inspect feet daily for cuts, blisters, or color changes", "Avoid walking barefoot to prevent injury", "Participate in a walking exercise program as prescribed", "Apply heating pads to improve circulation in cold feet", "Keep toenails trimmed straight across by a podiatrist if needed", "Wear properly fitted shoes with cushioned soles"],
    a: -1,
    ca: [0, 1, 2, 4, 5],
    t: "sata",
    r: "Daily foot inspection, avoiding barefoot walking, exercise programs, proper toenail care, and appropriate footwear are all correct PAD self-management strategies. Heating pads should be avoided because decreased sensation in PAD extremities increases burn risk.",
    s: "Cardiovascular"
  },
  {
    q: "A client with a permanent pacemaker is being discharged. Which safety instructions should the nurse provide? (Select all that apply.)",
    o: ["Carry a pacemaker identification card at all times", "Avoid MRI unless cleared by the cardiologist", "Report signs of dizziness, fainting, or persistent hiccups", "Avoid holding cell phones directly over the pacemaker site", "Keep scheduled follow-up appointments for device checks", "You may use a microwave oven safely at home"],
    a: -1,
    ca: [0, 1, 2, 3, 4, 5],
    t: "sata",
    r: "All of these are correct pacemaker discharge instructions. Carrying ID, MRI precautions, reporting symptoms of malfunction, cell phone positioning, regular device checks, and reassurance about microwave safety are all standard education points for pacemaker clients.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is preparing to administer IV amiodarone to a client with ventricular tachycardia. Which precautions should the nurse take? (Select all that apply.)",
    o: ["Use a central line if available, as amiodarone can cause phlebitis in peripheral veins", "Monitor the ECG continuously during the infusion", "Assess blood pressure frequently as amiodarone can cause hypotension", "Mix amiodarone with dextrose 5% in water (D5W) only, not normal saline", "Have emergency resuscitation equipment readily available"],
    a: -1,
    ca: [0, 1, 2, 3, 4],
    t: "sata",
    r: "All listed precautions are correct for IV amiodarone administration. Central line use is preferred to prevent phlebitis. Continuous ECG and BP monitoring are essential. Amiodarone must be mixed in D5W (not NS, as it precipitates). Emergency equipment should always be available during antiarrhythmic infusions.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is caring for a post-heart transplant client. Which assessments indicate possible organ rejection? (Select all that apply.)",
    o: ["Low-grade fever without other infection source", "New-onset shortness of breath or exercise intolerance", "Weight gain from fluid retention", "Fatigue and malaise", "Decreased blood pressure and irregular heart rhythm", "Improved energy and appetite"],
    a: -1,
    ca: [0, 1, 2, 3, 4],
    t: "sata",
    r: "Fever, dyspnea, weight gain, fatigue, hypotension, and dysrhythmias can all indicate cardiac rejection. Improved energy and appetite suggest recovery, not rejection.",
    s: "Cardiovascular"
  },
  {
    q: "A client is being treated for hypertensive emergency with IV nicardipine. Which monitoring parameters are essential? (Select all that apply.)",
    o: ["Continuous blood pressure monitoring via arterial line", "Hourly neurological assessments for signs of encephalopathy", "Continuous cardiac monitoring for dysrhythmias", "Urine output monitoring for renal perfusion assessment", "Daily thyroid function tests", "Assessment for headache, which may indicate excessive vasodilation"],
    a: -1,
    ca: [0, 1, 2, 3, 5],
    t: "sata",
    r: "Continuous BP monitoring, neurological assessment, cardiac monitoring, urine output monitoring, and headache assessment are all essential during hypertensive emergency treatment with IV nicardipine. Daily thyroid function tests are not relevant to nicardipine therapy.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is assessing a client for complications after coronary artery bypass graft (CABG) surgery. Which findings require immediate reporting? (Select all that apply.)",
    o: ["Chest tube output greater than 200 mL in one hour", "Blood pressure of 80/50 mmHg unresponsive to fluid boluses", "Temperature of 38.9 C with sternal wound redness and drainage", "New-onset ventricular tachycardia on the cardiac monitor", "Urine output less than 0.5 mL/kg/hour for 2 consecutive hours"],
    a: -1,
    ca: [0, 1, 2, 3, 4],
    t: "sata",
    r: "All listed findings require immediate reporting: excessive chest tube drainage (hemorrhage risk), persistent hypotension (possible cardiac tamponade or hemorrhage), fever with wound changes (infection), new VT (life-threatening dysrhythmia), and oliguria (renal hypoperfusion). These are all serious post-CABG complications.",
    s: "Cardiovascular"
  },
  {
    q: "A client is diagnosed with deep vein thrombosis. Which risk factors does the nurse identify as contributing? (Select all that apply.)",
    o: ["Recent surgery with prolonged immobility", "Oral contraceptive use", "Long-distance air travel within the past week", "History of previous DVT", "Active cancer diagnosis", "Regular daily walking exercise program"],
    a: -1,
    ca: [0, 1, 2, 3, 4],
    t: "sata",
    r: "Recent surgery/immobility, oral contraceptives (increase clotting factors), long travel (venous stasis), previous DVT history, and active cancer (hypercoagulable state) are all recognized DVT risk factors. Regular walking is a protective factor that reduces DVT risk.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is caring for a client receiving IV nitroglycerin for acute heart failure. Which monitoring parameters are essential? (Select all that apply.)",
    o: ["Continuous blood pressure monitoring", "Headache assessment, as it is a common side effect", "Heart rate monitoring for reflex tachycardia", "Chest pain assessment to evaluate medication effectiveness", "Urine output monitoring for adequate renal perfusion", "Lung sounds assessment for improvement of crackles"],
    a: -1,
    ca: [0, 1, 2, 3, 4, 5],
    t: "sata",
    r: "All parameters are essential during IV nitroglycerin therapy: BP monitoring (hypotension risk), headache assessment (common side effect from vasodilation), HR monitoring (reflex tachycardia), chest pain evaluation (effectiveness), urine output (perfusion), and lung sounds (treatment response). Comprehensive monitoring is required for this vasoactive medication.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is educating a client about signs of digoxin toxicity. Which symptoms should the client report? (Select all that apply.)",
    o: ["Nausea and vomiting", "Visual disturbances such as yellow-green halos around lights", "Loss of appetite", "Heart rate below 60 bpm", "Confusion or altered mental status", "Increased urination"],
    a: -1,
    ca: [0, 1, 2, 3, 4],
    t: "sata",
    r: "Nausea, vomiting, visual disturbances (yellow-green halos), anorexia, bradycardia (HR below 60), and confusion are all signs of digoxin toxicity. Increased urination is not a typical sign of digoxin toxicity (it may be related to concurrent diuretic therapy).",
    s: "Cardiovascular"
  },
  {
    q: "A client with an implantable cardioverter-defibrillator (ICD) is being discharged. Which instructions should the nurse provide? (Select all that apply.)",
    o: ["Avoid strong magnetic fields such as MRI machines unless cleared", "If the ICD fires, sit or lie down safely and note the time", "Call the healthcare provider if the ICD fires more than once in a short period", "Avoid operating heavy machinery for the first few weeks", "You may resume driving according to provincial regulations and provider guidance", "Submerge the device in water daily to test its function"],
    a: -1,
    ca: [0, 1, 2, 3, 4],
    t: "sata",
    r: "MRI precautions, safety during ICD firing, reporting multiple shocks, machinery restrictions, and driving guidance are all appropriate ICD discharge instructions. Submerging the device in water is nonsensical and potentially dangerous; ICDs are tested by the electrophysiology team during scheduled appointments.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is reviewing medications for a client in cardiogenic shock. Which medications may be administered? (Select all that apply.)",
    o: ["Dobutamine to increase myocardial contractility", "Norepinephrine to maintain blood pressure through vasoconstriction", "Milrinone as an inodilator to improve cardiac output", "Furosemide to reduce pulmonary congestion if volume overloaded", "Oral nifedipine to reduce afterload"],
    a: -1,
    ca: [0, 1, 2, 3],
    t: "sata",
    r: "Dobutamine, norepinephrine, milrinone, and IV furosemide may all be used in cardiogenic shock management. Oral nifedipine is inappropriate in cardiogenic shock because it can cause precipitous hypotension, and oral medications are unreliable in shock states with poor GI perfusion.",
    s: "Cardiovascular"
  },
  {
    q: "A client with aortic stenosis is being monitored. Which assessment findings suggest worsening stenosis? (Select all that apply.)",
    o: ["Syncope with exertion", "Angina that does not respond to nitroglycerin", "Progressive dyspnea on exertion", "Systolic murmur that becomes louder over time then diminishes as stenosis becomes critical", "Widening pulse pressure"],
    a: -1,
    ca: [0, 1, 2, 3],
    t: "sata",
    r: "Exertional syncope, refractory angina, progressive DOE, and murmur changes (louder then quieter as flow decreases in critical stenosis) all indicate worsening aortic stenosis. Widening pulse pressure is characteristic of aortic regurgitation, not stenosis. Aortic stenosis typically causes a narrow pulse pressure.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is assessing a client for signs of arterial insufficiency in the lower extremities. Which findings are consistent with arterial disease? (Select all that apply.)",
    o: ["Diminished or absent pedal pulses", "Cool and pale skin on the feet", "Hair loss on the lower legs", "Thick, brown, discolored skin around the ankles", "Intermittent claudication with walking", "Shiny, thin skin on the feet and legs"],
    a: -1,
    ca: [0, 1, 2, 4, 5],
    t: "sata",
    r: "Diminished pulses, cool/pale skin, hair loss, claudication, and shiny/thin skin are all signs of arterial insufficiency from reduced blood flow. Brown discoloration (hemosiderin staining) around the ankles is characteristic of chronic venous insufficiency, not arterial disease.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is caring for a client with an IABP. Which assessments are critical? (Select all that apply.)",
    o: ["Bilateral pedal pulses and lower extremity neurovascular status", "Correct timing of balloon inflation and deflation on the arterial waveform", "Urine output to assess renal perfusion", "Daily chest X-ray to verify catheter position", "Signs of hemolysis such as dark urine or elevated LDH"],
    a: -1,
    ca: [0, 1, 2, 3, 4],
    t: "sata",
    r: "All listed assessments are critical for IABP monitoring: pedal pulses (vascular compromise), timing (effectiveness), urine output (perfusion), chest X-ray (catheter position), and hemolysis signs (mechanical destruction of RBCs by the balloon). Comprehensive monitoring is essential for this mechanical circulatory support device.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is preparing a client for cardioversion for persistent atrial fibrillation. Which actions are appropriate? (Select all that apply.)",
    o: ["Ensure the client has been on anticoagulation therapy or had a TEE to rule out atrial thrombus", "Verify the defibrillator is set to synchronized mode", "Obtain informed consent from the client", "Ensure IV access is established", "Administer sedation as ordered before the procedure", "Tell the client they will feel significant pain during the shock"],
    a: -1,
    ca: [0, 1, 2, 3, 4],
    t: "sata",
    r: "Anticoagulation/TEE verification, synchronized mode, informed consent, IV access, and procedural sedation are all appropriate pre-cardioversion actions. With proper sedation, the client should not feel significant pain, and telling them this could cause unnecessary anxiety.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is educating a heart transplant recipient about infection prevention. Which instructions should be included? (Select all that apply.)",
    o: ["Avoid crowded places during peak flu season", "Practice thorough hand hygiene frequently", "Avoid raw or undercooked foods that may harbor pathogens", "Wear a mask in healthcare settings as recommended", "Report any signs of infection promptly, even mild symptoms", "Stop immunosuppressive medications during cold and flu season to boost immunity"],
    a: -1,
    ca: [0, 1, 2, 3, 4],
    t: "sata",
    r: "Avoiding crowds, hand hygiene, food safety, masking, and prompt reporting of infection signs are all essential infection prevention strategies for immunosuppressed transplant recipients. Stopping immunosuppressants would cause organ rejection and is never appropriate.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is monitoring a client on a heparin drip. Which laboratory values should be monitored? (Select all that apply.)",
    o: ["Activated partial thromboplastin time (aPTT)", "Platelet count to detect heparin-induced thrombocytopenia", "Hemoglobin and hematocrit to assess for bleeding", "Prothrombin time/INR to assess heparin effectiveness", "Serum potassium levels"],
    a: -1,
    ca: [0, 1, 2],
    t: "sata",
    r: "aPTT (heparin effectiveness), platelet count (HIT detection), and hemoglobin/hematocrit (bleeding assessment) should be monitored during heparin therapy. PT/INR monitors warfarin effectiveness, not heparin. Serum potassium is not directly affected by heparin therapy (although rare hyperkalemia can occur, it is not a routine monitoring parameter).",
    s: "Cardiovascular"
  },
  {
    q: "A client is being discharged after a myocardial infarction. Which lifestyle modifications should the nurse emphasize? (Select all that apply.)",
    o: ["Participate in a cardiac rehabilitation program", "Follow a heart-healthy diet low in saturated fat and sodium", "Stop smoking and avoid secondhand smoke", "Manage stress through relaxation techniques", "Resume all pre-MI activities immediately without restrictions", "Take all prescribed medications consistently"],
    a: -1,
    ca: [0, 1, 2, 3, 5],
    t: "sata",
    r: "Cardiac rehab, heart-healthy diet, smoking cessation, stress management, and medication adherence are all essential post-MI lifestyle modifications. Resuming all pre-MI activities immediately is dangerous; activity should be gradually increased under medical guidance.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is assessing a client with suspected aortic dissection. Which findings support this diagnosis? (Select all that apply.)",
    o: ["Sudden, severe, tearing chest pain radiating to the back", "Significant blood pressure difference between the two arms", "A new diastolic murmur from aortic regurgitation", "Widened mediastinum on chest X-ray", "Positive D-dimer level", "Gradual onset of mild chest discomfort over several days"],
    a: -1,
    ca: [0, 1, 2, 3],
    t: "sata",
    r: "Sudden tearing pain, BP difference between arms (>20 mmHg), new aortic regurgitation murmur, and widened mediastinum on CXR are all classic findings of aortic dissection. D-dimer may be elevated but is nonspecific. Gradual onset over days is inconsistent with aortic dissection, which presents acutely.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is educating a client about nitroglycerin sublingual tablets for angina. Which instructions are correct? (Select all that apply.)",
    o: ["Place the tablet under the tongue and let it dissolve completely", "If chest pain persists after one tablet, call emergency services immediately as current guidelines recommend", "Store the tablets in the original dark glass container away from heat and light", "A burning or tingling sensation under the tongue indicates the tablet is active", "Take the tablet while lying down or sitting to prevent dizziness from blood pressure drop"],
    a: -1,
    ca: [0, 1, 2, 3, 4],
    t: "sata",
    r: "All instructions are correct: sublingual placement, calling emergency services if pain persists after one dose (current guideline update), proper storage in dark glass container, burning/tingling indicates potency, and positioning to prevent orthostatic hypotension. Current Canadian guidelines recommend calling for help after one dose if pain does not resolve.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is assessing for complications in a client with an indwelling central venous catheter. Which findings suggest catheter-related complications? (Select all that apply.)",
    o: ["Fever and chills without another identifiable source", "Redness, swelling, or drainage at the insertion site", "Sudden onset of dyspnea and chest pain after line insertion", "New cardiac murmur heard on auscultation", "Blood return when aspirating from the catheter line"],
    a: -1,
    ca: [0, 1, 2, 3],
    t: "sata",
    r: "Unexplained fever/chills (catheter-related bloodstream infection), insertion site inflammation (local infection), sudden dyspnea/chest pain (pneumothorax or air embolism from insertion), and new murmur (endocarditis from catheter infection) are all catheter-related complications. Blood return when aspirating is normal and indicates the catheter is patent.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is caring for a client with acute coronary syndrome who is receiving morphine. Which assessments are important? (Select all that apply.)",
    o: ["Pain level using a standardized scale", "Respiratory rate and depth", "Blood pressure for hypotension", "Level of consciousness for sedation", "Bowel sounds for constipation risk"],
    a: -1,
    ca: [0, 1, 2, 3, 4],
    t: "sata",
    r: "All assessments are important with morphine administration: pain assessment (effectiveness), respiratory status (respiratory depression), BP (hypotension), LOC (sedation), and bowel sounds (opioid-induced constipation). Morphine has multiple systemic effects requiring comprehensive monitoring.",
    s: "Cardiovascular"
  },
  // === Ordered Response Questions 251-275 ===
  {
    q: "A client in the cardiac care unit goes into cardiac arrest. Place the following actions in the correct order of priority.",
    o: ["Assess responsiveness and call for help", "Begin chest compressions (C-A-B sequence)", "Attach the AED/defibrillator and analyze rhythm", "Deliver shock if indicated for shockable rhythm", "Administer epinephrine 1 mg IV as ordered", "Resume CPR for 2 minutes after shock delivery"],
    a: -1,
    co: [0, 1, 2, 3, 4, 5],
    t: "ordered",
    r: "The correct sequence follows ACLS/BLS protocol: assess responsiveness and activate help, begin high-quality CPR with compressions first (C-A-B), attach defibrillator and analyze rhythm, shock if VF/VT, administer epinephrine, and resume CPR cycles. This sequence maximizes the chance of return of spontaneous circulation.",
    s: "Cardiovascular"
  },
  {
    q: "A client presents with chest pain suspicious for acute MI. Arrange the nursing actions in priority order.",
    o: ["Perform a focused assessment and obtain vital signs", "Administer aspirin as ordered", "Obtain a 12-lead ECG within 10 minutes of arrival", "Establish IV access and draw cardiac biomarkers", "Administer nitroglycerin sublingual as ordered for chest pain", "Prepare for transfer to the cardiac catheterization lab if STEMI confirmed"],
    a: -1,
    co: [0, 2, 1, 3, 4, 5],
    t: "ordered",
    r: "Initial assessment and vitals establish baseline. ECG within 10 minutes is critical for STEMI diagnosis. Aspirin is given early to inhibit platelet aggregation. IV access and biomarkers support diagnosis and treatment. Nitroglycerin addresses chest pain. Cath lab preparation follows STEMI confirmation. This sequence reflects time-sensitive MI management.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse discovers a client's IV heparin infusion is running at twice the prescribed rate. Place the actions in correct priority order.",
    o: ["Immediately adjust the infusion to the correct rate", "Assess the client for signs of bleeding", "Check vital signs and neurological status", "Notify the healthcare provider of the medication error", "Draw aPTT and CBC as ordered", "Complete an incident report according to facility policy"],
    a: -1,
    co: [0, 1, 2, 3, 4, 5],
    t: "ordered",
    r: "First correct the error by adjusting the rate, then assess for harm (bleeding signs), check vital signs, notify the provider for medical evaluation, obtain labs to assess coagulation status, and complete documentation/reporting. Client safety comes first, followed by assessment, provider notification, and documentation.",
    s: "Cardiovascular"
  },
  {
    q: "A client develops signs of cardiac tamponade after cardiac surgery. Place the nursing actions in priority order.",
    o: ["Recognize Beck's triad: hypotension, JVD, and muffled heart sounds", "Call the healthcare provider and prepare for emergent pericardiocentesis", "Maintain IV access and prepare for rapid volume resuscitation", "Position the client upright to optimize hemodynamics", "Monitor vital signs continuously and prepare emergency equipment", "Administer IV fluids rapidly to increase preload as ordered"],
    a: -1,
    co: [0, 4, 1, 2, 5, 3],
    t: "ordered",
    r: "First recognize the emergency (Beck's triad), then ensure continuous monitoring and emergency preparedness, call for emergent intervention (pericardiocentesis), maintain IV access for resuscitation, administer fluids to increase preload, and optimize positioning. Rapid recognition and intervention are critical as tamponade is immediately life-threatening.",
    s: "Cardiovascular"
  },
  {
    q: "A client with heart failure is being started on ACE inhibitor therapy. Place the nursing actions in the correct sequence.",
    o: ["Obtain baseline blood pressure, heart rate, potassium level, and renal function", "Administer the first dose with the client lying down to monitor for first-dose hypotension", "Monitor blood pressure 2 hours after the first dose", "Educate the client about potential side effects including dry cough and dizziness", "Schedule follow-up lab work for potassium and creatinine in 1-2 weeks", "Assess client understanding by having them repeat key instructions"],
    a: -1,
    co: [0, 1, 2, 3, 4, 5],
    t: "ordered",
    r: "Baseline assessment first (BP, labs), then administer with monitoring for first-dose hypotension, check BP response, provide education, schedule follow-up labs, and verify understanding. This sequence ensures safe medication initiation with proper monitoring and education.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is performing CPR on an adult client. Place the chest compression steps in the correct sequence.",
    o: ["Position the client on a firm, flat surface", "Place the heel of one hand on the center of the chest at the lower half of the sternum", "Place the other hand on top and interlace fingers", "Compress the chest at least 5 cm (2 inches) deep at a rate of 100-120 compressions per minute", "Allow full chest recoil between compressions", "Minimize interruptions in compressions to less than 10 seconds"],
    a: -1,
    co: [0, 1, 2, 3, 4, 5],
    t: "ordered",
    r: "Proper CPR sequence: position on firm surface, correct hand placement on sternum, interlace fingers, compress with adequate depth and rate, allow full recoil, and minimize interruptions. This sequence ensures high-quality CPR that maximizes cardiac output during arrest.",
    s: "Cardiovascular"
  },
  {
    q: "A client with atrial fibrillation is being prepared for elective cardioversion. Place the preparation steps in correct order.",
    o: ["Verify the client has been anticoagulated for at least 3 weeks or has a negative TEE for atrial thrombus", "Obtain informed consent from the client", "Ensure NPO status for at least 6-8 hours before the procedure", "Establish IV access and continuous ECG monitoring", "Administer procedural sedation as ordered", "Set the defibrillator to synchronized mode and deliver the shock"],
    a: -1,
    co: [0, 1, 2, 3, 4, 5],
    t: "ordered",
    r: "Anticoagulation verification prevents embolic stroke during cardioversion. Informed consent follows. NPO status prevents aspiration during sedation. IV and monitoring establish safety. Sedation provides comfort. Synchronized cardioversion is delivered last. This systematic approach ensures safe and effective cardioversion.",
    s: "Cardiovascular"
  },
  {
    q: "A client is receiving a blood transfusion and develops signs of a transfusion reaction. Place the nursing actions in priority order.",
    o: ["Stop the transfusion immediately", "Maintain IV access with normal saline using new tubing", "Assess vital signs and the client's symptoms", "Notify the healthcare provider and the blood bank", "Send the blood bag and tubing to the lab for analysis", "Document the reaction, interventions, and client response"],
    a: -1,
    co: [0, 1, 2, 3, 4, 5],
    t: "ordered",
    r: "Stop the transfusion first to prevent further reaction. Maintain IV access with new tubing (do not flush existing tubing). Assess the client's condition. Notify provider and blood bank. Send blood products for analysis. Document everything. This sequence prioritizes client safety and follows transfusion reaction protocol.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is admitting a client with suspected DVT. Place the nursing assessments and interventions in priority order.",
    o: ["Perform a focused assessment of the affected extremity (warmth, swelling, pain, discoloration)", "Maintain the client on bed rest and elevate the affected extremity", "Notify the healthcare provider and anticipate orders for Doppler ultrasound", "Initiate anticoagulation therapy as ordered after diagnosis confirmation", "Educate the client about the importance of bed rest and not massaging the affected leg", "Apply sequential compression devices to the unaffected leg as ordered"],
    a: -1,
    co: [0, 1, 2, 3, 5, 4],
    t: "ordered",
    r: "Assessment first establishes baseline. Bed rest and elevation prevent clot dislodgement. Provider notification and diagnostic testing confirm diagnosis. Anticoagulation treats the DVT. SCDs on the unaffected leg prevent further clot formation. Education ensures client safety. This sequence follows the assessment-intervention-education framework.",
    s: "Cardiovascular"
  },
  {
    q: "A client with heart failure develops acute pulmonary edema. Place the nursing interventions in priority order.",
    o: ["Position the client in high Fowler's position with legs dangling over the side of the bed", "Apply supplemental oxygen or prepare for non-invasive ventilation as ordered", "Administer IV furosemide as ordered", "Administer IV morphine or nitroglycerin as ordered to reduce preload", "Establish continuous cardiac monitoring and pulse oximetry", "Insert a Foley catheter to accurately measure urine output"],
    a: -1,
    co: [0, 1, 4, 2, 3, 5],
    t: "ordered",
    r: "High Fowler's with legs dangling reduces preload immediately. Oxygen addresses hypoxemia. Cardiac monitoring and pulse oximetry establish continuous assessment. IV furosemide reduces volume overload. Morphine/nitroglycerin further reduces preload. Foley catheter measures diuresis. This sequence addresses the most life-threatening issues first.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is preparing to administer IV adenosine for supraventricular tachycardia. Place the administration steps in correct order.",
    o: ["Verify the healthcare provider's order and confirm the correct dose (typically 6 mg initially)", "Establish IV access closest to the heart (antecubital preferred)", "Draw up the adenosine and a 20 mL normal saline flush", "Inform the client they may experience brief chest tightness and flushing", "Administer the adenosine as a rapid IV push over 1-2 seconds", "Immediately follow with a rapid 20 mL saline flush and elevate the arm"],
    a: -1,
    co: [0, 1, 2, 3, 4, 5],
    t: "ordered",
    r: "Verify order and dose, ensure proximal IV access (adenosine has a 10-second half-life), prepare medication and flush, warn the client about expected sensations, administer rapid push, and immediately flush. The rapid administration is critical because adenosine is rapidly metabolized by red blood cells.",
    s: "Cardiovascular"
  },
  {
    q: "A client post-MI is being started on Phase I cardiac rehabilitation. Place the activity progression in the correct order.",
    o: ["Bed rest with passive range-of-motion exercises", "Sitting at the edge of the bed with dangling legs", "Standing at the bedside with assistance", "Walking in the room with supervision", "Walking in the hallway with supervised ambulation", "Stair climbing assessment before discharge"],
    a: -1,
    co: [0, 1, 2, 3, 4, 5],
    t: "ordered",
    r: "Phase I cardiac rehabilitation follows a progressive activity protocol: starting with bed rest and passive ROM, progressing to sitting, standing, room ambulation, hallway walking, and finally stair assessment. Each step is monitored for hemodynamic stability and symptoms before progressing to the next level.",
    s: "Cardiovascular"
  },
  {
    q: "A client on warfarin presents with an INR of 8.5 and minor gum bleeding. Place the interventions in priority order.",
    o: ["Hold all warfarin doses", "Apply local pressure to the bleeding gums", "Notify the healthcare provider immediately", "Administer oral vitamin K as ordered", "Monitor INR frequently until it returns to therapeutic range", "Educate the client about factors that may have contributed to the elevated INR"],
    a: -1,
    co: [0, 1, 2, 3, 4, 5],
    t: "ordered",
    r: "Hold warfarin to prevent further anticoagulation. Apply local pressure to control active bleeding. Notify the provider for medical management. Administer vitamin K as ordered to reverse warfarin effect. Monitor INR for response. Educate to prevent recurrence. This sequence addresses the immediate safety concern first.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is inserting a peripheral IV for a client about to receive IV amiodarone. Place the steps in correct order.",
    o: ["Gather supplies and perform hand hygiene", "Apply a tourniquet and select an appropriate vein, preferably a large vein to reduce phlebitis risk", "Clean the insertion site with antiseptic and allow to dry", "Insert the IV catheter using aseptic technique", "Secure the catheter and connect to the IV tubing primed with D5W", "Document the insertion site, catheter size, number of attempts, and client tolerance"],
    a: -1,
    co: [0, 1, 2, 3, 4, 5],
    t: "ordered",
    r: "Proper IV insertion sequence: prepare supplies and hand hygiene, select vein (large vein for amiodarone to prevent phlebitis), clean site, insert catheter, secure and connect tubing (D5W for amiodarone), and document. Aseptic technique throughout prevents infection.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse discovers a client in the hallway who is unconscious and not breathing normally. Place the emergency response actions in correct order using the BLS algorithm.",
    o: ["Verify the scene is safe and check for responsiveness", "Activate the emergency response system and call for an AED", "Check for a pulse (no more than 10 seconds)", "Begin high-quality chest compressions if no pulse is detected", "Open the airway and provide rescue breaths (30:2 ratio)", "Apply the AED as soon as available and follow prompts"],
    a: -1,
    co: [0, 1, 2, 3, 4, 5],
    t: "ordered",
    r: "BLS algorithm: scene safety and responsiveness check, activate emergency response and get AED, pulse check (10 seconds max), begin compressions if pulseless (C-A-B), provide ventilations, and apply AED when available. This sequence follows current resuscitation guidelines.",
    s: "Cardiovascular"
  },
  {
    q: "A client with cardiogenic shock is being prepared for IABP insertion. Place the nursing actions in correct priority order.",
    o: ["Obtain baseline vital signs and document bilateral pedal pulse quality", "Verify informed consent has been obtained", "Ensure the client has continuous arterial blood pressure and ECG monitoring", "Assist with the insertion procedure using sterile technique", "Verify correct balloon timing on the arterial waveform after insertion", "Assess distal circulation in the affected limb immediately after insertion"],
    a: -1,
    co: [0, 1, 2, 3, 4, 5],
    t: "ordered",
    r: "Baseline assessment first for post-procedure comparison. Consent is legally required. Continuous monitoring ensures safety. Sterile technique prevents infection. Timing verification ensures IABP effectiveness. Distal circulation check detects vascular compromise. This systematic approach ensures safe IABP insertion and management.",
    s: "Cardiovascular"
  },
  {
    q: "A client develops ventricular tachycardia with a pulse. Heart rate is 188 bpm. Blood pressure is 80/50. Place the interventions in priority order.",
    o: ["Recognize the rhythm as VT with hemodynamic instability", "Call for the crash cart and additional help", "Prepare for immediate synchronized cardioversion", "Administer sedation if time permits and the client is conscious", "Deliver synchronized cardioversion at the appropriate energy level", "Assess the rhythm after cardioversion and treat according to response"],
    a: -1,
    co: [0, 1, 2, 3, 4, 5],
    t: "ordered",
    r: "Recognize the unstable VT, call for help, prepare for cardioversion (primary treatment for unstable VT with pulse), sedate if possible, deliver the shock, and reassess. Hemodynamically unstable VT with a pulse requires prompt synchronized cardioversion.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is initiating IV heparin therapy for a client with DVT. Place the steps in correct order.",
    o: ["Verify the healthcare provider's order for heparin dose and target aPTT range", "Obtain baseline aPTT, platelet count, and coagulation studies", "Calculate the correct loading dose and maintenance infusion rate based on the client's weight", "Administer the IV bolus dose as ordered using an infusion pump", "Set the maintenance infusion rate on the pump", "Draw aPTT 6 hours after initiation and adjust rate per protocol"],
    a: -1,
    co: [0, 1, 2, 3, 4, 5],
    t: "ordered",
    r: "Verify orders first, obtain baseline labs, calculate weight-based dosing, administer the bolus, set the maintenance rate, and monitor with aPTT at 6 hours. This systematic approach ensures safe heparin initiation with appropriate monitoring.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is assessing a client who may be having an anaphylactic reaction to IV contrast dye during cardiac catheterization. Place the actions in priority order.",
    o: ["Stop the contrast dye infusion immediately", "Maintain the airway and assess breathing", "Administer epinephrine IM as ordered", "Administer supplemental oxygen and prepare for possible intubation", "Establish or maintain large-bore IV access for fluid resuscitation", "Administer diphenhydramine and corticosteroids as ordered"],
    a: -1,
    co: [0, 1, 2, 3, 4, 5],
    t: "ordered",
    r: "Stop the offending agent first, maintain airway and breathing, administer epinephrine (first-line treatment for anaphylaxis), provide oxygen and prepare for advanced airway, ensure IV access for fluids, and administer adjunct medications. This follows the anaphylaxis management algorithm.",
    s: "Cardiovascular"
  },
  {
    q: "A client is being discharged after a myocardial infarction. Place the discharge education topics in the recommended teaching priority.",
    o: ["When to call emergency services (return of chest pain, dyspnea, diaphoresis)", "Medication names, doses, purposes, and side effects", "Activity restrictions and gradual return to activities", "Dietary modifications (low sodium, low saturated fat)", "Cardiac rehabilitation schedule and importance", "Follow-up appointment dates and necessary lab work"],
    a: -1,
    co: [0, 1, 2, 3, 4, 5],
    t: "ordered",
    r: "Emergency recognition is taught first (life-saving information). Medication education follows (critical for adherence). Activity guidelines prevent overexertion. Dietary changes support recovery. Cardiac rehab promotes long-term outcomes. Follow-up ensures continuity. This order prioritizes life-threatening knowledge first.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is triaging four cardiac clients in the emergency department. Place them in order of priority for assessment (most urgent first).",
    o: ["Client with crushing chest pain, diaphoresis, and ST elevation on monitor", "Client with blood pressure 220/130 and severe headache with confusion", "Client with new-onset atrial fibrillation, heart rate 142, blood pressure 118/76", "Client with stable angina and chest pain relieved by rest"],
    a: -1,
    co: [0, 1, 2, 3],
    t: "ordered",
    r: "STEMI is the highest priority due to time-sensitive need for reperfusion. Hypertensive emergency with neurological symptoms is next due to end-organ damage risk. New-onset afib with RVR needs assessment but is more hemodynamically stable. Stable angina resolved by rest is lowest acuity. Triage follows severity and time-sensitivity.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is teaching a client how to take their own blood pressure at home. Place the steps in correct order.",
    o: ["Rest quietly for 5 minutes before taking the measurement", "Sit with feet flat on the floor, back supported, and arm at heart level", "Apply the cuff snugly on the bare upper arm, 2-3 cm above the elbow crease", "Press start on the automated monitor and remain still without talking", "Record the reading along with the date and time", "Take a second reading after 1-2 minutes and record the average"],
    a: -1,
    co: [0, 1, 2, 3, 4, 5],
    t: "ordered",
    r: "Proper home BP monitoring: rest first (prevents falsely elevated readings), correct positioning, proper cuff placement, quiet measurement, recording, and repeating for accuracy. This technique ensures reliable readings for hypertension management.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is preparing a client for a transesophageal echocardiogram (TEE). Place the preparation steps in correct order.",
    o: ["Verify the client has been NPO for at least 4-6 hours", "Obtain informed consent", "Remove dentures and assess for loose teeth", "Establish IV access for procedural sedation", "Administer topical anesthetic spray to the throat as ordered", "Position the client on the left side for the procedure"],
    a: -1,
    co: [0, 1, 2, 3, 4, 5],
    t: "ordered",
    r: "Verify NPO status first (aspiration prevention), obtain consent, remove dentures (safety), establish IV access, apply throat anesthetic, and position the client. This systematic preparation ensures safe TEE performance.",
    s: "Cardiovascular"
  },
  {
    q: "A client has a new diagnosis of heart failure. Place the self-management education topics in the correct teaching sequence.",
    o: ["Explain what heart failure is and how it affects the body", "Teach daily weight monitoring and when to report changes", "Review prescribed medications, their purposes, and side effects", "Discuss dietary modifications including sodium and fluid restrictions", "Explain the importance of regular physical activity within prescribed limits", "Schedule follow-up appointments and provide contact information for questions"],
    a: -1,
    co: [0, 1, 2, 3, 4, 5],
    t: "ordered",
    r: "Understanding the disease first provides context for all other teaching. Daily weights detect early decompensation. Medication knowledge ensures adherence. Diet modifications reduce fluid overload. Activity guidelines prevent deconditioning. Follow-up ensures ongoing care. Building from foundational knowledge to self-management skills is most effective.",
    s: "Cardiovascular"
  },
  // === Fill-in-the-Blank Questions 276-290 ===
  {
    q: "A 68-year-old client with heart failure is prescribed furosemide 80 mg IV. The pharmacy supplies furosemide 10 mg/mL. How many mL should the nurse administer?",
    o: [],
    a: -1,
    cv: "8",
    t: "fill-in-blank",
    r: "Using the formula: Volume = Dose ordered / Concentration available. Volume = 80 mg / 10 mg/mL = 8 mL. The nurse should administer 8 mL of furosemide IV.",
    s: "Cardiovascular"
  },
  {
    q: "A client is prescribed heparin 18 units/kg/hour. The client weighs 80 kg. The heparin concentration is 25,000 units in 500 mL D5W. At how many mL/hour should the nurse set the infusion pump?",
    o: [],
    a: -1,
    cv: "29",
    t: "fill-in-blank",
    r: "Step 1: Calculate units/hour = 18 units/kg/hour x 80 kg = 1,440 units/hour. Step 2: Calculate concentration = 25,000 units / 500 mL = 50 units/mL. Step 3: Calculate mL/hour = 1,440 units/hour / 50 units/mL = 28.8 mL/hour, rounded to 29 mL/hour.",
    s: "Cardiovascular"
  },
  {
    q: "A client post-MI is prescribed a nitroglycerin infusion at 10 mcg/min. The pharmacy provides nitroglycerin 50 mg in 250 mL D5W. At how many mL/hour should the nurse set the infusion pump?",
    o: [],
    a: -1,
    cv: "3",
    t: "fill-in-blank",
    r: "Step 1: Concentration = 50 mg / 250 mL = 0.2 mg/mL = 200 mcg/mL. Step 2: mL/hour = (10 mcg/min x 60 min/hour) / 200 mcg/mL = 600 / 200 = 3 mL/hour.",
    s: "Cardiovascular"
  },
  {
    q: "A client is prescribed dopamine at 5 mcg/kg/min. The client weighs 70 kg. The dopamine concentration is 400 mg in 250 mL D5W. At how many mL/hour should the nurse set the infusion pump? (Round to the nearest whole number.)",
    o: [],
    a: -1,
    cv: "13",
    t: "fill-in-blank",
    r: "Step 1: mcg/min = 5 mcg/kg/min x 70 kg = 350 mcg/min. Step 2: Concentration = 400 mg / 250 mL = 1.6 mg/mL = 1,600 mcg/mL. Step 3: mL/hour = (350 mcg/min x 60 min/hour) / 1,600 mcg/mL = 21,000 / 1,600 = 13.125, rounded to 13 mL/hour.",
    s: "Cardiovascular"
  },
  {
    q: "A client is prescribed a heparin bolus of 80 units/kg IV. The client weighs 75 kg. The pharmacy supplies heparin 1,000 units/mL. How many mL should the nurse administer for the bolus?",
    o: [],
    a: -1,
    cv: "6",
    t: "fill-in-blank",
    r: "Step 1: Total units = 80 units/kg x 75 kg = 6,000 units. Step 2: Volume = 6,000 units / 1,000 units/mL = 6 mL. The nurse should administer 6 mL of heparin for the IV bolus.",
    s: "Cardiovascular"
  },
  {
    q: "A client is receiving an IV infusion of normal saline at 125 mL/hour. The tubing has a drop factor of 15 gtt/mL. At how many gtt/min should the nurse set the drip rate? (Round to the nearest whole number.)",
    o: [],
    a: -1,
    cv: "31",
    t: "fill-in-blank",
    r: "Using the formula: gtt/min = (Volume per hour x Drop factor) / 60 minutes. gtt/min = (125 mL/hour x 15 gtt/mL) / 60 = 1,875 / 60 = 31.25, rounded to 31 gtt/min.",
    s: "Cardiovascular"
  },
  {
    q: "A client is prescribed amiodarone 150 mg IV bolus over 10 minutes. The pharmacy provides amiodarone 50 mg/mL in a 3 mL vial. How many mL should the nurse draw up?",
    o: [],
    a: -1,
    cv: "3",
    t: "fill-in-blank",
    r: "Volume = Dose ordered / Concentration = 150 mg / 50 mg/mL = 3 mL. The nurse should draw up the entire 3 mL vial for the 150 mg bolus dose.",
    s: "Cardiovascular"
  },
  {
    q: "A client's IV dobutamine is running at 7.5 mcg/kg/min. The client weighs 90 kg. The dobutamine concentration is 250 mg in 250 mL D5W. At how many mL/hour is the infusion running? (Round to the nearest whole number.)",
    o: [],
    a: -1,
    cv: "41",
    t: "fill-in-blank",
    r: "Step 1: mcg/min = 7.5 mcg/kg/min x 90 kg = 675 mcg/min. Step 2: Concentration = 250 mg / 250 mL = 1 mg/mL = 1,000 mcg/mL. Step 3: mL/hour = (675 mcg/min x 60) / 1,000 mcg/mL = 40,500 / 1,000 = 40.5, rounded to 41 mL/hour.",
    s: "Cardiovascular"
  },
  {
    q: "A client is prescribed warfarin 7.5 mg orally. The pharmacy supplies warfarin 5 mg tablets. How many tablets should the nurse administer?",
    o: [],
    a: -1,
    cv: "1.5",
    t: "fill-in-blank",
    r: "Tablets = Dose ordered / Dose per tablet = 7.5 mg / 5 mg per tablet = 1.5 tablets. The nurse should administer 1.5 tablets (one whole tablet and one half tablet).",
    s: "Cardiovascular"
  },
  {
    q: "A client is prescribed enoxaparin 1 mg/kg subcutaneously every 12 hours. The client weighs 68 kg. The pharmacy supplies enoxaparin 100 mg/mL in prefilled syringes. How many mL should the nurse administer per dose? (Round to the nearest tenth.)",
    o: [],
    a: -1,
    cv: "0.7",
    t: "fill-in-blank",
    r: "Step 1: Dose = 1 mg/kg x 68 kg = 68 mg. Step 2: Volume = 68 mg / 100 mg/mL = 0.68 mL, rounded to 0.7 mL. The nurse should administer 0.7 mL of enoxaparin subcutaneously.",
    s: "Cardiovascular"
  },
  {
    q: "A client is prescribed metoprolol 50 mg orally twice daily. The pharmacy supplies metoprolol 25 mg tablets. How many tablets should the nurse administer per dose?",
    o: [],
    a: -1,
    cv: "2",
    t: "fill-in-blank",
    r: "Tablets per dose = Dose ordered / Dose per tablet = 50 mg / 25 mg per tablet = 2 tablets per dose. The nurse should administer 2 tablets for each dose.",
    s: "Cardiovascular"
  },
  {
    q: "A client is prescribed a norepinephrine (Levophed) infusion at 0.1 mcg/kg/min. The client weighs 65 kg. The concentration is 4 mg in 250 mL D5W. At how many mL/hour should the nurse set the pump? (Round to the nearest tenth.)",
    o: [],
    a: -1,
    cv: "24.4",
    t: "fill-in-blank",
    r: "Step 1: mcg/min = 0.1 mcg/kg/min x 65 kg = 6.5 mcg/min. Step 2: Concentration = 4 mg / 250 mL = 0.016 mg/mL = 16 mcg/mL. Step 3: mL/hour = (6.5 mcg/min x 60 min/hour) / 16 mcg/mL = 390 / 16 = 24.375, rounded to 24.4 mL/hour.",
    s: "Cardiovascular"
  },
  {
    q: "A client is ordered to receive 1,000 mL of lactated Ringer's solution over 8 hours. The drop factor is 20 gtt/mL. At how many gtt/min should the nurse set the drip rate? (Round to the nearest whole number.)",
    o: [],
    a: -1,
    cv: "42",
    t: "fill-in-blank",
    r: "Step 1: mL/hour = 1,000 mL / 8 hours = 125 mL/hour. Step 2: gtt/min = (125 mL/hour x 20 gtt/mL) / 60 min/hour = 2,500 / 60 = 41.67, rounded to 42 gtt/min.",
    s: "Cardiovascular"
  },
  {
    q: "A client with heart failure is prescribed digoxin 0.125 mg IV. The pharmacy supplies digoxin 0.25 mg/mL. How many mL should the nurse administer?",
    o: [],
    a: -1,
    cv: "0.5",
    t: "fill-in-blank",
    r: "Volume = Dose ordered / Concentration = 0.125 mg / 0.25 mg/mL = 0.5 mL. The nurse should administer 0.5 mL of digoxin IV.",
    s: "Cardiovascular"
  },
  {
    q: "A client is prescribed a milrinone infusion at 0.375 mcg/kg/min. The client weighs 80 kg. The milrinone concentration is 20 mg in 100 mL D5W. At how many mL/hour should the nurse set the pump?",
    o: [],
    a: -1,
    cv: "9",
    t: "fill-in-blank",
    r: "Step 1: mcg/min = 0.375 mcg/kg/min x 80 kg = 30 mcg/min. Step 2: Concentration = 20 mg / 100 mL = 0.2 mg/mL = 200 mcg/mL. Step 3: mL/hour = (30 mcg/min x 60 min/hour) / 200 mcg/mL = 1,800 / 200 = 9 mL/hour.",
    s: "Cardiovascular"
  },
  // === Hot Spot Questions 291-300 ===
  {
    q: "A nurse is performing a cardiac assessment on a 70-year-old client with suspected aortic stenosis. On the diagram of the chest wall showing the four primary cardiac auscultation areas, identify where the nurse should place the stethoscope to best hear an aortic stenosis murmur.",
    o: ["Aortic area: right second intercostal space at the sternal border", "Pulmonic area: left second intercostal space at the sternal border", "Tricuspid area: left fourth intercostal space at the sternal border", "Mitral area: left fifth intercostal space at the midclavicular line"],
    a: 0,
    hc: "Diagram of the anterior chest wall showing four labeled cardiac auscultation sites: aortic (right 2nd ICS), pulmonic (left 2nd ICS), tricuspid (left 4th ICS), and mitral (left 5th ICS at MCL).",
    ht: "Aortic area at the right second intercostal space, sternal border. Aortic stenosis murmur is a harsh crescendo-decrescendo systolic murmur best heard at this location, often radiating to the carotid arteries.",
    t: "hot-spot",
    r: "The aortic area (right second intercostal space at the sternal border) is where aortic stenosis murmurs are best auscultated because it is directly over the aortic valve outflow tract. The murmur is a harsh systolic crescendo-decrescendo sound that may radiate to the carotids.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is reviewing a 12-lead ECG of a client with suspected inferior wall MI. On the diagram of standard 12-lead ECG placement, identify the leads that would show ST elevation in an inferior wall MI.",
    o: ["Leads II, III, and aVF (inferior leads)", "Leads V1 through V4 (anterior leads)", "Leads I and aVL (lateral leads)", "Leads V5 and V6 (low lateral leads)"],
    a: 0,
    hc: "Diagram of a standard 12-lead ECG layout showing all 12 leads arranged in their standard display format. The inferior leads (II, III, aVF) are highlighted in the bottom row of the limb leads section.",
    ht: "Leads II, III, and aVF in the inferior lead group. These leads view the inferior wall of the heart, which is supplied by the right coronary artery. ST elevation in these leads indicates an acute inferior STEMI.",
    t: "hot-spot",
    r: "Leads II, III, and aVF are the inferior leads that view the diaphragmatic surface of the heart. ST elevation in these leads indicates acute inferior wall MI, typically from right coronary artery occlusion. The anterior leads (V1-V4) view the anterior wall, and lateral leads (I, aVL, V5, V6) view the lateral wall.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is assessing a client for jugular vein distension. On the diagram showing the client positioned at 45 degrees, identify the correct anatomical landmark where JVD is assessed.",
    o: ["The internal jugular vein, visible between the sternal and clavicular heads of the sternocleidomastoid muscle", "The external jugular vein on the lateral surface of the neck", "The carotid artery at the anterior neck", "The subclavian vein below the clavicle"],
    a: 0,
    hc: "Diagram showing a client positioned at 45 degrees (semi-Fowler's) with the head turned slightly to the side. The neck anatomy is visible, showing the sternocleidomastoid muscle, internal jugular vein, external jugular vein, and carotid artery.",
    ht: "The internal jugular vein, located between the two heads of the sternocleidomastoid muscle. JVD is measured as the vertical height of venous pulsation above the sternal angle (angle of Louis). Distension greater than 3 cm above the sternal angle at 45 degrees is considered elevated.",
    t: "hot-spot",
    r: "JVD is assessed at the internal jugular vein, which lies between the sternal and clavicular heads of the sternocleidomastoid muscle. The height of pulsation above the sternal angle estimates central venous pressure. Elevated JVD indicates right-sided heart failure, fluid overload, or cardiac tamponade.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is performing a 12-lead ECG on a client. On the diagram of the chest, identify the correct placement of lead V4.",
    o: ["Left fifth intercostal space at the midclavicular line", "Right fourth intercostal space at the sternal border", "Left second intercostal space at the sternal border", "Left fourth intercostal space at the anterior axillary line"],
    a: 0,
    hc: "Diagram of the anterior chest wall showing the rib cage, sternum, and six marked positions for precordial lead placement (V1 through V6). The midclavicular line and intercostal spaces are labeled.",
    ht: "V4 placement at the left fifth intercostal space at the midclavicular line. This is the anchor lead for proper precordial placement. V4 must be placed before V5 and V6, as their positions depend on V4 placement.",
    t: "hot-spot",
    r: "V4 is placed at the left fifth intercostal space at the midclavicular line. It is the anchor lead for precordial placement. V5 and V6 are placed at the same horizontal level as V4 (at the anterior axillary line and midaxillary line respectively). Incorrect V4 placement affects the entire precordial lead configuration.",
    s: "Cardiovascular"
  },
  {
    q: "A client returns from cardiac catheterization via the right femoral artery. On the diagram of the lower extremity vascular anatomy, identify where the nurse should palpate to assess distal perfusion.",
    o: ["The dorsalis pedis artery on the dorsum of the right foot", "The popliteal artery behind the right knee", "The femoral artery at the groin insertion site", "The radial artery at the right wrist"],
    a: 0,
    hc: "Diagram of the right lower extremity showing the arterial anatomy from the femoral artery through the popliteal, posterior tibial, and dorsalis pedis arteries. The catheterization insertion site at the groin is marked with an 'X'.",
    ht: "The dorsalis pedis artery, located on the dorsal surface of the foot between the first and second metatarsal bones. This is the primary pulse point for assessing distal perfusion after femoral artery catheterization. The posterior tibial artery (behind the medial malleolus) is also assessed.",
    t: "hot-spot",
    r: "After femoral artery catheterization, the dorsalis pedis pulse (and posterior tibial pulse) must be assessed to confirm adequate distal arterial perfusion. These are distal to the catheterization site and would be affected if arterial occlusion or thrombosis occurs at the insertion site.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is auscultating heart sounds on a client with suspected mitral regurgitation. On the diagram of the chest showing cardiac landmarks, identify the best location to hear a mitral regurgitation murmur.",
    o: ["Mitral area: left fifth intercostal space at the midclavicular line (apex)", "Aortic area: right second intercostal space at the sternal border", "Erb's point: left third intercostal space at the sternal border", "Tricuspid area: left lower sternal border at the fourth intercostal space"],
    a: 0,
    hc: "Diagram of the anterior chest wall showing the cardiac auscultation landmarks: aortic area (right 2nd ICS), pulmonic area (left 2nd ICS), Erb's point (left 3rd ICS), tricuspid area (left 4th ICS), and mitral/apical area (left 5th ICS at MCL).",
    ht: "The mitral area (apex) at the left fifth intercostal space, midclavicular line. Mitral regurgitation produces a high-pitched, blowing, holosystolic (pansystolic) murmur best heard at the apex, often radiating to the left axilla.",
    t: "hot-spot",
    r: "Mitral regurgitation murmur is best heard at the cardiac apex (mitral area), which is the left fifth intercostal space at the midclavicular line. The murmur is a holosystolic blowing sound that radiates to the left axilla. The client should be positioned in the left lateral decubitus position for optimal auscultation.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is assessing peripheral arterial disease in a client. On the diagram of the lower extremity, identify the location where the posterior tibial pulse is palpated.",
    o: ["Behind and slightly below the medial malleolus of the ankle", "On the dorsum of the foot between the first and second metatarsals", "Behind the knee in the popliteal fossa", "At the midpoint of the inguinal ligament"],
    a: 0,
    hc: "Diagram of the medial view of the ankle and foot showing bony landmarks (medial malleolus, calcaneus) and the course of the posterior tibial artery as it passes behind the medial malleolus.",
    ht: "The posterior tibial artery, palpated in the groove behind and slightly inferior to the medial malleolus. This pulse point is essential for assessing lower extremity arterial perfusion in PAD. Absence of this pulse may indicate arterial occlusion.",
    t: "hot-spot",
    r: "The posterior tibial pulse is palpated in the groove behind and below the medial malleolus. Along with the dorsalis pedis pulse, it is a key assessment point for lower extremity arterial perfusion. In PAD, these pulses may be diminished or absent, indicating significant arterial obstruction.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is placing a client on continuous telemetry monitoring. On the diagram of the chest, identify the correct placement of the V1 monitoring electrode.",
    o: ["Right fourth intercostal space at the sternal border", "Left fifth intercostal space at the midclavicular line", "Right second intercostal space at the sternal border", "Left fourth intercostal space at the midclavicular line"],
    a: 0,
    hc: "Diagram of the anterior chest wall showing the ribcage, sternum, and intercostal spaces. Electrode placement positions are marked for standard telemetry monitoring including the V1 position.",
    ht: "V1 electrode placement at the right fourth intercostal space, immediately adjacent to the sternal border. This lead is important for differentiating between ventricular and supraventricular rhythms and for detecting right bundle branch block.",
    t: "hot-spot",
    r: "The V1 electrode is placed at the right fourth intercostal space at the sternal border. This position is directly over the interventricular septum and is essential for monitoring rhythm, distinguishing SVT from VT, and detecting right bundle branch block patterns.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is assessing a client's point of maximal impulse (PMI). On the diagram of the chest, identify the normal location of the PMI.",
    o: ["Left fifth intercostal space at the midclavicular line (cardiac apex)", "Right second intercostal space at the sternal border", "Epigastric area just below the xiphoid process", "Left second intercostal space at the sternal border"],
    a: 0,
    hc: "Diagram of the anterior chest wall showing the ribs, sternum, and intercostal spaces with the midclavicular line marked. The heart silhouette is visible beneath the chest wall.",
    ht: "The PMI is normally located at the left fifth intercostal space at the midclavicular line, which corresponds to the cardiac apex. A displaced PMI (laterally or inferiorly) may indicate left ventricular enlargement from conditions such as heart failure or cardiomyopathy.",
    t: "hot-spot",
    r: "The point of maximal impulse (PMI) is normally palpated at the left fifth intercostal space at the midclavicular line (the cardiac apex). Displacement of the PMI laterally or inferiorly suggests left ventricular hypertrophy or dilation. A bounding PMI may indicate volume overload.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is assessing a client with a central venous catheter. On the diagram of the upper body vasculature, identify the location of the internal jugular vein where central lines are commonly inserted.",
    o: ["The internal jugular vein, running deep to the sternocleidomastoid muscle in the neck, entering the subclavian vein near the clavicle", "The external jugular vein on the surface of the neck", "The cephalic vein in the upper arm", "The basilic vein in the antecubital fossa"],
    a: 0,
    hc: "Diagram of the upper body anterior view showing major veins including the internal jugular, external jugular, subclavian, and brachiocephalic veins. The sternocleidomastoid muscle is shown for anatomical reference. Common central line insertion sites are indicated.",
    ht: "The internal jugular vein, located deep to the sternocleidomastoid muscle. It is a preferred site for central venous catheter insertion because of its large diameter, direct path to the superior vena cava, and relatively predictable anatomy. The right internal jugular is preferred due to its straighter path to the SVC.",
    t: "hot-spot",
    r: "The internal jugular vein is a common site for central venous catheter insertion. Located deep to the sternocleidomastoid muscle, it provides reliable large-vessel access with a direct path to the superior vena cava and right atrium. The right IJ is preferred due to the straighter anatomical course. Post-insertion chest X-ray confirms catheter tip position.",
    s: "Cardiovascular"
  },
  // Additional MCQ questions 301-349 to reach 300 total
  {
    q: "A 74-year-old client with chronic heart failure and atrial fibrillation is taking digoxin and amiodarone. The digoxin level is 2.4 ng/mL (therapeutic 0.5-2.0 ng/mL). The nurse suspects the elevated level is caused by:",
    o: ["Amiodarone inhibiting digoxin clearance, leading to increased serum levels", "The client taking too many digoxin tablets", "Dehydration causing a falsely elevated lab value", "Normal variation in digoxin levels when combined with amiodarone"],
    a: 0,
    r: "Amiodarone is a well-known inhibitor of digoxin metabolism and renal clearance, often increasing digoxin levels by 50-100%. When amiodarone is added, digoxin doses typically need to be reduced. This is a drug interaction, not necessarily adherence issue. Dehydration can affect levels but the amiodarone interaction is the most likely cause. Elevated levels are not normal variation.",
    s: "Cardiovascular"
  },
  {
    q: "A 58-year-old client presents with pulseless ventricular tachycardia. The nurse has applied the AED. What energy level does the nurse anticipate for the first defibrillation attempt with a biphasic defibrillator?",
    o: ["120 to 200 joules, as recommended by the manufacturer for biphasic defibrillators", "50 joules to avoid myocardial damage", "360 joules, which is the standard for all defibrillators", "10 joules, starting with the lowest possible energy"],
    a: 0,
    r: "Biphasic defibrillators typically use 120-200 joules for the first shock (device-specific). Monophasic defibrillators use 360 joules. Starting at 50 or 10 joules is insufficient for defibrillation. The nurse should follow manufacturer recommendations and ACLS guidelines for the specific device being used.",
    s: "Cardiovascular"
  },
  {
    q: "A 66-year-old client with a history of coronary artery disease reports epigastric discomfort and mild nausea after eating. Vital signs: BP 146/88, HR 92, RR 20, SpO2 96%. The nurse should:",
    o: ["Obtain a 12-lead ECG to rule out acute coronary syndrome, as MI can present with epigastric symptoms", "Administer an antacid and reassess in 30 minutes", "Encourage the client to rest and skip the next meal", "Assume the symptoms are gastrointestinal and document findings only"],
    a: 0,
    r: "In clients with CAD history, epigastric discomfort and nausea can be atypical presentations of acute coronary syndrome, particularly inferior wall MI. A 12-lead ECG is a quick, noninvasive way to rule out cardiac causes. Assuming GI origin without cardiac workup could delay life-saving treatment. Antacids may provide temporary relief but do not rule out MI.",
    s: "Cardiovascular"
  },
  {
    q: "A 70-year-old client is admitted with heart failure exacerbation. The nurse notes an S3 heart sound during auscultation. This finding indicates:",
    o: ["Ventricular volume overload and decreased ventricular compliance, consistent with heart failure", "Normal heart sounds in an older adult client", "Aortic valve stenosis requiring surgical intervention", "Pericardial friction rub from pericarditis"],
    a: 0,
    r: "An S3 (ventricular gallop) is heard in early diastole and indicates rapid ventricular filling against a volume-overloaded ventricle. It is a hallmark finding of heart failure. S3 is not a normal finding in adults over 30. It is different from the murmur of aortic stenosis and from a friction rub, which has a scratchy quality.",
    s: "Cardiovascular"
  },
  {
    q: "A 64-year-old client with a mechanical mitral valve is scheduled for a dental extraction. The client's INR is 2.8 (target 2.5-3.5 for mechanical valves). What should the nurse anticipate?",
    o: ["The procedure may proceed with the current INR, as it is within the therapeutic range for mechanical valves", "The warfarin should be held for 2 weeks before the procedure", "The INR is dangerously high and requires immediate vitamin K administration", "The mechanical valve should be removed before the dental procedure"],
    a: 0,
    r: "For mechanical mitral valve replacement, the target INR is 2.5-3.5. An INR of 2.8 is therapeutic. Minor dental procedures can often proceed at therapeutic INR with local hemostatic measures. Holding warfarin for 2 weeks risks valve thrombosis. The INR is not dangerously high. Valve removal for dental work is inappropriate.",
    s: "Cardiovascular"
  },
  {
    q: "A 52-year-old client with no cardiac history develops chest pain while shovelling snow. BP is 164/98, HR 108, and the client is diaphoretic. Which action by a bystander nurse is most appropriate?",
    o: ["Call emergency services, have the client stop activity and rest, and administer aspirin if available and not allergic", "Drive the client to the nearest hospital for faster care", "Encourage the client to continue shovelling slowly to avoid deconditioning", "Apply ice to the chest and wait for symptoms to resolve"],
    a: 0,
    r: "Chest pain with exertion, hypertension, tachycardia, and diaphoresis suggest possible ACS. Calling emergency services ensures timely advanced care. Stopping activity reduces myocardial oxygen demand. Aspirin inhibits platelet aggregation. Driving delays appropriate care. Continuing activity worsens ischemia. Ice has no role in cardiac chest pain.",
    s: "Cardiovascular"
  },
  {
    q: "A 77-year-old client with heart failure has a cardiac resynchronization therapy (CRT) device implanted. The nurse understands CRT works by:",
    o: ["Coordinating the contraction of both ventricles to improve cardiac output in clients with ventricular dyssynchrony", "Delivering shocks to terminate ventricular tachycardia", "Replacing the function of the sinoatrial node completely", "Monitoring blood pressure and automatically adjusting medications"],
    a: 0,
    r: "CRT (biventricular pacing) synchronizes left and right ventricular contraction in clients with bundle branch block and heart failure, improving ejection fraction and cardiac output. While some CRT devices include defibrillator function (CRT-D), the primary purpose is resynchronization. It does not replace the SA node or adjust medications.",
    s: "Cardiovascular"
  },
  {
    q: "A 63-year-old client is receiving alteplase (tPA) for acute STEMI. Which assessment finding would cause the nurse to immediately stop the infusion?",
    o: ["Sudden severe headache with new neurological deficits suggesting intracranial hemorrhage", "Blood pressure of 138/82 mmHg", "Slight oozing from a peripheral IV site", "Chest pain decreasing from 8/10 to 3/10"],
    a: 0,
    r: "Sudden severe headache with neurological changes during thrombolytic therapy strongly suggests intracranial hemorrhage, the most dangerous complication. The infusion must be stopped immediately. BP 138/82 is acceptable. Minor IV site oozing is expected. Decreasing chest pain indicates successful reperfusion.",
    s: "Cardiovascular"
  },
  {
    q: "A 69-year-old client with PAD has undergone a femoral-popliteal bypass graft. Six hours postoperatively, the nurse notes the left foot is cool and pale with an absent dorsalis pedis pulse. What is the priority action?",
    o: ["Notify the surgeon immediately, as this may indicate graft occlusion requiring emergent re-exploration", "Apply warm blankets to the foot and recheck in 2 hours", "Elevate the left leg above heart level to improve perfusion", "Administer aspirin orally and continue routine monitoring"],
    a: 0,
    r: "Loss of previously palpable distal pulse with cool, pale extremity after bypass surgery is a vascular emergency suggesting graft occlusion or thrombosis. Immediate surgical notification is critical, as the graft may need emergent thrombectomy or revision. Warm blankets do not address occlusion. Elevation reduces arterial flow. Aspirin alone is insufficient.",
    s: "Cardiovascular"
  },
  {
    q: "A 55-year-old client is prescribed ticagrelor (Brilinta) after ACS with PCI. The nurse should educate the client that this medication differs from clopidogrel because:",
    o: ["Ticagrelor is reversible and has a faster onset, but must be taken twice daily and low-dose aspirin must not exceed 100 mg", "Ticagrelor only needs to be taken once weekly", "Ticagrelor does not require aspirin to be taken concurrently", "Ticagrelor has no bleeding risk and is safer than clopidogrel"],
    a: 0,
    r: "Ticagrelor is a reversible P2Y12 inhibitor with faster onset than clopidogrel. It requires twice-daily dosing. Importantly, aspirin dose must be limited to 100 mg or less daily (higher doses reduce ticagrelor effectiveness). It is not weekly dosing. Aspirin is still required. All antiplatelet agents carry bleeding risk.",
    s: "Cardiovascular"
  },
  {
    q: "A 81-year-old client with heart failure reports feeling confused and weak. Serum sodium is 118 mEq/L (normal 135-145 mEq/L). The nurse recognizes this as:",
    o: ["Severe hyponatremia likely from dilutional causes in heart failure, requiring careful correction to avoid osmotic demyelination", "A normal lab value for an elderly client with heart failure", "Hypernatremia requiring IV fluid administration", "Hypokalemia requiring potassium replacement"],
    a: 0,
    r: "Sodium 118 mEq/L is severe hyponatremia, which in HF is typically dilutional from excess water retention. Symptoms include confusion and weakness. Rapid correction risks osmotic demyelination syndrome (central pontine myelinolysis), so correction must be gradual. This is not a normal value. Sodium 118 is hypo, not hypernatremia. Sodium and potassium are different electrolytes.",
    s: "Cardiovascular"
  },
  {
    q: "A 60-year-old client with atrial fibrillation is being rate-controlled with diltiazem. The resting heart rate is 62 bpm and BP is 108/68. The client reports dizziness when walking to the bathroom. What should the nurse do?",
    o: ["Hold the diltiazem dose, assist the client with ambulation, and notify the healthcare provider about symptomatic bradycardia and hypotension", "Increase the diltiazem dose to better control the atrial fibrillation", "Administer a fluid bolus of 500 mL normal saline", "Tell the client to move more slowly and the dizziness will resolve"],
    a: 0,
    r: "Heart rate 62 with BP 108/68 and dizziness during activity suggests the diltiazem dose may be causing excessive rate and blood pressure reduction. The nurse should hold the dose, ensure safety during ambulation, and notify the provider for dose adjustment. Increasing the dose would worsen symptoms. A fluid bolus may temporarily help but does not address the cause. Simply telling the client to move slowly does not address the medication issue.",
    s: "Cardiovascular"
  },
  {
    q: "A 73-year-old client post-MI develops a new holosystolic murmur at the apex and acute pulmonary edema. The nurse suspects:",
    o: ["Acute mitral regurgitation from papillary muscle rupture, a mechanical complication of MI", "Expected post-MI heart sounds that require no intervention", "Aortic stenosis developing after the heart attack", "Pericardial effusion causing muffled heart sounds"],
    a: 0,
    r: "A new holosystolic murmur at the apex after MI with acute pulmonary edema suggests papillary muscle rupture causing acute mitral regurgitation, a life-threatening mechanical complication. This is a surgical emergency. New murmurs post-MI are never expected. Aortic stenosis is systolic but at the base, not apex. Pericardial effusion causes muffled sounds, not new murmurs.",
    s: "Cardiovascular"
  },
  {
    q: "A 46-year-old client presents with a blood pressure of 148/96 mmHg. The client has no other risk factors or end-organ damage. According to current guidelines, what is the initial recommended treatment?",
    o: ["Lifestyle modifications including dietary changes, exercise, weight management, and sodium reduction with follow-up in 3-6 months", "Immediate initiation of two antihypertensive medications", "Referral for renal artery angioplasty", "No treatment needed until blood pressure exceeds 180/120 mmHg"],
    a: 0,
    r: "Stage 1 hypertension (130-139/80-89 or 140-159/90-99 depending on guideline) without additional risk factors or end-organ damage may initially be managed with lifestyle modifications. These include DASH diet, exercise (150 min/week), weight loss, and sodium restriction. Starting two medications immediately is excessive. Renal angioplasty is for renovascular hypertension. Waiting until crisis levels is dangerous.",
    s: "Cardiovascular"
  },
  {
    q: "A 67-year-old client with a dual-chamber pacemaker set at 70 bpm has a heart rate of 56 bpm on the monitor. The nurse should:",
    o: ["Notify the healthcare provider immediately, as the heart rate below the set pacing rate suggests pacemaker malfunction (failure to pace or capture)", "Assume the pacemaker is working in a demand mode and the rate will increase with activity", "Administer atropine to increase the heart rate", "Encourage the client to exercise to trigger the pacemaker"],
    a: 0,
    r: "A heart rate of 56 bpm when the pacemaker is set at 70 bpm indicates the pacemaker is not pacing or capturing appropriately. This is a malfunction requiring immediate evaluation. Demand mode would still pace when the intrinsic rate falls below the set rate. Atropine may help temporarily but does not address device malfunction. Exercise is not a diagnostic approach for pacemaker failure.",
    s: "Cardiovascular"
  },
  {
    q: "A 71-year-old client with COPD and new-onset atrial fibrillation needs rate control. Which medication should the nurse anticipate being avoided?",
    o: ["Non-selective beta-blockers such as propranolol, as they can cause bronchospasm in COPD clients", "Diltiazem, as it is contraindicated in all pulmonary conditions", "Digoxin, as it has no effect on heart rate in atrial fibrillation", "Amiodarone, as it cannot be used in clients over 70 years of age"],
    a: 0,
    r: "Non-selective beta-blockers (propranolol) block beta-2 receptors in the lungs, potentially causing bronchospasm in COPD clients. Cardioselective beta-blockers (metoprolol) are preferred if beta-blockade is needed. Diltiazem is often used for rate control and is not contraindicated in COPD. Digoxin does slow ventricular rate. Amiodarone has no age contraindication.",
    s: "Cardiovascular"
  },
  {
    q: "A 59-year-old client with heart failure is on lisinopril and spironolactone. Lab results show potassium 5.8 mEq/L. Which food should the nurse advise the client to avoid?",
    o: ["Bananas and oranges, which are high in potassium and can worsen hyperkalemia", "White rice, which has no significant potassium content", "Chicken breast, which is a lean protein source", "Whole wheat bread, which is primarily a carbohydrate source"],
    a: 0,
    r: "With potassium 5.8 mEq/L (dangerously elevated), the client on ACE inhibitor and potassium-sparing diuretic should avoid high-potassium foods like bananas, oranges, potatoes, and tomatoes. White rice, chicken breast, and whole wheat bread have relatively low potassium content and do not significantly contribute to hyperkalemia.",
    s: "Cardiovascular"
  },
  {
    q: "A 62-year-old client with an abdominal aortic aneurysm measuring 4.2 cm is being managed conservatively. The client asks when surgery would be recommended. Which response is most accurate?",
    o: ["Surgery is typically recommended when the aneurysm reaches 5.5 cm or grows more than 0.5 cm in 6 months", "Surgery is only needed if the aneurysm ruptures", "All aneurysms require immediate surgical repair regardless of size", "Surgery is not available for abdominal aortic aneurysms"],
    a: 0,
    r: "Current guidelines generally recommend elective repair for AAAs at 5.5 cm or larger, or those growing rapidly (more than 0.5 cm in 6 months), as rupture risk increases significantly at these thresholds. Waiting for rupture has very high mortality. Not all aneurysms need immediate repair. Multiple surgical options exist including open repair and endovascular (EVAR).",
    s: "Cardiovascular"
  },
  {
    q: "A 75-year-old client presents with chest pain and ECG shows diffuse ST elevation in most leads with PR depression. Which condition does the nurse suspect?",
    o: ["Acute pericarditis, which causes diffuse ST elevation and PR depression unlike the regional pattern of MI", "Massive STEMI involving all coronary arteries simultaneously", "Artifact from improper lead placement", "Normal ECG variant in elderly clients"],
    a: 0,
    r: "Diffuse (widespread) ST elevation with PR depression is the hallmark ECG pattern of acute pericarditis. Unlike MI, which shows regional ST changes corresponding to a specific coronary artery territory, pericarditis affects the entire pericardium and produces diffuse changes. Massive STEMI in all territories simultaneously is extremely rare. This is not artifact or a normal variant.",
    s: "Cardiovascular"
  },
  {
    q: "A 68-year-old client with chronic stable angina takes nitroglycerin sublingual as needed. The client reports the tablets no longer produce a tingling sensation under the tongue. What should the nurse advise?",
    o: ["The tablets may have lost potency and should be replaced, as nitroglycerin degrades with heat, light, and age", "The lack of tingling means the angina is improving", "The client should take three tablets at once to compensate for reduced potency", "Tingling is not related to medication effectiveness"],
    a: 0,
    r: "Nitroglycerin tablets lose potency when exposed to heat, light, and moisture, or when expired. Loss of the characteristic tingling/burning sensation suggests degraded medication. The client should obtain a new supply. Lack of tingling does not indicate angina improvement. Taking multiple degraded tablets is ineffective and unsafe. Tingling is a known indicator of tablet potency.",
    s: "Cardiovascular"
  },
  {
    q: "A 54-year-old client with newly diagnosed DVT asks how long they will need anticoagulation therapy. Which response by the nurse is most appropriate?",
    o: ["The duration depends on the cause of the DVT; a first unprovoked DVT typically requires at least 3 months, and your provider will determine the best length of therapy for you", "You will only need anticoagulation for 2 weeks after the clot is found", "Anticoagulation is always lifelong for any DVT regardless of the cause", "You will not need anticoagulation because the clot will dissolve on its own"],
    a: 0,
    r: "Anticoagulation duration for DVT depends on whether it was provoked (surgery, immobility) or unprovoked, recurrence risk, and bleeding risk. First unprovoked DVTs typically require at least 3-6 months. Two weeks is insufficient. Lifelong therapy is not universal. DVTs do not reliably resolve without treatment and carry PE risk.",
    s: "Cardiovascular"
  },
  {
    q: "A 72-year-old client with chronic heart failure has a serum BNP of 45 pg/mL (normal less than 100 pg/mL) during a routine visit. The client reports mild fatigue but denies dyspnea or edema. What does this BNP level suggest?",
    o: ["The heart failure is well-compensated on current therapy, and the low BNP is reassuring", "The client is in acute decompensated heart failure requiring hospitalization", "The BNP test is invalid and needs to be repeated", "The client no longer has heart failure and can stop all medications"],
    a: 0,
    r: "A BNP less than 100 pg/mL in a heart failure client with minimal symptoms suggests the condition is well-compensated on current therapy. This is a positive finding. The value does not suggest decompensation. The test is valid. Heart failure is a chronic condition requiring ongoing management; a single normal BNP does not mean the disease is cured.",
    s: "Cardiovascular"
  },
  {
    q: "A 60-year-old client with hypertension and diabetes is being started on an ACE inhibitor. The nurse should educate the client to report which early sign of a rare but serious adverse effect?",
    o: ["Swelling of the face, lips, or tongue, which may indicate angioedema", "Mild dizziness upon standing for the first few days", "A dry cough that develops over several weeks", "Slightly elevated blood glucose levels"],
    a: 0,
    r: "Angioedema (swelling of face, lips, tongue, or throat) is a rare but potentially life-threatening adverse effect of ACE inhibitors that requires immediate medical attention. Mild dizziness is common initially. Dry cough is a common side effect but not dangerous. Blood glucose changes are not a typical ACE inhibitor concern.",
    s: "Cardiovascular"
  },
  {
    q: "A 65-year-old client with heart failure is prescribed eplerenone instead of spironolactone. The nurse understands eplerenone is preferred because:",
    o: ["Eplerenone is more selective and has fewer anti-androgenic side effects like gynecomastia compared to spironolactone", "Eplerenone is significantly cheaper than spironolactone", "Eplerenone does not require potassium monitoring", "Eplerenone can be taken with ACE inhibitors without any risk of hyperkalemia"],
    a: 0,
    r: "Eplerenone is a selective mineralocorticoid receptor antagonist with fewer anti-androgenic side effects (gynecomastia, breast tenderness) compared to spironolactone. It is generally more expensive. Potassium monitoring is still required. Hyperkalemia risk exists with any aldosterone antagonist combined with ACE inhibitors.",
    s: "Cardiovascular"
  },
  {
    q: "A 78-year-old client with a history of falls is prescribed anticoagulation for atrial fibrillation. The healthcare provider chooses apixaban. The nurse understands this choice is likely because:",
    o: ["Apixaban has a lower bleeding risk compared to warfarin and other DOACs, making it safer for fall-prone elderly clients", "Apixaban has no bleeding risk at all", "Apixaban is the only anticoagulant that works in atrial fibrillation", "Apixaban requires weekly INR monitoring like warfarin"],
    a: 0,
    r: "Among DOACs, apixaban has demonstrated the lowest rates of major bleeding, including intracranial hemorrhage, making it a preferred choice for elderly clients at higher fall risk. It still carries bleeding risk. Multiple anticoagulants are available for afib. Apixaban does not require INR monitoring.",
    s: "Cardiovascular"
  },
  {
    q: "A 56-year-old client is admitted with Takotsubo (stress) cardiomyopathy after the sudden death of a spouse. The nurse expects the echocardiogram to show:",
    o: ["Apical ballooning of the left ventricle with reduced ejection fraction, mimicking acute MI", "Normal cardiac structure and function", "Aortic valve stenosis with reduced valve area", "Right ventricular enlargement with tricuspid regurgitation"],
    a: 0,
    r: "Takotsubo (stress/broken heart) cardiomyopathy causes transient apical ballooning of the left ventricle with reduced EF, triggered by emotional or physical stress. It mimics STEMI but without coronary occlusion. Cardiac function is not normal during the acute phase. It does not cause valve stenosis or right ventricular pathology.",
    s: "Cardiovascular"
  },
  {
    q: "A 70-year-old client with PAD is started on cilostazol (Pletal). The nurse should verify which condition is absent before administering this medication?",
    o: ["Heart failure, as cilostazol is contraindicated in clients with heart failure of any severity", "Hypertension, as cilostazol raises blood pressure", "Diabetes mellitus, as cilostazol causes severe hypoglycemia", "Chronic kidney disease, as cilostazol is nephrotoxic"],
    a: 0,
    r: "Cilostazol is a phosphodiesterase III inhibitor that is absolutely contraindicated in heart failure due to increased mortality risk. This is a black box warning. It does not significantly raise blood pressure. It does not cause hypoglycemia. While dose adjustments may be needed, it is not considered nephrotoxic.",
    s: "Cardiovascular"
  },
  {
    q: "A 63-year-old client with a recent MI develops a loud friction rub and ST elevation 2 days after the event. The nurse suspects:",
    o: ["Early post-MI pericarditis from inflammation of the pericardium adjacent to the infarcted myocardium", "Extension of the original myocardial infarction", "Cardiac tamponade requiring emergent pericardiocentesis", "Rupture of the interventricular septum"],
    a: 0,
    r: "Early post-MI pericarditis (within days of MI) results from inflammation of the pericardium overlying the necrotic myocardium. It presents with friction rub and ST changes. This differs from Dressler syndrome (weeks later). MI extension would show new troponin elevation and ECG changes without friction rub. Tamponade presents with Beck's triad. Septal rupture causes a new murmur.",
    s: "Cardiovascular"
  },
  {
    q: "A 48-year-old client is diagnosed with hypertrophic cardiomyopathy (HCM). Which activity restriction should the nurse emphasize?",
    o: ["Avoid competitive sports and strenuous exercise, as HCM increases the risk of sudden cardiac death during intense activity", "Avoid all walking and remain on bed rest permanently", "Only avoid swimming but all other exercise is safe", "No activity restrictions are necessary with HCM"],
    a: 0,
    r: "HCM is a leading cause of sudden cardiac death in young athletes. Competitive sports and vigorous exercise increase the risk of fatal dysrhythmias. Moderate, supervised exercise may be permitted. Permanent bed rest is excessive. Swimming restriction alone is insufficient. Activity modifications are an important safety measure in HCM.",
    s: "Cardiovascular"
  },
  {
    q: "A 76-year-old client with heart failure has a central venous pressure (CVP) of 14 mmHg (normal 2-6 mmHg). The nurse interprets this as:",
    o: ["Elevated right-sided preload indicating fluid volume overload or right ventricular failure", "Normal CVP for a client with heart failure", "Dehydration requiring aggressive fluid replacement", "Left ventricular failure without right-sided involvement"],
    a: 0,
    r: "CVP of 14 mmHg is elevated (normal 2-6 mmHg), indicating increased right atrial pressure from either fluid overload or right ventricular failure. This is not a normal finding. Dehydration would show a low CVP. While left HF can cause secondary right HF, the CVP specifically reflects right-sided pressures.",
    s: "Cardiovascular"
  },
  {
    q: "A 57-year-old client with a recent DVT is prescribed compression stockings. The nurse should educate the client to:",
    o: ["Apply the stockings in the morning before getting out of bed when leg swelling is minimal", "Apply the stockings only at bedtime for overnight use", "Remove the stockings only once per week for bathing", "Apply the stockings loosely so they do not restrict circulation"],
    a: 0,
    r: "Compression stockings are most effective when applied in the morning before dependent edema develops. Legs are least swollen after sleeping in a recumbent position. Wearing them at bedtime only defeats the purpose. They should be removed daily for hygiene and skin assessment. They must fit snugly (not loosely) to provide therapeutic compression.",
    s: "Cardiovascular"
  },
  {
    q: "A 69-year-old client with heart failure is admitted with respiratory distress. ABG results show pH 7.28, PaCO2 32 mmHg, HCO3 16 mEq/L, PaO2 62 mmHg. The nurse interprets these results as:",
    o: ["Metabolic acidosis with hypoxemia, likely from poor cardiac output and tissue hypoperfusion", "Respiratory alkalosis from hyperventilation", "Normal ABG values for a client with heart failure", "Respiratory acidosis from hypoventilation"],
    a: 0,
    r: "pH 7.28 (acidotic), low PaCO2 32 (respiratory compensation through tachypnea), low HCO3 16 (metabolic component), and low PaO2 62 (hypoxemia) indicate metabolic acidosis with hypoxemia. In heart failure, poor cardiac output causes tissue hypoperfusion and lactic acidosis. The low PaCO2 shows respiratory compensation, not primary respiratory alkalosis. These values are not normal.",
    s: "Cardiovascular"
  },
  {
    q: "A 85-year-old client with severe aortic stenosis develops syncope. The nurse understands the syncope is caused by:",
    o: ["Fixed cardiac output unable to increase during periods of increased demand, causing transient cerebral hypoperfusion", "Dehydration from inadequate oral intake", "Side effects of calcium channel blocker therapy", "Orthostatic hypotension from prolonged bed rest"],
    a: 0,
    r: "In severe aortic stenosis, the narrowed valve limits cardiac output augmentation during activity or position changes. The fixed cardiac output cannot meet increased cerebral perfusion demands, causing syncope. While dehydration, medications, and orthostatic hypotension can cause syncope, in the context of severe aortic stenosis, the valvular pathology is the primary cause.",
    s: "Cardiovascular"
  },
  {
    q: "A 64-year-old client is receiving a continuous IV infusion of nitroprusside for hypertensive emergency. The nurse notes the client has been on the infusion for 72 hours. Which toxicity should the nurse monitor for?",
    o: ["Cyanide toxicity, which can occur with prolonged nitroprusside use, manifesting as metabolic acidosis, confusion, and seizures", "Serotonin syndrome from excessive serotonin release", "Malignant hyperthermia from altered calcium metabolism", "Lithium toxicity from electrolyte imbalance"],
    a: 0,
    r: "Nitroprusside contains cyanide molecules that are released during metabolism. Prolonged use (especially over 48-72 hours) or high doses can lead to cyanide accumulation, causing metabolic acidosis, altered mental status, and seizures. Thiosulfate is the treatment. Serotonin syndrome, malignant hyperthermia, and lithium toxicity are unrelated to nitroprusside.",
    s: "Cardiovascular"
  },
  {
    q: "A 58-year-old client undergoes cardioversion for atrial flutter. Post-procedure, the monitor shows normal sinus rhythm at 78 bpm. Which assessment is most important in the first hour?",
    o: ["Continuous cardiac rhythm monitoring for return of atrial flutter or new dysrhythmias", "Assessment of lower extremity pulses for DVT", "Evaluation of bowel sounds for paralytic ileus", "Checking blood glucose levels for hypoglycemia"],
    a: 0,
    r: "After cardioversion, the most important assessment is continuous cardiac monitoring because atrial flutter can recur, or new dysrhythmias may develop. Monitoring ensures early detection and intervention. DVT assessment, bowel sounds, and blood glucose are not primary post-cardioversion concerns.",
    s: "Cardiovascular"
  },
  {
    q: "A 66-year-old client with systolic heart failure has an ejection fraction of 28%. Which activity of daily living should the nurse help the client modify to conserve energy?",
    o: ["Space activities throughout the day with rest periods and use a shower chair to reduce cardiac workload during bathing", "Encourage the client to complete all activities in the morning to have the afternoon free", "Advise the client to avoid all self-care activities and rely entirely on nursing staff", "Tell the client to exercise vigorously in short bursts to build stamina"],
    a: 0,
    r: "Energy conservation in severe heart failure (EF 28%) involves spacing activities with rest periods and using assistive devices like shower chairs to reduce oxygen demand. Clustering all activities increases cardiac workload. Complete dependence promotes deconditioning. Vigorous exercise bursts can precipitate decompensation.",
    s: "Cardiovascular"
  },
  {
    q: "A 72-year-old client with atrial fibrillation on warfarin eats a large serving of kale salad for lunch, which they do not normally eat. The nurse should educate the client that:",
    o: ["Sudden large increases in vitamin K-rich foods can decrease INR and reduce warfarin effectiveness, increasing clot risk", "Kale has no effect on warfarin therapy", "The client should take an extra warfarin dose to compensate for the kale", "Kale increases the risk of bleeding when combined with warfarin"],
    a: 0,
    r: "Vitamin K (abundant in dark green leafy vegetables like kale) antagonizes warfarin. A sudden large increase in vitamin K intake can decrease INR, making anticoagulation subtherapeutic and increasing thromboembolic risk. Kale definitely affects warfarin. Extra doses are not appropriate. Vitamin K decreases, not increases, warfarin's anticoagulant effect.",
    s: "Cardiovascular"
  },
  {
    q: "A 49-year-old client with no cardiac history presents with sudden onset of rapid heart rate (220 bpm), lightheadedness, and diaphoresis. ECG shows a regular narrow-complex tachycardia. After adenosine administration, the heart rate abruptly converts to 80 bpm NSR. This response confirms:",
    o: ["Supraventricular tachycardia (SVT), specifically AV nodal re-entrant tachycardia, which responds to AV nodal blockade", "Ventricular tachycardia that was successfully cardioverted", "Atrial fibrillation that was rate-controlled", "Sinus tachycardia from anxiety that resolved with sedation"],
    a: 0,
    r: "Abrupt termination of a narrow-complex regular tachycardia with adenosine is diagnostic of AV nodal re-entrant tachycardia (AVNRT), the most common form of SVT. Adenosine blocks conduction through the AV node, interrupting the re-entrant circuit. VT does not respond to adenosine. Afib does not terminate abruptly to NSR with adenosine. Sinus tachycardia would slow gradually.",
    s: "Cardiovascular"
  },
  {
    q: "A 74-year-old client with an AAA is being monitored with serial ultrasounds. The aneurysm has grown from 4.0 cm to 4.8 cm over 12 months. The client's blood pressure is 156/94 mmHg. Which nursing concern is the priority?",
    o: ["The uncontrolled blood pressure accelerates aneurysm growth and must be addressed to slow progression and reduce rupture risk", "The aneurysm growth rate is normal and does not require concern", "The client should be scheduled for immediate surgery since any growth is dangerous", "Blood pressure management has no impact on aneurysm progression"],
    a: 0,
    r: "An aneurysm growing 0.8 cm/year is faster than typical (normal growth is 0.3-0.4 cm/year). Uncontrolled hypertension (156/94) increases wall stress and accelerates growth. Aggressive BP management is essential to slow progression. This growth rate is concerning but does not yet meet surgical criteria (5.5 cm). BP management significantly impacts AAA progression.",
    s: "Cardiovascular"
  },
  {
    q: "A 68-year-old client with heart failure is prescribed hydralazine. The nurse should monitor for which common adverse effect?",
    o: ["Reflex tachycardia and headache from arterial vasodilation", "Profound bradycardia and drowsiness", "Hyperglycemia and weight gain", "Constipation and dry mouth"],
    a: 0,
    r: "Hydralazine is a direct arterial vasodilator that reduces afterload. The rapid decrease in systemic vascular resistance triggers baroreceptor-mediated reflex tachycardia. Headache from vasodilation is also common. It does not cause bradycardia, hyperglycemia, or significant anticholinergic effects like constipation and dry mouth.",
    s: "Cardiovascular"
  },
  {
    q: "A 62-year-old client with heart failure asks why the healthcare provider increased their diuretic dose but also started potassium chloride supplements. Which response by the nurse is most accurate?",
    o: ["Loop diuretics cause potassium loss in the urine, and supplementation prevents dangerous hypokalemia that could cause heart rhythm problems", "Potassium supplements replace the fluid lost through urination", "Potassium makes the diuretic work more effectively at removing fluid", "All clients on any medication need potassium supplements"],
    a: 0,
    r: "Loop and thiazide diuretics inhibit sodium and potassium reabsorption, causing urinary potassium loss. Hypokalemia can cause life-threatening dysrhythmias, especially in heart failure clients who may also be on digoxin. Potassium does not replace fluid. It does not enhance diuretic effectiveness. Potassium supplementation is specific to diuretic-induced losses, not universal.",
    s: "Cardiovascular"
  },
  {
    q: "A 70-year-old client is 48 hours post-CABG. The nurse notes sudden onset of an irregularly irregular rhythm on the monitor with a ventricular rate of 128 bpm. The client reports palpitations but is hemodynamically stable. What does the nurse suspect?",
    o: ["New-onset postoperative atrial fibrillation, which occurs in up to 40% of CABG clients", "Ventricular fibrillation requiring immediate defibrillation", "Normal sinus rhythm with artifact from patient movement", "Complete heart block requiring permanent pacemaker implantation"],
    a: 0,
    r: "Postoperative atrial fibrillation is the most common dysrhythmia after cardiac surgery, occurring in 20-40% of CABG patients, typically within 2-4 days postoperatively. An irregularly irregular rhythm with rapid rate is characteristic of afib. VF would render the client pulseless. The irregular irregularity rules out NSR. Complete heart block is regular, not irregularly irregular.",
    s: "Cardiovascular"
  },
  {
    q: "A 55-year-old client with hypertension controlled by medications asks about consuming grapefruit juice daily. The client takes amlodipine 10 mg. The nurse should advise:",
    o: ["Grapefruit juice can increase amlodipine levels by inhibiting CYP3A4 metabolism, potentially causing excessive blood pressure lowering", "Grapefruit juice has no interaction with any cardiac medications", "Grapefruit juice will make amlodipine less effective", "The client should drink grapefruit juice to enhance the medication's effect"],
    a: 0,
    r: "Grapefruit juice inhibits intestinal CYP3A4 enzymes, which metabolize amlodipine. This increases drug bioavailability and serum levels, potentially causing excessive hypotension, dizziness, and peripheral edema. It does interact with many cardiac medications. It increases (not decreases) drug levels. Intentionally enhancing drug levels is unsafe without provider guidance.",
    s: "Cardiovascular"
  },
  {
    q: "A 79-year-old client with heart failure has an S4 heart sound on auscultation. The nurse understands this finding indicates:",
    o: ["Decreased ventricular compliance and a stiff ventricle, often associated with hypertension, hypertrophic cardiomyopathy, or ischemia", "Normal heart sounds in an elderly client", "Mitral valve prolapse requiring valve replacement", "Aortic regurgitation with volume overload"],
    a: 0,
    r: "An S4 (atrial gallop) occurs in late diastole when the atria contract against a stiff, non-compliant ventricle. It is associated with conditions that cause ventricular hypertrophy or decreased compliance: hypertension, HCM, CAD, and aortic stenosis. While more common in elderly, it is not considered normal. It is not related to MVP or aortic regurgitation.",
    s: "Cardiovascular"
  },
  {
    q: "A 61-year-old client with DVT is being started on direct oral anticoagulant therapy with rivaroxaban. The nurse should educate the client to take rivaroxaban:",
    o: ["With the evening meal, as food significantly increases absorption and bioavailability of the 15 mg and 20 mg doses", "On an empty stomach first thing in the morning", "Only when symptoms of DVT are present", "With a full glass of grapefruit juice to enhance absorption"],
    a: 0,
    r: "Rivaroxaban at the 15 mg and 20 mg doses must be taken with food (preferably the largest meal) to achieve adequate absorption (bioavailability increases from 66% fasting to nearly 100% with food). Empty stomach reduces effectiveness. DVT treatment requires consistent dosing, not symptom-based. Grapefruit juice can increase rivaroxaban levels unpredictably.",
    s: "Cardiovascular"
  },
  {
    q: "A 67-year-old client recovering from cardiac surgery develops a temperature of 38.2 C on postoperative day 1. The nurse should:",
    o: ["Monitor the temperature trend, encourage incentive spirometry, and assess for atelectasis, as low-grade fever on POD 1 is commonly caused by pulmonary atelectasis", "Administer IV antibiotics immediately for presumed surgical site infection", "Prepare the client for emergent re-exploration of the surgical site", "Apply cooling blankets and administer acetaminophen for the fever"],
    a: 0,
    r: "Low-grade fever on postoperative day 1 is most commonly caused by atelectasis from anesthesia and immobility, not infection. Incentive spirometry, deep breathing, and early mobilization are the primary interventions. IV antibiotics are not indicated for atelectasis-related fever. Re-exploration is not warranted for low-grade POD 1 fever. Cooling blankets are excessive for a mild fever.",
    s: "Cardiovascular"
  },
  {
    q: "A 53-year-old client with peripheral arterial disease asks about Buerger disease (thromboangiitis obliterans). The nurse explains the single most important intervention for this condition is:",
    o: ["Complete smoking cessation, as Buerger disease is strongly linked to tobacco use and cessation is the only way to halt disease progression", "Taking daily aspirin to prevent clot formation", "Surgical bypass grafting of the affected arteries", "Long-term antibiotic therapy to treat chronic vascular infection"],
    a: 0,
    r: "Buerger disease (thromboangiitis obliterans) is an inflammatory vasculitis almost exclusively occurring in tobacco users. Complete smoking cessation is the only proven treatment to halt disease progression and prevent amputation. Aspirin may help but is not the primary intervention. Surgery is often not possible due to distal vessel involvement. Antibiotics do not treat the underlying cause.",
    s: "Cardiovascular"
  },
  {
    q: "A 74-year-old client with a permanent pacemaker is having an MRI. The nurse should ensure:",
    o: ["The pacemaker is MRI-conditional and has been reprogrammed to MRI-safe mode by the cardiologist before the scan", "All pacemakers are safe in MRI and no precautions are needed", "The MRI is absolutely contraindicated regardless of the pacemaker type", "The client removes the pacemaker before entering the MRI suite"],
    a: 0,
    r: "Modern MRI-conditional pacemakers can be safely scanned when reprogrammed to MRI-safe mode by the cardiologist. Not all pacemakers are MRI-safe; older devices may be contraindicated. MRI is not universally contraindicated with all pacemakers. Pacemaker removal for an MRI is not practical or necessary for MRI-conditional devices.",
    s: "Cardiovascular"
  },
  {
    q: "A 60-year-old client with heart failure and type 2 diabetes has a hemoglobin A1c of 9.2%. The nurse understands that poor glycemic control affects the cardiovascular system by:",
    o: ["Accelerating atherosclerosis, increasing myocardial oxygen demand, and promoting microvascular damage that worsens heart failure outcomes", "Having no significant impact on cardiovascular disease", "Only affecting the kidneys and eyes, not the heart", "Protecting the heart by providing extra energy from elevated blood sugar"],
    a: 0,
    r: "Poorly controlled diabetes (A1c 9.2%) accelerates atherosclerosis through endothelial damage, promotes microvascular disease, increases myocardial oxygen demand, and worsens heart failure outcomes. Diabetes significantly impacts cardiovascular risk. It affects all organ systems, including the heart. Elevated blood sugar causes harm, not protection.",
    s: "Cardiovascular"
  },
  {
    q: "A 71-year-old client with an implanted left ventricular assist device (LVAD) does not have a palpable pulse. The nurse should:",
    o: ["Recognize this is normal for continuous-flow LVADs, as they produce non-pulsatile flow, and assess the client using MAP and device parameters instead", "Immediately call a code blue for pulselessness", "Increase the LVAD pump speed to restore a palpable pulse", "Disconnect the LVAD and begin manual CPR"],
    a: 0,
    r: "Modern continuous-flow LVADs produce non-pulsatile or minimal-pulse flow, so clients may not have a palpable pulse or audible BP by traditional methods. Mean arterial pressure (MAP) measured by Doppler and device parameters (flow, power, speed) are used to assess hemodynamic status. Pulselessness alone is not an emergency in LVAD clients. Calling a code or disconnecting the device would be inappropriate.",
    s: "Cardiovascular"
  },
  // Additional SATA questions
  {
    q: "A nurse is educating a client with newly diagnosed heart failure about daily self-monitoring. Which actions should the client perform? (Select all that apply.)",
    o: ["Weigh yourself at the same time each morning after voiding", "Monitor for increased swelling in the ankles and feet", "Report a weight gain of more than 1 kg in 24 hours to the healthcare provider", "Measure and record blood pressure and heart rate daily", "Restrict sodium intake as prescribed by the provider", "Exercise vigorously for 60 minutes daily without rest breaks"],
    a: -1,
    ca: [0, 1, 2, 3, 4],
    t: "sata",
    r: "Daily weights, edema monitoring, weight gain reporting, vital sign tracking, and sodium restriction are all essential self-monitoring activities for heart failure clients. Vigorous exercise without rest breaks is inappropriate for heart failure and could cause decompensation; exercise should be gradual and supervised.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is caring for a client with acute decompensated heart failure. Which interventions does the nurse anticipate? (Select all that apply.)",
    o: ["IV diuretics to reduce fluid overload", "Supplemental oxygen to maintain SpO2 above 92%", "Sodium and fluid restriction", "High Fowler's positioning to reduce preload and improve breathing", "IV fluid bolus of 2 litres to improve cardiac output", "Daily weight monitoring and strict intake and output recording"],
    a: -1,
    ca: [0, 1, 2, 3, 5],
    t: "sata",
    r: "IV diuretics, oxygen therapy, sodium/fluid restriction, upright positioning, and strict I&O monitoring are all appropriate interventions for acute decompensated heart failure. An IV fluid bolus would worsen fluid overload and is contraindicated in acute decompensated heart failure.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is reviewing medications for a client with stable coronary artery disease. Which medications are part of standard secondary prevention therapy? (Select all that apply.)",
    o: ["Aspirin for antiplatelet therapy", "A statin for cholesterol management and plaque stabilization", "A beta-blocker for heart rate control and cardioprotection", "An ACE inhibitor or ARB for vascular protection", "A proton pump inhibitor to prevent medication-induced GI bleeding", "An oral corticosteroid for anti-inflammatory protection"],
    a: -1,
    ca: [0, 1, 2, 3],
    t: "sata",
    r: "Aspirin, statin, beta-blocker, and ACE inhibitor/ARB are the cornerstones of secondary prevention in CAD (often remembered as ABCD therapy). A PPI may be prescribed for GI protection but is not standard secondary prevention. Corticosteroids are not part of CAD management and can worsen cardiovascular risk factors.",
    s: "Cardiovascular"
  },
  // Additional ordered question
  {
    q: "A client with heart failure develops severe respiratory distress with frothy pink sputum. Place the nursing interventions in priority order.",
    o: ["Call for immediate assistance and the rapid response team", "Position the client in high Fowler's with legs dangling if possible", "Apply high-flow oxygen or prepare for non-invasive positive pressure ventilation", "Administer IV furosemide as ordered by the healthcare provider", "Insert a Foley catheter for accurate output measurement", "Obtain ABG and monitor SpO2 continuously"],
    a: -1,
    co: [0, 1, 2, 3, 5, 4],
    t: "ordered",
    r: "Frothy pink sputum indicates severe pulmonary edema, a life-threatening emergency. Call for help first, position to reduce preload, apply oxygen/NIPPV for respiratory support, administer IV furosemide for rapid diuresis, monitor oxygenation status with continuous SpO2 and ABG, then insert Foley for output monitoring. This sequence addresses the most immediately life-threatening issues first.",
    s: "Cardiovascular"
  }
];
