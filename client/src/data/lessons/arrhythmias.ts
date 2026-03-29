import { getAssetUrl } from "@/lib/asset-url";
import type { LessonContent } from "./types";

const imgLethalDysrhythmias = getAssetUrl("lethaldysrhythmias_1773517523349.png");
const imgFirstDegreeBlock = getAssetUrl("firstdegreeblock_1773517432559.png");
const imgBBB = getAssetUrl("BBB_1773517432559.png");

export const arrhythmiaLessons: Record<string, LessonContent> = {
  "normal-sinus-rhythm": {
    title: "Normal Sinus Rhythm (NSR)",
    cellular: { title: "Electrophysiologic Basis", content: "Sinus rhythm originates from the sinoatrial (SA) node, located in the high right atrium near the superior vena cava. The SA node is the heart's primary pacemaker due to its highest intrinsic automaticity (60-100 bpm), which suppresses slower pacemakers via overdrive suppression (AV node: 40-60 bpm, ventricular pacemakers: 20-40 bpm). The impulse sequence is: SA node generates impulse, atrial depolarization produces the P wave, impulse reaches AV node (physiologic delay), conducts through Bundle of His, travels down right and left bundle branches, and Purkinje fibers depolarize ventricles producing the QRS complex. Sinus rhythm refers to origin, not rate. Sinus rhythm is modulated by the autonomic nervous system: sympathetic stimulation increases SA node firing rate, shortens PR interval, and increases heart rate (exercise, anxiety, hypotension, pain); parasympathetic (vagal) stimulation decreases SA node firing, slows AV conduction, and prolongs PR interval (sleep, carotid massage, Valsalva maneuver). Normal physiologic variation includes respiratory sinus arrhythmia (rate increase with inspiration, decrease with expiration), reflecting intact autonomic balance." },
    riskFactors: ["Understanding NSR is the baseline for identifying all arrhythmias", "Rate outside 60-100 bpm with normal morphology may indicate sinus bradycardia or sinus tachycardia", "Every P wave should be followed by a QRS complex in 1:1 ratio", "PR interval should be consistent at 0.12-0.20 seconds", "QRS complex should be narrow at less than 0.12 seconds", "Mild respiratory variation (respiratory sinus arrhythmia) is a normal physiologic variant", "Sinus rhythm supports effective atrial kick, optimal ventricular filling, and adequate cardiac output", "Loss of sinus rhythm may reduce stroke volume by up to 20-30%, especially in older adults"],
    diagnostics: ["12-lead ECG showing regular P-QRS-T pattern", "Heart rate 60-100 bpm", "PR interval 0.12-0.20 seconds (3-5 small boxes)", "QRS duration less than 0.12 seconds (less than 3 small boxes)", "P waves upright and rounded in lead II, upright in aVF, negative in aVR", "P wave duration less than 0.12 sec, amplitude less than 2.5 mm", "Each P wave followed by one QRS complex (1:1 ratio)", "Regular R-R intervals (vary by 1.5 small boxes or less)", "QT interval appropriate for rate"],
    management: ["NSR is the target rhythm — no treatment needed", "Document baseline rhythm strip for comparison", "Continue monitoring if patient is on telemetry", "Report any deviation from NSR pattern", "Know the patient's baseline rhythm", "Five-step systematic interpretation: calculate rate, assess rhythm regularity, identify P waves, measure PR interval, measure QRS width"],
    nursingActions: ["Verify correct lead placement for accurate monitoring", "Assess patient's hemodynamic status even with NSR present", "Document rhythm strip once per shift and with any changes", "Correlate rhythm with clinical presentation", "Ensure monitor alarms are set to appropriate parameters", "Apply the five-step rhythm analysis method systematically to every rhythm strip", "Confirm sinus origin by checking P wave morphology in lead II"],
    signs: {
      left: ["Regular pulse rate 60-100 bpm", "Consistent pulse rhythm", "Normal blood pressure", "No symptoms of decreased cardiac output", "Upright uniform P waves in lead II", "Constant PR interval (0.12-0.20 sec)"],
      right: ["Any irregularity warrants further assessment", "Rate outside 60-100 with normal morphology = sinus variant", "Widened QRS may indicate bundle branch block", "Absent P waves indicate non-sinus origin", "Inverted P waves suggest junctional or ectopic atrial origin", "Variable PR interval must be reported and described"]
    },
    medications: [
      { name: "No Medications Required", type: "Baseline Rhythm", action: "NSR requires no pharmacological intervention", sideEffects: "N/A", contra: "N/A", pearl: "NSR is the gold standard. Know this rhythm inside and out — it is your baseline for identifying every abnormality. Sinus rhythm indicates intact SA node automaticity, functional AV conduction, organized atrial depolarization, and coordinated ventricular contraction." }
    ],
    pearls: ["Every ECG interpretation starts with the five-step method: rhythm regularity, heart rate, P wave morphology, PR interval, QRS complex", "The 1500 method is the most precise for regular rhythms: Heart Rate = 1500 / number of small boxes between R waves", "The 6-second method for irregular rhythms: count QRS complexes in 6 seconds and multiply by 10", "PR interval greater than 0.20 sec = first-degree heart block, even if otherwise normal", "Sinus rhythm refers to origin, not rate — a rhythm can be sinus and still be slow or fast", "The presence of consistent upright P waves in lead II is the strongest indicator of sinus origin", "A rhythm may appear regular but not be sinus — always analyze P waves first", "Common exam pitfall: assuming all regular rhythms are sinus without checking P wave morphology", "Cardiac output = Heart rate x Stroke volume; in sinus rhythm, atrial kick contributes to ventricular filling (especially important in diastolic dysfunction)"],
    quiz: [
      { question: "What is the normal PR interval range?", options: ["0.06-0.10 seconds", "0.12-0.20 seconds", "0.20-0.40 seconds", "0.04-0.08 seconds"], correct: 1, rationale: "Normal PR interval is 0.12-0.20 seconds (3-5 small boxes on ECG paper). Prolongation beyond 0.20 seconds indicates first-degree AV block." },
      { question: "In normal sinus rhythm, what is the relationship between P waves and QRS complexes?", options: ["2:1 ratio", "1:1 ratio with each P followed by a QRS", "No consistent relationship", "P waves are absent"], correct: 1, rationale: "In NSR, each SA node impulse produces one P wave followed by one QRS complex in a consistent 1:1 ratio." },
      { question: "A patient's rhythm strip shows regular rhythm, rate 78, P waves present before each QRS, PR interval 0.16 sec, QRS 0.08 sec. This rhythm is:", options: ["Sinus bradycardia", "Atrial fibrillation", "Normal sinus rhythm", "First-degree AV block"], correct: 2, rationale: "All parameters are within normal limits: rate 60-100, regular rhythm, 1:1 P-QRS ratio, PR 0.12-0.20, QRS less than 0.12. This is NSR." },
      { question: "Which lead is the standard reference for confirming sinus origin of a rhythm?", options: ["Lead V1", "Lead III", "Lead II", "Lead aVL"], correct: 2, rationale: "Lead II is the standard reference lead for rhythm monitoring. Normal sinus P waves are upright, rounded, and uniform in lead II. This confirms the impulse originates from the SA node." },
      { question: "Using the 1500 method, if there are 25 small boxes between two consecutive R waves, the heart rate is:", options: ["25 bpm", "60 bpm", "75 bpm", "100 bpm"], correct: 1, rationale: "Heart Rate = 1500 / 25 small boxes = 60 bpm. The 1500 method is the most precise calculation for regular rhythms." },
      { question: "Respiratory sinus arrhythmia is characterized by:", options: ["Irregular rhythm indicating cardiac disease", "Rate increase with inspiration and decrease with expiration", "Absent P waves during breathing", "Widened QRS during deep breaths"], correct: 1, rationale: "Respiratory sinus arrhythmia is a normal physiologic variant where the heart rate increases slightly with inspiration and decreases with expiration, reflecting intact autonomic balance." }
    ]
  },

  "sinus-bradycardia": {
    title: "Sinus Bradycardia",
    cellular: { title: "Decreased SA Node Automaticity", content: "Sinus bradycardia is a sinus rhythm with a heart rate less than 60 beats per minute. The rhythm originates in the SA node, just like normal sinus rhythm — the only distinguishing feature is the slower rate. The SA node normally fires at 60-100 bpm; in sinus bradycardia, the SA node is still the pacemaker, but its firing rate is decreased while still overriding lower pacemakers (AV node: 40-60 bpm, ventricular: 20-40 bpm). All five steps of rhythm analysis remain normal except rate. The conduction pathway is intact: SA node to AV node to Bundle of His to Purkinje fibers. Cardiac Output = Heart Rate x Stroke Volume. If heart rate drops significantly, cardiac output decreases, blood pressure falls, and organ perfusion decreases. Older adults and patients with heart failure are more vulnerable to low-rate effects." },
    riskFactors: ["Inferior wall myocardial infarction (right coronary artery supplies SA node)", "Beta-blocker or calcium channel blocker therapy", "Digoxin toxicity", "Amiodarone therapy", "Hypothyroidism", "Hypothermia", "Increased intracranial pressure (Cushing reflex)", "Athletic heart (trained athletes at rest — high vagal tone)", "Vagal stimulation (vomiting, bearing down, carotid massage)", "Sleep/rest/relaxation/meditation (physiological)", "SA node ischemia", "Sick sinus syndrome"],
    diagnostics: ["ECG showing rate less than 60 bpm with normal P-QRS-T morphology", "R-R intervals are regular and constant", "Using the 1500 method: Heart Rate = 1500 / number of small boxes between R waves; if result less than 60 = bradycardia confirmed", "P waves upright and uniform in lead II, present before every QRS", "1:1 P:QRS relationship maintained", "PR interval 0.12-0.20 seconds and constant", "QRS duration 0.06-0.10 seconds, narrow and uniform", "Monitor serum digoxin levels if applicable", "Check thyroid function (TSH, free T4)", "Monitor electrolytes (potassium, calcium)"],
    management: ["Assess hemodynamic stability first — symptomatic or asymptomatic?", "If asymptomatic: observe and monitor, identify cause, review medications, no treatment needed", "If symptomatic: assess airway, breathing, circulation", "Administer oxygen as needed", "Establish IV access", "Obtain 12-lead ECG", "Administer atropine 0.5 mg IV as ordered (first-line per ACLS protocol)", "Hold beta-blockers, calcium channel blockers, or digoxin if contributing", "Prepare for transcutaneous pacing if atropine ineffective", "Persistent symptomatic bradycardia may require permanent pacemaker placement", "Identify and treat underlying cause"],
    nursingActions: ["Assess for symptoms of decreased cardiac output (dizziness, syncope, fatigue, hypotension, confusion)", "Monitor vital signs frequently during symptomatic episodes", "Have atropine at bedside for symptomatic bradycardia", "Review medication administration record for rate-lowering drugs", "Report heart rate below 50 or symptomatic bradycardia immediately", "Document rhythm strip and patient symptoms", "Ensure transcutaneous pacing pads are available", "Apply five-step rhythm analysis to confirm sinus origin and rule out junctional rhythm or AV block"],
    assessmentFindings: ["Heart rate below 60 bpm on palpation and monitor", "Regular rhythm on auscultation", "Possible hypotension if hemodynamically significant", "Cool, pale skin if cardiac output compromised", "Dizziness or lightheadedness reported by patient", "Fatigue and exercise intolerance"],
    signs: {
      left: ["Heart rate below 60 bpm", "Normal P-QRS-T morphology — only the rate is abnormal", "Regular rhythm", "May be asymptomatic in athletes", "Upright uniform P waves in lead II", "1:1 P:QRS ratio maintained"],
      right: ["Syncope or near-syncope", "Hypotension (SBP less than 90)", "Altered mental status", "Chest pain from decreased coronary perfusion", "HR less than 40 bpm with symptoms is dangerous", "Pauses accompanying bradycardia", "Severe bradycardia may lead to cardiogenic shock"]
    },
    medications: [
      { name: "Atropine", type: "Anticholinergic", action: "Blocks vagal (parasympathetic) stimulation of the SA node, increasing heart rate", sideEffects: "Tachycardia, dry mouth, urinary retention, blurred vision", contra: "Glaucoma, myasthenia gravis", pearl: "First-line for symptomatic bradycardia. Give 0.5 mg IV every 3-5 minutes. Maximum total dose 3 mg. Doses less than 0.5 mg may cause paradoxical bradycardia." },
      { name: "Dopamine", type: "Sympathomimetic", action: "At 5-20 mcg/kg/min increases heart rate and contractility via beta-1 stimulation", sideEffects: "Tachycardia, hypertension, tissue necrosis if extravasation", contra: "Pheochromocytoma, uncorrected tachyarrhythmia", pearl: "Second-line for symptomatic bradycardia unresponsive to atropine. Infuse via central line when possible." },
      { name: "Epinephrine", type: "Sympathomimetic", action: "Stimulates beta-1 receptors increasing heart rate and contractility", sideEffects: "Severe tachycardia, hypertension, anxiety, arrhythmias", contra: "Use with extreme caution in coronary artery disease", pearl: "Epinephrine infusion 2-10 mcg/min is an alternative to dopamine for symptomatic bradycardia when atropine fails." }
    ],
    pearls: ["Sinus bradycardia differs from normal sinus rhythm only by rate — all other parameters are identical", "Symptomatic vs asymptomatic determines treatment — never treat the monitor, treat the patient", "Athletes commonly have resting heart rates of 40-50 bpm and this is normal for them", "Inferior MI commonly causes bradycardia because the right coronary artery supplies the SA node in 60% of people", "Atropine will NOT work in transplanted hearts (no vagal innervation) — go directly to pacing or chronotropic agents", "Cushing triad (bradycardia + hypertension + irregular respirations) = increased ICP emergency", "Differentiate from junctional rhythm (P waves absent or inverted, rate 40-60) and second-degree AV block (dropped QRS complexes, PR interval abnormalities) — sinus bradycardia maintains 1:1 conduction"],
    quiz: [
      { question: "First-line treatment for symptomatic sinus bradycardia?", options: ["Dopamine infusion", "Transcutaneous pacing", "Atropine 0.5 mg IV", "Epinephrine 1 mg IV push"], correct: 2, rationale: "Atropine 0.5 mg IV is the first-line drug for symptomatic bradycardia per ACLS guidelines. It blocks vagal tone to increase SA node firing rate." },
      { question: "Which condition most commonly causes sinus bradycardia as a complication?", options: ["Anterior wall MI", "Inferior wall MI", "Pulmonary embolism", "Aortic stenosis"], correct: 1, rationale: "Inferior wall MI involves the right coronary artery, which supplies the SA node in most people, making bradycardia a common complication." },
      { question: "A well-conditioned athlete presents with a heart rate of 48 bpm, regular rhythm, normal P waves, BP 118/72. The nurse should:", options: ["Administer atropine immediately", "Prepare for transcutaneous pacing", "Document findings — this is a normal variant", "Hold all medications and notify physician"], correct: 2, rationale: "Bradycardia in a trained athlete is physiological due to increased vagal tone and stroke volume. The patient is asymptomatic with normal BP. No intervention is needed." },
      { question: "How does sinus bradycardia differ from a junctional rhythm?", options: ["Sinus bradycardia has irregular R-R intervals", "Junctional rhythm has absent or inverted P waves", "Sinus bradycardia has wide QRS complexes", "There is no difference"], correct: 1, rationale: "In sinus bradycardia, P waves are upright and uniform in lead II with 1:1 P:QRS ratio. In junctional rhythm, P waves are absent, inverted, or appear after the QRS because the impulse originates from the AV junction, not the SA node." },
      { question: "Sinus bradycardia becomes an emergency when:", options: ["Heart rate is 58 bpm in a sleeping patient", "Heart rate is less than 40 bpm with hypotension and syncope", "The patient is an athlete with HR of 45 bpm", "PR interval is 0.18 seconds"], correct: 1, rationale: "Sinus bradycardia is dangerous when the rate is very slow (less than 40 bpm) with symptoms of hemodynamic compromise including hypotension, syncope, chest pain, or altered level of consciousness." }
    ]
  },

  "sinus-tachycardia": {
    title: "Sinus Tachycardia",
    cellular: { title: "Increased SA Node Automaticity", content: "Sinus tachycardia is a sinus rhythm with a heart rate greater than 100 beats per minute. The electrical impulse originates from the SA node, just as in normal sinus rhythm — the only defining difference is the rate. The SA node automaticity increases due to sympathetic tone rising and parasympathetic tone decreasing, resulting in faster impulse formation but normal conduction pathways. Typical rate range is 100-160 bpm (occasionally higher in young patients). Sinus tachycardia is almost always a compensatory response to an underlying stimulus, not a primary arrhythmia. Cardiac Output = Heart Rate x Stroke Volume. When stroke volume falls (e.g., dehydration, hemorrhage), the body increases heart rate to maintain cardiac output. Persistent tachycardia increases myocardial oxygen demand, decreases diastolic filling time, and can worsen ischemia." },
    riskFactors: ["Fever (heart rate increases approximately 10 bpm per degree Celsius elevation)", "Pain and anxiety", "Hypovolemia and hemorrhage", "Hypoxia", "Anemia", "Heart failure", "Hyperthyroidism", "Pulmonary embolism", "Sepsis", "Shock", "Sympathomimetic drugs (epinephrine, albuterol, cocaine, amphetamines)", "Caffeine and nicotine", "Emotional stress", "Exercise"],
    diagnostics: ["ECG showing rate above 100 bpm with normal P-QRS-T morphology", "R-R intervals are regular at equal intervals", "Using the 1500 method: Heart Rate = 1500 / number of small boxes between R waves; if result greater than 100 = tachycardia confirmed", "P waves upright and uniform in lead II, present before every QRS with 1:1 P:QRS ratio", "P waves may merge with preceding T waves at fast rates — increase paper speed to 50 mm/sec to separate complexes", "PR interval 0.12-0.20 seconds (may be difficult to measure if P buried in T)", "QRS duration 0.06-0.10 seconds, narrow and uniform", "Gradual onset and offset (unlike SVT which starts/stops abruptly)", "Investigate underlying cause: CBC, TSH, lactate, blood cultures if sepsis suspected", "Pulse oximetry to rule out hypoxia"],
    management: ["Identify and treat the underlying cause — this is the priority (treat the cause, not the rate)", "Initial approach: assess airway, breathing, circulation; obtain vital signs; establish IV access; perform 12-lead ECG; identify precipitating factors", "Fever: antipyretics, cooling measures", "Hypovolemia: fluid resuscitation as ordered", "Pain: appropriate analgesics", "Hypoxia: supplemental oxygen", "Anemia: blood products as ordered", "Sepsis: antibiotics", "Do NOT give rate-controlling drugs for compensatory sinus tachycardia without treating cause", "Rate-control medications are rarely indicated unless tachycardia is inappropriate or causing instability"],
    nursingActions: ["Assess for underlying cause before attempting to slow rate", "Monitor vital signs including temperature", "Assess for signs of hemorrhage or fluid loss", "Monitor oxygen saturation", "Report persistent unexplained tachycardia to provider", "Monitor for signs of cardiac decompensation (chest pain, heart failure symptoms)", "Maintain adequate IV access for fluid resuscitation if needed", "Apply five-step rhythm analysis to confirm sinus origin and differentiate from SVT"],
    signs: {
      left: ["Heart rate above 100 bpm", "Regular rhythm, normal morphology — only the rate is abnormal", "Gradual onset and gradual termination (not sudden)", "Palpitations reported by patient", "Visible upright P waves preceding each QRS", "Rate usually less than 160 bpm in adults"],
      right: ["Persistent tachycardia despite treatment = reassess for missed cause", "Chest pain (increased myocardial oxygen demand)", "Hypotension (inadequate filling time)", "Dyspnea and lightheadedness", "Signs of the underlying cause (fever, bleeding, anxiety)", "Rate persistently above 130-140 bpm at rest is concerning"]
    },
    medications: [
      { name: "Treat the Cause", type: "Primary Approach", action: "Sinus tachycardia resolves when the trigger resolves", sideEffects: "N/A", contra: "N/A", pearl: "Never cardiovert sinus tachycardia. Never give adenosine for sinus tachycardia. Treating the rhythm without treating the cause can be fatal — a patient in hemorrhagic shock NEEDS tachycardia to maintain cardiac output." },
      { name: "Beta-Blockers (Metoprolol)", type: "Rate Control", action: "Slows SA node firing and AV conduction", sideEffects: "Hypotension, bradycardia, bronchospasm", contra: "Decompensated heart failure, asthma, hypotension", pearl: "Only appropriate when the cause is treated but tachycardia persists, or in thyroid storm. Never use to treat compensatory tachycardia from hypovolemia." }
    ],
    pearls: ["Sinus tachycardia is a SYMPTOM, not a primary diagnosis — always find the cause", "The heart rate increases approximately 10 bpm for every 1 degree Celsius rise in temperature", "Persistent unexplained sinus tachycardia in a post-surgical patient should raise suspicion for PE, hemorrhage, or sepsis", "Sinus tachycardia has gradual onset/offset (like a dimmer switch); SVT starts and stops abruptly (like a light switch) — this is a key differentiator", "Never cardiovert sinus tachycardia — it will not work and delays treatment of the real problem", "Tachycardia is often the first sign of clinical deterioration", "Key distinguishing feature from SVT: visible normal P waves preceding each QRS, rate usually less than 160 bpm", "Persistent tachycardia increases myocardial oxygen demand and can worsen ischemia"],
    quiz: [
      { question: "A post-operative patient develops sinus tachycardia at 118 bpm. BP is 88/54. The priority nursing action is:", options: ["Administer metoprolol as ordered", "Assess for signs of hemorrhage and hypovolemia", "Prepare for cardioversion", "Administer adenosine 6 mg rapid IV push"], correct: 1, rationale: "Post-operative tachycardia with hypotension suggests hemorrhage or hypovolemia. The tachycardia is compensatory. Assess the cause first before any rhythm-directed treatment." },
      { question: "Which differentiates sinus tachycardia from SVT?", options: ["Heart rate above 150", "Absence of P waves", "Gradual onset and offset vs sudden onset/offset", "Wide QRS complexes"], correct: 2, rationale: "Sinus tachycardia has gradual onset and offset as the underlying stimulus increases or decreases. SVT starts and terminates abruptly, often triggered by a premature beat." },
      { question: "A patient with sinus tachycardia at 130 bpm is febrile at 39.5C. The most appropriate intervention is:", options: ["Administer metoprolol to slow the heart rate", "Administer antipyretics and cooling measures to treat the fever", "Perform synchronized cardioversion", "Administer adenosine to break the rhythm"], correct: 1, rationale: "Sinus tachycardia is compensatory. The fever is the underlying cause. Treating the fever with antipyretics and cooling measures will resolve the tachycardia. Rate-control drugs and cardioversion are inappropriate for sinus tachycardia." },
      { question: "Sinus tachycardia becomes concerning when:", options: ["Rate is 105 bpm during exercise", "Rate persistently exceeds 130-140 bpm at rest with hypotension and chest pain", "Rate increases from 70 to 90 bpm with mild anxiety", "P waves are visible before each QRS"], correct: 1, rationale: "Sinus tachycardia becomes dangerous when the rate is persistently above 130-140 bpm at rest with signs of hemodynamic compromise such as hypotension, chest pain, or signs of shock." }
    ]
  },

  "atrial-fibrillation-rn": {
    title: "Atrial Fibrillation (A-Fib)",
    cellular: { title: "Chaotic Atrial Electrical Activity", content: "Multiple re-entrant circuits fire simultaneously throughout the atria at rates of 350-600 per minute. The atria quiver instead of contracting effectively. The AV node acts as a gatekeeper, allowing only some impulses through, producing an irregularly irregular ventricular response. Without effective atrial contraction, blood pools in the atria, dramatically increasing the risk of mural thrombi. If a thrombus dislodges, it can embolize to the brain causing stroke — A-fib is responsible for approximately 15-20% of all ischemic strokes." },
    riskFactors: ["Hypertension (most common cause)", "Heart failure", "Valvular heart disease (especially mitral stenosis)", "Age over 65", "Obesity", "Obstructive sleep apnea", "Hyperthyroidism", "Binge alcohol use (Holiday Heart Syndrome)", "Pulmonary embolism", "Post-cardiac surgery", "Chronic lung disease"],
    diagnostics: ["ECG: absent P waves replaced by chaotic fibrillatory baseline", "Irregularly irregular R-R intervals (hallmark finding)", "Narrow QRS complexes (unless aberrant conduction)", "Check TSH to rule out thyrotoxicosis", "Echocardiogram to assess atrial size, ventricular function, and valvular disease", "CHA2DS2-VASc score to assess stroke risk and guide anticoagulation"],
    management: ["Two primary goals: rate control and stroke prevention", "Rate control: target resting heart rate below 110 bpm", "Rhythm control: consider cardioversion if onset less than 48 hours", "If onset unknown or greater than 48 hours: anticoagulate for 3+ weeks before cardioversion (or TEE to rule out thrombus)", "Anticoagulation based on CHA2DS2-VASc score", "Hemodynamically unstable A-fib: immediate synchronized cardioversion"],
    nursingActions: ["Monitor heart rate and rhythm continuously — verify irregularly irregular pattern", "Assess for signs of decreased cardiac output (dizziness, fatigue, dyspnea)", "Monitor for signs of stroke (facial droop, arm weakness, speech difficulty — use FAST assessment)", "Administer anticoagulants as prescribed and monitor for bleeding", "Monitor INR if on warfarin (goal 2.0-3.0)", "Educate patient on pulse checking at home", "Report new onset A-fib or rapid ventricular response immediately", "Assess for signs of heart failure exacerbation"],
    assessmentFindings: ["Irregularly irregular pulse on palpation", "Pulse deficit (apical rate higher than radial rate)", "Varying intensity of S1 heart sound", "Possible hypotension if rapid ventricular response", "Possible jugular venous distention", "Possible crackles if heart failure present"],
    signs: {
      left: ["Irregularly irregular pulse (hallmark)", "Palpitations", "Fatigue and exercise intolerance", "Dyspnea on exertion"],
      right: ["Stroke symptoms (FAST: Face, Arms, Speech, Time)", "Rapid ventricular response (HR above 150)", "Hemodynamic instability", "Acute heart failure exacerbation"]
    },
    medications: [
      { name: "Diltiazem", type: "Calcium Channel Blocker", action: "Slows AV node conduction to control ventricular rate", sideEffects: "Hypotension, bradycardia, peripheral edema", contra: "Heart failure with reduced EF, hypotension, WPW", pearl: "First-line for rate control in A-fib. Can give IV bolus 0.25 mg/kg then infusion. Monitor BP closely during IV administration." },
      { name: "Metoprolol", type: "Beta-Blocker", action: "Slows AV node conduction and reduces heart rate", sideEffects: "Hypotension, bradycardia, fatigue, bronchospasm", contra: "Decompensated HF, asthma, severe bradycardia", pearl: "Alternative first-line for rate control. Preferred over diltiazem in patients with heart failure with reduced EF." },
      { name: "Amiodarone", type: "Antiarrhythmic (Class III)", action: "Prolongs action potential and refractory period, slows conduction", sideEffects: "Pulmonary fibrosis, thyroid dysfunction, hepatotoxicity, corneal deposits, photosensitivity", contra: "Severe sinus node dysfunction, second/third degree heart block", pearl: "Used for rhythm control (converting to and maintaining sinus rhythm). Long half-life (40-55 days). Requires baseline PFTs, TFTs, LFTs, and eye exam." },
      { name: "Apixaban (Eliquis)", type: "Direct Oral Anticoagulant (DOAC)", action: "Inhibits Factor Xa to prevent thrombus formation", sideEffects: "Bleeding, bruising", contra: "Active pathological bleeding, prosthetic heart valve", pearl: "Preferred over warfarin for stroke prevention in non-valvular A-fib. No routine INR monitoring needed. Reversal agent: andexanet alfa." },
      { name: "Warfarin", type: "Vitamin K Antagonist", action: "Inhibits vitamin K-dependent clotting factors (II, VII, IX, X)", sideEffects: "Bleeding, skin necrosis", contra: "Pregnancy, active bleeding", pearl: "Target INR 2.0-3.0 for A-fib. Required for valvular A-fib (mechanical valves, mitral stenosis). Multiple drug and food interactions (vitamin K foods)." }
    ],
    pearls: ["A-fib is the most common sustained arrhythmia — you will see it constantly in clinical practice", "Irregularly irregular = A-fib until proven otherwise", "The biggest danger of A-fib is STROKE, not the rhythm itself — anticoagulation is critical", "CHA2DS2-VASc score determines anticoagulation need: CHF, Hypertension, Age 75+, Diabetes, Stroke/TIA history, Vascular disease, Age 65-74, Sex category (female)", "Holiday Heart: binge drinking can trigger A-fib in patients with no cardiac history", "Never cardiovert A-fib of unknown duration without anticoagulation or TEE — risk of embolizing an atrial thrombus"],
    lifespan: { title: "Age-Related Considerations", content: "A-fib prevalence increases dramatically with age, affecting up to 10% of people over 80. Elderly patients have higher stroke risk and higher bleeding risk from anticoagulation, requiring careful CHA2DS2-VASc and HAS-BLED scoring. Falls risk must be assessed before starting anticoagulation. DOACs are generally preferred over warfarin in elderly patients due to lower intracranial hemorrhage risk." },
    quiz: [
      { question: "The hallmark ECG finding of atrial fibrillation is:", options: ["Sawtooth flutter waves", "Absent P waves with irregularly irregular rhythm", "Widened QRS complexes", "Peaked T waves"], correct: 1, rationale: "A-fib is characterized by absent distinct P waves (replaced by chaotic fibrillatory baseline) and irregularly irregular R-R intervals. This is the single most important finding to identify." },
      { question: "A patient in A-fib with unknown onset duration is being considered for cardioversion. What must occur first?", options: ["Administer adenosine 6 mg IV push", "Anticoagulate for at least 3 weeks or perform TEE to rule out atrial thrombus", "Administer amiodarone 300 mg IV", "Perform carotid massage"], correct: 1, rationale: "Cardioverting A-fib of unknown or prolonged duration without prior anticoagulation risks dislodging an atrial thrombus, causing stroke. Must anticoagulate for 3+ weeks or perform TEE to exclude thrombus first." },
      { question: "Which assessment tool guides anticoagulation decisions in atrial fibrillation?", options: ["Glasgow Coma Scale", "CHA2DS2-VASc score", "APACHE II score", "Braden Scale"], correct: 1, rationale: "CHA2DS2-VASc score assesses stroke risk in A-fib patients and guides the decision to anticoagulate. A score of 2 or more in males (3 or more in females) generally warrants anticoagulation." }
    ]
  },

  "atrial-flutter-rn": {
    title: "Atrial Flutter",
    cellular: { title: "Single Re-entrant Circuit", content: "Unlike A-fib's multiple chaotic circuits, atrial flutter involves a single macro-reentrant circuit, typically circling around the tricuspid valve annulus in the right atrium. This circuit fires at approximately 300 bpm, producing the characteristic sawtooth flutter waves on ECG. The AV node cannot conduct all 300 impulses, so it blocks in a fixed ratio — most commonly 2:1 (ventricular rate around 150), but also 3:1, 4:1, or variable. The regular sawtooth pattern and fixed conduction ratio distinguish flutter from fibrillation." },
    riskFactors: ["Heart failure", "Chronic lung disease (COPD, pulmonary hypertension)", "Mitral or tricuspid valve disease", "Post-cardiac surgery (especially atrial surgery)", "Hypertension", "Thyrotoxicosis", "Alcohol use", "Obesity", "Often coexists with or converts to atrial fibrillation"],
    diagnostics: ["ECG: classic sawtooth flutter waves (F waves) best seen in leads II, III, aVF, and V1", "Atrial rate approximately 300 bpm", "Ventricular rate depends on conduction ratio (typically 150 with 2:1 block)", "Regular ventricular rhythm if fixed conduction ratio", "Narrow QRS complexes (unless aberrant conduction)", "Carotid massage or adenosine may temporarily increase AV block to reveal hidden flutter waves"],
    management: ["Rate control similar to A-fib (beta-blockers, calcium channel blockers)", "Cardioversion: flutter often converts with lower energy (50-100 J synchronized)", "Anticoagulation guidelines same as A-fib (CHA2DS2-VASc scoring)", "Catheter ablation is highly effective and often curative for typical flutter", "Ibutilide IV for pharmacological cardioversion", "Address underlying cause"],
    nursingActions: ["Monitor heart rate and rhythm continuously", "Assess for symptoms of decreased cardiac output", "Administer rate-controlling medications as prescribed", "Monitor for conversion to A-fib (common)", "Assess for stroke symptoms — same thromboembolic risk as A-fib", "Prepare for possible cardioversion or ablation", "Monitor anticoagulation therapy", "Document rhythm strip with measurement of flutter wave rate"],
    signs: {
      left: ["Regular pulse (if fixed conduction ratio)", "Palpitations and fluttering sensation", "Sawtooth waves on ECG (pathognomonic)", "Heart rate often exactly 150 bpm (2:1 conduction)"],
      right: ["Rapid ventricular response causing hemodynamic compromise", "Conversion to atrial fibrillation", "Stroke symptoms (same embolic risk as A-fib)", "Heart failure exacerbation"]
    },
    medications: [
      { name: "Diltiazem/Metoprolol", type: "Rate Control", action: "Slow AV node conduction to reduce ventricular rate", sideEffects: "Hypotension, bradycardia", contra: "Hypotension, WPW, decompensated HF (diltiazem)", pearl: "Rate control is the initial strategy. A ventricular rate of exactly 150 bpm should always make you suspect atrial flutter with 2:1 block." },
      { name: "Ibutilide", type: "Antiarrhythmic (Class III)", action: "Prolongs action potential to terminate flutter circuit", sideEffects: "Torsades de Pointes (risk up to 8%)", contra: "Prolonged QTc, hypokalemia, hypomagnesemia", pearl: "IV ibutilide is the most effective drug for pharmacological cardioversion of flutter. Must monitor on telemetry for at least 4 hours after administration for QT prolongation and TdP." }
    ],
    pearls: ["If the ventricular rate is exactly 150 bpm, think atrial flutter with 2:1 block until proven otherwise", "Sawtooth flutter waves are best seen in leads II, III, aVF — if you don't see them, try changing leads", "Adenosine will NOT convert flutter to NSR, but it will briefly increase AV block to unmask flutter waves for diagnosis", "Atrial flutter and A-fib often coexist — a patient may alternate between the two", "Catheter ablation has a greater than 90% success rate for typical atrial flutter and is often considered first-line definitive therapy"],
    quiz: [
      { question: "The characteristic ECG pattern of atrial flutter is:", options: ["Absent P waves with irregular rhythm", "Sawtooth flutter waves at approximately 300 bpm", "Wide bizarre QRS complexes", "Peaked T waves with shortened QT"], correct: 1, rationale: "Atrial flutter produces a classic sawtooth pattern of flutter waves (F waves) at approximately 300 bpm, best seen in inferior leads (II, III, aVF)." },
      { question: "A patient on telemetry has a regular rhythm at exactly 150 bpm. The nurse should suspect:", options: ["Sinus tachycardia", "Atrial flutter with 2:1 conduction", "Ventricular tachycardia", "Supraventricular tachycardia"], correct: 1, rationale: "A regular rate of exactly 150 bpm is a classic presentation of atrial flutter with 2:1 conduction (atrial rate 300 / 2 = 150). This should always be on your differential." }
    ]
  },

  "svt-recognition": {
    title: "Supraventricular Tachycardia (SVT)",
    cellular: { title: "Re-entry Above the Ventricles", content: "SVT is a broad term for any tachyarrhythmia originating above the ventricles with a rate typically 150-250 bpm. The most common mechanism is AV nodal reentrant tachycardia (AVNRT), where the impulse travels in a circuit within or near the AV node. Another common type is AV reentrant tachycardia (AVRT) involving an accessory pathway (as in WPW syndrome). SVT starts and stops abruptly (paroxysmal), unlike sinus tachycardia which has gradual onset. The QRS is typically narrow because ventricular conduction is normal." },
    riskFactors: ["Young, otherwise healthy individuals (most common demographic)", "Caffeine, alcohol, and stimulant use", "Stress and anxiety", "Accessory pathway (Wolff-Parkinson-White syndrome)", "Mitral valve prolapse", "Pregnancy", "Hyperthyroidism", "Digoxin toxicity", "COPD"],
    diagnostics: ["ECG: narrow complex tachycardia, rate 150-250 bpm", "Regular rhythm", "P waves often buried in QRS or T waves (retrograde P waves)", "Abrupt onset and termination", "12-lead ECG during episode if possible", "Post-conversion ECG to look for delta waves (WPW)", "Electrophysiology study for recurrent SVT"],
    management: ["If hemodynamically STABLE: attempt vagal maneuvers first", "Vagal maneuvers: modified Valsalva (bear down), carotid massage (one side only, never bilateral), cold water to face (diving reflex)", "If vagal maneuvers fail: adenosine 6 mg rapid IV push (if no effect, 12 mg)", "If adenosine fails: diltiazem or beta-blocker IV", "If hemodynamically UNSTABLE: immediate synchronized cardioversion at 50-100 J", "Catheter ablation for recurrent SVT"],
    nursingActions: ["Assess hemodynamic stability immediately (BP, level of consciousness, chest pain)", "Attempt vagal maneuvers as first intervention if stable", "Have adenosine drawn up and ready with normal saline flush", "Adenosine MUST be given rapid IV push followed by immediate 20 mL NS flush (use stopcock technique)", "Use the IV site closest to the heart (antecubital preferred)", "Record continuous rhythm strip during adenosine administration", "Warn patient: adenosine causes brief sense of impending doom, chest pressure, and possible brief asystole — this is expected and transient", "Monitor for recurrence after conversion"],
    signs: {
      left: ["Sudden onset palpitations (patient often says 'my heart is racing')", "Heart rate 150-250 bpm, regular", "Anxiety and feeling of impending doom", "Lightheadedness"],
      right: ["Syncope", "Hypotension with altered mental status", "Chest pain (angina from rate-related ischemia)", "Pulmonary edema"]
    },
    medications: [
      { name: "Adenosine", type: "Endogenous Nucleoside", action: "Briefly blocks AV node conduction, breaking the re-entry circuit", sideEffects: "Transient asystole (3-6 seconds), flushing, chest tightness, dyspnea, sense of doom", contra: "Second/third degree heart block, sick sinus syndrome, asthma (relative — can cause bronchospasm)", pearl: "Half-life is less than 10 seconds. MUST give as rapid IV push followed by immediate 20 mL NS flush using a stopcock. Give in the most proximal IV site available. Brief asystole is EXPECTED and not a complication. Record rhythm strip continuously during administration." },
      { name: "Diltiazem", type: "Calcium Channel Blocker", action: "Slows AV node conduction if adenosine fails", sideEffects: "Hypotension, bradycardia", contra: "WPW with A-fib (can cause VF), hypotension, HF with reduced EF", pearl: "Second-line after adenosine for stable SVT. IV bolus 0.25 mg/kg over 2 minutes." },
      { name: "Verapamil", type: "Calcium Channel Blocker", action: "Slows AV node conduction, alternative to diltiazem", sideEffects: "Hypotension, bradycardia, constipation", contra: "WPW, heart failure, concurrent beta-blocker IV use", pearl: "Can be used as alternative to diltiazem. Do NOT give IV verapamil and IV beta-blockers together — risk of severe bradycardia and asystole." }
    ],
    pearls: ["SVT is abrupt onset/offset ('like a light switch'). Sinus tachycardia is gradual ('like a dimmer switch'). This history is diagnostic.", "The modified Valsalva maneuver (bearing down for 15 seconds then lying flat with legs elevated) has the highest vagal success rate", "Adenosine's half-life is less than 10 seconds — it MUST be given as the fastest IV push possible followed by immediate flush", "If adenosine reveals atrial flutter or A-fib instead of converting, you've made the diagnosis — it's not SVT", "Never give adenosine, diltiazem, or verapamil to wide-complex tachycardia that might be VT — these drugs can cause cardiovascular collapse"],
    quiz: [
      { question: "First-line drug treatment for stable SVT after vagal maneuvers fail?", options: ["Amiodarone 150 mg IV", "Adenosine 6 mg rapid IV push", "Epinephrine 1 mg IV", "Lidocaine 1 mg/kg IV"], correct: 1, rationale: "Adenosine 6 mg rapid IV push is first-line pharmacological treatment for stable SVT. If ineffective, a second dose of 12 mg may be given." },
      { question: "When administering adenosine, the nurse should:", options: ["Infuse slowly over 10 minutes", "Give rapid IV push followed by 20 mL NS flush", "Dilute in 250 mL NS and infuse over 30 minutes", "Give IM in the deltoid"], correct: 1, rationale: "Adenosine has a half-life of less than 10 seconds. It must reach the heart before being metabolized. Rapid IV push followed by immediate 20 mL NS flush using a stopcock is the only effective method." },
      { question: "A patient in SVT becomes unresponsive with BP 60/40. The priority intervention is:", options: ["Adenosine 6 mg rapid IV push", "Vagal maneuvers", "Synchronized cardioversion", "Amiodarone 300 mg IV"], correct: 2, rationale: "Hemodynamically unstable SVT (hypotension, altered consciousness, chest pain, heart failure) requires immediate synchronized cardioversion. Do not delay with drugs." }
    ]
  },

  "pvc-recognition": {
    title: "Premature Ventricular Contractions (PVCs)",
    cellular: { title: "Ectopic Ventricular Impulse", content: "A PVC occurs when an irritable focus in the ventricular myocardium fires before the next expected SA node impulse. Because the impulse originates below the Bundle of His and does not travel through the normal conduction system, the QRS complex is wide (greater than 0.12 sec) and bizarre in morphology. The T wave deflects in the opposite direction of the QRS (discordance). PVCs are followed by a compensatory pause because the SA node timing is not reset. Isolated PVCs are common and usually benign, but frequent PVCs (more than 10% of heartbeats) or PVCs in certain patterns can indicate myocardial irritability." },
    riskFactors: ["Caffeine, nicotine, alcohol", "Stress and anxiety", "Hypokalemia (most important electrolyte cause)", "Hypomagnesemia", "Hypoxia", "Myocardial ischemia or infarction", "Heart failure", "Digoxin toxicity", "Stimulant drugs (cocaine, amphetamines)", "Electrolyte imbalances", "Mitral valve prolapse"],
    diagnostics: ["ECG: wide (greater than 0.12 sec), bizarre QRS complex occurring early", "No preceding P wave for the PVC beat", "Compensatory pause following the PVC", "T wave deflects opposite to QRS deflection", "Assess PVC frequency: isolated, couplets, triplets, bigeminy, trigeminy", "Monitor electrolytes (K+, Mg2+)", "Check digoxin level if applicable", "Assess for R-on-T phenomenon"],
    management: ["Isolated PVCs in asymptomatic patients: usually no treatment needed", "Identify and correct underlying cause (electrolytes, hypoxia, ischemia)", "Replace potassium to maintain K+ at 4.0-5.0 mEq/L", "Replace magnesium if low", "Discontinue offending substances (caffeine, nicotine)", "Treat ischemia if present", "Frequent PVCs with hemodynamic compromise: amiodarone or lidocaine", "PVC-induced cardiomyopathy (PVC burden greater than 15%): catheter ablation"],
    nursingActions: ["Monitor and document PVC frequency and patterns", "Assess patient symptoms during PVCs (palpitations, dizziness, chest pain)", "Monitor serum potassium and magnesium levels", "Report new-onset PVCs, increasing frequency, or concerning patterns", "Watch for R-on-T phenomenon (PVC falling on T wave of preceding beat — can trigger VT/VF)", "Report couplets, triplets, or runs of 3+ PVCs (= nonsustained VT)", "Assess for signs of decreased cardiac output if PVCs are frequent", "Check apical-radial pulse deficit"],
    signs: {
      left: ["Skipped beats or extra beats felt by patient", "Occasional wide QRS on monitor", "Compensatory pause after PVC", "Usually asymptomatic if isolated"],
      right: ["R-on-T phenomenon (PVC on preceding T wave)", "Couplets or runs of PVCs (3+ = VT)", "Multifocal PVCs (different morphologies = multiple irritable foci)", "Hemodynamic compromise from frequent PVCs"]
    },
    medications: [
      { name: "Potassium Chloride", type: "Electrolyte Replacement", action: "Corrects hypokalemia which is a major trigger for PVCs and ventricular arrhythmias", sideEffects: "Hyperkalemia, GI irritation, phlebitis with IV administration", contra: "Hyperkalemia, renal failure without monitoring", pearl: "Maintain K+ at 4.0-5.0 mEq/L in cardiac patients. IV potassium must NEVER be given by IV push — always dilute and infuse no faster than 10 mEq/hour peripherally (20 mEq/hr via central line). Cardiac monitoring required during IV potassium replacement." },
      { name: "Magnesium Sulfate", type: "Electrolyte Replacement", action: "Stabilizes cardiac cell membranes and corrects hypomagnesemia", sideEffects: "Hypotension, flushing, respiratory depression at high levels", contra: "Heart block, myasthenia gravis", pearl: "Magnesium must be repleted for potassium replacement to be effective — hypomagnesemia causes renal potassium wasting. Always check Mg2+ when treating hypokalemia." },
      { name: "Amiodarone", type: "Antiarrhythmic (Class III)", action: "Suppresses ventricular ectopy by prolonging repolarization", sideEffects: "Pulmonary toxicity, thyroid dysfunction, hepatotoxicity", contra: "Severe sinus node dysfunction", pearl: "Reserved for symptomatic or hemodynamically significant PVCs. Not first-line for isolated PVCs — correct electrolytes and remove triggers first." }
    ],
    pearls: ["The most important PVC-related emergency is R-on-T phenomenon — a PVC landing on the T wave (vulnerable period) can trigger VT or VF", "Bigeminy = every other beat is a PVC; Trigeminy = every third beat is a PVC; Couplet = two consecutive PVCs", "Three or more consecutive PVCs at a rate greater than 100 = ventricular tachycardia", "Hypokalemia is the most common reversible cause of PVCs — always check K+ first", "Multifocal PVCs (different QRS morphologies) are more concerning than unifocal PVCs because they indicate multiple irritable foci", "Compensatory pause: the interval from the beat before the PVC to the beat after the PVC equals two normal R-R intervals"],
    quiz: [
      { question: "A patient on telemetry shows PVCs falling on the T wave of the preceding beat. The priority concern is:", options: ["This is a normal finding", "Risk of triggering ventricular fibrillation", "The patient needs more caffeine restriction", "This indicates atrial fibrillation"], correct: 1, rationale: "R-on-T phenomenon occurs when a PVC fires during the relative refractory period (T wave), when the ventricle is vulnerable to fibrillation. This can trigger lethal VT or VF." },
      { question: "Which electrolyte imbalance is the most common reversible cause of PVCs?", options: ["Hypernatremia", "Hypocalcemia", "Hypokalemia", "Hypermagnesemia"], correct: 2, rationale: "Hypokalemia increases ventricular irritability and is the most common and most important reversible cause of PVCs. Maintaining K+ at 4.0-5.0 mEq/L is critical in cardiac patients." },
      { question: "Three or more consecutive PVCs at a rate above 100 bpm is classified as:", options: ["Atrial flutter", "Ventricular tachycardia", "Sinus tachycardia", "Premature junctional contractions"], correct: 1, rationale: "By definition, three or more consecutive ventricular ectopic beats at a rate greater than 100 bpm constitutes ventricular tachycardia." }
    ]
  },

  "vtach-management": {
    title: "Ventricular Tachycardia (VT)",
    cellular: { title: "Rapid Ventricular Ectopic Rhythm", content: "VT originates from an ectopic focus or re-entrant circuit in the ventricle, firing at 100-250 bpm. Because the impulse bypasses normal conduction, the QRS is wide (greater than 0.12 sec) and bizarre. VT dramatically reduces cardiac output because the ventricles cannot fill adequately at such rapid rates. Monomorphic VT (uniform QRS) usually indicates a fixed structural focus (scar from prior MI). Polymorphic VT (varying QRS) suggests ischemia or electrolyte abnormalities. Sustained VT (lasting more than 30 seconds or causing hemodynamic collapse) is a medical emergency that can degenerate into ventricular fibrillation." },
    riskFactors: ["Prior myocardial infarction (scar tissue creates re-entry circuits — most common cause)", "Heart failure with reduced ejection fraction", "Cardiomyopathy (dilated, hypertrophic)", "Electrolyte imbalances (hypokalemia, hypomagnesemia)", "Prolonged QT interval (drug-induced or congenital)", "Myocardial ischemia", "Digoxin toxicity", "Antiarrhythmic drug proarrhythmia", "Cocaine and stimulant use", "Brugada syndrome"],
    diagnostics: ["ECG: wide QRS tachycardia (greater than 0.12 sec) at rate 100-250 bpm", "AV dissociation (P waves marching through independently — diagnostic of VT over SVT with aberrancy)", "Fusion beats and capture beats (diagnostic of VT)", "Concordance in precordial leads (all QRS deflections in same direction)", "Brugada criteria for differentiating VT from SVT with aberrancy", "Check electrolytes immediately (K+, Mg2+)", "Troponin if ischemia suspected", "Assess for pulse — pulseless VT is treated as cardiac arrest"],
    management: ["FIRST: check for pulse — this determines the entire algorithm", "Pulseless VT: treat as cardiac arrest — immediate defibrillation, CPR, epinephrine", "VT WITH pulse, UNSTABLE: immediate synchronized cardioversion", "VT WITH pulse, STABLE: amiodarone 150 mg IV over 10 min, then infusion", "Correct electrolytes (K+, Mg2+) immediately", "Identify and treat underlying cause (ischemia, drug toxicity)", "Consider lidocaine as alternative to amiodarone", "Post-resuscitation: evaluate for ICD placement"],
    nursingActions: ["Check pulse IMMEDIATELY when VT is identified on monitor", "If pulseless: call code, start CPR, apply defibrillator pads", "If pulse present: assess hemodynamic stability (BP, consciousness, symptoms)", "Have crash cart and defibrillator at bedside", "Administer amiodarone as ordered for stable VT with pulse", "Monitor continuous rhythm strip — VT can degenerate to VF at any time", "Monitor electrolytes and replace as ordered", "Document rhythm strip, interventions, and patient response", "Prepare for possible cardioversion or defibrillation"],
    signs: {
      left: ["Wide complex tachycardia on monitor (rate 100-250)", "Palpitations and chest pain", "Dizziness and near-syncope", "Diaphoresis"],
      right: ["Pulselessness (cardiac arrest — immediate defibrillation)", "Loss of consciousness", "Hypotension with altered mental status", "Degeneration into ventricular fibrillation"]
    },
    medications: [
      { name: "Amiodarone", type: "Antiarrhythmic (Class III)", action: "Prolongs action potential and refractory period in all cardiac tissue", sideEffects: "Hypotension during IV infusion, bradycardia, pulmonary fibrosis (chronic use)", contra: "Cardiogenic shock, severe sinus node dysfunction, second/third degree heart block", pearl: "First-line antiarrhythmic for stable VT with pulse: 150 mg IV over 10 minutes, then 1 mg/min infusion for 6 hours, then 0.5 mg/min for 18 hours. For pulseless VT/VF: 300 mg IV push, then 150 mg IV push if needed. Mix in D5W only (precipitates in NS)." },
      { name: "Lidocaine", type: "Antiarrhythmic (Class IB)", action: "Suppresses ventricular automaticity by blocking sodium channels", sideEffects: "CNS toxicity (seizures, confusion, tremor), bradycardia", contra: "Heart block, severe hepatic dysfunction", pearl: "Alternative to amiodarone. Load 1-1.5 mg/kg IV, then 0.5-0.75 mg/kg every 5-10 min (max 3 mg/kg). Then maintenance infusion 1-4 mg/min. Monitor for CNS toxicity — early signs include perioral numbness and tinnitus." },
      { name: "Epinephrine", type: "Sympathomimetic", action: "Alpha-1 vasoconstriction improves coronary and cerebral perfusion during CPR", sideEffects: "Tachycardia, hypertension", contra: "None in cardiac arrest", pearl: "For pulseless VT: 1 mg IV/IO every 3-5 minutes during CPR. Given after the first or second defibrillation attempt fails. Alpha effects (vasoconstriction) are the reason it works in arrest — improving coronary perfusion pressure." }
    ],
    pearls: ["The SINGLE most important question when you see VT: Does the patient have a pulse? This determines everything.", "Pulseless VT = defibrillation (unsynchronized). VT with pulse and unstable = synchronized cardioversion. The energy type differs.", "Wide complex tachycardia should be treated as VT until proven otherwise — it is safer to treat SVT with aberrancy as VT than to miss real VT", "AV dissociation on a 12-lead ECG is virtually diagnostic of VT over SVT with aberrancy", "Amiodarone is mixed in D5W only — it precipitates in normal saline", "Post-cardiac arrest: all survivors of VT/VF arrest should be evaluated for ICD (implantable cardioverter-defibrillator) placement"],
    quiz: [
      { question: "A patient on telemetry suddenly shows wide complex tachycardia at 180 bpm. The FIRST nursing action is:", options: ["Administer amiodarone 150 mg IV", "Check for a pulse", "Begin chest compressions", "Perform synchronized cardioversion"], correct: 1, rationale: "The first action with any wide complex tachycardia is to check for a pulse. This determines the entire treatment algorithm — pulseless VT requires defibrillation and CPR, while VT with a pulse is managed differently based on stability." },
      { question: "Pulseless ventricular tachycardia is treated with:", options: ["Synchronized cardioversion", "Unsynchronized defibrillation", "Adenosine 6 mg rapid IV push", "Atropine 1 mg IV"], correct: 1, rationale: "Pulseless VT is treated identically to ventricular fibrillation with immediate unsynchronized defibrillation (shock), CPR, and ACLS drugs. Synchronized cardioversion is for VT WITH a pulse." },
      { question: "Which finding on 12-lead ECG is diagnostic of VT rather than SVT with aberrant conduction?", options: ["Narrow QRS complexes", "Regular rhythm", "AV dissociation", "Heart rate above 150"], correct: 2, rationale: "AV dissociation — P waves and QRS complexes occurring independently with no fixed relationship — is virtually diagnostic of VT. In SVT, the P waves and QRS complexes maintain a relationship." }
    ]
  },

  "vfib-management": {
    title: "Ventricular Fibrillation (V-Fib)",
    image: imgLethalDysrhythmias,
    cellular: { title: "Chaotic Ventricular Electrical Activity", content: "Multiple areas of the ventricular myocardium depolarize and repolarize in a completely disorganized fashion. There is no coordinated contraction — the ventricles quiver uselessly. Cardiac output is ZERO. This is cardiac arrest. Without immediate defibrillation, V-fib will deteriorate to asystole within minutes as the myocardium becomes increasingly ischemic and acidotic. V-fib is the most common initial rhythm in witnessed sudden cardiac arrest and is the most responsive to defibrillation — the sooner defibrillation occurs, the better the survival. Every minute without defibrillation decreases survival by 7-10%." },
    riskFactors: ["Acute myocardial infarction (most common cause)", "Ventricular tachycardia degenerating to V-fib", "Severe electrolyte imbalances (hypokalemia, hypomagnesemia)", "R-on-T phenomenon (PVC during vulnerable period)", "Drowning/hypothermia", "Electrical shock/lightning strike", "Drug toxicity (digoxin, cocaine, antiarrhythmics)", "Long QT syndrome (congenital or acquired)", "Brugada syndrome", "Commotio cordis (blunt chest trauma during vulnerable period)"],
    diagnostics: ["ECG: chaotic, irregular, undulating waveform with no discernible P waves, QRS complexes, or T waves", "No identifiable cardiac rhythm", "No pulse (this IS cardiac arrest)", "Coarse V-fib: larger amplitude waves, more recently onset, more responsive to defibrillation", "Fine V-fib: smaller amplitude waves, longer duration, less responsive — may resemble asystole (confirm in 2 leads)"],
    management: ["IMMEDIATE defibrillation — this is the definitive treatment (do not delay for any reason)", "High-quality CPR between defibrillation attempts (minimize interruptions)", "Biphasic defibrillator: 120-200 J (manufacturer recommendation) or maximum if unknown", "After second shock: Epinephrine 1 mg IV/IO every 3-5 minutes", "After third shock: Amiodarone 300 mg IV/IO push", "Continue 2-minute cycles of CPR with rhythm check between cycles", "Identify and treat reversible causes (H's and T's)", "Post-ROSC care: targeted temperature management, coronary angiography"],
    nursingActions: ["Recognize V-fib IMMEDIATELY — no pulse check needed if witnessed arrest with clear V-fib on monitor", "Call code and begin CPR immediately if defibrillator not immediately available", "Apply defibrillator pads and deliver shock as quickly as possible", "Perform high-quality CPR: rate 100-120/min, depth 2-2.4 inches, full recoil, minimize interruptions", "Obtain IV/IO access during CPR", "Administer ACLS medications as ordered and document times", "Prepare and manage advanced airway when directed", "Document all interventions with exact times", "Assist with post-resuscitation care"],
    signs: {
      left: ["Chaotic waveform on monitor", "No discernible P-QRS-T complexes", "No pulse", "Loss of consciousness"],
      right: ["No blood pressure obtainable", "No respiratory effort (agonal gasps may occur)", "Cyanosis progressing rapidly", "Pupils dilating (brain ischemia)"]
    },
    medications: [
      { name: "Epinephrine", type: "Sympathomimetic", action: "Alpha-1 vasoconstriction increases coronary and cerebral perfusion pressure during CPR", sideEffects: "Not relevant during cardiac arrest", contra: "None in cardiac arrest", pearl: "1 mg IV/IO every 3-5 minutes. Give after the second defibrillation attempt. The alpha (vasoconstriction) effects are what matter during arrest — they improve coronary perfusion pressure which determines whether defibrillation will succeed." },
      { name: "Amiodarone", type: "Antiarrhythmic (Class III)", action: "Stabilizes myocardial membrane to facilitate defibrillation", sideEffects: "Not relevant during cardiac arrest", contra: "None in cardiac arrest", pearl: "300 mg IV/IO push after the third shock. If V-fib recurs, a second dose of 150 mg IV/IO may be given. This is a PUSH dose in arrest — not the slow infusion used for stable VT." },
      { name: "Lidocaine", type: "Antiarrhythmic (Class IB)", action: "Alternative to amiodarone for refractory V-fib", sideEffects: "Not relevant during cardiac arrest", contra: "None in cardiac arrest", pearl: "1-1.5 mg/kg IV/IO first dose, then 0.5-0.75 mg/kg every 5-10 minutes (max 3 mg/kg). Use when amiodarone is unavailable." }
    ],
    pearls: ["V-fib = shock immediately. Every minute of delay reduces survival by 7-10%. Nothing else matters until you defibrillate.", "V-fib is UNSYNCHRONIZED defibrillation (there is no organized rhythm to synchronize with)", "High-quality CPR between shocks is as important as the shocks themselves — it maintains coronary perfusion", "Fine V-fib may look like asystole — always confirm rhythm in 2 leads before calling asystole", "The H's and T's of reversible causes: Hypovolemia, Hypoxia, Hydrogen ion (acidosis), Hypo/Hyperkalemia, Hypothermia, Tension pneumothorax, Tamponade, Toxins, Thrombosis (pulmonary/coronary)", "Post-resuscitation: targeted temperature management (32-36°C for 24 hours) improves neurological outcomes"],
    quiz: [
      { question: "The FIRST action for a patient in ventricular fibrillation is:", options: ["Administer epinephrine 1 mg IV", "Intubate the patient", "Immediate defibrillation", "Start an amiodarone infusion"], correct: 2, rationale: "Defibrillation is the definitive treatment for V-fib and takes absolute priority. Every second of delay reduces survival. Medications and airway management are secondary to immediate defibrillation." },
      { question: "During a code for V-fib, epinephrine is given:", options: ["Before the first shock", "After the second shock, then every 3-5 minutes", "Only once during the code", "After return of spontaneous circulation"], correct: 1, rationale: "Per ACLS protocol, epinephrine 1 mg IV/IO is given after the second defibrillation attempt, then repeated every 3-5 minutes throughout the resuscitation." },
      { question: "Fine ventricular fibrillation may be confused with:", options: ["Atrial fibrillation", "Sinus tachycardia", "Asystole", "Normal sinus rhythm"], correct: 2, rationale: "Fine V-fib has small amplitude waves that can appear nearly flat, mimicking asystole. Always confirm in at least 2 ECG leads. The distinction matters because V-fib is shockable and asystole is not." }
    ]
  },

  "heart-block-complete": {
    title: "Third-Degree (Complete) Heart Block",
    cellular: { title: "Complete AV Dissociation", content: "In third-degree heart block, NO impulses from the atria conduct through to the ventricles. The AV node, Bundle of His, or bundle branches are completely blocked. The atria and ventricles beat independently — the SA node drives the atria at 60-100 bpm while a ventricular escape pacemaker drives the ventricles at 20-40 bpm. There is NO relationship between P waves and QRS complexes (AV dissociation). If the escape rhythm originates from the AV junction, the QRS may be narrow with a rate of 40-60. If it originates from the ventricles, the QRS is wide with a rate of 20-40 bpm. This is a life-threatening bradycardia requiring pacing." },
    riskFactors: ["Inferior MI (AV nodal block — often transient)", "Anterior MI (infranodal block — usually permanent and worse prognosis)", "Degenerative conduction disease (Lenegre disease, Lev disease)", "Cardiac surgery (especially valve surgery)", "Myocarditis", "Drug toxicity (digoxin, beta-blockers, calcium channel blockers, amiodarone)", "Hyperkalemia", "Congenital complete heart block (associated with maternal lupus antibodies)", "Lyme disease", "Aortic valve calcification"],
    diagnostics: ["ECG: P waves and QRS complexes present but completely independent of each other", "Regular P-P intervals (atrial rhythm) and regular R-R intervals (ventricular rhythm) at different rates", "No consistent PR interval (PR varies randomly — this is the key finding)", "Ventricular rate typically 20-40 bpm (ventricular escape) or 40-60 (junctional escape)", "Wide QRS if ventricular escape; narrow QRS if junctional escape", "More P waves than QRS complexes"],
    management: ["This is an EMERGENCY — prepare for immediate pacing", "Transcutaneous pacing: apply pads, set rate 60-80, increase mA until capture achieved", "Atropine 0.5 mg IV may be attempted but is often ineffective (especially in infranodal block)", "Dopamine or epinephrine infusion as temporizing measure", "Transvenous pacing catheter as bridge to permanent pacemaker", "Permanent pacemaker implantation is the definitive treatment", "Hold all AV-blocking medications (digoxin, beta-blockers, CCBs, amiodarone)", "Isoproterenol infusion as last resort"],
    nursingActions: ["Recognize the rhythm immediately — this is time-critical", "Assess hemodynamic stability and level of consciousness", "Have transcutaneous pacing equipment ready at all times for patients at risk", "If transcutaneous pacing: sedate the patient if conscious (painful), verify electrical and mechanical capture", "Monitor for signs of inadequate cardiac output (hypotension, syncope, altered mental status)", "Keep patient on continuous telemetry monitoring", "Hold all AV node-blocking medications and notify provider", "Document rhythm strips and all interventions", "Prepare for possible transvenous pacer or permanent pacemaker"],
    signs: {
      left: ["Very slow pulse (20-40 bpm)", "Regular but slow rhythm", "Cannon A waves in JVP (atria contracting against closed tricuspid valve)", "Variable intensity of S1 heart sound"],
      right: ["Syncope (Stokes-Adams attacks)", "Profound hypotension", "Heart failure from inadequate cardiac output", "Cardiac arrest if escape rhythm fails"]
    },
    medications: [
      { name: "Atropine", type: "Anticholinergic", action: "Increases SA node rate and AV conduction", sideEffects: "Tachycardia, dry mouth", contra: "Not effective in infranodal (below AV node) block", pearl: "May work for AV nodal block (narrow escape QRS) but is unreliable and often ineffective for infranodal block (wide escape QRS). Do not delay pacing while waiting for atropine to work." },
      { name: "Transcutaneous Pacing", type: "External Electrical Pacing", action: "Electrical stimulation through chest wall pads captures the ventricle, overriding the slow escape rhythm", sideEffects: "Pain (requires sedation), skin burns, failure to capture", contra: "None in emergency", pearl: "Set rate to 60-80 bpm, increase mA (output) until electrical capture seen on monitor, then confirm mechanical capture by checking pulse. ALWAYS verify mechanical capture — electrical capture on the monitor does not guarantee the heart is actually contracting." },
      { name: "Dopamine Infusion", type: "Sympathomimetic", action: "Increases heart rate via beta-1 stimulation at 5-20 mcg/kg/min", sideEffects: "Tachycardia, tissue necrosis", contra: "Pheochromocytoma", pearl: "Temporizing measure while preparing for pacing. Central line preferred. Monitor closely for hemodynamic changes." }
    ],
    pearls: ["Third-degree heart block = NO relationship between P waves and QRS. The PR interval varies randomly. This is different from first-degree (prolonged but consistent PR) and second-degree (some blocked P waves).", "Narrow escape QRS = junctional escape (above the block), rate 40-60. Wide escape QRS = ventricular escape (below the block), rate 20-40. Ventricular escape is more dangerous.", "Anterior MI causing complete heart block has a much worse prognosis than inferior MI because it indicates massive septal damage", "Transcutaneous pacing is painful — the patient needs sedation and analgesia if conscious", "Always verify MECHANICAL capture (palpable pulse) in addition to electrical capture (pacer spikes followed by QRS on monitor)", "Atropine works on the AV node — if the block is below the AV node (infranodal), atropine will increase atrial rate but NOT improve ventricular conduction"],
    quiz: [
      { question: "The defining ECG characteristic of third-degree heart block is:", options: ["Prolonged PR interval greater than 0.20 seconds", "Progressively lengthening PR intervals", "Complete independence of P waves and QRS complexes (AV dissociation)", "Absent P waves"], correct: 2, rationale: "Third-degree (complete) heart block shows complete AV dissociation — P waves and QRS complexes occur independently with no consistent PR interval. The atria and ventricles beat at their own rates." },
      { question: "The definitive treatment for symptomatic third-degree heart block is:", options: ["Lifelong amiodarone", "Permanent pacemaker implantation", "Atropine 1 mg IV every 5 minutes", "Cardioversion"], correct: 1, rationale: "Permanent pacemaker is the definitive treatment for third-degree heart block. Transcutaneous pacing, medications, and transvenous pacing are temporizing measures." },
      { question: "A patient has third-degree heart block with a wide QRS escape rhythm at 30 bpm. Atropine 0.5 mg IV is given. The nurse should expect:", options: ["Immediate conversion to normal sinus rhythm", "No improvement — this is infranodal block and atropine is ineffective", "Heart rate increase to 60 bpm", "Conversion to atrial fibrillation"], correct: 1, rationale: "A wide QRS escape indicates infranodal block (below the AV node). Atropine only works on the AV node, so it will be ineffective. Pacing should not be delayed for atropine in this situation." }
    ]
  },

  "torsades-management": {
    title: "Torsades de Pointes (TdP)",
    cellular: { title: "Polymorphic VT with Prolonged QT", content: "Torsades de Pointes (twisting of the points) is a specific form of polymorphic ventricular tachycardia that occurs in the setting of a prolonged QT interval. The QRS complexes appear to rotate around the baseline, with amplitude that waxes and wanes in a characteristic sinusoidal pattern. Prolonged QT (greater than 0.46 sec in males, greater than 0.47 sec in females) creates a long vulnerable period during which triggered activity can initiate the arrhythmia. TdP can be self-terminating (causing syncope) or can degenerate into ventricular fibrillation and cardiac arrest." },
    riskFactors: ["Drug-induced QT prolongation (most common cause): antiarrhythmics (sotalol, procainamide, quinidine), antibiotics (fluoroquinolones, macrolides, azole antifungals), antipsychotics (haloperidol, ziprasidone), methadone, ondansetron", "Hypokalemia", "Hypomagnesemia", "Hypocalcemia", "Congenital long QT syndrome (genetic channelopathies)", "Bradycardia (allows QT to prolong further)", "Female sex (higher baseline QTc)", "Heart failure", "Hypothyroidism", "Liver disease (impaired drug metabolism)", "Concurrent use of multiple QT-prolonging drugs"],
    diagnostics: ["ECG: polymorphic VT with characteristic twisting axis and waxing/waning amplitude", "Prolonged QTc on baseline ECG (before TdP onset)", "Irregular rhythm but with identifiable rotating pattern", "Often preceded by a short-long-short sequence (normal beat, pause, then PVC initiating TdP)", "Check electrolytes immediately (K+, Mg2+, Ca2+)", "Review medication list for QT-prolonging agents", "Genetic testing if congenital long QT suspected"],
    management: ["FIRST: if pulseless, treat as V-fib — immediate defibrillation", "Magnesium sulfate 1-2 g IV over 5-20 minutes — FIRST-LINE drug treatment even if Mg2+ is normal", "Correct hypokalemia (target K+ greater than 4.0)", "Discontinue ALL QT-prolonging medications immediately", "Overdrive pacing (increase heart rate to shorten QT) — transcutaneous or transvenous at rate 90-110", "Isoproterenol infusion to increase heart rate (temporary)", "Do NOT give amiodarone, procainamide, or sotalol — these will WORSEN TdP by further prolonging QT"],
    nursingActions: ["Recognize the unique twisting pattern — do not confuse with monomorphic VT", "Check pulse immediately — pulseless TdP = defibrillation", "Have IV magnesium sulfate ready (this is the KEY drug)", "Review medication administration record for QT-prolonging drugs and hold them immediately", "Monitor QTc interval on all patients receiving QT-prolonging medications", "Report QTc greater than 500 msec immediately — high risk for TdP", "Ensure electrolyte repletion per protocol", "Maintain continuous telemetry monitoring", "Prepare for possible overdrive pacing"],
    signs: {
      left: ["Twisting QRS pattern on ECG (pathognomonic)", "Syncope or near-syncope", "Palpitations with dizziness", "Often preceded by short-long-short sequence"],
      right: ["Pulselessness (cardiac arrest)", "Degeneration into ventricular fibrillation", "Seizure-like activity from cerebral hypoperfusion", "Recurrent episodes without treatment of underlying cause"]
    },
    medications: [
      { name: "Magnesium Sulfate", type: "Electrolyte/Membrane Stabilizer", action: "Stabilizes cardiac cell membrane, suppresses triggered activity, shortens action potential duration", sideEffects: "Hypotension, respiratory depression, flushing", contra: "Severe renal failure (use with caution)", pearl: "FIRST-LINE for TdP regardless of serum magnesium level. Give 1-2 g IV over 5-20 minutes (faster in arrest). May repeat. This is the ONE arrhythmia where magnesium is the specific treatment, not just supportive." },
      { name: "Isoproterenol", type: "Beta-Agonist", action: "Increases heart rate to shorten QT interval (overdrive suppression)", sideEffects: "Severe tachycardia, myocardial ischemia, tremor", contra: "Known coronary artery disease (use with extreme caution)", pearl: "Temporizing measure to increase heart rate and shorten QT interval until pacing can be established. Not commonly used but important for boards." }
    ],
    pearls: ["TdP is the ONE ventricular arrhythmia where amiodarone is CONTRAINDICATED — it prolongs QT and will make TdP worse", "Magnesium is the treatment for TdP even if the serum magnesium level is normal — it works by stabilizing the membrane regardless of levels", "The short-long-short initiation sequence is classic: a PVC (short interval), compensatory pause (long interval), then another PVC during the long QT that triggers TdP", "Always review the medication list when you see a prolonged QT — drug-induced QT prolongation is the most common cause of TdP", "QTc greater than 500 msec is the danger zone — report immediately and hold QT-prolonging drugs", "Overdrive pacing shortens the QT interval by not allowing the prolonged repolarization to occur"],
    quiz: [
      { question: "The first-line drug treatment for Torsades de Pointes is:", options: ["Amiodarone 300 mg IV push", "Magnesium sulfate 1-2 g IV", "Lidocaine 1 mg/kg IV", "Procainamide 20 mg/min IV"], correct: 1, rationale: "Magnesium sulfate is the specific first-line treatment for TdP, given regardless of serum magnesium level. Amiodarone, procainamide, and other QT-prolonging drugs are contraindicated because they will worsen TdP." },
      { question: "Which drug commonly causes QT prolongation and puts patients at risk for TdP?", options: ["Metoprolol", "Haloperidol", "Aspirin", "Acetaminophen"], correct: 1, rationale: "Haloperidol (Haldol) is a well-known QT-prolonging medication. Other common offenders include sotalol, fluoroquinolones, macrolide antibiotics, and methadone." },
      { question: "Why is amiodarone contraindicated in Torsades de Pointes?", options: ["It causes hypokalemia", "It further prolongs the QT interval, worsening TdP", "It is only available orally", "It causes hypermagnesemia"], correct: 1, rationale: "Amiodarone prolongs the QT interval. Since TdP occurs because of a prolonged QT, giving amiodarone would further prolong QT and worsen or perpetuate the arrhythmia." }
    ]
  },

  "first-degree-av-block": {
    title: "First-Degree AV Block",
    image: imgFirstDegreeBlock,
    cellular: { title: "AV Nodal Conduction Delay", content: "First-degree AV block is a conduction delay at the AV node or bundle of His. It is a delay, not a dropped beat. Every atrial impulse is conducted to the ventricles, but conduction through the AV node takes longer than normal, resulting in a prolonged PR interval greater than 0.20 seconds. The conduction delay is consistent, meaning the PR interval remains constant from beat to beat. The normal conduction pathway structure is preserved: SA node initiates impulse, atrial depolarization (P wave), AV node delay (PR interval), Bundle of His, right and left bundle branches, Purkinje fibers, ventricular depolarization (QRS complex). Heart blocks occur when conduction is delayed or interrupted anywhere along this pathway." },
    riskFactors: ["Athletes (increased vagal tone)", "Increased vagal tone", "Beta-blocker use", "Calcium channel blocker use", "Digoxin therapy", "Aging and degenerative conduction system changes", "Myocarditis", "Inferior wall MI", "Electrolyte imbalances"],
    diagnostics: ["PR interval greater than 0.20 seconds (more than 5 small boxes)", "PR interval constant from beat to beat", "Every P wave followed by a QRS complex (no dropped beats)", "Rhythm regular", "P waves normal morphology, upright in lead II", "QRS complex narrow (less than 0.12 seconds)", "1:1 P:QRS ratio maintained"],
    management: ["Monitor — typically requires observation only", "Review medications that may slow AV conduction (beta-blockers, calcium channel blockers, digoxin)", "No treatment usually required", "Report if PR interval progressively lengthens (may indicate worsening block)", "Treat underlying cause if identified"],
    nursingActions: ["Document PR interval measurement on rhythm strip", "Monitor for progression to higher-degree blocks", "Review medication administration record for AV node-blocking drugs", "Report changes in PR interval to provider", "Correlate ECG findings with clinical symptoms", "Educate patient about medication compliance and monitoring"],
    signs: {
      left: ["PR interval greater than 0.20 seconds (constant)", "Regular rhythm", "Normal QRS morphology", "No dropped beats", "Often asymptomatic"],
      right: ["PR prolongation worsening over time", "Development of symptoms (dizziness, fatigue)", "Progression to second-degree block", "Associated with medication toxicity"]
    },
    medications: [
      { name: "Review Current Medications", type: "Assessment", action: "Identify and potentially hold AV node-blocking agents contributing to prolonged PR interval", sideEffects: "N/A", contra: "N/A", pearl: "First-degree AV block is often benign and may be caused by beta-blockers, calcium channel blockers, or digoxin. Review the medication list before any intervention. It is a delay, not a dropped beat." }
    ],
    pearls: ["First-degree AV block is a delay, not a dropped beat — every P wave is followed by a QRS", "PR interval is prolonged but constant — this differentiates it from Mobitz I (progressive lengthening)", "Often benign, commonly seen in athletes and with increased vagal tone", "PR interval greater than 0.20 seconds with otherwise normal rhythm = first-degree AV block", "May be the only ECG finding in early digoxin toxicity", "PR interval reflects AV nodal conduction — prolongation is the hallmark of this block"],
    quiz: [
      { question: "The defining ECG characteristic of first-degree AV block is:", options: ["Dropped QRS complexes", "PR interval greater than 0.20 seconds that is constant", "Irregular R-R intervals", "Wide QRS complexes"], correct: 1, rationale: "First-degree AV block is defined by a PR interval greater than 0.20 seconds that remains constant from beat to beat. Every P wave is followed by a QRS — no beats are dropped." },
      { question: "A patient has a PR interval of 0.24 seconds with regular rhythm and normal QRS. The nurse should:", options: ["Prepare for pacemaker placement", "Administer atropine immediately", "Document findings and monitor — this is usually benign", "Perform synchronized cardioversion"], correct: 2, rationale: "First-degree AV block is typically benign and requires monitoring only. The PR interval is prolonged but every P wave conducts. Review medications and report, but no emergent intervention is needed." },
      { question: "First-degree AV block differs from Mobitz Type I because:", options: ["First-degree has dropped beats", "First-degree has a constant PR interval with no dropped beats", "First-degree has wide QRS complexes", "First-degree has an irregular rhythm"], correct: 1, rationale: "In first-degree AV block, the PR interval is prolonged but constant with no dropped beats. In Mobitz Type I, the PR interval progressively lengthens until a beat is dropped." }
    ]
  },

  "second-degree-av-block-type-i": {
    title: "Second-Degree AV Block Type I (Mobitz I /",
    cellular: { title: "Progressive AV Nodal Delay", content: "Second-degree AV block Type I (also called Mobitz I or Wenckebach) involves progressive AV nodal delay until one impulse fails to conduct. The mechanism usually occurs at the AV node. With each successive beat, the PR interval lengthens slightly as the AV node becomes increasingly refractory, until eventually one P wave is not conducted and a QRS complex is dropped. After the dropped beat, the AV node recovers and the cycle repeats. This creates a characteristic pattern of progressively lengthening PR intervals followed by a dropped QRS. The result is more P waves than QRS complexes over the full rhythm strip." },
    riskFactors: ["Inferior wall myocardial infarction", "Increased vagal tone", "Sleep (may occur normally during sleep)", "Beta-blocker or calcium channel blocker therapy", "Digoxin therapy", "Myocarditis", "Cardiac surgery", "Rheumatic heart disease"],
    diagnostics: ["Progressive PR interval lengthening from beat to beat", "Eventually a dropped QRS complex (P wave without following QRS)", "Cycle repeats after the dropped beat", "More P waves than QRS complexes over the strip", "Grouped beating pattern (clusters of conducted beats separated by pauses)", "QRS complex typically narrow", "Irregular R-R intervals due to the dropped beats"],
    management: ["Monitor unless symptomatic", "Often benign and transient — may resolve spontaneously", "May occur during sleep or inferior MI and resolve on its own", "Identify and treat underlying cause", "Review medications that may contribute to AV block", "If symptomatic: atropine may be effective (block is at AV node level)", "Rarely requires pacing"],
    nursingActions: ["Monitor rhythm continuously and identify the progressive PR pattern", "Document rhythm strip showing the lengthening PR intervals and dropped beat", "Assess for symptoms of decreased cardiac output", "Monitor for progression to higher-degree blocks", "Report if pattern becomes persistent or symptomatic", "Review medication administration record for AV-blocking drugs", "Compare rhythm strips over time to assess for worsening"],
    signs: {
      left: ["Progressive PR prolongation visible on rhythm strip", "Grouped beating pattern", "Dropped QRS after the longest PR interval", "Often asymptomatic", "Regular P-P intervals"],
      right: ["Frequent dropped beats causing hemodynamic compromise", "Dizziness or near-syncope", "Progression to Mobitz Type II or complete heart block", "Persistent pattern beyond expected transient causes"]
    },
    medications: [
      { name: "Atropine", type: "Anticholinergic", action: "Increases AV node conduction velocity and SA node rate", sideEffects: "Tachycardia, dry mouth, urinary retention", contra: "Glaucoma", pearl: "Atropine may be effective for symptomatic Mobitz I because the block is usually at the AV node level. Give 0.5 mg IV if symptomatic. This is different from Mobitz II, where atropine is often ineffective because the block is below the AV node." }
    ],
    pearls: ["Progressive PR lengthening followed by a dropped beat = Mobitz I (Wenckebach)", "Often benign and transient — commonly seen during sleep and inferior MI", "The block is usually at the AV node level, which is why atropine can be effective", "Monitor unless symptomatic — most cases resolve spontaneously", "Key differentiator from Mobitz II: the PR interval changes (lengthens) before the drop; in Mobitz II the PR is constant before the drop", "Grouped beating pattern is the visual clue — look for clusters of beats separated by pauses"],
    quiz: [
      { question: "The characteristic ECG pattern of Mobitz Type I (Wenckebach) is:", options: ["Constant PR with sudden dropped QRS", "Progressive PR lengthening followed by a dropped QRS", "Complete AV dissociation", "Wide QRS complexes"], correct: 1, rationale: "Mobitz Type I (Wenckebach) shows progressive PR interval lengthening until a P wave fails to conduct and a QRS is dropped. The cycle then repeats." },
      { question: "Mobitz Type I is usually considered:", options: ["A medical emergency requiring immediate pacing", "Often benign and transient, requiring monitoring", "An indication for permanent pacemaker", "A lethal arrhythmia"], correct: 1, rationale: "Mobitz Type I is often benign and transient. It may occur during sleep or inferior MI and usually resolves. Treatment is monitoring unless the patient becomes symptomatic." },
      { question: "Which medication may be effective for symptomatic Mobitz Type I?", options: ["Epinephrine IV push", "Atropine 0.5 mg IV", "Amiodarone 150 mg IV", "Adenosine 6 mg IV push"], correct: 1, rationale: "Atropine may be effective for symptomatic Mobitz I because the block is usually at the AV node level. Atropine increases AV node conduction velocity." }
    ]
  },

  "second-degree-av-block-type-ii": {
    title: "Second-Degree AV Block Type II (Mobitz II)",
    cellular: { title: "Infranodal Conduction Failure", content: "Second-degree AV block Type II (Mobitz II) involves intermittent failure of conduction without PR interval prolongation. Unlike Mobitz I, the PR interval remains constant before the dropped beat — the conduction fails suddenly and unpredictably. The mechanism usually occurs in the bundle of His or below (infranodal), which makes this a much more serious block than Mobitz I. Because the block is below the AV node, the conduction system is structurally damaged, and there is a high risk of progression to third-degree (complete) heart block. The dropped beats result in more P waves than QRS complexes over the rhythm strip." },
    riskFactors: ["Anterior wall myocardial infarction (septal damage affecting bundle branches)", "Degenerative conduction system disease", "Cardiac surgery", "Aortic valve disease", "Myocarditis", "Drug toxicity (rarely)", "Structural heart disease", "Cardiomyopathy"],
    diagnostics: ["PR interval constant and normal before the dropped beat", "Sudden dropped QRS complex without preceding PR prolongation", "More P waves than QRS complexes", "QRS may be wide (indicating bundle branch involvement) or narrow", "Regular P-P intervals maintained", "Unpredictable dropped beats — no progressive pattern", "May occur in fixed ratios (2:1, 3:1 conduction)"],
    management: ["This is a SERIOUS rhythm — high risk of progressing to third-degree block", "Cardiology consult required", "Often requires pacemaker placement (temporary, then permanent)", "Prepare for transcutaneous pacing at all times", "Atropine is often INEFFECTIVE because the block is below the AV node", "Continuous telemetry monitoring mandatory", "Hold AV node-blocking medications", "Keep patient on bed rest to minimize cardiac demands"],
    nursingActions: ["Recognize this as a serious rhythm requiring urgent intervention", "Place patient on continuous telemetry monitoring", "Have transcutaneous pacing equipment immediately available", "Notify provider urgently — cardiology consult needed", "Assess hemodynamic stability continuously", "Document rhythm strips carefully, noting the constant PR interval and dropped beats", "Establish IV access", "Prepare for possible pacemaker insertion", "Do NOT delay pacing for atropine — atropine is often ineffective in infranodal block"],
    signs: {
      left: ["Constant PR interval (normal or slightly prolonged)", "Sudden dropped QRS without warning", "May be initially asymptomatic", "Regular atrial rhythm (P-P intervals constant)"],
      right: ["High risk of progressing to complete heart block", "Syncope (Stokes-Adams attacks)", "Hemodynamic instability if frequent beats dropped", "May deteriorate suddenly to complete AV dissociation", "Wide QRS indicating infranodal block location"]
    },
    medications: [
      { name: "Transcutaneous Pacing", type: "External Electrical Pacing", action: "Provides reliable ventricular depolarization when conduction fails", sideEffects: "Pain (requires sedation), skin burns", contra: "None in emergency", pearl: "Pacing is the primary treatment for Mobitz II. Do not rely on atropine — the block is below the AV node where atropine has no effect. Pacing provides reliable ventricular capture until a permanent pacemaker can be placed." },
      { name: "Atropine", type: "Anticholinergic", action: "Increases AV node conduction", sideEffects: "Tachycardia, dry mouth", contra: "Often ineffective in infranodal block", pearl: "Atropine works on the AV node. In Mobitz II, the block is below the AV node (infranodal). Atropine may increase the atrial rate without improving conduction, potentially worsening the situation by increasing the number of non-conducted P waves." }
    ],
    pearls: ["Mobitz II = dropped beat WITHOUT PR change = SERIOUS. Mobitz I = dropped beat WITH progressive PR lengthening = usually benign", "High risk of progressing to third-degree (complete) heart block — this is why it is treated urgently", "The block is infranodal (below the AV node), which is why atropine is often ineffective", "Wide QRS in Mobitz II indicates bundle branch involvement and worse prognosis", "Always have pacing equipment ready for Mobitz II patients", "Anterior MI causing Mobitz II has worse prognosis than inferior MI causing Mobitz I", "Prepare for pacing if unstable — do not delay for medication trials"],
    quiz: [
      { question: "The key ECG difference between Mobitz I and Mobitz II is:", options: ["Mobitz II has progressive PR lengthening", "Mobitz II has a constant PR interval before the dropped beat", "Mobitz I has wider QRS complexes", "Mobitz II has irregular P-P intervals"], correct: 1, rationale: "In Mobitz II, the PR interval is constant before the beat is dropped — the conduction fails suddenly without warning. In Mobitz I, the PR progressively lengthens before the drop." },
      { question: "Why is atropine often ineffective in Mobitz Type II?", options: ["The patient is too unstable for any medication", "The block is below the AV node where atropine has no effect", "Atropine is only for tachycardia", "The dose is always too low"], correct: 1, rationale: "Atropine works on the AV node. Mobitz II occurs below the AV node (infranodal), so atropine cannot improve conduction at the blocked site. It may even worsen the situation by increasing atrial rate without improving conduction." },
      { question: "A patient with Mobitz Type II develops syncope. The priority intervention is:", options: ["Administer atropine 1 mg IV", "Initiate transcutaneous pacing", "Administer adenosine", "Perform carotid massage"], correct: 1, rationale: "Symptomatic Mobitz II requires pacing. Transcutaneous pacing provides reliable ventricular capture. Atropine is often ineffective for infranodal block and should not delay pacing." }
    ]
  },

  "bundle-branch-block": {
    title: "Bundle Branch Block (BBB)",
    image: imgBBB,
    cellular: { title: "Intraventricular Conduction Delay", content: "Bundle branch block (BBB) is a delay or block in conduction through the right or left bundle branch. Unlike AV blocks which involve delayed or failed conduction between atria and ventricles, bundle branch blocks involve intraventricular conduction delay. When one bundle branch is blocked, the impulse must travel through the unblocked branch first and then depolarize the other ventricle by spreading through the myocardium cell-to-cell, which is slower than normal Purkinje fiber conduction. This delayed ventricular activation produces a wide, abnormal QRS complex (greater than 0.12 seconds). The sinus rhythm is usually preserved with normal P waves and PR intervals — the abnormality is isolated to ventricular conduction." },
    riskFactors: ["RBBB: may be incidental finding in healthy individuals", "RBBB: right heart strain (pulmonary embolism, pulmonary hypertension)", "RBBB: atrial septal defect", "LBBB: hypertension", "LBBB: coronary artery disease", "LBBB: cardiomyopathy (dilated)", "LBBB: aortic valve disease", "LBBB: heart failure", "Both: degenerative conduction system disease", "Both: myocardial infarction", "Both: myocarditis", "Both: cardiac surgery"],
    diagnostics: ["QRS duration greater than 0.12 seconds (wide QRS)", "Wide, abnormal QRS morphology", "Sinus rhythm usually present with normal P waves and PR intervals", "RBBB: RSR' (M-shaped) pattern in V1 with wide S wave in leads I and V6", "LBBB: Broad, notched R waves in lateral leads (I, aVL, V5, V6) with deep S waves in V1-V3", "Differentiate from ventricular rhythms which also have wide QRS", "12-lead ECG is essential for identifying BBB pattern"],
    management: ["RBBB: often incidental, may not require specific treatment", "RBBB: evaluate for right heart pathology if new onset", "LBBB: evaluate underlying cardiac disease — often indicates structural heart pathology", "LBBB: may obscure MI diagnosis on ECG — use modified Sgarbossa criteria", "Both: assess for ischemia with troponin and clinical correlation", "New BBB in acute setting: evaluate for acute MI", "Cardiology referral for new LBBB"],
    nursingActions: ["Document QRS width and morphology on rhythm strip", "Compare with prior ECGs to determine if BBB is new or chronic", "Report new-onset BBB immediately — may indicate acute MI", "Monitor for hemodynamic changes", "Assess for underlying cardiac symptoms (chest pain, dyspnea)", "For LBBB: ensure provider is aware that standard ECG criteria for MI may be unreliable", "Correlate ECG findings with clinical presentation"],
    signs: {
      left: ["Wide QRS greater than 0.12 seconds on ECG", "Normal sinus rhythm with normal P waves", "Normal PR interval", "RBBB: RSR' in V1 (rabbit ears)", "LBBB: broad notched R in lateral leads"],
      right: ["New-onset BBB may indicate acute MI", "LBBB may mask ST-segment changes of MI", "Hemifascicular blocks may precede complete BBB", "Alternating BBB pattern suggests severe conduction disease"]
    },
    medications: [
      { name: "No Specific BBB Medications", type: "Assessment-Based", action: "BBB itself is not treated with medications — management focuses on the underlying cause", sideEffects: "N/A", contra: "N/A", pearl: "RBBB may be incidental and benign. LBBB almost always indicates underlying structural heart disease and requires further workup. New LBBB in the setting of chest pain should be treated as a STEMI equivalent until proven otherwise." }
    ],
    pearls: ["RBBB = RSR' (rabbit ears) in V1 — often benign, may be incidental finding", "LBBB = broad notched R in lateral leads — often indicates structural heart disease", "LBBB may obscure MI diagnosis and must be interpreted with modified Sgarbossa criteria", "New LBBB with chest pain is treated as a STEMI equivalent", "Wide QRS with sinus rhythm = think bundle branch block", "BBB produces wide QRS but maintains normal sinus P waves and PR interval — this differentiates it from ventricular rhythms", "RBBB is common after pulmonary embolism due to right heart strain"],
    quiz: [
      { question: "The hallmark ECG finding of a bundle branch block is:", options: ["Prolonged PR interval", "QRS duration greater than 0.12 seconds with abnormal morphology", "Absent P waves", "Irregular R-R intervals"], correct: 1, rationale: "Bundle branch blocks produce wide QRS complexes (greater than 0.12 seconds) with abnormal morphology because ventricular depolarization does not follow the normal rapid conduction pathway." },
      { question: "RBBB is characterized by which pattern in lead V1?", options: ["Deep S wave", "RSR' (M-shaped) pattern", "Broad notched R wave", "Absent QRS"], correct: 1, rationale: "Right bundle branch block produces a characteristic RSR' (M-shaped or 'rabbit ears') pattern in lead V1, reflecting the delayed depolarization of the right ventricle." },
      { question: "A patient presents with new-onset LBBB and chest pain. The nurse should:", options: ["Document and continue monitoring", "Treat as a potential STEMI equivalent — activate cardiac catheterization team", "Administer adenosine", "Prepare for cardioversion"], correct: 1, rationale: "New LBBB in the setting of chest pain is treated as a STEMI equivalent because LBBB can mask the ST-segment changes of acute MI. Cardiac catheterization is indicated." }
    ]
  },

  "atrial-tachycardia": {
    title: "Atrial Tachycardia",
    cellular: { title: "Ectopic Atrial Focus", content: "Atrial tachycardia is a rapid atrial rhythm originating from an ectopic focus outside the SA node, typically 150-250 bpm. Unlike sinus tachycardia where the impulse originates from the SA node, atrial tachycardia arises from enhanced automaticity or re-entry circuits in atrial tissue. Because the focus is outside the SA node, the P waves appear abnormal in morphology (not the typical upright, rounded shape seen in lead II with sinus rhythm). The P:QRS ratio is usually 1:1 with narrow QRS complexes (less than 0.12 seconds) because ventricular conduction follows normal pathways once the impulse passes through the AV node. Common triggers include stimulants, structural heart disease, and electrolyte imbalances." },
    riskFactors: ["Stimulant use (caffeine, nicotine, amphetamines, cocaine)", "Structural heart disease", "Electrolyte imbalances (hypokalemia, hypomagnesemia)", "COPD and chronic lung disease", "Digoxin toxicity", "Alcohol use", "Hyperthyroidism", "Stress and anxiety", "Mitral valve disease", "Post-cardiac surgery"],
    diagnostics: ["ECG: rapid regular rhythm at 150-250 bpm", "P waves present but abnormal morphology (different shape from sinus P waves)", "P:QRS ratio usually 1:1", "PR interval may vary", "QRS narrow (less than 0.12 seconds)", "Regular rhythm (unlike atrial fibrillation which is irregularly irregular)", "Differs from sinus tachycardia: P waves are abnormal in shape and origin is not SA node", "Differs from atrial flutter: no sawtooth pattern", "Differs from SVT (AVNRT): P waves are usually visible in atrial tachycardia"],
    management: ["Stable: vagal maneuvers as first intervention", "Adenosine if re-entry mechanism suspected (may terminate or reveal underlying rhythm)", "Beta-blockers for rate control", "Calcium channel blockers (diltiazem, verapamil) for rate control", "Unstable: synchronized cardioversion", "Identify and treat underlying triggers", "Correct electrolyte imbalances", "Discontinue offending medications or substances", "Catheter ablation for recurrent or refractory cases"],
    nursingActions: ["Assess hemodynamic stability immediately", "Monitor heart rate and rhythm continuously", "Obtain 12-lead ECG to assess P wave morphology", "Differentiate from sinus tachycardia by examining P wave shape", "Administer medications as ordered", "Monitor for recurrence after treatment", "Assess for underlying triggers (stimulant use, medication review)", "Document rhythm strips with clear notation of P wave morphology", "Report new onset or change in pattern to provider"],
    signs: {
      left: ["Regular rapid rhythm at 150-250 bpm", "Palpitations and feeling of racing heart", "Anxiety", "Dyspnea", "P waves present but abnormal morphology", "Often stable but may require treatment"],
      right: ["Hypotension with altered mental status", "Syncope", "Chest pain from rate-related ischemia", "Heart failure exacerbation", "Hemodynamic instability requiring cardioversion"]
    },
    medications: [
      { name: "Adenosine", type: "Endogenous Nucleoside", action: "Transiently blocks AV node conduction; may terminate re-entrant atrial tachycardia or reveal underlying mechanism", sideEffects: "Brief asystole, flushing, chest tightness, dyspnea", contra: "Second/third degree heart block, sick sinus syndrome, asthma (relative)", pearl: "Adenosine may or may not terminate atrial tachycardia. If re-entry is the mechanism, it may convert. If enhanced automaticity, it may transiently slow the rate to reveal P wave morphology for diagnosis. Give 6 mg rapid IV push with flush." },
      { name: "Metoprolol", type: "Beta-Blocker", action: "Slows AV node conduction and reduces ventricular rate", sideEffects: "Hypotension, bradycardia, fatigue, bronchospasm", contra: "Decompensated heart failure, severe asthma, hypotension", pearl: "Beta-blockers are effective for rate control in atrial tachycardia. May also suppress the ectopic focus. Preferred in patients with coronary artery disease." },
      { name: "Diltiazem", type: "Calcium Channel Blocker", action: "Slows AV node conduction to reduce ventricular rate", sideEffects: "Hypotension, bradycardia, peripheral edema", contra: "Heart failure with reduced EF, WPW, hypotension", pearl: "Alternative to beta-blockers for rate control. Can give IV bolus for acute management." }
    ],
    pearls: ["Regular narrow tachycardia with abnormal P waves = think atrial tachycardia", "Wide + fast + regular = think VT; irregularly irregular = think AFib; regular narrow with abnormal P waves = think atrial tachycardia", "Key difference from sinus tachycardia: P waves are abnormal in shape and origin is not the SA node", "Atrial tachycardia may be associated with digoxin toxicity — check digoxin levels", "Can be difficult to distinguish from other SVTs — 12-lead ECG and adenosine response help differentiate", "Always assess patient stability first before choosing treatment approach"],
    quiz: [
      { question: "The key distinguishing feature of atrial tachycardia from sinus tachycardia is:", options: ["Heart rate above 150 bpm", "Abnormal P wave morphology with non-SA node origin", "Wide QRS complexes", "Irregular rhythm"], correct: 1, rationale: "Atrial tachycardia originates from an ectopic atrial focus, producing P waves with abnormal morphology unlike the upright, rounded P waves of sinus tachycardia. Rate alone does not differentiate them." },
      { question: "A patient presents with a regular narrow tachycardia at 180 bpm with abnormal P waves visible before each QRS. This rhythm is most likely:", options: ["Sinus tachycardia", "Atrial fibrillation", "Atrial tachycardia", "Ventricular tachycardia"], correct: 2, rationale: "Regular rhythm, narrow QRS, abnormal P waves visible before each QRS at a rapid rate is characteristic of atrial tachycardia. Sinus tachycardia would have normal P waves, AFib would be irregular, and VT would have wide QRS." },
      { question: "First-line treatment for a hemodynamically unstable patient in atrial tachycardia is:", options: ["Adenosine 6 mg rapid IV push", "Metoprolol 5 mg IV", "Synchronized cardioversion", "Vagal maneuvers"], correct: 2, rationale: "Hemodynamically unstable tachycardia of any type requires synchronized cardioversion. Medications and vagal maneuvers are for stable patients only." }
    ]
  },

  "asystole-pea": {
    title: "Asystole and Pulseless Electrical Activity",
    cellular: { title: "Non-Shockable Cardiac Arrest Rhythms", content: "Asystole represents the complete absence of electrical activity in the heart — a flat line on ECG. PEA is organized electrical activity on the monitor but with no pulse (the heart has electrical activity but no effective mechanical contraction). Both are non-shockable rhythms meaning defibrillation will NOT help. The treatment is high-quality CPR, epinephrine, and aggressive identification and treatment of reversible causes (H's and T's). PEA has a better prognosis than asystole because it usually has a treatable underlying cause. Asystole generally carries a very poor prognosis." },
    riskFactors: ["Prolonged cardiac arrest (V-fib degenerating to asystole)", "Massive myocardial infarction", "Severe hypoxia", "Severe acidosis", "Hypothermia (profound)", "The H's: Hypovolemia, Hypoxia, Hydrogen ion (acidosis), Hypo/Hyperkalemia, Hypothermia", "The T's: Tension pneumothorax, Tamponade (cardiac), Toxins, Thrombosis (pulmonary or coronary)", "Drug overdose"],
    diagnostics: ["Asystole: flat line on ECG — confirm in at least 2 leads (to rule out fine V-fib or lead disconnect)", "Check all connections and increase gain before confirming asystole", "PEA: organized rhythm on monitor (can look like any rhythm) but NO PULSE", "Point-of-care ultrasound: cardiac standstill (asystole) vs wall motion present (PEA with potentially treatable cause)", "Identify reversible causes: bedside echo, chest X-ray, blood gas, electrolytes, glucose, temperature"],
    management: ["Both are NON-SHOCKABLE — do NOT defibrillate", "High-quality CPR is the priority (rate 100-120/min, depth 2-2.4 inches, full recoil)", "Epinephrine 1 mg IV/IO as soon as possible, then every 3-5 minutes", "Aggressively search for and treat reversible causes (H's and T's)", "PEA: consider cause-specific interventions (needle decompression for tension pneumo, pericardiocentesis for tamponade, fluid bolus for hypovolemia)", "Advanced airway management", "Sodium bicarbonate if known severe acidosis or hyperkalemia", "Continue CPR for at least 20 minutes before considering termination"],
    nursingActions: ["Begin high-quality CPR immediately", "Confirm asystole in 2 leads (rule out fine V-fib and lead disconnect)", "For PEA: verify pulselessness (the monitor shows a rhythm but there is no pulse)", "Obtain IV/IO access", "Administer epinephrine as ordered", "Assist team in identifying reversible causes", "Prepare for advanced airway placement", "Monitor end-tidal CO2 (ETCO2) — indicates CPR quality and can signal ROSC (sudden rise in ETCO2)", "Document all interventions with exact times", "Prepare needle decompression equipment, pericardiocentesis tray if tamponade/pneumothorax suspected"],
    signs: {
      left: ["Asystole: flat line on monitor", "PEA: organized rhythm on monitor without pulse", "Unresponsive patient", "No spontaneous respirations (agonal gasps possible)"],
      right: ["Dilated, fixed pupils", "Cyanosis", "No obtainable blood pressure", "End-tidal CO2 less than 10 mmHg indicates poor perfusion"]
    },
    medications: [
      { name: "Epinephrine", type: "Sympathomimetic", action: "Vasoconstriction increases coronary and cerebral perfusion during CPR", sideEffects: "Not relevant in cardiac arrest", contra: "None in cardiac arrest", pearl: "1 mg IV/IO every 3-5 minutes throughout resuscitation. For non-shockable rhythms, give as EARLY as possible (evidence suggests earlier epinephrine improves outcomes in PEA/asystole more than in VF/VT). This is the ONLY drug routinely given in asystole/PEA." },
      { name: "Sodium Bicarbonate", type: "Alkalinizing Agent", action: "Buffers hydrogen ions in severe metabolic acidosis", sideEffects: "Metabolic alkalosis, hypernatremia, paradoxical intracellular acidosis", contra: "Routine use in arrest (only for specific indications)", pearl: "Only give for known or suspected hyperkalemia, severe pre-existing metabolic acidosis, or tricyclic antidepressant overdose. NOT recommended for routine use in cardiac arrest." },
      { name: "Calcium Chloride", type: "Electrolyte", action: "Antagonizes cardiac effects of hyperkalemia", sideEffects: "Bradycardia, tissue necrosis if extravasation", contra: "Hypercalcemia, digoxin toxicity", pearl: "Give for PEA/asystole caused by hyperkalemia, hypocalcemia, or calcium channel blocker overdose. 10% calcium chloride 10 mL IV over 2-5 min via central line preferred (3x more elemental calcium than calcium gluconate)." }
    ],
    pearls: ["Asystole and PEA are NON-SHOCKABLE. Defibrillation will not help and wastes time.", "PEA is the rhythm that FOOLS you — the monitor looks normal but the patient has no pulse. ALWAYS check a pulse.", "End-tidal CO2 (ETCO2) is the best indicator of CPR quality. Target greater than 10 mmHg. A sudden rise in ETCO2 during CPR may indicate return of spontaneous circulation.", "The most common cause of PEA is hypovolemia — consider massive fluid bolus", "Confirm asystole in 2 leads. Fine V-fib looks like asystole and IS shockable. A lead disconnect also shows a flat line.", "Atropine is NO LONGER recommended for asystole/PEA (removed from ACLS guidelines)"],
    quiz: [
      { question: "Which intervention is NOT appropriate for asystole?", options: ["Epinephrine 1 mg IV", "High-quality CPR", "Defibrillation", "Identify reversible causes"], correct: 2, rationale: "Asystole is a non-shockable rhythm. Defibrillation requires an electrical rhythm to reset — asystole has no electrical activity to reset. Treatment is CPR, epinephrine, and finding/treating reversible causes." },
      { question: "A patient on the monitor shows a normal-appearing sinus rhythm at 80 bpm, but has no pulse. This rhythm is called:", options: ["Sinus bradycardia", "Ventricular tachycardia", "Pulseless electrical activity (PEA)", "Normal sinus rhythm"], correct: 2, rationale: "PEA is defined as any organized electrical activity on the monitor in the absence of a palpable pulse. The monitor may show any rhythm, but the patient is in cardiac arrest." },
      { question: "The best indicator of CPR quality during a cardiac arrest is:", options: ["Blood pressure reading", "End-tidal CO2 (ETCO2)", "Pulse oximetry", "Heart rate on monitor"], correct: 1, rationale: "ETCO2 directly reflects cardiac output generated by CPR compressions. Target greater than 10 mmHg. A sudden rise may indicate ROSC. It is the most reliable real-time indicator of CPR quality." }
    ]
  },

  "sinus-dysrhythmia": {
    title: "Sinus Dysrhythmia (Sinus Arrhythmia)",
    cellular: {
      title: "Electrophysiology of Sinus Dysrhythmia",
      content: "Sinus dysrhythmia (also called sinus arrhythmia) is a sinus rhythm with irregular R-R intervals. The electrical impulse still originates from the sinoatrial (SA) node, so P wave morphology, PR interval, and QRS duration remain normal. The defining characteristic is variation in the R-R interval, most often linked to the respiratory cycle.\n\nDuring inspiration, intrathoracic pressure decreases, venous return to the right heart increases, and vagal tone decreases, causing a transient increase in heart rate. During expiration, the opposite occurs: vagal tone increases and heart rate slows. This cyclic variation in rate produces the irregular rhythm on the ECG strip.\n\nRespiratory sinus arrhythmia is a normal physiologic variant and is most prominent in young, healthy individuals. It reflects intact autonomic nervous system function and healthy vagal tone. The variation diminishes with age and may be absent in patients with autonomic dysfunction, heart failure, or diabetes.\n\nNon-respiratory sinus arrhythmia (not linked to breathing) is less common and may be associated with underlying cardiac disease, increased intracranial pressure, or medication effects. The key distinction between sinus dysrhythmia and other irregular rhythms (such as atrial fibrillation) is the presence of normal, upright, uniform P waves preceding each QRS complex."
    },
    riskFactors: [
      "Most common in young, healthy individuals and children",
      "Respiratory sinus arrhythmia is a normal physiologic variant",
      "Non-respiratory sinus arrhythmia may indicate underlying cardiac or neurological disease",
      "Absence of respiratory sinus arrhythmia in young patients may suggest autonomic dysfunction",
      "Diminishes with age as autonomic responsiveness decreases",
      "Enhanced vagal tone (athletes, well-conditioned individuals) increases respiratory variation",
      "Medications such as digoxin and morphine can accentuate sinus arrhythmia",
      "Usually requires no treatment and is considered benign"
    ],
    diagnostics: [
      "ECG shows sinus rhythm with variable R-R intervals",
      "P waves are upright, uniform, and precede each QRS complex",
      "PR interval is normal (0.12-0.20 seconds) and consistent",
      "QRS duration is normal (0.06-0.10 seconds)",
      "Heart rate typically within normal range (60-100 bpm) but varies cyclically",
      "Rate variation correlates with respiratory cycle in respiratory type",
      "Ask patient to hold breath: if rhythm becomes regular, respiratory sinus arrhythmia confirmed",
      "P:QRS ratio remains 1:1 throughout"
    ],
    management: [
      "Respiratory sinus arrhythmia requires no treatment",
      "Reassure patient that this is a normal physiologic variant",
      "Document the rhythm and note the cyclic variation",
      "Non-respiratory sinus arrhythmia may warrant further cardiac workup",
      "No medications are indicated for benign sinus arrhythmia",
      "Continue routine monitoring if patient is on telemetry"
    ],
    nursingActions: [
      "Apply systematic five-step rhythm analysis to confirm sinus origin",
      "Verify irregular R-R intervals with normal P wave morphology",
      "Correlate rhythm variation with respiratory cycle",
      "Document rhythm strip showing the variation",
      "Differentiate from atrial fibrillation: sinus arrhythmia has visible, uniform P waves",
      "Assess patient for symptoms (typically asymptomatic)",
      "Report non-respiratory sinus arrhythmia to the provider"
    ],
    quiz: [
      { question: "What is the defining characteristic of sinus dysrhythmia?", options: ["Absent P waves", "Wide QRS complexes", "Irregular R-R intervals with normal P waves", "Prolonged PR interval"], correct: 2, rationale: "Sinus dysrhythmia is defined by variable R-R intervals while all other components of the rhythm remain normal. P waves are upright and uniform (confirming SA node origin), PR interval is normal, and QRS is narrow. The irregularity is in the spacing between beats, often linked to the respiratory cycle." },
      { question: "A young athlete has an irregular rhythm on the monitor. P waves are upright and uniform, PR interval is 0.16 sec, QRS is 0.08 sec. The rate speeds up with inspiration and slows with expiration. This rhythm is:", options: ["Atrial fibrillation", "Sinus dysrhythmia", "Wandering atrial pacemaker", "Second-degree AV block"], correct: 1, rationale: "Normal P waves, normal PR interval, normal QRS, with rate variation linked to the respiratory cycle is classic respiratory sinus arrhythmia. Atrial fibrillation has no P waves. Wandering atrial pacemaker has varying P wave morphology. AV blocks have dropped beats or prolonged PR intervals." },
      { question: "How can the nurse confirm respiratory sinus arrhythmia at the bedside?", options: ["Administer adenosine", "Ask the patient to hold their breath", "Apply carotid massage", "Increase the IV fluid rate"], correct: 1, rationale: "If the rhythm becomes regular when the patient holds their breath, the variation is respiratory in origin, confirming respiratory sinus arrhythmia. This simple bedside maneuver eliminates the respiratory influence on vagal tone." }
    ],
    assessmentFindings: [
      "Irregular pulse that varies with respiration (faster on inspiration, slower on expiration)",
      "Heart rate typically 60-100 bpm with cyclic variation in rate",
      "Patient is usually asymptomatic with no hemodynamic compromise",
      "Auscultation reveals irregular rhythm with consistent S1 and S2 heart sounds",
      "ECG rhythm strip shows variable R-R intervals with uniform P wave morphology"
    ],
    medications: [
      { name: "No pharmacologic therapy indicated", type: "N/A", action: "Respiratory sinus arrhythmia is a benign physiologic variant requiring no pharmacological intervention", sideEffects: "N/A", contra: "N/A", pearl: "Respiratory sinus arrhythmia is a normal finding. No medications are needed. Reassure the patient and document the rhythm." }
    ],
    pearls: [
      "Respiratory sinus arrhythmia is a normal finding and does NOT require treatment — do not confuse with pathologic arrhythmias",
      "The breath-holding test is a quick bedside maneuver: if the rhythm regularizes when the patient holds their breath, it confirms respiratory origin",
      "Absence of sinus arrhythmia in young patients may actually indicate autonomic dysfunction and warrants further assessment",
      "Always verify P wave uniformity to distinguish from atrial fibrillation, which also presents with irregular R-R intervals but has NO identifiable P waves"
    ],
    signs: {
      left: ["Rate variation linked to respiration", "Normal P waves before each QRS", "PR interval 0.12-0.20 sec consistently", "Narrow QRS complex (< 0.12 sec)"],
      right: ["Irregular R-R intervals on ECG strip", "Rate increases with inspiration", "Rate decreases with expiration", "Rhythm regularizes with breath holding"]
    }
  },

  "sinus-arrest": {
    title: "Sinus Arrest (Sinus Pause)",
    cellular: {
      title: "Electrophysiology of Sinus Arrest",
      content: "Sinus arrest occurs when the sinoatrial (SA) node suddenly fails to generate an electrical impulse. This results in a pause in the cardiac rhythm with a missing P-QRS-T complex. The key electrophysiologic mechanism is a failure of impulse generation (automaticity failure) at the SA node level.\n\nDuring sinus arrest, the SA node temporarily ceases firing. No impulse is generated, so no P wave appears, and consequently no QRS or T wave follows. The pause that results is NOT an exact multiple of the underlying R-R interval. This timing characteristic is the critical differentiator between sinus arrest and sinus exit block.\n\nIn sinus arrest, the SA node's automaticity is disrupted. The pause length is unpredictable because the SA node must 'reset' before resuming firing. When the SA node recovers, it fires independently of its previous timing, creating a pause that does not correspond to a mathematical multiple of the baseline R-R interval.\n\nThe clinical significance depends on the duration and frequency of the pauses. Brief, infrequent pauses may be asymptomatic. Prolonged pauses (greater than 3 seconds) can cause presyncope, syncope, or hemodynamic instability. A pause exceeding 6 seconds constitutes a medical emergency. If the SA node fails to recover, a lower pacemaker (AV junction or ventricle) may produce an escape beat.\n\nCommon causes include: increased vagal tone, sick sinus syndrome, ischemia to the SA node (especially from right coronary artery occlusion), medications (beta blockers, calcium channel blockers, digoxin), hyperkalemia, and degenerative fibrosis of the SA node in elderly patients."
    },
    riskFactors: [
      "Sick sinus syndrome (SA node dysfunction)",
      "Increased vagal tone (carotid sinus hypersensitivity, vasovagal episodes)",
      "Inferior myocardial infarction (right coronary artery supplies SA node in 60% of patients)",
      "Medications: beta blockers, calcium channel blockers, digoxin, amiodarone",
      "Hyperkalemia",
      "Degenerative fibrosis of the SA node (aging)",
      "Post-cardiac surgery (damage to SA node)",
      "Hypothyroidism",
      "Sleep apnea (nocturnal vagal surges)"
    ],
    diagnostics: [
      "ECG shows underlying sinus rhythm with sudden absence of one or more P-QRS-T complexes",
      "Pause is NOT an exact multiple of the underlying R-R interval",
      "When rhythm resumes, P wave morphology remains normal (SA node recovers)",
      "Measure pause duration: count small boxes and multiply by 0.04 seconds",
      "Escape beats may appear during prolonged pauses (junctional or ventricular)",
      "Compare pause duration to baseline R-R interval to differentiate from sinus exit block",
      "Underlying rhythm (when present) shows normal sinus characteristics",
      "Holter monitoring may be needed to capture intermittent episodes"
    ],
    management: [
      "Brief asymptomatic pauses: monitor and identify underlying cause",
      "Review and potentially discontinue offending medications",
      "Treat underlying cause (electrolyte correction, thyroid replacement)",
      "Symptomatic pauses: prepare for temporary or permanent pacemaker placement",
      "Pause greater than 6 seconds: medical emergency requiring immediate intervention",
      "Atropine 0.5 mg IV may be used for acute symptomatic episodes",
      "Transcutaneous pacing for hemodynamic instability",
      "Permanent pacemaker indicated for recurrent symptomatic sinus arrest"
    ],
    nursingActions: [
      "Monitor continuously on telemetry for pause detection",
      "Set alarm parameters to detect pauses greater than 3 seconds",
      "Document pause duration and frequency on rhythm strips",
      "Assess for symptoms during pauses: dizziness, syncope, altered LOC",
      "Have emergency pacing equipment readily available",
      "Monitor medication effects on SA node function",
      "Report any pause exceeding 3 seconds to the provider immediately",
      "Differentiate from sinus exit block by measuring pause against baseline R-R interval"
    ],
    quiz: [
      { question: "The key ECG feature that differentiates sinus arrest from sinus exit block is:", options: ["P wave morphology", "QRS width", "Whether the pause is an exact multiple of the underlying R-R interval", "PR interval duration"], correct: 2, rationale: "In sinus arrest, the pause is NOT an exact multiple of the underlying R-R interval because the SA node fails to fire and must reset before resuming. In sinus exit block, the impulse is generated but blocked from exiting, so the pause IS an exact multiple of the baseline R-R interval." },
      { question: "A patient on telemetry suddenly has a 4.8-second pause with no P-QRS-T complexes visible. The pause is not a multiple of the previous R-R intervals. The patient reports feeling lightheaded. The nurse should:", options: ["Continue monitoring and document", "Administer adenosine", "Notify the provider immediately and prepare for pacing", "Increase the IV rate"], correct: 2, rationale: "A 4.8-second symptomatic pause with characteristics of sinus arrest (not a multiple of baseline R-R) requires immediate intervention. The provider must be notified, and pacing equipment should be prepared. Pauses greater than 3 seconds with symptoms are clinically significant." },
      { question: "Which medication is most appropriate for acute symptomatic sinus arrest?", options: ["Adenosine", "Atropine", "Amiodarone", "Diltiazem"], correct: 1, rationale: "Atropine 0.5 mg IV increases SA node automaticity by blocking vagal (parasympathetic) input. Adenosine slows conduction and would worsen the condition. Amiodarone and diltiazem both suppress SA node function and are contraindicated." }
    ],
    assessmentFindings: [
      "Sudden absence of pulse during pause episodes with possible near-syncope or syncope",
      "Irregular rhythm on telemetry with intermittent pauses where P-QRS-T complexes are absent",
      "Patient may report dizziness, lightheadedness, or sensation of the heart stopping",
      "Hemodynamic instability during prolonged pauses (hypotension, altered mental status)",
      "Escape beats (junctional or ventricular) may appear during extended pauses"
    ],
    medications: [
      { name: "Atropine", type: "Anticholinergic", action: "Blocks vagal (parasympathetic) stimulation of the SA node, increasing heart rate and restoring automaticity", sideEffects: "Tachycardia, dry mouth, urinary retention, blurred vision", contra: "Glaucoma, myasthenia gravis; doses less than 0.5 mg may cause paradoxical bradycardia", pearl: "First-line for symptomatic sinus arrest. Give 0.5 mg IV push every 3-5 minutes to a maximum of 3 mg. Monitor heart rate response closely." },
      { name: "Isoproterenol", type: "Sympathomimetic (Beta-agonist)", action: "Stimulates beta-1 and beta-2 receptors increasing heart rate and contractility as a temporizing measure", sideEffects: "Tachycardia, tremor, palpitations, hypotension, myocardial ischemia", contra: "Tachyarrhythmias, coronary artery disease (use with caution)", pearl: "Used as a bridge therapy for symptomatic sinus arrest unresponsive to atropine while awaiting pacemaker placement. Titrate to heart rate response and monitor for ischemia." }
    ],
    pearls: [
      "The pause in sinus arrest is NOT an exact multiple of the baseline R-R interval — this is the key differentiator from sinus exit block",
      "Any pause greater than 3 seconds is clinically significant and must be reported immediately",
      "A pause exceeding 6 seconds is a medical emergency — prepare for transcutaneous pacing",
      "Always review the medication list: beta blockers, calcium channel blockers, and digoxin are common culprits",
      "Inferior MI can cause sinus arrest because the right coronary artery supplies the SA node in approximately 60% of patients"
    ],
    signs: {
      left: ["Sudden absence of P-QRS-T complex on ECG", "Pause is NOT a multiple of baseline R-R", "Normal sinus rhythm between pauses", "Possible junctional or ventricular escape beats"],
      right: ["Dizziness or syncope during prolonged pauses", "Hypotension with extended pauses", "Pulse deficit during pause episodes", "May have associated symptoms of underlying cause (e.g., digoxin toxicity)"]
    }
  },

  "sinus-exit-block": {
    title: "Sinus Exit Block (SA Exit Block)",
    cellular: {
      title: "Electrophysiology of Sinus Exit Block",
      content: "Sinus exit block (SA exit block) occurs when the sinoatrial node generates an impulse normally, but the impulse fails to exit the SA node and conduct to the surrounding atrial tissue. The key distinction from sinus arrest is the mechanism: in sinus arrest, the SA node fails to fire; in sinus exit block, the SA node fires but the impulse is blocked at the SA-atrial junction.\n\nBecause the SA node continues to fire at its regular rate (the pacemaker function is intact), the resulting pause on the ECG is an exact multiple of the underlying R-R interval. This is the critical diagnostic criterion. If the baseline R-R interval is 0.80 seconds (75 bpm), a sinus exit block pause would measure exactly 1.60 seconds (2x), 2.40 seconds (3x), or another exact multiple.\n\nThe block occurs in the perinodal tissue surrounding the SA node. There are three degrees of SA exit block, analogous to AV blocks:\n\nFirst-degree SA exit block: all impulses conduct but with delay. This cannot be detected on a standard ECG because SA node depolarization is not visible on the surface ECG. It requires invasive electrophysiology studies.\n\nSecond-degree SA exit block (Type I - Wenckebach): progressive shortening of the P-P interval before a dropped beat. The P-P interval gradually shortens, then a complete P-QRS-T complex is missing.\n\nSecond-degree SA exit block (Type II): sudden dropped P-QRS-T complex without preceding P-P interval changes. The pause is an exact multiple of the baseline P-P interval.\n\nThird-degree SA exit block: no impulses exit the SA node. Clinically indistinguishable from sinus arrest on surface ECG.\n\nCommon causes include: digitalis toxicity, excessive vagal tone, myocarditis, acute inferior MI, hyperkalemia, and antiarrhythmic medications. Treatment is similar to sinus arrest and depends on symptoms and hemodynamic stability."
    },
    riskFactors: [
      "Digitalis (digoxin) toxicity - classic cause of SA exit block",
      "Excessive vagal stimulation",
      "Acute inferior myocardial infarction",
      "Myocarditis or pericarditis",
      "Hyperkalemia",
      "Antiarrhythmic medications (quinidine, procainamide, flecainide)",
      "Beta blockers and calcium channel blockers",
      "Degenerative conduction system disease",
      "Rheumatic heart disease"
    ],
    diagnostics: [
      "ECG shows sudden absence of P-QRS-T complex during otherwise normal sinus rhythm",
      "Pause IS an exact multiple of the underlying R-R interval (critical diagnostic feature)",
      "Underlying rhythm shows normal sinus characteristics when conducting",
      "P wave morphology remains consistent (SA node is firing normally)",
      "Type I (Wenckebach): progressive shortening of P-P intervals before dropped beat",
      "Type II: sudden dropped beat with constant P-P intervals before and after pause",
      "Compare measured pause to exact multiples of baseline P-P interval",
      "First-degree SA exit block cannot be diagnosed on surface ECG"
    ],
    management: [
      "Identify and treat underlying cause (medication review, electrolyte correction)",
      "Discontinue or reduce dose of offending medications (digoxin, beta blockers)",
      "Monitor digoxin levels if digitalis toxicity suspected",
      "Correct hyperkalemia if present",
      "Asymptomatic: monitor and address reversible causes",
      "Symptomatic: atropine 0.5 mg IV for acute episodes",
      "Recurrent symptomatic episodes may require permanent pacemaker",
      "Treat underlying myocardial ischemia if present"
    ],
    nursingActions: [
      "Apply five-step rhythm analysis and note the pause pattern",
      "Measure the pause precisely and compare to multiples of the baseline R-R interval",
      "Document whether the pause is an exact multiple (exit block) or not (sinus arrest)",
      "Check medication list for SA node-suppressing drugs",
      "Monitor digoxin levels and report signs of toxicity",
      "Assess for symptoms during pauses (dizziness, near-syncope, syncope)",
      "Report pauses to the provider with measured pause duration and baseline R-R",
      "Have atropine and pacing equipment available for symptomatic patients"
    ],
    signs: {
      left: [
        "Sinus Arrest: SA node fails to fire, pause is NOT an exact multiple of R-R",
        "Sinus arrest pause duration is unpredictable",
        "SA node must 'reset' before resuming, creating an irregular return",
        "Mechanism: failure of impulse GENERATION"
      ],
      right: [
        "Sinus Exit Block: SA node fires but impulse is blocked, pause IS an exact multiple of R-R",
        "Exit block pause is mathematically predictable",
        "SA node continues firing at its intrinsic rate during the block",
        "Mechanism: failure of impulse CONDUCTION from SA node to atrium"
      ]
    },
    quiz: [
      { question: "A patient's baseline R-R interval measures 0.80 seconds. A pause on the rhythm strip measures exactly 1.60 seconds. This pattern is consistent with:", options: ["Sinus arrest", "Sinus exit block", "Atrial fibrillation", "AV dissociation"], correct: 1, rationale: "A pause that is an exact multiple of the baseline R-R interval (1.60 = 2 x 0.80) indicates sinus exit block. The SA node continues firing at its regular rate, but one impulse failed to exit and conduct to the atria. In sinus arrest, the pause would NOT be an exact multiple because the SA node stops firing and must reset." },
      { question: "Which medication is a classic cause of sinus exit block?", options: ["Epinephrine", "Atropine", "Digoxin", "Dopamine"], correct: 2, rationale: "Digoxin (digitalis) toxicity is a classic cause of SA exit block. Digoxin enhances vagal tone and can depress SA node conduction. When SA exit block is identified, the nurse should check the digoxin level immediately. Atropine and dopamine increase SA node activity. Epinephrine is a sympathomimetic." },
      { question: "The fundamental difference between sinus arrest and sinus exit block is:", options: ["P wave morphology", "QRS width", "Whether the impulse fails to generate vs fails to conduct", "Heart rate"], correct: 2, rationale: "Sinus arrest = failure of impulse generation (SA node does not fire). Sinus exit block = failure of impulse conduction (SA node fires but the impulse is blocked from reaching the atria). This difference is reflected in the pause timing: sinus arrest pauses are not exact multiples of R-R; exit block pauses are exact multiples." }
    ]
  },

  "aivr-idioventricular": {
    title: "AIVR & Idioventricular Rhythm",
    cellular: {
      title: "Electrophysiology of Ventricular Escape",
      content: "Idioventricular rhythm (IVR) and accelerated idioventricular rhythm (AIVR) are ventricular rhythms that originate from pacemaker cells within the ventricles (Purkinje fibers or ventricular myocardium). These rhythms represent the ventricles' inherent backup pacemaker capability.\n\nThe cardiac conduction system has a hierarchy of pacemakers: SA node (60-100 bpm), AV junction (40-60 bpm), and ventricular pacemakers (20-40 bpm). When higher pacemakers fail or their rate falls below the ventricular escape rate, the ventricles assume pacemaker function, producing an idioventricular rhythm.\n\nIdioventricular Rhythm (IVR): Rate 20-40 bpm. This is the intrinsic firing rate of ventricular pacemaker cells. It occurs when both the SA node and AV junction fail to generate or conduct impulses. IVR is a ventricular escape rhythm and represents the heart's last resort for maintaining any cardiac output. The slow rate typically results in significantly reduced cardiac output.\n\nAccelerated Idioventricular Rhythm (AIVR): Rate 40-100 bpm. AIVR occurs when ventricular automaticity increases beyond the normal intrinsic rate but does not reach the threshold for ventricular tachycardia (100+ bpm). AIVR is commonly seen as a reperfusion arrhythmia following successful thrombolytic therapy or PCI for myocardial infarction. It is generally considered a benign, self-limiting rhythm.\n\nBoth rhythms share these ECG characteristics: wide QRS complexes (greater than 0.12 seconds) because depolarization does not follow normal conduction pathways, regular rhythm, and absent or dissociated P waves. The key differentiator between IVR and AIVR is the rate. The key differentiator between AIVR and ventricular tachycardia is also the rate: AIVR stays below 100 bpm while VT is 100 bpm or greater."
    },
    riskFactors: [
      "Myocardial infarction (especially during reperfusion - AIVR is a reperfusion marker)",
      "Digitalis toxicity",
      "Complete heart block (IVR as escape rhythm)",
      "Cardiomyopathy",
      "Myocarditis",
      "Post-cardiac surgery",
      "Electrolyte imbalances (hyperkalemia)",
      "Excessive vagal tone suppressing higher pacemakers",
      "Sick sinus syndrome with failure of junctional escape"
    ],
    diagnostics: [
      "IVR: Wide QRS, regular rhythm, rate 20-40 bpm, absent or dissociated P waves",
      "AIVR: Wide QRS, regular rhythm, rate 40-100 bpm, absent or dissociated P waves",
      "QRS duration greater than 0.12 seconds (wide complex) in both rhythms",
      "No preceding P waves or P waves unrelated to QRS complexes",
      "Rhythm is regular (unlike polymorphic VT)",
      "AIVR commonly appears during reperfusion after thrombolytics or PCI",
      "IVR may show fusion beats or capture beats intermittently",
      "Differentiate from VT by rate: AIVR less than 100 bpm, VT 100 bpm or greater"
    ],
    management: [
      "AIVR: Usually self-limiting and benign, typically requires monitoring only",
      "AIVR: Do NOT suppress with antiarrhythmics (it may be the patient's only rhythm)",
      "AIVR: Often resolves spontaneously as sinus rhythm resumes",
      "IVR: Identify and treat underlying cause (complete heart block, SA node failure)",
      "IVR: May require temporary or permanent pacing due to very slow rate",
      "IVR: Atropine may help if vagally mediated",
      "Both: Assess hemodynamic stability and treat the patient, not the monitor",
      "Both: Ensure higher pacemaker recovery (address underlying conduction failure)"
    ],
    nursingActions: [
      "Identify the rhythm correctly: wide QRS + regular + rate below 100 = AIVR or IVR",
      "Differentiate from VT by confirming rate is below 100 bpm",
      "Monitor hemodynamic status closely (BP, perfusion, LOC)",
      "Document rhythm and correlate with clinical context (post-MI, medication effects)",
      "For AIVR post-reperfusion: reassure that it is typically benign and self-limiting",
      "For IVR: have pacing equipment at bedside, prepare atropine",
      "Do NOT administer lidocaine or amiodarone for AIVR (suppressing the escape rhythm can cause asystole)",
      "Report transition to VT (rate exceeds 100 bpm) or hemodynamic deterioration immediately"
    ],
    signs: {
      left: [
        "Idioventricular Rhythm (IVR): Rate 20-40 bpm, wide QRS, regular",
        "Represents ventricular escape when higher pacemakers fail",
        "Hemodynamically significant: low cardiac output expected",
        "May require pacing or pharmacologic support"
      ],
      right: [
        "AIVR: Rate 40-100 bpm, wide QRS, regular",
        "Often a reperfusion arrhythmia (sign of successful treatment)",
        "Usually hemodynamically stable and self-limiting",
        "Do NOT suppress: may be the patient's only effective rhythm"
      ]
    },
    quiz: [
      { question: "A patient who just received thrombolytics for an acute MI develops a wide-complex regular rhythm at 72 bpm with no visible P waves. This rhythm is most likely:", options: ["Ventricular tachycardia", "Accelerated idioventricular rhythm", "Idioventricular rhythm", "Bundle branch block"], correct: 1, rationale: "AIVR (rate 40-100 bpm) commonly appears as a reperfusion arrhythmia after successful thrombolytic therapy. The wide QRS and absent P waves confirm ventricular origin. The rate of 72 is too fast for IVR (20-40) and too slow for VT (100+). It is generally benign and self-limiting." },
      { question: "Why is it dangerous to administer antiarrhythmic drugs (e.g., lidocaine) for AIVR?", options: ["They cause hypertension", "AIVR may be the patient's only effective rhythm and suppressing it can cause asystole", "Antiarrhythmics increase the heart rate", "AIVR always converts to sinus rhythm on its own"], correct: 1, rationale: "AIVR may be functioning as the patient's primary pacemaker rhythm when higher pacemakers (SA node, AV junction) have failed or are suppressed. Administering antiarrhythmics would suppress this ventricular escape rhythm, potentially leaving no pacemaker and causing asystole." },
      { question: "What rate range differentiates idioventricular rhythm from AIVR?", options: ["IVR: 60-100 bpm, AIVR: 100-150 bpm", "IVR: 20-40 bpm, AIVR: 40-100 bpm", "IVR: 40-60 bpm, AIVR: 60-100 bpm", "IVR: less than 20 bpm, AIVR: 20-60 bpm"], correct: 1, rationale: "Idioventricular rhythm fires at the intrinsic ventricular pacemaker rate of 20-40 bpm. AIVR is 'accelerated' beyond the normal ventricular rate but remains below 100 bpm (40-100 bpm). At 100 bpm or above, the rhythm is classified as ventricular tachycardia." }
    ]
  }
};
