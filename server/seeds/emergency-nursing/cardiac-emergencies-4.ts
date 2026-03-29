import { EmergencyNursingQuestion } from "./types";

export const cardiacEmergency4Questions: EmergencyNursingQuestion[] = [
  {
    stem: "A 72-year-old male with a history of aortic stenosis presents to the ED with syncope. His ECG shows left ventricular hypertrophy with strain pattern. BP is 100/70 mmHg, HR 68 bpm. Which assessment finding would most concern the emergency nurse?",
    options: [
      "A systolic crescendo-decrescendo murmur heard best at the right upper sternal border",
      "A new-onset atrial fibrillation on the cardiac monitor",
      "Bilateral lower extremity edema with jugular venous distension",
      "An S4 heart sound on auscultation"
    ],
    correctAnswer: 1,
    rationaleLong: "While all findings are concerning in a patient with known aortic stenosis, new-onset atrial fibrillation represents an acute and potentially life-threatening complication. In severe aortic stenosis, the left ventricle becomes hypertrophied and stiff, making it heavily dependent on atrial contraction (the 'atrial kick') for adequate ventricular filling. The atrial kick can contribute up to 40% of cardiac output in patients with significant left ventricular hypertrophy, compared to only 15-25% in normal hearts. When atrial fibrillation develops, the loss of organized atrial contraction eliminates this critical contribution to cardiac output, potentially causing acute hemodynamic decompensation. The rapid ventricular response in atrial fibrillation also shortens diastolic filling time, further compromising cardiac output in an already compromised ventricle. This combination can lead to acute pulmonary edema, cardiogenic shock, or cardiac arrest. The systolic murmur is an expected finding with aortic stenosis. Bilateral edema and JVD indicate chronic heart failure but are not acutely life-threatening. An S4 heart sound is expected with LVH and indicates decreased ventricular compliance. The emergency nurse should immediately prepare for cardioversion if the patient becomes unstable and initiate rate control with caution, avoiding medications that reduce preload.",
    learningObjective: "Identify atrial fibrillation as a critical complication in aortic stenosis due to loss of atrial kick",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Valvular Emergencies",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "The murmur and S4 are expected findings in aortic stenosis - don't be distracted by chronic findings when an acute complication is present",
    clinicalPearls: [
      "Loss of atrial kick in aortic stenosis can reduce cardiac output by up to 40%",
      "Avoid vasodilators in severe aortic stenosis - can cause refractory hypotension",
      "New atrial fibrillation in aortic stenosis may require urgent cardioversion",
      "Severe AS patients who become hypotensive may need phenylephrine for afterload support"
    ],
    safetyNote: "Nitroglycerin is relatively contraindicated in severe aortic stenosis due to risk of profound hypotension",
    distractorRationales: [
      "The systolic murmur is an expected finding in aortic stenosis, not a new complication",
      "New-onset atrial fibrillation is acutely dangerous due to loss of atrial kick in a stiff ventricle",
      "Bilateral edema and JVD indicate chronic heart failure, not an acute emergency",
      "S4 heart sound is expected with LVH and does not indicate acute deterioration"
    ],
    lessonLink: "/emergency/lessons/valvular-emergencies"
  },
  {
    stem: "A 55-year-old female presents with acute onset dyspnea and diaphoresis. Her ECG shows new T-wave inversions in V1-V4 with a prolonged QTc of 520 ms. Troponin I is elevated at 2.4 ng/mL. She reports recent severe emotional stress after the death of her spouse. Which condition should the emergency nurse suspect?",
    options: [
      "Anterior wall STEMI requiring emergent cardiac catheterization",
      "Takotsubo (stress) cardiomyopathy with apical ballooning",
      "Acute myocarditis from viral infection",
      "Hypertrophic cardiomyopathy with dynamic outflow obstruction"
    ],
    correctAnswer: 1,
    rationaleLong: "This presentation is classic for Takotsubo (stress) cardiomyopathy, also known as 'broken heart syndrome' or apical ballooning syndrome. The key features include: (1) acute onset cardiac symptoms following severe emotional or physical stress, (2) ECG changes mimicking acute coronary syndrome including T-wave inversions and QT prolongation, (3) mildly elevated troponin levels (typically much lower than expected for the degree of wall motion abnormality), and (4) predominantly affecting postmenopausal women. Takotsubo accounts for approximately 1-2% of patients presenting with suspected acute coronary syndrome. The pathophysiology involves catecholamine surge causing transient myocardial stunning, primarily affecting the left ventricular apex, creating the characteristic 'apical ballooning' pattern on echocardiography. While the presentation can mimic STEMI, several features distinguish it: the troponin elevation is disproportionately low compared to the extent of wall motion abnormality, and the ECG changes often span multiple coronary territories. Management is primarily supportive with beta-blockers and ACE inhibitors, and most patients recover full cardiac function within weeks. However, acute complications including cardiogenic shock, heart failure, and arrhythmias can occur. The emergency nurse should prepare for bedside echocardiography and possible cardiac catheterization to exclude coronary artery disease definitively.",
    learningObjective: "Recognize the clinical presentation of Takotsubo cardiomyopathy and differentiate it from acute coronary syndrome",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Cardiomyopathy",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Takotsubo can mimic STEMI on ECG and have elevated troponins - the clinical context of severe emotional stress is the key differentiator",
    clinicalPearls: [
      "Takotsubo predominantly affects postmenopausal women after severe emotional or physical stress",
      "QT prolongation in Takotsubo increases risk for torsades de pointes",
      "Troponin elevation is typically modest compared to the degree of wall motion abnormality",
      "Most patients recover full cardiac function within 4-8 weeks"
    ],
    safetyNote: "Even with suspected Takotsubo, treat as ACS until coronary artery disease is excluded by catheterization",
    distractorRationales: [
      "STEMI typically shows ST elevation rather than T-wave inversions, and the clinical context favors Takotsubo",
      "Takotsubo is the most likely diagnosis given the emotional trigger, ECG findings, and demographic",
      "Myocarditis typically follows a viral prodrome and lacks the emotional stress trigger",
      "HCM presents with chronic symptoms and does not typically show diffuse T-wave inversions acutely"
    ],
    lessonLink: "/emergency/lessons/cardiomyopathy"
  },
  {
    stem: "A 68-year-old male with an implanted cardiac defibrillator (ICD) arrives at the ED reporting he has received 5 shocks in the past hour. He is alert, anxious, and diaphoretic. HR is 110 bpm and BP is 134/82 mmHg. What is the emergency nurse's priority action?",
    options: [
      "Place a magnet over the ICD to deactivate therapies immediately",
      "Obtain a 12-lead ECG, continuous monitoring, and prepare IV amiodarone while notifying electrophysiology",
      "Administer IV lorazepam 2 mg for anxiety and pain from repeated shocks",
      "Remove the patient's shirt and apply external defibrillation pads in case the ICD fails"
    ],
    correctAnswer: 1,
    rationaleLong: "ICD storm, defined as three or more appropriate or inappropriate ICD discharges within 24 hours, is a cardiac emergency requiring systematic evaluation and management. The priority for this hemodynamically stable patient is to obtain a 12-lead ECG to identify the underlying rhythm, establish continuous monitoring, prepare antiarrhythmic therapy, and notify the electrophysiology team. IV amiodarone is the first-line antiarrhythmic for ICD storm as it can suppress the ventricular tachycardia triggering appropriate shocks. A 12-lead ECG is crucial to determine whether the shocks are appropriate (treating actual ventricular tachycardia/fibrillation) or inappropriate (triggered by lead fracture, electromagnetic interference, supraventricular tachycardia, or oversensing). This distinction fundamentally changes management. Placing a magnet over the ICD should not be done empirically in a stable patient because it disables tachyarrhythmia therapies - if the patient is having legitimate ventricular tachycardia, disabling the ICD could be fatal. Magnet application is reserved for inappropriate shocks or situations where the shocks are causing hemodynamic instability. While the patient's anxiety is understandable, sedation is not the priority and could mask important symptoms. External pads should be applied but are not the primary intervention. The emergency nurse should also obtain serum electrolytes (hypokalemia and hypomagnesemia can trigger arrhythmias), assess for myocardial ischemia, and identify any reversible causes.",
    learningObjective: "Manage ICD storm with systematic assessment including ECG analysis and antiarrhythmic therapy",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Device Emergencies",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Don't automatically place a magnet over a firing ICD - you must first determine if the shocks are appropriate or inappropriate",
    clinicalPearls: [
      "ICD storm = 3 or more shocks in 24 hours; requires emergent evaluation",
      "A magnet over ICD suspends tachytherapies but does NOT turn off the device permanently",
      "IV amiodarone is first-line for suppressing VT causing appropriate ICD shocks",
      "Check potassium, magnesium, and troponin in all ICD storm patients"
    ],
    safetyNote: "Never blindly deactivate an ICD with a magnet without confirming shocks are inappropriate - patient may be in lethal arrhythmia",
    distractorRationales: [
      "Magnet application disables tachytherapies and is dangerous if shocks are appropriate for VT/VF",
      "Systematic assessment with ECG, monitoring, antiarrhythmics, and specialist notification is the correct priority",
      "Sedation does not address the underlying arrhythmia and is not the priority",
      "External pads are a reasonable precaution but not the primary intervention for a stable patient"
    ],
    lessonLink: "/emergency/lessons/cardiac-device-emergencies"
  },
  {
    stem: "A 42-year-old female presents with acute chest pain and a new diastolic murmur. CT angiography reveals a Stanford Type A aortic dissection. BP in the right arm is 178/95 mmHg and in the left arm is 142/80 mmHg. Which medication combination should the emergency nurse prepare first?",
    options: [
      "IV nitroprusside infusion titrated to SBP < 120 mmHg",
      "IV esmolol followed by IV nicardipine to target HR < 60 bpm and SBP 100-120 mmHg",
      "IV labetalol bolus and oral amlodipine for gradual blood pressure reduction",
      "IV hydralazine 10 mg and IV metoprolol 5 mg for dual-agent blood pressure control"
    ],
    correctAnswer: 1,
    rationaleLong: "In acute Stanford Type A aortic dissection, the immediate management priority is 'anti-impulse therapy' - reducing both heart rate and blood pressure to decrease aortic wall shear stress. The target is HR < 60 bpm and SBP 100-120 mmHg. The correct approach is to administer a beta-blocker FIRST (esmolol is preferred due to its short half-life and easy titratability) to reduce heart rate and the rate of rise of aortic pressure (dP/dt), followed by a vasodilator (nicardipine) if additional blood pressure reduction is needed. It is critical that the beta-blocker is given before any vasodilator because vasodilators alone cause reflex tachycardia, which increases aortic wall shear stress and can propagate the dissection. Nitroprusside is a potent vasodilator but should never be used as monotherapy in aortic dissection due to reflex tachycardia - it may only be used after adequate beta-blockade is achieved. IV labetalol has both alpha and beta blocking properties and can be used, but oral amlodipine acts too slowly for this acute emergency. Hydralazine is absolutely contraindicated in aortic dissection because it causes significant reflex tachycardia and increases aortic wall stress. The blood pressure differential between arms (>20 mmHg) is a classic finding in aortic dissection indicating subclavian artery involvement. Stanford Type A involves the ascending aorta and requires emergent surgical repair. The emergency nurse should also establish large-bore IV access, type and crossmatch for at least 6 units of blood, and prepare for emergent transfer to the operating room.",
    learningObjective: "Apply anti-impulse therapy principles in acute aortic dissection with beta-blocker before vasodilator",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Aortic Emergencies",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Never give a vasodilator before a beta-blocker in aortic dissection - reflex tachycardia can propagate the dissection",
    clinicalPearls: [
      "Beta-blocker MUST be given before vasodilator in aortic dissection to prevent reflex tachycardia",
      "Target HR < 60 and SBP 100-120 mmHg in acute dissection",
      "BP differential > 20 mmHg between arms suggests aortic dissection with subclavian involvement",
      "Stanford Type A (ascending aorta) requires emergent surgery; Type B may be managed medically"
    ],
    safetyNote: "Hydralazine is absolutely contraindicated in aortic dissection - causes reflex tachycardia that can propagate the tear",
    distractorRationales: [
      "Nitroprusside alone causes dangerous reflex tachycardia without prior beta-blockade",
      "Esmolol then nicardipine provides proper anti-impulse therapy with rate control before vasodilation",
      "Oral amlodipine acts too slowly for this acute surgical emergency",
      "Hydralazine is contraindicated in aortic dissection due to reflex tachycardia"
    ],
    lessonLink: "/emergency/lessons/aortic-emergencies"
  },
  {
    stem: "A 78-year-old male is brought to the ED after a witnessed cardiac arrest. ROSC was achieved after 12 minutes of CPR. He is intubated and unresponsive. Current vitals: BP 85/50 mmHg, HR 105 bpm, temp 36.8°C, SpO2 96% on ventilator. Which post-ROSC intervention should the emergency nurse initiate first?",
    options: [
      "Begin targeted temperature management by cooling to 32-36°C",
      "Initiate a norepinephrine infusion to maintain MAP ≥ 65 mmHg",
      "Obtain a 12-lead ECG and prepare for emergent cardiac catheterization",
      "Administer IV dexamethasone 10 mg for cerebral edema prevention"
    ],
    correctAnswer: 1,
    rationaleLong: "In the immediate post-ROSC period, the priority follows the systematic approach of optimizing hemodynamics, oxygenation, and then advanced interventions. This patient is hypotensive (BP 85/50, MAP approximately 62 mmHg) which represents an immediate threat to end-organ perfusion, particularly the brain which has already suffered an ischemic insult during the cardiac arrest. The AHA post-cardiac arrest care guidelines recommend maintaining MAP ≥ 65 mmHg (and ideally ≥ 80 mmHg for neuroprotection) using vasopressors as needed. Norepinephrine is the first-line vasopressor for post-ROSC hypotension as it provides both vasoconstrictive and mild inotropic effects. Without adequate perfusion pressure, all other interventions including targeted temperature management will be less effective. Targeted temperature management (TTM) is critically important but should be initiated after hemodynamic stabilization. Cooling a hypotensive patient can worsen hemodynamic instability through peripheral vasoconstriction and cold-induced diuresis. A 12-lead ECG should be obtained to evaluate for STEMI as the cause of arrest, but correcting hypotension takes immediate precedence. Dexamethasone has no proven benefit in post-cardiac arrest cerebral edema and is not recommended. The emergency nurse should also maintain SpO2 94-98% (avoiding hyperoxia), target PaCO2 35-45 mmHg, maintain blood glucose 140-180 mg/dL, and avoid hyperthermia (fever is associated with worse neurological outcomes).",
    learningObjective: "Prioritize hemodynamic stabilization with vasopressors before targeted temperature management in post-ROSC care",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Post-Cardiac Arrest Care",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "TTM is important but not before hemodynamic stability - hypotension in post-ROSC worsens neurological outcomes",
    clinicalPearls: [
      "Target MAP ≥ 65 mmHg (ideally ≥ 80 mmHg) in post-ROSC patients",
      "Norepinephrine is first-line vasopressor for post-ROSC hypotension",
      "Avoid hyperoxia post-ROSC: target SpO2 94-98% and titrate FiO2 down",
      "Post-ROSC hyperthermia (fever) is associated with worse neurological outcomes"
    ],
    safetyNote: "Avoid hyperoxia (SpO2 > 98%) in post-ROSC patients as it increases oxidative injury to ischemic brain tissue",
    distractorRationales: [
      "TTM is important but should be initiated after hemodynamic stabilization",
      "Norepinephrine to maintain adequate MAP is the immediate priority for end-organ perfusion",
      "ECG and catheterization are important but hypotension correction comes first",
      "Dexamethasone has no proven benefit in post-cardiac arrest care"
    ],
    lessonLink: "/emergency/lessons/post-rosc-care"
  },
  {
    stem: "A 35-year-old male presents to the ED with sudden-onset tearing chest pain radiating to the back. He is 6'4\" with long arms and a high-arched palate. His father died suddenly at age 40. Which diagnostic test should the emergency nurse anticipate ordering first?",
    options: [
      "Serial troponin levels every 3 hours to evaluate for myocardial infarction",
      "CT angiography of the chest to evaluate for aortic dissection",
      "Transthoracic echocardiography to assess valve function",
      "D-dimer level to rule out pulmonary embolism"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient's presentation is highly suspicious for acute aortic dissection in the setting of Marfan syndrome. Key findings include: (1) tearing chest pain radiating to the back (classic dissection pain description), (2) tall stature with long extremities (arm span exceeding height) suggesting Marfan habitus, (3) high-arched palate (a skeletal feature of Marfan syndrome), and (4) family history of sudden death at young age (suggesting familial aortic disease). Marfan syndrome is an autosomal dominant connective tissue disorder caused by mutations in the fibrillin-1 gene that predisposes to aortic root dilation and dissection. CT angiography (CTA) is the gold standard diagnostic test for acute aortic dissection, with sensitivity and specificity both exceeding 95%. It can rapidly identify the dissection flap, determine Stanford classification (Type A vs B), and assess branch vessel involvement. CTA is preferred over MRI in the emergency setting due to speed and availability. While troponin levels may be obtained as part of the workup, they should not delay definitive imaging for a suspected dissection. Troponin elevation can occur in dissection if the intimal flap extends to involve the coronary ostia, but serial troponins will not diagnose the underlying pathology. Echocardiography may show aortic root dilation or aortic regurgitation but is insufficient to fully characterize a dissection. D-dimer can be elevated in dissection but lacks specificity and the clinical picture does not primarily suggest PE. Time is critical - the mortality rate for untreated Type A dissection increases by 1-2% per hour.",
    learningObjective: "Recognize Marfan syndrome features and prioritize CT angiography for suspected aortic dissection",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Aortic Emergencies",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Don't delay definitive imaging for serial troponins when aortic dissection is suspected - mortality increases 1-2% per hour",
    clinicalPearls: [
      "Marfan features: tall stature, long arms, high-arched palate, lens subluxation, aortic root dilation",
      "CTA is the gold standard for aortic dissection with >95% sensitivity and specificity",
      "Type A dissection mortality increases 1-2% per hour without treatment",
      "Always check BP in both arms - differential > 20 mmHg suggests dissection"
    ],
    safetyNote: "Maintain a high index of suspicion for aortic dissection in young patients with connective tissue disorder features and chest pain",
    distractorRationales: [
      "Serial troponins delay definitive imaging and won't diagnose dissection",
      "CTA is the gold standard for rapid, definitive diagnosis of aortic dissection",
      "Echocardiography alone cannot fully characterize the extent of dissection",
      "D-dimer is nonspecific and the presentation points to dissection rather than PE"
    ],
    lessonLink: "/emergency/lessons/aortic-emergencies"
  },
  {
    stem: "A 62-year-old female with a history of mitral valve replacement is brought to the ED with acute dyspnea, orthopnea, and hemoptysis. Auscultation reveals absent mechanical valve clicks and a new systolic murmur. SpO2 is 88% on room air. Which complication should the emergency nurse suspect?",
    options: [
      "Prosthetic valve endocarditis with vegetation formation",
      "Acute prosthetic valve thrombosis causing valve obstruction",
      "Papillary muscle rupture from acute myocardial infarction",
      "Acute exacerbation of chronic heart failure from fluid overload"
    ],
    correctAnswer: 1,
    rationaleLong: "The absence of mechanical valve clicks in a patient with a mechanical prosthetic valve is a critical finding indicating valve malfunction. Combined with acute onset dyspnea, orthopnea, hemoptysis, and a new systolic murmur, this presentation is most consistent with acute prosthetic valve thrombosis causing obstruction. Mechanical prosthetic valves produce characteristic opening and closing clicks that are audible on auscultation. When these clicks disappear, it indicates the valve leaflets are not moving properly, most commonly due to thrombus formation restricting leaflet motion. Prosthetic valve thrombosis occurs more frequently in the mitral position and is associated with inadequate anticoagulation, which should be immediately assessed by checking the INR. The new systolic murmur suggests mitral regurgitation from incomplete valve closure due to the thrombus. Hemoptysis results from acute pulmonary congestion and elevated pulmonary venous pressures. This is a surgical emergency requiring urgent evaluation with transesophageal echocardiography (TEE) and consideration of emergent surgical intervention or thrombolytic therapy depending on the clinical scenario. While prosthetic valve endocarditis can cause valve dysfunction, the acute onset and absent valve clicks more strongly suggest thrombosis. Papillary muscle rupture would not affect prosthetic valve clicks. Simple fluid overload would not cause absent valve clicks or a new murmur. The emergency nurse should obtain an urgent INR, start IV heparin if not contraindicated, and prepare for urgent TEE and possible surgical consultation.",
    learningObjective: "Identify absent prosthetic valve clicks as a critical sign of valve thrombosis or malfunction",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Valvular Emergencies",
    difficulty: 5,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Absent mechanical valve clicks is a critical finding that should never be ignored - it indicates valve malfunction",
    clinicalPearls: [
      "Absent prosthetic valve clicks = valve malfunction until proven otherwise",
      "Prosthetic valve thrombosis is more common in the mitral position",
      "Check INR immediately in any patient with a mechanical valve and new symptoms",
      "TEE is superior to TTE for evaluating prosthetic valve pathology"
    ],
    safetyNote: "All patients with mechanical prosthetic valves require lifelong anticoagulation - subtherapeutic INR increases thrombosis risk",
    distractorRationales: [
      "Endocarditis develops more gradually and would not typically cause sudden absent valve clicks",
      "Acute valve thrombosis best explains the absent clicks, acute symptoms, and new murmur",
      "Papillary muscle rupture would not affect prosthetic valve clicks since the native valve was replaced",
      "Fluid overload would not cause absent valve clicks or explain the new murmur"
    ],
    lessonLink: "/emergency/lessons/valvular-emergencies"
  },
  {
    stem: "A 50-year-old male presents with palpitations and lightheadedness. The monitor shows a wide-complex tachycardia at 160 bpm. BP is 92/60 mmHg. He becomes confused and diaphoretic. After preparing for synchronized cardioversion, what energy level should the emergency nurse set for the first shock?",
    options: [
      "50 joules synchronized",
      "100 joules synchronized",
      "200 joules unsynchronized (defibrillation)",
      "360 joules synchronized"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient has an unstable wide-complex tachycardia with signs of hemodynamic compromise (hypotension, altered mental status, diaphoresis), requiring immediate synchronized cardioversion per ACLS guidelines. For wide-complex (monomorphic ventricular) tachycardia, the recommended initial energy for synchronized cardioversion is 100 joules with a biphasic defibrillator. The energy can be increased in a stepwise fashion (100, 200, 300, 360 joules) if the initial shock is unsuccessful. Synchronized cardioversion differs from defibrillation in that the shock is timed to be delivered during the R wave of the QRS complex, avoiding the vulnerable period of the T wave which could induce ventricular fibrillation. This synchronization is critical for organized rhythms like ventricular tachycardia. 50 joules is the initial energy for narrow-complex SVT, not wide-complex tachycardia. 200 joules unsynchronized would be appropriate for ventricular fibrillation or pulseless VT (defibrillation), but this patient has a pulse and an organized rhythm requiring synchronized cardioversion. 360 joules is the maximum energy and is not used as the starting dose. The emergency nurse must ensure the synchronization marker is visible on the monitor before delivering the shock, confirm adequate sedation if time permits (etomidate or midazolam), and have the defibrillator charged and ready to switch to unsynchronized mode if the patient deteriorates into ventricular fibrillation.",
    learningObjective: "Select appropriate energy levels for synchronized cardioversion of unstable wide-complex tachycardia",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Arrhythmia Identification and Treatment",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Know the difference between cardioversion and defibrillation energy levels - wide-complex VT starts at 100J synchronized",
    clinicalPearls: [
      "Synchronized cardioversion for unstable VT: start at 100J biphasic",
      "Synchronized cardioversion for unstable SVT: start at 50-100J biphasic",
      "Always verify the sync marker on the monitor before delivering the shock",
      "Be ready to switch to unsynchronized (defib) mode if rhythm deteriorates to VF"
    ],
    safetyNote: "Always confirm synchronization mode is active before cardioverting - delivering an unsynchronized shock during VT can cause VF",
    distractorRationales: [
      "50 joules is for narrow-complex SVT, not wide-complex ventricular tachycardia",
      "100 joules synchronized is the correct initial energy for wide-complex VT",
      "Unsynchronized shock (defibrillation) is for VF/pulseless VT, not for organized rhythm with a pulse",
      "360 joules is the maximum energy and not an appropriate starting dose"
    ],
    lessonLink: "/emergency/lessons/arrhythmia-management"
  },
  {
    stem: "A 70-year-old female on warfarin presents with epistaxis and gingival bleeding. Her INR is 8.2. She denies any head trauma or neurological symptoms. Vital signs are stable. What is the most appropriate initial management?",
    options: [
      "Administer vitamin K 10 mg IV push and fresh frozen plasma 4 units",
      "Hold warfarin, administer vitamin K 2.5-5 mg PO, and recheck INR in 24 hours",
      "Administer prothrombin complex concentrate (4-factor PCC) and vitamin K 10 mg IV",
      "Transfuse 2 units of fresh frozen plasma and resume warfarin at a reduced dose"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient has a supratherapeutic INR of 8.2 with minor bleeding (epistaxis and gingival bleeding) but no major or life-threatening hemorrhage. According to current guidelines for managing elevated INR, the appropriate management for INR > 5 with minor bleeding includes: (1) holding warfarin, (2) administering oral vitamin K at a dose of 2.5-5 mg, and (3) rechecking INR in 24 hours with dose adjustment. Oral vitamin K is preferred over IV for non-life-threatening situations because it provides a more gradual and predictable reversal, reducing the risk of overcorrection which could predispose to thromboembolic events. IV vitamin K carries a small but real risk of anaphylactoid reactions and can cause rapid, overcorrection of anticoagulation. Vitamin K 10 mg IV with FFP is reserved for life-threatening hemorrhage (intracranial hemorrhage, massive GI bleeding, hemodynamic instability). Similarly, 4-factor PCC (prothrombin complex concentrate) is indicated for life-threatening or major bleeding requiring immediate reversal, not for minor bleeding with stable vitals. Transfusing FFP alone without addressing the vitamin K-dependent factor deficiency provides only temporary correction and is not first-line for minor bleeding. The emergency nurse should also assess for other bleeding sources, obtain a complete blood count, and ensure the patient understands to hold warfarin until follow-up. Local measures for epistaxis (direct pressure, nasal packing) should be performed concurrently.",
    learningObjective: "Apply appropriate anticoagulation reversal strategies based on bleeding severity and INR level",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Anticoagulation Emergencies",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Don't over-treat minor bleeding with aggressive reversal - overcorrection increases thromboembolic risk",
    clinicalPearls: [
      "INR > 5 with minor bleeding: hold warfarin + oral vitamin K 2.5-5 mg",
      "INR > 5 with major/life-threatening bleeding: IV vitamin K + PCC or FFP",
      "Oral vitamin K provides more predictable reversal than IV in non-emergent situations",
      "IV vitamin K carries risk of anaphylactoid reactions - give slowly over 20-30 minutes if used"
    ],
    safetyNote: "Overcorrecting anticoagulation in patients with mechanical valves can cause valve thrombosis - use the minimum reversal needed",
    distractorRationales: [
      "IV vitamin K with FFP is too aggressive for minor bleeding with stable vitals",
      "Oral vitamin K with warfarin held is appropriate for minor bleeding with supratherapeutic INR",
      "PCC is reserved for life-threatening hemorrhage, not minor epistaxis",
      "FFP alone provides temporary correction and does not address the underlying vitamin K deficiency"
    ],
    lessonLink: "/emergency/lessons/anticoagulation-emergencies"
  },
  {
    stem: "A 48-year-old male with no cardiac history presents with acute crushing chest pain. Initial ECG shows ST depression in leads V1-V3 with tall, upright T waves. The emergency nurse recognizes this pattern as potentially representing which condition?",
    options: [
      "Anterior wall NSTEMI with subendocardial ischemia",
      "Posterior STEMI with reciprocal changes in anterior leads",
      "Early repolarization variant (benign normal finding)",
      "Left ventricular hypertrophy with strain pattern"
    ],
    correctAnswer: 1,
    rationaleLong: "ST depression in leads V1-V3 with tall, upright T waves in the setting of acute chest pain is highly suggestive of a posterior STEMI presenting as reciprocal changes in the anterior leads. This is a critical ECG pattern that emergency nurses must recognize because true posterior STEMIs account for approximately 3-10% of all acute MIs and are frequently missed because standard 12-lead ECGs do not directly visualize the posterior wall. In a posterior STEMI, the ST elevation occurs on the posterior wall, which is not covered by standard ECG leads. The anterior leads (V1-V3) see these changes as a mirror image: ST depression instead of elevation, and tall R waves instead of Q waves. The tall, upright T waves in V1-V3 are the mirror image of the T-wave inversions that would be seen in direct posterior leads. When this pattern is identified, the emergency nurse should immediately obtain posterior leads (V7, V8, V9) by placing electrodes on the left posterior chest wall. ST elevation ≥ 0.5 mm in posterior leads confirms the diagnosis. This finding warrants emergent cardiac catheterization just as any other STEMI. An anterior NSTEMI is possible but the specific pattern of ST depression with tall T waves in V1-V3 should raise immediate suspicion for posterior STEMI. Early repolarization would not present with acute chest pain. LVH strain pattern typically shows ST depression with T-wave inversions, not tall upright T waves.",
    learningObjective: "Recognize posterior STEMI presentation as ST depression with tall T waves in V1-V3 on standard 12-lead ECG",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "STEMI/NSTEMI Recognition",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "ST depression in V1-V3 with acute chest pain may be a posterior STEMI, not just an NSTEMI - always get posterior leads",
    clinicalPearls: [
      "ST depression + tall T waves in V1-V3 = think posterior STEMI and get posterior leads",
      "Posterior leads V7-V9: place electrodes on left posterior chest at the same horizontal level as V6",
      "ST elevation ≥ 0.5 mm in V7-V9 confirms posterior STEMI",
      "Posterior STEMI is frequently caused by left circumflex artery occlusion"
    ],
    safetyNote: "Posterior STEMI is one of the most commonly missed STEMI patterns - always obtain posterior leads when V1-V3 show ST depression with chest pain",
    distractorRationales: [
      "NSTEMI is possible but the specific pattern with tall T waves strongly suggests posterior STEMI",
      "Posterior STEMI presents as reciprocal ST depression and tall T waves in anterior leads",
      "Early repolarization is a benign finding and would not present with acute chest pain",
      "LVH strain pattern shows ST depression with T-wave inversions, not tall upright T waves"
    ],
    lessonLink: "/emergency/lessons/stemi-management"
  },
  {
    stem: "A 55-year-old diabetic male presents with fatigue, nausea, and mild dyspnea for 2 days. He denies chest pain. ECG shows new ST elevation in leads I, aVL, V5, and V6. Troponin is 4.8 ng/mL. The emergency nurse should recognize this as which condition?",
    options: [
      "Diabetic ketoacidosis with electrolyte-related ECG changes",
      "Silent STEMI presenting with atypical symptoms due to diabetic neuropathy",
      "Acute pericarditis with diffuse ST elevation",
      "Stress cardiomyopathy triggered by diabetic metabolic derangement"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient is presenting with an acute lateral wall STEMI (ST elevation in I, aVL, V5, V6) with significantly elevated troponin, but his symptoms are atypical - fatigue, nausea, and dyspnea rather than classic chest pain. This is a 'silent MI' or 'atypical MI' presentation, which is particularly common in diabetic patients due to autonomic neuropathy affecting the cardiac pain fibers. Approximately 25-40% of diabetic patients with acute myocardial infarction present without chest pain, instead experiencing 'anginal equivalents' such as dyspnea, fatigue, nausea, diaphoresis, or confusion. This is critically important for emergency nurses to recognize because delayed diagnosis of STEMI in diabetic patients leads to increased morbidity and mortality. The lateral ST elevation pattern in leads I, aVL, V5, V6 indicates occlusion of the left circumflex artery or diagonal branch of the left anterior descending artery. The elevated troponin confirms myocardial injury. This patient requires the same emergent treatment as any STEMI: immediate cardiac catheterization laboratory activation, aspirin, anticoagulation, and preparation for percutaneous coronary intervention. DKA would show different ECG changes related to potassium abnormalities (peaked T waves, widened QRS). Pericarditis shows diffuse ST elevation with PR depression, not a regional pattern. Takotsubo is less likely given the regional ST elevation pattern and significantly elevated troponin.",
    learningObjective: "Recognize atypical STEMI presentation in diabetic patients who may not experience classic chest pain",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "STEMI/NSTEMI Recognition",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Absence of chest pain does not rule out STEMI, especially in diabetic patients with autonomic neuropathy",
    clinicalPearls: [
      "25-40% of diabetic MIs present without chest pain (silent MI)",
      "Anginal equivalents: dyspnea, fatigue, nausea, diaphoresis, confusion",
      "Other populations at risk for atypical MI: elderly, women, post-transplant patients",
      "Lateral STEMI (I, aVL, V5, V6) suggests left circumflex or diagonal artery occlusion"
    ],
    safetyNote: "Never rule out ACS based solely on absence of chest pain - atypical presentations are common in diabetics, elderly, and women",
    distractorRationales: [
      "DKA causes metabolic ECG changes (potassium-related) not regional ST elevation",
      "Silent STEMI in a diabetic patient best explains the regional ST elevation with atypical symptoms",
      "Pericarditis causes diffuse ST elevation with PR depression, not a regional pattern",
      "Takotsubo is less likely with this degree of troponin elevation and regional pattern"
    ],
    lessonLink: "/emergency/lessons/stemi-management"
  },
  {
    stem: "An emergency nurse is caring for a patient with acute decompensated heart failure who is receiving an IV nitroglycerin infusion at 60 mcg/min. The patient's blood pressure drops from 118/72 to 82/50 mmHg. Which action should the nurse take first?",
    options: [
      "Stop the nitroglycerin infusion immediately and lower the head of bed",
      "Reduce the nitroglycerin infusion rate by 50% and reassess in 5 minutes",
      "Administer a 500 mL normal saline bolus while continuing the infusion",
      "Switch from nitroglycerin to IV nitroprusside for more precise blood pressure control"
    ],
    correctAnswer: 0,
    rationaleLong: "When a patient receiving IV nitroglycerin develops significant hypotension (SBP drop > 30 mmHg or SBP < 90 mmHg), the immediate action is to stop the infusion completely and place the patient in a supine position with legs elevated to promote venous return. Nitroglycerin is a potent venodilator that reduces preload by pooling blood in the venous system. When blood pressure drops precipitously, this indicates excessive preload reduction and the infusion must be stopped, not merely reduced. Simply reducing the rate by 50% may not be sufficient given the degree of hypotension, and waiting 5 minutes with a critically low blood pressure risks end-organ hypoperfusion. The half-life of IV nitroglycerin is only 1-3 minutes, so stopping the infusion should result in rapid blood pressure recovery. Lowering the head of bed (Trendelenburg or supine position) promotes venous return and can help restore blood pressure quickly. Administering a 500 mL fluid bolus while continuing the infusion is inappropriate for two reasons: (1) the offending agent should be discontinued first, and (2) aggressive fluid administration in decompensated heart failure can worsen pulmonary edema. Switching to nitroprusside is contraindicated as it would provide even more vasodilation and worsen hypotension. After stopping nitroglycerin and stabilizing blood pressure, the nurse should reassess the patient's volume status and consider restarting the infusion at a lower rate once BP has recovered.",
    learningObjective: "Respond appropriately to nitroglycerin-induced hypotension by stopping the infusion and repositioning the patient",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Heart Failure Management",
    difficulty: 2,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "With significant hypotension from NTG, stop the infusion completely - don't just reduce the rate",
    clinicalPearls: [
      "IV nitroglycerin half-life is only 1-3 minutes - stopping the infusion leads to rapid BP recovery",
      "Stop NTG if SBP drops below 90 mmHg or drops more than 30 mmHg from baseline",
      "Position patient supine with legs elevated to promote venous return",
      "Once BP recovers, NTG can be restarted at 50% of the previous rate"
    ],
    safetyNote: "Severe NTG-induced hypotension can cause reflex tachycardia and myocardial ischemia - stop the infusion immediately",
    distractorRationales: [
      "Stopping the infusion and repositioning is the correct immediate action for significant hypotension",
      "Reducing by 50% is insufficient for a blood pressure this low - complete discontinuation is needed",
      "Fluid bolus in decompensated heart failure can worsen pulmonary edema",
      "Nitroprusside would worsen hypotension and is absolutely contraindicated in this scenario"
    ],
    lessonLink: "/emergency/lessons/heart-failure-management"
  },
  {
    stem: "A 28-year-old male presents after a high-speed motor vehicle collision with a steering wheel impact to the chest. He has a sternal fracture on chest X-ray. His ECG shows ST elevation in V1-V4. Troponin is 1.2 ng/mL. Which diagnosis should the emergency nurse consider?",
    options: [
      "Traumatic aortic dissection from deceleration injury",
      "Blunt cardiac injury (myocardial contusion) with anterior wall involvement",
      "Acute anterior STEMI from coronary artery dissection caused by trauma",
      "Tension pneumothorax causing ECG changes from mediastinal shift"
    ],
    correctAnswer: 1,
    rationaleLong: "In the context of blunt chest trauma with steering wheel impact and sternal fracture, the most likely diagnosis for ST elevation in V1-V4 with mildly elevated troponin is blunt cardiac injury (BCI), formerly known as myocardial contusion. BCI occurs when the heart is compressed between the sternum and spine during deceleration or direct impact, causing myocardial cell damage. The right ventricle and anterior wall of the left ventricle are most commonly affected due to their anatomic position directly behind the sternum, which explains the anterior lead ST elevation. The presence of a sternal fracture significantly increases the probability of BCI, with studies showing up to 62% of patients with sternal fractures having associated cardiac injury. The troponin elevation of 1.2 ng/mL is consistent with myocardial contusion (typically lower than acute MI levels). Management includes continuous cardiac monitoring for at least 24-48 hours (risk of arrhythmias including VT/VF), serial troponins, and echocardiography to assess wall motion abnormalities and rule out structural damage (valve injury, septal rupture, free wall rupture). While traumatic coronary artery dissection can occur, it is extremely rare. Aortic dissection from deceleration typically involves the aortic isthmus and presents differently. Tension pneumothorax would show tracheal deviation, absent breath sounds, and hemodynamic instability rather than localized ST elevation. The emergency nurse should monitor for cardiac arrhythmias and prepare for possible urgent echocardiography.",
    learningObjective: "Recognize blunt cardiac injury as a cause of ECG changes and troponin elevation after chest trauma",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Traumatic Cardiac Injury",
    difficulty: 3,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Not all ST elevation is coronary - blunt chest trauma can cause myocardial contusion mimicking STEMI",
    clinicalPearls: [
      "Sternal fracture increases probability of blunt cardiac injury to 60%+",
      "BCI patients need continuous monitoring for 24-48 hours for arrhythmia risk",
      "Right ventricle is most commonly injured due to anterior position behind sternum",
      "Echocardiography is essential to rule out structural damage (septal rupture, valve injury)"
    ],
    safetyNote: "BCI patients can develop life-threatening arrhythmias (VT/VF) up to 48 hours after injury - continuous monitoring is essential",
    distractorRationales: [
      "Traumatic aortic dissection typically involves the isthmus and presents with mediastinal widening",
      "BCI is the most likely cause of anterior ST elevation after direct sternal impact",
      "Traumatic coronary dissection is extremely rare compared to myocardial contusion",
      "Tension pneumothorax would show hemodynamic instability and respiratory distress, not localized ST elevation"
    ],
    lessonLink: "/emergency/lessons/traumatic-cardiac-injury"
  },
  {
    stem: "A 65-year-old female with end-stage renal disease presents to the ED with weakness and paresthesias. ECG shows peaked T waves, widened QRS complex, and absent P waves. Serum potassium is 7.8 mEq/L. What is the emergency nurse's first intervention?",
    options: [
      "Administer IV calcium gluconate 10% 10 mL over 2-3 minutes",
      "Administer IV regular insulin 10 units with dextrose 50% 25 grams",
      "Administer nebulized albuterol 10-20 mg for potassium shifting",
      "Prepare for emergent hemodialysis"
    ],
    correctAnswer: 0,
    rationaleLong: "Severe hyperkalemia (K+ > 7.0 mEq/L) with ECG changes (peaked T waves, widened QRS, absent P waves) is a life-threatening emergency requiring immediate intervention. The first medication administered should be IV calcium gluconate, which acts as a cardiac membrane stabilizer. Calcium does NOT lower potassium levels; instead, it raises the threshold potential of cardiac myocytes, antagonizing the toxic effects of hyperkalemia on cardiac conduction. This provides immediate cardioprotection (onset within 1-3 minutes, duration 30-60 minutes) while other therapies that actually lower potassium take effect. The ECG changes described indicate severe cardiac toxicity - the progression from peaked T waves to absent P waves to widened QRS can rapidly progress to sine wave pattern, ventricular fibrillation, and cardiac arrest. Calcium gluconate 10% is given as 10 mL (1 gram) IV over 2-3 minutes and can be repeated if ECG changes persist. After cardiac membrane stabilization, potassium-shifting agents should be administered: IV insulin (10 units regular insulin with 25g D50 to prevent hypoglycemia) shifts potassium intracellularly within 15-30 minutes. Nebulized albuterol (10-20 mg) also shifts potassium intracellularly but has a slower onset. Sodium bicarbonate may be used in acidotic patients. Kayexalate (sodium polystyrene sulfonate) removes potassium but acts too slowly for acute management. Emergent hemodialysis is the definitive treatment for removing potassium in ESRD patients but takes time to arrange and initiate.",
    learningObjective: "Prioritize calcium gluconate as the first intervention for severe hyperkalemia with ECG changes",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Electrolyte Emergencies",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Calcium gluconate does NOT lower potassium - it stabilizes the cardiac membrane while other therapies take effect",
    clinicalPearls: [
      "Hyperkalemia ECG progression: peaked T → absent P → widened QRS → sine wave → VF/asystole",
      "Calcium gluconate onset: 1-3 minutes; insulin/dextrose onset: 15-30 minutes",
      "Always give D50 with insulin to prevent treatment-induced hypoglycemia",
      "10-20 mg nebulized albuterol (10-20x the bronchospasm dose) lowers K+ by 0.5-1.5 mEq/L"
    ],
    safetyNote: "If patient is on digoxin, give calcium SLOWLY over 20-30 minutes - rapid calcium in digitalized patients can cause fatal arrhythmias",
    distractorRationales: [
      "Calcium gluconate is first because it provides immediate cardiac membrane stabilization",
      "Insulin/dextrose is second-line - it shifts potassium but takes 15-30 minutes to work",
      "Albuterol is an adjunct potassium-shifting agent but not the first intervention",
      "Hemodialysis is definitive but takes time to arrange and doesn't provide immediate cardioprotection"
    ],
    lessonLink: "/emergency/lessons/electrolyte-emergencies"
  },
  {
    stem: "A 38-year-old female with lupus presents with pleuritic chest pain that improves when sitting up and leaning forward. ECG shows diffuse ST elevation with PR depression. Bedside echo shows a small pericardial effusion. Which finding would indicate progression to cardiac tamponade?",
    options: [
      "Pericardial friction rub on auscultation",
      "Right ventricular diastolic collapse on echocardiography",
      "Low-grade fever and elevated ESR",
      "Electrical alternans without hemodynamic compromise"
    ],
    correctAnswer: 1,
    rationaleLong: "Right ventricular diastolic collapse on echocardiography is one of the earliest and most specific echocardiographic signs of cardiac tamponade, indicating that the intrapericardial pressure has exceeded the right ventricular diastolic pressure. This finding signifies the transition from a simple pericardial effusion to hemodynamically significant tamponade physiology. In cardiac tamponade, accumulating pericardial fluid compresses the cardiac chambers, impeding diastolic filling. Because the right ventricle has the lowest intrachamber pressure during diastole, it is the first chamber to be compressed. Other echocardiographic findings of tamponade include right atrial systolic collapse (earlier but less specific than RV diastolic collapse), left atrial collapse, and a dilated, non-collapsible inferior vena cava indicating elevated right atrial pressure. Clinical signs of tamponade include Beck's triad (hypotension, jugular venous distension, muffled heart sounds), pulsus paradoxus > 10 mmHg, and tachycardia. A pericardial friction rub indicates pericarditis but does not indicate tamponade - in fact, a friction rub may disappear as effusion increases because the fluid separates the pericardial layers. Low-grade fever and elevated ESR are signs of the underlying inflammatory process, not tamponade. Electrical alternans (alternating QRS amplitude) can be seen with large effusions but without hemodynamic compromise, it does not indicate tamponade. The emergency nurse should monitor for signs of hemodynamic compromise and prepare for emergent pericardiocentesis if tamponade develops.",
    learningObjective: "Identify echocardiographic signs of cardiac tamponade, specifically right ventricular diastolic collapse",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Pericardial Emergencies",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "A friction rub disappearing may actually indicate worsening effusion, not improvement",
    clinicalPearls: [
      "RV diastolic collapse is one of the earliest echo signs of tamponade",
      "Beck's triad: hypotension, JVD, muffled heart sounds (present in only 10-40% of cases)",
      "Pulsus paradoxus > 10 mmHg is a sensitive clinical sign of tamponade",
      "Tamponade is a clinical diagnosis - even small effusions can cause tamponade if fluid accumulates rapidly"
    ],
    safetyNote: "Tamponade from acute hemopericardium (trauma, aortic dissection, free wall rupture) can develop with as little as 100-200 mL of fluid",
    distractorRationales: [
      "Friction rub indicates pericarditis but may disappear as effusion worsens",
      "RV diastolic collapse is a specific echocardiographic sign of hemodynamically significant tamponade",
      "Fever and elevated ESR indicate inflammation, not tamponade",
      "Electrical alternans without hemodynamic compromise indicates large effusion but not necessarily tamponade"
    ],
    lessonLink: "/emergency/lessons/pericardial-emergencies"
  },
  {
    stem: "A 60-year-old male presents with sudden onset of a cold, pulseless right lower extremity. The leg is pale and he reports severe pain. He has a history of atrial fibrillation and stopped taking his anticoagulation 2 weeks ago. What is the time-critical intervention the emergency nurse should facilitate?",
    options: [
      "Initiate IV heparin anticoagulation and obtain urgent CT angiography",
      "Apply warm compresses to the affected extremity and elevate the leg",
      "Administer IV morphine for pain and start a nitroglycerin drip for vasodilation",
      "Prepare for emergent fasciotomy to prevent compartment syndrome"
    ],
    correctAnswer: 0,
    rationaleLong: "This patient presents with acute limb ischemia (ALI), characterized by the '6 Ps': Pain, Pallor, Pulselessness, Poikilothermia (cold), Paresthesia, and Paralysis. The most likely etiology is arterial embolism from the left atrium due to atrial fibrillation, which was unprotected after stopping anticoagulation. ALI is a vascular emergency with a 6-hour window for limb salvage before irreversible ischemia leads to tissue necrosis and potential limb loss. The immediate priority is IV heparin anticoagulation to prevent clot propagation and obtain urgent CT angiography (CTA) to locate the occlusion and plan intervention. An IV heparin bolus of 80 units/kg followed by an infusion of 18 units/kg/hour is typically initiated. CTA will define the location and extent of the occlusion, guiding the decision between catheter-directed thrombolysis, surgical thrombectomy/embolectomy, or hybrid approaches. Time is critical - prolonged ischemia beyond 6 hours leads to irreversible muscle necrosis and the development of reperfusion injury upon revascularization. Warm compresses should NOT be applied to an ischemic limb as they increase metabolic demand in tissue with inadequate blood supply. The leg should be positioned in dependent position (not elevated) to maximize gravity-assisted perfusion. Nitroglycerin will not resolve an arterial embolus. Fasciotomy may be needed later if compartment syndrome develops after revascularization, but it is not the initial intervention.",
    learningObjective: "Recognize acute limb ischemia and prioritize anticoagulation with urgent vascular imaging",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Peripheral Vascular Emergencies",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Do NOT elevate an ischemic limb - gravity-dependent positioning maximizes perfusion to the compromised tissue",
    clinicalPearls: [
      "6 Ps of acute limb ischemia: Pain, Pallor, Pulselessness, Poikilothermia, Paresthesia, Paralysis",
      "6-hour window for limb salvage in acute arterial occlusion",
      "Most common cause of acute arterial embolism is atrial fibrillation",
      "Position the ischemic limb in a dependent (lowered) position to maximize perfusion"
    ],
    safetyNote: "Never apply heat or elevate an acutely ischemic limb - heat increases metabolic demand and elevation decreases perfusion pressure",
    distractorRationales: [
      "IV heparin and CTA are correct first steps to prevent clot propagation and plan intervention",
      "Warm compresses increase metabolic demand in ischemic tissue and elevation reduces perfusion",
      "Nitroglycerin will not dissolve an arterial embolus, and pain management alone delays definitive care",
      "Fasciotomy may be needed after revascularization but is not the initial intervention"
    ],
    lessonLink: "/emergency/lessons/peripheral-vascular-emergencies"
  },
  {
    stem: "A 45-year-old male is undergoing moderate sedation with propofol for electrical cardioversion when he develops laryngospasm. SpO2 drops to 78%. What is the emergency nurse's immediate action?",
    options: [
      "Administer succinylcholine 0.5 mg/kg IV and prepare for intubation",
      "Apply positive pressure ventilation with a bag-valve mask using jaw thrust maneuver",
      "Perform emergent cricothyrotomy for surgical airway access",
      "Administer nebulized racemic epinephrine 2.25% for airway relaxation"
    ],
    correctAnswer: 1,
    rationaleLong: "Laryngospasm during procedural sedation is an airway emergency requiring immediate intervention. The first-line treatment is positive pressure ventilation (PPV) using a bag-valve mask (BVM) with jaw thrust maneuver and continuous positive airway pressure (CPAP). In the majority of cases (approximately 95%), laryngospasm can be broken with positive pressure ventilation alone. The jaw thrust maneuver is critical because it not only opens the airway but also applies pressure to the laryngospasm notch (the area behind the earlobe between the ramus of the mandible and the mastoid process), which can stimulate a vagal reflex that helps break the spasm. Applying firm, continuous positive pressure with the BVM can force air past the partially closed vocal cords and break the spasm. The nurse should also call for help, ensure suction is immediately available, and prepare rescue medications. If PPV fails to resolve the laryngospasm within 30-60 seconds, then a small dose of succinylcholine (0.1-0.5 mg/kg IV) can be administered to paralyze the vocal cords and allow ventilation. However, this is a second-line intervention because it requires intubation capability and carries its own risks. Cricothyrotomy is a last resort for 'cannot intubate, cannot oxygenate' scenarios and is far too aggressive as a first intervention. Nebulized racemic epinephrine is used for post-extubation stridor and croup, not acute laryngospasm during sedation. The emergency nurse should ensure that all procedural sedation setups include rescue airway equipment and medications.",
    learningObjective: "Manage laryngospasm during procedural sedation with positive pressure ventilation as the first intervention",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Procedural Sedation Complications",
    difficulty: 4,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "PPV with jaw thrust breaks laryngospasm in 95% of cases - don't jump to paralysis or surgical airway",
    clinicalPearls: [
      "Laryngospasm notch pressure (behind earlobe) combined with jaw thrust helps break spasm",
      "Positive pressure ventilation resolves laryngospasm in approximately 95% of cases",
      "Succinylcholine is second-line if PPV fails - use 0.1-0.5 mg/kg IV",
      "All procedural sedation setups must include rescue airway equipment"
    ],
    safetyNote: "Propofol is the most common sedative associated with laryngospasm - always have BVM, suction, and rescue medications immediately available",
    distractorRationales: [
      "Succinylcholine is second-line - try PPV first as it resolves most laryngospasm",
      "BVM with jaw thrust and positive pressure is the correct first-line intervention",
      "Cricothyrotomy is a last resort, not a first intervention for laryngospasm",
      "Racemic epinephrine is for croup/post-extubation stridor, not acute laryngospasm"
    ],
    lessonLink: "/emergency/lessons/procedural-sedation"
  },
  {
    stem: "A 73-year-old female presents with syncope and a heart rate of 34 bpm. Her ECG shows a third-degree (complete) heart block with a wide QRS escape rhythm. She is hypotensive at 78/48 mmHg. After atropine 1 mg IV fails to increase heart rate, what should the emergency nurse prepare next?",
    options: [
      "Repeat atropine 1 mg IV every 3-5 minutes up to a maximum of 3 mg",
      "Initiate transcutaneous pacing at 60-80 mA and titrate for electrical and mechanical capture",
      "Start a dopamine infusion at 5-20 mcg/kg/min for chronotropic support",
      "Administer isoproterenol 2-10 mcg/min for beta-receptor stimulation"
    ],
    correctAnswer: 1,
    rationaleLong: "In symptomatic third-degree (complete) heart block with hemodynamic instability that is unresponsive to atropine, the next intervention per ACLS guidelines is transcutaneous pacing (TCP). Third-degree heart block represents complete dissociation between atrial and ventricular conduction, meaning no atrial impulses reach the ventricles. The wide QRS escape rhythm indicates a ventricular escape focus, which is inherently unstable and unreliable. Atropine works by blocking vagal tone at the SA and AV nodes, but in complete heart block, the block is typically below the AV node (infranodal), where atropine has no effect - this is why it failed. Transcutaneous pacing provides external electrical stimulation to the ventricles, bypassing the blocked conduction system. The emergency nurse should place the pacing pads in anterior-posterior position, set the rate to 60-80 bpm, start at the minimum current output, and gradually increase until electrical capture is seen on the monitor (each pacing spike followed by a wide QRS complex). Then verify mechanical capture by checking for a pulse with each QRS complex. The current is typically set 10% above the capture threshold for a safety margin. Repeating atropine is unlikely to be effective since it already failed and complete heart block is typically infranodal. While dopamine or isoproterenol infusions can be used as temporizing measures, TCP is the more definitive and immediately available intervention. The patient will ultimately need transvenous pacing or a permanent pacemaker.",
    learningObjective: "Apply transcutaneous pacing for symptomatic complete heart block unresponsive to atropine",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Bradycardia Management",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Atropine is often ineffective in complete heart block because the block is typically infranodal",
    clinicalPearls: [
      "Atropine works on the AV node - ineffective for infranodal (complete) heart block",
      "TCP pads: anterior-posterior position for optimal current delivery",
      "Always verify both electrical capture (ECG) and mechanical capture (pulse) with TCP",
      "Set pacing current 10% above capture threshold for safety margin"
    ],
    safetyNote: "Transcutaneous pacing is painful in conscious patients - administer sedation/analgesia (fentanyl/midazolam) once pacing is initiated",
    distractorRationales: [
      "Repeating atropine is unlikely to work since complete heart block is typically infranodal",
      "TCP is the correct next step when atropine fails in symptomatic bradycardia with hemodynamic instability",
      "Dopamine infusion is an alternative but TCP is preferred as a more definitive intervention",
      "Isoproterenol can be used but carries risk of hypotension and increased myocardial oxygen demand"
    ],
    lessonLink: "/emergency/lessons/bradycardia-management"
  },
  {
    stem: "A 52-year-old male presents with chest pain and the following ECG findings: ST elevation in leads II, III, aVF, and V5-V6 with ST depression in leads I and aVL. Which coronary artery is most likely occluded?",
    options: [
      "Left anterior descending (LAD) artery",
      "Right coronary artery (RCA)",
      "Left circumflex (LCx) artery",
      "Left main coronary artery"
    ],
    correctAnswer: 2,
    rationaleLong: "The ECG pattern showing ST elevation in inferior leads (II, III, aVF) AND lateral leads (V5, V6) with reciprocal ST depression in high lateral leads (I, aVL) is most consistent with a dominant left circumflex (LCx) artery occlusion. Understanding coronary artery anatomy and ECG correlation is essential for emergency nurses. The left circumflex artery supplies the lateral and posterolateral walls of the left ventricle. In patients with a left-dominant or co-dominant circulation (approximately 15-20% of the population), the LCx also supplies the inferior wall. This explains the combined inferolateral ST elevation pattern. A right coronary artery (RCA) occlusion typically causes isolated inferior STEMI (II, III, aVF) without lateral involvement and is the most common cause of inferior MI in right-dominant circulation (80-85% of people). However, the extension to lateral leads (V5, V6) argues against isolated RCA occlusion. The LAD supplies the anterior wall and septum, producing ST elevation in V1-V4, which is not the pattern seen here. Left main occlusion typically causes widespread ST depression with ST elevation in aVR, representing diffuse subendocardial ischemia, and is usually a catastrophic presentation. The reciprocal ST depression in I and aVL confirms the inferior wall involvement and is a normal reciprocal finding. Emergency nurses should recognize that the combination of inferior and lateral ST elevation raises the probability of LCx involvement and may predict a larger area of myocardium at risk.",
    learningObjective: "Correlate ECG lead patterns with coronary artery anatomy to identify the culprit vessel in STEMI",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "STEMI/NSTEMI Recognition",
    difficulty: 4,
    cognitiveLevel: "analysis",
    questionType: "MCQ_SINGLE",
    examTrap: "Inferolateral STEMI pattern (II, III, aVF + V5, V6) suggests LCx rather than RCA occlusion",
    clinicalPearls: [
      "RCA → inferior MI (II, III, aVF) in right-dominant circulation (80-85%)",
      "LCx → lateral MI (I, aVL, V5, V6) and may include inferior if left-dominant",
      "LAD → anterior MI (V1-V4)",
      "Combined inferior + lateral pattern = likely LCx in dominant or co-dominant LCx circulation"
    ],
    safetyNote: "Always correlate ECG findings with clinical presentation - coronary anatomy varies and multiple artery involvement is possible",
    distractorRationales: [
      "LAD occlusion causes anterior ST elevation (V1-V4), not inferolateral",
      "RCA typically causes isolated inferior STEMI without lateral extension",
      "LCx occlusion explains the combined inferolateral ST elevation pattern",
      "Left main occlusion causes diffuse ST depression with aVR elevation, not this regional pattern"
    ],
    lessonLink: "/emergency/lessons/stemi-management"
  },
  {
    stem: "During rapid sequence intubation of a trauma patient, the emergency nurse notices the end-tidal CO2 (ETCO2) waveform shows a value of 8 mmHg after tube placement with no capnography waveform. Auscultation reveals breath sounds over the epigastrium. What should the nurse do immediately?",
    options: [
      "Secure the tube and obtain a chest X-ray to confirm placement",
      "Remove the endotracheal tube immediately and prepare for reattempt with direct laryngoscopy",
      "Advance the tube 2 cm deeper as it may be in the right mainstem bronchus",
      "Administer epinephrine as the low ETCO2 indicates cardiac arrest"
    ],
    correctAnswer: 1,
    rationaleLong: "An ETCO2 value of 8 mmHg with no capnography waveform and breath sounds over the epigastrium are classic indicators of esophageal intubation. This is a critical finding requiring immediate removal of the misplaced tube and reattempt of intubation. Continuous waveform capnography is the gold standard for confirming endotracheal tube placement. A properly placed ET tube should show an ETCO2 of 35-45 mmHg with a characteristic rectangular waveform. An ETCO2 near zero or very low (<10 mmHg) with no waveform strongly suggests esophageal placement. The small amount of CO2 detected (8 mmHg) may come from CO2 in the stomach from bag-valve-mask ventilation prior to intubation or from carbonated beverages. Epigastric sounds during ventilation further confirm gastric rather than tracheal placement. The tube must be removed immediately because continued ventilation through an esophageal tube will cause gastric distension, increasing aspiration risk, and the patient is not being oxygenated. Securing the tube and waiting for a chest X-ray is dangerous as it delays recognition and correction of the misplacement while the patient desaturates. Advancing the tube would push it further into the esophagus. Low ETCO2 in this context indicates tube misplacement, not cardiac arrest - cardiac arrest would show a waveform pattern with low values, not absent waveform. After removing the tube, the nurse should preoxygenate with BVM, prepare for reattempt, and consider video laryngoscopy for the second attempt.",
    learningObjective: "Use capnography and clinical assessment to identify esophageal intubation and take immediate corrective action",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Airway Management",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Low ETCO2 with no waveform after intubation = esophageal placement until proven otherwise",
    clinicalPearls: [
      "Waveform capnography is the gold standard for confirming ET tube placement",
      "Normal ETCO2: 35-45 mmHg with characteristic rectangular waveform",
      "Esophageal intubation: ETCO2 near 0, no waveform, epigastric sounds",
      "Small amounts of CO2 in esophagus may come from prior BVM ventilation or carbonated beverages"
    ],
    safetyNote: "Never rely solely on auscultation for tube confirmation - always use continuous waveform capnography",
    distractorRationales: [
      "Securing a misplaced tube and waiting for X-ray risks patient death from hypoxia",
      "Immediate tube removal and reattempt is the only safe action for esophageal intubation",
      "Advancing the tube would push it further into the esophagus",
      "Low ETCO2 without waveform indicates tube misplacement, not cardiac arrest"
    ],
    lessonLink: "/emergency/lessons/airway-management"
  },
  {
    stem: "A 67-year-old male with a history of heart failure (EF 25%) presents with an irregular heart rhythm. The monitor shows atrial fibrillation with a rapid ventricular response at 148 bpm. BP is 96/62 mmHg. Which medication should the emergency nurse question if ordered?",
    options: [
      "IV amiodarone 150 mg over 10 minutes",
      "IV diltiazem 0.25 mg/kg bolus",
      "IV digoxin 0.5 mg loading dose",
      "IV magnesium sulfate 2 grams over 20 minutes"
    ],
    correctAnswer: 1,
    rationaleLong: "The emergency nurse should question the order for IV diltiazem in this patient with severe systolic heart failure (EF 25%). Diltiazem is a non-dihydropyridine calcium channel blocker with significant negative inotropic effects, meaning it reduces the contractile force of the heart. In a patient with already severely depressed systolic function (EF 25%), diltiazem can precipitate acute decompensation, worsening heart failure, and potentially causing cardiogenic shock. This is a well-established contraindication in current guidelines. The ACC/AHA guidelines specifically recommend against the use of non-dihydropyridine calcium channel blockers (diltiazem and verapamil) in patients with heart failure with reduced ejection fraction (HFrEF). Amiodarone is actually the preferred rate-control agent for atrial fibrillation in patients with heart failure because it has minimal negative inotropic effects and is safe to use even with severely reduced EF. It can provide both rate and rhythm control. IV digoxin can be used for rate control in heart failure patients as it has mild positive inotropic effects and slows AV nodal conduction without reducing contractility. IV magnesium is often used as an adjunct for rate control and can help prevent arrhythmias. For this patient, the appropriate approach would be IV amiodarone for rate control, with consideration for synchronized cardioversion if the patient becomes hemodynamically unstable. The emergency nurse plays a critical role as a safety net by questioning medications that are contraindicated based on the patient's underlying condition.",
    learningObjective: "Identify diltiazem as contraindicated in heart failure with reduced ejection fraction due to negative inotropic effects",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Heart Failure Management",
    difficulty: 4,
    cognitiveLevel: "evaluation",
    questionType: "MCQ_SINGLE",
    examTrap: "Diltiazem and verapamil are contraindicated in HFrEF - use amiodarone or digoxin for rate control instead",
    clinicalPearls: [
      "Non-dihydropyridine CCBs (diltiazem, verapamil) are contraindicated in HFrEF",
      "Amiodarone is the preferred antiarrhythmic in heart failure (minimal negative inotropy)",
      "Digoxin provides rate control with mild positive inotropic effects in heart failure",
      "Consider cardioversion for hemodynamically unstable atrial fibrillation regardless of EF"
    ],
    safetyNote: "Diltiazem in severe systolic heart failure can cause acute decompensation, cardiogenic shock, and death",
    distractorRationales: [
      "Amiodarone is safe and preferred for rate control in heart failure with reduced EF",
      "Diltiazem should be questioned due to its dangerous negative inotropic effects in HFrEF",
      "Digoxin is safe for rate control in heart failure and has mild positive inotropic effects",
      "Magnesium is safe as an adjunct and may help with rate control"
    ],
    lessonLink: "/emergency/lessons/heart-failure-management"
  },
  {
    stem: "A 44-year-old female presents with severe hypertension (BP 242/138 mmHg), headache, blurred vision, and new-onset confusion. Fundoscopic exam reveals papilledema and retinal hemorrhages. Serum creatinine is elevated at 2.8 mg/dL. Which antihypertensive should the emergency nurse prepare for initial blood pressure reduction?",
    options: [
      "Oral captopril 25 mg for gradual blood pressure reduction",
      "IV nicardipine infusion starting at 5 mg/hour",
      "IV labetalol 20 mg bolus",
      "Sublingual nifedipine 10 mg for rapid blood pressure lowering"
    ],
    correctAnswer: 1,
    rationaleLong: "This patient presents with a hypertensive emergency characterized by severe hypertension with acute end-organ damage: encephalopathy (headache, confusion), retinopathy (papilledema, retinal hemorrhages), and nephropathy (elevated creatinine). Hypertensive emergency requires controlled reduction of blood pressure using IV antihypertensive agents in an ICU setting. IV nicardipine is an excellent first-line choice for hypertensive emergency because it provides smooth, titratable blood pressure reduction with a rapid onset of action (5-15 minutes). It is a dihydropyridine calcium channel blocker that does not have significant negative inotropic effects (unlike diltiazem or verapamil). The infusion is started at 5 mg/hour and can be titrated up by 2.5 mg/hour every 5-15 minutes to a maximum of 15 mg/hour. The target is to reduce MAP by no more than 25% in the first hour, then gradually to 160/100 mmHg over the next 2-6 hours. Rapid or excessive blood pressure reduction can cause cerebral hypoperfusion, watershed infarcts, and acute kidney injury. Oral captopril is inappropriate because hypertensive emergencies require IV medications for precise titration. IV labetalol is also a reasonable first-line agent but nicardipine is preferred when precise titration is needed. Sublingual nifedipine is absolutely contraindicated in hypertensive emergencies because it causes unpredictable, precipitous blood pressure drops that can trigger stroke, MI, or death. It has been removed from formularies for this indication.",
    learningObjective: "Select appropriate IV antihypertensive therapy for hypertensive emergency with end-organ damage",
    blueprintCategory: "Cardiac Emergencies",
    subtopic: "Hypertensive Emergencies",
    difficulty: 3,
    cognitiveLevel: "application",
    questionType: "MCQ_SINGLE",
    examTrap: "Sublingual nifedipine is absolutely contraindicated in hypertensive emergency due to unpredictable BP drops",
    clinicalPearls: [
      "Hypertensive emergency = severe HTN + acute end-organ damage (brain, heart, kidneys, eyes)",
      "Target: reduce MAP by no more than 25% in first hour",
      "IV nicardipine and clevidipine are preferred for precise, titratable BP reduction",
      "Avoid rapid BP reduction - can cause watershed infarcts and worsen renal function"
    ],
    safetyNote: "Sublingual nifedipine has been banned for hypertensive emergencies due to fatal unpredictable hypotension, stroke, and MI",
    distractorRationales: [
      "Oral medications do not provide the precise titration needed for hypertensive emergency",
      "IV nicardipine provides smooth, titratable blood pressure reduction with rapid onset",
      "IV labetalol is reasonable but nicardipine is preferred for precise titration",
      "Sublingual nifedipine is absolutely contraindicated due to unpredictable BP drops"
    ],
    lessonLink: "/emergency/lessons/hypertensive-emergencies"
  }
];
