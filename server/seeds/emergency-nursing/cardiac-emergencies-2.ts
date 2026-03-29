import { EmergencyNursingQuestion } from "./types";

export const cardiacEmergencyQuestions2: EmergencyNursingQuestion[] = [
  {
    stem: "A 56-year-old male with no prior cardiac history collapses in the ED waiting room. A bystander immediately begins CPR. The AED is applied and analyzes the rhythm as shockable. After one shock, ROSC is achieved within 3 minutes. The patient regains consciousness and is able to follow commands. His 12-lead ECG shows normal sinus rhythm with no ST changes. What is the appropriate next step?",
    options: [
      "Discharge the patient since he is now awake with a normal ECG",
      "Admit to the ICU for continuous monitoring, TTM consideration, and comprehensive cardiac workup including coronary angiography",
      "Observe in the ED for 2 hours and discharge if symptoms do not recur",
      "Start an amiodarone infusion prophylactically for 24 hours"
    ],
    correctAnswer: 1,
    rationaleLong: "Despite the rapid ROSC and return of consciousness, this patient experienced sudden cardiac arrest (SCA) with a shockable rhythm (VF or pVT) and requires comprehensive evaluation to identify the cause and prevent recurrence. All cardiac arrest survivors require ICU admission for continuous cardiac monitoring, serial ECGs, echocardiography, and evaluation for structural heart disease, inherited channelopathies, or coronary artery disease. Even though the post-arrest ECG shows no ST elevation, up to 30% of cardiac arrest patients without ST elevation have significant coronary lesions that may have triggered the arrest. Current guidelines recommend considering coronary angiography for all cardiac arrest survivors with a suspected cardiac etiology. Additional workup should include echocardiography to assess ventricular function and structural abnormalities, electrophysiology study if no clear cause is found, genetic testing if an inherited channelopathy is suspected, and evaluation for metabolic and toxic causes. The fact that this patient is awake and following commands is favorable for neurological outcome but does not eliminate the need for inpatient evaluation. TTM may not be strictly indicated in a patient who regained full consciousness, but core temperature should be maintained at normal levels and hyperthermia prevented. Prophylactic amiodarone without an identified indication is not recommended. The emergency nurse should maintain continuous cardiac monitoring, have defibrillator pads in place, and establish IV access with appropriate labs drawn.",
    learningObjective: "Ensure comprehensive cardiac workup including ICU admission and potential coronary angiography for all cardiac arrest survivors",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Cardiac Arrest Management (ACLS)",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "A normal post-arrest ECG does NOT exclude significant coronary disease as the cause of cardiac arrest - angiography is often still indicated",
    clinicalPearls: [
      "All cardiac arrest survivors need ICU admission regardless of neurological recovery",
      "30% of post-arrest patients without STEMI have significant coronary lesions",
      "Consider ICD placement for survivors of unexplained cardiac arrest",
      "Prevent hyperthermia even in awake post-arrest patients"
    ],
    safetyNote: "Cardiac arrest survivors have high recurrence risk without identification and treatment of the underlying cause",
    distractorRationales: [
      "Discharge after cardiac arrest is never appropriate without thorough evaluation",
      "2-hour observation is insufficient for cardiac arrest workup",
      "Prophylactic amiodarone without clear indication is not recommended"
    ],
    lessonLink: "/emergency/lessons/cardiac-arrest-acls"
  },
  {
    stem: "A 64-year-old female with a history of paroxysmal atrial fibrillation presents to the ED with palpitations for 6 hours. She is hemodynamically stable. ECG confirms atrial fibrillation with ventricular rate of 142 bpm. She last took her medications (including anticoagulation) this morning. She wants the rhythm converted back to normal. What is the appropriate approach?",
    options: [
      "Immediate synchronized cardioversion since she is on anticoagulation",
      "Rate control with IV diltiazem to target heart rate <110 bpm, consider cardioversion if AF onset is confirmed <48 hours and she is adequately anticoagulated",
      "Administer IV amiodarone 300 mg for immediate rhythm conversion",
      "Start flecainide 300 mg PO (pill-in-pocket) for home conversion"
    ],
    correctAnswer: 1,
    rationaleLong: "The management of atrial fibrillation in the ED depends on several factors: hemodynamic stability, duration of the episode, anticoagulation status, and presence of structural heart disease. This patient is hemodynamically stable with an AF duration of 6 hours (within the 48-hour window). The appropriate initial approach involves rate control to reduce symptoms and myocardial oxygen demand, followed by assessment of cardioversion candidacy. IV diltiazem (0.25 mg/kg over 2 minutes, may repeat at 0.35 mg/kg) is an effective rate-control agent that rapidly reduces ventricular response. The target heart rate is typically <110 bpm for acute rate control. For cardioversion, the 48-hour rule is important: if AF onset is clearly within 48 hours, cardioversion can be performed without prior transesophageal echocardiography (TEE) to exclude left atrial thrombus, provided the patient has been on adequate anticoagulation. If AF duration is uncertain or >48 hours, either 3-4 weeks of therapeutic anticoagulation or TEE to exclude thrombus is required before cardioversion. Immediate cardioversion without proper assessment is premature - rate control provides symptom relief while the team determines the appropriate cardioversion strategy. IV amiodarone can facilitate chemical cardioversion but has a slow onset and significant side effects; it is not first-line for acute rate control. Pill-in-pocket flecainide should only be initiated under physician supervision for the first time, and is contraindicated in structural heart disease. The emergency nurse should obtain baseline labs, ensure IV access, and monitor the patient on continuous telemetry.",
    learningObjective: "Apply the rate control and cardioversion decision algorithm for atrial fibrillation based on duration and anticoagulation status",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Arrhythmia Identification and Treatment",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "The 48-hour rule: cardioversion without TEE is safe only if AF onset is clearly <48 hours and patient is anticoagulated",
    clinicalPearls: [
      "Rate control first, then assess cardioversion candidacy",
      "AF <48 hours + anticoagulated = cardioversion without TEE",
      "AF >48 hours or uncertain = TEE or 3-4 weeks anticoagulation before cardioversion",
      "IV diltiazem provides rapid rate control in AFib with RVR"
    ],
    safetyNote: "Cardioversion of AF >48 hours without anticoagulation or TEE risks stroke from left atrial thrombus embolization",
    distractorRationales: [
      "Immediate cardioversion without assessment is premature in a stable patient",
      "IV amiodarone is slow-onset and not first-line for rate control",
      "First-time pill-in-pocket should be supervised and contraindicated in structural heart disease"
    ],
    lessonLink: "/emergency/lessons/arrhythmia-management"
  },
  {
    stem: "A 29-year-old female marathon runner presents to the ED with exertional syncope during a race. She has no prior medical history. ECG shows sinus bradycardia at 48 bpm with first-degree AV block. Echocardiography shows normal structure and function. Which finding would change this from a benign athletic heart presentation to a pathological finding requiring further workup?",
    options: [
      "PR interval of 220 ms",
      "Presence of exercise-induced ventricular tachycardia on stress testing",
      "Resting heart rate of 48 bpm",
      "Mild left ventricular hypertrophy on echocardiography"
    ],
    correctAnswer: 1,
    rationaleLong: "Exercise-induced ventricular tachycardia on stress testing is a pathological finding that transforms this from a likely benign athletic heart presentation to a potentially life-threatening condition requiring comprehensive workup. While sinus bradycardia, first-degree AV block, and mild LVH are common physiological adaptations in well-trained athletes (athlete's heart), ventricular tachycardia with exercise is NEVER normal and suggests an underlying structural or electrical abnormality that could lead to sudden cardiac death (SCD). In young athletes, the most common causes of SCD include hypertrophic cardiomyopathy (HCM), arrhythmogenic right ventricular cardiomyopathy (ARVC), anomalous coronary arteries, and inherited channelopathies (long QT syndrome, Brugada syndrome, catecholaminergic polymorphic VT). Exercise-induced VT is particularly concerning for catecholaminergic polymorphic ventricular tachycardia (CPVT), which typically manifests during physical exertion or emotional stress and can degenerate into ventricular fibrillation. A PR interval of 220 ms (first-degree AV block) is commonly seen in athletes due to enhanced vagal tone and is benign. A resting heart rate of 48 bpm is normal for a trained endurance athlete. Mild LVH is a physiological adaptation to regular intense exercise. The emergency nurse caring for a young athlete with exertional syncope should advocate for a complete cardiac workup including exercise stress testing, Holter monitoring, cardiac MRI (to evaluate for ARVC or HCM), and electrophysiology evaluation before the patient returns to competitive athletics.",
    learningObjective: "Differentiate pathological cardiac findings from normal athletic heart adaptations in young athletes with exertional syncope",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Arrhythmia Identification and Treatment",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Exercise-induced VT is NEVER normal in athletes - always indicates pathological condition requiring full cardiac workup",
    clinicalPearls: [
      "Normal athlete heart: bradycardia, first-degree AV block, mild LVH",
      "Red flags: exercise-induced VT, exertional syncope, family history of SCD <50",
      "CPVT: VT triggered by exercise/stress, can cause SCD in young athletes",
      "Cardiac MRI is essential to rule out ARVC and HCM in athletes with arrhythmias"
    ],
    safetyNote: "Athletes with exertional syncope should be restricted from competitive sports until a complete cardiac evaluation is performed",
    distractorRationales: [
      "PR 220 ms (first-degree AV block) is common and benign in athletes",
      "Resting HR 48 is normal physiological adaptation in endurance athletes",
      "Mild LVH is expected physiological adaptation to regular intense training"
    ],
    lessonLink: "/emergency/lessons/arrhythmia-management"
  },
  {
    stem: "A 70-year-old male presents to the ED with acute onset chest pain and ECG showing ST elevation in leads V1-V4. Door-to-balloon time target is 90 minutes. The cath lab team has been activated. While awaiting transport to the cath lab, the patient develops cardiogenic shock with BP 68/40 mmHg, HR 120, and cool mottled extremities. What mechanical circulatory support device should the nurse anticipate preparing?",
    options: [
      "Extracorporeal membrane oxygenation (ECMO)",
      "Intra-aortic balloon pump (IABP)",
      "Left ventricular assist device (LVAD) implantation",
      "Impella percutaneous ventricular assist device"
    ],
    correctAnswer: 1,
    rationaleLong: "In acute STEMI complicated by cardiogenic shock, the intra-aortic balloon pump (IABP) remains the most commonly available and rapidly deployable mechanical circulatory support device in most emergency departments. The IABP provides counterpulsation support by inflating during diastole (augmenting coronary perfusion and diastolic blood pressure) and deflating during systole (reducing afterload and myocardial oxygen demand). It is typically inserted percutaneously through the femoral artery and positioned in the descending thoracic aorta just distal to the left subclavian artery. While the SHOCK II trial showed no mortality benefit of IABP in cardiogenic shock, it remains widely used as a bridge to PCI or surgical intervention and provides hemodynamic stabilization. The Impella device provides superior hemodynamic support compared to IABP and is increasingly used in cardiogenic shock, but it requires specialized catheterization lab equipment and personnel for insertion and is not typically available in the ED setting. ECMO provides the most robust circulatory support but requires a specialized team for cannulation and management, making it less immediately available. LVAD implantation is a surgical procedure for chronic heart failure and is not applicable in the acute setting. The emergency nurse should prepare for IABP insertion by gathering the appropriate catheter kit, ensuring the timing console is available and functioning, and assisting with fluoroscopic or bedside confirmation of balloon placement. Post-insertion nursing care includes monitoring timing (inflation at the dicrotic notch, deflation before systole), checking peripheral pulses distal to insertion site, and monitoring for complications including limb ischemia, balloon rupture, and aortic injury.",
    learningObjective: "Prepare for intra-aortic balloon pump insertion as mechanical circulatory support for STEMI complicated by cardiogenic shock",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "STEMI/NSTEMI Recognition",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "IABP inflates in DIASTOLE (augments coronary perfusion) and deflates in SYSTOLE (reduces afterload) - timing is critical",
    clinicalPearls: [
      "IABP: inflate diastole (coronary perfusion), deflate systole (reduce afterload)",
      "Positioned in descending aorta just distal to left subclavian",
      "Monitor distal pulses and limb perfusion post-insertion",
      "Impella provides superior support but requires cath lab for insertion"
    ],
    safetyNote: "Check bilateral lower extremity pulses and perfusion every 15 minutes after IABP insertion - limb ischemia is a serious complication",
    distractorRationales: [
      "ECMO provides superior support but requires specialized team and is not immediately available",
      "IABP is more rapidly deployable than Impella in most EDs",
      "LVAD is for chronic heart failure, not acute cardiogenic shock"
    ],
    lessonLink: "/emergency/lessons/stemi-management"
  },
  {
    stem: "A patient in the ED with known end-stage renal disease on hemodialysis presents with chest pain. ECG shows diffuse T-wave inversions and a prolonged QT interval. Potassium level is 6.2 mEq/L, calcium is 6.8 mg/dL (normal 8.5-10.5), and magnesium is 1.0 mEq/L (normal 1.5-2.5). Which electrolyte abnormality is most directly responsible for the prolonged QT interval?",
    options: [
      "Hyperkalemia",
      "Hypocalcemia",
      "Hypomagnesemia",
      "All three contribute equally to QT prolongation"
    ],
    correctAnswer: 1,
    rationaleLong: "While all three electrolyte abnormalities can affect the cardiac conduction system, hypocalcemia is most directly responsible for QT interval prolongation. The QT interval represents ventricular depolarization and repolarization. Calcium plays a critical role in Phase 2 (plateau phase) of the cardiac action potential, where calcium influx through L-type calcium channels maintains the plateau. When serum calcium is low, the plateau phase is prolonged because there is less calcium available to maintain and then terminate the plateau, resulting in a prolonged action potential duration and thus a longer QT interval on the ECG. The corrected QT interval (QTc) directly correlates with serum calcium levels. Hyperkalemia typically causes peaked T waves, PR prolongation, QRS widening, and eventually a sine wave pattern, but it actually tends to SHORTEN the QT interval by accelerating repolarization. Hypomagnesemia can predispose to QT prolongation and torsades de pointes, but its effect on QT is less direct than calcium. Magnesium primarily acts as a cofactor for potassium and calcium channel function, and its depletion makes cells more susceptible to arrhythmias. In renal failure patients, multiple electrolyte abnormalities often coexist. The emergency nurse should prepare for IV calcium gluconate administration (which addresses both the cardiac membrane stabilization needed for hyperkalemia AND the hypocalcemia), IV magnesium replacement, and emergent dialysis for the hyperkalemia and fluid/electrolyte management. Continuous cardiac monitoring is essential as these combined abnormalities significantly increase arrhythmia risk.",
    learningObjective: "Identify hypocalcemia as the primary cause of QT prolongation and understand its mechanism related to the cardiac action potential plateau phase",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "12-Lead ECG Interpretation",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Hyperkalemia SHORTENS QT (not prolongs it) - hypocalcemia is the classic electrolyte cause of QT prolongation",
    clinicalPearls: [
      "Hypocalcemia prolongs QT by extending the Phase 2 plateau of the action potential",
      "Hyperkalemia shortens QT and causes peaked T waves, not QT prolongation",
      "ESRD patients often have multiple concurrent electrolyte abnormalities",
      "IV calcium gluconate addresses both hyperkalemia and hypocalcemia"
    ],
    safetyNote: "Combined hypocalcemia, hypomagnesemia, and hyperkalemia creates extremely high arrhythmia risk - maintain continuous monitoring",
    distractorRationales: [
      "Hyperkalemia actually shortens QT; its ECG effects are peaked T waves and QRS widening",
      "Hypomagnesemia predisposes to arrhythmias but QT effect is less direct than calcium",
      "The electrolytes do not contribute equally - hypocalcemia has the most direct QT effect"
    ],
    lessonLink: "/emergency/lessons/ecg-interpretation"
  },
  {
    stem: "A 45-year-old male presents to the ED with sudden onset severe chest pain radiating to the jaw, diaphoresis, and nausea. While obtaining the 12-lead ECG, the patient becomes pulseless. The monitor shows ventricular fibrillation. High-quality CPR is initiated. After the first defibrillation and 2 minutes of CPR, a rhythm check shows organized electrical activity with a rate of 72 bpm but there is no palpable pulse. What rhythm does this represent and what is the treatment?",
    options: [
      "Asystole - continue CPR and administer epinephrine",
      "Pulseless electrical activity (PEA) - continue CPR, administer epinephrine, and identify reversible causes (H's and T's)",
      "Ventricular tachycardia - perform synchronized cardioversion",
      "Normal sinus rhythm with ROSC - begin post-arrest care"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient has pulseless electrical activity (PEA), defined as organized electrical activity on the cardiac monitor without a corresponding palpable pulse or detectable blood pressure. PEA is a non-shockable rhythm that requires continued CPR and identification and treatment of the underlying cause. PEA occurs when the heart has organized electrical activity but the mechanical contraction is insufficient to generate a palpable pulse or adequate blood pressure. In this case, the patient converted from VF to PEA after defibrillation, which may indicate that while the electrical rhythm organized, the myocardium is too stunned or the underlying cause has not been addressed. The management of PEA includes: high-quality CPR with minimal interruptions, epinephrine 1 mg IV every 3-5 minutes, and a systematic search for reversible causes using the H's and T's framework. The H's: Hypovolemia, Hypoxia, Hydrogen ion (acidosis), Hypo/hyperkalemia, Hypothermia. The T's: Tension pneumothorax, Tamponade (cardiac), Toxins, Thrombosis (coronary or pulmonary). In this patient with initial symptoms of ACS (chest pain, diaphoresis), the most likely cause of PEA is coronary thrombosis (massive MI). Empiric treatment with thrombolytics may be considered for PEA arrest with suspected massive PE or MI when other causes have been excluded. The nurse should ensure CPR quality is maintained, administer epinephrine on schedule, check for treatable causes, and monitor for conversion to a shockable rhythm. PEA is NOT a shockable rhythm - synchronized cardioversion would be inappropriate. The presence of organized electrical activity does not confirm ROSC; a palpable pulse is required.",
    learningObjective: "Manage pulseless electrical activity with CPR, epinephrine, and systematic identification of reversible causes using H's and T's",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Cardiac Arrest Management (ACLS)",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Organized rhythm on monitor does NOT equal ROSC - you MUST check for a pulse. No pulse with organized rhythm = PEA",
    clinicalPearls: [
      "PEA: organized electrical activity without palpable pulse = non-shockable",
      "H's: Hypovolemia, Hypoxia, H+ (acidosis), Hypo/hyperkalemia, Hypothermia",
      "T's: Tension pneumothorax, Tamponade, Toxins, Thrombosis (coronary/pulmonary)",
      "In ACS patients, coronary thrombosis is the most likely cause of PEA arrest"
    ],
    safetyNote: "Never assume ROSC based on electrical activity alone - always verify with a pulse check during the appropriate rhythm check interval",
    distractorRationales: [
      "This is not asystole - there is organized electrical activity on the monitor",
      "PEA is not a shockable rhythm - cardioversion is inappropriate",
      "Organized rhythm without pulse is PEA, not ROSC"
    ],
    lessonLink: "/emergency/lessons/cardiac-arrest-acls"
  },
  {
    stem: "A 62-year-old female with diabetes and hypertension is being evaluated in the ED for chest discomfort. Her troponin I is 0.15 ng/mL (elevated), ECG shows ST depression in leads V4-V6, and she has ongoing intermittent chest pressure. She has been given aspirin 325 mg, started on heparin, and administered sublingual nitroglycerin with partial relief. What is the next appropriate antiplatelet agent to administer?",
    options: [
      "Clopidogrel 600 mg loading dose",
      "No additional antiplatelet therapy is needed",
      "Ticagrelor 180 mg loading dose",
      "Either clopidogrel 600 mg or ticagrelor 180 mg loading dose, based on institutional protocol and planned intervention strategy"
    ],
    correctAnswer: 3,
    rationaleLong: "This patient has an NSTEMI (elevated troponin with ST depression and ongoing symptoms) and requires dual antiplatelet therapy (DAPT) in addition to the aspirin already administered. The second antiplatelet agent should be a P2Y12 receptor inhibitor, with the two most commonly used options being clopidogrel (600 mg loading dose) or ticagrelor (180 mg loading dose). The choice between these agents depends on institutional protocol, planned intervention strategy (invasive vs conservative), and patient-specific factors. Ticagrelor has demonstrated superiority over clopidogrel in the PLATO trial, showing reduced cardiovascular death, MI, and stroke in ACS patients, with the caveat of increased non-CABG-related bleeding. However, ticagrelor requires twice-daily dosing and is more expensive. Clopidogrel remains widely used, particularly when ticagrelor is contraindicated (active pathological bleeding, history of intracranial hemorrhage) or when the patient is likely to need CABG surgery (ticagrelor requires a 5-day washout vs 5-7 days for clopidogrel). Prasugrel (60 mg loading) is another option but carries higher bleeding risk and is typically given at the time of PCI rather than pre-PCI. In many institutions, the timing of P2Y12 inhibitor administration (pre-cath lab vs at time of PCI) is protocol-driven, as early administration provides faster platelet inhibition but may delay surgery if CABG is needed. The emergency nurse should follow institutional protocol, verify no contraindications, and administer the loading dose as ordered. Both aspirin and a P2Y12 inhibitor together constitute DAPT, which is the standard of care for ACS.",
    learningObjective: "Administer dual antiplatelet therapy with aspirin and a P2Y12 inhibitor for NSTEMI management",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Acute Coronary Syndrome",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Aspirin alone is insufficient for ACS - dual antiplatelet therapy (aspirin + P2Y12 inhibitor) is the standard of care",
    clinicalPearls: [
      "DAPT = aspirin + P2Y12 inhibitor (clopidogrel or ticagrelor) for all ACS",
      "Ticagrelor: superior efficacy but more bleeding, twice-daily dosing",
      "Clopidogrel: longer track record, once-daily, longer washout for surgery",
      "Prasugrel: most potent but highest bleeding risk, usually given at time of PCI"
    ],
    safetyNote: "Verify no contraindications to P2Y12 inhibitors before loading - active bleeding, planned CABG within 5 days, or prior ICH may preclude use",
    distractorRationales: [
      "Clopidogrel alone may be appropriate but institutional factors determine the choice",
      "Additional antiplatelet therapy beyond aspirin IS needed for ACS",
      "Ticagrelor alone may be appropriate but institutional factors determine the choice"
    ],
    lessonLink: "/emergency/lessons/acute-coronary-syndrome"
  },
  {
    stem: "A 58-year-old male on a nitroglycerin drip for unstable angina accidentally received sildenafil (Viagra) from his partner who brought it from home. The nurse discovers this 30 minutes later. BP has dropped to 72/38 mmHg. What should the nurse do?",
    options: [
      "Increase the nitroglycerin drip rate to improve coronary perfusion",
      "Stop the nitroglycerin immediately, position supine with legs elevated, administer IV fluid bolus, and consider phenylephrine if refractory",
      "Administer atropine 0.5 mg IV for the hypotension",
      "Administer methylene blue as an antidote for sildenafil"
    ],
    correctAnswer: 1,
    rationaleLong: "The combination of nitroglycerin and phosphodiesterase-5 (PDE5) inhibitors such as sildenafil causes profound, potentially fatal hypotension. Both drugs work through the nitric oxide-cGMP pathway to cause vasodilation. Sildenafil inhibits the breakdown of cGMP (the second messenger that mediates vasodilation from nitric oxide), while nitroglycerin provides exogenous nitric oxide. The combination results in an amplified and prolonged vasodilatory effect that can cause catastrophic hypotension resistant to standard treatments. The immediate nursing actions are: (1) Stop the nitroglycerin infusion immediately; (2) Place the patient supine with legs elevated to maximize venous return; (3) Administer IV normal saline bolus (500 mL to 1 liter) to restore intravascular volume; (4) If hypotension persists despite fluids, phenylephrine (a pure alpha-1 agonist) is the recommended vasopressor because it provides vasoconstriction without significant beta effects; (5) If phenylephrine is unavailable, norepinephrine can be used. The hypotension from PDE5 inhibitor + nitrate interaction can last up to 24 hours (the half-life of sildenafil is 3-5 hours, but tadalafil has a 17-hour half-life, so the duration depends on which PDE5 inhibitor was taken). Increasing the nitroglycerin drip would be catastrophic, worsening the already severe hypotension. Atropine treats bradycardia-related hypotension, not vasodilatory shock. While methylene blue has been used in refractory vasoplegia, it is not a first-line treatment for this interaction and its role is investigational. The emergency nurse should file an incident report and implement measures to prevent unauthorized medication administration.",
    learningObjective: "Manage the dangerous interaction between nitroglycerin and PDE5 inhibitors with immediate drug discontinuation and hemodynamic support",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Acute Coronary Syndrome",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Nitrates are ABSOLUTELY CONTRAINDICATED within 24 hours of sildenafil/vardenafil or 48 hours of tadalafil (longer half-life)",
    clinicalPearls: [
      "PDE5 inhibitors + nitrates = profound hypotension through amplified cGMP pathway",
      "Sildenafil half-life 3-5 hours; tadalafil half-life 17 hours (longer contraindication window)",
      "Phenylephrine (pure alpha agonist) is the recommended vasopressor",
      "Always screen for PDE5 inhibitor use BEFORE administering any nitrate"
    ],
    safetyNote: "Always ask about erectile dysfunction medications before giving nitrates - this is a mandatory screening question for all chest pain patients",
    distractorRationales: [
      "Increasing nitroglycerin would worsen the catastrophic hypotension",
      "Atropine treats vagal-mediated bradycardia, not vasodilatory shock",
      "Methylene blue is investigational for vasoplegia, not first-line for this interaction"
    ],
    lessonLink: "/emergency/lessons/acute-coronary-syndrome"
  },
  {
    stem: "A 73-year-old patient presents to the ED with chest pain and ECG changes suggestive of acute MI. The patient has an advance directive indicating 'Do Not Resuscitate' (DNR) status. The patient is currently alert, oriented, and in moderate distress. How should the emergency nurse proceed?",
    options: [
      "Withhold all cardiac treatments including aspirin and nitroglycerin because the patient has a DNR",
      "Provide full acute MI treatment (aspirin, anticoagulation, catheterization as indicated) as DNR applies only to CPR and cardiac arrest situations, not to active medical treatment",
      "Contact the patient's family before providing any treatment",
      "Sedate the patient and provide comfort measures only"
    ],
    correctAnswer: 1,
    rationaleLong: "A Do Not Resuscitate (DNR) order specifically addresses cardiac arrest situations - it means that if the patient's heart stops or they stop breathing, CPR, defibrillation, intubation, and other resuscitative measures will not be initiated. A DNR order does NOT mean 'do not treat.' This patient is currently alive, alert, and experiencing an acute MI that is a treatable condition. All appropriate acute MI treatments should be provided, including aspirin, anticoagulation, pain management, nitroglycerin, and cardiac catheterization with PCI if indicated. The patient's DNR status should be discussed with the patient (since they are alert and competent) to ensure they understand that active treatment of the MI is separate from resuscitation decisions. The patient should be asked whether they want to modify their DNR status during the procedure (for example, some patients with DNR orders agree to a 'limited resuscitation' during procedures, accepting defibrillation for procedural complications while still declining prolonged resuscitation). This is particularly relevant for cardiac catheterization, where iatrogenic VF can occur and is immediately treatable. The emergency nurse should ensure the advance directive is in the medical record, communicate the DNR status to all team members, and verify the patient's current wishes. Withholding active treatment for a treatable condition based on DNR status is both ethically wrong and potentially constitutes negligence. Similarly, sedating and providing only comfort measures is appropriate for patients who are actively dying or who have specifically refused treatment, not for an alert patient with a treatable MI.",
    learningObjective: "Differentiate between DNR orders (which apply to cardiac arrest) and active medical treatment of acute conditions",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Acute Coronary Syndrome",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "DNR means 'do not resuscitate' not 'do not treat' - active treatment of reversible conditions should continue",
    clinicalPearls: [
      "DNR applies only to cardiac arrest situations, not to active medical treatment",
      "Discuss procedural DNR modifications before catheterization",
      "An alert, competent patient can modify their DNR status at any time",
      "Document the discussion about code status and current wishes"
    ],
    safetyNote: "Withholding appropriate treatment based on misunderstanding of DNR orders is a form of neglect - always clarify the scope of advance directives",
    distractorRationales: [
      "Withholding acute MI treatment because of DNR is a dangerous misunderstanding",
      "Family notification is important but should not delay treatment of an alert, competent patient",
      "Comfort measures only is for actively dying patients, not those with treatable conditions"
    ],
    lessonLink: "/emergency/lessons/acute-coronary-syndrome"
  },
  {
    stem: "A 55-year-old male with STEMI has been in the cardiac catheterization lab for PCI. The interventional cardiologist successfully opens the LAD with stent placement. However, upon reperfusion, the patient develops an accelerated idioventricular rhythm (AIVR) at 85 bpm. What should the emergency nurse understand about this rhythm?",
    options: [
      "AIVR is a sign of failed reperfusion requiring additional intervention",
      "AIVR is a reperfusion arrhythmia that is generally benign and self-limiting, requiring monitoring but not treatment",
      "AIVR requires immediate synchronized cardioversion",
      "AIVR should be treated with IV amiodarone 150 mg"
    ],
    correctAnswer: 1,
    rationaleLong: "Accelerated idioventricular rhythm (AIVR) is a wide-complex ventricular rhythm with a rate of 60-120 bpm that commonly occurs during reperfusion of an occluded coronary artery. It is considered a reperfusion arrhythmia and is actually a positive sign indicating that blood flow has been successfully restored to the ischemic myocardium. AIVR occurs in approximately 10-20% of patients undergoing successful reperfusion therapy (either PCI or thrombolysis). The mechanism involves enhanced automaticity of the ventricular Purkinje fibers that were previously ischemic and are now being reperfused with oxygen-rich blood. The washout of metabolic byproducts (lactate, potassium, hydrogen ions) from the ischemic tissue also contributes to the enhanced automaticity. AIVR is generally hemodynamically well-tolerated because the rate is usually between 60-120 bpm, which is adequate for maintaining cardiac output. It is typically self-limiting, resolving within minutes to hours as the reperfused myocardium stabilizes. Treatment is usually NOT required unless the patient develops hemodynamic compromise. In fact, treating AIVR with antiarrhythmic drugs can be harmful because suppressing the ventricular escape rhythm may unmask an even slower underlying rhythm, potentially causing hemodynamic deterioration. If the patient does become symptomatic from loss of AV synchrony, atropine can be given to increase the sinus rate above the ventricular rate, restoring sinus dominance. The emergency nurse should continue monitoring, document the rhythm as a reperfusion marker, and reassure the team that this is expected.",
    learningObjective: "Recognize accelerated idioventricular rhythm as a benign reperfusion arrhythmia that does not require treatment",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "STEMI/NSTEMI Recognition",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "AIVR is a GOOD sign indicating successful reperfusion - do NOT treat it with antiarrhythmics or cardioversion",
    clinicalPearls: [
      "AIVR: wide-complex ventricular rhythm at 60-120 bpm during reperfusion",
      "Positive indicator of successful coronary reperfusion",
      "Self-limiting, usually resolves within minutes to hours",
      "Treatment with antiarrhythmics can be harmful by unmasking slower rhythms"
    ],
    safetyNote: "Only intervene in AIVR if the patient is hemodynamically compromised - atropine to increase sinus rate is preferred over antiarrhythmics",
    distractorRationales: [
      "AIVR indicates SUCCESSFUL reperfusion, not failure",
      "Cardioversion is inappropriate for a generally benign reperfusion rhythm",
      "Amiodarone could suppress the rhythm and unmask a slower, more dangerous escape"
    ],
    lessonLink: "/emergency/lessons/stemi-management"
  },
  {
    stem: "A patient with an implantable cardioverter-defibrillator (ICD) arrives in the ED reporting that the device has fired 5 times in the past hour. The patient is currently in normal sinus rhythm with a heart rate of 78 bpm and is hemodynamically stable. What is the priority concern and action?",
    options: [
      "The ICD is functioning normally - reassure the patient and discharge",
      "Evaluate for an ICD storm by reviewing device interrogation, treating underlying causes, and potentially applying a magnet to suspend therapies if shocks are inappropriate",
      "Immediately remove the ICD in the ED",
      "Administer IV amiodarone to suppress future arrhythmias without evaluating the device"
    ],
    correctAnswer: 1,
    rationaleLong: "An ICD storm is defined as 3 or more appropriate or inappropriate ICD shocks (or anti-tachycardia pacing events) within 24 hours. This patient has received 5 shocks in 1 hour, clearly meeting the criteria for ICD storm. This is a medical emergency requiring systematic evaluation and management. The priority actions include: (1) Immediate device interrogation by electrophysiology to determine whether the shocks were appropriate (in response to true VT/VF) or inappropriate (triggered by lead malfunction, SVT with aberrancy, electromagnetic interference, or T-wave oversensing); (2) If shocks were appropriate (true VT/VF), treat the underlying trigger (myocardial ischemia, electrolyte abnormalities, medication non-compliance, new-onset heart failure, infection/fever) and consider IV amiodarone or lidocaine to suppress recurrent VT; (3) If shocks were inappropriate, a magnet can be placed over the ICD to temporarily suspend anti-tachycardia therapies. The ICD magnet disables the defibrillation function but does NOT affect pacing. This prevents further inappropriate shocks while the device is being interrogated and the issue resolved. The patient should be on continuous cardiac monitoring and have external defibrillator pads placed in case the ICD is disabled and a true arrhythmia occurs. Reassuring and discharging a patient experiencing ICD storm is dangerous. ICD removal is a surgical procedure that is not performed in the ED. Administering amiodarone without understanding whether shocks were appropriate or inappropriate could mask a treatable underlying problem.",
    learningObjective: "Manage ICD storm by evaluating for appropriate vs inappropriate shocks and implementing targeted interventions",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Pacing/Cardioversion/Defibrillation",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "ICD magnet disables DEFIBRILLATION function but does NOT affect PACING - external defib pads must be in place when magnet is applied",
    clinicalPearls: [
      "ICD storm: >=3 shocks within 24 hours (appropriate or inappropriate)",
      "Magnet over ICD suspends defibrillation but NOT pacing function",
      "Must differentiate appropriate (true VT/VF) from inappropriate shocks",
      "External defibrillator pads must be placed before magnet application"
    ],
    safetyNote: "Never apply a magnet to an ICD without placing external defibrillator pads first and ensuring continuous monitoring",
    distractorRationales: [
      "ICD storm is never normal and requires urgent evaluation",
      "ICD removal is surgical and not an ED procedure",
      "Amiodarone without device interrogation may mask the real problem"
    ],
    lessonLink: "/emergency/lessons/pacing-cardioversion"
  },
  {
    stem: "A 42-year-old female presents to the ED with acute dyspnea and pleuritic chest pain. She is on oral contraceptive pills and recently returned from an 18-hour international flight. CTPA reveals a saddle pulmonary embolism. She is tachycardic at 118 bpm but BP is maintained at 108/68 mmHg. Echocardiography shows RV dilation with an RV:LV ratio of 1.2. Troponin is elevated. How should this PE be classified and managed?",
    options: [
      "Low-risk PE - anticoagulation with rivaroxaban and discharge home",
      "Submassive (intermediate-risk) PE - systemic anticoagulation with heparin, close monitoring, and consideration of catheter-directed therapy or systemic thrombolysis if deterioration occurs",
      "Massive PE - immediate systemic thrombolysis with alteplase",
      "Chronic thromboembolic PE - refer to pulmonary hypertension clinic"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient has a submassive (intermediate-high risk) pulmonary embolism based on the classification criteria: hemodynamically stable (BP maintained), but with evidence of RV dysfunction (RV dilation, RV:LV ratio >1.0 on echo) AND myocardial injury (elevated troponin). The PE risk stratification is: LOW risk = no RV dysfunction, no biomarker elevation; INTERMEDIATE risk = RV dysfunction OR biomarker elevation; INTERMEDIATE-HIGH risk = RV dysfunction AND biomarker elevation (this patient); MASSIVE (high risk) = hemodynamic instability (SBP <90 mmHg for >15 min, requiring vasopressors, or cardiac arrest). Management of submassive PE includes: (1) Systemic anticoagulation with unfractionated heparin (preferred over LMWH for critically ill patients because it is titratable and reversible); (2) ICU or step-down admission for close hemodynamic monitoring; (3) Monitoring for clinical deterioration (worsening hypotension, increasing RV strain); (4) If the patient deteriorates hemodynamically, escalation to systemic thrombolysis (alteplase 100 mg over 2 hours) or catheter-directed therapy (lower-dose thrombolysis or mechanical thrombectomy). The decision to use systemic thrombolysis prophylactically in submassive PE remains controversial, as the PEITHO trial showed reduced hemodynamic decompensation but increased intracranial hemorrhage. Immediate systemic thrombolysis is reserved for massive PE with hemodynamic instability. Discharging with oral anticoagulation alone would be inappropriate given the severity of this submassive PE. This is an acute PE, not a chronic condition. The emergency nurse should establish bilateral large-bore IV access, initiate heparin infusion, prepare thrombolytics for potential use, place the patient on continuous monitoring, and have vasopressors available.",
    learningObjective: "Classify pulmonary embolism severity based on hemodynamics, RV dysfunction, and biomarkers to guide appropriate management",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "PE Management",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Submassive PE (stable BP + RV dysfunction + elevated troponin) has 5-15% short-term mortality - not appropriate for discharge",
    clinicalPearls: [
      "Submassive PE: stable BP but RV dysfunction and/or troponin elevation",
      "Massive PE: SBP <90 or requiring vasopressors = immediate thrombolysis",
      "RV:LV ratio >1.0 indicates significant RV strain from PE",
      "Have thrombolytics ready for submassive PE in case of hemodynamic deterioration"
    ],
    safetyNote: "Submassive PE can rapidly deteriorate to massive PE with cardiovascular collapse - ICU monitoring is essential",
    distractorRationales: [
      "Low-risk classification is incorrect with RV dysfunction and elevated troponin",
      "Systemic thrombolysis is for massive PE with hemodynamic instability",
      "This is an acute PE with RV strain, not a chronic thromboembolic condition"
    ],
    lessonLink: "/emergency/lessons/pe-management"
  },
  {
    stem: "An emergency nurse is caring for a patient post-ROSC who requires targeted temperature management. Which of the following is a common complication of therapeutic hypothermia that the nurse should monitor for?",
    options: [
      "Hyperkalemia due to intracellular potassium release",
      "Shivering, coagulopathy, electrolyte shifts (hypokalemia, hypomagnesemia), and increased infection risk",
      "Tachycardia and hypertension from sympathetic activation",
      "Respiratory alkalosis from decreased CO2 production"
    ],
    correctAnswer: 1,
    rationaleLong: "Targeted temperature management (TTM) to 32-36C, while neuroprotective, is associated with several important complications that the emergency nurse must monitor for and manage proactively. The most significant complications include: (1) Shivering - the body's natural thermoregulatory response to cooling, which increases metabolic rate and oxygen consumption, counteracting the benefits of hypothermia. Shivering must be treated aggressively with sedation (propofol, dexmedetomidine), opioids, magnesium, and if necessary, neuromuscular blocking agents. The Bedside Shivering Assessment Scale (BSAS) should be used to quantify and track shivering. (2) Coagulopathy - hypothermia impairs the coagulation cascade and platelet function, increasing bleeding risk. Coagulation studies may appear normal because they are run at 37C in the lab, not at the patient's actual temperature. (3) Electrolyte shifts - cooling causes intracellular shift of potassium, magnesium, and phosphate, leading to hypokalemia and hypomagnesemia. During rewarming, these electrolytes shift back out of cells, potentially causing dangerous hyperkalemia. Electrolytes should be monitored every 4-6 hours and replaced cautiously. (4) Increased infection risk - hypothermia impairs immune function and white blood cell response, increasing susceptibility to pneumonia, catheter-related infections, and sepsis. (5) Bradycardia - expected physiological response to cooling, generally not treated unless symptomatic. (6) Insulin resistance and hyperglycemia - hypothermia impairs insulin sensitivity. Hyperkalemia actually does NOT occur during the cooling phase; it occurs during rewarming. The nurse should monitor core temperature continuously, check electrolytes every 4-6 hours, perform serial coagulation studies, and conduct surveillance for infection.",
    learningObjective: "Monitor and manage complications of targeted temperature management including shivering, coagulopathy, and electrolyte shifts",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Post-ROSC Care",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "During COOLING: hypokalemia (K+ shifts intracellularly). During REWARMING: hyperkalemia (K+ shifts back out). Monitor electrolytes closely during both phases",
    clinicalPearls: [
      "Shivering increases metabolic rate 200-400% - must be treated aggressively",
      "Coagulopathy: lab tests run at 37C may underestimate clotting impairment",
      "Cooling causes hypokalemia; rewarming causes hyperkalemia",
      "Rewarm slowly (0.25-0.5C/hr) to avoid electrolyte shifts and rebound hyperthermia"
    ],
    safetyNote: "Do not aggressively replace potassium during cooling - it will cause dangerous hyperkalemia during rewarming",
    distractorRationales: [
      "Hyperkalemia occurs during rewarming, not during the cooling phase",
      "Hypothermia causes bradycardia, not tachycardia; hypotension, not hypertension",
      "Hypothermia causes metabolic acidosis from decreased metabolism, not respiratory alkalosis"
    ],
    lessonLink: "/emergency/lessons/post-rosc-care"
  },
  {
    stem: "A 67-year-old male with a history of coronary artery disease presents to the ED with worsening dyspnea on exertion over 2 weeks. He can now only walk 50 feet before becoming short of breath. His home medications include aspirin, atorvastatin, metoprolol, and lisinopril. Vital signs: BP 128/78, HR 82, RR 22, SpO2 93% on room air. Bilateral basilar crackles are present. BNP is 890 pg/mL. CXR shows cardiomegaly with cephalization of pulmonary vessels. What is the most appropriate initial ED management?",
    options: [
      "Discharge home with increased furosemide dose and follow-up in 1 week",
      "Administer IV furosemide, obtain echocardiography, assess volume status, and admit for heart failure management",
      "Start dobutamine infusion for inotropic support",
      "Administer IV nitroglycerin at 200 mcg/min for aggressive afterload reduction"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient presents with subacute decompensated heart failure based on progressive exertional dyspnea, bilateral crackles, elevated BNP (890 pg/mL), hypoxemia (SpO2 93%), and CXR findings of cardiomegaly with cephalization (indicating pulmonary venous congestion). The appropriate ED management includes: (1) IV furosemide for diuresis - the IV route ensures reliable drug delivery and faster onset compared to oral administration, which may be impaired by gut edema; (2) Echocardiography to assess left ventricular function, wall motion abnormalities, valvular disease, and estimate filling pressures; (3) Volume status assessment using clinical exam (JVD, edema, crackles), IVC collapsibility on ultrasound, and response to diuretics; (4) Admission to a monitored bed for continued diuresis, telemetry monitoring, medication optimization, and identification of decompensation triggers (dietary indiscretion, medication non-compliance, ischemia, arrhythmia, infection). Discharging this patient home is inappropriate given the significant functional decline, hypoxemia, and volume overload requiring IV diuretics and monitoring. Dobutamine is reserved for patients with cardiogenic shock or severely reduced cardiac output who are not responding to diuretics and vasodilators - this patient has adequate blood pressure and is not in shock. Starting nitroglycerin at 200 mcg/min is an excessively high initial rate (typical starting rate is 5-20 mcg/min, titrated up) and aggressive afterload reduction is not the primary intervention for this patient who is not hypertensive. The emergency nurse should place the patient in a semi-Fowler's or high-Fowler's position, apply oxygen to maintain SpO2 >94%, establish IV access, obtain labs (BMP, CBC, troponin, TSH), and prepare for diuretic administration.",
    learningObjective: "Initiate appropriate ED management for acute decompensated heart failure including IV diuretics, echocardiography, and admission",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Heart Failure Exacerbation",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "BNP >400 strongly supports heart failure diagnosis but does not differentiate systolic from diastolic dysfunction - echocardiography is needed",
    clinicalPearls: [
      "Cephalization on CXR = pulmonary venous congestion, early sign of heart failure",
      "IV diuretics preferred over oral in acute decompensation (gut edema impairs absorption)",
      "Identify decompensation trigger: dietary, medication, ischemia, arrhythmia, infection",
      "Semi-Fowler's position reduces venous return and improves dyspnea"
    ],
    safetyNote: "Monitor potassium and creatinine closely after IV diuretic administration - acute kidney injury and electrolyte abnormalities are common",
    distractorRationales: [
      "Discharge is inappropriate with hypoxemia, functional decline, and volume overload",
      "Dobutamine is for cardiogenic shock, not stable decompensated heart failure",
      "NTG at 200 mcg/min is an excessively high starting dose"
    ],
    lessonLink: "/emergency/lessons/heart-failure-management"
  },
  {
    stem: "A 60-year-old female with mechanical mitral valve replacement on warfarin presents to the ED with a left-sided facial droop, right arm weakness, and aphasia with onset 90 minutes ago. INR is 2.8 (therapeutic 2.5-3.5 for mechanical valve). CT head shows no hemorrhage. What unique challenge does this patient present for acute stroke management?",
    options: [
      "She cannot receive IV tPA because she has a mechanical valve",
      "She cannot receive IV tPA because her INR is above 1.7, and mechanical thrombectomy should be considered if large vessel occlusion is present",
      "IV tPA can be given regardless of INR because stroke treatment takes priority",
      "Her warfarin should be reversed with vitamin K before any stroke treatment"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient presents with acute ischemic stroke symptoms (facial droop, arm weakness, aphasia) within the treatment window (90 minutes from onset), but her therapeutic anticoagulation with an INR of 2.8 creates a significant management challenge. IV alteplase (tPA) is generally CONTRAINDICATED when the INR is greater than 1.7 due to the significantly increased risk of intracranial hemorrhage (ICH). The presence of a mechanical valve itself is not the contraindication - it is the supratherapeutic or therapeutic anticoagulation level that precludes thrombolytic use. For this patient, the treatment options include: (1) Mechanical thrombectomy - if a large vessel occlusion (LVO) is identified on CT angiography, endovascular mechanical thrombectomy can be performed within 6-24 hours of symptom onset (depending on imaging criteria). Thrombectomy does not carry the same bleeding risk as systemic thrombolysis and can be performed regardless of INR; (2) Some protocols allow IV tPA if the INR can be rapidly reversed to <1.7 using 4-factor PCC, but reversing anticoagulation in a mechanical valve patient creates significant thrombotic risk; (3) If INR reversal is not feasible or thrombectomy is not available, the patient should receive supportive care with admission to a stroke unit. Reversing the INR with vitamin K alone is too slow (takes hours) and creates days of inadequate anticoagulation in a high-risk mechanical valve patient. The emergency nurse should obtain CT angiography immediately to assess for LVO, activate the stroke team, and prepare for potential thrombectomy.",
    learningObjective: "Navigate the conflict between anticoagulation for mechanical valves and thrombolytic eligibility in acute ischemic stroke",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Acute Coronary Syndrome",
    difficulty: 5,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "INR >1.7 contraindicates tPA regardless of the reason for anticoagulation - mechanical thrombectomy becomes the primary reperfusion option",
    clinicalPearls: [
      "tPA contraindicated when INR >1.7 due to hemorrhagic transformation risk",
      "Mechanical thrombectomy can be performed regardless of anticoagulation status",
      "CT angiography to identify LVO is essential when tPA is contraindicated",
      "Reversing anticoagulation in mechanical valve patients creates thrombotic risk"
    ],
    safetyNote: "Do not reverse anticoagulation in mechanical valve patients without cardiology consultation - the thrombotic risk of an unprotected mechanical valve is extremely high",
    distractorRationales: [
      "The mechanical valve itself is not the contraindication - the elevated INR is",
      "tPA cannot be given with INR >1.7 regardless of clinical urgency",
      "Vitamin K reversal is too slow and creates prolonged unprotected valve period"
    ],
    lessonLink: "/emergency/lessons/acute-coronary-syndrome"
  },
  {
    stem: "A 48-year-old male with no significant medical history develops sudden onset of severe tearing interscapular back pain while lifting heavy boxes. BP is 188/102 mmHg in the right arm. The patient is diaphoretic and anxious. Which imaging study is the diagnostic test of choice for the suspected condition?",
    options: [
      "Transthoracic echocardiography (TTE)",
      "CT angiography (CTA) of the chest with IV contrast",
      "Chest X-ray with PA and lateral views",
      "12-lead ECG with serial troponins"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient's presentation of sudden severe tearing interscapular back pain with hypertension and diaphoresis during physical exertion is highly suspicious for acute aortic dissection. CT angiography (CTA) of the chest, abdomen, and pelvis with IV contrast is the diagnostic test of choice, with sensitivity and specificity both exceeding 95% for aortic dissection. CTA rapidly identifies the dissection flap, the extent of the dissection (Type A involving ascending aorta vs Type B limited to descending aorta), the origin of the intimal tear, branch vessel involvement, and complications such as pericardial effusion, hemothorax, or malperfusion syndromes. CTA is widely available, can be performed rapidly (within minutes), and provides the surgeon with the anatomical detail needed for surgical planning. Transthoracic echocardiography (TTE) has limited sensitivity for aortic dissection (approximately 60-80%) because the ascending aorta is partially obscured by the sternum and lungs. Transesophageal echocardiography (TEE) has much higher sensitivity (97-99%) and can be performed at the bedside for hemodynamically unstable patients, but is not the first-line diagnostic study. A chest X-ray may show a widened mediastinum (present in only 60-70% of dissections) and is insufficiently sensitive to confirm or exclude the diagnosis. An ECG should be obtained to evaluate for coronary involvement (dissection can extend into the coronary ostia causing STEMI) but is not diagnostic for dissection. The emergency nurse should establish bilateral large-bore IV access, prepare for IV beta-blocker therapy (esmolol or labetalol) targeting HR <60 and SBP 100-120 mmHg, and ensure the patient is transported to CT with continuous monitoring and blood pressure treatment.",
    learningObjective: "Select CT angiography as the diagnostic test of choice for suspected acute aortic dissection",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Aortic Dissection",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Chest X-ray showing widened mediastinum is only 60-70% sensitive for aortic dissection - CTA is needed for definitive diagnosis",
    clinicalPearls: [
      "CTA: >95% sensitivity and specificity for aortic dissection",
      "TEE is an alternative for hemodynamically unstable patients (bedside)",
      "Type A (ascending) = surgical emergency; Type B (descending) = usually medical management",
      "Obtain CTA of chest, abdomen, AND pelvis to assess full extent of dissection"
    ],
    safetyNote: "Control heart rate BEFORE blood pressure in aortic dissection - reducing BP without controlling HR increases aortic wall shear stress",
    distractorRationales: [
      "TTE has limited sensitivity (~60-80%) for aortic dissection",
      "Chest X-ray is insufficiently sensitive to confirm or exclude dissection",
      "ECG assesses for coronary involvement but does not diagnose dissection"
    ],
    lessonLink: "/emergency/lessons/aortic-dissection"
  },
  {
    stem: "A 76-year-old male with chronic atrial fibrillation on apixaban presents with 2 days of melena and dizziness. Hemoglobin is 7.2 g/dL (baseline 12.8), BP 94/62 mmHg, HR 108 bpm. He takes apixaban 5 mg twice daily and his last dose was 3 hours ago. What is the most appropriate approach to managing his anticoagulation?",
    options: [
      "Continue apixaban as stopping it risks stroke from atrial fibrillation",
      "Hold apixaban and administer andexanet alfa only if bleeding is life-threatening and uncontrolled despite other measures",
      "Immediately administer idarucizumab (Praxbind) to reverse the apixaban",
      "Administer vitamin K 10 mg IV to reverse the apixaban"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient has a significant GI hemorrhage (melena, hemoglobin drop from 12.8 to 7.2, hemodynamic instability) while on apixaban, a direct Factor Xa inhibitor. The management approach involves: (1) Hold apixaban immediately - continuing anticoagulation in the setting of active hemorrhage with hemodynamic compromise is inappropriate despite the stroke risk from AF. The risk of continued hemorrhage outweighs the stroke risk from temporary anticoagulation interruption; (2) Initiate resuscitation with IV crystalloids and blood product transfusion (target Hgb >7 g/dL, or >8 if symptomatic or CAD); (3) Obtain urgent GI consultation for endoscopy; (4) Reserve andexanet alfa for truly life-threatening bleeding that is not controlled by standard measures (endoscopic intervention, transfusion, supportive care). Andexanet alfa is expensive ($25,000-50,000 per dose), has a risk of thrombotic events (18% in studies), and should not be used routinely for all DOAC-related bleeds. The bleeding must be assessed as truly life-threatening before committing to reversal. 4-factor PCC can be considered as an alternative if andexanet alfa is unavailable. Apixaban has a half-life of approximately 12 hours, so the drug effect will diminish over 24-48 hours without the need for specific reversal in most cases. Idarucizumab (Praxbind) reverses DABIGATRAN (direct thrombin inhibitor), NOT apixaban (Factor Xa inhibitor) - using the wrong reversal agent is a critical medication error. Vitamin K only reverses warfarin and has no effect on DOACs.",
    learningObjective: "Manage anticoagulation in DOAC-related hemorrhage with appropriate holding of medication and selective use of reversal agents",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Arrhythmia Identification and Treatment",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Idarucizumab reverses DABIGATRAN only. Andexanet alfa reverses APIXABAN and RIVAROXABAN. Using the wrong reversal agent is a critical error",
    clinicalPearls: [
      "Andexanet alfa: Factor Xa inhibitors (apixaban, rivaroxaban)",
      "Idarucizumab: dabigatran ONLY (direct thrombin inhibitor)",
      "Reserve specific reversal for life-threatening, uncontrolled bleeding",
      "Apixaban half-life ~12 hours - drug effect diminishes without reversal in most cases"
    ],
    safetyNote: "Andexanet alfa carries 18% thrombotic event risk - use only for truly life-threatening bleeding",
    distractorRationales: [
      "Continuing anticoagulation during active hemorrhage with hemodynamic instability is dangerous",
      "Idarucizumab only reverses dabigatran, not apixaban",
      "Vitamin K only reverses warfarin and has no effect on DOACs"
    ],
    lessonLink: "/emergency/lessons/arrhythmia-management"
  },
  {
    stem: "A 52-year-old female presents to the ED with crushing chest pain. She states she took 'something for her blood pressure' but cannot remember the medication name. Her BP is 82/50 mmHg, HR 42 bpm, blood glucose is 48 mg/dL, and ECG shows sinus bradycardia with first-degree AV block. Based on this presentation, what medication toxicity should the nurse suspect?",
    options: [
      "ACE inhibitor overdose",
      "Beta-blocker overdose",
      "Statin overdose",
      "Thiazide diuretic overdose"
    ],
    correctAnswer: 1,
    rationaleLong: "The clinical triad of bradycardia, hypotension, and hypoglycemia is the classic presentation of beta-blocker toxicity. Beta-blockers block beta-1 adrenergic receptors (heart) causing bradycardia and reduced contractility leading to hypotension, and also block beta-2 receptors (liver and skeletal muscle) which impairs glycogenolysis and gluconeogenesis, causing hypoglycemia. The first-degree AV block on ECG is consistent with beta-blocker effects on the cardiac conduction system. Management of beta-blocker overdose includes: (1) IV atropine for bradycardia (may be ineffective in severe overdose); (2) High-dose IV glucagon (3-10 mg bolus, followed by infusion at 2-5 mg/hr) - glucagon is the specific antidote as it activates adenylate cyclase independent of the beta receptor, increasing intracellular cAMP and improving heart rate and contractility; (3) IV dextrose for hypoglycemia; (4) IV calcium gluconate or calcium chloride for inotropic support; (5) High-dose insulin-euglycemia therapy (insulin 1 unit/kg bolus followed by 0.5-1 unit/kg/hr infusion with dextrose to maintain euglycemia) - this is an increasingly important therapy that provides inotropy through enhanced myocardial glucose utilization; (6) IV vasopressors (norepinephrine, epinephrine) for refractory hypotension; (7) IV lipid emulsion (Intralipid 20%) for lipophilic beta-blocker overdose. ACE inhibitors cause hypotension but not typically bradycardia or hypoglycemia. Statin overdose does not cause acute hemodynamic compromise. Thiazide overdose causes hypovolemia and electrolyte abnormalities, not bradycardia.",
    learningObjective: "Recognize the classic triad of beta-blocker toxicity (bradycardia, hypotension, hypoglycemia) and understand the antidote (glucagon)",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Arrhythmia Identification and Treatment",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Beta-blocker toxicity triad: Bradycardia + Hypotension + Hypoglycemia. Glucagon is the specific antidote, but high-dose insulin therapy is increasingly important",
    clinicalPearls: [
      "Beta-blocker toxicity: bradycardia + hypotension + hypoglycemia",
      "Glucagon: 3-10 mg IV bolus, then 2-5 mg/hr infusion (bypasses beta receptor)",
      "High-dose insulin: 1 unit/kg bolus + 0.5-1 unit/kg/hr with dextrose",
      "IV lipid emulsion for lipophilic beta-blocker overdose (propranolol, carvedilol)"
    ],
    safetyNote: "Beta-blocker overdose can cause refractory cardiovascular collapse - have high-dose insulin, glucagon, and IV lipid emulsion all available",
    distractorRationales: [
      "ACE inhibitors cause hypotension without bradycardia or hypoglycemia",
      "Statin overdose does not cause acute hemodynamic compromise",
      "Thiazide diuretics cause hypovolemia and electrolyte derangements, not bradycardia"
    ],
    lessonLink: "/emergency/lessons/arrhythmia-management"
  },
  {
    stem: "A nurse is reviewing the ECG of a 45-year-old patient and notes a short PR interval (<120 ms) with a delta wave and wide QRS complex. The patient is asymptomatic and was seen for a non-cardiac complaint. What is the significance of this finding?",
    options: [
      "Normal ECG variant requiring no follow-up",
      "Wolff-Parkinson-White (WPW) pattern indicating an accessory pathway that predisposes to potentially dangerous tachyarrhythmias requiring cardiology referral",
      "First-degree AV block requiring pacemaker evaluation",
      "Left bundle branch block requiring echocardiography"
    ],
    correctAnswer: 1,
    rationaleLong: "The combination of a short PR interval (<120 ms), delta wave (slurred upstroke of the QRS), and wide QRS complex on ECG is the classic triad of Wolff-Parkinson-White (WPW) pattern, indicating the presence of an accessory pathway (Bundle of Kent) between the atria and ventricles. The short PR interval occurs because the accessory pathway conducts impulses faster than the AV node, and the delta wave represents early ventricular activation through the accessory pathway before the normal His-Purkinje system depolarizes the ventricles. While this patient is currently asymptomatic, the WPW pattern is clinically significant because: (1) It predisposes to re-entrant tachycardias (orthodromic and antidromic AVRT); (2) If atrial fibrillation develops, the accessory pathway can conduct at very rapid rates (bypassing the AV node's rate-limiting function), potentially causing ventricular fibrillation and sudden cardiac death; (3) The risk of sudden cardiac death in WPW is approximately 0.1-0.3% per year. The patient should be referred to cardiology/electrophysiology for risk stratification, which may include electrophysiology study to assess the refractory period of the accessory pathway. A short refractory period (<250 ms) indicates higher risk. Catheter ablation of the accessory pathway is curative with a success rate exceeding 95%. This is NOT a normal variant - the presence of an accessory pathway is always pathological, even if the patient is currently asymptomatic. It is not first-degree AV block (which has a LONG PR interval) or LBBB (which does not have a delta wave or short PR).",
    learningObjective: "Identify the WPW ECG pattern (short PR, delta wave, wide QRS) and understand its clinical significance for sudden cardiac death risk",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "12-Lead ECG Interpretation",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "WPW pattern is NEVER a normal variant even if asymptomatic - it carries risk of sudden cardiac death and requires cardiology referral",
    clinicalPearls: [
      "WPW triad: short PR (<120 ms) + delta wave + wide QRS",
      "Risk of SCD is 0.1-0.3% per year, even in asymptomatic patients",
      "Catheter ablation is curative with >95% success rate",
      "EP study assesses accessory pathway refractory period for risk stratification"
    ],
    safetyNote: "Educate WPW patients to seek immediate care for palpitations - atrial fibrillation with rapid accessory pathway conduction can be fatal",
    distractorRationales: [
      "WPW is never a normal variant - it requires cardiology referral",
      "First-degree AV block has a PROLONGED PR, not a short PR",
      "LBBB has a wide QRS but no delta wave or short PR interval"
    ],
    lessonLink: "/emergency/lessons/ecg-interpretation"
  },
  {
    stem: "During a code blue in the ED, the emergency nurse notices the team has been performing CPR for 25 minutes without achieving ROSC. The patient is a 78-year-old with end-stage COPD and metastatic cancer. EtCO2 has been consistently below 10 mmHg. What does the EtCO2 data suggest about resuscitation efforts?",
    options: [
      "EtCO2 below 10 mmHg indicates poor CPR quality and the team should focus on improving compressions",
      "Persistently low EtCO2 (<10 mmHg) after 20 minutes of quality CPR is a strong predictor of non-survival and supports consideration of termination of resuscitation efforts",
      "EtCO2 monitoring is unreliable during cardiac arrest and should be disregarded",
      "A reading below 10 mmHg is normal during cardiac arrest and does not have prognostic value"
    ],
    correctAnswer: 1,
    rationaleLong: "End-tidal CO2 (EtCO2) during CPR is a valuable tool for both monitoring CPR quality and prognostication. Persistently low EtCO2 values (<10 mmHg) after 20 minutes of high-quality CPR are strongly associated with failure to achieve ROSC and are considered a reliable predictor of non-survival. EtCO2 during cardiac arrest reflects cardiac output generated by chest compressions and pulmonary blood flow. When EtCO2 remains below 10 mmHg despite adequate compression quality, it indicates severely reduced or absent pulmonary blood flow, suggesting that meaningful cardiac output is not being generated and the myocardium is not responding to resuscitative efforts. The AHA has incorporated EtCO2 into their guidance, stating that an EtCO2 <10 mmHg after 20 minutes of CPR may be used as one component in the decision to terminate resuscitation efforts. However, this should not be the sole determinant - clinical context, patient wishes, reversible causes, and the overall clinical picture must be considered. In this case, the patient's comorbidities (end-stage COPD and metastatic cancer) combined with the persistently low EtCO2 and 25 minutes of unsuccessful resuscitation strongly support a discussion about termination of efforts. It is important to note that low EtCO2 CAN sometimes indicate poor CPR quality rather than futility, so compression quality should be verified first (adequate rate, depth, recoil, and minimal interruptions). If CPR quality is confirmed as adequate and EtCO2 remains <10, the prognostic implication stands. The emergency nurse can use this objective data to support the team in making difficult end-of-life decisions.",
    learningObjective: "Use EtCO2 monitoring as a prognostic tool during cardiac arrest to support decisions about continuation or termination of resuscitation",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Cardiac Arrest Management (ACLS)",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "EtCO2 <10 mmHg after 20 min of quality CPR predicts non-survival, but first verify CPR quality before concluding futility",
    clinicalPearls: [
      "EtCO2 <10 mmHg after 20 min quality CPR = strong predictor of non-survival",
      "EtCO2 >20 mmHg during CPR correlates with better compression quality",
      "Sudden EtCO2 rise during CPR = likely ROSC",
      "EtCO2 is one factor in termination decision - not the sole determinant"
    ],
    safetyNote: "Always verify CPR quality before attributing low EtCO2 to futility - inadequate compressions also cause low EtCO2 readings",
    distractorRationales: [
      "Low EtCO2 can indicate poor CPR quality, but after verifying quality, it has prognostic value",
      "EtCO2 is a well-validated and reliable monitoring tool during cardiac arrest",
      "Below 10 mmHg is NOT normal during CPR and has significant prognostic implications"
    ],
    lessonLink: "/emergency/lessons/cardiac-arrest-acls"
  },
  {
    stem: "A 39-year-old female presents with acute chest pain and dyspnea 10 days after cesarean section delivery. She is tachycardic (HR 125), hypotensive (BP 78/42 mmHg), and has SpO2 of 84% on high-flow oxygen. Bedside echo shows severe RV dilation and bowing of the interventricular septum toward the LV. What is the most appropriate immediate treatment?",
    options: [
      "IV heparin bolus and infusion only",
      "Systemic thrombolysis with alteplase 100 mg IV over 2 hours",
      "CT pulmonary angiography before any treatment",
      "Emergent surgical embolectomy without any medical treatment"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient presents with massive pulmonary embolism (PE) - defined by hemodynamic instability (SBP <90 mmHg) with evidence of obstructive shock. The combination of postpartum status (major risk factor for VTE), hemodynamic instability, severe hypoxemia, and echocardiographic evidence of acute RV failure (severe RV dilation with septal bowing) makes the diagnosis of massive PE essentially clinical, without requiring CT confirmation. In massive PE with hemodynamic instability and imminent cardiovascular collapse, systemic thrombolysis with alteplase (100 mg IV over 2 hours, or 50 mg IV push for cardiac arrest) is the recommended treatment. The benefits of thrombolysis in massive PE include rapid clot dissolution, reduction in pulmonary vascular resistance, improvement in RV function, and reduced mortality (from approximately 65% to 25% in massive PE). Thrombolysis should not be delayed for CT imaging in a hemodynamically unstable patient with clear clinical and echocardiographic evidence of massive PE. While recent cesarean section is a relative contraindication to thrombolysis (due to bleeding risk), massive PE has such high mortality that the benefit typically outweighs the bleeding risk. The decision should be made with input from the obstetric team if time allows. IV heparin alone is insufficient for massive PE with hemodynamic compromise. Surgical embolectomy is an alternative when thrombolysis fails or is absolutely contraindicated, but requires cardiopulmonary bypass and is not as rapidly deployable. The emergency nurse should prepare alteplase, ensure large-bore IV access, have vasopressors running, and prepare for potential cardiopulmonary deterioration.",
    learningObjective: "Administer systemic thrombolysis for massive pulmonary embolism with hemodynamic instability without delaying for imaging",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "PE Management",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Do NOT delay thrombolysis for CT imaging in massive PE with hemodynamic instability - bedside echo evidence of RV failure is sufficient",
    clinicalPearls: [
      "Massive PE: hemodynamic instability = immediate thrombolysis",
      "Bedside echo showing RV failure + hemodynamic instability = clinical diagnosis",
      "Alteplase: 100 mg over 2 hours (or 50 mg push in cardiac arrest)",
      "Post-surgical state is a relative, not absolute, contraindication when PE is life-threatening"
    ],
    safetyNote: "Monitor closely for hemorrhagic complications after thrombolysis - have blood products and cryoprecipitate available",
    distractorRationales: [
      "Heparin alone is insufficient for massive PE with hemodynamic compromise",
      "CT should not delay treatment in hemodynamically unstable massive PE",
      "Surgical embolectomy is a backup when thrombolysis fails or is absolutely contraindicated"
    ],
    lessonLink: "/emergency/lessons/pe-management"
  },
  {
    stem: "A patient arrives in the ED with substernal chest pain. The 12-lead ECG shows ST elevation in leads II, III, aVF, V5, and V6 with ST depression in leads V1-V3 and aVR. What coronary artery territory does this ECG pattern suggest?",
    options: [
      "Left anterior descending (LAD) artery territory",
      "Left circumflex (LCx) artery territory with inferolateral involvement",
      "Right coronary artery (RCA) territory only",
      "Left main coronary artery (LMCA) territory"
    ],
    correctAnswer: 1,
    rationaleLong: "This ECG pattern shows ST elevation in both inferior leads (II, III, aVF) and lateral leads (V5, V6) with reciprocal ST depression in anterior/septal leads (V1-V3). This inferolateral STEMI pattern most commonly indicates left circumflex (LCx) artery occlusion. The LCx supplies the lateral and, in some patients, the inferior wall of the left ventricle. The LCx artery is particularly important because it is the culprit vessel in approximately 15-20% of STEMIs, and LCx occlusion can be more difficult to diagnose on standard 12-lead ECG because the lateral wall is poorly represented by the standard leads. When both inferior and lateral lead groups show ST elevation, it strongly suggests a dominant or co-dominant LCx artery supplying both territories. The reciprocal ST depression in V1-V3 supports this pattern and may also represent posterior wall involvement (posterior STEMI equivalent), which would further support LCx territory infarction. The LAD territory typically causes ST elevation in V1-V4 (anterior leads), with or without lateral involvement. Isolated RCA occlusion causes inferior ST elevation (II, III, aVF) without lateral involvement (V5, V6 are typically unaffected in RCA infarction). LMCA occlusion typically shows ST elevation in aVR with diffuse ST depression in multiple leads, different from this pattern. Understanding coronary artery territory correlations helps the emergency nurse anticipate complications: LCx territory MIs can cause mitral regurgitation (from papillary muscle ischemia), lateral wall motion abnormalities, and AV conduction disturbances in dominant LCx variants.",
    learningObjective: "Correlate ECG ST elevation patterns with coronary artery territories for inferolateral STEMI",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "12-Lead ECG Interpretation",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Inferolateral ST elevation (II, III, aVF + V5, V6) = LCx territory. Isolated inferior elevation = RCA. Anterior (V1-V4) = LAD",
    clinicalPearls: [
      "LCx territory: inferolateral leads (II, III, aVF + V5, V6)",
      "RCA territory: inferior leads only (II, III, aVF) without lateral extension",
      "LAD territory: anterior/septal leads (V1-V4)",
      "Reciprocal ST depression V1-V3 in inferolateral STEMI suggests posterior involvement"
    ],
    safetyNote: "LCx STEMIs can be subtle - obtain posterior leads V7-V9 when anterior ST depression is present with inferior/lateral changes",
    distractorRationales: [
      "LAD territory causes anterior ST elevation in V1-V4, not inferolateral",
      "Isolated RCA causes inferior ST elevation without V5-V6 involvement",
      "LMCA shows ST elevation in aVR with diffuse depression, not this pattern"
    ],
    lessonLink: "/emergency/lessons/ecg-interpretation"
  },
  {
    stem: "A patient in the ED develops asystole during a cardiac arrest. High-quality CPR is in progress. What medications should the emergency nurse prepare, and what intervention is NOT appropriate for asystole?",
    options: [
      "Defibrillation - asystole is not a shockable rhythm; administer epinephrine 1 mg IV every 3-5 minutes and search for reversible causes",
      "Amiodarone 300 mg IV bolus for rhythm conversion",
      "Synchronized cardioversion at 200 joules",
      "Transcutaneous pacing at 80 bpm"
    ],
    correctAnswer: 0,
    rationaleLong: "Asystole is a non-shockable rhythm in the ACLS cardiac arrest algorithm. Defibrillation and cardioversion are ineffective and inappropriate for asystole because there is no organized electrical activity to 'reset.' The management of asystole focuses on: (1) High-quality CPR with minimal interruptions; (2) Epinephrine 1 mg IV/IO every 3-5 minutes; (3) Securing the airway with an advanced airway (ETT or supraglottic device); (4) Identifying and treating reversible causes using the H's and T's framework. Before accepting a rhythm as asystole, the emergency nurse should verify: confirm leads are attached and the monitor is functioning, increase the gain/amplitude on the monitor, and check in a second lead to rule out fine ventricular fibrillation masquerading as asystole. If any doubt exists, treat as VF and defibrillate. Transcutaneous pacing for asystole is no longer recommended in the current ACLS guidelines. Studies have shown that TCP in true asystole does not improve outcomes because asystole typically represents extensive myocardial damage with no viable electrical or mechanical function. Amiodarone is used for VF/pVT (shockable rhythms), not for asystole. The prognosis for asystolic cardiac arrest is poor, with survival to hospital discharge rates typically less than 2-5%. Asystole that develops during resuscitation (initially presenting as VF/pVT that degenerates to asystole) generally has a worse prognosis than other arrest rhythms, as it indicates progressive myocardial failure.",
    learningObjective: "Manage asystolic cardiac arrest with CPR and epinephrine while avoiding inappropriate defibrillation and pacing",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Cardiac Arrest Management (ACLS)",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Asystole is NOT a shockable rhythm. Defibrillation, cardioversion, and pacing are all ineffective for true asystole",
    clinicalPearls: [
      "Asystole: non-shockable rhythm - CPR + epinephrine + reversible causes",
      "Confirm asystole in 2 leads and check connections before accepting the rhythm",
      "TCP is no longer recommended for asystole in current ACLS guidelines",
      "Fine VF can mimic asystole - increase gain and check multiple leads"
    ],
    safetyNote: "Always confirm asystole in at least 2 leads and verify monitor connections before concluding a non-shockable rhythm",
    distractorRationales: [
      "Amiodarone is for shockable rhythms (VF/pVT), not asystole",
      "Cardioversion requires organized electrical activity, which is absent in asystole",
      "TCP is no longer recommended for true asystole"
    ],
    lessonLink: "/emergency/lessons/cardiac-arrest-acls"
  },
  {
    stem: "A 55-year-old male with a history of dilated cardiomyopathy (EF 15%) presents to the ED with increasing shortness of breath, orthopnea, and a 10-pound weight gain over 1 week. He reports taking all his medications except he ran out of his carvedilol 3 days ago. His BP is 168/102 mmHg and HR is 112 bpm. What is the most likely explanation for his acute decompensation?",
    options: [
      "Natural progression of his cardiomyopathy",
      "Beta-blocker withdrawal causing rebound sympathetic activation, hypertension, and tachycardia, precipitating heart failure decompensation",
      "Dietary sodium excess as the sole cause",
      "Medication interaction with his other heart failure medications"
    ],
    correctAnswer: 1,
    rationaleLong: "Abrupt discontinuation of beta-blockers is a well-recognized cause of acute heart failure decompensation. Beta-blocker withdrawal causes rebound sympathetic activation due to upregulation of beta-adrenergic receptors during chronic beta-blocker therapy. When the drug is suddenly removed, the increased number of receptors is exposed to endogenous catecholamines without pharmacological blockade, resulting in: (1) Rebound tachycardia - the heart rate increases beyond the patient's pre-treatment baseline; (2) Hypertension - from increased peripheral vascular resistance; (3) Increased myocardial oxygen demand - from tachycardia and hypertension; (4) Worsened heart failure - from increased afterload and arrhythmia risk in an already compromised heart. In a patient with severely reduced EF (15%), even moderate increases in heart rate and afterload can precipitate acute decompensation because the failing heart cannot compensate for the increased workload. The management includes: (1) Restarting the beta-blocker, but at a LOWER dose than the home dose to avoid worsening acute heart failure; (2) IV diuretics for volume overload; (3) Blood pressure management; (4) Monitoring for arrhythmias. The beta-blocker should never be restarted at the full home dose during acute decompensation, as acute beta-blockade in decompensated heart failure can worsen cardiac output. Instead, it should be restarted at a low dose and gradually uptitrated once the patient is clinically stable. While dietary indiscretion could contribute, the temporal relationship with medication discontinuation makes beta-blocker withdrawal the primary trigger. The emergency nurse should obtain a thorough medication reconciliation history to identify this common and preventable cause of decompensation.",
    learningObjective: "Identify beta-blocker withdrawal as a trigger for acute heart failure decompensation due to rebound sympathetic activation",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Heart Failure Exacerbation",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Never abruptly stop beta-blockers - rebound sympathetic activation can precipitate acute decompensation, MI, or arrhythmias",
    clinicalPearls: [
      "Beta-blocker withdrawal causes rebound tachycardia and hypertension",
      "Restart at LOWER dose during acute decompensation, then uptitrate",
      "Medication reconciliation is essential in all heart failure presentations",
      "Beta-blocker withdrawal can also trigger acute MI and malignant arrhythmias"
    ],
    safetyNote: "Educate heart failure patients to never abruptly stop beta-blockers and to contact their provider if they cannot refill prescriptions",
    distractorRationales: [
      "Natural progression is possible but the temporal relationship with med discontinuation is key",
      "Dietary sodium may contribute but does not explain the tachycardia and hypertension",
      "Medication interaction is unlikely when the issue is medication withdrawal"
    ],
    lessonLink: "/emergency/lessons/heart-failure-management"
  },
  {
    stem: "An emergency nurse is managing a patient who develops chest pain during a blood transfusion. The patient's SpO2 drops from 98% to 89%, he develops bilateral crackles, and his blood pressure rises from 128/78 to 168/98 mmHg. What transfusion reaction should the nurse suspect?",
    options: [
      "Acute hemolytic transfusion reaction",
      "Transfusion-associated circulatory overload (TACO)",
      "Transfusion-related acute lung injury (TRALI)",
      "Febrile non-hemolytic transfusion reaction"
    ],
    correctAnswer: 1,
    rationaleLong: "This presentation is most consistent with transfusion-associated circulatory overload (TACO). TACO occurs when the rate or volume of blood transfusion exceeds the patient's cardiac capacity to handle the increased intravascular volume. The key distinguishing features of TACO include: hypertension (blood pressure increased from baseline), pulmonary edema (bilateral crackles with hypoxemia), and symptoms developing during or within 6 hours of transfusion. TACO is essentially cardiogenic pulmonary edema caused by volume overload from the transfusion. Risk factors include pre-existing heart failure, renal insufficiency, advanced age, and rapid infusion rate. The differentiating factors between TACO and TRALI are important: TACO presents with hypertension and elevated BNP (consistent with volume overload and cardiac strain), while TRALI typically presents with hypotension (from increased capillary permeability and distributive physiology) and normal or minimally elevated BNP. TRALI is an immune-mediated reaction causing non-cardiogenic pulmonary edema through activation of neutrophils and endothelial damage. Both conditions present with respiratory distress and bilateral infiltrates, but the hemodynamic profile distinguishes them. Management of TACO includes: immediately stopping or slowing the transfusion, upright positioning, supplemental oxygen, IV furosemide for diuresis, and treatment as for any acute pulmonary edema. An acute hemolytic reaction presents with fever, chills, hemoglobinuria, and flank pain. A febrile non-hemolytic reaction causes fever and chills without respiratory compromise.",
    learningObjective: "Differentiate transfusion-associated circulatory overload from other transfusion reactions based on hemodynamic profile",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Cardiogenic Pulmonary Edema",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "TACO = hypertension + pulmonary edema + elevated BNP. TRALI = hypotension + bilateral infiltrates + normal BNP. Both cause respiratory distress",
    clinicalPearls: [
      "TACO: hypertension, elevated BNP, responds to diuresis",
      "TRALI: hypotension, normal BNP, does NOT respond to diuresis",
      "Risk factors for TACO: heart failure, renal insufficiency, advanced age, rapid infusion",
      "Stop transfusion immediately in any suspected transfusion reaction"
    ],
    safetyNote: "Transfuse slowly (1 mL/kg/hr) in patients with heart failure or renal disease to prevent TACO",
    distractorRationales: [
      "Hemolytic reactions present with fever, hemoglobinuria, and flank pain, not pulmonary edema",
      "TRALI presents with hypotension, not hypertension",
      "Febrile non-hemolytic reactions cause fever without respiratory compromise"
    ],
    lessonLink: "/emergency/lessons/cardiogenic-pulmonary-edema"
  }
];
