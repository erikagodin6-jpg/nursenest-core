import { getAssetUrl } from "@/lib/asset-url";
import type { ExamQuestion } from "./types";

const imgDVTExam = getAssetUrl("dvt_1773517432559.png");
const imgFirstDegreeBlockExam = getAssetUrl("firstdegreeblock_1773517432559.png");

export const rpnCardiovascularQuestions: ExamQuestion[] = [
  // ===== HEART FAILURE (Questions 1-20) =====
  {
    q: "A 72-year-old client with heart failure (HFrEF) presents with BP 92/58, HR 110, RR 28, SpO2 87% on room air. The client is sitting upright and reports worsening dyspnea over the past 3 hours. Which nursing action is the priority?",
    o: ["Apply supplemental oxygen as ordered and elevate the head of bed to high Fowler's position", "Encourage ambulation to improve venous return", "Administer the scheduled dose of metoprolol", "Obtain a 12-lead ECG before any intervention"],
    a: 0,
    r: "With SpO2 of 87% and acute dyspnea, the immediate priority is optimizing oxygenation through supplemental oxygen and positioning. High Fowler's reduces preload and eases breathing. Ambulation would increase oxygen demand. Metoprolol could worsen hypotension with a BP of 92/58. An ECG is important but oxygenation takes priority.",
    s: "Cardiovascular"
  },
  {
    q: "A 68-year-old client with HFpEF is being monitored on a medical unit. Morning assessment reveals a weight gain of 1.8 kg from yesterday, crackles in bilateral lung bases, and 2+ pitting pedal edema. BP is 148/92 and HR is 78. Which finding should the nurse report to the healthcare provider first?",
    o: ["The rapid weight gain of 1.8 kg in 24 hours", "The bilateral crackles in the lung bases", "The 2+ pitting pedal edema", "The blood pressure of 148/92"],
    a: 0,
    r: "A weight gain exceeding 1 kg per day is the most objective and reliable indicator of fluid retention in heart failure. Each kilogram corresponds to approximately 1 litre of retained fluid. While crackles and edema support the clinical picture, weight gain is the earliest measurable sign and drives treatment decisions such as diuretic adjustment.",
    s: "Cardiovascular"
  },
  {
    q: "A 74-year-old client with chronic heart failure is taking digoxin 0.125 mg daily. The nurse obtains vital signs: HR 52 bpm, BP 110/68. The client reports seeing yellow-green halos around lights and feeling nauseated. What is the nurse's priority action?",
    o: ["Hold the digoxin and notify the healthcare provider immediately", "Administer the digoxin as scheduled and document the findings", "Give the client an antiemetic and recheck vitals in 30 minutes", "Encourage the client to drink orange juice for potassium replacement"],
    a: 0,
    r: "Bradycardia (HR below 60 bpm), nausea, and visual disturbances (yellow-green halos) are classic signs of digoxin toxicity. The nurse must hold the dose and notify the provider for a stat digoxin level and potassium check. Administering the drug could worsen toxicity. Antiemetics do not address the underlying toxicity. Oral potassium does not treat acute toxicity.",
    s: "Cardiovascular"
  },
  {
    q: "A 65-year-old client with HFrEF is receiving IV furosemide 40 mg. Lab results show: K+ 3.0 mEq/L, Na+ 132 mEq/L, BUN 28 mg/dL, creatinine 1.6 mg/dL. Which lab value is most concerning and requires immediate reporting?",
    o: ["Potassium 3.0 mEq/L", "Sodium 132 mEq/L", "BUN 28 mg/dL", "Creatinine 1.6 mg/dL"],
    a: 0,
    r: "Potassium 3.0 mEq/L represents hypokalemia (normal 3.5 to 5.0 mEq/L), which is dangerous in heart failure clients because it increases risk for life-threatening dysrhythmias. Loop diuretics deplete potassium. While sodium is low and renal markers are mildly elevated, severe hypokalemia poses the most immediate threat to cardiac rhythm stability.",
    s: "Cardiovascular"
  },
  {
    q: "A 70-year-old client with heart failure is being discharged on enalapril and carvedilol. During discharge teaching, the client asks why they need to weigh themselves daily. Which response by the nurse best demonstrates understanding of the rationale?",
    o: ["Daily weights help detect fluid retention early, so treatment can be adjusted before symptoms worsen", "Daily weights ensure you are eating enough calories during your recovery", "Weighing daily helps your healthcare provider determine if your medications need to be increased", "Daily weights track muscle loss that commonly occurs in heart failure"],
    a: 0,
    r: "Daily weight monitoring is the cornerstone of heart failure self-management. A gain of more than 1 kg in a day or 2 kg in a week may indicate fluid retention requiring diuretic adjustment. Early detection prevents acute decompensation and hospitalization. The other options are either incorrect rationales or secondary considerations.",
    s: "Cardiovascular"
  },
  {
    q: "A 78-year-old client with decompensated heart failure is receiving a continuous dobutamine infusion. The nurse notes the heart rate has increased from 82 to 128 bpm and the client reports palpitations. Which action should the nurse take first?",
    o: ["Notify the healthcare provider about the tachycardia and palpitations", "Increase the dobutamine rate to improve cardiac output", "Administer IV metoprolol to slow the heart rate", "Discontinue the dobutamine infusion immediately without notification"],
    a: 0,
    r: "Tachycardia is a known adverse effect of dobutamine (a beta-1 agonist). The nurse should report the significant heart rate increase and symptoms promptly so the provider can adjust the infusion. Increasing the rate would worsen tachycardia. Administering metoprolol independently is outside RPN scope. Abruptly stopping without provider notification could cause hemodynamic instability.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is caring for a 66-year-old client with newly diagnosed heart failure. The client has a BNP level of 1,200 pg/mL. Which interpretation of this result is accurate?",
    o: ["The elevated BNP confirms significant myocardial wall stress consistent with heart failure", "The BNP level is within normal limits for a client of this age", "An elevated BNP indicates the client is responding well to diuretic therapy", "The BNP level suggests the client has a pulmonary infection rather than heart failure"],
    a: 0,
    r: "BNP (B-type natriuretic peptide) above 100 pg/mL is consistent with heart failure. A level of 1,200 pg/mL indicates significant ventricular wall stress from volume overload. Normal BNP is below 100 pg/mL regardless of age. Decreasing BNP indicates treatment response, not elevated levels. BNP is specific to cardiac stretch, not pulmonary infection.",
    s: "Cardiovascular"
  },
  {
    q: "A 71-year-old client with right-sided heart failure presents with jugular venous distension (JVD), hepatomegaly, and 3+ dependent edema in the lower extremities. BP is 118/76 and SpO2 is 94%. Which intervention should the nurse prioritize?",
    o: ["Elevate the client's legs and administer diuretics as ordered", "Position the client flat to promote kidney perfusion", "Apply ice packs to the edematous extremities", "Encourage the client to increase oral fluid intake"],
    a: 0,
    r: "Right-sided heart failure causes systemic venous congestion manifesting as JVD, hepatomegaly, and peripheral edema. Elevating the legs promotes venous return while diuretics as ordered reduce fluid overload. Lying flat could worsen JVD and congestion. Ice packs are not indicated. Increasing fluids would worsen volume overload.",
    s: "Cardiovascular"
  },
  {
    q: "A 63-year-old client with heart failure and a left ventricular ejection fraction (LVEF) of 25% is prescribed spironolactone. The nurse reviews the most recent potassium level of 5.6 mEq/L. What is the appropriate nursing action?",
    o: ["Hold the spironolactone and notify the healthcare provider of the elevated potassium", "Administer the spironolactone as prescribed since the potassium is borderline", "Give the client a potassium supplement with the spironolactone", "Encourage high-potassium foods to prevent further electrolyte loss"],
    a: 0,
    r: "Spironolactone is a potassium-sparing diuretic. With a potassium of 5.6 mEq/L (above normal 3.5 to 5.0), administering it would risk dangerous hyperkalemia leading to cardiac dysrhythmias. The nurse should hold the dose and report. Potassium supplements and high-potassium foods would further elevate the already dangerous level.",
    s: "Cardiovascular"
  },
  {
    q: "A 69-year-old client with heart failure is on strict fluid restriction of 1,500 mL/day. At 1400 hours, the client has consumed 1,200 mL. The client reports being very thirsty and asks for a large glass of water. Which nursing action is most appropriate?",
    o: ["Offer ice chips or a small amount of water and explain the remaining fluid allowance for the day", "Allow the client to drink freely since dehydration is more dangerous than overload", "Restrict all remaining fluids for the rest of the day", "Contact the provider to request an increase in the fluid restriction"],
    a: 0,
    r: "With 300 mL remaining in the allowance, the nurse should offer small amounts or ice chips (which provide hydration with less volume) while educating the client about pacing fluid intake. Free drinking would exceed the restriction and worsen overload. Complete restriction is unnecessarily punitive. Contacting the provider is premature without medical indication.",
    s: "Cardiovascular"
  },
  {
    q: "A 76-year-old client with chronic heart failure is receiving furosemide and digoxin. Which combination of assessment findings should the nurse report as suggesting digoxin toxicity worsened by diuretic therapy?",
    o: ["Heart rate of 50 bpm, potassium of 2.9 mEq/L, and complaints of nausea", "Heart rate of 88 bpm, potassium of 4.0 mEq/L, and mild ankle edema", "Blood pressure of 130/82, respiratory rate of 18, and clear lung sounds", "Heart rate of 72 bpm, potassium of 3.8 mEq/L, and improved exercise tolerance"],
    a: 0,
    r: "Furosemide-induced hypokalemia (K+ 2.9) potentiates digoxin toxicity because digoxin and potassium compete for the same binding sites on the sodium-potassium ATPase pump. Bradycardia (HR 50) and nausea are classic toxicity signs. The other findings reflect either normal status or improvement.",
    s: "Cardiovascular"
  },
  {
    q: "A client with heart failure is admitted with acute pulmonary edema. The healthcare provider orders morphine sulfate 2 mg IV. The nurse understands that the primary rationale for this medication in pulmonary edema is which of the following?",
    o: ["Morphine reduces preload by causing venodilation and decreases the sensation of air hunger", "Morphine increases cardiac contractility to improve cardiac output", "Morphine prevents atrial fibrillation that commonly accompanies pulmonary edema", "Morphine reduces afterload by lowering systemic vascular resistance"],
    a: 0,
    r: "In acute pulmonary edema, morphine produces venodilation that reduces preload (venous return to the heart), decreasing pulmonary congestion. It also reduces anxiety and the sensation of dyspnea. Morphine does not increase contractility or specifically prevent AFib. While it has mild afterload effects, the primary benefit is preload reduction.",
    s: "Cardiovascular"
  },
  {
    q: "A 67-year-old client with heart failure and diabetes is started on sacubitril/valsartan. The nurse notes the client was previously taking enalapril. Which safety consideration is most important for the nurse to verify?",
    o: ["That at least 36 hours have elapsed since the last dose of enalapril before starting sacubitril/valsartan", "That the client's blood glucose is below 10 mmol/L before administration", "That the client has eaten a full meal within the last hour", "That a 12-lead ECG was completed within the last 24 hours"],
    a: 0,
    r: "Sacubitril/valsartan (Entresto) must not be given within 36 hours of an ACE inhibitor (enalapril) due to the risk of life-threatening angioedema. This washout period is a critical safety check. Blood glucose, meal timing, and recent ECG, while relevant to overall care, are not specific safety concerns for this medication transition.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is assessing a 73-year-old client with heart failure who reports progressive fatigue, dyspnea on exertion when walking to the bathroom, and needing to sleep with two pillows. According to the New York Heart Association (NYHA) classification, this client is most likely in which class?",
    o: ["Class III, as symptoms occur with less than ordinary physical activity", "Class I, as the client can still perform some activity", "Class II, as symptoms only occur with ordinary activity", "Class IV, as the client has symptoms at rest"],
    a: 0,
    r: "NYHA Class III describes marked limitation where symptoms (dyspnea, fatigue) occur with less than ordinary activity such as walking short distances. The client can still function at rest but is limited. Class I has no limitations. Class II has symptoms only with ordinary activity. Class IV has symptoms at rest.",
    s: "Cardiovascular"
  },
  {
    q: "A 80-year-old client with heart failure is receiving a nitroglycerin infusion for afterload reduction. Current BP is 86/52, HR 104, and the client appears confused. Which action should the nurse take first?",
    o: ["Reduce the nitroglycerin infusion rate and notify the healthcare provider of the hypotension", "Increase the nitroglycerin rate since the client's heart failure is worsening", "Position the client in Trendelenburg to increase blood pressure", "Administer a fluid bolus of 500 mL normal saline"],
    a: 0,
    r: "BP 86/52 with confusion indicates significant hypotension likely caused by nitroglycerin's vasodilatory effects. The nurse should reduce the infusion and report immediately. Increasing the rate would worsen hypotension. Trendelenburg is no longer recommended. A fluid bolus in heart failure could precipitate pulmonary edema and requires a provider order.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is providing care for a 64-year-old client with heart failure who has an implantable cardioverter-defibrillator (ICD). The client reports receiving a shock from the device. Which nursing action is most appropriate?",
    o: ["Assess the client's vital signs and cardiac rhythm, then notify the healthcare provider", "Reassure the client that the shock was routine and requires no follow-up", "Instruct the client to avoid all physical activity for the next 72 hours", "Apply a magnet over the ICD to prevent additional shocks"],
    a: 0,
    r: "An ICD fires when it detects a dangerous dysrhythmia. The nurse should assess the client's hemodynamic status and rhythm, then notify the provider for further evaluation. A shock is not routine and warrants investigation. Activity restriction is not automatically indicated. Applying a magnet to disable the device could be life-threatening if the dysrhythmia recurs.",
    s: "Cardiovascular"
  },
  {
    q: "A 71-year-old client with heart failure has the following assessment findings: SpO2 91%, bilateral crackles, pink frothy sputum, and respiratory rate of 32. Which condition does the nurse suspect?",
    o: ["Acute pulmonary edema", "Right-sided heart failure", "Pleural effusion", "Pneumothorax"],
    a: 0,
    r: "Pink frothy sputum is a hallmark of acute pulmonary edema, indicating fluid flooding the alveoli. Combined with bilateral crackles, low SpO2, and tachypnea, this presentation is classic for left-sided failure causing pulmonary congestion. Right-sided failure typically presents with peripheral edema and JVD. Pleural effusion has diminished breath sounds. Pneumothorax has absent breath sounds unilaterally.",
    s: "Cardiovascular"
  },
  {
    q: "A 60-year-old client with heart failure is being started on an ACE inhibitor. Which assessment findings should the nurse monitor and report during the first 48 hours of therapy?",
    o: ["A persistent dry cough, elevated creatinine, and potassium above 5.5 mEq/L", "Weight gain of 0.5 kg, mild ankle swelling, and decreased urine output", "Diarrhea, hyperglycemia, and visual disturbances", "Elevated liver enzymes, dark urine, and clay-coloured stools"],
    a: 0,
    r: "ACE inhibitors commonly cause a dry cough (due to bradykinin accumulation), can reduce renal perfusion (elevated creatinine), and cause hyperkalemia by reducing aldosterone secretion. These require monitoring and reporting. The other options describe findings not typically associated with ACE inhibitor initiation.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is caring for a 75-year-old client with heart failure who has a sodium level of 126 mEq/L. The client is confused and lethargic. Which nursing intervention is the priority?",
    o: ["Implement seizure precautions and notify the healthcare provider of the critical sodium level", "Encourage the client to increase dietary sodium intake", "Administer a 3% hypertonic saline bolus independently", "Restrict the client's fluid intake to 500 mL per day"],
    a: 0,
    r: "Sodium of 126 mEq/L is severe hyponatremia (normal 135 to 145). Neurological symptoms (confusion, lethargy) indicate the brain is affected, and seizures are a serious risk. Seizure precautions and provider notification are priorities. Dietary sodium alone is insufficient. Hypertonic saline requires a provider order and close monitoring. Severe restriction without orders is inappropriate.",
    s: "Cardiovascular"
  },
  {
    q: "A 68-year-old client with biventricular heart failure asks the nurse to explain what a cardiac resynchronization therapy (CRT) device does. Which explanation by the nurse is most accurate?",
    o: ["The device coordinates the timing of both ventricles to pump more efficiently", "The device replaces the function of the heart's natural pacemaker permanently", "The device delivers a shock only when a dangerous rhythm is detected", "The device monitors blood pressure and adjusts it automatically"],
    a: 0,
    r: "CRT (biventricular pacing) synchronizes the contraction of the left and right ventricles to improve cardiac output in clients with ventricular dyssynchrony. It does not replace the SA node entirely, that describes a standard pacemaker. Shock delivery describes an ICD. CRT does not monitor or adjust blood pressure directly.",
    s: "Cardiovascular"
  },
  // ===== ACUTE CORONARY SYNDROMES (Questions 21-40) =====
  {
    q: "A 58-year-old male client presents to the emergency department with substernal chest pain radiating to the left arm, diaphoresis, and nausea. Vital signs: BP 142/88, HR 96, RR 22, SpO2 96%. A 12-lead ECG shows ST elevation in leads II, III, and aVF. Which nursing action is the priority?",
    o: ["Administer aspirin 160 mg chewed as ordered and prepare for emergent reperfusion therapy", "Apply a cold compress to the chest to reduce discomfort", "Encourage the client to walk to the catheterization laboratory", "Administer the client's routine antihypertensive medication"],
    a: 0,
    r: "ST elevation in leads II, III, and aVF indicates an inferior STEMI. Aspirin inhibits platelet aggregation and is a first-line intervention. Preparation for reperfusion (PCI or fibrinolytics) is time-critical. Cold compresses do not address myocardial ischemia. Walking increases oxygen demand. Routine antihypertensives are not the priority in acute MI.",
    s: "Cardiovascular"
  },
  {
    q: "A 62-year-old female client with a history of diabetes presents with sudden onset of jaw pain, epigastric discomfort, nausea, and extreme fatigue. BP is 136/84, HR 88. The nurse suspects an acute coronary event. Which factor supports this suspicion?",
    o: ["Women and clients with diabetes often present with atypical symptoms of acute coronary syndrome", "Jaw pain always indicates a dental problem rather than a cardiac event", "Epigastric discomfort rules out a cardiac cause", "Fatigue is not associated with acute coronary syndromes in any population"],
    a: 0,
    r: "Women and clients with diabetes frequently present with atypical ACS symptoms including jaw pain, epigastric discomfort, fatigue, nausea, and dyspnea rather than classic substernal chest pain. Jaw pain can be a referred cardiac symptom. Epigastric discomfort does not rule out cardiac causes. Fatigue is a recognized ACS symptom, especially in women.",
    s: "Cardiovascular"
  },
  {
    q: "A 55-year-old client is admitted with an NSTEMI. Troponin I is 2.8 ng/mL (normal less than 0.04). The client's chest pain has resolved after nitroglycerin administration. Which statement by the nurse accurately interprets the troponin result?",
    o: ["The elevated troponin confirms myocardial cell damage has occurred despite pain resolution", "The troponin will normalize within 1 hour if the pain has resolved", "Elevated troponin is a normal finding in clients over age 50", "Troponin elevation only occurs in ST-elevation myocardial infarction"],
    a: 0,
    r: "Troponin is a cardiac-specific biomarker released when myocardial cells are damaged. An elevated level of 2.8 ng/mL (normal below 0.04) confirms myocardial injury regardless of whether pain persists. Troponin remains elevated for 7 to 14 days. It is not age-dependent and rises in both STEMI and NSTEMI.",
    s: "Cardiovascular"
  },
  {
    q: "A 50-year-old client is receiving IV nitroglycerin for unstable angina. The current BP is 88/54 and the client reports dizziness. The nitroglycerin is infusing at 20 mcg/min. What should the nurse do first?",
    o: ["Reduce the nitroglycerin infusion rate and notify the healthcare provider", "Increase the infusion rate to resolve the chest pain faster", "Place the client in a supine position and administer a fluid bolus", "Discontinue the nitroglycerin and apply a transdermal nitroglycerin patch"],
    a: 0,
    r: "Hypotension (BP 88/54) with dizziness indicates excessive vasodilation from nitroglycerin. The nurse should reduce the rate and report. Increasing the rate would worsen hypotension. While supine positioning may help, a fluid bolus requires a provider order. Switching to a patch does not address the acute hypotension and transdermal absorption is unpredictable.",
    s: "Cardiovascular"
  },
  {
    q: "A 48-year-old client presents to the ED with crushing chest pain rated 9/10. The healthcare provider orders morphine sulfate 4 mg IV. After administration, the client's pain decreases to 3/10, but BP drops to 82/50 and RR decreases to 10. Which action is the priority?",
    o: ["Hold further morphine doses, position the client supine, and notify the healthcare provider", "Administer naloxone 0.4 mg IV as ordered for respiratory depression", "Continue morphine administration since the chest pain is not fully resolved", "Elevate the head of bed to high Fowler's to improve breathing"],
    a: 0,
    r: "The combination of hypotension and respiratory depression (RR 10) indicates morphine adverse effects. The nurse should stop further doses, position supine to support BP, and notify the provider who may order naloxone. Administering naloxone independently is outside RPN scope unless standing orders exist. Continuing morphine would worsen depression. High Fowler's could worsen hypotension.",
    s: "Cardiovascular"
  },
  {
    q: "A 60-year-old client had a percutaneous coronary intervention (PCI) with stent placement via the right femoral artery 2 hours ago. The nurse notes a firm, expanding hematoma at the insertion site, and the client reports increasing groin pain. BP is 100/62 and HR is 112. What is the nurse's immediate action?",
    o: ["Apply firm, direct pressure above the insertion site and call for immediate assistance", "Elevate the affected leg to promote venous drainage", "Apply an ice pack to the hematoma and reassess in 15 minutes", "Remove the pressure dressing to inspect the insertion site more closely"],
    a: 0,
    r: "An expanding hematoma with hypotension and tachycardia indicates active bleeding from the femoral artery puncture site, a life-threatening emergency. Direct pressure proximal to the site and calling for help are immediate priorities. Elevating the leg does not control arterial bleeding. Ice alone is insufficient. Removing the dressing could worsen hemorrhage.",
    s: "Cardiovascular"
  },
  {
    q: "A 64-year-old client who experienced an acute MI 24 hours ago develops a new systolic murmur, sudden onset dyspnea, and bilateral crackles. HR is 118 and BP is 88/60. Which complication should the nurse suspect?",
    o: ["Mitral valve regurgitation from papillary muscle rupture", "Normal recovery following myocardial infarction", "Pericardial tamponade from post-MI pericarditis", "Aortic stenosis secondary to the MI"],
    a: 0,
    r: "A new systolic murmur after MI with sudden dyspnea and hemodynamic instability suggests papillary muscle dysfunction or rupture causing acute mitral regurgitation. Blood flows backward into the left atrium, causing pulmonary edema. This is not normal recovery. Tamponade presents with muffled heart sounds and JVD. Aortic stenosis does not develop acutely post-MI.",
    s: "Cardiovascular"
  },
  {
    q: "A 56-year-old client is prescribed dual antiplatelet therapy (aspirin and clopidogrel) after coronary stent placement. Which statement by the client indicates a need for further teaching?",
    o: ["I can stop taking clopidogrel once my chest pain goes away since the stent fixed the problem", "I should notify my dentist about these medications before any dental procedures", "I will watch for unusual bleeding or bruising and report it right away", "I need to take both medications every day as prescribed, even if I feel well"],
    a: 0,
    r: "Dual antiplatelet therapy must be continued for the prescribed duration (typically 6 to 12 months) to prevent stent thrombosis, regardless of symptom resolution. Stopping early dramatically increases the risk of stent occlusion and MI. The other responses demonstrate appropriate understanding of dental notification, bleeding monitoring, and adherence.",
    s: "Cardiovascular"
  },
  {
    q: "A 52-year-old client arrives at the ED with chest pain. Serial ECGs and troponin levels are negative. The healthcare provider diagnoses unstable angina. Which characteristic differentiates unstable angina from stable angina?",
    o: ["Unstable angina occurs at rest or with minimal exertion and represents a change in the usual pattern", "Unstable angina always produces ST elevation on a 12-lead ECG", "Stable angina occurs unpredictably without any identifiable triggers", "Unstable angina is always accompanied by positive troponin levels"],
    a: 0,
    r: "Unstable angina is distinguished by pain occurring at rest, with increasing frequency, or with decreased exertion compared to the client's usual pattern. It does not produce ST elevation (that is STEMI) and troponin levels remain negative (positive troponin indicates NSTEMI). Stable angina is predictable with known triggers and resolves with rest or nitroglycerin.",
    s: "Cardiovascular"
  },
  {
    q: "A 70-year-old client is recovering from an acute MI and asks about resuming sexual activity. Which response by the nurse is most appropriate?",
    o: ["You can discuss resuming sexual activity with your healthcare provider once you can climb two flights of stairs without symptoms", "Sexual activity is permanently restricted after a heart attack", "You may resume sexual activity immediately as long as you feel ready", "Sexual activity should only be resumed once you have completed one full year of cardiac rehabilitation"],
    a: 0,
    r: "The guideline for resuming sexual activity after MI is the ability to perform moderate exertion (equivalent to climbing two flights of stairs) without chest pain, dyspnea, or ECG changes. This should be discussed with the provider. Permanent restriction is incorrect. Immediate resumption is unsafe. Waiting a full year is unnecessarily conservative.",
    s: "Cardiovascular"
  },
  {
    q: "A 45-year-old client with a family history of coronary artery disease presents with intermittent chest tightness during exercise that resolves with rest. Vital signs are stable. The healthcare provider orders a stress test. Which statement by the nurse best prepares the client?",
    o: ["You will exercise on a treadmill while your heart rate, blood pressure, and ECG are monitored for changes", "The stress test involves injecting dye into your coronary arteries to visualize blockages", "You will need to fast for 48 hours before the procedure", "The stress test requires general anaesthesia and an overnight hospital stay"],
    a: 0,
    r: "An exercise stress test monitors cardiovascular response to controlled physical exertion using ECG, heart rate, and blood pressure. Dye injection describes cardiac catheterization, not a standard stress test. Fasting for 48 hours is incorrect (typically 4 to 6 hours). General anaesthesia and overnight stays are not required for stress testing.",
    s: "Cardiovascular"
  },
  {
    q: "A 59-year-old client is prescribed sublingual nitroglycerin (NTG) for angina. The nurse provides teaching about its use. Which instruction should the nurse include?",
    o: ["Take one tablet under your tongue when chest pain begins, and call 911 if pain persists after one dose", "Swallow the nitroglycerin tablet with a full glass of water for best absorption", "Store the nitroglycerin in a clear plastic bag on the kitchen counter for easy access", "Take up to 10 doses before seeking emergency care"],
    a: 0,
    r: "Current Canadian guidelines recommend taking one NTG sublingually and calling 911 if pain does not improve. NTG must be dissolved sublingually, not swallowed. It should be stored in the original dark glass container away from heat, light, and moisture. Taking 10 doses would be dangerous and delays emergency care.",
    s: "Cardiovascular"
  },
  {
    q: "A 66-year-old client recovering from an NSTEMI is started on metoprolol. The nurse checks vital signs before administration: HR 54, BP 102/64. Which action is most appropriate?",
    o: ["Hold the metoprolol and notify the healthcare provider due to the bradycardia", "Administer the metoprolol since the blood pressure is adequate", "Administer the metoprolol with a high-calorie snack", "Wait 30 minutes and recheck the heart rate before deciding"],
    a: 0,
    r: "Metoprolol is a beta-blocker that further reduces heart rate. With an HR of 54 bpm (below the typical threshold of 60 bpm for holding beta-blockers), the nurse should hold the dose and report. Administering it could cause severe bradycardia or heart block. The BP, while on the lower side, is not the primary concern. Waiting risks further deterioration.",
    s: "Cardiovascular"
  },
  {
    q: "A 61-year-old client is 6 hours post-STEMI and develops sudden severe chest pain different from the original presentation. The nurse notes a pericardial friction rub on auscultation. Which complication does the nurse suspect?",
    o: ["Post-MI pericarditis (Dressler syndrome)", "Recurrent myocardial infarction", "Aortic dissection", "Pulmonary embolism"],
    a: 0,
    r: "A pericardial friction rub with chest pain after MI strongly suggests pericarditis (early post-MI pericarditis or Dressler syndrome if occurring weeks later). The pain is typically sharp, positional, and different from ischemic pain. Recurrent MI would show ECG changes without a friction rub. Aortic dissection presents with tearing pain. PE presents with dyspnea and pleuritic pain.",
    s: "Cardiovascular"
  },
  {
    q: "A 57-year-old client with ACS is started on a heparin infusion. The aPTT result returns at 120 seconds (therapeutic range 60 to 80 seconds). Which action should the nurse take?",
    o: ["Stop the heparin infusion temporarily and notify the healthcare provider of the supratherapeutic aPTT", "Continue the heparin infusion at the current rate as the aPTT is close to normal", "Increase the heparin infusion rate to achieve better anticoagulation", "Administer protamine sulfate 50 mg IV stat without a provider order"],
    a: 0,
    r: "An aPTT of 120 seconds is significantly above the therapeutic range (60 to 80), indicating excessive anticoagulation with risk of serious bleeding. The nurse should stop the infusion and notify the provider for dose adjustment or protamine orders. The value is not close to normal. Increasing the rate would worsen the risk. Protamine administration requires a provider order.",
    s: "Cardiovascular"
  },
  {
    q: "A 53-year-old client is admitted with acute coronary syndrome and undergoes cardiac catheterization via the radial artery. Post-procedure, which assessment finding requires immediate nursing intervention?",
    o: ["The client's right hand is pale, cool, and has diminished radial pulse compared to the left", "The client reports mild soreness at the radial insertion site", "A small ecchymosis (1 cm) is noted around the insertion site", "The client's blood pressure is 128/78 in the opposite arm"],
    a: 0,
    r: "Pallor, coolness, and diminished pulse distal to the radial access site indicate compromised arterial flow, possibly from thrombus or arterial spasm. This is a limb-threatening emergency requiring immediate intervention. Mild soreness and small ecchymosis are expected findings. BP of 128/78 is normal.",
    s: "Cardiovascular"
  },
  {
    q: "A 49-year-old client with a history of cocaine use presents with chest pain, diaphoresis, HR 124, and BP 178/102. The ECG shows ST depression in leads V3 to V6. Which medication class would the nurse question if ordered for this client?",
    o: ["Beta-blockers, because they can cause unopposed alpha-adrenergic stimulation in cocaine-related chest pain", "Benzodiazepines, because they reduce anxiety and heart rate", "Nitroglycerin, because it relieves coronary vasospasm", "Aspirin, because it inhibits platelet aggregation"],
    a: 0,
    r: "Beta-blockers are contraindicated in cocaine-associated chest pain because blocking beta receptors allows unopposed alpha-adrenergic stimulation, potentially worsening coronary vasospasm and hypertension. Benzodiazepines are first-line for cocaine-related chest pain. Nitroglycerin addresses vasospasm. Aspirin is appropriate for antiplatelet therapy.",
    s: "Cardiovascular"
  },
  {
    q: "A 63-year-old client had a STEMI and successful PCI with stent placement. The client is stable on day 2 and asks when they can return to work as an office clerk. Which response by the nurse is most appropriate?",
    o: ["Recovery timelines vary, but your healthcare provider will discuss returning to work at your follow-up appointment, usually within 2 to 6 weeks for desk work", "You should plan to retire since working after a heart attack is too risky", "You can return to work tomorrow if you are feeling well", "Most clients return to work within 24 hours of stent placement"],
    a: 0,
    r: "Return to sedentary work after uncomplicated PCI typically occurs within 2 to 6 weeks, depending on individual recovery. The provider will assess readiness at follow-up. Retirement is unnecessarily extreme. Returning within 24 hours or the next day is too soon and does not allow for adequate recovery and medication stabilization.",
    s: "Cardiovascular"
  },
  {
    q: "A 55-year-old client is receiving fibrinolytic therapy (alteplase) for a STEMI. Which assessment finding indicates a potentially life-threatening complication of this therapy?",
    o: ["Sudden change in neurological status with severe headache and unilateral weakness", "Mild oozing at the IV insertion site", "A drop in systolic BP from 140 to 128 mmHg", "Transient nausea after the infusion begins"],
    a: 0,
    r: "Sudden neurological changes (headache, unilateral weakness, altered consciousness) during fibrinolytic therapy suggest intracranial hemorrhage, a life-threatening complication. The therapy must be stopped and the provider notified immediately. Mild IV site oozing is expected. A modest BP drop is not alarming. Transient nausea is a minor side effect.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is caring for a client 4 hours after STEMI. The client reports a sudden relief of chest pain without any intervention. CK-MB and troponin are rising. What should the nurse understand about this finding?",
    o: ["Spontaneous pain relief with rising cardiac markers may indicate completed infarction of the affected myocardial tissue", "The client has fully recovered and can be discharged", "The rising markers are a laboratory error since the pain resolved", "Pain resolution means the coronary artery has spontaneously reopened"],
    a: 0,
    r: "When chest pain resolves spontaneously while cardiac biomarkers continue to rise, it often indicates that the ischemic tissue has fully infarcted (died) and is no longer generating pain signals. This is not recovery. Rising markers confirm ongoing or completed myocardial damage. While spontaneous reperfusion is possible, it would show peaked and declining markers.",
    s: "Cardiovascular"
  },
  // ===== HYPERTENSION (Questions 41-58) =====
  {
    q: "A 54-year-old client is newly diagnosed with Stage 2 hypertension. BP readings on two separate visits are 168/102 and 172/98. The client asks why they need medication since they feel fine. Which response by the nurse is most accurate?",
    o: ["High blood pressure often has no symptoms but silently damages your heart, kidneys, and blood vessels over time", "If you feel fine, medication is probably not necessary", "Symptoms always appear before organ damage occurs", "You only need medication when your blood pressure exceeds 200/120"],
    a: 0,
    r: "Hypertension is called the 'silent killer' because it is usually asymptomatic while causing progressive damage to target organs (heart, brain, kidneys, eyes, blood vessels). Feeling well does not indicate absence of damage. Symptoms often do not appear until significant organ damage has occurred. Treatment is recommended at lower thresholds than 200/120.",
    s: "Cardiovascular"
  },
  {
    q: "A 62-year-old client is on amlodipine 10 mg daily for hypertension. The client reports persistent ankle swelling. BP is 132/80. Which explanation by the nurse is most appropriate?",
    o: ["Peripheral edema is a common side effect of calcium channel blockers and should be reported to your provider for evaluation", "Ankle swelling means your blood pressure medication is not working", "You should stop taking amlodipine immediately and elevate your legs", "The swelling is unrelated to your medication and is a sign of heart failure"],
    a: 0,
    r: "Peripheral edema is a well-known side effect of dihydropyridine calcium channel blockers (like amlodipine) caused by arteriolar dilation and increased capillary hydrostatic pressure. The BP of 132/80 suggests the medication is effective. Stopping medication without provider guidance is unsafe. While edema can indicate heart failure, in this context it is more likely medication-related and needs provider assessment.",
    s: "Cardiovascular"
  },
  {
    q: "A 48-year-old client with hypertension is prescribed hydrochlorothiazide (HCTZ) 25 mg daily. Which lab value should the nurse monitor most closely?",
    o: ["Serum potassium level", "Serum calcium level", "Hemoglobin A1C", "Serum albumin level"],
    a: 0,
    r: "HCTZ is a thiazide diuretic that promotes potassium excretion, increasing the risk for hypokalemia, which can cause dangerous cardiac dysrhythmias and muscle weakness. While thiazides can affect calcium (increase reabsorption), glucose, and uric acid, potassium monitoring is the primary safety concern. Albumin and HbA1c are not directly affected.",
    s: "Cardiovascular"
  },
  {
    q: "A 70-year-old client with hypertension takes lisinopril 20 mg daily. At a clinic visit, the client's BP is 108/62 and they report dizziness when standing. Which nursing action is most appropriate?",
    o: ["Assess for orthostatic hypotension by checking BP in lying, sitting, and standing positions, then report findings to the provider", "Advise the client to take a double dose to stabilize blood pressure", "Instruct the client to stop the lisinopril permanently", "Tell the client the dizziness is expected and will resolve without intervention"],
    a: 0,
    r: "Dizziness on standing with a BP of 108/62 suggests orthostatic hypotension, which may require dose adjustment. The nurse should perform orthostatic vital signs (lying, sitting, standing) to confirm and report findings. Doubling the dose would worsen hypotension. Stopping the medication without provider direction is unsafe. Persistent dizziness warrants investigation, not dismissal.",
    s: "Cardiovascular"
  },
  {
    q: "A 56-year-old client presents to the emergency department with BP 220/130, severe headache, blurred vision, and epistaxis. The provider diagnoses hypertensive crisis. Which nursing action is the priority?",
    o: ["Establish IV access and prepare to administer IV antihypertensive medication as ordered", "Administer the client's home oral antihypertensive medications", "Apply ice packs to the back of the client's neck to reduce blood pressure", "Encourage the client to perform deep breathing exercises to lower blood pressure"],
    a: 0,
    r: "Hypertensive crisis (BP greater than 180/120 with target organ damage) requires IV antihypertensive therapy for controlled reduction. The goal is to reduce MAP by no more than 25% in the first hour to prevent cerebral hypoperfusion. Oral medications act too slowly. Ice packs and deep breathing are insufficient for this medical emergency.",
    s: "Cardiovascular"
  },
  {
    q: "A 45-year-old client with hypertension asks about the DASH diet. Which explanation by the nurse accurately describes this dietary approach?",
    o: ["The DASH diet emphasizes fruits, vegetables, whole grains, and low-fat dairy while limiting sodium, saturated fats, and sweets", "The DASH diet is a high-protein, low-carbohydrate plan that eliminates all grains", "The DASH diet requires eliminating all dairy products and red meat", "The DASH diet focuses primarily on calorie counting without specific food group recommendations"],
    a: 0,
    r: "The Dietary Approaches to Stop Hypertension (DASH) diet is evidence-based and emphasizes fruits, vegetables, whole grains, and low-fat dairy while limiting sodium (to 2,300 mg or less daily), saturated fat, and sweets. It is not a low-carb diet. It includes low-fat dairy. It provides specific food group guidance beyond calorie counting.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is teaching a 52-year-old client how to take their blood pressure at home. Which instruction ensures the most accurate reading?",
    o: ["Sit quietly for 5 minutes with your arm supported at heart level, feet flat on the floor, before taking the reading", "Take your blood pressure immediately after climbing stairs to see your highest reading", "Cross your legs while sitting to stabilize your body during the measurement", "Use a wrist cuff on your dominant hand while lying in bed"],
    a: 0,
    r: "Accurate home BP measurement requires 5 minutes of quiet rest, supported arm at heart level, feet flat on the floor, and back supported. Exercise immediately before falsely elevates readings. Crossing legs increases BP by 2 to 8 mmHg. Wrist cuffs are less accurate than upper arm cuffs, and lying position is not the standard.",
    s: "Cardiovascular"
  },
  {
    q: "A 60-year-old client with hypertension and chronic kidney disease has a BP of 152/94 on their current regimen of ramipril and amlodipine. The provider adds a third agent. Which class of medication would the nurse expect?",
    o: ["A thiazide or thiazide-like diuretic", "A second ACE inhibitor", "An alpha-adrenergic agonist", "A nonsteroidal anti-inflammatory drug"],
    a: 0,
    r: "Guidelines recommend adding a thiazide diuretic as a third agent when combination ACE inhibitor and calcium channel blocker therapy does not achieve target BP. Dual ACE inhibitor therapy is contraindicated. Alpha agonists (like clonidine) are not first-line. NSAIDs worsen hypertension and are nephrotoxic in CKD clients.",
    s: "Cardiovascular"
  },
  {
    q: "A 58-year-old client with resistant hypertension is prescribed spironolactone as an add-on agent. Which lab value should the nurse monitor most frequently?",
    o: ["Serum potassium", "Serum sodium", "Fasting blood glucose", "Serum magnesium"],
    a: 0,
    r: "Spironolactone is a potassium-sparing diuretic and aldosterone antagonist. It reduces potassium excretion, increasing the risk for hyperkalemia, especially in clients already on ACE inhibitors or ARBs. Frequent potassium monitoring is essential. While sodium, glucose, and magnesium may be checked, potassium poses the most immediate danger.",
    s: "Cardiovascular"
  },
  {
    q: "A 66-year-old client reports stopping their antihypertensive medication because they experienced sexual dysfunction. Which nursing action is most appropriate?",
    o: ["Acknowledge the concern and encourage the client to discuss alternative medications with their healthcare provider", "Tell the client that sexual side effects are unavoidable with all blood pressure medications", "Advise the client to take the medication every other day to reduce side effects", "Instruct the client to resume the medication immediately regardless of side effects"],
    a: 0,
    r: "Sexual dysfunction is a legitimate concern and a common reason for medication non-adherence. The nurse should validate the client's concern and encourage discussion with the provider about alternative agents with fewer sexual side effects (such as ARBs or calcium channel blockers). Not all medications cause this. Alternate-day dosing is not safe. Dismissing the concern reduces trust.",
    s: "Cardiovascular"
  },
  {
    q: "A 72-year-old client has a BP of 158/64 at a routine clinic visit. The nurse recognizes the widened pulse pressure. Which condition is most commonly associated with this finding in older adults?",
    o: ["Isolated systolic hypertension due to arterial stiffness from atherosclerosis", "Dehydration from inadequate fluid intake", "Cushing syndrome from adrenal overactivity", "Acute kidney failure from NSAID use"],
    a: 0,
    r: "A widened pulse pressure (systolic minus diastolic greater than 60 mmHg) in older adults is characteristic of isolated systolic hypertension caused by age-related arterial stiffness. The rigid arteries cannot expand during systole, raising systolic BP while diastolic remains normal or low. Dehydration narrows pulse pressure. Cushing causes generalized hypertension. AKI does not typically cause this pattern.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is caring for a client in hypertensive crisis receiving IV labetalol. The BP is being reduced from 228/134. After 30 minutes of treatment, the BP is now 158/92. The client reports a new onset of confusion and slurred speech. What should the nurse suspect?",
    o: ["The blood pressure may have been reduced too rapidly, causing cerebral hypoperfusion", "The medication is not working effectively enough", "The client is experiencing an allergic reaction to labetalol", "The confusion is unrelated to the blood pressure management"],
    a: 0,
    r: "A drop from 228/134 to 158/92 in 30 minutes (approximately 30% reduction) is too rapid. Guidelines recommend no more than 25% reduction in MAP in the first hour. Rapid reduction causes cerebral hypoperfusion because autoregulation is shifted in chronic hypertension. Neurological changes confirm this. The nurse should report immediately for rate adjustment.",
    s: "Cardiovascular"
  },
  {
    q: "A 50-year-old client's ambulatory blood pressure monitoring reveals consistently elevated readings at work but normal readings at home and during sleep. Which term describes this pattern?",
    o: ["Masked hypertension", "White-coat hypertension", "Malignant hypertension", "Secondary hypertension"],
    a: 0,
    r: "Masked hypertension refers to normal office/home readings but elevated readings in other settings (such as work or during stress). This is the opposite of white-coat hypertension, where readings are only elevated in clinical settings. Malignant hypertension involves severely elevated BP with organ damage. Secondary hypertension has an identifiable cause.",
    s: "Cardiovascular"
  },
  // ===== DYSRHYTHMIAS (Questions 59-80) =====
  {
    q: "A 78-year-old client on telemetry has an irregular heart rhythm with no discernible P waves and a ventricular rate of 142 bpm. BP is 106/68 and the client reports palpitations. Which dysrhythmia does the nurse suspect?",
    o: ["Atrial fibrillation with rapid ventricular response", "Normal sinus rhythm with premature atrial contractions", "Ventricular tachycardia", "Third-degree heart block"],
    a: 0,
    r: "Absent P waves with an irregularly irregular rhythm and rapid ventricular rate are hallmarks of atrial fibrillation with rapid ventricular response. Normal sinus rhythm has regular P waves. V-tach is regular and wide complex. Third-degree heart block shows P waves unrelated to QRS complexes with a slow ventricular rate.",
    s: "Cardiovascular"
  },
  {
    q: "A 65-year-old client with atrial fibrillation is on warfarin therapy. The INR result is 4.8 (therapeutic range 2.0 to 3.0). The client has no active bleeding. Which nursing action is most appropriate?",
    o: ["Hold the warfarin dose and notify the healthcare provider of the supratherapeutic INR", "Administer the warfarin as scheduled since there is no active bleeding", "Administer vitamin K 10 mg IV stat without a provider order", "Increase dietary vitamin K to bring the INR down naturally"],
    a: 0,
    r: "An INR of 4.8 significantly exceeds the therapeutic range and increases bleeding risk. Without active bleeding, the appropriate action is to hold the dose and notify the provider, who may order dose adjustment or vitamin K. Administering warfarin would further increase INR. IV vitamin K requires a provider order. Dietary changes alone are too slow and unpredictable for an INR this high.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is monitoring a client on telemetry when the rhythm suddenly changes to ventricular fibrillation. The client is unresponsive with no pulse. What is the nurse's immediate action?",
    o: ["Initiate CPR and call for a defibrillator", "Administer amiodarone 300 mg IV push", "Apply a 12-lead ECG to confirm the rhythm", "Turn the client to the recovery position"],
    a: 0,
    r: "Ventricular fibrillation is a pulseless, shockable rhythm. Immediate CPR and defibrillation are the priorities per ACLS/BLS protocols. Amiodarone may be given after initial shocks but is not the first intervention. A 12-lead ECG delays lifesaving treatment. Recovery position is for unconscious breathing clients, not cardiac arrest.",
    s: "Cardiovascular"
  },
  {
    q: "A 72-year-old client with a new permanent pacemaker reports hiccups, chest twitching, and palpitations. The nurse checks the telemetry and notes pacemaker spikes not followed by QRS complexes. Which complication does the nurse suspect?",
    o: ["Failure to capture, where the pacemaker is firing but not stimulating the myocardium", "Normal pacemaker function with expected artifacts", "Electromagnetic interference from the telemetry monitor", "Battery depletion requiring immediate pacemaker replacement"],
    a: 0,
    r: "Pacemaker spikes without subsequent QRS complexes indicate failure to capture, meaning the electrical stimulus is not depolarizing the myocardium. Hiccups and chest twitching may indicate lead displacement stimulating the diaphragm. This requires urgent provider notification. Normal function shows spikes followed by complexes. EMI would cause signal distortion, not consistent spike patterns.",
    s: "Cardiovascular"
  },
  {
    q: "A 55-year-old client develops supraventricular tachycardia (SVT) with a heart rate of 186 bpm. BP is 98/64 and the client is symptomatic with dizziness and chest tightness. The healthcare provider orders vagal manoeuvres. Which intervention should the nurse assist with first?",
    o: ["Instruct the client to bear down as if having a bowel movement (Valsalva manoeuvre)", "Prepare the client for immediate cardioversion", "Administer adenosine 6 mg rapid IV push", "Apply carotid massage bilaterally at the same time"],
    a: 0,
    r: "Vagal manoeuvres (Valsalva) are first-line for stable SVT and increase vagal tone to slow conduction through the AV node. Cardioversion is reserved for unstable or refractory SVT. Adenosine is the next step if vagal manoeuvres fail. Bilateral carotid massage is never performed simultaneously due to risk of cerebral ischemia and is contraindicated in clients with carotid bruits.",
    s: "Cardiovascular"
  },
  {
    q: "A client is on continuous telemetry monitoring. The nurse observes a wide-complex tachycardia at 180 bpm. The client is conscious with a BP of 82/50 and is becoming increasingly confused. Which action is the priority?",
    o: ["Prepare for immediate synchronized cardioversion as ordered", "Administer a bolus of normal saline to increase blood pressure", "Obtain a stat potassium level before any intervention", "Apply vagal manoeuvres to attempt rhythm conversion"],
    a: 0,
    r: "A wide-complex tachycardia with hemodynamic instability (BP 82/50, confusion) is an unstable ventricular tachycardia requiring immediate synchronized cardioversion. IV fluids do not address the rhythm disturbance. Lab work should not delay treatment. Vagal manoeuvres are for supraventricular rhythms, not ventricular tachycardia.",
    s: "Cardiovascular"
  },
  {
    q: "A 80-year-old client's telemetry shows a regular rhythm with a heart rate of 38 bpm. P waves are present before each QRS complex, and the PR interval is 0.28 seconds. BP is 96/58 and the client is drowsy. Which dysrhythmia does the nurse identify?",
    o: ["First-degree AV block with symptomatic sinus bradycardia", "Third-degree (complete) heart block", "Second-degree Type II AV block", "Normal sinus rhythm for an older adult"],
    a: 0,
    r: "A regular rhythm with consistent P waves before each QRS and a prolonged PR interval (greater than 0.20 seconds) with a rate of 38 is consistent with first-degree AV block with sinus bradycardia. Third-degree block shows AV dissociation. Type II has dropped QRS complexes. A rate of 38 is not normal even in older adults and is causing symptoms.",
    s: "Cardiovascular",
    image: imgFirstDegreeBlockExam
  },
  {
    q: "A 68-year-old client with atrial fibrillation is scheduled for an elective cardioversion. The nurse reviews the medication list and notes the client has been taking apixaban for 4 weeks. Which assessment is essential before the procedure?",
    o: ["Verify the client has been compliant with anticoagulation therapy for at least 3 weeks to reduce stroke risk", "Ensure the client stopped all anticoagulants 2 weeks ago", "Confirm the client has been fasting for 24 hours", "Check that the client received prophylactic antibiotics"],
    a: 0,
    r: "Before elective cardioversion for AFib, adequate anticoagulation for at least 3 weeks is required to reduce the risk of thromboembolic stroke. Alternatively, a transesophageal echocardiogram (TEE) can rule out atrial thrombus. Stopping anticoagulants would increase stroke risk. Standard fasting is 6 to 8 hours, not 24. Prophylactic antibiotics are not indicated.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is caring for a client with a temporary transvenous pacemaker. Which safety precaution is most important?",
    o: ["Ensure the pacemaker connections are secure and the insertion site is covered with a dry, sterile dressing", "Allow the client to shower as long as the pacemaker generator is waterproof", "Encourage the client to perform upper body range-of-motion exercises", "Keep the client in a prone position to prevent lead displacement"],
    a: 0,
    r: "Temporary transvenous pacemaker safety includes securing all connections to prevent disconnection, maintaining a sterile dry dressing at the insertion site to prevent infection, and ensuring the generator is protected. Showering risks infection and electrical hazard. Upper body movement may displace the lead. Prone positioning is not recommended and may dislodge the catheter.",
    s: "Cardiovascular"
  },
  {
    q: "A 74-year-old client on telemetry demonstrates a rhythm with progressively lengthening PR intervals followed by a dropped QRS complex, then the cycle repeats. The heart rate is 56 bpm and the client is asymptomatic. Which rhythm does the nurse identify?",
    o: ["Second-degree AV block Type I (Wenckebach)", "Second-degree AV block Type II", "Third-degree (complete) heart block", "Sinus bradycardia with first-degree block"],
    a: 0,
    r: "Progressive PR prolongation followed by a dropped QRS is the hallmark pattern of Second-degree AV block Type I (Wenckebach). This occurs at the level of the AV node and is often benign. Type II has consistent PR intervals with sudden dropped beats. Third-degree shows AV dissociation. Sinus bradycardia with first-degree block has a constant prolonged PR without dropped beats.",
    s: "Cardiovascular"
  },
  {
    q: "A 60-year-old client has an implantable cardioverter-defibrillator (ICD) and reports receiving three shocks within the past hour. The client is anxious but hemodynamically stable with BP 118/72 and HR 84 in normal sinus rhythm. What should the nurse do?",
    o: ["Notify the healthcare provider immediately for urgent device interrogation", "Reassure the client that multiple shocks are a sign the device is working properly", "Apply a magnet over the ICD to deactivate it", "Instruct the client to avoid all movement until evaluated"],
    a: 0,
    r: "Multiple ICD shocks (electrical storm) require urgent provider notification and device interrogation to determine if the shocks were appropriate (treating dangerous rhythms) or inappropriate (device malfunction, lead issues). Simply reassuring the client is inadequate. Magnet application should only occur under provider direction. Complete immobility is not necessary for a stable client.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is monitoring a client after adenosine 6 mg IV rapid push for SVT. The nurse observes a brief period of asystole on the monitor lasting 4 seconds, followed by return of normal sinus rhythm at 78 bpm. The client is alert with BP 116/74. What is the appropriate nursing action?",
    o: ["Document the response as expected and continue monitoring, as transient asystole is a known effect of adenosine", "Initiate CPR immediately for the asystole", "Prepare a second dose of adenosine since the rhythm converted", "Notify the code team of the cardiac arrest"],
    a: 0,
    r: "Brief asystole (3 to 6 seconds) following adenosine is an expected pharmacological effect as the drug transiently blocks AV conduction. The client converted to normal sinus rhythm and is stable, so documentation and monitoring are appropriate. CPR is not indicated since the client has a pulse and is alert. A second dose is not needed since conversion was successful.",
    s: "Cardiovascular"
  },
  {
    q: "A 82-year-old client with a permanent pacemaker set at 60 bpm is found with a heart rate of 42 bpm, BP 78/48, and lethargy. The telemetry shows no pacemaker spikes. Which pacemaker malfunction does the nurse suspect?",
    o: ["Failure to fire (failure to pace), indicating the pacemaker is not generating electrical impulses", "Failure to capture with normal pacing spikes present", "Oversensing causing inappropriate inhibition of pacing", "Normal pacemaker function with an expected heart rate variation"],
    a: 0,
    r: "Absence of pacemaker spikes with a heart rate well below the set rate of 60 bpm indicates failure to fire (the generator is not producing electrical impulses). This could be due to battery depletion, lead fracture, or generator malfunction. Failure to capture would show spikes without QRS. Oversensing would show intermittent inhibition. A rate of 42 with symptoms is not normal variation.",
    s: "Cardiovascular"
  },
  {
    q: "A 70-year-old client is brought to the ED after fainting at home. The ECG shows P waves and QRS complexes occurring independently with no relationship between them. The atrial rate is 80 and the ventricular rate is 34. Which rhythm does the nurse identify?",
    o: ["Third-degree (complete) heart block", "Second-degree Type I AV block", "Atrial flutter with variable conduction", "Sinus bradycardia"],
    a: 0,
    r: "Complete dissociation between P waves and QRS complexes with an atrial rate faster than the ventricular rate is diagnostic of third-degree (complete) heart block. The AV node completely fails to conduct impulses. Type I has progressive PR prolongation. Atrial flutter shows flutter waves. Sinus bradycardia has normal P-QRS relationships with slow rate.",
    s: "Cardiovascular"
  },
  {
    q: "A client is on a continuous amiodarone infusion for recurrent ventricular tachycardia. Which assessment finding should the nurse report immediately?",
    o: ["New onset of dyspnea, non-productive cough, and crackles on auscultation", "Heart rate decrease from 110 to 82 bpm", "Mild nausea after the infusion started", "Slight burning sensation at the IV site"],
    a: 0,
    r: "Dyspnea, cough, and crackles suggest amiodarone pulmonary toxicity, a serious and potentially fatal adverse effect requiring immediate reporting and potential drug discontinuation. Heart rate reduction is the desired therapeutic effect. Mild nausea is common. IV site irritation is expected with amiodarone (it is a vesicant) but less urgent than pulmonary symptoms.",
    s: "Cardiovascular"
  },
  {
    q: "A 77-year-old client with a dual-chamber pacemaker (DDD mode) is scheduled for an MRI. The client asks if it is safe. Which response by the nurse is most appropriate?",
    o: ["Some pacemakers are MRI-conditional. Your cardiologist and radiology team will determine if your specific device is compatible", "MRI is always safe for clients with pacemakers", "Clients with pacemakers can never have an MRI under any circumstances", "The MRI technologist will simply remove the pacemaker before the scan"],
    a: 0,
    r: "MRI compatibility depends on the specific pacemaker model. MRI-conditional devices can safely undergo MRI under specific conditions with programming adjustments. Not all pacemakers are MRI-safe, so blanket safety claims are incorrect. A complete prohibition is outdated. Pacemakers cannot simply be 'removed' for a scan.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is caring for a client receiving IV diltiazem for atrial fibrillation with rapid ventricular response. The client's HR decreases from 148 to 72 bpm, and BP drops to 84/52. The client feels lightheaded. What should the nurse do?",
    o: ["Reduce the diltiazem infusion rate, position the client supine, and notify the healthcare provider", "Increase the diltiazem rate to further control the heart rate", "Administer a second bolus of diltiazem", "Encourage the client to sit upright and take deep breaths"],
    a: 0,
    r: "While the heart rate response is therapeutic, the hypotension (BP 84/52) with symptoms indicates excessive vasodilation. The nurse should reduce the rate, position supine to support BP, and report. Increasing the rate or giving another bolus would worsen hypotension. Sitting upright could further drop BP due to venous pooling.",
    s: "Cardiovascular"
  },
  // ===== DVT/PE (Questions 81-98) =====
  {
    q: "A 58-year-old post-surgical client reports unilateral calf pain, warmth, and swelling in the left leg 3 days after total knee replacement. The calf circumference is 3 cm larger than the right. What should the nurse do first?",
    o: ["Notify the healthcare provider of suspected deep vein thrombosis and keep the client on bed rest", "Massage the affected calf to promote circulation", "Apply a heating pad to the swollen area", "Encourage the client to ambulate vigorously to reduce swelling"],
    a: 0,
    r: "Unilateral calf pain, warmth, and swelling post-surgery are classic signs of DVT. The nurse should immediately notify the provider for diagnostic workup (Doppler ultrasound) and keep the client at rest. Massaging the leg could dislodge a thrombus causing PE. Heat does not treat DVT. Vigorous ambulation risks embolization.",
    s: "Cardiovascular",
    image: imgDVTExam
  },
  {
    q: "A 62-year-old client on enoxaparin for DVT develops extensive bruising on the abdomen and flanks. The nurse also notes a platelet count drop from 210,000 to 88,000/mm3. Which complication should the nurse suspect?",
    o: ["Heparin-induced thrombocytopenia (HIT)", "Normal response to enoxaparin therapy", "Disseminated intravascular coagulation (DIC)", "Immune thrombocytopenic purpura (ITP)"],
    a: 0,
    r: "A platelet drop greater than 50% from baseline during heparin therapy (including LMWH) strongly suggests heparin-induced thrombocytopenia (HIT), a serious immune-mediated reaction. The bruising reflects impaired hemostasis. A drop this significant is not normal. While DIC is possible, the temporal association with heparin points to HIT. ITP is not typically drug-related to heparin.",
    s: "Cardiovascular"
  },
  {
    q: "A 45-year-old client suddenly develops sharp, pleuritic chest pain, tachypnea (RR 32), tachycardia (HR 124), and SpO2 of 86% on room air. The client recently returned from a 12-hour international flight. Which condition does the nurse suspect?",
    o: ["Pulmonary embolism", "Spontaneous pneumothorax", "Acute myocardial infarction", "Panic attack"],
    a: 0,
    r: "Sudden onset pleuritic chest pain, tachypnea, tachycardia, and hypoxemia after prolonged immobility (long flight) are classic for pulmonary embolism. PE is caused by a thrombus (usually from DVT) lodging in the pulmonary vasculature. Pneumothorax would show absent breath sounds. MI typically presents with pressure-type pain. Panic attack would not cause significant hypoxemia (SpO2 86%).",
    s: "Cardiovascular"
  },
  {
    q: "A 70-year-old client is started on warfarin for DVT treatment. The INR today is 1.4 (day 3 of therapy). The client is also receiving enoxaparin injections. Which statement by the nurse best explains why both medications are given simultaneously?",
    o: ["Warfarin takes several days to reach therapeutic levels, so enoxaparin provides immediate anticoagulation during this overlap period", "Both medications work identically and are given together for a stronger effect", "Enoxaparin prevents the side effects of warfarin", "The combination is only used for the first 24 hours until warfarin takes effect"],
    a: 0,
    r: "Warfarin requires 3 to 5 days to achieve therapeutic anticoagulation (INR 2.0 to 3.0) because it depletes clotting factors gradually. Enoxaparin provides immediate anticoagulation through antithrombin III activation, bridging the gap until warfarin is therapeutic. They have different mechanisms. Enoxaparin does not prevent warfarin side effects. The overlap typically lasts 5 to 7 days, not just 24 hours.",
    s: "Cardiovascular"
  },
  {
    q: "A 55-year-old client with confirmed PE is started on a heparin infusion. The aPTT returns at 38 seconds (therapeutic range 60 to 80 seconds). What should the nurse expect?",
    o: ["The heparin dose will need to be increased based on the institutional protocol to achieve therapeutic aPTT", "The aPTT result is therapeutic and no adjustment is needed", "The heparin should be discontinued since it is not working", "Protamine sulfate should be administered for the subtherapeutic level"],
    a: 0,
    r: "An aPTT of 38 seconds is below the therapeutic range (60 to 80), meaning the anticoagulation is insufficient to treat the PE. The heparin dose should be titrated upward per protocol. The level is not therapeutic. Discontinuation would be premature. Protamine is the heparin antidote used for reversal, not for subtherapeutic levels.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is providing discharge teaching to a client prescribed rivaroxaban for long-term DVT treatment. Which instruction is most important to include?",
    o: ["Take rivaroxaban with your evening meal for optimal absorption and do not stop it without consulting your provider", "You will need regular INR monitoring while on rivaroxaban", "Take rivaroxaban on an empty stomach for best results", "It is safe to double your dose if you miss one", "Rivaroxaban requires weekly blood work to adjust dosing"],
    a: 0,
    r: "Rivaroxaban (a DOAC) should be taken with food (specifically with the largest meal) for adequate absorption of doses 15 mg or higher. Abruptly stopping increases clot risk. DOACs do not require routine INR monitoring (that is warfarin). They should not be doubled if missed. Weekly blood work for dose adjustment is not required.",
    s: "Cardiovascular"
  },
  {
    q: "A 68-year-old client with a history of DVT is being fitted for graduated compression stockings. Which statement indicates the client understands proper use?",
    o: ["I will put them on first thing in the morning before getting out of bed", "I should wear them only at night while sleeping", "I can roll the tops down if they feel too tight", "I should remove them only when bathing and leave them off for the rest of the day"],
    a: 0,
    r: "Compression stockings should be applied in the morning before the legs become dependent and edematous. This maximizes their effectiveness in promoting venous return. Wearing only at night misses the daytime benefit. Rolling tops creates a tourniquet effect. They should be worn throughout the day, removed for bathing, and reapplied.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is caring for a client who develops a massive PE. Vital signs: BP 72/40, HR 136, RR 34, SpO2 78%. The client is in acute distress. Which intervention does the nurse anticipate?",
    o: ["Preparation for systemic thrombolytic therapy or surgical embolectomy", "Administration of oral anticoagulants and bed rest", "Application of intermittent pneumatic compression devices", "Gradual mobilization with physical therapy"],
    a: 0,
    r: "Massive PE with hemodynamic collapse (shock) requires aggressive intervention including systemic thrombolytics (alteplase) or surgical embolectomy to restore pulmonary blood flow. Oral anticoagulants act too slowly. Compression devices prevent DVT but do not treat acute PE. Mobilization is inappropriate in hemodynamic shock.",
    s: "Cardiovascular"
  },
  {
    q: "A 52-year-old client on warfarin for PE presents with an INR of 8.2 and gum bleeding. There is no other active bleeding. Which interventions does the nurse anticipate?",
    o: ["Hold warfarin, administer oral vitamin K as ordered, and monitor for further bleeding", "Continue warfarin and monitor the INR in one week", "Administer IV heparin to reverse the warfarin effect", "Apply direct pressure to the gums and discharge the client home"],
    a: 0,
    r: "An INR of 8.2 with minor bleeding (gums) warrants holding warfarin and administering oral vitamin K to reverse the anticoagulation effect gradually. Continued warfarin would worsen the risk. Heparin is an anticoagulant and would not reverse warfarin. Discharge without treatment is unsafe given the critically elevated INR.",
    s: "Cardiovascular"
  },
  {
    q: "A 60-year-old client is being discharged with a diagnosis of DVT. Which instruction should the nurse prioritize in discharge teaching?",
    o: ["Report any sudden shortness of breath, chest pain, or hemoptysis immediately as these could indicate a pulmonary embolism", "Avoid all physical activity for 6 months", "You can stop your anticoagulant once the leg swelling resolves", "Apply ice to the affected leg for 30 minutes every hour"],
    a: 0,
    r: "The most dangerous complication of DVT is pulmonary embolism. Clients must know the warning signs (dyspnea, chest pain, hemoptysis) to seek emergency care immediately. Complete inactivity is not recommended. Anticoagulants must be continued for the prescribed duration regardless of symptom resolution. Ice is not the primary treatment for DVT.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is assessing a 48-year-old client with suspected DVT. The nurse performs a Homans sign test by dorsiflexing the foot, and the client reports calf pain. How should the nurse interpret this finding?",
    o: ["Homans sign is unreliable for diagnosing DVT and a Doppler ultrasound is needed for definitive diagnosis", "A positive Homans sign confirms the diagnosis of DVT", "Homans sign rules out the possibility of DVT if negative", "Calf pain during dorsiflexion is always due to muscle strain, not DVT"],
    a: 0,
    r: "Homans sign has poor sensitivity and specificity for DVT diagnosis and is no longer recommended as a reliable diagnostic tool. It can also be positive with other conditions. Definitive DVT diagnosis requires Doppler ultrasonography. A positive result does not confirm DVT, and a negative result does not exclude it. Calf pain has multiple possible causes.",
    s: "Cardiovascular"
  },
  {
    q: "A 75-year-old client on heparin infusion for PE has aPTT drawn every 6 hours. The most recent aPTT is 95 seconds (therapeutic range 60 to 80 seconds). There is no active bleeding. What should the nurse do?",
    o: ["Reduce the heparin infusion rate according to the hospital protocol and recheck aPTT in 6 hours", "Stop the heparin infusion completely and administer protamine sulfate", "Continue the current rate since the aPTT is close to therapeutic range", "Increase the heparin rate to ensure complete clot resolution"],
    a: 0,
    r: "An aPTT of 95 seconds is above the therapeutic range, increasing bleeding risk. Without active bleeding, the appropriate response is to reduce the rate per protocol and recheck. Complete cessation and protamine are reserved for significant bleeding. The level is not close to range. Increasing the rate would further elevate the aPTT dangerously.",
    s: "Cardiovascular"
  },
  {
    q: "A 42-year-old female client asks about DVT prevention for her upcoming 10-hour flight. She takes oral contraceptives and has a BMI of 32. Which teaching should the nurse provide?",
    o: ["Walk the aisle hourly, do ankle pumps while seated, stay hydrated, and wear compression stockings", "Remain seated for the entire flight to avoid falling in turbulence", "Take an extra dose of oral contraceptive before the flight for protection", "DVT only occurs in hospitalized clients, so no precautions are needed"],
    a: 0,
    r: "This client has multiple DVT risk factors: prolonged immobility, oral contraceptives (which increase clotting risk), and obesity. Prevention includes regular movement, ankle exercises, hydration, and compression stockings. Remaining immobile increases risk. Extra contraceptives do not prevent DVT. DVT can occur in any setting with prolonged immobility.",
    s: "Cardiovascular"
  },
  {
    q: "A client with a confirmed PE has an inferior vena cava (IVC) filter placed. Which statement by the client indicates understanding of the device?",
    o: ["The filter catches blood clots from my legs before they reach my lungs", "The filter dissolves existing blood clots in my lungs", "The filter replaces the need for anticoagulation medication permanently", "The filter prevents all future blood clots from forming"],
    a: 0,
    r: "An IVC filter is a mechanical device placed in the inferior vena cava to trap emboli from the lower extremities before they reach the pulmonary vasculature. It does not dissolve existing clots (that requires thrombolytics). Most clients still require anticoagulation. The filter does not prevent clot formation, only migration.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is caring for a client receiving alteplase (tPA) for massive PE. Which assessment finding requires the nurse to stop the infusion and notify the provider immediately?",
    o: ["Blood-tinged urine and dropping hemoglobin from 128 to 96 g/L", "Mild headache rated 2/10", "Heart rate of 88 bpm", "Temperature of 37.2 degrees Celsius"],
    a: 0,
    r: "Hematuria with a significant hemoglobin drop (128 to 96 g/L) during thrombolytic therapy indicates active internal bleeding, a life-threatening complication requiring immediate cessation of tPA and provider notification. A mild headache, while worth monitoring, is less urgent if stable. HR 88 is normal. Temp 37.2 is within normal range.",
    s: "Cardiovascular"
  },
  {
    q: "A 65-year-old client is diagnosed with a DVT and asks why they need to keep the affected leg elevated. Which response by the nurse is most accurate?",
    o: ["Elevation uses gravity to promote venous return and reduce swelling, which helps decrease the pressure in the affected vein", "Elevation compresses the clot to help it dissolve faster", "Elevation prevents the clot from moving because gravity holds it in place", "Elevation is only for comfort and has no therapeutic benefit"],
    a: 0,
    r: "Leg elevation promotes venous return through gravity, reduces venous stasis and hydrostatic pressure, and decreases edema. It does not compress or dissolve clots. Gravity does not hold clots in place. Elevation has documented therapeutic benefits beyond comfort, including reducing inflammation and promoting circulation.",
    s: "Cardiovascular"
  },
  {
    q: "A 50-year-old client with recurrent DVTs is being evaluated for a hypercoagulable disorder. The nurse understands that which of the following conditions increases the risk for recurrent venous thromboembolism?",
    o: ["Factor V Leiden mutation", "Iron deficiency anemia", "Hypothyroidism", "Vitamin D deficiency"],
    a: 0,
    r: "Factor V Leiden is the most common inherited thrombophilia, causing resistance to activated protein C and increasing clot formation risk. Recurrent DVTs warrant hypercoagulability testing. Iron deficiency anemia, hypothyroidism, and vitamin D deficiency are not primary risk factors for venous thromboembolism.",
    s: "Cardiovascular"
  },
  // ===== PERIPHERAL ARTERIAL DISEASE (Questions 99-116) =====
  {
    q: "A 72-year-old client with peripheral arterial disease (PAD) reports intermittent claudication in both calves when walking more than one block. ABI is 0.6. Which nursing instruction is most appropriate?",
    o: ["Walk regularly to the point of discomfort, rest until pain resolves, then resume walking to promote collateral circulation", "Avoid all walking since it worsens the disease", "Apply heating pads to the legs to improve blood flow", "Elevate the legs above the heart to increase arterial perfusion"],
    a: 0,
    r: "Supervised exercise (walk-rest-walk) is a cornerstone of PAD management. It stimulates collateral circulation development and improves walking distance. Complete inactivity worsens outcomes. Heating pads risk burns on ischemic tissue with impaired sensation. Elevating legs above the heart reduces arterial perfusion, worsening symptoms. Legs should be dependent or neutral.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is assessing a 68-year-old client with suspected PAD. The right foot is cool, pale, and has diminished pedal pulses. Which assessment finding helps distinguish arterial insufficiency from venous insufficiency?",
    o: ["Absence of pedal hair growth and thickened, brittle toenails on the affected foot", "Brown discolouration and stasis dermatitis around the ankle", "Warm, edematous lower extremity with intact pulses", "Varicose veins visible along the medial calf"],
    a: 0,
    r: "Absent hair growth and thick, dystrophic nails are classic signs of chronic arterial insufficiency due to poor perfusion to the skin and appendages. Brown discolouration and stasis dermatitis indicate venous insufficiency. Warm, edematous legs with intact pulses also suggest venous disease. Varicose veins are a venous condition.",
    s: "Cardiovascular"
  },
  {
    q: "A 75-year-old client with PAD has a non-healing ulcer on the tip of the second toe. The ulcer has well-defined edges, minimal drainage, and a pale wound bed. Which characteristic confirms this is an arterial ulcer?",
    o: ["Location on the toe tip with a pale wound bed and well-defined edges", "Location at the medial malleolus with a ruddy wound bed and irregular edges", "Heavy serous drainage with surrounding eczema", "Shallow ulcer over the shin with brownish discolouration"],
    a: 0,
    r: "Arterial ulcers typically occur on distal extremities (toes, feet), have well-defined edges, minimal drainage, and a pale or necrotic wound bed due to inadequate blood supply. Medial malleolus ulcers with ruddy beds are venous. Heavy drainage with eczema is venous. Shin ulcers with brown discolouration suggest venous stasis.",
    s: "Cardiovascular"
  },
  {
    q: "A 70-year-old client with PAD and diabetes has an ABI of 0.4 in the left leg. The client reports resting pain in the left foot that improves when the foot is dangled over the bedside. Which stage of PAD does this represent?",
    o: ["Critical limb ischemia with rest pain, indicating severe disease threatening limb viability", "Mild intermittent claudication that will resolve with exercise", "Acute arterial occlusion requiring emergency surgery", "Normal aging changes in peripheral circulation"],
    a: 0,
    r: "An ABI of 0.4 with rest pain represents critical limb ischemia (CLI), the most severe form of chronic PAD. Rest pain that improves with dependent positioning is classic for CLI. This is not mild claudication. While severe, chronic rest pain differs from acute arterial occlusion (which presents with the 6 Ps). This is pathological, not normal aging.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is performing ankle-brachial index (ABI) testing on a 65-year-old client. The systolic pressure at the right ankle is 88 mmHg and the highest brachial systolic pressure is 140 mmHg. What is the ABI, and what does it indicate?",
    o: ["ABI is 0.63, indicating moderate peripheral arterial disease", "ABI is 1.59, indicating normal arterial flow", "ABI is 0.88, indicating borderline arterial disease", "ABI is 0.45, indicating critical limb ischemia"],
    a: 0,
    r: "ABI is calculated by dividing ankle systolic pressure by brachial systolic pressure: 88/140 = 0.63. An ABI of 0.5 to 0.8 indicates moderate PAD with claudication. Normal ABI is 1.0 to 1.4. The other calculations are mathematically incorrect based on the given values.",
    s: "Cardiovascular"
  },
  {
    q: "A 78-year-old client with severe PAD undergoes a femoral-popliteal bypass graft. Which post-operative assessment finding should the nurse report immediately?",
    o: ["Absent pedal pulses in the operative leg with increasing pain and pallor", "Mild incisional discomfort rated 3/10", "A palpable pedal pulse with warm, pink toes", "Moderate swelling at the surgical incision"],
    a: 0,
    r: "Absent pedal pulses with increasing pain and pallor distal to the graft site indicate graft occlusion or thrombosis, threatening limb viability. This is an emergency requiring immediate intervention. Mild incisional pain is expected. Palpable pedal pulse with warm pink toes indicates successful graft function. Moderate incisional swelling is common post-operatively.",
    s: "Cardiovascular"
  },
  {
    q: "A 66-year-old client with PAD asks why smoking cessation is so important for their condition. Which response by the nurse is most accurate?",
    o: ["Smoking damages the inner lining of arteries, accelerates atherosclerosis, and significantly reduces blood flow to your legs", "Smoking only affects the lungs and has no impact on blood vessel health", "Smoking is a minor risk factor and will not change the progression of your disease", "You only need to reduce smoking by half to see improvement"],
    a: 0,
    r: "Smoking is the single most modifiable risk factor for PAD. Nicotine causes vasoconstriction, damages the endothelium, promotes plaque formation, and accelerates disease progression. It affects all blood vessels, not just pulmonary. It is a major, not minor, risk factor. Complete cessation, not reduction, is recommended for meaningful disease impact.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is performing a neurovascular assessment on a client with acute arterial occlusion of the left leg. Which assessment findings represent the classic '6 Ps' of arterial occlusion?",
    o: ["Pain, pallor, pulselessness, paresthesia, paralysis, and poikilothermia", "Pressure, purpura, pitting edema, pruritis, pulsatile mass, and petechiae", "Pain, puffiness, pigmentation, pulmonary symptoms, palpitations, and perspiration", "Pallor, polycythemia, polyuria, polydipsia, paresthesia, and paralysis"],
    a: 0,
    r: "The 6 Ps of acute arterial occlusion are Pain, Pallor, Pulselessness, Paresthesia (numbness/tingling), Paralysis (inability to move), and Poikilothermia (coolness). These indicate limb-threatening ischemia requiring emergency intervention. The other groupings contain non-arterial symptoms and signs.",
    s: "Cardiovascular"
  },
  {
    q: "A 69-year-old client with PAD and an arterial foot ulcer has a wound care appointment. Which intervention should the nurse question?",
    o: ["Application of compression wraps to the affected lower extremity", "Gentle wound cleansing with normal saline", "Application of a moisture-retentive dressing as ordered", "Assessment of pedal pulses before and after dressing changes"],
    a: 0,
    r: "Compression wraps are contraindicated in arterial disease because they further reduce already compromised arterial blood flow to the extremity, potentially worsening ischemia. Compression is indicated for venous disease. Gentle saline cleansing, moisture-retentive dressings, and pulse assessment are all appropriate for arterial ulcer care.",
    s: "Cardiovascular"
  },
  {
    q: "A 74-year-old client with PAD takes cilostazol. The client asks about the medication's purpose. Which explanation by the nurse is correct?",
    o: ["Cilostazol improves blood flow by dilating blood vessels and reducing platelet clumping, which helps you walk farther without leg pain", "Cilostazol is an antibiotic that prevents infection in your leg ulcers", "Cilostazol thins your blood like warfarin and requires regular INR monitoring", "Cilostazol strengthens the heart muscle to pump blood more effectively to your legs"],
    a: 0,
    r: "Cilostazol is a phosphodiesterase III inhibitor with vasodilatory and antiplatelet properties used to improve walking distance in intermittent claudication. It is not an antibiotic. While it has mild antiplatelet effects, it does not require INR monitoring like warfarin. It does not directly affect cardiac contractility. Note: it is contraindicated in heart failure.",
    s: "Cardiovascular"
  },
  // ===== VALVULAR DISEASE (Questions 117-134) =====
  {
    q: "A 72-year-old client with aortic stenosis reports dizziness, syncope during exertion, and chest pain. Vital signs: BP 104/86 (narrow pulse pressure), HR 72. A systolic crescendo-decrescendo murmur is auscultated at the right sternal border. Which finding is most consistent with severe aortic stenosis?",
    o: ["Exertional syncope with a narrow pulse pressure of 18 mmHg", "Widened pulse pressure with bounding pulses", "An irregularly irregular heart rhythm", "Bilateral lower extremity edema without dyspnea"],
    a: 0,
    r: "Exertional syncope occurs in severe aortic stenosis because the fixed obstruction cannot accommodate increased cardiac output demands during activity. Narrow pulse pressure (systolic minus diastolic less than 30) reflects reduced stroke volume. Widened pulse pressure with bounding pulses suggests aortic regurgitation. Irregular rhythm suggests AFib. Edema alone is nonspecific.",
    s: "Cardiovascular"
  },
  {
    q: "A 68-year-old client with mitral regurgitation is scheduled for valve replacement surgery. The client asks about the difference between mechanical and biological valve prostheses. Which statement by the nurse is accurate?",
    o: ["Mechanical valves last longer but require lifelong anticoagulation with warfarin, while biological valves have a limited lifespan but may not require long-term anticoagulation", "Biological valves require lifelong anticoagulation while mechanical valves do not", "Both types of valves require identical post-operative management", "Mechanical valves are made from pig or cow tissue and biological valves are made from metal"],
    a: 0,
    r: "Mechanical valves are durable (20+ years) but require lifelong warfarin therapy to prevent thrombus formation on the valve surfaces. Biological (tissue) valves from porcine or bovine sources typically last 10 to 15 years and may only need short-term anticoagulation. The descriptions of which requires anticoagulation and which is made from tissue are reversed in the other options.",
    s: "Cardiovascular"
  },
  {
    q: "A 55-year-old client with a mechanical mitral valve prosthesis develops a fever of 38.8 degrees Celsius, new-onset murmur, and petechiae on the conjunctivae. Blood cultures are drawn. Which condition does the nurse suspect?",
    o: ["Prosthetic valve endocarditis", "Normal post-operative valve function", "Warfarin toxicity", "Valve thrombosis without infection"],
    a: 0,
    r: "Fever, new murmur, and petechiae in a client with a prosthetic valve are classic signs of prosthetic valve endocarditis, an infection of the valve surfaces. Blood cultures confirm the causative organism. This is not normal post-operative function. Warfarin toxicity presents with bleeding. Valve thrombosis causes hemodynamic changes but not fever and petechiae.",
    s: "Cardiovascular"
  },
  {
    q: "A 76-year-old client with severe aortic stenosis is scheduled for a transcatheter aortic valve replacement (TAVR). Which advantage of TAVR over traditional open-heart surgery should the nurse explain?",
    o: ["TAVR is a minimally invasive procedure that avoids open-heart surgery and is suitable for clients who are too high-risk for traditional surgery", "TAVR provides a permanent cure and never requires follow-up", "TAVR is performed without any anaesthesia", "TAVR is only available for clients under 60 years of age"],
    a: 0,
    r: "TAVR is a catheter-based procedure that replaces the aortic valve without open-heart surgery or cardiopulmonary bypass. It is specifically designed for high-risk surgical candidates. Follow-up is still required to monitor valve function. Sedation or general anaesthesia is used. TAVR is primarily used in older, high-risk adults, not restricted to under-60 clients.",
    s: "Cardiovascular"
  },
  {
    q: "A 62-year-old client with mitral valve prolapse (MVP) asks the nurse if they need antibiotic prophylaxis before dental procedures. Which response is most current and accurate?",
    o: ["Current guidelines generally do not recommend antibiotic prophylaxis for MVP alone. Discuss your specific situation with your cardiologist", "All clients with any valve disorder require antibiotics before dental work", "Antibiotic prophylaxis is only needed after age 75", "You should take prophylactic antibiotics for all medical appointments, not just dental procedures"],
    a: 0,
    r: "Current guidelines (Canadian and AHA) do not recommend endocarditis prophylaxis for MVP unless there is associated regurgitation with valve thickening in high-risk scenarios. Prophylaxis is reserved for prosthetic valves, previous endocarditis, certain congenital heart diseases, and cardiac transplant recipients. The recommendation should be individualized by the cardiologist.",
    s: "Cardiovascular"
  },
  {
    q: "A 70-year-old client with aortic regurgitation has a widened pulse pressure (BP 158/52), bounding pulses, and reports exertional dyspnea. Which pathophysiological mechanism explains the widened pulse pressure?",
    o: ["Blood flows back into the left ventricle during diastole, lowering diastolic pressure while the ventricle compensates with increased stroke volume, raising systolic pressure", "The aortic valve is too narrow, preventing adequate blood flow forward", "The right ventricle is failing, causing pulmonary congestion", "Coronary artery disease is blocking blood flow to the myocardium"],
    a: 0,
    r: "In aortic regurgitation, the incompetent valve allows blood to flow back into the left ventricle during diastole, reducing diastolic pressure. The ventricle compensates by increasing stroke volume (Frank-Starling mechanism), raising systolic pressure. This creates a widened pulse pressure with bounding pulses. Narrowing describes stenosis, not regurgitation. Right ventricular failure and CAD have different mechanisms.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is auscultating heart sounds on a 65-year-old client and hears a low-pitched rumbling murmur at the apex during diastole. Which valve disorder does this murmur suggest?",
    o: ["Mitral stenosis", "Aortic stenosis", "Mitral regurgitation", "Tricuspid regurgitation"],
    a: 0,
    r: "A low-pitched rumbling diastolic murmur best heard at the apex (mitral area) is characteristic of mitral stenosis. The narrowed mitral valve creates turbulent flow during ventricular filling. Aortic stenosis produces a systolic murmur at the right sternal border. Mitral regurgitation is a systolic murmur at the apex. Tricuspid regurgitation is systolic at the left lower sternal border.",
    s: "Cardiovascular"
  },
  {
    q: "A 60-year-old client with rheumatic mitral stenosis develops atrial fibrillation. The nurse understands that this client is at increased risk for which complication?",
    o: ["Systemic thromboembolism and stroke due to blood stasis in the enlarged left atrium", "Spontaneous resolution of the mitral stenosis", "Improved cardiac output from the irregular rhythm", "Decreased risk of pulmonary congestion"],
    a: 0,
    r: "Mitral stenosis causes left atrial enlargement due to pressure overload. When AFib develops, the atrium loses effective contraction, allowing blood stasis and thrombus formation in the enlarged chamber. These thrombi can embolize systemically, particularly to the brain causing stroke. AFib does not resolve stenosis, does not improve cardiac output, and worsens pulmonary congestion.",
    s: "Cardiovascular"
  },
  {
    q: "A client with a newly implanted mechanical heart valve is being discharged on warfarin. Which statement indicates the client needs additional teaching?",
    o: ["I can stop taking warfarin once I feel better and my incision heals", "I need to have regular INR blood tests to make sure my medication level is correct", "I should wear a medical alert bracelet indicating I am on anticoagulation therapy", "I will use a soft-bristle toothbrush to reduce the risk of gum bleeding"],
    a: 0,
    r: "Clients with mechanical heart valves require lifelong warfarin therapy to prevent thrombus formation on the valve surfaces. Stopping the medication, even when feeling well, risks life-threatening valve thrombosis and stroke. Regular INR monitoring, medical alert identification, and soft-bristle toothbrushes all demonstrate correct understanding.",
    s: "Cardiovascular"
  },
  // ===== CARDIOGENIC SHOCK (Questions 135-150) =====
  {
    q: "A 64-year-old client develops cardiogenic shock 6 hours after an anterior wall STEMI. Vital signs: BP 74/48, HR 128, RR 30, SpO2 84%, urine output 10 mL/hour. The nurse understands that the primary mechanism of cardiogenic shock is which of the following?",
    o: ["Severe left ventricular pump failure leading to inadequate cardiac output and tissue perfusion", "Massive vasodilation from sepsis causing distributive shock", "Severe blood loss from gastrointestinal hemorrhage", "Obstruction of blood flow through the pericardium"],
    a: 0,
    r: "Cardiogenic shock results from massive left ventricular dysfunction (typically greater than 40% of myocardium damaged) causing critically low cardiac output and inadequate systemic perfusion. The anterior wall MI has caused pump failure. Vasodilation describes septic shock. Blood loss is hypovolemic shock. Pericardial obstruction is obstructive shock (tamponade).",
    s: "Cardiovascular"
  },
  {
    q: "A client in cardiogenic shock is started on a dopamine infusion at 10 mcg/kg/min. Which hemodynamic changes should the nurse expect if the medication is effective?",
    o: ["Increased blood pressure, increased urine output, and improved peripheral perfusion", "Decreased heart rate and decreased blood pressure", "Significant vasodilation and warmth to all extremities", "No change in hemodynamics for the first 24 hours"],
    a: 0,
    r: "At moderate to high doses (5 to 20 mcg/kg/min), dopamine stimulates beta-1 receptors (increasing cardiac contractility and output) and alpha receptors (vasoconstriction). Effective response includes improved BP, increased urine output from better renal perfusion, and improved peripheral perfusion. Decreased BP would indicate treatment failure. Vasodilation occurs only at low doses (1 to 3 mcg/kg/min).",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is caring for a client in cardiogenic shock with an intra-aortic balloon pump (IABP). The nurse notes the IABP has stopped cycling. The client's BP drops to 68/40. What is the nurse's immediate action?",
    o: ["Notify the healthcare provider and the IABP technician immediately while assessing the client", "Attempt to manually restart the IABP by pressing the power button", "Remove the IABP catheter to prevent further complications", "Elevate the head of bed to high Fowler's position"],
    a: 0,
    r: "IABP failure in a client who is dependent on the device for hemodynamic support is a critical emergency. The nurse should immediately notify the provider and IABP technician while continuously assessing the client. Attempting to restart the device independently risks incorrect timing or malfunction. Removing the catheter would eliminate mechanical support. High Fowler's could worsen hypotension.",
    s: "Cardiovascular"
  },
  {
    q: "A 58-year-old client in cardiogenic shock has a pulmonary artery catheter. Hemodynamic readings show: CI 1.6 L/min/m2, PCWP 28 mmHg, SVR 2,200 dynes. Which interpretation is accurate?",
    o: ["Low cardiac index with elevated filling pressures and high afterload, confirming cardiogenic shock", "Normal hemodynamic parameters for a post-MI client", "Findings consistent with hypovolemic shock requiring fluid resuscitation", "Elevated cardiac index with low filling pressures indicating distributive shock"],
    a: 0,
    r: "CI below 2.2 (indicating low cardiac output), PCWP above 18 (indicating elevated left-sided filling pressures/pulmonary congestion), and elevated SVR (compensatory vasoconstriction) are the hemodynamic hallmarks of cardiogenic shock. These are not normal. Hypovolemic shock would show low PCWP. Distributive shock would show low SVR with normal or high CI.",
    s: "Cardiovascular"
  },
  {
    q: "A client in cardiogenic shock is receiving norepinephrine and dobutamine infusions. The nurse notes the client's fingers are becoming mottled and the toes are dusky. What does this assessment suggest?",
    o: ["Worsening peripheral vasoconstriction from vasopressor therapy and inadequate tissue perfusion", "Normal side effects of dobutamine that do not require intervention", "Allergic reaction to norepinephrine", "Improvement in cardiac output with blood being redirected to vital organs"],
    a: 0,
    r: "Mottling and dusky extremities indicate severe peripheral vasoconstriction and inadequate tissue perfusion. While vasopressors support central blood pressure, excessive vasoconstriction can cause ischemic damage to extremities. This finding should be reported for dose adjustment. It is not normal or a sign of improvement. True allergic reactions present differently.",
    s: "Cardiovascular"
  },
  {
    q: "A 70-year-old client is being assessed for cardiogenic shock. Which hemodynamic finding differentiates cardiogenic shock from hypovolemic shock?",
    o: ["Elevated pulmonary capillary wedge pressure (PCWP) in cardiogenic shock versus low PCWP in hypovolemic shock", "Low blood pressure in cardiogenic shock versus high blood pressure in hypovolemic shock", "Normal heart rate in cardiogenic shock versus bradycardia in hypovolemic shock", "Warm extremities in cardiogenic shock versus cool extremities in hypovolemic shock"],
    a: 0,
    r: "PCWP is the key differentiating parameter. In cardiogenic shock, the failing heart cannot eject blood forward, so pressure backs up into the pulmonary vasculature, elevating PCWP (above 18 mmHg). In hypovolemic shock, low circulating volume results in low PCWP. Both present with hypotension, tachycardia, and cool extremities.",
    s: "Cardiovascular"
  },
  {
    q: "A client in cardiogenic shock has been on mechanical ventilation for 48 hours. The nurse notices new coffee-ground aspirate from the nasogastric tube. What does this finding suggest, and what should the nurse do?",
    o: ["Stress-related gastrointestinal bleeding (Curling/stress ulcer), and the nurse should notify the provider immediately", "Normal gastric secretions expected during critical illness", "An indication that the client is improving and can begin oral feeds", "A sign that the nasogastric tube needs to be replaced"],
    a: 0,
    r: "Coffee-ground aspirate indicates upper GI bleeding (digested blood), which is a serious complication in critically ill clients due to stress ulceration. The nurse must report immediately for possible endoscopy, blood transfusion, and initiation of proton pump inhibitor therapy. This is not normal, does not indicate improvement, and is not related to tube malfunction.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is monitoring urine output for a client in cardiogenic shock. The output for the last hour is 12 mL. Which nursing action is most appropriate?",
    o: ["Report the oliguria to the healthcare provider as it indicates inadequate renal perfusion", "Flush the urinary catheter to ensure it is patent", "Encourage the client to drink more fluids", "Document the finding and recheck in 4 hours"],
    a: 0,
    r: "Urine output below 30 mL/hour (or 0.5 mL/kg/hr) in an adult indicates inadequate renal perfusion, a critical marker of organ hypoperfusion in cardiogenic shock. The provider needs to adjust vasoactive medications or consider additional interventions. While catheter patency should be verified, reporting is the priority. Increasing fluids could worsen pulmonary edema. Waiting 4 hours delays critical intervention.",
    s: "Cardiovascular"
  },
  {
    q: "A 62-year-old client in cardiogenic shock has cold, clammy skin, altered mental status, and BP 70/42. The client has a dobutamine infusion at maximum dose. The healthcare provider is considering adding milrinone. Which mechanism of milrinone makes it useful in this situation?",
    o: ["Milrinone is a phosphodiesterase inhibitor that increases cardiac contractility and causes vasodilation, reducing afterload", "Milrinone is a pure vasoconstrictor that increases blood pressure without affecting the heart", "Milrinone is a beta-blocker that slows heart rate and reduces myocardial oxygen demand", "Milrinone is an anticoagulant that prevents thrombus formation in the failing ventricle"],
    a: 0,
    r: "Milrinone is a phosphodiesterase III inhibitor (inodilator) that increases intracellular cAMP, enhancing contractility (positive inotropy) and causing systemic vasodilation (reducing afterload). This dual effect improves cardiac output. It is not a vasoconstrictor, beta-blocker, or anticoagulant. Its use in refractory cardiogenic shock adds benefit through a different mechanism than dobutamine.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is caring for a client with an IABP for cardiogenic shock. Which assessment finding indicates proper IABP function?",
    o: ["The balloon inflates during diastole and deflates just before systole, with augmented diastolic pressure on the arterial waveform", "The balloon inflates during systole to assist ventricular ejection", "The client reports leg numbness on the side of catheter insertion", "The arterial waveform shows no difference between augmented and unaugmented beats"],
    a: 0,
    r: "Proper IABP timing shows inflation during diastole (augmenting coronary and systemic perfusion by displacing blood retrograde in the aorta) and deflation before systole (reducing afterload). The augmented diastolic pressure should be visible on the arterial waveform. Systolic inflation would impede ejection. Leg numbness suggests ischemia. No waveform change suggests malfunction.",
    s: "Cardiovascular"
  },
  {
    q: "A 66-year-old client recovering from cardiogenic shock shows improving hemodynamics. CI has increased from 1.6 to 2.4, PCWP decreased from 28 to 16, and urine output is now 45 mL/hour. The nurse is weaning vasopressors. Which parameter should the nurse monitor most closely during the weaning process?",
    o: ["Mean arterial pressure (MAP) to ensure it remains above 65 mmHg during dose reduction", "Daily weight to monitor for fluid overload", "Serum glucose levels for stress hyperglycemia", "White blood cell count for signs of infection"],
    a: 0,
    r: "During vasopressor weaning, maintaining adequate MAP (above 65 mmHg) is critical to ensure organ perfusion. If MAP drops below threshold during dose reduction, the weaning is too rapid. While weight, glucose, and WBC are important in critical care, MAP is the most immediate concern during active vasopressor titration.",
    s: "Cardiovascular"
  },
  // ===== ENDOCARDITIS/PERICARDITIS (Questions 151-168) =====
  {
    q: "A 42-year-old client with a history of IV drug use presents with fever of 39.2 degrees Celsius, new-onset heart murmur, and splinter hemorrhages under the fingernails. The nurse suspects infective endocarditis. Which assessment finding further supports this diagnosis?",
    o: ["Janeway lesions (painless erythematous lesions on the palms) and positive blood cultures", "Clear lung sounds with normal SpO2", "Absence of any joint pain or swelling", "Normal white blood cell count with no fever pattern"],
    a: 0,
    r: "Janeway lesions are painless erythematous macules on palms/soles caused by septic emboli, a hallmark of infective endocarditis along with positive blood cultures (Duke criteria). The combination with fever, new murmur, and splinter hemorrhages strongly supports the diagnosis. Clear lungs and normal WBC would be inconsistent. Joint pain (from immune complexes) would further support the diagnosis.",
    s: "Cardiovascular"
  },
  {
    q: "A 38-year-old client is admitted with acute pericarditis. The client reports sharp, stabbing chest pain that worsens with inspiration and lying flat but improves when leaning forward. Which assessment finding confirms the diagnosis?",
    o: ["A pericardial friction rub heard on auscultation", "ST depression in all leads on the ECG", "Elevated troponin I of 15 ng/mL", "Absent breath sounds on the left side"],
    a: 0,
    r: "A pericardial friction rub (a scratchy, high-pitched sound) is the hallmark auscultatory finding of pericarditis, caused by inflamed pericardial layers rubbing together. Pericarditis shows diffuse ST elevation (not depression). While mild troponin elevation can occur (myopericarditis), 15 ng/mL suggests MI. Absent breath sounds suggest pneumothorax or effusion.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is caring for a client with infective endocarditis receiving IV vancomycin. The vancomycin trough level returns at 28 mcg/mL (therapeutic range 15 to 20 mcg/mL). Which action should the nurse take?",
    o: ["Hold the next vancomycin dose and notify the healthcare provider of the supratherapeutic trough level", "Administer the next dose as scheduled since the level is close to range", "Increase the vancomycin dose to achieve faster bacterial clearance", "Discontinue vancomycin permanently and switch to oral antibiotics"],
    a: 0,
    r: "A trough of 28 mcg/mL exceeds the therapeutic range (15 to 20) and increases the risk of nephrotoxicity and ototoxicity. The nurse should hold the dose and notify the provider for dose adjustment. The level is significantly above range, not close. Increasing the dose would worsen toxicity. Switching to oral antibiotics is a provider decision and IV therapy is preferred for endocarditis.",
    s: "Cardiovascular"
  },
  {
    q: "A 50-year-old client with pericarditis develops sudden hypotension (BP 78/52), muffled heart sounds, and JVD. HR is 124 bpm. Which complication does the nurse suspect?",
    o: ["Cardiac tamponade from pericardial effusion compressing the heart", "Acute myocardial infarction", "Tension pneumothorax", "Aortic dissection"],
    a: 0,
    r: "The triad of hypotension, muffled (distant) heart sounds, and JVD is Beck's triad, the classic presentation of cardiac tamponade. Pericardial fluid accumulation compresses the heart, preventing adequate filling. MI presents differently. Tension pneumothorax shows tracheal deviation and absent breath sounds. Aortic dissection presents with tearing chest/back pain.",
    s: "Cardiovascular"
  },
  {
    q: "A client with suspected cardiac tamponade is being assessed. The nurse measures blood pressure during inspiration and expiration. Systolic BP drops from 128 mmHg during expiration to 108 mmHg during inspiration. Which finding does this represent?",
    o: ["Pulsus paradoxus greater than 10 mmHg, which supports the diagnosis of cardiac tamponade", "Normal respiratory variation in blood pressure", "Orthostatic hypotension requiring further assessment", "Widened pulse pressure indicating aortic regurgitation"],
    a: 0,
    r: "A systolic BP drop of 20 mmHg during inspiration (128 to 108) represents pulsus paradoxus (greater than 10 mmHg variation). This occurs in tamponade because inspiration increases right ventricular volume, further compressing the already compromised left ventricle. Normal respiratory variation is less than 10 mmHg. This is not orthostatic hypotension or widened pulse pressure.",
    s: "Cardiovascular"
  },
  {
    q: "A 45-year-old client with infective endocarditis suddenly develops right-sided weakness, facial droop, and slurred speech. What does the nurse suspect, and what is the priority action?",
    o: ["Embolic stroke from vegetation dislodgement, and the nurse should activate the stroke protocol immediately", "A migraine headache that will resolve with rest and analgesics", "A medication side effect from antibiotics", "Anxiety-related symptoms that require emotional support"],
    a: 0,
    r: "In endocarditis, vegetations on the valve can break off and embolize to the brain causing ischemic stroke. Right-sided weakness, facial droop, and slurred speech are classic stroke symptoms (FAST criteria). Immediate stroke protocol activation is critical for time-sensitive treatment. These findings are not migraines, medication effects, or anxiety.",
    s: "Cardiovascular"
  },
  {
    q: "A 35-year-old client is diagnosed with viral pericarditis. The healthcare provider prescribes colchicine and ibuprofen. Which statement by the nurse best explains the treatment rationale?",
    o: ["These anti-inflammatory medications reduce pericardial inflammation and pain, and colchicine helps prevent recurrence", "Antibiotics are the primary treatment for viral pericarditis", "Colchicine is a blood thinner that prevents clot formation", "Ibuprofen is used to lower the client's heart rate"],
    a: 0,
    r: "Viral pericarditis is treated with NSAIDs (ibuprofen) for inflammation and pain, combined with colchicine which reduces recurrence rates from approximately 30% to less than 15%. Antibiotics treat bacterial, not viral, infections. Colchicine is anti-inflammatory, not an anticoagulant. Ibuprofen does not lower heart rate.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is preparing to discharge a client who completed 6 weeks of IV antibiotic therapy for infective endocarditis. Which discharge instruction is most important?",
    o: ["Maintain excellent oral hygiene and inform all healthcare providers about your history of endocarditis before any invasive procedures", "You no longer need to worry about endocarditis since you have been cured", "Avoid all dental care for the next 5 years", "Resume IV drug use carefully with sterile needles to prevent recurrence"],
    a: 0,
    r: "Clients with a history of endocarditis are at increased risk for recurrence and require antibiotic prophylaxis before certain invasive procedures (dental, respiratory). Good oral hygiene reduces bacteremia risk. Previous endocarditis does not guarantee immunity. Avoiding all dental care increases oral infection risk. IV drug use is the primary risk factor and cessation is essential.",
    s: "Cardiovascular"
  },
  {
    q: "A client with pericarditis is placed on a cardiac monitor. The nurse reviews the 12-lead ECG. Which ECG change is most characteristic of acute pericarditis?",
    o: ["Diffuse ST elevation in most leads with PR depression", "ST elevation in contiguous leads with reciprocal changes", "Pathological Q waves in anterior leads", "Tall, peaked T waves in precordial leads"],
    a: 0,
    r: "Acute pericarditis shows diffuse (widespread, non-territorial) ST elevation with PR segment depression, reflecting inflammation of the entire pericardium. ST elevation in contiguous leads with reciprocal changes is MI. Pathological Q waves indicate completed MI. Tall peaked T waves suggest hyperkalemia.",
    s: "Cardiovascular"
  },
  {
    q: "A 48-year-old client with endocarditis is on gentamicin and vancomycin IV therapy. Which laboratory test should the nurse monitor to detect nephrotoxicity from this combination?",
    o: ["Serum creatinine and BUN", "Complete blood count with differential", "Prothrombin time and INR", "Serum glucose and hemoglobin A1C"],
    a: 0,
    r: "Both gentamicin and vancomycin are nephrotoxic, and their combination significantly increases the risk of acute kidney injury. Serum creatinine and BUN are the primary markers for renal function monitoring. CBC monitors for bone marrow suppression. PT/INR monitors coagulation. Glucose and A1C are for diabetes management.",
    s: "Cardiovascular"
  },
  // ===== AORTIC ANEURYSM (Questions 169-184) =====
  {
    q: "A 74-year-old male client with a known 5.8 cm abdominal aortic aneurysm (AAA) presents with sudden, severe, tearing abdominal pain radiating to the back. BP is 78/42 and HR is 132. The abdomen is rigid and distended. What does the nurse suspect?",
    o: ["Ruptured abdominal aortic aneurysm, a life-threatening surgical emergency", "Acute appendicitis requiring antibiotics", "Stable AAA requiring routine monitoring", "Acute pancreatitis from alcohol use"],
    a: 0,
    r: "Sudden severe abdominal/back pain with hemodynamic instability (BP 78/42, HR 132) and abdominal rigidity in a client with known large AAA strongly suggests rupture. This is a surgical emergency with high mortality. Appendicitis does not typically cause this hemodynamic picture. A 5.8 cm aneurysm with these symptoms is not stable. Pancreatitis presents differently.",
    s: "Cardiovascular"
  },
  {
    q: "A 68-year-old client is diagnosed with a 4.2 cm AAA found incidentally on CT scan. The client is asymptomatic. Which management plan should the nurse discuss with the client?",
    o: ["Regular surveillance imaging every 6 to 12 months to monitor for growth, along with blood pressure and lipid management", "Immediate surgical repair since any aneurysm is life-threatening", "No follow-up is needed since the aneurysm is small", "The client should be placed on strict bed rest indefinitely"],
    a: 0,
    r: "AAA below 5.5 cm in diameter is typically managed with surveillance imaging (CT or ultrasound) every 6 to 12 months, along with cardiovascular risk factor modification (BP control, statins, smoking cessation). Surgery is usually recommended at 5.5 cm or larger, or if growth exceeds 0.5 cm per 6 months. No follow-up is dangerous. Bed rest is not indicated.",
    s: "Cardiovascular"
  },
  {
    q: "A 72-year-old client is post-operative day 1 after open AAA repair. The nurse notes the client has not had a bowel movement and the abdomen is distended with absent bowel sounds. Which complication should the nurse suspect?",
    o: ["Post-operative ileus from bowel manipulation during surgery", "Bowel obstruction from adhesions", "Ruptured anastomosis requiring emergency surgery", "Normal post-operative recovery requiring no intervention"],
    a: 0,
    r: "Post-operative ileus is common after open AAA repair due to surgical manipulation of abdominal contents and cross-clamping of the aorta, which temporarily reduces mesenteric blood flow. Absent bowel sounds, distension, and no bowel movement on day 1 are consistent with ileus. Adhesive obstruction is unlikely this early. Ruptured anastomosis would present with peritonitis and hemodynamic changes.",
    s: "Cardiovascular"
  },
  {
    q: "A 65-year-old client undergoes endovascular aortic aneurysm repair (EVAR). Which post-procedure nursing assessment is essential?",
    o: ["Assess bilateral pedal pulses, groin access sites, and renal function (urine output and creatinine) regularly", "Assess for return of bowel sounds, as ileus is the primary complication", "Check pupillary reflexes every 15 minutes for signs of cerebral embolism", "Monitor the client for signs of malignant hyperthermia"],
    a: 0,
    r: "After EVAR, key assessments include pedal pulses (to detect limb ischemia from graft migration or embolism), groin sites (for bleeding/hematoma at the femoral access point), and renal function (contrast nephropathy). Ileus is more common after open repair. Pupillary checks are not the primary focus. Malignant hyperthermia is an anaesthesia complication and not specific to EVAR.",
    s: "Cardiovascular"
  },
  {
    q: "A 60-year-old client presents with sudden, severe, tearing chest pain radiating to the back between the shoulder blades. BP in the right arm is 184/102 and in the left arm is 148/88. HR is 108. Which condition does the nurse suspect?",
    o: ["Aortic dissection, indicated by the tearing pain and significant blood pressure differential between arms", "Acute STEMI with typical anginal pain", "Stable angina from exertion", "Musculoskeletal chest pain from poor posture"],
    a: 0,
    r: "Sudden tearing chest/back pain with a BP differential greater than 20 mmHg between arms is classic for aortic dissection. The dissection flap can occlude branch arteries, creating unequal pressures. STEMI typically presents with pressure or squeezing pain. Stable angina is predictable with exertion. Musculoskeletal pain does not cause BP differences between arms.",
    s: "Cardiovascular"
  },
  {
    q: "A client with a suspected thoracic aortic dissection is in the emergency department. BP is 192/114. Which medication class should the nurse anticipate administering first?",
    o: ["IV beta-blocker to reduce heart rate and the force of ventricular contraction, thereby limiting extension of the dissection", "IV vasodilators alone to aggressively lower blood pressure", "Thrombolytics to dissolve any clot in the aorta", "Oral ACE inhibitors for gradual blood pressure reduction"],
    a: 0,
    r: "IV beta-blockers (esmolol, labetalol) are first-line because they reduce both heart rate and aortic wall shear stress (dp/dt). Vasodilators alone (without rate control) can cause reflex tachycardia, increasing shear stress on the aortic wall. Thrombolytics are absolutely contraindicated as they could worsen hemorrhage. Oral medications act too slowly for this emergency.",
    s: "Cardiovascular"
  },
  {
    q: "A 70-year-old client with a known thoracic aortic aneurysm asks about activities to avoid. Which instruction is most important?",
    o: ["Avoid heavy lifting, straining, and any activity that causes sudden increases in blood pressure", "Light walking is the only exercise you can perform", "You should remain on complete bed rest until surgical repair", "Vigorous exercise is encouraged to strengthen the aortic wall"],
    a: 0,
    r: "Activities causing sudden BP surges (heavy lifting, Valsalva manoeuvre, straining) increase aortic wall stress and risk of rupture or dissection. Moderate activity (walking) is generally permitted. Complete bed rest is not necessary for stable aneurysms. Vigorous exercise increases rupture risk and does not strengthen the weakened aortic wall.",
    s: "Cardiovascular"
  },
  {
    q: "A 75-year-old male client with atherosclerosis, hypertension, and a smoking history asks about his risk for AAA. Which response by the nurse is most accurate?",
    o: ["You have several major risk factors for AAA including being male, over 65, with a history of smoking, hypertension, and atherosclerosis", "AAA occurs equally in men and women with no identifiable risk factors", "Only clients with a family history of AAA are at risk", "Your age makes you too old to develop an aneurysm"],
    a: 0,
    r: "Major risk factors for AAA include male sex (4 to 6 times more common than in females), age over 65, smoking history (strongest modifiable risk factor), hypertension, and atherosclerosis. This client has all major risk factors. AAA is much more common in males. Family history increases risk but is not the only factor. Age does not provide immunity.",
    s: "Cardiovascular"
  },
  // ===== CARDIAC CATHETERIZATION CARE (Questions 185-200) =====
  {
    q: "A 62-year-old client is scheduled for a cardiac catheterization via the right femoral artery. Before the procedure, the nurse reviews the chart and notes a creatinine of 2.4 mg/dL and an allergy to shellfish. Which concern should the nurse communicate to the healthcare provider?",
    o: ["The elevated creatinine increases the risk of contrast-induced nephropathy, and the shellfish allergy may warrant premedication for iodine-based contrast sensitivity", "Shellfish allergy is irrelevant to cardiac catheterization", "The creatinine level is within normal limits and requires no action", "Cardiac catheterization is contraindicated in all clients with shellfish allergies"],
    a: 0,
    r: "Elevated creatinine (normal 0.6 to 1.2 mg/dL) indicates impaired renal function, increasing the risk of contrast-induced nephropathy. While shellfish allergy does not directly predict contrast allergy, it may prompt premedication with corticosteroids and antihistamines as a precaution. These findings should be communicated to the provider. The procedure is not absolutely contraindicated but requires precautions.",
    s: "Cardiovascular"
  },
  {
    q: "A client returns from cardiac catheterization via the right femoral artery. The nurse's post-procedure care includes which priority intervention?",
    o: ["Keep the right leg extended and immobilized, and assess the distal pulse, colour, temperature, and sensation every 15 minutes", "Encourage the client to flex the right hip to prevent stiffness", "Allow the client to ambulate immediately to prevent DVT", "Position the client on the right side to apply pressure to the groin"],
    a: 0,
    r: "After femoral artery catheterization, the affected leg must remain extended and immobilized (typically 4 to 6 hours) to prevent bleeding from the puncture site. Frequent neurovascular checks (pulse, colour, temperature, sensation, capillary refill) detect complications. Hip flexion risks dislodging the hemostatic clot. Immediate ambulation risks hemorrhage. Side-lying could compromise the site.",
    s: "Cardiovascular"
  },
  {
    q: "A client is 2 hours post-cardiac catheterization via the femoral artery. The nurse notes a large hematoma at the groin site with ecchymosis extending to the thigh. BP is 96/60 and HR is 118. What should the nurse do immediately?",
    o: ["Apply firm manual pressure above the puncture site and call for emergency assistance", "Apply an ice pack to the hematoma and continue monitoring", "Elevate the affected leg above heart level", "Ask the client to apply pressure themselves while the nurse calls the provider"],
    a: 0,
    r: "An expanding hematoma with hemodynamic instability (hypotension, tachycardia) indicates significant arterial bleeding from the catheterization site. Immediate manual pressure proximal to the puncture site and calling for help are priorities. Ice alone is insufficient. Elevating the leg does not control arterial bleeding. The client cannot provide adequate pressure, and the nurse should not leave.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is preparing a client for cardiac catheterization. The client takes metformin for type 2 diabetes. Which instruction regarding metformin is most important?",
    o: ["Metformin should be held for 48 hours after the procedure due to the risk of lactic acidosis from contrast dye interaction with impaired renal function", "Metformin should be taken with a full meal immediately before the procedure", "Metformin has no interaction with contrast dye and can be continued without change", "Metformin should be doubled on the day of the procedure to prevent hyperglycemia"],
    a: 0,
    r: "Metformin must be withheld for 48 hours after contrast dye administration because contrast can impair renal function, and metformin is renally excreted. Impaired clearance of metformin can cause life-threatening lactic acidosis. The medication should not be taken before (fasting) or during this period. There is a significant interaction. Doubling the dose is dangerous.",
    s: "Cardiovascular"
  },
  {
    q: "A client who underwent cardiac catheterization via the radial artery has a TR Band (compression device) in place. The nurse notices the client's fingers are tingling and the hand appears pale. What should the nurse do?",
    o: ["Loosen the TR Band slightly and reassess distal perfusion", "Tighten the TR Band further to ensure hemostasis", "Remove the TR Band completely", "Reassure the client that tingling is expected and no action is needed"],
    a: 0,
    r: "Tingling and pallor distal to the compression device indicate the TR Band is too tight, compromising arterial and venous flow. Loosening slightly should restore perfusion while maintaining hemostasis. Tightening further would worsen ischemia. Complete removal risks bleeding. Tingling with pallor is not expected and indicates compromised circulation.",
    s: "Cardiovascular"
  },
  {
    q: "A 58-year-old client reports feeling a warm, flushing sensation and nausea during contrast dye injection for cardiac catheterization. Which response by the nurse is most appropriate?",
    o: ["Reassure the client that warmth and flushing are common expected reactions to contrast dye and will pass quickly", "Stop the procedure immediately as this indicates a severe allergic reaction", "Administer epinephrine 0.3 mg IM for anaphylaxis", "Instruct the client to hold their breath until the sensation passes"],
    a: 0,
    r: "Warmth, flushing, and mild nausea are common non-allergic reactions to iodinated contrast dye and are typically transient. These are expected and do not require intervention. A severe allergic reaction would present with urticaria, bronchospasm, hypotension, or angioedema. Epinephrine is reserved for true anaphylaxis. Holding breath is unnecessary and could be harmful.",
    s: "Cardiovascular"
  },
  {
    q: "A client is 4 hours post-cardiac catheterization via the femoral artery. The nurse assesses that the right pedal pulse is weaker than baseline and the right foot is cooler than the left. Which complication does the nurse suspect?",
    o: ["Arterial thrombosis or embolism distal to the catheterization site", "Normal variation in pedal pulses after catheterization", "Venous insufficiency of the right leg", "Lymphedema from lymph node damage during the procedure"],
    a: 0,
    r: "Diminished pedal pulse with cool temperature distal to the femoral access site suggests arterial compromise from thrombus formation or embolism at the puncture site. This is a limb-threatening emergency requiring immediate provider notification. Pulse changes are not normal post-procedure. Venous insufficiency presents with edema and warm legs. Lymphedema presents with swelling, not cool temperature.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is teaching a client about what to expect during a cardiac catheterization. Which statement by the nurse is most accurate?",
    o: ["You will be awake during the procedure under conscious sedation, and may feel pressure when the catheter is advanced but should not feel sharp pain", "You will be under general anaesthesia and will not remember anything", "The procedure takes approximately 4 to 6 hours", "A large incision will be made in your chest to access the heart"],
    a: 0,
    r: "Cardiac catheterization is performed under conscious sedation (not general anaesthesia). The client may feel pressure during catheter advancement but should not feel sharp pain. The procedure typically takes 30 to 60 minutes. It is a percutaneous procedure using a small puncture site, not a large incision. There is no chest incision.",
    s: "Cardiovascular"
  },
  {
    q: "A client who had cardiac catheterization 6 hours ago via the femoral artery is asking to use the bathroom. The nurse's most appropriate response is which of the following?",
    o: ["You need to use a bedpan or urinal for now. I will help you. The affected leg must remain straight to prevent bleeding at the insertion site", "You may walk to the bathroom as long as you are careful", "I will bring you a commode, but you must keep your right leg elevated", "You should hold it until the morning when the doctor can assess the site"],
    a: 0,
    r: "After femoral artery access, the client must keep the affected leg straight and immobilized for 4 to 6 hours (or longer per institutional protocol). Ambulation risks dislodging the hemostatic plug and causing hemorrhage. A bedpan maintains the required positioning. Walking is too early. A commode requires hip flexion. Asking the client to hold urine is inappropriate and uncomfortable.",
    s: "Cardiovascular"
  },
  // ===== ECG BASICS (Questions 201-216) =====
  {
    q: "A nurse is monitoring a client on telemetry and observes a regular rhythm with a rate of 78 bpm. Each QRS complex is preceded by a P wave with a consistent PR interval of 0.16 seconds. The QRS duration is 0.08 seconds. Which rhythm does the nurse identify?",
    o: ["Normal sinus rhythm", "Sinus tachycardia", "Atrial fibrillation", "First-degree AV block"],
    a: 0,
    r: "A regular rhythm at 60 to 100 bpm, with consistent P waves before each QRS, PR interval of 0.12 to 0.20 seconds, and QRS less than 0.12 seconds defines normal sinus rhythm. Sinus tachycardia would be above 100 bpm. AFib has absent P waves and irregular rhythm. First-degree block has PR greater than 0.20 seconds.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse reviews an ECG and notes the PR interval measures 0.28 seconds in every complex. The rhythm is regular at 68 bpm with one P wave before each QRS. Which ECG abnormality is present?",
    o: ["First-degree AV block", "Second-degree AV block Type I", "Third-degree AV block", "Bundle branch block"],
    a: 0,
    r: "A PR interval consistently greater than 0.20 seconds (0.28 seconds) with every P wave conducted to a QRS in a regular rhythm defines first-degree AV block. Type I has progressively lengthening PR with dropped QRS. Third-degree shows AV dissociation. Bundle branch block affects QRS width, not PR interval.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse observes a client's telemetry strip showing a regular, sawtooth pattern at 300 per minute with a ventricular rate of 75 bpm (4:1 conduction ratio). Which rhythm does the nurse identify?",
    o: ["Atrial flutter with 4:1 conduction", "Atrial fibrillation with rapid ventricular response", "Supraventricular tachycardia", "Ventricular tachycardia"],
    a: 0,
    r: "A sawtooth pattern (flutter waves) at approximately 300 per minute with a regular ventricular rate determined by the conduction ratio (300/4 = 75 bpm) is characteristic of atrial flutter. AFib has no discernible atrial pattern and is irregularly irregular. SVT has a single, rapid supraventricular focus. V-tach is a wide-complex ventricular rhythm.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse places ECG leads on a client and notes lead II shows an inverted P wave before each QRS complex. The rhythm is regular at 62 bpm. What does the inverted P wave suggest?",
    o: ["The impulse is originating from the AV junction rather than the SA node", "Normal SA node conduction with a technical artifact", "The client has atrial fibrillation", "The ECG leads are placed correctly and this is normal sinus rhythm"],
    a: 0,
    r: "An inverted P wave in lead II indicates retrograde atrial depolarization, meaning the impulse is originating from the AV junction (junctional rhythm) rather than the SA node. In normal sinus rhythm, P waves are upright in lead II. This is not an artifact or AFib (which has absent P waves). Inverted P waves in lead II are not normal.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse identifies a wide QRS complex (0.16 seconds) on a client's ECG with a rate of 38 bpm and no identifiable P waves. The client has a BP of 72/44 and is diaphoretic. Which rhythm is most likely, and what is the priority?",
    o: ["Idioventricular rhythm with hemodynamic instability requiring immediate intervention", "Normal sinus bradycardia requiring no treatment", "Sinus rhythm with a bundle branch block", "Atrial flutter with slow ventricular response"],
    a: 0,
    r: "Wide QRS (greater than 0.12 seconds) at a very slow rate (38 bpm) without P waves suggests a ventricular escape rhythm (idioventricular). The hemodynamic instability (BP 72/44, diaphoresis) makes this an emergency requiring transcutaneous pacing or atropine as ordered. Normal sinus bradycardia has P waves and narrow QRS. Sinus rhythm would have P waves. Flutter has flutter waves.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is interpreting an ECG strip and measures the R-R intervals. The intervals are consistently 0.6 seconds apart. What is the heart rate?",
    o: ["100 beats per minute", "60 beats per minute", "150 beats per minute", "80 beats per minute"],
    a: 0,
    r: "Heart rate from R-R interval is calculated by dividing 60 seconds by the R-R interval: 60/0.6 = 100 bpm. Alternatively, on standard ECG paper running at 25 mm/sec, 0.6 seconds = 15 small boxes, and 1,500/15 = 100. The other rates would correspond to different R-R intervals.",
    s: "Cardiovascular"
  },
  {
    q: "A client on telemetry has a rhythm showing QRS complexes occurring at regular intervals but with no identifiable P waves. The rate is 48 bpm and the QRS is narrow (0.08 seconds). Which rhythm does the nurse identify?",
    o: ["Junctional escape rhythm", "Ventricular escape rhythm", "Atrial fibrillation with slow ventricular response", "Sinus bradycardia"],
    a: 0,
    r: "A regular rhythm with narrow QRS, no visible P waves, and a rate of 40 to 60 bpm is consistent with a junctional escape rhythm. The AV junction takes over as the pacemaker when the SA node fails. Ventricular escape has wide QRS. AFib is irregularly irregular. Sinus bradycardia has visible P waves before each QRS.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is reviewing a client's 12-lead ECG and notices ST elevation in leads V1 through V4 with reciprocal ST depression in leads II, III, and aVF. Which region of the heart is most likely affected?",
    o: ["Anterior wall, typically supplied by the left anterior descending (LAD) artery", "Inferior wall, supplied by the right coronary artery", "Lateral wall, supplied by the circumflex artery", "Posterior wall, supplied by the posterior descending artery"],
    a: 0,
    r: "ST elevation in leads V1 through V4 corresponds to the anterior wall of the heart, which is supplied by the LAD artery. Reciprocal changes (ST depression) in the inferior leads (II, III, aVF) confirm an anterior STEMI. Inferior wall changes would show ST elevation in II, III, aVF. Lateral wall involves leads I, aVL, V5, V6. Posterior wall shows ST depression in V1 to V3.",
    s: "Cardiovascular"
  },
  {
    q: "A 70-year-old client has the following ECG findings: regular rhythm, rate 150 bpm, narrow QRS, and P waves buried within the T waves. Which dysrhythmia should the nurse consider?",
    o: ["Supraventricular tachycardia (SVT)", "Sinus tachycardia", "Ventricular tachycardia", "Atrial fibrillation"],
    a: 0,
    r: "A regular narrow-complex tachycardia at 150 bpm with P waves hidden in T waves is characteristic of SVT. The rapid rate makes P waves difficult to identify as they merge with preceding T waves. Sinus tachycardia usually has identifiable P waves and a rate that varies with activity. V-tach has wide QRS. AFib is irregularly irregular.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse notices a client's telemetry showing occasional wide, bizarre-looking QRS complexes without preceding P waves, occurring between normal sinus beats. The client is asymptomatic. Which finding does the nurse document?",
    o: ["Premature ventricular contractions (PVCs)", "Premature atrial contractions (PACs)", "Ventricular tachycardia", "Atrial fibrillation"],
    a: 0,
    r: "Occasional wide, bizarre QRS complexes without preceding P waves interspersed between normal sinus beats are PVCs, originating from an irritable ventricular focus. PACs have normal QRS morphology with early P waves. V-tach requires three or more consecutive ventricular beats. AFib has absent P waves and irregularly irregular rhythm throughout.",
    s: "Cardiovascular"
  },
  // ===== ANTICOAGULANT THERAPY (Questions 217-236) =====
  {
    q: "A 72-year-old client with atrial fibrillation is on warfarin 5 mg daily. The INR today is 2.4. Which interpretation by the nurse is correct?",
    o: ["The INR is within the therapeutic range of 2.0 to 3.0 for atrial fibrillation", "The INR is dangerously high and the warfarin dose should be reduced", "The INR is subtherapeutic and the dose needs to be increased", "The INR value is only relevant for clients on heparin therapy"],
    a: 0,
    r: "For atrial fibrillation, the target INR is 2.0 to 3.0. An INR of 2.4 is within this therapeutic range, indicating appropriate anticoagulation. It is not dangerously high (that would be above 3.0 to 4.0). It is not subtherapeutic. INR monitors warfarin specifically. aPTT monitors heparin.",
    s: "Cardiovascular"
  },
  {
    q: "A client on heparin infusion for DVT begins bleeding from the IV insertion site and the gums. The aPTT is 145 seconds (therapeutic 60 to 80). Which medication should the nurse anticipate the provider will order?",
    o: ["Protamine sulfate, the specific antidote for heparin", "Vitamin K, the antidote for warfarin", "Aminocaproic acid for fibrinolytic bleeding", "Fresh frozen plasma for factor replacement"],
    a: 0,
    r: "Protamine sulfate is the specific antidote for heparin. With a critically elevated aPTT (145 seconds) and active bleeding, the heparin must be stopped and protamine administered. Vitamin K reverses warfarin, not heparin. Aminocaproic acid treats fibrinolytic-related bleeding. FFP may be adjunctive but protamine is the first-line antidote.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is teaching a client about warfarin therapy. The client asks about dietary considerations. Which instruction is most important?",
    o: ["Maintain a consistent daily intake of vitamin K-rich foods rather than eliminating them entirely", "Avoid all green vegetables while on warfarin", "Eat as many leafy greens as possible to counteract the warfarin", "Dietary intake has no effect on warfarin therapy"],
    a: 0,
    r: "Warfarin works by antagonizing vitamin K. The key is consistency in vitamin K intake so the warfarin dose can be titrated appropriately. Eliminating all green vegetables is unnecessary and nutritionally harmful. Excessive intake would reduce warfarin's effectiveness. Diet significantly affects warfarin's anticoagulant effect.",
    s: "Cardiovascular"
  },
  {
    q: "A 65-year-old client with a mechanical heart valve has an INR of 5.2. There is no active bleeding. Which action does the nurse anticipate?",
    o: ["Hold warfarin for 1 to 2 doses and possibly administer a low dose of oral vitamin K as ordered", "Continue warfarin at the current dose since there is no bleeding", "Administer IV vitamin K 10 mg stat", "Transfuse packed red blood cells immediately"],
    a: 0,
    r: "An INR of 5.2 without bleeding typically warrants holding warfarin and possibly administering a low dose of oral vitamin K (1 to 2.5 mg) to gradually reduce the INR. Continuing the dose would further elevate INR. High-dose IV vitamin K could lower INR too much, risking valve thrombosis. RBC transfusion is for active hemorrhage with anemia.",
    s: "Cardiovascular"
  },
  {
    q: "A client is prescribed enoxaparin 1 mg/kg subcutaneously every 12 hours for DVT treatment. The client weighs 80 kg. What dose should the nurse administer?",
    o: ["80 mg subcutaneously", "100 mg subcutaneously", "40 mg subcutaneously", "120 mg subcutaneously"],
    a: 0,
    r: "Enoxaparin dose is calculated as 1 mg/kg x 80 kg = 80 mg. This is the standard treatment dose for DVT. 100 mg, 40 mg, and 120 mg are incorrect calculations. The 40 mg dose is the typical prophylactic dose, not the treatment dose.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is administering a subcutaneous injection of enoxaparin. Which technique is correct?",
    o: ["Inject into the anterolateral or posterolateral abdominal wall, do not aspirate, and do not rub the site afterward", "Inject into the deltoid muscle with a 22-gauge needle", "Aspirate before injection to check for blood return", "Massage the site vigorously after injection to promote absorption"],
    a: 0,
    r: "Enoxaparin (LMWH) is administered subcutaneously into the abdominal wall (left or right anterolateral/posterolateral). Do not aspirate (increases bruising risk) and do not massage (increases hematoma risk). It is not given intramuscularly. Vigorous massage causes tissue damage and bruising.",
    s: "Cardiovascular"
  },
  {
    q: "A 68-year-old client on dabigatran for atrial fibrillation is scheduled for an emergency surgery. The surgeon is concerned about bleeding risk. Which reversal agent should the nurse anticipate?",
    o: ["Idarucizumab (Praxbind), the specific reversal agent for dabigatran", "Vitamin K, the antidote for all anticoagulants", "Protamine sulfate, the universal anticoagulant reversal agent", "Activated charcoal to bind the dabigatran in the stomach"],
    a: 0,
    r: "Idarucizumab (Praxbind) is a monoclonal antibody fragment that specifically binds and reverses dabigatran. It provides rapid and complete reversal for emergency situations. Vitamin K only reverses warfarin. Protamine reverses heparin. Activated charcoal may be considered only if dabigatran was ingested within the last 2 hours and is not a reliable reversal strategy.",
    s: "Cardiovascular"
  },
  {
    q: "A client on apixaban for DVT prevention asks why they do not need regular blood tests like their friend who takes warfarin. Which response by the nurse is accurate?",
    o: ["Apixaban has a predictable anticoagulant effect at fixed doses and does not require routine blood monitoring for dose adjustment", "Apixaban is not a real anticoagulant, so monitoring is not needed", "Your doctor forgot to order the blood tests", "Blood monitoring for apixaban is only needed in the first week of therapy"],
    a: 0,
    r: "Direct oral anticoagulants (DOACs) like apixaban have predictable pharmacokinetics and pharmacodynamics at fixed doses, eliminating the need for routine monitoring. Warfarin has variable metabolism requiring INR monitoring. Apixaban is a potent Factor Xa inhibitor. Monitoring is not simply overlooked. There is no routine monitoring period for DOACs.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is caring for a client receiving a heparin infusion. Which lab value should the nurse monitor to assess heparin's therapeutic effectiveness?",
    o: ["Activated partial thromboplastin time (aPTT)", "International Normalized Ratio (INR)", "Prothrombin time (PT)", "Platelet count"],
    a: 0,
    r: "aPTT is the primary lab test for monitoring unfractionated heparin therapy (therapeutic range typically 1.5 to 2.5 times normal, or 60 to 80 seconds depending on the lab). INR and PT monitor warfarin. Platelet count is monitored for HIT but does not assess anticoagulant effect.",
    s: "Cardiovascular"
  },
  {
    q: "A client on heparin infusion develops a platelet count drop from 180,000 to 72,000/mm3 on day 7 of therapy. The nurse suspects HIT. Which action is the priority?",
    o: ["Stop the heparin infusion immediately, notify the provider, and avoid all heparin products including flushes", "Continue the heparin since the platelets are still above 50,000", "Switch to enoxaparin (low-molecular-weight heparin) as an alternative", "Administer a platelet transfusion to raise the count"],
    a: 0,
    r: "HIT is a life-threatening immune reaction requiring immediate cessation of ALL heparin products (including LMWH and heparin flushes). LMWH cross-reacts with HIT antibodies and is contraindicated. Platelet transfusion can worsen thrombosis in HIT. Alternative anticoagulants (argatroban, bivalirudin) are used. Continuing heparin risks catastrophic thrombosis.",
    s: "Cardiovascular"
  },
  {
    q: "A 55-year-old client on warfarin calls the clinic to report that they took ibuprofen for a headache. Which concern should the nurse communicate to the client?",
    o: ["NSAIDs like ibuprofen increase bleeding risk when combined with warfarin. Use acetaminophen for pain relief and inform your provider about the ibuprofen use", "Ibuprofen is completely safe to take with warfarin at any dose", "You need to come to the emergency department immediately for a blood transfusion", "Ibuprofen will reduce the effectiveness of warfarin, so you should take a double dose of warfarin"],
    a: 0,
    r: "NSAIDs (ibuprofen) increase bleeding risk with warfarin through two mechanisms: they inhibit platelet function and can cause GI ulceration. Acetaminophen is the preferred analgesic for warfarin clients. While one dose may not cause immediate harm, the client should be educated and the provider notified. An ER visit for a single dose is not typically necessary. Ibuprofen does not reduce warfarin efficacy.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is preparing to administer a heparin bolus of 5,000 units IV. The vial contains heparin 10,000 units/mL. How many millilitres should the nurse draw up?",
    o: ["0.5 mL", "1.0 mL", "5.0 mL", "2.0 mL"],
    a: 0,
    r: "Using the formula: Desired dose/Available concentration = 5,000 units / 10,000 units per mL = 0.5 mL. This is a critical calculation as heparin is a high-alert medication requiring independent double-checks.",
    s: "Cardiovascular"
  },
  {
    q: "A 78-year-old client with AFib and a CHA2DS2-VASc score of 5 is being evaluated for anticoagulation. The nurse understands that this score indicates which of the following?",
    o: ["High risk for stroke requiring anticoagulation therapy", "Low risk for stroke with no anticoagulation needed", "Moderate risk requiring aspirin therapy only", "The score determines the dosage of beta-blocker therapy"],
    a: 0,
    r: "CHA2DS2-VASc score of 5 indicates high stroke risk in atrial fibrillation. Scores of 2 or higher in males and 3 or higher in females generally warrant anticoagulation therapy. The score assesses risk factors including heart failure, hypertension, age, diabetes, stroke history, vascular disease, and sex. It does not determine beta-blocker dosing.",
    s: "Cardiovascular"
  },
  // ===== CARDIAC REHABILITATION (Questions 237-252) =====
  {
    q: "A 60-year-old client is entering Phase I cardiac rehabilitation 2 days after STEMI. The nurse explains that this phase focuses on which of the following?",
    o: ["Supervised, progressive mobilization and education during the acute hospital stay", "High-intensity interval training to strengthen the heart quickly", "Unsupervised home exercise with weekly phone follow-up", "Return to competitive sports within 1 week"],
    a: 0,
    r: "Phase I cardiac rehabilitation occurs during the acute hospitalization and focuses on gradual, supervised mobilization (dangling legs, standing, short walks), education about the disease process, and psychosocial support. High-intensity exercise is inappropriate this early. Unsupervised exercise describes Phase III/IV. Return to competitive sports is a long-term goal assessed individually.",
    s: "Cardiovascular"
  },
  {
    q: "A client in Phase II cardiac rehabilitation asks how hard they should exercise. The nurse explains the target heart rate concept. Which guideline is most appropriate?",
    o: ["Exercise at 60 to 80 percent of your maximum heart rate as determined by your stress test, and use the talk test to ensure you can still carry on a conversation", "Push yourself until you cannot speak because that means your heart is working hard enough", "Your heart rate should remain below 60 bpm during exercise", "Only exercise if your resting heart rate is exactly 72 bpm"],
    a: 0,
    r: "Phase II cardiac rehabilitation targets 60 to 80% of maximum heart rate determined by stress testing. The 'talk test' ensures the client is not overexerting (ability to speak during exercise indicates aerobic, not anaerobic, activity). Inability to speak suggests excessive intensity. HR below 60 is too conservative. There is no specific resting HR requirement for exercise.",
    s: "Cardiovascular"
  },
  {
    q: "A 55-year-old client in cardiac rehabilitation reports feeling depressed and anxious about their heart condition. They have lost interest in activities and have difficulty sleeping. Which response by the nurse is most appropriate?",
    o: ["Depression is common after cardiac events and can affect recovery. I will refer you to our psychosocial support services for further assessment", "Depression after a heart attack is not common, so you should just try to think positively", "Your feelings are unrelated to your heart condition and do not affect rehabilitation outcomes", "I will ask the provider to prescribe sleeping pills to help you sleep better"],
    a: 0,
    r: "Depression affects up to 45% of post-MI clients and is an independent risk factor for poor cardiac outcomes, reduced adherence to rehabilitation, and increased mortality. The nurse should validate the client's feelings and facilitate referral for psychosocial assessment and support. Dismissing the feelings or treating only insomnia does not address the underlying issue.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is teaching a post-MI client about activity progression at home during Phase III rehabilitation. Which instruction is most appropriate?",
    o: ["Gradually increase activity duration and intensity over weeks, and stop exercise if you experience chest pain, severe dyspnea, or dizziness", "Resume all pre-MI activities immediately since the cardiac rehabilitation program has strengthened your heart", "Avoid all physical activity for 6 months to allow the heart to fully heal", "Exercise only once per month to prevent overexertion"],
    a: 0,
    r: "Phase III (maintenance) rehabilitation emphasizes gradual, progressive activity increases with clear stop parameters (chest pain, severe dyspnea, dizziness, excessive fatigue). Immediate return to full activity risks re-injury. Complete avoidance deconditioning. Monthly exercise is insufficient for cardiovascular benefit. The goal is sustained, regular physical activity.",
    s: "Cardiovascular"
  },
  {
    q: "A client in cardiac rehabilitation asks about resuming sexual activity after their MI. They are currently able to walk up two flights of stairs without symptoms. Which response by the nurse is most appropriate?",
    o: ["Being able to climb two flights of stairs without symptoms suggests you may be ready. Discuss the timing with your healthcare provider at your next appointment", "You should never resume sexual activity after a heart attack", "You can resume immediately since you can climb stairs", "Wait at least 2 years before discussing this with your doctor"],
    a: 0,
    r: "The ability to climb two flights of stairs without cardiac symptoms (chest pain, excessive dyspnea, significant HR increase) is a functional benchmark suggesting readiness for sexual activity. However, the provider should confirm this based on individual assessment. Permanent avoidance is incorrect. Immediate resumption without provider input is inadvisable. Two years is unnecessarily long.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is monitoring a client during a cardiac rehabilitation exercise session. The client's resting HR was 72 bpm and is now 146 bpm during exercise. The client reports feeling dizzy and lightheaded. What should the nurse do?",
    o: ["Stop the exercise immediately, have the client sit or lie down, and assess vital signs", "Encourage the client to push through the dizziness to complete the session", "Increase the exercise intensity to reach the target heart rate", "Administer sublingual nitroglycerin for the dizziness"],
    a: 0,
    r: "Dizziness and lightheadedness during cardiac rehabilitation are warning signs of potential hemodynamic compromise or excessive cardiac demand. The nurse must stop exercise immediately and assess. Pushing through could lead to cardiac event. Increasing intensity is dangerous. Nitroglycerin is for chest pain, not dizziness without angina.",
    s: "Cardiovascular"
  },
  {
    q: "A 62-year-old client with type 2 diabetes and recent CABG surgery is in Phase II cardiac rehabilitation. Which modification should the nurse ensure for this client's exercise program?",
    o: ["Monitor blood glucose before and after exercise, ensure a snack is available, and watch for signs of hypoglycemia", "Exclude the client from exercise entirely due to diabetes", "Allow the client to exercise without any glucose monitoring", "Double the client's insulin dose before each exercise session"],
    a: 0,
    r: "Diabetic clients in cardiac rehabilitation require glucose monitoring because exercise increases insulin sensitivity and glucose uptake, risking hypoglycemia. A snack should be available, and the client should be monitored for symptoms (tremor, diaphoresis, confusion). Exclusion from exercise is inappropriate. Unmonitored exercise is unsafe. Doubling insulin risks severe hypoglycemia.",
    s: "Cardiovascular"
  },
  {
    q: "A client asks the nurse what the long-term benefits of completing a cardiac rehabilitation program are. Which response is most evidence-based?",
    o: ["Cardiac rehabilitation reduces the risk of future cardiac events, improves exercise capacity, and enhances quality of life", "Cardiac rehabilitation only benefits clients under age 50", "The main benefit is cosmetic improvement from weight loss", "Cardiac rehabilitation has no proven benefits beyond the initial hospital recovery"],
    a: 0,
    r: "Research consistently demonstrates that cardiac rehabilitation reduces cardiovascular mortality by 20 to 30%, decreases hospital readmissions, improves exercise tolerance and functional capacity, and enhances quality of life. Benefits occur across all age groups. The program addresses multiple risk factors including exercise, diet, stress management, and medication adherence.",
    s: "Cardiovascular"
  },
  // ===== HEART TRANSPLANT (Questions 253-268) =====
  {
    q: "A 52-year-old client is 3 days post-heart transplant. The nurse notes a temperature of 38.4 degrees Celsius, WBC of 14,200/mm3, and the client reports malaise. Which concern is the priority?",
    o: ["Signs of infection or acute rejection, which require immediate investigation and provider notification", "Normal post-operative inflammatory response requiring no intervention", "Graft-versus-host disease from the donor heart", "Expected signs of recovery that will resolve spontaneously"],
    a: 0,
    r: "In a post-transplant client on immunosuppressive therapy, fever and elevated WBC can indicate either infection (to which they are highly susceptible) or acute rejection. Both are life-threatening and require urgent evaluation including endomyocardial biopsy and cultures. Post-operative inflammation should be resolving by day 3. GVHD is rare with solid organ transplants. These signs should not be ignored.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is providing discharge teaching to a heart transplant recipient about immunosuppressive medications. Which instruction is most critical?",
    o: ["Take your immunosuppressive medications at the same time every day, never skip doses, and report any signs of infection immediately", "You only need to take immunosuppressants for the first 6 months after transplant", "If you feel well, you can gradually reduce the dose on your own", "Immunosuppressants have no side effects, so they are safe to take indefinitely"],
    a: 0,
    r: "Immunosuppressive medications are lifelong and must be taken consistently at the same times daily to maintain therapeutic levels and prevent rejection. Skipping doses or self-adjusting increases rejection risk. These medications are never limited to 6 months. Self-dose reduction is dangerous. Immunosuppressants have significant side effects including infection risk, nephrotoxicity, and malignancy risk.",
    s: "Cardiovascular"
  },
  {
    q: "A heart transplant recipient is being evaluated for acute rejection. The nurse understands that the gold standard diagnostic test for cardiac rejection is which of the following?",
    o: ["Endomyocardial biopsy", "Chest X-ray", "12-lead ECG", "Serum troponin level"],
    a: 0,
    r: "Endomyocardial biopsy (EMB) is the gold standard for diagnosing cardiac rejection. Small samples of myocardial tissue are examined microscopically for lymphocyte infiltration and myocyte damage. While chest X-ray, ECG, and troponin can show abnormalities suggestive of rejection, only biopsy provides definitive histological confirmation.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is caring for a heart transplant recipient who reports that they do not feel their heart rate increase during exercise. Which explanation by the nurse is accurate?",
    o: ["The transplanted heart is denervated, so it does not respond to the autonomic nervous system the same way. Your heart rate increases more slowly through circulating catecholamines", "This means your transplant is failing and you need to return to the hospital immediately", "You are not exercising hard enough if your heart rate does not increase", "The medications you are taking prevent any heart rate increase during activity"],
    a: 0,
    r: "A transplanted heart is surgically denervated (vagus and sympathetic nerves are severed). Heart rate response to exercise depends on circulating catecholamines (epinephrine/norepinephrine) rather than direct neural stimulation, causing a delayed and attenuated response. This is normal, not transplant failure. It is not related to exercise intensity or medication effects specifically.",
    s: "Cardiovascular"
  },
  {
    q: "A heart transplant recipient develops tremors, elevated creatinine (2.8 mg/dL), and hyperkalemia (K+ 5.8 mEq/L). The client is on tacrolimus. Which concern should the nurse identify?",
    o: ["Tacrolimus toxicity causing nephrotoxicity and associated electrolyte imbalance", "Normal side effects of tacrolimus that do not require intervention", "Signs of acute cardiac rejection", "Hyperkalemia from excessive dietary potassium intake"],
    a: 0,
    r: "Tremors, elevated creatinine, and hyperkalemia are classic signs of tacrolimus toxicity. Tacrolimus is nephrotoxic and can impair renal potassium excretion. A trough level should be drawn, and the provider notified for dose adjustment. These are not normal and require intervention. While rejection is always a concern, this constellation of findings points to drug toxicity. Dietary potassium alone would not cause these combined findings.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is caring for a 48-year-old client who is 6 months post-heart transplant. Which infection prevention instruction is most important?",
    o: ["Avoid crowds, wear a mask in public spaces, practice meticulous hand hygiene, and avoid contact with individuals who are ill", "You can return to normal social activities without restrictions since your immune system has recovered", "Only avoid people with active COVID-19 infections", "Infection prevention is only necessary during the first 2 weeks after transplant"],
    a: 0,
    r: "Heart transplant recipients are on lifelong immunosuppression and remain at increased risk for infection indefinitely. Crowd avoidance, mask use, hand hygiene, and avoiding sick contacts are essential ongoing precautions. The immune system does not fully recover. Protection against all infections (not just COVID) is necessary. Two weeks is far too short for infection precautions.",
    s: "Cardiovascular"
  },
  {
    q: "A heart transplant recipient develops symptoms of cardiac allograft vasculopathy (CAV) 3 years post-transplant. The nurse understands that the unique challenge of CAV is which of the following?",
    o: ["The denervated heart does not produce typical angina symptoms, so CAV often presents as heart failure or sudden death without warning chest pain", "CAV produces classic anginal symptoms that are easily diagnosed", "CAV only occurs within the first month after transplant", "CAV is a benign condition that resolves spontaneously"],
    a: 0,
    r: "Cardiac allograft vasculopathy (chronic rejection) involves diffuse coronary artery narrowing. Because the transplanted heart is denervated, clients do not experience typical angina. CAV often presents silently as heart failure, dysrhythmias, or sudden cardiac death. Regular surveillance with coronary angiography is essential. CAV is a leading cause of late transplant failure.",
    s: "Cardiovascular"
  },
  {
    q: "A heart transplant recipient is being discharged. The nurse reviews the medication list: tacrolimus, mycophenolate mofetil, and prednisone. Which side effect of prednisone should the nurse include in discharge teaching?",
    o: ["Monitor for weight gain, elevated blood glucose, mood changes, and signs of infection, as corticosteroids suppress the immune system and affect metabolism", "Prednisone has no significant side effects at post-transplant doses", "Prednisone only affects the digestive system", "The main side effect of prednisone is hair loss"],
    a: 0,
    r: "Prednisone (a corticosteroid) causes numerous side effects including weight gain, hyperglycemia, mood disturbances, osteoporosis, cushingoid features, increased infection risk, and adrenal suppression. Clients need to monitor glucose, weight, and report infections. It has extensive systemic effects beyond the digestive system. Hair loss is not a primary corticosteroid side effect.",
    s: "Cardiovascular"
  },
  // ===== SATA QUESTIONS (Questions 269-308 mix of SATA, Ordered, Fill-in-blank, Hot-spot) =====
  // SATA Questions (269-308)
  {
    q: "A 72-year-old client with heart failure is being discharged on multiple medications. Which discharge instructions should the nurse include? Select all that apply.",
    o: ["Weigh yourself at the same time every morning and record it", "Report a weight gain of more than 1 kg in a day or 2 kg in a week to your provider", "Take your diuretic in the evening to prevent nighttime fluid retention", "Restrict fluid intake as prescribed", "Monitor for dizziness and report it, as it may indicate low blood pressure from medications", "Increase sodium intake to maintain blood pressure"],
    a: -1,
    ca: [0, 1, 3, 4],
    t: "sata",
    r: "Daily morning weights, reporting significant weight gain, fluid restriction as prescribed, and monitoring for medication side effects (dizziness from hypotension) are all appropriate heart failure discharge instructions. Diuretics should be taken in the morning to avoid nocturia and sleep disruption. Increased sodium worsens fluid retention in heart failure.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is caring for a client with acute myocardial infarction. Which interventions are appropriate for the nurse to implement? Select all that apply.",
    o: ["Administer oxygen if SpO2 is below 94% as ordered", "Administer aspirin 160 mg chewed as ordered", "Obtain a 12-lead ECG within 10 minutes of arrival", "Place the client in a supine flat position", "Establish IV access and draw cardiac biomarkers", "Administer sublingual nitroglycerin as ordered for chest pain"],
    a: -1,
    ca: [0, 1, 2, 4, 5],
    t: "sata",
    r: "Standard MI management includes oxygen for hypoxemia, aspirin for antiplatelet effect, rapid ECG, IV access with cardiac biomarker draws, and nitroglycerin for pain. The client should be placed in a position of comfort (usually semi-Fowler's), not supine flat, which could worsen dyspnea and increase preload.",
    s: "Cardiovascular"
  },
  {
    q: "A client with atrial fibrillation is on warfarin therapy. Which client statements indicate correct understanding of the medication? Select all that apply.",
    o: ["I should have my INR checked regularly as scheduled", "I should maintain a consistent diet and not dramatically change my intake of leafy green vegetables", "I will use an electric razor instead of a straight razor to prevent cuts", "I can take aspirin whenever I have a headache without checking with my provider", "I will wear a medical alert bracelet identifying my anticoagulant therapy", "I should report any unusual bruising or blood in my stool immediately"],
    a: -1,
    ca: [0, 1, 2, 4, 5],
    t: "sata",
    r: "Regular INR monitoring, consistent vitamin K intake, using an electric razor, wearing a medical alert bracelet, and reporting bleeding signs all demonstrate correct warfarin understanding. Taking aspirin with warfarin significantly increases bleeding risk and should not be done without provider approval.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is assessing a client for signs of right-sided heart failure. Which findings are consistent with right-sided heart failure? Select all that apply.",
    o: ["Jugular venous distension", "Hepatomegaly", "Dependent peripheral edema", "Pink frothy sputum", "Weight gain from fluid retention", "Ascites"],
    a: -1,
    ca: [0, 1, 2, 4, 5],
    t: "sata",
    r: "Right-sided heart failure causes systemic venous congestion manifesting as JVD, hepatomegaly, peripheral edema, weight gain from fluid retention, and ascites. Pink frothy sputum is a hallmark of left-sided heart failure (acute pulmonary edema), not right-sided failure.",
    s: "Cardiovascular"
  },
  {
    q: "A client is being prepared for cardiac catheterization. Which pre-procedure nursing assessments and interventions are appropriate? Select all that apply.",
    o: ["Verify informed consent is signed", "Assess for allergies to iodine, contrast dye, or shellfish", "Mark bilateral pedal pulses for post-procedure comparison", "Ensure the client has fasted as ordered", "Administer a full dose of metformin to prevent hyperglycemia during the procedure", "Verify baseline renal function (BUN, creatinine)"],
    a: -1,
    ca: [0, 1, 2, 3, 5],
    t: "sata",
    r: "Pre-catheterization care includes verifying consent, allergy assessment (contrast dye), marking pedal pulses for comparison, ensuring NPO status, and checking renal function (contrast can cause nephropathy). Metformin should be held, not administered, due to risk of lactic acidosis when combined with contrast dye.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is teaching a client with peripheral arterial disease about risk factor modification. Which instructions should the nurse include? Select all that apply.",
    o: ["Stop smoking immediately, as smoking is the most important modifiable risk factor", "Follow a heart-healthy diet low in saturated fats and cholesterol", "Walk regularly to the point of claudication, rest, then resume", "Apply heating pads to the legs daily to improve circulation", "Take prescribed statin medications as directed", "Monitor and control blood glucose if diabetic"],
    a: -1,
    ca: [0, 1, 2, 4, 5],
    t: "sata",
    r: "PAD management includes smoking cessation (strongest modifiable risk factor), heart-healthy diet, supervised exercise (walk-rest-walk protocol), statin therapy for lipid management, and glycemic control in diabetic clients. Heating pads are contraindicated as they can burn ischemic tissue with impaired sensation.",
    s: "Cardiovascular"
  },
  {
    q: "A client is receiving a heparin infusion. Which nursing assessments are essential during heparin therapy? Select all that apply.",
    o: ["Monitor aPTT results and adjust infusion per protocol", "Assess for signs of bleeding (gums, urine, stool, bruising)", "Monitor platelet count for signs of HIT", "Check INR daily to assess heparin effectiveness", "Inspect all injection and IV sites for bleeding or hematoma", "Assess neurological status for signs of intracranial bleeding"],
    a: -1,
    ca: [0, 1, 2, 4, 5],
    t: "sata",
    r: "Heparin monitoring includes aPTT (not INR, which monitors warfarin), bleeding assessment at all sites, platelet counts for HIT detection, and neurological assessment for intracranial hemorrhage. INR monitors warfarin's effect on vitamin K-dependent clotting factors, not heparin's effect on antithrombin III.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is caring for a client with a permanent pacemaker. Which client education points should be included? Select all that apply.",
    o: ["Carry your pacemaker identification card at all times", "Avoid MRI unless your device has been verified as MRI-conditional", "Report signs of infection at the generator site (redness, warmth, drainage)", "You may use a microwave oven safely at home", "Stand directly next to running car engines for extended periods to test the pacemaker", "Report dizziness, fainting, or persistent hiccups, as these may indicate pacemaker malfunction"],
    a: -1,
    ca: [0, 1, 2, 3, 5],
    t: "sata",
    r: "Pacemaker education includes carrying an ID card, MRI precautions, infection monitoring, reassurance about safe microwave use, and reporting symptoms of malfunction (dizziness, syncope, hiccups from lead displacement). Standing near running engines is not recommended due to potential electromagnetic interference, though modern pacemakers have good shielding.",
    s: "Cardiovascular"
  },
  {
    q: "A client post-STEMI is in Phase I cardiac rehabilitation. Which activities are appropriate for this phase? Select all that apply.",
    o: ["Dangling legs at the bedside with assistance", "Performing passive and active range-of-motion exercises in bed", "Walking short distances in the hallway with supervision", "Running on a treadmill at maximum capacity", "Receiving education about cardiac risk factor modification", "Practicing deep breathing and coughing exercises"],
    a: -1,
    ca: [0, 1, 2, 4, 5],
    t: "sata",
    r: "Phase I rehabilitation includes progressive mobilization (dangling, ROM exercises, supervised hallway walks), patient education, and respiratory exercises. Running on a treadmill at maximum capacity is inappropriate during acute hospitalization and could cause re-infarction or life-threatening dysrhythmias.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is assessing a client for signs of cardiac tamponade. Which findings suggest this complication? Select all that apply.",
    o: ["Muffled or distant heart sounds", "Jugular venous distension", "Hypotension with narrow pulse pressure", "Pulsus paradoxus greater than 10 mmHg", "Hypertension with widened pulse pressure", "Tachycardia as a compensatory mechanism"],
    a: -1,
    ca: [0, 1, 2, 3, 5],
    t: "sata",
    r: "Cardiac tamponade presents with Beck's triad (muffled heart sounds, JVD, hypotension) plus pulsus paradoxus and compensatory tachycardia. The pericardial effusion compresses the heart, reducing filling and output. Hypertension with widened pulse pressure is inconsistent with tamponade, which causes narrow pulse pressure from reduced stroke volume.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is providing teaching to a client newly diagnosed with hypertension. Which lifestyle modifications should the nurse recommend? Select all that apply.",
    o: ["Reduce sodium intake to less than 2,000 mg per day", "Engage in at least 150 minutes of moderate aerobic exercise per week", "Limit alcohol consumption", "Maintain a healthy weight through balanced nutrition", "Increase caffeine intake to boost energy levels", "Follow the DASH diet emphasizing fruits, vegetables, and low-fat dairy"],
    a: -1,
    ca: [0, 1, 2, 3, 5],
    t: "sata",
    r: "Evidence-based hypertension lifestyle modifications include sodium restriction, regular aerobic exercise, alcohol limitation, weight management, and the DASH diet. Increasing caffeine can temporarily elevate blood pressure and is not a recommended lifestyle modification for hypertension management.",
    s: "Cardiovascular"
  },
  {
    q: "A client with DVT is being discharged on rivaroxaban. Which instructions should the nurse provide? Select all that apply.",
    o: ["Take rivaroxaban with your largest meal for optimal absorption", "Do not stop taking the medication without consulting your healthcare provider", "Report unusual bleeding, bruising, or blood in your stool immediately", "You will need weekly INR monitoring while on rivaroxaban", "Wear compression stockings as prescribed", "Avoid prolonged immobility and stay active as tolerated"],
    a: -1,
    ca: [0, 1, 2, 4, 5],
    t: "sata",
    r: "Rivaroxaban should be taken with food (largest meal for 15 mg+ doses), should not be stopped without provider guidance, bleeding signs should be reported, compression stockings promote venous return, and activity prevents recurrence. DOACs like rivaroxaban do not require routine INR monitoring (that is for warfarin).",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is assessing a client for peripheral arterial disease. Which assessment findings suggest PAD? Select all that apply.",
    o: ["Diminished or absent pedal pulses", "Cool, pale extremities", "Intermittent claudication with walking", "Warm, edematous legs with brownish discolouration", "Hair loss on the lower legs and feet", "Thickened, brittle toenails"],
    a: -1,
    ca: [0, 1, 2, 4, 5],
    t: "sata",
    r: "PAD signs include diminished pulses, cool/pale extremities, intermittent claudication, hair loss (from poor perfusion to hair follicles), and dystrophic nails. Warm, edematous legs with brown discolouration (hemosiderin staining) are characteristic of chronic venous insufficiency, not arterial disease.",
    s: "Cardiovascular"
  },
  {
    q: "A heart transplant recipient is being discharged. Which topics should the nurse include in discharge education? Select all that apply.",
    o: ["Take immunosuppressive medications at the same times daily and never skip doses", "Report any fever, sore throat, or signs of infection immediately", "Attend all scheduled follow-up appointments including endomyocardial biopsies", "Resume a normal diet without any modifications", "Avoid live vaccines", "Practice meticulous hand hygiene and avoid crowds during peak illness seasons"],
    a: -1,
    ca: [0, 1, 2, 4, 5],
    t: "sata",
    r: "Post-transplant education includes medication adherence, infection reporting, follow-up compliance, avoiding live vaccines (which can cause disease in immunosuppressed clients), and infection prevention measures. Diet modifications are typically recommended (low sodium, heart-healthy foods), so resuming a completely unrestricted diet is inappropriate.",
    s: "Cardiovascular"
  },
  // Ordered Response Questions (283-307)
  {
    q: "A client presents with ventricular fibrillation on the telemetry monitor and is found unresponsive and pulseless. Place the following nursing actions in the correct order of priority.",
    o: ["Confirm unresponsiveness and call for help", "Begin high-quality chest compressions", "Attach the defibrillator and deliver a shock", "Resume CPR for 2 minutes after the shock", "Administer epinephrine 1 mg IV as ordered after the second rhythm check", "Reassess the rhythm after 2 minutes of CPR"],
    a: -1,
    co: [0, 1, 2, 3, 5, 4],
    t: "ordered",
    r: "ACLS protocol for VFib: Confirm arrest and call for help, start CPR immediately (compressions first), defibrillate as soon as available, resume CPR for 2 minutes, reassess rhythm, then administer vasopressors. Early defibrillation is the most important intervention for VFib survival. Epinephrine is given after the second rhythm check if VFib persists.",
    s: "Cardiovascular"
  },
  {
    q: "A client is experiencing an acute STEMI. Place the nursing interventions in the correct order of implementation.",
    o: ["Assess the client's chest pain characteristics and vital signs", "Administer aspirin 160 mg chewed as ordered", "Obtain a 12-lead ECG", "Establish IV access and draw cardiac biomarkers", "Administer nitroglycerin sublingually as ordered for persistent pain", "Prepare the client for emergent percutaneous coronary intervention"],
    a: -1,
    co: [0, 2, 1, 3, 4, 5],
    t: "ordered",
    r: "STEMI management follows a systematic approach: initial assessment (ABCs, pain, vitals), immediate ECG (door-to-ECG under 10 minutes), aspirin administration (antiplatelet), IV access with blood draws, nitroglycerin for pain relief, and preparation for definitive reperfusion (PCI). The ECG confirms the diagnosis and drives the reperfusion decision.",
    s: "Cardiovascular"
  },
  {
    q: "A client develops symptomatic supraventricular tachycardia (SVT) with a heart rate of 190 bpm and BP of 102/68. Place the nursing interventions in the correct sequence.",
    o: ["Assess the client's airway, breathing, and circulation", "Assist the client with vagal manoeuvres (Valsalva)", "Prepare and administer adenosine 6 mg rapid IV push as ordered if vagal manoeuvres fail", "Follow with adenosine 12 mg rapid IV push as ordered if SVT persists", "Prepare for synchronized cardioversion if pharmacological interventions fail"],
    a: -1,
    co: [0, 1, 2, 3, 4],
    t: "ordered",
    r: "SVT management follows a stepwise approach: assess ABCs, attempt vagal manoeuvres first (non-invasive), adenosine 6 mg rapid push if vagal fails (followed by rapid flush), repeat with 12 mg if needed, and prepare for cardioversion as last resort for stable clients. Each step is attempted before progressing to the next.",
    s: "Cardiovascular"
  },
  {
    q: "A client on warfarin presents with an INR of 9.2 and epistaxis. Place the nursing actions in the correct order.",
    o: ["Apply direct pressure to the nares to control the nosebleed", "Hold the warfarin dose", "Notify the healthcare provider of the critically elevated INR and active bleeding", "Administer vitamin K as ordered by the provider", "Monitor the client for additional signs of bleeding"],
    a: -1,
    co: [0, 1, 2, 3, 4],
    t: "ordered",
    r: "Management of supratherapeutic INR with bleeding: control active bleeding first (direct pressure), hold the causative medication (warfarin), notify provider for orders, administer the reversal agent (vitamin K as ordered), and continue monitoring. Controlling the immediate bleeding takes priority before notification since it is a simple nursing intervention.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is caring for a client returning from cardiac catheterization via the femoral artery. Place the post-procedure nursing actions in order of priority.",
    o: ["Assess the femoral puncture site for bleeding or hematoma", "Check distal pulses, sensation, and temperature of the affected leg", "Ensure the affected leg is extended and immobilized", "Obtain post-procedure vital signs including BP and HR", "Begin post-procedure IV fluid hydration as ordered to flush contrast dye"],
    a: -1,
    co: [0, 1, 3, 2, 4],
    t: "ordered",
    r: "Post-catheterization priority: assess the puncture site for active bleeding (life-threatening complication), check distal neurovascular status (limb-threatening complication), obtain vital signs (hemodynamic stability), ensure proper positioning (prevent bleeding), and initiate hydration (prevent contrast nephropathy). Site assessment is paramount as femoral artery hemorrhage can be rapidly fatal.",
    s: "Cardiovascular"
  },
  {
    q: "A client presents with signs of acute pulmonary edema from decompensated heart failure. Place the nursing interventions in the correct order of priority.",
    o: ["Position the client upright (high Fowler's) with legs dangling over the bedside", "Apply supplemental oxygen or assist with non-invasive ventilation as ordered", "Administer IV furosemide as ordered", "Administer IV morphine as ordered if not contraindicated", "Monitor urine output and respiratory status continuously"],
    a: -1,
    co: [0, 1, 2, 3, 4],
    t: "ordered",
    r: "Acute pulmonary edema management: position upright with legs dependent (reduces preload immediately without medication), apply oxygen (address hypoxemia), administer diuretic (remove excess fluid), administer morphine if ordered (reduce preload and anxiety), and continuously monitor response. Positioning is the fastest intervention available.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse discovers a client in pulseless ventricular tachycardia. Place the emergency interventions in the correct sequence.",
    o: ["Call for help and activate the code team", "Begin chest compressions at a rate of 100 to 120 per minute", "Attach the defibrillator pads", "Deliver an unsynchronized shock (defibrillation)", "Resume CPR immediately for 2 minutes"],
    a: -1,
    co: [0, 1, 2, 3, 4],
    t: "ordered",
    r: "Pulseless VTach is treated like VFib: call for help, start compressions immediately (minimize interruptions), attach the defibrillator, deliver an unsynchronized shock (pulseless rhythms receive defibrillation, not synchronized cardioversion), then resume CPR for 2 minutes before reassessing. Early compressions and defibrillation improve survival.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is discharging a client after DVT diagnosis and initiation of anticoagulation therapy. Place the discharge teaching priorities in order from most to least critical.",
    o: ["Recognize and immediately report signs of pulmonary embolism (sudden dyspnea, chest pain, hemoptysis)", "Take anticoagulant medication exactly as prescribed and do not stop without provider guidance", "Report any signs of unusual bleeding (blood in urine, stool, or excessive bruising)", "Wear compression stockings as prescribed and avoid prolonged immobility", "Schedule and attend all follow-up appointments for anticoagulation monitoring"],
    a: -1,
    co: [0, 1, 2, 3, 4],
    t: "ordered",
    r: "DVT discharge teaching priority: PE recognition is most critical (life-threatening complication), medication adherence prevents recurrence and PE, bleeding monitoring ensures safety on anticoagulants, compression stockings and activity prevent recurrence, and follow-up appointments ensure ongoing management. PE awareness can save the client's life if it occurs.",
    s: "Cardiovascular"
  },
  {
    q: "A client with a thoracic aortic dissection arrives in the emergency department. Place the nursing interventions in the correct priority order.",
    o: ["Establish two large-bore IV lines and draw baseline blood work", "Administer IV beta-blocker as ordered to reduce heart rate and aortic wall stress", "Administer IV vasodilator as ordered once heart rate is controlled", "Prepare the client for emergent CT angiography or surgical consultation", "Continuously monitor blood pressure in both arms and assess peripheral pulses"],
    a: -1,
    co: [0, 4, 1, 2, 3],
    t: "ordered",
    r: "Aortic dissection management: establish IV access immediately (anticipate need for medications and potential blood products), continuous BP monitoring in both arms (track dissection extension), IV beta-blocker first (reduce heart rate and aortic shear stress), then vasodilator if needed (only after rate control to prevent reflex tachycardia), and prepare for definitive diagnosis/treatment.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is performing a focused cardiovascular assessment on a newly admitted client. Place the assessment steps in the correct systematic order.",
    o: ["Inspect the chest for visible pulsations, heaves, or lifts", "Palpate the point of maximal impulse (PMI) and peripheral pulses", "Auscultate heart sounds at the aortic, pulmonic, Erb's point, tricuspid, and mitral areas", "Assess jugular venous distension with the client at 45 degrees", "Evaluate lower extremities for edema, skin changes, and capillary refill"],
    a: -1,
    co: [0, 1, 3, 2, 4],
    t: "ordered",
    r: "Systematic cardiovascular assessment follows inspection, palpation, auscultation order: inspect the precordium for abnormalities, palpate PMI and pulses, assess JVD (part of inspection/palpation of neck veins), auscultate heart sounds systematically across all valve areas, and evaluate peripheral circulation. This ensures thorough, organized assessment without missing key findings.",
    s: "Cardiovascular"
  },
  {
    q: "A client with acute pericarditis develops cardiac tamponade. Place the emergency interventions in the correct order.",
    o: ["Recognize Beck's triad (hypotension, muffled heart sounds, JVD) and notify the provider", "Administer IV fluids as ordered to increase preload and maintain cardiac output temporarily", "Prepare the client for emergency pericardiocentesis", "Monitor the client's hemodynamics continuously during and after the procedure", "Assess for improvement in vital signs and heart sounds after fluid drainage"],
    a: -1,
    co: [0, 1, 2, 3, 4],
    t: "ordered",
    r: "Tamponade management: recognize the emergency and notify the provider immediately, administer IV fluids to temporarily increase preload and support output, prepare for pericardiocentesis (needle drainage of pericardial fluid, the definitive treatment), monitor hemodynamics throughout, and assess for post-procedure improvement. IV fluids buy time while preparing for the procedure.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is preparing a client for elective cardioversion for persistent atrial fibrillation. Place the pre-procedure steps in the correct order.",
    o: ["Verify the client has been anticoagulated for at least 3 weeks or has a negative TEE", "Ensure the client has been NPO for at least 6 to 8 hours", "Obtain informed consent", "Administer sedation as ordered by the provider", "Ensure the defibrillator is set to synchronized mode"],
    a: -1,
    co: [2, 0, 1, 3, 4],
    t: "ordered",
    r: "Elective cardioversion preparation: obtain informed consent first (legal requirement), verify anticoagulation status (minimum 3 weeks to prevent stroke from dislodged atrial thrombi), confirm NPO status (aspiration prevention during sedation), administer sedation, then set defibrillator to synchronized mode. Consent must precede all procedural preparation.",
    s: "Cardiovascular"
  },
  // Fill-in-blank Questions (295-309)
  {
    q: "A nurse is calculating the ankle-brachial index for a client with suspected peripheral arterial disease. The highest ankle systolic pressure is 76 mmHg and the highest brachial systolic pressure is 152 mmHg. What is the ABI? Round to two decimal places.",
    o: [],
    a: -1,
    cv: "0.50",
    t: "fill-in-blank",
    r: "ABI is calculated by dividing the highest ankle systolic pressure by the highest brachial systolic pressure: 76/152 = 0.50. An ABI below 0.5 indicates severe PAD with critical limb ischemia. This client needs urgent vascular consultation.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is calculating a heparin infusion rate. The order reads: heparin 25,000 units in 500 mL D5W, infuse at 1,200 units per hour. How many millilitres per hour should the nurse set the IV pump? Round to the nearest whole number.",
    o: [],
    a: -1,
    cv: "24",
    t: "fill-in-blank",
    r: "Concentration: 25,000 units / 500 mL = 50 units per mL. Rate: 1,200 units per hour / 50 units per mL = 24 mL per hour. Heparin is a high-alert medication requiring independent double-check verification of all calculations.",
    s: "Cardiovascular"
  },
  {
    q: "A client weighing 90 kg is prescribed enoxaparin 1 mg/kg subcutaneously every 12 hours for DVT treatment. How many milligrams should the nurse administer per dose?",
    o: [],
    a: -1,
    cv: "90",
    t: "fill-in-blank",
    r: "Enoxaparin treatment dose is calculated as 1 mg/kg per dose. For a 90 kg client: 1 mg x 90 kg = 90 mg subcutaneously every 12 hours. This is the standard therapeutic dose for DVT treatment. Prophylactic doses are typically 40 mg daily.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse calculates a client's mean arterial pressure (MAP). The client's blood pressure is 96/60 mmHg. What is the MAP? Round to the nearest whole number.",
    o: [],
    a: -1,
    cv: "72",
    t: "fill-in-blank",
    r: "MAP is calculated as: diastolic + 1/3(systolic minus diastolic) = 60 + 1/3(96 minus 60) = 60 + 1/3(36) = 60 + 12 = 72 mmHg. A MAP above 65 mmHg is generally adequate for organ perfusion. This client's MAP of 72 is within acceptable range.",
    s: "Cardiovascular"
  },
  {
    q: "A client's ECG rhythm strip shows R-R intervals of exactly 20 small boxes (each box = 0.04 seconds). What is the client's heart rate in beats per minute?",
    o: [],
    a: -1,
    cv: "75",
    t: "fill-in-blank",
    r: "Heart rate from R-R interval: 1,500 divided by the number of small boxes between R waves. 1,500 / 20 = 75 beats per minute. Alternatively, R-R interval = 20 x 0.04 = 0.8 seconds. Heart rate = 60 / 0.8 = 75 bpm. This falls within the normal sinus rhythm range.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is calculating the drip rate for a dopamine infusion. The order reads: dopamine 400 mg in 250 mL D5W, infuse at 5 mcg/kg/min. The client weighs 70 kg. How many mL per hour should the nurse set the pump? Round to the nearest whole number.",
    o: [],
    a: -1,
    cv: "13",
    t: "fill-in-blank",
    r: "Step 1: Dose per minute = 5 mcg/kg/min x 70 kg = 350 mcg/min. Step 2: Concentration = 400 mg / 250 mL = 1,600 mcg/mL. Step 3: mL/min = 350 mcg/min / 1,600 mcg/mL = 0.219 mL/min. Step 4: mL/hour = 0.219 x 60 = 13.1, rounded to 13 mL/hr.",
    s: "Cardiovascular"
  },
  {
    q: "A client with atrial fibrillation has the following pulse assessment: apical heart rate is 92 bpm and radial pulse is 76 bpm. What is the pulse deficit?",
    o: [],
    a: -1,
    cv: "16",
    t: "fill-in-blank",
    r: "Pulse deficit is calculated as apical heart rate minus radial pulse rate: 92 minus 76 = 16. A pulse deficit occurs in atrial fibrillation when some cardiac contractions are too weak to generate a palpable peripheral pulse. A significant pulse deficit indicates ineffective cardiac output.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is titrating a nitroglycerin infusion. The current rate is 10 mcg/min and the order states to increase by 5 mcg/min every 5 minutes until chest pain resolves, up to a maximum of 200 mcg/min. The concentration is 50 mg in 250 mL D5W. At the current dose of 10 mcg/min, what is the infusion rate in mL/hour? Round to the nearest tenth.",
    o: [],
    a: -1,
    cv: "3.0",
    t: "fill-in-blank",
    r: "Concentration = 50 mg / 250 mL = 0.2 mg/mL = 200 mcg/mL. Rate = 10 mcg/min / 200 mcg/mL = 0.05 mL/min. Convert to mL/hour: 0.05 x 60 = 3.0 mL/hour. Nitroglycerin is a high-alert medication requiring careful titration and continuous blood pressure monitoring.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse calculates the cardiac output for a client. The stroke volume is 65 mL and the heart rate is 80 bpm. What is the cardiac output in litres per minute? Round to one decimal place.",
    o: [],
    a: -1,
    cv: "5.2",
    t: "fill-in-blank",
    r: "Cardiac output = stroke volume x heart rate = 65 mL x 80 beats per minute = 5,200 mL per minute = 5.2 L/min. Normal cardiac output is 4 to 8 L/min. This client's cardiac output is within normal range.",
    s: "Cardiovascular"
  },
  {
    q: "A client is receiving a warfarin dose of 7.5 mg. The available tablets are 2.5 mg each. How many tablets should the nurse administer?",
    o: [],
    a: -1,
    cv: "3",
    t: "fill-in-blank",
    r: "Number of tablets = desired dose / available dose = 7.5 mg / 2.5 mg = 3 tablets. The nurse should administer 3 tablets of warfarin 2.5 mg to equal the prescribed dose of 7.5 mg.",
    s: "Cardiovascular"
  },
  // Hot-spot Questions (305-314 but we continue numbering)
  {
    q: "A nurse is reviewing a 12-lead ECG for a client with suspected inferior wall STEMI. Identify the ECG leads that would show ST elevation in an inferior wall myocardial infarction.",
    o: ["Leads II, III, and aVF", "Leads V1 through V4", "Leads I and aVL", "Leads V5 and V6"],
    a: 0,
    t: "hot-spot",
    hc: "On a standard 12-lead ECG printout, the inferior leads are positioned in the third column of the limb leads section. Lead II is in the top row left, Lead III is in the second row left, and aVF is in the third row left of the standard ECG layout.",
    ht: "Leads II, III, and aVF are the inferior leads. These leads view the inferior (diaphragmatic) surface of the heart, which is supplied primarily by the right coronary artery. ST elevation in these leads with reciprocal changes in leads I and aVL confirms an inferior STEMI.",
    r: "The inferior wall of the heart is viewed by leads II, III, and aVF. ST elevation in these leads indicates acute injury to the inferior myocardium, typically from right coronary artery occlusion. Reciprocal ST depression in lateral leads (I, aVL) further confirms the diagnosis.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is assessing a client with suspected aortic stenosis. Identify the location on the chest where the nurse would best auscultate the aortic valve area.",
    o: ["Second intercostal space, right sternal border", "Second intercostal space, left sternal border", "Fifth intercostal space, left midclavicular line", "Fourth intercostal space, left sternal border"],
    a: 0,
    t: "hot-spot",
    hc: "The nurse is performing cardiac auscultation on a client lying at 45 degrees. The stethoscope should be placed systematically across the precordium at the standard valve auscultation points.",
    ht: "The aortic valve area is at the second intercostal space, right sternal border. This is where the aortic valve sounds are best transmitted through the chest wall. A systolic crescendo-decrescendo murmur heard here suggests aortic stenosis.",
    r: "The aortic valve area is at the second right intercostal space (2nd ICS, right sternal border). The other standard auscultation points are: pulmonic (2nd ICS left sternal border), Erb's point (3rd ICS left sternal border), tricuspid (4th ICS left sternal border), and mitral/apical (5th ICS left midclavicular line).",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is assessing a post-cardiac catheterization client. The catheterization was performed via the right femoral artery. Identify the location where the nurse should assess the distal pulse to evaluate circulation to the right foot.",
    o: ["Dorsalis pedis artery on the dorsum of the right foot", "Right popliteal fossa behind the knee", "Right radial artery at the wrist", "Right carotid artery in the neck"],
    a: 0,
    t: "hot-spot",
    hc: "After right femoral artery catheterization, the nurse needs to assess circulation distal to the puncture site. The client's right leg is extended and immobilized with the groin site visible.",
    ht: "The dorsalis pedis pulse is palpated on the dorsal surface (top) of the foot, lateral to the extensor hallucis longus tendon. This is the most distal pulse point and confirms adequate arterial flow through the entire right lower extremity distal to the catheterization site.",
    r: "The dorsalis pedis artery on the dorsum of the right foot is the most appropriate distal pulse to assess after femoral artery catheterization. It confirms arterial perfusion through the entire leg. The posterior tibial pulse (behind the medial malleolus) is also acceptable. Popliteal, radial, and carotid are not distal to the femoral site or are on different extremities.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is performing an assessment on a client with suspected deep vein thrombosis in the left leg. Identify the most common anatomical location for DVT formation in the lower extremity.",
    o: ["Deep veins of the calf (posterior tibial and peroneal veins)", "Superficial veins of the anterior thigh", "Dorsalis pedis artery on the top of the foot", "Greater saphenous vein at the ankle"],
    a: 0,
    t: "hot-spot",
    hc: "The nurse is examining the client's left lower extremity. The client reports calf pain and swelling that developed after 3 days of bed rest post-surgery.",
    ht: "DVTs most commonly originate in the deep veins of the calf (posterior tibial and peroneal veins), particularly in the soleal sinuses of the calf muscles where blood flow is slowest. Proximal extension to the popliteal and femoral veins increases the risk of pulmonary embolism.",
    r: "The deep calf veins (posterior tibial and peroneal veins) are the most common sites for DVT initiation due to venous stasis in the calf muscle sinusoids. Immobility increases stasis in these areas. Superficial veins are not typical DVT sites. The dorsalis pedis is an artery. The greater saphenous is a superficial vein.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is reviewing a cardiac rhythm strip and needs to measure the PR interval. Identify where the PR interval measurement begins and ends on the ECG tracing.",
    o: ["From the beginning of the P wave to the beginning of the QRS complex", "From the peak of the P wave to the peak of the R wave", "From the end of the P wave to the end of the QRS complex", "From the beginning of the QRS complex to the end of the T wave"],
    a: 0,
    t: "hot-spot",
    hc: "The nurse is analyzing an ECG rhythm strip. The strip shows clearly defined P waves, QRS complexes, and T waves. The nurse needs to accurately measure the PR interval to assess AV conduction.",
    ht: "The PR interval is measured from the onset (beginning) of the P wave to the onset (beginning) of the QRS complex. This interval represents the time it takes for the electrical impulse to travel from the SA node through the atria, AV node, and bundle of His to the ventricles. Normal PR interval is 0.12 to 0.20 seconds.",
    r: "The PR interval extends from the start of the P wave to the start of the QRS complex, representing atrial depolarization and AV conduction time. Normal is 0.12 to 0.20 seconds (3 to 5 small boxes). Prolonged PR (greater than 0.20 seconds) indicates first-degree AV block. Peak-to-peak and other measurements are incorrect methods.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is assessing a client with suspected mitral valve disease. Identify the correct anatomical landmark for auscultating the mitral valve area.",
    o: ["Fifth intercostal space at the left midclavicular line (apex)", "Second intercostal space at the right sternal border", "Second intercostal space at the left sternal border", "Fourth intercostal space at the left sternal border"],
    a: 0,
    t: "hot-spot",
    hc: "The nurse positions the stethoscope on the client's chest to listen for mitral valve sounds. The client is positioned at 45 degrees and the nurse is ready to auscultate.",
    ht: "The mitral valve area (also known as the apical area) is located at the fifth intercostal space at the left midclavicular line. This is where the point of maximal impulse (PMI) is typically palpated and where mitral valve sounds are best heard.",
    r: "The mitral valve is best auscultated at the fifth intercostal space, left midclavicular line (the apex of the heart). This is also the location of the PMI. The 2nd right ICS is the aortic area. The 2nd left ICS is the pulmonic area. The 4th left ICS is the tricuspid area. Using the correct anatomical landmarks ensures accurate heart sound assessment.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is performing Allen's test before radial artery catheterization. Identify the artery that provides collateral circulation to the hand and must be assessed during Allen's test.",
    o: ["The ulnar artery", "The brachial artery", "The subclavian artery", "The axillary artery"],
    a: 0,
    t: "hot-spot",
    hc: "Before radial artery access for cardiac catheterization, the nurse occludes both the radial and ulnar arteries while the client clenches the fist. The client then opens the hand, and the nurse releases pressure on one artery to assess for palmar arch patency.",
    ht: "The ulnar artery provides collateral circulation to the hand through the palmar arch. During Allen's test, the nurse releases the ulnar artery while maintaining radial compression. If the hand regains colour within 5 to 7 seconds, the ulnar artery provides adequate collateral flow, making radial access safe.",
    r: "Allen's test assesses ulnar artery collateral flow before radial artery catheterization. Both arteries are occluded, the client blanches the hand, then the ulnar artery is released. Return of colour confirms adequate collateral circulation through the palmar arch, ensuring the hand will maintain perfusion if the radial artery is compromised. The brachial, subclavian, and axillary arteries are proximal and not assessed by Allen's test.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is assessing a client for jugular venous distension (JVD). Identify the correct positioning and anatomical landmark for assessing JVD.",
    o: ["Position the client at 45 degrees and observe the internal jugular vein above the clavicle for visible pulsations or distension", "Position the client flat and assess the external jugular vein below the clavicle", "Position the client upright at 90 degrees and assess the carotid artery", "Position the client prone and observe the posterior neck veins"],
    a: 0,
    t: "hot-spot",
    hc: "The nurse is assessing a client suspected of having right-sided heart failure. The client is positioned in bed with the head of bed elevated. The nurse needs to evaluate for jugular venous distension as an indicator of elevated central venous pressure.",
    ht: "JVD is assessed with the client at a 45-degree angle. The internal jugular vein runs from the ear lobe to the medial end of the clavicle. Visible distension or pulsations more than 3 cm above the sternal angle indicate elevated central venous pressure, suggesting right heart failure or fluid overload.",
    r: "JVD assessment requires 45-degree positioning because at this angle, the jugular veins in a normovolemic client should collapse. Distension at 45 degrees indicates elevated central venous pressure. The internal jugular vein is preferred over the external. Flat positioning makes JVD assessment unreliable as veins may be distended normally. Prone and upright positions are incorrect.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is identifying the location for proper ECG lead V1 placement. Identify where lead V1 should be positioned on the client's chest.",
    o: ["Fourth intercostal space at the right sternal border", "Fourth intercostal space at the left sternal border", "Fifth intercostal space at the left midclavicular line", "Second intercostal space at the right sternal border"],
    a: 0,
    t: "hot-spot",
    hc: "The nurse is applying a 12-lead ECG to a client. The precordial leads (V1 through V6) must be accurately placed across the chest for proper cardiac rhythm interpretation.",
    ht: "Lead V1 is placed at the fourth intercostal space, right sternal border. To locate this: palpate the sternal angle (Angle of Louis) where the manubrium meets the body of the sternum, move laterally to find the second rib, count down two more intercostal spaces to the fourth, and place the electrode at the right sternal border.",
    r: "V1 placement at the 4th intercostal space, right sternal border is critical for accurate ECG interpretation. V2 is at the 4th ICS left sternal border. Incorrect lead placement can mimic pathology or mask true abnormalities. The 4th ICS left sternal border is V2, not V1. The 5th ICS left midclavicular line is V4. The 2nd right ICS is the aortic auscultation point.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is assessing a client for the point of maximal impulse (PMI). Identify the normal anatomical location where the PMI should be palpated.",
    o: ["Fifth intercostal space at the left midclavicular line", "Second intercostal space at the right sternal border", "Third intercostal space at the left sternal border", "Xiphoid process at the lower sternum"],
    a: 0,
    t: "hot-spot",
    hc: "The nurse places their hand on the client's chest to palpate the PMI as part of a cardiovascular assessment. The client is in a supine position slightly turned to the left lateral position to enhance the palpation.",
    ht: "The PMI is normally located at the fifth intercostal space, left midclavicular line (the apex of the heart). A PMI displaced laterally or inferiorly suggests cardiomegaly, which may occur in conditions such as heart failure or valvular disease. The left lateral position brings the heart closer to the chest wall for easier palpation.",
    r: "The PMI is normally at the 5th left intercostal space, midclavicular line, corresponding to the cardiac apex. Displacement laterally or inferiorly suggests ventricular hypertrophy or dilation. The 2nd right ICS is the aortic area. The 3rd left ICS is Erb's point. The xiphoid is not the PMI location. Accurate PMI assessment is fundamental to cardiovascular examination.",
    s: "Cardiovascular"
  },
  // ===== ADDITIONAL MCQ QUESTIONS (230-256) =====
  {
    q: "A 74-year-old client with chronic atrial fibrillation has a resting heart rate of 112 bpm. The client takes digoxin and diltiazem. BP is 124/76. Which finding should the nurse report to the healthcare provider?",
    o: ["The heart rate of 112 bpm indicates inadequate rate control despite current medications", "The blood pressure of 124/76 is dangerously low", "The client's age makes rate control unnecessary", "A heart rate of 112 is normal for clients with atrial fibrillation"],
    a: 0,
    r: "In chronic AFib, the goal is rate control (typically resting HR below 100 bpm). A rate of 112 bpm despite digoxin and diltiazem suggests inadequate control, increasing the risk of tachycardia-induced cardiomyopathy. BP 124/76 is acceptable. Age does not negate rate control needs. Persistent tachycardia is not acceptable.",
    s: "Cardiovascular"
  },
  {
    q: "A 56-year-old client with hypertension and bilateral renal artery stenosis is prescribed an ACE inhibitor. Which concern should the nurse identify before administration?",
    o: ["ACE inhibitors can cause acute kidney failure in clients with bilateral renal artery stenosis by reducing glomerular filtration pressure", "ACE inhibitors are the preferred treatment for bilateral renal artery stenosis", "The medication will only affect blood pressure in one kidney", "Renal artery stenosis has no impact on ACE inhibitor safety"],
    a: 0,
    r: "In bilateral renal artery stenosis, the kidneys depend on angiotensin II-mediated efferent arteriolar constriction to maintain glomerular filtration. ACE inhibitors block this mechanism, potentially causing acute kidney failure. This is a relative contraindication that must be communicated to the provider. Alternative antihypertensives should be considered.",
    s: "Cardiovascular"
  },
  {
    q: "A 82-year-old client with heart failure is prescribed furosemide 80 mg IV push. The nurse notes the client's most recent hearing assessment indicated mild hearing loss. Which nursing consideration is most important?",
    o: ["Administer the IV furosemide slowly (no faster than 20 mg/min) to reduce the risk of ototoxicity", "Administer the medication as a rapid IV bolus for maximum effect", "Hearing loss is irrelevant to furosemide administration", "Hold the furosemide permanently due to the client's hearing impairment"],
    a: 0,
    r: "IV furosemide can cause ototoxicity, especially when administered rapidly or in high doses. Clients with pre-existing hearing loss are at higher risk. The recommended rate is no faster than 20 mg/min for IV push. Rapid bolus increases ototoxicity risk. Hearing status is relevant. Permanent holding is excessive, but careful administration is essential.",
    s: "Cardiovascular"
  },
  {
    q: "A 64-year-old client with stable angina uses a transdermal nitroglycerin patch. Which instruction should the nurse include about patch application?",
    o: ["Remove the patch for 10 to 12 hours each day, usually overnight, to prevent tolerance from developing", "Keep the patch on continuously 24 hours a day for maximum protection", "Apply the patch directly over the heart for best absorption", "Remove the patch only when experiencing chest pain"],
    a: 0,
    r: "A nitrate-free interval of 10 to 12 hours daily (typically overnight) prevents the development of nitrate tolerance, which diminishes the drug's effectiveness. Continuous 24-hour application leads to tolerance. The patch can be applied to any clean, hairless area of the trunk, not necessarily over the heart. It should be worn as prescribed, not only during pain.",
    s: "Cardiovascular"
  },
  {
    q: "A 70-year-old client is diagnosed with a Type B (descending) aortic dissection. BP is 168/96 after initial IV beta-blocker therapy. Which management approach does the nurse anticipate?",
    o: ["Continued aggressive medical management with IV antihypertensives, pain control, and close monitoring in an ICU setting", "Immediate open surgical repair", "Discharge home on oral antihypertensives with outpatient follow-up in 2 weeks", "No treatment is required for Type B dissections"],
    a: 0,
    r: "Uncomplicated Type B (descending) aortic dissections are managed medically with aggressive blood pressure control, pain management, and ICU monitoring. Surgery is reserved for complicated cases (malperfusion, rupture, persistent pain). Immediate surgery is typical for Type A (ascending). Discharge is premature. All dissections require treatment.",
    s: "Cardiovascular"
  },
  {
    q: "A 55-year-old client with PAD and an ABI of 0.7 asks about the role of statin therapy in their treatment. Which response by the nurse is most accurate?",
    o: ["Statins reduce cardiovascular risk by lowering cholesterol and stabilizing atherosclerotic plaques, slowing PAD progression", "Statins only benefit clients with coronary artery disease, not PAD", "Statins directly improve blood flow to the legs by dilating arteries", "Statin therapy is not recommended for clients with an ABI above 0.5"],
    a: 0,
    r: "Statins are recommended for all clients with PAD regardless of cholesterol levels because they stabilize atherosclerotic plaques, reduce inflammation, and decrease cardiovascular events (MI, stroke). PAD is an atherosclerotic disease like CAD. Statins do not directly vasodilate. They are recommended even with ABI above 0.5.",
    s: "Cardiovascular"
  },
  {
    q: "A 78-year-old client with a mechanical aortic valve reports dark, tarry stools for the past 2 days. The INR is 3.8. BP is 102/64 and HR is 104. Which nursing action is the priority?",
    o: ["Notify the healthcare provider immediately of suspected GI bleeding with supratherapeutic anticoagulation", "Administer the next scheduled warfarin dose as prescribed", "Encourage the client to eat more fibre to normalize stool colour", "Document the finding and recheck stool colour in 24 hours"],
    a: 0,
    r: "Dark tarry stools (melena) indicate upper GI bleeding. Combined with an INR of 3.8 (above therapeutic 2.5 to 3.5 for mechanical valves) and signs of hemodynamic compromise (low BP, tachycardia), this is a medical emergency. The provider must be notified for urgent evaluation, possible warfarin reversal, and endoscopy. Continuing warfarin or waiting is dangerous.",
    s: "Cardiovascular"
  },
  {
    q: "A 60-year-old client with chronic venous insufficiency has bilateral lower leg edema, brownish skin discolouration around the ankles, and a shallow, irregularly shaped ulcer above the medial malleolus. Which wound care intervention is most appropriate?",
    o: ["Apply compression therapy as ordered and elevate the legs during rest to promote venous return", "Apply compression therapy and keep the legs in a dependent position", "Avoid compression and apply arterial ulcer wound care protocols", "Apply ice packs to reduce the edema and cover the ulcer loosely"],
    a: 0,
    r: "Venous ulcers (medial malleolus location, shallow, irregular edges, brownish discolouration from hemosiderin staining) are treated with compression therapy to promote venous return and leg elevation during rest. Legs should be elevated, not dependent. This is not an arterial ulcer, so arterial protocols are incorrect. Ice packs do not treat chronic venous insufficiency.",
    s: "Cardiovascular"
  },
  {
    q: "A 66-year-old client is receiving amiodarone for recurrent ventricular tachycardia. The nurse reviews the latest thyroid function tests showing TSH 0.1 mIU/L (normal 0.5 to 5.0). Which finding does this represent?",
    o: ["Amiodarone-induced hyperthyroidism, which requires provider notification", "Normal thyroid function during amiodarone therapy", "A laboratory error that does not require follow-up", "Expected TSH suppression that is beneficial for cardiac rhythm"],
    a: 0,
    r: "Amiodarone contains iodine and can cause both hyper- and hypothyroidism. A TSH of 0.1 (well below normal) indicates hyperthyroidism, which can worsen cardiac dysrhythmias and requires urgent provider notification. This is not normal on amiodarone. The result warrants follow-up. TSH suppression is not beneficial and may destabilize the cardiac rhythm.",
    s: "Cardiovascular"
  },
  {
    q: "A 58-year-old client with heart failure asks why they should limit sodium intake. Which explanation by the nurse best demonstrates the pathophysiological rationale?",
    o: ["Excess sodium causes your body to retain water, increasing blood volume and making your weakened heart work harder to pump", "Sodium directly damages heart muscle cells", "Sodium restriction is only important for clients with kidney disease, not heart failure", "Limiting sodium improves your heart's ability to contract more forcefully"],
    a: 0,
    r: "Sodium increases water retention through osmotic effects and activation of the renin-angiotensin-aldosterone system. In heart failure, the already compromised ventricle cannot handle the increased preload from volume expansion, leading to congestion and symptom worsening. Sodium does not directly damage myocytes. It is important in HF, not just kidney disease. It does not improve contractility.",
    s: "Cardiovascular"
  },
  {
    q: "A 73-year-old client with a history of DVT presents 6 months after completing anticoagulation therapy with new unilateral leg swelling, heaviness, and skin changes. What condition should the nurse suspect?",
    o: ["Post-thrombotic syndrome (PTS) from chronic venous damage caused by the prior DVT", "Recurrent acute DVT requiring immediate anticoagulation", "Lymphedema from a separate condition", "Normal aging changes in the lower extremity"],
    a: 0,
    r: "Post-thrombotic syndrome develops in up to 50% of DVT clients due to chronic venous valve damage and venous hypertension. Symptoms include chronic leg swelling, heaviness, pain, and skin changes (hyperpigmentation, lipodermatosclerosis). While recurrent DVT must be ruled out with ultrasound, the chronic progressive nature suggests PTS. These are not normal aging changes.",
    s: "Cardiovascular"
  },
  {
    q: "A 68-year-old client with a permanent pacemaker set at 72 bpm presents with fatigue, dizziness, and a heart rate of 72 bpm. BP drops from 128/76 supine to 96/58 standing. The nurse suspects pacemaker syndrome. Which explanation is most accurate?",
    o: ["Pacemaker syndrome occurs when the pacemaker causes loss of AV synchrony, reducing cardiac output despite maintaining the set heart rate", "The pacemaker is malfunctioning and needs immediate replacement", "The symptoms are unrelated to the pacemaker", "The pacemaker rate needs to be increased to 100 bpm"],
    a: 0,
    r: "Pacemaker syndrome results from loss of AV synchrony (atria and ventricles not contracting in proper sequence), reducing cardiac output by 15 to 25% despite adequate heart rate. It commonly occurs with single-chamber ventricular pacing. Symptoms include fatigue, dizziness, and orthostatic hypotension. The device may function correctly technically but require reprogramming or upgrading to dual-chamber.",
    s: "Cardiovascular"
  },
  {
    q: "A 50-year-old client with Marfan syndrome asks about the risk of aortic complications. Which response by the nurse is most appropriate?",
    o: ["Marfan syndrome weakens the connective tissue in the aortic wall, increasing your risk for aortic aneurysm and dissection. Regular monitoring with echocardiography is essential", "Marfan syndrome only affects the eyes and joints, not the cardiovascular system", "Aortic complications from Marfan syndrome only occur after age 70", "There is no connection between Marfan syndrome and aortic disease"],
    a: 0,
    r: "Marfan syndrome involves a fibrillin-1 gene mutation causing defective connective tissue, particularly affecting the aorta. Cystic medial necrosis weakens the aortic wall, predisposing to dilation, aneurysm formation, and dissection, often at younger ages. It affects the cardiovascular system significantly. Regular echocardiographic surveillance and beta-blocker therapy are standard management.",
    s: "Cardiovascular"
  },
  {
    q: "A 62-year-old client recovering from CABG surgery on post-operative day 3 develops a temperature of 38.6 degrees Celsius, sternal wound redness, and purulent drainage. WBC is 16,800/mm3. Which complication does the nurse suspect?",
    o: ["Sternal wound infection (mediastinitis) requiring urgent provider notification", "Normal post-operative inflammatory response", "Allergic reaction to surgical sutures", "Expected drainage from internal mammary artery harvest site"],
    a: 0,
    r: "Fever, sternal wound erythema, purulent drainage, and elevated WBC on day 3 post-CABG strongly suggest sternal wound infection or mediastinitis, a serious complication with high morbidity and mortality. Normal inflammatory response would be resolving by day 3 without purulence. Suture allergy presents differently. Purulent drainage is never expected.",
    s: "Cardiovascular"
  },
  {
    q: "A 71-year-old client with heart failure and chronic kidney disease (eGFR 28 mL/min) is prescribed a DOAC for atrial fibrillation. Which consideration should the nurse communicate to the healthcare provider?",
    o: ["DOACs require dose adjustment or may be contraindicated in severe renal impairment, as they are partially cleared by the kidneys", "DOACs are safe at full dose regardless of kidney function", "Only warfarin is affected by kidney function", "The eGFR of 28 mL/min has no relevance to anticoagulant selection"],
    a: 0,
    r: "DOACs (dabigatran, rivaroxaban, apixaban, edoxaban) have varying degrees of renal clearance. With eGFR 28 mL/min (Stage 4 CKD), some DOACs require dose reduction and others may be contraindicated. Dabigatran is most renally dependent (80% renal clearance). The nurse should communicate this concern so the provider can select the safest agent and dose.",
    s: "Cardiovascular"
  },
  {
    q: "A 48-year-old client presents with sudden onset of a cold, pulseless, pale right leg. The onset was 2 hours ago. The client has atrial fibrillation and is not on anticoagulation. What does the nurse suspect, and what is the priority?",
    o: ["Acute arterial embolism from an atrial thrombus. This is a limb-threatening emergency requiring immediate vascular surgery consultation", "Chronic peripheral arterial disease that can be managed with lifestyle modifications", "Deep vein thrombosis requiring elevation and anticoagulation", "Muscle cramp from dehydration that will resolve with fluids"],
    a: 0,
    r: "Sudden onset of the 6 Ps (pain, pallor, pulselessness, paresthesia, paralysis, poikilothermia) in a client with uncontrolled AFib strongly suggests arterial embolism from an atrial thrombus. This is a surgical emergency, as ischemia beyond 6 hours causes irreversible tissue damage. Chronic PAD has gradual onset. DVT presents differently. Cramps do not cause pulselessness.",
    s: "Cardiovascular"
  },
  {
    q: "A 63-year-old client with a recent STEMI asks about cardiac rehabilitation. The client is worried about exercising after a heart attack. Which response by the nurse is most therapeutic?",
    o: ["It is understandable to feel worried. Cardiac rehabilitation is supervised by trained professionals who monitor your heart during exercise to ensure safety, and the program is tailored to your abilities", "You do not need to worry because heart attacks are not serious", "Cardiac rehabilitation is optional and most clients skip it", "You should not exercise at all for the next year to let your heart heal completely"],
    a: 0,
    r: "Acknowledging the client's fear and providing reassurance about the supervised nature of cardiac rehabilitation reduces anxiety and promotes adherence. Cardiac rehabilitation is evidence-based and reduces mortality by 20 to 30%. Minimizing the MI severity is dismissive. Cardiac rehab is strongly recommended, not optional. A year of inactivity is excessive and harmful.",
    s: "Cardiovascular"
  },
  {
    q: "A 75-year-old client with an AAA repair (EVAR) done 6 months ago presents for follow-up CT angiography. The imaging reveals a Type II endoleak. Which explanation by the nurse is most accurate?",
    o: ["A Type II endoleak means blood is flowing into the aneurysm sac from branch arteries. It often resolves on its own but requires ongoing surveillance", "A Type II endoleak means the graft has completely failed and emergency surgery is needed", "Endoleaks never occur after EVAR procedures", "A Type II endoleak is the most dangerous type and requires immediate intervention"],
    a: 0,
    r: "Type II endoleaks are the most common type after EVAR, caused by retrograde flow from branch vessels (lumbar or inferior mesenteric arteries) into the aneurysm sac. Most resolve spontaneously. They require surveillance but are typically not immediately dangerous. Type I and III endoleaks are more concerning as they involve flow around the graft sealing zones.",
    s: "Cardiovascular"
  },
  {
    q: "A 69-year-old client taking amiodarone reports new onset of blurred vision and sees coloured halos around lights. Which amiodarone-related complication should the nurse suspect?",
    o: ["Corneal microdeposits or optic neuropathy, requiring urgent ophthalmology referral", "Normal aging-related vision changes", "A temporary side effect that resolves without intervention", "Digitalis toxicity rather than amiodarone-related changes"],
    a: 0,
    r: "Amiodarone causes corneal microdeposits in nearly all clients (usually asymptomatic) but can also cause optic neuropathy, which is a serious threat to vision. Blurred vision and halos warrant urgent ophthalmologic evaluation. These are not normal aging changes. Visual symptoms from amiodarone should not be dismissed. The client is on amiodarone, not digoxin.",
    s: "Cardiovascular"
  },
  {
    q: "A 58-year-old client is being discharged after a mechanical mitral valve replacement. The nurse teaches about warfarin therapy. What is the target INR range for this client?",
    o: ["2.5 to 3.5 for a mechanical mitral valve", "1.0 to 1.5 for all valve replacements", "2.0 to 3.0, the same as for atrial fibrillation", "4.0 to 5.0 for maximum clot prevention"],
    a: 0,
    r: "Mechanical mitral valves require a higher INR target (2.5 to 3.5) compared to mechanical aortic valves (2.0 to 3.0) because the lower-pressure left atrium and mitral position have higher thrombotic risk. An INR of 1.0 to 1.5 provides inadequate anticoagulation. The 2.0 to 3.0 range is for aortic mechanical valves and AFib. INR 4.0 to 5.0 carries excessive bleeding risk.",
    s: "Cardiovascular"
  },
  {
    q: "A 77-year-old client with heart failure is being evaluated for a left ventricular assist device (LVAD). The nurse explains that an LVAD is appropriate in which clinical scenario?",
    o: ["As a bridge to heart transplant or as destination therapy for clients with end-stage heart failure who are not candidates for transplant", "As a first-line treatment for newly diagnosed mild heart failure", "As a temporary device used only during cardiac surgery", "As a replacement for all heart failure medications"],
    a: 0,
    r: "LVADs are mechanical circulatory support devices used in end-stage heart failure either as a bridge to transplant (keeping the client alive until a donor heart is available) or as destination therapy (permanent support for clients ineligible for transplant). They are not first-line therapy. They are implanted devices, not temporary surgical tools. Clients still require medications.",
    s: "Cardiovascular"
  },
  {
    q: "A 64-year-old client with a history of endocarditis presents with flank pain, haematuria, and a fever of 38.9 degrees Celsius. What complication does the nurse suspect?",
    o: ["Septic embolism to the kidney (renal infarction) from vegetations on the infected valve", "Urinary tract infection unrelated to endocarditis", "Normal side effect of antibiotic therapy", "Kidney stone from immobility"],
    a: 0,
    r: "In endocarditis, vegetations on the valve can fragment and embolize to various organs. Flank pain with haematuria in the context of endocarditis and fever strongly suggests renal septic embolism causing renal infarction. While UTI is possible, the association with endocarditis makes embolism more likely. These are not typical antibiotic side effects. Kidney stones are not related to endocarditis.",
    s: "Cardiovascular"
  },
  {
    q: "A 71-year-old client with PAD asks about the use of pentoxifylline. Which explanation by the nurse is correct?",
    o: ["Pentoxifylline improves blood flow by reducing blood viscosity and increasing red blood cell flexibility, which may help with walking distance", "Pentoxifylline is a potent vasodilator that opens blocked arteries", "Pentoxifylline is an anticoagulant similar to warfarin", "Pentoxifylline replaces the need for exercise in PAD management"],
    a: 0,
    r: "Pentoxifylline is a hemorrheologic agent that reduces blood viscosity and improves red blood cell deformability, enhancing microcirculation in ischemic tissue. It may modestly improve walking distance in claudication. It is not a direct vasodilator or anticoagulant. Exercise remains the cornerstone of PAD management and cannot be replaced by any medication.",
    s: "Cardiovascular"
  },
  {
    q: "A 66-year-old client who had a CABG 6 weeks ago reports persistent numbness along the inner left leg from the knee to the ankle. Which explanation is most likely?",
    o: ["The saphenous nerve was affected during harvesting of the saphenous vein graft from the leg, which is a common post-operative finding", "The client is developing peripheral neuropathy from diabetes", "The numbness indicates graft failure requiring emergency intervention", "The incision site is infected causing nerve damage"],
    a: 0,
    r: "Saphenous nerve injury during greater saphenous vein harvesting for CABG is a well-known complication, causing numbness along the medial leg. The saphenous nerve runs adjacent to the saphenous vein. This typically improves over months but may be permanent. While diabetes and infection are considerations, the anatomical distribution along the vein harvest site is characteristic.",
    s: "Cardiovascular"
  },
  {
    q: "A 59-year-old client with hypertension has a serum potassium of 2.8 mEq/L despite taking oral potassium supplements. The client's BP is consistently 158/96 despite three antihypertensive medications. Which condition should the nurse suspect as a secondary cause of hypertension?",
    o: ["Primary aldosteronism (Conn syndrome), which causes sodium retention, potassium wasting, and resistant hypertension", "Essential hypertension with poor medication compliance", "Cushing syndrome from adrenal cortisol excess", "Pheochromocytoma from catecholamine excess"],
    a: 0,
    r: "Resistant hypertension (uncontrolled on 3+ medications) with persistent hypokalemia despite supplementation is classic for primary aldosteronism. Excess aldosterone causes sodium and water retention (hypertension) and potassium wasting (hypokalemia). Screening involves aldosterone-to-renin ratio. Poor compliance is possible but does not explain hypokalemia. Cushing and pheo have different presentations.",
    s: "Cardiovascular"
  },
  // ===== ADDITIONAL SATA QUESTIONS (257-282) =====
  {
    q: "A nurse is caring for a client with an acute STEMI. Which medications does the nurse anticipate administering as part of the initial treatment? Select all that apply.",
    o: ["Aspirin", "Nitroglycerin", "Morphine if pain persists", "Oral vitamin K", "A beta-blocker if not contraindicated", "A proton pump inhibitor for gastric protection"],
    a: -1,
    ca: [0, 1, 2, 4],
    t: "sata",
    r: "Standard initial STEMI treatment follows the MONA framework: Morphine (if pain persists), Oxygen (if SpO2 below 94%), Nitroglycerin (for ischemic pain), Aspirin (antiplatelet), and beta-blockers (reduce myocardial oxygen demand). Vitamin K is the warfarin antidote and is not indicated. PPIs are not part of acute MI management unless there is a specific GI indication.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is assessing a client with suspected aortic dissection. Which findings support this diagnosis? Select all that apply.",
    o: ["Sudden, severe, tearing chest or back pain", "Significant blood pressure difference between arms (greater than 20 mmHg)", "New aortic regurgitation murmur", "Bilateral lower extremity edema with JVD", "Diminished or absent peripheral pulses", "Altered level of consciousness from cerebral malperfusion"],
    a: -1,
    ca: [0, 1, 2, 4, 5],
    t: "sata",
    r: "Aortic dissection presents with sudden tearing pain, BP differential between arms (dissection flap occludes branches), new aortic regurgitation (flap involves aortic root), pulse deficits (compromised branch arteries), and altered consciousness (carotid involvement). Bilateral edema with JVD suggests heart failure or tamponade, not specifically dissection.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is providing education to a client with a newly implanted ICD. Which teaching points should be included? Select all that apply.",
    o: ["Carry your ICD identification card at all times", "Report any device shocks to your cardiologist promptly", "Avoid strong magnetic fields such as MRI (unless device is MRI-conditional)", "You may resume driving immediately after ICD implantation", "Avoid placing cell phones directly over the device", "Report symptoms of dizziness, fainting, or palpitations"],
    a: -1,
    ca: [0, 1, 2, 4, 5],
    t: "sata",
    r: "ICD education includes carrying identification, reporting shocks, avoiding strong electromagnetic fields (MRI unless conditional), keeping cell phones away from the device (at least 15 cm), and reporting symptoms that may indicate rhythm disturbances. Driving restrictions typically apply for several months after ICD implantation due to the risk of syncope from dysrhythmias.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is monitoring a client receiving IV amiodarone for ventricular tachycardia. Which adverse effects should the nurse watch for? Select all that apply.",
    o: ["Hypotension during the infusion", "Pulmonary toxicity (cough, dyspnea)", "Thyroid dysfunction (hypo or hyperthyroidism)", "Phlebitis at the IV site", "Corneal microdeposits affecting vision", "Immediate weight loss"],
    a: -1,
    ca: [0, 1, 2, 3, 4],
    t: "sata",
    r: "Amiodarone has extensive adverse effects: hypotension during IV infusion, pulmonary toxicity (potentially fatal), thyroid dysfunction (contains iodine), phlebitis/tissue necrosis at IV sites (it is a vesicant requiring central line ideally), and corneal microdeposits. Amiodarone does not cause weight loss; it may cause weight changes from thyroid effects.",
    s: "Cardiovascular"
  },
  {
    q: "A client with cardiogenic shock is being monitored with a pulmonary artery catheter. Which hemodynamic parameters are consistent with cardiogenic shock? Select all that apply.",
    o: ["Cardiac index below 2.2 L/min/m2", "Pulmonary capillary wedge pressure above 18 mmHg", "Systemic vascular resistance elevated", "Central venous pressure elevated", "Systemic vascular resistance decreased", "Cardiac index above 4.0 L/min/m2"],
    a: -1,
    ca: [0, 1, 2, 3],
    t: "sata",
    r: "Cardiogenic shock shows low cardiac index (pump failure), elevated PCWP (blood backing up into pulmonary circulation), elevated SVR (compensatory vasoconstriction), and elevated CVP (right-sided congestion). Decreased SVR characterizes distributive (septic) shock. Elevated cardiac index is inconsistent with cardiogenic shock.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is caring for a client who had an endovascular aortic aneurysm repair (EVAR) 4 hours ago. Which post-procedure assessments are essential? Select all that apply.",
    o: ["Monitor bilateral pedal pulses and compare to baseline", "Assess the femoral access sites for bleeding or hematoma", "Monitor urine output for signs of contrast-induced nephropathy", "Check serum creatinine levels post-procedure", "Allow the client to ambulate immediately to prevent DVT", "Observe for signs of bowel ischemia (abdominal pain, bloody stool)"],
    a: -1,
    ca: [0, 1, 2, 3, 5],
    t: "sata",
    r: "Post-EVAR assessments include pedal pulse monitoring (graft-related limb ischemia), access site assessment (bleeding), renal function monitoring (contrast nephropathy and potential renal artery coverage), and bowel assessment (inferior mesenteric artery coverage causing ischemia). Immediate ambulation is not appropriate after femoral access with large-bore sheaths.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is teaching a client about risk factors for developing infective endocarditis. Which factors increase the risk? Select all that apply.",
    o: ["History of previous endocarditis", "Presence of a prosthetic heart valve", "Intravenous drug use", "Good dental hygiene with regular checkups", "Congenital heart defects", "Indwelling central venous catheters"],
    a: -1,
    ca: [0, 1, 2, 4, 5],
    t: "sata",
    r: "Risk factors for infective endocarditis include previous endocarditis, prosthetic valves (providing surfaces for bacterial colonization), IV drug use (introducing bacteria directly into the bloodstream), congenital heart defects (turbulent flow promotes bacterial adhesion), and indwelling catheters (portal of entry for organisms). Good dental hygiene reduces risk rather than increasing it.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is caring for a post-CABG client on day 1. Which assessment findings require immediate reporting? Select all that apply.",
    o: ["Chest tube output of 200 mL/hour for 2 consecutive hours", "Temperature of 38.8 degrees Celsius with sternal wound erythema", "New onset of atrial fibrillation with heart rate of 152 bpm", "Urine output of 50 mL/hour", "Mild incisional pain managed with prescribed analgesics", "Significant decrease in hemoglobin from 130 to 85 g/L"],
    a: -1,
    ca: [0, 1, 2, 5],
    t: "sata",
    r: "Post-CABG concerns requiring immediate reporting: excessive chest tube output (greater than 100 mL/hr suggests hemorrhage), signs of wound infection (fever with erythema), new-onset rapid AFib (hemodynamic compromise), and significant hemoglobin drop (post-operative bleeding). Urine output of 50 mL/hr is adequate. Mild controlled pain is expected.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is teaching a client with heart failure about medications. Which medications are considered first-line therapy for HFrEF? Select all that apply.",
    o: ["ACE inhibitors or ARBs", "Beta-blockers (carvedilol, metoprolol succinate, bisoprolol)", "Aldosterone antagonists (spironolactone, eplerenone)", "Calcium channel blockers (amlodipine, diltiazem)", "Sacubitril/valsartan (as replacement for ACE inhibitor)", "Loop diuretics for symptom management"],
    a: -1,
    ca: [0, 1, 2, 4, 5],
    t: "sata",
    r: "Guideline-directed medical therapy for HFrEF includes ACE inhibitors/ARBs (reduce afterload and remodeling), evidence-based beta-blockers (reduce mortality), aldosterone antagonists (reduce mortality), sacubitril/valsartan (superior to ACE inhibitor alone), and loop diuretics (symptom management of congestion). Non-dihydropyridine calcium channel blockers (diltiazem) are generally avoided in HFrEF as they can worsen heart failure.",
    s: "Cardiovascular"
  },
  {
    q: "A client with PE is on anticoagulation therapy. Which signs should the nurse teach the client to report immediately? Select all that apply.",
    o: ["Blood in the urine or stool", "Prolonged bleeding from cuts", "Severe headache with sudden onset", "Excessive bruising without clear cause", "Mild soreness at injection sites", "Vomiting blood or coffee-ground emesis"],
    a: -1,
    ca: [0, 1, 2, 3, 5],
    t: "sata",
    r: "Anticoagulant bleeding complications requiring immediate reporting include haematuria, GI bleeding (blood in stool), prolonged bleeding from cuts, sudden severe headache (possible intracranial hemorrhage), unexplained bruising, and hematemesis/coffee-ground emesis (upper GI bleed). Mild injection site soreness is expected with subcutaneous anticoagulants.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is caring for a client in the early post-operative period after heart transplant. Which medications will be part of the lifelong immunosuppression regimen? Select all that apply.",
    o: ["Tacrolimus (calcineurin inhibitor)", "Mycophenolate mofetil (antiproliferative agent)", "Corticosteroids (prednisone)", "Acetaminophen for pain management", "Antithymocyte globulin for induction therapy", "Aspirin for antiplatelet therapy"],
    a: -1,
    ca: [0, 1, 2],
    t: "sata",
    r: "The standard triple immunosuppression regimen for heart transplant includes a calcineurin inhibitor (tacrolimus), an antiproliferative agent (mycophenolate), and corticosteroids (prednisone), all of which are lifelong. Antithymocyte globulin is used for induction (short-term) only. Acetaminophen and aspirin are not immunosuppressants.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is assessing a client with suspected cardiogenic shock. Which clinical findings support this diagnosis? Select all that apply.",
    o: ["Systolic BP below 90 mmHg for more than 30 minutes", "Cold, clammy, mottled skin", "Oliguria (urine output less than 30 mL/hr)", "Altered mental status (confusion, restlessness)", "Bounding peripheral pulses with warm extremities", "Tachycardia as a compensatory mechanism"],
    a: -1,
    ca: [0, 1, 2, 3, 5],
    t: "sata",
    r: "Cardiogenic shock presents with sustained hypotension, cold/clammy skin (poor perfusion from vasoconstriction), oliguria (inadequate renal perfusion), altered mentation (cerebral hypoperfusion), and compensatory tachycardia. Bounding pulses with warm extremities suggest vasodilatory (distributive) shock, not cardiogenic shock.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is educating a client about modifiable risk factors for coronary artery disease. Which factors can the client change to reduce their risk? Select all that apply.",
    o: ["Smoking cessation", "Blood pressure management", "Regular physical activity", "Cholesterol management through diet and medications", "Family history of heart disease", "Stress management and mental health support"],
    a: -1,
    ca: [0, 1, 2, 3, 5],
    t: "sata",
    r: "Modifiable CAD risk factors include smoking (cessation reduces risk significantly within 1 year), hypertension control, regular exercise (150 min/week moderate), cholesterol management (diet and statins), and stress management. Family history is a non-modifiable risk factor that cannot be changed but helps guide screening intensity.",
    s: "Cardiovascular"
  },
  // ===== ADDITIONAL ORDERED QUESTIONS =====
  {
    q: "A client with new-onset heart failure is being started on an ACE inhibitor and a beta-blocker. Place the steps for safe medication initiation in the correct order.",
    o: ["Obtain baseline vital signs including BP and HR", "Start the ACE inhibitor at a low dose first", "Monitor renal function and potassium after starting the ACE inhibitor", "Introduce the beta-blocker at a low dose once the ACE inhibitor is tolerated", "Gradually titrate both medications to target doses over weeks to months"],
    a: -1,
    co: [0, 1, 2, 3, 4],
    t: "ordered",
    r: "Heart failure medication initiation follows a careful, stepwise approach: baseline assessment first, then start the ACE inhibitor (addresses neurohormonal activation), monitor for adverse effects (renal impairment, hyperkalemia), add beta-blocker once ACE inhibitor is tolerated (beta-blockers should not be started during decompensation), then uptitrate both to target doses gradually to avoid hypotension and bradycardia.",
    s: "Cardiovascular"
  },
  {
    q: "A client develops a hypertensive crisis with BP 234/142 and severe headache. Place the emergency management steps in the correct order.",
    o: ["Establish IV access and place the client on continuous cardiac and BP monitoring", "Administer IV antihypertensive medication as ordered (target 25% MAP reduction in first hour)", "Reassess neurological status and BP every 5 to 10 minutes during infusion", "Once BP is stabilized, transition to oral antihypertensive therapy over 24 to 48 hours", "Investigate the underlying cause of the hypertensive crisis"],
    a: -1,
    co: [0, 1, 2, 3, 4],
    t: "ordered",
    r: "Hypertensive crisis management: establish IV access and monitoring first (continuous BP monitoring is essential), administer IV antihypertensive with controlled reduction (no more than 25% MAP reduction in the first hour to prevent cerebral hypoperfusion), reassess frequently, transition to oral therapy once stable, and then investigate the underlying cause (medication non-adherence, secondary causes).",
    s: "Cardiovascular"
  },
  {
    q: "A client with endocarditis is started on IV antibiotic therapy. Place the steps for initiating treatment in the correct order.",
    o: ["Obtain at least 3 sets of blood cultures from different sites before starting antibiotics", "Initiate empiric IV antibiotic therapy as ordered after cultures are drawn", "Monitor for signs of embolic complications (neurological changes, flank pain, skin lesions)", "Adjust antibiotic therapy based on culture and sensitivity results", "Plan for 4 to 6 weeks of IV antibiotic therapy with possible outpatient IV completion"],
    a: -1,
    co: [0, 1, 2, 3, 4],
    t: "ordered",
    r: "Endocarditis treatment: blood cultures first (before antibiotics, to avoid false negatives), then start empiric broad-spectrum IV antibiotics, monitor for embolic events (stroke, renal infarction, Janeway lesions), narrow therapy based on culture results, and plan for prolonged IV therapy (4 to 6 weeks). Cultures before antibiotics is critical for identifying the causative organism.",
    s: "Cardiovascular"
  },
  // ===== ADDITIONAL FILL-IN-BLANK QUESTIONS =====
  {
    q: "A nurse is calculating the body surface area (BSA) to determine cardiac index. The client's cardiac output is 3.8 L/min and BSA is 1.9 m2. What is the cardiac index? Round to one decimal place.",
    o: [],
    a: -1,
    cv: "2.0",
    t: "fill-in-blank",
    r: "Cardiac index = cardiac output / body surface area = 3.8 L/min / 1.9 m2 = 2.0 L/min/m2. Normal cardiac index is 2.5 to 4.0 L/min/m2. A CI of 2.0 is below normal, suggesting impaired cardiac function. This value approaches the cardiogenic shock threshold of less than 2.2.",
    s: "Cardiovascular"
  },
  {
    q: "A client's INR is 1.8 and the target range is 2.0 to 3.0 for atrial fibrillation. The current warfarin dose is 5 mg daily. The healthcare provider increases the dose to 7.5 mg daily. By what percentage was the dose increased? Round to the nearest whole number.",
    o: [],
    a: -1,
    cv: "50",
    t: "fill-in-blank",
    r: "Percentage increase = ((new dose minus old dose) / old dose) x 100 = ((7.5 minus 5.0) / 5.0) x 100 = (2.5 / 5.0) x 100 = 50%. A 50% dose increase from 5 mg to 7.5 mg. The nurse should monitor the INR closely after dose changes as warfarin has a narrow therapeutic index.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is calculating the QTc interval for a client on amiodarone. The measured QT interval is 480 ms and the R-R interval is 800 ms. Using Bazett's formula (QTc = QT / square root of RR in seconds), what is the QTc in milliseconds? Round to the nearest whole number.",
    o: [],
    a: -1,
    cv: "537",
    t: "fill-in-blank",
    r: "Bazett's formula: QTc = QT / square root of RR. RR interval = 800 ms = 0.8 seconds. Square root of 0.8 = 0.894. QTc = 480 / 0.894 = 536.9, rounded to 537 ms. A QTc above 500 ms is associated with increased risk of torsades de pointes and requires provider notification, especially on QT-prolonging medications like amiodarone.",
    s: "Cardiovascular"
  },
  {
    q: "A client's central venous pressure (CVP) reading is 12 mmHg. The nurse knows that the normal CVP range is 2 to 6 mmHg. By how many mmHg is this client's CVP above the upper limit of normal?",
    o: [],
    a: -1,
    cv: "6",
    t: "fill-in-blank",
    r: "The client's CVP of 12 mmHg minus the upper limit of normal (6 mmHg) = 6 mmHg above the upper limit. An elevated CVP suggests fluid overload or right-sided heart failure. This finding should be correlated with clinical signs such as JVD, peripheral edema, and hepatomegaly.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is calculating the fluid balance for a post-cardiac surgery client. Total intake over 24 hours: IV fluids 1,800 mL, oral intake 400 mL, blood products 350 mL. Total output: urine 1,600 mL, chest tube drainage 450 mL, nasogastric drainage 200 mL. What is the net fluid balance in mL?",
    o: [],
    a: -1,
    cv: "300",
    t: "fill-in-blank",
    r: "Total intake = 1,800 + 400 + 350 = 2,550 mL. Total output = 1,600 + 450 + 200 = 2,250 mL. Net fluid balance = 2,550 minus 2,250 = +300 mL (positive balance indicating more fluid in than out). A positive fluid balance in a post-cardiac surgery client should be monitored for signs of fluid overload.",
    s: "Cardiovascular"
  },
  // ===== ADDITIONAL SATA (276-288) =====
  {
    q: "A nurse is providing discharge teaching to a client after coronary artery bypass graft surgery. Which instructions should the nurse include? Select all that apply.",
    o: ["Avoid lifting more than 4.5 kg (10 lbs) for 6 to 8 weeks to allow sternal healing", "Report any redness, warmth, drainage, or separation at the sternal incision", "Resume driving within 1 week of discharge", "Take prescribed medications including aspirin and statins as directed", "Attend cardiac rehabilitation sessions as scheduled", "Sleep on your stomach to promote sternal healing"],
    a: -1,
    ca: [0, 1, 3, 4],
    t: "sata",
    r: "Post-CABG discharge instructions include lifting restrictions (protect the sternotomy), wound monitoring (infection prevention), medication adherence (aspirin for graft patency, statins for lipid management), and cardiac rehabilitation. Driving is typically restricted for 4 to 6 weeks. Sleeping on the stomach is not recommended as it places pressure on the sternotomy.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is assessing a client for signs of left-sided heart failure. Which findings are consistent with left-sided heart failure? Select all that apply.",
    o: ["Dyspnea on exertion", "Orthopnea requiring multiple pillows to sleep", "Crackles on lung auscultation", "Hepatomegaly with right upper quadrant tenderness", "Paroxysmal nocturnal dyspnea", "Pink frothy sputum in severe cases"],
    a: -1,
    ca: [0, 1, 2, 4, 5],
    t: "sata",
    r: "Left-sided heart failure causes pulmonary congestion manifesting as dyspnea on exertion, orthopnea, crackles (fluid in alveoli), paroxysmal nocturnal dyspnea (fluid redistribution when supine), and pink frothy sputum (severe pulmonary edema). Hepatomegaly is a sign of right-sided heart failure from systemic venous congestion.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is caring for a client with a thoracic aortic aneurysm managed conservatively. Which discharge instructions should the nurse provide? Select all that apply.",
    o: ["Avoid heavy lifting, straining, and Valsalva manoeuvres", "Take prescribed beta-blockers and antihypertensives as directed", "Attend all follow-up imaging appointments to monitor aneurysm size", "Discontinue smoking immediately if you currently smoke", "Resume high-intensity weightlifting to strengthen cardiovascular fitness", "Report sudden severe chest or back pain to emergency services immediately"],
    a: -1,
    ca: [0, 1, 2, 3, 5],
    t: "sata",
    r: "Conservative management of thoracic aortic aneurysm includes avoiding activities that increase aortic wall stress (lifting, straining), BP control with beta-blockers, surveillance imaging, smoking cessation (major risk factor), and knowing emergency symptoms. High-intensity weightlifting dramatically increases aortic wall stress and could trigger dissection or rupture.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is caring for a client with atrial fibrillation. Which complications should the nurse monitor for? Select all that apply.",
    o: ["Thromboembolism and stroke", "Reduced cardiac output from loss of atrial kick", "Heart failure from prolonged rapid ventricular response", "Spontaneous resolution without any treatment", "Tachycardia-induced cardiomyopathy", "Systemic hypotension from irregular ventricular filling"],
    a: -1,
    ca: [0, 1, 2, 4, 5],
    t: "sata",
    r: "AFib complications include thromboembolism (blood stasis in fibrillating atria), reduced cardiac output (loss of 15 to 25% from absent atrial contraction), heart failure (from chronic tachycardia), tachycardia-induced cardiomyopathy (sustained rapid rate weakens the ventricle), and hypotension (irregular filling reduces output). While some AFib episodes convert spontaneously, monitoring for complications is still essential.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is educating a client about the signs and symptoms of digoxin toxicity. Which manifestations should the client report? Select all that apply.",
    o: ["Nausea and vomiting", "Visual disturbances such as yellow-green halos", "Heart rate below 60 bpm or new irregular rhythm", "Diarrhea and abdominal pain", "Increased energy and improved exercise tolerance", "Confusion and fatigue"],
    a: -1,
    ca: [0, 1, 2, 3, 5],
    t: "sata",
    r: "Digoxin toxicity manifestations include GI symptoms (nausea, vomiting, diarrhea, abdominal pain), visual disturbances (yellow-green halos, blurred vision), cardiac effects (bradycardia, new dysrhythmias), and neurological changes (confusion, fatigue). Increased energy and improved exercise tolerance would indicate therapeutic benefit, not toxicity.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is preparing a client for a stress test. Which pre-test instructions should the nurse provide? Select all that apply.",
    o: ["Wear comfortable clothing and supportive walking shoes", "Avoid caffeine for at least 24 hours before the test", "Eat a light meal 2 to 4 hours before the test, then fast", "Continue taking all medications without any changes", "Report any chest pain, dizziness, or severe shortness of breath during the test immediately", "Apply skin lotion to the chest before the test to improve electrode adhesion"],
    a: -1,
    ca: [0, 1, 2, 4],
    t: "sata",
    r: "Stress test preparation includes comfortable clothing, caffeine avoidance (can affect heart rate and BP), light meal followed by fasting, and knowing when to report symptoms. Some medications (beta-blockers) may need to be held per provider instruction, so continuing all medications without checking is incorrect. Skin lotion impairs electrode adhesion and should be avoided.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is caring for a client post-pericardiocentesis for cardiac tamponade. Which findings indicate the procedure was successful? Select all that apply.",
    o: ["Improved blood pressure with widening pulse pressure", "Heart sounds become clearer and louder", "Resolution of jugular venous distension", "Decreased heart rate from compensatory tachycardia baseline", "Increased pulsus paradoxus", "Improved level of consciousness"],
    a: -1,
    ca: [0, 1, 2, 3, 5],
    t: "sata",
    r: "Successful pericardiocentesis removes the compressing fluid, allowing the heart to fill properly. Signs of improvement include rising BP with wider pulse pressure, clearer heart sounds (no longer muffled), resolving JVD, decreasing compensatory tachycardia, and improved mentation from better cerebral perfusion. Pulsus paradoxus should decrease (not increase), as the cardiac compression resolves.",
    s: "Cardiovascular"
  },
  {
    q: "A client with DVT is being started on warfarin therapy. Which baseline laboratory tests should the nurse ensure are completed before initiating therapy? Select all that apply.",
    o: ["INR and PT (prothrombin time)", "aPTT (activated partial thromboplastin time)", "Complete blood count (CBC) with platelet count", "Liver function tests", "Thyroid function tests", "Renal function (BUN and creatinine)"],
    a: -1,
    ca: [0, 1, 2, 3, 5],
    t: "sata",
    r: "Baseline labs before warfarin include INR/PT (establishes pre-treatment baseline for monitoring), aPTT (if concurrent heparin therapy), CBC with platelets (bleeding risk assessment), liver function (warfarin is hepatically metabolized), and renal function (affects drug clearance). Thyroid function is not directly relevant to warfarin initiation.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is assessing ECG changes during a client's acute MI. Which ECG findings may be seen during the evolution of a myocardial infarction? Select all that apply.",
    o: ["ST segment elevation in the acute phase", "T wave inversion indicating ischemia", "Development of pathological Q waves indicating necrosis", "Shortened QT interval", "ST segment depression in leads opposite to the injury (reciprocal changes)", "Tall, peaked, hyperacute T waves in the earliest phase"],
    a: -1,
    ca: [0, 1, 2, 4, 5],
    t: "sata",
    r: "MI ECG evolution includes hyperacute (tall) T waves (earliest change), ST elevation (acute injury), reciprocal ST depression (in opposite leads), T wave inversion (ischemia as the MI evolves), and pathological Q waves (indicating transmural necrosis). The QT interval may lengthen (not shorten) during MI. These changes evolve over hours to days.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is monitoring a client on a heparin protocol. Which interventions should the nurse implement to prevent bleeding complications? Select all that apply.",
    o: ["Use a soft-bristle toothbrush for oral care", "Apply pressure to venipuncture sites for at least 5 minutes", "Avoid intramuscular injections while on heparin", "Use an electric razor instead of a straight razor for shaving", "Encourage vigorous nose blowing to clear secretions", "Monitor stool and urine for signs of occult bleeding"],
    a: -1,
    ca: [0, 1, 2, 3, 5],
    t: "sata",
    r: "Bleeding precautions during anticoagulation include soft toothbrush (prevent gum bleeding), prolonged pressure at puncture sites, avoiding IM injections (risk of intramuscular hematoma), electric razor (prevent cuts), and monitoring for occult bleeding. Vigorous nose blowing can cause epistaxis in anticoagulated clients and should be avoided.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is teaching a client about signs of acute arterial occlusion that require immediate emergency attention. Which symptoms should the nurse include? Select all that apply.",
    o: ["Sudden severe pain in the affected extremity", "Pallor or mottling of the skin", "Absent pulse distal to the occlusion", "Gradual onset of warmth and redness over days", "Tingling or numbness (paresthesia)", "Inability to move the affected limb (paralysis)"],
    a: -1,
    ca: [0, 1, 2, 4, 5],
    t: "sata",
    r: "The 6 Ps of acute arterial occlusion are sudden, severe pain, pallor, pulselessness, paresthesia, paralysis, and poikilothermia. These require emergency intervention within 4 to 6 hours to save the limb. Gradual onset of warmth and redness suggests inflammation or infection, not acute arterial occlusion, which presents with cold, pale extremities.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is caring for a client with hypertensive emergency. Which assessments are essential during IV antihypertensive infusion? Select all that apply.",
    o: ["Continuous blood pressure monitoring (arterial line preferred)", "Neurological checks every 15 to 30 minutes", "Cardiac rhythm monitoring via telemetry", "Urine output monitoring for renal perfusion", "Weekly renal function tests only", "Monitoring for signs of target organ damage (chest pain, visual changes, headache)"],
    a: -1,
    ca: [0, 1, 2, 3, 5],
    t: "sata",
    r: "Hypertensive emergency management requires continuous BP monitoring (intra-arterial line ideal), frequent neurological assessments (detecting cerebral hypoperfusion from too-rapid BP reduction), cardiac monitoring (dysrhythmia risk), hourly urine output (renal perfusion), and monitoring for target organ damage. Renal function should be checked at least daily during the crisis, not weekly.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is educating a client with chronic heart failure about when to seek emergency care. Which symptoms should the nurse include? Select all that apply.",
    o: ["Sudden severe shortness of breath at rest", "Chest pain or pressure that does not resolve with rest", "New or worsening confusion", "Weight gain of 0.2 kg over one week", "Fainting or near-fainting episodes", "Coughing up pink or blood-tinged sputum"],
    a: -1,
    ca: [0, 1, 2, 4, 5],
    t: "sata",
    r: "Emergency symptoms in heart failure include sudden severe dyspnea at rest (acute decompensation), unrelieved chest pain (possible MI), new confusion (hypoperfusion or hyponatremia), syncope (dangerous dysrhythmia or cardiogenic shock), and hemoptysis/pink sputum (acute pulmonary edema). Weight gain of 0.2 kg in a week is minimal and not alarming; 1 kg/day or 2 kg/week warrants provider contact, not emergency care.",
    s: "Cardiovascular"
  },
  // ===== ADDITIONAL ORDERED QUESTIONS =====
  {
    q: "A client with chronic heart failure has been stable but presents with increasing weight, worsening dyspnea, and bilateral leg edema. Place the nursing actions in the correct order of priority.",
    o: ["Assess vital signs, oxygen saturation, and respiratory status", "Auscultate lung sounds and assess for JVD and peripheral edema", "Notify the healthcare provider with a focused SBAR report", "Administer diuretics as ordered and apply supplemental oxygen if indicated", "Monitor intake and output and daily weights closely"],
    a: -1,
    co: [0, 1, 2, 3, 4],
    t: "ordered",
    r: "Heart failure exacerbation management: initial assessment of vitals and oxygenation first, then focused cardiovascular and pulmonary assessment (gathering data), notify the provider with organized findings (SBAR communication), implement ordered interventions (diuretics, oxygen), and establish ongoing monitoring (I&O, weights). Assessment before intervention ensures accurate clinical picture.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is caring for a client who requires anticoagulation bridging from warfarin to heparin for an upcoming surgical procedure. Place the steps in the correct sequence.",
    o: ["Stop warfarin 5 days before the procedure", "Start therapeutic-dose LMWH or IV heparin 2 to 3 days before surgery as the INR falls", "Check the INR the day before or morning of surgery to ensure it is below 1.5", "Hold LMWH 12 to 24 hours before the procedure or stop IV heparin 4 to 6 hours before", "Resume warfarin post-operatively when hemostasis is achieved and restart bridging until INR is therapeutic"],
    a: -1,
    co: [0, 1, 2, 3, 4],
    t: "ordered",
    r: "Anticoagulation bridging: stop warfarin 5 days before surgery (allows INR to fall), start bridging anticoagulation as INR approaches subtherapeutic range, verify INR is below surgical threshold (1.5), hold bridging anticoagulation per timing guidelines before surgery, then resume warfarin and bridging post-operatively until INR is therapeutic again.",
    s: "Cardiovascular"
  },
  {
    q: "A client develops acute chest pain. The nurse suspects ACS. Place the assessment and communication steps in the correct order using the SBAR framework.",
    o: ["S (Situation): State the client's name, age, and chief complaint of acute chest pain", "B (Background): Provide relevant history including cardiac risk factors, current medications, and recent vital signs", "A (Assessment): Share your clinical findings including pain characteristics, ECG changes, and vital sign abnormalities", "R (Recommendation): State what you believe is needed, such as stat ECG, troponin levels, and cardiology consultation"],
    a: -1,
    co: [0, 1, 2, 3],
    t: "ordered",
    r: "SBAR communication follows a standardized format: Situation (what is happening now, the immediate concern), Background (relevant clinical history and context), Assessment (your clinical findings and interpretation), and Recommendation (what you are requesting or suggesting). This structured approach ensures efficient, clear communication during critical situations.",
    s: "Cardiovascular"
  },
  {
    q: "A client with a new diagnosis of DVT is started on anticoagulation therapy. Place the treatment initiation steps in the correct order.",
    o: ["Obtain baseline coagulation studies (aPTT, PT/INR, CBC)", "Start therapeutic-dose heparin (IV unfractionated or subcutaneous LMWH) as ordered", "Begin warfarin or DOAC therapy as ordered (warfarin overlaps with heparin for 5+ days)", "Monitor aPTT every 6 hours for IV heparin and adjust per protocol", "Discontinue heparin once INR is therapeutic for 2 consecutive days (if using warfarin)"],
    a: -1,
    co: [0, 1, 2, 3, 4],
    t: "ordered",
    r: "DVT anticoagulation initiation: baseline labs first (establishes pre-treatment values), start heparin for immediate anticoagulation, overlap with warfarin or DOAC (warfarin takes days for full effect), monitor coagulation parameters and adjust, then discontinue bridging heparin once oral therapy is therapeutic. This ensures continuous anticoagulation throughout treatment initiation.",
    s: "Cardiovascular"
  },
  {
    q: "A client with a permanent pacemaker presents to the ED with symptoms of pacemaker malfunction. Place the assessment steps in the correct order.",
    o: ["Assess the client's level of consciousness, airway, breathing, and circulation (ABCs)", "Obtain vital signs including heart rate, BP, and SpO2", "Perform a 12-lead ECG to evaluate pacemaker function (looking for capture, sensing, and firing)", "Review the client's pacemaker identification card for device type and settings", "Notify the cardiologist for urgent pacemaker interrogation"],
    a: -1,
    co: [0, 1, 2, 3, 4],
    t: "ordered",
    r: "Pacemaker malfunction assessment: ABCs first (the client may be hemodynamically unstable), vital signs (quantify the hemodynamic impact), ECG (evaluate pacemaker function, looking for spikes, capture, and sensing), review device information (essential for interpretation), and notify the cardiologist for formal interrogation. Life-threatening instability takes priority over device assessment.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse is implementing the chain of survival for a client found in cardiac arrest on the medical unit. Place the steps in the correct order.",
    o: ["Recognize cardiac arrest (unresponsive, no pulse, no normal breathing)", "Activate the emergency response system (call a code)", "Begin high-quality CPR with compressions at 100 to 120 per minute", "Apply the defibrillator and analyze the rhythm as soon as available", "Deliver shock if indicated (VFib or pulseless VTach)", "Provide post-cardiac arrest care once return of spontaneous circulation is achieved"],
    a: -1,
    co: [0, 1, 2, 3, 4, 5],
    t: "ordered",
    r: "The chain of survival: early recognition and activation, immediate CPR (high-quality compressions are the foundation), rapid defibrillation (VFib/pulseless VTach are shockable rhythms), and integrated post-cardiac arrest care. Each link strengthens the chain. Delays at any point reduce survival. Early CPR doubles to triples survival chances from VFib arrest.",
    s: "Cardiovascular"
  },
  {
    q: "A nurse discovers a post-operative CABG client with sudden cardiac tamponade from mediastinal bleeding. Place the emergency actions in the correct order.",
    o: ["Call for emergency assistance and notify the surgeon immediately", "Prepare for emergency mediastinal exploration (chest reopening at bedside or in OR)", "Administer rapid IV fluid bolus as ordered to maintain preload", "Assist with preparation of the emergency sternotomy tray", "Monitor hemodynamics continuously and prepare blood products for transfusion"],
    a: -1,
    co: [0, 2, 1, 3, 4],
    t: "ordered",
    r: "Post-CABG tamponade from mediastinal bleeding: immediate call for help and surgeon notification (this is a surgical emergency), IV fluids to temporarily support preload while preparing, prepare for emergency reopening (mediastinal exploration is the definitive treatment), set up the sternotomy tray, and support with hemodynamic monitoring and blood products. This is a time-critical emergency.",
    s: "Cardiovascular"
  },
  // ===== ADDITIONAL MCQ =====
  {
    q: "A 72-year-old client with chronic heart failure and atrial fibrillation is prescribed both digoxin and amiodarone. The nurse reviews the most recent digoxin level of 2.4 ng/mL (therapeutic 0.5 to 2.0 ng/mL). Which drug interaction does the nurse identify?",
    o: ["Amiodarone increases digoxin levels by reducing its renal clearance, requiring dose reduction of digoxin", "Amiodarone decreases digoxin levels, requiring a higher digoxin dose", "There is no interaction between amiodarone and digoxin", "Digoxin reduces the effectiveness of amiodarone"],
    a: 0,
    r: "Amiodarone inhibits P-glycoprotein and reduces renal clearance of digoxin, increasing serum digoxin levels by 70 to 100%. When amiodarone is added, the digoxin dose should be reduced by approximately 50% and levels monitored closely. A level of 2.4 ng/mL is toxic and requires immediate provider notification.",
    s: "Cardiovascular"
  },
  {
    q: "A 68-year-old client is 2 weeks post-MI and develops sharp chest pain that worsens with deep breathing and lying down, and improves when sitting forward. Temperature is 38.2 degrees Celsius. The ECG shows diffuse ST elevation. Which condition does the nurse suspect?",
    o: ["Dressler syndrome (post-MI pericarditis), an autoimmune inflammatory response occurring weeks after MI", "Recurrent acute myocardial infarction", "Pulmonary embolism", "Unstable angina from a new coronary lesion"],
    a: 0,
    r: "Dressler syndrome occurs 1 to 8 weeks after MI as an autoimmune inflammatory response against damaged pericardial tissue. Classic features include pleuritic chest pain relieved by sitting forward, low-grade fever, and diffuse ST elevation on ECG. Recurrent MI would show territorial ST changes. PE presents with dyspnea and pleuritic pain. Unstable angina does not cause fever or diffuse ECG changes.",
    s: "Cardiovascular"
  },
  {
    q: "A 74-year-old client with a history of aortic valve replacement 8 years ago presents with progressive exertional dyspnea and fatigue. Echocardiography shows elevated transvalvular gradients across the bioprosthetic valve. The nurse understands this finding most likely indicates which condition?",
    o: ["Structural valve deterioration (degeneration) of the bioprosthetic valve requiring possible re-intervention", "Normal aging changes that do not require medical attention", "Improvement in valve function over time", "Endocarditis causing valve malfunction"],
    a: 0,
    r: "Bioprosthetic valves typically last 10 to 15 years before structural deterioration occurs. Elevated gradients on echocardiography indicate valve stenosis from calcification and leaflet degeneration. At 8 years, this is consistent with expected valve lifespan. This is not normal aging, not improvement, and while endocarditis must be ruled out, progressive degeneration is more likely without infectious signs.",
    s: "Cardiovascular"
  },
  {
    q: "A 55-year-old client with newly diagnosed hypertension asks about the connection between sleep apnea and high blood pressure. The client snores heavily and has daytime sleepiness. Which response by the nurse is most accurate?",
    o: ["Obstructive sleep apnea is a recognized cause of secondary and resistant hypertension, and screening and treatment may help improve your blood pressure control", "Sleep apnea has no connection to blood pressure", "Treating sleep apnea will cure your hypertension completely", "Snoring and daytime sleepiness are normal and unrelated to cardiovascular health"],
    a: 0,
    r: "Obstructive sleep apnea (OSA) is a well-established cause of secondary hypertension, particularly resistant hypertension. Intermittent hypoxia and sympathetic nervous system activation during apneic episodes contribute to sustained hypertension. Treatment with CPAP can improve BP control. OSA is directly connected to cardiovascular risk. While treatment helps, it may not fully cure hypertension.",
    s: "Cardiovascular"
  },
  {
    q: "A 63-year-old client is being taught about self-monitoring after starting a new antihypertensive medication. The client takes the medication at bedtime. The next morning, the client stands quickly from bed and feels dizzy and lightheaded. BP supine is 122/74 and standing is 88/56. Which teaching should the nurse reinforce?",
    o: ["Rise slowly from lying to sitting to standing, pausing at each position to allow your body to adjust to the blood pressure changes", "Lie back down immediately and take a second dose of medication to stabilize your pressure", "This reaction means the medication is too strong and should be discontinued", "Standing quickly is the best way to test if your medication is working"],
    a: 0,
    r: "A drop greater than 20 mmHg systolic upon standing indicates orthostatic hypotension, a common side effect of antihypertensives. Gradual position changes (lying to sitting to standing, pausing 1 to 2 minutes at each stage) allow baroreceptor compensation. Taking extra medication is dangerous. The medication may need adjustment but should not be self-discontinued. Rapid standing provokes, rather than tests, the problem.",
    s: "Cardiovascular"
  }
];
