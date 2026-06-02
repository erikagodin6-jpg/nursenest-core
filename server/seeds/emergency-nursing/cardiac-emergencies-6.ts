import { EmergencyNursingQuestion } from "./types";

export const cardiacEmergency6Questions: EmergencyNursingQuestion[] = [
  {
    stem: "A 72-year-old male presents with sudden onset of tearing chest pain radiating to the back. BP in the right arm is 180/100 mmHg and in the left arm is 130/70 mmHg. CT angiography confirms Stanford Type A aortic dissection. Which medication combination should the emergency nurse prepare first?",
    options: [
      "IV esmolol infusion titrated to HR <60 bpm, then IV nicardipine for SBP <120 mmHg",
      "IV nitroprusside infusion alone for rapid blood pressure reduction",
      "IV hydralazine 20 mg bolus for immediate afterload reduction",
      "IV phenylephrine infusion to maintain adequate perfusion pressure"
    ],
    correctAnswer: 0,
    rationaleLong: "In acute aortic dissection, the primary hemodynamic goals are to reduce aortic wall shear stress by decreasing both heart rate and blood pressure. The critical first step is beta-blocker therapy to reduce HR to less than 60 bpm, which decreases the rate of aortic pressure rise (dP/dt). IV esmolol is preferred because of its ultra-short half-life (9 minutes), allowing precise titration. Only after adequate heart rate control should a vasodilator such as nicardipine be added to achieve SBP less than 120 mmHg. This sequencing is essential because administering a vasodilator before beta-blockade can cause reflex tachycardia, which increases aortic wall stress and promotes dissection propagation. Nitroprusside alone is dangerous because it causes reflex tachycardia and increases dP/dt without heart rate control. Hydralazine is contraindicated as a first-line agent because it also causes reflex tachycardia. Phenylephrine would increase afterload and worsen aortic wall stress. Stanford Type A dissections (involving the ascending aorta) require emergent surgical consultation, while the emergency nurse focuses on anti-impulse therapy. The nurse should establish two large-bore IVs, place an arterial line for continuous BP monitoring, and prepare for potential rapid deterioration including tamponade, aortic regurgitation, or coronary malperfusion.",
    learningObjective: "Prioritize beta-blocker therapy before vasodilator therapy in acute aortic dissection management",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Aortic Emergencies",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Always beta-block BEFORE vasodilating in aortic dissection to prevent reflex tachycardia",
    clinicalPearls: [
      "Target HR <60 bpm with esmolol BEFORE adding vasodilator",
      "Target SBP <120 mmHg after heart rate is controlled",
      "BP difference >20 mmHg between arms suggests dissection",
      "Stanford Type A = ascending aorta = surgical emergency"
    ],
    safetyNote: "Vasodilators without beta-blockade cause reflex tachycardia and can propagate dissection",
    distractorRationales: [
      "Esmolol then nicardipine provides appropriate sequential anti-impulse therapy",
      "Nitroprusside alone causes dangerous reflex tachycardia",
      "Hydralazine causes reflex tachycardia worsening aortic wall stress",
      "Phenylephrine increases afterload and worsens dissection"
    ],
    lessonLink: "/emergency/lessons/aortic-emergencies"
  },
  {
    stem: "A 45-year-old female presents with palpitations and dizziness. ECG shows a regular narrow-complex tachycardia at 188 bpm with no discernible P waves. Vagal maneuvers have failed. What is the correct initial dose and administration technique for adenosine?",
    options: [
      "6 mg rapid IV push via proximal port followed immediately by 20 mL NS rapid flush",
      "12 mg slow IV push over 2 minutes via distal IV site",
      "6 mg IV push via distal IV site without saline flush",
      "3 mg rapid IV push followed by 10 mL NS flush"
    ],
    correctAnswer: 0,
    rationaleLong: "Adenosine for supraventricular tachycardia (SVT) must be administered as a rapid IV push via the most proximal IV site available (antecubital or above), immediately followed by a 20 mL normal saline rapid flush. This technique is critical because adenosine has an ultra-short half-life of less than 10 seconds - it is rapidly taken up by red blood cells and vascular endothelial cells. If the drug is administered slowly, through a distal IV site, or without a rapid flush, it will be metabolized before reaching the heart and will be ineffective. The initial dose is 6 mg. If the first dose is ineffective after 1-2 minutes, a second dose of 12 mg can be given, followed by a third dose of 12 mg if needed. The nurse should warn the patient that they may experience transient chest tightness, flushing, and a brief feeling of impending doom - these are expected side effects lasting only seconds. A brief period of asystole (3-6 seconds) is also expected and therapeutic. The nurse should have the defibrillator at bedside and the rhythm strip running continuously to capture the response. The 3 mg dose is insufficient for adults. Slow administration negates the drug's effectiveness due to its ultra-rapid metabolism. Recording the rhythm strip during administration is essential for diagnostic purposes, as the brief AV nodal block may unmask underlying atrial activity.",
    learningObjective: "Demonstrate proper adenosine administration technique including dose, site, and flush method",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Dysrhythmia Management",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Adenosine requires rapid push via proximal IV with immediate 20 mL NS flush due to 10-second half-life",
    clinicalPearls: [
      "Adenosine half-life <10 seconds - rapid push and flush are essential",
      "Use most proximal IV site available (antecubital preferred)",
      "Dose sequence: 6 mg → 12 mg → 12 mg",
      "Warn patient about transient chest tightness and flushing",
      "Record continuous rhythm strip during administration"
    ],
    safetyNote: "Brief asystole is an expected therapeutic effect - have defibrillator at bedside",
    distractorRationales: [
      "6 mg rapid push with 20 mL flush via proximal site is the correct technique",
      "Slow administration renders adenosine ineffective due to rapid metabolism",
      "Without flush, adenosine is metabolized before reaching the heart",
      "3 mg is a subtherapeutic dose for adults"
    ],
    lessonLink: "/emergency/lessons/dysrhythmia-management"
  },
  {
    stem: "A 68-year-old male with a history of heart failure presents with worsening dyspnea, pink frothy sputum, and SpO2 82% on room air. BP is 190/110 mmHg, HR 118 bpm. Bilateral crackles are heard to the apices. Which intervention is the highest priority?",
    options: [
      "Apply BiPAP at 10/5 cmH2O and initiate IV nitroglycerin infusion",
      "Administer IV furosemide 80 mg and insert Foley catheter",
      "Prepare for emergent intubation with RSI",
      "Administer morphine 4 mg IV for preload reduction"
    ],
    correctAnswer: 0,
    rationaleLong: "This patient presents with acute hypertensive pulmonary edema, a life-threatening emergency requiring immediate intervention to reduce preload, afterload, and work of breathing. The highest priority combination is BiPAP (bilevel positive airway pressure) and IV nitroglycerin. BiPAP provides immediate respiratory support by improving oxygenation through positive end-expiratory pressure (PEEP), reducing work of breathing, and decreasing preload by increasing intrathoracic pressure. Multiple studies have shown that early BiPAP in acute pulmonary edema reduces the need for intubation by 50-60% and decreases mortality. The typical starting settings are IPAP 10 cmH2O and EPAP 5 cmH2O, titrated to patient comfort and oxygenation. Concurrently, IV nitroglycerin infusion (starting at 10-20 mcg/min, titrated by 10-20 mcg/min every 3-5 minutes) provides rapid preload and afterload reduction through venodilation and arterial dilation. This combination addresses the pathophysiology of cardiogenic pulmonary edema more effectively than any single intervention. While furosemide is part of the treatment, it takes 15-30 minutes for onset of diuretic effect and does not provide the immediate hemodynamic relief needed. Morphine is no longer recommended routinely for acute pulmonary edema due to increased mortality in observational studies, risk of respiratory depression, and hypotension. Intubation should be reserved for patients who fail non-invasive ventilation, as it carries risks of hemodynamic deterioration during RSI in heart failure patients.",
    learningObjective: "Prioritize BiPAP and IV nitroglycerin as first-line treatment for acute hypertensive pulmonary edema",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Acute Heart Failure",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "BiPAP + nitroglycerin is first-line for hypertensive pulmonary edema; morphine is no longer recommended",
    clinicalPearls: [
      "BiPAP reduces intubation rates by 50-60% in acute pulmonary edema",
      "Start BiPAP at IPAP 10, EPAP 5 and titrate to comfort",
      "IV nitroglycerin provides faster hemodynamic relief than furosemide",
      "Morphine increases mortality in acute heart failure - avoid routine use"
    ],
    safetyNote: "Avoid morphine in acute pulmonary edema - associated with increased mortality and respiratory depression",
    distractorRationales: [
      "BiPAP and nitroglycerin provide the fastest combined preload/afterload reduction",
      "Furosemide has delayed onset and doesn't address immediate respiratory failure",
      "Intubation is reserved for BiPAP failure; RSI carries hemodynamic risks",
      "Morphine is no longer recommended due to increased mortality risk"
    ],
    lessonLink: "/emergency/lessons/acute-heart-failure"
  },
  {
    stem: "A 55-year-old female on warfarin for mechanical mitral valve presents with INR of 8.2, hemoglobin drop from 12 to 7.5 g/dL, and melena. BP is 88/52 mmHg, HR 122 bpm. Which reversal agent should the emergency nurse prepare?",
    options: [
      "IV 4-factor prothrombin complex concentrate (4F-PCC) and IV vitamin K 10 mg",
      "Fresh frozen plasma 4 units only",
      "IV vitamin K 10 mg alone and recheck INR in 6 hours",
      "Recombinant factor VIIa 90 mcg/kg"
    ],
    correctAnswer: 0,
    rationaleLong: "This patient presents with life-threatening hemorrhage (hemodynamic instability, significant hemoglobin drop, and active GI bleeding) in the setting of supratherapeutic anticoagulation with warfarin (INR 8.2). The recommended treatment for life-threatening warfarin-related bleeding is the combination of 4-factor prothrombin complex concentrate (4F-PCC) AND IV vitamin K. 4F-PCC (such as Kcentra) contains factors II, VII, IX, and X and provides rapid, complete INR reversal within 15-30 minutes. The dose is based on INR and body weight (typically 25-50 units/kg). It is preferred over fresh frozen plasma (FFP) because it provides faster reversal, requires smaller volume (reducing risk of volume overload), does not require thawing time, and does not require ABO blood typing. IV vitamin K 10 mg is given concurrently because 4F-PCC has a limited duration of effect (6-8 hours for some factors), and vitamin K provides sustained reversal by enabling hepatic synthesis of new clotting factors (onset 4-6 hours, peak effect 24 hours). FFP alone is inferior because it requires 4-6 units (large volume load of 1-1.5 liters), takes 30-45 minutes to thaw, requires blood type matching, and may not fully correct severely elevated INRs. Vitamin K alone takes too long for a hemodynamically unstable patient. Recombinant factor VIIa is not recommended for warfarin reversal due to high thrombotic risk and incomplete factor replacement. Note that this patient has a mechanical valve, so anticoagulation discussions should include cardiology once stabilized.",
    learningObjective: "Identify 4-factor PCC plus IV vitamin K as the preferred reversal strategy for life-threatening warfarin-related bleeding",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Anticoagulation Emergencies",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "4F-PCC provides rapid INR reversal in minutes; vitamin K provides sustained reversal over hours - use both together",
    clinicalPearls: [
      "4F-PCC reverses INR in 15-30 minutes vs FFP which takes hours",
      "Always give IV vitamin K with PCC for sustained factor replacement",
      "4F-PCC does not require blood typing or thawing",
      "Mechanical valve patients need cardiology consultation for re-anticoagulation planning"
    ],
    safetyNote: "Give vitamin K IV slowly over 20 minutes to reduce risk of anaphylactoid reaction",
    distractorRationales: [
      "4F-PCC plus vitamin K provides both rapid and sustained INR reversal",
      "FFP alone is inferior due to volume, time delays, and incomplete correction",
      "Vitamin K alone takes 4-6 hours - too slow for active hemorrhage",
      "Factor VIIa has high thrombotic risk and incomplete factor replacement"
    ],
    lessonLink: "/emergency/lessons/anticoagulation-emergencies"
  },
  {
    stem: "A 60-year-old male presents with sudden onset severe substernal chest pain while shoveling snow. Initial ECG shows 3 mm ST elevation in leads II, III, and aVF with reciprocal ST depression in I and aVL. Which coronary artery is most likely occluded?",
    options: [
      "Right coronary artery (RCA)",
      "Left anterior descending artery (LAD)",
      "Left circumflex artery (LCx)",
      "Left main coronary artery"
    ],
    correctAnswer: 0,
    rationaleLong: "ST elevation in leads II, III, and aVF with reciprocal changes in leads I and aVL is the classic ECG pattern of an inferior STEMI, which is most commonly caused by occlusion of the right coronary artery (RCA). The RCA supplies the inferior wall of the heart in approximately 85% of patients (right-dominant circulation). Understanding coronary artery territory mapping is essential for emergency nurses because it guides anticipation of complications: RCA/inferior STEMI is associated with right ventricular infarction (check right-sided V4R lead for ST elevation), bradycardia and heart blocks (the RCA supplies the SA and AV nodes in most patients), and hypotension responsive to fluid boluses rather than nitroglycerin. The left anterior descending (LAD) artery supplies the anterior wall and septum, producing ST elevation in V1-V4 (anterior STEMI). The left circumflex (LCx) supplies the lateral wall, producing ST elevation in I, aVL, V5-V6 (lateral STEMI), though the LCx can also cause inferior STEMI in approximately 15% of patients with left-dominant circulation. Left main occlusion typically produces widespread ST depression with ST elevation in aVR, representing a near-fatal event. The emergency nurse should obtain a right-sided ECG (V4R) in all inferior STEMIs to evaluate for right ventricular involvement, which would contraindicate nitroglycerin and mandate fluid resuscitation for hypotension.",
    learningObjective: "Correlate inferior STEMI ECG pattern with right coronary artery occlusion and anticipated complications",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Acute Coronary Syndromes",
    difficulty: 2,
    cognitiveLevel: "comprehension",
    questionType: "MCQ_SINGLE",
    examTrap: "Inferior STEMI (II, III, aVF) = RCA in 85% of cases; always get right-sided ECG to check for RV involvement",
    clinicalPearls: [
      "Inferior STEMI: leads II, III, aVF with reciprocal changes in I, aVL",
      "RCA supplies SA/AV nodes - watch for bradycardia and heart blocks",
      "Always obtain V4R in inferior STEMI to evaluate RV involvement",
      "RV infarction: fluids for hypotension, avoid nitroglycerin and morphine"
    ],
    safetyNote: "Nitroglycerin is contraindicated in RV infarction - can cause severe hypotension",
    distractorRationales: [
      "RCA occlusion produces inferior STEMI in 85% of patients",
      "LAD occlusion produces anterior STEMI in V1-V4",
      "LCx occlusion typically produces lateral STEMI in I, aVL, V5-V6",
      "Left main occlusion causes diffuse ST depression with aVR elevation"
    ],
    lessonLink: "/emergency/lessons/acute-coronary-syndromes"
  },
  {
    stem: "A 70-year-old male with an implanted cardiac defibrillator (ICD) presents with multiple ICD shocks over the past hour. He is conscious, alert, and hemodynamically stable between shocks. The monitor shows polymorphic ventricular tachycardia triggering appropriate shocks. What is the emergency nurse's priority intervention?",
    options: [
      "Administer IV amiodarone 150 mg over 10 minutes and IV magnesium 2 g",
      "Place a magnet over the ICD to disable shock therapy",
      "Administer IV lidocaine 100 mg bolus and prepare for synchronized cardioversion",
      "Contact the device manufacturer for remote interrogation"
    ],
    correctAnswer: 0,
    rationaleLong: "ICD storm is defined as three or more appropriate or inappropriate ICD shocks within 24 hours. In this case, the shocks are appropriate (triggered by polymorphic VT), meaning the ICD is correctly identifying and treating a life-threatening arrhythmia. The priority is to treat the underlying arrhythmia to prevent further shocks, not to disable the ICD. IV amiodarone 150 mg over 10 minutes is the preferred antiarrhythmic for recurrent ventricular tachycardia, followed by a maintenance infusion of 1 mg/min for 6 hours then 0.5 mg/min. IV magnesium sulfate 2 g over 10 minutes is particularly important for polymorphic VT, as hypomagnesemia is a common trigger and magnesium stabilizes the cardiac membrane. The combination addresses both the arrhythmia substrate and a common precipitant. Placing a magnet over the ICD would disable shock therapy, which would be dangerous in this case because the shocks are appropriate - the patient is having genuine malignant ventricular arrhythmias. Magnet application is reserved for inappropriate shocks (device malfunction or misidentification of rhythms). While the underlying cause must be identified (ischemia, electrolyte abnormalities, drug toxicity), the immediate priority is pharmacological suppression of the arrhythmia. The nurse should also obtain a 12-lead ECG between episodes, draw electrolytes (potassium, magnesium, calcium), troponin, and drug levels if applicable, and arrange for formal device interrogation by electrophysiology.",
    learningObjective: "Manage ICD storm with appropriate antiarrhythmic therapy when shocks are correctly identifying ventricular arrhythmias",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Device Emergencies",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "For appropriate ICD shocks, treat the arrhythmia pharmacologically; magnet application is for inappropriate shocks only",
    clinicalPearls: [
      "ICD storm = ≥3 shocks in 24 hours",
      "Appropriate shocks: treat the arrhythmia, not the device",
      "Inappropriate shocks: apply magnet to disable therapy",
      "IV amiodarone + magnesium is first-line for recurrent polymorphic VT",
      "Check electrolytes (K+, Mg2+, Ca2+) and troponin in all ICD storm patients"
    ],
    safetyNote: "Never apply a magnet to disable appropriate ICD therapy in a patient with true ventricular arrhythmias",
    distractorRationales: [
      "Amiodarone and magnesium address the arrhythmia causing appropriate shocks",
      "Magnet application would disable life-saving therapy for genuine VT",
      "Lidocaine is second-line; synchronized cardioversion is not needed when ICD is functioning",
      "Device interrogation is important but not the immediate priority during active storm"
    ],
    lessonLink: "/emergency/lessons/device-emergencies"
  },
  {
    stem: "A 52-year-old female presents with chest pain and dyspnea 10 days after a total knee replacement. CT pulmonary angiography shows a saddle pulmonary embolism. BP is 78/42 mmHg, HR 130 bpm, SpO2 84%. IV heparin has been initiated. Which additional therapy should the emergency nurse prepare?",
    options: [
      "IV alteplase (tPA) 100 mg infused over 2 hours",
      "IV heparin dose increase with repeat aPTT in 4 hours",
      "Oral rivaroxaban loading dose 15 mg twice daily",
      "Inferior vena cava (IVC) filter placement"
    ],
    correctAnswer: 0,
    rationaleLong: "This patient presents with massive (high-risk) pulmonary embolism, defined by hemodynamic instability (systolic BP <90 mmHg) with confirmed PE on CT angiography. Massive PE has a mortality rate of 25-65% without aggressive intervention. The standard of care for massive PE with hemodynamic compromise is systemic thrombolysis with IV alteplase (tissue plasminogen activator/tPA). The FDA-approved regimen is 100 mg infused over 2 hours via peripheral IV. Alteplase works by converting plasminogen to plasmin, which directly dissolves the fibrin clot obstructing the pulmonary vasculature. Clinical improvement is typically seen within 1-3 hours, with reduction in pulmonary artery pressure and improvement in right ventricular function. In cardiac arrest from PE, the dose is given as a 50 mg bolus (with consideration of a second 50 mg bolus). The contraindications to thrombolysis must be rapidly assessed but in the setting of massive PE with hemodynamic collapse, the mortality risk of untreated PE generally outweighs the bleeding risk. Recent surgery (10 days post-knee replacement) is a relative contraindication, but given hemodynamic instability, the benefit of thrombolysis likely outweighs the risk - this requires urgent risk-benefit discussion with the treating team. Simply increasing heparin dose will not lyse the existing clot rapidly enough. Oral anticoagulants are inappropriate in this acute, life-threatening setting. IVC filters prevent new emboli but do not treat the existing massive clot.",
    learningObjective: "Identify systemic thrombolysis as the indicated treatment for massive pulmonary embolism with hemodynamic instability",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Pulmonary Embolism",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Massive PE (SBP <90) requires systemic thrombolysis - heparin alone is insufficient",
    clinicalPearls: [
      "Massive PE = hemodynamic instability + confirmed PE = thrombolysis indicated",
      "Alteplase for PE: 100 mg over 2 hours (or 50 mg bolus in cardiac arrest)",
      "Recent surgery is a relative contraindication weighed against mortality risk",
      "Saddle PE straddles the main pulmonary artery bifurcation"
    ],
    safetyNote: "Hold heparin during alteplase infusion; have type and screen for potential massive transfusion",
    distractorRationales: [
      "Alteplase provides direct clot lysis needed for hemodynamically unstable PE",
      "Increasing heparin prevents new clot but does not dissolve existing obstruction",
      "Oral anticoagulants have no role in acute massive PE management",
      "IVC filter prevents new emboli but does not address current hemodynamic compromise"
    ],
    lessonLink: "/emergency/lessons/pulmonary-embolism"
  },
  {
    stem: "A 40-year-old male presents after a syncopal episode during exercise. Family history reveals his brother died suddenly at age 35. ECG shows left ventricular hypertrophy with deep, narrow Q waves in the lateral leads and a systolic murmur that increases with Valsalva. Which condition should the emergency nurse suspect?",
    options: [
      "Hypertrophic cardiomyopathy (HCM)",
      "Dilated cardiomyopathy",
      "Aortic stenosis",
      "Acute myocardial infarction"
    ],
    correctAnswer: 0,
    rationaleLong: "The presentation of exertional syncope in a young patient with a family history of sudden cardiac death, LVH on ECG with deep narrow Q waves in lateral leads, and a systolic murmur that increases with Valsalva is classic for hypertrophic cardiomyopathy (HCM). HCM is the most common cause of sudden cardiac death in young athletes and is an autosomal dominant genetic condition affecting approximately 1 in 500 people. The hallmark is asymmetric septal hypertrophy that can cause dynamic left ventricular outflow tract (LVOT) obstruction. The murmur of HCM is unique in that it INCREASES with maneuvers that decrease preload (Valsalva, standing, dehydration) because the interventricular septum and mitral valve leaflet move closer together as the ventricle empties more completely. Conversely, the murmur DECREASES with maneuvers that increase preload (squatting, leg elevation, fluid administration). ECG findings include LVH, deep narrow Q waves (septal depolarization waves, not pathological Q waves from infarction), and T-wave inversions in lateral leads. Emergency management includes: avoiding dehydration and hypovolemia, avoiding vasodilators (nitroglycerin, nitroprusside) and positive inotropes (dobutamine, milrinone) which worsen obstruction, treating hypotension with IV fluids and phenylephrine (a pure alpha agonist), and cardiology consultation for echocardiography and risk stratification. Dilated cardiomyopathy presents with a dilated ventricle and reduced ejection fraction. Aortic stenosis murmur decreases with Valsalva. AMI presents with ST changes and troponin elevation.",
    learningObjective: "Recognize the classic presentation of hypertrophic cardiomyopathy and understand dynamic LVOT obstruction",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Cardiomyopathy",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "HCM murmur INCREASES with Valsalva (decreased preload); most other murmurs decrease",
    clinicalPearls: [
      "HCM is the #1 cause of sudden cardiac death in young athletes",
      "Murmur increases with decreased preload (Valsalva, standing)",
      "Avoid nitroglycerin, vasodilators, and inotropes - they worsen obstruction",
      "Treat hypotension with fluids and phenylephrine in HCM"
    ],
    safetyNote: "Nitroglycerin is contraindicated in HCM - decreases preload and worsens LVOT obstruction",
    distractorRationales: [
      "HCM: exertional syncope + family SCD + LVH with Q waves + dynamic murmur",
      "Dilated cardiomyopathy presents with enlarged ventricle and low EF",
      "Aortic stenosis murmur decreases with Valsalva maneuver",
      "AMI has ST segment changes and elevated troponin markers"
    ],
    lessonLink: "/emergency/lessons/cardiomyopathy"
  },
  {
    stem: "A 78-year-old female with atrial fibrillation presents with acute onset of severe left leg pain, pallor, and absent popliteal and pedal pulses. The leg is cool and mottled below the knee. Capillary refill is absent in the foot. Which classification of acute limb ischemia does this represent?",
    options: [
      "Class IIb - immediately threatened, requiring emergent revascularization",
      "Class I - viable limb, no immediate threat",
      "Class IIa - marginally threatened, salvageable with prompt treatment",
      "Class III - irreversible ischemia, amputation likely required"
    ],
    correctAnswer: 0,
    rationaleLong: "The Rutherford classification of acute limb ischemia guides management decisions. This patient presents with Class IIb - immediately threatened limb, characterized by rest pain, absent pulses, sensory loss, and motor deficit (mottling suggesting tissue compromise). Class IIb requires emergent revascularization within hours. Class I (viable) has no sensory loss, no motor weakness, and audible arterial Doppler signals - these patients are not immediately threatened. Class IIa (marginally threatened) has minimal sensory loss (toes only), no motor weakness, and often inaudible arterial but audible venous Doppler signals - these require urgent but not emergent intervention. Class III (irreversible) shows profound sensory loss, paralysis with rigor, and no Doppler signals in either arteries or veins - the limb is not salvageable and major amputation is indicated. For this patient, the absent pulses, cool/mottled limb, and absent capillary refill indicate tissue is at immediate risk but potentially salvageable. The emergency nurse should: initiate IV heparin anticoagulation (80 units/kg bolus, 18 units/kg/hr infusion) to prevent thrombus propagation, provide IV analgesia, keep the affected limb in a dependent position (NOT elevated), avoid warming devices (increase metabolic demand), obtain emergent vascular surgery consultation, and prepare for possible surgical embolectomy or catheter-directed thrombolysis. The likely etiology is cardioembolism from atrial fibrillation, which accounts for 80% of acute arterial emboli.",
    learningObjective: "Classify acute limb ischemia using the Rutherford system and prioritize emergent revascularization for Class IIb",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Peripheral Vascular Emergencies",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Class IIb (immediately threatened) requires emergent revascularization; do not delay for imaging",
    clinicalPearls: [
      "6 P's of acute limb ischemia: Pain, Pallor, Pulselessness, Poikilothermia, Paresthesias, Paralysis",
      "Atrial fibrillation is the most common cause of acute arterial embolism",
      "Keep ischemic limb dependent - do NOT elevate",
      "Start IV heparin immediately to prevent thrombus propagation"
    ],
    safetyNote: "Do not apply warming devices to ischemic limbs - increases tissue metabolic demand beyond available oxygen supply",
    distractorRationales: [
      "Class IIb: absent pulses, mottled, cool, absent cap refill = immediately threatened",
      "Class I would have audible Doppler signals and no sensory/motor deficit",
      "Class IIa would have only minimal sensory loss without motor involvement",
      "Class III would show muscle rigor and complete paralysis with no Doppler signals"
    ],
    lessonLink: "/emergency/lessons/peripheral-vascular-emergencies"
  },
  {
    stem: "A 65-year-old male is brought to the ED in cardiac arrest. Paramedics report he was found in ventricular fibrillation and has received 3 defibrillation attempts, epinephrine, and amiodarone during 20 minutes of CPR. He remains in refractory VF. Which intervention should the emergency nurse prepare for next?",
    options: [
      "Double sequential external defibrillation using two defibrillators simultaneously",
      "IV procainamide 20 mg/min infusion up to 17 mg/kg",
      "Repeat amiodarone at the initial loading dose of 300 mg",
      "Terminate resuscitation efforts after 20 minutes of refractory VF"
    ],
    correctAnswer: 0,
    rationaleLong: "Refractory ventricular fibrillation (defined as VF persisting after 3 or more standard defibrillation attempts and antiarrhythmic administration) carries an extremely poor prognosis with standard ACLS algorithms. Double sequential external defibrillation (DSED) is an emerging rescue strategy that involves applying two sets of defibrillation pads in different vectors and delivering two shocks in rapid succession (within 1 second of each other) or simultaneously. The rationale is that the dual vectors of current may depolarize a greater mass of myocardium than a single shock, potentially terminating VF when standard defibrillation has failed. The DOSE-VF randomized trial showed improved survival to hospital discharge with DSED compared to standard defibrillation in refractory VF (30.4% vs 13.3%). The typical pad placement uses anterior-lateral position for one set and anterior-posterior for the second set. Both defibrillators are charged to maximum energy (200J biphasic each). The emergency nurse should ensure two defibrillators are available and positioned, with pads applied in perpendicular vectors. Another option in refractory VF is vector change defibrillation (moving pads to anterior-posterior position if previously in anterior-lateral). Procainamide infusion is too slow for cardiac arrest. The second dose of amiodarone in VF arrest is 150 mg, not 300 mg. Termination of efforts after only 20 minutes is premature, especially in a shockable rhythm with potentially reversible causes.",
    learningObjective: "Prepare for double sequential external defibrillation as a rescue strategy for refractory ventricular fibrillation",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Cardiac Arrest Management",
    difficulty: 5,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "DSED uses two defibrillators in perpendicular vectors - an emerging rescue strategy for refractory VF",
    clinicalPearls: [
      "Refractory VF = persistent VF after ≥3 shocks + antiarrhythmics",
      "DSED: two defibrillators, perpendicular pad positions, simultaneous/rapid sequential shocks",
      "DOSE-VF trial showed 30.4% vs 13.3% survival to discharge with DSED",
      "Second amiodarone dose in VF arrest is 150 mg (not 300 mg)"
    ],
    safetyNote: "Ensure all team members are clear before dual defibrillation - double the electrical energy hazard",
    distractorRationales: [
      "DSED is an evidence-based rescue strategy for refractory VF",
      "Procainamide infusion rate is too slow for cardiac arrest",
      "Second amiodarone dose should be 150 mg, not repeated at 300 mg",
      "20 minutes is premature for termination in a shockable rhythm"
    ],
    lessonLink: "/emergency/lessons/cardiac-arrest-management"
  },
  {
    stem: "A 48-year-old female presents with acute onset chest pain, ST elevation in V1-V4, and troponin elevation. Emergent cardiac catheterization reveals normal coronary arteries with no obstructive disease. Left ventriculography shows apical ballooning with hyperkinesis of the basal segments. What is the most likely diagnosis?",
    options: [
      "Takotsubo (stress) cardiomyopathy",
      "Acute myocarditis",
      "Coronary artery spasm (Prinzmetal angina)",
      "Spontaneous coronary artery dissection (SCAD)"
    ],
    correctAnswer: 0,
    rationaleLong: "Takotsubo cardiomyopathy (also called stress cardiomyopathy, apical ballooning syndrome, or broken heart syndrome) presents identically to acute myocardial infarction with chest pain, ST elevation, and troponin elevation, but cardiac catheterization reveals normal coronary arteries without obstructive disease. The hallmark finding on left ventriculography or echocardiography is apical ballooning with compensatory hyperkinesis of the basal segments, giving the ventricle an appearance resembling a Japanese octopus trap (tako-tsubo). The condition is triggered by intense emotional or physical stress and primarily affects postmenopausal women (90% of cases). The pathophysiology involves catecholamine surge causing direct myocardial toxicity and microvascular dysfunction. The apical segments are most affected because they have the highest density of beta-adrenergic receptors. Despite appearing like STEMI, Takotsubo generally has a favorable prognosis with most patients recovering normal ventricular function within 1-4 weeks. However, acute complications can include heart failure, cardiogenic shock (in 5-10%), LVOT obstruction (due to basal hyperkinesis), mitral regurgitation, and LV thrombus formation. Emergency management is supportive: ACE inhibitors or ARBs, beta-blockers (once stable), diuretics if needed for heart failure, and anticoagulation if EF is severely reduced or thrombus is present. Inotropes should be avoided as they can worsen LVOT obstruction. Myocarditis would show myocardial inflammation on MRI. Prinzmetal angina would show transient vasospasm on angiography. SCAD would show dissection flap or intramural hematoma on angiography.",
    learningObjective: "Differentiate Takotsubo cardiomyopathy from acute MI based on catheterization and ventriculography findings",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Cardiomyopathy",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Normal coronaries + apical ballooning + stress trigger = Takotsubo, not MI",
    clinicalPearls: [
      "Takotsubo mimics STEMI but has normal coronary arteries",
      "Apical ballooning with basal hyperkinesis is pathognomonic",
      "90% of cases are postmenopausal women after emotional/physical stress",
      "Most patients recover full ventricular function within 1-4 weeks"
    ],
    safetyNote: "Avoid inotropes (dobutamine, milrinone) in Takotsubo - can worsen LVOT obstruction from basal hyperkinesis",
    distractorRationales: [
      "Takotsubo: normal coronaries + apical ballooning + stress trigger",
      "Myocarditis would show inflammation on cardiac MRI, not apical ballooning",
      "Prinzmetal angina would show coronary vasospasm on angiography",
      "SCAD would show intimal flap or intramural hematoma on angiography"
    ],
    lessonLink: "/emergency/lessons/cardiomyopathy"
  },
  {
    stem: "A 56-year-old male presents with an acute inferior STEMI. During preparation for cardiac catheterization, he develops complete heart block with a ventricular rate of 32 bpm and BP drops to 70/40 mmHg. Atropine 1 mg IV has been given without improvement. What should the emergency nurse prepare next?",
    options: [
      "Transcutaneous pacing at 70 bpm with sedation and analgesia",
      "IV isoproterenol infusion at 2 mcg/min",
      "Emergent transvenous pacemaker insertion at bedside",
      "IV dopamine infusion at 15 mcg/kg/min"
    ],
    correctAnswer: 0,
    rationaleLong: "In symptomatic bradycardia with hemodynamic instability refractory to atropine, transcutaneous pacing (TCP) is the next immediate intervention per ACLS guidelines. TCP is a bridge therapy that provides temporary cardiac pacing externally through adhesive pads placed on the chest. The procedure involves: placing pacing pads in anterior-posterior position, setting the rate to 60-70 bpm, starting at the lowest output (mA) and increasing until electrical capture is achieved (typically 50-100 mA), and confirming mechanical capture by palpating a pulse that correlates with the paced rhythm. Sedation and analgesia (such as midazolam and fentanyl) should be provided because TCP causes significant chest wall muscle contraction and discomfort. This is particularly relevant in the setting of inferior STEMI, where complete heart block commonly occurs because the right coronary artery supplies the AV node in 90% of patients. The heart block associated with inferior MI is usually transient (resolving within days) and occurs at the level of the AV node, producing a narrow-complex escape rhythm. This differs from anterior MI heart block, which occurs below the bundle of His, produces a wide-complex escape, and has a worse prognosis. Isoproterenol is a pure beta-agonist that increases heart rate but also increases myocardial oxygen demand - it is contraindicated in acute MI. Transvenous pacing is the definitive temporary pacing method but requires more time and expertise to insert. Dopamine at 15 mcg/kg/min is primarily a vasopressor dose and would not reliably increase heart rate.",
    learningObjective: "Initiate transcutaneous pacing as a bridge therapy for atropine-refractory symptomatic bradycardia",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Dysrhythmia Management",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "After atropine fails for symptomatic bradycardia, TCP is the next step - not transvenous pacing",
    clinicalPearls: [
      "TCP sequence: atropine fails → TCP at 60-70 bpm → titrate mA to capture",
      "Always provide sedation/analgesia for TCP - it causes painful muscle contractions",
      "Inferior MI heart block is usually at AV node level and transient",
      "Confirm mechanical capture (palpable pulse) not just electrical capture"
    ],
    safetyNote: "Isoproterenol increases myocardial oxygen demand and is contraindicated in acute MI",
    distractorRationales: [
      "TCP is the immediate next step after atropine failure in symptomatic bradycardia",
      "Isoproterenol is contraindicated in acute MI due to increased oxygen demand",
      "Transvenous pacing takes longer to establish and is not the immediate next step",
      "High-dose dopamine is primarily vasopressor and unreliable for chronotropy"
    ],
    lessonLink: "/emergency/lessons/dysrhythmia-management"
  },
  {
    stem: "A 35-year-old female presents with palpitations, tremor, and anxiety. ECG shows atrial fibrillation with rapid ventricular response at 162 bpm. She also has exophthalmos, warm moist skin, and a fine tremor. TSH is undetectable. Which rate control medication should be administered first?",
    options: [
      "IV esmolol 500 mcg/kg bolus followed by 50-200 mcg/kg/min infusion",
      "IV diltiazem 20 mg bolus over 2 minutes",
      "IV digoxin 0.5 mg loading dose",
      "IV amiodarone 150 mg over 10 minutes"
    ],
    correctAnswer: 0,
    rationaleLong: "This patient presents with thyroid storm complicated by atrial fibrillation with rapid ventricular response (RVR). The clinical findings of exophthalmos, warm moist skin, tremor, undetectable TSH, and new-onset atrial fibrillation in a young patient are classic for hyperthyroidism/thyroid storm. Beta-blockers are the first-line treatment for rate control in thyrotoxicosis-related atrial fibrillation because they directly antagonize the excessive beta-adrenergic stimulation that is the primary mechanism of cardiovascular manifestations in thyroid storm. IV esmolol is preferred because of its ultra-short half-life (9 minutes), allowing precise titration in a potentially unstable patient. Propranolol is another excellent option as it also inhibits peripheral conversion of T4 to T3. Beta-blockers address both the cardiac rate and the peripheral sympathetic symptoms (tremor, diaphoresis, anxiety). Diltiazem (calcium channel blocker) can be used for rate control if beta-blockers are contraindicated (severe asthma, decompensated HF), but it does not address the underlying hyperadrenergic state and may cause more hypotension. Digoxin is generally ineffective in thyrotoxicosis because the hyperthyroid state increases digoxin clearance and resistance. Amiodarone contains iodine which can worsen thyrotoxicosis (Jod-Basedow phenomenon) and should generally be avoided unless all other options have failed. Additional management of thyroid storm includes: thionamides (PTU preferred as it also blocks T4→T3 conversion), iodine solution (given at least 1 hour after thionamide), corticosteroids (hydrocortisone 100 mg IV q8h to block T4→T3 conversion and prevent adrenal crisis), and supportive care including cooling measures and IV fluids.",
    learningObjective: "Select beta-blocker therapy as first-line rate control for atrial fibrillation in the setting of thyrotoxicosis",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Endocrine-Related Cardiac Emergencies",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Beta-blockers are first-line for thyrotoxicosis-related AF; amiodarone contains iodine and can worsen thyroid storm",
    clinicalPearls: [
      "Thyroid storm + AF = beta-blocker first-line (esmolol or propranolol)",
      "Propranolol has added benefit of blocking T4 to T3 conversion",
      "Amiodarone contains iodine - avoid in thyrotoxicosis",
      "Digoxin has increased clearance and resistance in thyrotoxicosis"
    ],
    safetyNote: "Amiodarone contains 37% iodine by weight - can trigger iodine-induced thyrotoxicosis",
    distractorRationales: [
      "Esmolol directly antagonizes hyperadrenergic state and allows precise titration",
      "Diltiazem is second-line; doesn't address underlying sympathetic activation",
      "Digoxin is ineffective due to increased clearance in thyrotoxicosis",
      "Amiodarone contains iodine which can worsen thyroid storm"
    ],
    lessonLink: "/emergency/lessons/endocrine-cardiac-emergencies"
  },
  {
    stem: "A 62-year-old male with recent STEMI and PCI with drug-eluting stent placement 3 days ago presents with acute stent thrombosis confirmed on emergent catheterization. He is on aspirin and clopidogrel. What is the most likely contributing factor to acute stent thrombosis?",
    options: [
      "Inadequate platelet inhibition from clopidogrel resistance or non-adherence",
      "Excessive physical activity after PCI",
      "Diet high in vitamin K-containing foods",
      "Use of proton pump inhibitors with clopidogrel"
    ],
    correctAnswer: 0,
    rationaleLong: "Acute stent thrombosis (occurring within 24 hours to 30 days of stent placement) is a catastrophic complication with mortality rates of 20-40%. The most common contributing factor is inadequate antiplatelet therapy, which can result from: (1) clopidogrel resistance/poor metabolizer status - approximately 25-30% of patients are poor metabolizers of clopidogrel due to CYP2C19 genetic polymorphisms, resulting in inadequate conversion of the prodrug to its active metabolite; (2) medication non-adherence - patients may stop or forget dual antiplatelet therapy (DAPT); (3) drug interactions that reduce clopidogrel efficacy. Dual antiplatelet therapy with aspirin and a P2Y12 inhibitor (clopidogrel, ticagrelor, or prasugrel) is essential to prevent stent thrombosis, particularly in the first 30 days when the stent struts are not yet endothelialized. For patients with suspected clopidogrel resistance, switching to ticagrelor or prasugrel (which have more predictable pharmacokinetics and do not depend on CYP2C19 metabolism) is recommended. The emergency nurse's role includes: obtaining a thorough medication adherence history, documenting all current medications including OTC drugs, and educating patients about the critical importance of never discontinuing DAPT without physician guidance. While PPI interaction with clopidogrel was previously a concern, large studies have shown the clinical significance is minimal. Vitamin K affects warfarin, not antiplatelet agents. Physical activity alone does not cause stent thrombosis.",
    learningObjective: "Recognize inadequate antiplatelet therapy as the primary risk factor for acute stent thrombosis",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Post-PCI Emergencies",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "25-30% of patients are clopidogrel poor metabolizers - consider ticagrelor or prasugrel for stent thrombosis",
    clinicalPearls: [
      "Acute stent thrombosis mortality is 20-40%",
      "25-30% of patients are poor CYP2C19 metabolizers of clopidogrel",
      "Never discontinue DAPT without physician guidance after stent placement",
      "Ticagrelor and prasugrel have more reliable antiplatelet effects than clopidogrel"
    ],
    safetyNote: "Educate all post-PCI patients that stopping antiplatelet medications can be fatal - even for minor procedures",
    distractorRationales: [
      "Inadequate platelet inhibition is the primary cause of acute stent thrombosis",
      "Physical activity does not cause stent thrombosis",
      "Vitamin K affects warfarin metabolism, not antiplatelet agents",
      "PPI-clopidogrel interaction has minimal clinical significance in large trials"
    ],
    lessonLink: "/emergency/lessons/post-pci-emergencies"
  },
  {
    stem: "A 74-year-old female presents with new-onset atrial fibrillation with RVR at 148 bpm for 72 hours. She is hemodynamically stable. The emergency physician requests rate control. The nurse notes the patient has a history of HFrEF with EF 25%. Which rate control agent is most appropriate?",
    options: [
      "IV amiodarone 150 mg over 10 minutes followed by infusion",
      "IV diltiazem 20 mg over 2 minutes",
      "IV metoprolol 5 mg every 5 minutes for 3 doses",
      "IV verapamil 5 mg over 2 minutes"
    ],
    correctAnswer: 0,
    rationaleLong: "In patients with atrial fibrillation and heart failure with reduced ejection fraction (HFrEF, EF ≤40%), the choice of rate control agent is critical. Non-dihydropyridine calcium channel blockers (diltiazem and verapamil) are contraindicated in HFrEF because their negative inotropic effects can precipitate acute decompensation and cardiogenic shock. Beta-blockers (metoprolol) can be used for rate control in HFrEF but must be used cautiously in the acute setting, as they can also worsen acute heart failure. IV amiodarone is often the preferred agent for rate control in AF with hemodynamically significant heart failure because: (1) it provides effective rate control through multiple mechanisms (sodium, potassium, calcium channel blockade and beta-blockade), (2) it has minimal negative inotropic effect compared to other antiarrhythmics, (3) it may also promote chemical cardioversion to sinus rhythm. The IV loading dose is 150 mg over 10 minutes, followed by 1 mg/min for 6 hours, then 0.5 mg/min for 18 hours. However, it is important to note that amiodarone should be administered through a central line or large-bore peripheral IV when possible, as it can cause thrombophlebitis and tissue necrosis with peripheral infiltration. For long-term rate control in HFrEF, low-dose beta-blockers (carvedilol, metoprolol succinate, bisoprolol) are preferred and have mortality benefits. Digoxin is another option for rate control in HFrEF but has a narrow therapeutic window. Since the patient has had AF for >48 hours, she requires anticoagulation and either rate control strategy or TEE-guided cardioversion if rhythm control is pursued.",
    learningObjective: "Select amiodarone for rate control of AF in patients with severe heart failure where CCBs are contraindicated",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Dysrhythmia Management",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Diltiazem and verapamil are CONTRAINDICATED in HFrEF - they can cause cardiogenic shock",
    clinicalPearls: [
      "CCBs (diltiazem, verapamil) are contraindicated in HFrEF (EF ≤40%)",
      "IV amiodarone has minimal negative inotropic effect",
      "AF >48 hours requires anticoagulation before cardioversion (or TEE-guided)",
      "Administer amiodarone through central line when possible to prevent phlebitis"
    ],
    safetyNote: "IV amiodarone through peripheral IV can cause severe thrombophlebitis - use largest available vein and monitor site closely",
    distractorRationales: [
      "Amiodarone provides rate control with minimal negative inotropy in HFrEF",
      "Diltiazem is contraindicated in HFrEF due to negative inotropic effects",
      "IV metoprolol can worsen acute heart failure and should be used cautiously",
      "Verapamil is contraindicated in HFrEF - can precipitate cardiogenic shock"
    ],
    lessonLink: "/emergency/lessons/dysrhythmia-management"
  },
  {
    stem: "A 28-year-old male presents after blunt chest trauma from a motor vehicle collision. He is tachycardic at 130 bpm with muffled heart sounds and JVD. An eFAST exam shows pericardial fluid. BP is 72/40 mmHg. Pericardiocentesis removes 30 mL of blood but the patient continues to deteriorate. What is the next step?",
    options: [
      "Emergent resuscitative thoracotomy in the ED",
      "Repeat pericardiocentesis with a larger-bore needle",
      "Administer IV fluids and vasopressors while awaiting OR availability",
      "Obtain CT chest with contrast for definitive diagnosis"
    ],
    correctAnswer: 0,
    rationaleLong: "This patient presents with traumatic cardiac tamponade (Beck's triad: hypotension, muffled heart sounds, JVD) from blunt chest trauma that is not responding to pericardiocentesis. Traumatic tamponade differs from medical tamponade in that the pericardial blood is often clotted and mixed with ongoing hemorrhage from myocardial or great vessel injury. When pericardiocentesis fails to relieve traumatic tamponade (as in this case where only 30 mL was aspirated despite ongoing hemodynamic compromise), emergent resuscitative thoracotomy (ERT) in the ED is indicated. ERT involves a left anterolateral thoracotomy that allows direct access to the pericardium for surgical drainage (pericardiotomy), identification and repair of cardiac injuries (cardiorrhaphy), cross-clamping the descending aorta to redirect blood flow to the brain and heart, and internal cardiac massage if needed. The survival rate for ERT in penetrating cardiac injuries is approximately 10-35%, while blunt cardiac injuries have lower survival rates (1-2%). However, in a patient with witnessed cardiac tamponade who is deteriorating, ERT offers the only chance of survival. The emergency nurse's role includes: preparing the thoracotomy tray, ensuring blood products are available (activate massive transfusion protocol), preparing internal defibrillator paddles, and assisting with the procedure. Repeat pericardiocentesis is unlikely to succeed if the blood is clotted. Fluids and vasopressors alone will not address the ongoing cardiac injury. CT imaging would dangerously delay definitive intervention.",
    learningObjective: "Recognize indications for emergent resuscitative thoracotomy when pericardiocentesis fails in traumatic tamponade",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Traumatic Cardiac Emergencies",
    difficulty: 5,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Traumatic tamponade failing pericardiocentesis requires ED thoracotomy - clotted blood won't drain through a needle",
    clinicalPearls: [
      "Traumatic tamponade often has clotted blood that won't drain via pericardiocentesis",
      "ERT allows pericardiotomy, cardiorrhaphy, and aortic cross-clamping",
      "Penetrating cardiac injury ERT survival: 10-35%; blunt: 1-2%",
      "Activate massive transfusion protocol before ERT"
    ],
    safetyNote: "ERT is a high-risk procedure requiring immediate availability of blood products and surgical backup",
    distractorRationales: [
      "ERT is indicated when pericardiocentesis fails in traumatic tamponade with ongoing deterioration",
      "Repeat pericardiocentesis is unlikely to succeed with clotted intrapericardial blood",
      "Fluids and vasopressors do not address the mechanical cause of tamponade",
      "CT imaging would cause fatal delay in a hemodynamically unstable patient"
    ],
    lessonLink: "/emergency/lessons/traumatic-cardiac-emergencies"
  },
  {
    stem: "A nurse is performing post-ROSC care on a 58-year-old male who achieved return of spontaneous circulation after 18 minutes of CPR for VF arrest. Current vitals: BP 142/88, HR 92, SpO2 99% on 100% FiO2, temperature 36.8°C. What is the priority nursing intervention?",
    options: [
      "Titrate FiO2 down to target SpO2 94-96% and initiate targeted temperature management to 32-36°C",
      "Maintain 100% FiO2 and administer IV dopamine for blood pressure support",
      "Obtain head CT scan to rule out neurological injury",
      "Transfer immediately to cardiac catheterization lab"
    ],
    correctAnswer: 0,
    rationaleLong: "Post-ROSC (Return of Spontaneous Circulation) care follows a systematic approach to optimize outcomes after cardiac arrest. Two critical interventions for this patient are: (1) Avoiding hyperoxia by titrating FiO2 to target SpO2 94-96%. The patient's current SpO2 of 99% on 100% FiO2 represents hyperoxia, which is harmful after cardiac arrest because excessive oxygen generates reactive oxygen species (free radicals) that worsen reperfusion injury to the brain and heart. Multiple studies have demonstrated that post-ROSC hyperoxia is independently associated with increased mortality. The nurse should titrate FiO2 down to the lowest level that maintains SpO2 between 94-96%. (2) Initiating targeted temperature management (TTM) to 32-36°C for at least 24 hours. TTM is a cornerstone of neuroprotection after cardiac arrest, reducing cerebral metabolic demand by 6-8% per degree Celsius and mitigating reperfusion injury. Current AHA guidelines recommend TTM at 32-36°C for comatose patients after ROSC. Cooling methods include IV cold saline (4°C at 30 mL/kg), surface cooling devices, and intravascular cooling catheters. The nurse should avoid shivering (which increases metabolic demand) using sedation and neuromuscular blockade if needed. Maintaining 100% FiO2 perpetuates harmful hyperoxia. The BP is adequate and does not require vasopressor support. While head CT and cardiac catheterization may be needed, optimizing oxygenation and initiating TTM are immediate priorities in the post-ROSC phase.",
    learningObjective: "Implement post-ROSC bundle including avoidance of hyperoxia and initiation of targeted temperature management",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Post-Cardiac Arrest Care",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Post-ROSC hyperoxia (SpO2 100%) is harmful - titrate to 94-96%; don't leave on 100% FiO2",
    clinicalPearls: [
      "Post-ROSC SpO2 target: 94-96% (avoid both hypoxia and hyperoxia)",
      "TTM at 32-36°C for 24 hours in comatose post-arrest patients",
      "Hyperoxia generates free radicals and worsens reperfusion brain injury",
      "Manage shivering aggressively during TTM - it increases metabolic demand"
    ],
    safetyNote: "Post-ROSC hyperoxia is independently associated with increased mortality - never leave patient on 100% FiO2 once stable",
    distractorRationales: [
      "Titrating FiO2 and initiating TTM are the priority post-ROSC interventions",
      "100% FiO2 maintenance causes harmful hyperoxia in post-arrest patients",
      "Head CT is important but optimizing oxygenation and TTM take priority",
      "Catheterization may be needed but post-ROSC optimization comes first"
    ],
    lessonLink: "/emergency/lessons/post-cardiac-arrest-care"
  },
  {
    stem: "A 66-year-old male with known severe aortic stenosis presents with syncope and chest pain. BP is 88/60 mmHg, HR 52 bpm. ECG shows sinus bradycardia with LVH. Which vasopressor should the emergency nurse prepare for hypotension in this patient?",
    options: [
      "IV phenylephrine infusion starting at 40-100 mcg/min",
      "IV dobutamine infusion starting at 2.5 mcg/kg/min",
      "IV nitroglycerin infusion starting at 10 mcg/min",
      "IV milrinone 50 mcg/kg loading dose over 10 minutes"
    ],
    correctAnswer: 0,
    rationaleLong: "Severe aortic stenosis creates a fixed obstruction to left ventricular outflow, resulting in a pressure-dependent circulation. The hypertrophied left ventricle depends on adequate coronary perfusion pressure, which requires maintenance of systemic vascular resistance (SVR). Phenylephrine, a pure alpha-1 agonist, is the preferred vasopressor because it increases SVR and blood pressure without increasing heart rate or contractility. This is critical because: (1) increasing heart rate in aortic stenosis reduces diastolic filling time, which both reduces cardiac output (the stiff ventricle needs adequate diastolic filling) and reduces coronary perfusion (which occurs primarily during diastole in the hypertrophied LV); (2) the fixed outflow obstruction means inotropes cannot significantly increase stroke volume. Dobutamine is a positive inotrope and chronotrope that increases myocardial oxygen demand - dangerous in a ventricle that is already oxygen-supply limited due to severe LVH and reduced diastolic perfusion. It also causes peripheral vasodilation which worsens hypotension. Nitroglycerin reduces preload through venodilation and is contraindicated in severe aortic stenosis because these patients are preload-dependent, and nitroglycerin can cause catastrophic hypotension. Milrinone is an inodilator (increases contractility while reducing SVR) - the vasodilation is dangerous in aortic stenosis. The emergency nurse should also avoid rapid IV fluid challenges as the non-compliant LV can develop pulmonary edema with relatively small volume increases.",
    learningObjective: "Select phenylephrine as the appropriate vasopressor for hypotension in severe aortic stenosis",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Valvular Emergencies",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Severe AS needs SVR maintenance (phenylephrine) - vasodilators and inotropes are dangerous",
    clinicalPearls: [
      "Severe AS patients are preload-dependent with fixed cardiac output",
      "Phenylephrine increases SVR without affecting HR or contractility",
      "Avoid tachycardia - reduces diastolic filling and coronary perfusion",
      "Nitroglycerin can cause fatal hypotension in severe aortic stenosis"
    ],
    safetyNote: "Nitroglycerin is absolutely contraindicated in severe aortic stenosis - can cause irreversible cardiovascular collapse",
    distractorRationales: [
      "Phenylephrine maintains SVR without increasing HR or myocardial oxygen demand",
      "Dobutamine increases HR and oxygen demand while causing vasodilation",
      "Nitroglycerin reduces preload and is contraindicated in preload-dependent states",
      "Milrinone causes vasodilation and worsens hypotension in fixed obstruction"
    ],
    lessonLink: "/emergency/lessons/valvular-emergencies"
  },
  {
    stem: "A 42-year-old female presents with sudden onset of pleuritic chest pain and dyspnea. She is on oral contraceptives and recently completed a 14-hour international flight. D-dimer is elevated at 2,400 ng/mL. CT angiography is delayed due to contrast allergy. Which bedside assessment finding would most support the diagnosis of acute pulmonary embolism?",
    options: [
      "Bedside echocardiography showing RV dilation with McConnell's sign",
      "Positive troponin I at 0.08 ng/mL",
      "S1Q3T3 pattern on 12-lead ECG",
      "Bilateral lower extremity edema on examination"
    ],
    correctAnswer: 0,
    rationaleLong: "When CT pulmonary angiography is delayed or unavailable, bedside echocardiography becomes a critical diagnostic tool for pulmonary embolism. The most specific echocardiographic finding for acute PE is McConnell's sign - regional right ventricular wall motion abnormality with akinesia of the mid-free wall and preserved apical contractility (apical hyperkinesis). This sign has a specificity of 94% for acute PE. Additional echocardiographic findings in PE include: RV dilation (RV:LV ratio >1:1), interventricular septal bowing toward the left ventricle (D-sign), tricuspid regurgitation with elevated pulmonary artery systolic pressure, and loss of IVC respiratory variation (indicating elevated right atrial pressure). These findings combined with the clinical presentation (risk factors of OCP use and prolonged immobility, elevated D-dimer) strongly support the diagnosis. While positive troponin indicates myocardial injury and is a prognostic marker in PE (indicates RV strain), it is nonspecific and can be elevated in many conditions. The S1Q3T3 ECG pattern (large S wave in lead I, Q wave and inverted T wave in lead III) is classically associated with PE but has poor sensitivity (present in only 10-25% of PE cases) and low specificity. Bilateral lower extremity edema is a sign of chronic venous insufficiency or bilateral DVT but is not specific for PE; most PE patients have unilateral DVT if any. For contrast allergy, premedication protocols (methylprednisolone 32 mg at 12 and 2 hours before, plus diphenhydramine 50 mg 1 hour before) can be used if CTA is needed, or V/Q scan is an alternative imaging modality.",
    learningObjective: "Utilize bedside echocardiography with McConnell's sign as a diagnostic tool when CTA is unavailable for PE",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Pulmonary Embolism",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "McConnell's sign (RV free wall akinesia with preserved apex) is 94% specific for acute PE",
    clinicalPearls: [
      "McConnell's sign: RV free wall akinesia + preserved apical motion = 94% specificity for PE",
      "RV:LV ratio >1:1 on echo indicates significant RV strain",
      "S1Q3T3 is classic but only present in 10-25% of PE cases",
      "OCP use + prolonged immobility are major PE risk factors"
    ],
    safetyNote: "For contrast allergy with suspected massive PE, benefit of CTA may outweigh allergy risk - discuss with attending",
    distractorRationales: [
      "Bedside echo with McConnell's sign is the most specific bedside finding for PE",
      "Troponin is a prognostic marker but nonspecific for PE diagnosis",
      "S1Q3T3 has poor sensitivity and specificity for PE",
      "Bilateral edema suggests chronic venous insufficiency, not acute PE"
    ],
    lessonLink: "/emergency/lessons/pulmonary-embolism"
  },
  {
    stem: "A 50-year-old male presents with acute chest pain and hypotension (BP 78/50). ECG shows ST elevation in V1-V4. Bedside echocardiography reveals a left ventricular free wall rupture with hemopericardium. What differentiates this from simple cardiac tamponade in terms of management?",
    options: [
      "Pericardiocentesis is a temporizing measure only; definitive treatment requires emergent surgical repair",
      "This is managed identically to medical tamponade with pericardiocentesis alone",
      "IV thrombolysis should be administered to treat the underlying STEMI before addressing tamponade",
      "Volume resuscitation alone can stabilize the patient until the myocardium heals"
    ],
    correctAnswer: 0,
    rationaleLong: "Left ventricular free wall rupture is a catastrophic mechanical complication of acute myocardial infarction, occurring in 1-6% of STEMIs, typically 3-5 days post-MI (but can occur earlier). It differs from simple medical tamponade because the source of pericardial fluid accumulation is ongoing hemorrhage from the ruptured myocardium, meaning pericardiocentesis provides only temporary hemodynamic relief - the pericardium will rapidly re-accumulate blood. The only definitive treatment is emergent surgical repair. The typical clinical presentation follows a biphasic pattern: the patient may initially have transient chest pain and hypotension that temporarily improves (sentinel bleed), followed by sudden catastrophic hemodynamic collapse from complete rupture. Risk factors include: first MI (no prior ischemic preconditioning), anterior wall MI, older age, female sex, and delayed or no reperfusion therapy. Emergency management includes: immediate pericardiocentesis as a temporizing bridge, aggressive volume resuscitation (fluids and blood products), vasopressor support (avoid positive inotropes which increase wall stress), and IMMEDIATE surgical consultation for operative repair. IV thrombolysis is absolutely contraindicated in the setting of cardiac rupture as it would worsen hemorrhage. Volume resuscitation alone cannot compensate for ongoing myocardial hemorrhage. The emergency nurse should prepare for emergent OR transfer, ensure massive transfusion protocol is activated, and have the thoracotomy tray available. Subacute LV free wall rupture (contained by thrombus or pericardial adhesions - pseudoaneurysm) may present more gradually and allow time for planned surgical intervention.",
    learningObjective: "Differentiate management of LV free wall rupture from simple tamponade and recognize the need for emergent surgical repair",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Mechanical Complications of MI",
    difficulty: 5,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "LV free wall rupture: pericardiocentesis is only a bridge - ongoing hemorrhage requires surgical repair",
    clinicalPearls: [
      "LV free wall rupture occurs 3-5 days post-MI in 1-6% of STEMIs",
      "Sentinel bleed: transient hypotension before catastrophic collapse",
      "Risk factors: first MI, anterior wall, older age, female sex",
      "Pericardiocentesis is temporizing only - the ventricle continues to bleed"
    ],
    safetyNote: "Thrombolytics are absolutely contraindicated in myocardial rupture - will cause fatal hemorrhage",
    distractorRationales: [
      "Pericardiocentesis temporizes but surgery is required for the ruptured myocardium",
      "Simple tamponade management is insufficient for ongoing myocardial hemorrhage",
      "Thrombolysis would catastrophically worsen hemorrhage from the rupture",
      "Volume alone cannot compensate for continuous bleeding from the ventricular wall"
    ],
    lessonLink: "/emergency/lessons/mechanical-complications-mi"
  },
  {
    stem: "A 38-year-old previously healthy female presents to the ED with progressive dyspnea over 5 days, orthopnea, and new bilateral lower extremity edema. She had a viral URI 2 weeks ago. ECG shows sinus tachycardia with diffuse low voltage and non-specific ST changes. Troponin is mildly elevated. Echocardiography shows global LV dysfunction with EF 20%. What is the most likely diagnosis?",
    options: [
      "Acute viral myocarditis",
      "Acute anterior STEMI",
      "Peripartum cardiomyopathy",
      "Hypertensive cardiomyopathy"
    ],
    correctAnswer: 0,
    rationaleLong: "This presentation is classic for acute viral myocarditis: a young, previously healthy patient with recent viral prodrome (URI 2 weeks ago) presenting with new-onset heart failure symptoms (dyspnea, orthopnea, edema) and evidence of myocardial injury (elevated troponin) with global LV dysfunction on echocardiography. Viral myocarditis is most commonly caused by Coxsackievirus B, adenovirus, parvovirus B19, and human herpesvirus 6. The pathophysiology involves direct viral invasion of cardiomyocytes followed by an immune-mediated inflammatory response that causes myocardial damage. ECG findings are variable but often show sinus tachycardia, low voltage, and non-specific ST-T changes (as opposed to the focal ST elevation pattern of acute MI). The troponin elevation reflects ongoing myocardial cell death. The definitive diagnosis is made by cardiac MRI showing myocardial edema and late gadolinium enhancement in a non-coronary distribution, or less commonly by endomyocardial biopsy (Dallas criteria). Emergency management includes: standard heart failure therapy (diuretics for volume overload, ACE inhibitors/ARBs, beta-blockers once stabilized), hemodynamic support if needed (avoid NSAIDs as they worsen myocardial inflammation), and monitoring for malignant arrhythmias and cardiogenic shock. Mechanical circulatory support (IABP, Impella, ECMO) may be needed for fulminant myocarditis. Most patients recover ventricular function over weeks to months, but approximately 20-30% develop chronic dilated cardiomyopathy. STEMI would show focal ST elevation with regional wall motion abnormalities. Peripartum cardiomyopathy occurs in the last month of pregnancy or within 5 months postpartum. There is no history of hypertension.",
    learningObjective: "Recognize acute viral myocarditis as a cause of new-onset heart failure in young patients with preceding viral illness",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Myocarditis",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Young patient + recent viral illness + new HF + troponin elevation + global LV dysfunction = myocarditis, not MI",
    clinicalPearls: [
      "Viral prodrome 1-2 weeks before cardiac symptoms is classic for myocarditis",
      "Cardiac MRI is the preferred non-invasive diagnostic test",
      "Avoid NSAIDs - they worsen myocardial inflammation in myocarditis",
      "20-30% develop chronic dilated cardiomyopathy"
    ],
    safetyNote: "Monitor for fulminant myocarditis with cardiogenic shock - may require mechanical circulatory support (ECMO)",
    distractorRationales: [
      "Myocarditis: viral prodrome + new HF + troponin + global LV dysfunction",
      "STEMI shows focal ST elevation with regional wall motion abnormalities",
      "Peripartum cardiomyopathy requires pregnancy context",
      "No hypertension history to support hypertensive cardiomyopathy"
    ],
    lessonLink: "/emergency/lessons/myocarditis"
  },
  {
    stem: "A 71-year-old male with chronic atrial fibrillation on apixaban presents after a fall with a large subdural hematoma requiring emergent neurosurgical evacuation. Which reversal agent should the emergency nurse prepare?",
    options: [
      "IV andexanet alfa (Andexxa) loading dose based on timing of last apixaban dose",
      "IV protamine sulfate 50 mg over 10 minutes",
      "IV tranexamic acid 1 gram over 10 minutes",
      "Fresh frozen plasma 4 units for factor replacement"
    ],
    correctAnswer: 0,
    rationaleLong: "Andexanet alfa (Andexxa) is the FDA-approved specific reversal agent for factor Xa inhibitors including apixaban and rivaroxaban. It works as a modified recombinant factor Xa molecule that acts as a decoy, binding to the factor Xa inhibitor and neutralizing its anticoagulant effect. This restores the activity of endogenous factor Xa, allowing normal thrombin generation and hemostasis. The dosing of andexanet alfa depends on the specific agent and timing of the last dose: for apixaban taken >8 hours ago or unknown timing, the low-dose regimen is used (400 mg bolus at 30 mg/min, then 4 mg/min for 2 hours). For apixaban taken within 8 hours, the high-dose regimen is used (800 mg bolus then 8 mg/min for 2 hours). The nurse should have the correct dosing based on last ingestion time. Protamine sulfate is the reversal agent for unfractionated heparin and partially reverses low-molecular-weight heparin - it has no effect on factor Xa inhibitors. Tranexamic acid is an antifibrinolytic that stabilizes existing clots but does not reverse anticoagulant activity. FFP provides clotting factors but does not effectively reverse factor Xa inhibitors because the drug continues to inhibit the infused factor Xa. If andexanet alfa is unavailable, 4-factor PCC (50 units/kg) is recommended as an alternative, though it is not FDA-approved for this indication. Idarucizumab (Praxbind) is the specific reversal agent for dabigatran (a direct thrombin inhibitor), not factor Xa inhibitors.",
    learningObjective: "Identify andexanet alfa as the specific reversal agent for factor Xa inhibitors (apixaban, rivaroxaban)",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Anticoagulation Emergencies",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Andexanet alfa reverses factor Xa inhibitors (apixaban, rivaroxaban); idarucizumab reverses dabigatran",
    clinicalPearls: [
      "Andexanet alfa: decoy factor Xa molecule that binds and neutralizes Xa inhibitors",
      "Dosing depends on timing of last dose: ≤8 hours = high dose, >8 hours = low dose",
      "4-factor PCC (50 units/kg) is the alternative if andexanet alfa unavailable",
      "Protamine reverses heparin; idarucizumab reverses dabigatran"
    ],
    safetyNote: "Andexanet alfa carries a risk of thromboembolic events - monitor for signs of stroke, DVT, and PE after administration",
    distractorRationales: [
      "Andexanet alfa is the FDA-approved specific reversal agent for factor Xa inhibitors",
      "Protamine sulfate reverses heparin, not factor Xa inhibitors",
      "Tranexamic acid is an antifibrinolytic, not a reversal agent for anticoagulants",
      "FFP is ineffective because apixaban continues to inhibit infused factor Xa"
    ],
    lessonLink: "/emergency/lessons/anticoagulation-emergencies"
  },
  {
    stem: "A 55-year-old male presents with crushing chest pain, diaphoresis, and nausea. ECG shows 4 mm ST elevation in leads V1-V6, I, and aVL with ST depression in II, III, and aVF. Troponin is markedly elevated. This ECG pattern suggests occlusion of which vessel and what is the mortality implication?",
    options: [
      "Proximal LAD occlusion causing extensive anterior STEMI with high mortality risk",
      "Right coronary artery occlusion causing inferior STEMI with moderate mortality",
      "Left circumflex artery occlusion causing lateral STEMI with low mortality",
      "Diagonal branch occlusion causing focal anterolateral STEMI"
    ],
    correctAnswer: 0,
    rationaleLong: "Extensive ST elevation across the precordial leads (V1-V6) extending to leads I and aVL, with reciprocal ST depression in the inferior leads (II, III, aVF), indicates a large anterior-lateral STEMI caused by proximal left anterior descending (LAD) artery occlusion. The LAD supplies approximately 40-50% of the left ventricular myocardium, and proximal occlusion (before the first septal and diagonal branches) results in the most extensive area of ischemia, often referred to as the 'widow maker' because of its high mortality rate. The extensive precordial ST elevation (V1-V6) indicates involvement of both the septum and anterior wall, while lateral lead involvement (I, aVL) indicates the diagonal branch territory is also affected. This pattern carries the highest mortality of all STEMI distributions due to: large area of myocardium at risk, high likelihood of developing cardiogenic shock (affecting 10-15% of anterior STEMIs), increased risk of mechanical complications (VSD from septal rupture, LV free wall rupture, acute mitral regurgitation from papillary muscle dysfunction), and high risk of malignant ventricular arrhythmias. Door-to-balloon time is especially critical in proximal LAD occlusion - every minute of delay increases infarct size and mortality. The emergency nurse should ensure the PCI team is activated immediately, prepare for potential cardiogenic shock (vasopressors, IABP, mechanical circulatory support), and have the defibrillator immediately available. RCA occlusion produces inferior STEMI (II, III, aVF). LCx occlusion produces lateral STEMI (I, aVL, V5-V6 typically). A diagonal branch occlusion would produce only focal anterolateral changes.",
    learningObjective: "Correlate extensive precordial ST elevation with proximal LAD occlusion and anticipate high-risk complications",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Acute Coronary Syndromes",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "ST elevation V1-V6 + I, aVL = proximal LAD ('widow maker') with highest mortality among STEMIs",
    clinicalPearls: [
      "Proximal LAD supplies 40-50% of LV myocardium",
      "Extensive anterior STEMI has highest cardiogenic shock risk (10-15%)",
      "Watch for mechanical complications: VSD, free wall rupture, MR",
      "Door-to-balloon time is most critical in proximal LAD occlusion"
    ],
    safetyNote: "Have defibrillator at bedside and prepare for cardiogenic shock in all extensive anterior STEMIs",
    distractorRationales: [
      "Extensive precordial + lateral ST elevation = proximal LAD territory",
      "RCA occlusion produces inferior STEMI pattern only",
      "LCx occlusion typically affects lateral leads without extensive precordial involvement",
      "Diagonal branch occlusion produces only focal anterolateral changes"
    ],
    lessonLink: "/emergency/lessons/acute-coronary-syndromes"
  },
  {
    stem: "A 80-year-old female presents with acute-onset shortness of breath. She had a mechanical fall 5 days ago. ECG shows new right bundle branch block and S1Q3T3 pattern. Bedside echocardiography shows RV dilation. Lower extremity ultrasound reveals a proximal DVT in the left femoral vein. She has a contraindication to anticoagulation due to recent hemorrhagic stroke 2 weeks ago. What is the appropriate intervention?",
    options: [
      "Emergent inferior vena cava (IVC) filter placement",
      "Systemic thrombolysis with alteplase despite the contraindication",
      "Start subcutaneous fondaparinux at prophylactic dose",
      "Observation with serial echocardiograms and repeat imaging in 48 hours"
    ],
    correctAnswer: 0,
    rationaleLong: "This patient presents with submassive pulmonary embolism (echocardiographic RV dilation indicating right heart strain without hemodynamic instability) and confirmed proximal DVT, but has an absolute contraindication to anticoagulation due to recent hemorrhagic stroke (within 2 weeks). In this scenario, the appropriate intervention is emergent inferior vena cava (IVC) filter placement. An IVC filter is a mechanical device placed in the inferior vena cava (typically via femoral or jugular venous access under fluoroscopic guidance) that physically traps emboli migrating from the deep venous system to the pulmonary vasculature, preventing further PE. IVC filter indications include: (1) confirmed VTE with absolute contraindication to anticoagulation (as in this case), (2) recurrent PE despite adequate anticoagulation, (3) after pulmonary embolectomy in select cases. A retrievable IVC filter is preferred over a permanent filter, as it can be removed once the contraindication to anticoagulation resolves and therapeutic anticoagulation can be safely initiated. Systemic thrombolysis is absolutely contraindicated with a recent hemorrhagic stroke - the risk of fatal intracranial hemorrhage is extremely high. Fondaparinux at prophylactic dose provides inadequate anticoagulation and still carries bleeding risk in a patient with recent hemorrhagic stroke. Observation alone is inappropriate given the confirmed PE with RV strain and ongoing DVT serving as a source for further emboli. The emergency nurse should prepare for the IVC filter placement procedure, ensure the interventional radiology or vascular surgery team is consulted, and monitor for signs of hemodynamic deterioration.",
    learningObjective: "Identify IVC filter placement as the appropriate intervention for VTE when anticoagulation is absolutely contraindicated",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Pulmonary Embolism",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Absolute contraindication to anticoagulation + confirmed VTE = IVC filter indication",
    clinicalPearls: [
      "IVC filter indications: VTE + absolute contraindication to anticoagulation",
      "Retrievable filters preferred - remove once anticoagulation can be safely started",
      "Recent hemorrhagic stroke is an absolute contraindication to both anticoagulation and thrombolysis",
      "New RBBB + S1Q3T3 + RV dilation = acute right heart strain from PE"
    ],
    safetyNote: "Thrombolysis with recent hemorrhagic stroke can cause fatal rebleeding - this is an absolute contraindication",
    distractorRationales: [
      "IVC filter prevents further PE when anticoagulation is contraindicated",
      "Thrombolysis is absolutely contraindicated with recent hemorrhagic stroke",
      "Prophylactic fondaparinux is inadequate therapy and still carries bleeding risk",
      "Observation risks further PE from the confirmed proximal DVT"
    ],
    lessonLink: "/emergency/lessons/pulmonary-embolism"
  },
  {
    stem: "A 45-year-old male presents with severe tearing epigastric pain radiating to the back after a bout of heavy vomiting. Chest X-ray shows left-sided pleural effusion and pneumomediastinum. HR 128, BP 92/58, temperature 39.1°C. What does this presentation most likely represent?",
    options: [
      "Boerhaave syndrome (esophageal rupture) requiring emergent surgical consultation",
      "Acute pancreatitis with pleural effusion requiring IV fluids and pain management",
      "Aortic dissection with left pleural effusion requiring anti-impulse therapy",
      "Spontaneous pneumothorax requiring chest tube placement"
    ],
    correctAnswer: 0,
    rationaleLong: "Boerhaave syndrome is a spontaneous transmural perforation of the esophagus, typically caused by forceful vomiting (emetogenic rupture). The classic presentation is Mackler's triad: vomiting, chest pain, and subcutaneous emphysema. This patient demonstrates several hallmark features: severe pain after vomiting, left-sided pleural effusion (most esophageal perforations occur in the left posterolateral distal esophagus, leading to left pleural contamination), pneumomediastinum (air tracking from the perforated esophagus into the mediastinum), and early sepsis signs (fever, tachycardia, hypotension from mediastinitis). Boerhaave syndrome is a surgical emergency with mortality exceeding 90% if not treated within 24 hours. The diagnosis is confirmed by CT chest with water-soluble oral contrast (Gastrografin) showing esophageal leak, or esophagography. Emergency management includes: NPO status, broad-spectrum IV antibiotics covering oral flora and anaerobes (piperacillin-tazobactam or meropenem), aggressive IV fluid resuscitation, left chest tube placement for pleural drainage, and emergent cardiothoracic surgery consultation for operative repair. The emergency nurse should prepare for potential rapid deterioration, establish large-bore IV access, and anticipate massive fluid requirements. Acute pancreatitis can cause pleural effusion but not pneumomediastinum. Aortic dissection presents with tearing pain but without pneumomediastinum or fever. Spontaneous pneumothorax would not cause pleural effusion or pneumomediastinum in this pattern.",
    learningObjective: "Recognize Boerhaave syndrome presentation and prioritize emergent surgical intervention",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Thoracic Emergencies",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Vomiting + chest pain + pneumomediastinum = Boerhaave syndrome until proven otherwise",
    clinicalPearls: [
      "Mackler's triad: vomiting, chest pain, subcutaneous emphysema",
      "Mortality >90% if untreated within 24 hours",
      "Left-sided pleural effusion due to left posterolateral esophageal perforation",
      "Confirm with CT or esophagography using water-soluble contrast (not barium)"
    ],
    safetyNote: "Never use barium contrast for suspected esophageal perforation - barium causes severe mediastinitis",
    distractorRationales: [
      "Boerhaave syndrome: vomiting + pain + pleural effusion + pneumomediastinum",
      "Pancreatitis causes pleural effusion but not pneumomediastinum",
      "Aortic dissection lacks pneumomediastinum and fever in this pattern",
      "Pneumothorax alone doesn't explain pleural effusion and pneumomediastinum together"
    ],
    lessonLink: "/emergency/lessons/thoracic-emergencies"
  },
  {
    stem: "During a code blue, a nurse notices the patient is in pulseless electrical activity (PEA) with an organized rhythm on the monitor but no palpable pulse. What mnemonic should the nurse use to systematically identify reversible causes?",
    options: [
      "H's and T's: Hypovolemia, Hypoxia, Hydrogen ion, Hypo/Hyperkalemia, Hypothermia, Tension pneumothorax, Tamponade, Toxins, Thrombosis (PE), Thrombosis (MI)",
      "ABCDE: Airway, Breathing, Circulation, Disability, Exposure",
      "SAMPLE: Signs/Symptoms, Allergies, Medications, Past history, Last meal, Events",
      "MONA: Morphine, Oxygen, Nitroglycerin, Aspirin"
    ],
    correctAnswer: 0,
    rationaleLong: "Pulseless electrical activity (PEA) is a cardiac arrest rhythm in which there is organized electrical activity on the monitor but no effective mechanical contraction producing a palpable pulse. The key to managing PEA is identifying and treating the underlying reversible cause, as PEA is almost always secondary to a specific etiology. The H's and T's mnemonic provides a systematic framework for identifying these reversible causes. The H's include: Hypovolemia (most common cause - assess for hemorrhage, dehydration; treat with IV fluids/blood products), Hypoxia (ensure adequate ventilation and oxygenation), Hydrogen ion (acidosis - consider sodium bicarbonate), Hypo/Hyperkalemia (check potassium; treat with calcium chloride, insulin/glucose, sodium bicarbonate for hyperkalemia), and Hypothermia (check core temperature, initiate rewarming). The T's include: Tension pneumothorax (needle decompression followed by chest tube), Tamponade (pericardiocentesis), Toxins (specific antidotes based on ingestion), Thrombosis - Pulmonary (consider thrombolytics for massive PE), and Thrombosis - Coronary (consider emergent PCI). The emergency nurse should simultaneously perform high-quality CPR, administer epinephrine 1 mg IV every 3-5 minutes, and systematically work through each H and T using point-of-care testing (blood gas, potassium, glucose), bedside ultrasound (cardiac activity, pericardial effusion, pneumothorax, IVC status), and clinical assessment. ABCDE is a primary survey approach. SAMPLE is for history gathering. MONA is an outdated ACS protocol.",
    learningObjective: "Apply the H's and T's framework to systematically identify reversible causes of PEA arrest",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Cardiac Arrest Management",
    difficulty: 2,
    cognitiveLevel: "comprehension",
    questionType: "MCQ_SINGLE",
    examTrap: "PEA is almost always caused by a reversible condition - systematic H's and T's evaluation is essential",
    clinicalPearls: [
      "Hypovolemia is the most common cause of PEA arrest",
      "Bedside ultrasound helps identify tamponade, pneumothorax, and hypovolemia during PEA",
      "Epinephrine 1 mg IV every 3-5 minutes during PEA (no defibrillation)",
      "PEA is NOT a shockable rhythm - defibrillation is not indicated"
    ],
    safetyNote: "Do not delay CPR or epinephrine while searching for reversible causes - work through H's and T's in parallel",
    distractorRationales: [
      "H's and T's provides a systematic approach to reversible PEA causes",
      "ABCDE is a primary survey tool, not specific to cardiac arrest management",
      "SAMPLE is for patient history gathering during assessment",
      "MONA is an outdated ACS protocol not applicable to cardiac arrest"
    ],
    lessonLink: "/emergency/lessons/cardiac-arrest-management"
  },
  {
    stem: "A 63-year-old female with mechanical aortic valve on warfarin presents with INR of 1.4, left-sided weakness, and facial droop for 1 hour. CT head is negative for hemorrhage. She is within the thrombolytic window. Can IV alteplase be safely administered?",
    options: [
      "Yes, IV alteplase can be given as INR is below 1.7 and CT shows no hemorrhage",
      "No, any level of anticoagulation with warfarin is an absolute contraindication to alteplase",
      "Yes, but only after complete warfarin reversal with PCC and vitamin K",
      "No, mechanical valve is an absolute contraindication to thrombolytics"
    ],
    correctAnswer: 0,
    rationaleLong: "According to AHA/ASA guidelines for acute ischemic stroke, IV alteplase can be administered to patients on warfarin if the INR is ≤1.7 (some guidelines use <1.7). This patient's INR of 1.4 falls within the acceptable range, and with a negative CT head for hemorrhage and symptoms within the treatment window, she is a candidate for IV thrombolysis. The rationale is that at INR levels ≤1.7, the degree of anticoagulation does not significantly increase the risk of symptomatic intracranial hemorrhage beyond the baseline risk associated with alteplase administration. The standard dose is 0.9 mg/kg (maximum 90 mg), with 10% given as an IV bolus over 1 minute and the remaining 90% infused over 60 minutes. The emergency nurse should: verify the INR result is from a current blood draw (not an outpatient value), obtain the CT head results before drug preparation, ensure BP is controlled (<185/110 mmHg before and <180/105 mmHg during and 24 hours after administration), and closely monitor for signs of bleeding. If the INR were >1.7, alteplase would be contraindicated, and the focus would shift to mechanical thrombectomy for large vessel occlusion. Having a mechanical valve alone is NOT a contraindication to thrombolytics for acute stroke - the focus is on the INR level. Waiting to fully reverse warfarin before giving alteplase would delay treatment beyond the critical window, worsening outcomes. For patients on direct oral anticoagulants (DOACs), alteplase should generally not be given if the drug was taken within 48 hours unless specific drug levels show negligible anticoagulant effect.",
    learningObjective: "Apply INR threshold criteria for safe administration of IV alteplase in warfarin-treated stroke patients",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Stroke-Cardiac Interface",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Warfarin with INR ≤1.7 is NOT a contraindication to IV alteplase for ischemic stroke",
    clinicalPearls: [
      "IV alteplase for stroke is safe with INR ≤1.7 on warfarin",
      "Alteplase dose for stroke: 0.9 mg/kg (max 90 mg), 10% bolus + 90% over 60 min",
      "BP must be <185/110 before alteplase and <180/105 for 24 hours after",
      "Mechanical valve alone is not a contraindication to stroke thrombolysis"
    ],
    safetyNote: "Verify INR is from a current blood draw, not an outpatient value, before administering alteplase",
    distractorRationales: [
      "INR ≤1.7 on warfarin permits safe alteplase administration for stroke",
      "Low-level warfarin anticoagulation is not an absolute contraindication",
      "Waiting for full reversal would cause harmful treatment delays",
      "Mechanical valve is not a contraindication to thrombolytics for stroke"
    ],
    lessonLink: "/emergency/lessons/stroke-cardiac-interface"
  },
  {
    stem: "A 58-year-old male presents with severe substernal chest pain. Initial 12-lead ECG is non-diagnostic. Serial troponins are negative at 0 and 3 hours. However, the patient continues to have intermittent chest pain. What is the most appropriate next step?",
    options: [
      "Obtain serial ECGs every 15-30 minutes and consider posterior leads (V7-V9) and right-sided leads (V4R)",
      "Discharge home with cardiology follow-up in 1 week",
      "Administer GI cocktail and observe for 30 minutes",
      "Order CT coronary angiography for definitive rule-out"
    ],
    correctAnswer: 0,
    rationaleLong: "This patient has ongoing chest pain despite a non-diagnostic initial ECG and negative serial troponins - this does NOT rule out acute coronary syndrome. The most appropriate next step is obtaining serial ECGs (every 15-30 minutes or with any symptom change) and adding additional leads that assess regions not well represented by the standard 12-lead ECG. Posterior leads (V7, V8, V9) are placed on the left posterior chest and can detect posterior STEMI, which occurs with left circumflex artery occlusion and may show only subtle reciprocal changes (ST depression in V1-V3) on standard 12-lead ECG. Approximately 3-5% of all MIs are isolated posterior MIs that can be missed on standard ECG. The posterior leads will show ST elevation ≥0.5 mm if posterior STEMI is present. Right-sided leads (particularly V4R) detect right ventricular STEMI associated with RCA occlusion, which changes management (fluid-responsive, avoid nitroglycerin). The emergency nurse should: maintain the patient on continuous cardiac monitoring, obtain serial 12-lead ECGs with each episode of pain, ensure posterior and right-sided leads are obtained, and repeat troponin testing at 6 hours if clinical suspicion remains high. Early negative troponins do not exclude MI - sensitivity of high-sensitivity troponin at 0 hours is approximately 85-90%, increasing to >99% at 3-6 hours. Discharging a patient with active chest pain is unsafe. A GI cocktail may relieve esophageal spasm pain but does not rule out ACS (some ACS patients get partial relief from antacids). CT coronary angiography is a reasonable option in low-to-intermediate risk patients but should not replace serial ECGs in a patient with ongoing symptoms.",
    learningObjective: "Recognize the importance of serial ECGs and additional lead placement in evaluating ongoing chest pain with non-diagnostic initial workup",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Acute Coronary Syndromes",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Normal ECG + negative troponin does NOT rule out ACS in a patient with ongoing symptoms",
    clinicalPearls: [
      "Posterior MI can be missed on standard 12-lead - add V7-V9 leads",
      "V4R detects RV infarction which changes management significantly",
      "3-5% of MIs are isolated posterior and missed on standard ECG",
      "Serial ECGs every 15-30 minutes during ongoing symptoms"
    ],
    safetyNote: "Never discharge a patient with active chest pain based solely on a single normal ECG and negative troponin",
    distractorRationales: [
      "Serial ECGs with posterior and right-sided leads capture initially missed STEMI",
      "Discharge with active symptoms is unsafe regardless of initial workup results",
      "GI cocktail response does not reliably differentiate GI from cardiac pain",
      "CT angiography does not replace serial ECGs for evolving STEMI detection"
    ],
    lessonLink: "/emergency/lessons/acute-coronary-syndromes"
  }
];
