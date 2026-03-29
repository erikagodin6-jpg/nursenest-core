import type { LessonContent } from "./types";

export const rnArrhythmiasExpansionLessons: Record<string, LessonContent> = {
  "atrial-fibrillation-expanded-rn": {
    title: "Atrial Fibrillation (AFib) — Expanded RN",
    cellular: {
      title: "Pathophysiology & Mechanism",
      content:
        "Atrial fibrillation is the most common sustained cardiac arrhythmia. It is caused by chaotic, disorganized electrical activity originating from multiple ectopic foci and wavelets of re-entry in the atrial myocardium. This results in rapid, irregular atrial depolarization at rates of 350–600 impulses per minute. Because the AV node cannot conduct all impulses, ventricular response is irregularly irregular, typically 100–180 bpm if untreated. Atrial remodeling (electrical and structural) perpetuates AFib: sustained rapid atrial rates shorten the atrial refractory period and promote fibrosis, making spontaneous conversion less likely over time — 'AFib begets AFib.' Loss of organized atrial contraction eliminates the atrial kick, reducing cardiac output by 15–25%. Blood stasis in the left atrial appendage creates a high-risk environment for thrombus formation. Stroke risk is assessed using the CHA₂DS₂-VASc score: Congestive heart failure (1), Hypertension (1), Age ≥75 (2), Diabetes (1), Stroke/TIA/thromboembolism history (2), Vascular disease (1), Age 65–74 (1), Sex category female (1). A score ≥2 in males or ≥3 in females generally warrants anticoagulation. AFib is classified as paroxysmal (self-terminating within 7 days), persistent (lasting >7 days, requires intervention to terminate), long-standing persistent (>12 months), or permanent (accepted, rhythm control abandoned)."
    },
    riskFactors: [
      "Hypertension — most common modifiable risk factor",
      "Valvular heart disease (especially mitral stenosis and regurgitation)",
      "Heart failure with reduced or preserved ejection fraction",
      "Age >65 years — prevalence increases with age",
      "Obesity and obstructive sleep apnea",
      "Hyperthyroidism and thyrotoxicosis",
      "Excessive alcohol consumption ('holiday heart syndrome')",
      "Post-cardiac surgery (CABG, valve replacement)",
      "Chronic kidney disease",
      "Pulmonary embolism and chronic lung disease"
    ],
    diagnostics: [
      "12-lead ECG: absent discrete P waves replaced by fibrillatory baseline, irregularly irregular R-R intervals, narrow QRS (unless aberrant conduction)",
      "Holter or event monitor for paroxysmal AFib detection",
      "Echocardiogram: assess left atrial size, valvular disease, ejection fraction",
      "Transesophageal echo (TEE) before cardioversion to rule out left atrial appendage thrombus",
      "TSH to rule out hyperthyroidism as reversible cause",
      "BMP for electrolyte abnormalities (K+, Mg2+)",
      "CBC to assess for anemia or infection",
      "BNP/NT-proBNP if heart failure suspected",
      "CHA₂DS₂-VASc score calculation for stroke risk stratification",
      "HAS-BLED score for bleeding risk assessment before anticoagulation"
    ],
    management: [
      "Rate control strategy: target resting HR <110 bpm (lenient) or <80 bpm (strict) using beta-blockers (metoprolol), calcium channel blockers (diltiazem), or digoxin",
      "Rhythm control strategy: antiarrhythmic drugs (amiodarone, flecainide, sotalol) to restore and maintain sinus rhythm",
      "Electrical cardioversion: synchronized shock for hemodynamically unstable AFib or elective after ≥3 weeks therapeutic anticoagulation or TEE-confirmed no thrombus",
      "Catheter ablation (pulmonary vein isolation) for drug-refractory symptomatic AFib",
      "Anticoagulation based on CHA₂DS₂-VASc score: DOACs preferred (apixaban, rivaroxaban, dabigatran, edoxaban) over warfarin for non-valvular AFib",
      "Left atrial appendage closure (Watchman device) for patients who cannot tolerate long-term anticoagulation",
      "Address reversible causes: thyroid disease, electrolyte correction, alcohol cessation, sleep apnea treatment",
      "Post-cardioversion: continue anticoagulation for at least 4 weeks regardless of apparent rhythm restoration"
    ],
    nursingActions: [
      "Assess apical pulse for one full minute — document rate AND rhythm irregularity",
      "Compare apical to radial pulse (pulse deficit indicates ineffective contractions)",
      "Monitor continuous telemetry: set alarms for rate thresholds and rhythm changes",
      "Administer rate-control medications as ordered; hold for HR <60 or SBP <90",
      "Assess for signs of decreased cardiac output: hypotension, dizziness, fatigue, dyspnea, altered mental status",
      "Monitor for stroke symptoms: FAST (Face drooping, Arm weakness, Speech difficulty, Time to call 911)",
      "Verify INR 2.0–3.0 for patients on warfarin; no routine monitoring needed for DOACs",
      "Educate on medication adherence — missed DOAC doses increase stroke risk",
      "Assess for bleeding: gums, bruising, hematuria, melena, hematemesis",
      "Pre-cardioversion: verify informed consent, NPO status, IV access, resuscitation equipment at bedside",
      "Post-cardioversion: monitor rhythm, vital signs q15min x4, assess skin at paddle sites"
    ],
    assessmentFindings: [
      "Irregularly irregular pulse — hallmark finding",
      "Pulse deficit (apical rate > radial rate)",
      "Palpitations — sensation of fluttering or racing heart",
      "Dyspnea on exertion or at rest",
      "Fatigue and exercise intolerance",
      "Dizziness or lightheadedness",
      "Chest discomfort or pressure",
      "Syncope or near-syncope (especially with rapid ventricular response)",
      "Signs of heart failure exacerbation: JVD, peripheral edema, crackles",
      "Some patients are completely asymptomatic (incidental finding)"
    ],
    signs: {
      left: [
        "Irregularly irregular rhythm on ECG",
        "Absent P waves — fibrillatory baseline",
        "Narrow QRS unless bundle branch block coexists",
        "Variable R-R intervals",
        "Rapid ventricular response (RVR) if rate >100 bpm",
        "Pulse deficit on simultaneous apical-radial assessment"
      ],
      right: [
        "New-onset neurological deficits suggest embolic stroke",
        "Acute limb pain/pallor may indicate peripheral arterial embolism",
        "Hemodynamic instability requires immediate intervention",
        "Tachycardia-mediated cardiomyopathy with prolonged uncontrolled rates",
        "Mesenteric ischemia from arterial embolism",
        "Silent AFib detected only on routine screening"
      ]
    },
    medications: [
      { name: "Metoprolol (Lopressor)", type: "Beta-Blocker", action: "Slows AV node conduction and reduces ventricular rate", sideEffects: "Bradycardia, hypotension, fatigue, bronchospasm", contra: "Decompensated HF, severe bradycardia, 2nd/3rd degree heart block, asthma", pearl: "First-line rate control. Hold if HR <60 or SBP <90. Do not stop abruptly — taper to prevent rebound tachycardia." },
      { name: "Diltiazem (Cardizem)", type: "Calcium Channel Blocker", action: "Slows conduction through the AV node to control ventricular rate", sideEffects: "Hypotension, bradycardia, peripheral edema, constipation", contra: "HFrEF (EF <40%), severe hypotension, sick sinus syndrome, concurrent IV beta-blocker", pearl: "Preferred in patients with COPD/asthma where beta-blockers are contraindicated. IV bolus then drip for acute RVR." },
      { name: "Amiodarone (Cordarone)", type: "Class III Antiarrhythmic", action: "Prolongs action potential and refractory period in all cardiac tissues; blocks Na+, K+, Ca2+ channels and beta receptors", sideEffects: "Pulmonary toxicity, thyroid dysfunction (hypo/hyper), hepatotoxicity, corneal microdeposits, photosensitivity, blue-gray skin", contra: "Severe sinus node dysfunction, 2nd/3rd degree block without pacemaker, cardiogenic shock", pearl: "Most effective antiarrhythmic but serious long-term toxicities. Monitor PFTs, TFTs, LFTs, and ophthalmologic exams. IV form can cause phlebitis — use central line or large-bore IV." },
      { name: "Apixaban (Eliquis)", type: "Direct Oral Anticoagulant (DOAC) — Factor Xa Inhibitor", action: "Directly inhibits Factor Xa, preventing thrombin generation and clot formation", sideEffects: "Bleeding, bruising, anemia", contra: "Active pathological bleeding, prosthetic heart valves, severe hepatic impairment", pearl: "Preferred DOAC for non-valvular AFib — lowest bleeding risk in trials. No routine monitoring. Reversal agent: andexanet alfa. Must take BID — adherence critical." },
      { name: "Warfarin (Coumadin)", type: "Vitamin K Antagonist", action: "Inhibits vitamin K-dependent clotting factors (II, VII, IX, X)", sideEffects: "Bleeding, skin necrosis (rare), teratogenic", contra: "Pregnancy, active bleeding, recent surgery", pearl: "Target INR 2.0–3.0 for AFib. Extensive drug and food interactions. Monitor INR regularly. Bridge with heparin when initiating. Reversal: vitamin K, FFP, PCC." },
      { name: "Digoxin (Lanoxin)", type: "Cardiac Glycoside", action: "Increases vagal tone to slow AV node conduction; mild positive inotrope", sideEffects: "Toxicity (nausea, vision changes, bradycardia, dysrhythmias), hypokalemia potentiates toxicity", contra: "Hypokalemia, hypercalcemia, hypomagnesemia, renal impairment (dose adjust)", pearl: "Used adjunctively for rate control in HF patients. Narrow therapeutic index (0.5–2.0 ng/mL). Monitor K+ closely — hypokalemia increases toxicity risk. Signs of toxicity: visual halos, N/V, bradycardia." }
    ],
    pearls: [
      "AFib is the #1 cardiac cause of embolic stroke — always assess stroke risk",
      "CHA₂DS₂-VASc ≥2 (males) or ≥3 (females) = anticoagulation recommended",
      "Irregularly irregular rhythm with absent P waves = AFib until proven otherwise",
      "Rate vs rhythm control: rate control is first-line for most patients; rhythm control preferred if symptomatic, young, or new-onset",
      "New-onset AFib: always check TSH to rule out thyroid storm or hyperthyroidism",
      "Cardioversion rule of 48 hours: if AFib duration >48 hours or unknown, anticoagulate ≥3 weeks before elective cardioversion OR rule out thrombus with TEE",
      "Pulse deficit = the difference between apical and radial rate; a wide deficit indicates many ineffective contractions",
      "Tachycardia-mediated cardiomyopathy: uncontrolled AFib with RVR can cause reversible heart failure",
      "Holiday heart: AFib triggered by binge alcohol consumption in otherwise healthy individuals",
      "NCLEX priority: unstable AFib (hypotension, chest pain, AMS) → immediate synchronized cardioversion"
    ],
    quiz: [
      { question: "What is the hallmark ECG finding in atrial fibrillation?", options: ["Sawtooth pattern", "Irregularly irregular rhythm with absent P waves", "Peaked T waves", "ST elevation in contiguous leads"], correct: 1, rationale: "AFib produces chaotic atrial activity resulting in an irregularly irregular rhythm with no identifiable P waves — the fibrillatory baseline replaces organized P waves." },
      { question: "A patient with AFib has a CHA₂DS₂-VASc score of 3. What intervention does this indicate?", options: ["Aspirin only", "No anticoagulation needed", "Oral anticoagulation is recommended", "Immediate cardioversion"], correct: 2, rationale: "A CHA₂DS₂-VASc score ≥2 in males or ≥3 in females indicates significant stroke risk and oral anticoagulation is recommended, preferably with a DOAC." },
      { question: "Before elective cardioversion for AFib of unknown duration, the nurse should verify:", options: ["The patient has been on anticoagulation for at least 3 weeks OR TEE shows no thrombus", "The patient's potassium is above 5.5 mEq/L", "The patient is in sinus rhythm", "The patient has eaten a full meal"], correct: 0, rationale: "If AFib has lasted >48 hours or duration is unknown, 3 weeks of therapeutic anticoagulation or a TEE ruling out LAA thrombus is required before cardioversion to prevent embolic stroke." },
      { question: "Which medication is contraindicated for rate control in AFib with HFrEF (EF <40%)?", options: ["Metoprolol", "Digoxin", "Diltiazem", "Amiodarone"], correct: 2, rationale: "Non-dihydropyridine calcium channel blockers (diltiazem, verapamil) have negative inotropic effects and are contraindicated in heart failure with reduced ejection fraction." },
      { question: "A nurse assesses an apical rate of 122 and a radial rate of 96 in a patient with AFib. This finding is called:", options: ["Pulsus paradoxus", "Pulse pressure", "Pulse deficit", "Pulsus alternans"], correct: 2, rationale: "Pulse deficit is the difference between apical and radial pulse rates. In AFib, some contractions are too weak to generate a palpable peripheral pulse, causing the radial rate to be lower than the apical rate." },
      { question: "Which reversible cause of new-onset AFib must always be ruled out?", options: ["Diabetes mellitus", "Hyperthyroidism", "Chronic kidney disease", "Osteoporosis"], correct: 1, rationale: "Hyperthyroidism is a well-known reversible cause of AFib. TSH should be checked in all new-onset AFib patients. Treating the thyroid condition may resolve the arrhythmia." },
      { question: "A patient on warfarin for AFib has an INR of 4.8 with no active bleeding. The nurse should anticipate:", options: ["Administer protamine sulfate", "Hold warfarin and administer oral vitamin K", "Continue current dose", "Give fresh frozen plasma immediately"], correct: 1, rationale: "An INR of 4.8 is supratherapeutic and increases bleeding risk. Without active bleeding, the appropriate action is to hold warfarin and administer oral vitamin K to lower the INR to the therapeutic range of 2.0–3.0." },
      { question: "What is 'holiday heart syndrome'?", options: ["Heart failure exacerbation during winter holidays", "AFib triggered by binge alcohol consumption", "Cardiac arrest during physical exertion", "Stress cardiomyopathy from emotional events"], correct: 1, rationale: "Holiday heart syndrome refers to new-onset AFib associated with acute alcohol binge in an otherwise healthy person. It often self-terminates with alcohol cessation and supportive care." }
    ]
  },

  "atrial-flutter-expanded-rn": {
    title: "Atrial Flutter — Expanded RN",
    cellular: {
      title: "Pathophysiology & Mechanism",
      content:
        "Atrial flutter is a macro-reentrant circuit arrhythmia, most commonly involving a counterclockwise loop through the cavotricuspid isthmus (CTI) in the right atrium — termed typical or CTI-dependent flutter. The atrial rate is characteristically regular at 250–350 bpm (most commonly ~300 bpm). Because the AV node cannot conduct all impulses, a fixed or variable conduction ratio occurs: 2:1 block is most common (ventricular rate ~150 bpm), but 3:1, 4:1, or variable block can occur. The sawtooth or 'picket fence' flutter waves (F waves) are best seen in leads II, III, aVF, and V1. Unlike AFib, atrial flutter involves a single organized circuit rather than chaotic multifocal activity. Atypical flutter involves circuits outside the CTI (left atrium, scarred tissue from prior ablation or surgery) and may not display classic sawtooth morphology. Atrial flutter often coexists with or degenerates into AFib. The organized atrial contraction in flutter is mechanically ineffective due to the rapid rate, and similar to AFib, stasis in the left atrial appendage can occur — stroke risk and anticoagulation guidelines parallel those for AFib."
    },
    riskFactors: [
      "Structural heart disease (valvular, cardiomyopathy)",
      "Prior cardiac surgery or ablation (atrial scarring)",
      "COPD and pulmonary hypertension",
      "Hypertension",
      "Heart failure",
      "Obesity",
      "Hyperthyroidism",
      "Acute illness (sepsis, PE, post-operative)",
      "Advanced age",
      "History of AFib — frequently coexists"
    ],
    diagnostics: [
      "12-lead ECG: classic sawtooth flutter waves (F waves) at ~300/min, best in II, III, aVF",
      "Ventricular rate typically ~150 bpm with 2:1 block — always consider flutter when rate is ~150",
      "Adenosine can unmask flutter waves by transiently slowing AV conduction (diagnostic, not therapeutic)",
      "Echocardiogram to assess cardiac structure and function",
      "TEE before cardioversion if duration >48 hours or unknown",
      "TSH to rule out thyroid dysfunction",
      "Electrolyte panel (K+, Mg2+)"
    ],
    management: [
      "Rate control with beta-blockers or calcium channel blockers (same agents as AFib)",
      "Electrical cardioversion: highly effective, often at lower energy (50–100J biphasic) than AFib",
      "Catheter ablation of the cavotricuspid isthmus — first-line definitive treatment for typical flutter with >90% success rate",
      "Ibutilide (IV) for pharmacologic cardioversion — monitor for QT prolongation and torsades de pointes",
      "Anticoagulation guidelines same as AFib based on CHA₂DS₂-VASc score",
      "Rhythm control antiarrhythmics less effective for flutter than AFib; ablation preferred",
      "Avoid class IC agents (flecainide, propafenone) without concurrent AV nodal blockade — risk of 1:1 conduction"
    ],
    nursingActions: [
      "Recognize sawtooth pattern — if ventricular rate is ~150, suspect 2:1 flutter",
      "Administer adenosine as ordered to unmask flutter waves — warn patient of transient chest tightness and flushing",
      "Monitor for hemodynamic instability: hypotension, chest pain, altered LOC",
      "Post-ablation care: monitor groin access site for bleeding/hematoma, maintain bed rest per protocol, monitor rhythm",
      "Pre-cardioversion checklist: consent, NPO, IV access, defibrillator in SYNC mode, sedation ready",
      "Assess for stroke symptoms as with AFib",
      "Document rate AND rhythm with conduction ratio (e.g., 'atrial flutter with 3:1 block, ventricular rate 100')",
      "Monitor for ibutilide side effects: QT prolongation, torsades — keep IV magnesium available"
    ],
    assessmentFindings: [
      "Palpitations — regular or regularly irregular",
      "Dyspnea and exercise intolerance",
      "Dizziness or lightheadedness",
      "Fatigue",
      "Chest pressure or discomfort",
      "Syncope with rapid ventricular response",
      "JVD with rapid regular flutter waves visible in neck veins",
      "Some patients asymptomatic at controlled rates"
    ],
    signs: {
      left: [
        "Sawtooth flutter waves (F waves) in leads II, III, aVF",
        "Atrial rate ~300 bpm",
        "Regular ventricular rate ~150 bpm (2:1 block)",
        "Narrow QRS unless aberrant conduction",
        "Flutter waves may be hidden in QRS or T wave at 2:1",
        "Adenosine transiently reveals underlying flutter waves"
      ],
      right: [
        "Variable block produces irregular ventricular response",
        "1:1 conduction (rate ~300) is a medical emergency",
        "Hemodynamic compromise requires immediate cardioversion",
        "Coexisting AFib episodes are common",
        "Atypical flutter may lack classic sawtooth pattern",
        "Post-ablation recurrence requires re-evaluation"
      ]
    },
    medications: [
      { name: "Metoprolol (Lopressor)", type: "Beta-Blocker", action: "Slows AV node conduction to reduce ventricular rate", sideEffects: "Bradycardia, hypotension, fatigue", contra: "Severe bradycardia, decompensated HF, asthma", pearl: "First-line rate control. Must achieve AV nodal blockade before giving class IC antiarrhythmics to prevent dangerous 1:1 conduction." },
      { name: "Diltiazem (Cardizem)", type: "Non-dihydropyridine CCB", action: "Slows AV conduction for rate control", sideEffects: "Hypotension, bradycardia, constipation", contra: "HFrEF, concurrent IV beta-blocker, severe hypotension", pearl: "IV drip effective for acute rate control. Alternative to beta-blockers in patients with reactive airway disease." },
      { name: "Ibutilide (Corvert)", type: "Class III Antiarrhythmic", action: "Prolongs atrial action potential duration to terminate flutter circuit", sideEffects: "QT prolongation, torsades de pointes (2–4% risk), hypotension", contra: "Baseline QTc >440 ms, hypokalemia, hypomagnesemia", pearl: "IV only, for pharmacologic cardioversion of flutter. Must monitor on telemetry for ≥4 hours after infusion. Have IV magnesium and defibrillator immediately available." },
      { name: "Adenosine (Adenocard)", type: "AV Nodal Blocker (diagnostic use)", action: "Transiently blocks AV node conduction to unmask atrial activity", sideEffects: "Transient asystole, chest tightness, flushing, dyspnea (all brief)", contra: "2nd/3rd degree block, sick sinus syndrome, bronchospasm", pearl: "Diagnostic tool for flutter — does not convert flutter. Give rapid IV push followed by immediate saline flush. Warn patient about brief sensation of impending doom. Half-life <10 seconds." }
    ],
    pearls: [
      "Ventricular rate of ~150 bpm = think atrial flutter with 2:1 block until proven otherwise",
      "Sawtooth F waves best seen in leads II, III, aVF — may be hidden at 2:1 conduction",
      "Adenosine is diagnostic (unmasks flutter), not therapeutic — it will not convert flutter to sinus",
      "CTI ablation is the definitive treatment for typical flutter with >90% success and low recurrence",
      "Anticoagulation for flutter follows AFib guidelines — same stroke risk stratification",
      "1:1 conduction (ventricular rate ~300) is life-threatening — occurs with class IC drugs without AV nodal blockade",
      "Flutter and AFib frequently coexist — treat for both and evaluate for AFib after flutter ablation",
      "NCLEX key: synchronized cardioversion for unstable flutter; defibrillation is for pulseless rhythms only"
    ],
    quiz: [
      { question: "What is the classic ECG pattern of atrial flutter?", options: ["Irregularly irregular with absent P waves", "Sawtooth flutter waves at approximately 300 bpm", "Wide bizarre QRS complexes", "Tall peaked T waves"], correct: 1, rationale: "Atrial flutter produces a characteristic sawtooth or 'picket fence' pattern of flutter (F) waves at approximately 300 bpm, best seen in leads II, III, aVF." },
      { question: "A patient's ventricular rate is approximately 150 bpm with a regular rhythm. The nurse should suspect:", options: ["Sinus tachycardia", "Atrial flutter with 2:1 block", "Ventricular tachycardia", "Third-degree heart block"], correct: 1, rationale: "A regular ventricular rate of ~150 bpm is highly suspicious for atrial flutter with 2:1 AV conduction (atrial rate ~300 ÷ 2 = ~150 ventricular rate)." },
      { question: "What is the purpose of administering adenosine to a patient with suspected atrial flutter?", options: ["Convert flutter to sinus rhythm", "Slow the ventricular rate permanently", "Unmask hidden flutter waves by transiently blocking AV conduction", "Prevent thrombus formation"], correct: 2, rationale: "Adenosine transiently blocks AV node conduction, revealing the underlying flutter waves that may be hidden within QRS complexes or T waves. It is diagnostic, not therapeutic, for flutter." },
      { question: "What is the first-line definitive treatment for typical atrial flutter?", options: ["Lifelong amiodarone", "Catheter ablation of the cavotricuspid isthmus", "Permanent pacemaker", "AV node ablation"], correct: 1, rationale: "Catheter ablation of the cavotricuspid isthmus (CTI) is the definitive treatment for typical flutter with success rates >90% and is considered first-line over long-term antiarrhythmic drugs." },
      { question: "Why must AV nodal blocking agents be given before class IC antiarrhythmics in atrial flutter?", options: ["To increase the atrial rate", "To prevent dangerous 1:1 AV conduction causing ventricular rates of ~300 bpm", "To reduce bleeding risk", "To enhance drug absorption"], correct: 1, rationale: "Class IC drugs (flecainide, propafenone) can slow the atrial flutter rate enough to allow 1:1 AV conduction, producing a ventricular rate of ~300 bpm that can cause hemodynamic collapse. AV nodal blockers prevent this." },
      { question: "Appropriate energy for synchronized cardioversion of atrial flutter is:", options: ["360 joules", "200 joules", "50–100 joules biphasic", "1 joule"], correct: 2, rationale: "Atrial flutter often converts with lower energy than AFib. Starting at 50–100 joules biphasic is typical. Always use synchronized mode." }
    ]
  },

  "svt-expanded-rn": {
    title: "Supraventricular Tachycardia (SVT) — Expanded RN",
    cellular: {
      title: "Pathophysiology & Mechanism",
      content:
        "Supraventricular tachycardia (SVT) is a broad term for tachyarrhythmias originating above the bundle of His, but clinically it most often refers to paroxysmal SVT (PSVT) — a regular, narrow-complex tachycardia with sudden onset and termination. The two most common mechanisms are: (1) AV Nodal Reentrant Tachycardia (AVNRT, ~60% of PSVT) — involves dual AV nodal pathways (fast and slow) creating a micro-reentry circuit within or near the AV node. Typically, the impulse travels antegrade down the slow pathway and retrograde up the fast pathway, producing a narrow QRS with P waves buried in or just after the QRS (short RP tachycardia). (2) AV Reciprocating Tachycardia (AVRT, ~30%) — involves an accessory pathway (bypass tract) connecting atria and ventricles outside the AV node. In orthodromic AVRT, the impulse travels antegrade through the AV node and retrograde through the accessory pathway, producing a narrow QRS. In antidromic AVRT, the direction reverses, producing a wide QRS that mimics ventricular tachycardia. Wolff-Parkinson-White (WPW) syndrome is the most recognized accessory pathway condition, characterized by a delta wave, short PR interval, and wide QRS on baseline ECG. Rates in SVT are typically 150–250 bpm, regular, with abrupt onset and offset. The rapid rate reduces diastolic filling time and may compromise cardiac output."
    },
    riskFactors: [
      "Congenital accessory pathways (WPW syndrome)",
      "Female sex — AVNRT more common in women",
      "Young adults — SVT is common in healthy young patients",
      "Caffeine, alcohol, stimulant use (triggers, not causes)",
      "Stress and anxiety",
      "Pregnancy — increased blood volume and hormonal changes",
      "Hyperthyroidism",
      "Structural heart disease (less common trigger)",
      "Electrolyte imbalances",
      "Digitalis toxicity"
    ],
    diagnostics: [
      "12-lead ECG during episode: regular narrow-complex tachycardia, rate 150–250 bpm",
      "P waves often absent or buried in QRS (AVNRT) or visible after QRS (AVRT)",
      "Baseline ECG in WPW: short PR (<0.12 sec), delta wave, wide QRS",
      "Adenosine administration: terminates AVNRT/AVRT by blocking AV node; helps differentiate from other SVTs",
      "Holter monitor or event recorder for paroxysmal episodes",
      "Electrophysiology (EP) study for definitive diagnosis and mapping of pathways",
      "Echocardiogram to rule out structural disease",
      "TSH, electrolytes, drug levels if applicable"
    ],
    management: [
      "Vagal maneuvers — first-line intervention: Valsalva maneuver (bear down for 15 seconds), carotid sinus massage (contraindicated if carotid bruit), cold water immersion of face (diving reflex), coughing",
      "Adenosine 6 mg rapid IV push (1–2 seconds) → if ineffective, 12 mg → may repeat 12 mg once; must flush immediately with 20 mL NS using two-syringe technique; give through proximal IV port",
      "If adenosine fails: IV diltiazem, IV beta-blocker, or IV amiodarone",
      "Synchronized cardioversion for hemodynamically unstable SVT (50–100J)",
      "Catheter ablation: definitive treatment for recurrent AVNRT or AVRT; success rates >95%",
      "WPW with AFib: AVOID AV nodal blockers (adenosine, diltiazem, digoxin, beta-blockers) — risk of direct conduction through accessory pathway causing VFib → use procainamide or cardioversion",
      "Oral prophylaxis for recurrent episodes: beta-blockers, calcium channel blockers, or flecainide"
    ],
    nursingActions: [
      "Assess hemodynamic stability immediately: LOC, BP, chest pain, respiratory status",
      "Obtain 12-lead ECG during the episode if possible — rhythm may revert before documentation",
      "Teach and assist with vagal maneuvers before pharmacologic intervention",
      "Adenosine administration: use large-bore proximal IV, rapid push with immediate NS flush (two-syringe technique), warn patient about transient chest tightness and feeling of impending doom; have defibrillator at bedside",
      "Record continuous rhythm strip during adenosine administration to capture response",
      "Monitor for post-conversion pauses — brief asystole is expected and self-resolving",
      "Assess for WPW on baseline ECG — short PR, delta wave, wide QRS; alert provider if present",
      "Post-ablation care: monitor access site, rhythm, vital signs; restrict ambulation per protocol",
      "Educate patient on recognizing symptoms and performing vagal maneuvers at home",
      "Document the episode: onset time, symptoms, duration, interventions, and response"
    ],
    assessmentFindings: [
      "Sudden onset of rapid heart rate ('like a switch flipped on')",
      "Palpitations — regular and rapid",
      "Lightheadedness or dizziness",
      "Chest tightness or pressure",
      "Dyspnea",
      "Anxiety and diaphoresis",
      "Polyuria after episode (release of atrial natriuretic peptide from atrial stretch)",
      "Syncope or near-syncope",
      "Abrupt termination ('feels like the heart suddenly stops racing')"
    ],
    signs: {
      left: [
        "Regular narrow-complex tachycardia at 150–250 bpm",
        "P waves absent or buried in QRS (AVNRT)",
        "P waves visible after QRS (AVRT)",
        "Abrupt onset and termination",
        "QRS <0.12 sec (narrow) in orthodromic conduction",
        "Terminates with adenosine or vagal maneuvers"
      ],
      right: [
        "Wide QRS in antidromic AVRT mimics VTach",
        "WPW baseline: delta wave, short PR, wide QRS",
        "WPW + AFib: irregular wide complex = avoid AV nodal blockers",
        "Hemodynamic instability requires immediate cardioversion",
        "Post-conversion pauses are expected and transient",
        "Persistent tachycardia despite adenosine → reconsider diagnosis"
      ]
    },
    medications: [
      { name: "Adenosine (Adenocard)", type: "Endogenous Nucleoside", action: "Transiently blocks AV node conduction to terminate reentrant circuits dependent on the AV node", sideEffects: "Transient asystole (expected), chest tightness, flushing, dyspnea, feeling of impending doom — all lasting <30 seconds", contra: "2nd/3rd degree block, sick sinus syndrome, severe asthma/COPD (relative), WPW with AFib", pearl: "Drug of choice for stable regular narrow-complex tachycardia. Half-life <10 seconds. MUST be given rapid IV push with immediate 20 mL NS flush. Theophylline/caffeine reduce effectiveness. Dipyridamole/carbamazepine potentiate effect — reduce dose." },
      { name: "Verapamil (Calan)", type: "Non-dihydropyridine CCB", action: "Slows AV node conduction to terminate SVT", sideEffects: "Hypotension, bradycardia, constipation, heart failure exacerbation", contra: "WPW with AFib, HFrEF, concurrent IV beta-blocker, hypotension", pearl: "Second-line to adenosine for SVT. Slower onset, longer duration. Do NOT use in wide-complex tachycardia or WPW with pre-excitation." },
      { name: "Procainamide", type: "Class IA Antiarrhythmic", action: "Slows conduction in both normal and accessory pathways; prolongs refractory period", sideEffects: "Hypotension (with rapid IV), QT prolongation, lupus-like syndrome (chronic use)", contra: "Torsades de pointes, severe HF, myasthenia gravis", pearl: "Drug of choice for WPW with AFib — slows accessory pathway without enhancing AV conduction. IV infusion, not bolus. Monitor QRS width and BP continuously." }
    ],
    pearls: [
      "SVT = regular, narrow, fast (150–250 bpm) with sudden onset and offset",
      "Vagal maneuvers are first-line: Valsalva, carotid massage, cold water to face",
      "Adenosine: rapid IV push → immediate flush → record rhythm strip → expect brief asystole",
      "WPW + AFib = NEVER give AV nodal blockers (adenosine, diltiazem, digoxin, beta-blockers) → use procainamide or cardiovert",
      "Polyuria after SVT episode is common — caused by ANP release from atrial distension",
      "Ablation is curative for AVNRT and AVRT with >95% success rate",
      "If a regular wide-complex tachycardia doesn't respond to adenosine, treat as VTach",
      "NCLEX tip: stable SVT → vagal maneuvers → adenosine → cardioversion if refractory; unstable → immediate cardioversion"
    ],
    quiz: [
      { question: "What is the first-line intervention for a hemodynamically stable patient with SVT?", options: ["Synchronized cardioversion", "IV amiodarone", "Vagal maneuvers", "Defibrillation"], correct: 2, rationale: "Vagal maneuvers (Valsalva, carotid massage, cold water to face) are the first-line non-pharmacologic intervention for stable SVT, as they increase parasympathetic tone and may terminate the reentrant circuit." },
      { question: "A patient converts from SVT to sinus rhythm after adenosine. The nurse should expect:", options: ["Sustained bradycardia requiring atropine", "A brief pause followed by return of sinus rhythm", "Immediate ventricular tachycardia", "No change in heart rate"], correct: 1, rationale: "A brief asystolic pause is expected after adenosine terminates the reentrant circuit. Sinus rhythm should resume within seconds. This pause is self-resolving and does not require intervention." },
      { question: "A patient with known WPW presents with AFib and a rapid irregular wide-complex rhythm. Which medication is CONTRAINDICATED?", options: ["Procainamide", "Amiodarone", "Adenosine", "Ibutilide"], correct: 2, rationale: "In WPW with AFib, AV nodal blockers like adenosine are contraindicated because blocking the AV node forces all conduction through the accessory pathway, potentially causing VFib. Procainamide slows the accessory pathway and is the preferred drug." },
      { question: "The most common mechanism of paroxysmal SVT is:", options: ["Automaticity of the SA node", "AV nodal reentrant tachycardia (AVNRT)", "Bundle branch reentry", "Triggered activity in Purkinje fibers"], correct: 1, rationale: "AVNRT accounts for approximately 60% of paroxysmal SVT cases. It involves a dual-pathway reentry circuit within or near the AV node using fast and slow pathways." },
      { question: "When administering adenosine, the nurse should:", options: ["Infuse slowly over 5 minutes via IV pump", "Give rapid IV push through a proximal port followed by immediate 20 mL NS flush", "Administer intramuscularly for sustained effect", "Mix with D5W and give over 30 minutes"], correct: 1, rationale: "Adenosine has a half-life of <10 seconds and must be given as a rapid IV push (1–2 seconds) through a proximal IV port, immediately followed by a 20 mL NS flush to ensure the drug reaches the heart before it is metabolized." },
      { question: "A patient reports polyuria following termination of an SVT episode. This is caused by:", options: ["Renal failure from hypoperfusion", "Release of atrial natriuretic peptide (ANP) from atrial stretch", "Side effect of adenosine", "Urinary tract infection"], correct: 1, rationale: "Rapid atrial rates in SVT cause atrial stretch, triggering release of ANP. ANP promotes natriuresis and diuresis, resulting in increased urine output after the episode resolves." }
    ]
  },

  "vtach-expanded-rn": {
    title: "Ventricular Tachycardia (VTach) — Expanded RN",
    cellular: {
      title: "Pathophysiology & Mechanism",
      content:
        "Ventricular tachycardia (VTach) originates below the bundle of His within the ventricular myocardium or Purkinje fibers. It is defined as three or more consecutive premature ventricular complexes (PVCs) at a rate of 100–250 bpm. The primary mechanism is reentry through scarred or diseased ventricular tissue, though enhanced automaticity and triggered activity can also cause VTach. Because the impulse does not travel through the normal His-Purkinje system, ventricular depolarization is slow and disorganized, producing wide, bizarre QRS complexes (≥0.12 sec). AV dissociation (atria and ventricles beat independently) is a hallmark when identifiable. VTach is classified as: (1) Sustained — lasting >30 seconds or causing hemodynamic compromise; (2) Non-sustained (NSVT) — 3 or more beats lasting <30 seconds, self-terminating; (3) Monomorphic — uniform QRS morphology (single reentry circuit, often from MI scar); (4) Polymorphic — variable QRS morphology (multiple circuits or changing substrate). Torsades de Pointes (TdP) is a specific polymorphic VTach occurring with a prolonged QT interval, characterized by a 'twisting of the points' pattern where QRS amplitude oscillates around the baseline. VTach can rapidly deteriorate to VFib and cardiac arrest. Sustained VTach with a pulse is treated differently from pulseless VTach (treated as cardiac arrest per ACLS)."
    },
    riskFactors: [
      "Prior myocardial infarction — scar tissue creates reentry substrate",
      "Heart failure with reduced ejection fraction (EF <35%)",
      "Cardiomyopathy (dilated, hypertrophic, arrhythmogenic RV)",
      "Electrolyte imbalances: hypokalemia, hypomagnesemia, hypocalcemia",
      "QT-prolonging drugs: antiarrhythmics (sotalol, dofetilide), antibiotics (fluoroquinolones, macrolides), antipsychotics, methadone",
      "Acute myocardial ischemia",
      "Myocarditis",
      "Congenital long QT syndrome or Brugada syndrome",
      "Digitalis toxicity",
      "Cocaine and stimulant use (sympathomimetic surge)"
    ],
    diagnostics: [
      "12-lead ECG: wide QRS (≥0.12 sec), rate 100–250 bpm, regular or slightly irregular",
      "AV dissociation: independent P waves marching through QRS complexes (diagnostic for VTach vs SVT with aberrancy)",
      "Capture beats: occasional narrow QRS when a sinus impulse 'captures' the ventricle through the normal conduction system",
      "Fusion beats: hybrid morphology when sinus and ventricular impulses simultaneously depolarize the ventricle",
      "Concordance: all precordial leads showing same QRS direction (positive or negative) — strongly suggestive of VTach",
      "QTc measurement: prolonged QTc (>500 ms) suggests risk for Torsades de Pointes",
      "Electrolytes: K+, Mg2+, Ca2+, phosphorus",
      "Troponin to rule out acute MI",
      "Echocardiogram: EF assessment, structural disease",
      "Cardiac MRI: scar mapping for ablation planning",
      "EP study for inducibility and ablation"
    ],
    management: [
      "Pulseless VTach: treat as cardiac arrest — immediate defibrillation (not synchronized), CPR, ACLS algorithm (epinephrine 1 mg IV q3–5 min, amiodarone 300 mg IV bolus then 150 mg)",
      "Stable sustained monomorphic VTach with pulse: IV amiodarone 150 mg over 10 min, may repeat; or IV procainamide; or IV lidocaine",
      "Unstable VTach with pulse (hypotension, AMS, chest pain, acute HF): immediate synchronized cardioversion at 100J biphasic",
      "Torsades de Pointes: IV magnesium sulfate 1–2 g over 5–20 min (first-line), isoproterenol or overdrive pacing to shorten QT, discontinue offending QT-prolonging drugs — do NOT give amiodarone (prolongs QT further)",
      "ICD implantation: secondary prevention after survived VTach/VFib arrest; primary prevention if EF ≤35% and NYHA II–III",
      "VTach ablation: for recurrent VTach despite ICD and antiarrhythmic therapy (VTach storm)",
      "Correct underlying cause: reperfuse ischemia, correct electrolytes, stop offending drugs, treat HF"
    ],
    nursingActions: [
      "Assess pulse immediately — pulseless VTach is a cardiac arrest, call a code",
      "For VTach with pulse: assess hemodynamic stability (BP, LOC, chest pain)",
      "Activate rapid response or code team based on assessment",
      "For pulseless VTach: begin high-quality CPR, apply defibrillator pads, deliver unsynchronized shock ASAP",
      "For stable VTach with pulse: prepare IV amiodarone, ensure continuous telemetry, obtain 12-lead ECG",
      "For unstable VTach with pulse: prepare for synchronized cardioversion, ensure sedation if conscious",
      "Monitor QTc interval — hold QT-prolonging medications if QTc >500 ms and notify provider",
      "Keep IV magnesium at bedside for patients with polymorphic VTach or long QT",
      "Post-arrest care: targeted temperature management, hemodynamic support, neurocognitive monitoring",
      "ICD education: avoid MRI (unless MRI-conditional device), medic alert ID, driving restrictions, avoid strong magnetic fields, report shocks to provider"
    ],
    assessmentFindings: [
      "With pulse: palpitations, chest pain, dyspnea, dizziness, diaphoresis, anxiety",
      "Hemodynamic compromise: hypotension, altered LOC, syncope",
      "Cannon A waves in JVP (atrial contraction against closed tricuspid valve during AV dissociation)",
      "Variable S1 heart sound intensity (AV dissociation)",
      "Pulseless: unresponsive, no breathing, no pulse"
    ],
    signs: {
      left: [
        "Wide QRS ≥0.12 sec — hallmark",
        "Rate 100–250 bpm",
        "Regular or slightly irregular rhythm",
        "AV dissociation (independent P waves)",
        "Monomorphic: uniform QRS morphology",
        "Capture and fusion beats diagnostic for VTach"
      ],
      right: [
        "Polymorphic VTach: variable QRS morphology",
        "Torsades de Pointes: twisting QRS around baseline with prolonged QT",
        "VTach storm: ≥3 sustained episodes in 24 hours",
        "May degenerate to VFib at any time",
        "Pulseless VTach = cardiac arrest",
        "Sustained VTach with pulse can rapidly become pulseless"
      ]
    },
    medications: [
      { name: "Amiodarone (Cordarone)", type: "Class III Antiarrhythmic", action: "Prolongs action potential and refractory period in ventricular tissue; blocks multiple ion channels", sideEffects: "Hypotension (IV), bradycardia, pulmonary fibrosis, thyroid dysfunction, hepatotoxicity, corneal deposits", contra: "Cardiogenic shock, severe sinus node dysfunction, 2nd/3rd degree block without pacemaker", pearl: "First-line antiarrhythmic for VTach. In cardiac arrest: 300 mg IV push, then 150 mg. In stable VTach: 150 mg IV over 10 min, then maintenance drip 1 mg/min x6hr, then 0.5 mg/min x18hr. Do NOT use for Torsades de Pointes (prolongs QT)." },
      { name: "Lidocaine", type: "Class IB Antiarrhythmic", action: "Shortens action potential duration, suppresses ventricular ectopy particularly in ischemic tissue", sideEffects: "CNS toxicity (confusion, seizures, tinnitus), bradycardia, hypotension", contra: "High-degree AV block, severe hepatic impairment", pearl: "Alternative to amiodarone, especially in acute MI-related VTach. Load 1–1.5 mg/kg IV, then 0.5–0.75 mg/kg q5–10 min (max 3 mg/kg), then drip 1–4 mg/min. Monitor for neurologic toxicity." },
      { name: "Magnesium Sulfate", type: "Electrolyte", action: "Stabilizes myocardial cell membrane, shortens QT interval, suppresses triggered activity", sideEffects: "Flushing, hypotension, respiratory depression, hyporeflexia (toxicity)", contra: "Hypermagnesemia, myasthenia gravis, renal failure (use cautiously)", pearl: "First-line treatment for Torsades de Pointes regardless of serum Mg level. Give 1–2 g IV over 5–20 min. Also useful as adjunct in refractory VTach/VFib. Monitor deep tendon reflexes and respiratory rate." },
      { name: "Procainamide", type: "Class IA Antiarrhythmic", action: "Slows conduction and prolongs refractory period in ventricular tissue", sideEffects: "Hypotension, QT prolongation, lupus-like syndrome, agranulocytosis", contra: "Torsades, complete heart block, SLE, myasthenia gravis", pearl: "Alternative for stable monomorphic VTach. Infuse 20–50 mg/min until arrhythmia suppressed, hypotension occurs, QRS widens by 50%, or max dose 17 mg/kg reached. Stop infusion if any endpoint reached." }
    ],
    pearls: [
      "Wide complex tachycardia = VTach until proven otherwise — never assume SVT with aberrancy",
      "Pulseless VTach and VFib are treated identically: defibrillation + CPR + ACLS drugs",
      "VTach WITH a pulse: stable → amiodarone IV; unstable → synchronized cardioversion",
      "AV dissociation, capture beats, and fusion beats differentiate VTach from SVT with aberrancy",
      "Torsades de Pointes treatment is DIFFERENT: IV magnesium first, overdrive pacing, STOP QT-prolonging drugs, do NOT give amiodarone",
      "The Brugada criteria help differentiate VTach from SVT with aberrancy on 12-lead ECG",
      "ICD is indicated for secondary prevention after survived VTach/VFib arrest and primary prevention with EF ≤35%",
      "VTach storm (≥3 episodes in 24 hours) requires aggressive management: IV antiarrhythmics, sedation, possible ablation",
      "NCLEX priority: always check for pulse first — this determines your entire management approach"
    ],
    quiz: [
      { question: "A patient on the telemetry unit develops a wide-complex tachycardia at 180 bpm. The nurse's FIRST action is:", options: ["Administer adenosine", "Assess for a pulse", "Apply a 12-lead ECG", "Call the healthcare provider"], correct: 1, rationale: "The first action is always to assess for a pulse. Pulseless VTach is a cardiac arrest requiring immediate defibrillation and CPR. VTach with a pulse allows time for further assessment and pharmacologic management." },
      { question: "Which finding on ECG is most diagnostic for VTach over SVT with aberrancy?", options: ["Heart rate >150 bpm", "AV dissociation with independent P waves", "Narrow QRS complexes", "Regular R-R intervals"], correct: 1, rationale: "AV dissociation (P waves occurring independently of QRS complexes) is the most reliable ECG criterion for VTach. It proves the ventricular rhythm is independent of atrial activity." },
      { question: "The first-line treatment for Torsades de Pointes is:", options: ["Amiodarone IV", "Magnesium sulfate IV", "Adenosine IV", "Atropine IV"], correct: 1, rationale: "IV magnesium sulfate 1–2 g is the first-line treatment for Torsades de Pointes regardless of serum magnesium level. Amiodarone is contraindicated as it prolongs the QT interval further." },
      { question: "During a code, a patient is found in pulseless VTach. The appropriate shock delivery is:", options: ["Synchronized cardioversion at 50J", "Unsynchronized defibrillation at maximum energy", "No shock — begin CPR only", "Synchronized cardioversion at 200J"], correct: 1, rationale: "Pulseless VTach is treated with unsynchronized defibrillation (not synchronized cardioversion). The defibrillator delivers a shock at maximum energy to depolarize the entire myocardium and allow the SA node to resume pacing." },
      { question: "A patient with an EF of 30% and NYHA class III heart failure has had no VTach episodes. An ICD is recommended for:", options: ["Diagnostic monitoring only", "Primary prevention of sudden cardiac death", "Rate control of atrial fibrillation", "Improvement of ejection fraction"], correct: 1, rationale: "ICD implantation is recommended for primary prevention of sudden cardiac death in patients with EF ≤35% and NYHA class II–III heart failure, even without prior VTach/VFib episodes." },
      { question: "Which drug should be AVOIDED in a patient with a QTc of 520 ms who develops polymorphic VTach?", options: ["Magnesium sulfate", "Isoproterenol", "Amiodarone", "Lidocaine"], correct: 2, rationale: "Amiodarone prolongs the QT interval and should NOT be used in Torsades de Pointes (polymorphic VTach with prolonged QT). First-line is IV magnesium. Isoproterenol or overdrive pacing can shorten the QT interval." }
    ]
  },

  "vfib-expanded-rn": {
    title: "Ventricular Fibrillation (VFib) — Expanded RN",
    cellular: {
      title: "Pathophysiology & Mechanism",
      content:
        "Ventricular fibrillation (VFib) is a lethal cardiac arrhythmia characterized by chaotic, disorganized electrical activity in the ventricles. Multiple wavefronts of depolarization occur simultaneously, producing a completely erratic pattern without identifiable P waves, QRS complexes, or T waves. The ventricular myocardium quivers rather than contracts in any coordinated fashion, resulting in zero effective cardiac output — this is cardiac arrest. Without immediate intervention, VFib is fatal within minutes. VFib is classified by amplitude: coarse VFib (higher amplitude, more recently onset, more likely to respond to defibrillation) and fine VFib (lower amplitude, longer duration, poorer prognosis, may be confused with asystole — check in two leads). The most common cause of VFib in adults is acute myocardial ischemia/infarction. The pathogenesis involves: (1) ischemia creates areas of varied refractoriness in ventricular tissue, (2) PVCs or VTach may trigger the initial fibrillatory event, (3) multiple re-entry circuits fragment into chaotic depolarization, (4) without defibrillation, the amplitude diminishes as ATP stores deplete, transitioning from coarse to fine VFib and eventually asystole. The only effective treatment is immediate defibrillation — for every minute without defibrillation, survival decreases by 7–10%. High-quality CPR maintains some perfusion to the brain and heart until defibrillation can be delivered."
    },
    riskFactors: [
      "Acute myocardial infarction — most common cause in adults",
      "Severe coronary artery disease",
      "Cardiomyopathy (dilated, hypertrophic)",
      "Prior cardiac arrest or sustained VTach",
      "Heart failure with EF <35%",
      "Electrolyte abnormalities: severe hypokalemia, hyperkalemia, hypomagnesemia",
      "Drug toxicity: digitalis, antiarrhythmics, cocaine, methamphetamine",
      "Drowning, electrocution, hypothermia",
      "Prolonged QT syndrome (congenital or acquired)",
      "Commotio cordis (blunt chest trauma during vulnerable repolarization period)",
      "Brugada syndrome, arrhythmogenic right ventricular cardiomyopathy"
    ],
    diagnostics: [
      "ECG: chaotic, irregular waveform with no identifiable P waves, QRS, or T waves",
      "Coarse VFib: higher amplitude, more recently onset",
      "Fine VFib: low amplitude, may mimic asystole — confirm in two leads",
      "No pulse on assessment — clinical confirmation of cardiac arrest",
      "Post-arrest diagnostics: 12-lead ECG, troponin, echocardiogram, coronary angiography",
      "Labs post-ROSC: ABG, lactate, electrolytes, CBC, renal/hepatic function",
      "CT head if suspected neurologic cause or to assess anoxic injury"
    ],
    management: [
      "Immediate high-quality CPR: compressions 100–120/min, depth 2–2.4 inches, full chest recoil, minimize interruptions <10 sec",
      "Defibrillation ASAP: unsynchronized shock — biphasic 120–200J (or manufacturer recommendation), monophasic 360J; escalate energy for subsequent shocks",
      "ACLS algorithm: CPR → Shock → CPR 2 min → Rhythm check → repeat cycle",
      "Epinephrine 1 mg IV/IO every 3–5 minutes (after 2nd shock)",
      "Amiodarone 300 mg IV/IO bolus (after 3rd shock); may repeat 150 mg once",
      "Lidocaine as alternative: 1–1.5 mg/kg IV; repeat 0.5–0.75 mg/kg",
      "Correct reversible causes (H's and T's): Hypovolemia, Hypoxia, Hydrogen ion (acidosis), Hypo/Hyperkalemia, Hypothermia, Tension pneumothorax, Tamponade, Toxins, Thrombosis (coronary/pulmonary)",
      "Post-ROSC: targeted temperature management (32–36°C for 24 hours), hemodynamic optimization, emergent coronary angiography if STEMI, neuroprognostication at 72+ hours",
      "ICD implantation for secondary prevention after survived VFib arrest"
    ],
    nursingActions: [
      "Recognize VFib immediately — chaotic rhythm with no pulse = START CPR NOW",
      "Call code/activate emergency response system",
      "Begin chest compressions: push hard, push fast (100–120/min), allow full recoil",
      "Apply defibrillator pads, deliver unsynchronized shock as soon as available",
      "Resume CPR immediately after shock — do NOT pause to check rhythm for 2 minutes",
      "Establish IV/IO access; prepare and administer ACLS medications as ordered",
      "Ensure effective airway management: BVM ventilation with 100% O2, advanced airway when available",
      "Rotate compressor every 2 minutes to prevent fatigue and maintain quality",
      "Document code events: times of shocks, medications, rhythm changes, procedures",
      "Post-ROSC: continuous monitoring, targeted temperature management protocol, maintain MAP ≥65 mmHg",
      "Support family: designate staff for family communication, offer presence during resuscitation per facility policy"
    ],
    assessmentFindings: [
      "Unresponsive — no purposeful movement",
      "Absent pulse — confirmed in <10 seconds",
      "Absent breathing or agonal gasps only",
      "Chaotic rhythm on monitor with no organized complexes",
      "Cyanosis progressing rapidly",
      "If witnessed: may have preceded by VTach, chest pain, or sudden collapse"
    ],
    signs: {
      left: [
        "Chaotic, irregular waveform without identifiable waves",
        "No discernible P waves, QRS, or T waves",
        "Coarse VFib: higher amplitude waveforms",
        "Fine VFib: low amplitude — confirm in 2 leads to rule out asystole",
        "No pulse — cardiac arrest",
        "Clinical death without immediate intervention"
      ],
      right: [
        "Fine VFib may mimic asystole — always check two leads",
        "Refractory VFib: fails to respond to multiple defibrillation attempts",
        "ROSC may be brief — continuous monitoring essential",
        "Post-arrest: assess for neurologic injury",
        "Recurrent VFib: consider underlying cause not addressed",
        "Hypothermic VFib may be refractory until core temp normalized"
      ]
    },
    medications: [
      { name: "Epinephrine", type: "Vasopressor (ACLS)", action: "Alpha-1 mediated vasoconstriction increases coronary and cerebral perfusion pressure during CPR", sideEffects: "Tachyarrhythmias post-ROSC, hypertension, myocardial oxygen demand increase", contra: "None during cardiac arrest — always indicated", pearl: "1 mg IV/IO every 3–5 minutes. Given after 2nd shock in shockable rhythms. Do not delay defibrillation to give epinephrine. The primary benefit is improving coronary perfusion pressure through vasoconstriction." },
      { name: "Amiodarone (Cordarone)", type: "Class III Antiarrhythmic (ACLS)", action: "Stabilizes myocardial membranes, prolongs refractory period, may prevent recurrent VFib", sideEffects: "Hypotension, bradycardia post-ROSC", contra: "None during cardiac arrest", pearl: "300 mg IV/IO push after 3rd shock. May repeat 150 mg once. Shown to improve survival to hospital admission in refractory VFib/pulseless VTach." },
      { name: "Lidocaine", type: "Class IB Antiarrhythmic (ACLS alternative)", action: "Suppresses ventricular ectopy by shortening action potential duration in ischemic tissue", sideEffects: "CNS toxicity, seizures, bradycardia", contra: "None during cardiac arrest", pearl: "Alternative to amiodarone: 1–1.5 mg/kg IV first dose, 0.5–0.75 mg/kg repeat doses q5–10 min (max 3 mg/kg). Historically first-line, now second-line to amiodarone." }
    ],
    pearls: [
      "VFib = IMMEDIATE defibrillation + CPR — every minute of delay reduces survival by 7–10%",
      "Always use UNSYNCHRONIZED defibrillation for VFib (and pulseless VTach) — there is no R wave to sync to",
      "Fine VFib vs asystole: check in two leads — if any doubt, treat as asystole (CPR + epinephrine, NO shock)",
      "High-quality CPR is the foundation: compressions 100–120/min, 2–2.4 inches deep, full recoil, minimize interruptions",
      "H's and T's mnemonic for reversible causes must be systematically evaluated during the code",
      "Defibrillation does NOT restart the heart — it stops ALL electrical activity so the SA node can resume pacing",
      "Post-ROSC targeted temperature management (32–36°C x 24h) improves neurologic outcomes",
      "ICD implantation is standard for secondary prevention after survived VFib cardiac arrest",
      "NCLEX priority: immediate defibrillation before drugs, before intubation — do not delay for any reason"
    ],
    quiz: [
      { question: "A nurse finds a patient unresponsive with the monitor showing VFib. The FIRST action is:", options: ["Administer epinephrine", "Begin chest compressions and call for the defibrillator", "Obtain a 12-lead ECG", "Administer amiodarone"], correct: 1, rationale: "In VFib cardiac arrest, the priorities are to start high-quality CPR immediately and deliver defibrillation as soon as possible. Compressions maintain perfusion until the defibrillator arrives. Medications come after the first 1–2 shocks." },
      { question: "Defibrillation for VFib should be delivered in which mode?", options: ["Synchronized", "Unsynchronized", "Overdrive pacing", "Demand mode"], correct: 1, rationale: "VFib has no organized QRS complexes for the defibrillator to synchronize with. Unsynchronized mode delivers the shock at any point, which is necessary and appropriate for VFib and pulseless VTach." },
      { question: "During a code for VFib, when should epinephrine first be administered?", options: ["Before the first shock", "After the second shock", "After ROSC is achieved", "Only if amiodarone is unavailable"], correct: 1, rationale: "Per ACLS guidelines, epinephrine 1 mg IV/IO is administered after the second shock (during the CPR cycle following the second defibrillation attempt). Defibrillation should not be delayed for drug administration." },
      { question: "A monitor shows a very low-amplitude chaotic rhythm. To differentiate fine VFib from asystole, the nurse should:", options: ["Increase the monitor gain only", "Check the rhythm in at least two leads", "Defibrillate immediately", "Administer atropine"], correct: 1, rationale: "Fine VFib can mimic asystole. Checking the rhythm in two leads confirms whether the irregular waveforms represent fine VFib (shockable) or true asystole (non-shockable). Increasing gain alone may introduce artifact." },
      { question: "Post-ROSC targeted temperature management aims to:", options: ["Increase metabolic rate for healing", "Improve neurological outcomes by reducing cerebral oxygen demand", "Prevent hypothermia-related coagulopathy", "Increase cardiac contractility"], correct: 1, rationale: "Targeted temperature management (32–36°C for 24 hours) reduces cerebral metabolic demand, decreases reperfusion injury, and improves neurological outcomes in comatose patients after cardiac arrest." },
      { question: "Which reversible cause of VFib is assessed by checking a STAT potassium level?", options: ["Toxins", "Tension pneumothorax", "Hypo/hyperkalemia", "Tamponade"], correct: 2, rationale: "Hypokalemia and hyperkalemia are 'H's' in the H's and T's of reversible causes. Both can cause lethal arrhythmias including VFib. A STAT potassium level identifies this treatable cause." }
    ]
  },

  "heart-blocks-expanded-rn": {
    title: "Heart Blocks (AV Conduction Disorders) — Expanded RN",
    cellular: {
      title: "Pathophysiology & Mechanism",
      content:
        "Heart blocks are disorders of impulse conduction through the atrioventricular (AV) node or infranodal conduction system (Bundle of His, bundle branches, Purkinje fibers). The conduction pathway anatomy is critical: the SA node generates the impulse → atrial depolarization (P wave) → impulse reaches the AV node (physiologic delay, PR interval) → Bundle of His → right and left bundle branches → Purkinje fibers → ventricular depolarization (QRS). Heart blocks are classified by severity: FIRST-DEGREE AV BLOCK — delayed conduction through the AV node; every impulse is conducted but with prolonged PR interval >0.20 sec. All P waves are followed by QRS complexes. Usually benign. SECOND-DEGREE TYPE I (Mobitz I / Wenckebach) — progressive PR prolongation until a P wave is not conducted (dropped QRS), then the cycle repeats. The block is typically at the AV node level. Usually transient, often from increased vagal tone, inferior MI, or medication effects. Rarely progresses to complete block. SECOND-DEGREE TYPE II (Mobitz II) — intermittent failure of conduction WITHOUT progressive PR prolongation. The PR interval is constant for conducted beats, then suddenly a P wave is blocked. The block is at or below the Bundle of His (infranodal). More dangerous than Type I — can progress suddenly to complete heart block. Often associated with anterior MI or degenerative conduction disease. THIRD-DEGREE (Complete) HEART BLOCK — complete failure of AV conduction. No atrial impulses reach the ventricles. The atria and ventricles beat independently (AV dissociation). An escape rhythm (junctional 40–60 bpm with narrow QRS, or ventricular 20–40 bpm with wide QRS) maintains ventricular activity. The ventricular rate is typically slow and unreliable, causing hemodynamic compromise."
    },
    riskFactors: [
      "Acute myocardial infarction (inferior MI → AV nodal blocks; anterior MI → infranodal blocks)",
      "Degenerative conduction system disease (fibrosis, calcification) — most common cause in elderly",
      "AV nodal blocking medications: beta-blockers, calcium channel blockers, digoxin, amiodarone",
      "Cardiac surgery (valve replacement, septal myectomy)",
      "Myocarditis (Lyme disease, viral)",
      "Infiltrative diseases (sarcoidosis, amyloidosis)",
      "Congenital heart block (associated with maternal lupus antibodies)",
      "Hyperkalemia",
      "Aortic valve calcification extending to conduction system",
      "Post-catheter ablation complication"
    ],
    diagnostics: [
      "12-lead ECG — definitive for classification: PR interval measurement, P-QRS relationship, regularity",
      "First-degree: PR >0.20 sec, every P followed by QRS, regular rhythm",
      "Second-degree Type I: progressive PR prolongation, grouped beating pattern, dropped QRS, regular P-P intervals",
      "Second-degree Type II: constant PR for conducted beats, sudden dropped QRS without PR change, may have fixed ratios (2:1, 3:1)",
      "Third-degree: regular P-P intervals AND regular R-R intervals but at DIFFERENT rates, no relationship between P waves and QRS",
      "His bundle electrogram during EP study to localize block level",
      "Echocardiogram to assess structural heart disease",
      "Lyme titer if suspected Lyme carditis",
      "Electrolytes (K+, Ca2+, Mg2+)",
      "Drug levels (digoxin) if applicable"
    ],
    management: [
      "First-degree: no treatment required — monitor, evaluate medications that prolong PR",
      "Second-degree Type I: usually no treatment if asymptomatic; hold offending medications; atropine if symptomatic bradycardia",
      "Second-degree Type II: high risk for progression to complete block — prepare for transcutaneous pacing; permanent pacemaker usually indicated",
      "Third-degree: transcutaneous pacing immediately if symptomatic/unstable; atropine may be tried but often ineffective (especially if block is infranodal); IV dopamine or epinephrine drip as bridge; permanent pacemaker is definitive treatment",
      "Atropine 0.5 mg IV q3–5 min (max 3 mg) — effective for AV nodal blocks, NOT for infranodal blocks",
      "Transcutaneous pacing: apply pads, set rate (usually 60–80 bpm), increase mA until capture (electrical spike followed by wide QRS and palpable pulse)",
      "Transvenous pacing for sustained block requiring pacing beyond transcutaneous capability",
      "Permanent pacemaker: indicated for symptomatic bradycardia from Mobitz II or complete heart block",
      "Treat reversible causes: stop offending drugs, treat MI, antibiotics for Lyme disease"
    ],
    nursingActions: [
      "Recognize the type of block on continuous telemetry — know the key differentiating features",
      "Assess hemodynamic impact: heart rate, blood pressure, LOC, symptoms of decreased cardiac output",
      "First-degree: document PR interval, report if new or worsening",
      "Type I (Wenckebach): monitor for progression, assess for reversible causes (medications, increased vagal tone)",
      "Type II (Mobitz II): keep transcutaneous pacemaker at bedside, prepare for permanent pacemaker",
      "Third-degree: immediate notification of provider, prepare transcutaneous pacing, maintain IV access",
      "Atropine administration: give IV push, monitor for paradoxical bradycardia at doses <0.5 mg (can increase vagal tone)",
      "Transcutaneous pacing: apply large adhesive pads (anterior-posterior preferred), set rate and increase mA to capture, assess for electrical and mechanical capture separately, provide sedation/analgesia — pacing is painful",
      "Post-pacemaker insertion: monitor insertion site, limit arm movement on affected side per protocol, chest X-ray to verify lead placement, assess for complications (pneumothorax, lead displacement, infection)",
      "Pacemaker education: carry ID card, avoid MRI (unless MRI-conditional), monitor pulse daily, report hiccups or muscle twitching (lead displacement), avoid close proximity to strong electromagnetic fields"
    ],
    assessmentFindings: [
      "First-degree: usually asymptomatic, prolonged PR on ECG only finding",
      "Type I: may be asymptomatic or have mild dizziness during dropped beats",
      "Type II: dizziness, near-syncope, syncope, fatigue, dyspnea on exertion",
      "Third-degree: severe bradycardia, syncope (Stokes-Adams attacks), heart failure, fatigue, confusion, exercise intolerance",
      "Cannon A waves in JVP (atrial contraction against closed tricuspid valve)",
      "Variable S1 intensity (in third-degree block)",
      "Signs of decreased cardiac output: hypotension, cool/clammy skin, oliguria"
    ],
    signs: {
      left: [
        "First-degree: PR >0.20 sec, all P waves conducted, regular",
        "Type I: progressive PR prolongation, grouped beating, dropped QRS",
        "Type II: constant PR, sudden dropped QRS, may have fixed ratio",
        "Third-degree: P waves and QRS at independent rates, AV dissociation",
        "Junctional escape: narrow QRS at 40–60 bpm (block at AV node)",
        "Ventricular escape: wide QRS at 20–40 bpm (block below His bundle)"
      ],
      right: [
        "Type II can progress suddenly to complete block without warning",
        "Third-degree with ventricular escape is unreliable — pacemaker urgent",
        "Atropine ineffective for infranodal blocks (Type II, third-degree with wide QRS)",
        "Anterior MI causing heart block has worse prognosis than inferior MI",
        "New bundle branch block + first-degree block may indicate progressive conduction disease",
        "Drug-induced blocks often reversible when offending agent discontinued"
      ]
    },
    medications: [
      { name: "Atropine Sulfate", type: "Anticholinergic (Parasympatholytic)", action: "Blocks vagal (parasympathetic) input to the AV node, increasing conduction velocity and heart rate", sideEffects: "Tachycardia, dry mouth, urinary retention, blurred vision, confusion in elderly", contra: "Angle-closure glaucoma, obstructive uropathy, myasthenia gravis", pearl: "Effective for AV nodal blocks (first-degree, Type I). INEFFECTIVE for infranodal blocks (Type II, third-degree with wide QRS) — AV node is not the site of block. Minimum dose 0.5 mg IV — doses <0.5 mg can paradoxically worsen bradycardia. Max total dose 3 mg." },
      { name: "Dopamine", type: "Sympathomimetic Vasopressor", action: "At 5–10 mcg/kg/min: beta-1 effects increase heart rate and cardiac contractility", sideEffects: "Tachyarrhythmias, hypertension, tissue necrosis with extravasation", contra: "Pheochromocytoma, uncorrected tachyarrhythmias", pearl: "Used as temporizing measure for symptomatic bradycardia unresponsive to atropine while preparing for pacing. Infusion rate 5–20 mcg/kg/min titrated to heart rate and BP." },
      { name: "Epinephrine Infusion", type: "Sympathomimetic", action: "Beta-1 stimulation increases heart rate and contractility", sideEffects: "Tachyarrhythmias, hypertension, anxiety, tremor", contra: "None in emergency bradycardia setting", pearl: "Alternative to dopamine for symptomatic bradycardia: 2–10 mcg/min IV infusion. Used when atropine fails and pacing is being arranged." },
      { name: "Isoproterenol", type: "Non-selective Beta Agonist", action: "Beta-1 and beta-2 stimulation increases heart rate and enhances conduction", sideEffects: "Tachycardia, palpitations, angina, hypotension (beta-2 vasodilation)", contra: "Digitalis toxicity, tachyarrhythmias", pearl: "Rarely used but may be considered as bridge to pacing in complete heart block. Also used in overdrive pacing scenarios for Torsades de Pointes. 2–10 mcg/min IV infusion." }
    ],
    pearls: [
      "First-degree AV block = prolonged PR >0.20 sec but every P is conducted — benign, no treatment",
      "Type I (Wenckebach) = 'longer, longer, longer, DROP, then you have a Wenckebach' — progressive PR prolongation before dropped beat",
      "Type II (Mobitz II) = constant PR then sudden drop — dangerous, prepare for pacing, pacemaker likely needed",
      "Third-degree = complete AV dissociation — P waves march at their rate, QRS at escape rate, no relationship",
      "Atropine works on the AV node (vagal-mediated blocks) but NOT on infranodal blocks — know the difference",
      "Anterior MI + new heart block = high risk — block is infranodal, may need emergent pacing",
      "Inferior MI + heart block = usually transient AV nodal block — monitor closely, often resolves",
      "Minimum atropine dose is 0.5 mg IV — paradoxical bradycardia can occur with lower doses",
      "Transcutaneous pacing captures electrically when you see a pacing spike followed by a wide QRS — but always confirm mechanical capture with a pulse",
      "NCLEX tip: Type II and third-degree blocks = pacemaker; unstable bradycardia from any cause = atropine first, then pacing"
    ],
    quiz: [
      { question: "Which heart block shows progressive PR prolongation before a dropped QRS complex?", options: ["First-degree AV block", "Second-degree Type I (Wenckebach)", "Second-degree Type II (Mobitz II)", "Third-degree (complete) heart block"], correct: 1, rationale: "Second-degree Type I (Wenckebach) is characterized by progressive lengthening of the PR interval with each successive beat until one P wave fails to conduct, resulting in a dropped QRS. The cycle then repeats." },
      { question: "A patient with Mobitz Type II block suddenly becomes unresponsive with a heart rate of 28 bpm. The priority intervention is:", options: ["Administer atropine 1 mg IV", "Initiate transcutaneous pacing", "Obtain a 12-lead ECG", "Administer adenosine"], correct: 1, rationale: "Mobitz Type II is an infranodal block that has progressed to near-complete block with severe bradycardia. Atropine is typically ineffective for infranodal blocks. Transcutaneous pacing is the priority intervention. A permanent pacemaker is the definitive treatment." },
      { question: "In third-degree heart block, the relationship between P waves and QRS complexes is:", options: ["1:1 with prolonged PR", "Progressive PR prolongation", "No consistent relationship — AV dissociation", "2:1 fixed ratio"], correct: 2, rationale: "In third-degree (complete) heart block, there is complete AV dissociation. The atria and ventricles depolarize independently at their own rates with no relationship between P waves and QRS complexes." },
      { question: "Why should atropine doses be at least 0.5 mg IV?", options: ["Lower doses are not absorbed", "Lower doses can paradoxically worsen bradycardia", "Higher doses cause asystole", "The drug is too dilute at lower doses"], correct: 1, rationale: "Atropine doses below 0.5 mg can paradoxically stimulate the vagus nerve centrally, worsening bradycardia. The recommended dose is 0.5 mg IV every 3–5 minutes to a maximum of 3 mg." },
      { question: "A nurse is monitoring a patient after transcutaneous pacemaker initiation. Electrical capture is confirmed by:", options: ["A pacing spike on the monitor", "A pacing spike followed by a wide QRS complex", "The patient reporting decreased pain", "An increase in blood pressure alone"], correct: 1, rationale: "Electrical capture is confirmed when each pacing spike is followed by a wide QRS complex on the monitor. Mechanical capture must then be confirmed separately by assessing for a palpable pulse corresponding to the paced rhythm." },
      { question: "Which type of MI most commonly causes transient AV nodal heart block?", options: ["Anterior STEMI", "Inferior STEMI", "Lateral STEMI", "Posterior STEMI"], correct: 1, rationale: "Inferior STEMI affects the right coronary artery, which supplies the AV node in 85–90% of people. AV blocks from inferior MI are usually at the AV nodal level, often transient, and responsive to atropine. Anterior MI causes infranodal blocks with worse prognosis." }
    ]
  },

  "sinus-brady-tachy-expanded-rn": {
    title: "Sinus Bradycardia & Sinus Tachycardia — Expanded RN",
    cellular: {
      title: "Pathophysiology & Mechanism",
      content:
        "Sinus bradycardia and sinus tachycardia originate from the sinoatrial (SA) node — they represent sinus rhythm at abnormal rates. SINUS BRADYCARDIA: SA node fires at <60 bpm. The rhythm is regular with normal P waves, normal PR interval, and narrow QRS — all parameters normal except the rate. The SA node firing rate is influenced by autonomic tone: increased parasympathetic (vagal) tone slows the SA node. Causes include: physiologic (well-conditioned athletes, sleep), pharmacologic (beta-blockers, calcium channel blockers, digoxin, amiodarone), pathologic (hypothyroidism, increased intracranial pressure with Cushing's triad, inferior MI affecting SA node blood supply, hypothermia, obstructive sleep apnea, sick sinus syndrome). Clinical significance depends on symptoms — many patients tolerate rates in the 40s–50s. Symptomatic bradycardia causing hemodynamic compromise requires treatment. Sick sinus syndrome (SSS) refers to SA node dysfunction causing alternating bradycardia and tachycardia (tachy-brady syndrome), sinus pauses, or sinus arrest. SINUS TACHYCARDIA: SA node fires at >100 bpm (typically 100–160 bpm, can reach 200 in extreme exercise). It is a RESPONSE to a physiologic stimulus, not a primary arrhythmia. The rhythm is regular with normal P waves, normal PR (may shorten slightly at high rates), and narrow QRS. Causes include: physiologic (exercise, anxiety, pain), compensatory (hypovolemia, hemorrhage, dehydration, heart failure, sepsis, PE, anemia), pharmacologic (stimulants, anticholinergics, thyroid hormone excess), and pathologic (fever — HR increases ~10 bpm per 1°F above 98.6°F, hyperthyroidism, pheochromocytoma). Sinus tachycardia is never treated by targeting the heart rate — the underlying cause must be identified and addressed."
    },
    riskFactors: [
      "Bradycardia: beta-blocker/CCB/digoxin use, hypothyroidism, advanced age, inferior MI, increased ICP, athlete's heart, hypothermia, sleep apnea",
      "Tachycardia: pain, anxiety, fever, infection/sepsis, hypovolemia/hemorrhage, anemia, PE, hyperthyroidism, heart failure, dehydration, stimulant use",
      "Sick sinus syndrome: aging/fibrosis of SA node, coronary artery disease, post-cardiac surgery",
      "Both: electrolyte imbalances can affect SA node automaticity"
    ],
    diagnostics: [
      "Sinus bradycardia: regular rhythm, rate <60, normal P-QRS-T morphology, normal PR and QRS intervals",
      "Sinus tachycardia: regular rhythm, rate >100, normal P waves (may merge with preceding T waves at high rates), normal PR and QRS",
      "TSH: hypothyroidism (brady), hyperthyroidism (tachy)",
      "CBC: anemia (tachy)",
      "BMP: electrolytes, renal function",
      "Drug levels: digoxin if applicable",
      "Blood cultures, lactate: if sepsis suspected (tachy)",
      "CT pulmonary angiography: if PE suspected (tachy)",
      "Echocardiogram: if heart failure or structural disease suspected",
      "Holter monitor: for intermittent bradycardia or tachy-brady syndrome",
      "ICP monitoring: if Cushing's triad suspected (bradycardia + hypertension + irregular respirations)"
    ],
    management: [
      "Sinus bradycardia — asymptomatic: no treatment, monitor, review medications",
      "Sinus bradycardia — symptomatic: atropine 0.5 mg IV q3–5 min (max 3 mg); if refractory: dopamine 5–20 mcg/kg/min or epinephrine 2–10 mcg/min infusion; transcutaneous pacing",
      "Sinus bradycardia — medication-induced: hold/reduce offending agent; consider glucagon for beta-blocker toxicity, calcium for CCB toxicity",
      "Sick sinus syndrome: permanent pacemaker (dual-chamber preferred)",
      "Sinus tachycardia: TREAT THE UNDERLYING CAUSE — never cardiovert sinus tachycardia",
      "Sinus tachycardia from hypovolemia: fluid resuscitation",
      "Sinus tachycardia from pain: pain management",
      "Sinus tachycardia from fever: antipyretics, treat infection",
      "Sinus tachycardia from anemia: transfusion if indicated",
      "Sinus tachycardia from PE: anticoagulation, thrombolytics if massive",
      "Sinus tachycardia from anxiety: reassurance, anxiolytics if warranted",
      "Inappropriate sinus tachycardia (diagnosis of exclusion): ivabradine (If channel blocker) or beta-blockers"
    ],
    nursingActions: [
      "Bradycardia: assess hemodynamic impact — is the patient symptomatic (hypotension, dizziness, syncope, altered LOC, chest pain)?",
      "Review medication list for causative agents (beta-blockers, CCBs, digoxin, amiodarone)",
      "Keep atropine and transcutaneous pacemaker readily available for symptomatic bradycardia",
      "Bradycardia with increased ICP: recognize Cushing's triad (bradycardia + hypertension + irregular respirations) — this is a neurosurgical emergency",
      "Tachycardia: assess for and address the underlying cause — never assume sinus tachycardia is benign",
      "Obtain orthostatic vital signs if hypovolemia suspected",
      "Assess for hemorrhage: surgical sites, GI bleed (melena, hematemesis), retroperitoneal (flank ecchymosis)",
      "Monitor I&O and fluid balance in tachycardic patients",
      "Assess pain using appropriate scale and treat accordingly",
      "Continuous telemetry monitoring for both brady and tachy",
      "Educate patients on when to seek medical attention for heart rate changes",
      "Document rate, rhythm, associated symptoms, interventions, and patient response"
    ],
    assessmentFindings: [
      "Bradycardia symptoms: dizziness, lightheadedness, syncope, fatigue, exercise intolerance, hypotension, confusion, chest pain",
      "Asymptomatic bradycardia: common in athletes and during sleep — normal variant",
      "Tachycardia symptoms: palpitations, anxiety, diaphoresis, dyspnea, chest pain",
      "Tachycardia signs of underlying cause: fever, hypotension (hypovolemia), pallor (anemia), pleuritic chest pain (PE)",
      "Cushing's triad: bradycardia + hypertension + irregular respirations = increased ICP emergency"
    ],
    signs: {
      left: [
        "Sinus bradycardia: regular, rate <60, normal P-QRS-T",
        "Sinus tachycardia: regular, rate >100, normal P-QRS-T",
        "P waves present before every QRS in both",
        "PR interval normal (0.12–0.20 sec) in both",
        "QRS narrow (<0.12 sec) in both",
        "Rhythm originates from SA node in both — sinus origin confirmed"
      ],
      right: [
        "Symptomatic bradycardia requires intervention — asymptomatic does not",
        "Sinus tachycardia is always a response — find and treat the cause",
        "NEVER cardiovert sinus tachycardia",
        "Cushing's triad = bradycardia is an ominous sign of brainstem herniation",
        "Tachy-brady syndrome suggests sick sinus syndrome — needs pacemaker",
        "Persistent unexplained tachycardia may be early sign of sepsis, PE, or hemorrhage"
      ]
    },
    medications: [
      { name: "Atropine Sulfate", type: "Anticholinergic", action: "Blocks vagal input to SA and AV nodes, increasing heart rate", sideEffects: "Tachycardia, dry mouth, urinary retention, blurred vision", contra: "Angle-closure glaucoma, obstructive uropathy", pearl: "First-line for symptomatic sinus bradycardia. 0.5 mg IV q3–5 min, max 3 mg. Ineffective if bradycardia is from infranodal block. Paradoxical worsening at doses <0.5 mg." },
      { name: "Glucagon", type: "Antidote", action: "Bypasses beta-receptors via activation of adenylate cyclase through glucagon receptors, increasing heart rate and contractility", sideEffects: "Nausea, vomiting, hyperglycemia", contra: "Pheochromocytoma, insulinoma", pearl: "Antidote for beta-blocker toxicity causing bradycardia. 3–10 mg IV bolus followed by infusion. Works independently of beta-receptors — effective even with complete beta-blockade." },
      { name: "Calcium Chloride/Gluconate", type: "Antidote", action: "Antagonizes the cardiovascular effects of calcium channel blocker toxicity", sideEffects: "Bradycardia (if given too fast), tissue necrosis (CaCl extravasation)", contra: "Digoxin toxicity (can worsen), hypercalcemia", pearl: "Antidote for CCB toxicity causing bradycardia/hypotension. Calcium chloride has 3x more elemental calcium than gluconate but requires central line (vesicant). Calcium gluconate can be given peripherally." },
      { name: "Ivabradine (Corlanor)", type: "If (Funny) Channel Blocker", action: "Selectively inhibits the If current in the SA node, reducing heart rate without affecting BP or contractility", sideEffects: "Bradycardia, visual disturbances (phosphenes), AFib", contra: "Acute decompensated HF, severe hepatic impairment, pacemaker-dependent, strong CYP3A4 inhibitors", pearl: "Used for inappropriate sinus tachycardia (diagnosis of exclusion) and heart failure with HR ≥70 despite max beta-blocker. Unique: reduces HR without affecting blood pressure or contractility." }
    ],
    pearls: [
      "Sinus bradycardia in athletes is physiologic and requires no treatment — the heart is efficient",
      "Symptomatic bradycardia = bradycardia CAUSING symptoms (not just slow rate in a symptomatic patient)",
      "Atropine is first-line for symptomatic bradycardia; pacing for refractory cases",
      "NEVER cardiovert or shock sinus tachycardia — it is a compensatory response, not a primary arrhythmia",
      "Sinus tachycardia treatment = treat the cause: fluids for hypovolemia, antipyretics for fever, pain meds for pain",
      "Cushing's triad (bradycardia + HTN + abnormal respirations) = increased ICP — notify neurosurgery STAT",
      "Unexplained persistent sinus tachycardia should trigger investigation: PE? Hemorrhage? Sepsis? Cardiac tamponade?",
      "Fever increases HR ~10 bpm per 1°F (or ~8 bpm per 1°C) above normal",
      "Sick sinus syndrome (tachy-brady) requires a permanent pacemaker — medications alone can't safely manage both",
      "NCLEX tip: sinus tachycardia questions test whether you know to treat the underlying cause, NOT the heart rate"
    ],
    quiz: [
      { question: "A well-conditioned athlete presents with a resting heart rate of 48 bpm, regular sinus rhythm, and no symptoms. The nurse should:", options: ["Administer atropine immediately", "Prepare for transcutaneous pacing", "Document as a normal finding and continue monitoring", "Call a rapid response"], correct: 2, rationale: "Sinus bradycardia in well-conditioned athletes is a normal physiologic finding due to increased vagal tone and cardiac efficiency. No treatment is needed if the patient is asymptomatic." },
      { question: "A post-operative patient has a heart rate of 118 bpm, BP 88/56, and urine output of 15 mL/hr. The nurse suspects the sinus tachycardia is caused by:", options: ["Anxiety about surgery", "Hypovolemia or hemorrhage", "Pain medication overdose", "Normal post-anesthesia recovery"], correct: 1, rationale: "Sinus tachycardia with hypotension and oliguria in a post-operative patient strongly suggests hypovolemia or hemorrhage. The tachycardia is a compensatory response to maintain cardiac output. The priority is fluid resuscitation and assessment for bleeding." },
      { question: "The provider orders cardioversion for a patient with sinus tachycardia at 130 bpm. The nurse should:", options: ["Prepare the defibrillator in synchronized mode", "Question the order — sinus tachycardia should not be cardioverted", "Administer adenosine first", "Proceed with cardioversion after sedation"], correct: 1, rationale: "Sinus tachycardia should NEVER be cardioverted. It is a physiologic response to an underlying condition. Cardioversion would be inappropriate and potentially dangerous. The nurse should question this order and advocate for identifying and treating the underlying cause." },
      { question: "Cushing's triad includes:", options: ["Tachycardia, hypotension, and fever", "Bradycardia, hypertension, and irregular respirations", "Tachycardia, hypertension, and seizures", "Bradycardia, hypotension, and tachypnea"], correct: 1, rationale: "Cushing's triad (bradycardia + systolic hypertension + irregular/abnormal respirations) is a late sign of increased intracranial pressure indicating brainstem herniation. This is a neurosurgical emergency." },
      { question: "Which medication is the antidote for beta-blocker toxicity causing symptomatic bradycardia?", options: ["Atropine", "Glucagon", "Protamine", "Flumazenil"], correct: 1, rationale: "Glucagon is the specific antidote for beta-blocker toxicity. It works by activating adenylate cyclase through glucagon receptors, bypassing the blocked beta-receptors. It increases heart rate and contractility independent of beta-receptor availability." },
      { question: "A patient with sick sinus syndrome alternates between heart rates of 40 bpm and 140 bpm. The definitive treatment is:", options: ["Continuous atropine infusion", "Beta-blocker therapy", "Permanent dual-chamber pacemaker", "Radiofrequency ablation"], correct: 2, rationale: "Sick sinus syndrome with tachy-brady pattern requires a permanent pacemaker to maintain adequate heart rate during bradycardic episodes. Once the pacemaker prevents dangerous bradycardia, medications can be used to control the tachycardic episodes." }
    ]
  }
};
