import { EmergencyNursingQuestion } from "./types";

export const cardiacEmergency7Questions: EmergencyNursingQuestion[] = [
  {
    stem: "A 67-year-old male with STEMI undergoes successful PCI. Two hours later, he develops sudden hypotension (BP 70/40), new holosystolic murmur, and pulmonary edema. Bedside echocardiography shows left-to-right shunting across the interventricular septum. What mechanical complication has occurred?",
    options: [
      "Ventricular septal rupture (VSR) requiring emergent surgical repair",
      "Papillary muscle rupture causing acute mitral regurgitation",
      "Left ventricular free wall rupture with tamponade",
      "Dynamic left ventricular outflow tract obstruction"
    ],
    correctAnswer: 0,
    rationaleLong: "Ventricular septal rupture (VSR) is a life-threatening mechanical complication of acute MI, occurring in approximately 1-2% of STEMIs, typically 3-5 days post-MI (but can occur earlier with reperfusion therapy). The hallmark findings are: new harsh holosystolic murmur best heard at the left lower sternal border (often with a palpable thrill), acute hemodynamic deterioration with pulmonary edema, and echocardiographic evidence of left-to-right shunting across the interventricular septum with color flow Doppler. The shunting causes acute volume overload of the right ventricle and pulmonary vasculature, leading to biventricular failure and cardiogenic shock. VSR complicates anterior MIs (LAD territory) more commonly than inferior MIs, and anterior VSRs are typically apical and simpler in morphology, while inferior VSRs tend to be basal and complex (serpiginous). Emergency management includes: hemodynamic stabilization with vasodilators (nitroprusside or nitroglycerin to reduce afterload and left-to-right shunting), intra-aortic balloon pump (IABP) for afterload reduction and coronary perfusion augmentation, and emergent cardiac surgery for patch repair. Medical therapy alone has a mortality rate exceeding 90%. Papillary muscle rupture also causes a new murmur but shows mitral regurgitation on echo without septal defect. LV free wall rupture presents with tamponade, not a murmur and shunting. LVOT obstruction would show systolic anterior motion of the mitral valve without septal defect.",
    learningObjective: "Identify ventricular septal rupture as a mechanical complication of MI based on clinical and echocardiographic findings",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Mechanical Complications of MI",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "New holosystolic murmur + left-to-right septal shunt post-MI = VSR requiring surgical repair",
    clinicalPearls: [
      "VSR occurs 3-5 days post-MI (earlier with reperfusion therapy)",
      "New harsh holosystolic murmur at left lower sternal border with thrill",
      "Medical therapy alone has >90% mortality - surgery is essential",
      "IABP reduces afterload and decreases left-to-right shunting"
    ],
    safetyNote: "VSR without surgical repair has >90% mortality - do not delay surgical consultation",
    distractorRationales: [
      "VSR shows left-to-right septal shunting on echocardiography",
      "Papillary muscle rupture shows mitral regurgitation without septal defect",
      "Free wall rupture presents with tamponade without new murmur",
      "LVOT obstruction shows SAM of mitral valve without septal defect"
    ],
    lessonLink: "/emergency/lessons/mechanical-complications-mi"
  },
  {
    stem: "A 73-year-old female is found unresponsive. The cardiac monitor shows a flat line in lead II. Before calling the code, what should the emergency nurse verify first?",
    options: [
      "Confirm asystole in at least two leads and check that leads are properly connected",
      "Immediately begin CPR without any verification",
      "Administer epinephrine 1 mg IV while checking the rhythm",
      "Apply defibrillator pads and deliver a shock at 200J"
    ],
    correctAnswer: 0,
    rationaleLong: "When a flat line is observed on the cardiac monitor, the emergency nurse must first confirm true asystole before initiating resuscitation, because artifact (lead disconnection, loose electrodes, signal issues) can mimic asystole. The standard protocol requires: (1) Check that all leads are properly connected and electrodes have good skin contact. (2) Confirm asystole in at least two leads by changing the monitoring lead (flat line in one lead could represent fine VF perpendicular to that lead's axis). (3) Increase the gain/amplitude on the monitor to ensure fine VF is not being missed. (4) Check the patient clinically - assess for responsiveness and pulse. This verification should take only seconds and is critical because: fine ventricular fibrillation can appear as a flat line in a single lead if the electrical vector is perpendicular to that lead's axis, and defibrillation may be the appropriate treatment for fine VF but NOT for true asystole. Defibrillating true asystole is contraindicated and can damage remaining myocardial electrical activity. Once true asystole is confirmed in multiple leads, high-quality CPR should begin immediately with epinephrine 1 mg IV every 3-5 minutes. Asystole is a non-shockable rhythm - defibrillation is never indicated. The H's and T's should be systematically evaluated for reversible causes. Simply beginning CPR without lead verification could mean treating an artifact. Administering epinephrine before confirming the rhythm wastes time and resources if the issue is a disconnected lead.",
    learningObjective: "Verify true asystole in multiple leads before initiating cardiac arrest protocol",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Cardiac Arrest Management",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Always confirm asystole in at least 2 leads - fine VF can appear as flat line in a single lead",
    clinicalPearls: [
      "Confirm asystole in at least 2 leads and check lead connections",
      "Fine VF perpendicular to a single lead axis appears as flat line",
      "Increase monitor gain to detect fine VF that may be treatable",
      "Asystole is a non-shockable rhythm - never defibrillate"
    ],
    safetyNote: "Defibrillating true asystole can eliminate any remaining myocardial electrical activity",
    distractorRationales: [
      "Multi-lead confirmation prevents treating artifact or missing fine VF",
      "Starting CPR without lead verification may treat a disconnected lead",
      "Epinephrine before rhythm confirmation wastes critical time",
      "Defibrillation is contraindicated in asystole - it is a non-shockable rhythm"
    ],
    lessonLink: "/emergency/lessons/cardiac-arrest-management"
  },
  {
    stem: "A 44-year-old female presents with sudden chest pain, shortness of breath, and hemoptysis. She is 6 weeks postpartum. Wells score is 9 (high probability). D-dimer is markedly elevated. What is the preferred initial diagnostic imaging study?",
    options: [
      "CT pulmonary angiography (CTPA) as the gold standard imaging for PE diagnosis",
      "Ventilation-perfusion (V/Q) scan to minimize radiation exposure",
      "Bilateral lower extremity duplex ultrasound",
      "Chest X-ray with lateral view"
    ],
    correctAnswer: 0,
    rationaleLong: "CT pulmonary angiography (CTPA) is the gold standard diagnostic imaging study for pulmonary embolism, with sensitivity of 95-100% and specificity of 97-98% for PE. In this postpartum patient with high clinical probability (Wells score 9, which places her in the PE likely category), CTPA should be performed without delay. While there are considerations about radiation exposure in a young postpartum female, the high clinical probability and potential lethality of untreated PE make CTPA the preferred first-line imaging. CTPA provides: direct visualization of the thrombus within the pulmonary arterial system, assessment of clot burden and location, evaluation of right heart strain (RV enlargement, septal bowing), and identification of alternative diagnoses. The postpartum period (up to 12 weeks) carries a 4-5 fold increased risk of VTE due to hormonal changes, venous stasis, and potential cesarean section. While V/Q scan delivers less breast radiation and is an alternative in patients with normal chest X-ray and no underlying lung disease, it is limited by high rates of indeterminate results (up to 40%) and lower diagnostic accuracy in patients with abnormal chest X-rays. In a high-probability clinical scenario, an indeterminate V/Q result would still require CTPA, delaying diagnosis. Duplex ultrasound can identify DVT (source of PE in 70% of cases) but a negative duplex does not rule out PE. Chest X-ray cannot diagnose PE but may show non-specific findings (Hampton's hump, Westermark sign) and helps in interpreting V/Q scans. Anticoagulation with heparin should be initiated empirically before imaging in high-probability patients.",
    learningObjective: "Select CTPA as the definitive diagnostic study for suspected pulmonary embolism in high-probability patients",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Pulmonary Embolism",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "CTPA is the gold standard for PE diagnosis; initiate anticoagulation before imaging in high-probability patients",
    clinicalPearls: [
      "CTPA sensitivity 95-100%, specificity 97-98% for PE",
      "Postpartum period has 4-5x increased VTE risk up to 12 weeks",
      "Start heparin empirically before imaging in high-probability PE",
      "V/Q scan has up to 40% indeterminate results"
    ],
    safetyNote: "In high clinical probability PE, initiate anticoagulation before imaging - do not wait for confirmation",
    distractorRationales: [
      "CTPA provides direct visualization with highest sensitivity and specificity",
      "V/Q scan has high indeterminate rates and would delay diagnosis",
      "Negative duplex ultrasound does not rule out PE",
      "Chest X-ray cannot diagnose PE and is only a screening tool"
    ],
    lessonLink: "/emergency/lessons/pulmonary-embolism"
  },
  {
    stem: "A 82-year-old male on rivaroxaban presents with massive upper GI hemorrhage. Hemoglobin is 6.2 g/dL, BP 76/44 mmHg, HR 132 bpm. The last dose of rivaroxaban was taken 4 hours ago. Andexanet alfa is unavailable. What is the best alternative for reversal?",
    options: [
      "4-factor prothrombin complex concentrate (4F-PCC) 50 units/kg IV",
      "Fresh frozen plasma 6 units",
      "IV vitamin K 10 mg over 20 minutes",
      "Activated charcoal 50 grams via nasogastric tube"
    ],
    correctAnswer: 0,
    rationaleLong: "When andexanet alfa (the FDA-approved specific reversal agent for factor Xa inhibitors) is unavailable, 4-factor prothrombin complex concentrate (4F-PCC) at a dose of 50 units/kg IV is the recommended alternative for life-threatening bleeding in patients on rivaroxaban or apixaban. 4F-PCC contains concentrated factors II, VII, IX, and X, which can overwhelm the factor Xa inhibition by providing a supraphysiologic level of clotting factors. While 4F-PCC is not FDA-approved specifically for DOAC reversal, multiple studies and guidelines (including ISTH and ACCP) support its use as the best available alternative. The dose of 50 units/kg is higher than the dose used for warfarin reversal (25-50 units/kg based on INR) because the mechanism is different - rather than replacing deficient factors, it provides excess factors to overcome Xa inhibition. FFP is ineffective for DOAC reversal because the factor Xa inhibitor continues to inhibit the factor Xa provided in plasma, and the large volume required (typically 6-8 units = 1.5-2 liters) carries risk of volume overload and transfusion reactions. Vitamin K has no role in DOAC reversal - it assists hepatic synthesis of vitamin K-dependent factors, which is only relevant for warfarin (a vitamin K antagonist). Rivaroxaban does not interfere with vitamin K metabolism. Activated charcoal could reduce further GI absorption if given within 2-4 hours of ingestion, but in a patient with active massive GI hemorrhage, placing an NG tube and administering charcoal is impractical and potentially dangerous. Additionally, concurrent with reversal, the patient needs massive transfusion protocol activation (pRBCs, FFP, platelets in 1:1:1 ratio), aggressive volume resuscitation, emergent GI consultation for endoscopy, and proton pump inhibitor infusion.",
    learningObjective: "Administer 4F-PCC as an alternative reversal strategy for factor Xa inhibitors when andexanet alfa is unavailable",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Anticoagulation Emergencies",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "4F-PCC 50 units/kg is the alternative to andexanet alfa for Xa inhibitor reversal; FFP and vitamin K are ineffective",
    clinicalPearls: [
      "4F-PCC 50 units/kg IV is the alternative when andexanet alfa is unavailable",
      "FFP is ineffective because Xa inhibitor continues to inhibit infused factor Xa",
      "Vitamin K has NO role in DOAC reversal",
      "Activate massive transfusion protocol for hemodynamically unstable GI bleeds"
    ],
    safetyNote: "4F-PCC carries a risk of thromboembolic events; resume anticoagulation as soon as clinically appropriate",
    distractorRationales: [
      "4F-PCC provides supraphysiologic factor levels to overcome Xa inhibition",
      "FFP is ineffective against factor Xa inhibitors still circulating",
      "Vitamin K only reverses warfarin, not direct Xa inhibitors",
      "Activated charcoal is impractical in active massive GI hemorrhage"
    ],
    lessonLink: "/emergency/lessons/anticoagulation-emergencies"
  },
  {
    stem: "A 30-year-old male presents after being struck by lightning. He is unresponsive, apneic, and pulseless. His pupils are fixed and dilated bilaterally. What unique aspect of lightning strike cardiac arrest should guide the emergency nurse's resuscitation approach?",
    options: [
      "Prolonged resuscitation is warranted because lightning-induced cardiac arrest has higher survival rates than other causes and fixed dilated pupils are unreliable prognostic indicators",
      "Resuscitation should be limited to 20 minutes because lightning causes irreversible myocardial damage",
      "Standard ACLS protocols should be followed without modification",
      "Defibrillation is contraindicated due to residual electrical charge in the body"
    ],
    correctAnswer: 0,
    rationaleLong: "Lightning strike cardiac arrest has several unique characteristics that modify the standard resuscitation approach. First, lightning-induced cardiac arrest has paradoxically higher survival rates than other causes of cardiac arrest, particularly in young, previously healthy victims. The mechanism is a massive DC countershock that causes simultaneous depolarization of the entire myocardium, resulting in asystole. In many cases, the heart's intrinsic pacemaker (SA node) can recover automaticity and restart the cardiac rhythm spontaneously. However, if the respiratory center in the brainstem is simultaneously stunned (which is common), the patient may have respiratory arrest outlasting the cardiac arrest, leading to secondary hypoxic cardiac arrest if ventilatory support is not provided promptly. This is why aggressive airway management and ventilation are critical priorities. Second, fixed and dilated pupils are NOT reliable prognostic indicators in lightning strike victims. The massive catecholamine surge from the electrical injury and autonomic dysfunction can cause bilaterally fixed and dilated pupils even in patients who will ultimately have good neurological outcomes. Therefore, pupil findings should NOT be used to determine whether to initiate or terminate resuscitation. Third, in mass casualty lightning events (multiple victims from a single strike), the normal triage principle of 'treating the living first' is reversed - providers should prioritize the apparently dead (pulseless, apneic) patients because they may respond to resuscitation, while those who are conscious and breathing will likely survive without immediate intervention (reverse triage). Defibrillation is safe and indicated if the patient is found in VF. There is no residual electrical charge in the body after a lightning strike.",
    learningObjective: "Apply modified resuscitation principles specific to lightning strike cardiac arrest including prolonged efforts and reverse triage",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Environmental Cardiac Emergencies",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Lightning strike: fixed dilated pupils are unreliable; prolonged resuscitation is warranted; use reverse triage in MCI",
    clinicalPearls: [
      "Lightning cardiac arrest has higher survival rates than other causes",
      "Fixed dilated pupils are unreliable prognostic indicators in lightning strike",
      "Reverse triage: prioritize apparently dead victims in mass casualty lightning events",
      "Respiratory arrest may outlast cardiac arrest - aggressive airway management is critical"
    ],
    safetyNote: "Scene safety: do not approach lightning strike victims during active thunderstorm conditions",
    distractorRationales: [
      "Prolonged resuscitation is warranted due to higher survival and unreliable pupil findings",
      "20-minute limit is arbitrary and does not apply to lightning with its higher survival rates",
      "Standard ACLS needs modification for lightning-specific considerations",
      "Defibrillation is safe and indicated if VF is present - no residual charge"
    ],
    lessonLink: "/emergency/lessons/environmental-cardiac-emergencies"
  },
  {
    stem: "A 59-year-old female presents with acute STEMI. During emergent cardiac catheterization, she develops cardiogenic shock with BP 68/38 mmHg despite maximal vasopressor support. Which mechanical circulatory support device provides the most hemodynamic support?",
    options: [
      "Venoarterial extracorporeal membrane oxygenation (VA-ECMO)",
      "Intra-aortic balloon pump (IABP)",
      "Impella CP percutaneous ventricular assist device",
      "TandemHeart percutaneous left atrial-to-femoral bypass"
    ],
    correctAnswer: 0,
    rationaleLong: "Venoarterial extracorporeal membrane oxygenation (VA-ECMO) provides the highest level of hemodynamic support among all temporary mechanical circulatory support (MCS) devices, capable of providing up to 4-6 liters per minute of cardiac output. VA-ECMO works by draining deoxygenated venous blood from the right atrium (via a large-bore cannula in the femoral vein advanced to the RA), passing it through an external membrane oxygenator for gas exchange, and returning oxygenated blood to the arterial system (via a cannula in the femoral artery). This provides both circulatory and respiratory support, making it unique among MCS devices. The hierarchy of MCS support levels from lowest to highest is: (1) IABP - provides modest augmentation of diastolic coronary perfusion and afterload reduction (0.5-1 L/min support) but has fallen out of favor after the IABP-SHOCK II trial showed no mortality benefit in cardiogenic shock complicating MI; (2) Impella CP - an axial flow pump placed across the aortic valve that actively pumps blood from the LV into the aorta, providing up to 3-4 L/min support; (3) TandemHeart - drains oxygenated blood from the left atrium (via transseptal cannulation) and returns it to the femoral artery, providing up to 4-5 L/min; (4) VA-ECMO - provides full cardiopulmonary support at 4-6 L/min. The choice depends on the degree of hemodynamic compromise, institutional availability, and operator expertise. For cardiogenic shock refractory to vasopressors and less invasive MCS, VA-ECMO represents the highest level of support short of surgical ventricular assist devices or transplant. However, VA-ECMO increases LV afterload, which can worsen pulmonary edema; therefore, LV venting (with an Impella or percutaneous vent) is often needed as an adjunct (ECPELLA configuration).",
    learningObjective: "Compare mechanical circulatory support devices and identify VA-ECMO as providing the highest hemodynamic support",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Cardiogenic Shock",
    difficulty: 5,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "MCS hierarchy: IABP < Impella < TandemHeart < VA-ECMO for hemodynamic support level",
    clinicalPearls: [
      "VA-ECMO provides 4-6 L/min of full cardiopulmonary support",
      "IABP-SHOCK II showed no mortality benefit for IABP in cardiogenic shock",
      "VA-ECMO increases LV afterload - may need LV venting (ECPELLA)",
      "Impella provides active LV unloading at 3-4 L/min"
    ],
    safetyNote: "VA-ECMO requires constant monitoring for limb ischemia, hemolysis, and cannula complications",
    distractorRationales: [
      "VA-ECMO provides the highest support at 4-6 L/min with oxygenation",
      "IABP provides only 0.5-1 L/min augmentation - insufficient for refractory shock",
      "Impella CP provides up to 3-4 L/min but lacks oxygenation capability",
      "TandemHeart provides up to 4-5 L/min but requires transseptal puncture"
    ],
    lessonLink: "/emergency/lessons/cardiogenic-shock"
  },
  {
    stem: "A 55-year-old male presents with palpitations and lightheadedness. ECG shows a wide-complex tachycardia at 175 bpm. The nurse is unsure whether this is ventricular tachycardia or SVT with aberrant conduction. The patient is hemodynamically stable. Which ECG finding most strongly suggests ventricular tachycardia?",
    options: [
      "AV dissociation with independent P waves marching through the QRS complexes",
      "QRS duration of 130 milliseconds",
      "Regular rhythm without variation in R-R intervals",
      "Upright QRS morphology in lead V1"
    ],
    correctAnswer: 0,
    rationaleLong: "The differentiation of wide-complex tachycardia (WCT) between ventricular tachycardia (VT) and supraventricular tachycardia (SVT) with aberrant conduction is one of the most important diagnostic challenges in emergency cardiac care. AV dissociation is the most specific finding for ventricular tachycardia and is considered virtually diagnostic when present. AV dissociation means that the atria and ventricles are beating independently - the atria continue to be paced by the sinus node (producing P waves at the normal rate) while the ventricles are driven by an independent ventricular focus at a faster rate. On the ECG, independent P waves can be seen marching through the QRS complexes at a rate different from the ventricular rate. Related findings include capture beats (a normal narrow QRS complex occurring when a sinus impulse coincidentally conducts to the ventricles during a brief period when they are not refractory) and fusion beats (a hybrid morphology QRS resulting from simultaneous activation of the ventricle by both the sinus impulse and the ventricular focus). AV dissociation, capture beats, and fusion beats are all highly specific for VT. Other features favoring VT include: QRS duration >160 ms, concordance (all precordial leads showing the same QRS direction), northwest axis, and Brugada criteria. A QRS of only 130 ms is relatively narrow for VT (though possible). Regular rhythm can be seen in both VT and SVT. Upright QRS in V1 alone is insufficient - the morphology pattern matters more. Importantly, any hemodynamically stable WCT of uncertain origin should be treated as VT until proven otherwise, as VT is more common (80% of WCT) and more dangerous to misdiagnose.",
    learningObjective: "Identify AV dissociation as the most specific ECG finding for differentiating VT from SVT with aberrancy",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Dysrhythmia Management",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "AV dissociation is virtually diagnostic of VT; when in doubt, treat WCT as VT (80% probability)",
    clinicalPearls: [
      "AV dissociation, capture beats, and fusion beats are highly specific for VT",
      "80% of wide-complex tachycardias are VT, not SVT with aberrancy",
      "When in doubt, treat as VT - safer to treat VT as VT than VT as SVT",
      "Adenosine can be diagnostic but should be used cautiously in WCT"
    ],
    safetyNote: "Never give verapamil for wide-complex tachycardia of uncertain origin - can cause fatal hemodynamic collapse if VT",
    distractorRationales: [
      "AV dissociation is the most specific finding for VT diagnosis",
      "QRS of 130 ms is relatively narrow and seen in both VT and SVT",
      "Regular rhythm can occur in both VT and SVT",
      "V1 morphology alone is insufficient without full morphology analysis"
    ],
    lessonLink: "/emergency/lessons/dysrhythmia-management"
  },
  {
    stem: "A 62-year-old female presents with acute decompensated heart failure and cardiogenic shock. Her wedge pressure is 28 mmHg, cardiac index is 1.6 L/min/m², and SVR is 2400 dynes·s/cm⁵. She is on norepinephrine and the team wants to add an inotrope. Which medication is most appropriate?",
    options: [
      "IV dobutamine starting at 2.5 mcg/kg/min titrated to cardiac index >2.2",
      "IV phenylephrine 100-200 mcg bolus for afterload support",
      "IV vasopressin 0.04 units/min as an additional vasopressor",
      "IV esmolol 500 mcg/kg bolus for rate control"
    ],
    correctAnswer: 0,
    rationaleLong: "This patient presents with classic 'cold and wet' cardiogenic shock (Forrester Class IV): elevated wedge pressure (28 mmHg, indicating pulmonary congestion/volume overload), low cardiac index (1.6 L/min/m², indicating inadequate forward flow - normal is 2.5-4.2), and elevated SVR (2400 dynes·s/cm⁵, indicating compensatory vasoconstriction - normal is 800-1200). The hemodynamic profile indicates the need for an inotrope to increase cardiac contractility and forward flow, while also reducing afterload. Dobutamine is the most appropriate choice because it: (1) increases cardiac contractility (positive inotropy) through beta-1 stimulation, (2) provides mild afterload reduction through beta-2 mediated vasodilation, which is beneficial in this high-SVR state, (3) increases cardiac output and cardiac index. The starting dose of 2.5 mcg/kg/min is titrated based on hemodynamic response, targeting a cardiac index >2.2 L/min/m². The combination of norepinephrine (for MAP support) and dobutamine (for inotropy and mild afterload reduction) is a common and effective strategy in cardiogenic shock. Phenylephrine is a pure alpha agonist that would further increase SVR (already elevated) and afterload, worsening cardiac output in an already failing heart. Vasopressin is another vasopressor that would increase SVR without improving contractility. Esmolol is a beta-blocker that would further reduce cardiac output - absolutely contraindicated in cardiogenic shock. The nurse should monitor for dobutamine-related tachycardia and arrhythmias, and should have continuous hemodynamic monitoring (arterial line and ideally pulmonary artery catheter) to guide titration.",
    learningObjective: "Select dobutamine as the appropriate inotrope for cardiogenic shock with high SVR and low cardiac index",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Cardiogenic Shock",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Cold and wet cardiogenic shock needs inotropy (dobutamine) not more vasopressors which increase afterload",
    clinicalPearls: [
      "Forrester IV (cold & wet): high wedge, low CI, high SVR = inotrope needed",
      "Dobutamine: beta-1 inotropy + beta-2 vasodilation = increased CO with afterload reduction",
      "Target cardiac index >2.2 L/min/m² with dobutamine titration",
      "Norepi + dobutamine is a common effective combination in cardiogenic shock"
    ],
    safetyNote: "Monitor for dobutamine-induced tachycardia and ventricular arrhythmias - dose-related side effects",
    distractorRationales: [
      "Dobutamine provides needed inotropy with mild afterload reduction",
      "Phenylephrine would worsen cardiac output by further increasing SVR",
      "Vasopressin adds vasoconstriction without improving contractility",
      "Esmolol would further reduce cardiac output - contraindicated in shock"
    ],
    lessonLink: "/emergency/lessons/cardiogenic-shock"
  },
  {
    stem: "A 48-year-old female complains of sharp chest pain that worsens with inspiration and improves when leaning forward. ECG shows diffuse ST elevation with PR depression in multiple leads. Which condition does this ECG pattern represent?",
    options: [
      "Acute pericarditis",
      "Anterior STEMI from LAD occlusion",
      "Early repolarization (benign normal variant)",
      "Hyperkalemia"
    ],
    correctAnswer: 0,
    rationaleLong: "The combination of pleuritic chest pain (worsens with inspiration), positional relief (improves leaning forward), and an ECG showing diffuse ST elevation with PR depression is the classic presentation of acute pericarditis. Pericarditis is inflammation of the pericardial sac, most commonly caused by viral infection (Coxsackievirus, echovirus, adenovirus) in young to middle-aged adults. The ECG findings of pericarditis evolve through four stages: Stage I (acute) - diffuse concave-upward ST elevation in most leads with PR depression (most specific finding), Stage II - ST normalization with T-wave flattening, Stage III - diffuse T-wave inversions, Stage IV - ECG normalization. Key differentiating features from STEMI include: (1) ST elevation is DIFFUSE (multiple vascular territories) rather than focal (single coronary territory), (2) ST segments are typically concave upward (scooped) rather than convex (tombstone), (3) PR segment depression is highly specific for pericarditis and virtually absent in STEMI, (4) No reciprocal ST depression (except in aVR and V1), (5) No Q wave formation. Early repolarization can show ST elevation but typically in lateral leads (V4-V6) without PR depression and in asymptomatic patients. Hyperkalemia shows peaked T waves, widened QRS, and eventually sine wave pattern - not diffuse ST elevation. Emergency management of pericarditis includes: NSAIDs (ibuprofen 600 mg TID or aspirin 650 mg TID) as first-line, colchicine 0.5 mg BID to reduce recurrence, echocardiography to assess for pericardial effusion, and monitoring for tamponade physiology.",
    learningObjective: "Differentiate the ECG pattern of acute pericarditis from STEMI based on diffuse ST changes and PR depression",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Pericardial Emergencies",
    difficulty: 2,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "PR depression is the most specific ECG finding for pericarditis; ST elevation is diffuse, not in a single coronary territory",
    clinicalPearls: [
      "PR depression is highly specific for pericarditis",
      "Pericarditis ST elevation is diffuse and concave-up (scooped)",
      "Pain improves leaning forward, worsens lying flat and with inspiration",
      "Colchicine reduces recurrence rate by 50%"
    ],
    safetyNote: "Always obtain echocardiography to assess for pericardial effusion and early tamponade signs",
    distractorRationales: [
      "Pericarditis: diffuse ST elevation + PR depression + pleuritic positional pain",
      "STEMI has focal ST elevation in a single coronary territory with reciprocal changes",
      "Early repolarization lacks PR depression and occurs in asymptomatic patients",
      "Hyperkalemia shows peaked T waves and widened QRS, not diffuse ST elevation"
    ],
    lessonLink: "/emergency/lessons/pericardial-emergencies"
  },
  {
    stem: "A 70-year-old male presents with syncope. ECG shows third-degree (complete) heart block with a wide-complex ventricular escape rate of 28 bpm. BP is 84/52 mmHg. Atropine is administered without effect. After transcutaneous pacing is initiated as a bridge, what definitive treatment should the emergency nurse prepare for?",
    options: [
      "Emergent transvenous pacemaker placement",
      "IV aminophylline for AV nodal conduction enhancement",
      "Permanent pacemaker implantation in the ED",
      "Synchronized cardioversion at 100J"
    ],
    correctAnswer: 0,
    rationaleLong: "Third-degree (complete) heart block with a wide-complex escape rhythm represents infranodal block (below the AV node, in the bundle of His or bundle branches), which carries a poor prognosis and high risk of asystole. Unlike junctional escape rhythms (narrow complex, rate 40-60 bpm), ventricular escape rhythms are unreliable, slow (20-40 bpm), and prone to sudden failure. Atropine is typically ineffective for infranodal block because it works by enhancing AV nodal conduction (parasympathetic withdrawal), and the block is below the AV node. Transcutaneous pacing is an appropriate bridge therapy but is temporary, uncomfortable, and may not provide reliable capture long-term. The definitive temporary treatment in the ED is transvenous pacemaker placement - a pacing wire is advanced through a central venous access site (typically internal jugular or femoral vein) into the right ventricle, where it directly stimulates the myocardium. This provides reliable, stable, and comfortable pacing until permanent pacemaker implantation can be arranged (typically within 24-48 hours). The emergency nurse's role includes: preparing the transvenous pacing kit, assisting with central venous access (sterile technique), connecting the pacing wire to an external pulse generator, setting appropriate rate (60-80 bpm) and output (typically starting at 5 mA and finding capture threshold), and continuous monitoring for complications (RV perforation, arrhythmias, loss of capture). Aminophylline is rarely used and only in specific scenarios. Permanent pacemaker implantation is performed in the operating room, not the ED. Cardioversion is used for tachyarrhythmias, not bradycardia.",
    learningObjective: "Prepare for emergent transvenous pacemaker insertion as definitive temporary pacing for complete heart block",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Dysrhythmia Management",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Wide-complex complete heart block is infranodal - atropine won't work; needs transvenous pacing",
    clinicalPearls: [
      "Wide-complex escape = infranodal block = atropine-resistant",
      "Narrow-complex escape = junctional = may respond to atropine",
      "TCP is a bridge; transvenous pacing is definitive temporary pacing",
      "Ventricular escape rhythms are unreliable and prone to asystole"
    ],
    safetyNote: "Monitor for RV perforation during transvenous pacer insertion - watch for ST changes and hemodynamic deterioration",
    distractorRationales: [
      "Transvenous pacing provides reliable definitive temporary pacing",
      "Aminophylline is rarely effective and not standard of care",
      "Permanent pacemakers are implanted surgically, not in the ED",
      "Cardioversion treats tachyarrhythmias, not bradycardia"
    ],
    lessonLink: "/emergency/lessons/dysrhythmia-management"
  },
  {
    stem: "A 52-year-old male presents with acute chest pain. His initial troponin I is 0.04 ng/mL (borderline elevated). A repeat troponin 3 hours later is 0.42 ng/mL. The ECG shows new T-wave inversions in V1-V4. What does this troponin pattern indicate?",
    options: [
      "Acute myocardial injury consistent with NSTEMI - the rising troponin pattern confirms acute injury",
      "Chronic troponin elevation from heart failure - stable values indicating chronic injury",
      "False positive troponin from laboratory error - repeat testing is unreliable",
      "Normal troponin variation - both values are within the normal range"
    ],
    correctAnswer: 0,
    rationaleLong: "The rise-and-fall pattern of troponin (from 0.04 to 0.42 ng/mL over 3 hours, representing a >10x increase) combined with new T-wave inversions in V1-V4 is diagnostic of acute myocardial injury, specifically NSTEMI (Non-ST Elevation Myocardial Infarction). The fourth universal definition of MI requires: (1) rise and/or fall of cardiac troponin with at least one value above the 99th percentile upper reference limit, AND (2) clinical evidence of myocardial ischemia (symptoms, new ECG changes, imaging evidence, or angiographic findings). The KEY concept is the delta (change) in troponin values, not just a single elevated value. A rising pattern (delta >20% when baseline is elevated, or any rise from below the 99th percentile to above it) indicates ACUTE myocardial injury and distinguishes acute MI from chronic troponin elevation. Chronic troponin elevation (seen in heart failure, chronic kidney disease, and other conditions) shows stable values without significant rise or fall over serial measurements. In this case, the 10-fold rise over 3 hours clearly indicates acute injury, not chronic elevation. The new T-wave inversions provide the ischemic context. This patient should be managed with antiplatelet therapy (aspirin + P2Y12 inhibitor), anticoagulation (heparin), anti-ischemic therapy (beta-blocker, nitroglycerin), and cardiology consultation for risk stratification and likely cardiac catheterization within 24-72 hours based on risk scoring (TIMI or GRACE score). High-risk features (ongoing chest pain, hemodynamic instability, electrical instability, very elevated troponin) may warrant emergent catheterization.",
    learningObjective: "Interpret the rise-and-fall troponin pattern as diagnostic of acute myocardial injury (NSTEMI)",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Acute Coronary Syndromes",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "The DELTA (change) in troponin over serial draws, not a single value, differentiates acute from chronic injury",
    clinicalPearls: [
      "Rising troponin pattern = acute injury; stable elevation = chronic injury",
      "Delta >20% with elevated baseline, or any rise above 99th percentile = acute",
      "NSTEMI = rising troponin + clinical evidence of ischemia without ST elevation",
      "TIMI or GRACE score guides timing of cardiac catheterization"
    ],
    safetyNote: "A single normal troponin does not rule out MI - serial testing at 0 and 3-6 hours is mandatory",
    distractorRationales: [
      "The 10x rise in troponin over 3 hours confirms acute myocardial injury",
      "Chronic elevation would show stable values without significant delta",
      "The consistent rise across two samples rules out laboratory error",
      "Both values exceed the 99th percentile - these are not normal"
    ],
    lessonLink: "/emergency/lessons/acute-coronary-syndromes"
  },
  {
    stem: "A 68-year-old female with known Wolff-Parkinson-White (WPW) syndrome presents with irregular wide-complex tachycardia at 220 bpm. She is conscious but symptomatic with dizziness and chest pain. Which medication is absolutely contraindicated?",
    options: [
      "IV adenosine because it can precipitate ventricular fibrillation in WPW with atrial fibrillation",
      "IV procainamide because it slows conduction through the accessory pathway",
      "IV amiodarone because it prolongs the refractory period of the accessory pathway",
      "Synchronized cardioversion because electrical therapy is dangerous in WPW"
    ],
    correctAnswer: 0,
    rationaleLong: "Wolff-Parkinson-White (WPW) syndrome involves an accessory pathway (bundle of Kent) that provides an additional electrical connection between the atria and ventricles, bypassing the AV node. When a patient with WPW develops atrial fibrillation (AF), the rapid atrial impulses can conduct directly to the ventricles through the accessory pathway (which has a shorter refractory period than the AV node), producing an irregular wide-complex tachycardia with very rapid rates (often >200 bpm). This is a life-threatening situation. Medications that block AV nodal conduction (adenosine, verapamil, diltiazem, digoxin, and beta-blockers) are ABSOLUTELY CONTRAINDICATED because they block the AV node while leaving the accessory pathway uninhibited, forcing ALL atrial impulses to conduct through the accessory pathway. This can accelerate the ventricular rate to the point of hemodynamic collapse and degeneration into ventricular fibrillation. The correct management of WPW with pre-excited AF is: (1) Synchronized cardioversion if hemodynamically unstable (this is the safest and most definitive approach), (2) IV procainamide (which slows conduction through both the AV node AND the accessory pathway, and is the preferred pharmacological agent), or (3) IV ibutalide or amiodarone as alternatives. Procainamide is preferred because it specifically prolongs the refractory period of the accessory pathway. Synchronized cardioversion is NOT contraindicated in WPW - it is actually the preferred treatment for unstable patients.",
    learningObjective: "Identify AV nodal blocking agents as absolutely contraindicated in WPW with pre-excited atrial fibrillation",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Dysrhythmia Management",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "NEVER give AV nodal blockers (adenosine, diltiazem, verapamil, digoxin) in WPW with AF - can cause VF",
    clinicalPearls: [
      "WPW + AF = irregular wide-complex tachycardia, often >200 bpm",
      "Contraindicated: adenosine, verapamil, diltiazem, digoxin, beta-blockers",
      "Preferred: synchronized cardioversion (unstable) or IV procainamide (stable)",
      "AV nodal blockade forces all impulses through the faster accessory pathway"
    ],
    safetyNote: "Adenosine in WPW with AF can precipitate ventricular fibrillation - this is a potentially fatal medication error",
    distractorRationales: [
      "Adenosine blocks AV node and can precipitate VF by enhancing accessory pathway conduction",
      "Procainamide is the preferred agent - it slows accessory pathway conduction",
      "Amiodarone is a reasonable alternative that affects both pathways",
      "Synchronized cardioversion is safe and preferred for unstable WPW with AF"
    ],
    lessonLink: "/emergency/lessons/dysrhythmia-management"
  },
  {
    stem: "A 55-year-old male smoker presents with acute onset of severe tearing back pain. CT shows a Stanford Type B aortic dissection (descending aorta only) without evidence of malperfusion, rupture, or end-organ damage. What is the primary management strategy?",
    options: [
      "Medical management with IV anti-impulse therapy targeting HR <60 bpm and SBP <120 mmHg",
      "Emergent surgical repair of the descending aorta",
      "Endovascular stent-graft placement (TEVAR) within 24 hours",
      "Observation with serial CT scans every 6 hours"
    ],
    correctAnswer: 0,
    rationaleLong: "Uncomplicated Stanford Type B aortic dissection (involving only the descending aorta, without malperfusion of visceral organs, limb ischemia, refractory pain, or signs of rupture) is primarily managed with medical therapy. This is in contrast to Stanford Type A dissection (ascending aorta), which requires emergent surgical repair. The medical management of uncomplicated Type B dissection focuses on anti-impulse therapy: (1) IV beta-blocker (esmolol or labetalol) to achieve HR <60 bpm, reducing the rate of aortic pressure rise (dP/dt) and wall shear stress. (2) Additional vasodilator (nicardipine, nitroprusside) ONLY AFTER adequate HR control, targeting SBP <120 mmHg. The sequencing is critical - vasodilators before beta-blockade cause reflex tachycardia and increased dP/dt, which can propagate the dissection. (3) IV opioid analgesia (morphine or fentanyl) for pain control, as uncontrolled pain drives sympathetic activation and hypertension. (4) Continuous monitoring in an ICU setting with arterial line for real-time BP monitoring. Medical management of uncomplicated Type B dissection has better outcomes than surgical intervention, with in-hospital mortality of 10-12% (medical) vs 25-30% (surgical). Surgery or endovascular repair (TEVAR) is reserved for COMPLICATED Type B dissection: malperfusion syndrome (visceral, renal, or limb ischemia), aortic rupture or impending rupture, rapid aortic expansion, refractory hypertension despite maximal medical therapy, or intractable pain. The INSTEAD trial showed no benefit of prophylactic TEVAR over medical therapy at 2 years for uncomplicated Type B dissection. Serial imaging (CT or MRI) is performed to monitor for progression, but every 6 hours is excessive - typically at 72 hours, 1 week, and then monthly intervals.",
    learningObjective: "Differentiate management of complicated vs uncomplicated Type B aortic dissection",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Aortic Emergencies",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Uncomplicated Type B dissection = medical therapy; Type A = always surgical; complicated Type B = surgery/TEVAR",
    clinicalPearls: [
      "Type A (ascending) = emergent surgery; Type B (descending) = medical if uncomplicated",
      "Anti-impulse therapy: beta-blocker first (HR <60), then vasodilator (SBP <120)",
      "Complicated Type B (malperfusion, rupture, refractory pain) requires intervention",
      "Medical management mortality 10-12% vs surgical 25-30% for uncomplicated Type B"
    ],
    safetyNote: "Monitor for progression to complicated dissection: new malperfusion symptoms, expanding hematoma, refractory pain",
    distractorRationales: [
      "Medical anti-impulse therapy is the standard for uncomplicated Type B dissection",
      "Surgery has higher mortality than medical therapy for uncomplicated Type B",
      "TEVAR is reserved for complicated Type B - no benefit prophylactically",
      "Every 6 hours CT scanning is excessive and provides unnecessary radiation"
    ],
    lessonLink: "/emergency/lessons/aortic-emergencies"
  },
  {
    stem: "A 40-year-old female on chronic corticosteroid therapy presents with palpitations. ECG shows a prolonged QT interval of 560 ms. Which electrolyte abnormality is most likely contributing to the QT prolongation?",
    options: [
      "Hypomagnesemia from chronic corticosteroid-induced renal magnesium wasting",
      "Hyperkalemia from adrenal suppression",
      "Hypernatremia from corticosteroid-induced water retention",
      "Hypercalcemia from corticosteroid-enhanced calcium absorption"
    ],
    correctAnswer: 0,
    rationaleLong: "Chronic corticosteroid therapy causes renal magnesium wasting, leading to hypomagnesemia, which is a significant cause of QT interval prolongation. Magnesium is critical for normal cardiac repolarization because it: (1) modulates potassium channel function - magnesium deficiency impairs potassium channel conductance, prolonging the action potential duration and QT interval, (2) is a cofactor for the Na+/K+ ATPase pump, and deficiency leads to intracellular potassium depletion, (3) directly affects calcium channel function in cardiac myocytes. The QT interval of 560 ms is significantly prolonged (normal <440 ms for men, <460 ms for women) and places the patient at risk for torsades de pointes (TdP), a polymorphic ventricular tachycardia that can degenerate into ventricular fibrillation. Management includes: IV magnesium sulfate 2 g over 15 minutes (even if serum magnesium is normal, as serum levels poorly reflect total body magnesium stores), correction of any concurrent hypokalemia (target K+ >4.0 mEq/L), and discontinuation of any other QT-prolonging medications. The emergency nurse should place the patient on continuous cardiac monitoring and have defibrillator and isoproterenol available in case TdP develops. Corticosteroids actually cause hypokalemia (not hyperkalemia) through mineralocorticoid effects. They cause sodium and water retention (not hypernatremia). They decrease calcium absorption and cause osteoporosis (not hypercalcemia).",
    learningObjective: "Associate corticosteroid-induced hypomagnesemia with QT prolongation and risk for torsades de pointes",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Electrolyte-Related Cardiac Emergencies",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Hypomagnesemia prolongs QT even when serum Mg2+ appears normal; treat empirically with IV magnesium",
    clinicalPearls: [
      "QT prolongation causes: hypoMg, hypoK, hypoCa, drugs, congenital",
      "Serum magnesium poorly reflects total body stores - treat empirically",
      "IV magnesium 2 g is first-line treatment for TdP regardless of serum level",
      "Corticosteroids cause renal Mg wasting AND hypokalemia"
    ],
    safetyNote: "QTc >500 ms is high risk for torsades de pointes - continuous monitoring and defibrillator at bedside",
    distractorRationales: [
      "Hypomagnesemia from corticosteroid renal wasting causes QT prolongation",
      "Corticosteroids cause hypokalemia, not hyperkalemia",
      "Corticosteroids cause sodium/water retention but not hypernatremia",
      "Corticosteroids decrease calcium absorption and cause osteoporosis"
    ],
    lessonLink: "/emergency/lessons/electrolyte-cardiac-emergencies"
  },
  {
    stem: "A 75-year-old male collapses in the ED waiting room. The AED analyzes his rhythm and advises 'Shock.' After the first shock, the AED analyzes again and advises 'No shock advised.' The patient has no pulse. What rhythm is the patient most likely in now, and what should the nurse do?",
    options: [
      "Pulseless electrical activity (PEA) or asystole - begin CPR and administer epinephrine 1 mg IV",
      "Normal sinus rhythm - monitor and wait for spontaneous circulation",
      "Fine ventricular fibrillation - increase the defibrillation energy and reshock",
      "Ventricular tachycardia with a pulse - administer amiodarone 150 mg IV"
    ],
    correctAnswer: 0,
    rationaleLong: "When an AED analyzes a rhythm and advises 'no shock,' this means the rhythm is not VF or pulseless VT (the two shockable rhythms). If the patient remains pulseless after a 'no shock advised' analysis, the rhythm must be either PEA (pulseless electrical activity - organized electrical activity without effective mechanical contraction) or asystole (no electrical activity). In either case, the immediate action is to begin high-quality CPR (30:2 ratio if not intubated, continuous compressions if advanced airway in place) and administer epinephrine 1 mg IV as soon as IV/IO access is available. Epinephrine is given every 3-5 minutes throughout the resuscitation for non-shockable rhythms. The nurse should also systematically evaluate for reversible causes using the H's and T's framework: Hypovolemia, Hypoxia, Hydrogen ion (acidosis), Hypo/Hyperkalemia, Hypothermia, Tension pneumothorax, Tamponade, Toxins, Thrombosis (PE), Thrombosis (MI). Bedside ultrasound during a pulse check can help differentiate PEA (organized cardiac motion visible but insufficient to generate a pulse) from true asystole (no cardiac motion). The patient is NOT in normal sinus rhythm because they are pulseless. Fine VF might not be detected by the AED, but the appropriate action for a 'no shock' pulseless patient is CPR and epinephrine, not reshocking. VT with a pulse would mean the patient has a palpable pulse, which contradicts the scenario.",
    learningObjective: "Respond appropriately to non-shockable rhythm in cardiac arrest following AED analysis",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Cardiac Arrest Management",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "No shock advised + pulseless = PEA or asystole; immediate CPR + epinephrine every 3-5 minutes",
    clinicalPearls: [
      "AED 'no shock' + pulseless = PEA or asystole (non-shockable rhythms)",
      "Epinephrine 1 mg IV every 3-5 minutes for non-shockable rhythms",
      "Bedside ultrasound helps differentiate PEA from asystole",
      "Continue H's and T's evaluation while performing CPR"
    ],
    safetyNote: "Never stop CPR for more than 10 seconds during rhythm analysis or pulse checks",
    distractorRationales: [
      "PEA/asystole is the correct interpretation of no-shock + pulseless",
      "No pulse means not normal sinus rhythm regardless of AED reading",
      "If AED says no shock, increasing energy and reshocking is inappropriate",
      "Pulseless means no pulse - VT with a pulse contradicts the clinical finding"
    ],
    lessonLink: "/emergency/lessons/cardiac-arrest-management"
  },
  {
    stem: "A 60-year-old female presents 4 hours after symptom onset with an acute ischemic stroke. CT head shows no hemorrhage. CT angiography reveals a large vessel occlusion (LVO) of the left middle cerebral artery. Her NIHSS score is 18. IV alteplase has been administered. What additional intervention should the nurse prepare for?",
    options: [
      "Emergent mechanical thrombectomy within 24 hours of symptom onset",
      "Heparin infusion for secondary stroke prevention",
      "Repeat CT head in 24 hours with no further acute intervention",
      "Carotid endarterectomy within 48 hours"
    ],
    correctAnswer: 0,
    rationaleLong: "For acute ischemic stroke caused by large vessel occlusion (LVO) of the anterior circulation (ICA, M1/M2 segments of MCA), emergent mechanical thrombectomy is the standard of care in addition to IV alteplase. Multiple landmark trials (MR CLEAN, ESCAPE, EXTEND-IA, SWIFT PRIME, REVASCAT) demonstrated that endovascular thrombectomy significantly improves functional outcomes compared to IV alteplase alone. The current AHA/ASA guidelines recommend thrombectomy for: (1) pre-stroke mRS 0-1, (2) causative occlusion of the ICA or MCA M1, (3) age ≥18, (4) NIHSS ≥6, (5) ASPECTS ≥6, and (6) treatment initiated within 6 hours of symptom onset. The DAWN and DEFUSE 3 trials extended the thrombectomy window to 24 hours in selected patients with favorable perfusion imaging (small core infarct with large penumbra). This patient meets criteria: LVO of the MCA, NIHSS 18 (severe stroke), within the treatment window, and IV alteplase has been appropriately administered. The nurse should prepare for emergent transfer to the neurointerventional suite, maintain BP at <180/105 mmHg after alteplase, ensure continuous neurological monitoring (NIHSS reassessment), and have the patient NPO in case of procedural sedation or general anesthesia. Heparin is NOT given within 24 hours of alteplase due to hemorrhagic transformation risk. Carotid endarterectomy is a planned procedure for carotid stenosis, not an acute stroke intervention for MCA occlusion.",
    learningObjective: "Prepare for emergent mechanical thrombectomy in addition to IV alteplase for large vessel occlusion stroke",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Stroke-Cardiac Interface",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "LVO stroke gets BOTH alteplase AND thrombectomy - one does not replace the other",
    clinicalPearls: [
      "LVO stroke = IV alteplase + mechanical thrombectomy (not either/or)",
      "Thrombectomy window: 6 hours standard, up to 24 hours with favorable perfusion imaging",
      "NIHSS ≥6 with LVO and ASPECTS ≥6 meets thrombectomy criteria",
      "No heparin within 24 hours of alteplase administration"
    ],
    safetyNote: "Maintain BP <180/105 for 24 hours after alteplase - higher pressures increase hemorrhagic transformation risk",
    distractorRationales: [
      "Mechanical thrombectomy is standard of care for LVO in addition to alteplase",
      "Heparin is contraindicated within 24 hours of alteplase",
      "Waiting 24 hours without intervention would result in completed infarct",
      "Carotid endarterectomy is planned surgery, not acute stroke intervention"
    ],
    lessonLink: "/emergency/lessons/stroke-cardiac-interface"
  },
  {
    stem: "A nurse is caring for a patient with an acute MI who suddenly develops ventricular fibrillation. The defibrillator is immediately available. What is the correct energy setting and technique for the first defibrillation attempt with a biphasic defibrillator?",
    options: [
      "120-200 joules biphasic (manufacturer-recommended dose) with anterior-lateral pad placement, delivered as unsynchronized shock",
      "50 joules biphasic in synchronized mode",
      "360 joules monophasic equivalent in synchronized mode",
      "200 joules biphasic with anterior-anterior pad placement"
    ],
    correctAnswer: 0,
    rationaleLong: "For ventricular fibrillation (VF), defibrillation should be performed as an unsynchronized shock because VF has no organized QRS complex for the defibrillator to synchronize with. The recommended energy for the first biphasic defibrillation is the manufacturer-recommended dose, typically 120-200 joules depending on the device (120J for rectilinear biphasic, 150J for biphasic truncated exponential, 200J if unknown). If the manufacturer recommendation is unknown, the maximum dose should be used. Subsequent shocks should be at the same or higher energy. The proper pad placement is anterior-lateral (one pad on the right upper chest below the clavicle, one pad on the left lateral chest over the cardiac apex), which provides the optimal current pathway through the myocardium. Alternative positions include anterior-posterior. The defibrillation sequence per AHA ACLS is: (1) Confirm VF on monitor, (2) Charge defibrillator while CPR continues, (3) Clear all personnel, (4) Deliver unsynchronized shock, (5) Immediately resume CPR for 2 minutes, (6) Rhythm check after 2 minutes of CPR. Synchronized cardioversion (which delivers the shock timed to the R wave) is used for organized tachyarrhythmias with a pulse (SVT, atrial fibrillation, ventricular tachycardia with a pulse), NOT for VF. Using synchronized mode for VF could result in no shock being delivered because the defibrillator cannot identify an R wave to synchronize with in a chaotic VF rhythm. 50 joules is insufficient for VF defibrillation. Anterior-anterior placement is not a standard position.",
    learningObjective: "Apply correct biphasic defibrillation energy, pad placement, and unsynchronized technique for ventricular fibrillation",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Cardiac Arrest Management",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "VF = unsynchronized shock; synchronized mode may fail to deliver shock because it can't find an R wave in VF",
    clinicalPearls: [
      "VF defibrillation: unsynchronized, 120-200J biphasic, anterior-lateral pads",
      "Synchronized mode is for organized rhythms with a pulse (SVT, AF, VT)",
      "Resume CPR immediately after shock - do not pause to check rhythm",
      "Minimize perishock pause to <10 seconds for best outcomes"
    ],
    safetyNote: "Ensure all personnel are clear before shock delivery - verbally confirm and visually verify",
    distractorRationales: [
      "120-200J unsynchronized biphasic with anterior-lateral pads is correct for VF",
      "50J is insufficient energy and synchronized mode is wrong for VF",
      "360J monophasic is the monophasic dose; synchronized mode is wrong for VF",
      "Anterior-anterior is not a standard pad placement position"
    ],
    lessonLink: "/emergency/lessons/cardiac-arrest-management"
  },
  {
    stem: "A 46-year-old male presents with Brugada pattern on ECG (coved ST elevation in V1-V3) after a syncopal episode during sleep. Family history is significant for sudden cardiac death in his father at age 42. Which treatment is the definitive therapy for Brugada syndrome with syncope?",
    options: [
      "Implantable cardioverter-defibrillator (ICD) placement",
      "Lifelong beta-blocker therapy",
      "Catheter ablation of the right ventricular outflow tract",
      "Class IC antiarrhythmic therapy (flecainide)"
    ],
    correctAnswer: 0,
    rationaleLong: "Brugada syndrome is a genetic channelopathy (mutations in SCN5A sodium channel gene in 20-30% of cases) characterized by a distinctive coved-type ST elevation in V1-V3 (Type 1 Brugada pattern) and a predisposition to polymorphic ventricular tachycardia and ventricular fibrillation, particularly during sleep or rest (due to increased vagal tone). The syndrome is responsible for 4-12% of all sudden cardiac deaths and up to 20% of sudden deaths in patients with structurally normal hearts. For patients with symptomatic Brugada syndrome (syncope, documented VT/VF, or survived cardiac arrest), the definitive treatment is implantable cardioverter-defibrillator (ICD) placement. The ICD provides the only proven mortality reduction by detecting and terminating ventricular arrhythmias with internal defibrillation. No antiarrhythmic medication has been proven to prevent sudden cardiac death in Brugada syndrome. Beta-blockers, which are protective in many other cardiac conditions, are NOT effective and may actually worsen Brugada syndrome by increasing vagal tone. Class IC antiarrhythmics (flecainide, ajmaline) are CONTRAINDICATED as they block sodium channels and can unmask or worsen the Brugada pattern, potentially triggering fatal arrhythmias. In fact, flecainide and ajmaline are used diagnostically to provoke the Brugada ECG pattern in suspected cases. Isoproterenol infusion and quinidine are used acutely for electrical storm in Brugada syndrome. Catheter ablation of the RVOT epicardium is emerging as a promising therapy but is not yet considered definitive or first-line. The emergency nurse should be aware that fever can unmask Brugada syndrome and trigger arrhythmias, so aggressive antipyretic therapy is essential in known Brugada patients.",
    learningObjective: "Identify ICD placement as the definitive treatment for symptomatic Brugada syndrome",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Inherited Cardiac Conditions",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Beta-blockers are NOT protective in Brugada; Class IC antiarrhythmics are contraindicated; only ICD prevents SCD",
    clinicalPearls: [
      "Brugada arrhythmias occur during sleep/rest due to vagal predominance",
      "Type 1 (coved) pattern + syncope/SCD family history = high risk",
      "Fever can unmask Brugada and trigger VF - treat fever aggressively",
      "Isoproterenol and quinidine are used for acute electrical storm"
    ],
    safetyNote: "Class IC antiarrhythmics (flecainide, ajmaline) are absolutely contraindicated in Brugada - can trigger fatal VF",
    distractorRationales: [
      "ICD is the only proven therapy to prevent sudden cardiac death in Brugada",
      "Beta-blockers may worsen Brugada by increasing vagal tone",
      "Catheter ablation is promising but not yet definitive first-line therapy",
      "Class IC antiarrhythmics are contraindicated and used only diagnostically"
    ],
    lessonLink: "/emergency/lessons/inherited-cardiac-conditions"
  }
];
